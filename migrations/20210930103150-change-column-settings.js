'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn("posts", "property", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    queryInterface.changeColumn("posts", "addressId", {
      type: Sequelize.UUID,
      allowNull: false,
    });
    queryInterface.changeColumn("categories", "firstCategory", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    queryInterface.changeColumn("answers", "questionId", {
      type: Sequelize.UUID,
      allowNull: false,
    });
    queryInterface.changeColumn("answers", "respondentId", {
      type: Sequelize.UUID,
      allowNull: false,
    });
    queryInterface.changeColumn("follows", "user", {
      type: Sequelize.JSON,
      allowNull: false,
    });
    queryInterface.changeColumn("follows", "follow", {
      type: Sequelize.JSON,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
  }
};
