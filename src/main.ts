// Avvio del gioco e ciclo principale.

import * as THREE from 'three';
import './ui/styles.css';
import { BALANCE } from './config/balance';
import { VALLEY_CENTER, toWorld } from './config/map';
import { createBus, type GameEvents } from './core/bus';
import { createFixedStepper, startLoop } from './core/loop';
import { createDebugPanel, isDebugEnabled } from './debug/debugPanel';
import { createInitialState, stepSim } from './sim/state';
import { hasWebGL2, installMinSizeNotice, isTouchOnlyDevice, showBlockingMessage } from './ui/deviceGate';
import { GameCamera } from './world/camera';
import { cappedPixelRatio, createWorld } from './world/scene';

function boot(root: HTMLElement): void {
  if (isTouchOnlyDevice()) {
    showBlockingMessage(root, 'PATRÓN si gioca da computer', 'Apri questo link da un computer con Chrome.', true);
    return;
  }
  if (!hasWebGL2()) {
    showBlockingMessage(
      root,
      'Il browser non supporta WebGL 2',
      'Aggiorna il browser o apri il link con una versione recente di Chrome.',
      true,
    );
    return;
  }

  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  root.append(renderer.domElement);
  installMinSizeNotice(root);

  const world = createWorld();
  const camera = new GameCamera(BALANCE.camera, innerWidth / innerHeight);
  const center = toWorld(VALLEY_CENTER);
  camera.follow(center.x, center.z, true);

  const resize = (): void => {
    const w = innerWidth;
    const h = innerHeight;
    renderer.setPixelRatio(cappedPixelRatio(w, h, devicePixelRatio));
    renderer.setSize(w, h);
    camera.setAspect(w / h);
  };
  addEventListener('resize', resize);
  resize();

  const bus = createBus<GameEvents>();
  const state = createInitialState(Date.now());
  const stepper = createFixedStepper({
    ...BALANCE.sim,
    update: (dt) => stepSim(state, dt, bus),
  });

  const debug = isDebugEnabled() ? createDebugPanel(root, stepper, state) : null;

  startLoop(stepper, (alpha, frameSeconds) => {
    // Il cubo di prova ruota col tempo di gioco, interpolato tra due passi.
    const t = state.time + alpha * BALANCE.sim.step;
    world.testCube.rotation.set(t * 0.4, t * 0.9, 0);
    camera.update();
    renderer.render(world.scene, camera.camera);
    debug?.frame(frameSeconds);
  });
}

boot(document.getElementById('app')!);
