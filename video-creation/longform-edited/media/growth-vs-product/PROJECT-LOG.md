# growth-vs-product — PROJECT-LOG

Decision trail + resume pointer for this longform-edited video. Created 2026-10-20 by the longform
graph (`python video-creation/longform-edited/graph/run.py longform --project "growth-vs-product"`); the graph
records its gate approvals in `GRAPH-PROGRESS.json` next to this file.

## Concept brief (LOCKED for GATE 1 — Mike rules on it together with the screenplay)

**Working title:** AI Growth Engineers vs. AI Product Engineers (alternates: "AI Growth Engineer or AI Product Engineer: Which One Are You?" · "The Difference Between an AI Growth Engineer and an AI Product Engineer").
**Channel:** AI Engineering Simplified (@aiEngineeringSimplified), NOT the CryptoRich channel. **Track:** longform-edited (16:9), Mike on camera. **Archetype:** a tight head-to-head explainer, a REMAKE of Mike's 2023 video "Growth: The Differences Between Growth Marketers and Growth Hackers" (2:05, GrowthMarketingMike) with the two AI roles in place of the two marketing roles, at the same pace. **Runtime target: 5:00** (hard window 4:30 to 5:45).
**Spine architecture:** full-screen GATED face (house rule #6), house cover layer. The ONE device borrowed from the 2023 video is its signature open (the two role labels popping in with their two sounds while Mike says the hook line on camera, see Hard constraints); the rest of the video is house style. **Captions ON** (house default).
**Register:** peer-expert, conversational, confident (ai_channel_plan.md "core intention"). Gear 3 for the hook and the close; gear 2 for the body. Never the crypto hype register.

**The 2023 reference, its STRUCTURE (study it, keep the shape, never copy its lines):**
- Hook, one sentence: "So what are those subtle differences between a growth marketer and a growth hacker?" while the two labels pop onto the screen one after the other.
- "Aside from the general difference that..." (one line that names the obvious stereotype and moves past it).
- Difference 1: what each one optimizes for (brand vs attribution), with a worked example (a tweet vs a podcast interview: hard to attribute).
- Difference 2: the speed each one works at (rapid vs sustainable), with a worked scenario (conversion rate already high, so buy traffic vs spend weeks on interviews and SEO), ending on the one-line contrast ("compounding growth as a long-term investment" vs "rapid results").
- Difference 3: the bias of each one (technology vs business and people), then what the better one is uniquely good at (difficult business problems, qualitative research).
- CTA.
Our version keeps that spine: hook with the two labels, the stereotype line, three (at most four) real differences each with one concrete worked scenario, then "which one should you hire, which one should you become", then the channel's CTA.

**Opening thesis (every claim to be verified in DATA.md before it airs):** "AI engineer" has split into two jobs that companies now post under two titles, AI growth engineer and AI product engineer, and most people, including the people hiring for them, use the titles interchangeably. They are not the same job. One is paid to move a number on the growth side of the business with AI (acquisition, activation, conversion, retention, content and outbound at scale, experiments that get killed or scaled), the other is paid to build the AI inside the product itself (the feature the user touches: its quality, evals, latency, cost, the UX around a model that is wrong sometimes). Same tools, different scoreboard.

**Pillars (each needs DATA.md facts, drawn from REAL job postings with the posting URL, company, date and the exact wording; if a pillar cannot be sourced from primary material the research says so):**
1. What the two titles actually are: when they appeared, who posts them (company stage and size), what a representative posting for each asks for. Primary sources: live public job postings (Greenhouse, Lever, Ashby, company careers pages, LinkedIn public posts) plus Mike's own job-radar data in `linkedin-automation/private/` (his find-jobs run already classifies "AI growth engineer" and "AI product engineer" postings; read the postings it captured and cite them). Show the two role definitions side by side.
2. Difference 1, THE SCOREBOARD: what each role is measured on. Growth: funnel metrics, experiment velocity, attribution (did this AI-written sequence, this AI-personalized page, this agent-run outbound campaign move signups or revenue, kill it or scale it). Product: the AI feature's quality metrics (eval scores, task success rate, latency, cost per request, retention of the feature itself). The worked scenario mirrors the 2023 "tweet vs podcast" beat: one AI thing that is easy to attribute vs one that is not.
3. Difference 2, THE CLOCK: speed vs durability. Growth engineers run many cheap experiments against live traffic and keep what works. Product engineers build the slow loop: evals, guardrails, retrieval quality, model upgrades without regressions. Worked scenario mirroring the 2023 "conversion rate already high" beat: a growth engineer meets a target with an AI-powered outbound or paid loop this week; a product engineer spends the same weeks on an eval set and retrieval fix that compounds.
4. Difference 3, THE BIAS: growth engineers lean toward distribution, data and marketing systems (CRM, analytics, ad platforms, content pipelines, agent workflows glued to GTM tools); product engineers lean toward the model and the user (prompting, RAG, agent architecture, latency, UX for uncertain outputs). What each is uniquely good at.
5. Which one to hire, which one to become: the stage of company that needs each first, the overlap (both ship LLM code, both need evals, both need to read data), and the honest line on titles drifting (a "founding AI engineer" is usually both). This is the "growth marketers are the people who can solve difficult business problems" beat of the 2023 video, written for both roles.

**Chapter map (5:00):**
- CH1 (0:00 to 0:35) TWO TITLES, ONE WORD, gear 3. The hook line is a `[FACE]` beat, locked verbatim: "What are the differences between an AI growth engineer and an AI product engineer?", and the two role labels pop in on it with their two sounds (the signature open of the 2023 video). Then the stereotype line, COVER.
- CH2 (0:35 to 1:40) THE SCOREBOARD, gear 2. Difference 1 with its worked scenario, house COVER (containers + b-roll).
- CH3 (1:40 to 2:45) THE CLOCK, gear 2. Difference 2 with its worked scenario, ending on a one-line side-by-side contrast container.
- CH4 (2:45 to 3:50) THE BIAS, gear 2. Difference 3, the two tool stacks as a system-design diagram (the only diagram in the video).
- CH5 (3:50 to 4:35) WHICH ONE, gear 2 to 3. Hire which first, become which, the overlap.
- CH6 (4:35 to 5:00) THE CLOSE, gear 3. One line, then this channel's CTA (subscribe), unless Mike calls a hard-out.

**Open decisions for Mike at GATE 1:** the title; whether the video is three differences or four; whether the 2023 colour pairing of the two labels (yellow for role A, green for role B) is kept on the house dark palette or swapped for two house accents; CTA vs hard-out.

## Hard constraints (Mike)

- Runtime 5:00 (accept 4:30 to 5:45). Runtime is a target, never a reason to propose cutting recorded content.
- This video is for the AI Engineering Simplified channel. Register and CTA come from video-creation/ai-engineering/ai_channel_plan.md (peer-expert, conversational, confident), NOT from the CryptoRich hype persona in persona.json. No crypto CTA, no CryptoRich link, no ticker talk. persona.json still governs the mechanical rules: no em dashes anywhere, verified claims only, the spoken word-choice list.
- ON-SCREEN AUTHORITY (hard rule, Mike, 2026-07-01, full text in ai_channel_plan.md): never frame Mike as a co-beginner. No "I am learning this too". He has held growth roles and builds AI systems; on camera he explains.
- THE SIGNATURE OPEN OF THE 2023 VIDEO IS REPRODUCED ON THE HOOK LINE, AND ONLY THAT (Mike, 2026-10-20: "just reproduce the text effect and the sound effect in the first 3 seconds; the rest of the effects maybe in another video"). Reference: `D:\Dropbox\mikeneder.me\videos\GrowthMarketingMike\004 Differences between Growth Marketer and Hacker\main-sequence.mp4` 0:00 to 0:04, cue sheet from its Premiere project in `video-creation/assets/sfx/kinetic-text/2023-CUE-SHEET.md`. The device, exactly:
  - Mike on camera (`[FACE]`), the hook line locked verbatim: "What are the differences between an AI growth engineer and an AI product engineer?" A slow punch-in on him while he says the two names.
  - On "AI growth engineer" the ROLE LABEL A pops in on the right third of the frame: two lines, "AI GROWTH" in role A's accent colour over "ENGINEER" in white, in **Montserrat ExtraBold Italic** (read from the 2023 Premiere project's text layers: PostScript name `MontserratItalic-ExtraBoldItalic`, 57 layers; the only other face in that project is Arial Black on 4 layers; load it in Remotion via `@remotion/google-fonts/Montserrat`, weight 800 italic), drop shadow, with sound `cash-register` (assets/sfx/kinetic-text, the 2023 sound for label A).
  - About 0.5 s later, on "AI product engineer", ROLE LABEL B pops in stacked below it: "AI PRODUCT" in role B's accent colour over "ENGINEER" in white, with sound `wooden-rattle-whoosh` (the 2023 sound for label B). Two different sounds, one per role; the same two sounds fire again whenever those two labels reappear later in the video.
  - The 2023 open also whips IN onto the face at frame 0 (`swoosh-4`) and whips OUT to the next angle after the labels (`whoosh-4`); the comp reproduces both whips around the hook beat.
  - Accent pair: the 2023 pair is yellow (role A) and green (role B); Mike rules at GATE 1 whether that pair stays on the house dark palette or two house accents replace it. The labels are built in Remotion as a reusable overlay and the rule is written into skills/overlays/overlays.md before the comp is built.
- Everything after the hook beat is HOUSE STYLE: gated face (at most 8 `[FACE]` beats in the whole video, the hook being one), house cover layer (system-design containers, b-roll, receipts), house transitions, captions ON per the house default. ONE more 2023 device is allowed (Mike, 2026-10-21): `kt-side-panel` (skills/overlays/overlays.md section 2, with its paired sounds `swoosh-1` / `swoosh-2` from assets/sfx/kinetic-text) on the "this or that" FACE lines that contrast the two roles (CH2 / CH3 / CH4 payoff lines): right panel = growth verdict, left panel = product verdict, replacing the pair-contrast cards. No other 2023 device (no kinetic keyword pops on the face, no lower-third bands, no paper cards) in this video.
- SOUND EFFECTS for the open come from `video-creation/assets/sfx/kinetic-text/library.json` (the 2023 project's own files, triggers noted per sound). The rest of the video uses the house SFX library (Impacts/, risers/, accents/) per the edit plan.
- Every on-screen claim about either role comes from DATA.md with a primary source: real, dated job postings (URL, company, company size, date, exact wording) and, where the two titles' history is claimed, a dated primary article or posting. No invented salary numbers, no invented adoption percentages. If a number cannot be sourced it is not said.
- Mike's own job-radar data (linkedin-automation/private/, the find-jobs output) is a legitimate primary source for what postings say; cite the posting, never the dashboard.
- Mandatory accuracy pass (video-creation/skills/accuracy-pass/accuracy-pass.md) on the screenplay before recording.
- Explainer visuals are system-design containers (node + arrow) per screenplay.md Convention 4; the two tool stacks (CH4) is the marquee diagram. No tables of prose.
- Terminology: "AI growth engineer" and "AI product engineer" (spoken in full the first time, then "growth engineer" / "product engineer" is fine), "evals", "attribution", "experiment". Spell out an acronym the first time it is said. No em dashes.
- No cold open: the hook lives in CH1 (the signature open IS the hook). No "this is the whole video" spoiler line. Caveats are lines, not a section.

## Decisions

- **2026-10-20 — created.** Working title: AI Growth Engineers vs. AI Product Engineers. Folder laid out per comp-build.md
  section 13a (raw/ · spine/ · assets/ · _previews/); the brief + constraints above are the
  commission for `data-researcher` (DATA.md) and `screenplay-strategist` (SCREENPLAY.md).
- **2026-10-20 — scope of the 2023 borrow narrowed (Mike, while research ran).** Only the signature open (the
  two role labels with their two sounds on the hook line) is reproduced; the rest of the video is house style.
  The launch passed `--face-max 20` for the earlier FACE-forward plan; that is now only the lint ceiling, the
  constraint is the house 8. The 2023 project's SFX were lifted into `video-creation/assets/sfx/kinetic-text/`
  (library.json with each sound's 2023 trigger + 2023-CUE-SHEET.md); the full device catalogue is kept there
  for a future video.

- **2026-10-20 — GATE 1 rulings so far.** Mike's LinkedIn headline / profile stays out of the video entirely (screenplay
  open question 10 resolved; nothing else in the script changes). Remaining gate questions 1 to 9 still open.
- **2026-10-20 — GATE 1 revision commissioned (Mike).** (a) The base roles come FIRST: after the hook, define a
  growth engineer (pushes the product out to customers, onboarding, retention, the growth of the business) and a
  product engineer (builds the product's features for the customer, does not market it) with NO AI talk, then put
  AI in front of both titles, then the thesis. (b) No mention of Mike's 2023 video anywhere; growth marketer vs
  growth hacker only where it serves a point about growth itself. DONE the same day: SCREENPLAY.md revised
  (base roles first, the 2023 line and C13 deleted), then TIGHTENED on Mike's "trim it down by about a
  minute, under 5 minutes": every trim-first line cut (CrowdStrike adoption, Arize, Sean Ellis, GovWell
  read-aloud, the pay line), no company spoken except Anthropic (Citian never spoken; the receipts carry the
  names), CH4 stack walk and CH5 shortened. Spoken words ~830 by the repo counter (strategist's count 762),
  about 4:30 to 4:55 at 170 wpm before card breaths. Lint PASS, 7 FACE beats. Record: SCREENPLAY open
  questions 14 and 15. Pre-revision copies in the session scratchpad only.
- **2026-10-21 — GROWTH ENGINEERING IS THE AARRR FUNNEL, NOT OUTBOUND SALES (Mike).** The CH3 worked scenario
  (an AI-personalized outbound sales sequence triggered by job changes and funding rounds, sourced from the
  Clera GTM-engineer posting) is NOT growth engineering as Mike has practised it: "for me what you're
  describing is sales ... growth engineering is all about increasing conversion rates and acquiring the
  customer, the pirate funnel, AARRR". Rewritten: the growth engineer adds an AI onboarding step, sees within
  days whether more signups activate, scrapped or scaled by Friday (alternate in the NOTE: an AI save offer in
  the cancel flow, retention). Every other spoken growth line re-anchored to landing pages, onboarding,
  retention, experiments; "outbound" and "pipeline" are gone from the VO (they survive only as posting quotes
  in verify lists and as C1 diagram nodes the VO does not name). Standing rule for this channel: describe
  growth engineering in Mike's own practice (AARRR, conversion, retention), never in GTM-sales terms.
- **2026-10-21 — REDUNDANCY PASS (Mike: "nothing redundant ... straight to the point ... another 30 seconds ...
  from a growth engineer perspective").** Screenplay-strategist cut 105 words by its count (repo counter: 846 ->
  739, about 4:20 of speech at 170 wpm, delivered cut around 4:10 to 4:30): the postings-pattern sentence and the
  Anthropic counter-example in CH5 (C14 dropped), "pick your scoreboard" + the scoreboard list restated in CH5,
  the experiment-count clause in CH2, "scrapped or scaled" in CH3 (CH2 already has "kill it or scale it"), the AI
  personalization clause repeated in CH4, "Same tools" in CH4 (kept only in the thesis and the CH6 bookend), the
  model-upgrade clause said twice in CH3. Vocabulary swaps: "the go-to-market stack" -> "the funnel" (VO + C3c
  card); CH4 growth nodes spoken as landing pages / analytics / marketing automation / the A/B testing framework;
  "turns a marketing problem into software marketers can run" -> "takes a business problem, a low conversion
  rate, and ships the fix". No company name spoken anywhere now. Record: SCREENPLAY open question 16. Previous
  version in the session scratchpad (SCREENPLAY.v3-aarrr.md).
- **2026-10-21 — SIDE PANELS on the "this or that" face lines (Mike).** The 2023 `kt-side-panel` device (catalogued
  the same day by the kcc20 session: overlays.md section 2 + the `devices` block of assets/sfx/kinetic-text/
  library.json, sounds `swoosh-1` right / `swoosh-2` left) is planned onto the three contrast FACE lines (CH2 /
  CH3 / CH4 Beat 4): right panel with the growth verdict, `kt-whip-cut` on "the other", left panel with the product
  verdict. The pair-contrast cards C3a / C3b / C3c are retired (the verdict is said once). Hard constraint above
  amended. Also reworded the same day: CH5 "kill your own work on a Friday" -> "throwing away a week's work when
  the test says it lost". SCREENPLAY open question 17 carries the four sub-decisions for GATE 1.

- **2026-10-22 — RECORDED + SCREENPLAY APPROVED AS-IS (Mike).** Raw master `raw/2026-10-21 13-24-26.mkv` (14:58,
  1080p30, one take = scope ALL). Mike: "i already recorded. no need to change the screenplay now" / "screenplay is
  approved". The GATE 1 rulings still listed as open (title, three vs four differences, label accents, CTA vs hard-out,
  handoff line, CLIP-1, side-panel sub-decisions 17a-d) are settled by what was recorded or move to the plan stage;
  AS-RECORDED.md carries the divergences the defumbler reported: the CH1 tail "fast, and worth what they cost" and the
  "Comment below which one you are" sign-off were not recorded, "Let's dissect this a bit" replaces "So, let's dive
  into all this". Spine prep ran through the graph: proxy 898 s -> defumbled 545 s (26 retake cuts, 0 partials,
  0 clipped joins, 8 ms drift) -> cover-blackout (7 FACE windows, 81.5 % black) -> coarse desilence 700 ms (3:43).
- **2026-10-22 — SPINE REVIEW (Mike listened to the coarse spine `spine/ALL.c.desilenced.mp4`).** "I think it's great."
  No bursts, nothing to change. Final silence definition = the canonical defaults: 250 ms intro (CH1, split in the
  pause after "So let's dissect this a bit") / 500 ms body. Sentence residual: 50 ms of dead silence kept after the
  sentence at every cut (`--pad-tail 0.05 --pad-head 0`; COVER scenes only, the graph's `--pad-cover-only`), which
  meant a `--redo desilence_coarse` with the pad before the tight pass, since both passes carry it. The "a test set
  known with good answers" word-order take (coarse 1:38-1:43; the one correct take could not be cut inside silence)
  stays as recorded (Mike: "We can keep the test set phrase too"); the last take "Their feature's pass rate" is kept.

- **2026-10-22 — SPINE APPROVED; OVERNIGHT RUN TO THE DRAFT (Mike: "spine approved ... take it all the way out to the draft
  render ... I completely approve you to take it right through the next gate").** Final spine `spine/ALL.d.desilenced.mp4`
  (3:40, 676 words; final pass split 52.94 s after "So let's dissect this a bit", 12 cuts, 5.4 s removed, 50 ms residual on all).
  The orchestrator drives the plan and blueprint gates itself (each plan reviewed before its approval) and STOPS at the draft
  gate. Defaults taken in Mike's absence, every one reversible at the draft gate:
    - CLIP-1 (Hamel Husain, 8.8 s) stays OUT: the screenplay was approved as-is with the row HELD and no `[INSERT]` line, so
      AS-RECORDED carries no insert and COVER-PLAN `clip_inserts` is empty with the reason.
    - The two role accents are the 2023 pair the approved VISUAL-PLAN assumes (yellow = growth, green = product) on the house
      dark palette; the house display font, not Montserrat (overlays.md section 2 house adaptation).
    - CTA as recorded (like + subscribe, ends on "channel."); the house end screen, no subscribe-button pop (the "no other 2023
      device" rule stands without Mike's waiver). Title unchanged (working title in the header).
    - Side panels per SCREENPLAY open question 17 a-d (cards retired, silent labels, no panels on the thesis line, captions ON).
    - The transcript's as-heard words: "lean" (CH4 face line, captioned) is captioned "leans"; "leaning" / "market automation" /
      "Their feature's" are cover beats (no captions), left to AS-RECORDED.
  Pipeline fix made the same evening so the two 2023 devices reach the comp: overlays.md section 2 gained the composite
  `kt-signature-open` (whip-in `swoosh-4`, label A `cash-register` 0.17 s early, label B `wooden-rattle-whoosh`, whip-out
  `whoosh-4`; the 2023 cue sheet's 0.00 / 1.83 / 2.43 / 3.13), the edit-plan skill + `edit-plan-author` now place every
  screenplay `[SHOW]` device as `[KT-PANEL]` / `[KT-POP]` rows with `[WHOOSH]` / `[ACCENT]` sound rows (the kcc20 shape,
  which `mix_music.py` already mixes) and a `## KINETIC TEXT` cue-sheet section, and `comp-build.md` + `comp-builder` build them
  by copying kcc20's `KtSidePanel` / `KtKeywordPop` into the project's own file.

- **2026-10-22 — PLAN GATE APPROVED by the orchestrator (overnight delegation).** COVER-PLAN: 40 cover beats fill every black
  second (185.0 s), Envato 7/11, ChatGPT 5/5, 10 receipts (C4 CrowdStrike and C5 Citian as 2 + 3 distinct crops, C7 GovWell
  twice, C6, C10, C12), 17 containers (the C2 role-card family in four states, two title cards, the loop diagram in two states,
  the AARRR funnel, C1 in three states, two animated charts, the declared become-compare two-column card), `clip_inserts`
  empty with the reason. MUSIC-PLAN: Bed A proton-streams (CH1, -17 under), Bed B innovation (CH2 to CH4, one 16-bar loop,
  -18 under), Bed C up-in-the-atmos (CH5 to CH6, -18 stepping to -16, END-PINNED so its closing hit lands on "channel." at
  219.40 with trim true, the mix cut on the last frame); variety PASS, all three beds fresh. Judgment calls accepted as the
  strategists proposed, each reversible at the draft gate:
    - The screenplay's four house motion-type cards (A BUSINESS NUMBER, KILL IT OR SCALE IT, SHIP TO LEARN, WITHIN DAYS) ride as
      the headline / takeaway line of the container they sit on, so no card falls under the 5 s floor (restore as kinetic pops
      in the edit plan if Mike wants them separate).
    - LABEL B's AI line keeps "evals, grounding, latency, cost" (sourced from the Citian posting) although "fast, and worth what
      they cost" was never spoken; trim to "evals, grounding" if Mike prefers the card to echo only the words.
    - C1 state 1 runs 7.3 s because IMG-3 (the funnel render) takes 2.5 s before it; the diagram's three states total 22.3 s.
      Drop IMG-3 to give state 1 the full 9.8 s if the walk reads rushed.
    - CH5 Beat 1 shows one readable posting per sentence (C7b GovWell 5.6 s, C6 MISUMI 4.2 s) instead of the screenplay's four
      1.5 s flashes.
    - Bed C takes the end-pin (the explicit CH6 ask: the hit on the last word) over a waveform build through CH5; the
      alternative is one number (source_in 120.0, no end-pin). Bed B's mood tags are Quirky / Happy / Fun; the fresh alt if it
      reads too playful under the receipts is `slide`.
    - LinkedIn logged-out captures (C4a / C4c / C5a / C5b / C5c) may hit a login wall: C4 has the Accel mirror, Citian has none,
      so a gated Citian hands its slots to the C7 bench views.
  The declared comparison (`become-compare`) must be listed in the comp's `COMPARISON_REFS` or `lint-deck-containers.py`
  fails it (the comp-builder's gate). The card waiver key "WHICH ONE?" matches the AS-RECORDED chapter header's `card ON`
  label, which is what `card_pauses` reads.

- **2026-10-23 — ASSET FACTORY: visual-qa round 1 failed 4 of 93, round 2 failed 2 of 4 (orchestrator repairs).** Round 1: BR-3
  (a pale high-key stopwatch) and BR-6 (a bright daylight office handshake) broke the dark grade; C12 and C7b were clipped at the
  bottom edge. Recycled and re-driven: the envato-sourcer re-sourced both clips dark (PASS), the receipt-capturer recaptured both.
  Round 2: C12's paragraph file was failed for carrying no title / date, but C12 is a two-file receipt (the header file with the
  masthead, title and Mar 20, 2025 date passed) and the QA was scoped to the one file, so the verdict was overridden to PASS in
  `assets/VISUAL-QA.json` with the reason (the paragraph crop is clean). C7b came back as the near-full page again because the
  title and the target bullet sit 1100 CSS px apart; its spec in COVER-PLAN / BROLL-PLAN now asks for TWO files (title block,
  then a tight crop of the "What you'll do" first bullet with the highlight anchor), recycled and re-driven a third time.
  visual-qa also noted, without failing: the C2 / ship-to-learn / become-compare cards show their unspoken lines in grey from the
  start and light them on cue (the house sub-spotlight pattern; the SHIP TO LEARN headline is readable about 5.7 s early) and C4a
  carries no posting date (LinkedIn prints it on the applicant-count line, hidden with the counter). Both for Mike at the draft.

- **2026-10-23 — BLUEPRINT GATE APPROVED by the orchestrator (overnight delegation).** EDIT-PLAN.md (223 events, 61 SAY lines,
  lint PASS, zero orphans) + CUE-SHEET.md + TRANSITIONS.md / TRANSITION-PLAN.json (58 scene changes), reconcile + docset lints
  PASS. Checked against the 2023 devices: the signature open as its parts (0:00.0 whip-in `swoosh-4`, 0:02.0 LABEL A
  `cash-register`, 0:03.6 LABEL B `wooden-rattle-whoosh`, 0:04.7 whip-out `whoosh-4`), the three `kt-side-panel` pairs on the
  F3 / F4 / F5 verdict lines (`swoosh-1` right, `kt-whip-cut` + `whoosh-4` on "the other", `swoosh-2` left), 12 role-label
  pops in all, captions on all 7 faces + the 7 Envato clips, both title cards with `card-impact-layered`, the declared
  `become-compare` comparison. Reconcile needed four hand fixes to the event log (plan ids moved onto the event line of the
  frame-0 whip-in, the 4.7 s whip-out and the two cardless chapter entries; the F5 face-out re-tagged film burn; the EOF
  `hand:cut` row added) and one tool fix: `reconcile_docs.py` treated a 0:00.0 event's time as missing (`0.0 or -9`) and
  re-tagged the frame-0 row on every apply; fixed to test for None. Transition picks accepted as the strategist proposed, each
  reversible at the draft gate:
    - Card move `rmn:flip` from-right on both cards (ledger WARN: inside the last three; slide is BLOCKED by kcc20, the two
      fresh moves book-flip / swap need the canvas-draw-element render flag verified first).
    - Face pick film burn on all 10 regular face edges (sound budget: three cut-ins land 0.1 s before a panel swoosh); the
      screenplay's undefined "house whip" at the cardless CH3 / CH4 entries resolved as the same film burn.
    - MELT/RGB short at 113.90 (the loop returning out of the funnel; ledger WARN, the only unblocked melt look) and SPIN/Twirl
      at 132.14 (the C1 marquee, cw) and 187.78 (the verdict board, ccw); GLITCH/Monitor on the five AI stills.
    - The PRODUCT label sound fires with the visible pop at 18.92 (not under the C12 receipt at 15.0 as the cover plan had it).
    - Over IMG-5 the two role labels hold only 1.1 s / 0.5 s before the F6 cut (the words give no more); the alternative is
      to carry them across the cut into F6.

- **2026-10-23 — DRAFT v1 AT THE DRAFT GATE (orchestrator; Mike rules).** `_previews/growth-vs-product-draft-v1-mix.mp4`
  (222.70 s, music + SFX mixed, -18.9 LUFS, peak -1.9 dBFS; the unmixed picture is `growth-vs-product-draft-v1.mp4`). Build
  stage: card pauses baked (CH2 snapped into its trough, CH5 at the waived 173.085, PAUSE-SILENCE / SPINE-FPS / CARD-WORDS
  PASS), 82 caption groups over 11 windows, comp `remotion/src/GrowthVsProduct.tsx` (+ Charts / Captions files) registered,
  9 comp gates PASS, mix from MUSIC-PLAN + 28 event-log SFX rows + 8 library transition sounds. The first build run was reaped
  by the Claude Code harness under system memory pressure 20 percent into the render (the dashboard server died with it);
  relaunched detached and it ran clean at ~10.5 GB free. Frames checked on the mix: the signature-open labels, THE SCOREBOARD
  card, the F3 right side panel, the C1 twirl, the WHICH ONE? card, the IMG-5 glitch, the last frame on "channel.".
  Comp-builder items for Mike's review (its JSON report is the tail of `graph/data/agent-comp-build-growth-vs-product.log`):
    - check_broll_motion FAILS on the DRAFT for BR-3 (the stopwatch macro, 19/36 frames frozen): a 200 kbps draft-encode
      artefact on a near-static shot (a crf 18 chunk froze 0/36). The FULL render's own check in verify_final is the proof.
    - The CH5 card is readable exactly 1.0 s (the F5 burn peaks on the face's last frame, the flip takes the pause); CH2 1.3 s.
    - Side panels: the 2023 -80 px picture shift would leave the reframed face under the 862 px panel, so the comp lands the
      MEASURED face in the middle of the free 55 percent (scale 120 over 0.47 s). The in-take whip-cuts land at 2x for 0.37 s.
    - Labels and panels use the house display font (Playfair Display 900), not the 2023 Montserrat ExtraBold Italic.
    - BR-1 / BR-6 enter through their card's flip exit (no stacked 0.5 s fade). The IMG-5 label hang over the first F6 frame
      was fixed (t1 200.76). Cards show unspoken lines in grey from the start (visual-qa note).
  Resume after Mike's notes: `run.py longform --project growth-vs-product --resume --approve draft` (then final render,
  verify_final incl. the b-roll motion check, definition of done, stage).

- **DRAFT GATE APPROVED (Mike, 2026-10-23 morning):** "I think it's excellent. No further modification needed. Let's do the
  final render." No fix round. Resumed `--resume --approve draft` DETACHED (cmd pid 35304, log scratchpad
  run11-final-detached.log): final_render (crf 18) -> mix -> verify_final (incl. the b-roll motion check on the FULL file)
  -> definition_of_done (FINAL.mp4 at the root + YT-DELIVERY.md). Before definition_of_done ran, the main loop wrote
  `yt-delivery.json` (the judgment half: CH1 "Two Titles, One Word", CH3 "The Clock", CH4 "The Bias", CH6 "Same Tools,
  Different Scoreboard"; the carded CH2/CH5 take their card labels; 10 keyword phrases). DELIVER LINE = the evals precedent
  (AI Engineering channel, 2026-10-20): the FINAL is delivered to the project root and NOT staged into the Rumble/BitChute/FB
  longform queue; a detached guard (scratchpad stage_guard.ps1) stops the graph after `definition_of_done: ran` and before
  stage_longform, so no publish-meta.json, no longs.json entry, _previews kept. The usage ledger is recorded by hand
  (`usage_ledger.py record`) so the next video rotates against this one. If Mike wants the queue entry: re-drive
  `run.py longform --project growth-vs-product` (stage_longform only).
- **FINAL DELIVERED to the project root (2026-10-23 06:47):** `growth-vs-product-FINAL.mp4` = byte-identical copy of
  `_previews/growth-vs-product-final-v1-mix.mp4` (crf 18, 1920x1080, 30 fps, 222.70 s, 167 MB, 6.0 Mbps). verify_final clean:
  duration == paused spine 222.699 s, -18.9 LUFS (draft parity), peak -1.9 dBFS, BROLL-MOTION PASS 7/7 on the FULL file (the
  draft's BR-3 freeze flag was the low-bitrate artefact as called). YouTube block `YT-DELIVERY.md` (6 chapters, 3 music codes,
  10 keywords; `YT-DELIVERY ok`). The guard stopped the graph 1 s into stage_longform: nothing staged (no publish-meta.json,
  no `schedule-tweets/longform/growth-vs-product/`, no longs.json entry), `_previews/` kept, no orphan agent process; the
  heartbeat was set to `stopped` by hand. Usage ledger recorded by hand (`USAGE-RECORD ok music=3 transition_rows=58`). Frames
  of the FINAL spot-checked against the draft (signature labels, both cards, F3 panel, C1 twirl, IMG-5 glitch, last frame).
  NOT done, Mike's call: thumbnail (none in `assets/thumbnail/`; evals took a concept from Mike first) and the longform queue entry.
- **THUMBNAIL (Mike, 2026-10-23: "same image [evals take B], just change it to AI product engineer vs AI Growth Engineer.
  Make 3 separate highlight blocks with text like this example youtu.be/wfMtDGfHWpA"):** built in CODE on the evals take B
  pixels (face untouched): the old blocks painted out with a harmonic fill (65 px margin: the AI blocks carry a 20 px drop
  shadow + a 60 px glow, narrower margins ghosted), then three left-aligned yellow blocks hugging their own line, tilted 6
  degrees, Roboto weight 900. Two takes in `assets/thumbnail/takes/` (v1a regular width, v1b condensed = bigger letters);
  v1b staged as `assets/thumbnail/growth-vs-product-thumb.png` (swap by copying v1a over it); `*-yt-1920.jpg` = the 1920x1080
  JPEG under YouTube's 2 MB cap. v2 (Mike: "growth first, and also make the angles of the text similar to the example"): lines = Growth / vs /
  Product, and the blocks are FANNED like the example (measured on its frame: top block rises 8.8 deg, middle 5, bottom falls
  4, each pivoting on its own left-middle), no group tilt. **APPROVED by Mike (2026-10-23, "this appears to be good"): the staged pick
  `assets/thumbnail/growth-vs-product-thumb.png` (v1b condensed, fanned) is THE thumbnail; v1a stays in takes/.**
  Recipe + scripts + clean plate in `assets/thumbnail/build/` (README). Note: `stage_longform` globs `<project>/thumbnail/`,
  not `assets/thumbnail/` (evals used the latter too); copy the pick there if the queue entry is ever wanted.
- **CLOSE-OUT RULINGS (Mike, 2026-10-23):** NO vertical cut of this video. A short is UNDECIDED ("let me think about it for
  a few moments"): nothing started. NEVER queued: "this is for my AI Engineering Simplified channel, so it's not going to go into
  the queue for the main channel" (no longs.json entry, no stage_longform re-drive; same as evals). Mike uploads to YouTube
  himself with YT-DELIVERY.md + the approved thumbnail.
- **SHORT LANE STARTED (Mike, 2026-10-23: "skip the full vertical conversion, but let's go ahead and make a 30-second short.
  It can be 40 seconds if you need to fit something in"):** 16:9-SOURCED MODE (longform-to-short.md; every-job precedent).
  Adapter master `growth-vs-product-VERTICAL.mp4` = black 1080x1920 canvas on the paused spine's clock (222.699 s) + its
  `.blank-canvas.mp4` copy; flag `assets/short/from-16x9.json`; the comp got `inputProps.captions` (captions off for the span
  renders). NEW in the painter (`scripts/short_spans_from_16x9.py --face-from-render`): this comp does NOT reframe the face to
  the centre (the signature open and the side panels push it left), so FACE spans are measured on the rendered span (OpenCV
  Haar) and cropped on that centre; `assets/vertical/face-crop.json` is a stub the painter needs to load. Lane launched
  detached (`run.py short --project growth-vs-product --seconds 30 --brief ...`, cmd pid 48428, log scratchpad
  short1-plan-detached.log): preflight PASS, short-cut-strategist running; the brief tells it the labels / side panels beside
  the face are out of the 9:16 frame, to prefer FACE spans and croppable covers, and that 40 s is allowed if the claim needs it
  (the budget check is re-run at that length). Next: gate short_plan (Mike), paint the spans, approve, build, gate short.
- **SHORT PLAN GATE APPROVED on Mike's delegation ("go ahead and make a 30-second short"), 2026-10-23 10:30:** short-cut-strategist
  (19.7 min) plan, verified + snapped (0 boundaries moved): 5 spans, 27.9 s + 3 s outro = 30.9 s (inside the lane's window, file
  `growth-vs-product-SHORT-30s.mp4`). Claim: not the same job, same tools, different scoreboard; the title is the number you answer
  for. Spans (final time): 1) F1 0.000-4.710 hook "So what are the differences between an AI growth engineer and an AI product
  engineer?" 2) F2 45.160-48.840 "They're not the same job, same tools, different scoreboard." 3) COVER 51.885-62.060 "Difference
  number one, the scoreboard ... scored on the feature itself." (BR-1 dashboard, scoreboard card, IMG-1 gauge) 4) COVER 199.810-
  203.760 IMG-5 founder "a founding AI engineer ends up being both." 5) F6 203.760-209.140 "Either way you're an AI engineer. The
  title just tells you which number you're accountable for." + the shared CTA. Adapter painted with `--face-from-render` (face
  at 42.3 / 53.0 / 49.8 percent for spans 1 / 2 / 5; the signature-open labels are out of frame as briefed) and a NEW painter
  `fit_windows` treatment on span 3 (final 54.18-60.02: the scoreboard card shown whole, letterboxed on its own blurred frame,
  through the IMG-1 glitch; a 608 px slice clipped its headline and chips). Frames of the painted master checked (9 stills).
  Lane resumed detached (`--resume --approve short_plan`, log scratchpad short3-build-detached.log): variants (BR-1 / IMG-1 /
  IMG-5 alternates) -> extract -> captions -> comp -> render -> mix -> verify -> gate short (Mike).
- **SHORT LANE BUG FIXED (2026-10-23 10:35):** the first build run reported "no span carries an Envato clip or ChatGPT image" and
  skipped Mike's variety rule, although span 3 carries BR-1 + IMG-1 and span 4 IMG-5: `short_graph._cover_windows_final` only
  matched the E/G coverage codes in a beat's `what` (kcc20's convention), not this plan's on-disk ids. Fixed to accept `BR-n` /
  `IMG-n` too (and the image-gen prompt falls back to `assets/img/` when no vertical exists). The run was stopped right after it
  spawned the comp-builder and re-driven fresh with `--redo s_variants` (log scratchpad short4-build-detached.log): three
  variant slots found (BR-1 51.885-54.18, IMG-1 59.5-62.06, IMG-5 199.9-203.76 final time), envato-sourcer + image-gen spawned.
- **SHORT VARIANTS round 1 (2026-10-23 10:50):** envato-sourcer (5 min) + image-gen (9.8 min) delivered BR-1-dashboard-touch.mp4,
  IMG-1-feature-module-gauge-vertical.png, IMG-5-founder-late-night-desk-vertical.png; visual-qa PASSED the two stills and FAILED
  the clip (the lower 40 percent is a second monitor of readable German stock-trading prose). Lane gap closed in `short_graph.s_variants`:
  the re-sourcing agent now gets the prior FAIL (defects + fix) on its slot line, and visual-qa is re-run when any variant file is
  newer than the verdict (before: blind re-source, then the stale FAIL verdict failed the node again). The clip + its QA frame were
  recycled and the lane re-driven fresh (log scratchpad short5-build-detached.log).
- **SHORT VARIANT BR-1 WAIVED (orchestrator, 2026-10-23 11:10; Mike rules at the short gate):** passes 2 and 3 also failed
  visual-qa (an analytics HUD with crisp 'Data 01/02/03' labels, a left-edge-clipped label and no funnel; then a night-office
  laptop running a stock-market template = concept drift). The sourcer searched 48 portrait results over three query families
  and reports Envato has no native-vertical funnel / growth-analytics clip without readable labels. Rather than a fourth pass,
  the slot is waived via the NEW `assets/short/variant-waivers.json` (honoured by `s_variants`, printed as VARIANT-WAIVED; stale
  FAIL verdicts on waived or renamed slots no longer fail the node): the short keeps the longform's own BR-1 dashboard for its
  2.3 s window; the IMG-1 (dial gauge) and IMG-5 (founder from behind, city window) alternates passed and stay. To reverse:
  delete the waiver entry and re-drive with a better clip in `assets/short/vid/`.
- **SHORT COMP BUILT, RENDER BLOCKED BY DISK, CLEARED (2026-10-23 11:35):** comp-builder (18 min) registered GrowthVsProductShort.tsx
  (30.8 s), s_verify_comp gates PASS, then s_render refused: 1.1 GB free on C (the 5 GB render guard; 10 GB were free at 06:30,
  Mike's two new recordings in Videos, 2.9 + 0.5 GB, plus temp growth). Freed about 6.8 GB without touching anything of Mike's
  or any project file: the Remotion webpack cache (1.25 GB, regenerable), a 2025 zip fragment (0.3 GB), dozens of stale
  puppeteer_dev_chrome_profile-* folders, the %TEMP% working folders of DELIVERED projects (kcc20-envato 1.9 GB raw Envato
  downloads, kcc20-vrx, clip-insert-*, playwright-artifacts, gkfine, tao-rc, vqa, seg, wendy, gkqa, evals-clips, br) and
  week-old loose wct*.tmp files (0.5 GB). Free after: 7.9 GB. The Recycle Bin (0.44 GB) was left alone. Lane re-driven
  (log scratchpad short8-render-detached.log) at s_render.
- **SHORT v1 RENDERED, verify FAILED on the hook face, FIXED with a tracked crop (2026-10-23 11:55):** render 30.83 s, mix -19.0
  LUFS / peak -5.5, but s_verify_final: "hook face at 29% on the short" (rule: 35-65 percent at 1.0 s). Cause: the face is not
  static inside span 1: the comp's signature open pushes it 52 -> 38 percent while the labels pop, and the whip-in zoom swings it
  further, so one static crop (42 percent) could not hold it. NEW painter flag `--track-face` (with `--face-from-render`): a FACE
  span whose sampled centres spread over 8 percent gets a per-frame tracked crop (Haar every frame, gaps interpolated, path
  smoothed over 0.7 s, window follows the face). Repainted: spans 1 / 2 / 5 tracked (face 38-51 / 48-55 / 46-59 percent on the
  16:9 render); probes of the painted master read 47-55 percent everywhere, 50.5 at the 1.0 s hook frame. Lane re-driven with
  `--redo s_extract,s_render,s_mix` (log scratchpad short9-render-detached.log).
- **SHORT v2 AT THE SHORT GATE (2026-10-23 11:45):** `_previews/short/growth-vs-product-SHORT-30s-v2.mp4`, 1080x1920, 30.83 s,
  -19.0 LUFS, peak -5.5 dBFS, hook face 51 percent, verify PASS. Spans on the short's clock: hook 0.0-4.7, F2 4.7-8.37, the
  scoreboard span 8.37-18.53 (dashboard -> card letterboxed whole -> gauge; the IMG-1 dial-gauge alternate over 16.0-18.57),
  IMG-5 founder-from-behind alternate 18.53-22.47, F6 kicker 22.47-27.83, WATCH THE FULL VIDEO outro to 30.83. Eleven frames
  checked. Judgment calls for Mike: the BR-1 variety overlay waived (the longform's own dashboard plays 8.37-10.67), the
  scoreboard card shown whole in a 1080x372 letterbox band (small chips, the captions carry the words), all three face spans
  on tracked crops. Resume after Mike's verdict: `run.py short --project growth-vs-product --resume --approve short` (s_deliver
  promotes it to the project root as growth-vs-product-SHORT-30s.mp4, not queued).
- **SHORT APPROVED AND DELIVERED (Mike, 2026-10-23 12:18: "I approve of the short."):** `--resume --approve short` -> s_deliver
  promoted `growth-vs-product-SHORT-30s.mp4` (28 MB, 1080x1920, 30.83 s) to the project root; not queued (lane rule, AI
  Engineering channel). GRAPH DONE for the short lane. The video's deliverables at the root: FINAL.mp4, SHORT-30s.mp4,
  YT-DELIVERY.md, assets/thumbnail/growth-vs-product-thumb.png (+ the 1920x1080 JPEG). No vertical cut (Mike's ruling).
- **VERTICAL CUT ORDERED AFTER ALL (Mike, 2026-10-23 13:00: "I should indeed have made the vertical video, the full version ...
  LinkedIn doesn't allow you to upload a video more than 10 minutes. I like to post these on LinkedIn, and it's preferable to have
  it in vertical format"; evals was skipped only because it ran over 10 minutes).** Prep before the lane: the short's black
  adapter master moved from the root to `_previews/short-adapter/growth-vs-product-VERTICAL.adapter-16x9-short.mp4` (the lane
  writes the real `growth-vs-product-VERTICAL.mp4` there), its blank canvas deleted, the stub `assets/vertical/face-crop.json`
  recycled so v_face_crop MEASURES. `run.py vertical --project growth-vs-product` launched detached (log scratchpad
  vertical1-detached.log): preflight -> face crop -> the vertical asset factory (portrait Envato, 9:16 AI stills, mobile-view
  receipts, re-shot slides / diagrams / chart states) -> visual-qa -> comp -> render -> mix -> verify -> gate vertical (Mike).
  Disk: 6.0 GB free at launch; the render guard is 5 GB; evals' `_previews/` (2.2 GB of drafts + render parts of a delivered
  video) is the obvious candidate if space runs short, Mike to rule.
- **VERTICAL ASSET ROUND 1 (2026-10-23 13:05-14:10):** face crop measured 58.17 percent (spread 49-66, objectPosition
  '58.2% center'). Five builders in parallel: slide-builder 13.7 min (32 portrait slides), envato-sourcer 19.5 min (7 portrait
  clips), chart-builder 21.6 min (41 diagram + 10 chart states), receipt-capturer 23.8 min (28 files), image-gen 34.6 min (5
  stills). visual-qa (10.1 min) PASSED 92 of 96 and FAILED 4 receipts: C4a and C5a title blocks (the LinkedIn job card centred on
  a white 1080x1920 canvas, 55 percent flat white), the C7b closing-gap bullet (a tight crop on white, 71 percent), and the C7b
  title block (image fine, the sidecar title anchor off-frame). Repair per the asset-factory recipe: all C4a / C5a / C7b files
  recycled (files are claimed by id prefix, so both C7b files go) and the lane re-driven (log scratchpad vertical2-detached.log):
  receipt-capturer rebuilding the 3 ids with the prior defects + fixes in its brief (fill the portrait frame with more of the
  real page, top-aligned, counters hidden; recompute anchors from the rendered PNG).
- **VERTICAL ASSET ROUND 2 (2026-10-23 14:30):** receipt-capturer (16.2 min) rebuilt C4a / C5a / C7b top-aligned and filling the
  frame; visual-qa PASSED C5a and the C7b bullet, FAILED C4a (the LinkedIn posting has no more page behind the login wall, so
  the bottom 34 percent stayed white) and the C7b title block (centred, 417 / 402 px white bands; round 1's judge had accepted
  the same layout). Fixed in POST instead of a third capture, as the verdict itself proposed: the empty white bands recoloured to
  the house dark (12, 15, 18) with 48 px of white kept as card padding, page pixels and sidecar anchors unchanged (noted in each
  sidecar under `post_fix`); both verdicts overridden to PASS in assets/vertical/VISUAL-QA.json with the reason. Lane re-driven
  (log scratchpad vertical3-detached.log): verify_assets -> comp-builder -> render -> mix -> verify -> gate vertical.
- **VERTICAL v1 AT THE VERTICAL GATE (2026-10-23 15:05):** comp-builder 39.2 min (GrowthVsProductVertical.tsx + Charts + Face,
  objectPosition 58.2% center), 7 comp gates PASS, full render 222.67 s / 6681 frames, mix = the 16:9's beds + SFX, verify PASS:
  `_previews/vertical/growth-vs-product-VERTICAL-v1.mp4` 1080x1920, 222.70 s (== the 16:9 FINAL), -18.9 LUFS (parity), peak
  -1.9, the seven face windows measured at 48-51 percent. Sixteen frames checked: signature labels stacked above the face, the
  role cards and diagrams restacked tall, the F3 side panel moved under the face, the scoreboard card restacked, cards, stills,
  the IMG-5 glitch, the CTA with captions. Resume after Mike's verdict: `run.py vertical --project growth-vs-product --resume
  --approve vertical` (v_deliver promotes it to the project root as growth-vs-product-VERTICAL.mp4, not queued).
- **VERTICAL APPROVED AND DELIVERED (Mike, 2026-10-23 15:23: "i approve of the vertical video"):** `--resume --approve vertical` ->
  v_deliver promoted `growth-vs-product-VERTICAL.mp4` (165 MB, 1080x1920, 222.70 s) to the project root; not queued (for Mike's
  LinkedIn upload). GRAPH DONE for the vertical lane. PROJECT CLOSED: at the root FINAL.mp4 (16:9), VERTICAL.mp4, SHORT-30s.mp4,
  YT-DELIVERY.md, assets/thumbnail/growth-vs-product-thumb.png (+ the 1920x1080 JPEG). Nothing in the main-channel queue.
- **RULE CORRECTED (Mike, 2026-10-23 15:30):** the vertical (and the short) are NEVER started automatically; they stay a human
  gate on every video, Mike's decision. The under-10-minutes LinkedIn factor on this channel, and Kaspa / TAO on the crypto channel,
  are tendencies with exceptions (golden-kitty got a vertical), not triggers. Recorded in memory (feedback_vertical_cut_is_mikes_call).

## Open flags (load-bearing)

- **CH5 card cut WAIVED at 173.085 s (orchestrator, 2026-10-22, on Mike's overnight delegation).** The WHICH ONE? card boundary has no
  30 ms silence trough (the CH4 face line's end was cut to zero residual, face edges carry no pad): `card_cut_waivers` in
  GRAPH-PROGRESS.json takes the exact cut at the -54.9 dB bin between the t-release of "it." and the breath before "So". No word
  is clipped. Mike reverses at the draft gate if the join reads wrong (then: no CH5 card, Bed C starts cardless on a whip).
- **Caption scope = all faces + Envato b-roll (orchestrator, 2026-10-22).** The house default captions only FACE holds over 5 s,
  which here would caption just the CH5 payoff and the CTA; the AI Engineering channel's evals video (2026-10-19) ran
  `all-faces` + `envato` on Mike's words ("not only face scenes, but all the face scenes, and the B-roll from envato"), so this
  channel video takes the same scope (`caption_scope` in GRAPH-PROGRESS.json). The signature-open labels sit on the right third
  and the side panels beside the face, outside the caption zone. Reverse = `--caption-scope default --redo captions,comp_build`.
