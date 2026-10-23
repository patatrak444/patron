// Casualità riproducibile con seme (GDD sezione 14, principio 5).
// Mulberry32: 32 bit di stato, veloce, e lo stato si salva come un numero.

export interface Rng {
  /** Numero in [0, 1). */
  next(): number;
  /** Intero in [min, max], estremi inclusi. */
  int(min: number, max: number): number;
  /** Vero con probabilità p. */
  chance(p: number): boolean;
  getState(): number;
  setState(state: number): void;
}

export function createRng(seed: number): Rng {
  let state = seed >>> 0;

  const next = (): number => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  return {
    next,
    int: (min, max) => min + Math.floor(next() * (max - min + 1)),
    chance: (p) => next() < p,
    getState: () => state,
    setState: (s) => {
      state = s >>> 0;
    },
  };
}
