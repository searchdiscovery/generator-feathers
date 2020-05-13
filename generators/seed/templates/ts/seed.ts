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
    const model = sequelize.models.<%= tableName %>;

    await app.get('sequelizeSync');

    const data = [
      // Add data or data import here. It must contain the id field in order for upsert to work.
    ];

    // Upsert <%= tableName %>
    try {
      await model.bulkCreate(data, {
        // add fields to be updated here
        updateOnDuplicate: Object.keys(model.rawAttributes).filter(
          attribute => !['id', 'createdAt'].includes(attribute),
        ),
      });
    } catch (e) {
      logger.error('Error importing <%= tableName %>');
    }
  },
};
