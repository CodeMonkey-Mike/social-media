# x-reply-guy — Claude Workflow

## Project
Reply-guy automation for @mikeneder. Curated X list of 191 high-signal crypto accounts.
Full context in `reply_guy_project_handoff.md`. Voice/style rules: see the project-wide single source of truth at `../persona/persona.json` (moved out of `config/` so reply-guy and repurpose share one persona).

---

## Workflow (per session)

### 1. Scrape feed
```
python scrape_feed.py
```
Writes top posts to `data/feed.json`, `data/following_feed.json`, and `data/foryou_feed.json` (scored by recency + engagement, 1 post per author).

> ⚠ **All reply-guy data files live under `data/`** — `feed.json`, `following_feed.json`, `foryou_feed.json`, `reply_opportunities.json`, `replies_to_post.json` (the single reply queue: text + emoji + GIF), `posted_replies.json`. The dashboard and every `*.py` script read/write the `data/` copies. Writing to the folder root instead is the #1 way drafts silently never appear in the dashboard. (Fixed 2026-06-02.)

### 2. Draft reply opportunities
Read `data/feed.json`, `data/following_feed.json`, and `data/foryou_feed.json`. For each post, evaluate against Mike's engages_with list in `persona.json`.
Draft replies using his voice rules. **Overwrite `data/reply_opportunities.json` with only the new session's entries** — do not append to old content, do not carry over previous entries. This file holds opportunities Mike has NOT yet reviewed; once he approves an entry (via the dashboard's "Queue" button, or you writing it on his pick), it moves to `data/replies_to_post.json` as a pending queued reply.

Write a JSON array to `data/reply_opportunities.json`:
```json
[
  {
    "author": "@handle",
    "tweet_url": "https://x.com/...",
    "tweet_text": "[original tweet text]",
    "source": "For You feed | Following feed | Reply Guy list",
    "why_reply": "[1-2 sentences on relevance]",
    "reply_text": "[draft in Mike's voice]",
    "reaction_only": false
  }
]
```

**Reaction-only quota (DO NOT skip this — it silently regresses to all-text otherwise).** Per `persona.json` → `reply_voice.reaction_only`, roughly **1 in 20 replies** is a reaction with no text: a single emoji OR a GIF. When drafting a batch of N opportunities, deliberately include about **N/20** reaction-only entries (e.g. ~1 per 20-entry batch; for small batches include at least one when a fitting moment exists). Reserve them for genuinely exciting (🚀) or crazy/unbelievable (😱) moments — the reaction IS the reply. Do not force it onto a tweet that warrants a real take.

- **Emoji reaction:** set `"reaction_only": true` and put the emoji in `reply_text`.
- **GIF reaction:** set `"reaction_only": true` + `"gif_search": "<query>"` (leave `reply_text` empty) — see the ⛔ note below.

**Image replies (4th reply type — text, emoji, GIF, image).** Some tweets land far harder as a
generated image than as words. When drafting, load **`example-images/library.json`** (canonical
style index: 32 styles across 7 rhetorical lanes, each with `when_to_use` / `avoid_when` signals)
and check each strong opportunity against it. When a tweet clearly matches a style, add to the
entry:

```json
{
  "image_style": "<slug from library.json>",
  "image_prompt": "<the style's prompt_skeleton with every {SLOT} filled for THIS tweet>",
  "reply_text": ""
}
```

- **Quota:** image replies are seasoning, like GIFs — at most **1-2 per 20-entry batch**, only
  when the image IS the take. Never force a style onto a tweet. **Exception:** Mike can order an
  **image-heavy / all-image batch** (first one 2026-07-07); then EVERY entry is an image reply,
  no text-only / emoji / GIF entries at all, and style repeats are fine when a tweet has no
  better match.
- **The exemplar is a STYLE reference only.** Generation sends the style's exemplar file as the
  reference image so ChatGPT copies the LOOK (medium, composition, texture) — never the content.
  Fill every slot from THIS tweet; do not inherit the exemplar's Kaspa/teal theming unless the
  take itself is about Kaspa. `generate_reply_images.js` appends the backwards-K logo spec only
  when the prompt actually mentions Kaspa.
- `reply_text` stays empty or ONE short line; never restate the image in words.
- Prompt hard rules (from `library.json`, enforce while filling slots): **no prices/dates/chart
  numbers**, in-image text = one headline + a few 2-4 word labels, no em dashes, TAO not tau.
- The image is generated AFTER Mike queues the entry (see §4) — the dashboard shows the style
  exemplar as a preview, so the prompt must stand on its own.

> ⛔ **GIF reactions:** NEVER put `"[GIF: standing ovation]"` in `reply_text` (it posts that literal string; happened 2026-05-25 → 2 broken replies). For a GIF reaction set `reaction_only: true` + `gif_search: "<query>"` and leave `reply_text` empty. **GIF, emoji, and text all share ONE queue (`data/replies_to_post.json`) and ONE poster (`post_replies.py`)** — `post_replies.py` detects the `gif_search` field and posts the GIF via X's native picker (using the helper in `post_gif_reply.py`). There is no separate GIF queue or GIF runner. Always dry-run first (`post_replies.py --dry-run` attaches + screenshots GIFs to `tmp-gif-debug/` without posting). `auto_reply_post.py` similarly handles GIF entries in `auto_reply_pending.json` natively.

### 3. User reviews and picks
Present a numbered summary. User picks which replies to queue via the **Reply Opp tab** in the dashboard (http://localhost:8766) — clicking "Queue" on a card moves it to `data/replies_to_post.json` automatically. Or write picks directly to `data/replies_to_post.json`.

### 4. Post

**If the queue contains image replies, generate their images first:**
```
node generate_reply_images.js            # ChatGPT-generates each queued image reply (ref = style exemplar), fills image_path
node generate_reply_images.js --dry-run  # preview what would generate
```
Then **QA every file in `data/reply-images/` — read every word in the image** (AI text garbles;
a misspelled image is worse than none). Entries whose image_path is still empty are skipped by
the poster and stay in the queue.

**Mike reviews the real images before posting.** Once image_path is recorded, the dashboard's
X Replies tab shows the actual generated image on each queued card (an "awaiting generation"
chip until then). Generation and posting are separate steps: after generating, give Mike the
chance to review the images in the dashboard — never chain straight into `post_replies.py`
unless he has already told you to generate AND post in one go. Generation uses the shared chatgpt-profile Chrome — only one
ChatGPT automation at a time, and never while another session is generating images.

```
python post_replies.py              # posts all queued replies (text + emoji + GIF + image)
python post_replies.py --limit 5    # posts only the first 5, leaves the rest queued
python post_replies.py --dry-run    # attaches + screenshots GIFs/images (tmp-gif-debug/, tmp-image-debug/), never posts
```

`post_replies.py` will:
- Post each reply with human typing delays
- **Remove each entry from `replies_to_post.json` immediately after processing** — whether posted, failed, or already_posted. The queue count in the dashboard always reflects what's truly remaining.
- Archive every outcome to `posted_replies.json` (`posted` / `already_posted` / `failed`). `posted_replies.json` is the permanent archive.
- Remove posted entries from `reply_opportunities.json` in real time.

Use `--limit N` to post a subset of a large queue across multiple sessions. All replies stay in `replies_to_post.json` — no manual holdback files needed.

---

## HARD RULE — never auto-retry a failed reply

**If `post_replies.py` marks a reply `failed`, it is NOT automatically requeued. The entry is removed from the queue immediately and archived to `posted_replies.json`.**

**Why:** the X verify step (loading the tweet page and substring-matching the reply text) returns false-negatives under throttle. A reply marked `failed` has very often actually posted — X is just hiding it from the verify step's view. Treating "failed" as "didn't post" and retrying creates duplicate replies that have to be manually deleted from X.

**Established 2026-05-22 after we double-posted to @TurboToadToken and posted to three other "failed" accounts (@blknoiz06, @natbrunell, @CryptoKaleo) whose replies were already live before retry.**

**How to apply:**
- The script archives every outcome to `posted_replies.json` — review the `result` field there to see what failed.
- For each `failed` entry, **manually open the tweet on X** and check whether the reply already exists.
  - If yes → leave it alone (the post succeeded; only the verify step lied).
  - If no → re-add to `replies_to_post.json` manually with informed judgment. Common genuine-fail causes: reply-restricted tweet ("Only some accounts can reply" / "Only subscribers can reply"), tweet got deleted, network glitch.
- **Never run `post_replies.py` to "retry the queue"** unless you've manually re-curated the entries first.

Two failure patterns that are *always* false-negatives and should never be retried even after manual check:
- `Clicked Post → Reply NOT found on tweet page` — post fired, verify couldn't see it under shadow-filter.
- `Reply textarea not found` — script never opened the composer. **Almost always means the tweet is reply-restricted.** Verify on X; if you see "Only some accounts can reply" or "Only subscribers can reply," consider removing the author from the Reply Guy list since they'll never be reply-able.

**Image replies verify via X's "Your post was sent" toast OR composer-closed** (`post_image_reply.py`
polls both for 12s). Text-fingerprint verification doesn't exist for image replies — there's no
reply text to substring-match on the tweet page, which is why the first image batch (2026-07-07)
came back `uncertain_image` despite both replies posting fine. With the toast signal added,
`uncertain_image` should now be rare; when it does appear it still almost always means it
posted — check the tweet manually, NEVER blind-retry (duplicate risk). An image reply that was never generated (`image_prompt` set,
`image_path` empty) is **not** an attempt: the poster leaves it in the queue untouched and
reports it, so run `node generate_reply_images.js` and post again.

**GIF replies from `post_gif_reply.py` consistently return `uncertain` (`Composer still open after Post — uncertain`).** This is the normal behavior — X does not close the GIF composer immediately after posting, so the composer-closure verify always fails. The queue is cleared regardless. Treat every `uncertain` GIF reply as likely posted. Verify manually on the target tweet if concerned. Do NOT re-run `post_gif_reply.py` without first checking the tweet — duplicates will happen. **Established 2026-05-26 across @SpaceX, @CryptoHayes, and @blknoiz06 (3/3 GIF replies marked `uncertain`, all were live on X).**

---

## File reference

| File | Purpose |
|------|---------|
| `data/feed.json` | Latest scraped posts from Reply Guy list |
| `data/following_feed.json` | Scraped posts from Mike's following feed |
| `data/foryou_feed.json` | Scraped posts from the For You feed |
| `data/reply_opportunities.json` | **Not-yet-reviewed** reply opportunities — what the dashboard's Reply Opp tab shows. Entries are removed as they are posted or queued via dashboard. Overwritten fresh each session. |
| `data/replies_to_post.json` | The **single** active queue of **approved/pending** replies — text, emoji, AND GIF (GIF entries carry a `gif_search` field). `post_replies.py` posts all three types. Entries are removed one at a time as they are processed; use `--limit N` to post a subset across sessions |
| `data/posted_replies.json` | Permanent archive of all posted replies |
| `example-images/library.json` | **Canonical image-reply style index** (32 styles, when-to-use signals, prompt skeletons, exemplar files). Human overview: `image-reply-styles.md` |
| `generate_reply_images.js` | Generates images for queued image replies via `repurpose/gen-batch-freshchat.js`; writes `image_path` back into the queue |
| `post_image_reply.py` | Image-attach helper used by `post_replies.py` (not standalone) |
| `data/reply-images/` | Generated reply images (`reply-<id>-<style>.png`) |
| `../persona/persona.json` | Mike's full voice, style, and terminology rules (project-wide single source of truth — no longer in this folder's `config/`) |

---

## Rate limits
- Replies: no hard daily limit but keep natural cadence; `post_replies.py` adds 2–6 min gaps
