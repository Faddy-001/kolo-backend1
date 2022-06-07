'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cheque extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Payment, {foreignKey: 'payment_id'});
    }
  };
  Cheque.init({
    type: {
      type: DataTypes.ENUM,
      values: ['Current', 'Post'],
      allowNull: false
    },
    number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      
    },
    date: {
      type: DataTypes.DATE,
      allowNull:false
    },
    status: {
      type: DataTypes.ENUM,
      values: ['Cleared', 'Bounced', 'Pending'],
      defaultValue: 'Pending',
      allowNull: false
    },
    status_date: {
      type: DataTypes.DATE
    },
    amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    reason_for_bounce: {
      type: DataTypes.ENUM,
      values: ['Signature Mismatch', 'Insufficient Funds']
    },
    bounce_charge: DataTypes.DECIMAL(10,2),
    payment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'cascade',
      onUpdate: 'cascade'
    },
  }, {
    sequelize,
    modelName: 'Cheque',
    underscored: true
  });
  return Cheque;
};