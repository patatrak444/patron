# Fasi del lavoro

Il lavoro è diviso in fasi perché ogni fase usa il risultato della precedente: non si può dedurre una regola (fase 4) senza averla osservata su più giochi (fasi 2 e 3), né osservare senza sapere quali giochi contano (fase 1).

| Fase | Cosa si fa | Perché in questo ordine | Risultato | Stato |
| --- | --- | --- | --- | --- |
| 1. Censimento | Scegliere i giochi di successo del genere con criteri misurabili | Senza un campione definito, le "regole" sarebbero gusti personali | `01-catalogo/indice.md` e una scheda vuota per gioco | Fatta |
| 2. Osservazione della forma | Guardare le schermate ufficiali di ogni gioco e trascrivere ciò che si vede, campo per campo, con lo stesso modello | Lo stesso modello per tutti rende i giochi confrontabili | Sezione "Forma" di ogni scheda e un file per campo in `02-forma/` | Fatta |
| 3. Osservazione del contenuto | Ricavare ciclo di gioco, stazioni, numeri (capienza, prezzi, tempi) da schermate, descrizioni e articoli | La forma senza il contenuto non spiega perché un oggetto è lì | Sezione "Contenuto" di ogni scheda e un file per campo in `03-contenuto/` | Fatta |
| 4. Sintesi | Estrarre dai file di `02-forma/` e `03-contenuto/` le regole ricorrenti in `04-sintesi/` | Solo confrontando i giochi si separa la regola del genere dalla scelta di un singolo studio | Regole con frequenza e intervalli numerici | Da fare |
| 5. Applicazione | Confrontare gli screenshot di PATRÓN con le regole; scrivere lo scarto e il piano delle modifiche | È lo scopo del lavoro: correggere il gioco con criteri, non a sensazione | `05-applicazione/confronto.md` e `piano.md` | Da fare |

Dopo la fase 5 si modifica il gioco, una tappa per volta, aggiornando prima il GDD.
