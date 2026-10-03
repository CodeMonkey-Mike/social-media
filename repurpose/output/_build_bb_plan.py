# Builds repurpose/output/biggest-bullrun-lane3-plan.json (Lane 3 drafting handoff artifact).
import json, pathlib, sys

REPO = pathlib.Path(__file__).resolve().parents[2]
sys.path.insert(0, str(REPO / "repurpose"))
from queue_writer import validate_lane3_plan  # noqa: E402

REF = REPO / "schedule-tweets" / "images" / "reference"
V1REF = str(REF / "carousels" / "version1" / "yt-posts-828eee71-01-hook.png")
V2 = REF / "carousels" / "version2"

BATCH = "biggest-bullrun"
DATE = "2026-09-05"
SRC = ("video-creation/livestream-repurpose/transcripts/biggest bullrun LOW BPS VERTICAL/"
       "biggest bullrun LOW BPS VERTICAL_plain.txt")

PIXAR = "Pixar-style 3D animated CGI illustration, 1:1 square aspect ratio, film-quality render. "
PIXAR45 = "Pixar-style 3D animated CGI illustration, 4:5 portrait aspect ratio, film-quality render. "
PLAIN = ("Every coin character's face is completely plain: no symbol, no logo, no glyph, no lettering or "
         "marking of any kind. ")
NOTEXT = "No text or words anywhere in the image."

KAS_SCENE = (
    "A single heroic Kaspa coin character with arms and legs and a calm confident face, its face showing the "
    "backwards-K mirrored-K Kaspa logo, glowing greenish cyan, standing perfectly still in the centre of a "
    "swirling storm of shadowy shouting cartoon hecklers who are being blown backwards away from it. Deep navy "
    "near-black background. Dramatic cinematic lighting with a greenish cyan rim light on the Kaspa coin and "
    "cold blue backlight on the hecklers. Defiant and triumphant. " + NOTEXT)

KAS_MINE = (
    "A single Kaspa coin character with arms and legs and bright determined eyes, its face showing the "
    "backwards-K mirrored-K Kaspa logo, glowing greenish cyan, riding a small mine cart up out of a deep mine "
    "shaft whose walls have been stripped almost completely bare, with only a few last glowing greenish cyan "
    "ore veins left in the rock behind it. Deep navy near-black cavern. Dramatic cinematic lighting, greenish "
    "cyan glow from the coin and from the last veins. Scarce and triumphant. " + NOTEXT)

images = [
    {"purpose": "x-tweets", "image_id": "43c0214e", "slug": "kaspa-bear-case-shrunk",
     "prompt": PIXAR + KAS_SCENE},
    {"purpose": "x-tweets", "image_id": "6640cb4e", "slug": "own-things-that-pay-you",
     "prompt": PIXAR + PLAIN +
     "A happy blank-faced meme coin character sitting cross-legged under a tall glowing money tree, holding an "
     "open leather wallet in its lap while small shining certificate-shaped gems fall from the branches and "
     "land neatly in the wallet. Deep navy near-black background. Dramatic cinematic lighting, warm gold glow "
     "from the falling gems, soft teal rim light on the coin character. Content and abundant. " + NOTEXT},
    {"purpose": "x-tweets", "image_id": "79568559", "slug": "two-weeks-of-pressure",
     "prompt": PIXAR + PLAIN +
     "A brave blank-faced coin character braced between the two heavy steel plates of a giant industrial press "
     "that is slowly squeezing it, while directly underneath the coin a huge coiled steel spring is compressed "
     "and about to launch. Deep navy near-black industrial background. Dramatic cinematic lighting, hard white "
     "key light on the press, warm gold glow building under the spring. Tense and about to explode. " + NOTEXT},
    {"purpose": "x-tweets", "image_id": "a8addfac", "slug": "chain-stopped-producing-blocks",
     "prompt": PIXAR + PLAIN +
     "A frantic crowd of blank-faced coin characters hammering on a huge sealed steel vault door that has "
     "clearly just slammed shut, one of them holding a fistful of profit tickets it can no longer cash. Deep "
     "navy near-black background. Dramatic cinematic lighting, hard red emergency light washing over the vault "
     "door, cold blue rim light on the crowd. Panicked and locked out. " + NOTEXT},
    {"purpose": "x-tweets", "image_id": "ae93bdaa", "slug": "kas-last-cheap-fair-launch",
     "prompt": PIXAR + KAS_MINE},
    {"purpose": "x-tweets", "image_id": "fd48b818", "slug": "cpi-cloture-fed-gauntlet",
     "prompt": PIXAR + PLAIN +
     "A determined blank-faced coin character sprinting down a narrow corridor lined with four heavy swinging "
     "pendulum blades it has to time perfectly, with a wide open sunlit doorway waiting at the far end. Deep "
     "navy near-black corridor. Dramatic cinematic lighting, cold steel highlights on the pendulums, warm gold "
     "light spilling from the doorway ahead. Tense and determined. " + NOTEXT},
    # IG 4:5 companions (Kaspa subjects only)
    {"purpose": "ig-single", "image_id": "43c0214e", "slug": "kaspa-bear-case-shrunk",
     "prompt": PIXAR45 + KAS_SCENE},
    {"purpose": "ig-single", "image_id": "ae93bdaa", "slug": "kas-last-cheap-fair-launch",
     "prompt": PIXAR45 + KAS_MINE},
]


def v2_prompt(n, title, insight, box_label, detail, ref):
    return ("Editorial carousel slide, 1:1 square. Match the layout, typography, color, and overall styling of "
            "the attached reference image. Very dark near-black background with subtle texture. Top-left small "
            f"teal all-caps label reading '{n} OF 5', exactly once. Large bold white all-caps title: "
            f"'{title}'. Below it a teal accent line reading: '{insight}'. At the bottom a dark rounded box "
            f"with a teal all-caps label '{box_label}' and white body text: '{detail}'. Clean minimal editorial "
            "layout, no dramatic effects, no human faces. No em dashes anywhere in the rendered text, use "
            "colons instead. No artist signature, no watermark, no initials in any corner. Render no text "
            "other than the text specified here.")


def v1_prompt(n, headline, sub, visual):
    return ("Bold crypto news graphic, 1:1 square. Match the layout, typography, color, and overall styling of "
            "the attached reference image. Near-black background, dramatic lighting, bold all-caps white and "
            "neon green typography (true neon green, not chartreuse and not yellow-green). Small white all-caps "
            f"counter label top-left reading '{n} OF 5', exactly once. Main all-caps headline: '{headline}'. "
            f"Smaller all-caps line beneath it: '{sub}'. {visual} No human faces. No em dashes anywhere in the "
            "rendered text, use colons instead. No artist signature, no watermark, no initials in any corner. "
            "Render no text other than the text specified here.")


CAROUSEL_A = [
    ("cb013103", "01-hook", "95% OF KASPA IS ALREADY MINED",
     v2_prompt(1, "95% OF KASPA IS ALREADY MINED", "The emission everybody waited out is nearly finished",
               "THE SUPPLY", "28.7 billion cap. Over 95% of it has already been mined.",
               str(V2 / "yt-posts-9611992a-01-hook.png")), str(V2 / "yt-posts-9611992a-01-hook.png")),
    ("7dc3ceee", "02-fair-launch", "FAIR LAUNCH. NO PREMINE. ZERO INSIDERS",
     v2_prompt(2, "FAIR LAUNCH. NO PREMINE. ZERO INSIDERS", "Nobody was handed a bag at zero",
               "THE RECEIPT", "November 2021: no presale, no insider allocation, every coin mined.",
               str(V2 / "yt-posts-4a9a572c-02-btc-failure.png")),
     str(V2 / "yt-posts-4a9a572c-02-btc-failure.png")),
    ("221351be", "03-toccata", "TOCCATA PUT KRC20 ON LAYER 1",
     v2_prompt(3, "TOCCATA PUT KRC20 ON LAYER 1", "The no smart contracts argument died in June",
               "THE UPGRADE", "Covenant style programmability and native KRC20, live since June 2026.",
               str(V2 / "yt-posts-44d02f9a-03-the-problem.png")),
     str(V2 / "yt-posts-44d02f9a-03-the-problem.png")),
    ("6dd5cf97", "04-chart-complaint", "THE BEAR CASE IS NOW: IT HAS NOT MOVED",
     v2_prompt(4, "THE BEAR CASE IS NOW: IT HAS NOT MOVED", "That is a chart complaint, not a thesis",
               "WHAT IS LEFT", "Every other objection has been answered. Only the price is late.",
               str(V2 / "yt-posts-074be0dc-04-the-solution.png")),
     str(V2 / "yt-posts-074be0dc-04-the-solution.png")),
    ("79e83ed3", "05-question", "SO WHAT IS KEEPING KASPA AT 3 CENTS?",
     v2_prompt(5, "SO WHAT IS KEEPING KASPA AT 3 CENTS?", "Give me the real reason, not the price",
               "YOUR CALL", "Answer in the comments, and no fence sitting.",
               str(V2 / "yt-posts-81abb2d9-06-question.png")),
     str(V2 / "yt-posts-81abb2d9-06-question.png")),
]

CAROUSEL_B = [
    ("1b5b8cd5", "01-hook", "HOLD THE MEME, GET PAID IN REAL STOCKS",
     v1_prompt(1, "HOLD THE MEME, GET PAID IN REAL STOCKS", "THE ROBINHOOD CHAIN, SEPTEMBER 2026",
               "A glowing neon green wallet icon at the centre with small share certificate icons dropping into "
               "it and a dark candlestick data panel behind."), V1REF),
    ("177f6ca4", "02-the-fees", "THE FEES BUY A BASKET OF STOCKS",
     v1_prompt(2, "THE FEES BUY A BASKET OF STOCKS", "A TRADING TAX POINTED AT REAL ASSETS",
               "Neon green arrows flowing from a stack of coin icons into a row of share certificate icons."),
     V1REF),
    ("0bd518c2", "03-airdrop", "AND THE STOCKS GO TO THE HOLDERS",
     v1_prompt(3, "AND THE STOCKS GO TO THE HOLDERS", "AIRDROPPED STRAIGHT INTO THE WALLET",
               "A neon green downward stream of small certificate icons landing in a glowing wallet outline."),
     V1REF),
    ("9003d9b7", "04-own-things", "OWN THINGS THAT PAY YOU",
     v1_prompt(4, "OWN THINGS THAT PAY YOU", "THE FIRST MEME MECHANIC THAT SENDS SOMETHING BACK",
               "A single large glowing neon green coin icon on a dark pedestal with soft radiating rings."),
     V1REF),
    ("6bb31677", "05-question", "WOULD A MEME THAT PAYS YOU CHANGE YOUR HOLD?",
     v1_prompt(5, "WOULD A MEME THAT PAYS YOU CHANGE YOUR HOLD?", "TELL ME IN THE COMMENTS",
               "A neon green split divider down the centre of the frame with a glowing data panel on each "
               "side."), V1REF),
]

for iid, slug, _txt, prompt, ref in CAROUSEL_A + CAROUSEL_B:
    images.append({"purpose": "yt-posts", "image_id": iid, "slug": slug, "prompt": prompt, "ref": ref})

# ── copy ─────────────────────────────────────────────────────────────────────

T1 = ("Over 95% of Kaspa's supply is already mined.\n\n"
      "Fair launch, no premine, zero insider allocation, and Toccata put KRC20 natively on layer 1 in June.\n\n"
      "The bear case has shrunk to one line: it has not moved yet.\n\n"
      "That is a chart complaint, not a thesis.\n\n"
      "#kaspa")

T2 = ("Hold the meme, the trading fees buy a basket of real tokenized stocks, and the stocks get airdropped to "
      "holders.\n\n"
      "Vlad said it himself: hold a meme coin on the Robinhood chain and you just get stock tokens.\n\n"
      "Own things that pay you. \U0001F60E")

T3 = ("A strong jobs print landed and the odds of a September hike went DOWN.\n\n"
      "Make that make sense.\n\n"
      "PPI Thursday, CPI Friday, then the Fed on the 16th with core expected to jump from 0.1% to 0.4%.\n\n"
      "Two weeks of pressure, then the bid comes back.")

T4 = ("The Robinhood chain stopped producing blocks while half of Crypto Twitter was trading memes on it.\n\n"
      "Solana did this for years and everybody forgave it because the plays were good.\n\n"
      "Fine, right up until the day you want to take profits. \U0001F914")

O1 = ("$KAS at 3 cents with 95% of the supply already mined is the last cheap fair launch left on the "
      "board...\n\n#kaspa")

O2 = ("PPI Thursday, CPI Friday, cloture on the 15th, the Fed on the 16th... four gates in nine days and then "
      "everybody buys back in.")

YT_A_BODY = (
    "Over 95% of Kaspa's supply is already mined, and people are still telling me they are waiting.\n\n"
    "Waiting for what, exactly? Let me walk the objections, because I think there is only one left.\n\n"
    "Start with what it actually is. Fair launch, November 2021. No premine, no presale, no insider "
    "allocation, not one coin handed to anybody at zero. Proof of work, and a supply capped around 28.7 "
    "billion that is now over 95% emitted. That last number matters more than people realise, because the "
    "emission schedule was the single most repeated reason to sit out. Every year somebody told me the miners "
    "were going to bury it. The miners are almost done.\n\n"
    "Second objection: no smart contracts. That one died in June. Toccata shipped covenant style "
    "programmability and native KRC20 token support directly on layer 1. Not a bridge, not a sidechain, not a "
    "promise on a roadmap. It is live.\n\n"
    "Third objection: no big exchange listing. I have said this for two years and I will say it again. There "
    "was no premine to fund a listing. The exclusion is the receipt of the fair launch, not a defect in it. "
    "You do not get both: the clean launch and the war chest that buys shelf space.\n\n"
    "So what is left? Price. It has not moved yet. That is the whole bear case now, and it is a chart "
    "complaint dressed up as analysis.\n\n"
    "Here is the part I actually care about. When I put the question to my own community, one in ten went out "
    "of their way to say it never gets its moment. Not later. Never. Apathy does not vote. That is a fight, "
    "and the fight around this thing is the loudest it has been since I put most of my money in at 11 cents. "
    "Every asset I have watched go vertical did this first: the argument gets louder, the holders go quiet, "
    "the people waiting for a better entry start explaining why the entry never mattered. Then it moves, and "
    "afterwards everybody agrees it was obvious.\n\n"
    "I am not going to pretend I know the week. I know the list of reasons to stay out keeps getting shorter, "
    "and there is now exactly one item on it.\n\n"
    "So tell me straight in the comments: what is actually keeping Kaspa at 3 cents? And if your answer is "
    "that it just does not run, say that out loud, because that is a position too and I want to read it.\n\n"
    "Hit like and subscribe if you would rather be early than be right in hindsight.")

YT_B_BODY = (
    "A meme coin just paid me in real stock.\n\n"
    "Not a promise of revenue share. Not points. Actual tokenized shares, airdropped into the wallet, for "
    "doing nothing except holding.\n\n"
    "Here is the mechanic, because it is the most interesting thing happening on the Robinhood chain right "
    "now and most people are still arguing about which dog is funnier. You hold the token. Every trade pays a "
    "small fee. That fee is not going to a team wallet, it is used to buy a basket of tokenized US stocks. "
    "Those stocks are then distributed to holders. The INDEX token runs a 3% trade tax and pushes stock "
    "tokens out to holders every 15 minutes. Vlad Tenev said the quiet part in public: on Robinhood chain, if "
    "you hold a meme coin, you just get stock tokens airdropped to you.\n\n"
    "Sit with that for a second. The entire complaint about meme coins, for years, has been that there is "
    "nothing underneath them. You buy a picture, you hope somebody buys the picture from you higher. That is "
    "the whole trade. This flips it. The picture buys assets and hands them to you while you wait.\n\n"
    "Boomer is the cleanest version of the idea I have seen so far. People buy it, people sell it, the fees "
    "generated go into a basket of stocks, and the basket gets distributed to the people holding. Own things "
    "that pay you. That is not a slogan somebody wrote for a pitch deck, it is literally what the contract "
    "does.\n\n"
    "Now the part I am not going to skip, because I am not here to sell you a fairy tale. The stock leg does "
    "not make the token safe. The same week this mechanic went mainstream, I watched a project paired to a "
    "streaming brand ship a site that could not even load a movie, and a chain outage stop block production "
    "while everybody was trying to trade. A yield mechanic on top of a broken product is still a broken "
    "product, and a chain that stops producing blocks is a chain you cannot sell into. Size accordingly.\n\n"
    "But directionally, this is the first meme mechanic I have seen that gives the holder something other "
    "than hope. If it works, every chain copies it within a quarter, and the memes that do not pay you start "
    "looking very old very fast.\n\n"
    "So here is my question for the comments: if a meme coin paid you in real tokenized stock, would you "
    "actually hold it longer, or would you still sell the first green candle? Be honest.\n\n"
    "Like and subscribe if you want the next one of these before it is on everybody's timeline.")

x_tweets = [
    {"tweet": T1, "hook": T1.split("\n")[0], "image_id": "43c0214e"},
    {"tweet": T2, "hook": T2.split("\n")[0], "image_id": "6640cb4e"},
    {"tweet": T3, "hook": T3.split("\n")[0], "image_id": "79568559"},
    {"tweet": T4, "hook": T4.split("\n")[0], "image_id": "a8addfac"},
    {"tweet": O1, "hook": O1.split("\n")[0], "image_id": "ae93bdaa"},
    {"tweet": O2, "hook": O2.split("\n")[0], "image_id": "fd48b818"},
]

thread_a = [
    {"text": "Over 95% of Kaspa's supply is already mined.\n\nAnd people are still telling me they are "
             "waiting.\n\nWaiting for what? There is exactly one objection left...",
     "hook": "Over 95% of Kaspa's supply is already mined."},
    {"text": "What it is: fair launch, November 2021.\n\nNo premine. No presale. No insider allocation. Not one "
             "coin handed to anybody at zero.\n\nProof of work, cap around 28.7 billion."},
    {"text": "Objection one was always the emission. The miners were going to bury it.\n\nThe miners are almost "
             "done. Over 95% of it is out."},
    {"text": "Objection two was no smart contracts.\n\nThat died in June. Toccata shipped covenant style "
             "programmability and native KRC20 on layer 1. Live, not a roadmap."},
    {"text": "Objection three is no big listing.\n\nThere was no premine to fund one. The exclusion is the "
             "receipt of the fair launch. You do not get the clean launch AND the war chest."},
    {"text": "So the bear case is down to one line: it has not moved yet.\n\nThat is a chart complaint, not a "
             "thesis."},
    {"text": "If this changed how you read the FUD on your own bags,\n\nFollow me for macro x crypto takes "
             "that ignore the four-year cycle echo chamber.\n\n\U0001F9E0 + \U0001F60E"},
]

thread_b = [
    {"text": "A meme coin just paid me in real stock.\n\nNot revenue share. Not points. Actual tokenized "
             "shares, airdropped to the wallet, for holding...",
     "hook": "A meme coin just paid me in real stock."},
    {"text": "The mechanic: you hold the token, every trade pays a small fee, and that fee buys a basket of "
             "tokenized US stocks.\n\nThe basket goes to holders."},
    {"text": "INDEX runs a 3% trade tax and pushes stock tokens out to holders every 15 minutes.\n\nVlad said "
             "it in public: hold a meme coin on Robinhood chain, you just get stock tokens."},
    {"text": "The oldest complaint about memes is that there is nothing underneath them.\n\nYou buy a picture "
             "and hope somebody buys it higher.\n\nThis flips it. The picture buys assets while you wait."},
    {"text": "Boomer is the cleanest version I have seen. Buy it, sell it, the fees go into stocks, the stocks "
             "go to holders.\n\nOwn things that pay you."},
    {"text": "The honest half: a yield mechanic on a broken product is still a broken product.\n\nAnd a chain "
             "that stops producing blocks is a chain you cannot sell into. Size accordingly."},
    {"text": "If this is the first meme mechanic that gave you something other than hope,\n\nFollow me for the "
             "Robinhood chain plays before your timeline finds them.\n\n\U0001F680"},
]

plan = {
    "batch": BATCH,
    "date": DATE,
    "source_transcript": SRC,
    "authored_by": "orchestrator (Lane 3 drafting), 2026-09-05",
    "images": images,
    "x_tweets": x_tweets,
    "x_threads": [
        {"id": "thread-2026-09-05-kaspa-one-objection-left",
         "topic": "Kaspa: 95% mined and only one objection left",
         "variation_label": "A", "tweets": thread_a},
        {"id": "thread-2026-09-05-meme-that-pays-you",
         "topic": "The Robinhood chain meme mechanic that airdrops real tokenized stocks",
         "variation_label": "A", "tweets": thread_b},
    ],
    "x_polls": [
        {"id": "poll-2026-09-05-what-keeps-kas-at-three-cents",
         "topic": "What is actually keeping Kaspa at 3 cents",
         "eligible_topic": "kaspa",
         "tweet_text": "Over 95% of Kaspa's supply is already mined.\n\nFair launch, no premine, zero insider "
                       "allocation, KRC20 live on layer 1 since June.\n\nStill 3 cents. So what is actually "
                       "holding it there?",
         "hook": "Over 95% of Kaspa's supply is already mined.",
         "options": ["No major exchange", "Nobody knows what it is", "The market is early",
                     "It just does not run"],
         "duration": "1d"},
    ],
    "yt_text_polls": [
        {"id": "yt-text-poll-2026-09-05-what-keeps-kas-at-three-cents",
         "topic": "What is actually keeping Kaspa at 3 cents",
         "source_post": "yt-post-2026-09-05-kaspa-one-objection-left",
         "question_text": "Over 95% of Kaspa's supply is already mined.\n\nFair launch in November 2021. No "
                          "premine, no presale, no insider allocation. Toccata put covenant style "
                          "programmability and native KRC20 on layer 1 back in June. The emission that "
                          "everybody used to point at as the reason to wait is nearly finished.\n\nAnd it is "
                          "still 3 cents.\n\nSo pick the real reason, and no fence sitting:",
         "hook": "Over 95% of Kaspa's supply is already mined.",
         "options": ["No major exchange listing to buy it on",
                     "Most people still have no idea what it is",
                     "Nothing is wrong, the market is simply early",
                     "It is never going to run, and I will say it"]},
        {"id": "yt-text-poll-2026-09-05-meme-that-pays-you",
         "topic": "Would a meme that pays you in real stock change how long you hold",
         "source_post": "yt-post-2026-09-05-meme-that-pays-you",
         "question_text": "On the Robinhood chain there are now meme coins where the trading fees are used to "
                          "buy a basket of tokenized US stocks, and those stocks get airdropped to the people "
                          "holding the token.\n\nThe oldest complaint about meme coins is that there is nothing "
                          "underneath them. This one hands you real assets while you wait.\n\nSo be honest "
                          "with yourself:",
         "hook": "A meme coin that pays you in real stock changes the math.",
         "options": ["Yes, that is the only kind of meme I would hold",
                     "No, I am here for the pump and nothing else",
                     "Only if it has real exchange listings behind it",
                     "Depends entirely on which stocks are in the basket"]},
    ],
    "yt_posts": [
        {"id": "yt-post-2026-09-05-kaspa-one-objection-left",
         "topic": "Kaspa: 95% mined and only one objection left",
         "variation_label": "A + CTA1",
         "body_style": "objection teardown: answer every bear argument until one is left",
         "cta_target": "subscribe_youtube",
         "body": YT_A_BODY,
         "engagement_question": "What is actually keeping Kaspa at 3 cents, and if your answer is that it just "
                                "does not run, say that out loud.",
         "images": [{"image_id": iid, "slide_text": txt} for iid, _s, txt, _p, _r in CAROUSEL_A]},
        {"id": "yt-post-2026-09-05-meme-that-pays-you",
         "topic": "The Robinhood chain meme mechanic that airdrops real tokenized stocks",
         "variation_label": "A + CTA2",
         "body_style": "mechanic explainer with an honest risk half",
         "cta_target": "subscribe_youtube",
         "body": YT_B_BODY,
         "engagement_question": "If a meme coin paid you in real tokenized stock, would you actually hold it "
                                "longer, or would you still sell the first green candle?",
         "images": [{"image_id": iid, "slide_text": txt} for iid, _s, txt, _p, _r in CAROUSEL_B]},
    ],
    "ig_single": [
        {"id": "ig-2026-09-05-kaspa-bear-case-shrunk",
         "kaspa_subject": True,
         "image_id": "43c0214e",
         "aspect_ratio": "4:5",
         "hook": "Over 95% of Kaspa's supply is already mined.",
         "caption": "Over 95% of Kaspa's supply is already mined.\n\nFair launch, no premine, zero insider "
                    "allocation, and Toccata put KRC20 natively on layer 1 back in June.\n\nEvery reason people "
                    "gave me for waiting has been answered one by one. The emission was going to bury it; the "
                    "emission is nearly finished. There were no smart contracts; there are now. There is no "
                    "big exchange listing, and there was never a premine to buy one, which is the receipt of "
                    "the fair launch and not a defect in it.\n\nSo the bear case has shrunk to one line: it has "
                    "not moved yet.\n\nThat is a chart complaint, not a thesis.\n\nSave this and read it back "
                    "the next time somebody tells you they are waiting.",
         "hashtags": ["#kaspa", "#kas", "#krc20", "#proofofwork", "#fairlaunch", "#crypto", "#cryptocurrency",
                      "#bitcoin", "#btc", "#blockchain", "#altcoins", "#cryptoinvesting", "#cryptotrading"],
         "source_post": "Over 95% of Kaspa's supply is already mined."},
        {"id": "ig-2026-09-05-kas-last-cheap-fair-launch",
         "kaspa_subject": True,
         "image_id": "ae93bdaa",
         "aspect_ratio": "4:5",
         "hook": "$KAS at 3 cents with 95% of the supply already mined is the last cheap fair launch left on "
                 "the board...",
         "caption": "$KAS at 3 cents with 95% of the supply already mined is the last cheap fair launch left on "
                    "the board...\n\nNo premine. No presale. No insider allocation. Every coin in circulation "
                    "was mined by somebody.\n\nThe scarcity is not a forecast at this point, it is nearly "
                    "finished emitting.\n\nTag somebody who is still waiting for a better entry.",
         "hashtags": ["#kaspa", "#kas", "#krc20", "#proofofwork", "#fairlaunch", "#mining", "#crypto",
                      "#cryptocurrency", "#bitcoin", "#btc", "#blockchain", "#altcoins", "#cryptoinvesting"],
         "source_post": "$KAS at 3 cents with 95% of the supply already mined is the last cheap fair launch "
                        "left on the board..."},
    ],
}

out = REPO / "repurpose" / "output" / f"{BATCH}-lane3-plan.json"
out.write_text(json.dumps(plan, indent=2, ensure_ascii=False), encoding="utf-8", newline="\n")

# ── local sanity: char caps the validator does not enforce ───────────────────
problems = []
for t in plan["x_tweets"]:
    if len(t["tweet"]) > 280:
        problems.append(f"tweet {len(t['tweet'])}/280: {t['hook'][:50]}")
for th in plan["x_threads"]:
    for i, tw in enumerate(th["tweets"]):
        if len(tw["text"]) > 280:
            problems.append(f"{th['id']} tweet {i+1}: {len(tw['text'])}/280")
for p in plan["x_polls"]:
    if len(p["tweet_text"]) > 280:
        problems.append(f"{p['id']} text {len(p['tweet_text'])}/280")
    for o in p["options"]:
        if len(o) > 25:
            problems.append(f"{p['id']} option {len(o)}/25: {o}")
for p in plan["yt_text_polls"]:
    for o in p["options"]:
        if len(o) > 65:
            problems.append(f"{p['id']} option {len(o)}/65: {o}")
for p in plan["yt_posts"]:
    print(f"  {p['id']}: body {len(p['body'])} chars, {len(p['images'])} slides")
for t in plan["x_tweets"]:
    print(f"  tweet {len(t['tweet']):3d}/280  {t['hook'][:60]}")

if problems:
    print("\nPROBLEMS:")
    for p in problems:
        print("  ", p)
    sys.exit(1)

validate_lane3_plan(plan)
print("\nlane3-plan VALID ->", out)
print("images:", len(images), "unique ids:", len({i['image_id'] for i in images}))
