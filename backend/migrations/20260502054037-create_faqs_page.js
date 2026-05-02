"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("faqs_page", {
      faqs_id: {
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

      faqs_question: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      faqs_answer: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      faqs_category: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },

      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
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
    await queryInterface.dropTable("faqs_page");
  },
};
