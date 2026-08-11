# BROLL-PLAN — `kitsu-vlads-dog` (batch `last-year`, clip 3, variant `full`)

Spine: `render-assets/kitsu-vlads-dog.mp4` (87.52 s, 1080x1920, 25 fps source; GOP re-encoded
seek-friendly, audio byte-identical to `kitsu-vlads-dog-final.mp4` — md5 `e88e1526…` on both).
Measured zone seam = **853** (row-gradient scan, 11 frames at 1/8/15/22/30/40/50/60/70/80/86 s, all
unanimous, delta 152-221). Content zone = 0..853 (screen-share), webcam below.

## Coverage budget (SKILL "B-roll coverage budget", HALVED 2026-07-14)

| | |
|---|---|
| covered | **26.65 s / 87.52 s = 30.4 %** (target ~30 %, band 25-35 %) |
| base showing | **60.87 s = 69.6 %** (target ~70 %, band 65-75 %) |
| distinct images | **10** (+1 thumbnail cover). Zero reuse: every beat has its own asset. |
| full-screen | **3** (hook 1.00, peak 34.90, precedent slam 72.75) — the FIRM 1-3 cap. 34 s / 38 s apart, so no full-to-full base flash is possible. |
| beat length | 2.15-3.10 s (style guide: b-roll changes every 1-3 s) |

**Why 10 images and not 7.** Image count is an OUTPUT of the budget: 30 % of 87.5 s = 26.3 s of
coverage, and a single beat may not sit longer than ~3 s, so 26.3 / ~2.7 = ~10 beats. Reuse is
forbidden, so 10 distinct assets is the arithmetic result, not padding. (The "6-8 per ~75 s"
reference scales to ~8.2 here at 2.8 s/beat; this clip runs 2.67 s/beat.)

**Why the base stretches are long and deliberate.** The content zone of THIS clip is a real receipt
for almost its whole runtime, verified frame by frame:
- 0-58 s: the live `@KitsuRobinhood` X profile — banner reads "The Shiba of Robinhood", bio reads
  "Vlad's Shiba Inu. Name confirmed. Featured many times by Robinhood's CEO. Adopted during the DOGE
  era", pinned post "WOOF! Vlad Tenev's favorite Dog on Robinhood!". That IS the reveal; covering it
  would hide the evidence and the project's REAL branding.
- 58-87.5 s: the live KISHU/WETH dexscreener chart, monthly candles, the 2021 spike to the 2.40B axis
  — the receipt for "went to two billion".
The three stretches that are NOT valuable are covered on purpose: a DexScreener search modal at
~62-64 s, an open timeframe dropdown at ~65-67 s, and the search modal again at ~81 s.

## Reference-image gate (checked LIVE, `schedule-tweets/images/reference/`, 2026-08-11)

Live listing: DogInMe, ElizaOS-ai16z(-2), LAB, TUT-tutorial, bittensor-tao, bobo, carousels, cooper,
ethereum-eth, housecoin, kappy, kaspa-logo, kasy, kroak, linea, michael-saylor, nacho, slippy,
tendies, toshi, troll, velvet, what-if.

| Named entity in clip | Reference on disk? | Ruling |
|---|---|---|
| **Kitsu** (Vlad's dog / the Robinhood-chain coin) | **NO** | ⛔ NEVER invent a Kitsu logo. Generic Shiba Inu imagery only. The project's REAL branding is carried by the base video (its X profile + logo are on screen for the first ~58 s). |
| **Kishu Inu** (2021 token) | NO | generic dog / chart imagery only. |
| **Robinhood** | NO | no wordmark, no logo. Brand presence = the neon lime-green accent **#CCFF00** only. ⛔ NEVER teal (teal reads as Kaspa). |
| **Vlad Tenev** (real person) | n/a | never depict a real face; the CEO beat is code-drawn text, not art. |
| Doge / Dogecoin | NO | era vibe only, never the coin mark. |

Persona rules applied to every prompt: no real cryptocurrency logo (no Bitcoin, no ETH diamond, no
Doge mark), no real-person faces, no baked text/letters/numbers, blank/generic coins only.

## Beats

| # | t_in | t_out | dur | mode | Spoken line | Visual | Asset | Reference |
|---|---|---|---|---|---|---|---|---|
| B1 | 1.00 | 3.60 | 2.60 | **full** | "this is the shiba of robinhood" | HOOK: Shiba on a night rooftop, huge lime-green backlight, glass skyline | `broll-lyk-hook.png` | none (no Kitsu ref exists) |
| — | 3.60 | 8.40 | 4.80 | base | "and i wasn't aware of this guy / it's a real dog and vlad's shiba inu" | **SHOW THE SCREEN-SHARE**: the X profile + banner he is reading | — | — |
| B2 | 8.40 | 11.00 | 2.60 | content | "it's not an actual office dog" | Shiba alone in an empty glass corner office at night | `broll-lyk-office-dog.png` | none |
| — | 11.00 | 16.20 | 5.20 | base | "it is vlad's, the ceo of robinhood. he actually has a shiba inu" | profile bio on screen + **BADGE 1** (12.40-15.20) | — | — |
| B3 | 16.20 | 18.90 | 2.70 | content | "ceo adopted during the doge era" | early meme-era wave: Shiba puppy inside a swirl of pixel-art internet nostalgia | `broll-lyk-doge-era.png` | none |
| — | 18.90 | 25.40 | 6.50 | base | "this right here is bullish in more ways than one" | his face + the profile | — | — |
| B4 | 25.40 | 28.10 | 2.70 | content | "he got the dog just because he was into memes" | Shiba in shades against a wall of glowing screens | `broll-lyk-memelord.png` | none |
| — | 28.10 | 34.90 | 6.80 | base | "what are you thinking about that? he got a shiba inu because he was into memes" | FACE beat: the repetition is the performance | — | — |
| B5 | 34.90 | 38.00 | 3.10 | **full** | "you know how bullish that is, man" | PEAK: colossal lime-green bull of light charging, tiny Shiba silhouette riding it | `broll-lyk-bullish.png` | none |
| — | 38.00 | 47.55 | 9.55 | base | "i can't wait for us to get into this bull run… most exciting times ever" | pure face energy, nothing over it | — | — |
| B6 | 47.55 | 50.25 | 2.70 | content | "inclined to put this on the robinhood app" | hand holding a phone, generic trading UI, lime-green rising line, no marks | `broll-lyk-app-listing.png` | none (lime #CCFF00, never teal) |
| — | 50.25 | 62.20 | 11.95 | base | "for robinhood retail to come in and buy it… kitsu is interesting… vlad's shiba inu is named kitsu" | the X profile is the receipt for the name | — | — |
| B7 | 62.20 | 64.85 | 2.65 | content | "and just the other day i pointed out what kishu did" | NAME TWINS: two Shibas side by side, one cold-white lit, one lime-lit, divider between | `broll-lyk-name-twin.png` | none |
| B8 | 64.85 | 67.60 | 2.75 | content | "kishu inu just went like parabolic in the bull run of 2021" | one towering green candle column going vertical off frame | `broll-lyk-parabolic.png` | none |
| — | 67.60 | 72.75 | 5.15 | base | "see right here, look at this… here's a monthly candles right here, but it's nuts" | ⛔ **HE IS POINTING AT THE CHART — SHOW IT** (the 2021 spike) | — | — |
| B9 | 72.75 | 74.90 | 2.15 | **full** | "went to two billion" | SLAM: green shockwave erupting out of a dark skyline, wall of candles | `broll-lyk-two-billion.png` | none (number lives in the caption, never baked) |
| B10 | 74.90 | 77.60 | 2.70 | content | "kishu, without any centralized exchanges, there's some silly inu that out of nowhere just exploded" | scrappy Shiba on a ledge, green wave rising out of a void behind closed unmarked gates | `broll-lyk-no-cex.png` | none |
| — | 77.60 | 87.52 | 9.92 | base | "the name sounds the same. kitsu, kitsu, kitsu… i wouldn't mind buying into this right now" | the chart + **BADGE 2** (78.60-81.40); the HARD-OUT plays clean on his face | — | — |

Adjacent pairs (`tOut === tIn`, BrollLayer hard-cuts, zero base flash): B7→B8 at 64.85, B9→B10 at
74.90. Every other gap is >= 2.6 s, so no sub-1.5 s base flash exists anywhere.

## Code-drawn badges (never over a b-roll image, never co-occurring)

| # | tIn | tOut | line1 / line2 / sub | top | sits inside |
|---|---|---|---|---|---|
| 1 | 12.40 | 15.20 | VLAD TENEV / HIS DOG / THE ROBINHOOD CEO | 560 | base 11.00-16.20 |
| 2 | 78.60 | 81.40 | KISHU INU / 2 BILLION / IN 2021, NO EXCHANGES | 560 | base 77.60-87.52 |

(The shared `Badge` caps its text at ~426 px, so "ROBINHOOD" is never a `line2`: at the 82 px line2
size that single unbreakable word measures ~441 px and would overflow the padded box.)

63.4 s apart; neither starts before the frame-0 thumb ends (0.033 s); neither overlaps b-roll.

## Frame-0 thumbnail

`thumb-lyk.png` = generated background art ONLY (dark upper third reserved); the title and chip are
CODE-drawn on top by `LivestreamShort`/`Thumb`, never baked into the image. ONE frame (`durS`
defaults to 1/fps); the video plays from frame 1 on the face + screen-share base.

## SFX (see constants; >= 2 required, this clip fires 10 events from 6 distinct files)

Whoosh on the frame-0 cover cut and on each major b-roll cut (0.03 / 16.20 / 47.55 / 62.20 / 74.90),
a short impact on the hook (1.00), on the PEAK (34.90) and on the "two billion" slam (72.75), a ding
on each badge reveal (12.40 / 78.60). Nothing after 79.3 s: the hard-out ("i wouldn't mind buying
into this right now") is left completely dry, measured at -43.1 dB residual against the bare spine.

**Both planned risers were DELETED after offline proof.** Eleven candidate sets were mixed onto the
bare spine and Whisper-scored against an encode-matched control (48 kHz AAC, the render's own chain),
zero renders spent. A riser into the peak reproducibly ate "into MEMES" (3 of 3 staggered windows)
and a riser into the slam destroyed "but it's nuts": this spine is desilenced, so the runway before
each payoff is only 0.22 s / 0.12 s and a build has nowhere to live. A riser is decoration, not the
payoff hit, so per the SKILL it was deleted rather than kept quiet. The slam impact itself was fixed
with TIMING first (0.40 -> 0.30 -> 0.25 -> 0.20 s, plus moving the hit to 72.64 and to 73.62, all of
which still lost "went to") and only then with gain (0.26 -> 0.14), at which point the whole-file
decode returns the line verbatim.
