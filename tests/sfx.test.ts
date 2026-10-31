// Effetti sonori collegati agli eventi (GDD sezione 11), con un motore finto che registra i suoni.

import { describe, expect, it } from 'vitest';
import { BALANCE } from '../src/config/balance';
import { createBus, type GameEvents } from '../src/core/bus';
import { Sfx, type SoundEngine } from '../src/audio/sfx';

function fake() {
  const log: { at: number; len: number }[] = [];
  let t = 0;
  const engine: SoundEngine = {
    buildSamples: (...p) => new Array(Math.round(((p[3] ?? 0) + (p[4] ?? 0) + (p[5] ?? 0)) * 1000) + 10).fill(0.1),
    play: (samples, _v, rate) => log.push({ at: t, len: samples.length / rate }),
    now: () => t,
    running: true,
    resume: () => {},
  };
  const sfx = new Sfx(BALANCE.audio, engine);
  const bus = createBus<GameEvents>();
  sfx.attach(bus);
  return { sfx, bus, log, advance: (dt: number) => (t += dt) };
}

describe('effetti sonori', () => {
  it('ogni azione del GDD ha il suo suono', () => {
    const f = fake();
    const emits: [keyof GameEvents, unknown, string][] = [
      ['stack:move', { dir: 'in', item: 'leaf' }, 'pick'],
      ['stack:move', { dir: 'out', item: 'leaf' }, 'drop'],
      ['cash:collect', { amount: 5, pile: 'truck' }, 'cash'],
      ['truck:sale', { amount: 5 }, 'coin'],
      ['pad:pay', { amount: 1, progress: 0.5 }, 'pay'],
      ['truck:arriving', {}, 'horn'],
      ['bonfire:burn', {}, 'fire'],
      ['worker:sleep', { id: 'p' }, 'snore'],
      ['worker:wake', { id: 'p' }, 'hey'],
      ['upgrade', { id: 'shoes', level: 1 }, 'upgrade'],
    ];
    for (const [ev, payload, sound] of emits) {
      f.advance(1);
      f.bus.emit(ev, payload as never);
      expect(f.sfx.played[sound], sound).toBe(1);
    }
  });

  it('con i passi reali della logica (1/30 s) si sente ogni pezzo raccolto, e la scala non salta', () => {
    const f = fake();
    // Un pezzo ogni 0,08 s, contato a passi di 1/30 s come in stepPlayerZones: arrivano a 0,067 o 0,1 s.
    let acc = 0.08;
    let pieces = 0;
    for (let i = 0; i < 30; i++) {
      acc += 1 / 30;
      while (acc >= 0.08) {
        acc -= 0.08;
        f.bus.emit('stack:move', { dir: 'in', item: 'leaf' });
        pieces++;
      }
      f.advance(1 / 30);
    }
    expect(f.sfx.played.pick).toBe(pieces);
    // Ogni pop più acuto del precedente fino al dodicesimo semitono.
    for (let i = 1; i < 12; i++) expect(f.log[i]!.len).toBeLessThan(f.log[i - 1]!.len);
  });

  it('il pop suona a ogni pezzo, 12 al secondo, e sale di tono (campioni più corti)', () => {
    const f = fake();
    for (let i = 0; i < 12; i++) {
      f.bus.emit('stack:move', { dir: 'in', item: 'leaf' });
      f.advance(0.08);
    }
    expect(f.sfx.played.pick).toBe(12);
    expect(f.log[11]!.len).toBeLessThan(f.log[0]!.len * 0.6);
  });

  it("la fanfara dura circa 1,2 s, segue il tempo del gioco e si ferma in pausa; un'assunzione dice \"Hey!\"", () => {
    const f = fake();
    f.bus.emit('unlock', { id: 'picker1' });
    expect(f.sfx.played.hey).toBe(1);
    f.sfx.update(0.1);
    const first = f.sfx.played.note ?? 0;
    expect(first).toBe(1);
    // In pausa (dt = 0) non parte nessuna nota.
    for (let i = 0; i < 50; i++) f.sfx.update(0);
    expect(f.sfx.played.note).toBe(first);
    for (let t = 0; t < 2; t += 1 / 60) {
      f.advance(1 / 60);
      f.sfx.update(1 / 60);
    }
    expect(f.sfx.played.note).toBe(BALANCE.audio.fanfare.length);
    expect(f.sfx.played.sparkle).toBe(BALANCE.phase1.respect.starsPerUnlock);
  });

  it('una melodia alla volta: il jingle del livello parte dopo la fanfara', () => {
    const f = fake();
    f.bus.emit('unlock', { id: 'field1' });
    f.bus.emit('respect:level', { level: 2 });
    for (let t = 0; t < 0.8; t += 1 / 60) {
      f.advance(1 / 60);
      f.sfx.update(1 / 60);
    }
    expect(f.sfx.played.note).toBe(BALANCE.audio.fanfare.length);
    for (let t = 0; t < 3; t += 1 / 60) {
      f.advance(1 / 60);
      f.sfx.update(1 / 60);
    }
    expect(f.sfx.played.note).toBe(BALANCE.audio.fanfare.length + BALANCE.audio.levelJingle.length);
  });

  it('M toglie tutto, e durante la preparazione delle scene di debug non suona niente', () => {
    const f = fake();
    f.sfx.toggleMute();
    f.bus.emit('truck:sale', { amount: 5 });
    f.sfx.toggleMute();
    f.sfx.silent = true;
    f.bus.emit('unlock', { id: 'field1' });
    f.sfx.update(5);
    f.sfx.silent = false;
    expect(f.log.length).toBe(0);
  });

  it('senza motore (prima del primo clic) non succede niente', () => {
    const sfx = new Sfx(BALANCE.audio);
    const bus = createBus<GameEvents>();
    sfx.attach(bus);
    bus.emit('truck:sale', { amount: 5 });
    expect(sfx.played.coin).toBeUndefined();
  });
});
