// La valle a lotti (GDD sezioni 1, 4 e 10), costruita da zero secondo la skill arcade-idle (Fase 6):
// si parte dentro la Hacienda, un lotto di terra battuta chiuso da una staccionata, con l'arco
// PATRÓN sul lato nord verso la strada di El Gordo. Oltre la staccionata c'è prato a tinta unita e,
// verso i bordi della valle, la giungla in file regolari. Le stazioni non ci sono: compaiono quando
// si comprano; i lotti nuovi si aprono accanto a quello vecchio.

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { ARCH, BONFIRE, FIELD_PLOTS, FIELD_SIZE, LOTS, PICKER_HUT, PRESSES, TRUCK, VALLEY, inRect, toWorld, type LotId, type MapPoint, type Rect } from '../config/map';
import { createRng, type Rng } from '../core/rng';
import type { Assets, PropId } from './assets';
import { bakeGroup, createBatches } from './batching';
import { createGround } from './ground';
import { createSingle, type Placement } from './instancing';
import { createBonfire, createLuminaPlants, createPress, flat } from './models/stations';
import { PALETTE } from './palette';

/** Profondità della cornice di giungla oltre i bordi della valle. */
const FRAME_DEPTH = 9;
const WOOD = 0x9a6b45;
const WOOD_DARK = 0x6b4a2f;
/** Terra battuta chiara dei lotti: il pavimento più luminoso della scena (regola RF6). */
const LOT_FLOOR = 0xf0dfb8;
const LOT_EDGE = 0xd9c08e;

const FRAME_TREES: readonly { id: PropId; weight: number; h: [number, number] }[] = [
  { id: 'tree_fat', weight: 3, h: [4, 5] },
  { id: 'tree_oak', weight: 2, h: [4.5, 5.5] },
  { id: 'tree_palm', weight: 2, h: [5.5, 6.5] },
];

function pickWeighted<T extends { weight: number }>(rng: Rng, list: readonly T[]): T {
  const total = list.reduce((s, it) => s + it.weight, 0);
  let r = rng.next() * total;
  for (const it of list) {
    r -= it.weight;
    if (r <= 0) return it;
  }
  return list[list.length - 1]!;
}

/** Punti in file regolari sfalsate: l'ordine di un plastico (GDD sezione 10). */
function rows(rng: Rng, bounds: Rect, spacing: number): (MapPoint & { jitter: number })[] {
  const out: (MapPoint & { jitter: number })[] = [];
  let r = 0;
  for (let y = bounds.y0; y <= bounds.y1 + 1e-6; y += spacing * 0.87, r++) {
    for (let x = bounds.x0 + (r % 2 ? spacing / 2 : 0); x <= bounds.x1 + 1e-6; x += spacing) {
      out.push({ x: x + (rng.next() - 0.5) * 0.15, y: y + (rng.next() - 0.5) * 0.15, jitter: rng.next() });
    }
  }
  return out;
}

class Placements {
  private readonly map = new Map<string, { id: PropId; shadow: boolean; list: Placement[] }>();
  add(id: PropId, shadow: boolean, at: MapPoint, height: number, rotY: number): void {
    const key = `${id}:${shadow}`;
    const e = this.map.get(key) ?? { id, shadow, list: [] };
    const w = toWorld(at);
    e.list.push({ x: w.x, z: w.z, height, rotY });
    this.map.set(key, e);
  }
  build(assets: Assets, root: THREE.Group, name: string): void {
    for (const shadow of [true, false]) {
      const entries = [...this.map.values()].filter((e) => e.shadow === shadow).map((e) => ({ prop: assets.props[e.id], list: e.list }));
      if (entries.length === 0) continue;
      // Blocchi da 20 m: la valle a lotti è piccola, meno blocchi vuol dire meno disegni (GDD sezione 10).
      const b = createBatches(entries, { castShadow: shadow, chunkSize: 20 });
      b.name = `${name} ${shadow ? 'con ombra' : 'senza ombra'}`;
      root.add(b);
    }
  }
}

function placeAt<T extends THREE.Object3D>(obj: T, at: MapPoint, rotY = 0): T {
  const p = toWorld(at);
  obj.position.set(p.x, 0, p.z);
  obj.rotation.y = rotY;
  return obj;
}

function rbox(w: number, h: number, d: number, color: number, r = 0.05): THREE.Mesh {
  const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 1, Math.min(r, w / 2, h / 2, d / 2)), flat(color));
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

function moved<T extends THREE.Object3D>(o: T, x: number, y: number, z: number): T {
  o.position.set(x, y, z);
  return o;
}

/** Pavimento di un lotto: terra battuta chiara con il bordo più scuro, appena sopra il prato. */
function createLotFloor(lot: Rect): THREE.Group {
  const g = new THREE.Group();
  const w = lot.x1 - lot.x0;
  const h = lot.y1 - lot.y0;
  const edge = new THREE.Mesh(new THREE.PlaneGeometry(w + 0.3, h + 0.3), new THREE.MeshLambertMaterial({ color: LOT_EDGE }));
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshLambertMaterial({ color: LOT_FLOOR }));
  for (const [m, y] of [
    [edge, 0.008],
    [floor, 0.012],
  ] as const) {
    m.rotation.x = -Math.PI / 2;
    m.position.y = y;
    m.receiveShadow = true;
    g.add(m);
  }
  const c = toWorld({ x: (lot.x0 + lot.x1) / 2, y: (lot.y0 + lot.y1) / 2 });
  g.position.set(c.x, 0, c.z);
  return g;
}

/** Terra di un appezzamento, con il contorno e i solchi: compare quando il Campo si compra. */
function createFieldSoil(): THREE.Group {
  const g = new THREE.Group();
  const base = rbox(FIELD_SIZE + 0.2, 0.08, FIELD_SIZE + 0.2, PALETTE.fieldEarthDark, 0.04);
  base.castShadow = false;
  g.add(base);
  const top = rbox(FIELD_SIZE, 0.1, FIELD_SIZE, PALETTE.fieldEarth, 0.05);
  top.castShadow = false;
  top.position.y = 0.02;
  g.add(top);
  for (let i = 0; i < 3; i++) {
    const f = rbox(FIELD_SIZE - 0.5, 0.03, 0.14, PALETTE.fieldEarthDark, 0.02);
    f.castShadow = false;
    f.position.set(0, 0.075, -FIELD_SIZE / 2 + 0.75 + i * 0.75);
    g.add(f);
  }
  return bakeGroup(g);
}

/**
 * Staccionata di legno lungo un lato: pali ogni 1,5 m e due traverse, alta 0,8 m. `gap` lascia
 * un'apertura (l'arco). Un gruppo per lato, così il lato in comune fra due lotti sparisce all'apertura.
 */
function createFence(from: MapPoint, to: MapPoint, gap?: { at: number; width: number }): THREE.Group {
  const g = new THREE.Group();
  const len = Math.hypot(to.x - from.x, to.y - from.y);
  const dir = { x: (to.x - from.x) / len, y: (to.y - from.y) / len };
  const ang = Math.atan2(-dir.y, dir.x);
  const segs: [number, number][] = gap
    ? [
        [0, gap.at - gap.width / 2],
        [gap.at + gap.width / 2, len],
      ]
    : [[0, len]];
  for (const [a, b] of segs) {
    if (b - a < 0.2) continue;
    const n = Math.max(1, Math.round((b - a) / 1.5));
    for (let i = 0; i <= n; i++) {
      const d = a + ((b - a) * i) / n;
      const p = toWorld({ x: from.x + dir.x * d, y: from.y + dir.y * d });
      const post = rbox(0.14, 0.85, 0.14, WOOD_DARK, 0.03);
      post.position.set(p.x, 0.425, p.z);
      g.add(post);
    }
    for (const h of [0.35, 0.65]) {
      const mid = toWorld({ x: from.x + dir.x * ((a + b) / 2), y: from.y + dir.y * ((a + b) / 2) });
      const rail = rbox(b - a, 0.09, 0.07, WOOD, 0.02);
      rail.position.set(mid.x, h, mid.z);
      rail.rotation.y = ang;
      g.add(rail);
    }
  }
  return g;
}

/** Più lati di staccionata in un solo disegno. */
function fenceSides(name: string, sides: THREE.Group[]): THREE.Group {
  const g = new THREE.Group();
  g.name = name;
  g.add(...sides);
  return bakeGroup(g);
}

/**
 * L'arco della Hacienda con l'insegna PATRÓN (GDD sezione 1): la missione si legge nel mondo,
 * come l'arco di Monkey Mart (skill arcade-idle, PS3). L'insegna è dipinta su canvas.
 */
function createArch(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'arco';
  const half = ARCH.width / 2;
  for (const sx of [-1, 1]) {
    g.add(moved(rbox(0.36, 3.6, 0.36, WOOD_DARK, 0.06), sx * half, 1.8, 0));
    g.add(moved(rbox(0.6, 0.3, 0.6, 0x9c958a, 0.05), sx * half, 0.15, 0));
  }
  g.add(moved(rbox(ARCH.width + 0.9, 0.3, 0.42, WOOD, 0.06), 0, 3.55, 0));
  // Insegna: tavola di legno con le lettere oro e l'accento di Lumina sulla Ó.
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#7a4f2e';
  ctx.fillRect(0, 0, 512, 160);
  ctx.fillStyle = '#8f5f38';
  for (let i = 0; i < 4; i++) ctx.fillRect(0, i * 40 + 2, 512, 34);
  ctx.font = '800 108px "Baloo 2", "Trebuchet MS", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.lineJoin = 'round';
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#1b1b2f';
  ctx.strokeText('PATRÓN', 256, 88);
  const grad = ctx.createLinearGradient(0, 40, 0, 130);
  grad.addColorStop(0, '#ffe08a');
  grad.addColorStop(1, '#c8902e');
  ctx.fillStyle = grad;
  ctx.fillText('PATRÓN', 256, 88);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const board = new THREE.Mesh(new THREE.BoxGeometry(ARCH.width + 0.4, 1.1, 0.16), [
    flat(WOOD_DARK),
    flat(WOOD_DARK),
    flat(WOOD_DARK),
    flat(WOOD_DARK),
    new THREE.MeshLambertMaterial({ map: tex }),
    new THREE.MeshLambertMaterial({ map: tex }),
  ]);
  board.name = 'insegna';
  board.position.set(0, 4.25, 0);
  board.castShadow = true;
  g.add(board);
  // Due lanterne: le poche cose che brillano, insieme alla Lumina.
  for (const sx of [-1, 1]) {
    const lamp = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 0), flat(0xffd27a, 0xffb347, 2.2));
    lamp.castShadow = false;
    lamp.position.set(sx * (half + 0.05), 3.15, 0.25);
    g.add(lamp);
  }
  return g;
}

/** Casetta dei Raccoglitori (decorativa) per il lotto 2. */
function createHut(): THREE.Group {
  const g = new THREE.Group();
  g.add(moved(rbox(2.2, 1.6, 1.8, PALETTE.villageWall, 0.05), 0, 0.8, 0));
  const roof = rbox(2.6, 0.2, 2.2, PALETTE.roofTile, 0.06);
  roof.position.set(0, 1.75, 0);
  g.add(roof);
  g.add(moved(rbox(0.6, 1.1, 0.08, 0x5a3a24, 0.02), 0, 0.55, 0.92));
  return bakeGroup(g);
}

export interface LotView {
  readonly floor: THREE.Group;
}

/**
 * Staccionate in tre disegni: il giro del lotto 1 senza il lato est, il lato in comune (sparisce
 * quando si apre il lotto 2) e il giro esterno del lotto 2.
 */
export interface Fences {
  readonly lot1: THREE.Group;
  readonly shared: THREE.Group;
  readonly lot2: THREE.Group;
}

export interface Valley {
  readonly root: THREE.Group;
  /** Oggetti che diventano trasparenti quando coprono il giocatore. */
  readonly occluders: readonly THREE.Object3D[];
  readonly lots: Readonly<Record<LotId, LotView>>;
  readonly fences: Fences;
  readonly arch: THREE.Group;
  /** Stazioni: nascoste finché non si comprano. */
  readonly presses: Readonly<Record<string, THREE.Group>>;
  readonly plants: Readonly<Record<string, THREE.Group>>;
  readonly soils: Readonly<Record<string, THREE.Group>>;
  readonly truck: THREE.Object3D;
  readonly bonfire: THREE.Group;
  readonly hut: THREE.Group;
}

export function createValley(assets: Assets): Valley {
  const root = new THREE.Group();
  root.name = 'valley';
  const rng = createRng(1981);
  const occluders: THREE.Object3D[] = [];
  const P = new Placements();

  root.add(createGround());

  // Lotti: pavimento e staccionata. Il lotto 2 resta prato finché non si apre.
  const lots = {} as Record<LotId, LotView>;
  for (const id of Object.keys(LOTS) as LotId[]) {
    const floor = createLotFloor(LOTS[id]);
    floor.name = `pavimento:${id}`;
    floor.visible = id === 'lot1';
    root.add(floor);
    lots[id] = { floor };
  }
  const a = LOTS.lot1;
  const b = LOTS.lot2;
  const fences: Fences = {
    lot1: fenceSides('staccionata:lot1', [
      createFence({ x: a.x0, y: a.y1 }, { x: a.x1, y: a.y1 }, { at: ARCH.x - a.x0, width: ARCH.width }),
      createFence({ x: a.x0, y: a.y0 }, { x: a.x1, y: a.y0 }),
      createFence({ x: a.x0, y: a.y0 }, { x: a.x0, y: a.y1 }),
    ]),
    shared: fenceSides('staccionata:comune', [createFence({ x: a.x1, y: a.y0 }, { x: a.x1, y: a.y1 })]),
    lot2: fenceSides('staccionata:lot2', [
      createFence({ x: b.x0, y: b.y1 }, { x: b.x1, y: b.y1 }),
      createFence({ x: b.x0, y: b.y0 }, { x: b.x1, y: b.y0 }),
      createFence({ x: b.x1, y: b.y0 }, { x: b.x1, y: b.y1 }),
    ]),
  };
  fences.lot2.visible = false;
  root.add(fences.lot1, fences.shared, fences.lot2);

  // L'arco della Hacienda, sul lato nord, verso la strada.
  const arch = placeAt(bakeGroup(createArch()), ARCH);
  root.add(arch);

  // Stazioni: tutte nascoste, compaiono allo sblocco.
  const presses: Record<string, THREE.Group> = {};
  for (const l of PRESSES) {
    const press = placeAt(bakeGroup(createPress()), l, Math.PI / 2);
    press.name = l.id;
    press.visible = false;
    presses[l.id] = press;
    root.add(press);
    occluders.push(press);
  }
  const plants: Record<string, THREE.Group> = {};
  const soils: Record<string, THREE.Group> = {};
  for (const f of FIELD_PLOTS) {
    const pos: { x: number; z: number; h: number; r: number }[] = [];
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) pos.push({ x: -0.9 + i * 0.9, z: -0.9 + j * 0.9, h: 0.8 + ((i + j) % 3) * 0.1, r: (i * 3 + j) * 1.3 });
    }
    const g = placeAt(createLuminaPlants(pos), f);
    g.name = `piante:${f.id}`;
    g.visible = false;
    plants[f.id] = g;
    const soil = placeAt(createFieldSoil(), f);
    soil.name = `terra:${f.id}`;
    soil.visible = false;
    soils[f.id] = soil;
    root.add(soil, g);
  }
  const bonfire = placeAt(bakeGroup(createBonfire()), BONFIRE);
  bonfire.visible = false;
  // Camion di El Gordo: lungo la strada, muso verso est. Arriva con la prima Pressa.
  const truck = placeAt(createSingle(assets.props.truck_flat, 2.6), TRUCK, Math.PI / 2);
  truck.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mat = (mesh.material as THREE.MeshLambertMaterial).clone();
    mat.color.setHex(0xffd27a);
    mesh.material = mat;
  });
  truck.visible = false;
  const hut = placeAt(createHut(), PICKER_HUT, Math.PI);
  hut.visible = false;
  root.add(bonfire, truck, hut);

  // Fuori dai lotti: qualche cespuglio tondo lungo la staccionata, alberi verso i bordi della valle.
  const allLots = Object.values(LOTS);
  const nearLot = (p: MapPoint, m: number): boolean => allLots.some((r) => inRect(p, r, -m));
  const onRoad = (p: MapPoint): boolean => Math.abs(p.y - 18) < 2.6;
  for (const s of rows(rng, { x0: 2, y0: 1, x1: VALLEY.width - 2, y1: 34 }, 3.2)) {
    if (nearLot(s, 2.2) || onRoad(s)) continue;
    // Più lontano dai lotti, alberi; vicino, cespugli bassi: niente di alto tra la camera e il lotto.
    const far = !nearLot(s, 6);
    const south = s.y < LOTS.lot1.y0 || s.x < LOTS.lot1.x0;
    if (far && !south) {
      const t = pickWeighted(rng, FRAME_TREES);
      P.add(t.id, true, s, t.h[0] + s.jitter * (t.h[1] - t.h[0]), s.jitter * 6.3);
    } else if (s.jitter < 0.55) {
      P.add('bush_round', true, s, 0.9 + s.jitter * 0.4, s.jitter * 6.3);
    }
  }
  // Giungla fitta oltre la strada, verso nord (radura e paese delle Fasi 2 e 3).
  for (const s of rows(rng, { x0: 0, y0: 21.5, x1: VALLEY.width, y1: VALLEY.depth - 1 }, 3)) {
    const t = pickWeighted(rng, FRAME_TREES);
    P.add(t.id, s.y < 24, s, t.h[0] + s.jitter * (t.h[1] - t.h[0]), s.jitter * 6.3);
  }
  // Cornice oltre i bordi della valle; a sud e a ovest solo cespugli, per non coprire la vista.
  for (const s of rows(rng, { x0: -FRAME_DEPTH, y0: -FRAME_DEPTH, x1: VALLEY.width + FRAME_DEPTH, y1: VALLEY.depth + FRAME_DEPTH }, 3)) {
    const outside = s.x < -0.9 || s.y < -0.9 || s.x > VALLEY.width + 0.9 || s.y > VALLEY.depth + 0.9;
    if (!outside) continue;
    if (s.y < 0 || s.x < 0) {
      if (s.y > -3 && s.x > -3) P.add('bush_round', true, s, 1.1, s.jitter * 6.3);
      continue;
    }
    const t = pickWeighted(rng, FRAME_TREES);
    // Oltre il bordo della valle gli alberi non fanno ombra: la mappa d'ombra segue il giocatore.
    P.add(t.id, false, s, t.h[0] + s.jitter * (t.h[1] - t.h[0]), s.jitter * 6.3);
  }
  P.build(assets, root, 'vegetazione');

  return { root, occluders, lots, fences, arch, presses, plants, soils, truck, bonfire, hut };
}
