'use strict';
const {
  Model
} = require('sequelize');
const userpost = require('./userpost');
module.exports = (sequelize, DataTypes) => {
  class post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      post.belongsTo(models.user, {
        foreignKey: 'authorId', // authorIdをForeignKeyとする1対多の関係
        onDelete: 'CASCADE'
      });
      post.belongsToMany(models.user, {
        as: 'favoritePosts', // お気に入りの投稿を扱うときに使用するエイリアス
        through: models.UserPost, // お気に入りの投稿機能のための多対多の中間テーブル
      });
      post.hasMany(models.answer, { // 投稿に対する回答
        foreignKey: 'questionId',
      });
      post.belongsTo(models.address, { // 住所
        foreignKey: 'addressId',
      });
      post.belongsToMany(models.category, { // カテゴリ
        through: 'PostCategory',
      });
    }
  };
  post.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    title: DataTypes.STRING,
    property: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    text: DataTypes.TEXT,
    authorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    addressId: { // 住所の外部キー
      type: DataTypes.STRING,
      allowNull: false,
    }, 
  }, {
    sequelize,
    modelName: 'post',
  });
  return post;
};