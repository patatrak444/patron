import * as THREE from 'three';
import { BALANCE } from '../config/balance';
import type { Assets } from './assets';
import { createLights, type SceneLights } from './lights';
import { createValley } from './map';
import { PALETTE } from './palette';
import type { Quality } from './render';

export interface GameScene {
  readonly scene: THREE.Scene;
  readonly lights: SceneLights;
  readonly occluders: readonly THREE.Object3D[];
}

export function createScene(assets: Assets, quality: Quality): GameScene {
  const scene = new THREE.Scene();
  // Niente nebbia: oltre la cornice di giungla lo sfondo è un verde uniforme (GDD sezione 10).
  scene.background = new THREE.Color(PALETTE.jungleFloor);
  const shadowSize = quality === 'high' ? BALANCE.render.shadowMapSize.high : BALANCE.render.shadowMapSize.medium;
  const lights = createLights(scene, shadowSize);
  const valley = createValley(assets);
  scene.add(valley.root);
  return { scene, lights, occluders: valley.occluders };
}

/** Rapporto pixel che rispetta il tetto di risoluzione interna (GDD sezione 10). */
export function cappedPixelRatio(width: number, height: number, devicePixelRatio: number): number {
  const { maxInternalWidth, maxInternalHeight } = BALANCE.render;
  return Math.max(0.5, Math.min(devicePixelRatio, maxInternalWidth / width, maxInternalHeight / height));
}
