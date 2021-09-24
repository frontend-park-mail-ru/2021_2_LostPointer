const express = require('express');

const app = express();
const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 3000;

const path = require('path');

app.use('/src', express.static('src'));

app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});
app.post('/signin', (req, res) => {
  res.sendStatus(200);
});
app.post('/signup', (req, res) => {
  res.sendStatus(200);
});

app.listen(port, host, () => console.log(`Listening on http://${host}:${port}`));
