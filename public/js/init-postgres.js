/**
 * @file init-postgres.js
 * @description This script connects to a Postgres database and creates the courses table
 *              if it does not already exist. It is intended to be run once during local
 *              setup or deployment to initialize the database schema.
 *
 * The script uses environment variables for all connection parameters.
 *
 * Usage:
 *   Run with Node.js from the project root (where .env.local is located):
 *     node public/js/init-postgres.js
 */

const path = require('path'); // Node.js built-in module for file paths
const { Pool } = require('pg'); // Postgres client with promise support
// Loads environment variables from the project root (.env)
require('dotenv').config();

/**
 * Initializes the Postgres database by creating the necessary tables if they don't exist.
 * Uses environment variables for database connection configuration.
 *
 * @async
 * @function init
 * @returns {Promise<void>} Resolves when the table is created or already exists.
 * @throws {Error} If connection fails or query execution throws an error.
 */
const pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT || 5432
});

async function init() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS courses (
      id SERIAL PRIMARY KEY,
      coursecode VARCHAR(6) NOT NULL,
      coursename VARCHAR(60) NOT NULL,
      syllabus TEXT NOT NULL,
      progression CHAR(1) CHECK (progression IN ('A', 'B', 'C')),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log('PostgreSQL: "courses" table is ready.');
  } catch (err) {
    console.error('Error creating courses table:', err);
  } finally {
    await pool.end();
  }
}

init();
