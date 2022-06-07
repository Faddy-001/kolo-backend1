'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    this.hasMany(models.User, { foreignKey: 'role_id' });
    this.hasOne(models.Module_Permission, { foreignKey: 'role_id' });
    this.hasMany(models.Feature_Access_Permission, { foreignKey: "role_id" });
    }
  };
  Role.init({
    name: {
      type:DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    }
  }, {
    sequelize,
    modelName: 'Role',
    underscored: true
  });
  return Role;
};