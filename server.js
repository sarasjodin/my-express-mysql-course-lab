const path = require('path');
const express = require('express');
const app = express();
const port = 3000;

const pagesRouter = require('./routes/pages');
const coursesRouter = require('./routes/courses');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static css och js files
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

app.use('/', pagesRouter); /* hanterar /about */
app.use('/', coursesRouter); /* hanterar /, /form */

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
