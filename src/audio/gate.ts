// Regole dei suoni (GDD sezione 11), separate dal motore audio così si provano con i test: al massimo
// alcuni suoni di raccolta al secondo, al massimo alcune voci insieme, e un "pop" che sale di un semitono
// a ogni pezzo raccolto di fila (fino a 12), che torna giù dopo una pausa.

export interface GateConfig {
  /** Intervallo minimo tra due suoni con lo stesso nome, in secondi. */
  readonly minGap: Readonly<Record<string, number>>;
  /** Voci al massimo nello stesso istante. */
  readonly maxVoices: number;
  /** Semitoni al massimo per la scala del pop, e secondi di pausa che la fanno ripartire. */
  readonly chainMax: number;
  readonly chainReset: number;
}

export class SoundGate {
  private readonly last = new Map<string, number>();
  private readonly ends: number[] = [];
  private chain = 0;
  private chainAt = -Infinity;

  constructor(private readonly cfg: GateConfig) {}

  /** Vero se il suono `name`, lungo `duration` secondi, può partire all'istante `now`. */
  allow(name: string, now: number, duration: number): boolean {
    const gap = this.cfg.minGap[name] ?? 0;
    const prev = this.last.get(name);
    if (prev !== undefined && now - prev < gap) return false;
    for (let i = this.ends.length - 1; i >= 0; i--) if (this.ends[i]! <= now) this.ends.splice(i, 1);
    if (this.ends.length >= this.cfg.maxVoices) return false;
    this.last.set(name, now);
    this.ends.push(now + duration);
    return true;
  }

  /** Rapporto di frequenza del prossimo pop della raccolta: un semitono più su a ogni pezzo di fila. */
  nextChainPitch(now: number): number {
    if (now - this.chainAt > this.cfg.chainReset) this.chain = 0;
    this.chainAt = now;
    const n = Math.min(this.chain, this.cfg.chainMax);
    this.chain++;
    return 2 ** (n / 12);
  }
}
