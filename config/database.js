// config/database.js - Database configuration and connection
const mysql = require('mysql2/promise'); // Use promise version
require('dotenv').config();

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  connectionLimit: 10,
  ssl: process.env.DB_SSL === 'true' ? {rejectUnauthorized: false} : false
});

// Test connection
const connect = async () => {
  try {
    await pool.query('SELECT 1');
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = {
  connect,
  pool,  // Export the pool directly
  query: (...args) => pool.query(...args)  // Export a query function
};