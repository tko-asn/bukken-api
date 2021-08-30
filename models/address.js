'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      address.hasMany(models.post, { // 住所に属する投稿
        foreignKey: 'addressId',
      });
    }
  };
  address.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    postalCode: { // 郵便番号
      allowNull: false,
      type: DataTypes.STRING,
    },
    prefecture: { // 都道府県
      allowNull: false,
      type: DataTypes.STRING,
    },
    municipality: { // 市区町村
      allowNull: false,
      type: DataTypes.STRING,
    },
    townName: { // 町名・番地
      allowNull: false,
      type: DataTypes.STRING,
    },
    buildingName: DataTypes.STRING, // アパート・マンション名
  }, {
    sequelize,
    modelName: 'address',
  });
  return address;
};