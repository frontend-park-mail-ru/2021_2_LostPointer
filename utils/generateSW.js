const glob = require('glob');
const fs = require('fs');

const cachedUrl = [
  glob.sync('./dist/*'),
  glob.sync('./src/static/**/*'),
].flat(Infinity).join('\',\'');

const content = fs.readFileSync('./src/sw.js');
let contentString = String(content);
contentString = contentString.replace('[]', `['${cachedUrl}']`);

fs.writeFileSync('./dist/sw.js', contentString);
