# Kaspa Founder: Genius or Over-Rated? — PROJECT-LOG

_Decision trail + resume pointer for this longform-edited video. Read this first when resuming._

---

## ▶ RESUME POINTER (where we are, 2026-06-30)

**Phase:** spine is recorded and cleaned; NOT yet edited in Remotion.

**Current locked spine:** `spine/kaspa-genius.f.final.mp4` (~9:35, review THIS file). It is the gated-face VO
spine: defumbled → cover-blackout (black over COVER beats, face only on the ~15 FACE beats) → 4 throat-clears
cut (audio+video) → two-zone desilence (210 ms intro / 600 ms body) → **1 s black+silent pause inserted after
the plug** (between "now" and "So papers are cheap"; verified pure black + -100 dB).

**2026-06-30 FIX — the "and why / So" throat-clear (Mike's 1:18 in `.d.cleaned`, = ~1:10 in `.f.final`):** the
earlier "1:18 cut" did NOT actually remove it — it survived into `.f.final` (audible + a visible look-away).
Now removed for real on ALL three downstream files (`.d.cleaned` 78.665→78.865, `.e.desilenced` &
`.f.final` 70.735→70.955), sync-safe `filter_complex` jump-cut. **Verified:** Whisper now reads
"...land and why. **So** where does this guy come from" with no clear; RMS at each join is a clean
−55/−107 dB silence valley (burst was −17 dB); both words intact. f.final 576.06 s → 575.88 s. Originals
backed up as `*.bak-throat.mp4`. **Residual:** because he says "So" while his head is still recovering from
the look-down, the hard cut leaves a small head-position jump — to be MASKED by the CH face-cut glitch
(Blocks·Max) in the comp (or match-cut if Mike prefers; see note in the throat-clears section).

**Immediate next steps (in order):**
1. ✅ DONE — 1 s pause after the plug, before "So papers are cheap" (in `.f.final.mp4`).
2. **+1 s pause before CH2 and CH4** (the only two chapters with title cards, music-continuity rule). These
   are title-card pauses — house rule #11 says the COMP does this (freeze the spine frame + 1 s silence at
   the chapter's first spoken word). Can live in the comp rather than the spine.
3. ✅ DONE (2026-06-30) — **timecoded `CUE-SHEET.md`** built against `f.final` from the real Whisper take
   (build-to-transcript). Chapters/beds/title cards/FACE beats/assets all on real `M:SS.s`. Flags the two
   R-TALK inserts (final ≈ 10:00) + the one asset gap (father Haim photo). Awaiting Mike's review.
4. **Build the Remotion edit** + render a draft. Transition scheme Mike specified: ONE glitch (Blocks·Max
   from `assets/transitions/library.json`) for ALL face cut-ins; ONE Remotion transition per asset TYPE,
   consistent (one for all ChatGPT stills, one for all CSS containers, one for all Envato clips, one for all
   charts); ONE chapter-card transition (cube) for CH2 + CH4; **captions on the intro (CH1)** per the
   captions skill; music beds + sparse SFX.

---

## 2026-06-30 — FULL-VIDEO REBUILD after Mike's review (rule violations)
Mike caught: whole bio SLIDE shown (not a single container) @1:59/2:12/2:20/5:12; the Ethereum-whitepaper
receipt + the GHOST diagram REPEATED where irrelevant; the bed NOT ducking under the R-TALK talk; and the CH4
card pause splitting "ago" mid-word. All confirmed against the rules (longform-edited.md:197-207 container=ONE
sub-point; SCREENPLAY.md:259 bed stops under the clip; longform-edited.md:393 pause in the silence). Fixes:
- **Containers, not whole slides:** re-screencapped the 13 deck slides, **split s2 into `s2-bio` + `s2-path`**,
  content-cropped each to fill the frame (`render-assets/deck/`). Cover plan now uses the RIGHT container per beat.
- **Variety:** R-WP down 5x→2x (CH1 preview + the ONE real CH3 "Modified GHOST Implementation" citation);
  s3 removed from CH4 (CH4 = s8 lineage / s10 co-authors / s4 acronym / s5 SPECTRE / s6 GHOSTDAG); CH5-CH7
  wired with s7 launch / s8 lineage / s9 cited-gap / s10 co-authors / C-MCAP / s11 verdict / s12 close.
- **Card pause fix:** RMS found the real silence trough — CH4 "ago|Now" is at **245.47s**, not Whisper's 245.26
  (which was inside "ago"). Re-baked spine `kaspa-genius.h2.spine.mp4` (610.93s) with the pause moved; INSERTS
  updated. CH2 70.76 already on its trough.
- **Linter extended** (`skills/lint-covers.js`): now also WARNs on CONTAINER SCATTER (>2 spots) + LONG HOLD (>35s)
  so the whole-slide / repeated-slide class can't pass silently. Gate doc updated.
- **Render:** full video `_previews/full-v1.mp4` at 0.2 Mbps; then 3 beds mixed WITH ducking under both clips.
- Remaining (flagged by linter WARNs, honest): s5/s6 diagrams hold 45-48s — need sub-spotlight animation (progressive
  reveal); a few s8/s10 callbacks could consolidate. Diagrams holding while explained is allowed; the animation is polish.

## 2026-06-30 — CSS CONTAINERS REBUILT STANDALONE (Mike: deck-cropping was the regression)
Mike compared to his early videos (banks-own-chain YT N8LNdp2lfBg, bittensor `renders/bittensor-FULL-v8-sfx.mp4`)
where containers were clean. Root cause: those BUILT one self-contained container per beat; I'd been CROPPING the
multi-card `Kaspa-founder-deck.html` (drags in the floating slide headline, off-center card, forced repeats).
Fix — built **`assets/deck/containers.html`**: 9 standalone full-frame containers (`c-bio`, `c-path`, `c-acronym`,
`c-launch`, `c-lineage`, `c-citedgap`, `c-coauthors`, `c-verdict`, `c-close`) + a `b-chain` single-file Bitcoin
visual, each LEFT-aligned with its own eyebrow + serif headline + body/structure. Rendered each to
`render-assets/deck/`. Diagrams (`s3/s5/s6`) + `C-MCAP` kept as system-design slides. Cover plan rewired:
new containers, contiguous (not scattered), intro DAG→chain, **2017 meetup still** after "watch this" (`MEETUP-still`
re-grabbed from clipA, not the source's MACROSCAPE title). Reference screenshots + rules saved to
`skills/container-reference/` so the look can't drift ([[feedback_build_containers_standalone]]). All 4 gates pass.

## Spine pipeline (files in `spine/`)
`raw/2026-06-29 20-38-04.mkv` (35:29 master, never edit/delete) → `kaspa-genius LOW BPS.mp4` (2 Mbps proxy) →
`.a.defumbled.mp4` (retakes removed, 46 cuts) → `.b.blackout.mp4` (81% blacked, face gated) →
`.c.desilenced.mp4` (first pass, 2000 ms) → `.d.cleaned.mp4` (4 throat-clears cut audio+video) →
**`.e.desilenced.mp4`** (final 210/600, the locked spine). `.e...map.json` = cut/keep map for re-timing comp cues.

**Throat-clears removed (Mike's review):** 1:18 (the "and why / So" look-away — **re-cut for real 2026-06-30,
see Resume Pointer**; the original "1:18 cut" had missed it and it leaked into `.f.final`), 5:05 (after
"acronym"), 6:55 (after "Casper"), 8:44 (after "uncle reward"). **The method is now its own canonical
skill: `video-creation/skills/burst-removal/burst-removal.md`** (+ `scripts/burst_profile.py`) — a
reported burst is CUT on both tracks from end-of-word-A to start-of-word-B (jump-cut, edges snapped into
the silence troughs), NEVER blacked-with-audio-kept, and **VERIFIED on the actual output file** (RMS at
the join + Whisper across it) — never marked done off the cut-plan. defumbler/desilencer now cross-link it.

**Head-jump at the throat-clear cut is COVERED by the CH1->CH2 title card (Mike, 2026-06-30 — resolved).**
The cut lands exactly on the CH1->CH2 boundary: "...land and why." ends CH1; **"So where does this guy come
from?" is CH2 Beat 1** (title card ON "Who Is He, Actually", music bed change Revenant->Press Play). So in
the comp this join gets the **title-card treatment** — freeze the last CH1 frame (~70.73, head up, a clean
freeze) + the **+1 s title-card pause** (house rule #11) + the cube chapter-card transition + bed change. That
pause/freeze + card sits between the two head positions, fully absorbing the head-up->head-down change.
**=> NO glitch and NO match-cut here** (Blocks·Max glitch is for mid-chapter FACE cut-ins only). The clean
hard cut (everything between "why" and "So" removed) stays as-is. Build the CUE-SHEET/EDIT-PLAN accordingly.

## Docs in this folder
- `SCREENPLAY.md` — the script (tagged-line format, Convention 5; FACE/COVER, SHOW/NOTE/VERIFY).
- `EDIT-PLAN-prep.md` — beat-indexed pre-record plan (Layer model + per-beat Face/Visual/Transition).
- `BROLL-PLAN.md` — b-roll acquisition worklist + status.
- `CUE-SHEET.md` — layer-grouped watch-along (pre-timecode; to be re-built timecoded post-lock).
- `DATA.md` — chart-source index + market snapshot for the 2 charts.

## Assets (all under `assets/`)
- **Deck (container source):** `assets/deck/Kaspa-founder-deck.html` (13 slides: split, bio+timeline, GHOST/
  SPECTRE/GHOSTDAG diagrams, acronym, launch-terms, lineage, cited-gap, co-authors, verdict-stack, close).
- **Charts (stills, to animate in Remotion per `skills/charts.md`):** `assets/charts/CH1_C-RANK_*` (ETH #2 +
  GHOST callout), `CH6_C-MCAP_*` (Kaspa small vs larger). Numbers `[VERIFY]` at render.
- **AI clip:** `assets/broll/ai/CLIP-DAG.mp4` (Seedance 480p blockDAG, silent) + its source PNG.
- **ChatGPT stills (7):** `assets/broll/chatgpt/` — SCHOLAR, OTHERDAGS, ORIGIN, RESEARCHER-CHALK, JOURNALS,
  AHEAD-OF-CROWD, DATA-STREAMS.
- **Envato clips (2, silent, 1080p):** `assets/broll/envato/` — BR-NETWORK-blocks, BR-DAWN-sea.
- **Talk clips (the 2017 receipt):** `assets/captures/R-TALK_KevinChen_PencilWorks_2017.mp4` (full) +
  `clips/R-TALK_clipA_GHOST-credit.mp4` (CH3 insert) + `clips/R-TALK_clipB_SPECTRE-credit.mp4` (CH4 callback).
- **Receipt:** `assets/captures/R-ETH-whitepaper.png` (shows "Modified GHOST Implementation"). IACR eprint
  paper pages are Cloudflare-blocked (for-later if needed).
- **Portrait:** `assets/img/IMG-YS-clean.png` (Nano Banana cleanup, unbranded studio headshot — USE this one).
- **Family:** `assets/img/IMG-FAM-grandfather-David.jpg` (grandfather). Father **Haim** photo still needed.

## Key decisions
- **Family lineage GREENLIT** (Mike sources the photos; basis is the woolypooly profile). Keep on-screen
  wording factual; do not overclaim. Still need a Haim (father) photo.
- **Title cards: CH2 + CH4 ONLY** (music-continuity rule — a card lands only on a music-bed change).
- **Captions: ON for this video (Mike, 2026-06-30).** Override of the longform >5s-only gate: caption EVERY FACE
  moment regardless of length, montserrat 1/2, EXCEPT the plug. **FACE scenes ONLY — no intro-montage-over-b-roll**
  (Mike refined 2026-06-30). 15 caption windows + CORRECTIONS in `CUE-SHEET.md`. (Longform default stays OFF.)
- **Plug: >50% covered by CryptoRich website screenshots (Mike, 2026-06-30)**, face exposed <50%, NO captions on
  the plug. Screenshots NOT on disk yet — capture cryptorich.vip (showcase/calls).
- **Music plan:** CH1 Revenant · CH2-CH3 Press Play · CH4-CH7 I Will Deliver (codes in `assets/music/
  library.json` + screenplay; YT-description only). Bed changes CH1->CH2 and CH3->CH4.
- **CH4** introduces SPECTRE properly (most viewers have never heard of it); candidate to split into SPECTRE +
  GHOSTDAG chapters if it runs long.
- The "haters are everywhere / he's not a messiah, of course" lines (CH6 concession) are improvised (not in the
  screenplay) — kept; easy to trim if Mike dislikes.

## Open / for-later
- ✅ Father **Haim** photo (`img/IMG-FAM-father-Haim.png`, Wikimedia). ✅ CryptoRich plug screenshots
  (`captures/cryptorich/`, home + showcase). · IACR paper screenshots (blocked). · Live `[VERIFY]` pass on all stats at render.
- ✅ **THUMBNAIL FINAL (2026-06-30):** `Kaspa-Origin-Story-THUMBNAIL.png` (+ `-1280x720.png`). "Kaspa's ORIGIN
  STORY / IT'S NOT WHAT YOU THINK" (NOT in green), serious Yonatan pointing, original dark Kaspa coin, STORY box
  recolored yellow→Kaspa-cyan. Built via Higgsfield Nano Banana (face) + code (coin-lock, box recolor). Lesson:
  minimal change, lock the correct element, code over AI for recolors ([[feedback_image_tweak_minimal_change]]).
- CH4 split decision. · 2-3 more Envato b-roll if wanted (curated picks in BROLL-PLAN).
