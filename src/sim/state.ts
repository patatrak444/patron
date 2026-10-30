// Stato di gioco e passo di logica. Nessuna dipendenza da Three.js o dal DOM.

import { BALANCE } from '../config/balance';
import { BONFIRE, LOTS, OBSTACLES, PLAYER_SPAWN, PRESSES, PRESS_SIZE, VALLEY, type Rect, type Shape } from '../config/map';
import type { Bus, GameEvents } from '../core/bus';
import { createRng, type Rng } from '../core/rng';
import { createNavGrid } from './pathfinding';
import { createPhase1, stepPhase1, type Phase1State } from './phase1';
import { createPlayer, stepPlayer, type MoveContext, type PlayerState } from './player';

export interface GameState {
  /** Versione del formato, per le migrazioni del salvataggio (GDD sezione 13). */
  version: 1;
  /** Tempo di gioco trascorso, in secondi. */
  time: number;
  /** Stato del generatore casuale, salvato con la partita. */
  rngState: number;
  player: PlayerState;
  phase1: Phase1State;
}

/** Comandi della tastiera letti a ogni passo (y verso nord). */
export interface StepInput {
  moveX: number;
  moveY: number;
}

export function createInitialState(seed: number): GameState {
  return {
    version: 1,
    time: 0,
    rngState: createRng(seed).getState(),
    player: createPlayer(PLAYER_SPAWN),
    phase1: createPhase1(),
  };
}

/** Ostacoli del momento: le stazioni comprate (le sagome si calpestano). */
export function obstacleShapes(p1?: Phase1State): Shape[] {
  const shapes: Shape[] = OBSTACLES.map((o) => o.shape);
  for (const p of PRESSES) {
    if (p1?.presses.find((x) => x.id === p.id)?.unlocked) shapes.push({ kind: 'rect', x: p.x, y: p.y, w: PRESS_SIZE, h: PRESS_SIZE });
  }
  if (p1?.bonfire) shapes.push({ kind: 'circle', x: BONFIRE.x, y: BONFIRE.y, r: BONFIRE.r });
  return shapes;
}

/** Zone percorribili: i lotti aperti. */
export function walkableAreas(p1?: Phase1State): Rect[] {
  return (p1?.lots ?? ['lot1']).map((id) => LOTS[id]);
}

export function createMoveContext(p1?: Phase1State): MoveContext {
  const shapes = obstacleShapes(p1);
  const areas = walkableAreas(p1);
  return {
    cfg: BALANCE.player,
    width: VALLEY.width,
    depth: VALLEY.depth,
    shapes,
    areas,
    grid: createNavGrid(VALLEY.width, VALLEY.depth, shapes, BALANCE.nav.pad, areas),
  };
}

/** Un passo di logica. */
export function stepSim(state: GameState, dt: number, bus: Bus<GameEvents>, input: StepInput, ctx: MoveContext, rng?: Rng): void {
  state.time += dt;
  stepPlayer(state.player, input.moveX, input.moveY, dt, ctx);
  const r = rng ?? createRng(state.rngState);
  stepPhase1(state.phase1, state.player, dt, bus, { grid: ctx.grid, rng: r });
  state.rngState = r.getState();
  if (state.phase1.navDirty) {
    // Uno sblocco ha cambiato ostacoli o lotti: si ricostruisce la griglia dei percorsi.
    state.phase1.navDirty = false;
    const next = createMoveContext(state.phase1);
    ctx.shapes = next.shapes;
    ctx.areas = next.areas;
    ctx.grid = next.grid;
  }
  bus.emit('sim:step', { time: state.time });
}
