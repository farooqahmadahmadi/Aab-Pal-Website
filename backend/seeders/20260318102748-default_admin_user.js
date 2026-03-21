'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    const hash = await bcrypt.hash('1234', 10);
    await queryInterface.bulkInsert('users',
      [
        {
          user_name: 'admin',
          user_email: 'farooqahmadahmadi1400@gmail.com',
          password_hash: hash,
          //employee_id: ,
          user_role: 'Admin',
          is_active: true,
          created_at: new Date(),
          updated_at: new Date(),
          access_time_start: '00:00:01',
          access_time_end: '23:00:00'
        }
      ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {
      user_email: 'farooqahmadahmadi1400@gmail.com'
    });
  }
};
