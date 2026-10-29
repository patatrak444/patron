// Situazioni di gioco preparate per gli screenshot automatici (scripts/shot.mjs) e per il debug.
// Solo con ?debug=1. Non cambiano le regole: mettono lo stato in un punto preciso della partita.

import { BALANCE } from '../config/balance';
import { PRESSES, TRUCK, UNLOCK_PADS } from '../config/map';
import type { Bus, GameEvents } from '../core/bus';
import { createRng } from '../core/rng';
import { stepPhase1 } from '../sim/phase1';
import { createMoveContext, type GameState } from '../sim/state';

export type Scenario = 'pila' | 'camion' | 'pagamento' | 'raccoglitore' | 'avanzato';

function place(state: GameState, x: number, y: number): void {
  Object.assign(state.player, { x, y, prevX: x, prevY: y, vx: 0, vy: 0, path: [] });
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
}

export function prepareScenario(state: GameState, name: Scenario, bus: Bus<GameEvents>): void {
  const s = state.phase1;
  const press = PRESSES[0]!;
  s.stack.items = [];
  switch (name) {
    case 'pila': {
      // Pila mista piena davanti alla Pressa 1, con Foglie in lavorazione e Paste pronte.
      unlockUpTo(state, 1, bus);
      s.stack.items = ['leaf', 'leaf', 'paste', 'scrap'];
      s.presses[0]!.leaves = 6;
      s.presses[0]!.pastes = 5;
      s.presses[0]!.scraps = 3;
      s.fields.forEach((f) => (f.ready = f.unlocked ? 6 : 0));
      place(state, press.deposit.x + 0.6, press.deposit.y - 1.4);
      break;
    }
    case 'camion': {
      // Camion in viaggio e mazzette a terra da raccogliere.
      unlockUpTo(state, 1, bus);
      s.truck.load = 0;
      s.truck.away = 12;
      s.piles.push({ id: 'truck', x: TRUCK.cash.x, y: TRUCK.cash.y, value: 50 });
      s.sold = 10;
      place(state, TRUCK.deposit.x + 2.2, TRUCK.deposit.y - 1.5);
      break;
    }
    case 'pagamento': {
      // Tappetino del primo Raccoglitore pagato a metà.
      unlockUpTo(state, 1, bus);
      s.cash = 12;
      s.padPaid = 15;
      s.sold = 3;
      s.earned = 15;
      const pad = UNLOCK_PADS.picker1;
      place(state, pad.x - 1.6, pad.y + 0.2);
      break;
    }
    case 'raccoglitore': {
      // Un Raccoglitore addormentato vicino ai Campi.
      unlockUpTo(state, 2, bus);
      const w = s.workers[0]!;
      Object.assign(w, { x: 17.5, y: 8.6, prevX: 17.5, prevY: 8.6, asleep: true, phase: 'choose', task: null, path: [] });
      w.stack.items = ['leaf', 'leaf'];
      s.sold = 6;
      s.earned = 30;
      place(state, 20.5, 6.6);
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
      place(state, 17, 20);
      break;
    }
  }
}
