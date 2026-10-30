// Situazioni di gioco preparate per gli screenshot automatici (scripts/shot.mjs) e per il debug.
// Solo con ?debug=1. Non cambiano le regole: mettono lo stato in un punto preciso della partita.

import { BALANCE } from '../config/balance';
import { OFFICE, PRESSES, TRUCK, UNLOCK_PADS } from '../config/map';
import type { Bus, GameEvents } from '../core/bus';
import { createRng } from '../core/rng';
import { stepPhase1 } from '../sim/phase1';
import { createMoveContext, type GameState } from '../sim/state';

export type Scenario = 'festa' | 'primo' | 'pila' | 'camion' | 'pagamento' | 'raccoglitore' | 'lotto2' | 'avanzato' | 'raccolta' | 'ufficio';

function place(state: GameState, x: number, y: number): void {
  const facing = (-3 * Math.PI) / 4;
  Object.assign(state.player, { x, y, prevX: x, prevY: y, vx: 0, vy: 0, path: [], facing, prevFacing: facing });
}

/** Paga gli sblocchi fino all'indice `upTo` (escluso), come se il giocatore li avesse comprati. */
function unlockUpTo(state: GameState, upTo: number, bus: Bus<GameEvents>): void {
  const s = state.phase1;
  const ctx = { grid: createMoveContext(s).grid, rng: createRng(3) };
  s.piles = s.piles.filter((p) => p.id !== 'gift');
  while (s.nextUnlock < upTo) {
    const def = BALANCE.phase1.unlocks[s.nextUnlock]!;
    s.cash += def.cost;
    for (let i = 0; i < 90 && s.nextUnlock < upTo && BALANCE.phase1.unlocks[s.nextUnlock] === def; i++) {
      stepPhase1(s, UNLOCK_PADS[def.id], BALANCE.sim.step, bus, ctx);
    }
  }
  s.piles = s.piles.filter((p) => !p.id.startsWith('reward'));
  // Il camion è già arrivato lungo la strada.
  if (s.presses[0]!.unlocked) {
    s.truck.away = 0;
    s.truck.arrived = true;
  }
}

/** Indice di uno sblocco nella sequenza del GDD (sezione 5). */
const at = (id: string): number => BALANCE.phase1.unlocks.findIndex((u) => u.id === id);

export function prepareScenario(state: GameState, name: Scenario, bus: Bus<GameEvents>): void {
  const s = state.phase1;
  const press = PRESSES[0]!;
  s.stack.items = [];
  switch (name) {
    case 'festa': {
      // Il Campo 1 appena comprato: primo piano e coriandoli.
      unlockUpTo(state, at('field1') + 1, bus);
      place(state, 28.3, 21);
      break;
    }
    case 'primo': {
      // Fine del primo minuto: Campo 1 e Pressa 1, il camion alla porta, la sagoma del Campo 2.
      unlockUpTo(state, at('press1') + 1, bus);
      s.fields.forEach((f) => (f.ready = f.unlocked ? 5 : 0));
      s.presses[0]!.leaves = 3;
      s.stack.items = ['leaf', 'leaf', 'leaf'];
      s.cash = 5;
      place(state, 30, 26.8);
      break;
    }
    case 'pila': {
      // Pila mista piena davanti alla Pressa 1, con Foglie in lavorazione e Paste pronte.
      unlockUpTo(state, at('bonfire') + 1, bus);
      s.stack.items = ['leaf', 'leaf', 'paste', 'scrap'];
      s.presses[0]!.leaves = 6;
      s.presses[0]!.pastes = 5;
      s.presses[0]!.scraps = 3;
      s.fields.forEach((f) => (f.ready = f.unlocked ? 6 : 0));
      s.cash = 28;
      place(state, press.deposit.x + 0.3, press.deposit.y - 1.4);
      break;
    }
    case 'camion': {
      // Camion in viaggio e mazzette a terra da raccogliere.
      unlockUpTo(state, at('bonfire') + 1, bus);
      s.truck.load = 0;
      s.truck.away = 12;
      s.piles.push({ id: 'truck', x: TRUCK.cash.x, y: TRUCK.cash.y, value: 50 });
      s.sold = 10;
      place(state, TRUCK.deposit.x + 1.6, TRUCK.deposit.y - 1.8);
      break;
    }
    case 'pagamento': {
      // Tappetino del primo Raccoglitore pagato a metà: le mazzette volano dalla schiena.
      unlockUpTo(state, at('picker1'), bus);
      s.cash = 14;
      s.padPaid = 8;
      s.sold = 3;
      s.earned = 15;
      const pad = UNLOCK_PADS.picker1;
      place(state, pad.x, pad.y);
      break;
    }
    case 'raccoglitore': {
      // Un Raccoglitore addormentato vicino ai Campi; la sagoma della Nuova zona.
      unlockUpTo(state, at('picker1') + 1, bus);
      const w = s.workers[0]!;
      Object.assign(w, { x: 27.8, y: 20.6, prevX: 27.8, prevY: 20.6, asleep: true, phase: 'choose', task: null, path: [] });
      w.stack.items = ['leaf', 'leaf'];
      s.sold = 6;
      s.earned = 30;
      s.cash = 34;
      place(state, 29, 18);
      break;
    }
    case 'lotto2': {
      // La Hacienda allargata: il lotto 2 appena aperto, la sagoma del Campo 3.
      unlockUpTo(state, at('zone2') + 1, bus);
      s.cash = 50;
      place(state, 37, 20);
      break;
    }
    case 'ufficio': {
      // Davanti alla porta dell'Ufficio appena aperto: il pannello con Zaino (1 regalato), Scarpe e Guadagno.
      unlockUpTo(state, at('office') + 1, bus);
      s.cash = 75;
      place(state, OFFICE.door.x, OFFICE.door.y);
      break;
    }
    case 'raccolta': {
      // Sul vassoio del camion: le banconote volano dal mucchio al contatore in alto a destra (UX3).
      unlockUpTo(state, at('bonfire') + 1, bus);
      s.piles.push({ id: 'truck', x: TRUCK.cash.x, y: TRUCK.cash.y, value: 120 });
      s.cash = 10;
      place(state, TRUCK.cash.x, TRUCK.cash.y);
      break;
    }
    case 'avanzato': {
      // Fase 1 completa: tre Campi, due Presse, due Raccoglitori al lavoro.
      unlockUpTo(state, BALANCE.phase1.unlocks.length, bus);
      s.fields.forEach((f) => (f.ready = 5));
      s.presses.forEach((p) => {
        p.leaves = 6;
        p.pastes = 4;
        p.scraps = 2;
      });
      s.truck.load = 6;
      s.sold = 40;
      s.earned = 400;
      s.cash = 1340;
      place(state, 29, 20);
      break;
    }
  }
}
