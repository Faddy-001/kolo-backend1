'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Offers', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      number: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      benefit: {
        type: DataTypes.STRING,
        allowNull: false
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      counts: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      applicable_on_payment_type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      applicable_on_project_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Project',
          key: 'id'
        },
      },
      applicable_on_property_type: {
        type: Sequelize.STRING,
        allowNull: true
      },
      applicable_on_property: {
        type: Sequelize.STRING,
        allowNull: true

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
    await queryInterface.dropTable('Offers');
  }
};