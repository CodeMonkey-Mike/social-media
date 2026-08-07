"""build_captions.py — CANONICAL caption builder for ALL formats. Read captions/captions.md first.

ONE method (Whisper word-timings -> brand correction -> cleanup -> group -> emit); the visual styles are
font-named PRESETS chosen with --style. Consolidates the old per-format builders
(shorts/_tooling/_build_captions.py, vertical-ai-persona/scripts/build_captions.py, gen_captions_generic.py).

  python build_captions.py --words whisper-words.json --style montserrat [--var CAPTIONS_X] [--colorize ...]
  python build_captions.py --words whisper-words.json --style arial-black --out _captions/captions.json
  python build_captions.py --transcribe clip.mp4      --style arial-black --out _captions/captions.json

Presets:
  montserrat  = shorts / Yuli: lowercase, 2-3 word CHUNKS, bounce-pop -> TS array `{t,h}` (optional <g><y> tags)
  arial-black = wise-man / crypto-promo: UPPERCASE, 3-4 word KARAOKE (per-word timings) -> captions.json
"""
import argparse, json, os, re, subprocess, sys, tempfile

WHISPER = r"C:/Users/mnede/AppData/Local/Programs/Python/Python312/Scripts/whisper.exe"

# ── brand / term corrections: THE single source of truth (extend HERE only) ──────────────────────
CORRECTIONS = [
    (r"\bcas+per\b", "kaspa"), (r"\bkas+per\b", "kaspa"), (r"\bcaspa\b", "kaspa"),
    (r"\bsailor\b", "saylor"),
    (r"\btau\b", "tao"),   # Mike says "tau" for $TAO; the ticker is ALWAYS TAO, never "tau"
    (r"\bzbank\b", "zbcn"), (r"\bzbcm\b", "zbcn"),   # Zebec token is ZBCN (Whisper: "ZBank"/"ZBCM")
    (r"\bthapalia\b", "thapaliya"),   # founder Sam Thapaliya (Whisper: "Thapalia")
    (r"\btok+at+a\b", "toccata"), (r"\btocata\b", "toccata"),   # Kaspa "Toccata" hardfork (Whisper: "Tokata")
    (r"\bk[cr]20s?\b", "krc20"), (r"\bkc\s*20s?\b", "krc20"),   # KRC20 (Whisper: "KC20"/"KR20")
    (r"\bcroak\b", "kroak"),       # Kroak (KRC20 meme; Whisper hears "croak")
    (r"\bslippery\b", "slippy"),   # Slippy (KRC20 meme; Whisper hears "Slippery")
    (r"\breal\s*dify\b", "real defi"), (r"\brealdify\b", "real defi"), (r"\bdify\b", "defi"),  # "real DeFi" mishears
    # Bittensor mishears (all non-words, safe to correct globally; Whisper garbles it badly)
    (r"\bbeten[sz][eo]r\b", "bittensor"), (r"\bbtenz[eo]r\b", "bittensor"),
    (r"\bb[ei]tens[eo]r\b", "bittensor"), (r"\bbittenz[eo]r\b", "bittensor"),
    (r"\bpatenz[ao]\b", "bittensor"),
    (r"\bpotenz[ao]\b", "bittensor"),   # Whisper also hears Bittensor as "Potenza" (companion to Patenza)
    (r"\bvirtuos\b", "virtuals"),   # Virtuals token (Whisper: "Virtuos")
    # Whisper regularly splits "Bittensor" into TWO tokens and hears the "bit-" syllable as a real
    # word ("But Tenzer" / "the Tenser"). Correct the tail here; the stray leading syllable is merged
    # away in cleanup() (see BIT_SYLLABLE). Non-words, so global correction is safe.
    (r"\btenz[eo]r\b", "bittensor"), (r"\btens[e]r\b", "bittensor"),
    # --- October-pumps batch, 2026-07-23 ---
    # Whisper hears $TAO as "towel" as often as "tau". A literal towel cannot occur in this catalogue.
    (r"\btowels?\b", "tao"),
    (r"\bninehood\b", "ninehood"), (r"\bnindhood\b", "ninehood"),
    (r"\bmadenet\b", "mainnet"), (r"\bmainnnet\b", "mainnet"),   # Kaspa mainnet (Whisper: "MadeNet")
    # Whisper splits this as "post" + "-having"; the hyphen merge in cleanup() rejoins it and then
    # re-runs clean_token, so this single-token form is the one that actually fires.
    (r"\bpost-?having\b", "post-halving"),
    # NOTE: every other October-pumps mishear is MULTI-WORD and lives in PHRASE_CORRECTIONS below.
    # --- new-bottom batch, 2026-07-25 ---
    # Whisper ALSO renders DAGKnight as ONE token ("Dagnight"/"Dagnite"), which the ("dag","night")
    # PHRASE rule can never match (it needs two tokens). Single-token forms belong here.
    (r"\bdagnight\b", "dagknight"), (r"\bdagnite\b", "dagknight"),
    # ton-gram-rename clip: Whisper renders "TON" as "tun" every single time ("TUN COIN", "so it's
    # TUN is the chain"). "tun" is not a word in this catalogue, so the global single-token fix is
    # safe, and it feeds the ("ton","coin") -> "toncoin" PHRASE rule below (phrases run AFTER
    # clean_token). The token formerly called Toncoin is now GRAM; Whisper hears it as "Graham"
    # (\b anchors mean the "gram" inside "telegram" is never touched).
    (r"\btun\b", "ton"),
    (r"\bgraham\b", "gram"),
    # --- peach-minute batch, 2026-07-29 ---
    # NOTE: "cast" -> "kaspa" deliberately does NOT live here. It was added as a global single-token
    # rule on 2026-07-29 and rescoped the same day: unlike casper/kasper/caspa (non-words in this
    # catalogue), "cast" IS a real word, and on Farcaster a post is literally called a "cast", so a
    # global rule would silently rewrite a legitimate token in some future batch. The evidence base
    # was also one livestream. It is a keyed PHRASE rule in PHRASE_CORRECTIONS instead.
]

# PHRASE corrections — applied to the TOKEN SEQUENCE, not to single tokens.
#
# ⛔ WHY THIS EXISTS (2026-07-23): CORRECTIONS above is applied by clean_token() to ONE word at a
# time, so ANY multi-word pattern placed there can never match and SILENTLY NO-OPS. Three real
# mishears shipped uncorrected exactly that way ("nine hood", "market cat", "any means") before this
# was caught. **Multi-word mishears go HERE, never in CORRECTIONS.**
#
# Each entry is (tuple-of-word-cores, replacement-words). Matching is on core() (letters+digits,
# lowercased) so punctuation and case never block a match. A 1-word replacement MERGES the matched
# tokens and keeps the whole span (first .t -> last .end); an N-word replacement rewrites in place.
# A replacement longer than the match is not supported (there are no timings to invent).
PHRASE_CORRECTIONS = [
    (("nine", "hood"), ["ninehood"]),
    (("market", "cat"), ["market", "cap"]),
    (("financial", "vice"), ["financial", "advice"]),
    (("any", "means"), ["any", "memes"]),
    (("stop", "buying", "up"), ["start", "buying", "up"]),
    (("new", "bottle"), ["new", "bottom"]),
    (("robin", "hood"), ["robinhood"]),
    (("robber", "hood"), ["robinhood"]),
    (("roba", "hood"), ["robinhood"]),
    (("post", "having"), ["post-halving"]),
    (("posts", "having"), ["post-halving"]),
    # --- kaspa 30bps batch, 2026-07-25 (Kaspa consensus terms Whisper garbles) ---
    (("dag", "night"), ["dagknight"]),        # DAGKnight, the 2026 consensus fork
    (("dag", "knight"), ["dagknight"]),
    (("ghost", "dag"), ["ghostdag"]),         # GHOSTDAG, the protocol it replaces
    (("dark", "night"), ["dark", "knight"]),  # the Batman analogy, not a dark night
    (("heart", "fork"), ["hard", "fork"]),
    (("heart", "forks"), ["hard", "forks"]),
    # CASCADING: fires on the SECOND pass, after ("dag","night") -> "dagknight" ("in the DAGKnight era").
    (("dagknight", "area"), ["dagknight", "era"]),
    # --- new-bottom batch, 2026-07-25 ---
    # "they're gonna get one LAST buy in September" — Whisper hears "last" as "less". "One less buy"
    # is not a thing anyone says about front-running a bottom; the phrase is always "one last buy".
    (("one", "less", "buy"), ["one", "last", "buy"]),
    # ton-gram-rename clip: after "tun" -> "ton", the coin name arrives as TWO tokens ("ton coin").
    # The chain is TON and the token is GRAM, so the two must stay visually distinct on screen:
    # "ton coin" MERGES to "toncoin", while a lone "ton" stays "ton".
    (("ton", "coin"), ["toncoin"]),
    # --- peach-minute batch, 2026-07-29 (zombie-confession clip) ---
    # "TARIFF season is what really changed me" — Whisper hears "terror season" (p=0.17). Verified on a
    # medium-model re-transcribe of 15.8-24.6s: "tariff season is where...". Nobody says "terror season".
    (("terror", "season"), ["tariff", "season"]),
    # "you think KASPA was gonna be a dollar" / "how much I wish KASPA will be a dollar" — this
    # livestream's audio makes Whisper render Kaspa as "cast". Keyed on the preceding verb rather
    # than applied globally: "cast" is a real English word AND a Farcaster term of art (a post is a
    # "cast"), so a bare \bcast\b rule would corrupt a legitimate token in a future batch. These two
    # pairs are the only occurrences in the peach-minute clips.
    (("think", "cast"), ["think", "kaspa"]),
    (("wish", "cast"), ["wish", "kaspa"]),
    # "running like MAD, like MAD, you know, MAD bulls running" — Whisper hears the name "Matt".
    # Keyed on the doubled phrase / the "mad bulls" pair so a REAL Matt (e.g. Matt Furie, who has his
    # own short in this repo) is never rewritten by a bare \bmatt\b rule.
    (("like", "matt", "like", "matt"), ["like", "mad", "like", "mad"]),
    (("matt", "bulls"), ["mad", "bulls"]),
    # Persona: the 50-week simple moving average is ALWAYS captioned "50-week SMA", never "50WMA",
    # never "50-week MA". 4 tokens -> 2 words (the trailing two token timings are dropped, which is
    # supported: the group simply ends earlier and the caption holds until the next chunk).
    (("50", "week", "moving", "average"), ["50-week", "sma"]),
    # --- peach-minute batch, 2026-07-29 (housecoin-still-holding clip) ---
    # "we got an email TODAY, Kraken is gonna delist..." — Whisper renders "today" as "to Decken"
    # (p=0.38 on a non-word). 2 tokens -> 1 merged word keeps the whole 1.32-2.44 s span.
    (("to", "decken"), ["today"]),
    # "I had somebody ASK IN the group" — heard as "as somebody acts in". 4 tokens -> 3 words
    # (the 4th timing is dropped, which is supported).
    (("as", "somebody", "acts", "in"), ["somebody", "asked", "in"]),
    # "should I just dump Housecoin, is it safe?" — heard as "should have just dumped ... as a safe".
    # Both rules are keyed tightly (the second on "housecoin") so no unrelated clip can match.
    (("should", "have", "just", "dumped"), ["should", "i", "just", "dump"]),
    (("housecoin", "as", "a", "safe"), ["housecoin", "is", "it", "safe?"]),
    (("theyre", "still", "got"), ["they", "still", "got"]),
    # "which is good for A MEME in a bear market" — Whisper drops the article (and the base model
    # heard "for me"). A replacement can never be LONGER than the match, so the article rides on the
    # preceding token; it renders as normal words on screen.
    (("good", "for", "meme"), ["good", "for a", "meme"]),
    # Multiples are ALWAYS captioned as digits: "a thousand X" -> "1000x" (cleanup()'s numeric merge
    # only fires on a literal digit token, so the spelled-out form needs this phrase rule).
    (("a", "thousand", "x"), ["1000x"]),
    # --- what-if-1000x batch, 2026-08-03 (1000x-math-ten-coins clip) ---
    # Housecoin is a named project with a real reference logo on disk; Whisper always splits it into
    # "house" + "coin". Same class as ("nine","hood") -> "ninehood".
    (("house", "coin"), ["housecoin"]),
    (("house", "coins"), ["housecoin"]),
    # Multiples as digits, spelled-out forms the numeric merge cannot reach ("a TWO X coin number
    # seven"). Keyed on the "<number> x" pair so a bare "five" / "two" is never rewritten.
    (("two", "x"), ["2x"]),
    (("five", "x"), ["5x"]),
    # "a lot of THOUSAND X'S out there" — plural multiple. core() strips the apostrophe, so the key
    # is ("thousand","xs"); the emitted text keeps it readable.
    (("thousand", "xs"), ["1000x's"]),
    # Money and market caps render as figures, not words: "a THOUSAND DOLLARS" -> "$1,000",
    # "a 900 K market cap" -> "900k" (cleanup()'s digit merge only fires on ""/"percent"/"x").
    (("a", "thousand", "dollars"), ["$1,000"]),
    (("900", "k"), ["900k"]),
    # "just go to the GOD DAMN moon" — one word on screen.
    (("god", "damn"), ["goddamn"]),
    # "10 different good COIN" — Whisper drops the plural s; he is describing ten coins.
    (("different", "good", "coin"), ["different", "good", "coins"]),
    # "and then maybe THE, your winner" — a false start that survives the tighten pass in the audio
    # but renders on screen as a standalone caption "maybe the, your". 4 tokens -> 3 words (the 4th
    # timing is dropped, which is supported). Keyed on the full four-token run so nothing else matches.
    (("maybe", "the", "your", "winner"), ["maybe", "your", "winner"]),
    # --- what-if-1000x batch, 2026-08-03 (lab-called-20x-did-353x clip) ---
    # Companion to ("two","x") above: "two X in my bag, THREE X in my bag".
    (("three", "x"), ["3x"]),
    # "a 20x off OF LAB" — Whisper (base AND medium) renders "of" as "a" every time. Keyed on the
    # LAB token so a legitimate "off a ..." elsewhere is never rewritten.
    (("off", "a", "lab"), ["off", "of", "lab"]),
    # "...off of LAB. THAT'S crazy, ended up doing 350x" — the whole-clip pass hears "as crazy",
    # which cannot open that clause. VERIFIED 2026-08-03 by re-transcribing the region in isolation
    # with medium three ways (2.6-5.6 s, 1.0-5.5 s, and 1.0-5.5 s at 0.7x): all three return
    # "THAT IS crazy", so the word is "that's" — not "it's". Keyed on the preceding "lab", so it
    # fires on the fixpoint pass AFTER the rule above rewrites "off a lab", and a real "as crazy as"
    # elsewhere is untouched.
    (("lab", "as", "crazy"), ["lab", "that's", "crazy"]),
    # "I had IT listed as a private gem" — the whole-clip pass garbles the word ORDER into "had to
    # list it" (base heard "had a listed"). VERIFIED 2026-08-03 by re-transcribing 4.5-9.5 s in
    # isolation with medium three ways (1x, 0.75x, and with a LAB-biased initial_prompt): all three
    # return "I had IT listed", so the word is "it", NOT "lab" — do not put "lab" on screen here.
    # 5 tokens -> 4 words (the 5th timing is dropped, which is supported).
    (("i", "had", "to", "list", "it"), ["i", "had", "it", "listed"]),
    (("i", "had", "a", "listed"), ["i", "had", "it", "listed"]),
    # ...as a private GEM (the private-gem list in his community), never a private jet.
    (("private", "jet"), ["private", "gem"]),
    # "IT was just nuts how that worked out" — heard as "I was just nuts", which puts the word on
    # Mike instead of on the trade.
    (("i", "was", "just", "nuts"), ["it", "was", "just", "nuts"]),
    # "the 85x ON PIPPIN" — heard as "on Pippen" (medium: "I'm pippin"). Keyed on the preceding word
    # so the basketball surname could never be rewritten by a bare token rule.
    (("on", "pippen"), ["on", "pippin"]),
    (("im", "pippin"), ["on", "pippin"]),
    # "selling this damn thing at like $25 or $27" — Whisper drops the $ on the FIRST price only, so
    # the pair renders as "25 or $27". Keyed on "like" so no bare number is ever touched.
    (("like", "25", "or"), ["like", "$25", "or"]),
    # --- what-if-1000x batch, 2026-08-03 (whatif-next-dogecoin clip) ---
    # "the next day it was listed on GATE AND MEXC" — Whisper renders the two exchange names as
    # "gate/gait and Mexi/maxi" on every pass. Both tails are non-names, and the receipt on Mike's
    # own screen-share reads "ahead of Gate.io and MEXC the next day", so the fix is verified.
    (("gate", "and", "mexi"), ["gate", "and", "mexc"]),
    (("gait", "and", "mexi"), ["gate", "and", "mexc"]),
    (("gate", "and", "maxi"), ["gate", "and", "mexc"]),
    (("gait", "and", "maxi"), ["gate", "and", "mexc"]),
    # "I mean, I'M SO TIRED of all these animals that keep coming out" — the shipped word pass heard
    # "I'm gonna go tired" (verified against a medium re-transcribe of 8.9-13.6 s, which returns
    # "I mean, I'm so tired of all these animals"). 4 tokens -> 3 words (4th timing dropped).
    (("im", "gonna", "go", "tired"), ["i'm", "so", "tired"]),
    # --- october-bottom batch, 2026-08-04 (kaspa-dip-bought-more clip) ---
    # Bitcoin price levels: Whisper always splits them into "<digits>" + "K" ("62 K", "40 K.",
    # "maybe 50 K,"). Same class as ("900","k") above — cleanup()'s digit merge only fires on
    # ""/"percent"/"x", so a thousands "k" needs a keyed pair here. Keyed on the exact number so no
    # bare digit is ever rewritten; the trailing punctuation rides along automatically.
    (("62", "k"), ["62k"]),
    (("40", "k"), ["40k"]),
    (("50", "k"), ["50k"]),
    # "...actually go below 2 cents. WOW, THIS GIVES AN opportunity to buy more." The shipped word
    # pass (base) heard "this guy's an opportunity", which is not English. VERIFIED 2026-08-04 across
    # FIVE 1x passes of this clip's own audio: base whole-clip "wow. this guy's an", medium whole-clip
    # "Wow. This guy has an", large-v3 on the FINAL MIX 47.9-50.4 s "Wow, this guy has an", medium on
    # an isolated 47.8-50.3 s "Well, I guess it's an", large-v3 on 46.3-50.5 s "um well there's guys
    # an". Every pass returns the same /g..z ən/ cluster before "opportunity"; "guy's"/"guy has" is
    # meaningless here (there is no "guy" in the clip, he is talking about the price dip), and the
    # three passes that include the leading word hear "wow". So only the VERB is rewritten:
    # "gives". Keyed on the 3-token run so a real "this guys ..." elsewhere could not match.
    (("this", "guys", "an"), ["this", "gives", "an"]),
    # --- october-bottom batch, 2026-08-04 (whatif-organic-dogecoin clip) ---
    # CashCat is a named project Whisper always splits ("cash cat"), same class as ("nine","hood").
    (("cash", "cat"), ["cashcat"]),
    # "CASHCAT GOT LISTED ON a whole bunch of centralized exchanges" — the shipped word pass heard
    # "Cash can listen to". VERIFIED 2026-08-04 by a medium re-transcribe of 39.9-43.4 s in isolation,
    # which returns verbatim "CashCat got listed on a whole bunch of centralized exchanges."
    (("cash", "can", "listen", "to"), ["cashcat", "got", "listed", "on"]),
    # "if this thing is trading above a market cap OF CASHCAT" — heard as "of cash cap". Keyed on the
    # preceding "of" so a real "cash cap" (none in this catalogue) is never rewritten blind; the
    # referent is the same CashCat market cap he names 14 s earlier ("flip cash cat").
    (("of", "cash", "cap"), ["of", "cashcat"]),
    # "the next day it was GATE and then MEXC" — companion to the gate/mexi pairs above; this clip's
    # word pass renders the tail as "Maxie"/"maxi" with a "then" between the two exchange names.
    (("gate", "and", "then", "maxie"), ["gate", "and", "then", "mexc"]),
    (("gate", "and", "then", "maxi"), ["gate", "and", "then", "mexc"]),
    (("gait", "and", "then", "maxie"), ["gate", "and", "then", "mexc"]),
    (("gait", "and", "then", "maxi"), ["gate", "and", "then", "mexc"]),
    # HTX arrives as three tokens ("H" + ".T" + ".X."); the hyphen/decimal merges cannot reach a
    # leading "." on a non-numeric token, so it would render on screen as "h .t .x.". Merged here.
    (("h", "t", "x"), ["htx"]),
    # Market caps render as FIGURES, not spelled-out words (same rule class as ("900","k") -> "900k").
    # All three numbers verified by isolated medium re-transcribes 2026-08-04: 12.2-14.3 returns
    # "The high is 169 million", 14.9-17.0 returns "The high is $353 million", 16.6-19.0 returns
    # "and over here the high is 1.8 billion" — which also confirms "the highest" is "the high is".
    # Emitted in the "900k" short form so each figure survives as ONE token: a group holding the
    # 7-char word "million" caps at 3 words and strands "million." alone on screen for ~1s, while
    # "169m." is <=4 chars, so the whole line "the high is 169m." rides one caption chunk.
    (("the", "high", "is", "one", "hundred", "sixty", "nine", "million"),
     ["the", "high", "is", "169m"]),
    (("the", "highest", "three", "hundred", "fifty", "three", "million"),
     ["the", "high", "is", "353m"]),
    (("the", "high", "is", "one", "point", "eight", "billion"), ["the", "high", "is", "1.8b"]),
    # --- october-bottom batch, 2026-08-04 (ring-of-fire-meme-judgment clip) ---
    # The EXCHANGE is MEXC; Whisper hears "maxi" on every pass (base word pass p 0.42/0.55, a medium
    # re-transcribe of 6.9-11.7 s returns "got like maxi ... on maxi"). NOT a global \bmaxi\b rule:
    # "maxi" is a real crypto word ("Bitcoin maxi"), so both occurrences are keyed on their 3-token
    # run. Same class as the gate/mexi pairs above; the clip's tighten log carries the same gate.
    (("got", "like", "maxi"), ["got", "like", "mexc"]),
    (("get", "on", "maxi"), ["get", "on", "mexc"]),
    # "there's some freaking 500 K market cap" — thousands split, same keyed-pair class as ("62","k").
    (("500", "k"), ["500k"]),
    # "...500k market cap, BUT IT doesn't, it only goes down down down" — the base word pass hears
    # "market capital that doesn't", which is not English. VERIFIED 2026-08-04 by a medium
    # re-transcribe of 16.6-21.6 s in isolation, which returns verbatim "it's a freaking 500k market
    # cap, but it doesn't it only goes down down". Keyed on the full four-token run.
    (("market", "capital", "that", "doesnt"), ["market", "cap", "but it", "doesn't"]),
    # "the projects that actually make money other than THEIR CRYPTO" + the tightener's elision join.
    # The clip's base pass renders the span as "other than the crib, three the 58x on velvet" (the
    # "three" is the first syllable of the elided restatement). The livestream master transcript reads
    # "make money other than their crypto" at 1384.54, and a medium pass on the clip returns "other
    # than their crib through". 4 tokens -> 3 words (the 4th timing is dropped, which is supported),
    # and the added period breaks the caption group exactly on the elision join.
    (("the", "crib", "three", "the"), ["their", "crypto.", "the"]),
    # "and then THE MONTH BEFORE THAT, 350x on LAB" — the base pass hears "the monthly for that", a
    # 0.6x pass hears "the mafia for that". The livestream master transcript reads "and then the month
    # before that 350x on lab" verbatim at 1391.16, in full context.
    (("the", "monthly", "for", "that"), ["the", "month", "before", "that"]),
    # "those are real PROJECTS" — the tighten elision starts mid-word, so the clip pass drops the
    # plural s ("those are real project."). The master transcript reads "those are real projects".
    (("are", "real", "project"), ["are", "real", "projects"]),
    # --- october-bottom batch, 2026-08-04 (october-mandela-myth clip) ---
    # Compound multiplier of a noun: Whisper emits "four" + "year" as two separate tokens (NOT as the
    # "-year" hyphen continuation cleanup() already handles), so "four year cycle" can straddle two
    # caption chunks and render as a bare "year cycle". Merging keeps the whole span and puts the
    # house spelling "four-year cycle" on screen. Both occurrences in this clip (11.04 s "a four-year
    # cycle even unrelated to Bitcoin" and 77.16 s "all your four-year cycle zombies") are fixed by it.
    (("four", "year"), ["four-year"]),
    # "It's a SIX out of 12 months" — Whisper hears "sick" on BOTH passes (base word pass p 0.83 at
    # 63.68 s; a medium re-transcribe of 62.80-65.40 s returns "It's a sick out of twelve months,
    # it's the sex"). He is ranking October 6 of 12, and his own slide on screen reads "6th Worst".
    # "sick out of" is not an English phrase, so the 3-token key can never match anything legitimate.
    (("sick", "out", "of"), ["six", "out", "of"]),
    # "The two events spread across 90 years is not a pattern, it's an OUTLIER." Three neutral 1x
    # passes (the shipped word pass p 0.63, medium on 55.90-58.90 s, medium on 53.60-58.60 s) all
    # return the non-sequitur "outline"; a medium 1x pass over the SAME 53.60-58.60 s audio with a
    # market-statistics initial_prompt returns "...is not a pattern, it's an outlier", which is also
    # what the clip-strategist recorded off the master transcript. Keyed on the full four-token run
    # (never a bare "an outline") so a legitimate "an outline" elsewhere is untouched.
    (("pattern", "its", "an", "outline"), ["pattern.", "it's", "an", "outlier"]),
    # --- october-bottom batch, 2026-08-04 (cooper-robinhood-real-dog clip) ---
    # Market cap thousands: Whisper splits "a 237 K market cap" into "237" + "K" (46.70-47.78 s,
    # p 0.98 / 0.73). Same keyed-pair class as ("62","k")/("900","k") — cleanup()'s digit merge only
    # fires on ""/"percent"/"x". This is the payoff number of the clip (he self-corrects from a
    # mis-spoken "2.37 market cap"), so it must land on screen as ONE token, "237k".
    (("237", "k"), ["237k"]),
    # NOT corrected, deliberately (cooper-robinhood-real-dog): the batch gate listed 'armstorms' ->
    # Armstrong's, 'bryan' -> Brian and 'russle' -> Russell. All three are NO-OPS against THIS clip's
    # own whisper-words.json, which already reads " Brian" (p 0.79) + " Armstrong's" (p 0.75) at
    # 18.90-19.94 s and " Russell" (p 0.98 / 0.99 / 0.84) at 51.98, 52.52 and 56.66 s. ("robin","hood")
    # -> ["robinhood"] above already covers this clip's four "Robin Hood" splits. Do not add rules.
    # NOT corrected, deliberately (october-mandela-myth): the delegated batch gate listed
    # "every remembers" -> "everybody remembers", "October return positive" -> "October returned
    # positive" and "the Nelson Mandela" -> "Nelson Mandela". All three were checked against THIS
    # clip's own whisper-words.json and are NO-OPS: the word pass already reads "everyone remembers"
    # (p 0.88, and a medium re-transcribe of 47.20-52.60 s returns "everyone remembers 1929 and
    # 1987"), already reads "returned" (p 0.81), and already reads "believe that Nelson Mandela"
    # (confirmed by a medium pass on 24.80-30.40 s). Forcing "everybody" would put a word on screen
    # that no 1x pass produced. Do not add rules for them.
    # NOT corrected, deliberately: "so they launched and then suddenly THEY'RE GOING TO LISTEN TO all
    # these centralized exchanges" (28.9-31.1 s) reads like "getting listed on", and the batch plan
    # flagged it as a likely garble. FOUR 1x medium passes on this clip's own audio (28.6-31.4,
    # 27.2-32.6, the same span at 0.85x, and a pass with an exchange-listing initial_prompt) ALL
    # return "they're going to listen to all these centralized exchanges". Same precedent as the
    # whatif-next-dogecoin closing line below: never ship words no 1x pass produced.
    # --- eliza batch, 2026-08-07 (trading-against-ourselves clip) ---
    # NO NEW RULES NEEDED, verified. The batch caption gate listed exactly one correction for this
    # clip, "Robin Hood" -> "Robinhood" at four points, and ("robin","hood") -> ["robinhood"] above
    # already covers all four occurrences in the clip's own whisper-words.json (10.52, 29.70, 44.54,
    # 64.44 s). The gate's PROTECTED anaphora also need no rule and must NOT be deduped: cleanup()
    # only collapses ADJACENT duplicate tokens, and neither "which happens every bear market" x2
    # (76.84-79.38 s) nor "there's more people checking out" x2 (79.72-83.48 s) contains an adjacent
    # repeat, so both survive verbatim through the tool. Confirmed on the built array.
    # NOT corrected, deliberately: the clip's first caption reads "and my concern", but the master
    # transcript shows the preceding sentence is "...I have this this kind of a concern." and the cut
    # opens on "My concern is that" (relock 598.08, master word onset 598.24). The 0.22 s the clip's
    # own pass labels " And" (p 0.35) is the 40 ms tail of that previous "concern." plus the gap. A
    # 1x pass on the CLIP's audio produces "And" on every run, so the caption matches the render's
    # own whisper-verify; there is also no way to DELETE a token via PHRASE_CORRECTIONS (a
    # replacement may never be longer or shorter than 1 word per matched token). Left as built and
    # reported to Mike instead of hand-editing the tool's output.
    # --- eliza batch, 2026-08-07 (phantom-hack clip) ---
    # The 6.4-21.5 s WALLET-DRAIN scene is captioned FROM AUDIO by batch mandate (the clip-plan flags
    # the master transcript there as word salad). Every rule below was resolved by re-transcribing the
    # span IN ISOLATION off this clip's own final spine with large-v3, and with medium.en wherever
    # large-v3 disagreed with itself. Each key is a run that occurs only in this clip.
    # "the one would just FLIP out of the way" — the shipped word pass hears "would just flipping",
    # which is not English, so only the VERB FORM is fixed and the auxiliary is left alone. "would"
    # is what the shipped pass, medium.en whole-clip (mix AND spine) and medium.en on an isolated
    # 11.3-13.7 s all hear (4 passes); only large-v3 offers "was"/"we're" (2). Do not rewrite the
    # auxiliary on the weaker evidence - habitual "would just flip" is exactly how he tells it.
    (("one", "would", "just", "flipping"), ["one", "would", "just", "flip"]),
    # "and the tokens WERE shifting up" — shipped pass hears "are"; large-v3 whole-clip, large-v3 on
    # 4.5-22.5 s AND the livestream master transcript all read "were".
    (("tokens", "are", "shifting"), ["tokens", "were", "shifting"]),
    # "I went into my Phantom WALLET" — the final syllable is swallowed, so three passes render the
    # word as "wall" (not a thing anyone says). large-v3 on an isolated 20.0-30.5 s and the master
    # transcript both read "wallet". The period is added because the sentence genuinely ends there.
    (("phantom", "wall"), ["phantom", "wallet."]),
    # "...and I saw this, SENT MY— all the tokens that were still there" — a 0.3 s false start that the
    # shipped pass renders as "said my". Every pass garbles it differently (base "said my", large-v3
    # "send my", medium.en "they sent my"), i.e. it is noise, so the three tokens MERGE into the
    # sentence they interrupt rather than putting invented words on screen.
    (("this", "said", "my"), ["this."]),
    # He is narrating a past event: "...that were still there and SENT them away". The shipped pass
    # renders the present tense; medium.en on an isolated 24.7-26.5 s hears "I sent them away".
    (("and", "send", "them", "away"), ["and", "sent", "them", "away"]),
    # "I HAD A privacy and VPN company back from 2010" — the shipped pass opens the sentence with the
    # non-word "Add a". large-v3 whole-clip reads "i had a privacy and vpn company", and the clip's own
    # tighten plan records the cut join as "...things like that" -> "I had a privacy and VPN company".
    (("add", "a", "privacy"), ["i had", "a", "privacy"]),
    # "That's why I tell people this. YOU GOTTA, FOR NUMBER ONE, you try to stay away from hot wallets."
    # The shipped pass reads "you got a number for number one" (flagged by the batch as a suspected
    # mishear of "you gotta remember, for number one"). Five passes on this clip's own audio (the
    # shipped pass, large-v3 on 57.5-66.5, on 60.4-64.8 and on a tight 61.2-63.6, plus medium.en on the
    # tight window) settle it: "gotta" is real, and NOT ONE pass hears "remember", so "remember" is not
    # put on screen. 7 tokens -> 5 words (the last two timings are dropped, which is supported); the
    # added period breaks the caption group exactly where the clause does.
    (("you", "got", "a", "number", "for", "number", "one"),
     ["you", "gotta,", "for", "number", "one."]),
    # OneKey is a named hardware-wallet product; Whisper splits it on both occurrences (71.46 s and
    # 76.52 s). Same class as ("nine","hood") -> "ninehood" and ("house","coin") -> "housecoin".
    (("one", "key"), ["onekey"]),
    # "you have your BROWSER ADD-ON OneKey extension" — the compound arrives as two bare tokens, so it
    # would render as "browser add on". 3 tokens -> 2 words (the third timing is dropped).
    (("browser", "add", "on"), ["browser", "add-on"]),
    # The deliberate HARD-OUT: "so you're okay. BUT I would just stay away." The shipped pass hears
    # "Like I would"; large-v3 whole-clip, the master transcript AND the whisper-verify of the final
    # RENDER all read "but".
    (("okay", "like", "i", "would"), ["okay.", "but", "i", "would"]),
    # NOT corrected, deliberately (eliza/phantom-hack), two calls that were tested to exhaustion:
    #  - "and then another one flipped out of the way and SHIPPED OUT" (15.84 s). The batch gate
    #    flagged this word as possibly the token SHIB (the screen-share behind the clip happens to be
    #    a CoinMarketCap Shiba Inu page, which is where that suspicion came from). It is NOT SHIB and
    #    it is not "shift up" either. SIX passes on this clip's own audio return "shipped out": the
    #    shipped word pass, large-v3 whole-clip, large-v3 on 4.5-22.5 s, and three isolated passes on
    #    15.0-17.0 s - INCLUDING one primed with a SHIB-biased initial_prompt and one primed with a
    #    "the token list shifts up" prompt, neither of which could make either model produce those
    #    words. (medium.en's whole-file "shift up" is a context-smoothing artifact: the same model on
    #    the isolated window returns "shipped out".) No token is named anywhere in this clip.
    #  - "and IT was like, how does this happen?" (27.06 s). The batch gate flagged the master
    #    transcript's "then it was like" as probably "then I was like". Nobody hears an "I": the
    #    shipped pass, large-v3 on 20.0-30.5 s, large-v3 on 22.6-28.2 s and large-v3 on a tight
    #    26.4-28.0 s all return "and it was like". Do not add a rule for either.
    # Closing line — NO RULE, deliberately. An earlier build added
    #   (("robinhood","lists","what","if","right"), ["robinhood","lists","it","and it","runs"])
    # off the ORIGINAL master transcript ("lists run it"). RE-VERIFIED 2026-08-03 on this clip's own
    # audio and REMOVED: four separate 1x medium passes (the shipped word pass, an isolated
    # 61.3-64.8 s re-transcribe, an 0.8x pass, and a pass on the UNTIGHTENED source with full
    # surrounding context) all return "What if Robin Hood lists WHAT IF, right?" — Mike naming the
    # token, which is exactly how the rest of the clip captions it ("with the what if is", "even what
    # if might be"). Only TIME-STRETCHED passes (0.5x/0.65x/0.7x, an artifact-prone transform) hear
    # "run it". Shipping "lists it and it runs" would put words on screen that no 1x pass produced
    # and would fail the final-render whisper-verify. Do not re-add it.
]


def apply_phrases(words, _passes=4):
    """Rewrite multi-word mishears on the token sequence. Runs AFTER cleanup().

    Runs to a FIXPOINT (bounded): one correction can CREATE the input of another
    ("dag night area" -> "dagknight area" -> "dagknight era"), and a single pass never
    re-scans a token it just emitted. Existing non-cascading rules are unaffected (a second
    pass over already-corrected text is a no-op), so this cannot change past output.
    """
    for _ in range(_passes):
        nxt = _apply_phrases_once(words)
        if [ (w["t"], w["w"]) for w in nxt ] == [ (w["t"], w["w"]) for w in words ]:
            return nxt
        words = nxt
    return words


def _apply_phrases_once(words):
    out, i = [], 0
    while i < len(words):
        hit = None
        for key, rep in PHRASE_CORRECTIONS:
            n = len(key)
            if i + n <= len(words) and tuple(core(w["w"]) for w in words[i:i + n]) == key:
                hit = (n, rep)
                break
        if not hit:
            out.append(words[i])
            i += 1
            continue
        n, rep = hit
        span = words[i:i + n]
        # Carry the LAST matched token's trailing punctuation onto the replacement: grouping
        # breaks on [.?!], so dropping it silently welds two sentences into one caption
        # ("Dag Night. It's" -> "dagknight it's", kaspa 30bps 2026-07-25).
        tail = re.search(r"[.,?!]+$", span[-1]["w"].strip())
        tail = tail.group(0) if tail else ""
        rep = list(rep)
        if tail and not re.search(r"[.,?!]+$", rep[-1]):
            rep[-1] = rep[-1] + tail
        if len(rep) == 1:
            out.append({"t": span[0]["t"], "end": span[-1]["end"], "w": rep[0]})
        else:
            for w, r in zip(span, rep):
                out.append({"t": w["t"], "end": w["end"], "w": r})
        i += n
    return out
# Leading syllable Whisper mishears as a word when it splits "Bittensor" in two. Merged into the
# following "bittensor" token ONLY when it is a sub-0.18s blip butted straight against it (a real
# spoken "but"/"the" is longer and has a gap) — same class of fix as pre + mine -> premine.
BIT_SYLLABLE = {"bit", "but", "bid", "the"}
# "m" added 2026-07-25: Whisper emits a bare " M." for a closed-mouth hum at a clip head (real case:
# ton-gram-rename frame 0, which would have rendered the first caption as "m. i just"). A standalone
# single-letter "m" token is always that hum, never a word — same class as "mm"/"hmm".
FILLER = {"uh", "um", "uhh", "umm", "mm", "hmm", "m"}

# DELIBERATE persona doublings that must SURVIVE cleanup()'s stutter collapse (2026-08-07).
#
# ⛔ WHY THIS EXISTS: cleanup() drops a token whose core repeats the previous one ("not, not, not"),
# which is right for a stutter and WRONG for one of Mike's emphasis doublings. An ALTERNATING
# doubling ("I don't, I don't fool around with") already survives, because the repeat is never
# adjacent — but an IMMEDIATE one does not, and the tighten pass explicitly PROTECTS some of those
# ("use, use an app, an app" and "don't, don't use a Chrome extension" are listed as KEPT persona
# doublings in eliza/tighten-plan.json, i.e. the audio was deliberately left uncut). Deduping them in
# the captions would silently undo that editorial decision.
#
# Each entry is a tuple of word cores. Every token inside a matched run is exempt from the collapse;
# everything else still collapses exactly as before, so no past output can change. Key the run tightly
# (include the words AROUND the doubling) so an unrelated stutter is never spared.
PROTECTED_DOUBLES = [
    ("use", "use", "an", "app"),            # eliza/phantom-hack 66.62-67.48 s
    ("dont", "dont", "use", "a", "chrome"),  # eliza/phantom-hack 68.64-69.64 s
]


def _protected_idx(norm):
    """Indices of `norm` that sit inside a PROTECTED_DOUBLES run (exempt from stutter collapse)."""
    prot, cores = set(), [core(w["w"]) for w in norm]
    for key in PROTECTED_DOUBLES:
        n = len(key)
        for i in range(len(cores) - n + 1):
            if tuple(cores[i:i + n]) == key:
                prot.update(range(i, i + n))
    return prot


def clean_token(w):
    t = w.strip().lower()
    for pat, rep in CORRECTIONS:
        t = re.sub(pat, rep, t)
    return t


def core(w):
    return re.sub(r"[^a-z0-9]", "", w.lower())


def load_words(path):
    data = json.load(open(path, encoding="utf-8"))
    out = []
    for seg in data["segments"]:
        for w in seg.get("words", []):
            tok = w["word"].strip()
            if tok:
                out.append({"w": tok, "start": w["start"], "end": w["end"]})
    return out


def transcribe(video):
    with tempfile.TemporaryDirectory() as td:
        wav = os.path.join(td, "a.wav")
        subprocess.run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-i", video,
                        "-vn", "-ar", "16000", "-ac", "1", wav], check=True)
        subprocess.run([WHISPER, wav, "--model", "small", "--language", "en", "--output_format", "json",
                        "--word_timestamps", "True", "--output_dir", td, "--fp16", "False"],
                       capture_output=True, text=True)
        return load_words(os.path.join(td, "a.json"))


def cleanup(raw):
    """Shared cleanup: corrections, drop fillers, merge premine / NN% / NNx, collapse stutters."""
    words, i = [], 0
    norm = [{"t": round(w["start"], 3), "end": round(w["end"], 3), "w": clean_token(w["w"])} for w in raw]
    prot = _protected_idx(norm)
    while i < len(norm):
        cur = norm[i]; c = core(cur["w"])
        if c in FILLER:
            i += 1; continue
        if c == "pre" and i + 1 < len(norm) and core(norm[i+1]["w"]) in {"mind", "mine"}:
            words.append({"t": cur["t"], "end": norm[i+1]["end"], "w": "premine"}); i += 2; continue
        # "bit-" syllable + bittensor -> bittensor. Whisper splits "Bittensor" and renders the "bit-"
        # as a word ("But Tenzer", "the Tenser"). Merge ONLY a sub-0.18s blip butted straight against
        # the following bittensor token: a genuinely spoken "but"/"the" is longer AND has a gap, so a
        # real "but bittensor is going to be big" survives intact.
        if (c in BIT_SYLLABLE and i + 1 < len(norm) and core(norm[i+1]["w"]) == "bittensor"
                and (cur["end"] - cur["t"]) <= 0.18 and (norm[i+1]["t"] - cur["end"]) <= 0.02):
            words.append({"t": cur["t"], "end": norm[i+1]["end"], "w": "bittensor"}); i += 2; continue
        if re.fullmatch(r"\d+", c) and i + 1 < len(norm):
            nxt = core(norm[i+1]["w"])
            if nxt in {"", "percent"} or norm[i+1]["w"].strip().startswith("%"):
                words.append({"t": cur["t"], "end": norm[i+1]["end"], "w": c + "%"}); i += 2; continue
            if nxt == "x":
                words.append({"t": cur["t"], "end": norm[i+1]["end"], "w": c + "x"}); i += 2; continue
        # Decimal continuation: Whisper splits a decimal number into TWO tokens, "2" + ".7"
        # (same failure class as the hyphen continuation below). Grouping can then open a caption
        # with a bare ".7 cents", and the price the whole short is about reads as two fragments.
        # Merge the tail into the previous numeric token and keep the whole span.
        # (new-bottom / kaspa-dagknight-100x, 2026-07-25: "it's at 2 .7 cents".)
        if (re.fullmatch(r"\.\d+[.,!?]*", cur["w"].strip()) and words
                and re.fullmatch(r"\d+", core(words[-1]["w"]))):
            words[-1]["w"] = words[-1]["w"].rstrip() + cur["w"].strip()
            words[-1]["end"] = cur["end"]
            i += 1; continue
        # Hyphen continuation: Whisper emits compound words as TWO tokens, "front" + " -run",
        # "four" + " -year". Grouping can then land the tail in its OWN caption, which renders on
        # screen as a bare "-run." (5 such captions shipped in October-pumps clip 2 before this was
        # caught, 2026-07-23). Merge the tail back into the previous word and keep the whole span.
        # The merge happens AFTER clean_token(), so it can CREATE a token no correction has seen
        # ("post" + "-having" -> "post-having", which shipped uncorrected). Re-run the corrections
        # on the merged token.
        if cur["w"].strip().startswith("-") and len(cur["w"].strip()) > 1 and words:
            words[-1]["w"] = clean_token(words[-1]["w"].rstrip() + cur["w"].strip())
            words[-1]["end"] = cur["end"]
            i += 1; continue
        if words and core(words[-1]["w"]) == c and c and i not in prot:
            i += 1; continue
        words.append({"t": cur["t"], "end": cur["end"], "w": cur["w"]}); i += 1
    return words


def build_montserrat(words, var, colorize, max_words=3, max_short=5):
    # word caps: max_words normally, up to max_short if every word in the group is very small (<=4 chars).
    # Defaults 3/5 = shorts. LONGFORM-EDITED uses 2/4 (Mike, 2026-06-17) -> --max-words 2 --max-short 4.
    def is_short(x): return len(re.sub(r"[^a-z0-9]", "", x["w"].lower())) <= 4
    chunks, cur = [], []
    for j, w in enumerate(words):
        # decide the cap from the group INCLUDING w, then flush BEFORE adding if it would overflow
        tentative = cur + [w]
        cap = max_short if all(is_short(x) for x in tentative) else max_words
        if cur and len(tentative) > cap:
            chunks.append(cur); cur = [w]
        else:
            cur = tentative
        gap_next = (words[j+1]["t"] - w["end"]) if j+1 < len(words) else 99
        if gap_next > 0.45 or re.search(r"[.?!]$", w["w"]):
            chunks.append(cur); cur = []
    if cur:
        chunks.append(cur)

    def colour(tok):
        clean = tok.lower().strip(".,!?'\"")
        for tag, words_ in colorize.items():
            if clean in words_:
                return f"<{tag}>{tok}</{tag}>"
        return tok

    lines = [f"export const {var}: {{ t: number; h: string }}[] = ["]
    for c in chunks:
        text = " ".join(colour(x["w"]) for x in c)
        text = re.sub(r"\s+([.,?!%])", r"\1", text)
        text = re.sub(r"[,]+$", "", text).strip().replace("'", "\\'")
        lines.append(f"  {{ t: {c[0]['t']:6.2f}, h: '{text}' }},")
    lines.append("];")
    return "\n".join(lines)


def build_arial_black(words):
    MAX_WORDS, MAX_SECS = 4, 1.6
    groups, cur = [], []

    def flush():
        if cur:
            groups.append({
                "text": re.sub(r"[.,!?]", "", " ".join(x["w"] for x in cur).upper()),
                "start": cur[0]["t"], "end": cur[-1]["end"],
                "words": [{"w": re.sub(r"[.,!?]", "", x["w"].upper()), "start": x["t"], "end": x["end"]} for x in cur],
            })
    for w in words:
        if cur and (len(cur) >= MAX_WORDS or (w["end"] - cur[0]["t"]) > MAX_SECS):
            flush(); cur = []
        cur.append(w)
        if re.search(r"[.!?]$", w["w"]):
            flush(); cur = []
    flush()
    return json.dumps(groups, indent=2, ensure_ascii=False)


def main():
    ap = argparse.ArgumentParser()
    src = ap.add_mutually_exclusive_group(required=True)
    src.add_argument("--words", help="whisper word-timestamps JSON")
    src.add_argument("--transcribe", help="video/audio file to transcribe with local whisper")
    ap.add_argument("--style", required=True, choices=["montserrat", "arial-black"])
    ap.add_argument("--var", default="CAPTIONS", help="TS const name (montserrat)")
    ap.add_argument("--colorize", default="", help="montserrat tags, e.g. 'g=kaspa,tao y=353x,58x'")
    ap.add_argument("--max-words", type=int, default=3, help="montserrat: max words/line (longform=2)")
    ap.add_argument("--max-short", type=int, default=5, help="montserrat: max if all words small (longform=4)")
    ap.add_argument("--out", help="output file (default stdout)")
    args = ap.parse_args()

    raw = transcribe(args.transcribe) if args.transcribe else load_words(args.words)
    words = apply_phrases(cleanup(raw))
    print(f"clean words: {len(words)}  end: {words[-1]['end']:.2f}s", file=sys.stderr)

    if args.style == "montserrat":
        colorize = {}
        for part in args.colorize.split():
            if "=" in part:
                tag, ws = part.split("=", 1)
                colorize[tag] = set(w.lower() for w in ws.split(",") if w)
        out = build_montserrat(words, args.var, colorize, args.max_words, args.max_short)
    else:
        out = build_arial_black(words)

    if args.out:
        os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
        open(args.out, "w", encoding="utf-8").write(out + "\n")
        print(f"wrote {args.out}", file=sys.stderr)
    else:
        print(out)


if __name__ == "__main__":
    main()
