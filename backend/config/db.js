const { Sequelize } = require("sequelize");
require("dotenv").config();

// Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,     // Database name
  process.env.DB_USER,     // Database user
  process.env.DB_PASSWORD, // Database password
  {
    host: process.env.DB_HOST, // Database host
    dialect: "mysql",           // MySQL
    logging: false,             // Console logging off
  }
);

// Test connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database Connected Successfully with Sequelize!");
  } catch (err) {
    console.error("❌ DB Connection Failed:", err.message);
  }
})();

module.exports = sequelize;