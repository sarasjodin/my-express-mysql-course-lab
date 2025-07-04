/**
 * @file server.js
 * @description Entry point for the Express application.
 * Sets up middleware, static files, EJS templating, and routing.
 */
const path = require('path');
const express = require('express');
const app = express();
const port = 3000;

/**
 * Middleware to parse URL-encoded data from forms.
 * Required for handling POST requests from HTML forms.
 */
app.use(express.urlencoded({ extended: true }));

// Import route handlers
const pagesRouter = require('./routes/pages');
const coursesRouter = require('./routes/courses');

/**
 * Set the view engine to EJS for server-side templating.
 * Tell Express where the views folder is located.
 */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

/**
 * Serve static files (CSS, JS, images) from the 'public' directory.
 * These will be accessible under the root URL (e.g. /css/style.css).
 */
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Middleware to make the current request path available in views.
 * Useful for navigation highlighting (e.g., active links).
 */
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

/**
 * Use route handlers.
 * - pagesRouter handles static routes like /about
 * - coursesRouter handles dynamic routes like /, /form, /form/:id, etc.
 */
app.use('/', pagesRouter); /* hanterar /about */
app.use('/', coursesRouter); /* hanterar /, /form */

/**
 * Start the server on the specified port.
 */
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
