# BROLL-PLAN: peach clip 6 `pengu-flips-pepe-impact` (impact, 15.24 s, spine 25 fps, comp 30 fps, 457 frames)

Comp: `PeachPenguImpact` · constants `remotion/src/constants-peach-pengu-flips-pepe-impact.ts` · captions `remotion/src/captionsPeachPenguImpact.ts` · public dir `shorts/peach/render-assets`
Seam 854 (same footage/framing as clip 1, measured there; re-checked on this spine's base frames) · capY 900 · accent TEAL
Base content zone (scene cuts measured): 0-11.0 CMC Pudgy Penguins page · 11.0-13.24 Bloodsport movie tail (out of context in this cut, covered by B3) · 13.24-15.24 Mike's calls table (PENGU +34.8%, the receipt, left visible).

Budget: 3 b-roll beats, 5.23 s / 15.23 s = **34.3% b-roll, 65.7% base** (band 25-35 / 65-75). Full-screens: 2 (hook, climax), 3.01 s base gap between them.
Same-topic sibling = clip 1: every asset below is new (no-dup rule); clip 1's flip/buy/rocket/moon/steal/flex/face-off art is NOT reused.

## Reference gate (checked live `schedule-tweets/images/reference/`, 2026-11-16)
| project | bucket | action |
|---|---|---|
| PENGU (Pudgy Penguins) | lesser-known WITH ref `pengu.webp` | every Pengu image generated WITH the ref |
| PEPE | no ref on disk (meme frog) | generic grumpy green cartoon frog king, no logo, no text; flagged |

## Beats
| # | t in-out (s) | spoken line | mode | visual | file | ref |
|---|---|---|---|---|---|---|
| 0 | frame 0 | (cover) | thumb | Pengu in gold shades before a towering gold-coin stack, title "PENGU TO $30 BILLION?" + chip "I'M REALLY SERIOUS" code-drawn | thumb-pch6-pengu-30b.png | pengu.webp |
| base | 0.03-3.44 | "i've always been saying it, man... i'll just keep saying it" | base | CMC Pengu page | - | - |
| B1 | 3.44-4.85 | "pengu is gonna flip pepe" | FULL (hook) | Pengu snatching the crown off a toppling green frog king | broll-pch6-dethrone.png | pengu.webp |
| base | 4.85-7.86 | "it's gonna be one of the biggest meme coins. i mean it could be like a 100x" | base + badge 6.50-7.80 "100X / $300M TO $30B" | CMC page | - | - |
| B2 | 7.86-9.30 | "it could get to 30 billion" | FULL (climax) | Pengu surfing a colossal tidal wave of gold coins | broll-pch6-gold-wave.png | pengu.webp |
| base | 9.30-10.86 | "i'm like, i'm really serious with pengu" | base + alpha overlay 9.50-10.84 (serious Pengu in shades, glow) | CMC page | ovl-broll-pch6-serious.png | pengu.webp |
| B3 | 10.86-13.24 | "well yeah, i got me some more pengu" | content | Pengu pushing a cart overflowing with gold coins | broll-pch6-cart.png | pengu.webp |
| base | 13.24-15.23 | "i think pengu at 300 million's a steal" | base | calls table with PENGU +34.8% (the receipt) | - | - |

## SFX (t = event minus library attack_sec)
| crest (s) | cue | why |
|---|---|---|
| 0.00 | transition_rapid_whoosh-tight.wav | thumbnail cut |
| 3.30 | Impacts/Impact_Hit_01-2-short.wav (dur 0.40) | hook full-screen (moved off "pengu" in QA) |
| 6.50 | DING-093.wav | 100X badge |
| 7.86 | Impacts/Kick_Impact_01-short.wav | 30B climax full-screen |
| 9.50 | kinetic-text/fast-swoosh.wav | serious-Pengu overlay in |
| 11.04 | Cash Register-ching.wav | "got me some more" |

No SFX on the last word ("steal" 14.88-15.04, clip ends 15.23).
Zero orphans: 5 generated assets (thumb, 3 b-roll, 1 overlay), each used exactly once.

QA fix (splice, 2026-11-16): B3 in 11.04 -> 10.86 (Bloodsport clip flashed frames 330-332 under the fade-in), overlay out -> 10.84, B1 out -> 4.85. Cash-register crest stays 11.04 (cart fully in).
QA audio fix (render_short.py audio, 2026-11-16): hook impact crest 3.44 -> 3.30 (masked "pengu"); receipt whoosh at 13.24 deleted (masked "i think"). 6 SFX events.
