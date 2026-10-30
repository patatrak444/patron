// Pannello dell'Ufficio (GDD sezione 12): si apre stando sul contorno davanti alla porta e si chiude uscendo
// (oppure con la X o Esc). Pannello a destra, largo il 35% dello schermo; nella Fase 1 una sola scheda,
// Giocatore, con tre schede grandi come in Pizza Ready e Burger Please: immagine, nome, tacche dei livelli,
// effetto "prima → dopo" e pulsante con il prezzo, verde se te lo puoi permettere e grigio se no.

import type { UpgradeId } from '../config/balance';
import { formatCash } from './hud';

export interface UpgradeView {
  readonly id: UpgradeId;
  readonly name: string;
  readonly level: number;
  readonly levels: number;
  /** Effetto adesso e al prossimo livello, già scritti ("6", "8"); `next` null se è al massimo. */
  readonly now: string;
  readonly next: string | null;
  readonly label: string;
  readonly cost: number | null;
}

export interface OfficePanel {
  /** Mostra il pannello con questi potenziamenti e questo contante, o lo nasconde con null. */
  set(list: readonly UpgradeView[] | null, cash: number): void;
  /** Vero se il giocatore l'ha chiuso con la X o Esc: resta chiuso finché non esce dal contorno. */
  readonly dismissed: boolean;
  reopen(): void;
}

const ICONS: Readonly<Record<UpgradeId, string>> = {
  // Zaino di tela con la tasca e la fascia azzurra.
  backpack:
    '<svg viewBox="0 0 64 64"><rect x="14" y="14" width="36" height="42" rx="10" fill="#c98d5c" stroke="#1b1b2f" stroke-width="4"/><path d="M24 14 Q32 4 40 14" fill="none" stroke="#1b1b2f" stroke-width="4"/><rect x="20" y="34" width="24" height="14" rx="4" fill="#e8d3a6" stroke="#1b1b2f" stroke-width="3"/><rect x="14" y="26" width="36" height="5" fill="#5ce1e6"/></svg>',
  // Scarpa da corsa con le righe della velocità.
  shoes:
    '<svg viewBox="0 0 64 64"><path d="M8 42 L8 30 Q20 30 26 22 L36 26 Q42 34 56 36 Q60 38 58 46 L10 46 Z" fill="#ff4f9a" stroke="#1b1b2f" stroke-width="4" stroke-linejoin="round"/><path d="M10 46 L58 46" stroke="#ffffff" stroke-width="5"/><path d="M2 20 H14 M4 28 H12" stroke="#1b1b2f" stroke-width="4" stroke-linecap="round"/></svg>',
  // Mazzetta con la freccia in su.
  profit:
    '<svg viewBox="0 0 64 64"><rect x="6" y="26" width="44" height="28" rx="5" fill="#2ecc52" stroke="#1b1b2f" stroke-width="4"/><rect x="23" y="26" width="10" height="28" fill="#e9ffd9"/><path d="M50 4 L62 18 H55 V30 H45 V18 H38 Z" fill="#ffc94a" stroke="#1b1b2f" stroke-width="3" stroke-linejoin="round"/></svg>',
};

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls: string, parent: HTMLElement): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  e.className = cls;
  parent.append(e);
  return e;
}

export function createOfficePanel(root: HTMLElement, onBuy: (id: UpgradeId) => void): OfficePanel {
  const panel = el('div', 'office', root);
  const head = el('div', 'office__head', panel);
  el('div', 'office__title', head).textContent = 'UFFICIO';
  const close = el('button', 'office__close', head);
  close.type = 'button';
  close.setAttribute('aria-label', 'Chiudi');
  close.textContent = '×';
  el('div', 'office__tab', panel).textContent = 'Giocatore';
  const cards = el('div', 'office__cards', panel);

  let dismissed = false;
  let key = '';
  const dismiss = (): void => {
    dismissed = true;
    panel.classList.remove('is-open');
  };
  close.addEventListener('click', dismiss);
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && panel.classList.contains('is-open')) dismiss();
  });
  // I clic sul pannello non muovono il personaggio (GDD sezione 3).
  panel.addEventListener('pointerdown', (e) => e.stopPropagation());

  const render = (list: readonly UpgradeView[], cash: number): void => {
    cards.textContent = '';
    for (const u of list) {
      const card = el('div', 'office__card', cards);
      el('div', 'office__icon', card).innerHTML = ICONS[u.id];
      const body = el('div', 'office__body', card);
      el('div', 'office__name', body).textContent = u.name;
      const ticks = el('div', 'office__ticks', body);
      for (let i = 0; i < u.levels; i++) el('span', i < u.level ? 'office__tick is-on' : 'office__tick', ticks);
      const fx = el('div', 'office__fx', body);
      fx.innerHTML = u.next === null ? `${u.label} <b>${u.now}</b>` : `${u.label} ${u.now} → <b>${u.next}</b>`;
      const buy = el('button', 'office__buy', card);
      buy.type = 'button';
      if (u.cost === null) {
        buy.textContent = 'MAX';
        buy.disabled = true;
        buy.classList.add('is-max');
      } else {
        const ok = cash >= u.cost;
        buy.innerHTML = `<span class="hud__bill office__bill" aria-hidden="true"></span>${formatCash(u.cost)}`;
        buy.disabled = !ok;
        buy.classList.toggle('is-ok', ok);
        buy.addEventListener('click', () => onBuy(u.id));
      }
    }
  };

  return {
    set(list, cash) {
      if (!list || dismissed) {
        panel.classList.remove('is-open');
        key = '';
        return;
      }
      panel.classList.add('is-open');
      // Si ridisegna solo quando cambia qualcosa: livelli, prezzi o la possibilità di comprare.
      const k = list.map((u) => `${u.id}:${u.level}:${u.cost}:${u.cost !== null && cash >= u.cost}`).join('|');
      if (k === key) return;
      key = k;
      render(list, cash);
    },
    get dismissed() {
      return dismissed;
    },
    reopen() {
      dismissed = false;
    },
  };
}
