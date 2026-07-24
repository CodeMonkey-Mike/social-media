# Save Tokens with Sub-Agents — PROJECT LOG

**Channel:** AI Engineering Simplified (@aiEngineeringSimplified). **Video 3.**
Pure MIKE-CLONE VO over full-frame containers (no face), same format as `need lang-graph`.

## Status (2026-07-16)

| Stage | Status |
|---|---|
| OUTLINE.md | ✅ (raw source; kept, not edited to match the reframes) |
| SCRIPT.md | ✅ **3-LANE / ROSTER + ROADMAP cut** — 10 chapters / 22 chunks, ~6.5 min. Token numbers are Mike's own workflow estimate (~200K → ~130-140K, ~30%), NOT the audited session table. Roadmap (ch7) is aspirational + clearly labeled. |
| Accuracy pass (pre-VO gate) | ⬜ NOT RUN YET — mandatory before any VO. Priorities listed in SCRIPT.md CAUTION block (pricing c11, roster values ch6, roadmap-is-aspirational c18-19, effort ladder c13, frontmatter c22, personal-estimate numbers c2/c20). |
| Channel infra | ✅ Created this session: `ai-engineering/CLAUDE.md` (master router) + `ai-engineering/skills/deck-and-containers.md` (thin skill inheriting longform-edited). |
| **Containers (deck)** | ✅ `deck/containers.html` — 22 full-frame containers, one per chunk. Canonical CSS reused from need-lang-graph + new components (roster table, pricing table, dials, before/after bars, PLANNED rows). |
| Container render | ✅ all 22 → `render-assets/container-01..22.png` @2x (3840×2160) via `scripts/render-containers.js`. |
| Container visual-QA | ✅ DONE — visual-qa agent: **22/22 PASS, 0 fails**. 3 advisories all applied 2026-07-16: en-dash→hyphen in token ranges (c02/c06/c20), PLANNED rows dimmed + pills desaturated so they can't be mistaken for shipping config (c18/c19), fable pill gold everywhere incl. c10 dial. Re-rendered c02/06/10/18/19/20 + re-verified c18/c20 by eye. |
| Accuracy pass (critical claims) | ✅ DONE 2026-07-16 — pricing (Fable $10/$50, Opus $5/$25, Haiku $1/$5), model names, effort ladder, model IDs verified vs canonical `claude-api` skill. No wording changed. |
| tts-chunks.json | ✅ 22 chunks, DERIVED VERBATIM FROM SCRIPT.md + pronunciation/caps. ⚠️ **First build (2026-07-16) was authored from a stale draft — 10 chunks (1-7,10,11,12) had wrong text; rebuilt from SCRIPT.md and gate-verified `ALL 22 MATCH`.** |
| MIKE-CLONE VO capture | ✅ DONE 2026-07-16 — all 22 via `_batch-generate.js` (MIKE-CLONE / Seed Speech), `audio/chunk-01..22.mp3`, manifest `audio/_manifest.json`. **10 wrong chunks regenerated + swapped in** after the drift was caught. |
| VO whisper-QA | ✅ **22/22 match SCRIPT.md** (re-QA'd against SCRIPT.md, not tts-chunks). Zero hallucinations/clips; THAT/KIND read clean; FAY bull→Fable, OH pus→Opus correct; c4's "200,000 tokens" sentence present; durations sane. Mike's ear still final judge of tone. |
| ⛔ LOCKDOWN (2026-07-16) | New gate `skills/higgsfield-voice/verify-tts.js` + `_batch-generate.js` 3rd-arg SCRIPT gate: aborts before spending credits if tts-chunks drift from SCRIPT.md. Rule documented in ai-engineering/CLAUDE.md "Voice capture flow"; memory `feedback_tts_chunks_gate_against_script`. |
| VO delivery review (Mike, by ear) | ✅ APPROVED 2026-07-16 — all 22 chunks. Fixes during review: c9 pause after "light" killed via `light-MECHANICAL` hyphen compound; c11 "route"→plain `ROUTE`, "Opus"→plain `Opus` (respellings were CAUSING the errors — plain common words work best; don't over-respell). |
| Remotion comp + timeline | ✅ 2026-07-16 — VO stitched `audio/full-narration.mp3` (354.7s), timeline `remotion/src/saveTokensTimeline.ts` (10688 frames @30fps), comp `remotion/src/SaveTokens.tsx` registered in Root, smoke-tested. Built from the NEW self-contained skill `ai-engineering/skills/remotion-explainer-build.md` (not from a sibling project). |
| Draft render (VO-only @300k) | ✅ DONE + **Mike APPROVED sync+tone** 2026-07-16. `…-draft-300k.mp4` (354.7s). |
| Final render (2 Mbps + music) | ✅ DONE 2026-07-16 → `Save tokens by using sub agents-final-2mbps.mp4` (356.2s, h264 2.0 Mbps, 93 MB). Corporate bed (canonical `assets/music/corporate/dmitriysimf_...`, staged as render-assets/music-corporate.mp3) mixed at 0.056 (same as prior video). QA: blackdetect none; audio −16.5 dB mean / −0.9 dB peak (no clip); CTA tail restored. Driver `scripts/render.sh` MODE=final. **UPLOAD-READY** (Mike uploads to @aiEngineeringSimplified manually). |
| Thumbnail | ✅ APPROVED by Mike 2026-07-16. |
| 9:16 vertical repurpose | ✅ DONE 2026-07-16 → `Save tokens by using sub agents-VERTICAL-v1.mp4` (1080x1920, h264 2.0 Mbps, 356.2s, 97 MB). 22 containers reflowed to portrait (`deck/containers-vertical.html` → `render-assets/vertical/container-NN.png`, build-agent + spot-QA: fan-outs stacked vertical, roster tables fit-width colgroup, PLANNED rows preserved, text byte-identical). Comp `remotion/src/SaveTokensVertical.tsx` (reuses timeline+VO). Rendered `scripts/render-vertical.sh`; audio = 16:9 final's stream copied verbatim (parity EXACT −16.5/−0.9 dB). QA: blackdetect none, framing/sync spot-checks pass. SEPARATE deliverable — stage to vertical platforms only on Mike's go. Method captured in skill `remotion-explainer-build.md`. |
| Thumbnail | ✅ DONE 2026-07-16 — Nano Banana Pro (`nano_banana_2`), style-matched to need-lang-graph thumbnail (passed as `--image` ref), 16:9 2k. Headline "CUT YOUR TOKEN BILL / BY 30%" (white/emerald), chaos(overloaded agent)→arrow→order(sub-agent roster). Text crisp/correct. Files: `savetokens-thumbnail.png` (2752x1536) + `savetokens-thumbnail-1280x720.jpg` (upload-ready). |

## Resume protocol
1. If containers QA returned FAILs → fix in `deck/containers.html`, re-render just those (`node scripts/render-containers.js NN`), re-QA.
2. Run the accuracy pass on SCRIPT.md (mandatory) BEFORE building tts-chunks.json.
3. Build tts-chunks.json → capture MIKE-CLONE VO → build the Remotion comp over the container PNGs → video-qa.

## Key decisions (this session, 2026-07-16)
- **Channel inherits longform-edited, does not fork.** `ai-engineering/CLAUDE.md` routes; `skills/deck-and-containers.md`
  records only the ai-engineering deltas (full-frame containers, no face, one #cNN per chunk) and points at the
  canonical longform-edited skills. Per-video folder follows the longform-edited convention (deck/, render-assets/, scripts/).
- **Token claim is a personal estimate, not the audited table** — see the two ⚠️ correction blocks at the top of SCRIPT.md.
- **Roadmap containers (c18, c19) are aspirational** — PLANNED rows are dashed/tagged, never fake frontmatter. Hard rule
  in the accuracy-pass gate: if any of those agents gets built, move it into the real roster and restyle.

## Container map (chunk → container)
c01 hook/3-lane fan · c02 before/after bars · c03 balloon · c04 cost-curve · c05 isolation wall · c06 what-comes-back ·
c07 the-trick 2up+quote · c08 three lanes · c09 orchestrator hands off · c10 two dials + code · c11 pricing table ·
c12 model = kind-of-thinking · c13 effort ladder · c14-17 roster table (spotlight: bottom/top/exec/QA) ·
c18-19 roadmap (PLANNED) · c20 payoff bars · c21 contract-gap files · c22 CTA frontmatter.
