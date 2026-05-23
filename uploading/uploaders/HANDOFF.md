# Handoff notes — uploaders + orchestrator continuation

This document is written for the **next Claude session** (likely Claude Code running on Mike's host machine) to pick up where the Cowork session left off. Read this first before touching anything in `uploaders/` or the new orchestrator setup.

## Where we are

Mike is building a reusable video-upload automation across six platforms: Rumble, BitChute, Instagram, X, TikTok, Facebook (YouTube is excluded, manual). The architecture is now an **orchestrator + two subagents** pattern:

- **Orchestrator skill** (`../skills/social-video-upload/SKILL.md`) parses metadata, classifies platforms, and dispatches both subagents in parallel via the Task tool.
- **chrome-uploader subagent** (`../subagents/chrome-uploader.md`) owns Rumble, BitChute, Instagram, X. Loads `../skills/chrome-upload/SKILL.md` for platform knowledge. Shells out to Playwright Chromium scripts.
- **camoufox-uploader subagent** (`../subagents/camoufox-uploader.md`) owns TikTok, Facebook. Loads `../skills/camoufox-upload/SKILL.md`. Shells out to Camoufox-driven scripts.

The split-by-runtime is the architectural choice: cooperative platforms get Chromium, hostile platforms get Camoufox. Per-platform scripts, persistent profiles, JSON-line output contract — see `README.md` in this directory for the calling convention.

## Subagent location: copy `subagents/*.md` into `.claude/agents/`

The subagent definitions live in `../subagents/` because Cowork blocks writes to `.claude/`. To activate them in Claude Code:

```bash
cd C:\Users\mnede\Documents\Claude\social-media\uploading
mkdir -p .claude\agents
copy subagents\*.md .claude\agents\
```

(Or symlink — see `../subagents/README.md`.)

## Status of files in this folder

| File | Browser | Tested end-to-end? |
| --- | --- | --- |
| `rumble_upload.py` | Playwright Chromium | First draft, never run standalone |
| `bitchute_upload.py` | Playwright Chromium | First draft, never run standalone |
| `instagram_upload.py` | Playwright Chromium | First draft, never run standalone |
| `x_upload.py` | Playwright Chromium | First draft, never run standalone |
| `tiktok_upload.py` | Camoufox | First draft, never run standalone |
| `facebook_upload.py` | Playwright Chrome | **Validated end-to-end 2026-05-19.** Rewritten from Camoufox to real Chrome. Full 3-step wizard flow working. See `skills/chrome-upload/SKILL.md` Facebook section for all gotchas. |
| `README.md` | — | Calling convention + setup |
| `HANDOFF.md` | — | This file |

**All six scripts are first drafts.** The platform behavior they encode (URLs, selectors, gotchas, two-step submit flows, anti-bot expectations) was validated live in earlier Cowork sessions via the Chrome extension flow — that knowledge was canonized into `../skills/chrome-upload/SKILL.md` and `../skills/camoufox-upload/SKILL.md`. But the standalone Playwright/Camoufox versions have never been smoke-tested. Expect 1–3 cycles of "run, hit a selector mismatch in the live DOM, tweak, re-run" per script.

## Source of truth on platform behavior

Two reference skills, organized by runtime:

- `../skills/chrome-upload/SKILL.md` — Rumble, BitChute, Instagram, X. Read the relevant section before editing the matching script.
- `../skills/camoufox-upload/SKILL.md` — TikTok, Facebook. Same.

These were extracted from the original (now-rewritten) `social-video-upload/SKILL.md`, which is now the orchestrator's prompt rather than a single big platform reference.

Platform gotchas worth re-reading before touching any script:

- **Rumble:** two-step submit flow (Upload → licensing page with two checkboxes → Submit). The success page exposes `Direct Link: https://rumble.com/v<slug>...html` — that's what to capture.
- **BitChute:** 1 MB minimum (precheck before navigating). `/upload/` is a user profile, not the form. Real flow: `+Video icon → Upload Video` → opens new tab with `up{NN}.bitchute.com/videos/upload/?upload_code=...`. Publish button is "Proceed", not "Submit". Thumbnail is required. After Proceed, redirect to `/content` — return `processing` status; encoding finishes async.
- **Rumble + BitChute long-form upload retry:** observed live on a 608 MB file — BitChute's video upload errored at ~96%, required clicking the retry icon next to the file row. Metadata is preserved; only the video upload restarts. Don't refresh the page.
- **Instagram:** auto-routes vertical 9:16 short videos to the Reel flow. Three-step modal: Crop → Edit → Caption (then Share).
- **X:** **wait for "Uploaded (100%)"** before clicking Post — the button is visually enabled during upload but clicking silently no-ops. Also: 280-char limit on free tier; drop tags from the end if title + 5 hashtags exceeds. Video length limit 2:20 free / longer Premium.
- **TikTok:** the spinner-trap (file attaches but composer never appears) is the failure mode Camoufox is trying to beat. If composer doesn't appear within 90s, give up — Camoufox didn't beat detection this run. Caption field is contenteditable (use `keyboard.type` not `.fill`). First-run TikTok Studio onboarding overlay needs dismissing.
- **Facebook:** even Camoufox may not get past Facebook's Page composer detection. Camoufox is the permanent path — no Graph API. If it fails repeatedly, surface `failed` to the user.

## Known unknowns / likely failure points in the new scripts

The platform-specific selectors in each script are educated guesses based on what we saw via the Chrome extension. Playwright-specific role-based locators will need verification against the live DOMs:

- **Rumble's Primary category dropdown:** the script clicks the input then types and clicks the matching option. If Rumble's combobox doesn't auto-filter, the click target won't be where we expect. Inspect.
- **BitChute's `+Video` icon selector:** the script uses `[aria-label*="Upload" i], [title*="Upload" i]` as a guess. Verify in the live DOM.
- **Instagram's "Write a caption..." textbox:** Playwright's `get_by_role("textbox", name="Write a caption...")` should work but IG localizes; if the user is on a non-en locale, this will need adjustment.
- **X's `Uploaded (100%)` polling:** the script waits for `text=/Uploaded \(100%\)/i`. If X changes that string (or localizes), the wait times out and the script clicks Post anyway. Worth verifying.
- **TikTok's Post button name:** the script tries `name="Post"` then `name="Publish"`. Real label may be different. There may also be a confirmation dialog after the first click.
- **Facebook's `role="button" name="Photo/Video"`:** Page composers vary; this selector may need adjustment per Page type (personal vs Page vs Creator Studio).

## Recommended next moves, in order

1. **Activate the subagents.** Copy `../subagents/*.md` to `.claude/agents/` so Claude Code can route to them.

2. **Smoke-test ONE script standalone first.** Pick whichever platform you have working credentials for. Run it manually:
   ```bash
   python uploaders/rumble_upload.py "C:\Users\mnede\Documents\Claude\social-media\uploading\new\testing.mp4" "C:\Users\mnede\Documents\Claude\social-media\uploading\new\metadata.json"
   ```
   First run will pop a Chromium window for login. Watch the script's progress logs. Iterate selectors against the live DOM until it produces a `published` JSON line. Don't try to debug all six at once.

3. **Run the orchestrator end-to-end.** In Claude Code, ask Claude to upload using the orchestrator. The orchestrator should classify your `metadata.platforms` into chrome vs camoufox groups, dispatch both subagents in a single message (parallel), and produce a unified report.

4. **Iterate the failures.** Each subagent returns structured results. Whichever platform failed, fix that one script — don't let a single platform failure make you doubt the architecture.


## Things NOT to do

- **Don't add YouTube.** Mike has explicitly excluded it; he uploads there manually.
- **Don't dispatch subagents sequentially.** The whole point is parallelism. The orchestrator skill spells this out: both Task calls in a single assistant message.
- **Don't run uploads back-to-back from the same Camoufox profile during testing.** Spaced runs look more human; back-to-back uploads accelerate detection.
- **Don't try to bypass CAPTCHAs.** If TikTok or Facebook serves one, surface to the user — they can solve it manually in the headed window.
- **Don't move scripts back into a `camoufox/` folder.** The folder is named `uploaders/` deliberately because not all scripts use Camoufox.

## Test fixtures

Mike's standard test pair lives at:
- Video: `C:\Users\mnede\Documents\Claude\social-media\uploading\new\testing.mp4` (1.2 MB, 36s, vertical 9:16, "Testing" overlay)
- Metadata: `C:\Users\mnede\Documents\Claude\social-media\uploading\new\metadata.json`

There may also be a long-form video in `new/` from the most recent Cowork session (`i keep winning LIVE FINAL.mp4`, 608 MB). Don't burn cycles re-uploading it — Rumble and BitChute already have it published.

The `metadata.example.json` template lives in `../skills/social-video-upload/`.

## Last-known scoreboard from Cowork session

| Platform | Status (Cowork run) | Camoufox/Playwright script status |
| --- | --- | --- |
| Rumble | Published end-to-end via extension | Script: first draft |
| BitChute | Published end-to-end via extension | Script: first draft |
| Instagram | Published end-to-end via extension | Script: first draft |
| X | Published end-to-end via extension | Script: first draft |
| TikTok | Blocked at fingerprint layer | Script: first draft (Camoufox) |
| Facebook | Blocked at extension permission | Script: first draft (Camoufox) |

Good luck.
