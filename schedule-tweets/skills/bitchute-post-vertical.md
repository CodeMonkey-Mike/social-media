---
name: bitchute-post-vertical
description: Post the next pending BitChute vertical video from data/shorts.json via Playwright script.
---

## Invocation

```powershell
cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets
node scripts/post-bitchute-short.js
```

Picks up the first short where `platforms.bitchute.status === "pending"`, uploads via BitChute Studio, and writes `platforms.bitchute.status: "posted"`, `posted_at`, and `url` back to `data/shorts.json`.

## Queue file

`C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\shorts.json` → `platforms.bitchute`

## Chrome profile

Uses `bitchutebot-profile`. Shared with `upload-longform-bitchute.js` — don't run two at once. **Chrome must be fully closed before running.**

## Timing constants

| Constant | Default | Purpose |
|---|---|---|
| `ACTION_MIN/MAX` | 3–6s | Pause between UI actions |
| `CHAR_DELAY_MIN/MAX` | 40–120ms | Per-keystroke delay |
| `PRE_COMPOSE_MIN/MAX` | 10–25s | Wait before opening composer |
| `PRE_POST` | none | (no extra pacing) |

## Key implementation details

- **Uses BitChute Studio** as the upload surface.
- **Title is required and must be ≤100 chars.** Script truncates if necessary.

## Post-publish verification

**The script now captures the REAL video URL** by decoding the `upload_code` from the BitChute upload page query string, then writing `https://www.bitchute.com/video/<upload_code>/` (e.g. `https://www.bitchute.com/video/Lf9HjS7Boxgj/`). The video is still *processing* at write time, but the URL is the canonical one and resolves once processing completes. (Confirmed working 2026-05-29 across two shorts — `Lf9HjS7Boxgj`, `tSS5kuOAjaKA`.) The old behavior of writing the `/content` dashboard URL is gone; no manual channel-page lookup needed.

**Liveness check — IMPLEMENTED 2026-06-02.** After the `/content` publish-confirm, the script now fetches the public video URL (server-rendered, so a plain `context.request.get` works — no browser render) and confirms its `og:title` matches the real title. A non-live / phantom URL returns the generic `og:title="Bitchute"`, which is how we detect it. It waits ~45s (processing lag) then retries up to 6× over ~2.5 min. Outcome:
- **og:title matches → `status: posted`** (liveness confirmed).
- **never resolves → `status: posted_unverified`** + an `error` note (NOT `failed` — the publish was already confirmed via `/content`; this just means the public page didn't come up in the window). `posted_unverified` keeps it out of the auto-pending queue (no duplicate re-upload) while flagging it for a manual channel check. Don't re-run on `posted_unverified` — verify on the channel instead.

## Two Proceed-flow variants — both are normal (observed 2026-06-01)

BitChute's post-upload flow shows up in **two shapes**, run-to-run, and the script handles both:
- **Single-Proceed:** first Proceed → no publish checkbox (`No publish checkbox found ... assuming single Proceed flow`) → `/content` redirect. (Seen on `qK5vBu6mnh8y`, `MOu1nrFFl52F`.)
- **Two-Proceed:** first Proceed → a **"Publish Right Away" checkbox** (already checked) → **second Proceed** → `/content` redirect.

## ⛔ Missing-thumbnail false-positive — HARDENED 2026-06-02 (read this)

**What happened:** on one run the `Grab Thumbnail` step logged `Thumbnail grabbed ✓` but BitChute did **not** actually register a thumbnail. At publish, BitChute popped a **"missing thumbnail, try again"** modal and the submit never completed. The OLD script then waited 120s for a `/content` redirect, timed out, logged `Warning: no /content redirect — submission may still have gone through`, and **marked the short `posted` anyway with a guessed `upload_code` URL.** The video was actually an **unpublished draft** — nobody would have noticed without eyeballing the browser. The old "no redirect = still posted, treat as done" assumption was the bug.

**The fix (now in `post-bitchute-short.js`):**
1. **`grabThumbnail()` is a reusable helper.** A successful grab-button *click* is NOT proof a thumbnail registered.
2. **Self-recovery loop (up to 3x):** after Proceed, if the missing-thumbnail modal is detected, the script dismisses it, re-grabs the thumbnail, and retries Proceed.
3. **Strict success gate — the important part:** the short is marked `posted` **only if** it sees the `/content` redirect **OR** confirms the title is actually live by scraping `/content` (`scrapeContentPage` + `findByTitle`). A bare no-redirect timeout no longer counts as success.
4. **Loud failure:** if publish can't be confirmed, the script **throws** → status becomes `failed` (NOT `posted`), with an error saying the video uploaded as a **draft** and to publish it manually from BitChute Studio. **Do NOT re-run** on this failure — re-running re-uploads and duplicates. Publish the existing draft from Studio (grab thumbnail there + publish; the `upload_code` URL resolves once it's live).

**Implication for the old guidance:** "exit 0 + captured `upload_code` URL = posted" is now backed by a real confirmation, so it's trustworthy. But a `failed` BitChute short in `shorts.json` means a draft is sitting unpublished in Studio — handle it manually, don't blindly reset to `pending` and re-run.

## ⛔ Search Terms field is LETTERS-ONLY (A–Z) — root cause of many "missing-thumbnail" failures (2026-06-19)

**BitChute's Search Terms field rejects anything that isn't a letter A–Z** — it throws an inline red error **"Only use letters A to Z."** No digits, no symbols. A tag like **`ai16z`** (the ai16z/ElizaOS DAO) has digits and trips this.

**Why it matters far beyond the tag field:** that validation popup **blocks the second Proceed**, AND its text matches the script's loose modal detector, so it gets **misreported as the "missing-thumbnail modal"** above. This is why a short with a digit-tag fails **consistently on every attempt** (3× modal → `failed`) while the thumbnail is completely fine. The `elizaos-my-favorite-ai` short failed BOTH passes of a 28-step run **solely** because of the `ai16z` tag; the moment the tag was dropped it took the single-Proceed happy path and went live (`…/video/eimSAyR6yqTp/`). So: **a BitChute `failed` whose modal log says "missing-thumbnail" but whose thumbnail is obviously valid is almost certainly a digit/symbol in the Search Terms — check the tags first.**

**Fixed in `post-bitchute-short.js` (and `upload-longform-bitchute.js`):** search terms now `filter(t => /^[A-Za-z]+$/.test(t))` before `.slice(0,3)` — any tag with a digit/symbol is **dropped** and the next valid tag is used (e.g. `["ElizaOS","ai16z","AI","altcoins","crypto"]` → `ElizaOS AI altcoins`). This is automatic; the source `tags` are left untouched (so `ai16z` stays valid for X/YT/etc.). **Do NOT manually retitle/relabel the entry for other platforms.** If a digit-tag fix is ever needed by hand, pick letters-only replacements or just drop the offending tag.

## Resetting a stuck BitChute short

```
node -e "
const fs=require('fs');
const d=JSON.parse(fs.readFileSync('data/shorts.json','utf8'));
for (const s of d.shorts) {
  if (s.platforms.bitchute?.status === 'posting' || s.platforms.bitchute?.status === 'failed') {
    s.platforms.bitchute.status = 'pending';
    delete s.platforms.bitchute.error;
    console.log('Reset', s.id);
  }
}
fs.writeFileSync('data/shorts.json', JSON.stringify(d, null, 2));
"
```

## Hashtag policy (added 2026-05-29)

Short captions must NOT contain visible `#hashtags`. The poster script strips inline `#word` tokens from the caption body via `scripts/lib/strip-hashtags.js` before posting. Cashtags (`$KAS`, `$BTC`) are preserved. The dedicated platform keyword/tags field (where one exists) is left intact — that is invisible metadata, not a visible hashtag. This is automatic; no manual step needed.
