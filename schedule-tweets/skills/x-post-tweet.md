---
name: x-post-tweet
description: Post the next pending single tweet from data/x-tweets.json via the Playwright script.
---

## Invocation

```powershell
cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets
node scripts/post-tweet.js
```

Picks up the first tweet with `status === "pending"`, posts it, writes `status: "posted"`, `posted_at`, and `url` back to `data/x-tweets.json`.

## Queue file

`C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\x-tweets.json`

### Schema

| Field | Description |
|---|---|
| `tweet` | Full tweet text (newlines as `\n`) |
| `hook` | First 1–2 lines — the opening hook |
| `status` | `pending` / `posting` / `posted` / `failed` / `skipped-too-long` |
| `posted_at` | ISO 8601 timestamp or `null` |
| `url` | Full tweet URL or `null` |
| `views` | View count collected 48h+ after posting, or `null` |
| `views_captured_at` | ISO 8601 timestamp when views were collected, or `null` |
| `image_id` | 8-char hex UUID of attached image, or `null` |
| `image_path` | Relative path to image file, or `null` |

## Chrome profile

Uses `xbot-profile`. Chrome must be fully closed before running.

## Timing constants

| Constant | Default | Purpose |
|---|---|---|
| `PRE_COMPOSE_MIN/MAX` | 60–180s | Wait before opening composer |
| `PRE_POST_MIN/MAX` | 5–180s | Wait before clicking Post |
| `ACTION_MIN/MAX` | 4–7s | Pause between UI actions |
| `CHAR_DELAY_MIN/MAX` | 60–150ms | Per-keystroke delay |

For faster test runs (not production): reduce `PRE_COMPOSE` and `PRE_POST` to 10–12s and `ACTION` to 8–10s. Restore before committing.

## Image attachment routine

When the tweet row has `image_id` set, attach the image before clicking Post.

**Matching algorithm:**
1. Try `image_path` field directly (convert relative to absolute: prepend `C:\Users\mnede\Documents\Claude\social-media\`).
2. If missing or file not found, glob: `images\x\x-tweets-<image_id>-*.png`.
3. If still not found, log a warning and post text-only. **Never fail the post over a missing image.**

**Attach via Chrome:**
1. Use `find` to locate the file input in the tweet composer.
2. Use `file_upload` with the absolute path and the input ref.
3. Wait 2–3 seconds for the upload thumbnail to render.
4. Take a screenshot to verify. Retry once if no thumbnail. If still fails, log and post without image.

**Scope:** image attachment is only implemented for single tweets. Threads, polls, and YouTube posts do not support image attachment in this skill.

## Posting flow

1. Open X (`navigate` to `https://x.com/home` only if no x.com tab is already open — see Rule 1).
2. Wait 60–180s, then click the **Post** button in the left sidebar.
3. Enter tweet text via clipboard paste (see Rule 2).
4. Verify character count is ≤ 25,000 (Mike is X Premium). If over, set `status: "skipped-too-long"`.
5. Attach image if `image_id` is set.
6. Wait 60–180s, then click **Post** and wait for confirmation.
7. Click the confirmation toast to capture the tweet URL within the same session. Do NOT navigate to a fresh URL.
8. Update JSON: `status: "posted"`, `posted_at`, `url`. Auto-extract `hook` if field was null.

## Key implementation details

**Two `fileInput` elements exist on X** — one in the modal composer, one in the inline home-feed composer. The script uses `.first()` to target the modal one. Do not change this to a strict locator.

**`status: "posting"` means the previous run crashed mid-flight.** Reset before re-running:
```
node -e "
const fs=require('fs');
const path='data/x-tweets.json';
const d=JSON.parse(fs.readFileSync(path,'utf8'));
const t=d.tweets.find(x=>x.status==='posting');
if(t){t.status='pending';delete t.error;fs.writeFileSync(path,JSON.stringify(d,null,2));console.log('reset',t.hook);}
"
```

**Never use PowerShell's `ConvertFrom-Json`/`ConvertTo-Json` on `x-tweets.json`.** PowerShell 5.1 reads UTF-8 as Windows-1252 and mangles emoji. Use Node.js for all JSON edits.

---

## ⛔ Absolute Rules (X posting)

### Rule 0 — ONE STRIKE: stop and diagnose before retrying anything
If any action produces unexpected output, **STOP IMMEDIATELY. Do not retry.** Diagnose and explain before taking further action. Retrying a broken approach on X accumulates in bot-detection and can trigger a block even if individual attempts looked harmless.

- If typing produces wrong output: stop, clear, diagnose, fix, then re-run.
- If a post fails: stop. Do not click Post again. Check what happened first.
- If the page behaves unexpectedly: stop. Ask the user.

### Rule 1 — NEVER reload or navigate away if already on X
If any x.com tab is already open and loaded, stay within that session. Navigate by clicking links inside the SPA — never call the `navigate` tool or trigger a full page reload. Using `navigate` on a loaded X session re-initializes React, trips bot-detection, and causes HTTP 429 rate limits.

**First load only:** if no x.com tab is open at all, you may use `navigate` once to open x.com. After that, all movement must be click-based.

### Rule 2 — ALWAYS use clipboard paste to enter text into X
Every piece of text into an X composer must be entered via **system clipboard paste**. Character-by-character typing and `execCommand` approaches are banned — they cause cursor drift and garbled output in X's React composer.

**Exact method:**
1. Write full text to system clipboard with `mcp__computer-use__write_clipboard` (real newlines, not `\n` literals).
2. Verify the composer is empty: `document.querySelector('[data-testid="tweetTextarea_0"]')?.innerText.trim()`. If not empty, clear it first.
3. Click into the composer to focus it.
4. Press `Ctrl+V`.
5. Take a screenshot and verify — all paragraphs present, correct spacing, no duplication.

**Banned approaches (do not regress):**
- `execCommand('insertText')` — newlines mishandled by X's React composer.
- Character-by-character typing — cursor drifts on focus change.
- `execCommand('copy')` from a temp textarea — clipboard state lost on focus shift.
- `execCommand('insertParagraph')` — breaks React internal state.
