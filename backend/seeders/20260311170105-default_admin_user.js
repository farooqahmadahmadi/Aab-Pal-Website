'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hash = await bcrypt.hash('admin1234', 10);
    await queryInterface.bulkInsert('users',
      [
        {
          user_name: 'admin',
          user_email: 'farooqahmadahmadi1400@gmail.com',
          password_hash: hash,
          user_role: 'Admin',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
          access_time_start: '07:00:00',
          access_time_end: '16:00:00'
        }
      ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {
      user_email: 'farooqahmadahmadi1400@gmail.com'
    });
  }
};
