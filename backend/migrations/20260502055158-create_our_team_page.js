"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("our_team_page", {
      team_member_id: {
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

      member_full_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      member_position: {
        type: Sequelize.STRING(150),
        allowNull: false,
      },

      member_biography: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      member_photo: {
        type: Sequelize.STRING(255),
        allowNull: true,
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
    await queryInterface.dropTable("our_team_page");
  },
};
