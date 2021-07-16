import moment from 'moment';
import path from 'path';
import { uniqBy, differenceBy } from 'lodash';
import { Op } from 'sequelize';
import app from '../../app';
import { Application } from '../../declarations';
import { importFromCSV } from '../../lib/data';
import logger from '../../logger';
import {
  upsertSeed,
  deleteAndRestoreRecords,
  getStats,
  reconcileStats,
  fetchAllRecords,
  getRecordByField,
  dateFormat,
} from '../support/helpers';

export default {
  up: async (): Promise<boolean> => {
    if (!(app as Application)?._isSetup) {
      app.setup();
    }

    const sequelize = app.get('sequelizeClient');
    await app.get('sequelizeSync');

    //
    // Import CSV Data
    //

    const importedCsvData = await importFromCSV(
      path.join(__dirname, '..', 'data', 'CSV_FILENAME.csv'),
      1,
    );

    //
    // Agency and Org setup
    //

    const agencyRecords = await fetchAllRecords('agency', true);
    const organizationRecords = await fetchAllRecords('organization', true);

    //
    // Get Existing Records
    //

    const model = sequelize.models.<%= tableName %>;

    const whereClause = {
      propertyId: { [Op.is]: null },
      uniqueId: { [Op.not]: null },
    };

    const existingRecords = await model.findAll({
      where: whereClause,
      raw: true,
      paranoid: false,
    });

    //
    // Normalize CSV data
    //

    const allCsvData = uniqBy(
      importedCsvData
        .map(item => ({
          name: item['NAME'],
          description: item['DESCRIPTION'],
          organizationId:
          getRecordByField(
            organizationRecords,
            item.Organization,
            'organization',
          )?.id || null,
          agencyId:
            getRecordByField(agencyRecords, item.Agency, 'agency')?.id || null,
          uniqueId: item['Unique Id'],
        }))
        .sort((a, b) => (a.name > b.name ? 1 : -1)),
      (rec: any) => rec.name,
    );
    // Get the global objects
    const globalObjects = allCsvData.filter(
      item => item.agencyId === null && item.organizationId === null,
    );
    // Combine global objects with all agency and org data that does not match a global object
    const finalCsvObjects = uniqBy(
      [
        ...globalObjects,
        ...allCsvData.filter(
          item =>
            item.agencyId !== null ||
            (item.organizationId !== null &&
              !globalObjects.some(globalObj => globalObj.name === item.name)),
        ),
      ],
      'name',
    );

    //
    // VALIDATION: If uniqueId does not exist or has duplicates, throw error
    //

    const missingUniqueId = finalCsvObjects.filter(
      item => item.uniqueId === null,
    );
    if (missingUniqueId.length)
      throw new Error(
        `There are missing uniqueIds for <%= tableName %>: ${missingUniqueId.map(
          missing => missing.name,
        )}`,
      );

    const deduped = [];
    const duplicates = [];

    // Find duplicate records by uniqueId
    finalCsvObjects.forEach(sortedItem => {
      if (!deduped.some(item => item.uniqueId === sortedItem.uniqueId)) {
        deduped.push(sortedItem);
      } else {
        duplicates.push(sortedItem);
      }
    });
    if (duplicates.length)
      throw new Error(
        `There are duplicate uniqueIds for <%= tableName %>: ${duplicates.map(
          dup => dup.name,
        )}`,
      );

    //
    // Method to seed the database
    //

    const seedSegmentedData = async csvData => {
      // Add the date fields and the id field (check for a matching existing record by uniqueId)
      const dataValues = csvData.map((row: any) => {
        const existingRecord = existingRecords.find(
          item => item.uniqueId === row.uniqueId,
        );
        const newRow = {
          id: existingRecord?.id || 'DEFAULT',
          ...row,
          createdAt: existingRecord
            ? moment(existingRecord?.createdAt)
                .utc()
                .format(dateFormat)
            : moment.utc().format(dateFormat),
          updatedAt: moment.utc().format(dateFormat),
          deletedAt: null,
        };
        return newRow;
      });

      // Upsert <%= tableName %>
      const beforeStats = await getStats(model, whereClause);
      // Restore records that were deleted, and will be recreated (no longer deletes)
      const restoreCount = await deleteAndRestoreRecords(
        existingRecords,
        dataValues,
        model,
        ['uniqueId', 'organizationId', 'agencyId'],
      );
      const dataValuesToAdd = differenceBy(
        dataValues,
        existingRecords,
        (val: any) => `${val.uniqueId}:${val.organizationId}:${val.agencyId}`,
      );
      // Upsert records - Add only, no updates
      await upsertSeed(sequelize, '<%= tableName %>', dataValues);

      logger.info(
        `To be Updated: ${dataValues.length - dataValuesToAdd.length}`,
      );

      const afterStats = await getStats(model, whereClause);
      return reconcileStats(
        beforeStats,
        afterStats,
        dataValuesToAdd,
        restoreCount,
        '<%= tableName %>',
      );
    };
    return seedSegmentedData(finalCsvObjects);
    
  },
};
