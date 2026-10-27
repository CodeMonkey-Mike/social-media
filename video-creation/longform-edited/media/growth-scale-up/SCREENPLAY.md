# growth-scale-up - SCREENPLAY

_Pre-production script for the longform-edited video `growth-scale-up` (AI Engineering Simplified channel). Format owner: `screenplay.md` (Convention 5). Lint: `skills/doc-reference/lint_screenplay.py --face-max 10`. Every tagged line = emoji + BACKTICKED tag; a locked line = 🔒 `[SAY-EXACT]` then its gate; one job per line; no em dashes; the opening IS Chapter 1. Authored 2026-10-25 from the LOCKED brief + Mike's rulings in `PROJECT-LOG.md` and the fact source `DATA.md` (compiled 2026-10-25)._

- **Working title:** How a Growth Engineer Scales Up using AI (Mike's title; alternates for Mike at GATE 1: "Team of One vs Team of Five: Growth with AI Agents" · "Growth Used to Scale With Headcount. Now It Scales With Agents.")
- **Track:** longform-edited (16:9), Mike on camera. **Channel:** AI Engineering Simplified, NOT CryptoRich: no crypto CTA, no community link, the FINAL goes to the project root for Mike to upload (never `longs.json`); a vertical cut and a short are Mike's call at the gate, never started on their own.
- **Archetype / register:** a straight-to-the-point explainer in the shape of Mike's 2023 "Growth Marketer vs Growth Hacker" video (2:05) and the inference video: one idea per line, every line lands with a kinetic-text device, no preamble, no "in this video", no recap. Channel voice = peer-EXPERT: Mike speaks as a working growth engineer from his own seat (ON-SCREEN AUTHORITY), never as a learner. Growth engineering is HIS frame, the AARRR funnel: landing-page conversion, acquisition, onboarding / activation, retention, A/B experiments, scrapped or scaled. Gear map: **CH1 = gear 3** (declarative hook) -> **CH2, CH3, CH4 = gear 2** (the mechanics, polished, declarative edges) -> **CH5 = gear 2 rising to 3** (the rapid-fire plays) -> **CH6 = gear 3** (the close).
- **The spine of the video ALTERNATES between TWO SEATS (Mike, 2026-10-25), every chapter shows both:** **TEAM OF ONE** (the solo growth engineer: strategist, executor and leader; the agents are the team) and **TEAM OF FIVE** (the growth manager, player-coach, whose reports each run their own agents). The seat is signalled on screen by a SEAT TAG (see PRODUCTION CONVENTIONS): a consistent flat-SVG icon + label per seat, one accent per seat.
- **Spine architecture:** full-screen GATED face (longform-edited.md house rule #6), with MORE face than the house norm by Mike's instruction: **10 `[FACE]` lines in the whole video, `--face-max 10`** (CH1 hook, CH1 welcome, CH2 the fork + zero leverage, CH3 the three words, CH3 the anti-pattern verdict, CH4 judgment transfer, CH4 put it in writing, CH5 scale-up mode, CH6 the close, CH6 the subscribe close). Every FACE beat carries its kinetic-text device (a pop, a band, scatter words, the word-by-word payoff, the subscribe button), a sentence or a tight pair, never a bare talking head; everything else is `[COVER]`.
- **Effects theme:** `kinetic-text-2023`, the FULL set (`video-creation/assets/effects/library.json`; sounds `video-creation/assets/sfx/kinetic-text/`; placement rules `skills/overlays/overlays.md` section 2). Every 🎬 `[SHOW]` line that uses a device names its device id and its sound id. A device is motion + sound together, one sound per event, never silent, never two stacked. Icons ARE used (the per-video set is in VISUAL-PLAN, Mike rules it at GATE 1), rendered as flat SVG. Colours and font are the HOUSE look with one accent per seat (VISUAL-PLAN); the motion and the sound pairing are exact. Captions: house default, OFF for the hold of every keyword pop and every band (the text IS the caption there), ON under side panels.
- **Music:** ONE track for the whole video, Claude's pick per Mike's "this time you can choose the music": **`happy-feet`** (Lunareh, "Happy Feet", instrumental 3:31), continuous from frame 0 to the last frame, ducked under the VO and the pops, NO breath and NO bed change at any chapter boundary. Therefore **title cards: NONE**; chapters flow in on `kt-whip-cut`.
- **Container theme:** LIGHT (`--container-theme light`, GRAPH-PROGRESS.json `settings.container_theme`, confirmed by Mike 2026-10-25): the two diagrams, the list cards and the panel text use `container-canonical-light.css`; the kinetic-text devices keep their own looks (dark band and dark panel beside the face, paper beside b-roll).
- **Target runtime:** 3:00 target, 5:00 hard ceiling. Spoken budget as written: around 640 words, which is around 3:45 at Mike's desilenced pace of around 170 words a minute. The overrun is Mike's own additions (all five new plays as one rapid-fire chapter, the own-repo receipt, both seats in every chapter); per-chapter budgets sit on each chapter header. Runtime is never a reason to cut a RECORDED line; OPEN QUESTIONS 8 names what to drop BEFORE recording if Mike wants 3:00 flat.
- **Fact source:** every number, date, name, tool capability and claim traces to `DATA.md` in this folder (compiled 2026-10-25). Chart / receipt IDs C1 to C19 = DATA.md CHART-SOURCE INDEX (C4, C5, C16 are NOT used: Mike ruled no credit, no third-party receipt). Tool claims come from the vendors' own docs, current 2026-10. The repo counts are quoted from the working tree and re-counted on record day.
- **Accuracy pass:** mandatory before Mike records (`video-creation/skills/accuracy-pass/accuracy-pass.md`). The per-chapter verify boxes are the claim-by-claim map to DATA.md; the LIVE re-pull of the volatile rows is the pass itself and is listed in OPEN QUESTIONS 10.

---

## THE HOOK / THESIS

The head-of-growth job used to scale with headcount: the optimization stage, a high-tempo testing program with segmentation, meant a team of around 10 people. With AI agents, a team of one or a team of five can run that tempo. The old move when budget came was to list the work you do not like and hire a junior to do it, which buys no leverage. The new move: hand the low-impact, repeatable work to agents (or stop doing it), and spend every human hour, yours and your reports', on the highest-impact work. Strategy stays human, execution goes to agents, analysis is drafted by an agent and decided by a human (scrap or scale). One-on-ones transfer judgment because the status update is now the agent's job; the trade-offs get written down because an agent only knows the trade-offs you put in writing. In scale-up mode the experiment throughput is bounded by judgment and traffic, not by hands (DATA.md T1 to T6, pillars 1 to 6). This thesis is MIKE'S, said from his seat; the vendor docs support every agent capability it names (pillar 6).

> [!WARNING]
> **NO CREDIT, NO THIRD-PARTY NAME ON SCREEN OR IN THE SCRIPT (Mike, 2026-10-25).** No coach, no framework author, no receipt of any third-party video, no lower-third credit, no clip insert. Every idea is said in Mike's own words as his own growth practice; never quote a line of anyone else's. The researcher's attributed observations do NOT air as numbers: never "7 to 12 person team", never "8 to 11 page brief", never "5 to 8 principles". Airable instead: "a team of around 10", "a long AI-written strategy doc", "write the trade-offs down". DATA.md's C4 ladder, C5 and C16 receipts and all four Capland clip candidates are OUT (DATA.md was researched before this ruling).

> [!WARNING]
> **DO NOT AIR "a team of one does the work of 5, a team of five the work of 20" as a measured fact.** No source measures team-of-one experiment throughput (DATA.md T3, Open question 1). It is Mike's claim from his seat, said with "can" / "now runs" in his words, never "studies show", never a percentage. The locked hook says "can run".

> [!WARNING]
> **DO NOT AIR "AI makes a small-traffic test significant" or "more variants = faster significance".** Sample-size math is unchanged: Evan Miller's calculator example needs 2,545 subjects per variation to detect 10.2 percent to 13.2 percent, and Optimizely's own planning agent returns statistical sizing guidance (DATA.md pillar 5, do-not-air row 8). Airable: "AI drafts more tests, it does not change the sample size a test needs" with C15 on screen (the number stays the site's, never restyled, never spoken).

> [!WARNING]
> **Vendor overclaims that do NOT air (DATA.md do-not-air rows 9 to 14):** never "Amplitude has a churn agent" (what is GA is Custom Agents with a "churn monitoring" TEMPLATE plus predictive churn cohorts); never "Stripe recovers X percent" (not on the Stripe doc; airable: Smart Retries uses AI to pick the retry times, default 8 tries within 2 weeks, shown on C12 only); never "Clarity summarises all your recordings" (a filtered set, 10 at a time); never "ICE / PIE" as a named scoring framework (say "a prioritized backlog"); never "UTM / event hygiene", "lifecycle email drafts", "competitor and review scraping" as named agent capabilities (no vendor doc opened; they are off the C2 card). Never a year on "pirate metrics" (the deck shows none).

> [!WARNING]
> **Growth engineering is described ONLY in the AARRR frame.** Landing-page conversion, acquisition, onboarding / activation, retention, A/B experiments, scrapped or scaled. Outbound sales, GTM sequencing or sales-development language never appears as Mike's description of the role.

---

## CHAPTER MAP

| CH | Production name | Job | Bed | Card | Budget |
|---|---|---|---|---|---|
| CH1 | THE HOOK | Hook (opens the video, no cold open): the `kt-signature-open` names TEAM OF ONE and TEAM OF FIVE on the locked line; the two seats defined as a side-panel pair | **Bed A starts at frame 0** (`happy-feet`, the ONLY bed of the video) | OFF | ~21 s / ~60 words |
| CH2 | THE FORK | Hire for the work you hate vs hand it to agents; "zero leverage" on the face; the AARRR list card C2 of what the agents take; both seats | continues (same file, same region, no breath) | OFF | ~33 s / ~93 words |
| CH3 | WHEN TO USE AI | The three words on the face (scatter words); C1, THE system-design diagram, strategy / execution / analysis in two seat columns; the long-AI-doc anti-pattern; the guardrails | continues | OFF | ~44 s / ~123 words |
| CH4 | ONE-ON-ONES AND DIRECTION | The status update is the agent's job; judgment transfer on the band; say it and have it played back; the trade-offs list card; "an agent only knows what you wrote down"; the one-line own-repo receipt C14; both seats | continues | OFF | ~56 s / ~158 words |
| CH5 | SCALE-UP MODE, RAPID FIRE | Where the testing volume used to force the headcount; the plays card: experiment loop (C3 diagram + receipts), churn agent, Monday digest, programmatic SEO with its one-line policy caveat; one sample-size line; both seats | continues | OFF | ~63 s / ~178 words |
| CH6 | THE CLOSE | The word-by-word payoff on the face; `kt-subscribe-close` with the arrow to the previous video (growth-vs-product), ending on the last word | continues to the last frame | OFF | ~12 s / ~31 words |

The chapter map above is the spine; CH1 carries the hook and the opening, nothing comes before it. Chapter boundaries are `kt-whip-cut` (`swoosh-8`, the chapter-level whip), never a card.

---

## PRODUCTION CONVENTIONS

| Tag | Means |
|---|---|
| 👤 `[FACE]` | spoken, Mike full-screen to camera. More than the house norm on this video (10 of them, max 10), each WITH its kinetic-text device: a sentence or a tight pair, never a bare talking head |
| 🗣️ `[COVER]` | spoken, VO over b-roll with headline pops / the paper list cards / the two diagrams / real product-page receipts. The DEFAULT |
| 🔒 `[SAY-EXACT]` | spoken verbatim, the locked words. A locked line carries its gate written out: 🔒 `[SAY-EXACT]` 👤 `[FACE]` or 🔒 `[SAY-EXACT]` 🗣️ `[COVER]` |
| 🎬 `[SHOW]` | on-screen direction (device id + sound id, b-roll, receipt, diagram cue, seat tag). Not spoken |
| 💬 `[NOTE]` | a note / recommendation to Mike, NOT in the video |
| 🔍 `[VERIFY]` | confirm before it goes on screen |
| 🎞️ `[INSERT]` | a third-party clip plays with its OWN voice while the spine pauses (Convention 6). Names its CLIP-<n> row. Not spoken. NOT USED on this video (Mike ruled no third-party voice) |

**Title cards (Convention 2):** a card lands ONLY at a chapter that STARTS A NEW music bed. This video has ONE continuous bed from frame 0, so the card set that falls out of the MUSIC-MOOD-PLAN is EMPTY: every chapter is OFF and flows in on `kt-whip-cut`.

| CH | Title card | Why |
|---|---|---|
| CH1 | OFF | the hook; frame one is Mike (the signature open) |
| CH2 | OFF | continues Bed A |
| CH3 | OFF | continues Bed A |
| CH4 | OFF | continues Bed A |
| CH5 | OFF | continues Bed A |
| CH6 | OFF | continues Bed A to the last frame |

**FACE/COVER rules (Convention 3, adjusted for this video by Mike):** face is gated OFF by default; a face cut is ONE sentence or a tight pair WITH its device; the line after a face line is explicitly `[COVER]`; build to the transcript, omit beats he did not say. Budget 10, scripted 10.

**THE SEAT TAG (this video's rule, Mike 2026-10-25: the seat is signalled on screen, a consistent label / icon per seat):** every spoken line that belongs to one seat opens with that seat's `kt-icon-pop`: the ONE PERSON icon with the label TEAM OF ONE (seat accent A) or the FIVE PEOPLE icon with the label TEAM OF FIVE (seat accent B), flat SVG (C19), sliding in from the nearest frame edge on the cut that lands the line (riding that cut's `whoosh-4`, no sound of its own) or, when it enters alone on a running shot, on `swoosh-1` (right entry) / `swoosh-2` (left entry). It holds for the life of the line and leaves on the next cut (hard cut, never animated). When the seat line rides a `kt-side-panel`, the seat label is the panel's first line and the icon sits inside the panel: TEAM OF ONE panels are RIGHT, TEAM OF FIVE panels are LEFT, so the pair always alternates per the device rule. The two labels keep their signature-open sounds whenever they return as a keyword pop (`cash-register` for TEAM OF ONE, `wooden-rattle-whoosh` for TEAM OF FIVE), never inside a side panel. A line that speaks to both seats carries no tag.

**Explainer visuals (Convention 4, bounded by the brief for this video):** NO deck of containers; this is the 2023 shape. Covers are b-roll with `kt-headline-over-broll` pops, the `kt-list-card` paper cards (C2 what the agents take, L1 the trade-offs, L2 the plays), real product-page receipts for the tools named in the plays (C6 to C13, C15) and the one own-repo receipt (C14), and AT MOST TWO system-design diagrams: C1 (strategy / execution / analysis, two seat columns) and C3 (the experiment loop), code-rendered so every label is pixel-accurate. Never an AI image as the source of a number; every receipt is a real-site capture, never restyled.

**Kinetic-text devices (overlays.md section 2):** `kt-signature-open` on the hook line only · `kt-keyword-pop` (sound by meaning: `knock-pop` neutral, `minecraft-damage` ONE negative verdict in the whole video, `twinkle` positive, `punch-1-2023` one accent-red glowing word, `cash-register` a money / result word) · `kt-scatter-words` (`pop-1` word 1, `knock-pop` word 2, `pop-1` word 3) · `kt-lower-third-band` with `text_swap` (`swoosh-4` 0.34 s before the band, `knock-pop` on each text) · `kt-list-card` (`fast-swoosh` in, `ting` per item) · `kt-headline-over-broll` (`ea-glitch-21` on a tech b-roll cut, `swoosh-3` on a calm one, then the pop's sound by meaning) · `kt-side-panel` (dark beside the face, `swoosh-1` right / `swoosh-2` left; PAPER beside b-roll or a receipt, always right, `whoosh-4`) · `kt-icon-pop` (the seat tags above plus the concept icons in VISUAL-PLAN) · `kt-word-by-word` (phrases silent, `cash-register-2` on the payoff word) · `kt-subscribe-close` (`cartoon-accent` on the button, `subscribe-button` under it, `cartoon-accent` on the arrow) · `kt-whip-cut` on every angle change (`whoosh-4` default, `fast-reverse-1` / `fast-reverse-5` variety, `swoosh-8` chapter-level). Captions OFF for the hold of every pop and every band.

**Clip inserts (Convention 6):** CONSIDERED on every video. NONE on this one by Mike's ruling (no third-party voice or credit); see `## CLIP-INSERTS`.

---

## CH1 - THE HOOK
**Register:** gear 3, declarative. Short hammer sentences, peer-expert. No "right?" tags, no hedge, no "in this video", no whole-video preview.
**Title card:** OFF. **Music:** Bed A starts at frame 0 (`happy-feet` opens cold_hot on a high peak, so the frame-0 whip rides a downbeat the placement strategist picks; see MUSIC-MOOD-PLAN).
**Budget:** ~21 s, ~60 spoken words.

**Beat 1 - the hook (LOCKED opening, the signature open)**

🔒 `[SAY-EXACT]` 👤 `[FACE]` **Scaling a growth team used to mean headcount. Now a team of one can run the same experiment program that used to take a team of five, and a team of five can run the same experiment program that used to take a team of 20.**
🎬 `[SHOW]` `kt-signature-open`: frame 0 is Mike, `kt-whip-cut` IN onto the face (the open's 0.73 s whip with the 25 to 0 degree roll, `swoosh-4` file start at frame 0), a slow 5 percent punch-in over the line. Label A "TEAM OF ONE" pops on the right third ON the first "one" ("Now a team of ONE") (`kt-keyword-pop` motion, two lines, ONE in seat accent A over TEAM OF in white; `cash-register` starting 0.17 s before it so the bell lands on the word). Label B "TEAM OF FIVE" pops stacked below it ON the SECOND "five" ("and a team of FIVE can run", never the first "take a team of five") (FIVE in seat accent B; `wooden-rattle-whoosh` ON the pop). Both hold to the end of the line. Hard cut (no whip) into the welcome line, the labels cut with it. Captions OFF for the hold.
💬 `[NOTE]` Locked because the two label pops are cued to the first "one" and the second "five"; give each a hair of air. Mike's rewrite (2026-10-27). "can run" stays: the 5-for-1 and 20-for-5 ratios are your claim from your seat, not a measured result (WARNING box 2), never shown as a stat.

🔒 `[SAY-EXACT]` 👤 `[FACE]` **Welcome AI to the growth world.**
🎬 `[SHOW]` Mike looks up and raises both arms on the line (his gesture, Mike 2026-10-27). NO punch-in and no face-reframe zoom on this beat: the frame must keep both raised hands in shot (comp-builder holds the un-zoomed or a looser crop for this window only). `kt-keyword-pop` two-line "WELCOME AI" over "TO THE GROWTH WORLD" in seat-neutral white with the drop shadow, popping ON "Welcome" (`twinkle`, a positive statement). `kt-whip-cut` OUT (the blur-in variant, `whoosh-4`) into Beat 2. Captions OFF for the hold.
💬 `[NOTE]` On record day frame the camera wide enough that both raised hands stay in the 16:9 frame (check the monitor once with arms up before the take); the vertical cut, if ever made, will crop them.
🔍 `[VERIFY]` "around 10 people" is the general form Mike ruled for the researcher's attributed band (DATA.md T1); never the band itself, never a source named.

**Beat 2 - the two seats**

🗣️ `[COVER]` Team of one, you are strategist, executor and leader, and your agents are the team. Team of five, you are the player-coach, and every report runs agents of their own.
🎬 `[SHOW]` `kt-whip-cut` (`whoosh-4`) onto b-roll of ONE person at a desk with two monitors (calm shot). `kt-side-panel` DARK variant on the RIGHT (`swoosh-1` starting 0.17 s before the panel moves; the text rise 0.23 s later is silent): "TEAM OF ONE" over "STRATEGIST · EXECUTOR · LEADER" over "YOUR AGENTS ARE THE TEAM", the ONE PERSON icon inside the panel (the seat tag, rides the panel's sound). The b-roll reframes into the free 55 percent. On "Team of five" `kt-whip-cut` (`fast-reverse-1`) onto b-roll of a small team of five around a table or a whiteboard; `kt-side-panel` DARK variant on the LEFT (`swoosh-2` 0.07 s before): "TEAM OF FIVE" over "PLAYER-COACH" over "EVERY REPORT RUNS AGENTS", the FIVE PEOPLE icon inside the panel. Held to the CH2 whip.
💬 `[NOTE]` No handoff line here on purpose: the 2023 shape whips straight into the body (brief: no preamble). Rotated options, if Mike wants one, are in OPEN QUESTIONS 7.

> [!IMPORTANT]
> CH1 verify list:
> - "used to mean headcount ... a team of one does what took five, a team of five does what took 20" = Mike's own ratios from his seat (rewrite 2026-10-27), T3 (Mike's thesis, "can run"); no source, no stat styling, never a citation.
- "Welcome AI to the growth world." = Mike's line, no claim.
> - "strategist, executor and leader" = T5; "player-coach" = T6 (the player-coach idea applied to Mike's own TEAM OF FIVE seat; no band or number attached to it, Open question 2).
> - "every report runs agents of their own" = the brief's seat definition (PROJECT-LOG); supported by Amplitude Custom Agents being configured per agent "with its own instructions, scope, and tools" (pillar 3).
> - The two face lines above are CH1's face beats (2 of 10). Do not ad-lib another to camera.

---

## CH2 - THE FORK
**Register:** gear 2, declarative edges. One face line (the verdict).
**Title card:** OFF. **Music:** Bed A continues (no breath, no change).
**Budget:** ~33 s, ~93 spoken words.

**Beat 1 - the first-hire fork and the verdict (ONE face shot, Mike 2026-10-27)**

👤 `[FACE]` Now, the fork. Budget shows up for a first hire, and the classic move is to list the work you hate and hire a junior to do it. That buys you zero leverage.
🎬 `[SHOW]` `kt-whip-cut` (`swoosh-8`, the chapter whip) to the face, ONE continuous face shot for the whole line (Mike asked for the budget sentence on camera; it shares the verdict's face beat so the face budget stays at 10). `kt-keyword-pop` "THE FORK" ON "fork" (`knock-pop`), cut with the next device. Face lifted 85 px, `kt-lower-third-band` (`swoosh-4` starting 0.34 s BEFORE the band rises): text 1 "LIST THE WORK YOU HATE" ON "list" (`knock-pop`), `text_swap` to text 2 "HIRE A JUNIOR" ON "junior" (`knock-pop`). The band cuts away (hard, no slide-out) and the hard ~15 percent punch-in lands ON "That", then the two-line verdict `kt-keyword-pop`: "ZERO" in seat-neutral white over "LEVERAGE" smaller, the NEGATIVE verdict sound `minecraft-damage` ON its first frame, ON "zero" (the video's one comedic negative, never again). Held to the next cut. Captions OFF for every hold. No seat tag: the fork is both seats' moment.
🔍 `[VERIFY]` No hiring-scene b-roll here any more; the fork reads on the face.

**Beat 2 - the better move (Mike, 2026-10-27)**

🗣️ `[COVER]` The better move: list the most impactful work, the work that moves the business toward its growth goals, then figure out how someone could spend their time on exactly that.
🎬 `[SHOW]` `kt-whip-cut` (`whoosh-4`) off the face onto b-roll of a prioritization session: sticky notes being ranked on a whiteboard, one card moved to the top (calm shot, `swoosh-3` ON the cut). `kt-headline-over-broll` two-line "LIST THE" over "HIGHEST-IMPACT WORK" pops 0.8 s after the cut (`twinkle`, a positive statement), cut with the next shot. Captions OFF for the hold, ON for the rest of the line. No seat tag: both seats' move.
🔍 `[VERIFY]` DATA.md pillar 1, the second branch of the first-hire fork, said in Mike's words, never quoted, never attributed (Mike's no-credit ruling).

**Beat 3 - what the agents take (TEAM OF ONE, the AARRR list card C2)**

🗣️ `[COVER]` Team of one, that list goes to agents, or you stop doing it. Variant copy for the landing page. Onboarding variants. The weekly funnel readout. Session recording review. Churn flags. Failed payment retries.
🎬 `[SHOW]` C2, the `kt-list-card` on the crumpled paper slides in from the right over everything (`fast-swoosh`, 0.5 s; the face is gone under it); the seat tag TEAM OF ONE + ONE PERSON icon rides the card's slide as its header, top left, no sound of its own. Six items pop ON their spoken words, each on `ting`, earlier items stay and hover: "VARIANT COPY" · "ONBOARDING VARIANTS" · "WEEKLY FUNNEL READOUT" · "SESSION RECORDING REVIEW" · "CHURN FLAGS" · "FAILED PAYMENT RETRIES". Flat fills in seat accent A, no stroke, light theme. The 2023 card held two items, so slide-builder lays six out as two columns of three, caps sized to fit; the AARRR stage of each item is a small sub-line (ACQUISITION · ACTIVATION · ALL · ACTIVATION · RETENTION · REVENUE).
🔍 `[VERIFY]` Every item traces to a vendor doc in DATA.md pillar 6: variant copy and onboarding variants = Optimizely Experiment Planning agent + PostHog AI variants; weekly funnel readout = Statsig AI summary / GrowthBook on-stop summary / PostHog AI results; session recording review = Clarity Grouped Session Insights; churn flags = Amplitude predictive cohorts + Custom Agents churn-monitoring template; failed payment retries = Stripe Smart Retries. The three unsourced items are OFF the card (WARNING box 4).

**Beat 4 - the same fork for the manager (TEAM OF FIVE)**

🗣️ `[COVER]` Team of five, every report builds that list for their slice of the funnel, and the first human hire goes into the highest-impact work, not the leftovers.
🎬 `[SHOW]` `kt-whip-cut` (`whoosh-4`) off the card onto b-roll of a small team at laptops (tech b-roll, `ea-glitch-21` ON the cut). The seat tag TEAM OF FIVE + FIVE PEOPLE icon slides in from the left edge riding the cut's `whoosh-4`. `kt-headline-over-broll` two-line "HIRE INTO" over "THE HIGHEST-IMPACT WORK" pops 0.8 s after the cut (`twinkle`, a positive statement). Captions OFF for the hold. Held to the CH3 whip.

> [!IMPORTANT]
> CH2 verify list:
> - "list the work you hate and hire a junior" = DATA.md pillar 1, the first-hire fork (paraphrased, never quoted, never attributed on screen).
> - "zero leverage" = pillar 1, the no-leverage line, in Mike's words.
> - "goes to agents, or you stop doing it" = pillar 1 ("stop doing it altogether" is the source's own close; "or hand it to an agent" is Mike's update, Open question 8).
> - The six card items and their AARRR stages = pillars 1 and 6 (vendor rows); AARRR stage names = Dave McClure's pirate-metrics deck, no year (do-not-air row 6).
> - "the first human hire goes into the highest-impact work" = pillar 1 ("hiring into that leverage"), Mike's words.

---

## CH3 - WHEN TO USE AI
**Register:** gear 2 explainer, declarative edges, every term glossed in the same line. Two face lines (the three words; the anti-pattern verdict).
**Title card:** OFF. **Music:** Bed A continues.
**Budget:** ~44 s, ~123 spoken words.

**Beat 1 - the three words**

👤 `[FACE]` So when do you use AI, and for what. Strategy. Execution. Analysis.
🎬 `[SHOW]` `kt-whip-cut` (`swoosh-8`, the chapter whip) to the face. `kt-scatter-words` around the head ON the three words: "STRATEGY" right of the head (`pop-1`), "EXECUTION" left of the head (`knock-pop`), "ANALYSIS" on the chest (`pop-1`); all three stay and hover to the cut. House display font, seat-neutral white with the drop shadow. Captions OFF for the hold.

**Beat 2 - the split (C1, THE system-design diagram)**

🗣️ `[COVER]` Strategy stays human, what matters, which bets, what you stop, AI is a sparring partner, never the author. Execution goes to agents, build the variants, draft, instrument, ship. Analysis, the agent drafts the readout, a human calls it, scrap or scale.
🎬 `[SHOW]` `kt-whip-cut` (`whoosh-4`) onto C1, THE system-design diagram of the video (code-rendered, light theme, fills the frame): three columns STRATEGY -> EXECUTION -> ANALYSIS as a left-to-right flow with arrows, each column a container with its owner badge (HUMAN · AGENTS · AGENT DRAFTS, HUMAN DECIDES) and its three verbs; the bottom row carries the two seats side by side, left TEAM OF ONE "you hold the strategy", right TEAM OF FIVE "you write the guardrails" (lit in Beat 5, dark until then). State 1 on "Strategy": the STRATEGY column lights with "what matters · which bets · what to stop" and the small "AI = SPARRING PARTNER" note. State 2 on "Execution": the EXECUTION column lights with "build variants · draft · instrument · ship". State 3 on "Analysis": the ANALYSIS column lights with "agent drafts the readout" and the human "SCRAP OR SCALE" badge. No pop on the diagram (containers stay quiet); the bed carries it.
🔍 `[VERIFY]` The three-way question is the source's; the ANSWER (the split) is Mike's rule and airs as his (DATA.md pillar 2). The ANALYSIS column's "agent drafts, human decides" is what the vendors' own docs say: Statsig "make a ship recommendation", PostHog "whether to ship, extend, or stop", GrowthBook on-stop summary, Clarity's own misinterpretation caveat.

**Beat 3 - the anti-pattern (TEAM OF FIVE)**

🗣️ `[COVER]` Here's the anti-pattern. A report prompts Claude or GPT for a growth strategy, and hands you a long AI-written strategy doc, what do you think.
🎬 `[SHOW]` `kt-whip-cut` (`whoosh-4`) onto b-roll of a long document scrolling on a laptop, page after page (tech b-roll, `ea-glitch-21` ON the cut); the seat tag TEAM OF FIVE + FIVE PEOPLE icon slides in from the left edge riding the cut's `whoosh-4`. `kt-headline-over-broll` two-line "THE LONG" over "AI-WRITTEN STRATEGY DOC" pops 0.8 s after the cut (`knock-pop`). Captions OFF for the hold.
🔍 `[VERIFY]` Never a page count on screen or spoken (WARNING box 1); "Claude" and "GPT" spelled as the products spell them (DATA.md section 3).

**Beat 4 - the verdict**

👤 `[FACE]` That is the agent doing your report's thinking, and it is not why you hired them.
🎬 `[SHOW]` `kt-whip-cut` (`fast-reverse-1`) to the face. `kt-keyword-pop` punch variant: "NOT WHY YOU HIRED THEM" in the device's accent red with the glow, the Zoom Bounce elastic, `punch-1-2023` ON the first frame, ON "not". Held to the next cut. Captions OFF for the hold.

**Beat 5 - who holds what (both seats, C1 bottom row)**

🗣️ `[COVER]` Team of one, you hold the strategy. Team of five, you write the guardrails, where AI is allowed and where it is not, and the team decides inside them.
🎬 `[SHOW]` `kt-whip-cut` (`whoosh-4`) back onto C1, state 4: the bottom row lights, TEAM OF ONE "YOU HOLD THE STRATEGY" (the ONE PERSON icon beside it, seat accent A) ON "Team of one", then TEAM OF FIVE "YOU WRITE THE GUARDRAILS: STRATEGY? EXECUTION? ANALYSIS?" (the FIVE PEOPLE icon, seat accent B) ON "Team of five". The seat icons are part of the diagram state here, no separate sound. Held to the CH4 whip.
💬 `[NOTE]` No "go back and rewatch" line after C1 on purpose: a 3-minute straight-to-the-point explainer has no runtime for the replay invitation and the rule allows zero (OPEN QUESTIONS 9).

> [!IMPORTANT]
> CH3 verify list:
> - "strategy? execution? analysis?" as the three places to allow AI = DATA.md pillar 2 (the source's guardrail questions; leaders "setting guardrails"); the split STRATEGY = human / EXECUTION = agents / ANALYSIS = agent drafts, human decides is MIKE'S rule, aired as his.
> - "AI as a sparring partner, never the author" = Mike's position (pillar 2).
> - "a long AI-written strategy doc ... what do you think" = pillar 2, the anti-pattern, in general words, no page count, no attribution (Mike's ruling).
> - "not why you hired them" = pillar 2 ("probably not the reason why you hired the person"), Mike's words.
> - "the team decides inside the guardrails" = pillar 2 + pillar 3 (operating principles: decide "when you're not in the room"), Mike's words.

---

## CH4 - ONE-ON-ONES AND DIRECTION
**Register:** gear 2, declarative edges. Two face lines (judgment transfer on the band; put it in writing).
**Title card:** OFF. **Music:** Bed A continues.
**Budget:** ~56 s, ~158 spoken words.

**Beat 1 - the status update is the agent's job (TEAM OF FIVE)**

🗣️ `[COVER]` Now, the one-on-ones. Most managers run them as a status update. That's low leverage. Now an agent writes the status update before you even sit down.
🎬 `[SHOW]` `kt-whip-cut` (`swoosh-8`, the chapter whip) onto b-roll of two people in a one-on-one across a small table (calm shot, `swoosh-3` ON the cut); the seat tag TEAM OF FIVE + FIVE PEOPLE icon slides in from the left edge riding the cut's `whoosh-4`; the CALENDAR icon (`kt-icon-pop`) enters alone 1 s later from the right edge on `swoosh-2`. On "writes the status update" a 2 s flash of C6: the Statsig update page, the "AI-Powered Experiment Summary" heading and the "make a ship recommendation" paragraph, real pixels, as a PAPER `kt-side-panel` on the right (`whoosh-4` ON the panel entry) labelled "THE READOUT IS THE AGENT'S JOB".
🔍 `[VERIFY]` "the agent writes the readout" = Statsig AI summary (2025-12-19), GrowthBook on-stop summary, PostHog AI results summary, Amplitude Custom Agents "funnel analysis" as a recurring task (DATA.md pillar 3, pillar 6). The weekly cadence is Mike's practice, no vendor names a weekly AARRR readout.

**Beat 2 - judgment transfer**

👤 `[FACE]` So the whole one-on-one goes to transferring your judgment, so they decide well when you are not in the room.
🎬 `[SHOW]` `kt-whip-cut` (`whoosh-4`) to the face, lifted 85 px so the head clears the band. `kt-lower-third-band` (`swoosh-4` starting 0.34 s BEFORE the band rises): text 1 "THE 1:1 = JUDGMENT TRANSFER" pops ON "judgment" (`knock-pop`), then `text_swap` to text 2 "NOT A STATUS UPDATE" ON "not in the room" (`knock-pop` ON text 2, text 1's one-frame drop silent). Captions OFF for the band hold. Band and face are cut under the next whip, no slide-out.

**Beat 3 - direction, said and played back (both seats)**

🗣️ `[COVER]` Direction, same thing. Say what matters most right now and how each role ladders up to it, then have them play it back to you.
🎬 `[SHOW]` `kt-whip-cut` (`whoosh-4`) onto b-roll of a planning session at a whiteboard, one person pointing, the others nodding (calm, `swoosh-3` ON the cut). `kt-headline-over-broll` two-line "SAY IT." over "HAVE THEM PLAY IT BACK." pops 0.8 s after the cut (`knock-pop`). Captions OFF for the hold.

**Beat 4 - write the trade-offs down (the list card L1)**

🗣️ `[COVER]` And write the trade-offs down. Speed or rigor. Polish or a rough first draft. Spend or protect the budget.
🎬 `[SHOW]` L1, a `kt-list-card` on the crumpled paper slides in from the right (`fast-swoosh`); header "OPERATING PRINCIPLES, IN WRITING". Three items pop ON their spoken words on `ting`, earlier items stay and hover: "SPEED OR RIGOR" · "POLISH OR ROUGH DRAFT" · "SPEND OR PROTECT THE BUDGET". Flat fills, light theme, seat-neutral.
🔍 `[VERIFY]` The three trade-offs = DATA.md pillar 3 (speed vs rigor, polish vs rough first drafts, aggressive spend vs protect ROI), no count of principles spoken or shown (WARNING box 1).

**Beat 5 - the agents only know what you wrote**

👤 `[FACE]` And so do your agents, because an agent only knows the trade-offs you put in writing.
🎬 `[SHOW]` Hard cut off the card to the face via `kt-whip-cut` (`fast-reverse-5`). `kt-keyword-pop` "PUT IT IN WRITING" in seat-neutral white (`knock-pop` ON "writing"). The AGENT icon (`kt-icon-pop`) slides UP onto the chest riding the cut's `whoosh-4`, held to the next cut. Captions OFF for the hold.
🔍 `[VERIFY]` "an agent only knows what you write" is Mike's line; primary support = Amplitude Custom Agents "Configure each agent with its own instructions, scope, and tools" (2026-06-23) and this repo's auto-loaded per-folder instruction files (DATA.md pillar 3).

**Beat 6 - the strategy doc is the context file (TEAM OF ONE, then TEAM OF FIVE)**

🗣️ `[COVER]` Team of one, that strategy doc is the context file every agent reads, my own content operation runs on 29 agent definitions in one folder, with 5 human gates where the judgment stays with me. Team of five, the same doc keeps your people and their agents aligned.
🎬 `[SHOW]` `kt-whip-cut` (`whoosh-4`) onto C14: the real editor view of this repo's `.claude/agents/` folder tree with the file count visible, then one `CLAUDE.md` header, real pixels, nothing retyped; the seat tag TEAM OF ONE + ONE PERSON icon slides in from the right edge riding the cut's `whoosh-4`. `kt-side-panel` PAPER variant on the right (`whoosh-4` ON the panel entry): "TEAM OF ONE" over "29 AGENT DEFINITIONS" over "5 HUMAN GATES". On "Team of five" `kt-whip-cut` (`fast-reverse-1`) onto b-roll of a team reading the same doc on a shared screen; `kt-side-panel` DARK variant on the LEFT (`swoosh-2`): "TEAM OF FIVE" over "ONE DOC" over "PEOPLE AND AGENTS ALIGNED", the FIVE PEOPLE icon inside. Held to the CH5 whip.
🔍 `[VERIFY]` 29 agent definitions (7 shared, 15 longform-edited, 7 root) and 5 HITL gates (screenplay, spine, plan, blueprint, draft) counted 2026-10-25 (DATA.md pillar 3, section 5). The counts MOVE: re-count on record day and change the spoken digits and the panel text to match; the receipt shows the folder on the day. One line only, the video is about growth, not this repo.
💬 `[NOTE]` The screenplay writes the two counts as digits so you read them clean; the panel text carries the same digits.

> [!IMPORTANT]
> CH4 verify list:
> - "most managers run one-on-ones as a status update, low leverage; the 1:1 transfers judgment so they decide well when you are not in the room" = DATA.md pillar 3 (the 1:1 line, paraphrased, unattributed per Mike's ruling); "the status update is the agent's job now" = Mike's AI angle, vendor-supported (Statsig / GrowthBook / PostHog summaries, Amplitude Custom Agents recurring funnel analysis).
> - "say what matters most, how each role ladders up, have them play it back" = pillar 4 (clarify and verify), Mike's words; "repeat it" is folded into "same thing".
> - "speed or rigor, polish or a rough first draft, spend or protect the budget" = pillar 3 (team operating principles), no count.
> - "an agent only knows the trade-offs you put in writing" = Mike's line; Amplitude Custom Agents instructions + this repo's per-folder files (pillar 3).
> - "29 agent definitions, 5 human gates" = section 5 snapshot, re-count on record day (C14).
> - "the strategy doc is the context file every agent reads" = pillar 4, Mike's line, conditional support (Amplitude Custom Agents, this repo).

---

## CH5 - SCALE-UP MODE, RAPID FIRE
**Register:** gear 2 rising to 3. FAST: one line or a tight pair per play, no deep dive, the card and the receipts carry it (Mike, 2026-10-25). One face line (the opener).
**Title card:** OFF. **Music:** Bed A continues; the placement strategist may lift the bed a touch under the card tings.
**Budget:** ~63 s, ~178 spoken words.

**Beat 1 - scale-up mode**

👤 `[FACE]` Now, scale-up mode, where the testing volume used to force the headcount.
🎬 `[SHOW]` `kt-whip-cut` (`swoosh-8`, the chapter whip) to the face. `kt-keyword-pop` "SCALE-UP MODE" in seat-neutral white (`knock-pop` ON "scale-up"). Captions OFF for the hold. Then L2, the plays card, slides in over everything (`fast-swoosh`): a `kt-list-card` on the crumpled paper, header "THE PLAYS", four empty slots; items pop one per play below.
🔍 `[VERIFY]` No headcount number spoken or shown here (WARNING box 1); "where the testing volume used to force the headcount" = DATA.md pillar 5 (the optimization stage: testing, experiments, segmentation), Mike's synthesis "throughput is bounded by judgment and traffic, not by hands".

**Beat 2 - play 1, the experiment loop (C3)**

🗣️ `[COVER]` Play 1, the experiment loop. Agents mine the recordings and the funnel for drop-off, draft a prioritized backlog, plan the test, build the variants and the flag, and write the readout. You pick the bets and call scrap or scale.
🎬 `[SHOW]` L2 item 1 "EXPERIMENT LOOP" pops ON "experiment loop" (`ting`). `kt-whip-cut` (`whoosh-4`) off the card onto C3, the second and last system-design diagram (code-rendered, light theme, fills the frame): a LOOP of six nodes MINE (sessions + funnel) -> BACKLOG (prioritized) -> PLAN (hypothesis · metrics · sizing) -> VARIANTS + FLAG -> READOUT -> HUMAN: SCRAP OR SCALE -> back to MINE; one vendor mark per node in small type (Clarity · Amplitude / Optimizely / Optimizely / PostHog / Statsig · GrowthBook · PostHog / YOU). Nodes light ON their spoken verbs; the HUMAN node lights in seat accent A ON "You pick the bets". No pop on the diagram.
🗣️ `[COVER]` AI drafts more tests. It does not change the sample size a test needs.
🎬 `[SHOW]` On "sample size" a 2 s flash of C15: Evan Miller's sample-size calculator with its worked example visible (the 2,545 per variation stays the site's number, never retyped, never spoken), as a PAPER `kt-side-panel` on the right (`whoosh-4`) labelled "SAME SAMPLE SIZE". Then back to L2.
🔍 `[VERIFY]` Loop steps = DATA.md pillar 6 play (a): Clarity Grouped Session Insights (filtered, 10 at a time); Amplitude AI Agents (press release 2025-06-10); Optimizely Test Ideation agent ("a prioritized package of experiment ideas", "organized by implementation complexity") and Experiment Planning agent (hypothesis, metrics, risks, statistical sizing guidance; docs created 2026-08-12); PostHog AI creates the experiment, the flag and its variants; readout = Statsig / GrowthBook / PostHog; every vendor frames the output as a recommendation a person acts on. "prioritized backlog", never ICE / PIE (WARNING box 4). Sample-size line = pillar 5, C15 (WARNING box 3).

**Beat 3 - play 2, the churn agent**

🗣️ `[COVER]` Play 2, the churn agent. It watches usage and tickets, flags who is likely to leave, retries the failed payments on the best schedule, drafts the save message. You own the template and the offer.
🎬 `[SHOW]` L2 item 2 "CHURN AGENT" pops ON "churn agent" (`ting`). `kt-whip-cut` (`whoosh-4`) onto C11 (Amplitude cohorts doc, "forecast who is likely to convert, churn, or take an action" highlighted) with a PAPER `kt-side-panel` on the right (`whoosh-4`): "CHURN AGENT" over "FLAGS · RETRIES · DRAFTS" over "YOU OWN THE OFFER", the LIFEBUOY icon (`kt-icon-pop`) sliding up into the panel riding the panel's `whoosh-4`. On "retries the failed payments" cut (`fast-reverse-1`) to C12: the Stripe Smart Retries paragraph ("Using AI, Smart Retries chooses the best times...") with "8 tries within 2 weeks" visible on the page, real pixels, 2 s. Optional 1.5 s flash of C10 (Amplitude Custom Agents changelog, the "churn monitoring" template line) under "flags". Then back to L2.
🔍 `[VERIFY]` "flags who is likely to leave" = Amplitude predictive cohorts (doc 2026-09-22) + Custom Agents churn-monitoring TEMPLATE (GA 2026-06-23), never "Amplitude has a churn agent" (WARNING box 4); "retries the failed payments on the best schedule" = Stripe Smart Retries ("Using AI ... chooses the best times"), never a recovery percentage; "drafts the save message, you own the template and the offer" = Mike's practice, no vendor named for it (DATA.md Open question 4). Intercom / Customer.io / Braze are never named.

**Beat 4 - play 3, the Monday digest**

🗣️ `[COVER]` Play 3, the Monday digest. The agent reads the AARRR dashboard, flags what moved, writes the readout. No status meeting.
🎬 `[SHOW]` L2 item 3 "MONDAY DIGEST" pops ON "Monday digest" (`ting`). `kt-whip-cut` (`whoosh-4`) onto b-roll of a funnel dashboard on a monitor with a chat window beside it (tech b-roll, `ea-glitch-21` ON the cut); the FUNNEL icon (`kt-icon-pop`) slides in from the right edge riding the cut's `whoosh-4`. `kt-headline-over-broll` two-line "NO STATUS" over "MEETING" pops 0.8 s after the cut (`twinkle`). Captions OFF for the hold. Then back to L2.
🔍 `[VERIFY]` Readout capability = Statsig / GrowthBook / PostHog summaries, Amplitude Custom Agents "funnel analysis" as a recurring task, Clarity Ad Campaign Insights narrative summaries (DATA.md pillar 6 play (c)); the scheduled weekly AARRR digest by name is Mike's practice, aired as his.

**Beat 5 - play 4, programmatic SEO with its one-line caveat**

🗣️ `[COVER]` Play 4, programmatic SEO. Agents draft acquisition pages at scale, and Google's test is value to the user no matter how the page was made, so a page that adds nothing stays out of search.
🎬 `[SHOW]` L2 item 4 "PROGRAMMATIC SEO" pops ON "programmatic SEO" (`ting`). `kt-whip-cut` (`whoosh-4`) onto C13: the Google Search Central spam-policies page, the "Scaled content abuse" definition with "no matter how it's created" highlighted, real pixels, as the right half beside b-roll of a sitemap or a page grid being generated; a PAPER `kt-side-panel` label "VALUE TO THE USER, NO MATTER HOW IT'S MADE" (`whoosh-4`). Then back to L2 with all four items hovering.
🔍 `[VERIFY]` Google spam policies, "Last updated 2026-08-28": "Scaled content abuse ... no matter how it's created"; "If you're hosting such content on your site, exclude it from Search" (DATA.md pillar 6 play (d)). The caveat is ONE line inside the play, never a risks section.

**Beat 6 - the two seats on the plays**

🗣️ `[COVER]` Team of one, that is your stack. Team of five, every play gets an owner, and the bets land on your desk.
🎬 `[SHOW]` On the full L2 card: the seat tag TEAM OF ONE + ONE PERSON icon slides in from the right edge alone (`swoosh-1`) and spans the card ON "Team of one"; ON "Team of five" the FIVE PEOPLE icon slides in from the left edge alone (`swoosh-2`) and four small owner marks land beside the four items. Held to the CH6 whip.

> [!IMPORTANT]
> CH5 verify list:
> - Every play's agent capability = DATA.md pillar 6 vendor rows, all GA per the vendor's own page (Statsig 2025-12-19; Amplitude Custom Agents 2026-06-23; Clarity Copilot; Stripe Smart Retries; PostHog AI; GrowthBook on-stop summary), Optimizely agents behind the Agent Platform (docs 2026-08-12; the credit-billing claim does NOT air).
> - "AI drafts more tests. It does not change the sample size a test needs." = pillar 5, C15; no number spoken.
> - No vendor name is spoken; the receipts and the diagram carry them (spellings per DATA.md section 3: PostHog, GrowthBook, Statsig, Optimizely, Amplitude, Stripe, Microsoft Clarity).
> - "Team of five, every play gets an owner, the bets land on your desk" = the C1 split applied (strategy human), Mike's words.

---

## CH6 - THE CLOSE
**Register:** gear 3, declarative, forward-looking. Two face lines (the payoff; the subscribe close). Not a hard-out (Mike, 2026-10-25).
**Title card:** OFF. **Music:** Bed A continues to the last frame (the placement strategist decides whether the file's `resolve` ending is right-aligned to the last word or the bed simply ends under it; see MUSIC-MOOD-PLAN).
**Budget:** ~12 s, ~31 spoken words.

**Beat 1 - the payoff**

👤 `[FACE]` Fewer people. Higher velocity. And every human hour on the call only a human should make.
🎬 `[SHOW]` `kt-whip-cut` (`swoosh-8`, the chapter whip) to the face. `kt-word-by-word` at the lower third: phrase 1 "FEWER PEOPLE" ON "fewer" (silent), phrase 2 "HIGHER VELOCITY" replaces it ON "higher" (silent), then the payoff word "JUDGMENT" goes big mid-frame in seat accent A with the glow ON "call" (`cash-register-2` ON the payoff, the scale / result word). Held to the cut. Captions OFF for the hold.

**Beat 2 - the subscribe close**

👤 `[FACE]` Click the subscribe button, and the growth engineer versus product engineer video is right here.
🎬 `[SHOW]` `kt-subscribe-close`: the SUBSCRIBE button grows on the chest ON "subscribe" (keyed `subscribe-button.mp4`, `cartoon-accent` 0.011 s before its first frame, `subscribe-button` landing 0.26 s after it reaches full size); the red arrow pops where Mike points ON "right here" (`arrow-red.png`, Zoom Bounce, `cartoon-accent` on the pop), pointing at the end-screen slot that carries the previous video, growth-vs-product "AI Growth Engineers vs. AI Product Engineers". The video ends ON the last word (no held still, house rule) unless Mike asks for a 2 to 3 s arrow hold for the YouTube end-screen element (OPEN QUESTIONS 5).
💬 `[NOTE]` Mike points to the side where the end-screen element will sit; mirror `arrow-red.png` if he points left. The exact previous video is Mike's call at GATE 1 (OPEN QUESTIONS 4).

> [!IMPORTANT]
> CH6 verify list:
> - "Fewer people. Higher velocity." = DATA.md T3, Mike's thesis in his words; no number, no target, no percentage.
> - The previous video named by the arrow = growth-vs-product, "AI Growth Engineers vs. AI Product Engineers" (same channel, closed 2026-10-23), confirmed by Mike at GATE 1.
> - The close names no crypto community and no CryptoRich link (channel rule).

---

## CLIP-INSERTS

_Considered on every video (Convention 6; rule + pipeline in `skills/clip-inserts/clip-inserts.md`). A clip insert plays with its OWN voice while the spine pauses; never a muted cover._

NONE: DATA.md section 6 found four real clips of Andrew Capland (the 1:1 line 15.0 s, the AI-as-a-senior-employee line 6.8 s, the no-leverage line 10.1 s, the optimization-stage line 13.3 s) and one rejected Sam Altman clip whose audio is unusable. Mike ruled on 2026-10-25 that no third-party voice and no credit appears in this video ("let's just keep Kaplan out of it"), so none of them can air; the ideas are said in Mike's own words. The bed never dips for a clip and the 2023 continuous-music pattern holds end to end.

## MUSIC-MOOD-PLAN

_Mike's instruction (2026-10-25) binds this table: ONE track for the entire video, Claude's pick, from frame 0 to the last frame, no different music per chapter, no breath and no bed change at any chapter boundary, ducked under the VO and the pops, never stopped for a pop (the 2023 pattern). One row per chapter only because the schema wants a row; every row is the same file and the same continuous region. Title cards fall out of this: NONE._

| CH | Mood + gear | Subtle / aggressive | New bed? | Track shortlist (assets/music/library.json) |
|---|---|---|---|---|
| CH1 | hopeful, upbeat pop, gear 3 hook | medium-high (aggression 80, env 7 to 9 for the first 160 s): the file opens cold_hot on a high peak, so the frame-0 whip lands on a downbeat | **Bed A starts at frame 0** (the ONLY bed) | `happy-feet` (Lunareh, "Happy Feet", instrumental, 211 s, 93 bpm, C major, Pop / Classical, Fun / Happy / Inspiring / Hopeful, Cruising / Upbeat / Soaring; `assets/music/Happy Feet/Lunareh_Happy_Feet_instrumental_3_31.mp3`; opening `cold_hot`, ending `resolve`, roles intro_hype / hype_peak / epic_outro; `yt_license_code` KXRKSRZUBNZNMOLF goes in the YouTube description) |
| CH2 | bright explainer, the fork and the list card, gear 2 | ducked under the VO; the tings and the one `minecraft-damage` ride over it | continues (same file, same region, no breath) | `happy-feet` |
| CH3 | steady under the diagram, gear 2 | ducked; the high level reads as pace, not hype, at bed level | continues | `happy-feet` |
| CH4 | steady, the band and the trade-offs card, gear 2 | ducked; the file's one mid-level stretch (160 to 174 s) may fall here or in CH5 depending on the take; no breath either way | continues | `happy-feet` |
| CH5 | brisk, the rapid-fire card rides the drums, gear 2 to 3 | ducked; back up a touch under the four tings per the placement strategist | continues | `happy-feet` |
| CH6 | the close, gear 3 | ducked; the `resolve` ending (202 to 211 s) lands on or just after the last word if the in-point is right-aligned, otherwise the bed ends under the arrow | continues to the last frame | `happy-feet` |

**Usage ledger (run 2026-10-25, `usage_ledger.py report --what music --exclude-project "growth-scale-up"`):** previous video growth-vs-product used proton-streams / innovation / up-in-the-atmos (BLOCKED); the last three videos' tracks (born-every-minute, future-trip, going-shopping-again, it-comes-to-this, lights-out, searching-for-signs-of-life, underworlds, wonderworld) are avoided. `happy-feet` has `used_in: []` (fresh, added 2026-07-16, analyzed 2026-07-22), so it is not blocked and not recent; it is the closest catalog match to the 2023 bed's hopeful-upbeat feel and, at 211 s, long enough to cover a 3:00 to 3:30 take without a loop. If the `music_plan` gate asks for per-chapter variety, Mike's one-track instruction is the waiver (`usage_waivers`). Fit-first alternates if Mike rejects the pick (all fresh, hopeful / happy, long enough): `pathways` (195 s, 104 bpm, cold_hot -> epic_hit), `synthy-waves` (198 s, 100 bpm, cold_hot -> epic_hit), `industry` (242 s, 119 bpm, build -> epic_hit).

**Handed to `music-placement-strategist` (after the spine exists):** the exact in-point (0 s so the cold_hot opening rides the signature open, or right-aligned so the `resolve` ending lands on the last spoken word), the dB under VO, the duck depth under every pop, ting and band sound, the breath-free chapter joins, and, ONLY if the take runs past 3:31, a section loop of the same file (the 53 s chorus or the 32 s verse section cut), never a second track. No carving here.

## VISUAL-PLAN

### Chapter themes (Convention 4b: ONE bed, so ONE look for the whole video; the differential is per SEAT, not per chapter)

💬 `[NOTE]` CONTAINER THEME = LIGHT for this video (Mike, 2026-10-25, GRAPH-PROGRESS.json `settings.container_theme`): the two diagrams C1 and C3, the three list cards and the panel text use `container-canonical-light.css` (warm off-white, near-black text, darkened accents). The kinetic-text devices keep their own looks (dark band and dark panel beside the face, paper beside b-roll).
| CH | Accent | Image style | Note |
|---|---|---|---|
| CH1 to CH6 | seat accent A = #00c2ff (cyan, house; #006A9E on light containers) for everything TEAM OF ONE: its label, icon, panels, card fills and the C1 / C3 human nodes. Seat accent B = #ffd700 (gold; darkened on light containers) for everything TEAM OF FIVE. Seat-neutral pops are white with the drop shadow; the one punch word keeps the device's accent red with the glow | Envato b-roll only: a solo desk with two monitors, a small team of five at a table / whiteboard / laptops, a long document scrolling, a one-on-one across a table, a funnel dashboard with a chat window, a sitemap or page grid generating; no ChatGPT images needed; receipts keep their real pixels | one continuous bed means no visual chapter change; the viewer tracks the SEAT, not the chapter, so the two accents are the differential and must never swap. Mike may swap the two hexes at GATE 1 |

- **The signature open (CH1 Beat 1):** frame 0 is Mike; "TEAM OF ONE" (`cash-register`, seat accent A) and "TEAM OF FIVE" (`wooden-rattle-whoosh`, seat accent B) pop on the right third on the first "one" and the second "five"; then the "WELCOME AI / TO THE GROWTH WORLD" face beat (arms up, no punch-in, `twinkle`); whip out on `whoosh-4`.
- **The SEAT TAGS (C19, `kt-icon-pop`, flat SVG, Mike rules at GATE 1):** ONE PERSON icon + "TEAM OF ONE" (accent A) and FIVE PEOPLE icon + "TEAM OF FIVE" (accent B), on every single-seat line; inside the panel when a panel is up; right side for ONE, left side for FIVE.
- **Concept icons (`kt-icon-pop`, flat SVG in the house accent, Mike rules the set at GATE 1):** CALENDAR (CH4 Beat 1, the one-on-one), AGENT (CH4 Beat 5, on the chest), LIFEBUOY (CH5 Beat 3, the churn agent panel), FUNNEL (CH5 Beat 4, the AARRR dashboard). The FLASK (experiments) is available for CH5 Beat 2 if the C3 diagram is ruled out.
- **C1, THE system-design diagram (CH3 Beats 2 and 5):** STRATEGY -> EXECUTION -> ANALYSIS, owner badges HUMAN / AGENTS / AGENT DRAFTS, HUMAN DECIDES, three verbs per column, "AI = SPARRING PARTNER" under STRATEGY, "SCRAP OR SCALE" under ANALYSIS; bottom row TEAM OF ONE "YOU HOLD THE STRATEGY" (accent A) and TEAM OF FIVE "YOU WRITE THE GUARDRAILS: STRATEGY? EXECUTION? ANALYSIS?" (accent B). Four lit states. Code-rendered, light theme, labels per DATA.md pillar 2.
- **C3, the experiment loop (CH5 Beat 2, the second and last diagram):** MINE -> BACKLOG -> PLAN -> VARIANTS + FLAG -> READOUT -> HUMAN: SCRAP OR SCALE -> MINE; one vendor mark per node (Clarity · Amplitude / Optimizely / Optimizely / PostHog / Statsig · GrowthBook · PostHog / YOU); nodes light on their verbs, the HUMAN node in accent A. Code-rendered, light theme, labels per DATA.md pillar 6 play (a).
- **The three paper list cards (`kt-list-card`):** C2 "WHAT THE AGENTS TAKE" (CH2 Beat 3, six items with AARRR sub-lines, accent A); L1 "OPERATING PRINCIPLES, IN WRITING" (CH4 Beat 4, three items, neutral); L2 "THE PLAYS" (CH5, four items landing one per play, then the two seat tags over the full card).
- **Receipts, real-site captures, never restyled:** C6 Statsig AI summary (CH4 Beat 1, "make a ship recommendation"), C15 Evan Miller sample-size example (CH5 Beat 2, the number stays the site's), C11 Amplitude predictive cohorts (CH5 Beat 3), C12 Stripe Smart Retries with "8 tries within 2 weeks" (CH5 Beat 3), C10 Amplitude Custom Agents "churn monitoring" (CH5 Beat 3, optional), C13 Google spam policies "Scaled content abuse" (CH5 Beat 5). C7 Optimizely, C8 PostHog and C9 Clarity stay as sources in the verify boxes and as the vendor marks on C3; Mike may add any of them as a flash.
- **The own-repo receipt C14 (CH4 Beat 6):** the editor view of `.claude/agents/` with the file count visible and one `CLAUDE.md` header; count re-taken on record day; one line, no deck.
- **NOT on screen (Mike's ruling):** C4 the headcount ladder, C5 the Capland video page, C16 the Fishman newsletter, C17 the McClure deck, C18 Mike's 2023 video page (available if Mike wants a 2 s nod to his own 2023 video in CH1).
- **Headline pops over b-roll:** "THE FORK" (CH2), "HIRE INTO / THE HIGHEST-IMPACT WORK" (CH2, `twinkle`), "THE LONG / AI-WRITTEN STRATEGY DOC" (CH3), "SAY IT. / HAVE THEM PLAY IT BACK." (CH4), "NO STATUS / MEETING" (CH5, `twinkle`). Keyword pops on the face: "ZERO / LEVERAGE" (`minecraft-damage`, the one negative), the scatter words STRATEGY / EXECUTION / ANALYSIS, "NOT WHY YOU HIRED THEM" (punch red), "PUT IT IN WRITING", "SCALE-UP MODE". Band: "THE 1:1 = JUDGMENT TRANSFER" -> "NOT A STATUS UPDATE". Word-by-word close: FEWER PEOPLE -> HIGHER VELOCITY -> JUDGMENT (`cash-register-2`).
- **Panels:** CH1 the seat pair (dark right / dark left); CH4 Beat 1 "THE READOUT IS THE AGENT'S JOB" (paper, over C6); CH4 Beat 6 "TEAM OF ONE / 29 AGENT DEFINITIONS / 5 HUMAN GATES" (paper) and "TEAM OF FIVE / ONE DOC / PEOPLE AND AGENTS ALIGNED" (dark left); CH5 "SAME SAMPLE SIZE" (paper, over C15), "CHURN AGENT / FLAGS · RETRIES · DRAFTS / YOU OWN THE OFFER" (paper), "VALUE TO THE USER, NO MATTER HOW IT'S MADE" (paper, over C13).
- **The close:** `kt-subscribe-close` button on the chest + the red arrow where Mike points at the end-screen slot for growth-vs-product; no end card, no logo bug, no community lower-third (channel rule).

## OPEN QUESTIONS / NEXT SESSION

1. **Title.** Scripted: "How a Growth Engineer Scales Up using AI" (Mike's). Alternates: "Team of One vs Team of Five: Growth with AI Agents" · "Growth Used to Scale With Headcount. Now It Scales With Agents."
2. **The signature open with TEAM OF ONE / TEAM OF FIVE labels, and the SEAT TAG rule:** yes or no. Scripted YES (CH1 Beat 1, `cash-register` on TEAM OF ONE, `wooden-rattle-whoosh` on TEAM OF FIVE; the icon + label on every single-seat line, right for ONE, left for FIVE, accents cyan / gold). If NO on the tags, the seat is carried by the side-panel first lines and the b-roll (solo desk vs small team) only.
3. **The icon set (flat SVG, `kt-icon-pop`):** ONE PERSON, FIVE PEOPLE (the seat tags), CALENDAR, AGENT, LIFEBUOY, FUNNEL; FLASK in reserve. Yes, no, or fewer.
4. **The previous video the arrow points at.** Default growth-vs-product, "AI Growth Engineers vs. AI Product Engineers" (same channel, same topic family), spoken in CH6 Beat 2 as "the growth engineer versus product engineer video". Mike confirms the exact video and its end-screen placement (left or right of the head).
5. **The ending frame.** Scripted: `kt-subscribe-close` ending ON the last word (house rule, no held still). A YouTube end-screen element needs a few seconds of picture, so Mike decides: end on the word, or hold the arrow 2 to 3 s for the end-screen (the 2023 video held it 2.7 s).
6. **The two diagrams.** C1 (CH3, the split, four states) and C3 (CH5, the experiment loop) are the two allowed by the brief and both are scripted. If Mike wants only one, C1 stays and CH5 Beat 2 rides L2 + the receipts C7 / C8 / C6 as flashes with the FLASK icon instead.
7. **Handoff line into the body:** scripted NONE (the 2023 shape whips straight from the hook into CH2; brief: no preamble). If Mike wants one at the end of CH1, rotated per persona `dive_in_variants` (never the most recent "So, let's break it all down."): "So, let's dive into all this." (approved) · "So, let's get into it." (proposed) · "So, let's take this from the top." (proposed). Record his pick back into persona.json the same turn.
8. **Runtime.** As written: around 640 words, around 3:45 against a 3:00 target and a 5:00 ceiling. The overrun is the content Mike added (five plays as a rapid-fire chapter, the own-repo receipt, both seats in every chapter). The lines are already the fewest that carry the six pillars and his rulings; if Mike wants 3:00 flat, the candidates to drop BEFORE recording (never after) are, in order: CH5 Beat 5 (programmatic SEO, around 12 s), CH4 Beat 3 (direction, said and played back, around 9 s), CH1 Beat 2's second sentence (the TEAM OF FIVE definition, around 6 s; the signature open already names the seat), CH5 Beat 6 (the seats on the plays, around 8 s). Any two of those land near 3:25; all four near 3:10.
9. **No "go back and rewatch" line.** The C1 split and the C3 loop are the two dense beats, but a 3-minute straight-to-the-point explainer has no runtime for a 23-word replay invitation, and the hard cap is one per 5 minutes of runtime; the rule allows zero (screenplay.md Register). If Mike wants it, it goes right after CH3 Beat 5 as its own 🗣️ `[COVER]` line with the J-key wording (an engineer audience watches on a computer).
10. **The accuracy pass (mandatory before Mike records).** Every claim above maps to a DATA.md row (the chapter verify boxes); the LIVE re-pull on record day covers the volatile rows: Statsig AI summary page (C6, "make a ship recommendation", 2025-12-19), Optimizely Test Ideation / Experiment Planning agent docs (prioritized, sizing guidance; created 2026-08-12), PostHog AI experiments page (creates the flag and variants; ship / extend / stop), GrowthBook AI integrations (on-stop summary), Clarity Grouped Session Insights (filtered, 10 at a time; 2025-12-01, updated 2025-12-05), Amplitude Custom Agents changelog (GA 2026-06-23, churn-monitoring template) and the cohorts doc (predictive cohorts, 2026-09-22), Stripe Smart Retries ("Using AI ... best times", default 8 tries within 2 weeks), Google spam policies ("Scaled content abuse", last updated 2026-08-28), Evan Miller's example (2,545 per variation, 10.2 to 13.2 percent), and the repo counts (29 agent definitions, 11 `CLAUDE.md`, 25 `SKILL.md`, 5 HITL gates; the spoken "29" and "5" change with the count). The 🔍 `[VERIFY]` lines in the chapters are the same list, in place.
11. **Operating principles placement.** Mike allowed the "principles written as agent instructions" play to live in the one-on-ones chapter instead of the rapid-fire chapter if it reads better; this screenplay puts it in CH4 Beats 4 and 5 (the trade-offs card + "an agent only knows the trade-offs you put in writing") and does NOT repeat it in CH5. Confirm, or move it to CH5 as a fifth L2 item (then CH4 Beat 5 goes).
12. **Spoken "Claude or GPT" in CH3 Beat 3.** Scripted as the two product names a report would actually use. If Mike prefers no product names, say "prompts a chatbot for a growth strategy".
13. **Live 🔍 `[VERIFY]` checklist carried from DATA.md section 5 (nothing here is spoken except the two repo counts):** agent definitions 29 (7 shared, 15 longform-edited, 7 root) · `CLAUDE.md` 11 · `SKILL.md` 25 · slash commands 4 · HITL gates 5 · Evan Miller example 10.2 to 13.2 percent needs 2,545 per variation · Stripe default 8 tries within 2 weeks · vendor doc dates (Statsig 2025-12-19 · Amplitude agents 2025-06-10 · Amplitude Custom Agents 2026-06-23 · Amplitude cohorts 2026-09-22 · Optimizely agent docs 2026-08-12 · Clarity 2025-12-01, updated 2025-12-05 · Google 2026-08-28).
14. **Pronunciations for the take:** "AARRR" as the letters A-A-R-R-R or "the pirate funnel", Mike's choice (the card spells it AARRR); "PostHog" as "post hog"; "Statsig" as "stat sig"; "GrowthBook" as one word; "one-on-one" spoken, "1:1" only on screen.
