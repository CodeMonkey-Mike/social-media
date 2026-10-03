---
name: yt-post-quiz
description: Post the next pending YouTube community QUIZ from data/yt-quizzes.json via Playwright script. A quiz is a poll with one option marked correct + an optional explanation shown after answering.
---

A **YouTube community quiz** is a poll variant: same question + 2-4 options, but exactly ONE option is
marked **correct**, and an optional **explanation** is shown to the viewer *after* they answer. Built
2026-07-07 by mirroring [[yt-post-poll]] (`scripts/post-yt-poll.js`) — same Chrome/CDP setup, same real
CDP keystrokes, same robustClick, same two-button Post trap, same human timing. The quiz-specific parts
are the composer widget, a mandatory correct-answer mark, and the explanation field.

> ⛔ **Post quizzes with the PYTHON port — the JS twin cannot post any more (2026-08-30).**
> YouTube migrated the quiz composer off the Polymer `ytd-backstage-quiz-editor-renderer` onto its
> newer `ytPostsCreation*ViewModel*` components. The legacy widget still exists in the DOM but is
> permanently `display:none` / 0x0, so `post-yt-quiz.js` throws `Quiz editor did not open
> (display=none)` before it ever reaches Post (clean pre-post failure, nothing published, no
> duplicate risk) and every other legacy selector it uses now points at a 0x0 ghost.
> `scripts/post_yt_quiz.py` carries the ViewModel selectors and is ✅ LIVE-BLESSED 2026-08-30.
> Per the freeze doctrine the JS twin was left untouched as rollback; it is NOT a fallback here.

## Invocation

```powershell
cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets
python scripts/post_yt_quiz.py
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
5. Opens the quiz editor: robustClicks `button[aria-label="Add a quiz"]:visible` → waits for
   `.ytPostsCreationOptionsEditorViewModelHost` + an answer textarea to render.
6. Fills each option into `.ytPostsCreationOptionViewModelTextFieldContainer textarea`, adding rows
   with `button.ytPostsCreationOptionsViewModelAddOptionButton` (starts with 2). Verifies each via
   `input_value()`.
7. **Marks the correct answer:** option 1 is marked by DEFAULT, so it clicks the
   `correct_option_index`-th `.ytPostsCreationOptionViewModelOptionSelectorButton` only when the mark
   has to move, then GATES on exactly one row carrying `...OptionSelectorButtonCorrect`.
8. If `explanation` is set: fills the single shared explanation textarea (see gotcha below).
9. Waits for the **visible** Post button to enable, **pre-post wait 30–90s**, robustClicks Post.
10. Waits for composer to clear, finds the new `/post/Ugkx…` URL, writes `posted` + `post_url`.

## Critical implementation details

**Quiz button — the two-button trap.** There are TWO `#quiz-button` elements: a 0x0 `span` inside
`ytd-backstage-post-dialog-renderer` and the real 90x40 `ytd-button-renderer` inside `ytd-commentbox`.
`.first()` grabs the ghost, so target `button[aria-label="Add a quiz"]:visible`. Same trap already
documented for the Post button.

**Never probe the legacy `#quiz-attachment` for "did it open".** It is a dead node now (permanently
`display:none`), so it always answers "no". Wait for `.ytPostsCreationOptionsEditorViewModelHost` plus
a visible answer textarea instead — and note the editor renders **asynchronously**, so wait, don't
sample once.

**Options are `<textarea>`s.** `.ytPostsCreationOptionViewModelTextFieldContainer textarea`
(placeholders "Answer N"). Scope by that container: a bare `.ytStandardsTextareaShapeTextarea` also
matches the explanation field, which throws the answer count off by one. Focus, type real CDP
keystrokes, verify with `input_value()`, fall back to `.fill()`.

**You MUST have exactly one correct answer marked or the Post button never enables.** Two traps:
- **Option 1 starts marked.** The selector buttons behave like radios, so clicking a row that is
  already marked risks toggling it off. Click only when the mark must move; verify otherwise.
- **`.ytPostsCreationOptionViewModelOptionSelectorButton` is a `<button-view-model>` WRAPPER with no
  aria at all.** The state is the class `...OptionSelectorButtonCorrect` on the wrapper (mirrored as
  `...QuizOptionCorrect` on the row); `aria-pressed` lives on the wrapper's INNER `<button>`. Reading
  `aria-pressed` off the wrapper returns `None` for every row, i.e. a false "nothing is marked".

The port now GATES on that class: exactly one row marked AND it is `correct_option_index`, else it
aborts before Post. A quiz with the wrong answer marked is worse than one not posted.

**Explanation field — now ONE shared field.** Target
`.ytPostsCreationOptionsEditorViewModelExplanationContainer textarea` (placeholder "Add an explanation
(optional)") with `.first()`, then `scrollIntoView({block:'center'})` + native `el.focus()` (verify
`document.activeElement === el`) + real keystrokes, with `.fill()` as fallback. If an explanation is set
but will not register, the script **throws BEFORE clicking Post** — so a quiz is never published missing
its intended explanation. Confirm `Explanation ✓` in the log.

> The old per-option quirk is GONE (2026-08-30), and carrying it forward would now break the opposite
> way. History, because it explains the shape of the code: the Polymer editor gave EVERY option row its
> own "Explain why this is correct" textarea with only the **correct option's** visible, so
> `.first()` silently grabbed option 0's hidden field whenever the correct answer wasn't option 0 — the
> first two Kaspa quizzes (correct answer index 1) posted with an EMPTY explanation, and a 2-option
> probe missed it because there the correct answer *was* option 0. The fix then was
> `.nth(correct_option_index)`. Against the ViewModel DOM there is only one field, so `.nth(ci)` would
> now select **nothing** for any `ci > 0`.

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

- `scripts/_diag_yt_quiz_viewmodel.py` — **start here.** Dumps the composer subtree only: every
  ViewModel class with counts, the answer rows and their inner controls, all fields (placeholder +
  dimensions) and visible buttons, plus the legacy containers so you can see at a glance which ones
  have gone dead. This is the probe that root-caused the 2026-08-30 migration.
- `scripts/_diag_yt_quiz_correct.py` — the mark-correct control specifically: dumps every selector
  button (classes / aria / aria-pressed) on a fresh 2-row editor, again after `Add answer` ×2, and
  again after clicking a row, so you can see exactly which attribute reflects state.
- `scripts/_diag-yt-quiz-selectors.js` — the original 2026-07-07 probe (legacy DOM; dumps the whole
  page, so it is noisy now).
- `scripts/_diag-yt-quiz-explanation.js` — legacy per-option explanation probe.

None of them ever click Post.

## Re-logging in

Same as polls — see [[yt-post-poll]] (`ytbot-profile`, log into @CodeMonkeyMike, close with the X).

## ✅ `Correct-answer button aria-pressed=null` — RESOLVED 2026-08-30 (was logged 4x: 07-15, 07-21, 07-22, 07-30)

The script used to read `aria-pressed` on the correct-answer button, expect `"true"`, and log `null` intermittently. Every time the post still went live with the explanation on the right option, so the mark itself worked and only the confirmation signal was broken — which is why it decayed into log-and-shrug across four occurrences, with an owed fix outstanding since the escalation threshold was declared on 07-22.

**Root cause, found while fixing the ViewModel migration:** the element matched by the selector is a `<button-view-model>` **wrapper**, and the wrapper carries no aria attributes — `aria-pressed` lives on its inner `<button>`. So the read was against the wrong node the whole time; `null` was the honest answer to a malformed question.

**Fixed as the owed fix asked:** the port now reads the option row's state CLASS (`...OptionSelectorButtonCorrect`) and **gates** on it — exactly one row marked and it must be `correct_option_index`, otherwise it aborts before Post. The inner button's `aria-label`/`aria-pressed` are logged per option as a human-readable cross-check. Confirmed on the 2026-08-30 bless run: `marked=[1], expected=[1]`, with `option 2: correct=True aria=Marked as correct aria-pressed=true`. No visual spot-check needed any more.
