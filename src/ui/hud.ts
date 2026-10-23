// Elementi fissi dell'interfaccia (GDD sezione 12). Per ora solo l'indicatore di pausa.

export interface Hud {
  setPaused(paused: boolean): void;
}

export function createHud(root: HTMLElement): Hud {
  const pause = document.createElement('div');
  pause.className = 'pause-badge';
  pause.textContent = 'PAUSA · Spazio per riprendere';
  root.append(pause);
  return {
    setPaused: (paused) => pause.classList.toggle('is-visible', paused),
  };
}
