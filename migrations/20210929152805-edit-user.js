"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn("users", "email", {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    });
  },
  down: async (queryInterface, Sequelize) => {},
};
