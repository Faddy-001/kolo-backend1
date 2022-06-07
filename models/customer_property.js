'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer_Property extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Project, {foreignKey: 'project_id'});
      this.belongsTo(models.PropertyType, {foreignKey: 'property_type_id'});
      this.belongsTo(models.Property, {foreignKey: 'property_id'});
      this.belongsTo(models.User, {foreignKey: 'user_id'});
      this.belongsTo(models.Customer, {foreignKey: 'customer_id'});
      this.hasMany(models.Payment, {foreignKey: 'customer_property_id'})
    }
  };
  Customer_Property.init({
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    property_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    property_id: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false
    },
    payment_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    commitment: {
      type: DataTypes.STRING,
    },
    offer: {
      type: DataTypes.STRING,
    },
    finalized_property_price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM,
      values: ['Booked', 'Registered'],
      defaultValue: 'Booked',
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    customer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
  }, {
    sequelize,
    modelName: 'Customer_Property',
    underscored: true
  });
  return Customer_Property;
};