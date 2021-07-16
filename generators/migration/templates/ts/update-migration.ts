import { QueryInterface, Transaction, DataTypes } from 'sequelize';
import logger from '../../logger';

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {

    // Make first update
    await queryInterface.sequelize.transaction(async (transaction: Transaction) => {
      // This is just an example, please remove!!
      try {
        logger.info('Drop SOME_TABLE1');
        await queryInterface.dropTable('SOME_TABLE1', {
          transaction,
        });
        logger.info('drop SOME_TABLE2');
        await queryInterface.dropTable('SOME_TABLE2', { transaction });
      } catch (e) {
        logger.error('Issue with dropping tables', e);
        throw new Error('1st update migration failed!');
      }
      return true;
    });
    // Make second update
    await queryInterface.sequelize.transaction(async (transaction: Transaction) => {
      // This is just an example, please remove!!
      try {
        logger.info('Adding column to table');
        await queryInterface.addColumn(
          'SOME_TABLE3',
          'SOME_FIELD',
          {
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
              model: 'SOME_MODEL',
              key: 'id',
            },
          },
          { transaction },
        );
      } catch (e) {
        logger.error('Issue with updating column', e);
        throw new Error('2nd migration failed!');
      }
      return true;
    });
  },

  down: async (queryInterface: any): Promise<void> =>
    queryInterface.sequelize.transaction(async (transaction: Transaction) => {
      // Back out the changes made in "up"
    }),
};
