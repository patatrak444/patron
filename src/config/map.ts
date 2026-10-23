// Posizioni del mondo (GDD sezione 4).
// Coordinate del documento: metri, origine nell'angolo sud-ovest, x verso est, y verso nord.
// In Three.js il suolo è il piano XZ: x resta x, il nord è −z.

export const VALLEY = {
  width: 40,
  depth: 60,
} as const;

export interface MapPoint {
  readonly x: number;
  readonly y: number;
}

export const VALLEY_CENTER: MapPoint = { x: VALLEY.width / 2, y: VALLEY.depth / 2 };

/** Converte un punto della mappa del GDD nelle coordinate del suolo di Three.js. */
export function toWorld(p: MapPoint): { x: number; z: number } {
  return { x: p.x, z: -p.y };
}
