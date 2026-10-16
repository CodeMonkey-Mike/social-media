# every-job · SYSTEM-DESIGN DIAGRAM STATE CUES (Type 2)
_Written by chart-builder, 2026-10-07. One table per diagram id. Every state is its own 1920x1080 PNG beside its
HTML source; shared elements are pixel-identical between consecutive states, so a state change is a SWAP (quick
cross-fade, about 6 to 8 frames, no scale move) and reads as the element lighting / transforming, never as a new
slide. Times are SOURCE-spine seconds (final spine `spine/ALL.d.desilenced.mp4`): route them through sh()/F().
A state holds until the next row's time; the last state holds to the cover's tOut. The first row of each table
is the frame the cover's ingress transition lands on._

**Tier badge (C3) is baked into every chart/diagram that needs one (top-right, top 58, right 80, h 58): the comp
must NOT stack its own corner badge on these assets.** For b-roll / images / receipts the comp overlays the
transparent full-frame `C3-badge-deployed.png` / `C3-badge-claimed.png` / `C3-badge-forecast.png` (same pixels).

## new-jobs-chain  ·  cover 129.860 to 138.333 s  ·  HALLOWEEN look
_Spoken:_ "technology makes things cheaper, cheaper frees up money, that money builds new markets and the new markets need workers"  
_Source:_ `assets/diagrams/new-jobs-chain.html`

| state file | show at (s) | cue word | what changes vs the previous state |
|---|---|---|---|
| `new-jobs-chain-s1.png` | 129.86 | 'Technology' 129.86 | TECHNOLOGY lights (pumpkin border + glow, icon pumpkin); the other four sit dim but readable |
| `new-jobs-chain-s2.png` | 131.20 | 'cheaper' 131.20 | arrow 1 lights + LOWER COSTS lights (glow moves to the newest node) |
| `new-jobs-chain-s3.png` | 132.60 | 'freeze up money' 132.60 | arrow 2 + FREED-UP MONEY |
| `new-jobs-chain-s4.png` | 134.76 | 'new markets' 134.76 | arrow 3 + NEW MARKETS |
| `new-jobs-chain-s5.png` | 136.94 | 'need workers' 136.94 | arrow 4 + NEW JOBS; takeaway 'Every link has to hold for the new jobs to show up.' |

The rich diagram shown ONCE (THE BALANCE). Each swap = 6-frame cross-fade; nothing else moves. s5 is pixel-identical to new-jobs-chain-broken-s1, so the broken beat after F3 picks up exactly where this one left.

## new-jobs-chain-broken  ·  cover 141.700 to 144.880 s  ·  HALLOWEEN look
_Spoken:_ "Then the chain breaks at the very last link"  
_Source:_ `assets/diagrams/new-jobs-chain-broken.html`

| state file | show at (s) | cue word | what changes vs the previous state |
|---|---|---|---|
| `new-jobs-chain-broken-s1.png` | 141.70 | 'Then the chain' 141.86 | the intact, fully lit chain (pixel-identical to new-jobs-chain-s5) |
| `new-jobs-chain-broken-s2.png` | 142.46 | 'breaks' 142.46 | the last arrow SNAPS: a blood-red crack splits it (the two halves go red), the NEW JOBS border turns dashed (cut off); takeaway swaps to 'The chain breaks at the very last link.' (the comp may add a 4-frame shake on this swap) |
| `new-jobs-chain-broken-s3.png` | 144.10 | 'last link' 144.10 | NEW JOBS is struck through and relabeled DONE BY MACHINES in blood red; its icon turns into a robot; the node border goes blood red with a red glow |

A state change of the chain, not a repeat of the slide.

## C3  ·  cover 235.060 to 240.980 s  ·  HALLOWEEN look
_Spoken:_ "I'm gonna split it three ways, what's already deployed, what's being claimed and what's coming"  
_Source:_ `assets/diagrams/C3.html`

| state file | show at (s) | cue word | what changes vs the previous state |
|---|---|---|---|
| `C3-s1.png` | 235.06 | 'I'm gonna split it three ways' 235.06 | the empty ladder: three dim rungs (DEPLOYED bottom, CLAIMED middle, FORECAST top) |
| `C3-s2.png` | 237.58 | 'deployed' 237.58 | DEPLOYED rung lights (white badge, white border) |
| `C3-s3.png` | 239.12 | 'claimed' 239.12 | CLAIMED rung lights (gray) |
| `C3-s4.png` | 240.70 | 'coming' 240.70 | FORECAST rung lights (amber = house gold #ffd700, dashed border) |

THE TIER BADGE (used on every robot beat for the rest of the video): pill, top 58 right 80, height 58, 2.5 px border in the tier colour, fill rgba(6,7,10,.80), DM Sans 700 22 px caps letter-spacing .16em, 18 px icon: DEPLOYED #e8eaf0 solid dot · CLAIMED #8892a4 half-filled dot · FORECAST #ffd700 dashed ring + dashed border. Ready-made transparent 1920x1080 overlays: `C3-badge-deployed.png`, `C3-badge-claimed.png`, `C3-badge-forecast.png` (alpha PNG, badge only, same pixels as on the charts). Charts that already carry a badge must NOT get a second one.

## C3-forecast  ·  cover 305.800 to 308.940 s  ·  HALLOWEEN look
_Spoken:_ "I think we're only just a few years away and here's why"  
_Source:_ `assets/diagrams/C3-forecast.html`

| state file | show at (s) | cue word | what changes vs the previous state |
|---|---|---|---|
| `C3-forecast-s1.png` | 305.80 | 'I think' 305.78 | the ladder with ONLY the FORECAST rung lit (DEPLOYED + CLAIMED dimmed): same pixels as C3-s4 except the two lower rungs |
| `C3-forecast-s2.png` | 307.64 | 'away' 307.64 | the corner FORECAST badge stamps in top-right; it stays on through the house argument (the comp continues it as the C3-badge-forecast overlay on the b-roll and stills that follow) |

A state of C3, not a repeat of the full ladder.

## C1-pre  ·  cover 319.300 to 321.933 s  ·  HALLOWEEN look
_Spoken:_ "And that means is not just one robot per trade"  
_Source:_ `assets/diagrams/C1-pre.html`

| state file | show at (s) | cue word | what changes vs the previous state |
|---|---|---|---|
| `C1-pre-s1.png` | 319.30 | 'And that means' 319.30 | the status quo: five trades (person + van each) on the right, five dashed van routes arriving at YOUR HOUSE (the dashed boundary on the left), 'one trade at a time' inside it; no robot yet |

Pre-state of the marquee. The house boundary, the five trade rows and the five link lines sit at EXACTLY the C1 positions, so the C1-pre -> (F6) -> C1 MELT reads as the house filling with one robot. No numbers here.

## C1  ·  cover 325.300 to 335.440 s  ·  HALLOWEEN look
_Spoken:_ "the plumber, the electrician, the roofer, the HVAC tech, the carpenter, that's about 2.8 million jobs in America in just those five trades"  
_Source:_ `assets/diagrams/C1.html`

| state file | show at (s) | cue word | what changes vs the previous state |
|---|---|---|---|
| `C1-s1.png` | 325.30 | cover start (MELT lands here) | ONE ROBOT inside YOUR HOUSE, five skill modules plugged into it, dashed links out to the five trade rows; everything unlit; FORECAST badge on the robot side |
| `C1-s2.png` | 325.64 | 'the plumber' 325.64 | Plumbers lights: row border + module + fan curve + link go pumpkin, count 510,600 appears |
| `C1-s3.png` | 326.38 | 'the electrician' 326.38 | Electricians lights: row border + module + fan curve + link go pumpkin, count 821,000 appears |
| `C1-s4.png` | 327.30 | 'the roofer' 327.30 | Roofers lights: row border + module + fan curve + link go pumpkin, count 166,900 appears |
| `C1-s5.png` | 328.40 | 'the HVAC tech' 328.40 | HVAC techs lights: row border + module + fan curve + link go pumpkin, count 440,900 appears |
| `C1-s6.png` | 329.70 | 'the carpenter' 329.70 | Carpenters lights: row border + module + fan curve + link go pumpkin, count 889,700 appears |
| `C1-s7.png` | 331.04 | '2.8 million jobs' 331.04 | total line lands bottom right: 'about 2.8 million US jobs in just these five trades' |

THE marquee system-design diagram, shown ONCE in full (THE BALANCE); C1-download is its break-up state. The FORECAST badge sits on the ROBOT side only (the BLS counts on the right are facts, not forecasts). Hold s7 to 335.44.

Numbers on screen: 510,600 · 821,000 · 166,900 · 440,900 · 889,700 (DATA.md Pillar 3 table A, BLS 2025) · about 2.8 million (DATA.md: sum 2,829,100 (computed) [VERIFY])

## upload-a  ·  cover 339.140 to 343.760 s  ·  HALLOWEEN look
_Spoken:_ "you can upload a program to your brain to learn a whole new skill, just like how to be a"  
_Source:_ `assets/diagrams/upload-a.html`

| state file | show at (s) | cue word | what changes vs the previous state |
|---|---|---|---|
| `upload-a-s1.png` | 339.14 | 'upload' 339.14 | UPLOAD container: 'Uploading skill: Helicopter pilot', the empty 20-segment bar, cable to the robot head (visor dark), 'UPLOADING...', FORECAST badge |
| `upload-a-s2.png` | 341.00 | 'learn' 341.58 (lead in) | 7 of 20 segments filled, the robot visor lights, three packets ride the cable |
| `upload-a-s3.png` | 342.88 | 'just like' 342.88 | 14 of 20 segments (it does NOT finish: the payoff is upload-b) |

Progress UI, not data: the comp may step the fill segment by segment between these stills with a clip on s3 over s1 (segment i spans x = 140 + 62 i to 196 + 62 i, y 590 to 740) rather than only swapping three states. 'Helicopter pilot' is spoken at 343.76+ under the next b-roll; it is on screen from the start on purpose. Homage only: no film footage, no green-code look, no logo.

## upload-b  ·  cover 347.320 to 350.120 s  ·  HALLOWEEN look
_Spoken:_ "or in this case how to be an expert electrician"  
_Source:_ `assets/diagrams/upload-b.html`

| state file | show at (s) | cue word | what changes vs the previous state |
|---|---|---|---|
| `upload-b-s1.png` | 347.32 | 'in this case' 347.32 | same container, skill 'Expert electrician', 16 of 20 segments, packets riding |
| `upload-b-s2.png` | 349.48 | 'electrician' 349.48 | bar completes 20 of 20, packets gone, '100% COMPLETE' slams in (scale 1.15 -> 1) |

The payoff of the upload bar. Same layout as upload-a, so the container -> b-roll -> b-roll -> container sequence reads as one upload.

Numbers on screen: 100% (UI state (the plan's 'EXPERT ELECTRICIAN: 100 percent'), not a sourced number)

## C1-download  ·  cover 366.600 to 371.440 s  ·  HALLOWEEN look
_Spoken:_ "a human electrician needs a four or five year apprenticeship, a robot needs a download"  
_Source:_ `assets/diagrams/C1-download.html`

| state file | show at (s) | cue word | what changes vs the previous state |
|---|---|---|---|
| `C1-download-s1.png` | 366.60 | 'a human electrician' 366.92 | C1 with ELECTRICIANS isolated: its row, ELECTRICAL module, fan curve and link lit; the other four trades dimmed to .45 with their counts; header becomes 'Years of training, or one download' |
| `C1-download-s2.png` | 368.66 | 'four or five year apprenticeship' 368.66 | under the trades: 'Electrician: a 4 or 5 year apprenticeship, per person (BLS)' |
| `C1-download-s3.png` | 371.08 | 'download' 371.08 | under the house: 'Robot: one download, every robot' + a download glyph on the ELECTRICAL module; the comp pulses the FORECAST badge once on this swap (scale 1 -> 1.12 -> 1, 10 frames) |

Break-up state of C1. The apprenticeship length is the ELECTRICIAN's only (BLS); the plan's 'per trade' wording was narrowed because BLS confirms 4 or 5 years for electricians alone (AS-RECORDED 565.20 guard).

Numbers on screen: 4 or 5 year apprenticeship (DATA.md Pillar 2 T3: BLS electricians, '4- or 5-year apprenticeship program')

## C9  ·  cover 658.020 to 666.720 s  ·  house look
_Spoken:_ "17 steps in a row, no human hand, on pig tissue this time, there may be no robot surgeon for sale right now"  
_Source:_ `assets/diagrams/C9.html`

| state file | show at (s) | cue word | what changes vs the previous state |
|---|---|---|---|
| `C9-s1.png` | 658.02 | '17 steps' 658.02 | three rising steps: 2022 'A live pig' (gray) and 2025 'Pig cadaver tissue · 17 steps in a row, no human hand' (cyan, glowing: the current step); the third step is an empty dashed slot with '?' |
| `C9-s2.png` | 662.36 | 'this time' 662.36 | the third step fills: NEXT 'A human patient · not yet' in red (carries the dropped 'Never on a human') |
| `C9-s3.png` | 663.84 | 'no robot surgeon' 663.84 | 'No autonomous robot surgeon is for sale. The day one is...' + FORECAST corner badge (the forecast starts on 'the day there is' 664+ and runs through F11) |

The graphic states the FACT (none is for sale) even though the VO hedges 'there may be' (AS-RECORDED 662.90 flag).

Numbers on screen: 17 steps (DATA.md Pillar 3 surgeon block: SRT-H, '17 sequential surgical tasks', pig cadaver tissue, 2025-07-09) · 2022 live pig, marked tissue (DATA.md: STAR 2022, 'Required specially marked tissue')

## two-forces  ·  cover 704.040 to 708.600 s  ·  house look
_Spoken:_ "So what does all this do to the economy, two things and they pull in opposite directions"  
_Source:_ `assets/diagrams/two-forces.html`

| state file | show at (s) | cue word | what changes vs the previous state |
|---|---|---|---|
| `two-forces-s1.png` | 704.04 | 'So what does all this do' 704.04 | THE ECONOMY node alone under the header |
| `two-forces-s2.png` | 706.12 | 'two things' 706.12 | two short arrows sprout from the node (cyan left, red right), numbered 1 and 2, unlabeled |
| `two-forces-s3.png` | 708.06 | 'opposite directions' 708.06 | the arrows splay out to full length, a dashed arc + 'PULLING APART' opens between them, and the labels land: 1 PRICES down ('what machines make gets cheaper'), 2 PAYCHECKS down ('fewer people get paid') |

Labels only arrive with the gap on 'opposite directions' (the forces are named right after: price collapse 708.60, spending 734.94). Both arrows point DOWN on purpose: both fall, and they pull the economy apart.

## C14  ·  cover 809.760 to 823.160 s  ·  house look
_Spoken:_ "Now we get to the part that actually worries me, a society runs on a three-way deal, government, business and working people, and the reason working people get a seat at the table is that the other two need our labor, that seat is already shrinking"  
_Source:_ `assets/diagrams/C14.html`

| state file | show at (s) | cue word | what changes vs the previous state |
|---|---|---|---|
| `C14-s1.png` | 809.76 | 'Now we get to the part' 809.76 | header 'A three-way deal' + the empty table ring |
| `C14-s2.png` | 814.30 | 'Government' 814.30 | GOVERNMENT seat lands (purple) at the top of the table |
| `C14-s3.png` | 814.94 | 'business' 814.94 | BUSINESS seat lands (cyan) bottom left |
| `C14-s4.png` | 815.84 | 'working people' 815.84 | WORKING PEOPLE seat lands (green) bottom right; the three links between the seats draw |
| `C14-s5.png` | 821.02 | 'labor' 821.02 | the two links into WORKING PEOPLE turn green and get LABOR tags (the other two need our labor) |
| `C14-s6.png` | 821.34 | 'that seat is already shrinking' 821.34 | the WORKING PEOPLE seat shrinks (r 118 -> 78); hold to 823.16 |

The rich diagram shown ONCE in full (THE BALANCE, held 13.4 s). C14-leverage and C14-allowance are its break-up states: every shared element (table, seats, links, tags) is pixel-identical across all three ids. The comp may tween the shrink (s5 -> s6, 0.3 s) instead of a hard swap. Colour roles: GOVERNMENT purple, BUSINESS cyan, WORKING PEOPLE + LABOR green, ALLOWANCE purple (it comes from government), RULES red.

## C14-leverage  ·  cover 835.880 to 842.900 s  ·  house look
_Spoken:_ "labor was your leverage, take away the need for labor and government and businesses are holding all the cards"  
_Source:_ `assets/diagrams/C14-leverage.html`

| state file | show at (s) | cue word | what changes vs the previous state |
|---|---|---|---|
| `C14-leverage-s1.png` | 835.88 | 'labor was your leverage' 835.88 | the LABOR links PULSE: thicker green with a glow (the comp may breathe s1 opacity .8 -> 1 -> .8 once) |
| `C14-leverage-s2.png` | 837.98 | 'take away the need for labor' 837.98 | the LABOR links are gone (dashed ghosts with red X marks), WORKING PEOPLE dims to .38 |
| `C14-leverage-s3.png` | 840.08 | 'Government and businesses' 840.08 | GOVERNMENT and BUSINESS each hold a fan of three cards ('holding all the cards' 841.74) |

Mike's ruling: this line is COVER, not face. Starts on the C14-s6 geometry (WORKING PEOPLE already shrunk).

## C14-allowance  ·  cover 856.660 to 859.920 s  ·  house look
_Spoken:_ "and whoever sends the allowance sets the rules"  
_Source:_ `assets/diagrams/C14-allowance.html`

| state file | show at (s) | cue word | what changes vs the previous state |
|---|---|---|---|
| `C14-allowance-s1.png` | 856.66 | 'and whoever' 856.66 | a thin purple ALLOWANCE arrow arcs from GOVERNMENT down to WORKING PEOPLE |
| `C14-allowance-s2.png` | 857.46 | 'sends' 857.46 | the arrow THICKENS (6 -> 16 px) |
| `C14-allowance-s3.png` | 858.70 | 'sets the rules' 858.70 | a red RULES tag (padlock) attaches to the arrow |

Last break-up state of C14 (cards still held, labor still gone). The comp may draw s1's arrow on with stroke-dashoffset over 0.3 s from 856.66 instead of a hard swap.

## C17  ·  cover 920.000 to 927.740 s  ·  house look
_Spoken:_ "There's an open standard called x402 where software pays software in [stablecoins]. In one 30-day stretch"  
_Source:_ `assets/diagrams/C17.html`

| state file | show at (s) | cue word | what changes vs the previous state |
|---|---|---|---|
| `C17-s1.png` | 920.00 | "There's an open standard" 920.00 | AI AGENT and SERVER boxes with dashed lifelines, the x402 pill between them, DEPLOYED badge |
| `C17-s2.png` | 921.64 | 'x402' 921.64 | message 1 (cyan, agent -> server): 'asks for the data' |
| `C17-s3.png` | 922.82 | 'where' 922.82 | message 2 (gold, server -> agent): '402 Payment Required + a price' |
| `C17-s4.png` | 923.76 | 'pays' 923.76 | message 3 (green, agent -> server): 'signs a stablecoin payment, asks again' |
| `C17-s5.png` | 925.06 | 'in [stablecoins]' 925.06 | message 4 (cyan, server -> agent): 'the data comes back' |
| `C17-s6.png` | 926.36 | 'In one 30-day stretch' 926.36 | stat line: 'about 75 million payments in 30 days · average 32 cents' (spoken right after the beat) |

x402 is always lowercase x (AS-RECORDED mishear 921.64 'x4o2'). The comp can draw each message arrow on (stroke-dashoffset, 0.25 s) starting at its cue instead of a hard swap; everything else is pixel-identical between states.

Numbers on screen: 402 Payment Required (DATA.md Pillar 6b: the x402 flow) · about 75 million · 30 days · 32 cents (DATA.md Pillar 6b: CoinDesk 2026-07-15 citing x402.org [VERIFY])
