# Video Creation Skill

**This is the single canonical skill for all of Mike's video creation.**

> **One file, at the visible repo root: `video-creation/SKILL.md`.** Committed to git, travels with the repo, NOT hidden in any `.claude` folder. `video-creation/CLAUDE.md` (also at root) points here and is auto-loaded every session, so this file gets read first. There is no other copy to keep in sync. Edit techniques HERE.
> _History (2026-05-25): a former `~/.claude/skills/create-short/skill.md` lived outside the project and had silently diverged from this doc, causing real lost-context incidents. It was merged in, renamed (the old `create-short` name was a misnomer — this is not shorts-only), and the home copy deleted._
>
> **Two helper files point here (neither holds real content):** `CLAUDE.md` (root, auto-loaded each session) and a 3-line POINTER skill at `.claude/skills/video-creation/SKILL.md` that re-enables the `/video-creation` command. **Never copy real content into either** — that recreates the divergence we got burned by. The pointer must stay a pointer.

### Scope — what applies to ALL video vs. shorts only
- **Format-agnostic (every video — shorts, longform, anything):** transcription → **90-second chunk-and-group topic finding** (Phase 3), **snap-to-silence cutting** (Phase 5B: silence < −57 dBFS, audio > −52 dBFS, 250 ms, NO pad), **Whisper word-level captions** (Phase 6), the multi-snippet rule, and the clip-review-before-production discipline. Use these for any video work, not just shorts.
- **Short-form-specific:** the **PRODUCTION REFERENCE** section (9:16 1080×1920 zone model, vertical layout, b-roll coverage budget, safe zone). When producing longform or another format, reuse the upstream phases but adapt production to that format.

**Phase 8 — Publish (handoff to schedule-tweets):** once a batch is fully produced AND Mike-approved, queue it via the **`/publish-shorts`** skill — canonical doc `video-creation/PUBLISH-SHORTS.md`. It copies the rendered mp4s into `schedule-tweets/shorts/<batch>/` and appends fully-structured `data/shorts.json` entries (open-loop hook titles, clean no-hashtag captions, CryptoRich.vip link only on yt/rumble/bitchute, no em dashes). Do not hand-do this — invoke the skill.

---

## Workspace layout

```
video-creation/
├── SKILL.md                      — this file (the canonical skill, visible at root)
├── CLAUDE.md                     — short pointer; auto-loaded, tells Claude to read SKILL.md first
├── .claude/skills/video-creation/SKILL.md  — 3-line POINTER (enables /video-creation cmd); real skill is THIS root file
├── DISCUSSION.md                 — founding context, session history, next steps
├── style-guide/
│   ├── shorts-style-guide.md    — layout, b-roll, hook structure, transitions, CTA
│   ├── captions.md              — caption1 style: font, size, animation keyframes
│   └── broll-analysis.md       — frame-by-frame analysis of 4 sample shorts
├── assets/
│   └── sfx/                     — ~90 sound effect files
├── shorts/                       — one folder per batch: <batch>/ (clip subdirs + dashboard.html + progress.json); _tooling/ holds caption/transcribe scripts
├── remotion/                     — Remotion project for rendering MP4s
├── livestream-repurpose/         — source media/, transcripts/, scripts/
└── watch/                        — extracted frames + transcripts from reference videos
```

**Transcript layout convention:** each livestream's transcript artifacts live together in a
per-livestream folder, `livestream-repurpose/transcripts/<livestream name>/`, holding the raw
Whisper `<name>.json` plus the derived `<name>_plain.txt`, `<name>_words.txt`, and
`<name>_chunks_90s.txt`. Save the raw `.json` into that folder; `parse_transcript.py` and
`chunk_transcript.py` write their outputs next to the `.json`, so they land in the folder
automatically. This keeps `transcripts/` one-folder-per-livestream (so the cleaner can match a
whole folder to a batch) instead of a flat dump of 4×N files.

---

## Phase map + numbering convention (canonical — keep stable)

The pipeline phases, in order. **This is the source of truth for phase numbers — do not renumber
casually, and when you add a phase, follow the convention below.**

| Phase | Name | Canonical instructions |
|---|---|---|
| **1** | Intake → LOW BPS (Step 1) + Verticalize (Step 1B) | `livestream-repurpose/skills/intake-verticalize/SKILL.md` |
| **2** | Transcribe the vertical | `livestream-repurpose/skills/transcribe-vertical/SKILL.md` |
| **3** | Find topics | `livestream-repurpose/skills/topic-finding/SKILL.md` |
| **4** | Clip selection + timestamp definition | `livestream-repurpose/skills/clip-selection-dashboard/SKILL.md` |
| **4b** | Clip review dashboard (Mike approves / skips) | `livestream-repurpose/skills/clip-selection-dashboard/SKILL.md` |
| **5** | Tighten pass | `livestream-repurpose/skills/tighten-pass/SKILL.md` |
| **5B** | Silence removal (`delete_silences.py`) | `skills/desilencer/desilencer.md` (track-agnostic) |
| **5C** | **Filler removal** (um/uh/you know/discourse-like) | `skills/filler-removal/filler-removal.md` (track-agnostic) |
| **6** | Whisper captions | `skills/captions/captions.md` (track-agnostic) |
| **7** | Production / render | `livestream-repurpose/skills/remotion-shorts-build/SKILL.md` (contract + gate) + this file's PRODUCTION REFERENCE |
| **8** | Publish (handoff to `/publish-shorts`) | `PUBLISH-SHORTS.md` (multi-track, stays at root) |

_(Phases 1-5 moved to per-track skill files 2026-07-08 — livestream-specific instructions live in the
livestream-repurpose track, per the per-track-skills convention; pointer stubs below redirect.)_

**Numbering convention (so this never gets confusing again):**
- Phases are **whole numbers** in pipeline order. No decimals (no "4b.5"), no letter-only phases.
- A **capital `B` suffix** marks a tightly-coupled sub-step of the same conceptual stage — a thing
  that always runs right after its parent and belongs to the same idea. `4 / 4b` = "select clips /
  review the selection." `5 / 5B` = "trim the timeline: tighten slack / remove silence." Use `B`
  ONLY for that parent-child relationship; a genuinely distinct stage gets its own whole number
  (captions = 6, not 5C).
- **A `B` step is still its own gate** — it runs and is checked separately from its parent.
- Within a phase, finer procedure is "**Step N**" (e.g. Phase 1 has Step 1 / Step 1B), kept local to
  that phase. Don't promote a Step to a Phase or vice-versa without updating this table.

## Phase 1 — Intake + Verticalize the livestream — replaces the Premiere pass

> **MOVED (2026-07-08): canonical = `livestream-repurpose/skills/intake-verticalize/SKILL.md`** - LOW BPS re-encode + Lane-1 longform queue (Step 1) and the 16:9->9:16 verticalize with the learned Premiere framing (Step 1B). Legacy OBS crop coordinates are its appendix.
> Read that file in full before doing this phase's work; it wins on conflict.

## Phase 2 — Transcribe the vertical livestream

> **MOVED (2026-07-08): canonical = `livestream-repurpose/skills/transcribe-vertical/SKILL.md`** - Whisper word-level transcription of the VERTICAL file, the transcripts/<name VERTICAL>/ artifact layout (_plain/_words/_chunks_90s), STT corrections.
> Read that file in full before doing this phase's work; it wins on conflict.

## Phase 3 — Find topics in the transcript

> **MOVED (2026-07-08): canonical = `livestream-repurpose/skills/topic-finding/SKILL.md`** - 90-second chunk-and-group method, multi-snippet/scatter rule, short-worthiness criteria, hype-over-market-data priority, peak beats, topic output format. The clip-strategist agent's method doc.
> Read that file in full before doing this phase's work; it wins on conflict.

## Measuring livestream crop coordinates

> **MOVED (2026-07-08): canonical = `livestream-repurpose/skills/intake-verticalize/SKILL.md`** - legacy OBS zone reference, now the appendix of intake-verticalize (superseded by Phase 1 verticalize).
> Read that file in full before doing this phase's work; it wins on conflict.

## Phase 4 — Clip selection and timestamp definition

> **MOVED (2026-07-08): canonical = `livestream-repurpose/skills/clip-selection-dashboard/SKILL.md`** - precise cutting rules (re-encode never -c copy), multi-snippet concat, length variants.
> Read that file in full before doing this phase's work; it wins on conflict.

## Phase 4b — Clip review dashboard (runs before Remotion production)

> **MOVED (2026-07-08): canonical = `livestream-repurpose/skills/clip-selection-dashboard/SKILL.md`** - the review dashboard convention (ONE cell per short, stable numbering, processing replaces in place), batch registration in batches.json (MANDATORY), render output naming.
> Read that file in full before doing this phase's work; it wins on conflict.

## Phase 5 — Tighten pass (`tighten_clips.py`) — AFTER review, BEFORE silence removal

> **MOVED (2026-07-08): canonical = `livestream-repurpose/skills/tighten-pass/SKILL.md`** - boundary re-lock + filler tics + content cuts to the best ~90% (10% target / 15% ceiling), tighten_log.json, dashboard rebuild in place. The tighten-strategist agent's method doc.
> Read that file in full before doing this phase's work; it wins on conflict.

## Phase 5B — Silence removal (delete_silences.py) — runs on each APPROVED clip

_(Promoted to its own phase 2026-06-03. Previously this lived inside Phase 4b; the captions
section that follows was renumbered 4c → 4d at the same time.)_

After Mike approves clips in the Phase 4b dashboard, remove internal silences from each approved
preview clip **before** captioning. This tightens pacing and is mandatory.

```
python livestream-repurpose/scripts/delete_silences.py <clip.mp4>
```

`delete_silences.py` is silence-removal mode, declicked — the right mode for talking-head clips.
It **must** run before Phase 6 (captions): silence removal shifts every word, so captions have
to be transcribed on the *silence-cut* clip to stay in sync. The spec below is what that script
implements (and the rule for snapping the original Phase-4b extraction boundaries too).

### Snap every cut boundary to true silence (NOT Whisper timestamps)

Whisper's segment/word end-times are unreliable — they're often 0.3–1.3 s off, so cutting at them clips word tails or starts on a fragment. **Place every cut inside detected silence instead**, using a level-based dual-threshold detector (Mike's Audition workflow, validated 2026-05-23):

- **Silence = below −57 dBFS; audio = above −52 dBFS** (5 dB hysteresis). A single −35 dB threshold is wrong — a word's decaying tail stays audible down to ~−55 dB and gets chopped.
- **min-silence 250 ms (default; it's the one knob), min-audio 80 ms, NO pad.** A gap under min-silence is kept (natural cadence). The blip-absorb is **80 ms, NOT 250 ms** — 250 ms swallowed short real words like "for"/"to" (silverscript, 2026-06-13); 80 ms drops clicks/lip-smacks while preserving every word. No padding — the correct low threshold + declick make it unnecessary.
- Measure per-20 ms RMS via ffmpeg `astats` (key `lavfi.astats.Overall.RMS_level`), run a hysteresis state machine to get audio regions, then **snap each keep-span: start → the nearest audio-region onset, end → just into the silence after the last word.** Guard against collapse (fall back to the original boundary if a snap inverts).
- **Two cut modes:** word/phrase cuts keep internal pauses (snap only the outer boundaries of each kept span); silence-removal clips keep *all* audio regions in the range (drop every silence >250 ms).

#### DECLICK every join — MANDATORY (else you get pops)

**Do NOT remove silences with a single `aselect`/`select` pass.** That hard-cuts and stitches kept regions directly; the join points land where a word tail is still slightly audible (above true zero), so each splice is a waveform discontinuity → an audible **pop/click**. (Real regression, 2026-05-25, video 2 popped at every join; the previous livestream didn't because its cutter declicked.)

**Fix — render each kept audio region as its own segment with an 8 ms audio fade-in/out, then concat:**
```
afade=t=in:st=0:d=0.008, afade=t=out:st=<region_dur-0.008>:d=0.008
```
The fade forces every join to zero amplitude → no click. This is NOT padding (it doesn't extend kept audio or change pacing) — it's only edge-smoothing, so it's fully compatible with the "NO pad" rule above.

**Canonical implementation — the desilencer skill (ALL tracks):** `video-creation/skills/desilencer/desilencer.md`,
tool `desilencer/scripts/desilence.py`. This is the ONE place silence detection lives; never write another
silence script or use single-threshold `silencedetect`. `livestream-repurpose/delete_silences.py` still
works for shorts (`python delete_silences.py <clip.mp4>`, in-place, 250 ms) but is now a thin wrapper that
routes to `desilence.py`. The word/phrase-cut mode (snap only outer boundaries, keep internal pauses) is not
yet rebuilt — reconstruct it from the snap rules above when needed, and declick its boundaries the same way.

## Phase 6 — Whisper captions (mandatory before Remotion)

**Before writing any caption data in a Remotion composition, run Whisper on the final clip to get word-level timestamps.** Do not hand-estimate caption timings — estimated timings are too slow and too coarse; they do not match the actual speech.

### Why this matters

Caption style for Mike's shorts is word-by-word at speech pace: 2–4 word groups that pop in and out roughly every **0.4–0.8 seconds**. This requires timestamps accurate to the hundredth of a second, which only Whisper output can provide. Estimated timings produce captions that stay on screen 1–2 seconds each, which looks slow and amateur.

### How to run Whisper on a clip

`openai-whisper` is installed locally on this machine. Run it via Python directly — no API key required:

```python
python -c "
import whisper, json
model = whisper.load_model('base')
result = model.transcribe('shorts/<topic-slug>/clip.mp4', word_timestamps=True, language='en')
with open('shorts/<topic-slug>/whisper.json', 'w') as f:
    json.dump(result, f, indent=2)
print('Done')
"
```

Output is a JSON file with `segments[]`. Each segment contains a `words[]` array with per-word `start`, `end`, and `text` fields — use those directly for caption timing.

### Converting Whisper segments to caption groups

From the Whisper segments, create 2–4 word groups:
1. Split each segment's text into words
2. Group into chunks of 2–4 words
3. Distribute the segment's time range evenly across groups (or use word-level timestamps if the API returns them)
4. Write each group as `{ t: <start>, h: '<text>' }` in the constants file

The result should look like the `CAPTIONS` array in `remotion/src/constants.ts` — groups changing every 0.4–0.8s, not every 1–2s.

### Caption group formatting rules (CANONICAL skill: `captions/captions.md` — `captions/build_captions.py --style montserrat`)

- 2–4 words per group, **never 5+**
- All lowercase
- Key words coloured with span tags: `<g>` = Kaspa teal, `<o>` = Bitcoin orange, `<r>` = red/danger, `<y>` = yellow emphasis
- Numbers, coin names, and strong claims get colour emphasis

---

## Phase 7 — Production

> ⛔ **The finalized-short CONTRACT + mechanical gate live in
> `livestream-repurpose/skills/remotion-shorts-build/SKILL.md` — read it first.** It defines what
> "done" means for a livestream-derived short (b-roll coverage every 1-3s + SFX + captions +
> frame-0 thumbnail, ALL mandatory, waivable by no delegation) and its
> `scripts/finalized_short_gate.py` must PASS before any short is reported finished. Added
> 2026-07-08 after a 7-clip batch shipped with no b-roll/SFX on a bad delegation.

Once topics and timestamps are locked, move to production using the **PRODUCTION REFERENCE** section at the bottom of this file. It handles:
- Layout (split-screen zones, face-cam position)
- Captions (caption1 style per `style-guide/captions.md`)
- B-roll selection and placement
- Sound effects from `assets/sfx/`
- Remotion code and MP4 rendering

The style rules for all of the above live in `style-guide/` — read them directly; don't duplicate them here.

### Production rules — apply to EVERY short (added 2026-05-23)

**1. First frame = the thumbnail. ALWAYS design it.** IG (and the other platforms) use the very first frame as the post thumbnail/cover. It MUST be an **engaging graphic with text** — a hook / open-loop that stops the scroll — never a random mid-sentence frame or a face. Build a designed opening frame (graphic + hook text) at the head of every short. Non-negotiable.

**2. Titles are click-baity open loops.** Every title creates a curiosity gap that makes the viewer *need* to know more — never a flat description. "XRP vs Kaspa" is a label; "Everyone's holding the wrong coin — here's the math" is an open loop. The title also drives the first-frame hook text.

**3. Graphical overlays must NEVER overlap each other — separate them in time AND space. Check this on every render.** Every timed graphic occupies the frame: the designed first-frame **thumbnail**, the **logo / coin reveal plate**, every **badge**, and any **callout overlay**. Two of them visible in the same moment and the same region stack into an unreadable mess. This is a repeatedly-hit bug (the thumbnail is itself an overlay and is easy to forget). Rules:
- **Nothing starts under the thumbnail.** No badge, logo-reveal, or callout may have a `tIn` before the thumbnail has fully faded (`tIn >= thumb.durS`). The small corner brand watermark is the ONLY graphic allowed over the thumbnail.
- **Co-occurring overlays get non-overlapping vertical bands.** If a logo plate and a badge must show together, stack them: logo plate at `top ~120` (~190 px tall, ends ~310), badge centered at `top >= 440`. Never both centered at `top 300`.
- **No two badges may share a time window** unless they sit in different bands.
- In the shared `LivestreamShort` component this is now partly enforced in code (badges / overlays / logo-reveal are suppressed while the thumb is up), but band-stacking and badge-vs-badge timing are still your responsibility in the data.
- **MANDATORY QA before calling a render done:** extract a frame at each overlay's `tIn`, at the thumb-to-overlay handoff (around `thumb.durS`), and anywhere two overlay windows touch; confirm no two graphics collide. Do this on every short, every time.

**4. Never flash the base video between two full-screen b-roll images.** If a full-screen b-roll ends and another begins a fraction of a second later, the viewer gets a jarring ~0.5s glimpse of the face+content base and then snaps back to full-screen. Wrong. Two options, both fine: (a) leave a **deliberate base gap of at least ~1.5s** between full-screen images so revealing the base reads as intentional (e.g. Mike pointing at the screen-share); or (b) make them **adjacent so they hard-cut** directly from one image to the next with no base between. `BrollLayer` now hard-cuts adjacent b-roll automatically (gap ≤ 0.18s). Your job in the data: do NOT leave a tiny sub-1s gap between two full-screen images — either butt them together or give real breathing room. QA: scrub every full-screen→full-screen transition.

**5. The thumbnail is the FIRST FRAME ONLY (a cover) — start playback on the face+content base.** Instagram (and TikTok) use frame 0 of the MP4 as the post cover. So the model is: **frame 0 = one designed scroll-stopping hook image; from frame 1 onward the video plays normally, STARTING on the face+content base** (Mike on cam + the screen-share). Do NOT hold a full-screen thumbnail graphic over the start for 2-3 seconds — that buries the talking-head open and makes every short start the same way. The cover frame does NOT have to be a bespoke title card: it can be a **captured frame from a strong full-screen moment elsewhere in the video** (e.g. the big reveal around 0:05) duplicated to the front, as long as it works as the hook. Design whatever sits on frame 0 as the hook that earns the scroll-stop; everything after frame 0 is the real video, base-first. _(IMPLEMENTED 2026-06-07: `LivestreamShort` now defaults `thumbDur` to ONE frame (`1/fps`), so the thumb is the frame-0 cover, NOT a held card — this is the default for every batch, no per-clip `durS` needed. The earlier "hold ~2.3s" default had silently regressed and overlaid the title on the opening captions across a whole batch; it is fixed in the component. Only pass an explicit `thumb.durS` if you deliberately want a held title card, which is normally wrong.)_

**6. Reference-image gate for named projects — MANDATORY, do this BEFORE generating any b-roll (recurring miss).** A short about a named crypto project must visibly carry THAT project's branding; it must never ship with only generic charts/coins. Before writing the b-roll prompt list for a clip:
1. Scan the clip's transcript/topic/captions for **named projects or tickers** (ElizaOS, $LAB, Pippin, Housecoin, Pengu, $TAO, $TON, Kaspa, etc.).
2. For each one, **`ls schedule-tweets/images/reference/`** (the live folder is the only source of truth — never trust a remembered list). Match by project name (`ElizaOS-ai16z.webp`, `LAB.png`, `kaspa-logo.png`, ...).
3. If a reference exists, that project's b-roll beat **MUST be generated with the reference** via `repurpose/generate-image.js --reference-image=<path>` (it supports uploads), then copied into `video-creation/assets/` with a `broll-<batch>-...png` name. The text-only batch b-roll generators (`repurpose/generate-broll-wlw.js` / `_gen-353x-redo.js`) **CANNOT attach a reference** — so any project that HAS a reference must NOT be left to them. They are only for generic/abstract scenes (candles, charts, zombies, rockets).
4. If no reference exists for a named project, either skip its logo (generic scene) or ask Mike for one and drop it in the folder — never let the model invent a fake logo, and never silently default a project short to generic b-roll.
This is the same reference rule the repurpose skill enforces for tweet/post images; it applies identically to video b-roll. (Added 2026-06-04 after an ElizaOS short shipped with a generic AI-robot instead of the `ai16z` mascot that was sitting in the reference folder.)

### Zone model (FOUNDATIONAL — catalogued in `style-guide/broll-analysis.md`)

Every short is built on the **livestream video as the base layer**. The cut clip is already 1080×1920 with two stacked zones:
- **Content Zone = upper 50%** — the livestream screen-share (browser, article, TradingView chart, project site).
- **Face Zone = lower 50%** — Mike's webcam.

Word-level captions sit in the band **at the divider** between the zones. Visuals layer ON TOP of this base; the base keeps playing wherever it isn't covered:
- **Full-screen b-roll** — generated image covers BOTH zones (entire frame).
- **Full-screen face shot** — the webcam scaled to cover both zones. *(NOT used this batch.)*
- **Content-zone b-roll** — generated image covers ONLY the content zone (upper 50%); the webcam keeps playing underneath in the face zone.
- **Graphics overlay** — code-built graphics on the content zone, or spanning both zones, over the base video.

**Never discard the video base.** "No full face shots" means do NOT blow the face up full-screen — it does NOT mean hide the face. The webcam plays in the face zone the whole time unless a full-screen b-roll deliberately covers it. An image must never sit over the entire frame for the full runtime.

### B-roll coverage budget (HALVED 2026-07-14 — was REVISED 2026-05-24)

**Do NOT blanket the base video with b-roll.** Mike's content zone (the upper-50% screen-share — charts, articles, CoinMarketCap, Google Trends, project pages) is itself valuable footage and must be visible in real stretches. Earlier batches covered it ~85–100% of the time; that was wrong.

> **⛔ HALVED BY MIKE 2026-07-14 — applies to ALL shorts going forward.** After reviewing
> `millionaires-are-made-full` (16 b-roll images / 17 beats / 66.8% coverage, which met the OLD target)
> Mike's verdict was: *"I think it's too much. Can you decrease the number of content zone b-roll? Cut it
> by half of what we're doing? This is for all future shorts going forward."* The previous target
> (~55–65% b-roll / ~35–45% base) is **superseded** by the halved numbers below. The old band is kept
> here only so nobody "restores" it from an older batch.

- **Target ~30% generated b-roll (band ~25–35%), ~70% base-video showing (band ~65–75%).** Halved from
  the old ~55–65% / ~35–45%. Leave deliberate gaps with NO b-roll image so the original content zone
  shows — especially when Mike is pointing at something on screen. **Base-showing is now the DEFAULT
  state of the clip; b-roll is the exception that earns its place on a specific beat.**
- **Image count follows the budget, roughly HALF what we were producing.** A ~75s short lands around
  **6–8 distinct images, not ~16** (the 16-image build is the anti-example). Image count is an OUTPUT of
  the budget, never a target: do not over-produce, and never pad with a 1–2 image loop.
- **Full-screen b-roll** only at the **hook, major transitions, and the climax** — **1–3x total, and that
  cap is now firm** (the 74.8s `millionaires-are-made-full` build ran 5 contiguous full-screens; that is
  over). Generated images filling the whole 1080×1920 (chatgpt-profile).
- **Content-zone b-roll is SPARING and tied to a specific talking point** — a distinct cutaway for that
  beat, then get out. Webcam visible below.
- **Graphics overlays** — code-built badges/cards over the base video. They're small and do NOT blanket the content zone, so they are *not* a substitute for revealing the screen-share.
- **No full-screen face shots this batch.**
- Reference model: trimmed `BROLL_RUG` in `remotion/src/constants-rug.ts` is ~50% base showing — that is
  now **too b-roll-heavy**; treat it as an upper bound to cut back from, not a target.

Captions: word-level (caption1 style) as standard — `style-guide/captions.md`.

---

## Source transcripts

Transcripts live in `livestream-repurpose/transcripts/`. If a new transcript needs to be added, drop it there as a `.txt` file. Use NoteGPT or equivalent for generation; the STT correction rules from the repurpose skill apply here too (Kaspa not Casper, Kaspy/Kasy/Kappy K-prefix, GhostDAG not "ghost", etc.).

---

# PRODUCTION REFERENCE

_(Merged in from the former `/create-short` skill, 2026-05-25. This is now the single canonical Video Creation skill — there is no separate installed skill file to keep in sync. Phases 1–3 above own topic-finding, clip selection, silence snapping, and captions; the sections below are the production how-to: HTML/Remotion build, b-roll, overlays, SFX, design.)_

### Step 6 — Build the HTML short

Layout for a video-driven short (1080×1920):
```
┌─────────────────────────────┐  ← 0px
│  B-ROLL ZONE (860px)        │  ← images/graphics that tell the story
├─────────────────────────────┤  ← 860px
│  divider glow line (3px)    │
├─────────────────────────────┤  ← 863px
│  CAPTION BAND (140px)       │  ← 2–4 word captions, word-by-word
├─────────────────────────────┤  ← 1003px
│                             │
│  FACE-CAM VIDEO             │  ← face-cam clip, object-fit:cover
│  (top:1003px, bottom:240px) │
│                             │
├─────────────────────────────┤  ← 1680px
│  SAFE ZONE 240px            │  ← platform UI (profile, title, etc.)
└─────────────────────────────┘  ← 1920px
```

**Persistent brand watermark:** Always add a small coin/logo in the top-left corner (z-index:300), pulsing with a glow animation. For Kaspa content this is always the Kaspa coin. This brands every frame.

```css
.brand-watermark {
  position:absolute; top:18px; left:18px;
  width:110px; height:110px; border-radius:50%;
  z-index:300;
  animation:kasGlow 2.4s ease-in-out infinite alternate;
}
@keyframes kasGlow {
  from { filter:drop-shadow(0 0 8px rgba(0,229,255,.5)); }
  to   { filter:drop-shadow(0 0 20px rgba(0,229,255,.9)) drop-shadow(0 0 40px rgba(0,229,255,.4)); }
}
```

**B-roll panel system** — panels switch on `video.currentTime`:
```html
<div class="broll">
  <div class="br-panel active" id="br-hook">...</div>
  <div class="br-panel" id="br-tyson">...</div>
  <!-- etc -->
</div>
```
```css
.br-panel { position:absolute; inset:0; opacity:0; transition:opacity .35s ease; }
.br-panel.active { opacity:1; }
```

**Timeline-driven JS engine:**
```js
const BROLL = [
  { t: 0,  panel: 'br-hook' },
  { t: 9,  panel: 'br-tyson' },
  { t: 34, panel: 'br-knockout',
    onEnter() { /* animate coins in */ },
    onLeave()  { /* reset coin classes */ }
  },
];
const CAPTIONS = [
  { t: 0,  h: 'Why would anyone want <span class="p">ETH</span> over this?' },
  { t: 9,  h: '<span class="o">Mike Tyson</span> was UNBEATABLE' },
  // ...
];

function tick() {
  const t = document.getElementById('vid').currentTime;
  // find active broll panel, switch if changed
  // find active caption, update innerHTML if changed
  requestAnimationFrame(tick);
}
document.getElementById('play-overlay').addEventListener('click', () => {
  document.getElementById('vid').play();
  document.getElementById('play-overlay').style.display = 'none';
  requestAnimationFrame(tick);
});
```

**Caption band CSS (caption1 style):**
```css
.caption-band {
  position:absolute; top:863px; left:0; right:0; height:140px;
  background:linear-gradient(180deg, rgba(0,0,0,.88) 0%, rgba(0,0,0,.97) 100%);
  display:flex; align-items:center; justify-content:center;
  padding:0 44px; z-index:20; overflow:hidden;
}
@keyframes captionBounce {
  0%   { transform: scale(0.70); }
  55%  { transform: scale(1.10); }
  100% { transform: scale(1.00); }
}
#caption {
  font-family:'Montserrat',sans-serif; font-weight:900; font-size:72px;
  color:#fff; text-transform:lowercase; text-align:center;
  letter-spacing:0.08em; line-height:1.1;
  -webkit-text-stroke:4px #000; paint-order:stroke fill;
  display:block; width:100%; white-space:nowrap;
}
#caption.bounce {
  animation: captionBounce 0.4s cubic-bezier(0.22,1,0.36,1) forwards;
}
```

**Caption JS — trigger bounce on each new caption:**
```js
function setCaption(h) {
  captionEl.innerHTML = h;
  captionEl.classList.remove('bounce');
  void captionEl.offsetWidth; // force reflow to restart animation
  captionEl.classList.add('bounce');
}
// In tick():
if (h !== lastCapHtml) { lastCapHtml = h; setCaption(h); }
```

**Important:** The `<video>` element is **NOT muted** — the face-cam audio IS the content. Always include a tap-to-play overlay because browsers block autoplay with audio.

**Caption color conventions for crypto:**
- `.g` → `#39ff14` (green = Kaspa, positive, up)
- `.o` → `#f7931a` (orange = Bitcoin)
- `.p` → `#c8b2f8` (purple = Ethereum)
- `.r` → `#ff4444` (red = danger, down, losing)

**Coin vs coin panel pattern:**
```html
<div class="br-vs">
  <div class="vs-col kas" id="vc-kas"> <!-- winner, slides from left -->
    <div class="vs-coin-img"><img src="logo-kaspa.png" /></div>
    <div class="vs-label">$KAS</div>
  </div>
  <div class="vs-arrow-col" id="va"> <div class="arr">&#9654;</div> </div>
  <div class="vs-col eth" id="vc-eth"> <!-- loser, slides from right -->
    <div class="vs-coin-img"><img src="logo-eth.png" /></div>
    <div class="vs-label">ETH</div>
  </div>
</div>
```
Animate in via JS `setTimeout` chains: winner coin first (80ms), arrow (320ms), loser coin (550ms), add `.loser` class to grey/dim loser (650ms).

---

## RENDERING TO MP4 (Remotion)

Remotion renders frame-by-frame — it seeks to every frame, screenshots it, and assembles via FFmpeg. This is deterministic and frame-accurate. Never use Playwright screen recording (real-time, prone to drift, audio sync issues).

### Project location
`video-creation/remotion/` — one Remotion project serves all shorts.

### Key config (remotion.config.ts)
```ts
import { Config } from "@remotion/cli/config";
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setConcurrency(4);
// Serve video-creation/assets/ as public dir so staticFile() resolves there
Config.setPublicDir("../assets");
```

`setPublicDir("../assets")` is only the DEFAULT public dir (legacy shorts batches that use ONLY the shared
library still rely on it). **EVERY new render OVERRIDES it per-render with `--public-dir "<batch-or-project>/render-assets"`**
so the comp loads its OWN self-contained assets — longform/persona AND shorts now both do this (see
"Asset folder organization"). Either way a public dir is required: without one, Chrome's headless shell
blocks `file://` paths with "not allowed to load local resource."

### Asset references — always use staticFile()
```ts
import { staticFile } from 'remotion';
// Rendered with --public-dir <batch-or-project>/render-assets: ALL paths are relative to that one folder.
export const SPINE = staticFile('covenants-explained.mp4');  // shorts spine (a clip's tightened.mp4, copied in)
export const DECK  = staticFile('deck/subnets.png');         // project asset
export const BROLL = staticFile('broll-kc-cov-rules.png');   // b-roll, generated straight into render-assets/
export const LOGO_KASPA = staticFile('logo-kaspa.png');      // shared singleton — COPIED into render-assets/
export const SFX_PUNCH  = staticFile('sfx/Punch 1.mp3');     // shared sfx — COPIED into render-assets/sfx/
```
The render-assets folder is self-contained: the spine, the b-roll, AND copies of the few shared SFX/logos the
comp references all live under it (the shared library is COPIED in by `scripts/setup-batch-render-assets.js`,
never junctioned — see "Asset folder organization"). The canonical shared library
(`fonts/ music/ sfx/ transitions/`, `logo-*.png`) still lives in `video-creation/assets/`; render-assets just
holds the per-batch subset. Never use absolute `C:/...` paths — they break in the headless browser.

### Video component — use OffthreadVideo, not Video
```tsx
import { OffthreadVideo } from 'remotion';

<OffthreadVideo
  src={FACE_VIDEO}
  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
/>
```
`<Video>` uses the browser's `<video>` element (can have seeking issues on long clips). `<OffthreadVideo>` uses FFmpeg to extract frames directly — more reliable for rendering.

### Sound effects — Sequence + Audio
```tsx
import { Audio, Sequence } from 'remotion';

{SOUND_EVENTS.map(e => (
  <Sequence key={e.t} from={Math.round(e.t * FPS)} durationInFrames={FPS}>
    <Audio src={e.src} />
  </Sequence>
))}
```
`<Sequence from={N}>` starts rendering its children at frame N. `<Audio>` inside plays from the start of the sequence. This fires each SFX exactly once at the right frame.

### Frame math
```ts
const FPS = 30;
const frame = useCurrentFrame();
const t = frame / FPS;  // current time in seconds
```
All timestamp-based logic (panel switches, caption lookup, state events) uses `t`. All frame-based logic (spring animations, age calculations) uses `frame` directly.

### Composition registration (src/Root.tsx)
```tsx
import { Composition } from 'remotion';
import { MikeTysonKaspa } from './MikeTysonKaspa';

export const RemotionRoot = () => (
  <Composition
    id="MikeTysonKaspa"
    component={MikeTysonKaspa}
    durationInFrames={3300}  // ~110s buffer at 30fps
    fps={30}
    width={1080}
    height={1920}
  />
);
```

### Render commands
```bash
# Quick test — 3 seconds (90 frames), fast feedback loop
npx remotion render src/index.ts MikeTysonKaspa out/test-3s.mp4 --frames=0-89 --codec=h264

# Full render
npx remotion render src/index.ts MikeTysonKaspa out/mike-tyson-kaspa.mp4 --codec=h264

# Or via npm script (defined in package.json)
npm run render:tyson
```

Render speed on this machine: ~90 frames in 8s (test), full 3300 frames in ~4–5 min at 4x concurrency.

#### GPU rendering — MANDATORY (Mike's rule, 2026-05-28)

**Always render with hardware acceleration. Never CPU-only.** This is baked into
`remotion.config.ts` via `Config.setHardwareAcceleration("if-possible")`, so the standard
`npx remotion render ...` command already uses GPU encoding (NVENC on Windows/Linux,
VideoToolbox on macOS, VA-API on Linux). It silently falls back to libx264 on a machine
without a supported GPU encoder — so there's no risk in leaving it on.

Do **NOT** remove the `setHardwareAcceleration` line from `remotion.config.ts`. Do **NOT**
pass `--hardware-acceleration=disable` to the CLI. If you're tempted to drop to CPU for
"determinism" reasons, file the concern instead and keep GPU on.

If a render fails with an encoder error, first verify the GPU encoder is available
(`ffmpeg -encoders | findstr nvenc`); do not work around it by disabling acceleration.

**GL renderer (frame rasterization) — tested 2026-06-04, NOT adopted.** `setHardwareAcceleration`
only accelerates the *encode*; the heavier part — rasterizing each frame in headless Chrome — runs
on the default GL backend (software SwiftShader). Benchmarked `--gl=angle` (GPU rasterization) vs
default on a 300-frame short: **~37s vs ~40s** — a ~7% gain that is mostly bundle/measurement noise,
because these compositions are DOM/CSS + video (layout/paint/JS bound), not GPU-rasterization bound.
ANGLE also **changed the output** (PSNR ~44 dB vs default, i.e. NOT bit-identical — font/AA edges
differ), a determinism risk Remotion itself warns about. **Do not set a GPU GL renderer.** If render
time becomes a problem, the real lever is CPU `setConcurrency` (frame paint is CPU-bound), not the
GL backend — benchmark a higher concurrency against core count instead.

**Important:** Never pipe the render command through `grep | head` — when `head` exits it closes the pipe and kills the render. Run it raw or in background.

### Captions — dangerouslySetInnerHTML for span colour tags
The CAPTIONS array stores HTML strings with `<span class="g">` etc. In React, convert class-based spans to inline style before rendering:
```tsx
const coloured = html
  .replace(/<span class="g">/g, `<span style="color:#39ff14">`)
  .replace(/<span class="o">/g, `<span style="color:#f7931a">`)
  .replace(/<span class="p">/g, `<span style="color:#c8b2f8">`)
  .replace(/<span class="r">/g, `<span style="color:#ff4444">`);

<div dangerouslySetInnerHTML={{ __html: coloured }} />
```

### Caption bounce via spring()
```tsx
const captionStartFrame = Math.round(CAPTIONS[captionIdx].t * FPS);
const age = frame - captionStartFrame;
const scale = spring({ frame: age, fps: FPS, config: { damping: 200, stiffness: 500 }, from: 0.7, to: 1.0 });
```

### Panel crossfade via interpolate()
```tsx
function panelOpacity(t: number, start: number, end: number): number {
  return interpolate(t,
    [start, start + 0.35, end - 0.35, end],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );
}
```
Each panel component calculates its own opacity and returns `null` when opacity is 0 (performance optimization).

---

## CAROUSEL / SLIDE DECK PIPELINE (Mode A)

### Input format
```json
[
  { "seq": 1, "image_path": "path/to/image.png", "slide_text": "Kevin Warsh walked into a trap." },
  ...
]
```

### Asset sourcing
- If the carousel images already exist (from the repurpose pipeline), use them as asset layers
- If they need generating, use `generate-asset.js` with a clean prompt (no baked-in text)
- Always generate a clean version WITHOUT text for images you need to composite over

### Layout
```
┌─────────────────────────────┐  ← 0px  (frame)
│  progress dots (72px)       │
├─────────────────────────────┤  ← 72px (slide starts)
│  image asset (590px)        │  ← Ken Burns zoom animation
│  + gradient fade            │
├─────────────────────────────┤  ← 662px
│                             │
│  animated text elements     │  ← each line slides up independently
│  (title, subtitle)          │
│                             │
├─────────────────────────────┤  ← 1608px (safe zone starts)
│  SAFE ZONE 240px            │
└─────────────────────────────┘  ← 1920px
```

---

## B-ROLL IMAGE GENERATION RULES

### Asset folder organization (HARD RULE — 2026-06-18, Mike; shorts moved off assets/projects 2026-06-25)
**`video-creation/assets/` is the SHARED reusable library ONLY** — `fonts/`, `music/`, `sfx/`, `transitions/`,
the `logo-*.png` singletons, and genuinely-cross-video `broll/`. The goal: **no skill ever adds PROJECT-related
assets that would LINGER/POLLUTE here.** Now uniform across tracks: **every track gets its OWN self-contained
`render-assets/` folder and renders with `--public-dir <that folder>`.**

**SHORTS → `video-creation/shorts/<batch>/render-assets/`** — the batch's OWN public dir (NOT `assets/projects/`,
NOT loose in the root — both retired 2026-06-25). It is self-contained, holding everything the comp loads:
- **spine** — each clip's `<slug>/tightened.mp4`, COPIED to `render-assets/<slug>.mp4`; reference `staticFile('<slug>.mp4')`.
- **b-roll** — generate STRAIGHT into it: `gen-batch-freshchat.js --batch=<id>` (or `generate-broll-batch.js --batch=<id>`); reference `staticFile('foo.png')`.
- **shared sfx/logos** — COPIED in (NOT junctioned) by `scripts/setup-batch-render-assets.js <batch> --data <dataFile>`, which copies every `staticFile('X')` the comp references from `assets/X` → `render-assets/X`. Reference unchanged (`staticFile('sfx/Foo.wav')`, `staticFile('logo-kaspa.png')`).

⛔ **Never junction the shared library into `render-assets/`** — cleanup recycles the WHOLE `shorts/<batch>/` folder
via recursive `DeleteDirectory`, which would FOLLOW the junction and recycle the real `assets/` library. Copies
are transient and recycled harmlessly with the batch. Run: `node scripts/setup-batch-render-assets.js <batch> [--data <dataFile.ts>]`,
then render with `--public-dir video-creation/shorts/<batch>/render-assets`.

**LONGFORM / PERSONA / livestream / repurpose → the PROJECT'S OWN folder** (the bittensor pattern):
```
video-creation/longform-edited/media/<project>/   (or vertical-ai-persona/<project>/, etc.)
  assets/         ← source assets (downloaded/generated b-roll, images, audio)
  render-assets/  ← render-ready assets the comp loads (spine, music, deck/, img/, vid/)
```
Render with the project's OWN public dir: `--public-dir "<project>/render-assets"`, `asset()` = `staticFile(f)`.
Generate b-roll with `gen-batch-freshchat.js --outdir <project>/assets` (NOT `--batch`). (Worked example:
bittensor `BittensorCh1to6`.) `gen-batch-freshchat.js` and `generate-broll-batch.js` both hard-refuse any b-roll
write under `video-creation/assets/`.

(LEGACY: shorts batches created before 2026-06-25 reference `staticFile('projects/<batch>/…')` / loose root
b-roll and render against the default `../assets` public dir. Leave them as-is; cleanup ages them out. Only NEW
batches use `render-assets/`.)

### Full-screen B-roll vs. transparent overlays
Two distinct categories — generate and use them differently:

**Full-screen B-roll** (opaque, replaces the entire frame):
- Generated via ChatGPT as 9:16 vertical images
- Covers both content zone AND face zone when active
- Generated with dramatic dark backgrounds, no transparency needed

**Transparent overlays** (PNG with alpha, composited over live video):
- **DO NOT prompt ChatGPT for a "transparent background"** — verified 2026-05-25 that it bakes a *painted checkerboard pattern* into a flat RGB image (and ghosts the subject); the captured PNG has NO real alpha. Unusable.
- **Working method — glow-on-black → alpha-from-luminance:** generate the subject *"brightly glowing and fully opaque, centered, on a PURE SOLID BLACK (#000000) background and nothing else, no checkerboard."* Then convert to true alpha with Pillow: `alpha = luminance` (boosted, e.g. `lum.point(lambda v: 0 if v<12 else min(255, int(v*1.8)))`), keep RGB, `putalpha`. Black → transparent, glowing subject → opaque, glow feathers out. See `_make_overlays_alpha.py`. This yields a real RGBA PNG that composites with a normal `<Img>` (no blend-mode needed). Ideal for glowing crypto elements (coins, arrows, gems).
- (Alternative for glowing elements: composite the on-black PNG with `mix-blend-mode: screen` — but in a layered Remotion comp a z-indexed wrapper isolates the blend, so prefer the alpha-from-luminance conversion above.)
- Use for: coin badges, meme characters, arrows pointing at chart features, sticker-style callouts — anything that floats over the content rather than replacing it.
- Position as absolutely-placed `<Img>` over the content zone, animated in/out (fade + spring pop), with a subtle teal `drop-shadow` for extra glow.
- For text-based graphics (price targets, coin names, countdowns): build natively in Remotion as styled divs — sharper, easier to edit. Never bake text into a ChatGPT image if you'll need to edit it later.

### No duplicate b-roll across same-topic shorts (HARD RULE, added 2026-06-03)
When you cut **several shorts from the same topic** (e.g. a short / medium / long edit of one
moment, or multiple angles of one story), **every clip gets its own unique b-roll AND overlays.**
Do NOT reuse the same generated image file across two clips in the batch just because the
narrative beat repeats (rocket, bear, gem, "beautiful curve", etc.). The viewer often sees these
back-to-back in a feed, and recycled imagery makes the set look lazy and cheap.
- Generate a distinct visual treatment of the repeated concept for each clip (different
  composition / angle / palette accent), with its own filename (e.g. `broll-<topic>-m-bear.png`
  for the medium, `broll-<topic>-l-bear.png` for the long).
- This also applies *within* a single clip: don't reuse one image for two separate beats — give
  each beat its own asset.
- Pair the full-screen b-roll with at least one **real transparent image overlay** (alpha PNG,
  see below) per clip, not only code-drawn Remotion badges/plates.

### Coin branding accuracy
When generating an image that features a specific coin, use that coin's actual visual identity:
- **Kaspa**: teal/cyan glow, "K" letterform. Color: `#00e5ff`
- **Solana**: three diagonal gradient bars (purple → teal/green), parallelogram pattern
- **URANUS**: Solana token (Jupiter Swap mascot) — use Solana logo, NOT Kaspa branding
- **Bitcoin**: orange, ₿ symbol
- **Ethereum**: purple, diamond/crystal shape

### A/V sync rule (critical — from hard experience)
NEVER use `-c copy` when splicing segments from different timestamps of a source file. Audio/video keyframes drift at splice points.
**Always re-encode each segment:**
```bash
ffmpeg -ss START -i src.mp4 -t DURATION -c:v libx264 -preset fast -crf 20 -c:a aac -avoid_negative_ts make_zero seg.mp4
```
Then concatenate the re-encoded segments with `-c copy` (safe because all segments have clean timestamps starting from 0).
`cut-silences.py` is exempt — it uses the FFmpeg `select` filter (one-pass, no splicing), so it's sync-safe.

### Full-livestream clip pipeline (new — 2026-05-20)
For a full vertical livestream (not just a single clip segment):
1. **Transcribe full video** with word-level timestamps:
   ```powershell
   python -m whisper "video.mp4" --model small --word_timestamps True --output_format json --output_dir "dir/"
   ```
   Outputs JSON with per-word `start`/`end` times. Also generate `transcript_plain.txt` and `transcript_words.txt` from the JSON using a parse script.

2. **Extract topics with the CHUNK METHOD** (90s windows → tag → group by topic across the stream) → `topics.md`. See **TOPIC EXTRACTION — CHUNK METHOD** in Step 1 above. Never pick topics by reading the transcript as one blob — it misses recurring topics.

3. **Cut topic clips** using word-level phrase search (`cut_clips.py`):
   - `find_phrase_start(phrase, after=Ns)` → exact start timestamp of first word
   - `find_phrase_end(phrase, after=Ns)` → exact end timestamp of last word
   - Re-encode every segment at cut time (never copy) — see A/V sync rule above

4. **Editorial edits** (`edit_clips.py`): cherry-pick best sub-segments, concatenate with re-encode

5. **Silence removal**: `cut-silences.py` on each clip. Typical removal: 20–40% of duration

6. **B-roll generation**: `generate-broll-batch.js` (one Chrome session for all images)

7. **Remotion**: overlay B-roll and captions on top of the silence-cut clips

---

## MIKE'S TOKEN HOLDINGS (important for image/content accuracy)

| Token | Network | Notes |
|---|---|---|
| Kaspa (KAS) | Kaspa (PoW L1) | #1 conviction. Teal brand color. |
| TAO (Bittensor) | Bittensor | AI all-in-one play. τ symbol. |
| URANUS | Solana | **Mike's favorite meme.** Mascot of Jupiter Swap. Use Solana logo (purple→teal gradient bars), NOT Kaspa. |
| Housecoin | KRC20 (Kaspa) | Long-term meme hold. House/home imagery. |
| PEANUT (PNUT) | — | Squirrel/peanut themed. Swing trade. |
| MOTHER (Iggy Azalea) | — | Celebrity token. Pink/gold aesthetic. |
| Bitcoin | Bitcoin | Reference asset. Orange. |

---

## STYLE GUIDE (from analysis of 4 crypto short-form videos)

### Layout patterns
- **Split-screen is standard:** face in one zone (40%), b-roll in another (60%), hard dividing line
- **B-roll switches every 1–3 seconds** — never static
- **Full-screen breaks:** 1–3 times per video for maximum-impact moments (coin reveal, title card, climax)

### Captions
- 2–4 words per caption, word-by-word or short phrase pacing
- Position: **middle band** between face and b-roll — never overlapping either zone
- Never more than one short phrase on screen at once
- Captions: canonical skill `captions/captions.md` (the `montserrat` preset = the old caption1: Montserrat Black, bounce). Build with `captions/build_captions.py --style montserrat`

### Hook structure (first 3 seconds — pick one)
1. Name drop + contradiction: "I listened to Michael Saylor... he says crypto more than Bitcoin now"
2. Number first: "If this hits $2B market cap, my community does a 2000x"
3. Cinematic title card: full-screen dramatic image + bold title before dropping into talking head
4. Bold claim: "$3 Kaspa is realistic. Here's the math."

### B-roll types used
- CoinMarketCap / chart screen recordings (credibility)
- AI-generated art (Pixar 3D, cinematic renders, anime)
- Meme images (Stonks, The Rock, reaction faces)
- Logo/coin animations
- Abstract motion (flash, fade-to-black, glitch)
- Stick figures / 2D vector animations

### Transitions
- Hard cuts: 95% of all transitions
- Flash/glow (once per video) for dramatic beats
- Fade-to-black for pause/emphasis — NOT as a generic transition
- No dissolves or wipes

### CTA pattern (last 5–8 seconds)
- "Link in Description" with red down-arrow graphic
- Verbal + visual CTA match
- "Buy now / get in early" language

---

## Frame Layout — Safe Zone Rule

```
Total frame: 1920px tall
Progress/header: 72px (carousel mode only)
Content zone: 72–1680px
Safe zone: 1680–1920px (240px — platform UI: profile, caption, title, buttons)
Right edge: rightmost 90px reserved for action buttons
```

**Never place text or graphics with bottom edge below 1680px.**
In CSS: `bottom` values must be `≥ 240px`.

---

## Design System

**Brand colors:**
- Kaspa: `#39ff14` (neon green) / `#00e5ff` (teal/cyan)
- Bitcoin: `#f7931a` (orange)
- Ethereum: `#c8b2f8` (lavender purple)
- Danger/red: `#ff4444` / `#ff3b3b`
- Background: `#000` to `#080808`

**Typography:**
- **Captions (caption1):** `font-family:'Montserrat',sans-serif; font-weight:900; font-size:72px; text-transform:lowercase; letter-spacing:0.08em; color:#fff; -webkit-text-stroke:4px #000; paint-order:stroke fill; white-space:nowrap`
- **B-roll headlines / labels:** `font-family:'Impact','Arial Black',sans-serif; font-weight:900; text-transform:uppercase`
- Headline sizes: 60–185px
- Text shadow for depth: `3px 3px 0 rgba(0,0,0,.85)`
- Neon glow: `text-shadow: 0 0 20px rgba(57,255,20,.6)`
- Load Montserrat from Google Fonts: `<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@900&display=swap" rel="stylesheet">`

**Coin circle pattern (CSS, no image):**
```css
.coin-circle {
  width:240px; height:240px; border-radius:50%;
  background:radial-gradient(circle at 35% 30%, #light, #mid 50%, #dark);
  box-shadow: 0 0 60px var(--glow), inset 0 5px 15px rgba(255,255,255,.35);
  border: 5px solid var(--border);
}
```

---

## Tools & Scripts

### Image generation — paths, profile, gotchas (corrected 2026-05-25)
- **Scripts live in `C:\Users\mnede\Documents\Claude\social-media\repurpose\`** (NOT `Claude\repurpose\` — that path is stale): `generate-asset.js`, `generate-broll-batch.js`, `generate-image.js`, etc.
- **Playwright is installed only in `social-media\repurpose\node_modules`.** To run a generator that lives elsewhere (e.g. the in-project `video-creation\generate-broll-batch.js`), set `$env:NODE_PATH = "C:\Users\mnede\Documents\Claude\social-media\repurpose\node_modules"` before `node`.
- **Use the `chatgpt-profile` Chrome profile, NOT `xbot-profile`.** `xbot-profile` is used for X posting and is usually already open → `launchPersistentContext` fails with "Target page/context/browser has been closed" (profile lock). The in-project `video-creation\generate-broll-batch.js` had `xbot-profile` hardcoded — fixed to `chatgpt-profile`.
- **B-roll chat URL** (route prompts here): `https://chatgpt.com/c/6a0deddf-1bac-83ea-8107-0e419a2c44ac`. ~25–30s per image.
- **One Chrome session per batch.** Put EVERY image you need in the one `IMAGES` array and run once — don't open/close Chrome repeatedly. Verify outputs are good (incl. transparency) BEFORE closing, so a re-do reuses the session.

```powershell
# in-project batch (edit the IMAGES array at the top first; skips files that already exist):
$env:NODE_PATH = "C:\Users\mnede\Documents\Claude\social-media\repurpose\node_modules"
node "C:\Users\mnede\Documents\Claude\social-media\video-creation\generate-broll-batch.js"
```
`generate-asset.js` does a single image: `node generate-asset.js --output="..." --prompt="..." [--chat-url="..."]`.

### cut-silences.py
Location: `C:\Users\mnede\Documents\Claude\social-media\video-creation\cut-silences.py`
```powershell
python cut-silences.py --input facecam.mp4 --output facecam-cut.mp4 "--noise=-32dB" --duration 0.35
```
Note: quote the noise arg as `"--noise=-32dB"` in PowerShell (negative number issue).
Outputs a `.timemap.txt` for recalibrating b-roll cues.

> **SUPERSEDED (2026-05-23):** This simple −32 dB single-threshold approach is NOT the canonical silence method. A word's decaying tail stays audible to ~−55 dB, so −32 dB chops tails. Use the validated **snap-to-silence dual-threshold detector in Phase 5B** instead (silence < −57 dBFS, audio > −52 dBFS, 250 ms min, NO pad; implemented in `livestream-repurpose/apply_silence_all.py`). Keep this entry only for legacy reference.

### watch.py (the /watch skill)
For a specific section of a long video:
```bash
python "C:/Users/mnede/.claude/skills/watch/scripts/watch.py" "video.mp4" --start 41:15 --end 43:30 --no-whisper
```
Use `--no-whisper` because local Whisper is preferred over the API. Transcribe separately:
```powershell
python -m whisper "clip.mp3" --model small --output_format txt
```
**Encoding gotcha:** The watch script crashes on Windows with emoji/unicode filenames — copy the video to a clean ASCII name first.

### Whisper word-level caption generation

The goal is every spoken word on screen, grouped into natural 2–4 word phrases. Do NOT hand-write captions — always transcribe with Whisper and group programmatically.

**Step 1 — Transcribe with word timestamps:**
```powershell
python -m whisper "facecam-cut.mp4" --model small --output_format json --word_timestamps True --output_dir "path/to/assets/"
```

**Step 2 — Generate the CAPTIONS array:**
```python
import json

with open('facecam-cut.json') as f:
    data = json.load(f)

words = []
for seg in data['segments']:
    for w in seg.get('words', []):
        words.append({'word': w['word'].strip(), 'start': w['start'], 'end': w['end']})

SHORT = 4  # chars threshold for "small word"

def is_short(w):
    return len(w.strip(".,!?'")) <= SHORT

def colorize(word):
    clean = word.lower().strip('.,!?')
    GREEN  = {'kaspa', 'buster', 'douglas'}
    ORANGE = {'bitcoin', 'tyson', 'mike'}
    PURPLE = {'eth', 'ethereum'}
    RED    = {'knocked', 'knockout', 'down', 'lost'}
    if clean in GREEN:  return f'<span class="g">{word}</span>'
    if clean in ORANGE: return f'<span class="o">{word}</span>'
    if clean in PURPLE: return f'<span class="p">{word}</span>'
    if clean in RED:    return f'<span class="r">{word}</span>'
    return word

groups = []
current = []
current_start = None

for i, w in enumerate(words):
    if not current:
        current = [w]; current_start = w['start']; continue
    gap = w['start'] - words[i-1]['end']
    all_short = all(is_short(x['word']) for x in current + [w])
    max_words = 4 if all_short else 3
    if gap > 0.18 or len(current) >= max_words:
        groups.append((current_start, current))
        current = [w]; current_start = w['start']
    else:
        current.append(w)
if current:
    groups.append((current_start, current))

for t, grp in groups:
    html = ' '.join(colorize(w['word']) for w in grp)
    print(f"  {{ t: {t:7.2f}, h: '{html}' }},")
```

**Grouping rules:**
- Break on pause gap > 0.18s OR hitting the word limit
- Max 3 words normally; max 4 if ALL words in the group are ≤ 4 chars (short function words)
- Whisper sometimes mishears brand names — always check and fix manually (e.g. "Casper" → `<span class="g">kaspa</span>`)
- Color-code key terms using spans (update the GREEN/ORANGE/PURPLE/RED sets per video topic)

---

## QUALITY BENCHMARKS (averages from 4 sample crypto shorts)

Use these as targets when building a new short. Compare your video against them before delivering.

| Metric | Target average | Notes |
|---|---|---|
| Duration | ~40s | Anything over 60s risks drop-off; the Mike Tyson video at 107s is too long as a rule |
| B-roll scenes (content zone) | ~7–8 | Panel changes, not just b-roll variety |
| B-roll change rate | 1 per 5–6s | Never static for more than ~6s |
| Full-screen b-roll moments | 1–2 × ~2s | Opening intro OR single dramatic beat |
| Full-screen face moments | 0–1 × ~1s | Peak emotional payoff only |
| Overlays on face zone | ~2 | Coin badges, sparkle effects, reaction clips |
| Overlays on content zone | ~5 | Memes, text graphics, arrows, banners over screen share |
| Total overlay events | ~8 | ~1 event every 2–3s at peak density |
| Caption color coding | White + accent | At minimum code the key money/coin terms |

**Screen share content:** CoinMarketCap charts appear in 3/4 sample videos. Adding even one CMC panel gives instant credibility. Generate via ChatGPT if no real screenshot is available (see Chart Panel below).

---

## SPECIAL STATE EVENTS

Beyond b-roll panel switches, the tick loop drives three additional visual states.

### Full-screen b-roll
```js
const FULLBROLL_EVENTS = [{ start: 32.04, end: 33.54 }]; // 1.5s
```
```css
.frame.fullbroll .broll    { height:1680px; z-index:30; }
.frame.fullbroll .divider  { opacity:0; }
.frame.fullbroll .facecam  { opacity:0; }
.frame.fullbroll .caption-band { top:auto !important; bottom:260px; background:transparent; z-index:40; }
```
Use for: dramatic panel entries, title card beats, opening intro.

### Full-screen face
```js
const FULLFACE_EVENTS = [{ start: 46.90, end: 48.90 }]; // 2s
```
```css
.frame.fullface .broll    { opacity:0; pointer-events:none; }
.frame.fullface .divider  { opacity:0; }
.frame.fullface .facecam  { top:0; }
.frame.fullface .caption-band { top:auto !important; bottom:300px; background:transparent; z-index:40; }
```
Use for: emotional peak / punchline payoff. Once per video maximum.

### Face-zone overlay
```js
const FACE_OVERLAY_EVENTS = [{ start: 20.98, end: 23.00, id: 'face-btc-badge' }];
```
```html
<div class="face-btc-badge" id="face-btc-badge">
  <div class="btc-coin"><img src="../../assets/logo-btc.png" /></div>
</div>
```
```css
.face-btc-badge {
  position:absolute; top:1003px; left:0; right:0; bottom:240px;
  display:flex; align-items:center; justify-content:center;
  z-index:150; pointer-events:none;
  opacity:0; transition:opacity .3s ease;
}
.face-btc-badge.show { opacity:1; }
```
Use for: coin badge flash when a token is named, sparkle/arrow effects when a price is mentioned.

### Wiring all three into tick()
```js
frame.classList.toggle('fullbroll', FULLBROLL_EVENTS.some(e => t >= e.start && t < e.end));
frame.classList.toggle('fullface',  FULLFACE_EVENTS.some(e  => t >= e.start && t < e.end));
FACE_OVERLAY_EVENTS.forEach(e => {
  document.getElementById(e.id)?.classList.toggle('show', t >= e.start && t < e.end);
});
```

---

## SOUND EFFECTS SYSTEM

### SFX library location
`C:\Users\mnede\Documents\Claude\social-media\video-creation\assets\sfx\`

**Curation rules:**
- SFX only — no music tracks. Delete anything that is a full song, ambient loop, or jingle.
- Size check: files > 5MB are almost always music, not SFX. Files > 2MB are suspect — check the name carefully.
- Subdirs: `ding/` (comedy/meme hits), `ding/swipe/` (swipe transitions), `ding/slide/` (slide transitions), `ding/glitch/` (glitch effects).

**Adding new SFX from Premiere Pro projects:**
Parse `.prproj` files (gzipped XML) with Node.js:
```js
const xml = zlib.gunzipSync(fs.readFileSync('project.prproj')).toString('utf8');
const re  = /[A-Za-z][^<>"'\n\r\t]{2,200}?\.(mp3|wav|aiff|aif|m4a)/gi;
```
Resolve each path against the project folder. Skip files already in sfx/ (case-insensitive). Skip music with: `/instrumental|soundtrack|background|ambient|rock.logo|short.mix/i`.

**Key SFX already in library (as of May 2026):**
- Impact/punch: `Punch 1.mp3`, `Punch 2.mp3`, `Punch Sound Effect Gaming SFX.mp3`, `Boom - Big Reveal.wav`, `Boom 2.wav`
- Transitions: `Cinematic Whoosh 02.wav`, `Cinematic Whoosh 06.wav`, `Fast whoosh.wav`, `Whoosh 1/4/5.mp3`, `transition_rapid_whoosh.mp3`, `ding/slide/slide1-12.mp3`, `ding/swipe/swipe1-3.mp3`
- Money/win: `Cash Register.mp3`, `Cash Register Kaching Sound Effect HD.mp3`, `TING SOUND EFFECT.mp3`
- Shock/reaction: `WAIT WHAT SOUND EFFECT.mp3`, `BRUH - Sound Effect.mp3`, `WOW Sound Effect Free Audio Extracted.wav`, `ding/sudden-shock.mp3`, `ding/dramatic-shocked-sfxshocked.mp3`
- Meme: `ding/inception-horns.mp3`, `MGS Alert.mp3`, `Record Scratch 2.mp3`, `ding/drum-roll.mp3`

### Wiring SFX into the tick loop
```js
const SOUND_EVENTS = [
  { t:  0.00, src: '../../assets/sfx/Riser Sound Effect.mp3' },
  { t: 12.64, src: '../../assets/sfx/TING SOUND EFFECT.mp3' },
  // ...
];

const _sfxCache = {};
SOUND_EVENTS.forEach(e => {
  const a = new Audio(e.src); a.preload = 'auto'; _sfxCache[e.src] = a;
});
const _firedSfx = new Set();

// In tick():
SOUND_EVENTS.forEach(e => {
  const key = String(e.t);
  if (t >= e.t && t < e.t + 0.5 && !_firedSfx.has(key)) {
    _firedSfx.add(key);
    const a = _sfxCache[e.src];
    if (a) { a.currentTime = 0; a.play().catch(() => {}); }
  }
});

// After play-overlay click handler — reset fired sounds on seek:
document.getElementById('vid').addEventListener('seeked', () => {
  const ct = document.getElementById('vid').currentTime;
  for (const key of [..._firedSfx]) {
    if (parseFloat(key) > ct) _firedSfx.delete(key);
  }
});
```

**Suggested SFX mapping by moment type:**
| Moment | Sound |
|---|---|
| Hook opener | `Riser Sound Effect.mp3` |
| Token/coin panel appears | `TING SOUND EFFECT.mp3` (boxing bell / ding) |
| "that's Bitcoin / money" mention | `Cash Register.mp3` |
| Dramatic reveal / full-screen b-roll | `Boom - Big Reveal.wav` |
| Impact / knockout | `Punch 1.mp3` |
| "holy crap" / shock moment | `WAIT WHAT SOUND EFFECT.mp3` |
| Panel transition | `Cinematic Whoosh 02.wav` |
| Chart / opportunity appears | `Cash Register Kaching Sound Effect HD.mp3` |
| Winner coin reveal | `ding/ding.mp3` or `TING SOUND EFFECT.mp3` |

---

## CHART PANEL (screen share content)

CoinMarketCap charts add credibility. To generate one via ChatGPT when no real screenshot exists:

```powershell
cd "C:\Users\mnede\Documents\Claude\repurpose"
node generate-asset.js --output="C:\...\assets\kas-chart.png" --prompt="Professional dark-mode cryptocurrency price chart for [COIN]. Pure black background. [COLOR] price line graph. 90 days of price data. Current price label in white. Clean CoinGecko/CoinMarketCap dark UI style. No logos. Landscape 16:9."
```

HTML panel structure:
```html
<div class="br-panel br-img" id="br-chart">
  <div class="br-chart-wrap">
    <img class="fullbleed" src="../../assets/kas-chart.png" />
    <div class="chart-overlay">
      <div class="chart-kas-badge"><img src="../../assets/logo-kaspa.png" /></div>
      <div class="chart-target-label">$3 <span>target</span></div>
      <div class="chart-arrow-up">↑</div>
    </div>
  </div>
</div>
```
```css
.br-chart-wrap { position:relative; width:100%; height:100%; }
.br-chart-wrap img.fullbleed { width:100%; height:100%; object-fit:cover; }
.chart-overlay {
  position:absolute; bottom:0; left:0; right:0;
  background:linear-gradient(180deg, transparent 0%, rgba(0,0,0,.92) 55%);
  padding:22px 36px 30px; display:flex; align-items:center; gap:22px;
}
.chart-target-label { font-size:88px; font-weight:900; color:#39ff14; }
.chart-arrow-up { font-size:96px; color:#39ff14; margin-left:auto; animation:arrowFloat .7s ease-in-out infinite alternate; }
@keyframes arrowFloat { from{transform:translateY(0)} to{transform:translateY(-14px)} }
```

---

## Checklist Before Delivering

- [ ] Safe zone: no content below `bottom:240px`  
- [ ] Persistent brand watermark visible on every frame
- [ ] Face-cam video NOT muted (audio is the content)
- [ ] Play overlay included (browsers block autoplay with audio)
- [ ] B-roll cue times calibrated to the silence-CUT video (not original)
- [ ] Captions readable: 2–4 words, high contrast, middle band position
- [ ] Asset paths are relative from the HTML file location
- [ ] Kaspa logo visible throughout for Kaspa-related content
- [ ] Duration target: ~40s (trim the face-cam clip if needed, not just the HTML)
- [ ] Quality check against benchmarks: ~8 overlays, ~7 b-roll scenes, ≥1 full-screen moment
- [ ] Sound effects wired via SOUND_EVENTS — at minimum: hook opener, panel transitions, money/win moments
- [ ] No music files in `assets/sfx/` — SFX only, delete anything > 5MB with a music-style name
