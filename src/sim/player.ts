// Movimento del giocatore (GDD sezione 3): tastiera in 8 direzioni o clic per muoversi, collisioni semplici.

import type { PlayerConfig } from '../config/balance';
import type { MapPoint, Shape } from '../config/map';
import { clampToBounds, pushOut } from './geometry';
import { findPath, type NavGrid } from './pathfinding';

export interface PlayerState {
  x: number;
  y: number;
  /** Posizione all'inizio dell'ultimo passo, per interpolare il disegno. */
  prevX: number;
  prevY: number;
  vx: number;
  vy: number;
  /** Direzione in cui guarda, in radianti (0 = est, π/2 = nord). */
  facing: number;
  prevFacing: number;
  /** Punti del percorso da clic ancora da raggiungere. */
  path: MapPoint[];
}

/** Tutto ciò che di fisso serve al movimento: limiti, ostacoli, griglia. */
export interface MoveContext {
  readonly cfg: PlayerConfig;
  readonly width: number;
  readonly depth: number;
  shapes: readonly Shape[];
  grid: NavGrid;
}

export function createPlayer(spawn: MapPoint): PlayerState {
  // Rivolto verso la camera (sud-ovest), come all'inizio di Pizza Ready: si vede la faccia e la pila.
  const facing = (-3 * Math.PI) / 4;
  return { x: spawn.x, y: spawn.y, prevX: spawn.x, prevY: spawn.y, vx: 0, vy: 0, facing, prevFacing: facing, path: [] };
}

/** Clic sul terreno: calcola il percorso fino al punto, o al punto raggiungibile più vicino. */
export function commandMoveTo(p: PlayerState, target: MapPoint, ctx: MoveContext): MapPoint | null {
  const result = findPath(ctx.grid, { x: p.x, y: p.y }, target);
  p.path = result.points;
  return p.path.length > 0 ? p.path[p.path.length - 1]! : null;
}

/** Differenza d'angolo più breve, in (−π, π]. */
export function angleDelta(from: number, to: number): number {
  let d = (to - from) % (Math.PI * 2);
  if (d > Math.PI) d -= Math.PI * 2;
  if (d <= -Math.PI) d += Math.PI * 2;
  return d;
}

/**
 * Un passo di movimento. `moveX`/`moveY` vengono dalla tastiera (−1, 0, 1, y verso nord):
 * se diversi da zero annullano il percorso da clic.
 */
export function stepPlayer(p: PlayerState, moveX: number, moveY: number, dt: number, ctx: MoveContext): void {
  const { cfg } = ctx;
  p.prevX = p.x;
  p.prevY = p.y;
  p.prevFacing = p.facing;

  let dirX = 0;
  let dirY = 0;
  let arriving = false;

  if (moveX !== 0 || moveY !== 0) {
    p.path = [];
    const len = Math.hypot(moveX, moveY);
    dirX = moveX / len;
    dirY = moveY / len;
  } else {
    // Salta i punti già raggiunti; sull'ultimo ci si ferma esatti.
    while (p.path.length > 0) {
      const next = p.path[0]!;
      const d = Math.hypot(next.x - p.x, next.y - p.y);
      const isLast = p.path.length === 1;
      const reach = Math.max(Math.hypot(p.vx, p.vy), cfg.speed * 0.5) * dt;
      if (d <= (isLast ? reach : Math.max(reach, 0.15))) {
        if (isLast) {
          p.x = next.x;
          p.y = next.y;
          arriving = true;
        }
        p.path.shift();
        continue;
      }
      dirX = (next.x - p.x) / d;
      dirY = (next.y - p.y) / d;
      break;
    }
  }

  if (arriving) {
    p.vx = 0;
    p.vy = 0;
  } else {
    // La velocità insegue quella desiderata: piena in accelTime, zero in stopTime.
    const wantX = dirX * cfg.speed;
    const wantY = dirY * cfg.speed;
    const moving = dirX !== 0 || dirY !== 0;
    const rate = (moving ? cfg.speed / cfg.accelTime : cfg.speed / cfg.stopTime) * dt;
    const dx = wantX - p.vx;
    const dy = wantY - p.vy;
    const d = Math.hypot(dx, dy);
    if (d <= rate) {
      p.vx = wantX;
      p.vy = wantY;
    } else {
      p.vx += (dx / d) * rate;
      p.vy += (dy / d) * rate;
    }
  }

  let pos: MapPoint = { x: p.x + p.vx * dt, y: p.y + p.vy * dt };
  // Due passate bastano per gli angoli tra ostacoli vicini.
  for (let i = 0; i < 2; i++) {
    for (const s of ctx.shapes) pos = pushOut(pos, cfg.radius, s);
    pos = clampToBounds(pos, cfg.radius, ctx.width, ctx.depth);
  }
  p.x = pos.x;
  p.y = pos.y;

  // Si gira verso la direzione di marcia.
  const speed = Math.hypot(p.vx, p.vy);
  if (speed > 0.05) {
    const target = Math.atan2(p.vy, p.vx);
    const k = 1 - Math.exp((-3 * dt) / cfg.turnTime);
    p.facing += angleDelta(p.facing, target) * k;
  }
}
