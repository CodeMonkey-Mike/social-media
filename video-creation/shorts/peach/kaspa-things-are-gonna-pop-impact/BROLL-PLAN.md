# BROLL-PLAN: peach clip 7 `kaspa-things-are-gonna-pop-impact` (impact, 19.44 s video / 19.47 s audio spine, comp 30 fps)

Comp: `PeachKaspaPopImpact` · constants `remotion/src/constants-peach-kaspa-things-are-gonna-pop-impact.ts` · captions `remotion/src/captionsPeachKaspaPopImpact.ts` · public dir `shorts/peach/render-assets`
Seam (measured row-gradient, t=1/8/15/18.5 s): **854** · accent TEAL (Kaspa)
Base content zone (1 fps contact sheet `_qa/base-sheet.png`): 0-6 TradingView BTC daily chart (the dump) with chat banner "Bought a little more Kaspa yesterday"; 6-14 the Crypto Matt tweet + F2Pool transactions table; 14-17 dexscreener chart with chat "kaspa coming to A tier exchange, mark my words"; 17-19.4 Google "trestly" results with a burned-in thumbs-up.

Directives (`clip_directives.py --batch peach --clip 7`): none. No coverage exemption.
Uniqueness: clip 3 (same topic) used thumb-pch3 / broll-pch3-* / ovl-broll-pch3-sunrise; every clip-7 image below is a NEW, different treatment (no reuse).

Budget: 4 b-roll beats, 1.70 + 1.50 + 2.10 + 1.44 = **6.74 s / 19.44 s = 34.7 % b-roll, 65.3 % base** (band 25-35 / 65-75). Full-screens: 3 (hook, climax, close) = the firm cap.

## Reference gate (checked live `schedule-tweets/images/reference/`, 2026-11-16)
| project | bucket | action |
|---|---|---|
| Kaspa | well-known AND ref on disk `kaspa-logo.png` | every Kaspa-branded image generated WITH the ref (thumb, beaten, eruption, piggy bank, bandaged-coin overlay) |
| (smart money) | not a project | generic faceless whale-in-suit, blank gold coins |

## Beats
| # | t in-out (s) | spoken line | mode | visual | file | ref |
|---|---|---|---|---|---|---|
| 0 | frame 0 | (cover) | thumb | battered teal Kaspa coin standing in a storm, a sunrise breaking through behind it; title code-drawn "A BRIGHT FUTURE FOR KASPA" + chip "JUST A LOT OF PAIN RIGHT NOW" | thumb-pch7-kaspa-storm.png | kaspa-logo.png |
| base | 0.03-2.60 | "we've been like this for too long. we never got a break" | base | the dumped BTC chart = the pain | - | - |
| B1 | 2.60-4.30 | "keep getting beaten over the head" | FULL (hook) | Pixar Kaspa coin character with a bandaged head ducking giant red candlestick mallets | broll-pch7-beaten.png | kaspa-logo.png |
| base | 4.30-5.42 | "as i keep saying" | base | BTC chart -> tweet | - | - |
| B2 | 5.42-6.92 | "smart money keeps building" | content | faceless whale in a business suit laying glowing teal foundation blocks underwater | broll-pch7-whale-builds.png | - |
| base | 6.92-10.10 | "they keep investing and i think this things are just" | base | tweet + transactions table | - | - |
| B3 | 10.10-12.20 | "gonna pop, man. things are gonna pop" | FULL (climax) | teal volcano erupting Kaspa coins into the night sky | broll-pch7-eruption.png | kaspa-logo.png |
| base | 12.20-18.00 | "2027 is gonna be awesome. there's a bright future for kaspa. just a lot of pain right now. yeah, it's" | base (+ badge 12.40-14.20 "2027 / AWESOME"; + alpha overlay 14.60-16.90 bandaged glowing Kaspa coin) | tweet, then the dex chart | ovl-broll-pch7-bandaged.png | kaspa-logo.png |
| B4 | 18.00-19.44 | "always good to buy more kaspa" | FULL (close, holds to last frame) | hand dropping a Kaspa coin into a teal piggy bank stuffed with Kaspa coins | broll-pch7-piggy.png | kaspa-logo.png |

## SFX (t = event minus attack_sec from `assets/sfx/library.json`)
| event (s) | cue | why |
|---|---|---|
| 0.00 | transition_rapid_whoosh-tight.wav | thumbnail cut |
| 2.60 | Punch 1.mp3 | hook full-screen "beaten over the head" |
| 5.42 | Cinematic Whoosh 06.wav (short) | smart-money cutaway |
| 10.10 | Boom - Big Reveal-short.wav | climax "pop" full-screen |
| 12.40 | DING-093.wav | 2027 badge |
| 18.00 | Cash Register-ching.wav | "buy more kaspa" close |

Zero orphans: 6 generated assets (thumb + 4 b-roll + 1 overlay), each used exactly once.
