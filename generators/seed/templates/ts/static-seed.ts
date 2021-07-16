import moment from 'moment';
import app from '../../app';
import { Application } from '../../declarations';
import { getUuid } from '../../lib/data';
import { dateFormat, upsertSeed } from '../support/helpers';

export default {
  up: async (): Promise<void> => {
    if (!(app as Application)?._isSetup) {
      app.setup();
    }

    const sequelize = app.get('sequelizeClient');

    await app.get('sequelizeSync');

    const data = [
      // Add data or data import here. It must contain the id field in order for upsert to work.
      {
        id: getUuid('1'),
        name: 'YOUR DATA OBJECTS GO HERE',
        description: 'SOME DESCRIPTION',
        updatedAt: moment.utc().format(dateFormat),
        createdAt: moment.utc().format(dateFormat),
        deletedAt: null,
      },
    ];

    // Upsert <%= tableName %>
    await upsertSeed(sequelize, '<%= tableName %>', data);
  },
};
