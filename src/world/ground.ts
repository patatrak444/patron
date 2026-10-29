// Terreno vivo (GDD sezione 10): chiazze nei tre verdi della giungla, sentieri e campi con bordi
// morbidi e irregolari che sfumano nell'erba, ciuffi d'erba sparsi con una sola geometria.
// Il suolo è una sola texture dipinta all'avvio: un piano, una chiamata di disegno.

import * as THREE from 'three';
import { FIELD_PLOTS, FIELD_SIZE, OBSTACLES, PATHS, ROAD, VALLEY, type MapPoint, type PathStrip } from '../config/map';
import { createRng, type Rng } from '../core/rng';
import { PALETTE } from './palette';

/** Area dipinta, in coordinate della mappa: la valle più la fascia di giungla decorativa. */
export const GROUND_AREA = { x0: -32, y0: -32, x1: VALLEY.width + 32, y1: VALLEY.depth + 32 } as const;
const PX_PER_M = 16;

const hex = (c: number, a = 1): string => {
  const r = (c >> 16) & 255;
  const g = (c >> 8) & 255;
  const b = c & 255;
  return `rgba(${r},${g},${b},${a})`;
};

/** Distanza di un punto dall'asse di una striscia (segmento). */
export function distanceToStrip(p: MapPoint, s: PathStrip): number {
  const dx = s.to.x - s.from.x;
  const dy = s.to.y - s.from.y;
  const len2 = dx * dx + dy * dy;
  const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((p.x - s.from.x) * dx + (p.y - s.from.y) * dy) / len2));
  return Math.hypot(p.x - (s.from.x + t * dx), p.y - (s.from.y + t * dy));
}

/** Vero se il punto è su un sentiero, sulla strada o su un campo, con un margine in metri. */
export function isOnGroundFeature(p: MapPoint, margin = 0): boolean {
  for (const s of [ROAD, ...PATHS]) if (distanceToStrip(p, s) < s.width / 2 + margin) return true;
  const h = FIELD_SIZE / 2 + margin;
  for (const f of FIELD_PLOTS) if (Math.abs(p.x - f.x) < h && Math.abs(p.y - f.y) < h) return true;
  return false;
}

/** Vero se il punto cade dentro un ostacolo fisso (con margine). */
export function isInsideObstacle(p: MapPoint, margin = 0): boolean {
  for (const o of OBSTACLES) {
    const s = o.shape;
    if (s.kind === 'rect') {
      if (Math.abs(p.x - s.x) < s.w / 2 + margin && Math.abs(p.y - s.y) < s.h / 2 + margin) return true;
    } else if (Math.hypot(p.x - s.x, p.y - s.y) < s.r + margin) return true;
  }
  return false;
}

function paint(rng: Rng): HTMLCanvasElement {
  const w = (GROUND_AREA.x1 - GROUND_AREA.x0) * PX_PER_M;
  const h = (GROUND_AREA.y1 - GROUND_AREA.y0) * PX_PER_M;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  // Da metri della mappa a pixel: il nord (y grande) sta in alto nella texture.
  const X = (x: number): number => (x - GROUND_AREA.x0) * PX_PER_M;
  const Y = (y: number): number => (GROUND_AREA.y1 - y) * PX_PER_M;
  const M = (m: number): number => m * PX_PER_M;

  // Fondo: giungla scura fuori, verde medio nella valle, con passaggio sfumato di 3 m.
  ctx.fillStyle = hex(PALETTE.jungleDark);
  ctx.fillRect(0, 0, w, h);
  for (let i = 6; i >= 0; i--) {
    const pad = i * 0.5;
    ctx.fillStyle = hex(PALETTE.jungleMid, i === 0 ? 1 : 0.22);
    ctx.fillRect(X(-pad), Y(VALLEY.depth + pad), M(VALLEY.width + pad * 2), M(VALLEY.depth + pad * 2));
  }

  const blob = (x: number, y: number, r: number, color: number, a: number): void => {
    const g = ctx.createRadialGradient(X(x), Y(y), 0, X(x), Y(y), M(r));
    g.addColorStop(0, hex(color, a));
    g.addColorStop(1, hex(color, 0));
    ctx.fillStyle = g;
    ctx.fillRect(X(x) - M(r), Y(y) - M(r), M(r * 2), M(r * 2));
  };

  // Chiazze nei tre verdi (GDD sezione 10, "terreno vivo").
  for (let i = 0; i < 420; i++) {
    const x = GROUND_AREA.x0 + rng.next() * (GROUND_AREA.x1 - GROUND_AREA.x0);
    const y = GROUND_AREA.y0 + rng.next() * (GROUND_AREA.y1 - GROUND_AREA.y0);
    const inside = x > 0 && x < VALLEY.width && y > 0 && y < VALLEY.depth;
    const color = inside
      ? rng.chance(0.55)
        ? PALETTE.jungleLight
        : PALETTE.jungleDark
      : rng.chance(0.6)
        ? 0x24552e
        : PALETTE.jungleMid;
    blob(x, y, 1.5 + rng.next() * 4.5, color, inside ? 0.32 : 0.4);
  }

  // Bordo irregolare: tanti dischi sfumati lungo il contorno, poi il pieno.
  const softStrip = (s: PathStrip, color: number): void => {
    const len = Math.hypot(s.to.x - s.from.x, s.to.y - s.from.y);
    const steps = Math.max(2, Math.ceil(len / 0.45));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = s.from.x + (s.to.x - s.from.x) * t;
      const y = s.from.y + (s.to.y - s.from.y) * t;
      blob(x, y, s.width / 2 + 0.2 + rng.next() * 0.3, color, 0.3);
    }
    ctx.strokeStyle = hex(color);
    ctx.lineCap = 'round';
    ctx.lineWidth = M(s.width * 0.9);
    ctx.beginPath();
    ctx.moveTo(X(s.from.x), Y(s.from.y));
    ctx.lineTo(X(s.to.x), Y(s.to.y));
    ctx.stroke();
  };
  softStrip(ROAD, 0xb8915f);
  // Solchi delle ruote sulla strada di El Gordo.
  ctx.strokeStyle = hex(0x9c7647, 0.6);
  ctx.lineWidth = M(0.35);
  for (const off of [-0.8, 0.8]) {
    ctx.beginPath();
    ctx.moveTo(X(ROAD.from.x + off), Y(ROAD.from.y - 30));
    ctx.lineTo(X(ROAD.to.x + off), Y(ROAD.to.y + 30));
    ctx.stroke();
  }
  for (const p of PATHS) softStrip(p, PALETTE.path);
  // Sassolini e macchie sui sentieri.
  for (const s of [ROAD, ...PATHS]) {
    const len = Math.hypot(s.to.x - s.from.x, s.to.y - s.from.y);
    for (let i = 0; i < len * 3; i++) {
      const t = rng.next();
      const off = (rng.next() - 0.5) * s.width * 0.8;
      const nx = -(s.to.y - s.from.y) / (len || 1);
      const ny = (s.to.x - s.from.x) / (len || 1);
      const x = s.from.x + (s.to.x - s.from.x) * t + nx * off;
      const y = s.from.y + (s.to.y - s.from.y) * t + ny * off;
      blob(x, y, 0.15 + rng.next() * 0.35, rng.chance(0.5) ? 0xa88459 : 0xd9b88f, 0.5);
    }
  }

  // Campi: terra con contorno irregolare, solchi e frangia d'erba.
  for (const f of FIELD_PLOTS) {
    const half = FIELD_SIZE / 2;
    const pts: [number, number][] = [];
    const n = 28;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      // Quadrato smussato: superellisse con raggio che oscilla di ±0,2 m.
      const c = Math.cos(a);
      const s = Math.sin(a);
      const k = 1 / Math.pow(Math.pow(Math.abs(c), 6) + Math.pow(Math.abs(s), 6), 1 / 6);
      const r = (half + 0.15 + (rng.next() - 0.5) * 0.4) * k;
      pts.push([f.x + c * r, f.y + s * r]);
    }
    blob(f.x, f.y, half + 1.4, 0x5e7a3a, 0.35);
    ctx.fillStyle = hex(PALETTE.fieldEarth);
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(X(x), Y(y)) : ctx.lineTo(X(x), Y(y))));
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = hex(0x6e4a30, 0.7);
    ctx.lineWidth = M(0.18);
    for (let r = -1.5; r <= 1.5; r += 0.75) {
      ctx.beginPath();
      ctx.moveTo(X(f.x - half + 0.35), Y(f.y + r));
      ctx.lineTo(X(f.x + half - 0.35), Y(f.y + r));
      ctx.stroke();
    }
  }

  // Ombra di contatto sotto le stazioni: àncora gli oggetti al suolo.
  for (const o of OBSTACLES) {
    const s = o.shape;
    const r = s.kind === 'rect' ? Math.max(s.w, s.h) / 2 + 0.6 : s.r + 0.6;
    blob(s.x, s.y, r, 0x1b2a14, 0.35);
  }
  return canvas;
}

/** Ciuffo d'erba: tre fili a ventaglio, 6 triangoli. */
function tuftGeometry(): THREE.BufferGeometry {
  const v: number[] = [];
  for (let i = 0; i < 3; i++) {
    const a = (i / 3) * Math.PI + 0.3;
    const ca = Math.cos(a);
    const sa = Math.sin(a);
    const lean = (i - 1) * 0.12;
    const w = 0.11;
    // Due triangoli per filo, piegati leggermente in avanti.
    const tip = [lean * ca, 1, lean * sa];
    const l = [-w * ca, 0, -w * sa];
    const r = [w * ca, 0, w * sa];
    const mid = [lean * 0.5 * ca, 0.55, lean * 0.5 * sa];
    v.push(...l, ...r, ...mid, ...mid, ...r, ...tip);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(v, 3));
  g.computeVertexNormals();
  return g;
}

export function createGround(): THREE.Group {
  const root = new THREE.Group();
  root.name = 'ground';
  const rng = createRng(4242);

  const tex = new THREE.CanvasTexture(paint(rng));
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  const w = GROUND_AREA.x1 - GROUND_AREA.x0;
  const h = GROUND_AREA.y1 - GROUND_AREA.y0;
  // Griglia 8 × 8 invece di due soli triangoli enormi: l'interpolazione resta precisa su tutto il piano.
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(w, h, 8, 8), new THREE.MeshLambertMaterial({ map: tex }));
  plane.rotation.x = -Math.PI / 2;
  plane.position.set((GROUND_AREA.x0 + GROUND_AREA.x1) / 2, 0, -(GROUND_AREA.y0 + GROUND_AREA.y1) / 2);
  plane.receiveShadow = true;
  root.add(plane);

  // Oltre l'area dipinta: giungla scura piatta, persa nella nebbia.
  const outer = new THREE.Mesh(
    new THREE.PlaneGeometry(w + 400, h + 400),
    new THREE.MeshLambertMaterial({ color: 0x24552e }),
  );
  outer.rotation.x = -Math.PI / 2;
  // Abbastanza sotto da non contendersi la profondità con il terreno dipinto (niente z-fighting).
  outer.position.set(plane.position.x, -0.3, plane.position.z);
  root.add(outer);

  // Ciuffi d'erba nella valle, fuori da sentieri, campi e stazioni.
  const tufts: { x: number; y: number; s: number; c: number; r: number }[] = [];
  const shades = [PALETTE.jungleLight, 0x8fd477, 0x6db35c];
  while (tufts.length < 900) {
    const p = { x: -1 + rng.next() * (VALLEY.width + 2), y: -1 + rng.next() * 37 };
    if (isOnGroundFeature(p, 0.15) || isInsideObstacle(p, 0.3)) continue;
    tufts.push({ ...p, s: 0.2 + rng.next() * 0.18, c: rng.int(0, 2), r: rng.next() * Math.PI });
  }
  const geo = tuftGeometry();
  const mat = new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide });
  const mesh = new THREE.InstancedMesh(geo, mat, tufts.length);
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const up = new THREE.Vector3(0, 1, 0);
  const col = new THREE.Color();
  tufts.forEach((t, i) => {
    q.setFromAxisAngle(up, t.r);
    m.compose(new THREE.Vector3(t.x, 0, -t.y), q, new THREE.Vector3(t.s * 1.4, t.s, t.s * 1.4));
    mesh.setMatrixAt(i, m);
    mesh.setColorAt(i, col.setHex(shades[t.c]!));
  });
  mesh.receiveShadow = true;
  mesh.computeBoundingSphere();
  root.add(mesh);
  return root;
}
