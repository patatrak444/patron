// Tipi dello stato di gioco. Nessuna dipendenza da Three.js o dal DOM.

import type { Bus, GameEvents } from '../core/bus';
import { createRng } from '../core/rng';

export interface GameState {
  /** Versione del formato, per le migrazioni del salvataggio (GDD sezione 13). */
  version: 1;
  /** Tempo di gioco trascorso, in secondi. */
  time: number;
  /** Stato del generatore casuale, salvato con la partita. */
  rngState: number;
}

export function createInitialState(seed: number): GameState {
  return {
    version: 1,
    time: 0,
    rngState: createRng(seed).getState(),
  };
}

/** Un passo di logica. */
export function stepSim(state: GameState, dt: number, bus: Bus<GameEvents>): void {
  state.time += dt;
  bus.emit('sim:step', { time: state.time });
}
