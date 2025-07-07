/**
 * @file server.js
 * @description Entry point for the Express application.
 * Sets up middleware, static files, EJS templating, and routing.
 */

/**
 * Load environment variables from a .env file into process.env.
 */
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

/**
 * Import core modules and initialize Express.
 * - `path`: Node.js core module for handling file paths.
 * - `express`: Web framework used to build the server.
 * - `app`: The main Express application instance.
 */
const path = require('path');
const express = require('express');
const app = express();

/**
 * Define the port number using environment variable or fallback to 3000.
 * For production environments the port is dynamically assigned.
 */
const port = process.env.PORT || 3000;

// Help function to set flash messages
app.use((req, res, next) => {
  req.flash = (type, message) => {
    if (!req.session.messages) {
      req.session.messages = {};
    }
    if (!req.session.messages[type]) {
      req.session.messages[type] = [];
    }
    req.session.messages[type].push(message);
  };
  next();
});

/**
 * Set up session handling using express-session.
 * Stores session data server-side and enables flash messaging.
 * - `secret`: Used to sign the session ID cookie.
 * - `resave`: Avoid resaving unchanged sessions.
 * - `saveUninitialized`: Save new but unmodified sessions.
 */
const session = require('express-session');

if (!process.env.SESSION_SECRET) {
  console.error('SESSION_SECRET is missing. Using a default secret.');
  process.exit(1); // Exit if session secret is missing
}
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'defaultSecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production' // Endast i produktion, sätt cookien som secure (enbart för HTTPS)
    }
  })
);

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
 * @middleware
 * Makes flash messages available in all EJS views via `messages`.
 * Enables display of success and error messages after redirects.
 */
app.use((req, res, next) => {
  req.flash = (type, message) => {
    if (!req.session.messages) {
      req.session.messages = {};
    }
    if (!req.session.messages[type]) {
      req.session.messages[type] = [];
    }
    req.session.messages[type].push(message);
  };
  next();
});

app.use((req, res, next) => {
  res.locals.messages = req.session.messages || {};
  delete req.session.messages;
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
