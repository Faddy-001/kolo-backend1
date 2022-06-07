'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Property extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Project, {foreignKey: 'project_id'});
      this.belongsTo(models.PropertyType, {foreignKey: 'propertyType_id'});
      this.hasMany(models.Pre_Booking, {foreignKey: 'property_id'});
      this.hasMany(models.Image, {
        foreignKey: 'imageable_id', constraints: false,
        scope: {
          imageable_type: 'Property'
        }
      });
    }
  };
  Property.init({
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    property_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    number: {
      type:DataTypes.STRING,
      allowNull:false
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    length: {
      type:DataTypes.FLOAT
    },
    breadth: {
      type:DataTypes.FLOAT
    },
    property_size:{
      type:DataTypes.FLOAT
    },
    price: {
      type:DataTypes.DECIMAL,
      allowNull: false
    },
    rate_per_sq_ft: {
      type:DataTypes.DECIMAL,
      allowNull:false
    },
    status: {
      type: DataTypes.ENUM,
      values: ['Stock', 'Booked', 'Registered', 'Pre Booked'],
      defaultValue: 'Stock',
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Property',
    underscored: true
  });
  return Property;
};