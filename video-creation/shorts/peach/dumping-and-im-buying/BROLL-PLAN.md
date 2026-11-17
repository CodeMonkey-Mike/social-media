# BROLL-PLAN: peach clip 5 `dumping-and-im-buying` (full, 48.92 s spine, comp 30 fps)

Comp: `PeachDumpingImBuying` · constants `remotion/src/constants-peach-dumping-and-im-buying.ts` · captions `remotion/src/captionsPeachDumpingImBuying.ts` · public dir `shorts/peach/render-assets`
Seam (measured row-gradient, t=3/15/40 s): **854** · accent Arbitrum blue `#28a0f0`
Build directives for clip 5 (`clip_directives.py --batch peach --clip 5`): none. No coverage exemption.

Base content zone (scene-detect on the top 850 px): 0-9.48 TradingView BTC daily chart (the dump, red candles) · 9.48-12.16 Mike's calls table (KAS / TAO / ARB / LTC / JCT / PENGU / CC) · 12.16-30.48 CoinMarketCap Litecoin page (price ~$45 = the receipt) · 30.48-32.0 calls table again · 32.0-~36 CMC Arbitrum page loading · ~36-48.92 CoinMarketCap Arbitrum page (chart + market cap).

Budget: 5 b-roll beats, 2.92 + 3.16 + 3.48 + 2.70 + 3.42 = **15.68 s / 48.92 s = 32.1 % b-roll, 67.9 % base** (band 25-35 / 65-75). Full-screens: 2 (hook, climax) = under the firm cap of 3. The long base stretch 21.78-33.36 is deliberate: the Litecoin CMC page with the $45 price is exactly what Mike is talking over (a code badge marks the number), and 36.06-45.50 is the Arbitrum CMC page he reads the 900 million off (two code badges).

## Reference gate (checked live `schedule-tweets/images/reference/`, 2026-11-16)
| project | bucket | action |
|---|---|---|
| Arbitrum (ARB) | lesser-known WITH ref on disk `arbitrum-arb.png` | every Arbitrum-branded image generated WITH the ref (thumb, arb-tokenized, arb-10x) |
| Litecoin (LTC) | WELL-KNOWN (no ref needed) | named explicitly in the prompt, model draws the real Litecoin mark (ltc-privacy, ltc-after-years, thumb) |
| Robinhood | WELL-KNOWN, not an image subject | code-drawn badge only, no generated logo |
| Bitcoin | not an image subject | the base BTC chart is the visual |

## Beats
| # | t in-out (s) | spoken line | mode | visual | file | ref |
|---|---|---|---|---|---|---|
| 0 | frame 0 | (cover) | thumb | crash storm of red candles, panicked silhouettes run away, one calm figure scoops a Litecoin coin + an Arbitrum coin into a basket; title code-drawn | thumb-pch5-dump-buy.png | arbitrum-arb.png |
| base | 0.03-3.30 | "we've been dumping. we have been dumping" | base | the BTC daily chart dumping = the receipt | - | - |
| B1 | 3.30-6.22 | "and i've been buying a whole bunch of plays" | FULL (hook) | crash trading floor, crowd runs for the exits, one figure pushes a shopping cart filling with coins | broll-pch5-buying-the-dump.png | - |
| base | 6.22-11.46 | "at really low prices. really, really low prices. they all got their little things" (+ badge 7.62-9.40 "REALLY LOW PRICES") | base | BTC chart, then the calls table | - | - |
| B2 | 11.46-14.62 | "litecoin right now is an optional privacy coin" | content | Litecoin coin half cloaked in an invisibility hood | broll-pch5-ltc-privacy.png | - (well-known) |
| base | 14.62-18.30 | "which is great. i think litecoin is a good play" | base | CMC Litecoin page | - | - |
| B3 | 18.30-21.78 | "i got into this again after all these years. i was shocked that i did it" | content | Litecoin coin lifted out of a dusty attic treasure chest | broll-pch5-ltc-after-years.png | - (well-known) |
| base | 21.78-33.36 | "pretty good, especially with that news. to get litecoin at a $45 coin right now, that's insanely low, that is so low. and then another one i got into recently" (+ badge 27.10-30.34 "LTC $45 / INSANELY LOW") | base | CMC Litecoin page with the price, then the calls table | - | - |
| B4 | 33.36-36.06 | "arbitrum. tokenized assets narrative" | content | Arbitrum coin absorbing real-world assets turning into tokens | broll-pch5-arb-tokenized.png | arbitrum-arb.png |
| base | 36.06-45.50 | "robinhood is using the arbitrum tech... good for some good pumps. it was 900 million at arbitrum" (+ badge 36.20-38.90 "ROBINHOOD / RUNS ON ARB TECH"; badge 43.66-45.40 "$900M / ARB MCAP") | base | CMC Arbitrum page | - | - |
| B5 | 45.50-48.92 | "what if it goes to 10 billion? yeah, 10x. relatively safe" | FULL (climax, holds to the last frame) | Arbitrum coin rocketing up a ten-step green chart | broll-pch5-arb-10x.png | arbitrum-arb.png |

## SFX (attack-aligned per `assets/sfx/library.json`)
| t (s) | cue | why |
|---|---|---|
| 0.00 | whoosh | thumbnail cut |
| 3.30 | impact | hook full-screen: buying while everyone dumps |
| 7.62 | ding | "really low prices" badge |
| 11.46 | whoosh | Litecoin cutaway |
| 27.10 | impact / ding | "$45" badge reveal |
| 33.36 | whoosh | Arbitrum cutaway |
| 43.66 | ding | 900M badge |
| 45.50 | riser into impact | climax 10x full-screen |

(Exact files, volumes and attack offsets are in the constants file; any cue that masks the VO in the whisper-verify is retimed, trimmed or deleted.)

Zero orphans: 6 generated assets (thumb + 5 b-roll), each used exactly once.
