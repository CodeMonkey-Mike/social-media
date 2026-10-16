# BROLL-PLAN: downtober / clip 3 `long-term-plays-58x-350x` (FULL)

Title: "58x on Velvet, 350x on LAB: Long Term Plays Only"
Spine: `shorts/downtober/render-assets/long-term-plays-58x-350x.mp4` (1080x1920, video 17.80 s @25, audio 17.801 s)
Comp: `DowntoberLongTermPlays`, 534 frames @30 = 17.800 s. Seam MEASURED at 853/854 (row-mean step on 6 of 6 frames)
-> content zone 0..854, caption band capY 960.
Base content zone: a DexScreener ORBIO/WVDA chart page (dark chart top, white trades table below). It is OFF-message
for this topic. Per the budget rule that is NOT a licence to blanket: base still shows in real stretches.
Directives for clip 3 (`clip_directives.py --batch downtober --clip 3`): none. No coverage exemption.

## Budget (canonical: video-creation/SKILL.md "B-roll coverage budget", HALVED 2026-07-14)
- B-roll images: 3 beats, 2.00 + 1.77 + 1.93 = **5.70 s of 17.80 s = 32.0 % b-roll / 68.0 % base** (band 25-35 %).
- Full-screens: 2 (hook + climax), inside the FIRM cap of 3. 9.3 s apart, no full->full flash.
- Plus 2 small alpha overlays (not zone covers) and 2 code-drawn badges, each in its own time window.
- Base-showing stretches: 0.03-2.10, 4.10-7.03, 8.80-13.37, 15.30-end. Longest gap between b-roll images is
  4.57 s (8.80-13.37), and something still changes inside it: DCA badge 9.00-10.45, red arrow 10.86-11.80,
  then the riser under the base 11.35-13.37. On screen, nothing holds static for more than ~1.6 s.

## Reference gate (named projects, `schedule-tweets/images/reference/` listed LIVE 2026-10-15)
- **LAB** (lesser-known, reference on disk `LAB.png`): every LAB image is generated WITH the reference attached
  (thumb, October cutaway, climax). The flask glyph came back correct in all three.
- **Velvet** (lesser-known, reference on disk `velvet.png`): the hook image is generated WITH the reference attached.
  The V-monogram came back correct.
- No other project is named. Captions spell the token `$LAB` (house spelling; preset lowercases, so the cashtag is
  the only thing separating it from the word "lab"). Velvet is left bare, colour-tagged.

## Beats (cut times sit on MEASURED word onsets: "58X" 2.12, "Called" 7.02, "350X" 13.36; RMS 20 ms)

| # | t (s) | spoken line | mode | visual | asset | reference |
|---|---|---|---|---|---|---|
| 0 | frame 0 | (cover) | thumb | PHOTOREAL oversized LAB coin, single focus, dark gradient, top third empty; code-drawn title "350X ON $LAB" + chip "LONG TERM PLAYS ONLY" | `thumb-dt3-cover.png` | LAB.png |
| 1 | 0.03-2.10 | "They take a long time when they move. We did the" | base | screen-share + face (the talking-head open, base-first per Phase 7 rule 5) | (none) | n/a |
| 2 | 2.10-4.10 | "58x on Velvet in June," | **full (HOOK)** | violet Velvet coin blasting upward like a rocket over a night city, lavender light trail | `broll-dt3-hook-velvet-launch.png` | velvet.png |
| 3 | 4.20-6.96 | "and I called it in July of last year, took 11 months." | base + overlay | glowing golden hourglass alpha overlay, LEFT of the chart (top 110, left 90, w 300, bottom ~584) | `ovl-dt3-hourglass.png` | n/a |
| 4 | 7.03-8.80 | "Called $LAB in October." | content | LAB coin on autumn leaves under a spotlight (the October call) | `broll-dt3-called-lab-october.png` | LAB.png |
| 5 | 9.00-10.45 | "We DCA'd a little bit more in December" | base + badge | badge "DCA" / "ADDED MORE IN DECEMBER" (yellow), top 400 | (badge) | n/a |
| 6 | 10.86-11.80 | "it went down December," | base + overlay | neon red down-arrow alpha overlay, RIGHT side over the chart's falling end (top 130, left 700, w 300, bottom ~502) | `ovl-dt3-red-arrow.png` | n/a |
| 7 | 11.80-13.37 | "and then it does a" | base | screen-share + face; riser builds under it | (none) | n/a |
| 8 | 13.37-15.30 | "350x in May." | **full (CLIMAX)** | colossal LAB coin erupting out of a giant bubbling flask, lime geyser + shockwave rings | `broll-dt3-climax-lab-eruption.png` | LAB.png |
| 9 | 15.38-end | "Long-term play, not these crazy things." | base + badge | badge "LONG TERM PLAY" / "NOT THESE CRAZY THINGS" (LAB lime), top 400, holds to the last frame | (badge) | n/a |

## Assets (file-level manifest, zero orphans)
| file | used by beat | generator |
|---|---|---|
| `thumb-dt3-cover.png` | 0 | ChatGPT (gen_batch.py), LAB ref attached |
| `broll-dt3-hook-velvet-launch.png` | 2 | ChatGPT (gen_batch.py), Velvet ref attached |
| `broll-dt3-called-lab-october.png` | 4 | ChatGPT (gen_batch.py), LAB ref attached |
| `broll-dt3-climax-lab-eruption.png` | 8 | ChatGPT (gen_batch.py), LAB ref attached |
| `ovl-dt3-hourglass.png` | 3 | ChatGPT glow-on-black -> alpha (max-channel variant, `_qa/make_alpha.py`); source in `_qa/src/` |
| `ovl-dt3-red-arrow.png` | 6 | ChatGPT glow-on-black -> alpha (max-channel variant); source in `_qa/src/` |

## SFX (from video-creation/assets/sfx, copied into render-assets/sfx/ by setup_render_assets.py)
| t (crest) | cue | vol | why |
|---|---|---|---|
| 0.20 | transition_rapid_whoosh | 0.12 | frame-0 cover cut to the base |
| 2.10 | transition_rapid_whoosh-tight | 0.12 | whoosh INTO the hook full-screen |
| 2.10 | Impacts/card-impact-layered | 0.12 | hook reveal hit |
| 4.20 | DING-093 | 0.10 | hourglass pops |
| 7.03 | transition_rapid_whoosh-tight | 0.06 | into the LAB cutaway (lowered from 0.12, see below) |
| 9.00 | Cash Register | 0.10 | DCA badge (buying more) |
| 10.86 | ding/sudden-shock-tight | 0.10 | red arrow drops ("it went down") |
| 11.35->13.37 | Riser Sound Effect-2s -> Boom - Big Reveal-short | 0.50 / 0.18 | riser builds INTO the climax payoff |
| 15.38 | DING-093 | 0.12 | LONG TERM PLAY badge |
10 events, 8 distinct files. Every cue whisper-verified offline against an encode-matched control (staggered windows,
medium.en, CPU): the only regression was the 7.03 whoosh cresting on "Called" ("Cold lab" in 2 of 5 windows). Timing
was tried first and lost (tail truncated to 0.25 s: still "Cold"; crest moved to 6.965: "For/Ford lab"). Vol 0.06 matched
the control on 5/5 windows. A decoration cue, so it took the cut, not a payoff hit.

## As built (2026-10-15)
- ONE full render via `render_short.py full` (534 frames, 17.80 s video, 9.9 Mbps, 113 s). No splice and no audio fix needed.
- Frame QA (inside every beat + every handoff: 0, 1, 62/64, 90, 122/124, 130, 170, 207/210/212, 240, 264/268, 285, 310,
  330, 350, 400/402, 430, 458/461, 475, 533): cover on frame 0 only, base from frame 1; no two graphics overlap in time
  or space. The end badge wraps to "LONG / TERM / PLAY" (box ~180-548 px, clear of the caption band). blackdetect: none.
- Levels: render -18.9 LUFS / TP -8.6 dBFS vs spine -19.0 LUFS / -8.9 dBFS.
- Whisper-verify of the FINAL render vs the encode-matched control: no cue masks the VO. Pipeline note: the render's AAC
  audio decodes 2048 samples (42.7 ms) behind the control (encoder priming, no edit list). The SHIPPED clip 2 render
  shows the identical lag, so it is systematic, not this build. Windows must be shifted by +42.7 ms to compare. Unaligned,
  the opening line falsely looked like a regression ("with a moon"); aligned, it reads "when they move" 5/6 = control.
- Reconciled: every beat has its asset, every asset is referenced, every ref exists (gate PASS, clip 3).
