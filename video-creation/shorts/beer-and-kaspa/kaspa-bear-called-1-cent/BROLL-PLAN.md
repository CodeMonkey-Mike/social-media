# BROLL-PLAN: beer-and-kaspa / clip 1 `kaspa-bear-called-1-cent` (FULL, 35.52 s)

Title: "This Kaspa Bear Called 1 Cent Three Days Ago"
Spine: `render-assets/kaspa-bear-called-1-cent.mp4` (1080x1920, 25 fps, 35.52 s). Comp at 30 fps.
Seam MEASURED: 854 (row-mean gradient step at 853/854 on 5 of 5 sampled frames, t = 2/10/20/30/34).
Scoped directives for clip 1: NONE (`clip_directives.py` = 0 of 0). No coverage exemption.

## Screen-share (content zone) timeline, measured from frames
- 0.0 - ~19.5: ShalomOnKaspa post ("The best part about the crypto space is how your entire thesis can
  break apart before lunch. Calling for $0.01 at $0.037, 30 seconds later $0.048") quoting the
  Cryptogenerian tweet ("$KAS bears back in charge. Long term down trend did not break").
  Mike READS this post aloud (the hook is his read of it).
- ~19.5 - ~28: clicked through to the full Cryptogenerian tweet ("...If it cannot get out of this
  20 month down trend .01 is in play by 4-6 months. Calling it like it is." + KAS chart card).
  This is THE RECEIPT, it stays BASE (deliberate) apart from one small badge over the reply area.
- ~28 - end: back on the ShalomOnKaspa post.

## Reference-image gate (checked LIVE: `ls schedule-tweets/images/reference/` 2026-09-27)
| Project / name | Bucket | Handling |
|---|---|---|
| Kaspa | well-known AND `kaspa-logo.png` on disk | Kaspa-branded beats generated WITH `schedule-tweets/images/reference/kaspa-logo.png` attached (thumb, B2, B5) |
| Cryptogenerian (the bear, a real person) | real person | NEVER depicted. The "bear" is an animal character; no human faces anywhere. His avatar appears only in the base screen-share as filmed |
| ShalomOnKaspa (tweet author) | real account | not depicted |

## Beats (t in spine seconds)
| # | t in - t out | Mode | Spoken line | Visual | Reference |
|---|---|---|---|---|---|
| F0 | frame 0 only | cover | (none) | THUMB `thumb-kb1-cover.png`: smug bear holding up a tiny copper penny while a giant Kaspa coin rises behind him like a sun; top of frame dark and empty. Title/chip CODE-drawn: "THIS BEAR / CALLED 1 CENT / KASPA", chip "3 DAYS LATER..." | kaspa-logo.png |
| B1 | 0.25 - 2.85 | **FULL (hook)** | "The best part about the crypto space is how your entire thesis can break..." | `broll-kb1-hook-thesis-shatters.png`: a bear statue built of red candles shattering on a diner table next to a lunch plate, clock at noon | none (generic, no coins) |
| base | 2.85 - 9.25 | base | "...apart before lunch, calling for one cent Kaspa at 3.7" | the ShalomOnKaspa post he is reading (the $0.01 at $0.037 line) | n/a |
| G1 | 5.55 - 8.55 | badge (code) | "calling for one cent Kaspa at... 3.7" | badge "$0.01?" / "CALLED AT $0.037", red, top 640 (over the reply rows, below the $0.037 text) | n/a |
| B2 | 9.25 - 11.95 | content | "30 seconds later, it's at 4.8 cents." | `broll-kb1-kas-rocket-stopwatch.png`: Kaspa coin blasting upward off a cracked floor past a stopwatch | kaspa-logo.png |
| base | 11.95 - 15.00 | base | "And so three days ago, this dude right here says" | Mike pointing at the quoted tweet | n/a |
| B3 | 15.00 - 17.35 | content | "Kaspa bears are back in charge." | `broll-kb1-bear-throne.png`: crowned bear on a throne of red candles | none (generic) |
| O1 | 17.50 - 19.40 | overlay (alpha PNG) | "Long term downtrend did not break." | `broll-kb1-ovl-downtrend-alpha.png`: glowing red zig-zag down arrow over the right sidebar (x ~700, top ~330), clear of tweet text | none |
| base | 17.35 - 29.45 | base | "Let's click on... If it can't get out of this 20 month downtrend, one cents is in play by four to six months, calling it like it is. Oh man." | THE RECEIPT: the full bear tweet on screen | n/a |
| G2 | 23.75 - 26.75 | badge (code) | "one cents is in play by four to six months" | badge "4-6 MO" / "TO HIT $0.01. HIS CALL", red, top 640 (over the reply rows, below the chart card) | n/a |
| B4 | 29.45 - 31.60 | content | "Boy, that dude was wrong..." | `broll-kb1-bear-stunned.png`: stunned suited bear drops coffee as a teal candle smashes through the ceiling | none (generic) |
| base | 31.60 - 33.15 | base | "...just like three days ago, man." | back on the Shalom post | n/a |
| B5 | 33.15 - 35.52 (end) | **FULL (climax)** | "We blew him out of the water, man." | `broll-kb1-climax-blown-out-of-water.png`: a teal tidal wave carrying a giant Kaspa coin launches a bear out of the ocean | kaspa-logo.png |

Full-screens: 2 (hook + climax), within the firm 1-3 cap.

## Budget
b-roll image time = B1 2.60 + B2 2.70 + B3 2.35 + B4 2.15 + B5 2.37 = **12.17 s of 35.52 s = 34.3 %**
(band 25-35 %), base showing **65.7 %**. 5 b-roll images + 1 overlay + 1 cover = 7 generated files,
each used exactly once. Longest base stretch 17.35-29.45 is deliberate: Mike is reading the bear's
tweet, the receipt, and it carries the O1 overlay and the G2 badge.

## SFX plan (from `video-creation/assets/sfx/`, crest-aligned)
- whoosh on the frame-0 cover -> B1 hook cut (0.25) + reveal impact
- whoosh out of B1 (2.85)
- ding on G1 badge (5.55)
- impact into B2 (9.25, the 4.8 cents reveal)
- whoosh into B3 (15.00)
- ding/boom on O1 (17.50)
- ding on G2 badge (23.75)
- record-scratch / shock on B4 "that dude was wrong" (29.45)
- riser into B5 + payoff impact at 33.15 ("We blew him out of the water")
All swept against Whisper on the final mix; any cue that masks VO gets retimed/trimmed or deleted.

## Asset manifest (zero orphans)
render-assets/: thumb-kb1-cover.png, broll-kb1-hook-thesis-shatters.png, broll-kb1-kas-rocket-stopwatch.png,
broll-kb1-bear-throne.png, broll-kb1-bear-stunned.png, broll-kb1-climax-blown-out-of-water.png,
broll-kb1-ovl-downtrend-alpha.png (raw glow-on-black source kept in the clip folder `_src/`, not render-assets).
