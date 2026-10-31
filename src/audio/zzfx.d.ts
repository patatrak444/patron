// Tipi minimi per ZzFX (MIT, https://github.com/KilledByAPixel/ZzFX): la libreria non li fornisce.
declare module 'zzfx' {
  export const ZZFX: {
    volume: number;
    sampleRate: number;
    audioContext: AudioContext;
    buildSamples(...parameters: (number | undefined)[]): number[];
    playSamples(sampleChannels: number[][], volumeScale?: number, rate?: number, pan?: number, loop?: boolean): AudioBufferSourceNode;
  };
}
