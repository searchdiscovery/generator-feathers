/* eslint-disable no-console */
import moment from 'moment';
import { QueryInterface } from 'sequelize';
import app from '../../app';
import logger from '../../logger';
import { Application } from '../../declarations';
import { upsertSeed } from '../support/helpers';

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    if (!(app as Application)?._isSetup) {
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
    await upsertSeed(sequelize, '<%= tableName %>', data);
  },
};
