---
name: ig-post-vertical
description: Post the next pending Instagram vertical video (Reel) from data/shorts.json via Playwright script.
---

> ✅ **FIXED 2026-05-25:** the file-input timeout after Create → "Post" was caused by a **"Turn on Notifications" modal** trapping focus and blocking the Create flow — not a selector change. FIX: `dismissBlockingDialogs()` clicks **"Not Now"** after home-load and before Create (applied to single/reel/carousel). If it breaks at file-input again, check for a new blocking modal first (`scripts/_diag-ig-create.js`).

## Invocation

```powershell
cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets
node scripts/post-ig-reel.js
```

Picks up the first short where `platforms.ig_reels.status === "pending"`, posts it via Instagram's Post flow (IG routes vertical videos to Reels automatically based on aspect ratio), and writes `platforms.ig_reels.status: "posted"`, `posted_at`, and `url` back to `data/shorts.json`.

## Queue file

`C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\shorts.json` → `platforms.ig_reels`

## Chrome profile

Uses `igbot-profile`. Shared with `ig-post-single.md` and `ig-post-carousel.md` scripts — don't run two at once. **Chrome must be fully closed before running.**

```powershell
Stop-Process -Name chrome -Force -ErrorAction SilentlyContinue
```

## Timing constants

| Constant | Default | Purpose |
|---|---|---|
| `PRE_COMPOSE_MIN/MAX` | 15–45s | Wait before opening composer (also reused before Share) |
| `ACTION_MIN/MAX` | 3–6s | Pause between UI actions |
| `CHAR_DELAY_MIN/MAX` | 40–120ms | Per-keystroke delay for caption typing |

## Posted from the Post flow — there is no separate "Reel" menu

Same `igbot-profile` machinery as `ig-post-single.md` but with a video file. Instagram automatically routes vertical 9:16 videos to Reels based on aspect ratio.

## CRITICAL — 9:16 crop must be selected explicitly before Next

IG defaults to 1:1 for video uploads. If left at default, IG center-crops the 9:16 video and processes it as a non-Reel or fails silently. The "Select crop" button (`SVG aria-label="Select crop"`) opens a menu — **hover-driven, NOT click-driven** (opposite of single-image flow). Working pattern:

```js
await cropTrigger.scrollIntoViewIfNeeded();
await cropTrigger.hover();                  // opens menu via mouseenter
await page.waitForTimeout(600);
const coords = await page.evaluate(() => {
  for (const el of document.querySelectorAll('[role="button"]')) {
    const span = el.querySelector('span');
    if (span?.textContent.trim() === '9:16') {
      const r = el.getBoundingClientRect();
      if (r.width > 0) return { x: r.x + r.width/2, y: r.y + r.height/2 };
    }
  }
  return null;
});
await page.mouse.move(coords.x, coords.y, { steps: 10 });
await page.mouse.click(coords.x, coords.y);
```

`steps: 10` keeps the cursor inside the menu region so it doesn't close before the click lands.

**Crop selection across the IG family (same DOM element, different React handlers):**
- Single image (`ig-post-single.md`): **click** opens menu, pick **4:5**.
- Carousel (`ig-post-carousel.md`): **no** crop interaction (1:1 default).
- Reel (this file): **hover** opens menu, pick **9:16**.

## CRITICAL — DO NOT close Chrome until IG finishes uploading server-side

After clicking Share, IG shows a "posting" spinner while the video processes on their servers. Closing early **silently drops the upload** — no error, nothing on the profile. The script holds an additional **5 minutes** after the Share confirmation before closing. Do not shorten this wait.

**Retry policy when post doesn't appear:**
1. First attempt: 5-min post-Share hold before closing Chrome.
2. If profile-grid check shows the new Reel didn't appear: retry with a **10-minute** post-Share hold.
3. If second attempt also fails: stop and report. Manual intervention needed.

## Post-publish verification

URL captured by navigating to the profile and reading the most recent post link. No HTTP-level verification.

## Resetting a stuck IG Reel

```
node -e "
const fs=require('fs');
const d=JSON.parse(fs.readFileSync('data/shorts.json','utf8'));
for (const s of d.shorts) {
  if (s.platforms.ig_reels?.status === 'posting' || s.platforms.ig_reels?.status === 'failed') {
    s.platforms.ig_reels.status = 'pending';
    delete s.platforms.ig_reels.error;
    console.log('Reset', s.id);
  }
}
fs.writeFileSync('data/shorts.json', JSON.stringify(d, null, 2));
"
```

## Hashtag policy (added 2026-05-29)

Short captions must NOT contain visible `#hashtags`. The poster script strips inline `#word` tokens from the caption body via `scripts/lib/strip-hashtags.js` before posting. Cashtags (`$KAS`, `$BTC`) are preserved. The dedicated platform keyword/tags field (where one exists) is left intact — that is invisible metadata, not a visible hashtag. This is automatic; no manual step needed.
