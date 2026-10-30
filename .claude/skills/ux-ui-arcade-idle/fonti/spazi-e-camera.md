# Spazi e camera nei giochi arcade idle "porta e impila" (Pizza Ready, My Mini Mart, Burger Please, Monkey Mart, My Perfect Hotel)

Nota di metodo (30 ottobre 2026). Le fonti scritte su angolo di camera e distanze **quasi non esistono**: nessun postmortem di Supercent, Homa, Voodoo o Supersonic che dia valori di camera o di spaziatura è emerso dalle ricerche; le pagine dei template Unity per arcade idle non pubblicano i parametri; le pagine di App Store non erano raggiungibili da questa sessione e le immagini trovate con la ricerca per immagini non erano misurabili da qui. Quindi:
- i numeri "per gioco" vengono dalle misure già nella skill (`02-forma/camera.md`, `06-prima-sessione/*`), stimate a occhio su schermate e video, e qui sono **riusati, non rimisurati**;
- l'unica fonte primaria nuova con un numero di spazio è la scomposizione di My Mini Mart su WNHub (≤ 2 s di camminata nel primo ciclo);
- il resto sono **calcoli geometrici** sulla camera di PATRÓN (verificabili nel codice) e inferenze, segnati come tali.

## (a) Camera: angolo, proiezione, quanto si vede, personaggio, inseguimento, zoom

### Takeaway
Il genere guarda dall'alto a circa 50–55° (stima), ruotato di 45°, con prospettiva leggera e personaggio al centro alto circa 1/14 dello schermo verticale del telefono. Con i valori attuali **PATRÓN ha già la stessa scala del personaggio** (≈ 1/14 allo zoom medio): il "troppo appiccicato" non nasce dalla distanza della camera ma da (1) l'angolo basso di 50°, che fa coprire gli oggetti tra loro, (2) stazioni grandi rispetto al personaggio, (3) un lotto che allo zoom medio non entra tutto nello schermo.

### Cited Findings
- 11/11 giochi del catalogo: inclinazione stimata 50–55°, mappa ruotata di 45° (muri e strade in diagonale), prospettiva leggera o quasi nulla in 10/11; personaggio tra 1/18 e 1/12 dell'altezza dello schermo verticale, mediana ~1/14. Stime a occhio — [skill arcade-idle, 02-forma/camera.md](/home/claude/patron/.claude/skills/arcade-idle/02-forma/camera.md)
- Per gioco (stime): Pizza Ready ~50°, 2–3 stazioni a schermo, personaggio ~1/14; Burger Please ~50°, ~1/12; My Mini Mart ~55°, 4–6 zone, ~1/15; Monkey Mart ~55°, prospettiva quasi nulla, 4–5 banchi, ~1/15; My Perfect Hotel ~50°, 1–2 stanze, ~1/14 — [02-forma/camera.md](/home/claude/patron/.claude/skills/arcade-idle/02-forma/camera.md)
- Nei giochi verticali stanno 6–7 altezze del personaggio sul lato corto dello schermo — [05-applicazione/confronto.md](/home/claude/patron/.claude/skills/arcade-idle/05-applicazione/confronto.md)
- Monkey Mart nel browser (orizzontale): circa 10–12 m di mondo in larghezza, personaggio ~1/7 dello schermo (stima da video). **In contrasto** con la stima ~1/15 della tabella su schermate: le due misure non sono coerenti tra loro — [06-prima-sessione/monkey-mart.md](/home/claude/patron/.claude/skills/arcade-idle/06-prima-sessione/monkey-mart.md); [02-forma/camera.md](/home/claude/patron/.claude/skills/arcade-idle/02-forma/camera.md)
- Pizza Ready: camera molto vicina, personaggio ~1/12 dello schermo verticale; allo sblocco la camera si avvicina all'oggetto e poi torna — [06-prima-sessione/pizza-ready.md](/home/claude/patron/.claude/skills/arcade-idle/06-prima-sessione/pizza-ready.md)
- My Mini Mart: "when an event occurs in the game… the camera points to it" (nuovo lavoratore, furto, grossista); su location piccole "it's not always possible to notice something on a small screen overloaded with animated objects" — [WNHub](https://wnhub.io/news/game-design/item-40717)
- Genere descritto come "camera dall'alto leggermente inclinata" con personaggi stilizzati — [Homa Games](https://www.homagames.com/blog/arcade-idle-a-new-hybridcasual-genre-enters-the-game) (citato nel GDD)
- Setup isometrico Unity tipico per giochi mobile semplici: pivot ruotato 30° su X e 45° su Y, camera ortografica; la dimensione si adatta con un "target group" perché sui tablet quasi quadrati i lati vengono tagliati. Non riferito al genere arcade idle — [Unity Discussions](https://discussions.unity.com/t/isometric-camera-that-adapts-to-different-sizes-of-mobile-devices/1568747)

### Inferences
Calcoli sulla camera attuale di PATRÓN (FOV 22°, pitch 50°, yaw 45°, schermo 16:9; il FOV di Three.js è verticale, quindi a parità di "larghezza" la geometria vale per qualunque FOV stretto):
- **Altezza a schermo del personaggio.** Un oggetto verticale alto h appare alto h·cos(pitch). A 50°: 1,2 m → 0,77 m. Altezza di mondo inquadrata = larghezza·9/16. Zoom vicino 14 m → 7,9 m → personaggio **1/10**; medio 19 m → 10,7 m → **1/14**; lontano 26 m → 14,6 m → **1/19**. Il medio coincide già con la mediana del genere (1/14). Il GDD dice "circa un ottavo": il conto dà 1/14 (da verificare sullo screenshot).
- **Il lotto 1 non entra nello zoom medio.** Lotto 12 × 10 m ruotato di 45°: ingombro orizzontale a schermo (12+10)/√2 = 15,6 m (entra nei 19 m), profondità a terra 15,6 m che a 50° proietta 15,6·sin50° = 11,9 m, più dei 10,7 m disponibili in altezza. Gli angoli vicino/lontano del lotto restano tagliati e non resta nessun margine di prato: lo spazio pieno fino al bordo legge come "appiccicato".
- **Occlusione e angolo.** Perché un oggetto alto h non copra il pavimento dietro di sé serve uno spazio libero, in profondità, di almeno h/tan(pitch): a 50° = 0,84·h, a 58° = 0,62·h, a 60° = 0,58·h. Con stazioni alte 1,5 m: 1,26 m di vuoto a 50°, 0,94 m a 58°. Alzare l'angolo "apre" il pavimento a parità di layout: è il "più dall'alto" che chiede il designer.
- **Fisico, non solo proporzione.** Su un iMac 27" (schermo alto ~34 cm) un personaggio a 1/18 è alto ~1,9 cm; su un telefono (schermo alto ~14–15 cm) un personaggio a 1/14 è alto ~1 cm. Sul monitor si può stare più lontani del telefono e restare più grandi del genere: un personaggio fra 1/16 e 1/20 dell'altezza è legittimo su desktop.
- **Ortografica o prospettica.** Con FOV 22° la differenza è minima; la prospettiva leggera è quella vista in 10/11 giochi. Non serve cambiare proiezione.
- **Inseguimento.** Il genere tiene il personaggio al centro (11/11) e sposta la camera solo per eventi/sblocchi (Pizza Ready, My Mini Mart). Il lerp 0,1 a 60 fps è coerente.

### Gaps
- Nessuna fonte primaria (codice, talk, template) con l'angolo esatto di uno di questi giochi; le stime 50–55° sono a occhio. Gli screenshot non erano misurabili da questa sessione.
- Non è confermato se Pizza Ready, Burger Please, My Mini Mart o My Perfect Hotel **allontanano la camera** quando si sblocca una nuova zona. Nelle schermate e nei video della skill la scala del personaggio resta uguale fino a 24 min (Pizza Ready) e 16 min (Monkey Mart); la camera si avvicina solo per la festa dello sblocco. Le schermate promozionali "lontane" mostrano lo stato finale, non la camera di gioco.
- Monkey Mart: le due stime (1/7 da video, 1/15 da schermate) vanno rimisurate.

## (b) Layout: spaziatura, tempi di camminata, corridoi, vuoto, crescita

### Takeaway
L'unico numero pubblicato è temporale: nel primo ciclo **ogni spostamento dura al massimo 2 s**, e 5 s o più è l'errore tipico ("running simulator"). A 4 m/s vuol dire stazioni consecutive a 4–8 m di distanza. Il genere parte da un lotto di 10–16 m di lato, lo riempie per 15 minuti e si allarga con pezzi confinanti. Per i corridoi e il vuoto attorno alle stazioni non esistono numeri pubblicati: i valori proposti sotto sono calcolati.

### Cited Findings
- My Mini Mart: il giocatore deve passare "not more than two seconds moving within the first cycle"; l'errore comune è costringere a "five or more seconds" di corsa verso punti lontani, che trasforma il gioco in "a running simulator" — [WNHub](https://wnhub.io/news/game-design/item-40717)
- My Mini Mart: tutorial con frecce senza testo nei primi 20–30 s; ordine cassa → banco pomodori → piantine; ogni sblocco mostra che ne arriva un altro; il cestino all'inizio "only adds noise to the screen" e va introdotto dopo; "three products in the chain are enough"; nuovo market dopo 30–40 minuti — [WNHub](https://wnhub.io/news/game-design/item-40717)
- Spazio iniziale di 10–16 m di lato, chiuso da muri bassi o staccionata; si cresce un pezzo alla volta, accanto all'esistente; per 15 minuti soprattutto dentro lo stesso spazio (Monkey Mart: lotto ~14 × 10 m ancora quello a 16 min; Pizza Ready: stanza ~12 × 16 m; My Mini Mart: prato ~10 × 8 m + negozio della stessa misura). Misure stimate — [06-prima-sessione/regole.md](/home/claude/patron/.claude/skills/arcade-idle/06-prima-sessione/regole.md)
- Pizza Ready: primo ciclo completo (tavolo, forno, bancone, incasso) in circa 1 minuto, sblocchi compresi; livello 2 a 2 min, apertura "NEW ZONE" sul bordo della sala — [03-contenuto/misure-video.md](/home/claude/patron/.claude/skills/arcade-idle/03-contenuto/misure-video.md)
- Nessun gioco mette muri tra camera e personaggio: muri bassi, solo sui lati lontani o assenti; pavimenti a disegno regolare (quadri, righe, listelli) che aiutano a leggere la profondità — [02-forma/ambienti.md](/home/claude/patron/.claude/skills/arcade-idle/02-forma/ambienti.md)
- Monkey Mart: si sbloccano "corridoi e macchine"; il market successivo si apre solo finito il corrente — [01-catalogo/giochi/monkey-mart.md](/home/claude/patron/.claude/skills/arcade-idle/01-catalogo/giochi/monkey-mart.md)

### Inferences
Tradotto in metri per PATRÓN (velocità 4 m/s, personaggio 1,2 m, largo ~0,5–0,6 m):
- **Distanza tra interazioni consecutive** (uscita di una stazione → ingresso della successiva): 4–8 m da bordo a bordo dei tappetini, cioè 1–2 s. Sotto ~3 m (meno di 1 s) le stazioni si toccano e il ciclo non si "vede"; sopra 12 m (3 s) si entra nella zona "running simulator". Un ciclo di tre tappe (campo → torchio → camion) + ritorno: 4 tratti × 1,5 s ≈ 6 s di camminata, compatibile con "primo ciclo in 20–30 s" una volta aggiunti i tempi di raccolta e produzione.
- **Rapporto stazione/personaggio.** Oggi il campo da 3 m e il torchio da 2,4 m sono 2–2,5 altezze del personaggio, con tappetini da 1,5 m. In un lotto 12 × 10 m, quattro stazioni da ~3 × 3 m più tappetino occupano ~45 m² su 120 (~37%) prima di contare arco, staccionata e sagome: con l'occlusione a 50° il pavimento libero visibile è molto meno. Proposta: stazioni di produzione 2–2,4 m (campo può restare 3 m perché è piatto e non occlude), tappetini 1,2–1,3 m.
- **Vuoto attorno alle stazioni.** Un anello libero di almeno 1,2–1,5 m (2–3 larghezze del personaggio) su ogni lato non addossato alla staccionata; tra due stazioni affiancate almeno 1,5 m; dietro una stazione alta 1,5 m, in profondità, almeno h/tan(pitch) ≈ 1 m a 58° per non coprire chi passa.
- **Corsie.** Una corsia centrale libera di 2,5–3 m (larga abbastanza per giocatore e lavoratore che si incrociano e per un camion, se passa dentro il lotto), con le stazioni ai lati e le uscite rivolte verso la corsia; banchi e tettoie lungo la staccionata, mai in mezzo.
- **Vuoto/oggetti.** Obiettivo nel primo minuto: ≥ 60% di pavimento libero; a lotto pieno (prima della nuova zona) non meno del 40%. Il vuoto dentro il lotto è anche lo spazio delle sagome: le sagome occupano il posto ma restano piatte.
- **Crescita.** Lotto nuovo confinante, stessa griglia; i nuovi tappetini a ≤ 8 m dall'ultima stazione usata, così la nuova catena rispetta la regola dei 2 s.

### Gaps
- Nessuna fonte con larghezze di corridoi, distanze in metri o rapporto vuoto/oggetti per questi giochi; i numeri sopra sono derivati (regola dei 2 s + geometria della camera), non osservati.
- Non trovati dati sui tempi di un giro completo per Burger Please, My Perfect Hotel o Monkey Mart (i video con economia vera della skill misurano solo Pizza Ready).
- Non verificato quanto è grande, in altezze del personaggio, un forno di Pizza Ready o un banco di Monkey Mart: serve una misura su schermata.

## Valori proposti per PATRÓN (sintesi delle inferenze, da passare dal GDD)

| Parametro | Oggi | Proposta | Perché |
| --- | --- | --- | --- |
| Inclinazione | 50° | **56–60° (58°)** | più "dall'alto", occlusione −25%; resta al limite alto delle stime del genere (55°) |
| Rotazione | 45° | 45° | 11/11 |
| Proiezione / FOV | prospettica 22° | invariata | prospettiva leggera come 10/11 |
| Zoom vicino / medio / lontano (larghezza) | 14 / 19 / 26 m | **16 / 22 / 30 m** | a 58° il personaggio è ~1/13, ~1/19, ~1/26 dell'altezza; su un 27" il medio resta più grande in cm che sul telefono |
| Inquadratura di partenza | medio | lotto 1 intero + ~2 m di prato: a 58° servono ~16 m di altezza → ~28 m di larghezza (zoom lontano), poi scende al medio al primo movimento | il "contenitore" della missione si vede tutto (PS2) |
| Zoom all'apertura di un lotto | — | nessun cambio automatico; primo piano di festa (già nel GDD) e poi ritorno | nessuna prova che il genere allontani la camera |
| Stazioni di produzione | 2,4–3 m | 2–2,4 m (campo 3 m piatto) | meno ingombro relativo |
| Tappetini | 1,5 m | 1,2–1,3 m | — |
| Distanza tra interazioni consecutive | — | 4–8 m (1–2 s a 4 m/s), mai > 12 m | WNHub: ≤ 2 s, ≥ 5 s è un errore |
| Vuoto attorno a ogni stazione | — | ≥ 1,2–1,5 m; tra stazioni ≥ 1,5 m | 2–3 larghezze del personaggio |
| Corsia principale | — | 2,5–3 m libera | incroci giocatore/lavoratori |
| Pavimento libero | — | ≥ 60% nel primo minuto, ≥ 40% a lotto pieno | leggibilità |
| Lotto 1 | 12 × 10 m | 14 × 12 m se le stazioni restano grandi; 12 × 10 m se si riducono | coerente con 10–16 m (PS6) |

Avvertenza: il conflitto tra la richiesta del designer (più lontano) e la regola PS18 della skill (camera vicinissima, 10–12 m) va risolto nel GDD; la proposta lo risolve spostando l'angolo e lo spazio vuoto prima della distanza.
