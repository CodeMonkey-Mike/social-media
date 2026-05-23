---
name: social-video-upload
description: Orchestrator skill for uploading a video across the user's social media platforms (Rumble, BitChute, Instagram, X, TikTok, Facebook). Reads a metadata file alongside the video, classifies the target platforms into Chrome-driven and Camoufox-driven groups, and dispatches both groups in parallel via subagents. Use this skill whenever the user asks to upload, post, or publish a video to their social accounts — including phrasings like "post this everywhere", "upload to my socials", "publish to Rumble and TikTok", or any time the user mentions a video file plus one or more supported platform names. YouTube is intentionally excluded; the user uploads to YouTube manually.
---

# Social Video Upload — Orchestrator

This skill is the **entry point** for video uploads. It does not upload anything itself. Its job is to:

1. Find the video, metadata, and thumbnail files.
2. Classify the target platforms into two groups by runtime.
3. Dispatch both groups **in parallel** via subagents.
4. Collect the subagent reports and present a single unified summary to the user.

The actual uploading happens inside two subagents:

- **`chrome-uploader`** — uploads to platforms that work cleanly with a standard Chromium browser via Playwright. Currently: **Rumble, BitChute, Instagram, X, Facebook**.
- **`camoufox-uploader`** — uploads to platforms with anti-automation defenses (or no working API yet) via Camoufox, a fingerprint-patched Firefox. Currently: **TikTok**.

YouTube is deliberately not in either group — the user uploads to YouTube manually.

---

## High-level workflow

1. **Locate the video file.** The user usually says "upload `<filename>`" or just "upload that video." Confirm the absolute path before doing anything else. If unclear, ask.

2. **Locate the metadata file.** Convention: same base name as the video, `.json` extension. Example: `i keep winning LIVE FINAL.mp4` → `i keep winning LIVE FINAL.json`. If the metadata file is named `metadata.json` (generic) and only one video is in the folder, accept that as the pair. Read it.

3. **Locate the thumbnail file.** Same base name, one of `.jpg`, `.jpeg`, `.png`, `.webp`. Optional — vertical short videos typically don't have one.

4. **Determine target platforms.** Use the `platforms` array from metadata. If the user named specific platforms in chat, those override. If neither source provides platforms, ask.

5. **Classify into runtime groups:**
   - Chrome group: any of `rumble`, `bitchute`, `instagram`, `x`, `facebook` from the target list
   - Camoufox group: any of `tiktok` from the target list
   - If a group is empty, skip dispatching that subagent.

6. **Dispatch in parallel.** This is the critical step that's easy to do wrong. Emit a **single assistant message** containing **both** Task tool calls — one for each non-empty group. If you call them in separate messages, they run sequentially and you lose the parallel speedup. Each Task call passes:
   - The video path
   - The metadata path
   - The list of platforms within that subagent's group (e.g., "upload to rumble and bitchute")
   - The thumbnail path if found

7. **Wait for both subagents to finish.** Each returns a structured summary (see "Subagent return contract" below).

8. **Merge and report.** Combine both subagent reports into one user-facing summary, grouped by status (Posted / Staged / Skipped / Failed). See "Reporting back" below for format.

---

## Metadata file format

The metadata file is JSON and lives next to the video. Example:

```json
{
  "title": "Stretch Goals",
  "description": "Long-form body used as the Description field on Rumble and BitChute. NOT used on TikTok, Instagram, Facebook, or X — those platforms get title + tags as the post body.",
  "tags": ["fitness", "goals", "motivation", "training", "discipline"],
  "categories": {
    "rumble": {"primary": "Finance & Crypto"}
  },
  "visibility": "public",
  "platforms": ["rumble", "bitchute", "instagram", "x", "tiktok", "facebook"]
}
```

Field reference:

- `title` — required for every platform.
- `description` — long-form body, used **only on Rumble and BitChute**. Intentionally NOT used on TikTok, Instagram, Facebook, or X — those get `title` + tags as hashtags.
- `tags` — array of strings without `#` prefix. The subagent adds `#` where appropriate. Per-platform usage rules live in the per-runtime SKILL.md files.
- `categories` — platform-specific. Currently only Rumble. Default if absent: Rumble Primary = `Finance & Crypto`.
- `visibility` — `public`, `unlisted`, or `private`. Default `public`. Not all platforms support all three.
- `platforms` — which platforms to upload to. If absent, ask the user.

If the user provides only a video and no metadata file, ask whether to (a) provide metadata in chat, (b) generate a stub from the filename, or (c) cancel.

---

## Subagent dispatch contract

When you spawn a subagent via the Task tool, the prompt should be self-contained because the subagent starts with no context. Include:

- The role: "You are the chrome-uploader subagent" / "You are the camoufox-uploader subagent". This routes them to load their corresponding skill (`chrome-upload` or `camoufox-upload`).
- The **absolute paths** to: video, metadata, thumbnail (or "none" if absent).
- The **subset of platforms** this subagent should handle (filtered to its runtime — never pass a chrome platform to camoufox or vice versa).
- The expected return format (see below).

Example prompt for chrome-uploader:

> You are the chrome-uploader subagent. Load the `chrome-upload` skill for platform-specific instructions.
>
> Upload this video to Rumble and BitChute:
> - Video: `C:\Users\mnede\Documents\Claude\social-media\uploading\new\i keep winning LIVE FINAL.mp4`
> - Metadata: `C:\Users\mnede\Documents\Claude\social-media\uploading\new\metadata.json`
> - Thumbnail: `C:\Users\mnede\Documents\Claude\social-media\uploading\new\i cant stop winning.png`
>
> Return a JSON-shaped summary: `{"results": [{"platform": "rumble", "status": "published", "url": "..."}, {"platform": "bitchute", "status": "processing", "url": "..."}]}`. Use status values: `published`, `processing`, `staged`, `skipped`, `failed`. Include an `error` field on failed/skipped entries.

Same shape for camoufox-uploader, just substituting "camoufox" everywhere.

---

## Subagent return contract

Each subagent returns one JSON object:

```json
{
  "results": [
    {"platform": "rumble", "status": "published", "url": "https://rumble.com/v..."},
    {"platform": "bitchute", "status": "processing", "url": "https://www.bitchute.com/content"},
    {"platform": "instagram", "status": "skipped", "error": "not signed in"}
  ]
}
```

Status values:

- `published` — fully posted, public URL captured.
- `processing` — submitted, platform is encoding/reviewing (BitChute typical post-Proceed state).
- `staged` — fields filled but publish not clicked (something was missing or required user judgment).
- `skipped` — couldn't even start (login redirect, file too small, video too long for plan, etc.).
- `failed` — tried to publish but the platform errored or the script errored.

The orchestrator combines both subagents' `results` arrays into one report.

---

## Reporting back

After both subagents return, give the user one consolidated summary:

> **Posted:**
> • Rumble — https://rumble.com/v/xyz
> • Instagram — https://www.instagram.com/p/abc/
> • X — https://x.com/handle/status/123
>
> **Processing (will auto-publish):**
> • BitChute — https://www.bitchute.com/content
>
> **Skipped:**
> • TikTok — bot detection blocked the upload (try the Camoufox script directly)
>
> **Failed:**
> • Facebook — composer blocked by bot detection

Keep the summary tight. Don't narrate every step; the subagents already did the work.

---

## Things NOT to do

- **Don't run the uploads directly in this orchestrator.** Always dispatch via subagents. Mixing platforms across runtimes in one context is what we're trying to avoid.
- **Don't dispatch sequentially.** Both Task calls go in the same assistant message so they run in parallel.
- **Don't include YouTube.** If the user explicitly asks for YouTube, point them at studio.youtube.com — it's not part of this skill.
- **Don't call subagents with the wrong platform list.** Filter strictly: chrome-uploader gets only chrome platforms, camoufox-uploader gets only camoufox platforms.
- **Don't auto-publish if metadata is incomplete.** "Complete" means title, description (for Rumble/BitChute), visibility, and any platform-required category. If something's missing, instruct the subagent to stage and report `staged` rather than publish.

---

## Login state

This skill assumes the user is already logged in to each platform via the runtime that subagent uses (Playwright Chromium profile or Camoufox profile). Logging in (credentials, 2FA, OAuth) is out of scope — never attempt it. If a subagent reports `skipped` with reason "not signed in," tell the user to log in once via the headed browser window the subagent opens, then retry.
