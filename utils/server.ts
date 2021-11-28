const fs = require('fs');
var http = require('http');
const path = require('path');
import { parse } from 'node-html-parser';
import fetch from 'node-fetch';

const origin = 'https://lostpointer.site';
const api = '/api/v1'

const indexFile = String(fs.readFileSync(path.join(__dirname + '/../dist/index.html')));

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});

    let regex = /^\/artist\/(\d+)$/gm;
    let match = regex.exec(req.url);
    if (match) {
        const artistId = match[1];
        fetch(`${origin}${api}/artist/${artistId}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.message) {
                    res.sendFile(path.join(__dirname + '/../src/index.html'));
                    return;
                }

                const document = parse(indexFile);
                document.querySelector('meta[property="og:title"]')
                    .setAttribute('content', data.name);
                document.querySelector('meta[property="og:image"]')
                    .setAttribute(
                        'content',
                        `${origin}${data.avatar}`
                    );
                document.querySelector('meta[property="og:url"]')
                    .setAttribute('content', `${origin}${req.path}`);
                document.querySelector('meta[property="og:description"]')
                    .setAttribute('content', '');

                res.write(document.toString());
                res.end();
            })
            .catch((error) => {
                res.write(indexFile);
                res.end();
            });
    }
    regex = /^\/album\/(\d+)$/gm;
    match = regex.exec(req.url);
    if (match) {
        const albumId = match[1];
        fetch(`${origin}${api}/album/${albumId}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.message) {
                    res.sendFile(path.join(__dirname + '/../src/index.html'));
                    return;
                }

                const document = parse(indexFile);
                document.querySelector('meta[property="og:title"]')
                    .setAttribute('content', `${data.artist.name} - ${data.title}`);
                document.querySelector('meta[property="og:image"]')
                    .setAttribute(
                        'content',
                        `${origin}/static/artworks/${data.artwork}_512px.webp`
                    );
                document.querySelector('meta[property="og:url"]')
                    .setAttribute('content', `${origin}${req.path}`);
                document.querySelector('meta[property="og:description"]')
                    .setAttribute('content', '');

                res.write(document.toString());
                res.end();
            })
            .catch((error) => {
                res.write(indexFile);
                res.end();
            });
    }
    regex = /^\/playlist\/(\d+)$/gm;
    match = regex.exec(req.url);
    if (match) {
        const playlistId = match[1];


        fetch(`${origin}${api}/playlist/${playlistId}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.message) {
                    res.sendFile(path.join(__dirname + '/../src/index.html'));
                    return;
                }

                const document = parse(indexFile);
                document.querySelector('meta[property="og:title"]')
                    .setAttribute('content', `Playlist: ${data.title}`);
                document.querySelector('meta[property="og:image"]')
                    .setAttribute(
                        'content',
                        `${origin}${data.artwork}`
                    );
                document.querySelector('meta[property="og:url"]')
                    .setAttribute('content', `${origin}${req.path}`);
                document.querySelector('meta[property="og:description"]')
                    .setAttribute('content', '');

                res.write(document.toString());
                res.end();
            })
            .catch((error) => {
                res.write(indexFile);
                res.end();
            });
    }

}).listen(8888, function(){
    console.log("server start at port 8888"); //the server object listens on port 3000
});
