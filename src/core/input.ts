// Tastiera e mouse (GDD sezione 3).

const MOVE_KEYS: Readonly<Record<string, readonly [number, number]>> = {
  KeyW: [0, 1],
  ArrowUp: [0, 1],
  KeyS: [0, -1],
  ArrowDown: [0, -1],
  KeyA: [-1, 0],
  ArrowLeft: [-1, 0],
  KeyD: [1, 0],
  ArrowRight: [1, 0],
};

/**
 * Converte una direzione dello schermo (x a destra, y in alto) nella direzione della mappa
 * (x a est, y a nord) per una camera ruotata di `yawDeg` (GDD sezione 3): con 45°,
 * "in alto" diventa nord-est. La lunghezza del vettore non cambia.
 */
export function screenToMap(x: number, y: number, yawDeg: number): { x: number; y: number } {
  const a = (yawDeg * Math.PI) / 180;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return { x: x * c + y * s, y: -x * s + y * c };
}

/** Stato dei tasti di movimento. Senza DOM, per poterlo provare nei test. */
export class KeyState {
  private readonly down = new Set<string>();

  press(code: string): boolean {
    if (!(code in MOVE_KEYS)) return false;
    this.down.add(code);
    return true;
  }

  release(code: string): void {
    this.down.delete(code);
  }

  /** Rilascia tutto: finestra senza focus o scheda nascosta. */
  clear(): void {
    this.down.clear();
  }

  /** Direzione grezza in [−1, 1] per asse, y verso nord. La normalizzazione la fa il movimento. */
  move(): { x: number; y: number } {
    let x = 0;
    let y = 0;
    for (const code of this.down) {
      const [dx, dy] = MOVE_KEYS[code]!;
      x += dx;
      y += dy;
    }
    return { x: Math.sign(x), y: Math.sign(y) };
  }
}

/**
 * Rotella in scatti di zoom. I trackpad mandano molti eventi piccoli:
 * si accumulano finché superano la soglia, poi c'è una breve pausa.
 */
export class WheelSteps {
  private acc = 0;
  private lockedUntil = 0;

  constructor(
    private readonly threshold = 40,
    private readonly cooldownMs = 180,
  ) {}

  /** Restituisce −1 (avvicina), +1 (allontana) o 0. */
  feed(deltaY: number, nowMs: number): number {
    if (nowMs < this.lockedUntil) return 0;
    this.acc += deltaY;
    if (Math.abs(this.acc) < this.threshold) return 0;
    const step = Math.sign(this.acc);
    this.acc = 0;
    this.lockedUntil = nowMs + this.cooldownMs;
    return step;
  }
}

export interface InputHandlers {
  /** Clic sinistro sul canvas, in pixel relativi al canvas. Solo sul canvas: i clic sull'interfaccia non arrivano qui. */
  onGroundClick(px: number, py: number): void;
  onZoom(step: number): void;
  onTogglePause(): void;
}

export interface Input {
  readonly keys: KeyState;
}

export function installInput(canvas: HTMLCanvasElement, handlers: InputHandlers): Input {
  const keys = new KeyState();
  const wheel = new WheelSteps();

  const isTyping = (e: Event): boolean =>
    e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;

  addEventListener('keydown', (e) => {
    if (isTyping(e) || e.metaKey || e.ctrlKey) return;
    if (keys.press(e.code)) {
      e.preventDefault();
      return;
    }
    if (e.code === 'Space') {
      e.preventDefault();
      if (!e.repeat) handlers.onTogglePause();
    }
  });
  addEventListener('keyup', (e) => keys.release(e.code));
  // Con Cmd premuto macOS non manda i keyup: si rilascia tutto per sicurezza.
  addEventListener('keydown', (e) => {
    if (e.metaKey) keys.clear();
  });
  addEventListener('blur', () => keys.clear());
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) keys.clear();
  });

  canvas.addEventListener('pointerdown', (e) => {
    if (e.button !== 0 || e.target !== canvas) return;
    const rect = canvas.getBoundingClientRect();
    handlers.onGroundClick(e.clientX - rect.left, e.clientY - rect.top);
  });
  canvas.addEventListener('contextmenu', (e) => e.preventDefault());
  canvas.addEventListener(
    'wheel',
    (e) => {
      e.preventDefault();
      const step = wheel.feed(e.deltaY, performance.now());
      if (step !== 0) handlers.onZoom(step);
    },
    { passive: false },
  );

  return { keys };
}
