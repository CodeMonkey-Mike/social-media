# CH4 tail + CH5 first half
cb("CH4", 335.933, 339.88, "envato-video", "But let's get on with this. Now look at these numbers as they are.",
   "BR-17: over-the-shoulder of a person at a desk studying charts on two monitors, calm, slow push",
   "Envato: trader desk monitors charts over shoulder calm", bench="C13 starts at 336.12", notes="FACE 6 ends 335.933 ('below.' ends 335.94). The chapter whip (swoosh-8) into CH5 at 337.30 lands on the fall into the quiet cut. 3.9 s.")
cb("CH5", 339.88, 347.30, "real-chart", "KAS trades around 3 cents, a market cap of around $860 million, around 85% below its all-time high",
   "C13: the real KAS/USD chart (TradingView KASUSD, all-time range), the July 31, 2024 high and the current price both visible, real pixels, never restyled; a slow push-in over the line; no pop",
   "https://www.tradingview.com/symbols/KASUSD/ (all-time range; fallback CoinGecko max-range chart)", pr="high", verify=True, bench="CoinGecko max-range chart",
   notes="Market data = a real-site chart (charts.md guardrail). treatment: push. On-screen figures follow the spoken 'around 3 cents' and 'around $860 million' (Mike).", asset="C13")
cb("CH5", 347.30, 352.68, "receipt", "of July 2024, and around $20 million a day in spot volume.",
   "C34: the CoinGecko Kaspa page header panel (price, market cap, 24 h volume, the ATH line with its date), push to the 24 h volume figure",
   "https://www.coingecko.com/en/coins/kaspa (header stats)", pr="high", verify=True, bench="CoinMarketCap KAS header", notes="LIVE-DRIFT: capture-day figures. treatment: push.", asset="C34")
cb("CH5", 352.68, 358.96, "animated-chart", "Around 96.8% of all KAS is already mined, around 912 million left to go.",
   "C2 state B: the LIGHT donut 96.8% MINED filling, the remainder labelled 912M KAS LEFT; silent",
   "api.kaspa.org/info/coinsupply (DATA.md section 5) [VERIFY]", pr="high", notes="KAS, never dollars (the JSON prints $912 million).", asset="C2", state="B")
cb("CH5", 358.96, 364.52, "animated-chart", "The November cut took the block reward from 2.06 to 1.94 KAS.",
   "C2 state C: the reward step 2.06 -> 1.94 KAS / BLOCK drawing down, labelled NOVEMBER 4, 2026 CUT (past tense)",
   "api.kaspa.org/info/halving + blockreward (DATA.md section 5)", pr="high", notes="No day-relative words on the label.", asset="C2", state="C")
cb("CH5", 364.52, 372.50, "animated-chart", "That's around 1.68 million KAS a day of new supply, and at these prices, well under 1% of what trades in a day.",
   "C2 state D: the bar 1.68M KAS A DAY (NEW SUPPLY) growing beside a 20M A DAY TRADED bar so the ratio reads; the tag WELL UNDER 1%",
   "computed in DATA.md Pillar 4 (1,680,086 KAS a day after the cut; around 0.28% of the 20.0M 24 h volume) [VERIFY]", pr="high",
   notes="Never '55,000 against 10 million' (WARNING 5).", asset="C2", state="D")
cb("CH5", 372.50, 375.76, "receipt", "Hash rate around 368 petahash.",
   "C35: the live network hash-rate readout (explorer.kaspa.org header or 2miners.com/kas-network-hashrate), push to the PH/s figure",
   "https://explorer.kaspa.org/ (hash rate stat) or https://2miners.com/kas-network-hashrate", pr="high", verify=True, bench="api.kaspa.org/info/hashrate JSON",
   notes="LIVE-DRIFT: the capture-day figure. treatment: push.", asset="C35")
cb("CH5", 375.76, 386.74, "animated-chart", "It fell around 70% from May of 2025 to July of 2026, and then it rose 3 months in a row through 3 reward cuts and up 14%.",
   "C3: the LIGHT animated monthly-average hash-rate curve May 2025 to November 2026 (PH/s), the fall drawn first in grey, the July to October rise in the accent with the AUG / SEP / OCT reward-cut ticks, labelled AROUND +14% (JULY AVG TO OCTOBER AVG); silent",
   "api.kaspa.org/info/hashrate/history/<month> monthly averages (DATA.md Pillar 2) [VERIFY]", pr="high",
   notes="Numbers we control = animated chart; the label says 'around' per persona. Never the 1,592 PH/s spike, never '6% in 4 days'.", asset="C3")
cb("CH5", 386.74, 392.14, "animated-chart", "User transactions flat, around 70,000 to 80,000 a day since July.",
   "C4: the LIGHT animated daily user-transactions line July to November 2026 with the 70K to 80K band shaded; the August and September spike days stay visible above the band",
   "api.kaspa.org/transactions/count/<month> regular (non-coinbase) counts (DATA.md Pillar 4) [VERIFY]", pr="high",
   notes="Must not imply every month sits inside the band (AS-RECORDED flag, OPEN QUESTIONS 16).", asset="C4")
