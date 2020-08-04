/* eslint-disable no-console */
export default {
  up: async (queryInterface: any, Sequelize: any): Promise<any> =>
    queryInterface.sequelize.transaction(async (transaction: any) => {
      const { DataTypes } = Sequelize;
      // create table
      await queryInterface.createTable(
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
        },
        { transaction },
      );
    }),

  down: async (queryInterface: any, Sequelize: any): Promise<any> =>
    queryInterface.sequelize.transaction(async (transaction: any) => {
      // create table
      await queryInterface.dropTable('<%= tableName %>', { transaction });
    }),
};
