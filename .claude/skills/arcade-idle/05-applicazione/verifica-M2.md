# Verifica della tappa M2 (29 ottobre 2026)

Scatti di `npm run shot` (11 inquadrature, ramo `m2-fase1`) passati per la parte A di `../04-sintesi/checklist.md`. Il riferimento sono le schermate dei giochi del catalogo (fase 2).

## Parte A: screenshot

| N. | Domanda | Esito | Nota |
| --- | --- | --- | --- |
| 1 | Camera 50–55°, muri in diagonale | sì | invariata da M1b |
| 2 | Personaggio al centro, scala del genere | sì | — |
| 3 | Facce in ombra leggibili | sì | — |
| 4 | Ombre corte sotto gli oggetti | sì | — |
| 5 | Terreno più chiaro di tutto | sì | — |
| 6 | 1–2 colori di marca ripetuti | sì | Presse gialle e azzurre, camion giallo, fascia azzurra sulla Pasta |
| 7 | Soldi unico verde brillante | sì | mazzette #2ECC52 con fascia chiara, ben staccate dal prato |
| 8 | Forme semplici, colori pieni | sì | — |
| 9 | Prodotto fuori scala | sì | merci 1,6 volte più grandi, Pasta gigante come insegna sulla Pressa |
| 10 | Ruoli dal colore o dal cappello | sì | giocatore col cappellino rosso, Raccoglitori col cappello di paglia |
| 11 | Niente di alto tra camera e personaggio | sì | partenza spostata a (16,8; 7,2): il tetto della capanna resta in un angolo, circa un sesto dello schermo |
| 12 | Pavimento semplice | sì | tappetini a tinta unita nei colori delle zone |
| 13 | Numeri nella scena | sì | contatori "n/max" su Campi, Pressa, cassone e camion; prezzo sui tappetini |
| 14 | Fumetti con icona e numero | in parte | contatori sì; i fumetti con l'icona arrivano con i clienti (M5) |
| 15 | Si vede dove andare | sì | freccia gialla 3D con anello, freccia al bordo quando il bersaglio è fuori vista, frase dell'obiettivo |
| 16 | Valute in alto a destra | sì | pillola con mazzetta; Rispetto al centro, ingranaggio a sinistra |
| 17 | Effetto di abbondanza | in parte | mucchi di mazzette e torri di Paste sì; piogge e montagne arrivano in M7 |
| 18 | Limiti tecnici | sì | partenza 40.800 triangoli (limite 60.000); massimo 134 disegni e 89.000 triangoli con tutta la Fase 1 aperta |

## Parte B: meccaniche (test automatici)

| N. | Domanda | Esito | Prova |
| --- | --- | --- | --- |
| 1 | Tutto camminando | sì | zone a terra, nessun tasto di azione |
| 2 | Niente sconfitta | sì | nessuno stato di fine partita |
| 3 | Sblocchi su riquadro con prezzo | sì | `tests/phase1.test.ts` |
| 4 | Primo sblocco quasi gratis | sì | il regalo di $20 paga il Campo 2 in meno di 30 s (`tests/phase1-bot.test.ts`) |
| 5 | Primo ciclo entro un minuto | sì | prima vendita entro 90 s col giocatore automatico |
| 6 | Primo lavoratore intorno ai 3–5 minuti | in parte | 1,2 minuti col giocatore automatico, che è più veloce di una persona; si tara in M8 |
| 7 | Qualcosa che solo il giocatore fa | sì | le mazzette e il risveglio dei lavoratori |
| 12 | Disturbi locali, risolti camminando | sì | cassone pieno, lavoratore addormentato |
| 13 | Guida di 4 parole e freccia | sì | test della frase dell'obiettivo |

Tempi misurati col giocatore automatico: primo Raccoglitore 1,2 min (obiettivo 3), Campo 3 3,6 (5), secondo Raccoglitore 7,1 (7), Pressa 2 10,6 (9).

## Non verificato da qui

- Fluidità sull'iMac (fotogrammi al secondo con `?debug=1`).
- Partita a mano di una persona dal minuto 0 alla Pressa 2.
