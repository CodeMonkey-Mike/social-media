# zebec (ZBCN) — PROJECT-LOG

_Decision trail + resume pointer for the "ZBCN: the good and the bad" longform-edited video._

## ═══ ✅ VERTICAL DELIVERED (2026-07-12) ═══
`_previews-vertical/zebec-VERTICAL-v1.mp4` (1080x1920, 458.7s, 2.0 Mbps, music -5dB). QA PASSED: audio parity
-15.8 LUFS (matches 16:9), concat seams (116.6s/283.3s) seamless, blackdetect only intentional (4 title cards +
2 chart fade-ins, none at seams), framing spot-checked per type (face center-crop, mobile receipts, vertical
containers/timeline/flows, 2-col scoreboard, native-vertical b-roll). Comp `ZebecVertical.tsx`, spine =
608x1080 center-crop (crisp), rendered in 3 chunks (kept in _previews-vertical/chunks). Vertical asset notes:
R9 = paywalled mobile -> r9-unlocks container fallback; CG1-5 generated NO-ref (16:9 ref forces landscape) so
they're recomposed not pixel-anchored; E8v = rocket exhaust (not full vehicle), E11v swapped (baked text), E6v
bright. NOT queued (separate deliverable, awaiting Mike's go).

## ═══ VERTICAL REPURPOSE — RESUME POINTER (2026-07-12, superseded by DELIVERED above) ═══
Deriving the 9:16 (1080x1920) cut per `longform-edited/skills/vertical-repurpose.md`. The 16:9 is APPROVED + queued.
**DONE:**
- Vertical containers (39 + `r9-unlocks` fallback): `assets/containers/containers-vertical.html` + `_render_vertical.js`
  -> `assets-vertical/deck/*.png`. VISUAL-QA PASSED 39/39. flow diagrams/timeline/curves re-laid-out vertical.
- Vertical charts: `remotion/src/zebecChartsVertical.tsx` (TractionScoreboardV, DemandVsFloatV, BuybackFlywheelV).
- Envato: 12 native-vertical clips -> `assets-vertical/video/E#v_*.cap.mp4`, staged normalized -> `render-assets-vertical/vid/E1-12.mp4`.
- Receipts (MOBILE view): R1/R2/R2B/R6/R8A/R10/R11 -> `assets-vertical/receipts/`; R9 was PAYWALLED (CryptoRank mobile)
  so uses the `r9-unlocks` container fallback. All staged -> `render-assets-vertical/receipts/`.
- Comp: `remotion/src/ZebecVertical.tsx` (id `ZebecVertical`, 1080x1920, reuses ZCOVERS + zebecCaptions + V charts +
  same 10 transitions). Registered in Root.tsx. Smoke-tested (container + chart frames render clean).
- `render-assets-vertical/` set up: deck(39) + charts + receipts(8) + vid(12) + spine.mp4 (FULL-RES ALL.c.desilenced.mp4).

**PENDING (resume here):**
1. ChatGPT vertical images CG1-5 (agent was running). CHECK `assets-vertical/images/` for CG1-5.png. If present +
   md5-distinct + on-brand -> `cp` to `render-assets-vertical/img/CG1-5.png`. If the agent FAILED/missing -> fall back:
   take the horizontal `assets/images/CG#_*.png` and letterbox/center-fit to 1080x1920 (sanctioned fallback, flag it).
2. Smoke-test one frame per beat: `npx remotion still src/index.ts ZebecVertical <out> --frame=<F> --public-dir ../longform-edited/media/zebec/render-assets-vertical`.
3. SPLIT-render (mind the ~14436 stitch ceiling; DUR=13756 so 2 halves ~0-6877 / 6878-13755 is safe), at `--video-bitrate=2M`
   (match the 16:9 final). Then STANDALONE ffmpeg filter_complex concat (NOT concat-demuxer).
4. Mix: reuse the 16:9 bed `_previews/mus/bed.wav` at -5dB (same as the approved 16:9 final):
   `[1:a]volume=-5dB,apad[b];[0:a][b]amix=inputs=2:normalize=0:duration=first` -> `_previews-vertical/zebec-VERTICAL-v1.mp4`.
5. QA per vertical-repurpose §5 (concat seam +-0.5s, blackdetect, framing spot-checks per type, audio parity). Run visual-qa on new assets.
6. Deliver `zebec-VERTICAL-v1.mp4` absolute path. Do NOT queue it until Mike says (separate deliverable).

## ═══ ✅ FINAL APPROVED (2026-07-12) ═══
**Deliverable:** `_previews/zebec-FINAL-2mbps.mp4` (1920x1080, 458.8s, 2.05 Mbps, music -5 dB). Mike APPROVED.
Thumbnail: Mike is making it. Video content is DONE.

**Reusable fixes made this session (so the pain doesn't recur):**
- `skills/container-reference/container-canonical.css` — the locked container stylesheet (copy, don't re-derive).
- `.claude/agents/shared/captions-builder.md` — captions ONLY via build_captions.py (montserrat, longform 2/4);
  `longform-edited/skills/captions.md` density corrected to 2/4; font = Montserrat (never hand-roll / copy an old comp).
- `.claude/agents/shared/visual-qa.md` — adversarial visual QA gate (opens every rendered asset: cut-off text,
  blank captures, wrong font, style drift). Builders must hand outputs to it before "done".
- `skills/lint-animated-charts.js` + charts.md rule — animated-chart beats must be live components in the draft too.
- HQ-pass items NOT done (draft-quality, if a true master is ever needed): full-res spine face beat (used 540p
  proxy), full-res Envato b-roll, container spotlight state-swaps, SFX risers/impacts + dynaudnorm music, receipt
  clean-crops, R8B real Sam-vs-Simon side-by-side (needs Mike's Simon source).

## ═══ RESUME HERE (session end 2026-07-12) ═══

**DONE 2026-07-12 (full autonomous pipeline run, Mike away):**
- **CONTAINERS REBUILT — all 38, canonical style.** The prior build was OFF-STYLE (Inter font, #2dd4bf teal
  accent, colored eyebrows, no divider, radial bg). Rebuilt ALL to the locked `presentation.md` system:
  Playfair serif headlines, DM Sans body, JetBrains Mono numbers, green #00e68a / cyan #00c2ff / gold #ffd700
  / red #ff4060 on #0a0c10, muted #505a6e eyebrow, green→cyan gradient divider. ONE locked stylesheet
  (`assets/containers/containers.html` + `_render.js`). Also caught + rebuilt a stale `zebec-stack` and added
  `sam-vs-simon` (R8B fallback). **Root-cause fix persisted:** `skills/container-reference/container-canonical.css`
  (copyable locked stylesheet) + README pointer, so this drift stops recurring.
- **CHARTS REBUILT — 3 (traction-scoreboard, buyback-flywheel, demand-vs-float)** to the same canonical style
  (`assets/animated-charts/charts.html`). Static PNGs for the draft; animate in HQ.
- **ENVATO LANE COMPLETE — E1-E10** all finished `.cap.mp4` (audio stripped, ≤100MB, no login walls). Note:
  E8 is the darkest cinematic liftoff, NOT literally a night launch (no true-night candidate existed).
- **MUSIC-PLAN.json** — Fable advisor (`.claude/agents/longform-edited/music-placement-strategist.md`, NEW)
  profiled Pins and Needles by waveform energy: full-track drops reserved for the two biggest beats (pillar
  reveal 215.5, verdict/finale ~422), 0:31 subtle loops under teaching chapters, breakdown-valley for "the bad",
  FACE dip, hard cold cut at end. Has 5 open questions for Mike (dynaudnorm vs constant gain, drop2 reuse, cold
  end, dip depth, level band).
- **RECEIPTS** — R3 (Medium migration) QA'd good; R1 (CMC pillar) draft-usable (HQ needs a clean supply-module
  crop, capture day-of-render); **R8B still needs Mike's 'Simon' source** — draft covers that beat with the
  factual `sam-vs-simon` container instead (no fabrication).
- **PLANS** — `EDIT-PLAN.md` (file-level manifest, zero orphans), `CUE-SHEET.md`, `BROLL-PLAN.md` generated off
  COVER-PLAN + MUSIC-PLAN (`_gen_plans.js`). All 65 beats mapped to real assets (`_map_covers.js`, 0 gaps).
- **COMP BUILT + GATE PASSED** — `remotion/src/Zebec.tsx` + generated `zebecCovers.ts` (65 covers). `lint-covers.js`
  EXIT 0 (65 covers, 15 distinct b-roll, all ≤4s, captions clear). Warnings are the known draft simplifications.
- **DRAFT RENDER v1 DELIVERED** → `_previews/zebec-draft-v1.mp4` (1920x1080, 458.7s, 200k, VO −15.8 LUFS + music
  bed under). QA'd across chapters (face beat, title cards, receipt, charts, end card, audio all good).
  RENDER GOTCHA (logged): a single background render got RECLAIMED-ON-IDLE (killed) — matches the standing
  memory. Fix used: built a 540p spine PROXY + 480p envato proxies (public dir 595MB→118MB, decode ~4x faster),
  then rendered in 3 FOREGROUND frame-range chunks (~5min each, under the 10min cap) + ffmpeg concat + amix.
  Music bed = `_previews/mus/bed.wav` (6 segments per MUSIC-PLAN, drops aligned to pillar 215.5 + finale ~422).
  NOTE: the draft face beat is soft (540p proxy); the HQ render uses the full-res spine.

**DRAFT SCOPE / deferred to HQ (flagged, not hidden):** chapter title-card 1s AUDIO pauses (draft uses overlay
cards, sh()=identity); animated charts (static PNGs now); container spotlight state-swaps (one composed state
each); SFX risers/impacts + per-frame music ducks + dynaudnorm (draft = constant-gain beds, drops aligned);
receipt clean-crops; R8B real side-by-side. See EDIT-PLAN.md "Deferred to HQ pass".

## ═══ v2 DRAFT (2026-07-12, after Mike's review of v1) ═══
Delivered `_previews/zebec-draft-v2.mp4` (1920x1080, 458.7s, 200k). Fixes from Mike's v1 notes:
- **White screen 2:56-3:02** — R4 Nacha capture was a blank WHITE page (nacha.org white bg). Replaced with a
  clean dark `nacha-member` container.
- **3:30 "slide"** — `the-knock` had a heavy bordered card box; rebuilt as a clean container-only beat (no box).
- **6:59 chart** — `demand-vs-float` (and `traction-scoreboard`) are now REAL animated Remotion components
  (`zebecCharts.tsx`, draw-on curves + count-up numbers via useCurrentFrame), not static PNGs.
- **Last-2-min b-roll** — added E11 (phone-tap NFC) + E12 (digital-network sci-fi) as ~4s cutaways splitting
  other-way-around + still-has-to in CH5.
- **Captions** — word-level captions over the 0:00-0:31 hook (on covers, deliberate) + the 45.3-52.86 face
  scene (`zebecCaptions.ts`).
- **Transitions** — (1) three-bucket policy now applied: glitch ingress on ChatGPT stills, film-burn on face,
  fade on video, cross-fade+scale on containers. (2) 10 LIBRARY transitions (6 OFFSET + 2 DEVIATION + 2 EXPAND)
  from assets/transitions/library.json placed at image->image boundaries. Full plan: `TRANSITIONS.md`.
- Fonts loaded via @remotion/google-fonts (Playfair/DM Sans/JetBrains Mono, weight-limited).
RENDER: 4 foreground chunks (chunk-0 with the hook/glitch/scoreboard cluster ~9.7min; others ~3min) + concat +
music amix. NOTE: E11 phone-tap clip is bright/white-bg (slightly off dark tone) — candidate to swap. R8B Simon
source + the 5 MUSIC-PLAN questions still open for Mike.

## ═══ (previous) RESUME (session end 2026-07-11) ═══

**DONE today:** final spine (`spine/ALL.c.desilenced.mp4`, 7:38.5, burst-cleaned) + regenerated word
transcript + `TRANSCRIPT-BREAKDOWN.md` · `AS-RECORDED.md` (build-to-transcript) · CTA resolved (mid-CH4
"click that like button" only; ends on "a vertical ZBCN") · **coverage plan** `COVER-PLAN.json` (65 beats,
receipts-first, 10 Envato + 5 ChatGPT, zero-orphans) · **receipts captured** to `assets/receipts/` (8 good;
see pending below) · **chart mockups** `assets/animated-charts/` (traction-scoreboard, buyback-flywheel,
demand-vs-float) · 4 **container mockups** `assets/containers/` (history-timeline, payroll-stream,
competition, business-vs-token) · **music downloaded + registered**: Pins and Needles (Tide Electric, song
11370) in `video-creation/assets/music/Pins and Needles/` — full 3:10 mp3 + 3 instrumental cuts (0:15/0:31/0:47),
yt_license_code `OHDCFZTRWTRSWAFM` in `assets/music/library.json`.

**⏳ IN-FLIGHT background agents (launched end of session — CHECK THEIR OUTPUTS FIRST tomorrow):**
1. **Container mockups** → building the remaining ~30 containers from COVER-PLAN.json into `assets/containers/`.
2. **Envato videos** → downloading the 10 clips into `assets/video/` (may have hit a login wall — check).
3. **ChatGPT images** → generating the 5 into `assets/images/` (login-guarded; verify md5s are distinct).

**NEXT STEPS (in order):**
1. QA the 3 agents' outputs (container PNGs no-overflow; Envato 10 clips real; ChatGPT 5 images distinct/on-brand). Re-run any that hit a login wall.
2. **Build + run the Fable MUSIC-PLACEMENT advisor** (new agent, like coverage-strategist): given Pins and
   Needles (3 instrumental cuts + full 3:10 track, 122bpm, F minor, "Fun/Scary"), propose where to place
   aggressive vs subtle segments across the 7:38 timeline — full track vs sections vs remix-expander/stretch,
   carve by waveform energy. (This is the thing Mike is most eager to see.)
3. Finalize 2 pending receipts: **R8B** Sam-vs-Simon (needs Mike's "Simon" source + re-verify the REAL current
   CEO) · **R3** migration (eyeball the Medium capture, Cloudflare risk). R8A founder → use the `backers` container (decided).
4. Assemble `BROLL-PLAN.md` + `CUE-SHEET.md` + `EDIT-PLAN.md` off COVER-PLAN.json + the transcript, priority
   order receipts → diagrams → videos → images → containers.
5. Build the Remotion comp (`comp-build.md` Phase 4), lay in the music beds, render, QA.

**Notes:** `download-alt` search-bug — it clicks the FIRST search result, so pass an artist-specific `--query`
(plain title grabbed the wrong track). New agents created this session: `shared/burst-removal`,
`shared/transcriber`, `longform-edited/coverage-strategist`. Receipts-first placement rule persisted in
`skills/broll-and-containers.md`.

## Coverage plan priorities (Mike, 2026-07-11) — for the next phase
Near-all-cover video (face gated to one beat), so cover assets carry the whole visual. Priority order:
1. **RECEIPTS / REAL CHARTS FIRST** — real site screenshots + real data. Top ask: the **CMC token-unlocks
   chart** (and/or the **TradingView** chart); plus CMC price/supply, Nacha members page, USD1, founder/CEO.
2. **10 Envato video b-roll + 5 ChatGPT image b-roll** (hard budget) on the atmospheric/conceptual beats.
3. **Containers** (deck CSS cards, system-design diagrams, timelines) + **our own ANIMATED charts** for the
   numbers we control (traction scoreboard, buyback flywheel) — never an image model as the source of a number.
**Architecture decision:** ONE **coverage-strategist Fable/max advisor** (read-only, returns a JSON per-beat
cover proposal, receipts-first, respecting the 10+5 budget) — NOT one agent per asset type (they'd compete
for the same beats/budget → double-coverage + gaps). Orchestrator + Mike refine it into BROLL-PLAN/EDIT-PLAN.
Execution stays mechanical: receipt capture (headless Chrome), envato-broll skill, ChatGPT gen, container/
chart building (orchestrator). **Advisor CREATED 2026-07-11: `.claude/agents/coverage-strategist.md`**
(Fable/max, read-only, returns a per-beat JSON cover proposal, receipts-first, 10+5 budget, zero-orphans).
To RUN when Mike gives the word (post transcript review).

## ⚠ RESOLVED — CTA (see resume pointer): mid-CH4 "click that like button" is the only CTA
The take ends cold on "a vertical ZBCN"; the only CTA is a mid-CH4 fragment ("nothing is financial advice,
do your own research, click that like button"). Options (AS-RECORDED "Divergences"): (1) re-record a short
sign-off to splice on (recommended), (2) end-card CTA graphic over the trail-off (no new VO), (3) ship as-is.

## Spine-prep pipeline results (2026-07-11, all via sub-agents)
- **Phase 1 (LOW BPS):** raw `raw/2026-07-11 16-58-34.mkv` (32:02, 1.46GB) → `zebec LOW BPS.mp4` (517MB, 2Mbps).
- **Defumbler agent:** → `zebec EDIT.mp4`, 1322.1s (~22 min), 37 cuts, drift 9ms, QA clean. Flags: lots of
  ad-lib/divergence; content losses ("undiscovered gem", explicit "VC-not-fair-launch" phrasing, "2023" date);
  kept "I am bullish" over "a little bullish"; NO CTA recorded.
- **Cover-blackout agent:** → `zebec EDIT.blackout.mp4`. ONE face window (per override) at 110.7–128.9s
  (pre-desilence) = the "anchor is gone/unlocks over/entire supply out" line; 99% blacked; audio MD5 identical.
- **Desilencer agent — loose 800ms pass (Mike reviewed):** → 471.67s. Superseded by the final below.
- **Desilencer agent — FINAL two-zone (Mike, after listening to file C):** `--split 181 --sil-pre 0.25
  --sil-post 0.6` (CH1 250ms / body 600ms). → `spine/ALL.c.desilenced.mp4`, **459.53s (7:39.5)**, removed
  863s/65% across 125 cuts, QA clean (zero swallowed speech). Map: `spine/ALL.c.desilenced.map.json`.
  **FACE window now ~45.3–52.9s** in the final spine. Flag: 65% is a big cut, Mike may want a final human
  ear pass before Remotion.
- **Burst-removal (new agent, ran via general-purpose this session since not hot-loaded):** removed a grunt
  @~52.86s (0.193s, at the FACE-window tail, head-jump masked by the black cover after) + a phone noise
  @~299.86s (0.8s, in blacked cover). Both verified on-file (join = silence valley, Whisper reads both words
  whole). Backup `spine/ALL.c.desilenced.mp4.bak-burst.mp4`. New agent: `.claude/agents/shared/burst-removal.md`
  (Opus/medium). Net −0.993s → 458.54s.
- **Final transcription (new transcriber agent, ran inline this session):** word-level on the burst-cleaned
  spine → `spine/ALL.c.desilenced.medium-words.json` + corrected human breakdown `TRANSCRIPT-BREAKDOWN.md`.
  New agent: `.claude/agents/shared/transcriber.md` (Opus/medium, shared). Chapter openers (burst-cleaned):
  CH2 76.2s · CH3 151.3s · CH4 268.3s · CH5 392.8s · END 458.5s; FACE window 45.3–52.86s. Mishears corrected:
  ZBank/ZBCM→ZBCN (×6), Thapalia→Thapaliya, "mean coin"→meme coin, "JP Morgan in Circle"→and.

## Files in this folder
- `DATA.md` — the full up-to-date (2026-07-11) ZBCN investigation, every figure + sources, `[VERIFY]` flags.
- `SCREENPLAY.md` — 5-chapter outline draft (Convention-5 tagged lines, gated FACE/COVER, no em dashes).
- `COIN-INVESTIGATION-CHECKLIST.md` — reusable "how to investigate any coin" framework (Mike asked to save
  this for future coin videos; seeded from the ZBCN work + the reference videos).
- `PROJECT-LOG.md` — this file.

## Decisions
- **2026-07-11 — Topic + framing.** Video is an honest, BULLISH investigation of ZBCN, the good AND the
  bad, landing on WHY Mike is bullish. Spine = "separate the business from the token." Still shows the bad
  honestly (that's what makes the bull case credible), but weighs it and lands bullish.
- **2026-07-11 — Mike's review decisions (folded into the draft):**
  1. **BULLISH lean**, and **emphasize the no-more-token-unlocks pillar** throughout (it's now the CH1
     hook flip, the CH3 centerpiece, and the CH5 verdict crux).
  2. **Supply source = CMC** (Mike's call). CMC shows circulating ~99.99B of a 100B max (~99.99% out) →
     resolves the earlier discrepancy AND confirms "no more unlocks." Old "60.8B unlocked" figure = stale,
     ignore.
  3. **CEO Sam-vs-Simon discrepancy is called out ON SCREEN** (CH4 Beat 7) as a small "thing I don't love"
     (present factually, not as an accusation).
  4. **Title = "ZBCN about to go vertical?"** (open question → keeps upside conditional, native engagement bait).
- **2026-07-11 — PER-VIDEO FACE OVERRIDE (Mike, THIS VIDEO ONLY, not the norm).** Pollen-allergy flare →
  minimize face. Converted every `[FACE]` beat to `[COVER]` EXCEPT one: CH1 Beat 3, "As of 2026, that
  anchor is gone. The unlocks are over. Basically the entire supply is already out." Everything else is
  voice-over containers/receipts/b-roll. NOT persisted to the skill/memory (standing rule = gated-sparse
  face per screenplay.md Convention 3); reverts next video.
- **2026-07-11 — RECEIPTS/SCREENSHOTS plan added (Mike asked).** Video shows real credible-source
  screenshots (CMC tokenomics/supply = the key one, plus price page, Nacha page vs Zebec's inflated tweet,
  USD1, traction source, CEO Sam-vs-Simon, vesting). Full R1-R9 table in SCREENPLAY "Receipts / screenshots
  plan." Capture to `media/zebec/screenshots/` (headless-Chrome, full-width readable); grab the live/price
  ones the DAY OF RECORD so numbers match. Even more important now that face is minimized (receipts = a
  primary cover layer).
- **2026-07-11 — ACCURACY FIX (Mike caught it): age + drawdown must be split-aware.** The ZBCN token only
  started trading **April 10 2024** (the chart starts there), so DON'T call the *token* "four years old";
  say the **company** is ~4 years old (2021) and the **ZBCN token** has traded ~2 years. Also dropped the
  **"-98%"** claim: it's an invalid unadjusted ZBC-vs-ZBCN comparison. Defensible drawdown = **~-69%
  on-chart** (from the $0.0071 May-2025 ZBCN high) or **~-58% split-adjusted** from the 2022 peak (today is
  ~flat vs the 2022 launch price). Turned this into an on-screen "the chart doesn't tell the whole story"
  angle. Full math + the two-token timeline in DATA.md §0/§3; verified dates `[S15]`.
- **2026-07-11 — Structure.** 5 chapters: CH1 hook (paradox → the flip), CH2 product, CH3 the good (unlocks
  pillar), CH4 the bad (weighed, not dealbreakers), CH5 why-I'm-bullish + reusable framework + CTA.
- **2026-07-11 — Register.** gear-3 epic on CH1 + CH5 verdict; gear-2 explainer for CH2-CH4 mechanics.
  Gated full-screen face spine (house rule #6), face sparse.
- **2026-07-11 — Key honesty rails (see SCREENPLAY do-not-say box):** bullish but NOT a promised price
  target (conditional); NOT dressed up as a forever "maxi" hold like KAS; skepticism attributed not
  asserted; Nacha claim stated accurately (member of a 20-per-quarter working group, NOT a "governing
  seat"); pair sub-cent price with market cap; all numbers `[VERIFY]` live off CMC.

## Research highlights (full detail + sources in DATA.md)
- **GOOD:** ~$47M/mo payroll (~$500M/yr), ~12.6K employees, ~239 enterprise clients; Zebec Card ~$60M
  annualized in 97 countries; ~106K holders; Nacha Payments Innovation Alliance member; USD1 (World
  Liberty / Trump-family) payroll for 65K+; VC-backed (Circle, Coinbase, Solana Ventures, $28M+); final
  unlock March 2026 → deflationary buyback/burn (~+70% annualized buyback).
- **BAD (weighed, not dealbreakers):** price ~$0.0022, mcap ~$221M (CMC); drawdown ~-69% from the ZBCN
  2025 high (on-chart) or ~-58% split-adjusted from the 2022 ZBC peak (NOT -98%, see below); ~100B supply
  (sub-cent optics: a "10x" = a $2B cap); ZBC→ZBCN 1:10 rebrand + narrative pivots; burns NOT verifiable
  on-chain; inflated Nacha marketing; VC-not-fair-launch; CEO name unclear (Sam vs Simon); public "rug"
  skeptics + opaque 2023 reacquire; older on-chain red flags (thin liquidity / whale distribution / app /
  GitHub) → re-verify live.
- **✅ SUPPLY RESOLVED** (DATA.md §0): CMC = ~99.99B of 100B max circulating → effectively fully out, no
  more unlocks. This is the bullish spine.

## Open items
- Mike review (chapter map / thesis / verdict lean / title / thumbnail).
- Finalize `COIN-INVESTIGATION-CHECKLIST.md` with the reference-video creators' points.
- Music beds + bed→card map; then record → Phase 1-4.
