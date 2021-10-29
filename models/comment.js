"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class comment extends Model {
    static associate(models) {
      comment.belongsTo(models.user, {
        foreignKey: "authorId",
        onDelete: "CASCADE",
      });
      comment.belongsTo(models.answer, {
        foreignKey: "answerId",
        onDelete: "CASCADE",
      });
    }
  }
  comment.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      content: DataTypes.TEXT,
      answerId: DataTypes.UUID,
      authorId: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "comment",
    }
  );
  return comment;
};
