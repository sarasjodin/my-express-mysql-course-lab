/**
 * @file routes/courses.js
 * @description Handles routes related to dynamic course pages, including homepage and form view.
 */

const validator = require('validator');
const express = require('express');
const router = express.Router();
const pool = require('../db/db'); // MySQL connection pool (unused yet, since no database query has been defined)
const validateCourseInput = require('../public/js/validate-course-input');

/**
 * GET /
 * Renders the homepage.
 *
 * @route GET /
 */
// READ
// Lista kurser - hämtar alla kurser från databasen och visar dem på startsidan (index)
router.get('/', async (req, res) => {
  try {
    const [courses] = await pool.query(
      'SELECT * FROM courses ORDER BY COALESCE(updated_at, created_at) DESC'
    );
    res.render('pages/index', { courses });
  } catch (err) {
    console.error('Fel vid hämtning av kurser:', err);
    res.status(500).send('Serverfel');
  }
});

/**
 * GET /form
 * Renders the form page for course input or editing.
 *
 * @route GET /form
 */
// CREATE I
// GET /form - visar ett tomt formulär för att skapa ny kurs
router.get('/form', (req, res) => {
  res.render('pages/form', {
    title: 'Form',
    formdata: {
      coursecode: '',
      coursename: '',
      syllabus: '',
      progression: ''
    },
    editingId: null,
    message: null,
    messageType: ''
  });
});

// CREATE II
// POST /form -  tar emot formulärdata och skapar ny kurs i databasen
router.post('/form', async (req, res) => {
  const { isValid, errors, data } = validateCourseInput(req.body);
  const { coursecode, coursename, syllabus, progression } = req.body;

  if (!isValid) {
    return res.status(400).render('form', {
      message: errors.join('<br>'), // Kombinera alla fel till ett strängmeddelande
      messageType: 'error',
      formdata: req.body,
      editingId: null
    });
  }

  try {
    await pool.query(
      'INSERT INTO courses (coursecode, coursename, syllabus, progression, created_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)',
      [
        coursecode.trim(),
        coursename.trim(),
        syllabus.trim(),
        progression.trim()
      ]
    );
    res.redirect('/');
  } catch (err) {
    console.error('Fel vid insättning:', err.message);
    res.status(500).send('Kunde inte skapa kurs.');
  }
});

// UPDATE I
// GET /form/:id - hämtar en specifik kurs med id och för in värden i formuläret
router.get('/form/:id', async (req, res) => {
  const courseId = req.params.id;
  if (!validator.isInt(courseId)) {
    return res.status(400).send('Ogiltigt ID');
  }
  try {
    const [[course]] = await pool.query('SELECT * FROM courses WHERE id = ?', [
      courseId
    ]);
    if (!course) return res.status(404).send('Kurs hittades inte');
    res.render('pages/form', {
      formdata: course,
      editingId: courseId,
      message: null,
      messageType: ''
    });
  } catch (err) {
    console.error('Fel vid hämtning för redigering:', err.message);
    res.status(500).send('Kunde inte hämta kurs.');
  }
});

// UPDATE II
// POST /form/:id - uppdaterar kursen i databasen
router.post('/form/:id', async (req, res) => {
  const courseId = req.params.id;

  if (!validator.isInt(courseId)) {
    return res.status(400).send('Ogiltigt ID');
  }
  const { coursecode, coursename, syllabus, progression } = req.body;
  const { isValid, errors, data } = validateCourseInput(req.body);

  if (!isValid) {
    return res.status(400).render('pages/form', {
      message: errors.join('<br>'), // Kombinera alla fel till ett strängmeddelande
      messageType: 'error',
      formdata: req.body,
      editingId: null
    });
  }

  try {
    await pool.query(
      'UPDATE courses SET coursecode = ?, coursename = ?, syllabus = ?, progression = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [
        coursecode.trim(),
        coursename.trim(),
        syllabus.trim(),
        progression.trim(),
        courseId
      ]
    );
    res.redirect('/');
  } catch (err) {
    console.error('Fel vid uppdatering:', err.message);
    res.status(500).send('Kunde inte uppdatera kurs.');
  }
});

// DELETE
// POST /delete/:id - tar bort en kurs från databasen
router.post('/delete/:id', async (req, res) => {
  const id = req.params.id;
  try {
    await pool.query('DELETE FROM courses WHERE id = ?', [id]);
    res.redirect('/');
  } catch (err) {
    console.error('Fel vid radering:', err.message);
    res.status(500).send('Kunde inte radera kurs.');
  }
});

module.exports = router;
