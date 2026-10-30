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
  // Schermata iniziale: logo sopra l'impero completo, prima del clic (GDD sezione 8).
  { name: '00-titolo', wait: 3 },
  // M2b: la Hacienda vuota, con il regalo e la sagoma del Campo 1 (skill arcade-idle, PS1–PS4).
  { name: '01-partenza', wait: 3 },
  // Situazioni preparate con window.__patron.prepare (src/debug/scenarios.ts).
  { name: '02-festa', prepare: 'festa', wait: 0.45 },
  { name: '03-primo-minuto', prepare: 'primo', wait: 2.5 },
  { name: '04-lontano', zoom: 1, wait: 2 },
  { name: '05-vicino', zoom: -2, wait: 2 },
  { name: '06-pila', zoom: 1, prepare: 'pila', wait: 2.5 },
  { name: '07-camion', prepare: 'camion', wait: 2 },
  { name: '08-pagamento', prepare: 'pagamento', wait: 1.5 },
  { name: '09-raccoglitore', prepare: 'raccoglitore', wait: 2.5 },
  { name: '10-lotto2', prepare: 'lotto2', wait: 2.5 },
  { name: '11-avanzato', prepare: 'avanzato', zoom: 1, wait: 3 },
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
// SHOT_ONLY=07-pila,11-avanzato fotografa solo quelle (lo zoom può differire dalla serie completa).
const only = process.env.SHOT_ONLY?.split(',');
let titleSkipped = false;
for (const shot of SHOTS) {
  if (only && !only.includes(shot.name)) continue;
  // Dopo la schermata iniziale si entra in partita senza animazione.
  if (shot.name !== '00-titolo' && !titleSkipped) {
    await page.evaluate(() => window.__patron.skipTitle());
    titleSkipped = true;
  }
  if (shot.prepare) await page.evaluate((n) => window.__patron.prepare(n), shot.prepare);
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
