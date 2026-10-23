import * as THREE from 'three';
import { BALANCE } from '../config/balance';
import { VALLEY, VALLEY_CENTER, toWorld } from '../config/map';
import { createLights } from './lights';

const PALETTE = {
  jungleDark: 0x2f6b3a,
  jungleMid: 0x4f9a4a,
  path: 0xc8a27a,
  lumina: 0x5ce1e6,
  sky: 0xf2b27a,
} as const;

export interface World {
  readonly scene: THREE.Scene;
  /** Cubo di prova della tappa M0: dimostra rendering, luce e ombre. */
  readonly testCube: THREE.Mesh;
}

export function createWorld(): World {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(PALETTE.sky);
  scene.fog = new THREE.Fog(PALETTE.sky, 45, 110);

  createLights(scene, BALANCE.render.shadowMapSize.high);

  const center = toWorld(VALLEY_CENTER);

  // Giungla oltre i bordi, così la valle non galleggia nel vuoto.
  const outer = new THREE.Mesh(
    new THREE.PlaneGeometry(VALLEY.width + 120, VALLEY.depth + 120),
    new THREE.MeshLambertMaterial({ color: PALETTE.jungleDark }),
  );
  outer.rotation.x = -Math.PI / 2;
  outer.position.set(center.x, -0.02, center.z);
  outer.receiveShadow = true;
  scene.add(outer);

  // Terreno della valle, 40 × 60 m.
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(VALLEY.width, VALLEY.depth),
    new THREE.MeshLambertMaterial({ color: PALETTE.jungleMid }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.set(center.x, 0, center.z);
  ground.receiveShadow = true;
  scene.add(ground);

  // Un sentiero di riferimento per leggere la scala.
  const path = new THREE.Mesh(
    new THREE.PlaneGeometry(2, VALLEY.depth),
    new THREE.MeshLambertMaterial({ color: PALETTE.path }),
  );
  path.rotation.x = -Math.PI / 2;
  path.position.set(center.x, 0.01, center.z);
  path.receiveShadow = true;
  scene.add(path);

  const testCube = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 1.5, 1.5),
    new THREE.MeshLambertMaterial({
      color: PALETTE.lumina,
      emissive: PALETTE.lumina,
      emissiveIntensity: 0.35,
      flatShading: true,
    }),
  );
  testCube.position.set(center.x, 1.4, center.z);
  testCube.castShadow = true;
  scene.add(testCube);

  return { scene, testCube };
}

/** Rapporto pixel che rispetta il tetto di risoluzione interna (GDD sezione 10). */
export function cappedPixelRatio(width: number, height: number, devicePixelRatio: number): number {
  const { maxInternalWidth, maxInternalHeight } = BALANCE.render;
  return Math.max(0.5, Math.min(devicePixelRatio, maxInternalWidth / width, maxInternalHeight / height));
}
