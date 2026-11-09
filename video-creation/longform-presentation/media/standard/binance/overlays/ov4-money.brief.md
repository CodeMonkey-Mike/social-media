# ov4-money: SYSTEM-DESIGN chart "Follow the Money" (one still)

Video: `media/standard/binance/` (longform-presentation, format 4 "standard"). The still is composited INSIDE
the deck area of the screen share: **canvas 1464 x 1080** (not 1920). It holds for 38 s while Mike narrates
slide 3 of `../binance.html` ("Follow the Money"). Fact source: `../RESEARCH.md` (the "where the money is" /
freezes / laundering sections, lines ~90-110). Every number on screen must be in RESEARCH.md; keep the deck's
wording where the deck has it.

## What it shows: nodes + arrows + labeled flows (never a table)
Source node, left: **Binance hot wallets, $6.3B** (10 chains). Arrows fan out to THREE destinations, each its
own lit color, left to right or top to bottom in the order he narrates them:

1. **FROZEN ~$3B** (cyan): "locked where it sits". Tether froze ~1.77B USDT; Circle ~823M USDC; Ripple, World
   Liberty, Paxos and others; Arbitrum's security council pulled back ~$30.5M. Why it was possible: a stablecoin
   has an ISSUER (a node or label: "issuer can freeze").
2. **MOVING** (red): the attackers raced the freezers: ~$786M of stablecoins swapped for ETH + TRX at 12% to 26%
   losses "to get out of anything freezable"; then automated laundering (one Tron wallet, 546 transfers, one every
   96 s). Show the swap as a step (stablecoins -> DEX / market makers -> ETH + TRX -> laundering machine).
3. **SITTING** (gold): 18,270 BTC, ~$1.41B, 19 addresses (mostly 1,000 BTC each), none at an exchange yet.
   "Nobody can freeze Bitcoin" (no issuer). Bitcoin, XRP and Solana have no issuer.

Legend line somewhere quiet: "Stablecoins have an issuer, so they can be frozen. Bitcoin, XRP and Solana have none."
Keep the hierarchy readable at a glance: ONE source, THREE fates, the mechanism (issuer / no issuer) as the
organizing idea. Chapter accent for the lit path: he spends most of the time on FROZEN then MOVING.

## The narration it holds under (spine seconds)
```
174.16 it got frozen, it's locked where it sits   176.70 Tether about 1.7 billion USDT   179.64 Circle ... 823 million USDC
187.92 the attackers raced the freezers   190.88 they dumped around 786 million of stablecoins for ETH and Tron
200.48 at losses of like 12 to 26 percent   207.44 just to get out of anything freezable   210.34 very smart   (ends 212.0)
```

## Deliverable (your fixed layout, but the project is this one)
- `media/standard/binance/assets/diagrams/money-flow.html` (standalone, body exactly 1464 x 1080, the locked
  stylesheet / fonts, SVG nodes + arrows) and `money-flow.png` shot at 1464 x 1080. One state.
- QA-open the PNG yourself: every label inside the canvas (the right edge is 1464, not 1920), nothing clipped,
  no overlaps. No em dashes on screen. Numbers only from RESEARCH.md.
