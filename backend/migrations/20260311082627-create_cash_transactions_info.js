"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("cash_transactions_info", {
      transaction_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      project_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "project_info",
          key: "project_id",
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      reference_type: {
        type: Sequelize.ENUM(
          "Expense",
          "InvoicePayment",
          "SalaryPayment",
          "Manual",
        ),
      },
      reference_id: {
        type: Sequelize.INTEGER,
      },
      transaction_type: {
        type: Sequelize.ENUM("Income", "Expense"),
      },
      amount: {
        type: Sequelize.DECIMAL(12, 2),
        defaultValue: 0,
      },
      transaction_description: {
        type: Sequelize.STRING(255),
      },
      transaction_date: {
        type: Sequelize.DATEONLY,
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.DATE,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("cash_transactions_info");
  },
};
