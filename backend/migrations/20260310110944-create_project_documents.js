'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('project_documents', {

      document_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },

      project_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'project_info',
          key: 'project_id'
        },
        onDelete: 'CASCADE'
      },

      document_name: {
        type: Sequelize.STRING(150),
        allowNull: false
      },

      document_description: {
        type: Sequelize.STRING(255),
        allowNull: true
      },

      document_file_url: {
        type: Sequelize.STRING(255),
        allowNull: false
      },

      created_at: {
        type: Sequelize.DATE
      },

      updated_at: {
        type: Sequelize.DATE
      },

      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      }

    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('project_documents');
  }
};