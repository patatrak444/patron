// Disegno della Fase 1 (tappa M2): legge lo stato della logica e lo mostra. Nessuna regola di gioco
// vive qui: solo posizioni, animazioni e scritte (GDD sezioni 4, 9, 10 e 12).

import * as THREE from 'three';
import { BALANCE } from '../config/balance';
import { FIELD_PLOTS, GHOSTS, PRESSES, TRUCK, UNLOCK_PADS, toWorld, type MapPoint, type UnlockId } from '../config/map';
import type { Bus, GameEvents } from '../core/bus';
import { activeZones, nextUnlockDef, objective, pressBlocked, pressCanWork, type Phase1State, type WorkerState } from '../sim/phase1';
import type { Assets, CharacterId } from './assets';
import { addMoneyPile, ITEM_HEIGHT, ITEM_SCALE as S, ItemBatch, type VisualItem } from './items';
import { Label } from './labels';
import type { Valley } from './map';
import { Confetti, Dust } from './effects';
import { Character } from './models/character';
import { GoalArrow, UnlockPad, ZoneMats, type PadIcon } from './zones';

const cfg = BALANCE.phase1;
const feel = BALANCE.feel;
/** Metri percorsi dal camion fuori scena, lungo la strada. */
const TRUCK_RUN = 40;
/** Cappello di paglia dei Raccoglitori (GDD sezione 6). */
const STRAW = 0xe8c86a;
const WORKER_MODELS: readonly CharacterId[] = ['mini_male_b', 'mini_male_d', 'mini_female_b', 'mini_male_e'];

/** Posa del giocatore interpolata, passata dal ciclo principale. */
export interface Pose {
  readonly x: number;
  readonly z: number;
  /** Rotazione del modello attorno alla verticale. */
  readonly rotY: number;
  readonly vx: number;
  readonly vz: number;
}

/** Pila tra le braccia con un ritardo a molla: in curva ondeggia (GDD sezione 10). */
class StackSway {
  private sx = 0;
  private sz = 0;
  update(vx: number, vz: number, dt: number): { x: number; z: number } {
    const k = 1 - Math.exp(-dt * 10);
    this.sx += (-vx * 0.035 - this.sx) * k;
    this.sz += (-vz * 0.035 - this.sz) * k;
    return { x: this.sx, z: this.sz };
  }
}

function drawStack(batch: ItemBatch, items: readonly VisualItem[], pose: Pose, sway: { x: number; z: number }, front = 0.62, base = 0.9): void {
  // Davanti al petto, tra le braccia: +z locale del modello.
  const bx = pose.x + Math.sin(pose.rotY) * front;
  const bz = pose.z + Math.cos(pose.rotY) * front;
  let y = base;
  items.forEach((kind, i) => {
    const f = (i + 1) / Math.max(4, items.length);
    batch.add(kind, bx + sway.x * f * i, y, bz + sway.z * f * i, pose.rotY + Math.PI / 2);
    y += ITEM_HEIGHT[kind];
  });
}

/** Mazzetta in volo: dal mucchio alla schiena o dalla schiena al tappetino (skill arcade-idle, PS16). */
interface Flight {
  readonly from: THREE.Vector3;
  readonly to: () => THREE.Vector3;
  t: number;
  readonly delay: number;
}

/** Ingresso a rimbalzo: cresce dal basso, supera un poco e si assesta (GDD sezione 10). */
function pop(k: number): number {
  return k < 1 ? 0.2 + 0.8 * k + 0.25 * Math.sin(k * Math.PI) : 1;
}

interface WorkerView {
  readonly character: Character;
  readonly zzz: Label;
  readonly sway: StackSway;
}

export class Phase1View {
  readonly root = new THREE.Group();
  private readonly batch = new ItemBatch();
  private readonly mats = new ZoneMats();
  private readonly pad = new UnlockPad();
  private readonly arrow = new GoalArrow();
  private readonly playerSway = new StackSway();
  private readonly workers = new Map<string, WorkerView>();
  private readonly fieldLabels = new Map<string, Label>();
  private readonly pressOut = new Map<string, Label>();
  private readonly pressScrap = new Map<string, Label>();
  private readonly pressStop = new Map<string, Label>();
  private readonly truckLabel = new Label(0.7);
  private readonly truckTimer = new Label(0.7);
  /** Animazioni a tempo: aree che si aprono, stazioni che compaiono, fiammate. */
  private readonly tweens: { t: number; dur: number; apply: (k: number) => void }[] = [];
  private readonly confetti = new Confetti();
  private readonly dust = new Dust();
  private readonly flights: Flight[] = [];
  private flare = 0;
  private time = 0;
  private festa: { x: number; z: number; until: number } | null = null;
  private dustTimer = 0;
  private payTimer = 0;
  private lastPaid = 0;
  private readonly pilePos = new Map<string, { x: number; z: number }>();
  private readonly backTop = new THREE.Vector3();

  constructor(
    private readonly valley: Valley,
    private readonly assets: Assets,
    bus: Bus<GameEvents>,
  ) {
    this.root.name = 'fase 1';
    this.root.add(this.batch.root, this.mats.root, this.pad.root, this.arrow.root, this.confetti.mesh, this.dust.mesh);
    for (const f of FIELD_PLOTS) {
      const l = new Label();
      const w = toWorld({ x: f.x, y: f.y });
      l.sprite.position.set(w.x, 1.5, w.z);
      this.fieldLabels.set(f.id, l);
      this.root.add(l.sprite);
    }
    for (const p of PRESSES) {
      const out = new Label();
      const scrap = new Label();
      const stop = new Label(0.8);
      const o = toWorld(p.output);
      out.sprite.position.set(o.x, 1.55, o.z + 0.4);
      const s = toWorld(p.scrap);
      scrap.sprite.position.set(s.x + 0.25, 1.15, s.z);
      const c = toWorld(p);
      stop.sprite.position.set(c.x, 4.0, c.z);
      this.pressOut.set(p.id, out);
      this.pressScrap.set(p.id, scrap);
      this.pressStop.set(p.id, stop);
      this.root.add(out.sprite, scrap.sprite, stop.sprite);
    }
    const t = toWorld(TRUCK);
    this.truckLabel.sprite.position.set(t.x, 3.1, t.z);
    this.truckTimer.sprite.position.set(t.x, 0.6, t.z);
    this.root.add(this.truckLabel.sprite, this.truckTimer.sprite);

    bus.on('unlock', ({ id }) => this.onUnlock(id as UnlockId));
    bus.on('truck:arriving', () => (this.valley.truck.visible = true));
    bus.on('cash:collect', ({ amount, pile }) => {
      const at = this.pilePos.get(pile);
      if (!at) return;
      const n = Math.min(10, Math.max(2, Math.ceil(amount / feel.dollarsPerBundle)));
      for (let i = 0; i < n; i++) this.flights.push({ from: new THREE.Vector3(at.x, 0.2 + i * 0.05, at.z), to: () => this.backTop, t: 0, delay: i * 0.04 });
    });
    bus.on('bonfire:burn', () => (this.flare = 1));
    bus.on('press:paste', ({ press }) => {
      const sign = this.valley.presses[press]?.getObjectByName('pressPlate');
      if (sign) this.tween(0.25, (k) => sign.scale.setScalar(1 + 0.25 * Math.sin(k * Math.PI)));
    });
  }

  private tween(dur: number, apply: (k: number) => void): void {
    this.tweens.push({ t: 0, dur, apply });
  }

  private appear(obj: THREE.Object3D, delay = 0): void {
    obj.visible = true;
    obj.scale.setScalar(0.001);
    this.tween(0.45 + delay, (k) => {
      const kk = Math.max(0, (k * (0.45 + delay) - delay) / 0.45);
      obj.scale.setScalar(Math.max(0.001, pop(kk)));
    });
  }

  /** Festa dello sblocco: primo piano, coriandoli e l'oggetto che salta fuori (skill arcade-idle, PS13). */
  private onUnlock(id: UnlockId): void {
    const at = toWorld(UNLOCK_PADS[id]);
    this.festa = { x: at.x, z: at.z, until: this.time + feel.festaSeconds };
    this.confetti.burst(at.x, at.z);
    const v = this.valley;
    if (v.plants[id]) {
      this.appear(v.soils[id]!);
      this.appear(v.plants[id]!, 0.15);
    }
    if (v.presses[id]) this.appear(v.presses[id]!);
    if (id === 'bonfire') this.appear(v.bonfire);
    if (id === 'zone2') this.openLot2(true);
  }

  /** Il lotto 2 si srotola da ovest; la staccionata in comune sparisce, quella nuova sale. */
  private openLot2(animate: boolean): void {
    const v = this.valley;
    const l2 = v.lots.lot2;
    v.lots.lot1.fences.e.visible = false;
    l2.floor.visible = true;
    v.hut.visible = true;
    const sides = [l2.fences.n, l2.fences.s, l2.fences.e];
    for (const f of sides) f.visible = true;
    if (!animate) return;
    const w = l2.floor.position.x;
    const half = 5;
    this.tween(0.6, (k) => {
      const e = 1 - (1 - k) * (1 - k);
      l2.floor.scale.x = Math.max(0.001, e);
      l2.floor.position.x = w - half * (1 - e);
    });
    sides.forEach((f) => {
      f.scale.y = 0.001;
      this.tween(0.9, (k) => (f.scale.y = Math.max(0.001, pop(Math.max(0, (k - 0.5) / 0.5)))));
    });
    this.appear(v.hut, 0.4);
  }

  /** Punto da inquadrare da vicino durante la festa, o null. */
  festaFocus(): { x: number; z: number } | null {
    return this.festa && this.time < this.festa.until ? this.festa : null;
  }

  /** Allinea il disegno a uno stato caricato o preparato (debug, screenshot). */
  syncUnlocked(s: Phase1State): void {
    const v = this.valley;
    this.festa = null;
    for (const f of s.fields) {
      v.plants[f.id]!.visible = f.unlocked;
      v.soils[f.id]!.visible = f.unlocked;
    }
    for (const p of s.presses) v.presses[p.id]!.visible = p.unlocked;
    v.bonfire.visible = s.bonfire;
    v.truck.visible = s.truck.arrived;
    if (s.lots.includes('lot2')) this.openLot2(false);
    for (const o of [...Object.values(v.plants), ...Object.values(v.soils), ...Object.values(v.presses), v.bonfire, v.hut]) o.scale.setScalar(1);
    this.lastPaid = s.padPaid;
  }

  private workerView(w: WorkerState, index: number): WorkerView {
    let v = this.workers.get(w.id);
    if (!v) {
      const model = WORKER_MODELS[index % WORKER_MODELS.length]!;
      const character = new Character(this.assets.characters[model], { cap: STRAW });
      const zzz = new Label(0.5);
      this.root.add(character.root, zzz.sprite);
      v = { character, zzz, sway: new StackSway() };
      this.workers.set(w.id, v);
      // Il nuovo assunto entra con un rimbalzo.
      this.tween(0.4, (k) => character.root.scale.setScalar(k < 1 ? 0.3 + 0.7 * k + 0.2 * Math.sin(k * Math.PI) : 1));
    }
    return v;
  }

  update(s: Phase1State, player: Pose, playerItems: readonly VisualItem[], alpha: number, dt: number, simTime: number): void {
    this.time += dt;
    for (let i = this.tweens.length - 1; i >= 0; i--) {
      const tw = this.tweens[i]!;
      tw.t += dt;
      const k = Math.min(1, tw.t / tw.dur);
      tw.apply(k);
      if (k >= 1) this.tweens.splice(i, 1);
    }

    this.batch.begin();
    this.mats.begin();

    // Pila del giocatore: merce tra le braccia, mazzette sulla schiena (GDD sezione 4, «Le mazzette addosso»).
    const sway = this.playerSway.update(player.vx, player.vz, dt);
    drawStack(this.batch, playerItems, player, sway);
    const bundles = Math.min(feel.maxBackBundles, Math.ceil(s.cash / feel.dollarsPerBundle));
    const bx = player.x - Math.sin(player.rotY) * 0.4;
    const bz = player.z - Math.cos(player.rotY) * 0.4;
    for (let i = 0; i < bundles; i++) {
      const f = (i + 1) / Math.max(6, bundles);
      this.batch.add('money', bx + sway.x * f * i * 0.6, 0.95 + i * ITEM_HEIGHT.money, bz + sway.z * f * i * 0.6, player.rotY);
    }
    this.backTop.set(bx, 0.95 + bundles * ITEM_HEIGHT.money, bz);
    // Sbuffi di polvere mentre si corre (skill arcade-idle, PS19).
    this.dustTimer -= dt;
    if (Math.hypot(player.vx, player.vz) > 1 && this.dustTimer <= 0) {
      this.dustTimer = feel.dustEvery;
      this.dust.puff(player.x - Math.sin(player.rotY) * 0.25, player.z - Math.cos(player.rotY) * 0.25);
    }
    this.dust.update(dt);
    this.confetti.update(dt);

    // Tappetini delle zone.
    for (const z of activeZones(s)) {
      const w = toWorld(z);
      if (z.kind === 'fieldPickup' || z.kind === 'pressOutput' || z.kind === 'pressScrap') this.mats.add('pickup', w.x, w.z);
      else if (z.kind === 'pressDeposit' || z.kind === 'bonfire' || z.kind === 'truck') this.mats.add('deposit', w.x, w.z);
      else if (z.kind === 'cash' && z.pile === 'truck') this.mats.add('cash', w.x, w.z);
    }
    if (!s.piles.some((p) => p.id === 'truck')) {
      const w = toWorld(TRUCK.cash);
      this.mats.add('cash', w.x, w.z);
    }

    // Campi: le piante crescono con le Foglie pronte; contatore "n/8", MAX quando è pieno.
    for (const f of s.fields) {
      const g = this.valley.plants[f.id]!;
      const label = this.fieldLabels.get(f.id)!;
      if (!f.unlocked) {
        label.set(null);
        continue;
      }
      const grow = 0.55 + 0.45 * (f.ready / cfg.field.outCap);
      for (const c of g.children) c.scale.y = grow;
      label.set(f.ready >= cfg.field.outCap ? 'MAX' : `${f.ready}/${cfg.field.outCap}`, f.ready >= cfg.field.outCap ? 'max' : 'pill');
    }

    // Presse: pistone che lavora, Foglie nella tramoggia, Paste sul ripiano, Scarti nel cassone.
    for (const p of s.presses) {
      const l = PRESSES.find((x) => x.id === p.id)!;
      const g = this.valley.presses[p.id]!;
      const out = this.pressOut.get(p.id)!;
      const scrap = this.pressScrap.get(p.id)!;
      const stop = this.pressStop.get(p.id)!;
      if (!p.unlocked) {
        out.set(null);
        scrap.set(null);
        stop.set(null);
        continue;
      }
      const c = toWorld(l);
      const plate = g.getObjectByName('pressPlate');
      if (plate) {
        const working = pressCanWork(p);
        const phase = (p.timer / cfg.press.cycle) * Math.PI * 2;
        plate.position.y = working ? 1.1 - 0.26 * (0.5 - 0.5 * Math.cos(phase)) : 1.1;
      }
      for (let i = 0; i < Math.min(p.leaves, 6); i++) {
        this.batch.add('leaf', c.x + 0.25 + ((i % 2) - 0.5) * 0.4 * S, 0.82 + Math.floor(i / 2) * ITEM_HEIGHT.leaf, c.z + 0.75, Math.PI / 2);
      }
      for (let i = 0; i < p.pastes; i++) {
        this.batch.add('paste', c.x + 0.25 + ((i % 2) - 0.5) * 0.46 * S, 0.77 + Math.floor(i / 2) * ITEM_HEIGHT.paste, c.z - 1.0);
      }
      for (let i = 0; i < p.scraps; i++) {
        this.batch.add('scrap', c.x - 0.85 + ((i % 2) - 0.5) * 0.3, 0.08 + Math.floor(i / 6) * 0.25, c.z + (Math.floor(i / 2) % 3 - 1) * 0.36, i, 0.85);
      }
      out.set(p.pastes >= cfg.press.outCap ? 'MAX' : `${p.pastes}/${cfg.press.outCap}`, p.pastes >= cfg.press.outCap ? 'max' : 'pill');
      scrap.set(p.scraps >= cfg.press.scrapCap ? 'MAX' : `${p.scraps}/${cfg.press.scrapCap}`, p.scraps >= cfg.press.scrapCap ? 'max' : 'pill');
      stop.set(pressBlocked(p) && p.scraps >= cfg.press.scrapCap ? 'STOP' : null, 'stop');
    }

    // Camion: arriva da ovest lungo la strada, a cassone pieno riparte verso est e torna da ovest.
    const t = s.truck;
    const tw = toWorld(TRUCK);
    const drive = feel.truckDriveSeconds;
    let dx = 0;
    let shown = t.arrived;
    if (t.away > 0) {
      const gone = t.arrived ? cfg.truck.awaySeconds - t.away : Infinity;
      if (gone < drive) {
        dx = TRUCK_RUN * (gone / drive) ** 2;
        shown = true;
      } else if (t.away < drive) {
        dx = -TRUCK_RUN * (t.away / drive) ** 2;
        shown = true;
      } else shown = false;
    }
    this.valley.truck.visible = shown;
    this.valley.truck.position.x = tw.x + dx;
    this.truckLabel.sprite.position.x = tw.x + dx;
    if (t.away === 0 && t.arrived) {
      for (let i = 0; i < t.load; i++) {
        const col = i % 2;
        const row = Math.floor(i / 2) % 5;
        const layer = Math.floor(i / 10);
        this.batch.add('paste', tw.x - 0.2 - row * 0.4 * S, 1.05 + layer * ITEM_HEIGHT.paste, tw.z + (col - 0.5) * 0.5 * S, Math.PI / 2);
      }
      const full = t.load >= t.capacity;
      this.truckLabel.set(full ? 'MAX' : `${t.load}/${t.capacity}`, full ? 'max' : 'pill');
      this.truckTimer.set(null);
    } else if (t.arrived) {
      this.truckLabel.set(null);
      this.truckTimer.set(`0:${String(Math.ceil(t.away)).padStart(2, '0')}`, 'timer');
    } else {
      this.truckLabel.set(null);
      this.truckTimer.set(null);
    }

    // Mazzette a terra.
    for (const pile of s.piles) {
      const w = toWorld(pile);
      this.pilePos.set(pile.id, w);
      addMoneyPile(this.batch, pile.value, w.x, w.z);
    }

    // Mazzette che volano verso il tappetino mentre si paga.
    const nextDef = nextUnlockDef(s);
    if (s.padPaid > this.lastPaid && nextDef) {
      this.payTimer -= dt;
      if (this.payTimer <= 0) {
        this.payTimer = 0.07;
        const to = toWorld(UNLOCK_PADS[nextDef.id]);
        const target = new THREE.Vector3(to.x, 0.05, to.z);
        this.flights.push({ from: this.backTop.clone(), to: () => target, t: 0, delay: 0 });
      }
    }
    this.lastPaid = s.padPaid;
    for (let i = this.flights.length - 1; i >= 0; i--) {
      const fl = this.flights[i]!;
      fl.t += dt;
      const k = (fl.t - fl.delay) / feel.flySeconds;
      if (k >= 1) {
        this.flights.splice(i, 1);
        continue;
      }
      if (k < 0) continue;
      const to = fl.to();
      this.batch.add(
        'money',
        fl.from.x + (to.x - fl.from.x) * k,
        fl.from.y + (to.y - fl.from.y) * k + Math.sin(k * Math.PI) * 1.2,
        fl.from.z + (to.z - fl.from.z) * k,
        k * 6,
      );
    }

    // Raccoglitori.
    s.workers.forEach((w, i) => {
      const v = this.workerView(w, i);
      const x = w.prevX + (w.x - w.prevX) * alpha;
      const y = w.prevY + (w.y - w.prevY) * alpha;
      const pos = toWorld({ x, y });
      v.character.update(pos.x, pos.z, w.facing, w.asleep ? 0 : w.speed, cfg.picker.speed, w.asleep ? 0 : dt);
      const rotY = v.character.root.rotation.y;
      const vel = { x: Math.cos(w.facing) * w.speed, z: -Math.sin(w.facing) * w.speed };
      drawStack(this.batch, w.stack.items, { x: pos.x, z: pos.z, rotY, vx: vel.x, vz: vel.z }, v.sway.update(vel.x, vel.z, dt), 0.55, 0.8);
      v.zzz.sprite.position.set(pos.x, 2.0 + (w.asleep ? Math.sin(this.time * 2) * 0.08 : 0), pos.z);
      v.zzz.set(w.asleep ? 'Zzz' : w.waiting ? 'zzz' : null, w.asleep ? 'zzzBig' : 'zzz');
    });

    this.batch.end();
    this.mats.end();

    // Tappetino del prossimo sblocco.
    const next = nextDef;
    const icon: PadIcon = next?.kind ?? 'field';
    this.pad.update(next ? toWorld(UNLOCK_PADS[next.id]) : null, icon, next?.cost ?? 0, s.padPaid, dt, next ? GHOSTS[next.id]?.w : undefined);

    // Freccia sul prossimo obiettivo.
    const goal = objective(s);
    const target = goal.target ? toWorld(goal.target) : null;
    const near = target && Math.hypot(target.x - player.x, target.z - player.z) < 1.0;
    const onWorker = goal.target !== null && s.workers.some((w) => w === goal.target);
    this.arrow.update(near ? null : target, onWorker ? 1.6 : 0, dt);

    // Falò: fiamme che tremano, fiammata a ogni sacco.
    this.flare = Math.max(0, this.flare - dt * 2.5);
    const f = 1 + 0.08 * Math.sin(this.time * 17) + 0.05 * Math.sin(this.time * 29) + this.flare * 0.9;
    this.valley.bonfire.traverse((o) => {
      if (o.name === 'flame') o.scale.set(1 + this.flare * 0.4, f, 1 + this.flare * 0.4);
    });
    void simTime;
  }

  /** Punto del mondo della freccia, per la freccia al bordo dello schermo. */
  goalWorld(s: Phase1State): MapPoint | null {
    return objective(s).target;
  }
}
