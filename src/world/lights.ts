// Luce e atmosfera (GDD sezione 10): sempre tardo pomeriggio. Sole basso da sud-ovest a circa 35°
// di elevazione, oro caldo, ombre lunghe e morbide; luce emisferica con cielo arancio tenue e
// suolo verde. La mappa d'ombra segue il giocatore invece di coprire tutta la valle.

import * as THREE from 'three';

const DEG = Math.PI / 180;
export const SUN_ELEVATION_DEG = 35;
/**
 * Riquadro della mappa d'ombra attorno al giocatore, in metri nella vista del sole.
 * Visto da sud-ovest il riquadro cade a terra come un rombo: di lato serve largo abbastanza da
 * coprire gli angoli dell'inquadratura; verso nord-est (lontano dal sole) si accorcia, perché le
 * ombre di quegli oggetti cadono fuori dall'inquadratura.
 */
export const SHADOW_BOX = { side: 22, towardSun: 17, awayFromSun: 9 } as const;
const SUN_DISTANCE = 60;

/** Direzione da cui arriva il sole: sud-ovest (x negativo, z positivo), 35° sopra l'orizzonte. */
export function sunDirection(): THREE.Vector3 {
  const e = SUN_ELEVATION_DEG * DEG;
  const h = Math.cos(e);
  return new THREE.Vector3(-h * Math.SQRT1_2, Math.sin(e), h * Math.SQRT1_2);
}

/** Arrotonda `v` al multiplo più vicino di `step`: evita che le ombre tremolino quando il riquadro si sposta. */
export function snap(v: number, step: number): number {
  return Math.round(v / step) * step;
}

export interface SceneLights {
  readonly sun: THREE.DirectionalLight;
  /** Centra la mappa d'ombra sul punto (x, z) del suolo. */
  follow(x: number, z: number): void;
}

export function createLights(scene: THREE.Scene, shadowMapSize: number): SceneLights {
  const hemi = new THREE.HemisphereLight(0xffc8a0, 0x4f7a3a, 1.35);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xffd9a0, 2.6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(shadowMapSize, shadowMapSize);
  sun.shadow.radius = shadowMapSize >= 2048 ? 3 : 2;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.03;
  const cam = sun.shadow.camera;
  // Nella vista del sole, +y punta lontano dal sole (verso nord-est) e −y verso il sole.
  cam.left = -SHADOW_BOX.side;
  cam.right = SHADOW_BOX.side;
  cam.top = SHADOW_BOX.awayFromSun;
  cam.bottom = -SHADOW_BOX.towardSun;
  cam.near = 1;
  cam.far = SUN_DISTANCE * 2;
  scene.add(sun, sun.target);

  const dir = sunDirection();
  const texel = (SHADOW_BOX.side * 2) / shadowMapSize;
  const follow = (x: number, z: number): void => {
    const sx = snap(x, texel * 4);
    const sz = snap(z, texel * 4);
    sun.target.position.set(sx, 0, sz);
    sun.position.set(sx + dir.x * SUN_DISTANCE, dir.y * SUN_DISTANCE, sz + dir.z * SUN_DISTANCE);
    sun.target.updateMatrixWorld();
  };
  follow(20, -4);
  return { sun, follow };
}
