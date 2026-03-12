'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.createTable('company_documents', {

      document_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
      },

      company_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        defaultValue: 1,
        references: {
          model: 'company_info',
          key: 'company_id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },

      doc_name: {
        type: Sequelize.STRING(150),
        allowNull: false
      },

      doc_description: {
        type: Sequelize.STRING(255),
        allowNull: true
      },

      doc_file_url: {
        type: Sequelize.STRING(255),
        allowNull: false
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
    await queryInterface.dropTable('company_documents');
  }
};