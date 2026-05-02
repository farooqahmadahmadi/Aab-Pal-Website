"use strict";

const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash("12345", 10);

    return queryInterface.bulkInsert("users", [
      {
        user_name: "Admin User",
        user_email: "admin@aabpal.com",
        password_hash: passwordHash,
        user_role: "admin",
        failed_attempts: 0,
        is_active: true,
        user_photo: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("users", {
      user_email: "admin@aabpal.com",
    });
  },
};
