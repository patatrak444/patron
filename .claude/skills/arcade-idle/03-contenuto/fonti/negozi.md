# Contenuto dei giochi arcade idle — negozi (My Mini Mart, Outlets Rush, Monkey Mart)

Research date: 2026-10-29. "Verified" means a source states it. "Inferred" means my reasoning from sources. No hard numbers (stack size, prices, unlock costs) were found in any reliable source for any of the three games. See the Gaps sections.

Corrections to the assignment brief:
- **My Mini Mart** is now listed under **Supersonic Studios LTD** (Unity's publishing label) on both Google Play and the App Store. Package `com.KisekiGames.smart` still points to the Kiseki origin. — [Google Play](https://play.google.com/store/apps/details?id=com.KisekiGames.smart&hl=en); [App Store SG](https://apps.apple.com/sg/app/my-mini-mart/id1592004814)
- **Outlets Rush** was developed by Core Studios (Turkey) and is published by **Supercent** (Korea). The Play listing names Supercent, Inc. as developer. — [MAF](https://maf.ad/en/blog/outlets-rush-arcade-idle/); [Google Play](https://play.google.com/store/apps/details?id=com.corestudios.storemanagementidle&hl=en)

## What is the production chain and how many stations are in the first map? (C1, C2, C10)

### Takeaway
All three games use the same loop: generator → carried stack → shelf → customer picks → checkout → cash pile → spend on an unlock pad. They differ in chain length and theme. My Mini Mart and Monkey Mart add a farm/animal/processing layer of about three products per map. Outlets Rush has no farm: goods arrive as warehouse shipments, and the extra station types are fitting rooms that need cleaning. My Mini Mart's first map has a documented unlock order of 9 stations.

### Cited Findings
**My Mini Mart**
- Core loop: collect generated products, stock shelves, wait for visitors. Visitors take products to the checkout and pay. Money buys new product generators, and functions get automated over time. — [WNHub (Azur Games publishing lead)](https://wnhub.io/news/game-design/item-40717)
- First-map unlock order (verified, 9 stations): tomato bed → cash register → tomato counter → seedling source → chicken coop → egg counter → tomato paste shelf → blender → trash can. — [WNHub](https://wnhub.io/news/game-design/item-40717)
- Chains use about 3 products, which the author calls ideal. The store starts as a small empty stall. The late game is a fully automated hypermarket with a cow and a pizza oven. — [WNHub](https://wnhub.io/news/game-design/item-40717)
- The animal step needs an input: feed a cow barley to get milk. A full display blocks restocking. A bin discards surplus carried goods. — [Gamezebo](https://www.gamezebo.com/2022/01/25/my-mini-mart-strategy-guide-stock-the-shelves-with-these-hints-tips-and-cheats/); [TouchTapPlay](https://www.touchtapplay.com/my-mini-mart-guide-for-beginners-tips-tricks-and-cheats/)
- Store listing: plant, water and harvest crops; chickens and cows for eggs and milk; processing machines turn raw materials into products. — [Google Play](https://play.google.com/store/apps/details?id=com.KisekiGames.smart&hl=en)
- Customer cash piles up on the cashier counter. Thieves can steal it, and you chase them and catch them with a net. — [Gamezebo](https://www.gamezebo.com/2022/01/25/my-mini-mart-strategy-guide-stock-the-shelves-with-these-hints-tips-and-cheats/)
- Scripted events: an employee leaves, the cash register is robbed, a wholesaler arrives. — [WNHub](https://wnhub.io/news/game-design/item-40717)
- Other themed marts exist. A March 2025 patch fixed "a critical progression blocker for some Sushi Mart players". — [App Store version history](https://apps.apple.com/sg/app/my-mini-mart/id1592004814)

**Outlets Rush**
- The theme is clothing and sporting goods outlets (shoes, clothes, bags, hats, underwear) in a shopping centre or "shopping city", with sports, luxury and other store types. — [Google Play](https://play.google.com/store/apps/details?id=com.corestudios.storemanagementidle&hl=en); [MAF](https://maf.ad/en/blog/outlets-rush-arcade-idle/)
- Chain: stock shelves from the warehouse as shipments arrive, then check out customers at the counter. Earnings go into new shelves for sneakers and T-shirts. — [CrazyGames](https://www.crazygames.com/game/outlets-rush)
- Staff tasks: restocking displays, **cleaning fitting rooms**, checkout. — [Google Play](https://play.google.com/store/apps/details?id=com.corestudios.storemanagementidle&hl=en)
- The first store is the "Neki" sports store, a parody brand. — [CrazyGames](https://www.crazygames.com/game/outlets-rush)

**Monkey Mart**
- Stations: crops (stand by them to harvest), shelves (carry produce there), cash register (stand there to collect payment), animals (eggs and milk, but only after they eat corn), and appliances that turn basic items into higher-value goods. — [Poki EN](https://poki.com/en/g/monkey-mart)
- Raw goods: bananas, corn, wheat, coffee beans, cocoa beans. Processed goods: yoghurt (from bananas), popcorn (corn), flour and baked goods (wheat), coffee, chocolate (cocoa). — [Poki EN](https://poki.com/en/g/monkey-mart)
- Customers pick what they need and queue at the register. Empty shelves make the queue longer. Mischievous monkeys can knock goods over. — [Poki JP](https://poki.com/jp/g/monkey-mart)
- The Play listing also names pineapples and coconuts. — [Google Play](https://play.google.com/store/apps/details?id=com.tinydobbins.monkeymart&hl=en)

### Inferences
- My Mini Mart's first map is the cleanest template: 9 pads, with the first three (bed → register → counter) closing a full loop before any second product appears. The order suggests the register is unlocked before the first shelf, so money flows within the first cycle.
- Each game's theme sets the extra station type: animals need feed (My Mini Mart, Monkey Mart), fitting rooms need cleaning (Outlets Rush). Each new station type is a new chore, not just another production line. This is useful for PATRÓN when choosing which chores fit the narco theme.
- Monkey Mart's first-mart station count is not documented. It plausibly includes banana crop → banana shelf → register → corn/animal → yoghurt appliance, but this is not verified.

### Gaps
- No source gives exact station counts for Monkey Mart's or Outlets Rush's first map.
- The full My Mini Mart map list is not documented. Only Sushi Mart is confirmed by name.

## Known numbers: starting carry capacity, first unlock costs, upgrade tiers (C3, C4, C5, C7)

### Takeaway
No reliable public source gives starting stack capacity, unlock-pad prices or upgrade cost curves for any of the three games. The only firm structural numbers are Monkey Mart's 3 upgrade types × 4 levels, 5 daily quests and 6 marts; Outlets Rush's 7 shops and ad cadence; and My Mini Mart's 30–40 minutes per market. Getting real numbers needs first-hand play or video frame-reading.

### Cited Findings
**Stack, upgrades and workers**
- Monkey Mart has 3 upgrades, each up to **level 4**: Stamina (less worker sleep and fewer appliance breakdowns), Stack (carry capacity plus appliance storage), Speed (workers and processing). — [Poki EN](https://poki.com/en/g/monkey-mart)
- Monkey Mart staff roles: cashier, assistant (harvest and restock), farmer (collects from animals), chef (cooks high-value items). Workers get tired and **fall asleep**, and you wake them or do the job yourself. — [Poki EN](https://poki.com/en/g/monkey-mart). Players complain about workers sleeping too often. — [Google Play reviews](https://play.google.com/store/apps/details?id=com.tinydobbins.monkeymart&hl=en)
- My Mini Mart: personal upgrades raise how many goods you carry, and guides say to upgrade carry capacity first. — [TouchTapPlay](https://www.touchtapplay.com/my-mini-mart-guide-for-beginners-tips-tricks-and-cheats/); [Gamezebo](https://www.gamezebo.com/2022/01/25/my-mini-mart-strategy-guide-stock-the-shelves-with-these-hints-tips-and-cheats/)
- My Mini Mart workers: the merchandiser stocks displays and slightly slows the pace; the cashier handles checkout and frees the player for resources. — [WNHub](https://wnhub.io/news/game-design/item-40717)
- My Mini Mart IAPs include "Super Stack Large" (S$14.98), so carry capacity is also sold for real money. — [App Store SG](https://apps.apple.com/sg/app/my-mini-mart/id1592004814)
- Outlets Rush upgrades: speed, carrying capacity, shop inventory, staff. — [MAF](https://maf.ad/en/blog/outlets-rush-arcade-idle/)
- Outlets Rush: open an HR office to hire staff, then upgrade their speed and capacity. Skateboards unlock faster movement. — [CrazyGames](https://www.crazygames.com/game/outlets-rush)

**Currencies, prices and ads**
- Outlets Rush has two currencies: cash (soft) and gems (hard, bought only). Gems come in 6 packs from $1.99 to $29.99. The $9.99 no-ads pack includes 100 gems and is the best seller. Lifetime IAP revenue is over $1.9M, 38% of it from the US. — [MAF](https://maf.ad/en/blog/outlets-rush-arcade-idle/)
- Outlets Rush interstitials: the first appears right after the tutorial, then every 2 minutes, dropping to every 1 minute over time. Rewarded videos give currency, boosts (speed, staff, capacity) and idle-reward multipliers. — [MAF](https://maf.ad/en/blog/outlets-rush-arcade-idle/)
- My Mini Mart full-screen ads appear "up to several times per minute" during play, not between levels. A separate IAP removes them. Hard currency buys upgrades and temporary boosters. — [WNHub](https://wnhub.io/news/game-design/item-40717)
- My Mini Mart's 2025–2026 patch notes repeatedly say "reduced ad frequency" (29–30 Mar and 13 Jun 2026). — [App Store SG](https://apps.apple.com/sg/app/my-mini-mart/id1592004814)
- My Mini Mart SGD price list includes Remove Pop Up Ads S$3.98, Remove Ads S$6.98, 40000 Cash S$9.98, and Super Pack S$6.98 and S$14.98. — [App Store SG](https://apps.apple.com/sg/app/my-mini-mart/id1592004814)
- Monkey Mart: diamonds come from daily quests and can be exchanged for cash in the shop. — [Poki EN](https://poki.com/en/g/monkey-mart)

### Inferences
- In all three, stack capacity is the first upgrade lever and a monetised good (rewarded boosts or IAP). It is the most important number to tune in PATRÓN's `balance.ts`.
- Monkey Mart's few short tiers (3 × 4) suit a browser game with short sessions. The mobile titles appear to have longer upgrade ladders, though this is not quantified.

### Gaps
- Starting stack capacity, per-level increments, first unlock-pad costs and cost-curve multipliers: no reliable source found. Many "Monkey Mart guide" results were SEO spam on unrelated domains (noti.st, subsquare, university forums) and were excluded.
- Worker counts per map are not documented.

## Long-term progression and onboarding (C4, C8, C9)

### Takeaway
Progression is horizontal in all three: finish one store, unlock the next one with a different theme. Monkey Mart has 6 marts gated by "unlock everything in the current mart". Outlets Rush has 7 shops gated by stars. My Mini Mart opens a new market about every 30–40 minutes. Onboarding is wordless or near-wordless, with arrows guiding the first cycle in 20–30 seconds.

### Cited Findings
- **Monkey Mart:** 6 marts. Mart 1 bananas, 2 chocolate bar, 3 chocolate muffin, 4 fish, 5 apple, 6 coconut drink. Opening the next mart requires unlocking every aisle and appliance in the current one. — [Poki EN](https://poki.com/en/g/monkey-mart); [Poki JP](https://poki.com/jp/g/monkey-mart)
- Monkey Mart meta layer: 5 daily quests that reward diamonds, a daily reward in the shop, and 20+ hats bought with diamonds. — [Poki EN](https://poki.com/en/g/monkey-mart)
- **Outlets Rush:** from the Neki store to 7 shops. Stars unlock new stores. You can revisit established shops for quick cash. — [CrazyGames](https://www.crazygames.com/game/outlets-rush)
- Outlets Rush: empty shop spaces in the mall get unlocked, each with its own look. It has daily quests and offline idle rewards that rewarded video can multiply. — [MAF](https://maf.ad/en/blog/outlets-rush-arcade-idle/)
- **My Mini Mart:** a new market opens after about 30–40 minutes, varying with spending and ads. Each new station appears after a money cycle. — [WNHub](https://wnhub.io/news/game-design/item-40717)
- **My Mini Mart onboarding:** no text. Arrows guide the first cycle over 20–30 seconds. Early walks are under 2 seconds. First purchases are register → tomato counter → seedlings. Price tags mark the next task, and the camera focuses on events. Every action is animated (harvesting, boxing, packing). — [WNHub](https://wnhub.io/news/game-design/item-40717)
- **Outlets Rush onboarding:** an interactive tutorial with arrows and short text teaches movement and basic tasks within seconds. The first interstitial ad appears right after it. — [MAF](https://maf.ad/en/blog/outlets-rush-arcade-idle/)
- No prestige or reset system is mentioned for any of the three in any source.

### Inferences
- The "complete everything to open the next map" gate (Monkey Mart) and the star gate (Outlets Rush) both mean a map ends at a defined point, with no endless scaling. Neither has a prestige reset.
- With about 30–40 minutes per My Mini Mart market and 6 Monkey Mart marts, total content runs to a few hours. This is an estimate, not verified.

### Gaps
- No minute-by-minute script of the first 10 minutes exists for Monkey Mart or Outlets Rush.
- The exact star thresholds for Outlets Rush are not documented.

## Monkey Mart as a browser game: controls, session length, saving, ads, maps

### Takeaway
Monkey Mart runs everywhere (desktop, phone, tablet, plus iOS and Android apps). It has no pause button, a fullscreen button, 6 marts, and 3 × 4 upgrades. Portal pages say nothing about keys, saving or ad cadence. For comparison, the web build of Outlets Rush on CrazyGames uses WASD or arrow keys plus the mouse.

### Cited Findings
- TinyDobbins (Nikita Borisov, Tyumen, Russia). Released November 2022, latest update March 2026. Rated 4.6 from about 3.8M votes on Poki. — [Poki EN](https://poki.com/en/g/monkey-mart); [Google Play](https://play.google.com/store/apps/details?id=com.tinydobbins.monkeymart&hl=en)
- Android version: 1M+ downloads, updated 12 March 2026 (adds "a new visitor to the mart"), contains ads and IAP, offline play. — [Google Play](https://play.google.com/store/apps/details?id=com.tinydobbins.monkeymart&hl=en)
- Controls: the Poki page only says to guide the monkey to the right spot, where work starts automatically. It lists a fullscreen button and **no pause button**. — [Poki EN](https://poki.com/en/g/monkey-mart)
- Single player, no download needed, works on desktop, phone and tablet. — [Poki EN](https://poki.com/en/g/monkey-mart)
- One Play reviewer says the ads are short and give rewards. — [Google Play](https://play.google.com/store/apps/details?id=com.tinydobbins.monkeymart&hl=en)
- Comparison with Outlets Rush on CrazyGames (web release November 2024, Unity 2022, landscape): WASD or arrow keys to move, left mouse button for the UI. — [CrazyGames](https://www.crazygames.com/game/outlets-rush)
- General browser saving: games save locally (often IndexedDB or Web Storage) or to an account. Clearing cookies and site data can wipe local saves. — [FRVR](https://frvr.com/blog/game-guides/how-browser-games-save-progress/)

### Inferences
- Poki describes no explicit save or load UI, so saving is probably automatic and local to the browser. This is not verified.
- On the web, "no pause" plus auto-start on stations means a session has no menu friction. Close the tab and you resume where you were. This fits a short, drop-in session.

### Gaps
- Monkey Mart's keyboard keys, save mechanism (local storage vs Poki cloud), web ad cadence and typical session length are not stated in any accessible source. The CrazyGames Monkey Mart page and the Fandom wiki both failed to load.
- No TinyDobbins interview or Poki developer story was found.
