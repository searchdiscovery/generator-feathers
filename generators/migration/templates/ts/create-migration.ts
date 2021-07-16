import { DataTypes, QueryInterface, Sequelize, Transaction } from 'sequelize';
import logger from '../../logger';

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.sequelize.transaction(async () => {

      const { error } = await 
        queryInterface.createTable(
          '<%= tableName %>',
          {
            id: {
              type: DataTypes.UUID,
              allowNull: false,
              primaryKey: true,
              defaultValue: Sequelize.literal('uuid_generate_v4()'),
            },
            name: {
              type: DataTypes.STRING,
              allowNull: false,
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            deletedAt: DataTypes.DATE,
          }
        ).catch(error => {
          logger.error(
            'Issue with adding `<%= tableName %>` table',
            error,
          );
  
          throw new Error('Table create migration failed!');
        });

      return true;
    });
  },
    

  down: async (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.sequelize.transaction(async (transaction: Transaction) => {
      // drop table
      await queryInterface.dropTable('<%= tableName %>', { transaction });
    }),
};
