# Tweet Scheduler Skill

## Objective
This skill exposes seven independent capabilities. **Order, frequency, and which capabilities run together are scheduling decisions made by the user in conversation** — this file documents only the mechanics of each capability:

1. **Post one pending single tweet** from `data/x-tweets.json` (Part 1)
2. **Post one pending thread atomically** from `data/x-threads.json` (Part 1B)
3. **Post one pending X poll** from `data/x-polls.json` (Part 1C)
4. **Post one pending YouTube text poll** from `data/yt-text-polls.json` (Part 1D)
5. **Post one pending Instagram carousel** from `data/ig-carousel.json` (Part 1E)
6. **Post one pending Instagram single-image post** from `data/ig-single-image.json` (Part 1F)
7. **Collect engagement data** (views for tweets/threads, results for polls) for posted content that's mature (Part 2)

If invoked without a specific instruction about what to run, ask the user which capability they want. Don't assume an ordering between the parts — the user (or a future cron/automation they set up) will decide the cadence and routing for each content type independently.

---

## File Locations
- Single tweets queue: `C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\x-tweets.json`
- Threads queue: `C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\x-threads.json`
- X polls queue: `C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\x-polls.json`
- YouTube text polls queue: `C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\yt-text-polls.json`
- Instagram carousel queue: `C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\ig-carousel.json`
- Instagram single-image queue: `C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\ig-single-image.json`

### JSON Schema (one object per tweet inside the top-level `tweets` array)
| Field | Description |
|---|---|
| `tweet` | Full tweet text (newlines preserved as `\n`) |
| `hook` | First 1–2 lines of the tweet — the opening hook |
| `status` | `pending` / `posting` / `posted` / `failed` / `skipped-too-long` |
| `posted_at` | ISO 8601 timestamp when posted (e.g. `2026-04-29T14:00:00`), or `null` |
| `url` | Full URL of the tweet on X (e.g. `https://x.com/username/status/123456`), or `null` |
| `views` | View/impression count collected 48+ hours after posting (integer or `null`) |
| `views_captured_at` | ISO 8601 timestamp when views were collected, or `null` |
| `image_id` | 8-char UUID of an attached image, `null` if none. Matches the UUID embedded in the filename in `images/`. |
| `image_path` | Convenience field: relative path to the image file. Used directly during posting; `image_id` is the canonical link. `null` if no image. |

---

## Image attachment routine (used by Part 1 only)

**Scope:** image attachment is currently only implemented for single tweets (Part 1). Threads, X polls, and YouTube polls do not support image attachment in this skill yet — they post text-only. Don't attempt image attachment in Parts 1B, 1C, or 1D unless the user explicitly extends the schema and this routine to those parts.

Whenever you're about to click **Post** in the X composer for a single tweet, check whether the source row has an `image_id` set. If it does, attach the matching image file to the composer first.

### Matching algorithm
1. Read the `image_id` field from the source row (tweet, thread tweet, poll, etc.). If empty or null, skip image attachment entirely and proceed to post.
2. **Locate the file.** Two-step lookup:
   - First try the `image_path` field directly (faster). The path is relative to the workspace root, e.g. `schedule-tweets/images/x/x-tweets-6105b10d-kaspa-vs-btc-scarcity-hourglass.png`. Convert to absolute Windows path: `C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\images\x\x-tweets-6105b10d-kaspa-vs-btc-scarcity-hourglass.png`.
   - If `image_path` is missing or the file isn't there, fall back to globbing: `C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\images\x\x-tweets-<image_id>-*.png` (for X images) or `images\yt\yt-posts-<image_id>-*.png` (for YT images). Match by UUID, take the first hit.
3. If no file is found by either path, log a warning to the console, leave the post un-imaged, and proceed. **Posting without the intended image is better than failing the post entirely.**

### Attach via Chrome
1. Use the Chrome MCP `find` tool to locate the X composer's image-attachment file input. Query something like: *"file input for image upload in the tweet composer"*.
2. Use the Chrome MCP `file_upload` tool with the absolute Windows path to the image file and the `ref` of the file input.
3. Wait 2–3 seconds for the upload preview thumbnail to render in the composer (X processes the image client-side before posting).
4. Take a screenshot to visually verify the thumbnail appeared. If it didn't, retry once. If it still fails after one retry, log and proceed without the image (do NOT block the post).

### Don't fail the post on image errors
The posting flow is the critical path. Image attachment is an enhancement. If anything goes wrong with image lookup or attachment (file missing, upload glitch, X composer changed UI), log the issue and post the text-only version. The user can always edit the post afterward to add the image manually if needed.

---

## PART 1 — Post the Next Pending Tweet

### Step 1: Read the queue
Parse `data/x-tweets.json` and find the first object in the `tweets` array where `status` is `"pending"`. If none exist, skip to Part 2.

### Step 2: Post via Chrome
1. **Open X if not already open.** If no x.com tab is loaded, use `navigate` once to open `https://x.com/home`. If x.com is already open in any tab, click the **Home** link in the left sidebar to reach the home feed — do NOT use `navigate` or reload.
2. Wait a random 60–180 seconds, then click the **Post** button in the left sidebar to open the composer.
3. Use the clipboard paste method from Rule 2 to enter the tweet text: write to system clipboard with `mcp__computer-use__write_clipboard`, verify the composer is empty, click into the composer to focus it, then Ctrl+V. Preserve all newlines exactly as they appear in the JSON `tweet` field (the `\n` escapes become literal newlines on paste).
4. Take a screenshot to verify the text looks correct before proceeding.
5. Verify the character count is within 25,000 characters (Mike is an X Premium subscriber — the limit is 25,000, not 280). If over, skip it: set `status` to `skipped-too-long` and move to Part 2.
6. **Attach image if `image_id` is set.** Run the Image attachment routine documented above (Image attachment routine section). If the row's `image_id` is empty, skip this sub-step. If it's set, locate the file in `schedule-tweets/images/x/` (for x-tweets) or `schedule-tweets/images/yt/` (for yt-posts) using the matching algorithm and attach via Chrome `file_upload` before clicking Post. Don't fail the post if image attachment fails — log and continue.
7. Wait a random 60–180 seconds, then click the **Post** button and wait for confirmation.

### Step 3: Capture the tweet URL
After posting, X shows a confirmation toast/banner in the feed. Click that toast to open the tweet — this navigates within the same session without triggering a full page reload. Capture the URL from the address bar (format: `https://x.com/username/status/TWEET_ID`).

Do NOT navigate to a fresh URL (e.g. `https://x.com/username`) to find the tweet — that causes a full React app re-initialization and can trigger X rate limits. Stay within the same session.

If you cannot retrieve the URL, leave the `url` field blank — do NOT mark as failed.

### Step 4: Update the JSON
Update the posted tweet's object in the `tweets` array:
- `status` → `"posted"`
- `posted_at` → current datetime in ISO 8601 format
- `url` → the captured tweet URL (if retrieved)
- `hook` → if the `hook` field is `null` or empty, auto-extract it: take the first 1–2 lines of the tweet text

Write the updated JSON back to the file. Preserve all other tweets in the array; only the matched object should change.

---

## PART 1B — Post the Next Pending Thread (atomic)

Post the entire thread as one connected reply chain in a single invocation, so readers see the whole arc when they click in.

### Step 1: Read the threads queue
Read `data/x-threads.json` and find the first thread where `status` is `pending`. If none exist, this capability has nothing to do — return without posting anything.

### Step 2: Validate before starting
Before touching Chrome, verify each tweet in the thread is under 280 characters. If any tweet overflows, do NOT start posting — set the thread's `status` to `failed`, write a `validation_error` field describing which position failed, save the file, and skip to Part 2. Half-posted threads are worse than unposted threads.

### Step 3: Mark the thread mid-flight
Set the thread's `status` to `posting` and write the file. This way, if the run dies mid-chain, the next run won't try to repost from scratch — it'll see `posting` status and need manual review.

### Step 4: Compose ALL tweets at once using X's thread composer — then post in one shot

**CRITICAL RULE: Never post thread tweets one at a time as individual replies. Always use X's native thread composer to queue all tweets together and post them atomically.**

1. **Open X if not already open.** If no x.com tab is loaded, use `navigate` once to open `https://x.com/home`. If x.com is already open, click the **Home** link in the sidebar — do NOT use `navigate` or reload.
2. Wait a random 60–180 seconds, then click the **Post** button in the left sidebar to open the composer.
3. Use the clipboard paste method from Rule 2 to enter `tweets[0].text` into the first composer box: write to system clipboard with `mcp__computer-use__write_clipboard`, verify the composer is empty, click into it, then Ctrl+V. Take a screenshot to verify before proceeding.
4. Click the **"+"** (Add tweet) button at the bottom of the composer to append a new tweet box below. Paste `tweets[1].text` into it using the same clipboard paste method. Repeat for each subsequent tweet — clicking "+" and pasting each one in sequence.
5. After all N tweet boxes are filled, take a screenshot to verify all text looks correct.
6. Click **"Post all"** (the blue button in the bottom-right of the multi-tweet composer). Wait for all tweets to post and confirmation to appear.
7. After posting, click the confirmation toast/banner to navigate to the root tweet within the same session. Do NOT navigate to a fresh profile URL — that triggers a full page reload and can cause X rate limits.
8. Update the JSON: `thread_root_url = <url>` and `tweets[0].posted_url = <url>`. Save the file.

If the post fails (network error, captcha, etc.), set `status` to `failed`, write the file, abort the thread, skip to Part 2.

### Step 5: Capture reply URLs for tweets 2 through N
After the thread posts successfully via "Post all", the root tweet's page will show the full chain as replies. Click each reply's timestamp in sequence to capture its URL:
1. Navigate to the thread root URL.
2. For each `tweets[i]` (i ≥ 1), click the timestamp of that tweet in the thread to open its individual page. Capture the URL and write it to `tweets[i].posted_url`. Go back and repeat for the next one.
3. Save the JSON file once all URLs are captured.

### Step 6: Mark the thread done
Once every tweet in the array has a `posted_url`:
- `status` → `posted`
- `posted_at` → current datetime in ISO 8601 format

Save the file.

### Step 7: Post-publish verification (added 2026-05-21)
`scripts/post-thread.js` now navigates to the captured `thread_root_url` after publish and walks the rendered page to confirm every tweet is live. Verification:
- Loads `rootUrl` (end-of-flow `page.goto` — script is about to close, so the X-rules rate-limit risk is acceptable here)
- Snapshots every `article[data-testid="tweet"]` on the page → `{ text, href }` pairs
- Matches each `thread.tweets[i].text.slice(0, 40)` (whitespace-normalized) against the on-page articles
- If `matched === tweets.length` AND HTTP 2xx/3xx → `status = "posted"`, captures each `tweets[i].posted_url` from the article's status link
- Otherwise → `status = "failed"`, writes `error: "Root captured but verification failed — possible partial thread: <rootUrl>"`

This closes the highest-priority retrofit gap from `docs/retrofit-suggestions.md` (1B): a partial thread (first tweet posted, replies dropped) used to silently mark all N tweets as `posted` because the toast always extracts a valid root URL. Now the script only marks `posted` if the entire chain renders on the live root page.

---

## PART 1C — Post the Next Pending Poll

Post a single tweet with an attached X poll widget. Polls are tweets plus a 2-4 option voting widget; both are composed in the same X composer.

### Step 1: Read the polls queue
Read `data/x-polls.json` and find the first poll where `status` is `pending`. If none exist, this capability has nothing to do — return without posting.

### Step 2: Validate before starting
Before touching Chrome, verify:
- `tweet_text` is ≤ 280 characters
- `options` has between 2 and 4 entries
- Each option string is ≤ 25 characters
- `duration` is one of `5m`, `1h`, `1d`, `7d`

If any validation fails, set the poll's `status` to `failed`, write a `validation_error` field describing what failed, save the file, and stop. Do not partial-post.

### Step 3: Mark the poll mid-flight
Set `status` to `posting` and write the file. This way, if the run dies between composing and confirmation, the next run won't try to repost.

### Step 4: Post via Chrome
1. **Open X if not already open.** If no x.com tab is loaded, use `navigate` once to open `https://x.com/home`. If x.com is already open, click the **Home** link in the sidebar — do NOT use `navigate` or reload.
2. Wait a random 60–180 seconds, then click the **Post** button in the left sidebar to open the composer.
3. Use the clipboard paste method from Rule 2 to enter `tweet_text`: write to system clipboard with `mcp__computer-use__write_clipboard`, verify the composer is empty, click into it, then Ctrl+V. Preserve newlines exactly. Take a screenshot to verify before proceeding.
4. Wait a random 60–180 seconds, then click the poll icon in the composer toolbar (it looks like a bar chart). This adds the poll widget below the tweet text.
5. For each option in `options`, use the clipboard paste method: write the option text to system clipboard, click into the option field, then Ctrl+V. Poll option fields use a different selector than the tweet body — use `document.querySelector('[data-testid="choice-input-0"]')` for the first option, `choice-input-1` for the second, etc. (or inspect the DOM if these differ). Wait a random 60–180 seconds between each option. Add additional option fields if needed (X starts with 2 fields and lets you add up to 4).
7. Set the duration in the widget's duration controls. Map `5m` → 5 minutes, `1h` → 1 hour, `1d` → 1 day, `7d` → 7 days.
8. Wait a random 60–180 seconds, then click the **Post** button and wait for confirmation.

### Step 5: Capture the poll URL
After posting, X shows a confirmation toast/banner. Click it to navigate to the tweet within the same session — this avoids a full page reload. Capture the URL from the address bar (format: `https://x.com/username/status/TWEET_ID`).

Do NOT navigate to a fresh URL to find the poll — that triggers a full React app re-initialization and can cause rate limits.

If you cannot retrieve the URL, leave `poll_url` blank — do NOT mark as failed. The post is still live.

### Step 6: Update the JSON
- `status` → `posted`
- `posted_at` → current datetime in ISO 8601 format
- `poll_url` → captured URL (if retrieved)

Save the file.

---

## PART 1D — Post the Next Pending YouTube Text Poll

Post a YouTube community post with an attached text-poll widget.

**Run this via the Playwright script** — no co-work needed:

```
cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets
node scripts/post-yt-poll.js
```

Picks up the first poll with `status === "pending"` from `data/yt-text-polls.json`, posts it, and writes `status: "posted"`, `posted_at`, and `post_url` back to the file.

### Chrome profile requirement
The script uses `ytbot-profile` (`C:\Users\mnede\AppData\Local\Google\Chrome\ytbot-profile`). It connects via CDP port 9223. **Any Chrome window already using ytbot-profile must be closed** — the script spawns its own Chrome with `--user-data-dir=ytbot-profile --remote-debugging-port=9223`. Other Chrome instances on different user-data-dirs are fine.

### What the script does (step by step)
1. Reads `data/yt-text-polls.json`, finds the first `pending` poll, validates `options.length ≤ 4` and each option ≤ 65 chars, marks `posting`
2. Launches Chrome on CDP port 9223 with `ytbot-profile` and connects via Playwright
3. Verifies YouTube login (avatar button present)
4. **Pre-composer wait: 60–180 seconds** (`PRE_COMPOSE_MIN/MAX`)
5. Navigates to `https://www.youtube.com/@CodeMonkeyMike/posts`
6. Clicks `#placeholder-area`, focuses `#contenteditable-root[contenteditable="true"]`
7. Types the `question_text` character-by-character at 60–150ms per keystroke (`CHAR_DELAY_MIN/MAX`)
8. Clicks `#poll-button button` (the correct text-poll toolbar button — **NOT** `[aria-label="Poll"]`, which matches feed elements)
9. For each option in `options`:
   a. If a new field is needed, clicks `#add-option button`
   b. Mouse-clicks at the host's bounding-rect center (`tp-yt-paper-input.poll-option-input`)
   c. Types the option text character-by-character at 60–150ms per keystroke
   d. Pauses 4–7s before the next option (`ACTION_MIN/MAX`)
10. **Pre-post wait: 60–180 seconds** (`PRE_POST_MIN/MAX`)
11. Finds the **visible** Post button (the one with non-zero `getBoundingClientRect()` — see "two-button trap" below) and clicks it via `page.mouse.click(x, y)`
12. Waits for the composer to clear, then re-fetches the posts page to find the new `/post/UgkxXXXX` URL
13. Writes `status: "posted"`, `posted_at` (ISO 8601), and `post_url` back to the JSON

### Key implementation details learned in testing

**The poll button selector — `#poll-button button`, NOT `[aria-label="Poll"]`.** `[aria-label="Poll"]` matches elements in the existing posts feed (vote-on-this-poll affordances), not the composer toolbar's text-poll button. Using the wrong selector silently clicks a feed element, and the poll attachment never opens in the composer. Use `#poll-button button` — the `<button>` inside the composer's `#poll-button` span. Confirm `ytd-poll-attachment` is `display: !none` after clicking.

**The two-button trap when clicking Post.** YouTube renders **two** elements matching `button[aria-label="Post"]`:
- A hidden placeholder with `getBoundingClientRect()` returning `0×0`, always `disabled=true aria-disabled=true`.
- The real visible Post button (~61×36) at the lower-right of the composer; becomes blue/enabled after options are filled.

`document.querySelector('button[aria-label="Post"]')` returns the **hidden one** because it's first in the DOM. The script must enumerate **all** matches with `document.querySelectorAll`, filter for `rect.width > 0 && rect.height > 0 && !aria-disabled`, then `page.mouse.click(rect.x + rect.width/2, rect.y + rect.height/2)`. This is the single most common reason a poll script fails despite "everything working" — it clicks the invisible disabled placeholder and reports "Post button stays disabled."

**Real keystrokes via `page.keyboard.type()` — NOT `keyboard.insertText()`, NOT JS value setters.** Polymer's two-way binding for `tp-yt-paper-input.poll-option-input` only updates when real CDP keystrokes fire through the browser's input pipeline. `keyboard.insertText()` (IME path) updates the DOM value but NOT Polymer's data model — Post button enables, post submits, but the live post has **no options** (broken). Setting `el.value`, `el.bindValue`, or firing synthetic `input` events has the same broken-post result. Only `page.keyboard.type()` (which dispatches via `Input.dispatchKeyEvent`) updates both Polymer state and YouTube's submission state.

**Focus an option field by mouse-clicking the host coordinates — `host.focus()` doesn't work.** Programmatic focus on the inner input is rejected by Polymer (`document.activeElement` lands on a random `<A>` tag). Instead, get the host's center coordinates via `getBoundingClientRect()` from inside `page.evaluate()`, then `page.mouse.click(x, y)`. After the correct poll button is clicked, hosts have real `569×54` dimensions and the click lands cleanly.

**Login is shared with the YT community-post Chrome profile (`ytbot-profile`).** No separate login step. If cookies expire, launch Chrome manually:
```powershell
Start-Process "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "--user-data-dir=C:\Users\mnede\AppData\Local\Google\Chrome\ytbot-profile", "--no-first-run", "https://www.youtube.com/"
```
Log in to @CodeMonkeyMike, then close Chrome with the X button (graceful close, not Task Manager).

**Timing constants** (in `scripts/post-yt-poll.js`):
| Constant | Default | Purpose |
|---|---|---|
| `PRE_COMPOSE_MIN/MAX` | 60–180s | Wait before opening composer |
| `PRE_POST_MIN/MAX` | 60–180s | Wait before clicking Post |
| `ACTION_MIN/MAX` | 4–7s | Pause between UI actions (after question, between options, etc.) |
| `CHAR_DELAY_MIN/MAX` | 60–150ms | Per-keystroke delay (applies to BOTH question text and option text) |

### Resetting a stuck poll
If a run crashes mid-flight, the poll is left at `status: "posting"`. Reset it before re-running:
```
node -e "
const fs=require('fs');
const path='data/yt-text-polls.json';
const d=JSON.parse(fs.readFileSync(path,'utf8'));
const p=d.polls.find(x=>x.status==='posting'||x.status==='failed');
if(p){p.status='pending';delete p.error;fs.writeFileSync(path,JSON.stringify(d,null,2));console.log('Reset:',p.id);}
"
```

### Broken posts (no options)
If a poll publishes with no options visible on the live post (this is the "Polymer enabled but submission state empty" failure mode), the post must be deleted manually before retrying — the script will not detect this and will mark `posted` with a URL pointing at a broken post. Always verify the live URL renders the poll widget after the script completes. The current script avoids this via real keystrokes, but the failure mode is documented in `docs/youtube-poll-attempts.md` for posterity.

---

## PART 2 — Collect Engagement Data for Mature Posts

Collect engagement data for posted content from all three queues: views for tweets and threads, vote results for polls. Each piece of content has its own maturity rule.

### Step 1: Find eligible items

**From `data/x-tweets.json`**, find all rows where:
- `status` is `posted`
- `posted_at` is more than 48 hours ago
- `views` is empty

**From `data/x-threads.json`**, find all individual tweets inside threads where:
- The thread's `status` is `posted`
- The thread's `posted_at` is more than 48 hours ago
- The individual tweet's `views` is empty
- The individual tweet's `posted_url` is set

**From `data/x-polls.json`**, find all polls where:
- `status` is `posted`
- `posted_at` plus the `duration` is in the past (poll voting has closed)
- `results` is null

Duration mapping for poll close calculation: `5m` → +5 minutes, `1h` → +1 hour, `1d` → +24 hours, `7d` → +168 hours.

**From `data/yt-text-polls.json`**, find all polls where:
- `status` is `posted`
- `posted_at` plus `capture_results_after_days` (as days) is in the past
- `results` is null

YouTube polls don't auto-close like X polls; this is a snapshot of the live results at the maturity window, not a final tally. The poll stays open after.

If none of the four lists has anything eligible, done.

### Step 2: Collect via Chrome

**For tweets and thread members:**
1. To navigate to the tweet: if already on x.com, use `javascript_tool` to run `window.location.assign('URL')` or click the link within the SPA — do NOT call the `navigate` tool while on x.com. If not on x.com at all, you may use `navigate` once to open the tweet URL directly.
2. Find the view/impression count displayed at the bottom of the tweet.
3. Record the number (e.g. `14200`).

**For X polls:**
1. Navigate to the poll URL using the same rule: click-based within x.com, or `navigate` only for the initial load.
2. The closed poll displays each option with its vote count and percentage.
3. Record vote counts per option as a JSON object: `{"Option 1 text": 234, "Option 2 text": 567, ...}`
4. Use the exact option strings as they appear in the poll's `options` array (so the keys map cleanly back to the original entries).

**For YouTube text polls:**
1. Navigate to the poll's `post_url` in Chrome (YouTube is a separate site — `navigate` is fine here).
2. Read the live vote counts and percentages from the poll widget.
3. Record vote counts per option as a JSON object using the same exact-string-key approach as X polls.

### Step 3: Update the files

- For single tweets: write `views` and `views_captured_at` back to the matching tweet object in `data/x-tweets.json`.
- For thread tweets: write `views` and `views_captured_at` back to the matching tweet object in the JSON.
- For X polls: write `results` (the vote-count object) and `results_captured_at` back to the poll object, and flip `status` to `closed`.
- For YouTube text polls: write `results` and `results_captured_at` back to the poll object, and flip `status` to `captured` (the YT poll itself stays live; this is just a snapshot).

Save each file only if you actually changed something in it.

---

---

## PART 1E — Post the Next Pending Instagram Carousel

Post a single carousel (multi-image post) to @realcodemonkeymike on Instagram.

> **⛔ BROWSER ONLY — NEVER USE COMPUTER USE TOOLS FOR INSTAGRAM.**
> All Instagram posting must be done exclusively with `mcp__Claude_in_Chrome__*` tools.
> Never call `mcp__computer-use__*` tools (screenshot, left_click, type, write_clipboard, etc.) for any Instagram action.
> The Chrome MCP tools (`find`, `file_upload`, `computer`, `navigate`, `javascript_tool`) are the only permitted tools for interacting with Instagram.

### Step 1: Read the queue
Read `data/ig-carousel.json` and find the first post where `status` is `pending`. If none exist, this capability has nothing to do — return without posting.

Queue file: `C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\ig-carousel.json`

### Step 2: Open the Create dialog
1. Navigate to `https://www.instagram.com/` if not already there.
2. Use `find` to locate the "New post" / "Create" link and click it.
3. When the Create menu appears, click "Post".
4. Wait 2 seconds for the "Create new post" dialog to open.

### Step 3: Upload all slides via file_upload (NOT by clicking)
**⛔ CRITICAL: Do NOT click the "Select from computer" button.** CDP clicks on Instagram's "Select from computer" button do NOT open a native OS file picker in the browser — they open a dialog that Claude cannot see or interact with. Instead:

1. Use `find` to locate the hidden file input element: query something like *"file input for uploading photos or videos"*. It will return a `ref_XXX`.
2. Collect all image paths for the carousel's slides in order. Each path is in `slides[i].image_path` (relative to the project root). Convert to absolute Windows paths: `C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\images\yt\yt-posts-<image_id>-<seq>-<slug>.png`.
3. Use `file_upload` with the `paths` array (all slides at once, in sequence order) and the file input `ref`. This injects all images directly, bypassing the OS dialog entirely, and triggers Instagram's React state update correctly.
4. Wait 3–4 seconds for all slide thumbnails to load.
5. Take a screenshot to verify the slides appeared.

### Step 4: Advance through Crop and Edit steps
Instagram shows a multi-step flow after upload: **Crop → Edit/Filters → Caption (Share)**.

1. **Crop step:** Use `find` to locate the "Next" button in the Create new post dialog and click it by `ref`. Do NOT click by coordinate — the Next button must be targeted by `ref` to avoid misses. Wait 2 seconds.
2. **Edit/Filters step:** Use `find` again to locate the "Next" button (it re-renders) and click it by `ref`. Wait 2 seconds.
3. Take a screenshot to confirm you're on the Caption step (you'll see the caption textarea and the "Share" button).

### Step 5: Type the caption
1. Use `find` to locate the caption textarea ("Write a caption…") and click it by `ref` to focus.
2. Use the Chrome MCP `computer` tool with `action: "type"` to type the full caption text. Instagram's textarea works with direct typing (unlike X's React composer — no clipboard paste needed).
3. Caption text comes from the `caption` field in the JSON. Type it exactly, preserving all newlines.
4. After the caption text, add a blank line, then type the **3 most relevant hashtags** from the post's `hashtags` array on a single line, space-separated. Format: `#tag1 #tag2 #tag3`. Maximum 3 hashtags — no more.

> **⛔ NEVER post a first comment with hashtags after sharing.** All hashtags go in the caption. Ignore any `hashtag_placement` field in the JSON — that field is deprecated. No post-share comment step.

### Step 6: Click Share
**✅ Pre-share checklist — verify ALL of these before clicking Share:**
- [ ] Caption text is in the caption field
- [ ] Exactly 3 hashtags are appended to the caption (not in a comment, not after sharing — IN the caption, right now, before clicking Share)
- [ ] The caption textarea is NOT empty

1. Use `find` to locate the "Share" button and click it by `ref`.
2. Wait up to 15 seconds for the "Your post has been shared." confirmation screen.
3. Take a screenshot to confirm success.

### Step 7: Get the post URL
1. Navigate to `https://www.instagram.com/realcodemonkeymike/` to load the profile.
2. Scroll down to see the post grid and click the most recently posted image (top-left of the grid).
3. Wait for the post modal to open — the URL will update to `https://www.instagram.com/p/<POST_ID>/`. Capture this URL.

### Step 8: Update the JSON
Update the posted carousel's entry in `data/ig-carousel.json`:
- `status` → `posted`
- `posted_at` → current datetime in ISO 8601 format
- `post_url` → the captured post URL (e.g. `https://www.instagram.com/p/DYKfaYulShN/`)

Save the file.

### Post-publish verification: use the "Next" arrow as the carousel signal (fixed 2026-05-21)
Earlier versions of `scripts/post-ig-carousel.js` counted carousel slides via `button[aria-label*="Go to slide"]` / `button[aria-label*="Go to"]`. On the post's landing page IG does **not** render those slide-dot buttons until the user interacts with the carousel — so a freshly posted carousel returned `slideCount: 0` and the script marked `status: "failed"` despite the post being live and correct.

Fixed by adding `isCarousel = !!document.querySelector('button[aria-label="Next"]')` to `inspectPost()`. The Next arrow is rendered immediately on multi-image posts and never on single-image posts. `verifyPosted()` now gates the carousel check on `info.isCarousel` (`hasNext OR dots ≥ 2`) instead of `slideCount ≥ 2`. Confirmed against a known carousel (`DYm1CQnlUIV`: `isCarousel:true`) and a single-image post (`DYm-n1SlZrQ`: `isCarousel:false`) on 2026-05-21.

---

## PART 1F — Post the Next Pending Instagram Single-Image Post

Post a single image post to @realcodemonkeymike on Instagram.

**Run this via the Playwright script** — no co-work needed:

```
cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets
node scripts/post-ig-single.js
```

Picks up the first post with `status === "pending"` from `data/ig-single-image.json`, posts it, and writes `status: "posted"`, `posted_at`, and `post_url` back to the file.

### Chrome profile requirement
The script uses `igbot-profile` (`C:\Users\mnede\AppData\Local\Google\Chrome\igbot-profile`). **Chrome must be fully closed before running** — if any Chrome window is open, Playwright will get "Opening in existing browser session" and fail immediately.

To kill Chrome before running:
```powershell
Stop-Process -Name chrome -Force -ErrorAction SilentlyContinue
```

### What the script does (step by step)
1. Reads `data/ig-single-image.json`, finds first `pending` post, marks it `posting`
2. Launches Chrome with `igbot-profile` (headless: false, automation flags suppressed)
3. Navigates to `https://www.instagram.com/` and checks for the login form — if one appears, aborts
4. Finds and clicks the **"New post"** button (`[aria-label="New post"]` in the left sidebar)
5. Clicks **"Post"** from the expanded sidebar sub-links
6. Calls `setInputFiles()` on the hidden file input to upload the image (bypasses the OS file picker dialog entirely)
7. **Selects 4:5 (portrait) crop** via click-open menu — see CRITICAL note below
8. Clicks **Next** (Crop step), **Next** (Filter/Edit step)
9. Focuses the caption textarea and types: `caption text` + blank line + top 3 hashtags
10. Verifies caption is non-empty, then clicks **Share**
11. Navigates to the profile page, grabs the first `/p/` link as the post URL
12. Writes `status: "posted"`, `posted_at`, `post_url` back to the JSON

**CRITICAL — 4:5 crop must be selected explicitly before Next (added 2026-05-21).** IG defaults the crop to 1:1 for image uploads, but Mike's spec is 4:5. The "Select crop" trigger (SVG `aria-label="Select crop"`) is the SAME element as in the Reel flow (PART 1I.3) and the SAME menu opens with the SAME 4 options (Original / 1:1 / 4:5 / 16:9) — each a `<div role="button">` wrapping `<span>` text + an SVG aria-label. But the menu opens **on click** in this flow, not on hover (Reel is the opposite — hover opens, click closes). Working pattern:
```js
await cropTrigger.scrollIntoViewIfNeeded();
await cropTrigger.click();                   // image flow: click opens menu
await page.waitForTimeout(400);
const coords = await page.evaluate(() => {   // find 4:5 by text
  for (const el of document.querySelectorAll('[role="button"]')) {
    const span = el.querySelector('span');
    if (span?.textContent.trim() === '4:5') {
      const r = el.getBoundingClientRect();
      if (r.width > 0) return { x: r.x + r.width/2, y: r.y + r.height/2 };
    }
  }
  return null;
});
await page.mouse.move(coords.x, coords.y, { steps: 10 });
await page.mouse.click(coords.x, coords.y);
```
The `steps: 10` mousemove keeps the cursor continuously inside the menu region so it doesn't close before the click lands. **Carousels do NOT need crop selection** — Mike's carousels are 1:1 which is IG's default. **Reels use hover, single uses click for the same trigger element** — same DOM, different React handlers.

### Key implementation details learned in testing

**Login check is negative, not positive.** Don't check for nav elements to confirm login — Instagram's nav selectors are unreliable as a positive signal. Instead, check for the *presence of a login form* (`input[name="username"]`). If the login form appears, we're not logged in; otherwise assume we are.

**"New post" expands the sidebar inline — it is NOT a floating menu.** Clicking `[aria-label="New post"]` expands the left sidebar nav to show "Post" and "AI" as sub-links directly in the sidebar. There is no floating popover or modal menu. Find and click the "Post" sub-link using:
```javascript
page.getByRole('link', { name: /^Post$/ })
  .or(page.getByRole('button', { name: /^Post$/ }))
  .first()
```
Fallback: `page.locator('a, button, span, div').filter({ hasText: /^Post$/ }).first()`

**The file input is always hidden — use `state: 'attached'`, not `state: 'visible'`.** Instagram's `<input type="file">` is intentionally `display:none`. `waitFor()` defaults to waiting for visibility and will time out. Always use `{ state: 'attached' }`. `setInputFiles()` works on hidden inputs — no need to make it visible first.

**Two "Share" buttons exist on the caption step.** The dialog renders a "Share" post button plus a "Share to" expand chevron, both with `role="button"` and matching the name "Share". Using `getByRole('button', { name: 'Share' })` without `.first()` will throw a strict mode violation. Always use `.first()`.

**Caption typing: direct `page.keyboard.type()` works fine.** Instagram's caption textarea is a standard contenteditable, not X's React-controlled contenteditable. No clipboard paste required — direct typing at 5ms/char is reliable and fast.

**Post URL: navigate to profile and grab first `/p/` link.** After sharing, navigate to `https://www.instagram.com/realcodemonkeymike/` and evaluate `document.querySelector('a[href*="/p/"]').href`. The most recently posted image appears first.

**`--user-data-dir` in PowerShell must have no inner quotes.** When launching Chrome via `Start-Process` with `-ArgumentList`, pass the flag as `"--user-data-dir=C:\path\igbot-profile"` — NOT `'--user-data-dir="C:\path\igbot-profile"'`. The inner quotes cause Chrome to silently ignore the flag and fall back to the default User Data profile.

**igbot-profile session.** The Instagram session in igbot-profile is preserved across runs — no login step needed. If the session ever expires, launch Chrome manually:
```powershell
Start-Process "C:\Program Files\Google\Chrome\Application\chrome.exe" -ArgumentList "--user-data-dir=C:\Users\mnede\AppData\Local\Google\Chrome\igbot-profile", "--no-first-run", "https://www.instagram.com/"
```
Log into @realcodemonkeymike, then close Chrome with the X button (not Task Manager — graceful close is required for cookies to save).

### Resetting a stuck post
If a run crashes mid-flight, the post is left at `status: "posting"`. Reset it before re-running:
```
node -e "
const fs=require('fs');
const d=JSON.parse(fs.readFileSync('data/ig-single-image.json','utf8'));
const p=d.posts.find(x=>x.status==='posting'||x.status==='failed');
if(p){p.status='pending';delete p.error;fs.writeFileSync('data/ig-single-image.json',JSON.stringify(d,null,2));console.log('Reset:',p.id);}
"
```

---

## ⛔ ABSOLUTE RULES — These override everything else. No exceptions.

### Rule 0: ONE STRIKE — stop and diagnose before retrying ANYTHING
If any action produces unexpected output — garbled text, doubled characters, missing content, a failed post, a blank page, anything that doesn't match what was expected — **STOP IMMEDIATELY. Do not retry.** Read back the textarea content, diagnose what went wrong, and explain the problem to the user before taking any further action.

**This rule exists because retrying a broken approach on X is worse than not retrying at all.** Multiple failed typing attempts accumulate in X's bot-detection systems and can trigger a block even if the individual attempts looked harmless. A single garbled run is recoverable. Three garbled runs in a row is a block.

Specifically:
- **If typing produces wrong output:** Stop, clear the textarea, diagnose the script, and fix it *before* running again. Do not run the same broken script a second time.
- **If a post fails:** Stop. Do not click Post again. Check what happened first.
- **If the page behaves unexpectedly:** Stop. Do not navigate repeatedly. Ask the user.
- **There is no scenario where retrying the same failing action without understanding the cause is acceptable.**

---

### Rule 1: NEVER reload or navigate away if already on X
If any x.com tab is already open and the page is loaded, you MUST stay within that session. Navigate by **clicking links and buttons** inside the existing SPA — never call the `navigate` tool or trigger any action that causes a full page reload while on X. Using `navigate` on an already-loaded X session re-initializes React, trips bot-detection, causes HTTP 429 rate limits, and flags the account for automation.

**First load only:** If no x.com tab is open at all, you may use the `navigate` tool once to open x.com. After that, all movement must be click-based within the SPA.

To go to the home feed from any x.com page: click the **Home** link in the left sidebar. To open the composer: click the **Post** button in the left sidebar. Never type a URL into the address bar or call `navigate` again during the session.

### Rule 2: ALWAYS use system-clipboard paste to enter text into X — NEVER type character by character, NEVER use insertText

Every piece of text going into an X composer (tweet body, thread tweet, poll tweet text, poll option fields) must be entered via **system clipboard paste**. This is the only reliable method. All other approaches — character-by-character typing, `execCommand('insertText')`, `execCommand('insertParagraph')`, line-by-line typing — have been proven unreliable in X's React composer and are **banned**.

**Why clipboard paste is the correct method:**
- X's React contenteditable re-renders between JS operations, causing cursor drift and garbled output when inserting text programmatically character by character.
- Paste events are handled by X's own editor logic, exactly as if a human pressed Ctrl+V — newlines, paragraphs, and special characters all render correctly.
- Writing to the OS system clipboard (not the browser clipboard via `execCommand`) bypasses React entirely and is immune to focus/cursor issues.

**The exact method to use for ALL text entry into X:**

**Step 1: Write the full text to the system clipboard** using the `mcp__computer-use__write_clipboard` tool. Pass the complete text with real newlines (`\n\n` between paragraphs). Do NOT use `execCommand('copy')` or a temp-textarea approach — those lose clipboard state when focus changes.

**Step 2: Verify the composer is empty.** Before pasting, check the composer content with:
```javascript
const el = document.querySelector('[data-testid="tweetTextarea_0"]');
el ? el.innerText.trim() : 'not found';
```
If it returns anything other than an empty string or `'\n'`, **stop and clear it** before proceeding. Pasting into a non-empty composer causes the new text to be appended to existing content, producing duplicates.

**Step 3: Click into the composer text area** to focus it.

**Step 4: Press Ctrl+V** using the Chrome MCP `computer` tool with `action: "key"` and `text: "ctrl+v"`.

**Step 5: Take a screenshot and verify** the pasted text looks correct — all paragraphs present, correct spacing, no duplication, no truncation. If anything looks wrong, stop and diagnose per Rule 0.

**For poll option fields** (which are short, single-line, and use different selectors than the tweet body): use the same clipboard-paste approach. Write each option to the clipboard, click into the option field, Ctrl+V. Each option field is a separate paste operation.

**Key lessons from failed approaches (do not regress):**
- `execCommand('insertText', false, fullText)` — unreliable. Newlines are mishandled by X's React composer; last paragraph gets appended to first line.
- Character-by-character `insertText` — unreliable. Cursor drifts when the user's window focus changes even briefly.
- `execCommand('copy')` from a temp textarea — unreliable. Clipboard state is lost when focus shifts from the temp element back to the X textarea.
- `execCommand('insertParagraph')` — breaks React internal state entirely.
- `KeyboardEvent` Enter dispatches — inconsistent across X composer versions.

---

## PART 1G — Post the Next Pending Facebook Short (vertical video to Reels)

Post one pending Facebook short (vertical video) from `data/shorts.json` to the `realCodeMonkeyMike` Page. Facebook auto-converts vertical 1080×1920 videos into Reels via the Create post → Reel edit wizard.

**Run this via the Playwright script** — no co-work needed:

```
cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets
node scripts/post-fb-short.js
```

Picks up the first short in `data/shorts.json` where `platforms.facebook.status === "pending"`, posts it as a Reel, and writes `platforms.facebook.status: "posted"`, `posted_at`, and `url` back to the file.

### Chrome profile requirement
The script uses `fbbot-profile` (`C:\Users\mnede\AppData\Local\Google\Chrome\fbbot-profile`). **Chrome must be fully closed before running** — Playwright's `launchPersistentContext` will fail if Chrome is already open with this profile.

### What the script does (step by step)
1. Reads `data/shorts.json`, finds the first short with `platforms.facebook.status === "pending"`, marks `posting`
2. Strips hashtags from the caption (`/#\w+/g`) — Facebook's tag autocomplete menu intercepts the wizard and prevents subsequent clicks
3. Launches Chrome with `fbbot-profile`
4. Navigates to `https://www.facebook.com/realCodeMonkeyMike/`, checks login form presence (NOT footer text), clicks **Switch Now** if the personal/Page-context prompt appears
5. **Pre-composer wait: 60–180 seconds** (`PRE_COMPOSE_MIN/MAX`)
6. Clicks the "What's on your mind?" placeholder to open the Create post dialog
7. Clicks the **Photo/video** button to reveal the hidden file inputs (FB renders TWO: one for `image/*` only, one for video — see "two file inputs" gotcha below)
8. `setInputFiles()` on `input[type="file"][accept*="video"]` to attach the .mp4
9. Polls `document.body.innerText` for `"100%"` (upload progress) up to 10 minutes
10. Polls for `"checking for copyrighted"` to disappear (copyright scan)
11. Types the caption character-by-character at 60–150ms per keystroke into `div[contenteditable="true"][role="textbox"]`
12. **Pre-post wait: 60–180 seconds** (`PRE_POST_MIN/MAX`)
13. Enters the wizard loop (up to 6 steps):
    a. Snapshots the topmost dialog's state to `tmp-fb-debug/stepN_state.json` + screenshot
    b. Looks for a final-submit button (`Share now` / `Post` / `Publish` / `Share` / `Done`) — if present and enabled, clicks it and exits the loop
    c. Otherwise clicks the largest-area `Next` button in the topmost dialog (FB stacks off-screen wizard pages that share the same aria-label — picking by area locks on to the active panel)
    d. 4–7s pause between every wizard click (`ACTION_MIN/MAX`)
14. Dismisses any post-publish upsell ("Not now" / "No thanks" / "Maybe later" / "Skip")
15. Polls for `"posting"` / `"reel settings"` / `"uploading"` to clear from page text (up to 2 minutes)
16. Navigates to `/realCodeMonkeyMike/videos`, waits 5–9s, scrapes the most recent `/reel/...` or `/videos/...` URL
17. **Post-publish verification**: navigates to the captured URL, confirms HTTP 2xx/3xx + a `<video>` element OR `[data-pagelet*="video" i]` container OR `meta[property="og:video"]` is present. Only marks `posted` if **both** the spinner cleared AND the URL verifies.

### Key implementation details learned in testing

**Two file inputs after clicking Photo/video.** FB renders one `input[type="file"]` with `accept="image/*,image/heif,image/heic"` (photos only — attaching a video here triggers "can't read files" error) and a second with `accept="image/*,...,video/*,video/mp4,..."`. **Always use the video-accepting one.** The locator `input[type="file"][accept*="video"]` finds it correctly.

**Hashtags break the wizard.** A `#tag` in the caption opens Facebook's tag-autocomplete menu, which overlays the dialog and intercepts every subsequent click — Next stops working, Post never appears. Strip with `caption.replace(/#[\w]+/g, '')` before typing.

**The two-button-aria trap (Next).** Facebook renders the entire wizard as off-screen-stacked panels inside ONE `[role="dialog"][aria-label="Create post"]`. By step 4, six `[aria-label="Next"]` buttons exist in the DOM (negative x coords for the past panels, positive for the active one). Picking by `document.querySelector` finds the first one (off-screen, no longer active). Solution: enumerate matches **scoped to the topmost dialog**, then **first filter to viewport-visible elements** (`r.x + r.width > 0 && r.x < window.innerWidth && r.y + r.height > 0 && r.y < window.innerHeight`), then pick the one with the largest `getBoundingClientRect()` area among on-screen matches.

**Why "largest area" alone is wrong (added 2026-05-21).** The original Create-post panel's wide Next (468×36, ~16848 area) outranks the active detail panel's narrower Next (336×36, ~12096 area) on raw area, even though it has slid to x=-5962 (deep off-screen left). With area-only ranking the script clicks the off-screen Next repeatedly, each click adding a new detail panel to the stack but never advancing to the Reel settings / final-review panel — observable as the modal "swiping left constantly" but never showing a Post button. The viewport filter is what makes the active visible Next win. The fix is `clickByLabelInDialog`'s rect filter at `scripts/post-fb-short.js` lines ~118-126.

**Page-level buttons leak through.** The Page profile is rendered behind the modal — the "Photo/video", "Reel", "Live video" tabs are still in the DOM at composer-open time. Selectors like `aria-label="Photo/video"` or `getByRole('button', { name: 'Next' })` without dialog-scoping match them too. **Always scope to the topmost visible `[role="dialog"]`** before matching wizard buttons.

**Login check uses form presence, not footer text.** Facebook's footer contains a "Log In" link even when fully logged in. Checking `getByRole('link', { name: 'Log In' })` produces false negatives. Instead check for `input[name="email"], input[name="pass"]` — those only exist on real login pages.

**The wizard has 3 Next clicks before Post appears (current FB UI as of 2026-05-21).** Observed sequence on `realCodeMonkeyMike`:
1. Create post (500×769) with caption + Next at (276, 773)
2. Reel preview / Trim video / Closed captions / Optimization (977×748) — Next at (34, 756) on the left column
3. Reel settings panel — same 977×748 dialog, now with Post audience / Remix / Tag / Scheduling / Share to story / Boost on the left column and a **Post** button at (34, 756, 336×36)

Previous observation logged here had 5–6 Next clicks; FB consolidated several Reel-detail sub-panels into one as of late May 2026. The wizard loop tolerates up to 12 iterations, but with the viewport filter in place the modern flow lands on Post within 3 clicks.

**Post-publish upsell appears as a new dialog.** After clicking Post on step 6, a smaller "Add WhatsApp button / Not now" dialog appears. The script dismisses by clicking "Not now". Other variants seen: "No thanks", "Maybe later", "Skip".

**Verification is mandatory.** A submitted upload that gets silently dropped by Facebook still clears the "Posting" spinner — the URL on /videos may even point at the previous video. The verification step navigates to the URL and confirms a `<video>` element / `og:video` meta tag is present.

**Timing constants** (in `scripts/post-fb-short.js`, matched to `post-x-short.js`):
| Constant | Default | Purpose |
|---|---|---|
| `PRE_COMPOSE_MIN/MAX` | 60–180s | Wait before opening composer |
| `PRE_POST_MIN/MAX` | 60–180s | Wait before entering wizard loop |
| `ACTION_MIN/MAX` | 4–7s | Pause between major UI actions (clicks, attaches, between Next clicks) |
| `CHAR_DELAY_MIN/MAX` | 60–150ms | Per-keystroke delay for caption typing |
| `VIDEOS_TAB_WAIT_MIN/MAX` | 5–9s | Settle delay before scraping new URL from /videos tab |

### Debug artifacts

Each wizard step's button list + screenshot is saved to `tmp-fb-debug/stepN_state.{json,png}`. On failure, `tmp-fb-debug/FAILED_final_state.{json,png}` captures the last seen state. Inspect these when the wizard behavior changes after a Facebook UI update.

### Resetting a stuck short
If a run crashes mid-flight, the row is left at `status: "posting"` (which the next run treats as `pending`). To explicitly reset:
```
node -e "
const fs=require('fs');
const d=JSON.parse(fs.readFileSync('data/shorts.json','utf8'));
const s=d.shorts.find(x=>x.platforms.facebook?.status==='posting' || x.platforms.facebook?.status==='failed');
if(s){s.platforms.facebook.status='pending';delete s.platforms.facebook.error;fs.writeFileSync('data/shorts.json',JSON.stringify(d,null,2));console.log('Reset:',s.id);}
"
```

---

---

## PART 1H — Post the Next Pending TikTok Short (CDP-attach to main Chrome)

Post one pending TikTok short (vertical video) from `data/shorts.json` to `@realcodemonkeymike` via TikTok Studio.

**Run this via the Playwright script** — no co-work needed:

```
cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets
node scripts/post-tiktok-short.js
```

Picks up the first short in `data/shorts.json` where `platforms.tiktok.status === "pending"`, posts it, and writes `platforms.tiktok.status: "posted"`, `posted_at`, and `url` back to the file.

### Why this script is different from the others

TikTok aggressively detects browser automation. Standard `launchPersistentContext` (used by every other script in this repo) triggers TikTok's bot-detection: login redirects, "maximum attempts reached" lockouts, and silent upload failures — even with `--disable-blink-features=AutomationControlled` and `navigator.webdriver = undefined`.

The fix: **don't launch Chrome via Playwright. Spawn the user's REAL Chrome process, then attach Playwright via CDP.** TikTok sees a perfectly normal Chrome session with real fingerprints because there is nothing fake to detect.

### Chrome profile + close-everything requirement
The script uses the user's **main Chrome User Data directory**:
```
C:\Users\mnede\AppData\Local\Google\Chrome\User Data
--profile-directory=Default
```

It spawns Chrome with `--remote-debugging-port=9224 --user-data-dir=<above> --profile-directory=Default`, then connects via `chromium.connectOverCDP('http://127.0.0.1:9224')`.

**REQUIREMENT: All Chrome windows must be FULLY CLOSED before running.** Chrome can't open a second instance against the same User Data dir, and it can't add `--remote-debugging-port` to an already-running instance. Use Task Manager to confirm no `chrome.exe` processes remain before invoking the script.

If Chrome's CDP port doesn't open within 15s, the script throws — the most common cause is a leftover Chrome process (background app, tray icon, system update worker) still holding the User Data lock.

### What the script does (step by step)
1. Reads `data/shorts.json`, finds the first short with `platforms.tiktok.status === "pending"`, marks `posting`
2. Spawns real Chrome with main User Data + CDP port 9224. Connects Playwright via CDP.
3. Navigates to `https://www.tiktok.com/tiktokstudio/upload?lang=en`
4. **Login handling**: if TikTok redirects to `/login`, waits up to 10 minutes for the user to sign in manually in the open Chrome window. TikTok session cookies expire silently — users often think they're logged in when they aren't. After login, the script navigates back to the upload page.
5. **Pre-composer wait: 60–180 seconds** (`PRE_COMPOSE_MIN/MAX`)
6. `setInputFiles()` on `input[type="file"]` to attach the .mp4
7. Waits up to 90s for the caption composer (`div[contenteditable="true"][role="combobox"]`)
8. Dismisses any onboarding overlay (`[data-test-id="overlay"]` → `button[data-action="skip"]`)
9. Clicks into the caption field, presses `Ctrl+A`+`Delete` to clear TikTok's auto-populated filename, then types the caption character-by-character at 60–150ms per keystroke
10. **Pre-post wait: 60–180 seconds** (`PRE_POST_MIN/MAX`)
11. Finds and clicks the Post button (`getByRole('button', { name: 'Post' })`). If a confirmation dialog appears, clicks the second Post button to confirm.
12. Waits up to 5 minutes for either a success toast (`/your video is being uploaded|video has been posted|posted successfully/i`) OR a URL redirect to `/tiktokstudio/content` — whichever happens first
13. Navigates to `/tiktokstudio/content`, waits 5–9s, scrapes the most recent `/video/<id>` link
14. **Post-publish verification**: navigates to the captured `/video/<id>` URL, confirms HTTP 2xx + a `<video>` element OR `[data-e2e*="video"]` container OR `meta[property="og:video"]` is present. Only marks `posted` if **both** the confirmation fired AND the URL verifies.

### Key implementation details learned in testing

**Standard Playwright launch is dead on arrival.** Even with `--disable-blink-features=AutomationControlled`, `--ignoreDefaultArgs: ['--enable-automation']`, and `navigator.webdriver = undefined`, TikTok lands at `/login` and refuses subsequent attempts with "maximum number of attempts reached". This persists for 24+ hours per profile/IP. CDP-attach to real Chrome bypasses every detection because there's nothing to detect.

**The user's main Chrome profile has the only viable TikTok session.** Dedicated `tiktokbot-profile` directories are unusable once they've triggered the lockout. The main `User Data\Default` profile has the user's real cookies, fingerprint, and history — this is the only safe attach target.

**TikTok pre-fills the caption with the filename.** After `setInputFiles()`, the caption composer auto-populates with the file's display name. Without clearing it, the typed caption appends to the filename. Solution: focus the composer, `Ctrl+A`+`Delete`, then type.

**The Post button triggers a confirmation dialog on first click.** Clicking the visible "Post" button opens a second dialog with another "Post" button to confirm. The script handles this by re-querying for `Post` after the first click and clicking again if the second one appears. If no dialog appears, the second query silently times out.

**Two completion signals — accept the first.** TikTok shows a success toast briefly, but the more reliable signal is the URL redirect to `/tiktokstudio/content`. The script `Promise.races`-equivalent the two: whichever fires first counts as confirmation.

**Don't kill the spawned Chrome on exit.** Unlike the other scripts, this one ends with the user's real Chrome window still open — they continue using it normally. The script only `await browser.close()` on the Playwright connection (which detaches from CDP without killing Chrome).

**Workaround when `spawn(chrome.exe, ...)` silently fails to open CDP 9224 (added 2026-05-21).** Symptom: `Error: Chrome did not open CDP 9224 within 15s` even with all Chrome processes confirmed killed (`Get-Process chrome` returns 0) and no other process holding the port. The script's `spawn()` runs with `stdio: 'ignore'` so any Chrome stderr is swallowed — Chrome appears to fail silently when launched from Node in some sessions. Workaround that succeeds reliably:

```powershell
# 1) Manually start Chrome with the same flags
Start-Process -FilePath "C:\Program Files\Google\Chrome\Application\chrome.exe" `
  -ArgumentList "--user-data-dir=C:\Users\mnede\AppData\Local\Google\Chrome\User Data", `
  "--profile-directory=Default", "--remote-debugging-port=9224", "--no-first-run", "about:blank"
Start-Sleep -Seconds 6

# 2) Now run the script — startChrome() detects the existing CDP and skips its own spawn
node scripts/post-tiktok-short.js
```

The script's `startChrome()` checks `isCDPReady()` first and returns null (no spawn) if Chrome is already listening on the port. The manually-launched Chrome serves both the script and any user activity.

**Timing constants** (in `scripts/post-tiktok-short.js`, matched to `post-fb-short.js` / `post-x-short.js`):
| Constant | Default | Purpose |
|---|---|---|
| `PRE_COMPOSE_MIN/MAX` | 60–180s | Wait before attaching video |
| `PRE_POST_MIN/MAX` | 60–180s | Wait before clicking Post |
| `ACTION_MIN/MAX` | 4–7s | Pause between major UI actions |
| `CHAR_DELAY_MIN/MAX` | 60–150ms | Per-keystroke delay for caption typing |

**CRITICAL — Playwright's 50MB CDP `setInputFiles` cap (added 2026-05-21).** TikTok's actual upload limit is 500MB (desktop), but Playwright connecting via CDP (`connectOverCDP` — which TikTok script requires to evade detection) refuses to transfer files larger than 50MB. Error message: `locator.setInputFiles: Cannot transfer files larger than 50Mb to a browser not co-located with the server`. **This is a Playwright client-side cap, not a TikTok server-side one** — the same video uploads fine to every other platform (Rumble, BitChute, FB, IG Reel, X) because they use `launchPersistentContext`, not CDP attach.

**Workflow when a TikTok video exceeds 50MB:**
```powershell
# Keep original as backup
Copy-Item meme-bear-market.mp4 meme-bear-market-original.mp4

# Re-encode to ~20MB at CRF 26 (visually lossless to most viewers; takes ~30s for a 36s clip)
ffmpeg -y -i meme-bear-market-original.mp4 -c:v libx264 -crf 26 -preset fast -c:a aac -b:a 128k meme-bear-market.mp4
```

Compression ratio is roughly 2.5×: 53MB → 21MB at CRF 26. Bump `-crf` higher (e.g. 30) if you need smaller; lower (e.g. 22) if quality matters more than size. Reset `tiktok` status to pending in `shorts.json` after compression and re-run.

### Debug artifacts

Each phase saves a snapshot to `tmp-tiktok-debug/`:
- `01_landed.{png,json}` — initial upload page (or login redirect)
- `02_composer_ready.{png,json}` — after video attach + composer found
- `03_caption_done.{png,json}` — after caption typed
- `04_after_post_click.{png,json}` — after first Post click
- `05_confirmed.{png,json}` — after redirect to /tiktokstudio/content

### Camoufox fallback (NOT currently used)

If CDP-attach ever stops working (e.g. TikTok closes the loophole), the Python reference at `C:\Users\mnede\Documents\Claude\social-media\uploading\uploaders\tiktok_upload.py` uses Camoufox (fingerprint-patched Firefox) with session-cookie save/restore. Invoke via the `camoufox-uploader` subagent. The Python script is untested standalone but is the documented Plan B.

### Resetting a stuck short
If a run crashes mid-flight, the row is left at `status: "posting"` (which the next run treats as `pending`). To explicitly reset:
```
node -e "
const fs=require('fs');
const d=JSON.parse(fs.readFileSync('data/shorts.json','utf8'));
const s=d.shorts.find(x=>x.platforms.tiktok?.status==='posting' || x.platforms.tiktok?.status==='failed');
if(s){s.platforms.tiktok.status='pending';delete s.platforms.tiktok.error;fs.writeFileSync('data/shorts.json',JSON.stringify(d,null,2));console.log('Reset:',s.id);}
"
```

---

---

## PART 1I — Shorts fanout: X video, YouTube Short, Instagram Reel, Rumble, BitChute

Each platform has its own queue-driven script reading `data/shorts.json`. All five run the same overall flow: launch persistent-context Chrome → navigate to the upload UI → attach the video via `setInputFiles` → wait for upload → type caption → click Post/Share → write `status: "posted"` + `posted_at` + `url` back to the JSON.

These scripts are simpler than FB (1G) and TikTok (1H) because their platforms don't have aggressive bot detection or multi-step wizards. They use the same `data/shorts.json` schema (`platforms.<key>` with `status`/`url`/`posted_at`).

### Invocation
```
cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets
node scripts/post-<platform>-short.js   # one of: post-x-short, post-yt-short, post-ig-reel, post-rumble-short, post-bitchute-short
```

Each picks up the first short where `platforms.<that-key>.status === "pending"`.

### Per-platform table

| Sub-part | Script | Platform key | Profile | Upload URL / surface |
|---|---|---|---|---|
| 1I.1 | `scripts/post-x-short.js` | `x` | `xbot-profile` | x.com home → Post button → composer |
| 1I.2 | `scripts/post-yt-short-api.js` ⭐ | `yt_shorts` | OAuth (`config/yt-api-token.json`) | YouTube Data API v3 `videos.insert` — **preferred over `post-yt-short.js`** |
| 1I.2-legacy | `scripts/post-yt-short.js` | `yt_shorts` | `ytbot-profile` | youtube.com → Create → Upload video — Playwright fallback if API quota exhausted |
| 1I.3 | `scripts/post-ig-reel.js` | `ig_reels` | `igbot-profile` | instagram.com → Create → Post (Reel via video) |
| 1I.4 | `scripts/post-rumble-short.js` | `rumble` | `rumblebot-profile` | rumble.com/upload.php |
| 1I.5 | `scripts/post-bitchute-short.js` | `bitchute` | `bitchutebot-profile` | bitchute.com/upload (Studio) |

### Timing constants per script

| Script | `CHAR_DELAY` (ms/char) | `ACTION` (s between UI actions) | `PRE_COMPOSE` (s before composer) | `PRE_POST` (s before Post/Share) |
|---|---|---|---|---|
| `post-x-short.js` | 60–150 | 4–7 | 60–180 | reused PRE_COMPOSE (60–180) |
| `post-yt-short.js` | none (clipboard paste) | 3–6 | none (immediate) | none |
| `post-ig-reel.js` | 40–120 | 3–6 | 15–45 | reused PRE_COMPOSE (15–45) |
| `post-rumble-short.js` | 40–120 | 2–5 | none | none |
| `post-bitchute-short.js` | 40–120 | 3–6 | 10–25 | none |

X-short uses the most aggressive timing (60–180s pre-composer) because X's bot detection is strict. YouTube/Rumble/BitChute have lighter detection and use shorter pauses. IG Reel sits in the middle — Instagram throttles bursts but doesn't full-lockout like X.

### Key per-platform gotchas
- **X-short:** Uses the same React-controlled composer as `post-thread.js`. Caption goes in via `page.keyboard.type()` (real keystrokes — `fill()` breaks React state). Video is attached via the hidden `input[type="file"]` inside the modal (NOT the inline home-feed one — use `.first()` after opening the composer).
- **YT Short:** Vertical 1080×1920 videos auto-route to Shorts. The "Next" wizard has 3 stages (Details → Video elements → Checks → Visibility). Script clicks Next until "Public" + "Save" is visible.
- **IG Reel:** Same `post-ig-single.js` machinery but with a video file. Posted from the **Post** flow (not a separate "Reel" menu — Instagram routes vertical videos to Reels automatically based on aspect ratio). See memory: `[[project_ig_playwright]]`.
  - **CRITICAL — 9:16 crop must be selected explicitly before Next (added 2026-05-21).** IG defaults the crop to 1:1 for video uploads. If you leave the default, IG center-crops the 9:16 video into a square and rejects/processes it as a non-Reel post or fails silently. The "Select crop" button (SVG `aria-label="Select crop"`) sits at y≈725 in a dialog often taller than the viewport — `scrollIntoViewIfNeeded` first or the click hits the page beneath the modal. The menu it opens is **hover-driven, not click-driven**: a Playwright `.click()` opens the menu for a single frame and then closes it as the cursor moves on mouseup. Working pattern:
    ```js
    await cropTrigger.scrollIntoViewIfNeeded();
    await cropTrigger.hover();                  // opens menu via mouseenter
    await page.waitForTimeout(600);              // let React render options
    const coords = await page.evaluate(() => {   // find 9:16 by text
      for (const el of document.querySelectorAll('[role="button"]')) {
        const span = el.querySelector('span');
        if (span?.textContent.trim() === '9:16') {
          const r = el.getBoundingClientRect();
          if (r.width > 0) return { x: r.x + r.width/2, y: r.y + r.height/2 };
        }
      }
      return null;
    });
    await page.mouse.move(coords.x, coords.y, { steps: 10 }); // stay inside menu while moving
    await page.mouse.click(coords.x, coords.y);
    ```
    Menu options are `<div role="button">` (NOT `<button>`) each wrapping a `<span>` text label ("Original" / "1:1" / "9:16" / "16:9") and an SVG aria-label ("Photo outline" / "Crop square" / "Crop portrait" / "Crop landscape"). Text-based lookup is more durable than aria-label lookup. The wider gotcha is that **click-based interactions fail entirely** for this menu — hover is the only working trigger. If you see "menu appears then disappears" in manual testing or your script reports the option as 0-count after the click, this is the cause.
  - **CRITICAL — DO NOT close Chrome until IG finishes uploading server-side (added 2026-05-21).** After clicking Share, IG shows a "posting" spinner while the video processes on their servers. If the browser closes before that spinner finishes, **IG silently drops the upload** — no error toast, no failed status, just nothing appears on the profile. The current script (`post-ig-reel.js`) already handles this: after Share it watches `document.body.innerText` for up to 9 minutes for either a success toast (matches `/your reel has been shared|reel shared|posted/i`), an error toast (matches `/something went wrong|action blocked|try again|temporarily restricted/i`), or modal-closed state. Then it holds an additional **5 minutes** before scraping the URL and closing the browser. Don't shorten these waits — over-waiting is cheap; under-waiting loses the post entirely.

    **Retry policy when the post doesn't appear on the profile after first attempt:**
    1. First attempt waits 5 minutes after Share before closing Chrome.
    2. If profile-grid check shows the top Reel is still the previous one (i.e. our new Reel didn't appear), retry the entire upload with a **10-minute** post-Share hold instead of 5.
    3. If the second attempt also fails to appear on the profile, **stop retrying and report to the user** — don't loop indefinitely. Likely causes at that point: account-level rate limit, content-policy block, or session/cookie expiry. Manual intervention needed.

    Profile-grid check pattern (run with Chrome already-closed):
    ```js
    const page = (await chromium.launchPersistentContext(IG_PROFILE_DIR, {...})).pages()[0];
    await page.goto('https://www.instagram.com/realcodemonkeymike/reels/');
    await page.waitForTimeout(4000);
    const topReelUrl = await page.evaluate(() => document.querySelector('a[href*="/reel/"]')?.href);
    // Compare to known previous URLs; if topReelUrl matches a known previous, the new one didn't post.
    ```
- **YT Short (API):** `scripts/post-yt-short-api.js` uses YouTube Data API v3 `videos.insert` instead of Playwright. Drop-in queue contract — reads same `data/shorts.json`, writes back `status: posted` + `url` (format `https://www.youtube.com/shorts/<id>`). See section below for OAuth setup. **This is the preferred path.**

  **URL-capture is reliable for the API script only.** The API returns the canonical video ID — no scraping required. For all Playwright-based scripts (X-short, YT-Short legacy, IG Reel, FB short, Rumble, BitChute), URL capture works by scraping the most-recent link from a profile/dashboard grid AFTER posting. **Two failure modes seen on FB + IG Reel in this session (2026-05-21):**
  1. The grid hasn't refreshed yet → captures yesterday's URL (or the URL of an earlier post from the same session). The captured URL is a valid video page so the script's HTTP-200 + `<video>` verification passes — but it's the wrong post.
  2. The upload silently failed (e.g. browser closed too soon, IG dropped it) → the grid shows the previous-most-recent post. The script reports "Posted ✓" with a URL that's not actually the new content.

  When you suspect a stale URL: run a quick profile-grid check, fetching the top 3-5 video URLs and inspecting their `og:description` meta for a caption that matches the post you just uploaded. If none match, the upload didn't land — see the IG Reel "browser-close" warning below for the most common root cause.
- **Rumble-short:** Categories are required; script picks "News" by default. License defaults to "Rumble Only".
- **BitChute-short:** Uses BitChute Studio. Title is required + ≤100 chars; script truncates the short's `title` field if necessary.

### YouTube Data API setup (one-time, for `post-yt-short-api.js`)

**Critical**: you need an **OAuth 2.0 client**, NOT an API key. Different things in Cloud Console.
- API key = unauthenticated public reads only. **Cannot upload videos.** Don't waste time creating one.
- OAuth client = required for any action touching a user's account. No IP restrictions (auth is via the user's consented refresh token).

Setup steps:
1. **Google Cloud Console → APIs & Services → Library → YouTube Data API v3 → Enable**
2. **APIs & Services → OAuth consent screen** → make sure publishing status is **Testing** (Production requires Google verification, weeks of review for the `youtube.upload` scope). Add Mike's Google account (the one that owns @CodeMonkeyMike) under **Test users**. Test-mode refresh tokens expire after 7 days, so re-auth is needed weekly until app is moved to Production. Production mode is fine for personal use — the "needs verification" warning is harmless once you're past initial review.
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID → Application type: Desktop app**. After creation, click the download icon on the credential row and save the JSON to `config/yt-oauth.json`.
4. First run of `post-yt-short-api.js`:
   - Detects no saved token → opens a local HTTP server on a random port
   - Opens your browser to Google's consent URL (auto-opens via `start ""` on Windows)
   - Sign in with the @CodeMonkeyMike-owning Google account; click **Advanced → Go to CodeMonkeyMike-app (unsafe)** at the "Google hasn't verified this app" warning (test users see this every time — harmless)
   - Authorize, get the `Authorized ✓` callback page, refresh token saves to `config/yt-api-token.json`
5. All subsequent runs: silent, no browser — script loads `yt-api-token.json`, refreshes the access token as needed, uploads.

**Quota**: video upload costs 1600 units; daily quota is 10,000 → ~6 uploads/day. Plenty for current cadence.

**Vertical 9:16 videos ≤60s auto-become Shorts** — no extra parameter beyond uploading the file. Script appends `#Shorts` to description for additional surfacing.

**Reset the refresh token**: delete `config/yt-api-token.json` to force a fresh OAuth consent on the next run. (Useful when the 7-day test-user token expires or the consent is revoked.)

### Resetting a stuck short (any platform)
```
node -e "
const fs=require('fs');
const d=JSON.parse(fs.readFileSync('data/shorts.json','utf8'));
const PLATFORM = 'rumble';  // or x / yt_shorts / ig_reels / bitchute / facebook / tiktok
for (const s of d.shorts) {
  if (s.platforms[PLATFORM]?.status === 'posting' || s.platforms[PLATFORM]?.status === 'failed') {
    s.platforms[PLATFORM].status = 'pending';
    delete s.platforms[PLATFORM].error;
    console.log('Reset', s.id);
  }
}
fs.writeFileSync('data/shorts.json', JSON.stringify(d, null, 2));
"
```

### Verification status (current as of 2026-05-21)

| Sub-part | Post-publish URL verification? |
|---|---|
| 1G — Facebook | ✓ HTTP 2xx + `<video>` / `og:video` check |
| 1H — TikTok | ✓ HTTP 2xx + `<video>` / `og:video` check |
| 1I.1 — X-short | ✗ URL captured from toast, no live-page verification |
| 1I.2 — YT Short (API) | ✓ URL is API-returned video ID — guaranteed correct, no scraping |
| 1I.2-legacy — YT Short (Playwright) | ✗ URL captured from upload-complete dialog, no live check |
| 1I.3 — IG Reel | ✗ URL grabbed from profile grid, no live check |
| 1I.4 — Rumble | ✗ URL captured from confirmation, no live check |
| 1I.5 — BitChute | ✗ URL captured from /studio, no live check |

The 1I scripts mark `status: "posted"` based on the in-flow signal (toast, redirect, dashboard refresh) rather than a follow-up GET of the captured URL. When upgrading these to match 1G/1H's contract, copy the verification block from `post-fb-short.js` (lines that fetch the URL, check `response.status() >= 200 && < 400`, and look for `<video>` or `og:video`).

---

## PART 1J — Longform uploads (Rumble + BitChute)

These scripts upload **full-length livestream recordings** (typically 1–2 hour videos) instead of vertical shorts. Different queue file, different aspect ratio, different upload surface (`/upload.php` vs `/upload-short`).

### Invocation
```
cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets
node scripts/upload-longform-rumble.js
node scripts/upload-longform-bitchute.js
```

### Per-script table

| Sub-part | Script | Profile | Queue file | Upload URL |
|---|---|---|---|---|
| 1J.1 | `scripts/upload-longform-rumble.js` | `rumblebot-profile` | (longform queue — see script for exact JSON path) | rumble.com/upload.php |
| 1J.2 | `scripts/upload-longform-bitchute.js` | `bitchutebot-profile` | (longform queue) | bitchute.com/upload Studio |

### Timing constants

| Script | `CHAR_DELAY` | `ACTION` | `PRE_COMPOSE` | `PRE_POST` |
|---|---|---|---|---|
| `upload-longform-rumble.js` | 40–120 ms | 2–5 s | none | none |
| `upload-longform-bitchute.js` | 40–120 ms | 3–6 s | none | none |

Longform timings are lighter than shorts because the upload itself (gigabytes over many minutes) is the throttling signal — additional pauses around clicks don't change the per-platform rate budget.

---

## Master timing reference (all post-* / upload-* scripts)

Single source of truth for the human-paced delays each script uses. If a delay isn't in this table, the script doesn't have one.

| Script | Part | `CHAR_DELAY` (ms) | `ACTION` (s) | `PRE_COMPOSE` (s) | `PRE_POST` (s) | URL verify |
|---|---|---|---|---|---|---|
| `post-tweet.js` | 1 | 60–150 | 4–7 | 60–180 | 5–180 | toast nav |
| `post-thread.js` | 1B | 60–150 | 4–7 | 60–180 | 60–180 | ✓ HTTP + per-tweet text match |
| `post-x-poll.js` | 1C | 60–150 | 4–7 | 60–180 | 5–180 | toast nav |
| `post-yt-poll.js` | 1D | 60–150 | 4–7 | 60–180 | 60–180 | URL fetch |
| `post-ig-single.js` | 1F | 5–40 | 1–5 | 1–15 | reused | URL fetch |
| `post-fb-short.js` | 1G | 60–150 | 4–7 | 60–180 | 60–180 | ✓ HTTP + video |
| `post-tiktok-short.js` | 1H | 60–150 | 4–7 | 60–180 | 60–180 | ✓ HTTP + video |
| `post-x-short.js` | 1I.1 | 60–150 | 4–7 | 60–180 | reused | toast nav |
| `post-yt-short.js` | 1I.2 | clipboard | 3–6 | none | none | dialog redirect |
| `post-ig-reel.js` | 1I.3 | 40–120 | 3–6 | 15–45 | reused | profile grid |
| `post-rumble-short.js` | 1I.4 | 40–120 | 2–5 | none | none | confirmation |
| `post-bitchute-short.js` | 1I.5 | 40–120 | 3–6 | 10–25 | none | studio dashboard |
| `upload-longform-rumble.js` | 1J.1 | 40–120 | 2–5 | none | none | confirmation |
| `upload-longform-bitchute.js` | 1J.2 | 40–120 | 3–6 | none | none | studio dashboard |

**Notes on this table:**
- `reused` in PRE_POST means the script applies its `PRE_COMPOSE` range a second time before the final Post/Share click instead of having a separate `PRE_POST` constant.
- `URL verify = ✓ HTTP + video` is the strict contract: navigate to the captured URL after posting, confirm HTTP 2xx/3xx plus presence of a `<video>` element / `og:video` meta tag / a player container before marking `status: "posted"`. Only 1G and 1H currently enforce this.
- All other scripts use a weaker signal (toast, redirect, dashboard refresh) — if upgrading them, copy the verification block from `post-fb-short.js`.

---

## Running Parts 1, 1B, 1D, 1F, 1G, 1H, 1I, and 1J via Claude Code (Playwright) — no co-work needed

Parts 1 (single tweets), 1B (threads), 1D (YouTube text polls), 1F (Instagram single-image), 1G (Facebook short), 1H (TikTok short), 1I (X / YT / IG Reel / Rumble / BitChute shorts), and 1J (Rumble + BitChute longform) all run directly from a Claude Code session via Playwright scripts — real Chrome, no co-work required.

| Part | Script | Profile | Queue file |
|---|---|---|---|
| 1 — X single tweet | `scripts/post-tweet.js` | `xbot-profile` | `data/x-tweets.json` |
| 1B — X thread | `scripts/post-thread.js` | `xbot-profile` | `data/x-threads.json` |
| 1C — X poll | `scripts/post-x-poll.js` | `xbot-profile` | `data/x-polls.json` |
| 1D — YouTube text poll | `scripts/post-yt-poll.js` | `ytbot-profile` (CDP 9223) | `data/yt-text-polls.json` |
| 1F — IG single image | `scripts/post-ig-single.js` | `igbot-profile` | `data/ig-single-image.json` |
| 1G — Facebook short | `scripts/post-fb-short.js` | `fbbot-profile` | `data/shorts.json` (`platforms.facebook`) |
| 1H — TikTok short | `scripts/post-tiktok-short.js` | **main `User Data\Default`** (CDP 9224) | `data/shorts.json` (`platforms.tiktok`) |
| 1I.1 — X video short | `scripts/post-x-short.js` | `xbot-profile` | `data/shorts.json` (`platforms.x`) |
| 1I.2 — YouTube Short | `scripts/post-yt-short.js` | `ytbot-profile` | `data/shorts.json` (`platforms.yt_shorts`) |
| 1I.3 — Instagram Reel | `scripts/post-ig-reel.js` | `igbot-profile` | `data/shorts.json` (`platforms.ig_reels`) |
| 1I.4 — Rumble short | `scripts/post-rumble-short.js` | `rumblebot-profile` | `data/shorts.json` (`platforms.rumble`) |
| 1I.5 — BitChute short | `scripts/post-bitchute-short.js` | `bitchutebot-profile` | `data/shorts.json` (`platforms.bitchute`) |
| 1J.1 — Rumble longform | `scripts/upload-longform-rumble.js` | `rumblebot-profile` | (longform queue) |
| 1J.2 — BitChute longform | `scripts/upload-longform-bitchute.js` | `bitchutebot-profile` | (longform queue) |

**Chrome must be closed before running any of these scripts.** Each script uses a persistent Chrome profile; if Chrome is already open with that profile, Playwright gets "Opening in existing browser session" and fails. Part 1H is the strictest — it uses the user's real main profile, so **every Chrome window must be closed** (use Task Manager to confirm). Part 1D's CDP-launch variant is fine with other Chrome instances open on different user-data-dirs but must have `ytbot-profile` itself closed.

Note on profile sharing: `xbot-profile` is shared by parts 1, 1B, 1C, and 1I.1 (all X scripts). `ytbot-profile` is shared by 1D and 1I.2. `igbot-profile` is shared by 1F and 1I.3. `rumblebot-profile` and `bitchutebot-profile` are each shared by their short + longform pair. Running two scripts that share a profile concurrently will conflict — sequence them.

---

## Running Part 1 via Claude Code (Playwright) — no co-work needed

Part 1 (single tweets) can now be run directly from a Claude Code session using the Playwright script at `scripts/post-tweet.js`. This is the same approach used for threads (`scripts/post-thread.js`) — real Chrome, Mike's xbot-profile, character-by-character typing.

### How to run

```
cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets
node scripts/post-tweet.js
```

Picks up the first tweet with `status === "pending"` that has a `tweet` field, posts it, and writes `status: "posted"`, `posted_at`, and `url` back to `data/x-tweets.json`.

### Key implementation details learned in testing

**Two `fileInput` elements exist on X** — one in the modal composer, one in the inline home-feed composer. The script uses `.first()` to target the modal one. Do not change this to a strict locator or it will throw a strict-mode violation.

**`status: "posting"` means the previous run crashed mid-flight.** The script only picks up `pending` tweets. If a tweet is stuck at `posting` after a failed run, reset it manually using Node.js before re-running:
```
node -e "
const fs=require('fs');
const path='data/x-tweets.json';
const d=JSON.parse(fs.readFileSync(path,'utf8'));
const t=d.tweets.find(x=>x.image_id==='<ID>');
t.status='pending';
delete t.error;
fs.writeFileSync(path,JSON.stringify(d,null,2));
console.log('reset');
"
```

**Never use PowerShell's `ConvertFrom-Json` / `ConvertTo-Json` to modify `x-tweets.json`.** PowerShell 5.1 reads UTF-8 files as Windows-1252 by default, mangling all 4-byte emoji characters (🐸 → ðŸ¸, 👻 → ðŸ'», etc.) into mojibake. Use Node.js for all JSON edits to this file.

**Timing constants** (in `scripts/post-tweet.js`):
| Constant | Default | Purpose |
|---|---|---|
| `PRE_COMPOSE_MIN/MAX` | 60–180s | Wait before opening composer |
| `PRE_POST_MIN/MAX` | 5–180s | Wait before clicking Post (random, so sometimes fast) |
| `ACTION_MIN/MAX` | 4–7s | Pause between UI actions |
| `CHAR_DELAY_MIN/MAX` | 60–150ms | Per-keystroke delay |

For faster test runs (not production), reduce `PRE_COMPOSE` and `PRE_POST` to 10–12s and `ACTION` to 8–10s. Restore before committing.

---

## Mechanics rules (apply within each capability — not about ordering between them)
- **Never re-post** a tweet, thread, or poll already marked `posted` (or `closed` for polls).
- **Validate before posting.** Mike is an X Premium subscriber — the character limit is 25,000 (not 280). Threads: every tweet under 25,000 chars. Polls: tweet_text under 25,000, options 2-4 entries each under 25 chars, duration in {5m, 1h, 1d, 7d}. If any check fails, mark `failed` with a `validation_error` field — never partial-post.
- **Save after every successful post.** Especially in threads — the file should always reflect what's actually live on X, so a mid-chain failure leaves a recoverable state.
- **If Chrome is not available or X fails to load,** abort — do NOT mark anything as posted.
- **Preserve newlines exactly** when typing into the composer.
- **Never trigger a full page reload to capture a URL.** After posting, use the confirmation toast/banner X shows to navigate to the tweet within the same session. Navigating to a fresh URL (e.g. `https://x.com/username`) re-initializes X's React app and can trigger rate limits (HTTP 429). Stay in session.
- **Add a random wait between every major action on X.** Before each significant interaction — clicking the composer, clicking "Add post", clicking "Post"/"Post all", and navigating to capture the URL — wait a random number of seconds between 60 and 180. Use `bash` to generate the random wait duration (`shuf -i 60-180 -n 1`) and then wait that many seconds before proceeding. Note: random delays between individual keystrokes are no longer needed since we use clipboard paste instead of character-by-character typing.
- **Never write "thousandx" — always write "1000x".** The word form is awkward and inconsistent with how other multipliers are written in this content.
- **Each capability is independent.** Part 1, Part 1B, Part 1C, and Part 2 can be invoked individually. Whether they run together, in what order, or on what cadence is determined by the user's scheduling decisions outside this file.

---

## Run notes — 2026-05-22 long sequential session (24 actions across 5h 40m)

Findings from a single sequential run covering 4 tweets, 2 X polls, 1 X thread, 3 IG singles, 1 IG carousel, 1 IG Reel, 2 YT community posts, 1 YT poll, 1 YT short (API), 1 Rumble short, 1 BitChute short, 1 X short, 1 FB short, 1 TikTok short, and 44 reply-guy replies. **Total session: 10:43 → 16:23.**

### Bash working directory is NOT persistent across invocations
Each new `Bash` tool call starts at the original cwd. `cd /c/Users/mnede/Documents/Claude/social-media/schedule-tweets` must be **prefixed to every script invocation** — relying on an earlier `cd` in the conversation will silently break the next call with `MODULE_NOT_FOUND`. Hit this 2× during the run (B1.7 and B3.1).

### Reply-guy throttle pattern emerges after ~24–30 replies in a ~4-hour window
- Batch 1 (15 replies, 11:06–12:19): 14 posted, 1 false-positive `already_replied` skip → 100% effective.
- Batch 2 (10 replies, 13:23–14:15): 9 posted, 1 failed (@TurboToadToken — verify step couldn't see reply on tweet page).
- Batch 3 (20 replies, 14:37–16:15): 14 posted, **6 failed**. Failures clustered at the start of batch 3, ~25–28 replies into the day.

Failure modes observed in batch 3:
- "Clicked Post button via JS → Reply NOT found on tweet page" — the reply may have actually posted but X is hiding it from the page (shadow-filter) or the verify step's 3s settle is too short under load.
- "Reply textarea not found" — script clicked Reply but the composer never opened. Suggests X started rate-limiting interactions on @mikeneder around the 25-reply mark.

**Mitigation for future runs:** when posting >20 replies in one window, split into two sessions ~6 hours apart (or even across days). Don't bump the `POST_DELAY_MIN/MAX` in a single session — adding gaps doesn't help once X has flagged the burst pattern.

### `post-x-poll.js` posts every poll as 7d duration (this is intentional, not a bug)
The script logs `Setting duration: 7d → 7d 0h 0m` regardless of what's in the JSON `duration` field. **This is the desired behavior** — Mike wants all polls to run for 7 days regardless of what the JSON says. The `duration` field in `x-polls.json` is effectively ignored. Leave it at any value (commonly `1d`) as a placeholder; it has no effect on the posted poll. Confirmed by user 2026-05-22.

### `post_replies.py` `already_replied()` false-positive on short emoji replies
The 🍕 reply to @saylor's Pizza Day tweet was correctly archived as `already_posted` because the function uses **first 40 chars of reply text** as a fingerprint, and "🍕" is present in countless other replies under that same Pizza Day thread. Same logic should hit any emoji-only reply on a popular thread.

**Workaround:** for `reaction_only` entries, the verify step should look for our reply *attributed to our handle* (`article[data-testid="tweet"]` containing `@mikeneder`) rather than substring-matching the page content. Or skip the pre-check entirely for `reaction_only` entries and rely on the post-action verify only. Until fixed, expect occasional emoji-reply skips and confirm manually.

### `post-thread.js` verification false-negative pattern
Today's 8-tweet thread posted as `status: failed` with `error: "Root captured but verification failed — possible partial thread"` — but inspection showed:
- 8 article elements rendered on the root page (matched `tweets.length`)
- 7/8 matched by text snippet (the unmatched one was tweet 5, "What this means for $KAS:")
- **Tweet 1's captured `posted_url` was garbage**: ended in `/romote_web/targeting` (an X internal endpoint URL fragment) instead of `/status/<id>`.

Two distinct bugs:
1. **Toast-click URL capture is occasionally grabbing an internal endpoint URL** for the root tweet — needs guard against URLs not matching `/status/\d+/?$`.
2. **Snippet matcher is over-strict** — first 40 chars normalization probably trips on em-dashes, ellipsis variants, or curly quotes. Look at the actual on-page text vs the JSON text for the unmatched tweet to confirm.

**Until fixed:** when a thread script reports verification failure but the captured root URL loads correctly with N articles in the chain, assume it's live and edit `status: posted` manually. Today's thread: https://x.com/mikeneder/status/2057872376964993398 (8/8 visible on the page).

### TikTok 50MB workflow: confirmed and timed
Re-encoding `meme-holds.mp4` from 64MB → 26MB at CRF 26 took **28s** for a 123s video on this machine. The documented `ffmpeg -y -i <orig> -c:v libx264 -crf 26 -preset fast -c:a aac -b:a 128k <out>` produces a visually-identical short at less than half the size. Workflow is reliable end-to-end:
1. `cp meme-holds.mp4 meme-holds-original.mp4`
2. ffmpeg re-encode → meme-holds.mp4
3. `node -e` reset `platforms.tiktok.status` to `pending`
4. Re-run `post-tiktok-short.js`

### TikTok CDP-spawn workaround still required (PowerShell `Start-Process` path)
The script's own `spawn()` of chrome.exe failed silently to open CDP 9224 again today (15s timeout). The manual PowerShell `Start-Process` workaround (documented in PART 1H) succeeded on the first try. **Default to the manual launch for TikTok**, don't bother with the script's internal spawn — it's faster to skip straight to the workaround.

### `post-x-short.js` posts even with caption > 280 chars
Today's X-short ran with a 464-char caption (shorts.json caption matches the Rumble/YT/BitChute version, which can be longer than X's limit). The script printed `Warning: caption is 464 chars (> 280). X may truncate or reject.` then posted anyway. The result: posted at https://x.com/mikeneder/status/2057874293124399166 — but X likely truncated the visible text.

**Recommendation:** either auto-truncate X-short captions to ~250 chars with an ellipsis, OR maintain a separate `caption_x` field in `shorts.json` for X-specific captions. Currently using one caption across all 7 platforms is wrong for X.

### `post-bitchute-short.js` returns the dashboard URL, not the video URL
Confirmed: BitChute script posts and writes `url: "https://www.bitchute.com/content"` (the Studio dashboard, not the specific video). Already noted in PART 1I verification table — no live-page URL capture for BitChute. To find the specific URL, manually visit /channel/realcodemonkeymike/ after posting.

### Reply-guy queue ↔ dashboard reconciliation pattern
When batching N replies of a larger queue, the dashboard X Replies count drops to N (it reads `replies_to_post.json` directly). To stage batches without changing the dashboard counter logic: write the planned batch to `replies_to_post.json`, keep unstaged entries in side files (e.g. `_replies_batch2.json`), and merge any failed retries into the next batch before loading. Side files are gitignore-able / ephemeral — clean up after the session.

### HARD RULE — never auto-retry a failed reply-guy entry (added 2026-05-22 after duplicate-post incident)
`post_replies.py` now **clears the entire queue at end of every run**, including failures. Failures are archived to `posted_replies.json` for audit; they are NOT requeued.

**Reason:** the verify step (load tweet → substring-match reply text) returns false-negatives under X throttle. A reply marked `failed` has very often actually posted — X is just hiding it from the verify step's view. Retrying creates duplicates that have to be manually deleted from X.

**Confirmed pattern from this session:**
- @TurboToadToken double-posted (batch 2 attempt and batch 3 attempt both went through; both marked FAILED). User manually deleted one duplicate.
- @blknoiz06, @natbrunell, @CryptoKaleo — all "Clicked Post → Reply NOT found" failures; **all already live on X** when user checked ~2 hours later.
- @RaoulGMI, @aixbt_agent — "Reply textarea not found" failures; both turned out to be **reply-restricted tweets** ("Only some accounts can reply" / "Only subscribers can reply"). Removed from the reply-guy list since they'll never be reply-able.

**Two failure modes that are always false-negatives or permanent fails — never retry:**
1. `Clicked Post → Reply NOT found on tweet page` → post fired, verify couldn't see it. Already live.
2. `Reply textarea not found` → composer never opened. Almost always a reply-restricted tweet — check on X and consider removing the author from the reply-guy list.

**How to recover from a "failed" entry:**
- Open the tweet manually on X.
- If reply is visible → do nothing (post succeeded).
- If reply is missing AND the tweet allows replies → manually re-add to `replies_to_post.json` with a human-curated retry.

Full rule lives at `C:\Users\mnede\Documents\Claude\social-media\x-reply-guy\CLAUDE.md` under "HARD RULE — never auto-retry a failed reply."

### Operational summary
- **No completed tasks needed to be reverted** during the session.
- **Failures were isolated** to specific reply-guy entries and one thread verification false-negative — no platform-level lockout, no profile session loss, no Chrome state corruption.
- **Sequential rule held perfectly** — no profile collisions, no concurrent-script conflicts. Confirms the per-platform Chrome profile separation works at scale across this many actions.
