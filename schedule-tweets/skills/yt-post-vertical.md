---
name: yt-post-vertical
description: Post the next pending YouTube vertical video (Short) from data/shorts.json. Uses YouTube Data API v3 (preferred) with a Playwright fallback.
---

## Invocation

```powershell
cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets
node scripts/post-yt-short-api.js          # ⭐ preferred — API-based
node scripts/post-yt-short.js              # legacy — Playwright via youtube.com upload
```

Picks up the first short where `platforms.yt_shorts.status === "pending"`, uploads to YouTube as a Short, and writes `platforms.yt_shorts.status: "posted"`, `posted_at`, and `url` back to `data/shorts.json`.

⭐ Use `post-yt-short-api.js` unless something specifically blocks it. The API version returns the canonical video ID — no scraping, no UI brittleness.

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

### OAuth setup (one-time)

1. Google Cloud Console → APIs & Services → Library → YouTube Data API v3 → Enable.
2. OAuth consent screen → Publishing status: **Testing**, add Mike's Google account as Test user.
3. Credentials → Create OAuth client ID → Desktop app → download JSON to `config/yt-oauth.json`.
4. First run: script opens browser for consent flow, saves refresh token to `config/yt-api-token.json`.
5. All subsequent runs: silent, token auto-refreshes.

Note: Test-mode tokens expire after 7 days. Re-auth weekly until moved to Production mode.

**Reset the refresh token:** delete `config/yt-api-token.json` to force a fresh OAuth consent on next run.

## post-yt-short.js (legacy)

- URL captured from the upload dialog redirect — no HTTP verification.
- Subject to all the brittleness of YouTube Studio UI changes. Only fall back to this if the API script is blocked (quota exceeded, token broken).

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
