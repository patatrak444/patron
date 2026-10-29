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

/**
 * Punto di partenza del giocatore, davanti alla capanna. A y = 5,2 la gronda nord (alta 2,4 m, a y = 3,05)
 * non copre i piedi vista dalla camera a 55°: tra camera e giocatore non c'è nulla più alto delle
 * ginocchia (GDD sezione 10, inquadratura di partenza).
 */
export const PLAYER_SPAWN: MapPoint = { x: 16.8, y: 7.2 };

/** Il regalo di El Gordo: $20 in mazzette sul sentiero davanti alla capanna (GDD sezione 5). */
export const GIFT_SPOT: MapPoint = { x: 18.4, y: 6.8 };

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
  // La capanna (5 × 4 m, centro a y = 0,6) sta a cavallo del bordo sud: così il tetto non copre il punto
  // di partenza visto dalla camera. L'ingombro comprende la panca e le cassette davanti alla porta.
  { id: 'hut', shape: { kind: 'rect', x: 20, y: 0.9, w: 5.2, h: 4.6 } },
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

/**
 * Tappetini della Fase 1 (GDD sezioni 3 e 4). Ogni stazione ha le sue zone attorno all'ingombro:
 * il ritiro dei Campi sta sul sentiero davanti all'appezzamento; la Pressa riceve le Foglie a sud,
 * dà la Pasta a nord e ha il cassone degli Scarti a ovest; il camion riceve sul lato est.
 */
export const FIELD_MAT_OFFSET = 2.7;
export interface PressLayout {
  readonly id: 'press1' | 'press2';
  readonly x: number;
  readonly y: number;
  readonly deposit: MapPoint;
  readonly output: MapPoint;
  readonly scrap: MapPoint;
}
export const PRESSES: readonly PressLayout[] = [
  { id: 'press1', x: 14, y: 26, deposit: { x: 14, y: 24.1 }, output: { x: 14, y: 27.9 }, scrap: { x: 11.9, y: 26 } },
  { id: 'press2', x: 20, y: 26, deposit: { x: 20, y: 24.1 }, output: { x: 20, y: 27.9 }, scrap: { x: 17.9, y: 26 } },
];
export const PRESS_SIZE = 2.4;
/** Falò per gli Scarti, fra le due Presse (GDD sezione 4). */
export const BONFIRE: MapPoint & { readonly r: number; readonly mat: MapPoint } = { x: 17, y: 30.4, r: 0.8, mat: { x: 17, y: 29 } };
/** Camion di El Gordo: carico sul lato est, mazzette sul sentiero a sud-est. */
export const TRUCK = { x: 3, y: 26, deposit: { x: 5.5, y: 26 }, cash: { x: 6.4, y: 22.6 } } as const;
/** Tappetini di sblocco della Fase 1, nell'ordine della sequenza. */
export const UNLOCK_PADS: Readonly<Record<'field2' | 'picker1' | 'field3' | 'picker2' | 'press2', MapPoint>> = {
  field2: { x: 10, y: 9.3 },
  picker1: { x: 25.6, y: 6.2 },
  field3: { x: 30, y: 9.3 },
  picker2: { x: 14.4, y: 6.2 },
  press2: { x: 20, y: 24.1 },
};

/** Strada di El Gordo e sentieri, solo grafica. */
export const ROAD: PathStrip = { from: { x: 3, y: 0 }, to: { x: 3, y: 60 }, width: 4 };
export const PATHS: readonly PathStrip[] = [
  { from: { x: 20, y: 2.6 }, to: { x: 20, y: 8 }, width: 2 },
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
