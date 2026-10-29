// Fase 1 a mano (GDD sezioni 3–6, tappa M2): Campi, Presse con Scarti, Falò, camion di El Gordo
// con il cassone, mazzette a terra, regalo iniziale, tappetini di sblocco, Rispetto e Raccoglitori.
// Logica pura: nessuna dipendenza da Three.js o dal DOM.

import { BALANCE, type Phase1Config, type UnlockDef } from '../config/balance';
import {
  BONFIRE,
  FIELD_MAT_OFFSET,
  FIELD_PLOTS,
  GIFT_SPOT,
  PRESSES,
  TRUCK,
  UNLOCK_PADS,
  type MapPoint,
} from '../config/map';
import type { Bus, GameEvents } from '../core/bus';
import type { Rng } from '../core/rng';
import { findPath, type NavGrid } from './pathfinding';
import { countOf, createStack, isFull, push, take, type Stack } from './stack';

export type UnlockId = UnlockDef['id'];
export type FieldId = 'field1' | 'field2' | 'field3';
export type PressId = 'press1' | 'press2';

export interface FieldState {
  readonly id: FieldId;
  unlocked: boolean;
  /** Foglie pronte da raccogliere. */
  ready: number;
  timer: number;
}

export interface PressState {
  readonly id: PressId;
  unlocked: boolean;
  /** Foglie in ingresso, Paste in uscita, sacchi di Scarti nel cassone. */
  leaves: number;
  pastes: number;
  scraps: number;
  timer: number;
  pastesSinceScrap: number;
}

export interface TruckState {
  load: number;
  capacity: number;
  /** Secondi al ritorno; 0 = il camion è al suo posto. */
  away: number;
}

/** Mucchio di mazzette a terra. Solo il giocatore lo raccoglie (GDD sezione 6). */
export interface CashPile {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  value: number;
}

export type WorkerTask =
  | { readonly kind: 'leaves'; readonly from: FieldId; readonly to: PressId }
  | { readonly kind: 'scrap'; readonly from: PressId };

export type WorkerPhase = 'choose' | 'toSource' | 'loading' | 'toDest' | 'unloading';

export interface WorkerState {
  readonly id: string;
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  facing: number;
  prevFacing: number;
  /** Velocità dell'ultimo passo, per l'animazione. */
  speed: number;
  stack: Stack;
  phase: WorkerPhase;
  task: WorkerTask | null;
  path: MapPoint[];
  /** In attesa di merce o di spazio (icona "zzz" piccola). */
  waiting: boolean;
  /** Addormentato (icona "zzz" grande): riparte quando il giocatore passa vicino (GDD sezione 6). */
  asleep: boolean;
  /** Secondi di lavoro al prossimo sonno. */
  untilSleep: number;
  transferTimer: number;
}

export interface Phase1State {
  cash: number;
  /** Contante guadagnato in tutto. */
  earned: number;
  stack: Stack;
  fields: FieldState[];
  presses: PressState[];
  truck: TruckState;
  piles: CashPile[];
  /** Indice del prossimo sblocco nella sequenza. */
  nextUnlock: number;
  /** Già versato sul tappetino del prossimo sblocco. */
  padPaid: number;
  stars: number;
  level: number;
  workers: WorkerState[];
  /** Tempi di trasferimento del giocatore per zona. */
  zoneTimers: Record<string, number>;
  /** Primi eventi per la frase dell'obiettivo. */
  sold: number;
  burned: number;
  /** Contatore per gli id dei mucchi di mazzette. */
  pileSeq: number;
  /** Vero quando gli ostacoli sono cambiati e la griglia va ricostruita. */
  navDirty: boolean;
}

/** Ciò che una zona fa. Il giocatore le attiva tutte quelle entro il raggio. */
export type ZoneKind =
  | { readonly kind: 'fieldPickup'; readonly field: FieldId }
  | { readonly kind: 'pressDeposit'; readonly press: PressId }
  | { readonly kind: 'pressOutput'; readonly press: PressId }
  | { readonly kind: 'pressScrap'; readonly press: PressId }
  | { readonly kind: 'bonfire' }
  | { readonly kind: 'truck' }
  | { readonly kind: 'cash'; readonly pile: string }
  | { readonly kind: 'pad'; readonly unlock: UnlockId };

export type Zone = ZoneKind & { readonly key: string; readonly x: number; readonly y: number };

const FIELD_IDS: readonly FieldId[] = ['field1', 'field2', 'field3'];

export function fieldMat(id: FieldId): MapPoint {
  const f = FIELD_PLOTS.find((p) => p.id === id)!;
  return { x: f.x, y: f.y - FIELD_MAT_OFFSET };
}

export function createPhase1(cfg: Phase1Config = BALANCE.phase1): Phase1State {
  return {
    cash: 0,
    earned: 0,
    stack: createStack(cfg.stack.capacity),
    fields: FIELD_IDS.map((id) => ({ id, unlocked: id === 'field1', ready: 0, timer: 0 })),
    presses: PRESSES.map((p) => ({ id: p.id, unlocked: p.id === 'press1', leaves: 0, pastes: 0, scraps: 0, timer: 0, pastesSinceScrap: 0 })),
    truck: { load: 0, capacity: cfg.truck.capacity, away: 0 },
    piles: [{ id: 'gift', x: GIFT_SPOT.x, y: GIFT_SPOT.y, value: cfg.gift }],
    nextUnlock: 0,
    padPaid: 0,
    stars: 0,
    level: 1,
    workers: [],
    zoneTimers: {},
    sold: 0,
    burned: 0,
    pileSeq: 0,
    navDirty: false,
  };
}

/** Il prossimo sblocco della sequenza, o null se la Fase 1 di M2 è finita. */
export function nextUnlockDef(s: Phase1State, cfg: Phase1Config = BALANCE.phase1): UnlockDef | null {
  return cfg.unlocks[s.nextUnlock] ?? null;
}

export function isUnlocked(s: Phase1State, id: UnlockId, cfg: Phase1Config = BALANCE.phase1): boolean {
  const i = cfg.unlocks.findIndex((u) => u.id === id);
  return i >= 0 && i < s.nextUnlock;
}

/** Tutte le zone attive in questo momento, con la loro posizione. */
export function activeZones(s: Phase1State, cfg: Phase1Config = BALANCE.phase1): Zone[] {
  const out: Zone[] = [];
  for (const f of s.fields) {
    if (!f.unlocked) continue;
    const m = fieldMat(f.id);
    out.push({ kind: 'fieldPickup', field: f.id, key: `pick:${f.id}`, ...m });
  }
  for (const p of s.presses) {
    if (!p.unlocked) continue;
    const l = PRESSES.find((x) => x.id === p.id)!;
    out.push({ kind: 'pressDeposit', press: p.id, key: `in:${p.id}`, ...l.deposit });
    out.push({ kind: 'pressOutput', press: p.id, key: `out:${p.id}`, ...l.output });
    out.push({ kind: 'pressScrap', press: p.id, key: `scrap:${p.id}`, ...l.scrap });
  }
  out.push({ kind: 'bonfire', key: 'bonfire', ...BONFIRE.mat });
  out.push({ kind: 'truck', key: 'truck', ...TRUCK.deposit });
  for (const pile of s.piles) out.push({ kind: 'cash', pile: pile.id, key: `cash:${pile.id}`, x: pile.x, y: pile.y });
  const next = nextUnlockDef(s, cfg);
  if (next) out.push({ kind: 'pad', unlock: next.id, key: `pad:${next.id}`, ...UNLOCK_PADS[next.id] });
  return out;
}

// --- Stazioni ---------------------------------------------------------------------------------

function stepStations(s: Phase1State, dt: number, cfg: Phase1Config, bus: Bus<GameEvents>): void {
  for (const f of s.fields) {
    if (!f.unlocked) continue;
    if (f.ready >= cfg.field.outCap) {
      f.timer = 0;
      continue;
    }
    f.timer += dt;
    while (f.timer >= cfg.field.cycle && f.ready < cfg.field.outCap) {
      f.timer -= cfg.field.cycle;
      f.ready++;
    }
  }
  for (const p of s.presses) {
    if (!p.unlocked) continue;
    if (!pressCanWork(p, cfg)) {
      p.timer = 0;
      continue;
    }
    p.timer += dt;
    if (p.timer >= cfg.press.cycle) {
      p.timer = 0;
      p.leaves -= cfg.press.leavesPerPaste;
      p.pastes++;
      p.pastesSinceScrap++;
      if (p.pastesSinceScrap >= cfg.press.pastesPerScrap) {
        p.pastesSinceScrap = 0;
        p.scraps++;
      }
      bus.emit('press:paste', { press: p.id });
    }
  }
  const t = s.truck;
  if (t.away > 0) {
    t.away = Math.max(0, t.away - dt);
    if (t.away === 0) {
      t.load = 0;
      bus.emit('truck:return', {});
    }
  }
}

/** La Pressa lavora se ha Foglie, spazio in uscita e il cassone degli Scarti non è pieno. */
export function pressCanWork(p: PressState, cfg: Phase1Config = BALANCE.phase1): boolean {
  return p.leaves >= cfg.press.leavesPerPaste && p.pastes < cfg.press.outCap && p.scraps < cfg.press.scrapCap;
}

/** Ferma per cassone pieno: icona di stop (GDD sezione 4). */
export function pressBlocked(p: PressState, cfg: Phase1Config = BALANCE.phase1): boolean {
  return p.unlocked && (p.scraps >= cfg.press.scrapCap || p.pastes >= cfg.press.outCap);
}

// --- Trasferimenti -----------------------------------------------------------------------------

/** Un trasferimento dalla zona alla pila (o viceversa). Vero se è avvenuto. */
function transferOnce(s: Phase1State, z: Zone, stack: Stack, cfg: Phase1Config, bus: Bus<GameEvents>): boolean {
  switch (z.kind) {
    case 'fieldPickup': {
      const f = s.fields.find((x) => x.id === z.field)!;
      if (f.ready <= 0 || isFull(stack)) return false;
      f.ready--;
      push(stack, 'leaf');
      return true;
    }
    case 'pressDeposit': {
      const p = s.presses.find((x) => x.id === z.press)!;
      if (p.leaves >= cfg.press.inCap || !take(stack, 'leaf')) return false;
      p.leaves++;
      return true;
    }
    case 'pressOutput': {
      const p = s.presses.find((x) => x.id === z.press)!;
      if (p.pastes <= 0 || isFull(stack)) return false;
      p.pastes--;
      push(stack, 'paste');
      return true;
    }
    case 'pressScrap': {
      const p = s.presses.find((x) => x.id === z.press)!;
      if (p.scraps <= 0 || isFull(stack)) return false;
      p.scraps--;
      push(stack, 'scrap');
      return true;
    }
    case 'bonfire': {
      if (!take(stack, 'scrap')) return false;
      s.burned++;
      bus.emit('bonfire:burn', {});
      return true;
    }
    case 'truck': {
      const t = s.truck;
      if (t.away > 0 || t.load >= t.capacity || !take(stack, 'paste')) return false;
      t.load++;
      addToPile(s, 'truck', TRUCK.cash, cfg.truck.pastePrice);
      s.sold++;
      bus.emit('truck:sale', { amount: cfg.truck.pastePrice });
      if (t.load >= t.capacity) {
        t.away = cfg.truck.awaySeconds;
        bus.emit('truck:depart', {});
      }
      return true;
    }
    default:
      return false;
  }
}

function addToPile(s: Phase1State, id: string, at: MapPoint, value: number): void {
  const pile = s.piles.find((p) => p.id === id);
  if (pile) pile.value += value;
  else s.piles.push({ id, x: at.x, y: at.y, value });
}

function dist(a: MapPoint, b: MapPoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function stepPlayerZones(s: Phase1State, pos: MapPoint, dt: number, cfg: Phase1Config, bus: Bus<GameEvents>): void {
  const r = cfg.stack.zoneRadius;
  const seen = new Set<string>();
  for (const z of activeZones(s, cfg)) {
    if (dist(pos, z) > r) continue;
    seen.add(z.key);
    if (z.kind === 'cash') {
      collectCash(s, z.pile, dt, cfg, bus);
      continue;
    }
    if (z.kind === 'pad') {
      payPad(s, z.unlock, dt, cfg, bus);
      continue;
    }
    // Un oggetto ogni transferInterval finché resti sulla zona e c'è qualcosa da spostare.
    let t = (s.zoneTimers[z.key] ?? cfg.stack.transferInterval) + dt;
    while (t >= cfg.stack.transferInterval) {
      if (!transferOnce(s, z, s.stack, cfg, bus)) {
        t = cfg.stack.transferInterval;
        break;
      }
      t -= cfg.stack.transferInterval;
    }
    s.zoneTimers[z.key] = t;
  }
  // Uscendo da una zona il prossimo trasferimento torna immediato.
  for (const k of Object.keys(s.zoneTimers)) if (!seen.has(k)) delete s.zoneTimers[k];
}

function collectCash(s: Phase1State, id: string, dt: number, cfg: Phase1Config, bus: Bus<GameEvents>): void {
  const i = s.piles.findIndex((p) => p.id === id);
  if (i < 0) return;
  const pile = s.piles[i]!;
  // Il mucchio si svuota in circa mezzo secondo, qualunque sia il valore, a pezzi di almeno $5.
  const steps = Math.max(1, Math.round(cfg.stack.cashCollectSeconds / dt));
  const amount = Math.min(pile.value, Math.max(5, Math.ceil(pile.value / steps)));
  pile.value -= amount;
  s.cash += amount;
  s.earned += id === 'gift' ? 0 : amount;
  bus.emit('cash:collect', { amount, pile: id });
  if (pile.value <= 0) s.piles.splice(i, 1);
}

function payPad(s: Phase1State, id: UnlockId, dt: number, cfg: Phase1Config, bus: Bus<GameEvents>): void {
  const def = nextUnlockDef(s, cfg);
  if (!def || def.id !== id || s.cash <= 0) return;
  // Il pagamento dura unlockPaySeconds qualunque sia il prezzo; il versato resta se esci a metà.
  const rate = Math.max(1, Math.ceil((def.cost * dt) / cfg.stack.unlockPaySeconds));
  const pay = Math.min(s.cash, def.cost - s.padPaid, rate);
  s.cash -= pay;
  s.padPaid += pay;
  if (s.padPaid >= def.cost) applyUnlock(s, def, cfg, bus);
}

function applyUnlock(s: Phase1State, def: UnlockDef, cfg: Phase1Config, bus: Bus<GameEvents>): void {
  s.nextUnlock++;
  s.padPaid = 0;
  const pad = UNLOCK_PADS[def.id];
  if (def.kind === 'field') {
    s.fields.find((f) => f.id === def.id)!.unlocked = true;
    s.navDirty = true;
  } else if (def.kind === 'press') {
    s.presses.find((p) => p.id === def.id)!.unlocked = true;
    s.navDirty = true;
  } else {
    s.workers.push(createWorker(def.id, pad, cfg));
  }
  bus.emit('unlock', { id: def.id });
  addStars(s, cfg.respect.starsPerUnlock, pad, cfg, bus);
}

// --- Rispetto ----------------------------------------------------------------------------------

/** Livello di Rispetto per un totale di stelle (soglie cumulative, GDD sezione 5). */
export function levelFor(stars: number, cfg: Phase1Config = BALANCE.phase1): number {
  let level = 1;
  for (const t of cfg.respect.thresholds) if (stars >= t) level++;
  return level;
}

/** Stelle del livello attuale e soglia del prossimo, per la barra "n/max". */
export function levelProgress(stars: number, cfg: Phase1Config = BALANCE.phase1): { stars: number; next: number | null } {
  const level = levelFor(stars, cfg);
  return { stars, next: cfg.respect.thresholds[level - 1] ?? null };
}

export function addStars(s: Phase1State, n: number, at: MapPoint, cfg: Phase1Config, bus: Bus<GameEvents>): void {
  s.stars += n;
  const level = levelFor(s.stars, cfg);
  while (s.level < level) {
    s.level++;
    // Pioggia di mazzette: un mucchio accanto a dove è successo, da raccogliere.
    s.pileSeq++;
    addToPile(s, `reward${s.pileSeq}`, { x: at.x + 1.4, y: at.y + 0.6 }, cfg.respect.rewardPerLevel * s.level);
    bus.emit('respect:level', { level: s.level });
  }
}

// --- Raccoglitori ------------------------------------------------------------------------------

function createWorker(id: string, at: MapPoint, cfg: Phase1Config): WorkerState {
  return {
    id,
    x: at.x,
    y: at.y,
    prevX: at.x,
    prevY: at.y,
    facing: (-3 * Math.PI) / 4,
    prevFacing: (-3 * Math.PI) / 4,
    speed: 0,
    stack: createStack(cfg.picker.capacity),
    phase: 'choose',
    task: null,
    path: [],
    waiting: false,
    asleep: false,
    // Il primo sonno arriva dopo l'intervallo massimo: il giocatore vede prima il lavoratore lavorare.
    untilSleep: cfg.picker.sleepEvery[1],
    transferTimer: 0,
  };
}

function chooseTask(s: Phase1State, w: WorkerState, cfg: Phase1Config): WorkerTask | null {
  const busy = (pred: (t: WorkerTask) => boolean): boolean => s.workers.some((o) => o !== w && o.task && pred(o.task));
  // Prima gli Scarti, se un cassone è pieno almeno per metà e nessun altro ci sta già andando.
  for (const p of s.presses) {
    if (!p.unlocked) continue;
    if (p.scraps >= cfg.press.scrapCap * cfg.picker.scrapPriority && !busy((t) => t.kind === 'scrap' && t.from === p.id)) {
      return { kind: 'scrap', from: p.id };
    }
  }
  const fields = s.fields.filter((f) => f.unlocked).sort((a, b) => b.ready - a.ready);
  const presses = s.presses.filter((p) => p.unlocked).sort((a, b) => a.leaves - b.leaves);
  if (fields.length === 0 || presses.length === 0) return null;
  return { kind: 'leaves', from: fields[0]!.id, to: presses[0]!.id };
}

function sourcePoint(t: WorkerTask): MapPoint {
  return t.kind === 'leaves' ? fieldMat(t.from) : PRESSES.find((p) => p.id === t.from)!.scrap;
}

function destPoint(t: WorkerTask): MapPoint {
  return t.kind === 'leaves' ? PRESSES.find((p) => p.id === t.to)!.deposit : BONFIRE.mat;
}

function walk(w: WorkerState, dt: number, speed: number): boolean {
  let budget = speed * dt;
  while (budget > 0 && w.path.length > 0) {
    const next = w.path[0]!;
    const d = Math.hypot(next.x - w.x, next.y - w.y);
    if (d <= budget) {
      w.x = next.x;
      w.y = next.y;
      budget -= d;
      w.path.shift();
    } else {
      w.facing = Math.atan2(next.y - w.y, next.x - w.x);
      w.x += ((next.x - w.x) / d) * budget;
      w.y += ((next.y - w.y) / d) * budget;
      budget = 0;
    }
  }
  return w.path.length === 0;
}

function stepWorker(
  s: Phase1State,
  w: WorkerState,
  player: MapPoint,
  dt: number,
  cfg: Phase1Config,
  grid: NavGrid,
  rng: Rng,
  bus: Bus<GameEvents>,
): void {
  w.prevX = w.x;
  w.prevY = w.y;
  w.prevFacing = w.facing;
  w.speed = 0;
  const wc = cfg.picker;

  if (w.asleep) {
    if (dist(w, player) <= wc.wakeRadius) {
      w.asleep = false;
      w.untilSleep = wc.sleepEvery[0] + rng.next() * (wc.sleepEvery[1] - wc.sleepEvery[0]);
      bus.emit('worker:wake', { id: w.id });
    }
    return;
  }
  w.untilSleep -= dt;
  if (w.untilSleep <= 0) {
    w.asleep = true;
    w.waiting = false;
    bus.emit('worker:sleep', { id: w.id });
    return;
  }

  w.waiting = false;
  switch (w.phase) {
    case 'choose': {
      w.task = chooseTask(s, w, cfg);
      if (!w.task) {
        w.waiting = true;
        return;
      }
      w.path = findPath(grid, w, sourcePoint(w.task)).points;
      w.phase = 'toSource';
      return;
    }
    case 'toSource':
    case 'toDest': {
      const before = { x: w.x, y: w.y };
      const arrived = walk(w, dt, wc.speed);
      w.speed = dist(before, w) / dt;
      if (arrived) {
        w.phase = w.phase === 'toSource' ? 'loading' : 'unloading';
        w.transferTimer = 0;
      }
      return;
    }
    case 'loading':
    case 'unloading': {
      const task = w.task!;
      w.transferTimer += dt;
      if (w.transferTimer < cfg.stack.transferInterval) return;
      w.transferTimer = 0;
      if (w.phase === 'loading') {
        const moved = !isFull(w.stack) && loadOnce(s, task, w.stack);
        const carrying = w.stack.items.length;
        if (isFull(w.stack) || (!moved && carrying > 0)) {
          w.path = findPath(grid, w, destPoint(task)).points;
          w.phase = 'toDest';
        } else if (!moved) {
          // Sorgente vuota e mani vuote: aspetta lì (GDD sezione 6, punto 3).
          w.waiting = true;
          if (task.kind === 'leaves') {
            // Se un altro Campo ha Foglie pronte, cambia sorgente.
            const better = chooseTask(s, w, cfg);
            if (better && (better.kind === 'scrap' || better.from !== task.from)) w.phase = 'choose';
          }
        }
      } else {
        const moved = unloadOnce(s, task, w.stack, cfg, bus);
        if (w.stack.items.length === 0) {
          w.task = null;
          w.phase = 'choose';
        } else if (!moved) {
          w.waiting = true;
        }
      }
      return;
    }
  }
}

function loadOnce(s: Phase1State, t: WorkerTask, stack: Stack): boolean {
  if (t.kind === 'leaves') {
    const f = s.fields.find((x) => x.id === t.from)!;
    if (f.ready <= 0) return false;
    f.ready--;
    return push(stack, 'leaf');
  }
  const p = s.presses.find((x) => x.id === t.from)!;
  if (p.scraps <= 0) return false;
  p.scraps--;
  return push(stack, 'scrap');
}

function unloadOnce(s: Phase1State, t: WorkerTask, stack: Stack, cfg: Phase1Config, bus: Bus<GameEvents>): boolean {
  if (t.kind === 'leaves') {
    const p = s.presses.find((x) => x.id === t.to)!;
    if (p.leaves >= cfg.press.inCap || !take(stack, 'leaf')) return false;
    p.leaves++;
    return true;
  }
  if (!take(stack, 'scrap')) return false;
  s.burned++;
  bus.emit('bonfire:burn', {});
  return true;
}

// --- Passo ---------------------------------------------------------------------------------------

export interface Phase1StepContext {
  readonly grid: NavGrid;
  readonly rng: Rng;
  readonly cfg?: Phase1Config;
}

export function stepPhase1(s: Phase1State, player: MapPoint, dt: number, bus: Bus<GameEvents>, ctx: Phase1StepContext): void {
  const cfg = ctx.cfg ?? BALANCE.phase1;
  stepStations(s, dt, cfg, bus);
  stepPlayerZones(s, player, dt, cfg, bus);
  for (const w of s.workers) stepWorker(s, w, player, dt, cfg, ctx.grid, ctx.rng, bus);
}

// --- Obiettivo -----------------------------------------------------------------------------------

export interface Objective {
  /** Frase di 4 parole al massimo (GDD sezione 8). */
  readonly text: string;
  /** Dove punta la freccia, o null. */
  readonly target: MapPoint | null;
}

/**
 * Il prossimo passo per il giocatore, come la frase in alto di Pizza Ready ("Create a table!").
 * Prima il copione dei primi minuti (sezione 8), poi la sequenza degli sblocchi.
 */
export function objective(s: Phase1State, cfg: Phase1Config = BALANCE.phase1): Objective {
  const gift = s.piles.find((p) => p.id === 'gift');
  if (gift) return { text: 'Raccogli i soldi!', target: gift };
  const next = nextUnlockDef(s, cfg);
  const press1 = PRESSES[0]!;
  // Il primo sblocco si compra subito con il regalo.
  if (next && s.nextUnlock === 0 && s.cash + s.padPaid >= next.cost) {
    return { text: `Compra ${next.label}!`, target: UNLOCK_PADS[next.id] };
  }
  // Mazzette a terra: vanno raccolte.
  const pile = s.piles.find((p) => p.value > 0);
  if (pile && s.sold > 0 && s.earned === 0) return { text: 'Prendi i soldi!', target: pile };
  // Cassone degli Scarti pieno: la Pressa è ferma.
  const full = s.presses.find((p) => p.unlocked && p.scraps >= cfg.press.scrapCap);
  if (countOf(s.stack, 'scrap') > 0) return { text: 'Brucia gli scarti!', target: BONFIRE.mat };
  if (full) return { text: 'Brucia gli scarti!', target: PRESSES.find((p) => p.id === full.id)!.scrap };
  const sleeper = s.workers.find((w) => w.asleep);
  if (sleeper) return { text: 'Sveglia il raccoglitore!', target: sleeper };
  // Copione della prima vendita: Campo → Pressa → camion.
  if (s.sold === 0) {
    if (countOf(s.stack, 'paste') > 0) return { text: 'Vendi a El Gordo!', target: TRUCK.deposit };
    if (s.presses.some((p) => p.pastes > 0)) return { text: 'Prendi la Pasta!', target: press1.output };
    if (countOf(s.stack, 'leaf') > 0) return { text: 'Porta le foglie qui!', target: press1.deposit };
    return { text: 'Raccogli le foglie!', target: fieldMat('field1') };
  }
  if (next) return { text: next.kind === 'worker' ? 'Assumi un raccoglitore!' : `Compra ${next.label}!`, target: UNLOCK_PADS[next.id] };
  return { text: 'Fase 1 completata!', target: null };
}
