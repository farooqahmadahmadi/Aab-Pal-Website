'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('web_page_view_stats', {
      view_state_id: {
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

      view_date: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },

      total_views: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },

      unique_views: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('web_page_view_stats');
  }
};