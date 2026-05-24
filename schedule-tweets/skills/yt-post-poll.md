---
name: yt-post-poll
description: Post the next pending YouTube community text poll from data/yt-text-polls.json via Playwright script.
---

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
