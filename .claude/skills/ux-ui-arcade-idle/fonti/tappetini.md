# Tappetini e zone a terra negli arcade idle "a pila" (2021–2026)

Nota di metodo, da leggere prima di tutto il resto.
- **Fonti web raggiunte:** pagine Unity Asset Store di due kit ("Arcade Idle Components", "HyperCasual – Arcade Idle Engine"): la descrizione arriva vuota, restano solo le parole chiave. Articoli di genere (Mind Studios, Homa, Udonis, GameAnalytics): nessuno parla dell'aspetto delle zone a terra. Ricerche Reddit e "wiki" di Monkey Mart: quasi solo pagine spam SEO, scartate.
- **Fonti non raggiungibili da questa sessione:** YouTube (pagine e miniature), App Store, Google Play e Poki rispondono 403 dal proxy. La ricerca immagini mostra le immagini a Luca, non a chi scrive queste note. **In questa sessione non è stato possibile guardare nessun fotogramma.**
- Le osservazioni "per gioco" vengono quindi dalle letture fotogramma per fotogramma già fatte nell'enciclopedia (`.claude/skills/arcade-idle/01-catalogo/giochi/*.md`, `06-prima-sessione/*.md`, `03-contenuto/misure-video.md`) e citano i video che quelle letture indicano. Le note non ripetono le regole dell'enciclopedia: le incrociano per rispondere a domande che lì restano aperte.
- Etichette: **[OSS]** osservato in un gioco con nome (fonte indicata), **[INF]** deduzione di chi scrive, **[MEM]** ricordo non verificato del genere, da controllare su video prima di trattarlo come fatto.

## 1. Forme, bordi, riempimenti, colori e icone per tipo di zona; le zone di ritiro e consegna esistono come tappetini?

### Takeaway
Nei giochi osservati l'unico tappetino vero e proprio, sempre presente, è quello di **sblocco/acquisto**. Ritiro e consegna avvengono **sulla stazione stessa**: la merce si impila sul bancone o sulla macchina e si prende o si lascia passandoci accanto. Le altre "zone" non sono quadrati colorati: o sono oggetti (mazzette sul bancone, cestino, scrivania dell'ufficio), o sono segni leggeri (cerchio tratteggiato, anello bianco, icona dipinta). Nessun gioco osservato usa una famiglia di quadrati monocromi distinti per colore.

### Cited Findings
- **Ritiro e consegna = la stazione.** Pizza Ready: si porta la pizza dal forno al bancone, le scatole vanno all'asporto, la spazzatura dei tavoli va nel cestino; le mazzette compaiono sul bancone e sui tavoli e si raccolgono passando — [LevelWinner](https://www.levelwinner.com/pizza-ready-guide-tips-tricks-strategies/) (riportato in `03-contenuto/fonti/supercent.md`). Il gesto di base nei tre giochi Supercent è "walk over a station to pick up or drop items as a stack" (stessa fonte, sintesi dell'enciclopedia).
- **Monkey Mart.** Le colture si raccolgono "stand by them", la merce si porta agli scaffali, alla cassa "stand there to collect payment" — [Poki](https://poki.com/en/g/monkey-mart) (riportato in `03-contenuto/fonti/negozi.md`). In nessuna lettura dei fotogrammi compare un tappetino di consegna davanti allo scaffale: il banco rosa ha l'insegna della banana e le banane sopra — [video Play-Games-Com](https://www.youtube.com/watch?v=yCmTVlLiub8), letto in `06-prima-sessione/monkey-mart.md`.
- **[OSS] Pile sul banco, non su un tappetino.** 5 giochi su 11 mostrano la merce come torri sui banchi e sulla schiena; il forno pieno di Pizza Ready tiene circa 5 pizze con la scritta MAX — `02-forma/oggetti-nel-mondo.md`, `03-contenuto/misure-video.md` ([video Nevaran](https://www.youtube.com/watch?v=gSEzesQ476Q)).
- **[OSS] Sblocco: famiglie di forma osservate.**
  - Pizza Ready: riquadro beige con l'icona dell'oggetto ("pizza" sul riquadro da 50 in cucina) e il prezzo. Il riquadro del bancone è **lungo**, cioè prende la forma dell'oggetto (100). Ci sono anche il riquadro "LEVEL 2" con lucchetto e il riquadro "NEW ZONE 100" sul bordo della sala — [video Nevaran](https://www.youtube.com/watch?v=gSEzesQ476Q), `06-prima-sessione/pizza-ready.md`.
  - Burger Please: "quadrotti a terra con icona dei soldi", prezzo scritto a terra ("180") — `01-catalogo/giochi/burger-please.md` (fonti in `03-contenuto/fonti/supercent.md`; [video Pryszard](https://www.youtube.com/watch?v=qIqoG3vNLns)).
  - My Mini Mart: "piazzole grigie ottagonali" con icona, "LEVEL 2" e prezzo (200). Gli oggetti futuri mostrano un'**impronta grigia** a terra o un **contorno a parentesi bianche agli angoli**, con un fumetto banconota + prezzo ("10", "75") — `01-catalogo/giochi/my-mini-mart.md`, `06-prima-sessione/my-mini-mart.md` ([video](https://www.youtube.com/watch?v=zsqcJ5B3rhA)).
  - Monkey Mart: riquadro a parentesi bianche con il prezzo "10" e una freccia verde. Le zolle ancora da comprare sono **sagome** dell'oggetto — `06-prima-sessione/monkey-mart.md`.
  - Outlets Rush: piastrella con lucchetto e prezzo. Prison Life: lucchetto con "LEVEL n" sulle zone grandi — `02-forma/oggetti-nel-mondo.md`, `03-contenuto/misure-video.md`.
  - Farm Land: i lotti si comprano automaticamente stando accanto — [LadiesGamers](https://ladiesgamers.com/farm-land-review/).
- **[OSS] Posto del lavoratore.** Burger Please: "cerchio verde tratteggiato dove deve stare un lavoratore" — `01-catalogo/giochi/burger-please.md`. È l'unico segno tratteggiato non di sblocco trovato nel catalogo.
- **[OSS] Assunzione e potenziamento.** Pizza Ready e Burger Please: uffici fisici ("HR", "UPGRADE"), dove si va a piedi e che si comprano a loro volta con un riquadro (Burger Please: ufficio del personale con velocità 250, capacità 250 e prima assunzione gratis) — `03-contenuto/misure-video.md`. My Mini Mart: si assume con un pulsante "Add" e prezzo, non con un tappetino — `02-forma/interfaccia.md`. Farm Land: il granaio offre 4 potenziamenti (3 assunzioni e 1 potenziamento del granaio) — [LevelWinner](https://www.levelwinner.com/farm-land-farming-life-game-guide-tips-cheats-strategies/).
- **[OSS] Spazzatura.** È un **oggetto**, non un tappetino: cestino rosso in Pizza Ready (`06-prima-sessione/pizza-ready.md`). In My Mini Mart il cestino è la nona stazione sbloccata — [WNHub](https://wnhub.io/news/game-design/item-40717) — e serve a buttare la merce in eccesso — [Gamezebo](https://www.gamezebo.com/2022/01/25/my-mini-mart-strategy-guide-stock-the-shelves-with-these-hints-tips-and-cheats/).
- **[OSS] Soldi.** Mattonelle di banconote 2×3 (Pizza Ready), blocchi 3×3 alti tre strati (Burger Please), mattonelle verdi (My Mini Mart), montagne di banconote (Monkey Mart). Il "tappetino dei soldi" è la pila stessa, accanto alla cassa — `02-forma/oggetti-nel-mondo.md`. Regola RF9: le banconote sono l'unico verde brillante della scena (6/11) — `04-sintesi/regole-forma.md`.
- **[OSS] Segni dipinti.** Prison Life ha percorsi e icone dipinti a terra in ogni zona; Farm Land ha anelli bianchi a terra — `02-forma/oggetti-nel-mondo.md`, `01-catalogo/giochi/prison-life.md`.

### Inferences
- [INF] Lo schema verde/giallo/blu di PATRÓN non ha un precedente nel genere. In più va contro due regole già scritte: **RF9** (il verde è dei soldi, un tappetino verde di ritiro lo ruba) e la sezione sui colori di marca del GDD (il giallo #FFC94A è colore di marca e della freccia guida, quindi un tappetino giallo di consegna si confonde con la guida). Il tappetino blu dei soldi contraddice il codice "soldi = verde" che il giocatore ha già imparato.
- [INF] Il vocabolario osservato si riduce a **quattro segni**, ognuno legato a un significato:
  1. **contorno bianco a parentesi o tratteggiato + icona + prezzo** = "qui si compra qualcosa" (sblocco, assunzione, nuova zona);
  2. **impronta o sagoma grigia** dell'oggetto futuro = "qui verrà questo";
  3. **cerchio tratteggiato colorato** = "qui sta una persona" (lavoratore);
  4. **l'oggetto stesso** (banco con la pila, mazzette, cestino, scrivania) = "qui si interagisce".
  Il colore pieno di un tappetino non porta significato in nessun gioco osservato: lo portano l'icona e il contorno.
- [INF] Per PATRÓN, dove il GDD vuole tappetini di consegna e ritiro (sezione 12: merce in entrata dal lato del tappetino di consegna, prodotto dal lato del ritiro), la versione più vicina al genere è questa: il tappetino è **solo un contorno** a filo del bordo della stazione, con l'icona della merce dentro (entrata: icona della materia + freccia verso la macchina; uscita: icona del prodotto + freccia verso fuori). Il "contenuto" lo dicono la pila sul ripiano e il contatore n/max sopra la stazione, non il colore del tappetino.
- [INF] Contante: niente tappetino blu. Bastano le mazzette 2×3 che crescono su una base bassa e neutra (o direttamente sul bancone), coerenti con PS15.
- [MEM] Nei giochi Supercent i riquadri di sblocco hanno, a ricordo, un fondo scuro semitrasparente o chiaro con bordo bianco arrotondato, l'icona al centro e sotto il prezzo con l'icona della banconota; pagando, il fondo si riempie di un colore pieno. Non verificato in questa sessione.

### Gaps
- Non è stato possibile verificare sui fotogrammi lo stile esatto del riempimento dei riquadri Supercent (radiale, dal basso, a colore pieno), né se gli uffici HR/UPGRADE abbiano un tappetino davanti alla scrivania o si attivino entrando nella stanza.
- My Perfect Hotel: il catalogo registra solo "icone tonde blu, punti esclamativi". Non ci sono dati sulle zone a terra. Kebab e coffee shop: nessuna fonte affidabile trovata.

## 2. Dimensioni rispetto al personaggio e alla stazione; posizione

### Takeaway
Non esistono misure pubblicate. Dai fotogrammi letti si ricava che il riquadro di sblocco **prende l'impronta dell'oggetto che sblocca** (lungo per il bancone, un lotto intero per una zona nuova) invece di avere una misura fissa, e sta **dove l'oggetto comparirà**, non accanto.

### Cited Findings
- [OSS] Pizza Ready: il riquadro del bancone è "lungo" (100); "NEW ZONE 100" sta sul bordo della sala dove si aprirà la zona; il riquadro "25" sta "dove andrà la porta" — `06-prima-sessione/pizza-ready.md` ([video](https://www.youtube.com/watch?v=gSEzesQ476Q)).
- [OSS] My Mini Mart: sagome di aiuola e campo a griglia grandi quanto l'oggetto; gli scaffali futuri mostrano le loro "ombre grigie" a terra prima dell'acquisto — `06-prima-sessione/my-mini-mart.md`.
- [OSS] Monkey Mart: la pianta di banane occupa tre zolle; le due non comprate sono sagome al loro posto — `06-prima-sessione/monkey-mart.md`.
- [OSS] Scala della scena: personaggio alto 1/12–1/7 dello schermo; 10–12 m di mondo in larghezza — regola PS18, `06-prima-sessione/regole.md`.

### Inferences
- [INF] Con un personaggio largo circa 0,5–0,6 m (larghezza delle spalle di un modello stilizzato alto circa 1,6–1,8 m), un tappetino da 1,5 m misura circa **2,5–3 larghezze del personaggio**. È un valore compatibile con i riquadri singoli visti nelle schermate; i riquadri a impronta sono più grandi.
- [INF] Proposta per PATRÓN:
  - sblocco e assunzione: 1,4–1,6 m, o l'impronta dell'oggetto se è più grande;
  - consegna e ritiro: larghi quanto il lato della stazione che servono, profondi 0,8–1,0 m, **a contatto** con il bordo (distanza 0–0,1 m), così la freccia del flusso attraversa la macchina;
  - zona del lavoratore: cerchio di 0,9–1,0 m.
- [INF] Il raggio d'attivazione attuale (1,2 m) è più grande del mezzo lato del tappetino (0,75 m): il gioco si attiva fuori dal disegno. Nel genere l'aspettativa è "sono sopra il disegno → succede". Conviene che l'area d'attivazione coincida con il disegno o sia un po' più piccola (circa 0,6–0,7 m dal centro per un tappetino da 1,5 m). Per le stazioni, dove il gesto è "passarci accanto", conviene un'area un po' più larga del tappetino solo verso l'esterno.
- [INF] Su schermo a 1080p con circa 11 m di mondo in larghezza (PS18), 1 m vale circa 175 px orizzontali; un tappetino da 1,5 m occupa circa 260 px di larghezza (meno in profondità per la camera a 50–55°). L'icona dentro dovrebbe stare intorno al 45–55% del lato (circa 120–140 px), il prezzo a un'altezza del testo di circa 40–50 px: leggibile senza zoom. Sono calcoli di proporzione, non misure del genere.

### Gaps
- Nessun video misurato in metri. Le proporzioni personaggio/riquadro vanno ricavate da un fotogramma (es. Pizza Ready 0:15, riquadro del tavolo da 5) contando i pixel. In questa sessione non è stato possibile.

## 3. Risposta quando ci si sale sopra: animazione, avanzamento, durata, suono

### Takeaway
L'unico comportamento osservato con certezza è quello dello sblocco: stando fermi sul riquadro, i soldi volano **a pezzi dal personaggio al riquadro** e il prezzo scende fino a zero. Allo zero l'oggetto compare con una festa (camera che si avvicina, stelle gialle, coriandoli). Ritiro e consegna sono continui: un oggetto alla volta vola in arco tra pila e banco, senza barra d'avanzamento.

### Cited Findings
- [OSS] Pizza Ready: "sul riquadro i soldi volano dal personaggio al riquadro"; la porta compare circa 2 s dopo (da 0:04 a 0:06); poi la camera si avvicina, stelle gialle, coriandoli e fumetto con la faccina dai soldi negli occhi; la camera torna sul personaggio a 0:12 — `06-prima-sessione/pizza-ready.md` ([video](https://www.youtube.com/watch?v=gSEzesQ476Q)). La celebrazione dura quindi circa 6 s, compreso il ritorno della camera.
- [OSS] Pizza Ready: camminando sulla pila di banconote i soldi volano nel contatore (0 → 13 → 169 in circa 2 s) — stessa fonte.
- [OSS] "Upgrade boxes: you stand on one and cash unloads into that section" — [LevelWinner](https://www.levelwinner.com/pizza-ready-guide-tips-tricks-strategies/).
- [OSS] Farm Land: lotti comprati "automatically by standing next to them" — [LadiesGamers](https://ladiesgamers.com/farm-land-review/).
- I kit Unity del genere elencano fra le parole chiave "progress bar" e "trigger" ([Arcade Idle Components](https://assetstore.unity.com/packages/templates/packs/arcade-idle-components-248852)), ma la descrizione non è leggibile: nessun dato sul comportamento.

### Inferences
- [INF] Il tempo totale di pagamento sembra **limitato** e non proporzionale al prezzo: un riquadro da 100 con 100 in tasca si chiude in circa 2 s nel video, lo stesso ordine di uno da 25. Proposta: durata del versamento = min(prezzo / ritmo, 1,5–2,5 s), con il ritmo che accelera mentre si resta sopra.
- [INF] Sequenza consigliata per tutti i tappetini "a pagamento" (sblocco, assunzione, potenziamento), che estende l'anello già piaciuto:
  1. **ingresso**: il tappetino si solleva o rimbalza (scala circa 1 → 1,08 → 1 in circa 0,15 s), il contorno da tratteggiato diventa pieno o più luminoso;
  2. **attesa breve** di circa 0,2–0,3 s prima di prendere soldi, per non pagare per sbaglio passando;
  3. **versamento**: banconote in arco dal personaggio al centro, prezzo che scende, anello o riempimento che sale; un suono breve per banconota con l'altezza che sale;
  4. **uscita a metà**: il pagato resta (avanzamento salvato), l'anello resta a metà;
  5. **completamento**: il tappetino sparisce sotto l'oggetto che compare con il rimbalzo e la festa (PS13).
- [INF] Consegna e ritiro: nessuna barra. Il ritmo lo dà il volo degli oggetti, uno ogni circa 0,05–0,15 s, con un "pop" per oggetto. Una barra d'attesa su un gesto continuo rallenta e non è nel genere.

### Gaps
- Velocità reale del versamento (banconote al secondo), durata dell'animazione di comparsa e suono non misurati: serve un video con l'audio letto al decimo di secondo. Nessuna fonte testuale li riporta.

## 4. Come mostrano contenuto e stato

### Takeaway
Lo stato sta **sopra la stazione o nel mondo**, non dentro il tappetino. Si usano il contatore "n/max", la scritta **MAX** rossa a stazione piena, il fumetto tondo con icona e numero, l'altezza della pila, e il prezzo scritto sul riquadro di sblocco. Lo stato "non ancora disponibile" si dice con il lucchetto e "LEVEL n".

### Cited Findings
- [OSS] Contatori n/max sopra scaffali e recinti in My Mini Mart (0/2, 0/4, 5/8), Monkey Mart (1/4, 2/4), Prison Life (celle 3/4); MAX in Burger Please (rosso, corsivo, sopra la macchina piena), My Mini Mart e Monkey Mart; Pizza Ready mette MAX rosso sopra la testa a pila piena — `02-forma/oggetti-nel-mondo.md`, `06-prima-sessione/pizza-ready.md`.
- [OSS] Lucchetto + "LEVEL 2" (Pizza Ready, My Mini Mart), "LEVEL n" (Prison Life): la zona si vede ma non si compra finché non si ha il livello — `03-contenuto/misure-video.md`, `01-catalogo/giochi/my-mini-mart.md`.
- [OSS] Fumetti "No Seat!" (Pizza Ready) e "No Bed" (Prison Life) come segnale di collo di bottiglia — `03-contenuto/misure-video.md`.

### Inferences
- [INF] Per i tappetini di PATRÓN: sul tappetino di **sblocco** restano icona, prezzo e anello. Sui tappetini di **consegna e ritiro** solo l'icona della merce (statica). Il numero "n/max" va **sopra la stazione**, all'altezza degli occhi della camera: un numero disegnato a terra sotto i piedi del personaggio è coperto proprio quando ci si sta sopra.
- [INF] Stato "pieno": il contorno del tappetino di consegna diventa rosso o grigio e compare MAX sopra la stazione; stato "vuoto, serve merce": l'icona pulsa piano (scala 1 → 1,05, periodo circa 1 s).

### Gaps
- Non verificato se nei giochi Supercent il riquadro di sblocco mostri il prezzo **residuo** durante il pagamento (scende) o il totale con una barra. Il video di Pizza Ready dice "finché il prezzo scende a zero" (PS16), quindi almeno lì scende.

## 5. Errori comuni nei cloni

### Takeaway
Nessuna fonte affidabile elenca gli errori dei cloni sulle zone a terra (le ricerche hanno dato solo spam SEO). Gli errori si possono però dedurre confrontando le regole dell'enciclopedia con lo stato attuale di PATRÓN.

### Cited Findings
- Le guide di genere insistono solo in generale: il gioco va capito "within seconds", "Arcade Idle should not [be complex]" — [Homa](https://www.homagames.com/blog/arcade-idle-a-new-hybridcasual-genre-enters-the-game); "simplicity should always be at the core" — [GameAnalytics](https://www.gameanalytics.com/blog/arcade-idle-homajam-a-winning-theme). Colori vivi distinguono aree e oggetti semplificati — [Mind Studios](https://games.themindstudios.com/post/how-to-make-arcade-idle-game/).

### Inferences
- [INF] **Codice a colori senza icona**: il giocatore deve imparare una legenda (verde = prendi, giallo = lascia). Nel genere il significato lo dicono icona e posizione.
- [INF] **Colori che rubano i segni del genere**: verde (soldi, RF9), giallo (freccia guida), rosso (MAX/pieno). Un tappetino deve usare un neutro (bianco, grigio caldo, beige) o i colori di marca a bassa saturazione.
- [INF] **Area d'attivazione diversa dal disegno** (oggi 1,2 m di raggio su 0,75 m di mezzo lato).
- [INF] **Tappetini scollegati dalla stazione**: messi a 1–2 m dal banco, non si capisce a quale macchina appartengono. Devono toccare la stazione.
- [INF] **Troppi tappetini insieme**: contraddice PS10 (uno sblocco visibile alla volta all'inizio). I tappetini di consegna e ritiro dovrebbero restare discreti (solo contorno) perché non competano con quello di sblocco, che deve essere l'unico "pieno" e brillante.
- [INF] **Piatti come adesivi**: senza spessore (circa 3–5 cm, con bordo smussato e ombra di contatto) a 50–55° di camera si leggono come texture del pavimento; il tappetino di sblocco piaciuto funziona anche perché ha più "oggetto".
- [INF] **Testo come frase sul tappetino**: RF17 vuole un'icona e un numero, mai frasi.
- [INF] **Z-fighting e sfarfallio** dei tappetini a filo del pavimento in Three.js: va sollevato di qualche millimetro o va usato polygonOffset. È un problema tecnico, non osservato nel genere.

### Gaps
- Nessuna analisi pubblica, post-mortem o discussione Reddit affidabile sugli errori di design delle zone nei cloni. I post-mortem pubblici del genere parlano di economia e monetizzazione, non di grafica delle zone.

## 6. Numeri concreti raccolti (riepilogo)

### Takeaway
I pochi numeri affidabili vengono tutti dalla lettura dei video già fatta nell'enciclopedia. Tutti gli altri numeri di queste note sono proposte derivate e vanno trattati come tali.

### Cited Findings
- Pizza Ready: pagamento del riquadro della porta e comparsa in circa 2 s; festa più ritorno della camera circa 6 s; raccolta di 169 soldi in circa 2 s — `06-prima-sessione/pizza-ready.md` ([video](https://www.youtube.com/watch?v=gSEzesQ476Q)).
- Prezzi dei primi riquadri: 5 / 50 / 100 / 100 (nuova zona) in Pizza Ready e Burger Please — `03-contenuto/misure-video.md`.
- Personaggio alto 1/12–1/7 dello schermo, 10–12 m di mondo visibili — `06-prima-sessione/regole.md`.

### Inferences
- [INF] Tabella proposta per PATRÓN, da far passare dal GDD:

| Tipo | Forma | Bordo | Fondo | Icona e testo | Misura | Attivazione |
| --- | --- | --- | --- | --- | --- | --- |
| Sblocco / nuova zona | quadrato arrotondato o impronta dell'oggetto | bianco tratteggiato | colore pieno (arancio attuale), spessore 4 cm | icona dell'oggetto + banconota e prezzo; anello | 1,5 m o impronta | 0,25 s di attesa, versamento ≤ 2 s |
| Assunzione | come lo sblocco | bianco tratteggiato | colore del ruolo del lavoratore (RF8) | sagoma del lavoratore + prezzo | 1,5 m | come lo sblocco |
| Potenziamento / ufficio | come lo sblocco | bianco pieno | colore di marca | freccia in su o icona della scrivania | 1,5 m | apre il pannello entrando, lo chiude uscendo |
| Consegna alla stazione | rettangolo attaccato al lato d'ingresso | bianco, solo contorno | trasparente o neutro al 20–30% | icona della materia + freccia verso la macchina | lato stazione × 0,9 m | continua, un oggetto ogni 0,1 s |
| Ritiro dalla stazione | rettangolo attaccato al lato d'uscita | bianco, solo contorno | trasparente o neutro al 20–30% | icona del prodotto + freccia verso fuori | lato stazione × 0,9 m | continua |
| Contante | nessun tappetino o base bassa neutra | — | — | sono le mazzette 2×3 che crescono | — | passando sopra |
| Posto del lavoratore | cerchio | colorato, tratteggiato | nessuno | — | Ø 1 m | — |
| Scarti / cestino | l'oggetto cestino | — | — | — | — | passandoci accanto |

### Gaps
- Tutti i tempi e le misure dell'ultima colonna, salvo i 2 s del pagamento in Pizza Ready, sono proposte non osservate. Per confermarli serve leggere i fotogrammi di uno sblocco in Pizza Ready o Burger Please al decimo di secondo, con l'audio, da una macchina che possa aprire YouTube.
