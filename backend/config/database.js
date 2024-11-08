const mysqlPromise = require("mysql2/promise");

const dbPromise = mysqlPromise.createPool(
  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  }
);

module.exports = dbPromise; 