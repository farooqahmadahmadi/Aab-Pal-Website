'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('employee_info',
      [
        {
          emp_full_name: 'Farooq Ahmad Ahmadi',
          emp_nid_number: '1234567890',
          emp_gender: 'Male',
          emp_marital_status: 'Single',
          emp_email: 'farooqahmadahmadi1400@gmail.com',
          created_at: new Date(),
          updated_at: new Date(),
        }
      ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('employee_info', null, {
      emp_email: 'farooqahmadahmadi1400@gmail.com'
    });
  }
};
