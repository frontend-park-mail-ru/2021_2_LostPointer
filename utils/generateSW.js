const glob = require('glob');
const fs = require('fs');
const routerStoreModule = require('../src/services/router/routerStore.ts');
const routerStore = routerStoreModule.default

const cachedUrl = [
    ...Object.values(routerStore),
  glob.sync('./dist/*'),
  glob.sync('./src/static/**/*.*'),
].flat(Infinity).map((url) => {
  return url.replace('./dist', '').replace('./src', '');
}).join('\',\'');

const content = fs.readFileSync('./src/sw.js');
let contentString = String(content);
contentString = contentString.replace('[]', `['${cachedUrl}']`);

fs.writeFileSync('./dist/sw.js', contentString);
