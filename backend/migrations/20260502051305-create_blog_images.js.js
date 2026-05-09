"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("blog_images", {
      blog_image_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },

      blog_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "blogs_page",
          key: "blog_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      image_path: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },

      image_title: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      image_alt: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },

      is_thumbnail: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },

      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },

      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("blog_images");
  },
};