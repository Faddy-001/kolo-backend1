'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Payments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      receiving_amount: {
        type: Sequelize.DECIMAL
      },
      receiving_amount_date: {
        type: Sequelize.DATE
      },
      received_amount: {
        type: Sequelize.DECIMAL
      },
      received_amount_date: {
        type: Sequelize.DATE
      },
      remaining_amount: {
        type: Sequelize.DECIMAL
      },
      payment_via_id: {
        type: Sequelize.INTEGER
      },
      penalty_amount: {
        type: Sequelize.DECIMAL
      },
      status: {
        type: Sequelize.ENUM
      },
      customer_property_id: {
        type: Sequelize.INTEGER
      },
      task_name: {
        type: Sequelize.STRING
      },
      task_end_date: {
        type: Sequelize.DATE
      },
      is_complete: {
        type: Sequelize.BOOLEAN
      },
      remark: {
        type: Sequelize.STRING
      },
      user_id: {
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
    await queryInterface.dropTable('Payments');
  }
};