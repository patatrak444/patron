# Supercent arcade idle: gameplay content of Pizza Ready!, Burger Please!, Prison Life

Research date: 2026-10-29. About 26 tool calls. Status labels: **[V]** = stated by a cited source (store listing, guide written by someone who played, or developer text). **[R]** = user review, anecdotal. **[I]** = my inference. Hard numbers (prices of goods, unlock costs, stack caps) are almost entirely missing from public text sources. They exist only in gameplay videos, which could not be watched here. Each gap is listed under its question.

Cross-cutting source facts:
- Supercent was founded in Seoul in 2021 by Junsik Kong. It moved from hypercasual to idle arcade in 2022–23 and was the most downloaded Korean publisher of 2023 (~230M total downloads by end of 2023, per AppMagic). [V] — [Gamigion, "Inside Supercent", 2025-10-28](https://www.gamigion.com/?p=24750)
- Burger Please launched Feb 2023 and Pizza Ready launched Jun 2023 [V] ([Gamigion](https://www.gamigion.com/?p=24750)). Prison Life released 2023-11-17 [V] ([appsmenow](https://appsmenow.com/walkthrough/189307-prison-life-idle-game/part-5-level-13)). The iOS history of Prison Life starts at v1.5.0 on 2024-02-29 ([App Store](https://apps.apple.com/US/app/id6472412918)), so the 2023 date is probably a soft launch [I].

---

## C1 Core loop (second by second)

### Takeaway
All three games use the same verb: hold to move with a joystick, walk over a station to pick up or drop items as a stack, and walk over cash piles to collect them. Pizza Ready is documented best. It runs oven → carry pizzas → counter, plus table cleaning and cash pickup. Prison Life swaps food for prisoner needs.

### Cited Findings
- Pizza Ready: the control is "1-tap and hold" and there is no losing state [V]. The player carries pizza from the oven to the counter, boxes go to the take-out section, and trash from dine-in tables goes to the bin. Cash appears as stacks at counters and tables, and only the player (the manager) can collect it. Staff cannot. [V] — [LevelWinner, 2023-08-25](https://www.levelwinner.com/pizza-ready-guide-tips-tricks-strategies/)
- Pizza Ready: "Upgrade boxes": you stand on one and cash unloads into that section. These are the unlock pads. [V] — [LevelWinner](https://www.levelwinner.com/pizza-ready-guide-tips-tricks-strategies/)
- Pizza Ready: you start right in the action with no main menu and a line of customers already waiting [V]. — [Gamigion Pizza](https://www.gamigion.com/pizza/)
- Burger Please: a virtual joystick combined with a stacking mechanic. The goal is serving customers quickly and expanding. [V] — [Udonis, 2025-05-28](https://blog.udonis.co/mobile-marketing/mobile-games/burger-please)
- Burger Please store text: "grill patties, stack ingredients, and serve" [V]. — [App Store UK](https://apps.apple.com/gb/app/burger-please/id1668713081)
- Prison Life: you manage the prison from intake to release. Prisoners need food, hygiene and recreation, and you balance order and satisfaction "to prevent escapes and disturbances" [V, developer text]. — [App Store US](https://apps.apple.com/US/app/id6472412918)
- Prison Life: you "admit new prisoners, meet their needs, upgrade rooms, manage staff" [V]. — [Google Play](https://play.google.com/store/apps/details?id=io.supercent.prison&hl=en_US)

### Inferences
- [I] The one cash rule (staff never collect money) keeps the player physically necessary even after full automation. This is a key design lever.
- [I] The Gamigion Pizza article describes "knead dough, add sauce… with quick taps". That conflicts with LevelWinner's walk-and-carry loop and probably describes ad creatives, not the game. Segwise also notes "fake gameplay loops" in some creatives ([Segwise](https://segwise.ai/blog/pizza-ready-creative-strategy-analysis-2025.md)).

### Gaps
- Cycle timings: seconds per pizza, per burger, per customer. Not found anywhere.
- Prison Life's second-by-second loop is only described generically. Whether the player escorts prisoners, carries food trays, or cleans toilets is unconfirmed in text. It can probably be seen in YouTube walkthroughs ([part 1](https://www.youtube.com/watch?v=MgspY0uplQg)).

---

## C2 Stations and production chain

### Takeaway
For Pizza Ready the first-store chain is known (oven → counter or packing → take-out, plus tables and trash). Burger Please's chain is only partly known (grill → burger stack → counter → drive-thru, then fries, drinks, pizza later). Prison Life lists facilities (kitchen, gym, mine, visiting room, phone room, toilets, cells) but not their input→output order.

### Cited Findings
- Pizza Ready, first pizzeria [V] — [LevelWinner](https://www.levelwinner.com/pizza-ready-guide-tips-tricks-strategies/):
  - Oven: pizzas appear there and are carried to the counter.
  - Serving/dine-in counter: customers are served here.
  - Packaging counter: makes boxed pizzas.
  - Take-out section: receives boxes and generates cash.
  - Tables and chairs: dine-in seating. Tables must be cleaned of trash before reuse.
  - Trash bin: where trash is dropped.
  - Additional ovens and oven improvements can be bought, and tables add customer capacity.
- Pizza Ready store text: counter or drive-thru service. "Cook recipes, design a menu, serve, clean the kitchen" [V]. Google Play adds upgrades to ovens, equipment and stations, plus chef and cashier staff [V]. — [App Store US](https://apps.apple.com/us/app/-/id6450917563); [Google Play](https://play.google.com/store/apps/details?id=io.supercent.pizzaidle&hl=en_US)
- Burger Please: "Start with one counter and upgrade it into a drive-thru". The menu includes burgers, fries, drinks and pizza, and "new food types bring new levels and customer types" [V]. — [App Store UK](https://apps.apple.com/gb/app/burger-please/id1668713081); [Google Play](https://play.google.com/store/apps/details?id=io.supercent.burgeridle&hl=en_US)
- Burger Please staff tasks: bring burgers to the register, serve, pick up trash, run the drive-thru. That implies a chain of grill/burger machine → counter → customer or drive-thru window, with trash coming back. [V] — [Udonis](https://blog.udonis.co/mobile-marketing/mobile-games/burger-please)
- Burger Please: the author "found no noticeable output change from stove upgrades" [V, opinion]. — [Udonis](https://blog.udonis.co/mobile-marketing/mobile-games/burger-please)
- Burger Please YouTube title: "Helper & Drive Thru Unlocked" in walkthrough part 2. The drive-thru comes after the first helper. [V, title only] — [YouTube](https://www.youtube.com/watch?v=ztn-F9BsDqY)
- Prison Life facilities named: gyms, mines, kitchens, visiting rooms [V] ([App Store](https://apps.apple.com/US/app/id6472412918)), plus guard areas, work areas and hygiene ([Google Play](https://play.google.com/store/apps/details?id=io.supercent.prison&hl=en_US)). Also a restaurant, a playground and a visitation room unlocked by XP level ([WriterParty](https://writerparty.com/party/prison-life-idle-game-best-hacks-tips-cheats-and-strategies/)), and a phone call room ([App Store review](https://apps.apple.com/US/app/id6472412918)).
- Prison Life: rooms have multiple stations, and "the third station in a room is generally not worth its cost" [V, low-quality source]. — [WriterParty](https://writerparty.com/party/prison-life-idle-game-best-hacks-tips-cheats-and-strategies/)

### Inferences
- [I] Pizza Ready forks into two outputs from one source: dine-in pizza and boxed take-out/drive-thru. Dine-in adds a cleaning back-loop (trash). That gives three item types to carry: pizza, box, trash.
- [I] Prison Life's mine is probably a work station that produces income from prisoners, and the kitchen a needs station.

### Gaps
- Whether Pizza Ready has toppings or ingredient stations (dough, cheese) beyond the oven. No reliable text source says so. The Tap Guides "all levels" article describing recipes and patience is judged generic and probably AI-written, so it was not used ([Tap Guides](https://tap-guides.com/2026/07/11/pizza-ready-all-levels-walkthrough/)).
- Burger Please: the full station list per restaurant, and the order in which fries and drinks appear.
- Prison Life: the full input→output chain (for example kitchen → trays → cafeteria) is not documented.

---

## C3 Carried stack

### Takeaway
Pizza Ready's stack starts at **1 item** for both player and staff and grows through 5-level capacity upgrades. Exact caps are not published. Whether items can be mixed is not confirmed.

### Cited Findings
- Pizza Ready: "You and each crew member carry 1 item at a time at base." Items are a pizza, a boxed pizza, or trash. Capacity upgrades raise this, but no numeric values are given. A temporary capacity boost (gloves icon) also exists. [V] — [LevelWinner](https://www.levelwinner.com/pizza-ready-guide-tips-tricks-strategies/)
- Pizza Ready ad creatives heavily show pizzas stacking (resource collection appears in 68% of ads) [V, about ads]. — [Segwise](https://segwise.ai/blog/pizza-ready-creative-strategy-analysis-2025.md)
- Burger Please: separate capacity upgrades exist for the avatar and for staff, and rewarded ads give temporary or permanent capacity boosts. The premium bundle includes 2x capacity. [V] — [Udonis](https://blog.udonis.co/mobile-marketing/mobile-games/burger-please)
- Prison Life: upgrades raise "speed and prisoner capacity, including worker capacity" [V, low-quality]. — [WriterParty](https://writerparty.com/party/prison-life-idle-game-best-hacks-tips-cheats-and-strategies/)

### Inferences
- [I] With 5 capacity levels starting from 1, the cap is probably single digits to low teens. This is unverified and should not be used as a number.

### Gaps
- Max stack per level, whether different item types can be mixed in one stack, and whether trash shares the stack. Not in any text source.

---

## C4 Unlocks and expansion

### Takeaway
You expand by paying cash into floor pads ("upgrade boxes"). The order roughly runs counter, then helper, then drive-thru, then more ovens, tables and sections, then new stores reached through a city map. No unlock costs are published.

### Cited Findings
- Pizza Ready: you stand on an upgrade box and cash unloads into the section. Purchasable items include extra ovens, oven upgrades, the counter, the take-out section, and tables and chairs. [V] — [LevelWinner](https://www.levelwinner.com/pizza-ready-guide-tips-tricks-strategies/)
- Pizza Ready: you can open new restaurants before maxing the current one. A city map icon (upper left) lets you fast-travel between restaurants to claim earnings, and each new store unlocks a new crew uniform. [V] — [LevelWinner](https://www.levelwinner.com/pizza-ready-guide-tips-tricks-strategies/)
- Pizza Ready reader comment: a user was stuck after "Mama John's" (apparently a store name) and the path to new stores was unclear [R]. — [LevelWinner comments](https://www.levelwinner.com/pizza-ready-guide-tips-tricks-strategies/)
- Burger Please: helper and drive-thru unlock in the early part ([YouTube title](https://www.youtube.com/watch?v=ztn-F9BsDqY)). The store text says "Open new branches, unlock new burger levels" [V] ([App Store UK](https://apps.apple.com/gb/app/burger-please/id1668713081)).
- Burger Please review (2023-11-01): unlocking new stores needs so much money that you must watch ads, and a new store showed "coming soon" for a week despite 100% completion [R]. — [App Store UK](https://apps.apple.com/gb/app/burger-please/id1668713081)
- Prison Life: ranking up the prison unlocks new facilities [V] ([App Store](https://apps.apple.com/US/app/id6472412918)). Each XP level unlocks upgrades, rooms and workers ([WriterParty](https://writerparty.com/party/prison-life-idle-game-best-hacks-tips-cheats-and-strategies/)).
- Prison Life: upgrading a cell offers a choice of **3 designs**. One is a premium design (unlocked by ad) that earns more coins per prisoner. [V, low-quality] — [WriterParty](https://writerparty.com/party/prison-life-idle-game-best-hacks-tips-cheats-and-strategies/)

### Gaps
- Cost of any pad in any game. Pad order beyond the first few. Whether there are multiple floors (none mentioned for any title).

---

## C5 Workers and automation

### Takeaway
An HR office sells **hire / move speed / capacity**, and a matching player office sells **speed / capacity / profit**. In Pizza Ready each has 5 levels with exponential cost, which makes 30 office upgrades. Hires are a one-time payment and automate tasks in a fixed order (counter first, then oven→counter). Staff do everything except collect cash.

### Cited Findings
- Pizza Ready: two offices. The HR office sells crew Move Speed, Capacity and Recruit. The Upgrade/manager office sells player Move Speed, Capacity and Profit. Each has **5 levels**, costs rise exponentially, **one level-1 upgrade per office is free**, and the rest cost cash or an ad. Total: **30 office upgrades**, and the guide estimates the 28 paid ones at ~14 min of ads at 30 s each. [V] — [LevelWinner](https://www.levelwinner.com/pizza-ready-guide-tips-tricks-strategies/)
- Pizza Ready: hiring is a one-time payment. The first hires run the counter and the next ones move pizza from oven to counter. Staff are slower than the player and pause between tasks (a snooze icon shows). They can do any task except collecting cash. [V] — [LevelWinner](https://www.levelwinner.com/pizza-ready-guide-tips-tricks-strategies/)
- Pizza Ready: an ad-extended "robot assistant" exists. Watching an ad keeps it working longer. [V] — [Gamigion Pizza](https://www.gamigion.com/pizza/)
- Burger Please: the HR office upgrades employee move speed and capacity and hires staff. Staff bring burgers to the register, serve, pick up trash, and run the drive-thru. Rewarded-ad cash makes hiring easy early, "leaving the avatar with little to do." [V] — [Udonis](https://blog.udonis.co/mobile-marketing/mobile-games/burger-please)
- Burger Please: a Christmas update (v1.1.0, 2023-12-26) added new staff. [V] — [App Store UK](https://apps.apple.com/gb/app/burger-please/id1668713081)
- Prison Life: you hire and upgrade prison officers ([App Store](https://apps.apple.com/US/app/id6472412918)), and workers automate side rooms ([WriterParty](https://writerparty.com/party/prison-life-idle-game-best-hacks-tips-cheats-and-strategies/)). [V]
- Prison Life review (2024-07-31): worker and activity-room upgrades didn't appear until the game was restarted (a bug) [R]. — [App Store](https://apps.apple.com/US/app/id6472412918)

### Gaps
- Number of workers per store, hire costs, the exact point in minutes when automation appears.

---

## C6 Customers

### Takeaway
Pizza Ready customers are unlimited and choose dine-in or take-out/drive-thru. No failure or patience penalty is documented. Burger Please adds delivery orders, VIP guests and sudden crowds as events. In Prison Life the "customers" are prisoners with needs (food, hygiene, recreation), and neglect is visible as clogged toilets and soiled cells.

### Cited Findings
- Pizza Ready: customers are unlimited, there is no losing state, and dine-in customers leave trash [V]. — [LevelWinner](https://www.levelwinner.com/pizza-ready-guide-tips-tricks-strategies/)
- Pizza Ready: counter or drive-thru [V] ([App Store US](https://apps.apple.com/us/app/-/id6450917563)). A review mentions a "take a 15 second break" ad prompt after deliveries [R] ([Google Play](https://play.google.com/store/apps/details?id=io.supercent.pizzaidle&hl=en_US)).
- Pizza Ready: "customers become pickier" later [V, vague]. — [Gamigion Pizza](https://www.gamigion.com/pizza/)
- Burger Please: delivery orders, VIP guests, sudden crowds and pizza events are listed as daily challenges [V]. Cars honk when leaving the drive-thru [R]. — [App Store UK](https://apps.apple.com/gb/app/burger-please/id1668713081)
- Prison Life: on level 1, prisoners clog toilets and soil their cells if you idle, so the game can't be left running [R, review dated Feb 12]. Prisoners who go outside sometimes award **stars**, which are needed to pass levels, and later levels need more stars [R, 2024-12-13]. — [App Store](https://apps.apple.com/US/app/id6472412918)

### Gaps
- Customer arrival rate, order size (number of pizzas per customer), any patience timer or leave-angry behavior in Pizza Ready or Burger Please.

---

## C7 Economy and pacing

### Takeaway
The economy is cash only on the floor. Upgrade costs rise exponentially (5 tiers), and income is boosted by ads (cash bags, 2x offline, speed and capacity buffs). Players report ad interruptions every ~1–5 min. IAPs are No Ads, ad-skip tickets, weekly packs, battle passes and skins. Prices of goods are not published.

### Cited Findings
- Pizza Ready: buy the cheapest upgrade first and keep idle cash low [V, guide advice]. Offline income accrues up to a cap, and an ad doubles it. A permanent idle-profit upgrade is unlocked by ad. Random floating ad icons offer instant cash, a temporary speed boost (more than 2x walk speed), or temporary capacity. Costumes cost cash or 3 ads, and some carry profit buffs. The shop offers free cash and skip tickets for ads. [V] — [LevelWinner](https://www.levelwinner.com/pizza-ready-guide-tips-tricks-strategies/)
- Pizza Ready IAP (US): No Ads $3.99; gems $2.99; weekly premium pack $5.99; ad-free pack $9.99 / $8.99 (15% off); video (skip ticket) $1.99; manager pack $5.99; growth offer $9.99; "prpro" $19.99; battle pass $8.99 [V]. — [App Store US](https://apps.apple.com/us/app/-/id6450917563)
- Pizza Ready: IAP revenue was $345,481 in the last 30 days (undated) and revenue per download is ~$0.11 in Tier-1 countries and under $0.05 globally ([Gamigion Pizza](https://www.gamigion.com/pizza/)). June 2025 had 15.6M downloads and $285K IAP, and 2025 had 66M+ installs through July ([Segwise](https://segwise.ai/blog/pizza-ready-creative-strategy-analysis-2025.md)). [V] The game is ad-monetized first [I].
- Pizza Ready ad pacing, reviews: about one interruption per minute (2025-05-06); a 25 s ad per 60 s of play (2025-04-06); forced ad "breaks" every few minutes (2026-03-07) [R]. — [Google Play](https://play.google.com/store/apps/details?id=io.supercent.pizzaidle&hl=en_US)
- Burger Please: banner ads during play; interstitials "fairly often", skippable after 5 s; rewarded cash bags and speed or capacity boosts. Premium bundle **$12.99** (skin, vehicle, no ads, 2x money/speed/capacity), plus ad-skip tickets. [V] — [Udonis](https://blog.udonis.co/mobile-marketing/mobile-games/burger-please)
- Burger Please IAP (UK): No Ads £3.99; gems £2.99; RV Skip Ticket 10 £1.99; ad-skip ticket 10 £2.99; VIP weekly £5.99; all-in-one week £5.99; ads-free pack £9.99; Starter Pack 2 £5.99 [V]. v0.38.0 (2023-11-06) added an offer system and a new Segway (vehicle) [V]. — [App Store UK](https://apps.apple.com/gb/app/burger-please/id1668713081)
- Burger Please reviews: ad about every 4 min (2025-07-17) and every 5 min (2023-07-27); three ads paid out "482k", judged too little [R]. On Google Play: every 60–90 s (2024-12-23), and 5–6 forced ads in 10 min (2026-07-14) [R]. — [App Store UK](https://apps.apple.com/gb/app/burger-please/id1668713081); [Google Play](https://play.google.com/store/apps/details?id=io.supercent.burgeridle&hl=en_US)
- Prison Life IAP (US): No Ads $3.99; No Ads Premium $6.99; 4 player skin packs at $5.99; 4 officer skin packs at $9.99. v43.1.0 (Jan 2026) "Improved in-game ads". [V] — [App Store US](https://apps.apple.com/US/app/id6472412918)
- Prison Life: "forced ads every 30 seconds" (2026-08-27) and "every minute" (2026-07-20) [R]. — [Google Play](https://play.google.com/store/apps/details?id=io.supercent.prison&hl=en_US)

### Gaps
- Sale price of a pizza or burger, unlock costs, the cost multiplier per upgrade level, and the role of gems (gem IAPs exist, but what gems buy is not documented).

---

## C8 Long-term progression

### Takeaway
Pizza Ready and Burger Please progress by opening new stores or branches on a city map (Pizza Ready's chain spans "states"), with battle passes and events. Prison Life uses an XP or rank level, stars and themed prison worlds (Alcatraz, then Soviet at level 20, then Wasteland, then Top Secret), with at least 5 prisons. No prestige system is documented.

### Cited Findings
- Pizza Ready: expand into multiple locations and chain restaurants across states, with levels and events [V] ([App Store US](https://apps.apple.com/us/app/-/id6450917563)). A city map is used for fast travel ([LevelWinner](https://www.levelwinner.com/pizza-ready-guide-tips-tricks-strategies/)). A battle pass exists as an IAP ("s6battlepass2") [V]. The "s6" prefix suggests season 6 [I].
- Pizza Ready: Google Play was updated 2026-10-13 and has 100M+ downloads, 4.4★ [V] ([Google Play](https://play.google.com/store/apps/details?id=io.supercent.pizzaidle&hl=en_US)). It has 221M downloads overall ([Gamigion Pizza](https://www.gamigion.com/pizza/)).
- Burger Please: v1.6.0 (2024-01-20) added a battle pass and new facilities, v1.1.0 brought a Christmas update, and there are several "new content" updates up to v12.0.0 (2025-02-17). The latest iOS version is 31.7.0 (27 Aug, presumably 2026) [V]. — [App Store UK](https://apps.apple.com/gb/app/burger-please/id1668713081)
- Burger Please: 20M+ downloads within months ([Udonis](https://blog.udonis.co/mobile-marketing/mobile-games/burger-please)). Google Play shows 100M+ and 4.2★, updated 2026-05-15 ([Google Play](https://play.google.com/store/apps/details?id=io.supercent.burgeridle&hl=en_US)). [V]
- Burger Please: Udonis found no events, daily rewards, quests or collection albums (May 2025) [V]. That conflicts with the current store text listing daily challenges and events ([App Store UK](https://apps.apple.com/gb/app/burger-please/id1668713081)). Events were probably added later, or the marketing text overstates them [I].
- Prison Life: level 20 moves you from Alcatraz to a Soviet prison, followed by a wasteland prison and a top-secret prison [V, low-quality]. — [WriterParty](https://writerparty.com/party/prison-life-idle-game-best-hacks-tips-cheats-and-strategies/). The "SOVIET" and "Wasteland" worlds are confirmed by an App Store review (2024-07-31) and a YouTube title ("part 6 SOVIET Prison") — [App Store](https://apps.apple.com/US/app/id6472412918); [YouTube](https://www.youtube.com/watch?v=pzN7tE4UFKs)
- Prison Life: progress slows at "prison 5" [R, 2026-07-11] ([Google Play](https://play.google.com/store/apps/details?id=io.supercent.prison&hl=en_US)). Stars are needed to pass levels ([App Store review](https://apps.apple.com/US/app/id6472412918)). v9.0.0 (2024-06-10) "New stage added" [V]. It has 50M+ downloads and 4.1★ and was updated 2026-10-22 ([Google Play](https://play.google.com/store/apps/details?id=io.supercent.prison&hl=en_US)).

### Gaps
- Exact number of restaurants or maps per game in Oct 2026, store names in order, store unlock requirements, and any prestige or reset system.

---

## C9 First minutes / onboarding

### Takeaway
There is almost no tutorial text. Arrows guide the player to each next station, and rewarded ads are introduced inside the tutorial itself. The free first-level upgrades in Pizza Ready's offices act as a tutorial for the upgrade rooms.

### Cited Findings
- Pizza Ready: the tutorial is minimal, with initial arrows pointing where to go [V] ([LevelWinner](https://www.levelwinner.com/pizza-ready-guide-tips-tricks-strategies/)). There is no main menu or complicated tutorial and customers are already queued ([Gamigion Pizza](https://www.gamigion.com/pizza/)).
- Pizza Ready: one free level-1 upgrade per office [V]. — [LevelWinner](https://www.levelwinner.com/pizza-ready-guide-tips-tricks-strategies/)
- Burger Please: a step-by-step tutorial with red arrows, and rewarded ads introduced during the tutorial [V]. — [Udonis](https://blog.udonis.co/mobile-marketing/mobile-games/burger-please)
- Burger Please early order from walkthrough titles: first restaurant → helper and drive-thru unlocked in part 2 [V, titles]. — [YouTube pt 1](https://www.youtube.com/watch?v=qIqoG3vNLns); [YouTube pt 2](https://www.youtube.com/watch?v=ztn-F9BsDqY)
- Pizza Ready: early upgrades come fast, and later ones take longer [V]. — [Gamigion Pizza](https://www.gamigion.com/pizza/)

### Gaps
- A minute-by-minute script of the first 5–10 minutes (which pad is first, its cost, when the first hire happens). This needs a video viewing.

---

## C10 Theme expressed in mechanics

### Takeaway
Pizza Ready and Burger Please express their theme through station types (oven, box, drive-thru, tables, trash) and their vehicle and uniform cosmetics. Prison Life's developer text claims an order versus satisfaction balance to "prevent escapes and disturbances". No public source confirms a working escape or riot mechanic. The only documented threat is a mess state (clogged toilets, soiled cells) when you neglect prisoners.

### Cited Findings
- Prison Life developer text: "balance order and satisfaction to prevent escapes and disturbances", and "keeping prisoners under control" [V, marketing]. — [App Store US](https://apps.apple.com/US/app/id6472412918); [Google Play](https://play.google.com/store/apps/details?id=io.supercent.prison&hl=en_US)
- Prison Life: neglected prisoners clog toilets and soil cells [R]. Stars come from prisoners who go outside [R]. A premium cell design earns more coins per prisoner [V, low-quality]. Officer skin packs are sold at $9.99 each. — [App Store](https://apps.apple.com/US/app/id6472412918); [WriterParty](https://writerparty.com/party/prison-life-idle-game-best-hacks-tips-cheats-and-strategies/)
- Prison Life work areas (mine) turn prisoner labour into income, and the visiting and phone rooms are recreation or needs stations [V for existence of the rooms; function is I]. — [App Store](https://apps.apple.com/US/app/id6472412918)
- Pizza Ready: each store unlocks a new crew uniform, and costumes can carry profit buffs [V]. Burger Please sells vehicles (Segway, premium-pack vehicle) [V]. — [LevelWinner](https://www.levelwinner.com/pizza-ready-guide-tips-tricks-strategies/); [App Store UK](https://apps.apple.com/gb/app/burger-please/id1668713081); [Udonis](https://blog.udonis.co/mobile-marketing/mobile-games/burger-please)

### Inferences
- [I] Prison Life's threat layer looks soft (mess, slower star gain) rather than a fail state. No source mentions an escape you have to chase down, or riots. Treat the "escapes" in the store text as unconfirmed marketing.
- [I] For a narco-themed game (PATRÓN), Prison Life is the closest template: an illicit or authority theme mapped onto the same carry-and-serve loop, with "needs" stations replacing food stations and the threat shown as a visible mess rather than losing.

### Gaps
- Whether escapes or riots actually happen in Prison Life, and what triggers them. This needs gameplay footage ([walkthrough part 1](https://www.youtube.com/watch?v=MgspY0uplQg)).
- The meaning of "intake to release" (is release a cash event?).

---

### Source reliability notes
- Strong: App Store and Google Play listings (fetched 2026-10-29), [LevelWinner](https://www.levelwinner.com/pizza-ready-guide-tips-tricks-strategies/) (hands-on, 2023, so it may be outdated), [Udonis](https://blog.udonis.co/mobile-marketing/mobile-games/burger-please) (hands-on, 2025).
- Weak: [WriterParty](https://writerparty.com/party/prison-life-idle-game-best-hacks-tips-cheats-and-strategies/) (generic, does not name the developer, but its world names match reviews). [Gamigion Pizza](https://www.gamigion.com/pizza/) (mixes ad creative with gameplay).
- Rejected: [Tap Guides "all levels"](https://tap-guides.com/2026/07/11/pizza-ready-all-levels-walkthrough/). It is generic, with recipe and patience mechanics that don't match the arcade idle loop, and is probably AI-generated.
- Failed to fetch: Marlvel intel report, fptshop (Vietnamese guide), TrueAchievements, Supercent Notion press pages (rendered empty).
