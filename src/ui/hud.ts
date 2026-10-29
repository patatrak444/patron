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

export function createHud(root: HTMLElement): Hud {
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

  const pause = el('div', 'pause-badge', root);
  pause.textContent = 'PAUSA · Spazio per riprendere';

  let lastCash = -1;
  let lastGoal = '';
  return {
    setPaused: (paused) => pause.classList.toggle('is-visible', paused),
    setCash(n) {
      if (n === lastCash) return;
      // Si gonfia a ogni incasso (GDD sezione 12).
      if (n > lastCash && lastCash >= 0) {
        cash.classList.remove('is-bump');
        void cash.offsetWidth;
        cash.classList.add('is-bump');
      }
      lastCash = n;
      cashText.textContent = formatCash(n);
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
