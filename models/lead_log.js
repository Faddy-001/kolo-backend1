'use strict';
const moment = require('moment');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lead_Log extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Lead, {foreignKey: 'lead_id'});
      this.belongsTo(models.User, {as: 'CRE', foreignKey: 'cre_user_id'});
      this.belongsTo(models.User, {as: 'Sales_Executive', foreignKey: 'sales_exec_user_id'});
    }
  };
  Lead_Log.init({
    lead_id: {
      type:DataTypes.INTEGER,
      allowNull: false,
    },
    call_datetime: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      get() {
        const rawValue = this.getDataValue("call_datetime");
        if (rawValue && rawValue != 'Invalid Date') {
          return moment(rawValue).format("DD-MM-YYYY HH:mm:ss");
        }         
      }
    },
    call_duration: {
      type:DataTypes.STRING(20)
    },
    cre_user_id: {
      type:DataTypes.INTEGER,
      allowNull: false
    },
    sales_exec_user_id: {
      type:DataTypes.INTEGER,
      allowNull: false
    },
    contactability: {
      type:DataTypes.ENUM,
      values: ['Conversation', 'Not Connected', 'Not Matched'],
      allowNull: false
    },
    mode_of_interest: {
      type:DataTypes.ENUM,
      values: ['Interested', 'Not Interested']
    },
    category: {
      type:DataTypes.ENUM,
      values: ['A+(Hot)', 'A(Warm)', 'B+(Cold)']
    },
    status: {
      type:DataTypes.ENUM,
      values: ['Lead', 'Call', 'Meet', 'Visit', 'Booked'],
    },
    follow_up_date: {
      type: DataTypes.DATE,
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
      type: DataTypes.DATE,
      get() {
        const rawValue = this.getDataValue("expected_visit_date");
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
    remark: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Lead_Log',
    underscored: true
  });
  return Lead_Log;
};