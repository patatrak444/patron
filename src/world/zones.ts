// Tappetini e guida nel mondo (GDD sezioni 3, 9, 10 e 12): tappetini colorati delle zone, tappetino
// di sblocco con icona e prezzo, freccia gialla 3D sul prossimo obiettivo con un anello a terra.

import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { PALETTE } from './palette';

export type MatKind = 'pickup' | 'deposit' | 'cash';

function roundedSquare(size: number, r: number): THREE.ShapeGeometry {
  const s = size / 2;
  const sh = new THREE.Shape();
  sh.moveTo(-s + r, -s);
  sh.lineTo(s - r, -s);
  sh.quadraticCurveTo(s, -s, s, -s + r);
  sh.lineTo(s, s - r);
  sh.quadraticCurveTo(s, s, s - r, s);
  sh.lineTo(-s + r, s);
  sh.quadraticCurveTo(-s, s, -s, s - r);
  sh.lineTo(-s, -s + r);
  sh.quadraticCurveTo(-s, -s, -s + r, -s);
  const g = new THREE.ShapeGeometry(sh, 4);
  g.rotateX(-Math.PI / 2);
  return g;
}

/** Tappetini delle zone: un disegno per colore (GDD sezione 3). */
export class ZoneMats {
  readonly root = new THREE.Group();
  private readonly meshes: Record<MatKind, THREE.InstancedMesh>;
  private readonly counts: Record<MatKind, number> = { pickup: 0, deposit: 0, cash: 0 };
  private readonly m = new THREE.Matrix4();

  constructor() {
    this.root.name = 'tappetini';
    const geo = roundedSquare(1.5, 0.3);
    const colors: Record<MatKind, number> = { pickup: PALETTE.matPickup, deposit: PALETTE.matDeposit, cash: PALETTE.matCash };
    this.meshes = {} as Record<MatKind, THREE.InstancedMesh>;
    for (const k of Object.keys(colors) as MatKind[]) {
      const mat = new THREE.MeshLambertMaterial({ color: colors[k], transparent: true, opacity: 0.92, depthWrite: false });
      const mesh = new THREE.InstancedMesh(geo, mat, 24);
      mesh.receiveShadow = true;
      mesh.renderOrder = 1;
      mesh.frustumCulled = false;
      mesh.count = 0;
      this.meshes[k] = mesh;
      this.root.add(mesh);
    }
  }

  begin(): void {
    for (const k of Object.keys(this.counts) as MatKind[]) this.counts[k] = 0;
  }

  add(kind: MatKind, x: number, z: number): void {
    const i = this.counts[kind]++;
    this.m.makeTranslation(x, 0.025, z);
    this.meshes[kind].setMatrixAt(i, this.m);
  }

  end(): void {
    for (const k of Object.keys(this.counts) as MatKind[]) {
      this.meshes[k].count = this.counts[k];
      this.meshes[k].instanceMatrix.needsUpdate = true;
    }
  }
}

export type PadIcon = 'field' | 'worker' | 'press' | 'bonfire' | 'zone' | 'office';

const FONT = '"Baloo 2", "Trebuchet MS", Arial, sans-serif';

/**
 * Tappetino di sblocco: quadrato arancio con bordo bianco tratteggiato, icona di ciò che sblocca e
 * prezzo grande, come i riquadri "NEW ZONE 100" di Pizza Ready. Un anello si riempie durante il pagamento.
 */
export class UnlockPad {
  readonly root = new THREE.Group();
  private readonly canvas = document.createElement('canvas');
  private readonly texture: THREE.CanvasTexture;
  private readonly ring: THREE.Mesh;
  private readonly inner = new THREE.Group();
  private key = '';
  private progress = -1;
  private time = 0;

  constructor() {
    this.root.name = 'tappetino di sblocco';
    this.canvas.width = 256;
    this.canvas.height = 256;
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.anisotropy = 4;
    const plane = new THREE.Mesh(
      new THREE.PlaneGeometry(2.1, 2.1).rotateX(-Math.PI / 2),
      // Grigio chiaro al posto del bianco: sotto la soglia del bloom, il tappetino non abbaglia.
      new THREE.MeshBasicMaterial({ map: this.texture, color: 0xd6d6d6, transparent: true, depthWrite: false }),
    );
    plane.position.y = 0.03;
    plane.renderOrder = 2;
    this.ring = new THREE.Mesh(
      new THREE.BufferGeometry(),
      new THREE.MeshBasicMaterial({ color: 0xffd23a, depthWrite: false, side: THREE.DoubleSide }),
    );
    this.ring.position.y = 0.04;
    this.ring.renderOrder = 3;
    this.inner.add(plane, this.ring);
    this.root.add(this.inner);
    this.root.visible = false;
  }

  /**
   * `at` null nasconde il tappetino. Con `ghost` (lato in metri) è la sagoma dell'oggetto futuro:
   * impronta chiara con le parentesi agli angoli e il prezzo nel fumetto (skill arcade-idle, PS11).
   */
  update(at: { x: number; z: number } | null, icon: PadIcon, price: number, paid: number, dt: number, ghost?: number): void {
    this.root.visible = at !== null;
    if (!at) return;
    this.time += dt;
    this.root.position.set(at.x, 0, at.z);
    const side = ghost ? Math.max(2.1, ghost + 0.3) : 2.1;
    this.inner.scale.set(side / 2.1, 1, side / 2.1);
    // Respira piano: è il prossimo passo (GDD sezione 9).
    const s = 1 + 0.035 * Math.sin(this.time * 4);
    this.root.scale.set(s, 1, s);
    const left = Math.max(0, price - paid);
    const key = `${icon}:${left}:${ghost ?? 0}`;
    if (key !== this.key) {
      this.key = key;
      this.draw(icon, left, ghost !== undefined);
    }
    const p = price > 0 ? paid / price : 0;
    if (Math.abs(p - this.progress) > 0.005) {
      this.progress = p;
      this.ring.geometry.dispose();
      this.ring.geometry = new THREE.RingGeometry(1.0, 1.16, 48, 1, Math.PI / 2, Math.max(0.001, p) * Math.PI * 2).rotateX(-Math.PI / 2);
      this.ring.visible = p > 0;
    }
  }

  private draw(icon: PadIcon, price: number, ghost: boolean): void {
    const ctx = this.canvas.getContext('2d')!;
    const W = 256;
    ctx.clearRect(0, 0, W, W);
    const r = 46;
    const inset = 10;
    const path = (): void => {
      ctx.beginPath();
      ctx.moveTo(inset + r, inset);
      ctx.arcTo(W - inset, inset, W - inset, W - inset, r);
      ctx.arcTo(W - inset, W - inset, inset, W - inset, r);
      ctx.arcTo(inset, W - inset, inset, inset, r);
      ctx.arcTo(inset, inset, W - inset, inset, r);
      ctx.closePath();
    };
    if (ghost) {
      // Sagoma: velo bianco e parentesi agli angoli, come i posti vuoti di Monkey Mart.
      path();
      ctx.fillStyle = 'rgba(255,255,255,0.28)';
      ctx.fill();
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#ffffff';
      const a = 16;
      const b = 70;
      for (const [x, y, dx, dy] of [
        [a, a, 1, 1],
        [W - a, a, -1, 1],
        [a, W - a, 1, -1],
        [W - a, W - a, -1, -1],
      ] as const) {
        ctx.beginPath();
        ctx.moveTo(x, y + dy * b);
        ctx.lineTo(x, y);
        ctx.lineTo(x + dx * b, y);
        ctx.stroke();
      }
      // Fumetto del prezzo: pillola arancio al centro.
      ctx.fillStyle = 'rgba(242,140,60,0.95)';
      ctx.beginPath();
      ctx.roundRect(40, 60, W - 80, 150, 40);
      ctx.fill();
    } else {
      path();
      ctx.fillStyle = 'rgba(242,166,90,0.92)';
      ctx.fill();
      ctx.setLineDash([22, 14]);
      ctx.lineWidth = 9;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Icona bianca di ciò che si sblocca.
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#ffffff';
    const cx = W / 2;
    const cy = 92;
    if (icon === 'field') {
      for (const a of [-0.5, 0, 0.5]) {
        ctx.save();
        ctx.translate(cx, cy + 26);
        ctx.rotate(a);
        ctx.beginPath();
        ctx.ellipse(0, -30, 13, 32, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    } else if (icon === 'worker') {
      // Cappello di paglia sopra una testa tonda.
      ctx.beginPath();
      ctx.arc(cx, cy + 14, 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx, cy - 8, 50, 11, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx, cy - 18, 24, 18, 0, Math.PI, 0);
      ctx.fill();
    } else if (icon === 'bonfire') {
      // Fiamma a goccia con il cuore più piccolo.
      ctx.beginPath();
      ctx.moveTo(cx, cy - 46);
      ctx.quadraticCurveTo(cx + 40, cy, cx + 26, cy + 30);
      ctx.quadraticCurveTo(cx, cy + 48, cx - 26, cy + 30);
      ctx.quadraticCurveTo(cx - 40, cy, cx, cy - 46);
      ctx.fill();
    } else if (icon === 'office') {
      // Freccia in su: si diventa più forti (potenziamenti, GDD sezione 12).
      ctx.beginPath();
      ctx.moveTo(cx, cy - 48);
      ctx.lineTo(cx + 42, cy);
      ctx.lineTo(cx + 16, cy);
      ctx.lineTo(cx + 16, cy + 40);
      ctx.lineTo(cx - 16, cy + 40);
      ctx.lineTo(cx - 16, cy);
      ctx.lineTo(cx - 42, cy);
      ctx.closePath();
      ctx.fill();
    } else if (icon === 'zone') {
      // Quattro frecce verso l'esterno: la Hacienda si allarga.
      ctx.lineWidth = 12;
      ctx.lineCap = 'round';
      for (const [dx, dy] of [
        [1, 1],
        [-1, 1],
        [1, -1],
        [-1, -1],
      ] as const) {
        const x = cx + dx * 40;
        const y = cy + dy * 34;
        ctx.beginPath();
        ctx.moveTo(cx + dx * 12, cy + dy * 10);
        ctx.lineTo(x, y);
        ctx.moveTo(x - dx * 22, y);
        ctx.lineTo(x, y);
        ctx.lineTo(x, y - dy * 22);
        ctx.stroke();
      }
    } else {
      // Pressa: basamento, telaio e pistone.
      ctx.fillRect(cx - 44, cy + 18, 88, 22);
      ctx.fillRect(cx - 40, cy - 34, 14, 54);
      ctx.fillRect(cx + 26, cy - 34, 14, 54);
      ctx.fillRect(cx - 44, cy - 42, 88, 14);
      ctx.fillRect(cx - 7, cy - 28, 14, 30);
    }

    // Prezzo grande con l'icona della mazzetta.
    ctx.font = `800 70px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const text = `${price}`;
    const tw = ctx.measureText(text).width;
    const billW = 44;
    const total = tw + billW + 12;
    const x0 = cx - total / 2;
    ctx.lineJoin = 'round';
    ctx.lineWidth = 10;
    ctx.strokeStyle = 'rgba(27,27,47,0.55)';
    ctx.strokeText(text, x0 + tw / 2, 186);
    ctx.fillStyle = '#ffffff';
    ctx.fillText(text, x0 + tw / 2, 186);
    const bx = x0 + tw + 12;
    ctx.fillStyle = '#2ecc52';
    ctx.fillRect(bx, 172, billW, 28);
    ctx.fillStyle = '#e9ffd9';
    ctx.fillRect(bx + billW / 2 - 6, 172, 12, 28);
    this.texture.needsUpdate = true;
  }
}

/** Freccia gialla 3D che rimbalza sopra il prossimo obiettivo, con un anello a terra (GDD sezione 10). */
export class GoalArrow {
  readonly root = new THREE.Group();
  private readonly arrow = new THREE.Group();
  private readonly ring: THREE.Mesh;
  private time = 0;

  constructor() {
    this.root.name = 'freccia obiettivo';
    const mat = new THREE.MeshLambertMaterial({ color: 0xffd23a, emissive: 0x6b4a00, flatShading: true });
    // Punta e asta in una sola geometria: un disegno solo, anche nella mappa d'ombra.
    const headGeo = new THREE.ConeGeometry(0.42, 0.62, 4).toNonIndexed();
    headGeo.rotateX(Math.PI);
    headGeo.translate(0, 0.31, 0);
    const shaftGeo = new THREE.BoxGeometry(0.28, 0.55, 0.28).toNonIndexed();
    shaftGeo.translate(0, 0.88, 0);
    const arrowMesh = new THREE.Mesh(mergeGeometries([headGeo, shaftGeo])!, mat);
    arrowMesh.castShadow = true;
    this.arrow.add(arrowMesh);
    this.ring = new THREE.Mesh(
      new THREE.RingGeometry(0.62, 0.78, 32).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ color: 0xffd23a, transparent: true, opacity: 0.85, depthWrite: false }),
    );
    this.ring.position.y = 0.045;
    this.ring.renderOrder = 4;
    this.root.add(this.arrow, this.ring);
    this.root.visible = false;
  }

  /** `at` null nasconde la freccia; `lift` alza la freccia sopra un oggetto alto. */
  update(at: { x: number; z: number } | null, lift: number, dt: number): void {
    this.root.visible = at !== null;
    if (!at) return;
    this.time += dt;
    this.root.position.set(at.x, 0, at.z);
    this.arrow.position.y = 1.5 + lift + Math.abs(Math.sin(this.time * 3.2)) * 0.35;
    this.arrow.rotation.y = this.time * 1.2;
    const s = 1 + 0.15 * Math.sin(this.time * 5);
    this.ring.scale.set(s, 1, s);
  }
}
