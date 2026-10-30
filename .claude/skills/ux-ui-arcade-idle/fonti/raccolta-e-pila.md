# Raccolta, trasporto e consegna della merce: la pila del personaggio negli arcade idle (2021–2026)

Nota di metodo, da leggere prima di tutto il resto.
- Il web pubblico ha pochissimo materiale testuale su come è fatta la pila: le analisi di settore (Udonis, Arpu Brothers, Mind Studios, MAF) dicono che lo stacking è "soddisfacente" e "vendibile", ma non danno né posizioni né tempi. Le pagine degli asset Unity "arcade idle" trovate non hanno descrizione tecnica. I repository GitHub non si potevano cercare da questa sessione (ricerca bloccata).
- Le osservazioni sui giochi vengono quindi soprattutto dall'enciclopedia locale `.claude/skills/arcade-idle/` (schermate degli store e video di partita già misurati). Nelle note sotto: **[osservato]** = visto nei giochi (schermate/video, citato), **[dedotto]** = ragionamento mio, con calcoli espliciti. Nessun numero di durata delle animazioni (volo in arco, sfasamento, oscillazione) è stato trovato in fonti affidabili: dove ne propongo uno è marcato [dedotto] ed è un valore di partenza da tarare, non un dato del genere.
- Conflitto da segnalare: la regola PS14 dell'enciclopedia dice "merce davanti al personaggio", ma le schede del catalogo di Burger Please, Monkey Mart e My Mini Mart descrivono "torri sulla schiena". Va risolto guardando i video (vedi Gaps della prima domanda).

## 1. Dove sta la pila, quanto è alta, e come si evita che il corpo la nasconda

### Takeaway
Nel genere la pila è una colonna verticale attaccata al personaggio (davanti o sulla schiena, le fonti locali non concordano) che cresce **sopra la testa**: a capacità avanzata è più alta del personaggio, e questo da solo la rende leggibile da ogni direzione. La pila di PATRÓN (4 oggetti davanti al petto) è troppo bassa e troppo vicina al corpo per la camera a 50°: con il personaggio di spalle alla camera la geometria nasconde quasi tutta la pila, quindi il "bug" è un problema di proporzioni, non un errore di codice.

### Cited Findings
- [osservato] Pizza Ready, 0:42 del video: il personaggio "porta 1 pizza davanti a sé; sopra la testa MAX rosso" — [pizza-ready.md, enciclopedia locale](/home/claude/patron/.claude/skills/arcade-idle/06-prima-sessione/pizza-ready.md)
- [osservato] Regola PS14, comune a Pizza Ready, Monkey Mart, My Mini Mart: "La merce si porta davanti al personaggio, in una torre che cresce verso l'alto; a pila piena MAX rosso sopra la testa" — [regole.md](/home/claude/patron/.claude/skills/arcade-idle/06-prima-sessione/regole.md)
- [osservato, in conflitto con la riga sopra] Burger Please: "torri di hamburger sulla schiena e sui banchi", "pila verticale sulla schiena" — [scheda burger-please.md](/home/claude/patron/.claude/skills/arcade-idle/01-catalogo/giochi/burger-please.md); Monkey Mart: "torri di banane sulla schiena" — [scheda monkey-mart.md](/home/claude/patron/.claude/skills/arcade-idle/01-catalogo/giochi/monkey-mart.md); My Mini Mart: "pila sulla schiena" — [scheda my-mini-mart.md](/home/claude/patron/.claude/skills/arcade-idle/01-catalogo/giochi/my-mini-mart.md); Dreamdale e My Little Universe: "zaino" — [schede del catalogo](/home/claude/patron/.claude/skills/arcade-idle/01-catalogo/giochi/)
- [osservato] Burger Please: "a potenziamenti avanzati la pila del giocatore diventa una colonna più alta di lui"; i lavoratori portano 4–5 hamburger — [misure-video.md](/home/claude/patron/.claude/skills/arcade-idle/03-contenuto/misure-video.md)
- [osservato] Pizza Ready: pila da 1 all'inizio, circa 3 pizze a 20 minuti di gioco — [misure-video.md](/home/claude/patron/.claude/skills/arcade-idle/03-contenuto/misure-video.md)
- [osservato] Burger Please: all'inizio "I can take two at the beginning"; potenziamento della capacità con soldi, gemme o pubblicità; skin che aumentano gli hamburger portati; potenziamento temporaneo "Move Speed x2 and Capacity x2" per 3 minuti — [Arpu Brothers, decostruzione di Burger Please](https://arpubrothers.com/blog/burger-please-deconstruction-of-the-game/)
- [osservato] Il personaggio è piccolo (1/12–1/7 dello schermo) con camera vicinissima (10–12 m di mondo in larghezza) — [regole.md, PS18](/home/claude/patron/.claude/skills/arcade-idle/06-prima-sessione/regole.md); sagoma leggibile anche a 1/15 dello schermo — [personaggi.md](/home/claude/patron/.claude/skills/arcade-idle/02-forma/personaggi.md)
- [osservato] Lo stacking è una meccanica scelta anche perché "looks cool, which makes it marketable": è il soggetto delle pubblicità di My Mini Mart e Burger Please — [Udonis, Arcade Idle](https://www.blog.udonis.co/mobile-marketing/mobile-games/arcade-idle). Conseguenza: la pila deve essere sempre in vista, perché è anche la vetrina del gioco.

### Inferences
- [dedotto] **Perché la pila "sparisce" in PATRÓN: il calcolo.** Con pitch 50° il raggio che va da un oggetto verso la camera sale di tan(50°) ≈ 1,19 m per ogni metro in orizzontale. Se il personaggio dà le spalle alla camera, un oggetto tenuto a distanza d davanti al centro del corpo (raggio del corpo r) è visibile solo se la sua altezza y soddisfa: **y + 1,19·(d − r) > H**, dove H è l'altezza del corpo in quel punto (spalle e testa). Esempio con H = 1,6 m, r = 0,25 m e d = 0,45 m: serve y > 1,36 m. Una pila che parte dal petto (circa 1,0 m) con 4 oggetti da circa 0,15 m arriva a 1,6 m: da dietro si vedono solo 1–2 oggetti in cima, e con 1–2 oggetti in mano non si vede niente. Torna esattamente con il difetto segnalato ("compare solo da certe angolazioni"). La camera ruotata di 45° non cambia la cosa: cambia solo quale tasto porta il personaggio di spalle. Il FOV di 22° (quasi ortografico) rende il ragionamento valido in tutto lo schermo.
- [dedotto] Vale lo stesso, al contrario, per le mazzette sulla schiena: quando il personaggio corre verso la camera, il corpo copre la parte bassa del pacco. Le mazzette restano visibili solo se superano la testa.
- [dedotto] **Come il genere evita il problema** (dalle proporzioni osservate, non da documentazione): (a) la torre cresce in verticale e a capacità media supera la testa, quindi la cima si vede sempre; (b) gli oggetti sono grandi rispetto al personaggio (scatole e vassoi larghi quanto le spalle), quindi la torre sporge anche ai lati del corpo; (c) personaggio piccolo e camera vicina. Non ho trovato prove che i giochi ruotino il personaggio verso la camera o spostino la pila in base alla direzione.
- [dedotto] **Specifica proposta per PATRÓN** (valori da tarare con `npm run shot` dalle 8 direzioni):
  1. Base della pila all'altezza delle mani (circa 0,55·H) e **almeno 0,55–0,6 m davanti al centro**, ben fuori dalla sagoma del corpo, non appoggiata al petto.
  2. Oggetti grandi: larghi 0,8–1,0 volte le spalle, alti 0,22–0,3 m. Con 4 oggetti da 0,25 m e base a 0,9 m la cima arriva a 1,9 m, sopra la testa: da dietro, con d = 0,6 m, la soglia è y > 1,6 − 1,19·0,35 ≈ 1,18 m, quindi restano visibili 3 oggetti su 4 invece di 1.
  3. Se la capacità resta 4, applicare il "terzo oggetto sopra la testa": con 3 o più oggetti la cima deve superare H. Se non basta, alzare l'intera pila con la capienza, in modo che anche 1 oggetto stia ad almeno 1,2 m.
  4. Criterio di verifica: nelle 8 direzioni di corsa, almeno la cima della pila (≥ 50% dell'oggetto più alto) è visibile in ogni screenshot, anche con 1 solo oggetto. Il caso peggiore è il personaggio di spalle alla camera.
  5. Alternativa più robusta, ma da decidere nel GDD: pila sulla schiena, che sporge sopra la testa (come le schede di Burger Please e Monkey Mart). Ha lo stesso problema in direzione opposta, quindi richiede comunque che la colonna superi la testa.
- [dedotto] Le mani e le braccia devono essere "in posa trasporto" (avanti, sotto la base della pila). Altrimenti la pila sembra galleggiare: è il difetto classico dei cloni.

### Gaps
- Non ho trovato fonti che dicano se in Burger Please, Monkey Mart e My Mini Mart la pila sta davanti (con le braccia) o sulla schiena: l'enciclopedia locale si contraddice (PS14 contro le schede del catalogo). Va verificato fermando un video di gioco in 3 fotogrammi: personaggio di fronte, di lato e di spalle.
- Il pitch esatto della camera di Pizza Ready e Burger Please non è pubblicato.
- Non ho trovato prove di trucchi come "pila sempre rivolta alla camera" o "la pila si stacca dal corpo".

## 2. Come si portano i soldi

### Takeaway
Nei tre giochi guardati con più cura (Pizza Ready, Monkey Mart, My Mini Mart) i soldi **non si portano addosso**: le mazzette si impilano accanto alla cassa, si raccolgono passandoci sopra e volano nel contatore in alto. Quando si paga uno sblocco volano dal personaggio al riquadro un pezzo alla volta. Lo zaino di mazzette sulla schiena di PATRÓN non ha riscontro nelle fonti trovate e aggiunge il secondo problema di visibilità.

### Cited Findings
- [osservato] PS15: "I clienti pagano al bancone: le mazzette si impilano accanto alla cassa e si raccolgono passandoci; volano nel contatore in alto" (Pizza Ready, Monkey Mart, My Mini Mart) — [regole.md](/home/claude/patron/.claude/skills/arcade-idle/06-prima-sessione/regole.md)
- [osservato] PS16: pagando uno sblocco "i soldi volano dal personaggio al riquadro, a pezzi, finché il prezzo scende a zero" (Pizza Ready) — [regole.md](/home/claude/patron/.claude/skills/arcade-idle/06-prima-sessione/regole.md)
- [osservato] Pizza Ready 0:02: camminando sulla pila di banconote, il contatore sale da 0 a 13 a 169 — [pizza-ready.md](/home/claude/patron/.claude/skills/arcade-idle/06-prima-sessione/pizza-ready.md)
- [osservato] Burger Please: blocchi di banconote verdi 3×3 alti tre strati sui banchi, "pile di soldi" — [scheda burger-please.md](/home/claude/patron/.claude/skills/arcade-idle/01-catalogo/giochi/burger-please.md). Il locale ha un tetto di contanti accumulabili ("Max Storage, the cash capacity in the establishment") che si alza con i livelli — [Arpu Brothers](https://arpubrothers.com/blog/burger-please-deconstruction-of-the-game/)
- [osservato] Monkey Mart: "montagne di banconote verdi" nel mondo — [scheda monkey-mart.md](/home/claude/patron/.claude/skills/arcade-idle/01-catalogo/giochi/monkey-mart.md); My Mini Mart: "mattonelle di soldi verdi" — [scheda my-mini-mart.md](/home/claude/patron/.claude/skills/arcade-idle/01-catalogo/giochi/my-mini-mart.md)
- [osservato] Mind Studios avverte di tarare l'accumulo per non generare fastidio ("Your store is full of cash") — [Mind Studios](https://games.themindstudios.com/post/how-to-make-arcade-idle-game/)

### Inferences
- [dedotto] Nel genere i soldi si mostrano come **mucchio nel mondo** (vicino alla cassa, che cresce e invoglia a passare) e come **numero nell'interfaccia**, mai come carico del personaggio. Il denaro portato non entra in conflitto con la pila della merce perché non esiste.
- [dedotto] Per PATRÓN le opzioni, in ordine di aderenza al genere: (A) togliere le mazzette dalla schiena: raccolta → le mazzette volano verso il personaggio e scompaiono nel contatore dell'interfaccia; pagamento → le mazzette escono dal personaggio verso il riquadro (già fatto). (B) Se il tema narco richiede il "malloppo" addosso, renderlo un solo oggetto (borsone) che cresce di scala a scaglioni, sempre sopra la testa o sporgente lateralmente, non una colonna di 20 pezzi che compete con la merce. Qualsiasi modifica passa prima dal GDD.
- [dedotto] Una sola colonna addosso al personaggio è il limite di leggibilità: due colonne (davanti e dietro) garantiscono che da ogni direzione una delle due sia coperta.

### Gaps
- Non ho trovato come My Perfect Hotel e Prison Life mostrino i soldi raccolti (in mano o subito nel contatore).
- Non ho trovato velocità o numero di banconote "volanti" per secondo nella raccolta.

## 3. Animazione di raccolta e consegna: volo, sfasamento, oscillazione, MAX, suoni

### Takeaway
Fatti certi: il genere fa **volare** gli oggetti tra mondo e personaggio (scia di oggetti in My Mini Mart, soldi che volano nel contatore e verso il riquadro in Pizza Ready) e mostra **"MAX" rosso** sopra la testa o sopra la macchina piena. Non ho trovato fonti con durate, altezze d'arco, sfasamenti o oscillazioni misurati: i valori sotto sono proposte di partenza [dedotto]. Il teletrasporto attuale di PATRÓN è comunque fuori genere.

### Cited Findings
- [osservato] My Mini Mart: "scia di oggetti che volano verso il personaggio"; Dreamdale: "+1 che sale dal sasso"; 3/11 giochi mostrano un oggetto che vola dal mondo al personaggio o un numero che sale — [animazione.md](/home/claude/patron/.claude/skills/arcade-idle/02-forma/animazione.md)
- [osservato] MAX: rosso sopra la testa a pila piena (Pizza Ready, PS14); "scritta MAX rossa in corsivo sopra la macchina piena" (Burger Please); forno pieno con MAX a circa 5 pizze (Pizza Ready); MAX sulle pile in My Mini Mart; contatori "1/4" e "2/4" sopra i banchi in Monkey Mart, "0/2, 0/4, 5/8" in My Mini Mart — [regole.md](/home/claude/patron/.claude/skills/arcade-idle/06-prima-sessione/regole.md), [scheda burger-please.md](/home/claude/patron/.claude/skills/arcade-idle/01-catalogo/giochi/burger-please.md), [misure-video.md](/home/claude/patron/.claude/skills/arcade-idle/03-contenuto/misure-video.md), [schede monkey-mart.md e my-mini-mart.md](/home/claude/patron/.claude/skills/arcade-idle/01-catalogo/giochi/)
- [osservato] 11/11 giochi celebrano la quantità o il movimento della merce con almeno un effetto; 6/11 usano l'abbondanza (montagne, piogge, valanghe) — [animazione.md](/home/claude/patron/.claude/skills/arcade-idle/02-forma/animazione.md)
- [osservato] L'enciclopedia stessa segna come "da verificare con i video" la durata del passaggio di un oggetto e l'oscillazione delle pile in corsa — [animazione.md](/home/claude/patron/.claude/skills/arcade-idle/02-forma/animazione.md)
- [osservato, strumento] Nei template Unity il volo ad arco si fa di solito con DOTween `DOJump(destinazione, altezzaSalto, numeroSalti, durata)`, e le spinte elastiche con `DOPunchPosition` / `DOShakePosition` — [tutorial DOTween, Tencent GWB](https://gwb.tencent.com/community/detail/116456). La fonte descrive l'API, non i valori usati nei giochi.

### Inferences
- [dedotto] **Specifica di partenza per PATRÓN** (da tarare a occhio sui video del genere):
  - Volo sorgente → pila: arco parabolico verso lo **slot di destinazione mobile**, ricalcolato a ogni passo perché il personaggio si muove. Durata 0,20–0,30 s, altezza dell'arco 0,5–0,8 m sopra il più alto tra partenza e arrivo. Si parte già con l'intervallo di 0,08 s: con un volo di 0,25 s ci sono al massimo 3–4 oggetti in volo insieme, una "scia" leggibile.
  - Lo slot nella pila si **prenota** quando parte il volo: il conteggio logico in `src/sim/` sale subito, la parte grafica mostra l'oggetto in volo. Così logica e disegno restano separati, come chiede la regola del passo fisso.
  - Arrivo: piccolo rimbalzo di scala (1,0 → 1,15 → 1,0 in circa 0,12 s) sull'oggetto appena arrivato, "pop" sonoro con altezza crescente in proporzione al riempimento della pila.
  - Consegna: arco inverso dalla cima della pila (si toglie sempre l'oggetto più in alto) allo slot della stazione, con gli stessi tempi.
  - Oscillazione in corsa: ogni livello della pila segue quello sotto con un ritardo (molla o lerp), così la torre si piega leggermente all'indietro rispetto al moto, con un'inclinazione di pochi gradi che cresce con l'altezza, e torna dritta quando ci si ferma. Deve restare piccola: con 4 oggetti la cima non deve spostarsi più di circa 0,1 m, altrimenti entra nel corpo.
  - MAX: testo rosso sopra la testa, sopra la cima della pila (non coperto da essa), solo a pila piena e mentre si è in una zona di raccolta (oppure fisso finché la pila è piena). Opzionale: piccola scossa della pila e suono "pieno" una volta sola, non a ogni tentativo.
- [dedotto] I suoni devono essere brevi e a cadenza fissa (ZzFX): uno per oggetto preso, uno diverso per oggetto consegnato, il tintinnio della cassa per i soldi.

### Gaps
- Nessuna fonte con durata del volo, altezza dell'arco, sfasamento tra oggetti o ampiezza dell'oscillazione misurati su Pizza Ready, Burger Please, My Mini Mart o Monkey Mart. Serve una misura fotogramma per fotogramma su video a 60 fps (contare i fotogrammi tra la partenza e l'arrivo di un oggetto).
- Nessuna fonte sui suoni usati.

## 4. Velocità di trasferimento, movimento, pila piena e oggetti misti

### Takeaway
Fonti certe: la raccolta avviene **passando** sopra la zona (le analisi dicono "automatically collects resources it passes over") e la capacità è la leva più venduta del genere. Non ho trovato in fonti pubbliche la velocità di trasferimento in oggetti al secondo, né la regola sugli oggetti misti.

### Cited Findings
- [osservato] "The avatar moves around the map and automatically collects resources it passes over" — [Mind Studios](https://games.themindstudios.com/post/how-to-make-arcade-idle-game/)
- [osservato] Le mazzette "si raccolgono passandoci" — [regole.md, PS15](/home/claude/patron/.claude/skills/arcade-idle/06-prima-sessione/regole.md)
- [osservato] 8/11 giochi vendono o potenziano la capacità: è il numero più delicato da tarare. Monkey Mart: potenziamento "Pila" a 4 livelli, vale anche per il deposito delle macchine. Burger Please: pacchetto da 12,99 $ con capacità 2×. My Mini Mart: "Super Stack" a pagamento — [pila.md](/home/claude/patron/.claude/skills/arcade-idle/03-contenuto/pila.md), [scheda burger-please.md](/home/claude/patron/.claude/skills/arcade-idle/01-catalogo/giochi/burger-please.md)
- [osservato] Pizza Ready: si portano tre tipi di oggetto (pizza, scatola, spazzatura); "se si possano mescolare non è pubblicato" — [pila.md](/home/claude/patron/.claude/skills/arcade-idle/03-contenuto/pila.md)
- [osservato] Farm Land: a granaio pieno (100 per coltura) i lavoratori si fermano — [scheda farm-land.md](/home/claude/patron/.claude/skills/arcade-idle/01-catalogo/giochi/farm-land.md)

### Inferences
- [dedotto] Il trasferimento avviene **anche in movimento**, finché il personaggio è nella zona: è implicito in "passes over". Fermarsi non deve essere obbligatorio. Il 0,08 s di PATRÓN (12,5 oggetti/s) con 4 di capacità riempie la pila in 0,32 s: con la zona da 1,2 m e una corsa a circa 4–5 m/s il personaggio attraversa la zona in circa 0,3 s, quindi una passata di corsa basta a riempire la pila. È coerente con il genere, che punta sul "passa e prendi".
- [dedotto] A pila piena: il trasferimento si ferma senza errori, compare MAX, e l'oggetto resta alla sorgente (nessun oggetto perso o lasciato a mezz'aria).
- [dedotto] Oggetti misti: la regola più sicura per la leggibilità è **una pila, un tipo** (o tipi ordinati per strato), e la consegna toglie dall'alto solo gli oggetti che la stazione accetta. Se la stazione accetta solo un tipo che non è in cima, servirebbe pescare dal centro, che visivamente è confuso. Da decidere nel GDD.

### Gaps
- Velocità di trasferimento reale (oggetti/s) nei giochi Supercent, CrazyLabs e Poki: non trovata.
- Comportamento con oggetti misti in Pizza Ready (pizza più spazzatura nello stesso carico?): non pubblicato.

## 5. Difetti tipici dei cloni e come li evitano i giochi riusciti

### Takeaway
Non ho trovato thread o articoli pubblici che elenchino i difetti dei cloni amatoriali. L'elenco sotto è [dedotto] dalla geometria e dall'architettura (logica a passo fisso e disegno a fotogramma), con il criterio di verifica per ciascuno.

### Cited Findings
- [osservato] Le analisi del genere chiedono che le animazioni siano ottimizzate "for smooth, pleasant play" e che le risorse abbiano colori riconoscibili rispetto agli avatar ("avatars bright, resources more realistic shades") — [Mind Studios](https://games.themindstudios.com/post/how-to-make-arcade-idle-game/)
- [osservato] Farm Land ha punteggio di forma più basso anche per "risorse in pila poco visibili" — [scheda farm-land.md](/home/claude/patron/.claude/skills/arcade-idle/01-catalogo/giochi/farm-land.md). È l'unico caso del catalogo in cui la pila poco leggibile è annotata come difetto.

### Inferences
- [dedotto] Difetti e rimedi:
  1. **Pila dentro il corpo o nascosta** (il caso di PATRÓN): offset in avanti insufficiente e altezza sotto la testa. Rimedio: formula della sezione 1, test con 8 screenshot direzionali.
  2. **Pila che galleggia**: senza mani o braccia sotto la base, oppure con la base che non segue l'animazione della corsa. Rimedio: posa di trasporto e base agganciata al busto (con un leggero rimbalzo del passo).
  3. **Pila che scatta (jitter)**: posizione degli oggetti calcolata nel passo fisso a 30 Hz e disegnata senza interpolazione a 60+ fps. Rimedio: interpolare la posa della pila tra due passi, come il personaggio, oppure farla seguire il corpo solo nella parte grafica.
  4. **Oggetti che si teletrasportano** (il caso attuale di PATRÓN): nessun collegamento visivo tra sorgente e pila. Rimedio: volo ad arco verso lo slot mobile.
  5. **Oggetto consegnato nel posto sbagliato o sovrapposto**: il volo punta alla posizione dello slot quando parte, ma la pila del banco cambia nel frattempo. Rimedio: prenotare lo slot di arrivo quando parte il volo.
  6. **Pila che si piega troppo o si compenetra**: oscillazione libera senza limite. Rimedio: tetto all'inclinazione e smorzamento.
  7. **MAX coperto dalla pila**: testo ancorato alla testa mentre la pila è più alta. Rimedio: ancorare MAX sopra il punto più alto tra testa e cima della pila.
  8. **Due colonne addosso** (merce davanti e soldi dietro): una delle due è sempre coperta. Rimedio: soldi nell'interfaccia (sezione 2).

### Gaps
- Nessuna fonte pubblica (Reddit, forum Unity, devlog) trovata che documenti questi difetti nei cloni: l'elenco è ragionato, non osservato.
- Le pagine degli asset Unity "Arcade Idle Components" (Baranovsky, versione 1.1, maggio 2023, 6,99 $) non hanno descrizione tecnica: [Unity Asset Store](https://assetstore.unity.com/packages/templates/packs/arcade-idle-components-248852). Le pagine dei cloni a pagamento di Pizza Ready (Codester, SellMyApp) non si sono caricate o non avevano dettagli.
