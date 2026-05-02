'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('web_page_views', {
      view_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },

      web_page_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'website_pages',
          key: 'web_page_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      visitor_ip: {
        type: Sequelize.STRING(100),
        allowNull: true
      },

      visitor_agent: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      viewed_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('web_page_views');
  }
};