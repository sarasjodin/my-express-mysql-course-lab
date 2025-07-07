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
 * @route GET /
 * Renders the homepage, shows all courses on home(index) page.
 * // READ
 */
router.get('/', async (req, res) => {
  try {
    const [courses] = await pool.query(
      'SELECT * FROM courses ORDER BY created_at DESC'
    );
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
    return res.redirect('/form');
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
    req.flash('success', 'Course successfully saved!'); // Success message
    res.redirect('/');
  } catch (err) {
    console.error('Error while saving course:', err.message);
    req.flash('error', 'Could not create course.');
    res.redirect('/form');
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
    const [[course]] = await pool.query('SELECT * FROM courses WHERE id = ?', [
      courseId
    ]);
    if (!course) return res.status(404).send('Course not found');

    // Retrieve flash messages if they exist
    const message = req.flash('error') || req.flash('success');
    const messageType = req.flash('error').length > 0 ? 'error' : 'success';

    res.render('pages/form', {
      title: 'Edit Course',
      formdata: course, // Send course data to the form
      editingId: courseId,
      message: message.length > 0 ? message : null, // Only pass message to the view if it exists
      messageType: messageType
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
      'UPDATE courses SET coursecode = ?, coursename = ?, syllabus = ?, progression = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
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
    await pool.query('DELETE FROM courses WHERE id = ?', [id]);
    req.flash('success', 'Course deleted successfully!');
    res.redirect('/'); // Redirect to the homepage after deletion
  } catch (err) {
    console.error('Error while deleting:', err.message);
    req.flash('error', 'Could not delete course.');
    res.redirect('/'); // Redirect to the homepage if an error occurs
  }
});

module.exports = router;
