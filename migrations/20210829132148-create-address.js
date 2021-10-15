'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('addresses', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUID4,
      },
      postalCode: {
        allowNull: false,
        type: Sequelize.STRING
      },
      prefecture: {
        allowNull: false,
        type: Sequelize.STRING
      },
      municipality: {
        allowNull: false,
        type: Sequelize.STRING
      },
      townName: {
        allowNull: false,
        type: Sequelize.STRING
      },
      buildingName: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('addresses');
  }
};