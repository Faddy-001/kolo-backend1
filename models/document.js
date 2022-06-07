'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Document extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Secondary_Contact, {
        foreignKey: 'documentable_id',
        constraints: false,
        as: 'Secondary_Contact'
      });
      this.belongsTo(models.Customer, {
        foreignKey: 'documentable_id',
        constraints: false,
        as: 'Customer'
      });
      this.hasMany(models.Image, {
        foreignKey: 'imageable_id', constraints: false,
        scope: {
          imageable_type: 'Document'
        }
      });
    }
  };
  Document.init({
    documentable_type: DataTypes.STRING,
    documentable_id: DataTypes.INTEGER,
    type: DataTypes.STRING,
    number: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Document',
  });
  return Document;
};