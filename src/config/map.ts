// Posizioni del mondo (GDD sezione 4): la valle a lotti recintati che si allargano.
// Coordinate del documento: metri, origine nell'angolo sud-ovest, x verso est, y verso nord.
// In Three.js il suolo è il piano XZ: x resta x, il nord è −z.

export const VALLEY = {
  width: 70,
  depth: 80,
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

/** Rettangolo dal centro e dai lati. */
export function rectAt(x: number, y: number, w: number, h: number): Rect {
  return { x0: x - w / 2, y0: y - h / 2, x1: x + w / 2, y1: y + h / 2 };
}

/** Lato di una macchina, verso l'esterno: da qui si allarga l'area d'attivazione (GDD sezione 3). */
export type Side = 'n' | 's' | 'e' | 'w';

/**
 * Contorno di presa o consegna attaccato a una macchina (GDD sezione 3, UX2): il disegno a terra, l'area
 * d'attivazione (il disegno allargato di 0,3 m solo verso l'esterno) e il centro, dove vanno i lavoratori.
 */
export interface Contour extends MapPoint {
  readonly draw: Rect;
  readonly area: Rect;
  readonly side: Side;
}

/** Quanto l'area d'attivazione di un contorno sporge verso l'esterno della macchina, in metri. */
export const CONTOUR_REACH = 0.3;

export function contour(draw: Rect, side: Side): Contour {
  const r = CONTOUR_REACH;
  const area: Rect = {
    x0: draw.x0 - (side === 'w' ? r : 0),
    x1: draw.x1 + (side === 'e' ? r : 0),
    y0: draw.y0 - (side === 's' ? r : 0),
    y1: draw.y1 + (side === 'n' ? r : 0),
  };
  return { x: (draw.x0 + draw.x1) / 2, y: (draw.y0 + draw.y1) / 2, draw, area, side };
}

export type LotId = 'lot1' | 'lot2';

/**
 * I lotti della Fase 1 (GDD sezione 4): terra battuta chiusa da una staccionata. Si cammina solo
 * dentro i lotti aperti; il lotto 2 si apre con lo sblocco "Nuova zona" e confina col primo a est.
 * Il lotto 1 misura 18 × 24 m, come la sala iniziale di Pizza Ready rispetto al personaggio.
 */
export const LOTS: Readonly<Record<LotId, Rect>> = {
  lot1: { x0: 20, y0: 10, x1: 38, y1: 34 },
  lot2: { x0: 38, y0: 10, x1: 50, y1: 34 },
};

/** L'arco con l'insegna PATRÓN sul lato nord del lotto 1, verso l'angolo nord-ovest: sempre in vista. */
export const ARCH = { x: 22.5, y: 34, width: 3.4 } as const;

/** La strada di El Gordo, appena fuori dall'arco, da ovest a est. */
export const ROAD: PathStrip = { from: { x: -40, y: 36.8 }, to: { x: 110, y: 36.8 }, width: 2.6 };

export const VALLEY_CENTER: MapPoint = { x: VALLEY.width / 2, y: VALLEY.depth / 2 };

/** Punto di partenza: dentro la Hacienda, con il regalo a 2,3 m verso nord-est (GDD sezione 4). */
export const PLAYER_SPAWN: MapPoint = { x: 27, y: 17.5 };

/** Il regalo di El Gordo: torre di mazzette alta quanto il personaggio (GDD sezione 5, UX11). */
export const GIFT_SPOT: MapPoint = { x: 28.6, y: 18.6 };

export type FieldId = 'field1' | 'field2' | 'field3';

/**
 * Appezzamenti 4 × 4 m. Si raccoglie camminando tra le piante: l'area è l'appezzamento più 0,2 m.
 * `mat` è il punto dove vanno i lavoratori, sul lato verso il Torchio.
 */
export const FIELD_SIZE = 4;
export const FIELD_REACH = 0.2;
export const FIELD_PLOTS: readonly (MapPoint & { readonly id: FieldId; readonly mat: MapPoint })[] = [
  { id: 'field1', x: 31, y: 23.5, mat: { x: 31, y: 24.6 } },
  { id: 'field2', x: 24.5, y: 23.5, mat: { x: 25.6, y: 24.6 } },
  { id: 'field3', x: 42, y: 23.5, mat: { x: 42, y: 24.6 } },
];

export function fieldArea(f: MapPoint): Rect {
  return rectAt(f.x, f.y, FIELD_SIZE + FIELD_REACH * 2, FIELD_SIZE + FIELD_REACH * 2);
}

/**
 * Torchi 3 × 3 m. La tramoggia guarda il Campo (sud), il ripiano dei Panetti guarda il camion (ovest),
 * il cassone degli Scarti sta a est: sud e ovest sono i lati che la camera vede sempre (GDD sezione 4).
 */
export interface PressLayout {
  readonly id: 'press1' | 'press2';
  readonly x: number;
  readonly y: number;
  readonly deposit: Contour;
  readonly output: Contour;
  readonly scrap: Contour;
}
export const PRESS_SIZE = 3;

function pressAt(id: PressLayout['id'], x: number, y: number): PressLayout {
  const h = PRESS_SIZE / 2;
  const d = 0.9;
  return {
    id,
    x,
    y,
    // La tramoggia lascia libero l'angolo sud-ovest: tra tramoggia e ripiano restano 0,6 m.
    deposit: contour({ x0: x - h + 0.6, y0: y - h - d, x1: x + h, y1: y - h }, 's'),
    output: contour({ x0: x - h - d, y0: y - h, x1: x - h, y1: y + h - 0.6 }, 'w'),
    scrap: contour({ x0: x + h, y0: y - h + 0.6, x1: x + h + d, y1: y + h }, 'e'),
  };
}
export const PRESSES: readonly PressLayout[] = [pressAt('press1', 31, 30.1), pressAt('press2', 42, 30.1)];

/** Falò 1,6 × 1,6 m nel lotto 1, con la consegna sul lato ovest, a 3 m dal cassone degli Scarti. */
export const BONFIRE: MapPoint & { readonly r: number; readonly size: number; readonly mat: Contour } = {
  x: 37,
  y: 26.5,
  r: 0.8,
  size: 1.6,
  mat: contour({ x0: 35.3, y0: 25.7, x1: 36.2, y1: 27.3 }, 'w'),
};

/**
 * Camion di El Gordo: si ferma sulla strada a est dell'arco. Si carica dal contorno dietro la
 * staccionata; le mazzette compaiono sul vassoio accanto (GDD sezione 4).
 */
export const TRUCK = {
  x: 27.5,
  y: 36.8,
  deposit: contour({ x0: 25.5, y0: 33.1, x1: 29.5, y1: 34 }, 's'),
  cash: { x: 30.7, y: 32.8 },
  tray: rectAt(30.7, 32.8, 1.2, 0.8),
} as const;

/** Ufficio: casetta con l'ingresso a ovest e il contorno attaccato alla porta (GDD sezioni 4 e 12). */
export const OFFICE = {
  x: 34.5,
  y: 15,
  w: 3,
  h: 2.5,
  door: contour({ x0: 31, y0: 14, x1: 33, y1: 16 }, 'w'),
} as const;

/** Casetta dei Raccoglitori, decorativa, nell'angolo del lotto 2. */
export const PICKER_HUT: MapPoint = { x: 47, y: 13.5 };

export type UnlockId =
  | 'field1'
  | 'press1'
  | 'field2'
  | 'bonfire'
  | 'office'
  | 'picker1'
  | 'zone2'
  | 'field3'
  | 'picker2'
  | 'press2';

/**
 * Riquadri d'acquisto. Per le stazioni il riquadro è la loro sagoma: ci si ferma sopra l'impronta
 * dell'oggetto futuro, come in Monkey Mart e My Mini Mart (skill arcade-idle, PS11).
 */
export const UNLOCK_PADS: Readonly<Record<UnlockId, MapPoint>> = {
  field1: { x: 31, y: 23.5 },
  press1: { x: 31, y: 30.1 },
  field2: { x: 24.5, y: 23.5 },
  bonfire: { x: 37, y: 26.5 },
  office: { x: OFFICE.x, y: OFFICE.y },
  picker1: { x: 27, y: 14 },
  zone2: { x: 36.8, y: 20 },
  field3: { x: 42, y: 23.5 },
  picker2: { x: 42, y: 15 },
  press2: { x: 42, y: 30.1 },
};

/** Lato minimo di un riquadro d'acquisto: 1,2 altezze del personaggio (UX1). */
export const PAD_SIZE = 2.3;

/** Sagome a terra delle stazioni future: impronta grigia con le parentesi agli angoli. */
export const GHOSTS: Readonly<Partial<Record<UnlockId, { readonly w: number; readonly h: number }>>> = {
  field1: { w: FIELD_SIZE, h: FIELD_SIZE },
  press1: { w: PRESS_SIZE, h: PRESS_SIZE },
  field2: { w: FIELD_SIZE, h: FIELD_SIZE },
  bonfire: { w: BONFIRE.size, h: BONFIRE.size },
  office: { w: OFFICE.w, h: OFFICE.h },
  field3: { w: FIELD_SIZE, h: FIELD_SIZE },
  press2: { w: PRESS_SIZE, h: PRESS_SIZE },
};

/** Area del riquadro d'acquisto: la sua impronta, almeno PAD_SIZE di lato. */
export function padArea(id: UnlockId): Rect {
  const p = UNLOCK_PADS[id];
  const g = GHOSTS[id];
  return rectAt(p.x, p.y, Math.max(PAD_SIZE, g?.w ?? 0), Math.max(PAD_SIZE, g?.h ?? 0));
}

/** Ingombri fissi: nessuno nel lotto 1 all'inizio, le stazioni entrano allo sblocco. */
export const OBSTACLES: readonly Obstacle[] = [];

/** Vero se il punto è dentro il rettangolo, ristretto di `inset` metri. */
export function inRect(p: MapPoint, r: Rect, inset = 0): boolean {
  return p.x >= r.x0 + inset && p.x <= r.x1 - inset && p.y >= r.y0 + inset && p.y <= r.y1 - inset;
}

/** Distanza tra due rettangoli, 0 se si toccano. */
export function rectGap(a: Rect, b: Rect): number {
  const dx = Math.max(0, Math.max(a.x0, b.x0) - Math.min(a.x1, b.x1));
  const dy = Math.max(0, Math.max(a.y0, b.y0) - Math.min(a.y1, b.y1));
  return Math.hypot(dx, dy);
}

/** Converte un punto della mappa del GDD nelle coordinate del suolo di Three.js. */
export function toWorld(p: MapPoint): { x: number; z: number } {
  return { x: p.x, z: -p.y };
}

/** Inverso di toWorld. */
export function fromWorld(x: number, z: number): MapPoint {
  return { x, y: -z };
}
