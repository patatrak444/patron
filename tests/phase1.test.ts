import { describe, expect, it } from 'vitest';
import { BALANCE } from '../src/config/balance';
import { BONFIRE, GIFT_SPOT, PRESSES, TRUCK, UNLOCK_PADS, type MapPoint } from '../src/config/map';
import { createBus, type GameEvents } from '../src/core/bus';
import { createRng } from '../src/core/rng';
import {
  createPhase1,
  fieldMat,
  levelFor,
  objective,
  pressBlocked,
  stepPhase1,
  type Phase1State,
} from '../src/sim/phase1';
import { countOf, createStack, push, take } from '../src/sim/stack';
import { createMoveContext } from '../src/sim/state';

const DT = BALANCE.sim.step;
const cfg = BALANCE.phase1;

function run(s: Phase1State, at: MapPoint, seconds: number): void {
  const bus = createBus<GameEvents>();
  const ctx = { grid: createMoveContext(s).grid, rng: createRng(7) };
  for (let t = 0; t < seconds; t += DT) stepPhase1(s, at, DT, bus, ctx);
}

const FAR: MapPoint = { x: 35, y: 40 };

/** Compra in ordine gli sblocchi fino a `id` compreso, pagando ognuno sul suo tappetino. */
function openUpTo(s: Phase1State, id: string): void {
  s.piles = s.piles.filter((p) => p.id !== 'gift');
  for (const u of cfg.unlocks) {
    if (cfg.unlocks.indexOf(u) < s.nextUnlock) continue;
    const cash = s.cash;
    s.cash = u.cost;
    run(s, UNLOCK_PADS[u.id], 2);
    s.cash = cash;
    if (u.id === id) break;
  }
  s.piles = [];
  s.truck.away = 0;
  s.truck.arrived = true;
}

describe('pila (GDD 3)', () => {
  it('tiene merci miste e scarica per tipo dove sono', () => {
    const st = createStack(4);
    push(st, 'leaf');
    push(st, 'paste');
    push(st, 'leaf');
    expect(take(st, 'paste')).toBe(true);
    expect(st.items).toEqual(['leaf', 'leaf']);
    expect(take(st, 'scrap')).toBe(false);
    push(st, 'leaf');
    push(st, 'leaf');
    expect(push(st, 'leaf')).toBe(false);
  });
});

describe('regalo e sblocchi (GDD 5)', () => {
  it('all\'inizio è tutto da comprare: solo il regalo e la sagoma del Campo 1', () => {
    const s = createPhase1();
    expect(s.fields.every((f) => !f.unlocked)).toBe(true);
    expect(s.presses.every((p) => !p.unlocked)).toBe(true);
    expect(s.truck.arrived).toBe(false);
    expect(s.lots).toEqual(['lot1']);
    expect(s.piles.find((p) => p.id === 'gift')!.value).toBe(cfg.gift);
  });

  it('il regalo di $25 si raccoglie in mezzo secondo e paga Campo 1 e Pressa 1', () => {
    const s = createPhase1();
    run(s, GIFT_SPOT, 0.5);
    expect(s.cash).toBe(cfg.gift);
    expect(s.piles.find((p) => p.id === 'gift')).toBeUndefined();
    run(s, UNLOCK_PADS.field1, 2);
    expect(s.fields.find((f) => f.id === 'field1')!.unlocked).toBe(true);
    run(s, UNLOCK_PADS.press1, 2);
    expect(s.presses[0]!.unlocked).toBe(true);
    expect(s.cash).toBe(cfg.gift - 5 - 15);
    expect(s.stars).toBe(2 * cfg.respect.starsPerUnlock);
  });

  it('con la prima Pressa arriva il camion lungo la strada', () => {
    const s = createPhase1();
    const bus = createBus<GameEvents>();
    let honk = 0;
    bus.on('truck:arriving', () => honk++);
    const ctx = { grid: createMoveContext(s).grid, rng: createRng(7) };
    s.piles = [];
    s.nextUnlock = 1;
    s.cash = 15;
    for (let t = 0; t < 2; t += DT) stepPhase1(s, UNLOCK_PADS.press1, DT, bus, ctx);
    expect(honk).toBe(1);
    expect(s.truck.arrived).toBe(false);
    for (let t = 0; t < cfg.truck.firstArrival; t += DT) stepPhase1(s, FAR, DT, bus, ctx);
    expect(s.truck.arrived).toBe(true);
  });

  it('il versato resta sul tappetino se esci a metà', () => {
    const s = createPhase1();
    s.piles = [];
    s.nextUnlock = 1;
    s.cash = 10;
    run(s, UNLOCK_PADS.press1, 2);
    expect(s.padPaid).toBe(10);
    expect(s.nextUnlock).toBe(1);
    s.cash = 20;
    run(s, UNLOCK_PADS.press1, 2);
    expect(s.nextUnlock).toBe(2);
    expect(s.cash).toBe(15);
  });

  it('il pagamento dura circa 1,5 s anche per un prezzo alto', () => {
    const s = createPhase1();
    openUpTo(s, 'picker2');
    s.cash = 1000;
    const i = s.nextUnlock;
    run(s, UNLOCK_PADS.press2, 1.2);
    expect(s.nextUnlock).toBe(i);
    run(s, UNLOCK_PADS.press2, 0.5);
    expect(s.nextUnlock).toBe(i + 1);
    expect(s.presses[1]!.unlocked).toBe(true);
    expect(s.navDirty).toBe(true);
  });

  it('la Nuova zona apre il lotto 2', () => {
    const s = createPhase1();
    openUpTo(s, 'zone2');
    expect(s.lots).toEqual(['lot1', 'lot2']);
  });
});

describe('Campo e Pressa (GDD 4)', () => {
  it('un Campo fa una Foglia ogni 3 s fino a 8', () => {
    const s = createPhase1();
    openUpTo(s, 'field1');
    run(s, FAR, 9.05);
    expect(s.fields[0]!.ready).toBe(3);
    run(s, FAR, 60);
    expect(s.fields[0]!.ready).toBe(cfg.field.outCap);
  });

  it('3 Foglie diventano 1 Pasta in 4 s; ogni 2 Paste un sacco di Scarti', () => {
    const s = createPhase1();
    openUpTo(s, 'press1');
    s.presses[0]!.leaves = 6;
    run(s, FAR, 8.1);
    expect(s.presses[0]!.pastes).toBe(2);
    expect(s.presses[0]!.scraps).toBe(1);
  });

  it('a cassone pieno la Pressa si ferma; gli Scarti si bruciano nel Falò', () => {
    const s = createPhase1();
    openUpTo(s, 'bonfire');
    const p = s.presses[0]!;
    p.scraps = cfg.press.scrapCap;
    p.leaves = 12;
    run(s, FAR, 10);
    expect(p.pastes).toBe(0);
    expect(pressBlocked(p)).toBe(true);
    run(s, PRESSES[0]!.scrap, 0.5);
    expect(countOf(s.stack, 'scrap')).toBe(4);
    run(s, BONFIRE.mat, 0.5);
    expect(s.burned).toBe(4);
    expect(countOf(s.stack, 'scrap')).toBe(0);
  });

  it('camminare tra le piante del Campo le raccoglie', () => {
    const s = createPhase1();
    openUpTo(s, 'field1');
    s.fields[0]!.ready = 8;
    run(s, { x: 30.2, y: 22.8 }, 0.5);
    expect(s.stack.items.length).toBe(cfg.stack.capacity);
  });

  it('raccolta per prossimità: un oggetto ogni 0,08 s, fino alla capacità', () => {
    const s = createPhase1();
    openUpTo(s, 'field1');
    s.fields[0]!.ready = 8;
    run(s, fieldMat('field1'), 0.2);
    expect(s.stack.items.length).toBe(3);
    run(s, fieldMat('field1'), 1);
    expect(s.stack.items.length).toBe(cfg.stack.capacity);
  });
});

describe('mani piene (GDD 4)', () => {
  it('con la Pressa piena le Foglie in mano si bruciano al Falò, e la frase lo dice', () => {
    const s = createPhase1();
    openUpTo(s, 'bonfire');
    s.sold = 3;
    s.presses[0]!.leaves = cfg.press.inCap;
    s.presses[0]!.pastes = cfg.press.outCap;
    s.stack.items = ['leaf', 'leaf', 'leaf', 'leaf'];
    expect(objective(s).text).toBe('Svuota le mani!');
    run(s, BONFIRE.mat, 0.5);
    expect(s.stack.items.length).toBe(0);
  });

  it('se la Pressa ha posto le Foglie non si bruciano', () => {
    const s = createPhase1();
    openUpTo(s, 'bonfire');
    s.stack.items = ['leaf', 'leaf'];
    run(s, BONFIRE.mat, 0.5);
    expect(s.stack.items.length).toBe(2);
  });
});

describe('camion di El Gordo (GDD 4)', () => {
  it('paga $5 a Pasta in mazzette; a cassone pieno parte e torna dopo 20 s', () => {
    const s = createPhase1();
    openUpTo(s, 'press1');
    s.truck.load = cfg.truck.capacity - 2;
    s.stack.items = ['paste', 'paste', 'paste'];
    run(s, TRUCK.deposit, 1);
    expect(s.truck.away).toBeGreaterThan(19);
    expect(s.stack.items).toEqual(['paste']);
    expect(s.piles.find((p) => p.id === 'truck')!.value).toBe(10);
    run(s, TRUCK.deposit, 10);
    expect(s.stack.items).toEqual(['paste']);
    run(s, FAR, 11);
    expect(s.truck.away).toBe(0);
    expect(s.truck.load).toBe(0);
  });

  it('solo il giocatore raccoglie le mazzette', () => {
    const s = createPhase1();
    s.piles = [{ id: 'truck', x: TRUCK.cash.x, y: TRUCK.cash.y, value: 25 }];
    run(s, TRUCK.cash, 1);
    expect(s.cash).toBe(25);
    expect(s.earned).toBe(25);
  });
});

describe('Rispetto (GDD 5)', () => {
  it('soglie cumulative 15, 24, 39…', () => {
    expect(levelFor(0)).toBe(1);
    expect(levelFor(14)).toBe(1);
    expect(levelFor(15)).toBe(2);
    expect(levelFor(24)).toBe(3);
    expect(levelFor(38)).toBe(3);
    expect(levelFor(39)).toBe(4);
  });

  it('i 6 sblocchi fino al Cargador danno Rispetto 3, i 9 fino al Campo 4 più 3 potenziamenti danno 4', () => {
    expect(levelFor(6 * cfg.respect.starsPerUnlock)).toBe(3);
    expect(levelFor(9 * cfg.respect.starsPerUnlock + 3 * cfg.respect.starsPerUpgrade)).toBe(4);
  });

  it('a ogni livello piove un premio di $20 × livello', () => {
    const s = createPhase1();
    s.piles = [];
    s.stars = 12;
    s.cash = 5;
    run(s, UNLOCK_PADS.field1, 2);
    expect(s.level).toBe(2);
    expect(s.piles.some((p) => p.value === 40)).toBe(true);
  });
});

describe('Raccoglitori (GDD 6)', () => {
  it('portano le Foglie dal Campo alla Pressa da soli', () => {
    const s = createPhase1();
    openUpTo(s, 'picker1');
    expect(s.workers.length).toBe(1);
    run(s, FAR, 40);
    expect(s.presses[0]!.pastes + s.presses[0]!.leaves).toBeGreaterThan(0);
  });

  it('si addormentano e si svegliano quando il giocatore passa vicino', () => {
    const s = createPhase1();
    openUpTo(s, 'picker1');
    const w = s.workers[0]!;
    w.untilSleep = 0.1;
    run(s, FAR, 1);
    expect(w.asleep).toBe(true);
    const x = w.x;
    run(s, FAR, 5);
    expect(w.x).toBe(x);
    run(s, { x: w.x + 1, y: w.y }, 0.1);
    expect(w.asleep).toBe(false);
    expect(w.untilSleep).toBeGreaterThanOrEqual(cfg.picker.sleepEvery[0]);
  });

  it('portano via gli Scarti quando il cassone è pieno per metà', () => {
    const s = createPhase1();
    openUpTo(s, 'picker1');
    s.presses[0]!.scraps = 3;
    run(s, FAR, 30);
    expect(s.burned).toBeGreaterThanOrEqual(3);
  });
});

describe('frase dell\'obiettivo (GDD 8)', () => {
  it('segue il copione dei primi minuti, con 4 parole al massimo', () => {
    const s = createPhase1();
    expect(objective(s).text).toBe('Raccogli i soldi!');
    run(s, GIFT_SPOT, 0.5);
    expect(objective(s).text).toBe('Compra il campo!');
    run(s, UNLOCK_PADS.field1, 2);
    expect(objective(s).text).toBe('Compra il torchio!');
    run(s, UNLOCK_PADS.press1, 2);
    s.truck.away = 0;
    s.truck.arrived = true;
    s.cash = 0;
    expect(objective(s).text).toBe('Raccogli le foglie!');
    s.stack.items = ['leaf'];
    expect(objective(s).text).toBe('Foglie al torchio!');
    s.stack.items = ['paste'];
    expect(objective(s).text).toBe('Vendi a El Gordo!');
    s.stack.items = [];
    s.sold = 1;
    // Senza i soldi per il Campo 2 la frase guida il ciclo che li fa guadagnare.
    expect(objective(s).text).toBe('Raccogli le foglie!');
    s.cash = 20;
    expect(objective(s).text).toBe('Compra il Campo 2!');
    for (const u of cfg.unlocks) expect(u.goal.split(' ').length).toBeLessThanOrEqual(4);
  });
});
