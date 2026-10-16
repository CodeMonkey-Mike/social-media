# tao-rev-vs-emissions · customer money against new coins (COMPUTED) · Type 1 ANIMATED (CH4, accent #a855f7)

_chart-builder, 2026-10-10. Design states `tao-rev-vs-emissions-start.png` / `-mid.png` / `-payoff.png` (3840x2160 =
1920x1080 @2x). The comp builds it for real with `useCurrentFrame`, geometry from `render()` in `tao-rev-vs-emissions.html`._

**Cover:** CH4 461.25 to 471.10 (9.85 s = 295 frames). Spoken: "28 (461.28) to 35 million (462.46) of customer money
(463.74) against about 1.3 million new TAO a year (464.82 to 466.74), which is about 360 (468.28) million dollars at the
price that I'm recording this (470.90)." BR-19 (the minting press, "THE NETWORK STILL PAYS OUT MOSTLY NEW COINS")
follows at 471.10, so the chart carries no takeaway sentence of its own.

**Numbers (DATA.md Pillar 2c (d) + section 5):** customer money 28M to 35M a year across about two dozen subnets, as
reported (Crypto Briefing 2026-09-29 on Steeves' keynote, a SubConnect index; on screen never "20 to 35", flag 451.62).
New TAO issued: 3,600 a day x 365 = about 1.3M TAO a year; at the TAO price read 2026-10-09 21:55 UTC = about 360M
dollars (computed). The price itself is NOT on screen (no price on screen in this video).

**Geometry:** one dollars-a-year axis x 600 (0) to 1720 (400M), ticks every 100M; row 1 bar y 372 to 456 (solid to
28M, hatched 28M to 35M, value "28M to 35M" after it); row 2 bar y 592 to 676 (gradient accent, value "about 360M"
inside its end, "at the TAO price, read 2026-10-09 21:55 UTC" beneath); left labels x 140; COMPUTED footnote x 600,
y 880.

## What moves when (f = round((t - 461.25) x 30))

| frames | time | what moves | cue |
|---|---|---|---|
| f0 | 461.25 | ingress; the axis, both empty tracks, row 1 label on, row 2 label ghosted | |
| f1 to f9 | 461.28 to 461.55 | row 1 bar grows 0 to 28M (solid, lit with glow) | "28" at 461.28 |
| f36 to f44 | 462.46 to 462.72 | the hatched extension 28M to 35M grows; "28M to 35M" fades in. STATE `-start` | "35 million" at 462.46 |
| f107 to f117 | 464.82 to 465.15 | row 2 label fades in ("about 1.3M TAO a year, 3,600 a day x 365"); row 1 settles (opacity 1 to .6, glow off) | "about 1.3 million new TAO" |
| f117 to f211 | 465.15 to 468.28 | row 2 bar grows 0 to 360M, ease-in-out over about 3.1 s: it passes the customer bar within a fifth of a second and keeps going (the "far past" beat). STATE `-mid` is about f160 | "a year, which is about" |
| f211 to f217 | 468.28 to 468.48 | "about 360M" fades in inside the bar end; the read-date line beneath it | "360" at 468.28 |
| f230 to f240 | 468.92 to 469.25 | the COMPUTED footnote fades in. STATE `-payoff` | "at the price that I'm recording this" |
| f240 to f295 | to 471.10 | hold (push 1.00 to 1.03) | |

**[VERIFY] at render:** re-read the TAO price; 3,600 x 365 x price must still round to "about 360M" (the VO says 360).
If not, STOP and flag. The customer-money range is a reported figure and does not drift.
