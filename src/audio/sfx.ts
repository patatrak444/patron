// Effetti sonori generati da codice con ZzFX (GDD sezione 11): nessun file audio. Ascoltano il bus degli
// eventi (GDD sezione 14). Il motore si carica solo al primo clic o tasto (vincolo dei browser), il tasto M
// toglie e rimette l'audio, le melodie seguono il tempo del gioco e si fermano in pausa.

import type { AudioConfig } from '../config/balance';
import type { Bus, GameEvents } from '../core/bus';
import { createRng, type Rng } from '../core/rng';
import { SoundGate } from './gate';

type Params = readonly (number | undefined)[];

/** Il motore che produce e suona i campioni: ZzFX nel gioco, uno finto nei test. */
export interface SoundEngine {
  buildSamples(...parameters: (number | undefined)[]): number[];
  play(samples: number[], volume: number): void;
  /** Secondi dell'orologio audio. */
  now(): number;
  readonly running: boolean;
  resume(): void;
}

/**
 * Parametri ZzFX 1.4: volume, casualità, frequenza, attacco, tenuta, rilascio, forma, curva, scivolo,
 * scivolo2, salto di tono, tempo del salto, ripetizione, rumore, modulazione, crunch, eco, volume di
 * tenuta, decadimento, tremolo. Forme: 0 seno, 1 triangolo, 2 sega, 3 tan, 4 rumore. La casualità resta a
 * 0: le varianti le fa il gioco con il generatore con seme.
 */
export const SOUNDS = {
  // Pop corto e tondo della raccolta: sale di un semitono a ogni pezzo di fila.
  pick: [0.5, 0, 520, 0.005, 0.02, 0.07, 1, 1.6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.6, 0.01],
  // Tonfo quando un pezzo arriva alla macchina: abbastanza acuto da sentirsi anche da altoparlanti piccoli.
  drop: [0.85, 0, 230, 0.005, 0.03, 0.1, 1, 2.2, -5, 0, 0, 0, 0, 0.3, 0, 0, 0, 0.5, 0.02],
  // Tintinnio di cassa: due note veloci.
  cash: [0.95, 0, 1500, 0, 0.03, 0.12, 1, 1.8, 0, 0, 700, 0.04, 0, 0, 0, 0, 0, 0.5],
  // Moneta a ogni vendita al camion.
  coin: [0.8, 0, 1900, 0, 0.02, 0.15, 1, 1.5, 0, 0, 950, 0.03, 0, 0, 0, 0, 0, 0.4],
  // Tic del pagamento: secco, sale di tono man mano che il prezzo scende.
  pay: [0.55, 0, 880, 0, 0.01, 0.04, 0, 1.4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.4],
  // Nota della fanfara e del jingle: onda a sega morbida, suonata a gradini.
  note: [0.85, 0, 523, 0.01, 0.14, 0.24, 2, 1.2, 0, 0, 0, 0, 0, 0, 0, 0, 0.04, 0.7, 0.05],
  // Stellina: una per ogni stella guadagnata.
  sparkle: [0.55, 0, 1800, 0, 0.02, 0.18, 0, 1.5, 0, 0, 900, 0.05, 0.06, 0, 0, 0, 0, 0.5],
  // Clacson del camion: due toni (salto di tono a metà).
  horn: [0.42, 0, 233, 0.02, 0.32, 0.1, 2, 0.8, 0, 0, 62, 0.18, 0, 0.05, 0, 0, 0, 0.9, 0.02],
  // Fiammata del Falò: rumore che sale e svanisce.
  fire: [0.5, 0, 120, 0.04, 0.12, 0.35, 4, 1, 4, 0, 0, 0, 0, 1.2, 0, 0, 0, 0.6, 0.1],
  // Russare del lavoratore addormentato: rumore che scende, ripetuto due volte.
  snore: [0.5, 0, 160, 0.15, 0.2, 0.25, 4, 1, -3, 0, 0, 0, 0.32, 0.6, 0, 0, 0, 0.6],
  // "Hey!": nota che sale, al risveglio e all'assunzione.
  hey: [0.6, 0, 330, 0.01, 0.06, 0.12, 2, 1, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0.7],
  // Acquisto di un potenziamento.
  upgrade: [1, 0, 660, 0.01, 0.08, 0.2, 1, 1.5, 0, 0, 330, 0.08, 0, 0, 0, 0, 0.03, 0.6],
  // Clic dei pulsanti.
  click: [0.4, 0, 1100, 0, 0.005, 0.03, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.3],
} satisfies Record<string, Params>;

export type SoundName = keyof typeof SOUNDS;

/** Durata di un suono: attacco, tenuta, rilascio ed eco, in secondi. */
function duration(p: Params): number {
  return (p[3] ?? 0) + (p[4] ?? 0) + (p[5] ?? 0) + (p[16] ?? 0);
}

/** Variazione di tono delle 3 varianti di ogni suono: −3%, 0, +3%. */
const VARIANTS = [0.97, 1, 1.03];

interface QueuedNote {
  /** Secondi di gioco dall'inizio della melodia. */
  readonly at: number;
  readonly name: SoundName;
  readonly pitch: number;
}

export class Sfx {
  muted = false;
  /** Vero durante la preparazione delle scene di debug: nessun suono. */
  silent = false;
  /** Suoni partiti per nome: serve alla verifica automatica, che non può ascoltarli. */
  readonly played: Record<string, number> = {};
  private readonly cache = new Map<string, number[]>();
  private readonly gate: SoundGate;
  private readonly rng: Rng;
  /** Melodie in coda, una alla volta, sul tempo del gioco. */
  private readonly melodies: QueuedNote[][] = [];
  private melodyTime = 0;

  constructor(
    private readonly cfg: AudioConfig,
    private engine: SoundEngine | null = null,
  ) {
    this.gate = new SoundGate(cfg);
    this.rng = createRng(cfg.seed);
  }

  /** Il primo clic o tasto carica il motore e sblocca l'audio del browser (GDD sezione 8). */
  async unlock(load: () => Promise<SoundEngine>): Promise<void> {
    if (!this.engine) this.engine = await load();
    if (!this.engine.running) this.engine.resume();
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    if (this.muted) this.melodies.length = 0;
    return this.muted;
  }

  /** Un suono singolo, se il motore c'è, l'audio è attivo e i limiti lo permettono. */
  play(name: SoundName, pitch = 1): void {
    const e = this.engine;
    if (!e || !e.running || this.muted || this.silent) return;
    const p = SOUNDS[name];
    if (!this.gate.allow(name, e.now(), duration(p))) return;
    const v = this.rng.int(0, VARIANTS.length - 1);
    const key = `${name}:${v}`;
    let samples = this.cache.get(key);
    if (!samples) {
      const q = [...p];
      q[2] = (q[2] ?? 0) * VARIANTS[v]!;
      samples = e.buildSamples(...q);
      this.cache.set(key, samples);
    }
    e.play(this.resample(samples, pitch), this.cfg.effectsVolume);
    this.played[name] = (this.played[name] ?? 0) + 1;
  }

  /** Tono diverso senza ricostruire il suono: si ricampiona (più veloce = più acuto). */
  private resample(samples: number[], pitch: number): number[] {
    if (Math.abs(pitch - 1) < 1e-3) return samples;
    const out = new Array<number>(Math.floor(samples.length / pitch));
    for (let i = 0; i < out.length; i++) out[i] = samples[Math.floor(i * pitch)] ?? 0;
    return out;
  }

  /** Mette in coda una melodia: parte quando è finita quella prima. */
  private melody(notes: QueuedNote[]): void {
    if (this.muted || this.silent || !this.engine?.running) return;
    if (this.melodies.length === 0) this.melodyTime = 0;
    this.melodies.push(notes.slice());
  }

  /** Avanza le melodie col tempo del gioco: `dt` è 0 in pausa, e le note si fermano (GDD sezione 11). */
  update(dt: number): void {
    const m = this.melodies[0];
    if (!m) return;
    this.melodyTime += dt;
    while (m.length > 0 && m[0]!.at <= this.melodyTime) {
      const n = m.shift()!;
      this.play(n.name, n.pitch);
    }
    if (m.length === 0) {
      this.melodies.shift();
      this.melodyTime = 0;
    }
  }

  /** Collega ogni evento della logica al suo suono (GDD sezioni 10 e 11). */
  attach(bus: Bus<GameEvents>): void {
    const a = this.cfg;
    bus.on('stack:move', ({ dir }) => {
      if (dir === 'in') this.play('pick', this.gate.nextChainPitch(this.engine?.now() ?? 0));
      else this.play('drop');
    });
    bus.on('cash:collect', () => this.play('cash'));
    bus.on('truck:sale', () => this.play('coin'));
    bus.on('pad:pay', ({ progress }) => this.play('pay', 1 + progress * 0.9));
    bus.on('unlock', ({ id }) => {
      // Fanfara di circa 1,2 s, poi una stellina per ogni stella guadagnata; all'assunzione anche "Hey!".
      const notes: QueuedNote[] = a.fanfare.map((st, i) => ({ at: i * a.fanfareStep, name: 'note', pitch: 2 ** (st / 12) }));
      const end = a.fanfare.length * a.fanfareStep + 0.15;
      for (let i = 0; i < a.starsPerUnlock; i++) notes.push({ at: end + i * a.sparkleStep, name: 'sparkle', pitch: 1 + i * 0.12 });
      this.melody(notes);
      if (id.startsWith('picker')) this.play('hey', 1.1);
    });
    bus.on('respect:level', () => this.melody(a.levelJingle.map((st, i) => ({ at: i * a.levelStep, name: 'note', pitch: 2 ** (st / 12) }))));
    bus.on('truck:arriving', () => this.play('horn'));
    bus.on('truck:depart', () => this.play('horn'));
    bus.on('bonfire:burn', () => this.play('fire'));
    bus.on('worker:sleep', () => this.play('snore'));
    bus.on('worker:wake', () => this.play('hey'));
    bus.on('upgrade', () => {
      this.play('upgrade');
      this.melody([{ at: 0.25, name: 'sparkle', pitch: 1.2 }]);
    });
  }
}
