import { describe, expect, it } from 'vitest';
import { BALANCE } from '../src/config/balance';
import { createPlayer, commandMoveTo, stepPlayer, type MoveContext } from '../src/sim/player';
import { createNavGrid } from '../src/sim/pathfinding';
import { createMoveContext } from '../src/sim/state';
import { LOTS, PRESSES, type Shape } from '../src/config/map';
import { createPhase1 } from '../src/sim/phase1';

const DT = 1 / 30;
const cfg = BALANCE.player;

function openField(shapes: Shape[] = []): MoveContext {
  return { cfg, width: 40, depth: 40, shapes, grid: createNavGrid(40, 40, shapes, BALANCE.nav.pad) };
}

const speed = (p: { vx: number; vy: number }): number => Math.hypot(p.vx, p.vy);

describe('movimento da tastiera', () => {
  it('raggiunge la velocità piena in circa 0,08 s', () => {
    const ctx = openField();
    const p = createPlayer({ x: 20, y: 20 });
    stepPlayer(p, 1, 0, DT, ctx);
    stepPlayer(p, 1, 0, DT, ctx);
    expect(speed(p)).toBeLessThan(cfg.speed);
    stepPlayer(p, 1, 0, DT, ctx);
    expect(speed(p)).toBeCloseTo(cfg.speed);
  });

  it('si ferma in 0,1 s, senza scivolare', () => {
    const ctx = openField();
    const p = createPlayer({ x: 20, y: 20 });
    for (let i = 0; i < 10; i++) stepPlayer(p, 1, 0, DT, ctx);
    for (let i = 0; i < 3; i++) stepPlayer(p, 0, 0, DT, ctx);
    expect(speed(p)).toBeCloseTo(0);
    const x = p.x;
    stepPlayer(p, 0, 0, DT, ctx);
    expect(p.x).toBe(x);
  });

  it('in diagonale la velocità resta la stessa', () => {
    const ctx = openField();
    const p = createPlayer({ x: 20, y: 20 });
    for (let i = 0; i < 10; i++) stepPlayer(p, 1, 1, DT, ctx);
    expect(speed(p)).toBeCloseTo(cfg.speed);
  });

  it('in un secondo percorre 4 m (meno il tratto di accelerazione)', () => {
    const ctx = openField();
    const p = createPlayer({ x: 5, y: 20 });
    for (let i = 0; i < 30; i++) stepPlayer(p, 1, 0, DT, ctx);
    expect(p.x - 5).toBeGreaterThan(3.7);
    expect(p.x - 5).toBeLessThanOrEqual(4);
  });

  it('si gira verso la direzione di marcia', () => {
    const ctx = openField();
    const p = createPlayer({ x: 20, y: 20 });
    for (let i = 0; i < 10; i++) stepPlayer(p, -1, 0, DT, ctx);
    expect(Math.abs(Math.cos(p.facing) + 1)).toBeLessThan(0.01);
  });
});

describe('collisioni', () => {
  it('non attraversa un ostacolo rettangolare', () => {
    const wall: Shape = { kind: 'rect', x: 25, y: 20, w: 2, h: 10 };
    const ctx = openField([wall]);
    const p = createPlayer({ x: 20, y: 20 });
    for (let i = 0; i < 90; i++) stepPlayer(p, 1, 0, DT, ctx);
    expect(p.x).toBeLessThanOrEqual(24 - cfg.radius + 1e-6);
  });

  it('non attraversa un ostacolo circolare', () => {
    const tree: Shape = { kind: 'circle', x: 25, y: 20, r: 1 };
    const ctx = openField([tree]);
    const p = createPlayer({ x: 20, y: 20 });
    for (let i = 0; i < 90; i++) {
      stepPlayer(p, 1, 0, DT, ctx);
      expect(Math.hypot(p.x - 25, p.y - 20)).toBeGreaterThanOrEqual(1 + cfg.radius - 1e-6);
    }
  });

  it('nella Hacienda, tenendo premuti A e S, arriva all\'angolo sud-ovest della staccionata', () => {
    const ctx = createMoveContext();
    const p = createPlayer({ x: 20, y: 10 });
    for (let i = 0; i < 300; i++) stepPlayer(p, -1, -1, DT, ctx);
    expect(p.x).toBeCloseTo(LOTS.lot1.x0 + cfg.radius);
    expect(p.y).toBeCloseTo(LOTS.lot1.y0 + cfg.radius);
  });

  it('il lotto 2 è chiuso finché non si compra la Nuova zona', () => {
    const s = createPhase1();
    const p = createPlayer({ x: 24, y: 10 });
    for (let i = 0; i < 120; i++) stepPlayer(p, 1, 0, DT, createMoveContext(s));
    expect(p.x).toBeCloseTo(LOTS.lot1.x1 - cfg.radius);
    s.lots.push('lot2');
    const ctx = createMoveContext(s);
    for (let i = 0; i < 120; i++) stepPlayer(p, 1, 0, DT, ctx);
    expect(p.x).toBeGreaterThan(LOTS.lot1.x1 + 3);
  });

  it('resta dentro i bordi della valle', () => {
    const ctx = openField();
    const p = createPlayer({ x: 2, y: 2 });
    for (let i = 0; i < 60; i++) stepPlayer(p, -1, -1, DT, ctx);
    expect(p.x).toBeCloseTo(cfg.radius);
    expect(p.y).toBeCloseTo(cfg.radius);
  });
});

describe('clic per muoversi', () => {
  it('arriva esattamente al punto cliccato e si ferma', () => {
    const ctx = openField();
    const p = createPlayer({ x: 5, y: 5 });
    commandMoveTo(p, { x: 15.3, y: 9.7 }, ctx);
    for (let i = 0; i < 150; i++) stepPlayer(p, 0, 0, DT, ctx);
    expect(p.x).toBeCloseTo(15.3);
    expect(p.y).toBeCloseTo(9.7);
    expect(speed(p)).toBe(0);
    expect(p.path).toHaveLength(0);
  });

  it('aggira un ostacolo per arrivare dietro', () => {
    const wall: Shape = { kind: 'rect', x: 20, y: 20, w: 2, h: 16 };
    const ctx = openField([wall]);
    const p = createPlayer({ x: 15, y: 20 });
    commandMoveTo(p, { x: 25, y: 20 }, ctx);
    for (let i = 0; i < 300; i++) stepPlayer(p, 0, 0, DT, ctx);
    expect(p.x).toBeCloseTo(25);
    expect(p.y).toBeCloseTo(20);
  });

  it('un tasto di movimento annulla il percorso', () => {
    const ctx = openField();
    const p = createPlayer({ x: 5, y: 5 });
    commandMoveTo(p, { x: 30, y: 30 }, ctx);
    stepPlayer(p, 0, 0, DT, ctx);
    expect(p.path.length).toBeGreaterThan(0);
    stepPlayer(p, 0, -1, DT, ctx);
    expect(p.path).toHaveLength(0);
  });

  it('nella Hacienda gira attorno alla Pressa per arrivare dall\'altra parte', () => {
    const s = createPhase1();
    s.presses[0]!.unlocked = true;
    const ctx = createMoveContext(s);
    const press = PRESSES[0]!;
    const p = createPlayer({ x: press.x - 2.2, y: press.y });
    const goal = { x: press.x + 2.2, y: press.y };
    commandMoveTo(p, goal, ctx);
    for (let i = 0; i < 600 && p.path.length > 0; i++) {
      stepPlayer(p, 0, 0, DT, ctx);
      for (const s of ctx.shapes) {
        if (s.kind !== 'rect') continue;
        const inside = Math.abs(p.x - s.x) < s.w / 2 && Math.abs(p.y - s.y) < s.h / 2;
        expect(inside).toBe(false);
      }
    }
    expect(p.x).toBeCloseTo(goal.x);
    expect(p.y).toBeCloseTo(goal.y);
  });
});
