# reset: ACCURACY PASS on SCREENPLAY.md

_Run 2026-10-26 per `video-creation/skills/accuracy-pass/accuracy-pass.md`. File under test: `media/reset/SCREENPLAY.md` (639 lines). DATA.md was the starting map; every verdict below was re-checked against a live source, primary wherever one exists (Treasury fiscaldata APIs, Treasury par-curve CSVs, BLS API, FRED, EIA, TIC, Freddie Mac, Japan MOF, Fed DFA, Fed transcripts and statements, TIME, CNBC, BIS, Project Syndicate, whitehouse.gov, sdgs.un.org, Challenger, official EU pages, Reuters, Forbes). No video or audio was downloaded; YouTube was used for metadata and caption tracks only._

**Lint after the edits:** `SCREENPLAY-LINT PASS faces=25 fails=0 warns=0 inserts=4` (`lint_screenplay.py --face-max 30`).

## 1. Counts

- **Claims checked: 103 distinct claims.** A claim that appears on several surfaces (spoken line + SHOW line + DECK-CARD + deck table + verify box + WARNING box) counts once, and every surface was checked.
- **✅ 92 · ⚠️ 7 · ❌ 3 · ❓ 1**
- **Applied:** the 3 ❌ and 2 of the ⚠️ (W1, W2), plus annotation updates that resolve the screenplay's weak flags (UK gilt, EU wallet, Forbes 2021, Forbes 2022, the FOMC date, Hassett). The other 5 ⚠️ are recommendations for Mike (section 4).
- **Spoken lines changed: 2** (CH3 Beat 5, CH4 Beat 3). **Deck text changed: 1** (card 8.1's date: the SHOW line and the deck table). No number in any spoken line changed.
- The screenplay's four weak items all **resolved to ✅**: UK 30-year above 6 percent (Reuters, LSEG data), EU wallet by end of 2026 and voluntary (European Commission + European Parliament), Forbes 2021 (2,755 / 13.1T / 8T / a record 493 newcomers) and Forbes 2022 (a record 19 crypto billionaires, 7 more). Japan's 30-year record ✅ (MOF). Hassett's "No, absolutely not" HAS a primary (Bloomberg Open Interest, Oct 2, 2026).

## 2. Verdict table (most severe first)

### ❌ Wrong (all fixed)

| # | Claim (where) | Verdict | Citation | Fix (applied) |
|---|---|---|---|---|
| X1 | Brent peak date "Apr 6, 2026" (DECK-CARD 8.1 in CH5 Beat 3 SHOW, L413; deck table SLIDE 8 card 8.1, L619; CH5 verify list, L442; DATA.md Pillar 4 + timeline) | ❌ | EIA RBRTE daily table, week "2026 Apr- 6 to Apr-10": the Monday cell (Apr 6, Easter Monday) is BLANK, Tuesday Apr 7 = 138.21; FRED DCOILBRENTEU has no 2026-04-06 value and 138.21 on 2026-04-07. The researcher read Tuesday's cell as Monday's. | "Feb 27 to Apr 6, 2026" -> "Feb 27 to Apr 7, 2026" everywhere (SHOW, deck table, verify box, DATA.md x2). The spoken line ("as high as 138") is unchanged. |
| X2 | WARNING box 1 (L21) and DATA.md section 4 item 6: inflation line said "right after 'Growth will pay it off'" | ❌ | TIME transcript: "Growth will pay it off" is followed by the Fed/Warsh remarks, the Switzerland riff, "they're concerned that the economy is too hot", "No, they're concerned for inflation", "Can you tell us about your meeting with", and only then "You know, inflation. Certain levels of inflation will also pay off that debt very rapidly." | "right after" -> "a few answers after" (screenplay WARNING box + DATA.md item 6). |
| X3 | Hassett's "No, absolutely not" = "no video, undated" (CLIP-INSERTS not-clips note, L559) / "reported only by 24/7 Wall St, undated" (OPEN QUESTIONS 7, L634) | ❌ | Bloomberg Open Interest, Oct 2, 2026 (Mike McKee, Dani Burger), Bloomberg segment "NEC's Kevin Hassett on Sept. Jobs and Paying Down US Debt" on Yahoo Finance: around 06:58 the host quotes the TIME line and asks "Does this White House to some degree plan to inflate its way out of the debt?"; around 07:27 Hassett: "No, absolutely not."; around 08:00: "obviously it's a mechanical thing". (bloomberg.com 403s to scripts; the Yahoo page carries the same Bloomberg video and an auto-transcript.) | Both notes now name the primary; the decision to use it stays Mike's (section 4). |

### ⚠️ Stale / imprecise / over-stated

| # | Claim (where) | Verdict | Citation | Fix |
|---|---|---|---|---|
| W1 | "In America, the top 10 percent own around 88 percent of **all** stocks and mutual funds. The bottom half owns 0.6 percent." (CH3 Beat 5, L288; card 4.5; C1 label) | ⚠️ over-stated | Fed DFA 2026 Q2: top 10% = 88.1%, bottom 50% = 0.6% of "corporate equities and mutual fund shares", which the DFA defines as "excluding equities and mutual fund shares owned through DC pensions" (dfa-data-definitions.txt). Counting DC pension entitlements in, the top-10% share is nearer 81%. | APPLIED: dropped "all" (spoken line now matches the Fed's own category label). Verify box L301 now records the exclusion. Card 4.5 / C1 label unchanged (they never said "all"). Optional qualifier in section 4. |
| W2 | "The average 30-year mortgage is around 7.3 percent. The highest since late 2023." (CH4 Beat 3, L340) | ⚠️ imprecise | Freddie Mac PMMS history: 7.32% (2026-10-22) is BELOW the 7.40% of 2026-10-08 and 10-15; 7.40% was the highest since 2023-11-16 (7.44%). Today's reading is near, not at, that high. | APPLIED: "The highest since late 2023." -> "Near the highest since late 2023." Verify box L372 updated (if the record-day PMMS tops 7.40%, the old wording is exact again). Card 5.3 ("around 7.3%") unchanged. |
| W3 | "And when money gets printed into a crisis, the people who already own scarce assets come out the other side richer." (CH1 Beat 5, L132) | ⚠️ generalization | True for the episode the script cites next (2020-21: Forbes, Fed DFA top 0.1% 11.7% -> 13.8%). As a law it overreaches: in the 1940s repression era top wealth shares FELL. | NOT applied (Mike's thesis voice). Recommendation in section 4. |
| W4 | DECK-CARD 11.1 (deck table SLIDE 11): "'Inflation will also pay off that debt'" | ⚠️ trimmed quote | TIME: "Certain levels of inflation will also pay off that debt very rapidly." The card's words are contiguous, but the quote marks plus the capital "I" present a trimmed fragment as his sentence and drop "Certain levels of". WARNING box 1 asks for his exact sentence. | NOT applied (deck text, judgment). Recommendation in section 4. |
| W5 | "Then Treasury Secretary Scott Bessent went on CNBC in September, and explained why he raised the size." (CH4 Beat 4, L350) | ⚠️ minor sequence | Buyback ops: 2.0B through 2026-08-18, 5.187B on 2026-09-10, 4.078B on 09-24, 6.0B on Oct 1, 8, 15. The CNBC interview (Sept 21) came after the first raise but BEFORE the 6B operations the previous line names, so "Then" implies the wrong order. The date "in September" is right. | NOT applied. Recommend "Then" -> "And". |
| W6 | C23 node "Stock prices" (CH4 Beat 1 SHOW, L318) under the narration "When it goes up, mortgages go up. Business loans go up..." | ⚠️ visual could mislead | Warsh (Fed transcript p. 11) supports "every price ... is related to" the 10-year, not a same-direction move; the spoken line never names stock prices, so lighting it on a "goes up" line implies stocks rise with yields. | NOT applied to the screenplay. DATA.md's new C23 row carries the guardrail ("priced off it", never "goes up with it"). Recommend dropping the node or never lighting it on a "goes up" line. |
| W7 | CLIP-3 (HELD) words: "I say, well, it's my dream. I have asymmetric information. I am the house now. So, right? So when we intervene with the Japanese yen," | ⚠️ minor wording | SMU's own caption track at that point reads "it's well you know it's my dream. I have asymmetric information. Like I am the house now. So So when we intervene with the Japanese yen". The yen context is confirmed. | NOT applied (clip is HELD). If Mike approves CLIP-3, the capture's Whisper pass sets the words. |

### ❓ Unverifiable here

| # | Claim (where) | Verdict | Citation | Fix |
|---|---|---|---|---|
| Q1 | CLIP-1 window 0:30.2 to 0:34.2 and CLIP-4 window 15:02.9 to 15:15.7 (exact audio timecodes; CLIP-4's "we were" vs CNBC's printed "we are") | ❓ | YouTube caption pulls for iflPD2vYrEQ and XcSztxaM77w returned HTTP 429 twice; no audio downloaded, per the brief. The WORDS are confirmed separately (C9, C57). | None. `capture_clip_insert.py --expect` re-verifies both windows at capture. |

### ✅ Confirmed

**Hook / CH1**

| # | Claim (where) | Citation |
|---|---|---|
| C1 | TIME quote verbatim "Certain levels of inflation will also pay off that debt very rapidly. Very rapidly." (L96 locked, C3, hook, nutshell paraphrase) | TIME transcript (opened): "You know, inflation. Certain levels of inflation will also pay off that debt very rapidly. Very rapidly." |
| C2 | "TIME interview at the White House, Sept 28, 2026", published Oct 1 (L97 lower-third, verify box) | TIME: "sat down for an interview with TIME at the White House on Sept. 28"; page time "Oct 1, 2026 11:00 AM UTC" |
| C3 | "The President ... said out loud how a 40 trillion dollar debt gets paid off." (L94 locked) | TIME: "Growth will pay it off", "pay it off through growth", and the inflation line ("also"). He named the routes; "also" keeps the inflation line exact |
| C4 | Debt 40,444,342,709,389 / "40.4 trillion" / "over 40 trillion" / C1 "40.4T" (C4, L168, nutshell, C1) | Debt to the Penny API, 2026-10-22: 40,444,342,709,389.15 (latest record date at the read) |
| C5 | "+6.7B a day" / "around 6.7 billion dollars a day" (C4, L172, card 1.2, card 11.1, L527) | Debt to the Penny: 37,990,672,926,605.56 (2025-10-22) -> 40,444,342,709,389.15 (2026-10-22) = +2.4537T / 365 = 6.72B a day |
| C6 | Inflation shrinks a debt by making dollars worth less; "the debt doesn't shrink. Your dollars do." (L104 to L108) | BIS WP 363 abstract: negative real rates "liquidate or erode the real value of government debt" (explainer, correct) |
| C7 | "Three days after that interview" (L113) | Interview Mon Sept 28; CLIP-1 upload 2026-10-01, description "spoke with reporters on Thursday"; Oct 1, 2026 is a Thursday |
| C8 | "talked to reporters about the cost of living" (L113) | Forbes Breaking News title "'We Have Inflation Totally Under Control': Trump Insists Economy's Improving As Oil Prices Lower"; audio context "costs are way down" (DATA.md Whisper) |
| C9 | CLIP-1 words "We have inflation totally in control, and we've done a great job." | DATA.md local Whisper on the video audio + independent transcription in Aaron Rupar's Oct 1, 2026 post (search result "Trump says 'We have inflation totally in control and we've done a great job.'", investmentwatchblog.com, not opened) |
| C10 | CLIP-1 caption "Donald Trump, speaking to reporters, Oct 1, 2026" | yt-dlp metadata: upload 20261001, Forbes Breaking News, 1:46 |
| C11 | Video title "UNDER control" vs audio "in control" (WARNING box 4, CH1 verify) | yt-dlp title (above); audio per C9 |
| C12 | "The official number for September came in at 3.7 percent." + H1 card (L115, L116) | BLS API CUUR0000SA0: 336.940 (Sep 2026) vs 324.800 (Sep 2025) = +3.74%; no October 2026 value yet |
| C13 | "the Fed's own 2 percent goal" / "Almost double" (L115, H1) | FOMC statement 2026-09-16: "the Committee's 2 percent goal"; 3.7 / 2 = 1.85 |
| C14 | "this has been done before. After World War II. And again, in 2020." (L121, card 11.1) | BIS WP 363 (1945 to 1980 liquidation via negative real rates); FRED FYPUGDA188S and GFDEGDQ188S declines; IIF: "Higher inflation has helped contain debt ratios" (DATA.md) |
| C15 | "A record wave of brand new billionaires" in 2020 and 2021 (L134) | Forbes (Kerry A. Dolan, Apr 6, 2021, Forbes Africa licensed edition): "a record high 493 newcomers" |
| C16 | Opinion framing: "here's what I think comes next" (L125), "the reset I'm warning you about" (L127), "I think crypto billionaires will be made next year" (L136), the CH5 scenario, "my bet" (L499, L501, card 10.4) | Brief + persona: first person, conditional, never a promise. All correctly framed |

**CH2**

| # | Claim (where) | Citation |
|---|---|---|
| C17 | Passed 40T for the first time on August 18 (L170, card 1.1) | Debt to the Penny: 39,986,657,878,071.92 (08-17) -> 40,047,425,768,420.22 (08-18) |
| C18 | FY2026: took in 5.4T, spent 7.4T (L178, card 1.3) | MTS Table 9, 2026-09-30: receipts 5,403,326,758,960.81; outlays 7,395,799,983,313.23 |
| C19 | Borrowed around 2T = around 27 cents of every dollar spent (L180, card 1.4) | Deficit 1.992T; 1.9925 / 7.3958 = 26.9% |
| C20 | Interest 1.05T, more than national defense (L182, card 1.5 "Interest: 1.05T. Defense: 965B.") | MTS Table 9: Net Interest 1,051,753,969,311; National Defense 965,160,356,821 |
| C21 | Interest = around 19 cents of every tax dollar (L184) | 1.0518 / 5.4033 = 19.5% |
| C22 | The five = around 91 cents of every dollar collected (L186, card 1.6) | MTS T9: Social Security 1,667.1B, Medicare 1,072.6B, Veterans 416.2B, Net Interest 1,051.8B; MTS Table 5: Grants to States for Medicaid 723.0B. Sum 4,930.7B / 5,403.3B = 91.3% |
| C23 | Around 10.6T due within a year = around one third of marketable debt (L194, card 2.1) | MSPD Table 3, 2026-09-30, maturities to 2027-09-30: bills 7.118T, notes 2.917T, FRN 0.353T, TIPS 0.223T, bonds 0.030T = 10.64T of 31.835T = 33.4% |
| C24 | Paid off the usual way, with new loans (L196) | Rollover: bills alone are 7.1T of the 10.6T |
| C25 | Old debt around 3.5% average (L198, card 2.2) | Average Interest Rates API: Total Marketable 3.518% (2026-09-30) |
| C26 | New 10-year around 5% (L198, card 2.2 "5.0%") | Treasury par curve: 10-year 5.00% (2026-10-23 close, latest) |
| C27 | The interest bill keeps climbing (L200) | Net interest 970.4B (FY2025) -> 1,051.8B (FY2026), MTS T9 prior/current FYTD |
| C28 | Around three quarters / "around 77%" owed inside the US (L208, card 2.3) | TIC Table 5: foreign 9,331.7B (Aug 2026) / Debt to the Penny 40,175.6B (2026-08-31) = 23.2% |
| C29 | Held by the Fed, Social Security trust funds, banks, pensions, insurers, savers (L210, card 2.4) | Intragovernmental 7.85T (Debt to the Penny); Fed holdings (DATA.md H.4.1); the domestic sectors (DATA.md) |
| C30 | China around 1.5% (L212, card 2.5) | TIC: China 590.7B / 40,175.6B = 1.47% |

**CH3**

| # | Claim (where) | Citation |
|---|---|---|
| C31 | 1946: debt held by the public 106% of GDP, "still the record" (L243, C2 "106.3%", card 3.3) | FRED FYPUGDA188S (OMB): 106.31 (1946); never exceeded since (max quarterly FYGFGDQ188S 102.96, 2020 Q2) |
| C32 | From 1942 the Fed capped long-term bond rates at 2.5% (L245, C2 band "1942 to 1951", C1, card 6.2) | Fed History, "The Treasury-Fed Accord": April 1942 peg; "The Fed also implicitly capped the rate on long-term Treasury bonds at 2.5 percent"; Accord March 1951 |
| C33 | March 1947 inflation 19.7% (L247, C2 marker, card 3.1) | BLS CUUR0000SA0: 21.9 (Mar 1947) vs 18.3 (Mar 1946) = +19.67% |
| C34 | Bondholders earned 2.5% a year while prices rose almost 20% (L249, card 3.1) | Fed History (2.5% ceiling) + BLS (above); 2.5% was the cap |
| C35 | By 1974 down to around 22% (L251, C2 "22.2%", card 3.3) | FRED FYPUGDA188S: 22.24 (1974) |
| C36 | Today around 98%, close to the record (L253, card 3.2 "Today: 98% (FY2025)") | FRED FYPUGDA188S: 98.07 (FY2025); quarterly FYGFGDQ188S 98.71 (2026 Q1) |
| C37 | Fed cut to zero in March 2020, held 2 years (L261, card 4.1) | FOMC 2020-03-15: "lower the target range ... to 0 to 1/4 percent"; 2022-03-16: "raise ... to 1/4 to 1/2 percent" |
| C38 | Inflation 9.1% in June 2022 (L263, card 4.2) | BLS: 296.311 vs 271.696 = +9.06% |
| C39 | Total debt fell from around 133% to around 116% by early 2023 (L265, card 4.3) | FRED GFDEGDQ188S: 132.66 (2020 Q2) -> 115.59 (2023 Q1, the trough). See the optional note in section 4 |
| C40 | "Financial repression"; the interest you get stays below inflation; debt and savings shrink in real terms (L270 to L274) | BIS WP 363 abstract ("A subtle type of debt restructuring takes the form of 'financial repression.'") |
| C41 | Reinhart and Sbrancia: works best with "a steady dose of inflation"; card 4.4 quote; "BIS, 2011" (L276, L277) | BIS WP 363, published 09 December 2011: "Thus, financial repression is most successful in liquidating debts when accompanied by a steady dose of inflation." |
| C42 | "push the J key ... to go back" (L278) | YouTube Help, keyboard shortcuts: "j: Seek backward 10 seconds in player." |
| C43 | Inflation moves wealth from savers to owners (L284 to L290) | Explainer consistent with the DFA ownership data and BIS 363; framed as explanation |

**CH4**

| # | Claim (where) | Citation |
|---|---|---|
| C44 | Kevin Warsh is Fed chair; spoke in September (L314, CLIP-5 caption "Fed Chair Kevin Warsh, Sept 16, 2026") | Atlanta Fed: "On May 22, Kevin Warsh took the oath of office as chairman"; Fed transcript "Chairman Warsh's Press Conference, September 16, 2026" |
| C45 | CLIP-5 words verbatim | Fed official transcript p. 11: "This is a complicated set of things that are affecting the most important asset anywhere in the world, the 10-year Treasury. It's the risk-free asset upon which every price of virtually every asset in the world is related to." Exact match |
| C46 | CLIP-5 window 22:41.6 to 22:55.4 (audio times, captions around 7 s late) | Fed YouTube caption track: the passage runs 22:46.9 to 22:57.1, consistent with a few seconds of caption lag; upload 2026-09-16, 28:42 |
| C47 | "the price under every other price": mortgages, business loans and the government's borrowing costs rise with it (L317) | Warsh (above); PMMS 5.98% (Feb 2026) -> 7.40% (Oct) as the 10-year rose; new 10-year 5.00% vs 3.518% average |
| C48 | C23 quote strip "the most important asset anywhere in the world" (Warsh, Sept 16, 2026) | Fed transcript p. 11 |
| C49 | 10-year closed at 5.31% on Oct 5, the highest since 2002 (L325, C8, card 5.2) | Treasury par curve CSVs: 5.31 on 2026-10-05 (2026 high); last close at or above 5.31 was 5.32 on 2002-05-14 (2006 max 5.25, 2007 max 5.26, 2023 max 4.98) |
| C50 | UK 30-year above 6% for the first time since 1998 (L327, C8) | Reuters, Oct 1, 2026 (Suban Abdulla, via Global Banking & Finance Review; headline also on TradingView): "Thirty-year gilt yields rose as high as 6.029%, their highest since January 1998", LSEG data. Intraday |
| C51 | Japan 30-year hit a record high; C8 "4.168%" (L327) | Japan MOF jgbcme_all.csv: 30Y 4.168 on 2026/10/6, the series maximum (series begins 1999) |
| C52 | Warsh's three reasons: strong economy, AI companies competing for money, geopolitics (L329, card 5.1) | Fed transcript p. 11: "First is economic strength ... Second reason, competition for capital ... the so-called hyperscalers are out in the market raising funding ... The third is geopolitics." ("AI companies" is a fair gloss of the hyperscalers' capex) |
| C53 | Treasury stepped up long-bond buybacks from 2B per operation to 6B (L346, card 6.3) | fiscaldata Buyback Operations: 10Y to 20Y / 20Y to 30Y at 2.0B through 2026-08-18; 6.0B on 2026-10-01, 10-08, 10-15 |
| C54 | "In a market of around 32 trillion dollars." (L348, card 6.3) | MSPD Table 1: Total Marketable 31,834,878 million (2026-09-30) |
| C55 | C18 receipt: Oct 1, 2026, 46.4B offered, 6.0B accepted | Buyback Operations: offered 46,391,000,000; accepted 6,000,000,000 |
| C56 | Bessent on CNBC in September; CLIP-4 caption "Scott Bessent on CNBC, Sept 21, 2026"; card 6.1 date | CNBC transcript: "WHEN: Today, Monday, September 21, 2026 ... Squawk Box"; Treasury upload 2026-09-21, 22:24 |
| C57 | CLIP-4 words and card 6.1 "'I can't set the equilibrium price.'" | CNBC transcript (answering Kernen on buying "the long end"): "I just raised the size because we are in a very illiquid period. The market was moving quickly. You know, as I've said, I can't set the equilibrium price. But markets are never in equilibrium." (tense detail in Q1) |
| C58 | "the man in charge of America's debt, telling you he can't set its price" (L353) | Treasury Secretary manages federal borrowing; quote above |
| C59 | Fed raised rates in September because inflation is still too high; C13 (L358, L359) | FOMC statement 2026-09-16, "12 - 0 vote": "raise the target range ... by 1/4 percentage point to 3-3/4 to 4 percent" ... "Inflation remains elevated." |
| C60 | 1942 and 2020 the Fed bought government bonds; card 6.2 "at least 500B of Treasuries" (L360, L361) | Fed History (the peg); FOMC 2020-03-15: "increase its holdings of Treasury securities by at least $500 billion" |
| C61 | FOMC meets Oct 27 to 28 (L364) | federalreserve.gov FOMC calendar, 2026: "October 27-28" (DATA.md had it as secondary; now primary) |

**CH5**

| # | Claim (where) | Citation |
|---|---|---|
| C62 | 1940s the war, 2020 the pandemic (L394, card 7.1) | Fed History; FOMC 2020-03-15 (coronavirus) |
| C63 | June 3, 2020, Klaus Schwab, founder of the WEF, launched the Great Reset (L399, card 7.2) | WEF upload "The Great Reset, Launch session 3 June 2020" (uploaded 2020-06-03); its captions introduce "Executive Chairman and Founder, Professor Klaus Schwab" |
| C64 | CLIP-6 words + caption "Klaus Schwab, World Economic Forum, June 3, 2020" | WEF caption track at 8:19 to 8:36: "In short, we need a great reset. We have to mobilize all constituents of our global society to work together. We must not miss this unique window of opportunity." |
| C65 | In writing he called the pandemic "a rare but narrow window of opportunity" (L402, C10) | Project Syndicate, "Time for a Great Reset", Jun 3, 2020: "the pandemic represents a rare but narrow window of opportunity to reflect, reimagine, and reset our world to create a healthier, more equitable, and more prosperous future." (The C10 SHOW line closes the quote at "world."; the receipt highlight is the real text) |
| C66 | The war with Iran started on February 28 (L412) | Al Jazeera 2026-09-17: "the war, which the US and Israel launched against Iran on February 28" |
| C67 | Oil from around 71 dollars to as high as 138 (L412, card 8.1 numbers) | EIA / FRED DCOILBRENTEU: 71.32 (2026-02-27), 138.21 (2026-04-07). Date fixed in X1 |
| C68 | AI is the top reason for layoffs in 2026, around 120,000 through September; card 8.2 "120,136 ... January to September" (L414) | Challenger report released Oct 1, 2026: "So far this year, AI has been cited in 120,136 job cut announcements, approximately 21% of all cuts, and it remains the leading reason year-to-date." |
| C69 | Europe has to offer a digital ID wallet by the end of 2026 (L418, card 8.3) | European Commission, European Digital Identity page: "Member States will make wallets available to every citizen, resident and business by the end of 2026." EU BIK page: wallets due "up to 24 months after the adoption of Implementing Acts" (first acts in force Dec 2024, so around Dec 24, 2026). EUR-Lex itself returned HTTP 202 bot challenges |
| C70 | Using it is voluntary (L418, card 8.3) | European Parliament press release (Feb 29, 2024): "The EU wallet will be used on a voluntary basis"; OEIL summary of the text: "The use of European Digital Identity Wallets shall be voluntary." |
| C71 | UN 2030 goal = legal identity, nothing about digital money (L420, C21, card 8.4) | sdgs.un.org goal 16: "16.9 By 2030, provide legal identity for all, including birth registration" |
| C72 | A January 2025 executive order bars federal agencies from creating a CBDC (L422, C20, card 8.5) | whitehouse.gov EO 14178, January 23, 2025, Sec. 5(a): "agencies are hereby prohibited from undertaking any action to establish, issue, or promote CBDCs within the jurisdiction of the United States or abroad." |

**CH6**

| # | Claim (where) | Citation |
|---|---|---|
| C73 | Fed balance sheet around 4.2T -> around 9T, more than double, in around 2 years (L461, C17 "4.16T to 8.97T", card 9.4) | FRED WALCL: 4,158,637 million (2020-02-26) -> 8,965,487 million (2022-04-13, all-time high) = 2.16x |
| C74 | Money supply grew by around 40% (L463, C17 "+40.6%", card 9.4) | FRED M2SL: 15,492.8 (Feb 2020) -> 21,788.1 (Mar 2022, the pre-2024 peak) = +40.6% |
| C75 | Forbes 2021: a record 2,755 billionaires worth 13.1T; 8T a year earlier (L465, C17) | Forbes (Kerry A. Dolan, Apr 6, 2021, Forbes Africa licensed edition): "exploded to an unprecedented 2,755", "Altogether they are worth $13.1 trillion, up from $8 trillion on the 2020 list." Fox Business / UPI coverage agree |
| C76 | Nearly 500 brand new billionaires (L467) | Same article: "There are a record high 493 newcomers to the list." |
| C77 | Top 0.1% share 11.7% -> 13.8% in under 2 years (L469, card 9.1) | Fed DFA networth shares: TopPt1 11.7 (2020:Q1) -> 13.8 (2021:Q4) |
| C78 | Bitcoin 4,980 (March 2020) -> 67,510 (November 2021), around 13.6x (L476, card 9.2) | FRED CBBTCUSD: 4,980.00 (2020-03-12, March low) -> 67,510.06 (2021-11-08, 2021 high) = 13.56x |
| C79 | By 2022, a record 19 crypto billionaires, 7 more (L478, card 9.3) | Forbes, John Hyatt, Apr 5, 2022 (forbes.com original via the Wayback Machine): "the record 19 billionaires, 7 more than last year ... who made their money from cryptocurrency and blockchain technology" |
| C80 | Bitcoin hard cap of 21 million, written into the code (L487, card 10.1) | Bitcoin Core src/consensus/amount.h: `MAX_MONEY{21'000'000 * COIN}` (see the citation note in section 4) |
| C81 | The Fed has no cap (L489, card 10.2) | No statutory size limit on the Fed balance sheet; WALCL more than doubled in 2 years |
| C82 | Kaspa max supply around 28.7B, around 97% mined (L491, card 10.3) | api.kaspa.org/info/coinsupply at 2026-10-26: max 28,704,035,605 KAS; circulating 27,777,047,679 KAS = 96.8% |
| C83 | "Kaspa, my main holding" (L491) | persona.json stacking_lineup: "$KAS (Kaspa), primary, always the focal asset; Kaspa maxi"; framed as his holding, not advice |

**CH7, WARNING boxes, clip table**

| # | Claim (where) | Citation |
|---|---|---|
| C84 | Nutshell: over 40T, around 6.7B a day, "inflation will also pay it off", done after WWII and in 2020 (L527, card 11.1 figures) | C4, C5, C1, C14 (the card's quote marks are W4) |
| C85 | CTA wording (L534) | persona.json cta_style ("click that like button and click the subscribe button", "I'm gonna catch you guys, later.") |
| C86 | WARNING box 1, other parts: "near the end of an hour-long interview", "no rate and no mechanism named" | TIME transcript: "We're coming up for about an hour." right after the line; no rate named |
| C87 | WARNING box 2 "say instead" figures: 6.7B a day; 91 cents; 19 cents; "in 2025, home sales matched the lowest level since 1995"; around 22%; around 98%; zero for 2 years then 9.1%; 2B to 6B | C5, C22, C21, C35, C36, C37, C38, C53; NAHB Eye on Housing (Jan 2026): "For the year 2025, existing home sales totaled 4.06 million, unchanged from 2024 and matching the lowest level since 1995." |
| C88 | WARNING box 3: "I am the house now" was about the yen; "You guys win" is a paraphrase; the 200B order's stated aim | SMU caption track: "...I am the house now. So So when we intervene with the Japanese yen"; "you guys win" absent from the CNBC transcript; Truth Social text via Scotsman Guide: "This will drive Mortgage Rates DOWN, monthly payments DOWN" |
| C89 | WARNING box 4 statements (AI around 120,000; UN legal identity; EU end of 2026 + voluntary; US EO; Forbes title vs audio) | C68 to C72, C11 |
| C90 | Clip sources: channels, titles, upload dates, durations (CLIP-1 to CLIP-7) | yt-dlp metadata: iflPD2vYrEQ Forbes Breaking News 2026-10-01 1:46; XcSztxaM77w U.S. Department of the Treasury 2026-09-21 22:24; ELU3u2Ny7r0 Federal Reserve 2026-09-16 28:42; pfVdMWzKwjc World Economic Forum 2020-06-03 1:25:46; MSTuVBip51A SMU 2026-09-09 1:04:39; xTANFw5f664 CNN 2016-05-09 1:53 |
| C91 | CLIP-2 (HELD) "you print the money" | CNN's own caption track: "FIRST OF ALL, YOU NEVER HAVE TO DEFAULT BECAUSE YOU PRINT MONEY. NEVER A DEFAULT." Supports "print" (Mike's ear check still stands) |
| C92 | CLIP-7 (REJECTED) words | WEF caption track at 6:34 to 6:45: "It is obvious that we are in the midst of the most severe crisis the world has experienced since World War II." |

## 3. Applied changes (old -> new)

### SCREENPLAY.md (line numbers unchanged; every edit replaced text in place)

**Spoken lines (2):**
1. L288, CH3 Beat 5 🗣️ `[COVER]`: "...own around 88 percent of **all** stocks and mutual funds. The bottom half owns 0.6 percent." -> "...own around 88 percent of stocks and mutual funds. The bottom half owns 0.6 percent." (W1)
2. L340, CH4 Beat 3 🗣️ `[COVER]`: "The average 30-year mortgage is around 7.3 percent. The highest since late 2023." -> "...around 7.3 percent. Near the highest since late 2023." (W2)

**DECK-CARD / deck-table text (1 change, 2 places): sync the deck**
3. L413, CH5 Beat 3 🎬 `[SHOW]`: DECK-CARD 8.1 "Brent oil: 71 to 138" / "Feb 27 to Apr 6, 2026" -> "Feb 27 to Apr 7, 2026" (X1)
4. L619, deck table SLIDE 8, card 8.1: "Feb 27 to Apr 6, 2026" -> "Feb 27 to Apr 7, 2026" (X1)

**WARNING box (1):**
5. L21, WARNING box 1: "...very rapidly", right after "Growth will pay it off", near the end..." -> "...very rapidly", a few answers after "Growth will pay it off", near the end..." (X2)

**🔍 `[VERIFY]` lines and verify boxes (not spoken, not on screen; they now carry the resolved citations):**
6. L149 (CH1 verify): Forbes 2021 "Boston Globe coverage ... MEDIUM-HIGH, browser check C22" -> "a record high 493 newcomers" from Kerry A. Dolan's Forbes article (Forbes Africa); C22 stays a browser capture if it airs.
7. L301 (CH3 verify): DFA line now records 88.1% and that the category EXCLUDES stocks and funds held through DC pensions ("never say 'all stocks'").
8. L334 (CH4 🔍 `[VERIFY]`): UK "rests on secondary outlets ... capture a reputable chart page" -> RESOLVED, Reuters Oct 1, 2026 (LSEG): "as high as 6.029%, their highest since January 1998" (intraday); use 6.03% intraday if C8 needs a number.
9. L364 (CH4 🔍 `[VERIFY]`): "The FOMC meets Oct 27 to 28 (secondary)" -> "(confirmed on the Fed's 2026 meeting calendar)".
10. L370 (CH4 verify): UK line "secondary (MEDIUM) [VERIFY]" -> Reuters (LSEG) quote, intraday, resolved.
11. L372 (CH4 verify): mortgage line now reads "near the highest since late 2023" and notes that a record-day PMMS above 7.40% makes the old wording exact.
12. L424 (CH5 🔍 `[VERIFY]`): EU "rest on search summaries ... open the regulation" -> RESOLVED on official EU pages (Commission "by the end of 2026"; Parliament "used on a voluntary basis"; Art. 5a; around Dec 24, 2026).
13. L442 (CH5 verify): "138.21 (2026-04-06)" -> "138.21 (2026-04-07; EIA has no Brent price on Monday 2026-04-06, Easter Monday, and FRED DCOILBRENTEU agrees)".
14. L444 (CH5 verify): EU line "via search summaries (MEDIUM) [VERIFY]" -> confirmed on the Commission and Parliament pages.
15. L508 (CH6 verify): Forbes 2021 "via Boston Globe coverage (MEDIUM-HIGH) [VERIFY on forbes.com ...]" -> confirmed in Forbes' own article (2,755; 13.1T up from 8T; a record high 493 newcomers); C22 stays a browser capture if it airs.
16. L511 (CH6 verify): Forbes 2022 "via forbes.es (MEDIUM) [VERIFY]" -> confirmed in the forbes.com original (John Hyatt, Apr 5, 2022, Wayback): "the record 19 billionaires, 7 more than last year".

**CLIP-INSERTS and OPEN QUESTIONS:**
17. L559 (not-clips note): Hassett "(no video, undated)" -> "(the accuracy pass found the video: Bloomberg Open Interest, Oct 2, 2026, around 07:27 of the Bloomberg segment on Yahoo Finance; not proposed, Mike's call in OPEN QUESTIONS 7)" (X3)
18. L634 (OPEN QUESTIONS 7): "reported only by 24/7 Wall St, undated ... If the accuracy pass finds the primary..." -> names the primary (Bloomberg Open Interest, Oct 2, 2026; question at around 06:58 quoting the TIME line, "No, absolutely not." at around 07:27, then "obviously it's a mechanical thing"); the line or a clip insert stays Mike's call. (X3)
19. L637 (OPEN QUESTIONS 10): record-day checklist marks the UK gilt, EU wallet and Forbes items as resolved.

### DATA.md (only proven-wrong facts + the C23 row)
20. L131, Pillar 4 oil shock: "**138.21 on 2026-04-06** (high)" -> "**138.21 on 2026-04-07** (high; corrected at the accuracy pass ...: EIA's weekly table has no price on Monday 2026-04-06, Easter Monday, and FRED DCOILBRENTEU dates 138.21 to 2026-04-07)" (X1)
21. L188, Pillar timeline: "| 2026-04-06 | Brent 138.21 dollars | EIA |" -> "| 2026-04-07 | ..." (X1)
22. L250, section 4 item 6: "right after "Growth will pay it off"" -> "a few answers after "Growth will pay it off" (corrected at the accuracy pass: the TIME transcript has the Fed, Switzerland and "concerned for inflation" exchanges in between)" (X2)
23. L347, CHART-SOURCE INDEX: NEW row **C23** (system-design diagram, the 10-year Treasury at the center -> 30-year mortgage / business loans / stock prices / new government debt, Warsh's quote strip, no data figures, "priced off it" guardrail; sources: Fed press-conference transcript p. 11, CLIP-5, Pillars 2 and 4; build mode **code** (Type 2, static states)).

## 4. Recommendations left for Mike (not applied)

1. **CH1 Beat 5 generalization (W3).** "And when money gets printed into a crisis, the people who already own scarce assets come out the other side richer." Accurate for 2020 to 2021, the episode the next line cites; overreaches as a law (1940s top wealth shares fell). Options: "...tend to come out the other side richer", or keep it as the thesis since the next line anchors it to 2020 and 2021.
2. **Card 11.1 quote (W4).** "'Inflation will also pay off that debt'" -> "'Certain levels of inflation will also pay off that debt'" (exact words, as WARNING box 1 asks). A deck change if taken.
3. **CH4 Beat 4 "Then" (W5).** "Then Treasury Secretary Scott Bessent went on CNBC in September..." -> "And Treasury Secretary Scott Bessent went on CNBC in September..." (the interview preceded the 6B operations).
4. **C23 "Stock prices" node (W6).** Drop it, or never light it on the "goes up" line (the spoken line does not name stocks).
5. **88 percent, full precision (W1, optional).** For the strictest version, card 4.5 and the C1 label could add "outside workplace retirement plans" (the DFA excludes stocks and funds held through DC plans; with them the top-10% share is nearer 81%). The spoken line is already fixed to the Fed's own category.
6. **Hassett (OPEN QUESTIONS 7).** The primary exists (Bloomberg Open Interest, Oct 2, 2026). The suggested CH1 Beat 3 line "His own top economic adviser says that's not the plan." is now sourceable and adds balance after the TIME quote; note he also said "obviously it's a mechanical thing". A clip insert would need its window checked (Whisper) on the Bloomberg video.
7. **CH3 Beat 3 (optional context).** "from around 133 percent to around 116 percent" starts at 2020 Q2, the lockdown quarter when GDP collapsed (end of 2020: 125.6%). Accurate as stated; the fall is partly the GDP rebound, not only inflation.
8. **CH6 Beat 1 (optional context).** The top 0.1% share starts at 2020 Q1 (11.7%), the COVID-crash low (2019 Q4: 12.4%). Accurate as stated.
9. **CH6 verify box, Bitcoin citation.** amount.h's own comment says MAX_MONEY "is *not* the total money supply ... but rather a sanity check"; the 21 million cap comes from the halving schedule (GetBlockSubsidy in validation.cpp). The spoken line is fine; cite both.
10. **C8 UK bar.** If the bar needs a value, use 6.03% intraday (Oct 1, 2026), labelled intraday.
11. **Held clips.** CLIP-2: CNN's caption track reads "print money", which supports Mike's ear check. CLIP-3: the SMU captions read "Like I am the house now. So So when we intervene with the Japanese yen"; let the capture's Whisper pass set the row's words if it is ever approved.
12. **DATA.md, left as is (not wrong facts):** item 9's suggested phrasing "the highest since late 2023" (the screenplay now says "near"); Pillar 1's "a TIME staffer cut in" (the transcript labels the speaker "Cheung", likely the White House's Steven Cheung; not used in the script); the Hassett rows still say secondary / no video (superseded by X3, recorded in this report).

## 5. What I did not check

- **No audio or video was downloaded** (per the brief). CLIP-1 and CLIP-4 windows are unverified here (caption pulls rate-limited, HTTP 429); CLIP-5 and CLIP-6 windows were checked only against caption timing. The capture's `--expect` re-verifies every window.
- **EUR-Lex** (HTTP 202 bot challenges) and **forbes.com / bloomberg.com** (403): the regulation text and those originals were read through official EU pages, Forbes' licensed edition and the Wayback copy, and the Bloomberg segment on Yahoo Finance.
- **Live-drift figures** will move by record day: debt total and daily growth, the 10-year, PMMS (next Thursday Oct 29), CPI (next release mid-November), the average rate (end of October), TIC (next release), Kaspa supply. Re-pull per OPEN QUESTIONS 10.
- **Not in the script, held or do-not-air, so not re-checked:** the SMU event date (Sept 8) for held CLIP-3, the Bloomberg TV "Bessent Tells Yen Traders" headline, Bogachan Ozdemir, the "Bank of Japan insider", quantum, the UK digital ID, the CBDC tracker, IIF 365T, H.4.1 Fed holdings, Ghalibaf's post.
- **Production metadata, not claims:** the header runtime and word-count arithmetic, MUSIC-MOOD-PLAN track data (library.json), budgets, thumbnail and title (opinion).

## 6. Sources (all read 2026-10-26)

- TIME transcript: https://time.com/article/2026/10/01/donald-trump-2026-interview-transcript/
- Treasury fiscaldata APIs (Debt to the Penny; MTS Tables 5 and 9, 2026-09-30; MSPD Tables 1 and 3, 2026-09-30; Average Interest Rates; Buyback Operations): https://api.fiscaldata.treasury.gov/services/api/fiscal_service/
- Treasury daily par yield curve CSVs, 2002 to 2008 and 2023 to 2026: https://home.treasury.gov/resource-center/data-chart-center/interest-rates/daily-treasury-rates.csv/2026/all?type=daily_treasury_yield_curve
- BLS CPI-U API (CUUR0000SA0): https://api.bls.gov/publicAPI/v1/timeseries/data/
- FRED (fredgraph.csv): FYPUGDA188S, FYGFGDQ188S, GFDEGDQ188S, WALCL, M2SL, CBBTCUSD, DCOILBRENTEU, GDP, FYGDP: https://fred.stlouisfed.org/graph/fredgraph.csv?id=WALCL (same pattern per series)
- EIA Europe Brent spot, daily: https://www.eia.gov/dnav/pet/hist/RBRTED.htm
- TIC Table 5: https://ticdata.treasury.gov/resource-center/data-chart-center/tic/Documents/slt_table5.txt
- Freddie Mac PMMS history: https://www.freddiemac.com/pmms/docs/PMMS_history.csv
- Japan MOF JGB yields: https://www.mof.go.jp/english/policy/jgbs/reference/interest_rate/historical/jgbcme_all.csv and .../jgbcme.csv
- Fed Distributional Financial Accounts: https://www.federalreserve.gov/releases/z1/dataviz/download/zips/dfa.zip (dfa-networth-shares.csv, dfa-data-definitions.txt)
- Fed press conference transcript, Sept 16, 2026: https://www.federalreserve.gov/mediacenter/files/FOMCpresconf20260916.pdf
- FOMC statements: https://www.federalreserve.gov/newsevents/pressreleases/monetary20260916a.htm , .../monetary20200315a.htm , .../monetary20220316a.htm ; calendar https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm
- Atlanta Fed, Warsh sworn in: https://www.atlantafed.org/news-and-events/2026/05/22/warsh-sworn-in-as-new-fed-chairman
- Fed History, Treasury-Fed Accord: https://www.federalreservehistory.org/essays/treasury-fed-accord
- BIS Working Paper 363: https://www.bis.org/publ/work363.htm
- CNBC transcript, Sept 21, 2026: https://www.cnbc.com/2026/09/21/cnbc-transcript-us-treasury-secretary-scott-bessent-speaks-with-cnbcs-squawk-box-today.html
- Project Syndicate, Schwab: https://www2.project-syndicate.org/commentary/great-reset-capitalism-covid19-crisis-by-klaus-schwab-2020-06
- EO 14178: https://www.whitehouse.gov/presidential-actions/2025/01/strengthening-american-leadership-in-digital-financial-technology/
- UN SDG 16: https://sdgs.un.org/goals/goal16
- Challenger report, September 2026: https://www.challengergray.com/wp-content/uploads/2026/10/Challenger-Report-September-2026.pdf
- Al Jazeera, Sept 17, 2026: https://www.aljazeera.com/news/2026/9/17/ghalibafs-maths-missile-at-trump-decoded-is-iran-fixing-us-interest-rates
- European Commission, European Digital Identity: https://commission.europa.eu/strategy-and-policy/priorities-2019-2024/europe-fit-digital-age/european-digital-identity_en
- European Parliament press release: https://www.europarl.europa.eu/news/en/press-room/20240223IPR18095/meps-back-the-creation-of-the-european-digital-identity
- European Parliament OEIL summary: https://oeil.europarl.europa.eu/oeil/en/document-summary?id=1778421
- EU Better Internet for Kids, Regulation 2024/1183: https://better-internet-for-kids.europa.eu/en/knowledge-hub/regulation-eu-20241183-european-parliament-and-council-11-april-2024-amending
- Reuters, UK gilts, Oct 1, 2026 (wire copy): https://www.globalbankingandfinance.com/uk-30-year-gilt-yields-surge-highest-since-1998/ ; headline: https://www.tradingview.com/news/reuters.com,2026:newsml_S8N40W0FL:0-uk-30-year-gilt-yields-surge-to-highest-since-1998/
- Forbes 2021 (Forbes Africa, licensed edition): https://www.forbesafrica.com/billionaires/2021/04/06/forbes-35th-annual-worlds-billionaires-list-facts-and-figures-2021
- Forbes 2022 crypto billionaires (Wayback copy of forbes.com): https://web.archive.org/web/2022/https://www.forbes.com/sites/johnhyatt/2022/04/05/the-richest-crypto-and-blockchain-billionaires-in-the-world-2022/
- Bloomberg Open Interest, Hassett, Oct 2, 2026: https://finance.yahoo.com/video/necs-kevin-hassett-sept-jobs-160713872.html (bloomberg.com original 403: https://www.bloomberg.com/news/videos/2026-10-02/nec-s-kevin-hassett-on-sept-jobs-paying-down-us-debt-video)
- NAHB Eye on Housing: https://eyeonhousing.org/2026/01/existing-home-sales-climb-to-near-3-year-high-in-december/
- Scotsman Guide (Truth Social text): https://www.scotsmanguide.com/news/pulte-confirms-fannie-and-freddie-will-buy-200-billion-of-mortgage-bonds/
- api.kaspa.org coin supply: https://api.kaspa.org/info/coinsupply ; Bitcoin Core amount.h: https://raw.githubusercontent.com/bitcoin/bitcoin/master/src/consensus/amount.h
- YouTube Help, keyboard shortcuts: https://support.google.com/youtube/answer/7631406
- YouTube metadata and caption tracks (yt-dlp, skip-download): iflPD2vYrEQ, XcSztxaM77w, ELU3u2Ny7r0, pfVdMWzKwjc, MSTuVBip51A, xTANFw5f664
