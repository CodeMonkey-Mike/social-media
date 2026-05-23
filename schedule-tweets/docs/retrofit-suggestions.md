# Retrofit Suggestions — Post-Publish URL Verification

**Status:** in progress — 1B (`post-thread.js`) retrofitted 2026-05-21. Remaining items below.
**Last audited:** 2026-05-21

## Background

Only `post-fb-short.js` (Part 1G) and `post-tiktok-short.js` (Part 1H) currently fetch the captured URL after posting and confirm the page actually contains a video element before writing `status: "posted"`. The other 12 scripts trust an in-flow signal (toast / redirect / dashboard refresh) — which sometimes fires even when the post silently failed or is stuck in moderation.

The risk pattern: a script marks `status: "posted"` with a `url` field, the queue worker moves on, and the URL turns out to be either a 404 (Rumble/BitChute moderation) or the previous post (IG profile grid not yet refreshed). The script never notices.

This file lists each unverified script + the specific player-DOM signal that should work for verification. Use it as a checklist when retrofitting.

---

## Reference pattern (copy from `post-fb-short.js`)

```javascript
// After capturing videoUrl and BEFORE writing status: "posted":
let verified = false;
if (videoUrl) {
  console.log(`\nVerifying live post: ${videoUrl}`);
  try {
    const resp = await page.goto(videoUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    const status = resp ? resp.status() : 0;
    console.log(`  HTTP ${status}`);
    await page.waitForTimeout(rnd(3000, 5000));  // let JS render the player

    const hasPlayer = await page.evaluate(() => {
      if (document.querySelector('video')) return 'video';
      // ↓ platform-specific selectors go here (see per-script tables below)
      const og = document.querySelector('meta[property="og:video"], meta[property="og:video:url"]');
      if (og) return 'og:video';
      return null;
    });
    console.log(`  Player signal: ${hasPlayer || 'none'}`);

    if (status >= 200 && status < 400 && hasPlayer) {
      verified = true;
      console.log('  Verified live ✓');
    }
  } catch (e) {
    console.log(`  Verification error: ${e.message}`);
  }
}

// Then gate the status update:
short.platforms[PLATFORM].status = (submitted && verified) ? 'posted' : 'failed';
if (submitted && !verified) short.platforms[PLATFORM].error = `URL captured but verification failed: ${videoUrl}`;
```

---

## Per-script retrofit table

For each script: the current weak signal, the recommended player-DOM selector to add to the `hasPlayer` check, and the known failure mode this would catch.

### 1 — `post-tweet.js` (Part 1 — X single tweet)
- **Current signal:** Click X's confirmation toast → grab URL from address bar
- **Failure mode it would catch:** Toast occasionally fires for a tweet X server-side rejected (rate-limit, automated-action flag) — URL ends up pointing at the user's profile root or a deleted tweet
- **Player selectors to add:**
  - `[data-testid="tweet"]` (the tweet article on the live page)
  - `[data-testid="tweetText"]` (verify text matches what we typed)
  - `meta[property="og:title"]` containing the first ~40 chars of `tweet.text`
- **Extra check:** read `<title>` element — X sets it to `"<author> on X: \"<first chars of tweet>\""` on a successful tweet page; on a 404 it'll be `"Page not found / X"`
- **Priority:** medium — failures here are rare but expensive (lost composition)

### 1B — `post-thread.js` (Part 1B — X thread) — ✅ **RETROFITTED 2026-05-21**
- **Current signal:** Toast → `a[href*="/status/"]` extraction → post-publish navigation to root → per-tweet text match → per-tweet `posted_url` capture
- **Failure mode it now catches:** Partial thread (first tweet posted, replies failed) — used to mark all N tweets `posted` because the root URL was always valid. Now: if any expected tweet text snippet is missing from the rendered root page, the thread is marked `failed` with `error: "Root captured but verification failed — possible partial thread: <rootUrl>"`.
- **Selectors used:**
  - `article[data-testid="tweet"]` enumerated; each provides `[data-testid="tweetText"]` (text) + `a[href*="/status/"][role="link"]` (per-tweet URL)
  - Match each `tweets[i].text.slice(0, 40)` (whitespace-normalized) against on-page texts
- **Gate:** `verified && rootUrl && httpStatus 2xx/3xx && matched === tweets.length` → `status: "posted"`
- **Priority:** **high** — done

### 1C — `post-x-poll.js` (Part 1C — X poll)
- **Current signal:** Toast click → URL from address bar
- **Failure mode:** Poll widget sometimes fails to attach even though tweet text posts; result is a plain tweet with no poll
- **Player selectors to add:**
  - `[data-testid="cardPoll"]` or `[role="group"][aria-label*="poll" i]`
  - Verify option count: `[data-testid="cardPoll"] [role="radio"]` should equal `poll.options.length`
- **Priority:** medium — partial-poll failures are visible (no poll widget on the live tweet) so users notice quickly; verification just catches it programmatically

### 1D — `post-yt-poll.js` (Part 1D — YouTube text poll)
- **Current signal:** Refetch `/posts` page → newest `/post/UgkxXXXX` URL
- **Failure mode:** YouTube's posts page can return a stale list if cached on CDN — `newUrl` ends up being yesterday's post. Or the poll posts but with no options (silent submission-state failure mode — fixed with real keystrokes but worth keeping a safety net)
- **Player selectors to add:**
  - `ytd-backstage-post-renderer` container exists
  - `ytd-poll-choice-renderer` count equals `poll.options.length`
  - Question text snippet in `#post-text yt-formatted-string` matches `poll.question_text.slice(0, 40)`
- **Priority:** **high** — the broken-options failure mode was painful enough to merit its own doc earlier; verification permanently closes the loop

### 1F — `post-ig-single.js` (Part 1F — Instagram single image)
- **Current signal:** Profile-grid `/p/` link extraction
- **Failure mode:** IG's grid doesn't refresh immediately after Share — first `/p/` link in DOM can be the previous post for up to 30s
- **Player selectors to add:**
  - On the captured `/p/<id>/` URL: `article[role="presentation"]` exists
  - `meta[property="og:image"]` contains the just-uploaded image (compare URL fragments)
  - Caption text appears in `meta[property="og:description"]` or in the post's `<h1>` / first `<span>`
- **Extra check:** waiting + retry — if first fetch returns the previous post, sleep 10s and retry once
- **Priority:** **high** — IG silently swapping URLs to a previous post is a recurring class of failure

### 1I.1 — `post-x-short.js` (Part 1I.1 — X video short)
- **Current signal:** Toast click → URL from address bar
- **Failure mode:** Same as Part 1 (post-tweet.js) but with the added risk that X drops the video attachment silently (text posts, no video)
- **Player selectors to add:**
  - `video[poster]` element on the live tweet page (X uses HTML5 `<video>` with a poster image)
  - `[data-testid="videoPlayer"]` or `[data-testid="videoComponent"]`
  - Fallback: `meta[property="og:video"]` or `meta[property="og:video:url"]`
- **Priority:** **high** — silent video drops are the most common X failure mode for shorts

### 1I.2 — `post-yt-short.js` (Part 1I.2 — YouTube Short)
- **Current signal:** Upload-complete dialog redirect (Studio URL change)
- **Failure mode:** Dialog can close because the user dismissed it manually or because Studio errored mid-publish; the redirect URL goes to Studio root, not the Short itself
- **Player selectors to add:**
  - Navigate to `https://www.youtube.com/shorts/<id>` (captured ID) and confirm `<video>` element
  - Or hit `https://www.youtube.com/watch?v=<id>` and check `ytd-watch-flexy[is-shorts-modeable]`
  - `meta[property="og:video:url"]` containing the video ID
- **Extra check:** YouTube processes videos asynchronously (transcoding can take 5+ minutes for shorts). If `<video>` not yet present, accept `meta[itemprop="uploadDate"]` matching today as a soft-confirmed signal and re-verify later
- **Priority:** medium — failures are rare but processing-state ambiguity makes verification trickier here than other platforms

### 1I.3 — `post-ig-reel.js` (Part 1I.3 — Instagram Reel)
- **Current signal:** Profile-grid `/reel/` link extraction
- **Failure mode:** Same as 1F (stale grid) but with video — Reels also sometimes process for 30–60s before becoming playable
- **Player selectors to add:**
  - On `/reel/<id>/`: `video` element with `src` attribute set
  - `meta[property="og:video:secure_url"]`
  - Caption snippet in `meta[property="og:description"]`
- **Extra check:** if `<video>` exists but `src` is empty, the Reel is still processing — accept and re-verify in a follow-up pass
- **Priority:** **high** — same pain shape as IG single + add the silent video-drop failure mode

### 1I.4 — `post-rumble-short.js` (Part 1I.4 — Rumble short)
- **Current signal:** Confirmation page after publish (Rumble shows a "Your video has been submitted" page)
- **Failure mode:** Rumble queues videos for moderation; the captured `/v.../` URL can 404 for up to 10 minutes after the confirmation
- **Player selectors to add:**
  - Tolerate 404 for the first ~10 min — re-verify in a delayed pass
  - When eventually live: `video.video-js` or `[class*="VideoPlayer"]` element
  - `meta[property="og:video"]` containing the video filename
- **Strategy:** Don't gate `status: "posted"` on immediate verification here — instead write `status: "processing"` with the URL and have a separate pass (or Part 2 engagement collector) flip to `posted` once the URL goes live
- **Priority:** low — failures are visible quickly via the moderation banner; processing delays are normal Rumble behavior

### 1I.5 — `post-bitchute-short.js` (Part 1I.5 — BitChute short)
- **Current signal:** BitChute Studio dashboard refresh shows the new video
- **Failure mode:** Same as Rumble — moderation queue means the public URL 404s for hours sometimes
- **Player selectors to add:**
  - `video[id="player_html5_api"]` (BitChute uses VideoJS)
  - `meta[property="og:video"]` or `meta[name="twitter:player:stream"]`
- **Strategy:** Same as Rumble — `status: "processing"` first, separate pass flips to `posted` once live
- **Priority:** low — moderation delays expected

### 1J.1 — `upload-longform-rumble.js` (Part 1J.1 — Rumble longform)
- **Current signal:** Confirmation page
- **Failure mode:** Longform Rumble videos take **hours** to process (transcoding 1-2h video to multiple bitrates). Confirmation fires immediately but the URL is unwatchable for 30 min – 4 hours.
- **Player selectors to add:** same as 1I.4
- **Strategy:** **definitely use `status: "processing"` here** — verification at upload time will always fail. Add a separate scheduled retry pass (or run verification 4h after `posted_at`).
- **Priority:** medium — but the fix is "use a different status," not "add verification at upload time"

### 1J.2 — `upload-longform-bitchute.js` (Part 1J.2 — BitChute longform)
- **Current signal:** Studio dashboard refresh
- **Failure mode:** Same as 1J.1 — long processing window
- **Player selectors to add:** same as 1I.5
- **Strategy:** Same as 1J.1 — `status: "processing"` + delayed re-verify pass
- **Priority:** medium

---

## Suggested retrofit order

1. ~~**1B `post-thread.js`** — partial-thread silent failure is the most expensive~~ ✅ done 2026-05-21
2. **1D `post-yt-poll.js`** — historic broken-options failure mode worth a permanent safety net
3. **1I.3 `post-ig-reel.js`** — IG stale-grid + video-drop failures
4. **1F `post-ig-single.js`** — same stale-grid issue as 1I.3 but text/image only
5. **1I.1 `post-x-short.js`** — silent video-drop is common on X
6. **1 `post-tweet.js`** — rare but cheap to add
7. **1C `post-x-poll.js`** — covered by users-notice-quickly so lower priority
8. **1I.2 `post-yt-short.js`** — processing-state ambiguity makes verification tricky
9. **1I.4 + 1I.5 (Rumble/BitChute short)** — better solution is `status: "processing"` flow, not synchronous verification
10. **1J.1 + 1J.2 (longform)** — needs processing-status pattern; not a simple retrofit

---

## Cross-cutting changes (do these once, benefit all 12 scripts)

1. **Extract `verifyLivePost(page, url, signals)` into a shared helper** — currently the FB/TikTok verification is inlined in each script. Move to `scripts/_lib/verify.js` (or similar) so retrofitting becomes a 4-line diff per script.

2. **Add `processing` to the status enum** — for Rumble/BitChute (short + longform), the right state machine is: `pending → posting → processing (URL captured but not yet verifiable) → posted (URL verified live)`. This requires updating the `$schema_doc` in `shorts.json` and the queue-counter skill (`pending-social-posts-SKILL.md`).

3. **Add a delayed re-verification pass** — `scripts/verify-processing-posts.js` that picks up rows where `status === "processing"` and `posted_at` is more than 30 minutes (configurable per platform) old, runs the verification, and flips to `posted` / `failed` accordingly.

4. **Standardize the verification block API** — every script should have:
   ```javascript
   const verified = await verifyLivePost(page, capturedUrl, ['video', 'og:video', '<platform-specific>']);
   ```
   Returns `true` / `false` / `'processing'` (for sites where 404 is expected for a window).

---

## Notes on selectors

- **All platforms** — start the `hasPlayer` check with the generic `<video>` selector. It works for X, IG, Rumble, BitChute. Add platform-specific selectors as fallbacks only when the generic check misses.
- **Don't trust `og:video` alone** — some platforms set the meta tag during the upload pre-roll, before the video is actually playable. The `<video>` element appears only when playback is ready.
- **YouTube** — never expect `<video>` on the watch page within seconds of upload. YouTube transcodes and the player iframe loads lazily. Use the YouTube Studio dashboard's "Video processed" indicator instead, or a delayed re-verification.

---

## When NOT to verify

For some platforms, the verification cost outweighs the benefit:
- **X poll widget** — easy to spot visually when it fails (no poll on the tweet). Manual spot-check is fine.
- **Longform videos** — verification at upload time is impossible (processing). Use `processing` state instead.

For everything else: retrofit.
