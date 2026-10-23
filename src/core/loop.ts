// Ciclo a passo fisso (GDD sezione 14, principio 2).
// La logica avanza a passi fissi; il disegno avviene a ogni fotogramma.

export interface FixedStepOptions {
  step: number;
  maxFrameTime: number;
  maxStepsPerFrame: number;
  update(dt: number): void;
}

export interface FixedStepper {
  /** Moltiplicatore del tempo di gioco (tempo × 10 nel pannello debug). */
  timeScale: number;
  paused: boolean;
  /**
   * Fa avanzare la logica del tempo reale trascorso.
   * Restituisce i passi eseguiti e la frazione del passo successivo, per interpolare il disegno.
   */
  advance(frameSeconds: number): { steps: number; alpha: number };
}

export function createFixedStepper(opts: FixedStepOptions): FixedStepper {
  let accumulator = 0;

  const stepper: FixedStepper = {
    timeScale: 1,
    paused: false,
    advance(frameSeconds) {
      if (stepper.paused) return { steps: 0, alpha: accumulator / opts.step };

      const frame = Math.min(Math.max(frameSeconds, 0), opts.maxFrameTime);
      accumulator += frame * stepper.timeScale;

      let steps = 0;
      while (accumulator >= opts.step && steps < opts.maxStepsPerFrame) {
        opts.update(opts.step);
        accumulator -= opts.step;
        steps++;
      }
      // Se il tetto taglia i passi, il ritardo residuo si scarta invece di accumularsi.
      if (steps === opts.maxStepsPerFrame) accumulator = Math.min(accumulator, opts.step);

      return { steps, alpha: accumulator / opts.step };
    },
  };
  return stepper;
}

/** Avvia il ciclo del browser. Restituisce la funzione per fermarlo. */
export function startLoop(
  stepper: FixedStepper,
  render: (alpha: number, frameSeconds: number) => void,
): () => void {
  let last = performance.now();
  let handle = 0;

  const frame = (now: number): void => {
    const frameSeconds = (now - last) / 1000;
    last = now;
    const { alpha } = stepper.advance(frameSeconds);
    render(alpha, frameSeconds);
    handle = requestAnimationFrame(frame);
  };

  handle = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(handle);
}
