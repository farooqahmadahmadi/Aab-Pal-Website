'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('company_info',
      [
        {
          company_name: 'Nexora-Link',
          license_number: '4567454489',
          company_phone: '+93 79 514 6492',
          company_address: 'Ghazni-Afghanistan',
          company_email: 'nexora.link@gmail.com',
          created_at: new Date(),
          updated_at: new Date(),
        }
      ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('employee_info', null, {
      company_email: 'nexora.link@gmail.com'
    });
  }
};
