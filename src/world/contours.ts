// Presa e consegna sulla macchina (GDD sezione 3; skill ux-ui-arcade-idle, UX2): niente quadrati
// colorati, solo un contorno bianco sottile attaccato al lato della macchina, con l'icona della merce
// e una freccia verso la macchina (consegna) o verso fuori (ritiro). Tutti i contorni sono una sola
// mesh, ricostruita quando cambia l'insieme di quelli visibili; tutte le icone sono un solo disegno.

import * as THREE from 'three';
import type { Contour, Rect, Side } from '../config/map';

/** Cosa mostra l'icona di un contorno. */
export type ContourIcon = 'leaf' | 'paste' | 'scrap' | 'office';

export interface ContourSpec {
  readonly contour: Contour;
  readonly icon: ContourIcon;
  /** Vero se la merce entra nella macchina: la freccia punta verso la macchina. */
  readonly into: boolean;
}

/** Celle dell'immagine delle icone: 4 colonne × 2 righe. */
const CELLS: Readonly<Record<ContourIcon | 'arrow', number>> = { leaf: 0, paste: 1, scrap: 2, arrow: 3, office: 4 };
const COLS = 4;
const ROWS = 2;
const CELL = 128;

const LINE = 0.18;
const LIFT = 0.025;
/** Fondo un po' più scuro della terra battuta: il contorno si legge come una sede nel pavimento. */
const FILL = new THREE.Color(0xc9a46a);
/** Bianco appena sotto la soglia del bloom: il bordo si vede ma non abbaglia. */
const EDGE = new THREE.Color(0xeeeeee);
const TRAY_EDGE = new THREE.Color(0x555b73);
const TRAY_FILL = new THREE.Color(0x3b3f52);

function drawAtlas(): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = COLS * CELL;
  c.height = ROWS * CELL;
  const ctx = c.getContext('2d')!;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  const cell = (i: number): [number, number] => [(i % COLS) * CELL + CELL / 2, Math.floor(i / COLS) * CELL + CELL / 2];
  const outline = (): void => {
    ctx.lineWidth = 9;
    ctx.strokeStyle = 'rgba(27,27,47,0.8)';
    ctx.stroke();
  };

  // Foglia: mazzo di tre foglie verdi con le punte azzurre.
  {
    const [x, y] = cell(CELLS.leaf);
    for (const a of [-0.55, 0, 0.55]) {
      ctx.save();
      ctx.translate(x, y + 30);
      ctx.rotate(a);
      ctx.beginPath();
      ctx.ellipse(0, -34, 15, 36, 0, 0, Math.PI * 2);
      outline();
      ctx.fillStyle = '#3fc24a';
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(0, -62, 6, 10, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#5ce1e6';
      ctx.fill();
      ctx.restore();
    }
  }
  // Panetto: mattonella beige con la fascia azzurra.
  {
    const [x, y] = cell(CELLS.paste);
    ctx.beginPath();
    ctx.roundRect(x - 44, y - 28, 88, 56, 12);
    outline();
    ctx.fillStyle = '#e8d3a6';
    ctx.fill();
    ctx.fillStyle = '#4fc3d9';
    ctx.fillRect(x - 10, y - 28, 20, 56);
  }
  // Scarti: sacco di juta con la legatura.
  {
    const [x, y] = cell(CELLS.scrap);
    ctx.beginPath();
    ctx.ellipse(x, y + 10, 40, 36, 0, 0, Math.PI * 2);
    outline();
    ctx.fillStyle = '#8a7a63';
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(x - 12, y - 24);
    ctx.lineTo(x + 12, y - 24);
    ctx.lineTo(x + 6, y - 44);
    ctx.lineTo(x - 6, y - 44);
    ctx.closePath();
    ctx.fillStyle = '#6b5c48';
    ctx.fill();
  }
  // Freccia bianca verso l'alto della cella: si gira con l'istanza.
  {
    const [x, y] = cell(CELLS.arrow);
    ctx.beginPath();
    ctx.moveTo(x, y - 50);
    ctx.lineTo(x + 40, y - 6);
    ctx.lineTo(x + 15, y - 6);
    ctx.lineTo(x + 15, y + 46);
    ctx.lineTo(x - 15, y + 46);
    ctx.lineTo(x - 15, y - 6);
    ctx.lineTo(x - 40, y - 6);
    ctx.closePath();
    outline();
    ctx.fillStyle = '#ffffff';
    ctx.fill();
  }
  // Ufficio: freccia bianca in su e la scritta UFFICIO a terra, come la stanza UPGRADE di Pizza Ready.
  {
    const [x, y] = cell(CELLS.office);
    ctx.beginPath();
    ctx.moveTo(x, y - 54);
    ctx.lineTo(x + 34, y - 18);
    ctx.lineTo(x + 13, y - 18);
    ctx.lineTo(x + 13, y + 14);
    ctx.lineTo(x - 13, y + 14);
    ctx.lineTo(x - 13, y - 18);
    ctx.lineTo(x - 34, y - 18);
    ctx.closePath();
    outline();
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.font = '800 30px "Baloo 2", "Trebuchet MS", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = 7;
    ctx.strokeStyle = '#ffffff';
    ctx.strokeText('UFFICIO', x, y + 40);
    ctx.fillStyle = '#1b1b2f';
    ctx.fillText('UFFICIO', x, y + 40);
  }
  return c;
}

/** Direzione verso l'esterno della macchina, nel piano XZ di Three.js (il nord è −z). */
function outward(side: Side): { x: number; z: number } {
  return side === 'n' ? { x: 0, z: -1 } : side === 's' ? { x: 0, z: 1 } : side === 'e' ? { x: 1, z: 0 } : { x: -1, z: 0 };
}

export class ContourLayer {
  readonly root = new THREE.Group();
  private readonly lines: THREE.Mesh;
  private readonly icons: THREE.InstancedMesh;
  private readonly cellAttr: THREE.InstancedBufferAttribute;
  private key = '';
  /** Rotazione che fa leggere le icone "in piedi" con la camera ruotata di 45°. */
  private readonly screenYaw: number;

  constructor(cameraYawDeg: number) {
    this.root.name = 'contorni';
    this.screenYaw = (-cameraYawDeg * Math.PI) / 180;
    this.lines = new THREE.Mesh(
      new THREE.BufferGeometry(),
      new THREE.MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false }),
    );
    this.lines.renderOrder = 1;
    this.lines.frustumCulled = false;

    const texture = new THREE.CanvasTexture(drawAtlas());
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    const geo = new THREE.PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
    this.cellAttr = new THREE.InstancedBufferAttribute(new Float32Array(32), 1);
    geo.setAttribute('cell', this.cellAttr);
    const mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false, color: 0xf2f2f2 });
    // Ogni istanza legge la sua cella dell'immagine delle icone.
    mat.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nattribute float cell;')
        .replace(
          '#include <uv_vertex>',
          `#include <uv_vertex>
           vec2 iuv = 0.5 + (uv - 0.5) * 0.82;
           vMapUv = vec2((mod(cell, ${COLS}.0) + iuv.x) / ${COLS}.0, 1.0 - (floor(cell / ${COLS}.0) + 1.0 - iuv.y) / ${ROWS}.0);`,
        );
    };
    this.icons = new THREE.InstancedMesh(geo, mat, 32);
    this.icons.count = 0;
    this.icons.renderOrder = 2;
    this.icons.frustumCulled = false;
    this.root.add(this.lines, this.icons);
  }

  /**
   * Mostra questi contorni e, se c'è, il vassoio scuro delle mazzette del camion (stessa mesh, nessun
   * disegno in più); ricostruisce solo se l'insieme è cambiato.
   */
  set(specs: readonly ContourSpec[], tray: Rect | null = null): void {
    const key = specs.map((s) => `${s.contour.x},${s.contour.y},${s.icon},${s.into}`).join('|') + (tray ? `|t${tray.x0},${tray.y0}` : '');
    if (key === this.key) return;
    this.key = key;
    this.buildLines(specs, tray);
    this.buildIcons(specs);
  }

  private buildLines(specs: readonly ContourSpec[], tray: Rect | null): void {
    const pos: number[] = [];
    const col: number[] = [];
    const quad = (x0: number, z0: number, x1: number, z1: number, c: THREE.Color, a: number): void => {
      pos.push(x0, LIFT, z0, x0, LIFT, z1, x1, LIFT, z1, x0, LIFT, z0, x1, LIFT, z1, x1, LIFT, z0);
      for (let i = 0; i < 6; i++) col.push(c.r, c.g, c.b, a);
    };
    for (const { contour } of specs) {
      const r = contour.draw;
      // Coordinate di Three.js: z = −y.
      const x0 = r.x0;
      const x1 = r.x1;
      const z0 = -r.y1;
      const z1 = -r.y0;
      quad(x0 + LINE, z0 + LINE, x1 - LINE, z1 - LINE, FILL, 0.58);
      // Bordo bianco sui tre lati liberi; il lato attaccato alla macchina resta aperto.
      const o = outward(contour.side);
      if (!(o.z === -1)) quad(x0, z1 - LINE, x1, z1, EDGE, 0.95); // lato sud (+z)
      if (!(o.z === 1)) quad(x0, z0, x1, z0 + LINE, EDGE, 0.95); // lato nord (−z)
      if (!(o.x === -1)) quad(x1 - LINE, z0, x1, z1, EDGE, 0.95); // lato est
      if (!(o.x === 1)) quad(x0, z0, x0 + LINE, z1, EDGE, 0.95); // lato ovest
    }
    if (tray) {
      // Vassoio: bordo grigio-blu e fondo scuro, come il ripiano del Torchio.
      quad(tray.x0 - 0.06, -tray.y1 - 0.06, tray.x1 + 0.06, -tray.y0 + 0.06, TRAY_EDGE, 1);
      quad(tray.x0 + 0.04, -tray.y1 + 0.04, tray.x1 - 0.04, -tray.y0 - 0.04, TRAY_FILL, 1);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('color', new THREE.Float32BufferAttribute(col, 4));
    this.lines.geometry.dispose();
    this.lines.geometry = g;
  }

  private buildIcons(specs: readonly ContourSpec[]): void {
    const m = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    const p = new THREE.Vector3();
    const sc = new THREE.Vector3();
    let n = 0;
    const put = (x: number, z: number, size: number, rot: number, cell: number): void => {
      if (n >= this.icons.instanceMatrix.count) return;
      m.compose(p.set(x, LIFT + 0.005, z), q.setFromAxisAngle(up, rot), sc.set(size, 1, size));
      this.icons.setMatrixAt(n, m);
      this.cellAttr.setX(n, cell);
      n++;
    };
    for (const { contour, icon, into } of specs) {
      const r = contour.draw;
      const cx = (r.x0 + r.x1) / 2;
      const cz = -(r.y0 + r.y1) / 2;
      const w = r.x1 - r.x0;
      const h = r.y1 - r.y0;
      const depth = Math.min(w, h);
      const size = depth * 0.98;
      // Icona e freccia una accanto all'altra lungo il lato lungo del contorno.
      const alongX = w >= h;
      const step = Math.min(Math.max(w, h) / 2 - size / 2, size * 0.6);
      const o = outward(contour.side);
      // Rotazione della freccia: la cella punta verso −z; la si gira verso la macchina o verso fuori.
      const dir = into ? { x: -o.x, z: -o.z } : o;
      const arrowRot = Math.atan2(-dir.x, -dir.z);
      if (icon === 'office') {
        put(cx, cz, Math.min(w, h) * 1.0, this.screenYaw, CELLS.office);
        continue;
      }
      put(cx - (alongX ? step : 0), cz + (alongX ? 0 : step), size, this.screenYaw, CELLS[icon]);
      put(cx + (alongX ? step : 0), cz - (alongX ? 0 : step), size * 0.85, arrowRot, CELLS.arrow);
    }
    this.icons.count = n;
    this.icons.instanceMatrix.needsUpdate = true;
    this.cellAttr.needsUpdate = true;
  }
}
