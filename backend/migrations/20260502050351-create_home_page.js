'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('home_page', {
      section_id: {
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

      section_name: {
        type: Sequelize.STRING(150),
        allowNull: false
      },

      section_title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },

      section_description: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      section_image: {
        type: Sequelize.STRING(255),
        allowNull: true
      },

      display_order: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },

      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
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
    await queryInterface.dropTable('home_page');
  }
};