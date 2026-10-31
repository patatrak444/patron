// Personaggi dal pacchetto Kenney Mini Characters (GDD sezione 10), alti 1,7 m.
// Camminata e attesa dalle animazioni del pacchetto, con la velocità della camminata legata alla
// velocità reale. Se un modello non ha animazioni si usa il ripiego procedurale del documento:
// oscillazione e inclinazione in camminata, respiro da fermo (scala 1,00–1,02 in 2 s).

import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import type { CharacterAsset } from '../assets';

/** Altezza di un personaggio adulto (GDD sezione 10, proporzioni). */
export const ADULT_HEIGHT = 1.7;
/** Il giocatore è più alto degli altri: è il protagonista e deve spiccare (GDD sezione 10). */
export const PLAYER_HEIGHT = 1.9;

/**
 * Metri percorsi da un ciclo completo dell'animazione, a 1,7 m di altezza: due volte l'escursione
 * del piede, misurata ruotando la gamba del modello lungo il ciclo. Con questi valori la velocità
 * dell'animazione segue quella reale e i piedi non scivolano (GDD sezione 10).
 * Corsa: ciclo di 0,5 s, naturale a 3,57 m/s. Camminata: ciclo di 0,667 s, naturale a 2,32 m/s.
 */
export const SPRINT_STRIDE = 1.79;
export const WALK_STRIDE = 1.55;

/** Velocità di riproduzione di un ciclo lungo `stride` metri, di durata `duration` s, a `speed` m/s. */
export function cycleTimeScale(speed: number, stride: number, duration: number): number {
  if (stride <= 0 || duration <= 0) return 1;
  return (speed * duration) / stride;
}

const FADE = 0.15;

export interface CharacterOptions {
  /** Altezza in metri (GDD sezione 10). */
  readonly height?: number;
  /** Colore del cappellino; senza, nessun cappellino. */
  readonly cap?: number;
}

/** Cappellino squadrato con visiera sul davanti (+z), nello stile a blocchi dei Mini Characters. */
function createCap(width: number, depth: number, headHeight: number, color: number): THREE.Group {
  const mat = new THREE.MeshLambertMaterial({ color, flatShading: true });
  const cap = new THREE.Group();
  const crownH = headHeight * 0.3;
  const crown = new THREE.Mesh(new RoundedBoxGeometry(width * 0.9, crownH, depth * 0.9, 2, crownH * 0.45), mat);
  crown.position.y = crownH * 0.4;
  const brim = new THREE.Mesh(new RoundedBoxGeometry(width * 0.62, headHeight * 0.06, depth * 0.36, 1, headHeight * 0.025), mat);
  brim.position.set(0, headHeight * 0.03, depth * 0.56);
  for (const m of [crown, brim]) m.castShadow = true;
  cap.add(crown, brim);
  return cap;
}

/** Ombra tonda e morbida sotto i piedi: appoggia il personaggio al pavimento, come nel genere. */
function createBlobShadow(radius: number): THREE.Mesh {
  const mesh = new THREE.Mesh(
    new THREE.CircleGeometry(radius, 20),
    new THREE.MeshBasicMaterial({ color: 0x1b2a14, transparent: true, opacity: 0.18, depthWrite: false }),
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.y = 0.02;
  mesh.renderOrder = 1;
  return mesh;
}

/** Radianti di fase del passo per metro percorso: un mezzo giro di seno a ogni appoggio. */
const STEP_RATE = 2.4;

export class Character {
  readonly root = new THREE.Group();
  private readonly body = new THREE.Group();
  private readonly mixer: THREE.AnimationMixer | null = null;
  private readonly actions: Partial<Record<'idle' | 'walk' | 'sprint', THREE.AnimationAction>> = {};
  private current: THREE.AnimationAction | null = null;
  private phase = 0;
  private time = 0;
  /** I passi misurati valgono a 1,7 m: un personaggio più alto fa passi proporzionalmente più lunghi. */
  private readonly strideScale: number;
  /** Braccia in avanti per portare la pila: la posa del clip 'holding-both', applicata solo alle braccia. */
  private readonly arms: { bone: THREE.Object3D; pose: THREE.Quaternion }[] = [];
  private carry = 0;
  /** Vero se porta qualcosa: le braccia vanno sotto la pila (skill ux-ui-arcade-idle, raccolta-e-pila). */
  carrying = false;
  /** Fase del passo, per far rimbalzare la pila a ogni appoggio. */
  stepPhase = 0;

  constructor(asset: CharacterAsset, options: CharacterOptions = {}) {
    const height = options.height ?? ADULT_HEIGHT;
    const model = cloneSkinned(asset.scene);
    model.scale.setScalar(height / asset.height);
    this.strideScale = height / ADULT_HEIGHT;
    this.body.add(model);
    this.root.add(this.body, createBlobShadow(height * 0.24));

    if (options.cap !== undefined) {
      // Il cappellino si misura sulla testa e si aggancia al suo osso: segue l'animazione.
      this.root.updateMatrixWorld(true);
      const headMesh = model.getObjectByName('head-mesh');
      const headBone = model.getObjectByName('head');
      if (headMesh && headBone) {
        const box = new THREE.Box3().setFromObject(headMesh);
        const size = box.getSize(new THREE.Vector3());
        const cap = createCap(size.x, size.z, size.y, options.cap);
        cap.position.set((box.min.x + box.max.x) / 2, box.max.y - size.y * 0.06, (box.min.z + box.max.z) / 2);
        this.root.add(cap);
        headBone.attach(cap);
      }
    }

    const pick = (name: string): THREE.AnimationClip | undefined => asset.clips.find((c) => c.name === name);
    const idle = pick('idle');
    if (idle) {
      this.mixer = new THREE.AnimationMixer(model);
      this.actions.idle = this.mixer.clipAction(idle);
      const walk = pick('walk');
      const sprint = pick('sprint');
      if (walk) this.actions.walk = this.mixer.clipAction(walk);
      if (sprint) this.actions.sprint = this.mixer.clipAction(sprint);
      this.current = this.actions.idle;
      this.current.play();
      // Posa delle braccia dal primo fotogramma di 'holding-both'.
      const hold = pick('holding-both');
      for (const side of ['arm-left', 'arm-right']) {
        const bone = model.getObjectByName(side);
        const track = hold?.tracks.find((tr) => tr.name === `${side}.quaternion`);
        if (bone && track) this.arms.push({ bone, pose: new THREE.Quaternion().fromArray(track.values as unknown as number[], 0) });
      }
    }
  }

  private play(next: THREE.AnimationAction | undefined): void {
    if (!next || next === this.current) return;
    next.reset().setEffectiveWeight(1).play();
    if (this.current) next.crossFadeFrom(this.current, FADE, false);
    this.current = next;
  }

  /**
   * Aggiorna posizione e animazione.
   * `facing` è l'angolo della mappa (0 = est, π/2 = nord); `speed` in m/s.
   */
  update(x: number, z: number, facing: number, speed: number, maxSpeed: number, dt: number): void {
    this.time += dt;
    this.root.position.set(x, 0, z);
    // +z locale deve puntare verso (cos a, −sin a) nel piano XZ.
    this.root.rotation.y = Math.atan2(Math.cos(facing), -Math.sin(facing));
    const t = Math.min(speed / maxSpeed, 1);

    if (this.mixer) {
      const moving = t > 0.02;
      const run = this.actions.sprint ?? this.actions.walk;
      const useWalk = moving && speed < 2.5 && this.actions.walk;
      this.play(moving ? (useWalk ? this.actions.walk : run) : this.actions.idle);
      if (moving && this.current) {
        const stride = (this.current === this.actions.sprint ? SPRINT_STRIDE : WALK_STRIDE) * this.strideScale;
        this.current.timeScale = cycleTimeScale(speed, stride, this.current.getClip().duration);
      } else if (this.current) {
        this.current.timeScale = 1;
      }
      this.mixer.update(dt);
      // Fase del passo: un giro ogni due appoggi.
      if (moving) this.stepPhase += speed * dt * STEP_RATE;
      // Braccia in posa di trasporto, con un passaggio morbido di 0,15 s.
      this.carry += ((this.carrying ? 1 : 0) - this.carry) * (1 - Math.exp(-dt / 0.05));
      if (this.carry > 0.01) for (const a of this.arms) a.bone.quaternion.slerp(a.pose, this.carry);
      return;
    }

    if (t > 0.02) {
      this.phase += speed * dt * STEP_RATE;
      this.body.position.y = Math.abs(Math.sin(this.phase)) * 0.07 * t;
      this.body.rotation.x = 0.16 * t;
      this.body.scale.y = 1;
    } else {
      this.body.position.y = 0;
      this.body.rotation.x = 0;
      this.body.scale.y = 1 + 0.01 * (1 - Math.cos((this.time * Math.PI * 2) / 2));
    }
  }
}
