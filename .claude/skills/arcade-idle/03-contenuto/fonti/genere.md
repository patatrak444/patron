# Arcade idle genre: cross-game design principles and benchmarks (research as of 2026-10-29)

Reading key: **[V]** = the figure appears in the cited source as stated (it is still the source's own claim; analysts often take it from AppMagic or Sensor Tower). **[E]** = an estimate, a single-author opinion or anecdote, or a figure the source itself marks as approximate. Each item gives its source date. Most genre-specific data is from 2021–2022, when the genre peaked. Only a few 2025–2026 sources are game-specific.

## 1. Core loop and layers (manual, hiring, upgrades, new map); meta layers of top games

### Takeaway
Analysts describe the same stack. A joystick character carries stacks of goods between stations (the hyper-casual core). The money it earns pays for unlocks on the floor, staff, and speed/capacity/profit upgrades. Then come new rooms, restaurants or hotels. Long-term meta is thin: map expansion and new venues, plus daily challenges, events, passes and cosmetics in the strongest titles. Analysts list the missing meta (quests, collections, social) as the genre's main retention weakness.

### Cited Findings
- Genre definition: a hybrid-casual subgenre combining idle progression with arcade simplicity, "hyper-casual simplicity, but with higher engagement". The player moves a character with a joystick, stacks resources (harvests crops, serves burgers), spends them to expand and upgrade, and "always see[s] how far they are from the next small goal". There are offline rewards, and upgrading, exploration and expansion layers open as the player advances. [V, MAF, 2024-02-08, modified 2025-10-07] — [MAF / myappfree](https://myappfree.com/en/arcade-idle-genre/)
- Long-term goals cited: unlocking hidden map areas and growing character power. Progression systems: map exploration, character upgrades, level-based progression, growth/expansion. [V, same source] — [MAF](https://myappfree.com/en/arcade-idle-genre/)
- Visual conventions: simple characters ("jelly man", "stick man"), simple environments, a slightly tilted top-down camera. Newer titles have better graphics. [V, same] — [MAF](https://myappfree.com/en/arcade-idle-genre/)
- Top themes by downloads: farming, sandbox, battle creatures, cooking, digging/mining. [V, Homa + Sensor Tower, 2022] — [Mobidictum](https://mobidictum.com/arcade-idle-genre-grew-by-2050/)
- Burger Please (Supercent) core loop: open the restaurant, buy equipment, hire staff, serve customers as fast as possible. Layers: (1) manual, joystick + stacking, "the hyper casual core". (2) Hiring, with staff who carry burgers to the register, serve, clean and run the drive-thru; rewarded-ad cash makes early hiring easy. (3) Upgrades, an HR office for staff speed/capacity/hiring plus avatar speed, capacity and profit, with cost rising each tier. (4) Expansion: new areas, more restaurants, the franchise as the long-term goal. "Simplified idle mechanics" serve as the meta. [V for the description, author's analysis, Udonis, 2025-05-28] — [Udonis, Burger Please](https://www.blog.udonis.co/mobile-marketing/mobile-games/burger-please)
- My Perfect Hotel (SayGames): front desk + room service with an active service role. Floors, amenities and services unlock over time, then new hotels. Upgrades cover rooms and staff training. Difficulty rises through larger crowds, complaints and equipment breakdowns. The player can progress actively (faster) or idly. Meta: daily challenges, seasonal events, a Hotel Pass (battle pass with Pro/Elite tiers), and cross-promotion inside the SayGames portfolio. [V for the description, Udonis, 2025-02-28] — [Udonis, My Perfect Hotel](https://blog.udonis.co/mobile-marketing/mobile-games/my-perfect-hotel)
- Hybrid-casual in general (Voodoo): hyper-casual core gameplay (easy controls, short sessions) plus a simplified casual/midcore meta with medium- and long-term goals (RPG progression, sticker albums, narrative or visual progression). Start from a proven hyper-casual core and build meta on top. [V, Voodoo sponsored, 2021-09-23] — [PocketGamer.biz, Voodoo](https://www.pocketgamer.biz/corentin-selz-voodoo-from-hypercasual-to-hybrid-casual)
- A playable character extends playtime, and the "adventure" layer is gather, get rich, expand territory, explore. [V, Homa jam, 2021-06-10] — [PocketGamer.biz](https://www.pocketgamer.biz/could-arcade-idle-be-your-jam/)

### Inferences
- The minimal stack shared by every source is: carry, sell, unlock tile, staff, upgrades (speed / capacity / profit), new zone, new venue. The meta layers that make the difference (events, pass, daily challenges) belong to the most mature titles (My Perfect Hotel). Burger Please is criticized precisely for lacking them.

### Gaps
- I found no public Deconstructor of Fun or GameRefinery (Liftoff) analysis specific to arcade idle. Searches returned only the Udonis analyses.

## 2. Pacing: first unlock, first worker, session, map length, number of maps, cost curves

### Takeaway
No public industry source gives genre timings (seconds to first unlock, minutes to first worker, hours per map). The only solid pacing figures are aggregate playtime: about 25 minutes on D0 for arcade idle versus about 10 for hyper-casual, and a Homa target of at least 20 minutes. For cost curves the reference remains Pecorella/Kongregate: exponential costs (base × r^owned, r = 1.07 in AdVenture Capitalist) against linear or polynomial production.

### Cited Findings
- Average D0 playtime in arcade idle: 25 min (about 10 min for hyper-casual). [V, Homa data, published 2022, repeated 2024] — [MAF](https://myappfree.com/en/arcade-idle-genre/)
- Homa launch target: at least 20 min of playtime (with D1 at 40% or more) before looking at CPI. At least 3–5 months of development before launch so there is enough content. [V, Victor Vielliard / Homa, 2022-09-27] — [Mobidictum, Aquarium Land](https://mobidictum.com/arcade-idle-dying-or-not-case-study-aquarium-land/)
- Arcade idle playtime "can reach 30+ minutes". [E, Homa, 2021] — [PocketGamer.biz](https://www.pocketgamer.biz/could-arcade-idle-be-your-jam/)
- A Voodoo hybrid-casual experiment raised average playtime by up to 15 min over the hyper-casual baseline. [V, 2021] — [PocketGamer.biz, Voodoo](https://www.pocketgamer.biz/corentin-selz-voodoo-from-hypercasual-to-hybrid-casual)
- In Burger Please, early upgrades can be maxed quickly, which the author says reduces the challenge. No timings given. [E, opinion, 2025] — [Udonis](https://www.blog.udonis.co/mobile-marketing/mobile-games/burger-please)
- Cost formula: cost_next = cost_base × r^owned. Production = base × owned × multipliers. AdVenture Capitalist (Lemonade Stand) uses r = 1.07. Costs grow exponentially while production grows linearly or polynomially, so costs eventually always win. Balancing decides when. Bulk purchase: b·r^k·(r^n−1)/(r−1). Maximum affordable: floor(log_r(c(r−1)/(b·r^k)+1)). [V, Pecorella / Kongregate] — [Game Developer, Math of Idle Games I](https://www.gamedeveloper.com/design/the-math-of-idle-games-part-i)
- Varying multipliers across generators makes priorities shift over time and keeps choices interesting. Prestige lets the player get "farther through the cost curve". [V, same] — [Game Developer](https://www.gamedeveloper.com/design/the-math-of-idle-games-part-i)
- Prestige/offline: Egg, Inc. caps offline earnings at 2 h. AdCap's prestige formula is 150·√(lifetime/1e15) (doubling it takes about 3–4× earnings). Cookie Clicker uses a cube root (about 8×). Milestone multipliers (for example ×16 at 500 generators in the example model) produce bursts of purchases. Vary slow and fast stretches. [V, Pecorella, part III] — [Game Developer, Math of Idle Games III](https://www.gamedeveloper.com/design/the-math-of-idle-games-part-iii)
- Mobile sessions in general (all genres, 2025 data): top 25% about 5.2 min per session, top 10% about 8 min. Daily playtime: top 25% 22–24 min, top 10% 40–42 min. Sessions per day: top 25% 5.3–5.7. [V, GameAnalytics 2026 Benchmarks, article 2026-06-04] — [GameDevReports](https://gamedevreports.substack.com/p/gameanalytics-mobile-and-pc-game)

### Inferences
- The 1.07 growth factor comes from a classic idle game with hundreds of buyable units. Arcade idles have few levels per upgrade (typically 5–20 tiers), so they plausibly need steeper factors per level. This is my inference: no public source documents arcade idle factors.
- 25 min on D0 with 5–8 min sessions suggests 3–5 sessions on the first day. Pacing should give a visible goal inside each 5–8 minute session.

### Gaps
- I found no public source with time to first unlock, time to first worker, hours per map, or number of maps per title. These have to be measured directly on the games (for example in the project's local skill `.claude/skills/arcade-idle/`).
- I found no public data on upgrade growth factors specific to Supercent, SayGames or TapNation titles.

## 3. FTUE / first session (first 30 s, first 5 min)

### Takeaway
The documented consensus is qualitative. The player should understand the game "within seconds", with a minimal tutorial guided by arrows and no text walls. In top titles, monetization appears inside the FTUE: rewarded ads during the tutorial in Burger Please, and the no-ads offer in the first couple of minutes in My Perfect Hotel.

### Cited Findings
- Minimal tutorial. Players should understand the game within seconds. [V, MAF, 2024] — [MAF](https://myappfree.com/en/arcade-idle-genre/)
- Burger Please: a step-by-step tutorial covering mechanics and progression, red arrows showing direction, and rewarded ads introduced already during the tutorial. [V, Udonis, 2025] — [Udonis](https://www.blog.udonis.co/mobile-marketing/mobile-games/burger-please)
- My Perfect Hotel: the $10 no-ads offer appears "within the first couple of minutes of play". [V, Udonis, 2025] — [Udonis](https://blog.udonis.co/mobile-marketing/mobile-games/my-perfect-hotel)
- Poki (web): to improve "conversion to play", get players into gameplay as fast as possible, cut loading times and file sizes, and keep onboarding short and direct. [V, Poki SDK docs, undated] — [Poki Web Fit help](https://sdk.poki.com/web-fit-help)

### Inferences
- For a browser game with no ads, the FTUE should get the player moving and carrying in the first few seconds, with an arrow toward the first goal. "Seconds" in the sources is qualitative, not measured.

### Gaps
- I found no quantitative public benchmark for the first 30 s or the first 5 min (such as tutorial drop-off) specific to arcade idle.

## 4. Monetization and retention benchmarks

### Takeaway
The top arcade idles are ad-heavy: about 70% ads / 30% IAP is estimated for Supercent. They use banners, frequent interstitials skippable after 5 s, and rewarded ads as the central format (cash, temporary or permanent boosts). IAP sells permanent versions of those boosts plus no-ads, with bundles around $10–13. Retention: 35% average D1 and 48–52% for the top 20 (2022 data). The Homa target is 40% or more. I found no D7/D30 figures specific to the genre.

### Cited Findings
- Supercent: Outlets Rush + Pizza Ready earn about $7–12M per month combined, with about 8M DAU each. The split is about 70% ads / 30% IAP, and user bases have been stable since March 2024. Formats: interstitials, rewarded, banners, app-open ads. [E, Felix Braberg's estimates, Gamigion, 2025-04-11] — [Gamigion, Inside Supercent](https://www.gamigion.com/?p=16732)
- Supercent method: reuse proven mechanics while changing the theme (Burger Please, Pizza Ready, Outlets Rush). This lowers risk and cuts production time. Early UA creatives used famous brand logos to lower CPI. [E, analysis, 2025] — [Gamigion](https://www.gamigion.com/?p=16732)
- Burger Please: banners always visible, interstitials "relatively frequent" and skippable after 5 s. Rewarded ads are the most important format (money bag, temporary/permanent speed or capacity boosts) and double as a test of which IAPs work. IAP: permanent boosts (for example 2× money), cosmetics, no-ads, ad-skip tickets. The premium bundle costs $12.99 (skin + vehicle + no ads + 2× money/speed/capacity). Offers are not aggressive but always in the shop. Over 20M downloads within a few months (AppMagic). [V, Udonis, 2025-05-28] — [Udonis](https://www.blog.udonis.co/mobile-marketing/mobile-games/burger-please)
- My Perfect Hotel: rewarded ads for cash and boosts. Interstitials are "frequent and forced", frequency not given. The most popular IAP is no-ads at $10. Hotel Pass with Pro/Elite tiers. Over 50M downloads. Revenue over $400k in the month cited (AppMagic). [V for the description; the article (2025-02-28) cites a 2022 launch and "August" figures without a clear year, so treat them as dated] — [Udonis](https://blog.udonis.co/mobile-marketing/mobile-games/my-perfect-hotel)
- Genre: interstitial, banner and rewarded formats. Rewarded ads speed up hiring and upgrades. Voodoo warns before an interstitial with a "halftime / lunch break" signal. Ad-removal packs are often the top sellers. Several top titles use subscriptions. [V, MAF, 2024] — [MAF](https://myappfree.com/en/arcade-idle-genre/)
- Benchmarks (Homa + Sensor Tower, 2022): average D1 35%, top-20 D1 48–52%, CPI $0.40 (hyper-casual $0.31, casual $0.98). Downloads +2050% from Q4 2020 to Q1 2022, 47.3M downloads in 2021. [V, data 2021–2022] — [Mobidictum](https://mobidictum.com/arcade-idle-genre-grew-by-2050/); [MAF](https://myappfree.com/en/arcade-idle-genre/)
- Homa targets: D1 40% or more, at least 20 min playtime, at least 20% of revenue from IAP, with the economy built early. [V, 2022] — [Mobidictum](https://mobidictum.com/arcade-idle-dying-or-not-case-study-aquarium-land/)
- Voodoo hybrid-casual: one-year LTV of about $3 (ads + IAP). IAP ARPDAU of about $0.10 (iOS US) is a strong signal. Hyper-casual prototype thresholds were 55% D1 / 22% D7. Hybrid raised D7/D14 (no figures given). [V, 2021] — [PocketGamer.biz](https://www.pocketgamer.biz/corentin-selz-voodoo-from-hypercasual-to-hybrid-casual)
- Cross-genre mobile benchmarks (GameAnalytics, 2025 data): D1 top 25% just above 30%, top 10% about 40%. D7 median just under 4%, top 10% 11–12%. D30 median 0.69–0.79%, top 1% 13–15%. D1 fell in 2025 compared with 2024. [V, article 2026-06-04] — [GameDevReports](https://gamedevreports.substack.com/p/gameanalytics-mobile-and-pc-game)
- By genre (AppsFlyer Q3 2022): Simulation D1 30.1% / D7 8.7% / D30 3.0%. Hyper-casual 29.3% / 5.9% / 1.4%. [V, dated] — [Mistplay](https://business.mistplay.com/resources/mobile-game-retention-benchmarks)
- Generic ad guidance: hyper-casual uses about 5–7 interstitials per user per day (another passage in the same article says to start at 3–4) and 2–4 rewarded per day. Casual titles split about 50/50 ads/IAP. Tier-1 markets lean IAP, Tier-3 lean ads. [E, CAS.ai, 2025-10 / updated 2026-05; internal inconsistency noted] — [CAS.ai](https://cas.ai/blog/hybrid-monetization-in-mobile-games-a-practical-guide/)
- Interstitials are typically skippable after 5–7 s, at natural breaks. Pacing and capping should be set by A/B testing, with no fixed number. [V, ironSource/Unity, undated] — [is.com](https://is.com/community/academy/monetization/interstitial-and-banner-ads-best-practices)

### Inferences
- Rewarded ads in arcade idle are a hard currency in disguise: the same boosts are sold as permanent IAP. For a game with no ads, the boost system can stay as a design element, earned through play.

### Gaps
- I found no public arcade-idle-specific D7/D30 figures from recent years (2024–2026), and no measured interstitial frequency (seconds or count) for Pizza Ready, Burger Please or My Perfect Hotel.
- AppMagic and Sensor Tower revenue estimates for 2026 were not retrieved: they sit behind a paywall.

## 5. Why hits succeed and why clones fail

### Takeaway
According to analysts, hits succeed through iteration on proven mechanics with a new theme, rapid production, aggressive and well-integrated ad monetization, sustained UA, and (for My Perfect Hotel) months of live-ops iteration. The documented risk for clones and weak titles is repetitiveness without meta, and progression thrown off balance by rewards. I found no systematic public analysis of clone failure.

### Cited Findings
- Supercent's success factors: proven mechanics with a new theme, ad-heavy monetization, effective UA creatives, stable bases. [E, Gamigion, 2025] — [Gamigion](https://www.gamigion.com/?p=16732)
- My Perfect Hotel: accessible but with depth (upgrades, scaling difficulty). Dual active/idle path. Iterative UA and monetization over months, unlike the short life cycle of hyper-casual. Strong live ops. [V/E, Udonis, 2025] — [Udonis](https://blog.udonis.co/mobile-marketing/mobile-games/my-perfect-hotel)
- Burger Please risks: repetitive gameplay leading to retention problems, and rewarded ads that unbalance progression. Suggested fixes: a more active role for the avatar, caps on ad rewards, social features, collections, daily rewards, quests, events. [E, author's opinion, 2025] — [Udonis](https://www.blog.udonis.co/mobile-marketing/mobile-games/burger-please)
- Hybrid games need "a whole new production pipeline" and cannot be treated like hyper-casual. 3–5 months of development and content before launch. [V, Homa, 2022] — [Mobidictum](https://mobidictum.com/arcade-idle-dying-or-not-case-study-aquarium-land/)
- Voodoo: "build and kill fast", 6-week prototype, 10-day test, 3-person team. Metrics come before genre. [V, 2021] — [PocketGamer.biz](https://www.pocketgamer.biz/corentin-selz-voodoo-from-hypercasual-to-hybrid-casual)

### Inferences
- The recurring cause of failure in the sources is not the core loop (which is copied) but the lack of content and meta for the medium term. The advantage of the leaders is operational (UA, live ops, ad tuning).

### Gaps
- I found no post-mortems of failed arcade idle clones, and no data on the share of clones that pass the soft-launch thresholds.

## 6. Web/browser versions (Poki, CrazyGames)

### Takeaway
My Perfect Hotel is on Poki, so arcade idles do exist on the web, but I found no public metrics for them on web (session, saves, controls). Generic Poki data: typical web sessions of 11–20 minutes, players who value immediacy, and abandonment over slow loading.

### Cited Findings
- My Perfect Hotel has a page on Poki. [V] — [Poki, My Perfect Hotel](https://poki.com/de/g/my-perfect-hotel)
- Poki survey (2,000 weekly web gamers, 400 US/UK developers): most common session 11–20 min (29%). 2–3 different games per session (49%). 37% play several times a day. Reasons: free (58%), easy access (56%), jump in quickly (52%), no download (34%). 46% have abandoned a mobile game over slow loading. [V, survey by Poki itself, 2026-07-09; sponsored] — [GameDevReports, Poki](https://gamedevreports.substack.com/p/poki-web-gaming-perceptions-in-2026)
- Poki: the Web Fit Test is required for Final Review. Improve playtime through playtests and the Player Fit Test, and conversion through fast loading and short onboarding. [V, undated] — [Poki SDK](https://sdk.poki.com/web-fit-help)
- PC benchmarks (GameAnalytics, 2025 data): median session 18 min, median daily playtime 32–33 min, PC D1 top 25% 15–16%. [V, 2026-06-04] — [GameDevReports](https://gamedevreports.substack.com/p/gameanalytics-mobile-and-pc-game)

### Inferences
- On web/desktop, sessions are longer than on mobile (11–20 min, versus 5–8 min for top mobile games). A web arcade idle can afford a goal per session that is longer and denser than the mobile equivalent.

### Gaps
- I found no public data on keyboard controls (WASD versus mouse) or saves (localStorage/cloud) for arcade idles on Poki or CrazyGames, and no playtime data per web title. The Poki guides on controls and saves were not fetched in this session.
