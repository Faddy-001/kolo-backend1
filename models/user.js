'use strict';
const bcrypt = require("bcrypt");

const {
  Model, Sequelize
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Role, { foreignKey: 'role_id' });      
      this.belongsToMany(models.Project, { 
        through: {
          model: models.Project_Department_User
        }
      });
      this.belongsToMany(models.Department, { 
        through: {
          model: models.Project_Department_User
        }
      });
      this.hasOne(models.Address, {
        foreignKey: 'addressable_id', constraints: false,
        scope: {
          addressable_type: 'User'
        }
      });
      this.hasOne(models.Image, {
        foreignKey: 'imageable_id', constraints: false,
        scope: {
          imageable_type: 'User'
        }
      });
      this.hasMany(models.Lead, {foreignKey : 'cre_user_id'});
      this.hasMany(models.Lead, {foreignKey : 'sales_exec_user_id'});
      this.hasMany(models.Lead_Log, {foreignKey : 'cre_user_id'});
      this.hasMany(models.Lead_Log, {foreignKey : 'sales_exec_user_id'});
      this.hasMany(models.User_Permission,{foreignKey:"user_id"});

    }
  };
  User.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    },
    gender: {
      type: DataTypes.ENUM,
      values: ['Male', 'Female', 'Others']
    },
    phone: {
      type: DataTypes.BIGINT,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: false
      }
    },
    alternate_phone: {
      type: DataTypes.BIGINT
    },
    role_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onUpdate: 'cascade',
      onDelete: 'cascade'
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    },
    resetPasswordToken: {
      type: DataTypes.STRING
    },
    expireToken: {
      type:Sequelize.DATE
    }
  }, {
    sequelize,
    modelName: 'User',
    underscored: true,
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSaltSync(10, 'a');
          user.password = bcrypt.hashSync(user.password, salt);
        }
      },
      // beforeUpdate: async (user) => {
      //   if (user.password) {
      //     const salt = await bcrypt.genSaltSync(10, 'a');
      //     console.log(salt);
      //     user.password = bcrypt.hashSync(user.password,salt);
      //   }
      // }
    },
    instanceMethods: {
      validPassword: (password) => {
        return bcrypt.compareSync(password, this.password);
      }
    }
  });
  User.prototype.validPassword = async (password, hash) => {
    return bcrypt.compareSync(password, hash);
  }
  return User;
};