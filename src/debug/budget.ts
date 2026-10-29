// Ripartizione di disegni e triangoli per gruppo, dentro un'inquadratura (solo per il debug).
// Serve a capire cosa pesa quando il pannello supera i limiti della sezione 10.

import * as THREE from 'three';

export interface BudgetRow {
  readonly name: string;
  readonly draws: number;
  readonly triangles: number;
}

function trianglesOf(mesh: THREE.Mesh): number {
  const g = mesh.geometry;
  const per = g.index ? g.index.count / 3 : g.getAttribute('position').count / 3;
  const inst = (mesh as THREE.InstancedMesh).isInstancedMesh ? (mesh as THREE.InstancedMesh).count : 1;
  return per * inst;
}

/** Disegni e triangoli delle mesh dentro il volume visto da `camera`, raggruppati per antenato con nome. */
export function budget(scene: THREE.Scene, camera: THREE.Camera, castersOnly = false): BudgetRow[] {
  camera.updateMatrixWorld();
  const frustum = new THREE.Frustum().setFromProjectionMatrix(
    new THREE.Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse),
  );
  const rows = new Map<string, { draws: number; triangles: number }>();
  scene.updateMatrixWorld(true);
  scene.traverseVisible((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh || (castersOnly && !mesh.castShadow)) return;
    if (mesh.frustumCulled) {
      if (!mesh.geometry.boundingSphere) mesh.geometry.computeBoundingSphere();
      const inst = mesh as THREE.InstancedMesh;
      const sphere = (inst.isInstancedMesh ? (inst.boundingSphere ?? inst.geometry.boundingSphere) : mesh.geometry.boundingSphere)!
        .clone()
        .applyMatrix4(mesh.matrixWorld);
      if (!frustum.intersectsSphere(sphere)) return;
    }
    let p: THREE.Object3D | null = mesh;
    while (p && !p.name) p = p.parent;
    const name = p?.name || 'senza nome';
    const r = rows.get(name) ?? { draws: 0, triangles: 0 };
    r.draws += 1;
    r.triangles += trianglesOf(mesh);
    rows.set(name, r);
  });
  return [...rows.entries()].map(([name, r]) => ({ name, ...r })).sort((a, b) => b.triangles - a.triangles);
}
