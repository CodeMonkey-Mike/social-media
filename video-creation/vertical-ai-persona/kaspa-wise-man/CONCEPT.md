# The Kaspa Wise Man — Concept & Production Design

> Companion to `quotes.json` (the 100-line bank) in this same folder. This doc captures the creative
> + workflow decisions made 2026-06-01. The locked creative rules also live in the `quotes.json`
> header; canonical Kaspa terminology/theses live in `persona/persona.json`; the spoken-delivery
> persona lives in `../persona-voice.json`; the technical generation pipeline lives in `../SKILL.md`.

---

## 1. Concept

A recurring vertical (9:16) AI-persona series: **Mike's likeness as a wise-man / sage character** who
delivers **one short, high-conviction Kaspa line per video** (5-15s). Targeted squarely at the Kaspa
community for maximum attention. Chosen as the **easiest format to run at scale** because it's
single-character + single-voice + one locked framing reused across EVERY video, so only the spoken
line (and the opening hook) varies. No 2-voice chaining, which was the big cost/complexity in the
crypto-promo testimonial.

---

## 2. Register (LOCKED) — "conviction sage"

A wise man **WITH fire**, never a sleepy or serene monk.

- Mike's explicit steer: a calm, meditative monk **bores viewers**. The viewer must be excited enough
  to like, subscribe, and watch more. Gravitas plus electricity.
- Delivery: measured but intense; lines **build** and land hard on a payoff word. **Every line ends on
  a button** (a punch, a challenge to the viewer, or present-tense urgency), never trailing off into
  serenity.
- Voice: Mike's real timbre (`../identity/my-avatar-voice-13s.mp3`), directed with weight and build.
  Words in CAPS in the quote bank mark the intended emphasis word for the TTS.
- Note: the tweet-persona ban on "aphorism-style drop-the-mic closers" does **not** apply here. That
  ban is for written tweets. For this spoken sage character, the aphorism IS the format.

---

## 3. Signature visual device (LOCKED) — the impossible-metaphor hook

Decided after analyzing IG **@iceman.healer** (reel `DY-6DXCK_kE`, watched 2026-06-01).

**The insight:** iceman.healer's scroll-stopper is a **photoreal but physically-impossible visual**
in the first ~5 seconds (e.g. pouring liquid on a leg that melts the skin away to reveal muscle).
You *know* it's fake; that "wrongness" is exactly what stops the scroll. It is **bold exaggeration,
NOT a subtle aura** — this corrected an earlier lean toward a faint greenish cyan glow.

**Our adaptation:** open EVERY video with a striking, impossible visual **metaphor that dramatizes
that day's quote**, paired with the wise man (see the hard rule below).

**HARD RULE (Mike, 2026-06-02) — the wise man is ON SCREEN from the first second of EVERY video.**
There is **no presenter-less cold open**. The opening always resolves to exactly **one of two
layouts**, never neither:
1. **Corner presenter** — the impossible visual fills the frame and the wise man is composited small
   in the **bottom-left corner** from the first frame (§3a). Use when the metaphor is strong enough to
   carry the full screen.
2. **Full screen** — the wise man is full-frame, talking-head delivery. Use when the line carries
   itself or the visual is better as a held background behind him.
Both layouts keep the impossible visual; the only question is whether the sage is small-in-corner or
full-frame. He is never absent from the open.

Structure (template, adapt per line):
1. **Hook beat** (0-9s) — the impossible image, WITH the wise man present (corner or full-frame).
2. **Demo / middle** (9-25s) — optional supporting beat.
3. **Direct-to-camera payoff** — wise man delivers the line, sincere, lands on the button.

Caption style to reuse: **bold white all-caps, 2-4 words, yellow highlight on the key word** — this
is the karaoke look already built in Remotion for crypto-promo. Reuse it as-is.

### 3a. Layout 1 — "corner presenter"

One of the two locked layouts (see the hard rule in §3). Inspired by IG **@iceman.healer / Mother
Satori** (reel `DYTxX3BKDew`, watched 2026-06-02): the **impossible visual fills the entire frame**
while the **wise man sits small in the bottom-left corner**, on screen from the first frame,
reacting/gesturing.

- **When to use it:** when the day's impossible metaphor is strong enough to *carry the full screen*
  (e.g. fl-07's machine birthing a coin, fl-03's puppet tableau). The sage stays in-corner as a
  constant anchor while the crazy thing plays out, then you push in to him for the spoken payoff.
- **Composition consequence:** the impossible visual must **reserve clean space in the bottom-left**
  for the cutout. If a generated visual fills the bottom-left with detail, regenerate it with the key
  action shifted up/right so the corner is clear (learned on fl-03, where the freed Kaspa coin sat
  bottom-center and crowded the corner slot).
- **Why it fits our build:** it's the intended use of the **locked transparent cutout**
  (`character/base-wise-man-cutout.png`) — composite him small bottom-left over the full-frame visual;
  no green-screen step, backdrop is whatever the impossible visual is.
- **Framing rule (Mike, 2026-06-02):** keep the impossible visual a **tight close-up that fills the
  frame** (like Satori). Do NOT pull wide to show the room/floor — too much information, kills the
  shock. The crazy object IS the whole screen.

### 3b. Layout 2 — "full screen"

The other locked layout: the wise man is **full-frame** (talking-head delivery), on screen from the
first second. Use when the line carries itself, or when the impossible visual works better as a held
background behind him rather than a frame-filling spectacle. Still no presenter-less open.

---

## 4. Hook archetypes (~8, one per theme) + bespoke override

Hybrid model. **Default:** each quote's `theme` auto-pairs with that theme's reusable archetype, so a
daily candidate can be produced hands-off. **Override:** a quote may carry a bespoke hook idea for a
standout concept (higher cost, used only when the idea earns it).

| Theme | Default hook archetype (impossible visual metaphor) |
|---|---|
| fair-launch | He holds a rival-logo coin that **crumbles to ash** in his palm while a greenish cyan Kaspa coin stays whole and pulsing. |
| ghostdag | A single-file line of blocks crawls in a traffic jam; he snaps and it **explodes into a glowing 3D lattice** flowing every direction. |
| dag-explained | A one-lane bridge vs. a hundred-lane bridge that still agrees who crossed first; or a single rope vs. a branching tree of blocks. |
| proof-of-work | One coin **forged in a blacksmith fire** (sparks, hammer) beside a desktop **printer spitting fake paper coins**. Real vs. printed. |
| anti-cycle | He **smashes a giant four-year clock/calendar**; a glowing tide of liquidity floods across the table. |
| succession-cascade | A crowd of little orange BTC-maxi figures walk through a doorway and **emerge glowing greenish cyan**. |
| institutional-adoption | A **vault door / Wall Street weight** crushes every rail except the Kaspa one, which holds. |
| building-wealth | He plants a seed that **instantly grows into a greenish cyan tree heavy with coins**, while the guy beside him keeps ripping his own seedling out. |

Schema (IMPLEMENTED in `quotes.json`): a top-level `hook_archetypes` map (theme -> visual-family
description) plus a `hook` field on **every** quote. All 100 lines now carry a bespoke hook (a specific
variation within the theme's family) rather than `null`. The archetype serves two purposes: (1) the
shared visual language that keeps a theme's hooks coherent, and (2) a cheaper fallback render — at
production time you can reuse a cached archetype clip instead of rendering the bespoke hook, to save
credits. The hook text costs nothing; only rendering does.

---

## 5. Production model (LOCKED) — supervised automation

**Mike's hard rule: the daily run PRODUCES a candidate but posts NOTHING without Mike's approval.**
This is "supervised automation," not auto-publishing.

Flow:
1. **Pick** the next `unused` quote from `quotes.json`.
2. **Render the hook** — theme archetype (default) or the quote's bespoke `hook`.
3. **Render the delivery** — single-voice Seedance talking-head of the wise man speaking the line,
   `--duration` matched to `approx_seconds` (tight, or the TTS hallucinates filler — see `../SKILL.md`).
4. **Caption + assemble** — Whisper word-timings -> yellow-highlight karaoke -> Remotion 1080x1920.
5. **STOP for approval** — present on a review dashboard (reuse crypto-promo's `storyboard.html`
   Approve / Regenerate pattern). Nothing is posted yet.
6. **On approval -> publish** via the existing `schedule-tweets` shorts pipeline (the publish-shorts
   path / `/publish-shorts`). One entry fans out to up to 7 platforms.

**Batch-ahead friendly:** the run can produce a week of candidates at once; Mike approves them in one
sitting; they drip out one per day. Interaction drops to a few minutes a week, but every frame is
human-approved before it is public.

EVERGREEN-ONLY rule for the bank: no dated / time-pegged lines (no "this June", no current price).
Time-pegged hype lines are posted fresh as one-offs, not stored in the bank.

---

## 6. Folder contents

- `quotes.json` — the bank: 100 evergreen lines, 8 themes, energy-tagged, each with a `hook`, plus the
  `hook_archetypes` map. id/status/used_date per line. SOURCE OF TRUTH.
- `dashboard.html` — self-contained, double-clickable review board (search + filter by theme/energy/
  status). No server needed.
- `build_dashboard.py` — regenerates `dashboard.html` from `quotes.json`. Re-run after any bank edit:
  `python build_dashboard.py`.
- **Per-concept render assets** live in `prototype-<id>/keyframes/` (e.g. `prototype-fl-07/keyframes/`).
  To surface them on the dashboard, add a `keyframes` array to that quote in `quotes.json` holding
  paths **relative to this folder** (where `dashboard.html` lives); the card then shows a clickable
  thumbnail strip (click = full-size lightbox). This is how generated hook stills get tied to the
  correct video concept. Re-run `build_dashboard.py` after editing.
- `CONCEPT.md` — this doc (creative + workflow design).
- `character/` — the LOCKED wise-man anchors + their source refs. Canonical:
  `base-wise-man-cutout.png` (transparent, primary) and `base-wise-man-white.png` (white plate).
  Built from `face1-4.png` + `clothing.jpg`; `short-hair-v3-leaner*` were unpromoted exploration.

## 6a. Series branding rules (LOCKED 2026-06-05)

Every Kaspa Wise Man video, when queued via publish-shorts, must carry the series branding so the
channel reads as one coherent series and is discoverable:

- **Series hashtag `#KaspaWiseman`** (exact casing, Kaspa with a K) on EVERY video, and it must be
  CLICKABLE in the caption. Since X caps the shared base caption at 2 hashtags, the two base-caption
  hashtags are **`#Kaspa` + `#KaspaWiseman`**; topical hashtags (#Crypto, #FairLaunch, ...) move to the
  `tags` array / richer TikTok-IG-YT `caption_override`s. Put `KaspaWiseman` first in `tags` too.
- **Title prefix `Kaspa Wiseman #N: `** where N is the video's number in the series, then the open-loop
  hook. e.g. `Kaspa Wiseman #1: Who got the early bag in Kaspa?`. The channel intro is **episode #0**;
  quote videos start at **#1** (fl-07 = #1). Keep a running counter as the series grows.

## 7. Status & resume (last updated 2026-06-05)

**MILESTONE 2026-06-05 — first QUOTE video (fair-launch fl-07) built + Mike-approved (by ear), not yet
published; no music bed yet.** Draft: `prototype-fl-07/wise-man-fl07-v2-DRAFT.mp4`. This session
locked TWO new standards that change the pipeline below:

- **Character recolored to Kaspa brand colors.** Rust-orange robe -> greenish-cyan/teal. New locked
  anchor `character/base-wise-man-kaspa-white.png` (identity-preserving `nano_banana_2` LOCAL edit on
  `base-wise-man-white.png`, color-only). Plus a 1:1 square pad `...-square.png` (see pipeline).
- **NEW compositing pipeline (replaces baking the sage into the scene): white-bg 1:1 generation ->
  transparent PNG-sequence cutout -> composite over the impossible-visual video.** The sage is now a
  clean transparent overlay (no box), §3a corner-presenter realized as a real talking cutout. Full
  steps + gotchas (this block is the canonical record). Key pieces in `prototype-fl-07/`:
  generate 1:1 white delivery with a **MINIMAL prompt** (elaborate prompt degrades the "caspa"
  pronunciation to "Kashpa" — minimal restores clean "Caspa"; `_white-1x1/_prompt-a.txt`);
  matte `_white-1x1/matte_to_pngs.py` (rembg `u2net_human_seg`, NO alpha_matting + floor alpha<25->0,
  outputs `assets/wise-man-fl07/cutout/c_*.png`); composite `remotion/src/WiseManFl07.tsx`
  (backdrop coin video full-frame + frame-indexed `<Img>` cutout bottom-left + separate `<Audio>`
  voice + karaoke). **GOTCHA: VP9-alpha webm renders as a black box in Remotion — use a PNG sequence.**
- TTS pronunciation (out-of-vocab "Kaspa" is stochastic per roll; the prompt spelling is the only lever):
  spell it **"caspa"** (C, winner 2026-06-05) and *Kaspian* as "Caspian" in the SPOKEN line only (never
  on-screen; captions/SUBS always show "Kaspa"). The BIGGER lever is **prompt verbosity** — keep the
  Seedance prompt MINIMAL or it improvises the pronunciation (the elaborate "wise man with fire" prompt
  degraded the same "caspa" spelling to "Kashpa" SH). Judge by EAR **and the on-camera mouth-shape
  (viseme)**, not just Whisper (Whisper "Caspa"=good / "Kashpa"=bad is only a cheap filter). Rejected
  spellings and what they produced: Kaspa->"cusp", Caspa/Casspa->"cash-ba", Cass-Pa->"kas-PAW",
  kas-puh->"kass-poo", kas-pah->mushy, "casper"->too rhotic ("-ER").
- Higgsfield 502s still bill + complete server-side; recover via `generate list`. `[[higgsfield-502-recovery]]`.

**Open on fl-07:** confirm/iterate cutout placement+size; add a music bed; then publish via publish-shorts.

---

## 7-prior. Status & resume (last updated 2026-06-02)

**Done this far — all PLANNING + writing:**
- 100 lines written (conviction-sage voice), each with a bespoke impossible-metaphor hook.
- 8 hook archetypes (visual families) defined.
- Review dashboard built. Concept + workflow locked.
- **Layout hard rule locked (§3):** wise man on screen from frame 1 of EVERY video; two layouts only,
  §3a corner-presenter or §3b full-screen. No presenter-less cold open.
- **Dashboard now shows per-concept keyframes** (§6): `keyframes` array on a quote -> thumbnail strip
  + lightbox in `dashboard.html`.

**Production — IN PROGRESS (pick up here):**
0. **Channel intro — RENDERED + APPROVED (2026-06-04), not yet published.** First wise-man video taken
   fully through the edit pipeline (3 Seedance clips -> concat -> Whisper karaoke captions -> serene
   music bed -> Remotion 1080x1920). Validated the whole §8 editing recipe. Deliverable +
   gotchas (caption-flicker fix, SUBS brand-correction, render cwd, license code) are in **§8**.
   Next action when Mike says go: publish via `/publish-shorts` with Theta Rest license `VHWICIAB6U5Y9OHE`.
1. **Wise-man character — LOCKED (2026-06-02).** Mike's real face + short monk crop + rust
   burnt-orange layered monk robe. Built by LOCAL edits via Nano Banana Pro (`nano_banana_2`) from his
   real photos in `character/` (`face1-4.png`) + `clothing.jpg` wardrobe ref. NO Soul, NO full
   re-render: each step changed exactly ONE thing (face2 shirt->robe, then long hair->short crop) so
   identity never drifted (a from-scratch multi-ref render DID drift — see `base-monk-v1.png`).
   **Canonical locked anchors (both derived from `base-wise-man.png`):**
   - `character/base-wise-man-white.png` — white background (2752x1536). Use when a clean/white plate
     is wanted.
   - `character/base-wise-man-cutout.png` — **transparent cutout** (RGBA, true alpha, 2752x1536). The
     primary anchor: lets us **composite any backdrop behind him at assembly time**, so backdrop is no
     longer a baked-in decision — it varies per video.
   The `short-hair-v3-leaner*` files were face-slimming exploration that was NOT promoted to the lock.
   STILL OPEN: voice direction confirm (`../identity/my-avatar-voice-13s.mp3`) + the frozen delivery
   template `medias.json` (delivery keyframe + voice id) — handled in the prototype step below.
2. **Prototype one hook** — recommend fair-launch `fl-04` or the coin-crumbling-to-ash idea (most
   iconic). Cut it against a delivery clip to validate the hook -> talking-head transition + caption
   timing BEFORE committing to all eight archetypes.
3. **Daily runner** — script the §5 flow up to the approval STOP (pick next `unused` -> render hook +
   single-voice Seedance delivery -> caption -> assemble -> STOP). Then wire approved candidates into
   the publish-shorts queue.

**Reminders for next session:** read this file + `quotes.json` first. Generation pipeline mechanics
(Seedance recipe, duration/pacing, anti-bg-audio directive, Remotion captions) are in `../SKILL.md`.
Hard rule: nothing posts without Mike's approval (§5). EVERGREEN-only bank (§5).

---

## 8. Editing pipeline — VALIDATED 2026-06-04 (the channel intro, first rendered wise-man video)

The §5 step 4 ("caption + assemble") is now proven end to end on the **channel intro**
(`prototype-intro/`). This is the concrete, reusable recipe for every wise-man video. The intro is
**rendered + Mike-approved, NOT yet published** (held deliberately): final at
`prototype-intro/wise-man-intro-EDITED.mp4` (also `remotion/out/wise-man-intro.mp4`), 1080x1920
h264, 33.3s. Source script/keyframes/clips: `prototype-intro/` (3 chained Seedance clips concatenated
to `intro-concat.mp4`).

**Captions — `prototype-intro/_build_captions_intro.py`** (clone of `../scripts/build_captions.py`):
- Transcribes EACH clip on its own clean audio (local Whisper, `--model small --word_timestamps`),
  offsets each clip's word times by its cumulative position in the concat, groups into <=4-word
  karaoke beats. Emits `remotion/src/wiseManIntroCaptions.ts`.
- **CRITICAL — the SUBS correction map.** The TTS respellings are AUDIO-ONLY (Kaspa->"casper",
  Kaspian->"Caspian"; see [[kaspa-wise-man-tts-spelling]] / `../SKILL.md`). Whisper transcribes what it
  HEARS, so raw captions say CASPER / CASPIAN. A `SUBS` dict in the builder rewrites the **on-screen**
  words back to the brand: `CASPER->KASPA`, `CASPER'S->KASPA'S`, `CASPIDIAN/CASPIAN->KASPIAN`, plus
  fixups `WISEMAN->WISE MAN`, `-TIME->TIME`. A value with a space is split back into multiple karaoke
  words (timing divided evenly). **Every wise-man video needs this pass** — keep the corrections IN the
  generator (reproducible), never hand-edit the auto-generated `.ts`.

**Composition — `remotion/src/WiseManIntro.tsx`** (registered in `Root.tsx`, id `WiseManIntro`,
`durationInFrames` = ceil(seconds*30), 30fps, 1080x1920). Layers: `<OffthreadVideo>` of the concat
(free-upscaled from the 480p Seedance source) + the music bed + karaoke captions. Assets live in
`video-creation/assets/wise-man-intro/` (Remotion `setPublicDir("../assets")`, so `staticFile()`
resolves there) — copy the concat mp4 + the chosen music mp3 in.

**Music bed (reuse the karaoke + bed pattern):** dry voice in the clips + ONE serene track laid in
Remotion as `<Audio src={staticFile(...)} volume={0.15}>` with a fade in/out, sitting UNDER Mike's
voice (do not rely on Seedance's self-invented bed — kill it with the negative-audio directive at
generate time). Intro bed = **Theta Rest** (cleared, Soundstripe license `VHWICIAB6U5Y9OHE`), sourced
via the music skill — see [[music-sourcing-skill]]. At publish, append the **bare license code**
(just `VHWICIAB6U5Y9OHE`, NO "licensed via Soundstripe" wrapper) at the bottom of the **YouTube
description ONLY** (`yt_shorts.caption_override`) — Soundstripe clearance is YouTube Content-ID only;
IG/FB/the others do NOT need it (Mike, 2026-06-05).

**GOTCHAS (hit this session):**
- **Karaoke caption flicker.** The reused crypto-promo karaoke span widened the *active* word's
  padding (12px vs 4px). When the highlight advances, the line width changes and a near-full line
  reflows 1-line<->2-line every frame (the "SO CLICK THAT LIKE" flicker). **Fix: padding MUST be
  constant in both states** — only `backgroundColor`/`color` toggle on the active word, never width.
  (Applies to the crypto-promo component too.)
- **Render entrypoint.** Run `npx remotion render` with the cwd **inside `video-creation/remotion/`**
  (`cd .../remotion && npx remotion render src/index.ts WiseManIntro out/...mp4 --codec=h264`). A
  background shell that starts elsewhere fails with `npm error could not determine executable to run`.
- **Verify objectively:** ffprobe dims/duration; `volumedetect` (confirms voice+bed actually mixed);
  eyeball a still at each key beat (brand words spelled right, no reflow).
