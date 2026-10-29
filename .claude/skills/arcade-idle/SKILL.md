---
name: arcade-idle
description: Enciclopedia del genere arcade idle (Pizza Ready, My Mini Mart, Burger Please…), costruita osservando i giochi di successo. Usala prima di ogni lavoro di grafica, layout, meccaniche o bilanciamento di PATRÓN, e per giudicare uno screenshot del gioco contro il genere.
---

# Arcade idle: enciclopedia del genere

Raccolta organizzata di ciò che fanno, nella forma e nel contenuto, i giochi arcade idle che hanno avuto successo. Serve a due cose: progettare PATRÓN con le regole del genere, e giudicare ogni screenshot del gioco contro di esse.

## Come è organizzata

| Cartella | Cosa contiene | Quando leggerla |
| --- | --- | --- |
| `00-metodo/` | Fasi del lavoro, criteri di scelta dei giochi, regole sulle fonti | Prima di aggiungere o correggere qualcosa |
| `01-catalogo/` | Un indice e una scheda per gioco: dati verificati e osservazioni | Per consultare un gioco preciso |
| `02-forma/` | Un file per aspetto visivo: camera, luce, colore, modelli, personaggi, ambienti, oggetti nel mondo, interfaccia, animazione | Prima di lavorare sulla grafica |
| `03-contenuto/` | Un file per aspetto di gioco: ciclo, stazioni, pila, sblocchi, lavoratori, clienti, economia, progressione, primi minuti, temi | Prima di lavorare su meccaniche e bilanciamento |
| `04-sintesi/` | Le regole ricorrenti, con quanti giochi le rispettano e gli intervalli numerici | Per decidere: è la parte normativa |
| `05-applicazione/` | Confronto di PATRÓN con le regole e piano delle modifiche | Prima di ogni tappa |

## Regole d'uso

- `docs/GDD.md` resta la fonte di verità di PATRÓN. Quando una regola della sintesi cambia il gioco, si aggiorna prima il GDD.
- Una regola entra in `04-sintesi/` solo se è osservata in almeno metà dei giochi del catalogo, e il file dice in quali.
- Ogni osservazione cita la scheda del gioco da cui viene (es. `[pizza-ready]`).

## Stato

Fase 1 (censimento) completata: 11 giochi tenuti, con voti di contenuto e forma in `01-catalogo/classifica.md`. Fase 2 (forma) completata: campi F1–F9 nelle schede e un file per campo in `02-forma/`. Fase 3 (contenuto) completata: campi C1–C10 nelle schede e un file per campo in `03-contenuto/`. Fase 4 (sintesi) completata: 21 regole di forma, 21 di contenuto e la lista di controllo in `04-sintesi/`. Fase 5 da fare: vedi `00-metodo/fasi.md`.
