/**
    Binds a submit confirmation dialog to all delete forms on the page.
    Prompts the user to confirm deletion of a course before submitting the form.
    The course name is retrieved from the data-course attribute on the form element.
    */

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.delete-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      const courseName = form.dataset.course || 'this course';
      const confirmed = confirm(
        `Are you sure you want to delete "${courseName}"?`
      );
      if (!confirmed) {
        e.preventDefault(); // stop submit
      }
    });
  });
});
