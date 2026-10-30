// La pianta del lotto 1 (GDD sezione 4, «La pianta del lotto 1»; skill ux-ui-arcade-idle, UX6 e UX7).

import { describe, expect, it } from 'vitest';
import { BALANCE } from '../src/config/balance';
import {
  BONFIRE,
  FIELD_PLOTS,
  GIFT_SPOT,
  LOTS,
  OFFICE,
  PRESSES,
  TRUCK,
  fieldArea,
  padArea,
  rectAt,
  rectGap,
  type Rect,
  type UnlockId,
} from '../src/config/map';
import { distanceForHeight } from '../src/world/camera';

const press = PRESSES[0]!;
const field1 = FIELD_PLOTS[0]!;
const field2 = FIELD_PLOTS[1]!;
const gift = rectAt(GIFT_SPOT.x, GIFT_SPOT.y, 1.2, 1.2);
const plot = (f: { x: number; y: number }): Rect => rectAt(f.x, f.y, 4, 4);

describe('pianta del lotto 1', () => {
  it('i tratti del primo ciclo tra fermate diverse stanno tra 2 e 8 m (UX7)', () => {
    const legs: [string, Rect, Rect][] = [
      ['regalo → Campo 1', gift, plot(field1)],
      ['Campo 1 → tramoggia', plot(field1), press.deposit.draw],
      ['Campo 2 → tramoggia', plot(field2), press.deposit.draw],
      ['ripiano → carico', press.output.draw, TRUCK.deposit.draw],
      ['vassoio → Campo 1', TRUCK.tray, plot(field1)],
      ['vassoio → Campo 2', TRUCK.tray, plot(field2)],
      ['Scarti → Falò', press.scrap.draw, BONFIRE.mat.draw],
    ];
    for (const [name, a, b] of legs) {
      const d = rectGap(a, b);
      expect(d, name).toBeGreaterThanOrEqual(2);
      expect(d, name).toBeLessThanOrEqual(8);
    }
  });

  it('due aree d\'attivazione distano almeno 0,6 m (UX7)', () => {
    const areas: [string, Rect][] = [
      ['Campo 1', fieldArea(field1)],
      ['Campo 2', fieldArea(field2)],
      ['tramoggia', press.deposit.area],
      ['ripiano', press.output.area],
      ['Scarti', press.scrap.area],
      ['Falò', BONFIRE.mat.area],
      ['carico', TRUCK.deposit.area],
      ['vassoio', TRUCK.tray],
      ['Ufficio', OFFICE.door.area],
    ];
    for (let i = 0; i < areas.length; i++) {
      for (let j = i + 1; j < areas.length; j++) {
        expect(rectGap(areas[i]![1], areas[j]![1]), `${areas[i]![0]} / ${areas[j]![0]}`).toBeGreaterThanOrEqual(0.6 - 1e-9);
      }
    }
  });

  it('i riquadri d\'acquisto del lotto 1 stanno dentro il lotto e sono larghi almeno 2,3 m (UX1)', () => {
    const ids: UnlockId[] = ['field1', 'press1', 'field2', 'office', 'picker1', 'zone2'];
    for (const id of ids) {
      const a = padArea(id);
      expect(a.x1 - a.x0, id).toBeGreaterThanOrEqual(2.3 - 1e-9);
      expect(a.x0, id).toBeGreaterThanOrEqual(LOTS.lot1.x0);
      expect(a.x1, id).toBeLessThanOrEqual(LOTS.lot1.x1);
      expect(a.y0, id).toBeGreaterThanOrEqual(LOTS.lot1.y0);
      expect(a.y1, id).toBeLessThanOrEqual(LOTS.lot1.y1);
    }
  });

  it('il lotto è vuoto e arioso: stazioni del lotto 1 su meno del 30% del pavimento', () => {
    const l = LOTS.lot1;
    const floor = (l.x1 - l.x0) * (l.y1 - l.y0);
    const used = 2 * 4 * 4 + 3 * 3 + 1.6 * 1.6 + OFFICE.w * OFFICE.h;
    expect(used / floor).toBeLessThan(0.3);
  });
});

describe('camera ad altezza fissa (GDD sezione 3, UX6)', () => {
  const cam = BALANCE.camera;

  it('il lotto 1 in diagonale entra nell\'altezza inquadrata allo zoom medio, con l\'arco', () => {
    const l = LOTS.lot1;
    const diag = (l.x1 - l.x0 + (l.y1 - l.y0)) / Math.SQRT2;
    const onScreen = diag * Math.sin((cam.pitchDeg * Math.PI) / 180) + 4 * Math.cos((cam.pitchDeg * Math.PI) / 180);
    expect(onScreen).toBeLessThan(cam.zoomHeights[1]);
  });

  it('il personaggio da 1,9 m occupa tra 1/16 e 1/12 dell\'altezza allo zoom medio (UX6, desktop)', () => {
    // Altezza vista più la profondità della testa e del cappello (circa 0,5 m) vista dall'alto.
    const p = (cam.pitchDeg * Math.PI) / 180;
    const k = (1.9 * Math.cos(p) + 0.5 * Math.sin(p)) / cam.zoomHeights[1];
    expect(k).toBeGreaterThan(1 / 16);
    expect(k).toBeLessThan(1 / 12);
  });

  it('la distanza della camera non dipende dal rapporto della finestra', () => {
    expect(distanceForHeight(25, cam.fovDeg)).toBeCloseTo(12.5 / Math.tan((cam.fovDeg / 2) * (Math.PI / 180)));
  });
});
