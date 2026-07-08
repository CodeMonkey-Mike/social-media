---
name: ig-post-single
description: Post the next pending Instagram single-image post from data/ig-single-image.json via Playwright script.
---

> ✅ **FIXED 2026-05-25:** symptom was `input[type="file"]` never attaching after Create → "Post" (timeout). ROOT CAUSE was NOT a selector change — IG pops a **"Turn on Notifications" modal** on load that traps focus and blocks the whole Create flow (Post sub-link never appears, file input never injected). FIX: `dismissBlockingDialogs()` clicks **"Not Now"** after home-load AND before the Create click. Same fix applied to reel + carousel. If IG posting ever breaks at the file-input step again, FIRST check for a new blocking modal (notifications, "save login info", cookie banner) before touching selectors — run `scripts/_diag-ig-create.js` to dump dialogs/clickables at each step.

## Invocation

```powershell
cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets
node scripts/post-ig-single.js
```

Picks up the first post with `status === "pending"` from `data/ig-single-image.json`, posts it, and writes `status: "posted"`, `posted_at`, and `post_url` back to the file.

## Queue file

`C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\ig-single-image.json`

## Chrome profile

Uses `igbot-profile` (`C:\Users\mnede\AppData\Local\Google\Chrome\igbot-profile`). **Chrome must be fully closed before running.**

```powershell
Stop-Process -Name chrome -Force -ErrorAction SilentlyContinue
```

## Timing (from master timing reference)

| | Value |
|---|---|
| `CHAR_DELAY` | 5–40 ms/char |
| `ACTION` | 1–5s between UI actions |
| `PRE_COMPOSE` | 1–15s |

## What the script does

1. Reads queue, finds first `pending` post, marks `posting`
2. Launches Chrome with `igbot-profile`
3. Navigates to `https://www.instagram.com/`, checks for login form — aborts if present
4. Clicks `[aria-label="New post"]` in left sidebar
5. Clicks "Post" sub-link from the expanded sidebar
6. Calls `setInputFiles()` on the hidden file input to upload the image
7. **Selects 4:5 (portrait) crop** — see CRITICAL note below
8. Clicks Next (Crop step), Next (Filter/Edit step)
9. Focuses caption textarea, types: `caption text` + blank line + top 3 hashtags
10. Verifies caption is non-empty, then clicks Share
11. Navigates to profile page, grabs first `/p/` link as post URL
12. Writes `status: "posted"`, `posted_at`, `post_url` back to JSON

## CRITICAL — 4:5 crop must be selected explicitly

IG defaults to 1:1 for image uploads; Mike's spec is 4:5. The "Select crop" trigger (`SVG aria-label="Select crop"`) opens a menu with four options (Original / 1:1 / 4:5 / 16:9 — each a `<div role="button">` wrapping text + SVG). The menu opens **on click** in the image flow (opposite of Reel flow which uses hover). Working pattern:

```js
await cropTrigger.scrollIntoViewIfNeeded();
await cropTrigger.click();                   // image flow: click opens menu
await page.waitForTimeout(400);
const coords = await page.evaluate(() => {
  for (const el of document.querySelectorAll('[role="button"]')) {
    const span = el.querySelector('span');
    if (span?.textContent.trim() === '4:5') {
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

**Carousels do NOT need crop selection** — Mike's carousels are 1:1 (IG's default).
**Reels use hover to open the menu; single-image uses click** — same DOM element, different React handlers.

## Key implementation details

**Login check is negative, not positive.** Check for `input[name="username"]` (login form presence) — NOT for nav elements. Instagram's nav selectors are unreliable as positive signals.

**"New post" expands the sidebar inline — not a floating menu.** Clicking `[aria-label="New post"]` expands the left sidebar to show "Post" and "AI" sub-links. No floating popover. Find and click the "Post" sub-link:
```javascript
page.getByRole('link', { name: /^Post$/ })
  .or(page.getByRole('button', { name: /^Post$/ }))
  .first()
```

**The file input is always hidden — use `state: 'attached'`, not `state: 'visible'`.** Instagram's `<input type="file">` is `display:none` intentionally. `setInputFiles()` works on hidden inputs without making it visible.

**Two "Share" buttons exist on the caption step.** Use `.first()` to avoid a strict mode violation.

**Caption typing: `page.keyboard.type()` at 5ms/char works fine.** IG's caption textarea is a standard contenteditable — direct typing is reliable. No clipboard paste needed (unlike X).

**Post URL: navigate to profile and evaluate `document.querySelector('a[href*="/p/"]').href`** after sharing.

**`--user-data-dir` in PowerShell must have no inner quotes.** Pass as `"--user-data-dir=C:\path\igbot-profile"` — NOT `'--user-data-dir="C:\path\igbot-profile"'`. Inner quotes cause Chrome to silently ignore the flag.

**Never close Chrome < 5 minutes after clicking Share.** IG processes uploads server-side after the UI confirms. Closing early silently drops the post with no error. Retry once at 10 min if the post doesn't appear; then report.

**"Confirmation dialog not detected" is now normal — don't treat it as an error.** The `waitForSelector('text="Your post has been shared."')` no longer fires in any observed run. IG either changed the confirmation text or removed the dialog entirely. The script falls through to the post-check (profile-grid scrape), which is the authoritative success signal. If a future regression breaks the post-check, fix that — don't try to revive the share-confirmation selector.

**Post-check "Hook ... not found in caption" FALSE-NEGATIVES on cashtag captions — VERIFY the captured URL before treating as failed (do NOT retry).** (Hit 2026-06-14 on a `$KAS`/`$BTC` caption.) The script grabs a fresh `/p/<id>` URL (proof a post was created), then fails the run because the rendered caption it reads back doesn't contain the hook text — captions with cashtags (`$KAS`, `$BTC`) read back differently (IG's og/meta-description escaping). The post is almost always LIVE. Resolution: `curl` the captured `/p/<id>` URL and check for `<meta property="og:type" content="article">` (a live post). If live, set that entry `status:"posted"` with the captured URL + a note — **never reset to `pending` / re-run**, that double-posts. Only treat as a true failure if the URL is genuinely dead. (Same shape as the FB/Rumble stale-URL rule: a verification miss is not a posting miss.)

## Resetting a stuck post

```
node -e "
const fs=require('fs');
const d=JSON.parse(fs.readFileSync('data/ig-single-image.json','utf8'));
const p=d.posts.find(x=>x.status==='posting'||x.status==='failed');
if(p){p.status='pending';delete p.error;fs.writeFileSync('data/ig-single-image.json',JSON.stringify(d,null,2));console.log('Reset:',p.id);}
"
```

## Re-logging in

```powershell
Start-Process "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "--user-data-dir=C:\Users\mnede\AppData\Local\Google\Chrome\igbot-profile", "--no-first-run", "https://www.instagram.com/"
```
Log into @realcodemonkeymike, then close Chrome with the X button (graceful close — not Task Manager — so cookies save).
