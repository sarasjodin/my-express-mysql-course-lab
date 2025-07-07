/**
 * @file db.js
 * @description Initializes and exports a PostgreSQL connection using environment variables.
 * Loads local environment variables from `.env.local` if not in production mode.
 */

const { Pool } = require('pg');

// Load environment variables from .env.local in development mode
require('dotenv').config();

/**
 * Creates a MySQL connection pool using configuration from environment variables.
 * The pool handles efficient reuse of connections.
 *
 *  * @type {import('pg').Pool}
 */
const pool = new Pool({
  host: process.env.PGHOST, // 'localhost'
  user: process.env.PGUSER, // database username
  password: process.env.PGPASSWORD, // database password
  database: process.env.PGDATABASE, // name of the database
  port: process.env.PGPORT // port specified
});

module.exports = pool;
