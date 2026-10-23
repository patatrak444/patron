import { describe, expect, it } from 'vitest';
import type { MapPoint, Shape } from '../src/config/map';
import { createNavGrid, findPath, isBlockedAt, lineOfSight } from '../src/sim/pathfinding';

const PAD = 0.45;

function length(from: MapPoint, pts: MapPoint[]): number {
  let total = 0;
  let a = from;
  for (const b of pts) {
    total += Math.hypot(b.x - a.x, b.y - a.y);
    a = b;
  }
  return total;
}

describe('griglia dei percorsi', () => {
  it('blocca le celle dentro gli ostacoli e ai bordi', () => {
    const grid = createNavGrid(20, 20, [{ kind: 'rect', x: 10, y: 10, w: 4, h: 4 }], PAD);
    expect(isBlockedAt(grid, { x: 10, y: 10 })).toBe(true);
    expect(isBlockedAt(grid, { x: 3, y: 3 })).toBe(false);
    expect(isBlockedAt(grid, { x: 20.5, y: 5 })).toBe(true);
    expect(isBlockedAt(grid, { x: -1, y: 5 })).toBe(true);
  });
});

describe('ricerca A*', () => {
  it('in campo aperto va in linea retta', () => {
    const grid = createNavGrid(20, 20, [], PAD);
    const from = { x: 2.5, y: 2.5 };
    const r = findPath(grid, from, { x: 15.5, y: 12.5 });
    expect(r.reachedTarget).toBe(true);
    expect(r.points).toEqual([{ x: 15.5, y: 12.5 }]);
  });

  it('aggira un muro lungo il lato più corto', () => {
    // Muro verticale con il varco più vicino in basso.
    const wall: Shape = { kind: 'rect', x: 10, y: 12, w: 1, h: 16 };
    const grid = createNavGrid(20, 20, [wall], PAD);
    const from = { x: 5.5, y: 10.5 };
    const to = { x: 14.5, y: 10.5 };
    const r = findPath(grid, from, to);
    expect(r.reachedTarget).toBe(true);
    expect(r.points.at(-1)).toEqual(to);
    // Passa sotto il muro (che finisce a y = 4), non sopra (che finisce a y = 20, al bordo).
    expect(Math.min(...r.points.map((p) => p.y))).toBeLessThan(4);
    // Ogni tratto è libero.
    let a = from;
    for (const b of r.points) {
      expect(lineOfSight(grid, a, b)).toBe(true);
      a = b;
    }
    // Vicino al minimo teorico: due segmenti che toccano lo spigolo in basso.
    const ideal = Math.hypot(10 - 5.5, 10.5 - 3.5) + Math.hypot(14.5 - 10, 10.5 - 3.5);
    expect(length(from, r.points)).toBeLessThan(ideal * 1.15);
  });

  it('clic dentro un ostacolo: va al punto raggiungibile più vicino', () => {
    const block: Shape = { kind: 'rect', x: 10, y: 10, w: 4, h: 4 };
    const grid = createNavGrid(20, 20, [block], PAD);
    const r = findPath(grid, { x: 3.5, y: 10.5 }, { x: 10, y: 10.2 });
    expect(r.reachedTarget).toBe(false);
    const end = r.points.at(-1)!;
    expect(isBlockedAt(grid, end)).toBe(false);
    // Appena fuori dal blocco allargato: a meno di 1,5 m dal suo bordo.
    expect(Math.abs(end.x - 10) - 2).toBeLessThan(1.5 + 1e-9);
  });

  it('clic fuori dalla valle: va al bordo più vicino', () => {
    const grid = createNavGrid(20, 20, [], PAD);
    const r = findPath(grid, { x: 10.5, y: 10.5 }, { x: 30, y: 10.5 });
    expect(r.reachedTarget).toBe(false);
    expect(r.points.at(-1)!.x).toBeCloseTo(19.5);
  });

  it('clic in una zona chiusa da un muro: va al punto raggiungibile più vicino, senza attraversare', () => {
    // Recinto chiuso al centro: il punto dentro è libero ma irraggiungibile.
    const walls: Shape[] = [
      { kind: 'rect', x: 10, y: 6, w: 10, h: 1 },
      { kind: 'rect', x: 10, y: 14, w: 10, h: 1 },
      { kind: 'rect', x: 5, y: 10, w: 1, h: 9 },
      { kind: 'rect', x: 15, y: 10, w: 1, h: 9 },
    ];
    const grid = createNavGrid(20, 20, walls, PAD);
    const r = findPath(grid, { x: 2.5, y: 2.5 }, { x: 10.5, y: 10.5 });
    expect(r.reachedTarget).toBe(false);
    const end = r.points.at(-1)!;
    expect(end.x < 4 || end.x > 16 || end.y < 5 || end.y > 15).toBe(true);
  });

  it('partendo a ridosso di un ostacolo trova comunque il percorso', () => {
    const block: Shape = { kind: 'rect', x: 10, y: 10, w: 4, h: 4 };
    const grid = createNavGrid(20, 20, [block], PAD);
    const r = findPath(grid, { x: 12.4, y: 10 }, { x: 17.5, y: 10.5 });
    expect(r.reachedTarget).toBe(true);
    expect(r.points.at(-1)).toEqual({ x: 17.5, y: 10.5 });
  });
});
