# Confronto: PATRÓN contro le regole del genere

Fase 5 (29 ottobre 2026). PATRÓN è alla tappa M1b: si cammina nella valle, ma non ci sono ancora merci, soldi né interfaccia (arrivano da M2). Per questo il confronto ha due parti:

- **A. La grafica di oggi**: gli screenshot di `npm run shot` (ramo `main` dopo la PR #1) passati per la parte A di `../04-sintesi/checklist.md`.
- **B. Il progetto scritto**: il GDD (`docs/GDD.md`) passato per la parte B della stessa lista, perché le meccaniche esistono solo sulla carta.

Esiti: **sì** = rispetta la regola · **in parte** · **no** · **previsto** = il GDD lo prevede in una tappa futura.

## A. Screenshot attuali

| N. | Domanda | Esito | Cosa si vede | Regola |
| --- | --- | --- | --- | --- |
| 1 | Camera 50–55°, muri in diagonale | **sì** | 50°, ruotata di 45°, prospettiva stretta (22°) | RF1, RF2 |
| 2 | Personaggio piccolo e al centro | **sì** | al centro; sul lato corto dello schermo stanno circa 6 altezze del personaggio (zoom medio) e 9 (lontano). Nei giochi verticali ne stanno 6–7 sul lato corto: stessa scala | RF3 |
| 3 | Facce in ombra leggibili | **sì** | nessuna zona scura | RF4 |
| 4 | Ombre corte sotto gli oggetti | **sì** | appoggi morbidi | RF5 |
| 5 | Terreno più chiaro di tutto | **sì** | prato verde chiaro, sentieri crema | RF6 |
| 6 | 1–2 colori di marca ripetuti | **no** | ogni oggetto ha il suo colore (tetto rosso, pressa grigia, camion bianco); nessun colore lega le stazioni | RF7 |
| 7 | Soldi unico verde brillante | **no, per costruzione** | i soldi non ci sono ancora, ma il verde dei soldi del GDD (#6FBF5A) è quasi lo stesso del prato (#A6DC7A) e dei cespugli. Sul fondo verde le mazzette si perderanno | RF9 |
| 8 | Forme semplici, colori pieni | **sì** | Lambert piatto, niente texture | RF10, RF11 |
| 9 | Prodotto fuori scala | **no** | le foglie di Lumina sono piante normali; la Pressa è piccola (2,4 m) e sembra un pozzo, non una macchina che produce qualcosa | RF12 |
| 10 | Ruoli dal colore o dal cappello | **previsto** | per ora c'è solo il giocatore, con cappellino rosso | RF8, RF13 |
| 11 | Niente di alto tra camera e personaggio | **in parte** | niente lo copre, ma alla partenza il tetto della capanna occupa circa un quarto dello schermo (il GDD fissa il tetto a un quinto) | RF14 |
| 12 | Pavimento semplice | **sì** | prato a tinta unita, sentieri con bordo | RF15 |
| 13 | Numeri nella scena | **previsto (M2)** | nessun prezzo, contatore o quantità | RF16 |
| 14 | Fumetti con icona e numero | **previsto (M2–M3)** | — | RF17 |
| 15 | Si vede dove andare | **previsto (M2)** | nessuna freccia o riquadro evidenziato | RF18 |
| 16 | Valute in alto a destra | **no** | il GDD mette il contante in alto a sinistra e l'ingranaggio a destra; 7 giochi su 11 fanno il contrario | RF19 |
| 17 | Effetto di abbondanza | **previsto (M7)** | — | RF20, RF21 |
| 18 | Limiti tecnici | **sì** | partenza circa 40.500 triangoli (limite 60.000) | GDD 10 |

**In tre righe.** Camera, luce, colori del fondo e forme sono già quelle del genere. Manca tutto ciò che fa da informazione (numeri, fumetti, frecce): è previsto da M2, ma oggi la scena è un paesaggio vuoto. I tre scarti che il GDD non prevede di correggere sono i colori di marca, il verde dei soldi uguale al prato e le stazioni che non si leggono come macchine.

## B. Progetto scritto (GDD)

| N. | Domanda | Esito | Cosa dice il GDD | Regola |
| --- | --- | --- | --- | --- |
| 1 | Si fa tutto camminando | **sì** | zone a terra; trasferimento ogni 0,08 s (sez. 3) | RC1 |
| 2 | Non si perde mai | **sì** | "pressione sì, fallimento no": gli eventi costano merce e tempo, mai contante, lavoratori o sblocchi (sez. 7) | RC2 |
| 3 | Sblocco su riquadro a terra con prezzo | **sì** | tappetino bianco tratteggiato con prezzo, pagamento in 1,5 s (sez. 3) | RC3 |
| 4 | Primo sblocco quasi gratis, il secondo quanto si ha | **no** | si parte senza soldi; il primo sblocco (Campo 2, $15) arriva al minuto 1:30 dopo circa 9 foglie. In Pizza Ready una pila di soldi regalata paga il primo riquadro (5) al secondo 18 | RC4 |
| 5 | Primo ciclo completo entro un minuto | **sì** | prima vendita a El Gordo a 0:35 (sez. 8) | RC5 |
| 6 | Primo lavoratore intorno ai 5 minuti | **sì** | a 3 minuti, un po' prima di Pizza Ready (5): scelta voluta (sez. 8) | RC8 |
| 7 | Resta qualcosa che solo il giocatore fa | **no, alla fine** | dopo i capi squadra il giocatore "non deve più incassare né trasportare" (sez. 6). In Pizza Ready solo il giocatore raccoglie i soldi, fino alla fine | RC9 |
| 8 | Pila bassa all'inizio, 4–5 livelli | **in parte** | parte da 4 (il genere da 1); Zaino a 8 livelli con costo × 1,15 per livello, crescita dolce da idle classico; il genere usa 4–5 livelli ripidi | RC10, RC11 |
| 9 | Livello del locale con soglie che si allungano | **no** | nessun livello: il progresso è la sequenza degli sblocchi e la barra dell'obiettivo. 10 giochi su 11 hanno un livello (stelle) | RC12 |
| 10 | Filiere di 2–3 passaggi, in parallelo | **in parte** | una sola filiera lunga 4 passaggi (Campo → Pressa → Laboratorio → Banco → Plaza). La rende accettabile il camion di El Gordo, che compra a ogni passaggio: ogni fase chiude un ciclo corto. Mancano filiere parallele | RC14, RC15 |
| 11 | Il tema ha il suo "lavoretto" | **no** | nessun compito che non produce: niente rifiuti, pulizie o simili | RC16 |
| 12 | Disturbi locali, visibili, risolti camminando, mai fatali | **sì** | perquisizione con cerchio rosso e 10 s per svuotare la stazione, rivale da cacciare stando vicino, posto di blocco su un tratto (sez. 7) | RC17 |
| 13 | Guida di 3–4 parole e una freccia | **sì** | una riga di massimo 6 parole con mano o freccia (sez. 8) | RC21 |
| 14 | Prima sessione di almeno 20 minuti | **sì** | la sequenza arriva alla Plaza al minuto 25 e alla fine della Beta al 140 (sez. 5) | numeri di genere |

**Altri scarti dalle regole**

| Regola | Esito | Nota |
| --- | --- | --- |
| RC13 Clienti in fila dal primo secondo (7/11) | **no** | per 25 minuti si vende solo al camion, che compra all'istante: nessuna fila, nessuna domanda da inseguire. È il modello di Farm Land, il gioco con meno contenuto del catalogo |
| RC18 Spinte a tempo (8/11) | **no** | nel genere stanno quasi tutte dietro le pubblicità, che PATRÓN non ha. Si possono dare come premio di gioco |
| RC19 Seconda valuta (10/11) | **no, per scelta** | il GDD tiene una sola valuta nella Beta. Nel genere la seconda valuta serve alla monetizzazione: si può lasciare così |
| RC20 Missioni giornaliere ed eventi (6/11) | **in parte** | ordini speciali di El Gordo, rivale ed eventi del Calore ci sono; missioni giornaliere no |

**Il Calore.** Nessuno degli 11 giochi ha una minaccia che cresce con la produzione (0/11). Il GDD la mitiga già bene:
- il camion di El Gordo non genera Calore;
- la Quota e "Paga il Comandante" lo fanno scendere;
- gli eventi non tolgono mai progresso.

Il rischio che resta è quello indicato dalla ricerca: punire chi gioca bene. Il GDD non ha ancora un controllo numerico che dica che vendere in Plaza conviene sempre, anche contando le perdite degli eventi.

## C. Seconda lettura del GDD: fedeltà al genere

Dopo la prima versione del confronto, Luca ha fissato il principio (29 ottobre 2026): PATRÓN deve essere **il più fedele possibile ai giochi esistenti**, così che chi cerca un arcade idle non trovi differenze sostanziali. Ogni scarto dal genere deve avere un motivo scritto. Rileggendo il GDD con questo criterio sono emersi altri scarti, non coperti dalla lista di controllo:

| Scarto | Cosa fa il genere | Esito | Decisione |
| --- | --- | --- | --- |
| Stipendi ogni minuto e sciopero se mancano i soldi | Nessuno degli 11 giochi ha stipendi: l'assunzione si paga una volta (PR), la prima è gratis (BP); i lavoratori si addormentano e vanno svegliati (MM, PR) | **no** | Niente stipendi; lavoratori che si addormentano ogni 90–150 s e si svegliano quando il giocatore passa vicino (GDD 6) |
| Tasto U che apre l'Ufficio da qualunque punto | Agli uffici si va a piedi (PR, BP) | **no** | Tolto il tasto: l'Ufficio si apre solo a piedi (GDD 3, 12) |
| Barra dell'obiettivo con nome, costo e riempimento | Una frase di 3–4 parole in alto al centro ("Create a table!") e una freccia sul riquadro (PR, BP, MMM) | **no** | Frase dell'obiettivo di 4 parole al massimo sotto il Rispetto (GDD 8, 9, 12) |
| Livello in alto a sinistra | Stella del livello con barra al centro in alto, ingranaggio a sinistra, soldi a destra (PR, BP) | **no** | Stessa disposizione (GDD 12) |
| Potenziamenti come righe di un elenco | Schede grandi con l'immagine della macchina, le tacche dei livelli e il prezzo (PR, BP) | **no** | Schede (GDD 12) |
| Tappetini con solo il prezzo | Icona di ciò che si sblocca e prezzo ("NEW ZONE 100") | **in parte** | Icona più prezzo (GDD 10) |
| Clienti che se ne vanno dopo 25 s | Nei video nessun cliente se ne va: la fila aspetta sempre, con un fumetto "No Seat!" se manca qualcosa (PR, BP) | **no** | I clienti non se ne vanno mai; chi aspetta oltre 25 s fa scendere la Fama (GDD 4, 5) |
| Fila massima di 6 | Code di 10–15 persone (PR, BP) | **no** | Fila fino a 12 (GDD 4) |
| Nessuna spinta raccoglibile | Icone "180%" galleggianti da prendere camminando, dietro pubblicità (PR, BP); spinte a tempo in 8 giochi su 11 | **no** | Icona "180%" gratis ogni 3–5 minuti, 60 s di velocità (GDD 7) |
| Nessuna missione | Missioni giornaliere in 6 giochi su 11 (5 in Monkey Mart) | **no** | Tre missioni sempre attive, senza timer, per non punire chi salta un giorno (GDD 9) |
| Raccoglitori rinviati a M3 | Il primo lavoratore arriva nel primo ciclo di gioco, a 3–5 minuti (PR) | **no** | I Raccoglitori entrano in M2, con percorsi e sonno (GDD 15) |
| Istruzioni fino a 6 parole | 3–4 parole (PR, BP) | **in parte** | 4 parole al massimo (GDD 8) |

**Scarti che restano, con il motivo**

| Scarto | Motivo |
| --- | --- |
| Tastiera e clic invece del joystick | PATRÓN è per computer; anche Outlets Rush sul web usa WASD e mouse |
| Schermo orizzontale | Stesso motivo; la scala del personaggio sul lato corto è quella del genere (sezione A, punto 2) |
| Pila che parte da 4 invece che da 1 | La Pressa vuole 3 foglie per volta: con 1 il primo minuto sarebbe solo camminare. Si rivede in M8 (D6) |
| Una sola valuta | La seconda valuta del genere serve alla monetizzazione, che la Beta non ha |
| Potenziamenti delle stazioni nell'Ufficio invece che accanto alla macchina | Sotto soglia: le schede accanto alla macchina sono documentate solo in 2 giochi su 11 |
| Calore che cresce con la produzione | È l'idea originale di PATRÓN; resta, con la regola "produrre di più conviene sempre" e il suo test (GDD 7, 14) |
