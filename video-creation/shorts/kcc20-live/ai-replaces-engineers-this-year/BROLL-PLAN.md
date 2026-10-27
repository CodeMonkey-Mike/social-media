# BROLL-PLAN: kcc20-live / clip 3 `ai-replaces-engineers-this-year` (FULL, 33.42 s)

Title (clip-plan): "Even Anthropic's Engineers Say AI Codes Better Than Them"
Spine: `ai-replaces-engineers-this-year-final.mp4` (staged as `render-assets/ai-replaces-engineers-this-year.mp4`, 25 fps, 1080x1920, has_b_frames 0; video 33.400 s, audio 33.423 s)
Base: TradingView BTC/USD daily chart + watchlist (content zone 0..854, seam MEASURED 853/854 on 6 frames 2..31 s) over Mike's webcam. The chart is off-message for an AI talk, but per SKILL row 4 that is NOT a licence to blanket: base still shows ~66 % of the clip, with code-drawn badges carrying the stat beats.
Directives for clip 3 (`clip_directives.py --batch kcc20-live --clip 3`): none. No coverage exemption.
Comp prefix `kl3` (kcc20-live clip 3). Composition id `Kcc20LiveAiEngineers`.

## Reference-image gate (live `ls schedule-tweets/images/reference/`, 2026-10-22, 46 files)
| Named in clip | Bucket | Action |
|---|---|---|
| Claude Code / Anthropic | WELL-KNOWN AI brand (same tier as OpenAI in SKILL 2a), no file on disk | Named explicitly in the hook prompt (Claude's terracotta-orange starburst mark); captions colour "claude" / "anthropic" orange; Anthropic beat itself is a code-drawn badge (exact wordmark as type, never model-drawn letters) |
| Radiology | generic field, not a brand | code-drawn badge |
No lesser-known project is spoken. No real-person face anywhere (all engineers/figures faceless, seen from behind or silhouettes).

## Budget
Images: 5 b-roll beats (2 full-screen = hook + climax, firm cap 3) + frame-0 cover. 4 code-drawn badges.
B-roll time = 2.96 + 2.02 + 2.44 + 2.24 + 1.56 = 11.22 s of 33.40 s = **33.6 % b-roll / 66.4 % base** (band 25-35 %).
Full-to-full gap: hook ends 3.70, climax starts 28.64 (24.9 s). Longest stretch with no b-roll AND no badge = 2.68 s (21.62-24.30).

## Beats (seconds on the spine; word times from whisper-words-verified.json)
| # | t in-out | Spoken line | Mode | Visual | Asset |
|---|---|---|---|---|---|
| 0 | frame 0 | (cover) | thumb | Pixar: giant robot hands typing at a glowing keyboard while a faceless engineer in a hoodie sits beside it holding a tiny magnifying glass; top 45 % empty for the CODE-drawn title "AI NOW CODES BETTER THAN ITS ENGINEERS" + chip "EVEN ANTHROPIC ADMITS IT" | `thumb-kl3-cover.png` |
| 1 | 0.03-0.74 | "Claude Code" | base | Mike + chart (cold open on the base) | - |
| 2 | 0.74-3.70 | "completely replaces any software engineers." | **FULL (hook)** | Pixar: a towering glowing terracotta-orange AI terminal (Claude's orange starburst mark on its bezel) with robot arms, an empty office chair rolling away, a faceless engineer silhouette walking out with a cardboard box | `broll-kl3-hook-replaced.png` |
| 3 | 3.70-5.08 | "Some of the engineers that work" | base | chart | - |
| 4 | 5.08-8.46 | "for Anthropic are among the highest caliber engineers on the planet." | badge | ORANGE "ANTHROPIC" / "ELITE ENGINEERS" sub "TOP OF THE PLANET" | code |
| 5 | 8.46-9.04 | "Probably get paid" | base | - | - |
| 6 | 9.04-10.86 | "$500K a year or $800K." | badge | YELLOW "$500K-$800K" sub "A YEAR" | code |
| 7 | 10.86-12.48 | "And even they say that" | base | - | - |
| 8 | 12.48-14.50 | "AI can now make code better than them." | content | Pixar: a sleek faceless robot coding on three monitors of glowing code at blazing speed, a faceless human engineer behind it leaning back, outpaced | `broll-kl3-ai-better.png` |
| 9 | 14.50-15.70 | "Now engineers are" | base | - | - |
| 10 | 15.70-17.38 | "doing nothing but reviewing AI code." | badge | RED "ENGINEERS NOW" / "JUST REVIEW" sub "AI-WRITTEN CODE" | code |
| 11 | 17.38-19.18 | "And even then, it's creating this huge" | base | - | - |
| 12 | 19.18-21.62 | "bottleneck in companies where there's so much code being produced" | content | Pixar: a tiny faceless office worker at a desk buried under an avalanche of glowing code screens pouring through a narrow bottle neck | `broll-kl3-bottleneck.png` |
| 13 | 21.62-24.30 | "that a human can't review it. Now they're making" | base | - | - |
| 14 | 24.30-26.54 | "agents that are just reviewing the code, testing the code." | content | Pixar: a swarm of small friendly faceless robot agents with magnifying glasses and checkmark stamps crawling over giant floating code panels | `broll-kl3-agents-review.png` |
| 15 | 26.54-28.64 | "There's entire jobs that are going to be" | base | - | - |
| 16 | 28.64-30.20 | "completely wiped out this year." | **FULL (climax)** | Pixar: a vast office floor of empty desks and chairs disintegrating into glowing particles, swept away, a single faceless silhouette standing in the doorway | `broll-kl3-climax-wiped.png` |
| 17 | 30.20-30.96 | "I mentioned in my video," | base | - | - |
| 18 | 30.96-33.40 | "radiology, one of those things being completely wiped out." | badge | RED "RADIOLOGY" / "WIPED OUT" sub "AS WE SPEAK" | code |

No two overlays share a window: badges sit at centre y 470 inside the content zone, b-roll windows never overlap a badge window, captions sit at y 960 under the seam.

## SFX (all from `video-creation/assets/sfx/`, catalog `library.json`; t = event - attack_sec)
| event | sound | note |
|---|---|---|
| cover cut (frame 1) | `transition_rapid_whoosh-tight.wav` vol 0.04, dur 0.12 | whoosh on the thumbnail cut (swept down from 0.08/0.30, which garbled "Claude Code") |
| hook full 0.74 | `Impacts/Impact_Hit_01-2-tight.wav` | hard cut, no smear under "completely" |
| salary badge 9.04 | `Cash Register-ching.wav` | money pop |
| AI-better content 12.48 | `kinetic-text/ea-glitch-21.mp3` | headline over tech b-roll |
| REVIEW badge 15.70 | `ding/sudden-shock-tight.wav` | twist jolt |
| bottleneck content 19.18 | `kinetic-text/swoosh-3.wav` | b-roll entry |
| agents content 24.30 | `kinetic-text/whoosh-4.mp3` | b-roll ingress |
| climax full 28.64 | `Boom - Big Reveal-short.wav` | climax payoff hit |

**8 SFX events shipped.** Whisper-swept on the first full render (SKILL row 7a: offline mixes on the bare spine vs an
encode-matched control, `_qa/sfx_sweep.py`, `sweep*-results.json`; fixed by `render_short.py audio` x2, zero video frames):
- DELETED the ANTHROPIC badge `knock-pop` (masked "Anthropic" 3/3; best timing/gain variant 2/4) - decoration.
- DELETED the `Riser Sound Effect-2s` into the climax (turned "jobs that are going to be" into "that have been" 4/4).
- DELETED the RADIOLOGY badge hit: `Soundjay_Impact_Main_01-short` ate "in my video"; its `Impact_Hit_01-2-tight`
  replacement still turned "like" into "that's great" 4/4 vs the same-path no-hit mix. "radiology" itself is
  decoder-fragile and drops even with NO hit (sweep3 E3), so it is not recoverable by the mix.
Final mix (`verify3-results.json`): every window matches one of two controls or reads better, except two windows where
the controls disagree with each other (0-1.7 s; 28.5-32.5 s, no SFX present) = decoder variance.
