---
name: x-post-thread
description: Post the next pending thread atomically from data/x-threads.json via the Playwright script.
---

## Invocation

```powershell
cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets
node scripts/post-thread.js
```

Picks up the first thread with `status === "pending"`, posts the entire chain atomically using X's native thread composer, and writes `status: "posted"`, `posted_at`, `thread_root_url`, and per-tweet `posted_url` back to `data/x-threads.json`.

## Queue file

`C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\x-threads.json`

## Chrome profile

Uses `xbot-profile`. Chrome must be fully closed before running.

## Timing constants

| Constant | Default | Purpose |
|---|---|---|
| `PRE_COMPOSE_MIN/MAX` | 60–180s | Wait before opening composer |
| `PRE_POST_MIN/MAX` | 60–180s | Wait before clicking "Post all" |
| `ACTION_MIN/MAX` | 4–7s | Pause between UI actions |
| `CHAR_DELAY_MIN/MAX` | 60–150ms | Per-keystroke delay |

## Posting flow

### Step 1 — Read and validate
Find the first thread where `status === "pending"`. Verify every tweet is ≤ 25,000 chars (X Premium limit). If any tweet overflows, set `status: "failed"`, write a `validation_error` field, save, and stop. Half-posted threads are worse than unposted threads.

### Step 2 — Mark mid-flight
Set `status: "posting"` and write the file before opening Chrome. If the run dies mid-chain, the next run won't try to repost from scratch.

### Step 3 — Compose ALL tweets at once, then post atomically

**CRITICAL: Never post thread tweets one at a time as individual replies. Always use X's native thread composer to queue all tweets together and post atomically.**

1. Open X (see Rule 1 — `navigate` only if no x.com tab is open).
2. Wait 60–180s, then click **Post** in the left sidebar.
3. Paste `tweets[0].text` into the first composer box using clipboard paste (Rule 2).
4. Click the **"+"** (Add tweet) button. Paste `tweets[1].text`. Repeat for each subsequent tweet.
5. After all boxes are filled, take a screenshot to verify all text is correct.
6. Click **"Post all"** and wait for confirmation.

### Step 4 — Capture root URL
Click the confirmation toast to navigate to the root tweet within the same session. Do NOT navigate to a fresh profile URL — that triggers a full page reload and can cause rate limits.

Update JSON: `thread_root_url`, `tweets[0].posted_url`. Save.

### Step 5 — Capture reply URLs for tweets 2–N
Navigate to the thread root URL. For each `tweets[i]` (i ≥ 1), click the tweet's timestamp to open its individual page, capture the URL, write to `tweets[i].posted_url`. Go back and repeat.

### Step 6 — Mark done
Once every tweet has a `posted_url`:
- `status` → `"posted"`
- `posted_at` → current ISO 8601 datetime

### Step 7 — Post-publish verification
The script navigates to `thread_root_url` after publish and confirms every tweet is live:
- Snapshots every `article[data-testid="tweet"]` → `{ text, href }` pairs
- Matches each `thread.tweets[i].text.slice(0, 40)` (whitespace-normalized) against on-page articles
- If `matched === tweets.length` AND HTTP 2xx/3xx → `status: "posted"`, captures `tweets[i].posted_url`
- Otherwise → `status: "failed"`, writes `error: "Root captured but verification failed — possible partial thread: <rootUrl>"`

## Key implementation details

**Resetting a stuck thread** (`status: "posting"` after a crash):
```
node -e "
const fs=require('fs');
const d=JSON.parse(fs.readFileSync('data/x-threads.json','utf8'));
const t=d.threads.find(x=>x.status==='posting'||x.status==='failed');
if(t){t.status='pending';delete t.error;fs.writeFileSync('data/x-threads.json',JSON.stringify(d,null,2));console.log('reset',t.id);}
"
```

**Verification false-negative pattern (observed 2026-05-22):** Thread posted as `status: "failed"` with "verification failed" but the chain was actually live. Two bugs:
1. Toast-click URL capture occasionally grabs an internal endpoint URL (not `/status/\d+`). Needs a guard: reject URLs not matching `/status\/\d+\/?$/`.
2. Snippet matcher is over-strict — em-dashes, ellipsis variants, or curly quotes in the JSON text don't match the normalized on-page text.

**Until fixed:** when a thread reports verification failure but the root URL loads correctly with N articles, assume it's live and manually set `status: "posted"`.

---

## ⛔ Absolute Rules (X posting)

### Rule 0 — ONE STRIKE: stop and diagnose before retrying
If any action produces unexpected output, **STOP. Do not retry.** Diagnose first. Retrying a broken approach on X accumulates in bot-detection and can trigger a block.

### Rule 1 — NEVER reload or navigate away if already on X
Stay within the SPA. Never call `navigate` or trigger a full page reload on a loaded X session.

### Rule 2 — ALWAYS use clipboard paste to enter text into X
Write full text to system clipboard, verify composer is empty, focus, `Ctrl+V`, screenshot to verify. Character-by-character typing and `execCommand` approaches are banned.
