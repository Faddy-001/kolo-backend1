'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Pre_Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      lead_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      references: {
        model: 'Lead',
        key: 'id'
      },
      },
      property_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      payment_type: {
        type: Sequelize.ENUM('Full', 'Instalment'),
        allowNull: false,
      },
      commitment: {
        type: Sequelize.STRING
      },
      offer: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('Pre_Bookings');
  }
};