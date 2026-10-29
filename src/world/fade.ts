// Visibilità del personaggio (GDD sezione 10): gli oggetti tra la camera e il giocatore diventano
// trasparenti al 30% in 0,15 s e tornano pieni quando il giocatore si allontana.

import * as THREE from 'three';

export const FADE_OPACITY = 0.3;
export const FADE_SECONDS = 0.15;

/** Avvicina `current` a `target` alla velocità di un passaggio completo 1 → 0,3 in `FADE_SECONDS`. */
export function stepOpacity(current: number, target: number, dt: number): number {
  const rate = (1 - FADE_OPACITY) / FADE_SECONDS;
  const d = target - current;
  const step = rate * dt;
  return Math.abs(d) <= step ? target : current + Math.sign(d) * step;
}

interface Fadeable {
  readonly object: THREE.Object3D;
  readonly materials: THREE.Material[];
  opacity: number;
}

export class OccluderFader {
  private readonly items: Fadeable[] = [];
  private readonly ray = new THREE.Raycaster();
  private readonly from = new THREE.Vector3();
  private readonly to = new THREE.Vector3();
  private readonly dir = new THREE.Vector3();

  /** Registra un oggetto: i suoi materiali vengono clonati, così la trasparenza resta solo sua. */
  add(object: THREE.Object3D): void {
    const materials: THREE.Material[] = [];
    object.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const own = (Array.isArray(mesh.material) ? mesh.material : [mesh.material]).map((m) => m.clone());
      mesh.material = own.length === 1 ? own[0]! : own;
      materials.push(...own);
    });
    this.items.push({ object, materials, opacity: 1 });
  }

  /** Controlla la linea camera → giocatore (piedi e testa) e aggiorna le trasparenze. */
  update(camera: THREE.Camera, player: THREE.Vector3, dt: number): void {
    camera.getWorldPosition(this.from);
    const hit = new Set<THREE.Object3D>();
    for (const h of [0.2, 1.5]) {
      this.to.set(player.x, h, player.z);
      this.dir.subVectors(this.to, this.from);
      const dist = this.dir.length();
      this.ray.set(this.from, this.dir.normalize());
      this.ray.far = dist - 0.4;
      for (const item of this.items) {
        if (this.ray.intersectObject(item.object, true).length > 0) hit.add(item.object);
      }
    }
    for (const item of this.items) {
      const target = hit.has(item.object) ? FADE_OPACITY : 1;
      if (item.opacity === target) continue;
      item.opacity = stepOpacity(item.opacity, target, dt);
      const transparent = item.opacity < 1;
      for (const m of item.materials) {
        m.opacity = item.opacity;
        if (m.transparent !== transparent) {
          m.transparent = transparent;
          m.depthWrite = !transparent;
          m.needsUpdate = true;
        }
      }
    }
  }
}
