// Potenziamenti del giocatore nell'Ufficio (GDD sezioni 5 e 12): Zaino, Scarpe e Guadagno, 5 livelli
// ciascuno, costo del prossimo livello = base × 1,8^n (n = livelli già comprati). Logica pura.

import { BALANCE, type Phase1Config, type UpgradeDef, type UpgradeId } from '../config/balance';
import type { Bus, GameEvents } from '../core/bus';
import { addStars, type Phase1State } from './phase1';

export type UpgradeLevels = Record<UpgradeId, number>;

export function createUpgrades(): UpgradeLevels {
  return { backpack: 0, shoes: 0, profit: 0 };
}

export function upgradeDef(id: UpgradeId, cfg: Phase1Config = BALANCE.phase1): UpgradeDef {
  return cfg.upgrades.list.find((u) => u.id === id)!;
}

/** Livelli comprati di un potenziamento (i livelli regalati non contano: non si pagano). */
function bought(s: Phase1State, id: UpgradeId, cfg: Phase1Config): number {
  return s.upgrades[id] - (id === 'backpack' && s.office ? cfg.upgrades.giftBackpack : 0);
}

/** Prezzo del prossimo livello, o null se il potenziamento è al massimo. */
export function upgradeCost(s: Phase1State, id: UpgradeId, cfg: Phase1Config = BALANCE.phase1): number | null {
  const d = upgradeDef(id, cfg);
  if (s.upgrades[id] >= d.levels) return null;
  return Math.round(d.baseCost * cfg.upgrades.growth ** Math.max(0, bought(s, id, cfg)));
}

/** Capienza della pila con lo Zaino attuale. */
export function stackCapacity(s: Phase1State, cfg: Phase1Config = BALANCE.phase1): number {
  return cfg.stack.capacity + s.upgrades.backpack * upgradeDef('backpack', cfg).perLevel;
}

/** Moltiplicatore della velocità del giocatore con le Scarpe. */
export function speedFactor(s: Phase1State, cfg: Phase1Config = BALANCE.phase1): number {
  return 1 + s.upgrades.shoes * upgradeDef('shoes', cfg).perLevel;
}

/** Moltiplicatore dei prezzi di vendita con il Guadagno. */
export function profitFactor(s: Phase1State, cfg: Phase1Config = BALANCE.phase1): number {
  return 1 + s.upgrades.profit * upgradeDef('profit', cfg).perLevel;
}

/** Apertura dell'Ufficio: El Gordo regala il primo livello di Zaino, senza stelle. */
export function openOffice(s: Phase1State, cfg: Phase1Config = BALANCE.phase1): void {
  s.office = true;
  s.upgrades.backpack = Math.max(s.upgrades.backpack, cfg.upgrades.giftBackpack);
  s.stack.capacity = stackCapacity(s, cfg);
}

/** Compra il prossimo livello. Vero se è riuscito: soldi sufficienti, livello disponibile, Ufficio aperto. */
export function buyUpgrade(s: Phase1State, id: UpgradeId, bus: Bus<GameEvents>, cfg: Phase1Config = BALANCE.phase1): boolean {
  const cost = upgradeCost(s, id, cfg);
  if (!s.office || cost === null || s.cash < cost) return false;
  s.cash -= cost;
  s.upgrades[id]++;
  s.stack.capacity = stackCapacity(s, cfg);
  bus.emit('upgrade', { id, level: s.upgrades[id] });
  // +1 stella di Rispetto per ogni livello comprato (GDD sezione 5).
  addStars(s, cfg.respect.starsPerUpgrade, { x: s.officeAt.x, y: s.officeAt.y }, cfg, bus);
  return true;
}
