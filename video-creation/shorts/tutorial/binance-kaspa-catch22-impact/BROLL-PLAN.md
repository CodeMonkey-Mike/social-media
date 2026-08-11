# BROLL-PLAN: tutorial / clip 7 `binance-kaspa-catch22-impact` (variant: IMPACT, 19.018 s)

Title: **"They Don't Apply the Same Logic to Kaspa"** (Mike's frozen 4b title). Hook: tribal-contrast.
Spine (build from THIS, do NOT re-encode and do NOT re-cut):
`video-creation/shorts/tutorial/render-assets/binance-kaspa-catch22-impact.mp4`
(1080x1920, 25 fps, 19.018 s audio / picture to 19.000 s, GOP re-encoded seek-friendly). Comp runs at
30 fps, 570 frames = 19.000 s; every cue below is plain clip-relative seconds, RMS-anchored, off the
clip's own `whisper-words-verified.json` (see `_patch_words.py`).

Two segments, all argument, no padding:
1. **THE PREMISE** (master 2026.59-2033.74, clip 0.145-5.155): "there was a blog article on the Binance
   website talking about how they're looking for community driven coins"
2. **THE CONTRADICTION + PUNCHLINE** (master 2059.02-2074.70, clip 5.270-18.990): "Binance gives the
   argument about Neiro that it's a community driven coin, but it's a meme coin. They don't apply the
   same logic to Kaspa, because if they did, Kaspa would be listed on Binance by now. So it's kind of a
   strange catch-22."

**Sibling:** clip 3 `binance-kaspa-catch22` is the FULL cut and this clip is a strict SUBSET of its
audio (offset: `clip3_t = this_t + 7.560 s`). Clip 3 finished first. **No asset is shared** - everything
here is `broll-tut-bki-*` / `thumb-tutbki`.

## ⛔ MIKE'S PHASE 7 VISUAL DIRECTIVE FOR THIS WHOLE BATCH (2026-08-09, verbatim)

> "i only do not want full screen broll, nor content zone broll. you can do captions, sfx, and any
> overlaying graphics or images with background transparency."

ALLOWED: captions, SFX, code-drawn graphics, image overlays **with real background transparency**.
BANNED: full-screen b-roll and content-zone b-roll, i.e. **any asset that covers the frame or fills the
content zone**. The test is COVERAGE, not the asset's source.

**Consequence, stated plainly and reported as a DEVIATION rather than "fixed":** there are **ZERO**
`BrollEv` beats. B-roll **coverage is 0 %**, base-showing **100 %**. That is deliberately outside the
finalized-short checklist item 4 (~25-35 % zone/full coverage, plus a full-screen at the hook, 1-3x),
on Mike's own batch-level instruction. Do not restore coverage from this file. Every graphic below is a
**true-alpha PNG** (52.8 % of the PNG fully transparent) or **code-drawn**; the largest paints ~6 % of
the frame. Graphic-on-screen TIME is **8.78 s of 19.000 s = 46.2 %** (the batch's finished clips run
23.8 %-42.0 %; a 19 s clip cannot spread 5 beats thinner without dropping each below the ~1 s
readability floor, so this sits slightly above the band by construction, and it is reported, not hidden).

## Base layout (MEASURED on this clip, not assumed)

Row-mean gradient scan at t = 0.5 / 2 / 5 / 8 / 11 / 14 / 16.5 / 18.9 s: the screen-share/webcam seam is
on row **853** in all eight frames (delta 175-195). Caption band centre **905** (52 px under the seam,
on his hair; his eyes sit at rows ~1010-1140 on the sampled frames, never covered).

Content-zone contents (this is what the overlays must NOT cover):
- **0.00-19.00 s**: ONE continuous DEXScreener **IF/WETH** chart + transaction table, with a burned-in
  green "WHAT IF" banner top-right (approx rows 30-130, x 870-1080). An 8 fps mean|delta| scan of the
  content-zone crop finds **NO picture cut anywhere** - the largest delta in the clip is **0.864**,
  against 111.9 for a real cut on the sibling clip. So the screen-share is **OFF-MESSAGE** for the
  Binance/Kaspa argument for the whole runtime. Per the SKILL that is still not a licence to blanket it,
  and b-roll is banned here anyway, so the argument is carried by captions + transparent/code graphics.
- The **one structural cut** is the seg0 -> seg1 join at **t 5.28**: whole-frame mean luma steps
  103.09 -> 108.97, entirely in the **webcam** half (content zone unchanged). Frames at 5.24 and 5.32
  were eyeballed: it reads as a soft jump, not a hard cut.

## Beat table

| # | t (s) | spoken line | element | kind | zone / placement | asset / reference |
|---|---|---|---|---|---|---|
| T | 0.000-0.033 | (frame 0 only) | designed hook cover: generated art + CODE-drawn title "THEY DON'T APPLY / THE SAME LOGIC / TO KASPA" + chip "STILL NOT LISTED" | thumbnail | full frame, ONE frame; base video from frame 1 | `thumb-tutbki.png` (generated; blank coins only, no logo, no face, no baked text) |
| 1 | 1.75-3.45 | "blog article on the binance website talking about how they're looking for community driven coins." | badge: BINANCE / SAYS / COMMUNITY DRIVEN | code-drawn | content zone, centred, top 430 (rows ~306-554) | none - **no Binance reference exists on disk, so NO logo is invented**, text only |
| 2 | 7.45-9.25 | "binance gives the argument about neiro that it's a community driven coin, but it's a meme coin." | badge: NEIRO / LISTED / A MEME COIN | code-drawn | content zone, centred, top 430 | none - no Neiro reference on disk, text only. **EDITORIAL: Neiro is the example that PROVES the point, never a target** - wording is purely factual |
| 3 | 12.20-13.86 | "they don't apply the same logic to kaspa because if they did" | the REAL Kaspa mark, glowing | **true-alpha PNG overlay** | content zone, LEFT, top 130 / left 70 / w 440 (rows 130-566) | `broll-tut-bki-ov-kaspa.png` <- **`schedule-tweets/images/reference/kaspa-logo.png`** |
| 4 | 14.80-16.45 | "kaspa would be listed on binance by now." | badge: STILL NOT / LISTED / ON BINANCE | code-drawn | content zone, centred, top 640 (rows ~516-764) - a DIFFERENT band from beat 3 | none |
| 5 | 17.05-19.30 | "so it's kind of a strange catch-22." | the catch-22 loop: a teal circular arrow chasing its own tail with a SHUT red padlock inside | **code-drawn SVG** | content zone, right, top 170 / left 590 / 400 px (rows 170-570) | none. `tOut` is PAST the comp end so the HARD-OUT keeps full opacity (no fade) |

**Base-showing beats (mode `base`, no graphic at all):** 0.033-1.75, 3.45-7.45, 9.25-12.20,
13.86-14.80 (which contains the protected pause), 16.45-17.05. That is **10.22 s of 19.000 s = 53.8 %**
with nothing but base video + captions.

**Collision matrix (time AND space, Phase 7 rule #3).** Windows in order:
0.000-0.033 (thumb) / 1.75-3.45 / 7.45-9.25 / 12.20-13.86 / 14.80-16.45 / 17.05-19.30.
**No two windows overlap**; minimum separation **0.60 s** (beat 4 -> beat 5), and that pair also sits in
different vertical bands (rows ~516-764 vs 170-570). Nothing starts before the thumb frame ends;
`LivestreamShort` suppresses badges/overlays while the thumb is up, and the SVG loop is gated on
`t >= 17.05` so it can never paint over the cover either. No watermark or logo plate is used, so the
thumb frame carries no other graphic at all.

## Reference-image gate (run LIVE 2026-08-10 against `schedule-tweets/images/reference/`)

Named projects in this clip: **Kaspa**, **Binance**, **Neiro**.
- **Kaspa -> `kaspa-logo.png` EXISTS.** Beat 3 therefore carries the REAL mark: the reference already
  ships as a glowing teal coin on pure black, so it is converted to TRUE alpha by the documented
  alpha-from-luminance method (`_make_alpha_overlays.py`, CUT 10 / BOOST 3.0, the values the sibling
  measured) and composited. No generation, no invented mark, pixel-exact branding. **VERIFIED VISUALLY:
  the mark carries Kaspa's BACKWARDS K** (vertical stroke on the right, arms pointing left) and the
  alpha pipeline only recomputes alpha + crops to the bbox, so it can never mirror.
- **Binance -> no reference on disk.** No logo is invented anywhere (beats 1 and 4 are text-only badges).
- **Neiro -> no reference on disk.** Same: text only, beat 2.
- Persona framing: Kaspa's decentralisation argument is **architectural** (node-operability,
  permissionless), never holder counts - and the clip makes no such claim, so none is put on screen.

## Generation (and the two off-brief images, reported not hidden)

`repurpose/generate-broll-reload.js` (ChatGPT pool purpose `broll`), inside the `chatgpt` stage lock,
straight into the batch's shared `render-assets/`.
- **`thumb-tutbki.png` - generated, ON brief, SHIPPED.** Persona-inspected before use: brass balance
  scale, two completely blank coins, no real crypto logo, no text baked in, no faces.
- **The punchline overlay was NOT generated in the end.** Two attempts came back off-brief: attempt 1
  returned a second copy of the cover's balance scale, attempt 2 (with an explicit "COMPLETELY NEW
  image, do not edit the previous one" preamble) returned a row of blank coins on green podiums. The
  shared `broll` chat is at 12/25 with 11 sibling images in it, which is the likely cause.
  **Checked, not assumed: this was NOT a wrong-image grab** - the md5 of each capture matches no
  sibling asset on disk. Rather than burn a third generation (or retire a shared pool chat mid-wave for
  one image), **the beat was CODE-DRAWN in SVG**, which Mike's directive explicitly allows. Both
  off-brief files were deleted, so there are no orphans.

## SFX AS BUILT (>= 2 required; 3 events, 3 distinct files, all already staged in `render-assets/sfx/`)

⛔ **THE PROTECTED PERFORMANCE PAUSE** (Mike desilenced at min-sil 0.95 to keep it; it is the
performance, not dead air). MEASURED on this spine at 5 ms hop / 10 ms window, -50 dB:
**13.870-14.525 s (0.655 s)**, the suspense pause in "because if they did, [beat] Kaspa would be
listed" - the rhetorical hinge of the clip. The /k/ of "kaspa" re-onsets at **14.525** (an isolated
decode of ONLY that 0.42 s voiced run returns "Casper"), which is where the caption now fires.
**No SFX and no graphic papers over it:** the Kaspa overlay's fade-out completes at 13.86 and the next
graphic starts at 14.80, and the SFX table measures **-240.00 dB added energy, peak absolute sample 0**,
across both the whole pause AND its interior 13.950-14.450, **PRE-CODEC** (the render's AAC encode lifts
digital-zero silence by +12 to +43 dB on its own, so a post-codec measurement there proves nothing).

| t (cue) | crest | cue | file |
|---|---|---|---|
| 0.00 | 0.15 | frame-0 cover cut into the video, inside the measured 0.000-0.145 silence | `transition_rapid_whoosh.mp3` |
| 15.34 | cut at 16.84 | riser STARTS 0.815 s AFTER the protected pause ends and swells under "listed on binance by now", cut on the impact crest. **RETIMED from 14.59 / dur 2.25 after the first full render** (see below) | `risers/Tension_Rise_Logo_Reveal_3.wav` |
| 16.57 | 16.84 | PAYOFF IMPACT at full 0.26 gain, crest dead centre of the measured 0.345 s silence 16.570-16.915 that ENDS the payoff sentence; natural decay ends 17.250 = start of the next measured silence, so no truncation click | `Impacts/Soundjay_Impact_Main_01-short.wav` |

**⛔ THE RISER WAS RETIMED AFTER THE FIRST FULL RENDER (14.59 / dur 2.25 -> 15.34 / dur 1.50), at
UNCHANGED 0.09 gain.** Caught by whisper-verifying the RENDER, which is exactly why that step exists:
on a WHOLE-FILE medium.en decode (no window boundary anywhere near the phrase) the encode-matched
control read *"...Casper would be listed on Binance BY NOW."* and the render read *"...listed on
Binance."* - the two closing words of the payoff sentence were gone, and 2 of the 13 staggered windows
agreed. **Isolated, not guessed**, with two offline whole-file mixes: riser ONLY (no impact) lost "by
now", impact ONLY (no riser) kept it, so the riser was the masker and the impact at full gain was
innocent. **Timing was then swept, gain never touched:** a pre-faded 1.00 s riser cresting on the impact
at 16.17 still lost "by now"; starting the long riser 0.75 s later and cutting it at the same 16.84
crest **restored** it. It works because the cue now plays only the first 1.50 s of the ramp under the
words instead of seconds 1.70-2.25, its steepest and loudest stretch, and its truncation at 16.84 is
still covered by the impact, which has been ringing since 16.57. As shipped, **12 of the 13 staggered
windows read exactly as the control** and the 13th carries "catch-22." correctly.

**Dropped from the plan, on evidence:**
- **the 5.11 join whoosh.** The one structural join is the most motivated transition slot in the clip,
  so it was scored properly and it lost: against an encode-matched control it flipped "Binance" ->
  "Finance" on window 4.80+2.6 and added a doubled "the" on 5.20+1.6. **TIMING was tried first, twice,
  at unchanged gain** (crest pulled back to 5.17 with the tail trimmed to 0.72 s; crest kept at 5.26
  with the tail trimmed to its own -24 dB point at 0.66 s) and neither rescued it. Gain was not tried
  (volume is the wrong knob). A decoration cue that timing cannot save gets DELETED - which is also
  what the sibling decided about this same join. Honest caveat, recorded because it cuts the other way:
  pre-codec the whoosh sat **20.69 dB under** the words after the join and **-41.29 dB** absolute in
  that span, below the -40 dB the contract calls the floor for a real masker, so those flips may well be
  decoder variance. It was still dropped: the cue was optional and this clip's payoff depends on an
  exchange's name decoding correctly. Without it, all four join windows read exactly as the control.
- **any DING.** Only four usable silences exist and three are used or untouchable, so a ding on an
  overlay reveal would have to crest ON a word (a candidate at 11.87 crests at 12.04, inside "the same
  logic"). Decoration, so deleted rather than shoehorned.

**Nothing is placed on "catch-22" itself** (17.975-18.990) - the punchline stays dry, and the impact
contributes exactly -240 dB across those words. Every cue was A/B'd **OFFLINE** (zero renders) against
an encode-matched control (bare spine through the same 48 kHz / AAC chain) on **13 short STAGGERED
windows**; the losing candidates and the evidence are recorded in
`remotion/src/constants-tut-bkc-impact.ts`.

## Reconciliation (re-checked before the render)

Every beat above has an asset or is code-drawn; every asset is referenced in
`constants-tut-bkc-impact.ts`; every comp ref exists in `render-assets/`. Zero orphans, both
directions - the gate enforces it. The gate's "unreferenced assets" line will list the OTHER seven
clips' assets because the public dir is shared: that is a benign WARN, not a failure.
