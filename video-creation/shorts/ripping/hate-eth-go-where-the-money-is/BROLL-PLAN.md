# BROLL-PLAN: ripping clip 4 `hate-eth-go-where-the-money-is` (full, spine 36.48 s @25 fps; comp 30 fps, ~1095 frames, render_short.py renders at 30)

Spine: `hate-eth-go-where-the-money-is-final.mp4` (staged as `render-assets/hate-eth-go-where-the-money-is.mp4`, same 36.48 s; stage 2: confirm the staged copy is the FINAL, the bytes differ, the durations match).
Public dir `shorts/ripping/render-assets` · image code `rip4` · accent ETH VIOLET (`#8c7cf0`) + PUMP GREEN, teal brand; Litecoin beats SILVER/BLUE.
Times are SPINE seconds = comp seconds (`LivestreamShort` plays the base from 0 under a one-frame thumb).
Scoped directives for clip 4 (`clip_directives.py --batch ripping --clip 4`): **none (0 of 0)**, so the full budget applies.
Clip-plan note carried into every visual: **ETH is NOT framed as one of his stacking picks.** He hates it and buys it because the money is there. No "my bag" imagery.

## Base video, measured (scene detect on the content zone at 0.06 + 0.15, contact frames every ~2 s, blackdetect)
| spine s | content zone (upper 50%) | face zone |
|---|---|---|
| 0.00-29.92 | X post: Watcher Guru "Zelle selects Solana to expand international payments" (Zelle + Solana logos). **Off-topic for this clip** (ETH / Litecoin), static | Mike |
| 29.92-36.48 | **CMC Ethereum page**: 1Y price chart, ETH $1,761, -43.6% (1Y), Ethereum Markets table; a stream-chat ticker band crosses at y~720-780 | Mike |

blackdetect: **no black frames**. One scene change only (29.92). No real-person face or insert to cover.
The CMC ETH page IS the receipt for the close ("$20,000 ETH ... conservative"): it stays visible, the number lands as a code card.
The Zelle/Solana post is low value, but that is NOT a license to blanket: the base still shows in real stretches
(0.04-2.10, 7.00-8.60, 10.80-11.70, 17.40-23.60, 26.20-27.60), and code badges carry the zone changes there.

## Reference gate (checked LIVE `schedule-tweets/images/reference/`, 2026-11-18)
| named project | bucket | action |
|---|---|---|
| Ethereum (ETH) | WELL-KNOWN, **and a ref is on disk**: `ethereum-eth.png` (the grey/black octahedron diamond mark) | named explicitly AND generated WITH the ref on every ETH beat (T, B1, B2, B4, B5) |
| Bitcoin | WELL-KNOWN, no ref on disk | named explicitly ("real orange Bitcoin B logo"), no ref needed |
| Litecoin (LTC) | WELL-KNOWN major (top-20 since 2011, its own ETFs), **no ref on disk** | named explicitly ("the real Litecoin logo: silver coin with the stylized slashed L"). Not blocked by the missing file (gate 2a, well-known bucket). Visual-qa: confirm the mark is the slashed L, not an invented glyph; if it comes back wrong, stage 2 remaps B3 to a code-drawn LTC card. **Flag for Mike: a `litecoin-ltc.png` reference would harden this.** |
| Solana / Zelle | on screen 0-29.92 only (the X post), not spoken, not this clip's topic | not featured |

## Beats
| # | spine in-out (s) | spoken line | mode | visual | file | ref |
|---|---|---|---|---|---|---|
| T | frame 0 | (cover) | thumb | a giant glossy violet Ethereum diamond coin flipping a smaller Bitcoin coin off a summit / podium, sparks; top 40% empty for the CODE-DRAWN title **"I HATE ETH"** / **"BUT IT WILL FLIP BITCOIN"** | broll-rip4-thumb.png | ethereum-eth.png |
| base | 0.04-2.10 | "even believe, I kid you not" | **BASE** (Mike on cam, base-first open) | - | - | - |
| B1 | 2.10-4.70 | "that one day Ethereum is gonna flip Bitcoin" | **FULL (hook)** | the flip: a colossal Ethereum coin rising and overturning a huge Bitcoin coin like a seesaw / coin flip in a cosmic arena, Bitcoin tumbling | broll-rip4-hook-flip.png | ethereum-eth.png |
| B2 | 4.80-7.00 | "I hate ETH, but I gotta go where the money is" | content | grumpy Pixar character holding his nose, dragging his feet toward a glowing Ethereum vault overflowing with gold coins and cash; reluctant | broll-rip4-money-vault.png | ethereum-eth.png |
| base | 7.00-8.60 | "I did the same thing with Litecoin, I was like" | **BASE** | - | - | - |
| B3 | 8.60-10.80 | "I can't believe I'm getting back in the Litecoin, right?" | content | a dusty old silver Litecoin coin being pulled back out of a cobwebbed attic box, brushed off, starting to glow again | broll-rip4-ltc-back.png | - (well-known, named) |
| base | 10.80-15.10 | "because you know, it's a made in America token, getting ETFs" | **BASE** + code badge **"MADE IN AMERICA · ETFs"** 11.70-14.70 (top band, red/white/blue type, no logo) | - | - | - |
| ovl | 15.10-17.40 | "and now it has an optional privacy feature" | **BASE** + alpha overlay (right side of the content zone, x~660 w~380, tweet text stays readable); code badge **"+ OPTIONAL PRIVACY"** 15.10-17.40 top-LEFT band, clear of the overlay | silver Litecoin coin with a glowing privacy shield / padlock, generated on black, builder converts to alpha | broll-rip4-ovl-privacy.png | - (well-known, named) |
| base | 17.40-23.60 | "so I'm like, okay, Ethereum starts giving me the vibe that Ethereum is going to be like totally dominant, and" | **BASE** + code badge **"THE VIBE: ETH TOTALLY DOMINANT"** 20.80-23.40 (top band, violet) | - | - | - |
| B4 | 23.60-26.20 | "I hate Ethereum. I hate it. I hate it" (the tripled hate, emotional core) | content | the same grumpy character, arms crossed, steam out of his ears, glaring at a smug glowing Ethereum coin that floats in front of him | broll-rip4-hate-it.png | ethereum-eth.png |
| base | 26.20-27.60 | "when it's okay, I'll buy into it" | **BASE** (the turn lands on his face) | - | - | - |
| B5 | 27.60-29.92 | "because I know it's gonna pump like crazy" | **FULL (transition into the close)**, out exactly on the base's own scene change to the CMC ETH page | Ethereum diamond coin launching like a rocket up an explosion of neon green candles, pumping like crazy | broll-rip4-eth-pump.png | ethereum-eth.png |
| base | 29.92-36.48 | "I mean I think like that $20,000 ETH is like really conservative in my opinion, ten years from now" | **BASE** (CMC ETH page = the receipt) + code card **"$20,000 ETH"** / **"CONSERVATIVE · 10 YEARS"** 31.80-35.40 (centre y~620 under the chart, above the chat ticker band at y~720-780 and the caption band; chart + $1,761 price stay visible). Ends on his face + the CMC page | - | - | - |

Thumbnail: its own image (T), code-drawn title over its empty top band. Every image used once, no image reused across beats or clips (`rip4` names are new in `render-assets/`).

## Budget
Generated b-roll on screen (B1-B5): 2.60 + 2.20 + 2.20 + 2.60 + 2.32 = **11.92 s / 36.48 s = 32.7% b-roll, 67.3% base** (band 25-35 / 65-75).
The alpha overlay (2.30 s) floats over the base with the content zone readable around it, so it is not counted (same as clip 2).
Full-screens: **2** (hook B1, transition B5). The close is the CMC receipt + code card, not a third full-screen.
Content-zone cutaways: 3 (B2, B3, B4), each tied to a line.
Longest stretch without a generated image: 17.40-23.60 (6.2 s), broken by the "THE VIBE" badge at 20.80; zone changes at
0.04, 2.10, 4.70, 4.80, 7.00, 8.60, 10.80, 11.70, 14.70, 15.10, 17.40, 20.80, 23.40, 23.60, 26.20, 27.60, 29.92, 31.80, 35.40.
Overlay separation: no badge/overlay/card inside a full-screen window or under the frame-0 thumb; badges never overlap each
other in time; the 15.10-17.40 badge (top-left) and alpha overlay (right side) share a window but not space; all sit in the
content zone, clear of the caption band at the seam.

## SFX (tentative, final picks + whisper-masking checks in stage 2, from `assets/sfx/library.json`)
| spine s | cue | why |
|---|---|---|
| 0.04 | transition_rapid_whoosh-tight.wav | thumbnail cut |
| 2.10 | Boom - Big Reveal-short.wav (hit just before "that one day", off the words) | hook full-screen, the flip |
| 4.80 | transition_rapid_whoosh-tight.wav | full -> content cutaway |
| 8.60 | Cinematic Whoosh 06.wav (short) | Litecoin comeback cutaway |
| 11.70 | DING-093.wav | MADE IN AMERICA · ETFs badge |
| 15.10 | TING SOUND EFFECT.mp3 (trimmed) | privacy overlay pop |
| 23.60 | an impact (short variant) | "I hate Ethereum" |
| 26.0-27.6 | Riser Sound Effect-2s.wav, crest on 27.60 | builds into the pump |
| 27.60 | Cash Register-ching.wav | "gonna pump like crazy" full-screen |
| 31.80 | DING-093.wav or Boom - Big Reveal-short.wav (after "$20,000", never on it) | $20,000 ETH card |

## Zero orphans
7 generated assets (thumb T + B1-B5 + the Litecoin alpha overlay), each used exactly once. Code-drawn badges/cards are not images.
Worklist: `broll-images.json` (7 items).

## Stage-2 remap rules (no regeneration by the builder)
- Any ETH beat that comes back without the reference diamond, or with an unrequested logo / real-person face: remap to another clean `rip4` image (never one used by a sibling clip), or to a code-drawn ETH card for a content beat, or drop the beat to BASE.
- B3 / overlay with a wrong Litecoin mark: B3 -> code-drawn "LTC IS BACK" card; overlay -> drop it (keep the "+ OPTIONAL PRIVACY" badge).
- If B1 or B5 fails: keep the window full-screen only if another clean full-screen image exists; else make it content-zone or base. Budget must stay in band.

## STAGE 2 BUILD RECORD (2026-11-19, as built in `RippingHateEth` / `constants-ripping-hate-eth-go-where-the-money-is.ts`)
- Visual QA round 2: all 7 images PASS; builder persona-inspect agrees (ETH diamond on every ETH beat, real orange Bitcoin B, Litecoin slashed-L on B3 + overlay, no real-person face, no unrequested logo). **No remaps.**
- Staged spine confirmed: same stream durations + frame counts as the FINAL (video 36.44 s / 905 fr, audio 36.48 s), GOP re-encode only. Comp = 1093 frames @30 (36.433 s). Seam measured 854 (7/7 frames).
- Beat changes vs the plan above: B2 tIn 4.80 -> **4.70** (butted to B1's tOut so the hook hard-cuts into the cutaway, no 3-frame base flash). Coverage 12.02 s / 36.43 s = **33.0 %** b-roll, 67.0 % base; full-screens 2 (B1 hook, B5 transition).
- Overlay `broll-rip4-ovl-privacy.png` converted to true alpha (luminance) in place; on-black original kept at `_qa/build/ovl-privacy-on-black-orig.png`.
- Badges as built (shared Badge caps at ~540 px wide, so lines were shortened; centred top 190): `LITECOIN / ETFs / made in america` 11.70-14.70 · `PRIVACY / now optional` 15.10-17.40 · `THE VIBE: / DOMINANT / ethereum` 20.80-23.40. $20,000 card centre y 592 (31.80-35.40).
- SFX as built (11 events): tight whoosh 0.033 · Boom-short 2.07 · tight whoosh 4.52 · Cinematic Whoosh 06 8.01 · DING-093 11.55 · TING 14.31 · Impact_Hit_01-2-short 23.46 · Riser-2s 25.585 (crest 27.60) · Cash Register-ching 27.48 · tight whoosh 29.74 · Boom-short 31.77 (sub hit, not a ding over the figure).
- Captions from `whisper-words-verified.json` (4 medium.en-confirmed fixes: "into litecoin", mumbled "me on" dropped, "that ethereum", "but then").
- Render: 1 full + 1 splice (frames 348-525, 621-705, 951-1066: first-render badges wrapped and the first badge ran off the top of the frame; the $20,000 card's bottom edge clipped the chat ticker's name tag). No audio fix needed.
