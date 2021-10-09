const express = require('express');

const app = express();
const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 3001;

const path = require('path');

app.use('/src', express.static('src'));

app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

// eslint-disable-next-line no-console
app.listen(port, host, () => console.log(`Listening on http://${host}:${port}`));
