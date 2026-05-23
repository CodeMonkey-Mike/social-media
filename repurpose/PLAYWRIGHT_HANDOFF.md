# Repurpose: Playwright handoff

This doc explains the Playwright-based image generation pipeline that lives in this folder. Read it before touching `generate-image.js` or `setup-chatgpt.js`. It captures the conventions that took trial and error to land on; mess with them at your own risk.

A sister handoff lives at `C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\PLAYWRIGHT_HANDOFF.md` for the X posting scripts. Many of the patterns here come from that one; deviations are called out below.

---

## What this pipeline does

Generates a single image via the persistent "X Tweets" ChatGPT chat and saves it to the schedule-tweets queue folder with the canonical filename:

```
C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\images\x\x-tweets-<image_id>-<slug>.png
```

The schedule-tweets posting scripts later pick the file up by `image_id` and attach it to the corresponding tweet.

This pipeline replaces an older Chrome-MCP-based flow that broke because the OS Save As dialog (owned by Chrome at the "read" tier) couldn't be clicked through automation. Playwright sidesteps the dialog entirely by intercepting the image at the network layer.

---

## Files

| File | Purpose |
| --- | --- |
| `package.json` | Declares `playwright` dependency. |
| `setup-chatgpt.js` | One-time login helper. Opens xbot-profile at chatgpt.com so you can sign in. Session persists in the profile automatically; no file is written. |
| `generate-image.js` | The main script. Parses CLI args, launches Chrome via xbot-profile, generates one image, saves it to `schedule-tweets/images/x/` (x-tweets) or `schedule-tweets/images/yt/` (yt-posts). |
| `node_modules/`, `package-lock.json` | Created by `npm install`. |

---

## One-time setup

```powershell
cd C:\Users\mnede\Documents\Claude\social-media\repurpose
npm install
node setup-chatgpt.js
```

The setup script opens xbot-profile at chatgpt.com. Sign in if needed, then return to the terminal and press Enter. The session is saved automatically in the profile — no file is written.

Re-run `setup-chatgpt.js` only if Chrome wipes xbot-profile or logs you out of ChatGPT (rare).

---

## Per-image invocation

```powershell
cd C:\Users\mnede\Documents\Claude\social-media\repurpose
node generate-image.js --image-id=<8hex> --slug=<kebab-slug> --prompt="<full prompt>"
```

Or for prompts too long to fit on one shell line:

```powershell
node generate-image.js --image-id=<8hex> --slug=<kebab-slug> --prompt-file=path\to\prompt.txt
```

For YouTube post carousel slides, add `--prefix=yt-posts`:

```powershell
node generate-image.js --prefix=yt-posts --image-id=<8hex> --slug=<seq>-<slide-slug> --prompt="..."
```

Args:

- `--image-id` — exactly 8 hex chars. Generate fresh ones with `python -c "import uuid; print(uuid.uuid4().hex[:8])"`. **Reuse the same id when regenerating** the same image — the file is overwritten in place.
- `--slug` — lowercase kebab-case. For carousel slides, format as `<seq>-<topic>` (e.g. `01-hook`, `02-tps-stat`).
- `--prefix` — optional, defaults to `x-tweets`. Use `yt-posts` for YouTube carousel slides.
- `--prompt` or `--prompt-file` — the full prompt text. See `SKILL.md` for prompt rules per mode.

---

## How it works under the hood

### Auth pattern

`generate-image.js` launches Chrome via `chromium.launchPersistentContext` with `xbot-profile` — the same dedicated Chrome profile used by the reply-guy and other automation scripts. The profile persists cookies and localStorage automatically, so no auth file is needed.

`xbot-profile` is a separate profile from Mike's main Chrome profile, so the main browser stays open and unlocked. The only constraint: any other script that uses xbot-profile (reply-guy scripts, etc.) must not be running at the same time, since Chrome locks a profile while it's open.

### Stealth flags

We pass the same anti-detection args as the schedule-tweets scripts (`--disable-blink-features=AutomationControlled`, `ignoreDefaultArgs: ['--enable-automation']`, override `navigator.webdriver`). ChatGPT doesn't seem to care, but consistency with the X scripts means one less thing to debug if behavior changes.

### Navigation — two modes

**X tweet images:** always pass `--chat-url` pointing at the dedicated persistent "X Tweets" chat. Never omit the flag — omitting it opens a fresh `https://chatgpt.com/` chat on every run, creating a new sidebar entry in ChatGPT each time. X Tweets chat URL: `https://chatgpt.com/c/69fe9134-a5a8-83ea-995a-6912aa4d2a24`.

**YouTube carousel images:** `--chat-url=https://chatgpt.com/c/69ffc14c-3994-83ea-8f79-48845459ecfa` → uses the persistent "YouTube Images" chat.

Both persistent chats are safe because the 10-second generation delay filter ignores cached sidebar images on page load. Do not use the YouTube chat URL for X tweet images or vice versa.

### Typing

We use `page.keyboard.type(prompt, { delay: 15 })` — much faster than the 60–180ms per-char delay the X scripts use. The X delay exists to defeat React's contenteditable batching on x.com and to avoid bot detection. Neither concern applies on chatgpt.com, so we type at near-paste speed.

### Detecting the generated image

After pressing Enter, we poll for `<img>` elements whose `src` contains `chatgpt.com/backend-api` (ChatGPT's current image CDN path). Logic:

1. Snapshot count of matching images **before** sending the prompt.
2. After sending, poll every 1.5s for the count to increase.
3. When a new image appears, grab its `src`.
4. **Wait 3s and re-read the `src`.** ChatGPT sometimes swaps a low-res preview for the final asset; the 3s stability check ensures we download the final URL.

Max wait is 5 minutes. If nothing appears, the script throws.

### Downloading without the Save As dialog

This is the whole reason we moved to Playwright. Instead of clicking ChatGPT's download button (which triggers the OS Save dialog), we use:

```javascript
const response = await page.request.get(imgUrl);
const buffer = await response.body();
fs.writeFileSync(targetPath, buffer);
```

`page.request` shares the browser's auth context, so the authenticated CDN URL works without extra credentials. The OS Save dialog never appears.

### Selector block

All ChatGPT-specific selectors live in the `SEL` object near the top of `generate-image.js`. If ChatGPT redesigns and the script breaks, this is the only block that should need updating.

---

## Known limitations

- **Reference-image uploads not supported.** When a prompt needs an uploaded reference asset (face photo, lesser-known brand logo like DeAgent AI), the script can't help. Fall back to the manual ChatGPT flow for that one image, save it manually with the correct `x-tweets-<id>-<slug>.png` filename in `schedule-tweets/images/x/`, and update `data/x-tweets.json` as usual.
- **Saves on first generation; no preview-then-save.** The whole point is automation; iteration is "re-run with the same `--image-id` and a tweaked prompt." The file gets overwritten in place.
- **Single-account.** `CHAT_URL` and xbot-profile are tied to Mike's account. If xbot-profile gets wiped or logged out of ChatGPT, re-run `setup-chatgpt.js`.
- **No screenshot fallback.** If image detection fails, the script just throws. There's no debug screenshot saved. If you're debugging, add `await page.screenshot({ path: 'debug.png', fullPage: true })` in the catch block temporarily.

---

## Things NOT to change without thinking

- **Don't switch to `chromium.launch()` instead of `launchPersistentContext`.** The persistent variant lets us use real Chrome (`channel: 'chrome'`) instead of bundled chromium. ChatGPT may treat them differently.
- **Don't remove the 3s stability re-read** in `waitForGenerationComplete`. Without it, you sometimes save a 64-pixel preview thumbnail.
- **Don't hard-code the Save As approach with a click + waitForEvent('download').** That was tried; ChatGPT's download button sometimes opens a new tab instead of triggering a download event. The `page.request.get(src)` approach is more reliable.
- **Don't switch to Mike's main Chrome User Data dir.** xbot-profile is the right choice — it keeps the main browser unlocked and is consistent with all other automation scripts.

---

## Boundary with the schedule-tweets folder

This pipeline lives in `repurpose/` because **image generation is content creation** (same boundary as drafting tweets, threads, polls, YT posts). The schedule-tweets folder is for posting/scheduling decisions only.

The output PATH crosses the boundary: images are generated here but written to `schedule-tweets/images/x/` (x-tweets) or `schedule-tweets/images/yt/` (yt-posts) because that's where the posting scripts look. That's intentional — the queue lives with the scheduler; only the generation logic lives here.

If you're tempted to add posting logic to this folder or generation logic to schedule-tweets, stop and re-read this paragraph.
