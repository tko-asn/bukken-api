'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.belongsToMany(models.post, {
        through: models.UserPost, // 投稿お気に入り機能のための中間テーブル
        as: 'favoritePosts', // 参照時のフィールド名
      });
      user.hasMany(models.answer, { // ユーザーの回答
        foreignKey: 'respondentId',
      });
    }
  };
  user.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    self_introduction: DataTypes.STRING,
    icon_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};