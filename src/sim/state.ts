// Tipi dello stato di gioco. Nessuna dipendenza da Three.js o dal DOM.

import { BALANCE } from '../config/balance';
import { LOCKED_AREAS, OBSTACLES, PLAYER_SPAWN, VALLEY } from '../config/map';
import type { Bus, GameEvents } from '../core/bus';
import { createRng } from '../core/rng';
import { createNavGrid } from './pathfinding';
import { createPlayer, stepPlayer, type MoveContext, type PlayerState } from './player';

export interface GameState {
  /** Versione del formato, per le migrazioni del salvataggio (GDD sezione 13). */
  version: 1;
  /** Tempo di gioco trascorso, in secondi. */
  time: number;
  /** Stato del generatore casuale, salvato con la partita. */
  rngState: number;
  player: PlayerState;
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
  };
}

/** Ostacoli e griglia dei percorsi per le aree aperte all'inizio. Gli sblocchi (M2) la ricostruiranno. */
export function createMoveContext(): MoveContext {
  const shapes = [...OBSTACLES, ...LOCKED_AREAS].map((o) => o.shape);
  return {
    cfg: BALANCE.player,
    width: VALLEY.width,
    depth: VALLEY.depth,
    shapes,
    grid: createNavGrid(VALLEY.width, VALLEY.depth, shapes, BALANCE.nav.pad),
  };
}

/** Un passo di logica. */
export function stepSim(state: GameState, dt: number, bus: Bus<GameEvents>, input: StepInput, ctx: MoveContext): void {
  state.time += dt;
  stepPlayer(state.player, input.moveX, input.moveY, dt, ctx);
  bus.emit('sim:step', { time: state.time });
}
