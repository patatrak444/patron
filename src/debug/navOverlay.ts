// Griglia dei percorsi mostrata dal pannello debug: celle bloccate in rosso, percorso attuale in magenta.

import * as THREE from 'three';
import { toWorld, type MapPoint } from '../config/map';
import type { NavGrid } from '../sim/pathfinding';
import { PALETTE } from '../world/palette';

export class NavOverlay {
  readonly root = new THREE.Group();
  private readonly pathLine: THREE.Line;
  private readonly pathGeo = new THREE.BufferGeometry();

  constructor(grid: NavGrid) {
    const w = grid.cols * grid.cellSize;
    const d = grid.rows * grid.cellSize;

    // Celle bloccate come texture, un pixel per cella.
    const data = new Uint8Array(grid.cols * grid.rows * 4);
    for (let i = 0; i < grid.blocked.length; i++) {
      // Le righe della texture partono dal basso, come le righe della griglia (sud).
      data.set(grid.blocked[i] ? [227, 59, 59, 120] : [0, 0, 0, 0], i * 4);
    }
    const tex = new THREE.DataTexture(data, grid.cols, grid.rows);
    tex.magFilter = THREE.NearestFilter;
    tex.needsUpdate = true;
    const cells = new THREE.Mesh(
      new THREE.PlaneGeometry(w, d),
      new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }),
    );
    cells.rotation.x = -Math.PI / 2;
    cells.position.set(w / 2, 0.05, -d / 2);

    // Linee della griglia.
    const pts: number[] = [];
    for (let c = 0; c <= grid.cols; c++) pts.push(c, 0.06, 0, c, 0.06, -d);
    for (let r = 0; r <= grid.rows; r++) pts.push(0, 0.06, -r, w, 0.06, -r);
    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    const lines = new THREE.LineSegments(
      lineGeo,
      new THREE.LineBasicMaterial({ color: PALETTE.white, transparent: true, opacity: 0.25 }),
    );

    this.pathLine = new THREE.Line(this.pathGeo, new THREE.LineBasicMaterial({ color: PALETTE.magenta }));
    this.root.add(cells, lines, this.pathLine);
    this.root.visible = false;
  }

  toggle(): boolean {
    this.root.visible = !this.root.visible;
    return this.root.visible;
  }

  update(from: MapPoint, path: readonly MapPoint[]): void {
    if (!this.root.visible) return;
    const pts = [from, ...path].flatMap((p) => {
      const w = toWorld(p);
      return [w.x, 0.08, w.z];
    });
    this.pathGeo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
  }
}
