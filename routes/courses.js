/**
 * @file routes/courses.js
 * @description Handles routes related to dynamic course pages, including homepage and form view.
 */

const validator = require('validator');
const express = require('express');
const router = express.Router();
const pool = require('../db/db'); // Postgres connection pool
const validateCourseInput = require('../public/js/validate-course-input');

/**
 * @route GET /
 * Renders the homepage, shows all courses on home(index) page.
 * // READ
 */
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM courses ORDER BY COALESCE(updated_at, created_at) DESC'
    );
    const courses = result.rows;

    // Check limit
    const countResult = await pool.query(
      'SELECT COUNT(*) AS total FROM courses'
    );
    const total = parseInt(countResult.rows[0].total, 10);
    const maxReached = total >= 15;

    res.render('pages/index', { courses });
  } catch (err) {
    console.error('Error fetching courses:', err);
    res.status(500).send('Server error');
  }
});

/**
 * @route GET /form
 * Renders the form page for creating a new course.
 * CREATE I
 */
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
    messages: req.flash() // Retrieve all flash messages
  });
});

// CREATE II
// POST /form - receives form data and creates a new course in the database
router.post('/form', async (req, res) => {
  const { isValid, errors } = validateCourseInput(req.body);
  const { coursecode, coursename, syllabus, progression } = req.body;

  if (!isValid) {
    req.flash('error', errors); // Set error messages
    return res.redirect('/');
  }

  const result = await pool.query('SELECT COUNT(*) AS total FROM courses');
  const total = parseInt(result.rows[0].total, 10);

  if (total >= 15) {
    req.flash('error', 'You can only add up to 15 courses.');
    return res.redirect('/');
  }

  try {
    await pool.query(
      'INSERT INTO courses (coursecode, coursename, syllabus, progression, created_at) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)',
      [
        coursecode.trim(),
        coursename.trim(),
        syllabus.trim(),
        progression.trim()
      ]
    );
    req.flash('success', 'Course successfully saved!'); // Success message
    res.redirect('/');
  } catch (err) {
    console.error('Error while saving course:', err.message);
    req.flash('error', 'Could not create course.');
    res.redirect('/');
  }
});

// UPDATE I
// GET /form/:id - retrieves a specific course by ID and fills in the form values
router.get('/form/:id', async (req, res) => {
  const courseId = req.params.id;

  if (!validator.isInt(courseId)) {
    return res.status(400).send('Invalid course ID.');
  }
  try {
    const result = await pool.query('SELECT * FROM courses WHERE id = $1', [
      courseId
    ]);
    const course = result.rows[0];

    if (!course) return res.status(404).send('Course not found');

    res.render('pages/form', {
      title: 'Edit Course',
      formdata: course, // Send course data to the form
      editingId: courseId
    });
  } catch (err) {
    console.error('Error while fetching course for editing:', err.message);
    res.status(500).send('Could not retrieve course.');
  }
});

// UPDATE II
// POST /form/:id - updates course in the database
router.post('/form/:id', async (req, res) => {
  const courseId = req.params.id;

  if (!validator.isInt(courseId)) {
    return res.status(400).send('Invalid course ID');
  }
  const { coursecode, coursename, syllabus, progression } = req.body;
  const { isValid, errors } = validateCourseInput(req.body);

  if (!isValid) {
    req.flash('error', errors); // Set error messages
    req.session.formdata = req.body; // Store the user's data in the session
    return res.redirect(`/form/${courseId}`); // Redirect back to the form
  }

  try {
    await pool.query(
      'UPDATE courses SET coursecode = $1, coursename = $2, syllabus = $3, progression = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5',
      [
        coursecode.trim(),
        coursename.trim(),
        syllabus.trim(),
        progression.trim(),
        courseId
      ]
    );

    req.flash('success', 'Course updated successfully!');
    delete req.session.formdata; // Remove saved form data from the session
    res.redirect('/'); // Redirect to the homepage
  } catch (err) {
    console.error('Error during update:', err.message);
    req.flash('error', 'Could not update course.');
    req.session.formdata = req.body; // Store the user's data in the session if an error occurs
    res.redirect(`/form/${courseId}`); // Redirect back to the form to show errors
  }
});

// DELETE
// POST /delete/:id - deletes a course from the database
router.post('/delete/:id', async (req, res) => {
  const id = req.params.id;

  if (!validator.isInt(id)) {
    req.flash('error', 'Invalid course ID.');
    return res.redirect('/');
  }

  try {
    await pool.query('DELETE FROM courses WHERE id = $1', [id]);
    req.flash('success', 'Course deleted successfully!');
    res.redirect('/'); // Redirect to the homepage after deletion
  } catch (err) {
    console.error('Error while deleting:', err.message);
    req.flash('error', 'Could not delete course.');
    res.redirect('/'); // Redirect to the homepage if an error occurs
  }
});

module.exports = router;
