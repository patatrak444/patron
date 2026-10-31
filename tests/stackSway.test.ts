// La pila che si piega come una molla (GDD sezione 10): tetto all'inclinazione e assestamento.

import { describe, expect, it } from 'vitest';
import { BALANCE } from '../src/config/balance';
import { StackSway } from '../src/world/stackSway';

const cfg = BALANCE.feel.playerStack;
const DT = 1 / 60;

function run(sway: StackSway, vx: number, seconds: number): { x: number; z: number; max: number } {
  let out = { x: 0, z: 0 };
  let max = 0;
  for (let t = 0; t < seconds; t += DT) {
    out = sway.update(vx, 0, DT, cfg);
    max = Math.max(max, Math.hypot(out.x, out.z));
  }
  return { ...out, max };
}

describe('pila a molla', () => {
  it('partendo di colpo la cima si sposta all\'indietro, ma non oltre il tetto (con un piccolo rimbalzo)', () => {
    const r = run(new StackSway(), 4, 0.3);
    expect(r.max).toBeGreaterThan(cfg.maxLean * 0.5);
    expect(r.max).toBeLessThan(cfg.maxLean * 1.3);
  });

  it('in corsa costante la pila torna quasi dritta', () => {
    const s = new StackSway();
    run(s, 4, 0.5);
    const r = run(s, 4, 2);
    expect(Math.hypot(r.x, r.z)).toBeLessThan(0.02);
  });

  it('fermandosi si piega in avanti e poi si assesta', () => {
    const s = new StackSway();
    run(s, 4, 2);
    const stop = run(s, 0, 0.3);
    expect(stop.max).toBeGreaterThan(0.03);
    const rest = run(s, 0, 2);
    expect(Math.hypot(rest.x, rest.z)).toBeLessThan(0.01);
  });
});
