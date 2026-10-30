// Pila che si piega come una molla (GDD sezione 10; skill ux-ui-arcade-idle, raccolta-e-pila): la cima si
// sposta all'indietro quando si parte o si cambia direzione, e torna dritta in corsa costante e da fermi,
// con un tetto all'inclinazione. Calcolo puro, senza Three.js: si prova con i test.

import type { StackFeelConfig } from '../config/balance';

export class StackSway {
  private x = 0;
  private z = 0;
  private vx = 0;
  private vz = 0;
  /** Velocità "ricordata": insegue quella vera, e la differenza misura il cambio di velocità. */
  private mx = 0;
  private mz = 0;

  update(velX: number, velZ: number, dt: number, cfg: StackFeelConfig): { x: number; z: number } {
    const step = Math.min(dt, 1 / 30);
    const k = 1 - Math.exp(-step / cfg.leanMemory);
    this.mx += (velX - this.mx) * k;
    this.mz += (velZ - this.mz) * k;
    let tx = -(velX - this.mx) * cfg.leanPerSpeed;
    let tz = -(velZ - this.mz) * cfg.leanPerSpeed;
    const len = Math.hypot(tx, tz);
    if (len > cfg.maxLean) {
      tx *= cfg.maxLean / len;
      tz *= cfg.maxLean / len;
    }
    // Molla smorzata: oscilla un poco e si assesta.
    this.vx += ((tx - this.x) * cfg.spring - this.vx * cfg.damping) * step;
    this.vz += ((tz - this.z) * cfg.spring - this.vz * cfg.damping) * step;
    this.x += this.vx * step;
    this.z += this.vz * step;
    return { x: this.x, z: this.z };
  }
}
