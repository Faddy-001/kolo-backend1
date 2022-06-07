'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: 'addressable_id',
        constraints: false,
        as: 'User'
      });
      this.belongsTo(models.Customer, {
        foreignKey: 'addressable_id',
        constraints: false,
        as: 'Customer'
      });
      this.belongsTo(models.Secondary_Contact, {
        foreignKey: 'addressable_id',
        constraints: false,
        as: 'Secondary_Contact'
      });
    }
  };
  Address.init({
    addressable_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    addressable_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    address_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    postal_code: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Address',
    underscored: true
  });
  return Address;
};