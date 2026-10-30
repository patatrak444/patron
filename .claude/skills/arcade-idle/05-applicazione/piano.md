# Piano delle modifiche

Fase 5. È la lista di cose da fare per portare PATRÓN alla fedeltà con il genere. Viene da `confronto.md` (parti A, B e C). Tutte le decisioni sono già scritte nel GDD (29 ottobre 2026); qui sono ordinate per tappa, così ogni sessione sa cosa costruire e come verificarlo.

**Principio (Luca, 29 ottobre 2026).** Massima fedeltà ai giochi esistenti: chi cerca un arcade idle deve trovare in PATRÓN la stessa forma e lo stesso modo di giocare, senza differenze che si notino. In dubbio si segue il pattern più frequente del catalogo; ogni scarto ha un motivo scritto in `confronto.md`.

## Decisioni prese

| N. | Decisione | Regola o fonte | GDD |
| --- | --- | --- | --- |
| D1 | Regalo di El Gordo: $20 davanti alla capanna, Campo 2 come primo acquisto | RC4 | 4, 5, 8 |
| D2 | Rispetto: +4 stelle per sblocco, +1 per livello di potenziamento; soglie 15, 24, 39, 60, 81…; Laboratorio con Rispetto 3, Plaza con Rispetto 4 | RC12 | 5, 9, 12 |
| D3 | Scarti della Pressa (1 ogni 2 Paste, cassone 0/6) da portare al Falò; poi li portano i Raccoglitori | RC16 | 4, 6 |
| D4 | Solo il giocatore raccoglie le mazzette, fino alla fine | RC9 | 6 |
| D5 | Camion con cassone "n/max" da 10, parte pieno e torna dopo 20 s; potenziamento Cassone fino a 40 | RC13 e Luca | 4, 5 |
| D6 | Livelli di Zaino e Scarpe da rivedere in M8 | RC10, RC11 | 5 |
| D7 | Ordine speciale completato: 60 s di velocità doppia | RC18 | 7 |
| D8 | Raccoglitori in M2 | RC8 | 15 |
| D9 | Niente stipendi: l'assunzione si paga una volta; i lavoratori si addormentano e si svegliano al passaggio del giocatore | confronto C | 6, 13 |
| D10 | Ufficio solo a piedi, niente tasto U | confronto C | 3, 12 |
| D11 | Interfaccia del genere: ingranaggio a sinistra, Rispetto e frase dell'obiettivo al centro, contante a destra; potenziamenti a schede | RF19, confronto C | 9, 12 |
| D12 | Istruzioni di 4 parole al massimo | RC21 | 8 |
| D13 | Tappetini con icona e prezzo; mazzette in blocchi 2 × 3 | RF16, confronto C | 10 |
| D14 | Icona "180%" raccoglibile ogni 3–5 minuti | RC18 | 7 |
| D15 | Clienti che non se ne vanno mai; fila fino a 12 | confronto C | 4, 5 |
| D16 | Tre missioni sempre attive, senza timer | RC20 | 9 |
| F1–F7 | Soldi verde acceso, colori di marca, stazioni-macchina con il prodotto-insegna, merci grandi, capanna sotto un quinto dello schermo, contante a destra, formato dell'informazione nel mondo | RF7, RF9, RF12, RF14, RF16–RF19 | 3, 4, 10, 12 |

## Da fare, tappa per tappa

Ogni voce si spunta solo quando la verifica indicata è passata.

### M2 · Fase 1 a mano (fatta il 29 ottobre 2026, in attesa della prova sull'iMac)

**Logica di gioco** (`src/sim/`, con test)
- [x] Pila: 4 posti, merci miste, scarico per tipo, MAX a pila piena (GDD 3)
- [x] Zone a terra: raggio 1,2 m, un oggetto ogni 0,08 s; tappetini di sblocco pagati a scatti in 1,5 s (GDD 3)
- [x] Campo: 1 Foglia ogni 3 s, uscita 8 (GDD 4)
- [x] Pressa: 3 Foglie → 1 Pasta in 4 s, buffer 12/10; 1 sacco di Scarti ogni 2 Paste, cassone 6, ferma a cassone pieno (D3)
- [x] Falò: accetta Scarti, li brucia (D3)
- [x] Camion: paga $5 a Pasta subito; cassone 10; pieno → parte e torna dopo 20 s (D5)
- [x] Mazzette a terra raccolte solo dal giocatore (D4)
- [x] Regalo iniziale di $20 (D1)
- [x] Sequenza degli sblocchi 1–5 con i prezzi della tabella (GDD 5)
- [x] Rispetto: stelle, soglie, premio $20 × livello (D2)
- [x] Raccoglitori: macchina a stati, percorsi A*, priorità agli Scarti con cassone pieno per metà, sonno ogni 90–150 s e risveglio entro 1,5 m (D8, D9)

**Mondo** (`src/world/`)
- [x] Merci larghe quanto la testa; pila a torre tra le braccia, con ritardo a molla (F4, GDD 3 e 10)
- [x] Stazioni ridisegnate: colori di marca azzurro e giallo, prodotto-insegna sopra, merce impilata sull'uscita (F2, F3)
- [x] Mazzette verde acceso #2ECC52 con bordo #E9FFD9, in blocchi 2 × 3 (F1, D13)
- [x] Tappetini con icona, prezzo grande e anello di pagamento (D13)
- [x] Contatori "n/max" su Campi, Pressa, cassone e camion; MAX a stazione piena; fumetti con un'icona e un numero (F7)
- [x] Freccia gialla 3D sul prossimo tappetino e anello a terra; freccia al bordo se fuori schermo (F7)
- [x] Camion che parte, sparisce lungo la strada e torna; cerchio con il conto alla rovescia (D5)
- [x] Falò con fiammata a ogni sacco (D3)
- [x] Raccoglitori con cappello di paglia; "zzz" grande e oscillante quando dormono (D9)
- [x] Capanna alla partenza sotto un quinto dello schermo (F5)

**Interfaccia** (HTML/CSS)
- [x] Ingranaggio in alto a sinistra; Rispetto (stella e barra "n/max") in alto al centro; frase dell'obiettivo sotto; contante in pillola in alto a destra (D11)
- [x] Istruzioni dei primi minuti da 4 parole, sequenza 0:05–0:55 della sezione 8 (D12); i tasti WASD disegnati a schermo arrivano con l'onboarding (M7)

**Verifica di chiusura**
- [x] `npm test` verde
- [x] `npm run shot` con scatti nuovi: pila piena, camion in viaggio, tappetino in pagamento, Raccoglitore addormentato
- [x] Ogni scatto passato per la parte A di `../04-sintesi/checklist.md`, con l'esito scritto in `verifica-M2.md`
- [x] Partenza sotto 60.000 triangoli, ovunque sotto 150.000 e 150 disegni
- [ ] Sull'iMac: almeno 50 fps con `?debug=1`; dal minuto 0 alla Pressa 2 senza aiuto (Luca)

### M2b · Rifondazione (fatta il 30 ottobre 2026, in attesa della prova sull'iMac)

Il mondo di M2 è stato buttato e rifatto da zero secondo `../06-prima-sessione/regole.md`.

- [x] Missione leggibile all'avvio: lotto vuoto con l'arco PATRÓN in vista (PS1–PS3)
- [x] Spazio iniziale piccolo: lotto 1 di 12 × 10 m recintato; si cammina solo nei lotti aperti (PS5)
- [x] Il lotto 2 si apre accanto: il pavimento si srotola, la staccionata in comune sparisce (PS6)
- [x] Un solo sblocco visibile alla volta, come sagoma dell'oggetto futuro con parentesi agli angoli e prezzo (PS10, PS11)
- [x] Tutto da comprare: Campo 1 a $5, Pressa 1 a $15, poi la sequenza del GDD (PS8)
- [x] Regalo di $25 a due passi dal giocatore (PS9)
- [x] Festa dello sblocco: primo piano di 1,1 s, coriandoli, oggetto che salta fuori (PS13)
- [x] Camion che arriva da ovest sulla strada con la prima Pressa e riparte verso est (PS14)
- [x] Merce tra le braccia, mazzette sulla schiena (una ogni $10, fino a 20) che volano al tappetino (PS15, PS16)
- [x] Sbuffi di polvere mentre si corre (PS19)
- [x] Camera 14/19/26 m: scarto da PS18 motivato nel GDD sezione 3
- [ ] Schermata di caricamento con logo e missione; tasti WASD disegnati a schermo (rimandati a M7, onboarding)
- [x] `npm test` verde (89), `npm run shot` con 11 scatti, nessun errore nel browser
- [x] Disegni ≤ 144, partenza 59k triangoli, ovunque ≤ 114k
- [ ] Sull'iMac: almeno 50 fps; dal minuto 0 alla Pressa 2 senza aiuto (Luca)

### M2c · Storia e leggibilità (dal giudizio di Luca sulla M2b, 30 ottobre 2026)

**Cosa funziona già (da non rompere):** spazio iniziale piccolo che si allarga con gli acquisti; tappetino di sblocco con l'icona e il prezzo; barra del Rispetto in alto con la frase dell'obiettivo.

**Cosa non funziona:** nessuna introduzione né schermata con il logo, solo frecce; merce e soldi si confondono con il personaggio e spuntano solo da certe angolature; tappetini quadrati a tinta unita; non si capisce cosa sia la Pressa né a cosa serva; grafica ancora lontana dal genere.

Una voce per volta, nell'ordine. Ognuna si chiude con test, screenshot, la prova di percezione (GDD sezione 1, «La storia») e la prova di Luca sull'iMac, prima di passare alla successiva.

| # | Voce | Perché a questo punto | Fatta quando |
|---|---|---|---|
| 1 | **Storia** nel GDD: antefatto, personaggi, capitoli, segni nel mondo, prova di percezione | Decide nomi, personaggi e scene di tutto il resto | [x] Scritta; attende l'ok di Luca |
| 2 | **Stazioni che si spiegano da sole**: la Pressa diventa il Torchio, con le foglie che entrano da una parte e i panetti che escono dall'altra; cartello con «foglia → panetto» sopra ogni stazione | È la domanda 5 della prova: se non si capisce la macchina, non si capisce il gioco | [ ] |
| 3 | **Tappetini con l'icona**: ogni tappetino ha la forma e lo stile di quello di sblocco, con l'icona di cosa si lascia o si prende e una freccia dentro/fuori; niente quadrati a tinta unita | Stesso linguaggio visivo per tutto quello che si calpesta | [ ] |
| 4 | **Pila sempre visibile**: merce e soldi disegnati sopra il personaggio da ogni angolatura, più alti delle spalle e mai coperti dal corpo | Domanda 6 della prova; è il feedback continuo del genere | [ ] |
| 5 | **Schermata principale e tre vignette**: logo, GIOCA, impero dimostrativo al tramonto, tre vignette saltabili, poi la Hacienda (GDD sezione 8) | Domande 1–3: chi sono, dove sono, chi mi paga | [ ] |
| 6 | **El Gordo in scena**: al finestrino del camion, con battute brevi nei primi minuti al posto delle sole frecce | La guida diventa un personaggio; la storia si sente giocando | [ ] |
| 7 | **Capitoli**: nome del capitolo nell'interfaccia e scena di chiusura del capitolo 1 («Il debito») | Dà una meta alla Fase 1 | [ ] |
| 8 | **Grafica del genere**: confronto fianco a fianco con Pizza Ready e My Mini Mart, scheda di punteggio, interventi su personaggi, luce, contorni e materiali | Si fa per ultima, su un mondo che ormai si capisce | [ ] |

### M3 · Ufficio e Cargador
- [ ] Pannello Ufficio a schede grandi (immagine, tacche, prima → dopo, prezzo), aperto solo stando sul tappetino viola (D10, D11)
- [ ] Potenziamenti della tabella, Cassone compreso (D5)
- [ ] Cargador di El Gordo e il suo tappetino (5b)
- [ ] Lavoratori extra dall'Ufficio, prezzo × 1,6
- [ ] Icona "180%" raccoglibile ogni 3–5 minuti (D14)
- [ ] Verifica: la Fase 1 gira da sola; i numeri dei potenziamenti corrispondono alla tabella; parte B della lista di controllo

### M4 · Fase 2
- [ ] Laboratorio con lucchetto "Rispetto 3" (D2)
- [ ] Corriere A, barra del Calore, Purezza
- [ ] Ordini speciali e spinta ×2 per 60 s (D7)
- [ ] Test "produrre di più conviene sempre" per il Laboratorio (GDD 7, 14)

### M5 · Fase 3
- [ ] Banco e Plaza con lucchetto "Rispetto 4" (D2)
- [ ] Clienti che non se ne vanno, fila fino a 12, faccina scontenta oltre 25 s (D15)
- [ ] Spacciatore, Corriere B, Guardia, capi squadra senza incasso (D4)
- [ ] Quota pagata ogni 60 s, posti di blocco, perquisizioni, retate, rivale
- [ ] Test "produrre di più conviene sempre" con la Plaza

### M6 · Salvataggio e offline
- [ ] Salvataggio con stelle del Rispetto e carico del camion
- [ ] Offline: rendimento dei lavoratori × 0,8, Presse solo con gli Scarti gestiti, camion un cassone ogni (riempimento + 20 s) (GDD 13)

### M7 · Game feel e onboarding
- [ ] Tre missioni sempre attive (D16)
- [ ] Effetti di abbondanza: pioggia di mazzette ai livelli di Rispetto, montagne di merce (RF20, RF21)
- [ ] Spiegazioni al momento giusto: Scarti, camion pieno, primo livello, primo lavoratore addormentato (GDD 8)

### M8 · Bilanciamento
- [ ] Ritmo misurato contro il genere: primo ciclo entro 1 minuto, primo lavoratore a 3 minuti, livelli che si allungano di circa 1,3 volte (RC5, RC8, RC12)
- [ ] Zaino e Scarpe: 4–5 livelli più ripidi oppure gli 8 attuali, decisione con le partite di prova (D6)
- [ ] Prima sessione di almeno 20–25 minuti di cose nuove
