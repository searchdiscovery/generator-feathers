/* eslint-disable no-console */
import moment from 'moment';
import app from '../../app';
import logger from '../../logger';
import { Application } from '../../declarations';
import { upsertSeed } from '../support/helpers';

interface App extends Application {
  _isSetup: boolean;
}

export default {
  up: async (queryInterface: any): Promise<any> => {
    if (!(app as App)?._isSetup) {
      app.setup();
    }

    const sequelize = app.get('sequelizeClient');

    await app.get('sequelizeSync');

    const data = [
      // Add data or data import here. It must contain the id field in order for upsert to work.
      {
        id: 1,
        name: 'YOUR DATA OBJECTS GO HERE',
        description: 'SOME DESCRIPTION',
        updatedAt: moment.utc().format('YYYY-MM-DD HH:mm:ss.SSS +00:00'),
        createdAt: moment.utc().format('YYYY-MM-DD HH:mm:ss.SSS +00:00'),
        deletedAt: moment.utc().format('YYYY-MM-DD HH:mm:ss.SSS +00:00'),
      },
    ];

    // Upsert <%= tableName %>
    try {
      return upsertSeed(sequelize, '<%= tableName %>', data);
    } catch (e) {
      logger.error('Error importing <%= tableName %>');
    }
  },
};
