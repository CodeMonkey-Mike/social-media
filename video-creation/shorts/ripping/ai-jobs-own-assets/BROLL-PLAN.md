# BROLL-PLAN: ripping clip 3 `ai-jobs-own-assets` (full, 40.29 s spine, 1080x1920, source 25 fps)

Spine `ai-jobs-own-assets-final.mp4` (= `render-assets/ai-jobs-own-assets.mp4`) · words `whisper-words.json` · public dir `shorts/ripping/render-assets`
Scoped directives (`clip_directives.py --batch ripping --clip 3`): **none** -> the full coverage budget applies, no exemption.
Seam: ~855 px (eyeballed off a t=30 s crop of the content zone; RE-MEASURE with the row gradient at build).
Accent: **GOLD** `#FFC83D` (assets, dividends, "get ahead"); **RED** `#FF3B3B` only for the UBI stamp. No coin is named, so no coin colour.

Base content zone (frame tiles at 0.2 s around the switch, 2.5 s contact sheet):
- **0.00-14.0**: CoinMarketCap Pieverse page (price chart, CMC AI, Pieverse Markets table). Off-message for this clip (robots, assets), so the robot hook carries b-roll here, with short base breaths between beats.
- **14.0-40.29**: Mike's own YouTube channel, Videos tab: "Pieverse Went From 12 Cents to $2", "This Has Never Happened Before", **"HAPPENING NOW: AI Is Wiping Out All These Jobs" ("AI is Destroying Lives" thumbnail)**, "Canton Is the Network the Banks Already Joined", JCT, Quant. ON-message (the AI jobs video IS this clip's topic, and "anybody watching this channel" lands on the channel page itself), so the second half is deliberately base-heavy with code-drawn pointers onto it. The first thumbnail slot plays a hover preview around 27-33 s; measure the "AI Is Wiping Out" thumbnail's box at build before drawing the ring (it sat at about x103-525, y265-500 of the content zone at t=30 s).

Caption name check: "ubi" -> **UBI** (montserrat preset lowercases on screen anyway). Whisper "of what you own" is spoken as "off what you own" (clip-plan wording); leave as heard unless the build's whisper-verify says otherwise. No STT garble flags for this clip's words.

## Budget
5 generated b-roll beats: 2.46 + 2.50 + 2.68 + 3.06 + 2.23 = **12.93 s / 40.29 s = 32.1 % b-roll, 67.9 % base** (band 25-35 / 65-75).
Full-screens: **3** (hook B1, climax B4, close B5) = the firm cap. Longest full-screen 3.06 s.
Images to generate: **6** (thumb + 5 b-roll), every one unique to this clip, each used exactly once. The long base stretches (10.56-22.22, 25.28-38.06) are NOT empty: the content zone changes underneath (CMC -> channel at 14.0) and code-drawn graphics (C1-C4, no generated image, not in the worklist) break them up without blanketing the screen-share.

## Reference gate (run LIVE: `ls schedule-tweets/images/reference/`, 2026-11-18)
| project / name | spoken? | bucket | action |
|---|---|---|---|
| (no coin or project is named in the speech) | - | - | no reference needed for any beat |
| Pieverse (`pieverse.jpg` on disk) | NO, only visible on the CMC base 0-14 s | n/a | no image of it; the real page shows in the base |
| Mike (`mike-profile-logo.jpg`) | n/a | n/a | never put Mike's or any real face in b-roll; his real thumbnails show in the base |
| household robot, UBI, credit card | generic concepts | n/a | generic unbranded robot, blank card, no logos (prompts say so) |

## Beats
| # | t in-out (s) | spoken line | mode | visual | file | ref |
|---|---|---|---|---|---|---|
| 0 | frame 0 | (cover) | thumb | home robot in a suburban kitchen holding a wrench + a blank gold card, faceless human silhouette with empty pockets; headline code-drawn over the dark top: "NO ASSETS? YOU'RE STUCK" | broll-rip3-thumb.png | - |
| base | 0.04-0.82 | "if you have a" | base | face + CMC page (one breath before the hook image) | - | - |
| B1 | 0.82-3.28 | "robot in your house and it has to do repair, you know" | FULL (hook) | Pixar-style humanoid home robot under a kitchen sink fixing a spraying pipe | broll-rip3-robot-repair.png | - |
| base | 3.28-4.40 | "it has to do a" | base | CMC page | - | - |
| B2 | 4.40-6.90 | "plumbing job or has to go out onto the roof" | content | the same kind of robot on a suburban roof replacing shingles | broll-rip3-robot-roof.png | - |
| base | 6.90-7.88 | "it's going to have to" | base | CMC page | - | - |
| B3 | 7.88-10.56 | "order parts and it's going to have to pay things, man" | content | robot on a porch paying from a glowing wrist panel, parts parcel landing from a drone, plain gold coins streaming out | broll-rip3-robot-pays.png | - |
| base | 10.56-22.22 | "it's just going to be an interesting future, man. it's going to be tough though. you have to invest in assets because we're going to see an asset driven future, right? we're earning dividends of what you own and" | base (+ C1 17.18-18.86 code badge "ASSET-DRIVEN FUTURE", gold, top band centred (y 170) of the content zone; + C2 19.26-21.26 code chip "+ DIVIDENDS" with a code-drawn gold coin, sliding in from the left edge) | CMC until 14.0, then Mike's channel page (the cut at 14.0 is itself a zone change) | - | - |
| B4 | 22.22-25.28 | "crazy hard to get ahead if you don't have assets" | FULL (climax) | sheer wall: faceless silhouettes on gold stacks of houses / certificates / coins ride a golden escalator up; one empty-handed silhouette stuck in cold blue shadow at the bottom | broll-rip3-cant-get-ahead.png | - |
| base | 25.28-38.06 | "because if you're just going to you can't get a paycheck and you don't have, you know, you can't get a job. you'll be stuck on UBI. what the hell are you going to progress? that's why anybody's watching this channel now, i'm saying is like it you're you're on" | base (+ C3 27.54-30.88 code-drawn gold ring + arrow on the "AI Is Wiping Out All These Jobs" thumbnail in the base, the receipt; + C4 31.42-33.92 red rubber-stamp "STUCK ON UBI" slammed onto the lower content zone, clear of the ring and of the caption band; + C5 34.74-36.60 code badge "THIS CHANNEL / IS THE RIGHT PATH", gold, top band, on "anybody's watching this channel") | Mike's channel page: his own AI-jobs video, then "this channel" lands on the channel itself | - | - |
| B5 | 38.06-40.29 | "right path, man. you're not checked out" | FULL (close) | lone faceless silhouette walking a glowing golden path uphill toward a sunrise city, gold asset icons along the path, slumped figures asleep on benches in the cold blue background | broll-rip3-right-path.png | - |

Hard cuts in and out of every beat (style guide: 95 % hard cuts). No two b-roll beats are adjacent, so no b-roll-to-b-roll handoff. C1/C2/C3/C4 never overlap each other, a b-roll beat, or the caption band; C3's ring is placed off the MEASURED thumbnail box at build.

## SFX (proposal; attack-align and whisper-verify at build per the skill)
| t (s) | cue | why |
|---|---|---|
| 0.04 | transition_rapid_whoosh-tight.wav | thumbnail cut |
| 0.82 | Impacts/Impact_Hit_01-2-short.wav | hook full-screen: the robot (lands on "robot", keep it off the word's crest if it masks) |
| 7.80 | Cash Register-ching.wav (truncate the tail) | "order parts... pay things": the robot pays |
| 17.10 | DING-093.wav | C1 "ASSET-DRIVEN FUTURE" badge |
| 21.90 | Riser Sound Effect-2s.wav (trimmed to end at 22.22) into 22.22 Impacts/Kick_Impact_01-short.wav | build into the climax full-screen "crazy hard to get ahead" |
| 31.40 | Impacts/card-impact-hit01-3-short.wav | "STUCK ON UBI" stamp slam |
| 38.00 | Cinematic Whoosh 06.wav (dur ~0.75) | close full-screen "right path" |

## Zero orphans
6 generated assets (`broll-rip3-thumb`, `-robot-repair`, `-robot-roof`, `-robot-pays`, `-cant-get-ahead`, `-right-path`), each mapped to exactly one beat above and listed in `broll-images.json`. C1-C4 are code-drawn (no file). If visual-qa leaves any image FAILED, the build remaps that beat (another clean rip3 image, a code-drawn card, or base) and updates this table.

## Build reconciliation (STAGE 2, 2026-11-18)
- Images: visual-qa round 2 = PASS 6/6, so NO beat was remapped. Every b-roll beat uses its planned file.
- Seam MEASURED 854 (row-gradient step 853/854 on 7/7 frames). Receipt thumbnail box MEASURED x 103-525, y 265-500; the channel page is scroll-stable 24-32 s (0 px shift), so C3's ring is placed off that box.
- B5 runs to the last frame (tOut 40.40 > 40.267 s end, no fade-out at the end). Budget as built: 12.91 s / 40.27 s = 32.1 % b-roll.
- Added C5 (code badge, no image) on "anybody's watching this channel" to break the 33.92-38.06 base stretch; it shares no window with any other overlay.
- C1/C5 are drawn by the comp (single-line no-wrap badges); C2 dividends chip with a blank code-drawn coin; C3 ring + "AI IS WIPING OUT JOBS" pointer chip over the off-topic Canton thumbnail; C4 red "STUCK ON UBI" stamp.
- Comp: `remotion/src/RippingAiJobsOwnAssets.tsx` + `constants-ripping-ai-jobs-own-assets.ts` + `captionsRippingAiJobsOwnAssets.ts`. SFX as built: see `SFX_RIP3` in the constants (8 events; crest-aligned with library.json attack_sec).
