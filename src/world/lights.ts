import * as THREE from 'three';
import { VALLEY_CENTER, toWorld } from '../config/map';

/** Luce emisferica più sole da sud-ovest a circa 45° con ombre vere (GDD sezione 10). */
export function createLights(scene: THREE.Scene, shadowMapSize: number): void {
  const hemi = new THREE.HemisphereLight(0xffc89a, 0x4f9a4a, 1.1);
  scene.add(hemi);

  const center = toWorld(VALLEY_CENTER);
  const sun = new THREE.DirectionalLight(0xfff0d8, 2.2);
  // Sud-ovest: x negativo, z positivo; 45° di elevazione.
  sun.position.set(center.x - 30, 42, center.z + 30);
  sun.target.position.set(center.x, 0, center.z);
  sun.castShadow = true;
  sun.shadow.mapSize.set(shadowMapSize, shadowMapSize);
  sun.shadow.radius = 3;
  sun.shadow.bias = -0.0005;
  const cam = sun.shadow.camera;
  cam.left = -40;
  cam.right = 40;
  cam.top = 40;
  cam.bottom = -40;
  cam.near = 1;
  cam.far = 140;
  scene.add(sun, sun.target);
}
