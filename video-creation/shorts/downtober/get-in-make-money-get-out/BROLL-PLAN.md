# BROLL-PLAN: downtober clip 4, `get-in-make-money-get-out` (FULL)

Title: "Got In, Made Money, Got Out. That Is Not a Scam"
Spine: `render-assets/get-in-make-money-get-out.mp4` (1080x1920 @25, video 27.360 s, audio 27.367 s, has_b_frames 0).
Comp: `DowntoberGetInGetOut` @30 fps, 820 frames = 27.333 s (last frame 819 at 27.300 s, inside both tracks; last word ends 27.18 s).
Measured seam 854 (row-mean gradient rows 600-1300, largest step 853/854 on 5 of 5 frames at 2/8/14/20/26 s). capY 960.
Directives (`clip_directives.py --batch downtober --clip 4`): none. No coverage exemption.

## Base footage survey (what the content zone shows)
- The WHOLE clip: Mike's DexScreener SPON/ETH market-cap chart (Robinhood chain > Uniswap): a spike to ~350K that bleeds
  down to 7.85K, with the transactions table under it. It is literally a "pumped, then it dumps" chart, so it is the
  receipt for the clip's thesis and stays visible in real stretches (2.44-3.94, 6.62-8.55, 13.0-18.3, 20.1-25.2, 26.62-end).
  SPON is never named in the speech, so it gets no b-roll of its own.
- 0.0 - 12.95 s: a burned-in viewer chat banner ("I almost bought cg new Hell token...give me a slap too") at y ~700-775,
  frame-diff measured (gone from 13.0, the segment join). Ships as filmed. Badges ride at top 470 while it is up, 620 after.

## Budget (canon: ~30%, band 25-35%; full-screen 1-3x FIRM)
b-roll = 1.80 + 1.66 + 2.15 + 1.84 + 1.42 = **8.87 s of 27.333 s = 32.5 % b-roll / 67.5 % base** (as shipped).
5 distinct images, each used once. 2 full-screens (hook + climax). No two b-roll beats are adjacent (no base-flash risk).
Plus 2 real alpha overlays (money bag, red arrow) and 5 code badges, none counted as zone cover.
Longest stretch with no change: 21.85-23.55 (1.70 s).

## Reference gate (live `ls schedule-tweets/images/reference/` 2026-10-15, 46 entries)
| Named entity | Bucket | Decision |
|---|---|---|
| Golden Kitty ($GOLDEN) | LESSER-KNOWN, reference on disk | `schedule-tweets/images/reference/golden-kitty.png` (the gold cat statuette) ATTACHED to B3 and the cover |
| Hellhound (CG's token) | LESSER-KNOWN, NO reference | NOT drawn (no invented logo). Spoken only; the caption carries the name. The adjacent badge is "IN AT $1M" (code). Flag for Mike: add a reference if he wants it pictured |
| SPON | reference on disk (`spon.png`) but NOT named in the speech | no beat; the base chart shows the real page |
| "3 million / 3 billion", "10x" | numbers | code badges + caption colours |

## Beats
| # | t (s) | spoken line | mode | visual | Reference | asset |
|---|---|---|---|---|---|---|
| F0 | frame 0 only | (cover) | cover | PHOTOREAL single focus: the gold Golden Kitty statuette sitting on an oversized overflowing sack of plain gold coins, dark charcoal gradient, top 45% empty. CODE title "GOT IN.\nGOT OUT." + chip "THAT IS NOT A SCAM" | `golden-kitty.png` | `thumb-dt4-cover.png` |
| base | 0.03-0.64 | "The point is" | base | Mike + the SPON chart (playback starts on the base, rule 5) | - | - |
| B1 | 0.64-2.44 | "like you got to get in and make money and get out" | **FULL (hook)** | Pixar 3D: a green-candle roller coaster; at the peak a happy trader steps OFF onto a gold platform with a sack of coins while the empty car plunges down the red side | none (generic) | `broll-dt4-hook-coaster.png` |
| base | 2.44-3.94 | "and some of them will only" | base | the chart | - | - |
| G1 | 3.94-4.84 | "pump to three million." | badge | code "SOME PUMP / TO $3M" (white), top 470 | - | code |
| B2 | 4.94-6.60 | "Some of them will pump to three billion." | content | Pixar 3D: a colossal rocket blasting into space past small rockets stalled at a low cloud layer | none (generic) | `broll-dt4-three-billion.png` |
| base | 6.62-8.55 | "If something dumps at six million" | base | the chart (it is a dump) | - | - |
| G2 | 7.10-8.45 | "dumps at six million" | badge | code "DUMPS / AT $6M" (red), top 470 | - | code |
| B3 | 8.55-10.70 | "like golden kitty, you can't say it's a scam." | content | Pixar 3D: the Golden Kitty statuette calm and dignified on a pedestal, a chart slid down behind it, happy traders walking away with coin bags | `golden-kitty.png` | `broll-dt4-golden-kitty-calm.png` |
| G3 | 11.00-12.85 | "people got in, made money and got out." | badge | code "NOT A SCAM" / "GOT IN. MADE MONEY. GOT OUT." (green), top 470 | - | code |
| base | 12.95-14.40 | "Maybe somebody gets" | base | the chart (banner gone) | - | - |
| G4 | 14.40-15.85 | "in at one million with Hellhound" | badge | code "IN AT $1M" / "MARKET CAP" (gold), top 620 | - | code |
| G5 | 16.65-18.15 | "pumps to like a 10x in a couple of weeks." | badge | code "10x" / "IN A COUPLE OF WEEKS" (green), top 620 | - | code |
| B4 | 18.26-20.10 | "You'll do a 10x and you'll be happy." | content | Pixar 3D: a trader leaping for joy under a shower of plain gold coins and green confetti | none (generic) | `broll-dt4-happy-10x.png` |
| O1 | 20.16-21.85 | "You get out and make money" | overlay (alpha) | glowing gold money sack + green arrow ON the chart (glow-on-black -> alpha) | none (generic) | `ovl-dt4-moneybag.png` |
| base | 21.85-23.55 | "and be like, damn, you know, you feel good about yourself." | base | Mike + the chart | - | - |
| O2 | 23.55-25.10 | "And then it dumps and everybody else says," | overlay (alpha) | glowing red down-arrow ON the chart's real dump (the receipt) | none (generic) | `ovl-dt4-red-arrow.png` |
| B5 | 25.20-26.62 | "man, it's a scam." | **FULL (climax)** | Pixar 3D: angry latecomers (from behind) shaking fists at a crashed red candle chart; far away one tiny happy figure walks into the sunset with a sack of coins | none (generic) | `broll-dt4-climax-scam.png` |
| base | 26.62-27.33 | "It's a scam." | base | hard out on Mike's mocking second "It's a scam." | - | - |

Overlap check: no two of {B*, O*, G*} share a window; nothing starts under the frame-0 cover; captions sit at capY 960
(below the 854 seam, above the eyes); G1-G3 ride at top 470 (~365-575) above the chat banner (700-775).

## SFX (from `video-creation/assets/sfx/`; `t` = cue minus measured crest) - AS SHIPPED, 10 events
Offline Whisper sweep BEFORE the render (row 7a: each candidate mixed alone onto the bare spine, 48 kHz AAC, vs an
encode-matched control, 3-5 staggered medium.en windows; `_qa/sfx/`), then re-verified on the render with an
ALIGNMENT-matched control (the render's audio carries a constant 42.75 ms AAC priming lag vs the spine, measured by
cross-correlation at 1.5/11.5/21.5 s; windows shifted to match).
| crest (s) | event | file | outcome |
|---|---|---|---|
| 0.033 | cover cut | `transition_rapid_whoosh.mp3` truncated before its crest (dur 0.12, vol 0.08) | = control |
| 0.64 | hook full-screen in | `Impacts/card-impact-layered.wav` (vol 0.14) | = control |
| 3.94 | $3M badge | `DING-093.wav` (vol 0.12) | = control |
| 4.94 | into the three-billion rocket | `transition_rapid_whoosh-tight.wav` (vol 0.12) | = control |
| ~~8.55~~ | ~~into Golden Kitty~~ | DELETED | 'Golden Kitty' -> Katie/Kitten 3/5 at 0.12 and 0.06, 1/5 off even at 0.04 or moved; decoration, deleted per row 7 |
| 11.00 | NOT A SCAM badge | `DING-093.wav` (vol 0.14) | = control |
| 16.65 | 10x badge | `DING-093.wav` (vol 0.12, tail TRUNCATED 0.45 -> 0.25) | 'pumps' -> 'bumps' 2/5 at 0.45; 5/5 at 0.25 |
| 18.20 | into the happy 10x trader | `transition_rapid_whoosh-tight.wav` (vol 0.12, dur 0.28, crest MOVED 18.26 -> 18.20) | "you'll" -> "we'll" 3/5 on 18.26; 5/5 moved |
| 20.16 | money sack on the chart | `Cash Register-ching.wav` (NEW library variant = `Cash Register.mp3` 0.53-1.30 s, the ching only; vol 0.06) | phantom 'And you' 2/5 at 0.12; 5/5 at 0.06 |
| 23.55 | red arrow onto the dump | `transition_rapid_whoosh-tight.wav` (vol 0.10) | = control |
| 25.20 | climax full-screen | `Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3` (vol 0.20) | = control (render reads 'it dumps', control 'of dumps') |

## Manifest (zero orphans)
`thumb-dt4-cover.png`, `broll-dt4-hook-coaster.png`, `broll-dt4-three-billion.png`, `broll-dt4-golden-kitty-calm.png`,
`broll-dt4-happy-10x.png`, `broll-dt4-climax-scam.png`, `ovl-dt4-moneybag.png` (alpha, from `_gen/ovl-moneybag-black.png`),
`ovl-dt4-red-arrow.png` (alpha, from `_gen/ovl-red-arrow-black.png`). Every one referenced exactly once in
`constants-downtober-get-in-make-money-get-out.ts`. Generation list: `_gen/dt4-items.json`.

## Persona inspection (every image, 2026-10-15)
- thumb-dt4-cover (PHOTOREAL, golden-kitty.png attached): clean. The statuette matches the reference; coins plain; no text.
  Post-processed: subject shifted down 130 px (gradient band stretched to fill) so the ears clear the code chip
  (original kept as `_gen/thumb-dt4-cover-orig.png`).
- broll-dt4-hook-coaster: clean (generic cartoon trader, green/red candle coaster, plain coins).
- broll-dt4-three-billion: clean (unmarked rockets).
- broll-dt4-golden-kitty-calm (golden-kitty.png attached): requested Golden Kitty likeness, correct; traders seen from behind.
- broll-dt4-happy-10x: clean (coins carry only faint generic embossing, no crypto mark).
- broll-dt4-climax-scam: clean (cartoon crowd mostly from behind, no signs/text, no real faces).
- ovl-dt4-moneybag / ovl-dt4-red-arrow: clean; converted glow-on-black -> RGBA with a border-connected background key
  (`_gen/make_alpha.py`), so the dim burlap stays opaque. No regeneration, no remaps.

## QA log (on the ONE full render)
- render_short.py full: 820 frames, 30 fps, 1080x1920, 8.74 Mbps, 69 s. 0 black segments; -19.6 LUFS (= spine), TP -9.5 dBFS.
- Caption whisper-verify of the render found ONE missing spoken word: 'Or' at 12.99-13.28 (word JSON hole over ~-18 dB
  voiced audio). Restored in whisper-words-verified.json, captions rebuilt (2 groups changed), fixed by
  `render_short.py splice --frames 386-452` (kept 0-385 49.3 dB, 453-819 50.7 dB; audio md5 identical to pre-splice).
