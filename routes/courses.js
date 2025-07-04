/**
 * @file routes/courses.js
 * @description Handles routes related to dynamic course pages, including homepage and form view.
 */

const express = require('express');
const router = express.Router();
const pool = require('../db/db'); // MySQL connection pool (unused yet, since no database query has been defined)

/**
 * GET /
 * Renders the homepage.
 *
 * @route GET /
 */
router.get('/', (req, res) => {
  res.render('pages/index', { title: 'Home' });
});

/**
 * GET /form
 * Renders the form page for course input or editing.
 *
 * @route GET /form
 */
router.get('/form', (req, res) => {
  res.render('pages/form', { title: 'Form' });
});

module.exports = router;
