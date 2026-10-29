// Tutti i numeri del gioco (GDD sezione 14, principio 3).
// Le tappe successive aggiungono qui i valori delle sezioni 3–7 e 13.

export interface SimConfig {
  /** Durata di un passo di logica, in secondi (GDD sezione 14). */
  readonly step: number;
  /** Tempo massimo di un fotogramma prima del taglio, per non accumulare ritardo dopo una pausa. */
  readonly maxFrameTime: number;
  /** Tetto di passi di logica per fotogramma, anche a tempo × 10. */
  readonly maxStepsPerFrame: number;
}

export interface CameraConfig {
  /** Inclinazione dall'orizzontale, in gradi (GDD sezione 3). */
  readonly pitchDeg: number;
  /** Rotazione fissa attorno alla verticale: 45° = guarda da sud-ovest verso nord-est (GDD sezione 3). */
  readonly yawDeg: number;
  /** Campo visivo verticale, in gradi. */
  readonly fovDeg: number;
  /** Larghezza di mondo inquadrata ai tre livelli di zoom, in metri. */
  readonly zoomWidths: readonly [near: number, medium: number, far: number];
  /** Interpolazione dell'inseguimento per fotogramma a 60 fps; si applica in base al tempo trascorso. */
  readonly followLerp: number;
}

export interface PlayerConfig {
  /** Velocità base in m/s (GDD sezione 3). */
  readonly speed: number;
  /** Secondi per arrivare alla velocità piena da fermo. */
  readonly accelTime: number;
  /** Secondi per fermarsi dalla velocità piena. */
  readonly stopTime: number;
  /** Secondi dell'interpolazione con cui si gira verso la direzione di marcia. */
  readonly turnTime: number;
  /** Raggio del cerchio di collisione, in metri. */
  readonly radius: number;
}

export interface NavConfig {
  /** Margine dagli ostacoli usato dalla griglia dei percorsi: poco più del raggio, per non strisciare sugli spigoli. */
  readonly pad: number;
}

export interface BloomConfig {
  /** Luminanza minima per brillare: la superano solo i materiali emissivi. */
  readonly threshold: number;
  readonly strength: number;
  readonly radius: number;
}

export interface RenderConfig {
  /** Risoluzione interna massima (GDD sezione 10). */
  readonly maxInternalWidth: number;
  readonly maxInternalHeight: number;
  /** Lato della mappa d'ombra in qualità Alta e Media. */
  readonly shadowMapSize: { readonly high: number; readonly medium: number };
  /** Bloom (UnrealBloomPass) in qualità Alta (GDD sezione 10). */
  readonly bloom: BloomConfig;
}

export interface ScreenConfig {
  /** Finestra minima supportata (GDD sezione 2). */
  readonly minWidth: number;
  readonly minHeight: number;
}

export interface StackConfig {
  /** Capacità iniziale della pila sulla schiena (GDD sezione 3). */
  readonly capacity: number;
  /** Raggio di attivazione di un tappetino, in metri. */
  readonly zoneRadius: number;
  /** Secondi tra un oggetto e il successivo trasferito da o verso una zona. */
  readonly transferInterval: number;
  /** Durata del pagamento di un tappetino di sblocco, qualunque sia il prezzo. */
  readonly unlockPaySeconds: number;
  /** Secondi per raccogliere un mucchio di mazzette, qualunque sia il valore. */
  readonly cashCollectSeconds: number;
}

export interface FieldConfig {
  readonly cycle: number;
  readonly outCap: number;
}

export interface PressConfig {
  readonly leavesPerPaste: number;
  readonly cycle: number;
  readonly inCap: number;
  readonly outCap: number;
  /** Ogni quante Paste esce un sacco di Scarti (GDD sezione 4). */
  readonly pastesPerScrap: number;
  readonly scrapCap: number;
}

export interface TruckConfig {
  readonly pastePrice: number;
  /** Capienza del cassone all'inizio; il potenziamento Cassone la allarga (GDD sezione 5). */
  readonly capacity: number;
  /** Secondi di viaggio quando il cassone è pieno. */
  readonly awaySeconds: number;
}

export interface UnlockDef {
  readonly id: 'field2' | 'picker1' | 'field3' | 'picker2' | 'press2';
  readonly cost: number;
  /** Nome breve per la frase dell'obiettivo e l'icona del tappetino. */
  readonly label: string;
  readonly kind: 'field' | 'worker' | 'press';
}

export interface RespectConfig {
  readonly starsPerUnlock: number;
  readonly starsPerUpgrade: number;
  /** Stelle totali per raggiungere i livelli 2, 3, 4… (cumulative). */
  readonly thresholds: readonly number[];
  /** Premio a ogni livello: questo valore × il nuovo livello. */
  readonly rewardPerLevel: number;
}

export interface WorkerConfig {
  readonly capacity: number;
  readonly speed: number;
  /** Intervallo casuale tra un sonno e l'altro, in secondi di lavoro. */
  readonly sleepEvery: readonly [number, number];
  /** Distanza a cui il giocatore sveglia un lavoratore. */
  readonly wakeRadius: number;
  /** Il Raccoglitore porta via gli Scarti quando il cassone è pieno almeno per questa frazione. */
  readonly scrapPriority: number;
}

export interface Phase1Config {
  /** Regalo di El Gordo davanti alla capanna (GDD sezione 5). */
  readonly gift: number;
  readonly stack: StackConfig;
  readonly field: FieldConfig;
  readonly press: PressConfig;
  readonly truck: TruckConfig;
  /** Sequenza degli sblocchi della Fase 1 in M2 (GDD sezione 5, sblocchi 1–5). */
  readonly unlocks: readonly UnlockDef[];
  readonly respect: RespectConfig;
  readonly picker: WorkerConfig;
}

export interface Balance {
  readonly sim: SimConfig;
  readonly camera: CameraConfig;
  readonly player: PlayerConfig;
  readonly nav: NavConfig;
  readonly render: RenderConfig;
  readonly screen: ScreenConfig;
  readonly phase1: Phase1Config;
}

export const BALANCE: Balance = {
  sim: {
    step: 1 / 30,
    maxFrameTime: 0.25,
    maxStepsPerFrame: 120,
  },
  camera: {
    pitchDeg: 50,
    yawDeg: 45,
    fovDeg: 22,
    zoomWidths: [14, 20, 30],
    followLerp: 0.1,
  },
  player: {
    speed: 4,
    accelTime: 0.08,
    stopTime: 0.1,
    turnTime: 0.08,
    radius: 0.35,
  },
  nav: {
    pad: 0.45,
  },
  render: {
    maxInternalWidth: 2560,
    maxInternalHeight: 1440,
    shadowMapSize: { high: 2048, medium: 1024 },
    bloom: { threshold: 0.92, strength: 0.3, radius: 0.35 },
  },
  screen: {
    minWidth: 1280,
    minHeight: 600,
  },
  phase1: {
    gift: 20,
    stack: { capacity: 4, zoneRadius: 1.2, transferInterval: 0.08, unlockPaySeconds: 1.5, cashCollectSeconds: 0.5 },
    field: { cycle: 3, outCap: 8 },
    press: { leavesPerPaste: 3, cycle: 4, inCap: 12, outCap: 10, pastesPerScrap: 2, scrapCap: 6 },
    truck: { pastePrice: 5, capacity: 10, awaySeconds: 20 },
    unlocks: [
      { id: 'field2', cost: 15, label: 'il Campo 2', kind: 'field' },
      { id: 'picker1', cost: 30, label: 'un raccoglitore', kind: 'worker' },
      { id: 'field3', cost: 80, label: 'il Campo 3', kind: 'field' },
      { id: 'picker2', cost: 120, label: 'un raccoglitore', kind: 'worker' },
      { id: 'press2', cost: 200, label: 'la Pressa 2', kind: 'press' },
    ],
    respect: {
      starsPerUnlock: 4,
      starsPerUpgrade: 1,
      thresholds: [15, 24, 39, 60, 81, 114, 141, 165, 200],
      rewardPerLevel: 20,
    },
    picker: { capacity: 3, speed: 2.8, sleepEvery: [90, 150], wakeRadius: 1.5, scrapPriority: 0.5 },
  },
};
