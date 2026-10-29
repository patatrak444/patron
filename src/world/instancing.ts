// Posizionamenti degli oggetti ripetuti e loro divisione in blocchi quadrati (GDD sezione 10).
// Ogni blocco diventa una mesh con la sua sfera di ingombro (batching.ts), così Three.js scarta
// i blocchi fuori inquadratura e fuori dalla mappa d'ombra.

import * as THREE from 'three';
import type { Prop } from './assets';

export interface Placement {
  /** Coordinate del suolo di Three.js (x, z). */
  readonly x: number;
  readonly z: number;
  /** Altezza finale in metri. */
  readonly height: number;
  readonly rotY: number;
  /** Moltiplicatore di colore, 1 = colore del materiale. */
  readonly tint?: number;
  /** Schiacciamento orizzontale rispetto all'altezza (1 = proporzioni del modello). */
  readonly widthFactor?: number;
}

/** Chiave del blocco che contiene il punto, per lato `size`. */
export function chunkKey(x: number, z: number, size: number): string {
  return `${Math.floor(x / size)}:${Math.floor(z / size)}`;
}

/** Raggruppa i posizionamenti per blocco. */
export function groupByChunk<T extends { x: number; z: number }>(items: readonly T[], size: number): Map<string, T[]> {
  const out = new Map<string, T[]>();
  for (const it of items) {
    const k = chunkKey(it.x, it.z, size);
    const list = out.get(k);
    if (list) list.push(it);
    else out.set(k, [it]);
  }
  return out;
}

/** Un singolo oggetto statico (non istanziato), per ciò che deve poter diventare trasparente. */
export function createSingle(prop: Prop, height: number, rotY = 0, castShadow = true): THREE.Group {
  const g = new THREE.Group();
  const k = height / prop.height;
  for (const part of prop.parts) {
    const mesh = new THREE.Mesh(part.geometry, part.material);
    mesh.castShadow = castShadow;
    mesh.receiveShadow = true;
    g.add(mesh);
  }
  g.scale.setScalar(k);
  g.rotation.y = rotY;
  return g;
}
