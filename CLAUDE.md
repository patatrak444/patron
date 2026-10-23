# PATRÓN — istruzioni per Claude Code

PATRÓN è un arcade idle 3D da giocare nel browser del computer.

## Fonte di verità

- Il documento di design completo è in `docs/GDD.md`: leggilo tutto prima di iniziare una tappa.
- Se qualcosa nel codice contraddice il documento, vince il documento.
- Se trovi un punto ambiguo o contraddittorio, fermati e chiedi.
- Quando una regola cambia, si aggiorna prima `docs/GDD.md`, poi il codice (citando la sezione).

## Stack

TypeScript, Vite, Three.js, Vitest, ZzFX. Niente altri framework.

## Regole

- La logica di gioco vive in `src/sim/` ed è TypeScript puro: nessuna dipendenza da Three.js né dal DOM.
- Tutti i numeri di bilanciamento stanno in `src/config/balance.ts`, tipizzati. Nessun numero magico nella logica.
- Logica a passo fisso di 1/30 s; il disegno avviene a ogni fotogramma (GDD sezione 14).
- La logica emette eventi sul bus interno; effetti, suoni e tutorial li ascoltano.
- Casualità solo dal generatore con seme (`src/core/rng.ts`).
- Ogni tappa ha test automatici (Vitest) dove ci sono calcoli.
- Interfaccia in HTML/CSS sopra il canvas; testi in italiano.

## Vincoli dell'ambiente

- Il computer di sviluppo è un iMac del 2015 con macOS 12 Monterey: niente strumenti che richiedono versioni più recenti di macOS.
- Node.js LTS. Il gioco gira in localhost con il server di Vite e si pubblica su GitHub Pages con GitHub Actions.

## Modo di lavorare (GDD sezione 15)

- Una tappa (M0–M8) per sessione: prima un piano, poi l'esecuzione dopo il via.
- Non si passa alla tappa successiva finché i criteri "Fatta quando" non sono verificati.
- A fine tappa: test verdi, istruzioni per provarlo nel browser, elenco di cosa non è stato possibile verificare, commit.

## Comandi

- `npm run dev` — server di sviluppo
- `npm test` — test automatici
- `npm run build` — build di produzione in `dist/`
