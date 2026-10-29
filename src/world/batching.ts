// Unione di oggetti statici in poche geometrie (GDD sezione 10, obiettivi di prestazione).
// Tutto ciò che non si muove e condivide un materiale diventa una sola mesh: la vegetazione per
// blocchi di 24 m (così si scartano i blocchi fuori inquadratura), le stazioni per materiale.
// Il colore di ogni copia (sfumatura degli alberi) viaggia come colore dei vertici.

import * as THREE from 'three';
import type { Prop } from './assets';
import { groupByChunk, type Placement } from './instancing';

interface Piece {
  readonly geometry: THREE.BufferGeometry;
  readonly matrix: THREE.Matrix4;
  readonly tint: THREE.Color;
}

/**
 * Materiale unico per tutto ciò che ha solo un colore pieno (niente texture né emissione):
 * il colore va nei vertici, e oggetti di colori diversi si disegnano in una chiamata sola.
 */
export const SOLID = new THREE.MeshLambertMaterial({ name: 'solido', vertexColors: true, flatShading: true });

/** Vero se il materiale si può fondere in SOLID: Lambert senza texture, senza emissione, opaco. */
export function isSolid(m: THREE.Material): m is THREE.MeshLambertMaterial {
  const l = m as THREE.MeshLambertMaterial;
  return !!l.isMeshLambertMaterial && !l.map && l.emissive.getHex() === 0 && !l.transparent;
}

/** Materiale e colore dei vertici con cui disegnare una parte. */
function route(material: THREE.Material, tint: number): { material: THREE.Material; tint: THREE.Color } {
  if (isSolid(material)) return { material: SOLID, tint: material.color.clone().multiplyScalar(tint) };
  return { material: withVertexColors(material), tint: new THREE.Color(tint, tint, tint) };
}

/** Unisce pezzi non indicizzati in una geometria con posizione, normale e colore (e uv se tutti l'hanno). */
export function mergePieces(pieces: readonly Piece[]): THREE.BufferGeometry {
  const flat = pieces.map((p) => (p.geometry.index ? p.geometry.toNonIndexed() : p.geometry));
  const total = flat.reduce((s, g) => s + g.getAttribute('position').count, 0);
  const withUv = flat.every((g) => g.getAttribute('uv'));
  const pos = new Float32Array(total * 3);
  const nor = new Float32Array(total * 3);
  const col = new Float32Array(total * 3);
  const uv = withUv ? new Float32Array(total * 2) : null;
  const v = new THREE.Vector3();
  const normalMatrix = new THREE.Matrix3();
  let o = 0;
  flat.forEach((g, i) => {
    const { matrix, tint } = pieces[i]!;
    normalMatrix.getNormalMatrix(matrix);
    const P = g.getAttribute('position');
    const N = g.getAttribute('normal');
    const U = g.getAttribute('uv');
    for (let k = 0; k < P.count; k++, o++) {
      v.fromBufferAttribute(P, k).applyMatrix4(matrix);
      pos[o * 3] = v.x;
      pos[o * 3 + 1] = v.y;
      pos[o * 3 + 2] = v.z;
      if (N) {
        v.fromBufferAttribute(N, k).applyMatrix3(normalMatrix).normalize();
        nor[o * 3] = v.x;
        nor[o * 3 + 1] = v.y;
        nor[o * 3 + 2] = v.z;
      }
      col[o * 3] = tint.r;
      col[o * 3 + 1] = tint.g;
      col[o * 3 + 2] = tint.b;
      if (uv && U) {
        uv[o * 2] = U.getX(k);
        uv[o * 2 + 1] = U.getY(k);
      }
    }
  });
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  out.setAttribute('color', new THREE.BufferAttribute(col, 3));
  if (uv) out.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  out.computeBoundingSphere();
  out.computeBoundingBox();
  return out;
}

const vertexColorMaterials = new WeakMap<THREE.Material, THREE.Material>();
/** Copia del materiale che legge il colore dei vertici (una sola per materiale). */
function withVertexColors(m: THREE.Material): THREE.Material {
  let c = vertexColorMaterials.get(m);
  if (!c) {
    c = m.clone();
    (c as THREE.MeshLambertMaterial).vertexColors = true;
    vertexColorMaterials.set(m, c);
  }
  return c;
}

export interface BatchOptions {
  readonly castShadow: boolean;
  readonly chunkSize?: number;
}

export interface PropPlacements {
  readonly prop: Prop;
  readonly list: readonly Placement[];
}

/**
 * Vegetazione e oggetti sparsi: per ogni blocco, una mesh per materiale con dentro tutte le copie
 * di tutti i modelli che lo usano.
 */
export function createBatches(entries: readonly PropPlacements[], opts: BatchOptions): THREE.Group {
  const group = new THREE.Group();
  const size = opts.chunkSize ?? 12;
  const tagged = entries.flatMap((e) => e.list.map((pl) => ({ ...pl, prop: e.prop })));
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const s = new THREE.Vector3();
  const p = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);

  for (const list of groupByChunk(tagged, size).values()) {
    const byMaterial = new Map<THREE.Material, Piece[]>();
    for (const pl of list) {
      const k = pl.height / pl.prop.height;
      const w = k * (pl.widthFactor ?? 1);
      m.compose(p.set(pl.x, 0, pl.z), q.setFromAxisAngle(up, pl.rotY), s.set(w, k, w));
      for (const part of pl.prop.parts) {
        const r = route(part.material, pl.tint ?? 1);
        const pieces = byMaterial.get(r.material) ?? [];
        pieces.push({ geometry: part.geometry, matrix: m.clone(), tint: r.tint });
        byMaterial.set(r.material, pieces);
      }
    }
    for (const [material, pieces] of byMaterial) {
      const mesh = new THREE.Mesh(mergePieces(pieces), withVertexColors(material));
      mesh.name = `batch:${material.name || 'materiale'}`;
      mesh.castShadow = opts.castShadow;
      mesh.receiveShadow = true;
      group.add(mesh);
    }
  }
  return group;
}

/** Fonde le mesh di un gruppo statico in una mesh per materiale, nel sistema di riferimento del gruppo. */
export function bakeGroup(source: THREE.Group): THREE.Group {
  source.updateMatrixWorld(true);
  const inverse = source.matrixWorld.clone().invert();
  const byMaterial = new Map<THREE.Material, { pieces: Piece[]; cast: boolean }>();
  const keep: THREE.Mesh[] = [];
  source.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh || (mesh as THREE.InstancedMesh).isInstancedMesh) return;
    // Le parti con un nome si animano (es. il piatto della Pressa in M2): restano separate.
    if (mesh.name) {
      keep.push(mesh);
      return;
    }
    const r = route(mesh.material as THREE.Material, 1);
    // Chi fa ombra e chi no restano separati: un dettaglio piccolo non deve finire nella mappa d'ombra.
    const key = r.material;
    const e = byMaterial.get(key) ?? { pieces: [], cast: false };
    e.pieces.push({ geometry: mesh.geometry, matrix: inverse.clone().multiply(mesh.matrixWorld), tint: r.tint });
    e.cast ||= mesh.castShadow;
    byMaterial.set(key, e);
  });
  const out = new THREE.Group();
  out.name = source.name;
  for (const [material, e] of byMaterial) {
    const mesh = new THREE.Mesh(mergePieces(e.pieces), material);
    mesh.name = `${source.name}:${material.name || 'parte'}`;
    mesh.castShadow = e.cast;
    mesh.receiveShadow = true;
    out.add(mesh);
  }
  for (const mesh of keep) {
    const copy = mesh.clone();
    inverse.clone().multiply(mesh.matrixWorld).decompose(copy.position, copy.quaternion, copy.scale);
    out.add(copy);
  }
  return out;
}
