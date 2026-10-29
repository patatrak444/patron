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
  /** Esposizione della mappatura dei toni. */
  readonly exposure: number;
}

export interface ScreenConfig {
  /** Finestra minima supportata (GDD sezione 2). */
  readonly minWidth: number;
  readonly minHeight: number;
}

export interface Balance {
  readonly sim: SimConfig;
  readonly camera: CameraConfig;
  readonly player: PlayerConfig;
  readonly nav: NavConfig;
  readonly render: RenderConfig;
  readonly screen: ScreenConfig;
}

export const BALANCE: Balance = {
  sim: {
    step: 1 / 30,
    maxFrameTime: 0.25,
    maxStepsPerFrame: 120,
  },
  camera: {
    pitchDeg: 55,
    fovDeg: 35,
    zoomWidths: [16, 24, 34],
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
    bloom: { threshold: 0.92, strength: 0.7, radius: 0.45 },
    exposure: 1.05,
  },
  screen: {
    minWidth: 1280,
    minHeight: 600,
  },
};
