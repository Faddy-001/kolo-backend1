'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Lead_Logs', {
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
        }

      },
      call_datetime: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,

      },
      call_duration: {
        type: Sequelize.STRING
      },
      cre_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false

      },
      sales_exec_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      contactability: {
        type: Sequelize.ENUM('Conversation', 'Not Connected', 'Not Matched') ,
        allowNull: false
        
      },
      mode_of_interest: {
        type: Sequelize.ENUM('Interested', 'Not Interested') ,
      },
      category: {
        type: Sequelize.ENUM('A+(Hot)', 'A(Warm)', 'B+(Cold)') ,
      },
      status: {
        type: Sequelize.ENUM('Lead', 'Call', 'Meet', 'Visit', 'Booked') ,
      },
      follow_up_date: {
        type: Sequelize.DATE
      },
      expected_visit_date: {
        type: Sequelize.DATE
      },
      remark: {
        type: Sequelize.STRING,
        allowNull: false

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
    await queryInterface.dropTable('Lead_Logs');
  }
};