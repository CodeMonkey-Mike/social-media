# BROLL-PLAN: downtober clip 1, `zombies-cant-see-the-bottom` (FULL)

Title: "The Bottom Is In and the Cycle Zombies Can't See It"
Spine: `render-assets/zombies-cant-see-the-bottom.mp4` (1080x1920 @25, video 27.20 s, audio 27.19 s, has_b_frames 0).
Comp: `DowntoberZombiesBottom` @30 fps, 816 frames = 27.20 s. Measured seam 854 (row-gradient, 5 of 5 frames). capY 960.
Directives (`clip_directives.py --batch downtober --clip 1`): none. No coverage exemption.

## Base footage survey (what the content zone shows)
- 0.0 - ~17.5 s: Mike's TradingView BTC/USD 4H chart + watchlist (BTCUSD 81,470), drawn trendlines. This IS the
  receipt for "Bitcoin went above the May high" and "you can't figure that out by looking at the chart": shown in
  real stretches (4.80-9.00 and 10.50-17.5 base, plus the overlay that sits ON it). A burned-in viewer chat
  banner ("We pumped hard...") ships as filmed.
- ~17.5 - 27.2 s: CoinMarketCap Bitcoin page with an eCash ad header, then a loading page (low value). Covered by a
  badge at "illuminated", the shattered-cycle image and the climax full-screen; the rest stays base.

## Budget (canon: ~30%, band 25-35%; full-screen 1-3x FIRM)
b-roll = 1.50 + 2.40 + 1.50 + 1.75 + 1.70 = **8.85 s of 27.20 s = 32.5 % b-roll / 67.5 % base** (final, after the B3 remap).
5 distinct images, each used once. 2 full-screens (hook + climax). B1->B2 and B4->B5 BUTT exactly (hard cuts, no base flash, rule 4).

## Reference gate (live `ls schedule-tweets/images/reference/` 2026-10-15)
| Named entity | Bucket | Decision |
|---|---|---|
| Benjamin Cowen (person) | reference on disk | `schedule-tweets/images/reference/Benjamin-Cowen.png` attached to B2; Pixar-style likeness + code "AI ILLUSTRATION" tag for the whole beat (golden-kitty Vlad Tenev precedent) |
| Bitcoin | WELL-KNOWN brand | named in the B2 prompt (small orange Bitcoin mark on the monitor); no ref needed |
| "four-year cycle zombies" | generic concept | cartoon zombies, no brand, no real faces |

## Beats
| # | t (s) | spoken line | mode | visual | Reference | asset |
|---|---|---|---|---|---|---|
| F0 | frame 0 only | (cover) | cover | Pixar 3D: zombie crowd in suits staring at red phones, unaware a glowing green price line has already bounced off a deep valley behind them; top 45% empty navy. CODE title "THE BOTTOM / IS IN" + chip "ZOMBIES CAN'T SEE IT" | none exists (generic approved) | `thumb-dt1-cover.png` |
| base | 0.03-0.90 | "or the king of the" | base | Mike + BTC chart (playback starts on the base, rule 5) | - | - |
| B1 | 0.90-2.40 | "four year cycle zombie," | **FULL (hook)** | Pixar 3D: a crowned cartoon zombie leads a horde of zombies in rumpled suits shuffling in an endless circle around a giant glowing four-segment calendar wheel | none exists (generic approved) | `broll-dt1-hook-zombie-loop.png` |
| B2 | 2.40-4.80 | "Benjamin Cowen, who was absolutely perplexed" | content | Pixar 3D likeness of Benjamin Cowen, puzzled squint, hand on chin, staring at a monitor where an orange Bitcoin price line punches up through a horizontal ceiling line. + code tag "AI ILLUSTRATION" | `schedule-tweets/images/reference/Benjamin-Cowen.png` | `broll-dt1-cowen-perplexed.png` |
| base | 4.80-9.00 | "about how Bitcoin went above the May high. And I'm like, dude, people are" | base | the BTC chart (the receipt) | - | - |
| B3 | 9.00-10.50 | "front running the October bottom" | content | **REMAPPED (rule 5)**: content-zone crop of the persona-clean cover art: the green line has already bounced off the valley floor while the zombies stare at red phones. (The generated runner image carried Benjamin Cowen's likeness, an unrequested real-person face from the reference earlier in the chat; rejected to `_gen/rejected/`, no regeneration.) | none exists (generic approved) | `broll-dt1-front-running.png` (crop of `thumb-dt1-cover.png` art) |
| base | 10.50-21.70 | "because they realize..." through "when I came to the conclusion," | base | chart, then CMC page; badges + overlay below provide the change every ~1.5-2.6 s | - | - |
| G1 | 11.60-13.05 | "the bottom is in, that's it." | badge | code badge "THE BOTTOM IS IN" (green), top 620 | - | code |
| O1 | 15.70-17.45 | "by looking at the chart." | overlay (alpha) | glowing teal magnifying glass ON the base chart (glow-on-black -> alpha-from-luminance) | none exists (generic approved) | `broll-dt1-ovl-magnifier.png` |
| G2 | 18.25-19.85 | "I felt illuminated" | badge | code badge "ILLUMINATED" (gold), top 620 | - | code |
| B4 | 21.70-23.45 | "there's no such thing as a four year cycle." | content | Pixar 3D: a giant ornate four-segment calendar wheel cracking apart and shattering into glowing shards | none exists (generic approved) | `broll-dt1-cycle-shatters.png` |
| B5 | 23.45-25.15 | "I just feel illuminated." | **FULL (climax)** | Pixar 3D: lone faceless figure from behind on a summit in a radiant golden light beam; far below, zombies wander in circles in a foggy valley | none exists (generic approved) | `broll-dt1-climax-illuminated.png` |
| G3 | 25.40-27.15 | "I was like absolutely illuminated." | badge | code badge "NO 4-YEAR CYCLE" / "ABSOLUTELY ILLUMINATED" (gold), top 620; hard out on Mike | - | code |

Overlap check: no two of {B*, O1, G*} share a window; nothing starts under the frame-0 cover; the AI tag lives only
inside B2 (bottom-left of the content image, above the seam); captions sit at capY 960 (face-zone top, below the
seam, above the eyes).

## SFX (from `video-creation/assets/sfx/`; `t` = cue minus measured crest)
| cue (s) | event | file |
|---|---|---|
| 0.033 | cover cut | `transition_rapid_whoosh.mp3` TRUNCATED before its crest (dur 0.12, vol 0.08): the full whoosh read the opening "or" as "for" |
| 0.90 | hook full-screen in | `Impacts/card-impact-layered.wav` (dur 0.80) |
| 2.40 | into Cowen | `transition_rapid_whoosh-tight.wav` |
| 9.00 | into front-running | `transition_rapid_whoosh-tight.wav` |
| 15.70 | magnifier overlay on the chart | `transition_rapid_whoosh-tight.wav` (vol 0.10) |
| 11.60 | THE BOTTOM IS IN badge | `DING-093.wav` |
| 21.70 | into shattered cycle | `transition_rapid_whoosh-tight.wav` |
| ~~22.72-23.45~~ | ~~riser into the climax hit~~ DELETED after QA: masked the '-cle' of "four-year cycle" (render 'site' 8/9 vs control 'cycle' 9/9); decoration, so deleted per row 7 | - |
| 23.45 | climax full-screen | `Impacts/DSGNImpt-single_impact_sound_-Elevenlabs.mp3` |
| 25.40 | closing badge | `DING-093.wav` (dur 0.50, tail kept off "I was like") |

## Manifest (zero orphans)
`thumb-dt1-cover.png`, `broll-dt1-hook-zombie-loop.png`, `broll-dt1-cowen-perplexed.png`, `broll-dt1-front-running.png`,
`broll-dt1-ovl-magnifier.png` (alpha, made from `_gen/ovl-magnifier-black.png`), `broll-dt1-cycle-shatters.png`,
`broll-dt1-climax-illuminated.png`. Every one referenced exactly once in `constants-downtober-zombies-cant-see-the-bottom.ts`.

## Persona inspection (every image, 2026-10-15)
- thumb-dt1-cover: clean (cartoon zombies, no logos, no text).
- broll-dt1-hook-zombie-loop: clean (four-season cycle wheel, crowned cartoon zombie).
- broll-dt1-cowen-perplexed: requested Cowen likeness (reference attached) + requested Bitcoin mark. Rendered closer to
  photoreal than the Pixar style asked for; ships under the code AI ILLUSTRATION tag, FLAGGED for Mike.
- (rejected) front-running runner: UNREQUESTED Cowen likeness on the runner -> remapped as above.
- broll-dt1-ovl-magnifier: clean. broll-dt1-cycle-shatters: clean. broll-dt1-climax-illuminated: clean (faceless figure from behind).
