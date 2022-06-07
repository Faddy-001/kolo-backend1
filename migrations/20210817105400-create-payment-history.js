'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Payment_Histories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      received_amount: {
        type: Sequelize.DECIMAL
      },
      received_amount_date: {
        type: Sequelize.DATE
      },
      payment_id: {
        type: Sequelize.INTEGER
      },
      payment_via_id: {
        type: Sequelize.INTEGER
      },
      remark: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.STRING
      },
      cheque_id: {
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
    await queryInterface.dropTable('Payment_Histories');
  }
};