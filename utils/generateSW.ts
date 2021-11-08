const glob = require('glob');
const fs = require('fs');
import routerStore from '../src/services/router/routerStore';

const cachedUrl = [
    ...Object.values(routerStore),
  glob.sync('./dist/*'),
  glob.sync('./src/static/**/*.*', {'ignore': ['./src/static/**/*.css']}),
].flat(Infinity).map((url) => {
  return url.replace('./dist', '').replace('./src', '');
}).join('\',\'');

const content = fs.readFileSync('./src/sw.js');
let contentString = String(content);
contentString = contentString.replace('[]', `['${cachedUrl}']`);

fs.writeFileSync('./dist/sw.js', contentString);
