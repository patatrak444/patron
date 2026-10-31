// Regole dei suoni (GDD sezione 11).

import { describe, expect, it } from 'vitest';
import { SoundGate } from '../src/audio/gate';

const cfg = { minGap: { pick: 1 / 6 }, maxVoices: 8, chainMax: 12, chainReset: 0.6 };

describe('suoni', () => {
  it('al massimo 6 pop di raccolta al secondo', () => {
    const g = new SoundGate(cfg);
    let played = 0;
    for (let t = 0; t < 1; t += 0.08) if (g.allow('pick', t, 0.05)) played++;
    expect(played).toBeLessThanOrEqual(6);
    expect(played).toBeGreaterThanOrEqual(5);
  });

  it('al massimo 8 voci insieme', () => {
    const g = new SoundGate(cfg);
    let played = 0;
    for (let i = 0; i < 20; i++) if (g.allow(`s${i}`, 0, 1)) played++;
    expect(played).toBe(8);
    expect(g.allow('dopo', 1.01, 1)).toBe(true);
  });

  it('il pop sale di un semitono a pezzo, fino a 12, e riparte dopo una pausa', () => {
    const g = new SoundGate(cfg);
    const p: number[] = [];
    for (let i = 0; i < 15; i++) p.push(g.nextChainPitch(i * 0.1));
    expect(p[0]).toBe(1);
    expect(p[1]).toBeCloseTo(2 ** (1 / 12));
    expect(p[14]).toBeCloseTo(2);
    expect(g.nextChainPitch(10)).toBe(1);
  });
});
