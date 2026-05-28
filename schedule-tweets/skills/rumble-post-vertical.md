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
