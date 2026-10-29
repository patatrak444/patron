// Modelli dai pacchetti CC0 di Kenney (GDD sezione 10).
// Si caricano una volta all'avvio; i materiali "non illuminati" dei pacchetti diventano
// Lambert con ombreggiatura piatta e i colori tornano alla palette del documento.

import * as THREE from 'three';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { PALETTE } from './palette';

/** Modelli statici disegnati molte volte (alberi, cespugli, rocce…). */
export const PROP_IDS = [
  'tree_palm',
  'tree_oak',
  'tree_fat',
  'tree_dark',
  'bush',
  'bush_large',
  'rock_large',
  'rock_small',
  'stump',
  'log',
  'fence',
  'flower_red',
  'truck_flat',
] as const;
/** Modelli costruiti da codice nello stesso formato dei pacchetti (es. il cespuglio tondo). */
export const CODE_PROP_IDS = ['bush_round'] as const;
export type PropId = (typeof PROP_IDS)[number] | (typeof CODE_PROP_IDS)[number];

export const CHARACTER_IDS = [
  'mini_male_a',
  'mini_male_b',
  'mini_male_c',
  'mini_male_d',
  'mini_male_e',
  'mini_male_f',
  'mini_female_a',
  'mini_female_b',
  'mini_female_c',
  'mini_female_d',
  'mini_female_e',
  'mini_female_f',
] as const;
export type CharacterId = (typeof CHARACTER_IDS)[number];

/** Colori dei materiali dei pacchetti riportati alla palette del documento. */
const RECOLOR: Record<string, number> = {
  leafsGreen: PALETTE.jungleLight,
  leafsDark: PALETTE.jungleDark,
  grass: 0x74c95c,
  woodBark: 0x9a6640,
  woodBarkDark: 0x8a5a38,
  wood: 0xb98256,
  dirt: PALETTE.fieldEarth,
  dirtDark: PALETTE.fieldEarthDark,
  stone: 0xc4bfb4,
  stoneDark: 0xa9a397,
};

/** Ricolorazioni proprie di un modello, prima di quelle generali (es. le rocce sono pietra, non terra). */
const RECOLOR_BY_PROP: Partial<Record<PropId, Record<string, number>>> = {
  rock_large: { dirt: 0xc4bfb4, grass: 0xa9a397 },
  rock_small: { dirt: 0xc4bfb4, grass: 0xa9a397 },
};

/** Una parte di un modello statico: geometria già nel sistema di riferimento del modello. */
export interface PropPart {
  readonly geometry: THREE.BufferGeometry;
  readonly material: THREE.Material;
}

export interface Prop {
  readonly id: PropId;
  readonly parts: readonly PropPart[];
  /** Altezza originale, in unità del file. */
  readonly height: number;
}

export interface CharacterAsset {
  readonly scene: THREE.Object3D;
  readonly clips: readonly THREE.AnimationClip[];
  readonly height: number;
}

export interface Assets {
  readonly props: Readonly<Record<PropId, Prop>>;
  readonly characters: Readonly<Record<CharacterId, CharacterAsset>>;
}

/** Converte un materiale del pacchetto in Lambert piatto, con il colore della palette se previsto. */
export function toLambert(source: THREE.Material, overrides?: Record<string, number>): THREE.MeshLambertMaterial {
  const src = source as THREE.MeshStandardMaterial;
  const mapped = overrides?.[src.name] ?? RECOLOR[src.name];
  const mat = new THREE.MeshLambertMaterial({
    name: src.name,
    color: mapped ?? src.color?.getHex() ?? 0xffffff,
    map: src.map ?? null,
    flatShading: true,
    side: src.side,
    transparent: src.transparent,
    alphaTest: src.alphaTest,
  });
  if (src.emissive && src.emissive.getHex() !== 0) mat.emissive.copy(src.emissive);
  return mat;
}

/** Unisce le mesh di un modello statico in parti, una per materiale, con le trasformazioni applicate. */
function extractParts(root: THREE.Object3D, overrides?: Record<string, number>): PropPart[] {
  root.updateMatrixWorld(true);
  const byMaterial = new Map<string, { material: THREE.Material; geometries: THREE.BufferGeometry[] }>();
  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    const src = mats[0]!;
    // La quantizzazione dei pacchetti lascia attributi interi o interlacciati: prima tutto in float,
    // poi la trasformazione del nodo (che contiene anche la scala di dequantizzazione).
    const geo = new THREE.BufferGeometry();
    for (const name of ['position', 'normal', 'uv']) {
      const a = mesh.geometry.getAttribute(name);
      if (!a) continue;
      const f = new Float32Array(a.count * a.itemSize);
      for (let i = 0; i < a.count; i++) for (let k = 0; k < a.itemSize; k++) f[i * a.itemSize + k] = a.getComponent(i, k);
      geo.setAttribute(name, new THREE.BufferAttribute(f, a.itemSize));
    }
    if (mesh.geometry.index) geo.setIndex(Array.from(mesh.geometry.index.array as ArrayLike<number>));
    geo.applyMatrix4(mesh.matrixWorld);
    const key = src.name || src.uuid;
    const entry = byMaterial.get(key) ?? { material: toLambert(src, overrides), geometries: [] };
    entry.geometries.push(geo.index ? geo.toNonIndexed() : geo);
    byMaterial.set(key, entry);
  });
  return [...byMaterial.values()].map(({ material, geometries }) => ({
    material,
    geometry: mergeSimple(geometries),
  }));
}

/** Unione minima di geometrie non indicizzate con gli stessi attributi (posizione, normale, uv). */
function mergeSimple(list: THREE.BufferGeometry[]): THREE.BufferGeometry {
  if (list.length === 1) return list[0]!;
  const names = ['position', 'normal', 'uv'].filter((n) => list.every((g) => g.getAttribute(n)));
  const out = new THREE.BufferGeometry();
  for (const n of names) {
    const size = list[0]!.getAttribute(n).itemSize;
    const total = list.reduce((s, g) => s + g.getAttribute(n).count, 0);
    const arr = new Float32Array(total * size);
    let off = 0;
    for (const g of list) {
      arr.set(g.getAttribute(n).array as Float32Array, off);
      off += g.getAttribute(n).count * size;
    }
    out.setAttribute(n, new THREE.BufferAttribute(arr, size));
  }
  return out;
}

/** Porta le parti con la base a y = 0 e il centro della pianta nell'origine. */
function normalize(parts: PropPart[]): number {
  const box = new THREE.Box3();
  for (const p of parts) {
    p.geometry.computeBoundingBox();
    box.union(p.geometry.boundingBox!);
  }
  const cx = (box.min.x + box.max.x) / 2;
  const cz = (box.min.z + box.max.z) / 2;
  for (const p of parts) {
    p.geometry.translate(-cx, -box.min.y, -cz);
    p.geometry.computeVertexNormals();
    p.geometry.computeBoundingSphere();
  }
  return box.max.y - box.min.y;
}

/** Fattore di scala per portare un modello alta `sourceHeight` all'altezza `target` in metri. */
export function scaleToHeight(sourceHeight: number, target: number): number {
  return sourceHeight > 0 ? target / sourceHeight : 1;
}

function heightOf(root: THREE.Object3D): number {
  root.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(root);
  return box.max.y - box.min.y;
}

/**
 * Cespuglio tondo da codice (GDD sezione 10): tre sfere low-poly fuse, alte 1 m. I cespugli del
 * Nature Kit sono a punte e sembrano carta stropicciata; il genere usa forme morbide e tonde.
 */
export function roundBushProp(): Prop {
  const blobs: [number, number, number, number][] = [
    [0, 0.5, 0, 0.55],
    [0.36, 0.34, 0.1, 0.4],
  ];
  const parts = blobs.map(([x, y, z, r]) => new THREE.IcosahedronGeometry(r, 1).translate(x, y, z).toNonIndexed());
  const total = parts.reduce((s, g) => s + g.getAttribute('position').count, 0);
  const pos = new Float32Array(total * 3);
  let o = 0;
  for (const g of parts) {
    pos.set(g.getAttribute('position').array as Float32Array, o);
    o += g.getAttribute('position').count * 3;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  const part = { geometry, material: new THREE.MeshLambertMaterial({ name: 'cespuglio', color: 0x6cc35a, flatShading: true }) };
  const prop = { id: 'bush_round' as const, parts: [part], height: 0 };
  return { ...prop, height: normalize([part]) };
}

export async function loadAssets(baseUrl = './models/'): Promise<Assets> {
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  const load = (id: string): Promise<GLTF> => loader.loadAsync(`${baseUrl}${id}.glb`);

  const [propGltfs, charGltfs] = await Promise.all([
    Promise.all(PROP_IDS.map(load)),
    Promise.all(CHARACTER_IDS.map(load)),
  ]);

  const props = {} as Record<PropId, Prop>;
  PROP_IDS.forEach((id, i) => {
    const parts = extractParts(propGltfs[i]!.scene, RECOLOR_BY_PROP[id]);
    props[id] = { id, parts, height: normalize(parts) };
  });
  props.bush_round = roundBushProp();

  const characters = {} as Record<CharacterId, CharacterAsset>;
  CHARACTER_IDS.forEach((id, i) => {
    const gltf = charGltfs[i]!;
    gltf.scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.material = toLambert(mesh.material as THREE.Material);
      mesh.castShadow = true;
      mesh.frustumCulled = false;
    });
    characters[id] = { scene: gltf.scene, clips: gltf.animations, height: heightOf(gltf.scene) };
  });

  return { props, characters };
}
