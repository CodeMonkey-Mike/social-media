# BROLL-PLAN — tutorial / clip #5 `doginme-100x-if-500x` (variant FULL, 39.60 s)

Mike's frozen 4b title: **"doginme at 107 Million: 400 Million Is a 100X From Here"** · hook type: prediction ·
the stream's closing crescendo.
Comp `TutDoginme100x` · constants `constants-tut-doginme-100x.ts` · captions `captionsTutDgn.ts`.

---

## ⛔ MIKE'S PHASE 7 VISUAL DIRECTIVE (whole batch, 2026-08-09, verbatim) — this plan obeys it

> "i only do not want full screen broll, nor content zone broll. you can do captions, sfx, and any
> overlaying graphics or images with background transparency."

ALLOWED: captions, SFX, code-drawn graphics, image overlays **with real background transparency**.
BANNED: full-screen b-roll and content-zone b-roll, i.e. any asset that **covers the frame or fills the
content zone**. The test is COVERAGE, not the asset's source.

**Declared DEVIATION from the finalized-short checklist, item #4.** The ~25-35 % generated-b-roll band and
the "full-screen at the hook (1-3x)" requirement are **NOT satisfiable** under this directive and are
**NOT met**: b-roll coverage is **0 %**, base-showing **100 %**, full-screens **0**. This is Mike's own
batch-level instruction and it is reported as an explicit deviation with real numbers, exactly as clips
1, 3 and 6 did before it. Nothing here invents coverage to satisfy a checklist.

What is used instead, **re-measured frame-exactly on the shipped render 2026-08-10** (the numbers in the
first draft of this plan were computed before the render existed and two of them were wrong; see
§RECONCILIATION):

| kind | count | measured occlusion |
|---|---|---|
| true-alpha PNG stickers | 2 | PAINTED (alpha>0) at the RENDERED scale: 113.3k px² (12.29 % of the 1080x854 content zone / 5.47 % of frame) and 119.9k px² (13.00 % / 5.78 %). ALPHA-WEIGHTED: 89.2k (9.67 % / 4.30 %) and 68.1k (7.38 % / 3.28 %) |
| code-drawn badges | 4 | ~440x248 px box each = 11.8 % of the content zone |
| graphic-on-screen time | 7 timed events (2 stickers + 4 badges + 1 thumb frame) | **356 of 1188 frames = 11.867 s of 39.600 s = 29.97 %**; **70.03 % of the runtime carries no graphic at all** |
| SFX events | 6 (4 distinct files) | see the table below |

---

## ⛔⛔ CONTENT GUARD — the slug lies, and it binds every element here

The slug promises a **500X on the What If token**. Mike's 4b review **DELETED that whole tail**
(master 4541.98-4570.70, 28.7 s) because the clip is about doginme and the tail switched subject. Slugs
freeze at 4b, so the filename keeps the stale promise.

**Therefore nothing on screen references $IF / "What If" / a 500X.** No badge says 500X. The $IF galaxy
art (`schedule-tweets/images/reference/what-if.jpg`) is **banned** and is never opened by any script in
this folder. The cover teases exactly ONE token.
The one subtlety, handled: the clip legitimately contains the English words "what if" ("**what if**
doginme can survive..."). That is his own sentence about doginme, so it stays, rendered as two ordinary
lowercase caption words, never styled or capitalised as a ticker.
**Numbers allowed on screen** (all from his own mouth): 107M ATH, 400M, 100X, 800M, 200X. Nothing else.

### ⚠ BASE-PICTURE $IF EXPOSURE — measured, reported, NOT masked (needs Mike's call)

The staged spine's own screen-share carries $IF material in its final third, because that is what was on
his monitor at that point in the stream:

| window | what is legible in the BASE picture | measured position |
|---|---|---|
| 27.640-39.600 (**11.96 s = 30.2 % of runtime**) | burned-in live-chat banner `@MichealBlanson  $if $if $if $if $if` | x 6-298, rows 672-789 |
| 36.400-39.600 (the hard-out) | DEXScreener `IF / WETH (Market Cap) on Uniswap` chart, an `IF/WETH` token panel, and the **"WHAT IF" galaxy wordmark** | wordmark x 864-1080, rows 56-124 |

The banner switches over **exactly on the seg1 -> seg2 picture cut, re-measured at 27.640**.
This is the BASE VIDEO, which is staged + GOP-verified and must not be re-cut or re-encoded by a builder,
and the directive above bans covering the content zone, so it is **not masked**. The only real fixes are
upstream (a different seg2/seg3 in-point, or a picture substitution), both outside Phase 7.

⚠ **The first draft of this plan claimed an in-scope mitigation that does not exist.** It said the
hard-out sticker was "positioned top-right specifically so it lands over the WHAT IF wordmark/galaxy
region". Measured on the rendered sticker, its alpha over that band (x 864-1080, rows 56-124) is
**mean 0.2/255, max 10, 0.0 % of pixels at alpha >= 128 = ZERO coverage** (its opaque mass sits at rows
106-378, x 709-991). The **"WHAT IF" wordmark is fully legible on the clip's last 96 frames.** No blocker
plate was added, because an opaque bar over the content zone is exactly the class Mike's directive bans,
and repositioning the mascot high/right enough to cover a 216x68 px corner band would push its ears off
frame. **This is escalated to Mike as an upstream 4b/5 in-point defect, not fixed in Phase 7.**

---

## Reference-image gate — run LIVE 2026-08-10 against `schedule-tweets/images/reference/`

| named thing in the clip | reference on disk | how it is used |
|---|---|---|
| **doginme** | ✅ `DogInMe.png` | **both stickers are derived PIXEL-EXACTLY from it** by `_make_alpha_overlays.py` (border flood fill -> real alpha). The mark is a BLUE muscular pit bull, thick black outline, pointing at the viewer. Nothing generated, nothing paraphrased from the name. |
| **Coinbase** | ❌ none | TEXT-ONLY code badge. No logo invented. |
| **Base** (chain) | ❌ none | no chain logo anywhere; carried by COLOUR only, Base blue `#3aa0ff`. Never Robinhood neon-green (clip 2's palette), never Kaspa teal. |
| What If / $IF | ⛔ `what-if.jpg` exists | **BANNED on this clip.** Never referenced. |

**No ChatGPT generation on this clip, deliberately.** Every visual is either the real reference art
converted to true alpha or code-drawn typography. Rationale: the clip is number-driven (107M -> 400M ->
100X -> 800M -> 200X), which code-drawn numeric plates serve natively; and the standing precedent (a
black lab returned as a golden retriever) says an image model must not re-draw a mascot that already has
real art on disk. The `chatgpt` stage lock was therefore never taken.
**Persona inspection** (both PNGs viewed composited on light AND dark backgrounds before rendering): the
only mark present is doginme's own, no other real crypto logo, no real-person face, no baked text.

---

## Beat table

`mode` is `base` where the screen-share IS the visual and nothing is laid over it.

| # | t (s) | spoken line | mode | asset / graphic | Reference | why |
|---|---|---|---|---|---|---|
| 0 | 0.000-0.033 | (cover) | thumb | `thumb-tutdgn.png` + CODE title/chip | `DogInMe.png` | ONE-frame platform cover. Title `DOGINME ATH / $107 MILLION / 400M IS A / 100X FROM HERE`, chip `FIRST DOG ON BASE`. One token only. |
| 1 | 0.03-1.82 | "i got some dog." | **base** | none | — | Hook. The screen-share IS the visual: he is typing "dog" into CoinMarketCap. |
| 2 | 1.82-3.02 | "i got that / dog in me." | overlay | `broll-tut-dgn-ov-dog-point.png` | `DogInMe.png` | The persona line, on the FIRST limb of the protected doubling. Full-figure doginme pointing at the viewer. Box x 616-1016, rows 118-567 - clears the chat banner (672-789). tOut pulled back to 3.02 so the fade COMPLETES before the 0.760 s protected pause at 3.030. |
| 3 | 3.02-7.55 | "right." / "i got that / dog with me." / "it's like the / first dog on" | **base** | none | — | Three protected pauses live here (3.030-3.790, 4.050-4.785, 6.140-6.850). 100 % graphic-free and SFX-free: the repetition and the beats ARE the performance. |
| 4 | 7.55-11.20 | "the base chain / to be listed / on coinbase" | badge | CODE `FIRST DOG / ON BASE / COINBASE LISTED`, Base blue, top 300 | Coinbase/Base: no reference -> text only | The credential, and the base itself shows the receipt: from 11.5 s the "doginme Markets" table lists **Coinbase Exchange as row 1**. Badge band chosen by measurement - at 8.5 s it leaves the "doginme #241 MCap $4M" search row (rows 130-180) visible. |
| 5 | 11.20-16.20 | "all-time-high of doginme" / "is 107 million" | **base** | none | — | **DELIBERATELY graphic-free.** At 12.5 s his own hover tooltip reads `03/19/2025 Market Cap: $107.209M` at rows 185-235 - the 107M ATH RECEIPT for the exact words he is speaking. Covering it would be the documented wrong move. |
| 6 | 16.20-17.70 | "reasonable to get / to 400 million" | badge | CODE `ATH $107M / $400M / REASONABLE?`, yellow, top 300 | — | The rhetorical target. No arrow is drawn from 107M to 400M and called 100X, because it is not (400/107 = 3.7x); the 100X is from the ~$4.06M cap his own screen shows. |
| 7 | 17.70-21.65 | "big bull run?" / "isn't it reasonable?" / "i don't know." / "i think so." / "that means it's" | **base** | none | — | The protected rhetorical self-Q&A, including the 0.305 s pause at 19.630. Graphic-free and SFX-free. |
| 8 | 21.65-23.05 | "100x from here." / "that means it's" | badge | CODE `THAT IS A / 100X / FROM HERE`, yellow, top 300 | — | PEAK 1, the emotional core. |
| 9 | 23.05-35.10 | "actually 100x" / "man." / "that's nuts." / "100x from here." / "craziness." / "what if doginme" / "can survive to" / "the next bull run and" / "make it an 800" / "million market cap." | **base** | none | — | 12 s of pure base + captions, including the protected 0.635 s pause at 24.620 and the whole 4b-kept 800M/200X escalation. The cadence carries it. |
| 10 | 35.10-36.30 | "we get a 200x" | badge | CODE `800M CAP / 200X / NEXT BULL RUN`, yellow, top 300 | — | The escalation payoff. 800/4.06 = 197x, so "200X" is his own arithmetic, not invented. tOut 36.30 ends BEFORE the picture cut (re-measured at 36.400, so the margin is 100 ms not 180 ms) so it never straddles the next screen. |
| 11 | 36.70-39.75 | "craziness." / "craziness man." / "good times ahead" / "good times ahead" | overlay | `broll-tut-dgn-ov-dog-head.png` | `DogInMe.png` | The doubled HARD-OUT. A DISTINCT treatment of the same real mark (tight head crop, tilted -8°, yellow halo, alpha-ramped neck) so no image serves two beats. Top-right is a COMPOSITION choice only; it does NOT cover the base picture's "WHAT IF" wordmark (measured 0 % coverage, see above). tOut 39.75 is past the comp end so the clip hard-outs at FULL opacity: no fade, no CTA, no closing card. VERIFIED on the render: strong-blue pixel count is flat at 29,840-30,076 across the last 15 frames, final frame 30,049. |

**Zero orphans:** the two PNGs above are the only `broll-tut-dgn-*` files on disk, both are referenced by
the comp, and both exist. Everything else in this clip's visual layer is code-drawn.

---

## SFX (6 events, 4 distinct files)

Crests re-measured on this machine at 0.1 s RMS / 0.01 s hop; every `dur` equals the FILE's own length so
nothing is truncated (a `dur` window does not fade a cue, it TRUNCATES it, and that click has twice
measured louder than the speech it was meant to sit under). Faded/trimmed library variants are reused
as-is at **unchanged gain**; no new variant was created.

| t | file | vol | crest lands | why it is safe |
|---|---|---|---|---|
| 0.00 | `sfx/transition_rapid_whoosh.mp3` | 0.22 | 0.150 | inside the measured head silence 0.000-0.495 (frame-0 cover cut) |
| 10.08 | `sfx/DING-093.wav` | 0.20 | 10.250 | inside the measured silence 10.045-10.455, right before "on coinbase" (credential reveal) |
| 11.33 | `sfx/transition_rapid_whoosh.mp3` | 0.22 | 11.483 | picture cut #1 (re-measured 11.440, so the crest lands 43 ms after it), inside silence 11.315-11.725 |
| 27.53 | `sfx/transition_rapid_whoosh.mp3` | 0.20 | 27.683 | picture cut #2 (re-measured 27.640, crest 43 ms after it), inside silence 27.440-28.325 |
| 35.39 | `sfx/risers/Tension_Rise_Logo_Reveal_3-1s.wav` | 0.09 | 36.060 | 1.00 s riser swelling under "we get a 200x", CUT by the impact. Bed -35.4 dB vs speech -24.0 dB = 11.4 dB under; time-ALIGNED whisper A/B reads "we get a 200x" in the render on 5/5 windows that contain the word, so it does not mask the payoff. |
| 35.97 | `sfx/Impacts/Impact_Hit_01-2-short.wav` | 0.26 | 36.060 | PAYOFF IMPACT on the 200X, crest inside the measured 0.140 s silence 36.030-36.170 (bed -23.7 dB there against a spine at -63.2 dB: it lands EXPOSED in silence, not on a word). Full 0.26 gain kept: timing, not volume, is the knob. |

Truncation re-verified on the shipped windows: **0.0 ms on all six cues.** ⚠ Model the Sequence window
with `floor(v+0.5)`, not Python's `round()` - JS rounds half UP, so the impact's `0.55*30 = 16.5` is 17
frames (0.5667 s > the 0.55 s file). Python's half-to-even gives 16 and invents a phantom 16.7 ms
truncation with a phantom -51.6 dBFS click.

**Picture cut #3 (re-measured 36.400) deliberately gets NO whoosh** - its silence is only 36.280-36.490
and the protected doubled hard-out re-onsets at 36.490, so any transient there would land ON the ending.
The hard-out ships DRY.

---

## Protected beats (run contract) — all five pauses 100 % graphic-free and SFX-free

Measured on the staged spine at 5 ms hop / 10 ms window (silence < -57 dB, audio > -52 dB). The
"added energy" column is the **pre-codec** SFX-only bed, which by linearity IS mix minus spine, so the
AAC encode's own noise floor (+12 to +43 dB on digital-zero spans) cannot confound it.

| protected pause | window | graphic active? | added SFX energy (pre-codec bed) |
|---|---|---|---|
| hook doubling, before "right." | 3.030-3.790 | none (sticker fade completes at 3.02; frame 91 measures baseline) | **-240 dB = BIT-IDENTICAL** |
| hook doubling, before limb 2 | 4.050-4.785 | none | **-240 dB = BIT-IDENTICAL** |
| hook close | 6.140-6.850 | none | **-240 dB = BIT-IDENTICAL** |
| self-Q&A, before "i don't know." | 19.630-19.935 | none | **-240 dB = BIT-IDENTICAL** |
| PEAK 1, before "that's nuts." | 24.620-25.255 | none | **-240 dB = BIT-IDENTICAL** |
| doubled hard-out (whole) | 36.490-39.435 | dog-head sticker from 36.70 (36.490-36.70 is graphic-free) | -43.6 dB across 36.490-36.520 only (the impact's own decay tail), **-240 dB = BIT-IDENTICAL from 36.517 to the end**, against speech at -21.8 dB |

Refinement: the 19.630-19.935 window is not one continuous silence. It measures as two gaps
(19.630-19.780 and 19.790-19.935) with a 10 ms island at -50.9 dB between them, i.e. a breath/tic ~30 dB
under speech. Immaterial (no cue is anywhere near it) but recorded so the next pass does not "find" it.

No caption doubling is deduped: "i got that dog in me" / "i got that dog with me", "isn't it reasonable"
x2, "100x from here" x2, "craziness. / craziness man.", "good times ahead" x2 all render verbatim
(`craziness craziness man` is keyed into `PROTECTED_DOUBLES` because it is the only ADJACENT repeat and
the canonical stutter-collapse would otherwise have eaten it). Confirmed on the SHIPPED render's own
whole-clip decode, which reads all four doublings back verbatim.

---

## RECONCILIATION — this plan vs the comp vs the shipped render (2026-08-10, resumed build)

The plan (09:45) was written AFTER the constants (09:42) and comp (09:43), so it was checked against
them line by line, and every claim was re-measured on the staged spine and on the finished render.

**Every functional value in the comp matched this plan exactly** - all 7 timed windows (`tIn`/`tOut`), all
6 SFX cues (`t`/`vol`/`dur`), both sticker boxes, all 4 badge strings, the thumb title/chip, `SEAM 854`,
`CAP_Y 905`, `DURATION 1188`. **No code value was changed.** Eight claims about the world were wrong or
imprecise and are corrected above:

| # | claim | as documented | as MEASURED | winner |
|---|---|---|---|---|
| 1 | graphic-on-screen time | 12.55 s = 31.7 %, 6 events | 356/1188 frames = 11.867 s = **29.97 %**, 7 events | measurement |
| 2 | hard-out sticker occlusion | 100.0k px² (10.8 %/4.8 %) | **119.9k px² (13.00 %/5.78 %)** painted; the draft sized it off the 432 px source png, not its 460 px rendered box | measurement |
| 3 | picture cut #1 | 11.480 | **11.440** (delta 24.49 vs next-largest 0.06) | measurement, 1 frame |
| 4 | picture cut #2 | 27.680 | **27.640** (delta 6.74) | measurement, 1 frame |
| 5 | picture cut #3 | 36.480 | **36.400** (delta 112.43) | measurement, 2 frames |
| 6 | hard-out sticker covers the base "WHAT IF" wordmark | "positioned ... so it lands over" it | **0 % coverage** (alpha mean 0.2/255, max 10 over x 864-1080 rows 56-124) | measurement; the mitigation does not exist |
| 7 | impact tail in the hard-out | -42.9 dB / silent from 36.520 | -43.6 dB / bit-identical from **36.517** | agree (0.7 dB, 3 ms) |
| 8 | protected pause 19.630-19.935 | one 0.305 s silence | two gaps + a 10 ms -50.9 dB tic | refinement |

**Where the plan won and measurement confirmed it:** "every `dur` equals the file's own length so nothing
is truncated" (0.0 ms on all 6 cues, and the Python-rounding trap that appears to contradict it is a
measurement bug, not a build bug); the badge box at ~440x248 px; all five protected pauses at exactly
zero added energy; the `/k/`-burst call that the word is **"an"**, not "got"; the hard-out rendering at
FULL opacity on the last frame; and the whole reference-image gate (only `DogInMe.png` is ever opened,
`what-if.jpg` never is).

**None of items 3/4/5 changes a decision:** badge4 still clears cut 3 by 100 ms, both whoosh crests still
land inside their silences (43 ms late instead of on the cut, imperceptible), and cut 3 still ships dry.
No re-render was spent on a 40 ms documentation error.
