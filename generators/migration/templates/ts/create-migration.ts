/* eslint-disable no-console */
import { QueryInterface, Transaction, DataTypes } from 'sequelize';
import to from 'a-promise-wrapper';

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.sequelize.transaction(async () => {

      const { error } = await to(
        queryInterface.createTable(
          '<%= tableName %>',
          {
            id: {
              type: DataTypes.BIGINT,
              allowNull: false,
              primaryKey: true,
              autoIncrement: true,
            },
            name: {
              type: DataTypes.STRING,
              allowNull: false,
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
            deletedAt: DataTypes.DATE,
          }
        )
      );

      if (error) {
        console.error(
          'Issue with adding `<%= tableName %>` table',
          error,
        );

        throw new Error('Table create migration failed!');
      }
      return true;
    });
  },
    

  down: async (queryInterface: QueryInterface): Promise<void> =>
    queryInterface.sequelize.transaction(async (transaction: Transaction) => {
      // drop table
      await queryInterface.dropTable('<%= tableName %>', { transaction });
    }),
};
