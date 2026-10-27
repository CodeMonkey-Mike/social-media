# reset: DATA (research dump; every number carries a source)
_Read dates are YYYY-MM-DD. [VERIFY] = live-drift, re-pull before recording/render._
_Compiled 2026-10-26 for the LOCKED brief "Crypto Billionaires Will Be Made Next Year" (around 12:00 spoken spine, HYBRID: CH1 on camera, CH2 onward screen-share deck, light theme, half-budget cover layer, clip inserts considered). Spelling per persona. No em dashes._

_REFERENCE SHAPE: skills/doc-reference/DATA.reference.md. Every row: statement, source URL (opened, not just found), read date, confidence. Nothing here is invented; not found = Open questions. "Computed" = arithmetic on the cited primary data, shown so the accuracy pass can redo it._

**Source access notes (read before citing):**
- **cbo.gov returns 403** to every automated read (CBO Monthly Budget Review for September 2026, https://www.cbo.gov/publication/61985, NOT opened). Every budget figure below comes from Treasury's own **Final Monthly Treasury Statement for FY2026** (PDF https://fiscaldata.treasury.gov/static-data/published-reports/mts/MonthlyTreasuryStatement_202609.pdf, opened, plus the same tables via the fiscaldata API). Secondary write-ups of the CBO release quote a different "net interest" number (around 1.14 trillion); CBO and Treasury measure interest differently, so the video uses Treasury's numbers only.
- **forbes.com returns 403.** Forbes 2021 list facts are read from Boston Globe coverage of the Forbes release (opened); Forbes 2022 crypto count from Forbes' licensed Spanish edition forbes.es (opened). The Forbes originals are a receipt-capturer job in a real browser.
- **weforum.org returns 403 and web.archive.org returned 429.** Schwab's WRITTEN line is taken from his own byline piece on Project Syndicate (same text, same date, opened). His SPOKEN words come from WEF's own YouTube upload of the launch session (audio transcribed locally).
- **fred.stlouisfed.org CSV downloads timed out;** the FRED `/data/<SERIES>.txt` pages were read via WebFetch instead (series IDs given per row).
- **Opened in full:** the TIME transcript page (curl, verbatim text), Treasury Debt to the Penny, MTS, MSPD, Average Interest Rates and Buyback Operations (fiscaldata API), Treasury daily par yield curve CSVs (2001, 2002, 2006, 2007, 2008, 2023, 2025, 2026), BLS CPI API (CUUR0000SA0), TIC tables (slt_table5.txt, mfhhis01.txt), Fed H.4.1 (week ended 2026-10-21), Fed FOMC statements (2020-03-15, 2022-03-16, 2026-09-16), Fed DFA zip, Freddie Mac PMMS history CSV, Japan MOF JGB CSVs, EIA Brent daily spot page, CNBC transcript of 2026-09-21, Challenger reports (Aug + Sep 2026 PDFs), Bitcoin Core `amount.h`, rusty-kaspa `constants.rs`, api.kaspa.org coin supply.
- **Clip words** (section 6) are from the VIDEO audio: each video's audio was downloaded with yt-dlp and transcribed with local Whisper (small.en, word timestamps); YouTube auto-captions were used only to find the region.
- The reference video (Tom Bilyeu reacting to Andrei Jikh, youtu.be/WTXy8EZEjVs, 2026-10-20) is a MAP, never a source. Every figure it states was re-sourced or moved to section 4.

---

## 1. The thesis, sourced

Each row: statement, source URL, read date, confidence.

| # | Claim (as the brief states it) | Source (opened) | Read | Confidence |
|---|---|---|---|---|
| T1 | The President said out loud how the debt gets paid. TIME transcript, verbatim: "You know, inflation. Certain levels of inflation will also pay off that debt very rapidly. Very rapidly." Interview at the White House on Sept. 28, 2026 by TIME's Eric Cortellessa and Sam Jacobs; published Oct 1, 2026. In the SAME interview he also said "the growth is going to pay off the debt. Growth will pay it off." and "you can pay off the debt through other means" while declining to name them. The word is "also": inflation named alongside growth. | https://time.com/article/2026/10/01/donald-trump-2026-interview-transcript/ | 2026-10-26 | HIGH (primary, verbatim) |
| T2 | "They make the giant number smaller by making your dollars smaller." The mechanism is documented economics: Reinhart and Sbrancia, BIS Working Paper 363 (Dec 2011): "A subtle type of debt restructuring takes the form of 'financial repression.'" and "financial repression is most successful in liquidating debts when accompanied by a steady dose of inflation." Whether THIS administration intends it is Mike's reading (his NEC director Kevin Hassett was reported saying "No, absolutely not" when asked about inflating out of debt; secondary, see Open question 4). | https://www.bis.org/publ/work363.htm | 2026-10-26 | HIGH for the mechanism; the intent = Mike's opinion |
| T3 | It has been done before, after World War II: federal debt held by the public 106.3% of GDP (1946) to 22.2% (1974); the Fed pegged bills at 3/8 percent and "implicitly capped the rate on long-term Treasury bonds at 2.5 percent" from April 1942 until the March 1951 Accord; CPI ran +19.7% year over year in March 1947. | FRED FYPUGDA188S (OMB) https://fred.stlouisfed.org/data/FYPUGDA188S.txt ; Fed History https://www.federalreservehistory.org/essays/treasury-fed-accord ; BLS https://api.bls.gov/publicAPI/v2/timeseries/data/CUUR0000SA0 | 2026-10-26 | HIGH (primary data) |
| T4 | And again in 2020 to 2022: the Fed cut to "0 to 1/4 percent" on 2020-03-15 and held it until 2022-03-16; CPI peaked at +9.1% in June 2022; total public debt fell from 132.7% of GDP (2020 Q2) to 115.6% (2023 Q1). | Fed statements 2020-03-15, 2022-03-16; BLS CPI; FRED GFDEGDQ188S (Pillar 3 rows) | 2026-10-26 | HIGH |
| T5 | It needs an excuse; a crisis can turn the theft into a rescue. The documented part: Klaus Schwab, June 3, 2020: "the pandemic represents a rare but narrow window of opportunity to reflect, reimagine, and reset our world." The "crisis will be used to cover inflation" part is Mike's SCENARIO, framed "here is how it could go", never as fact. | https://www2.project-syndicate.org/commentary/great-reset-capitalism-covid19-crisis-by-klaus-schwab-2020-06 | 2026-10-26 | HIGH (quote); scenario = opinion |
| T6 | Every time money is printed into a crisis, owners of scarce assets come out richer. 2020 to 2021 receipts: Fed balance sheet 4.16 trillion to 8.97 trillion; M2 +40.6%; Forbes 2021 list a record 2,755 billionaires (+660) worth 13.1 trillion vs 8 trillion a year earlier, a record 493 newcomers; top 0.1% share of US net worth 11.7% to 13.8%; Forbes 2022: a record 19 crypto billionaires (7 more than 2021); Bitcoin 4,980 dollars to 67,510 dollars. | Pillar 6 rows | 2026-10-26 | HIGH (data); MEDIUM for Forbes (read via coverage) |
| T7 | "Crypto billionaires will be made next year." | No source can make this a fact. | 2026-10-26 | OPINION ONLY: Mike, first person, "I think" / "my bet" |

---

## 2. Pillar facts

### Pillar 1: The admission

**The full TIME exchange, verbatim (lightly edited transcript as printed by TIME; https://time.com/article/2026/10/01/donald-trump-2026-interview-transcript/, read 2026-10-26):**
- Setting, as printed: "President Donald Trump sat down for an interview with TIME at the White House on Sept. 28." ... "Below is a lightly edited transcript of the interview conducted by TIME Senior Political Correspondent Eric Cortellessa and Editor-in-Chief Sam Jacobs." Page byline: Oct 1, 2026, 11:00 AM UTC.
- The interviewer raised the debt: it "just reached $40 trillion", a "big psychological threshold", and "It's gone up $11 trillion in the five years that you've been president."
- Trump: "No, because they keep paying higher interest rates." Then: "So you say if they're going to do that all the time, how do you ever pay off the debt? Now you can do it through other means. I know I'm the best in the world. The best ... I don't want to tell you what those means are, but you can pay off the debt through other means. But the one thing that you can do is pay it off through growth, and we've never had growth like this."
- Same answer: "But it's a problem because we have a very hostile Fed board. I don't blame Kevin Warsh."
- Later: "Now, when you talk about the debt, the growth is going to pay off the debt. Growth will pay it off."
- The line, in its exact sequence: Interviewer: "Well, they're concerned that the economy is too hot". Trump: "No, they're concerned for inflation." ... Trump: "Okay, and frankly, this is hurting our country more than inflation is hurting our country. More than inflation." Interviewer: "Can you tell us about your meeting with". Trump: **"You know, inflation. Certain levels of inflation will also pay off that debt very rapidly. Very rapidly."** Then a TIME staffer cut in: "We're coming up for about an hour."
- **Context check (for the WARNING box and the screenplay's framing):** said near the END of an hour-long interview, after the interviewer had moved to another question; the word is "also" (growth first, inflation as an additional route); he named no rate and no mechanism. Airable as his words, exactly. NOT airable: "Trump said his plan is inflation" (paraphrase).
- **Same interview, on rates:** "I inherited the greatest inflation in history" and "Now I've got them down. I've got ... I've gotten much of it down." (TIME's own fact-check page https://time.com/article/2026/10/01/donald-trump-2026-interview-fact-check/ disputes the inherited-inflation claim; found via search, not opened; do not cite its numbers.)
- **No audio or video of the TIME line was found** (the only player on the TIME page is an unrelated 6:33 clip "Donald Trump Has Appeared on the Cover of TIME More Than Anyone Else", jwplayer media 7nEUe7Yq; YouTube search returned only commentary channels). Receipt = screencap of the transcript passage (C3).

**"We have inflation totally in control" (reference 00:20):**
- Verbatim from the audio (Forbes Breaking News upload, https://www.youtube.com/watch?v=iflPD2vYrEQ, uploaded 2026-10-01, description: "President Trump spoke with reporters on Thursday about the economy."; 2026-10-01 is a Thursday): "costs are way down, and they're coming down further. We have inflation totally in control, and we've done a great job. And the thing I haven't done a good job with is explaining it to people." (read 2026-10-26). The video TITLE says "Under Control"; the audio says "in control".
- What the official number said at the time: CPI-U (BLS series CUUR0000SA0) +3.4% year over year in August 2026 and +3.7% in September 2026 (336.940 vs 324.800); it was +3.0% in January 2025 and +2.4% in January 2026. Source: BLS API https://api.bls.gov/publicAPI/v2/timeseries/data/CUUR0000SA0 (read 2026-10-26). Note: BLS shows no October 2025 value ("Data unavailable due to the 2025 lapse in appropriations").

**The 2016 version (optional, dated):** Trump to CNN's Chris Cuomo, May 9, 2016 (CNN's own upload https://www.youtube.com/watch?v=xTANFw5f664, "Donald Trump: My debt comments were misrepresented", read 2026-10-26): "This is the United States government. First of all, you never have to default because you print the money. I hate to tell you, OK?" Context: he was rebutting reports that he would renegotiate the debt; his point was buying bonds back at a discount if rates rose.

**The administration's own denial (secondary):** 24/7 Wall St (Oct 3, 2026, https://247wallst.com/investing/2026/10/03/national-economic-advisor-says-trump-wont-inflate-our-way-out-of-debt-trump-says-yes-we-will/, opened 2026-10-26) reports that Kevin Hassett, asked on Bloomberg's Open Interest whether the White House planned to "inflate our way out of debt", replied "No, absolutely not." Interview date not given; not heard from the primary. [VERIFY]

### Pillar 2: The debt nobody can pay

- **Total public debt outstanding: 40,444,342,709,389.15 dollars on 2026-10-22** (debt held by the public 32.598 trillion; intragovernmental 7.847 trillion). Treasury Debt to the Penny API https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/debt_to_penny (read 2026-10-26). [VERIFY]
- **First day above 40 trillion: 2026-08-18** (40.047 trillion). Above 39 trillion first on 2026-03-17. Same source.
- **How fast it grows (computed):** 2025-10-22 to 2026-10-22: +2.454 trillion in 365 days = **around 6.7 billion dollars a day, around 77,800 dollars a second.** FY2026 (2025-09-30 to 2026-09-30): 37.638 trillion to 40.172 trillion = +2.534 trillion. Same source. [VERIFY]
- **FY2026 final budget (Treasury Final MTS, Sept 2026; highlight verbatim: "This issue includes the final budget results and details a deficit of $1.992 trillion for Fiscal Year 2026."):** receipts **5.403 trillion**; outlays **7.396 trillion**; deficit **1.992 trillion** (FY2025: 1.775 trillion). Computed: around 27 cents of every dollar spent was borrowed (26.9%). Source: MTS PDF above + MTS Table 9 API https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_9?filter=record_date:eq:2026-09-30 (read 2026-10-26).
- **Interest:** Net Interest (budget function 900) **1.052 trillion in FY2026** (FY2025: 970.4 billion). Gross interest on Treasury debt securities **1.360 trillion** (FY2025: 1.216 trillion). National Defense FY2026: 965.2 billion, so **net interest beat defense by around 87 billion**. Sources: MTS Table 9 (function totals) and MTS Table 5 https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/mts/mts_table_5?filter=record_date:eq:2026-09-30 (read 2026-10-26).
- **Interest share of revenue (computed):** net interest = **19.5% of receipts (around 19 cents of every tax dollar)**; gross interest = 25.2%.
- **The "big five" vs revenue (computed, FY2026, MTS):** Social Security 1.667 trillion + Medicare 1.073 trillion + Medicaid grants 723.0 billion + Veterans Benefits and Services 416.2 billion + Net Interest 1.052 trillion = **4.931 trillion = 91.3% of receipts** (97.0% if gross interest is used). They do NOT exceed every dollar collected (see section 4, item 2).
- **Debt coming due (computed from MSPD, record date 2026-09-30):** marketable debt **31.835 trillion**; maturing by 2027-09-30: **around 10.6 trillion** (bills 7.12 trillion, notes 2.92 trillion, floating-rate notes 0.35 trillion, TIPS 0.22 trillion at par, bonds 0.03 trillion) = **around one third of all marketable debt**. Source: MSPD Table 3 API https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/debt/mspd/mspd_table_3_market?filter=record_date:eq:2026-09-30 (read 2026-10-26).
- **Old cheap debt vs new expensive debt:** average interest rate on total marketable debt **3.518% (2026-09-30)**, up from 1.424% (2022-01-31); total interest-bearing debt 3.531%; Treasury bills 3.870%. Source: Average Interest Rates API https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v2/accounting/od/avg_interest_rates (read 2026-10-26). New money (Treasury par yield curve, 2026-10-23 close): 3-month 4.22%, 10-year **5.00%**, 30-year **5.33%** (Pillar 4). [VERIFY]
- **Who the debt is owed to (computed):** foreign holders **9.332 trillion (Aug 2026)** = 23.2% of total public debt (40.176 trillion on 2026-08-31), so **around 77%, around three quarters, is owed inside the US**: the Fed holds 4.571 trillion of Treasuries (H.4.1, week ended 2026-10-21) = 11.3%; intragovernmental holdings (Social Security and other trust funds) 7.85 trillion = around 19%; the rest is US banks, funds, pensions, insurers, households, state and local governments. **China: 590.7 billion = 1.47% ("under 2 percent" is TRUE)**, down from its peak of 1,316.7 billion (Nov 2013), so under half its peak (45%). Japan 1,068.3 billion; UK 1,009.5 billion. Sources: TIC Table 5 https://ticdata.treasury.gov/resource-center/data-chart-center/tic/Documents/slt_table5.txt ; TIC history https://ticdata.treasury.gov/resource-center/data-chart-center/tic/Documents/mfhhis01.txt ; Fed H.4.1 https://www.federalreserve.gov/releases/h41/current/ (all read 2026-10-26).
- **Why it cannot simply be cancelled (plain explainer the sources support):** around three quarters of the debt is held inside the US, including the Social Security trust funds and the Fed itself, so cancelling it means cancelling on our own pensions, banks, funds and trust funds.
- **Debt size vs the economy:** debt held by the public **98.1% of GDP (FY2025)**, vs the 1946 record 106.3% (FRED FYPUGDA188S, OMB data, read 2026-10-26); total public debt 122.6% of GDP (2026 Q1, FRED GFDEGDQ188S, read 2026-10-26).
- **Global debt:** IIF Global Debt Monitor, Sept 23, 2026, as printed on the IIF debt page: "Global debt surpassed $365 trillion in H1 2026, with emerging markets accounting for the bulk of the rise. Higher inflation has helped contain debt ratios, masking underlying vulnerabilities." (https://www.iif.com/Key-Topics/Sovereign-Debt, read 2026-10-26). bne IntelliNews puts it at 365.5 trillion and notes this edition revised US financial-sector coverage upward (https://www.intellinews.com/emerging-markets-drive-global-debt-past-365-trillion-iif-says-470613/, search summary only). [VERIFY]

### Pillar 3: How you inflate a debt away (the playbook has been run before)

**After World War II**
- Debt held by the public: **106.3% of GDP (1946)**, 89.9% (1947), 61.8% (1951), **22.2% (1974)**. FRED FYPUGDA188S, source "U.S. Office of Management and Budget" (https://fred.stlouisfed.org/data/FYPUGDA188S.txt, read 2026-10-26).
- The cap: Federal Reserve History, "The Treasury-Fed Accord" by Jessie Romero (https://www.federalreservehistory.org/essays/treasury-fed-accord, read 2026-10-26): in April 1942 "the Federal Reserve formally committed to maintaining a low interest-rate peg of 3/8 percent on short-term Treasury bills." and "The Fed also implicitly capped the rate on long-term Treasury bonds at 2.5 percent." Inflation: "Between June 1946 and June 1947 Consumer Price Index (CPI) inflation was 17.6 percent," and "By February 1951, CPI inflation had reached an annualized rate of 21 percent." The end: "In March 1951, the US Treasury and the Federal Reserve reached an agreement".
- Peak year-over-year CPI (computed, BLS CUUR0000SA0): **+19.7% in March 1947** (21.9 vs 18.3); +18.1% Jan 1947; +17.6% June 1947 (BLS API, read 2026-10-26).
- **Plain-language summary the sources support (for the strategist, not a quote):** after the war the Fed held long-term rates at or under 2.5% while prices rose by nearly 20% in a year, so bondholders were paid back in dollars that bought far less. Over the following decades the debt shrank from more than a year of GDP to around a fifth of it. "Sold as the cost of winning the war" is the reference's paraphrase, not a documented slogan (section 4, item 15).

**2020 to 2022**
- Fed statement, 2020-03-15: "the Committee decided to lower the target range for the federal funds rate to 0 to 1/4 percent." and "the Committee will increase its holdings of Treasury securities by at least $500 billion and its holdings of agency mortgage-backed securities by at least $200 billion." (https://www.federalreserve.gov/newsevents/pressreleases/monetary20200315a.htm, read 2026-10-26)
- First hike, 2022-03-16: "the Committee decided to raise the target range for the federal funds rate to 1/4 to 1/2 percent" (https://www.federalreserve.gov/newsevents/pressreleases/monetary20220316a.htm, read 2026-10-26). So rates sat at zero for two years.
- CPI peak: **+9.1% year over year, June 2022** (296.311 vs 271.696; BLS API, read 2026-10-26).
- Debt burden fell: total public debt **132.7% of GDP (2020 Q2) to 115.6% (2023 Q1)** (FRED GFDEGDQ188S, https://fred.stlouisfed.org/data/GFDEGDQ188S.txt, read 2026-10-26); debt held by the public 98.3% (FY2020) to 93.1% (FY2022) (FRED FYPUGDA188S).

**Financial repression in plain English (sourced)**
- Reinhart and Sbrancia, "The Liquidation of Government Debt", BIS Working Paper 363, 9 Dec 2011 (https://www.bis.org/publ/work363.htm, read 2026-10-26): "A subtle type of debt restructuring takes the form of 'financial repression.'" ... "Thus, financial repression is most successful in liquidating debts when accompanied by a steady dose of inflation." ... "For the advanced economies in our sample, real interest rates were negative roughly ½ of the time during 1945-1980." (Also NBER WP 16893, March 2011.)
- **Who pays / who wins (Fed Distributional Financial Accounts, 2026 Q2; https://www.federalreserve.gov/releases/z1/dataviz/download/zips/dfa.zip, read 2026-10-26):** the top 10% hold **68.9% of US household net worth** and **88.1% of corporate equities and mutual fund shares**; the bottom 50% hold **2.3% of net worth and 0.6% of equities**. The top 0.1% share of net worth: 11.7% (2020 Q1), 13.8% (2021 Q4), 15.0% (2026 Q2).

### Pillar 4: The bond market says no

**Yields (Treasury daily par yield curve CSVs, https://home.treasury.gov/resource-center/data-chart-center/interest-rates/daily-treasury-rates.csv/2026/all?type=daily_treasury_yield_curve&field_tdr_date_value=2026&page&_format=csv and the same URL for 2001, 2002, 2006, 2007, 2008, 2023, 2025; read 2026-10-26):**
- US 10-year: 2026 high close **5.31% on 2026-10-05**, the highest close since **2002-05-14** (2002 high 5.44%; 2006 high 5.25%; 2007 high 5.26%). So "highest since 2002" is TRUE. Reported intraday high 5.34% on 2026-09-30 (Senate Banking letter via Fortune/Moneywise; secondary). Latest close 5.00% (2026-10-23). [VERIFY]
- US 30-year: 2026 high close **5.67% on 2026-10-07**, the highest close on Treasury's curve since July 2001 (2002 high 5.57%; 2006 high 5.29%; 2007 high 5.35%). Caveat: Treasury published no 30-year point from Feb 2002 to Feb 2006. Airable: "the highest since the early 2000s". Latest close 5.33% (2026-10-23). [VERIFY]
- The move after Bessent's SMU remark (computed): 2026-09-08 close 10-year 4.80%, 30-year 5.25%; to the October highs (+51 and +42 basis points). Start of 2026 (2026-01-02): 10-year 4.19%, 30-year 4.86%.
- **UK:** the 30-year gilt yield went above 6% on 2026-10-01 for the first time since 1998; intraday 6.029% per LSEG data as reported by roic.ai (https://www.roic.ai/news/uk-30-year-gilt-yield-breaches-6-for-first-time-since-1998-10-01-2026, search summary), 6.020% per Seoul Economic Daily (https://en.sedaily.com/international/2026/10/02/uk-30-year-yield-tops-6-percent-for-first-time-since-1998). Secondary only; Bank of England / DMO data not pulled. MEDIUM [VERIFY]
- **Japan (Ministry of Finance JGB yields; https://www.mof.go.jp/english/policy/jgbs/reference/interest_rate/jgbcme.csv and .../historical/jgbcme_all.csv, read 2026-10-26):** 30-year JGB **4.168% on 2026-10-06, a record for the series (begins 1999)**; 40-year **4.196% on 2026-10-06, a record (series begins 2007)**; 10-year 3.111% on 2026-10-07, the highest since August 1996. Latest (2026-10-23): 10-year 2.837%, 30-year 3.904%. [VERIFY]

**Mortgages and housing**
- Freddie Mac PMMS 30-year fixed: **7.32% (week of 2026-10-22)**; **7.40% on 2026-10-08 and 2026-10-15, the highest since 2023-11-16 (7.44%)**; 2026 low **5.98% on 2026-02-26** (below 6% after the January mortgage-bond order). Source: https://www.freddiemac.com/pmms/docs/PMMS_history.csv (read 2026-10-26). [VERIFY]
- NAR, Oct 13, 2026 (https://www.nar.realtor/newsroom/existing-home-sales-increased-1-5-in-september-according-to-nar-report, read 2026-10-26): "1.5% increase in existing-home sales to a seasonally adjusted annual rate of 3.99 million in September"; "2.2% decrease" year over year; median price "$417,500"; "The average 30-year fixed mortgage rate was 6.86% in September". August was revised to 3.93 million (search summary of the same release).
- The 1995 comparison is ANNUAL: "For the year 2025, existing home sales totaled 4.06 million, unchanged from 2024 and matching the lowest level since 1995." (NAHB, Fan-Yu Kuo, Jan 15, 2026, https://eyeonhousing.org/2026/01/existing-home-sales-climb-to-near-3-year-high-in-december/, read 2026-10-26). The Sept 2026 NAR release makes no historical-low comparison.

**Scott Bessent: "I am the house now" (context matters, see section 4 item 3)**
- SMU Cox School of Business fireside chat; SMU's own upload https://www.youtube.com/watch?v=MSTuVBip51A ("U.S. Treasury Secretary Scott Bessent Fireside Chat at SMU Cox School of Business", 1:04:39, uploaded 2026-09-09; Fortune dates the event Sept 8, 2026). Verbatim from the audio (read 2026-10-26): "And whenever people say, oh, well, Treasury Secretary's taking a risk, I say, well, it's my dream. I have asymmetric information. I am the house now. So, right? So when we intervene with the Japanese yen, I have pretty good insight into what the Japanese, what the Bank of Japan's gonna do, what Japanese policy makers are going to do, and bet against me if you want."
- The lead-in was about Treasury's support for Argentina before its election. Bloomberg Television titled its clip "Bessent Tells Yen Traders 'I Am the House Now'" (https://www.youtube.com/watch?v=GE5jOaGhrFI, uploaded 2026-09-09). **The line was about currency intervention, not the Treasury bond market.**
- His own later gloss (CNBC Squawk Box, 2026-09-21, transcript https://www.cnbc.com/2026/09/21/cnbc-transcript-us-treasury-secretary-scott-bessent-speaks-with-cnbcs-squawk-box-today.html, read 2026-10-26): "what I said is that I didn't mean it by I have a lot of money behind me, is that the, I am able to have legal inside information" ... "Now I am in the room."

**Bessent: "I can't set the equilibrium price"**
- Same CNBC interview, asked about buying "the long end": "I just raised the size because we are in a very illiquid period. The market was moving quickly. You know, as I've said, I can't set the equilibrium price. But markets are never in equilibrium. They're either moving away from equilibrium or toward equilibrium. I thought that they were moving away." (CNBC transcript above; the Treasury's own video upload is CLIP-4.)
- Same interview, on oil: "once we get on the other side of this conflict, which we will, I think the oil markets are going to be more supplied than they previously were and rates should come down." and "since the conflict started has been quite high" (the R-squared between rates and oil).

**Treasury buybacks (fiscaldata Buyback Operations API, https://api.fiscaldata.treasury.gov/services/api/fiscal_service/v1/accounting/od/buybacks_operations, read 2026-10-26)**
- "Liquidity Support" buybacks in the 10Y to 20Y and 20Y to 30Y buckets bought **2.0 billion per operation** through 2026-08-18; then 5.187 billion (2026-09-10, 10Y to 20Y), 4.078 billion (2026-09-24, 20Y to 30Y), and **6.0 billion per operation** on 2026-10-01 (10Y to 20Y; dealers offered 46.391 billion), 2026-10-08 (20Y to 30Y; 14.886 billion offered) and 2026-10-15 (10Y to 20Y; 40.836 billion offered).
- Scale (computed): 6 billion / 31.835 trillion marketable = **around 0.02% of the market**. Ed Yardeni called the 6 billion "little more than a rounding error" in the 32 trillion dollar market (as quoted by Moneywise on Yahoo Finance citing CNN, https://finance.yahoo.com/economy/policy/articles/scott-bessent-went-am-house-110000887.html, read 2026-10-26; secondary).

**The Fed raised rates into it**
- FOMC statement, 2026-09-16 (https://www.federalreserve.gov/newsevents/pressreleases/monetary20260916a.htm, read 2026-10-26), approved "by a 12 - 0 vote": "The Committee decided to raise the target range for the federal funds rate by 1/4 percentage point to 3-3/4 to 4 percent" ... "Inflation remains elevated. Today's policy action will support a timelier return to the Committee's 2 percent goal."
- Chair Kevin Warsh at the press conference (Fed upload, CLIP-5): "This is a complicated set of things that are affecting the most important asset anywhere in the world, the 10-year Treasury. It's the risk-free asset upon which every price of virtually every asset in the world is related to." He gave three reasons yields rose: economic strength, "competition for capital" (the AI capex of "the so-called hyperscalers"), and geopolitics.
- **Tom's fulcrum point** (the Treasury market under every loan, mortgage and stock price) airs as Tom Bilyeu's / the trader's framing, attributed; Warsh's line above is the primary-source version of the same idea and can carry it.

**The Fannie Mae / Freddie Mac 200 billion order**
- Trump on Truth Social, Thursday Jan 8, 2026, as reproduced by Scotsman Guide (https://www.scotsmanguide.com/news/pulte-confirms-fannie-and-freddie-will-buy-200-billion-of-mortgage-bonds/, read 2026-10-26): "Because of this, I am instructing my Representatives to BUY $200 BILLION DOLLARS IN MORTGAGE BONDS." ... "This will drive Mortgage Rates DOWN, monthly payments DOWN, and make the cost of owning a home more affordable." FHFA Director Bill Pulte on X: "Fannie and Freddie are the entities that will do the purchases." Bloomberg headline of 2026-01-08: "Trump Tells Fannie, Freddie to Buy $200 Billion of Mortgage Debt" (https://www.bloomberg.com/news/articles/2026-01-08/trump-directs-200-billion-mortgage-bond-buy-in-housing-push, paywalled, not opened). The original Truth Social post was not opened. [VERIFY]
- What followed (PMMS): mortgage rates fell to 5.98% by 2026-02-26, then rose to 7.40% by October.

**Bogachan Ozdemir (the trader in the reference):** his post could not be found on X or anywhere primary; see section 4 item 10. NOT airing.

**The oil shock (the war that started this year)**
- The US and Israel launched the war against Iran on Feb 28, 2026, and Iran has blocked the Strait of Hormuz (Al Jazeera, Sept 17, 2026, https://www.aljazeera.com/news/2026/9/17/ghalibafs-maths-missile-at-trump-decoded-is-iran-fixing-us-interest-rates, read 2026-10-26).
- Brent spot (EIA daily, https://www.eia.gov/dnav/pet/hist/LeafHandler.ashx?n=PET&s=RBRTE&f=D, release 10/21/2026, read 2026-10-26): **71.32 dollars on 2026-02-27**, **138.21 on 2026-04-07** (high; corrected at the accuracy pass 2026-10-26: EIA's weekly table has no price on Monday 2026-04-06, Easter Monday, and FRED DCOILBRENTEU dates 138.21 to 2026-04-07), 68.53 on 2026-07-02 (low after the spring), **135.51 on 2026-10-02**, **115.22 on 2026-10-20** (latest). [VERIFY]
- Iran's Parliament Speaker Mohammad Bagher Ghalibaf on X, Sept 16, 2026 (the day of the Fed hike), as printed by Al Jazeera: "Let's see if a hike could open SOH or produce a single barrel," ... "You can't 25bp [basis points] a chokepoint," ... "It's SOH risk premium, and We set it." (SOH = Strait of Hormuz.) Text post, not video. The X post URL itself was not found. [VERIFY]

### Pillar 5: The excuse, a reset (Mike's SCENARIO; documented pieces only)

- **Schwab, written, June 3, 2020:** "Time for a Great Reset", Klaus Schwab, Project Syndicate (https://www2.project-syndicate.org/commentary/great-reset-capitalism-covid19-crisis-by-klaus-schwab-2020-06, read 2026-10-26): "the pandemic represents a rare but narrow window of opportunity to reflect, reimagine, and reset our world." (The same piece ran on weforum.org as "Now is the time for a 'great reset'", 403 to us.)
- **Schwab, spoken, June 3, 2020:** WEF upload "The Great Reset | Launch session 3 June 2020" (https://www.youtube.com/watch?v=pfVdMWzKwjc, 1:25:46), audio verbatim (read 2026-10-26): "It is obvious that we are in the midst of the most severe crisis the world has experienced since World War II." ... "In short, we need a great reset. We have to mobilize all constituents of our global society to work together. We must not miss this unique window of opportunity. For this reason, I am grateful that we are joined for this announcement of the Great Reset Initiative, not only by His Royal Highness, the Prince of Wales ..." Moderator Adrian Monk opened it as "a launchpad for the next chapter, The Great Reset"; contributions included UN Secretary-General Antonio Guterres and IMF Managing Director Kristalina Georgieva (same audio). **The "rare but narrow window" sentence is NOT in his spoken remarks** (checked 6:34 to 8:56); it is the written line.
- **Precedents with dates (sourced in Pillar 3):** WWII (Fed peg from April 1942, CPI +19.7% Mar 1947); the pandemic (zero rates from 2020-03-15, CPI +9.1% June 2022).
- **Candidate crisis 1, energy (real today):** the war since Feb 28, 2026; Brent from 71 dollars to as high as 138 dollars (EIA). Bessent tied long rates to oil ("since the conflict started has been quite high", CNBC 2026-09-21).
- **Candidate crisis 2, AI job losses (real, but the size is small so far):** Challenger, Gray and Christmas, report released Oct 1, 2026 (https://www.challengergray.com/wp-content/uploads/2026/10/Challenger-Report-September-2026.pdf, read 2026-10-26): "So far this year, AI has been cited in 120,136 job cut announcements, approximately 21% of all cuts, and it remains the leading reason year-to-date." Total announced cuts Jan to Sep 2026: 573,195, "down 39%" from the first nine months of 2025. Andy Challenger: "Employers are facing high energy costs, an uncertain war in Iran, a rate hike that could make hiring more expensive". (The August report: AI was "the leading monthly reason" for five months starting in March; https://www.challengergray.com/wp-content/uploads/2026/09/Challenger-Report-August-2026.pdf.)
- **Candidate crisis 3, quantum (a RISK, not an event):** a Federal Reserve paper (reported early October 2025) found public ledgers like Bitcoin exposed to future quantum decryption (The Quantum Insider, https://thequantuminsider.com/2025/10/06/federal-reserve-warns-quantum-computers-could-expose-bitcoins-hidden-past/, search summary only; the Fed paper itself not opened). No quantum attack on the financial system has happened. Conditional language only. MEDIUM
- **Digital identity, precisely:** UN SDG target 16.9: "By 2030, provide legal identity for all, including birth registration" (indicator 16.9.1: "Proportion of children under 5 years of age whose births have been registered with a civil authority, by age"). https://sdgs.un.org/goals/goal16 (read 2026-10-26). It says legal identity and birth registration; it does not say digital money.
- **EU:** every member state must offer at least one EU Digital Identity Wallet by the end of 2026 (Regulation (EU) 2024/1183); use is voluntary for citizens (Estonia's RIA https://ria.ee/en/state-information-system/electronic-identity-eid-and-trust-services/eudi-wallet and Kennedys, search summaries only). MEDIUM [VERIFY]
- **UK:** the Sept 2025 plan made digital ID mandatory for right-to-work checks; in January 2026 the government dropped the mandatory element (The Register, https://www.theregister.com/2026/01/14/uk_digital_id_climbdown/ ; Full Fact tracker, search summaries only); a consultation closed 5 May 2026. MEDIUM [VERIFY]
- **The US position on a CBDC:** Executive Order 14178, "Strengthening American Leadership in Digital Financial Technology", signed Jan 23, 2025 (https://www.whitehouse.gov/presidential-actions/2025/01/strengthening-american-leadership-in-digital-financial-technology/, read 2026-10-26): its policy includes "prohibiting the establishment, issuance, circulation, and use of a CBDC within the jurisdiction of the United States" and Sec. 5 says "agencies are hereby prohibited from undertaking any action to establish, issue, or promote CBDCs". The Anti-CBDC Surveillance State Act passed the House on July 17, 2025 (219 to 210) and was not law as of August 2026 (congress.gov H.R.1919 / Emmer press release, search summaries only). MEDIUM [VERIFY]
- **Live CBDCs elsewhere:** three retail CBDCs are live (the Bahamas, Jamaica, Nigeria) and China's e-CNY is in wide pilot, per secondary summaries of the Atlantic Council tracker (not opened). MEDIUM [VERIFY]
- **The "Bank of Japan insider":** an anonymous account (named as @yutokanzakireal by bitcoin.com, https://news.bitcoin.com/japans-wealth-is-returning-anonymous-boj-insider-sparks-panic-over-looming-carry-trade-unwind/, search summary); "There has been no official confirmation from the Bank of Japan or the Japanese government"; the quote in the reference ("If only we could delay the collapse of the current economic order...") was found NOWHERE. Section 4 item 11.

### Pillar 6: Where billionaires get made

- **Fed balance sheet (FRED WALCL, https://fred.stlouisfed.org/data/WALCL.txt, read 2026-10-26):** **4.159 trillion (2020-02-26)** to **8.965 trillion (2022-04-13, the all-time high)**: +4.8 trillion, around 2.2x (computed). Now 6.754 trillion (2026-10-21). [VERIFY]
- **M2 (FRED M2SL, billions, seasonally adjusted, https://fred.stlouisfed.org/data/M2SL.txt, read 2026-10-26):** 15,492.8 (Feb 2020) to 21,788.1 (Mar 2022) = **+40.6%** (computed); year over year **+26.8% in Feb 2021** (19,641.4 vs 15,492.8, computed); latest 23,342.8 (Aug 2026).
- **Forbes 2021 World's Billionaires list (released Apr 6, 2021; net worths as of March 5, 2021):** "grew to 2,755 individuals who together are worth $13.1 trillion", "660 more people were added", up from 8 trillion; "Nearly 500 first-time billionaires" (Boston Globe, https://www.bostonglobe.com/2021/04/06/business/forbes-annual-worlds-billionaires-list-exploded-during-pandemic, read 2026-10-26). The exact newcomer count 493 and the US count 724 appear in multiple outlets reporting the Forbes release (search summaries). MEDIUM-HIGH [VERIFY on forbes.com in a browser]
- **Forbes 2022 crypto billionaires:** "récord de 19 multimillonarios" of crypto and blockchain, "siete más que el año pasado" (so 12 in 2021); net worths as of March 11, 2022 (Forbes Spain, https://forbes.es/forbes-ricos/152276/forbes-ricos-2022-los-19-multimillonarios-de-las-criptomonedas-y-del-blockchain/, dated Apr 10, 2022, read 2026-10-26). Do not NAME individuals from that list on screen without a fresh check (several fortunes on it later collapsed).
- **US billionaires in the pandemic (secondary):** Americans for Tax Fairness and the Institute for Policy Studies (Oct 2021) reported US billionaire wealth up around 2.1 trillion (around 70%) from March 18, 2020 to Oct 15, 2021, and the number of US billionaires from 614 to 745 (Washington Informer / Yahoo coverage, search summaries; the ATF report itself not opened). MEDIUM [VERIFY]
- **Who captured it (Fed DFA, Pillar 3):** the top 0.1% share of US net worth rose from 11.7% (2020 Q1) to 13.8% (2021 Q4); the top 10% hold 88.1% of equities and mutual funds today (2026 Q2).
- **Bitcoin in the same window (FRED CBBTCUSD, Coinbase, https://fred.stlouisfed.org/data/CBBTCUSD.txt, read 2026-10-26):** **4,980.00 dollars on 2020-03-12** (the March 2020 low of that daily series) to **67,510.06 on 2021-11-08** (the 2021 high) = **around 13.6x** (computed).
- **Why scarce assets win:** Bitcoin's supply cap is in consensus code: `MAX_MONEY{21'000'000 * COIN}` (Bitcoin Core, src/consensus/amount.h, https://raw.githubusercontent.com/bitcoin/bitcoin/master/src/consensus/amount.h, read 2026-10-26). The Fed and Treasury have no such cap: the balance sheet more than doubled in two years (above).
- **Kaspa (Mike's primary holding per persona):** max supply 28,704,035,605 KAS, circulating 27,776,982,565 KAS (around 96.8% mined) per https://api.kaspa.org/info/coinsupply (read 2026-10-26) [VERIFY]; consensus constant `MAX_SOMPI: u64 = 29_000_000_000 * SOMPI_PER_KASPA` (rusty-kaspa consensus/core/src/constants.rs, read 2026-10-26) is an upper bound, not the emission total. Persona: primary assets KAS, TAO, TON, BTC; "BTC is macro commentary and thesis content, NOT a stacking pick" (persona/persona.json stacking_lineup). Frame any coin as "my holdings / my bet", never as a recommendation.
- **Mike's thesis:** "crypto billionaires will be made next year" is HIS opinion and bet, first person, never a promise or a statistic.

### Pillar 7: The close
- Persona CTA (persona/persona.json, spoken_voice.cta_style, read 2026-10-26): "click that like button and click the subscribe button" (never "smash"); ask for comments; "click the link in the description" for the community; real sign-off "I'm gonna catch you guys, later." A quick nutshell recap right before the CTA is in character.
- The one-breath nutshell the data supports: the debt is 40 trillion and growing around 6.7 billion a day; the President named inflation as a way to pay it; it has been done before (1946 and 2020); savers and bondholders pay, asset owners win. (Mike's own words in the script; every number from the rows above.)

### Pillar timeline (dated)

| Date | Event | Source (read 2026-10-26) |
|---|---|---|
| 1942-04 | Fed pegs bills at 3/8%, implicit 2.5% cap on long bonds | federalreservehistory.org/essays/treasury-fed-accord |
| 1946 | Debt held by the public 106.3% of GDP (record) | FRED FYPUGDA188S |
| 1947-03 | CPI +19.7% year over year | BLS CUUR0000SA0 |
| 1951-03 | Treasury-Fed Accord ends the peg | federalreservehistory.org |
| 1974 | Debt held by the public 22.2% of GDP | FRED FYPUGDA188S |
| 2016-05-09 | Trump on CNN: "you never have to default because you print the money" | youtube.com/watch?v=xTANFw5f664 |
| 2020-03-15 | Fed cuts to 0 to 1/4%, starts buying at least 500 billion Treasuries | federalreserve.gov monetary20200315a |
| 2020-06-03 | WEF launches the Great Reset; Schwab's "rare but narrow window" piece | youtube.com/watch?v=pfVdMWzKwjc ; project-syndicate.org |
| 2021-02 | M2 +26.8% year over year | FRED M2SL |
| 2021-04-06 | Forbes list: record 2,755 billionaires, 13.1 trillion | bostonglobe.com (Forbes coverage) |
| 2021-11-08 | Bitcoin 67,510 dollars (2021 high, Coinbase daily) | FRED CBBTCUSD |
| 2022-03-16 | Fed's first hike, ends two years at zero | federalreserve.gov monetary20220316a |
| 2022-04-13 | Fed balance sheet peaks at 8.965 trillion | FRED WALCL |
| 2022-06 | CPI +9.1% year over year | BLS |
| 2025-01-23 | EO 14178 bars US agencies from any CBDC | whitehouse.gov |
| 2026-01-08 | Trump orders 200 billion of mortgage-bond buying (Fannie, Freddie) | scotsmanguide.com |
| 2026-02-26 | 30-year mortgage 5.98%, the 2026 low | Freddie Mac PMMS |
| 2026-02-28 | US and Israel launch the war against Iran | aljazeera.com |
| 2026-04-07 | Brent 138.21 dollars | EIA |
| 2026-05-22 | Kevin Warsh sworn in as Fed chair | atlantafed.org/news-and-events/2026/05/22/warsh-sworn-in-as-new-fed-chairman |
| 2026-08-18 | US debt passes 40 trillion | Debt to the Penny |
| 2026-09-08 | Bessent at SMU: "I am the house now" (about the yen) | youtube.com/watch?v=MSTuVBip51A |
| 2026-09-16 | Fed hikes to 3-3/4 to 4%; Ghalibaf's "single barrel" post | federalreserve.gov ; aljazeera.com |
| 2026-09-21 | Bessent on CNBC: "I can't set the equilibrium price" | cnbc.com transcript ; youtube.com/watch?v=XcSztxaM77w |
| 2026-09-23 | IIF: global debt surpassed 365 trillion | iif.com |
| 2026-09-28 | Trump's TIME interview (published Oct 1) | time.com |
| 2026-09-30 | FY2026 ends: deficit 1.992 trillion, net interest 1.052 trillion | Treasury MTS |
| 2026-10-01 | UK 30-year gilt above 6%, first since 1998; Trump: "We have inflation totally in control" | roic.ai / sedaily ; youtube.com/watch?v=iflPD2vYrEQ |
| 2026-10-05 | US 10-year closes 5.31%, highest since 2002 | Treasury par yield curve |
| 2026-10-06 | 30-year JGB 4.168%, 40-year 4.196%, both records | Japan MOF |
| 2026-10-07 | US 30-year closes 5.67% | Treasury par yield curve |
| 2026-10-08 | 30-year mortgage 7.40%, highest since Nov 2023 | Freddie Mac PMMS |
| 2026-10-22 | US debt 40.444 trillion | Debt to the Penny |

**Shipped vs planned (one-line ledger for the close):**
- HAPPENED: the TIME line (Oct 1, 2026); FY2026 deficit 1.992 trillion and net interest 1.052 trillion; the 2026 yield highs; the Fed hike; the Fannie/Freddie order; the war and the oil spike; EO 14178.
- IN PROGRESS: EU digital ID wallets due by end of 2026; Treasury's 6 billion buybacks; the Fed's possible further hikes (the statement says the action supports "a timelier return" to 2%).
- SCENARIO ONLY (Mike's warning, conditional language): a crisis used as cover for inflation; a "reset"; crypto billionaires made next year.

---

## 3. People, orgs, dates

| Name (persona spelling) | Who / what | Evidence |
|---|---|---|
| **Donald Trump** | US President; TIME interview Sept 28, 2026 (published Oct 1) | time.com transcript |
| **Scott Bessent** | US Treasury Secretary; "I am the house now" at SMU (Sept 8, 2026); CNBC Squawk Box Sept 21, 2026 | youtube.com/watch?v=MSTuVBip51A ; cnbc.com transcript |
| **Kevin Warsh** | Fed Chair, sworn in May 22, 2026 ("On May 22, Kevin Warsh took the oath of office as chairman") | atlantafed.org (read 2026-10-26) |
| **Kevin Hassett** | Trump's top economic aide (National Economic Council), "No, absolutely not" (secondary) | 247wallst.com (Oct 3, 2026) [VERIFY] |
| **Bill Pulte** | FHFA Director; "Fannie and Freddie are the entities that will do the purchases." | scotsmanguide.com |
| **Mohammad Bagher Ghalibaf** | Speaker of Iran's Parliament; the Sept 16, 2026 "single barrel" post | aljazeera.com |
| **Klaus Schwab** | WEF founder and then Executive Chairman; Great Reset launch June 3, 2020 | WEF video ; project-syndicate.org |
| **Eric Cortellessa, Sam Jacobs** | TIME interviewers (Senior Political Correspondent; Editor-in-Chief) | time.com |
| **Joe Kernen, Becky Quick** | CNBC Squawk Box anchors in the Sept 21 interview | cnbc.com transcript |
| **Ed Yardeni** | Yardeni Research; "little more than a rounding error" (secondary) | Moneywise/Yahoo citing CNN |
| **Carmen Reinhart, M. Belen Sbrancia** | Authors of "The Liquidation of Government Debt" (BIS WP 363) | bis.org |
| **Andy Challenger** | Challenger, Gray and Christmas | Sept 2026 report |
| **Andrei Jikh, Tom Bilyeu** | The reference video (map only); Tom's "fulcrum" framing is attributed opinion | youtu.be/WTXy8EZEjVs |
| **Luke Gromen, Bogachan Ozdemir** | Named in the reference; their claims are not sourced here (section 4) | reference transcript only |
| **Chris Cuomo** | CNN, the 2016 Trump interview | CNN upload xTANFw5f664 |
| **US Treasury / Bureau of the Fiscal Service** | Debt to the Penny, MTS, MSPD, buybacks, par yield curve | fiscaldata.treasury.gov, home.treasury.gov |
| **Federal Reserve / FOMC** | Rates, H.4.1, DFA | federalreserve.gov |
| **IIF** | Institute of International Finance, Global Debt Monitor | iif.com |
| **WEF** | World Economic Forum, the Great Reset | WEF YouTube |
| **Fannie Mae, Freddie Mac, FHFA** | The 200 billion mortgage-bond buyers and their regulator | scotsmanguide.com |
| **Japan Ministry of Finance** | JGB yields | mof.go.jp |

Terminology for captions/graphics: Kaspa / KAS (never "Casper"); TAO (never "tau"); BTC / Bitcoin; "around" before a number, never "about"; numbers as digits; FOMC, PMMS, JGB spelled out once on screen ("Japanese government bonds"); "Great Reset" capitalised as WEF's initiative name.

---

## 4. Do-not-air numbers

| Claim (popular) | Why not | What to say instead |
|---|---|---|
| 1. "The US adds 7.3 billion a day / 82,000 dollars a second" (reference 01:35 to 02:06; also "6 billion a day") | Debt to the Penny, trailing 12 months to 2026-10-22: +2.454 trillion = 6.7 billion a day, 77,800 a second. The reference's numbers are unsourced. | "around 6.7 billion dollars a day" [VERIFY] |
| 2. "Social Security, Medicare, Medicaid, veterans benefits and interest already cost more than every dollar the government makes" (reference 44:13) | FY2026 Treasury MTS: those five = 4.931 trillion vs receipts 5.403 trillion = 91.3% (97.0% even with gross interest). Close, but not more. | "Those five eat around 91 cents of every dollar the government collects." |
| 3. "Bessent challenged the BOND market when he said 'I am the house now'" (reference 04:18) | The SMU audio: "I am the house now. So, right? So when we intervene with the Japanese yen..." It was about currency intervention (Argentina, the yen). Bloomberg TV: "Bessent Tells Yen Traders 'I Am the House Now'". | "Bessent said 'I am the house now', talking about the yen. In the weeks after, the 10-year hit its highest since 2002." (sequence, not cause) |
| 4. "Bessent admitted: 'You guys win. I can't set the equilibrium price.'" (reference 06:26) | "You guys win" is the reference's paraphrase. His words: "As I've said, I can't set the equilibrium price, but markets are never in equilibrium..." He framed it as markets moving away from equilibrium. | Play / quote his exact words (CLIP-4). |
| 5. "Bessent and George Soros broke the British pound" (reference 07:00) | Not researched for this brief; no primary opened. | Do not air. |
| 6. "Trump said inflation is the plan" / "Trump admits he will inflate the debt away" | He said inflation "will ALSO pay off that debt very rapidly", a few answers after "Growth will pay it off" (corrected at the accuracy pass: the TIME transcript has the Fed, Switzerland and "concerned for inflation" exchanges in between); no rate named; his NEC director reportedly said "No, absolutely not" (secondary). | Quote his exact sentence; Mike's reading ("here is what that means for your money") is framed as Mike's. |
| 7. "The housing market slowed to levels not seen since 1995" (reference 03:43) | The 1995 comparison is ANNUAL (2024 and 2025 both 4.06 million, NAHB on NAR data). NAR's Sept 2026 release (3.99 million pace) makes no historical-low claim. | "Home sales are stuck under 4 million a year; last year matched the lowest since 1995." |
| 8. "Luke Gromen: once it resets the interest bill is around 2 trillion a year, 40 cents of every tax dollar" (reference 32:20); also Moneywise's "interest costs projected above $2 trillion for fiscal 2026" | Projection / opinion, not from Gromen's own post; contradicted by FY2026 actuals: net interest 1.052 trillion (19.5% of receipts), gross 1.360 trillion (25.2%). | "Interest already takes around 19 cents of every tax dollar." |
| 9. "Average mortgage rate 7.3%, highest in 3 years" | AIRABLE with care: PMMS 7.32% (2026-10-22); the 7.40% weeks were the highest since Nov 2023. | "around 7.3 percent, the highest since late 2023" [VERIFY] |
| 10. Bogachan Ozdemir: 30-year to 6% then 7%, "within 6 months" the Treasury market breaks, like the Fed in September 2007 (reference 36:36 to 41:00) | His post could not be found on X or any primary page; only a Substack mentions him as a former Citi trader. In September 2007 the 30-year was around 4.7 to 4.9% (H.15 via search summary), so the comparison is not a yield level. Unverifiable forecast. | Do not air (the brief's rule: drop if it cannot be pinned to his own post). Warsh's fulcrum line (CLIP-5) carries the idea instead. |
| 11. The "Bank of Japan insider" quote ("If only we could delay the collapse of the current economic order...") (reference 43:40) | Anonymous account; no confirmation from the BOJ or Japan's government; the quoted sentence was found nowhere. | NEVER air. |
| 12. "AI, millions of people losing jobs" (reference 48:03) | Challenger: 120,136 announced cuts cited AI, Jan to Sep 2026 (around 21% of 573,195). Not millions. | "AI was the top stated reason for layoffs this year: around 120,000 announced cuts." |
| 13. "Quantum computing, which is an attack on the whole financial system" (reference 48:03) | No quantum attack has happened; the documented item is a Fed paper on future risk to public ledgers (secondary). | Conditional only: "a risk the Fed itself has written about." |
| 14. "A new digital money with a new digital identity, one of their goals by 2030" (reference 48:03) | SDG 16.9 = "legal identity for all, including birth registration" by 2030; it says nothing about digital money. The US banned agency CBDC work (EO 14178). | State it precisely: the UN target is legal ID; the EU wallet is due by end of 2026 and voluntary; the US has banned a CBDC by executive order. |
| 15. WWII debt "was sold to them as the cost of winning the war" (reference 46:56) | The reference's paraphrase; no primary slogan found. | Mike may say it in his own words as a description, never as a quote on screen. |
| 16. "In 2020, rates were at 0%, inflation went to 9%" (as if simultaneous) | Rates were 0 to 1/4% from 2020-03-15 to 2022-03-16; CPI peaked at 9.1% in June 2022, after the first hike. | "Rates sat at zero for two years. Then inflation hit 9.1 percent." |
| 17. "By 1974 [debt] was magically 23%" | OMB data on FRED: 22.2% (1974). | "around 22 percent" |
| 18. "US debt is just about where it was after WWII (106%)" | Debt held by the public 98.1% (FY2025); total public debt 122.6% (2026 Q1). Two different measures. | "around 100 percent of the economy, close to the 1946 record" (debt held by the public). |
| 19. "Buybacks went from 2 billion to 4 billion to 6 billion" | Treasury data show 2.0 billion per operation through Aug 18, then up to 6.0 billion (Oct 1, 8, 15). The 4 billion step appears in press accounts of the August announcement. | "from 2 billion to 6 billion per operation" |
| 20. "Fannie and Freddie were forced to buy 200 billion... about getting rates down before the midterms" | The order is real (Jan 8, 2026); the "before the midterms" motive is the trader's claim. | Air the order and its stated aim ("drive Mortgage Rates DOWN"), not the motive. |
| 21. Epstein to Thiel email (reference 26:52) | Off-brief; not verified here. | Do not air. |
| 22. "S&P ex-AI down 5.4% since August" (reference 09:40) | Not researched; live drift. | Do not air. |
| 23. Trump: Iran's inflation is "at 300% or something like that" (TIME interview) | TIME's own fact-check reports Iran's central bank at 83.8% (search summary). | Do not air. |
| 24. Forbes video title "We Have Inflation Totally UNDER Control" | The audio says "totally in control". | Caption the audio words. |
| 25. "Global debt is 365 trillion" vs earlier IIF editions | AIRABLE as IIF states it ("surpassed $365 trillion in H1 2026"), but this edition widened US financial-sector coverage, so do not compare it to older IIF totals as growth. | "more than 365 trillion dollars (IIF)" [VERIFY] |

---

## 5. Market snapshot

Pulled 2026-10-26 between 14:40 and 15:10 UTC. Every row is [VERIFY] at record and at render unless marked primary/fixed.

| Figure | Value at read | Note |
|---|---|---|
| US total public debt | 40,444,342,709,389.15 dollars (record date 2026-10-22) | Debt to the Penny API [VERIFY] |
| Debt growth, trailing 12 months | +2.454 trillion = around 6.7 billion a day, 77,800 a second | computed [VERIFY] |
| US 10-year yield | 5.00% (close 2026-10-23); 2026 high close 5.31% (2026-10-05) | Treasury par curve [VERIFY] |
| US 30-year yield | 5.33% (close 2026-10-23); 2026 high close 5.67% (2026-10-07) | Treasury par curve [VERIFY] |
| US 3-month bill | 4.22% (2026-10-23) | Treasury par curve [VERIFY] |
| 30-year mortgage (PMMS) | 7.32% (week of 2026-10-22) | Freddie Mac [VERIFY] |
| Fed funds target | 3-3/4 to 4% (since 2026-09-16) | FOMC; next meeting Oct 27 to 28 per secondary [VERIFY] |
| Fed balance sheet | 6.754 trillion (2026-10-21) | H.4.1 / FRED WALCL [VERIFY] |
| CPI-U year over year | +3.7% (September 2026) | BLS [VERIFY next release] |
| UK 30-year gilt | above 6% on 2026-10-01 (6.029% intraday, LSEG via roic.ai) | secondary [VERIFY] |
| 30-year JGB | 3.904% (2026-10-23); record 4.168% (2026-10-06) | Japan MOF [VERIFY] |
| Brent spot | 115.22 dollars (2026-10-20) | EIA [VERIFY] |
| Bitcoin | 80,345 dollars; market cap around 1.62 trillion | CoinGecko simple price API, 2026-10-26 15:08 UTC [VERIFY] |
| Kaspa (KAS) | 0.0361 dollars; market cap around 1.00 billion; circulating 27.78 billion of 28.70 billion max | CoinGecko + api.kaspa.org, 2026-10-26 15:08 UTC [VERIFY] |
| Global debt (IIF) | surpassed 365 trillion (H1 2026) | IIF, Sept 23, 2026 [VERIFY on next IIF release] |
| FY2026 deficit / receipts / net interest | 1.992 / 5.403 / 1.052 trillion | Treasury final MTS, primary, not drifting |
| Marketable debt maturing within 12 months of 2026-09-30 | around 10.6 trillion of 31.8 trillion | MSPD, computed, fixed to that date |
| Average rate on marketable debt | 3.518% (2026-09-30) | Treasury, monthly [VERIFY at end of Oct] |
| Foreign holdings / China | 9.332 trillion / 590.7 billion (Aug 2026) | TIC monthly [VERIFY next TIC release] |
| 1946 / 1974 debt-to-GDP; 1947 CPI; June 2022 CPI | 106.3% / 22.2%; +19.7%; +9.1% | primary, not drifting |
| Bitcoin max supply | 21,000,000 | consensus code, fixed |

---

## 6. Clip candidates

Every real VIDEO clip found of someone saying a thing this video could splice in with their own voice (`skills/clip-inserts/clip-inserts.md`). Words are from the VIDEO's audio (local Whisper small.en on the downloaded audio, word timestamps), never from a write-up. Windows are in the video's own timeline. The capture script re-verifies with `--expect`.

| ID | Who / what is said (verbatim, opened) | Source URL + window | Length | Context check | Supports |
|---|---|---|---|---|---|
| CLIP-1 | Donald Trump, to reporters, Oct 1, 2026: "We have inflation totally in control, and we've done a great job." | https://www.youtube.com/watch?v=iflPD2vYrEQ (Forbes Breaking News upload, 1:46) 0:30.2-0:34.2 | 4.0 s | Just before: "costs are way down, and they're coming down further." Just after: "And the thing I haven't done a good job with is explaining it to people." In context; the question was about rising costs. Honest juxtaposition: CPI +3.7% in September 2026 (BLS). Third-party upload of a press gaggle (Forbes); title says "Under Control", audio says "in control". Suggested caption: "Donald Trump, speaking to reporters, Oct 1, 2026". `--expect "inflation totally in control"` | Pillar 1 (reference 00:20) |
| CLIP-2 | Donald Trump, CNN, May 9, 2016: "This is the United States government. First of all, you never have to default because you print the money. I hate to tell you, OK?" | https://www.youtube.com/watch?v=xTANFw5f664 (CNN, "Donald Trump: My debt comments were misrepresented", 1:54) 0:17.5-0:22.9 | 5.4 s | He was rebutting reports that he would renegotiate the debt; his point was buying bonds back at a discount. Ten years old: the caption MUST carry the date. Phone-line audio: one Whisper pass heard "put the money", another (same audio, third-party 46 s upload 18IsZ5VRMvM) heard "print the money"; use `--expect "never have to default"`. Caption: "Donald Trump on CNN, May 9, 2016" | Pillar 1 (optional, the 2016 version of the admission) |
| CLIP-3 | Scott Bessent, Treasury Secretary, SMU, Sept 8, 2026: "I say, well, it's my dream. I have asymmetric information. I am the house now. So, right? So when we intervene with the Japanese yen," | https://www.youtube.com/watch?v=MSTuVBip51A (SMU, 1:04:39) 23:52.5-24:04.9 | 12.4 s | The full remark is about CURRENCY intervention (Argentina before it, the yen and the Bank of Japan after), NOT the bond market. The window deliberately keeps "when we intervene with the Japanese yen" so the clip carries its own context; cutting at "house now" (23:58.9) would make it read as a bond-market dare (section 4 item 3). Alternative: Bloomberg TV's tightened edit https://www.youtube.com/watch?v=GE5jOaGhrFI 0:05.0-0:15.1. Caption: "Scott Bessent, Sept 8, 2026, on intervening in the yen". `--expect "I am the house now"` | Pillar 4 |
| CLIP-4 | Scott Bessent, CNBC Squawk Box, Sept 21, 2026: "I just raised the size because we were in a very illiquid period. The market was moving quickly. As I've said, I can't set the equilibrium price, but markets are never in equilibrium." | https://www.youtube.com/watch?v=XcSztxaM77w (U.S. Department of the Treasury upload, "Secretary Bessent on CNBC's Squawk Box", 22:24) 15:02.9-15:15.7 | 12.8 s | Answering Joe Kernen on buying "the long end" (the buybacks). He continues: "They're either moving away from equilibrium or toward equilibrium. I thought that they were moving away." In context; NOT "you guys win" (that is the reference's paraphrase). Extended window to 15:20.5 (17.6 s) keeps his full thought. Caption: "Scott Bessent on CNBC, Sept 21, 2026". `--expect "set the equilibrium price"` | Pillar 4 |
| CLIP-5 | Kevin Warsh, Fed Chair, FOMC press conference, Sept 16, 2026: "This is a complicated set of things that are affecting the most important asset anywhere in the world, the 10-year Treasury. It's the risk-free asset upon which every price of virtually every asset in the world is related to." | https://www.youtube.com/watch?v=ELU3u2Ny7r0 (Federal Reserve, "FOMC Press Conference, September 16, 2026", 28:42) 22:41.6-22:55.4 | 13.8 s | Answering why yields rose since the last meeting; he then lists three reasons: economic strength, competition for capital (hyperscaler capex), geopolitics. In context. This is the Fed chair's own version of the "fulcrum" idea, so the fulcrum can air in a primary voice instead of the unverified trader's. Note: the Fed's own captions on YouTube run around 7 s LATE versus the audio; these times are from the audio. Caption: "Fed Chair Kevin Warsh, Sept 16, 2026". `--expect "the 10-year Treasury"` | Pillar 4 |
| CLIP-6 | Klaus Schwab, WEF founder, Great Reset launch, June 3, 2020: "In short, we need a great reset. We have to mobilize all constituents of our global society to work together. We must not miss this unique window of opportunity." | https://www.youtube.com/watch?v=pfVdMWzKwjc (World Economic Forum, "The Great Reset, Launch session 3 June 2020", 1:25:46) 8:20.9-8:34.7 | 13.8 s | Spoken while launching the WEF initiative as a response to COVID-19, with the Prince of Wales, Guterres and Georgieva. In context. The written "rare but narrow window ... reset our world" line is NOT in this audio; if the screenplay wants that exact wording it must be a receipt (C10), not this clip. Caption: "Klaus Schwab, World Economic Forum, June 3, 2020". `--expect "we need a great reset"` | Pillar 5 |
| CLIP-7 | Klaus Schwab, same session: "It is obvious that we are in the midst of the most severe crisis the world has experienced since World War II." | https://www.youtube.com/watch?v=pfVdMWzKwjc 6:35.7-6:44.0 | 8.3 s | His opening line of the launch. In context. Bridges the WWII precedent (Pillar 3) to the reset (Pillar 5). Use CLIP-6 OR CLIP-7, rarely both. | Pillar 5 / Pillar 3 |
| (none) | Trump's TIME line "Certain levels of inflation will also pay off that debt very rapidly": searched the TIME page (only an unrelated jwplayer clip, 7nEUe7Yq, "Donald Trump Has Appeared on the Cover of TIME More Than Anyone Else") and YouTube ("Trump TIME interview inflation pay off the debt": commentary channels only). No audio or video found; receipt C3 instead. | | | | |
| (none) | Ghalibaf "single barrel": an X text post, not video (receipt C14). Hassett "No, absolutely not" (Bloomberg Open Interest): no video located, date unknown. Bogachan Ozdemir: no post or video found. | | | | |

---

## CHART-SOURCE INDEX

| ID | Chart / graphic | Seen in / source | Build mode |
|---|---|---|---|
| C1 | THE system-design diagram, "How a debt gets inflated away": Government debt (40.4 trillion) -> rates held under inflation (WWII cap 2.5%, 2020 zero) -> real value of the debt shrinks -> who pays (savers, wage earners, bondholders) vs who wins (asset owners: top 10% own 88% of stocks). Every label traces to Pillars 2, 3 | section 2, Pillars 2 and 3 | **code** (Type 2, static states) |
| C2 | WWII playbook chart: debt held by the public % of GDP, 1946 106.3% to 1974 22.2% (annual points), with the 1947 CPI +19.7% marker and the 1942 to 1951 "rates capped at 2.5%" band | FRED FYPUGDA188S + BLS + Fed History (Pillar 3) | **code** (Type 1 animated line, sparse) |
| C3 | Receipt: the TIME transcript passage "You know, inflation. Certain levels of inflation will also pay off that debt very rapidly. Very rapidly." (crop to the exchange incl. "Growth will pay it off" above it if it fits) | https://time.com/article/2026/10/01/donald-trump-2026-interview-transcript/ | **screencap** |
| C4 | Debt ticker card: 40,444,342,709,389 dollars + "around 6.7 billion a day" | Pillar 2 (Debt to the Penny) | **code** (count-up) [VERIFY] |
| C5 | Receipt: Treasury Debt to the Penny page showing the latest total | https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/debt-to-the-penny | **screencap** [VERIFY] |
| C6 | "Where every tax dollar went" FY2026: receipts 5.403 trillion as one bar vs the stack Social Security 1.667 + Medicare 1.073 + Medicaid 0.723 + Veterans 0.416 + Net interest 1.052 = 91 cents; interest alone 19 cents; interest > defense | Pillar 2 (Treasury MTS) | **code** (Type 1 animated stacked bar) |
| C7 | Who owns the debt: foreign 23% (China 1.5%) vs inside the US 77% (Fed 11%, trust funds incl. Social Security around 19%, rest US banks, funds, pensions, households) | Pillar 2 (TIC, H.4.1, Debt to the Penny) | **code** (split bar / donut) |
| C8 | "The lenders say no" bars: US 10-year 5.31% (highest since 2002), UK 30-year above 6% (first since 1998), Japan 30-year 4.168% (record) | Pillar 4 | **code** (Type 1 bars) [VERIFY] |
| C9 | OPTIONAL: real US 10-year price chart for 2026 | TradingView US10Y or https://home.treasury.gov par yield page | **screencap** [VERIFY]; never restyle |
| C10 | Receipt: Schwab's "rare but narrow window of opportunity to reflect, reimagine, and reset our world" as printed | https://www2.project-syndicate.org/commentary/great-reset-capitalism-covid19-crisis-by-klaus-schwab-2020-06 (crop to the sentence) | **screencap** |
| C11 | Receipt: Bloomberg TV headline "Bessent Tells Yen Traders 'I Am the House Now'" (carries the honest context) | https://www.youtube.com/watch?v=GE5jOaGhrFI | **screencap** |
| C12 | Receipt: CNBC transcript paragraph "I can't set the equilibrium price" | https://www.cnbc.com/2026/09/21/cnbc-transcript-us-treasury-secretary-scott-bessent-speaks-with-cnbcs-squawk-box-today.html | **screencap** |
| C13 | Receipt: FOMC statement Sept 16, 2026 "raise the target range ... to 3-3/4 to 4 percent" | https://www.federalreserve.gov/newsevents/pressreleases/monetary20260916a.htm | **screencap** |
| C14 | Receipt: Ghalibaf's "Let's see if a hike could open SOH or produce a single barrel" as printed by Al Jazeera (or the X post itself if the capturer finds it) | https://www.aljazeera.com/news/2026/9/17/ghalibafs-maths-missile-at-trump-decoded-is-iran-fixing-us-interest-rates | **screencap** |
| C15 | Receipt: Trump's Truth Social post "I am instructing my Representatives to BUY $200 BILLION DOLLARS IN MORTGAGE BONDS" (Jan 8, 2026) | Truth Social original (capturer to locate) or https://www.scotsmanguide.com/news/pulte-confirms-fannie-and-freddie-will-buy-200-billion-of-mortgage-bonds/ | **screencap** [VERIFY] |
| C16 | Receipt: Freddie Mac PMMS page with the current 30-year rate | https://www.freddiemac.com/pmms | **screencap** [VERIFY] |
| C17 | "Printing into a crisis" count-up cards (2020 to 2022): Fed balance sheet 4.16 to 8.97 trillion; M2 +40.6%; billionaires' wealth 8 to 13.1 trillion; Bitcoin 4,980 to 67,510 dollars | Pillar 6 | **code** (Type 1 count-ups; also usable as deck cards) |
| C18 | Receipt: Treasury buyback results (Oct 1, 2026: 46.4 billion offered, 6.0 billion accepted) | https://fiscaldata.treasury.gov/datasets/treasury-securities-buybacks/ | **screencap** |
| C19 | The crisis-as-rescue loop (Mike's SCENARIO, labelled "how it could go"): debt too big -> inflation on purpose angers savers -> a crisis arrives (energy, AI jobs, quantum risk) -> printing reads as a rescue -> asset owners come out richer. Real precedents tagged (WWII, 2020); nothing on it stated as fact | Pillars 3, 5 | **code** (Type 2, static states) |
| C20 | Receipt: EO 14178 Sec. 5 "agencies are hereby prohibited from undertaking any action to establish, issue, or promote CBDCs" | https://www.whitehouse.gov/presidential-actions/2025/01/strengthening-american-leadership-in-digital-financial-technology/ | **screencap** |
| C21 | Receipt: UN SDG 16.9 text "By 2030, provide legal identity for all, including birth registration" | https://sdgs.un.org/goals/goal16 | **screencap** |
| C22 | OPTIONAL: Forbes 2021 billionaires facts page (2,755, 13.1 trillion) | https://www.forbes.com/sites/kerryadolan/2021/04/06/forbes-35th-annual-worlds-billionaires-list-facts-and-figures-2021/ (403 to scripts; browser capture) | **screencap** [VERIFY] |
| C23 | NEW at the screenplay (added at the accuracy pass 2026-10-26): system-design diagram, "the price under every price": a center node "10-year Treasury" with arrows out to "30-year mortgage", "Business loans", "Stock prices", "New government debt" (each target lights as Mike names it), plus a quote strip of Warsh's own words "the most important asset anywhere in the world" (Warsh, Sept 16, 2026). No data figures on it. Arrows mean "priced off it": the narration's "goes up" covers mortgages, business loans and the government's borrowing costs only, never stock prices | Warsh at the FOMC press conference, Sept 16, 2026 (Fed transcript p. 11, https://www.federalreserve.gov/mediacenter/files/FOMCpresconf20260916.pdf ; CLIP-5; Pillar 4); the mortgage and new-debt links trace to Pillar 2 (new 10-year 5.00% vs 3.518% average) and Pillar 4 (PMMS) | **code** (Type 2, static states) |

Guardrail reminder (charts.md section 2): no number on screen comes from an image model. Code-built graphics are text-accurate and trace to section 2; everything else is a real-site capture. Budget note (brief): after CH1 around 3 system-design diagrams and 2 to 3 charts; C1, C19 and one of C2/C6/C7/C8 are the strongest; the rest of these points can become deck cards worded from the rows above.

---

## Open questions for Mike

1. **No video or audio of the TIME line exists that we could find.** The admission airs as a screencap of TIME's transcript (C3). CLIP-1 ("We have inflation totally in control", Oct 1, 2026) is the nearest real Trump audio from the same week. Recommendation: open CH1 on the TIME receipt, use CLIP-1 as the contrast beat.
2. **Brief contradiction (soft): "I am the house now" was about the yen, not the bond market.** The brief (Pillar 4) and the reference frame it as a dare to bond traders. The SMU audio and Bloomberg TV's own headline say currency intervention. The angle survives: Bessent's swagger, then the bond market pushing the 10-year to its highest since 2002 within a month, then his own "I can't set the equilibrium price". Recommendation: keep the yen words in the clip (CLIP-3 window) and say "talking about the yen".
3. **Brief claim that cannot be sourced as stated: "mandatory spending plus interest already exceed every dollar the government takes in."** FY2026 Treasury actuals: 91% (97% with gross interest). Recommendation: "around 91 cents of every dollar" (still brutal, and true).
4. **Kevin Hassett's "No, absolutely not"** (Bloomberg Open Interest) is reported only by 24/7 Wall St, with no interview date. Recommendation: either drop it or use it as one honest line ("his own economic adviser says no"), after the accuracy pass finds the primary.
5. **The UK 30-year above 6% "first time since 1998"** rests on secondary outlets (LSEG data via roic.ai, Seoul Economic Daily). Recommendation: receipt-capturer screenshots a reputable chart page (e.g. Bank of England or a Reuters/FT page) before it airs. [VERIFY]
6. **CBO could not be opened (403).** All budget numbers use Treasury's final MTS (primary). If Mike wants CBO's own wording on screen, the capturer can screenshot the CBO page in a browser.
7. **Forbes pages could not be opened by script (403);** Americans for Tax Fairness report not opened. Recommendation: the 2020 to 2021 wealth beat leans on the Fed's own data (balance sheet, M2, DFA top 0.1% share) plus Forbes' counts via coverage; browser-capture C22 if the Forbes number goes on screen.
8. **Bogachan Ozdemir and the "Bank of Japan insider" are dropped** (section 4 items 10 and 11). Warsh's "the most important asset anywhere in the world, the 10-year Treasury" (CLIP-5) carries the fulcrum idea with a primary voice.
9. **"Next year" timing:** no source can support a date for the next wave of crypto billionaires; it airs only as Mike's first-person bet. Persona note: BTC is "macro commentary", not a stacking pick; if Mike names his own coins in CH6, KAS leads (persona stacking lineup), framed as his holdings.
10. **Brief contradiction check (thesis):** the brief's "they are going to make the giant number smaller by making your dollars smaller" is Mike's reading of a sentence in which inflation is named "also", after growth. The angle survives when the screenplay quotes the sentence exactly and then says "here is what that means for your money" in Mike's own voice.
