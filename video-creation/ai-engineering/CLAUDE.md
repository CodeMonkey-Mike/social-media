# ai-engineering — routing (auto-loaded when working in this folder)

_Thin pointer for the **AI Engineering Simplified** YouTube channel
([@aiEngineeringSimplified](https://www.youtube.com/@aiEngineeringSimplified)). This channel **inherits the
`longform-edited` track wholesale** and overrides only a few things. **Do not duplicate rules here** — the
canonical skills own them and win on conflict. Repo-root `CLAUDE.md` philosophy: "this file points, it does
not duplicate."_

## What this channel is (the brief owns the detail)

- **Canonical brief:** `ai_channel_plan.md` (this folder) — identity, the four-arc backbone, topic clusters,
  and the "explain, then build" format. **Python-for-JS backlog:** `python_series.md` (this folder).
- **Audience/register:** clear, authoritative explanations for engineers who want to build. Peer-EXPERT,
  conversational, confident.
- ⛔ **ON-SCREEN AUTHORITY (hard rule, Mike, 2026-07-01, full text in `ai_channel_plan.md`):** never frame
  yourself on camera as a co-beginner ("I'm learning this too"). Empathy for what's confusing is fine;
  confessing your own confusion is not.
- ⛔ **Accuracy gate (mandatory, pre-VO):** every script passes `video-creation/skills/accuracy-pass/accuracy-pass.md`
  BEFORE any voice generation. This ecosystem moves in months; authority is only earned if the facts are
  current. Anthropic/Claude specifics defer to the `claude-api` skill.

## Production = longform-edited, but lighter (inherit, don't fork)

This channel runs on the **`longform-edited` track** (`../longform-edited/`) as its base pipeline — same
`compress → transcribe → defumble → desilence` spine, same container/chart/QA discipline — but skips the
heavy per-video structural build-out (mandatory EDIT-PLAN/CUE-SHEET/system-design manifest) the main channel
requires. These are explainer/tutorial videos, not heavily-art-directed hype pieces. Full rationale +
what-carries-over / what's-dialed-back is in `ai_channel_plan.md` § "Production approach".

**Read the canonical longform-edited skills directly — they are the source of truth:**

| You are… | Read first (canonical, in `../longform-edited/`) |
|---|---|
| Building the CSS containers / slides / charts (the deck) | **`skills/deck-and-containers.md`** (this folder — thin inherit) → `../longform-edited/skills/broll-and-containers.md` + `../longform-edited/skills/container-reference/` |
| Assembling the explainer VIDEO (Remotion: containers + VO → mp4) | **`skills/remotion-explainer-build.md`** (this folder — SELF-CONTAINED; comp + timeline/stitch + segmented render + music mux; copyable templates in `skills/remotion-explainer-build/`). ⛔ Do NOT copy the method from another `media/<project>/`. |
| Styling a data chart / graph | `../longform-edited/skills/charts.md` (+ `presentation.md` for the HTML look) |
| Writing/outlining a video's script | `../longform-edited/screenplay.md` |
| Capturing the MIKE-CLONE voice | `../skills/higgsfield-voice/` — see the **Voice capture flow** below (batch driver already exists; don't hand-roll it) |
| Rendering QA | `../longform-edited/skills/video-qa.md` |

## Voice capture flow (MIKE-CLONE, Seed Speech) — the batch driver ALREADY EXISTS

These videos are pure MIKE-CLONE VO. Higgsfield has **no TTS API** — the Audio tab is UI-only, driven with
Playwright over CDP. **The batch generator is already built — use it, do not hand-roll per-chunk clicking.**
Canonical skill: `../skills/higgsfield-voice/SKILL.md`. Steps:

1. **Build `media/<video>/tts-chunks.json` STRICTLY from the final `SCRIPT.md`.** ⛔ **Never hand-author or
   copy chunk text from memory / an earlier draft** — extract each chunk's spoken lines verbatim from the
   current `SCRIPT.md` (the `> ` blockquote lines under each `**Chunk N**`), then apply ONLY pronunciation
   spellings + the caps rule (short-word ALL-CAPS clips; see the skill's pronunciation map). Format: a JSON
   array of `{ "file": "chunk-NN.mp3", "text": "..." }`. **(2026-07-16: authoring from a stale draft voiced
   10 chunks with wrong text and burned credits — the gate in step 4 now blocks that.)**
1b. **GATE — prove it matches before generating:** `node video-creation/skills/higgsfield-voice/verify-tts.js
   media/<video>/SCRIPT.md media/<video>/tts-chunks.json` must print `ALL N chunks MATCH` (exit 0). This is
   also run automatically inside the batch driver when you pass `SCRIPT.md` (step 4) — do that; it aborts
   before spending any credits on a mismatch.
2. **Launch the logged-in `hfbot-profile` Chrome with the debug port** (the batch driver attaches over CDP,
   it does not launch): `chrome.exe --user-data-dir="C:\Users\mnede\AppData\Local\Google\Chrome\hfbot-profile"
   --remote-debugging-port=9333 https://higgsfield.ai/`. The profile stays logged in; only re-auth once if it
   shows logged out.
3. **In the Audio UI: model = Seed Speech, voice preset = MIKE-CLONE** (helpers: `_set-voice.js` /
   `_open-preset.js` / `_select-mike.js`). The batch driver **aborts if the selected voice isn't MIKE-CLONE**.
4. **Run the batch WITH the SCRIPT.md gate arg:** `node video-creation/skills/higgsfield-voice/_batch-generate.js
   <tts-chunks.json> <audioDir> <SCRIPT.md>` — the 3rd arg makes the driver re-run the verify gate and
   **abort before touching the browser if any chunk drifts from the script** (no wasted credits). It then
   fills + GENERATEs each chunk, writes `<audioDir>/_manifest.json` incrementally (`[{file, ok, url}]`), and
   captures the `hf_*.mp3` cloudfront URLs (does NOT download). Omitting the 3rd arg prints a WARNING and
   skips the gate — don't.
5. **Download + QA against `SCRIPT.md` (NOT tts-chunks.json):** `curl` each manifest URL into `<audioDir>/`,
   then whisper-QA every take **against the canonical `SCRIPT.md`** — comparing to `tts-chunks.json` only
   proves the audio matches the thing that was already gated; the reference of record is `SCRIPT.md`. A
   clipped/garbled word shows up as a wrong transcription; re-roll only the failed chunk.
   ⚠️ Generation **spends Higgsfield credits** — get Mike's OK before a batch (root `CLAUDE.md` cost rule).

## Channel-local skills (`skills/`) — overrides only, thin pointers

Anything that is **identical** to longform-edited is used **by reference, not copied** (copies drift). A
channel-local skill exists only to record the small deltas for this channel and then point at the canonical
file. Today:
- **`skills/deck-and-containers.md`** — inherits `longform-edited/skills/broll-and-containers.md` +
  `container-reference/` + `charts.md`; records the ai-engineering deltas (full-frame code-card containers,
  no face spine, one `#cNN` container per script chunk, render via the project `scripts/render-containers.js`).

If a future need is genuinely channel-specific, add a thin `skills/<name>.md` that states the delta and points
at its canonical parent. Never re-derive a rule that already lives in longform-edited.

## Per-video folder structure (follow the longform-edited convention)

Each video is `media/<Video Title>/` and carries:
- **Script docs:** `OUTLINE.md` · `SCRIPT.md` (+ any long-cut) · `tts-chunks.json` (built after script approval)
- **`deck/`** — `containers.html` (one full-frame `#cNN` container per chunk; the 16:9 deck) and later
  `containers-vertical.html` for a 9:16 repurpose.
- **`render-assets/`** — the rendered `container-NN.png` PNGs (@2x = 3840×2160), plus `music/`, `vertical/`.
- **`scripts/`** — `render-containers.js` (Playwright screenshotter, `#cNN` → `render-assets/container-NN.png`).
- **`PROJECT-LOG.md`** — the resume/status log for the video.
- The master / `LOW BPS` / draft / final mp4s + thumbnail as they're produced.

`need lang-graph/` is the worked precedent for this exact layout; copy its shape.

## Non-negotiables (canonical copies cited above — do not violate)

- **No em dashes** anywhere on-screen or in titles/captions (persona rule).
- **Accuracy pass before VO**, every script (see above).
- **Containers built standalone full-frame** (`container-reference/` locked CSS), never cropped from a deck;
  QA every rendered PNG with the `visual-qa` agent before it's used.
- **Defumble / desilence only via the canonical shared skills** (`../skills/defumbler/`, `../skills/desilencer/`).
- **Higgsfield MIKE-CLONE voice:** ALL-CAPS emphasis only on 5+ letter content words (short-word caps clip —
  see `../skills/higgsfield-voice/`).
