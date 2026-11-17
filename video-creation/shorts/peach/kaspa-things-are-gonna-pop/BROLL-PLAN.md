# BROLL-PLAN: peach clip 3 `kaspa-things-are-gonna-pop` (full, 31.20 s spine, comp 30 fps)

Comp: `PeachKaspaThingsPop` · constants `remotion/src/constants-peach-kaspa-things-are-gonna-pop.ts` · public dir `shorts/peach/render-assets`
Seam (measured row-gradient, t=3/15/20/27 s): **854** · accent TEAL (Kaspa)
Base content zone (scene-detect on the top 850 px): 0-20.76 Crypto Matt's tweet "In a strange turn of events the MARA wallet has started to receive KASPA deposits from F2Pool" + the F2Pool transactions table (the receipt); 20.76-26.08 TradingView BTC daily chart (dump) with chat banner "Bought a little more Kaspa yesterday"; 26.08-29.12 dexscreener chart with chat banner "kaspa coming to A tier exchange, mark my words"; 29.12-31.20 Google "trestly kas" results with a burned-in thumbs-up.

Caption name check: the tweet ON SCREEN reads "MARA wallet", so "mara" is confirmed from the picture (the clip-plan's "malware" garble does not apply to this cut; Whisper here heard "Mara"). Casper -> Kaspa everywhere.

Budget: 4 b-roll beats, 2.52 + 2.96 + 3.44 + 1.64 = **10.56 s / 31.20 s = 33.8 % b-roll, 66.2 % base** (band 25-35 / 65-75). Full-screens: 3 (hook payoff, climax, close) = the firm cap.

## Reference gate (checked live `schedule-tweets/images/reference/`, 2026-11-16)
| project | bucket | action |
|---|---|---|
| Kaspa | well-known AND ref on disk `kaspa-logo.png` | every Kaspa-branded image generated WITH the ref (thumb, pop, buy-more, sunrise overlay) |
| MARA (Marathon) / F2Pool | no ref; not the subject of an image | generic unbranded mining machines, no logo; the real names stay on the tweet receipt in the base |

## Beats
| # | t in-out (s) | spoken line | mode | visual | file | ref |
|---|---|---|---|---|---|---|
| 0 | frame 0 | (cover) | thumb | giant teal Kaspa coin rising behind a mining warehouse whose doors burst open with teal light; title code-drawn | thumb-pch3-kaspa-ready.png | kaspa-logo.png |
| base | 0.03-5.16 | "a strange change of events. the mara wallet has started to receive kaspa deposits" | base | the tweet + F2Pool transactions table = the receipt | - | - |
| B1 | 5.16-7.68 | "this could indicate them turning on mining machines again" | FULL (hook payoff) | aisle of generic ASIC miners switching back on, power lever pulled to ON | broll-pch3-miners-on.png | - |
| base | 7.68-12.10 | "or simply receiving final payouts from the pool. they're getting ready for something, right?" | base | tweet shows again | - | - |
| B2 | 12.10-15.06 | "smart money keeps building things. they keep investing" | content | faceless suits building a glowing teal tower | broll-pch3-smart-money.png | - |
| B3 | 15.06-18.50 | "and i think things are just going to pop, man. things are going to pop." | FULL (climax, hard cut from B2) | Kaspa coin bursting out of a stone shell, fireworks | broll-pch3-pop.png | kaspa-logo.png |
| base | 18.50-29.56 | "2027 is going to be awesome / we've been like this for too long / never got a break / beaten over the head / bright future for kaspa, just a lot of pain right now" | base (+ badge 18.80-20.60 "2027" ; + alpha overlay 26.40-28.90 Kaspa sunrise) | tweet, then the dumped BTC chart (the pain IS the chart), then the dex chart with "A tier exchange" chat | ovl-broll-pch3-sunrise.png | kaspa-logo.png |
| B4 | 29.56-31.20 | "it's always good to buy more kaspa" | FULL (close) | cart overflowing with Kaspa coins | broll-pch3-buy-more.png | kaspa-logo.png |

## SFX (attack-aligned per `assets/sfx/library.json`)
| t (s) | cue | why |
|---|---|---|
| 0.00 | transition_rapid_whoosh-tight.wav | thumbnail cut |
| 5.16 | Impacts/Impact_Hit_01-2-short.wav | hook full-screen: miners switch on |
| 11.95 | Cinematic Whoosh 06.wav (dur 0.75; peak in the gap before "smart", the full tail masked it) | smart-money cutaway |
| 15.06 | Impacts/Kick_Impact_01-short.wav | climax "pop" full-screen |
| 18.80 | DING-093.wav | 2027 badge |
| 29.56 | Cash Register-ching.wav | "buy more kaspa" close |

Zero orphans: 6 generated assets (thumb + 4 b-roll + 1 overlay), each used exactly once.
