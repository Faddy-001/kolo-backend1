'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Customer_Properties', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      project_id: {
        type: Sequelize.INTEGER
      },
      property_type_id: {
        type: Sequelize.INTEGER
      },
      property_id: {
        type: Sequelize.INTEGER
      },
      payment_type: {
        type: Sequelize.STRING
      },
      commitment: {
        type: Sequelize.STRING
      },
      offer: {
        type: Sequelize.STRING
      },
      finalized_property_price: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.ENUM
      },
      user_id: {
        type: Sequelize.INTEGER
      },
      customer_id: {
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
    await queryInterface.dropTable('Customer_Properties');
  }
};