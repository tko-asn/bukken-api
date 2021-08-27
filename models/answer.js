'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class answer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      answer.belongsTo(models.user, { // 回答者
        foreignKey: 'respondentId',
        onDelete: 'CASCADE'
      });
      answer.belongsTo(models.post, { // 対象となる質問
        foreignKey: 'questionId',
        onDelete: 'CASCADE',
      });
    }
  };
  answer.init({
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    content: DataTypes.STRING,
    questionId: DataTypes.STRING,
    respondentId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'answer',
  });
  return answer;
};