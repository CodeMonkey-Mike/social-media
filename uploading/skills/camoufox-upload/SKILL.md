---
name: camoufox-upload
description: Per-platform knowledge for uploading videos to TikTok via Camoufox, a fingerprint-patched Firefox build that defeats anti-automation detection. Loaded by the camoufox-uploader subagent. The actual upload script lives in `<repo>/uploaders/tiktok_upload.py`. Facebook has moved to chrome-uploader. This skill is reference material for the subagent — gotchas, field formats, fallback rules. Do not invoke directly from chat; the orchestrator dispatches the camoufox-uploader subagent which loads it.
---

# Camoufox upload — per-platform knowledge

This skill carries the field-level knowledge for the platforms that block standard browser automation and need Camoufox to get through. The camoufox-uploader subagent loads it before doing any work. The actual browser automation lives in standalone Python scripts under `<repo>/uploaders/`.

**Runtime:** Camoufox (a Firefox fork that patches fingerprinting at the C++ layer) driven by Playwright's async API. Headed mode, `humanize=True` for realistic mouse movement, per-platform persistent profile dirs at `~/.camoufox_<platform>_profile/`.

**Why Camoufox:** TikTok detects standard Playwright/Selenium fingerprints and silently hangs the upload widget (file attaches, spinner spins forever, never reaches composer). Camoufox patches Firefox's fingerprint surface at the C++ level rather than via JS shims, which is harder to detect. Facebook has moved to the chrome-uploader (real Chrome via Playwright).

**Important caveat:** Camoufox handles fingerprint detection well, but TikTok/Facebook also run behavioral checks (mouse curves, dwell time, drag-and-drop sequencing). Camoufox's `humanize=True` helps but isn't a guarantee. Treat each upload as best-effort — if the script can't get through, return `{status: "failed", error: "anti-bot detection"}` rather than retrying indefinitely.

---

## Caption / post body formatting

Both TikTok and Facebook use a single combined caption/post field. Format:

- `title` (lead line)
- blank line
- first 3 entries from `tags`, each prefixed with `#`, space-separated

The `description` field from metadata is **NOT used** on either platform. The user prefers short punchy captions there.

---

## TikTok

- **URL:** `https://www.tiktok.com/upload?lang=en` — silently redirects to `https://www.tiktok.com/tiktokstudio/upload?lang=en` (TikTok Studio).
- **Hidden file input:** standard `<input type="file">` inside the upload widget. Use Playwright's `set_input_files`.
- **First-run onboarding overlay:** TikTok Studio shows a react-joyride onboarding overlay on first use. Detect via `[data-test-id="overlay"]` and dismiss with the Skip button (`button[data-action="skip"]`) or Escape key before interacting with the caption field.
- **Composer step (the gate Camoufox is trying to clear):** after `set_input_files`, wait up to 90 seconds for the caption composer to appear. Selectors to try in order: `div[contenteditable="true"][role="combobox"]`, `div[data-text="true"]`, generic `div[contenteditable="true"]`. **If the composer never appears within 90s, Camoufox didn't beat detection this run** — return `{status: "failed", error: "TikTok bot detection blocked the upload"}` and leave the window open for the user to finish manually if they want.
- **Caption field:** contenteditable div, **not a regular textarea**. `.fill()` is unreliable on contenteditable. Use `.click()` then `keyboard.type(caption, delay=35)` with realistic per-keystroke delay.
- **Visibility:** TikTok defaults to Public. Override only if `visibility != "public"`. Mapping: `public` → Everyone, `private` → Only me, `unlisted` → not supported (skip with reason).
- **Cover/thumbnail:** TikTok shows a "Cover" picker. If a custom thumbnail is provided, use the upload option; otherwise leave the auto-selected frame.
- **Publish:** click the **"Post"** button at the bottom. TikTok may show a confirmation dialog ("Are you sure you want to post?") — click the second Post button if it appears.
- **Confirmation:** wait for either a success toast (`text=/your video is being uploaded|video has been posted|posted successfully/i`) or a redirect to `**/tiktokstudio/content**`. On success, return `{status: "processing", url: "https://www.tiktok.com/tiktokstudio/content"}` (TikTok doesn't expose the public URL until processing finishes — the user can find it in their content dashboard).

## Login persistence

Each platform script uses Camoufox's `persistent_context=True` with a profile dir at `~/.camoufox_<platform>_profile/`. First run requires the user to log in manually in the launched window — the script detects the redirect to a login URL and waits up to 5 minutes. Cookies persist across runs.

**Stale profile lock cleanup:** Camoufox/Firefox profiles can be left locked after a crashed run, causing the next launch to hang for 3 minutes then fail. Each script should remove `<profile_dir>/lock` and `<profile_dir>/.parentlock` before launching.

---

## Required Python deps

```
pip install "camoufox[geoip]"
camoufox fetch
```

`camoufox fetch` downloads the patched Firefox binary (~150 MB). One-time setup.

---

## Cross-cutting failure modes

- **Anti-bot detection (the main thing we're fighting):** if the composer/caption step never appears, or a CAPTCHA shows up, or the page silently hangs — Camoufox didn't beat detection this run. Return `{status: "failed", error: "anti-bot detection"}` and leave the headed window open for ~10 minutes so the user can finish manually if they want; their session save still helps the next run.
- **Login required:** script lands on a `/login` URL → return `{status: "skipped", error: "not signed in"}` after waiting briefly to see if the user logs in.
- **Pacing:** don't run uploads back-to-back from the same Camoufox profile during testing. Itself looks like automation. Space test runs out by at least a few minutes.

---

## Output contract

Each script writes a single JSON line to stdout as its **last line**:

```json
{"platform": "tiktok", "status": "processing", "url": "https://www.tiktok.com/tiktokstudio/content"}
```

Status values match the orchestrator contract: `published`, `processing`, `staged`, `skipped`, `failed`. Include `error` on the latter two.
