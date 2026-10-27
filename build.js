// Builds index.html (full document for local/offline use) from page.html, the artifact page body.
// Run: node build.js   then serve this folder, e.g.  npx serve .  or  python -m http.server
const fs = require('fs');
const path = require('path');
const page = fs.readFileSync(path.join(__dirname, 'page.html'), 'utf8');
const head = '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n' +
  '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n' +
  '<link rel="manifest" href="manifest.webmanifest">\n<link rel="icon" href="icon.svg" type="image/svg+xml">\n';
fs.writeFileSync(path.join(__dirname, 'index.html'), head + page.replace('<a class="skip"', '</head>\n<body>\n<a class="skip"') + '</body>\n</html>\n');
console.log('index.html written');
