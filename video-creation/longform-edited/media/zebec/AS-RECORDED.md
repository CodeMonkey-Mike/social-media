# ZBCN — AS-RECORDED (build the edit to THIS, not the plan)

_Authoritative as-built script, transcribed from the FINAL spine after the full spine-prep chain
(defumble → cover-blackout → **two-zone desilence 250ms CH1 / 600ms body @181s** → **burst-removal ×2**).
Per longform-edited house rule #6, the edit is cued off THIS, not `SCREENPLAY.md` (the plan). Mike ad-libbed
and cut repetitive material live, so several planned beats changed, moved, or were dropped._

- **Final spine:** `media/zebec/spine/ALL.c.desilenced.mp4` — **458.54s (7:38.5)**, 30fps. (Burst-cleaned:
  a grunt @~52.9s and a phone noise @~300s removed; pre-burst backup `ALL.c.desilenced.mp4.bak-burst.mp4`.)
- **Transcript:** `media/zebec/spine/ALL.c.desilenced.medium-words.json` (word-level, REGENERATED against
  the burst-cleaned spine — canonical cue source). Human-review breakdown (mishears fixed):
  **`media/zebec/TRANSCRIPT-BREAKDOWN.md`**.
- **Desilence map:** `media/zebec/spine/ALL.c.desilenced.map.json` (keep-joins; note: 2 burst micro-cuts
  applied AFTER this map, at ~52.86 and ~299.86 in the desilenced timeline).
- Spine-prep chain (in `spine/`): `ALL.lowbps.mp4` → `ALL.a.defumbled.mp4` → `ALL.b.blackout.mp4` → `ALL.c.desilenced.mp4` (burst-cleaned).

## ⚠ The ONE face-visible window (per the per-video allergy override)
Everything is cover-blacked EXCEPT one beat. In FINAL-spine coords the visible face is **~45.3s–52.86s**
("But as of 2026, that anchor is gone. The unlocks are over. Basically the entire supply is already out.").
Everything else is BLACK video (cover it in the comp with containers / receipts / b-roll). Recompute the
exact visible window from `spine/ALL.c.desilenced.map.json` when wiring the comp (the blackout was baked
pre-desilence at 110.7–128.9s and the two-zone desilencer shifted timecodes).

## Whisper mishears to FIX in any captions / on-screen text
- **"Natchez" → Nacha** · **"ZBCM" / "ZBCN" mis-hears → ZBCN** · **"Thapalia" → Thapaliya** ·
  **"subset microcap" → "sub-cent micro-cap"** · **"rinky-dink mean coin" → "rinky-dink meme coin"** ·
  **"JP Morgan in Circle" → "JP Morgan and Circle"**. (Also persona: never write "tau"; not relevant here.)

---

## AS-RECORDED beats (timecodes = final spine)

> ⚠ **Chapter-header ranges below are exact to the FINAL two-zone spine (459.53s).** The per-LINE leading
> timecodes inside each beat are carried from the earlier 800ms pass and are now ~approximate (the two-zone
> final is a touch tighter); derive exact per-beat/sub-point cue times from the regenerated
> `ALL.c.desilenced.medium-words.json` / `TRANSCRIPT-BREAKDOWN.md` when building the CUE-SHEET (comp-build
> §12). Chapter openers in the BURST-CLEANED final spine: CH2 76.2s · CH3 151.3s · CH4 268.3s · CH5 392.8s ·
> END 458.5s; FACE window 45.3–52.86s.

### CH1 — Hook (0:00–1:16)
- **0.0–21.4** [COVER] "There's a crypto project that pays real salaries. Not a white paper. Not a promise. Real companies, tens of thousands of real workers getting paid every single month. It issues a card you can swipe anywhere Mastercard is taken. It sits in the same payments group as JP Morgan and Circle. It even hooked up the Trump family stablecoin to run the payroll." → `[SHOW]` payroll/card/streaming montage (R2 price card teased).
- **21.4–36.5** [COVER] "And this token is worth about a fifth of a penny. And don't let the chart fool you. It looks young because the token you buy today only relaunched in 2024. But the company behind it has been building since 2021. And it's still down here, a sub-cent micro-cap." → `[SHOW]` `price-vs-mcap` + footnote "ZBCN relaunched Apr 2024; company since 2021" (R1/R2). ✅ split-aware, no "-98%".
- **36.5–47.4** [COVER] "For years there was one good reason to stay down here. The supply kept expanding, new tokens hit the market every single month diluting everybody who bought it. That was the anchor." → `[SHOW]` supply-inflation container.
- **47.4–55.1** 👤 **[FACE] (the one face beat)** "But as of 2026, that anchor is gone. The unlocks are over. Basically the entire supply is already out." → `[IMPACT]` riser-led; this is the single visible-face window.
- **55.1–80.6** [COVER] "So now you have a real cash-generating business buying its own token back and burning it, feeding a supply that can no longer grow. And that's usually the exact type of setup that makes a chart go vertical. So the real question is not, is this real? It is real. The question is, is ZBCN about to go vertical? Let me show you the good, the bad, and the why. And honestly, I am bullish." → `[SHOW]` `buyback-flywheel` + title "about to go vertical?". NOTE: the buyback/burn line moved UP into CH1 (was CH3 in the plan).

### CH2 — What Zebec does (1:16–2:32)
- **80.6–101.5** [COVER] "ZBCN started back in 2021 with one simple idea. Instead of getting paid every two weeks, what if your salary just streamed to you by the second in real time? It's like turning payroll from a bucket you fill once a month to a faucet that's always on. Built on Solana because you need it cheap. But streaming pay by itself never really caught on." → `[SHOW]` `payroll-stream` container. NOTE: Mike ad-libbed the "Built on Solana" clause back in (short form) despite the earlier cut, it's in the take now.
- **102.0–121.4** [COVER] "So ZBCN did what a lot of these projects do. It evolved. Today it's a payments company, they call it PayFi. Real payroll for real companies, a card that spends like any other card, and an app submitted to Apple and the Google Play Store. It ties your pay, your card, and your staking into one place." → `[SHOW]` `zebec-stack` (payroll/card/SuperApp).
- **121.4–157.0** [COVER] "The founder Sam Thapaliya started Zebec at 22. Real background, real patents, and real money behind him: Circle, Solana Ventures, and Coinbase Ventures all put in over $28 million. So we can be clear right now this is not a rinky-dink meme coin nobody knows about with some anonymous team. It's a real project with real backing and real utility. There's some serious names attached to it. And hold that thought, because serious names is going to come back as both the best thing about it and one of the problems." → `[SHOW]` R7/founder receipt.

### CH3 — The Good (2:32–4:28)
- **157.0–182.0** [COVER] "So here's what pulled me in. The adoption is not made up. As of late 2025, Zebec is processing around $47 million in payroll a month. That is over half a billion dollars a year running through it. 12,000-plus employees paid, over 100 companies, a card doing tens of millions of volume across nearly 100 countries, and it's spreading past crypto startups into schools and healthcare." → `[SHOW]` `traction-scoreboard` (R7). ⚠ he said "over 100 companies" (data = ~239); on-screen scoreboard should show the real ~239 with "as of" date, and Mike's VO stays vaguer, fine.
- **182.0–208.4** [COVER] "Now Zebec joined Nacha's Payments Innovation Alliance. Nacha is the body that runs the ACH network in the US, the plumbing behind basically every direct deposit and bank transfer in the country. And they wired up the Trump family stablecoin, USD1, to run payroll for tens of thousands of workers. So whatever you think of that politically, it's distribution, it's a narrative, and right now in this market a stablecoin with that name is a tailwind." → `[SHOW]` R4 (Nacha page) + R6 (USD1).
- **208.4–259.1** [COVER] "Now for the token itself, and this is the whole reason I'm making this video. For years the knock was constant unlocks: new supply hitting the market every single month, dumping on everybody who bought. So that's over. As of 2026, basically the entire supply is already out, there's no more unlocks coming. So pause and think about what that changes. The one force guaranteed to push this price down month over month is gone. From here, the float is fixed. And now point real businesses at it: a cut of the payroll and card revenue buys back the token and burns it. Stake it in the app, you get rewards on your card spending, which pulls even more off the market. So here's the setup in one sentence: a real company generating real revenue, buying back a token that can no longer be diluted." → `[SHOW]` R1 (CMC supply) + `buyback-flywheel`. THE pillar (delivered as COVER per override).
- **259.1–274.1** [COVER] "So can the chart go vertical? Hmm. I think it's just a matter of time. It depends on the market, on what happens with this bear market, on a few other outside factors. But yes, when we start going parabolic across the board, it's a question to ponder." → ad-lib; keeps upside CONDITIONAL (good).

### CH4 — The Bad (4:28–6:33)
- **274.1–308.0** [COVER] "So why is this business still a penny stock? Part of the answer is this is not some fresh launch. The company has been around since 2021. Its first token, ZBC, launched back in 2022, ran up, and then bled for two years. In 2024 they relaunched as ZBCN, the token you see on the chart today. So this chart is only two years old, but the story goes further back. Adjust for that and it's trading roughly where it first launched in 2022. The market has had plenty of chances to price it." → `[SHOW]` `history-timeline` (R3). ✅ split-aware, no "-98%".
- **308.0–330.7** [COVER] "And remember those serious names, Circle, Coinbase, Solana Ventures? Insiders have a cost basis you and I will never see. It's the exact opposite of the coins I usually care about. There are people in this space who have flat-out called ZBC a rug. I'm not saying that, but there's history: they quietly bought a chunk of tokens back from investors and it looked opaque. The trust question is fair, and it's still open." → attributed skepticism, not asserted. (Dropped: the explicit "VC-funded, not a fair launch" phrasing + the "2023" date, meaning survived.)
- **330.7–348.2** [COVER] "And don't forget who owns payroll already. Companies like ADP, wired straight into Microsoft, selling entire software and cloud packages to enterprise. Nobody rips that out to run their paycheck through a crypto app. The realistic path here is not killing ADP, it's becoming a small rail inside a very big machine." → `[SHOW]` `competition` container.
- **348.2–372.0** [COVER] "And then there's the stuff marketing will never tweet. When people looked under the hood earlier, the on-chain picture was ugly: thin actual liquidity against the market cap, so the price was propped up on exchanges more than by real on-chain demand. Big wallets selling while buyers piled in late. Even the app and code activity got questioned. I'm not going to repeat old red flags as if they're true, but I'm going to check them, and so should you." → ⚠ RE-VERIFY these live before airing (some are older findings).
- **372.0–378.2** [COVER] "Because as usual, nothing is financial advice. Do your own research, and click that like button." → mini-CTA landed HERE (mid-CH4), not at the end.
- **378.2–399.6** [COVER] "But one last thing, a small one, something that bugs me. When I went digging on who actually runs this company, I got different answers. Some sources point to the founder, Sam. Other people who've met the team call the CEO someone named Simon. I shouldn't have to squint to figure out who's in charge of a company I'm actually bullish on. That's a type of discrepancy I don't really care for." → `[SHOW]` R8 (Sam vs Simon receipts).

### CH5 — Why I'm bullish (6:33–7:38.5)
- **399.6–427.0** [COVER] "So here's how I actually think of a coin like this. You separate two things: the business and the token. With most crypto, the business is fake and the token is all you have. Here it's the other way around: it's a real business, and that's not even debatable. The only question left is whether that real business pulls the token up with it. And for the first time, the thing that always broke that link, endless new supply, is gone." → `[SHOW]` `business-vs-token`.
- **427.0–449.1** [COVER] "So here's the bet: revenue and the buyback keep scaling into a supply that can no longer grow. When demand rises against a fixed float, price doesn't drift up, it moves fast. So that's why I'm on the bullish side. Not because it's cheap. That one thing that was capping us is actually out of the way. Finally."
- **449.1–471.7 (END)** [COVER] "Yes, and sure, revenue still has to grow and the company has to be successful. But it looks good, and crypto is the future, so I'm thinking we're going to see some upside. As more and more companies and people adopt crypto, we're going to see things eventually go parabolic. And that will probably lead us to a vertical ZBCN." → verdict landing; the video ENDS here on this trail-off.

---

## Divergences from the plan (SCREENPLAY.md) + decisions needed

**Dropped / not recorded (remove from the edit plan):**
- **CH4 "trust me vs verify me" beat** (burns-not-verifiable-on-chain + the Nacha "inflated governing-seat" correction). Mike did NOT say it. So the R5 "Zebec's inflated tweet vs the plain fact" receipt is NO LONGER USED (drop R5) unless he re-records that beat.
- **CH5 reusable coin-checklist framework beat** ("ask the same questions on every coin..."). Not recorded → the `coin-checklist` container is NOT used in this video. (The framework still lives in `COIN-INVESTIGATION-CHECKLIST.md` for future videos.)

**CTA — RESOLVED (Mike, 2026-07-11): the "click that like button" line IS the only CTA wanted.** No re-record, no end-card, no sign-off. The mid-CH4 fragment ("nothing is financial advice, do your own research, click that like button", ~365s) is the intended CTA, and the video ENDS on the verdict ("a vertical ZBCN"). Do not add anything at the tail. The planned "best community / I'm gonna catch you guys, later" close is dropped by choice.

**Minor:**
- "over 100 companies" (VO) vs ~239 (data): show the accurate ~239 on the scoreboard with an "as of" date; VO stays as spoken.
- Whisper mishears above must be corrected in any caption/on-screen text.
- "Built on Solana because you need it cheap" is back in the take (short form); fine, leave it.
