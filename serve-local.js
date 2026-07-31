/**
 * Tiny static server for DealDoor (correct HTML content-type).
 * Run: node serve-local.js
 * Open: http://127.0.0.1:8787/
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = Number(process.env.PORT) || 8787;
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon'
};

const server = http.createServer(function (req, res) {
  let p = decodeURIComponent((req.url || '/').split('?')[0]);
  if (p === '/') p = '/index.html';
  const fp = path.normalize(path.join(root, p.replace(/^\//, '')));
  if (!fp.startsWith(root) || !fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found: ' + p);
    return;
  }
  const ext = path.extname(fp).toLowerCase();
  res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
  fs.createReadStream(fp).pipe(res);
});

server.listen(port, '127.0.0.1', function () {
  console.log('DealDoor LIVE → http://127.0.0.1:' + port + '/');
  console.log('Press Ctrl+C to stop.');
});

server.on('error', function (err) {
  if (err && err.code === 'EADDRINUSE') {
    console.error('Port ' + port + ' is busy. Open http://127.0.0.1:' + port + '/ or close the other server.');
  } else {
    console.error(err);
  }
  process.exit(1);
});
