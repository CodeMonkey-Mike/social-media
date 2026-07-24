# tao-render-virtuals — receipt captures

Captured 2026-07-19, 1920x1080 viewport, real Chrome via Playwright (`channel: 'chrome'`).
All PNGs QA'd by eye (opened and verified) before being marked PASS.

NOTE: taostats.io was ABANDONED per Mike (2026-07-19). It fronts every visitor with an
interactive Cloudflare Turnstile ("Verify you are human") that rejected every automated
click (bundled Chromium, real Chrome headful, stripped automation flags, and Camoufox all
failed). The three taostats receipts were re-sourced from CoinGecko / TaoMarketCap instead;
the wall screenshots were deleted. Do not retry taostats captures.

| # | File | Source | Status | What it shows |
|---|---|---|---|---|
| R1 | `R1-coingecko-tao.png` | coingecko.com/en/coins/bittensor | PASS | Bittensor (TAO) $197.51, +2.6% 24h, Market Cap $1.896B, rank #39, 24h chart |
| R2 | `R2-coingecko-render.png` | coingecko.com/en/coins/render | PASS | Render (RENDER) $1.48, Market Cap $767.9M, rank #71, 24h chart |
| R3 | `R3-coingecko-virtuals.png` | coingecko.com/en/coins/virtual-protocol | PASS | Virtuals Protocol (VIRTUAL) $0.6062, Market Cap $398.641M, rank #107, 24h chart |
| R4 | `R4-taomarketcap.png` | taomarketcap.com | PASS | "Total Subnets 128" header + live subnets table (SN 64 Chutes at rank #2). Supports the "120+ subnets" claim. (Optional receipt; originally taostats /subnets, re-sourced.) |
| R5 | `R5-otoy.png` | otoy.com | PASS | OTOY homepage: OTOY branding, "Render" nav item, OctaneRender / OctaneStudio+ 2026 hero. No explicit "Render Network" mention above the fold. |
| R6 | `R6-taomarketcap-sn64.png` (PRIMARY) | taomarketcap.com/subnets/64 | PASS | "Chutes" named as SN 64 on the Bittensor explorer: rank #2, mcap τ426.07K, price τ0.07878, candle chart. Proves Subnet 64 = Chutes. |
| R6b | `R6-chutes-ai.png` (bonus) | chutes.ai | PASS | Chutes homepage hero ("Breakthrough Serverless Compute for AI, at Scale") with the bittensor wordmark under "Chutes Global". Brand shot; does NOT say "subnet 64" anywhere. |
| R7 | `R7-simplytao-steeves.png` | simplytao.ai/blog/jacob-steeves-steps-down-as-opentensor-ceo | PASS | Headline "Jacob Steeves Steps Down as Opentensor CEO" + "Published February 13, 2026" both in frame. Correct story (Opentensor/Bittensor, not Foundry). |

Numbers seen at capture time (for DATA.md cross-check, all 2026-07-19):
- TAO $197.51 / mcap $1.896B (CoinGecko)
- RENDER $1.48 / mcap $767.9M (CoinGecko)
- VIRTUAL $0.6062 / mcap $398.641M (CoinGecko)
- Bittensor total subnets: 128 (TaoMarketCap)
- SN 64 Chutes: #2 subnet by mcap, τ426.07K (TaoMarketCap)
