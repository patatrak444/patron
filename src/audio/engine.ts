// Motore audio ZzFX, caricato solo al primo gesto: ZzFX crea il contesto audio appena viene importato,
// e i browser lo vogliono solo dopo un clic o un tasto (GDD sezione 8).

import type { SoundEngine } from './sfx';

export async function loadZzfx(masterVolume: number): Promise<SoundEngine> {
  const { ZZFX } = await import('zzfx');
  ZZFX.volume = masterVolume;
  return {
    buildSamples: (...p) => ZZFX.buildSamples(...p),
    play: (samples, volume) => void ZZFX.playSamples([samples], volume),
    now: () => ZZFX.audioContext.currentTime,
    get running() {
      return ZZFX.audioContext.state === 'running';
    },
    resume: () => void ZZFX.audioContext.resume(),
  };
}
