// Effetti del genere (skill arcade-idle, PS13–PS19; GDD sezione 10): coriandoli della festa di
// sblocco e sbuffi di polvere sotto i piedi. Ognuno è una sola InstancedMesh: un disegno a testa.

import * as THREE from 'three';

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  spin: number;
  life: number;
  max: number;
}

const CONFETTI_COLORS = [0xffd23a, 0xff5e7e, 0x4fc3d9, 0x2ecc52, 0xffffff, 0xf28c3c];
const MAX_CONFETTI = 120;

/** Coriandoli a pioggia: esplodono verso l'alto e ricadono girando. */
export class Confetti {
  readonly mesh: THREE.InstancedMesh;
  private readonly list: Particle[] = [];
  private readonly m = new THREE.Matrix4();
  private readonly q = new THREE.Quaternion();
  private readonly e = new THREE.Euler();
  private readonly p = new THREE.Vector3();
  private readonly s = new THREE.Vector3(1, 1, 1);
  private seed = 1;

  constructor() {
    const geo = new THREE.PlaneGeometry(0.14, 0.22);
    this.mesh = new THREE.InstancedMesh(geo, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }), MAX_CONFETTI);
    this.mesh.name = 'coriandoli';
    this.mesh.frustumCulled = false;
    this.mesh.count = 0;
    const c = new THREE.Color();
    for (let i = 0; i < MAX_CONFETTI; i++) this.mesh.setColorAt(i, c.setHex(CONFETTI_COLORS[i % CONFETTI_COLORS.length]!));
  }

  /** Pseudo-casuale locale: è solo un effetto visivo, la logica non lo vede. */
  private rand(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return this.seed / 2147483647;
  }

  burst(x: number, z: number, n = 60): void {
    for (let i = 0; i < n && this.list.length < MAX_CONFETTI; i++) {
      const a = this.rand() * Math.PI * 2;
      const sp = 1.5 + this.rand() * 2.5;
      this.list.push({ x, y: 1.2, z, vx: Math.cos(a) * sp, vy: 4 + this.rand() * 3, vz: Math.sin(a) * sp, spin: this.rand() * 10, life: 0, max: 1.3 + this.rand() * 0.5 });
    }
  }

  update(dt: number): void {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const p = this.list[i]!;
      p.life += dt;
      if (p.life >= p.max || p.y < 0) {
        this.list.splice(i, 1);
        continue;
      }
      p.vy -= 9 * dt;
      p.vx *= 1 - dt * 1.5;
      p.vz *= 1 - dt * 1.5;
      p.x += p.vx * dt;
      p.y += Math.max(p.vy, -1.6) * dt;
      p.z += p.vz * dt;
    }
    this.list.forEach((p, i) => {
      this.e.set(p.spin + p.life * 7, p.spin * 2 + p.life * 5, 0);
      this.m.compose(this.p.set(p.x, p.y, p.z), this.q.setFromEuler(this.e), this.s);
      this.mesh.setMatrixAt(i, this.m);
    });
    this.mesh.count = this.list.length;
    this.mesh.instanceMatrix.needsUpdate = true;
  }
}

const MAX_DUST = 24;

/** Sbuffi di polvere chiara: crescono e si sgonfiano dietro chi corre. */
export class Dust {
  readonly mesh: THREE.InstancedMesh;
  private readonly list: { x: number; z: number; life: number }[] = [];
  private readonly m = new THREE.Matrix4();
  private readonly v = new THREE.Vector3();
  private readonly s = new THREE.Vector3();
  private readonly q = new THREE.Quaternion();
  private readonly max = 0.45;

  constructor() {
    this.mesh = new THREE.InstancedMesh(new THREE.IcosahedronGeometry(0.16, 0), new THREE.MeshLambertMaterial({ color: 0xf6ecd6, flatShading: true }), MAX_DUST);
    this.mesh.name = 'polvere';
    this.mesh.frustumCulled = false;
    this.mesh.count = 0;
  }

  puff(x: number, z: number): void {
    if (this.list.length >= MAX_DUST) this.list.shift();
    this.list.push({ x, z, life: 0 });
  }

  update(dt: number): void {
    for (let i = this.list.length - 1; i >= 0; i--) {
      const d = this.list[i]!;
      d.life += dt;
      if (d.life >= this.max) this.list.splice(i, 1);
    }
    this.list.forEach((d, i) => {
      const k = d.life / this.max;
      const sc = Math.sin(k * Math.PI) * 1.2 + 0.01;
      this.m.compose(this.v.set(d.x, 0.08 + k * 0.25, d.z), this.q, this.s.setScalar(sc));
      this.mesh.setMatrixAt(i, this.m);
    });
    this.mesh.count = this.list.length;
    this.mesh.instanceMatrix.needsUpdate = true;
  }
}
