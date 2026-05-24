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

URL written as `https://www.bitchute.com/content` — that's the Studio dashboard URL, NOT the specific video URL. To find the actual video URL after posting, visit the channel page manually.

To upgrade: copy the verification block from `fb-post-short.js` (fetch URL, confirm 2xx/3xx + `<video>` element / `og:video`).

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
