'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Feature extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Module, {
        through: {
          model: models.Module_Feature
        }
      })
    }
  };
  Feature.init({
    name: {
      type: DataTypes.STRING,
      allowNull:false,
      unique:true
    }
  }, {
    sequelize,
    modelName: 'Feature',
    underscored: true,
  });
  return Feature;
};