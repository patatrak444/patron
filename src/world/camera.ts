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

/** Camera prospettica dall'alto, inclinata, che segue un bersaglio senza ruotare (GDD sezione 3). */
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
    const pitch = cfg.pitchDeg * DEG;
    // La camera sta a sud del bersaglio (+z) e guarda verso nord.
    this.offsetDir = new THREE.Vector3(0, Math.sin(pitch), Math.cos(pitch));
    this.distance = this.desiredDistance();
  }

  setAspect(aspect: number): void {
    this.camera.aspect = aspect;
    this.camera.updateProjectionMatrix();
  }

  /** Imposta il punto da seguire; `snap` salta l'interpolazione. */
  follow(x: number, z: number, snap = false): void {
    this.desiredTarget.set(x, 0, z);
    if (snap) {
      this.target.copy(this.desiredTarget);
      this.distance = this.desiredDistance();
    }
  }

  update(): void {
    const k = this.cfg.followLerp;
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
