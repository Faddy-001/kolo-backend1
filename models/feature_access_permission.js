'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Feature_Access_Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Feature, { foreignKey: "feature_id" });
      this.belongsTo(models.Role,{foreignKey:"role_id"});
    }
  };
  Feature_Access_Permission.init({
    feature_id: {
      type: DataTypes.INTEGER,
      allowNull:false,
      onDelete: 'CASCADE',
    },
    create: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    update: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    delete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    fullAccess: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull:false,
      onDelete: 'CASCADE',

    },
  }, {
    sequelize,
    modelName: 'Feature_Access_Permission',
    underscored: true
  });
  return Feature_Access_Permission;
};