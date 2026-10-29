// Screenshot automatici del gioco (verifica visiva, CLAUDE.md).
// Uso: npm run shot            → build, avvio e schermate in artifacts/
//      npm run shot -- --dev   → usa il server di sviluppo già avviato su :5173
// Ogni schermata viene salvata insieme a disegni, triangoli e FPS letti dal pannello debug.

import { spawn } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const OUT = 'artifacts';
const PORT = 4179;
const useDev = process.argv.includes('--dev');
const base = useDev ? 'http://localhost:5173/' : `http://localhost:${PORT}/`;

/**
 * Inquadrature da fotografare: posizione del giocatore (coordinate del GDD), scatti di zoom
 * (−1 vicino, +1 lontano) e secondi di attesa. La partenza usa il punto di partenza vero.
 */
const SHOTS = [
  { name: '01-partenza', wait: 3 },
  { name: '02-campo1', at: [20, 9.5], wait: 2 },
  { name: '03-pressa-camion', at: [10, 23], wait: 2 },
  { name: '04-ufficio', at: [26, 23.5], wait: 2 },
  { name: '05-lontano', zoom: 1, wait: 2 },
  { name: '06-vicino', zoom: -2, wait: 2 },
];

function waitForServer(url, ms = 30000) {
  const end = Date.now() + ms;
  return new Promise((resolve, reject) => {
    const tick = async () => {
      try {
        const r = await fetch(url);
        if (r.ok) return resolve();
      } catch {}
      if (Date.now() > end) return reject(new Error(`server non raggiungibile: ${url}`));
      setTimeout(tick, 300);
    };
    tick();
  });
}

let server;
if (!useDev) {
  server = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' });
  await waitForServer(base);
}

await mkdir(OUT, { recursive: true });
const browser = await chromium.launch({
  args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const errors = [];
page.on('pageerror', (e) => errors.push(String(e)));
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));

page.setDefaultTimeout(180000);
await page.goto(`${base}?debug=1${process.env.SHOT_QUERY ?? ''}`);
await page.waitForSelector('canvas');

const report = [];
await page.waitForFunction(() => window.__patron, null, { timeout: 180000 });
for (const shot of SHOTS) {
  if (shot.at) await page.evaluate(([x, y]) => window.__patron.setPlayer(x, y), shot.at);
  if (shot.zoom) await page.evaluate((z) => window.__patron.zoom(z), shot.zoom);
  await page.waitForTimeout(shot.wait * 1000);
  // Due fotogrammi completi dopo lo spostamento, poi le misure.
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const stats = await page.evaluate(() => {
    const read = (k) => document.querySelector(`[data-${k}]`)?.textContent ?? '–';
    return { fps: read('fps'), disegni: read('calls'), triangoli: read('tris'), posizione: read('pos') };
  });
  const budget = await page.evaluate(() => window.__patron.budget());
  // Il pannello debug si nasconde nello scatto pulito, poi torna visibile.
  await page.evaluate(() => document.querySelector('.debug')?.setAttribute('style', 'display:none'));
  await page.screenshot({ path: `${OUT}/${shot.name}.png`, timeout: 180000 });
  await page.evaluate(() => document.querySelector('.debug')?.removeAttribute('style'));
  report.push({ shot: shot.name, ...stats, budget });
  console.log(shot.name, stats);
}

await writeFile(`${OUT}/report.json`, JSON.stringify({ report, errors }, null, 2));
if (errors.length) console.log('ERRORI NEL BROWSER:\n' + errors.join('\n'));
await browser.close();
server?.kill();
process.exit(errors.length ? 1 : 0);
