// Personaggio low-poly: capsula per il corpo, sfera per la testa, circa 200 triangoli (GDD sezione 10).
// Animazioni procedurali: camminata che oscilla e si inclina, respiro da fermo.

import * as THREE from 'three';

export interface CharacterLook {
  shirt: number;
  pants: number;
  skin: number;
}

/** Camicia logora della prima fase (GDD sezione 9). */
export const PLAYER_LOOK_RAGGED: CharacterLook = { shirt: 0xd8c7a0, pants: 0x5b4a3a, skin: 0xc68b59 };

export class Character {
  readonly root = new THREE.Group();
  private readonly body = new THREE.Group();
  private phase = 0;
  private time = 0;

  constructor(look: CharacterLook) {
    const mat = (color: number): THREE.MeshLambertMaterial => new THREE.MeshLambertMaterial({ color, flatShading: true });

    const legs = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.17, 0.5, 8, 1), mat(look.pants));
    legs.position.y = 0.25;
    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.27, 0.42, 2, 8), mat(look.shirt));
    torso.position.y = 0.82;
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 8, 6), mat(look.skin));
    head.position.y = 1.42;
    // Occhi e naso sul davanti (+z locale) per leggere da che parte guarda.
    const eyeGeo = new THREE.BoxGeometry(0.05, 0.06, 0.02);
    const eyeMat = mat(0x1b1b2f);
    const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
    eyeL.position.set(-0.08, 1.46, 0.205);
    const eyeR = eyeL.clone();
    eyeR.position.x = 0.08;
    const nose = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.08), mat(look.skin));
    nose.position.set(0, 1.4, 0.22);

    for (const m of [legs, torso, head]) m.castShadow = true;
    this.body.add(legs, torso, head, eyeL, eyeR, nose);
    this.root.add(this.body);
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
    if (t > 0.02) {
      this.phase += speed * dt * 2.4;
      this.body.position.y = Math.abs(Math.sin(this.phase)) * 0.07 * t;
      this.body.rotation.x = 0.16 * t;
      this.body.scale.y = 1;
    } else {
      // Respiro: scala 1,00–1,02 in 2 s.
      this.body.position.y = 0;
      this.body.rotation.x = 0;
      this.body.scale.y = 1 + 0.01 * (1 - Math.cos((this.time * Math.PI * 2) / 2));
    }
  }
}
