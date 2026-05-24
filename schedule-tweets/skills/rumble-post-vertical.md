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
