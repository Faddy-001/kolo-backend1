'use strict';
const moment = require('moment');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Offer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Project, { as: 'applicable_on_project', foreignKey: 'applicable_on_project_id' })
    }
  };
  Offer.init({
    number: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
     // unique: true
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    benefit: {
      type: DataTypes.STRING,
      allowNull: false
    }, 
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("start_date");
        if (rawValue && rawValue != 'Invalid Date') {
          return moment(rawValue).format("DD-MM-YYYY");
        }        
      }
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("end_date");
        if (rawValue && rawValue != 'Invalid Date') {
          return moment(rawValue).format("DD-MM-YYYY");
        }        
      }
    },
    counts: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    applicable_on_payment_type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    applicable_on_project_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      
    },
    applicable_on_property_type: {
      type: DataTypes.STRING,
      allowNull: true
    },
    applicable_on_property: {
      type: DataTypes.STRING,
      allowNull: true
    },

    is_expired:{
      type: DataTypes.BOOLEAN,
      allowNull: false,
    defaultValue:false
    }
  }, {
    sequelize,
    modelName: 'Offer',
    underscored: true
  });
  return Offer;
};