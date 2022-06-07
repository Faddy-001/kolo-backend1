'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Payment_Via, {foreignKey: 'payment_via_id'});
      this.belongsTo(models.Customer_Property, {foreignKey: 'customer_property_id'});
      this.belongsTo(models.User, {foreignKey: 'user_id'});
      this.hasMany(models.Cheque, { foreignKey: 'payment_id' });
    }
  };
  Payment.init({
    receiving_amount: {
      type:DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
    receiving_amount_date: {
      type:DataTypes.DATE
    },
    received_amount: {
      type:DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
    received_amount_date: {
      type:DataTypes.DATE
    },
    remaining_amount: {
      type:DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
    payment_via_id: {
      type:DataTypes.INTEGER
    },
    penalty_amount: {
      type:DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
    status: {
      type:DataTypes.ENUM,
      values: ['Pending', 'Success'],
      defaultValue: 'Pending',
      allowNull: false
    },
    transaction_id:{
      type:DataTypes.STRING,
      unique: true,
    },
    customer_property_id: {
      type:DataTypes.INTEGER,
      allowNull: false,
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    task_name: {
      type:DataTypes.STRING,
    },
    task_end_date: {
      type:DataTypes.DATE,
    },
    is_complete: {
      type:DataTypes.BOOLEAN,
    },
    remark: {
      type:DataTypes.STRING
    },
    user_id: {
      type:DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Payment',
    underscored: true
  });
  return Payment;
};