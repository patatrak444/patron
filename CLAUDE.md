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

## Verifica visiva (obbligatoria per ogni tappa che tocca la grafica)

- Nessuna tappa è finita senza screenshot: esegui `npm run shot` e guarda tu stesso le immagini in `artifacts/` prima di dire "fatto".
- Se in `docs/reference/` c'è la tavola della storyboard corrispondente, confrontala con lo screenshot e scrivi in 3 righe cosa coincide e cosa no.
- Leggi `artifacts/report.json`: disegni e triangoli di ogni inquadratura devono restare nei limiti del GDD sezione 10 (zona di partenza < 60.000 triangoli, ovunque < 150.000 e < 150 disegni). La ripartizione per gruppo dice cosa pesa.
- Uno screenshot nero, vuoto, con errori nel browser o diverso dal riferimento significa che la tappa non è finita.
- Se il browser per gli screenshot non si scarica nella sessione cloud, il workflow `screenshots.yml` su GitHub fa gli stessi scatti a ogni pull request e li allega.
- Gli screenshot non misurano la fluidità: i fotogrammi al secondo li verifica Luca sull'iMac con `?debug=1`.

## Skill

- In `.claude/skills/` ci sono quattro skill Three.js (gameplay, grafica, QA, debug): vedi `.claude/skills/README.md`.
- `docs/GDD.md` e questo file vincono sempre sulle skill.

## Modelli 3D

- I modelli sono in `public/models/` (Kenney, CC0). Provenienza ed elenco in `public/models/CREDITS.md`.
- Nuovi modelli: dalla raccolta npm `@netforge/asset-library-files` (raggiungibile anche dal cloud), stesso autore e stessa palette.

## Comandi

- `npm run dev` — server di sviluppo
- `npm test` — test automatici
- `npm run build` — build di produzione in `dist/`
- `npm run shot` — build e screenshot automatici in `artifacts/`
