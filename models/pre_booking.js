'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pre_Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Lead, {foreignKey: 'lead_id'});
      this.belongsTo(models.Property, {foreignKey: 'property_id'});
      this.hasMany(models.Image, {
        foreignKey: 'imageable_id', constraints: false,
        scope: {
          imageable_type: 'Pre_Booking'
        }
      });
    }
  };
  Pre_Booking.init({
    lead_id: {
      type:DataTypes.INTEGER,
      allowNull: false,
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    property_id: {
      type:DataTypes.INTEGER,
      allowNull: true
    },
    payment_type:{
      type: DataTypes.ENUM,
      allowNull: false,
      values: ['Full', 'Instalment']
    },
    commitment: {
      type:DataTypes.STRING,
    },
    offer: DataTypes.STRING,
    finalized_property_price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    is_discarded: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Pre_Booking',
    underscored: true
  });
  return Pre_Booking;
};