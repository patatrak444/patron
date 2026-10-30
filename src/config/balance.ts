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
  /**
   * Altezza di mondo inquadrata ai tre livelli di zoom, in metri, misurata sul piano perpendicolare
   * allo sguardo: così il lotto entra intero anche nelle finestre più larghe del 16:9 (GDD sezione 3).
   */
  readonly zoomHeights: readonly [near: number, medium: number, far: number];
  /** Zona morta al centro dello schermo, in metri: la camera si muove solo se il giocatore ne esce. */
  readonly deadZone: { readonly width: number; readonly depth: number };
  /** Punto inquadrato all'avvio, in coordinate del GDD: fa entrare tutto il lotto 1 con l'arco. */
  readonly start: { readonly x: number; readonly y: number };
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
  /** Capacità iniziale della pila tra le braccia (GDD sezione 3). */
  readonly capacity: number;
  /** Lato dell'area di un mucchio di mazzette a terra, in metri (il vassoio del camion ha la sua misura). */
  readonly cashPileSize: number;
  /** Distanza dal riquadro pagato a cui piove il premio di un livello, verso il centro del lotto. */
  readonly rewardDistance: number;
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
  /** Secondi dal suono del clacson all'arrivo davanti all'arco, la prima volta (GDD sezione 8). */
  readonly firstArrival: number;
}

export interface UnlockDef {
  readonly id: 'field1' | 'press1' | 'field2' | 'bonfire' | 'office' | 'picker1' | 'zone2' | 'field3' | 'picker2' | 'press2';
  readonly cost: number;
  /** Frase dell'obiettivo, 4 parole al massimo (GDD sezione 8). */
  readonly goal: string;
  readonly kind: 'field' | 'worker' | 'press' | 'bonfire' | 'zone' | 'office';
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
  /** Regalo di El Gordo a due passi dal giocatore (GDD sezione 5). */
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

/** Schermata iniziale (GDD sezione 8; skill ux-ui-arcade-idle, UX12). */
export interface TitleConfig {
  /** Punto della mappa al centro della gru, in coordinate del GDD. */
  readonly focusX: number;
  readonly focusY: number;
  /** Secondi per un giro completo della gru. */
  readonly orbitSeconds: number;
  /** Inclinazione e larghezza inquadrata dalla gru. */
  readonly pitchDeg: number;
  readonly width: number;
  /** Secondi della discesa dalla gru al lotto 1. */
  readonly descendSeconds: number;
}

/** Sensazione di gioco (GDD sezione 10; skill arcade-idle, PS13–PS19): numeri solo visivi. */
export interface FeelConfig {
  /** Festa dello sblocco: secondi di primo piano e altezza inquadrata, in metri (UX8). */
  readonly festaSeconds: number;
  readonly festaHeight: number;
  /** Dollari per mazzetta della pila sulla schiena, e tetto di mazzette disegnate. */
  readonly dollarsPerBundle: number;
  readonly maxBackBundles: number;
  /** Secondi di volo di una mazzetta (dal mucchio alla schiena, dalla schiena al tappetino). */
  readonly flySeconds: number;
  /** Secondi fra due sbuffi di polvere mentre si corre. */
  readonly dustEvery: number;
  /** Secondi di viaggio del camion lungo la strada, in arrivo e in partenza. */
  readonly truckDriveSeconds: number;
}

export interface Balance {
  readonly sim: SimConfig;
  readonly camera: CameraConfig;
  readonly player: PlayerConfig;
  readonly nav: NavConfig;
  readonly render: RenderConfig;
  readonly screen: ScreenConfig;
  readonly phase1: Phase1Config;
  readonly feel: FeelConfig;
  readonly title: TitleConfig;
}

export const BALANCE: Balance = {
  sim: {
    step: 1 / 30,
    maxFrameTime: 0.25,
    maxStepsPerFrame: 120,
  },
  camera: {
    pitchDeg: 45,
    yawDeg: 45,
    fovDeg: 22,
    zoomHeights: [19, 25, 31],
    deadZone: { width: 14, depth: 10 },
    start: { x: 27.3, y: 20.3 },
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
  title: { focusX: 34, focusY: 24, orbitSeconds: 60, pitchDeg: 38, width: 62, descendSeconds: 2.2 },
  feel: {
    festaSeconds: 3,
    festaHeight: 12,
    dollarsPerBundle: 10,
    maxBackBundles: 20,
    flySeconds: 0.35,
    dustEvery: 0.14,
    truckDriveSeconds: 3,
  },
  phase1: {
    gift: 40,
    stack: { capacity: 4, cashPileSize: 1.4, rewardDistance: 3, transferInterval: 0.08, unlockPaySeconds: 1.5, cashCollectSeconds: 0.5 },
    field: { cycle: 3, outCap: 8 },
    press: { leavesPerPaste: 3, cycle: 4, inCap: 12, outCap: 10, pastesPerScrap: 2, scrapCap: 6 },
    truck: { pastePrice: 5, capacity: 10, awaySeconds: 20, firstArrival: 4 },
    unlocks: [
      { id: 'field1', cost: 5, goal: 'Compra il campo!', kind: 'field' },
      { id: 'press1', cost: 15, goal: 'Compra il torchio!', kind: 'press' },
      { id: 'field2', cost: 20, goal: 'Compra il Campo 2!', kind: 'field' },
      { id: 'bonfire', cost: 10, goal: 'Compra il falò!', kind: 'bonfire' },
      { id: 'office', cost: 40, goal: "Compra l'ufficio!", kind: 'office' },
      { id: 'picker1', cost: 30, goal: 'Assumi un raccoglitore!', kind: 'worker' },
      { id: 'zone2', cost: 120, goal: 'Apri una nuova zona!', kind: 'zone' },
      { id: 'field3', cost: 80, goal: 'Compra il Campo 3!', kind: 'field' },
      { id: 'picker2', cost: 120, goal: 'Assumi un raccoglitore!', kind: 'worker' },
      { id: 'press2', cost: 200, goal: 'Compra il Torchio 2!', kind: 'press' },
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
