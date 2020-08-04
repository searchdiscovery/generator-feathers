/* eslint-disable no-console */
export default {
  up: async (queryInterface: any, Sequelize: any): Promise<any> => {
    const { DataTypes } = Sequelize;
    // Make first update
    await queryInterface.sequelize.transaction(async (transaction: any) => {
      // This is just an example, please remove!!
      try {
        console.log('Drop SOME_TABLE1');
        await queryInterface.dropTable('SOME_TABLE1', {
          transaction,
        });
        console.log('drop SOME_TABLE2');
        await queryInterface.dropTable('SOME_TABLE2', { transaction });
      } catch (e) {
        console.log('Issue with dropping tables', e);
      }
      return true;
    });
    // Make second update
    await queryInterface.sequelize.transaction(async (transaction: any) => {
      // This is just an example, please remove!!
      try {
        console.log('Adding column to table');
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
        console.log('Issue with updating column', e);
      }
      return true;
    });
  },

  down: async (queryInterface: any, Sequelize: any): Promise<any> =>
    queryInterface.sequelize.transaction(async (transaction: any) => {
      // Back out the changes made in "up"
    }),
};
