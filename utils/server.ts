const fs = require('fs');
var http = require('http');
const path = require('path');
import { parse } from 'node-html-parser';
import fetch from 'node-fetch';

const origin = 'https://lostpointer.site';
const api = '/api/v1';

const indexFile = String(
    fs.readFileSync(path.join(__dirname + '/../dist/index.html'))
);

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });

    const artistRegex = /^\/artist\/(\d+)$/gm;
    const albumRegex = /^\/album\/(\d+)$/gm;
    const playlistRegex = /^\/playlist\/(\d+)$/gm;
    const artistMatch = artistRegex.exec(req.url);
    const albumMatch = albumRegex.exec(req.url);
    const playlistMatch = playlistRegex.exec(req.url);
    if (artistMatch) {
        const artistId = artistMatch[1];
        fetch(`${origin}${api}/artist/${artistId}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.message) {
                    res.write(indexFile);
                    res.end();
                    return;
                }

                const document = parse(indexFile);
                document
                    .querySelector('meta[property="og:title"]')
                    .setAttribute('content', data.name);
                document
                    .querySelector('meta[property="og:image"]')
                    .setAttribute(
                        'content',
                        `${origin}${data.avatar}`.replace('.webp', '.jpg')
                    );
                document
                    .querySelector('meta[property="og:url"]')
                    .setAttribute('content', `${origin}${req.url}`);
                document
                    .querySelector('meta[property="og:description"]')
                    .setAttribute('content', '');

                res.write(document.toString());
                res.end();
            })
            .catch((error) => {
                res.write(indexFile);
                res.end();
            });
    } else if (albumMatch) {
        const albumId = albumMatch[1];
        fetch(`${origin}${api}/album/${albumId}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.message) {
                    res.write(indexFile);
                    res.end();
                    return;
                }

                const document = parse(indexFile);
                document
                    .querySelector('meta[property="og:title"]')
                    .setAttribute(
                        'content',
                        `${data.artist.name} - ${data.title}`
                    );
                document
                    .querySelector('meta[property="og:image"]')
                    .setAttribute(
                        'content',
                        `${origin}/static/artworks/${data.artwork}_512px.webp`.replace(
                            '.webp',
                            '.jpg'
                        )
                    );
                document
                    .querySelector('meta[property="og:url"]')
                    .setAttribute('content', `${origin}${req.url}`);
                document
                    .querySelector('meta[property="og:description"]')
                    .setAttribute('content', '');

                res.write(document.toString());
                res.end();
            })
            .catch((error) => {
                res.write(indexFile);
                res.end();
            });
    } else if (playlistMatch) {
        const playlistId = playlistMatch[1];

        fetch(`${origin}${api}/playlists/${playlistId}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                if (data.message) {
                    res.write(indexFile);
                    res.end();
                    return;
                }

                const document = parse(indexFile);
                document
                    .querySelector('meta[property="og:title"]')
                    .setAttribute('content', `Playlist: ${data.title}`);
                document
                    .querySelector('meta[property="og:image"]')
                    .setAttribute(
                        'content',
                        `${origin}${data.artwork}`.replace('.webp', '.jpg')
                    );
                document
                    .querySelector('meta[property="og:url"]')
                    .setAttribute('content', `${origin}${req.url}`);
                document
                    .querySelector('meta[property="og:description"]')
                    .setAttribute('content', '');

                res.write(document.toString());
                res.end();
            })
            .catch((error) => {
                res.write(indexFile);
                res.end();
            });
    } else {
        res.write(indexFile);
        res.end();
    }
}).listen(8888, function () {
    console.log('server start at port 8888'); //the server object listens on port 3000
});
