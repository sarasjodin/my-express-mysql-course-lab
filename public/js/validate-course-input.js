/**
    Validates input fields for a course form.
    Ensures that coursecode, coursename, syllabus, and progression are properly formatted.
    @param {Object} course - The course data to validate.
    @param {string} course.coursecode - Alphanumeric string (max 6 characters).
    @param {string} course.coursename - Required string (max 60 characters).
    @param {string} course.syllabus - Must be a valid HTTPS URL.
    @param {string} course.progression - Must be either "A", "B", or "C".
    @returns {Object} Validation result.
    @returns {boolean} result.isValid - True if all validations pass.
    @returns {string[]} result.errors - Array of error messages.
    @returns {Object} result.data - Sanitized course data.
    */

const validator = require('validator');

function validateCourseInput({
  coursecode,
  coursename,
  syllabus,
  progression
}) {
  const errors = [];

  // Trim input
  coursecode = coursecode.trim();
  coursename = coursename.trim();
  syllabus = syllabus.trim();
  progression = progression.trim();

  // coursecode: alphanumeric, max 6 chars
  if (!validator.isAlphanumeric(coursecode) || coursecode.length > 6) {
    errors.push('Course code must be alphanumeric and max 6 characters.');
  }

  // coursename: required, max 60 chars
  if (!coursename || coursename.length > 60) {
    errors.push('Course name is required and must be max 60 characters.');
  }

  // progression: must be A, B or C
  const allowedProgressions = ['A', 'B', 'C'];
  if (!allowedProgressions.includes(progression)) {
    errors.push('Progression must be one of A, B or C.');
  }

  // syllabus: must be a valid https URL
  if (
    !validator.isURL(syllabus, {
      protocols: ['https'],
      require_protocol: true
    })
  ) {
    errors.push('Syllabus must be a valid URL starting with https.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: { coursecode, coursename, syllabus, progression }
  };
}

module.exports = validateCourseInput;
