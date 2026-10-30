# reset - AS-RECORDED (build the edit to THIS, not the plan)

_Authoritative as-built script, transcribed from the FINAL spine after the full spine-prep chain (defumble, re-cut after Mike's spine review: the "to the American people" fumble cut, the deliberate repeated "very" restored -> cover-blackout, 17 windows -> coarse desilence 700 ms, single zone, first sentence + two close moments protected, +250 ms pad on COVER cuts only -> final two-zone desilence 500 ms CH1 / 700 ms CH2+ @101.40 s (c-coords), the 0:00 burst hand-cut 0.00-0.72, +250 ms pad on COVER cuts only; no separate burst-removal pass). Per longform-edited house rule #6 the edit is cued off THIS, not SCREENPLAY.md. Divergences are listed at the bottom._

_Format change recorded at GATE 1 (Mike, 2026-10-29): NO screen share was recorded. Every chapter is the normal gated-face camera take; the screenplay's CH2 to CH7 `[FACE]` screen-share holds are plain face beats, and its DECK-CARD lines become full-frame card containers. The `SLIDE <n>` direction lines no longer describe the picture._

- **Final spine:** `spine/ALL.d.desilenced.mp4` - 748.20s (12:28), 1080p30 (1920x1080). LOCKED (spine gate approved 2026-10-29 15:24).
- **Transcript (cue source):** `spine/ALL.d.desilenced.medium-words.json` (Whisper medium, word-level, 2,023 words, NOT hand-edited). Human-review breakdown: `spine/ALL.d.desilenced.segments.txt`.
- **Timecode chain:** `raw/ALL.mkv` (the joined take; the two OBS files `2026-10-29 09-36-42.mkv` and `2026-10-29 09-56-07.mkv` sit beside it) -> `ALL.lowbps.mp4` (2658.73 s) -> `ALL.a.defumbled.mp4.spans.json` (lowbps -> a: 75 cut spans, 1117.29 s removed, a = 1541.80 s; cut plan `ALL.a.defumbled.cuts.txt`; the `.v1` files are the superseded first pass) -> `ALL.b.blackout.mp4.cover.json` (a -> b: NO time shift, 17 black-out windows in a-coords) -> `ALL.c.desilenced.map.json` (b -> c: 179 cuts, 794.61 s removed, c = 748.37 s) -> `ALL.d.desilenced.map.json` (c -> d: 4 cuts, 1.25 s removed: c >= 0.72 shifts -0.72 s, >= 34.63 shifts -1.07 s, >= 62.67 shifts -1.19 s, >= 85.07 shifts -1.25 s; every cut is in CH1). **Every timecode below is already a FINAL-spine coordinate (`ALL.d.desilenced.mp4`); the comp cues directly off them.**
- **Spine-prep chain in `spine/`:** `lowbps` -> `a.defumbled` -> `b.blackout` -> `c.desilenced` -> `d.desilenced` (FINAL).

## FACE windows

From `blackdetect` (d=0.3, pix_th=0.10) on the final spine (non-black = FACE). Everything else is BLACK VIDEO and must be covered in the comp. 18 windows, face 175.07 s / cover 574.23 s = **face 23.3% / cover 76.7%** (CH1: face 25.0 s of 100.5 s = 25.1%; CH2 to CH7: face 150.07 s of 648.8 s = 23.0%). CH1 carries 4 windows, the CH1 maximum. Zero orphans: every window lands on a scripted `[FACE]` beat; all 25 scripted `[FACE]` lines are on a window (adjacent face lines run together into one window where the take is continuous, so 25 lines sit in 18 windows); no window lands on a `[COVER]` line. Budget `--face-max 30`: 18.

| # | window (s) | content (as spoken) | scripted beat |
|---|---|---|---|
| 1 | 0.000-10.633 | "So the president of the United States, Trump, of all people, said out loud how 40 trillion dollars in debt gets paid off." | CH1 Beat 1 `[FACE]` (locked) |
| 2 | 30.933-33.567 | "So the debt doesn't shrink, your dollars do" ("so to speak" falls on the cover after it) | CH1 Beat 2 `[FACE]` |
| 3 | 71.633-77.467 | "And that's the reset that I've been pondering. I don't believe it's a matter of if, I just believe it's a matter of when." | CH1 Beat 4 `[FACE]` (+ the ad-lib) |
| 4 | 91.000-96.900 | "And I happen to think that a wave of crypto billionaires will be made next year and the following year." | CH1 Beat 5 `[FACE]` (locked) |
| 5 | 101.533-104.000 | "Let's start with the debt itself. And here's where it stands." | CH2 Beat 1 `[FACE]` |
| 6 | 131.133-137.267 | "And the interest alone was more than a trillion dollars, which is more than the US spent on national defense." | CH2 Beat 2 `[FACE]` |
| 7 | 170.500-179.800 | "So every year, cheap old debt gets swapped for more expensive new debt. And the interest bill keeps climbing. So why not just cancel it, you say?" | CH2 Beat 3 `[FACE]` + CH2 Beat 4 `[FACE]` |
| 8 | 195.200-202.700 | "Cancel this debt and we'd be canceling it on ourselves. But there's a third way out. And America has actually used it before." | CH2 Beat 4 `[FACE]` + CH3 Beat 1 `[FACE]` |
| 9 | 238.967-245.267 | "And today, that same measure is around 98 percent, which is pretty damn close to the record." | CH3 Beat 2 `[FACE]` |
| 10 | 313.633-333.067 | "Inflation doesn't hit people the same way. It moves wealth from the people who save to the people who own. But here's the thing. (...) Just in September, Fed Chair Kevin Warsh explained why that market matters so much." | CH3 Beat 5 `[FACE]` + CH4 Beat 1 `[FACE]` |
| 11 | 371.900-376.667 | "But my read is a little bit simpler. The lenders can do the math on $40 trillion too." | CH4 Beat 2 `[FACE]` |
| 12 | 384.700-392.467 | "The Treasury tried to help too. They stepped up, buying back its long-term bonds from about $2 billion per operation to $6 billion" (cut to cover inside "billion") | CH4 Beat 4 `[FACE]` |
| 13 | 421.900-432.533 | "And to do that again at this size, you really need a reason to do that. Right, so here's the problem with inflating away debt. People actually notice." | CH4 Beat 5 `[FACE]` + CH5 Beat 1 `[FACE]` |
| 14 | 465.067-476.867 | "Crisis as an opportunity, right? So that's the mindset (...) worry about a bit. So what could that crisis be? So here's how it could go." | CH5 Beat 2 `[FACE]` + CH5 Beat 3 `[FACE]` |
| 15 | 568.133-582.233 | "And when all of that is over, the debt is smaller and your savings is smaller. But the people who own assets are a whole lot richer. So now let's take a look at what happened the last time money got printed into a crisis." | CH5 Beat 4 `[FACE]` + CH6 Beat 1 `[FACE]` |
| 16 | 629.400-634.600 | "As you can see, printing into a crisis doesn't make everyone rich. It just makes the owners rich." | CH6 Beat 1 `[FACE]` (second) |
| 17 | 678.267-692.633 | "So here's my bet. If everything plays out the way I think it will, (...) come out the other end very, very, very, very rich." | CH6 Beat 4 `[FACE]` |
| 18 | 719.000-748.200 | "Don't be a saver who gets inflated away. Own the things they can't print. And if you liked this video, (...) Catch you guys later." | CH7 Beat 1 `[FACE]` + CH7 Beat 2 `[FACE]` |

## Whisper mishears to FIX in any captions / on-screen text

One line per correction, wrong -> right, with the timecode. The word-time JSON stays un-edited; this list is re-applied at caption build. Ambiguous words were re-checked with a second, independent Whisper pass (large-v3, in memory, no file written); where the two passes and the transcriber's breakdown disagree, the line says so.

- 12.26 "Time magazine" -> "TIME magazine" (the outlet's own styling; the C3 receipt lower-third reads TIME).
- 135.60 / 183.34 / 305.34 / 327.78 "U.S." -> "US" (the screenplay and deck spelling; captions only).
- 197.92 "ourself" -> "ourselves" (LOW CONFIDENCE: medium p0.59; the large-v3 pass hears "ourselves", the scripted word; confirm by ear at captions).
- 282.82 "Harmon Reinhart" -> "Carmen Reinhart".
- 284.00 "Balan Sabranca" -> "Belen Sbrancia" (two words spoken; the "M." in the transcriber's breakdown was NOT said; the full credit "M. Belen Sbrancia" belongs on screen only, e.g. DECK-CARD 4.4 "Reinhart and Sbrancia, BIS, 2011").
- 397.54 "Bessett" -> "Bessent".
- 429.48 "inflated and weighed debt" -> "inflating away debt" (both Whisper passes put "away" BEFORE "debt": medium "inflated and weighed debt", large-v3 "inflated away debt"; the transcriber's breakdown wrote the scripted order "inflating a debt away", which neither pass supports; confirm by ear).
- 435.94 "Borders" -> "Voters" (medium p0.24; large-v3 hears "boaters"; "Voters" is the scripted word; the transcriber's breakdown wrote "Borrowers", which neither pass supports; confirm by ear).
- 455.30 "Claude Schwab" -> "Klaus Schwab".
- 479.50 "The world war that ran started" -> "The war with Iran started" (MISSED in the transcriber's breakdown; "war" p0.07; the large-v3 pass hears "The war with Iran started on February 28th." A caption reading "world war" would put a false claim on screen).
- 670.52 "Caspa" -> "Kaspa" (persona `kaspa_spelling`).
- 705.68 "going by about" -> "growing by about" (the transcriber's correction, the scripted word; both passes hear "going", medium p0.69; confirm by ear).
- 716.92 "Favor is paid, owner is won." -> "Savers paid, owners won." (large-v3: "Favors paid, owners won.").
- NOT mishears (both passes agree; caption what was said): 141.04 "And Social Security" (script "Add"), 182.18 "owned inside the US" (script "owed"), 302.96 "Whoever owns the asset" (script "assets"), 493.94 "for layoff" (script "layoffs"), 622.66 "11.1%" (script 11.7, see Flags), 708.82 "inflation will pay it off" (no "also", see Flags), 747.68 "Catch you guys later." (no "I'm gonna").

## AS-RECORDED beats (timecodes = FINAL spine)

### CH1 - THE ADMISSION (0.00-100.54) · card OFF · Bed A

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 0.00 | "So the president of the United States, Trump, of all people, said out loud how 40 trillion dollars in debt gets paid off." | CHANGED (locked `[SAY-EXACT]` `[FACE]`, FACE 1: "So" lead-in, "Trump, of all people," added, "40 trillion dollars in debt" for "a 40 trillion dollar debt"); Mike's spine-review rulings RESOLVED: the 0:00 burst cut, the "in debt" stare pause and 400 ms after "gets paid off" kept |
| 11.08 | "His words to TIME magazine, certain levels of inflation will also pay off that debt very rapidly." | KEPT (locked `[SAY-EXACT]` `[COVER]`; the closing repeat "Very rapidly." not said) · guard [!WARNING 1] HELD ("also" said, the exact sentence) |
| 18.60 | "And so here's what that means in plain English." | KEPT ("And so" lead-in) |
| 22.40 | "The debt is a number and that number is written in dollars." | KEPT |
| 26.30 | "Inflation makes every one of those dollars worth a little bit less." | KEPT ("a little bit less" for "less") |
| 30.98 | "So the debt doesn't shrink, your dollars do, so to speak." | KEPT (`[FACE]` Beat 2, FACE 2 ends on "do"; "so to speak" added, on cover) |
| 34.86 | "At least they shrink in their value, just like the debt will shrink in its value." | AD-LIB (not in the script) |
| 40.16 | "Three days after that interview, Trump talked to reporters about the cost of living and he said this." | CHANGED ("Trump" for "the President") |
| 45.82 | (clip insert CLIP-1 lands here; the set-up line ends "...and he said this.") | KEPT · INSERT CLIP-1 (4.0 s, the speaker's own voice; the splice is the trough after "this." 45.82-46.24) |
| 46.24 | "The official number for September came in at 3.7 percent, almost double the Fed's own 2 percent goal." | KEPT · [VERIFY] CPI (next BLS release) |
| 53.78 | "Now, this has been done before, after World War II and again in 2020." | KEPT |
| 60.26 | "But shrinking debt with inflation on purpose typically makes people angry." | CHANGED ("typically" added; "shrinking debt" for "shrinking a debt") |
| 66.36 | "So here's what I think comes next." | KEPT |
| 68.32 | "A crisis where money printing looks like a rescue." | KEPT ("money printing" for "printing money") |
| 71.62 | "And that's the reset that I've been pondering." | CHANGED (`[FACE]` Beat 4, FACE 3: "that I've been pondering" for "I'm warning you about") · guard [!WARNING 4] HELD (no plan stated as fact) |
| 74.00 | "I don't believe it's a matter of if, I just believe it's a matter of when." | AD-LIB (on FACE 3) · guard [!WARNING 4] HELD as first-person belief ("I believe"); the take's strongest framing of the reset |
| 77.52 | "And when money gets printed into a crisis, the people who already own scarce assets come out the other side, even richer." | KEPT ("even" added) |
| 85.38 | "We watched this happen in 2020 and 2021, a record wave of brand new billionaires." | KEPT |
| 91.00 | "And I happen to think that a wave of crypto billionaires will be made next year and the following year." | CHANGED (locked `[SAY-EXACT]` `[FACE]`, FACE 4: "I happen to think that a wave of" for "I think", "and the following year" added) · thesis first person, opinion, HELD |
| 96.96 | (not said) | DROPPED: locked `[SAY-EXACT]` `[COVER]` "The only question is, will you be one of them?" (the thumbnail line; the H2 "WILL YOU BE ONE OF THEM?" card loses its spoken anchor) |
| 97.12 | "So let's see how this will all play out." | CHANGED (the handoff, for "So, let's dive into all this.") |

### CH2 - THE DEBT NOBODY CAN PAY (99.16-198.40) · card ON "THE DEBT NOBODY CAN PAY" · Bed B

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 99.16 | "The debt nobody can pay." | AD-LIB (the chapter title read aloud, on cover under the CH2 card). RESTORED 2026-10-30 (Mike draft note 2): "The debt" (raw 412.76-413.45, level-matched, not enhanced) spliced back at 99.10 (+1.10 s), every later TC shifted |
| 101.62 | "Let's start with the debt itself." | KEPT (`[FACE]` Beat 1, FACE 5; "So" not said) |
| 103.24 | "And here's where it stands." | KEPT (FACE 5 ends on "stands") |
| 104.44 | "The United States owes 40.4 trillion dollars in debt." | KEPT ("in debt" added) · [VERIFY] live total |
| 107.88 | "That's the Treasury's own number." | KEPT |
| 110.24 | "It passed 40 trillion for the first time on August 18th, and it's growing by around 6.7 billion dollars a day." | KEPT · guard [!WARNING 2] HELD (6.7 billion, never 7.3) |
| 118.34 | "In the 2026 budget year, the government took in 5.4 trillion dollars and it spent 7.4 trillion." | KEPT |
| 125.88 | "So it borrowed around 2 trillion." | KEPT |
| 128.04 | "That's around 27 cents of every dollar it spent." | KEPT |
| 131.14 | "And the interest alone was more than a trillion dollars, which is more than the US spent on national defense." | CHANGED (`[FACE]` Beat 2, FACE 6: "more than a trillion dollars" for "1.05 trillion dollars") |
| 137.32 | "Interest takes around 19 cents of every tax dollar." | KEPT · guard [!WARNING 2] HELD (19 cents, never 40) |
| 141.04 | "And Social Security, Medicare, Medicaid, and veterans benefits." | CHANGED ("And" for "Add", both passes hear "And"; said as its own sentence) |
| 145.96 | "And those five eat around 91 cents of every dollar the government collects." | KEPT · guard [!WARNING 2] HELD (91 cents, never "more than every dollar") |
| 150.24 | "Now, here's where it gets tight." | KEPT |
| 151.92 | "Around 10.6 trillion dollars of this debt comes due within a year." | KEPT |
| 156.24 | "That's around one third of everything the government owes in the bond market." | KEPT |
| 159.92 | "And it gets paid off the usual way with new loans." | KEPT |
| 163.40 | "The old debt costs around 3.5 percent on average." | KEPT · [VERIFY] average rate (end of October) |
| 167.86 | "New 10-year loan costs around 5 percent." | KEPT ("A" not heard) · [VERIFY] 10-year |
| 170.60 | "So every year, cheap old debt gets swapped for more expensive new debt." | KEPT (`[FACE]` Beat 3, FACE 7; "more expensive" for "expensive") |
| 175.12 | "And the interest bill keeps climbing." | KEPT (FACE 7) |
| 177.78 | "So why not just cancel it, you say?" | KEPT (`[FACE]` Beat 4, FACE 7; "you say" added) |
| 180.08 | "Because around three quarters of it is owned inside the US." | CHANGED ("owned" for "owed"; both passes hear "owned") |
| 184.04 | "To the Fed, to the Social Security trust funds, to American banks, pension funds, insurance companies, and regular savers." | KEPT |
| 192.10 | "China, you ask?" | KEPT ("you ask" added) |
| 193.90 | "Around 1.5 percent." | KEPT · [VERIFY] next TIC release |
| 195.20 | "Cancel this debt and we'd be canceling it on ourselves." | KEPT (`[FACE]` Beat 4, FACE 8 starts here) |

### CH3 - HOW YOU INFLATE A DEBT AWAY (198.40-319.68) · card OFF · Bed B

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 198.40 | "But there's a third way out." | KEPT (`[FACE]` Beat 1, FACE 8) |
| 200.82 | "And America has actually used it before." | KEPT ("actually" added) |
| 203.12 | "In 1946, right after World War II, the debt held by the public was 106 percent of the whole economy." | KEPT |
| 209.74 | "Still the record." | KEPT |
| 211.58 | "And starting in 1942, the Fed capped the interest rate on long-term government bonds at around 2.5 percent." | KEPT ("around" added) |
| 219.16 | "Then prices took off." | KEPT |
| 220.40 | "In March of 1947, inflation hit 19.7 percent." | KEPT |
| 225.80 | "So if you held those bonds, you earned 2.5 percent a year, while prices went up almost 20 percent." | KEPT |
| 232.38 | "Growth helped too." | KEPT |
| 234.00 | "But by 1974, that debt was down around 22 percent of the economy." | KEPT ("down around" for "down to around") · guard [!WARNING 2] HELD (22, never 23) |
| 238.92 | "And today, that same measure is around 98 percent, which is pretty damn close to the record." | CHANGED (`[FACE]` Beat 2, FACE 9: "which is pretty damn close to the record" for "Close to the record again.") · guard [!WARNING 2] HELD (98 percent, debt held by the public) |
| 245.54 | "So after that, it happened again in 2020." | CHANGED ("So after that," for "Then") |
| 248.96 | "In March of 2020, the Fed cut rates to zero, and they stayed there for two years." | KEPT |
| 255.08 | "Then inflation hit 9.1 percent in June of 2022." | KEPT · guard [!WARNING 2] HELD (in sequence, never at the same time) |
| 259.40 | "And the total debt measured against the economy fell from around 133 percent to around 116 percent by early 2023." | KEPT |
| 267.64 | "Economists have a name for this." | KEPT |
| 269.72 | "Financial repression." | KEPT |
| 271.40 | "Here's how it works." | KEPT |
| 272.58 | "The interest you get paid stays below inflation." | KEPT |
| 275.36 | "So every year, the debt is worth a little less in real money." | KEPT |
| 279.56 | "And so are your savings." | KEPT |
| 281.42 | "Two economists, Carmen Reinhart and Belen Sbrancia, wrote that it works best with a steady dose of inflation." | KEPT |
| 289.38 | "And if that was a bit complex, feel free to go back a few seconds, because I get it." | CHANGED (the rewatch line: "go back a few seconds, because I get it" for "push the J key on your computer to go back and watch that again") |
| 294.42 | "So who pays for it?" | KEPT |
| 296.02 | "The savers." | KEPT |
| 297.28 | "People living on a paycheck." | KEPT |
| 299.14 | "Anyone holding bonds." | KEPT |
| 300.68 | "And who wins?" | KEPT |
| 302.02 | "Whoever owns the asset." | KEPT ("asset" for "assets"; both passes hear the singular) |
| 303.36 | "In America, in the US, the top 10 percent own around 88 percent of stocks and mutual funds." | KEPT ("in the US" restated) · accuracy-pass wording HELD ("stocks and mutual funds", never "all stocks") |
| 310.26 | "The bottom half owns only 0.6 percent." | KEPT ("only" added) |
| 313.72 | "Inflation doesn't hit people the same way." | KEPT (`[FACE]` Beat 5, FACE 10; "people" for "everyone") |
| 315.98 | "It moves wealth from the people who save to the people who own." | KEPT (FACE 10) |

### CH4 - THE BOND MARKET SAYS NO (319.68-427.46) · card OFF · Bed B (PUSH #1)

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 319.68 | "But here's the thing." | KEPT (`[FACE]` Beat 1, FACE 10 continues) |
| 320.58 | "The people lending America this money can see all of this too." | KEPT |
| 324.08 | "And the price they charge gets set in one place." | KEPT |
| 327.06 | "The market for US bonds." | CHANGED ("US bonds" for "US government bonds") |
| 328.50 | "Just in September, Fed Chair Kevin Warsh explained why that market matters so much." | CHANGED ("Just in September, Fed Chair Kevin Warsh" for "In September, the chair of the Fed, Kevin Warsh"); FACE 10 ends 333.067 |
| 333.16 | (clip insert CLIP-5 lands here; the set-up line ends "...why that market matters so much.") | KEPT · INSERT CLIP-5 (13.8 s, the speaker's own voice; the splice is the trough after "much." 333.16-333.36) |
| 333.36 | "Think of it as the price under every other price." | KEPT |
| 336.02 | "When it goes up, mortgages go up." | KEPT |
| 338.64 | "Business loans go up." | KEPT |
| 340.18 | "And the government's own borrowing costs go up." | KEPT |
| 342.76 | "So what do lenders do?" | CHANGED (present tense for "So what did the lenders do?"); PUSH #1 lands here |
| 344.40 | "They ask for more." | CHANGED ("ask" for "asked") |
| 345.96 | "The yield is just the interest rate the government pays to borrow." | KEPT |
| 349.22 | "And on October 5th, the 10-year yield closed at 5.31 percent, the highest since 2002." | KEPT |
| 355.72 | "And it's not just in America." | KEPT |
| 357.68 | "In Britain, the 30-year went above 6 percent for the first time since 1998." | KEPT |
| 362.02 | "In Japan, the 30-year hit a record high." | KEPT |
| 365.30 | "Kevin Warsh gave his own reasons." | KEPT ("Kevin" added) |
| 367.02 | "A strong economy." | KEPT |
| 368.22 | "AI companies are competing for the same money." | KEPT |
| 370.76 | "And geopolitics." | KEPT |
| 372.02 | "But my read is a little bit simpler." | KEPT (`[FACE]` Beat 2, FACE 11; "a little bit" added; Mike's opinion, said as his) |
| 374.10 | "The lenders can do the math on $40 trillion too." | KEPT (FACE 11) |
| 376.74 | (not said) | DROPPED: "and they want to get paid for the inflation they see coming." (the end of the Beat 2 `[FACE]` line) |
| 376.98 | "And that lands on your house." | KEPT ("right" not said) |
| 378.84 | "The average 30-year mortgage is around 7.3 percent, near the highest since late 2023." | KEPT · DATA.md section 4 item 9 HELD · [VERIFY] PMMS |
| 384.74 | "The Treasury tried to help too." | KEPT (`[FACE]` Beat 4, FACE 12) |
| 386.62 | "They stepped up, buying back its long-term bonds from about $2 billion per operation to $6 billion in a market of around $32 trillion." | CHANGED ("They" for "It", "about" added, "its" for "its own"; FACE 12 ends inside "billion", the rest on cover) · guard [!WARNING 2] HELD (2 to 6 per operation, never "2, 4, 6") |
| 395.78 | "Then Treasury Secretary Scott Bessent went on CNBC in September and explained why he raised the size." | KEPT |
| 402.34 | (clip insert CLIP-4 lands here; the set-up line ends "...explained why he raised the size.") | KEPT · INSERT CLIP-4 (12.8 s, the speaker's own voice; the splice is the trough after "size." 402.34-402.74) |
| 402.74 | "That's the man in charge of America's debt telling you he can't set the price." | KEPT ("the price" for "its price") · guard [!WARNING 3] HELD (no "you guys win", no "I am the house now") |
| 407.98 | "Right now, the Fed is going the other way." | KEPT · [VERIFY] FOMC Oct 27 to 28 outcome |
| 410.76 | "In September, it raised rates because inflation is too high." | KEPT ("still" not said) |
| 414.82 | "But in 1942, and again in 2020, when a crisis hit, the Fed stepped in and bought government bonds." | KEPT |
| 422.00 | "And to do that again at this size, you really need a reason to do that." | KEPT (`[FACE]` Beat 5, FACE 13; "you really need a reason to do that" for "you need a reason") |

### CH5 - THE EXCUSE: A RESET (427.46-578.12) · card OFF · Bed B (PUSH #2)

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 427.46 | "Right, so here's the problem with inflating away debt." | KEPT (`[FACE]` Beat 1, FACE 13; "Right, so" lead-in; wording per the Mishears section, confirm by ear) |
| 431.00 | "People actually notice." | KEPT ("actually" added) |
| 432.84 | "Prices go up." | KEPT |
| 434.20 | "Savers get angry." | KEPT |
| 435.94 | "Voters get angry." | KEPT (Whisper "Borders"; see Mishears) |
| 437.72 | "But inflation in the middle of a disaster feels a little bit different." | KEPT ("a little bit" added) |
| 441.64 | "It looks like the cost of a rescue." | KEPT ("a rescue" for "the rescue") |
| 443.86 | "In the 1940s, it was the war." | KEPT · guard [!WARNING 4] HELD ("the cost of winning the war" not said) |
| 446.48 | "In 2020, it was the pandemic." | KEPT |
| 448.76 | "And in June of 2020, in the middle of that crisis, the founder of the World Economic Forum, Klaus Schwab, launched something he called the Great Reset." | KEPT |
| 459.08 | (clip insert CLIP-6 lands here; the set-up line ends "...launched something he called the Great Reset.") | KEPT · INSERT CLIP-6 (13.8 s, the speaker's own voice; the splice is the trough after "Reset." 459.08-459.36) |
| 459.36 | "He was talking about the pandemic." | KEPT |
| 461.68 | "In writing, he called it the rare but narrow window of opportunity." | KEPT ("the" for "a") · guard [!WARNING 4] HELD (Schwab quoted for his own words) |
| 465.36 | "Crisis as an opportunity, right?" | CHANGED (`[FACE]` Beat 2, FACE 14: "right?" tag for "A crisis, as an opportunity.") |
| 468.50 | "So that's the mindset you're going to have to consider here that we're probably going to have to worry about a bit." | CHANGED (for "That's the mindset I'm warning you about.") |
| 473.50 | "So what could that crisis be?" | KEPT (`[FACE]` Beat 3, FACE 14; "that crisis" for "the next crisis") |
| 475.48 | "So here's how it could go." | KEPT |
| 477.08 | "Number one, energy." | KEPT |
| 479.30 | "The war with Iran started on February 28th." | KEPT (Whisper "The world war that ran started"; see Mishears) |
| 482.28 | "The global oil price went from around $71 a barrel to as high as $138." | KEPT |
| 488.34 | "Number two, AI." | KEPT |
| 490.28 | "In 2026, AI is the top reason companies give for layoff." | KEPT ("layoff" as heard by both passes) |
| 494.80 | "Around 120,000 announced job cuts through September." | KEPT · guard [!WARNING 4] HELD (never "millions") |
| 498.62 | "And you'll hear people say that a reset brings digital money and a digital ID." | KEPT |
| 503.54 | "Here's what's actually real." | KEPT |
| 505.00 | "Europe has to offer a digital wallet by the end of 2026." | CHANGED ("a digital wallet" for "a digital ID wallet") · guard [!WARNING 4] HELD (stated precisely) |
| 509.34 | "Using it is voluntary." | KEPT |
| 511.42 | "The UN's 2030 goal is a legal identity for everyone." | KEPT |
| 515.50 | "It says nothing about digital money." | KEPT |
| 517.72 | "And in the US, a January 2025 executive order bans federal agencies from creating a central bank digital currency." | KEPT |
| 526.88 | "And one thing I've noticed, as I've been making this video over the last few days, there have been announcements by the US military, for example, of preparations for a long-term war and power outages and the electrical grid going down." | AD-LIB (the re-done Beat 3's extra lines, PROJECT-LOG retake callout) · NOT in DATA.md, unsourced |
| 541.54 | "The same thing has been going on in Europe and everybody's talking about it." | AD-LIB · unsourced |
| 545.18 | "So I wonder what they have planned." | AD-LIB · guard [!WARNING 4] AT RISK: a question, no plan stated as fact, but the closest line on the take to "the government is planning a crisis" (OPEN for Mike) |
| 547.32 | "There's currently no extreme hostilities with China or Russia." | AD-LIB · unsourced |
| 551.82 | "And Iran certainly can't do any of that." | AD-LIB · Mike's opinion |
| 554.58 | "So it's really curious." | AD-LIB |
| 556.16 | "So here's the scenario that I'm concerned about." | CHANGED ("that I'm concerned about" for "I'm warning you about"); PUSH #2 lands here · guard [!WARNING 4] HELD (a scenario) |
| 558.72 | "The debt gets too big to pay." | KEPT |
| 560.88 | "A crisis hits." | KEPT |
| 562.16 | "The printers turn on to buy the bonds." | KEPT |
| 565.00 | "And then all of that gets called a rescue." | KEPT ("And then all of that" for "And it all") |
| 568.24 | "And when all of that is over, the debt is smaller and your savings is smaller." | KEPT (`[FACE]` Beat 4, FACE 15; "all of that" for "it", "your savings is" for "your savings are") |
| 574.24 | "But the people who own assets are a whole lot richer." | KEPT ("But" for "and", "a whole lot" for "a lot") |

### CH6 - WHERE BILLIONAIRES GET MADE (578.12-702.76) · card OFF · Bed B (PUSH #3)

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 578.12 | "So now let's take a look at what happened the last time money got printed into a crisis." | KEPT (`[FACE]` Beat 1, FACE 15 continues to 582.23; "So now let's take a look" for "Now, let's look") |
| 582.66 | "The Fed's balance sheet, basically everything it bought with brand new money, went from around $4.2 trillion to around $9 trillion, more than double in two years." | KEPT ("around" before "2 years" not said) |
| 593.60 | "The money supply, all the dollars sitting in cash and in bank accounts, grew by 40%." | KEPT ("around" not said) |
| 600.66 | "And in 2021, Forbes counted a record 2,755 billionaires worth $13.1 trillion." | KEPT |
| 611.40 | "A year earlier, that list was worth $8 trillion." | KEPT |
| 615.28 | "Nearly 500 of them were brand new billionaires." | KEPT |
| 618.74 | "And the top 0.1% of Americans went from owning 11.1% of all household wealth to 13.8% in under two years." | CHANGED ("11.1%" SAID for the scripted and sourced 11.7 percent; both passes hear 11.1): fact-framing trap, see Flags |
| 629.52 | "As you can see, printing into a crisis doesn't make everyone rich." | KEPT (`[FACE]` Beat 1 second face line, FACE 16; "As you can see" added) |
| 633.08 | "It just makes the owners rich." | KEPT ("just", "the owners" for "owners") |
| 635.06 | "And crypto?" | KEPT |
| 636.36 | "Bitcoin went from $4,980 in March of 2020 to $67,510 in November of 2021, around a 13.6x." | KEPT ("13.6x" for "13.6 times") |
| 648.30 | "And by 2022, Forbes counted a record 19 crypto billionaires, seven more than the previous year." | KEPT |
| 656.04 | "Here's why." | KEPT |
| 657.20 | "When they print, the dollars multiply." | KEPT |
| 660.04 | "Scarce assets can't." | KEPT |
| 661.96 | "Bitcoin has a hard cap of 21 million coins." | KEPT |
| 665.68 | "It's written right into the code." | KEPT |
| 667.66 | "The Fed has no cap at all." | KEPT |
| 670.24 | "And Kaspa has a max supply of 28.7 billion coins." | CHANGED ("my main holding" and "around" not said) · persona guard (never a recommendation) HELD |
| 674.82 | "And around 97% of them are already mined." | KEPT · [VERIFY] Kaspa supply |
| 678.30 | "So here's my bet." | KEPT (`[FACE]` Beat 4, FACE 17); PUSH #3 lands here |
| 679.42 | "If everything plays out the way I think it will, then the printers are going to turn back on." | CHANGED ("everything" for "this", "are going to turn back on" for "come back on") |
| 684.58 | "And the people who own scarce assets before that happens come out the other end very, very, very, very rich." | CHANGED ("could" not said, "the other end" for "the other side", four "very" for two) · thesis HELD as conditional ("If ... the way I think it will"); Mike's spine-review ruling RESOLVED: the deliberate repeated "very" restored |
| 692.74 | "And that's why I believe there's going to be a huge wave of crypto billionaires starting next year." | CHANGED (for "That's why I believe the next wave of crypto billionaires gets made next year.") · opinion, first person, HELD |
| 697.96 | "And I think the number of crypto billionaires is probably going to multiply dramatically." | AD-LIB · opinion, first person ("I think", "probably"), HELD |

### CH7 - THE CLOSE (702.76-748.20) · card OFF · Bed B (PUSH #3 continues)

| TC | as recorded (the actual words) | vs screenplay |
|---|---|---|
| 702.76 | "So in a nutshell, the debt is over $40 trillion and growing by about $6.7 billion a day." | KEPT ("about" for "around") · [VERIFY] live total and daily growth |
| 708.82 | "The president said inflation will pay it off." | CHANGED ("also" NOT said) · guard [!WARNING 1] BENT: see Divergences and Flags (OPEN) |
| 712.24 | "It's been done before, after World War II, and in 2020." | KEPT |
| 716.92 | "Savers paid, owners won." | KEPT (Whisper "Favor is paid, owner is won.") |
| 719.12 | "Don't be a saver who gets inflated away." | KEPT (`[FACE]` Beat 1, FACE 18; "So" not said, "a saver" for "the saver") |
| 721.94 | "Own the things they can't print." | KEPT · Mike's spine-review ruling RESOLVED: +200 ms after "can't print" |
| 724.00 | "And if you liked this video, I would appreciate it if you hit that like button and subscribe button." | CHANGED (`[FACE]` Beat 2, FACE 18: "hit that like button and subscribe button" for "click that like button and click the subscribe button") |
| 728.60 | "Comment below, let me know what you think." | CHANGED (for "And comment below, tell me, do you think they'll try to inflate this debt away?") |
| 730.30 | "Give me some activity on this video." | AD-LIB |
| 731.82 | "The algorithm loves it." | AD-LIB |
| 733.74 | "Not only that, I do have a wonderful crypto group of like-minded people who invest in assets, like the ones I'm talking about and more." | CHANGED (the community plug; "click the link in the description" NOT said) |
| 742.74 | "And we are well prepared for this coming reset." | AD-LIB · Mike's spine-review ruling RESOLVED: the end gesture between "well prepared" and "coming reset" kept |
| 747.68 | "Catch you guys later." | CHANGED (the sign-off; "I'm gonna" not heard by either pass) · "later." ends 748.16, 0.04 s before the spine end |

## Divergences from SCREENPLAY.md

- **Dropped:**
  - 96.96 CH1 Beat 5, locked `[SAY-EXACT]` "The only question is, will you be one of them?" (the thumbnail line; the H2 card "WILL YOU BE ONE OF THEM?" has no spoken line to land on). OPEN.
  - 376.74 CH4 Beat 2, the end of the `[FACE]` line: "and they want to get paid for the inflation they see coming." OPEN (nothing to build; the beat ends on "too.").
  - 670.24 CH6 Beat 3 "my main holding" (Kaspa). OPEN (no guard broken: no recommendation was said either).
  - 728.60 / 733.74 CH7 Beat 2: "tell me, do you think they'll try to inflate this debt away?" and "click the link in the description" (persona: the community plug sends people to the link in the description; the screenplay's community-link lower-third is the only carrier left). OPEN.
  - 11.08 CH1 Beat 1, the TIME quote's closing repeat "Very rapidly." (the C3 highlight should stop where he stopped). OPEN.
- **Added (ad-libs):** 34.86 "At least they shrink in their value..." · 74.00 "I don't believe it's a matter of if, I just believe it's a matter of when." · 99.16 "The debt nobody can pay." · 526.88 to 555.78 the six-sentence block ("And one thing I've noticed..." to "So it's really curious.") · 697.96 "And I think the number of crypto billionaires is probably going to multiply dramatically." · 730.30 to 733.24 "Give me some activity on this video. The algorithm loves it." · 742.74 "And we are well prepared for this coming reset." Plus tags inside kept lines ("so to speak", "you say", "China, you ask?", "As you can see"). All are ON the approved spine (spine gate 2026-10-29): RESOLVED as kept content. The 526.88 block is the re-done Beat 3's "extra lines" (PROJECT-LOG retake callout, RESOLVED: the spoken aside and the abandoned Beat 4 start were cut at defumble). Its content flags are carried below.
- **Rulings already made (RESOLVED):**
  - GATE 1, Mike 2026-10-29 ("you can proceed ahead"): format change, no screen share; every chapter is a gated-face camera take; DECK-CARD lines become full-frame card containers.
  - Spine review, Mike 2026-10-29: burst at 0:00 cut (d hand cut, c 0.00-0.72) · the "in debt" stare pause + 400 ms after "gets paid off" kept (0.00-10.56 hand-kept) · the "to the American people" fumble cut (not on the spine) · the deliberate repeated "very" restored (689.06 to 692.24, four "very") · +200 ms after "can't print" (723.86) · the end gesture between "well prepared" and "coming reset" kept (743.72 to 747.50) · final silence CH1 500 ms (first sentence hand-kept), CH2+ 700 ms, +250 ms pad on COVER cuts only · MUSIC: the first sentence (0.00-10.56) gets a SUBTLE section of the chosen track, the planned bed starts on the next sentence (11.08).
  - Spine gate approved 2026-10-29 15:24.
- **Guards:**
  - [!WARNING 1] (Trump's exact sentence, "also" kept): HELD at 11.08 (the exact sentence with "also"). BENT at 707.72: the nutshell says "The president said inflation will pay it off." without "also". Not the do-not-air framing ("inflation is the plan", "admits he will inflate the debt away"), but it is not his sentence word for word. OPEN for Mike.
  - [!WARNING 2] (the reference video's wrong numbers): HELD everywhere (6.7 billion a day at 110.24 and 702.76, 19 cents at 137.32, 91 cents at 145.96, around 22 percent at 234.00, around 98 percent at 238.92, zero then 9.1 percent at 248.96 to 255.08, 2 to 6 billion per operation at 386.62). The 1995 home-sales line was not said.
  - [!WARNING 3] (Bessent and Fed misquotes): HELD. "I am the house now", "you guys win", the Fannie Mae and Freddie Mac order and Bogachan Ozdemir were not said.
  - [!WARNING 4] (the reset is a scenario, no conspiracy claim as fact): HELD at 71.62, 74.00 (belief, first person), 443.86 (no "cost of winning the war"), 461.68 (Schwab's own words), 494.80 (not "millions"), 505.00 to 526.36 (digital ID stated precisely), 556.16 (a scenario). Quantum and the "Bank of Japan insider" were not said. AT RISK at 545.18 "So I wonder what they have planned." inside the unsourced 526.88 to 555.78 ad-lib. OPEN for Mike.
  - Mike's thesis as his opinion (DATA.md T7): HELD at 91.00, 678.30 to 702.42 ("I happen to think", "If ... the way I think it will", "I believe", "I think ... probably"); no promise, no price target.
- **Clip inserts (Convention 6):** CLIP-1 set-up line said -> KEPT at 45.82 · CLIP-5 set-up line said -> KEPT at 333.16 · CLIP-4 set-up line said -> KEPT at 402.34 · CLIP-6 set-up line said -> KEPT at 457.98. All four rode through GATE 1 as PROPOSED with the approved screenplay; no per-row ruling is recorded in PROJECT-LOG. CLIP-4's window (12.8 s, or the 17.6 s extended window, SCREENPLAY OPEN QUESTION 4) is OPEN. CLIP-2 and CLIP-3 (HELD) and CLIP-7 (REJECTED) have no set-up line in the script or on the take: nothing to place.

## Flags carried into the edit

- 618.74 fact-framing trap: the VO says "11.1%" for the top 0.1 percent share in 2020; DATA.md (Fed DFA, 2020 Q1) says 11.7 percent. DECK-CARD 9.1 must show "Top 0.1%: 11.7% to 13.8% of US wealth", never the VO's 11.1. The spoken number is not the sourced one: OPEN for Mike.
- 708.82 fact-framing trap: the nutshell VO drops "also"; DECK-CARD 11.1 keeps his words verbatim ("'Inflation will also pay off that debt'") and must not copy the VO.
- 479.30 caption trap: "The war with Iran started on February 28th." (DATA.md: the US and Israel launched the war against Iran on Feb 28, 2026). A caption must never read "world war".
- 526.88 to 555.78 unsourced claims: "announcements by the US military ... of preparations for a long-term war and power outages and the electrical grid going down", "the same thing has been going on in Europe", "no extreme hostilities with China or Russia". None is in DATA.md: no receipt, chart or card may present them as fact. [VERIFY] OPEN for Mike, with the [!WARNING 4] AT RISK line at 544.08.
- 74.00 "not if, but when": the reset framed as his belief; the on-screen layer keeps the scenario framing (C19 header "HOW IT COULD GO (a scenario)").
- 234.00 "down around 22 percent of the economy": the C2 chart shows the 1974 LEVEL, 22.2% of GDP, never a 22-point drop.
- 238.92 vs 258.30: two different measures (debt held by the public around 98 percent; total debt 133 to 116 percent of GDP). No graphic puts them on one axis or compares them.
- 357.68 UK 30-year "above 6 percent": an intraday high (6.029%, Reuters / LSEG); if C8's UK bar carries a number, "6.03% (intraday)".
- 389.64 / 706.32 "about" before a number (persona says "around"): captions follow the audio; every card and graphic uses "around" or the bare figure.
- 104.44 live drift: the VO says "40.4 trillion"; DATA.md's 40,444,342,709,389 is Oct 22, and at around 6.7 billion a day the live total passes 40.45T around Oct 23, so a live C5 capture may round to 40.5T against the VO. [VERIFY] at capture.
- 99.16 "The debt nobody can pay." is a title fragment on cover where the CH2 card "THE DEBT NOBODY CAN PAY" lands.
- 333.16 CLIP-5 splice: FACE 10 ends at 333.067, around 0.09 s before Whisper's end of "much.", so the splice sits right at the face-to-cover edge; the trough to "Think" is 0.20 s. FACE 12 ends at 392.47 inside "$6 billion" (audio continues under the cover).
- 748.16 the last word "later." ends 0.04 s before the spine end (748.20): end-on-the-last-word is met; check the tail of "later." is intact at the draft.
- Push landings as recorded (for the music plan): PUSH #1 342.76 "So what do lenders do?" to 376.74 "...too." · PUSH #2 556.16 "So here's the scenario that I'm concerned about." to 578.02 "...richer." · PUSH #3 678.30 "So here's my bet." to 748.16 "later."
- Captions: no screen share was recorded, so SCREENPLAY OPEN QUESTION 5's screen-share exclusion no longer applies; the CH2 to CH7 face holds over 5 s are now camera holds (FACE 6, 7, 8, 9, 10, 12, 13, 14, 15, 16, 17, 18). Mike's captions ruling is not in PROJECT-LOG: OPEN.
- Enhance Speech: PROJECT-LOG says to prompt Mike to run the final spine through Adobe Podcast Studio Enhance Speech before the edit continues; no record that it ran: OPEN. Any replacement audio must keep the timing identical; the word-time JSON stays the cue source.
- Handoff, CTA and sign-off as said: "So let's see how this will all play out." (a new handoff variant, SCREENPLAY OPEN QUESTION 2), "hit that like button and subscribe button", "Catch you guys later." Captions follow the audio.
- `[VERIFY]` items still open at render: US debt total and daily growth (104.44, 110.24, 702.76) · the 10-year "around 5 percent" (167.86) · the average rate on marketable debt 3.5 percent (163.40, end of October) · China 1.5 percent (193.90, next TIC) · the 30-year mortgage 7.3 percent (378.84, PMMS publishes Thursdays) · CPI 3.7 percent (46.24, next BLS release) · the FOMC meeting of Oct 27 to 28 against "Right now, the Fed is going the other way. In September, it raised rates" (407.98 to 414.48) · Kaspa supply, around 97 percent mined (674.82) · the CLIP-1 and CLIP-4 exact windows (the capture's `--expect`).
- Runtime measured: 748.20 s = 12:28 of spoken spine (2,023 words, around 162 a minute) against the around 12:01 target; plus 44.4 s of the four kept clip inserts (CLIP-4 extended would add 4.8 s) = around 13:12 before card pauses. Per chapter (measured vs screenplay budget): CH1 100.5 s (~95) · CH2 97.9 s (~105) · CH3 122.4 s (~130) · CH4 108.9 s (~140) · CH5 151.8 s (~125) · CH6 125.7 s (~115) · CH7 45.4 s (~50). Measurement only.
