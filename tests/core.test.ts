import { describe, expect, it } from 'vitest';
import { createBus, type GameEvents } from '../src/core/bus';
import { createInitialState, stepSim } from '../src/sim/state';
import { distanceForWidth } from '../src/world/camera';
import { cappedPixelRatio } from '../src/world/scene';

describe('eventi interni', () => {
  it('consegna gli eventi e smette dopo la disiscrizione', () => {
    const bus = createBus<GameEvents>();
    const seen: number[] = [];
    const stop = bus.on('sim:step', (e) => seen.push(e.time));
    bus.emit('sim:step', { time: 1 });
    stop();
    bus.emit('sim:step', { time: 2 });
    expect(seen).toEqual([1]);
  });
});

describe('stato di gioco', () => {
  it('un passo fa avanzare il tempo ed emette sim:step', () => {
    const bus = createBus<GameEvents>();
    const state = createInitialState(1);
    let emitted = 0;
    bus.on('sim:step', () => emitted++);
    stepSim(state, 1 / 30, bus);
    expect(state.time).toBeCloseTo(1 / 30);
    expect(emitted).toBe(1);
  });
});

describe('camera', () => {
  it('allo zoom medio in 16:9 inquadra 24 m di larghezza', () => {
    const aspect = 16 / 9;
    const d = distanceForWidth(24, 35, aspect);
    const halfH = Math.atan(Math.tan((35 * Math.PI) / 360) * aspect);
    expect(2 * d * Math.tan(halfH)).toBeCloseTo(24);
  });
});

describe('risoluzione interna', () => {
  it('su un 5K non supera 2560 × 1440', () => {
    const pr = cappedPixelRatio(2560, 1440, 2);
    expect(2560 * pr).toBeLessThanOrEqual(2560);
    expect(1440 * pr).toBeLessThanOrEqual(1440);
  });

  it('a 1280 × 720 su schermo Retina usa il rapporto pieno', () => {
    expect(cappedPixelRatio(1280, 720, 2)).toBe(2);
  });
});
