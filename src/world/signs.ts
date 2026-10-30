// Cartelli «cosa entra → cosa esce» sopra le stazioni (GDD sezione 10, «Le stazioni sono macchine
// che si spiegano da sole»). Un'immagine sempre rivolta alla camera, leggibile da ogni punto.

import * as THREE from 'three';

export type SignItem = 'leaf' | 'paste' | 'crystal';

function drawItem(ctx: CanvasRenderingContext2D, item: SignItem, cx: number, cy: number): void {
  if (item === 'leaf') {
    // Tre foglie a ventaglio con le punte azzurre della Lumina.
    for (const a of [-0.55, 0, 0.55]) {
      ctx.save();
      ctx.translate(cx, cy + 26);
      ctx.rotate(a);
      ctx.fillStyle = '#3fc24a';
      ctx.beginPath();
      ctx.ellipse(0, -28, 12, 30, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#5ce1e6';
      ctx.beginPath();
      ctx.ellipse(0, -52, 6, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  } else if (item === 'paste') {
    // Panetto beige con la fascia azzurra, in prospettiva.
    ctx.fillStyle = '#c9b182';
    ctx.beginPath();
    ctx.moveTo(cx - 34, cy - 4);
    ctx.lineTo(cx - 14, cy - 22);
    ctx.lineTo(cx + 40, cy - 22);
    ctx.lineTo(cx + 34, cy - 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#e8d3a6';
    ctx.fillRect(cx - 34, cy - 4, 68, 30);
    ctx.fillStyle = '#4fc3d9';
    ctx.fillRect(cx - 8, cy - 4, 16, 30);
  } else {
    ctx.fillStyle = '#5ce1e6';
    ctx.beginPath();
    ctx.moveTo(cx, cy - 32);
    ctx.lineTo(cx + 24, cy);
    ctx.lineTo(cx, cy + 32);
    ctx.lineTo(cx - 24, cy);
    ctx.closePath();
    ctx.fill();
  }
}

/** Cartello rotondo bianco con `from` → `to`; largo `width` metri nel mondo. */
export function createRecipeSign(from: SignItem, to: SignItem, width = 1.9): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#1b1b2f';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.roundRect(6, 6, 244, 116, 40);
  ctx.fill();
  ctx.stroke();
  drawItem(ctx, from, 62, 64);
  drawItem(ctx, to, 192, 64);
  // Freccia scura al centro.
  ctx.fillStyle = '#1b1b2f';
  ctx.beginPath();
  ctx.moveTo(110, 54);
  ctx.lineTo(130, 54);
  ctx.lineTo(130, 40);
  ctx.lineTo(154, 64);
  ctx.lineTo(130, 88);
  ctx.lineTo(130, 74);
  ctx.lineTo(110, 74);
  ctx.closePath();
  ctx.fill();
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  // Appena sotto il bianco pieno, come le etichette: fuori dal bloom.
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, color: 0xe6e6e6, depthWrite: false, transparent: true }));
  sprite.name = 'cartello';
  sprite.scale.set(width, width / 2, 1);
  sprite.center.set(0.5, 0);
  sprite.renderOrder = 9;
  // Non blocca la vista: la trasparenza degli oggetti davanti al giocatore lo ignora.
  sprite.raycast = () => {};
  return sprite;
}
