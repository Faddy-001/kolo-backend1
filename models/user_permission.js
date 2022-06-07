'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User_Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Feature, { foreignKey: "feature_id" });
      this.belongsTo(models.User, { foreignKey: "user_id" });
      this.hasMany(models.Module_Permission, { foreignKey: 'role_id' });
    }
  };
  User_Permission.init({
    feature_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
    },
    create: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    update: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    delete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    full_access: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
    }
  }, {
    sequelize,
    modelName: 'User_Permission',
    underscored: true
  });
  return User_Permission;
};