// Griglia dei percorsi e ricerca A* (GDD sezione 6).
// Celle da 1 m; una cella è bloccata se il suo centro sta dentro un ostacolo allargato del raggio di chi cammina.

import { inRect, type MapPoint, type Rect, type Shape } from '../config/map';
import { insideShape } from './geometry';

export interface NavGrid {
  readonly cols: number;
  readonly rows: number;
  readonly cellSize: number;
  /** 1 = bloccata, indice = row * cols + col. */
  readonly blocked: Uint8Array;
}

export interface PathResult {
  /** Punti da raggiungere in ordine, partenza esclusa. Vuoto se si è già arrivati. */
  readonly points: MapPoint[];
  /** Falso se il punto chiesto non era raggiungibile e si va al più vicino. */
  readonly reachedTarget: boolean;
}

/** `areas`, se date, sono le sole zone percorribili (i lotti aperti, GDD sezione 4). */
export function createNavGrid(width: number, depth: number, shapes: readonly Shape[], pad: number, areas?: readonly Rect[]): NavGrid {
  const cellSize = 1;
  const cols = Math.ceil(width / cellSize);
  const rows = Math.ceil(depth / cellSize);
  const blocked = new Uint8Array(cols * rows);
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const c = { x: (col + 0.5) * cellSize, y: (row + 0.5) * cellSize };
      const outside = c.x < pad || c.y < pad || c.x > width - pad || c.y > depth - pad;
      const offArea = areas !== undefined && !areas.some((a) => inRect(c, a, pad));
      if (outside || offArea || shapes.some((s) => insideShape(c, s, pad))) blocked[row * cols + col] = 1;
    }
  }
  return { cols, rows, cellSize, blocked };
}

function cellOf(grid: NavGrid, p: MapPoint): { col: number; row: number } {
  return {
    col: Math.min(Math.max(Math.floor(p.x / grid.cellSize), 0), grid.cols - 1),
    row: Math.min(Math.max(Math.floor(p.y / grid.cellSize), 0), grid.rows - 1),
  };
}

function center(grid: NavGrid, idx: number): MapPoint {
  return {
    x: ((idx % grid.cols) + 0.5) * grid.cellSize,
    y: (Math.floor(idx / grid.cols) + 0.5) * grid.cellSize,
  };
}

export function isBlockedAt(grid: NavGrid, p: MapPoint): boolean {
  if (p.x < 0 || p.y < 0 || p.x >= grid.cols * grid.cellSize || p.y >= grid.rows * grid.cellSize) return true;
  const { col, row } = cellOf(grid, p);
  return grid.blocked[row * grid.cols + col] === 1;
}

const DIRS: readonly [number, number, number][] = [
  [1, 0, 1],
  [-1, 0, 1],
  [0, 1, 1],
  [0, -1, 1],
  [1, 1, Math.SQRT2],
  [1, -1, Math.SQRT2],
  [-1, 1, Math.SQRT2],
  [-1, -1, Math.SQRT2],
];

/** Vicini percorribili di una cella; in diagonale solo se entrambi i lati sono liberi (niente tagli di spigolo). */
function forEachNeighbor(grid: NavGrid, idx: number, fn: (n: number, cost: number) => void): void {
  const col = idx % grid.cols;
  const row = Math.floor(idx / grid.cols);
  for (const [dc, dr, cost] of DIRS) {
    const c = col + dc;
    const r = row + dr;
    if (c < 0 || r < 0 || c >= grid.cols || r >= grid.rows) continue;
    const n = r * grid.cols + c;
    if (grid.blocked[n]) continue;
    if (dc !== 0 && dr !== 0 && (grid.blocked[row * grid.cols + c] || grid.blocked[r * grid.cols + col])) continue;
    fn(n, cost);
  }
}

/** Cella libera più vicina a `p` (in linea d'aria), per partire anche se si è a ridosso di un ostacolo. */
function nearestFreeCell(grid: NavGrid, p: MapPoint): number {
  let best = -1;
  let bestD = Infinity;
  for (let i = 0; i < grid.blocked.length; i++) {
    if (grid.blocked[i]) continue;
    const c = center(grid, i);
    const d = (c.x - p.x) ** 2 + (c.y - p.y) ** 2;
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best;
}

/** Tutte le celle raggiungibili da `start`. */
function reachableFrom(grid: NavGrid, start: number): Uint8Array {
  const seen = new Uint8Array(grid.blocked.length);
  const queue = [start];
  seen[start] = 1;
  for (let qi = 0; qi < queue.length; qi++) {
    forEachNeighbor(grid, queue[qi]!, (n) => {
      if (!seen[n]) {
        seen[n] = 1;
        queue.push(n);
      }
    });
  }
  return seen;
}

/** A* tra due celle libere e collegate. Restituisce gli indici delle celle, partenza inclusa. */
function astar(grid: NavGrid, start: number, goal: number): number[] | null {
  const n = grid.blocked.length;
  const g = new Float64Array(n).fill(Infinity);
  const came = new Int32Array(n).fill(-1);
  const closed = new Uint8Array(n);
  const goalCol = goal % grid.cols;
  const goalRow = Math.floor(goal / grid.cols);
  const h = (i: number): number => {
    const dx = Math.abs((i % grid.cols) - goalCol);
    const dy = Math.abs(Math.floor(i / grid.cols) - goalRow);
    return Math.max(dx, dy) + (Math.SQRT2 - 1) * Math.min(dx, dy);
  };

  // Coda di priorità binaria su f = g + h.
  const heap: [number, number][] = [];
  const push = (f: number, i: number): void => {
    heap.push([f, i]);
    let k = heap.length - 1;
    while (k > 0) {
      const p = (k - 1) >> 1;
      if (heap[p]![0] <= heap[k]![0]) break;
      [heap[p], heap[k]] = [heap[k]!, heap[p]!];
      k = p;
    }
  };
  const pop = (): number => {
    const top = heap[0]!;
    const last = heap.pop()!;
    if (heap.length > 0) {
      heap[0] = last;
      let k = 0;
      for (;;) {
        const l = 2 * k + 1;
        const r = l + 1;
        let m = k;
        if (l < heap.length && heap[l]![0] < heap[m]![0]) m = l;
        if (r < heap.length && heap[r]![0] < heap[m]![0]) m = r;
        if (m === k) break;
        [heap[m], heap[k]] = [heap[k]!, heap[m]!];
        k = m;
      }
    }
    return top[1];
  };

  g[start] = 0;
  push(h(start), start);
  while (heap.length > 0) {
    const cur = pop();
    if (cur === goal) {
      const path = [cur];
      for (let c = came[cur]!; c !== -1; c = came[c]!) path.push(c);
      return path.reverse();
    }
    if (closed[cur]) continue;
    closed[cur] = 1;
    forEachNeighbor(grid, cur, (nb, cost) => {
      const ng = g[cur]! + cost;
      if (ng < g[nb]!) {
        g[nb] = ng;
        came[nb] = cur;
        push(ng + h(nb), nb);
      }
    });
  }
  return null;
}

/** Vero se il segmento a–b attraversa solo celle libere. */
export function lineOfSight(grid: NavGrid, a: MapPoint, b: MapPoint): boolean {
  const d = Math.hypot(b.x - a.x, b.y - a.y);
  const steps = Math.max(1, Math.ceil(d / (grid.cellSize * 0.25)));
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    if (isBlockedAt(grid, { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })) return false;
  }
  return true;
}

/** Toglie i punti intermedi superflui: da ogni punto si salta al più lontano visibile. */
function smooth(grid: NavGrid, from: MapPoint, points: MapPoint[]): MapPoint[] {
  const out: MapPoint[] = [];
  let anchor = from;
  let i = 0;
  while (i < points.length) {
    let j = points.length - 1;
    while (j > i && !lineOfSight(grid, anchor, points[j]!)) j--;
    out.push(points[j]!);
    anchor = points[j]!;
    i = j + 1;
  }
  return out;
}

/**
 * Percorso più breve da `from` a `to`. Se `to` è dentro un ostacolo, fuori dalla valle
 * o in una zona chiusa, il percorso porta al punto raggiungibile più vicino.
 */
export function findPath(grid: NavGrid, from: MapPoint, to: MapPoint): PathResult {
  const startCell = isBlockedAt(grid, from) ? nearestFreeCell(grid, from) : cellIndex(grid, from);
  if (startCell < 0) return { points: [], reachedTarget: false };

  const targetFree = !isBlockedAt(grid, to);
  let goalCell = targetFree ? cellIndex(grid, to) : -1;
  let goalPoint = to;

  const reach = reachableFrom(grid, startCell);
  if (goalCell < 0 || !reach[goalCell]) {
    // Cella raggiungibile più vicina al punto chiesto.
    let bestD = Infinity;
    for (let i = 0; i < reach.length; i++) {
      if (!reach[i]) continue;
      const c = center(grid, i);
      const d = (c.x - to.x) ** 2 + (c.y - to.y) ** 2;
      if (d < bestD) {
        bestD = d;
        goalCell = i;
      }
    }
    goalPoint = center(grid, goalCell);
  }
  const reachedTarget = targetFree && goalPoint === to;

  const cells = astar(grid, startCell, goalCell);
  if (!cells) return { points: [], reachedTarget: false };

  const raw = cells.slice(1).map((i) => center(grid, i));
  // L'ultimo punto è quello esatto chiesto, non il centro della cella.
  if (raw.length > 0) raw[raw.length - 1] = goalPoint;
  else raw.push(goalPoint);
  return { points: smooth(grid, from, raw), reachedTarget };
}

function cellIndex(grid: NavGrid, p: MapPoint): number {
  const { col, row } = cellOf(grid, p);
  return row * grid.cols + col;
}
