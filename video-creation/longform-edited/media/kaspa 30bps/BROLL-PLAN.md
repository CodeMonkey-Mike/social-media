# kaspa 30bps — BROLL-PLAN (b-roll ACQUISITION worklist)

_Format: `skills/edit-plan-and-cue-sheet.md` §0 (acquisition worklist, atmospheric shots only — data
visuals/diagrams/charts/containers do NOT live here; those are in COVER-PLAN.json → EDIT-PLAN-prep).
Feeds the EDIT-PLAN-prep b-roll rows. Source plan: `COVER-PLAN.json` (gated 2026-07-24). Timecodes =
FINAL e-spine (`spine/ALL.e.desilenced.mp4`, 455.22s)._

**Budget: Envato 12/12 (default cap 10, +2 approved by Mike 2026-07-24) · ChatGPT images 3/5 (2 reserve).** File destinations: `assets/vid/`
(video) and `assets/img/` (stills), named by the ids below (merged assets layout, comp-build.md §10). Strip audio from every downloaded
clip (`ffmpeg -c copy -an`). Every asset below must end up PLACED in EDIT-PLAN or marked REJECTED/BENCH
(zero orphans).

## ⛔ HOLDS before licensing — ALL CLEARED (2026-07-25)
- ~~BR-9 (the "bags" beat cover)~~ **RULED KEEP (Mike 2026-07-24)** — licensed and placed.
- ~~IMG-2 (armored knight): confirm the Dark-Knight allusion~~ **RULED (Mike 2026-07-24: "a really cool
  knight, not a chess knight")** — generated, and `visual-qa` confirmed NO bat iconography (great-helm
  with asymmetric swept-back horns, plain plate chest, torn cape). It reads as an epic armored knight;
  the Gotham-ish composition IS the intended pun. Comp guidance from that pass: never push in on the
  helmet crest and never cross the head over the moon, or the crest can silhouette-read as ears — so
  the comp holds IMG-2's move to 1.02 → 1.05 (every other still gets 1.04 → 1.10).

## Envato video (10) — sourcing via `skills/envato-broll/SKILL.md`

| id | Beat (e-spine) | Search query | Dur target | Motion | Status |
|---|---|---|---|---|---|
| BR-1 | CH1 38.53–42.50 "don't just quadruple the speed" | light speed tunnel warp dark blue abstract | 3.97s | any | ☐ pending |
| BR-2 | CH1 42.50–46.06 "no dial to turn" | analog gauge dial needle close up dark industrial | 3.56s | any | ☐ pending |
| BR-3 | CH1 46.06–50.06 "very core of Kaspa has to change" | glowing energy core reactor futuristic teal | 4.00s | any | ☐ pending |
| BR-4 | CH3 171.92–176.90 storm speed-limit analogy | driving pov heavy rain storm highway windshield | 4.98s | LEADING (continuous dashcam) | ☐ pending |
| BR-5 | CH3 176.90–181.66 "sunny day, empty road" | driving pov empty highway sunny open road | 4.76s | LEADING | ☐ pending |
| BR-6 | CH3 181.66–184.97 "storm speed every single day" | traffic jam congestion highway crawling aerial | 3.31s | any | ☐ pending |
| BR-7 | CH5 413.46–417.08 "legacy tech" strawman | old rusty gears abandoned factory machinery dust | 3.62s | any | ☐ pending |
| BR-8 | CH5 419.94–423.94 "pre-mine VC chains" strawman | corporate boardroom meeting silhouettes skyscraper glass | 4.00s | any | ☐ pending |
| BR-9 | CH5 442.96–447.34 ("bags" beat — KEPT, Mike 2026-07-24) | aerial ascending through clouds sunrise flight | 4.38s | LEADING | ☐ pending (HOLD LIFTED — license it) |
| BR-10 | CH5 447.34–452.33 "speed of the actual internet" | earth from space night glowing network connections | 4.99s | LEADING | ☐ pending |
| BR-11 | CH2 97.88–101.5 "Two hard forks, in a single year" (punch-through of C1 rung-3 hold) | railway switch turnout close aerial | 3.62s | any | ✅ RE-SOURCED 2026-07-25 · carries LINE-CAPTION "TWO HARD FORKS IN A SINGLE YEAR" |
| BR-12 | CH4 373.26–376.50 "whole industry is hyping" (replaces IMG-3) | cheering crowd hands raised concert night | 3.24s | any | ✅ RE-SOURCED 2026-07-25 |

**BR-11 + BR-12 were re-sourced after `visual-qa` FAILED the originals on concept (2026-07-25).** Both
originals are kept at `_rejected-broll/` (moved OUT of `assets/` so they neither ride along in every
render bundle nor count as orphans):
- **BR-11** was a level CROSSING (rail crossing a road, an X). The beat needs one path becoming two, so
  the replacement is an actual railway SWITCH POINT where the blade peels off the rail into a clean Y
  ("Sunset View of Train Tracks Shifting at Junction",
  `https://app.envato.com/search/stock-video/27a25974-e03f-48f2-9b2f-553a3a268306`). Near-black ballast
  and cool desaturated steel, which is also on-palette where the old warm autumn farmland was not.
  Handles are ~0.85s per side (the master is only 5.32s), so the comp starts it 0.85s in.
- **BR-12** had NO crowd at all: an empty CGI arena of LED strips, i.e. the *subject* of "the whole
  industry is hyping" was missing, plus a saturated magenta palette break. Replacement is real crowd
  footage, silhouetted heads and raised hands, teal/cyan stage LEDs ("Crowd of Fans at Live Rock
  Concert", `https://app.envato.com/search/stock-video/49b7de66-ec5e-4815-bb7f-b193418aadd6`). Two other
  crowd finalists were rejected for burned-in `videohive` watermarks. Filename kept as BR-12-purple-stage.mp4.

**Comp-level fix from the same QA pass (no re-license):** BR-4 and BR-5 are the storm-vs-sunny smash-cut
pair, but as licensed their horizons sit at ~84% vs ~48% of frame height (elevated dashcam vs low
bumper-cam), so the cut jumped the camera height and undercut the gag. The comp scales BR-5 1.16 and
shifts it up 7% to bring both horizons into the same band.

### VERTICAL (9:16) re-source — 2026-07-25 (license trail; `assets/vertical/vid/`, same filenames)

Per `skills/vertical-repurpose.md` §1 every slot was re-sourced NATIVE VERTICAL (Envato Orientation
filter = Vertical), never a landscape centre-crop, except the ONE flagged fallback below. All 1080x1920,
audio stripped, trimmed to slot duration + ~1s handles. The 16:9 clips in `assets/vid/` are untouched.

| id | item (vertical) | Envato URL | native | label |
|---|---|---|---|---|
| BR-1 | Looped animation. Abstract stream of blue light tunnel. Vertical video | `https://app.envato.com/search/stock-video/d86b3c9d-0c31-4d44-a136-877982d433a8` | 2160x3840 | VERTICAL |
| BR-2 | Rotating Speedometer with Glowing Green Numbers (dubassy) | `https://app.envato.com/search/stock-video/34c5ed5d-66b4-4e06-89ec-9173df9afe96` | 2160x3840 | VERTICAL |
| BR-3 | Futuristic Glowing Energy Orb with Swirling Particles (Olechca77) | `https://app.envato.com/search/stock-video/346c8297-0820-4ca4-a746-a3781e4c021a` | 2160x3840 | VERTICAL |
| BR-4 | POV driving along a foggy forest road in the mountains (cookelma) | `https://app.envato.com/search/stock-video/ba3fe59d-39d4-4302-990f-022a9b7a2b16` | 2160x3840 | VERTICAL |
| BR-5 | Driving a Car on a Road Near the Sea in Iceland (sergeyxsp) | `https://app.envato.com/search/stock-video/1a2d579b-d12b-4ac4-8845-ae803960de5f` | 1080x1920 | VERTICAL |
| BR-6 | Traffic Jam on a Highway in Bangkok City (JKVision) | `https://app.envato.com/search/stock-video/6300f787-d814-48c5-ac01-56ed4c14deea` | 2160x3840 | VERTICAL |
| BR-7 | Vertical View Of Clockwork (DELOZA, 30s) | `https://app.envato.com/search/stock-video/1e141340-89a5-4cf5-82d0-8c5e5b42354e` | 2160x3840 | VERTICAL |
| BR-8 | Silhouetted Business People Talking by Office Window (YuriArcursPeopleimages) | `https://app.envato.com/search/stock-video/6bf3e937-48d1-400f-837f-1665b032eeaf` | 1080x2048 | VERTICAL |
| BR-9 | Breathtaking Vertical Aerial Shot of Clouds at Sunrise (BlackBoxGuild) | `https://app.envato.com/search/stock-video/95e98047-84cf-4e47-99d9-60c25f96ee6e` | 1080x1920 | VERTICAL |
| BR-10 | Rotating Earth View from Space Vertical Loop (icetray) | `https://app.envato.com/search/stock-video/8e056f76-5269-4ee3-82de-0c328c8c65a7` | 2304x4096 | VERTICAL |
| BR-11 | Railway Tracks with Multiple Converging Routes on Overcast Day (KinoMaster) | `https://app.envato.com/search/stock-video/cfa36855-ab19-4ba7-9592-a6254d465acd` | 3840x2160 | ⚠ CROPPED-FALLBACK |
| BR-12 | Crowd Silhouettes Enjoying Concert with Blue Stage Lights (ZSTUDY) | `https://app.envato.com/search/stock-video/3dd03634-7b0e-4a5a-bdc1-9fde9ef411b9` | 1080x1920 | VERTICAL |

- **BR-11 is the ONLY fallback.** Envato has NO vertical inventory for a railway SWITCH/turnout (7 portrait
  queries: switch point / turnout / points mechanism / tracks diverge / junction / fork / the 16:9 item's own
  title). Every portrait rail result was a straight track, a station, a tunnel or a level crossing, i.e. the
  exact concept failure `visual-qa` already rejected once. Concept is locked and outranks orientation, so this
  is a landscape 4K centre-crop; the crop is verified to hold the diverging blade dead-centre.
- **BR-4 + BR-5 need NO comp correction in the vertical cut** (unlike the 16:9): both are low forward-facing
  driving POV with no hood in frame and the road vanishing point measured at ~0.41 of frame height on both.

Benches (use only if the primary search fails): BR-1 particle data-stream fly-by · BR-2 control-room
panel switches · BR-3 CPU die macro light pulse · BR-4 storm clouds highway aerial · BR-5 desert highway
drone follow · BR-6 bumper-to-bumper brake lights · BR-7 museum steam engine · BR-8 dark-office
handshake · BR-10 global fiber-optic light streams.

## ChatGPT images (4 + 1 reserve) — house style: Pixar 3D CGI, deep navy near-black bg, rim light, no text

⛔ **REFERENCE column is mandatory for any beat naming a real token/project/company/person** (rule added
to `edit-plan-and-cue-sheet.md` §0, 2026-07-25). Shared library: `schedule-tweets/images/reference/`.
Value must be a path or the explicit `none exists (generic approved)`. The guard is **"use the REAL mark
from the reference image; never invent one"** — a bare "NO logo/text" bans the cure along with the symptom
and is what shipped a blank Velvet coin twice while `velvet.png` sat in the shared folder.

| id | Beat (e-spine) | Prompt concept | Reference | Status |
|---|---|---|---|---|
| IMG-1 | CH1 50.06-52.84 "coolest things ever" punch | Kaspa coin, EXPLICIT backwards-K logo, greenish-cyan teal energy burst (persona kaspa_coin rule: teal, never gold) | `reference/kaspa-logo.png` (not passed to the model; prompt-described, QA PASS) | DONE generated + builder-QA PASS (2026-07-24) |
| IMG-2 | CH2 112.37-116.30 Dark Knight pun | dark armored knight, night rooftop, teal rim light, NO bat iconography, epic and cool | none exists (generic approved) | DONE + visual-qa PASS (Mike ruled 2026-07-24: "a really cool knight, not a chess knight") |
| IMG-3 | RELEASED to reserve (Mike 2026-07-24): beat covered by BR-12 video | concept survives only as BR-12 bench | n/a (released) | RELEASED |
| IMG-4 | CH5 417.08-419.94 "as good as it gets with Bitcoin" | gold Bitcoin coin as museum relic on pedestal, dusty spotlight | none exists (generic approved) | DONE |
| IMG-5 | CH3 PLUG 268.8-271.5 "58X on the Velvet Token" (overlay ON the F5 face) | hero COIN with the REAL Velvet "V" mark struck into its face, purple velvet as the SETTING beneath/behind (never covering it), purple-to-teal rim light | `schedule-tweets/images/reference/velvet.png` **USED (v3)** | DONE (v3) 2026-07-25 — `--reference` passed via `gen-images.js` (purpose `broll`); V mark engraved on face, violet/purple on metal, no other text, coin fully exposed on velvet. `visual-qa` still to confirm. (v1 velvet-covered = no coin; v2 blank coin = no mark) |
| IMG-6 | CH3 PLUG 271.6-275.8 "350X on the Lab Token" (overlay on F5) | glowing coin rising from a laboratory flask, neon liquid, dark lab glassware | `schedule-tweets/images/reference/LAB.png` **EXISTS but was NOT used** | SHIPPED BLANK - same root cause as IMG-5. Not regenerated (Mike raised only the velvet one). Offer standing. |
| IMG-7 | CH3 PLUG 275.8-280.0 "it just keeps coming and coming" (overlay on F5) | cascade of glowing coins tumbling toward camera with green momentum streaks, dark bg | none exists (generic approved) | DONE |

ChatGPT cap raised 5→7 by these additions (Mike 2026-07-24): 6 placed + IMG-2 gated = cap accommodates all.

## F1 OPENER BACKGROUND SWAP (Mike, 2026-07-24 — CORRECTED scope + method)

- **⛔ NO matting, NO chroma key, EVER, on Mike's face footage** (memory `no-matting-mikes-face`):
  keying eats face patches on this unevenly-lit screen (re-proven 2026-07-24), and AI matting was
  tried in the past and rejected — "it messes up my eyes." Face windows F2-F8 air AS RECORDED
  (green-screen room visible, status quo of previous videos).
- **F1 ONLY gets the treatment, via Higgsfield VIDEO-TO-VIDEO:** send the opening face clip to the
  model and have it regenerate the scene with the new background behind the same performance.
  - Source: `assets/vid/F1-raw-for-higgsfield.mp4` — extracted 2026-07-24 from the RAW master
    (raw 10.11-16.11, i.e. e-spine F1 0.00-4.70 + 0.4s handles, mapped e→d→c→b/a→raw; crf16).
  - Seedance **480p ONLY** hard rule applies (Remotion upscales free).
  - Target world: the BG-1 BlockDAG backdrop (matches `card-40bps-open`). Candidates:
    `assets/img/BG-1-face-backdrop-v1/-v2.png` (also usable as the v2v reference image).
  - Output: `assets/vid/F1-higgsfield-bg-swap.mp4` (audio stripped; comp keeps the SPINE's audio and
    lays this video over the F1 window). **✅ APPROVED BY MIKE 2026-07-24 ("I like the background
    removal, let's keep it") — F1 airs as this clip.** Alignment: swap has 0.4s head handle (swap
    t≈0.4 = spine t=0.0); model baked ~5% punch-in, so keep the comp's own punch subtle or drop it.

Every image is unique (never reuse an image_id/file across posts/videos).

## CHARTS build worklist (both types — Mike, 2026-07-24: every BROLL-PLAN carries this section)

**Type 1 — ANIMATED charts (motion; code-built, animate for real via useCurrentFrame):**

| id | What moves | Placement(s) | Status |
|---|---|---|---|
| H1 | hook counter: live-ticking 10 BLOCKS/SEC → SLAMS to 'UP TO 40' + TARGET: 2026 stamp | CH1 0:20.9–0:32.4 | ☐ to build |
| C1 | bps ladder timeline: rungs animate in one at a time; stamps/re-lights on callbacks | CH2 build 0:52.8 · rung3 1:34.7 · rung4 2:01.8 · CH3 callback 5:05.1 · CH5 grand assembly 7:03.9 | ☐ to build |
| C2 | block-cadence race: bars PULSE at real cadence (BTC/ETH/Kaspa/DAGKnight-era) + blink annotation | CH4 5:26.3–5:47.3 | ☐ to build |
| C3 | TPS capacity bars: bars grow, 5,584 DEMONSTRATED marker stamps, 20k+ spotlights, CAPACITY label slams | CH4 5:47.3–6:13.3 | ☐ to build |
| FIN | finality-drop: 'UNDER 7 SECONDS' fills → collapses to 'UNDER 1 SECOND' + POTENTIAL tag | CH3 3:37.4–3:47.8 | ☐ to build |

**Type 2 — SYSTEM-DESIGN charts (NO motion; code-rendered HTML/SVG stills screenshotted into the
comp; any movement comes from comp-level spotlights/zooms/transitions, never baked animation.
Destination: `assets/diagrams/` — Type 1 lives in `assets/charts/`, per comp-build.md §10):**

| id | States / stills | Placement(s) | Status |
|---|---|---|---|
| C4 | ⚠ **PROMOTED TO TYPE 1 (ANIMATED) 2026-07-25** — Mike: "it is a static diagram for up to 15 seconds… we need some sort of movement between those nodes". The locked PNG stays the base (labels must stay pixel-accurate, so no AI footage and no re-draw); the comp overlays code-animated PACKETS travelling the REAL link coordinates read out of `c4.html`. GHOSTDAG crawls at ONE fixed rate (that IS the hardcoded guess); DAGKnight starts at the same crawl then ADAPTS to the VO — opens up on "the chain runs faster" (207.5), throttles on "conditions change" (208.8), recovers on "it adjusts" (210.5). Camera push eased to ~1.06 so nothing clips. Original Type 2 spec below. TWO stills: LEFT = GHOSTDAG (nodes cyan, red 'ASSUMED worst-case latency' box, readout pinned low) · RIGHT = DAGKnight (MEASURED gauge, readout high). Sub-spotlights at comp; the LEFT→RIGHT swap rides the reserved MELT @3:14.8 (TRANSITIONS.md §4); RIGHT opens post-shatter | CH3 LEFT 2:29.0–2:51.9 · re-enter 3:11.3 · RIGHT 3:14.8–3:32.6 | ☐ to build |
| D-DAG | ONE still: 'NOT A CHAIN, A DAG' — linear chain vs BlockDAG mesh, DAG side highlight at comp | CH2 1:56.3–2:01.8 | ☐ to build |

## SLIDES build worklist (CSS containers — Mike, 2026-07-24: every BROLL-PLAN carries this section too)

_Visual spec + locked stylesheet: `skills/container-reference/README.md` + `container-canonical.css`.
Build each as a standalone full-frame HTML element → screenshot @1920x1080; NEVER crop a deck. The
title-vs-card split below is the plan's default; swap per container at build if it reads better the
other way._

**Type 1 — TITLE SLIDES** (NO box: eyebrow + serif headline with accent-colored key words + short body
on dark bg; exemplar `bittensor-text-dualcitizens-70s.jpg`):

| id | Eyebrow / headline | Placement | Status |
|---|---|---|---|
| card-40bps-open | — / '40 BLOCKS / SECOND' + 'TARGET: THIS YEAR' (motion type over BlockDAG mesh; type animates at comp) | CH1 0:04.7 | ☐ to build |
| card-fastest-pow | — / 'FASTEST PROOF OF WORK CHAIN', body: 10 blocks/second, one every 100 ms | CH1 0:15.7 | ☐ to build |
| card-negation | 'WHAT TOCCATA DID NOT TOUCH' / 'BLOCK RATE: STILL 10 / SECOND' + lock motif | CH2 1:28.4 | ☐ to build |
| card-dagknight-intro | 'NEW CONSENSUS PROTOCOL' / what is DAGKnight, body: the rulebook every node uses | CH3 2:14.5 | ☐ to build |
| stamp-subsecond | — / 'SUB-SECOND FINALITY. ON PROOF OF WORK.' (motion-type slam at comp; 2.46s floor exception pending Mike) | CH4 6:34.9 | ☐ to build |

**Type 2 — CARD SLIDES** (same anatomy INSIDE a rounded card box with top-accent line; exemplar
`banks-card-fiat-112s.jpg`):

| id | Content | Placement | Status |
|---|---|---|---|
| toccata-features | 'TOCCATA: THE PROGRAMMABILITY FORK', 3 rows spotlight one at a time | CH2 1:19.7 | ☐ to build |
| card-security-50 | shield, 'SECURE WITH UP TO HALF THE NETWORK MALICIOUS' (⛔ pending C4-badge alternative + Byzantine-phrasing verify) | CH3 3:32.6 | ☐ to build |
| compare-solana-kaspa | 'SAME CLUB, DIFFERENT RULES' declared A-vs-B, Kaspa rows light | CH4 6:22.4 | ☐ to build |
| card-honest-target | 'THE HONEST PART' / 'A TARGET, NOT A SCHEDULE', rows light | CH4 6:37.4 | ☐ to build |

(System-design charts are NOT slides — they live in the CHARTS section Type 2 above.)

## Receipts + screen recordings (NOT b-roll budget; typed R(article)/R(other) per broll-and-containers.md "Cover STYLE devices" §1)

_R(article) = prose read on air, gets the mandatory reading/motion treatment (slow push-in on the read
paragraph, or a single-image library camera-move per §2; two-stage zoom OK on long reads). R(other) =
platform/UI capture, treatment per capture._

| id | Type | Claim / beat | Capture + treatment | Status |
|---|---|---|---|---|
| R1 (=C5) | R(other) | Toccata activated, v2.0.0 (CH2 75.26) | github.com/kaspanet/rusty-kaspa/releases/tag/v2.0.0 — re-capture live; subtle push optional | ☐ pending |
| R2 | R(other) | 10 bps live (CH1 11.70) | explorer.kaspa.org live block feed, ~5s SCREEN RECORDING (bench kas.fyi) 🔍 verify view; recording moves itself | ☐ pending |
| R3 | R(article) | DAGKNIGHT paper 2022 (CH3 142.82) | eprint.iacr.org/2022/1494 title page 🔍 confirm URL; READING treatment: slow push-in to title+authors (or MOTION 3D Pan) | ☐ pending |
| R4 | R(other) | built in the open (CH4 405.00) | rusty-kaspa commits/PRs slow-scroll RECORDING, no testnet-ready claims visible 🔍; scroll IS the motion | ☐ pending |
| R5 | R(other) | ~95% supply mined (CH5 436.30) | CMC Kaspa supply panel, cropped 🔍 confirm ~95% live; subtle push optional | ☐ pending |
| R6 | R(article) | Alpenglow sub-second finality (CH4 376.50) | Anza/solana.com announcement 🔍 DOUBLES AS THE PUBLIC-SOURCE VERIFY; READING treatment: push-in on the finality claim (bench = neutral headline, no number) | ✅ captured + QA PASS |
| R7 | R(other) | Membership pricing (CH3 PLUG 291.4→305.07, overlay on F5, holds to end of plug) | https://cryptorich.vip/products full-page high-res; ~13.6s hold kept alive with the SINGLE-IMAGE MOTION moves (mix a slow zoom + a 3D pan per broll-and-containers devices §2 — Mike: "use those new motion effects on it"). Own-site link = allowed | ✅ captured + verified 2026-07-24 22:31 (3840×3358, pricing legible: Premium $79/mo · VIP $59/mo; no flags) |
