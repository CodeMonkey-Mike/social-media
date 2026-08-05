# kaspa 30bps — AS-RECORDED (build the edit to THIS, not the plan)

_Authoritative as-built script, transcribed from the FINAL spine after the full spine-prep chain
(defumble → cover-blackout → two-zone desilence 250ms/500ms → burst-removal ×1 → **final two-zone
desilence 250ms CH1 / 600ms body @58.4s**). Per longform-edited house rule #6, the edit is cued off
THIS, not `SCREENPLAY.md` (the plan). Divergences from the plan are listed at the bottom — the two
load-bearing ones (missing CTA, over-length community plug) are OPEN and need Mike's ruling._

- **Final spine:** `spine/ALL.e.desilenced.mp4` — **455.22s (7:35.2)**, 1080p30.
- **Transcript (cue source):** `spine/ALL.e.desilenced.medium-words.json` (Whisper medium, word-level,
  true-to-audio). Human-review breakdown (mishears fixed): `spine/ALL.e.desilenced.segments.txt`.
- **Timecode chain:** `spine/ALL.c.desilenced.map.json` (raw→c) → `spine/ALL.d.cleaned.cuts.json`
  (c→d: ≥103.25s shifts −0.77s) → `spine/ALL.e.desilenced.map.json` (d→e). All timecodes BELOW are
  already e-spine (final) coords — cue directly off them.
- Spine-prep chain (in `spine/`): `ALL.a.defumbled` → `ALL.b.blackout` → `ALL.c.desilenced` →
  `ALL.d.cleaned` → `ALL.e.desilenced`.

## FACE windows (blackdetect on the final spine — everything else is BLACK video, cover it)

| # | Window (s) | Content |
|---|---|---|
| F1 | 0.00–4.70 | CH1 locked hook "40 blocks every single second on proof of work" |
| F2 | 32.40–38.53 | CH1 "the tech that makes all that possible..." |
| F3 | 107.93–112.37 | CH2 "really cool name this time, DAGKnight" |
| F4 | 184.97–191.30 | CH3 "runs as fast as the assumption allows" |
| F5 | 227.77–305.07 | CH3 **community plug (~77s ad-lib, trim PENDING — see Divergences)** |
| F6 | 321.50–326.27 | CH3 "DAGKnight is the reason everything above 10 becomes possible" |
| F7 | 392.30–394.90 | CH4 "Sub-second finality on proof of work" |
| F8 | 452.33–455.22 | CH5 "This is why Kaspa is my number one" (runs to EOF) |

## Whisper mishears to FIX in any captions / on-screen text
**Casper/Caspa → Kaspa** · **Dag Night → DAGKnight** · **Tokata → Toccata** · **Ghost Dag → GHOSTDAG** ·
**Yadintin Sampolinsky → Yonatan Sompolinsky** · **heart fork → hard fork** · **MadeNet → mainnet** ·
**spinning rules → spending rules** · **volts → vaults** · **dag night area → DAGKnight era** ·
**Dark Night → Dark Knight** (movie-title spelling). Full list + timecodes: segments.txt tail.

---

## AS-RECORDED beats (timecodes = FINAL e-spine)

### CH1 — THE TARGET (0:00–52.84) · card OFF · Bed A (`hold-the-line`, Mike's pick)
- **0.00–4.56** 👤 [FACE F1] "40 blocks every single second on proof of work." (locked hook, delivered clean)
- **4.74–11.42** [COVER] "This is where Kaspa is headed next. Not someday, not in five years. The target is this year." → `[SHOW]` full-frame "40 BLOCKS / SECOND" motion card over BlockDAG atmosphere; Bed A hits cold at 0.00.
- **11.70–20.54** [COVER] "Kaspa already runs at 10 blocks a second today live. That alone makes it the fastest chain in all of proof of work. And it's not even close." → `[SHOW]` fastest-PoW cadence visual (C2 teaser or type card).
- **20.90–32.40** [COVER] "but 10 was never the finish line... takes those 10 blocks a second and pushes them up to 40. Targeted before the end of this year." → `[SHOW]` **H1 hook counter** (10 BLOCKS/SEC ticking, slams to 40, "TARGET: 2026" stamp).
- **32.54–38.42** 👤 [FACE F2] "And the tech that makes all that possible is one of the most amazing achievements in all of crypto." (ad-lib variant of "coolest advancements")
- **38.56–52.66** [COVER] "But here's the thing, you don't just quadruple the speed of the fastest chain in proof of work. At this level, there's no dial to turn. Something at the very core of Kaspa has to change. So let's get into all of this and I'm gonna show you some of the coolest things ever." → open-loop b-roll. ⚠ trailing preview clause = Divergence 4.

### CH2 — THE LADDER (52.84–134.42) · card ON "THE UPGRADE LADDER" · Bed B (pick pending)
- **52.84–70.72** [COVER] "So Kaspa's story is like a ladder and every rung on it is a hard fork. Rung one, Crescendo, May 2025... one block a second to 10... every 100 milliseconds... live running right now." → `[SHOW]` **C1 ladder** rung 1 lands.
- **70.84–87.50** [COVER] "Rung two, Toccata. Landed June 30th... programmability fork. Programmable spending rules, escrow, vaults, time locks, native tokens on the base layer, verifying zero knowledge proofs." → `[SHOW]` C1 rung 2 + feature spotlight containers (one at a time) + **C5 receipt** (rusty-kaspa v2.0.0 release page).
- **88.38–94.60** [COVER] "Notice what Toccata did not touch, the block rate. Today, Kaspa still runs at 10 blocks a second." (load-bearing negation, survived intact)
- **94.66–107.92** [COVER] "Which brings us to the second hard fork of 2026. Two hard forks, in a single year. This second one is the speed fork. From 10 blocks a second to up to 40, four times the speed. Targeted before this year is out." → `[SHOW]` C1 rung 3 "UP TO 40 bps".
- **107.94–112.34** 👤 [FACE F3] "And in my opinion, I think it has a really cool name this time, DAGKnight."
- **112.42–121.70** [COVER] "It's like Dark Knight... It's not a chain, it's a DAG. It's a directed acyclic graph." → `[SHOW]` BlockDAG structure visual. (DAG-definition ad-lib = Divergence 6)
- **121.78–134.42** [COVER] "Look at the top of this ladder... it says 100... the 2027 target. But that hard fork will only exist if DAGKnight lands first." → `[SHOW]` C1 rung 4, locked/dimmed, chain-link to rung 3.

### CH3 — DAGKNIGHT (134.52–326.26) · card ON "DAGKNIGHT" · Bed C (pick pending)
- **134.52–154.04** [COVER] "So what actually is DAGKnight? A new consensus protocol... from Kaspa's own researchers, Yonatan Sompolinsky and Michael Sutton, in a paper from 2022. It replaces... GHOSTDAG." → `[SHOW]` **C4 LEFT state** intro.
- **154.14–171.80** [COVER] "GHOSTDAG is brilliant, but... a number hard-coded into it. A worst-case guess... the whole network has to run as slow as that guess." → C4 LEFT (assumed-latency box, pinned-low readout).
- **171.92–184.94** [COVER] "Highway where the speed limit is set for the worst storm of the year... Everybody drives at storm speed every single day." → highway/storm analogy visual.
- **185.02–191.20** 👤 [FACE F4] "So the chain doesn't run as fast as the internet allows. It runs as fast as the assumption allows."
- **191.36–194.72** [COVER] "That was the exact ceiling DAGKnight was invented to break."
- **194.80–212.46** [COVER] "DAGKnight deletes the guess. No hard-coded number, no dial. That's what parameterless means... measures the real network in real time and adapts... The internet's fast, great. The chain runs faster." → `[SHOW]` **C4 RIGHT state swap** (box shatters → MEASURED gauge, readout climbs). The marquee moment.
- **212.60–217.08** [COVER] "Staying secure even with up to half of the network acting malicious."
- **217.36–227.74** [COVER] "Kaspa's finality today... under seven seconds. DAGKnight opens the door to finality in under one second. On proof of work."
- **227.80–305.02** 👤 [FACE F5] **COMMUNITY PLUG** (ad-lib, ~77s; full text in segments.txt). Trim PENDING = Divergence 2. `[SHOW]` lower-third "LINK IN THE DESCRIPTION"; Bed C stays at quiet floor.
- **305.14–321.60** [COVER] "But going back to Kaspa, now this ladder makes sense... Cranking the block rate stops being reckless. That's why a number like 40 becomes the target. That's why 100 sits behind it." → `[SHOW]` quick C1 callback flash (rungs 3+4 light up).
- **321.80–326.26** 👤 [FACE F6] "DAGKnight is the reason everything above 10 blocks per second becomes possible."

### CH4 — WHAT 40 UNLOCKS (326.32–413.24) · card OFF (Bed C continues)
- **326.32–347.32** [COVER] "Put this next to the rest of crypto. Bitcoin, one block every 10 minutes. Ethereum, every 12 seconds. Kaspa right now, today, 10 every second. And in the DAGKnight era, one block every 25 milliseconds... That's four blocks per blink." → `[SHOW]` **C2 cadence race** (bars pulse at real cadence, blink annotation).
- **347.32–373.26** [COVER] "In capacity terms... over 5,000 transactions a second... last October... over 5,500 live on mainnet. At 40 blocks a second... around 20,000 transactions a second. Capacity to be clear, but they've already proven the theory holds at 10." → `[SHOW]` **C3 TPS bars** (THEORETICAL CAPACITY label, 5,584 DEMONSTRATED marker, 20k+ bar spotlighted).
- **373.26–392.28** [COVER] "The whole industry is hyping up Solana's new upgrade... pushes finality down to under one second. Fine, that's impressive. But Kaspa's chasing the same sub-second club on a fair launched, no pre-mine, permissionless proof of work network." (aired UNATTRIBUTED as planned; Alpenglow public-source VERIFY still open)
- **392.52–394.88** 👤 [FACE F7] "Sub-second finality on proof of work."
- **394.92–397.24** [COVER] "That's just a different sentence entirely."
- **397.36–413.24** [COVER] "But one thing to be clear, this is just a target for the end of the year. The core devs are gunning for it. The prototype is being built out in the open. And it has not hit testnet yet. Nobody's really selling you a locked schedule. And honestly, I prefer it that way. No marketing deck, just engineering you can watch happen." (honest-target beat; "in Rust" absent = Divergence 5; intro softened = Divergence 7)

### CH5 — THE CLOSE (413.46–455.22) · card OFF · Bed D (`a-champion-from-the-ashes`, Mike's pick, END-ALIGNED)
- **413.46–425.20** [COVER] "So the next time somebody tells you that proof of work is legacy tech, that it gets as good as it gets with Bitcoin, or that all the real innovation lives on pre-mine VC chains, show them this ladder." → `[SHOW]` **C1 grand callback** (full ladder assembles fast).
- **425.40–436.04** [COVER] "One to 10, done. Programmability, done. Shipped this summer, done. Up to 40 blocks per second targeted before the end of this year. And then 100 next year."
- **436.30–442.86** [COVER] "Fair launch, no pre-mine. About 95% of the supply is already mined, already out there in the world."
- **442.96–447.12** [COVER] ⚠ "So you know that means deflation comes next, and your bags start pumping." — price-prediction ad-lib = Divergence 3, recommend CUT.
- **447.34–452.28** [COVER] "And a consensus upgrade coming that lets your network run at the speed of the actual internet."
- **452.44–455.22** 👤 [FACE F8] "This is why Kaspa is my number one." → **spine ENDS here. No CTA recorded** = Divergence 1.

---

## Divergences from SCREENPLAY.md (rulings: 1 + 2 RESOLVED by Mike 2026-07-24; 3 still open)

1. **✅ RESOLVED — the hard out is INTENTIONAL (Mike): NO CTA pickup.** The video deliberately ends at
   "This is why Kaspa is my number one" (455.22) — watch-time strategy: cut short so viewers never get
   trailing seconds to click away from (memory `hard-out-ending-strategy`). The F5 plug carries the
   community CTA mid-video. Bed D's end-hit lands ON the final line (MUSIC-PLAN formula, T_end=455.22
   final unless divergence 3 cuts -4.16s).
2. **✅ RESOLVED — plug KEPT IN FULL (Mike): no trim.** F5 stays 227.77-305.07 with its overlay
   decoration (IMG-5/6/7 + R7). Timeline is stable; no tighten pass.
3. **✅ RESOLVED — line KEPT (Mike 2026-07-24 "we're going to keep the deflation comes next
   sentence").** Persona guard overridden by Mike for this line. Timeline final at 455.22; BR-9
   (cloud ascent) licensed to cover it. All divergences now closed.
4. CH1 tail adds a preview clause "and I'm gonna show you some of the coolest things ever" (the plan
   wanted the loop fully open). Minor; cuttable at 50.40 if Mike wants.
5. "In Rust" was lost from the CH4 honest-target beat (retake splice). Minor; pickup only if wanted.
6. CH2 ad-lib DAG definition ("It's not a chain, it's a DAG...") replaces "trust me, the name fits."
   Reads well; kept.
7. CH4 honesty intro softened: "But one thing to be clear" replaces "I gotta be straight with you,
   because that's how we do it here." Kept as spoken.
8. Wording drifts absorbed as-spoken throughout (e.g. "most amazing achievements", "Shipped this
   summer, done", "100 next year"); none change facts or claims. All aired numbers match DATA.md
   (10 bps live · up to 40 target · 25 ms · 4 blocks/blink · 5,000+/5,500+/20,000 capacity · <7s
   finality · 95% mined · 2027 = 100).
