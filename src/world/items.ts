// Merci e mazzette nel mondo (GDD sezioni 4 e 10): più grandi del vero, larghe quanto la testa del
// personaggio, così una pila si legge come una torre. Ogni tipo è una sola InstancedMesh: la pila del
// giocatore, quelle dei lavoratori, le uscite delle stazioni, il cassone del camion e i mucchi di
// soldi costano un disegno per tipo, qualunque sia il numero di pezzi.

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { PALETTE } from './palette';

export type VisualItem = 'leaf' | 'paste' | 'scrap' | 'money';

/** Altezza di un pezzo nella pila, in metri. */
export const ITEM_HEIGHT: Readonly<Record<VisualItem, number>> = {
  leaf: 0.17,
  paste: 0.17,
  scrap: 0.22,
  money: 0.12,
};

/** Colore pieno su tutti i vertici: le parti di un oggetto hanno colori diversi in un'unica geometria. */
function painted(geo: THREE.BufferGeometry, color: number): THREE.BufferGeometry {
  const g = geo.index ? geo.toNonIndexed() : geo;
  g.deleteAttribute('uv');
  const c = new THREE.Color(color);
  const n = g.getAttribute('position').count;
  const arr = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) arr.set([c.r, c.g, c.b], i * 3);
  g.setAttribute('color', new THREE.BufferAttribute(arr, 3));
  return g;
}

function leafGeometry(): THREE.BufferGeometry {
  // Mazzo di foglie verde brillante con le punte azzurre della Lumina, legato da uno spago.
  const parts: THREE.BufferGeometry[] = [];
  for (const [dx, rot] of [
    [-0.09, 0.25],
    [0, 0],
    [0.09, -0.25],
  ] as const) {
    const leaf = new THREE.ConeGeometry(0.1, 0.42, 4, 1);
    leaf.scale(1, 1, 0.35);
    leaf.rotateZ(Math.PI / 2 + rot);
    leaf.translate(dx * 0.4, 0.08, dx);
    parts.push(painted(leaf, 0x3fc24a));
    const tip = new THREE.ConeGeometry(0.045, 0.12, 4, 1);
    tip.scale(1, 1, 0.4);
    tip.rotateZ(Math.PI / 2 + rot);
    tip.translate(dx * 0.4 - 0.2, 0.08 + rot * 0.05, dx);
    parts.push(painted(tip, PALETTE.lumina));
  }
  const tie = new THREE.CylinderGeometry(0.05, 0.05, 0.2, 6);
  tie.rotateX(Math.PI / 2);
  tie.translate(0.05, 0.08, 0);
  parts.push(painted(tie, 0xc9a46a));
  return mergeGeometries(parts)!;
}

function pasteGeometry(): THREE.BufferGeometry {
  // Mattonella beige avvolta in tela, con la fascia azzurra del marchio.
  const brick = painted(new RoundedBoxGeometry(0.38, 0.15, 0.3, 1, 0.04), 0xe8d3a6);
  brick.translate(0, 0.075, 0);
  const band = painted(new RoundedBoxGeometry(0.1, 0.155, 0.305, 1, 0.02), 0x4fc3d9);
  band.translate(0, 0.075, 0);
  return mergeGeometries([brick, band])!;
}

function scrapGeometry(): THREE.BufferGeometry {
  // Sacco di juta grigio-marrone con la legatura in cima.
  const sack = new THREE.IcosahedronGeometry(0.17, 1);
  sack.scale(1.05, 0.72, 0.9);
  sack.translate(0, 0.12, 0);
  const tie = new THREE.CylinderGeometry(0.03, 0.06, 0.08, 5);
  tie.translate(0, 0.25, 0);
  return mergeGeometries([painted(sack, 0x8a7a63), painted(tie, 0x6b5c48)])!;
}

function moneyGeometry(): THREE.BufferGeometry {
  // Mazzetta verde acceso con la fascia chiara: l'unico verde di quel tono nella scena (GDD sezione 10).
  const bill = painted(new RoundedBoxGeometry(0.36, 0.11, 0.22, 1, 0.025), PALETTE.money);
  bill.translate(0, 0.055, 0);
  const band = painted(new RoundedBoxGeometry(0.09, 0.115, 0.225, 1, 0.015), PALETTE.moneyBand);
  band.translate(0, 0.055, 0);
  return mergeGeometries([bill, band])!;
}

const MAX_PER_KIND = 260;

/** Raccolta per fotogramma di tutti i pezzi da disegnare. */
export class ItemBatch {
  readonly root = new THREE.Group();
  private readonly meshes: Record<VisualItem, THREE.InstancedMesh>;
  private readonly counts: Record<VisualItem, number> = { leaf: 0, paste: 0, scrap: 0, money: 0 };
  private readonly m = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly v = new THREE.Vector3();
  private readonly one = new THREE.Vector3(1, 1, 1);
  private readonly sc = new THREE.Vector3();
  private readonly up = new THREE.Vector3(0, 1, 0);

  constructor() {
    this.root.name = 'merci';
    const mat = new THREE.MeshLambertMaterial({ vertexColors: true, flatShading: true });
    const geos: Record<VisualItem, THREE.BufferGeometry> = {
      leaf: leafGeometry(),
      paste: pasteGeometry(),
      scrap: scrapGeometry(),
      money: moneyGeometry(),
    };
    this.meshes = {} as Record<VisualItem, THREE.InstancedMesh>;
    for (const k of Object.keys(geos) as VisualItem[]) {
      const mesh = new THREE.InstancedMesh(geos[k], mat, MAX_PER_KIND);
      mesh.name = `merce:${k}`;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      mesh.frustumCulled = false;
      mesh.count = 0;
      this.meshes[k] = mesh;
      this.root.add(mesh);
    }
  }

  begin(): void {
    for (const k of Object.keys(this.counts) as VisualItem[]) this.counts[k] = 0;
  }

  /** Un pezzo con la base nel punto (x, y, z) del mondo, ruotato attorno alla verticale. */
  add(kind: VisualItem, x: number, y: number, z: number, rotY = 0, scale = 1, tiltX = 0, tiltZ = 0): void {
    const i = this.counts[kind];
    if (i >= MAX_PER_KIND) return;
    this.q.setFromAxisAngle(this.up, rotY);
    if (tiltX !== 0 || tiltZ !== 0) this.q.multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(tiltX, 0, tiltZ)));
    this.m.compose(this.v.set(x, y, z), this.q, scale === 1 ? this.one : this.sc.setScalar(scale));
    this.meshes[kind].setMatrixAt(i, this.m);
    this.counts[kind] = i + 1;
  }

  end(): void {
    for (const k of Object.keys(this.counts) as VisualItem[]) {
      const mesh = this.meshes[k];
      mesh.count = this.counts[k];
      mesh.instanceMatrix.needsUpdate = true;
    }
  }
}

/**
 * Mucchio di mazzette a blocchi di 2 × 3 che cresce in altezza (GDD sezione 10), come i soldi a
 * terra di Pizza Ready. Oltre 40 mazzette la pila smette di crescere (GDD sezione 4).
 */
export function addMoneyPile(batch: ItemBatch, value: number, x: number, z: number, pop = 1): void {
  const bundles = Math.min(40, Math.max(6, Math.ceil(value / 5)));
  for (let i = 0; i < bundles; i++) {
    const layer = Math.floor(i / 6);
    const slot = i % 6;
    const col = slot % 2;
    const row = Math.floor(slot / 2);
    batch.add('money', x + (col - 0.5) * 0.38, layer * ITEM_HEIGHT.money * pop, z + (row - 1) * 0.24, 0, pop);
  }
}
