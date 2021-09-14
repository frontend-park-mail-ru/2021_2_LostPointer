const express = require('express');

const app = express();
const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 3000;

const path = require('path');

app.use('/static', express.static(path.resolve(__dirname, 'src/static')));

app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'src/index.html'));
});

app.listen(port, host, () => console.log(`Listening on http://${host}:${port}`));
