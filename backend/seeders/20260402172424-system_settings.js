'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('system_settings',
      [
        // 🔹 Logs
        {
          setting_key: "Automatic Log Export",
          setting_value: "Off",
          setting_group: "Logs"
        },
        {
          setting_key: "Automatic System Activity Log",
          setting_value: "Off",
          setting_group: "Logs"
        },

        // 🔹 Backup
        {
          setting_key: "Automatic Backup",
          setting_value: "Off",
          setting_group: "Backup"
        },

        // 🔹 Reports
        {
          setting_key: "Reports Time Stamp",
          setting_value: "Yes",
          setting_group: "Reports"
        },
        {
          setting_key: "Reports Address",
          setting_value: "Yes",
          setting_group: "Reports"
        },
        {
          setting_key: "Reports Page Number",
          setting_value: "Yes",
          setting_group: "Reports"
        },

        // 🔹 Security
        {
          setting_key: "Deactivate All Users",
          setting_value: "No",
          setting_group: "Security"
        },
        {
          setting_key: "Default Admin User",
          setting_value: "admin@example.com",
          setting_group: "Security"
        },

         // 🔹 UI
        {
          setting_key: "Records to Show in Page",
          setting_value: 30,
          setting_group: "UI-Pages"
        },

        // 🔹 Storage
        {
          setting_key: "Uploading File Size (MB)",
          setting_value: 50,
          setting_group: "Storage"
        },
        {
          setting_key: "Allowed Logo Formats (Company)",
          setting_value: "",
          setting_group: "Storage"
        },
        {
          setting_key: "Allowed File Formats (Company)",
          setting_value: "",
          setting_group: "Storage"
        },
        {
          setting_key: "Allowed File Formats (Employees)",
          setting_value: "",
          setting_group: "Storage"
        },
        {
          setting_key: "Allowed Image Formats (Clients)",
          setting_value: "",
          setting_group: "Storage"
        },
        {
          setting_key: "Allowed File Formats (Projects)",
          setting_value: "",
          setting_group: "Storage"
        },
        {
          setting_key: "Allowed File Formats (Equipments)",
          setting_value: "",
          setting_group: "Storage"
        },
        {
          setting_key: "Allowed File Formats (Contracts)",
          setting_value: "",
          setting_group: "Storage"
        }
      ],
      {
        ignoreDuplicates: true
      }
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('system_settings', {
      setting_key: [
        "Automatic Log Export",
        "Automatic Backup",
        "Reports Time Stamp",
        "Reports Address",
        "Reports Page Number",
        "Deactivate All Users",
        "Default Admin User",
        "Uplodaing File Size (MB)"
      ]
    });
  }
};