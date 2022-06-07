'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Module_Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
       this.belongsTo(models.Role, { foreignKey: 'role_id' });
    }
  };
  Module_Permission.init({
    lead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    master: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    collection: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
     role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
  }, {
    sequelize,
    modelName: 'Module_Permission',
    underscored: true
  });
  return Module_Permission;
};