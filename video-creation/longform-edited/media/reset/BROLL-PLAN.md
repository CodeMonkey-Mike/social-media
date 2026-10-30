# reset - BROLL-PLAN (acquisition + build worklists)
_Rendered 2026-10-29 from `COVER-PLAN.json` (the coverage-strategist's proposal, gated by Mike at GATE 3) by `scripts/render_cover_plan.py`. Format owner: `skills/edit-plan-and-cue-sheet/edit-plan-and-cue-sheet.md` §0. Every row is PLACED at the beat named, or marked REJECTED / BENCH: zero orphans. Status ticks are updated by the asset factory as it builds._

**Budget:** Envato video 23/38 · ChatGPT images 8/13. Envato 23/38 (every clip 2.1 to 4.0 s; BR-17 is the one leading-motion clip at 4.7 s, lead:true), ChatGPT 8/13 (every image 2.2 to 3.9 s). Receipts 17 (12 real-site captures incl. the GitHub code page + 5 real market/FRED charts), budget-exempt; containers 34 (5 animated charts, 4 diagrams, 2 timelines, 22 cards, 1 title card). Every non-FACE second from 10.633 to 719.0 is assigned by consecutive cover_beats (99 rows incl. 1 title marker + 4 clip-insert markers): each beat starts at the previous beat's tOut or at a FACE window's end and ends at the next FACE window's start, so there is no gap, no overlap and nothing past 748.20 (719.0 to 748.2 is FACE 18). No asset is used twice: every BR-n / IMG-n / receipt id has exactly one slot; C6, C2, C1 and C17 each return ONCE across a face cut or receipt as a declared continuation / callback (2 spots, under the scatter threshold, typed as chart/diagram states, never a repeated 'deck' slide). The 8 clip lead-in / lead-out rows are comp-derived frames of the captured clips (no build, not in containers[]). Sequencing per rule #13: no container is held under b-roll; every item has its own slot.

## CHAPTER THEMES (the visual differential per chapter, mirroring the music beds; Mike 2026-10-10)

_Each chapter lights its charts, slides, containers and title card with ITS accent (the locked stylesheet is otherwise unchanged; receipts and real marks keep their real pixels), and its ChatGPT images use ITS image style ('house' = the persona look). Envato video is not themed. The builders read the chapter off every row's beat._

| CH | Accent | Image style | Note |
|---|---|---|---|
| CH1 | #C41E3A (red (light-theme token)) | photoreal cinematic, emergency-red rim light, deep charcoal | the on-camera warning: the hook, the reset, the printing press (SCREENPLAY VISUAL-PLAN chapter themes) |
| CH2 | #8F6500 (gold (light-theme token)) | photoreal cinematic, warm natural daylight, clean | the calm explainer on the light deck; matches the deck cards and containers |
| CH3 | #8F6500 (gold (light-theme token)) | photoreal cinematic, warm natural daylight, clean | Bed B continues; same look as CH2 |
| CH4 | #8F6500 (gold (light-theme token)) | photoreal cinematic, warm natural daylight, clean | Bed B continues; same look as CH2 |
| CH5 | #8F6500 (gold (light-theme token)) | photoreal cinematic, warm natural daylight, clean | Bed B continues; same look as CH2 |
| CH6 | #8F6500 (gold (light-theme token)) | photoreal cinematic, warm natural daylight, clean | Bed B continues; Kaspa's greenish cyan only on card 10.3 and the Kaspa coin image |
| CH7 | #8F6500 (gold (light-theme token)) | photoreal cinematic, warm natural daylight, clean | Bed B continues to the last word; no images in CH7 |

## HOLDS before licensing (Mike rules at GATE 3)
- [ ] H2 'WILL YOU BE ONE OF THEM?' (96.9-100.54): the locked spoken anchor was DROPPED on the take, so the card is proposed as a silent question over 'So let's see how this will all play out.' because it is the thumbnail line; cut it if a card with no spoken anchor reads wrong.
- [ ] The 526.88-555.78 ad-lib block (US military preparations, Europe, 'So I wonder what they have planned', China/Russia/Iran) is unsourced and AS-RECORDED marks it OPEN with [!WARNING 4] AT RISK at 544.08: this plan covers it as atmosphere only (5 Envato + 1 text-free image + a map with three country names under a MIKE'S READ eyebrow); nothing on screen states any of it as fact. If Mike cuts the block, the spine is re-cut first and these beats collapse.
- [ ] CLIP-4 window: planned at 12.8 s (15:02.9-15:15.7); the 17.6 s extended window (to 15:20.5, keeps 'I thought that they were moving away.') is Mike's call before capture.
- [ ] CLIP-5 splice at 333.16 sits at the face-to-cover edge with only a 0.20 s trough to 'Think' (AS-RECORDED flag); the graph's snapper dry-run decides. There is no other sentence boundary for that set-up line, so a failure needs a ruling (a shorter freeze, or re-cut the breath), not a re-pick.
- [ ] card-9.1 shows the sourced 11.7% (Fed DFA) while the VO says 11.1% (618.74 fact-framing trap, AS-RECORDED OPEN): confirm the card keeps the sourced figure.
- [ ] card-11.1 keeps the TIME sentence verbatim with 'also' while the nutshell VO drops it (708.82, WARNING 1 BENT, OPEN): confirm.
- [ ] New CHART-SOURCE INDEX rows to append to DATA.md at the plan gate (as C23 was): C24 BLS CPI release (receipt), C25 BIS WP 363 page (receipt), C26 TradingView Brent UKOIL (real chart), C27 Challenger Sept 2026 report page (receipt), C28 FRED WALCL graph (real chart), C29 TradingView BTCUSD (real chart), C30 Bitcoin Core amount.h on GitHub (receipt).
- [ ] Live-drift receipts at capture: C5 Debt to the Penny may read 40.5T against the VO's 40.4T; C16 PMMS is the Thursday value on capture day; C13 is the September statement and the FOMC Oct 27-28 outcome may add a newer one (flagged, never swapped silently); C24 CPI may have an October release by capture day (capture September's archived page).
- [ ] C1 appears twice on purpose (the overview at 271.40 and the rewatch callback at 289.38, its all-lit state); C2, C6 and C17 each return once as a continuation across a face cut or receipt. The comp must type these as chart / diagram states (DIAGRAM_REFS), never as 'deck' slides, so lint_slide_balance sees one full slide per diagram.
- [ ] Chapter themes copied from the SCREENPLAY VISUAL-PLAN (CH1 red #C41E3A, CH2-CH7 gold #8F6500, photoreal cinematic images); SCREENPLAY OPEN QUESTION 6 RESOLVED 2026-10-29: Mike chose PHOTOREAL.
- [ ] Budget used deliberately under the caps (23/38 Envato, 8/13 ChatGPT) to keep containers dominant (rule #2); the plan can absorb more clips and images if Mike wants a denser b-roll layer (candidate slots: the CH1 'done before' timeline, card 2.1, card 5.1, card 9.3).

## Envato video (23) - sourcing via `skills/envato-broll/SKILL.md` (agent: envato-sourcer)

| id | Beat (final spine) | Search query | Dur target | Motion | Status |
|---|---|---|---|---|---|
| BR-1 | CH1@27.38-30.93 | cash changing hands counter close up dollars | 3.60s | any | ☑ sourced: vid/BR-1-dollar-handover.mp4 · https://app.envato.com/search/stock-video/00a2dc42-7602-40a9-8ab5-5a297dc47470 |
| BR-2 | CH1@40.16-42.86 | press briefing room reporters cameras microphones | 2.70s | any | ☑ sourced: vid/BR-2-press-mics.mp4 · https://app.envato.com/search/stock-video/d67db67c-c854-480d-991e-9623645af699 |
| BR-3 | CH1@64.70-68.32 | angry protest crowd shouting street desaturated | 3.60s | any | ☑ sourced: vid/BR-3-protest-megaphone-night.mp4 · https://app.envato.com/search/stock-video/bc21e9e4-e550-4e83-aff3-0a5a822aa058 |
| BR-4 | CH1@77.47-80.10 | money counting machine dollar bills macro | 2.60s | any | ☑ sourced: vid/BR-4-money-counter-macro.mp4 · https://app.envato.com/search/stock-video/caba78e7-b92b-44b1-9d29-bf900c94b658 |
| BR-5 | CH2@149.80-151.92 | trading floor traders screens slow pan | 2.10s | any | ☑ sourced: vid/BR-5-trading-room-dark.mp4 · https://app.envato.com/search/stock-video/2b59a78d-c86b-4064-bf97-a4c22b608578 |
| BR-6 | CH2@159.92-163.40 | US Treasury building Washington exterior | 3.50s | any | ☑ sourced: vid/BR-6-dc-columns-flags.mp4 · https://app.envato.com/search/stock-video/8728d3b7-4945-4648-87f3-1e77b7fab0ff |
| BR-8 | CH3@245.27-248.96 | empty city street lockdown 2020 closed shops | 3.70s | any | ☑ sourced: vid/BR-8-empty-street-2020.mp4 · https://app.envato.com/search/stock-video/1bd42734-c506-4bb5-ab28-a2d46339ef36 |
| BR-9 | CH3@294.42-298.40 | senior couple counting money kitchen table bills worried | 4.00s | any | ☑ sourced: vid/BR-9-couple-counting-cash.mp4 · https://app.envato.com/search/stock-video/5d8db62f-1827-405a-a805-a0e31fa79f31 |
| BR-10 | CH3@303.36-306.24 | stock ticker wall lobby blurred numbers | 2.90s | any | ☑ sourced: vid/BR-10-nyc-market-ticker.mp4 · https://app.envato.com/search/stock-video/a25f56be-d0a6-4ca4-9e7f-ca4dfef8e84c |
| BR-11 | CH4@342.76-345.96 | trading screens red flashing stock crash wall | 3.20s | any | ☑ sourced: vid/BR-11-red-bear-candles.mp4 · https://app.envato.com/search/stock-video/deb637be-fd2c-4d2e-8a1c-2fade21160b1 |
| BR-12 | CH4@376.67-378.84 | for sale sign suburban house front yard | 2.20s | any | ☑ sourced: vid/BR-12-for-sale-sign.mp4 · https://app.envato.com/search/stock-video/b9deb1c8-f90e-417a-8021-91beace2e96d |
| BR-13 | CH5@432.53-435.94 | grocery shopper looking at receipt shocked price tags | 3.40s | any | ☑ sourced: vid/BR-13-grocery-receipt.mp4 · https://app.envato.com/search/stock-video/8f201c74-60f4-43c9-b243-93c7ffe3b74f |
| BR-14 | CH5@476.87-479.30 | oil tanker aerial dusk sea | 2.40s | any | ☑ sourced: vid/BR-14-tanker-dusk-aerial.mp4 · https://app.envato.com/search/stock-video/46eb7759-e80d-4727-bc1e-37f023d26183 |
| BR-15 | CH5@488.34-491.72 | empty office desks cardboard box layoff | 3.40s | any | ☑ sourced: vid/BR-15-layoff-box.mp4 · https://app.envato.com/search/stock-video/e7046c8e-33db-471f-bfb8-2dfb9c91de88 |
| BR-16 | CH5@526.88-530.68 | man laptop desk night news scrolling hands | 3.80s | any | ☑ sourced: vid/BR-16-laptop-night.mp4 · https://app.envato.com/search/stock-video/ff721883-11d0-44bc-9384-a2414f753ac2 |
| BR-17 | CH5@530.68-535.40 | military convoy aerial drone desert road | 4.70s | any | ☑ sourced: vid/BR-17-convoy-lead.mp4 · https://app.envato.com/search/stock-video/00ea756f-ae55-44b2-9a3c-4c91d5d5135e |
| BR-18 | CH5@535.40-538.32 | power lines substation dusk electricity grid | 2.90s | any | ☑ sourced: vid/BR-18-substation-dusk.mp4 · https://app.envato.com/search/stock-video/c2d6b0d3-b9e1-4272-9a37-28fa1cebd158 |
| BR-19 | CH5@541.54-545.18 | Brussels european flags street daylight | 3.60s | any | ☑ sourced: vid/BR-19-eu-flags.mp4 · https://app.envato.com/search/stock-video/29d85d5f-5b54-45b4-b7c5-1270de3ff09b |
| BR-20 | CH5@545.18-547.32 | empty boardroom dark slow dolly | 2.10s | any | ☑ sourced: vid/BR-20-empty-boardroom.mp4 · https://app.envato.com/search/stock-video/652a73e4-e11f-4dc9-81fb-9630b423c98c |
| BR-21 | CH6@615.28-618.74 | private jet runway sunlight slow pan | 3.50s | any | ☑ sourced: vid/BR-21-jet-nose-golden.mp4 · https://app.envato.com/search/stock-video/1e784d6a-ed4b-470b-9704-07cc04a1019a |
| BR-22 | CH6@657.20-661.20 | banknote sheets printing press macro currency | 4.00s | any | ☑ sourced: vid/BR-22-dollar-printing.mp4 · https://app.envato.com/search/stock-video/f0caa4a7-d7b8-4eb5-9aff-a10a73e81e18 |
| BR-23 | CH6@667.66-670.24 | Federal Reserve building Washington exterior | 2.60s | any | ☑ sourced: vid/BR-23-fed-seal-macro.mp4 · https://app.envato.com/search/stock-video/dc1830aa-f741-4112-b8bb-7e747b7a311b |

## ChatGPT images (8) - style THIS VIDEO: PHOTOREAL cinematic (Mike 2026-10-29, overrides the Pixar house style), no text (agent: image-gen)

_Every row whose beat names a REAL thing (token, project, company, person, product) carries a `Reference` path from `schedule-tweets/images/reference/`, or the explicit string `none exists (generic approved)`. Wording: use the REAL mark from the reference image; never invent one._

| id | Beat (final spine) | Prompt concept | Reference | Chapter style | Status |
|---|---|---|---|---|---|
| IMG-1 | CH1@68.32-71.63 | a money printing press running under an emergency-red glow, sheets of banknotes flying off it, photoreal cinematic, deep charcoal background, no text, no readable denominations (CH1 theme) | none exists (generic approved) | photoreal cinematic, emergency-red rim light, deep charcoal | ☐ pending |
| IMG-2 | CH1@80.10-84.00 | a vault door swinging open onto stacked gold bars and glowing coins, red rim light at the door edge, photoreal cinematic, no text, no logos (CH1 theme) | none exists (generic approved) | photoreal cinematic, emergency-red rim light, deep charcoal | ☐ pending |
| IMG-3 | CH3@267.64-271.40 | a glass piggy bank slowly shrinking on a kitchen table under warm window light, photoreal, clean, no text (CH3 theme) | none exists (generic approved) | photoreal cinematic, warm natural daylight, clean | ☐ pending |
| IMG-4 | CH5@441.64-443.86 | a rescue helicopter over a flooded town at golden hour, banknotes fluttering down from it, photoreal cinematic, warm natural light, no text, no logos (CH5 theme) | none exists (generic approved) | photoreal cinematic, warm natural daylight, clean | ☐ pending |
| IMG-5 | CH5@498.62-502.50 | a smartphone on a wooden desk in warm daylight, its screen glowing with an abstract fingerprint-and-shield icon, photoreal, no text, no brand (CH5 theme) | none exists (generic approved) | photoreal cinematic, warm natural daylight, clean | ☐ pending |
| IMG-6 | CH5@538.32-541.54 | a city skyline at blue hour with district after district gone dark, transmission towers in the foreground, one block still lit, photoreal, no text (CH5 theme, warm light at the horizon) | none exists (generic approved) | photoreal cinematic, warm natural daylight, clean | ☐ pending |
| IMG-7 | CH6@670.24-673.72 | a single Kaspa coin showing the backwards-K (mirrored-K) Kaspa logo, glowing greenish-cyan / teal, on a clean light surface in warm daylight, photoreal, no text (CH6 theme; persona kaspa_coin) | schedule-tweets/images/reference/kaspa-logo.png | photoreal cinematic, warm natural daylight, clean | ☐ pending |
| IMG-8 | CH6@692.63-696.58 | a lone figure on a penthouse terrace at dawn, a city below, glowing coins drifting in the sky, photoreal cinematic, warm first light, no text, no identifiable logos on the coins (CH6 theme) | none exists (generic approved) | photoreal cinematic, warm natural daylight, clean | ☐ pending |

## RECEIPTS capture worklist (17) - real-site captures, verified opened (agent: receipt-capturer)

| id | Type | Claim it proves | Capture (URL + exact view) | Beats | Verify at capture | Status |
|---|---|---|---|---|---|---|
| C3 | R(article) | Trump told TIME 'Certain levels of inflation will also pay off that debt very rapidly.' (interview Sept 28, 2026, published Oct 1) | https://time.com/article/2026/10/01/donald-trump-2026-interview-transcript/ ; crop to the exchange (include 'Growth will pay it off' above it if it fits); two crops: wide establish + tight on the sentence; highlight the sentence; lower-third 'TIME interview at the White House, Sept 28, 2026' | CH1@10.63-22.40 | no | ☐ pending |
| C24 | R(article) | CPI-U rose 3.7 percent year over year in September 2026 (BLS) | https://www.bls.gov/news.release/cpi.nr0.htm (September 2026 CPI release summary sentence) ; if superseded by October's release use the archived September page under https://www.bls.gov/news.release/archives/ ; highlight '3.7 percent' | CH1@48.32-53.78 | yes | ☐ pending |
| C5 | R(other) | US total public debt outstanding 40.4 trillion (Treasury Debt to the Penny) | https://fiscaldata.treasury.gov/datasets/debt-to-the-penny/debt-to-the-penny ; the Total Public Debt Outstanding figure + record date; push onto the figure | CH2@104.00-110.24 | yes | ☐ pending |
| C25 | R(other) | Reinhart and Sbrancia (BIS WP 363, 2011): financial repression 'is most successful in liquidating debts when accompanied by a steady dose of inflation' | https://www.bis.org/publ/work363.htm (abstract) ; fallback https://www.bis.org/publ/work363.pdf page 1 ; highlight the sentence | CH3@281.42-289.38 | yes | ☐ pending |
| C9 | R(other) | US 10-year yield closed at 5.31 percent on Oct 5, 2026, the highest since 2002 (real market chart) | https://www.tradingview.com/chart/?symbol=TVC%3AUS10Y ; MONTHLY, Max range (2002 peak and 2026 high both visible) ; two crops: wide, then the 2026 high ; fallback the Treasury par yield curve page | CH4@345.96-355.72 | yes | ☐ pending |
| C16 | R(other) | 30-year fixed mortgage around 7.3 percent, near the highest since late 2023 (Freddie Mac PMMS) | https://www.freddiemac.com/pmms ; the weekly 30-year FRM panel ; push onto the rate (PMMS publishes Thursdays; capture the current value) | CH4@378.84-384.70 | yes | ☐ pending |
| C18 | R(other) | Treasury buyback of Oct 1, 2026: 46.4B offered, 6.0B accepted (per operation, in a 32T market) | https://fiscaldata.treasury.gov/datasets/treasury-securities-buybacks/ ; Buyback Operations table filtered to 2026-10-01 ; push onto the accepted 6.0B ; fallback the TreasuryDirect buyback results announcement 2026-10-01 | CH4@392.47-398.52 | yes | ☐ pending |
| C13 | R(article) | FOMC raised the target range to 3-3/4 to 4 percent on Sept 16, 2026; 'Inflation remains elevated.' | https://www.federalreserve.gov/newsevents/pressreleases/monetary20260916a.htm ; crop to the decision paragraph ; highlight 'raise the target range ... to 3-3/4 to 4 percent' then 'Inflation remains elevated.' | CH4@407.70-414.82 | yes | ☐ pending |
| C10 | R(other) | Schwab, in writing (June 3, 2020): 'the pandemic represents a rare but narrow window of opportunity to reflect, reimagine, and reset our world.' | https://www2.project-syndicate.org/commentary/great-reset-capitalism-covid19-crisis-by-klaus-schwab-2020-06 ; crop to the paragraph ; highlight the sentence (dismiss any cookie / paywall overlay before the shot) | CH5@461.68-465.07 | yes | ☐ pending |
| C26 | R(other) | Brent went from around 71 dollars (Feb 27, 2026) to as high as 138 (Apr 7, 2026) (real market chart) | https://www.tradingview.com/chart/?symbol=TVC%3AUKOIL ; DAILY, 2026-01-01 to today ; two crops: wide, then the April spike ; fallback the EIA Brent daily spot table https://www.eia.gov/dnav/pet/hist/LeafHandler.ashx?n=PET&s=RBRTE&f=D | CH5@479.30-488.34 | yes | ☐ pending |
| C27 | R(other) | AI was cited in 120,136 announced job cuts, Jan to Sep 2026, the leading reason year-to-date (Challenger) | https://www.challengergray.com/wp-content/uploads/2026/10/Challenger-Report-September-2026.pdf ; the AI paragraph ; highlight '120,136 job cut announcements' | CH5@491.72-498.62 | yes | ☐ pending |
| C21 | R(other) | UN SDG target 16.9: 'By 2030, provide legal identity for all, including birth registration' | https://sdgs.un.org/goals/goal16 ; Target 16.9 ; highlight the sentence | CH5@511.42-517.72 | no | ☐ pending |
| C20 | R(other) | EO 14178 (Jan 23, 2025) Sec. 5: agencies prohibited from any action to establish, issue, or promote CBDCs | https://www.whitehouse.gov/presidential-actions/2025/01/strengthening-american-leadership-in-digital-financial-technology/ ; two crops: the header (title + date) for the 3D pan establish, then Sec. 5 tight with the highlight | CH5@517.72-526.88 | no | ☐ pending |
| C28 | R(other) | Fed balance sheet (WALCL) 4.16T (Feb 2020) to 8.97T (Apr 2022) (real FRED chart) | https://fred.stlouisfed.org/series/WALCL ; date range 2019-01-01 to 2022-12-31 ; the graph area cropped to the chart | CH6@582.23-587.00 | yes | ☐ pending |
| C22 | R(other) | Forbes 2021: a record 2,755 billionaires worth 13.1 trillion (8 trillion a year earlier) | https://www.forbes.com/sites/kerryadolan/2021/04/06/forbes-35th-annual-worlds-billionaires-list-facts-and-figures-2021/ ; real-browser capture (403 to scripts) ; the title + opening paragraph ; fallback the Forbes Africa licensed copy | CH6@600.66-607.72 | yes | ☐ pending |
| C29 | R(other) | Bitcoin 4,980 dollars (Mar 12, 2020) to 67,510 (Nov 8, 2021), around 13.6x (real market chart) | https://www.tradingview.com/chart/?symbol=COINBASE%3ABTCUSD ; WEEKLY, 2020-01-01 to 2022-01-31 ; two crops: wide, then the Nov 2021 high ; fallback the FRED CBBTCUSD graph, same range | CH6@634.60-648.30 | yes | ☐ pending |
| C30 | R(other) | Bitcoin's 21 million cap is in consensus code: MAX_MONEY = 21000000 * COIN (Bitcoin Core src/consensus/amount.h) | https://github.com/bitcoin/bitcoin/blob/master/src/consensus/amount.h ; crop to the lines around MAX_MONEY ; highlight the line | CH6@661.20-667.66 | yes | ☐ pending |

## CLIP INSERTS capture worklist (4) - a third-party clip plays with its OWN voice while the spine pauses; audio KEPT, context caption burned, words verified (agent: receipt-capturer; tool + rule: `skills/clip-inserts/clip-inserts.md`)

| id | Who / what plays | Source (URL + window) | Length | Splice at (final spine, after words) | Burned caption | Expect (Whisper) | Verify | Status |
|---|---|---|---|---|---|---|---|---|
| CLIP-1 | Donald Trump, US President, to reporters: We have inflation totally in control, and we've done a great job. | https://www.youtube.com/watch?v=iflPD2vYrEQ 0:30.2-0:34.2 | 4.0s | 0:45.82 after "and he said this." | Donald Trump, speaking to reporters, Oct 1, 2026 | inflation totally in control | yes | ☐ pending |
| CLIP-5 | Kevin Warsh, Fed Chair, FOMC press conference: This is a complicated set of things that are affecting the most important asset anywhere in the world, the 10-year Treasury. It's the risk-free asset upon which | https://www.youtube.com/watch?v=ELU3u2Ny7r0 22:41.6-22:55.4 | 13.8s | 5:33.16 after "why that market matters so much." | Fed Chair Kevin Warsh, Sept 16, 2026 | the 10-year Treasury | yes | ☐ pending |
| CLIP-4 | Scott Bessent, Treasury Secretary, CNBC Squawk Box: I just raised the size because we were in a very illiquid period. The market was moving quickly. As I've said, I can't set the equilibrium price, but markets ar | https://www.youtube.com/watch?v=XcSztxaM77w 15:02.9-15:15.7 | 12.8s | 6:42.34 after "explained why he raised the size." | Scott Bessent on CNBC, Sept 21, 2026 | set the equilibrium price | yes | ☐ pending |
| CLIP-6 | Klaus Schwab, WEF founder, Great Reset launch session: In short, we need a great reset. We have to mobilize all constituents of our global society to work together. We must not miss this unique window of opportunity | https://www.youtube.com/watch?v=pfVdMWzKwjc 8:22.0-8:35.8 | 13.8s | 7:39.08 after "launched something he called the Great Reset." | Klaus Schwab, World Economic Forum, June 3, 2020 | we need a great reset | yes | ☐ pending |

## CHARTS build worklist (13) - Type 1 ANIMATED (code, animates for real) · Type 2 SYSTEM-DESIGN (code-rendered stills) (agent: chart-builder)

| id | Type | What moves / which states | Placement (beats) | Data source | Chapter accent | Status |
|---|---|---|---|---|---|---|
| C4 | Type 1 ANIMATED | Debt ticker count-up 0 to 40,444,342,709,389 dollars (digits spin, lands on 'dollars.' 26.30) + '+6.7B a day'; source line 'Treasury Debt to the Penny' [VERIFY live] | CH1@22.40-27.38 | DATA.md Pillar 2 | #C41E3A (red (light-theme token)) | ☐ pending |
| T1 | Type 2 SYSTEM-DESIGN | 'DONE BEFORE': two nodes on one strip: '1942 to 1951: long rates capped at 2.5%, inflation 19.7% (1947)' lights 56.36; '2020 to 2022: rates at zero, inflation 9.1% (2022)' lights 59.14 | CH1@53.78-60.26 | DATA.md Pillar 3 | #C41E3A (red (light-theme token)) | ☐ pending |
| H5 | Type 1 ANIMATED | eyebrow 2020 TO 2021 / 'A record wave of brand new billionaires' / counter 0 to 493 'newcomers to the Forbes list, a record' (lands 90.26) / 'Forbes, April 2021' | CH1@84.00-91.00 | DATA.md Pillar 6 (Forbes 2021, 493 newcomers) | #C41E3A (red (light-theme token)) | ☐ pending |
| C6 | Type 1 ANIMATED | 'Where every tax dollar went, FY2026': STATE 1 bars grow 'Took in 5.4T' / 'Spent 7.4T'; STATE 2 the gap fills 'Borrowed 2T = 27 cents of every dollar spent'; STATE 3 slice 'Net interest 1.05T = 19 cents'; STATE 4 Social Security 1.67T, Medicare 1.07T, Medicaid 0.72T, Veterans 0.42T stack on, total '4.93T = 91 cents of every dollar collected'; source 'Treasury Final MTS, FY2026' | CH2@118.34-131.13, CH2@137.27-149.80 | DATA.md Pillar 2 (MTS Tables 5 and 9) | #8F6500 (gold (light-theme token)) | ☐ pending |
| C7 | Type 1 ANIMATED | 'Who owns the debt' split bar: STATE 1 'Inside the US 77%' vs 'Foreign 23%'; STATE 2 the 77% breaks into 'The Fed 11%', 'Social Security and other trust funds 19%', 'US banks, pension funds, insurers, households' (each lights as named); STATE 3 'China 1.5%' sliver lights in the foreign segment [VERIFY next TIC] | CH2@179.80-195.20 | DATA.md Pillar 2 (TIC, H.4.1, Debt to the Penny) | #8F6500 (gold (light-theme token)) | ☐ pending |
| C2 | Type 1 ANIMATED | 'The WWII playbook' line chart, debt held by the public % of GDP 1946 to 1974: STATE 1 axes + the 1946 point '106.3%' + 'still the record'; STATE 2 band 'Long-term rates capped at 2.5% (1942 to 1951)'; STATE 3 marker 'Inflation +19.7% (March 1947)'; STATE 4 the line draws down to the 1974 point '22.2%' (a LEVEL, never a 22-point drop) | CH3@205.80-225.80, CH3@232.26-238.97 | DATA.md Pillar 3 (FRED FYPUGDA188S, Fed History, BLS) | #8F6500 (gold (light-theme token)) | ☐ pending |
| T2 | Type 2 SYSTEM-DESIGN | 'THE 2020 RERUN' four nodes lit as named: 'March 2020: rates to zero' (251.86) -> 'March 2022: first hike, two years at zero' (253.88) -> 'June 2022: inflation 9.1%' (255.90) -> 'Total debt 133% to 116% of GDP (2020 Q2 to 2023 Q1)' (262.62 to 264.86) | CH3@248.96-267.64 | DATA.md Pillar 3 (FOMC statements, BLS, FRED GFDEGDQ188S) | #8F6500 (gold (light-theme token)) | ☐ pending |
| C1 | Type 2 SYSTEM-DESIGN | 'How a debt gets inflated away': 'Government debt 40.4T' -> 'Rates held under inflation (1942: 2.5% cap · 2020: zero)' -> 'Real value of the debt shrinks' -> split 'Who pays: savers · wage earners · bondholders' / 'Who wins: asset owners (top 10% own 88% of stocks)'. STATES: all dim (271.40); rates node lit (274.12); real-value node lit (277.90); who-pays node lit (280.50); ALL LIT (the rewatch callback 289.38) | CH3@271.40-281.42, CH3@289.38-294.42 | DATA.md CHART-SOURCE INDEX C1 | #8F6500 (gold (light-theme token)) | ☐ pending |
| C23 | Type 2 SYSTEM-DESIGN | 'The price under every price': center '10-year Treasury', arrows to '30-year mortgage' (337.38), 'Business loans' (338.64), 'New government debt' (340.48) lighting as named; 'Stock prices' stays dim; quote strip 'the most important asset anywhere in the world' (Warsh, Sept 16, 2026); no figures | CH4@336.02-342.76 | DATA.md CHART-SOURCE INDEX C23 | #8F6500 (gold (light-theme token)) | ☐ pending |
| C8 | Type 1 ANIMATED | 'The lenders say no' bars growing in turn: 'US 10-year 5.31% (highest since 2002)' up at 355.72; 'UK 30-year 6.03% intraday (first above 6% since 1998)' grows 359.12; 'Japan 30-year 4.168% (a record)' grows 364.14; source line Treasury par curve · Reuters/LSEG · Japan MOF | CH4@355.72-365.30 | DATA.md Pillar 4 | #8F6500 (gold (light-theme token)) | ☐ pending |
| MAP | Type 2 SYSTEM-DESIGN | eyebrow MIKE'S READ over a flat world map with three labelled nodes only: 'China' (549.74), 'Russia' (550.68), 'Iran' (552.24); no other text, no claim text | CH5@547.32-555.78 | country labels only (the 526.88 to 555.78 ad-lib is unsourced; nothing on it states a claim) | #8F6500 (gold (light-theme token)) | ☐ pending |
| C19 | Type 2 SYSTEM-DESIGN | 'HOW IT COULD GO (a scenario)' loop: all dim at 556.16; 'Debt too big to pay' (558.72) -> 'A crisis hits (energy · AI jobs)' (560.88) -> 'Printing to buy the bonds' (562.16, tags '1940s', '2020') -> 'Called a rescue' (565.00); 'Debt smaller · savings smaller · asset owners richer' stays dim | CH5@555.78-568.13 | DATA.md CHART-SOURCE INDEX C19 | #8F6500 (gold (light-theme token)) | ☐ pending |
| C17 | Type 1 ANIMATED | 'Printing into a crisis' count-ups: STATE 1 'Fed balance sheet' 4.16T to 8.97T (lands 589.54) + 'more than double, Feb 2020 to Apr 2022'; STATE 2 'Money supply (M2)' 0 to +40.6% (lands 599.16); STATE 3 'Billionaire wealth' 8T to 13.1T (lands 608.36 to 610.02) + '2,755 billionaires, a record (Forbes 2021)', '8T (2020 list)' called out at 611.40 | CH6@587.00-600.66, CH6@607.72-615.28 | DATA.md Pillar 6 (FRED WALCL, FRED M2SL, Forbes 2021) | #8F6500 (gold (light-theme token)) | ☐ pending |

## SLIDES build worklist (21) - TITLE SLIDES (no box) and CARD SLIDES (rounded card), locked stylesheet `skills/container-reference/container-canonical.css` (agent: slide-builder)

| id | Slide type | Eyebrow / headline / content | Placement (beats) | Chapter accent | Status |
|---|---|---|---|---|---|
| H4 | CARD SLIDE | eyebrow IN PLAIN ENGLISH / headline 'Same dollars. Less VALUE.' / two bars 'Your dollars' and 'The debt' shrinking together (no numbers); CH1 red accent | CH1@33.57-40.16 | #C41E3A (red (light-theme token)) | ☐ pending |
| H3 | CARD SLIDE | full-frame motion-type card 'ON PURPOSE?' (text only, CH1 red accent, slams in at 62.76) | CH1@60.26-64.70 | #C41E3A (red (light-theme token)) | ☐ pending |
| H2 | CARD SLIDE | full-frame motion-type card 'WILL YOU BE ONE OF THEM?' (the thumbnail line, text only, CH1 red accent) | CH1@96.90-100.54 | #C41E3A (red (light-theme token)) | ☐ pending |
| title-CH2 | TITLE SLIDE | THE DEBT NOBODY CAN PAY (the video's only title card; Bed B starts; holds 1.0 s past the pause under 'Nobody can pay.') | CH2@100.54, CH2@100.54-101.53 | #8F6500 (gold (light-theme token)) | ☐ pending |
| card-1.1+1.2 | CARD SLIDE | ONE deck card, two lines lighting in turn: 'Passed 40T / August 18, 2026' (110.24) then '+6.7B a day' (114.24) [VERIFY daily growth] | CH2@110.24-118.34 | #8F6500 (gold (light-theme token)) | ☐ pending |
| card-2.1 | CARD SLIDE | '10.6T comes due within 12 months' (151.92) / '1 of every 3 dollars' (156.24) | CH2@151.92-159.92 | #8F6500 (gold (light-theme token)) | ☐ pending |
| card-2.2 | CARD SLIDE | 'Old debt: 3.5% average' (163.40) / 'New 10-year: 5.0%' (167.86) [VERIFY both] | CH2@163.40-170.50 | #8F6500 (gold (light-theme token)) | ☐ pending |
| card-3.1 | CARD SLIDE | 'Bonds paid: 2.5%' (225.80) / 'Prices rose: 19.7%' (229.78) | CH3@225.80-232.26 | #8F6500 (gold (light-theme token)) | ☐ pending |
| C1-breakout | CARD SLIDE | 'WHO PAYS / WHO WINS': left list 'Savers · People on a paycheck · Bondholders' ('Bondholders' lights 299.14) / right node 'Asset owners' lights 300.84 | CH3@298.40-303.36 | #8F6500 (gold (light-theme token)) | ☐ pending |
| card-4.5 | CARD SLIDE | 'Top 10%: 88% of stocks and funds' (306.24) / 'Bottom 50%: 0.6%' (310.26) | CH3@306.24-313.63 | #8F6500 (gold (light-theme token)) | ☐ pending |
| card-5.1 | CARD SLIDE | 'Warsh's 3 reasons' / 'Strong economy' (367.20) · 'Competition for capital' (368.22) · 'Geopolitics' (371.04) | CH4@365.30-371.90 | #8F6500 (gold (light-theme token)) | ☐ pending |
| card-6.2 | CARD SLIDE | '1942: the Fed holds the 2.5% cap' (415.34) / '2020: the Fed buys at least 500B of Treasuries' (417.18) | CH4@414.82-421.90 | #8F6500 (gold (light-theme token)) | ☐ pending |
| card-7.3 | CARD SLIDE | 'Inflation on purpose: people get angry' | CH5@435.94-441.64 | #8F6500 (gold (light-theme token)) | ☐ pending |
| card-7.1 | CARD SLIDE | '1940s: the war' (443.86) / '2020: the pandemic' (446.48) | CH5@443.86-448.76 | #8F6500 (gold (light-theme token)) | ☐ pending |
| card-7.2 | CARD SLIDE | 'June 3, 2020' / 'The World Economic Forum launches the Great Reset' (second line lights 453.56) | CH5@448.76-455.04 | #8F6500 (gold (light-theme token)) | ☐ pending |
| card-8.3 | CARD SLIDE | eyebrow WHAT'S ACTUALLY REAL (from 502.50, body dim) / 'EU: a digital ID wallet by the end of 2026' (505.00) / 'Voluntary to use' (510.22) | CH5@502.50-511.42 | #8F6500 (gold (light-theme token)) | ☐ pending |
| card-9.1 | CARD SLIDE | ANIMATED: 'Top 0.1%: 11.7% to 13.8% of US wealth' (the figure counts 11.7 to 13.8 at 626.42 to 627.54) / '2020 to 2021'; shows the SOURCED 11.7, never the VO's 11.1 | CH6@618.74-629.40 | #8F6500 (gold (light-theme token)) | ☐ pending |
| card-9.3 | CARD SLIDE | 'Crypto billionaires: 19, a record' (651.26) / 'Forbes 2022' | CH6@648.30-657.20 | #8F6500 (gold (light-theme token)) | ☐ pending |
| card-10.3 | CARD SLIDE | 'Kaspa: 28.7B max supply' / 'Around 97% already mined' (Kaspa greenish cyan accent on this card only) [VERIFY live] | CH6@673.72-678.27 | #8F6500 (gold (light-theme token)) | ☐ pending |
| card-10.4 | CARD SLIDE | 'My bet: crypto billionaires get made next year' | CH6@696.58-702.76 | #8F6500 (gold (light-theme token)) | ☐ pending |
| card-11.1 | CARD SLIDE | the nutshell, four lines lighting one per sentence: '40T+ and growing 6.7B a day' (703.26) / the quote line 'Inflation will also pay off that debt' (708.82, verbatim with 'also') / 'Done before: the 1940s and 2020' (712.24) / 'Savers paid. Owners won.' (716.92) [VERIFY live total] | CH7@702.76-719.00 | #8F6500 (gold (light-theme token)) | ☐ pending |

## Bench (swap-ins if a primary fails)

- CH1 0:10.63-0:22.40: a code quote card with the exact sentence + 'TIME, Oct 1, 2026' (never a restyle of the page)
- CH1 0:22.40-0:27.38: card-1.1+1.2 brought forward (CH2 then uses the C5 receipt alone)
- CH1 0:27.38-0:30.93: envato 'dollar bills counting hands macro'
- CH1 0:33.57-0:40.16: IMG: a photoreal stack of dollar bills shrinking under red rim light (text-free) for 3.9 s, then the card
- CH1 0:40.16-0:42.86: envato 'press conference microphones podium'
- CH1 0:42.86-0:45.82: BR-2 extended to 45.82 (4.6 s, over the cap, only if the capture fails)
- CH1 0:45.82-0:45.82: none (a failed capture is reported, never trimmed into meaning)
- CH1 0:45.82-0:48.32: cut straight to C24 at 45.82
- CH1 0:48.32-0:53.78: H1 code stat card (CH1 red): 'Inflation, September 2026: 3.7%' / 'The Fed's goal: 2%' (BLS CPI-U; FOMC Sept 16, 2026)
- CH1 0:53.78-1:00.26: BR: archival 1940s street (1.6 s) then empty 2020 street (1.8 s); those two clips are placed in CH3 instead
- CH1 1:00.26-1:04.70: BR: a hand turning a dial
- CH1 1:04.70-1:08.32: envato 'crowd protest fists raised'
- CH1 1:08.32-1:11.63: BR: printing press rollers macro (would sit close to BR-22 in CH6; prefer the image)
- CH1 1:17.47-1:20.10: envato 'banknotes stack fanning'
- CH1 1:20.10-1:24.00: BR: gold bars stacked in a vault
- CH1 1:24.00-1:31.00: BR: penthouse terrace city skyline at night, slow push-in (lead, up to 5 s)
- CH1 1:36.90-1:40.54: a plain CH1-red atmosphere plate with the Kaspa K bug
- CH2 1:40.54-1:40.54: none
- CH2 1:40.54-1:41.53: none
- CH2 1:44.00-1:50.24: a code card with the Debt to the Penny figure + record date (never a restyle of the page)
- CH2 1:50.24-1:58.34: cards 1.1 and 1.2 as two separate cards (4.0 s + 4.1 s)
- CH2 1:58.34-2:11.13: cards 1.3 then 1.4
- CH2 2:17.27-2:29.80: card 1.6
- CH2 2:29.80-2:31.92: envato 'stock exchange floor busy'
- CH2 2:31.92-2:39.92: an animated split bar (10.6T of 31.8T) by chart-builder
- CH2 2:39.92-2:43.40: envato 'Washington DC government building columns'
- CH2 2:43.40-2:50.50: C9 real chart brought forward (then CH4 uses C8 alone)
- CH2 2:59.80-3:15.20: cards 2.3, 2.4, 2.5 in sequence
- CH3 3:22.70-3:25.80: envato 'vintage 1940s newsreel street'
- CH3 3:25.80-3:45.80: cards 3.3 then 3.1
- CH3 3:45.80-3:52.26: BR: vintage war bond poster (verify rights)
- CH3 3:52.26-3:58.97: card 3.3 '1946: 106% of GDP / 1974: 22%'
- CH3 4:05.27-4:08.96: envato 'deserted downtown pandemic'
- CH3 4:08.96-4:27.64: cards 4.1, 4.2, 4.3 in sequence
- CH3 4:27.64-4:31.40: BR: coins draining from a jar
- CH3 4:31.40-4:41.42: none (the chapter's anchor; if late, T2 holds and the C1-breakout card carries the point)
- CH3 4:41.42-4:49.38: card 4.4 (the quote card: 'Most successful ... when accompanied by a steady dose of inflation.' / 'Reinhart and Sbrancia, BIS, 2011')
- CH3 4:49.38-4:54.42: T2 timeline callback (its all-lit state)
- CH3 4:54.42-4:58.40: envato 'retired couple budgeting paperwork'
- CH3 4:58.40-5:03.36: card 4.5 brought forward with a 'who pays' eyebrow
- CH3 5:03.36-5:06.24: envato 'stock market display board motion blur'
- CH3 5:06.24-5:13.63: an animated split bar 'who owns the stocks' (88.1% vs 0.6%) by chart-builder (a new index row)
- CH4 5:33.07-5:33.16: none
- CH4 5:33.16-5:33.16: none
- CH4 5:33.16-5:36.02: cut straight to C23 at 333.16
- CH4 5:36.02-5:42.76: a three-line card 'Mortgages · Business loans · Government borrowing' lighting in turn
- CH4 5:42.76-5:45.96: envato 'red stock market charts falling screens'
- CH4 5:45.96-5:55.72: C8 brought forward to 345.96 with the US bar landing first (then the UK and Japan bars at 359.12 and 363.78)
- CH4 5:55.72-6:05.30: card 5.2 + two deck-style cards for the UK and Japan
- CH4 6:05.30-6:11.90: a three-item list card built fresh
- CH4 6:16.67-6:18.84: envato 'suburban home exterior realtor sign'
- CH4 6:18.84-6:24.70: card 5.3 '30-year mortgage: around 7.3%'
- CH4 6:32.47-6:38.52: card 6.3 'Buybacks: 2B to 6B per operation / In a market of around 32T'
- CH4 6:38.52-6:42.34: C18 held to 402.34 (only if the capture fails)
- CH4 6:42.34-6:42.34: none
- CH4 6:42.34-6:47.70: card 6.1 ('I can't set the equilibrium price.' / Scott Bessent, Sept 21, 2026)
- CH4 6:47.70-6:54.82: a code quote card with the statement's sentence + 'FOMC, Sept 16, 2026'
- CH4 6:54.82-7:01.90: a fresh two-line card with the same wording
- CH5 7:12.53-7:15.94: envato 'supermarket aisle price labels close up'
- CH5 7:15.94-7:21.64: BR: a ballot box / polling line (for 'voters')
- CH5 7:21.64-7:23.86: BR: rescue helicopter hovering (no banknotes)
- CH5 7:23.86-7:28.76: card 7.4 'Inflation in a disaster: looks like a rescue' with the two precedents as sub-lines
- CH5 7:28.76-7:35.04: C10 brought forward (then the receipt beat after the clip uses card 7.2)
- CH5 7:35.04-7:39.08: card 7.2 held to 459.08 (only if the capture fails)
- CH5 7:39.08-7:39.08: none
- CH5 7:39.08-7:41.68: cut straight to C10 at 459.08
- CH5 7:41.68-7:45.07: a code quote card with the sentence + 'Klaus Schwab, Project Syndicate, June 3, 2020'
- CH5 7:56.87-7:59.30: envato 'oil refinery flare night'
- CH5 7:59.30-8:08.34: card 8.1 'Brent oil: 71 to 138 / Feb 27 to Apr 7, 2026'
- CH5 8:08.34-8:11.72: envato 'office worker packing box leaving'
- CH5 8:11.72-8:18.62: card 8.2 'AI: the top reason for layoffs in 2026 / 120,136 announced cuts, January to September'
- CH5 8:18.62-8:22.50: BR: a phone unlocking with face recognition (no brand)
- CH5 8:22.50-8:31.42: receipt: the European Commission's European Digital Identity page ('by the end of 2026') + the Parliament press release ('voluntary basis')
- CH5 8:31.42-8:37.72: card 8.4 'UN 2030: legal identity, not digital money'
- CH5 8:37.72-8:46.88: card 8.5 'US: agencies barred from creating a CBDC (EO 14178, 2025)'
- CH5 8:46.88-8:50.68: envato 'late night office laptop glow'
- CH5 8:50.68-8:55.40: envato 'soldiers marching drill generic'
- CH5 8:55.40-8:58.32: envato 'electrical transformer station sunset'
- CH5 8:58.32-9:01.54: BR: city blackout time-lapse
- CH5 9:01.54-9:05.18: envato 'european city square crowd'
- CH5 9:05.18-9:07.32: envato 'empty conference room moody'
- CH5 9:07.32-9:15.78: three Envato skyline cuts (Shanghai, Moscow, Tehran) at around 2.3 s each
- CH5 9:15.78-9:28.13: a four-line card lighting in turn
- CH6 9:42.23-9:47.00: C17 state 1 starts at 582.233 instead (the count-up runs longer)
- CH6 9:47.00-10:00.66: card 9.4 'Fed balance sheet: 4.2T to 9T / Money supply: +40.6%'
- CH6 10:00.66-10:07.72: C17 state 3 starts at 600.66 instead
- CH6 10:07.72-10:15.28: a deck-style card '2,755 billionaires worth 13.1T / 8T a year earlier'
- CH6 10:15.28-10:18.74: envato 'luxury yacht marina aerial'
- CH6 10:18.74-10:29.40: real chart: the Fed DFA 'share of net worth, top 0.1%' chart page (federalreserve.gov/releases/z1/dataviz/dfa/distribute/chart/), verify
- CH6 10:34.60-10:48.30: card 9.2 'Bitcoin: 4,980 to 67,510 / March 2020 to November 2021'
- CH6 10:48.30-10:57.20: receipt: the forbes.com 2022 crypto billionaires article (John Hyatt, Apr 5, 2022; browser capture; never name individuals on screen)
- CH6 10:57.20-11:01.20: envato 'money printing machine close up'
- CH6 11:01.20-11:07.66: card 10.1 'Bitcoin: 21,000,000 / A hard cap, written in the code'
- CH6 11:07.66-11:10.24: card 10.2 'The Fed: no cap'
- CH6 11:10.24-11:13.72: the Kaspa K logo plate on the light deck bg
- CH6 11:13.72-11:18.27: receipt: a Kaspa explorer supply panel (kas.fyi or explorer.kaspa.org) showing max and circulating supply
- CH6 11:32.63-11:36.58: BR: city skyline at dawn from a rooftop, slow push (lead)
- CH6 11:36.58-11:42.76: a motion-type card 'MY BET' (text only)
- CH7 11:42.76-11:59.00: a fresh four-line nutshell card with the same wording

