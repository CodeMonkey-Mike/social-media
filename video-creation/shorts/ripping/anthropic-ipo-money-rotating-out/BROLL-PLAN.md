# BROLL-PLAN: ripping clip 5 `anthropic-ipo-money-rotating-out` (full, 32.96 s spine, 1080x1920, source 25 fps)

Spine `anthropic-ipo-money-rotating-out-final.mp4` (= `render-assets/anthropic-ipo-money-rotating-out.mp4`) · words `whisper-words.json` · public dir `shorts/ripping/render-assets` · image code `rip5`
Scoped directives (`clip_directives.py --batch ripping --clip 5`, run 2026-11-18): **none (0 of 0)** -> the full coverage budget applies, no exemption.
Seam: ~855 px (eyeballed off 4 content-zone crops at t = 5 / 11 / 15 / 21 s; RE-MEASURE with the row gradient at build).
Accent: **RED** `#FF3B3B` (the dump, "further down"); **GREEN** `#2EE88A` (the plays pumping); **Anthropic coral** `#D97757` only on the "ANTHROPIC IPO" badge. Bitcoin orange stays in the images, not the type.

## Base content zone (2 s contact sheet + 4 full-res crops)
The whole clip is ONE on-message screen share: **TradingView BTCUSD, 1W (weekly) Bitstamp**, price pane (about x 0-735, y 0-430 of the content zone) with Mike's blue arrows, the RSI pane below it (about y 450-720), the watchlist on the right (x 740-1080). Mike scrolls the chart (date axis moves Nov '26 -> Mar '26 -> Jun '26 -> Feb '27) and, from about 19 s, **draws a black "further down" curve** right of the last candle (about x 375-510, y 240-300 at t = 21 s).
- 0-9 s: the hook. Arrows on the chart, but the speech is the causal claim (SpaceX IPO, Anthropic IPO, money rotating out), so the hook and the claim carry full-screens with base breaths between them.
- **9.10-22.78 s: Mike points at the chart ("over here", "this date", "candles are weekly", "bottomed over here", "going here", "the same way this happened over here") and draws the curve. That IS the visual: deliberately ALL BASE, no generated image.** Code-drawn badges break it up, placed ONLY over the RSI pane band (y about 470-700, measure at build), never over the price pane where the arrows and the drawn curve live, and never over the caption band.
- 22.78-32.96 s: conviction + payoff ("it is what it is", "a few plays... pumping on a day like this, it's crazy"), off the chart, so b-roll earns its place here.

## Caption name check
"SpaceX" and "Anthropic" are transcribed correctly (montserrat preset lowercases on screen; no token merge needed). Whisper's "I'm gonna get a pump in like at a day like this" is a slur of "that are pumping on a day like this" (clip-plan wording); whisper-verify at build and keep as heard unless the render clearly says otherwise. No em dashes on screen.

## Budget
5 generated b-roll beats: 1.56 + 2.60 + 2.36 + 1.76 + 2.72 = **10.99 s / 32.96 s = 33.3 % b-roll, 66.7 % base** (band 25-35 / 65-75).
Full-screens: **3** (hook B1, the core claim B2, climax B5) = the firm cap. Longest full-screen 2.72 s (under the ~3 s face-replacement limit).
Images to generate: **6** (thumb + 5 b-roll), every one unique to this clip (concepts checked against rip1-rip4: no reuse of the red-bubble field, the plunging BTC/ETH storm, or the green-coin-rocket), each used exactly once.
The long base stretch 9.10-22.78 is NOT empty: Mike's live arrows + scrolling + drawing change the content zone under it, and code badges C2-C4 (no generated image, not in the worklist) land on his talking points.

## Reference gate (run LIVE: `ls schedule-tweets/images/reference/`, 2026-11-18)
No file matches anthropic / claude / spacex / bitcoin / btc / musk.
| project / name | spoken? | bucket | action |
|---|---|---|---|
| SpaceX | YES (hook, precedent) | WELL-KNOWN brand | named explicitly in the prompt, the model draws its real logo; **no ref needed** |
| Anthropic | YES (the named cause, x2) | WELL-KNOWN brand (AI major, same tier as OpenAI) | named explicitly in the prompt, real logo/wordmark expected; **no ref needed**. If visual-qa finds an invented/garbled Anthropic mark, the build remaps (the C1 code badge already carries the name as type) |
| Bitcoin | NO (only the BTCUSD chart in the base) | WELL-KNOWN brand | named in B2 (the money rotates OUT of Bitcoin: the chart he shows); real orange Bitcoin B expected; no ref needed |
| Elon Musk / Dario Amodei / any real person | NO | n/a | NEVER drawn; every prompt bans real faces; figures are faceless silhouettes or a generic Pixar cartoon guy |
| the "plays" (unnamed coins) | NO name | generic | blank / unbranded, no invented logos (prompts say so) |

## Beats
| # | t in-out (s) | spoken line | mode | visual | file | ref |
|---|---|---|---|---|---|---|
| 0 | frame 0 | (cover) | thumb | a cracked giant Bitcoin coin pouring a river of gold coins across a bridge into a gleaming skyscraper bearing the Anthropic logo, a SpaceX rocket launching in the distance; dark top 40 % for the code-drawn headline "ALL THIS MONEY IS ROTATING OUT" / "FOR THE ANTHROPIC IPO" (coral accent on ANTHROPIC IPO) | broll-rip5-thumb.png | - (well-known, named) |
| base | 0.04-1.54 | "This was like the" | base | face + BTC weekly chart with Mike's arrows (a breath before the hook image) | - | - |
| B1 | 1.54-3.10 | "SpaceX IPO, right?" | **FULL (hook)** | a SpaceX Falcon 9 with the SpaceX logo blasting off from the floor of a Wall Street trading hall, cash and confetti blowing out, blank ticker boards | broll-rip5-spacex-ipo.png | - (well-known, named) |
| base | 3.10-6.50 | "And so now the thing is this is the Anthropic IPO." | base (+ **C1** 4.94-6.40 code badge "ANTHROPIC IPO", coral, RSI band) | BTC weekly chart | - | - |
| B2 | 6.50-9.10 | "All this money rotating out by the Anthropic IPO." | **FULL (core claim / major transition)** | a giant Bitcoin coin tipped like a jug, a torrent of gold coins pouring out and flowing in a river uphill into a glowing new tower bearing the Anthropic logo; faceless silhouettes hauling money bags across | broll-rip5-rotate-out.png | - (well-known, named) |
| base | 9.10-22.78 | "SpaceX IPO, I believe it was like over here. This date, candles are weekly, it was a few more weeks before it actually bottomed over here. Does that mean that we're gonna have like a bunch of extra weeks going here, maybe a little bit further down the same way this happened over here?" | base (+ **C2** 9.30-12.20 code badge "SPACEX IPO WEEK", steel-white; + **C3** 13.60-16.18 code badge "A FEW MORE WEEKS / THEN THE BOTTOM"; + **C4** 18.38-21.16 red badge "MORE WEEKS DOWN?" with a code-drawn red down arrow; all in the RSI band, never over the price pane) | Mike pointing + drawing on the chart: the receipt | - | - |
| B3 | 22.78-25.14 | "Well, you know, it is what it is, we'll take it as it comes." | content | Pixar cartoon guy in a hoodie lounging in a beach chair with sunglasses, calmly sipping coffee, while a storm of red candlesticks rages behind him | broll-rip5-take-it.png | - |
| base | 25.14-28.16 | "Man, I have no problem with it right now because like got a few" | base | BTC weekly chart (his face below carries the conviction) | - | - |
| B4 | **28.16-30.24** (built; planned 27.60-29.36) | "plays, man, that are pumping, like at" | content (butts B5: hard cut) | a hand fanning three glowing green playing cards, each face showing only a bold upward green arrow, at a dark card table while red rain falls outside the window | broll-rip5-few-plays.png | - |
| B5 | 30.24-32.93 (last frame) | "day like this, it's crazy. Absolutely insane." | **FULL (climax, runs to the last frame)** | the same style cartoon hoodie guy at his trading desk, mind blown (hands on head, jaw dropped), every monitor deep red except one whose bright green line bursts out of the screen in a shower of green sparks | broll-rip5-insane.png | - |

Hard cuts in and out of every beat (style guide: 95 % hard cuts). No two b-roll beats are adjacent, so there is no b-roll-to-b-roll handoff. C1-C4 never overlap each other, a b-roll beat, or the caption band. B5 runs to the last frame (no fade-out at the end).

## SFX (proposal; crest-align from library.json attack_sec and whisper-verify the mix at build per the skill)
| t (s) | cue | why |
|---|---|---|
| 0.04 | transition_rapid_whoosh-tight.wav | thumbnail cut |
| 1.54 | Impacts/Impact_Hit_01-2-short.wav | hook full-screen: the SpaceX launch (keep the crest off "SpaceX" if it masks) |
| 4.90 | DING-093.wav | C1 "ANTHROPIC IPO" badge |
| 6.44 | Cinematic Whoosh 06.wav (dur ~0.75) | into the core-claim full-screen "all this money rotating out" |
| 9.26 | Impacts/card-impact-hit01-3-short.wav | C2 "SPACEX IPO WEEK" badge |
| 18.34 | Impacts/Kick_Impact_01-short.wav | C4 red "MORE WEEKS DOWN?" badge |
| 22.74 | transition_rapid_whoosh.mp3 (trim) | out of the long chart stretch into B3 |
| 27.56 | Cash Register-ching.wav (truncate the tail) | "got a few plays" |
| 29.24 -> 30.24 | Riser Sound Effect-2s.wav (trimmed to end at 30.24) into Boom - Big Reveal-short.wav at 30.24 | build into the climax "it's crazy. Absolutely insane." |

## Zero orphans
6 generated assets (`broll-rip5-thumb`, `-spacex-ipo`, `-rotate-out`, `-take-it`, `-few-plays`, `-insane`), each mapped to exactly one beat above and listed in `broll-images.json`. C1-C4 are code-drawn (no file). If visual-qa leaves any image FAILED, the build remaps that beat (another clean rip5 image, a code-drawn card, or base) and updates this table.

## AS BUILT (stage 2, 2026-11-19)
- Composition `RippingAnthropicIpo` (`remotion/src/RippingAnthropicIpo.tsx` + `constants-ripping-anthropic-ipo-money-rotating-out.ts` + `captionsRippingAnthropicIpo.ts`), 988 f @30 = 32.933 s. Render `remotion/out/ripping/5-anthropic-ipo-money-rotating-out.mp4`.
- Seam MEASURED 854 (row-gradient step at 853/854 on 8 of 8 frames). Caption band capY 960. Badges C1-C4 centred y 610 (RSI pane), x 540.
- visual-qa PASS 6/6, own persona inspection clean: **no remaps**.
- **One timing change vs the plan:** B4 moved from 27.60-29.36 to 28.16-30.24 so it butts B5 and hard-cuts into the climax (the planned 0.88 s base gap would have flashed the chart for under a second between a content image and a full-screen). The image now lands ON "plays". Coverage 1.56 + 2.60 + 2.36 + 2.08 + 2.69 = **11.29 s / 32.93 s = 34.3 % b-roll, 65.7 % base**; full-screens 3.
- Caption fix: whisper-words-verified.json patches 28.84-29.54 "I'm gonna get a pump in" -> "that are pumping," (3 of 4 staggered decodes incl. large-v3).
- SFX as built (10 cues, crest-aligned): whoosh-tight 0.033 (v.12) · Impact_Hit_01-2-short 1.40 (v.14) · DING-093 4.79 (v.10) · Cinematic Whoosh 06 5.91 (v.22) · card-impact-hit01-3-short 9.19 (v.14) · Kick_Impact_01-short 18.19 (v.16) · transition_rapid_whoosh 22.60 (v.14) · Cash Register-ching 28.04 (v.12) · Riser 2s 28.225 (v.30, crest 30.24) · Boom - Big Reveal-short 30.21 (v.14). Whisper-verified offline + on the render vs an encode-matched control: no masker.
- Zero orphans: 6 rip5 images, each referenced exactly once (thumb on frame 0, B1-B5).
