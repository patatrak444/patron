import * as THREE from 'three';
import type { CameraConfig } from '../config/balance';

const DEG = Math.PI / 180;

/**
 * Distanza dal punto inquadrato perché la larghezza visibile lì sia `width` metri,
 * dato il campo visivo verticale e il rapporto della finestra.
 */
export function distanceForWidth(width: number, fovDeg: number, aspect: number): number {
  const halfH = Math.atan(Math.tan((fovDeg * DEG) / 2) * aspect);
  return width / 2 / Math.tan(halfH);
}

/**
 * Distanza dal punto inquadrato perché l'altezza visibile lì, sul piano perpendicolare allo sguardo,
 * sia `height` metri (GDD sezione 3): non dipende dal rapporto della finestra.
 */
export function distanceForHeight(height: number, fovDeg: number): number {
  return height / 2 / Math.tan((fovDeg * DEG) / 2);
}

/**
 * Fattore di interpolazione per un fotogramma di `dt` secondi che equivale a `perFrame60`
 * applicato a ogni fotogramma a 60 fps (GDD sezione 3).
 */
export function frameLerp(perFrame60: number, dt: number): number {
  return 1 - Math.pow(1 - perFrame60, dt * 60);
}

/**
 * Direzione dal bersaglio alla camera. Con yaw 0 la camera sta a sud e guarda verso nord;
 * con yaw 45° sta a sud-ovest e guarda verso nord-est (GDD sezione 3).
 */
export function cameraOffset(pitchDeg: number, yawDeg: number): THREE.Vector3 {
  const p = pitchDeg * DEG;
  const y = yawDeg * DEG;
  return new THREE.Vector3(-Math.sin(y) * Math.cos(p), Math.sin(p), Math.cos(y) * Math.cos(p));
}

/** Camera prospettica dall'alto, inclinata e ruotata, che segue un bersaglio senza girare (GDD sezione 3). */
export class GameCamera {
  readonly camera: THREE.PerspectiveCamera;
  /** 0 vicino, 1 medio, 2 lontano. */
  zoomIndex = 1;

  private readonly target = new THREE.Vector3();
  private readonly desiredTarget = new THREE.Vector3();
  private distance = 0;
  private readonly offsetDir: THREE.Vector3;
  /** Altezza imposta per un primo piano (festa dello sblocco); null torna allo zoom scelto. */
  private override: number | null = null;
  /** Vero se all'ultima chiamata la camera era centrata su un punto (festa): poi torna sul giocatore. */
  private centered = false;
  /** Assi del suolo allineati allo schermo, nel piano XZ: destra e "in profondità". */
  private readonly right = new THREE.Vector2();
  private readonly ahead = new THREE.Vector2();

  constructor(private readonly cfg: CameraConfig, aspect: number) {
    this.camera = new THREE.PerspectiveCamera(cfg.fovDeg, aspect, 0.5, 400);
    this.offsetDir = cameraOffset(cfg.pitchDeg, cfg.yawDeg);
    this.ahead.set(-this.offsetDir.x, -this.offsetDir.z).normalize();
    this.right.set(-this.ahead.y, this.ahead.x);
    this.distance = this.desiredDistance();
  }

  setAspect(aspect: number): void {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  /** Scatto di zoom: −1 avvicina, +1 allontana. */
  zoom(step: number): void {
    this.zoomIndex = Math.min(Math.max(this.zoomIndex + step, 0), this.cfg.zoomHeights.length - 1);
  }

  /** Primo piano temporaneo: `height` metri inquadrati, null per tornare allo zoom del giocatore. */
  closeUp(height: number | null): void {
    this.override = height;
  }

  /**
   * Punto da seguire. Con `center` la camera ci si centra (festa, scatti, partenza); altrimenti si
   * muove solo quando il punto esce dalla zona morta al centro dello schermo (GDD sezione 3).
   * `snap` salta l'interpolazione.
   */
  follow(x: number, z: number, snap = false, center = false): void {
    if (center || this.centered) {
      // Dopo un primo piano si torna centrati sul giocatore, come in Pizza Ready.
      this.desiredTarget.set(x, 0, z);
    } else {
      const dx = x - this.desiredTarget.x;
      const dz = z - this.desiredTarget.z;
      const r = dx * this.right.x + dz * this.right.y;
      const a = dx * this.ahead.x + dz * this.ahead.y;
      const mr = Math.sign(r) * Math.max(0, Math.abs(r) - this.cfg.deadZone.width / 2);
      const ma = Math.sign(a) * Math.max(0, Math.abs(a) - this.cfg.deadZone.depth / 2);
      this.desiredTarget.x += mr * this.right.x + ma * this.ahead.x;
      this.desiredTarget.z += mr * this.right.y + ma * this.ahead.y;
    }
    this.centered = center;
    if (snap) {
      this.target.copy(this.desiredTarget);
      this.distance = this.desiredDistance();
      this.update(0);
    }
  }

  update(dt: number): void {
    const k = frameLerp(this.cfg.followLerp, dt);
    this.target.lerp(this.desiredTarget, k);
    this.distance += (this.desiredDistance() - this.distance) * k;
    this.camera.position.copy(this.target).addScaledVector(this.offsetDir, this.distance);
    this.camera.lookAt(this.target);
  }

  private desiredDistance(): number {
    const height = this.override ?? this.cfg.zoomHeights[this.zoomIndex] ?? this.cfg.zoomHeights[1];
    return distanceForHeight(height, this.cfg.fovDeg);
  }
}
