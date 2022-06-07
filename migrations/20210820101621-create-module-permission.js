'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Module_Permissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Lead: {
        type: Sequelize.BOOLEAN
      },
      sales: {
        type: Sequelize.BOOLEAN
      },
      collection: {
        type: Sequelize.BOOLEAN
      },
      fundmanagement: {
        type: Sequelize.BOOLEAN
      },
      Material: {
        type: Sequelize.BOOLEAN
      },
      Role_id: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Module_Permissions');
  }
};