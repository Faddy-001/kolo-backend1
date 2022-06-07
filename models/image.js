'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Image extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        foreignKey: 'imageable_id',
        constraints: false,
        as: 'User'
      });
      this.belongsTo(models.Pre_Booking, {
        foreignKey: 'imageable_id',
        constraints: false,
        as: 'Pre_Booking'
      });
      this.belongsTo(models.Property, {
        foreignKey: 'imageable_id',
        constraints: false,
        as: 'Property'
      });
      this.belongsTo(models.Document, {
        foreignKey: 'imageable_id',
        constraints: false,
        as: 'Document'
      });
      this.belongsTo(models.Customer_Property, {
        foreignKey: 'imageable_id',
        constraints: false,
        as: 'Customer_Property'
      });
    }
  };
  Image.init({
    imageable_type:{
      type:DataTypes.STRING,
      allowNull: false
    },
    imageable_id: 
    {
      type:DataTypes.INTEGER,
      allowNull: false,
    },
    image_type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type:DataTypes.STRING,
      allowNull: false
    },
    src: {
      type:DataTypes.STRING,
      allowNull: false,
      get() {
        const imageUrl = this.getDataValue('src');
        return process.env.BACKEND_BASE_URL + '/' + imageUrl;
      }
    },
    mime_type: {
      type:DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Image',
    underscored: true
  });
  return Image;
};