# Piano delle modifiche

Fase 5. Viene da `confronto.md`. Ogni voce dice cosa cambia, quale regola la giustifica, in quale sezione del GDD va scritta e in quale tappa entra nel codice. Niente si tocca prima che Luca abbia approvato la voce: si aggiorna il GDD, poi il codice (CLAUDE.md).

La prossima tappa è **M2 · Fase 1 a mano**. Quasi tutte le correzioni di forma possono entrare lì, perché M2 costruisce proprio ciò che oggi manca: merci, soldi, tappetini e numeri nel mondo.

## 1. Correzioni di forma

Non cambiano le regole del gioco, solo come si vede. Non aggiungono sistemi nuovi.

| N. | Cosa cambia | Regola | GDD | Tappa |
| --- | --- | --- | --- | --- |
| F1 | **Soldi che si staccano dal prato.** Mazzette verde acceso e saturo con un bordo chiaro, ben diverse dal verde pastello del terreno; nessun altro oggetto di quel verde | RF9 | 10 (palette) | M2 |
| F2 | **Due colori di marca.** Proposta: l'azzurro della Lumina (#5CE1E6) e il giallo anni '80 dell'interfaccia (#FFC94A), ripetuti su tutte le stazioni, i tappetini e le insegne, così la filiera si riconosce come una cosa sola | RF7 | 10 (palette, modelli) | M2 |
| F3 | **Stazioni che sembrano macchine.** Pressa più grande e colorata, con la merce prodotta impilata in vista sull'uscita; sopra ogni stazione il suo prodotto in grande, come la pizza gigante del forno di Pizza Ready | RF12 | 10 (modelli, proporzioni) | M2 |
| F4 | **Merci fuori scala.** Foglia, Pasta e Cristallo grandi quanto la testa del personaggio; la pila sulla schiena come torre | RF12 | 4 (merci), 10 | M2 |
| F5 | **Capanna alla partenza.** Il tetto non deve superare un quinto dello schermo: si sposta il punto di partenza o si abbassa la capanna | RF14 | 10 (visibilità) | M2 |
| F6 | **Contante in alto a destra**, in una pillola con icona; impostazioni in alto a sinistra | RF19 | 12 | M2 |
| F7 | **Formato dell'informazione nel mondo** (già previsto da M2, qui si fissa la forma): contatori "n/max" sulle stazioni, MAX a stazione piena, prezzo grande sui tappetini, fumetti con un'icona e un numero, freccia gialla 3D sopra il prossimo tappetino e un anello a terra | RF16, RF17, RF18 | 3, 12 | M2 |

## 2. Domande di design per Luca

Ognuna cambia una regola del gioco: serve una decisione prima di scriverla nel GDD.

| N. | Domanda | Perché (regola) | Proposta | Se sì: GDD e tappa |
| --- | --- | --- | --- | --- |
| D1 | **Partire con un regalo?** Una pila di soldi davanti alla capanna, un primo tappetino quasi gratis subito, il secondo che costa quanto hai | RC4: in Pizza Ready il primo sblocco arriva al secondo 18; in PATRÓN al minuto 1:30 | Sì: "El Gordo ti anticipa $20". Campo 2 resta a $15 ma diventa il primo acquisto dopo 20 s; si ritarano i minuti obiettivo | sez. 5 e 8 · M2 |
| D2 | **Un livello del locale?** Un "Rispetto" che sale con stelle guadagnate costruendo e potenziando, con soglie che si allungano (15, 24, 39, 60…), e che apre le zone grandi come in Prison Life | RC12: 10 giochi su 11 | Sì, ma leggero: sostituisce la barra dell'obiettivo come segno di progresso, senza toccare la sequenza degli sblocchi | sez. 5, 9, 12 · M3 |
| D3 | **Un "lavoretto" del tema?** Un compito che non produce ma va fatto, come la spazzatura in pizzeria | RC16: 6 giochi su 11 | Gli scarti della Pressa (sacchi di foglie secche) da portare al falò: se il cassone è pieno la Pressa si ferma. Più avanti un lavoratore se ne occupa | sez. 4 e 6 · M2 |
| D4 | **Il giocatore resta indispensabile fino alla fine?** Oggi i capi squadra incassano al posto tuo | RC9: in Pizza Ready solo il giocatore raccoglie i soldi | Le mazzette della Plaza restano da raccogliere a mano; i capi squadra danno solo la velocità in più | sez. 6 · M5 |
| D5 | **Domanda prima della Plaza?** Per 25 minuti si vende al camion, che compra tutto all'istante | RC13: 7 giochi su 11 hanno clienti dal primo secondo | Il camion ha un cassone con capienza "n/max" e parte quando è pieno, poi torna dopo qualche secondo: una piccola attesa che dà ritmo. In alternativa si lascia com'è (modello Farm Land) | sez. 4 · M2 |
| D6 | **Zaino più corto e più ripido?** | RC10, RC11: il genere usa 4–5 livelli ripidi, il GDD 8 dolci (× 1,15) | Decidere in M8 con le partite di prova, non prima | sez. 5 · M8 |
| D7 | **Spinte a tempo come premio?** | RC18: 8 giochi su 11, quasi sempre dietro pubblicità | Ogni ordine speciale completato dà 60 s di velocità doppia | sez. 7 · M4 |

## 3. Controllo del Calore

Non cambia il design, aggiunge una verifica. Il Calore non ha precedenti nel genere (0/11) e il rischio è punire chi produce bene.

- **Cosa:** un test automatico in `tests/` che simula un'ora di gioco con e senza Plaza, a ogni livello di Purezza e di Quota. Deve verificare che vendere in Plaza renda sempre più che vendere a El Gordo, anche sottraendo le perdite attese degli eventi.
- **Dove:** GDD sezione 7 (una riga: "produrre di più conviene sempre, anche con il Calore") e sezione 15 (criterio di M5).
- **Quando:** M4 per il Laboratorio, M5 per la Plaza.

## 4. Cosa non cambia, apposta

- **Una sola valuta** (RC19): nel genere la seconda valuta serve alla monetizzazione, che la Beta non ha.
- **Bordo di giungla:** è sotto soglia (nessun gioco lo usa, ma nemmeno l'isola sull'acqua è una regola). Resta, pulito e ordinato come oggi.
- **Primo lavoratore a 3 minuti** invece di 5: più veloce del genere, scelta del GDD per mostrare subito l'automazione.

## Decisioni (29 ottobre 2026)

Luca ha approvato D1–D7. D5 con un'aggiunta: la capienza del camion si allarga con un potenziamento (Cassone, da 10 a 40). D6 resta da decidere in M8. Tutte le voci, F1–F7 comprese, sono scritte nel GDD (sezioni 3–15).

## Ordine proposto

1. Luca risponde alle domande D1–D7.
2. Si aggiorna il GDD: sezioni 4, 5, 8, 10, 12 con F1–F7 e le D approvate.
3. Tappa M2 con le correzioni di forma e le D di M2. Chiusura con gli screenshot passati per la lista di controllo, parte A.
