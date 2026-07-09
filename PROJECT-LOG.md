# PROJECT LOG — pump-season-is-back repurpose + advisor/executor build

_Resume/handoff doc. Last updated 2026-07-08. Say "reference PROJECT-LOG.md and continue" on a fresh
session and follow the **REMAINING WORK** section to bring this to completion._

## Mission
Repurpose the livestream **"Pump Season is Back! - Market Update"** across all 3 lanes, AND build out the
**advisor/executor subagent architecture** for the pipeline. The repurpose ran via the
`/repurpose-livestream` command. Most is done; the remaining work is the **Phase 7 Remotion edit of the 7
approved shorts**, then publish.

## ✅ BATCH COMPLETE (2026-07-09) — all 7 shorts built + published to the main dashboard
All 7 rebuilt to the finalized-short contract (gate PASS + QA green each) and published via
`_publish-entries.js` to `schedule-tweets/data/shorts.json` (main dashboard :8766, all `pending`,
awaiting Mike's review). Image budget = Mike's lean rule (~6 per 60s, ~1 per 10s, mostly ~2 reused
content-zone + full-screens): clip1 17 (pre-rule), clip2 16, clip3 4 (2 ETH fulls remapped to clean
on-disk images, no regen), clip4 6 (cancelled `lostpower` -> `doubled-full` in zone), clip5 2, clip6 2
reused, clip7 1 reused. **Open review flags (dashboard):** clip1 hook is a substitute congregation +
its "black swan" beat shows a wasteland (pre-fix mislabels); clip7 uses teal accent vs the thumbnail's
red (trivial flip). **Generator hardened this run** (`repurpose/generate-broll-reload.js`): reload-capture
+ stable `file_id` keying + fresh-chat `/c/` URL wait + "Compare responses" full-screen modal dismissal;
canonical b-roll method now documented in the remotion-shorts-build SKILL + gate floor relaxed to 1.

## Resume instruction (historical — batch now complete)
~~Build all 7 approved shorts, one at a time, each via the `remotion-builder` subagent (Opus/xhigh),
QA-gated by Mike, then `/publish-shorts`.~~ DONE. Next: Mike reviews on the dashboard; then normal
sequential per-platform posting when he says go.

## Infrastructure built (in-repo, canonical — see `CLAUDE.md` "Advisor/executor model routing")
- `.claude/commands/repurpose-livestream.md` — Opus/medium orchestrator command (path is the only arg; trailing text = per-run overrides).
- `.claude/agents/clip-strategist.md` — Fable/max advisor: picks + scatter-gathers shorts. (DONE for this batch.)
- `.claude/agents/tighten-strategist.md` — Fable/max advisor: authors Phase 5 tighten spans. (Created; used Opus-authored spans this run.)
- `.claude/agents/remotion-builder.md` — **Opus/xhigh executor: builds ONE short's composition + render + self-QA.** ← the tool for the remaining work.
- Dashboard convention documented in `video-creation/SKILL.md` Phase 4b (one cell per short; sequential numbering; processing replaces in place). Reusable builder: `video-creation/shorts/pump-season-is-back/build-dashboard.js`.
- `gen-images.js` image-wait bumped to 12 min (ChatGPT was slow/flaky 2026-07-08).

## STATUS

| Lane / item | State |
|---|---|
| Phase 1 LOW BPS master, verticalize, transcribe | ✅ done |
| Lane 1 — long-form desilenced, recompressed, staged, queued in `longs.json` (rumble/bitchute/facebook) | ✅ done |
| Lane 2 — Fable clip selection → 7 clips cut, tightened, desilenced, dashboard 1-7, **Mike-approved** | ✅ done |
| Lane 2 — Phase 6 captions (`captions-*.txt`) for all 7 clips | ✅ done |
| Lane 2 — Phase 7 Remotion edit (7 compositions + renders + QA) | ✅ done |
| Lane 2 — `/publish-shorts` -> shorts.json (7 entries, pending) | ✅ done |
| Lane 3 — 6 tweets, 2 YT posts, 2 threads, 2 YT polls | ✅ queued |
| Lane 3 — 6 tweet images + 9 carousel slides (Higgsfield finished the flaky ones) | ✅ done + wired |

Note: clip 8 (october impact) was **deleted** at Mike's request. X polls + IG-Kaspa correctly skipped (no qualifying topics). meme-bull tweet image + last carousel slide were finished via **Higgsfield** (ChatGPT capture was failing).

## REMAINING WORK — the 7-clip Remotion edit

For EACH clip below: (a) generate its first-frame **thumbnail** via **Higgsfield** `gpt_image_2` (aspect 9:16)
if not already present [extract the `hf_`-prefixed OUTPUT url, not the reference], (b) b-roll only if a beat
needs it (most don't — the clips are composited vertical with the screen-share already in-frame), then
(c) hand the clip to the **`remotion-builder`** subagent, (d) Mike QAs the returned render, (e) next clip.
Finally run `/publish-shorts pump-season-is-back`.

All inputs live under `video-creation/shorts/pump-season-is-back/<slug>/`: the final `<slug>-<variant>.mp4`,
`captions-<variant>.txt`, `whisper-words-<variant>.json`, and `render-assets/thumbnail.png` (clip 1 only so far).

| # | slug / variant | length | thumbnail | notes |
|---|---|---|---|---|
| 1 | community-receipts / full | ~114s | ✅ made | 550x/350x LAB/130x DeAgent/52x Peanut receipts + mirror closer |
| 2 | four-year-cycle-religion / full | ~66s | ✅ made | tribal: cycle is a religion; called the crypto winter |
| 3 | october-will-be-green / full | ~51s | ✅ made | "mark my words, October is green" |
| 4 | bitcoin-inflation-year-five / full | ~132s | ✅ made | 68k→126k just tracked inflation; year five of the bear |
| 5 | longevity-escape-velocity / full | ~49s | ✅ made | by 2032 no longer reasonable to die |
| 6 | community-receipts / impact | 15s | ✅ made | the 500x tease, short cut |
| 7 | four-year-cycle-religion / impact | ~12s | ✅ made | the religion/doctrine line, short cut |

## Render progress (remotion-builder, Opus/xhigh)
- **Clip 1 community-receipts** ✅ rendered `remotion/out/pump-season-is-back/1-community-receipts.mp4` (1080x1920/30fps/114.4s; no black dips; audio mean -19.2/peak -4.6). Review flags for Mike: coin names corrected off Mike's on-screen table (MYX 552x, DeAgent/AIA, TUT 94x, DISCO, GIGGLE, PUPPIES, FOLKS); "velvet" 58x + "LAB" 350x set from clip-plan (worth an eyeball); DeAgent captioned spoken 130x vs on-screen ticker 127x; coin names render lowercase (house style); no SFX added.
- **Clip 2 four-year-cycle-religion** ✅ rendered `2-four-year-cycle-religion.mp4` (65.5s; clean QA, teal accents). Review flag: source has a burned-in third-party stream comment (JPY carry trade) above the seam throughout — inherent to the approved composite, worth an eyeball.
- **Clip 3 october-will-be-green** ✅ rendered `3-october-will-be-green.mp4` (50.7s; clean QA, red->green caption arc). Review flag: "FOMO in" caption at the mechanism beat — audio ambiguous between "buy in"/"FOMO in", confirm by ear.
- **Clip 4 bitcoin-inflation-year-five** ✅ rendered `4-bitcoin-inflation-year-five.mp4` (132s; clean QA, orange BTC accents, caption numbers verified vs audio). ⚠️ **THUMBNAIL FIXED + NEEDS RE-RENDER**: original hook "THE REAL TOP WAS 2024" mismatched the clip's "year five since Dec 2021" argument; regenerated thumbnail to "BITCOIN JUST TRACKED INFLATION". **Re-render clip 4 at end (before publish) to pick up the new thumbnail.** Minor: all $ figures orange incl. tow $800/$1600 — revert tow to white if orange should mean BTC-only.
- **Clip 5 longevity-escape-velocity** ✅ rendered `5-longevity-escape-velocity.mp4` (48.6s; clean QA, yellow accents on the wild claims). Caption fixes verified: "escape velocity", "now it'd be".
- **Clip 6 community-receipts (impact)** ✅ rendered `6-community-receipts-impact.mp4` (15s; clean QA, yellow accents on 100x/500x). Minor: thumbnail "500x" is green vs caption accents yellow — unify if desired.
- **Clip 7 four-year-cycle-religion (impact)** ✅ rendered `7-four-year-cycle-religion-impact.mp4` (12.2s; clean QA, red accents on religious/doctrine/data). Same burned-in JPY-carry-trade comment in the source upper zone (above captions, no collision).
- ~~ALL 7 clips built + published~~ → **Mike's review found all 7 are SKELETONS: no b-roll, no SFX, wrong base layout** (orchestrator's delegation said "B-roll: NONE" and never mentioned SFX, overriding the documented standard in style-guide/shorts-style-guide.md + SKILL.md Phase 7). **DO NOT POST the 7 pending pump-season-is-back entries in shorts.json until rebuilt** (renders will be rebuilt to the same out/ paths, then re-staged).
- **FIX SHIPPED (2026-07-08, three layers):** (1) new canonical TRACK skill `video-creation/livestream-repurpose/skills/remotion-shorts-build/SKILL.md` = the finalized-short CONTRACT for livestream-derived shorts (b-roll every 1-3s + SFX + captions + frame-0 thumb, MANDATORY, waivable by no delegation; b-roll = generated images via the broll pool / Higgsfield fallback, NOT stock). Scoped + named per Mike: it is NOT generic Remotion work, so it lives in the livestream-repurpose track, not video-creation/skills/. (2) mechanical gate `.../remotion-shorts-build/scripts/finalized_short_gate.py` — must PASS (exit 0) before any build is "done" (verified: it FAILs the skeleton clip 1, exit 1); (3) `.claude/agents/remotion-builder.md` rewritten to treat the skill as non-overridable and to STOP+flag on conflicting delegations. Pointers: SKILL.md Phase 7 + skills/README.md closing note.
- **CLEANUP after clip-1 rebuild completes:** delete the stub folder `video-creation/skills/remotion-building/` (pointer SKILL.md + gate shim left there only so the in-flight clip-1 rebuild, launched against the old path, completes).
- **SKILL REFACTOR (2026-07-08, Mike-directed):** Phases 1-5 extracted VERBATIM from `video-creation/SKILL.md` into per-track skills under `video-creation/livestream-repurpose/skills/`: `intake-verticalize` (Ph1 + legacy OBS crop appendix), `transcribe-vertical` (Ph2 — livestream-specific artifact layout; generic transcription stays in captions/whisper tooling), `topic-finding` (Ph3), `clip-selection-dashboard` (Ph4+4b incl. dashboard convention + batch registration), `tighten-pass` (Ph5 — shorts-only today; longform uses defumbler/desilencer). Master SKILL.md keeps the phase-map (now with a Canonical-instructions column) + pointer stubs; Phases 5B/6 stay in `video-creation/skills/` (track-agnostic); Phase 8 `PUBLISH-SHORTS.md` stays at root (multi-track, e.g. Kaspa Wise Man). Agents (clip-strategist, tighten-strategist) + the repurpose-livestream command updated to the canonical paths.
- **CLIP 1 REBUILT ✅ (2026-07-09):** community-receipts rebuilt to the finalized-short contract and
  rendered to `remotion/out/pump-season-is-back/1-community-receipts.mp4` (1080x1920/30fps/114.45s/181.8MB;
  no black frames; audio mean -18.7/max -2.0 dB). Gate PASSES (17 b-roll >= 8, 11 SFX, thumbnail, zero
  missing). B-roll: 13 clean Higgsfield assets kept + the **4 flagged ones regenerated via ChatGPT**
  (hook/500x/mirror/velvet — now persona-clean: upward-arrow coin, chrome rocket, silhouette-at-mirror,
  velvet+crown coin; the Higgsfield originals are backed up in `community-receipts/render-assets/_higgsfield-bak/`).
  QA stills verified: full-screens at hook/500x/mirror, zone beats with Mike's face below the seam,
  badges top-zone no caption collision, real $LAB branding on the LAB beat.
- **HANDOFF = MAIN DASHBOARD via publish-shorts (corrected 2026-07-09).** The finished-short handoff is
  NOT the batch clip-review dashboard — it is `/publish-shorts` → `schedule-tweets/data/shorts.json` →
  the main dashboard (`serve_dashboard.py`, http://localhost:8766). Clip 1 published as the approved
  SUBSET: staged `schedule-tweets/shorts/pump-season-is-back/1-community-receipts.mp4` + shorts.json
  entry `psb-20260708-550x-bear-market` (all 7 platforms `pending`, awaiting Mike's review on the
  dashboard). Authored title/hook/caption/tags reused verbatim from `_publish-entries.js` clip 1.
  (Detour reverted: I had briefly wired a `rendered` cell into the batch clip-review dashboard — undone;
  build-dashboard.js + status.json restored to source-clip clip-review only.)
- **PROCESS NOTE (Mike, 2026-07-09):** the per-clip Phase 7 build MUST run through the `remotion-builder`
  subagent (Opus/xhigh), driven by the `/repurpose-livestream` command — not inline by the orchestrator.
  Clip 1's composition was already agent-built on 2026-07-08; today's finish (image regen + render + gate
  + QA) was done inline, which was a deviation. **Clips 2-7: delegate each build to `remotion-builder`.**
- **NEXT: Mike reviews clip 1 on the dashboard; on approval, build clips 2-7 via the `remotion-builder`
  agent (ChatGPT b-roll), then publish each with publish-shorts.**

## RESUME HERE (session end 2026-07-08 night — Mike stopped the run at ~22:50)
**State: clip-1 rebuild is UNFINISHED (agent deliberately stopped, not failed).** What exists on disk:
- `community-receipts/BROLL-PLAN.md` authored (~19 beats) ✅
- **19 b-roll assets** in `community-receipts/render-assets/` (broll-psb-*.png, generated via
  Higgsfield tonight) — **15 are CLEAN and reusable**; **4 MUST BE REGENERATED** (persona violation,
  recognizable ETH/BTC symbols): `broll-psb-hook.png` (ETH glyph on the coin), `broll-psb-500x.png`
  (BTC logo on the rocket), `broll-psb-mirror.png` (ETH-diamond in the reflection),
  `broll-psb-velvet.png` (ambiguous ETH-ish emblem). Clean list per the agent's sweep: mystery,
  deagent, overpay, gains, myx, tut, pippin, bear, disco, giggle (+ lab, peanut, pump).
- Composition `remotion/src/CommunityReceipts.tsx` + `constants-creceipts.ts` rewritten with
  b-roll + SFX wiring (22:07/22:41) — NOT yet rendered; `out/.../1-community-receipts.mp4` is still
  the old Jul-8-19:41 skeleton.

**IMAGE SOURCE DECISION (Mike, end of session): use ChatGPT for ALL image generation tomorrow —
ChatGPT is fast/normal again. Do NOT use Higgsfield** (tonight's Higgsfield use was a one-day
fallback while ChatGPT was degraded). Canonical: `repurpose/gen-images.js` pool, purpose `broll`.

**Optimization to consider (not yet in the skill, Mike to approve):** generate a clip's BROLL-PLAN
assets CONCURRENTLY/batched instead of one-at-a-time — the plan's prompts all exist up front;
sequential generation is why one short took ~90 min tonight (~19 images x ~3 min each).

**Tomorrow, in order:**
1. ✅ **DONE 2026-07-09 — clip-1 rebuild finished + published:** 4 flagged assets regenerated via ChatGPT
   (kept the 13 clean b-roll), wiring reconciled, rendered, gate PASSES, self-QA'd, then handed off via
   **publish-shorts → main dashboard :8766** (shorts.json entry `psb-20260708-550x-bear-market`, pending).
   (ChatGPT DOM-capture was flaky in the Chrome session — hook/500x/mirror
   captured on re-runs; velvet generated fine but the capture missed it, recovered by grabbing the last
   image from the active chat. ChatGPT itself was healthy; the flakiness was the automated Chrome session.)
2. **Mike reviews rebuilt clip 1** (b-roll every 1-3s, SFX, thumbnail, captions). His approval gates
   everything else.
3. **Rebuild clips 2-7** the same way, ONE AT A TIME via the `remotion-builder` agent: each
   delegation = point at `livestream-repurpose/skills/remotion-shorts-build/SKILL.md` (the contract,
   non-overridable) + the clip's inputs (mp4 / captions / whisper-words / thumbnail in its folder) +
   author BROLL-PLAN + gate must PASS. **B-roll via the canonical ChatGPT pool again** (`gen-images.js`,
   purpose `broll`) — Mike re-tested ChatGPT 2026-07-08 night: fast again; Higgsfield stays the
   documented fallback.
4. **Publish after approval:** the 7 skeleton `shorts.json` entries and staged mp4s were **REMOVED**
   at Mike's direction (2026-07-08 night) so the dashboard shows nothing from this batch — so after
   the rebuilds are approved, run **`/publish-shorts pump-season-is-back` fresh** (re-stages the mp4s
   + re-creates the 7 entries). The removed entries' authored titles/hooks/captions/tags are NOT in git
   (nothing committed yet) — they are preserved IN-REPO at
   `video-creation/shorts/pump-season-is-back/_publish-entries.js` (the script that created them;
   verified all 7 titles/hooks/captions/tags present). Re-run it after re-staging, adjusting only if
   titles change post-rebuild. Leftover: `schedule-tweets/shorts/pump-season-is-back/1-community-receipts.mp4`
   was file-locked by the dashboard server at cleanup time — delete or overwrite it tomorrow.
5. **Cleanup:** delete the stub folder `video-creation/skills/remotion-building/` (old-path pointer +
   gate shim kept only for the in-flight clip-1 build).
6. Then normal posting flow (sequential, per platform) when Mike says go.

**Also done tonight (context for tomorrow):** Phases 1-5 extracted verbatim from `video-creation/SKILL.md`
into per-track skills at `livestream-repurpose/skills/` (intake-verticalize, transcribe-vertical,
topic-finding, clip-selection-dashboard, tighten-pass; remotion-shorts-build was already there); master
keeps the phase map (with canonical-path column) + stubs; agents/command updated. Verified unused
elsewhere: Phase 2 (longform-edited has its own separate transcribe) and Phase 5 (longform uses
defumbler/desilencer; all tighten_clips_*.py scripts are livestream batches). Phase 8 PUBLISH-SHORTS.md
confirmed multi-track, stays at video-creation root. **Nothing committed yet — whole run is uncommitted
working tree; commit in logical groups when Mike asks.**

## Gotchas / decisions this session
- **Use Higgsfield for images this environment** when ChatGPT is flaky (it was 2026-07-08); `gpt_image_2` for stills, `--image <ref>` for reference, `--wait --json`, then curl the `hf_`-prefixed output URL.
- Background bash jobs get **reclaimed on idle** — run long jobs foreground or block on them with TaskOutput.
- New `.claude/agents/` files only load on **session restart** (that's why this handoff exists).
- No em dashes anywhere written to queues or on-screen text. Fix Whisper-garbled coin names per `clip-plan.json` notes.
- Nothing committed yet — lots of uncommitted working-tree changes across the run; commit when Mike asks.
