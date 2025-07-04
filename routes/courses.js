/* routes/courses.js */
const express = require('express');
const router = express.Router();
const pool = require('../db/db');


router.get('/', (req, res) => {
  res.render('pages/index', { title: 'Home' });
});

router.get('/form', (req, res) => {
  res.render('pages/form', { title: 'Form' });
});

module.exports = router;
