// Schermata iniziale (GDD sezione 8; skill ux-ui-arcade-idle, UX12): logo PATRÓN sopra l'impero
// completo, un pulsante GIOCA attivo da subito. Un clic ovunque, Invio o Spazio avviano la partita.

export interface TitleScreen {
  /** Si risolve al primo clic, Invio o Spazio. */
  readonly started: Promise<void>;
  /** Avvio immediato senza animazione (screenshot automatici). */
  start(): void;
}

export function createTitleScreen(root: HTMLElement): TitleScreen {
  const el = document.createElement('div');
  el.className = 'title';
  el.innerHTML = `
    <div class="title__bar title__bar--top"><span>VALLE DE SOMBRA · 1981</span></div>
    <div class="title__logo" aria-label="PATRÓN">
      <svg class="title__word" viewBox="0 0 1000 300" aria-hidden="true">
        <defs>
          <linearGradient id="title-gold" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0.2" stop-color="#ffe08a" />
            <stop offset="0.85" stop-color="#c8902e" />
          </linearGradient>
        </defs>
        <text x="500" y="250" text-anchor="middle" fill="#1b1b2f" opacity="0.55" transform="translate(0 16)">PATRON</text>
        <text class="title__text" x="500" y="250" text-anchor="middle" fill="url(#title-gold)" stroke="#1b1b2f" stroke-width="16" stroke-linejoin="round" paint-order="stroke">PATRON</text>
        <path class="title__leaf" d="M0 0 C 18 -30 52 -34 70 -22 C 58 4 26 16 0 0 Z" fill="#5ce1e6" stroke="#1b1b2f" stroke-width="7" stroke-linejoin="round" />
      </svg>
      <span class="title__sub">DAL CAMPO ALL'IMPERO</span>
    </div>
    <button class="title__play" type="button">GIOCA</button>
    <div class="title__hint">clicca ovunque per giocare</div>
    <div class="title__bar title__bar--bottom"><span>Beta 0.1</span></div>`;
  root.append(el);
  root.classList.add('is-title');

  // L'accento sulla Ó è una foglia di Lumina (GDD sezione 8): si posa sopra la O quando il carattere è pronto.
  const placeLeaf = (): void => {
    const text = el.querySelector<SVGTextElement>('.title__text');
    const leaf = el.querySelector<SVGPathElement>('.title__leaf');
    if (!text || !leaf) return;
    try {
      const o = text.getExtentOfChar(4);
      leaf.setAttribute('transform', `translate(${o.x + o.width * 0.34} ${o.y + o.height * 0.36}) rotate(-18)`);
    } catch {
      leaf.setAttribute('transform', 'translate(700 60)');
    }
  };
  placeLeaf();
  void document.fonts?.ready.then(placeLeaf);

  let resolve!: () => void;
  const started = new Promise<void>((r) => (resolve = r));
  let done = false;
  const go = (): void => {
    if (done) return;
    done = true;
    removeEventListener('keydown', onKey, true);
    el.classList.add('is-leaving');
    root.classList.remove('is-title');
    setTimeout(() => el.remove(), 450);
    resolve();
  };
  const onKey = (e: KeyboardEvent): void => {
    if (e.code === 'Enter' || e.code === 'Space' || e.code === 'NumpadEnter') {
      e.preventDefault();
      e.stopImmediatePropagation();
      go();
    }
  };
  el.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    go();
  });
  addEventListener('keydown', onKey, true);
  return { started, start: go };
}
