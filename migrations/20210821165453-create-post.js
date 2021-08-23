'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('posts', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUID4,
      },
      title: {
        allowNull:false,
        type: Sequelize.STRING
      },
      text: {
        type: Sequelize.TEXT
      },
      authorId: {
        type: Sequelize.UUID,
        references: { // userのidに外部キー制約を設ける
          model: {
            tableName: 'users',
            key: 'id',
          },
        },
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('posts');
  }
};