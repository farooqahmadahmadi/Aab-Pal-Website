'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('employee_info',
      [
        {
          emp_full_name: 'Khalid Ahmad Ahmadi',
          emp_nid_number: '4567454489',
          emp_gender: 'Male',
          emp_marital_status: 'Single',
          emp_email: 'khaalid@gmail.com',
          created_at: new Date(),
          updated_at: new Date(),
        }
      ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('employee_info', null, {
      emp_email: 'khaalid@gmail.com'
    });
  }
};
