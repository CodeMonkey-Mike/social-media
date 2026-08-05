# BROLL-PLAN — peach-minute clip 2, `02-the-pain-stick-through`

**Title (open loop):** If You Can Stick Through This Pain, You Win
**Spine:** `preview.mp4` — 47.36 s video / 47.39 s audio, 1080x1920, 25 fps source.
**Comp:** `PainStickThrough` @ 30 fps, `durationInFrames = 1421` (47.367 s). NOT 1420: the last spoken word
"nuts" runs to ~47.37, and a 47.333 s cut clips it (Whisper reads "prices are going UP" off both the render
AND a spine truncated at 47.333, and "going NUTS" off a spine truncated at 47.367). The 0.007 s overshoot past
the 47.360 s video stream is invisible because the climax full-screen b-roll covers the frame to the end.
**Measured seam (screen-share / webcam divider):** y = **856** (green-screen onset scan at t = 3/12/22/33/41/46 s:
rows <= 853 are 0 % green, rows >= 855 read 0.43-0.50 green whenever Mike is not filling the frame).
Content-mode b-roll covers 0..856. Caption centre `capY = 925` (70 px below the seam, well above his eyes ~1440).

**Base video content zone:** a STATIC FRED "M2 (M2SL) percent change" chart page for the entire clip — it never
changes and it is not what he is talking about. Per the coverage rule an off-message screen-share is **not** a
licence to blanket: base still shows ~69 % of the runtime, and the long base stretches are broken up with
code-drawn badges (which do not cover the zone) rather than with more images.

## Coverage budget (canonical rule: `video-creation/SKILL.md` "B-roll coverage budget (HALVED 2026-07-14)")

| | |
|---|---|
| Runtime | 47.37 s |
| B-roll on screen | **14.99 s = 31.6 %** (band 25-35 %, target ~30 %) |
| Base showing | **32.38 s = 68.4 %** (mechanically re-checked on the final data) |
| Distinct images | **6** (47 s clip; the ~6-8 guidance is for ~75 s, so this is at the ceiling of what a 47 s clip earns) |
| Full-screen moments | **2** (the contiguous hook pair + the climax) — inside the FIRM 1-3 cap |
| Largest base gap | 13.55 s (13.75 -> 27.30), carried by his delivery + badges A/B |

### MEASURED BASE DEFECT — 4.04 s to 6.96 s (boundaries found at 25 fps)

For those ~2.9 s the livestream layout breaks: a dark video window takes over the top of the
screen-share, the FRED page is shoved down, and a **flat grey dead rectangle covers the left half of
the FACE zone (y ~855-1490)**, masking half of Mike. Content-mode b-roll only covers 0..seam, so it
would leave that grey box on screen. Beat 2 is therefore **full-screen and butted against beat 1**
(gap 0 <= the `BrollLayer` 0.18 s adjacency epsilon -> HARD CUT, never a base flash between two
full-screens), and its `tOut` (7.12) puts the 0.12 s fade-out entirely over the recovered layout.
Net effect: the only broken stretch in the clip is never shown, and the "here come the pain"
punchline at 7.50 lands back on HIS face.

## Beat sheet (mode `base` = deliberate NO-image beat, screen-share + webcam show)

| # | Window (s) | Mode | Spoken line | Visual | Reference |
|---|---|---|---|---|---|
| — | 0.00-0.03 | thumb | (frame 0 only) | Designed cover: code-drawn title "STICK THROUGH / THIS PAIN" + chip "AND YOU WIN" over `thumbnail-psp.png` | n/a |
| — | 0.03-1.95 | **base** | "so it is kind of crazy man" | Cover hands straight off to Mike + the FRED M2 screen-share | n/a |
| 1 | 1.95-3.95 | **full** | "this is like the pain man, the pain" | Lone faceless silhouette braced on a rock ledge against a towering crimson storm wall of falling red candlestick bars, embers, teal rim light | none (no named project) |
| 2 | 3.95-7.12 | **full** | (his pause / the garbled Pacino aside) | HARD CUT from beat 1: a wave of jagged red candlesticks crashing down a dark canyon toward a small braced faceless silhouette. Covers the measured 4.04-6.96 base defect and fills the dead air | none |
| — | 7.12-11.15 | **base** | "here come the pain / yeah man, but if you're in it man" | The layout is back and the punchline lands on HIS delivery; webcam + screen-share show | n/a |
| 3 | 11.15-13.75 | content | "if you can stick through this and you haven't checked out like everybody else" | One faceless silhouette gripping a cliff ledge in a storm, teal rim light, while other silhouettes let go and fall into the dark | none |
| — | 13.75-27.30 | **base (13.55 s, deliberate)** | "in the long run you're sitting pretty / I like the volatility / it goes up I take profits, it comes back down and I buy back in" | Screen-share + webcam. Badges **A** (18.70-21.50) and **B** (22.70-25.60) carry it; no image blankets the zone | n/a |
| 4 | 27.30-30.00 | content | "if things go down over the next 30 to 40 days" | Descending staircase of dark-red candlestick blocks into the dark; a calm faceless silhouette on the lowest steps scooping plain blank coins into a bag | none |
| — | 30.00-34.30 | **base** | "why not just buy some more, lower prices" | Badge **C** (31.20-33.90) | n/a |
| 5 | 34.30-36.50 | content | "everybody and their grandma is gonna be buying back in" | A dense crowd of faceless silhouettes pouring back through a glowing doorway into a neon-green market hall | none |
| — | 36.50-45.05 | **base** | "in October things go up and I'll just take profits / I'll sell to the people who thought they were gonna buy back in at the bottom" | Badges **D** (37.20-40.00) and **E** (41.30-44.30); riser builds under 43.10 | n/a |
| 6 | 45.05-47.60* | **full** | "FOMOing in because prices are going nuts" | CLIMAX: stampede of faceless silhouettes charging up a soaring green candlestick staircase while one calm silhouette at the summit lets blank coins fall to them | none |

\* `tOut` deliberately runs past the 47.367 s end of the comp so the `BrollLayer` 0.12 s fade-out never
ghosts the art over the base on the last rendered frame (documented trick, tdbtg build). Visible = 2.32 s.

## Reference-image gate (MANDATORY)

`ls schedule-tweets/images/reference/` run LIVE 2026-07-29: `DogInMe.png, ElizaOS-ai16z-2.png,
ElizaOS-ai16z.webp, LAB.png, bittensor-tao.png, bobo.png, carousels, housecoin.webp, kappy.png,
kaspa-logo.png, kasy.png, kroak.png, linea.png, michael-saylor.png, nacho.jpg, slippy.png, toshi.png,
troll.png, velvet.png, what-if.jpg`.
**This clip names NO project, coin or ticker** (full transcript checked word by word: the only proper noun is
"October"). So no beat is reference-gated and no beat may carry invented branding. Every coin rendered in the
b-roll is a **blank, smooth, symbol-free disc**; every human figure is a **faceless silhouette**.

## Badges (code-drawn, content zone, over BASE only)

Every window sits inside a base stretch with no b-roll and no other badge running (overlays must never
collide in time AND space). Bands: `top 300` -> y~200-400, `top 600` -> y~500-700; both above the seam (856)
and above the caption centre (925).

| | Window | Band | Text | Why it is not a caption repeat |
|---|---|---|---|---|
| A | 18.70-21.50 | 300 | VOLATILITY / IS THE POINT / "FLAT PAYS NOBODY" | names the reason he likes it |
| B | 22.70-25.60 | 600 | UP, TAKE PROFITS / DOWN, BUY BACK / "THE SAME LOOP, EVERY CYCLE" | states the loop as a system |
| C | 31.20-33.90 | 300 | LOWER PRICES / ARE THE DISCOUNT / "IF YOU STILL BELIEVE" | reframes the dip as the offer |
| D | 37.20-40.00 | 600 | THEY COME BACK / IN OCTOBER / "HE IS ALREADY POSITIONED" | the opposition is late, he is early |
| E | 41.30-44.30 | 300 | STILL HERE / STILL LOADED / "THAT IS THE WHOLE EDGE" | pays the hook off |

## SFX (`video-creation/assets/sfx/`, >= 2 required)

| t | file | why |
|---|---|---|
| 0.02 | Cinematic Whoosh 02.wav | frame-0 thumbnail cut |
| 1.92 | transition_rapid_whoosh.mp3 | cut into the hook full-screen |
| 3.93 | Cinematic Whoosh 06.wav | hard cut to the pain wave (lands in his pause, no VO under it) |
| 7.96 | Impacts/Impact_2.wav | punchline hit on "here come the pain" |
| 11.12 | transition_rapid_whoosh.mp3 | cut into the stick-through cutaway |
| 17.62 | TING SOUND EFFECT.mp3 | reveal ding on "sitting pretty" |
| 27.28 | Cinematic Whoosh 06.wav | cut into the buy-lower cutaway |
| 34.28 | transition_rapid_whoosh.mp3 | cut into the grandma cutaway |
| 43.10 | risers/Tension_Rise_Logo_Reveal_3.wav | riser building INTO the climax |
| 45.03 | Impacts/Impact_2.wav | climax impact on the full-screen cut / "FOMOing in" (vol 0.26) |

All volumes are whisper-verified against the final mix; a cue that masks the VO gets swept down (SKILL item 7).

## Persona guards applied

- Conviction, vindicated and forward-looking: he is IN it, still loaded, already positioned. No beat frames a
  call or trade as a mistake.
- The people who checked out / buy back in October are the OPPOSITION; Mike is never one of them.
- No real project marks: coins are blank generic discs, no Ethereum diamond, no Bitcoin glyph, no ticker text.
- No real-person faces: every figure is a faceless silhouette (this is why the Pacino bit is illustrated by the
  pain wave, not by a likeness).
- CAPTION CORRECTION, resolved during QA: the fragment the small model heard as "are letos way up, but you
  know" is Mike naming **Carlito's Way** and **Pacino** (medium model, with context, on both the spine and the
  final mix). It is now captioned "carlito's way" / "pacino" / "here come the pain" instead of being dropped.
  The opening reads "so it is KIND OF crazy man" for the same reason (two independent medium runs).
- No em dashes anywhere on screen.
