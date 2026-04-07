"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("company_info", [
      {
        company_name: "Nexora-Link",
        license_number: "4567454489",
        license_expire_date: "2026-04-08 00:00:00",
        company_phone: "+93795146492",
        company_address: "Ghazni-Afghanistan",
        company_email: "nexora.link@gmail.com",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("company_info", null, {
      company_email: "nexora.link@gmail.com",
    });
  },
};
