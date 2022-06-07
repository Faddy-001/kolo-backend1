'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Module_Feature extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Module, { foreignKey: "module_id" });
      this.belongsTo(models.Feature, { foreignKey: "feature_id" });
    }
  };
  Module_Feature.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    module_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    feature_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    path:{
      type: DataTypes.STRING,
      allowNull:false
    },

  }, {
    sequelize,
    modelName: 'Module_Feature',
    underscored: true
  });
  return Module_Feature;
};