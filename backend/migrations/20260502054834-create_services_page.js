"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("services_page", {
      service_id: {
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

      service_title: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      service_description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      service_image: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      service_rating: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      },

      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      display_order: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
    await queryInterface.dropTable("services_page");
  },
};
