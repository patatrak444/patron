# Tempi tra un obiettivo e l'altro negli arcade idle (e verifica della tabella di PATRÓN)

Ricerca del 30 ottobre 2026. Estende, senza ripeterli, i dati già in `.claude/skills/arcade-idle/03-contenuto/misure-video.md` e `06-prima-sessione/*.md` (Pizza Ready, Monkey Mart, My Mini Mart letti dai video). Fonti nuove trovate: la scomposizione di My Mini Mart su PocketGamer.biz/WNHub (con i **prezzi** dei primi sblocchi), Supersonic (tempo di gioco al giorno 0), il portfolio di un designer di un arcade idle (Barista Go, obiettivi di tempo di gioco), articoli di matematica idle (Eric Guan, Idle Idol, Math of Idle Games). **Nessuna fonte scritta pubblica i minuti esatti di ogni sblocco**: le tempistiche minuto per minuto vengono solo dai video già letti. Niente dati da video con soldi infiniti.

## 1. Tempistiche misurate dei primi 10–15 minuti

### Takeaway
Nel primo minuto il genere mette **4–5 sblocchi a 6–10 s l'uno dall'altro**, poi c'è un primo ciclo da ripetere 2–3 volte (≈ 1 minuto senza acquisti grandi); dal minuto 2 al 15 i "momenti" grandi (livello, lavoratore, zona nuova) cadono ogni **2–6 minuti**, riempiti in mezzo da riquadri piccoli. Il primo cambio di mappa arriva a **30–40 minuti** (My Mini Mart) o oltre 24 (Pizza Ready).

### Cited Findings
- Pizza Ready (video con economia vera, già in archivio): porta 0:04, tavolo da 5 a 0:15–0:21, forno da 50 a 0:27, bancone da 100 a 0:33, primo cliente 0:38, primo incasso ≈ 1:00; livello 2 e "NEW ZONE 100" a 2:10; **primo lavoratore a 4:55**; secondo forno 9:20; livello 4 e uffici dei potenziamenti 11:20 — [misure-video.md](/home/claude/patron/.claude/skills/arcade-idle/03-contenuto/misure-video.md), [06-prima-sessione/pizza-ready.md](/home/claude/patron/.claude/skills/arcade-idle/06-prima-sessione/pizza-ready.md)
- Monkey Mart (browser): primo acquisto (piantina da 10) a 0:40, bancone e clienti a 1:00, nuovo riquadro "12" a 3:20; a 16:40 stesso lotto, con lavoratori — [06-prima-sessione/monkey-mart.md](/home/claude/patron/.claude/skills/arcade-idle/06-prima-sessione/monkey-mart.md)
- My Mini Mart: primo ciclo (tutorial) in **20–30 s**; il giocatore ripete il primo ciclo **"2-3 times"** prima che si apra la seconda aiuola — [PocketGamer.biz](https://www.pocketgamer.biz/under-the-hood-deconstructing-the-top-hypercasual-games); [WNHub](https://wnhub.io/news/game-design/item-40717)
- My Mini Mart, prezzi in ordine: aiuola 10 (video) → pollaio +20 → scaffale 25 → frullatore 25 → posto delle galline per la cassa 50 → **zona nuova 95** (insieme al cestino) → riquadro successivo nella zona nuova 60 — [PocketGamer.biz](https://www.pocketgamer.biz/under-the-hood-deconstructing-the-top-hypercasual-games); dal video: pollaio visibile a 3:40, campo da 75 a 7:00 — [06-prima-sessione/my-mini-mart.md](/home/claude/patron/.claude/skills/arcade-idle/06-prima-sessione/my-mini-mart.md)
- My Mini Mart: nuovo mercato "at the 30th or 40th minute of gameplay", dipende da pubblicità guardate o acquisti; è "a medium-term goal, not a short-term one" — [PocketGamer.biz](https://www.pocketgamer.biz/under-the-hood-deconstructing-the-top-hypercasual-games); [WNHub](https://wnhub.io/news/game-design/item-40717)
- Burger Please: il primo lavoratore è **gratis** all'apertura dell'ufficio del personale, quinto sblocco della mappa (ordine, non tempo) — [misure-video.md](/home/claude/patron/.claude/skills/arcade-idle/03-contenuto/misure-video.md)

### Inferences
- Dal prezzo e dall'ordine di My Mini Mart (10, 20, 25, 25, 50, 95, 60, 75 in circa 7 minuti) si ricavano **circa 8 sblocchi nei primi 7 minuti**, cioè uno ogni ~50 s in media (inferenza: tempi del video + ordine della scomposizione).
- In Pizza Ready nei primi 12 minuti si contano almeno 4 "momenti grandi" (zona nuova 2:10, lavoratore 4:55, secondo forno 9:20, uffici 11:20): **intervalli 2,8 → 4,4 → 2,0 min**, più i riquadri piccoli che il video non permette di cronometrare uno per uno.
- Il lavoratore arriva fra **3 e 5 minuti** (Pizza Ready ≈ 5; Burger Please come 5° sblocco, quindi presumibilmente prima: inferenza).

### Gaps
- Nessun timestamp pubblico per My Perfect Hotel, Burger Please (video con soldi gonfiati) e per i riquadri piccoli di Pizza Ready fra 2 e 11 minuti. YouTube e app store non sono stati riletti in questa sessione.

## 2. Distanza tra sblocchi a 1, 5, 10, 30, 60 minuti

### Takeaway
La forma è una curva che cresce: **6–10 s** nel primo minuto, **≈ 0,5–1 min** fra riquadri piccoli tra 2 e 10 minuti, **2–5 min** fra i momenti grandi; dopo 30 minuti l'obiettivo grande (mappa nuova) è a 30–40 minuti di distanza, ma nel frattempo c'è sempre un riquadro o un potenziamento comprabile.

### Cited Findings
- Minuto 0–1: 4 sblocchi in 30 s in Pizza Ready (0:04 → 0:33) — [06-prima-sessione/pizza-ready.md](/home/claude/patron/.claude/skills/arcade-idle/06-prima-sessione/pizza-ready.md)
- Livelli del locale in Pizza Ready: 2 a 2 min, 3 a 5, 4 a 11, 5 non ancora a 24 → intervalli 2, 3, 6, > 13 min; soglie in stelle 15, 24, 39, 60, 81, 114… (×1,2–1,6) — [misure-video.md](/home/claude/patron/.claude/skills/arcade-idle/03-contenuto/misure-video.md)
- Mappa successiva a 30–40 min (My Mini Mart) — [WNHub](https://wnhub.io/news/game-design/item-40717)
- Barista Go (arcade idle): "Designed an infinite upgrade system where the next upgrade always feels close but keeps scaling further"; ritmo "slow-to-fast" — [portfolio Barista Go](https://gamedev-portfolio-barista-go.carrd.co/)
- Idle classici: all'inizio "your production rate is high and you can keep buying", poi l'attesa per il prossimo acquisto "gets prohibitively long" — [Game Developer, Math of Idle Games](https://www.gamedeveloper.com/design/the-math-of-idle-games-part-i)
- Idle Idol: pacing "not very fast or very slow" che rallenta in modo regolare lungo il gioco — [Game Developer, Idle Idol](https://gamedeveloper.com/design/balancing-tips-how-we-managed-math-on-idle-idol)

### Inferences
- Tabella di riferimento proposta (inferenza dai dati sopra):

| Minuto | Distanza tra **qualsiasi** acquisto | Distanza tra **momenti grandi** (lavoratore, zona, livello, macchina nuova) |
| --- | --- | --- |
| 1 | 5–15 s | — |
| 5 | 30–60 s | 2–3 min |
| 10 | 45–90 s | 3–5 min |
| 30 | 1–2 min (potenziamenti) | 5–8 min; mappa nuova a 30–40 |
| 60 | 1–3 min (potenziamenti) | 8–15 min |

- Il genere mantiene la regola "qualcosa da comprare sempre vicino" con **due strati**: riquadri e potenziamenti piccoli (5 livelli per stazione in Pizza Ready e Burger Please) e sblocchi grandi più radi. Una tabella con solo sblocchi grandi misura il secondo strato, non il primo.

### Gaps
- Nessun dato misurato oltre i 24 minuti con economia vera; i valori a 30 e 60 minuti sono inferiti da My Mini Mart (mappa a 30–40) e dalla crescita delle soglie dei livelli.

## 3. Quanti minuti di guadagno vale ogni sblocco; moltiplicatori di costo

### Takeaway
Nel genere ogni sblocco costa **più o meno quello che si ha in tasca** (si spende subito); i prezzi consecutivi crescono in media **×1,3–1,5**, con salti ×2–3 sui pezzi importanti e ribassi subito dopo (un riquadro più economico dopo una zona nuova).

### Cited Findings
- Pizza Ready: in 24 minuti i soldi in tasca non superano mai 550; il primo sblocco costa 5, il secondo tutto quello che si ha — [misure-video.md](/home/claude/patron/.claude/skills/arcade-idle/03-contenuto/misure-video.md)
- Pizza Ready / Burger Please: 5 → 50 → 100 → 100 (zona) → 200–250 → 700 (caffetteria) — [sblocchi.md](/home/claude/patron/.claude/skills/arcade-idle/03-contenuto/sblocchi.md)
- My Mini Mart: 10 → 20 → 25 → 25 → 50 → 95 → 60 → 75 — [PocketGamer.biz](https://www.pocketgamer.biz/under-the-hood-deconstructing-the-top-hypercasual-games)
- Farm Land: 7 monete in partenza, primo terreno 7, secondo 20 — [sblocchi.md](/home/claude/patron/.claude/skills/arcade-idle/03-contenuto/sblocchi.md)
- Livelli di un potenziamento negli idle: costo ×1,15 per livello (Eric Guan) — [Substack](https://ericguan.substack.com/p/idle-game-design-principles); ×1,1 di base, con aumenti reali dell'11–19% tra livelli (Idle Idol) — [Game Developer](https://gamedeveloper.com/design/balancing-tips-how-we-managed-math-on-idle-idol); ×1,07 (AdVenture Capitalist) — [Game Developer](https://www.gamedeveloper.com/design/the-math-of-idle-games-part-i)
- My Perfect Hotel: una guida di giocatori dice che il potenziamento del pulitore da livello 1 a 2 si ripaga in "less than 10 minutes of active play" (non verificabile, nessun prezzo indicato) — [Whisper of the House](https://www.whisperofthehouse.com/my-perfect-hotel)

### Inferences
- Rapporto medio di My Mini Mart nei primi 8 sblocchi: (75/10)^(1/7) ≈ **×1,33**; di Pizza Ready dal tavolo alla caffetteria: (700/5)^(1/6) ≈ ×2,3, ma con il primo passo ×10; esclusi i primi due, ≈ ×1,6 (calcolo).
- "Minuti di guadagno" per sblocco: non c'è un dato pubblico del reddito al minuto. Dal fatto che il giocatore spende sempre tutto e che gli sblocchi arrivano ogni ~1 min, ogni riquadro piccolo vale **≈ 0,5–1,5 minuti** di guadagno nei primi 15 minuti, i momenti grandi **2–4 minuti** (inferenza).

### Gaps
- Reddito al minuto misurato in nessun gioco del genere; da cronometrare su un video con economia vera.

## 4. Indicazioni dell'industria su sessione e "prossimo obiettivo"

### Takeaway
La prima sessione buona del genere dura **20–30 minuti**; nessuna fonte pubblica una regola numerica tipo "obiettivo ogni X secondi", solo il principio "il prossimo acquisto sempre vicino".

### Cited Findings
- Supersonic (talk SuperMonday sugli idle arcade): "an average D0 playtime of 1200s-1800s" (20–30 minuti il primo giorno) — [Supersonic](https://supersonic.com/?p=82671)
- Barista Go: obiettivo di tempo di gioco D7 1800–2400 s, ottenuto 1400–1600 s; D1 28–32% contro un obiettivo di 30–40%; "Simulated cost vs. reward graphs using idle game math to hit desired target session time"; lezione: "Short, well-paced tutorials matter significantly" — [portfolio Barista Go](https://gamedev-portfolio-barista-go.carrd.co/)
- Idle in generale: prima sessione "15 to 60 minutes", ritorni sempre più radi — [Eric Guan](https://ericguan.substack.com/p/idle-game-design-principles)
- Già in archivio: soglia di lancio di Homa ≥ 20 minuti e ≥ 40% di ritorno al giorno 1; sessione web più comune 11–20 minuti (Poki) — [economia.md](/home/claude/patron/.claude/skills/arcade-idle/03-contenuto/economia.md)
- My Mini Mart: l'aiutante va sbloccato presto perché "important for retention"; ogni sblocco mostra che ne arriva un altro — [PocketGamer.biz](https://www.pocketgamer.biz/under-the-hood-deconstructing-the-top-hypercasual-games)

### Inferences
- Su browser (PATRÓN) la sessione tipo è 11–20 minuti: i momenti forti vanno concentrati nei primi 15 minuti, e un **obiettivo di medio periodo visibile** (la mappa o il capitolo successivo) deve comparire prima dei 30 minuti.

### Gaps
- Nessun talk pubblico di Supercent, Homa o SayGames con numeri sul ritmo degli sblocchi; il playbook Homa sull'arcade idle è un video senza testo — [Homa Academy](https://hubspot.academy.homagames.com/homa-academy/arcade-idle-playbook)

## 5. Verdetto sulla tabella di PATRÓN e correzioni

### Takeaway
I primi 12 minuti sono **in linea con il genere** (lavoratore a 3 min, zona a 5, rapporti di prezzo ×1,3–1,5). I problemi sono tre: (a) dopo i 15 minuti la tabella **viola la sua stessa regola** dei 3–4 minuti (intervalli di 6 e 8 minuti); (b) tra 10 e 15 minuti i prezzi **non tornano con il guadagno dichiarato** di 30–100 $/min; (c) manca un obiettivo grande di medio periodo intorno ai 30–40 minuti.

### Cited Findings
- Tabella di PATRÓN (dal compito): intervalli in minuti 0,2 · 0,1 · 1,1 · 0,5 · 1 · 2 · 1,5 · 1,5 · 2 · 1,5 · 0,5 · **3 · 4 · 6 · 4 · 5 · 6 · 8 · 8 · 8 · 8 · 13 · 15 · 18 · 22**.
- Riferimenti del genere: lavoratore ≈ 5 min (Pizza Ready), zona nuova 2:10 (Pizza Ready) e ~5–7 min (My Mini Mart, inferito), mappa nuova 30–40 min (My Mini Mart) — fonti nelle sezioni 1–2.

### Inferences (calcoli sulla tabella)
- **Primo minuto.** PATRÓN: 3 eventi in 0,4 min, poi 66 s senza acquisti. Pizza Ready fa 4–5 sblocchi in 30 s; My Mini Mart fa ripetere il ciclo 2–3 volte prima del secondo acquisto. Va bene, purché quei 66 s siano il primo ciclo completo (raccolta → torchio → camion → soldi). Correzione minima: aggiungere un quarto passo da $5–10 entro 0,6 min (es. un pezzo di recinto, un tavolo da lavoro) se il ciclo dura meno di un minuto.
- **Lavoratore a 3 min** ($30): un po' prima di Pizza Ready (≈ 5) ma coerente con Burger Please (5° sblocco, gratis). Nessuna correzione.
- **Zona nuova a 5 min** ($60): dentro la forbice 2–7 min. Nessuna correzione.
- **Rapporti di prezzo.** 5 → 15 → 20 → 10 → 30 → 60 → 80 → 120 → 200 → 250 → 350 → 500: rapporto medio (500/5)^(1/11) ≈ ×1,52; da 500 a 40.000 in 14 passi ≈ ×1,40. In linea con My Mini Mart (×1,33) e con la parte centrale di Pizza Ready (×1,6). Il ribasso Falò $10 dopo Campo 2 $20 è coerente con il genere (My Mini Mart 95 → 60).
- **Cassa tra 10 e 15 minuti (incoerenza).** Spesa cumulata: $480 a 10 min, **$1.080 a 12 min**, $1.580 a 15 min. Con 30 $/min che salgono a 100 $/min, il guadagno cumulato a 12 minuti è al massimo ≈ $700–800 (media ≈ 60–65 $/min). Torchio 2 ($200, min 10) + Cargador ($250, 11,5) + Laboratorio ($350, 12) = $600 in 2 minuti, cioè 300 $/min: a 100 $/min servono 6 minuti. Correzione: o il reddito a 10 minuti è già ≈ 150–200 $/min, o i tre sblocchi si spalmano su 10 → 13 → 16 min (oppure Cargador $150 e Laboratorio $250). Il successivo $500 a 15 min vale 5 minuti di guadagno a 100 $/min, troppo per un passo a 3 minuti: abbassare a ≈ $300 o anticipare la crescita del reddito.
- **Dopo i 15 minuti (regola violata).** Intervalli 6 (19 → 25), 6 (34 → 40), 8, 8, 8, 8 dentro la prima ora contro la regola "mai più di 3–4 minuti". Due correzioni possibili, da decidere nel GDD:
  1. *Più sblocchi*: aggiungere uno sblocco intermedio in 19–25, 34–40, 40–48, 48–56 (es. 22, 37, 44, 52), così nessun intervallo supera 4 minuti fino a 60.
  2. *Due strati, come il genere*: tenere radi gli sblocchi grandi (5–8 min a 30–60 min è in linea con il genere) ma riscrivere la regola come "**mai più di 60–90 s senza un acquisto possibile** (riquadro o potenziamento di stazione a 5 livelli); mai più di 4 min senza uno sblocco grande nei primi 15 minuti, 8 min fino a 60". Questa è la forma di Pizza Ready e Burger Please (uffici dei potenziamenti a 11 minuti) ed è quella consigliata.
- **Obiettivo di medio periodo.** Il genere apre la mappa/locale nuovo a 30–40 min (My Mini Mart) e mostra lo strato successivo già a ~11 min (uffici e pass in Pizza Ready). Nella tabella di PATRÓN non risulta un evento "capitolo 2" o "zona grande" fra 25 e 40 minuti: aggiungerlo (con riquadro visibile e lucchetto dal minuto ~15–20), oppure segnalare quale dei passi 25/29/34/40 svolge questo ruolo.
- **Dopo i 60 minuti.** Intervalli 13 → 15 → 18 → 22 e costi fino a $40.000: forma coerente con la crescita delle soglie dei livelli (×1,2–1,6) e con gli idle classici; a quel punto il giocatore è in una sessione successiva, e il guadagno offline rende accettabili attese più lunghe. Nessuna correzione, purché i potenziamenti tengano vivo lo strato piccolo.

### Gaps
- Il guadagno al minuto di PATRÓN dopo il capitolo 1 non è nel compito: la verifica di cassa dopo i 15 minuti non si può fare.
- Le soglie del genere a 30–60 minuti sono inferite, non misurate: un video con economia vera oltre i 30 minuti (Pizza Ready parte 2, My Mini Mart) le confermerebbe.
