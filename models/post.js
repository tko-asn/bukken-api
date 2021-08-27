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
        through: models.UserPost, // お気に入りの投稿機能のための多対多の中間テーブル
      });
      post.hasMany(models.answer, { // 投稿に対する回答
        foreignKey: 'questionId',
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
    text: DataTypes.TEXT,
    authorId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'post',
  });
  return post;
};