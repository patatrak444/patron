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

  constructor(private readonly cfg: CameraConfig, aspect: number) {
    this.camera = new THREE.PerspectiveCamera(cfg.fovDeg, aspect, 0.5, 300);
    this.offsetDir = cameraOffset(cfg.pitchDeg, cfg.yawDeg);
    this.distance = this.desiredDistance();
  }

  setAspect(aspect: number): void {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  /** Scatto di zoom: −1 avvicina, +1 allontana. */
  zoom(step: number): void {
    this.zoomIndex = Math.min(Math.max(this.zoomIndex + step, 0), this.cfg.zoomWidths.length - 1);
  }

  /** Imposta il punto da seguire; `snap` salta l'interpolazione. */
  follow(x: number, z: number, snap = false): void {
    this.desiredTarget.set(x, 0, z);
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
    const width = this.cfg.zoomWidths[this.zoomIndex] ?? this.cfg.zoomWidths[1];
    return distanceForWidth(width, this.cfg.fovDeg, this.camera.aspect);
  }
}
