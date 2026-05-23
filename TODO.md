# Resume Notes — 2026-05-22 → next session

Hand this file to the next Claude session. Everything that was open at shutdown lives here.

## TL;DR

A long posting + image-regen session ended with a background image-regen task still running when the computer was shut down. The posting list is fully complete (24/24, including TikTok which was retried). Image regeneration is **2/15** complete on the remaining carousels; **13 slides still need to be regenerated**.

## Background context

Earlier in the session, an unsafe disk-cleanup script deleted 205 images. Many of those images were referenced by *pending* YT posts and IG carousels (their `images[]` arrays — the script only checked top-level `image_path`). The cleanup was committed to git but image deletions don't show in git status since they were gitignored at the time. The `.gitignore` has since been rewritten to track all images so this can't happen again.

We've been regenerating those deleted images using `repurpose/generate-image.js` against the dedicated `chatgpt-profile`.

## What's already done

- ✅ Git repo initialized at `C:\Users\mnede\Documents\Claude\social-media`. Branch: `master`.
- ✅ `.gitignore` updated so all images under `schedule-tweets/images/` are tracked (committed).
- ✅ Dedicated `chatgpt-profile` created (logged into ChatGPT). All 9 `repurpose/*.js` scripts updated to use it instead of `xbot-profile`.
- ✅ Posting list completed (24/24 — see commit `43a047b` for the full URLs).
- ✅ 30 carousel/X-tweet images regenerated across this session — committed.
- ✅ SKILL.md updated with all operational lessons from the session.

## What's pending — image regeneration

13 carousel slides remain unregenerated. The PowerShell driver script that handles them is at:

```
C:\Users\mnede\Documents\Claude\social-media\repurpose\regen-remaining-carousels.ps1
```

It contains the full prompts and reference-image paths for all 15 slides. **2 slides already finished (4f83d205, 9b639801) — they're on disk and don't need to re-run, but it's safe to re-run them; `generate-image.js` will overwrite.** The script will simply waste time re-doing them.

### Remaining slides (13)

**YT post: hard-fork-23-days-pricing-in (3 of 5 remaining)**
- `2e48acb6-03-priced-in-everyone-knows` — was running at shutdown, likely incomplete
- `45a965bc-04-real-pump-after-crowd`
- `ec8141d7-05-engagement-question`

**YT post: institutions-infrastructure-kaspa-checklist (5 of 5 remaining)**
- `21eb4251-01-hook-no-memes`
- `1b7d1287-02-box-1-security`
- `7a7b7b9a-03-box-2-instant-settlement`
- `b1c1a8db-04-box-3-4-decentralized-stress`
- `01b045a8-05-engagement-question`

**YT post: ai-tug-of-war-tipping-kaspa-retail (5 of 5 remaining; shared with IG carousel of same name)**
- `3b47b002-01-hook-not-the-fed`
- `34c57330-02-its-wages-ai-eating-jobs`
- `3fbe9e4d-03-adp-up-tug-tipping`
- `3f6c059c-04-retail-flows-back-crypto`
- `ed5b9124-05-engagement-question`

### How to resume

1. Open Chrome briefly with `chatgpt-profile` to confirm you're still logged into ChatGPT (sometimes ChatGPT logs you out after long gaps). Then **close it** before running the script (Playwright can't share the profile with a running Chrome).
   ```powershell
   Start-Process -FilePath 'C:\Program Files\Google\Chrome\Application\chrome.exe' -ArgumentList '--user-data-dir=C:\Users\mnede\AppData\Local\Google\Chrome\chatgpt-profile','https://chatgpt.com/'
   # Verify login, then:
   Get-Process chrome -ErrorAction SilentlyContinue | Stop-Process -Force
   ```

2. Optionally edit `regen-remaining-carousels.ps1` to remove the 2 already-completed entries (`4f83d205`, `9b639801`) so the script doesn't waste time re-doing them.

3. Run the script (it runs sequentially with 15-45s pre-launch delay per image — total ~50-65 min for the remaining 13):
   ```powershell
   cd C:\Users\mnede\Documents\Claude\social-media\repurpose
   powershell.exe -ExecutionPolicy Bypass -File regen-remaining-carousels.ps1
   ```

4. After all are done, commit:
   ```powershell
   cd C:\Users\mnede\Documents\Claude\social-media
   git add schedule-tweets/images/yt/
   git commit -m "Regenerate remaining 13 carousel slides"
   ```

## Other things to be aware of

- **Posting in parallel with image gen now works.** The `chatgpt-profile` isolation means image gen no longer blocks X tweets/polls/threads/shorts/reply-guy. If the user fires off a posting list, image regen can run alongside.
- **Skipped/posted records.** The 4 fully-regenerated YT posts of the session (bottom-behind-us, pmi-expansion, minnesota-custody, influencer-integrity) are ready to be posted whenever the user wants. They are still `status: "pending"` in `data/yt-posts.json` and `data/ig-carousel.json`.
- **ChatGPT rate limit.** Plus tier is ~40-50 images per 3 hours. With the built-in 15-45s pre-launch delay, the 13 remaining slides should fit comfortably in one window.
- **TikTok quirk.** If the user posts TikTok later, they'll need to manually launch Chrome with `chatgpt-profile` ... wait no, TikTok uses `User Data` (main profile), not `chatgpt-profile`. See SKILL.md "Profile conflicts that matter when posting in parallel" — TikTok requires a manual `Start-Process` to set up CDP port 9224 first.
- **Reply-guy `--limit` not honored.** `python post_replies.py --limit 5` actually drains whatever's in the queue (observed: posted 7 with `--limit 5`).

## Where to find things

- Posting scripts: `schedule-tweets/scripts/post-*.js`
- Image-gen script: `repurpose/generate-image.js`
- Skill docs: `repurpose/SKILL.md` (recently updated with operational notes section)
- Reply-guy: `x-reply-guy/post_replies.py`
- This session's batch driver: `repurpose/regen-remaining-carousels.ps1`
- Memory (cross-session): `C:\Users\mnede\.claude\projects\C--Users-mnede\memory\`
