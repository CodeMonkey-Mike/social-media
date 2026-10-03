---
name: x-post-poll
description: Post the next pending X poll from data/x-polls.json via the Playwright script.
---

## Invocation

```powershell
cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets
node scripts/post-x-poll.js
```

Picks up the first poll with `status === "pending"`, posts it with an attached X poll widget, and writes `status: "posted"`, `posted_at`, and `poll_url` back to `data/x-polls.json`.

## Queue file

`C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\x-polls.json`

## Chrome profile

Uses `xbot-profile`. Chrome must be fully closed before running.

## Timing constants

| Constant | Default | Purpose |
|---|---|---|
| `PRE_COMPOSE_MIN/MAX` | 60–180s | Wait before opening composer |
| `PRE_POST_MIN/MAX` | 5–180s | Wait before clicking Post |
| `ACTION_MIN/MAX` | 4–7s | Pause between UI actions |
| `CHAR_DELAY_MIN/MAX` | 60–150ms | Per-keystroke delay |

## Posting flow

### Step 1 — Validate
Before touching Chrome, verify:
- `tweet_text` ≤ 25,000 chars (X Premium)
- `options` has 2–4 entries
- Each option ≤ 25 characters
- `duration` is one of `5m`, `1h`, `1d`, `7d`

If any check fails, set `status: "failed"`, write `validation_error`, save, and stop. Do not partial-post.

### Step 2 — Mark mid-flight
Set `status: "posting"` and write the file before touching Chrome.

### Step 3 — Post
1. Open X (see Rule 1 — `navigate` only if no x.com tab is open).
2. Wait 60–180s, then click **Post** in the left sidebar.
3. Paste `tweet_text` via clipboard paste (Rule 2).
4. Wait 60–180s, then click the **poll icon** (bar chart) in the composer toolbar. This adds the poll widget.
5. For each option: write the option text to clipboard, click the option field (`[data-testid="choice-input-N"]`), `Ctrl+V`. Wait 60–180s between options.
6. Set the duration in the widget's duration controls.
7. Wait 60–180s, then click **Post** and wait for confirmation.

### Step 4 — Capture URL
Click the confirmation toast to navigate to the tweet within the same session. Do NOT navigate to a fresh URL — that triggers a full page reload and can cause rate limits. If the URL can't be retrieved, leave `poll_url` blank — do NOT mark as failed.

### Step 5 — Update JSON
- `status` → `"posted"`
- `posted_at` → current ISO 8601 datetime
- `poll_url` → captured URL

## Known behavior

**The script posts all polls as 7-day duration regardless of the JSON `duration` field.** This is intentional — Mike wants all polls to run 7 days. The `duration` field is effectively ignored. Leave it at any value (commonly `1d`) as a placeholder.

**Resetting a stuck poll** (`status: "posting"` after a crash):
```
node -e "
const fs=require('fs');
const d=JSON.parse(fs.readFileSync('data/x-polls.json','utf8'));
const p=d.polls.find(x=>x.status==='posting'||x.status==='failed');
if(p){p.status='pending';delete p.error;fs.writeFileSync('data/x-polls.json',JSON.stringify(d,null,2));console.log('reset',p.id);}
"
```

---

## ⛔ Absolute Rules (X posting)

### Rule 0 — ONE STRIKE: stop and diagnose before retrying
If any action produces unexpected output, **STOP. Do not retry.** Diagnose first.

### Rule 1 — NEVER reload or navigate away if already on X
Stay within the SPA. Never call `navigate` or trigger a full page reload on a loaded X session.

### Rule 2 — ALWAYS use clipboard paste to enter text into X
Write full text to system clipboard, verify composer is empty, focus, `Ctrl+V`, screenshot to verify. This applies to both the tweet body AND each poll option field.

---

## ⚠ The duplicate pre-check must only compare against OTHER POLLS (fixed 2026-08-19)

**Symptom:** a pending poll is silently marked `posted` with no `poll_url`, logging
`Duplicate found: "<some other post>"`. Nothing was ever sent.

**Root cause (second time this bit us).** The pre-check scraped every
`[data-testid="tweetText"]` on the profile and matched the poll's hook against all of them.
A repurpose batch gives the tweet, the poll, the thread and the YT community post the SAME
opening line, so the poll's hook `startsWith`-matched the **single tweet posted minutes
earlier in the same task-list run** and the poll was thrown away.

The 2026-06-20 fix (`includes` -> `startsWith`) does NOT cover this: the strings do not merely
overlap, they start identically. Tightening the string comparison further cannot fix it, because
the two posts genuinely begin with the same sentence.

**The fix is a type gate, not a string gate.** A poll's duplicate can only be another POLL, so
the scan now walks `article` elements and keeps only those carrying a poll widget
(`[data-testid="cardPoll"]`, `[role="radiogroup"]`, or "Final results"/"N votes" text) before
comparing hooks. Plain tweets are never match candidates. The log line now reads
`Not found in N recent POLL post(s) (scanned M posts)` - if N is 0 while M is large, the widget
selectors have drifted and need re-checking.

**Landed in `scripts/post_x_poll.py`** (the canonical Python port; the JS twin is frozen
rollback and still carries the bug, so post polls with the Python port).

**Recovery if it happens again:** the poll was NOT posted. Reset that ONE row to `pending` and
re-run. **Do not bulk-reset every `posted` row with an empty `poll_url`** - a blank `poll_url` is
normal and expected (URL capture is best-effort and never a failure), so a blank URL is NOT
evidence a poll went unsent. Only reset the row you just watched get falsely skipped.

## Duration is ALWAYS 7 days - confirmed by Mike 2026-08-19

Both twins call `set_poll_duration(page, "7d")` regardless of the row's `duration` field, so a
row saying `1d` still posts as a 7-day poll. **Mike confirmed this is the wanted behaviour: every
X poll runs 7 days.** Do NOT "fix" this to honour the per-row `duration` value, and do not raise
it as a defect again. The `duration` field in `x-polls.json` is vestigial; ignore it.
