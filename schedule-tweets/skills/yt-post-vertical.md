---
name: yt-post-vertical
description: Post the next pending YouTube vertical video (Short) from data/shorts.json. API ONLY (YouTube Data API v3). No browser fallback — if the API fails, report it at the end of the run.
---

## Invocation

```powershell
cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets
node scripts/post-yt-short-api.js          # the ONLY way to post a YT short
```

Picks up the first short where `platforms.yt_shorts.status === "pending"`, uploads to YouTube as a Short, and writes `platforms.yt_shorts.status: "posted"`, `posted_at`, and `url` back to `data/shorts.json`.

> ⛔ **HARD RULE — YouTube Shorts are posted via the API ONLY. There is NO fallback.**
> Do **not** run `post-yt-short.js` (the legacy Playwright uploader), do **not** re-encode/compress a short to dodge a size limit, do **not** improvise any browser path. The browser route pops up YouTube Studio, is UI-brittle, can't transfer files >50 MB, and silently mis-sets visibility / made-for-kids (a short went live with unverified visibility on 2026-06-20 doing exactly this — Mike's standing correction). If `post-yt-short-api.js` fails for ANY reason (most commonly `invalid_grant` = the test-mode OAuth token expired, which needs Mike to re-auth — see OAuth setup below), **mark it failed and report it at the end of the run.** A failed step is reported, never worked around.

> ⚠ **Never pipe this script through `findstr`/`grep`** (e.g. to hide the verbose "uploaded X MB" progress). findstr exits immediately, node gets EPIPE on its first progress write and dies mid-upload, leaving the `shorts.json` row stuck `posting` with nothing on YouTube. Run it plain or `run_in_background`, then `Grep` the output FILE for `Posted ✓`. Reset the stuck `posting` row before re-running. (Hit 2026-05-25.)

## Queue file

`C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\shorts.json` → `platforms.yt_shorts`

## Auth / Profile

**Preferred (`post-yt-short-api.js`):** YouTube Data API v3. OAuth refresh token at `config/yt-api-token.json`. No Chrome profile needed.

**Legacy (`post-yt-short.js`):** `ytbot-profile` (CDP 9223). Shares profile with `yt-post-poll.md` script — don't run two at once.

## Timing constants

### post-yt-short-api.js (preferred)

API upload only. No human-pacing delays — script is silent and fast.

### post-yt-short.js (legacy)

| Constant | Default | Purpose |
|---|---|---|
| `CHAR_DELAY` | clipboard paste | (no per-char typing) |
| `ACTION` | 3–6s | Pause between major UI actions |
| `PRE_COMPOSE` | none | (no extra pacing) |
| `PRE_POST` | none | (no extra pacing) |

## post-yt-short-api.js (⭐ preferred)

- Uses YouTube Data API v3 `videos.insert`. Drop-in queue contract — reads same `shorts.json`, writes back `status: posted` + `url` (format `https://www.youtube.com/shorts/<id>`).
- **URL capture is reliable** — the API returns the canonical video ID.
- Vertical 9:16 videos ≤60s auto-become Shorts. Script appends `#Shorts` to description for additional surfacing.
- **Quota:** video upload costs 1600 units; daily quota is 10,000 → ~6 uploads/day.
- **Pre-upload duplicate check = three independent sources, first one that ANSWERS wins** (rewritten 2026-09-11 after the public RSS feed 404/500'd for ~3 hours overnight and blocked three shorts that had already reached the other six platforms). Order:
  1. **Authenticated Data API** — `playlistItems.list` on the channel's uploads playlist (`UU` + channel id, 1 quota unit). Needs the `youtube.readonly` scope on the token. **Until Mike re-consents once via `node scripts/yt-reauth.js` this source reports `token lacks youtube.readonly` and is skipped**; after that it is the primary source and the public feed is never load-bearing.
  2. **Public RSS feed** (`feeds/videos.xml?channel_id=...` from `config/yt-channel.json`), browser user-agent, **5 attempts with 3/6/12/24 s backoff** (~45 s worst case). The feed transient-404s and can stay down for a stretch; that is what the retries and the next source are for.
  3. **Public channel page** (`/channel/<id>/shorts`, then `/videos`), parsing the embedded `ytInitialData` JSON. A page that parses but lists zero videos counts as unavailable, never as "no match".
  - A match on any source = row marked `posted` with the discovered URL, upload skipped. "No match" on any source = upload proceeds. The script refuses to upload ONLY when all three are unavailable (`Duplicate check failed: every duplicate-check source failed`), and the row stays clean `pending`; then defer the step, leave it pending, move on. Do not go editing `yt-channel.json` over it.
  - **`--check-only`** runs the duplicate check for the next pending short and exits without writing or uploading (`node scripts/post-yt-short-api.js --check-only`). Use it to confirm the check is healthy before a posting run.
  - The Python twin `scripts/post_yt_short_api.py` (what the segment-7 POST graph runs) carries the identical three-source check and `--check-only`.
  - RSS titles are XML-unescaped before matching (`&amp;`, `&#39;`, ...), so titles with ampersands/quotes match.
  - Historical notes (pre-2026-09-11, kept for diagnosis): the feed had a channel-specific 404 flap on 2026-06-03 while a known-good channel returned 200, and a 20-minute global 404/500 outage on 2026-06-02. Test with a browser UA, not bare `curl` (curl's default UA gets a blanket 404).

### OAuth setup (one-time)

1. Google Cloud Console → APIs & Services → Library → YouTube Data API v3 → Enable.
2. OAuth consent screen → Publishing status: **Testing**, add Mike's Google account as Test user.
3. Credentials → Create OAuth client ID → Desktop app → download JSON to `config/yt-oauth.json`.
4. First run: script opens browser for consent flow (scopes: `youtube.upload` + `youtube.readonly`), saves refresh token to `config/yt-api-token.json`.
5. All subsequent runs: silent, token auto-refreshes.

Note: Test-mode tokens expire after 7 days. Re-auth weekly until moved to Production mode.

**Reset the refresh token:** delete `config/yt-api-token.json` to force a fresh OAuth consent on next run.

### Re-auth + validate (when uploads fail with `invalid_grant`)

```powershell
cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets
node scripts/yt-reauth.js
```

`yt-reauth.js` does ONLY the OAuth re-consent + validation — it never uploads. It backs up the old token, opens the Google consent URL (auto-opens in the browser; Mike must pick the channel's account and approve the "upload" scope — click through the "Google hasn't verified this app" → Advanced → Go to… screen), captures the localhost redirect, saves the fresh refresh token to `config/yt-api-token.json`, then **validates by minting an access token** (a refresh — the exact call that throws `invalid_grant` when the token is dead) and **checks the read scope** with a `playlistItems.list` call (prints `Read scope ✓` when the authenticated duplicate check is enabled). Use this instead of deleting the token + running `post-yt-short-api.js`, because the latter would upload a pending short as a side effect of re-auth. After it prints `Validation ✓`, the next `post-yt-short-api.js` run works. (Validated 2026-06-20 — token had expired ~weekly as expected.)

## post-yt-short.js (legacy — ⛔ DO NOT USE)

**This script is retired as a posting path. It is NOT a fallback. Do not run it.** Kept only as a historical reference. Reasons it must not be used:
- Pops up YouTube Studio and is UI-brittle (visibility / made-for-kids radios silently not found → wrong settings; URL often not captured).
- ⚠️ **50 MB hard cap** — attaches the file via Playwright `setInputFiles` over CDP, which refuses files >50 MB (`Cannot transfer files larger than 50Mb to a browser not co-located with the server`). Most shorts are 60–80 MB.
- Re-encoding a short smaller to get under that cap is **also forbidden** — it changes Mike's content and is not an approved workaround.

If `post-yt-short-api.js` is blocked (e.g. `invalid_grant`), the ONLY correct action is: leave the row, **report the failure at the end of the run**, and have Mike re-auth the API token (OAuth setup below). Never switch to this script.

## Resetting a stuck YT short

```
node -e "
const fs=require('fs');
const d=JSON.parse(fs.readFileSync('data/shorts.json','utf8'));
for (const s of d.shorts) {
  if (s.platforms.yt_shorts?.status === 'posting' || s.platforms.yt_shorts?.status === 'failed') {
    s.platforms.yt_shorts.status = 'pending';
    delete s.platforms.yt_shorts.error;
    console.log('Reset', s.id);
  }
}
fs.writeFileSync('data/shorts.json', JSON.stringify(d, null, 2));
"
```

## Hashtag policy (added 2026-05-29)

Short captions must NOT contain visible `#hashtags`. The poster script strips inline `#word` tokens from the caption body via `scripts/lib/strip-hashtags.js` before posting. Cashtags (`$KAS`, `$BTC`) are preserved. The dedicated platform keyword/tags field (where one exists) is left intact — that is invisible metadata, not a visible hashtag. This is automatic; no manual step needed.
YouTube keeps a single functional `#Shorts` appended in code (classifier, not a content hashtag).
