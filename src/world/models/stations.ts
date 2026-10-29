// Modelli costruiti da codice nello stile dei pacchetti (GDD sezione 10): forme semplici smussate,
// colori pieni, nessuna texture fotografica. Misure dalla tabella delle proporzioni.

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { PALETTE } from '../palette';

const WOOD = 0x9a6b45;
const WOOD_DARK = 0x6b4a2f;
const STEEL = 0x8a8f98;
const STEEL_DARK = 0x5c6168;

const matCache = new Map<string, THREE.MeshLambertMaterial>();
/** Materiali condivisi per colore: meno cambi di stato per la scheda video. */
export function flat(color: number, emissive = 0, emissiveIntensity = 1): THREE.MeshLambertMaterial {
  const key = `${color}:${emissive}:${emissiveIntensity}`;
  let m = matCache.get(key);
  if (!m) {
    m = new THREE.MeshLambertMaterial({ color, flatShading: true, emissive, emissiveIntensity });
    matCache.set(key, m);
  }
  return m;
}

function rbox(w: number, h: number, d: number, color: number, radius = 0.06): THREE.Mesh {
  const mesh = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 1, Math.min(radius, w / 2, h / 2, d / 2)), flat(color));
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function at<T extends THREE.Object3D>(o: T, x: number, y: number, z: number): T {
  o.position.set(x, y, z);
  return o;
}

/**
 * Capanna 5 × 4 m, gronda a 2,4 m, colmo a 3,6 m (GDD sezione 10).
 * Porta e finestra sul lato nord, verso i campi; locale +z = sud.
 */
export function createHut(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'hut';
  const W = 5;
  const D = 4;
  const EAVE = 2.4;
  const RIDGE = 3.6;

  // Zoccolo di pietra e muri intonacati.
  g.add(at(rbox(W + 0.2, 0.3, D + 0.2, 0x9c958a, 0.05), 0, 0.15, 0));
  g.add(at(rbox(W, EAVE - 0.3, D, PALETTE.villageWall, 0.05), 0, 0.3 + (EAVE - 0.3) / 2, 0));
  // Pali d'angolo in legno scuro.
  for (const [x, z] of [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ] as const) {
    g.add(at(rbox(0.22, EAVE, 0.22, WOOD_DARK, 0.04), (x * W) / 2, EAVE / 2, (z * D) / 2));
  }
  // Timpani: triangoli pieni sui lati est e ovest.
  const gable = new THREE.Shape();
  gable.moveTo(-D / 2, 0);
  gable.lineTo(D / 2, 0);
  gable.lineTo(0, RIDGE - EAVE);
  gable.closePath();
  const gableGeo = new THREE.ExtrudeGeometry(gable, { depth: 0.12, bevelEnabled: false });
  for (const side of [-1, 1]) {
    const m = new THREE.Mesh(gableGeo, flat(PALETTE.villageWall));
    m.rotation.y = Math.PI / 2;
    m.position.set(side * (W / 2) - (side > 0 ? 0.12 : 0), EAVE, 0);
    m.castShadow = true;
    g.add(m);
  }

  // Tetto a due falde con file di tegole (bande più scure) e colmo.
  const over = 0.45;
  const run = D / 2 + over;
  const rise = (RIDGE - EAVE) * (run / (D / 2));
  const slope = Math.hypot(run, rise);
  const angle = Math.atan2(rise, run);
  for (const side of [-1, 1]) {
    const roof = new THREE.Group();
    const slab = rbox(W + over * 2, 0.16, slope, PALETTE.roofTile, 0.05);
    roof.add(slab);
    // File di coppi: bande alternate più chiare e più scure, con un leggero rilievo.
    const rows = 7;
    for (let i = 0; i < rows; i++) {
      const band = rbox(W + over * 2 - 0.1, 0.09, slope / rows - 0.06, i % 2 ? 0xb04a33 : 0xd2603f, 0.03);
      band.castShadow = false;
      band.position.set(0, 0.11, -slope / 2 + ((i + 0.5) / rows) * slope);
      roof.add(band);
    }
    // Tavola di gronda in legno: dà spessore al bordo del tetto.
    const fascia = rbox(W + over * 2 + 0.06, 0.22, 0.1, WOOD_DARK, 0.03);
    fascia.position.set(0, -0.02, slope / 2);
    roof.add(fascia);
    roof.rotation.x = side * angle;
    // La falda parte dal colmo e scende verso il lato `side` (z positivo = sud).
    roof.position.set(0, RIDGE - rise / 2 + 0.08, (side * run) / 2);
    g.add(roof);
  }
  g.add(at(rbox(W + over * 2 + 0.1, 0.18, 0.3, 0x8f3826, 0.06), 0, RIDGE + 0.08, 0));

  // Porta e finestra a nord (−z locale), con architrave.
  const north = -D / 2 - 0.02;
  g.add(at(rbox(1.0, 2.0, 0.1, 0x5a3a24, 0.03), -0.9, 1.0 + 0.3 - 0.3, north));
  g.add(at(rbox(1.25, 0.14, 0.16, WOOD_DARK, 0.03), -0.9, 2.05, north - 0.02));
  g.add(at(rbox(0.9, 0.7, 0.08, 0x2f3b45, 0.02), 1.2, 1.45, north));
  for (const sx of [-1, 1]) g.add(at(rbox(0.42, 0.78, 0.08, 0x4f9a4a, 0.02), 1.2 + sx * 0.68, 1.45, north - 0.03));
  // Lanterna accanto alla porta: una delle poche cose che brillano.
  const lamp = new THREE.Mesh(new THREE.OctahedronGeometry(0.13, 0), flat(0xffd27a, 0xffb347, 2.2));
  g.add(at(lamp, -0.15, 2.0, north - 0.18));
  g.add(at(rbox(0.05, 0.25, 0.25, WOOD_DARK, 0.02), -0.15, 2.18, north - 0.08));

  // Camino in pietra.
  g.add(at(rbox(0.5, 1.2, 0.5, 0x8a837a, 0.05), 1.6, RIDGE - 0.1, 0.6));

  // Panca e cassette davanti alla porta.
  g.add(at(rbox(1.4, 0.12, 0.4, WOOD, 0.03), 1.0, 0.48, north - 0.32));
  for (const sx of [-0.55, 0.55]) g.add(at(rbox(0.1, 0.42, 0.34, WOOD_DARK, 0.02), 1.0 + sx, 0.21, north - 0.32));
  g.add(at(rbox(0.6, 0.45, 0.5, WOOD, 0.04), -2.15, 0.23, north - 0.32));
  g.add(at(rbox(0.5, 0.38, 0.42, 0xb08050, 0.04), -2.1, 0.64, north - 0.32));
  return g;
}

/**
 * Pressa 2,4 × 2,4 m, alta 1,8 m (GDD sezione 10), nei colori di marca: basamento giallo, telaio
 * azzurro. Sopra, come insegna, una Pasta gigante: la stazione si legge dal suo prodotto, come il
 * forno con la pizza in vetrina di Pizza Ready. A ovest (−x) il cassone degli Scarti; a nord (−z)
 * il ripiano dove si impila la Pasta prodotta; a sud la tramoggia delle Foglie.
 */
export function createPress(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'press';
  // Basamento giallo con zoccolo scuro.
  g.add(at(rbox(1.8, 0.2, 2.3, PALETTE.brandYellowDark, 0.06), 0.25, 0.1, 0));
  g.add(at(rbox(1.7, 0.5, 2.1, PALETTE.brandYellow, 0.1), 0.25, 0.45, 0));
  // Tramoggia delle Foglie verso sud (+z).
  g.add(at(rbox(1.2, 0.12, 0.55, PALETTE.brandBlueDark, 0.04), 0.25, 0.76, 0.75));
  // Vasca sotto il pistone.
  g.add(at(rbox(1.1, 0.12, 1.0, WOOD_DARK, 0.04), 0.25, 0.76, -0.05));
  g.add(at(rbox(0.9, 0.04, 0.8, 0x3f5a2c, 0.02), 0.25, 0.83, -0.05));
  // Telaio azzurro.
  for (const sx of [-1, 1]) g.add(at(rbox(0.22, 1.2, 0.32, PALETTE.brandBlue, 0.06), 0.25 + sx * 0.72, 1.3, -0.05));
  g.add(at(rbox(1.75, 0.26, 0.42, PALETTE.brandBlueDark, 0.08), 0.25, 1.92, -0.05));
  const screw = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.6, 8), flat(STEEL));
  screw.castShadow = true;
  screw.name = 'pressScrew';
  g.add(at(screw, 0.25, 1.45, -0.05));
  const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.12, 12), flat(STEEL_DARK));
  plate.castShadow = true;
  plate.name = 'pressPlate';
  g.add(at(plate, 0.25, 1.1, -0.05));
  // Ripiano della Pasta a nord.
  g.add(at(rbox(1.3, 0.1, 0.5, WOOD, 0.03), 0.25, 0.72, -1.0));
  // Cassone degli Scarti a ovest: cassa di legno aperta.
  g.add(at(rbox(0.7, 0.08, 1.2, WOOD_DARK, 0.03), -0.85, 0.04, 0));
  for (const sz of [-1, 1]) g.add(at(rbox(0.7, 0.5, 0.08, WOOD, 0.02), -0.85, 0.3, sz * 0.56));
  g.add(at(rbox(0.08, 0.5, 1.2, WOOD, 0.02), -1.18, 0.3, 0));
  // Insegna: palo e Pasta gigante con la fascia azzurra.
  g.add(at(rbox(0.12, 1.0, 0.12, WOOD_DARK, 0.03), 0.25, 2.5, -0.05));
  const sign = new THREE.Group();
  sign.name = 'pressSign';
  sign.add(rbox(1.0, 0.4, 0.8, 0xe8d3a6, 0.1));
  sign.add(rbox(0.26, 0.41, 0.81, PALETTE.brandBlue, 0.05));
  sign.position.set(0.25, 3.2, -0.05);
  sign.rotation.y = Math.PI / 4;
  g.add(sign);
  return g;
}

/**
 * Falò per gli Scarti (GDD sezione 4): anello di pietre, legna e fiamme. Le fiamme sono emissive e
 * passano nel bloom; il gruppo 'flames' si anima a ogni sacco bruciato.
 */
export function createBonfire(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'bonfire';
  const stones = 9;
  for (let i = 0; i < stones; i++) {
    const a = (i / stones) * Math.PI * 2;
    const s = new THREE.Mesh(new THREE.DodecahedronGeometry(0.2, 0), flat(i % 2 ? 0xa9a397 : 0xc4bfb4));
    s.scale.set(1, 0.7, 1);
    s.castShadow = true;
    g.add(at(s, Math.cos(a) * 0.62, 0.12, Math.sin(a) * 0.62));
  }
  for (const r of [0.4, -0.5, 1.6]) {
    const log = rbox(0.9, 0.14, 0.14, WOOD_DARK, 0.05);
    log.rotation.y = r;
    g.add(at(log, 0, 0.12, 0));
  }
  const flames = new THREE.Group();
  flames.name = 'flames';
  for (const [x, z, h, c] of [
    [0, 0, 0.9, 0xff7a2e],
    [0.15, 0.1, 0.6, 0xffb347],
    [-0.14, -0.08, 0.65, 0xffb347],
    [0.02, -0.02, 0.45, 0xffe07a],
  ] as const) {
    const f = new THREE.Mesh(new THREE.ConeGeometry(0.2, h, 5), flat(c, c, 1.6));
    // Con un nome restano separate quando il Falò si fonde in una mesh: si animano.
    f.name = 'flame';
    f.position.set(x, 0.2 + h / 2, z);
    flames.add(f);
  }
  g.add(flames);
  return g;
}

/** Scrivania dell'Ufficio con sedia e registro. */
export function createDesk(): THREE.Group {
  const g = new THREE.Group();
  g.name = 'desk';
  g.add(at(rbox(2.0, 0.1, 1.0, WOOD, 0.03), 0, 0.82, 0));
  for (const [x, z] of [
    [-0.9, -0.4],
    [0.9, -0.4],
    [-0.9, 0.4],
    [0.9, 0.4],
  ] as const) {
    g.add(at(rbox(0.09, 0.78, 0.09, WOOD_DARK, 0.02), x, 0.39, z));
  }
  g.add(at(rbox(0.5, 0.06, 0.36, 0xe8d9c0, 0.01), -0.3, 0.9, 0));
  g.add(at(rbox(0.3, 0.12, 0.22, PALETTE.money, 0.02), 0.55, 0.93, 0.1));
  // Sedia a sud della scrivania.
  g.add(at(rbox(0.5, 0.08, 0.5, WOOD, 0.02), 0, 0.48, 0.85));
  g.add(at(rbox(0.5, 0.55, 0.08, WOOD, 0.02), 0, 0.78, 1.08));
  for (const [x, z] of [
    [-0.2, 0.65],
    [0.2, 0.65],
    [-0.2, 1.05],
    [0.2, 1.05],
  ] as const) {
    g.add(at(rbox(0.06, 0.45, 0.06, WOOD_DARK, 0.01), x, 0.22, z));
  }
  return g;
}

/**
 * Piante di Lumina (GDD sezione 10): gruppi di coni e piani, foglie pronte con il bordo azzurro.
 * Una geometria per le foglie e una per i bordi luminosi, disegnate `positions.length` volte.
 */
export function createLuminaPlants(positions: readonly { x: number; z: number; h: number; r: number }[]): THREE.Group {
  const g = new THREE.Group();
  g.name = 'lumina';
  const leaves: THREE.BufferGeometry[] = [];
  const tips: THREE.BufferGeometry[] = [];
  const n = 6;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const tilt = 0.55 + (i % 2) * 0.25;
    const leaf = new THREE.ConeGeometry(0.2, 0.8, 4, 1);
    leaf.scale(1, 1, 0.3);
    leaf.translate(0, 0.42, 0);
    leaf.rotateX(tilt);
    leaf.rotateY(a);
    leaves.push(leaf);
    const tip = new THREE.ConeGeometry(0.08, 0.22, 4, 1);
    tip.scale(1, 1, 0.4);
    tip.translate(0, 0.74, 0);
    tip.rotateX(tilt);
    tip.rotateY(a);
    tips.push(tip);
  }
  const stem = new THREE.ConeGeometry(0.06, 0.9, 5, 1);
  stem.translate(0, 0.45, 0);
  leaves.push(stem);

  const merge = (list: THREE.BufferGeometry[]): THREE.BufferGeometry => {
    const parts = list.map((x) => x.toNonIndexed());
    const total = parts.reduce((s, p) => s + p.getAttribute('position').count, 0);
    const pos = new Float32Array(total * 3);
    let off = 0;
    for (const p of parts) {
      pos.set(p.getAttribute('position').array as Float32Array, off);
      off += p.getAttribute('position').count * 3;
    }
    const out = new THREE.BufferGeometry();
    out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    out.computeVertexNormals();
    return out;
  };

  const leafMesh = new THREE.InstancedMesh(merge(leaves), flat(0x5fcf5a), positions.length);
  const tipMesh = new THREE.InstancedMesh(merge(tips), flat(PALETTE.lumina, PALETTE.lumina, 1.0), positions.length);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  positions.forEach((p, i) => {
    q.setFromAxisAngle(up, p.r);
    m.compose(new THREE.Vector3(p.x, 0, p.z), q, new THREE.Vector3(p.h, p.h, p.h));
    leafMesh.setMatrixAt(i, m);
    tipMesh.setMatrixAt(i, m);
  });
  for (const mesh of [leafMesh, tipMesh]) {
    mesh.castShadow = mesh === leafMesh;
    mesh.receiveShadow = true;
    mesh.computeBoundingSphere();
    g.add(mesh);
  }
  return g;
}
