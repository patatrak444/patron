---
name: ux-ui-arcade-idle
description: UX/UI game designer per PATRÓN. Usala prima di toccare tappetini, raccolta e pila, disposizione delle stazioni, camera, tempi degli obiettivi, schermata iniziale o interfaccia, e per giudicare uno screenshot o una partita con la lista dei controlli UX.
---

# UX/UI game designer per arcade idle

Questa skill fa lavorare Claude come un progettista di esperienza di gioco. La domanda di partenza non è "è bello?", ma: **il giocatore capisce subito cosa fare, lo fa senza fatica e ne ricava piacere?** Si appoggia sull'enciclopedia del genere (`../arcade-idle/`) per *cosa* fanno i giochi di successo. Questa skill dice *come* trasformarlo in esperienza e *come* verificarla.

Gerarchia: `docs/GDD.md` e `CLAUDE.md` vincono sempre. Una regola di questa skill entra nel gioco solo dopo essere stata scritta nel GDD, citando la regola (UX1, UX2…).

## Come si lavora

1. **Si parte dal giocatore.** Prima di cambiare qualcosa si scrive in una riga quale difetto vede il giocatore (es. "la merce sparisce dietro il corpo quando corro verso l'alto").
2. **Si confronta con il genere.** Si cerca il comportamento nei giochi di riferimento: prima `../arcade-idle/06-prima-sessione/pizza-ready-misure.md` (misure dal video completo di Pizza Ready), poi gli altri file dell'enciclopedia, poi `fonti/rapporto-ricerca.md`. Se due fonti si contraddicono, vince la misura sul fotogramma.
3. **Si propone un valore, non un'impressione.** Ogni proposta ha numeri (metri, secondi, frazioni di schermo) e la fonte da cui vengono, oppure la dicitura "da tarare".
4. **Si scrive nel GDD, poi si costruisce, poi si verifica** con `npm run shot`, con i controlli qui sotto e con la prova di percezione (GDD sezione 1).
5. **Una voce per volta.** Ogni modifica si chiude con la prova di Luca sull'iMac prima della successiva.

## Le regole (UX1–UX12)

Valori misurati su Pizza Ready quando c'è scritto **[PR]**; altrimenti dedotti e da tarare.

| # | Regola | Valori |
|---|---|---|
| UX1 | **Un solo tappetino "pieno": quello di acquisto.** Riquadro arancio chiaro, angoli arrotondati, bordo bianco, prezzo e banconota, grande quanto l'impronta dell'oggetto, disteso dove l'oggetto comparirà. Quando ci si sale sopra diventa **verde** e il prezzo scende fino a zero; se finiscono i soldi resta verde con il residuo | Lato ≈ 1,2 altezze di personaggio [PR]; pagamento ≈ 2 s qualunque sia il prezzo [PR]; 0,25 s di attesa prima di prendere soldi |
| UX2 | **Prendere e lasciare merce avviene sulla macchina**, non su quadrati colorati: uscita su un vassoio o ripiano scuro dove la merce si impila, ingresso in una tramoggia o un banco che mostra la merce. Al massimo un contorno bianco sottile attaccato alla macchina, con l'icona della merce e una freccia dentro/fuori | Area d'attivazione = disegno (non più larga); nessun colore pieno verde, giallo o rosso a terra |
| UX3 | **I soldi non si portano addosso.** Si raccolgono passando su mattonelle di banconote a terra, volano nel contatore in alto a destra; pagando volano dal personaggio al tappetino | Mattonelle 2 × 3, crescono in altezza [PR] |
| UX4 | **La merce in mano è più larga del corpo** e sta davanti, all'altezza delle mani: così si vede da ogni direzione. Oltre i 3 pezzi la pila supera la testa; in corsa si piega come una molla | Larghezza ≈ 1,4 volte il corpo [PR]; "MAX" rosso sopra la cima |
| UX5 | **Ogni passaggio di merce vola.** Nessun pezzo compare o sparisce di colpo: arco dalla sorgente alla pila e dalla pila alla destinazione | 0,2–0,3 s, arco 0,5–0,8 m, 0,08 s tra un pezzo e l'altro |
| UX6 | **Camera lontana, inclinata come il genere.** Il personaggio è piccolo e tutto il lotto attivo entra nell'inquadratura con un bordo di prato. La camera non si allontana quando il mondo cresce: cambia solo per la festa | Personaggio ≈ 1/17 dell'altezza [PR], su desktop 1/12–1/16; inclinazione ≈ 44° [PR] (genere 44–55°); rotazione 45° [PR] |
| UX7 | **Aria tra le cose.** Tra un punto in cui ci si ferma e il successivo ci sono 3–6 m da bordo a bordo; le aree d'attivazione non si toccano; nel primo minuto il pavimento è libero per almeno il 60% | Nessun tratto del primo ciclo sotto 2 m o sopra 8 m (oltre 5 s di corsa è un "simulatore di corsa", WNHub) |
| UX8 | **Festa a ogni acquisto**: primo piano sull'oggetto nuovo, stelle che volano alla barra del livello, coriandoli, emoji sul personaggio. Piace a Luca: si tiene | Pizza Ready ≈ 5 s in tutto con primo piano ×3 [PR]; PATRÓN oggi 1,1 s: allungare verso 2–3 s se la prova lo conferma |
| UX9 | **Un solo segnale "vai qui" alla volta**: freccia 3D che rimbalza sul bersaglio, e una freccia piatta a terra accanto al personaggio quando il bersaglio è fuori schermo. Sotto la barra del livello una frase di 2–4 parole | Freccia e frase [PR] |
| UX10 | **Ritmo a due strati.** Primo minuto: un acquisto ogni 10 s circa, pagato dal regalo. Poi qualcosa di comprabile o da fare ogni 20–90 s. Momenti grandi (livello, lavoratore, zona) ogni 2–5 minuti nei primi 15, ogni 5–8 fino al 60 | Pizza Ready: 4 acquisti in 42 s, obiettivo nuovo ogni 20–40 s fino a 4:40, livelli a 2, 6, 13, 24 min [PR] |
| UX11 | **Il regalo iniziale si vede da lontano e paga il primo giro intero**: cubo di banconote alto quanto il personaggio accanto al primo tappetino | Pizza Ready: $180 = porta + tavolo + forno + bancone [PR] |
| UX12 | **Un clic per giocare.** Schermata iniziale con il mondo completo, il logo e un pulsante GIOCA attivo da subito; clic ovunque, Invio o Spazio avviano; l'audio parte solo dopo il clic. Poi la camera scende sul lotto vuoto, senza testo | CrazyGames: al massimo 1 clic, pulsanti senza ritardo |

## Controlli per screenshot e partite

Si usano a ogni tappa, insieme a `../arcade-idle/04-sintesi/checklist.md`. S = screenshot, P = partita. Un controllo fallito significa che la tappa non è finita.

| # | Controllo | Come | Passa se… |
|---|---|---|---|
| 1 | Ogni azione (prendere, lasciare, incassare, pagare) risponde con almeno due segnali tra movimento, suono e numero | P | risposta entro ≈ 100 ms |
| 2 | Un solo segnale "vai qui" dominante | S | esattamente uno |
| 3 | Prezzi e numeri leggibili anche nella finestra minima | S | testo ≥ 14 px con contorno |
| 4 | In scala di grigi personaggio, stazioni attive e sblocchi si staccano dallo sfondo | S | per luminosità, non solo per tinta |
| 5 | Un estraneo dice in 5 s cosa si compra e cosa fa ogni macchina | S | senza leggere frasi |
| 6 | Un colore = una funzione: soldi verdi, guida colorata, MAX rosso, acquisto sempre lo stesso tappetino | S | nessun tappetino monocromo verde/giallo/rosso |
| 7 | Un solo obiettivo alla volta nel primo minuto; frasi di 2–4 parole; nessun pannello che si apre da solo | P | — |
| 8 | Non si paga per sbaglio passando; uscendo il versato resta | P | nessuna perdita involontaria |
| 9 | Frecce e WASD, audio disattivabile, pausa quando la scheda perde il fuoco | P | tutti e tre |
| 10 | Pila visibile nelle 8 direzioni di corsa, con 1 e con 4 pezzi | S (8 scatti) | si vede almeno metà del pezzo più alto, anche di spalle |
| 11 | Nessun secondo carico addosso che copre la merce | S | — |
| 12 | Solo l'acquisto è un tappetino pieno; prendere e lasciare avviene sulla macchina | S | — |
| 13 | Tratti del primo ciclo di 3–6 m; aree d'attivazione separate; ≥ 60% di pavimento libero | S/P | nessun tratto < 2 m o > 8 m |
| 14 | Il lotto attivo entra intero all'avvio con un bordo di prato; niente di alto tra camera e personaggio | S | — |
| 15 | C'è sempre un acquisto possibile entro 60–90 s di gioco attivo | P | nella prima ora |
| 16 | Ogni acquisto ha la festa e i soldi volano | P | — |
| 17 | Nessuna attesa vuota oltre 10 s nei primi 10 minuti | P | — |
| 18 | Un solo clic per giocare, pulsante attivo da subito, nessun errore in console | P | — |
| 19 | L'interfaccia fissa occupa meno del 10% dello schermo, ai bordi | S | — |

## Dove guardare

- `fonti/rapporto-ricerca.md`: il rapporto completo (tappetini, pila, spazio e camera, tempi, schermata, euristiche, conflitti con il GDD).
- `fonti/*.md`: le note dei cinque filoni di ricerca.
- `../arcade-idle/06-prima-sessione/pizza-ready-misure.md` e `fotogrammi-pizza-ready/`: misure dal video completo di Pizza Ready e confronto con PATRÓN. **Dove il rapporto e il video non coincidono, vale il video.** Questi sono i punti corretti dal video:
  - **inclinazione:** il rapporto proponeva 58°, Pizza Ready ne ha ≈ 44°. La vista "dall'alto" viene dalla distanza, non dall'angolo;
  - **distanza:** il rapporto proponeva il personaggio a 1/13 dell'altezza, Pizza Ready lo tiene a ≈ 1/17. Allontanarsi è quindi conforme al genere, non uno scarto;
  - **pagamento:** il riquadro diventa tutto verde, non si riempie un anello;
  - **festa:** dura ≈ 5 s, non 1 s;
  - **pila:** la merce è più larga del corpo.
