'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {foreignKey: 'user_id'});
      this.belongsTo(models.Lead, {foreignKey: 'lead_id'});
      this.belongsTo(models.Secondary_Contact, {foreignKey: 'secondary_contact_id'});
      this.hasMany(models.Customer_Property, {foreignKey: 'customer_id'})
      this.hasMany(models.Document, {
        foreignKey: 'documentable_id', constraints: false,
        scope: {
          documentable_type: 'Customer'
        }
      });
      this.hasMany(models.Address, {
        foreignKey: 'addressable_id', constraints: false,
        scope: {
          addressable_type: 'Customer'
        }
      });
    }
  };
  Customer.init({
    first_name: {
      type:DataTypes.STRING,
      allowNull:false
    },
    middle_name: {
      type:DataTypes.STRING,
    },
    last_name: {
      type:DataTypes.STRING,
      allowNull:false
    },
    gender: {
      type:DataTypes.ENUM,
      values: ['Male', 'Female', 'Others'],
      allowNull:false
    },
    phone: {
      type:DataTypes.BIGINT,
      unique: true,
      allowNull:false
    },
    alternate_phone: {
      type:DataTypes.BIGINT,
    },
    email: {
      type:DataTypes.STRING,
      unique: true
    },
    user_id: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    secondary_contact_id: {
      type:DataTypes.INTEGER,
      allowNull:false,
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    lead_id: {
      type:DataTypes.INTEGER,
      allowNull:true
    },
  }, {
    sequelize,
    modelName: 'Customer',
    underscored: true
  });
  return Customer;
};