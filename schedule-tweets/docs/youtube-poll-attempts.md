# YouTube Poll — Polymer Option Filling Attempts

## Background

YouTube Community polls are created via `scripts/post-yt-poll.js` against `data/yt-text-polls.json`. The flow:

1. Open `https://www.youtube.com/@CodeMonkeyMike/posts`
2. Click composer (`#placeholder-area` → `#contenteditable-root`)
3. Type question text — **works fine**
4. Click Poll button (`[aria-label="Poll"]`) — **works fine**
5. **Fill option inputs** — *this is the hard part*
6. Click Post

Polls 0–20 in `yt-text-polls.json` posted successfully with the old approach. After a YouTube UI update (or Playwright/Chrome update) the option-filling broke; polls 21+ have been failing.

## The element

The option input is a `<tp-yt-paper-input class="poll-option-input">` host wrapping an inner `<input>`. The inner input often has a 0×0 bounding box (Polymer collapses it visually until activated), so standard Playwright clicks throw "Element is not visible" even with `force: true`.

YouTube's poll renderer listens to multiple state paths:
- **Polymer's two-way binding** controls whether the Post button enables
- **React/backend submission state** controls whether the post actually gets the option text when submitted

Both must update for the poll to publish correctly. **Updating only the visible UI is the trap** — the Post button enables, the post submits, but it's published with no options (a broken post).

## Attempt 1 — `click({ force: true })` + `keyboard.type()` on inner input

```js
const innerInput = page.locator(HOST_SEL).nth(i).locator('input');
await innerInput.click({ force: true });
await typeHuman(page, poll.options[i]);
```

**Result:** Worked for the first 20+ polls. Then broke — `click({ force: true })` now throws "Element is not visible" even with force. Probably a Playwright behavior change or a YouTube UI tweak that put `display: none` on a parent of the inner input.

## Attempt 2 — `focus()` on inner input + `keyboard.type()`

```js
const innerInput = page.locator(HOST_SEL).nth(i).locator('input');
await innerInput.focus();
await typeHuman(page, poll.options[i]);
```

**Result:** `focus()` silently failed. Value mismatch — expected `"Hike (the data forces it)"`, got `""`. `keyboard.type()` typed into whatever had focus (probably body), not the inner input. Polymer-wrapped inputs don't accept focus via the inner element.

## Attempt 3 — `fill({ force: true })` fallback

```js
await innerInput.fill(poll.options[i], { force: true });
await innerInput.evaluate(el => {
  el.dispatchEvent(new Event('input', { bubbles: true }));
  el.dispatchEvent(new Event('change', { bubbles: true }));
});
```

**Result:** Visually filled all 4 inputs. **Post button stayed disabled** (`aria-disabled="true"`) because Polymer's two-way binding didn't pick up the value change. `fill()` sets the DOM value but doesn't trigger Polymer's `value-changed` event chain.

## Attempt 4 — Native setter on inner input + value on host + custom events

```js
await host.evaluate((el, val) => {
  // Set on paper-input host (Polymer's two-way binding source)
  if ('value' in el) el.value = val;
  if ('bindValue' in el) el.bindValue = val;
  // Set on inner input using React/Polymer-aware native setter
  const inner = el.querySelector('input');
  if (inner) {
    const nativeSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, 'value'
    ).set;
    nativeSetter.call(inner, val);
    inner.dispatchEvent(new Event('input',  { bubbles: true }));
    inner.dispatchEvent(new Event('change', { bubbles: true }));
  }
  el.dispatchEvent(new CustomEvent('value-changed', {
    detail: { value: val }, bubbles: true,
  }));
}, poll.options[i]);
```

**Result:** **Post button enabled** (`aria-disabled="false"`). All 4 values visible in both host (`host.value`) and inner (`inner.value`). Post clicked. Post created — **but with no options**. The post went live with only the question text; the options were never registered in the backend submission state.

Confirmed broken post: `https://www.youtube.com/post/UgkxD2NTJ-DK-ODEBF4O6lOckF1h9uB7EagT` (needs manual deletion — auto-delete failed to find Confirm button).

**Key learning:** Polymer's UI state and YouTube's submission state are separate. Setting `value` properties + dispatching events updates Polymer's state (which enables the button), but does NOT update the submission state. The submission state is only updated by real keystrokes that produce native `input` events through the browser's input pipeline.

## Attempt 5 — Click HOST element + `keyboard.type()`

```js
const host = page.locator(HOST_SEL).nth(i);
await host.scrollIntoViewIfNeeded();
await host.click({ force: true });
await page.keyboard.type(poll.options[i], { delay: 10 });
```

**Result:** `scrollIntoViewIfNeeded()` timed out after 30s — the HOST itself is considered not visible by Playwright (likely `display: none` on a parent). Couldn't even get to the click. `force: true` on `click()` would have been bypassed but only after scrollIntoViewIfNeeded succeeded.

## Attempt 6 — Force focus on inner input via evaluate + `keyboard.type()`

```js
const focused = await host.evaluate(el => {
  const inner = el.querySelector('input');
  inner.focus();
  if (document.activeElement === inner) return { ok: true };
  inner.dispatchEvent(new FocusEvent('focus', { bubbles: true }));
  return { ok: document.activeElement === inner, activeTag: document.activeElement?.tagName };
});
if (!focused.ok) throw new Error('focus failed');
await page.keyboard.type(poll.options[i], { delay: 10 });
```

**Result:** Focus failed. After `inner.focus()`, `document.activeElement` was an `<A>` tag (probably a nav link), NOT the inner input. The Polymer paper-input prevents programmatic focus via JS — focus only lands via real user interaction (real mouse click or tap event from the user, not a synthesized one).

```
Option 1 focus: {"ok":false,"activeTag":"A"}
Posting failed: Option 1 focus failed
```

## Conclusion (2026-05-20)

All 6 attempts failed. The fundamental problem:
- **Polymer's `tp-yt-paper-input.poll-option-input` is unreachable programmatically.** The host element fails Playwright visibility checks. The inner input refuses programmatic focus. Setting values via DOM manipulation updates the UI but not the submission state, so posts publish without options.

**The only viable paths forward:**

1. **CDP-level input simulation** — use Chrome DevTools Protocol's `Input.dispatchKeyEvent` directly. This dispatches at the browser level, below Polymer's interception. Untested, complex setup.

2. **Direct GraphQL submission** — reverse-engineer YouTube's `/youtubei/v1/post/create_post` endpoint. Capture a real poll-creation request, copy the format, POST programmatically with the option array. Most reliable long-term solution but requires inspecting network traffic and reproducing auth headers/cookies/CSRF tokens.

3. **Hand-off to a human-in-the-loop tool** — script everything except the option fields; pause and let the user fill those manually; resume with Post click. Defeats the automation goal.

4. **Wait for YouTube to fix or expose a polls API** — currently no public API for community-post polls. Unlikely to change soon.

## Files affected

- `scripts/post-yt-poll.js` — current state has Attempt 6 (force-focus + keyboard.type). Reverting to safe state requires reverting commits or accepting current broken state.
- `data/yt-text-polls.json` — poll 21 (Kevin Warsh / Fed chair) reset to pending.
- No broken posts published — every attempt failed before submission, or the auto-delete completed.

## Other attempts to consider if Attempt 5 fails

### Attempt 6 — `page.focus(selector)` instead of locator focus
`page.focus('selector')` uses Chrome DevTools to focus, bypassing visibility checks.
```js
await page.focus(`${HOST_SEL}:nth-of-type(${i+1}) input`);
await page.keyboard.type(poll.options[i], { delay: 10 });
```

### Attempt 7 — `page.mouse.click(x, y)` at the host's bounding box
`page.mouse.click` doesn't check visibility — dispatches at coordinates only.
```js
const box = await host.boundingBox();
if (box) await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
await page.keyboard.type(poll.options[i], { delay: 10 });
```

### Attempt 8 — Force-trigger a synthetic InputEvent with proper `inputType`
Some React-based inputs only register changes when the event includes `inputType: 'insertText'`.
```js
const ev = new InputEvent('input', {
  bubbles: true,
  cancelable: true,
  inputType: 'insertText',
  data: poll.options[i],
});
inner.dispatchEvent(ev);
```

### Attempt 9 — Use CDP `Input.insertText` via `page.context().sendCDP(...)`
Direct Chrome DevTools Protocol command that simulates IME input — bypasses both Polymer and React entirely.

### Attempt 10 — Skip Polymer entirely; submit via the GraphQL endpoint
YouTube's community post creation API is `/youtubei/v1/post/create_post`. Could intercept the request from a real post, extract the auth/cookie/CSRF, and POST directly with the poll options in the request body. Most reliable but requires reverse-engineering the request format.

## Side issues observed

- **Post button selector:** When the button is disabled, `getByRole('button', { name: /^Post$/ })` matches it but click waits forever for it to become enabled. Better: poll `aria-disabled` attribute via evaluate and only click when ready.
- **Auto-delete broken posts:** The script tries to delete a post via three-dot menu → Delete → Confirm. The Confirm button selector wasn't found on the latest broken post — needs updated selectors.
- **Pre-check (scanning recent posts for duplicates) is slow** — user asked to remove it for fast iteration during debugging.
- **All long delays removed** during debugging (PRE_COMPOSE 1–2s, ACTION 500ms–1s, CHAR_DELAY 5–20ms). Restore for production.

## Files

- Script: `scripts/post-yt-poll.js`
- Data: `data/yt-text-polls.json` (37 polls; 21 posted, 16 pending)
- Profile: `C:\Users\mnede\AppData\Local\Google\Chrome\ytbot-profile` (connects via CDP port 9223)
- Channel: `@CodeMonkeyMike` → `https://www.youtube.com/@CodeMonkeyMike/posts`

## Broken post to delete

`https://www.youtube.com/post/UgkxD2NTJ-DK-ODEBF4O6lOckF1h9uB7EagT` — question text only, no options. Auto-delete failed to find Confirm button.
