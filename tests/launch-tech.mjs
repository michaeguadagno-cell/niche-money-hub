/**
 * Dual launch tech.html affiliate page; write evidence to SCRATCH.
 */
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import http from 'http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const scratch =
  process.env.SCRATCH ||
  'C:\\Users\\13475\\AppData\\Local\\Temp\\grok-goal-f0af001abcdd\\implementer';
fs.mkdirSync(scratch, { recursive: true });

function startServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      if (urlPath === '/') urlPath = '/tech.html';
      const filePath = path.join(root, urlPath.replace(/^\//, ''));
      if (!filePath.startsWith(root)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end('Not found');
          return;
        }
        const ext = path.extname(filePath);
        const types = {
          '.html': 'text/html; charset=utf-8',
          '.css': 'text/css; charset=utf-8',
          '.js': 'application/javascript; charset=utf-8'
        };
        res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
        res.end(data);
      });
    });
    server.listen(0, '127.0.0.1', () => {
      resolve({ server, base: `http://127.0.0.1:${server.address().port}` });
    });
    server.on('error', reject);
  });
}

async function runLaunch(browser, base, n) {
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(base + '/tech.html', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForSelector('[data-app-ready="true"]', { timeout: 10000 });
  const picks = await page.locator('#tech-picks .stack-card').count();
  const ctas = await page.locator('#tech-picks a.btn').count();
  const ads = await page.locator('[data-ad-slot]').count();
  const share = await page.locator('#tech-copy-btn').count();
  const href = await page.locator('#tech-picks a.btn').first().getAttribute('href');
  if (picks < 5) throw new Error('picks ' + picks);
  if (ctas < 5) throw new Error('ctas ' + ctas);
  if (ads < 1) throw new Error('no ad slot');
  if (share < 1) throw new Error('no share');
  if (!href || !href.includes('tag=')) throw new Error('CTA missing tag: ' + href);
  if (errors.length) throw new Error('errors ' + errors.join('; '));

  await page.locator('#tech-picks a.btn').first().click({ modifiers: [] });
  // may open popup
  page.once('popup', (p) => p.close().catch(() => {}));
  await page.locator('[data-ad-slot="tech-top"]').click();
  const events = await page.evaluate(() => {
    const raw = localStorage.getItem('nmh_click_events_v1');
    return raw ? JSON.parse(raw) : [];
  });
  if (events.length < 1) throw new Error('no click events');
  const shot = path.join(scratch, `launch-${n}.png`);
  await page.screenshot({ path: shot, fullPage: true });
  const log = [
    `launch=${n}`,
    `picks=${picks}`,
    `ctas=${ctas}`,
    `ads=${ads}`,
    `share=${share}`,
    `sampleHref=${href}`,
    `clicks=${events.length}`,
    `scriptErrors=${errors.length}`,
    `shot=${shot}`
  ].join('\n');
  fs.writeFileSync(path.join(scratch, `launch-${n}.log`), log + '\n');
  await page.close();
  return { picks, clicks: events.length };
}

const wrap = await startServer();
const browser = await chromium.launch({ headless: true });
try {
  const r1 = await runLaunch(browser, wrap.base, 1);
  const r2 = await runLaunch(browser, wrap.base, 2);
  fs.writeFileSync(
    path.join(scratch, 'launch-summary.log'),
    `OK tech launches r1=${JSON.stringify(r1)} r2=${JSON.stringify(r2)}\n`
  );
  console.log('LAUNCH TECH OK', r1, r2);
} finally {
  await browser.close();
  wrap.server.close();
}
