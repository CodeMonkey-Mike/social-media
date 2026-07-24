# Publish Approved Shorts → schedule-tweets

**This is the canonical skill for the Phase 6 handoff: taking a fully-produced, Mike-approved
batch of shorts and queuing them in the `schedule-tweets` pipeline.** Invoked by `/publish-shorts`
(or "publish the batch", "send the shorts over"). When invoked, do the whole thing below without
asking Mike for the granular mechanics — only ask if something is genuinely ambiguous (which
platforms to skip, which clips if the batch is partially approved).

---

## When to run (approval gate)

Only publish shorts that are **fully produced AND approved**. Signals:
- The batch's `video-creation/shorts/<batch>/progress.json` `dashboard_status` says the clips are
  fully produced / approved (e.g. "ALL N shorts FULLY PRODUCED … Batch complete"), **and**
- Mike has said the batch looks good / to publish it.

**Never** queue preview-only, unapproved, or "skipped" clips. If only some clips are approved,
publish that subset.

---

## ⛔ Two invocation traps (BOTH cost a real incident; read before running)

**1. `--date` SILENTLY DEFEATS THE DEDUPE → it can RE-POST a live short.**
The entry id is `<prefix>-<date_compact>-<slug>` and the idempotency check is **on id**. The script also
**globs EVERY `*.mp4`** in `remotion/out/<batch>/`, including shorts you published in an earlier run. So
publishing a batch's later clips under a **different `--date`** re-adds every already-published mp4 under
a **NEW id** and re-queues an **already-live** short.

> **Rule: publish a batch's later clips under the SAME `--date` as the first clip.** That is correct
> anyway, since they share one livestream: one `shorts/<batch>-<date>/` folder, one `source_livestream`.
> **Always `--dry-run` first** and confirm you see `copy SKIP (exists)` + `entry SKIP (present)` for every
> previously-published clip. A run is only safe when the SKIP lines match what you expect.

**2. `--progress-json` used to default to the WRONG path. FIXED 2026-07-23.**
It defaulted to the flat `video-creation/shorts/<batch>-progress.json` while the convention is the
nested `video-creation/shorts/<batch>/progress.json`, so titles came back **blank** with no error.
The script now prefers the nested path and falls back to the flat one for legacy batches, so the
flag is no longer required. **Still check the `titles :` line in the dry-run output**: `progress JSON`
means titles resolved, `none found` means every short would publish with a BLANK title.

```bash
python scripts/publish-shorts.py <batch> --date <SAME-DATE-AS-FIRST-CLIP> \
  --progress-json "video-creation/shorts/<batch>/progress.json" --dry-run
```

---

**3. Publishing while a builder is still working STAGES A STALE RENDER. (Cost a real incident 2026-07-23.)**
`publish-shorts` copies whatever mp4 is on disk *right now*. A parallel `remotion-builder` that
finds a defect in QA will **re-render to the same path**, so an mp4 existing is NOT proof it is
final. On 2026-07-23 the orchestrator saw all 7 mp4s on disk, inferred the last builder had
finished, and published; that builder then re-rendered clip 3 an hour later after fixing a badge
overflow and two bad b-roll fade boundaries. The staged copy was the pre-fix render.

> **Rule: do not publish until EVERY builder has reported back.** An mp4 on disk and a released
> stage lock are not completion signals. After publishing, prove the staged copy is the shipped
> render:
>
> ```bash
> for f in video-creation/remotion/out/<batch>/*.mp4; do
>   b=$(basename "$f"); d="schedule-tweets/shorts/<batch>-<date>/$b"
>   [ "$(md5sum "$f"|cut -d' ' -f1)" = "$(md5sum "$d"|cut -d' ' -f1)" ] && echo "MATCH $b" || echo "STALE $b"
> done
> ```
>
> Re-copy anything that reads STALE and re-probe its `duration_seconds` in `shorts.json`.

---

## What it does

For each approved short in the batch:
1. **Copy the rendered mp4** `video-creation/remotion/out/<batch>/<n>-<slug>.mp4`
   → `schedule-tweets/shorts/<batch>/<slug>.mp4`.
2. **Append one entry** to `schedule-tweets/data/shorts.json` → `shorts[]` (schema below), with a
   freshly-authored open-loop title/hook and clean caption.
3. Copy a thumbnail to `schedule-tweets/shorts/<batch>/` and set `thumbnail_path` **only if** a
   designed thumbnail image exists; otherwise leave `null` (the rendered first frame is the cover).

Read `shorts.json`, append, write it back (pretty-printed, `ensure_ascii=false`). Do not disturb
existing entries. Then posting is the per-platform schedule-tweets skills (see "After staging").

---

## shorts.json entry schema (exact — copy this shape)

```json
{
  "id": "<batchabbr>-<YYYYMMDD>-<slug-keywords>",
  "batch": "<batch id — MUST match a batches.json entry, e.g. uh-oh>",
  "slug": "<batch>",
  "source_livestream": "<livestream name, e.g. the VERTICAL filename>",
  "source_clip": "<clip slug>",
  "video_path": "shorts/<batch>/<slug>.mp4",
  "thumbnail_path": null,
  "duration_seconds": <float>,
  "width": 1080,
  "height": 1920,
  "title": "<open-loop hook>",
  "hook": "<the spoken hook line>",
  "related_longform_url": null,
  "caption": "<clean caption — NO link, NO #hashtags>",
  "tags": ["<keyword tags, no #, ~4-5, most-relevant first; drive the per-platform hashtags + YT/Rumble tag boxes>"],
  "platforms": {
    "yt_shorts": { "status": "pending", "posted_at": null, "url": null, "views": null, "views_captured_at": null, "caption_override": "<caption>\n\nDisclaimer: Nothing I say is financial advice. Find out more about my team and my community: https://cryptorich.vip/" },
    "ig_reels":  { "status": "pending", "posted_at": null, "url": null, "views": null, "views_captured_at": null, "caption_override": null },
    "x":         { "status": "pending", "posted_at": null, "url": null, "views": null, "views_captured_at": null, "caption_override": null },
    "tiktok":    { "status": "pending", "posted_at": null, "url": null, "views": null, "views_captured_at": null, "caption_override": null },
    "facebook":  { "status": "pending", "posted_at": null, "url": null, "views": null, "views_captured_at": null, "caption_override": null },
    "rumble":    { "status": "pending", "posted_at": null, "url": null, "views": null, "views_captured_at": null, "caption_override": "<caption>\n\nDisclaimer: Nothing I say is financial advice. Find out more about my team and my community: https://cryptorich.vip/" },
    "bitchute":  { "status": "pending", "posted_at": null, "url": null, "views": null, "views_captured_at": null, "caption_override": "<caption>\n\nDisclaimer: Nothing I say is financial advice. Find out more about my team and my community: https://cryptorich.vip/" }
  }
}
```

- **`batch` is mandatory and is the join key back to `batches.json`.** It MUST equal an existing
  `batches.json` `batch` id (e.g. `uh-oh`, `meme-coins`). This is what lets us compute when a batch
  is fully posted (0 pending shorts left for that `batch`) so its registry status can flip to
  completed and cleanup can reclaim it. Do not invent a new value, do not leave it blank — if no
  batch is registered yet, register it in `batches.json` first. (Distinct from `slug`/`source_clip`,
  which identify the individual clip.)
- `video_path` is **relative to the schedule-tweets root**.
- `status` lifecycle per platform: `pending → posting → posted → failed | skip`. Set every
  platform to `pending`, except any platform Mike wants excluded → set that one to `skip`.
- `id` pattern: short batch abbreviation + date + a few slug keywords (e.g.
  `wlw-20260531-115x-lab`). Keep it unique and human-readable.

---

## Related long-form link (teaser shorts)

`related_longform_url` (top-level, default `null`): when a short is a TEASER for a related long-form
video, set this to the long-form's URL. `post-yt-short-api.js` appends `Watch the full video: <url>`
to the YouTube description. (The native YouTube Studio "Related video" field on a Short is NOT
settable via the Data API v3 — set that manually in Studio if you also want the on-Short chip; the
description link is the API-supported equivalent.) Leave `null` for standalone shorts.

## Title / hook — make it an OPEN LOOP

The **title is the hook**: a curiosity gap that stops the scroll and is only resolved by watching.
- Prefer Mike's **actual spoken hook** when it's strong (e.g. "When did your husband stop touching
  you?"). Otherwise craft one from the clip's payoff **without spoiling it** — pose the question or
  the surprising claim, don't answer it in the title.
- First-person, conviction, named opposition where it fits Mike's voice. No clickbait the clip
  doesn't deliver.
- Good: "I called a 20x on LAB. It did 115x in a bear market." / "The $1,000 bounty nobody will
  claim." Bad (closes the loop): "LAB is a good coin to buy."

---

## Caption rules

- **Store captions HASHTAG-FREE.** The `tags` array is the single source of truth for hashtags; the
  poster scripts auto-append the right number per platform at post time via
  `scripts/lib/strip-hashtags.js` → `buildCaption()` (X **2**, BitChute **3**, TikTok/IG/Facebook
  **5**, YouTube **3** in the description + the full array to the YT tags field, Rumble **0** in the
  description because it fills its dedicated tags box from `short.tags`). So you no longer hand-write
  or count hashtags — just write a clean caption and **populate `tags`** (order = relevance; the first
  N are used; put any series tag like `KaspaWiseman` first). `$KAS`/`$BTC` cashtags are not hashtags
  and always pass through. Base `caption` is the clean version used by TikTok/IG/X/Facebook: NO link.
  Keep it short and punchy.
- **Link-split pattern:** the CryptoRich.vip link + disclaimer goes **only** on the
  long-form-description platforms — set `caption_override` on **yt_shorts, rumble, bitchute** to:
  `"<caption>\n\nDisclaimer: Nothing I say is financial advice. Find out more about my team and my community: https://cryptorich.vip/"`
  Leave `caption_override` **null** on ig_reels, x, tiktok, facebook (they inherit the clean base).
- **NO em dashes (—)** anywhere in title/hook/caption — Mike's voice never uses them. Use a comma,
  period, or colon.

---

## Series branding — Kaspa Wise Man videos

Videos from the **Kaspa Wise Man** series (source `kaspa-wise-man`) carry extra branding so the series
reads as one + is discoverable (canonical: `vertical-ai-persona/kaspa-wise-man/CONCEPT.md` §6a):
- **Title prefix `Kaspa Wiseman #N: `** then the open-loop hook (intro = episode **#0**, quote videos
  start at **#1**; keep a running counter).
- **Series hashtag `#KaspaWiseman`** clickable in the caption — make the two X-safe base hashtags
  **`#Kaspa` + `#KaspaWiseman`**, push topical hashtags to the `tags` array; put `KaspaWiseman` first
  in `tags`. (Videos with a licensed music bed also append the Soundstripe license line to yt/ig/fb.)

## After staging

- Posting is handled by the **schedule-tweets per-platform skills**, run **ONE AT A TIME**
  (sequential posting is a hard rule — never parallel). YouTube via `post-yt-short-api.js` (API,
  preferred) NOT the legacy Playwright `post-yt-short.js`.
- Known gotchas: **BitChute** silently rejects `.webp` thumbnails (PNG/JPG only); **Rumble** and
  **Facebook** can capture a stale `url` after a successful upload (treat Submit-success as truth,
  backfill the real URL).
- The dashboard (port 8766, `schedule-tweets` `/dashboard` skill) shows the queued shorts.

---

## Don'ts
- Don't queue preview-only or unapproved clips.
- Don't hand-write hashtags into captions — leave captions hashtag-free and populate the `tags` array; the posters append the per-platform set automatically (X is auto-capped at 2).
- Don't use em dashes.
- Don't put the CryptoRich.vip link on TikTok/IG/X/Facebook.
- Don't run posting scripts in parallel.
