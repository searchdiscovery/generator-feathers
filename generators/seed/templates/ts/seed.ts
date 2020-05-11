import app from '../../app';
import logger from '../../logger';
import { Application } from '../../declarations';

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
    ];

    // Upsert <%= tableName %>
    try {
      await sequelize.models.<%= tableName %>.bulkCreate(data, {
        // add fields to be updated here
        updateOnDuplicate: ['updatedAt'],
      });
    } catch (e) {
      console.log(e);
      logger.error('Error importing <%= tableName %>');
    }
  },
};
