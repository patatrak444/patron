import { describe, expect, it } from 'vitest';
import { BALANCE } from '../src/config/balance';
import { BONFIRE, PRESSES, TRUCK, UNLOCK_PADS, VALLEY, type MapPoint } from '../src/config/map';
import { createBus, type GameEvents } from '../src/core/bus';
import { createRng } from '../src/core/rng';
import { createNavGrid, findPath } from '../src/sim/pathfinding';
import { fieldMat, handsStuck, leavesStuck, nextUnlockDef, stepPhase1 } from '../src/sim/phase1';
import { countOf } from '../src/sim/stack';
import { createInitialState, createMoveContext } from '../src/sim/state';

const DT = BALANCE.sim.step;
const cfg = BALANCE.phase1;

/**
 * Giocatore automatico "medio": va sempre al passo più utile, cammina a 4 m/s lungo i percorsi,
 * e ci mette 0,5 s per decidere a ogni tappa. Serve a confrontare il ritmo con i minuti obiettivo
 * della sezione 5 del GDD, non a giocare in modo perfetto.
 */
function playPhase1(maxSeconds: number) {
  const state = createInitialState(42);
  const s = state.phase1;
  // Il giocatore automatico usa la stessa griglia dei percorsi del gioco: tra le piante si cammina.
  const botGrid = () => {
    const m = createMoveContext(s);
    return createNavGrid(VALLEY.width, VALLEY.depth, m.shapes, BALANCE.nav.pad, m.areas);
  };
  const ctx = { grid: botGrid() };
  const bus = createBus<GameEvents>();
  const rng = createRng(1);
  const unlockedAt: Record<string, number> = {};
  // Durante la festa dello sblocco la camera è sull'oggetto nuovo: il giocatore guarda e aspetta (GDD 3).
  let festa = 0;
  bus.on('unlock', ({ id }) => {
    unlockedAt[id] = state.time;
    festa = BALANCE.feel.festaSeconds;
  });
  let firstSale = -1;
  bus.on('truck:sale', () => firstSale < 0 && (firstSale = state.time));
  let pos: MapPoint = { x: state.player.x, y: state.player.y };
  let path: MapPoint[] = [];
  let think = 0;

  const goal = (): MapPoint => {
    const gift = s.piles.find((p) => p.id === 'gift');
    if (gift) return gift;
    const next = nextUnlockDef(s);
    if (next && s.cash + s.padPaid >= next.cost) return UNLOCK_PADS[next.id];
    const pile = s.piles.find((p) => p.value >= 15);
    if (pile && s.stack.items.length === 0) return pile;
    if (countOf(s.stack, 'scrap') > 0) return BONFIRE.mat;
    const full = s.presses.find((p) => p.unlocked && p.scraps >= 4);
    if (full && s.stack.items.length === 0) return PRESSES.find((p) => p.id === full.id)!.scrap;
    const sleeper = s.workers.find((w) => w.asleep);
    if (sleeper && s.stack.items.length === 0) return sleeper;
    if (countOf(s.stack, 'paste') > 0 && s.truck.away === 0 && s.truck.arrived) return TRUCK.deposit;
    if (handsStuck(s)) return BONFIRE.mat;
    const out = s.presses.find((p) => p.unlocked && p.pastes > 0);
    if (out && s.stack.items.length < s.stack.capacity && (countOf(s.stack, 'leaf') === 0 || leavesStuck(s))) return PRESSES.find((p) => p.id === out.id)!.output;
    if (countOf(s.stack, 'leaf') > 0 && !leavesStuck(s) && (s.stack.items.length >= s.stack.capacity || s.fields.every((f) => !f.unlocked || f.ready === 0))) {
      const press = s.presses.filter((p) => p.unlocked).sort((a, b) => a.leaves - b.leaves)[0]!;
      return PRESSES.find((p) => p.id === press.id)!.deposit;
    }
    const field = s.fields.filter((f) => f.unlocked).sort((a, b) => b.ready - a.ready)[0];
    return field ? fieldMat(field.id) : UNLOCK_PADS.field1;
  };

  let target: MapPoint | null = null;
  while (state.time < maxSeconds && s.nextUnlock < cfg.unlocks.length) {
    state.time += DT;
    const g = goal();
    if (!target || Math.hypot(g.x - target.x, g.y - target.y) > 0.5) {
      target = g;
      path = findPath(ctx.grid, pos, target).points;
      think = 0.5;
    }
    if (festa > 0) festa -= DT;
    else if (think > 0) think -= DT;
    else {
      let budget = BALANCE.player.speed * DT;
      while (budget > 0 && path.length > 0) {
        const n = path[0]!;
        const d = Math.hypot(n.x - pos.x, n.y - pos.y);
        if (d <= budget) {
          pos = n;
          budget -= d;
          path.shift();
        } else {
          pos = { x: pos.x + ((n.x - pos.x) / d) * budget, y: pos.y + ((n.y - pos.y) / d) * budget };
          budget = 0;
        }
      }
    }
    stepPhase1(s, pos, DT, bus, { grid: ctx.grid, rng });
    if (s.navDirty) {
      s.navDirty = false;
      ctx.grid = botGrid();
    }
  }
  return { unlockedAt, firstSale, time: state.time, level: s.level };
}

describe('ritmo della Fase 1 con un giocatore automatico (GDD 5 e 8)', () => {
  const r = playPhase1(20 * 60);
  const min = (id: string) => (r.unlockedAt[id] ?? Infinity) / 60;

  it('si arriva alla Pressa 2 giocando dal minuto 0', () => {
    expect(r.unlockedAt.press2).toBeDefined();
  });

  it('Campo 1 e Pressa 1 si comprano con il regalo entro 30 s; la prima vendita entro il primo minuto e mezzo', () => {
    expect(r.unlockedAt.field1!).toBeLessThan(15);
    expect(r.unlockedAt.press1!).toBeLessThan(30);
    expect(r.firstSale).toBeGreaterThan(0);
    expect(r.firstSale).toBeLessThan(90);
  });

  it('gli sblocchi non arrivano oltre una volta e mezza i minuti obiettivo', () => {
    // Il giocatore automatico non impara i comandi e non esita: è più rapido di una persona, quindi il
    // limite basso è largo (un terzo). La taratura fine dei prezzi si fa in M8 con partite vere.
    // Minuti obiettivo della tabella degli sblocchi (GDD sezione 5).
    const goals: Record<string, number> = { field2: 0.5, bonfire: 1.3, office: 1.5, picker1: 2.5, zone2: 3.5, field3: 6.5, picker2: 8, press2: 10 };
    const report = Object.entries(goals).map(([id, m]) => `${id}: ${min(id).toFixed(1)} min (obiettivo ${m})`);
    console.info(report.join("\n"));
    for (const [id, m] of Object.entries(goals)) {
      expect(min(id)).toBeGreaterThan(m / 3);
      expect(min(id)).toBeLessThan(m * 1.5);
    }
  });

  it('nella prima ora nessun buco di più di 4 minuti tra uno sblocco e l\'altro', () => {
    const times = [0, ...cfg.unlocks.map((u) => r.unlockedAt[u.id]!)];
    for (let i = 1; i < times.length; i++) expect(times[i]! - times[i - 1]!).toBeLessThan(4 * 60);
  });
});
