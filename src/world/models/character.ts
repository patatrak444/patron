// Personaggi dal pacchetto Kenney Mini Characters (GDD sezione 10), alti 1,7 m.
// Camminata e attesa dalle animazioni del pacchetto, con la velocità della camminata legata alla
// velocità reale. Se un modello non ha animazioni si usa il ripiego procedurale del documento:
// oscillazione e inclinazione in camminata, respiro da fermo (scala 1,00–1,02 in 2 s).

import * as THREE from 'three';
import { clone as cloneSkinned } from 'three/examples/jsm/utils/SkeletonUtils.js';
import type { CharacterAsset } from '../assets';

/** Altezza di un personaggio adulto (GDD sezione 10, proporzioni). */
export const ADULT_HEIGHT = 1.7;

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

export class Character {
  readonly root = new THREE.Group();
  private readonly body = new THREE.Group();
  private readonly mixer: THREE.AnimationMixer | null = null;
  private readonly actions: Partial<Record<'idle' | 'walk' | 'sprint', THREE.AnimationAction>> = {};
  private current: THREE.AnimationAction | null = null;
  private phase = 0;
  private time = 0;

  constructor(asset: CharacterAsset) {
    const model = cloneSkinned(asset.scene);
    model.scale.setScalar(ADULT_HEIGHT / asset.height);
    this.body.add(model);
    this.root.add(this.body);

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
        const stride = this.current === this.actions.sprint ? SPRINT_STRIDE : WALK_STRIDE;
        this.current.timeScale = cycleTimeScale(speed, stride, this.current.getClip().duration);
      } else if (this.current) {
        this.current.timeScale = 1;
      }
      this.mixer.update(dt);
      return;
    }

    if (t > 0.02) {
      this.phase += speed * dt * 2.4;
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
