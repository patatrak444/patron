// Posizioni del mondo (GDD sezione 4): la valle a lotti recintati che si allargano.
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

/** Rettangolo allineato agli assi, dai suoi angoli. */
export interface Rect {
  readonly x0: number;
  readonly y0: number;
  readonly x1: number;
  readonly y1: number;
}

export interface PathStrip {
  readonly from: MapPoint;
  readonly to: MapPoint;
  readonly width: number;
}

export type LotId = 'lot1' | 'lot2';

/**
 * I lotti della Fase 1 (GDD sezione 4): terra battuta chiusa da una staccionata. Si cammina solo
 * dentro i lotti aperti; il lotto 2 si apre con lo sblocco "Nuova zona" e confina col primo a est.
 */
export const LOTS: Readonly<Record<LotId, Rect>> = {
  lot1: { x0: 14, y0: 6, x1: 26, y1: 16 },
  lot2: { x0: 26, y0: 6, x1: 36, y1: 16 },
};

/** L'arco con l'insegna PATRÓN sul lato nord del lotto 1, verso la strada (GDD sezioni 1 e 4). */
export const ARCH = { x: 20, y: 16, width: 3.4 } as const;

/** La strada di El Gordo, appena fuori dall'arco, da ovest a est. */
export const ROAD: PathStrip = { from: { x: -30, y: 18 }, to: { x: 70, y: 18 }, width: 2.6 };

export const VALLEY_CENTER: MapPoint = { x: VALLEY.width / 2, y: VALLEY.depth / 2 };

/** Punto di partenza: dentro la Hacienda, con l'arco e la sagoma del Campo 1 in vista. */
export const PLAYER_SPAWN: MapPoint = { x: 19.6, y: 8.2 };

/** Il regalo di El Gordo: $25 in mazzette a due passi dal giocatore (GDD sezione 5). */
export const GIFT_SPOT: MapPoint = { x: 20.6, y: 9.6 };

export type FieldId = 'field1' | 'field2' | 'field3';

/** Appezzamenti 3 × 3 m: due nel lotto 1, uno nel lotto 2. Il ritiro sta sul lato est. */
export const FIELD_SIZE = 3;
export const FIELD_PLOTS: readonly (MapPoint & { readonly id: FieldId; readonly mat: MapPoint })[] = [
  { id: 'field1', x: 16.2, y: 8.6, mat: { x: 18.4, y: 8.6 } },
  { id: 'field2', x: 16.2, y: 12.6, mat: { x: 18.4, y: 12.6 } },
  { id: 'field3', x: 28.6, y: 8.6, mat: { x: 30.8, y: 8.6 } },
];

/**
 * Presse 2,4 × 2,4 m: le Foglie entrano da ovest (verso i Campi), la Pasta esce a sud, il cassone
 * degli Scarti sta a nord.
 */
export interface PressLayout {
  readonly id: 'press1' | 'press2';
  readonly x: number;
  readonly y: number;
  readonly deposit: MapPoint;
  readonly output: MapPoint;
  readonly scrap: MapPoint;
}
export const PRESS_SIZE = 2.4;
export const PRESSES: readonly PressLayout[] = [
  { id: 'press1', x: 22.2, y: 10.4, deposit: { x: 20.3, y: 10.4 }, output: { x: 22.2, y: 8.4 }, scrap: { x: 22.2, y: 12.4 } },
  { id: 'press2', x: 33.4, y: 10.4, deposit: { x: 31.5, y: 10.4 }, output: { x: 33.4, y: 8.4 }, scrap: { x: 33.4, y: 12.4 } },
];

/** Falò nell'angolo nord-est del lotto 1, con il tappetino a sud. */
export const BONFIRE: MapPoint & { readonly r: number; readonly mat: MapPoint } = { x: 24.8, y: 14.3, r: 0.7, mat: { x: 24.8, y: 12.6 } };

/**
 * Camion di El Gordo: arriva da ovest sulla strada e si ferma davanti all'arco. Si carica dal
 * tappetino appena dentro l'arco; le mazzette compaiono sul tappetino accanto.
 */
export const TRUCK = { x: 20, y: 18.2, deposit: { x: 20, y: 14.9 }, cash: { x: 17.8, y: 14.9 } } as const;

/** Casetta dei Raccoglitori, decorativa, nell'angolo del lotto 2. */
export const PICKER_HUT: MapPoint = { x: 34.6, y: 14.6 };

export type UnlockId = 'field1' | 'press1' | 'field2' | 'bonfire' | 'picker1' | 'zone2' | 'field3' | 'picker2' | 'press2';

/**
 * Tappetini di sblocco. Per le stazioni il tappetino è la loro sagoma: ci si ferma sopra l'impronta
 * dell'oggetto futuro, come in Monkey Mart e My Mini Mart (skill arcade-idle, PS11).
 */
export const UNLOCK_PADS: Readonly<Record<UnlockId, MapPoint>> = {
  field1: { x: 16.2, y: 8.6 },
  press1: { x: 22.2, y: 10.4 },
  field2: { x: 16.2, y: 12.6 },
  bonfire: { x: 24.8, y: 14.3 },
  picker1: { x: 24.6, y: 7.2 },
  zone2: { x: 25.2, y: 9.6 },
  field3: { x: 28.6, y: 8.6 },
  picker2: { x: 27.6, y: 14.4 },
  press2: { x: 33.4, y: 10.4 },
};

/** Sagome a terra delle stazioni future: impronta grigia con le parentesi agli angoli. */
export const GHOSTS: Readonly<Partial<Record<UnlockId, { readonly w: number; readonly h: number }>>> = {
  field1: { w: FIELD_SIZE, h: FIELD_SIZE },
  press1: { w: PRESS_SIZE, h: PRESS_SIZE },
  field2: { w: FIELD_SIZE, h: FIELD_SIZE },
  bonfire: { w: 1.6, h: 1.6 },
  field3: { w: FIELD_SIZE, h: FIELD_SIZE },
  press2: { w: PRESS_SIZE, h: PRESS_SIZE },
};

/** Ingombri fissi: nessuno nel lotto 1 all'inizio, le stazioni entrano allo sblocco. */
export const OBSTACLES: readonly Obstacle[] = [];

/** Vero se il punto è dentro il rettangolo, ristretto di `inset` metri. */
export function inRect(p: MapPoint, r: Rect, inset = 0): boolean {
  return p.x >= r.x0 + inset && p.x <= r.x1 - inset && p.y >= r.y0 + inset && p.y <= r.y1 - inset;
}

/** Converte un punto della mappa del GDD nelle coordinate del suolo di Three.js. */
export function toWorld(p: MapPoint): { x: number; z: number } {
  return { x: p.x, z: -p.y };
}

/** Inverso di toWorld. */
export function fromWorld(x: number, z: number): MapPoint {
  return { x, y: -z };
}
