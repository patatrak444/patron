import { describe, expect, it } from 'vitest';
import { createFixedStepper } from '../src/core/loop';

const STEP = 1 / 30;

function makeStepper(maxStepsPerFrame = 120) {
  const calls: number[] = [];
  const stepper = createFixedStepper({
    step: STEP,
    maxFrameTime: 0.25,
    maxStepsPerFrame,
    update: (dt) => calls.push(dt),
  });
  return { stepper, calls };
}

describe('passo fisso', () => {
  it('ogni passo di logica dura sempre 1/30 s', () => {
    const { stepper, calls } = makeStepper();
    stepper.advance(0.1);
    expect(calls.length).toBeGreaterThan(0);
    for (const dt of calls) expect(dt).toBe(STEP);
  });

  it('fotogrammi irregolari producono lo stesso tempo di gioco di fotogrammi regolari', () => {
    const regular = makeStepper();
    const irregular = makeStepper();
    for (let i = 0; i < 120; i++) regular.stepper.advance(1 / 60);
    const jitter = [0.005, 0.03, 0.012, 0.02, 0.0163];
    let total = 0;
    let i = 0;
    while (total < 2 - 1e-9) {
      const dt = Math.min(jitter[i++ % jitter.length]!, 2 - total);
      irregular.stepper.advance(dt);
      total += dt;
    }
    expect(Math.abs(regular.calls.length - irregular.calls.length)).toBeLessThanOrEqual(1);
    expect(regular.calls.length).toBeGreaterThanOrEqual(59);
  });

  it('alpha resta tra 0 e 1', () => {
    const { stepper } = makeStepper();
    for (const dt of [0.001, 0.016, 0.05, 0.2]) {
      const { alpha } = stepper.advance(dt);
      expect(alpha).toBeGreaterThanOrEqual(0);
      expect(alpha).toBeLessThan(1);
    }
  });

  it('dopo una lunga pausa il fotogramma viene tagliato a 0,25 s', () => {
    const { stepper, calls } = makeStepper();
    stepper.advance(10);
    expect(calls.length).toBe(Math.floor(0.25 / STEP));
  });

  it('tempo × 10 esegue dieci volte i passi', () => {
    const normal = makeStepper();
    const fast = makeStepper();
    fast.stepper.timeScale = 10;
    for (let i = 0; i < 60; i++) {
      normal.stepper.advance(1 / 60);
      fast.stepper.advance(1 / 60);
    }
    expect(fast.calls.length).toBeGreaterThanOrEqual(normal.calls.length * 10 - 1);
    expect(fast.calls.length).toBeLessThanOrEqual(normal.calls.length * 10 + 1);
  });

  it('il tetto di passi per fotogramma è rispettato e il ritardo non si accumula', () => {
    const { stepper, calls } = makeStepper(5);
    stepper.timeScale = 10;
    const first = stepper.advance(0.25);
    expect(first.steps).toBe(5);
    expect(first.alpha).toBeLessThanOrEqual(1);
    stepper.timeScale = 1;
    const before = calls.length;
    stepper.advance(0);
    expect(calls.length - before).toBeLessThanOrEqual(1);
  });

  it('in pausa la logica non avanza', () => {
    const { stepper, calls } = makeStepper();
    stepper.paused = true;
    stepper.advance(0.2);
    expect(calls.length).toBe(0);
  });
});
