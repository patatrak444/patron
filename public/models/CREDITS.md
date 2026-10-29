# Crediti dei modelli 3D

Tutti i modelli di questa cartella sono di **Kenney** ([kenney.nl](https://www.kenney.nl)),
licenza **CC0 1.0** (pubblico dominio): si possono usare, modificare e pubblicare senza obbligo
di citazione. Li citiamo comunque, come previsto dal GDD (sezione 10).

| Pacchetto originale | File in questa cartella |
| --- | --- |
| [Nature Kit](https://kenney.nl/assets/nature-kit) | `tree_palm`, `tree_oak`, `tree_fat`, `tree_dark`, `bush`, `bush_large`, `rock_large`, `rock_small`, `stump`, `log`, `fence`, `flower_red` |
| [Car Kit](https://kenney.nl/assets/car-kit) | `truck_flat` (camion di El Gordo) |
| [Mini Characters 1.0](https://kenney.nl/assets/mini-characters) | `mini_male_a`–`f`, `mini_female_a`–`f` (32 animazioni ciascuno) |

**Provenienza dei file.** Copie ottimizzate (compressione meshopt) prese dal pacchetto npm
[`@netforge/asset-library-files`](https://www.npmjs.com/package/@netforge/asset-library-files)
versione 0.2.0, che documenta nel suo file `NOTICE` la licenza CC0 di ciascun pacchetto Kenney
(il `License.txt` di ogni archivio dice "Creative Commons Zero, CC0"). Il percorso originale di
ogni file nel pacchetto Kenney è registrato nel manifesto `@netforge/asset-library`
(`manifest/lowpoly.json`).

Per caricarli serve il decodificatore meshopt di Three.js (`three/examples/jsm/libs/meshopt_decoder.module.js`),
già incluso in Three.js.
