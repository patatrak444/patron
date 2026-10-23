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

/** Rettangolo con centro e lati (w lungo x, h lungo y) o cerchio con centro e raggio. */
export type Shape =
  | { readonly kind: 'rect'; readonly x: number; readonly y: number; readonly w: number; readonly h: number }
  | { readonly kind: 'circle'; readonly x: number; readonly y: number; readonly r: number };

export interface Obstacle {
  readonly id: string;
  readonly shape: Shape;
}

/** Area coperta da un muro di vegetazione finché non viene sbloccata. */
export interface LockedArea extends Obstacle {
  /** Alberi alti (giungla) o cespugli bassi (appezzamenti e piccole stazioni). */
  readonly cover: 'jungle' | 'bushes';
}

export interface PathStrip {
  readonly from: MapPoint;
  readonly to: MapPoint;
  readonly width: number;
}

export const VALLEY_CENTER: MapPoint = { x: VALLEY.width / 2, y: VALLEY.depth / 2 };

/** Punto di partenza del giocatore, davanti alla capanna. */
export const PLAYER_SPAWN: MapPoint = { x: 20, y: 4 };

/** I sei appezzamenti 4 × 4 m, due file da tre tra (8, 10) e (32, 18). Il Campo 1 è quello davanti alla capanna. */
export const FIELD_PLOTS: readonly (MapPoint & { readonly id: string })[] = [
  { id: 'field1', x: 20, y: 12 },
  { id: 'field2', x: 10, y: 12 },
  { id: 'field3', x: 30, y: 12 },
  { id: 'field4', x: 20, y: 16 },
  { id: 'field5', x: 10, y: 16 },
  { id: 'field6', x: 30, y: 16 },
];
export const FIELD_SIZE = 4;

/** Ingombri fissi già presenti dall'inizio. In M1 le stazioni sono segnaposto. */
export const OBSTACLES: readonly Obstacle[] = [
  // La capanna sta a cavallo del bordo sud: così il tetto non copre il punto di partenza visto dalla camera.
  { id: 'hut', shape: { kind: 'rect', x: 20, y: 0.6, w: 4.4, h: 3 } },
  { id: 'press1', shape: { kind: 'rect', x: 14, y: 26, w: 2.4, h: 2.4 } },
  { id: 'truck', shape: { kind: 'rect', x: 3, y: 26, w: 2.4, h: 5.5 } },
  { id: 'officeDesk', shape: { kind: 'rect', x: 28, y: 26.4, w: 2, h: 1 } },
  { id: 'officeTree', shape: { kind: 'circle', x: 30, y: 28, r: 0.7 } },
];

/** Aree bloccate all'inizio della partita. Gli sblocchi (M2 in poi) le tolgono da questa lista. */
export const LOCKED_AREAS: readonly LockedArea[] = [
  ...FIELD_PLOTS.slice(1).map(
    (f): LockedArea => ({
      id: f.id,
      cover: 'bushes',
      shape: { kind: 'rect', x: f.x, y: f.y, w: FIELD_SIZE, h: FIELD_SIZE },
    }),
  ),
  { id: 'press2', cover: 'bushes', shape: { kind: 'rect', x: 20, y: 26, w: 2.6, h: 2.6 } },
  // Laboratorio, Banco e Plaza: tutto il nord della valle.
  { id: 'north', cover: 'jungle', shape: { kind: 'rect', x: 20, y: 47, w: 40, h: 26 } },
];

/** Strada di El Gordo e sentieri, solo grafica. */
export const ROAD: PathStrip = { from: { x: 3, y: 0 }, to: { x: 3, y: 60 }, width: 4 };
export const PATHS: readonly PathStrip[] = [
  { from: { x: 20, y: 2.1 }, to: { x: 20, y: 8 }, width: 2 },
  { from: { x: 14, y: 8 }, to: { x: 26, y: 8 }, width: 2 },
  { from: { x: 15, y: 8 }, to: { x: 15, y: 22 }, width: 2 },
  { from: { x: 25, y: 8 }, to: { x: 25, y: 22 }, width: 2 },
  { from: { x: 5, y: 22 }, to: { x: 30, y: 22 }, width: 2 },
  { from: { x: 20, y: 22 }, to: { x: 20, y: 34 }, width: 2 },
];

/** Converte un punto della mappa del GDD nelle coordinate del suolo di Three.js. */
export function toWorld(p: MapPoint): { x: number; z: number } {
  return { x: p.x, z: -p.y };
}

/** Inverso di toWorld. */
export function fromWorld(x: number, z: number): MapPoint {
  return { x, y: -z };
}
