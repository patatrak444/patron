// Avvio del gioco e ciclo principale.

import * as THREE from 'three';
import './ui/styles.css';
import { BALANCE } from './config/balance';
import { fromWorld, toWorld } from './config/map';
import { createBus, type GameEvents } from './core/bus';
import { installInput, screenToMap } from './core/input';
import { createFixedStepper, startLoop } from './core/loop';
import { budget } from './debug/budget';
import { createDebugPanel, isDebugEnabled } from './debug/debugPanel';
import { NavOverlay } from './debug/navOverlay';
import { angleDelta, commandMoveTo } from './sim/player';
import { levelProgress, objective } from './sim/phase1';
import { createInitialState, createMoveContext, stepSim } from './sim/state';
import { createRng } from './core/rng';
import { prepareScenario, type Scenario } from './debug/scenarios';
import { hasWebGL2, installMinSizeNotice, isTouchOnlyDevice, showBlockingMessage } from './ui/deviceGate';
import { createHud } from './ui/hud';
import { GameCamera } from './world/camera';
import { loadAssets, type Assets } from './world/assets';
import { OccluderFader } from './world/fade';
import { DestinationMarker } from './world/marker';
import { Character, PLAYER_HEIGHT } from './world/models/character';
import { createFrame, qualityFromUrl } from './world/render';
import { PALETTE } from './world/palette';
import { cappedPixelRatio, createScene } from './world/scene';
import { Phase1View } from './world/phase1View';

/** Modello del giocatore nella prima fase; gli abiti per fase arrivano in M7 (GDD sezione 9). */
const PLAYER_MODEL = 'mini_male_a';

async function boot(root: HTMLElement): Promise<void> {
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

  const loading = document.createElement('div');
  loading.className = 'loading';
  loading.textContent = 'Caricamento…';
  root.append(loading);
  let assets: Assets;
  try {
    assets = await loadAssets();
  } catch (err) {
    console.error(err);
    loading.remove();
    showBlockingMessage(root, 'Non riesco a caricare il gioco', 'Controlla la connessione e ricarica la pagina.', true);
    return;
  }
  loading.remove();

  const quality = qualityFromUrl(location.search);
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.shadowMap.enabled = true;
  // PCF con raggio di sfumatura: bordi morbidi (GDD sezione 10). Le ombre VSM sarebbero più morbide
  // ma disegnano nella mappa d'ombra anche chi le riceve (terreno, erba): +27.000 triangoli all'avvio.
  renderer.shadowMap.type = THREE.PCFShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  // Nessuna mappatura dei toni cinematografica: i colori pastello arrivano allo schermo come sono (GDD sezione 10).
  renderer.toneMapping = THREE.NoToneMapping;
  // Conteggio di disegni e triangoli su tutto il fotogramma: ombre e bloom compresi (GDD sezione 10).
  renderer.info.autoReset = false;
  root.append(renderer.domElement);

  const { scene, lights, occluders, valley } = createScene(assets, quality);
  const fader = new OccluderFader();
  for (const o of occluders) fader.add(o);
  const bus = createBus<GameEvents>();
  const state = createInitialState(Date.now());
  const moveCtx = createMoveContext(state.phase1);
  const rng = createRng(state.rngState);
  const view = new Phase1View(valley, assets, bus);
  scene.add(view.root);

  // Il giocatore è più alto degli altri e porta il cappellino rosso: si distingue sempre (GDD sezione 10).
  const player = new Character(assets.characters[PLAYER_MODEL], { height: PLAYER_HEIGHT, cap: PALETTE.policeRed });
  const marker = new DestinationMarker();
  const navOverlay = new NavOverlay(moveCtx.grid);
  scene.add(player.root, marker.mesh, navOverlay.root);

  const camera = new GameCamera(BALANCE.camera, innerWidth / innerHeight);
  const frame = createFrame(renderer, scene, camera.camera, quality, BALANCE.render.bloom);
  const spawn = toWorld(state.player);
  camera.follow(spawn.x, spawn.z, true);

  const resize = (): void => {
    const w = innerWidth;
    const h = innerHeight;
    frame.setSize(w, h, cappedPixelRatio(w, h, devicePixelRatio));
    camera.setAspect(w / h);
  };
  addEventListener('resize', resize);
  resize();

  const hud = createHud(root);
  installMinSizeNotice(root);

  const stepper = createFixedStepper({
    ...BALANCE.sim,
    update: (dt) => {
      const key = input.keys.move();
      // I tasti seguono lo schermo: con la camera ruotata, W va verso nord-est (GDD sezione 3).
      const move = screenToMap(key.x, key.y, BALANCE.camera.yawDeg);
      stepSim(state, dt, bus, { moveX: move.x, moveY: move.y }, moveCtx, rng);
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

  if (isDebugEnabled()) {
    // Gancio per gli screenshot automatici (scripts/shot.mjs): solo con ?debug=1.
    Object.assign(window, {
      __patron: {
        scene,
        camera: camera.camera,
        setPlayer(x: number, y: number) {
          Object.assign(state.player, { x, y, prevX: x, prevY: y, vx: 0, vy: 0, path: [] });
          const w = toWorld({ x, y });
          camera.follow(w.x, w.z, true);
        },
        zoom: (step: number) => camera.zoom(step),
        /** Prepara una situazione di gioco per gli screenshot (src/debug/scenarios.ts). */
        prepare(name: Scenario) {
          prepareScenario(state, name, bus);
          Object.assign(moveCtx, createMoveContext(state.phase1));
          view.syncUnlocked(state.phase1);
          const w = toWorld(state.player);
          camera.follow(w.x, w.z, true);
        },
        state,
        budget: () => ({ view: budget(scene, camera.camera), shadow: budget(scene, lights.sun.shadow.camera, true) }),
      },
    });
  }

  const debug = isDebugEnabled()
    ? createDebugPanel(root, stepper, state, {
        toggleNavGrid: () => navOverlay.toggle(),
        renderStats: () => ({ calls: renderer.info.render.calls, triangles: renderer.info.render.triangles }),
      })
    : null;

  // Freccia al bordo: il bersaglio dell'obiettivo proiettato sullo schermo, se è fuori vista (GDD sezione 12).
  const proj = new THREE.Vector3();
  const offscreen = (target: { x: number; y: number } | null): { x: number; y: number } | null => {
    if (!target) return null;
    const tw = toWorld(target);
    proj.set(tw.x, 0.5, tw.z).project(camera.camera);
    const sx = ((proj.x + 1) / 2) * innerWidth;
    const sy = ((1 - proj.y) / 2) * innerHeight;
    const m = 40;
    return sx < m || sy < m || sx > innerWidth - m || sy > innerHeight - m ? { x: sx, y: sy } : null;
  };

  startLoop(stepper, (alpha, frameSeconds) => {
    const p = state.player;
    // Disegno interpolato tra gli ultimi due passi di logica.
    const x = p.prevX + (p.x - p.prevX) * alpha;
    const y = p.prevY + (p.y - p.prevY) * alpha;
    const facing = p.prevFacing + angleDelta(p.prevFacing, p.facing) * alpha;
    const w = toWorld({ x, y });
    const dt = stepper.paused ? 0 : frameSeconds;
    player.update(w.x, w.z, facing, Math.hypot(p.vx, p.vy), BALANCE.player.speed, dt);
    const s1 = state.phase1;
    view.update(
      s1,
      { x: w.x, z: w.z, rotY: player.root.rotation.y, vx: p.vx, vz: -p.vy },
      s1.stack.items,
      alpha,
      dt,
      state.time,
    );
    hud.setCash(s1.cash);
    const prog = levelProgress(s1.stars);
    hud.setRespect(s1.level, prog.stars, prog.next);
    const goal = objective(s1);
    hud.setGoal(goal.text);
    hud.setEdgeArrow(offscreen(goal.target));

    const dest = p.path.length > 0 ? toWorld(p.path[p.path.length - 1]!) : null;
    marker.update(dest, frameSeconds);
    navOverlay.update({ x, y }, p.path);

    // Festa dello sblocco: un attimo di primo piano sull'oggetto nuovo, poi si torna al giocatore.
    const festa = view.festaFocus();
    camera.closeUp(festa ? BALANCE.feel.festaWidth : null);
    camera.follow(festa?.x ?? w.x, festa?.z ?? w.z);
    camera.update(frameSeconds);
    lights.follow(w.x, w.z);
    fader.update(camera.camera, player.root.position, frameSeconds);
    renderer.info.reset();
    frame.render();
    debug?.frame(frameSeconds);
  });
}

void boot(document.getElementById('app')!);
