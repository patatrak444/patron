// Regole dei suoni (GDD sezione 11).

import { describe, expect, it } from 'vitest';
import { SoundGate } from '../src/audio/gate';

const cfg = { minGap: { pick: 0.07 }, maxVoices: 8, chainMax: 12, chainReset: 0.6 };

describe('suoni', () => {
  it('il pop suona a ogni pezzo raccolto, uno ogni 0,08 s (12 al secondo), ma non più fitto', () => {
    const g = new SoundGate(cfg);
    let played = 0;
    for (let i = 0; i < 12; i++) if (g.allow('pick', i * 0.08, 0.05)) played++;
    expect(played).toBe(12);
    let dense = 0;
    for (let i = 0; i < 40; i++) if (g.allow('pick', 10 + i * 0.025, 0.02)) dense++;
    expect(dense).toBeLessThanOrEqual(15);
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
