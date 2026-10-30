// Potenziamenti dell'Ufficio (GDD sezione 5): costi, effetti, stelle.

import { describe, expect, it } from 'vitest';
import { BALANCE } from '../src/config/balance';
import { TRUCK } from '../src/config/map';
import { createBus, type GameEvents } from '../src/core/bus';
import { createRng } from '../src/core/rng';
import { createPhase1, stepPhase1, type Phase1State } from '../src/sim/phase1';
import { createMoveContext } from '../src/sim/state';
import { buyUpgrade, openOffice, speedFactor, stackCapacity, upgradeCost } from '../src/sim/upgrades';

const cfg = BALANCE.phase1;
const bus = () => createBus<GameEvents>();

function withOffice(): Phase1State {
  const s = createPhase1();
  s.piles = [];
  openOffice(s);
  return s;
}

describe("Ufficio e potenziamenti (GDD 5)", () => {
  it("aprendo l'Ufficio El Gordo regala lo Zaino 1: pila da 4 a 6, senza stelle", () => {
    const s = withOffice();
    expect(s.upgrades.backpack).toBe(1);
    expect(s.stack.capacity).toBe(6);
    expect(s.stars).toBe(0);
  });

  it('i costi crescono di 1,8 volte a livello: Zaino 40, 72, 130, 233; poi è al massimo', () => {
    const s = withOffice();
    s.cash = 10_000;
    const paid: number[] = [];
    for (let i = 0; i < 4; i++) {
      paid.push(upgradeCost(s, 'backpack')!);
      expect(buyUpgrade(s, 'backpack', bus())).toBe(true);
    }
    expect(paid).toEqual([40, 72, 130, 233]);
    expect(s.upgrades.backpack).toBe(5);
    expect(upgradeCost(s, 'backpack')).toBeNull();
    expect(buyUpgrade(s, 'backpack', bus())).toBe(false);
    expect(stackCapacity(s)).toBe(14);
  });

  it('Scarpe e Guadagno partono da 60 e 80; ogni livello comprato dà 1 stella', () => {
    const s = withOffice();
    expect(upgradeCost(s, 'shoes')).toBe(60);
    expect(upgradeCost(s, 'profit')).toBe(80);
    s.cash = 60;
    expect(buyUpgrade(s, 'shoes', bus())).toBe(true);
    expect(s.cash).toBe(0);
    expect(s.stars).toBe(cfg.respect.starsPerUpgrade);
    expect(speedFactor(s)).toBeCloseTo(1.15);
  });

  it('senza soldi o senza Ufficio non si compra nulla', () => {
    const s = createPhase1();
    s.cash = 1000;
    expect(buyUpgrade(s, 'shoes', bus())).toBe(false);
    const t = withOffice();
    t.cash = 59;
    expect(buyUpgrade(t, 'shoes', bus())).toBe(false);
    expect(t.cash).toBe(59);
  });

  it('il Guadagno alza il prezzo di vendita, e il contante resta intero', () => {
    const s = withOffice();
    s.cash = 80;
    buyUpgrade(s, 'profit', bus());
    s.truck.arrived = true;
    s.stack.items = ['paste', 'paste', 'paste', 'paste'];
    const b = bus();
    const amounts: number[] = [];
    b.on('truck:sale', ({ amount }) => amounts.push(amount));
    const ctx = { grid: createMoveContext(s).grid, rng: createRng(1) };
    for (let t = 0; t < 1; t += BALANCE.sim.step) stepPhase1(s, TRUCK.deposit, BALANCE.sim.step, b, ctx);
    expect(amounts.every((a) => Number.isInteger(a))).toBe(true);
    // 4 Panetti a $5 × 1,1 = $22.
    expect(amounts.reduce((x, y) => x + y, 0)).toBe(22);
  });
});
