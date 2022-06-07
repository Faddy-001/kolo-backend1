'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project_Department_User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Project, {foreignKey: 'project_id'});
      this.belongsTo(models.Department, {foreignKey: 'department_id'});
      this.belongsTo(models.User, {foreignKey: 'user_id'});
    }
  };
  Project_Department_User.init({
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },
    project_id: {
      type: DataTypes.INTEGER,
      unique: false
    },
    department_id: {
      type: DataTypes.INTEGER,
      unique: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      unique: false
    }
  }, {
    sequelize,
    modelName: 'Project_Department_User',
    underscored: true
  });
  return Project_Department_User;
};