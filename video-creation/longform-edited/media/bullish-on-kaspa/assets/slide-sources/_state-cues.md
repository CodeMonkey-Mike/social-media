# bullish-on-kaspa: card-slide state cues

Times are on the FINAL spine (`spine/ALL.d.desilenced.mp4`, its medium-words JSON), before any card-pause shift. Each state is a hard swap: shared elements are pixel-identical inside one id, so a swap reads as the new row landing. The last state of each id is the full card.

| File (assets/card-slides/) | From (s) | Cue word | Shows |
|---|---|---|---|
| research-stack-s1 | 87.18 | beat start | GHOST 2013 |
| research-stack-s2 | 88.94 | "2018" | + GHOSTDAG 2018 |
| research-stack-s3 | 91.10 | "2022" | + DAGKNIGHT 2022 |
| silverscript-60-lines-s1 | 127.00 | beat start | THOUSANDS OF LINES |
| silverscript-60-lines-s2 | 130.66 | "now" | + NOW |
| silverscript-60-lines-s3 | 131.22 | "60" (cash-register-2) | + AROUND 60 LINES |
| bps-ladder-s1 | 260.50 | beat start | 10 NOW |
| bps-ladder-s2 | 261.06 | "25" (silent) | + 25 TO 40 TARGETED NEXT |
| bps-ladder-s3 | 263.38 | "100" (cash-register-2, PEAK 3 DROP) | + 100, TARGETED FOR A 2027 HARD FORK |
| stablecoin-card-A-s1 | 271.60 | state A start | the two chips |
| stablecoin-card-A-s2 | 273.60 | "Community" | + COMMUNITY FUNDED |
| stablecoin-card-A-s3 | 274.64 | "led" | + LED BY A CORE DEVELOPER, ALEXANDER SAFSTROM |
| stablecoin-card-A-s4 | 277.94 | "author" | + AUTHOR OF KIP-16 |
| stablecoin-card-B-s1 | 280.10 | state B start | headline only (1.18 s) |
| stablecoin-card-B-s2 | 281.28 | "5" (cartoon-accent) | + 5M KAS GOAL |
| stablecoin-card-B-s3 | 284.28 | "January" | + FUNDRAISER CLOSES JAN 1 2027 |
| stablecoin-card-B-s4 | 287.00 | "refunds" | + REFUNDS IF IT MISSES |
| stablecoin-card-C-s1 | 288.90 | state C start | the roadmap strip, nothing lit |
| stablecoin-card-C-s2 | 292.30 | "September" (missing from the JSON, cue from the audio, COVER-PLAN note) | SEPTEMBER 2027 lit |
| parallel-not-prediction-A | 440.26 | state A start | headline, the line at rest |
| parallel-not-prediction-B | 444.34 | state B start | the line lit, CAN in the accent |
| where-i-stand-s1 | 459.18 | beat start | SOUND MONEY, MINED BY ANYONE |
| where-i-stand-s2 | 460.14 | "owned" | + OWNED BY NO ONE |
| where-i-stand-s3 | 461.96 | "a base layer" | + A BASE LAYER THAT JUST LEARNED TO RUN APPS |
| my-theory | 468.50 | beat start, held to 476.36 | the whole statement |
| community-stack-s1 | 503.56 | beat start | headline, sub-line |
| community-stack-s2 | 508.22 | "Hardcore" | + HARDCORE |
| community-stack-s3 | 509.10 | "patient" | + PATIENT |
| community-stack-s4 | 510.26 | "still" | + STILL HERE |

## text-wall (card pause at 455.74, 3.5 s, silent)

No `kt-text-wall` engine exists in `remotion/src/effects/kinetic-text/`, so the wall ships as layers for the comp to move:

- `text-wall-filled.png` and `text-wall-outlined.png`: pixel-registered. Cross-fade filled -> outlined -> filled for the pulse (all filled at 0.07 s, all outlined at 1.57 s, filled again at 3.07 s) and rotate the pair slowly about the centre for the tilt.
- `text-wall-early-alpha.png`: EARLY. alone on transparency. Pops at +1.9 s with the kt-keyword-pop move and `cash-register`.
- `text-wall.png`: the composite at the pop (outlined wall + EARLY.), usable as a static fallback.
