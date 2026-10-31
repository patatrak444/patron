// Effetti sonori generati da codice con ZzFX (GDD sezione 11): nessun file audio. Ascoltano il bus degli
// eventi, come vuole l'architettura (GDD sezione 14). L'audio parte solo dopo il primo clic (vincolo dei
// browser) e il tasto M lo toglie e lo rimette.

import { ZZFX } from 'zzfx';
import type { AudioConfig } from '../config/balance';
import type { Bus, GameEvents } from '../core/bus';
import { SoundGate } from './gate';

type Params = (number | undefined)[];

/**
 * Parametri ZzFX: volume, casualità, frequenza, attacco, tenuta, rilascio, forma, curva, scivolo,
 * scivolo2, salto di tono, tempo del salto, ripetizione, rumore, modulazione, crunch, eco, volume di
 * tenuta, decadimento, tremolo. La piccola casualità dà le 2–3 varianti chieste dal GDD.
 */
const SOUNDS = {
  // Pop corto e tondo: sale di tono a ogni pezzo raccolto di fila.
  pick: [0.7, 0.04, 520, 0.005, 0.02, 0.07, 1, 1.6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.6, 0.01],
  // Tonfo morbido quando un pezzo arriva alla macchina.
  drop: [0.8, 0.05, 150, 0.005, 0.03, 0.1, 1, 2.2, -6, 0, 0, 0, 0, 0.3, 0, 0, 0, 0.5, 0.02],
  // Tintinnio di cassa: due note veloci.
  cash: [0.95, 0.05, 1500, 0, 0.03, 0.12, 1, 1.8, 0, 0, 700, 0.04, 0, 0, 0, 0, 0, 0.5],
  // Tic del pagamento: secco, sale di tono man mano che il prezzo scende.
  pay: [0.55, 0.02, 880, 0, 0.01, 0.04, 0, 1.4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.4],
  // Nota della fanfara: onda quadra morbida, suonata a gradini.
  note: [0.7, 0, 523, 0.01, 0.12, 0.22, 2, 1.2, 0, 0, 0, 0, 0, 0, 0, 0, 0.04, 0.7, 0.05],
  // Stellina della festa e del livello.
  sparkle: [0.5, 0.1, 1800, 0, 0.02, 0.18, 0, 1.5, 0, 0, 900, 0.05, 0.06, 0, 0, 0, 0, 0.5],
  // Clacson del camion: due toni a sega.
  horn: [0.38, 0, 233, 0.02, 0.28, 0.12, 2, 0.8, 0, 0, 0, 0, 0, 0.1, 6, 0, 0, 0.9, 0.04],
  // Fiammata del Falò: rumore che sale e svanisce.
  fire: [0.5, 0.1, 120, 0.04, 0.12, 0.35, 4, 1, 4, 0, 0, 0, 0, 1.2, 0, 0, 0, 0.6, 0.1],
  // Russare del lavoratore addormentato.
  snore: [0.35, 0.05, 70, 0.25, 0.25, 0.4, 0, 1, 0, 0, 0, 0, 0, 0.4, 0, 0, 0, 0.6, 0, 0.3],
  // "Hey!" del lavoratore che si sveglia: nota che sale.
  hey: [0.5, 0.05, 330, 0.01, 0.06, 0.12, 2, 1, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0.7],
  // Acquisto di un potenziamento.
  upgrade: [1, 0, 660, 0.01, 0.08, 0.2, 1, 1.5, 0, 0, 330, 0.08, 0, 0, 0, 0, 0.03, 0.6],
  // Clic dell'interfaccia.
  click: [0.3, 0, 1100, 0, 0.005, 0.03, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0.3],
} satisfies Record<string, Params>;

export type SoundName = keyof typeof SOUNDS;

/** Durata approssimata di un suono (attacco + tenuta + rilascio), per il conto delle voci. */
function duration(p: Params): number {
  return (p[3] ?? 0) + (p[4] ?? 0) + (p[5] ?? 0) + (p[16] ?? 0);
}

/** Semitoni della fanfara e del jingle del livello: do, mi, sol, do. */
const FANFARE = [0, 4, 7, 12];
const LEVEL = [0, 4, 7, 11, 12, 16];

export class Sfx {
  muted = false;
  /** Suoni partiti per nome: serve alla verifica automatica, che non può ascoltarli. */
  readonly played: Record<string, number> = {};
  private readonly cache = new Map<SoundName, number[]>();
  private readonly gate: SoundGate;

  constructor(cfg: AudioConfig) {
    this.gate = new SoundGate(cfg);
    ZZFX.volume = cfg.masterVolume * cfg.effectsVolume;
  }

  /** Il primo clic sblocca l'audio del browser (GDD sezione 8). */
  unlock(): void {
    if (ZZFX.audioContext.state !== 'running') void ZZFX.audioContext.resume();
  }

  toggleMute(): boolean {
    this.muted = !this.muted;
    return this.muted;
  }

  play(name: SoundName, pitch = 1, volume = 1): void {
    if (this.muted || ZZFX.audioContext.state !== 'running') return;
    const p = SOUNDS[name];
    if (!this.gate.allow(name, ZZFX.audioContext.currentTime, duration(p))) return;
    let samples = this.cache.get(name);
    if (!samples) {
      samples = ZZFX.buildSamples(...p);
      this.cache.set(name, samples);
    }
    ZZFX.playSamples([samples], volume, pitch);
    this.played[name] = (this.played[name] ?? 0) + 1;
  }

  /** Note in fila: la fanfara dello sblocco e il jingle del livello. */
  private tune(steps: readonly number[], every: number, then?: () => void): void {
    steps.forEach((st, i) => setTimeout(() => this.playFree('note', 2 ** (st / 12)), i * every * 1000));
    if (then) setTimeout(then, steps.length * every * 1000);
  }

  /** Come play, ma senza il limite per nome: le note di una melodia arrivano ravvicinate. */
  private playFree(name: SoundName, pitch: number): void {
    if (this.muted || ZZFX.audioContext.state !== 'running') return;
    let samples = this.cache.get(name);
    if (!samples) {
      samples = ZZFX.buildSamples(...SOUNDS[name]);
      this.cache.set(name, samples);
    }
    ZZFX.playSamples([samples], 1, pitch);
    this.played[name] = (this.played[name] ?? 0) + 1;
  }

  /** Collega ogni evento della logica al suo suono (GDD sezioni 10 e 11). */
  attach(bus: Bus<GameEvents>): void {
    bus.on('stack:move', ({ dir }) => {
      if (dir === 'in') this.play('pick', this.gate.nextChainPitch(ZZFX.audioContext.currentTime));
      else this.play('drop');
    });
    bus.on('cash:collect', () => this.play('cash', 1 + Math.random() * 0.1));
    bus.on('pad:pay', ({ progress }) => this.play('pay', 1 + progress * 0.9));
    bus.on('unlock', () =>
      this.tune(FANFARE, 0.12, () => {
        for (let i = 0; i < 5; i++) setTimeout(() => this.playFree('sparkle', 1 + i * 0.12), i * 260);
      }),
    );
    bus.on('respect:level', () => this.tune(LEVEL, 0.09));
    bus.on('truck:arriving', () => this.play('horn'));
    bus.on('truck:depart', () => this.play('horn', 1.12));
    bus.on('bonfire:burn', () => this.play('fire'));
    bus.on('worker:sleep', () => this.play('snore'));
    bus.on('worker:wake', () => this.play('hey'));
    bus.on('upgrade', () => this.play('upgrade'));
  }
}
