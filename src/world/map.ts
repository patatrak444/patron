// La valle (GDD sezioni 4 e 10): terreno, capanna, stazioni, Campo 1 con le piante di Lumina,
// muri di vegetazione sulle aree chiuse e giungla decorativa oltre i bordi.
// Alberi, cespugli, rocce, camion e personaggi vengono dai pacchetti CC0 di Kenney; le stazioni
// si costruiscono da codice nello stesso stile.

import * as THREE from 'three';
import { FIELD_PLOTS, FIELD_SIZE, LOCKED_AREAS, VALLEY, toWorld, type MapPoint } from '../config/map';
import { createRng, type Rng } from '../core/rng';
import type { Assets, PropId } from './assets';
import { isInsideObstacle, isOnGroundFeature, createGround } from './ground';
import { bakeGroup, createBatches } from './batching';
import { createSingle, type Placement } from './instancing';
import { createDesk, createHut, createLuminaPlants, createPress } from './models/stations';

/** Larghezza della fascia di giungla decorativa oltre i bordi: la camera non vede mai il vuoto. */
const OUTER_JUNGLE = 30;
/**
 * A sud la camera guarda verso nord: alberi alti lì coprirebbero il personaggio vicino al bordo.
 * In questa fascia ci sono solo cespugli; gli alberi cominciano più in là, fuori inquadratura.
 */
const SOUTH_BUSH_BAND = 9;
/** Solo gli alberi entro questa distanza dalla valle fanno ombra e hanno tutti i dettagli. */
const NEAR_DISTANCE = 9;
/** Gli alberi oltre il bordo fanno ombra solo fin qui: più in là l'ombra non cade mai nell'inquadratura. */
const SHADOW_DISTANCE = 3;

/** Alberi della giungla, 4–8 m (GDD sezione 10): palme e alberi tropicali. */
const JUNGLE_TREES: readonly { id: PropId; weight: number; h: [number, number] }[] = [
  { id: 'tree_palm', weight: 3, h: [5.5, 8] },
  { id: 'tree_oak', weight: 2, h: [4.5, 6.5] },
  { id: 'tree_dark', weight: 2, h: [4, 6] },
  { id: 'tree_fat', weight: 1, h: [4, 5.5] },
];

interface Spot extends MapPoint {
  readonly jitter: number;
}

/** Punti su una griglia con scarto casuale, tenuti solo se `keep` è vero. */
function scatter(
  rng: Rng,
  bounds: { x0: number; y0: number; x1: number; y1: number },
  spacing: number,
  keep: (x: number, y: number) => boolean,
): Spot[] {
  const out: Spot[] = [];
  for (let y = bounds.y0; y <= bounds.y1; y += spacing) {
    for (let x = bounds.x0; x <= bounds.x1; x += spacing) {
      const px = x + (rng.next() - 0.5) * spacing * 0.9;
      const py = y + (rng.next() - 0.5) * spacing * 0.9;
      if (keep(px, py)) out.push({ x: px, y: py, jitter: rng.next() });
    }
  }
  return out;
}

function pickWeighted<T extends { weight: number }>(rng: Rng, list: readonly T[]): T {
  const total = list.reduce((s, it) => s + it.weight, 0);
  let r = rng.next() * total;
  for (const it of list) {
    r -= it.weight;
    if (r <= 0) return it;
  }
  return list[list.length - 1]!;
}

/** Contenitore dei posizionamenti per tipo di modello e per ombra sì/no. */
class Placements {
  private readonly map = new Map<string, { id: PropId; shadow: boolean; list: Placement[] }>();
  add(id: PropId, shadow: boolean, at: MapPoint, height: number, rotY: number, tint?: number, widthFactor?: number): void {
    const key = `${id}:${shadow}`;
    const e = this.map.get(key) ?? { id, shadow, list: [] };
    const w = toWorld(at);
    e.list.push({ x: w.x, z: w.z, height, rotY, tint, widthFactor });
    this.map.set(key, e);
  }
  build(assets: Assets, root: THREE.Group): void {
    for (const shadow of [true, false]) {
      const entries = [...this.map.values()]
        .filter((e) => e.shadow === shadow)
        .map((e) => ({ prop: assets.props[e.id], list: e.list }));
      const batches = createBatches(entries, { castShadow: shadow });
      batches.name = shadow ? 'vegetazione con ombra' : 'vegetazione senza ombra';
      root.add(batches);
    }
  }
}

function placeAt<T extends THREE.Object3D>(obj: T, at: MapPoint, rotY = 0): T {
  const p = toWorld(at);
  obj.position.set(p.x, 0, p.z);
  obj.rotation.y = rotY;
  return obj;
}

export interface Valley {
  readonly root: THREE.Group;
  /** Oggetti che diventano trasparenti quando coprono il giocatore. */
  readonly occluders: readonly THREE.Object3D[];
}

export function createValley(assets: Assets): Valley {
  const root = new THREE.Group();
  root.name = 'valley';
  const rng = createRng(1981);
  const occluders: THREE.Object3D[] = [];
  const P = new Placements();
  const range = ([a, b]: [number, number]): number => a + rng.next() * (b - a);

  root.add(createGround());

  // Capanna e stazioni (posizioni del GDD sezione 4).
  const hut = placeAt(bakeGroup(createHut()), { x: 20, y: 0.6 });
  const press = placeAt(bakeGroup(createPress()), { x: 14, y: 26 });
  // Camion di El Gordo: 2,3 × 5,5 m, alto 2,6 m, muso verso nord.
  const truck = placeAt(createSingle(assets.props.truck_flat, 2.6), { x: 3, y: 26 }, Math.PI);
  const desk = placeAt(bakeGroup(createDesk()), { x: 28, y: 26.4 });
  const officeTree = placeAt(createSingle(assets.props.tree_oak, 6.5, 0.6), { x: 30, y: 28 });
  root.add(hut, press, truck, desk, officeTree);
  occluders.push(hut, press, truck, officeTree);

  // Campo 1: sedici piante di Lumina, alte 0,4–0,8 m (GDD sezione 10).
  const f1 = FIELD_PLOTS[0]!;
  const plants: { x: number; z: number; h: number; r: number }[] = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      const p = toWorld({ x: f1.x - 1.35 + i * 0.9 + (rng.next() - 0.5) * 0.2, y: f1.y - 1.35 + j * 0.9 + (rng.next() - 0.5) * 0.2 });
      plants.push({ ...p, h: 0.5 + rng.next() * 0.35, r: rng.next() * Math.PI * 2 });
    }
  }
  root.add(createLuminaPlants(plants));

  // Muri di vegetazione sulle aree chiuse.
  for (const area of LOCKED_AREAS) {
    if (area.shape.kind !== 'rect') continue;
    const { x, y, w, h } = area.shape;
    const bounds = { x0: x - w / 2 + 0.5, y0: y - h / 2 + 0.5, x1: x + w / 2 - 0.4, y1: y + h / 2 - 0.4 };
    if (area.cover === 'jungle') {
      for (const s of scatter(rng, bounds, 2.4, () => true)) {
        const t = pickWeighted(rng, JUNGLE_TREES);
        // Solo il margine del muro fa ombra sulla valle: dentro la giungla l'ombra non si vede.
        P.add(t.id, s.y < bounds.y0 + 4, s, range(t.h), s.jitter * 6.3);
      }
      // Sottobosco al margine sud della giungla: il muro sembra fitto anche da vicino.
      for (const s of scatter(rng, { ...bounds, y1: bounds.y0 + 3 }, 1.2, () => true)) {
        P.add(s.jitter < 0.5 ? 'bush_large' : 'bush', true, s, 0.8 + s.jitter * 0.7, s.jitter * 6.3);
      }
    } else {
      for (const s of scatter(rng, bounds, 1.1, () => true)) {
        P.add(s.jitter < 0.4 ? 'bush_large' : 'bush', true, s, 0.6 + s.jitter * 0.6, s.jitter * 6.3, 0.9 + s.jitter * 0.2);
      }
      for (const s of scatter(rng, bounds, 1.6, () => rng.chance(0.35))) P.add('flower_red', false, s, 0.35, s.jitter * 6.3);
    }
  }

  // Giungla decorativa oltre i bordi.
  const outside = (x: number, y: number): boolean => x < -0.6 || y < -0.6 || x > VALLEY.width + 0.6 || y > VALLEY.depth + 0.6;
  const distanceFromValley = (x: number, y: number): number => Math.max(-x, x - VALLEY.width, -y, y - VALLEY.depth, 0);
  const inSouthBand = (y: number): boolean => y < 0 && y > -SOUTH_BUSH_BAND;
  const outer = { x0: -OUTER_JUNGLE, y0: -OUTER_JUNGLE, x1: VALLEY.width + OUTER_JUNGLE, y1: VALLEY.depth + OUTER_JUNGLE };
  for (const s of scatter(rng, outer, 2.8, (x, y) => outside(x, y) && !inSouthBand(y))) {
    const near = distanceFromValley(s.x, s.y) <= NEAR_DISTANCE;
    if (near) {
      const t = pickWeighted(rng, JUNGLE_TREES);
      const shadow = distanceFromValley(s.x, s.y) <= SHADOW_DISTANCE;
      P.add(t.id, shadow, s, range(t.h), s.jitter * 6.3, 0.85 + s.jitter * 0.25);
    } else if (rng.chance(0.6)) {
      // Lontano: la versione più semplice (50 triangoli), senza ombre.
      P.add('tree_fat', false, s, 4 + s.jitter * 3, s.jitter * 6.3, 0.75 + s.jitter * 0.2);
    }
  }
  // Fascia sud: solo cespugli bassi, così non coprono il giocatore.
  for (const s of scatter(rng, { x0: -OUTER_JUNGLE, y0: -SOUTH_BUSH_BAND, x1: VALLEY.width + OUTER_JUNGLE, y1: -0.9 }, 2, (x, y) => inSouthBand(y) && !(Math.abs(x - 20) < 3.4 && y > -2))) {
    P.add(s.jitter < 0.3 ? 'bush_large' : 'bush', s.y > -2.5, s, 0.55 + s.jitter * 0.55, s.jitter * 6.3, 0.85 + s.jitter * 0.25);
  }
  // Staccionata lungo il bordo sud, ai lati della capanna: misura la scala del mondo.
  for (let x = 6; x <= 34; x += 2) {
    if (Math.abs(x - 20) < 4) continue;
    P.add('fence', true, { x, y: -0.7 }, 1, 0, 1);
  }

  // Dettagli dentro la valle: rocce, ceppi, tronchi e fiori fuori da sentieri, campi e stazioni.
  const free = (x: number, y: number): boolean =>
    x > 0.5 && x < VALLEY.width - 0.5 && y > 0.5 && y < 33 && !isOnGroundFeature({ x, y }, 0.6) && !isInsideObstacle({ x, y }, 1.2) && !nearLocked(x, y);
  const details: [PropId, number, [number, number], boolean][] = [
    ['rock_small', 22, [0.25, 0.45], true],
    ['rock_large', 4, [0.45, 0.65], true],
    ['stump', 5, [0.4, 0.6], true],
    ['log', 3, [0.45, 0.55], true],
    ['flower_red', 26, [0.3, 0.42], false],
    ['bush', 14, [0.5, 0.8], true],
  ];
  for (const [id, count, h, shadow] of details) {
    let placed = 0;
    for (let tries = 0; placed < count && tries < count * 40; tries++) {
      const x = rng.next() * VALLEY.width;
      const y = rng.next() * 34;
      if (!free(x, y)) continue;
      // Le rocce grandi del pacchetto sono lastre larghe: si stringono per restare in scala.
      P.add(id, shadow, { x, y }, range(h), rng.next() * 6.3, undefined, id === 'rock_large' ? 0.45 : 1);
      placed++;
    }
  }

  P.build(assets, root);
  return { root, occluders };
}

function nearLocked(x: number, y: number): boolean {
  for (const a of LOCKED_AREAS) {
    if (a.shape.kind !== 'rect') continue;
    const { x: cx, y: cy, w, h } = a.shape;
    if (Math.abs(x - cx) < w / 2 + 0.8 && Math.abs(y - cy) < h / 2 + 0.8) return true;
  }
  const f = FIELD_PLOTS[0]!;
  return Math.abs(x - f.x) < FIELD_SIZE / 2 + 0.8 && Math.abs(y - f.y) < FIELD_SIZE / 2 + 0.8;
}
