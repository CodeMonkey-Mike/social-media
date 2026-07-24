# Clarity Act ensure US Dominance — PROJECT-LOG

Decision trail + resume pointer for this longform-edited video.

## Spine-prep run (2026-07-10) — DONE, QA-tightened spine ready for review
Recorded raw: `raw/2026-07-10 14-20-05.mkv` (22.8 min, 1.04 GB, 6 Mbps). Ran the whole chain via the new
shared agents (first end-to-end exercise of the agent setup):
- **Compress (orchestrator, `to_low_bps.py`):** → `spine/clarity.lowbps.mp4` (2.1 Mbps, 369 MB).
- **defumbler agent (Opus/xhigh):** → `spine/clarity.a.defumbled.mp4`. 22.8→16.0 min, 33 cut spans, 407 s
  fumbles removed, QA clean (0 surviving partials, 0 clipped joins, 33 ms drift).
- **cover-blackout agent (Sonnet/high):** → `spine/clarity.b.blackout.mp4`. Mapped FACE/COVER vs SCREENPLAY;
  ~75% blacked / ~25% face; frame-QA passed (black where blacked, face where FACE, 33 ms drift).
- **desilencer agent (Sonnet/low) @ 0.8 s (loose QA pass):** → `spine/clarity.c.desilenced.mp4`. 960→428 s
  (**7:08**), 96 cuts, 532.9 s removed, swallowed-speech QA clean (~19 ms drift).

**Review flags:**
1. Content NOT recoverable by cutting: "This is how the dollar buys itself another 50 years" was dropped
   (stranded mid-retake); kept ending supersedes it. Manual reinsert/re-record only if wanted.
2. Kept line transcribed "paper and over their spending" (~"papering over their spending") — confirm by ear.
3. Blackout is 25% face incl. a ~105 s run (~380-485 s) — probably plug + ad-libbed subscribe CTA, but
   generous vs "sparse FACE"; review on the final blackout pass.
4. Final desilence pass: use a min-sil BELOW 0.8 and add `--map-out spine/jumpcuts-final.json` (comp anchors).

**Tooling learning:** the cover-blackout agent backgrounded its render and got reclaimed mid-write (truncated,
moov-less file); finished it inline. Patched ALL THREE shared agent defs with a hard "run renders FOREGROUND,
never background" rule so it can't recur.

## Burst removal (2026-07-10) — 2 coughs excised, verified
Mike caught two coughs in the QA spine. Used the **burst-removal skill** (inline, not the desilencer — the
desilencer keeps loud anomalies). On `clarity.c.desilenced.mp4`:
- Spot 1: cough after "...legislated **one.**" → cut 123.03-123.52 (in-silence both edges).
- Spot 2: cough after "...Coinbase **alone.**" → cut 323.99-324.49.
One sync-safe 3-segment pass → `spine/clarity.d.deburst.mp4` (427.99 → 427.00 s). VERIFIED on the output
(RMS join = silence valley, Whisper reads "one Here's" / "alone So" both words whole, no remnant).
`clarity.c.desilenced.mp4` kept as the pre-burst backup.
- **PROPAGATION FLAG:** these coughs still exist in `clarity.b.blackout.mp4` (and `a.defumbled`) at earlier
  (pre-desilence) timecodes. When the FINAL tighter desilence pass is run from `b.blackout`, the coughs
  reappear (desilence keeps them) → burst-removal must be RE-APPLIED to the final spine (re-locate via the
  same "one"/"alone" words). Simplest: run the burst cuts, then desilence, OR redo burst-removal after.

## FINAL spine (2026-07-10) — desilence + deburst, ready
Mike approved the 800 ms QA deburst, then requested the FINAL two-zone desilence.
- **Final desilence** (on `b.blackout`, the correct pre-desilence master): two zones — **250 ms** for CH1
  intro (split at 110 s, safely in the CH1→CH2 gap: CH1 ends 104.9 s, CH2 starts 122.1 s), **600 ms** for
  the rest. 110 cuts, 540.7 s removed, 960.17 → **420.19 s**. Jump-cut map → `spine/jumpcuts-final.json`
  (keep-boundaries = the comp's mid-face punch-in / transition anchors). Output: `clarity.c2.desilenced.mp4`.
- **Final deburst** (coughs reappeared post-desilence, re-located by "one"/"alone"): cut 118.68-119.17 and
  319.01-319.51 → `clarity.d2.deburst.mp4`, 420.19 → **419.22 s (6:59)**. VERIFIED on output (both joins =
  silence valleys, Whisper "one Here's" / "alone So" whole).
- **THE FINAL APPROVED-PENDING SPINE = `spine/clarity.d2.deburst.mp4` (6:59).**
- Superseded QA rehearsal files (`clarity.c.desilenced.mp4` 800 ms, `clarity.d.deburst.mp4`) can be deleted
  when convenient; kept for now.

## Remaining work = INLINE (Mike, 2026-07-10)
No more sub-agents this video — finish it with the main loop to stay focused on shipping. Revisit building
more agents (container-builder, remotion-builder, etc.) on the NEXT video.

## Pre-production GATHER + PLAN (2026-07-10) — for Mike's review before the Remotion build
Transcribed the final spine (word-level, `spine/clarity.final.*`), reconciled to the screenplay, ran blackdetect
for exact FACE/COVER spans (8 face windows). Then built the whole pre-production package:
- **Documents (full set):** DATA.md · BROLL-PLAN.md · EDIT-PLAN-prep.md · CUE-SHEET.md · TRANSITIONS.md ·
  EDIT-PLAN.md (provisional, regenerate from comp). SCREENPLAY + PROJECT-LOG already existed.
- **BUILT code visuals (proofed via headless-Chrome PNG):** D1 Bretton-Woods timeline · D2 stablecoin→Treasuries
  flow · D3 Trojan-horse contrast · D4 Coinbase-shaped-hole (assets/deck/) · C1 yields · C2 $2-3T demand ·
  C3 Coinbase $1.35B (assets/charts/) · subscribe overlay (assets/overlays/). All on-brand dark palette.
- **Captions:** CH1 intro only — generated `assets/captions-CH1.ts` (montserrat, 2-word). Comp gates to 0-43s
  (over the intro incl. its b-roll — a per-video exception since CH1 is mostly COVER).
- **Transitions chosen (soft register):** cards = slide (CH2+CH4) · face cuts = film burn · b-roll/AI = fade ·
  containers/charts = cross-fade+scale · ONE iris on R-CLARITY verdict. No aggressive glitch, no SFX.
- **Receipts:** 4 captured (popup-dismissing Playwright cap) + QA'd, in **`assets/receipts/`** (source; NOT
  render-assets — that's build-time staging, corrected 2026-07-10). All 4 clean/on-message; R-GENIUS crops to top.
  R-FORBES is the strongest (sources 3.5% APY / loyalty reward / issuer-vs-affiliate directly).
- **STILL TO GATHER (specified, need authenticated browser sessions — the next step):**
  - Envato ×10-11 (search terms in BROLL-PLAN §D) via skills/envato-broll/download-envato.js (needs Envato login).
  - ChatGPT ×3 stills (prompts in BROLL-PLAN §C) via the repurpose ChatGPT b-roll pipeline (needs live Chrome).
  - Optional C4 money-printing chart (Mike's call).
- CH6 close hard-asset still open (generic BTC+gold default).

## FULL video draft build (2026-07-10) — rendering at 200k
Comp `remotion/src/ClarityTest.tsx` (registered id `ClarityTest`), full CH1-CH6 + PLUG.
- **Chroma-key:** green-screen keyed (chromakey 0x008469 sim 0.10 + despill) → composited over a mid-tone slate
  bg (`assets/face-bg.png`; NOT too dark, for Mike's black shirt/mic). Wall/lamp/bars kept (Mike's call: "put a
  picture behind me, leave the rest"). Baked into `render-assets/spine.mp4` (paused spine, +1s freezes @ CH2 43.0
  and CH4 210.3). Minor edge softness on the draft; Mike to judge.
- **Assets staged** in render-assets/ (deck D1-D4, charts C1-C3, receipts ×4, stills CG1-CG3 + **CG4 "100X rocket"**
  generated landscape, subscribe, 11 vid 1080p proxies). Two `rmn:slide`-style title cards (CH2/CH4, hand-rolled).
- **CG4 overlay** ~2s over the "50x/100x" plug line (with a bold 100X label). Subscribe ≤1s pop. Captions CH1 over
  the intro. Face cuts = film burn. Close ENDS ON FACE (no cutaway, hard cut). C4 chart dropped. AI stills = fade
  (badsignal glitch carries an SFX → skip for no-SFX soft register).
- **Music:** 4 beds (Synthwave CH1 · Press Play looped CH2/CH3 · Common High Speeds CH4/CH5 · Theta Rest CH6),
  bed change on the CH4 card, level **−5 dB** vs the test (0.073 lin, Mike's call — educational not epic). No SFX.
- Output: `_previews/clarity-full-v1.mp4` → music-mixed `clarity-full-v1-music.mp4`.

## Resume pointer
**Next step:** Mike reviews the pre-production package (documents + built visuals + captions + receipts). On
approval: gather the Envato clips + ChatGPT stills (need his logged-in sessions), crop the receipts, then the
Remotion comp build. (Spine `spine/clarity.d2.deburst.mp4` 6:59 already approved.) Earlier note retained: If good: (a) transcribe it (Phase 2 word-timings) and reconcile to the screenplay (build to the transcript, drop beats he didn't say); (b) build Convention-4 containers (CH2 timeline, CH3 stablecoin→Treasuries flow, CH4 CBDC map, CH5 GENIUS-vs-Coinbase-hole) + b-roll + the soft music beds; (c) EDIT-PLAN + CUE-SHEET → comp → render (use `spine/jumpcuts-final.json` for mid-face punch-in/transition anchors). Still open: CH6 hard-asset naming (BTC/Kaspa/gold or generic).

## Decisions
- **2026-07-10 — created.** Adapting reference video youtu.be/rEBV24H0PSY (18:00, "New Clarity Act is Trojan Horse…") into a ≤7:00 longform-edited cut. Watched the full reference via /watch (captions).
- **2026-07-10 — angle LOCKED = SKEPTICAL** (Mike). Hard-money conviction core; CH6 pivots to owning assets outside the dollar. "US dominance" = a power grab you should see coming, not a cheer.
- **2026-07-10 — two-bill structure LOCKED** (Mike asked to include GENIUS Act). Verified via web search (White House fact sheet, Congress.gov, Arnold & Porter, Yahoo Finance):
  - **GENIUS Act** = the STABLECOIN law, signed July 18 2025. 100% reserves in cash/short Treasuries; bans ISSUER interest. The dominance machine, already law.
  - **CLARITY Act** = digital-asset MARKET-STRUCTURE bill (SEC vs CFTC). House-passed July 2025, STALLED in Senate (Banking 15-9, May 14 2026). Live fight = stablecoin-yield LOOPHOLE (platform "rewards" = interest by another name). Coinbase ~$1.35B/yr USDC rewards; ABA fighting it.
  - The reference conflates the two; this script keeps them straight = sharper + current. Title still anchors CLARITY (news hook) but names both.
- **Cut from the reference to hit 7 min:** the ~4-minute dystopian CBDC control-grid tangent (negative rates, gas rationing, boiling-the-frog, economic-calculation-problem), plus the masterclass ad reads.
- **Spine:** 6 chapters, gated face, epic register on CH1 + CH6, gear-2 explainer on CH2-CH5. Full chapter map in SCREENPLAY.md.
- **2026-07-10 — music bed map (v1, SUPERSEDED).** First pass used epic-orchestral beds (Retribution / Hold The Line / Born Every Minute / The Invaders / Searching For Signs Of Life). Mike: too epic, "shouldn't have that epic vibe," the Searching-For-Signs-Of-Life close is overkill.
- **2026-07-10 — REGISTER + music REVISED to SOFT/normal (Mike).** Project override of the longform-edited gear-3 epic default: this video runs **gear 2, restrained explainer, NO epic swells**. New soft bed map (all reusable library.json, understated/chill end): CH1 Synthwave Cinema (moody intro) · CH2+CH3 Press Play (chill explainer cruiser) · CH4+CH5 Common High Speeds (light forward drive, use the `subtle` section cuts) · CH6 Theta Rest (calm reflective close, gentle fade, NOT epic). Cards now at CH2 + CH4 only. Optional low-mix Born Every Minute for a hint of edge at CH4-5. Full table + YT codes in SCREENPLAY.md "Music plan". Remaining: measure LUFS at mix, confirm cards once runtimes lock, promote Theta Rest master into assets/music/theta-rest/.

- **2026-07-10 — CH1 hook re-anchored to a REAL event (Mike caught a vague "last week").** Original opening said "last week the whole crypto world argued about interest" — that was a rhetorical carryover from the reference video, NOT tied to any verified event. Verified the real current hook: the **CLARITY Act stalled in the Senate right before the July 4 2026 recess** (no floor vote/cloture); Senate back July 13; ~3-week window; Polymarket 2026 odds ~48% (from ~74%); stablecoin-yield loophole is one of three blockers. Rewrote CH1 around that + also dropped the reference's May-2025 "stablecoins ripped higher" market-reaction beat (doesn't apply to a 2026 stall). Flagged as a LIVE situation to re-confirm the day of recording.

- **2026-07-10 — issuer-vs-platform loophole VERIFIED + CH5 sharpened (Mike challenged: "I'm still earning interest, how does that match up?").** Verified (Forbes, Columbia CLS Blue Sky, congress.gov CRS): the GENIUS Act (law) bans the ISSUER (Circle) from paying yield — that claim is CORRECT. But it does NOT reach exchanges: Coinbase pays ~3.5% APY as a "loyalty reward" via a revenue-share of Circle's reserve interest (an affiliate, not the issuer) = "the Coinbase-shaped hole," ~$1.35B/yr. That's why holders still earn. The popular "CLARITY Act bans interest on holdings" belief is wrong twice: (1) issuer ban = GENIUS not CLARITY, and it's ISSUERS not platforms; (2) CLARITY only passed the HOUSE (July 2025), it's STALLED in the Senate — not law — so nothing has changed for holders yet. CLARITY is the battleground for CLOSING the platform loophole (OCC + ABA/BPI pushing to close). Rewrote CH5 to lead with this issuer-vs-platform distinction and directly answer "why am I still earning it?" — this is now the video's core payoff.

- **2026-07-10 — mid-roll plug placed at the CH3→CH4 seam (Mike).** Video center (~53%), lands after CH3's "just needs your phone" payoff, rides the existing bed change (Press Play → Common High Speeds). Face-on throughout, no title card, ~15-25s. Tease points at the CH5 "you're still earning yield, here's the loophole" reveal as the open loop through the plug. PLUG BODY is a placeholder for Mike to fill (channel/newsletter/workshop/sponsor). Added as a `MID` section + a MID row in the chapter map.

## Open flags (load-bearing)
- **Verify-at-render:** GENIUS/CLARITY current status (CLARITY may move in the Senate), Coinbase figure, petrodollar year, Treasury yields, CBDC map counts, trillions estimate. (See `[!IMPORTANT]` box in SCREENPLAY.md.)
- **CH6:** name a hard asset (BTC/Kaspa/gold) or keep generic — pending Mike.

## VERTICAL (9:16) VERSION — resume here (2026-07-10 EOD)
16:9 FINAL is DONE + queued (`clarity-act-stablecoins-FINAL.mp4`, longs.json `lf-20260710-clarity-act-stablecoins`).
The vertical is a REFRAME of that locked cut (skill: `longform-edited/skills/vertical-repurpose.md`) — do NOT re-edit.

### DONE (native vertical, in the repo)
- **Spine:** `render-assets/spine-vertical.mp4` — face-centered crop of the un-keyed spine (`crop=608:1080:900:0` -> scale 1080x1920, VO + card-pauses preserved). Mike sits right-of-center so the crop offsets right.
- **Deck slides:** `assets/deck/D{1,2,3,4}v_*.html` -> `render-assets/deck/D{1,2,3,4}v.png` (portrait relayouts: timeline = vertical rail, flows stacked with down-arrows, contrast + hole stacked).
- **Charts:** `remotion/src/clarityChartsVertical.tsx` (portrait ChartC1/C2/C3, count-up preserved).
- **Containers:** `clarityContainers.tsx` is now orientation-aware via `useVideoConfig` (auto-vertical) — shared with the 16:9.
- **Comp:** `remotion/src/ClarityVertical.tsx` (1080x1920), registered in `Root.tsx` as id `ClarityVertical`. Same timing as `ClarityTest` (sh/CARD_T/FACE_CUTS identical).
- **Interim render:** `clarity-act-stablecoins-VERTICAL-v1.mp4` (7:01, 3M) — WATCHABLE but uses REFRAMED-from-16:9 b-roll/CG/receipts. NOT the real deliverable.

### TODO tomorrow (native-vertical assets, then RE-RENDER) — ✅ ALL DONE 2026-07-11 (see "NATIVE-VERTICAL REDO — DONE" below)
1. **Envato vertical b-roll (11 slots).** The comp reads `render-assets/vid-vertical/br-<slot>.mp4` (folder does NOT exist yet — re-render will ERROR until it is filled). Slots: capitol, headlines, crypto, gold, print, oil, treasury, print2, world, surveil, inflation.
   - Portrait candidate JSONs already saved for 4 slots: `assets/vertical-broll-search/{capitol,crypto,gold,headlines}.json`. Re-run the rest: `cd video-creation/skills/envato-broll && node search-envato.js "<query>" --portrait --max 8 --out <slot>.json` (the `--portrait` flag applies Envato's Orientation->Portrait filter; session = `envato-profile`, run `setup-envato.js` if logged out).
   - Pick by READING each candidate's `previewImage`/`previewVideo`, then `node download-envato.js "<item-url>" --dir "<proj>/assets/video" --name br-<slot> --project "Clarity Act ensure US Dominance"`; transcode to ~100MB muted **portrait** (`scale=1080:-2`, strip audio) and place as `render-assets/vid-vertical/br-<slot>.mp4`.
2. **CG stills vertical (CG1-CG4).** Regenerate TRUE 9:16 via ChatGPT `--reference-image` against `render-assets/img/CG{1,2,3,4}.png` (skill: `repurpose/SKILL.md`, browser pipeline `repurpose/generate-broll-reload.js`; specify "vertical 9:16"). Put in `render-assets/img-vertical/` and repoint `ClarityVertical.tsx` `STILL` map + `RocketOverlay` (CG4) there (they currently read the horizontal `img/`).
3. **Receipts vertical (4).** Recapture R-STALL, R-GENIUS, R-CLARITY, R-FORBES in browser MOBILE VIEW (~390x844 portrait reflow — memory `feedback_vertical_screenshots_mobile_view`), source URLs in `DATA.md`. Put in `render-assets/receipts-vertical/` and repoint `ClarityVertical.tsx` `REC` map (currently reads landscape `receipts/`, shown fit-to-width as the interim fallback).
4. **Re-render + mix + QA + deliver.**
   - `cd video-creation/remotion && npx remotion render ClarityVertical "<proj>/_previews/clarity-VERTICAL-noaudio.mp4" --public-dir="<proj>/render-assets" --video-bitrate=3M --concurrency=8` (12640 frames, ~15min; under the ~14436 stitch ceiling so single-pass is fine).
   - Mix: `bash "<proj>/assets/vertical-mix/mix-clarity-vertical.sh"` — reuses the 16:9 audio verbatim (4 beds @ 0.041 = -10dB, pop-fix notch at the 43-44s + 211.3-212.3s card pauses). Output `clarity-VERTICAL-final.mp4` -> copy to `clarity-act-stablecoins-VERTICAL-v1.mp4`.
   - QA: sample frames per beat-type + audio peak (target ~ -4dB, no clip). Vertical is a SEPARATE deliverable; only queue it when Mike says (16:9 is already queued).
- **Root cause of the redo (own it):** first vertical render shipped with reframed-from-16:9 b-roll/CG/receipts instead of native-vertical assets, despite tasks #5/#6/#7 being explicitly on the list. Native-vertical b-roll/CG/receipts is Mike's requirement, not a fallback.

## NATIVE-VERTICAL REDO — DONE (2026-07-11) + rendered at 1 Mbps
Full native-vertical redo (Mike's call). All three native asset types built and the comp repointed; re-rendered
at **1 Mbps** (per Mike's request, not the 3M in the old TODO).
- **Envato portrait b-roll ×11** → `render-assets/vid-vertical/br-<slot>.mp4` (all 1080x1920 full-frame, muted).
  Searched `--portrait`, picked by reading preview contact-sheets, downloaded, transcoded
  (`scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920`, crf 21, `-an`). License URLs (Envato
  Elements, Mike's sub):
  | slot | Envato item |
  |---|---|
  | capitol | app.envato.com/search/stock-video/a7648a85-9bab-4cf8-99f9-47745b01920c (US Capitol + reflecting pool) |
  | headlines | app.envato.com/search/stock-video/b3fe3d4e-6318-40a6-adab-6d0e3919569d (man reading newspaper) |
  | crypto | app.envato.com/search/stock-video/e31abf6c-689a-4aea-8840-77ea59a9efc4 (BTC on circuit board) |
  | gold | app.envato.com/search/stock-video/90e07c80-98f7-406e-9370-a228db41d950 (gold bars on US flag) |
  | print | app.envato.com/search/stock-video/75c3ebac-ef82-41e9-b2d4-d30b762308a6 (counter, red display) |
  | oil | app.envato.com/search/stock-video/c77fac61-9e0c-4a2e-9139-7c8412c8a60b (pump-jack silhouette) |
  | treasury | app.envato.com/search/stock-video/78d07ea1-4f4a-4825-9637-8da5560769fc (US flag + data screens) |
  | print2 | app.envato.com/search/stock-video/d8a9c301-ff91-4078-8409-64922747f5d3 (blue-lit counter) |
  | world | app.envato.com/search/stock-video/4bafdca4-61df-4a18-ad77-29207213ad5f (blue holo globe) |
  | surveil | app.envato.com/search/stock-video/03af78ac-2322-4719-9689-87400edbfe72 (CCTV camera; src >800MB so disk-capped then upscaled, slightly soft) |
  | inflation | app.envato.com/search/stock-video/20085dfa-0263-4a50-8f5f-f749242a921b (produce + price tags) |
  Source `-src` originals were RECYCLED after transcode (disk-full, see below); proxies + these URLs are the record.
- **CG stills ×4 (CG1-CG4) TRUE 9:16** → `render-assets/img-vertical/CG{1..4}.png` (941x1672, no text). Regenerated via
  `repurpose/gen-batch-freshchat.js` with the 16:9 exemplars attached as `ref` (reference-image recompose), prompts in
  `repurpose/_clarity-vertical-cg.json`. Comp `STILL` map + `RocketOverlay` repointed to `img-vertical/`.
- **Receipts ×4 MOBILE VIEW** → `render-assets/receipts-vertical/R-{STALL,GENIUS,CLARITY,FORBES}.png` (1170-wide portrait
  bands, headline+lede, ads/newsletters cropped out, ≤2080px tall to fit the frame). Captured with `repurpose/_cap-receipt.js`
  (iPhone-emulated Chrome, consent/modal dismissal incl. a late pass for the timed Forbes Wine Club modal, h1-anchored crop).
  Comp `REC` map repointed to `receipts-vertical/`. **Source URLs (were NOT in DATA.md — found via web search, recorded here):**
  R-STALL = bitcoinfoundation.org/news/regulation/clarity-act-blocked-before-july-4-senate-delay-sparks-uncertainty-what-happens-next/ ·
  R-GENIUS = whitehouse.gov/fact-sheets/2025/07/fact-sheet-president-donald-j-trump-signs-genius-act-into-law/ ·
  R-CLARITY = finance.yahoo.com/markets/crypto/articles/clarity-act-stalls-senate-three-100403007.html ·
  R-FORBES = forbes.com/sites/digital-assets/2026/05/20/the-genius-act-stablecoin-yield-ban-has-a-coinbase-shaped-hole/
- **Spine note (NOT a bug):** the vertical face is on a raw GREEN screen — this MIRRORS the approved 16:9 final, where
  `ClarityTest.tsx` uses the un-keyed green spine ("Mike reverted the chroma key"). Do NOT re-key the vertical; it would
  diverge from the locked cut.
- **Render (4 attempts — read this before the next vertical):** validated per-beat stills first, then rendered. THREE failures
  then success:
  1. **Disk-full** (frame 735, "Failed to fetch spine-vertical.mp4 ... disk space is low"): C: hit 100% from the 6.6GB of Envato
     `-src` originals. Fix: recycled them (proxies + URLs are the record).
  2. **Transient 404** on `br-gold.mp4` (frame 1671) at concurrency 8 — one-off OffthreadVideo serving race; dropped to 4.
  3. **Stitch crash `0xC0000142`** (STATUS_DLL_INIT_FAILED) at the FINAL FFmpeg stitch — even on a 6320-frame HALF. This is
     **desktop-heap / handle exhaustion**, NOT the frame-count ceiling: the harness reports a backgrounded render as
     "killed"/"completed" but the Remotion process KEEPS RUNNING (verified: frame count still advancing, driver PID alive), so
     launching a NEW attempt left MULTIPLE detached renders' Chrome workers alive at once → desktop heap exhausted → the stitch
     FFmpeg can't init its DLLs. **Fix that worked:** (a) kill the stale render processes (`chrome-headless-shell`, orphaned
     `node @remotion`, stale `bash npx remotion` — NEVER Mike's `chrome.exe`) to free the heap; (b) a 300-frame test render proved
     the stitch works clean; (c) run the **two-halves** driver (`scratchpad/render-halves.sh`: frames 0-6319 + 6320-12639, each
     stitched separately, then a STANDALONE ffmpeg `filter_complex` concat) ONCE at concurrency 3 and DO NOT relaunch on the
     bogus "killed" — let the detached process finish (watch the OUTPUT FILE / a Monitor, per `reference_remotion_stitch_handle_ceiling`).
  - **Bitrate:** the single-pass concat's `-b:v 1M -maxrate 1M` ABR undershot to 0.63M on this compressible content even though the
    render halves were ~1.03-1.06M. Redid the concat as a **2-pass** encode (`-b:v 1000k`, video-only filter for pass 1) → **892887 bps
    video (~0.89 Mbps), ~1.15 Mbps total** — a legit ~1 Mbps per Mike's request.
- **Mix + QA:** `assets/vertical-mix/mix-clarity-vertical.sh` (reuses the 16:9 audio, `-c:v copy`) → `clarity-VERTICAL-final.mp4`.
  QA PASS: seam @210.667s seamless (natural motion, no black/jump), audio peak -4.17dB / flat-factor 0 / no clip (16:9 parity),
  blackdetect = designed fade transitions only (none at seam), all 9 sampled beat-types full-frame native-portrait.
- **DELIVERED:** `clarity-act-stablecoins-VERTICAL-v1.mp4` (project root, replaced the old reframed interim), 1080x1920, 12640 frames,
  7:01, ~0.89 Mbps video / 60.9MB. **NOT queued** — vertical is a separate deliverable; queue only when Mike says (16:9 already queued).
