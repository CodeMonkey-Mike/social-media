---
name: yt-post-poll
description: Post the next pending YouTube community text poll from data/yt-text-polls.json via Playwright script.
---

> ✅ **FIXED 2026-06-10 — it was NEVER a DOM change; the option-field targeting was the bug.** A read-only diagnostic (`scripts/_diag-yt-poll-selectors.js`) proved every selector is UNCHANGED: poll attachment opens inline, `tp-yt-paper-input.poll-option-input` count = 2, `#add-option button` exists, each row is `[remove-X icon-button][input field]`. The real bug: the old code computed the **host's bounding-box center** and did a raw `page.mouse.click(x,y)` to focus — that coordinate click missed the input (it's offset right of the remove-X), so text never entered (`host.value="null"`) and the widget degraded, which then made the coordinate-based add-option click miss too (the `dispatchEvent` fallback hung 30s). **The fix (selectors untouched):** target the **inner `<input>`** directly (`tp-yt-paper-input.poll-option-input input`), focus it with an actionability-checked `robustClick` (Playwright click → native JS click fallback), type real keystrokes (preserves Polymer two-way binding + YouTube submission state), verify each option via `input.inputValue()`, and add fields with `robustClick` on `#add-option button`. Two safety gates run BEFORE Post: per-option value verify (throws if text didn't register) + waiting for the visible Post button to enable. **Validated end-to-end 2026-06-10:** posted `yt-text-poll-2026-05-31-kaspa-3-dollar` live (3 options, all `✓`) → `youtube.com/post/UgkxoCWoDh4DZ0pNorSpIxuuObW8nNBTwF8R`. YT polls work again.

## Invocation

```powershell
cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets
node scripts/post-yt-poll.js
```

Picks up the first poll with `status === "pending"` from `data/yt-text-polls.json`, posts it, and writes `status: "posted"`, `posted_at`, and `post_url` back to the file.

## Queue file

`C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\yt-text-polls.json`

## Chrome profile

Uses `ytbot-profile` (`C:\Users\mnede\AppData\Local\Google\Chrome\ytbot-profile`). Connects via CDP port 9223. **Any Chrome window already using ytbot-profile must be closed** before running. Other Chrome instances on different profiles are fine.

## Timing constants

| Constant | Default | Purpose |
|---|---|---|
| `PRE_COMPOSE_MIN/MAX` | 60–180s | Wait before opening composer |
| `PRE_POST_MIN/MAX` | 60–180s | Wait before clicking Post |
| `ACTION_MIN/MAX` | 4–7s | Pause between UI actions (after question, between options) |
| `CHAR_DELAY_MIN/MAX` | 60–150ms | Per-keystroke delay (question text AND option text) |

## What the script does

1. Reads queue, finds first `pending` poll, validates `options.length ≤ 4` and each option ≤ 65 chars, marks `posting`
2. Launches Chrome on CDP 9223 with `ytbot-profile`, verifies YouTube login (avatar button present)
3. **Pre-composer wait: 60–180s**
4. Navigates to `https://www.youtube.com/@CodeMonkeyMike/posts`
5. Clicks `#placeholder-area`, focuses `#contenteditable-root[contenteditable="true"]`
6. Types `question_text` character-by-character at 60–150ms per keystroke
7. Clicks `#poll-button button` (the text-poll toolbar button)
8. For each option: clicks `#add-option button` if a new field is needed, mouse-clicks the host's bounding-rect center, types option text at 60–150ms per keystroke, pauses 4–7s before next option
9. **Pre-post wait: 60–180s**
10. Finds the **visible** Post button (non-zero `getBoundingClientRect()`) and clicks via `page.mouse.click(x, y)`
11. Waits for composer to clear, re-fetches posts page to find the new `/post/UgkxXXXX` URL
12. Writes `status: "posted"`, `posted_at`, `post_url` back to JSON

## Critical implementation details

**Poll button selector: `#poll-button button`, NOT `[aria-label="Poll"]`.** The aria-label selector matches poll widgets in the existing posts feed, not the composer toolbar's text-poll button. Using the wrong selector silently clicks a feed element and the poll attachment never opens. Use `#poll-button button` — the `<button>` inside the composer's `#poll-button` span. Confirm `ytd-poll-attachment` is visible after clicking.

**The two-button trap (Post button).** YouTube renders TWO elements matching `button[aria-label="Post"]`:
- A hidden placeholder (`getBoundingClientRect()` returns 0×0), always `disabled/aria-disabled`.
- The real visible Post button (~61×36) at lower-right of the composer.

`document.querySelector('button[aria-label="Post"]')` returns the **hidden one** (first in DOM). The script must `document.querySelectorAll()`, filter for `rect.width > 0 && rect.height > 0 && !aria-disabled`, then `page.mouse.click()`. This is the single most common reason a poll script fails — it clicks the invisible placeholder.

**Real keystrokes via `page.keyboard.type()` only.** Polymer's two-way binding for `tp-yt-paper-input.poll-option-input` only updates when real CDP keystrokes fire. `keyboard.insertText()` updates the DOM value but NOT Polymer's data model — the post submits with **no options** (broken). Setting `el.value` or firing synthetic `input` events has the same broken result.

**Focus an option field by mouse-clicking the host coordinates — `host.focus()` doesn't work.** Get the host's center coordinates via `getBoundingClientRect()` inside `page.evaluate()`, then `page.mouse.click(x, y)`.

## ✅ FIXED 2026-06-14 — the Post button click was on raw COORDINATES; switched to robustClick

Symptom: the script typed the question + all 3 options correctly (each `✓`), logged "Post clicked ✓", but then **"Composer-cleared signal not detected"** and all 5 URL-capture attempts failed → exit 1, entry `failed`, and the poll was **NOT live** (confirmed on the Community tab). Reproduced twice.

ROOT CAUSE: the Post click was the **last** click in the script still using `page.mouse.click(x, y)` at the button's computed center — the exact brittle pattern the 2026-06-10 option-field fix replaced everywhere else. A coordinate click misses YouTube's Polymer Post button and never fires its submit handler, so the composer never clears and nothing posts. (The `getBoundingClientRect` center can sit on a non-interactive overlay/padding, or the synthetic mouse event isn't honored by the paper-button.)

FIX (in `post-yt-poll.js`): target the visible button as an ELEMENT — `page.locator('button[aria-label="Post"]:visible').first()` — and `robustClick` it (trusted Playwright click, JS-click fallback), the same helper the options use. The reliable success signal is **"Composer cleared ✓"**; if you see that, the new-post-URL lookup will succeed. Validated end-to-end: posted `yt-text-poll-2026-06-07-four-year-cycle-dead` → `youtube.com/post/UgkxSPhYb_rgiRKF3dkAdpOIyWjVsflwOCSn`.

Wait times were also **halved 2026-06-14** (PRE_COMPOSE / PRE_POST 60–180s → 30–90s, ACTION 4–7s → 2–3.5s) for faster iteration — community posts aren't reply-throttle-sensitive.

**If it ever fails THIS way again** (composer not cleared + no URL): the post did NOT go through — verify on the Community tab, then reset + re-run. Only if the composer DID clear but URL capture timed out is the poll live (don't re-run → duplicate). Same never-blind-retry principle as the reply-guy / FB / Rumble flows.

## Resetting a stuck poll

```
node -e "
const fs=require('fs');
const path='data/yt-text-polls.json';
const d=JSON.parse(fs.readFileSync(path,'utf8'));
const p=d.polls.find(x=>x.status==='posting'||x.status==='failed');
if(p){p.status='pending';delete p.error;fs.writeFileSync(path,JSON.stringify(d,null,2));console.log('Reset:',p.id);}
"
```

## Re-logging in

If the YouTube session expires:
```powershell
Start-Process "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "--user-data-dir=C:\Users\mnede\AppData\Local\Google\Chrome\ytbot-profile", "--no-first-run", "https://www.youtube.com/"
```
Log into @CodeMonkeyMike, then close Chrome with the X button (graceful close — not Task Manager).

## Broken posts (no options)

If a poll publishes with no options on the live post (Polymer state bug), delete it manually before retrying — the script won't detect this and will mark `posted` with a URL pointing at a broken post. Always verify the live URL renders the poll widget after the script completes.
