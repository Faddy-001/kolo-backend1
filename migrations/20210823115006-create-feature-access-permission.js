'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Feature_Access_Permissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      feature_id: {
        type: Sequelize.INTEGER
      },
      Create: {
        type: Sequelize.BOOLEAN
      },
      Read: {
        type: Sequelize.BOOLEAN
      },
      Update: {
        type: Sequelize.BOOLEAN
      },
      Delete: {
        type: Sequelize.BOOLEAN
      },
      fullAccess: {
        type: Sequelize.BOOLEAN
      },
      role_id: {
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
    await queryInterface.dropTable('Feature_Access_Permissions');
  }
};