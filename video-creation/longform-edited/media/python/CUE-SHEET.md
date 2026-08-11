# python EP01 — CUE-SHEET (layer-grouped watch-along)

_Final video: `python-ep01-v4.mp4` (project root) — 5:05 (305.20s), 9156 frames, 1920x1080@30, 2.2 Mbps.
All timecodes are FINAL-VIDEO seconds. No card pauses are baked, so these equal spine coords.
Companion: `EDIT-PLAN.md` (time-ordered event log). Built to `AS-RECORDED.md`._

---

## Layer 1 — SPINE (the gated face)

One continuous `OffthreadVideo`, never cut. Face baked visible on 7 windows, black everywhere else.
**9% face / 91% cover.** Source `spine/ALL.c.desilenced.mp4`.

| # | Window | Content |
|---|---|---|
| F1 | 0:05.7-0:09.8 | "So why would you want to spend three months learning Python?" |
| F2 | 0:29.8-0:36.4 | cost line + CH2 opener (merged; CARD-A overlays at 0:33.7) |
| F3 | 1:47.5-1:48.9 | "Computers don't speak human." |
| F4 | 3:33.5-3:35.5 | "That's it. That's the whole list." |
| F5 | 3:44.1-3:46.5 | "Instead, build one project, four times." |
| F6 | 4:43.3-4:45.6 | "The struggle is the part where learning happens." |
| F7 | 4:56.0-5:05.2 | readiness payoff + the ask + sign-off (runs to the last frame) |

## Layer 2 — COVER (48 beats, contiguous over every non-FACE second)

**Zero orphans, zero gaps, no black > 0.5s (verified on the render).**

### 2a. Rich full overview slides — `deck`, 6 total, each shown ONCE
| TC | Ref | Why it earns a full slide |
|---|---|---|
| 0:09.8-0:14.6 | c2-amplifier | the amplifier shape, whole |
| 1:12.9-1:21.4 | c12-curriculum | the full standard-course grid |
| 1:54.5-2:04.3 | c17b-ladder | the whole 5-rung abstraction ladder |
| 2:50.4-2:53.2 | c24-groups | the four-card overview |
| 4:14.0-4:16.6 | c28f-stack-agent | the finished four-layer stack |
| 4:33.1-4:43.3 | c32-rulecard | the ALLOWED / NOT ALLOWED rule |

### 2b. Spotlight containers — `container`, 35 total
One sub-point each, code-rendered off the locked stylesheet. `c1a/c1b` · `c3` · `c4` · `c6` · `c8` ·
`c9` · `c10` · `c12b` · `c13` · `c15` · `c16` · `c17a` · `c18` · `c19` · `c20` · `c21` · `c22` ·
`c23` · `c23b` · `c24a` · `c24b` · `c24c` · `c24d` · `c25` · `c26` · `c27` · `c28a-e` · `c29` ·
`c31` · `c33`.

### 2c. ANIMATED chart — `chart`, 1
| TC | Ref | Motion |
|---|---|---|
| 1:06.3-1:12.9 | ramp-anim | real `useCurrentFrame` draw: curve grows along its own length (stroke-dashoffset, ease-in-out), endpoint dot rides the head, axis captions fade in as the curve reaches them. Plate `c11-ramp-plate.png` behind, SVG overlay in a 1920x1080 viewBox at translate(196,592) |

### 2d. AI stills — `still`, 3 (ChatGPT browser pipeline, never an API image model)
| TC | Dur | Ref | Beat |
|---|---|---|---|
| 0:18.9-0:21.9 | 3.00s | broll-py01t2w5-chrome-android-wide | "Like a Terminator, you just become unstoppable" |
| 0:27.4-0:29.8 | 2.42s | broll-py01c4r7-scrolling-past-code | "the real cost isn't the bad code" |
| 3:13.0-3:16.8 | 3.80s | broll-py01n8m2-three-in-the-morning | "when the call fails at three in the morning" |

### 2e. Envato b-roll — `vid`, 3 (all silent, 1080p30, ≤4s)
| TC | Dur | Ref | Replaced |
|---|---|---|---|
| 0:41.3-0:43.5 | 2.20s | e1-dark-room | c7-channel (text filler) |
| 1:33.5-1:37.4 | 3.92s | e2-hands-coding | c14-shape (text filler) |
| 4:24.3-4:26.9 | 2.60s | e3-focus-typing | c30-onerule (text filler) |

## Layer 3 — CHAPTER / TITLE CARDS (4, overlay, one per music-bed change)

| TC | Hold | Card | Readable |
|---|---|---|---|
| 0:33.7 | 1.75s | **LEARNING PYTHON FOR AI ENGINEERING** (video title; also hides the face-to-face CH1/CH2 join) | 1.40s |
| 2:32.2 | 1.70s | **WHAT YOU ACTUALLY NEED** (= the CH3 skip target, and the YouTube chapter marker) | 1.35s |
| 3:35.5 | 1.65s | **BUILD ONE PROJECT, FOUR TIMES** | 1.30s |
| 4:22.8 | 1.65s | **THE ONE RULE** | 1.30s |

Comp asserts `hold - CARD_XF >= 1.0s` at build time, so the ≥1s-readable rule cannot regress.

## Layer 4 — TRANSITIONS

**Every cut is a plain crossfade.** 0.30s cover↔cover and cover↔face, 0.35s into and out of cards.
Nothing from the transition library, no glitch, no film burn, no MELT/SPIN, no punch-ins.
Deliberate waiver of PRE-RENDER GATE #3 — full rationale in `TRANSITIONS.md`.

## Layer 5 — CAPTIONS

**NONE.** No caption track exists and `captions-builder` was never run (Mike, 2026-08-05).

## Layer 6 — MUSIC (5 beds, ffmpeg-mixed post-render, never in the comp)

Levels are MEASURED. VO = −17.0 LUFS integrated.

| Bed | Span | Track | Level | Gain |
|---|---|---|---|---|
| A | 0:00-0:33.9 | Old Moon | −34 LUFS | 0.0596 |
| B | 0:34.4-2:32.4 | Accomplishments | −34 LUFS | 0.0841 |
| C | 2:32.9-3:35.7 | Lightbeams | **−39 LUFS** | 0.0323 |
| D | 3:36.2-4:23.0 | Slow Rise (instr.) | **−39 LUFS** | 0.0700 |
| E | 4:23.5-5:05.2 | Lightheart (instr.) | **−39 LUFS** | 0.1622 |

C/D/E carry Mike's 2026-08-05 −5 dB adjustment (flagged at 2:45, 3:55, 4:50). ~0.5s breath at each
of the four bed changes, verified silent. No looping (every source exceeds its span). No ducking
windows (no clip inserts, no screen-recording audio).

## Layer 7 — SFX

**NONE.** No impacts, risers or stings. The calm register carries itself.

---

## Verification run on this cut

- Frame count exact (9156), duration 305.19s, A/V drift 30 ms
- `lint-covers` OK — 48 covers, 6 distinct b-roll, all ≤4s, captions clear
- `lint-slide-balance` OK — 6 slides / 35 containers, balance holds
- `lint-deck-containers` OK — 6 deck refs, all single containers
- `lint-transition-assets` PASS — no library transitions referenced
- `blackdetect` — no black stretch > 0.5s anywhere
- All 5 beds verified at level; all 4 breaths verified silent
- All 8 changed placements frame-checked on the render
