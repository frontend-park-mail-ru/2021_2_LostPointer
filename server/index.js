const http = require('http');
const fs = require('fs');

const host = 'localhost';
const port = process.env.PORT || 8080;

const requestListener = (request, response) => {
  const path = request.url === '/' ? '/index.html' : request.url;
  fs.readFile(`.${path}`, (err, data) => {
    let responseData = data;
    if (err) {
      responseData = '404';
    }
    response.write(responseData);
    response.end();
  });
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
  console.log(`listening at http://${host}:${port}`);
});
