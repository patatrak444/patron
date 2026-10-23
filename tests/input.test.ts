import { describe, expect, it } from 'vitest';
import { KeyState, WheelSteps } from '../src/core/input';

describe('tasti di movimento', () => {
  it('W A S D e frecce danno le 8 direzioni', () => {
    const k = new KeyState();
    k.press('KeyW');
    k.press('KeyD');
    expect(k.move()).toEqual({ x: 1, y: 1 });
    k.release('KeyW');
    k.press('ArrowDown');
    expect(k.move()).toEqual({ x: 1, y: -1 });
  });

  it('tasti opposti si annullano', () => {
    const k = new KeyState();
    k.press('KeyA');
    k.press('ArrowRight');
    expect(k.move()).toEqual({ x: 0, y: 0 });
  });

  it('stesso verso da due tasti non raddoppia', () => {
    const k = new KeyState();
    k.press('KeyW');
    k.press('ArrowUp');
    expect(k.move()).toEqual({ x: 0, y: 1 });
  });

  it('alla perdita del focus i tasti si rilasciano', () => {
    const k = new KeyState();
    k.press('KeyW');
    k.clear();
    expect(k.move()).toEqual({ x: 0, y: 0 });
  });

  it('ignora i tasti che non muovono', () => {
    const k = new KeyState();
    expect(k.press('KeyU')).toBe(false);
    expect(k.move()).toEqual({ x: 0, y: 0 });
  });
});

describe('rotella', () => {
  it('uno scatto della rotella del mouse cambia zoom di un livello', () => {
    const w = new WheelSteps();
    expect(w.feed(100, 0)).toBe(1);
    expect(w.feed(-100, 500)).toBe(-1);
  });

  it('i piccoli movimenti del trackpad si sommano', () => {
    const w = new WheelSteps();
    expect(w.feed(10, 0)).toBe(0);
    expect(w.feed(10, 10)).toBe(0);
    expect(w.feed(25, 20)).toBe(1);
  });

  it('una raffica di eventi conta come un solo scatto', () => {
    const w = new WheelSteps();
    expect(w.feed(100, 0)).toBe(1);
    expect(w.feed(100, 50)).toBe(0);
    expect(w.feed(100, 100)).toBe(0);
  });
});
