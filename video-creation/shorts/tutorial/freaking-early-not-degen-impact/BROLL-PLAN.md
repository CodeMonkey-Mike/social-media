# BROLL-PLAN: tutorial / clip 8 `freaking-early-not-degen-impact` (variant: IMPACT, 20.12 s)

Mike's verbatim 4b retitle: **"My portfolio is filled with 100x coins."** ⛔ **That claim is FLAGGED and
is NOT in this audio.** It is carried in the queue metadata only and is imported into **NOTHING** on
screen: not the cover, not a badge, not a caption. Every word of on-screen copy comes from what the
audio actually says.

Spine (build from THIS, never re-encode it):
`video-creation/shorts/tutorial/render-assets/freaking-early-not-degen-impact.mp4`
(1080x1920, 25 fps, video 20.120 s / 502 coded frames / last PTS 20.080, audio 20.121995 s, GOP
re-encoded seek-friendly). The comp runs at 30 fps and `OffthreadVideo` resamples by TIME, so every cue
below is plain clip-relative seconds measured on this spine's own audio.

Comp: `TutFreakingEarlyNotDegenImpact` · constants `constants-tut-fed-impact.ts` · captions
`captionsTutFei.ts` (`CAPTIONS_TUT_FEI`) · **603 frames @ 30 fps = 20.100 s**.

Namespace: this clip owns **`broll-tut-fei-*`** and **`thumb-tutfei.png`** and nothing else. The
`render-assets/` public dir is SHARED with 7 sibling clips; never touch `broll-tut94x-*` /
`thumb-tut94x-*` (clip 1), `broll-tut-rhm-*` / `thumb-tutrhm.png` (clip 2), `broll-tut-bkc-ov-*` /
`thumb-tutbkc.png` (clip 3), **`broll-tut-fed-*` / `thumb-tutfed.png` (clip 4, this clip's twin)**,
`broll-tut-dgn-*` / `thumb-tutdgn.png` (clip 5), `broll-tut6-*` / `thumb-tut6.png` /
`tail-tut6-hold.png` (clip 6), `broll-tut-bki-*` (clip 7).

## ⛔ THE IN-POINT IS DELIBERATELY 2201.27, NOT THE 2208.66 PEAK

The whole clip is master **2201.27-2223.03**. The tighten plan is explicit that cutting at the 2208.66
peak would strip **"I'm going to be like"** and *turn a future hypothetical into a claimed position*.
So the head is never trimmed, the clip never starts later, and no element visually skips past that
frame (the frame-0 cover is ONE frame; the base video runs from frame 1). The hard-out is built in:
**no CTA, no closing card** - the abrupt ending is deliberate watch-time strategy.

## ⛔ MIKE'S PHASE 7 VISUAL DIRECTIVE FOR THIS WHOLE BATCH (2026-08-09, verbatim)

> "i only do not want full screen broll, nor content zone broll. you can do captions, sfx, and any
> overlaying graphics or images with background transparency."

ALLOWED: captions, SFX, code-drawn graphics, image overlays **with real background transparency**.
BANNED: full-screen b-roll and content-zone b-roll, i.e. **any asset that covers the frame or fills
the content zone**. The test is COVERAGE, not the asset's source.

**Consequence, stated plainly and reported as a DEVIATION rather than silently "fixed":** there are
**ZERO** `BrollEv` beats on this clip. B-roll **coverage is 0 %** and base-showing is **100 %**, which
is deliberately outside the finalized-short checklist's item #4 (~25-35 % zone/full coverage) and
outside its "full-screen at the hook, 1-3x" clause. That deviation rides on Mike's own batch-level
instruction; it is NOT a coverage failure being papered over, and it must NOT be "restored" from this
file. All five sibling clips that finished before this one reported the same deviation.

What IS on screen: two **true-alpha PNG overlays** (41.2 % / 59.6 % of each PNG fully transparent) and
three **code-drawn badges**. Graphic ON-SCREEN time is **8.25 s / 20.100 s = 41.0 %**; painted-pixel
occlusion is roughly **3-5 %** of the frame. Nothing fills the content zone.

## ⛔⛔ THE THREE-WAY COLLISION AT THE CENTRE OF THIS CLIP

**1. The numbers are a FUTURE HYPOTHETICAL.** "700 million and I got in at like 1.8 million" is
something Mike imagines saying later, framed by "I'm gonna be like, holy crap...". It is NOT a position
he holds and NOT a realised trade. The tighten plan states it as a formal caption guard: *"never
caption or title it as a realised trade."*

**2. Mike's own retitle claims something the audio does not.** See the header. Not imported anywhere.

**3. THE BASE PICTURE UNDERCUTS THE HYPOTHETICAL** - verified on this spine at t 14 s, not taken on
trust. The screen-share for the whole clip is a **DEXScreener page for a real, NAMED token**:
"YOLO/WETH (Market Cap) on Uniswap - 4h - dexscreener", top right "YOLO / WETH · Robinhood ·
Uniswap v3", reading **MKT CAP $3.1M · FDV $3.0M · LIQUIDITY $227K · price $0.003171 · TXNS 1,891**,
with a live YOLO buy/sell transaction table. There is also a third-party ad banner reading **"IT'S TIME
TO GO ALL-IN"** in the top right **for the entire clip**.
The on-screen **$3.1M** and the spoken **"1.8 million"** are close enough that the picture makes the
FALSE reading ("Mike holds YOLO, entered at 1.8M, expects 700M") *more* plausible, not less - and
Mike's retitle would make that misreading the obvious one.

**The picture cannot be fixed** (covering the content zone is banned, and clip 4 correctly left it
untouched). **So the conditional frame is made unmissable in the CAPTION domain, which the directive
explicitly permits.** FOUR independent layers do it:

| layer | where | what |
|---|---|---|
| (i) **quoted speech in the captions** | 5.98-15.634 s | the imagined sentence is rendered as a QUOTATION: opening mark on "holy", closing mark on "1.8 million.", and a RE-OPENING mark after each pause > 0.45 s inside it. So the caption on screen while the market cap is spoken reads **`"is like 700 million`** - the figure is visibly inside a quotation, and no viewer joining mid-clip ever sees a bare figure. |
| (ii) **his verbatim lead-in survives** | 5.36-5.98 s | `i'm gonna be` / `like "holy crap.` - unsplit, in future tense, with the quote opening straight after it. |
| (iii) **the frame-0 cover states the frame first** | frame 0 | title `I'M GONNA / BE LIKE, "I WAS / SO FREAKING / EARLY"` - his words, future tense, quote marks, **no number**. |
| (iv) **a badge on the lead-in itself** | 5.25-6.45 s | `WHAT I'LL / SAY / WHEN IT HAPPENS` - future tense, no number, no position. |

**And the figures get NOTHING:** no badge, no arrow, no multiplier, no "700M vs 1.8M" juxtaposition,
**no colour highlight** (the colorize set is `r=die gr=early`, deliberately pointed at the WIN and at
the thing he rejects, exactly as clip 4 did), and the **6.55 s window 9.20-15.75 that contains them is
the clip's one deliberately graphic-free stretch**.

**4. The token is deliberately UNNAMED** ("this particular token"). No ticker, no logo, no project
identity anywhere. **5. The contrast is anti-degen, not anti-trading** (Mike swing-trades): no element
frames trading itself as wrong; the closing badge names the two-week-flip PATTERN. **6. His own entries
are never framed as a timing mistake**: "so freaking early" is a WIN, so it gets the sprout overlay and
the summary badge reads `WHAT I'M / AFTER`, forward-looking.

## Base layout (MEASURED on this clip, not assumed)

Row-mean gradient scan at t = 0.2 / 1 / 2.5 / 4.5 / 6 / 8 / 10 / 12 / 14 / 16 / 18 / 19.5 / 20.05 s:
the hard screen-share/webcam seam is on row **853 in ALL THIRTEEN frames** (row-to-row delta 172-206).

- `TUT_FEI_SEAM = 853` - content zone 0..853, webcam below.
- `TUT_FEI_CAP_Y = 905` - caption centre, 52 px under the seam. At font 74 / stroke 13 the glyph box
  spans roughly rows 855-955, i.e. on his hair and the very top of his head. **His eyes sit at rows
  ~1180-1230 on every sampled frame, so captions never cover them.**

**Content-zone contents (what the overlays must not bury):** rows ~40-420 the candle chart + toolbar;
rows ~430-853 the live Transactions table; x 865-1080 the right stats rail with a near-white ad panel.
Hence the layout convention, inherited from clip 4 because it was measured on this exact page:
- **code-drawn badges (opaque dark plate) sit over the Transactions table** (rows ~484-826), the
  lowest-value part of the screen-share, so the chart is never buried by a solid box;
- **true-alpha overlays sit over the chart** (rows ~140-602), where the chart shows through the glow.

**No black-picture defect on this clip** (the batch-wide defect that hit clips 1 and 6): `blackdetect
d=0.02:pix_th=0.10` returns nothing, and a per-frame mean-luma scan of **all 502 frames** has a
**MINIMUM of 104.61/255** (at t 1.000), a maximum of 118.38 (t 5.280), a **final frame of 116.9**, and
**zero frames under 40**. The picture does not die before the audio; nothing is held or repaired.

## Timeline anchors (5 ms-hop / 10 ms-window RMS, dual threshold -57/-52 dB, on THIS spine)

EIGHT voiced spans. The FOUR real internal silences are all true DIGITAL ZERO (-240 dBFS, gated mic):

| # | silence | s | what it is |
|---|---|---|---|
| 1 | 3.831-4.295 | 0.464 | the clip's biggest structural pause: after "...that I've just listed", before "and they're gonna be buying in" |
| 2 | 6.560-7.303 | **0.743** | ★ **PROTECTED DELIVERY BEAT** "holy crap. [beat] I was so freaking early" |
| 3 | 9.439-9.823 | 0.384 | delivery beat, "like this [beat] particular token" |
| 4 | 10.920-11.838 | **0.918** | ★ **PROTECTED DELIVERY BEAT** "this particular token [beat] is like 700 million" |

The three remaining "gaps" are NOT boundaries: a 2 ms-hop / 6 ms-window rescan resolves them as
**15.617-15.641** (floor -72.2 dB, the 5B splice after "1.8 million."), **16.707-16.742** (-65 dB,
inside " for") and **18.551-18.617** (-61.9 dB, the /p/ closure of "pump"). Head silence 0.000-0.125,
tail silence 19.950-20.124.

⛔ **THE PROTECTED PEAK = 5.394-15.634 s** ("I'm gonna be like, holy crap, I was so freaking early,
like this particular token is like 700 million and I got in at like 1.8 million") - **51 % of this
whole cut.** Nothing may mask it, and nothing does: the SFX table adds **-240.0 dB (bit-identical)**
across the entire peak and across all three delivery-beat interiors, verified by PRE-CODEC differencing
(see the SFX section). The batch was desilenced at min-sil 0.95 expressly so these beats survive.
**Do not re-cut the spine.**

## Beat table (AS BUILT)

| # | t (s) | spoken line | element | kind | zone / placement | asset |
|---|---|---|---|---|---|---|
| T | 0.000-0.033 | (frame 0 only) | designed hook cover: generated art + CODE-drawn title `I'M GONNA / BE LIKE, "I WAS / SO FREAKING / EARLY"` + green chip `THAT'S WHAT I'M LOOKING FOR` | thumbnail | full frame, ONE frame; base video from frame 1 | `thumb-tutfei.png` |
| 1 | 1.05-3.30 | "you know, retail is gonna be looking at all these tokens that I've just listed" | a faceless silhouette crowd BELOW, heads tilted up, looking at a floating grid of BLANK glowing panels above | alpha PNG overlay | content zone, over the CHART, top 140 / left 190 / w 470 (rows 140-602) | `broll-tut-fei-ov-lookup.png` |
| 2 | **5.25-6.45** | "I'm gonna be like, holy crap" | ★ **THE QUOTE-FRAME BADGE**, teal: `WHAT I'LL` / `SAY` / `WHEN IT HAPPENS`. Future tense, no number, no position. Ends at 6.45 so the 0.743 s protected beat stays clean | code-drawn | content zone, over the TXN TABLE, centred, top 640 | none (no project is named) |
| 3 | 7.50-9.20 | "I was so freaking early" | ONE seedling breaking through cracked ground, teal light in the cracks: EARLY as a pure TIME metaphor with NO number and NO claim in it | alpha PNG overlay | content zone, over the CHART, top 150 / left 320 / w 440 (rows 150-519) | `broll-tut-fei-ov-sprout.png` |
| 4 | **9.20-15.75** | "like this particular token is like 700 million and I got in at like 1.8 million." | ⛔ **NOTHING. DELIBERATELY GRAPHIC-FREE for 6.55 s** - a third of the clip. Content guard #3 | none | none | none |
| 5 | 15.75-17.30 | "That's what I'm looking for." | badge GREEN: `WHAT I'M` / `AFTER` / `NOT A FAST FLIP`. The GOAL is labelled HERE, never on the numbers beat. Its reveal is punctuated by the payoff impact (crest 15.757) | code-drawn | content zone, over the TXN TABLE, centred, top 700 | none |
| 6 | 18.55-**20.50** | "I'm not looking for the ones that are gonna pump, you know, in two weeks and then die." | badge RED: `PUMP FOR` / `2 WEEKS` / `THEN IT DIES`. Names the PATTERN, never trading. `tOut` is PAST the comp end (20.100) so the 0.18 s fade never starts: the clip HARD-OUTS at full opacity, no fade, no CTA | code-drawn | content zone, over the TXN TABLE, centred, top 610 | none |

**Deliberately empty beats (the base carries them, no graphic at all):** 0.033-1.05, 3.30-5.25 (which
covers the 0.464 s pause), 6.45-7.50 (**the 0.743 s protected beat**), **9.20-15.75 (the 0.384 s beat,
the 0.918 s protected beat AND the entire hypothetical)**, 17.30-18.55.

### Collision matrix (Phase 7 rule #3: time AND space)

Windows in order: `0.000-0.033` (thumb) / `1.05-3.30` / `5.25-6.45` / `7.50-9.20` / `15.75-17.30` /
`18.55-20.50`. **No two windows overlap.** Smallest separation **1.017 s** (thumb -> beat 1); the rest
are 1.95 s, 1.05 s, 6.55 s, 1.25 s. Nothing starts before the thumb frame ends, and `LivestreamShort`
suppresses overlays AND badges while the thumb is up anyway. Vertically the two families do share a
band on paper (overlays rows 140-602 over the chart, badge plates rows 484-826 over the transaction
table) but they **never share a FRAME**, so no collision exists in time or in space. No watermark plate
and no logo-reveal plate is used (a corner plate would sit on the DEXScreener toolbar), so the frame-0
cover carries no other graphic at all. **All three delivery beats fall in graphic-free gaps.**

## Reference-image gate (run LIVE against `schedule-tweets/images/reference/`)

**Named projects/coins/people in this clip: NONE.** The transcript names no token, no ticker, no
exchange, no person: the subject is "this particular token", deliberately unnamed, and the other
reference is "all these tokens". The gate was still run live and the directory holds **24** real marks
(`DogInMe.png`, `ElizaOS-ai16z.webp`, `LAB.png`, `TUT-tutorial.jpg`, `bittensor-tao.png`, `bobo.png`,
`cooper.jpg`, `ethereum-eth.png`, `housecoin.webp`, `kappy.png`, `kaspa-logo.png`, `kasy.png`,
`kroak.png`, `linea.png`, `michael-saylor.png`, `nacho.jpg`, `slippy.png`, `tendies.jpg`, `toshi.png`,
`troll.png`, `velvet.png`, `what-if.jpg`, + `carousels/`) - **none of them belongs on this clip and
none is used.** Attaching any would invent an identity the audio does not claim and would break content
guard #4. **Note this matters MORE here than on any other clip in the batch**, because the base picture
already shows a real named token: adding an authored mark would look like confirmation.

Consequences enforced in the generation prompts: every overlay subject is an OBJECT or a FACELESS
silhouette mass; the floating panels are deliberately **BLANK** (never coins, never tickers) so no
project identity can be implied; no coin, no crypto mark, no wordmark, no digits, no lettering, no
human face anywhere. (The base video's own screen-share does show a real third-party token page, but
that is Mike's real footage, untouched, not an authored element.)

## Generation

`repurpose/generate-broll-reload.js` (ChatGPT pool purpose `broll`), inside the `chatgpt` stage lock,
one item per invocation, straight into `video-creation/shorts/tutorial/render-assets/`
(`_write_genlists.py` writes the three prompts). The two overlay subjects are prompted **"on a PURE
SOLID BLACK (#000000) background and nothing else, no checkerboard"** and then converted to real RGBA
with alpha = boosted luminance (`_make_alpha_overlays.py`, BOOST 2.6 / CUT 10 - the SKILL's
"Transparent overlays" method; never prompt ChatGPT for transparency, it bakes a painted checkerboard).
`blend: 'normal'` on both, because the DEXScreener page is near-white in places and a screen blend
cannot darken white. The cover art is generated WITHOUT text; title and chip are drawn in CODE on top.

**NO-DUPLICATE RULE vs clip 4** (same moment, the two will be seen back to back in a feed): clip 4's
overlays are a red pump-and-collapse candle spike, a teal crowd WAVE surging forward, and a SUNRISE
cresting a ridge, and its cover is two divergent forked routes. **None of those concepts or
compositions is reused here.**

### ⚠ CAPTURE INCIDENT AND HOW IT WAS RESOLVED (recorded, not hidden)

All three prompts generated correctly, but the CAPTURES came back **shifted by one**: the first run
saved a **pre-existing golden firework** already in the chat, the second saved the *cover*, the third
saved the *lookup*. That is the generator's documented **"WRONG-IMAGE grab"**, and the documented cause
applies exactly: its seen-set of estuary `file_id`s starts EMPTY on every invocation, so run 1 against
an **already-populated chat (12/25 images)** can legitimately pick a pre-existing image as "the one
whose file_id I have not seen". **The SKILL's own advice - "BEST used against a FRESH chat (retire the
active broll chat first) so the seen-set starts clean" - was not followed; that is the miss.**

Resolution followed the SKILL rather than the shortcuts it forbids:
- **No prompt was re-sent** ("a re-send is a duplicate generation"). The two correctly-generated files
  were **RENAMED** to their true identities (the SKILL's "do NOT regenerate mid-build - REMAP" rule),
  which also overwrote the off-brief firework.
- The third was recovered **READ-ONLY** from the conversation by `_recover_sprout.py`
  (`/api/auth/session` for the bearer token -> `/backend-api/conversation/<id>` ->
  `/backend-api/files/<id>/download`; nothing typed, nothing sent). That recovery also **PROVED** the
  off-by-one: conversation asset pointers **14 and 15 are byte-identical to the two files already on
  disk**, and **16 - the newest, never captured - is the sprout**.
- `md5sum` across the whole batch public dir afterwards: **zero duplicates** (`uniq -d` empty).
- All three images were **persona-inspected after the remap** (see below).

**Persona inspection (all three viewed at full size before rendering):** no real crypto logo, no real
project mark, no real-person face, no baked text or digits in any of them. `thumb-tutfei.png`
(941x1672, 9:16) - one featureless back-view silhouette on a cliff, distant river of golden lights, no
marks. `broll-tut-fei-ov-lookup.png` - every figure a featureless back-view silhouette, every floating
panel completely blank. `broll-tut-fei-ov-sprout.png` - one seedling on cracked ground, nothing else.

## SFX AS BUILT (>= 2 distinct refs required; 3 events, 2 distinct files, all from `video-creation/assets/sfx/`)

Density **0.149 events/s** against clip 4's 0.139 on the same audio - proportionally the same clip, not
a thinner one. Envelopes measured on this machine at 0.1 s RMS / 0.01 s hop, 16 kHz mono (identical to
clip 4's numbers):

| file | dur | crest | crest level |
|---|---|---|---|
| `transition_rapid_whoosh.mp3` | 0.967 | 0.150 | -17.44 dB |
| `Impacts/Impact_Hit_01-2-short.wav` | 0.550 | 0.090 | -11.52 dB |

| t (cue) | crest | cue | file |
|---|---|---|---|
| 0.000 | 0.150 | frame-0 cover cut into the video. Head silence is only 0.000-0.125, so the crest lands 25 ms into "you", the lowest-value speech in the clip; measured 16 dB under it and whisper-clean | `transition_rapid_whoosh.mp3` |
| 3.908 | 4.058 | **THE MAJOR TRANSITION**: dead centre of the 0.464 s digital-zero silence 3.831-4.295 - the pivot from what he already owns INTO the imagined future. Frame-quantised to 117/30 = 3.900 (crest 4.050), still centred; ends 4.900, i.e. **0.494 s before the protected peak opens** | `transition_rapid_whoosh.mp3` |
| 15.667 | 15.757 | **THE PAYOFF HIT** on "that's what I'm looking for", punctuating the GOAL badge. Frame-quantised to 470/30 = 15.6667, i.e. **0.033 s AFTER the protected peak's measured voice end (15.634)** | `Impacts/Impact_Hit_01-2-short.wav` |

**Not placed, deliberately, each with the measurement:**
- **No riser anywhere.** The only payoff worth building into IS the protected peak, and on this cut the
  peak is 5.394-15.634, so any riser long enough to build would run INSIDE it and add energy there; a
  riser ending exactly at 5.394 would truncate mid-file and click on the peak's first word. Timing, not
  volume, is the knob, and here no timing exists - so the riser is dropped rather than the guard.
  (Clip 4 reached the same conclusion on this audio.)
- **The hard-out is DRY.** Nothing on "in two weeks and then die" (18.820-19.960). A 2 ms/6 ms rescan of
  18.30-20.13 finds **no word-boundary silence at all**; the only sub -45 dB dips are stop closures
  INSIDE words (18.551-18.617 = the /p/ of "pump" at -61.9 dB; 18.980-18.988; 19.260-19.336) - exactly
  the trap the tighten plan flagged. A transient in the 0.174 s tail would *button* the ending, and the
  hard-out is deliberately abrupt, so it stays dry.
- **No cue on the `lookup` overlay pop** (tIn 1.05): a fine rescan of 0.40-1.30 finds **no trough below
  -45 dB anywhere** (window minimum -40.91 dB at 0.945), so a ding would sit on speech rather than in a
  gap. Clip 4's equivalent DING had a measured -61 dB trough; this clip has none, so the cue is dropped
  instead of forced.
- **No cue on the `sprout` pop (7.50) or the quote-frame badge (5.25)**: both are inside the protected
  peak, and 4.90-5.60 has a window minimum of only -27.70 dB - no gap to hide a transient in even if
  the peak allowed one.
- **No cue on 16.707-16.742 or 18.551-18.617**: both are word-INTERNAL, proved by cross-checking clip
  4's independently measured stream on the identical audio (they map inside its " for" and " pump").

**No `dur` is used as a fade and NO cue is truncated.** Every `dur` is set PAST its file length
(1.00 s over a 0.967 s file; 0.60 s over a 0.550 s file), because `dur` TRUNCATES at full level (clips
1 and 6 measured the truncation click LOUDER than the following speech). The offline A/B caught why the
margin matters: the obvious `dur: 0.55` puts the window on `Math.round(16.5)`, exactly a rounding
boundary, so the shipped value deliberately avoids it.

**A/B method and result (OFFLINE, zero renders, encode-matched):** every cue was mixed onto the bare
spine offline with the exact shipped volumes and frame-quantised starts, then both the mix and a
CONTROL (the bare spine through the same 48 kHz/AAC chain the render writes) were scored with medium.en
on **18 short staggered windows**, one model load so the decoder is identical. **13/18 identical; not
one window loses a word.** The 5 differences are all the documented confound, and it is *proved* rather
than assumed:
- three of them (windows starting 13.95 / 14.20 / 14.45) begin **inside the protected peak, where the
  mix is bit-identical to the control**, so masking is physically impossible there; only the window
  TAIL differs (it reaches past 15.667 and includes cue 3), i.e. the cue changes the mel CONTEXT, not
  audibility. In all three the MIX returned the **same or MORE** words than the control, never fewer.
- the other two are punctuation only: `these...` vs `these`, and `the ones` vs `the ones...` (the MIX
  is the cleaner one).
- corroboration: windows 11.60, 13.10 and 14.70 over the same phrase are all identical to control.

**Masking headroom, measured:** cue 3 sits **9.0 dB** under "that's" and **11.5 dB** under "what I'm"
(and the phrase transcribes perfectly at three offsets, so the payoff hit keeps its full gain - volume
was never used as a fix). Cue 1 sits **16 dB** under "you". Cue 2 lands in a digital-zero pause and its
tail under "and they're" is **-47.2 dB against -19.2 dB speech**, i.e. 28 dB down and below the -40 dB
"real masker" threshold.

**Protected-beat proof (PRE-CODEC, which the AAC noise floor makes mandatory):** the summed mix minus
the bare spine measures **-240.0 dB (bit-identical)** across the whole protected peak 5.394-15.634 AND
across all three delivery beats, whole span and 60 ms-stripped INTERIOR alike. Post-codec numbers are
useless for this (the render's AAC lifts every digital-zero silence by +12 to +43 dB even with no cue
within seconds), and whole-span averages are polluted by the preceding word's decay tail - which is why
both the interior and the pre-codec paths are used.

## Captions

Built ONLY by the canonical skill, never hand-authored:

```
python video-creation/skills/captions/build_captions.py \
  --words video-creation/shorts/tutorial/freaking-early-not-degen-impact/whisper-words-verified.json \
  --style montserrat --var CAPTIONS_TUT_FEI \
  --colorize 'r=die gr=early' --max-secs 2.00 --quote 5.98:15.634 \
  --out video-creation/remotion/src/captionsTutFei.ts
```

23 captions, median on-screen 0.68 s, mean 0.87 s, min 0.34 s, max 2.68 s. The 2.68 s outlier is
`this particular token` at 9.16 s and it is CORRECT, not a pacing defect: its WORD span is only 1.760 s
and the extra 0.92 s is the protected delivery beat that follows it, so the caption HOLDS the frame
while he deliberately pauses rather than blanking or advancing early.

- ★ **`--quote 5.98:15.634` is the conditional-frame guard** and the single most important line in this
  build - see the collision section above for what it renders. It is a **new, default-OFF flag** added
  to the canonical tool for this clip; adding it left clip 4's shipped captions **BYTE-IDENTICAL**
  (verified by rebuilding and diffing). It had to be a per-invocation flag rather than a
  `PHRASE_CORRECTION`, because **clip 4 shares this audio**, so any token-keyed rule would silently
  rewrite the already-shipped twin's captions. The marks are presentational (injected at emit time,
  never into a token), so grouping, the 0.45 s gap break, the `[.?!]` sentence break, the word caps and
  `--max-secs` are provably untouched.
- **Reused from clip 4, not duplicated:** its `PHRASE_CORRECTIONS` merges `("700","million") ->
  "700 million"` and `("18","million") -> "1.8 million."` fire on this stream unchanged and keep each
  figure whole. No "$" is added and no multiplier is computed. Its `("the","dj","mindset")`,
  `("centralized","stations")` and `("like","that","listed")` rules and its `PROTECTED_DOUBLES` entry
  `("know","thats","thats","the")` simply do not match this shorter cut - no new rule was added for
  them and none was needed.
- **The colorize set is `r=die gr=early`** - clip 4's set minus the two tokens ("degen", "dies") that do
  not occur in this cut. So the only coloured words in the clip are the WIN (`early`, green) and the
  thing he rejects (`die`, red). **Nothing points at the numbers.**
- **`--max-secs 2.00` is a GUARD, verified byte-identical to leaving it OFF.** No stretched-word defect
  here (longest held single word 0.860 s, the merged "700 million"); 2.00 sits above the longest group
  word-span (1.760 s, "this particular token", which straddles the 0.384 s delivery beat), so the rail
  can never split a protected beat.
- **Word JSON audit: CLEAN, zero words restored.** The shipped pass returns **73 tokens against an
  independent medium.en pass's 72**, aligning 1:1, and the extra token is a real word medium.en missed
  ("the ones THAT are gonna pump") - so the shipped stream is the SUPERSET, nothing is dropped. What
  `_patch_words.py` does instead is **re-anchor 11 misaligned edges** to 5 ms RMS and **undo ONE phantom
  token split**. The three that change the screen:
  - `" and"` 3.820 -> **4.295**: shipped gap 0.000 s across a measured **0.464 s** pause, so raw it both
    welded two sentences and painted a caption over the pause (clip 4 called the same defect at the same
    pause "THE BIG ONE");
  - `" is"` 10.920 -> **11.838**: shipped placed it INSIDE the 0.918 s digital-zero beat where there is
    no audio, stranding a lone "is" on screen for 1.12 s; clip 4 measured the same token AFTER the beat;
  - the phantom split `" and"+" I"` -> `" at"`, turning the ungrammatical "and i got in and i" into
    **"and i got in at"** - the reading clip 4's independent pass on the identical audio gives and the
    one this clip's own tighten note demands. It could not be a `PHRASE_CORRECTION` (the only safe keys
    are 3-4 tokens long and `_apply_phrases_once` zips span-to-replacement, so a 4->3 rule would
    silently DROP the real following " like"), so it is a per-clip merge - the same method clip 2 used
    for its " far"+" far" -> " fart".

## Reconciliation (re-check before every render)

Every beat above has an asset; every asset is referenced in `remotion/src/constants-tut-fed-impact.ts`;
every comp ref exists in `render-assets/`. Zero orphans, both directions - the gate enforces it. The
gate's "unreferenced assets (orphans)" WARN will list the OTHER clips' `broll-*` / `thumb-*` files
because the public dir is shared across the batch; that is expected and benign, not a failure.
