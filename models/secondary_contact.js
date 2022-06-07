'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Secondary_Contact extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Document, {
        foreignKey: 'documentable_id', constraints: false,
        scope: {
          documentable_type: 'Secondary_Contact'
        }
      });
      this.hasMany(models.Address, {
        foreignKey: 'addressable_id', constraints: false,
        scope: {
          addressable_type: 'Secondary_Contact'
        }
      });
    }
  };
  Secondary_Contact.init({
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
      allowNull:false
    },
    alternate_phone: {
      type:DataTypes.BIGINT,
    },
    email: {
      type:DataTypes.STRING,
    },
    relation_with_customer: {
      type:DataTypes.STRING,
    },
  }, {
    sequelize,
    modelName: 'Secondary_Contact',
    underscored: true
  });
  return Secondary_Contact;
};