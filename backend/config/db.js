const mysql = require("mysql2/promise"); // promise-based for async/await
require("dotenv").config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

db.getConnection()
  .then(() => console.log("✅ Database Connected Successfully!"))
  .catch((err) => console.error("❌ DB Connection Failed:", err.message));

module.exports = db;