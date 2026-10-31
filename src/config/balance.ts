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
  /** Durata del pagamento di un riquadro d'acquisto, qualunque sia il prezzo (Pizza Ready ≈ 2 s, UX1). */
  readonly unlockPaySeconds: number;
  /** Attesa sul riquadro prima di prendere soldi: non si paga per sbaglio passando (controllo UX 8). */
  readonly unlockPayDelay: number;
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

export type UpgradeId = 'backpack' | 'shoes' | 'profit';

/** Un potenziamento del giocatore (GDD sezione 5): costo del prossimo livello = base × growth^n. */
export interface UpgradeDef {
  readonly id: UpgradeId;
  readonly name: string;
  readonly baseCost: number;
  readonly levels: number;
  /** Effetto per livello: +posti nella pila (Zaino), frazione di velocità (Scarpe) o di prezzo (Guadagno). */
  readonly perLevel: number;
}

export interface UpgradesConfig {
  /** Crescita del costo a ogni livello: pochi livelli ripidi, come il genere (RC10, RC11). */
  readonly growth: number;
  readonly list: readonly UpgradeDef[];
  /** Livello di Zaino regalato all'apertura dell'Ufficio, senza stelle (GDD sezione 5). */
  readonly giftBackpack: number;
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
  readonly upgrades: UpgradesConfig;
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

/** Misure della pila in mano: le stesse regole per il giocatore e per i lavoratori, con numeri diversi. */
export interface StackFeelConfig {
  /** Distanza davanti al centro del corpo e altezza della base, in metri. */
  readonly front: number;
  readonly base: number;
  /** Ingrandimento di traverso per tipo di merce, in profondità e in altezza, rispetto ai ripiani. */
  readonly sideways: { readonly leaf: number; readonly paste: number; readonly scrap: number; readonly money: number };
  readonly depth: number;
  readonly scaleY: number;
  /** Rimbalzo a ogni passo, in metri, sopra questa velocità (m/s). */
  readonly bob: number;
  readonly movingSpeed: number;
  /** Inclinazione per m/s di cambio di velocità, tetto, memoria della velocità (s), molla e smorzamento. */
  readonly leanPerSpeed: number;
  readonly maxLean: number;
  readonly leanMemory: number;
  readonly spring: number;
  readonly damping: number;
}

/** Sensazione di gioco (GDD sezione 10; skill arcade-idle, PS13–PS19): numeri solo visivi. */
export interface FeelConfig {
  /** Festa dello sblocco: secondi di primo piano e altezza inquadrata, in metri (UX8). */
  readonly festaSeconds: number;
  readonly festaHeight: number;
  /**
   * Pila in mano (GDD sezione 3, UX4): distanza davanti al centro del corpo e altezza delle mani; ingrandimento
   * della merce di traverso (per tipo), in profondità e in altezza rispetto ai ripiani; rimbalzo del passo e
   * inclinazione a molla con il suo tetto, in metri. Il giocatore ha la merce più larga del corpo.
   */
  readonly playerStack: StackFeelConfig;
  readonly workerStack: StackFeelConfig;
  /** Quanto sta MAX sopra la cima della pila, in metri. */
  readonly maxAbove: number;
  /** Strati della torre di mazzette del regalo: 10 strati da 0,19 m = 1,9 m, l'altezza del personaggio. */
  readonly giftTowerLayers: number;
  /** Banconote che volano al contatore per ogni mucchio, al massimo, e dollari di una banconota. */
  readonly collectBills: number;
  readonly billValue: number;
  /** Secondi tra una banconota e la successiva, sia raccogliendo sia pagando ("una a una", PS16). */
  readonly billEvery: number;
  /** Secondi di volo di una banconota e altezza dell'arco, in metri (UX5: 0,2–0,3 s, arco 0,5–0,8 m). */
  readonly flySeconds: number;
  readonly flyArc: number;
  /** Secondi di volo di una banconota dal mucchio al contatore, sullo schermo. */
  readonly collectFlySeconds: number;
  /** Da dove partono le banconote pagando: sopra la testa del personaggio, in metri. */
  readonly payFromHeight: number;
  /** Secondi fra due sbuffi di polvere mentre si corre. */
  readonly dustEvery: number;
  /** Secondi di viaggio del camion lungo la strada, in arrivo e in partenza. */
  readonly truckDriveSeconds: number;
}

/** Audio (GDD sezione 11): volumi e regole dei suoni. */
export interface AudioConfig {
  readonly masterVolume: number;
  /** Volume degli effetti all'avvio: 70%. */
  readonly effectsVolume: number;
  readonly maxVoices: number;
  /** Intervallo minimo tra due suoni con lo stesso nome: per esempio al massimo 6 pop al secondo. */
  readonly minGap: Readonly<Record<string, number>>;
  readonly chainMax: number;
  readonly chainReset: number;
  /** Seme delle varianti dei suoni. */
  readonly seed: number;
  /** Fanfara dello sblocco e jingle del livello: semitoni e secondi tra le note. */
  readonly fanfare: readonly number[];
  readonly fanfareStep: number;
  readonly levelJingle: readonly number[];
  readonly levelStep: number;
  /** Secondi tra una stellina e l'altra (una per stella dello sblocco). */
  readonly sparkleStep: number;
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
  readonly audio: AudioConfig;
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
    start: { x: 26.8, y: 19.4 },
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
    playerStack: {
      front: 0.68,
      base: 1.05,
      sideways: { leaf: 1.6, paste: 2.75, scrap: 2.2, money: 2.6 },
      depth: 1.3,
      scaleY: 1.5,
      bob: 0.05,
      movingSpeed: 0.2,
      leanPerSpeed: 0.05,
      maxLean: 0.14,
      leanMemory: 0.25,
      spring: 90,
      damping: 11,
    },
    workerStack: {
      front: 0.6,
      base: 0.9,
      sideways: { leaf: 1.2, paste: 1.4, scrap: 1.3, money: 1.4 },
      depth: 1.1,
      scaleY: 1.2,
      bob: 0.04,
      movingSpeed: 0.2,
      leanPerSpeed: 0.05,
      maxLean: 0.1,
      leanMemory: 0.25,
      spring: 90,
      damping: 11,
    },
    maxAbove: 0.45,
    giftTowerLayers: 10,
    collectBills: 12,
    billValue: 5,
    billEvery: 0.07,
    flyArc: 0.7,
    collectFlySeconds: 0.6,
    payFromHeight: 2.3,
    flySeconds: 0.28,
    dustEvery: 0.14,
    truckDriveSeconds: 3,
  },
  phase1: {
    gift: 40,
    stack: { capacity: 4, cashPileSize: 1.4, rewardDistance: 3, transferInterval: 0.08, unlockPaySeconds: 2, unlockPayDelay: 0.25, cashCollectSeconds: 0.6 },
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
      { id: 'press2', cost: 160, goal: 'Compra il Torchio 2!', kind: 'press' },
    ],
    respect: {
      starsPerUnlock: 4,
      starsPerUpgrade: 1,
      thresholds: [15, 24, 39, 60, 81, 114, 141, 165, 200],
      rewardPerLevel: 20,
    },
    picker: { capacity: 3, speed: 2.8, sleepEvery: [90, 150], wakeRadius: 1.5, scrapPriority: 0.5 },
    upgrades: {
      growth: 1.8,
      giftBackpack: 1,
      list: [
        { id: 'backpack', name: 'Zaino', baseCost: 40, levels: 5, perLevel: 2 },
        { id: 'shoes', name: 'Scarpe', baseCost: 60, levels: 5, perLevel: 0.15 },
        { id: 'profit', name: 'Guadagno', baseCost: 80, levels: 5, perLevel: 0.1 },
      ],
    },
  },
  audio: {
    masterVolume: 0.5,
    effectsVolume: 0.7,
    maxVoices: 8,
    minGap: { pick: 0.055, drop: 0.055, coin: 0.055, cash: 0.07, pay: 0.06, horn: 0.5, fire: 0.15, snore: 1, hey: 0.5, upgrade: 0.2, click: 0.05 },
    chainMax: 12,
    chainReset: 0.6,
    seed: 1981,
    fanfare: [0, 4, 7, 12],
    fanfareStep: 0.2,
    levelJingle: [0, 4, 7, 11, 12, 16],
    levelStep: 0.1,
    sparkleStep: 0.22,
  },
};
