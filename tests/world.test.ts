import * as THREE from 'three';
import { describe, expect, it } from 'vitest';
import { BALANCE } from '../src/config/balance';
import { OBSTACLES, PATHS, PLAYER_SPAWN } from '../src/config/map';
import { scaleToHeight } from '../src/world/assets';
import { isSolid, mergePieces, SOLID } from '../src/world/batching';
import { FADE_OPACITY, FADE_SECONDS, stepOpacity } from '../src/world/fade';
import { distanceToStrip, isOnGroundFeature } from '../src/world/ground';
import { chunkKey, groupByChunk } from '../src/world/instancing';
import { snap, SUN_ELEVATION_DEG, sunDirection } from '../src/world/lights';
import { cycleTimeScale, SPRINT_STRIDE } from '../src/world/models/character';

describe('trasparenza degli oggetti davanti al giocatore (GDD 10)', () => {
  it('passa da 1 a 0,3 in 0,15 s e torna indietro nello stesso tempo', () => {
    let o = 1;
    const dt = FADE_SECONDS / 10;
    for (let i = 0; i < 10; i++) o = stepOpacity(o, FADE_OPACITY, dt);
    expect(o).toBeCloseTo(FADE_OPACITY, 6);
    for (let i = 0; i < 10; i++) o = stepOpacity(o, 1, dt);
    expect(o).toBeCloseTo(1, 6);
  });

  it('non supera il valore obiettivo con un fotogramma lungo', () => {
    expect(stepOpacity(1, FADE_OPACITY, 1)).toBe(FADE_OPACITY);
  });
});

describe('animazioni legate alla velocità reale (GDD 10)', () => {
  it('alla velocità del giocatore la corsa gira poco sopra la velocità naturale', () => {
    const k = cycleTimeScale(BALANCE.player.speed, SPRINT_STRIDE, 0.5);
    expect(k).toBeCloseTo((4 * 0.5) / 1.79, 6);
    expect(k).toBeGreaterThan(1);
    expect(k).toBeLessThan(1.3);
  });

  it('ripiega su 1 con dati non validi', () => {
    expect(cycleTimeScale(4, 0, 0.5)).toBe(1);
    expect(cycleTimeScale(4, 1.8, 0)).toBe(1);
  });
});

describe('sole e ombre (GDD 10)', () => {
  it('arriva da sud-ovest a 35° di elevazione', () => {
    const d = sunDirection();
    expect(d.length()).toBeCloseTo(1, 6);
    expect(d.x).toBeLessThan(0);
    expect(d.z).toBeGreaterThan(0);
    expect(Math.asin(d.y) * (180 / Math.PI)).toBeCloseTo(SUN_ELEVATION_DEG, 6);
  });

  it('il riquadro d’ombra si sposta a scatti regolari', () => {
    expect(snap(10.04, 0.1)).toBeCloseTo(10, 6);
    expect(snap(-3.26, 0.5)).toBeCloseTo(-3.5, 6);
  });
});

describe('blocchi della vegetazione', () => {
  it('raggruppa i punti per quadrati di lato fisso', () => {
    expect(chunkKey(0, 0, 12)).toBe(chunkKey(11.9, 11.9, 12));
    expect(chunkKey(-0.1, 0, 12)).not.toBe(chunkKey(0.1, 0, 12));
    const groups = groupByChunk(
      [
        { x: 1, z: 1 },
        { x: 2, z: 3 },
        { x: 30, z: 1 },
      ],
      12,
    );
    expect(groups.size).toBe(2);
  });

  it('scala un modello all’altezza voluta', () => {
    expect(scaleToHeight(2, 6)).toBe(3);
    expect(scaleToHeight(0, 6)).toBe(1);
  });
});

describe('sentieri e campi sul terreno', () => {
  it('misura la distanza dall’asse di un sentiero', () => {
    const s = { from: { x: 0, y: 0 }, to: { x: 10, y: 0 }, width: 2 };
    expect(distanceToStrip({ x: 5, y: 3 }, s)).toBeCloseTo(3, 6);
    expect(distanceToStrip({ x: -4, y: 3 }, s)).toBeCloseTo(5, 6);
  });

  it('riconosce i punti sopra sentieri e campi', () => {
    const p = PATHS[0]!;
    expect(isOnGroundFeature({ x: p.from.x, y: (p.from.y + p.to.y) / 2 })).toBe(true);
    expect(isOnGroundFeature({ x: 20, y: 12 })).toBe(true); // Campo 1
    expect(isOnGroundFeature({ x: 36, y: 4 })).toBe(false);
  });
});

describe('fusione delle geometrie statiche', () => {
  it('somma i vertici, applica le trasformazioni e scrive il colore', () => {
    const a = new THREE.BoxGeometry(1, 1, 1);
    const m = new THREE.Matrix4().makeTranslation(10, 0, 0);
    const g = mergePieces([
      { geometry: a, matrix: new THREE.Matrix4(), tint: new THREE.Color(1, 0, 0) },
      { geometry: a, matrix: m, tint: new THREE.Color(0, 1, 0) },
    ]);
    const n = a.toNonIndexed().getAttribute('position').count;
    expect(g.getAttribute('position').count).toBe(2 * n);
    g.computeBoundingBox();
    expect(g.boundingBox!.max.x).toBeCloseTo(10.5, 6);
    const c = g.getAttribute('color');
    expect([c.getX(0), c.getY(0)]).toEqual([1, 0]);
    expect([c.getX(n), c.getY(n)]).toEqual([0, 1]);
  });

  it('fonde nel materiale unico solo i colori pieni', () => {
    expect(isSolid(new THREE.MeshLambertMaterial({ color: 0x336699 }))).toBe(true);
    expect(isSolid(new THREE.MeshLambertMaterial({ emissive: 0xffffff }))).toBe(false);
    expect(isSolid(new THREE.MeshLambertMaterial({ map: new THREE.Texture() }))).toBe(false);
    expect(isSolid(new THREE.MeshBasicMaterial())).toBe(false);
    expect(SOLID.vertexColors).toBe(true);
  });
});

describe('inquadratura di partenza (GDD 10)', () => {
  it('nessuna parte della capanna più alta delle ginocchia tra la camera e i piedi del giocatore', () => {
    const hut = OBSTACLES.find((o) => o.id === 'hut')!.shape;
    if (hut.kind !== 'rect') throw new Error('capanna rettangolare');
    // Gronda nord: muro nord a y = 0,6 + 2 = 2,6, sbalzo di 0,45 m, alta 2,4 m.
    const eaveY = 0.6 + 2 + 0.45;
    const eaveH = 2.4;
    // La camera guarda da sud con inclinazione di 55°: il raggio sale di tan(55°) per metro verso sud.
    const rise = Math.tan((BALANCE.camera.pitchDeg * Math.PI) / 180);
    const feet = 0.2;
    const heightAtEave = feet + (PLAYER_SPAWN.y - eaveY) * rise;
    expect(heightAtEave).toBeGreaterThan(eaveH);
  });
});
