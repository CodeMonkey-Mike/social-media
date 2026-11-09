# ov7-unlock: ANIMATED chart "The Unlock Curve", a time-driven HTML page

Video: `media/standard/JCT/` (longform-presentation, format 4 "standard"). Composited INSIDE the deck area of the
screen share: **canvas 1464 x 1080** (not 1920). It plays for **29.55 s = 887 frames at 30 fps** (spine 674.9 to
704.45) while Mike talks over slide 7 of `../JCT.html` ("The Unlocks Start Tuesday"). **Dark mode.** Fact source:
`../RESEARCH.md` sections 3.2 to 3.4 (allocation, vesting wallets, unlock schedule, lines ~125-159). Every number on
screen must be in RESEARCH.md (or be arithmetic on it, shown in your NOTE).

## What it shows
A CIRCULATING-SUPPLY curve over time (x: Nov 2025 to May 2030, y: 0 to 50B JCT), drawn as a stacked area by bucket
or a single area with the bucket bands labeled at the right end. Shape (from the docs' schedule, RESEARCH 3.2 / 3.4):
- Nov 2025 (launch): 11.49B circulating (22.99%: airdrop 2.85B, liquidity 2B, community 1.5B, 30% of Ecosystem).
  Flat until the cliffs end.
- From **10 Nov 2026 ("Tuesday")**: ~1.2B JCT a month (Ecosystem remainder 12.0B / 24, Foundation 9B / 24,
  Advisors 1.834B / 24, Investors 5B / 18). Investors finish ~May 2028; Ecosystem, Foundation, Advisors ~Nov 2028.
- From **May 2027**: the Team's 10.67B adds ~296M a month for 36 months, to ~May 2030.
- Ends at 50B (100%).

Marks / callouts: a "TODAY" marker at Nov 2026 with "~1/10 of today's float, every month" (or "~1.2B / month");
the Team step at May 2027 labeled "Team: 10.67B from May 2027"; a "77% still locked" readout near the start.
Final-state callout (the payoff): **"No vesting contract: all five locked wallets sit behind the same 5-of-7
multisig"** (the deck's own line is "the schedule is a promise, not code"). Accent: purple for the locked supply /
unlock flow, gold for the Team step, red for the multisig callout.

## The narration it is cued to (LOCAL seconds = spine minus 674.9; the clip's t)
```
0.30 the unlocks start on Tuesday (1.68)   2.10 about a tenth of what's circulating today (3.50)
5.54 So yeah, I mean, the rest is ... pretty standard stuff (11.06)
12.04 Tokenomics bad (12.54), but it's not like we never make any money here ... tokens that have bad tokenomics (21.34)
22.38 no vested contract (22.76)   23.40 all five wallets (24.00)   25.12 the token is the contract itself (26.06)
26.74 sit behind (26.88)   27.94 same five of seven multisig (29.42)   29.55 END
```
Choreography: axes + title draw 0.0 to 1.2; the flat launch band (11.49B) is there from ~0.5; the TODAY / Tuesday
marker pops at 0.6 to 1.7; the "~1/10 of today's float, every month" callout at 2.1; then the curve GROWS month by
month from Nov 2026 through 2030 across ~4 to ~12 (he talks generally: let the growth carry it), the Team step lands
around 8 to 9 with its label; the curve reaches 50B by ~12 ("Tokenomics bad"): hold, with a "77% still to unlock"
readout; at **22.4** ("no vested contract") the multisig callout draws in (a box or a lock with "5 of 7 signers"),
complete by ~28.2 ("five of seven"). Nothing appears before he says it. Each appearance 0.3 to 0.5 s, ease-out.

## Deliverable (your fixed layout, but the project is this one)
- `media/standard/JCT/assets/charts/unlock-curve.html`: ONE standalone page, body exactly 1464 x 1080, the locked
  dark stylesheet / fonts (Playfair / JetBrains Mono / DM Sans), and a global **`window.setT(t)`** (t = local
  seconds, 0 to 29.55) that sets the WHOLE visual state as a PURE FUNCTION of t: no CSS transitions, no CSS
  animations, no requestAnimationFrame, no Date.now(). The caller renders it frame by frame (`setT(f / 30)` +
  screenshot), so the same t must always give the same pixels. Easing in your JS from t.
- State stills for QA: `unlock-curve-s1.png` (t=1.0), `-s2.png` (t=3.6), `-s3.png` (t=9.0), `-s4.png` (t=14),
  `-s5.png` (t=29.55), shot at 1464 x 1080 after `setT`.
- The animation-spec note in `unlock-curve.NOTE.md` (what moves when, hung on which word; every number's source).

No em dashes on screen. No table. Numbers only from RESEARCH.md.
