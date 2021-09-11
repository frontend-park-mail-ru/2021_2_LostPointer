const http = require('http')
const fs = require('fs')

const host = 'localhost';
const port = 8008

const requestListener = (request, response) => {
    const path = request.url === '/' ? '/index.html' : request.url;
    fs.readFile(`.${path}`, (err, data) => {
        if (err) {
            data = "404"
        }
        response.write(data);
        response.end();
    });
};

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`listening at http://${host}:${port}}`)
})
