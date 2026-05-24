---
name: tiktok-post-vertical
description: Post the next pending TikTok vertical video from data/shorts.json by CDP-attaching to the user's real Chrome.
---

## Invocation

```powershell
cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets
node scripts/post-tiktok-short.js
```

**IMPORTANT — manually launch Chrome first (CDP spawn from Node fails silently).** Run this before the script:

```powershell
Start-Process -FilePath "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList `
  "--user-data-dir=C:\Users\mnede\AppData\Local\Google\Chrome\User Data", `
  "--profile-directory=Default", "--remote-debugging-port=9224", "--no-first-run", "about:blank"
Start-Sleep -Seconds 6
node scripts/post-tiktok-short.js
```

The script detects the existing CDP port and prints "Chrome already on CDP 9224 ✓". Skip the script's internal spawn entirely.

## Why this script is different

TikTok aggressively detects Playwright's `launchPersistentContext` — even with `--disable-blink-features=AutomationControlled`. The fix: **don't launch Chrome via Playwright; spawn the user's REAL Chrome, then attach Playwright via CDP.** TikTok sees a normal Chrome session with real fingerprints.

## Queue file

`C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\shorts.json` → `platforms.tiktok`

## Chrome profile

**Main Chrome User Data directory** — `C:\Users\mnede\AppData\Local\Google\Chrome\User Data`, `--profile-directory=Default`.

**ALL Chrome windows must be fully closed before running** — Chrome can't open a second instance against the same User Data dir, and can't add `--remote-debugging-port` to an already-running instance. Use Task Manager to confirm no `chrome.exe` processes remain.

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
6. `setInputFiles()` on `input[type="file"]` to attach the .mp4
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

**Don't kill Chrome on exit.** The script ends with the user's real Chrome window still open. The script calls `browser.close()` on the Playwright CDP connection only (detaches without killing Chrome).

## CRITICAL — 50MB Playwright CDP cap

TikTok's actual upload limit is 500MB, but **Playwright connecting via CDP refuses files larger than 50MB**: `locator.setInputFiles: Cannot transfer files larger than 50Mb to a browser not co-located with the server`. This is a Playwright client-side cap, not TikTok's.

**Workflow when a video exceeds 50MB:**
```powershell
# Keep original as backup
Copy-Item video.mp4 video-original.mp4

# Re-encode to ~20MB at CRF 26 (visually lossless, ~30s for a 36s clip)
ffmpeg -y -i video-original.mp4 -c:v libx264 -crf 26 -preset fast -c:a aac -b:a 128k video.mp4
```

Compression ratio: ~2.5× (53MB → 21MB at CRF 26). Bump `-crf` higher for smaller; lower for higher quality. After compression, reset `tiktok` status to `pending` and re-run.

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
