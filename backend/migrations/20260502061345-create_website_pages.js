'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('website_pages', {
      web_page_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },

      page_title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },

      page_slug: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },

      page_meta_title: {
        type: Sequelize.STRING(255),
        allowNull: true
      },

      page_meta_keyword: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      page_meta_description: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('website_pages');
  }
};