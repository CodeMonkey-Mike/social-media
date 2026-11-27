# longest-bear: RESEARCH

_The only number source for this video's script and cards. Every Bitcoin figure below is measured from daily closes by
`research/btc_stats.py` (output `research/btc-stats.json`); every macro and news fact is in `research/macro-claims.md`
with its URL and read date. Read 2026-11-25 (UTC). A figure that drifts by the recording day is re-pulled here and its
card rebuilt BEFORE the render (`script.md` flow step 7)._

## 1. The sources

| Data | Source | Notes |
|---|---|---|
| BTC-USD daily close, 2014-09-17 to 2026-11-25 | Yahoo Finance chart API (`BTC-USD`, 1d), file `research/btc-daily-yahoo.json` | A "close" is the UTC day close. Today's row is a partial day: the last row is re-pulled on the recording day. |
| BTC-USD daily close, 2013-01-01 to 2015-09-27 | Bitstamp OHLC API (`btcusd`, 86400 s), file `research/btc-daily-bitstamp-2013-2015.json` | Used for the 2013-14 peak (Yahoo starts in Sept 2014). |
| Moving averages | computed from the closes above | 200-day = simple average of 200 daily closes. 50-week and 200-week = simple average of the last 50 / 200 WEEKLY closes (the close on the same weekday, 7 days apart). |
| Macro and news facts | `research/macro-claims.md` | Verified one by one, with URL + read date. |

## 2. The four bear markets (peak close to trough close)

| Bear market | Top (close) | Bottom (close) | Peak to bottom | Fall | Back above the old top |
|---|---|---|---|---|---|
| 2013-14 | 2013-12-04, $1,132 | 2015-01-14, $171 | **406 days** | -84.9% | 2017-01-04 (1,127 days after the top) |
| 2017-18 | 2017-12-16, $19,497 | 2018-12-15, $3,237 | **364 days** | -83.4% | 2020-11-30 (1,080 days) |
| 2021-22 | 2021-11-08, $67,567 | 2022-11-21, $15,787 | **378 days** | -76.6% | 2024-03-04 (847 days) |
| 2025-26, first leg | 2025-10-06, $124,753 | 2026-06-30, $58,559 | **267 days** | -53.1% | not yet |

The all-time-high INTRADAY on 2025-10-06 was $126,198 (Yahoo). The script uses the CLOSE, $124,753, everywhere, and says
"close" once.

## 3. The current bear market, measured to 2026-11-25

| Fact | Value |
|---|---|
| Days since the top (2025-10-06) | **415** (passes 2013-14's 406 days peak-to-bottom; passes 2021-22's 378 and 2017-18's 364) |
| Close on 2026-11-25 | $59,072 (partial day) |
| Fall from the top | -52.6% (still inside the first leg's -53.1%) |
| First bottom | 2026-06-30 close $58,559; lowest print 2026-07-01 $57,748 (intraday) |
| Rally from the first bottom | +47.9% to $86,603 on 2026-09-21 |
| Since that rally top | -31.8% in 65 days |
| 200-day average (2026-11-25) | $72,127 |
| 50-week average | $74,464 |
| 200-week average | **$68,264** (price is 13.5% BELOW it; the 200-week line is the one a bear market is said to "bounce around") |

**The two-bear-markets reading (Mike's tweet, 2026-11-25, verbatim in section 7):** by his rule (price above AND
staying above the 50-week and 200-day averages for a month and a half) the first bear market ended in September.
Measured: daily closes were above both averages on 53 days between 2026-08-19 and 2026-11-07, steadily from
**2026-09-18 to 2026-11-07 (51 days)**. The first close under the 50-week average: **2026-11-08** ($74,585 against
$75,485). The first close under the 200-day as well: **2026-11-12** ($71,343 against $73,081). So the second bear
market began between 2026-11-08 and 2026-11-12: it is **about 2 weeks old**, matching his tweet.

**When the first bear market was confirmed (Mike's rule, 2026-11-25):** officially a bear market when Bitcoin CLOSES below
the 50-week average two weeks in a row. Measured on weekly closes (Sunday UTC close, same method as `btc_stats.py`):
week ending 2025-11-09 closed $104,720 against $103,011 (above); **2025-11-16 $94,177 against $102,949 (first close
under)**; **2025-11-23 $86,805 against $102,660 (second, confirmed)**; every Sunday close after that stayed under it
through at least 2026-02-01. (Daily closes first dipped under on 2025-11-04, but the weekly rule is the one said on air.)

## 3b. The 200-week average at past bottoms (measured, `research/btc_stats.py` method)

| Bottom | Close | 200-week average that day | Close against it |
|---|---|---|---|
| 2018-12-15 | $3,237 | $3,208 | **+0.9%** (the bottom landed on the line) |
| 2022-11-21 | $15,787 | $24,069 | **-34.4%** (235 days under it in the 2022 bear market) |
| 2026-06-30 (first bottom) | $58,559 | $62,528 | -6.3% |
| 2026-11-25 (now) | $59,072 | $68,264 | **-13.5%** |

So the line was the floor once (2018) and not the other time (2022). It is a line the market tests, not a floor.

## 3c. Rounded as spoken (the cards and the voice must agree; the exact figure is in sections 2 to 3)

415 days (voice: "more than 400 days") · 406 / 364 / 378 days · 267 days · 53% fall · 48% rally · 51 days above both averages
(Sept 18 to Nov 7) · 32% since the rally top · around 125 thousand dollars (124,753) · around 59 thousand (59,072) · around
86 thousand (86,603) · around 68 thousand (68,264) · 13% under the 200-week line · 2018 within 1% · 2022 34% under ·
1,127 / 1,080 / 847 days from the top to a new high.

## 3d. Macro and news facts (full table, URLs and read dates: `research/macro-claims.md`; read 2026-11-25)

| Fact for the script | Value | Source in macro-claims.md |
|---|---|---|
| SpaceX IPO | priced 2026-06-11 at 135 a share, about 75B raised, Nasdaq SPCX | item 1 (Fortune, SEEN) |
| Anthropic IPO | priced 2026-11-18 at 83 a share, 980M shares = about 81B raised (INFER: shares x price), Nasdaq ANT | item 2 (company release, SEEN) |
| "IPO money has to come from somewhere" | analysts' opinion (GSR to Reuters, 2026-06-10; CoinDesk 2026-04-24). Also: the dates cannot separate it from rate fears (RoboForex 2026-11-16). NOT measured flow data | item 3 |
| 10-year breakeven inflation | 2.12% on 2026-11-24 (2.15% on 11-20), FRED T10YIE | item 4 |
| Latest actual inflation | CPI 3.7% year over year, September 2026 (INFER from FRED CPIAUCSL) | item 4 |
| Fed | target range 3.75% to 4.00%; last move a 25 basis point (quarter-point) HIKE on 2026-09-16; December meeting 12-08 and 12-09; about 90% priced for another quarter-point hike, about 10% for a half-point (2026-11-19) | item 5 |
| Oil | WTI around 80.86, down 20.5% in a month (Trading Economics CFD, 2026-11-25); NOT down over 3 months (-3.6%) | item 6 |
| Three-leader declaration | Trump, Xi and Putin, Shenzhen, 2026-11-19: they "plan to increase the production and supply of refined petroleum products"; published by the Kremlin and Xinhua, US side had not confirmed the text when reported | item 6 |

## 3e. Two bear legs: what sources say drove them (multi-factor; no single cause is claimed on air)

First leg: the 2025-10-10 liquidation event, ETF outflows, the February 2026 crash, Strategy's first sale, rate-cut hopes
dying, the SpaceX IPO week. Rally: the Treasury's bigger bond buybacks, short squeezes, ETF inflows. Second leg: Fed hike
pricing and yields near 5%, the 2026-11-05 tech rout, the Binance hack, ETF outflows, the Anthropic IPO. Sources disagree
and nobody isolates one cause (`research/macro-claims.md` item 10).

## 4. What the script may say (the claims, with their exact words)

- "415 days since the top" (2025-10-06 to 2026-11-25, still counting, so say "more than 400" if the recording day moves).
- "406 days": the 2013-14 bear market, the longest peak-to-bottom of the three before this one.
- Three clocks: peak to bottom (406 / 364 / 378 days; this one 267 so far to its first bottom), days since the top
  (415, still counting), top to a new high (1,127 / 1,080 / 847 days for the old ones, not finished for this one).
- "Down about 53%" from the close of the top; "up about 48% off the bottom to $86,603"; "down 32% since".
- Price against the 200-week average: below it, 13% under.

## 5. Do not air

- "The longest ever" as a flat claim (fails peak-to-bottom: 267 days to the first bottom; fails top-to-new-high: 847 to
  1,127 days for the old ones). It is longest on ONE clock, days since the top, and only as of now.
- "We are near the 200-week average": it is 13% UNDER it, not near it.
- Any price target or "it will bottom at": no data supports one.
- Another creator's name or numbers (Mike never calls out a creator; the reference video is a private source).
- The macro claims marked WRONG / NOT FOUND in `research/macro-claims.md` (its last section): a 50 basis point hike priced for
  December (it is a quarter-point, about 90%), inflation swap levels, "money printing of 10% a year" (M2 is +5.9%),
  "best commodity year" and "1.5% long run", oil "falling sharply" without a window (a month yes, 3 months no), "Trump
  said", that IPO supply measurably drained crypto, any single cause of either bear leg, Nvidia as a crypto drain.

## 6. Market snapshot to refresh on the recording day

BTC close, days since the top, % below the top, the three averages, the 200-week gap. Command:
`python -W ignore research/btc_stats.py` after re-pulling the Yahoo file.

## 7. Mike's own words (the opinion the script ends on)

His reply on X, 2026-11-25 02:12 UTC (https://x.com/mikeneder/status/2125412285875417107), replying to a post about the
longest bear market ever: "Technically, the bear market ended in September when we went above and stayed above the
50-week moving average and 200-day moving average for a month and a half. This current bear market is 2 weeks old. 😅
Ready for another 400 days? hahahaha"
