// Terreno pulito (GDD sezione 10): erba di un solo verde chiaro, sentieri e campi come zone nette
// con angoli arrotondati e un contorno più scuro, come un pavimento disegnato.
// Il suolo è una sola texture dipinta all'avvio: un piano, una chiamata di disegno.

import * as THREE from 'three';
import { FIELD_PLOTS, FIELD_SIZE, LOTS, ROAD, VALLEY, inRect, type MapPoint, type PathStrip } from '../config/map';
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

/** Vero se il punto è sulla strada, dentro un lotto o su un appezzamento, con un margine in metri. */
export function isOnGroundFeature(p: MapPoint, margin = 0): boolean {
  if (distanceToStrip(p, ROAD) < ROAD.width / 2 + margin) return true;
  for (const lot of Object.values(LOTS)) if (inRect(p, lot, -margin)) return true;
  const h = FIELD_SIZE / 2 + margin;
  for (const f of FIELD_PLOTS) if (Math.abs(p.x - f.x) < h && Math.abs(p.y - f.y) < h) return true;
  return false;
}

function paint(): HTMLCanvasElement {
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
  const EDGE = 0.15;

  // Rettangolo arrotondato con arcTo: funziona anche sui Safari di macOS Monterey, senza roundRect.
  const roundRect = (cx: number, cy: number, rw: number, rh: number, r: number): void => {
    const x0 = X(cx - rw / 2);
    const y0 = Y(cy + rh / 2);
    const x1 = x0 + M(rw);
    const y1 = y0 + M(rh);
    const rr = Math.min(M(r), M(rw) / 2, M(rh) / 2);
    ctx.beginPath();
    ctx.moveTo(x0 + rr, y0);
    ctx.arcTo(x1, y0, x1, y1, rr);
    ctx.arcTo(x1, y1, x0, y1, rr);
    ctx.arcTo(x0, y1, x0, y0, rr);
    ctx.arcTo(x0, y0, x1, y0, rr);
    ctx.closePath();
  };

  // Fuori: verde uniforme della giungla. Dentro: l'erba della valle, con il suo contorno.
  ctx.fillStyle = hex(PALETTE.jungleFloor);
  ctx.fillRect(0, 0, w, h);
  roundRect(VALLEY.width / 2, VALLEY.depth / 2, VALLEY.width + 1.2 + EDGE * 2, VALLEY.depth + 1.2 + EDGE * 2, 1.2);
  ctx.fillStyle = hex(PALETTE.grassEdge);
  ctx.fill();
  roundRect(VALLEY.width / 2, VALLEY.depth / 2, VALLEY.width + 1.2, VALLEY.depth + 1.2, 1.1);
  ctx.fillStyle = hex(PALETTE.grass);
  ctx.fill();

  // La strada di El Gordo: terra chiara con il contorno e due solchi leggeri.
  const stroke = (st: PathStrip, color: number, extra: number): void => {
    ctx.strokeStyle = hex(color);
    ctx.lineCap = 'butt';
    ctx.lineWidth = M(st.width + extra);
    ctx.beginPath();
    ctx.moveTo(X(st.from.x), Y(st.from.y));
    ctx.lineTo(X(st.to.x), Y(st.to.y));
    ctx.stroke();
  };
  stroke(ROAD, PALETTE.pathEdge, EDGE * 2);
  stroke(ROAD, PALETTE.path, 0);
  ctx.strokeStyle = hex(PALETTE.pathEdge);
  ctx.lineWidth = M(0.25);
  ctx.setLineDash([M(1.2), M(0.8)]);
  for (const off of [-0.6, 0.6]) {
    ctx.beginPath();
    ctx.moveTo(X(ROAD.from.x), Y(ROAD.from.y + off));
    ctx.lineTo(X(ROAD.to.x), Y(ROAD.to.y + off));
    ctx.stroke();
  }
  ctx.setLineDash([]);
  void roundRect;
  return canvas;
}

export function createGround(): THREE.Group {
  const root = new THREE.Group();
  root.name = 'ground';

  const tex = new THREE.CanvasTexture(paint());
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

  // Oltre l'area dipinta: lo stesso verde uniforme, abbastanza sotto da non contendersi la profondità.
  const outer = new THREE.Mesh(
    new THREE.PlaneGeometry(w + 400, h + 400),
    new THREE.MeshLambertMaterial({ color: PALETTE.jungleFloor }),
  );
  outer.rotation.x = -Math.PI / 2;
  outer.position.set(plane.position.x, -0.3, plane.position.z);
  root.add(outer);
  return root;
}
