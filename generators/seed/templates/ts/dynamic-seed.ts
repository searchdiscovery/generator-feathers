/* eslint-disable no-console */
import moment from 'moment';
import path from 'path';
import { uniqBy } from 'lodash';
import app from '../../app';
import logger from '../../logger';
import { Application } from '../../declarations';
import { importFromCSV } from '../../lib/data';
import { upsertSeed, deleteAndRestoreRecords } from '../support/helpers';

interface App extends Application {
  _isSetup: boolean;
}

export default {
  up: async (queryInterface: any, Sequelize: any): Promise<any> => {
    if (!(app as App)?._isSetup) {
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

    
    try {
      // Restore records that were deleted, and will be recreated, and delete records that don't belong
      // 4th parameter "matchFields" is an array of fields that provide uniqueness to the record in the table
      await deleteAndRestoreRecords(existingRecords, dataValues, model, ['name']);

      // Upsert to <%= tableName %>
      return upsertSeed(sequelize, '<%= tableName %>', dataValues);
    } catch (e) {
      logger.error('Error importing <%= tableName %>');
    }
  },
};
