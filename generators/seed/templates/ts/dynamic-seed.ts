/* eslint-disable no-console */
import moment from 'moment';
import path from 'path';
import { uniqBy, differenceBy } from 'lodash';
import { QueryInterface } from 'sequelize';
import app from '../../app';
import logger from '../../logger';
import { Application } from '../../declarations';
import { importFromCSV } from '../../lib/data';
import {
  upsertSeed,
  deleteAndRestoreRecords,
  getStats,
  reconcileStats,
} from '../support/helpers';

export default {
  up: async (queryInterface: QueryInterface): Promise<boolean> => {
    if (!(app as Application)?._isSetup) {
      app.setup();
    }

    const sequelize = app.get('sequelizeClient');
    const model = sequelize.models.<%= tableName %>;

    await app.get('sequelizeSync');

    // Import <%= tableName %> csv records
    const importedCsvData = await importFromCSV(
      path.join(__dirname, '..', 'data', 'CSV_FILENAME.csv'),
      1,
    );

    const existingRecords = await model.findAll({
      raw: true,
      paranoid: false,
    });

    // Get unique records from the csv data and normalize the field names
    const csvData = uniqBy(
      importedCsvData
        .map(item => ({
          name: item['NAME'],
          description: item['DESCRIPTION']
        }))
        .sort((a, b) => (a.name > b.name ? 1 : -1)),
      (rec: any) => rec.name,
    );

    // Find any join IDs from other tables, get previous IDs from the existing records, add add default fields to each row
    const dataValues = csvData.map((row: any) => {
      const rowId = existingRecords.find(exItem => exItem.name === row.name)?.id;
      const newRow = {
        id: rowId || null,
        ...row,
        createdAt: moment.utc().format('YYYY-MM-DD HH:mm:ss.SSS +00:00'),
        updatedAt: moment.utc().format('YYYY-MM-DD HH:mm:ss.SSS +00:00'),
        deletedAt: moment.utc().format('YYYY-MM-DD HH:mm:ss.SSS +00:00'),
      };
      return newRow;
    });

    // The 2nd parameter is a "where clause" object that should be used to filter the target table to only the records that may be modified. If null, no filter is used, if left empty, a query of {propertyId: null, and organizationId: null} is used. This can be catered to a model by passing a specific where clause in.
    const beforeStats = await getStats(model, null);
    // Restore records that were deleted, and will be recreated (no longer deletes)
    // 4th parameter "matchFields" is an array of fields that when combined provide uniqueness to the record in the table which is used to look for previous records that may have been previously deleted - this should be changed to meet the specific table's requirements!
    const restoreCount = await deleteAndRestoreRecords(
      existingRecords,
      dataValues,
      model,
      ['name', 'code'],
    );
    const dataValuesToAdd = differenceBy(
      dataValues,
      existingRecords,
      // This should be updated to match the fields used for deleteAndRestoreRecords
      (val: any) => `${val.name}:${val.code}`,
    );
    // Upsert records
    await upsertSeed(
      sequelize,
      '<%= tableName %>',
      dataValues,
    );
    // The 2nd parameter is a "where clause" object that should be used to filter the target table to only the records that may be modified. If null, no filter is used, if left empty, a query of {propertyId: null, and organizationId: null} is used. This can be catered to a model by passing a specific where clause in.
    const afterStats = await getStats(model, null);
    return reconcileStats(
      beforeStats,
      afterStats,
      dataValuesToAdd,
      restoreCount,
    );
  },
};
