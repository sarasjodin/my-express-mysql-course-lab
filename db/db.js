/**
 * @file db.js
 * @description Initializes and exports a MySQL connection using environment variables.
 * Loads local environment variables from `.env.local` if not in production mode.
 */

const mysql = require('mysql2/promise');

// Load environment variables from .env.local in development mode
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '.env.local' });
}

/**
 * Creates a MySQL connection pool using configuration from environment variables.
 * The pool handles efficient reuse of connections.
 *
 *  * @type {import('mysql2/promise').Pool}
 */
const pool = mysql.createPool({
  host: process.env.DB_HOST, // 'localhost'
  user: process.env.DB_USER, // database username
  password: process.env.DB_PASSWORD, // database password
  database: process.env.DB_NAME // name of the database
});

module.exports = pool;
