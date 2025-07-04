const express = require('express');
const app = express();
const port = 3000;
const pool = require('./db/db');

app.get('/', (req, res) => {
  res.send('Server is running!');
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
