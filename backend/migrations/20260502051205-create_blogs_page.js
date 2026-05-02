'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('blogs_page', {
      blog_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },

      language_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'website_languages',
          key: 'language_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      blog_author_name: {
        type: Sequelize.STRING(150),
        allowNull: false
      },

      blog_title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },

      blog_slug: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },

      blog_type: {
        type: Sequelize.STRING(50),   // no ENUM ✔
        allowNull: true
      },

      blog_text: {
        type: Sequelize.TEXT,
        allowNull: false
      },

      blog_image: {
        type: Sequelize.STRING(255),
        allowNull: true
      },

      blog_views: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },

      blog_likes: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },

      blog_shares: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },

      is_published: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      published_at: {
        type: Sequelize.DATE,
        allowNull: true
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('blogs_page');
  }
};