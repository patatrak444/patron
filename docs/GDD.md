# PATRÓN — Documento di design della Beta

Oct 23, 2026 · @luca · aggiornato il 29 ottobre 2026 con le regole della skill `arcade-idle` (regalo iniziale, Rispetto, scarti e Falò, camion con cassone, mazzette solo al giocatore, spinte, niente stipendi ma lavoratori che si addormentano, Ufficio solo a piedi, interfaccia del genere, clienti che non se ne vanno, missioni, forma dell'informazione nel mondo); il 30 ottobre 2026 con la missione, il mondo a lotti e la prima sessione del genere (skill `arcade-idle`, Fase 6), poi con la storia e la visione della filiera (sezione 1); ancora il 30 ottobre 2026 dopo la revisione della prima sessione (voto 3,2/10): lotto da 18 × 24 m, camera più lontana, presa e consegna sulla macchina, soldi non addosso, merce più larga, regalo a cubo, Ufficio con tre potenziamenti, effetti sonori

PATRÓN è un arcade idle 3D da giocare nel browser del computer in cui un contadino senza niente scala la filiera di un traffico stilizzato, dal campo allo spaccio, fino a diventare il Patrón. Questo documento descrive la **Beta**: le Fasi 0–3 della progressione più il sistema del Calore, abbastanza per capire se il loop diverte. È scritto per essere eseguito da Claude Code passo per passo (sezione 15).

## 1. Visione

**Il gioco in una frase.** Muovi il tuo personaggio con la tastiera o il mouse, trasporti la merce tra le stazioni, incassi, assumi chi lavora al posto tuo e reinvesti, mentre la polizia ti stringe addosso man mano che cresci.

**Pubblico della Beta.** Tu e i tuoi amici, ognuno con il proprio mondo, da computer, nel browser, aprendo un link. Nessun multiplayer.

**Ambientazione.** Una valle immaginaria in un paese sudamericano di fantasia, primi anni '80. Il prodotto è la **Lumina**, una sostanza inventata ricavata da una pianta: cristalli azzurri luminescenti. Nessuna chimica reale, nessuna sostanza reale, nessun nome reale (né "Narcos", né cartelli o persone esistenti), violenza solo suggerita e mai grafica.

**La missione.** "Da un campo abbandonato all'impero del Patrón." Il giocatore la capisce dal primo fotogramma, senza leggere: comincia dentro la **Hacienda**, un lotto di terra battuta chiuso da una staccionata, con un grande arco di legno che porta l'insegna PATRÓN. Il lotto è vuoto: ci sono solo le sagome delle stazioni che verranno. È il locale vuoto di Pizza Ready e il lotto con l'arco di Monkey Mart: uno spazio da riempire, che poi si allarga lotto dopo lotto fino a coprire la valle (skill `arcade-idle`, regole PS2 e PS3). La stessa frase sta sotto il logo nella schermata di caricamento e su un cartello accanto all'arco.

**I quattro pilastri.** Ogni scelta di design si giudica contro questi quattro principi.

1.  **Il valore sta a valle.** Come nella realtà, ogni anello della filiera che controlli moltiplica il prezzo. La progressione è una scalata verticale, non solo "più macchine".

2.  **C'è sempre un prossimo passo visibile e vicino.** Il giocatore non deve mai chiedersi cosa fare.

3.  **Crescere costa rischio.** Più produci e vendi in proprio, più sale il Calore. Espansione e prudenza tirano in direzioni opposte.

4.  **Da operaio a Patrón.** L'automazione sposta il giocatore dal trasporto manuale alla gestione. Il ruolo cambia, non solo i numeri.

**Dentro e fuori dalla Beta.**

| Dentro la Beta                             | Fuori dalla Beta (sezione 16)       |
|--------------------------------------------|-------------------------------------|
| Fase 0: onboarding                         | Fase 4: riciclaggio e denaro pulito |
| Fase 1: il Campo e il Torchio               | Fase 5: rotte di esportazione       |
| Fase 2: il Laboratorio                     | Fase 6: impero, Caduta e prestigio  |
| Fase 3: la Plaza e lo spaccio              | Lealtà e informatori                |
| Calore, Quota, perquisizioni, banda rivale | Classifica tra amici online         |
| Ordini speciali di El Gordo                | Pubblicità e acquisti in-app        |
| Salvataggio, guadagni offline              | Versione per telefono e App Store   |

### La storia e la visione (per chi costruisce il gioco)

**Questa storia non entra nel gioco come testo.** Niente introduzione, vignette, dialoghi o scritte a macchina: PATRÓN segue le regole del genere (skill `arcade-idle`, PS1), e si entra subito nella Hacienda. La storia serve a noi: dà a ogni scelta (cosa si sblocca, chi si assume, come cambia il mondo) una direzione coerente. Il giocatore deve arrivarci da solo, guardando il mondo: **chi è, chi lo paga, dove sta andando.**

**L'antefatto.** Valle de Sombra, 1981. Tito, diciannove anni, eredita dal padre la Hacienda La Esperanza: terra battuta, una staccionata storta, un arco di legno, e un debito con **El Gordo**, il compratore della valle. Nel campo abbandonato è cresciuta la **Lumina**. El Gordo gli anticipa qualche mazzetta: «Tu coltivi, io compro». Sull'arco Tito scrive **PATRÓN**: è la direzione di tutta la partita.

**I personaggi.** Si riconoscono dalla sagoma anche allo zoom lontano; non parlano, al massimo un fumetto con un'emoji (PS20).

| Personaggio | Ruolo nella filiera | Come si riconosce | Quando entra |
|---|---|---|---|
| Tito (il giocatore) | Da contadino a capo: prima trasporta tutto, alla fine raccoglie solo i soldi e decide | Cappello rosso, camicia verde; completo bianco all'ultimo sblocco | Sempre |
| El Gordo | Il compratore sicuro: paga poco, non porta polizia. Prima unico cliente, poi concorrente | Grosso, cappello bianco, occhiali scuri; sporge dal finestrino del camion giallo | Con il primo Torchio |
| Raccoglitori | Portano le foglie dai Campi al Torchio e gli Scarti al Falò | Cappello di paglia | Capitolo 1, minuto 3 |
| Corrieri | Collegano le stazioni lontane (Torchio → Laboratorio → Banco → Plaza) | Cappellino e zaino | Capitoli 2 e 3 |
| Doña Rosa | Il Laboratorio: la Lumina diventa Cristallo | Grembiule, occhiali tondi | Capitolo 2 |
| Spacciatori e Guardia | La vendita diretta in Plaza e la sua protezione | Camicia a fiori; canottiera | Capitolo 3 |
| Capi squadra | Tengono un'area senza il giocatore | Cappello a tesa larga, sigaro | Fine capitolo 3 |
| Comandante Vargas | Il prezzo del crescere: Calore e Quota | Divisa kaki, baffi | Capitolo 3 |
| Los Cuervos | La concorrenza di El Gordo quando Tito vende da sé | Giacche e cappellini neri | Capitolo 3 |

**La filiera, capitolo per capitolo.** È il cuore della visione: ogni capitolo aggiunge un anello che moltiplica il valore di una foglia, un lavoratore che toglie un tragitto al giocatore e un collo di bottiglia che spinge al prossimo acquisto. I numeri vengono dalle sezioni 4–6; i guadagni sono il massimo teorico della catena, prima delle perdite per tragitti e sonni.

| | Capitolo 1 · Il debito | Capitolo 2 · Il cristallo | Capitolo 3 · La piazza |
|---|---|---|---|
| Minuti obiettivo | 0 → 11,5 | 12 → 25 | 25 → 140 |
| Obiettivo di Tito | Ripagare El Gordo con la Lumina della Hacienda | Fare un prodotto che vale di più | Vendere da sé, senza El Gordo, e diventare il Patrón |
| Catena | Campo → Torchio → camion | Campo → Torchio → Laboratorio → camion | Campo → Torchio → Laboratorio → Banco → Plaza |
| Valore di una foglia | \$1,67 (Panetto a \$5) | \$4 (Cristallo a \$24, ×2,4) | \$10 (4 Dosi a \$15, ×2,5) |
| Produzione a fine capitolo | 3 Campi = 60 foglie/min; 2 Torchi fino a 30 Panetti/min | 4 Campi = 80 foglie/min; 1 Laboratorio = 10 Cristalli/min | 6 Campi = 120 foglie/min; 2 Torchi = 30 Panetti/min; 2 Laboratori fino a 20 Cristalli/min |
| Guadagno massimo | da \$30/min (1 Campo, a mano) a \$100/min (3 Campi) | circa \$240/min | da \$360/min (Fama 50) a \$720/min (Fama 100); fino a \$1.080 con Purezza al massimo |
| Collo di bottiglia voluto | Prima le braccia di Tito (4 posti), poi il Torchio (15 Panetti/min), infine il cassone del camion: con 20 Panetti/min ne smaltisce 12 | Il camion: 10 Cristalli/min ne smaltisce 7,5; si allarga con Cassone | La fila della Plaza: a Fama 50 si vendono 24 Dosi/min contro 40 prodotte; si alza con Passaparola e servendo in fretta |
| Chi lavora al posto di Tito | 2 Raccoglitori; il Cargador di El Gordo vende al camion (−10%) | Corriere Torchio → Laboratorio | Corriere fino alla Plaza, Spacciatore, Guardia, 3 Capi squadra |
| Cosa resta a Tito | Portare Panetti al camion, raccogliere le mazzette, svegliare chi dorme | Vendere i Cristalli, coprire i buchi della catena | Raccogliere le mazzette in Plaza, scegliere potenziamenti, Purezza e Quota, mandare via i rivali |
| Il mondo cambia | La Hacienda si riempie; si apre il lotto 2 | Si apre la radura oltre la strada, fumo azzurro dal Laboratorio | Si apre il paese con la Plaza e la fila; arrivano polizia e rivali |
| Chiusura | Ultimo Torchio pagato: il debito è saldato | Laboratorio 1 in funzione | Sblocco "Il Patrón": completo bianco |

**Un conto che non torna ancora (da risolvere prima di costruire il capitolo 3).** Gli sblocchi del capitolo 3 costano in tutto \$130.700 in 115 minuti, cioè \$1.137 al minuto in media. La catena ne rende al massimo \$720 (\$1.080 con Purezza al massimo), e molto meno nei primi 20 minuti del capitolo. Con questi prezzi il Patrón arriverebbe verso il minuto 200 invece del 140. I capitoli 1 e 2 invece tornano: il capitolo 1 chiede \$790 e ne rende circa \$750 più i premi del Rispetto, come conferma il giocatore automatico. Per la regola della sezione 5 si abbasseranno i costi degli sblocchi 13–20, non i prezzi di vendita; la cifra esatta si fissa con il giocatore automatico quando il capitolo 3 esiste (tappa M5).

**Come il giocatore capisce chi è e dove va, senza leggere.**

| Segno nel mondo | Cosa dice |
|---|---|
| Schermata di caricamento: logo PATRÓN sopra la valle con l'impero già completo (sezione 8) | Dove si arriva |
| L'arco con l'insegna PATRÓN sopra un lotto vuoto | Chi vuole diventare Tito: questo posto è suo e crescerà |
| Il camion giallo di El Gordo che arriva con il primo Torchio, e lui al finestrino con un fumetto 👍 alla prima vendita | Chi compra la merce |
| Lotti che si aprono, stazioni che compaiono con la festa | La Hacienda cresce |
| Lavoratori che fanno i tragitti che faceva Tito | Tito sta diventando il capo |
| Il completo bianco all'ultimo sblocco | Ce l'ha fatta |

**Prova di percezione.** Ogni tappa che tocca mondo, grafica o prima sessione si chiude con sei domande per chi guarda gli screenshot, e per Luca quando gioca. Se una risposta è sbagliata, la tappa non è finita.

1. Chi sono? (Un contadino che vuole diventare il capo.)
2. Dove sono? (Nella mia fattoria, in una valle sudamericana.)
3. Chi mi paga? (L'uomo del camion.)
4. Cosa devo fare adesso? (Quello che indica il tappetino o la freccia.)
5. Cosa fa questa macchina? (Per ogni stazione: cosa entra e cosa esce.)
6. Cosa sto portando? (La pila si vede sempre.)

## 2. Stack tecnico e distribuzione

**Decisione: gioco 3D per browser, solo da computer, in TypeScript con Three.js, pubblicato gratis su GitHub Pages.** Si gioca aprendo un link: niente da installare, niente App Store.

**Perché solo computer.** È l'opzione che dà il risultato migliore con gli strumenti che hai.

- Tutto lo sforzo va su grafica, gameplay e bilanciamento, invece che sull'adattarsi a due tipi di schermo e di comandi.

- La tastiera è più precisa di un joystick touch, e lo schermo largo mostra più catena di produzione insieme: la gestione si legge meglio.

- Un computer ha molta più potenza grafica di un telefono: ombre vere, effetti di luce, più dettagli.

- Il tuo iMac sviluppa e fa girare il gioco: lo provi esattamente come lo proveranno gli amici.

**Perché non un'app.** L'iMac di fine 2015 arriva al massimo a macOS 12 Monterey ([OWC](https://eshop.macsales.com/item/Apple/K1F7CXX21XXA/)). Su Monterey l'ultimo Xcode installabile è il 14.2, mentre Xcode 15 richiede Ventura 13.5 ([Apple](https://developer.apple.com/support/xcode)). Per compilare un'app iPhone Unity 6 vuole Xcode 15 o superiore ([Unity](https://docs.unity.com/en-us/engine/6000.0/manual/get-started/install-and-upgrade/getting-started-installing-unity/system-requirements)). Il browser aggira il problema.

**Stack.**

| Componente      | Scelta                                            | Perché                                                            |
|-----------------|---------------------------------------------------|-------------------------------------------------------------------|
| Linguaggio      | TypeScript                                        | Tipi = meno bug nel bilanciamento                                 |
| Rendering 3D    | Three.js                                          | Standard per il 3D nel browser                                    |
| Effetti di luce | Bloom di Three.js (UnrealBloomPass)               | Fa brillare la Lumina e le lampade; si disattiva in qualità Media |
| Build           | Vite                                              | Avvio rapido, ricarica istantanea a ogni modifica                 |
| Interfaccia     | HTML/CSS sopra il canvas                          | Testi nitidi, più semplice di una UI in 3D                        |
| Audio           | Web Audio API + ZzFX (effetti generati da codice) | Nessun file audio da procurarsi                                   |
| Test            | Vitest                                            | Verifica automatica delle formule economiche                      |
| Pubblicazione   | GitHub Pages con GitHub Actions                   | Gratis, link fisso da mandare agli amici                          |

**Browser e requisiti.**

- Browser consigliato: Chrome. Funzionano anche Edge, Firefox e Safari recenti, purché supportino WebGL 2.

- Safari cancella i dati dei siti non aperti per 7 giorni di uso del browser: chi gioca su Safari rischia di perdere il salvataggio. La schermata iniziale lo segnala e consiglia Chrome.

- Finestra minima 1280 × 600 (così entrano anche i portatili 1366 × 768, dove lo spazio utile nel browser è circa 1366 × 650). Sotto questa misura compare un invito ad allargare la finestra.

- Chi apre il link da telefono vede il logo e il messaggio "PATRÓN si gioca da computer", con un pulsante per copiare il link.

**Cosa ti serve sul Mac.** Node.js versione LTS, Git, un account GitHub e Claude Code. Durante lo sviluppo il gioco gira in localhost (server di Vite) e lo apri in Chrome sul Mac. Quando una tappa funziona, la pubblicazione su GitHub Pages lo rende raggiungibile dagli amici, senza che il Mac resti acceso.

**Se un giorno lo porti sul telefono.** La stessa base si adatta aggiungendo comandi touch e un'interfaccia verticale, poi si impacchetta in un'app con Capacitor. Serve però un Xcode recente: un Mac più nuovo o una build in cloud. Nessun lavoro di oggi va perso.

## 3. Core loop e controlli

L'azione principale del gioco è muoversi: ogni azione parte da sola quando il personaggio entra in una zona. Il loop è: **raccogli → trasforma → vendi → incassa → sblocca o assumi → ripeti su scala più grande**.

**Comandi.**

| Tasto                     | Azione                                                                                                                                            |
|---------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| W A S D o frecce          | Movimento in 8 direzioni (in diagonale la velocità resta la stessa)                                                                               |
| Clic sinistro sul terreno | Il personaggio cammina fino a quel punto lungo il percorso più breve; un cerchio segna la destinazione. Se il punto non è raggiungibile (dentro una stazione, oltre un muro di vegetazione o fuori dalla valle), va al punto raggiungibile più vicino. Un tasto di movimento annulla il percorso. I clic sull'interfaccia (pannelli, pulsanti, pannello debug) non muovono il personaggio |
| Rotella del mouse         | Zoom della camera su 3 livelli: vicino, medio, lontano                                                                                            |
| (nessun tasto Ufficio)    | L'Ufficio si apre solo andandoci a piedi, come in tutti i giochi del genere                                                                     |
| Esc                       | Menu e impostazioni (chiude anche i pannelli aperti)                                                                                              |
| Spazio                    | Pausa                                                                                                                                             |
| M                         | Audio sì/no                                                                                                                                       |

- Il personaggio raggiunge la velocità piena in 0,08 s e si ferma in 0,1 s, senza scivolare.

- Ruota verso la direzione di marcia con interpolazione di 0,08 s.

- Se la finestra perde il focus, i tasti premuti si rilasciano da soli, così il personaggio non continua a correre.

**Movimento.** Velocità base 4 m/s. Collisioni semplici con stazioni e bordi della mappa (cerchi e rettangoli, niente motore fisico).

**Interazione per prossimità.** Si prende e si lascia la merce **sulla macchina**, non su quadrati colorati (skill `ux-ui-arcade-idle`, UX2; revisione del 30 ottobre 2026, voto 3/10 sui tappetini). L'unico tappetino "pieno" è quello d'acquisto (UX1). Nessun tappetino ha un colore pieno verde, giallo, rosso o blu: il verde è dei soldi, il giallo della guida, il rosso del MAX.

| Zona | Aspetto | Cosa succede quando ci stai sopra |
|---|---|---|
| Consegna | Contorno bianco sottile attaccato al lato d'ingresso della macchina (tramoggia del Torchio, Falò, cassone del camion), fondo neutro al 25%, icona della merce che entra con una freccia verso la macchina | Lasci la merce che la stazione accetta |
| Ritiro | Contorno bianco sottile attaccato al lato d'uscita (ripiano dei Panetti, cassone degli Scarti), icona del prodotto con una freccia verso fuori. Il Campo non ha contorno: si raccoglie camminando tra le piante | Prendi la merce pronta |
| Cassa | Nessun tappetino: le mazzette in blocchi 2 × 3 su un vassoio scuro basso accanto al camion | Le mazzette volano al contatore |
| Acquisto | Riquadro arancio con bordo bianco, icona di ciò che si compra e prezzo; grande quanto l'impronta dell'oggetto o almeno 2,3 m di lato (1,2 altezze del personaggio, UX1) | I soldi volano dentro finché il prezzo è pagato |
| Ufficio | Contorno bianco davanti all'ingresso, con la scritta UFFICIO a terra e una freccia in su; nessun fondo pieno | Si apre il pannello potenziamenti |

- **Area d'attivazione = disegno.** Ogni zona è il rettangolo del suo contorno, allargato di 0,3 m solo verso l'esterno della macchina; il riquadro d'acquisto è il suo quadrato; un Campo è il suo appezzamento più 0,2 m, perché si raccoglie camminando tra le piante (My Mini Mart, Farm Land); il vassoio delle mazzette è il vassoio. Due aree distano sempre almeno 0,6 m (UX7).

- Contorni larghi quanto il lato della macchina che servono, profondi 0,9 m, spessi 4 cm.

- Trasferimento: 1 oggetto ogni 0,08 s finché resti sulla zona e c'è spazio, anche camminando.

- Acquisto: appena ci sali sopra aspetti 0,25 s, così non si paga per sbaglio passando (controllo UX 8); poi il pagamento avviene a scatti in 2 s totali, qualunque sia il prezzo (Pizza Ready ≈ 2 s, UX1). Se esci a metà, il versato resta e il resto lo paghi dopo. Durante il pagamento un anello giallo si riempie intorno al riquadro e il prezzo scende fino a zero: il riquadro resta arancio e non diventa verde come in Pizza Ready, perché il verde a terra è dei soldi (scelta di Luca, 30 ottobre 2026).

- Una zona di Consegna accetta solo il tipo di oggetto della sua stazione: la merce sbagliata resta addosso.

**La pila (stack).** Porti la merce in una pila visibile davanti a te, tra le braccia, che sale come una torre: è il modo di Pizza Ready, Burger Please e My Mini Mart. La merce in mano è **più larga del corpo**, circa 1,4 volte la larghezza delle spalle del personaggio (Pizza Ready, UX4), e la base della pila sta all'altezza delle mani, 0,6 m davanti al centro del corpo. Così si vede da ogni direzione, anche di spalle: con 3 pezzi o più la cima supera la testa. Ripiani, cassoni e camion usano la misura normale delle merci; solo la pila in mano è ingrandita.

**I soldi non si portano addosso** (UX3, al posto delle mazzette sulla schiena della M2b). Una seconda colonna addosso copre sempre la prima: la merce davanti o i soldi dietro. Come in Pizza Ready, Monkey Mart e My Mini Mart le mazzette restano nel mondo, in blocchi 2 × 3 che crescono in altezza accanto a chi paga; camminandoci sopra volano una a una nella pillola del contante in alto a destra, che si gonfia. Pagando un acquisto le banconote escono da sopra la testa del personaggio e volano nel riquadro (PS16). Il contatore in alto resta il numero esatto.

- Capacità iniziale: 4 oggetti. Potenziabile (sezione 5).

- Puoi trasportare tipi diversi insieme. La pila si scarica dall'alto, ma ogni Consegna preleva solo il tipo giusto, ovunque sia nella pila.

- Pila piena: un'etichetta "MAX" lampeggia sopra la testa.

- Le merci sono più grandi del vero. In mano sono larghe circa 1,4 volte le spalle e alte almeno 0,35 m ciascuna, così con 3 pezzi la cima (0,9 + 3 × 0,35 = 1,95 m) supera la testa del personaggio (1,9 m); sui ripiani e nel camion restano alla misura normale.

**Camera.** Prospettica con campo visivo stretto (22°), così le linee restano quasi parallele come in una vista isometrica; inclinata di 45° sull'orizzonte e **ruotata di 45°**: guarda da sud-ovest verso nord-est, e il mondo appare in diagonale, a rombo, come in Pizza Ready e My Mini Mart. La rotazione è fissa: la camera segue il giocatore con smorzamento ma non gira mai. L'interpolazione equivale a 0,1 per fotogramma a 60 fps, ma è calcolata sul tempo trascorso, così la camera si muove allo stesso modo con qualunque frequenza dello schermo. Lo zoom si fissa sull'**altezza di mondo inquadrata** (misurata sul piano perpendicolare allo sguardo), non sulla larghezza: così il lotto entra intero anche nella finestra minima 1280 × 600, che è più larga del 16:9. Allo zoom medio l'altezza è 25 m (circa 44 m di larghezza a 16:9); vicino 19 m, lontano 31 m. Con l'inclinazione di 45° (quella misurata su Pizza Ready, UX6) il personaggio da 1,9 m occupa circa 1/13 dell'altezza dello schermo, misurato sugli screenshot del 30 ottobre 2026: è dentro la fascia desktop di UX6 (1/12–1/16); Pizza Ready lo tiene a circa 1/17 su telefono. Il rapporto si misura sugli screenshot: altezza in pixel dai piedi alla cima del cappello, divisa per l'altezza della finestra. Con la camera della M2b la misura dava 1/9, ed era una delle cause del "soffocamento" (revisione del 30 ottobre 2026). Il lotto 1 in diagonale occupa circa 21 m di altezza sullo schermo, più l'arco alto 4 m: all'avvio entra intero con l'arco PATRÓN e un bordo di prato di circa 1,5 m. **La camera segue il giocatore con una zona morta** di 14 m in larghezza e 10 m in profondità al centro dello schermo: si muove solo quando il giocatore esce da quel riquadro, con lo smorzamento di sempre. All'avvio è centrata in (26,8, 19,4), il punto che fa entrare tutto il lotto con l'arco senza che l'angolo nord finisca sotto l'interfaccia in alto. La camera non si allontana quando il mondo cresce: si cambia zoom solo con la rotella. Pizza Ready inclina la camera di circa 44°: PATRÓN usa 45°, perché la vista "dall'alto" che si cerca viene dalla distanza, non dall'angolo. Allo sblocco la camera fa un primo piano a 12 m di altezza inquadrata sull'oggetto nuovo per 3 s (la festa; Pizza Ready ≈ 5 s, UX8), poi torna al giocatore. I tasti di movimento seguono lo schermo, non la mappa: W porta il personaggio verso l'alto dello schermo, cioè verso nord-est della mappa. Lo zoom lontano serve a controllare l'intera catena quando è automatizzata. La camera non mostra mai il vuoto: oltre i bordi della valle c'è una cornice di giungla non calpestabile e poi un verde uniforme.

**Schermo.** Orizzontale, adattato a qualunque finestra da 1280 × 600 in su (16:9 è il formato di riferimento); ridimensionare la finestra non deforma la scena.

## 4. Mondo e stazioni della Beta

**Si parte da un lotto vuoto e arioso, che si allarga** (skill `arcade-idle`, regole PS6–PS9; skill `ux-ui-arcade-idle`, UX6 e UX7, che per le misure sostituiscono PS6 e PS18: il lotto non è più "piccolo" e la camera non è più "vicinissima"). La valle misura 70 × 80 m, ma all'inizio se ne usa solo il primo lotto, di 18 × 24 m: circa 9,5 × 12,5 altezze del personaggio, come la sala iniziale di Pizza Ready (≈ 9 × 13). Il lotto di 12 × 10 m della M2b era un terzo di quella misura e dava la sensazione di soffocare (revisione del 30 ottobre 2026, voto 3/10 sullo spazio). Nel primo minuto il pavimento è libero per almeno il 70%: le stazioni sono poche e separate, e il giocatore deve camminare per andare a comprarle. Tra una fermata del primo ciclo e la successiva ci sono 2–8 m da bordo a bordo, mai di più (circa 2 s di corsa); la pianta qui sotto dà le misure. Ogni lotto è un rettangolo di terra battuta chiara chiuso da una staccionata bassa; oltre la staccionata ci sono prato e giungla, che si vedono ma dove non si entra. Un tappetino "Nuova zona" sul bordo di un lotto apre quello accanto: la staccionata in comune si abbassa e sparisce, il pavimento nuovo si srotola, compaiono le sagome delle nuove stazioni.

**I lotti** (nord in alto; coordinate in metri, origine nell'angolo sud-ovest della valle).

| Lotto | Rettangolo | Contenuto | Si apre |
|---|---|---|---|
| 1 · La Hacienda | da (20, 10) a (38, 34) | Arco PATRÓN sul lato nord, Campo 1 e Campo 2, Torchio 1, Falò, Ufficio, regalo di El Gordo | Inizio |
| 2 · I campi | da (38, 10) a (50, 34) | Campo 3, Campo 4, Torchio 2, casetta dei Raccoglitori, posto del Cargador | Sblocco "Nuova zona" (Fase 1) |
| 3 · La radura | da (6, 42) a (28, 62) | Laboratorio 1 e 2, nella giungla oltre la strada | Fase 2 |
| 4 · Il paese | da (34, 42) a (62, 68) | Banco di confezionamento, Plaza con bancone e fila | Fase 3 |

**La pianta del lotto 1** (centri e misure in metri). Il primo ciclo è un anello: Campo → tramoggia del Torchio → ripiano dei Panetti → carico del camion → vassoio delle mazzette → di nuovo al Campo. La tramoggia guarda il Campo (sud) e il ripiano guarda il camion (ovest): sono i due lati che la camera da sud-ovest vede sempre. Ingresso e uscita della stessa macchina, e il carico del camion con il suo vassoio, contano come una fermata sola; tra fermate diverse ci sono 2–8 m da bordo a bordo, misurati lungo il cammino vero, e due aree d'attivazione distano sempre almeno 0,6 m.

| Elemento | Centro | Impronta | Note |
|---|---|---|---|
| Partenza del giocatore | (27, 17,5) | — | Il regalo a 2,4 m verso est, a destra del personaggio sullo schermo: non resta coperto dal suo corpo |
| Regalo di El Gordo | (29,4, 16,4) | 1,2 × 1,2, alto 1,9 | Torre di mazzette 2 × 3 per 10 strati (UX11): vale \$40 in tutto, il numero di mazzette è solo visivo; a 4,5 m dal Campo 1 |
| Campo 1 | (30, 23,5) | 4 × 4 | Si raccoglie camminando tra le piante: l'area è l'appezzamento più 0,2 m |
| Campo 2 | (23,5, 23,5) | 4 × 4 | Come il Campo 1; 5,1 m dalla tramoggia |
| Torchio 1 | (31, 30,1) | 3 × 3, alto 2,2 | Tramoggia a sud da (30,1, 27,7) a (32,5, 28,6), a 2,2 m dal Campo 1; ripiano dei Panetti a ovest da (28,6, 28,6) a (29,5, 31); cassone degli Scarti a est da (32,5, 29,2) a (33,4, 31,6) |
| Falò | (37, 26,5) | 1,6 × 1,6 | Consegna sul lato ovest, da (35,3, 25,7) a (36,2, 27,3): 2,7 m dal cassone degli Scarti |
| Carico del camion | contorno da (25,5, 33,1) a (29,5, 34) | 4 × 0,9 | Dietro la staccionata; 2,1 m dal ripiano dei Panetti |
| Vassoio delle mazzette | (24,3, 32,8) | 1,2 × 0,8 | Vassoio scuro basso, a ovest del carico (0,6 m): da qui si torna ai Campi in linea retta, senza girare attorno al Torchio; 7,6 m dal Campo 1 e 6,9 m dal Campo 2 |
| Ufficio | casetta in (34,5, 15) | 3 × 2,5 | Ingresso a ovest: contorno bianco da 2 × 2 in (32, 15), attaccato alla porta con la scritta UFFICIO a terra e una freccia in su, senza fondo pieno (come la stanza UPGRADE di Pizza Ready) |
| Primo Raccoglitore | riquadro in (27, 14) | 2,3 × 2,3 | A sud dei Campi |
| Nuova zona | riquadro in (36,8, 20) | 2,3 × 2,3 | Sul bordo est |
| Arco PATRÓN | (22,5, 34) | 3,4 × 0,5, alto 4 | Sul lato nord, verso l'angolo nord-ovest: con la camera da sud-ovest quell'angolo sta a metà altezza dello schermo, e l'arco resta sempre in vista, mai sotto l'interfaccia in alto (primo screenshot del 30 ottobre 2026) |

**La strada di El Gordo** corre da ovest a est appena fuori dall'arco, a y = 34,7–37,3: il camion si ferma col fianco a meno di un metro dalla staccionata, così il contorno di carico tocca quasi il suo cassone. Il camion arriva lungo la strada da ovest e si ferma a est dell'arco (x ≈ 27,5, y ≈ 36), così non copre l'insegna; il carico si fa dal contorno dietro la staccionata, e le mazzette compaiono sul vassoio accanto. A cassone pieno riparte verso est e torna da ovest. Le auto della polizia usano la stessa strada.

**Sagome.** Ogni stazione non ancora comprata si vede come la sua impronta grigia a terra, con le parentesi bianche agli angoli e un fumetto con la mazzetta e il prezzo; quella del prossimo sblocco ha sopra la freccia gialla. All'inizio si vede una sagoma sola (PS10, PS11).

**La festa dello sblocco.** Quando un tappetino è pagato la camera si avvicina all'oggetto per 3 s (UX8), l'oggetto sale dal terreno con un rimbalzo, scoppiano stelle gialle e coriandoli, poi la camera torna sul giocatore (PS13).

**Merci.** Quattro oggetti, ognuno con una forma e un colore riconoscibili a colpo d'occhio:

| Oggetto   | Aspetto                              | Valore di riferimento |
|-----------|--------------------------------------|-----------------------|
| Foglia    | Mazzo di foglie verde brillante      | Non vendibile         |
| Panetto     | Mattonella beige avvolta in tela     | \$5 da El Gordo       |
| Cristallo | Blocco azzurro luminescente          | \$24 da El Gordo      |
| Dose      | Bustina piccola con riflesso azzurro | \$15 in Plaza         |
| Scarti    | Sacco di juta grigio-marrone         | Non vendibile: si brucia nel Falò |

**Stazioni.**

| Stazione                 | Input             | Output      | Ciclo       | Buffer in / out | Note                                                             |
|--------------------------|-------------------|-------------|-------------|-----------------|------------------------------------------------------------------|
| Campo                    | —                 | 1 Foglia    | 3 s         | — / 8           | Le piantine crescono a vista; si vedono le foglie pronte         |
| Torchio                   | 3 Foglie          | 1 Panetto     | 4 s         | 12 / 10         | Pistone a vite che scende. Ogni 2 Panetti esce 1 sacco di Scarti nel cassone accanto (contatore "0/6"): a cassone pieno il Torchio si ferma |
| Laboratorio              | 2 Panetti           | 1 Cristallo | 6 s         | 10 / 8          | Fumo dal camino mentre lavora; genera Calore                     |
| Banco di confezionamento | 1 Cristallo       | 4 Dosi      | 3 s         | 6 / 24          |                                                                  |
| Camion di El Gordo       | Panetto o Cristallo | Soldi       | Istantaneo  | Cassone 10 ("n/max") | Paga poco, ma non genera Calore. A cassone pieno parte e torna dopo 20 s |
| Falò                     | Scarti            | —           | Istantaneo  | Illimitato      | Non produce niente: brucia i sacchi con una fiammata. È il "lavoretto" del tema. Accetta anche le Foglie che non hanno dove andare (tutte i Torchi pieni), come il cestino di My Mini Mart |
| Bancone della Plaza      | Dosi              | Soldi       | Per cliente | 30 dosi         | Vende solo se c'è un venditore sulla zona (tu o uno spacciatore) |

![filiera della Beta · 5 stazioni e il camion di El Gordo](media/image1.png)

*filiera della Beta · 5 stazioni e il camion di El Gordo*

Vendere a El Gordo è sicuro ma rende poco; portare la merce fino alla Plaza rende sei volte tanto per foglia, e attira la polizia.

**Il Torchio.** È un torchio a vite, la macchina più antica per spremere: il nome dice cosa fa. Le Foglie entrano da sud, in una tramoggia rivolta al Campo, e restano visibili in mucchio; la vite scende sulla vasca; i Panetti escono a ovest su un ripiano scuro, dove si impilano fino a 10; il cassone degli Scarti sta a est. Sono i due lati che la camera vede sempre. Sopra, un cartello con «🌿 → panetto» si legge da ogni punto dello schermo. A ogni Panetto la vite fa un colpo e il Panetto nuovo salta sul ripiano.

**Il camion di El Gordo.** Ha un cassone con capienza scritta sopra ("7/10"). Ogni Panetto o Cristallo caricato, dal giocatore o dal Cargador, si paga subito come prima. Quando il cassone è pieno il camion suona il clacson, parte lungo la strada e torna dopo 20 s; sul posto resta un cerchio con il conto alla rovescia, e nel frattempo non si vende. All'inizio il cassone non si riempie quasi mai: diventa un limite quando la produzione cresce, e si allarga con il potenziamento Cassone (sezione 5).

**Gli scarti.** Ogni Torchio riempie un cassone di sacchi di Scarti (uno ogni 2 Panetti, massimo 6). Gli Scarti si prendono dal cassone come una merce qualunque, viaggiano nella stessa pila e si lasciano nel Falò, che li brucia. Non rendono niente: sono il compito che il tema porta con sé, come la spazzatura in pizzeria. Più avanti se ne occupano i Raccoglitori (sezione 6).

Regole comuni:

- Una stazione lavora da sola finché ha input e spazio nel buffer di uscita. Se l'uscita è piena si ferma e mostra un'icona di stop.

- Ogni stazione mostra sopra di sé un anello di avanzamento del ciclo e il numero di pezzi in uscita.

- I soldi si accumulano come mazzette fisiche accanto alla cassa della stazione che vende. Il conteggio è esatto, ma oltre 40 mazzette la pila visiva smette di crescere.

**Clienti della Plaza.**

- Arrivano uno ogni 5 s all'inizio, fila massima 12 persone: una fila lunga è un'informazione, come in Pizza Ready. Oltre i 12 non ne arrivano altri.

- Ognuno compra da 1 a 3 dosi (media 2), paga e se ne va. Nessuno viene mostrato mentre consuma.

- Nessun cliente se ne va senza comprare: nei giochi del genere la fila aspetta sempre. Chi aspetta più di 25 s al bancone mostra una faccina scontenta e fa scendere la Fama di 1 punto (sezione 5).

- Aspetto: sagome semplici con colori di vestiti casuali, così la fila sembra viva.

## 5. Economia e bilanciamento

Ogni foglia vale circa 6 volte di più se la porti fino alla Plaza invece di venderla pressata a El Gordo: è il motore della scalata verticale. Tutti i numeri di questa sezione vivono in un unico file di configurazione (sezione 14), così si ritarano senza toccare la logica.

**Il principio reale.** Nei mercati veri il prezzo per chilo cresce a ogni passaggio della catena di distribuzione, con salti più grandi quando la merce attraversa un confine ([Foreign Policy](https://foreignpolicy.com/articles/2009/10/19/prime_numbers_doped)). Il contadino resta con la fetta più piccola. Il gioco replica questa forma, non le cifre reali.

| Anello controllato | Dove vendi                                | Ricavo per foglia | Moltiplicatore sul passo prima | Calore                  |
|--------------------|-------------------------------------------|-------------------|--------------------------------|-------------------------|
| Torchio             | Panetto a El Gordo (\$5 ogni 3 foglie)      | \$1,67            | —                              | Nessuno                 |
| Laboratorio        | Cristallo a El Gordo (\$24 ogni 6 foglie) | \$4,00            | ×2,4                           | Sì, dal Laboratorio     |
| Spaccio            | Dosi in Plaza (4 × \$15 ogni 6 foglie)    | \$10,00           | ×2,5                           | Sì, Laboratorio e Plaza |

**Unica valuta della Beta: contante.** Il denaro sporco e quello pulito arrivano con la Fase 4 (sezione 16). Nella Beta il contante si guadagna e si spende in sblocchi, potenziamenti e Quota.

**Formule.**

- Potenziamenti del giocatore (Zaino, Scarpe, Guadagno): 5 livelli ciascuno, costo del prossimo livello = costo base × 1,8^n, dove n è il numero di livelli già comprati (il primo Zaino costa \$40, poi 72, 130, 233, 420). All'apertura dell'Ufficio il primo livello di Zaino è un regalo di El Gordo. Guadagno (+10% a livello, fino a +50%) alza i prezzi di tutte le fasi: il giocatore automatico della tappa M5 verifica che non accorci troppo il capitolo 3. Il genere usa pochi livelli ripidi (RC10, RC11): così la decisione D6 è chiusa (30 ottobre 2026).

- Altri potenziamenti: costo al livello n = costo base × 1,15^n. È la crescita esponenziale classica del genere: il costo corre più veloce del beneficio, e il ritmo rallenta in modo controllato ([Game Developer](https://www.gamedeveloper.com/design/the-math-of-idle-games-part-i)).

- Assunzioni: quelle nella sequenza degli sblocchi hanno il prezzo della tabella. Ogni lavoratore extra dello stesso ruolo, comprato dall'Ufficio, costa l'ultimo prezzo pagato × 1,6.

- Velocità di una stazione: ciclo effettivo = ciclo base × 0,9^livello.

- Purezza: prezzo di Cristallo e Dosi × (1 + 0,10 × livello); Calore generato × (1 + 0,08 × livello).

- Fama della Plaza (parte da 50; tetto iniziale 75, portato fino a 100 dai 5 livelli di Passaparola; mai oltre 100): intervallo tra clienti = 5 s × (1,5 − Fama/100). Quindi 7,5 s a Fama 0, 5 s a 50, 2,5 s a 100.

  - +1 Fama per ogni cliente servito entro 10 s dall'arrivo al bancone.

  - −1 Fama per ogni cliente che aspetta più di 25 s al bancone.

**Potenziamenti (pannello Ufficio).**

| Potenziamento | Effetto per livello                              | Costo base | Livelli | Disponibile da           |
|---------------|--------------------------------------------------|------------|---------|--------------------------|
| Zaino         | +2 capacità della pila (da 4 a 14)               | \$40       | 5       | Ufficio (Fase 1)         |
| Scarpe        | +10% velocità del giocatore                      | \$60       | 5       | Ufficio (Fase 1)         |
| Guadagno      | +10% prezzo di vendita di tutta la merce          | \$80       | 5       | Ufficio (Fase 1)         |
| Fertilizzante | −10% ciclo di tutti i Campi                      | \$50       | 5       | Fase 1                   |
| Ingranaggi    | −10% ciclo dei Torchi                          | \$150      | 5       | Fase 1                   |
| Attrezzatura  | −10% ciclo dei Laboratori                        | \$600      | 5       | Fase 2                   |
| Purezza       | +10% prezzo, +8% Calore                          | \$1.000    | 5       | Fase 2                   |
| Bilance       | −10% ciclo del Banco di confezionamento          | \$1.500    | 5       | Fase 3                   |
| Passaparola   | +5 Fama immediata e +5 al tetto massimo di Fama  | \$1.200    | 5       | Fase 3                   |
| Formazione    | +8% velocità, +1 capacità e +20 s tra un sonno e l'altro per tutti i lavoratori | \$800      | 5       | Primo lavoratore assunto |
| Cassone       | +5 capienza del camion di El Gordo (da 10 a 40)  | \$80       | 6       | Fase 1                   |

**Sequenza degli sblocchi.** Ogni sblocco è un tappetino nel mondo. Il prossimo è sempre evidenziato e indicato da una freccia (sezione 9). I minuti sono il **ritmo obiettivo** per un giocatore medio: servono per i test, non sono un vincolo nel codice.

| \#  | Sblocco                                  | Fase | Costo    | Minuto obiettivo |
|-----|------------------------------------------|------|----------|------------------|
| 1   | Campo 1                                  | 1    | \$5      | 0,1              |
| 2   | Torchio 1                                 | 1    | \$15     | 0,3              |
| —   | Arriva il camion di El Gordo (gratis)    | 1    | —        | 0,4              |
| 3   | Campo 2                                  | 1    | \$20     | 0,5              |
| 4   | Falò                                     | 1    | \$10     | 1,3              |
| 4b  | Ufficio (Zaino, Scarpe, Guadagno)        | 1    | \$40     | 1,5              |
| 5   | Primo raccoglitore                       | 1    | \$30     | 2,5              |
| 6   | Nuova zona: lotto 2                      | 1    | \$120    | 3,5              |
| 7   | Campo 3                                  | 1    | \$80     | 6,5              |
| 8   | Secondo raccoglitore                     | 1    | \$120    | 8                |
| 9   | Torchio 2                                 | 1    | \$200    | 10               |
| 9b  | Cargador di El Gordo (ritiro automatico) | 1    | \$250    | 11,5             |
| 6   | Laboratorio 1                            | 2    | \$350    | 12               |
| 7   | Corriere Torchio → Laboratorio            | 2    | \$500    | 15               |
| 8   | Campo 4                                  | 2    | \$800    | 19               |
| 9   | Banco di confezionamento + Plaza         | 3    | \$1.200  | 25               |
| 10  | Primo spacciatore                        | 3    | \$1.500  | 29               |
| 11  | La Quota (accordo con la polizia)        | 3    | \$2.000  | 34               |
| 12  | Corriere Laboratorio → Banco → Plaza     | 3    | \$3.000  | 40               |
| 13  | Laboratorio 2                            | 3    | \$4.500  | 48               |
| 14  | Campo 5                                  | 3    | \$6.000  | 56               |
| 15  | Campo 6                                  | 3    | \$7.500  | 64               |
| 16  | Guardia della Plaza                      | 3    | \$9.000  | 72               |
| 17  | Capo squadra dei Campi                   | 3    | \$13.000 | 85               |
| 18  | Capo squadra del Laboratorio             | 3    | \$18.000 | 100              |
| 19  | Capo squadra della Plaza                 | 3    | \$25.000 | 118              |
| 20  | Il Patrón (fine Beta)                    | 3    | \$40.000 | 140              |

L'ultimo sblocco cambia l'abito del personaggio in completo bianco e apre una scena che mostra, chiusa da un lucchetto, la prima attività di copertura: "Prossimamente: il denaro sporco". È il gancio verso la versione successiva.

**Il regalo di El Gordo.** La partita non parte da zero: dentro la Hacienda, a due passi dal giocatore, c'è un cubo di mazzette alto quanto il personaggio, da \$40 ("El Gordo ti anticipa \$40", sezione 1). Si vede da lontano e paga il primo giro intero: Campo 1, Torchio 1 e Campo 2, tre acquisti nei primi 30 secondi, come la sala di Pizza Ready pagata dai suoi \$180 (UX10, UX11). Lo sblocco successivo, il Falò, va guadagnato vendendo: è lo schema del genere, primi acquisti regalati e il successivo che costa quanto hai ([skill arcade-idle](../.claude/skills/arcade-idle/04-sintesi/regole-contenuto.md), RC4).

**Verifica del flusso nei primi minuti.** Nel primo minuto il gioco costruisce il ciclo un pezzo alla volta, come Pizza Ready (PS12): Campo, Torchio, arrivo del camion, prima vendita. Con i tratti della pianta (2–7 m, meno di 2 s di corsa a 4 m/s) il trasporto non è più il limite: lo è la produzione. Un Campo dà 0,33 foglie/s, cioè 1 Panetto ogni 9 s (\$33 al minuto); con due Campi il Torchio ne fa 1 ogni 4,5 s (\$66 al minuto), vicino al suo massimo di 1 ogni 4 s. Il regalo di \$40 paga i primi tre acquisti entro 0:30. Il Falò (\$10, 2 Panetti) arriva verso 1:20 ed è il 4° sblocco: le 16 stelle portano al Rispetto 2, che fa piovere \$40 di mazzette. Con quelle si compra subito l'Ufficio, che apre regalando il primo livello di Zaino (pila da 4 a 6). Il Raccoglitore a \$30 chiede 6 Panetti, cioè meno di 30 s di produzione con due Campi: arriva verso 2:30. Il Raccoglitore è il 6° sblocco: le stelle arrivano a 24 e il Rispetto 3 fa piovere \$60. La Nuova zona costa \$120 apposta, così non si compra con la sola pioggia e arriva verso 3:30, un minuto dopo: due momenti grandi non finiscono attaccati (UX10). Lo Zaino regalato all'apertura dell'Ufficio non dà stelle: le danno solo i livelli comprati.

**Il Rispetto.** È il livello del giocatore, come il livello del locale nei giochi del genere (10 su 11 ne hanno uno). Si guadagnano stelle: **+4 per ogni sblocco** della tabella e **+1 per ogni livello di potenziamento** comprato. Le soglie sono cumulative e si allungano:

| Livello | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 |
|---|---|---|---|---|---|---|---|---|---|
| Stelle totali | 15 | 24 | 39 | 60 | 81 | 114 | 141 | 165 | 200 |

- A ogni livello piove intorno al giocatore un premio di \$20 × il nuovo livello, in mazzette da raccogliere.
- Due sblocchi chiedono anche un livello minimo: **Laboratorio 1 vuole Rispetto 4, Banco + Plaza vuole Rispetto 5**. I numeri sono scelti perché il livello arrivi prima dei soldi: gli 11 sblocchi a pagamento fino al Cargador, Ufficio compreso, danno 44 stelle (Rispetto 4); i 14 fino al Campo 4 ne danno 56, e bastano 8 livelli di potenziamento per arrivare a 60. Se manca il livello, il tappetino mostra un lucchetto con "Rispetto 5" e la frase dell'obiettivo dice cosa fare ("Compra un potenziamento!").

**Regola di ritmo da testare.** Nella prima ora il prossimo sblocco non deve mai distare più di 3–4 minuti di gioco attivo. Se un test supera questa soglia, si abbassa il costo, non si alza il guadagno, per non sballare le fasi successive.

## 6. Personale e automazione

Ogni lavoratore ripete un tratto della catena che prima facevi tu, e alla fine della Beta il giocatore non trasporta più niente: gestisce. La struttura ricalca quella reale a cellule, dove chi coltiva, chi raffina e chi vende non si toccano, e i capi tengono insieme un'area ciascuno.

**Ruoli.**

| Ruolo                | Cosa fa                                                                                                                                                                                                                                                                  | Capacità | Velocità | Sonno                             | Aspetto                           |
|----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|----------|-----------------------------------|-----------------------------------|
| Raccoglitore         | Campo con più foglie pronte → Torchio con spazio. Se il cassone degli Scarti di un Torchio è pieno per metà o più, porta prima gli Scarti al Falò | 3        | 2,8 m/s  | ogni 90–150 s                     | Cappello di paglia                |
| Corriere A           | Torchio → Laboratorio                                                                                                                                                                                                                                                     | 4        | 3,2 m/s  | ogni 90–150 s                     | Cappellino e zaino                |
| Corriere B           | Laboratorio → Banco; poi Banco → bancone della Plaza                                                                                                                                                                                                                     | 6        | 3,2 m/s  | ogni 90–150 s                     | Cappellino rosso                  |
| Spacciatore          | Resta sulla zona di vendita e serve 1 cliente ogni 1,5 s                                                                                                                                                                                                                 | —        | —        | ogni 90–150 s                     | Occhiali da sole, camicia a fiori |
| Guardia              | Pattuglia la Plaza; allontana i rivali; −20% Calore dalle vendite                                                                                                                                                                                                        | —        | 3 m/s    | mai                               | Canottiera, più massiccio         |
| Capo squadra         | Uno per area; +25% velocità ai lavoratori dell'area, che con lui non si addormentano più                                                                                                                                                                                                               | —        | —        | mai                               | Cappello a tesa larga, sigaro     |
| Cargador di El Gordo | Uomo di El Gordo, non tuo: ritira e vende al camion pagando il 10% in meno. Priorità: Cristalli dal Laboratorio solo se il Banco non esiste o ha l'ingresso pieno; Panetti dal Torchio solo se non c'è Laboratorio o ha l'ingresso pieno. Così non ruba merce alla catena | 6        | 3 m/s    | mai (non è tuo)                   | Grembiule e berretto di lana      |

**Regole del Cargador.**

- Le sue vendite non contano per gli ordini speciali di El Gordo (sezione 7): valgono solo le consegne fatte dal giocatore.
- I suoi incassi vanno direttamente nel contante, senza mazzette da raccogliere al camion; a ogni vendita un testo verde "+$" con l'importo sale dal camion.
- Ce n'è uno solo: non si compra dall'Ufficio come lavoratore extra e Formazione non lo potenzia.

**Solo il giocatore raccoglie le mazzette**, al camion e in Plaza, fino alla fine della Beta: i lavoratori non toccano mai i soldi. Come in Pizza Ready, resta sempre una cosa che solo tu puoi fare (skill arcade-idle, RC9). Fanno eccezione gli incassi del Cargador, che vanno direttamente nel contante.

**Niente stipendi: si paga solo l'assunzione.** Come nel genere (in Pizza Ready l'assunzione si paga una volta, in Burger Please la prima è gratis), un lavoratore costa solo il suo tappetino. In cambio **i lavoratori si addormentano**, come in Monkey Mart e Pizza Ready: ogni 90–150 s di lavoro (a caso) uno si ferma con l'icona "zzz" e riparte appena il giocatore gli passa entro 1,5 m. È una pausa, non una punizione, e tiene il giocatore in giro per la mappa. Formazione allunga l'intervallo, il capo squadra lo toglie dalla sua area.

**Comportamento dei lavoratori che trasportano** (macchina a stati):

1.  **Scelta**: sceglie la sorgente con più merce pronta e la destinazione con più spazio.

2.  **Verso la sorgente**: cammina sul percorso.

3.  **Carico**: prende fino alla sua capacità. Se la sorgente è vuota aspetta lì, con un'icona "zzz".

4.  **Verso la destinazione**.

5.  **Scarico**: lascia tutto ciò che la destinazione accetta. Se è piena aspetta.

6.  Torna al punto 1.

**Percorsi.** Griglia di celle da 1 m sopra la mappa, con le stazioni come ostacoli e ricerca del percorso A\* (`src/sim/pathfinding.ts`, logica pura usata dal giocatore e dai lavoratori). I lavoratori non si scontrano tra loro, per semplicità e per non creare ingorghi frustranti.

**Il passaggio di ruolo del giocatore.**

| Momento             | Cosa fa il giocatore                                                        |
|---------------------|-----------------------------------------------------------------------------|
| Minuti 0–3          | Tutto a mano: raccoglie, pressa nel Torchio, vende                                      |
| Minuti 3–25         | Porta la merce dove i lavoratori non arrivano ancora, incassa               |
| Minuti 25–85        | Copre i buchi della catena, gestisce Calore, rivali e ordini speciali       |
| Dopo i capi squadra | Non trasporta più: raccoglie le mazzette e decide potenziamenti, Purezza, Quota |

Con i capi squadra il gioco deve restare interessante: per questo Calore, rivali e ordini speciali (sezione 7) aumentano di frequenza proprio quando l'automazione toglie lavoro manuale.

## 7. Calore, Quota ed eventi

Il Calore misura quanta attenzione attiri: sale quando raffini e spacci in proprio, scende col tempo e con la Quota, e oltre certe soglie fa scattare eventi che bloccano la catena. Nella Beta un evento può costare merce e tempo, **mai contante, lavoratori o sblocchi**: pressione sì, fallimento no.

**Come sale e come scende** (scala 0–100).

| Fonte                        | Effetto                                                                                                                                                             |
|------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Ogni Cristallo prodotto      | +0,4 × fattore Purezza                                                                                                                                              |
| Ogni Dose venduta in Plaza   | +0,15 (−20% se c'è una Guardia)                                                                                                                                     |
| Vendite a El Gordo           | 0: il rischio se lo prende lui, per questo paga poco                                                                                                                |
| Calo naturale                | −3 al minuto                                                                                                                                                        |
| La Quota attiva              | Calo naturale × 3, × 4 o × 5 secondo il livello                                                                                                                     |
| Paga il Comandante (Ufficio) | −25 subito; costa il doppio dell'incasso al minuto, calcolato come media delle vendite lorde degli ultimi 120 s (la Quota non si sottrae); minimo \$200 |

Con il solo Laboratorio 1 il Calore sale di circa 4 al minuto e ne scende 3: dal minuto 12 al 25 arriva intorno a 13. Con la Plaza aperta sale di circa 8,5 al minuto: senza Quota tocca 40 intorno al minuto 30. È voluto: il problema arriva qualche minuto prima della soluzione (sblocco 11).

**La Quota.** È un accordo periodico con la polizia locale, come le tangenti fisse nella realtà: un costo ricorrente che compra tranquillità.

| Livello            | Calo naturale | Costo al minuto |
|--------------------|---------------|-----------------|
| 1 (con lo sblocco) | × 3           | \$25            |
| 2                  | × 4           | \$80            |
| 3                  | × 5           | \$250           |

Si paga ogni 60 s dal contante. Se il contante non basta, la Quota salta per quel minuto e il moltiplicatore torna a × 1.

**Soglie ed eventi.** Ogni 20 s il gioco controlla se far partire un evento, con una pausa minima di 60 s tra due eventi. Il tipo dipende dalla soglia raggiunta.

| Calore | Stato       | Colore barra | Probabilità per controllo | Evento                                      |
|--------|-------------|--------------|---------------------------|---------------------------------------------|
| 0–39   | Tranquillo  | Verde        | 0                         | Nessuno                                     |
| 40–69  | Sorvegliato | Giallo       | 15%                       | Posto di blocco                             |
| 70–89  | Caldo       | Arancio      | 25%                       | Perquisizione (70%) o posto di blocco (30%) |
| 90–100 | Rovente     | Rosso        | 40%                       | Retata in Plaza                             |

- **Posto di blocco.** Un'auto della polizia si ferma su un tratto di percorso per 45 s. Chiunque ci passi accanto, tu e i lavoratori, va a metà velocità.

- **Perquisizione.** Preavviso di 10 s: sirena, banner con conto alla rovescia e un cerchio rosso a terra intorno a una stazione attiva scelta a caso. Poi la stazione si ferma 60 s e la merce nel suo buffer di uscita viene sequestrata. Nei 10 s di preavviso puoi correre a svuotarla: è il momento di abilità.

- **Retata in Plaza.** Preavviso di 10 s. La Plaza chiude per 120 s, le dosi sul bancone vengono sequestrate, i clienti in fila se ne vanno. Dopo la retata il Calore scende a 50.

Nessun evento parte mentre il gioco è chiuso. Offline il Calore scende solo con il calo naturale e la Quota.

**Produrre di più conviene sempre.** Il Calore è l'unica meccanica della Beta senza precedenti nel genere: nessuno degli 11 giochi studiati ha una minaccia che cresce con la produzione. Il rischio è punire chi gioca bene. Per questo vale una regola misurabile: a ogni livello di Purezza e di Quota, un'ora di vendite in Plaza deve rendere più della stessa merce venduta a El Gordo, anche sottraendo le perdite attese di perquisizioni e retate. Un test automatico lo verifica (sezione 14).

**La banda rivale.** Da 3 minuti dopo l'apertura della Plaza, ogni 4–6 minuti (a caso) uno spacciatore rivale si piazza al bordo della Plaza per 90 s. Ogni cliente in arrivo ha il 50% di probabilità di comprare da lui. Lo mandi via restando accanto a lui per 3 s (si riempie una barra "Vattene!"). Con una Guardia assunta se ne occupa lei entro 10 s. Nessuno scontro, nessuna arma in scena.

**Ordini speciali di El Gordo.** Dalla Fase 2, ogni 5–8 minuti il camion suona il clacson e propone un ordine: una quantità da consegnare entro un tempo, pagata il doppio.

| Fase | Esempio di ordine | Tempo | Premio              |
|------|-------------------|-------|---------------------|
| 2    | 15 Panetti          | 2 min | Prezzo × 2          |
| 2–3  | 10 Cristalli      | 3 min | Prezzo × 2          |
| 3    | 25 Cristalli      | 4 min | Prezzo × 2 + 5 Fama |

Un solo ordine attivo alla volta. Le consegne si fanno sul camion come le vendite normali e una barra mostra l'avanzamento; contano anche per il cassone. Se scade non perdi nulla. **Ogni ordine completato dà 60 s di velocità doppia al giocatore**: un'icona "×2" con il conto alla rovescia compare sotto il contante.

**Spinte nel mondo.** Dalla Fase 1, ogni 3–5 minuti compare a terra, vicino al giocatore, un'icona galleggiante "180%": camminandoci sopra il giocatore corre all'180% per 60 s. Se nessuno la prende sparisce dopo 30 s. In Pizza Ready e Burger Please le stesse icone stanno dietro una pubblicità; qui sono gratis. Gli ordini servono a dare un obiettivo di medio termine e a mettere in competizione due usi della stessa merce: venderla a El Gordo ora, o spacciarla in Plaza.

## 8. Schermata iniziale e prima sessione

La schermata iniziale non è un menu davanti al gioco: è il gioco stesso, la valle in 3D vista dall'alto al tramonto, con l'impero che il giocatore potrà costruire già in movimento. Al clic su GIOCA la camera scende fino alla Hacienda, e quel contrasto tra l'impero di domani e il campo vuoto di oggi è il primo gancio.

### La schermata iniziale

**L'idea.** Il primo colpo d'occhio deve sembrare l'inquadratura d'apertura di una serie anni '80: valle in controluce, lampade della Plaza che si accendono, fumo azzurro dal Laboratorio, il camion di El Gordo sulla strada, operai al lavoro. Il giocatore vede subito *dove arriverà*.

**Cosa mostra la scena.**

- **Chi non ha mai giocato** vede un impero dimostrativo: tutte le aree della Beta aperte, una dozzina di lavoratori in movimento, fila di clienti in Plaza. È uno stato di gioco predefinito nel file di configurazione.

- **Chi ha un salvataggio dalla Fase 3 in poi** vede il *proprio* impero, com'è adesso. Prima della Fase 3 vede l'impero dimostrativo: un campo e una capanna non motivano.

- La camera fa un movimento lento a gru, alta e lontana, girando intorno all'impero: un giro completo in 60 s.

- Luce del tramonto più calda di quella di gioco; le piante di Lumina e le lampade brillano con l'effetto bloom.

- Lucciole come particelle che salgono lente dalla giungla.

**Strati sopra la scena.**

1.  **Bande nere** in alto e in basso, il 7% dello schermo ciascuna, con un filo dorato sul bordo interno: formato cinema.

2.  **Correzione di colore**: un velo sfumato arancio caldo in alto e viola in basso, al 15% di opacità.

3.  **Vignettatura** scura ai bordi e una **grana pellicola** animata leggerissima (4% di opacità).

4.  **Logo**, **sottotitolo** e **pulsanti** (sotto).

**Il logo.**

- La parola **PATRÓN** in maiuscolo, carattere alto e stretto (ad esempio Bebas Neue, licenza libera OFL), con riempimento oro sfumato (#FFE08A → \#C8902E), contorno scuro (#1B1B2F) e un'ombra lunga verso il basso.

- **L'accento sulla Ó è una foglia di Lumina** azzurra (#5CE1E6) che brilla e pulsa piano ogni 4 s. È il segno distintivo, riconoscibile anche in piccolo: diventa l'icona della scheda del browser.

- Il logo è un file SVG, centrato, nel terzo superiore dello schermo, largo il 46% della finestra.

- Sotto, il sottotitolo in maiuscoletto bianco all'80%: "DAL CAMPO ALL'IMPERO".

**Pulsanti e informazioni.**

| Elemento                                         | Posizione                        | Aspetto e comportamento                                                                                                                                        |
|--------------------------------------------------|----------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| GIOCA (prima volta) o CONTINUA (con salvataggio) | Centro, al 68% dell'altezza      | 320 × 72 px, oro \#FFC94A con testo scuro. Respira piano (scala 1,00–1,05). Al passaggio del mouse si alza di 2 px e si illumina. **È attivo da subito**: un clic ovunque sullo schermo, Invio o Spazio avviano la partita (CrazyGames: al massimo un clic, pulsanti senza ritardo; skill `ux-ui-arcade-idle`, UX12) |
| Riepilogo partita                                | Sotto CONTINUA                   | Una riga: "Fase 2 · \$12,4K · 1 h 23 min"                                                                                                                      |
| Nuova partita                                    | Sotto, testo bianco al 70%       | Solo se c'è un salvataggio; chiede conferma e propone l'esportazione                                                                                           |
| Impostazioni · Crediti                           | Banda nera in basso a destra     | Testo piccolo                                                                                                                                                  |
| Beta 0.1                                         | Banda nera in basso a sinistra   | Testo piccolo                                                                                                                                                  |
| Valle de Sombra · 1981                           | Banda nera in alto a sinistra    | Testo piccolo in maiuscoletto                                                                                                                                  |
| Audio                                            | Banda nera in alto a destra      | Icona altoparlante barrata con "Clicca per l'audio"                                                                                                            |
| Avviso Safari                                    | Sotto i pulsanti, solo su Safari | "Su Safari i salvataggi possono sparire dopo 7 giorni: meglio Chrome"                                                                                          |

**Sequenza d'apertura** (dal caricamento della pagina).

| Tempo                          | Cosa succede                                                                                             |
|--------------------------------|----------------------------------------------------------------------------------------------------------|
| 0,0 s                          | Nero. Una foglia di Lumina al centro si riempie d'azzurro mentre il gioco carica (di solito meno di 2 s) |
| Fine caricamento + 0,0 → 1,2 s | La scena sfuma dal nero                                                                                  |
| \+ 0,8 s                       | Le bande nere scorrono dentro                                                                            |
| \+ 1,2 → 2,0 s                 | Le lettere del logo cadono una a una (70 ms tra l'una e l'altra) con un piccolo rimbalzo                 |
| \+ 2,1 s                       | Sboccia la foglia-accento, con un lampo di luce e un rintocco                                            |
| \+ 2,4 s                       | Compare il sottotitolo                                                                                   |
| \+ 2,8 s                       | I pulsanti salgono di 12 px sfumando; sono già attivi prima di comparire                                 |

**Audio.** I browser non fanno partire l'audio finché l'utente non clicca. Il primo clic ovunque attiva la musica, che sale in 2 s: un giro di synth anni '80 con percussioni latine (sezione 11).

**Il passaggio al gioco.**

- **Prima partita:** logo e pulsanti spariscono verso l'alto (0,4 s) e le bande nere si ritirano. Le parti dell'impero non ancora costruite si rimpiccioliscono e spariscono (0,5 s), mentre la camera scende dalla gru al lotto 1 in 2,2 s, senza passare dal nero: il giocatore vede **dove** sta il suo lotto nell'impero che ha appena visto. All'arrivo l'interfaccia compare con "Raccogli i soldi!". Nessun testo di storia (sezione 1, «La storia e la visione»).

- **Partita salvata:** niente testo. La camera vola dalla gru al personaggio in 2 s e la luce passa dal tramonto alla luce di gioco.

**Prestazioni.** La schermata usa la stessa scena del gioco, quindi non aggiunge modelli. Effetti di pellicola e colore sono strati CSS, quasi gratuiti. In qualità Media il bloom si disattiva e le lucciole si dimezzano.

### La prima sessione

In 3 minuti il giocatore deve aver fatto un giro completo della catena, incassato e visto il primo lavoratore muoversi da solo. La maggior parte dei giocatori di un gioco mobile non torna dopo la prima sessione, quindi le cose migliori vanno mostrate subito ([Pocket Gamer.biz](https://www.pocketgamer.biz/the-universal-guide-to-retention/)). E il primo ciclo del core loop deve chiudersi con un momento di soddisfazione ([Roblox Creator Hub](https://create.roblox.com/docs/production/game-design/onboarding)).

**Regole dell'onboarding.**

- Nessun menu iniziale, nessun muro di testo: si entra direttamente nel mondo.

- Una sola istruzione a schermo alla volta, al massimo 4 parole, in alto al centro ("Compra il Campo 2!"), con una freccia o una mano che indica dove andare: è la forma di Pizza Ready e Burger Please.

- L'istruzione sparisce appena l'azione è fatta.

- Nessuna finestra che interrompe il gioco nei primi 5 minuti.

- Ogni meccanica successiva si spiega solo quando compare, con una riga sola.

**Sequenza.**

| Tempo | Cosa vede il giocatore                                                                                                  | Cosa impara                              |
|-------|-------------------------------------------------------------------------------------------------------------------------|------------------------------------------|
| 0:00  | Schermata iniziale e clic su GIOCA                                                                                      | Dove può arrivare                        |
| 0:02  | Dal nero si apre la Hacienda vuota con l'arco PATRÓN, dopo l'impero della schermata iniziale                              | Il contesto, senza leggere               |
| 0:05  | Dentro la Hacienda vuota, con l'arco PATRÓN sullo sfondo. Tasti W A S D disegnati a schermo accanto alla frase "Muoviti con WASD". Freccia verso le mazzette a due passi: "Raccogli i soldi!" | I comandi; la missione |
| 0:08  | Il cubo di mazzette si svuota: le banconote volano nel contatore in alto a destra. "El Gordo ti anticipa \$40" | Il contante |
| 0:10  | Sagoma del Campo 1 con il fumetto "\$5": "Compra il campo!". La festa: camera vicina, piantine che spuntano, stelle | Gli sblocchi |
| 0:16  | Sagoma del Torchio con "\$15": "Compra il torchio!". Seconda festa | Le stazioni |
| 0:22  | Sagoma del Campo 2, pagata con il resto del regalo. Terza festa | Crescere |
| 0:28  | Finita la festa, clacson: il camion di El Gordo arriva lungo la strada e si ferma a est dell'arco | Il compratore |
| 0:30  | "Raccogli le foglie!": camminando tra le piante le foglie volano tra le braccia una a una | La raccolta e la pila |
| 0:40  | "Foglie al torchio!": la vite scende, esce il primo Panetto | Le stazioni trasformano |
| 0:55  | "Vendi a El Gordo!": il cassone segna "1/10", le mazzette compaiono sul vassoio accanto al camion. "Prendi i soldi!" | Prima ricompensa |
| 1:10  | Primo sacco di Scarti: sagoma del Falò, "Compra il falò!" | Il lavoretto del tema |
| 1:20  | Falò comprato: Rispetto 2, pioggia di \$40 in mazzette intorno al giocatore | Il livello |
| 1:30  | Sagoma dell'Ufficio, "Compra l'ufficio!". Si apre con lo Zaino al livello 1 regalato; dentro, le schede Zaino, Scarpe e Guadagno | I potenziamenti |
| 2:00  | Tappetino "Raccoglitore – \$30" a sud dei Campi | Si può assumere |
| 2:30  | Rispetto 3: pioggia di \$60. Appena assunto, il Raccoglitore viene seguito dalla camera per 1,5 s mentre fa il suo primo giro. Testo: "Ora lavora per te"                    | **Momento chiave: la prima automazione** |
| 3:30  | "Apri una nuova zona!": la staccionata verso est sparisce e si apre il lotto 2. Da qui guida solo la frase dell'obiettivo in alto (sezione 9)                                                                   | Autonomia                                |

**Spiegazioni al momento giusto** (una riga, una sola volta):

- Primo Laboratorio: compare la barra del Calore con "Raffinare attira l'attenzione".

- Calore a 40 per la prima volta: "La polizia ti osserva. Valuta la Quota." e la freccia verso lo sblocco della Quota.

- Primo rivale: "Un rivale ti ruba i clienti. Avvicinati per cacciarlo."

- Primo ordine speciale: "El Gordo paga doppio se fai in fretta."

- Primo cassone di Scarti pieno: "Brucia gli scarti nel falò."

- Primo camion pieno: "El Gordo torna tra poco."

- Primo livello di Rispetto: "Più costruisci, più ti rispettano."

- Primo lavoratore addormentato: "Passagli vicino per svegliarlo."

## 9. Cosa tiene incollati

Il giocatore resta finché ha sempre un passo successivo chiaro, vicino e diverso dal precedente, e torna perché sa che nel frattempo qualcosa è cresciuto. Il genere è forte proprio sulla durata delle sessioni: nel primo giorno un arcade idle tiene il giocatore circa 25 minuti, contro circa 10 di un hyper-casual ([MAF](https://maf.ad/en/blog/arcade-idle-genre/)). Il punto debole è il ritorno nei giorni dopo: essendo il giocatore più attivo, la retention tende a essere più bassa degli idle puri ([Homa](https://www.homagames.com/blog/arcade-idle-a-new-hybridcasual-genre-enters-the-game)). Per questo la Beta spinge verso l'automazione e i guadagni offline.

**I meccanismi, uno per uno.**

| Meccanismo                       | Come funziona nel gioco                                                                                                                                           | Perché tiene                                        |
|----------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------|
| Frase dell'obiettivo             | In alto al centro, sotto il Rispetto: il prossimo passo in 4 parole al massimo ("Compra il Campo 3!"). Il prezzo sta sul tappetino; se il tappetino è fuori schermo, una freccia al bordo lo indica | Non ci si chiede mai cosa fare |
| Rispetto                         | Stella con il livello e barra delle stelle "n/max" in alto al centro; a ogni livello una pioggia di mazzette | Il progresso sale anche tra uno sblocco e l'altro |
| Traguardo sempre vicino          | Ritmo della tabella degli sblocchi: mai più di 3–4 minuti tra uno sblocco e l'altro nella prima ora                                                               | Ogni sessione chiude almeno un obiettivo            |
| Collo di bottiglia che si sposta | Ogni sblocco risolve un limite e ne mostra un altro. La stazione ferma ha un'icona di stop ben visibile                                                           | C'è sempre un problema da risolvere, e si vede dove |
| Crescita visibile                | Più lavoratori in giro, pile di soldi, mappa che si apre, abito del personaggio che cambia (camicia logora → camicia hawaiana → giacca di lino → completo bianco) | Il progresso si vede senza leggere numeri           |
| Missioni                         | Tre missioni sempre attive nel menu ("Vendi 20 Panetti", "Compra 2 potenziamenti"), come le missioni di Monkey Mart, My Perfect Hotel e altri 4 giochi su 11. Premio in contante e 2 stelle di Rispetto; completata una, ne arriva subito un'altra. Nessun timer e nessuna scadenza | Un obiettivo di medio termine anche quando il prossimo sblocco è lontano |
| Ritmo degli eventi               | Dopo la Fase 2 succede qualcosa ogni 2–5 minuti: ordine speciale, rivale, posto di blocco                                                                         | La routine non diventa monotona                     |
| Rischio dosabile                 | Purezza e Quota sono leve: guadagni di più accettando più Calore                                                                                                  | Decisioni vere, non solo acquisti                   |
| Ritorno ricompensato             | All'apertura, schermata "Mentre eri via" con il contante guadagnato offline che si conta in animazione                                                            | Tornare dà subito una ricompensa                    |
| Lavoro lasciato a metà           | Nella stessa schermata, una riga sul primo collo di bottiglia offline (es. "Il Laboratorio si è fermato: mancavano Panetti")                                          | Si rientra con un compito preciso                   |
| Confronto tra amici              | Schermata "Valore dell'impero" (contante guadagnato in tutto, tempo di gioco, fase) con un pulsante che copia il riepilogo da incollare in chat                   | Competizione senza server                           |

**La curva della difficoltà.** La difficoltà è la prima causa meccanica di abbandono: troppo dura e si molla, troppo facile e ci si annoia. Va fatta salire con momenti di pressione, ma senza fallimenti veri all'inizio ([Pocket Gamer.biz](https://www.pocketgamer.biz/the-universal-guide-to-retention/)). Nella Beta:

- Minuti 0–12: nessuna pressione, solo crescita.

- Minuti 12–30: arriva il Calore, ma resta sotto 40.

- Minuti 30–85: eventi, rivali, lavoratori da svegliare. Si perde merce e tempo, mai progresso.

- Dopo 85: tutto automatizzato. La sfida diventa ottimizzare Purezza e Quota senza finire in retata.

**Cosa non facciamo, apposta.** Niente energia che si esaurisce, niente timer finti da pagare, niente punizioni se salti un giorno. È un gioco tra amici: la voglia di tornare deve venire dal gioco stesso. Se un giorno sarà pubblicato, la monetizzazione si valuterà a parte.

## 10. Direzione artistica e game feel

**Un diorama giocattolo, non un paesaggio.** Il riferimento visivo sono Pizza Ready e My Mini Mart: ogni cosa sullo schermo è un'informazione di gioco (una stazione, una merce, una pila di soldi, un cliente) e la grafica serve solo a renderla leggibile a colpo d'occhio. Niente realismo di luce, terreno o natura: luce piena, colori pastello, pavimenti puliti, oggetti grossi e ordinati, e una sola cosa che brilla nel mondo: la Lumina. Personaggi, alberi, vegetazione e oggetti di villaggio vengono da pacchetti di modelli low-poly gratuiti con licenza CC0; le stazioni del gioco, che nei pacchetti non esistono, si costruiscono da codice nello stesso stile. È anche lo standard del genere: camera dall'alto leggermente inclinata e personaggi stilizzati o low-poly ([Homa](https://www.homagames.com/blog/arcade-idle-a-new-hybridcasual-genre-enters-the-game)).

**Tono visivo.** Giungla e villaggio sudamericano anni '80 raccontati come un plastico: il tema viene dagli oggetti (capanna di tegole, camion, palme, Lumina), non dall'atmosfera. Le cose pericolose (polizia, rivali) si leggono dal colore, mai dal sangue.

**Le regole del genere, osservate sui riferimenti.** L'elenco completo, con quanti giochi le rispettano, è in `.claude/skills/arcade-idle/04-sintesi/`; ogni tappa di grafica si chiude passando gli screenshot per la lista di controllo di quella cartella.

| Regola | Come si applica in PATRÓN |
|---|---|
| Luce piena, quasi senza chiaroscuro | Luce ambiente forte e sole alto (65°): le facce in ombra restano chiare; ombre corte e leggere, solo "appoggi" sotto gli oggetti. Niente nebbia, niente mappatura dei toni cinematografica |
| Pavimenti puliti a colori piatti | Erba di un solo verde chiaro; sentieri e campi con bordi netti e arrotondati e un filo più scuro sul contorno, come zone disegnate. Niente chiazze, ciuffi d'erba o sassi sparsi |
| Pastello e chiaro | Lo sfondo è chiaro e gli oggetti hanno colori più saturi: risaltano sul pavimento |
| Pochi oggetti, grossi, con aria intorno | Camera lontana (personaggio a circa 1/13 dello schermo) su un lotto vuoto e arioso; poche stazioni grandi e semplici, ciascuna con una sola massa di colore più il giallo di marca; merci più grandi del vero, e quelle in mano più larghe del corpo (UX4) |
| Ordine da griglia | Stazioni allineate, alberi della cornice in file regolari, niente disposizione casuale dentro la valle |
| Il giocatore si distingue | È l'unico personaggio con un colore acceso; i lavoratori e i clienti hanno colori più spenti |
| Il gioco parla con oggetti nel mondo | Riquadri d'acquisto con l'icona di ciò che sbloccano e il prezzo grande; presa e consegna sulla macchina, segnate solo da un contorno bianco con icona e freccia (UX2); mazzette a terra in blocchi da 2 × 3 che crescono in altezza; contatori "n/max" sopra stazioni, cassoni e camion; scritta MAX a stazione piena; fumetti tondi con un'icona e un numero, mai frasi; freccia gialla 3D sopra il prossimo tappetino e un anello a terra (da M2) |
| Due colori di marca | L'azzurro della Lumina (#5CE1E6) e il giallo anni '80 (#FFC94A) si ripetono su tutte le stazioni, i tappetini e le insegne: la filiera si riconosce come una cosa sola |
| Le stazioni sono macchine che si spiegano da sole | Sopra ogni stazione c'è un cartello con cosa entra e cosa esce, a icone: «🌿 → panetto» sul Torchio, «panetto → cristallo» sul Laboratorio. La merce in entrata si vede accumulata dal lato del tappetino di consegna, quella prodotta impilata sul lato del ritiro: il flusso attraversa la macchina da una parte all'altra (prova di percezione, domanda 5) |
| I soldi si vedono | Mazzette verde acceso con un bordo chiaro: nessun altro oggetto ha quel verde, che deve staccarsi dal prato pastello |

**Palette.**

| Uso                            | Colore                            |
|--------------------------------|-----------------------------------|
| Erba della valle / contorni    | \#A6DC7A / \#86C45E               |
| Giungla della cornice          | \#5DB55A chiaro, \#3F9A4C scuro   |
| Terra dei campi / sentieri     | \#C98D5C / \#F3E2BE               |
| Muri del villaggio / tegole    | \#E8D9C0 / \#C4553B               |
| Lumina (emissiva)              | \#5CE1E6                          |
| Soldi (mazzette / bordo)       | \#2ECC52 / \#E9FFD9               |
| Accento interfaccia (anni '80) | \#FF4F9A magenta, \#FFC94A giallo |
| Testo interfaccia / ombre      | \#FFFFFF / \#1B1B2F               |
| Polizia                        | \#2F5BD3 blu, \#E33B3B rosso      |

**Modelli da pacchetti CC0.**

- Pacchetto di riferimento: **Kenney** (kenney.nl), licenza CC0: si possono usare, modificare e pubblicare senza obbligo di citazione. Li citiamo comunque nei Crediti.
- Da un solo autore per tutto (personaggi, natura, villaggio), così lo stile resta coerente. Un secondo pacchetto (Quaternius, anch'esso CC0) si usa solo per ciò che manca, ad esempio piante tropicali, e solo se si accorda nei colori.
- I modelli stanno in `public/models/` in formato glTF (`.glb`) e si caricano con il GLTFLoader di Three.js (incluso in Three.js, non è un framework in più). I colori dei modelli si riportano alla palette di questa sezione.
- Pacchetti usati nella Beta: Kenney **Nature Kit** (alberi, palme, cespugli, rocce, ceppi, tronchi, fiori, staccionata), **Car Kit** (camion di El Gordo, `truck_flat`) e **Mini Characters** (personaggi animati, 32 animazioni). I file vengono dalla raccolta `@netforge/asset-library-files` su npm, che contiene copie ottimizzate (compressione meshopt) dei pacchetti originali con la licenza verificata per ciascuno: scaricarli da npm funziona anche dalle sessioni cloud, dove kenney.nl non è raggiungibile. L'elenco dei file e la provenienza sono in `public/models/CREDITS.md`.
- I materiali "non illuminati" del Nature Kit diventano Lambert con ombreggiatura piatta, così ricevono luce e ombre. Le rocce si ricolorano in grigio pietra.
- Le stazioni (Torchio, Laboratorio, Banco, bancone della Plaza) si costruiscono da codice con le stesse regole dei pacchetti: forme semplici smussate, colori pieni, nessuna texture fotografica.

**Luce e atmosfera.**

- Giorno pieno, niente ciclo giorno-notte. Luce emisferica forte, quasi bianca, che tiene chiare anche le facce in ombra; sole alto da sud-ovest (65° di elevazione), tenue e appena caldo. Ombre corte e leggere.
- Niente nebbia e niente mappatura dei toni cinematografica: i colori della palette arrivano allo schermo come sono. Oltre la cornice di giungla lo sfondo è un verde uniforme.
- Materiali Lambert con ombreggiatura piatta: le facce dei poligoni si vedono, ed è lo stile.
- Ombre vere dalla luce direzionale (mappa d'ombra da 2048 px, filtro PCF con bordi morbidi) su personaggi, stazioni e alberi; in qualità Media 1024 px. La mappa d'ombra segue la camera e copre un riquadro di 57 m di lato, quanto l'inquadratura ruotata allo zoom lontano (da tarare sull'iMac). Le ombre VSM sono escluse: disegnano nella mappa d'ombra anche gli oggetti che le ricevono (terreno) e costano circa 27.000 triangoli in più all'avvio.
- Terreno pulito: erba di un solo verde chiaro. Sentieri e campi sono zone nette con angoli arrotondati e un contorno più scuro di 15 cm; i campi hanno solchi regolari.
- I lotti sono pavimenti di terra battuta chiara chiusi da una staccionata bassa (PS6); fuori c'è prato a tinta unita e, verso i bordi della valle, la giungla in file regolari. Dentro i lotti non ci sono sassi, ceppi o fiori sparsi: ogni oggetto ha un ruolo.
- Bloom (UnrealBloomPass) leggero solo sulle cose che brillano: Lumina, lampade, finestre del Laboratorio. Si disattiva in qualità Media.

**Proporzioni.** La scala del mondo è in metri reali e tutti i modelli si adattano a questa tabella:

| Elemento | Misura |
|---|---|
| Personaggio adulto | 1,7 m di altezza (il giocatore 1,9 m: è il protagonista e deve spiccare) |
| Porta | 2,0 m di altezza |
| Capanna | 5 × 4 m di pianta, gronda a 2,4 m, colmo a 3,6 m |
| Torchio | 3 × 3 m, alto 2,2 m: un blocco unico con una vite grossa, leggibile con la camera lontana |
| Appezzamento del Campo | 4 × 4 m |
| Camion di El Gordo | 2,3 × 5,5 m, alto 2,6 m |
| Piante di Lumina | 0,7–1,0 m, in file regolari |
| Cespugli | 0,5–1,2 m |
| Alberi della giungla | 4–8 m |

**Visibilità del personaggio.**

- Gli oggetti che stanno tra la camera e il giocatore (alberi, tetti, stazioni) diventano trasparenti al 30% in 0,15 s e tornano pieni quando il giocatore si allontana. Il giocatore non è mai nascosto.
- Inquadratura di partenza: il giocatore dentro la Hacienda, nel terzo centrale dello schermo, con l'arco PATRÓN e la sagoma del Campo 1 in vista; niente di più alto delle ginocchia tra la camera e lui, e nessun oggetto che copra più di un quinto dello schermo. Il punto di partenza è nel lotto 1 a (27, 17,5), con il regalo di El Gordo a due passi verso nord-est; la capanna non c'è più nella zona di partenza.

**Modelli.**

| Elemento           | Composizione                                                  | Dettaglio distintivo                     |
|--------------------|---------------------------------------------------------------|------------------------------------------|
| Personaggi         | Dal pacchetto CC0, con scheletro e animazioni di camminata e di attesa | Il cappello dice il ruolo (sezione 6)    |
| Giocatore          | Come sopra, alto 1,9 m, con cappellino rosso e ombra tonda sotto i piedi | L'abito cambia con le fasi (sezione 9); il cappellino rosso lo distingue sempre |
| Piante di Lumina   | Gruppi di coni e piani                                        | Le foglie pronte hanno un bordo azzurro  |
| Torchio             | Da codice: basamento, telaio e pistone che scende             | Pistone animato                          |
| Laboratorio        | Da codice: baracca di legno con camino                        | Fumo e luce azzurra dalle finestre       |
| Camion di El Gordo | Dal pacchetto se c'è un camion adatto, altrimenti da codice   | Motore che vibra quando arriva un ordine |
| Plaza              | Case dal pacchetto, bancone e tenda a strisce da codice       | Lampadine appese                         |
| Alberi e giungla   | Dal pacchetto: palme, alberi tropicali, cespugli, felci       | Muri di vegetazione sulle aree bloccate  |

**Animazioni.**

- Personaggi: camminata e attesa dalle animazioni del pacchetto, con la velocità della camminata legata alla velocità reale (niente piedi che scivolano). Se un personaggio non ha animazioni, si usa il ripiego procedurale: oscillazione verticale e inclinazione in avanti in camminata, respiro da fermo (scala 1,00–1,02 in 2 s).

- Pila tra le braccia: ogni oggetto segue quello sotto con un ritardo a molla, così la pila ondeggia in curva.

**Game feel: ogni azione ha una risposta.** Le piccole risposte visive e sonore (vibrazione della camera, particelle, scatti di scala, suoni) cambiano la sensazione di un gioco più di molte funzioni nuove ([Bugnet](https://bugnet.io/blog/game-feel-why-juice-matters-and-how-to-add-it)). Vanno però dosate: una vibrazione della camera troppo forte dà la nausea ([Wayline](https://www.wayline.io/learn/game-feel/1)).

| Azione                  | Risposta visiva                                                                                                   | Suono                                                             | Durata |
|-------------------------|-------------------------------------------------------------------------------------------------------------------|-------------------------------------------------------------------|--------|
| Prendi un oggetto       | Vola in arco verso la pila; scatta da 1,3 a 1,0 di scala                                                          | "Pop" che sale di un semitono a ogni oggetto consecutivo (max 12) | 0,25 s |
| Lasci un oggetto        | Vola alla stazione; la stazione si schiaccia e torna (0,95 → 1,05 → 1)                                            | Tonfo morbido                                                     | 0,12 s |
| Incassi                 | Le mazzette volano al contatore in alto; il numero conta in animazione e si gonfia del 15%                        | Tintinnio di cassa                                                | 0,4 s  |
| Sblocco                 | Anello che si riempie; poi l'oggetto sale da terra con rimbalzo, esplosione di 20 foglie, vibrazione camera 0,1 m | Tic di pagamento che salgono di tono, poi fanfara di 1,2 s e un tintinnio per stella | 3 s    |
| Assunzione              | Il lavoratore cade dall'alto e rimbalza                                                                           | "Hey!" sintetico                                                  | 0,4 s  |
| Cliente servito         | Testo verde con l'importo reale incassato (es. "+\$30") che sale e svanisce                                       | Moneta                                                            | 0,6 s  |
| Soglia di Calore        | La barra pulsa; luci blu e rosse ai bordi dello schermo                                                           | Sirena breve                                                      | 1 s    |
| Preavviso perquisizione | Cerchio rosso pulsante a terra; conto alla rovescia sopra la stazione                                             | Sirena ripetuta                                                   | 10 s   |
| Rivale                  | Fumetto "!" sopra la testa                                                                                        | Fischio                                                           | 0,3 s  |

La vibrazione della camera si usa solo per sblocchi e retate, mai per azioni ripetute.

**Obiettivi di prestazione.** 60 fotogrammi al secondo su un portatile recente di fascia media in qualità Alta, e almeno 50 sul tuo iMac 2015; meno di 150 chiamate di disegno e meno di 150.000 triangoli in scena. Nell'inquadratura di partenza (tutto il lotto 1 con la cornice) il limite è 60.000 triangoli. I conteggi sono quelli del pannello debug, ombre comprese. Gli alberi della giungla lontana sono versioni semplificate, senza ombre. Per oggetti ripetuti (piante, pile, mazzette, clienti) si usa una sola geometria disegnata più volte. Gli oggetti statici (vegetazione, capanna, stazioni) si fondono in poche geometrie: tutti i materiali con un solo colore pieno diventano un unico materiale con il colore nei vertici, e la vegetazione si divide in blocchi di 12 m che si scartano quando sono fuori inquadratura. Risoluzione interna limitata a 2560 × 1440, anche sugli schermi 5K. Le impostazioni offrono Qualità grafica Alta o Media.

## 11. Audio

Tutti gli effetti sonori si generano da codice con ZzFX, una libreria di pochi kilobyte che crea suoni sintetici da una lista di parametri: niente file da cercare né licenze. La musica è l'unico elemento audio che può richiedere un file.

- **Effetti.** Quelli elencati nella tabella del game feel (sezione 10), più il clacson del camion, la fiammata del Falò, il russare e il risveglio dei lavoratori, il jingle del livello di Rispetto e un clic leggero per i pulsanti. Arrivano nella tappa M2c, prima del resto dell'audio, perché un gioco del genere senza suoni sembra rotto (revisione del 30 ottobre 2026, voto 1/10). Regole: al massimo 6 suoni di raccolta al secondo (gli altri pezzi passano in silenzio, il tono continua a salire), al massimo 8 voci insieme, volume effetti all'avvio 70%. La festa dura 3 s: fanfara di circa 1,2 s all'inizio, poi un tintinnio per ogni stella che vola alla barra del Rispetto. Ogni effetto ha 2–3 varianti leggermente diverse, scelte a caso, per non stancare l'orecchio.

- **Suoni ripetuti.** La raccolta usa un "pop" che sale di tono a ogni oggetto consecutivo: rende piacevole anche l'azione più ripetuta del gioco.

- **Ambiente.** Un sottofondo di giungla (insetti, uccelli) generato da rumore filtrato, a volume basso, con un'eco di radio lontana in Plaza.

- **Musica.** Un giro corto di synth anni '80 con percussioni latine, 90–100 battiti al minuto, in loop. Per la Beta va bene un brano con licenza libera (CC0) o una musica generata da codice; si lascia come voce aperta.

- **Mixer.** Tre volumi separati (musica, effetti, ambiente) nelle impostazioni. La musica si abbassa del 50% durante sirene e fanfare.

- **Vincolo dei browser.** L'audio parte solo dopo il primo clic: lo gestisce la schermata iniziale (sezione 8).

## 12. Interfaccia e HUD

L'interfaccia occupa il meno possibile: tre elementi fissi in alto, disposti come in Pizza Ready e Burger Please (ingranaggio a sinistra, livello e obiettivo al centro, contante a destra), una piccola legenda dei tasti in basso, e tutto il resto vive nel mondo (prezzi sui tappetini, contatori sulle stazioni). È scritta in HTML e CSS sopra il canvas 3D, in orizzontale, da 1280 × 600 in su.

**Schermo di gioco, dall'alto in basso.**

| Posizione                | Elemento             | Dettagli                                                                                                   |
|--------------------------|----------------------|------------------------------------------------------------------------------------------------------------|
| In alto a sinistra       | Impostazioni         | Icona ingranaggio                                                                                          |
| In alto al centro        | Rispetto e obiettivo | Stella con il livello e barra delle stelle "n/max"; sotto, la frase dell'obiettivo in bianco con contorno scuro (4 parole al massimo) |
| In alto a destra         | Contante             | Pillola tonda con icona mazzetta e numero abbreviato (950 · 1,2K · 3,45M). Si gonfia a ogni incasso. Sotto, l'icona "×2" quando è attiva la spinta di un ordine |
| Sotto la barra superiore | Barra del Calore     | Compare dalla Fase 2. Colore e nome dello stato (sezione 7)                                                |
| Sotto il Calore          | Banner evento        | Ordine speciale, preavviso di perquisizione, rivale: icona, testo di 4–6 parole, conto alla rovescia       |
| In basso a sinistra      | Legenda tasti        | WASD · clic · Esc menu · Spazio pausa. Sparisce dopo 10 minuti di gioco; il tasto H la riporta |
| Bordo dello schermo      | Freccia obiettivo    | Indica il tappetino del prossimo sblocco quando è fuori vista                                              |

**Elementi nel mondo.**

- Riquadri d'acquisto: prezzo grande sopra, anello giallo che si riempie durante il pagamento e prezzo che scende.

- Presa e consegna: contorno bianco sottile attaccato alla macchina, con l'icona della merce e una freccia dentro o fuori (sezione 3).

- Stazioni: anello di avanzamento del ciclo e numero di pezzi pronti; icona di stop rossa se ferme.

- Lavoratori: icona "zzz" se aspettano merce o se si sono addormentati (in quel caso l'icona è più grande e oscilla).

- Le etichette nel mondo sono al massimo circa 40 a schermo; oltre si nascondono quelle lontane.

**Pannello Ufficio.** Si apre quando stai sul contorno davanti all'ingresso dell'Ufficio e si chiude da solo quando ne esci (oppure con la X o Esc). Non si apre a distanza: all'Ufficio si va a piedi, come agli uffici di Pizza Ready e Burger Please.

- Pannello laterale a destra, largo il 35% dello schermo; il mondo resta visibile a sinistra.

- Nella Fase 1 c'è una scheda sola, **Giocatore** (Zaino, Scarpe, Guadagno), e l'Ufficio si compra come sblocco 4b. Dalla tappa M3 le schede diventano quattro: **Giocatore** (Zaino, Scarpe, Guadagno), **Stazioni** (Fertilizzante, Ingranaggi, Cassone, Attrezzatura, Purezza, Bilance), **Squadra** (Formazione, lavoratori extra), **Polizia** (Quota, Paga il Comandante; compare dalla Fase 3).

- Ogni potenziamento è una scheda grande con l'immagine dell'oggetto, il nome, i livelli come tacche, l'effetto "prima → dopo" (es. "Capacità 4 → 6") e il pulsante con il prezzo, come le schede di Pizza Ready e Burger Please. Grigio se non te lo puoi permettere, verde se sì.

- Un pallino rosso sull'icona dell'Ufficio nel mondo segnala che c'è almeno un potenziamento acquistabile.

**Impostazioni.** Volumi (musica, effetti, ambiente) · Qualità grafica (Alta/Media) · Valore dell'impero e Condividi · Esporta salvataggio · Importa salvataggio · Ricomincia da zero (con doppia conferma) · Versione del gioco.

**Tipografia.** Un solo carattere tondo e in grassetto, incluso nei file del gioco (ad esempio Baloo 2, licenza libera OFL), con contorno scuro per leggerlo sopra il 3D. Testi minimi 14 px a 1280 × 600, che crescono in proporzione sugli schermi più grandi. Il logo ha un carattere suo (sezione 8).

## 13. Salvataggio, guadagni offline, impostazioni

Il gioco salva da solo ogni 5 secondi nel browser, e alla riapertura calcola quanto ha prodotto la catena automatizzata mentre eri via, fino a un massimo di 2 ore. Senza server: ogni amico ha il suo mondo nel proprio browser.

**Salvataggio.**

- Archivio locale del browser, chiave patron.save.v1, in formato JSON.

- Contenuto: versione del salvataggio, ora del salvataggio, contante, stelle del Rispetto, carico del camion, contante guadagnato in tutto, tempo di gioco, fase, sblocchi fatti, livelli dei potenziamenti, lavoratori, contenuto dei buffer di ogni stazione, Calore, livello Quota, Fama, flag dei tutorial già visti, impostazioni.

- Si salva ogni 5 s e ogni volta che la scheda va in secondo piano o si chiude.

- Ogni cambio di formato aumenta la versione e ha una funzione di migrazione: un aggiornamento non deve mai cancellare i progressi degli amici.

- **Esporta**: il salvataggio diventa un testo compresso da copiare. **Importa**: si incolla quel testo. Serve per spostare la partita su un altro computer o browser, e come copia di sicurezza.

**Guadagni offline.** All'apertura il gioco misura il tempo passato dall'ultimo salvataggio (massimo 2 ore; se negativo, per un orologio cambiato, vale zero). Sotto i 60 secondi non mostra nulla.

Il calcolo considera solo ciò che è automatizzato, perché il giocatore non c'era:

1.  Per ogni tratto della catena prende il ritmo più basso tra produzione della stazione, trasporto dei lavoratori assegnati e, in Plaza, arrivo dei clienti.

2.  Il ritmo di vendita offline è il minimo lungo la catena fino a un punto di vendita servito da un lavoratore. Prima dello spacciatore l'unica vendita automatica è il Cargador di El Gordo, che paga il 10% in meno: offline si guadagna, ma molto meno che con la Plaza. Senza Cargador né spacciatore si riempiono solo i buffer.

3.  Contante offline = ritmo di vendita × prezzo × tempo × 0,8 (i lavoratori dormono senza nessuno che li svegli), meno la Quota dello stesso periodo. Il risultato non scende mai sotto zero.

4.  I buffer delle stazioni si riempiono con la produzione offline, fino alla loro capacità. Un Torchio conta solo se un Raccoglitore porta via gli Scarti; il camion vende al massimo un cassone ogni (tempo per riempirlo + 20 s).

5.  Il Calore scende col calo naturale e la Quota. Offline non partono eventi e non si sblocca nulla.

La schermata "Mentre eri via" mostra il contante che si conta in animazione, il tempo passato e una riga sul tratto più lento ("Il Laboratorio si è fermato: mancavano Panetti"). Il pulsante "Incassa" aggiunge il contante con l'animazione delle mazzette.

Il calcolo vive in una funzione pura, separata dal rendering, con test automatici (sezione 14): è la parte dove un errore si nota meno e fa più danni.

**Impostazioni.** Descritte nella sezione 12. Il reset completo chiede due conferme e propone prima l'esportazione.

## 14. Architettura del codice

La logica del gioco (economia, stazioni, Calore, eventi) è separata dalla grafica e non sa nulla di Three.js: così si testa in automatico e il calcolo offline riusa le stesse regole del gioco. Tutti i numeri stanno in un solo file di configurazione.

**Principi.**

1.  **Logica e grafica separate.** La cartella sim/ contiene funzioni e dati TypeScript puri. world/, fx/ e ui/ leggono lo stato e lo disegnano.

2.  **Passo fisso.** Un unico ciclo con requestAnimationFrame: la logica avanza a passi fissi di 1/30 s, il disegno avviene a ogni fotogramma. Se il computer rallenta, la logica resta corretta.

3.  **Bilanciamento in configurazione.** config/balance.ts contiene, tipizzati, tutti i valori delle sezioni 4–7 e 13. Nessun numero di bilanciamento scritto direttamente nella logica.

4.  **Eventi interni.** La logica emette eventi (oggetto preso, contante incassato, sblocco, soglia di Calore, perquisizione). Effetti visivi, suoni e tutorial li ascoltano. Così il game feel si aggiunge senza toccare le regole.

5.  **Casualità riproducibile.** Un generatore di numeri casuali con seme, salvato nel salvataggio, per poter riprodurre un bug.

6.  **Modalità debug.** Con ?debug=1 nell'indirizzo compare un pannello: fotogrammi al secondo, +\$1.000, tempo × 10, Calore +20, avvia un evento a scelta, mostra la griglia dei percorsi, reset.

**Struttura dei file.**

```
patron/
  CLAUDE.md                istruzioni per Claude Code: link a questo documento, convenzioni
  index.html
  vite.config.ts
  public/                  logo SVG, font, eventuale musica
    models/                modelli glTF dei pacchetti CC0, con il file della licenza
  src/
    main.ts                avvio, schermata iniziale, ciclo principale
    config/
      balance.ts           tutti i numeri del gioco
      map.ts               posizioni di aree, stazioni, tappetini
    core/
      loop.ts              ciclo a passo fisso
      input.ts             tastiera e mouse
      bus.ts               eventi interni
      rng.ts               casualità con seme
      save.ts              salvataggio, migrazioni, esporta/importa
    sim/
      state.ts             tipi dello stato di gioco
      player.ts            movimento del giocatore, collisioni
      pathfinding.ts       griglia dei percorsi e ricerca A*
      geometry.ts          collisioni tra cerchi, rettangoli e bordi
      economy.ts           formule di costo, prezzi, Purezza, Fama
      stations.ts          cicli di produzione e buffer
      workers.ts           macchina a stati dei lavoratori, sonno
      customers.ts         arrivi, fila, pazienza, acquisti
      heat.ts              Calore e Quota
      incidents.ts         posti di blocco, perquisizioni, retate, rivali, ordini
      unlocks.ts           sequenza degli sblocchi e barra obiettivo
      offline.ts           calcolo dei guadagni offline
    world/
      scene.ts  camera.ts  lights.ts  map.ts
      models/              personaggi, piante, torchio, laboratorio, camion, plaza, merci
    fx/
      tweens.ts  particles.ts  floatingText.ts  shake.ts
    audio/
      sfx.ts  music.ts  mixer.ts
    ui/
      hud.ts  objectiveBar.ts  heatBar.ts  banner.ts  officePanel.ts
      settings.ts  offlineReport.ts  titleScreen.ts  styles.css
    debug/
      debugPanel.ts
  tests/
    economy.test.ts  offline.test.ts  heat.test.ts  save.test.ts
  .github/workflows/
    deploy.yml             pubblicazione automatica su GitHub Pages
```

**Test automatici minimi.**

- Formule dei costi: livello 0, 1 e 5 di ogni potenziamento corrispondono alla tabella.

- Guadagni offline: catena senza spacciatore né Cargador dà contante zero; catena completa dà il ritmo del tratto più lento; il tetto di 2 ore è rispettato; il risultato non è mai negativo.

- Calore: le soglie fanno partire il tipo di evento giusto; la Quota moltiplica il calo; a ogni livello di Purezza e Quota un'ora di Plaza rende più di El Gordo anche sottraendo le perdite attese degli eventi (sezione 7).

- Rispetto: stelle da sblocchi e potenziamenti, soglie della tabella, livelli minimi di Laboratorio e Plaza raggiunti prima dei soldi seguendo la sequenza.

- Camion: a cassone pieno parte e torna dopo 20 s; il potenziamento Cassone porta la capienza da 10 a 40.

- Salvataggio: salva, ricarica e ottieni lo stesso stato; una migrazione dalla versione precedente non perde dati.

## 15. Piano di sviluppo per Claude Code

La Beta si costruisce in 10 tappe, una per sessione di Claude Code, e ognuna finisce con qualcosa che si prova nel browser. Non si passa alla tappa successiva finché i criteri di quella attuale non sono verificati.

**Come lavorare.**

1.  Esporta questo documento in Markdown e salvalo nel progetto come docs/GDD.md.

2.  Apri Claude Code nella cartella del progetto e incolla il prompt di partenza qui sotto.

3.  Per ogni tappa chiedi prima un piano, leggilo, poi fai eseguire.

4.  A fine tappa: test automatici verdi, prova nel browser, commit su Git. Se qualcosa non va, descrivi cosa vedi, non come correggerlo.

5.  Quando cambi idea su una regola, aggiorna prima questo documento, poi chiedi la modifica citando la sezione.

6.  Ogni tappa che tocca la grafica si chiude con gli screenshot automatici: `npm run shot` fotografa sei inquadrature fisse (partenza, Campo 1, Torchio e camion, Ufficio, zoom lontano, zoom vicino) e salva in `artifacts/report.json` disegni e triangoli di ciascuna, con la ripartizione per gruppo di oggetti. Lo stesso controllo gira su GitHub a ogni pull request (workflow `screenshots.yml`) e allega le immagini. Gli screenshot mostrano l'aspetto, non la fluidità: i fotogrammi al secondo si misurano solo sull'iMac, con il pannello debug.

**Le tappe.**

| Tappa                       | Contenuto                                                                                                                                        | Fatta quando                                                                                     |
|-----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| M0 · Fondamenta             | Progetto Vite + TypeScript + Three.js, pubblicazione su GitHub Pages, CLAUDE.md, scheletro del pannello debug                                    | Il link pubblico si apre in Chrome e mostra una scena 3D a 60 fps                                |
| M1 · Muoversi               | Terreno della valle, tastiera, clic per muoversi, zoom, personaggio, camera, collisioni                                                          | Il movimento è fluido; il clic porta il personaggio a destinazione; la camera segue senza scatti |
| M1b · Direzione visiva      | Modelli dai pacchetti CC0, stazioni da codice nello stesso stile, luce e atmosfera, terreno ed erba, bordi morbidi, bloom, proporzioni, oggetti trasparenti davanti al giocatore, inquadratura di partenza, budget dei triangoli | L'angolo capanna + Campo 1 sembra il gioco finito; meno di 60.000 triangoli lì; almeno 50 fps sull'iMac |
| M2 · Fase 1 a mano          | Campi, Torchio, camion con cassone, Scarti e Falò, pila, zone, contante, regalo di El Gordo, Rispetto, tappetini di sblocco, Raccoglitori con percorsi e sonno; informazione nel mondo, colori di marca e interfaccia del genere (sezioni 10 e 12) | Si gioca dal minuto 0 allo sblocco del Torchio 2, con i due Raccoglitori; gli screenshot passano la parte A della lista di controllo della skill arcade-idle |
| M2b · Rifondazione          | Mondo ricostruito da zero secondo la skill arcade-idle (Fase 6): lotti recintati che si allargano, arco PATRÓN, sagome degli sblocchi con la festa, camion che arriva sulla strada, mazzette sulla schiena, camera a 19 m, sequenza del primo minuto | Gli screenshot superano la lista di controllo e le regole PS1–PS20; si gioca dal minuto 0 al Torchio 2 senza aiuto |
| M2c · Storia e spazio       | Storia nel GDD, Torchio che si spiega, schermata iniziale; poi il mondo della prima sessione rifatto dopo la revisione del 30 ottobre 2026 (voto 3,2/10): lotto da 18 × 24 m, camera a 25 m di altezza inquadrata, presa e consegna sulla macchina, soldi non addosso, merce più larga del corpo, regalo a cubo, Ufficio con Zaino, Scarpe e Guadagno, effetti sonori | Ogni voce passa una revisione indipendente con le skill `arcade-idle` e `ux-ui-arcade-idle` con media ≥ 7 e nessuna area sotto 6; Luca la prova sull'iMac |
| M3 · Ufficio e Cargador     | Cargador di El Gordo, le altre tre schede del pannello Ufficio (Stazioni, Squadra, Polizia) con i loro potenziamenti, lavoratori extra dall'Ufficio, spinte nel mondo                                  | La Fase 1 gira da sola; i potenziamenti cambiano i numeri come in tabella                        |
| M4 · Fase 2                 | Laboratorio (con Rispetto 4), Corriere A, barra del Calore, Purezza, ordini speciali e spinta ×2                                                 | Il Calore sale e scende come da sezione 7; un ordine si completa, paga doppio e dà 60 s di velocità doppia |
| M5 · Fase 3                 | Banco, Plaza (con Rispetto 5), clienti e Fama, spacciatore, Corriere B, Quota, posti di blocco, perquisizioni, retate, rivale, Guardia, capi squadra, finale Beta | Tutta la sequenza degli sblocchi si completa con la modalità debug a tempo × 10; il test "produrre di più conviene sempre" è verde |
| M6 · Salvataggio e offline  | Salvataggio automatico, migrazioni, esporta e importa, guadagni offline                                                                          | Chiudi la scheda per 30 minuti: al ritorno il contante offline corrisponde al calcolo atteso     |
| M7 · Game feel e onboarding | Schermata iniziale (sezione 8), tutti gli effetti della sezione 10, audio, abiti del giocatore, sequenza della sezione 8, missioni (sezione 9)                         | Un amico che non ha mai visto il gioco arriva al primo raccoglitore senza aiuto                  |
| M8 · Bilanciamento          | Partite di prova, confronto con i minuti obiettivo della sezione 5, correzioni                                                                   | Nessun buco di più di 4 minuti tra sblocchi nella prima ora; nessuna fase "morta"                |

**Prompt di partenza** (da incollare in Claude Code alla prima sessione):

```
Stiamo costruendo PATRÓN, un gioco arcade idle 3D da giocare nel browser del computer.
Il documento di design completo è in docs/GDD.md: leggilo tutto prima di iniziare.
È la fonte di verità: se qualcosa nel codice contraddice il documento, vince il documento.
Se trovi un punto ambiguo o contraddittorio, fermati e chiedimi.

Stack: TypeScript, Vite, Three.js, Vitest, ZzFX. Niente altri framework.
Regole: logica in src/sim senza dipendenze da Three.js; tutti i numeri in
src/config/balance.ts; ogni tappa con test automatici dove ci sono calcoli.
Il mio computer è un iMac del 2015 con macOS Monterey: niente strumenti
che richiedono versioni più recenti di macOS.

Crea un file CLAUDE.md con queste regole e il riferimento a docs/GDD.md.
Poi proponimi un piano per la tappa M0 (sezione 15) e aspetta il mio via.
```

**Prompt per le tappe successive** (modello):

```
Passiamo alla tappa M2 della sezione 15 di docs/GDD.md.
Rileggi le sezioni 3, 4 e 5. Proponimi un piano, poi eseguilo.
Alla fine: test verdi, istruzioni per provarlo nel browser, elenco di cosa
non hai potuto verificare da solo.
```

## 16. Oltre la Beta

Le fasi successive si costruiscono solo se la Beta diverte: il criterio è che tu e i tuoi amici ci torniate da soli per almeno una settimana. L'ordine segue la filiera reale: dopo lo spaccio viene il problema di cosa fare con i soldi, poi l'esportazione, poi la fine dell'impero.

1.  **Fase 4 · Il Lavaggio.** Le vendite producono contante sporco, utile solo per Quota e piccoli potenziamenti. Gli sblocchi grandi chiedono denaro pulito, che si ottiene facendo passare il contante da attività di copertura (lavanderia, ristorante, concessionaria). Ogni copertura ripulisce al massimo una quantità al minuto proporzionata al suo giro d'affari credibile: per lavare di più la devi far crescere. Il Contabile è il lavoratore che la automatizza. È il tratto più originale del gioco.

2.  **Fase 5 · Le Rotte.** Una mappa con rotte da aprire (corrieri, camion, piccoli aerei, barche). Ogni spedizione ha un tempo di viaggio reale che continua offline, un rischio di sequestro che cresce con la grandezza del carico e con il Calore, e un forte moltiplicatore di prezzo all'arrivo. La scelta è tra molti carichi piccoli e sicuri o pochi carichi enormi.

3.  **Fase 6 · L'Impero e la Caduta.** Più valli, politici da comprare, cartelli rivali. Quando il Calore globale diventa insostenibile arriva la Caduta: arresto o fuga, e si ricomincia in un nuovo paese con un moltiplicatore di Reputazione. È il prestigio del genere idle, raccontato come succede nella realtà.

4.  **Lealtà e informatori.** Un lavoratore sottopagato in un'area calda può tradire: Calore che sale di colpo e una stazione che salta.

5.  **Amici online.** Una classifica sul Valore dell'impero e la possibilità di soffiare una rotta alla polizia per alzare il Calore di un amico. Richiede un piccolo server.

6.  **Pubblicazione.** Prima la versione per telefono (comandi touch, interfaccia verticale), poi l'eventuale app con Capacitor (serve un Xcode recente, sezione 2), revisione dei contenuti per le regole dell'App Store e scelta della monetizzazione. Da valutare solo se le partite tra amici lo giustificano.

## 17. Fonti

- [Homa Games – Arcade Idle: a new Hybridcasual genre](https://www.homagames.com/blog/arcade-idle-a-new-hybridcasual-genre-enters-the-game): camera, stile, retention del genere

- [MAF – Arcade Idle Explained](https://maf.ad/en/blog/arcade-idle-genre/): durata delle sessioni

- [Game Developer – The Math of Idle Games, Part I](https://www.gamedeveloper.com/design/the-math-of-idle-games-part-i): formule dei costi

- [Pocket Gamer.biz – The universal guide to retention](https://www.pocketgamer.biz/the-universal-guide-to-retention/): prima sessione e curva di difficoltà

- [Roblox Creator Hub – Onboarding](https://create.roblox.com/docs/production/game-design/onboarding): fine dell'onboarding

- [Bugnet – Game feel: why juice matters](https://bugnet.io/blog/game-feel-why-juice-matters-and-how-to-add-it) e [Wayline – The juice toolbox](https://www.wayline.io/learn/game-feel/1): game feel

- [Foreign Policy – Prime Numbers: Doped](https://foreignpolicy.com/articles/2009/10/19/prime_numbers_doped): crescita del prezzo lungo la filiera

- [OWC – iMac Retina 5K Late 2015](https://eshop.macsales.com/item/Apple/K1F7CXX21XXA/): macOS massimo supportato

- [Apple – Xcode support](https://developer.apple.com/support/xcode): compatibilità Xcode e macOS

- [Unity 6 – System requirements](https://docs.unity.com/en-us/engine/6000.0/manual/get-started/install-and-upgrade/getting-started-installing-unity/system-requirements): requisiti per iOS

- [Engadget – Apple backtracks on EU web apps](https://www.engadget.com/apple-backtracks-on-plans-to-get-rid-of-web-apps-on-iphones-in-the-eu-195232177.html): web app sulla Home in UE

- [Abratabia – iOS Safari gotchas for web games](https://abratabia.com/mobile-web-games/ios-safari-gotchas.php): schermo intero e archivi separati su iOS
