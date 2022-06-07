'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment_History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Payment, {foreignKey: 'payment_id'});
      this.belongsTo(models.Payment_Via, {foreignKey: 'payment_via_id'});
      this.belongsTo(models.Cheque, {foreignKey: 'cheque_id'});
    }
  };
  Payment_History.init({
    received_amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
      defaultValue: 0.00
    },
    received_amount_date: {
      type: DataTypes.DATE
    },
    payment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'cascade',
      onUpdate: 'cascade'
    },
    payment_via_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    remark: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM,
      values: ['Clear', 'Pending', 'Success', 'Bounce'],
      allowNull: false
    },
    transaction_id:{
      type:DataTypes.STRING,
    },
  
    cheque_id: {
      type: DataTypes.INTEGER,
      onDelete: 'cascade',
      onUpdate: 'cascade'
    },
    user_id: {
      type:DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Payment_History',
    underscored: true
  });
  return Payment_History;
};