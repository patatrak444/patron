// La valle (GDD sezioni 4 e 10): terreno, capanna, stazioni, Campo 1 con le piante di Lumina,
// muri di vegetazione sulle aree chiuse e giungla decorativa oltre i bordi.
// Alberi, cespugli, rocce, camion e personaggi vengono dai pacchetti CC0 di Kenney; le stazioni
// si costruiscono da codice nello stesso stile.

import * as THREE from 'three';
import { BONFIRE, FIELD_PLOTS, LOCKED_AREAS, PRESSES, TRUCK, VALLEY, toWorld, type MapPoint } from '../config/map';
import { createRng, type Rng } from '../core/rng';
import type { Assets, PropId } from './assets';
import { createGround } from './ground';
import { bakeGroup, createBatches } from './batching';
import { createSingle, type Placement } from './instancing';
import { createBonfire, createDesk, createHut, createLuminaPlants, createPress } from './models/stations';

/** Profondità della cornice di giungla oltre i bordi della valle. */
const FRAME_DEPTH = 9;

/** Alberi della cornice (GDD sezione 10): tondi e regolari, con qualche palma per il tema tropicale. */
const FRAME_TREES: readonly { id: PropId; weight: number; h: [number, number] }[] = [
  { id: 'tree_fat', weight: 3, h: [4, 5] },
  { id: 'tree_oak', weight: 2, h: [4.5, 5.5] },
  { id: 'tree_palm', weight: 2, h: [5.5, 6.5] },
];

interface Spot extends MapPoint {
  readonly jitter: number;
}

/**
 * Punti in file regolari sfalsate (a nido d'ape), con uno scarto minimo: l'ordine di un plastico,
 * non la casualità di un bosco (GDD sezione 10).
 */
function rows(rng: Rng, bounds: { x0: number; y0: number; x1: number; y1: number }, spacing: number): Spot[] {
  const out: Spot[] = [];
  let r = 0;
  for (let y = bounds.y0; y <= bounds.y1 + 1e-6; y += spacing * 0.87, r++) {
    for (let x = bounds.x0 + (r % 2 ? spacing / 2 : 0); x <= bounds.x1 + 1e-6; x += spacing) {
      out.push({ x: x + (rng.next() - 0.5) * 0.15, y: y + (rng.next() - 0.5) * 0.15, jitter: rng.next() });
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
  build(assets: Assets, root: THREE.Group, name = 'vegetazione'): void {
    for (const shadow of [true, false]) {
      const entries = [...this.map.values()]
        .filter((e) => e.shadow === shadow)
        .map((e) => ({ prop: assets.props[e.id], list: e.list }));
      if (entries.length === 0) continue;
      const batches = createBatches(entries, { castShadow: shadow });
      batches.name = `${name} ${shadow ? 'con ombra' : 'senza ombra'}`;
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
  /** Muri di vegetazione delle aree chiuse, uno per area: spariscono allo sblocco. */
  readonly covers: ReadonlyMap<string, THREE.Group>;
  /** Pressa 1 e Pressa 2 (nascosta finché non si sblocca). */
  readonly presses: Readonly<Record<string, THREE.Group>>;
  /** Piante di Lumina dei Campi 1–3 (2 e 3 nascosti finché non si sbloccano). */
  readonly plants: Readonly<Record<string, THREE.Group>>;
  readonly truck: THREE.Object3D;
  readonly bonfire: THREE.Group;
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
  const presses: Record<string, THREE.Group> = {};
  for (const l of PRESSES) {
    const press = placeAt(bakeGroup(createPress()), l);
    press.name = l.id;
    press.visible = l.id === 'press1';
    presses[l.id] = press;
    root.add(press);
    occluders.push(press);
  }
  // Camion di El Gordo: 2,3 × 5,5 m, alto 2,6 m, muso verso nord.
  const truck = placeAt(createSingle(assets.props.truck_flat, 2.6), TRUCK, Math.PI);
  // Il camion di El Gordo nel giallo del marchio: il bianco del modello supera la soglia del bloom e brillerebbe.
  truck.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mat = (mesh.material as THREE.MeshLambertMaterial).clone();
    mat.color.setHex(0xffd27a);
    mesh.material = mat;
  });
  const desk = placeAt(bakeGroup(createDesk()), { x: 28, y: 26.4 });
  const officeTree = placeAt(createSingle(assets.props.tree_oak, 5.5, 0.6), { x: 30, y: 28 });
  const bonfire = placeAt(bakeGroup(createBonfire()), BONFIRE);
  root.add(hut, truck, desk, officeTree, bonfire);
  occluders.push(hut, truck, officeTree);

  // Campi 1–3: sedici piante di Lumina in quattro file regolari, alte 0,7–1,0 m (GDD sezione 10).
  const plantGroups: Record<string, THREE.Group> = {};
  for (const f of FIELD_PLOTS.slice(0, 3)) {
    const plants: { x: number; z: number; h: number; r: number }[] = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const p = toWorld({ x: -1.44 + i * 0.96, y: -1.5 + j * 1 });
        plants.push({ ...p, h: 0.8 + ((i + j) % 3) * 0.1, r: (i * 4 + j) * 1.3 });
      }
    }
    const g = placeAt(createLuminaPlants(plants), f);
    g.name = `piante:${f.id}`;
    g.visible = f.id === 'field1';
    plantGroups[f.id] = g;
    root.add(g);
  }

  // Muri di vegetazione sulle aree chiuse, in file ordinate: uno per area, così spariscono allo sblocco.
  const covers = new Map<string, THREE.Group>();
  for (const area of LOCKED_AREAS) {
    if (area.shape.kind !== 'rect') continue;
    const CP = new Placements();
    const cover = new THREE.Group();
    cover.name = `copertura:${area.id}`;
    const { x, y, w, h } = area.shape;
    const bounds = { x0: x - w / 2 + 0.6, y0: y - h / 2 + 0.6, x1: x + w / 2 - 0.6, y1: y + h / 2 - 0.6 };
    if (area.cover === 'jungle') {
      for (const s of rows(rng, bounds, 3)) {
        const edge = s.y < bounds.y0 + 3.5;
        // Sul margine sud alberi tondi bassi, dentro alberi e palme più alti.
        const id: PropId = edge ? (s.jitter < 0.5 ? 'tree_fat' : 'tree_oak') : pickWeighted(rng, FRAME_TREES).id;
        CP.add(id, edge, s, edge ? 4.2 + s.jitter * 0.8 : 5 + s.jitter * 2, s.jitter * 6.3);
      }
      for (const s of rows(rng, { ...bounds, y0: bounds.y0 - 0.4, y1: bounds.y0 + 0.6 }, 1.5)) CP.add('bush_round', true, s, 1.1, s.jitter * 6.3);
    } else {
      for (const s of rows(rng, bounds, 1.4)) CP.add('bush_round', true, s, 1.05, s.jitter * 6.3);
    }
    CP.build(assets, cover, cover.name);
    covers.set(area.id, cover);
    root.add(cover);
  }

  // Cornice di giungla attorno alla valle: tre file di alberi tondi. Oltre, verde uniforme.
  const frame = { x0: -FRAME_DEPTH, y0: -FRAME_DEPTH, x1: VALLEY.width + FRAME_DEPTH, y1: VALLEY.depth + FRAME_DEPTH };
  const outside = (x: number, y: number): boolean => x < -0.9 || y < -0.9 || x > VALLEY.width + 0.9 || y > VALLEY.depth + 0.9;
  for (const s of rows(rng, frame, 3)) {
    if (!outside(s.x, s.y)) continue;
    // Sud e ovest stanno tra la camera e la valle: lì solo cespugli e alberi bassi, per non coprire il giocatore.
    const towardCamera = s.y < 0 || s.x < 0;
    if (s.y < 0) {
      // A sud basta una fila di cespugli: le file dietro restano fuori inquadratura.
      if (s.y > -3) P.add('bush_round', true, s, 1.1 + s.jitter * 0.3, s.jitter * 6.3);
      continue;
    }
    const t = towardCamera ? { id: 'tree_fat' as PropId, h: [3.6, 4.4] as [number, number] } : pickWeighted(rng, FRAME_TREES);
    P.add(t.id, true, s, range(t.h), s.jitter * 6.3);
  }
  // Staccionata lungo il bordo sud, ai lati della capanna: misura la scala del mondo.
  for (let x = 6; x <= 34; x += 2) {
    if (Math.abs(x - 20) < 4) continue;
    P.add('fence', true, { x, y: -0.7 }, 1, 0, 1);
  }

  P.build(assets, root);
  return { root, occluders, covers, presses, plants: plantGroups, truck, bonfire };
}
