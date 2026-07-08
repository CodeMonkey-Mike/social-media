# Kaspa Founder: Genius or Over-Rated? — DATA & CHART-SOURCE INDEX

_Numbers carry a source. Market caps drift hard, so every on-screen value is `[VERIFY]` in the screenplay and
**re-pulled at render**. The chart STILLS in `assets/charts/` are the approved design references; the live
Remotion versions animate them with re-verified numbers (per `skills/charts.md`)._

## Market snapshot (approximate, 2026-06-29, CoinGecko / CoinMarketCap) `[VERIFY at render]`
- Total crypto market cap ~$2.18T; Bitcoin ~$1.21T (dominance ~55.6%); **Ethereum dominance ~8.96% => ~$195B, rank #2**.
- Approx top networks by market cap: BTC ~$1,210B · ETH ~$195B · XRP ~$140B · Solana ~$90B · BNB ~$85B.
  (Hyperliquid entered the top-10 altcoins ~2026-06-01; exact order shifts daily, confirm at render.)
- **Kaspa (KAS): ~$0.77B-$0.85B, rank ~#62-#93** depending on tracker (CMC #62 ~$767M; others #79-#93 ~$0.81-0.85B).
- Ethereum's whitepaper CITES Sompolinsky & Zohar's 2013 GHOST paper; early Ethereum shipped a SIMPLIFIED
  variant (the uncle / ommer reward), not the full fork-choice. (Genius/over-rated guardrail, never overclaim.)

## CHART-SOURCE INDEX
_Build mode per `skills/charts.md`: **code** = accurate animated Remotion component (numbers are the message)._

| ID | Chart | Where | Build mode | Status |
|---|---|---|---|---|
| **C-RANK** | Top crypto networks by market cap, Ethereum highlighted #2 + "cites GHOST" callout | CH1 B2 (reused in CH7 C-STACK) | **code** | STILL DONE: `assets/charts/CH1_C-RANK_network-marketcap.{html,png}` |
| **C-MCAP** | Kaspa market cap as a small bar vs larger networks (size context) | CH6 B5 | **code** | STILL DONE: `assets/charts/CH6_C-MCAP_kaspa-vs-larger.{html,png}` |

- Both STILLS use the approximate snapshot above and carry a `[VERIFY]` footer. At render: re-pull the caps
  (CoinGecko / CoinMarketCap), update the bar widths + value labels, then animate (bars grow + values count-up).
- NEVER source these numbers from an image model (the hard guardrail). The stills are code-rendered HTML.

## Sources
- CoinGecko (coingecko.com), CoinMarketCap (coinmarketcap.com) for live caps/ranks.
- Ethereum whitepaper references (the GHOST citation) for the C-RANK callout, confirm exact reference text on screen.
