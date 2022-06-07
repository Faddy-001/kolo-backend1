'use strict';
const moment = require('moment');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lead extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Project, {foreignKey: 'project_id'});
      this.belongsTo(models.Profession, {foreignKey: 'profession_id'});
      this.belongsTo(models.User, {as: 'CRE', foreignKey: 'cre_user_id'});
      this.belongsTo(models.User, {as: 'Sales_Executive', foreignKey: 'sales_exec_user_id'});
      this.hasMany(models.Lead_Log, {foreignKey: 'lead_id'});
      this.hasMany(models.Pre_Booking, {foreignKey: 'lead_id'});
    }
  };
  Lead.init({
    call_datetime: {
      type:DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW,
      get() {
        const rawValue = this.getDataValue("call_datetime");
        if (rawValue && rawValue != 'Invalid Date') {
          return moment(rawValue).format("DD-MM-YYYY HH:mm:ss");
        }                
      }
    },
    call_duration: {
      type:DataTypes.STRING(20),
      defaultValue: '00:00:00'
    },
    project_id: {
      type:DataTypes.INTEGER,
      allowNull: false,
    },
    cre_user_id: {
      type:DataTypes.INTEGER,
      allowNull: false,
    },
    sales_exec_user_id: {
      type:DataTypes.INTEGER,
      allowNull: false,
    },
    phone: {
      type:DataTypes.BIGINT,
      allowNull: false,
      unique: true
    },
    first_name: {
      type:DataTypes.STRING,
      allowNull: false
    },
    middle_name: {
      type:DataTypes.STRING
    },
    last_name: {
      type:DataTypes.STRING
    },
    contactability: {
      type:DataTypes.ENUM,
      values: ['Conversation', 'Not Connected', 'Not Matched']
    },
    mode_of_interest: {
      type:DataTypes.ENUM,
      values: ['Interested', 'Not Interested']
    },
    profession_id: {
      type:DataTypes.INTEGER,
      allowNull: true,
    },
    current_location: {
      type:DataTypes.STRING
    },
    living_mode: {
      type:DataTypes.STRING
    },
    area_of_interest: {
      type:DataTypes.STRING
    },
    buying_purpose: {
      type:DataTypes.STRING
    },
    required_plot_size: {
      type:DataTypes.STRING
    },
    budget: {
      type:DataTypes.STRING
    },
    category: {
      type:DataTypes.ENUM,
      values: ['A+(Hot)', 'A(Warm)', 'B+(Cold)']
    },
    status: {
      type:DataTypes.ENUM,
      values: ['Lead', 'Call', 'Meet', 'Visit', 'Booked'],
      defaultValue: 'Lead'
    },
    follow_up_date: {
      type:DataTypes.DATE,
      get() {
        const rawValue = this.getDataValue("follow_up_date");
        if (rawValue && rawValue != 'Invalid Date') {
          return moment(rawValue).format("DD-MM-YYYY");
        }        
      },
      set(value) {
        if (value) {
          this.setDataValue('follow_up_date', moment(value).format("YYYY-MM-DD"));
        }        
      }
    },
    expected_visit_date: {
      type:DataTypes.DATE,
      get() {
        const rawValue = this.getDataValue("expected_visit_date");
        if (rawValue && rawValue != 'Invalid Date') {
          return moment(rawValue).format("DD-MM-YYYY");
        }        
      },
      set(value) {
        if (value) {
          this.setDataValue('expected_visit_date', moment(value).format("YYYY-MM-DD"));
        }       
      }
    },
    lead_source: {
      type:DataTypes.STRING,
      defaultValue: 'Other'
    },
    video_sent: {
      type:DataTypes.BOOLEAN,
      defaultValue: false
    },
    is_active: {
      type:DataTypes.BOOLEAN,
      defaultValue: true
    }  
  }, {
    sequelize,
    modelName: 'Lead',
    underscored: true
  });
  return Lead;
};