/**
 * Launch index.html twice via Playwright; assert niches, CTAs, ad slots, click store.
 * Usage: node tests/launch-verify.mjs
 * Evidence written to SCRATCH env or default implementer dir.
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
  'C:\\Users\\13475\\AppData\\Local\\Temp\\grok-goal-f3884b76889a\\implementer';

fs.mkdirSync(scratch, { recursive: true });

function contentType(filePath) {
  if (filePath.endsWith('.html')) return 'text/html; charset=utf-8';
  if (filePath.endsWith('.css')) return 'text/css; charset=utf-8';
  if (filePath.endsWith('.js')) return 'application/javascript; charset=utf-8';
  return 'application/octet-stream';
}

function startServer() {
  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      if (urlPath === '/') urlPath = '/index.html';
      const filePath = path.join(root, urlPath.replace(/^\//, ''));
      if (!filePath.startsWith(root)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
      }
      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end('Not found: ' + urlPath);
          return;
        }
        res.writeHead(200, { 'Content-Type': contentType(filePath) });
        res.end(data);
      });
    });
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({ server, base: `http://127.0.0.1:${port}` });
    });
    server.on('error', reject);
  });
}

async function runLaunch(browser, base, launchNum) {
  const logLines = [];
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (err) => errors.push(String(err)));
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push('console: ' + msg.text());
  });

  await page.goto(base + '/index.html', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForSelector('[data-app-ready="true"]', { timeout: 10000 });

  const nicheCards = await page.locator('.niche-card').count();
  const primaryCtas = await page.locator('.niche-card__cta').count();
  const adSlots = await page.locator('[data-ad-slot]').count();
  const affiliateLinks = await page.locator('[data-monetization="affiliate"]').count();
  const featured = await page.locator('#featured-partner a.btn').count();
  const leadForm = await page.locator('#lead-form').count();
  const gridText = await page.locator('#niche-grid').innerText();

  logLines.push(`launch=${launchNum}`);
  logLines.push(`nicheCards=${nicheCards}`);
  logLines.push(`primaryCtas=${primaryCtas}`);
  logLines.push(`adSlots=${adSlots}`);
  logLines.push(`affiliateLinks=${affiliateLinks}`);
  logLines.push(`featuredCta=${featured}`);
  logLines.push(`leadForm=${leadForm}`);
  logLines.push(`gridTextLength=${gridText.length}`);
  logLines.push(`scriptErrors=${errors.length}`);
  if (errors.length) logLines.push('errors=' + JSON.stringify(errors));

  // Assert structure
  if (nicheCards < 6) throw new Error('Expected >=6 niche cards, got ' + nicheCards);
  if (primaryCtas < 6) throw new Error('Expected >=6 primary CTAs, got ' + primaryCtas);
  if (adSlots < 2) throw new Error('Expected >=2 ad slots, got ' + adSlots);
  if (affiliateLinks < 6) throw new Error('Expected affiliate links, got ' + affiliateLinks);
  if (featured < 1) throw new Error('Missing featured partner CTA');
  if (leadForm < 1) throw new Error('Missing lead form');
  if (gridText.length < 200) throw new Error('Niche grid content too thin: ' + gridText.length);
  if (errors.length) throw new Error('Script errors: ' + errors.join('; '));

  // Check first CTA has tracking params
  const href = await page.locator('.niche-card__cta').first().getAttribute('href');
  logLines.push(`sampleCtaHref=${href}`);
  if (!href || !href.includes('ref=') || !href.includes('utm_source=')) {
    throw new Error('CTA missing tracking params: ' + href);
  }

  // Drive outbound click (popup) — record happens on click before navigate
  const [popup] = await Promise.all([
    page.waitForEvent('popup', { timeout: 10000 }).catch(() => null),
    page.locator('.niche-card__cta').first().click()
  ]);
  if (popup) await popup.close().catch(() => {});

  // Drive ad-slot click
  await page.locator('[data-ad-slot="hero-sidebar"]').click();

  // Read localStorage click store
  const events = await page.evaluate(() => {
    const raw = localStorage.getItem('nmh_click_events_v1');
    return raw ? JSON.parse(raw) : [];
  });
  logLines.push(`clickEvents=${events.length}`);
  logLines.push(`clickSample=${JSON.stringify(events.slice(-2))}`);

  if (events.length < 2) {
    throw new Error('Expected >=2 recorded clicks after CTA + ad slot, got ' + events.length);
  }
  const hasOutbound = events.some((e) => e.kind === 'outbound' && e.destination && e.label);
  const hasAd = events.some((e) => e.kind === 'ad-slot' && e.destination && e.label);
  if (!hasOutbound) throw new Error('Missing outbound click event with destination+label');
  if (!hasAd) throw new Error('Missing ad-slot click event with destination+label');

  const shotPath = path.join(scratch, `launch-${launchNum}.png`);
  await page.screenshot({ path: shotPath, fullPage: true });
  logLines.push(`screenshot=${shotPath}`);

  const logPath = path.join(scratch, `launch-${launchNum}.log`);
  fs.writeFileSync(logPath, logLines.join('\n') + '\n', 'utf8');
  await page.close();
  return { logPath, shotPath, events: events.length, nicheCards };
}

async function main() {
  let serverWrap;
  try {
    serverWrap = await startServer();
    const browser = await chromium.launch({ headless: true });
    try {
      const r1 = await runLaunch(browser, serverWrap.base, 1);
      const r2 = await runLaunch(browser, serverWrap.base, 2);
      const summary = [
        'LAUNCH VERIFY OK',
        `base=${serverWrap.base}`,
        `launch1 niches=${r1.nicheCards} clicks=${r1.events} log=${r1.logPath}`,
        `launch2 niches=${r2.nicheCards} clicks=${r2.events} log=${r2.logPath}`
      ].join('\n');
      const summaryPath = path.join(scratch, 'launch-summary.log');
      fs.writeFileSync(summaryPath, summary + '\n', 'utf8');
      console.log(summary);
    } finally {
      await browser.close();
    }
  } catch (err) {
    const failPath = path.join(scratch, 'launch-env-fail.log');
    fs.writeFileSync(
      failPath,
      'LAUNCH FAILED\n' + (err && err.stack ? err.stack : String(err)) + '\n',
      'utf8'
    );
    console.error(err);
    process.exitCode = 1;
  } finally {
    if (serverWrap && serverWrap.server) serverWrap.server.close();
  }
}

main();
