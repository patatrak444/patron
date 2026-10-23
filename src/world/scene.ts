import * as THREE from 'three';
import { BALANCE } from '../config/balance';
import { createLights } from './lights';
import { createValley } from './map';
import { PALETTE } from './palette';

export function createScene(): THREE.Scene {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(PALETTE.sky);
  scene.fog = new THREE.Fog(PALETTE.sky, 45, 110);
  createLights(scene, BALANCE.render.shadowMapSize.high);
  scene.add(createValley());
  return scene;
}

/** Rapporto pixel che rispetta il tetto di risoluzione interna (GDD sezione 10). */
export function cappedPixelRatio(width: number, height: number, devicePixelRatio: number): number {
  const { maxInternalWidth, maxInternalHeight } = BALANCE.render;
  return Math.max(0.5, Math.min(devicePixelRatio, maxInternalWidth / width, maxInternalHeight / height));
}
