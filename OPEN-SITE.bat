@echo off
REM DealDoor — open as a real webpage (not source code)
cd /d "%~dp0"
title DealDoor local site

echo.
echo  DealDoor — starting local site...
echo  Leave this window OPEN while you browse.
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo ERROR: Node.js not found.
  echo Install Node from https://nodejs.org  OR open index.html in Chrome/Edge.
  echo.
  start "" "%~dp0index.html"
  pause
  exit /b 1
)

REM Prefer serve-local.js if present
if exist "%~dp0serve-local.js" (
  start "" "http://127.0.0.1:8787/"
  node "%~dp0serve-local.js"
) else (
  start "" "http://127.0.0.1:8787/"
  node -e "const http=require('http');const fs=require('fs');const path=require('path');const root=__dirname;const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.md':'text/plain; charset=utf-8'};http.createServer((req,res)=>{let p=decodeURIComponent((req.url||'/').split('?')[0]);if(p==='/')p='/index.html';const fp=path.normalize(path.join(root,p.replace(/^\//,'')));if(!fp.startsWith(root)||!fs.existsSync(fp)||fs.statSync(fp).isDirectory()){res.writeHead(404);return res.end('Not found');}res.writeHead(200,{'Content-Type':types[path.extname(fp)]||'application/octet-stream'});fs.createReadStream(fp).pipe(res);}).listen(8787,'127.0.0.1',()=>console.log('LIVE http://127.0.0.1:8787/'));"
)

echo.
echo Server stopped.
pause
