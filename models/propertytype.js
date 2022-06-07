'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PropertyType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Project, {
        through: {
          model: models.Project_PropertyType
        }
      })
    }
  };
  PropertyType.init({
    name: {
      type:DataTypes.STRING,
      allowNull: false,
      unique: true,      
    },
    description: {
      type:DataTypes.TEXT
    }
  }, {
    sequelize,
    modelName: 'PropertyType',
    underscored: true
  });
  return PropertyType;
};