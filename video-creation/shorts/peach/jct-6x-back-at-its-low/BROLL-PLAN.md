# BROLL-PLAN: peach clip 4 `jct-6x-back-at-its-low` (full, 27.24 s spine, comp 30 fps / 817 f)

Comp: `PeachJct6xLow` · constants `remotion/src/constants-peach-jct-6x-back-at-its-low.ts` · captions `remotion/src/captionsPeachJct6xLow.ts` · public dir `shorts/peach/render-assets`
Seam (measured row-gradient, t=3/9/15/20/26 s): **854** · accent YELLOW (the pump / numbers), green for "get in" / community
Base content zone (scene-detect on the top 850 px): 0-3.36 the terminal gainers table with the JCT row "+294.1%" (the pump receipt); **3.36-3.76 BLACK** (page switch); 3.76-10.64 CoinMarketCap JCT page stuck on "Loading data..."; 10.64-27.24 the CMC JCT chart: the spike and the slide back to the low, "Junction Markets" table below it.

Words: the base `whisper-words.json` DROPPED "Look at that." (10.82-11.14). Captions are built from `whisper-words-verified.json` (medium.en word pass on the staged spine, patched). STT fixes: "six X" -> 6x, "American community" -> my community; "uh" + doubled "the" dropped.

Budget: 4 b-roll beats, 2.26 + 2.36 + 2.14 + 2.53 = **9.29 s / 27.23 s = 34.1 % b-roll, 65.9 % base** (band 25-35 / 65-75). Full-screens: 2 (hook payoff, climax), under the firm cap of 3. The chart reveal ("look at that, it returned to its low") is a deliberate BASE beat: the chart IS the visual.

## Reference gate (checked live `schedule-tweets/images/reference/`, 2026-11-16)
| project | bucket | action |
|---|---|---|
| JCT (Janction) | LESSER-KNOWN, NO reference on disk | no generated JCT logo anywhere: every coin prompt is a blank gold coin; the JCT name is carried by code-drawn type (thumb title, badges) and by the real CMC page in the base. FLAG: Mike can add a Janction reference for future clips. |

## Beats
| # | t in-out (s) | spoken line | mode | visual | file | ref |
|---|---|---|---|---|---|---|
| 0 | frame 0 | (cover) | thumb | blank gold coin that rode a green spike and slid back down to the canyon floor; title "JCT DID A 6X. NOW IT'S BACK AT ITS LOW" + chip "A FREEBIE ENTRY?" code-drawn | thumb-pch4-jct-roundtrip.png | - |
| base | 0.03-3.30 | "JCT, how's JCT doing? we did a huge pump." | base | the gainers table, JCT +294.1% = the receipt | - | - |
| B1 | 3.30-5.56 | "we had a huge pump on this" | FULL (hook payoff; also hides the 0.4 s black page switch) | neon green candle erupting like a rocket, blank gold coin riding it | broll-pch4-huge-pump.png | - |
| base | 5.56-13.24 | "it was like a 6x overnight last week. how is it right now? look at that. it returned to its low." | base (+ badge 6.40-8.90 "6X OVERNIGHT" over the loading page; + alpha overlay 11.80-13.10 red down-arrow beside the chart) | CMC page loading, then the chart lands at 10.64 | ovl-pch4-down-arrow.png | - |
| B2 | 13.24-15.60 | "it's a good time for you guys to get in, right?" | content | vault door open at the bottom of the dip, faceless figures walking in | broll-pch4-get-in.png | - |
| base | 15.60-18.66 | "it's a good time for you guys to get in." (repeat) | base | the chart at its low | - | - |
| B3 | 18.66-20.80 | "it's a freebie, right? if you're not in my community" | FULL (climax) | gift box bursting open with blank gold coins | broll-pch4-freebie.png | - |
| base | 20.80-24.70 | "our community members, we got the 6x." | base (+ badge 22.70-24.50 "COMMUNITY GOT THE 6X" below the chart) | the chart | - | - |
| B4 | 24.70-27.24 | "well, yeah, this is in the compute narrative" | content (close, holds to the last frame) | AI compute data center, unbranded GPUs | broll-pch4-compute.png | - |

## SFX (attack-aligned per `assets/sfx/library.json`; every hit in a speech gap)
| t (s) | cue | why |
|---|---|---|
| 0.00 | transition_rapid_whoosh-tight.wav | thumbnail cut |
| 3.27 | Boom - Big Reveal-short.wav (peak 3.30) | hook full-screen: the pump |
| 6.25 | DING-093.wav (peak 6.40) | 6X badge |
| 11.96 | ding/sudden-shock-tight.wav (peak 12.25) | "its low" + down-arrow |
| 12.51 | Cinematic Whoosh 06.wav (dur 0.75, peak 13.10) | get-in cutaway |
| 18.14 | risers/Tension_Rise_Logo_Reveal_3-1s.wav | build into the freebie |
| 18.36 | Impacts/Kick_Impact_01-tight.wav (dur 0.30, peak 18.55, ends before "It's" 18.66; the -short tail masked "It's" -> "That's", whisper-swept) | freebie climax full-screen |
| 23.58 | Cash Register-ching.wav (peak 23.70) | "we got the 6x" receipt badge |
| 24.40 | transition_rapid_whoosh.mp3 (peak 24.58) | compute cutaway |

Zero orphans: 6 generated assets (thumb + 4 b-roll + 1 overlay), each used exactly once.
