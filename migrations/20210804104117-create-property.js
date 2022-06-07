'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Properties', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Project',
          key: 'id'
        },

      },
      property_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      references: {
        model: 'PropertyType',
        key: 'id'
      },

      },
      number: {
        type: Sequelize.STRING,
        allowNull:false
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      length: {
        type: Sequelize.FLOAT
      },
      breadth: {
        type: Sequelize.FLOAT
      },
      property_size: {
        type: Sequelize.FLOAT
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      rate_per_sq_ft: {
        type: Sequelize.INTEGER,
        allowNull:false

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
    await queryInterface.dropTable('Properties');
  }
};