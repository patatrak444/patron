// Disegno della Fase 1 (tappa M2): legge lo stato della logica e lo mostra. Nessuna regola di gioco
// vive qui: solo posizioni, animazioni e scritte (GDD sezioni 4, 9, 10 e 12).

import * as THREE from 'three';
import { BALANCE } from '../config/balance';
import { BONFIRE, FIELD_PLOTS, GHOSTS, LOTS, OFFICE, PRESSES, TRUCK, UNLOCK_PADS, toWorld, type MapPoint, type UnlockId } from '../config/map';
import type { Bus, GameEvents } from '../core/bus';
import { nextUnlockDef, objective, pressBlocked, pressCanWork, type Phase1State, type WorkerState } from '../sim/phase1';
import type { Assets, CharacterId } from './assets';
import { addMoneyPile, addMoneyTower, ITEM_HEIGHT, ITEM_SCALE as S, ItemBatch, type VisualItem } from './items';
import { Label } from './labels';
import type { Valley } from './map';
import { Confetti, Dust } from './effects';
import { TORCHIO } from './models/stations';
import { Character } from './models/character';
import { GoalArrow, UnlockPad, type PadIcon } from './zones';
import { ContourLayer, type ContourSpec } from './contours';

const cfg = BALANCE.phase1;
const feel = BALANCE.feel;
/** Metri percorsi dal camion fuori scena, lungo la strada. */
const TRUCK_RUN = 64;
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

/** Banconota in volo da sopra la testa al riquadro d'acquisto (skill arcade-idle, PS16). */
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
  private readonly contours = new ContourLayer(BALANCE.camera.yawDeg);
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
  private readonly headTop = new THREE.Vector3();

  constructor(
    private readonly valley: Valley,
    private readonly assets: Assets,
    bus: Bus<GameEvents>,
  ) {
    this.root.name = 'fase 1';
    this.root.add(this.batch.root, this.contours.root, this.pad.root, this.arrow.root, this.confetti.mesh, this.dust.mesh);
    for (const f of FIELD_PLOTS) {
      const l = new Label();
      const w = toWorld({ x: f.x, y: f.y });
      l.sprite.position.set(w.x, 1.6, w.z);
      this.fieldLabels.set(f.id, l);
      this.root.add(l.sprite);
    }
    for (const p of PRESSES) {
      const out = new Label();
      const scrap = new Label();
      const stop = new Label(0.8);
      const o = toWorld(p.output);
      out.sprite.position.set(o.x - 0.4, 2.1, o.z);
      const s = toWorld(p.scrap);
      scrap.sprite.position.set(s.x + 0.3, 1.4, s.z);
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
    if (id === 'office') this.appear(v.office);
    if (id === 'zone2') this.openLot2(true);
  }

  /** Il lotto 2 si srotola da ovest; la staccionata in comune sparisce, quella nuova sale. */
  private openLot2(animate: boolean): void {
    const v = this.valley;
    const l2 = v.lots.lot2;
    v.fences.shared.visible = false;
    l2.floor.visible = true;
    v.hut.visible = true;
    v.fences.lot2.visible = true;
    const sides = [v.fences.lot2];
    if (!animate) return;
    const w = l2.floor.position.x;
    const half = (LOTS.lot2.x1 - LOTS.lot2.x0) / 2;
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

  /** Dove sta, nel mondo, un mucchio di mazzette (per far volare le banconote verso il contatore). */
  pileWorld(id: string): { x: number; z: number } | null {
    return this.pilePos.get(id) ?? null;
  }

  /** Punto da inquadrare da vicino durante la festa, o null. */
  festaFocus(): { x: number; z: number } | null {
    return this.festa && (this.holdFesta || this.time < this.festa.until) ? this.festa : null;
  }

  /** Solo debug (screenshot): tiene ferma la festa, che negli scatti lenti finirebbe prima della foto. */
  holdFesta = false;

  /** Allinea il disegno a uno stato caricato o preparato (debug, screenshot). */
  syncUnlocked(s: Phase1State): void {
    this.showState(s, false);
  }

  /**
   * Allinea il disegno allo stato `s`: compare ciò che è comprato e sparisce il resto. Con `vanish`
   * le cose da togliere si rimpiccioliscono in 0,5 s, come quando si passa dall'impero della
   * schermata iniziale al lotto vuoto (GDD sezione 8).
   */
  showState(s: Phase1State, vanish = false): void {
    const v = this.valley;
    const set = (o: THREE.Object3D, on: boolean): void => {
      if (on) {
        o.visible = true;
        return;
      }
      if (!o.visible) return;
      if (!vanish) {
        o.visible = false;
        return;
      }
      const base = o.scale.clone();
      this.tween(0.5, (k) => {
        const e = Math.max(0.001, 1 - k * k);
        o.scale.set(base.x * e, base.y * e, base.z * e);
        if (k >= 1) {
          o.visible = false;
          o.scale.copy(base);
        }
      });
    };
    for (const f of s.fields) {
      set(v.plants[f.id]!, f.unlocked);
      set(v.soils[f.id]!, f.unlocked);
    }
    for (const p of s.presses) set(v.presses[p.id]!, p.unlocked);
    set(v.bonfire, s.bonfire);
    set(v.office, s.office);
    set(v.truck, s.truck.arrived);
    if (s.lots.includes('lot2')) this.openLot2(false);
    else {
      v.fences.shared.visible = true;
      set(v.lots.lot2.floor, false);
      set(v.fences.lot2, false);
      set(v.hut, false);
    }
    // Lavoratori che non esistono nello stato nuovo.
    for (const [id, w] of this.workers) {
      if (s.workers.some((x) => x.id === id)) continue;
      this.workers.delete(id);
      w.zzz.sprite.removeFromParent();
      set(w.character.root, false);
      this.tween(0.55, (k) => k >= 1 && w.character.root.removeFromParent());
    }
    this.festa = null;
    this.flights.length = 0;
    this.pilePos.clear();
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

    // Pila del giocatore: solo merce tra le braccia. I soldi non si portano addosso (GDD sezione 3, UX3):
    // pagando, le banconote partono da sopra la testa.
    const sway = this.playerSway.update(player.vx, player.vz, dt);
    drawStack(this.batch, playerItems, player, sway);
    this.headTop.set(player.x, 2.3, player.z);
    // Sbuffi di polvere mentre si corre (skill arcade-idle, PS19).
    this.dustTimer -= dt;
    if (Math.hypot(player.vx, player.vz) > 1 && this.dustTimer <= 0) {
      this.dustTimer = feel.dustEvery;
      this.dust.puff(player.x - Math.sin(player.rotY) * 0.25, player.z - Math.cos(player.rotY) * 0.25);
    }
    this.dust.update(dt);
    if (this.holdFesta && this.festa && Math.floor(this.time * 2) !== Math.floor((this.time - dt) * 2)) this.confetti.burst(this.festa.x, this.festa.z, 30);
    this.confetti.update(dt);

    // Presa e consegna sulla macchina: contorni bianchi con l'icona e la freccia (GDD sezione 3, UX2).
    const specs: ContourSpec[] = [];
    for (const p of s.presses) {
      if (!p.unlocked) continue;
      const l = PRESSES.find((x) => x.id === p.id)!;
      specs.push({ contour: l.deposit, icon: 'leaf', into: true }, { contour: l.output, icon: 'paste', into: false }, { contour: l.scrap, icon: 'scrap', into: false });
    }
    if (s.bonfire) specs.push({ contour: BONFIRE.mat, icon: 'scrap', into: true });
    if (s.truck.arrived) specs.push({ contour: TRUCK.deposit, icon: 'paste', into: true });
    if (s.office) specs.push({ contour: OFFICE.door, icon: 'office', into: true });
    this.contours.set(specs);

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
        plate.position.y = working ? 1.3 - 0.12 * (0.5 - 0.5 * Math.cos(phase)) : 1.3;
        // La vite scende con il piatto e gira: è un torchio.
        const screw = g.getObjectByName('pressScrew');
        if (screw) {
          screw.position.y = plate.position.y + 0.42;
          if (working) screw.rotation.y = phase;
        }
      }
      // Foglie in mucchio nella tramoggia a sud, Panetti impilati sul ripiano a ovest, Scarti nel cassone a est.
      const H = TORCHIO.hopper;
      for (let i = 0; i < Math.min(p.leaves, 9); i++) {
        this.batch.add('leaf', c.x + H.x + ((i % 3) - 1) * 0.62, 0.55 + Math.floor(i / 3) * ITEM_HEIGHT.leaf * 0.7, c.z + H.z, 0, 0.8);
      }
      const SH = TORCHIO.shelf;
      for (let i = 0; i < p.pastes; i++) {
        this.batch.add('paste', c.x + SH.x, 0.56 + Math.floor(i / 2) * ITEM_HEIGHT.paste, c.z + SH.z + ((i % 2) - 0.5) * 0.36 * S, Math.PI / 2);
      }
      const CR = TORCHIO.crate;
      for (let i = 0; i < p.scraps; i++) {
        this.batch.add('scrap', c.x + CR.x, 0.08 + Math.floor(i / 3) * 0.25, c.z + CR.z + ((i % 3) - 1) * 0.6, i, 0.85);
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

    // Mazzette a terra in blocchi 2 × 3; il regalo è una torre alta quanto il personaggio (UX11), quelle del
    // camion stanno sul vassoio scuro.
    for (const pile of s.piles) {
      const w = toWorld(pile);
      this.pilePos.set(pile.id, w);
      if (pile.id === 'gift') addMoneyTower(this.batch, w.x, w.z, Math.ceil((feel.giftTowerLayers * pile.value) / cfg.gift));
      else addMoneyPile(this.batch, pile.value, w.x, w.z, 1, pile.id === 'truck' ? 0.1 : 0);
    }

    // Mazzette che volano verso il tappetino mentre si paga.
    const nextDef = nextUnlockDef(s);
    if (s.padPaid > this.lastPaid && nextDef) {
      this.payTimer -= dt;
      if (this.payTimer <= 0) {
        this.payTimer = 0.07;
        const to = toWorld(UNLOCK_PADS[nextDef.id]);
        const target = new THREE.Vector3(to.x, 0.05, to.z);
        this.flights.push({ from: this.headTop.clone(), to: () => target, t: 0, delay: 0 });
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

    // Tappetino del prossimo sblocco.
    const next = nextDef;
    const icon: PadIcon = next?.kind ?? 'field';
    this.pad.update(next ? toWorld(UNLOCK_PADS[next.id]) : null, icon, next?.cost ?? 0, s.padPaid, dt, next ? GHOSTS[next.id] : undefined);

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
