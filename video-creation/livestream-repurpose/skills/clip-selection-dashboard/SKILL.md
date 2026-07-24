# Clip selection + review dashboard (Phases 4 + 4b) (livestream-repurpose track skill - CANONICAL)

_Moved VERBATIM from `video-creation/SKILL.md` on 2026-07-08 (Mike: per-track skills live in the track folder; this predates that convention). **This file is now canonical**; the master SKILL.md keeps a pointer stub and the phase-map table points here. Paths inside are written relative to `video-creation/` exactly as in the original._

## Phase 4 — Clip selection and timestamp definition

Once topics are chosen, define precise in/out timestamps for every clip that will be used.

- Use the transcript word-level timestamps where available (Whisper output). If only paragraph-level timestamps exist, estimate from surrounding context.
- For multi-snippet topics, list clips in the order they'll appear in the short — this doesn't have to match their order in the livestream.
- Flag any segment where Mike's energy drops or he's distracted (chat tangents, technical difficulties) so those seconds can be cut even if the words are relevant.
- **Length follows the moment — there is no fixed minimum.** A *punch* (one self-contained killer line or hook) can be a tight **10–20s** short; a *build* (setup + payoff, data, or a story) runs longer, up to the ~3 minute cap. ~40s is a typical middle (the sample average in `style-guide/broll-analysis.md`), not a target to force — **never pad a punchline to fill time.** (Lower bound added 2026-05-23.)
- **Hard cap: keep a single short under 3 minutes (~180s).** A YouTube Short stays a Short up to **3 minutes**; past that YT reclassifies it as a long-form video. IG Reels and TikTok allow even longer, so 3 minutes is the binding ceiling (NOT 120s — that older cap was superseded 2026-06-07 when Mike confirmed the 3-min YT Shorts threshold). **Shorter still usually performs better:** a tighter short with stronger moments beats a longer one with filler, so do not pad to fill time. Only exceed 3 minutes if a clip is deliberately destined for the long-form section, not Shorts.

### Length variants — one topic can ship more than one cut

A single topic does not have to become a single short. From one topic you can produce **multiple cuts at different lengths**:

- A **long version** — the full arc (setup + payoff, data, or story), up to the ~3 minute cap.
- One or more **short high-impact versions** — built from the **peak beat(s)** flagged in Phase 3: either the single hardest-hitting 5–15s moment on its own, OR 2–3 short 5–10s beats stitched together (the multi-snippet rule applies, so the beats can be non-contiguous in the livestream).

The short version is **not** a trimmed long version — it's the *most impactful* slice, assembled for punch. Decide here which variants are worth rendering: not every topic needs both, but a high-energy topic with a clear peak often does (e.g. the 353x batch shipped a `reveal-medium` and a `reveal-long` of the same reveal). Each variant becomes its own entry through Phase 4b → production → the shorts queue.

### Start at the hook — no preamble

**Every clip must start at the first sentence that is directly on-topic.** Do not include lead-up banter, audience interaction, or segue phrases ("so anyway", "I wanted to talk about") before the hook line.

- Read the transcript to find the exact sentence where Mike makes the core claim or starts the relevant argument.
- Start the clip at that sentence, not at the beginning of the broader section.
- Likewise, end the clip when the topic is complete — do not run into the next topic or chat interaction.
- When reviewing in the dashboard, the user will identify the precise in/out point within a preview clip. Use those points (not the broader section range) for the final production extraction.

A clip that opens cold on the hook is always better than one that builds up to it. The viewer decides to scroll past in the first 2 seconds.

### Cut-boundary + selection quality rules (learned 2026-06-04 from Mike's review)

Recurring misses caught in review — apply at cut time:

- **Skip the livestream's opening countdown / intro card.** The first ~60s of a stream is often a static countdown-timer screen with no real picture, even though Mike is already talking. NEVER start a clip there — the audio may be on-topic but the visual is dead. Start where the actual face-cam + screen-share content begins.
- **Tighten the END hard — the #1 recurring miss.** End on the topic's final word. Do NOT let the opening of the *next* sentence or the *next* topic dangle at the tail (caught on multiple clips, 2026-06-04). When unsure, cut a beat EARLY rather than late. "End when the topic is complete" is not enough on its own — verify the last second isn't the start of something new.
- **No clips that disparage a specific project.** Do not ship a short whose core is negative about a named project (e.g. trashing XRP, "X makes Y useless"). Mike critiques markets and behavior, not a project's worth. Skip these even when the take is sharp. (This is a SHORTS rule; tweets may pivot differently.)
- **Energy bar — skip "boring" clips.** A factually-fine but low-delivery-energy explainer is still a skip. The clip needs conviction / humor / excitement in the *delivery*, not just good info (reinforces the Phase 3 short-worthiness criteria).

---

## Phase 4b — Clip review dashboard (runs before Remotion production)

Before building any Remotion composition, extract per-topic clips from the Premiere-formatted vertical video and present them in a browser dashboard for review. This separates content selection (human judgment) from production (automated).

### Input
A single vertical video (1080×1920) of the full livestream, with face zone and content zone
already laid out — produced by the **Phase 1 verticalize step** (or, legacy, exported from
Premiere). No cropping needed — just timestamp cuts.

### Process
1. Use the topic list and timestamp ranges from Phase 3
2. For each topic, run FFmpeg `-ss`/`-to` cuts on the vertical video — **always re-encode, never `-c copy`**. Using `-c copy` preserves source timestamps that can cause audio/video drift in Remotion. Always use: `-c:v libx264 -preset fast -crf 18 -c:a aac -b:a 192k -avoid_negative_ts make_zero`
3. **Multi-snippet topics** (same subject at multiple points in the stream) get concatenated into a single clip using FFmpeg's concat demuxer. Do not present separate cards per segment — one clip per topic
4. Build an HTML dashboard (single `.html` file, no server needed) — see **Dashboard convention** below for the exact structure (one cell per short, sequential numbering, in-place replacement).
5. Save clips to `shorts/<batch>/<topic-slug>/<topic-slug>-<variant>.mp4` (variant = `full` / `impact`) and the dashboard to `shorts/<batch>/dashboard.html`
6. **Register the batch in the repo-root registry `batches.json` — MANDATORY when a batch is created.**
   Add a batch object (`status: "active"`, schema matches the existing entries: `batch`, `date`,
   `livestream_title`, `source_media`, `transcript_plain`, `transcripts_dir`, `dashboard`,
   `directories: ["video-creation/remotion/out/<batch>", "video-creation/shorts/<batch>"]`,
   `pipelines: {shorts, repurpose}`; paths relative to repo root). **Why this is not optional:**
   `cleanup/targets/video-creation.js` reads `batches.json` and protects ONLY active batches'
   `directories` — every unregistered `remotion/out/<batch>/`, `shorts/`, and source artifact is
   treated as recyclable scratch and can be deleted. An unregistered batch is unprotected.
   Use the shared helper **`scripts/register_batch.py`** (`register_batch(batch=…, date=…,
   livestream_title=…, source_media=…, transcripts_dir=…, dashboard=…)`, or its CLI) — it
   upserts by batch name (idempotent). The `cut_topics_<batch>.py` script that writes the
   dashboard + `progress.json` calls it automatically (see `cut_topics_353x.py`), so a normal
   batch build registers itself.

### Dashboard convention (canonical — one cell per short; confirmed by Mike 2026-07-08, DO NOT deviate)

The clip-review dashboard is the single artifact Mike refreshes across every pass. A build helper
that implements these rules lives at `shorts/<batch>/build-dashboard.js` — model new batches on it
and rebuild the SAME `dashboard.html` in place each pass (never a second file).

- **One cell per short.** Each clip is its own cell with its own `<video>`. When the clip-strategist
  gives a topic multiple **length variants** (a `full` cut and a short `impact` cut), EACH variant is
  its OWN short in its OWN cell — never stack variants in one cell.
- **Sequential, stable numbering.** Number every short: all `full` clips first (1..k, by rank), then
  all `impact` clips (k+1..). A 5-topic batch with 3 impacts is clips 1-5 (fulls) + 6-8 (impacts).
  Mike refers to shorts by these numbers ("desilence clip 6"); numbering is fixed at initial-dashboard
  time and stays stable.
- **The initial dashboard shows ALL clips as separate cells** — including the short impact versions —
  so Mike sees the full set up front.
- **Processing REPLACES the clip in place.** When Mike asks to tighten a clip, the tightened file
  replaces the full one in that cell (raw backed up to `<slug>/_raw/`, out of view); if he then asks to
  desilence it, the desilenced file replaces that. Each cell shows ONLY the current version plus a
  status tag (`raw` / `desilenced` / `tightened+desilenced`), tracked in `shorts/<batch>/status.json`.
  Mike only ever sees the versions he requested changes to.
- **Deletions only on explicit request.** Never drop a short unless Mike says to.
- Cap `<video>` height (~320px) so the 9:16 verticals stay compact and titles read; use a fixed
  multi-column grid (not `auto-fill`) so cards wrap into rows.

### Output naming convention (where renders go)
The Phase-5 render of clip `<n>` writes to **`remotion/out/<batch>/<n>-<topic-slug>.mp4`** (per-batch
folder, clip-number prefix). Record that path on each clip entry in `shorts/<batch>/progress.json`
as `output_mp4` (relative to `video-creation/`). This convention is also stated in
`PUBLISH-SHORTS.md`, which consumes it. Do NOT drop renders as loose files in `out/`.

### User review
User plays each clip in the browser dashboard and marks topics as approved for production. Only approved topics proceed to silence removal (Phase 5B) and then production.

### Why this order matters
Building a full Remotion composition takes 1–2 hours. Reviewing a raw clip takes 30 seconds. Always get approval on the clip before investing in production.
