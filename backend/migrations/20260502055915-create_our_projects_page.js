"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("our_projects_page", {
      project_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },

      language_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "website_languages",
          key: "language_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      project_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      project_address: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      project_image: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      project_status: {
        type: Sequelize.STRING(100), // no ENUM
        allowNull: false,
        defaultValue: "ongoing",
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("our_projects_page");
  },
};
