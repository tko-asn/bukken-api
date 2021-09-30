'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class follow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  follow.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    user: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    follow: {
      type: DataTypes.JSON,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'follow',
  });
  return follow;
};