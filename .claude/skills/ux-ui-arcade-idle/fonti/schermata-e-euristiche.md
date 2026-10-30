# Schermata iniziale e euristiche UX/UI per arcade idle (PATRÓN)

Note di ricerca, 30 ottobre 2026. Estendono la skill `arcade-idle` (PS1–PS3 in `06-prima-sessione/regole.md`, F8 in `02-forma/interfaccia.md`, lista di controllo in `04-sintesi/checklist.md`) senza ripeterla. Convenzione: **[F]** = fatto osservato o citato; **[R]** = raccomandazione/inferenza mia.

## A. Come i giochi del genere presentano la prima schermata, e specifica per PATRÓN

### Takeaway
Le piattaforme web (CrazyGames) impongono "in gioco subito, al massimo un clic"; i giochi del catalogo usano al massimo una schermata di caricamento con logo e personaggi (Monkey Mart), poi entrano direttamente nel lotto. Il clic iniziale serve comunque al browser per sbloccare l'audio: per PATRÓN conviene un solo "clic per giocare" sopra il mondo 3D vivo, che poi la camera attraversa fino al lotto di partenza.

### Cited Findings
**Regole delle piattaforme web**
- [F] CrazyGames (requisiti obbligatori, implementazione completa): "Games should land new users in gameplay immediately. If this is not feasible given the game specifics, a maximum of 1 click is allowed." — [CrazyGames, Gameplay requirements](https://docs.crazygames.com/requirements/gameplay/)
- [F] CrazyGames: link a community ammessi nel menu "as long as these are not a main CTA on the menu"; il gioco "must load quickly"; testi e immagini leggibili con `devicePixelRatio: 1` e a 821×462 (iframe desktop più piccolo) fino a 1920×1080; vietato un proprio pulsante schermo intero. — [CrazyGames, Gameplay requirements](https://docs.crazygames.com/requirements/gameplay/)
- [F] CrazyGames (linee guida di qualità, "non obbligatorie ma fortemente raccomandate"): "Provide a simple onboarding phase where new users land directly", "Implement the onboarding in gameplay", "Make the onboarding phase skippable", "Prioritize visuals and limit the use of text for onboarding", "Show the user how to control the game with a keyboard overlay or mouse gestures", "Buttons do not have delays to confuse users". — [CrazyGames, Quality guidelines](https://docs.crazygames.com/requirements/quality/)
- [F] Poki SDK: `gameLoadingFinished()` serve a "track the loading progress of your game and show your conversion to play"; `gameplayStart()` "Fires whenever the player starts interacting with the game"; ordine documentato: prima caricamento finito, poi gameplayStart. L'esempio HTML mette una pubblicità prima dell'avvio. La documentazione non dà regole di design su menu o pulsante Play. — [Poki SDK documentation](https://sdk.poki.com/sdk-documentation.html)
- [F] Poki (requisiti): "You should remove all splash screens and outgoing links from the game"; formato 16:9; giocabile anche su mobile/tablet. — [Poki requirements](https://sdk.poki.com/requirements.html)
- [F] Guida di terzi (non Poki ufficiale): download iniziale Poki "inferiore a 8 Mo"; il cruscotto Poki misura la "conversione in partite lanciate"; soglia citata da un sviluppatore: 25% dei giocatori oltre 3 minuti. — [Cinevva, guida Poki 2026](https://app.cinevva.com/fr/guides/publish-game-poki) (fonte secondaria)

**Audio nel browser**
- [F] "The Web Audio API has been covered by autoplay since Chrome 71"; un `AudioContext` creato prima di un gesto nasce "suspended" e va ripreso con `resume()` dentro un gestore di clic; per l'attivazione consigliano di usare "click" perché gli altri eventi non sono coerenti tra browser. — [Chrome, Autoplay policy](https://developer.chrome.com/blog/autoplay)

**Cosa fanno i giochi del catalogo** (osservazioni già nella skill, citate qui per collegarle)
- [F] Monkey Mart, 0:00: schermata di caricamento con il logo "MONKEY MART" su cartello di legno, le scimmie con i cappelli, banane, mazzette, cassa e barra gialla di caricamento; a 0:28 si è già nel lotto con "USE ARROWS TO MOVE". — `06-prima-sessione/monkey-mart.md` (skill locale)
- [F] Pizza Ready: il primo fotogramma è già gioco (locale vuoto, "Pick up money!"). — `06-prima-sessione/pizza-ready.md`
- [F] Voodoo: "Your player should understand what type of game and what to expect from the moment they start playing." — [Corentin Selz (Voodoo), GameAnalytics, agg. 2025](https://www.gameanalytics.com/blog/voodoo-guide-mobile-game-design-keep-things-simple)
- [F] Homa: "The player should directly understand the mechanics & purpose of the game" fin dai primi secondi; "Hyper casual games do not require a complex UI". — [Homa, Golden Rules](https://hubspot.academy.homagames.com/15-golden-rules-of-hyper-casual-games) (pagina senza data)

### Inferences
- [R] Il "clic per giocare" non è un menu: è l'unico clic che CrazyGames concede, ed è anche quello che serve all'audio. Quindi una sola schermata, un solo pulsante, nessuna scelta (niente impostazioni, crediti, nuova/continua come pulsanti principali).
- [R] **Tensione da risolvere nel GDD**: Luca vuole lo sfondo con il mondo già completo (l'impero da costruire); PS2 dice che il primo fotogramma di gioco mostra il contenitore vuoto. Le due cose stanno insieme se la schermata del titolo è la **promessa** (come la tavola di Monkey Mart con abbondanza di merce e soldi, e come le schermate dello store) e il primo fotogramma giocabile è il **lotto vuoto**. Il passaggio tra i due va reso esplicito: la camera parte dall'alto sull'impero completo e scende sul lotto piccolo. Va scritto nel GDD come scarto motivato, perché nessuno dei tre giochi osservati mostra l'impero completo prima di giocare.
- [R] Rendere l'impero completo costa triangoli: GDD sezione 10 vuole < 150.000 ovunque. La versione "impero" può essere la scena intera con LOD bassi o un'inquadratura alta con istanze; va misurata in `artifacts/report.json` come inquadratura a sé.

**Specifica proposta per la schermata del titolo di PATRÓN [R]**

| Elemento | Specifica |
| --- | --- |
| Fase 1 – caricamento | Sfondo a tinta piatta del colore di marca, logo "PATRÓN" al centro, barra di avanzamento sotto il logo (colore di marca, angoli tondi, larga ~40% dello schermo). Nessun testo oltre al logo. Si chiama `gameLoadingFinished` (se mai su Poki) alla fine. Obiettivo: < 3 s sull'iMac in localhost. |
| Fase 2 – titolo | Il mondo 3D vero, già caricato, con la valle **completa** (campi di Lumina luminosa, magazzini, camion, villa del Patrón) in versione "promessa": camera alta e lontana in lenta orbita/traslazione (≈ 1 giro ogni 40–60 s), lavoratori e camion che si muovono. Interfaccia di gioco nascosta. |
| Logo | Nel terzo superiore, centrato, largo 45–55% della larghezza; caratteri tondi e grassi con contorno scuro (coerente con F8); leggero dondolio o "respiro" di scala (±3%, 2 s). |
| Personaggio | Il contadino/Patrón in primo piano basso, a un lato, in posa idle animata (non obbligatorio, ma Monkey Mart mostra i personaggi nella tavola). |
| Pulsante | Uno solo, "GIOCA", nel terzo inferiore, centrato; grande (≥ 220×72 px a 1280×720, leggibile a 821×462); colore saturo di azione (es. verde/giallo diverso dal verde dei soldi, RF9), contorno scuro, ombra solida sotto; pulsazione di scala 1,0→1,06 ogni ~1 s. Tutto lo schermo è cliccabile, e anche Invio/Spazio avviano. Nessun ritardo prima che sia attivo (CrazyGames). |
| Audio | Il clic crea o riprende l'`AudioContext` (ZzFX) e suona un suono breve di conferma; la musica parte solo dopo. Prima del clic: silenzio. |
| Altro | Piccola icona audio muto in un angolo ammessa; nessun altro pulsante, nessun testo di storia. Testi in italiano. |
| Transizione | Al clic: il logo e il pulsante si ritirano (scala a 0 + dissolvenza, ~0,3 s); la camera vola dall'inquadratura alta al lotto di partenza (1,5–2,5 s, curva ease-in-out), mentre la valle completa si "spegne" fino allo stato reale della partita (dissolvenza o nebbia sulle parti non ancora costruite). Arrivati: appare l'interfaccia e la prima frase-guida ("Raccogli i soldi!") con la freccia (PS4). Se il giocatore preme un tasto di movimento durante il volo, il volo si accorcia/salta. |
| Partita salvata | Se c'è già una partita: stessa schermata, lo sfondo è il **suo** stato attuale invece dell'impero completo, il pulsante dice "CONTINUA" (inferenza: nessuna fonte del genere lo documenta). |
| Eventi | `gameplayStart` al primo movimento del giocatore, non al clic (definizione Poki). |

### Gaps
- Non ho trovato fonti primarie (pagine o video) che descrivano la schermata iniziale di Pizza Ready, My Mini Mart e Burger Please su mobile oltre a quanto già osservato nella skill; durata reale della barra di Monkey Mart (0:00–0:28 nel video include probabilmente una pubblicità/caricamento di rete) non verificata.
- Nessuna fonte con numeri su dimensione/colore/animazione dei pulsanti Play nei giochi del genere: i valori in tabella sono raccomandazioni, non osservazioni.
- Non ho trovato documenti Poki ufficiali con una regola "salta il menu" o un tempo massimo al gioco; esiste solo la metrica "conversion to play".
- Esempi di "mondo completo come sfondo del titolo" in giochi idle del genere: non trovati in questa ricerca.

## B. Euristiche UX/UI professionali adattate all'arcade idle

### Takeaway
Il quadro più solido per un gioco è quello di Celia Hodent (The Gamer's Brain): sette pilastri di usabilità e tre di "engage-ability" (motivazione, emozione, game flow). Le guide dei publisher hyper-casual aggiungono vincoli più stretti: un solo input, nessuna UI complessa, scopo chiaro nei primi secondi, onboarding visivo dentro il gioco. Tradotti in criteri verificabili su screenshot e prove, formano la lista sotto.

### Cited Findings
- [F] The Gamer's Brain (Hodent) ha nel cap. 11 "Seven Usability Pillars for Game UX" e nel cap. 12 "Three Engageability Pillars for Game UX" con sezioni "Motivation", "Emotion", "Game Flow". — [Indice del libro, obalkyknih.cz](https://www.obalkyknih.cz/file/toc/985189/pdf)
- [F] Engageability secondo Hodent: Motivation ("the most important pillar"), Emotion ("our emotions influence our behavior"), Game Flow (il giocatore "loses themselves"). — [UserWise, Mike Moran, 29/08/2022](https://blog.userwise.io/blog/how-ux-can-improve-player-retention); stesso trio in [IxDF, Laia Tremosa](https://ixdf.org/literature/article/design-for-joy-why-games-break-traditional-ux-rules)
- [F] Per Hodent l'usabilità è "close to the heuristics used in other industries" con vocabolario specifico dei giochi; l'engage-ability è "a fuzzier concept, sometimes also called 'fun' or 'immersion'". — [Designative, 2019](https://www.designative.info/2019/03/28/the-ux-of-fortnite-celia-hodent/)
- [F] PLAY (Desurvire & Wiberg 2009) è l'evoluzione di HEP (2004) e conta 50 euristiche; i valutatori faticano a ricordarle tutte. HEP divide in Game Play, Game Story, Mechanics, Usability. — [Scitepress 2018](https://www.scitepress.org/Papers/2018/66956/66956.pdf)
- [F] Voodoo: controlli a una mano e un dito; nessuna morte istantanea; non sommare "multiple controls, loud elements, and threatening opponents"; il giocatore non deve aver bisogno di piena concentrazione; tono non minaccioso. — [Voodoo / GameAnalytics](https://www.gameanalytics.com/blog/voodoo-guide-mobile-game-design-keep-things-simple)
- [F] Homa: non più di pochi input ("tre sono già troppi"); "tons of gratification, juicy visual effects"; "Full focus on the in-game action"; UI fuori dalla schermata di gioco per quanto possibile. — [Homa](https://hubspot.academy.homagames.com/15-golden-rules-of-hyper-casual-games)
- [F] CrazyGames: onboarding dentro il gioco, visivo, saltabile; mostrare i tasti con un overlay; "The game responds quickly to the player's actions"; leggibilità a 821×462 e DPR 1. — [Quality](https://docs.crazygames.com/requirements/quality/), [Gameplay](https://docs.crazygames.com/requirements/gameplay/)
- [F] Lezione universitaria su UX dei giochi riprende i principi di Norman: constraints, visibility, consistency, affordances, mapping, feedback. — [UBC CPSC 427, Sheffer & Rhodin](https://www.cs.ubc.ca/~sheffa/games_course/Vjan22/lectures/3_user_interface_design.pdf)

### Inferences
Lista di controllo [R]. Ogni voce: pilastro → criterio di superamento. "S" = si verifica su screenshot, "P" = su una prova di gioco (Luca sull'iMac o bot). Non ripete le voci di `04-sintesi/checklist.md` (camera, colori, RF16–RF21): le completa.

**Usabilità (7 pilastri di Hodent)**
1. *Segni e feedback* (P): ogni azione del giocatore (raccogliere, pagare, depositare, sbloccare) produce entro 100 ms almeno due risposte tra movimento, suono e numero. Fallisce se un'azione avviene in silenzio o con ritardo visibile.
2. *Segni e feedback* (S): in ogni screenshot di gioco c'è esattamente **un** segnale "vai qui" dominante (freccia/anello); fallisce se ce ne sono zero o più di due in competizione.
3. *Chiarezza* (S): ridotto a 821×462, ogni numero dell'interfaccia e ogni prezzo a terra resta leggibile (altezza testo ≥ 14 px, contrasto con contorno). Fallisce se serve zoomare.
4. *Chiarezza / leggibilità 3D* (S): passando lo screenshot in scala di grigi, giocatore, stazioni attive e riquadri di sblocco si distinguono dallo sfondo per luminosità, non solo per tinta. Fallisce se il personaggio si confonde con il terreno.
5. *La forma segue la funzione* (S): un estraneo che guarda lo screenshot per 5 secondi sa dire cosa si compra (sagoma + prezzo) e dove si vende (bancone con soldi). Fallisce se ha bisogno di testo.
6. *Coerenza* (S): stessi colori per le stesse funzioni in tutte le zone (soldi sempre verde, sblocco sempre lo stesso riquadro, "pieno" sempre MAX rosso); stesso carattere ovunque. Fallisce al primo elemento che cambia significato.
7. *Carico minimo* (P): nel primo minuto il giocatore deve tenere a mente al massimo un obiettivo; nessuna schermata con più di 6–8 parole; nessuna scelta da menu prima del primo incasso. Fallisce se un pannello si apre da solo nei primi 3 minuti.
8. *Prevenzione e recupero degli errori* (P): non si spende per sbaglio (il pagamento avviene solo restando sul riquadro, e si interrompe uscendone); nessuna perdita definitiva; il Calore si recupera camminando. Fallisce se un gesto involontario costa soldi non recuperabili.
9. *Flessibilità* (P): frecce e WASD funzionano entrambi; audio disattivabile; il gioco si ferma quando la scheda perde il fuoco. Fallisce se manca uno dei tre.

**Engage-ability (3 pilastri di Hodent)**
10. *Motivazione* (S/P): c'è sempre in vista un prossimo acquisto raggiungibile in ≤ 60 s di gioco (coerente con RC5). Fallisce se per più di un minuto non c'è nulla di comprabile o in vista.
11. *Emozione / juice* (P): ogni sblocco ha la sua festa (PS13) e i soldi volano verso il contatore; la festa dura < 1,5 s e non blocca il movimento. Fallisce se la festa è assente o se ferma il giocatore.
12. *Game flow* (P): nessuna pausa morta (attesa senza nulla da fare) oltre 10 s nei primi 10 minuti; nessuna richiesta di attenzione piena (Voodoo). Fallisce se il giocatore resta fermo ad aspettare.

**Specifiche del genere e del web**
13. *Prima schermata* (S/P): dal caricamento al primo movimento possibile: un solo clic, nessun testo di storia; l'audio parte solo dopo il clic. Fallisce con due clic o con errori `AudioContext` in console.
14. *Onboarding senza testo* (S): nelle prime istruzioni solo frasi di 2–4 parole più icona/tasti disegnati (PS4, PS5); nessuna finestra modale. Fallisce con un paragrafo.
15. *Un solo input* (P): tutto si fa camminando (RC1); l'unico clic richiesto è quello iniziale e quello sui pannelli di potenziamento.
16. *UI minima* (S): l'interfaccia fissa occupa < 10% dello schermo e sta ai bordi; il centro è libero per il personaggio. Fallisce se un elemento fisso copre il personaggio o la sua zona d'azione.
17. *Leggibilità dall'alto* (S): nulla più alto delle ginocchia tra camera e personaggio (RF14) e ogni stazione si riconosce dalla sagoma vista a 50–55°.

### Gaps
- I nomi dei sette pilastri di usabilità (segni e feedback, chiarezza, la forma segue la funzione, coerenza, carico minimo, prevenzione e recupero degli errori, flessibilità) sono quelli del libro di Hodent come li riporta la richiesta; l'indice online conferma che sono sette ma non li elenca, e non ho trovato una pagina web 2019–2026 che li citi testualmente. Il libro è del 2017 (fuori dalla finestra 2019–2026, ma è la fonte originale).
- Non ho trovato il testo completo delle 50 euristiche PLAY: solo la loro esistenza e struttura.
- Guide UX di Supersonic e Kwalee: non trovate/lette in questa sessione.
- Le soglie numeriche (100 ms, 14 px, 10% dello schermo, 10 s di pausa, 1,5 s di festa) sono mie proposte, non valori da fonti: vanno tarate con le prove di Luca prima di entrare nel GDD.
