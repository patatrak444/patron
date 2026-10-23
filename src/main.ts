// Avvio del gioco e ciclo principale.

import * as THREE from 'three';
import './ui/styles.css';
import { BALANCE } from './config/balance';
import { fromWorld, toWorld } from './config/map';
import { createBus, type GameEvents } from './core/bus';
import { installInput } from './core/input';
import { createFixedStepper, startLoop } from './core/loop';
import { createDebugPanel, isDebugEnabled } from './debug/debugPanel';
import { NavOverlay } from './debug/navOverlay';
import { angleDelta, commandMoveTo } from './sim/player';
import { createInitialState, createMoveContext, stepSim } from './sim/state';
import { hasWebGL2, installMinSizeNotice, isTouchOnlyDevice, showBlockingMessage } from './ui/deviceGate';
import { createHud } from './ui/hud';
import { GameCamera } from './world/camera';
import { DestinationMarker } from './world/marker';
import { Character, PLAYER_LOOK_RAGGED } from './world/models/character';
import { cappedPixelRatio, createScene } from './world/scene';

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

  const scene = createScene();
  const bus = createBus<GameEvents>();
  const state = createInitialState(Date.now());
  const moveCtx = createMoveContext();

  const player = new Character(PLAYER_LOOK_RAGGED);
  const marker = new DestinationMarker();
  const navOverlay = new NavOverlay(moveCtx.grid);
  scene.add(player.root, marker.mesh, navOverlay.root);

  const camera = new GameCamera(BALANCE.camera, innerWidth / innerHeight);
  const spawn = toWorld(state.player);
  camera.follow(spawn.x, spawn.z, true);

  const resize = (): void => {
    const w = innerWidth;
    const h = innerHeight;
    renderer.setPixelRatio(cappedPixelRatio(w, h, devicePixelRatio));
    renderer.setSize(w, h);
    camera.setAspect(w / h);
  };
  addEventListener('resize', resize);
  resize();

  const hud = createHud(root);
  installMinSizeNotice(root);

  const stepper = createFixedStepper({
    ...BALANCE.sim,
    update: (dt) => {
      const move = input.keys.move();
      stepSim(state, dt, bus, { moveX: move.x, moveY: move.y }, moveCtx);
    },
  });

  // Clic sul terreno: raggio dalla camera al piano del suolo.
  const raycaster = new THREE.Raycaster();
  const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const ndc = new THREE.Vector2();
  const hit = new THREE.Vector3();
  const input = installInput(renderer.domElement, {
    onGroundClick(px, py) {
      if (stepper.paused) return;
      ndc.set((px / innerWidth) * 2 - 1, -(py / innerHeight) * 2 + 1);
      raycaster.setFromCamera(ndc, camera.camera);
      if (raycaster.ray.intersectPlane(ground, hit)) {
        commandMoveTo(state.player, fromWorld(hit.x, hit.z), moveCtx);
      }
    },
    onZoom: (step) => camera.zoom(step),
    onTogglePause() {
      stepper.paused = !stepper.paused;
      hud.setPaused(stepper.paused);
    },
  });

  const debug = isDebugEnabled()
    ? createDebugPanel(root, stepper, state, {
        toggleNavGrid: () => navOverlay.toggle(),
        renderStats: () => ({ calls: renderer.info.render.calls, triangles: renderer.info.render.triangles }),
      })
    : null;

  startLoop(stepper, (alpha, frameSeconds) => {
    const p = state.player;
    // Disegno interpolato tra gli ultimi due passi di logica.
    const x = p.prevX + (p.x - p.prevX) * alpha;
    const y = p.prevY + (p.y - p.prevY) * alpha;
    const facing = p.prevFacing + angleDelta(p.prevFacing, p.facing) * alpha;
    const w = toWorld({ x, y });
    const dt = stepper.paused ? 0 : frameSeconds;
    player.update(w.x, w.z, facing, Math.hypot(p.vx, p.vy), BALANCE.player.speed, dt);

    const dest = p.path.length > 0 ? toWorld(p.path[p.path.length - 1]!) : null;
    marker.update(dest, frameSeconds);
    navOverlay.update({ x, y }, p.path);

    camera.follow(w.x, w.z);
    camera.update(frameSeconds);
    renderer.render(scene, camera.camera);
    debug?.frame(frameSeconds);
  });
}

boot(document.getElementById('app')!);
