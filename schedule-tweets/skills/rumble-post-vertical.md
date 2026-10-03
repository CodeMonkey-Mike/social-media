---
name: rumble-post-vertical
description: Post the next pending Rumble vertical video from data/shorts.json via Playwright script.
---

## Invocation

```powershell
cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets
node scripts/post-rumble-short.js
```

Picks up the first short where `platforms.rumble.status === "pending"`, uploads to rumble.com/upload.php, and writes `platforms.rumble.status: "posted"`, `posted_at`, and `url` back to `data/shorts.json`.

## Queue file

`C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\shorts.json` → `platforms.rumble`

## Chrome profile

Uses `rumblebot-profile`. Shared with `upload-longform-rumble.js` — don't run two at once. **Chrome must be fully closed before running.**

## Timing constants

| Constant | Default | Purpose |
|---|---|---|
| `ACTION_MIN/MAX` | 2–5s | Pause between UI actions |
| `CHAR_DELAY_MIN/MAX` | 40–120ms | Per-keystroke delay |
| `PRE_COMPOSE` | none | (no extra pacing) |
| `PRE_POST` | none | (no extra pacing) |

## Key implementation details

- **Category is required.** Script picks **"News"** by default.
- **License defaults to "Rumble Only".**

## Post-publish verification

URL captured from the confirmation dashboard. **No live-page HTTP verification** — to upgrade, copy the verification block from `fb-post-short.js`.

> ⚠ **Captured URL is often STALE (observed 2026-05-26).** After Submit, the script does "Navigating to channel to capture video URL → Most recent channel video: …". While the just-uploaded video is still *processing*, it hasn't appeared on the channel yet, so the scrape returns the **previous** most-recent video's URL. In one run, two different shorts both recorded `v7adqkq-but-kaspa-will-awaken-market-update.html` (a prior upload). The upload itself succeeds (upload progress → licensing → Submit all complete); only the `url` written to `shorts.json` is wrong. **The url field is unreliable — treat upload success (Submit clicked + /content redirect) as the real signal, not the captured URL.** To fix properly: snapshot the channel's top video URL *before* upload, then poll after Submit until a *new* (different) URL appears, with a timeout fallback.

> ✅ **DEFINITIVE ROOT CAUSE + FIX (2026-06-02): wrong URL namespace — now handled in the script.** Rumble **shorts** live at **`rumble.com/shorts/v<id>`**, NOT the regular `rumble.com/v<id>-<slug>.html`. Shorts **never appear in the channel video grid** (`/user/CodeMonkeyMike`) or its SSR HTML, so the old channel-scrape could NEVER capture a short's real URL — it always wrote an unrelated `.html` video's URL. The real URL lives on **`rumble.com/account/content`**, where each short's row has an anchor `href="/shorts/v<id>"`.
>
> **`post-rumble-short.js` now does this automatically:** after Submit it loads `/account/content`, matches THIS short by title (smallest element containing the title, climb to the `/shorts/v` anchor), takes the `/shorts/v<id>` URL, then **liveness-checks** it (HTTP GET the public page, confirm `<title>` matches; retries for processing lag). It marks `posted` only if the public page resolves; otherwise `posted_unverified` with an error note (and **never writes a wrong `.html` URL**). The old channel `.html` scrape and the 3-minute redirect poll were removed. It ignores any `.html` URL the redirect loop may have seen (wrong namespace for a short).
>
> **`posted_unverified` handling:** means the upload submitted but liveness couldn't be confirmed in-window (or the short hadn't surfaced on `/account/content` yet). The status is NOT `pending`, so it won't be re-picked/duplicated. **Recapture with `node scripts/recapture-rumble-url.js <short-id>`** — it re-matches the short by title on `/account/content`, grabs the `/shorts/v<id>` URL, liveness-checks it, and writes it back (sets `posted` if live). **Do NOT re-run the poster** (it would re-upload). (Validated 2026-06-02: recovered wells-fargo → `/shorts/v7aqvri`.)
>
> **Capture must be anchor-anchored:** the title→URL match iterates each `/shorts/v` anchor and finds the one whose *own* row contains the title (smallest ancestor level). Climbing the other way (title node → nearest anchor) crosses into neighbor rows and grabs the wrong video — that bug mis-captured kaspa's URL for the wells-fargo short before it was fixed.
>
> Fixed examples from the discovery session: unicorn-fart-dust=`/shorts/v7apx28`, kaspa-3-dollars=`/shorts/v7aq1em`, lab-wont-go-down=`/shorts/v7ao676`.

## Browser interruption mid-upload

If the browser is closed or focus is stolen **after "Submit clicked ✓"** but before URL capture, the upload has already succeeded. Rumble processes the video server-side regardless of what happens to the browser after Submit.

**Recovery:**
1. Check your Rumble channel — if the video is there (even still processing), the upload went through.
2. Manually update `shorts.json`: set `platforms.rumble.status` → `"posted"`, `posted_at` → now, `url` → `null` (URL can't be captured retroactively without visiting the channel manually).
3. Do NOT re-run the script — it will upload a duplicate.

**Observed 2026-05-26:** User accidentally clicked the Rumble browser window during the URL-capture scan after Submit. Script crashed with `page.waitForTimeout: Target page, context or browser has been closed`. Video was confirmed live on the channel.

## Resetting a stuck Rumble short

```
node -e "
const fs=require('fs');
const d=JSON.parse(fs.readFileSync('data/shorts.json','utf8'));
for (const s of d.shorts) {
  if (s.platforms.rumble?.status === 'posting' || s.platforms.rumble?.status === 'failed') {
    s.platforms.rumble.status = 'pending';
    delete s.platforms.rumble.error;
    console.log('Reset', s.id);
  }
}
fs.writeFileSync('data/shorts.json', JSON.stringify(d, null, 2));
"
```

## Hashtag policy (added 2026-05-29)

Short captions must NOT contain visible `#hashtags`. The poster script strips inline `#word` tokens from the caption body via `scripts/lib/strip-hashtags.js` before posting. Cashtags (`$KAS`, `$BTC`) are preserved. The dedicated platform keyword/tags field (where one exists) is left intact — that is invisible metadata, not a visible hashtag. This is automatic; no manual step needed.

## ⛔⛔ ROOT CAUSE FOUND 2026-08-13: the title match crossed ROW BOUNDARIES — 19 rows held their NEIGHBOUR's id

The 2026-07-22 note below describes the symptom; this is the cause. The matcher walked every
`a[href*="/shorts/v"]` and climbed up to 5 ancestors, accepting **any** ancestor whose text
contained the title. Two or more levels up, that container spans SEVERAL rows — so an anchor
matched the *adjacent* row's title. Every id from 2026-08-04 to 2026-08-13 was shifted by exactly
one position (19 consecutive rows, **zero correct**), each holding the next-older video's URL.

**Why it survived so long:** the liveness check *was* reporting the wrong title every time
(`Liveness 1/5: not live yet (title="<the neighbour's title>")`), and that was read as benign
processing lag. The documented grep-for-duplicates guard below could not catch it either, because
the mis-assigned ids were *new* ids sitting on the wrong rows, not ids already recorded elsewhere.
**A title comparison catches it instantly; a duplicate-id check never will.**

**Fixed in `post_rumble_short.py`** (the canonical port; the JS twin is frozen rollback and STILL
CARRIES THIS BUG, so run Rumble shorts through the POST graph):
- Pass 1 matches the anchor's **own text** — Rumble renders the title as its own link inside the
  row, so no climbing is needed and no row boundary can be crossed.
- Pass 2 only climbs while the ancestor holds a **single distinct `/shorts/v` id**, and bails the
  moment it spans rows.
- A title that matches a **known other short** is now treated as fatal: the URL is discarded
  (`url: null`) instead of recorded.

**Recovery / standing end-of-run step:** `python scripts/reconcile_short_urls.py --platform rumble --apply`

## ⛔ URL capture can write a WRONG (stale, already-used) id — always grep before trusting it (2026-07-22)

The post-upload "Capturing short URL from /account/content (matching by title)" step can **false-match a fresh upload onto an older grid entry** and write that entry's URL to `shorts.json`. On 2026-07-22 both shorts in the same run captured the identical `https://rumble.com/shorts/v7d0pt4` — an id already recorded for a *different* short on 2026-07-21 — while the liveness retries reported the title of a *third*, older short.

This is NOT the same as the long-known `posted_unverified` processing lag. Tell them apart:

| | Benign lag (normal) | This bug (URL is wrong) |
|---|---|---|
| Captured id | new, unseen | **already present in `shorts.json`** |
| Liveness | shows a stale title | shows a stale title |
| Post live? | yes | yes |
| URL correct? | yes | **no** |

**Rule: after any Rumble short post, grep the captured `/shorts/v<id>` against `shorts.json`. If it already appears on another row, the URL is wrong** — null it out or mark it for `scripts/recapture-rumble-url.js` rather than leaving a duplicate id sitting on two rows. A `null` is honest; a wrong URL silently corrupts the record.

**Never re-upload on this** — the post is live either way (the standing never-retry rule applies).

**Script fix worth doing:** have `post-rumble-short.js` do that duplicate check itself before writing, and fall back to `url: null` when the captured id is already in use.

**Backlog implication:** the ~73-75 row `rumble.status === "posted_unverified"` backlog may contain *duplicated* URLs, not merely unverified ones. Check for repeated ids when that sweep is finally run.
