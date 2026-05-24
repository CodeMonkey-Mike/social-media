---
name: fb-post-vertical
description: Post the next pending Facebook vertical video (Reel) from data/shorts.json via Playwright script.
---

## Invocation

```powershell
cd C:\Users\mnede\Documents\Claude\social-media\schedule-tweets
node scripts/post-fb-short.js
```

Picks up the first short where `platforms.facebook.status === "pending"`, posts it as a Facebook Reel, and writes `platforms.facebook.status: "posted"`, `posted_at`, and `url` back to `data/shorts.json`.

## Queue file

`C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\data\shorts.json` → `platforms.facebook`

## Chrome profile

Uses `fbbot-profile`. **Chrome must be fully closed before running** — Playwright's `launchPersistentContext` fails if Chrome is already open with this profile.

## Timing constants

| Constant | Default | Purpose |
|---|---|---|
| `PRE_COMPOSE_MIN/MAX` | 60–180s | Wait before opening composer |
| `PRE_POST_MIN/MAX` | 60–180s | Wait before entering wizard loop |
| `ACTION_MIN/MAX` | 4–7s | Pause between UI actions and between Next clicks |
| `CHAR_DELAY_MIN/MAX` | 60–150ms | Per-keystroke delay for caption typing |
| `VIDEOS_TAB_WAIT_MIN/MAX` | 5–9s | Settle delay before scraping URL from /videos tab |

## What the script does

1. Reads queue, finds first `pending` Facebook short, marks `posting`
2. Strips hashtags from caption (`/#\w+/g`) — FB tag autocomplete breaks the wizard
3. Launches Chrome with `fbbot-profile`
4. Navigates to `https://www.facebook.com/realCodeMonkeyMike/`, checks login form, clicks "Switch Now" if personal/Page-context prompt appears
5. **Pre-composer wait: 60–180s**
6. Clicks "What's on your mind?" placeholder to open Create post dialog
7. Clicks **Photo/video** button to reveal hidden file inputs
8. `setInputFiles()` on `input[type="file"][accept*="video"]` to attach the .mp4
9. Polls `document.body.innerText` for `"100%"` (upload progress, up to 10 min)
10. Polls for `"checking for copyrighted"` to disappear (copyright scan)
11. Types caption char-by-char at 60–150ms into `div[contenteditable="true"][role="textbox"]`
12. **Pre-post wait: 60–180s**
13. Wizard loop (up to 12 steps): snapshots state, clicks visible Next or Post/Share/Done
14. Dismisses post-publish upsell ("Not now" / "No thanks" / "Maybe later" / "Skip")
15. Polls for upload-in-progress text to clear
16. Navigates to `/realCodeMonkeyMike/videos`, waits 5–9s, scrapes most recent `/reel/` or `/videos/` URL
17. **Post-publish verification:** navigates to URL, confirms HTTP 2xx/3xx + `<video>` OR `og:video` OR player container. Only marks `posted` if spinner cleared AND URL verifies.

## Key implementation details

**Two file inputs after clicking Photo/video.** FB renders one `input[type="file"]` with `accept="image/*..."` (photos only — attaching video here triggers "can't read files") and a second with `accept="image/*,...,video/*,video/mp4,..."`. Always use `input[type="file"][accept*="video"]`.

**Hashtags break the wizard.** `#tag` in the caption opens FB's tag-autocomplete menu, overlaying the dialog and intercepting every subsequent click. Strip with `caption.replace(/#[\w]+/g, '')` before typing.

**The two-button aria trap (Next).** Facebook stacks all wizard panels inside ONE `[role="dialog"]`. By step 4, six `[aria-label="Next"]` buttons exist in the DOM (negative x coords for past panels, positive for active). Solution: enumerate matches scoped to the topmost dialog, filter to **viewport-visible** elements (`r.x + r.width > 0 && r.x < window.innerWidth && r.y + r.height > 0 && r.y < window.innerHeight`), then pick the one with the largest `getBoundingClientRect()` area among on-screen matches. Area-alone ranking is wrong — the wide off-screen Next from the first panel outranks the active narrower Next on raw area.

**Login check uses form presence, not footer text.** Facebook's footer contains a "Log In" link even when logged in. Check for `input[name="email"], input[name="pass"]` — only present on real login pages.

**Current wizard flow (as of 2026-05-21):** 3 Next clicks before Post appears:
1. Create post with caption → Next
2. Reel preview/trim/captions/optimization → Next
3. Reel settings → **Post** button

**Post-publish upsell appears as a new dialog.** After clicking Post, a "Add WhatsApp button / Not now" dialog appears. Dismiss by clicking "Not now". Other variants: "No thanks", "Maybe later", "Skip".

**Verification is mandatory.** A submitted upload silently dropped by Facebook still clears the "Posting" spinner. Always verify the URL serves a `<video>` element before marking `posted`.

## Debug artifacts

Each wizard step saves to `tmp-fb-debug/stepN_state.{json,png}`. On failure: `tmp-fb-debug/FAILED_final_state.{json,png}`. Inspect when Facebook's UI updates change wizard behavior.

## Resetting a stuck short

```
node -e "
const fs=require('fs');
const d=JSON.parse(fs.readFileSync('data/shorts.json','utf8'));
const s=d.shorts.find(x=>x.platforms.facebook?.status==='posting'||x.platforms.facebook?.status==='failed');
if(s){s.platforms.facebook.status='pending';delete s.platforms.facebook.error;fs.writeFileSync('data/shorts.json',JSON.stringify(d,null,2));console.log('Reset:',s.id);}
"
```
