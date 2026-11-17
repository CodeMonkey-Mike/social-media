# pieverse: slide state cues

Times are on the FINAL spine (`spine/ALL.d.enhanced.mp4`), taken from COVER-PLAN.json (cover_beats + face_body), before any
card-pause shift. Each state is a hard swap: shared elements are pixel-identical inside one id, so a swap reads as the row
landing. Resting rows stay muted but readable (the spotlight adds emphasis, it never toggles visibility); a line that lands
later (a footer, a tag, a punchline) is laid out in every state and only becomes visible on its state. The last state of
each run holds to the end of its beat.

Theme: DARK, stylesheet default (container-canonical.css pasted verbatim, no light or accent file, no chapter_themes).
Lit colour = cyan. Accent meaning: green = live / published, gold = a caveat or a gap (custody, deferred, not published,
the share of supply that voted). Source + driver: `build_slides.py` (re-run `python build_slides.py [id ...]`), HTML
`containers.html` (one standalone 1920x1080 frame per state).

D9 also plays in the F2 screen share (19.189 to 28.555), scaled by the comp into the 1464x1080 deck area (house rule #1b);
it is built once at 1920x1080 and continues full frame at 28.555.

| File | Folder | From (s) | Cue | Shows |
|---|---|---|---|---|
| title-CH2 | title-slides | 35.20 | card pause (silent) | CHAPTER 2 / What it is |
| title-CH3 | title-slides | 115.56 | card pause (silent) | CHAPTER 3 / What's real |
| title-CH4 | title-slides | 151.56 | card pause (silent) | CHAPTER 4 / The token |
| title-CH5 | title-slides | 319.98 | card pause (silent) | CHAPTER 5 / Who's behind it |
| D1 | card-slides | 9.689 | beat start (F1 edge) | home page line "Web3 AI Agent for Line & Kakao", three pieces at rest |
| D1-s1 | card-slides | 12.36 | "rent an agent" | AI AGENT lit |
| D1-s2 | card-slides | 13.80 | "its own crypto wallet" | ITS OWN WALLET lit |
| D1-s3 | card-slides | 16.48 | "inside an app" | INSIDE YOUR CHAT APP lit (held to 19.189) |
| D9 | card-slides | 19.189 | "And look at this" (F2 deck area) | snapshot, five rows and the date at rest |
| D9-s1 | card-slides | 20.66 | "at the time of this recording" | read date 14 NOV 2026 lit |
| D9-s2 | card-slides | 22.84 | "1.78" | price lit |
| D9-s3 | card-slides | 25.48 | "fully diluted value" | FDV 1.78B lit, price dims; full frame from 28.555 |
| D9-s4 | card-slides | 32.62 | "piece by piece" line | all five lit (held to 35.20) |
| D2 | card-slides | 35.20 | after title-CH2 | three document slots at rest |
| D2-s1 | card-slides | 38.46 | "Its litepaper" | LITEPAPER lit (title, invoices and receipts) |
| D2-s2 | card-slides | 44.64 | "TimeFi" | + TimeFi tag lit gold |
| D2-s3 | card-slides | 46.28 | "Then the whitepaper" | WHITEPAPER (10 Nov 2025) lit, litepaper rests |
| D2-s4 | card-slides | 51.96 | "And the homepage" | HOME PAGE lit |
| D2-s5 | card-slides | 56.04 | "So that's" (join: may sit 0.3 s late) | all three lit |
| D2-s6 | card-slides | 56.96 | "three framings" | + footer "3 framings, around 12 months" (held to 59.64) |
| D17 | card-slides | 77.70 | "One caveat" | custody quote |
| D17-s1 | card-slides | 79.56 | "keys sit inside" | "seed phrase custody" highlighted gold |
| D17-s2 | card-slides | 82.36 | "not with you" | + THE KEYS: NOT WITH YOU (held to 83.22) |
| D4 | card-slides | 98.98 | "and that part is documented" | llms.txt quote |
| D4-s1 | card-slides | 103.78 | "deferred" | "deferred" highlighted gold, the marker cut to the word (held to 104.522) |
| D18 | card-slides | 108.722 | beat start (F3 edge) | token jobs at rest, ACCESS dim |
| D18-s1 | card-slides | 110.80 | "governance" | GOVERNANCE lit |
| D18-s2 | card-slides | 111.64 | "staking" | STAKING lit |
| D18-s3 | card-slides | 112.08 | "discount fees" | FEE DISCOUNTS lit |
| D18-s4 | card-slides | 113.24 | "priced in US dollars" | Plans priced in USD lit (held to 115.56) |
| D5 | card-slides | 115.56 | after title-CH3 | both halves at rest: WHAT IT PUBLISHES (green header), NOT PUBLISHED header muted + its three rows at rest, footer laid out hidden (D5-s4's frame) |
| D5-s1 | card-slides | 119.42 | "One counter" | ONE COUNTER lit |
| D5-s2 | card-slides | 121.98 | "74,000 skills" | 74,195 skills lit |
| D5-s3 | card-slides | 123.90 | "25,000 merchants" | 25,233 merchants lit (held to 125.74) |
| D5-s4 | card-slides | 145.155 | return, "Pieverse doesn't publish" | NOT PUBLISHED header lights gold (the half lands), left half back to rest |
| D5-s5 | card-slides | 146.74 | "an agent count" | AGENTS RUNNING lit |
| D5-s6 | card-slides | 147.62 | "a subscriber count" | PAYING SUBSCRIBERS lit |
| D5-s7 | card-slides | 148.70 | "or revenue" | REVENUE lit |
| D5-s8 | card-slides | 149.82 | "anywhere I checked" | + footer "At least not anywhere I checked." (held to 151.56) |
| D6 | card-slides | 125.74 | beat start | Skill Store by source at rest, BUILT IN dim |
| D6-s1 | card-slides | 127.32 | "imported" | 74,133 MIRRORED FROM CLAWHUB lit |
| D6-s2 | card-slides | 131.00 | "30 were published" | 30 NATIVE lit |
| D6-s3 | card-slides | 134.38 | "five skills that carry a price" | 5 priced lit, rows above rest |
| D6-s4 | card-slides | 137.26 | "one paid install" | 1 paid install lit (held to 139.222) |
| D21 | card-slides | 177.755 | beat start (F5 edge) | Upbit, KRW, two days at rest |
| D21-s1 | card-slides | 181.96 | "3 billion won" | 8 NOV 2026 3.0B lit |
| D21-s2 | card-slides | 185.18 | "54 billion won" | 9 NOV 2026 53.8B lit |
| D21-s3 | card-slides | 188.64 | "18 times" | + 17.8x in a single day (held to 190.80) |
| D24 | card-slides | 190.80 | "firsthand" | IN THE COMMUNITY, rows at rest |
| D24-s1 | card-slides | 196.50 | "a 20 million market cap" | BOT CALL lit |
| D24-s2 | card-slides | 200.12 | "a 60 million market cap" | MY CALL lit |
| D24-s3 | card-slides | 203.30 | "community favorites list" | COMMUNITY FAVORITES LIST, DISCORD lit, calls rest |
| D24-s4 | card-slides | 208.52 | "swing trading software" | SWING TRADING SOFTWARE lit |
| D24-s5 | card-slides | 210.32 | "available to my members" | + AVAILABLE TO MEMBERS tag lit (held to 212.58) |
| D25 | card-slides | 212.58 | beat start | MY COMMUNITY, at rest |
| D25-s1 | card-slides | 221.08 | "lifetime membership" | LIFETIME MEMBERSHIP lit |
| D25-s2 | card-slides | 223.74 | "the link in the description" | LINK IN THE DESCRIPTION lit (held to 225.22) |
| D19 | card-slides | 225.22 | "Okay" (join: may sit 0.3 s late) | circulating supply, of 1,000M, at rest |
| D19-s1 | card-slides | 229.86 | "27 to 31%" | AROUND 27% TO 40% lit (card prints the record-day read, VO says 31) |
| D19-s2 | card-slides | 233.28 | "depending on who's counting" | the three counts lit (held to 234.78) |
| D8 | card-slides | 234.78 | beat start | allocation, five buckets at rest |
| D8-s1 | card-slides | 238.18 | "the team" | Team & Advisors 20% lit |
| D8-s2 | card-slides | 238.72 | "the investors" | + Investors 15% |
| D8-s3 | card-slides | 239.46 | "the foundation" | + Foundation Reserve 10% |
| D8-s4 | card-slides | 240.70 | "45%" | + "Team + investors + foundation = 45%" (held to 241.669) |
| D10 | card-slides | 248.669 | beat start (F6 edge) | 14 NOV 2026, the lock line, release row at rest |
| D10-s1 | card-slides | 252.28 | "the first release" | FIRST RELEASE, PER THE TRACKERS lit |
| D10-s2 | card-slides | 253.76 | "around 33 million" | around 33M lit |
| D10-s3 | card-slides | 255.14 | "around 86 million" | around 86M lit + "Two trackers, two sizes." (held to 256.68) |
| D11 | card-slides | 262.44 | beat start | WHO HOLDS IT, rows at rest |
| D11-s1 | card-slides | 263.44 | "four wallets" | 4 wallets 56.6% lit |
| D11-s2 | card-slides | 266.84 | "multisig wallets" | seven 2-of-3 multisigs 67.35% lit |
| D11-s3 | card-slides | 272.34 | "kept by people" | KEPT BY SIGNERS, NOT BY A CONTRACT lit (held to 275.10) |
| D14 | card-slides | 275.10 | beat start | perps vs spot at rest |
| D14-s1 | card-slides | 275.44 | "futures" | perp venues lit (33 listed, 3 excluded = 30) |
| D14-s2 | card-slides | 277.22 | "leveraged bets" | perps total 265.6M lit |
| D14-s3 | card-slides | 280.42 | "spot volume" | spot 21.4M lit (held to 281.18) |
| D22 | card-slides | 281.18 | "So does holding" (join) | WHAT HOLDING IT EARNS, rows at rest |
| D22-s1 | card-slides | 285.28 | "Staking is live" | STAKING IS LIVE lit green |
| D22-s2 | card-slides | 287.48 | "90" | lock 90 lit |
| D22-s3 | card-slides | 288.60 | "180" | lock 180 lit |
| D22-s4 | card-slides | 289.38 | "365 days" | lock 365 days lit |
| D22-s5 | card-slides | 291.96 | "points called XP" | EARNS: daily XP (points) lit |
| D22-s6 | card-slides | 293.94 | "not more tokens" | not more tokens lit |
| D22-s7 | card-slides | 295.46 | "Stake 50 tokens or more" | 50 OR MORE = a Basic agent lit |
| D22-s8 | card-slides | 299.80 | "will be announced" | XP: "future utility will be announced" lit (held to 303.42) |
| D23 | card-slides | 303.42 | beat start | PIP-5, closed 8 Oct 2026, four options at rest |
| D23-s1 | card-slides | 307.38 | "Token Rewards came out on top" | Token Rewards lit |
| D23-s2 | card-slides | 309.42 | "tokens voted" | 1,130 votes, 169,871 tokens of weight (around 170 thousand) lit |
| D23-s3 | card-slides | 312.26 | "under 0.02%" | + UNDER 0.02% OF THE SUPPLY |
| D23-s4 | card-slides | 315.58 | "The staking pages I read" | + since-the-vote footer (held to 319.98) |
| D20 | card-slides | 319.98 | after title-CH5 | THE TEAM, name at rest |
| D20-s1 | card-slides | 322.12 | "Colin Ho" | COLIN HO, Co-founder and CEO lit |
| D20-s2 | card-slides | 324.08 | "ex-Google" | "Ex-Google/Uber engineer" (the whitepaper) lit (held to 327.54) |
| D13 | card-slides | 327.54 | beat start | 7M strategic round, date and backers at rest |
| D13-s1 | card-slides | 328.14 | "October of 2025" | 24 OCT 2025 lit |
| D13-s2 | card-slides | 332.82 | "Animoca Brands" | LED BY Animoca Brands lit |
| D13-s3 | card-slides | 333.70 | "UOB Ventures" | UOB Ventures lit (held to 334.902) |
| D15 | card-slides | 339.335 | beat start (F7 edge) | WHAT TO WATCH, three rows at rest |
| D15-s1 | card-slides | 341.40 | "One, the circulating supply" | row 1 lit |
| D15-s2 | card-slides | 345.12 | "Two, the skills" | row 2 lit |
| D15-s3 | card-slides | 349.76 | "three, whether Pieverse publishes" | row 3 lit (held to 352.669) |
| D15-s4 | card-slides | 360.335 | callback, "If those three numbers move" | all three lit (held to 364.56) |
| END | card-slides | 364.56 | CTA start | end card at rest: prompt, two empty slots, LIKE / SUBSCRIBE / COMMENT, footer |
| END-s1 | card-slides | 366.42 | "give it a like" | LIKE lit |
| END-s2 | card-slides | 367.26 | "subscribe" | SUBSCRIBE lit |
| END-s3 | card-slides | 369.28 | "comment below" | COMMENT lit |
| END-s4 | card-slides | 370.92 | "into Pieverse" | the prompt lit (held to 373.24) |

END slot geometry (for the YouTube Studio end screen): two empty 620x350 slots at x 300-920 and x 1000-1620, y 392-742
(80 px apart); every word on the card sits outside them.

D5 rebuild (visual-qa 2026-11-14): every D5 state shares D5-s4's card frame (card box 140,174,1640,732); D5 and D5-s4 differ
only in the NOT PUBLISHED header strip, so the 145.155 return re-enters at the same size and position. No empty panel in any state.
