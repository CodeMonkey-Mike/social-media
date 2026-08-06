# livestream-repurpose — PROJECT LOG

_Running history for the livestream-repurpose pipeline + its LangGraph migration.
Newest entry first. Update after every significant run. (Pattern borrowed from
linkedin-automation/PROJECT-LOG.md.)_

---

## 2026-08-05 (later) — `if-yacht`: Wave 3 BUILT + SANDBOX-BLESSED (live bless CARRIES OVER), frontier green, Mike deleted BOTH clips at 4b, Lane 3 complete

### ⚠️ THE CARRYOVER — Wave 3 live bless MUST run on the NEXT livestream

**Wave 3 (tighten de-fork) is built, stub-tested and sandbox-blessed, but NOT live-blessed:
Mike reviewed the two cut clips at 4b and deleted BOTH (no shorts for this batch), so if-yacht
has no tighten step to bless on.** Next stream: run the blessed intake + cut frontier as usual,
and when 4b survivors exist, the FIRST real tighten runs through the NEW graph —
`python video-creation/livestream-repurpose/graph/run.py tighten --batch <batch> --min-sil N`
(min-sil = Mike's per-batch 5B call; recent: 0.25 / 0.45) — and THAT run is the Wave 3 live
bless. Wave 4 (finish: 5C + captions wraps; 5B now lives inside canonical tighten) builds only
after it. The frozen forks (`tighten_clips_<batch>.py`, 15 of them) remain rollback.

### Wave 3 — what was built (commit `214dad7`)

- **Canonical `scripts/tighten_clips.py`** de-forks the tighten hand-forks (blueprint:
  `tighten_clips_october_bottom.py`; the ancient unsuffixed fork squatting the canonical name
  was renamed `tighten_clips_best350x.py`). Reads tighten-plan.json + clip-plan.json (4b
  retitles ride along), master-absolute cuts in assembly order, uncapped boundary relocks,
  removals under the voiced ceiling MEASURED vs Whisper words (15% hard, plan's own estimate
  never trusted), 8 ms declicks, then 5B via the canonical desilencer at the CALLER'S
  `--min-sil` — **required arg, never baked** (delete_silences.py's 250 ms wrapper stays for
  hand runs). Stages tighten/finalize/all, `--only <slug>` single-clip re-render, finalize
  clobber guard for batches past 5B (`--force` to override).
- **Graph segment** in `graph/shorts_graph.py`: tighten → verify_tighten → finalize →
  verify_finalize, same halt topology / verify-from-disk / stub / sandbox contract as cut;
  runner fail-fast uses the script's own validator (one source of truth). Registered as
  `run.py tighten`; lane 3 "tighten" added to the LangGraph → Livestream dashboard tab.
- **Blessed:** stub ok/fail green (halt + exit codes) · sandbox e2e on REAL audio green
  (scratch 2-clip batch off an october-bottom tightened spine: non-chronological assembly,
  relock, 0.25 5B) · deliberate halts all fired: over-ceiling plan (measured 64.5% vs 15%),
  removal outside every segment, clobber guard + --force.
- **Finding worth keeping:** Whisper word-spans OVERCOUNT voiced time (boundaries bleed into
  pauses) — legit 23% silence removal tripped a word-span absolute floor in verify_tighten.
  Word spans are a RATIO tool (the ceiling gate) only; the swallow guard is now structural
  (desilenced ≥ 35% of tightened). Fine-grained speech QA stays with the desilencer's own
  guard + Mike's 2nd review.
- No JS existed in this wave (Mike asked): the tighten path was already all-Python. The lane's
  ONE JS file (`setup-batch-render-assets.js`) is Wave 5's port.

### Batch `if-yacht` (2026-08-05 stream, 47.7 min)

| Lane | State |
|---|---|
| Lane 1 longform | **QUEUED** `lf-20260805-if-yacht` "The What If Yacht: $IF Is a Steal Right Now" (2014.0s staged, -845.1s silence at min-sil 0.5, 0.81 Mbps; **thumb NULL — Mike to drop a PNG, then patch**) |
| Lane 2 shorts | **SKIPPED at 4b (Mike):** clip-strategist authored a 2-clip plan (Mike's per-run cap), cut graph ran green (129.9s + 124.1s), **Mike deleted both** → folders removed, `pipelines.shorts: "skip"`, progress closed (`4b-all-deleted`); clip-plan.json / dashboard / _cut_results kept as records |
| Lane 3 text/image | **DONE** (`pipelines.repurpose: done`): 14 lint-clean entries — 6 X tweets (4 long + 2 one-liners), 2 threads (Robinhood/$IF thesis · copies-vs-originals), 2 YT posts + two 5-slide carousels (v1 news-flash / v2 editorial), 2 YT polls, 2 IG 4:5 companions. **No X poll** (topic filter: $IF/Robinhood + macro; only decorative Kaspa content). ElizaOS excluded everywhere (unresolved founder-lawsuit/delisting claim surfaced ON stream) |

- **Intake frontier: second consecutive unattended full-graph run** (encode 0.65 Mbps →
  longform → verticalize → whisper 7276 words / 452 segs / 32 chunks; glossary Kaspa:1, zero
  KRC20 flags).
- **Stale-value sweep (Mike, at review):** every decaying dollar claim stripped from the queue
  — the $12M mcap, the $8M support, "100x from today" — across the YT post, thread A (3
  tweets), tweet 1, IG-2, poll 1, and carousel slide A3 (REGENERATED with durable text).
  Historical receipts stay ($BRETT $1.97B peak, $PNUT $1.7B ATH). **Rule for future batches:
  current-price/mcap claims do not go into queue entries; they are stale by post time.**
- **Images: 18 generated, 3 adversarial QA rounds.** Round 1 caught 8 defects incl. the exact
  recurring modes (Kaspa logo standing in for $IF, real exchange marks on a slide, non-mirrored
  K, 5:8-instead-of-4:5, comma/glyph collision, chartreuse type drift). Regens fixed all
  content defects; the two remaining hue-only fails were fixed by **numeric hue measurement +
  targeted hue rotation of the type band (PIL), NOT another regen roll** — regen re-rolls
  everything and risks re-introducing content defects; measure (house accent ≈ RGB 58,244,66 /
  hue 122) and recolor in place. Institutionalize that pattern.
- **Incident:** a 10-min tool timeout killed a gen run mid-flight → orphaned chatgpt-profile
  Chrome blocked every later launch ("Opening in existing browser session", crash at
  gen-images.js:176). Fix: kill ONLY chrome.exe whose CommandLine matches `chatgpt-profile`
  (never the main browser), then rerun; pool rotation to fresh chats behaved. One retired
  yt-posts chat delete keeps 429ing — known, stays queued for future sweeps.

### Open for Mike / follow-ups

- Longform thumbnail PNG (`lf-20260805-if-yacht`) → patch `thumbnail_path`.
- Review the 14 queued Lane 3 entries (all `pending`; posting stays Mike-gated).
- Still missing: $IF + $COOPER X handles (`persona.json → project_handles`), Cooper + CashCat
  reference PNGs.
- C: at ~13 GB free at session start; media/IF-yacht still holds the 2.19 GB raw mkv +
  LOW BPS + vertical (normal until publish/cleanup).

---

## 2026-08-05 — `october-bottom` BATCH COMPLETE: all 6 shorts built, gated and queued (resume run)

The 2026-08-04 wrap's resume contract executed clean. **All 6 shorts built through Phase 7 and
published** (`ob-20260804-*`, staged to `schedule-tweets/shorts/october-bottom-2026-08-04/`, all 7
platforms `pending`, every staged md5 matching its FINAL render, new entries persona-lint clean).
`batches.json` → `pipelines.shorts: done`. Posting stays Mike-gated.

| n | short | final | b-roll | LUFS |
|---|---|---|---|---|
| 1 | october-mandela-myth | 114.2s | 32.0% | -17.8 |
| 2 | kaspa-dip-bought-more | 54.9s | 33.4% | -17.9 |
| 3 | whatif-organic-dogecoin | 86.1s | 29.9% | -17.9 |
| 4 | ring-of-fire-meme-judgment | 48.8s | 31.7% | -17.1 |
| 5 | cooper-robinhood-real-dog | 66.3s | 32.9% | -17.4 |
| 7 | kaspa-dip-impact | 13.4s | 32.9% | -17.6 |

### Resume mechanics (what the wrap protocol got right/wrong)

- Both stage locks came back FREE (the wrap's sweep held) — no stale-lock recovery needed.
- Disk truth beat the wrap table on THREE clips: 3 had 3/9 b-roll images already on disk, 5 and 7
  both had comps + captions + Root.tsx registrations the wrap recorded as barely started. RESUME
  framing with a verified inventory prevented every regeneration (clip 3's builder probed the
  predecessor's pool chat read-only and confirmed the 4th image never landed server-side).
- Waves of 3 again: 1/3/4 first, then 7 on clip 4's completion, then 5. Lock contention behaved
  (7 queued ~15 min behind 3's render, never stole it).
- ENOSPC guard mid-run: 15 stale remotion temp dirs (~730 MB, idle 50+ min) swept while renders
  were live by filtering on newest-file age; C: went 6.0 → 6.7 GB free.

### Findings worth keeping (all institutionalized where noted)

- **Clip 1's pre-sweep render WAS masking VO**: the 44.80 riser fully deleted "prior to this."
  Fixes: one sting RETIMED off the punchline (volume could not fix it, 0.26→0.10 all failed; moving
  the hit 0.45s later did), two risers shortened. Re-rendered; publish used the NEW md5 (e8287a24).
- **Leftover composer draft failure mode** (clip 3): the predecessor's killed run left a half-typed
  prompt in the ChatGPT composer; the next prompt typed into its middle silently produced a WRONG
  image that reported OK. Fixed with clearComposer() in both generators + documented in the
  remotion-shorts-build SKILL. The bad "organic" image was quarantined and that one beat re-run.
- **Gate false negative** (clip 3): an `sfx()` template-literal helper hid all 19 cues from the
  gate's `staticFile('literal')` parser. Spelled out per house convention rather than loosening the gate.
- **Masking triage matured**: clips 4 and 7 both PROVED suspect diffs were Whisper/Remotion-audio-path
  variance (simulated-mix + zero-SFX controls, energy measurement) instead of reflexively sweeping
  cues; clip 5 proved the 18.10 TING's DECAY TAIL was the masker (dur 1.4→0.8) with volume unchanged.
- **Platform-safety regen exception** (clip 5): the $IF figure's take 1 was unshippable (bare
  full-body render) and no clean remap existed without dropping a MANDATORY reference beat — one
  re-prompt with waist-up framing. Take 1 never entered render-assets.
- `_draft-*.mp4` in `remotion/out/<batch>/` is a publish hazard (publish-shorts globs `*.mp4`) —
  swept before publishing. Consider teaching publish-shorts.py to skip `_*` prefixes.

### Open for Mike

- ~~Longform thumbnail~~ RESOLVED: `lf-20260804-october-bottom` thumb was already staged 2026-08-04
  and the longform is POSTED on rumble/bitchute/facebook (URLs in longs.json).
- **Batch-wide loudness ~-17.5 LUFS** (inherited from the spines, consistent across all 6): one
  normalization decision if he wants the -14 social norm.
- Clip 4 (NON-BLOCKING): the base screen-share shows the mocked coin's real DexScreener name/mcap —
  strategy call, shipped as recorded.
- Still missing: Cooper + CashCat reference PNGs; $IF + $COOPER X handles.
- Clip 3's builder flagged an untracked pool chat (the predecessor's b-roll chat never registered in
  chatgpt-image-chats.json) — next gen run's sweep won't see it; harmless but unrotated.
- C: drive at 100% (6.7 GB free) — a `cleanup.js --dry-run` sweep is due once this batch posts.

### LangGraph carryover — NEXT STREAM = WAVE 3 (Mike confirmed 2026-08-05)

**Migration status: Waves 1+2 fully blessed (intake + cut graphs). Mike's call at batch close:
after his next livestream, run the next wave.** The Wave 3 contract, so the next session can start
cold:

- **Wave 3 = tighten de-fork**: replace the per-batch `tighten_clips_<batch>.py` hand-forks with a
  canonical `scripts/tighten_clips.py` + graph segment (mirroring how Wave 2's `cut_topics.py`
  de-forked the 17 cut forks: validate hard, execute, verify-from-disk, halt topology, frozen forks
  kept as rollback).
- **Reference implementation**: `tighten_clips_october_bottom.py` (2026-08-04, modeled verbatim on
  the whatif1000x fork) is the LAST manual fork and the de-fork blueprint: master-absolute cuts,
  8 ms declick, voiced-content ceiling gate vs Whisper words (~10% target / 15% ceiling), canonical
  `delete_silences.py` on a copy for 5B.
- **Halfway done already**: tighten-strategists persist their spans to `tighten-plan.json`
  (per-clip JSON contract), so the graph segment reads the same input the fork did.
- **Stays manual/Mike**: 4b delete verdicts by clip number, the 2nd review placement, and the 5B
  min-sil knob (recent batches: 250 ms and 450 ms — always his per-batch call).
- **Cadence rule stands**: one wave per real stream; run the already-blessed intake + cut graphs
  end-to-end on the new stream first, then build+bless Wave 3 on that batch's tighten step.
- Other carryovers for that session: teach `publish-shorts.py` to skip `_*.mp4` drafts; the
  unregistered pool chat from clip 3's predecessor (untracked by rotation/cleanup); C: disk sweep
  (`cleanup.js --dry-run`) once october-bottom posts out; Cooper/CashCat reference PNGs + $IF/$COOPER
  X handles still wanted.

---

## 2026-08-04 (later) — `october-bottom` END-OF-SESSION WRAP: Lanes 1+3 DONE, Lane 2 tightened+desilenced with clip 2 BUILT, 5 builders in flight

Session wrapped ahead of the API limit. **This entry is tomorrow's resume contract.**

### Done today after the Wave 1+2 bless (entry below)

- **4b verdicts executed (Mike):** clip 6 DELETED (folder removed; numbers frozen at 1,2,3,4,5,7);
  clip 4 retitled "Meme Coin: Unc Goes Down Down Down..." with the ENTIRE Johnny Cash span removed
  (relock at 1342.82 master, RMS-verified -68.6 dB trough, zero licensed audio survives); clip 7
  retitled "OMG: Kaspa Dipped Under 2.6 Cents 😱". **2nd review waived; build + publish authorized
  by Mike (posting stays his).**
- **Phase 5 + 5B DONE (all six, one fork run, 250 ms):** via `tighten_clips_october_bottom.py`
  (modeled verbatim on the whatif1000x reference) off `tighten-plan.json` authored by SIX
  tighten-strategist agents. Mid-run incident: the API session limit killed 3 strategists;
  **SendMessage resume recovered all 3 with their analysis context intact** — the resume path works.

  | n | clip | raw → desil | voiced cut |
  |---|---|---|---|
  | 1 | october-mandela-myth | 171.6 → 114.7s (then 114.2 after burst fix) | -13.7% |
  | 2 | kaspa-dip-bought-more | 95.4 → 55.0s | -14.2% |
  | 3 | whatif-organic-dogecoin | 149.1 → 86.0s | -13.2% |
  | 4 | ring-of-fire-meme-judgment | 98.1 → 48.8s | -9.8% |
  | 5 | cooper-robinhood-real-dog | 124.3 → 66.2s | -14.6% |
  | 7 | kaspa-dip-impact | 19.7 → 13.4s | 0% (relocks only) |

- **Burst removal clip 1:** cough at 47.68 clip-time excised (-0.52s, 13 frames), verified on the
  render ("But"/"related" both whole); spine replaced in place, re-transcribed (375 words);
  **the join has a visible head-position jump — clip 1's builder MUST cover 47.6-48.9 with b-roll**
  (instruction already in its dispatch + progress.json note).
- **Per-clip whisper-words.json: all six current** (clip 1 redone post-fix).
- **Lane 3 COMPLETE** (`pipelines.repurpose: done`): 15 lint-clean entries — 6 X tweets (4 long +
  2 one-liners), 2 IG 4:5 Kaspa companions, 2 YT posts (october-mandela v4 carousel + if-organic v1
  carousel, 5 slides each, wired into `images[]`), 2 YT polls, 1 X poll (Kaspa only; October poll
  is YT-only per the topic filter), 2 threads. **All 17 images passed adversarial visual-qa — it
  took 3 rounds** (caught: a KASPA logo standing in for $IF, real Binance/Coinbase/Kraken marks on
  a slide, duplicate "5 OF 5" badges leaked from the v1 exemplar, chartreuse palette drift, garbled
  Kaspa glyphs on both IG images, and a bar chart contradicting its own "6TH WORST OF 12" box).
  **Prompt lesson institutionalized: the model obeys labels and ignores geometry — specify the
  twelve bar values / the glyph strokes / "no badge", and move occluders away; that fixed both
  final stragglers in one round.** Drafts: `repurpose/output/2026-08-04_october-bottom*`.
- **Clip 2 BUILT + gate PASS** (first of six): 54.92s, 33.4% b-roll / 9 beats / 3 full-screens,
  12 SFX, -17.9 LUFS, whisper-verified final mix, persona-clean; its builder verified
  "this guy's an opportunity" is actually "this gives an opportunity" (5 isolated passes) and
  persisted the phrase rule in `skills/captions/build_captions.py`. progress.json → `7-built PASS`.

### STOPPED CLEANLY AT WRAP (not limit-killed) — per-clip build state

The five in-flight builders were STOPPED deliberately at wrap; both stale stage locks
(`chatgpt` held by clip 3, `render` held by clip 4) were released and verified free; no orphan
generator processes remain. Last-known positions + disk truth (`remotion/out/october-bottom/`):

| n | clip | state at stop |
|---|---|---|
| 1 | october-mandela-myth | **FULL RENDER ON DISK (98.2 MB)** — was in the final whisper-verify, sweeping 3 SFX cues that masked VO; tomorrow: finish the cue sweep (re-render likely), then gate |
| 2 | kaspa-dip-bought-more | **DONE + gate PASS** (52.1 MB) — nothing to do |
| 3 | whatif-organic-dogecoin | comp/plan authored, SFX staging done, was HOLDING the chatgpt lock (b-roll generation in progress or imminent) — verify render-assets image inventory before regenerating anything |
| 4 | ring-of-fire-meme-judgment | b-roll complete + persona-inspected (zero dups); `_draft-4-ring-of-fire.mp4` (3.6 MB draft proxy) on disk; was HOLDING the render lock — draft/full render was in flight; verify and re-render |
| 5 | cooper-robinhood-real-dog | comp authored, was registering in Root.tsx — check Root.tsx registration + render-assets inventory |
| 7 | kaspa-dip-impact | barely started (reading the contract) — full fresh build |

### Resume protocol for tomorrow (in order)

1. **Relaunch the five builders with RESUME framing per the table above.** First:
   check what landed on disk per clip — `out/october-bottom/<n>-<slug>.mp4`, `constants-*.ts` +
   `captions*.ts` in `remotion/src` + Root.tsx registration, `<clip>/BROLL-PLAN.md`, images in
   `shorts/october-bottom/render-assets/`, gate output. **If a builder died: SWEEP STALE LOCKS
   FIRST** (`python video-creation/shorts/_tooling/stage_lock.py` status/break for `chatgpt` AND
   `render` — dead agents leave them held and the auto-break only fires on acquire attempts; this
   wedged 200 min on 2026-08-03), then relaunch that clip's builder with RESUME framing: verified
   on-disk inventory in the prompt, "verify + finish, NEVER regenerate an existing image."
2. **After all six gate PASS → publish per Mike's standing approval:**
   `python scripts/publish-shorts.py october-bottom` → fill hook/caption/tags per entry in persona
   voice (titles: Mike's exact titles for 4 + 7; open-loop titles for the rest; captions
   hashtag-free; CryptoRich link ONLY yt/rumble/bitchute; **$IF never $WHATIF**; no em dashes) →
   **md5-verify every staged copy against its FINAL render** (re-verify any clip whose builder
   re-rendered post-QA — the 2026-07-23 hazard) → `persona-lint.py` on shorts.json. **POSTING
   remains Mike-gated, sequential, one poster at a time.**
3. progress.json: patch each clip to `7-built PASS` as verified (clip 2 already done).
4. Batch registry note + this log get the batch-complete entry when publish lands.

### Open for Mike / follow-ups

- **Missing references:** Cooper (real-dog generic shipped) and CashCat (text/generic shipped) —
  drop PNGs in `schedule-tweets/images/reference/` to unlock branded beats in future batches.
- **Unknown X handles:** $IF and $COOPER (Follow lines omitted today) — add to
  `persona.json → project_handles` when known.
- Retired b-roll pool chat deletion kept 429ing during sweeps — harmless, stays queued; next
  gen run's sweep will clear it.
- Longform `lf-20260804-october-bottom` queued with Mike's thumbnail staged; posting when he runs
  the posters.

**Migration status unchanged: Waves 1+2 fully blessed (entry below). Wave 3 (tighten de-fork) is
the next stream's bite — today's `tighten_clips_october_bottom.py` is the LAST manual tighten fork
if Wave 3 lands next time.**

---

## 2026-08-04 — `october-bottom`: Wave 1 FULL live bless + Wave 2 (cut) built, sandbox-blessed AND live-blessed

**Migration status: Waves 1-2 both fully blessed.** One stream, per the one-wave-per-stream cadence.

### Wave 1 — the pending full bless landed (all 12 nodes in-graph, no manual driver)

`run.py --source ".../october-bottom/2026-08-03 17-18-06.mkv" --min-sil 0.5` ran the whole intake
unattended (detached + log/heartbeat watcher): 55.3-min stream → 0.64 Mbps master · longform
desilenced 3320.7s → 2144.8s (-19.6 min at min-sil 0.5, batched renderer 19 parts — the 2026-08-03
fix proved again) staged at 0.82 Mbps · queued `lf-20260804-october-bottom` "There Is No October
Bottom" (longs total 39, **thumbnail NULL — Mike to drop a PNG in, then patch the entry**) ·
vertical verified 1080x1920 SAR 1:1 · whisper 7360 words / 485 segments · glossary Kaspa:3 TAO:7,
**zero KRC20 flags** (no adjudication seam needed). The `longform → derive` nodes that ran outside
the graph last stream all ran in-graph this time.

### Wave 2 — cut segment: built, de-forked, blessed twice

- **`scripts/cut_topics.py`** (canonical) de-forks the 17 `cut_topics_<batch>.py` (frozen as
  rollback): validates clip-plan.json hard (permutation check on assembly_order, segment bounds vs
  master, dup ids), cuts re-encoded segments + concats per assembly order, `_cut_results.json`,
  canonical dashboard, `register_batch()`, progress.json at the 4b gate. `--stage cut|finalize|all`;
  finalize REFUSES to clobber a progress.json past the cut phase (--force to override).
- **`graph/shorts_graph.py`** cut segment = cut → verify_cut (ffprobe each clip vs plan-sum ±1s +
  geometry == master) → finalize → verify_finalize (dashboard carries every slug + stable Clip N
  chips, registry entry active, progress at 4b). Invoked `run.py cut --batch <batch>` (legacy
  no-segment invocation stays intake). Dashboard: lane 2 "cut" added to LangGraph → Livestream.
- **Blessed:** stub ok/fail (halt topology) · sandbox e2e green first try (scratch 2-clip batch,
  non-chronological assembly, prod isolation verified, missing-master preflight halt, clobber
  guard) · then **LIVE**: 7 clips / 684.5s cut in one green invocation on this batch, exit 0.

### Batch `october-bottom` state (registered, active)

| Lane | State |
|---|---|
| Lane 1 longform | **QUEUED** (`lf-20260804-october-bottom`, thumb null — needs Mike's PNG) |
| Lane 2 shorts | **7 clips CUT via the cut graph, dashboard awaiting Mike's Phase 4b review** → `video-creation/shorts/october-bottom/dashboard.html` (5 full 95.6-172.0s + 2 impact 19.8/24.9s; clip-strategist plan with dropped-list + stt_garble_flags in `clip-plan.json`) |
| Lane 3 text/image | **NOT STARTED** (out of today's scope per Mike; transcript ready) |

### Open for Mike (4b + follow-ups)

- **4b delete calls by clip number** on the dashboard.
- **Clip 4 production flag:** the licensed Johnny Cash recording may be audible under his Ring of
  Fire singalong (1345-1368 master time) — call is mute-under / trim to vocal / accept.
- **Clip 5 energy flag:** weakest delivery of the five (browsing register); strategist says cut it
  first if it reads flat.
- **Ticker gate discovered by the strategist: the What If token's ticker is `$IF`, never
  `$WHATIF`** — recorded in clip-plan.json stt_garble_flags; also relevant to the still-open
  "$WHATIF X handle" item in persona.json from the last batch.
- Longform meta was authored + queued in-run (title "There Is No October Bottom"); patch
  longs.json if Mike wants different wording.
- Phase 5 (when 4b verdicts land): tighten-strategists → hand-forked
  `tighten_clips_october_bottom.py` off the whatif1000x reference (manual until Wave 3);
  **min-sil for 5B is Mike's call** (recent batches: 250 ms and 450 ms).

**Next wave (next stream): Wave 3 — tighten de-fork** (strategist spans already persist to
tighten-plan.json, so the contract change is halfway done).

---

## 2026-08-03 (later) — `what-if-1000x` BATCH COMPLETE: all 7 shorts built, gated and queued

All three lanes are now done. **7 shorts built through Phase 7 and queued** (`wi1-20260803-*`, staged to
`schedule-tweets/shorts/what-if-1000x-2026-08-03/`, all 7 platforms `pending`, every staged md5 matching
its render, persona-lint clean). Longform thumbnail staged and `thumbnail_path` patched. `batches.json`
→ `shorts: done`, `repurpose: done`.

| n | short | final | b-roll | SFX |
|---|---|---|---|---|
| 1 | 1000x-math-ten-coins | 73.6s | 32.1% | 21 |
| 2 | whatif-100x-bigger-than-brett | 74.0s | 31.5% | 19 |
| 3 | october-bottom-self-defeating | 59.3s | 29.7% | 12 |
| 4 | lab-called-20x-did-353x | 61.3s | 32.8% | 11 |
| 5 | whatif-next-dogecoin | 64.8s | 31.4% | 16 |
| 6 | 1000x-math-ladder-impact | 24.3s | 33.6% | 11 |
| 7 | whatif-100x-impact | 12.6s | 33.8% | 6 |

### THE INCIDENT — 7 parallel builders all killed at once, and a 200-minute lock wedge

The first fleet of 7 `remotion-builder` agents was killed mid-run by an **API session limit**. No defect
in their work, but two consequences worth institutionalizing:

1. **Dead agents left both stage locks HELD** (`chatgpt` 208 min, `render` 200 min). `stage_lock.py`
   auto-breaks at 90 min, but only on a NEW acquire attempt, and the three blocked builders had already
   entered their poll loop and never re-evaluated. Net effect: clips 1/4/5 spent their entire lives
   queued behind a corpse and generated **zero** b-roll. Locks had to be cleared by hand.
2. **Relaunching in waves of 3 beat relaunching all 7**, purely for blast radius. Builders were handed a
   verified on-disk inventory and told to RESUME (verify + finish), never to regenerate an existing
   image. Zero images were regenerated across the whole recovery.

### Findings the builders surfaced (all now in `progress.json`)

- **`clip-plan.json` `stt_garble_flags` DO NOT all survive into the per-clip Whisper-medium transcripts.**
  They were derived from the original master transcript. Clip 3 found two flagged garbles that did not
  exist at all ("I'm sell", "phone moment"); clip 4 **rejected two orchestrator-authored fixes as wrong
  against the audio** with 3 isolated Whisper passes each ("i had **it** listed", not "had LAB listed";
  "**that's** crazy", not "it's crazy") and corrected them at source in `build_captions.py`. **Every
  builder must verify a flagged garble against its OWN whisper-words.json before applying it.**
- **Desilenced spines ship a 250-frame GOP with B-frames** → Remotion's 8 concurrent `OffthreadVideo`
  seeks fail intermittently with `No frame found at position N` and kill the render mid-way (clip 6, at
  frame 565). Fix: re-encode the **render-assets copy only** to a seek-friendly GOP
  (`-g 25 -keyint_min 25 -bf 0 -sc_threshold 0`); the canonical spine is never touched.
- **A sub-EPS gap does NOT hard-cut two adjacent b-roll beats** (clip 4): `BrollLayer`'s adjacency window
  only suppresses the FADES, `findIndex` still returns -1 across the gap, so the base flashes for a few
  frames. **Butt the windows exactly (`tOut === tIn`).**
- **A closing beat whose `tOut` sits exactly at the comp end ghosts** (clip 2): its fade-out plays over
  the last frames and dissolves the artwork back onto Mike's face. Park `tOut` past the final frame.
- **Whisper-verifying the FINAL MIX earned its keep, twice.** Clip 1: a 0.38-gain whoosh was swallowing
  the payoff word "pop" (swept to 0.20 until it returned; the payoff impact itself was never lowered).
  Clip 5, worse: the two cover-cut whooshes were masking **the token's own name** ("the WHAT IF"
  transcribing as "the 1F"); 0.46/0.32/0.26/0.24 all still failed, 0.22 restored it, and the clip was
  re-rendered. **A cue that masks the VO is a build defect, not a mixing taste call.**
- **Persona inspection is a platform-safety gate too** (clip 5): the generated climax statue came back
  front-facing with explicit anatomical detail, a moderation risk on IG/TikTok/YT. Fixed with a localized
  tone-matched smoothing of a 76x88 px region in place, no regeneration and no beat remap.

### Open for Mike

- Caption judgment calls: clip 2 "in december of 2024, not **2020**" (3 passes agree, plan expected 2025)
  and "i'll be crazy"; clip 4 "**it** was just nuts" (isolated pass still hears "I", but "I was just nuts"
  reads as self-deprecating). All vetoable in one token each.
- **BATCH-WIDE: integrated loudness ~-17 LUFS**, under the -14 social norm, inherited from the spines and
  NOT introduced by the builds. One normalization decision across the batch if he wants it raised.
- Clip 1 carries the two longest no-image stretches (13.1s over the $913.63K Housecoin CMC page, 16.9s
  over the LAB page). Both deliberate receipts, both badge-carried; pacing worth his eye.
- Clip 5's closing caption ships as "lists what if, right?". Every 1x Whisper pass hears "...Robin Hood
  lists WHAT IF, right?"; only time-stretched passes hear "run it". The orchestrator-supplied fix
  ("lists it and it runs") would have REPLACED the "what if" every pass hears, so it was rejected and
  the rule deleted from `build_captions.py`. Override only from the livestream itself.

> **Publish-time note:** clip 5 was queued while its builder was still running, then its report revealed
> a post-QA re-render. The staged copy was re-md5'd against the final render and MATCHED (the re-render
> landed before the publish), so nothing was stale. **All 7 staged copies verified against their FINAL
> renders.** This is the 2026-07-23 hazard and the md5 sweep is what makes publishing-before-every-report
> survivable: nothing posts until Mike runs a poster, so a stale stage is always recoverable.

---

## 2026-08-03 — `what-if-1000x`: Lane 3 carousels DONE + Phase 4b verdict executed (clip 8 deleted, 1-7 tightened + desilenced)

**Lane 3 finished.** The two YT carousels are complete: slide 02 (`b6795e2f`) was recovered from
the yt-posts pool chat (it HAD finished server-side when the 2026-08-02 run was stopped — probed the
chat read-only, downloaded, never re-sent), slides 03-10 generated via `gen-images.js` one item per
invocation (pool chat now 20/25). All 10 spot-QA'd clean. `images[]` wired onto
`yt-post-2026-08-02-whatif-vs-pepe` (Post A) + `yt-post-2026-08-02-1000x-math` (Post B) from
`l3-car-meta.json`; persona-lint clean on both (28 flags in file are all pre-existing posted
entries). `batches.json` → `pipelines.repurpose: "done"`.

**Phase 4b verdict (Mike): delete clip 8, keep 1-7.** `october-90-percent-impact/` folder removed;
survivors keep their frozen numbers.

**Phase 5 + 5B run (per Mike, 2nd review moved after desilence).** 7 tighten-strategist agents
(one per clip, parallel) authored `tighten-plan.json`; new per-batch script
`scripts/tighten_clips_whatif1000x.py` (modeled verbatim on the October-pumps reference: master-
absolute cuts, 8 ms declick, voiced-content ceiling gate vs Whisper words, canonical
`delete_silences.py` on a copy) executed it. All 7 clips passed the 15% voiced ceiling:

| n | clip | raw → final | voiced cut |
|---|---|---|---|
| 1 | 1000x-math-ten-coins | 102.5s → 73.6s (-28.3%) | -14.6% |
| 2 | whatif-100x-bigger-than-brett | 124.2s → 73.9s (-40.5%) | -14.1% |
| 3 | october-bottom-self-defeating | 87.8s → 59.2s (-32.7%) | -12.9% |
| 4 | lab-called-20x-did-353x | 90.3s → 61.2s (-32.2%) | -13.2% |
| 5 | whatif-next-dogecoin | 101.5s → 64.8s (-36.2%) | -10.6% |
| 6 | 1000x-math-ladder-impact | 33.9s → 24.2s (-28.7%) | -10.1% |
| 7 | whatif-100x-impact | 20.4s → 12.6s (-38.4%) | -12.3% |

Dashboard rebuilt IN PLACE with the tightened+desilenced clips → **awaiting Mike's 2nd review**;
only then 5C (optional) → captions → remotion-builder → publish. Extra caption-time STT fixes
surfaced by the strategists are in `tighten-plan.json` notes (clip 4: "had LAB listed", "off of
LAB"; clip 1: ~3171.3 "your plays").

**Still open:** Mike's longform thumbnail PNG (`lf-20260802-what-if-1000x` thumb still null) ·
$WHATIF X handle for `persona.json`.

---

## 2026-08-02 — Wave 1 intake graph: built, committed, LIVE-BLESSED (with findings) on `what-if-1000x`

**Migration status:** Wave 1 (intake: Ph1 LOW BPS + Lane 1 longform + 1B verticalize + Ph2
transcribe/glossary/derivatives) is BUILT and committed (`a653faf`). Full plan + wave order:
`ORCHESTRATOR-PLAN.md` §"Livestream-repurpose migration plan (2026-08-02)". Canonical invocation:

```
python video-creation/livestream-repurpose/graph/run.py --source "<recording>" --min-sil 0.5
```
(prereq: `longform-meta.json` next to the recording; `--resume` after a kill; `--stub ok|fail`;
`--test-sandbox` for scratch runs; dashboard tab: LangGraph → Livestream on :8766)

### Live bless results (batch `what-if-1000x`, 65.8-min stream)

- **BLESSED live in the graph:** `encode` + `verify_encode` (66 min → 320 MB @ 0.81 Mbps,
  rename housekeeping fired correctly), and the halt topology (it caught a real failure).
- **THE FINDING — canonical desilencer stalled on hour-long files.** `desilence.py`'s render
  built ONE filtergraph with ~1,756 trim branches for 878 keep-spans → ffmpeg pegged a single
  core, ~17% output in ~110 min (hours to finish). Detection method was NEVER the problem.
  Root cause of the historical `longform_desilence_<batch>.py` forks: earlier sessions hit this
  wall and swapped the whole tool (including the banned single-threshold detection) instead of
  fixing the render transport.
  **FIXED same night in `desilence.py` (method untouched):** above 60 spans the render runs in
  seek-windowed batches (identical spans + 8 ms declick fades, parts stream-copy concatenated;
  `--render-batch N` to force, auto otherwise; small files keep the byte-identical single-pass).
  Validated vs single-pass reference (56.81s vs 56.79s = one AAC frame), then **proved live**:
  the same file that stalled for 2 h rendered in ~10 min (22 parts, 3945s → 2674s, -21.2 min
  of silence at min-sil 0.5). Also fixed: `desilence.py` stdout is now line-buffered (its
  progress used to buffer silently → the graph heartbeat looked stale during long renders).
- **Lane 1 DONE via the fixed renderer** (ran as a supervised driver after the stall recovery):
  staged `schedule-tweets/longform/what-if-1000x/` (44.6 min, 271 MB, 0.81 Mbps) + queued
  `lf-20260802-what-if-1000x` "What If We Could 1000x?" — **thumbnail NULL** (no PNG shipped in
  the media folder; Mike to drop one in, then patch the entry).
- **Ran OUTSIDE the graph** (manual driver, to recover wall-clock after the stall):
  verticalize (1080x1920 SAR 1:1 probe OK) + whisper (9,374 words / 44 chunks) + glossary
  (10 Casper→Kaspa, 2 tau→TAO, zero KRC20 flags) + parse/chunk. So the `longform`→`derive`
  graph nodes are NOT yet live-blessed end-to-end — **next stream runs the whole graph again
  for the full bless.**

### Wave 1 lessons → fold into Wave 2

1. **Lane 1 must be a parallel branch** (or last): the sequential graph put the longform render
   ahead of verticalize/transcribe and blocked the clips path for 2 h when it stalled.
2. Long-running node subprocesses must line-buffer (or be wrapped) so the heartbeat never
   starves; heartbeat staleness ≠ hang, but it must never be ambiguous.
3. Tool-timeout kills mid-generation leave in-flight browser work — detached launches with
   log/heartbeat monitors (the pattern used tonight) are the way to drive anything long.

### Batch `what-if-1000x` state (registered in batches.json, status active)

| Lane | State |
|---|---|
| Lane 1 longform | **QUEUED** (`lf-20260802-what-if-1000x`, thumb null — needs Mike's PNG) |
| Lane 2 shorts | **8 clips CUT, dashboard awaiting Mike's Phase 4b review** → `video-creation/shorts/what-if-1000x/dashboard.html` (5 topics; clips 1-5 long/solo 88-125s, clips 6-8 impact cuts 15-34s; STT caption fixes listed in `clip-plan.json` → `stt_garble_flags`) |
| Lane 3 text/image | **DONE except carousels** (see below); `pipelines.repurpose` deliberately still `pending` |

Lane 3 queued tonight: 6 X tweets (4 multi-line + 2 one-liners, all with QA'd images incl.
the `what-if.jpg` + `bittensor-tao.png` + `housecoin.webp` references) · 1 IG 4:5 companion
(TAO/KAS) · 2 YT text polls (October-bottom, KAS-vs-TAO) · 1 X poll (KAS-vs-TAO only; the
October poll is YT-only per the X topic filter) · 2 YT posts (~2.0k chars: whatif-vs-pepe,
1000x-math) · 2 threads (7 + 6 tweets, CTA-capped). Drafts in `repurpose/output/2026-08-02_*`.

### TOMORROW — pickup checklist (in order)

1. **Finish the carousels** (~15 min): item files at
   `video-creation/shorts/what-if-1000x/_lane3-carousel-items/l3-car-02..10.json`
   (Post A = v1 news-flash slides 01-05, Post B = v4 hook+data slides 06-10; slide 01
   `d948d2f0` already generated + on disk). **Slide 02 (`b6795e2f`) was in flight when the
   run was stopped — check the yt-posts pool chat for an already-finished image BEFORE
   re-sending (never double-generate).** Then per file:
   `node repurpose/gen-images.js --list=<file> --prefix=yt-posts` (one item per invocation —
   references attached).
2. **Wire `images[]`** onto the two yt-posts entries from
   `_lane3-carousel-items/l3-car-meta.json` (image_id/seq/slide_text mapping), spot-QA 2-3
   slides visually.
3. **Flip `pipelines.repurpose` → "done"** on `what-if-1000x` in batches.json.
4. **Mike's Phase 4b review** → delete calls by clip number → then per surviving clip:
   tighten-strategist → tighten → 2nd review → 5B desilence → (5C) → 6 captions →
   7 remotion-builder → 8 publish. (Normal manual flow; Waves 2-6 port these next.)
5. **Next livestream = full intake-graph bless attempt** (all nodes, no manual driver).
6. Follow-ups: Mike's longform thumbnail PNG (then patch `thumbnail_path`); $WHATIF X handle
   unknown → add to `persona.json` `project_handles` when known (Follow-line omitted tonight).

---

## 2026-08-02 (earlier) — Wave 1 built + sandbox-blessed

Ports: `encode_low_bps.py`, `verticalize.py` (skill ffmpeg frozen verbatim),
`longform_stage.py` (canonical desilencer, forks retired per Mike), `longs_append.py`
(replaces `_lane1_*.js`; em-dash + dup-id guards, `--if-absent` resume), 
`fix_transcript_glossary.py` (deterministic tier auto-fix; kaspy/kasy/kappy/kasper FLAG-only).
Graph: `graph/intake_graph.py` + `run.py` (12 nodes, verify-from-disk, halt topology, SQLite
checkpoints, stubs, sandbox). Dashboard: Livestream tab + `/livestream/` feeds (generic
multi-node focus graph added to langgraph.html). Sandbox e2e on 60s real audio: green; the
glossary caught a live Casper→Kaspa mishear on its first run; one bug found+fixed
(longs_append staged-root derivation + thumbnail cross-check in verify_queue).
Commit `a653faf`. Decisions of record (Mike): documented desilencer for Lane 1 · ChatGPT
browser stack ports LAST · one wave per real stream, port-first-then-graph.
