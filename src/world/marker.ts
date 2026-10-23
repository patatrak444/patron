// Cerchio a terra che segna la destinazione del clic (GDD sezione 3).

import * as THREE from 'three';
import { PALETTE } from './palette';

export class DestinationMarker {
  readonly mesh: THREE.Mesh;
  private time = 0;

  constructor() {
    this.mesh = new THREE.Mesh(
      new THREE.RingGeometry(0.32, 0.46, 28),
      new THREE.MeshBasicMaterial({ color: PALETTE.white, transparent: true, opacity: 0.9, depthWrite: false }),
    );
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.position.y = 0.03;
    this.mesh.visible = false;
  }

  /** `at` null nasconde il cerchio. */
  update(at: { x: number; z: number } | null, dt: number): void {
    this.mesh.visible = at !== null;
    if (!at) return;
    this.time += dt;
    this.mesh.position.x = at.x;
    this.mesh.position.z = at.z;
    this.mesh.scale.setScalar(1 + 0.12 * Math.sin(this.time * 6));
  }
}
