/**
 * @file routes/pages.js
 * @description Handles static informational page routes like About.
 */

const express = require('express');
const router = express.Router();

/**
 * GET /about
 * Renders the About page with static information about the app.
 *
 * @route GET /about
 */
router.get('/about', (req, res) => {
  res.render('pages/about', { title: 'About' });
});

module.exports = router;
