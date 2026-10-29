// Palette del GDD (sezione 10): pastello e chiara, come un diorama giocattolo.
export const PALETTE = {
  /** Erba della valle e contorni di sentieri e campi. */
  grass: 0xa6dc7a,
  grassEdge: 0x86c45e,
  /** Giungla della cornice. */
  jungleLight: 0x5db55a,
  jungleDark: 0x3f9a4c,
  /** Sfondo uniforme oltre la cornice. */
  jungleFloor: 0x6cbf5a,
  fieldEarth: 0xc98d5c,
  fieldEarthDark: 0xa8714a,
  path: 0xf3e2be,
  pathEdge: 0xdcc596,
  villageWall: 0xf2e6cf,
  roofTile: 0xe0603f,
  lumina: 0x5ce1e6,
  /** Mazzette verde acceso con fascia chiara: si staccano dal prato pastello (GDD sezione 10). */
  money: 0x2ecc52,
  moneyBand: 0xe9ffd9,
  /** Colori di marca delle stazioni: l'azzurro della Lumina (versione piena, non emissiva) e il giallo anni '80. */
  brandBlue: 0x4fc3d9,
  brandBlueDark: 0x2f8fa8,
  brandYellow: 0xffc94a,
  brandYellowDark: 0xe0a52c,
  /** Tappetini delle zone (GDD sezione 3). */
  matPickup: 0x6ed36a,
  matDeposit: 0xffd84a,
  matCash: 0x5aa8f0,
  magenta: 0xff4f9a,
  gold: 0xffc94a,
  white: 0xffffff,
  ink: 0x1b1b2f,
  policeBlue: 0x2f5bd3,
  policeRed: 0xe33b3b,
} as const;
