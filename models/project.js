'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Department, {foreignKey: 'project_id'});
      this.belongsToMany(models.User, {
        through: {
          model: models.Project_Department_User
        }
      });
      this.hasMany(models.Offer, {foreignKey : 'applicable_on_project_id'});
      this.belongsToMany(models.PropertyType, {
        through: {
          model: models.Project_PropertyType
        }
      })
    }
  };
  Project.init({
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    sector: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
  }, {
    sequelize,
    modelName: 'Project',
    underscored: true
  });
  return Project;
};