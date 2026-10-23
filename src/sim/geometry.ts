// Collisioni semplici tra il cerchio di un personaggio e le forme del mondo (GDD sezione 3).

import type { MapPoint, Shape } from '../config/map';

/** Vero se il punto sta dentro la forma allargata di `pad` metri. */
export function insideShape(p: MapPoint, shape: Shape, pad: number): boolean {
  if (shape.kind === 'circle') {
    return Math.hypot(p.x - shape.x, p.y - shape.y) < shape.r + pad;
  }
  const dx = Math.max(Math.abs(p.x - shape.x) - shape.w / 2, 0);
  const dy = Math.max(Math.abs(p.y - shape.y) - shape.h / 2, 0);
  return Math.hypot(dx, dy) < pad || (Math.abs(p.x - shape.x) < shape.w / 2 && Math.abs(p.y - shape.y) < shape.h / 2);
}

/**
 * Spinge fuori dalla forma un cerchio di raggio `r` centrato in `p`.
 * Restituisce la nuova posizione (uguale a `p` se non c'è contatto).
 */
export function pushOut(p: MapPoint, r: number, shape: Shape): MapPoint {
  if (shape.kind === 'circle') {
    const dx = p.x - shape.x;
    const dy = p.y - shape.y;
    const d = Math.hypot(dx, dy);
    const min = shape.r + r;
    if (d >= min) return p;
    if (d < 1e-6) return { x: shape.x + min, y: shape.y };
    return { x: shape.x + (dx / d) * min, y: shape.y + (dy / d) * min };
  }

  const hw = shape.w / 2;
  const hh = shape.h / 2;
  const cx = Math.min(Math.max(p.x, shape.x - hw), shape.x + hw);
  const cy = Math.min(Math.max(p.y, shape.y - hh), shape.y + hh);
  const dx = p.x - cx;
  const dy = p.y - cy;
  const d = Math.hypot(dx, dy);

  if (d > 1e-6) {
    if (d >= r) return p;
    return { x: cx + (dx / d) * r, y: cy + (dy / d) * r };
  }

  // Centro dentro il rettangolo: esce dal lato più vicino.
  const left = p.x - (shape.x - hw);
  const right = shape.x + hw - p.x;
  const down = p.y - (shape.y - hh);
  const up = shape.y + hh - p.y;
  const m = Math.min(left, right, down, up);
  if (m === left) return { x: shape.x - hw - r, y: p.y };
  if (m === right) return { x: shape.x + hw + r, y: p.y };
  if (m === down) return { x: p.x, y: shape.y - hh - r };
  return { x: p.x, y: shape.y + hh + r };
}

/** Tiene il cerchio dentro il rettangolo [0, width] × [0, depth]. */
export function clampToBounds(p: MapPoint, r: number, width: number, depth: number): MapPoint {
  return {
    x: Math.min(Math.max(p.x, r), width - r),
    y: Math.min(Math.max(p.y, r), depth - r),
  };
}
