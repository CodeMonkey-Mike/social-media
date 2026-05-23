---
name: chrome-upload
description: Per-platform knowledge for uploading videos to Rumble, BitChute, Instagram, X, and Facebook via a standard Chromium browser (Playwright). Loaded by the chrome-uploader subagent. The actual upload scripts live in `<repo>/uploaders/{rumble,bitchute,instagram,x,facebook}_upload.py`. This skill is reference material for the subagent — gotchas, field formats, fallback rules. Do not invoke this skill directly from chat; the orchestrator dispatches the chrome-uploader subagent which loads it.
---

# Chrome upload — per-platform knowledge

This skill carries the field-level and gotcha-level knowledge for each Chrome-driven platform. The chrome-uploader subagent loads it before doing any work. The actual browser automation lives in standalone Python scripts under `<repo>/uploaders/`.

**Runtime:** Playwright + real Chrome (`channel="chrome"`), headed mode, per-platform persistent profile dirs (`~/.chrome_<platform>_profile/`). Each platform script handles its own login persistence.

---

## Caption / post body formatting (cross-platform)

The metadata `description` field is **only** used on Rumble and BitChute. On Instagram and X, the post body is built from `title` + `tags` (rendered as hashtags). Specifically:

- **Rumble:** dedicated Title and Description fields. Tags as comma-separated, **no `#`**, all entries.
- **BitChute:** dedicated Title and Description fields. "Search Terms" is space-separated, **no `#`**, **first 3 only**.
- **Instagram:** combined caption. `title` + blank line + first 3 tags as `#tag #tag #tag`. No description.
- **X:** combined post body. `title` + blank line + first 5 tags as `#tag #tag #tag #tag #tag`. No description. **Mind the 280-character limit** for free accounts — drop tags from the end until it fits.

---

## Rumble

- **URL:** `https://rumble.com/upload.php`
- **File input:** `id="Filedata"`, `class="hidden-upload"`. Standard `<input type="file">`.
- **Form fields (right side of upload page):**
  - Video Title → `title`
  - Video Description → `description`
  - Primary category dropdown — **required**. Default `Finance & Crypto`. Map from `metadata.categories.rumble.primary`.
  - Secondary category — optional, leave blank by default.
  - Tags — comma-separated, **all** entries from `tags`, no `#` prefix.
  - VIDEO THUMBNAILS — 3 auto-generated boxes plus "or choose your own" file input (`id="customThumb"`). If a thumbnail file exists, upload it to the customThumb input. Otherwise pick the first auto-generated thumbnail (which appears once the video upload completes).
  - VISIBILITY radio: Public / Unlisted / Private — map from `visibility`.
- **Two-step submit flow:**
  1. After all fields filled and video upload completes, click the green **"Upload"** button at the bottom.
  2. The page transitions to a licensing/terms page. Default license is **"Rumble Only"** (non-exclusive, similar to YouTube) — leave it. Check the two terms-and-conditions checkboxes:
     - "You have not signed an exclusive agreement with any other parties."
     - "Check here if you agree to our terms of service."
  3. Click the green **"Submit"** button (bottom-right).
- **Capture URL:** the success page shows `Direct Link: https://rumble.com/v<slug>-<title>.html`. Extract that.
- **Auto-publish authorization:** the user has authorized auto-checking the rights/license boxes for their own uploads. If the rights statement on the page has visibly changed (new wording, new checkbox, additional consent), pause and surface the change before proceeding.

## BitChute

- **Precheck — minimum file size:** BitChute rejects videos smaller than **1 MB** at the form level. Check `video_path.stat().st_size >= 1_000_000` before navigating; if smaller, return `{status: "skipped", error: "file under 1 MB minimum"}`.
- **Reaching the upload form (do NOT navigate to `/upload/` directly):** the URL `https://www.bitchute.com/upload/` is a *user profile*, not the upload page. Real flow:
  1. Navigate to `https://www.bitchute.com/`.
  2. Click the **`+Video` icon** in the top-right toolbar (camera with a plus). A small dropdown appears with "Upload Video" and "Go live".
  3. Click **"Upload Video"**. BitChute opens a *new tab* with a one-shot signed URL on a subdomain like `up115.bitchute.com/videos/upload/?upload_code=...`. Switch to that new tab and use it for the rest of the flow. Don't try to bookmark or reuse this URL — it expires.
- **File input:** standard `<input type="file">` for the video selector.
- **Title / Description:** standard text input + textarea. Title up to 100 chars; description up to 3,000 (5,000 for members). Description is labeled "(Optional)" but include it from metadata.
- **Category:** the form does **not** expose a category field. Skip silently.
- **Thumbnail (REQUIRED):** the thumbnail field is labeled "(Required)" — BitChute will not let you proceed without one.
  - **Preferred path 1 — file alongside the video:** if a thumbnail file exists alongside the video, upload it via the thumbnail file input. Done.
  - **Preferred path 2 — extract a frame with ffmpeg (most reliable when no thumbnail file is provided):** before navigating to BitChute, run `ffmpeg -ss 1 -i <video> -frames:v 1 -q:v 2 <tmp>.jpg -y` to grab the frame at the 1-second mark, then upload that .jpg via the thumbnail file input the same way. This is the **recommended fallback** when no thumbnail file is provided — it works regardless of how BitChute's in-page video player behaves.
  - **Fallback path — "Grab Thumbnail" button:** the button captures the current frame from BitChute's in-page video player. Theoretically you advance the player past 0:00 (play→pause to seek to ~0:01) and click Grab Thumbnail. **Observed in practice (live test on a 21 MB short):** BitChute sets a `blob:` URL on a hidden `<video>` element but the element never decodes a frame (`readyState` stays at 0, `videoWidth`/`videoHeight` stay at 0), so Grab Thumbnail produces a 0-byte file with error "File is of invalid type. Expects image/jpeg, image/jpg or image/png." Calling `video.load()` and waiting doesn't help. **Don't rely on this path.** Detect a 0-byte thumbnail in the upload list, remove it via the X button on its row, and fall back to ffmpeg.
- **Content Sensitivity (Required):** dropdown defaulting to "Normal - Suitable for ages 16 and over". Leave default unless metadata specifies otherwise.
- **Search Terms (tags):** field labeled "Search Terms (Max 3, separated by spaces)". First 3 entries from `tags`, joined by **single spaces**, no `#`.
- **Publish right away:** pre-checked checkbox. Leave it.
- **Submit:** publish button is labeled **"Proceed"** (not "Submit" or "Upload"). After Proceed, BitChute redirects to `https://www.bitchute.com/content` — the just-uploaded video appears at the top with status "Process publish" — that's normal, BitChute auto-publishes once encoding finishes. Return `{status: "processing", url: "https://www.bitchute.com/content"}`.
- **Upload errors near the end (~95–98%) on long-form videos — retry once before giving up.** Observed live on a 608 MB / 57-minute video: upload progressed to ~96%, flipped to "Error during upload" with a "tap to retry" affordance (circular-arrow icon at the right end of the video file row). Clicking it restarts the video upload from 0% but **preserves all metadata** (title, description, thumbnail, content sensitivity, search terms, publish-right-away). Retry succeeded on the second attempt. **Do not refresh the page** — that loses metadata.

## Instagram

**Runtime: instagrapi (private mobile API) — NOT Playwright web UI**

Instagram's web app detects Playwright automation and silently suppresses the upload dialog (the "Post" submenu closes but no file picker or modal ever appears — confirmed across synthetic clicks, JS `.click()`, `force=True`, mouse coordinates, and `dispatchEvent`). Do NOT attempt the web Create flow.

**Use `uploaders/instagram_upload.py` (which is `instagram_api_upload.py` under the hood)** — it calls Instagram's private mobile API via instagrapi, bypassing the browser entirely.

### One-time setup (first run only)

1. Run `python uploaders/instagram_login_setup.py` — opens Chrome to `instagram.com`. User logs in manually. The script auto-detects login (polls for `/direct/inbox/` link) and saves the session to `~/.chrome_instagram_profile/`.
2. That profile is then read on every upload run to extract the `sessionid` cookie via a headless Playwright session (no browser window needed).

### Upload flow (automated, no browser window)

1. **Extract session:** open a headless Playwright+Chrome session against `~/.chrome_instagram_profile/`, navigate to `instagram.com`, call `context.cookies()`, pull out the `sessionid` cookie value (URL-decode it).
2. **Login with instagrapi:** `cl = Client(); cl.login_by_sessionid(session_id)`.
3. **Generate thumbnail:** run `ffmpeg -ss 1 -i <video> -vframes 1 <tmp>.jpg -y` to extract frame at 1s. instagrapi requires a thumbnail for clip_upload — it cannot generate one itself without MoviePy.
4. **Upload as Reel:** `cl.clip_upload(video, caption=caption, thumbnail=thumb)`. Returns a media object with `.code` attribute.
5. **URL:** `https://www.instagram.com/reel/{media.code}/`
6. **Fallback:** if `clip_upload` raises, retry with `cl.video_upload(video, caption=caption, thumbnail=thumb)` → URL is `https://www.instagram.com/p/{media.code}/`.

### Caption format
`title` + blank line + first 5 tags as `#tag #tag #tag`. Max 2,200 characters.

### Visibility
Instagram has no per-post privacy toggle. If `private` is requested, return `{status: "skipped", error: "Instagram has no per-post privacy"}`.

### Required deps
```
pip install instagrapi
```
ffmpeg must be on PATH (already installed at `C:\Users\mnede\AppData\Local\Microsoft\WinGet\Packages\...`).

## Facebook

- **URL:** `https://www.facebook.com/realCodeMonkeyMike/` (the user's Page). Override with `FACEBOOK_PAGE` env var if needed.
- **Login persistence:** `~/.chrome_facebook_profile/` — first run requires manual login in the opened Chrome window. Session persists across runs.

### Switch to Page context first (critical)
When you navigate to the Page URL, Facebook shows a yellow banner: **"Switch into CodeMonkey-Mike's Page to start managing it."** with a **"Switch Now"** button. The create-post composer is only visible after switching. Always check for and click Switch Now before looking for the composer. After switching, reload may or may not happen — wait and then proceed.

### Finding the create-post composer
- The "What's on your mind?" area uses `div[role="button"]:has-text("What")` — not a standard button role.
- Click it to open the Create post modal.

### Attaching the video (file chooser intercept)
- Inside the Create post modal, find the **"Photo/video"** button (exact aria-label, visible at the bottom of the composer). **Use `page.expect_file_chooser()` to intercept the native file dialog** — clicking Photo/video immediately triggers a file chooser. Use `fc.set_files(str(video))`.
- Do NOT try to find a hidden `input[type="file"]` directly — the file chooser intercept is the reliable path.

### Caption field
- After attaching the video, the caption `div[contenteditable="true"][role="textbox"]` appears.
- Click it using `.evaluate("el => el.click()")` (JS click) or `click(force=True)` — a React overlay div may intercept Playwright's normal pointer click.
- Type with `keyboard.type(body, delay=random.randint(60, 120))` for human-like per-keystroke delay.
- **Hashtag autocomplete:** Facebook auto-suggests hashtags as you type `#tag`. The dropdown appears but you can ignore it — just proceed to click the Next button. **Do NOT press Escape to dismiss it** — Escape closes the entire composer modal.

### Upload progress
- Facebook shows a green progress bar with `"100%"` text when the video upload finishes.
- After 100%, Facebook runs a **"Checking for copyrighted content"** step. Wait for that text to disappear before advancing.

### 3-step wizard (Create post → Edit reel → Reel settings)
Facebook's Reel upload is a 3-step wizard. Navigate with **"Next"** buttons, then a final **"Post"** button.

**Step 1 — Create post:** caption + video. Click **Next**.  
**Step 2 — Edit reel:** add tags, trim, closed captions, etc. Click **Next**.  
**Step 3 — Reel settings:** Post audience (Public), Enable remixing, Tag and collaborate, Scheduling options, Share to groups, Share to story, Boost post. Click **Post**.

Key rules for the wizard:
- **Never press Escape inside the wizard loop.** Escape closes the entire composer, not just dropdowns.
- Use `page.get_by_role("button", name="Next").first` — no scoping needed, no other "Next" buttons exist on the page.
- Use `page.get_by_role("button", name="Post", exact=True).first` — `exact=True` is required to avoid matching "Like CodeMonkey-Mike's **post**" and similar aria-labels on background feed items.
- Facebook does NOT use `role="dialog"` on its composer — **do not scope locators to `[role="dialog"]`**, it will never match.
- The Post button on the Reel settings step may report as `disabled` to Playwright (via `aria-disabled` or `disabled` attribute) even though it appears blue and clickable. Click it anyway — the JS handler still fires.

### After clicking Post
1. Facebook shows a **"Make it easier to contact you — Add a WhatsApp button"** upsell popup. Click **"Not now"** to dismiss.
2. After dismissing, the Reel settings page shows a **"Posting…"** spinner while the reel uploads to Facebook's servers.
3. Wait for **"Posting"** text to disappear AND the Reel settings page to close. This takes a few seconds to ~1 minute depending on file size.
4. Once Reel settings is gone, the reel is published.

### Capturing the post URL
Navigate to `https://www.facebook.com/{page_handle}/videos`. The newest reel appears near the top. Extract links matching `/reel/<ID>/` (not the generic `/reel/?s=tab`). Strip query params with `.split("?")[0]`. The reel URL format is `https://www.facebook.com/reel/<ID>/`.

### Post body format
Combined caption: `title` + blank line + first 3 tags as `#tag #tag #tag`. The `description` field is **NOT used** on Facebook — short punchy format only.

### Thumbnail
The upload modal has a **"Thumbnail"** tab. If a thumbnail file is provided, click the tab and upload via `input[type="file"][accept*="image"]`. Otherwise leave the auto-selected frame. Thumbnail handling is best-effort — failures should warn and continue.

### Notification panel on load
Facebook may open the notifications panel automatically on page load (if unread notifications exist). Dismiss it by clicking the bell icon twice (toggle open/closed) and pressing Escape once — but only before the composer is open. Never press Escape after the composer opens.

## X (formerly Twitter)

- **URL:** `https://x.com/compose/post`
- **File input:** the media button (paperclip / photo icon) opens a file picker. Find the `<input type="file" accept="video/*,image/*">` element directly and use `set_input_files`.
- **Post body format:** combined field. `title` + blank line + first 5 tags as `#tag #tag #tag #tag #tag`. **Mind the 280-character limit** for free accounts (X Premium gets up to 25,000). If `title` + 5 hashtags exceeds 280 and the user isn't on Premium, drop tags from the end one at a time until it fits, and warn in the result.
- **Video length limit:** 2:20 (140 seconds) for free accounts, longer for Premium. If the video is longer and the user isn't on Premium, X will reject it. Precheck and return `{status: "skipped", error: "video exceeds 2:20 free-tier limit"}` rather than attempting.
- **Thumbnail:** X doesn't expose a custom thumbnail UI on web compose. Skip thumbnail handling.
- **Visibility:** X has no per-post unlisted/private. `public` is the only option; `private` would mean switching to a protected account, out of scope. If `private` requested, skip with reason.
- **Wait for upload to finish before publishing:** the Post button stays *visually enabled* while the video is still uploading, but **clicking it during upload silently fails**. Wait until the modal shows `<filename>: Uploaded (100%)` below the video preview before clicking Post. Polling for that "Uploaded (100%)" string is the reliable signal.
- **Publish:** click **"Post"**. URL bar updates to `x.com/<handle>/status/<id>` after publish. Capture that URL.

---

## Login persistence

Each platform script uses a Playwright `launch_persistent_context` with a profile dir at `~/.chrome_<platform>_profile/`. First run for each platform requires the user to log in manually inside the launched window — the script detects the redirect to a login URL and waits up to 5 minutes. Cookies persist across runs.

---

## Required Python deps

```
pip install playwright instagrapi
```

Chrome must be installed on the machine (standard install location). No `playwright install chromium` needed — `channel="chrome"` uses your real Chrome. No Camoufox needed for any chrome platform.

**Instagram only:** also requires ffmpeg on PATH for thumbnail generation. instagrapi cannot auto-generate thumbnails without MoviePy — pass one explicitly instead.

---

## Cross-cutting failure modes

- **Login required:** any script lands on a `/login` URL → return `{status: "skipped", error: "not signed in"}` after waiting briefly to see if the user logs in.
- **Selector drift:** platforms rewrite their DOMs frequently. If a known-good selector fails, the script should screenshot, save it as `~/.upload_failures/<platform>_<timestamp>.png`, and return `{status: "failed", error: "selector drift on <field>"}`. Don't crash silently.
- **Video upload bandwidth:** large files take real time. Don't time out aggressively. Use upload-progress polling where the platform exposes it; otherwise wait on the publish button becoming clickable, with generous timeouts (5–10 minutes for large files).

---

## Output contract

Each script writes a single JSON line to stdout as its **last line** so the subagent can parse it:

```json
{"platform": "rumble", "status": "published", "url": "https://rumble.com/v794ysw-i-cant-stop-winning-market-update-hot-crypto-picks.html"}
```

Status values match the orchestrator contract: `published`, `processing`, `staged`, `skipped`, `failed`. Include `error` on the latter two.

Other lines (progress logs, etc.) go to stderr or are clearly non-JSON so the subagent can ignore them.
