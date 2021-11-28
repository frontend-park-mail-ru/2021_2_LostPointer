const fs = require('fs');
const express = require('express');
const app = express();
const path = require('path');
import { parse } from 'node-html-parser';
import fetch from 'node-fetch';

const origin = 'https://lostpointer.site';
const api = '/api/v1'

const indexFile = fs.readFileSync(path.join(__dirname + '/../dist/index.html'));


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/../src/index.html'));
});

app.get(/^\/artist\/(\d+)$/gm, (req, res) => {
    const regex = /^\/artist\/(\d+)$/gm;
    const match = regex.exec(req.path);
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

            const document = parse(String(indexFile));
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

            res.send(document.toString());
        })
        .catch((error) => {
            res.sendFile(path.join(__dirname + '/../src/index.html'));
        });
});

app.get(/^\/album\/(\d+)$/gm, (req, res) => {
    const regex = /^\/album\/(\d+)$/gm;
    const match = regex.exec(req.path);
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

            const document = parse(String(indexFile));
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

            res.send(document.toString());
        })
        .catch((error) => {
            res.sendFile(path.join(__dirname + '/../src/index.html'));
        });
});
app.get(/^\/playlist\/(\d+)$/gm, (req, res) => {
    const regex = /^\/playlist\/(\d+)$/gm;
    const match = regex.exec(req.path);
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

            const document = parse(String(indexFile));
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

            res.send(document.toString());
        })
        .catch((error) => {
            res.sendFile(path.join(__dirname + '/../src/index.html'));
        });
});

app.listen(8888);
