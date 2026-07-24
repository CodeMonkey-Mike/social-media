---
name: yt-post-quiz
description: Post the next pending YouTube community QUIZ from data/yt-quizzes.json via Playwright script. A quiz is a poll with one option marked correct + an optional explanation shown after answering.
---

A **YouTube community quiz** is a poll variant: same question + 2-4 options, but exactly ONE option is
marked **correct**, and an optional **explanation** is shown to the viewer *after* they answer. Built
2026-07-07 by mirroring [[yt-post-poll]] (`scripts/post-yt-poll.js`) — same Chrome/CDP setup, same real
CDP keystrokes, same robustClick, same two-button Post trap, same human timing. The quiz-specific parts
are a different composer widget (`ytd-backstage-quiz-editor-renderer`), a mandatory correct-answer mark,
and the explanation field.

## Invocation

```powershell
cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets
node scripts/post-yt-quiz.js
```

Picks up the first quiz with `status === "pending"` from `data/yt-quizzes.json`, posts it, and writes
`status: "posted"`, `posted_at`, and `post_url` back to the file.

## Queue file

`C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\yt-quizzes.json` — key `quizzes`.
Each quiz object (schema in the file's `$schema_doc`):

| field | meaning |
|---|---|
| `question_text` | the prompt (up to ~3000 chars; `\n` allowed) |
| `options` | 2-4 strings, each ≤ 65 chars |
| `correct_option_index` | 0-based index of the ONE correct option (required, in range) |
| `explanation` | OPTIONAL text shown after answering. Keep it short (safely under ~150 chars) and NO em dashes |
| `hook`, `topic` | short labels for the dashboard / logs |
| `status` | `pending` → `posting` → `posted` → (`captured`) / `failed` |

Renders in the dashboard under the **YT Quiz** tab (right of YT Polls); the correct option is highlighted
green with a ✓ and the explanation is shown beneath the options.

## Chrome profile

Uses `ytbot-profile` (`C:\Users\mnede\AppData\Local\Google\Chrome\ytbot-profile`) via CDP port 9223 —
identical to the poll poster. **Any Chrome window already using ytbot-profile must be closed** first.

## Timing constants (mirrored from post-yt-poll.js — human delays are observed on every action)

| Constant | Default | Purpose |
|---|---|---|
| `PRE_COMPOSE_MIN/MAX` | 30–90s | Wait before opening composer |
| `PRE_POST_MIN/MAX` | 30–90s | Wait before clicking Post |
| `ACTION_MIN/MAX` | 2–3.5s | Pause between UI actions |
| `CHAR_DELAY_MIN/MAX` | 60–150ms | Per-keystroke delay (question, options AND explanation) |

## What the script does

1. Reads queue, finds first `pending` quiz. Validates 2-4 options, each ≤ 65 chars, and
   `correct_option_index` in range — **all BEFORE opening a browser**. Marks `posting`.
2. Launches Chrome on CDP 9223, verifies YouTube login (avatar present).
3. **Pre-composer wait 30–90s** → navigates to `@CodeMonkeyMike/posts` → expands composer.
4. Types `question_text` character-by-character.
5. Opens the quiz editor: `#quiz-button button` via `dispatchEvent('click')` → confirms
   `ytd-backstage-quiz-editor-renderer#quiz-attachment` is `display:flex` (not `none`).
6. Fills each option into `.quiz-option-input-input textarea`, adding rows with
   `button[aria-label="Add answer"]` (the widget starts with 2). Verifies each via `inputValue()`.
7. **Marks the correct answer:** clicks the `correct_option_index`-th
   `yt-icon-button.option-selector-button[aria-label="Mark as correct answer"]`.
8. If `explanation` is set: reveals + fills `.quiz-explanation-input-input textarea` (see gotcha below).
9. Waits for the **visible** Post button to enable, **pre-post wait 30–90s**, robustClicks Post.
10. Waits for composer to clear, finds the new `/post/Ugkx…` URL, writes `posted` + `post_url`.

## Critical implementation details

**Quiz button: `#quiz-button button`** (a `ytd-button-renderer`, aria "Add a quiz"), dispatched — NOT
`[aria-label*="Quiz"]`. Confirm `#quiz-attachment` becomes `display:flex` after clicking.

**Options are `<textarea>`s, not paper-inputs.** The quiz editor uses
`tp-yt-iron-autogrow-textarea` (`.quiz-option-input-input textarea`), unlike the poll's
`tp-yt-paper-input`. Focus with a real (actionability-checked) click, type real CDP keystrokes, verify
with `inputValue()`, fall back to `.fill()`.

**You MUST mark a correct answer or the Post button never enables.** Clicking the
`correct_option_index`-th `.option-selector-button` is what makes the quiz valid. If Post won't enable,
the correct answer isn't marked. (`aria-pressed` is not set on the button — the Post-enable gate is the
real confirmation.)

**Explanation field — the per-option gotcha (why the first TWO Kaspa quizzes posted WITHOUT their
explanation, 2026-07-07):** EVERY option row has its OWN explanation textarea (placeholder "Explain why
this is correct (optional)"), but only the **correct option's** field is visible/editable — the others
are `0×0` hidden with `offsetParent === null`. The original code used
`page.locator(EXPL_TEXTAREA).first()`, which grabbed **option 0's hidden** field whenever the correct
answer wasn't option 0 (the Kaspa quiz's correct answer is index 1) → keystrokes went nowhere → empty
explanation, and the script couldn't tell. A 2-option probe hid the bug because there the correct answer
*was* option 0. **Fix (proven by `scripts/_diag-yt-quiz-explanation.js`):** target
`EXPL_TEXTAREA.nth(correct_option_index)` (the field is revealed once the correct answer is marked), then
`scrollIntoView({block:'center'})` + native `el.focus()` (verify `document.activeElement === el`) + real
keystrokes, with `.fill()` as fallback. If an explanation is set but will not register, the script
**throws BEFORE clicking Post** — so a quiz is never published missing its intended explanation. Confirm
`Explanation ✓` in the log.

**The two-button Post trap** (identical to polls): two `button[aria-label="Post"]` exist — a hidden 0×0
disabled placeholder and the real ~61×40 button. Select via `querySelectorAll`, filter for
`width>0 && height>0 && !aria-disabled`, then robustClick `button[aria-label="Post"]:visible` (an ELEMENT
click, never raw coordinates). Success signal = "Composer cleared ✓".

## Quizzes CANNOT be edited after posting

YouTube does not let you change a live quiz's options/correct answer/explanation. **To add or change an
explanation (or any option) you must DELETE the post and re-post.** Delete the live post (its ⋯ menu →
Delete), then reset + re-run:

```
node -e "const fs=require('fs');const p='data/yt-quizzes.json';const d=JSON.parse(fs.readFileSync(p,'utf8'));const q=d.quizzes.find(x=>x.status==='posting'||x.status==='failed'||x.status==='posted');if(q){q.status='pending';delete q.error;q.posted_at=null;q.post_url=null;fs.writeFileSync(p,JSON.stringify(d,null,2));console.log('Reset:',q.id);}"
```

(Adjust the `.find` if multiple quizzes exist — reset only the one you deleted.)

## Resetting a stuck quiz (posting/failed)

```
node -e "const fs=require('fs');const p='data/yt-quizzes.json';const d=JSON.parse(fs.readFileSync(p,'utf8'));const q=d.quizzes.find(x=>x.status==='posting'||x.status==='failed');if(q){q.status='pending';delete q.error;fs.writeFileSync(p,JSON.stringify(d,null,2));console.log('Reset:',q.id);}"
```

## Never blind-retry

If it fails with "composer not cleared + no URL", the post did NOT go through — verify on the Community
tab, then reset + re-run. If the composer DID clear but URL capture timed out, the quiz IS live (do not
re-run → duplicate). Same principle as the poll / reply-guy / FB / Rumble flows. One attempt per run;
read the log before doing anything else.

## Discovery probes (read-only, kept for future YouTube DOM changes)

- `scripts/_diag-yt-quiz-selectors.js` — dumps the composer toolbar + quiz-editor structure.
- `scripts/_diag-yt-quiz-explanation.js` — reveals + focus-tests the explanation field.

## Re-logging in

Same as polls — see [[yt-post-poll]] (`ytbot-profile`, log into @CodeMonkeyMike, close with the X).

## ⚠ `Correct-answer button aria-pressed=null` — the CONFIRMATION SIGNAL is unreliable, not the mark (3 occurrences: 2026-07-15, 07-21, 07-22)

When marking the correct answer, the script reads `aria-pressed` on the correct-answer button and expects `"true"`; it logs `null` intermittently (clean on 2026-07-20, present on the three dates above). **Every time, the post still went live with the explanation correctly attached to the right option's field** — so the mark itself works. What is broken is the signal used to confirm it.

**Current status: known-benign. Do NOT treat `aria-pressed=null` as a failure and do NOT re-run the script on it** (re-running duplicates a live community post).

**Owed fix (escalation threshold reached at the 3rd occurrence):** the next time `post-yt-quiz.js` is edited, replace the `aria-pressed` read with a signal that actually reflects state — e.g. the checked/selected class on the option row, or re-reading the option element after the click — rather than continuing to log-and-shrug. Until that lands, an occasional visual spot-check of which option shows as correct on a live quiz post is worthwhile.
