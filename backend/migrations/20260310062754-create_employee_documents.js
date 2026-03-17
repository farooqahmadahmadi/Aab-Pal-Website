'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('employee_documents', {
      document_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true
      },
      employee_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: 'employee_info',
          key: 'employee_id'
        },
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
    await queryInterface.dropTable('employee_documents');
  }
};