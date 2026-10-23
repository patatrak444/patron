import { describe, expect, it } from 'vitest';
import { createRng } from '../src/core/rng';

describe('casualità con seme', () => {
  it('lo stesso seme dà sempre la stessa sequenza', () => {
    const a = createRng(1981);
    const b = createRng(1981);
    for (let i = 0; i < 1000; i++) expect(a.next()).toBe(b.next());
  });

  it('semi diversi danno sequenze diverse', () => {
    const a = createRng(1);
    const b = createRng(2);
    const same = Array.from({ length: 20 }, () => a.next() === b.next()).filter(Boolean).length;
    expect(same).toBeLessThan(20);
  });

  it('lo stato salvato riprende la sequenza dallo stesso punto', () => {
    const a = createRng(42);
    for (let i = 0; i < 10; i++) a.next();
    const saved = a.getState();
    const expected = [a.next(), a.next(), a.next()];
    const b = createRng(0);
    b.setState(saved);
    expect([b.next(), b.next(), b.next()]).toEqual(expected);
  });

  it('next resta in [0, 1) e int resta negli estremi', () => {
    const r = createRng(7);
    for (let i = 0; i < 10000; i++) {
      const x = r.next();
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThan(1);
      const n = r.int(1, 3);
      expect(n).toBeGreaterThanOrEqual(1);
      expect(n).toBeLessThanOrEqual(3);
    }
  });
});
