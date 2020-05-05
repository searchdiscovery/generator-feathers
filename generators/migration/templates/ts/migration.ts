export default {
  up: async (queryInterface: any, Sequelize: any): Promise<any> => {
    return queryInterface.createTable('<%= tableName %>', {
      id: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      createdAt: Sequelize.DataTypes.DATE,
      updatedAt: Sequelize.DataTypes.DATE,
    });
  },

  down: async (queryInterface: any, Sequelize: any): Promise<any> => {
    return queryInterface.dropTable('<%= tableName %>');
  },
};
