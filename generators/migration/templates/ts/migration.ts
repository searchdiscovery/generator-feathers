export default {
  up: async (queryInterface: any, Sequelize: any): Promise<any> =>
    queryInterface.sequelize.transaction(async (transaction: any) => {
      // create table
      await queryInterface.createTable(
        '<%= tableName %>',
        {
          id: {
            type: Sequelize.DataTypes.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          name: Sequelize.DataTypes.STRING,
          createdAt: Sequelize.DataTypes.DATE,
          updatedAt: Sequelize.DataTypes.DATE,
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
