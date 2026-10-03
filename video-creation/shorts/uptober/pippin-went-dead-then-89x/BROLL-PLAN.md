# BROLL-PLAN: uptober / clip 2 `pippin-went-dead-then-89x` (FULL, 35.90 s)

Title: "Pippin Went Dead, Then It Did an 89x"
Spine: `render-assets/pippin-went-dead-then-89x.mp4` (1080x1920 @25, GOP-staged, has_b_frames 0,
video 35.920 s / 890 frames, audio 35.926 s). Comp renders at 30 fps, 1077 frames = 35.90 s.
Composition: `UptoberPippin89x` (`remotion/src/UptoberPippin89x.tsx`,
`constants-uptober-pippin-went-dead-then-89x.ts`, `captionsUptoberPippin89x.ts`).
Scoped build directives for clip 2: NONE (`clip_directives.py --batch uptober --clip 2` = 0 of 0), so
nothing inherited and NO coverage exemption.
Same-topic precedent: batch `biggest-bullrun` clip 3 (`BiggestBullrunPippinDead85x`) told this story
with blank coins (ash coin, candle eruption, cracking coin, vertical run, bull run). None of its
`bbr3` assets are reused; every visual here is a different treatment (unicorn mascot, bear wasteland,
carousel, candle staircase, gold mountain), all `pip2`-prefixed and generated fresh.

## Measured base facts
- Seam (screen-share / webcam) = row **854** (row-mean gradient step at 853/854 on 6 of 6 frames, t = 3..33 s).
- Content-zone cuts (frame-diff rows 0..850 @10 fps): **4.8-5.0**, **23.9**, **26.0**.
  - 0-4.8: a `#stonk` exchange-listing channel + CoinMarketCap card = OFF-TOPIC (a different coin). Covered by the hook.
  - 4.8-23.9: the Discord `#pippin` exchange-alert channel ("pippin (PIPPIN) has been listed on: 36. Coinex! ...
    54. Bitbase", dated Aug 2025 to Jul 2026) = THE receipt for "we're getting pinged over and over again".
  - **23.9-26.0: a burned-in FULL-FRAME dancing meme** (Mike's own stream reaction on "oh my god"). Never covered.
  - 26.0-end: the `#pippin` channel again.
- Webcam: hair first enters ~row 1400, so a capY of 960 sits on the blue wall, clear of seam and face.

## Budget (video-creation/SKILL.md "B-roll coverage budget (HALVED 2026-07-14)")
- b-roll: 3.24 + 2.30 + 3.05 + 3.32 = **11.91 s of 35.90 s = 33.2 %** (band 25-35 %). Base 66.8 %.
  (Hook cut moved 1.38 -> 1.84 by the builder 2026-10-01: an impact on the 1.38 cut masked "with the" at every
  gain in the offline whisper sweep; a crest on "89x" matched the encode-matched control 4/4. `_qa/sfx/`.)
- **4 b-roll images**, each used exactly once. Full-screens: **2** (hook, climax), inside the firm cap of 3.
- Plus 1 real alpha overlay (glow-on-black -> alpha-from-luminance) and code-drawn badges on BASE beats.
- The burned-in meme (23.9-26.0) is already a visual beat: never covered.

## Reference-image gate (live `ls schedule-tweets/images/reference/`, 44 files, 2026-10-01)
| Project named | Bucket | Reference | Used on |
|---|---|---|---|
| Pippin ($PIPPIN) | LESSER-KNOWN, NO reference on disk | none | name ONLY as code-drawn type (cover chip, badges). The art uses a generic white cartoon unicorn (Pippin's story is a unicorn mascot) with NO logo, NO coin mark, NO ticker; every coin is a blank gold disc |
Flag for Mike: no Pippin reference exists in `schedule-tweets/images/reference/`; add one if the real mark is wanted.

## Beats
| # | t (s) | spoken line | mode | visual | asset | Reference |
|---|---|---|---|---|---|---|
| 0 | frame 0 | (cover) | thumb | white unicorn bursting out of a blank cracked gravestone on a green candle; CODE title "IT WENT\nDEAD.\nTHEN 89x" + chip "PIPPIN IN A BEAR MARKET" | `thumb-pip2-cover.png` | none (generic) |
| 1 | 0.03-1.84 | "I tell you, there's a backstory with the" | base | face + screen open (Phase 7 rule 5) | none | |
| 2 | 1.84-5.08 | "89x on Pippin in a bear market." (OUT extended to 5.08 to cover a burned-in 4.76-4.96 meme-video flash with real faces) | **FULL (hook)** | sleeping red-candle grizzly in a frozen wasteland, tiny unicorn rocketing past on a green trail (hides the off-topic #stonk channel) | `broll-pip2-hook-bear-wasteland.png` | none |
| 3 | 5.08-8.40 | "Pippin was a play of mine from early 2025, and it seemed" | base | #pippin alert channel. Badge "$PIPPIN / EARLY 2025 PLAY" | none (badge) | |
| 4 | 8.40-10.70 | "to have gone dead in August of 2025." | content | abandoned carousel, one dusty cobwebbed unicorn, wilted sunflower | `broll-pip2-dead-carousel.png` | none |
| 5 | 10.70-26.05 | "Not only did the Twitter profile go dead in August with Pippin, but it went dead in terms of getting into a centralized exchange, Pippin started ripping... we're getting pinged over and over and over again. Like, oh my God. Oh my God. Oh my God." | base | the alert channel = the pings. Badges "DEAD / TWITTER SINCE AUGUST", "CEX / LISTINGS WENT DEAD"; alpha overlay: golden ringing notification bell over the right of the channel on "pinged over and over" with a ding per "over"; then Mike's own full-frame meme 23.9-26.0 | `ovl-pip2-bell.png` (overlay) | |
| 6 | 26.05-29.10 | "started ripping, like it started going up and up and up," | content | unicorn galloping up a spiral staircase of green candles, notification bubbles | `broll-pip2-gallop-candles.png` | none |
| 7 | 29.10-32.58 | "and eventually it was like an 89x by the time" | base | alert channel; badge "89x / PIPPIN" | none (badge) | |
| 8 | 32.58-35.90 (tOut past the comp end) | "we got out of it, took some profits, made tons of money." | **FULL (climax)** | unicorn rearing on a mountain of blank gold coins, fireworks, coin rain | `broll-pip2-climax-gold.png` | none |

## SFX (crest-aligned; library `video-creation/assets/sfx/`, copied into `render-assets/sfx/`)
whoosh on the frame-0 cover cut, impact on the hook reveal (1.84, on "89x"), ding on the
$PIPPIN badge (the whoosh back to base at 4.85 was dropped: it would overlap that ding), low hit into the dead carousel, dings on the "pinged over and over" bell, whoosh into the
gallop cutaway, ding on 89x, payoff impact on the climax cut (32.58). Final list + whisper-sweep notes live in
the constants file.

## Captions
Canonical `build_captions.py --style montserrat --max-secs 1.4` from `whisper-words-verified.json`
(medium.en full-clip words, patched against large-v3 windows and the base whisper-words.json):
`within -> with` (clip-plan STT fix), `89 act -> 89x`, `bear mark. -> bear market.` (last syllable clipped
at the segment cut), `August of 2020 -> 2025` (spoken token is 0.36 s, truncated; the clip-plan setup reads
2025; flagged for Mike), `So the rip in -> started ripping` (base + large-v3 agree, medium.en alone differs),
`make -> made` (clip-plan STT fix). Gap scan: no inter-word gap > 0.45 s, no omitted speech.

## Manifest (zero orphans)
`thumb-pip2-cover.png`, `broll-pip2-hook-bear-wasteland.png`, `broll-pip2-dead-carousel.png`,
`broll-pip2-gallop-candles.png`, `broll-pip2-climax-gold.png`, `ovl-pip2-bell.png` (+ its raw source
`ovl-pip2-bell-raw.png`, kept OUT of render-assets in this clip folder). Prompt list: `broll-list.json`.
