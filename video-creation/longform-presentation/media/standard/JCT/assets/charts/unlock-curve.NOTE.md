# unlock-curve: animation spec (ov7-unlock, "The Unlock Curve")

Clip: card `ov7-unlock` in `../../overlays/cards.json`, spine 674.9 to 704.45 s = **29.55 s = 887 frames at 30 fps**, canvas
**1464 x 1080** (the deck area), dark mode. Local t = spine seconds minus 674.9. Brief: `../../overlays/ov7-unlock.brief.md`.
Cues checked against `spine/JCT EDIT.enhanced.medium-words.json` (they match the brief's).

The page IS the animation: `window.setT(t)` sets the whole frame as a pure function of t (no CSS transitions or
animations, no rAF, no clock, `document.getAnimations()` = 0). Open the page with `#t=12.5` in the URL to inspect one
moment; with no hash it shows the final state. Verified: 61 frames (every 15th + the last) rendered forward on one page
and shuffled on a fresh page are byte-identical.

Render (the caller; ~0.65 s per frame here, so ~10 min for the clip):
```
python video-creation/longform-presentation/skills/card-overlays/html_clip.py "video-creation/longform-presentation/media/standard/JCT/assets/charts/unlock-curve.html" --frames 887 --out "video-creation/longform-presentation/media/standard/JCT/overlays/ov7-unlock.mp4"
```

## The picture
- A stacked-area CIRCULATING SUPPLY chart, x = 10 Nov 2025 (launch) to May 2030 (54 months, year labels at each
  January, a faint tick per month), y = 0 to 50B JCT (12.8 px per 1B; the 50B max supply is a dashed cap).
- Bottom to top: the launch float (11.49B, neutral slate, flat the whole way), then the five locked baskets: Investors,
  Foundation, Ecosystem, Advisors (the purple token at alpha .22 / .34 / .48 / .66) and the Team on top (gold, a vertical
  gradient so it reads gold, not olive). The curve's top edge glows purple until May 2027, gold after.
- A purple Tuesday marker at Nov 2026 carries the flag (the date, ~1.2B a month, about a tenth of today's float); later
  its span from the float to the cap becomes the "77% still locked" bracket. A gold dot marks the Team's start (May 2027).
- A legend at the right end, one label per basket at its band's centre in May 2030. At the payoff those labels BECOME the
  five wallet nodes: the plot slides left, red wires run from each wallet through one bus into ONE Safe multisig node
  (7 signers, 5 lit), with the token contract wired into the same node from above.

## What moves when (cued to the transcript)
| t (local) | he says | what moves |
|---|---|---|
| 0.00 to 1.30 | ("okay," / "the unlocks") | eyebrow 0.0 to 0.4; headline fades and rises 14 px 0.1 to 0.6; divider grows 0.35 to 0.75; the time axis draws left to right 0.15 to 1.0, month ticks and year labels appear as it passes; gridlines and y labels 0.2 to 0.9; the 50B cap 0.3 to 1.1, "max supply" 0.5; the launch float draws left to right 0.45 to 1.2, its label "11.49B / in circulation / 23% of supply" 0.9 to 1.3; source line 0.8 to 1.4 |
| 0.60 to 1.10 | "unlocks start" (0.62) | the Tuesday marker draws up from the axis at Nov 2026 (ease-out) |
| 1.58 | "Tuesday" (1.68) | "Tuesday, 10 Nov 2026" fades in at the top of the marker (0.35 s) |
| 2.10 | "about" (2.10) | "~1.2B JCT a month" fades and rises (0.35 s); 2.15 to 2.55 the FIRST month lands: a ~1.2B purple slice on top of the 11.49B float, with the growth front's line and glowing dot |
| 2.40 | "a 10th of what's" | "about a tenth of today's / circulating supply, every month" (0.35 s) |
| 2.95 to 4.05 | "circulating today" | the float band brightens and settles (one breath) |
| 4.00 to 6.78 | "So yeah, I mean" | month by month: Dec 2026 to May 2027, one month every 0.62 s, each easing in over 0.30 s |
| 7.10 to 12.00 | "the rest is ... pretty standard stuff" | the sweep, May 2027 to May 2030 (sine ease in-out); the four purple baskets fill; at 7.15 the gold step dot appears and the Team band grows on top. Investors flattens at May 2028; Ecosystem, Foundation, Advisors at Nov 2028; the Team runs up to 50B |
| 8.30 to 12.00 | | "Team: 10.67B / from May 2027" fades in beside the front at the gold band's centre (0.35 s) and rides the front to the right end, parking there at 12.0 |
| 11.30 to 12.40 | "stuff" | the legend lands, bottom to top: Investors 11.30, Foundation 11.42, Ecosystem 11.54, Advisors 11.66 (0.35 s each); the front fades 12.0 to 12.4 |
| 12.04 | "Tokenomics bad" | the marker's span from the float (11.49B) to the cap (50B) becomes a bracket: end ticks + glow (0.4 s); "77% still locked" fades in at 12.25 |
| 12.6 to 21.7 | "but it's not like we never make any money here ..." | hold (s4) |
| 21.70 | "tokenomics," | the ~1.2B callout's three lines fade (0.35 s); the date stays on the marker |
| 22.05 to 22.85 | (pause, then "no vested contract") | THE MOVE, ease-in-out cubic: the plot's right end slides 1180 to 846 px, the time axis compresses and every label rides it; a red orb warms the right side 22.2 to 23.2 |
| 22.38 | "no vested contract" | "No vesting contract" (red Playfair) fades and rises 12 px (0.4 s) |
| 23.00 | | the Team label's ": 10.67B" and "from May 2027" fade (0.3 s): it is now just "Team" |
| 23.42 to 24.50 | "all five wallets" | "ALL FIVE LOCKED WALLETS" eyebrow; each legend label becomes a wallet node, top to bottom: Team 23.45, Advisors 23.62, Ecosystem 23.79, Foundation 23.96, Investors 24.13 (outline draws 0.35 s, label brightens); each basket's band pulses as its node draws |
| 25.30 | "the token is the contract itself" | the "Token contract" node pops in (scale 0.94 to 1, 0.35 s) |
| 26.78 to 27.45 | "sit behind" | the Safe multisig node scales in with its lock (shackle open) and its "SAFE MULTISIG" label (26.78 to 27.2); red wires draw: each wallet to the bus 26.92+, the bus 27.02 to 27.27, junction dots 27.04, the trunk into the node 27.20 to 27.40 + arrowhead; the token contract's wire down into the node 27.05 to 27.30 + arrowhead |
| 27.95 | "same" | seven signer rings pop in, left to right, 0.04 s apart |
| 28.22 | "five" | five of them fill red, 0.05 s apart; "5 of 7 signers" fades in (0.3 s) |
| 28.58 | "or seven" | the lock's shackle closes (0.3 s) |
| 28.9 to 29.55 | "multi-stake" | hold on the final state (s5). card_overlays adds its own 11-frame fade in and 0.3 s fade out |

## State stills (shot after `setT`, 1464 x 1080)
- `unlock-curve-s1.png` t=1.0: the build-in (title up, axes, the float drawing, the Tuesday marker rising)
- `unlock-curve-s2.png` t=3.6: the Tuesday flag, ~1.2B a month = about a tenth of today's float, the first month landed
- `unlock-curve-s3.png` t=9.0: mid-sweep, the gold Team step on top, its label riding the front
- `unlock-curve-s4.png` t=14: the whole curve to 50B, the legend, "77% still locked" (the hold)
- `unlock-curve-s5.png` t=29.55: the payoff: no vesting contract, five wallets + the token contract behind one 5-of-7 Safe

## Every number and where it comes from (`../../RESEARCH.md`)
| on screen | RESEARCH |
|---|---|
| 11.49B in circulation | 1.1 CoinGecko circulating 11,493,687,500; = 3.2's TGE float: airdrop 2.85B + liquidity 2B + community 1.5B + 30% of Ecosystem's 17,145,625,000 = 11,493,687,500 (arithmetic, exact match) |
| 23% of supply | 3.2 "TGE circulating 22.99%" (11.49B / 50B), rounded; Top-20 #12 "only ~23% circulating" |
| 77% still locked | 3.3 "Still locked: 38.51B JCT = 77.01% of supply" (= 50B minus 11.49B) |
| Tuesday, 10 Nov 2026 | 3.4 "the 12-month cliffs end ~10 Nov 2026"; [S19] "JCT unlock Tue 10 Nov" |
| ~1.2B JCT a month | 3.4 "Phemex: about 1.2 billion JCT a month" (my calc 1.23B); 9 DO-NOT-AIR: "say about 1.2 billion" |
| about a tenth of today's circulating supply, every month | 3.4 "~10.7% of circulating supply"; 8.1 "~10.7% of today's float every month" (1.229B / 11.494B = 10.7%); the deck's own line |
| Team: 10.67B from May 2027 | 3.2 Team 10,670,000,000, 18-month cliff, 3 years; 3.4 "Team cliff: early May 2027, then ~296M JCT a month ... Last tranche early May 2030" |
| 50B, max supply | 3.2 "Total supply 50,000,000,000 JCT" |
| Ecosystem, Team, Foundation, Investors, Advisors (the five locked wallets) | 3.3 the five Safe vesting wallets |
| Token contract | 3.3 "All five + the token owner are Safe multisigs"; the deck's "and the token contract itself" |
| Safe multisig, 5 of 7 signers (7 rings, 5 lit) | 3.3 "threshold 5 of the same 7 signers (verified on-chain)"; 8.2 |
| No vesting contract | 3.3 "No vesting smart contract enforces the schedule"; the deck's slide 7 |
| 0, 10B to 50B; 2026 to 2030 | axis scale only |

The curve's SHAPE (no number printed from it), stacked linear vesting from 3.2, month 0 = 10 Nov 2025:
| basket | amount | releases | per month |
|---|---|---|---|
| launch float | 11.4936875B | flat from month 0 | 0 |
| Investors | 5B | months 12 to 30 (Nov 2026 to May 2028) | 277.8M |
| Foundation | 9B | 12 to 36 (Nov 2026 to Nov 2028) | 375.0M |
| Ecosystem (the 70% left) | 12.0019375B | 12 to 36 | 500.1M |
| Advisors | 1.834375B | 12 to 36 | 76.4M |
| Team | 10.67B | 18 to 54 (May 2027 to May 2030) | 296.4M |

Checks: the Nov 2026 cohort = 27.836B (3.4 "27.84B begins vesting"), 1.229B a month (3.4 "~1.23B"); totals 18.87B at
May 2027, 28.02B Nov 2027, 37.18B May 2028, 44.66B Nov 2028, 50.00B May 2030. Linear release from each cliff is the
docs' wording; what actually moves is the multisig's call (3.4 last bullet), which is the payoff's point. The Ecosystem
band is the locked 12.0B; the Ecosystem wallet also still holds ~1.14B of its TGE share (3.3, 1.1), not drawn and not printed.

No number on screen lacks a RESEARCH source.

## Calls made (worth a look)
- **The marker says "Tuesday, 10 Nov 2026", not "TODAY".** Today (8 Nov) and the unlock (10 Nov) are the same pixel on a
  54-month axis; the date is what he says and it stays true after publish. "today's" survives inside the callout because
  he says "what's circulating today" (the deck's own "today's circulating supply").
- **Stack order** bottom to top: float, Investors, Foundation, Ecosystem, Advisors, Team. The thin Advisors band sits
  between two thick ones (labels at least 77 px apart) and the Team's later start reads as a gold step on the top edge.
  The four purple baskets differ by alpha only: no new colours.
- **The float is neutral slate**, not the deck table's green "already out", so the accents stay exactly the brief's
  three: purple (unlock flow), gold (Team), red (multisig).
- **Pacing:** the first month lands alone on "about a tenth" so the ~1.2B slice sits visibly on the 11.49B float; Dec
  2026 to May 2027 tick in one month at a time ("month by month"); the rest sweeps so the Team step lands ~8 to 9.
- **The Team label rides its band** at the growth front and parks in the legend, rather than a fixed callout at May 2027:
  the free space by the step is taken by the flag and is later overgrown by the curve. The gold dot stays on the step.
- **The payoff is a move + a system view, not a text box:** the plot compresses left, the legend labels become the
  five wallet nodes at their own band heights, one bus into one 5-of-7 node, token contract from above. The brief's
  sentence is carried as headline ("No vesting contract") + eyebrow ("All five locked wallets") + the node ("Safe
  multisig, 5 of 7 signers"). The Ecosystem wire runs straight through the bus into the node (node centred on that row).
- **The node's "SAFE MULTISIG" label arrives with the node** on "sit behind" (26.78), before he says "multisig" (29.04,
  after the clip's last frame); the brief lets the box draw in from 22.4, and a wire landing on an unnamed box read worse.
- **Divider = the deck's slide-7 purple to gold pairing**, not the stylesheet's green to cyan, to match the slide under it.
- **Spoken vs shown:** he says "no vested contract" and "five or seven multi-stake" (transcript); on screen the correct
  "No vesting contract" and "5 of 7" (RESEARCH 3.3, the deck).
- **Determinism fixes (worth folding into the precedent):** the stylesheet's `filter: blur(120px)` orbs are drawn as the
  same falloff in a radial gradient, and the HTML text that fades sits on its own layer from frame 0 (`will-change`). With
  the CSS blur and a layer promoted mid-clip, the SAME t gave 1 to 3,910 differing pixels depending on render history
  (the blur on the GPU; the source line's text antialiasing flipping after a fade to 0). binance's `drain-timeline.html`
  carries both patterns.
