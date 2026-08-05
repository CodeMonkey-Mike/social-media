# ethereum-rwa — PROJECT-LOG

Decision trail + resume pointer for this longform-edited video.

## Decisions

- **2026-07-31 — created.** Mike wants a bullish longform-edited video on Ethereum's real-world-asset (RWA)
  tokenization boom: heavy on facts/figures, explicitly conviction/bullish framing, plus a spotlight on
  **Robinhood Chain** (Mike said "nineHood chain" — confirmed this is Robinhood Chain, the Arbitrum-based
  Ethereum L2 that launched mainnet July 1 2026; "9Hood" nickname already tracked in
  `persona/persona.json` -> `image_generation.robinhood_coin`, brand colors neon-green/yellow, never Kaspa
  teal — carry that rule into any coin/brand visual for this video).
- **2026-07-31 — runtime target LOCKED = ~5:00.** Shorter than the usual 7-min house length; keep the
  chapter count lean (5 chapters, no mid-roll plug — the video isn't long enough to need one; revisit if
  the recorded take runs long).
- **2026-07-31 — angle LOCKED = BULLISH / conviction.** Not skeptical, not both-sides. The RWA tokenization
  trend itself is framed as structurally bullish for Ethereum. Per persona `verified_claims_only`, upside
  stays CONDITIONAL ("could be", opportunity/asymmetry framing) where the underlying data is genuinely
  early or unresolved — see the value-accrual flag below. Never invent certainty the sources don't support.
- **2026-07-31 — register LOCKED = gear 3 (epic/declarative hype)** for CH1 hook + CH5 close, gear 2
  (polished explainer) for the CH2-CH4 body chapters carrying facts/figures. Standard longform-edited
  house default (persona `spoken_voice.register_note`), no project override.
- **2026-07-31 — chapter map (draft, screenplay-strategist to flesh out):**
  1. **CH1 — Hook.** The RWA number nobody's talking about while everyone stares at price action. Headline
     stats: market size + YoY growth + Ethereum's dominant share. Epic register. No cold open (screenplay.md
     hard rule) — this IS the opening.
  2. **CH2 — The proof.** Who's actually building on Ethereum and why: BlackRock BUIDL, tokenized
     Treasuries, institutional custody depth as the reason Ethereum specifically (not "crypto generally")
     is the settlement layer of choice. Gear 2.
  3. **CH3 — Robinhood Chain spotlight.** New Ethereum L2 (built on Arbitrum), tokenized stocks tradeable
     24/7, the TVL/volume numbers since mainnet launch, as a live proof point of the RWA trend accelerating
     ON Ethereum's L2 stack. Gear 2, lift toward gear 3 on the numbers.
  4. **CH4 — Why this is bullish for ETH itself (the "subnotes").** Staking lock-up, ETF inflows, corporate
     ETH treasury companies, the Fusaka upgrade's L2 fee-floor change. This is the asymmetry/opportunity
     beat: the value-accrual story is NOT fully solved yet (see flag below) — frame that honestly as the
     early/mispriced setup, not as already-captured value. Gear 2 lifting to gear 3.
  5. **CH5 — Close.** Conviction payoff. Epic register. Standard persona `cta_style` close (comment ask +
     community plug + real sign-off "I'm gonna catch you guys, later.") unless Mike calls a hard-out
     (memory: hard-out endings are a deliberate per-video choice, not a default — ask before cutting the
     CTA, currently defaulting to CTA-on).
- **2026-07-31 — title-card / FACE gating, chart-source index: deferred to screenplay-strategist.** It owns
  the per-chapter breakdown, the beat-level tagging (Convention 5), and the music-mood plan; DATA.md below
  is the fact source it must pull every on-screen number from.

## Open flags (load-bearing)

- **Robinhood Chain fee-capture nuance (handle carefully, do not overclaim).** Current on-chain fee data
  shows Ethereum L1 captures a tiny sliver of Robinhood Chain's activity (~0.15% of cumulative chain fees
  as of mid-July 2026 per Motley Fool's read of the chain's fee data) — most fee revenue stays with
  Robinhood, some goes to Arbitrum. The Fusaka upgrade adds L2 fee floors aimed at fixing this but the
  floor is currently low. **The screenplay must NOT claim Ethereum is already capturing large fee revenue
  from Robinhood Chain or similar L2 activity** — that's factually false right now. Frame it instead as the
  live asymmetry: massive real-world activity is choosing to settle on Ethereum's security, value-accrual
  mechanics are still catching up, that gap is the opportunity, not the payoff. Conditional language only.
- **Verify-at-render (all numbers drift, especially TVL/volume/AUM figures):** every stat in DATA.md is
  time-stamped to its source date; re-pull anything within ~1 week of recording. Standard Chartered's "$2T
  by 2028" line is a FORECAST — must be voiced as a forecast, never a stated fact.
- **Competitive honesty (persona `verified_claims_only`):** Solana has a real and fast-growing lead
  specifically in tokenized EQUITIES trading volume (not RWA overall). Don't claim Ethereum has zero
  competition — DATA.md carries the numbers; screenplay-strategist should acknowledge it briefly rather
  than omit it, then pivot back to why Ethereum still leads on the broader/institutional RWA base.
- **CTA vs hard-out close:** defaulted to standard CTA close (see chapter map CH5); flag for Mike to
  confirm or override at recording/edit time.

## Spine-prep run (2026-07-31) — DONE, spine ready for Mike's review
Recorded raw: `raw/2026-07-31 10-17-46.mkv` (24:15, 1.03 GB, 6 Mbps, 1080p30). Ran the full chain via the
shared agents, each output at its §13a path:
- **Compress (orchestrator, `to_low_bps.py` @ 2M):** → `spine/ALL.lowbps.mp4` (1107 MB → 394 MB).
- **defumbler agent:** → `spine/ALL.a.defumbled.mp4`. 1455.4 → **901.63s (24:15 → 15:02)**, 36 cut spans /
  120 dropped chunks, 553.9s removed. QA clean: 0 surviving partials, 0 clipped words (157/159 chunks
  byte-identical in duration to source; the 2 tail-drops transcribe as complete sentences), 70/72 cut edges
  in literal digital silence, 2 tail-drop troughs at −57.0/−61.4 dB, drift 9 ms.
- **cover-blackout agent:** → `spine/ALL.b.blackout.mp4` (+ `.mp4.cover.json`). **79% blacked / 21% face**,
  7 FACE windows. Frame-QA passed (pure black at every COVER midpoint, face at every FACE midpoint, audio
  untouched, drift 9 ms).
- **desilencer agent @ 700 ms** (Mike's stated value): → `spine/ALL.c.desilenced.mp4` (+ `.map.json`).
  901.63 → **437.02s (7:16)**, 88 cuts / 87 keeps, 465.1s removed (~48.4%). Swallowed-speech QA: 0 flags.

**(Superseded — see the burst-removal + final desilence below. The FINAL spine is `spine/ALL.e.desilenced.mp4`.)**

## Burst removal + FINAL two-zone desilence (2026-07-31) — spine LOCKED at 6:57.41
- **burst-removal agent ×4 bursts** (Mike located 3 by ear; the agent found a 4th) → `spine/ALL.d.cleaned.mp4`
  (+ `.cuts.json`). ONE sync-safe 5-segment pass off `c.desilenced` (NOT back from `b.blackout`, which would
  have resurrected them). 437.02 → 436.24s.
  | # | words | cut span | what it was |
  |---|---|---|---|
  | 1 | "yet" → "Robinhood" | 262.575-262.780 | LinkedIn notification chime (−30.5 dB) |
  | 2 | "finished" → "So" | 296.712-296.952 | cough (−14.8 dB) |
  | 3 | "motion" → (pause) | 317.699-317.880 | cough, first beat (−17.6 dB) |
  | 4 | (pause) → "And" | 318.444-318.634 | cough, SECOND beat (−13.2 dB) — found by the agent, not in Mike's brief |
  All four joins VERIFIED on the rendered file (silence valley + Whisper reads both bracketing words whole).
  All joins land inside blacked COVER, so no head-position jump was possible. The deliberate 564 ms CH5 pause
  between cuts 3 and 4 was preserved. Note: the agent re-derived cut 4's edges (the briefed span was not
  trough-bounded and would have left a stub and clipped "And").
- **FINAL two-zone desilence** (Mike: 230 ms intro / 500 ms body), run off `d.cleaned` per §13a's documented
  `d.cleaned -> e.desilenced -> f.final` chain → `spine/ALL.e.desilenced.mp4` (+ `.map.json`).
  Split at **53.33s** (the measured CH1→CH2 seam). 436.24 → **417.41s (6:57.41)**, 37 cuts, 19.0s removed
  (intro 12 cuts/4.58s · body 25 cuts/14.42s). Swallowed-speech QA: 0 flags.

**THE FINAL SPINE = `spine/ALL.e.desilenced.mp4` (417.41s / 6:57.41). Locked.**

## Transcript (2026-07-31)
`transcriber` agent, Whisper medium/GPU, word-level → `spine/ALL.e.desilenced.medium-words.json` +
`spine/ALL.e.desilenced.segments.txt`. 113 segments, 1265 words, last word ends 417.36.
15 mishears corrected in text only (the word-time JSON is NOT hand-edited): notably "keep a current value"
→ "keep accruing value", "not the floor in this story" → "not the flaw in this story", "the lab token" →
"the LABS token". Persona standing corrections checked, none triggered (Kaspa is never mentioned).

### Chapter map + FACE windows on the FINAL spine
| CH | Start | Length | Opener |
|---|---|---|---|
| CH1 | 0.00 | 0:49 | "While everybody in crypto has been staring at the price," |
| CH2 | 48.92 | 1:21 | "So what's actually happening here?" |
| CH3 | 129.92 | 1:10 | "And now we get to the thing that made everybody really sit up in their chair." |
| CH4 | 200.34 | 1:29 | "So why is all this bullish for Ethereum, the asset?" |
| CH5 | 289.54 | **2:08** | "So look at the whole board," |

CH1-CH4 = **4:49.54**. FACE windows (blackdetect, 7 total, every one on a scripted [FACE] beat, no orphans):
`0.00-8.44` · `29.96-30.73` · `107.54-111.88` · `142.74-144.78` · `279.18-286.12` · `306.27-391.19` (the CH5
ad-lib block, 84.9s) · `409.04-417.41` (closing CTA).

### Transcript flags for AS-RECORDED
- **FLAG A @309.28-314.06 — ✅ RESOLVED (Mike, 2026-07-31).** The line is **"I say that Ethereum FLIPS
  Bitcoin, and we're around 2030, 2032, 2035"** — present tense, with an S. Whisper medium heard "flipped"
  (wrong) but heard "and we're" right; large-v3 was wrong on both ("flipped" + "somewhere around"), so the
  larger model is NOT more trustworthy here. "flips" is registered in the corrections list in
  `spine/ALL.e.desilenced.segments.txt` and MUST be applied at caption build (the word JSON keeps the raw
  "flipped" as cue data). Any caption/title/description quoting this line uses "flips".
- **FLAG B @383.14:** "you'll get more multipliers out of it" — referent unstated (means Ethereum vs the
  just-named XRP).
- **FLAG D @253.40:** he says Robinhood Chain fees "in **this first week**" (singular). The sourced $816K is
  CUMULATIVE through July 13, so the on-screen chart wording must NOT follow the VO verbatim here.
- CH4 opener says "Ethereum, the asset" not the scripted "ETH, the asset"; he uses both interchangeably.
- The scripted sign-off "I'm gonna catch you guys, later." was NOT said; he closes on "let me know if you
  think I'm crazy, or you think I'm right on target."

### Chapter map on the FINAL (desilenced) timeline
| Chapter | Starts | Length | Screenplay target | Delta |
|---|---|---|---|---|
| CH1 | 0:00.00 | 0:53 | ~0:50 | +3s |
| CH2 | 0:53.22 | 1:23 | ~1:05 | +18s |
| CH3 | 2:15.86 | 1:13 | ~1:10 | +3s |
| CH4 | 3:29.30 | 1:30 | ~1:20 | +10s |
| CH5 | 4:59.72 | **2:17** | ~0:55 | **+1:22** |

**CH1-CH4 land at 4:59.72 — essentially exactly the 5:00 target.** The entire overrun is CH5.

### Review flags (content decisions for Mike, NOT spine defects)
1. **CH5 is a ~2:17 ad-lib vs one scripted sentence.** Recorded content: the flippening call with
   2030/2032/2035 variants, a disclaimer, a track-record run (550x, 350x on LABS), "check back in with me
   in five/seven/eight years", a top-10-multipliers/XRP tangent, a **mid-block CTA at ~826-833s (defumbled
   coords)**, then a bridge back to Ethereum, then the closing like/subscribe/comment CTA. None of it is a
   retake, so the defumbler correctly left all of it in. Trimming it is an EDIT-PLAN / AS-RECORDED call.
2. **The scripted sign-off "I'm gonna catch you guys, later." was never recorded.** The video currently ends
   on the like/subscribe/comment CTA. Either record a pickup or treat it as a hard-out (which is a sanctioned
   deliberate choice, but should be Mike's explicit call, not a default).
3. **Chunk [044] is a paraphrase** of the scripted CH2 FACE line: recorded "So the most conservative money on
   earth is actually parking right on Ethereum." vs scripted "The most conservative money on Earth keeps
   choosing Ethereum." Tagged FACE on positional/content match; worth an eyeball.
4. **Cover-blackout judgment call to double-check:** the CH5 "back to Ethereum" bridge + the "banks are even
   half right" closer were tagged COVER (matching their scripted COVER tags) even though they sit inside the
   larger CH5 ad-lib sandwiched between two FACE stretches. If Mike stayed on camera continuously through
   there, those should flip to FACE.
5. **Three loud non-speech bursts** ([141], [147], [216]; peaks −4.8/−4.8/−7.3 dBFS) were removed by the
   defumbler as trivially-safe whole-chunk drops in 5-18s of dead air. No burst between kept words was
   touched; the desilencer's QA scan found no remaining transients. If Mike hears one, that's burst-removal.
6. **Whisper mishears for AS-RECORDED / captions** (audio is fine, the transcript is not): "aetherium" /
   "theorem" / "Heath" = Ethereum/ETH · "just lost" = just launched · "hit parks" = it parks · "an Ankitier
   theorem underneath" = anchored to Ethereum underneath. Also omitted vs script: "Let's dive in.", "Now,
   full transparency.", and CH4's "Now, the honest part…" became "And this is where it gets interesting."

**Tooling note:** repo-root `CLAUDE.md` states the defumbler must "get Mike's text cut-plan approved BEFORE
rendering," but the canonical skill (`skills/defumbler/defumbler.md` line 42, Mike 2026-06-29) says cut-plan
approval is OPTIONAL and defaults to SKIP, because Mike would rather review the finished spine after all
three steps run straight through. Canonical source wins, so the gate was skipped (as Mike requested here).
**The CLAUDE.md line is stale and should be corrected so it stops contradicting the skill.**

## Blueprint phase — COMPLETE except TRANSITIONS (2026-07-31)
**Mike's cover priority (2026-07-31): RECEIPTS first · CHARTS second · containers third · b-roll last.**
- **`coverage-strategist` pass → `COVER-PLAN.json`** (new, the machine-readable placement contract).
  **44 cover cues over 301.59s (72.3% of runtime), an EXACT partition** — orchestrator-verified
  independently: zero gaps, zero overlaps, zero FACE collisions, every dwell floor and ≤4s cap respected
  (only V9 at 4.54s uses the `lead:true` ≤5s exception). Budget deliberately UNDERSPENT per Mike's order:
  **Envato 9/10, ChatGPT 3/5.**
  Per-type: 7 receipts (3 article / 4 other) · 8 animated-chart slots · 6 system-design slots · 10 card
  slides · 3 title cards · 9 Envato · 3 ChatGPT.
- **`BROLL-PLAN.md`** — the acquisition/build worklist: RECEIPTS capture table (with capture URL + motion
  treatment per row), CHARTS worklist split Type 1 ANIMATED / Type 2 SYSTEM-DESIGN, SLIDES worklist
  (TITLE / CARD), Envato + ChatGPT lists with the **Reference column**, and an explicit
  "dropped / deliberately underspent" section so nothing is a silent truncation.
- **`EDIT-PLAN-prep.md`** — beat-indexed layer map, zero-orphan reconciliation. (Authored post-record to
  complete the §13 set; noted in-file as a lifecycle exception.)
- **`EDIT-PLAN.md`** — the hand-authored time-ordered EVENT LOG (§1 format), every SAY line interleaved with
  every layer event, PRE-build as the blueprint the comp is built TO.
- **`CUE-SHEET.md`** — layer-grouped watch-along (§2 format) with the MANDATORY transitions section.
- **`TRANSITIONS.md`** (`transition-strategist`) — every scene change assigned, source-prefixed. Picks:
  **cards = `rmn:cube` from-right ×3** (the only @remotion/transitions use) · **face = `lib:blocks` family**
  (Blocks·Max on cuts, strips tier on punch-ins + the mechanically-forced 0.77s FACE-2 window) ·
  **melt = Melt RGB ×4 · spin = Spin 3D Side Ease ×2**, all six on the marquee diagram beats only.
  Face pick is Blocks over film burn on register grounds (digital-epic: synthwave bed, neon Robinhood accents,
  RGB-melt/3D-spin kit — a warm analog burn would be the one orphaned device). **All 11 concrete `lib:` ids
  verified present in the 853-row `assets/transitions/library.json`.** Two shared-boundary precedence calls
  recorded (I2's ingress absorbed by the face-out Blocks; the D3-A marquee spin replacing the Blocks face-out).
  7 punch-in re-frames assigned across the 84.9s CH5 block so it is never a static hold.
- Transition layer merged back into `EDIT-PLAN.md` (rule table + marquee list) and `CUE-SHEET.md`.
- **✅ GATE `node skills/lint-docset.js media/ethereum-rwa` → PASS: "document set complete, safe to build the
  comp."** All 10 docs present and valid.

## ✅ COMPLETE — 2026-08-01. FINAL = `_previews/ethereum-rwa-FINAL-v9-music.mp4`

**Mike, 2026-08-01: "video done. we can call this complete with v9."**
**7:00.5** (420.533s) · 12,616 frames · 208 MB · audio −18.1 LUFS · bed −36.0 LUFS (17.9 dB under the VO).
_(Runtime note: the SPINE is 6:57.41; the finished comp is 7:00.5 because 3 baked card pauses add 3.003s +
1f PAD. Quote the comp length for queue metadata, never the spine length.)_

**TITLE (Mike, 2026-08-01): `Smart Money Is Preparing Something Big For Ethereum`.**
Queued as `lf-20260801-ethereum-rwa` in `schedule-tweets/data/longs.json`, video + thumb staged at
`schedule-tweets/longform/ethereum-rwa/`. Pending on rumble · bitchute · facebook (NO YouTube — Mike
uploads longform to YT by hand).
- **YouTube chapters** (comp time, each on its CARD so the chapter opens on the title, not mid-sentence):
  `0:00` The wave nobody's watching · `0:48` The proof · `2:10` Robinhood Chain · `3:21` The bull case for
  ETH itself · `4:52` Ride the wave. (CH5 has no card, so it sits on the spoken opener.)
- **Soundstripe codes — YOUTUBE DESCRIPTION ONLY** (never FB/IG/Rumble), bed order A|B|C|D:
  `XYZW1UVUQWIPXVXF|X0AVOCNCPEKOUPW8|D8CUMAJ1HW1GZXXB|CM0H6NCUNQIUSA0E`
  = Down To The Wire (Rhythm Scott) | Fortitude (ltebloomr) | Edgerunner (Mikey Geiger) | Searching For
  Signs Of Life (Hill).
- _Rejected title, recorded so it is not re-applied here: "Clarity Act Fail: The SEC Has Our Back" belongs to
  a DIFFERENT video. This one never says "clarity" or "SEC" (0 hits in the final transcript) and the approved
  thumbnail reads "Investing Two Trillion" with an ETH coin._

### v7 (full render) — pixel QA caught a ship-blocker
The v7 full render completed clean (exit 0) and *looked* fine by every automated measure. Eyeballing
frames per the resume pointer's own warning found **Mike's face rendered as PURE BLACK at all 6
face-OUT transitions** (8.44 · 30.73 · 111.88 · 144.78 the marquee spin · 286.12 · 391.19).
**Root cause:** `SpineStill` used `OffthreadVideo startFrom=`, which sets an ENTRY point and then
ADVANCES with the frame. On a face-out it walked off the end of the FACE window into the
cover-blackout region and went black one frame in. Fixed with Remotion's `<Freeze>`.
_This is why the "verify by LOOKING, not measuring" instruction exists — v7 would have shipped._

Two more found in the same pass: FACE 1's face-out pulled the raw green-screen spine instead of the
node-lattice backdrop swap that actually airs there; and **`STILL_FX` (the I1/I3 badsignal ingresses)
was declared but never referenced**, so both planned glitches were absent from v6/v7 — and their
tile plate sets had never been copied into `assets/transitions/` either.

### Mike's rulings (2026-08-01)
1. **Cover-boundary black dips: LEAVE AS IS.** `CoverInner` fades each cover in from `opacity: 0`
   while the outgoing cover's Sequence has already ended, so it fades up from the blacked spine —
   1 fully black frame + ~0.33s ramp at **31 cover→cover boundaries** (incl. every CH5 montage swap).
   Present in v5/v6/v7 alike, NOT a regression. Mike chose to keep it. **Do not "fix" this later.**
2. **Face edges: cross-fade ONLY the 0:30 pair (FACE 2), Blocks stays on the other 7.** Its strips
   glitch popped at both edges on a 0.77s window. Implemented as a hand-rolled silent `XFade`
   (no SFX file = no pop); the face side uses the LIVE spine on a face-in and a frozen still on a
   face-out (after blackout there is no face left to dissolve). House rule #3 ("never a plain
   cross-fade to the face") still governs the other 7 edges — this is a recorded per-video exception,
   declared in the comp as `// TRANSITIONS_WAIVED: blocks-strips-3x`.
3. **No glitch on AI-still ingress.** Mike on v8 @1:42: the glitch kit is for the in-face zoom snaps,
   NOT for cutting to an image. Both badsignals removed. `STILL_FX` is kept as the record of the
   superseded plan — **do not re-wire it.** (Consequence: 1:42 now shows the ruling-1 black dip that
   the glitch had been masking. Accepted.)
4. **Splice, never a full re-render, for a fix round.** Mike, twice. v9 re-rendered **1,365 of 12,616
   frames (10.8%)** across 12 windows; the rest came straight from v8. See the technique note below.

### The 5 defects fixed in v9 (all verified in pixels/audio)
| Reported | Cause | Verified |
|---|---|---|
| 0:02 glitch with no zoom | FACE 1 airs from `F1Swap`, which never got `spineScale` — the re-frame fired over a static picture | PSNR vs v8: 50.8 dB before the 3.14 anchor, 17.7 dB after |
| Pop at both 0:30 edges | the transition's own SFX file | replaced by the silent `XFade` |
| Glitch at 1:42 on an image | the badsignal ingress | removed |
| "right" twice @5:30, "but" @5:49 | **`SpineStill` was UNMUTED** — every TransitionClip mounts it TWICE (outgoing+incoming, 0.1s apart) over the live Spine, so each glitch added 2 late copies of the VO. Both timestamps sit exactly on re-frame anchors (326.24 / 346.9). | v9 = −20.7 / −19.6 dB, **exactly matching the spine**; v8 ran 0.4-0.6 dB hot |
| Zoom snapped 1.15→1.0 whenever a transition took over (0:08, 4:46, 6:31, face-ins 1:48/6:49) | `SpineStill` froze the FRAME but not the SCALE. Only visible once the Freeze fix stopped it being black. It also flattened all 11 re-frame snaps (both sides showed the same scale, so the glitch fired over a zoom that never happened). | face size now matches across the boundary |

### Technique that made the splice cheap (reuse this)
- **An audio-only change needs NO video re-render.** The `SpineStill` mute altered audio at ~20
  scattered points but zero pixels. `npx remotion render … out.wav --codec=wav` renders the audio
  with no frame rendering, then mux with `-c:v copy`.
- **A shared-component fix is still splice-able** — enumerate every window the component appears in
  (here: face edges + re-frames, 16 windows / 341 frames) and re-render only those. Systemic ≠ unsplice-able,
  as long as the scope is PROVEN rather than assumed.
- Merge windows whose gap is < ~250 frames: a Remotion invocation costs ~25s of bundling ≈ 150 frames
  of rendering, so fewer, larger ranges beat many tiny ones.
- Splice with `filter_complex` trim/concat (never the concat demuxer), **verify the frame total BEFORE
  encoding**, then PSNR each seam: copied regions came back 44.7-61.8 dB (identical), patched regions
  18.3-19.7 dB (changed). Video-only concat + separately-muxed audio means no A/V drift is possible.
- **The music bed survived as a FILE.** The v5 mix command existed only in a dead session's shell, so
  the bed was recovered by subtracting the un-mixed render from the mixed one:
  `_tmp/mix/bed-extracted.flac`. Verified faithful three ways (−36.0 LUFS = 17.9 dB under the VO;
  per-chapter levels match the approved per-bed gains; end-alignment maps `s = t − 169.10` so the
  file's last sample lands on the final frame). Re-applying it is one `amix` with `-c:v copy`, ~40s.

### New mechanical gate (Mike's standing "gate it in code" rule)
**`skills/lint-transition-assets.js`** — added because this failure class cost a render twice:
(a) a transition PLANNED in `TRANSITIONS.md` but never wired into the comp, and (b) a referenced
transition whose plate/tile/SFX assets were never copied into the lean project `assets/transitions/`.
Neither errors at render time; the effect is just silently missing. **The trap it closes: engines read
`plateDir`/`tileDir`/`maskDir` out of `row.params`, NOT off the row** — a check that only looks at
top-level keys passes while the render is broken. It also caught my own change mid-session (FACE 2's
superseded `blocks-strips-3x`), which is what the `// TRANSITIONS_WAIVED:` escape hatch is for.
Wired into the PRE-RENDER GATE list in `longform-edited/CLAUDE.md` §6c.

### Accepted as-is at completion (were open, Mike closed them by calling v9 done)
- **D4-C:** 0.15% of $816K is $1,224, not the $1,538 on screen (the source's own pair is unreconciled).
- **BitMine:** R5 shows 5.54M on screen for 9s while the VO says "5.7 million".
- **`br-wave.mp4`:** banned teal, visible at the 391.19 face-out.
- LAB card says 353X vs the VO's "350X"; LAB reference PNG is not transparent.

### Completion sweep — DONE 2026-08-01 (comp-build.md §12a)
Mike had to ask for this, so it is now a documented step: **the FINAL lives in the project ROOT, and
`_previews/`/`_tmp/` do not survive "complete."**
- `_previews/ethereum-rwa-FINAL-v9-music.mp4` → **`ethereum-rwa-FINAL.mp4`** at the project root
  (sibling convention `<slug>-FINAL.mp4`; `-vN`/`-music` suffixes dropped, they were review-loop scaffolding).
- **Music bed rescued FIRST:** `_tmp/mix/bed-extracted.flac` → **`music/bed-final.flac`**, and `mix-music.sh`
  now defaults to that path. This was the one real dependency: the bed is unrecoverable once BOTH `FULL-v5`
  and `FINAL-v5-music` (the pair it was subtracted from) are gone, and it is what re-mixes any future re-cut.
  Not put in `assets/` on purpose — that is the per-render `--public-dir` and would bundle 65 MB into every
  future render.
- **Recycled in full (Recycle Bin via `cleanup/lib.js recyclePaths`, reversible): `_previews/` (2.0 GB) +
  `_tmp/` (66 MB)** — v1-v9, all `-music` mixes, smoke tests, `chunks/`, `patch/` (the 12 splice segments +
  `v9-audio.wav`), render logs, QA frames. Verified the queue copy at
  `schedule-tweets/longform/ethereum-rwa/ethereum-rwa.mp4` was intact first, so the deliverable existed in two
  places at the moment of deletion.
- Note: `cleanup/cleanup.js` would never have done this — its `video-creation` policy is whole-folder and keyed
  to `batches.json`, and this project has `batch: null`, so it is "left alone" forever. Manual by design.

---

## ⏸ (SUPERSEDED — done 2026-08-01) RESUME 2026-07-31 EOD — LAUNCH THE FULL RENDER

**Everything is built and verified. The first action tomorrow is one command.**

```bash
cd C:/Users/mnede/Documents/Claude/social-media/video-creation/remotion
OUT="../longform-edited/media/ethereum-rwa/_previews"
npx remotion render src/index.ts EthereumRwa "$OUT/ethereum-rwa-FULL-v7.mp4"   --video-bitrate=2M   --public-dir "../longform-edited/media/ethereum-rwa/assets"   --timeout=180000 --concurrency=3 2>&1 | tee "$OUT/full-render-v7.log"
```
~40 min, 12,616 frames. Disk was 24 GB free.

### Then, in order
1. **VERIFY THE FX IN PIXELS — by LOOKING at frames, not by measuring.** Extract a frame mid-window at each
   of the six marquees and eyeball it. A pixel-diff filter chain was tried and silently produced NO output,
   reporting "0 difference" at all 8 checkpoints while the render was in fact broken. Do not trust it.
   Marquee frames: `F(144.78)=4404` spin · `F(192.60)` melt · `F(202.96)` spin-short ·
   `F(246.54)` / `F(253.40)` / `F(266.60)` melts. Also check a receipt (R1 f345, R5 f6850) for the
   single-image motion move, and I1/I3 for badsignal.
2. **Re-mix music** (ffmpeg, `-c:v copy`, ~1 min, no re-render). Exact command + all 4 bed params are in the
   v5 mix already run — copy it and swap the input to v7. Current approved gains: **BED A 0.0668 ·
   BED B 0.0211 (Mike −5 dB) · BED C 0.0251 (Mike −5 dB) · BED D 0.0531, source_in 34.88**
   (re-aligned so the end hit lands on the last frame). Verify by subtracting the un-mixed render to
   isolate the bed — target 15-18 dB under the VO.

### State of the comp (all done, do not redo)
- `src/EthereumRwa.tsx` — spine + 44-cue cover layer + 7 animated charts + CH1 captions + hand-rolled
  `cube-3d` cards + 11 measured jump-cut re-frames + **the full FX layer**.
- **FX layer rebuilt the documented way (comp-build §6a):** `TransitionClip` gets the REAL outgoing and
  incoming cover nodes, in a Sequence of EXACTLY the engine window. 6 marquee MELT/SPIN · 9 face-cut Blocks
  · 2 short-tier strips on the 0.77s FACE 2 · 11 re-frame strips · badsignal on I1/I3.
  `MotionFX` drives the engine directly across a receipt's WHOLE window (same asset both sides) — that is the
  single-image motion effect, which is NOT a cut transition.
- Typechecks clean. Marquee spin **verified in pixels** (settlement stack mid-3D-turn, motion-blurred).
- `assets/transitions/` populated: 2 badsignal plate sets + all 127 SFX + maps/masks = **97 MB** (the full
  library is 490 MB; only what this video uses was copied, per §10 "keep it lean").

### Known-good fallback
**`_previews/ethereum-rwa-FINAL-v5-music.mp4`** — restored ending, all 5 fixed receipts, LAB card, both
music adjustments. NO FX layer, but correct and shippable. Keep until v7 is verified.

### Still open (Mike's calls — none block the render)
- **D4-C percentage:** 0.15% of $816K is $1,224, not $1,538 (the source's own pair is unreconciled; real
  ratio 0.19%). Recommendation: drop the percentage from the chart, keep the two dollar figures.
- **BitMine:** live tracker confirms **5.54M ETH**; R5 shows it on screen for 9s while the VO says "5.7 million".
- **LAB card says 353X** while the VO says "350X" (353X is the precise figure, and what Mike asked for).
- LAB reference PNG is not transparent, so the mark sits on a faint dark box.
- `br-wave.mp4` still needs RE-SOURCE (banned teal, and the wave collapses inside its slot).
- FACE 2 stays as recorded (Mike's call). FACE 1 keeps its backdrop swap.

### Three failures logged in `claudeisnaughty.md` — all mechanically preventable
1. The whole transition layer was planned, verified, corrected twice, then **never wired**. The 5 gates check
   covers/docs; **none asserts a project with a TRANSITIONS.md actually calls those ids.**
2. Spine was 29.97fps vs the comp's `fps 30` → render ran out of frames 0.42s early and **clipped the final
   words**. Caused by burst-removal re-encoding at `30000/1001`. Now documented in `comp-build.md` §1 +
   `burst-removal.md`, with a `skills/check-spine-fps.sh` gate that fails correctly on this project.
3. First FX attempt passed BLANK scenes to the engines, which render **black, not transparent** — painting
   black rectangles over 30 points. Every `staticFile()` path was also un-checked, costing two failed renders
   (missing plates, then missing SFX). All three are pre-flight assertable.

## ⏸ RESUME POINTER — 2026-07-31 16:21 EDT (paused on credits; scheduled restart 17:02 EDT)

**THE NEXT TASK IS THE REMOTION COMP BUILD.** Everything upstream is DONE and gated. Mike approved
proceeding; no further decisions are needed to start.

### Mike's standing decisions (all confirmed — do NOT re-ask)
1. **Render strategy:** SKIP the 0.2 Mbps full draft. Do targeted **10s chunk renders** at the risky beats
   first, then ONE full render at **2.0 Mbps**, then **partial-replace** any bad sections via sync-safe ffmpeg
   concat (render only the middle, concat 3 pieces). 12,510 frames is under the ~14,436 stitch ceiling, so
   single-pass is fine. Rationale: frame rendering dominates cost, not the h264 encode.
2. **Captions: ALL of CH1 (0.00-48.92), including its cover footage**, as a deliberate per-video exception
   (flag those cover entries `cap: true` so `lint-covers.js` passes). **No captions after CH1.**
3. **Face jump-cuts:** alternating IN/OUT re-frames, each firing a library glitch on the snap. **All 11
   anchors are MEASURED and already in `TRANSITIONS.md` §3 + §5** — FACE 6's seven land on real desilence joins.
4. **CH1 backdrop = candidate A (node lattice).** Seedance v2v swap is BUILT:
   `assets/vid/F1-higgsfield-bg-swap.mp4` (864x496, 24fps, 9.04s, 480p per the hard rule, no audio).
   Alignment: source clip t=0.40 == spine t=0.00 (0.4s head handle). **Mike has NOT yet eyeballed the face**;
   it compares well to the raw (same hair/face shape/features, slightly smoothed). If he rejects it, FACE 1
   airs as recorded from the spine — a one-line comp change.
5. **FACE 2 gets NO background swap** (0.77s, stitched from 2 raw fragments; not viable for Seedance).
6. Thumbnail APPROVED and delivered (`thumbnail.png` 1280x720 + `thumbnail-2k.png`).

### Do this, in order
1. Build the comp (`skills/comp-build.md`): spine `OffthreadVideo` + `CUTS`/`sh()`, 3 card pauses, COVER layer
   off `COVER-PLAN.json`, transitions off `TRANSITIONS.md`, CH1 captions, 7 FACE windows + the 11 measured
   re-frames. Register it in `remotion/src/Root.tsx`.
2. **Mechanical gates, ALL must pass BEFORE any render:** `node skills/lint-covers.js <comp>` (exit 0) ·
   `python skills/lint-deck-containers.py` · `python skills/lint-pause-silence.py <comp> <spine>` (run on the
   SOURCE spine BEFORE baking pauses) · `node skills/lint-slide-balance.js` · `python skills/bed-duck-expr.py`
   for the music-mix duck expression.
3. 10s chunk renders at: D3-A spin (144.78) · the 3 tollbooth melts (246.5 / 253.4 / 266.6) · C2 across the
   face cut (26.2-36.0) · a card pause (48.92) · the CH5 montage (289.5-306.3). QA motion AND audio per `video-qa.md`.
4. Full render 2.0 Mbps → `_previews/`.  5. ffmpeg-mix the 4 beds.  6. Partial-replace any fixes.

### Known-open, NOT blocking the comp (asset-level swaps)
- **`br-wave.mp4` needs RE-SOURCE** — banned teal (58%→98% coverage), brightest clip by 2-8x, and the wave
  COLLAPSES inside its slot. Disk is now free (24 GB) so the darker 4K item can download. Want: dark deep-blue
  swell BUILDING, no sky, no coastline.
- **5 receipts need fixes:** R5 + R6 RECAPTURE (undismissed Telegram popup / zero horizontal headroom, and R6
  must be re-shot with ETHA framed for the corrected `perspective-ease-in-LEFT`); R1, R3, R7 CROP-ONLY.
- **D4-C-2 arithmetic PENDING Mike:** 0.15% of $816K is $1,224, not $1,538 (the source's own pair is
  unreconciled; real ratio 0.19%). Recommendation: **drop the percentage from the chart**, keep the two dollar
  figures. VO keeps saying 0.15% (defensible as spoken approximation).
- **BitMine PENDING Mike:** VO says "5.7 million"; live tracker shows 5.54M and R5 is on screen for 9s.
- **Phone clip** legibly shows a BTC/USDT pair under the "Robinhood wallet" line (accept / re-source / reframe).
- `br-bank-lobby` is licensed as "Sophisticated Hotel Entry" (QA verified its lead motion is genuine; keep).

## Earlier resume pointer — asset factory (COMPLETE)
The blueprint is complete and gated. **Next: build the assets** (all five executor agents can run in parallel;
`visual-qa` gates every output before Mike):
`chart-builder` (8 animated-chart slots + 6 system-design states, incl. the D3-A stack and the 3-state D4-C
tollbooth) · `slide-builder` (3 title cards + 10 card slides incl. the 5 @end montage stills) ·
`receipt-capturer` (7 receipts, every one opened and verified) · `envato-sourcer` (9 clips) ·
`image-gen` (3 ChatGPT stills). Worklists + exact specs: `BROLL-PLAN.md`. Then comp build per
`skills/comp-build.md`, `lint-covers.js` + the §6c mechanical gates, draft render at 200k, chunk QA, final.

**Open decisions for Mike before/at build:** MONT sub-5s exemption · captions (CH1 face-opener only, or none) ·
C4 overlap check · the 7 transition open questions · title-card texts · live-drift re-pull of every `[VERIFY]`.

### Load-bearing decisions baked into the cover plan
- **[D4-C] fee-gap tollbooth is 3 sequenced states**, not one hold: overview → the 0.15% split → the Fusaka
  fee floor. State #2 labels the figure **CUMULATIVE through July 13** and deliberately does NOT echo the
  VO's "in this first week" (FLAG D).
- **[D3-A] settlement stack** is the marquee: shown ONCE in full (16.5s, badges word-synced), then a separate
  **#L1 break-up state** for the callback, never a full-slide repeat (THE BALANCE + no-reuse).
- **[C8]** puts Solana's ~95% tokenized-equities lead on screen under OUR framing (axis scoped to
  stock-trading volume so it can never read as overall RWA dominance) — keeps WARNING box 3 honest.
- **[C2]** is a deliberate two-state reveal (unlabeled → labeled) across the "Ethereum." face cut.
- The 2:14 unbroken cover span (144.78-279.18) is resolved into **16 sequenced swaps, avg 8.4s** — the
  long-hold danger zone is gone.

## Earlier blueprint progress (2026-07-31) — superseded by the section above
- **`AS-RECORDED.md` — WRITTEN.** The as-built timecoded script off the final-spine transcript: chapter map,
  7 FACE windows, per-chapter beat tables marked KEPT/CHANGED/AD-LIB vs the screenplay, the divergence
  summary, CH5 trim guidance, and the carried flags. **All three screenplay `[!WARNING]` guards HELD on the
  take** (no fee-revenue overclaim, the $2T voiced as a forecast, the Solana lead acknowledged).
- **`MUSIC-PLAN.json` — WRITTEN** (`music-placement-strategist`). All 4 screenplay primaries reconciled against
  `assets/music/library.json` and verified on disk; every primary is already the instrumental cut. VO measured
  at **−18.1 LUFS**, per-bed gains derived per file (a single shared MUSIC_DB would miss the 16-18 dB window by
  up to 3.6 dB). Full 417.41s coverage, **zero loops** (every bed sits inside one continuous pass of a longer
  file), only the three sanctioned 0.6s inter-bed breaths. BED D (Searching For Signs Of Life) is END-ALIGNED
  across CH4+CH5 so its epic hit resolves on the final frame, with the verdict line "not priced for it. Not
  even close." landing on the final peak.
- **NOT YET WRITTEN (deliberately deferred — they are timecoded and would need re-deriving if CH5 is trimmed):**
  `BROLL-PLAN.md` · `EDIT-PLAN-prep.md` · `EDIT-PLAN.md` · `CUE-SHEET.md` · `TRANSITIONS.md`. The
  `coverage-strategist` and `transition-strategist` passes are also pending on the same ruling.
- Pre-build gate `node skills/lint-docset.js` NOT yet run (it will fail until the doc set above is complete).

## Mike's rulings (2026-07-31) — CH5, hard-out, deleted folders

1. **CH5: NOTHING IS CUT.** Mike: *"There's nothing that I want to cut out."* The video ships at **6:57** with
   CH5 in full (2:08, all 10 beats). **The ~5:00 target in this log and in SCREENPLAY.md is a pre-record
   planning aid and is now SUPERSEDED** — do not treat the delta as an overrun. 6:57 is normal house length
   (Clarity Act shipped 6:59). Every timecode in `AS-RECORDED.md` is therefore FINAL, and MUSIC-PLAN's
   `CH5 TRIM RULING PENDING` open question is resolved with no re-derivation needed.
   _(My error, recorded so it doesn't recur: I authored trim guidance off the soft 5:00 target and it included
   the beat elaborating his flippening thesis. Recorded ad-libs are deliberate content, not overrun — the
   defumbler already stripped every retake.)_
2. **Close: HARD OUT, confirmed.** The scripted "I'm gonna catch you guys, later." sign-off is intentionally
   absent; Mike ends videos abruptly to shed the trailing seconds where viewers click away. **No pickup.**
   The video ends on the last word (417.36).
3. **Deleted project folders: EXPECTED, not an incident.** Mike deletes `media/<project>/` folders over time;
   no project folder is needed once its video is published. Nothing was restored, and none of this needed
   raising. **Consequence worth knowing:** the canonical skills cite now-deleted projects as exemplars
   (`comp-build.md` §13 → `media/zebec/AS-RECORDED.md`; §13a → `media/carry-trade/spine/` and
   `media/Kaspa founder genius or over-rated/spine/`). Those pointers are dead. The skills' own embedded
   skeletons are the real spec — read those, never a sibling project.

## Resume pointer

**2026-07-31 — SCREENPLAY.md drafted, PENDING MIKE'S GATE.** `screenplay-strategist` authored the full
5-chapter screenplay (working title "Ethereum's Silent $30 Billion Takeover") off this PROJECT-LOG +
DATA.md: hook/thesis with 3 hard `[!WARNING]` guardrails (no fee-capture overclaim, $2T stays a forecast,
Solana's tokenized-equities lead stays acknowledged), Convention-5 tagged beats per chapter, a 4-bed
MUSIC-MOOD-PLAN (cards fall out of the bed-change map: CH2/CH3/CH4 only), and a VISUAL-PLAN naming the 4
marquee containers/charts (the Robinhood settlement-stack diagram is the centerpiece). Estimated runtime
~5:10-5:25 (slightly over the 5:00 target; trims are listed in its OPEN QUESTIONS section).

**2026-07-31 — recorded + spine-prep COMPLETE.** See the spine-prep run above. Current spine =
`spine/ALL.c.desilenced.mp4` (7:16), pending Mike's review.

**Next step:** Mike watches `spine/ALL.c.desilenced.mp4` and rules on the CH5 overrun (flag 1), the missing
sign-off (flag 2), and the FACE/COVER call in flag 4. Then: `transcriber` agent on the FINAL spine (word-level
timings) -> `AS-RECORDED.md` (build the edit to THIS, not the screenplay, where they differ) -> `EDIT-PLAN.md`
authored off the word timings BEFORE any comp work -> BROLL-PLAN off the screenplay's VISUAL-PLAN ->
coverage-strategist / asset factory (4 marquee visuals: the Robinhood settlement stack, the C1/C2 hook pair,
the C3 momentum count-up, the D4-C fee-gap tollbooth) -> transition-strategist -> comp build.

Re-verify every DATA.md figure before render per the screenplay's live [VERIFY] checklist (Robinhood Chain
TVL/volume drift fastest; the fee-split figures are load-bearing for the WARNING-box framing).
