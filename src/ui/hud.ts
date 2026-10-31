// Elementi fissi dell'interfaccia (GDD sezione 12), disposti come in Pizza Ready e Burger Please:
// ingranaggio in alto a sinistra, Rispetto e frase dell'obiettivo al centro, contante a destra.
// Più la freccia al bordo dello schermo quando l'obiettivo è fuori vista, e l'indicatore di pausa.

import '@fontsource/baloo-2/700.css';
import '@fontsource/baloo-2/800.css';

export interface Hud {
  setPaused(paused: boolean): void;
  setCash(cash: number): void;
  setRespect(level: number, stars: number, next: number | null): void;
  setGoal(text: string): void;
  /** Posizione in pixel del bersaglio fuori schermo, o null per nascondere la freccia al bordo. */
  setEdgeArrow(at: { x: number; y: number } | null): void;
  /**
   * Banconote che volano dal punto (x, y) dello schermo alla pillola del contante (GDD sezione 3, UX3):
   * i soldi raccolti non restano addosso. Partono una a una dalla coda; il contatore sale quando arrivano.
   */
  flyBills(x: number, y: number, value: number): void;
  /** Avanza la coda delle banconote: si chiama a ogni fotogramma. */
  update(dt: number): void;
  /** Mostra per un attimo "Audio sì" o "Audio no" (tasto M, GDD sezione 3). */
  setMuted(muted: boolean): void;
  /** Pallino rosso sopra l'Ufficio quando un potenziamento si può comprare (GDD sezione 12), in pixel. */
  setOfficeBadge(at: { x: number; y: number } | null): void;
}

/** Numero abbreviato: 950 · 1,2K · 3,45M (GDD sezione 12). */
export function formatCash(n: number): string {
  if (n < 1000) return `${Math.floor(n)}`;
  const fmt = (v: number, d: number): string => v.toFixed(d).replace(/\.?0+$/, '').replace('.', ',');
  if (n < 1e6) return `${fmt(n / 1000, n < 1e4 ? 2 : 1)}K`;
  return `${fmt(n / 1e6, 2)}M`;
}

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, parent: HTMLElement): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  e.className = cls;
  parent.append(e);
  return e;
}

export interface HudFeel {
  readonly billValue: number;
  readonly billEvery: number;
  readonly collectBills: number;
  readonly collectFlySeconds: number;
}

export function createHud(root: HTMLElement, feel: HudFeel): Hud {
  const hud = el('div', 'hud', root);

  const gear = el('button', 'hud__gear', hud);
  gear.type = 'button';
  gear.title = 'Impostazioni';
  gear.setAttribute('aria-label', 'Impostazioni');
  gear.innerHTML =
    '<svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true"><path fill="currentColor" d="M19.4 13a7.6 7.6 0 0 0 0-2l2.1-1.6-2-3.5-2.5 1a7.4 7.4 0 0 0-1.7-1L15 3.3h-4l-.4 2.6a7.4 7.4 0 0 0-1.7 1l-2.5-1-2 3.5L6.6 11a7.6 7.6 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1a7.4 7.4 0 0 0 1.7 1l.4 2.6h4l.4-2.6a7.4 7.4 0 0 0 1.7-1l2.5 1 2-3.5zM13 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" transform="translate(-1 0)"/></svg>';

  const center = el('div', 'hud__center', hud);
  const respect = el('div', 'hud__respect', center);
  const star = el('div', 'hud__star', respect);
  const bar = el('div', 'hud__bar', respect);
  const fill = el('div', 'hud__bar-fill', bar);
  const barText = el('div', 'hud__bar-text', bar);
  const goal = el('div', 'hud__goal', center);

  const cash = el('div', 'hud__cash', hud);
  const bill = el('span', 'hud__bill', cash);
  bill.setAttribute('aria-hidden', 'true');
  const cashText = el('span', 'hud__cash-text', cash);

  const edge = el('div', 'hud__edge', root);
  edge.innerHTML = '<svg viewBox="0 0 40 40" width="64" height="64"><path d="M8 20 L30 8 L24 20 L30 32 Z" fill="#ffd23a" stroke="#1b1b2f" stroke-width="3" stroke-linejoin="round"/></svg>';

  const badge = el('div', 'hud__badge', root);
  badge.textContent = '!';

  const pause = el('div', 'pause-badge', root);
  pause.textContent = 'PAUSA · Spazio per riprendere';

  // Contante mostrato: insegue quello vero. Le spese scendono subito; i guadagni che arrivano in volo
  // salgono quando la banconota tocca la pillola (revisione del 30 ottobre 2026).
  let real = -1;
  let shown = -1;
  let inFlight = 0;
  let queueTimer = 0;
  const queue: { x: number; y: number; value: number }[] = [];
  let lastGoal = '';
  let muteTimer = 0;
  const show = (n: number, bump: boolean): void => {
    if (bump) {
      cash.classList.remove('is-bump');
      void cash.offsetWidth;
      cash.classList.add('is-bump');
    }
    shown = n;
    cashText.textContent = formatCash(n);
  };
  const launch = (from: { x: number; y: number; value: number }): void => {
    const r = bill.getBoundingClientRect();
    const tx = r.left + r.width / 2;
    const ty = r.top + r.height / 2;
    const b = el('span', 'hud__bill hud__bill--fly', root);
    b.style.left = `${from.x - 22}px`;
    b.style.top = `${from.y - 14}px`;
    const dx = tx - from.x;
    const dy = ty - from.y;
    const anim = b.animate(
      [
        { transform: 'translate(0, 0) rotate(-12deg) scale(0.75)' },
        { transform: `translate(${dx * 0.35}px, ${dy * 0.35 - 70}px) rotate(18deg) scale(1.05)`, offset: 0.4 },
        { transform: `translate(${dx}px, ${dy}px) rotate(-12deg) scale(0.85)` },
      ],
      { duration: feel.collectFlySeconds * 1000, easing: 'cubic-bezier(0.4, 0, 0.7, 1)' },
    );
    anim.onfinish = () => {
      b.remove();
      inFlight -= from.value;
      show(Math.min(real, shown + from.value), true);
    };
  };
  return {
    setPaused: (paused) => pause.classList.toggle('is-visible', paused),
    setCash(n) {
      if (n === real) return;
      real = n;
      // Soldi arrivati senza volo (premi, debug) o spesi: il numero si allinea subito.
      if (shown < 0 || n < shown || n - inFlight > shown) show(Math.max(0, n - inFlight), n > shown && shown >= 0);
    },
    flyBills(x, y, value) {
      inFlight += value;
      // Una banconota ogni billValue dollari; oltre collectBills in coda, l'ultima porta anche il resto.
      let left = value;
      while (left > 0) {
        const v = Math.min(left, feel.billValue);
        const last = queue[queue.length - 1];
        if (queue.length >= feel.collectBills && last) last.value += v;
        else queue.push({ x, y, value: v });
        left -= v;
      }
    },
    setMuted(muted) {
      pause.textContent = muted ? 'Audio no · M per riattivarlo' : 'Audio sì';
      pause.classList.add('is-visible');
      clearTimeout(muteTimer);
      muteTimer = window.setTimeout(() => {
        pause.classList.remove('is-visible');
        pause.textContent = 'PAUSA · Spazio per riprendere';
      }, 1200);
    },
    setOfficeBadge(at) {
      badge.classList.toggle('is-visible', at !== null);
      if (at) badge.style.transform = `translate(${at.x - 18}px, ${at.y - 18}px)`;
    },
    update(dt) {
      queueTimer -= dt;
      while (queue.length > 0 && queueTimer <= 0) {
        launch(queue.shift()!);
        queueTimer += feel.billEvery;
      }
      if (queue.length === 0) queueTimer = Math.max(queueTimer, 0);
    },
    setRespect(level, stars, next) {
      star.textContent = `${level}`;
      fill.style.width = next ? `${Math.min(100, (stars / next) * 100)}%` : '100%';
      barText.textContent = next ? `${stars}/${next}` : `${stars}`;
    },
    setGoal(text) {
      if (text === lastGoal) return;
      lastGoal = text;
      goal.textContent = text;
      goal.classList.remove('is-new');
      void goal.offsetWidth;
      goal.classList.add('is-new');
    },
    setEdgeArrow(at) {
      edge.classList.toggle('is-visible', at !== null);
      if (!at) return;
      const cx = innerWidth / 2;
      const cy = innerHeight / 2;
      const ang = Math.atan2(at.y - cy, at.x - cx);
      const m = 48;
      // In alto c'è l'interfaccia: la freccia resta sotto.
      const top = 110;
      // Proiezione del bersaglio sul bordo, con un margine.
      const sx = (cx - m) / Math.max(1e-6, Math.abs(Math.cos(ang)));
      const sy = (Math.sin(ang) < 0 ? cy - top : cy - m) / Math.max(1e-6, Math.abs(Math.sin(ang)));
      const d = Math.min(sx, sy);
      edge.style.transform = `translate(${cx + Math.cos(ang) * d - 32}px, ${cy + Math.sin(ang) * d - 32}px) rotate(${ang + Math.PI}rad)`;
    },
  };
}
