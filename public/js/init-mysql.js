/**
 * @file init-mysql.js
 * @description This script connects to a MySQL database and creates the courses table
 *              if it does not already exist. It is intended to be run once during local
 *              setup or deployment to initialize the database schema.
 *
 * The script uses environment variables for all connection parameters.
 *
 * Usage:
 *   Run with Node.js from the project root (where .env.local is located):
 *     node public/js/init-mysql.js
 */

const path = require('path'); // Node.js built-in module for file paths
const mysql = require('mysql2/promise'); // MySQL client with promise support
// Load environment variables from the project root (.env.local),
// since this script is located in public/js/, adjust the path accordingly:
require('dotenv').config({ path: path.resolve(__dirname, '../../.env.local') });

/**
 * Initializes the MySQL database by creating the necessary tables if they don't exist.
 * Uses environment variables for database connection configuration.
 *
 * @async
 * @function init
 * @returns {Promise<void>} Resolves when the table is created or already exists.
 * @throws {Error} If connection fails or query execution throws an error.
 */
async function init() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS courses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      coursecode VARCHAR(10) NOT NULL,
      coursename TEXT NOT NULL,
      syllabus TEXT,
      progression VARCHAR(1),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NULL
    );
  `;

  try {
    await connection.query(createTableQuery);
    console.log('Courses table created or already exists.');
  } catch (err) {
    console.error('Error creating table:', err);
  } finally {
    await connection.end();
  }
}

init();
