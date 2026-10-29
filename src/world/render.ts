// Disegno della scena con bloom solo sulle cose che brillano (GDD sezione 10).
// Il bloom ha una soglia alta: lo superano solo i materiali emissivi (Lumina, lampade).
// In qualità Media il bloom si spegne e si disegna direttamente.

import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import type { BloomConfig } from '../config/balance';

export type Quality = 'high' | 'medium';

/** Qualità grafica dall'indirizzo (?qualita=media); le impostazioni di M7 la renderanno una scelta del menu. */
export function qualityFromUrl(search: string): Quality {
  return new URLSearchParams(search).get('qualita') === 'media' ? 'medium' : 'high';
}

export interface Frame {
  render(): void;
  setSize(w: number, h: number, pixelRatio: number): void;
}

export function createFrame(
  renderer: THREE.WebGLRenderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  quality: Quality,
  bloom: BloomConfig,
): Frame {
  if (quality === 'medium') {
    return {
      render: () => renderer.render(scene, camera),
      setSize: (w, h, pr) => {
        renderer.setPixelRatio(pr);
        renderer.setSize(w, h);
      },
    };
  }
  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const pass = new UnrealBloomPass(new THREE.Vector2(256, 256), bloom.strength, bloom.radius, bloom.threshold);
  composer.addPass(pass);
  composer.addPass(new OutputPass());
  return {
    render: () => composer.render(),
    setSize: (w, h, pr) => {
      renderer.setPixelRatio(pr);
      renderer.setSize(w, h);
      composer.setPixelRatio(pr);
      // Il bloom lavora già da mezza risoluzione in giù: il costo resta contenuto.
      composer.setSize(w, h);
    },
  };
}
