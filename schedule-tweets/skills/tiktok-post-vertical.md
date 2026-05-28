---
name: tiktok-post-vertical
description: Post the next pending TikTok vertical video from data/shorts.json by CDP-attaching to a dedicated tiktokbot-profile Chrome.
---

## Invocation

```powershell
cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets
node scripts/post-tiktok-short.js
```

**Kill all Chrome windows first** — Chrome can't open CDP on a profile that's already in use. Run before the script:

```powershell
Stop-Process -Name chrome -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 3
node scripts/post-tiktok-short.js
```

## Why this script is different

TikTok aggressively detects Playwright's `launchPersistentContext` — even with `--disable-blink-features=AutomationControlled`. The fix: **spawn real Chrome via CDP, then attach Playwright.** TikTok sees a normal Chrome session with real fingerprints, not an automation launch.

## Queue file

`C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\shorts.json` → `platforms.tiktok`

## Chrome profile

**`tiktokbot-profile`** — `C:\Users\mnede\AppData\Local\Google\Chrome\tiktokbot-profile` (dedicated bot profile, TikTok logged in as of 2026-05-24).

**Do NOT use main `User Data`** — the main Chrome profile takes too long to restore its session tabs, consistently failing to open CDP within the timeout. All other bot scripts (xbot, igbot, ytbot, etc.) use dedicated profiles for the same reason; TikTok now follows the same pattern.

**Why a dedicated profile works now:** earlier attempts at a dedicated profile failed at login — TikTok blocked the login page entirely on profiles with no browsing history or session. The only workaround was main Chrome (with real history and cookies). On 2026-05-24, the user manually logged into TikTok on `tiktokbot-profile` while the script was waiting, establishing a real session. With that session in place, TikTok no longer blocks the upload flow. If TikTok ever blocks again on this profile, the user will need to log in manually (the script waits up to 10 minutes on the login page).

**ALL Chrome windows must be fully closed before running** — Chrome can't open a second instance against a profile already in use. Use `Stop-Process -Name chrome -Force` before every run.

## Timing constants

| Constant | Default | Purpose |
|---|---|---|
| `PRE_COMPOSE_MIN/MAX` | 60–180s | Wait before attaching video |
| `PRE_POST_MIN/MAX` | 60–180s | Wait before clicking Post |
| `ACTION_MIN/MAX` | 4–7s | Pause between major UI actions |
| `CHAR_DELAY_MIN/MAX` | 60–150ms | Per-keystroke delay for caption typing |

## What the script does

1. Reads queue, finds first `pending` TikTok short, marks `posting`
2. Spawns real Chrome with main User Data + CDP port 9224 (or detects existing). Connects Playwright via CDP.
3. Navigates to `https://www.tiktok.com/tiktokstudio/upload?lang=en`
4. **Login handling:** if TikTok redirects to `/login`, waits up to 10 minutes for manual sign-in. After login, navigates back to upload page.
5. **Pre-compose wait: 60–180s**
6. `DOM.setFileInputFiles` via raw CDP session on `input[type="file"]` to attach the .mp4 (no 50MB limit)
7. Waits up to 90s for the caption composer (`div[contenteditable="true"][role="combobox"]`)
8. Dismisses any onboarding overlay (`[data-test-id="overlay"]` → `button[data-action="skip"]`)
9. Clicks into caption field, `Ctrl+A` + `Delete` to clear TikTok's auto-populated filename, then types caption at 60–150ms/char
10. **Pre-post wait: 60–180s**
11. Clicks Post button. If confirmation dialog appears, clicks the second Post to confirm.
12. Waits up to 5 min for success toast OR URL redirect to `/tiktokstudio/content`
13. Navigates to `/tiktokstudio/content`, waits 5–9s, scrapes most recent `/video/<id>` link
14. **Post-publish verification:** navigates to captured URL, confirms HTTP 2xx + `<video>` OR `[data-e2e*="video"]` OR `meta[property="og:video"]`. Only marks `posted` if both confirmation fired AND URL verifies.

## Key implementation details

**TikTok pre-fills the caption with the filename.** After `setInputFiles()`, the composer auto-populates with the file's display name. Without clearing, the typed caption appends to the filename. Solution: `Ctrl+A` + `Delete`, then type.

**The Post button triggers a confirmation dialog.** Clicking "Post" opens a dialog with another "Post" to confirm. Re-query for Post after the first click and click again if the dialog appears.

**Two completion signals — accept the first.** TikTok shows a success toast briefly, but the more reliable signal is the URL redirect to `/tiktokstudio/content`.

**Chrome is killed as soon as the URL is captured** — immediately after the video URL is scraped from the content dashboard, Chrome is closed before the HTTP verification step. Verification is done via a plain HTTPS request, no browser needed. On error paths, the `finally` block kills Chrome as a safety net. Do not leave Chrome open after the script exits; it blocks other scripts that need CDP on port 9224.

## 50MB Playwright CDP cap — SOLVED via DOM.setFileInputFiles

Playwright's `setInputFiles()` via CDP refuses files larger than 50MB: `Cannot transfer files larger than 50Mb to a browser not co-located with the server`. This is a Playwright client-side cap, not TikTok's (TikTok allows up to 500MB).

**The fix (implemented 2026-05-24):** the script uses `DOM.setFileInputFiles` via a raw CDP session instead of Playwright's `setInputFiles`. This sends only the file *path* to Chrome (which reads the file locally), bypassing the Playwright data-transfer limit entirely. No file size limit. No ffmpeg re-encoding needed.

```js
const cdp = await ctx.newCDPSession(page);
const { root } = await cdp.send('DOM.getDocument');
const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: 'input[type="file"]' });
await cdp.send('DOM.setFileInputFiles', { files: [videoPath], nodeId });
await cdp.detach().catch(() => {});
```

If this ever breaks (Chrome API change), the fallback is ffmpeg re-encode to bring the file under 50MB:
```powershell
ffmpeg -y -i video.mp4 -c:v libx264 -crf 26 -preset fast -c:a aac -b:a 128k video-small.mp4
```

## Debug artifacts

Each phase saves to `tmp-tiktok-debug/`:
- `01_landed.{png,json}` — initial upload page or login redirect
- `02_composer_ready.{png,json}` — after video attach + composer found
- `03_caption_done.{png,json}` — after caption typed
- `04_after_post_click.{png,json}` — after first Post click
- `05_confirmed.{png,json}` — after redirect to /tiktokstudio/content

## Camoufox fallback (not currently used)

If CDP-attach stops working, the Python reference at `C:\Users\mnede\Documents\Claude\social-media\uploading\uploaders\tiktok_upload.py` uses Camoufox (fingerprint-patched Firefox) with session-cookie save/restore. Invoke via the `camoufox-uploader` subagent. Plan B only.

## Resetting a stuck short

```
node -e "
const fs=require('fs');
const d=JSON.parse(fs.readFileSync('data/shorts.json','utf8'));
const s=d.shorts.find(x=>x.platforms.tiktok?.status==='posting'||x.platforms.tiktok?.status==='failed');
if(s){s.platforms.tiktok.status='pending';delete s.platforms.tiktok.error;fs.writeFileSync('data/shorts.json',JSON.stringify(d,null,2));console.log('Reset:',s.id);}
"
```
