'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('privacy_and_policy_page', {
      pp_id: {
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

      pp_title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },

      pp_text: {
        type: Sequelize.TEXT,
        allowNull: false
      },

      display_order: {
        type: Sequelize.INTEGER,
        defaultValue: 0
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
    await queryInterface.dropTable('privacy_and_policy_page');
  }
};