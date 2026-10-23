// Controlli sul dispositivo prima di avviare il gioco (GDD sezione 2).

import { BALANCE } from '../config/balance';

/** Telefono o tablet senza mouse: il gioco non parte. */
export function isTouchOnlyDevice(): boolean {
  return matchMedia('(pointer: coarse)').matches && !matchMedia('(any-pointer: fine)').matches;
}

export function hasWebGL2(): boolean {
  try {
    return document.createElement('canvas').getContext('webgl2') !== null;
  } catch {
    return false;
  }
}

/** Schermata fissa che sostituisce il gioco. */
export function showBlockingMessage(root: HTMLElement, title: string, body: string, withCopyLink: boolean): void {
  const box = document.createElement('div');
  box.className = 'gate';
  box.innerHTML = `
    <div class="gate__logo">PATR<span class="gate__accent">Ó</span>N</div>
    <p class="gate__title"></p>
    <p class="gate__body"></p>
  `;
  box.querySelector('.gate__title')!.textContent = title;
  box.querySelector('.gate__body')!.textContent = body;

  if (withCopyLink) {
    const button = document.createElement('button');
    button.className = 'btn btn--gold';
    button.textContent = 'Copia il link';
    button.addEventListener('click', () => {
      void navigator.clipboard?.writeText(location.href).then(
        () => (button.textContent = 'Link copiato'),
        () => (button.textContent = location.href),
      );
    });
    box.append(button);
  }
  root.replaceChildren(box);
}

/** Invito ad allargare la finestra sotto la misura minima; si aggiorna da solo. */
export function installMinSizeNotice(root: HTMLElement): void {
  const notice = document.createElement('div');
  notice.className = 'min-size';
  notice.innerHTML = `<p>Allarga la finestra</p><span></span>`;
  root.append(notice);

  const { minWidth, minHeight } = BALANCE.screen;
  const update = (): void => {
    const tooSmall = innerWidth < minWidth || innerHeight < minHeight;
    notice.classList.toggle('is-visible', tooSmall);
    notice.querySelector('span')!.textContent =
      `Serve almeno ${minWidth} × ${minHeight}; ora è ${innerWidth} × ${innerHeight}.`;
  };
  addEventListener('resize', update);
  update();
}
