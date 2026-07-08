---
name: x-post-vertical
description: Post the next pending X vertical video from data/shorts.json via Playwright script.
---

## Invocation

```powershell
cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets
node scripts/post-x-short.js
```

Picks up the first short where `platforms.x.status === "pending"`, posts it as a video tweet, and writes `platforms.x.status: "posted"`, `posted_at`, and `url` back to `data/shorts.json`.

## Queue file

`C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\shorts.json` → `platforms.x`

## Chrome profile

Uses `xbot-profile`. Shared with `post-tweet.js`, `post-thread.js`, `post-x-poll.js` — don't run two at once. **Chrome must be fully closed before running.**

## Timing constants

| Constant | Default | Purpose |
|---|---|---|
| `PRE_COMPOSE_MIN/MAX` | 60–180s | Wait before opening composer |
| `PRE_POST_MIN/MAX` | 60–180s | Wait before clicking Post (script reuses `PRE_COMPOSE` range) |
| `ACTION_MIN/MAX` | 4–7s | Pause between major UI actions |
| `CHAR_DELAY_MIN/MAX` | 60–150ms | Per-keystroke delay |

## Key implementation details

- Uses the same React-controlled composer as `post-thread.js`. Caption is entered via `page.keyboard.type()` (real keystrokes — `fill()` breaks React state).
- Video is attached via the hidden `input[type="file"]` **inside the modal composer** (NOT the inline home-feed one — use `.first()` after the modal opens).
- **Caption length:** the script warns if caption > 280 chars but posts anyway. X likely truncates. Either auto-truncate to ~250 chars with an ellipsis, or maintain a separate `caption_x` field in `shorts.json`. Sharing one caption across all 7 platforms is wrong for X.

## Post-publish verification

URL is captured from the post confirmation toast. **No HTTP-level verification** of the live video URL — to upgrade, copy the verification block from `fb-post-short.js` (fetch URL, confirm 2xx/3xx + `<video>` element).

## Resetting a stuck X short

```
node -e "
const fs=require('fs');
const d=JSON.parse(fs.readFileSync('data/shorts.json','utf8'));
for (const s of d.shorts) {
  if (s.platforms.x?.status === 'posting' || s.platforms.x?.status === 'failed') {
    s.platforms.x.status = 'pending';
    delete s.platforms.x.error;
    console.log('Reset', s.id);
  }
}
fs.writeFileSync('data/shorts.json', JSON.stringify(d, null, 2));
"
```

## ⛔ Absolute Rules (X posting)

See `x-post-tweet.md` for Rules 0, 1, 2 — they apply identically here.

## Hashtag policy (added 2026-05-29)

Short captions must NOT contain visible `#hashtags`. The poster script strips inline `#word` tokens from the caption body via `scripts/lib/strip-hashtags.js` before posting. Cashtags (`$KAS`, `$BTC`) are preserved. The dedicated platform keyword/tags field (where one exists) is left intact — that is invisible metadata, not a visible hashtag. This is automatic; no manual step needed.
