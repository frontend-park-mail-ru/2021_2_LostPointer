const glob = require('glob');
const fs = require('fs');
// const routerStore = require('../src/services/router/routerStore');

const cachedUrl = [
    // TODO: скачать шрифты и собирать их в сборке
    'https://fonts.googleapis.com/css2?family=Montserrat:wght@100;400;500;600;700;800&display=swap',
    'https://fonts.googleapis.com/css2?family=Montserrat:wght@100;200;300;400;700;800&display=swap',
    ' https://fonts.googleapis.com/css2?family=Oswald:wght@350&display=swap',
    '/', '/signup', '/signin',
    // ...Object.values(routerStore),
  glob.sync('./dist/*'),
  glob.sync('./src/static/**/*.*'),
].flat(Infinity).map((url) => {
  return url.replace('./dist', '').replace('./src', '');
}).join('\',\'');

const content = fs.readFileSync('./src/sw.js');
let contentString = String(content);
contentString = contentString.replace('[]', `['${cachedUrl}']`);

fs.writeFileSync('./dist/sw.js', contentString);
