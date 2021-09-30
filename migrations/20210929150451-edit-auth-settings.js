"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn("users", "password", {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    });
    queryInterface.changeColumn("users", "username", {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    });
  },
  down: async (queryInterface, Sequelize) => {},
};
