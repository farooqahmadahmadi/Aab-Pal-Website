'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('blog_comments', {
      comment_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },

      blog_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'blogs_page',
          key: 'blog_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      visitor_ip: {
        type: Sequelize.STRING(45),
        allowNull: true
      },

      visitor_photo: {
        type: Sequelize.STRING(255),
        allowNull: true
      },

      visitor_email: {
        type: Sequelize.STRING(150),
        allowNull: true
      },

      visitor_rating: {
        type: Sequelize.INTEGER,
        allowNull: true
      },

      comment_text: {
        type: Sequelize.TEXT,
        allowNull: false
      },

      is_approved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },

      approved_at: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('blog_comments');
  }
};