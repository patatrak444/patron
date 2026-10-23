// La valle: terreno, sentieri, campi, segnaposto delle stazioni e giungla (GDD sezioni 4 e 10).

import * as THREE from 'three';
import {
  FIELD_PLOTS,
  FIELD_SIZE,
  LOCKED_AREAS,
  PATHS,
  ROAD,
  VALLEY,
  VALLEY_CENTER,
  toWorld,
  type MapPoint,
  type PathStrip,
} from '../config/map';
import { createRng, type Rng } from '../core/rng';
import { PALETTE } from './palette';

const lambert = (color: number): THREE.MeshLambertMaterial => new THREE.MeshLambertMaterial({ color, flatShading: true });

function flatPlane(w: number, d: number, color: number, at: MapPoint, y: number): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, d), lambert(color));
  mesh.rotation.x = -Math.PI / 2;
  const p = toWorld(at);
  mesh.position.set(p.x, y, p.z);
  mesh.receiveShadow = true;
  return mesh;
}

function strip(s: PathStrip, color: number, y: number): THREE.Mesh {
  const dx = s.to.x - s.from.x;
  const dy = s.to.y - s.from.y;
  const len = Math.hypot(dx, dy) + s.width;
  const mesh = flatPlane(s.width, len, color, { x: (s.from.x + s.to.x) / 2, y: (s.from.y + s.to.y) / 2 }, y);
  // Il piano nasce lungo il nord; lo si ruota sulla direzione del sentiero.
  mesh.rotation.z = -Math.atan2(dx, dy);
  return mesh;
}

function box(w: number, h: number, d: number, color: number): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), lambert(color));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function placeAt(obj: THREE.Object3D, at: MapPoint, y = 0): THREE.Object3D {
  const p = toWorld(at);
  obj.position.set(p.x, y, p.z);
  return obj;
}

/** Capanna: muri chiari, tetto di tegole a quattro falde, porta verso nord. */
function hut(): THREE.Group {
  const g = new THREE.Group();
  const walls = box(4.4, 1.8, 3, PALETTE.villageWall);
  walls.position.y = 0.9;
  const roof = new THREE.Mesh(new THREE.ConeGeometry(3.3, 1.2, 4), lambert(PALETTE.roofTile));
  roof.rotation.y = Math.PI / 4;
  roof.scale.set(1, 1, 0.72);
  roof.position.y = 2.4;
  roof.castShadow = true;
  const door = box(0.9, 1.4, 0.05, 0x5a3a24);
  door.position.set(0, 0.7, -1.52);
  g.add(walls, roof, door);
  return g;
}

/** Segnaposto della Pressa: basamento di legno e pistone. */
function pressPlaceholder(): THREE.Group {
  const g = new THREE.Group();
  const base = box(2.4, 1, 2.4, 0x9a6b45);
  base.position.y = 0.5;
  const piston = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 1.2, 8), lambert(0x8a8f98));
  piston.position.y = 1.6;
  piston.castShadow = true;
  g.add(base, piston);
  return g;
}

/** Segnaposto del camion di El Gordo, muso verso nord. */
function truckPlaceholder(): THREE.Group {
  const g = new THREE.Group();
  const cab = box(2.2, 1.7, 1.6, PALETTE.villageWall);
  cab.position.set(0, 1.25, -1.9);
  const bed = box(2.4, 1.1, 3.6, PALETTE.fieldEarth);
  bed.position.set(0, 0.95, 0.8);
  g.add(cab, bed);
  const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 10);
  const wheelMat = lambert(0x2a2a2a);
  for (const [x, z] of [
    [-1.15, -1.9],
    [1.15, -1.9],
    [-1.15, 1.6],
    [1.15, 1.6],
  ] as const) {
    const w = new THREE.Mesh(wheelGeo, wheelMat);
    w.rotation.z = Math.PI / 2;
    w.position.set(x, 0.4, z);
    g.add(w);
  }
  return g;
}

/** Ufficio: scrivania sotto un albero. */
function officePlaceholder(): THREE.Group {
  const g = new THREE.Group();
  const desk = box(2, 0.9, 1, 0x7a4e30);
  desk.position.y = 0.45;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.45, 3, 7), lambert(0x6b4a2f));
  trunk.position.set(2, 1.5, -1.6);
  trunk.castShadow = true;
  const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(2.4, 0), lambert(PALETTE.jungleLight));
  crown.position.set(2, 4, -1.6);
  crown.castShadow = true;
  g.add(desk, trunk, crown);
  return g;
}

interface Tree {
  x: number;
  y: number;
  scale: number;
  shade: number;
}

/** Punti sparsi su una griglia con scarto casuale, dentro `inside` e fuori da `exclude`. */
function scatter(
  rng: Rng,
  bounds: { x0: number; y0: number; x1: number; y1: number },
  spacing: number,
  keep: (x: number, y: number) => boolean,
  scale: [number, number],
): Tree[] {
  const out: Tree[] = [];
  for (let y = bounds.y0; y <= bounds.y1; y += spacing) {
    for (let x = bounds.x0; x <= bounds.x1; x += spacing) {
      const px = x + (rng.next() - 0.5) * spacing * 0.9;
      const py = y + (rng.next() - 0.5) * spacing * 0.9;
      if (!keep(px, py)) continue;
      out.push({ x: px, y: py, scale: scale[0] + rng.next() * (scale[1] - scale[0]), shade: rng.int(0, 2) });
    }
  }
  return out;
}

const SHADES = [PALETTE.jungleDark, PALETTE.jungleMid, PALETTE.jungleLight].map((c) => new THREE.Color(c));

/** Alberi a icosaedro su tronco, disegnati con una sola geometria per tipo (GDD sezione 10). */
function treeInstances(trees: Tree[], castShadow: boolean): THREE.Group {
  const g = new THREE.Group();
  const trunks = new THREE.InstancedMesh(
    new THREE.CylinderGeometry(0.15, 0.22, 1.4, 5, 1, true),
    lambert(0x6b4a2f),
    trees.length,
  );
  const crowns = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 0), lambert(0xffffff), trees.length);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const s = new THREE.Vector3();
  const pos = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);
  trees.forEach((t, i) => {
    const w = toWorld(t);
    s.setScalar(t.scale);
    pos.set(w.x, 0.7 * t.scale, w.z);
    trunks.setMatrixAt(i, m.compose(pos, q.identity(), s));
    q.setFromAxisAngle(up, t.x * 1.7 + t.y);
    s.set(1.3 * t.scale, 1.15 * t.scale, 1.3 * t.scale);
    pos.set(w.x, 1.9 * t.scale, w.z);
    crowns.setMatrixAt(i, m.compose(pos, q, s));
    crowns.setColorAt(i, SHADES[t.shade]!);
  });
  for (const mesh of [trunks, crowns]) {
    mesh.castShadow = castShadow;
    mesh.receiveShadow = true;
  }
  g.add(trunks, crowns);
  return g;
}

/** Cespugli bassi per gli appezzamenti e le stazioni ancora chiuse. */
function bushInstances(bushes: Tree[]): THREE.InstancedMesh {
  const mesh = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(1, 0), lambert(0xffffff), bushes.length);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const s = new THREE.Vector3();
  const pos = new THREE.Vector3();
  bushes.forEach((b, i) => {
    const w = toWorld(b);
    s.set(b.scale, b.scale * 0.8, b.scale);
    pos.set(w.x, b.scale * 0.5, w.z);
    mesh.setMatrixAt(i, m.compose(pos, q.identity(), s));
    mesh.setColorAt(i, SHADES[b.shade === 0 ? 0 : 1]!);
  });
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/** Larghezza della fascia di giungla decorativa oltre i bordi: la camera non vede mai il vuoto. */
const OUTER_JUNGLE = 30;
/**
 * A sud la camera guarda verso nord: alberi alti lì coprirebbero il personaggio vicino al bordo.
 * In questa fascia ci sono solo cespugli; gli alberi cominciano più in là, fuori inquadratura.
 */
const SOUTH_BUSH_BAND = 9;
/** Solo gli alberi entro questa distanza dalla valle fanno ombra: gli altri sono troppo lontani per vederla. */
const SHADOW_DISTANCE = 8;

export function createValley(): THREE.Group {
  const root = new THREE.Group();
  const rng = createRng(1981);

  // Terreno oltre i bordi e valle.
  root.add(flatPlane(VALLEY.width + 260, VALLEY.depth + 260, PALETTE.jungleDark, VALLEY_CENTER, -0.03));
  root.add(flatPlane(VALLEY.width, VALLEY.depth, PALETTE.jungleMid, VALLEY_CENTER, 0));

  root.add(strip(ROAD, PALETTE.path, 0.01));
  for (const p of PATHS) root.add(strip(p, PALETTE.path, 0.012));

  for (const f of FIELD_PLOTS) root.add(flatPlane(FIELD_SIZE, FIELD_SIZE, PALETTE.fieldEarth, f, 0.015));

  root.add(placeAt(hut(), { x: 20, y: 0.6 }));
  root.add(placeAt(pressPlaceholder(), { x: 14, y: 26 }));
  root.add(placeAt(truckPlaceholder(), { x: 3, y: 26 }));
  root.add(placeAt(officePlaceholder(), { x: 28, y: 26.4 }));

  const outside = (x: number, y: number): boolean =>
    x < -0.6 || y < -0.6 || x > VALLEY.width + 0.6 || y > VALLEY.depth + 0.6;
  const distanceFromValley = (x: number, y: number): number =>
    Math.max(-x, x - VALLEY.width, -y, y - VALLEY.depth, 0);
  const inSouthBand = (y: number): boolean => y < 0 && y > -SOUTH_BUSH_BAND;

  // Giungla decorativa attorno alla valle.
  const outer = scatter(
    rng,
    { x0: -OUTER_JUNGLE, y0: -OUTER_JUNGLE, x1: VALLEY.width + OUTER_JUNGLE, y1: VALLEY.depth + OUTER_JUNGLE },
    3,
    (x, y) => outside(x, y) && !inSouthBand(y),
    [0.9, 1.7],
  );
  const nearTrees = outer.filter((t) => distanceFromValley(t.x, t.y) <= SHADOW_DISTANCE);
  const farTrees = outer.filter((t) => distanceFromValley(t.x, t.y) > SHADOW_DISTANCE);
  const southBushes = scatter(
    rng,
    { x0: -OUTER_JUNGLE, y0: -SOUTH_BUSH_BAND, x1: VALLEY.width + OUTER_JUNGLE, y1: -0.4 },
    1.7,
    (x, y) => inSouthBand(y) && !(Math.abs(x - 20) < 3 && y > -1.5),
    [0.5, 0.9],
  );

  // Muri di vegetazione sulle aree chiuse.
  const lockedTrees: Tree[] = [];
  const bushes: Tree[] = [];
  for (const area of LOCKED_AREAS) {
    if (area.shape.kind !== 'rect') continue;
    const { x, y, w, h } = area.shape;
    const bounds = { x0: x - w / 2 + 0.6, y0: y - h / 2 + 0.6, x1: x + w / 2 - 0.4, y1: y + h / 2 - 0.4 };
    if (area.cover === 'jungle') {
      lockedTrees.push(...scatter(rng, bounds, 2.3, () => true, [1.0, 1.8]));
    } else {
      bushes.push(...scatter(rng, bounds, 0.95, () => true, [0.45, 0.75]));
    }
  }

  root.add(treeInstances([...nearTrees, ...lockedTrees], true));
  root.add(treeInstances(farTrees, false));
  root.add(bushInstances([...bushes, ...southBushes]));
  return root;
}
