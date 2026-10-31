// Motore audio ZzFX, caricato solo al primo gesto: ZzFX crea il contesto audio appena viene importato,
// e i browser lo vogliono solo dopo un clic o un tasto (GDD sezione 8).

import type { SoundEngine } from './sfx';

/**
 * Il contesto audio si crea e si riattiva subito, dentro il gesto: Safari vuole così. La libreria arriva
 * dopo, con l'import, e usa questo contesto al posto di quello che crea da sola.
 */
export function loadZzfx(masterVolume: number): () => Promise<SoundEngine> {
  const ctx = new AudioContext();
  void ctx.resume();
  return () => connect(ctx, masterVolume);
}

async function connect(ctx: AudioContext, masterVolume: number): Promise<SoundEngine> {
  const { ZZFX } = await import('zzfx');
  if (ZZFX.audioContext !== ctx) {
    void ZZFX.audioContext.close();
    ZZFX.audioContext = ctx;
  }
  ZZFX.volume = masterVolume;
  return {
    buildSamples: (...p) => ZZFX.buildSamples(...p),
    play: (samples, volume, rate) => void ZZFX.playSamples([samples], volume, rate),
    now: () => ZZFX.audioContext.currentTime,
    get running() {
      return ZZFX.audioContext.state === 'running';
    },
    resume: () => void ZZFX.audioContext.resume(),
  };
}
