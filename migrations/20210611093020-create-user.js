'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
      },
      gender: {
        type: Sequelize.ENUM('Male', 'Female', 'Others') ,
        
      },
      phone: {
        type: Sequelize.BIGINT,
        unique: true,
        allowNull: false,
       
      },
      alternate_phone: {
        type: Sequelize.BIGINT
      },
      role_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'roles',
            schema: 'kolonizer'
          },
          key: 'id'
        },
        allowNull: false
      },
      project_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'projects',
            schema: 'kolonizer'
          },
          key: 'id'
        },
        allowNull: false
      },
      department_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'departments',
            schema: 'kolonizer'
          },
          key: 'id'
        },
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      resetPasswordToken: {
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
    await queryInterface.dropTable('Users');
  }
};