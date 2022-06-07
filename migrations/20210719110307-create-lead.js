'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Leads', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      call_datetime: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue:Sequelize.NOW
      },
      call_duration: {
        type: Sequelize.STRING,
        defaultValue: '00:00:00'
      },
      project_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Project',
          key: 'id'
        }

      },
      cre_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      sales_exec_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,

      },
      phone: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true

      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false

      },
      middle_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      contactability: {
        type: Sequelize.ENUM('Conversation', 'Not Connected', 'Not Matched') ,
        allowNull: false
      },
      mode_of_interest: {
        type: Sequelize.ENUM('Interested', 'Not Interested') ,
      },
      profession_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      references: {
        model: 'Profession',
        key: 'id'
      }
      },
      current_location: {
        type: Sequelize.STRING
      },
      living_mode: {
        type: Sequelize.STRING
      },
      area_of_interest: {
        type: Sequelize.STRING
      },
      buying_purpose: {
        type: Sequelize.STRING
      },
      required_plot_size: {
        type: Sequelize.INTEGER
      },
      budget: {
        type: Sequelize.INTEGER
      },
      category: {
        type: Sequelize.ENUM('A+(Hot)', 'A(Warm)', 'B+(Cold)') ,
      },
      status: {
        type: Sequelize.ENUM('Lead', 'Call', 'Meet', 'Visit', 'Booked') ,
        defaultValue: 'Lead'
      },
      follow_up_date: {
        type: Sequelize.DATE
      },
      expected_visit_date: {
        type: Sequelize.DATE
      },
      lead_source: {
        type: Sequelize.STRING,
        defaultValue: 'Other'
      },
      video_sent: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
    await queryInterface.dropTable('Leads');
  }
};