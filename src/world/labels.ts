// Scritte nel mondo (GDD sezioni 10 e 12): contatori "n/max", MAX, prezzi, conti alla rovescia.
// Ogni scritta è uno sprite con una piccola texture disegnata su canvas, ridisegnata solo quando
// il testo cambia. Lo stile segue il genere: pillola bianca con testo scuro, MAX rosso in corsivo.

import * as THREE from 'three';
import { PALETTE } from './palette';

export type LabelStyle = 'pill' | 'max' | 'stop' | 'timer' | 'zzz' | 'zzzBig';

const FONT = '"Baloo 2", "Trebuchet MS", "Arial Rounded MT Bold", Arial, sans-serif';

function hex(c: number): string {
  return `#${c.toString(16).padStart(6, '0')}`;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  // arcTo invece di ctx.roundRect: Safari su Monterey non lo ha (GDD sezione 2).
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export class Label {
  readonly sprite: THREE.Sprite;
  private readonly canvas = document.createElement('canvas');
  private readonly ctx: CanvasRenderingContext2D;
  private readonly texture: THREE.CanvasTexture;
  private text = '';
  private style: LabelStyle | null = null;
  /** Altezza della scritta nel mondo, in metri. */
  private readonly worldHeight: number;

  constructor(worldHeight = 0.42) {
    this.worldHeight = worldHeight;
    this.canvas.width = 256;
    this.canvas.height = 96;
    this.ctx = this.canvas.getContext('2d')!;
    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.colorSpace = THREE.SRGBColorSpace;
    this.texture.anisotropy = 4;
    const mat = new THREE.SpriteMaterial({ map: this.texture, depthWrite: false, transparent: true });
    this.sprite = new THREE.Sprite(mat);
    this.sprite.renderOrder = 10;
    this.sprite.center.set(0.5, 0);
    this.sprite.visible = false;
  }

  set(text: string | null, style: LabelStyle = 'pill'): void {
    if (text === null) {
      this.sprite.visible = false;
      return;
    }
    this.sprite.visible = true;
    if (text === this.text && style === this.style) return;
    this.text = text;
    this.style = style;
    this.draw();
  }

  private draw(): void {
    const { ctx, canvas } = this;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const big = this.style === 'max' || this.style === 'stop';
    const size = this.style === 'zzzBig' ? 70 : big ? 62 : 54;
    ctx.font = `${this.style === 'max' ? 'italic ' : ''}800 ${size}px ${FONT}`;
    const w = Math.min(canvas.width - 8, ctx.measureText(this.text).width + 44);
    const x = (canvas.width - w) / 2;
    const h = 80;
    const y = (canvas.height - h) / 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if (this.style === 'pill' || this.style === 'timer') {
      roundRect(ctx, x, y, w, h, h / 2);
      ctx.fillStyle = this.style === 'timer' ? 'rgba(27,27,47,0.82)' : '#ffffff';
      ctx.fill();
      ctx.fillStyle = this.style === 'timer' ? '#ffffff' : hex(PALETTE.ink);
      ctx.fillText(this.text, canvas.width / 2, canvas.height / 2 + 3);
    } else {
      // Testo libero con contorno scuro: MAX rosso, STOP rosso, zzz bianco.
      ctx.lineJoin = 'round';
      ctx.lineWidth = 12;
      ctx.strokeStyle = hex(PALETTE.ink);
      ctx.strokeText(this.text, canvas.width / 2, canvas.height / 2 + 3);
      ctx.fillStyle = this.style === 'max' || this.style === 'stop' ? hex(PALETTE.policeRed) : '#ffffff';
      ctx.fillText(this.text, canvas.width / 2, canvas.height / 2 + 3);
    }
    this.texture.needsUpdate = true;
    // Larghezza del mondo in proporzione al canvas, così il testo non si deforma.
    this.sprite.scale.set((this.worldHeight * canvas.width) / canvas.height, this.worldHeight, 1);
  }
}
