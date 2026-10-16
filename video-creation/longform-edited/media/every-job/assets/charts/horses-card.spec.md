# horses-card · ANIMATED CHART SPEC (Type 1, the comp animates it for real with useCurrentFrame)
- **Cover beat:** 166.220 to 172.120 s (source spine) · **Look:** HALLOWEEN (CH2 + CH3 look: black / blood red / pumpkin / bone on grunge)
- **Spoken over it:** "America had more than 20 million horses, by 1960 a few million"
- **Source:** `assets/charts/horses-card.html` (frames: start, mid, payoff) · **Design states:** `horses-card-start.png` · `horses-card-mid.png` · `horses-card-payoff.png`
- The PAYOFF still is the approved look the animation must land on pixel for pixel. Start / mid stills carry a small dashed 'DESIGN STATE' tag (top-right corner) that is NOT part of the design: never render it. Mid-state counter values are animation frames, not data.

## What it is
Two-number card in sepia + blood red: 1915 'more than 20 million' with a field of 20 sepia horses (each = 1 million); then 1960: the field WINDS DOWN (horses fade to ghost outlines, last first) until 1 solid horse + 2 sepia outlines (the 1 to 3 million range) remain and 'a few million' lands. No intermediate number is ever displayed (no year in between is sourced).

## What moves when (source-spine seconds; route through sh()/F())
| from | to | what moves | cue (word @ time) |
|---|---|---|---|
| 166.220 | 166.300 | card in (CH2 horror-family transition); header + 1915 block already set; field shows 20 ghost outlines | cover start ('America' 166.22) |
| 167.120 | 168.220 | the 20 horses fill solid sepia left to right, row 1 then row 2 (0.05 s stagger, scale 0.85 -> 1); '20' counts 0 -> 20 in step | 'more than 20 million horses' 167.12 to 168.22 |
| 168.900 | 169.680 | red arrow draws left to right; '1960' fades in | 'by 1960' 168.90 to 169.68 |
| 169.680 | 171.300 | wind-down: horses 20 down to 4 go solid -> ghost outline (#43382f, 1.6 px), last one first, 0.10 s apart; horses 2 and 3 become sepia range outlines (2.8 px); horse 1 stays solid | after '1960' |
| 171.520 | 171.900 | 'a few million' slams in (scale 1.12 -> 1) + range sub-line + the outline legend | 'a few million' 171.52 |
| 171.900 | 172.120 | hold |  |

## Geometry (px at 1920x1080, read off the HTML)
horse glyph = core.g_horse (local box 120 x 100) at scale 1.0; 2 rows x 10, pitch 164 px, x from 146, rows at y 612 and 734. Left block left 140 top 262 ('1915' Mono 48 sepia; 'more than' DM italic 44; '20' Mono 150; 'million' DM 700 56). Arrow left 1010 top 372 (150 x 80, blood 8 px). Right block left 1210 top 262 ('1960' Mono 48 sepia; 'a few million' DM 700 92 blood; range DM 28).

## Every number on screen
| value | source |
|---|---|
| more than 20 million (1915) | DATA.md Pillar 1: The Horse, 'surpassed 20 million' around 1915 [VERIFY vs a USDA table; never 26 million] |
| a few million / 1 to 3 million (1960) | DATA.md Pillar 1: The Horse, 'between 1 and 3 million by 1960 depending on the source' [VERIFY] |
| each horse = 1 million | unit of the field (20 horses = 20 million); not a sourced number |

## Guards
Never 26 million. The USDA table was NOT opened, so the source line cites The Horse only. No number between 20 and 'a few' is shown during the wind-down.

## Count format
integer 0 -> 20 (the '20' only), no other counter
