// Pannello debug, attivo con ?debug=1 nell'indirizzo (GDD sezione 14, principio 6).

import type { FixedStepper } from '../core/loop';
import type { GameState } from '../sim/state';

export function isDebugEnabled(): boolean {
  return new URLSearchParams(location.search).get('debug') === '1';
}

export interface DebugPanel {
  /** Da chiamare a ogni fotogramma. */
  frame(frameSeconds: number): void;
}

interface Action {
  label: string;
  /** Tappa in cui il pulsante diventa operativo. */
  from?: string;
  run?: (button: HTMLButtonElement) => void;
}

export interface DebugHooks {
  /** Mostra o nasconde la griglia dei percorsi; restituisce il nuovo stato. */
  toggleNavGrid(): boolean;
  /** Chiamate di disegno e triangoli dell'ultimo fotogramma (limiti della sezione 10). */
  renderStats(): { calls: number; triangles: number };
}

export function createDebugPanel(
  root: HTMLElement,
  stepper: FixedStepper,
  state: GameState,
  hooks: DebugHooks,
): DebugPanel {
  const panel = document.createElement('div');
  panel.className = 'debug';
  panel.innerHTML = `
    <div class="debug__title">DEBUG</div>
    <div class="debug__row"><span>FPS</span><b data-fps>–</b></div>
    <div class="debug__row"><span>Tempo</span><b data-time>0 s</b></div>
    <div class="debug__row"><span>Disegni</span><b data-calls>–</b></div>
    <div class="debug__row"><span>Triangoli</span><b data-tris>–</b></div>
    <div class="debug__row"><span>Posizione</span><b data-pos>–</b></div>
    <div class="debug__actions"></div>
  `;
  const fpsEl = panel.querySelector<HTMLElement>('[data-fps]')!;
  const timeEl = panel.querySelector<HTMLElement>('[data-time]')!;
  const posEl = panel.querySelector<HTMLElement>('[data-pos]')!;
  const callsEl = panel.querySelector<HTMLElement>('[data-calls]')!;
  const trisEl = panel.querySelector<HTMLElement>('[data-tris]')!;
  const actionsEl = panel.querySelector<HTMLElement>('.debug__actions')!;

  const actions: Action[] = [
    { label: '+$1.000', from: 'M2' },
    {
      label: 'Tempo × 10',
      run: (b) => {
        stepper.timeScale = stepper.timeScale === 1 ? 10 : 1;
        b.classList.toggle('is-on', stepper.timeScale !== 1);
      },
    },
    { label: 'Calore +20', from: 'M4' },
    { label: 'Avvia evento', from: 'M5' },
    { label: 'Griglia percorsi', run: (b) => b.classList.toggle('is-on', hooks.toggleNavGrid()) },
    { label: 'Reset', from: 'M6' },
  ];

  for (const action of actions) {
    const button = document.createElement('button');
    button.textContent = action.label;
    if (action.run) {
      button.addEventListener('click', () => action.run!(button));
    } else {
      button.disabled = true;
      button.title = `Disponibile dalla tappa ${action.from}`;
    }
    actionsEl.append(button);
  }
  root.append(panel);

  // FPS medi sull'ultimo mezzo secondo.
  let frames = 0;
  let elapsed = 0;
  return {
    frame(frameSeconds) {
      frames++;
      elapsed += frameSeconds;
      if (elapsed >= 0.5) {
        fpsEl.textContent = String(Math.round(frames / elapsed));
        timeEl.textContent = `${state.time.toFixed(1)} s`;
        const stats = hooks.renderStats();
        callsEl.textContent = String(stats.calls);
        trisEl.textContent = stats.triangles.toLocaleString('it-IT');
        posEl.textContent = `${state.player.x.toFixed(1)}, ${state.player.y.toFixed(1)}`;
        frames = 0;
        elapsed = 0;
      }
    },
  };
}
