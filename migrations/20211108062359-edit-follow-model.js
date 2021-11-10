'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("follows", "follow", {
      type: Sequelize.UUID,
      allowNull: false,
    });
    await queryInterface.changeColumn("follows", "user", {
      type: Sequelize.UUID,
      allowNull: false,
    });
    await queryInterface.renameColumn("follows", "follow", "followId");
    await queryInterface.renameColumn("follows", "user", "userId");
  },

  down: async (queryInterface, Sequelize) => {
  }
};
