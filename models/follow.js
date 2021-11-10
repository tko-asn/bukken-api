"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class follow extends Model {
    static associate(models) {
    }
  }
  follow.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      followId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "follow",
    }
  );
  return follow;
};
