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
    # Benjamin COWEN (crypto analyst). Whisper writes the surname "Cowan" (batch pieverse clip 2,
    # x2 at 31.98 / 35.36 s; the clip-plan's stt_caption_fixes names the fix). Same class as
    # "sailor" -> "saylor": a person's name, never an English word in this domain.
    (r"\bcowan\b", "cowen"),
    (r"\btau\b", "tao"),   # Mike says "tau" for $TAO; the ticker is ALWAYS TAO, never "tau"
    (r"\bzbank\b", "zbcn"), (r"\bzbcm\b", "zbcn"),   # Zebec token is ZBCN (Whisper: "ZBank"/"ZBCM")
    (r"\bthapalia\b", "thapaliya"),   # founder Sam Thapaliya (Whisper: "Thapalia")
    (r"\btok+at+a\b", "toccata"), (r"\btocata\b", "toccata"),   # Kaspa "Toccata" hardfork (Whisper: "Tokata")
    (r"\bk[cr]20s?\b", "krc20"), (r"\bkc\s*20s?\b", "krc20"),   # KRC20 (Whisper: "KC20"/"KR20")
    (r"\bcroak\b", "kroak"),       # Kroak (KRC20 meme; Whisper hears "croak")
    (r"\bslippery\b", "slippy"),   # Slippy (KRC20 meme; Whisper hears "Slippery")
    (r"\bhooker\b", "hookr"),   # HOOKR token (Mike SAYS "hooker"; the ticker is spelled HOOKR).
                                   # Same class as kroak/slippy above: an English word that is
                                   # never the literal word in this catalogue, only ever the
                                   # token. Mike, 2026-09-07, biggest-bullrun clip 8.
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
    # --- tutorial batch, 2026-08-09 (robinhood-meme-rankings, clip 2) ---
    # TOSHI, Brian Armstrong's cat (the Base meme token Mike name-checks as the Cooper comparison:
    # "it gives me that Toshi vibe, being the cat of Brian Armstrong"). The clip's own pass renders it
    # " toshie"; medium.en on an isolated 32.5-38.5 s window reads " Toshi" (p 0.90) and the clip plan
    # quotes the line with Toshi. "toshie" is not a word in this catalogue, so the single-token global
    # fix is safe, and unlike a casing fix it is VISIBLE (the montserrat preset lowercases everything,
    # so only the spelling change reaches the screen).
    (r"\btoshie\b", "toshi"),
    # --- last-year batch, 2026-08-11 (meme-fud-130x, clip 1) ---
    # PENGU, the Pudgy Penguins token. Whisper renders it "pingu" on every pass in this livestream
    # (the clip's own pass at 10.04 s and 32.36 s, and the MASTER at 116.x). "Pingu" is a claymation
    # penguin cartoon and is not a token in this catalogue, so the global single-token fix is safe;
    # the batch tighten log lists "'pingu' -> Pengu" as a mandated caption-time STT fix. Same class
    # as the toshie/croak/slippery entries above, and unlike a casing fix it is VISIBLE (the
    # montserrat preset lowercases everything via CSS, so only the spelling reaches the screen).
    (r"\bpingu\b", "pengu"),
    # --- cooper-50x batch, 2026-08-15 (pmi-expansion-first clip 6, pmi-never-before clip 7) ---
    # The ISM manufacturing PMI. Whisper welds the two acronyms into ONE token, "ISMPMI", on every
    # occurrence in this livestream (clip 6's own pass at 13.84 / 18.00 / 22.16 / 31.96 / 46.04 s and
    # the MASTER at 3422.89, 3482.33, 3487.81, 3497.53, 3511.19); the batch caption-corrections file
    # mandates it as "ISM PMI". "ismpmi" is not a word, so the global single-token fix is safe, and
    # the space inside the replacement is the same shape as the ("good","for","meme") -> "for a"
    # entry below (one TOKEN, two rendered words). Casing is invisible under the montserrat preset,
    # so only this SPLIT changes anything on screen.
    (r"\bismpmi\b", "ism pmi"),
    # --- btc-next-week batch, 2026-08-17 (what-if-greatest-meme-full clip 1) ---
    # Robinhood, welded into ONE token by this clip's own medium pass ("robberhood" at 52.90 s p 0.57
    # and 70.14 s p 0.08, i.e. the model has nothing). The existing ("robber","hood") PHRASE rule
    # cannot fire on a single token, so the SPLIT renderings and this welded one need separate
    # entries - exactly the class the DAGKnight ("dagnight") entry above documents. "robberhood" is
    # not a word in any catalogue, so the global single-token fix is safe, and the batch's tighten
    # plan mandates it ("'robber hood' -> Robinhood" at master 2421.8 / 2436.2 / 2453.6 / 2518.4 s).
    (r"\brobberhood\b", "robinhood"),
    # --- peach-minute batch, 2026-07-29 ---
    # NOTE: "cast" -> "kaspa" deliberately does NOT live here. It was added as a global single-token
    # rule on 2026-07-29 and rescoped the same day: unlike casper/kasper/caspa (non-words in this
    # catalogue), "cast" IS a real word, and on Farcaster a post is literally called a "cast", so a
    # global rule would silently rewrite a legitimate token in some future batch. The evidence base
    # was also one livestream. It is a keyed PHRASE rule in PHRASE_CORRECTIONS instead.
    # --- my-new-100x batch, 2026-08-28 (kaspa-lambo-color-argument, clip 8) ---
    # CYAN. Mike pronounces it with a hard onset and EVERY decoder in this repo hears the car brand
    # "Scion": this clip's own medium word pass renders it "scion"/"Scion" all EIGHT times it is
    # spoken ("a greenish scion color", "greenish scion", "he told me it's scion", "it's not scion",
    # "five different shades of scion", "Casper's color was scion", "his greenish scion", "greenish
    # scion"), and small.en's whole-file pass of the same spine reads "cyan" in every one of those
    # positions. persona.json (`kaspa_color_cyan_not_scion`, added the same day) makes this a
    # STANDING rule, not a per-clip call: "scion" in any transcript is an STT mishear and must NEVER
    # reach a caption, tweet, title or queue file - the Toyota sub-brand has nothing to do with this
    # catalogue, so the global single-token fix is safe. Same class as toshie/croak/slippery/pingu,
    # and unlike a casing fix it is VISIBLE (the montserrat preset lowercases everything via CSS, so
    # only the spelling reaches the screen).
    (r"\bscions?\b", "cyan"),
    # --- tendies batch, 2026-09-03 (tendies-crypto-com-ath, clip 3) ---
    # TENDIES, the Robinhood-chain meme coin this whole clip is about (DexScreener breadcrumb on the
    # clip's own picture: "Robinhood > Uniswap v3", pair TENDIES/WETH). Whisper renders the name as a
    # possessive non-word, "Tendis"/"Tendi's", every time it is spoken as a single token in this
    # spine (13.18 s and 19.76 s), and the medium.en decodes of the same audio spell it "Tendi's"
    # too. "tendis" is not a word in any catalogue, so the global single-token fix is safe - same
    # class as croak/slippery/scion. The MULTI-word manglings of the same name ("10 days",
    # "and these") cannot live here and are keyed PHRASE rules below.
    (r"\btendis\b", "tendies"),
    # --- kaspa batch, 2026-09-10 (foxy-linea-swift-bet, clip 5) ---
    # LINEA, the Consensys layer-2 (the chain whose mascot is the Foxy token this clip is about).
    # Whisper renders it "Linnea" on ALL FIVE occurrences in this clip's own word pass (14.00,
    # 15.00, 24.62, 25.72 and the "bullish on Linnea" at 24.62), and the clip's base video carries
    # the receipt for the real spelling in two places at once: the CoinMarketCap "Foxy Markets"
    # table lists the pair **LINEA/FOXY** on Etherex CL, and the token's link panel reads
    # **lineascan.build**. "Linnea" is a Scandinavian given name and is not a token, chain, company
    # or person in this catalogue, so the global single-token fix is safe - same class as
    # croak/slippery/pingu/scion. Unlike a casing fix it is VISIBLE: the montserrat preset
    # lowercases everything via CSS, so only this SPELLING change reaches the screen.
    (r"\blinn+ea\b", "linea"),
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
    # --- pieverse batch, 2026-09-22 (clip 2 four-year-cycle-zombies-returned-early) ---
    # "a supply shortage created by the HALVING" / "the HALVING couldn't cause the cycle." The clip's
    # own pass writes the noun as "haven" (87.88, 93.12 s); medium.en AND large-v3 re-decoding the same
    # windows both return "habit", i.e. no pass ever produces the right word, and the clip-plan's
    # stt_caption_fixes lists having/haven -> "halving" for this clip. Keyed on THREE tokens each, so a
    # genuine "the haven" (safe harbour) elsewhere is never touched; 3 -> 3 tokens, whole span kept.
    # Distinct from the existing ("post","having") -> "post-halving".
    (("by", "the", "haven"), ["by", "the", "halving"]),
    (("the", "haven", "couldn't"), ["the", "halving", "couldn't"]),
    # --- ready-for-pumps batch, 2026-09-14 (clip 5 slippy-kaspa-tokens-revival) ---
    # "the KRC20", "KRC20 tokens" (x3). The clip's own small pass AND medium.en on the whole spine both
    # emit the ticker as TWO tokens, "KRC" + "20" (5.72-6.70, 21.36-22.22, 28.96-29.72 s); the existing
    # single-token CORRECTIONS ("KC20"/"KR20" -> krc20) can never see a split. Left split, the 3-word cap
    # put a bare "20" on its own caption ("krc / 20 tokens"), and the clip-plan's stt_caption_fixes lists
    # "KRC 20" -> "KRC20" by name for this clip. "krc" is never an English word, so the rule is safe as a
    # GLOBAL phrase (same class as ("ton","coin") -> "toncoin"); no shipped captions file carries the
    # split form (grep 2026-09-14), so no past output changes. 2 -> 1 token, whole span kept.
    (("krc", "20"), ["krc20"]),
    # --- ready-for-pumps batch, 2026-09-14 (clip 4 asteroid-gold-crypto-dollar) ---
    # "the dollar being backed by STABLECOINS, by crypto usage." The clip's own small pass splits the
    # compound into two tokens, "stable" + "coins," (7.56-8.26 s); medium.en on the whole spine reads
    # "stablecoins," as ONE token (7.34-8.18) and the source-stream pass reads "stablecoins," too. Left
    # as two tokens, the 3-word cap shipped the compound cut in half across two captions ("backed by
    # stable" / "coins, by crypto"). Same class as the ("stable","coin") -> "stablecoin" merge above
    # and the ("house","coin") -> "housecoin" one: a compound Whisper spaces. Keyed on the preceding
    # "by" so it fires only in this "backed by stablecoins" construction; "coins,"'s comma is carried.
    # 3 -> 2 tokens; the merged token spans "stable"'s start to "coins"'s end.
    (("by", "stable", "coins"), ["by", "stablecoins"]),
    # --- ready-for-pumps batch, 2026-09-14 (clip 1 perps-pad-110x) ---
    # "one of those perps called PERPS PAD." Textually a no-op merge of the two-word project name into
    # ONE grouping unit (same class as ("pipe","dog") -> ["pipe dog"]): "perps" is 5 chars, so the
    # 3-word cap split the hook line as "perps called perps" / "pad." (a 0.38 s orphan caption that
    # cuts the name in half). Keyed on the preceding "called" so the perpspad batch's already-shipped
    # "this is perps / pad." (clip 1, 21.86 s) re-renders byte-identically. 3 -> 2 tokens; the merged
    # token takes the first "perps" start (4.04) and its end, and "pad."'s period is carried.
    (("called", "perps", "pad"), ["called", "perps pad"]),
    # --- ready-for-pumps batch, 2026-09-14 (clip 2 stonk-season-pairing-evolution) ---
    # "probably going to be like a STONK season." The clip's own small pass hears "stock season"
    # (6.84-7.36 s); medium.en on the whole file AND on both staggered windows (4.4-8.0 / 5.6-9.3)
    # reads "stonk season" 3/3, and the clip title is "Robinhood Summer Is Over, Stonk Season Is Next".
    # "stock" is a real word he says elsewhere, so it is keyed on the full "like a ... season" run and
    # never corrected globally. 4 -> 4 tokens, rewritten in place.
    (("like", "a", "stock", "season"), ["like", "a", "stonk", "season"]),
    # "we went from pairing to stocks, like PAIRING TO Nvidia." The small pass renders "parent to
    # Nvidia" (10.84-11.64 s); medium.en whole-file + window 9.2-13.2 read "pairing to Nvidia" (the
    # third window hears "pair into Nvidia", same word). The line is the first step of the pairing
    # evolution the whole clip lays out. Keyed on "nvidia" so a genuine "parent" is never touched.
    (("parent", "to", "nvidia"), ["pairing", "to", "nvidia"]),
    # "tokenized version of those HIGH CAP cryptos." The small pass hears "high crap cryptos"
    # (17.46-18.62 s); medium.en hears "high-prep" / "iCrap" (nothing usable). The clip plan records
    # the master line as "tokenized version of those high cap cryptos" (tokenized high-market-cap
    # cryptos, the T-Cat tokenized-TAO beat it trims), and "high crap cryptos" reads as an insult he
    # never made. Keyed on the "high ... cryptos" neighbours. 3 -> 3 tokens, in place.
    (("high", "crap", "cryptos"), ["high", "cap", "cryptos"]),
    # --- perpspad batch, 2026-09-14 (clip 3 kaspa-ran-57-off-a-level-i-thought-was-impossibl) ---
    # "Let's not forget about Kaspa. CONSIDERING how far it went all the way up here." The clip's own
    # pass and medium.en (3/3 staggered windows) both render "Casper. Concerned how far it went", but
    # "concerned how far it went" is not a sentence and the clip plan records the master word at
    # 1734.9 s as "considering" (its own note: "Whisper's 'concerning' at 1734.9 is 'considering'").
    # Keyed on the corrected "kaspa" neighbour (casper -> kaspa fires in cleanup() BEFORE phrases) so a
    # genuine "concerned" elsewhere is never touched; the period medium.en puts after "Kaspa" is
    # carried onto the first token so the grouping breaks the sentence there. 3 -> 3 tokens, in place.
    (("kaspa", "concerned", "how"), ["kaspa.", "considering", "how"]),
    # "geez, went up 57%." The clip's small pass emits a bare " 57" with no percent and no period, so
    # the caption ran on as "geez went up 57 so". medium.en reads "57%." on the whole file AND on both
    # staggered windows (11.0-15.5 / 11.7-14.5); the clip title is "Kaspa Ran 57%". Keyed on the "up"
    # / "so" neighbours so a bare 57 elsewhere is untouched. 3 -> 3 tokens, in place.
    (("up", "57", "so"), ["up", "57%.", "so"]),
    # --- perpspad batch, 2026-09-14 (clip 2 zombies-are-waiting-for-an-october-bottom-that-w) ---
    # "the four year cycle DICTATES that." The clip's own pass renders "cycle Dick takes that"
    # (19.54-20.04 s, p 0.55 / 0.62); the clip-plan quotes the line as "the four-year cycle dictates
    # that". Keyed on "cycle" so a genuine "dick takes" elsewhere is never touched. 3 -> 2 tokens:
    # _apply_phrases_once consumes the surviving "takes" (i += n), same shape as the "2am" rule below.
    (("cycle", "dick", "takes"), ["cycle", "dictates"]),
    # --- silver batch, 2026-09-11 (clip 7 vlad-loves-it-so-it-pumps-impact) ---
    # "whenever VLAD LOVES something, it's probably going to pump." The clip's own small pass hears
    # "whenever glad love something" (p 0.67 / 0.72); medium.en whole-file + 2/2 staggered windows on
    # the same spine read "whenever Vlad loves something", and the FULL sibling (clip 3) captions the
    # identical master audio as "whenever vlad loves something". "glad" is a real English word, so it
    # is keyed on its neighbours here rather than corrected globally. 3 -> 3 words, rewritten in place.
    (("whenever", "glad", "love"), ["whenever", "vlad", "loves"]),
    # "waking up AT LIKE 2 A.M." Whisper emits the time as THREE tokens, " 2" + " a" + ".m.", and
    # core(".m.") == "m" is in FILLER (the closed-mouth hum), so cleanup() drops the ".m." and the
    # caption reads "like 2 a and say". Keyed on "at like" so a bare "2 a" elsewhere is never touched.
    # The replacement is one token SHORTER than the match: _apply_phrases_once zips span/rep, so the
    # surviving "a" token is consumed (i += n) and nothing after it is disturbed.
    (("at", "like", "2", "a"), ["at", "like", "2am"]),
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
    # --- kaspa batch, 2026-09-10 (clip 1 / 6 `kaspa-10-cents-vs-3-dollars`, the headline read) ---
    # He reads the CaptainAltcoin headline that is ON SCREEN behind him: "Kaspa Price Explodes 25%
    # as KAS Closes In on $1 Billion Market Cap". small.en renders "Kaspa closes" as ONE token,
    # "Casclos" (2.64-3.12 s), so the global caspa->kaspa CORRECTION cannot reach it and the caption
    # read "casclos is in on a billion market cap". Keyed on the two FOLLOWING tokens so the rewrite
    # is 3 tokens -> 3 tokens (a replacement may never be longer than the run it matches, and there
    # are no timings to invent): the "is" that Whisper heard is the "s" of "closes". The verbatim
    # headline is the receipt on screen, so this is a transcription fix, not a rewrite.
    (("casclos", "is", "in"), ["kaspa", "closes", "in"]),
    # --- kaspa batch, 2026-09-10 (clip 4 `19x-14x-12x-7x-five-days`) ---
    # THE HOOK LINE: "We were FLYING, right?" The shipped small word pass renders the verb as
    # "lying" (0.56-1.08 s), which inverts the meaning of the clip's first three words ("we were
    # lying" reads as a confession of fraud on a receipts video). medium.en on an isolated
    # 0.0-5.0 s window of this exact spine reads "We were flying, right?", and the batch clip-plan
    # quotes the master transcript the same way ("we were flying, right?", master 956.76). Keyed on
    # the two PRECEDING tokens, 3 -> 3, so a real "lying" anywhere else is untouched.
    (("we", "were", "lying"), ["we", "were", "flying"]),
    # (This clip closes on the same mic-drop line as the tutorial batch, so the
    # ("code","monkey") -> "codemonkey" merge it needs ALREADY EXISTS below and is deliberately NOT
    # duplicated here.)
    # THE PAYOFF FIGURE: "you would have made 350,000". Whisper splits it across the thousands comma
    # into TWO tokens, " 350" (47.56-48.16) and " ,000" (48.16-48.72). cleanup()'s number merge only
    # covers number + %/x, so the pair survives into grouping and a caption can legitimately break
    # between them (real case on this clip at --max-short 4: "made you know 350" / ",000 and just
    # from"). A leading-comma ",000" is never a word, so this is a transcription fix; 2 tokens -> 1
    # means the merged token spans both original timings and nothing is invented. Same class as the
    # "$1,500" money-figure note on --colorize.
    (("350", "000"), ["350,000"]),
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
    # biggest-bullrun clip 3 `pippin-dead-then-85x`, 2026-09-06. The project's own catchphrase is
    # "PIPPIN BE RIPPIN'" — Mike drops the final g, and small.en renders it as the ordinary English
    # participle "ripping". Verified by ear against two medium.en decodes of THIS spine
    # (27.40-30.20 -> "beepin beepin right"; 24.80-30.40 -> "Bippin' be rippin'! Right?"), i.e. the
    # bigger model hears the clipped form. It IS visible on screen even though the montserrat preset
    # lowercases via CSS, because the letters differ ("ripping" vs "rippin'"). Keyed on all three
    # words so a normal "ripping" anywhere else is untouched; 3 tokens -> 3 words, no timing change.
    (("pippin", "be", "ripping"), ["pippin", "be", "rippin'"]),
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
    # ⛔ EXCEPTION, and it must sit ABOVE the merge because the first matching rule at an index wins:
    # in my-new-100x/swole-cat-vlad-2021 (clip 4, 2026-08-28) the words are NOT the KRC20-era token,
    # they are the two words printed in the receipt he is pointing at - Vlad Tenev's 14 Apr 2021
    # tweet quoting @HowIBuiltThis, "the original name for @RobinhoodApp was ... Cash Cat" - read off
    # the base video's own screen-share at t = 42.5 s. The batch's caption-fix list mandates "Cash
    # Cat" as two words there, and under the montserrat preset (all-lowercase via CSS) one word vs
    # two is the ONLY part of that fix that is visible at all. This entry consumes the run unchanged
    # so the merge below cannot fire on it; the four-token key ("got cash cat along") cannot occur in
    # a clip that is really talking about the token.
    (("got", "cash", "cat", "along"), ["got", "cash", "cat", "along"]),
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
    # --- early-crash batch, 2026-08-07 (way-off-moon-calls clip) ---
    # "if I give these high price PREDICTIONS" — the shipped word pass and large-v3 whole-clip both
    # drop the plural s, which leaves the ungrammatical "these high price prediction" on screen.
    # medium.en on an isolated 0.0-4.4 s returns "If I give these high price predictions, it might
    # sound unrealistic", and the clip's own tighten plan quotes the master transcript the same way.
    # 4 tokens -> 4 words, keyed on the full run so no bare "prediction" is ever touched.
    (("these", "high", "price", "prediction"), ["these", "high", "price", "predictions"]),
    # "we bought that END UP at the bottom in December" — a mumbled 0.20 s blip between "that" and
    # "at" that no pass can resolve: the shipped pass and medium.en (isolated 7.4-11.0 s) hear
    # "end up", large-v3 whole-clip hears "in the,". "we bought that end up at the bottom" is not
    # English in any of them. Same class as ("this","said","my") -> ["this."] above: the noise MERGES
    # into the word it interrupts (1-word replacement keeps the whole 8.50-8.96 s span) instead of
    # putting invented words on screen. Renders "we bought that at the bottom in december."
    (("that", "end", "up"), ["that"]),
    # LAB is the named project of this clip and it has a real reference logo on disk (LAB.png). The
    # montserrat preset lowercases everything via CSS, so brand CASING cannot disambiguate it from
    # the English word "lab" — only the cashtag can. The house spelling in every queued post about
    # this exact moment is "$LAB" (x-tweets.json: "I called a 20x on $LAB. It did a 353x."), while
    # the same copy writes "Velvet" with NO cashtag, so velvet is left bare and only colour-tagged.
    # Fires on all three occurrences (7.36, 12.96, 17.06 s). Idempotent: core("$lab") == "lab", so
    # the fixpoint pass re-matches and re-emits the identical token, then converges.
    (("lab", "token"), ["$lab", "token"]),
    # "...I gave it like a 30x. I DID A 58x and I still think it has room to grow" — the shipped word
    # pass renders the run as "a new to" (the "new" token has ZERO duration, i.e. a hallucination).
    # large-v3 whole-clip AND medium.en on an isolated 28.3-31.0 s both return "like a 30x. I did a
    # 58x"; a tighter 28.9-30.6 s window returns "do the 58x". Two independent models with context
    # agree on "i did a", so that is what goes on screen. 4 tokens -> 4 words; the period after 30x
    # is where both models punctuate. Keyed on the merged "30x" so nothing else can match.
    (("30x", "a", "new", "to"), ["30x.", "i", "did", "a"]),
    # "moon-boyish price predictions" — Whisper splits the compound; the house spelling is hyphenated
    # (x-tweets.json: "Sometimes I get scared to give moon-boyish price predictions").
    (("moon", "boyish"), ["moon-boyish"]),
    # --- early-crash batch, 2026-08-07 (akita-3b-robinhood clip) ---
    # The batch caption gate marks 38.4-40.8 s as a WORD-SALAD zone to caption FROM AUDIO ONLY. The
    # shipped pass renders "look at that. God can the holy crap, man." — not English. medium.en on an
    # isolated 37.4-42.6 s returns "Look at that GOD CANDLE. Holy crap, man." A "god candle" is the
    # trader's name for exactly the candle he is pointing at, so that is what goes on screen.
    # 3 tokens -> 2 words (the third timing is dropped, which is supported). Keyed on the three
    # garbled tokens only, so "look at that." and "holy crap, man." keep their own timings and the
    # three captions break exactly where he pauses.
    (("god", "can", "the"), ["god", "candle."]),
    # "look at that WICK" (50.26 s) — the shipped pass hears "way" (p 0.59) and "look at that way" is
    # not English. medium.en on an isolated 49.6-52.6 s returns "look at that wick", and he is
    # hovering the wick of the $3B candle at that exact moment. Keyed on the full run so no other
    # "look at that" in the clip (there are six) can match.
    (("look", "at", "that", "way"), ["look", "at", "that", "wick"]),
    # "it JUST absolutely explode in the bull run" (8.72 s) — the shipped pass opens the sentence with
    # "It's absolutely explode", which is ungrammatical. medium.en on an isolated 8.4-11.3 s returns
    # "Just absolutely explode in the bull run", and the clip's own tighten plan quotes the master the
    # same way ("just absolutely explode in the bull run"). Two independent sources vs one.
    (("its", "absolutely", "explode"), ["just", "absolutely", "explode"]),
    # "we're the early ONES. like we ARE the early ones" — the protected persona doubling. The shipped
    # pass drops the plural on the FIRST half only ("the early one."); medium.en on an isolated
    # 101.4-105.4 s returns "ones" both times. Keyed on the full run so a genuine "the early one"
    # elsewhere is never touched.
    (("were", "the", "early", "one"), ["we're", "the", "early", "ones."]),
    # The chart's starting market cap. He says "120k market cap" and the batch caption gate requires
    # it on screen as a DOLLAR figure (ear-verified against an isolated 20.4-23.6 s medium.en pass,
    # which returns "down 120k market cap"). Idempotent: core("$120k") == "120k", so the fixpoint
    # pass re-matches and re-emits the identical token, then converges.
    (("120k", "market", "cap"), ["$120k", "market", "cap"]),
    # The two Robinhood-chain tokens in the closing line. The shipped pass hears "cash gap" (p 0.28)
    # and splits the What If ticker; medium.en on an isolated 123.3-128.14 s returns "Could Cashcat
    # and What-If". Cash Cat is a real Robinhood-chain meme coin and the batch gate fixes the ticker
    # spelling: What If is ALWAYS "$IF", never "$WHATIF". 5 tokens -> 4 words. CASCADING: the emitted
    # ("cash","cat") is re-matched on the next fixpoint pass by the existing ("cash","cat") ->
    # ["cashcat"] rule above, so it lands on the house spelling used by every earlier CashCat short.
    (("cash", "gap", "and", "what", "if"), ["cash", "cat", "and", "$if"]),
    # NOT corrected, deliberately (early-crash/akita-3b-robinhood), four calls tested against audio:
    #  - "let me hover over right now" (52.54 s). The clip's tighten plan guessed "hover over IT right
    #    now"; neither 1x pass produces an "it" (the shipped pass and medium.en on 51.9-56.4 s both
    #    read "hover over right now"). Never ship a word no 1x pass produced.
    #  - "hold on. hold on. hold on." (62.12 s). The tighten plan's protected-doubling list calls it
    #    "hold up" x3 off the MASTER transcript; the shipped pass and medium.en on an isolated
    #    61.3-68.6 s both hear "hold on". The doubling is protected either way (three separate
    #    sentences, so cleanup()'s adjacent-token collapse never sees them).
    #  - "just imagine how far, how far might go" (116.60 s). The plan flagged a possibly missing
    #    "it"; neither pass produces one.
    #  - "where is it?" (77.74 s). Low confidence (p 0.14) but medium.en's alternative is a filler
    #    ("where is um..."), and "where is it?" is what he is doing. Left as shipped.
    # NOT corrected, deliberately (early-crash/way-off-moon-calls): the batch caption gate flagged
    # "and we did a 350x ON A LAB TOKEN" (16.92 s) as probably "on THE LAB token". Three 1x passes on
    # this clip's own audio all return "on a lab token": the shipped word pass, large-v3 whole-clip,
    # and medium.en on an isolated 16.2-18.0 s. The two EARLIER occurrences of the signature line
    # genuinely read "on the lab token" (7.16, 12.78) and are left alone; the third is "a" and stays
    # "a". Do not add a rule.
    # --- early-crash batch, 2026-08-08 (akita-3b-robinhood-IMPACT clip, #6) ---
    # This clip is the IMPACT cut of clip #1's material (master 1121.16-1164.18 sits inside clip 1's
    # range), so clip #1's own whisper pass is a SECOND INDEPENDENT 1x pass over the same audio and is
    # cited below as such (captionsEcAkita.ts, built from its whisper-words-verified.json).
    # Phantom leading "And" at 0.00-0.44 s (p 0.18). The cut's in-point is the exact Whisper onset of
    # "now" (tighten-plan: in 1121.16 = onset of "now I'm going to go over here"), so the 0.44 s token
    # is a boundary artifact of the cut. THREE 1x passes agree there is no "and": medium.en on an
    # isolated 0.00-3.40 s and large-v3 whole-clip both open "Now I'm gonna go over here", and clip #1
    # captions the same sentence "now i'm going / to go over here to" (56.50 s). 6 tokens -> 5 words
    # (the last timing is dropped, which is supported); keyed on the whole opening run so no ordinary
    # "and now I'm going to go" in a future clip is touched.
    (("and", "now", "im", "going", "to", "go"), ["now", "i'm", "going", "to", "go"]),
    # "to the right. NOW WATCH THIS." (3.02 s) — the shipped pass hears "I watched this.", which is not
    # what he does (he is about to show the chart, and Mike's own 4b title for this clip opens "Watch
    # This:"). medium.en on an isolated 2.30-4.80 s returns "to the right. Now watch this. Oh my god.",
    # large-v3 whole-clip returns "to the right now watch this", and clip #1 captions the identical
    # line "now watch this." (58.82 s). Keyed on the preceding "right." so a genuine "I watched this"
    # elsewhere can never match. 4 tokens -> 4 words, every timing preserved.
    (("right", "i", "watched", "this"), ["right.", "now", "watch", "this."]),
    # The hover/hunting region the tighten plan flagged as WORD SALAD to caption FROM AUDIO ONLY. The
    # shipped pass renders "What? Where is some right here?"; "where is some" is not English. medium.en
    # on an isolated 21.70-24.70 s returns "where's um right here right yeah" and a tighter 21.30-23.10 s
    # returns "kind of what where's um", i.e. "candle. what? where's... um". The "um" is a FILLER and
    # the house style drops fillers (cleanup() already ran by the time this fires, so it would survive
    # if emitted) — so the run renders as "what? where's" with NO invented words. 4 tokens -> 2 words
    # (the last two timings are dropped, which is supported); keyed on the leading "what" so the pair
    # can only match this hunt.
    (("what", "where", "is", "some"), ["what?", "where's"]),
    # "A FREAKING INU without any centralized exchanges. ... A FREAKING INU." — the clip's punchline and
    # Mike's exact 4b title ("Watch This: $3 Billion. A Freaking Inu."). Isolated on its own audio this
    # cut never names Akita, so medium.en reads "I'm freaking a new" (26.62 s) and "I'm freakin' emu"
    # (29.48 s) and the shipped pass reads "I freaking knew" with p 0.37/0.58/0.52 and 0.75/0.01/0.04 —
    # the 0.01/0.04 is the model telling you it has nothing. Two 1x passes DO produce the words:
    # large-v3 whole-clip on this spine returns "a freaking enu without any centralized exchanges", and
    # clip #1's pass (same audio, full context, where he has just said "this is AKITA, AKITA INU")
    # returns "A freaking Inu" BOTH times at p 0.88/0.95. Nothing is invented, and the audio was never
    # altered. Both rules are keyed on their neighbouring words so a real "I freaking knew" can never
    # match: the first on the following "without any centralized", the second on the preceding
    # "exchanges". 6 -> 6 and 4 -> 4 words, every timing preserved.
    (("i", "freaking", "knew", "without", "any", "centralized"),
     ["a", "freaking", "inu", "without", "any", "centralized"]),
    (("exchanges", "i", "freaking", "knew"), ["exchanges.", "a", "freaking", "inu."]),
    # NOT corrected, deliberately (early-crash/akita-3b-robinhood-impact), three calls tested on this
    # clip's own audio:
    #  - "is this the 3 billion, 3 billion market cap?" (24.42 s). medium.en heard "This is the" on one
    #    window and "it's the" on another, but the shipped word pass reads "Is this the" (p 0.43/0.77/
    #    0.93) and clip #1's independent pass captions it "is this the 3 billion, 3 billion market cap?"
    #    too. Two 1x passes agree; left as shipped.
    #  - "hold on." x3 (6.28-7.12 s). The tighten plan's protected-doubling list calls it "hold up" x3
    #    off the MASTER transcript; medium.en on an isolated 5.20-7.40 s hears "hold on hold on hold on"
    #    and clip #1 captions the same three sentences "hold on." x3. Same finding as clip #1's builder.
    #  - "3 billion" is NOT dollarised (19.62 / 25.00 / 25.58 s). Clip #1 renders this identical spoken
    #    moment as bare "3 billion", and the two clips are cut from the same seconds of stream, so
    #    inventing a "$" here would make the pair inconsistent on screen. Only the THUMBNAIL (code-drawn,
    #    Mike's own title wording) carries the dollar sign.
    # --- early-crash batch, 2026-08-07 (tendies-funny-stupid clip) ---
    # The token is TENDIES (a Robinhood-chain meme coin). Whisper renders the name as "10 days" on
    # the shipped word pass; an isolated medium.en pass on 4.10-5.50 s returns "and then there's
    # TENDIES even though I haven't...", and large-v3 whole-clip returns "and then there's Tendies".
    # Keyed on the preceding "there's" - "10 days" IS a real English phrase ("in 10 days"), so a bare
    # ("10","days") pair would corrupt a future clip. 3 tokens -> 2 words (the 3rd timing is dropped,
    # which is supported). Only ONE instance survives this clip's tighten (the other was cut).
    (("theres", "10", "days"), ["there's", "tendies"]),
    # "this reminds me of like the FARTCOIN concept" — the $1B Solana meme coin, and the exact
    # comparison he is making ("stupid but funny, and people buy into it"). Three passes garble the
    # same phoneme run three ways (shipped "far coin", large-v3 "Farcoin", medium.en "far corner")
    # and a medium.en pass primed with a meme-coin initial_prompt returns "Fartcoin"; the batch
    # tighten-plan's caption gate (read off the master transcript) also reads "fart coins". Same
    # class as ("house","coin") -> "housecoin". 2 tokens -> 1 merged word keeps the whole span.
    (("far", "coin"), ["fartcoin"]),
    # "it's probably the type of MEME that Vlad will want to list" — the shipped pass drops the
    # second syllable ("type of me"), medium.en hears "type of mean". large-v3 whole-clip returns
    # "the type of meme", and the clip's tighten plan quotes the line the same way.
    (("type", "of", "me"), ["type", "of", "meme"]),
    # "imagine this goes to like 10 billion. JUST imagine." — the shipped pass renders the adverb as
    # "is", which cannot join those two sentences (the batch gate flagged the same span, where the
    # PRE-desilence audio had a ~1.9 s pause Whisper had hallucinated as a 2.18 s "is"). Two passes
    # on the desilenced clip agree on "just" (large-v3 whole-clip and medium.en on an isolated
    # 28.60-30.80 s). The added periods break the caption group on both sentence ends.
    (("billion", "is", "imagine"), ["billion.", "just", "imagine."]),
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
    # --- tutorial batch, 2026-08-09 (94x-euphoria clips 1 + 6) ---
    # "and that's why CODEMONKEY MIKE has the greatest crypto community on the planet" — Mike's own
    # community brand is ONE word. Whisper splits it into "code" + "monkey" every time (master
    # 354.34-355.34 and both clips' own passes). The montserrat preset renders all-lowercase via CSS,
    # so the CASING is invisible on screen and only this TOKEN MERGE changes anything. 2 tokens -> 1
    # merged word, whole span kept. Same class as ("nine","hood") -> "ninehood".
    (("code", "monkey"), ["codemonkey"]),
    # "we did the 550X on MYX on BNB again" — MYX is the BNB-chain token of the 550x call.
    #
    # ⛔ MIKE CORRECTED THIS 2026-08-10: the token is MYX, not NYX. It shipped as "nyx" in the first
    # build of clips 1 and 6 and he caught it on review. HIS CALL IS FINAL AND OVERRIDES THE ASR
    # EVIDENCE BELOW — it is his own call on his own token, and no decoder outranks that. Both clips
    # were re-rendered on the fix. Do not "restore" nyx on the strength of a future transcript.
    #
    # Kept for the record, because it explains why the machine got it wrong and will again: the
    # phoneme run garbles differently on every pass and never into English. This clip's own small
    # pass gives "Memoy" + "X", medium.en on an isolated 19.0-23.5 s gives "MemYX", large-v3 on a
    # wider 16.5-23.5 s gives "Memoy X", and a 0.5x pass gives "MemYX". Note that three of those four
    # keep an "m" ONSET, which is MYX and was the signal that got misread; the "-nyx" reading came
    # from the master's own later utterance at 4205.92 being heard as "on an NYX, man", where the
    # article "an" supplies a phantom leading "n". The batch clip-plan flagged the same garble on the
    # early-crash batch, so it recurs. Keyed on the non-word "memoy" so nothing real can ever match it.
    (("memoy", "x"), ["myx"]),
    # --- tutorial batch, 2026-08-09 (94x-euphoria clip 1, the FULL cut; these five spans exist only
    # in clip 1, which carries the hook segment and the 65x receipt that clip 6 does not) ---
    # The token is TUTORIAL, ticker $TUT (persona project_handles maps tutorial/tut -> @tutorialtoken)
    # and the batch clip-plan requires it styled "$TUT or Tutorial, never a common noun". The
    # montserrat preset lowercases everything via CSS, so "Tutorial" renders identically to the
    # ordinary English word and ONLY the cashtag disambiguates it (same finding as the $LAB rule
    # above). Both occurrences are keyed on their neighbours, so an ordinary "tutorial" (a how-to
    # video) in a future clip can never match. Idempotent: core("$tut") == "tut", so the fixpoint
    # pass cannot re-match either key.
    (("is", "tutorial", "on"), ["is", "$tut", "on"]),      # "this is $TUT on BNB" 9.18-11.08 s
    (("so", "tutorial", "for"), ["so", "$tut", "for"]),    # "so $TUT, for those of you..." 12.08 s
    # "for those of you who KNOW, YOU should have known" — the second limb of the anaphora the clip's
    # tighten plan protects ("keep BOTH limbs ... keep 'you should have known' twice"). Whisper puts
    # the comma one word late ("who know you, you should"), and cleanup()'s adjacent-duplicate
    # collapse then eats the second "you" and leaves the ungrammatical "who know you, should have
    # known" on screen. Moving the comma one token left restores the line. 4 -> 4 words, every
    # timing preserved, keyed on the leading "who" so no ordinary "know you should" can match.
    (("who", "know", "you", "should"), ["who", "know,", "you", "should"]),
    # "it was like $1-point-something million" — the bottom market cap he multiplies the 65x off.
    # The batch caption gate requires it on screen as a DOLLAR figure, and house style renders market
    # caps as figures rather than spelled-out words (same class as ("900","k") -> "900k"). 4 tokens
    # -> 2 words (the last two timings are dropped, which is supported).
    (("one", "point", "something", "million"), ["$1-point-something", "million"]),
    # THE HELD VOWEL, 49.2-51.2 s. The clip's tighten plan measured master 336.16-338.12 as
    # continuous voiced audio at -17 to -20 dBFS whose F0 glides 245 -> 216 -> 211 -> 151 Hz and
    # lands on the F0 of the transcribed "man" at 163 Hz: Mike sustaining "ohhhh" out of "holy crap"
    # into "man", ONE phrase, and it records in terms "not dead air and not a sound drop ... CAPTION
    # IT AS SPOKEN WORDS", with no caption hole allowed there. Re-measured on THIS spine at 50 ms
    # RMS: unbroken -17 to -20 dBFS from 48.85 s through 53 s, with one 40 ms trough at 49.20 (the
    # /p/ release of "crap"). Whisper transcribes NOTHING between 49.44 and 51.24, i.e. it silently
    # omits 1.8 s of speech, so the word is re-onset to 49.25 in whisper-words-verified.json (see
    # tut-94x-euphoria/_patch_words.py) and spelled with the sustain so the screen matches the ear.
    # 5 -> 5 words, every timing preserved; keyed on the full run so no ordinary "oh man" matches.
    (("oh", "man", "i", "hope", "these"), ["ohhh", "man.", "i", "hope", "these"]),
    # --- tutorial batch, 2026-08-09 (binance-kaspa-catch22, clip 3, the FULL cut) ---
    # NOTE Kaspa itself needs NO rule here: the clip's every "Casper" is already fixed by the global
    # ("cas+per" -> kaspa) CORRECTION above. This is the CHAIN Kaspa, never Kasper-the-Ghost.
    # "when it comes to the TECH, you know, Kaspa's a gem" — the clip's own passes all hear "tag"
    # (small p 0.70, medium.en on an isolated 0.0-3.4 s p 0.46, medium.en on a tighter 0.0-2.6 s
    # p 0.55) and "when it comes to the tag" is not English. The MASTER livestream pass, a fourth 1x
    # decode of the same audio WITH full context, reads "tech," at 638.72 (p 0.42), and the clip
    # plan's segment note quotes the line as "when it comes to the tech, Kaspa is a gem" — he is
    # answering a live-chat question about whether Kaspa is a scam or a gem. Same precedent as the
    # early-crash "a freaking inu" pair: the contextful 1x pass supplies the word, nothing invented.
    # 4 -> 4 words, every timing preserved; keyed on "comes to the" so no other "tag" can match.
    (("comes", "to", "the", "tag"), ["comes", "to", "the", "tech"]),
    # The gem line is CONTRACTED in the audio and the clip's tighten plan requires it captioned as
    # spoken ("Kaspa's a gem. Kaspa's the most beautiful thing ever.", "do not normalise"). Two
    # unprompted 1x medium.en windows on this clip (0.00-3.40 and 0.00-2.60) both return "Casper's a
    # gem. Casper's a-"; the small pass renders the copula as a separate " is" token. Both keys are
    # 4 -> 3 (the copula token is absorbed), and both are keyed on the word BEFORE the name so an
    # ordinary "kaspa is a gem" in a future clip cannot match.
    (("know", "kaspa", "is", "a"), ["know,", "kaspa's", "a"]),          # 1.50-2.18 s
    (("gem", "kaspa", "is", "the"), ["gem.", "kaspa's", "the"]),        # 2.30-3.38 s
    # NEIRO, the Binance-listed meme token, is "Nero" on every decode in this livestream (the batch
    # clip-plan flags all 11 master hits). Keyed on the preceding "about" so the Roman emperor and
    # the software of the same name could never be rewritten by a bare token rule. EDITORIAL: Neiro
    # is the example that PROVES the clip's point about the exchange, never a target.
    (("about", "nero"), ["about", "neiro"]),
    # THE PUNCHLINE, and the tighten plan pins its wording: 2073.52-2074.70 "captions as 'So it's
    # kind of a strange catch-22' and NOT as any of the three decoder garbles ('strange to catch 22',
    # 'not as strange a catch-22', 'catch one or two')". This clip's small pass and medium.en on an
    # isolated 24.2-27.3 s both return the same garble, "kind of strange to catch 22": the article is
    # swallowed and re-surfaces as a phantom "to" (p 0.48 / 0.29) in front of "catch". 6 tokens -> 4
    # words, so the hyphenated number lands as ONE token and the group breaks on its period.
    (("kind", "of", "strange", "to", "catch", "22"), ["kind", "of a", "strange", "catch-22."]),
    # NOT corrected, deliberately (binance-kaspa-catch22):
    #  - the false start at 26.48-27.56 that opens the closing segment. The tighten plan says to
    #    caption it FROM AUDIO ONLY, and the two 1x passes disagree on its content (the small pass
    #    reads "So like I said" with p 0.06 on "like"; medium.en reads "So I wouldn't have like I
    #    said"; the MASTER reads "So when the,"). The only content all three share is "so ... like I
    #    said", which is what the shipped tokens already produce, so nothing is invented here.
    #  - "I would expect Kaspa to be skyrocketing" (29.9-31.74). medium.en garbles the tail as "cast
    #    would it be"; the shipped pass reads "Casper to be", which the global correction turns into
    #    "kaspa to be" — the reading the clip plan and the master both carry.
    #  - the two "you know" fillers the tighten plan requires on screen are a MISSING-SPEECH problem,
    #    not a mishear, so they are patched into whisper-words-verified.json (see
    #    binance-kaspa-catch22/_patch_words.py) rather than being given a rule they could never match.
    # --- tutorial batch, 2026-08-10 (binance-kaspa-catch22-IMPACT, clip 7) ---
    # Clip 7 is a strict SUBSET OF CLIP 3'S AUDIO (its premise + contradiction segments, no hook and no
    # bull-run tail), so clip 3's rules above ALREADY COVER almost all of it and are REUSED as-is:
    # ("about","nero") -> neiro fires once, and the global ("cas+per" -> kaspa) fires twice. The two
    # rules below exist only because clip 7 got a DIFFERENT DECODE of the same seconds, and both are
    # keyed so they can NEVER match clip 3's token stream (verified: clip 3 re-renders byte-identically).
    #
    # "looking for COMMUNITY DRIVEN coins" / "it's a COMMUNITY DRIVEN coin". Clip 3's pass emits this
    # compound as " community" + "-driven", which cleanup()'s hyphen-continuation merge rejoins into one
    # "community-driven" token BEFORE apply_phrases() runs - so clip 3 never presents this 2-token key
    # and cannot match it. Clip 7's pass emits two PLAIN tokens instead, which would put an unhyphenated
    # "community driven coins." on screen for the identical spoken words. 2 tokens -> 1 merged word, so
    # the whole span is kept (no timing is invented or dropped), and the pair now reads the same.
    (("community", "driven"), ["community-driven"]),
    # THE PUNCHLINE, same tighten-plan wording clip 3 pins ("So it's kind of a strange catch-22", and
    # NOT any of the three decoder garbles). Clip 7's decode garbles it DIFFERENTLY from clip 3's: where
    # clip 3 got a phantom "to" before "catch" (its 6-token rule above), clip 7 gets a phantom SENTENCE
    # BREAK, " strange." + " Catch" + " 22." - which is worse on screen, because the period forces a
    # caption break and ships the punchline as "strange." / "catch 22." on two cards. Three staggered 1x
    # medium.en windows on THIS clip's own audio all carry the number intact ("kind of strange to catch
    # 22." / "kinda strange, it's catch-22." / "not as strange a catch-22"), i.e. the three garbles the
    # tighten plan named, and the third supplies the swallowed article. 5 tokens -> 4 words: the period
    # moves off "strange" so the group no longer breaks there, the number lands as ONE hyphenated token,
    # and the caption comes out identical to clip 3's shipped "so it's kind of a" / "strange catch-22.".
    # Cannot match clip 3 (its run has "to" between "strange" and "catch"), and cannot re-match its own
    # output (cores become kind/ofa/strange/catch22), so the fixpoint pass is a no-op.
    (("kind", "of", "strange", "catch", "22"), ["kind", "of a", "strange", "catch-22."]),
    # --- tutorial batch, 2026-08-09 (freaking-early-not-degen, clip 4, the FULL cut) ---
    # THE TITLE LINE. "you know, that's, that's the DEGEN mindset" — the clip's own shipped pass hears
    # "the DJ mindset", which is meaningless, and the clip is TITLED "That's the Degen Mindset. I Don't
    # Trade Like That." An independent full-clip medium.en pass (temperature 0) on the same audio
    # returns "degen" at 7.30-7.64, and both the clip-plan segment note and the tighten plan quote the
    # line with "degen". Keyed on "the … mindset" so a real disc jockey could never be rewritten by a
    # bare \bdj\b token rule. 3 -> 3 words, every timing preserved.
    (("the", "dj", "mindset"), ["the", "degen", "mindset"]),
    # "…[tokens that get] listed on all these CENTRALIZED EXCHANGES, become mainstream". The shipped
    # pass hears "centralized stations" (medium.en on the same audio: "centralized exchanges", 12.40-
    # 12.86), and the batch tighten plan's caption gate names this span explicitly: "2185.80
    # 'centralized engines' -> 'centralized exchanges' … caption that whole opening clause from AUDIO".
    # Nobody lists a token on a station. 2 -> 2 words, timings preserved.
    (("centralized", "stations"), ["centralized", "exchanges"]),
    # THE SCATTER-GATHER JOIN. This clip is assembled from two master ranges and the seam falls between
    # "I don't really trade like that" (segment 0's last word) and "Listed on all these…" (segment 1's
    # first). The measured silence at the seam is only 0.320 s — under the 0.45 s gap break — and the
    # shipped pass carries no sentence punctuation on "that", so the two sentences can weld into one
    # caption across the biggest structural cut in the clip. The period is real (it ends the protected
    # "That's the degen mindset. I don't really trade like that." beat), and it also stops the
    # bookend line reading as "…like that listed on all these". Keyed on the full three-token run.
    # 3 -> 3 words, every timing preserved.
    (("like", "that", "listed"), ["like", "that.", "listed"]),
    # THE TWO MARKET-CAP FIGURES, kept whole. House style renders a market cap as ONE figure (same
    # class as ("900","k") -> "900k"), and with the caps at 3/5 words these two split across a caption
    # boundary in the worst possible place: "…got in at like 1.8" / "million that that's" put the
    # number in one caption and its unit in the next, welded onto the following sentence. 2 -> 1 merge
    # keeps each whole span. The trailing period on the second one is REAL (his sentence ends there;
    # it is also the 5B desilence join of master 2217.320-2218.335) and it closes the hypothetical
    # sentence before "That's what I'm looking for", which is exactly the framing the caption guard
    # wants. No "$" is added and no multiplier is computed: the words on screen are only his.
    (("700", "million"), ["700 million"]),
    (("18", "million"), ["1.8 million."]),   # core("1.8") == "18" after cleanup()'s decimal merge
    # NOT corrected, deliberately (freaking-early-not-degen):
    #  - "700 million" and "1.8 million" are captioned EXACTLY as spoken, inside his own sentence, with
    #    the conditional frame "i'm going to be like" intact three captions earlier. The clip-plan and
    #    tighten plan both carry a hard CAPTION GUARD: those numbers are a FUTURE HYPOTHETICAL he is
    #    imagining, never a realised trade, so no rule may reshape them into a figure/receipt form
    #    (contrast the ("900","k") and ("a","thousand","dollars") money rules above, which exist for
    #    real quoted market caps). cleanup()'s decimal-continuation merge already rejoins Whisper's
    #    "1" + ".8" split into "1.8" with the whole span, which is all this line needs.
    #  - the token is deliberately UNNAMED in the audio ("this particular token"), so there is NO
    #    ticker/brand rule for this clip and none may be added: nothing in the transcript names it.
    #  - "I got in AT like 1.8 million" keeps the "at" — the clip's own pass and medium.en agree, and
    #    the sibling clip-8 tighten note says in terms "the post-cut render decodes 'I got in AT like
    #    1.8 million' … caption what he says".
    # --- tutorial batch, 2026-08-09 (robinhood-meme-rankings, clip 2, the FULL cut) ---
    # FARTCOIN is ONE word (the Solana token is styled "Fartcoin"), and it is the comparison the whole
    # Tendies pitch lands on: "I think that'll get it a potential Robinhood app listing, JUST LIKE
    # FARTCOIN." The batch clip-plan flags the span ("941.58-942.56 'far far coin' -> 'fart coin'") and
    # both the clip's own pass and medium.en split the /t/ release into a second "far", which the
    # clip's _patch_words.py merges back to one " fart" token. Left as two words the 3/5 word caps put
    # "fart" at the end of a five-short-word caption and stranded "coin" alone in the next one, i.e.
    # the punchline broke across a caption boundary. Same class as ("nine","hood") -> "ninehood" and
    # ("ton","coin") -> "toncoin": 2 tokens -> 1 word, whole span kept.
    (("fart", "coin"), ["fartcoin"]),
    # "I think THAT IT'LL make, get it a potential Robinhood app listing". The clip's own pass reads
    # "that they'll"; the MASTER livestream pass (full context) and medium.en on an isolated 48.5-54.5 s
    # window BOTH read "that it'll". "I think that they'll make get it a listing" has the wrong subject
    # (the listing is granted to the token, not by "they"), and the tighten plan explicitly keeps the
    # "make get" self-correction inside the protected peak, so the line must read as the self-correction
    # it is. Keyed on the following "make" so an ordinary "that they'll" elsewhere cannot match.
    # 3 -> 3 words, every timing preserved.
    (("that", "theyll", "make"), ["that", "it'll", "make"]),
    # THREE MISSING SENTENCE PERIODS. Grouping breaks on [.?!], so a missing period welds two of his
    # sentences into one caption. Each period below is present in the MASTER pass of the same audio and
    # in the clip-plan's own quote of the line; only the clip's pass drops it. All three are keyed on
    # the word AFTER the sentence end, and all are 3 -> 3 with every timing preserved.
    #   "Everybody does. What if such and such happens?" — without it the caption read
    #   "everybody does what", which scans as a question he never asks.
    (("everybody", "does", "what"), ["everybody", "does.", "what"]),
    #   "...a very funny and stupid, like, concept. That's, I think that it'll..." — without it the
    #   caption read "like concept that's", welding the Tendies verdict onto the next sentence.
    (("like", "concept", "thats"), ["like", "concept.", "that's"]),
    #   "It's like, look at that. But I think this would be my number four." — this one also spans the
    #   clip's LAST scatter-gather join (master 2141.75 -> 2156.87), so without the period the Yolo
    #   chart line welds onto the closing ranking. The clip's pass has a comma on "that,".
    (("at", "that", "but"), ["at", "that.", "but"]),
    # THE KEPT SELF-CORRECTION, "in the Robinhood, THE ROBINHOOD headquarters, right?" The tighten plan
    # REJECTED cutting it from the audio (there is no silence anchor on its left), and this clip's audio
    # has a real 0.360 s gap at 42.810-43.170 between the two utterances - but 0.36 s is UNDER the
    # 0.45 s gap break, so the caption came out as "the robinhood the", which reads as a caption bug
    # rather than as him restarting the phrase. The period breaks the group at the pause that is
    # actually there and yields "the robinhood." / "the robinhood headquarters" / "right?". Fires AFTER
    # the global ("robin","hood") -> "robinhood" merge, hence the merged key. 4 -> 4 words, every
    # timing preserved. No word is removed: both utterances stay on screen.
    (("the", "robinhood", "the", "robinhood"), ["the", "robinhood.", "the", "robinhood"]),
    # NOT corrected, deliberately (robinhood-meme-rankings):
    #  - "what if" is left as TWO ordinary words everywhere, never rewritten to the ticker. He uses the
    #    phrase both as the token name ("I go for What If") and as literal speech ("What if this
    #    happens? What if such and such happens?"), and no rule can tell those apart. The persona hard
    #    rule that the ticker is $IF (never $WHATIF) is honoured where a TICKER is actually rendered:
    #    the frame-0 cover and the code-drawn NUMBER 1 badge, both of which read "$IF".
    #  - "I know I say it all the time" keeps "I know". The master pass reads "You know, I say it all
    #    the time" and the clip's pass reads "I know I say"; both are grammatical and idiomatic, so
    #    there is nothing to repair and the clip's own decode stands.
    #  - "the Robinhood, the Robinhood headquarters" keeps BOTH utterances. The tighten plan REJECTED
    #    cutting that self-correction (no silence anchor on its left) and this clip's audio has a
    #    measured 0.360 s gap at 42.810-43.170 between them, so the doubling is real and audible. The
    #    global ("robin","hood") -> "robinhood" merge fires twice and cleanup()'s stutter collapse does
    #    NOT eat the second one (the two are separated by "the").
    # --- tutorial batch, 2026-08-10 (doginme-100x-if-500x, clip 5, the FULL cut) ---
    # ⛔ THE SPELLING SPLIT ON THIS CLIP. The token is `doginme`, lowercase and ONE word. The clip ALSO
    # contains the English phrase "I got that dog in me" (THREE words), twice, and that doubling is
    # PROTECTED by the run contract. So the merge is keyed on the word BEFORE the name and NEVER on a
    # bare ("dog","in","me"): the token occurrences are "all-time high OF doginme" (12.34 s, keyed on
    # "of", restored by this clip's _patch_words.py) and "what if DOGGY ME" (28.90 s, keyed on the
    # non-word "doggy"). Both protected limbs are preceded by "that", so neither key can ever match
    # them. Same class as ("nine","hood") -> "ninehood" / ("house","coin") -> "housecoin".
    (("of", "dog", "in", "me"), ["of", "doginme"]),   # 4 -> 2; "in"/"me" timings dropped (supported)
    (("doggy", "me"), ["doginme"]),                   # 2 -> 1 merge, whole 28.90-29.705 s span kept
    # THE PROTECTED HOOK DOUBLING, "I got that dog in me. Right. I got that dog WITH me." Both limbs are
    # protected by name in the run contract and neither is deduped (they are not adjacent repeats, so
    # cleanup() never sees them). What DID break was the LINE BREAK: "me" is a 2-char word arriving as
    # the SIXTH short token, so the 3/5 caps flushed after "in"/"with" and stranded a caption reading
    # just "me" for 0.90 s and 0.76 s - on the hook, where cadence is the only performance element left
    # on screen in this captions-only batch. Riding "me." on the preceding token (the documented
    # ("good","for","meme") -> ["good","for a","meme"] pattern; it renders as normal words) makes the
    # middle token 5-8 chars, which drops the cap to 3 and yields the SAME two-caption shape for both
    # limbs: "i got that" / "dog in me." and "i got that" / "dog with me." The period is real (the
    # MASTER punctuates both ' me.' tokens; this clip's pass drops both). 4 -> 3 words each, keyed on
    # the leading "that" so the token-name merges above can never collide with them.
    (("that", "dog", "in", "me"), ["that", "dog in", "me."]),
    (("that", "dog", "with", "me"), ["that", "dog with", "me."]),
    # FOUR MISSING SENTENCE PERIODS inside the two PROTECTED beats. Grouping breaks on [.?!], so a
    # dropped period welds two of his sentences into one caption: without these the self-Q&A read
    # "i don't know i" / "think so that" / "means it's 100x" and the peak read "man that's nuts", i.e.
    # every sentence boundary in the emotional core landed mid-caption. Each period is present in the
    # MASTER pass of the same audio (4505.580 ' know.', 4506.060 ' so.', 4514.360 ' man.', 4515.480
    # ' nuts.') AND in the medium.en whole-clip pass of this spine; only the clip's own pass drops them.
    # Both rules are keyed on the surrounding run ("so that means" and "don't know I" are ordinary
    # English, so a bare key would rewrite future clips). 6 -> 6 and 3 -> 3, every timing preserved.
    # ⚠ The self-Q&A run carries BOTH its periods in ONE rule on purpose. Splitting it into
    # ("i","dont","know","i","think") + ("think","so","that","means") does NOT work: core() strips the
    # period, so the first rule re-matches its own output on every fixpoint pass and re-consumes
    # "think" before the second rule can ever reach it - the "so." period silently never appeared.
    (("i", "dont", "know", "i", "think", "so"), ["i", "don't", "know.", "i", "think", "so."]),
    (("man", "thats", "nuts"), ["man.", "that's", "nuts."]),
    # THE DOUBLED HARD-OUT, "Craziness, craziness, man." (PROTECTED_DOUBLES keeps both limbs; see
    # below). One period, on the FIRST limb only: with none, all three words rode one 23-char caption
    # that wrapped to two lines and held 1.34 s, which reads as one word repeated by accident; with
    # three, "man." became a 0.26 s caption of its own. One period splits it into "craziness." (0.54 s)
    # and "craziness man." (0.80 s), so the repeat is visible AS a repeat at his own pace. The MASTER
    # punctuates all three; 3 -> 3 words, every timing preserved.
    (("craziness", "craziness", "man"), ["craziness.", "craziness", "man."]),
    # "I MEAN, ISN'T IT reasonable to get to 400 million..." — the clip's own pass renders the filler
    # plus the contraction as "Is it isn't a reasonable" (not English). The tighten plan REFUSED to cut
    # the 0.145 s "I mean" (no trough on either side; a cut would shave the vowel onset of "isn't") and
    # requires it captioned. Three 1x passes supply the words: medium.en whole-clip on this spine reads
    # "I mean, is it is it a reasonable", medium.en on an isolated 14.30-17.20 s returns verbatim
    # "I mean, isn't it reasonable to get to $400,000,000 in thi-", and the MASTER reads " I / mean, /
    # isn't / it / reasonable" at 4498.960-4500.100 (p 0.72/0.99/0.99/0.90/0.87). 5 -> 5 words, every
    # timing preserved. Keyed on the full five-token garble so nothing legitimate can match.
    (("is", "it", "isnt", "a", "reasonable"), ["i", "mean,", "isn't", "it", "reasonable"]),
    # The SECOND limb of the protected rhetorical self-Q&A, "...bull run? ISN'T IT REASONABLE?" Same
    # "isn't a reasonable" garble; keyed on the preceding "run" so the phrase "isn't a reasonable
    # <noun>" in a future clip can never match, and so the two limbs stay two sentences (the added
    # question marks are where the MASTER punctuates and they break the caption group at both pauses).
    # 4 -> 4 words, every timing preserved.
    (("run", "isnt", "a", "reasonable"), ["run?", "isn't", "it", "reasonable?"]),
    # Market caps and multipliers render as FIGURES, house style (same class as ("900","k") -> "900k"
    # and ("a","thousand","x") -> "1000x"). Every number below is one Mike says out loud in this clip
    # and nothing is computed: 107m ATH, 400m target, 100X, 800m, 200X.
    (("a", "hundred", "and", "seven", "million"), ["107", "million"]),   # 5 -> 2, "all-time high of doginme is 107 million"
    (("four", "hundred", "million"), ["400", "million"]),               # 3 -> 2, "get to 400 million"
    (("eight", "hundred", "million"), ["800", "million"]),              # 3 -> 2, "make it an 800 million market cap"
    # THE PEAK, and the tighten plan pins every line of it. Whisper renders the multiplier "X" as
    # "acts"/"extra" throughout this livestream, so all three keys below are garbles that cannot occur
    # legitimately. The peak's FIRST line must read "That means it's 100X from here." with NO leading
    # "And" (that "and" belonged to the false start the tighten pass removed) - the clip's own pass and
    # medium.en whole-clip both already start the sentence at "that", and medium.en on an isolated
    # 19.80-22.75 s returns verbatim "I don't know, I think so. That means it's 100x from here."
    (("a", "hundred", "acts"), ["100x"]),      # 3 -> 1 merge, "that means it's 100x from here." 21.54-22.18
    # "THAT MEANS IT'S ACTUALLY 100X, man." — the clip's own pass hears "I'm using an actual hundred
    # hundred acts man", which is not English. medium.en on an isolated 21.00-25.20 s returns verbatim
    # "That means it's 100x from here. That means it's actually 100x, man.", medium.en whole-clip reads
    # "That means it's actually a hundred hundred X man", and the MASTER reads "That means it's actually
    # 100 X, man." at 4512.140-4514.360. Two rules because cleanup()'s stutter collapse eats the second
    # adjacent "hundred" BEFORE this runs, so the surviving run is "actual hundred acts": the first rule
    # is 4 -> 4 with every timing preserved, and the second CASCADES on the fixpoint's second pass
    # (its key is the "actually" the first rule emits) and is 3 -> 2. "man." keeps its own timing.
    (("im", "using", "an", "actual"), ["that", "means", "it's", "actually"]),
    (("actually", "hundred", "acts"), ["actually", "100x"]),
    # "That's nuts. 100X FROM HERE. Craziness." — the second, PROTECTED "100X from here" plus the
    # closing word of the peak. The clip's pass renders it "a hundred extra me a craziness"; medium.en
    # on an isolated 24.60-27.50 s returns verbatim "That's nuts. 100x from here. Craziness." and the
    # MASTER reads "100 X from here. Craziness." at 4516.940-4518.760. First rule 4 -> 3 (the phantom
    # "me" timing is dropped); the period on "here." breaks the group exactly where his sentence ends.
    # The second rule kills a phantom article: the clip's pass emits an ' a' at 26.780-27.020 that sits
    # almost entirely inside the MEASURED silence 26.785-26.925, and neither medium.en nor the MASTER
    # has any article before "craziness". 2 -> 1 merge keeps the whole 26.78-27.38 s span.
    (("a", "hundred", "extra", "me"), ["100x", "from", "here."]),
    (("a", "craziness"), ["craziness."]),
    # ⚠ THE /k/-BURST AUDITION ITEM, and the ONE place a decoder artifact is overruled by measurement.
    # The tighten pass's second removal (master 4536.87-4537.41) cut the hedge tic "to like" out of
    # "and make it TO LIKE an 800 million market cap" and ended on the /k/ closure trough of "like";
    # its plan flagged that the /k/ RELEASE burst survives the splice. MEASURED on the staged spine at
    # 5 ms hop / 10 ms window: digital silence (the declicked join) 33.330-33.365, then a 15-20 ms
    # plateau at -39.7/-39.2 dB across 33.370-33.385, then the vowel onset of "an" at 33.390 (-26 dB,
    # -19 dB by 33.395), i.e. the residual burst is ~21 dB UNDER the speech around it and is contiguous
    # with the following vowel - a stop release on a syllable onset, not a click in silence. It is
    # nonetheless enough to make a WHOLE-CLIP decode insert a word: the clip's own pass reads " got"
    # (0.16 s) and medium.en whole-clip reads " got" at p 0.27. FOUR isolated-window passes on the same
    # audio read the real word: medium.en 30.30-36.10 and 32.60-35.20 and 31.80-34.60, and large-v3
    # 30.30-36.10, all return "make it AN 800 million market cap"; the MASTER reads ' an' p 0.95 at
    # 4537.380. He never says "got", so "got" is not captioned; "an" is what the audio contains and
    # what five passes produce. 3 -> 3 words, every timing preserved, keyed on the full run.
    (("make", "it", "got"), ["make", "it", "an"]),
    # NOT corrected, deliberately (doginme-100x-if-500x), five calls tested against this clip's audio:
    #  - the opening token is " dog", NOT "doginme". SEVEN 1x passes read one syllable there and the RMS
    #    shows a single 0.35 s voiced syllable at 1.345-1.690 with the next word already at 1.75. The
    #    clip's tighten-plan gate asked for "I got some doginme"; that word is not in the audio, so it
    #    is not put on screen (the token still appears twice via the merges above, and on the cover).
    #  - the second limb is "I got that dog WITH me". SIX 1x passes read "with" (incl. large-v3 and an
    #    0.8x pass) and the MASTER reads ' with' p 0.74, while every pass reads " in" for the FIRST
    #    limb. The variation is his; no rule invents "in". Both limbs of the PROTECTED doubling stay.
    #  - "Right." stays one word: the measured voiced block 3.790-4.050 has a 0.145 s core = ONE
    #    syllable, and three passes read "Right" against medium.en's "All right".
    #  - "It WAS like the first dog on the base chain" keeps "was" (medium.en isolated 6.70-11.45 and
    #    the MASTER both read "It was like"; the clip's pass reads "It's like"). No rule needed: the
    #    tighten gate's preference matches the shipped tokens closely enough that only the contraction
    #    differs, and both are grammatical, so the clip's own decode stands.
    #  - "we get a 200x" gets NO leading "and" (see _patch_words.py: the MASTER's "and" sits inside the
    #    1.06 s pause 5B removed, and four passes on this spine read "we get").
    # --- last-year batch, 2026-08-11 (lab-353x-underestimate, clip 2) ---
    # "after this October 10th crash and seeing that IT didn't recover at all" — the subject is THE
    # COIN, not Mike. The clip's own pass renders the pronoun as "I", which puts the failure on him
    # ("seeing that I didn't recover at all") and inverts the vindicated register the whole clip is
    # built on. Verified: medium.en whole-clip on this same spine reads "and seeing that it didn't
    # recover at all", and the MASTER (last-year LOW BPS VERTICAL) reads the same clause about the
    # token. Keyed on the full four-token run (and on "recover", which only occurs here) so a
    # legitimate "that I didn't ..." elsewhere can never match. 4 -> 4 words, every timing preserved.
    (("that", "i", "didnt", "recover"), ["that", "it", "didn't", "recover"]),
    # --- last-year batch, 2026-08-11 (meme-fud-130x, clip 1) ---
    # The batch tighten log lists FOUR mandated caption-time STT fixes for this clip: "tutorial on
    # BMW" -> Tutorial ($TUT) on BNB, "pingu" -> Pengu, "spreading fun" -> spreading FUD, "58 exer"
    # -> 58x-er. Pengu is the global CORRECTION added above; the other three are keyed runs here.
    # Every rule below was checked against THIS clip's own whisper-words.json first, and the extra
    # ones were each resolved by re-decoding the span in isolation (medium.en and/or large-v3) with
    # the MASTER pass (last-year LOW BPS VERTICAL, a 4th 1x decode WITH full context) as corroboration.
    #
    # THE TOKEN IS $TUT. The clip's own pass already reads "BNB" correctly (the master's "BMW" garble
    # did not survive into the clip), so only the NAME needs the cashtag: the montserrat preset
    # lowercases everything via CSS, so "Tutorial" renders identically to the ordinary English word
    # and ONLY the cashtag disambiguates it (identical finding to the $LAB and $TUT rules above).
    # cleanup() collapses Whisper's doubled " on on" BEFORE this runs, so the run presented here is
    # "94x on tutorial on bnb". Keyed on the "on ... on" frame so the tutorial-batch keys above
    # ("is","tutorial","on") / ("so","tutorial","for") can never collide, and so an ordinary tutorial
    # (a how-to video) in a future clip is untouched. Idempotent: core("$tut") == "tut".
    (("on", "tutorial", "on"), ["on", "$tut", "on"]),
    # "look at this thing. FREAKING 94X, holy crap" — the clip's own pass renders the peak as "we can
    # 94x" (p 0.45 / 0.58), which is not English. THREE independent 1x decodes return "freaking":
    # medium.en on an isolated 25.60-29.30 s ("Look at this thing freaking 94X holy crap"), large-v3
    # on the same window ("man look at this thing freaking 94x holy crap"), and the MASTER at 187.68+
    # ("look at this thing man look at this thing freaking 94x holy crap"). The clip-plan's peak-beat
    # note quotes the line the same way. 4 tokens -> 3 words (the real "94x" token's timing is
    # dropped, which is supported; the group's on-screen time is set by its FIRST word). Keyed
    # through the preceding merged "this thing." so no bare "we can" anywhere can match.
    #
    # The FIRST of the two rules also fixes a 0.16 s CAPTION FLASH. He says "look at this thing" twice
    # (24.76 and 26.04); the second one's " thing." carries a period, and "thing" is 5 chars, so the
    # 3-word cap flushed after "look at this" and shipped "thing." as a caption of its own for 5
    # frames. Riding it on the previous token (the documented ("good","for","meme") ->
    # ["good","for a","meme"] pattern) yields "look at this thing." as one 0.50 s caption. Keyed with
    # the FOLLOWING "we" so the first occurrence ("look at this thing man.") can never match it.
    # 5 tokens -> 4 words; then the second rule CASCADES on the fixpoint's next pass.
    (("look", "at", "this", "thing", "we"), ["look", "at", "this thing.", "we"]),
    (("thisthing", "we", "can", "94x"), ["this thing.", "freaking", "94x"]),
    # THE CLAUSE BREAK after the peak. No pass punctuates it, and without a period "holy crap like
    # what if" is five <=4-char words with zero gaps, so the 5-word short cap ships them as ONE
    # run-on caption across a real clause boundary (the exclamation ends; the "like, what if..."
    # riff begins). Both isolated decodes end their window exactly there ("holy crap like what?"),
    # and the clip-plan quotes it as "freaking 94x, holy crap! What if Toshi is gonna pump". Nothing
    # is invented or removed - this is purely the documented grouping fix (same class as
    # ("billion","is","imagine") -> ["billion.","just","imagine."]). 3 -> 3, timings preserved.
    (("holy", "crap", "like"), ["holy", "crap.", "like"]),
    # "...are gonna pump? NOW I know some of them are dead." The clip's own pass hears "No," (p 0.40)
    # which flips a concession into a denial. THREE 1x decodes read "now": the MASTER ("gonna pump
    # now I know some of them are dead"), medium.en on an isolated 34.40-36.90 s and medium.en on a
    # wider 33.60-37.60 s. Keyed on the preceding "pump" so no ordinary "no, I know" can match; the
    # question mark on "pump?" is already in the source and is what breaks the caption group.
    (("pump", "no", "i", "know"), ["pump?", "now", "i", "know"]),
    # "the devs ARE like: ah, hell with this." The clip's pass and the MASTER (both small, whole-file,
    # i.e. correlated) read "the devs OF like", which is not English. BOTH isolated stronger decodes
    # read "are": medium.en on 37.40-41.80 and large-v3 on 37.30-41.90 ("the devs are like ah hell
    # with the hell with this you know they jump ship"). Only the copula is touched - the stammered
    # "hell with the hell with this" is left exactly as every pass renders it, because it is a real
    # false start. 4 -> 4, every timing preserved.
    (("the", "devs", "of", "like"), ["the", "devs", "are", "like"]),
    # "this is my 58X-ER from just two months ago" — the receipt. cleanup()'s digit+x merge produces
    # "58x" and leaves a stranded " or" (p 0.25) behind it, so without this the caption reads "58x
    # or from just". The tighten log mandates "58 exer" -> 58x-er, and three decodes carry the
    # suffix: the MASTER ("my 58 exer from just two months ago"), medium.en on an isolated
    # 44.10-47.40 ("This is my 58xer from just two months ago") and large-v3 on 41.60-45.40.
    # 2 tokens -> 1 merged word, whole 44.84-45.74 s span kept. Idempotent: core("58x-er")=="58xer".
    (("58x", "or"), ["58x-er"]),
    # "...crazy, right? THIS IS NUTS." The clip's pass emits a single 0.68 s " Nuts" with no period,
    # so the group ran on into the next sentence as "nuts and then". large-v3 on an isolated
    # 55.40-58.60 s returns "Look at that. Crazy, right? This is nuts. And then people..." and the
    # MASTER reads "look at that crazy right this is nuts and then". The period is therefore real.
    # Only punctuation is added: "this is" is NOT put on screen, because the clip's own pass (the one
    # the final render is whisper-verified against) has one token there. 2 -> 2, timings preserved.
    (("right", "nuts"), ["right?", "nuts."]),
    # "THE OPEN INTEREST right now is really really up" — the clip's pass hears "They're open the
    # interest", which is not English. medium.en on an isolated 50.10-53.70 s returns "flying right
    # now. The open interest right now is really..." and the MASTER reads "the open interest right
    # now is really really up". 4 tokens -> 3 words (the 4th timing is dropped, which is supported).
    (("theyre", "open", "the", "interest"), ["the", "open", "interest"]),
    # MEME coins, not "mean" coins — the phrase the whole clip is about. Two occurrences, each keyed
    # on the word before it ("what IF mean coins" 62.58 s, "what mean coin is" 84.76 s) so a
    # legitimate "mean" in a future clip can never be rewritten. medium.en on 61.20-65.00 returns
    # "what if meme coins from last year can still pump" and on 82.30-86.30 "What meme coin is going
    # to replace Toshi now?"; the MASTER reads "what meme coin is going to replace toshi now".
    (("if", "mean", "coins"), ["if", "meme", "coins"]),
    (("what", "mean", "coin"), ["what", "meme", "coin"]),
    # FUD, not "fun" — the mandated fix, and the spine of the clip ("every single influencer
    # spreading FUD about meme coins", "so if you're spreading FUD about Toshi"). Every decoder on
    # every pass hears "fun" (the master included), and "spreading fun about <token>" is not
    # something anyone says; the batch tighten log lists this fix in terms. Fires on both
    # occurrences (68.28 s and 75.92 s), the second one on the fixpoint's next pass after the rule
    # below re-emits "spreading". 2 -> 2, every timing preserved.
    (("spreading", "fun"), ["spreading", "fud"]),
    # "SO IF YOU'RE spreading FUD about Toshi?" — the clip's pass reads "so you for spreading", which
    # is not English, and large-v3 garbles it differently ("so you've spread a foot about toshi").
    # The MASTER reads "so so if you're spreading fun about toshi" and the clip's own tighten log
    # pins this span in terms: "The kept burst at 3673.00 is 'so if you're spreading FUD about
    # Toshi', so the peak beat keeps its natural 'so' lead-in, untouched." 4 tokens -> 3 words (the
    # 4th timing is dropped); the two-word "if you're" rides one slot, the documented
    # ("good","for","meme") -> ["good","for a","meme"] pattern, and renders as normal words.
    (("so", "you", "for", "spreading"), ["so", "if you're", "spreading"]),
    # "Toshi is THE face of Base" — the claim, and the reason the closing question lands. The clip's
    # pass and the MASTER (both small, whole-file) read "a face"; BOTH isolated stronger decodes read
    # "the face" (medium.en on 79.10-82.90 and large-v3 on 79.00-83.00, "Toshi is the face of bass"),
    # and the clip-plan quotes the line that way. Keyed on the full four-token run.
    (("toshi", "is", "a", "face"), ["toshi", "is", "the", "face"]),
    # THREE MORE CAPTION FLASHES / SENTENCE WELDS, all the same class as the "thing." fix above. No
    # word is added or removed by any of them; they only move a boundary the decoder put in the wrong
    # place, and each period is one the isolated decodes punctuate.
    #   "this thing is flying RIGHT NOW." — " now." (50.78-50.94) was stranded as a 0.16 s caption
    #   because "flying" (6 chars) drops the cap to 3 and flushes after "is flying right". Riding it
    #   gives one 0.88 s "is flying right now." 3 -> 2 words ("now"'s timing is dropped).
    (("flying", "right", "now"), ["flying", "right now."]),
    #   "...and people getting LIQUIDATED. It's like, what if meme coins..." — the clip's pass has no
    #   period, so the sentence welded into the next one and shipped "getting liquidated it's".
    #   medium.en on an isolated 61.20-65.00 s opens its window "It's like, what if meme coins from
    #   last year can still pump?", i.e. a fresh sentence. 3 -> 3, every timing preserved.
    (("getting", "liquidated", "its"), ["getting", "liquidated.", "it's"]),
    #   "...Toshi is the face of BASE. Well, what is..." — same weld, shipped as "the face of base
    #   well". Both isolated decodes end the sentence on "base" ("Toshi is the face of bass."), and
    #   " Well," starts the next clause. 4 -> 4, every timing preserved.
    (("face", "of", "base", "well"), ["face", "of", "base.", "well"]),
    # ⛔ THE ENDING. "what meme coin is gonna replace TOSHI NOW?" is the comment-bait question the
    # whole clip is built to land on, and it is the last thing on screen. Left alone, " now?"
    # (86.12-86.28) is its own caption for 0.22 s against a spine that ends at 86.337 - the payoff
    # word flashing for 6 frames. Riding it on "toshi" gives ONE closing caption, "gonna replace
    # toshi now?", on screen for 1.02 s to the end of the clip. Keyed on the preceding "replace"
    # AND the following "now" so the clip's OTHER "replace toshi" (78.62 s) cannot match. 3 -> 2
    # words. (The colourizer is given the merged token so the name keeps its accent colour.)
    (("replace", "toshi", "now"), ["replace", "toshi now?"]),
    # NOT corrected, deliberately (last-year/meme-fud-130x), four calls tested against this clip's
    # own audio:
    #  - the 2.78 s hole at 11.22-14.00 in the word JSON is NOT dropped speech. RMS at 50 ms shows one
    #    0.45 s voiced blip at 12.35-12.80 (-19 to -23 dB) inside otherwise -50 to -58 dB silence, and
    #    medium.en on an isolated 10.90-15.20 s returns "stuff. UM, but yeah, man." (a tighter
    #    11.60-14.60 s window returns "Um... But yeah."). It is a filler, which cleanup() drops
    #    anyway, so there is nothing to patch into a whisper-words-verified.json.
    #  - "because I saw the base that's like" (79.68-80.76) is left exactly as shipped. It is low
    #    confidence (p 0.36/0.18/0.62/0.69) and both isolated decodes garble it differently ("Because
    #    us on the bass", "because I was on the bass tour"), but the MASTER reads "because I saw the
    #    base that's like" VERBATIM, so the clip's own pass has an independent contextful 1x pass
    #    behind it and nothing better exists. Never ship words no 1x pass produced.
    #  - "look at here Velvet" keeps "here": the clip's pass, medium.en and large-v3 all read it.
    #  - "these these coins" (2.82-3.52) is NOT protected and collapses to "these coins" - it is a
    #    plain stutter, and the batch tighten log's kept-doubling list names only "velvet velvet",
    #    "this this thing", "and then and then" and "just from last year, just from last year".
    # --- last-year batch, 2026-08-11 (kitsu-vlads-dog clip 3) ---
    # The commenter's line is "this is the SHIBA OF ROBINHOOD" (it is the @KitsuRobinhood banner,
    # legible on his own screen-share for the first ~58 s of the clip). Whisper drops the "of" and
    # renders "the Shiba Robin Hood" (p 0.53 on "Robin"). medium.en on an isolated 0-4.5 s returns
    # "This is the Shiba of Robinhood" verbatim. 3 tokens -> 3 words, every timing preserved. The
    # existing ("robin","hood") rule can never reach this run: at the "shiba" position this longer
    # key matches first, so the pointer never lands on "robin".
    (("shiba", "robin", "hood"), ["shiba", "of", "robinhood"]),
    # "it's a real dog, and VLAD'S Shiba Inu" - the clip's pass drops the possessive ("and Vlad
    # Shiba Inu"). medium.en on 5.2-9.4 s and again on 4.6-8.6 s both return "Vlad's". Keyed on the
    # following "shiba" so a bare "Vlad" elsewhere is untouched. (The surrounding "and Vlad's Shiba
    # Inu and it is" gear-1 phrasing is a DELIBERATE keep, named in the clip's tighten plan.)
    (("vlad", "shiba"), ["vlad's", "shiba"]),
    # "I can't wait FOR US to get into this bull run" - Whisper hears the name "Les" (p 0.81);
    # medium.en on 39.5-44.6 s returns "I can't wait for us to get into this bull run". The clip
    # plan and the tighten plan both flag this one by name. Keyed on "wait for" so a real Les is
    # never rewritten.
    (("wait", "for", "les"), ["wait", "for", "us"]),
    # NOT corrected, deliberately (last-year/kitsu-vlads-dog), every call tested by ear against this
    # clip's own audio, because the clip carries TWO near-homophone token names:
    #  - KITSU (Vlad's dog / the Robinhood-chain coin) vs KISHU INU (the 2021 token). The clip's own
    #    pass already spells them apart correctly at 53.70, 61.24 (Kitsu) and 64.00, 64.96, 73.84
    #    (Kishu), confirmed by medium.en on isolated 52.9-56.4 / 60.3-65.6 / 71.5-74.6 s windows.
    #  - the 82.02-83.20 "kitsu, kitsu, kitsu" repetition run is ALL THREE Kitsu. Both decodes say so,
    #    and it is MEASURED: the mean spectral centroid of each token's frication is 4090 / 4499 /
    #    5764 Hz (peaks 5472 / 5844 / 6336), against this speaker's own references in the same clip -
    #    Kishu 3460 and 3429 Hz (peaks 3992 / 3675, i.e. a post-alveolar /sh/) vs Kitsu 4366 and
    #    5415 Hz (peaks 5526 / 6071, the broadband /ts/ affricate). No token in the run comes near
    #    the /sh/ cluster. No rule needed; the spelling is already right.
    #  - "there's some SILLY INU that out of nowhere just exploded" is NOT a token name. Three
    #    decodes agree (the clip's pass at p 1.00, medium.en on 74.4-79.0 s and again on 75.3-77.7 s),
    #    and it reads as plain English about a generic dog coin, so the caption stays generic rather
    #    than guessing a project. Never invent a name.
    #  - "he actually has a Shiba Inu, CEO ADOPTED during the Doge era" keeps "CEO": the clip's pass
    #    (p 0.98) plus two independent medium.en windows (13.8-18.6 s and 14.6-20.4 s) all return it.
    #  - "you know how bullish that is, man" takes NO leading "do" (the delegation quotes it as "do
    #    you know how..."): the clip's pass, medium.en on 34.4-39.6 s and medium.en on 33.9-39.2 s
    #    all start the line on "you". Never ship words no pass produced.
    # --- last-year batch, 2026-08-11 (kaspa-excavator clip 4) ---
    # "I'm BATTLE-HARDENED" (the clip's hard-out line). Two forms have to be handled because the
    # decoders disagree on the word boundary, which is exactly why the batch flags it:
    #   * the clip's own pass    -> "battle" + "hardened."   (p 0.97 / p 0.23 - low confidence)
    #   * medium.en on 58.6-61.6 -> "I'm battle-hardened."   (the hyphenated compound)
    #   * medium.en on 59.2-62.2 -> "I'm battle hard and"    (the garble the batch names by name)
    # The first rule is the HYPHEN MERGE for the compound adjective (same mechanical class as
    # ("post","having") -> "post-halving" above): it is not inventing words, it re-joins two tokens
    # the clip already produced, and it makes the phrase un-splittable across two caption groups.
    # The second rewrites the "hard and" split, which is a non-phrase in this catalogue.
    (("battle", "hardened"), ["battle-hardened"]),
    (("battle", "hard", "and"), ["battle-hardened"]),
    # --- johnny batch, 2026-08-12 (johnny-cash-button clip 1) ---
    # "I'm not going to play that JOHNNY CASH..." — the song he is about to fire off the soundboard,
    # and the whole premise of the clip (he then plays it, and the recording is audibly Johnny Cash's
    # "Ring of Fire"). BOTH decoders hear the surname as "Castle" (this clip's own pass at 13.38 s,
    # and medium.en on an isolated 11.6-15.2 s returns "I'm not gonna play that Johnny Castle"), so
    # the fix is MIKE'S CALL off the source material, not an ASR reading — the same precedence as the
    # MYX correction above. The batch clip-plan records it in terms ("'johnny castel' = Johnny Cash
    # song"). Keyed on the pair so the Dirty Dancing character could never be rewritten by a bare
    # \bcastle\b rule. 2 tokens -> 2 words, every timing preserved.
    (("johnny", "castle"), ["johnny", "cash"]),
    # "I don't want to do it, man. I'M GETTING SCARED." — the beat right before he pushes the button.
    # This clip's own pass renders "I'm going to scared", which is not English. medium.en on an
    # isolated 35.4-38.4 s returns "I don't want to do it, man. I'm getting scared."; a second window
    # at 36.0-39.6 s returns "I've been scared" — both decoders agree on the ADJECTIVE and on a
    # copular/progressive verb, and neither produces "going to". "getting" is the reading of the
    # window that contains the whole sentence with its lead-in. 4 tokens -> 3 words (the 4th timing is
    # dropped, which is supported; the trailing period rides across, so the caption group still breaks
    # on the sentence end). Keyed on the full 4-token run, which is a non-phrase, so nothing else can
    # match. Flagged to Mike for an ear check.
    (("im", "going", "to", "scared"), ["i'm", "getting", "scared"]),
    # The SUNG lyric: "I went down, down, down and THE FLAMES WENT HIGHER". This clip's own pass
    # renders "the flames went up." with a 0.02 s "up." token (a duration that short is the model
    # telling you it invented the word). medium.en on an isolated 47.4-53.6 s returns "And the flames
    # went higher", the whisper-verify of the FINAL RENDER returns "and the flames went high", and it
    # is the actual line of the record playing on the soundboard. Three signals against one. Keyed on
    # the preceding "flames" so an ordinary "went up" (a chart, a price) can never match.
    (("flames", "went", "up"), ["flames", "went", "higher"]),
    # The HARD-OUT: "oh man, NOW YOU know it's coming." This clip's own pass hears "I know it's
    # coming" off a 0.12 s token at 61.84 s. THREE other 1x decodes all return "now you know":
    # medium.en on an isolated 60.8-62.8 s ("Oh man, now you know it's coming."), medium.en on a wider
    # 56.6-62.8 s, and the whisper-verify of the FINAL RENDER. It is also the refrain the clip repeats
    # three times ("you know, you know, you know, it's coming / now you know it's coming / oh man, now
    # you know it's coming"), so "I know" breaks the pattern on the last line of the short. 5 tokens ->
    # 5 words: "now you" rides ONE token slot (same mechanic as ("good","for","meme") above), because
    # a replacement may never be longer than the run it matches. Keyed on the preceding "man" so no
    # other "I know it's coming" can match.
    #
    # NOT corrected, deliberately (johnny/johnny-cash-button):
    #  - "you know, you know, you know, IT'S coming" and "now you know IT'S coming" keep "it's". The
    #    render's own decode and one medium.en window (58.2-62.8) offer "what's", but the clip's own
    #    pass, medium.en on 60.8-62.8, medium.en on 56.6-62.8 AND the batch clip-plan (read off the
    #    master transcript) all read "it's". Three to two, and the plan is the tiebreak.
    #  - "HE SAID don't do it" (49.14-50.44 s) stays. It is not in the record's lyric sheet, which is
    #    why it looks like a garble, but medium.en on an isolated 48.8-51.2 s returns "He said don't
    #    do it!" verbatim and the clip's own pass agrees. Two 1x passes produce it; it ships.
    (("man", "i", "know", "its", "coming"), ["man.", "now you", "know", "it's", "coming"]),
    # --- johnny batch, 2026-08-12 (duck-vs-peanut clip 2) ---
    # "...a law in the state of New York that people are not allowed to have SQUIRRELS AS PETS."
    # This clip's own pass renders "corals as pet" (a non-phrase: there is no coral anywhere in this
    # livestream, and the sentence is about the New York pet law that got Peanut the squirrel
    # seized). medium.en on an isolated 34.5-38.6 s returns verbatim "in the state of New York that
    # people are not allowed to have squirrels as pets." Keyed on the full 3-token run, which is a
    # non-phrase, so a legitimate "corals" in some future reef clip could never match.
    # 3 tokens -> 3 words, every timing preserved.
    (("corals", "as", "pet"), ["squirrels", "as", "pets"]),
    # "how old is he? HE'S THREE DAYS OLD." — the hook's punchline (the token is 3 days old). This
    # clip's own pass drops the contraction to a bare "Is" ("How old is he? Is three days old."),
    # which reads as a fragment on screen. medium.en on an isolated 0.0-6.2 s returns "How old is
    # he? He's three days old." Only the VERB is rewritten and the first token is re-emitted
    # unchanged; the 5-token key carries the preceding "he?" so an ordinary "he is three days old"
    # elsewhere can never match, and it is idempotent (core("he's") == "hes", so the fixpoint pass
    # cannot re-match). 5 tokens -> 5 words, every timing preserved.
    (("he", "is", "three", "days", "old"), ["he?", "he's", "three", "days", "old"]),
    # --- cooper-50x batch, 2026-08-15 (pmi-never-before clip 7) ---
    # The index is the ISM PMI (Institute for Supply Management purchasing managers index). The batch
    # caption gate (shorts/cooper-50x/caption-corrections.md) mandates "ISMPMI" -> "ISM PMI" for both
    # PMI clips; this clip's own pass splits it as "ISN" + "PMI" (the master renders it as one token
    # "ISMPMI" at p 0.16, i.e. the model has nothing either way). "isn" is a non-word here (core()
    # strips the apostrophe from "isn't" to "isnt", so a real contraction can never match), and the
    # pair only occurs where he names the index. 2 tokens -> 2 words, both timings preserved.
    (("isn", "pmi"), ["ism", "pmi"]),
    # "...before the bull run even STARTS." The tighten in-point ends segment 0 at master 3469.50
    # while the word runs 3469.07-3469.59, so the final /s/ is CLIPPED off the spine and both 1x
    # passes on the clip's own audio therefore hear "start" (its own small pass " start," and
    # medium.en on an isolated 6.60-8.20 s "the bull run even start."). The MASTER pass, on the
    # uncut audio and in full context, reads " starts" at p 0.98. Same class as ("are","real",
    # "project") -> [... "projects"] above: a tighten elision eating an inflection, restored from the
    # uncut source rather than invented. The period is added because segment 0 genuinely ends there
    # (the next word is the start of the second cut segment, "But ISM PMI..."), so the caption group
    # breaks exactly on the join. Keyed on the full 3-token run.
    (("run", "even", "start"), ["run", "even", "starts."]),
    # --- cooper-50x batch, 2026-08-15 (cooper-community-refused clip 2) ---
    # "No major marketing. No big push. No DEXSCREENER TRENDING. No artificial hype." Mike is reading
    # the @robinhoodcooper post aloud and the post is ON SCREEN in the content zone, spelling it
    # "Dexscreener trending" verbatim; the batch caption gate
    # (shorts/cooper-50x/caption-corrections.md) mandates this exact fix. This clip's own pass hears
    # "deck screener trading" (three tokens), medium.en on the whole clip agrees with it, i.e. both
    # decodes garble the product name the same way. "deck screener" is a non-phrase, so no unrelated
    # clip can match. 3 tokens -> 2 words: the replacement is SHORTER than the run (never longer),
    # the two emitted words keep the first two tokens' timings, and the trailing comma is carried.
    (("deck", "screener", "trading"), ["dexscreener", "trending"]),
    # "...supporting, raiding, TALKING ABOUT COOPER." The clip's own pass renders the last word as
    # "group" (medium.en on the same audio offers "groups"), because the word sits at the very END of
    # cut segment 0 and only its "-per" release survives as a ~0.16 s token at 15.56-15.72. It is
    # "Cooper", and that is not a guess from three sources agreeing loosely, it is the record:
    #   - the MASTER transcript reads " Cooper" at 233.86-234.14 (p 0.79), followed by " and";
    #   - the clip's tighten plan moved segment 0's out-point 234.05 -> 234.15 with the reason "raw
    #     out chops 'Cooper' mid-word (the '-per' release runs 234.00-234.11) ... dropping the
    #     dangling 'and'", i.e. the word was DELIBERATELY preserved in the spine;
    #   - the @robinhoodcooper post he is reading, visible in the content zone, says "talking about
    #     Cooper and".
    # The period is added because the tighten genuinely ends the sentence there (the next token is
    # the start of cut segment 1, "Be ready for Monday"), so the caption group breaks on the join
    # instead of welding two posts into one line. Same class as ("run","even","start") above. Keyed
    # on the full 3-token run so an ordinary "talking about group" elsewhere can never match.
    # 3 tokens -> 3 words, every timing preserved.
    (("talking", "about", "group"), ["talking", "about", "cooper."]),
    # --- cooper-50x batch, 2026-08-15 (pmi-expansion-first clip 6) ---
    # THE OPENING GARBLE the batch caption gate flags at master 3453.15-3455.25 ("Like we never
    # happened why that happened before") and orders re-listened. This clip's own pass renders the
    # run as "like we never have, why that happened before", which is not English - the 0.14 s "why"
    # (p 0.40) is a hallucination sitting where the /d/ of "had" is. FIVE 1x passes on the clip's own
    # audio agree on the words: medium.en on an isolated 2.20-5.60 s "Like, we never had that happen
    # before.", medium.en on a wider 1.90-6.60 s "Like we never had that happen before in the
    # entirety of crypto.", large-v3 on the narrow window, large-v3 on the wide window ("we never
    # have had that happen before") and large-v3 on the wide window primed with a bull-run prompt
    # ("Like we never had that happen before in the entirety of crypto."). 8 tokens -> 7 words: the
    # replacement is SHORTER than the run (supported; the last timing is dropped), so the caption
    # group simply ends on "before" and holds until the next chunk. Keyed on the full 8-token garble,
    # which can only occur here.
    (("like", "we", "never", "have", "why", "that", "happened", "before"),
     ["like", "we", "never", "had", "that", "happen", "before"]),
    # "...before, IN THE, IN THE entirety of crypto" - a two-token false start (the MASTER reads it
    # the same way, "In the in the entirety of crypto", at 3457.19). cleanup()'s stutter collapse only
    # ever sees ADJACENT single tokens, so a repeated PAIR survives and lands as two consecutive
    # captions both reading "in the", which looks like a duplicated caption rather than a stumble.
    # Same class as ("maybe","the","your","winner") -> ["maybe","your","winner"] above: a false start
    # dropped for readability, never a word invented. 6 tokens -> 4 words (the last two timings are
    # dropped, which is supported), keyed on the full run so nothing else can match.
    (("before", "in", "the", "in", "the", "entirety"), ["before", "in", "the", "entirety"]),
    # NOT corrected, deliberately (cooper-50x/pmi-expansion-first): the batch caption gate lists
    # "before they're having" (master 3525.9-3526.65) -> "before the halving". It is NOT applied.
    # The MASTER's "they're having" is the only decode that even resembles it; SIX 1x passes on THIS
    # clip's own audio all return "before that happen(ing/ed)" - the clip's own word pass ("before
    # that happening", 41.06-41.70), medium.en on an isolated 39.60-43.40 s, medium.en on a wider
    # 38.00-44.20 s, large-v3 on the wide window, large-v3 on a tight 40.40-42.40 s, and large-v3 on
    # the wide window PRIMED with "Bitcoin halving cycle, ISM PMI, all time high." (which still
    # returned "before that happening"). The envelope also shows a ~60 ms near-silent closure at
    # 41.49-41.56 (down to -34 dB) inside the word, i.e. a /p/ stop, not the continuous /v/ of
    # "halving". And "another Bitcoin all time high before that happening" is coherent in THIS cut:
    # "that" is the ISM PMI expansion he has just described as starting, which is exactly what the
    # kicker then argues (the 2024/2025 all time highs happened while PMI sat below 50). Shipping
    # "the halving" would put a word on screen that no 1x pass produced and would fail the final
    # render's whisper-verify. Do not add a rule for it.
    # --- cooper-50x batch, 2026-08-15 (tut-rug-to-ath, clip 3, the FULL cut) ---
    # The token is TUTORIAL, ticker $TUT (persona project_handles maps tutorial/tut -> @tutorialtoken)
    # and the batch's caption-corrections file requires "tutorial -> TUT" for this clip. The montserrat
    # preset lowercases everything via CSS, so "Tutorial" renders identically to the ordinary English
    # word and ONLY the cashtag disambiguates it - the identical finding as the tutorial-batch rules
    # above. All five occurrences in this clip are keyed on their neighbours, so an ordinary "tutorial"
    # (a how-to video) in a future clip can never match. Idempotent: core("$tut") == "tut".
    (("so", "tutorial", "on"), ["so", "$tut", "on"]),          # "so $TUT on BNB" 20.82-22.72 s
    (("then", "tutorial", "just"), ["then", "$tut", "just"]),  # "and then $TUT just a few days ago" 27.90 s
    # Keyed on the MULTIPLIER in front of it, because Whisper carries no sentence break between
    # "...and did 130X" and "$TUT serves as a reminder": without the added period the two sentences
    # weld into one caption reading "130x $tut serves". 3 -> 3 words, every timing preserved.
    (("130x", "tutorial", "serves"), ["130x.", "$tut", "serves"]),   # 34.12-37.02 s
    (("with", "tutorial", "and"), ["with", "$tut", "and"]),    # "we made a comeback with $TUT" 95.48 s
    # THE CLOSING RECEIPTS RUN, four separate mishears inside five tokens: "we did like a lot of
    # GAINS, PIPPIN 85X, $TUT." The clip's own pass renders it "games, Pippen 85 eggs tutorial."
    # - "games" -> "gains" is mandated by the batch caption-corrections file (master 1958.5); he is
    #   listing multiples, and "we did a lot of games" is not a thing he says.
    # - "eggs" -> the multiplier: medium.en on an isolated 90.80-94.40 s returns "Pippin 85x tutorial"
    #   verbatim, i.e. the same phoneme run the small pass heard as "eggs". cleanup()'s digit merge
    #   only fires on ""/"percent"/"x", so it can never reach an "eggs" token.
    # - "Pippen" -> "Pippin" is the batch gate's fix and the same token the existing ("on","pippen")
    #   rule fixes in the what-if-1000x batch; that rule cannot match here (the preceding word is
    #   "games", not "on"), hence this key.
    # 5 tokens -> 4 words (the last timing is dropped, which is supported). Keyed on the full run so
    # nothing else can match, and the period after "gains" breaks the caption on the real sentence end.
    (("games", "pippen", "85", "eggs", "tutorial"), ["gains.", "pippin", "85x", "$tut."]),
    # "$LAB", the named project of the closing barrage, which HAS a real reference logo on disk
    # (LAB.png). Same finding as the early-crash ("lab","token") rule above: the montserrat preset
    # lowercases everything, so only the cashtag separates the token from the English word "lab" in
    # "we did a 353x on lab." Keyed on the merged multiplier token so nothing else can match.
    (("353x", "on", "lab"), ["353x", "on", "$lab"]),
    # "saying that MEMES from last year are not going to pump" - the clip's own pass hears "means"
    # (the thesis of the whole short is about memes from last year). medium.en on an isolated
    # 36.00-42.50 s returns "saying that memes from last year are not going to pump" verbatim.
    # "saying that means from last year" is not English. Keyed on the three-token run; the existing
    # ("any","means") rule cannot reach it.
    (("that", "means", "from"), ["that", "memes", "from"]),
    # THE REVEAL LINE, and the clip's whole payoff: "A NEW all time high. Holy crap. A new all time
    # high is absolutely insane." The clip's own pass renders the FIRST one as "I knew all time
    # high", which is not English; medium.en on an isolated 59.80-64.60 s returns "And new all-time
    # high. Holy crap, a new all-time high is absolutely insane.", i.e. both decoders hear the same
    # /ə nu:/ onset and only the small pass turns it into the verb. The second occurrence (62.68 s)
    # already reads "A new all time high" in the shipped pass, so the two now match on screen.
    # 5 -> 5 words, every timing preserved; keyed on the full run so the clip's OTHER "I knew"
    # ("i knew it was going to come back", 14.60 s) can never match.
    (("i", "knew", "all", "time", "high"), ["a", "new", "all", "time", "high."]),
    # "again, it's 2026, not in here" - Whisper splits the year into "20," + "26" on both passes
    # (the clip's own pass and medium.en on an isolated 100.60-103.40 s, which returns "Again, it's
    # 2026 not in here"). Same class as ("62","k") -> "62k": a year must land as ONE token or the
    # caption reads "it's 20, 26". 3 tokens -> 2 words (the third timing is dropped, supported).
    (("its", "20", "26"), ["it's", "2026"]),
    # Three READABILITY fixes on this clip's own stumbles. No word is invented in any of them: each
    # either drops a stray comma the collapse left behind, or drops a false start (the same class as
    # ("maybe","the","your","winner") and ("before","in","the","in","the","entirety") above).
    # "we did a 94X in a, in September" - the restart leaves a dangling caption reading "a, in
    # september". 4 tokens -> 2 words (the last two timings are dropped, which is supported).
    (("in", "a", "in", "september"), ["in", "september."]),
    # "I, I sold at this top" - cleanup()'s collapse eats the second "I" and keeps the FIRST token,
    # whose trailing comma then renders as "i, sold at this top". Same words, comma dropped.
    (("i", "sold", "at", "this", "top"), ["i", "sold", "at", "this", "top"]),
    # "fighting on memes from, from like last year" - same shape: the collapse keeps the comma'd
    # "from," and drops the clean repeat, leaving "memes from, like".
    (("memes", "from", "like"), ["memes", "from", "like"]),
    # THE ANAPHORA'S FALSE START. He stumbles into his own four-part anaphora: "...say that people
    # are fighting on THAT people are fighting on Pengu." The clip's tighten plan protects the
    # anaphora itself ("stays four units + closer") and already cut a different aborted "Pengu" from
    # the audio; this leftover half-unit renders as a caption reading "on that people", which looks
    # like a duplicated caption rather than a stumble. 7 tokens -> 2 words (the rest of the timings
    # are dropped, which is supported), so the four units land clean: Pengu / turbo / Toshi / all
    # these memes. Keyed on the full run so nothing else can match.
    (("say", "that", "people", "are", "fighting", "on", "that"), ["say", "that"]),
    # NOT corrected, deliberately (cooper-50x/tut-rug-to-ath), three calls tested against the audio:
    #  - "holy crap, THIS IS A RUN and you never expect something like this to happen" (57.60 s). The
    #    rug theme makes "this is a rug" tempting, and it was checked for exactly that reason. TWO 1x
    #    passes on this clip's own audio return "run": the shipped word pass (p 0.55) and medium.en on
    #    an isolated 54.40-60.20 s, which returns the whole sentence with "this is a run". Never ship
    #    a word no 1x pass produced.
    #  - "bmb -> BNB" and "Pina/pingu -> Pengu" from the batch caption-corrections file are BOTH
    #    NO-OPS against this clip's own whisper-words.json, which already reads " BNB." (22.16 s) and
    #    " Pengu." (76.10 s). Do not add rules for them.
    #  - "'I did 130x' (master 1930.1) is most likely 'it did 130x'" from the batch file is also a
    #    NO-OP here: this clip's pass reads "it started running again AND DID 130X" (33.94-35.56 s),
    #    with no pronoun to fix, and medium.en agrees. The clip's "velvet -> Velvet" and
    #    "tutorial -> TUT" casing fixes are invisible under the preset's CSS lowercase; only the
    #    TUT token merge above changes anything on screen.
    # --- btc-next-week batch, 2026-08-17 (dog-on-robinhood-impact clip 4) ---
    # "one of those HANDFUL OF memes are going to be listed on the Robinhood app". The clip's own
    # medium pass mis-SPLITS "handful" into two tokens and hears them as "hand" + "from"
    # (p 0.68 / 0.29, i.e. the model has nothing), rendering "one of those hand from of memes",
    # which is not English. Two independent 1x sources fix it: the MASTER pass on the uncut
    # livestream reads "one of those handful of of memes" at 240.48 s (the doubled "of" is the
    # stutter this clip's tighten removes at 241.10-241.58), and medium.en on an isolated
    # 10.00-13.20 s of this clip's own spine returns "One of those handfuls of memes". 3 tokens ->
    # 2 words (the third timing is dropped, which is supported), so "memes" keeps its own timing
    # and no fake gap is created. Keyed on the full three-token run: "hand from of" cannot occur
    # in English, so no future clip can match it.
    (("hand", "from", "of"), ["handful", "of"]),
    # "...on the Robinhood app WITH KITSU AS a thousand X or more". KITSU is the token this clip is
    # about (Vlad Tenev's Shiba Inu; the base screen-share is literally its DexScreener page, header
    # "KITSU / WETH ... Robinhood > Uniswap v3"). The clip's own pass hears the name as two words,
    # "kids who", and the following "as" as "asked". Verified against the MASTER pass on the uncut
    # audio ("but with Kitsu as a thousand X or more", 252.98 s) and medium.en on an isolated
    # 13.80-17.00 s of this spine, which returns "out with kitsu s1000x or more". The clip's own
    # tighten plan records the same line. 4 tokens -> 3 words (the fourth timing is dropped);
    # keyed on the leading "with" so a genuine "kids who asked" elsewhere can never match.
    (("with", "kids", "who", "asked"), ["with", "kitsu", "as"]),
    # The two spoken multiples of this clip, both garbled by the clip's own pass: "a thousand X"
    # comes back as "a thousand acts" (15.66 s, p 0.75) and "a thousand X" as "a thousand extra"
    # (19.40 s, p 0.25 - the model telling you it has nothing). medium.en on isolated windows
    # returns "s1000x or more" (13.80-17.00 s) and "way more than 1000x" (16.40-19.53 s), and the
    # MASTER reads " X" at 254.16 and 257.98 s. CASCADING: each emitted "thousand x" is re-matched
    # on the next fixpoint pass by ("a","thousand","x") -> ["1000x"] above, so both land on the
    # house digit form. Keyed on the preceding "thousand" so no bare "acts"/"extra" is touched.
    (("thousand", "acts"), ["thousand", "x"]),
    (("thousand", "extra"), ["thousand", "x"]),
    # NOT corrected, deliberately (btc-next-week/dog-on-robinhood-impact):
    #  - "then we, YOU KNOW, it's probably going to be like a billion market cap" (7.90 s). The
    #    MASTER pass reads "then we know it's", i.e. it merges the tic into a verb. This clip's own
    #    pass hears the filler ("we, you know, it's") and that is the pass the final render is
    #    whisper-verified against; "you know" is also one of Mike's standard tics. Left as built.
    #  - "are GOING TO be listed" (12.54 s). The MASTER reads "gonna"; the clip's own pass reads
    #    "going to". Same words, different rendering of the same audio - not a mishear, so no rule.
    #  - the "a dog on robinhood. a dog on robinhood." doubling (0.86-2.82 s) is his own emphasis
    #    repeat and needs NO PROTECTED_DOUBLES entry: cleanup() only collapses ADJACENT duplicate
    #    tokens and this repeat is separated by "a dog on", so it survives verbatim (confirmed on
    #    the built array).
    # --- btc-next-week batch, 2026-08-17 (what-if-greatest-meme clips 1 + 2) ---
    # THE TICKER IS $IF, NEVER $WHATIF (both clips' tighten plans carry this as a mandated
    # caption-time fix, and it is the house spelling every earlier What If short uses - see the
    # early-crash ("cash","gap","and","what","if") -> [... "$if"] entry above). The hook is the chat
    # question Mike reads off his own screen-share, whose overlay literally reads "what do you think
    # abt what $if", so the two BARE "if" tokens are the token, not the conjunction: "what do you
    # think about $IF? I think $IF is one of the greatest memes ever to exist." Keyed on the whole
    # six-token run (a bare ("if") rule would rewrite every English "if" in the catalogue), which
    # occurs in this exact form in both clips' own passes and in the MASTER at 2206.28-2207.40 s.
    # Idempotent: core("$if") == "if", so the fixpoint pass re-matches, re-emits the identical
    # tokens and converges. Deliberately NOT applied to "what if, what if it's just so epic" or to
    # the closing "what if I hold my Bitcoin until 2026" - the whole joke of this clip is that the
    # token IS the everyday phrase ("we're just like an iconic phrase... something that's always
    # existed"), so those stay plain words on screen, exactly as the shipped whatif-next-dogecoin
    # captions render them.
    (("about", "if", "i", "think", "if", "is"),
     ["about", "$if", "i", "think", "$if", "is"]),
    # "...it's just so epic? WE'RE just like an iconic phrase, man." Both clips cut the tic that
    # precedes it ("You know, it's," at master 2220.70-2222.02), so the spine opens this clause on
    # the "we're" onset and the clip's own medium pass splits that one 0.38 s word into two tokens,
    # " You" + " were" (p 0.07 / 0.59 - the 0.07 is the model telling you it has nothing).
    # medium.en garbles the same span a THIRD way on an isolated 11.30-14.40 s window ("you know,
    # where's that iconic phrase"), i.e. it is noise. The MASTER pass on the uncut audio, with the
    # full run-up still present, reads " we're" as ONE token at 2222.02-2222.40 s (p 0.87), and both
    # clips' tighten plans quote the line as "we're just like an iconic phrase". 5 tokens -> 4 words
    # (the fifth timing is dropped, which is supported), so "iconic" keeps its own timing. Keyed on
    # the full five-token run through "an" so a genuine "you were just like a..." cannot match.
    (("you", "were", "just", "like", "an"), ["we're", "just", "like", "an"]),
    # NOT corrected, deliberately (btc-next-week/what-if-greatest-meme-impact):
    #  - the 6.66-7.28 s vocalisation. The clip's word stream jumps 6.32 -> 7.46 s, and a 20 ms RMS
    #    scan shows REAL energy in the gap (two ~0.25 s humps peaking at -20 dB), which is exactly
    #    the shape of the 2026-08-07 "i was hacked, man." omission. It is NOT speech: three
    #    independent 1x passes produce no words there - this clip's own medium pass, the MASTER
    #    medium pass on the uncut livestream (a 1.64 s wordless gap between "man?" 2212.30 and "No"
    #    2213.94) and small.en on isolated 6.20-8.80 / 5.60-9.20 s windows, both of which return
    #    only "No joke, man." It is his laugh/scoff after the declaration, and the house rule is to
    #    never put words on screen that no 1x pass produced.
    #  - "what if, what if it's just so epic?" (9.00-9.82 s) is NOT a stutter to collapse and needs
    #    no PROTECTED_DOUBLES entry: the repeat is his awe-doubling (the clip's tighten plan protects
    #    it by name) and cleanup() only collapses ADJACENT duplicate tokens, which "what if what if"
    #    never contains. Confirmed on the built array.
    # --- btc-next-week batch, 2026-08-17 (what-if-greatest-meme-FULL clip 1 only) ---
    # "somebody create a token called what if, WHICH IS absolutely insane." The clip's own medium
    # pass renders the relative pronoun as two junk tokens, " would" + " say" (p 0.28 / 0.79 after a
    # p 0.29 "what" and a p 0.56 "if"), giving "called what if would say is absolutely insane",
    # which is not English. Two independent 1x sources agree on "which is": the MASTER pass on the
    # uncut livestream reads "somebody creates a coin, a token called what if, which is absolutely
    # insane." at 2244.08-2252.92 s, and medium.en / small.en / large-v3 on isolated 24.6-28.4 and
    # 25.2-28.4 s windows of THIS spine all return "called what if, which is absolutely insane".
    # 6 tokens -> 5 words (the sixth timing is dropped, which is supported), so "absolutely" keeps
    # its own timing. Keyed through the leading "called" so no genuine "if would say is" can match.
    (("called", "what", "if", "would", "say", "is"),
     ["called", "what", "if", "which", "is"]),
    # The clip's segment-2 splice: "...went into a CTO. [cut] What If is absolutely amazing." The
    # cut lands inside master 2396.08-2396.36 s (the pause after "But yeah,"), and this clip's own
    # pass turns the 0.48 s of splice residue into a phantom " I" (p 0.48) - so the array reads
    # "i what if is absolutely amazing". No 1x pass hears an "I" there: the MASTER reads "But yeah,
    # what if it's absolutely amazing." at 2394.96-2398.30 s (the "But yeah," is BEFORE the cut
    # point and is not in the clip), and medium.en / small.en on isolated 36.50-39.60 and
    # 36.90-40.20 s windows both return "...went into a CTO. What if is absolutely amazing" with no
    # leading pronoun. 4 tokens -> 3 words drops the phantom's timing and slides the real words onto
    # the earlier onsets. Keyed on the full run: "i what if is" cannot occur in English.
    (("i", "what", "if", "is"), ["what", "if", "is"]),
    # "because then he JEETED OUT and sold everything." The clip's own pass emits a 0.22 s ghost
    # token " gd" (p 0.11 - the model telling you it has nothing) where the verb is.
    # ⚠ MIKE RULED 2026-08-17, AFTER the clip had shipped a render reading "cheated out": it is
    # "JEETED out" (crypto slang, to jeet = to panic-dump). THE SPEAKER'S EAR OUTRANKS THE PASS
    # COUNT - do not "restore" this to cheated on the strength of the vote below.
    # What the passes said, kept as the record of why the first build got it wrong: the MASTER pass
    # on the uncut livestream read "because then he cheated out and sold everything." at
    # 2257.76-2268.64 s, and large-v3 on three isolated windows of this spine (32.80-36.60 /
    # 33.40-35.90 / 34.00-35.60 s) returned "cheated out" every time, as did medium.en and small.en
    # on 33.60-36.20 s - 7 of 8 passes. small.en on ONE wide window was the lone pass that offered
    # "jeeted out", and it was the one that was right. (The clip's tighten plan had flagged it as
    # possibly "cashed out"; that is wrong too - no pass at any size hears a "cashed".)
    # CORROBORATION found while re-rendering (small.en on the FINAL MIX, two wide windows):
    # "he G'D IT out" (30.5-38.5 s) and "he JEANED IT out" (28.5-38.5 s). Together with the raw
    # pass's " gd" ghost that is THREE independent J/G-initial readings of the verb - the onset is
    # /dʒ/, not the /tʃ/ of "cheated". The consonant evidence backs Mike, and the "cheated" majority
    # is medium.en/large-v3's LM snapping to the nearest common English verb.
    # THE LESSON: Whisper's LM is trained on ordinary English and reliably launders crypto slang
    # into the nearest everyday word (this same clip already needed large-v3 to break "moaning"/
    # "morning" -> MOONING, three lines below). A majority vote across passes is therefore NOT
    # evidence on a slang verb - it measures how common the word is in the LM, not what was said.
    # When one pass emits the slang and the rest emit a plausible everyday near-homophone, that is
    # the signature of this failure, and it goes to Mike's ear rather than to the vote. The tell to
    # look for is a GHOST/NON-WORD token (p < 0.2) at the verb: that is the acoustic model refusing
    # the LM's suggestion, and its CONSONANT ONSET is usable evidence even when its spelling is junk.
    # Keyed on the three-token run: "he gd out" cannot occur in English.
    (("he", "gd", "out"), ["he", "jeeted", "out"]),
    # "I would hope that it does indeed flip CASH CAT." The clip's own pass hears the second half of
    # the token's name as a repeat of the first (" cash" + " cash." at 42.80 s, p 0.27). The rival
    # meme is Cash Cat and the clip names it correctly three more times (65.14 / 68.92 / 82.92 s,
    # p 0.35-0.71), the MASTER reads "cash cat" (2403.28-2404.00 s), and small.en on an isolated
    # 41.40-44.00 s window returns "Flip Cash Cat".
    # ⚠ Keyed on "indeed flip cash", NOT on the raw ("flip","cash","cash"): cleanup()'s stutter
    # collapse runs BEFORE apply_phrases and eats the second "cash" as an adjacent duplicate, so by
    # the time phrases run there is only ONE "cash" token left and a ("flip","cash","cash") rule
    # silently no-ops (verified on the built array - it shipped "indeed flip cash", with the token's
    # name simply missing). The replacement is the house one-token spelling "cashcat" that the
    # ("cash","cat") -> ["cashcat"] rule above produces for this clip's four other mentions.
    (("indeed", "flip", "cash"), ["indeed", "flip", "cashcat"]),
    # "...listed on the Robinhood app AND IT'S MOONING." Every pass renders the last word as the
    # everyday word it sounds nearest to - " moaning" in this clip's own pass (p 0.50), "morning" in
    # the MASTER (2449.72-2454.68 s) and in medium.en / small.en - because "mooning" is not in their
    # LM's habitual vocabulary. large-v3 breaks the tie and returns "and it's MOONING" on two
    # independent windows (68.40-72.40 / 69.60-72.00 s), and it is the only reading the sentence
    # supports: the whole beat is that Cash Cat got the Robinhood listing and its price took off,
    # which is what makes his next line ("how does timing work out like that?") land. The clip's
    # tighten plan mandates the fix by name. Keyed on the three-token run so nothing else can match.
    (("and", "its", "moaning"), ["and", "it's", "mooning"]),
    # NOT corrected, deliberately (btc-next-week/what-if-greatest-meme-full):
    #  - the 6.41-7.52 s vocalisation (same laugh as clip 2, whose block above documents it). This
    #    clip's word stream jumps 6.38 -> 7.52 s and a 20 ms RMS scan finds real energy at -20 dB in
    #    the gap, but no 1x pass produces words there: this clip's own medium pass, the MASTER, and
    #    medium.en / small.en on isolated 6.20-7.80 and 5.50-8.20 s windows return only "uh"/"Haha".
    #    It is his laugh after the declaration; FILLER drops it and the captions stay silent.
    #  - "so prematurely, cash cat was listed" (50.50 s). medium.en, small.en and the MASTER all read
    #    "so prematurely"; it is his phrasing, not a mishear.
    #  - "It could get every exchange imaginable" twice (75.84 / 79.32 s) is the DELIBERATE emphasis
    #    doubling his tighten plan protects by name, and needs no PROTECTED_DOUBLES entry: the limbs
    #    are separated by "except robinhood and still flip cash cat", so cleanup()'s ADJACENT-only
    #    collapse never sees it. Same for "I don't know. I don't know." at 74.14-75.46 s.
    # --- cooper-cheerleaders batch, 2026-08-18 (dog-on-robinhood-full clip 1) ---
    # "we woke up this morning to see this nice PUMP" — the clip's own word pass renders the word as
    # "pompous." (ONE token, 23.38-23.76 s, p 0.75), which is not a word anyone says about a chart.
    # VERIFIED by re-transcribing 21.4-24.6 s in isolation with medium.en, which returns verbatim
    # "Like, we woke up this morning to see this nice pump, it's, we almost had a new." The beat is
    # the morning Cooper pump he cuts to on screen (the base screen-share is the DexScreener
    # COOPER/WETH chart), so the reading is confirmed by the picture as well as the audio. Keyed on
    # the preceding "nice" so a real "pompous" elsewhere could never be rewritten by a bare token
    # rule; 2 tokens -> 2 words, so the timings are untouched.
    (("nice", "pompous"), ["nice", "pump"]),
    # --- cooper-cheerleaders batch, 2026-08-18 (kaspa-more-than-5x-impact clip 6) ---
    # THE PAYOFF MULTIPLE. "...gonna do a hell of a lot more than 5X." This clip's own medium pass
    # renders the multiple as TWO junk tokens, " fire" + " eggs" (20.60-20.98 s, p 0.35 / 0.44 - the
    # model telling you it has nothing), so the hard-out of the whole short would ship as "more than
    # fire eggs". Four independent readings all return the same /f-ai/ + /-ks/ shape and never a real
    # word: this clip's own pass ("fire eggs"), small.en on an isolated 17.4-21.0 s window ("a hell of
    # a lot more than fire") and on 18.4-21.0 s ("more than fire axe."). The picture confirms the
    # number: the base screen-share carries the viewer chat line this clip is answering, parked at
    # y 730-790 for all 21 s - "realistically if Kaspa is at 800 million how many X potential is there
    # left 3 maybe 5 ?" - and the batch tighten log records this exact out-point as "hard-out on '5x'"
    # for the sibling FULL cut (clip 2), whose Mike-set title is "Kaspa Is Going To Do A Hell Of A Lot
    # More Than 5x". 4 tokens -> 3 words (the 4th timing is dropped, which is supported). Keyed on the
    # full four-token run, which cannot occur in English.
    (("more", "than", "fire", "eggs"), ["more", "than", "5x"]),
    # Same payoff line, the SUBJECT. The pass hears "HE's gonna do a hell of a lot more than 5x"
    # (p 0.74 on a he's/it's reduction), but there is no person anywhere in this clip: all 86 words
    # are about the tech ("the tech, it's like you can't, it can't be beaten. there's nothing better
    # than it. it's like light years ahead of everything else"), and the referent of the payoff is
    # KASPA. Captioning "he's" invents a human subject for the clip's title line. Keyed on the
    # FIVE-token run rather than the tempting ("think","hes","gonna") - "I think he's gonna" is
    # ordinary English and a rule that short would silently rewrite a real person in some future
    # batch, whereas "gonna do a hell of a lot more than 5x" is only ever said about an asset.
    # 5 tokens -> 5 words, so every timing is untouched.
    (("hes", "gonna", "do", "a", "hell"), ["it's", "gonna", "do", "a", "hell"]),
    # --- cooper-cheerleaders batch, 2026-08-18 (kaspa-more-than-5x-full clip 2) ---
    # The FULL cut of the same topic as clip 6 above, so both rules above also fire on its hard-out
    # ("more than fire eggs" -> "more than 5x", "he's gonna do a hell" -> "it's gonna do a hell").
    # Everything below is in the clip's FIRST segment (0-54 s), which clip 6 does not contain.
    #
    # "and $LAB WENT parabolic and did a 350x" - this clip's own pass drops the verb entirely and
    # renders the run as two tokens, " lab" + " Parabolic" (25.40-26.46 s), which is not a sentence.
    # VERIFIED by two independent isolated decodes of this spine: medium.en on 24.0-28.5 s returns
    # "called it back in October. And lab went parabolic and did a 350X." and small.en on a
    # differently-offset 24.8-27.5 s returns "over and lab went parabolic and did a 350". A
    # replacement may never be LONGER than the match, so the verb rides on the token it belongs to
    # ("went parabolic" is ONE token, two rendered words) - the same shape as the ("good","for","meme")
    # -> ["good","for a","meme"] entry above. The cashtag is the house spelling for this project
    # (see the ("lab","token") rule, which fires on this clip's earlier "20x on the $LAB token"):
    # the montserrat preset lowercases everything via CSS, so only the cashtag separates the token
    # from the English word "lab". Keyed on the leading "and" so nothing else can match.
    (("and", "lab", "parabolic"), ["and", "$lab", "went parabolic"]),
    # "...the 94x on $TUT on BNB. TUT, T-U-T. back in September" - he says the ticker, then SPELLS it.
    # This clip's own pass renders the spelling as " tut" + " to" + " UT" (38.84-39.90 s), which puts
    # the nonsense "tut to ut" on screen. Two independent isolated decodes of this spine agree on
    # what he is doing: medium.en on 37.0-41.5 s returns "on Tutorial on BNB, tut, T-U-T, back in
    # September" and small.en on 38.0-40.5 s returns "tutorial on BnB. Tutt, T-U-T.". Spelled-out
    # letters are never captioned letter by letter, so the whole 3-token run merges to the ticker
    # (1-word replacement keeps the entire 38.84-39.90 s span). "$tut" is the same house spelling the
    # ("on","tutorial","on") rule above produces for this clip's first mention two seconds earlier.
    # "tut to ut" cannot occur in English, so the key can never match anything legitimate.
    (("tut", "to", "ut"), ["$tut"]),
    # "and it looked like it was INSANE. IT looked like a total rug, right?" - this clip's own pass
    # welds the two sentences with a hallucinated verb, " amazing" + " saying" (42.66-43.38 s).
    # VERIFIED by two independent isolated decodes: medium.en on 41.5-45.5 s returns "And it looked
    # like it was insane. It looked like a total rug, right?" and small.en on a differently-offset
    # 42.0-45.0 s returns "It looked like it was insane, it looked like a total rug, right?".
    # 3 tokens -> 2 words (the third timing is dropped, which is supported), and the added period
    # breaks the caption group on the real sentence end instead of running the two limbs together.
    (("was", "amazing", "saying"), ["was", "insane."]),
    # "it can't be BEATEN. THERE'S nothing better than it" - this clip's own pass hears the verb as
    # " does" (60.70-60.88 s), so the line reads "can't be beaten does nothing better than it", which
    # inverts the claim (it says the tech does nothing). VERIFIED by two independent isolated decodes:
    # medium.en on 59.5-63.5 s returns "It can't be beaten, there's nothing better than it." and
    # small.en on 60.0-62.5 s returns "...and there's nothing better than it". The sibling clip 6,
    # which is cut from this same master audio, transcribed the line correctly on its own pass
    # ("it can't be beaten. there's nothing better than it"), so its captions cannot be affected by
    # this key. 3 -> 3 words, every timing preserved; the period breaks the caption on the sentence.
    (("beaten", "does", "nothing"), ["beaten.", "there's", "nothing"]),
    # THE $TUT RECEIPT. "and now I'm up ... 130x." He starts the figure as words and lands on it as a
    # number, and the four decodes split on the false start: this clip's own pass hears " a hundred"
    # + " 130" (48.30-49.26 s), small.en on 47.0-50.5 s hears "up a hundred hundred thirty",
    # large-v3 on 46.5-51.5 s hears "up 100 130" and medium.en on 47.6-49.8 / 47.9-51.6 s hears just
    # "up 130". Captioning the false start ("up a hundred 130") is unreadable, and a bare "130" reads
    # as dollars or a percentage next to the "94x" he says 12 s earlier. The MULTIPLE is what he
    # means and what the repo's own artifacts record: this batch's clip-plan hook summary for the
    # topic reads "the LAB 353x and TUT 94x-to-130x receipts". Multiples are ALWAYS captioned as
    # digits (the ("a","thousand","x") rule above). 4 tokens -> 2 words (the last two timings are
    # dropped, which is supported), and the period lands the caption break on the MEASURED tighten
    # splice at 49.457-49.480 s (a 23 ms digital-silence join in this spine).
    (("up", "a", "hundred", "130"), ["up", "130x."]),
    # The clause AFTER that splice. Because the join sits mid-breath, this clip's own pass bleeds the
    # pre-splice tense across it and renders " I'm gonna come back made a new all-time high", which
    # is not English (a future tense welded onto a past-tense clause). RE-MEASURED 2026-08-18 on six
    # independent decodes of this spine, because an earlier version of this entry cited a large-v3
    # reading ("i made a comeback made a new all-time high") that could NOT be reproduced: medium on
    # 47.5-51.5 s returns "I'm gonna come back, made a new all-time high", medium on 49.0-51.0 s
    # "I'm gonna come back with a new all-time high", medium on 48.6-50.8 s "I might have come back
    # might have knew all time", small.en on 49.2-51.4 s "I'm gonna come back, make a new all-time
    # high", small.en on 48.9-51.6 s "I'm gonna come back when a new all-time high", and the MASTER
    # livestream pass (untightened audio, 3200.74 s) "now I'm up 100 130x ready to come back made a
    # new all-time high". Every reading carries COME BACK + MADE/MAKE A NEW ALL-TIME HIGH and none is
    # grammatical as welded, so the fix keeps the audible verb and only repairs the tense + subject:
    # the thing that came back is the TOKEN's chart, not Mike (same call as the existing
    # ("i","was","just","nuts") -> ["it","was","just","nuts"] rule). 5 -> 5 words, every timing
    # preserved. Keyed on the trailing "made" so the ordinary English sentence "I'm gonna come back"
    # can never match on its own in a future clip.
    (("im", "gonna", "come", "back", "made"), ["it", "came", "back", "and", "made"]),
    # "i get scared sometimes TO GIVE moon-boyish price predictions" - the fear of sounding like a
    # moon boy, which is one of the three reasons this clip gives for why holders lowball. This
    # clip's own pass renders the preposition as " they" + " didn't" (17.08-17.68 s, p 0.61 / 0.84),
    # which INVERTS the line into a claim about other people not giving predictions. Two independent
    # sources return the preposition: the MASTER livestream pass (untightened, 3148.82 s) reads "so
    # you know like I get scared sometimes to give moon boyish price predictions", and medium on an
    # isolated 15.6-19.2 s window of this spine returns "I get scared sometimes to give moon boyish
    # price predictions." (small.en hears "they can give" on the same window, i.e. no decode supports
    # the negation this clip's pass invented). 5 tokens -> 4 words (the 5th timing is dropped, which
    # is supported). Keyed with "scared sometimes" in front so an ordinary "they didn't give" is
    # never rewritten.
    (("scared", "sometimes", "they", "didnt", "give"), ["scared", "sometimes", "to", "give"]),
    # "so YOU KNOW people get kind of scared to be like a moon boy" - the discourse marker, not an
    # address to the audience. This clip's own pass drops the "know" (51.30-52.58 s), so the caption
    # would read "so you people get kind of scared", which points the sentence AT the viewer. Three
    # independent readings restore it: the MASTER pass (3200.74 s) "so you know people get kind of
    # scared", medium on an isolated 51.1-55.0 s window "So you know people get kind of scared scared
    # to be like a moon boy", and small.en on the same window "So you know people get kind of scared
    # care to be like a moon boy". The missing word rides on the token it belongs to ("you know" is
    # ONE token, two rendered words), the same shape as the ("and","lab","parabolic") entry above.
    # 5 -> 5 words, every timing preserved; keyed through "get kind" so a real "so you people" is safe.
    (("so", "you", "people", "get", "kind"), ["so", "you know", "people", "get", "kind"]),
    # THE HOOK ANSWER. "i think in the long run IT'S gonna be a much much higher" - his rejection of
    # the chat's 5x lowball, and the line the whole short is built on. This clip's own pass hears the
    # contraction as a bare " is" (6.24-6.42 s, p 0.33 - the model's own weakest guess in the
    # sentence), which is not English after "in the long run". Three independent readings carry the
    # contraction: the MASTER pass (3130.48 s) "I think in the long run it's going to be a much much
    # higher", medium on an isolated 5.2-8.1 s window "I think in the long run it's going to be much
    # much higher", and small.en on 5.6-7.9 s "the long run is going to be much much higher" (the
    # same reduction, which is why the key is needed). 4 -> 4 words, every timing preserved.
    (("long", "run", "is", "gonna"), ["long", "run", "it's", "gonna"]),
    # --- cooper-cheerleaders batch, 2026-08-18 (thirty-dollar-wallet-full clip 5) ---
    # THE HOOK MULTIPLE. "oh, we did a 353X on $LAB just like three months ago." This clip's own word
    # pass shatters the figure into three tokens, " 300" + " to" + " 53" + " X" (0.66-1.86 s, p 0.47 /
    # 0.38 / 0.81), so the first caption of the whole short would read "a 300 to 53x" - a range that
    # he never says and that contradicts the clip's own title. Two independent decodes return the
    # single figure: the MASTER pass on the uncut livestream reads " 353x" as ONE token at 948.84 s
    # (p 0.84) followed by "on" (0.98) "lab" (0.93), and medium.en on an isolated 0.0-3.2 s window of
    # this spine returns verbatim "Oh, we did a 353x on lab, just...". The batch tighten log records
    # the same relock reason for this clip ("relock opens dead on the hook 'we did a 353x on LAB'").
    # cleanup() merges the trailing " X" into "53x" before phrases run, so the key is the 3-token
    # run; 3 tokens -> 1 merged word keeps the whole 0.66-1.86 s span. CASCADING: the emitted "353x"
    # feeds the existing ("353x","on","lab") -> [..., "$lab"] rule above on the next fixpoint pass,
    # which is where the cashtag comes from.
    (("300", "to", "53x"), ["353x"]),
    # "$LAB", the named project of this clip, styled as the house cashtag on its other two mentions
    # ("I bought $50 WORTH OF LAB and the other one I bought $30 WORTH OF LAB."). Same rule class as
    # the ("lab","token") and ("353x","on","lab") entries above: the montserrat preset lowercases
    # everything via CSS, so the cashtag is the ONLY thing that separates the token from the English
    # word "lab" on screen. Keyed on "worth of" so a laboratory can never be rewritten by a bare
    # token rule; fires on both occurrences (9.90 and 12.18 s) and the trailing period of the second
    # rides along automatically. Idempotent: core("$lab") == "lab", so the fixpoint pass is a no-op.
    (("worth", "of", "lab"), ["worth", "of", "$lab"]),
    # THE ROTATION LINE, two fixes in one key: "...I just rotate my dry powder that I collected from
    # $LAB INTO like all these other ones that I have."
    #  - the cashtag, as above.
    #  - "until" -> "into". EVERY Whisper pass renders the preposition "until" (this clip's own pass
    #    at 53.98 s, the MASTER at 1033.04 s p 0.75, small.en on isolated 52.2-56.6 s and on a tighter
    #    52.8-56.2 s window), and every one of them is unparseable English: "rotate my dry powder that
    #    I collected from LAB UNTIL like all these other ones that I have" has no reading. The
    #    sentence he is speaking is the rotation he then itemises in the next breath ("200 here, 100
    #    here, 300 there"), and the MASTER's own continuation two lines later is "things like that,
    #    just rotating them out" - i.e. dry powder moving FROM the winner INTO the other bags. The run
    #    contract for this build states the word is "into". This is the documented failure mode where
    #    a pass vote is not evidence (a function word laundered into a near-homophone), so the fix is
    #    keyed on the full four-token run and can never match anything else. 4 tokens -> 4 words, so
    #    every timing is untouched. Not idempotent-looping: the emitted run ends in "into", never
    #    "until", so the fixpoint pass cannot re-fire.
    (("collected", "from", "lab", "until"), ["collected", "from", "$lab", "into"]),
    # Multiples are ALWAYS captioned as digits (the ("a","thousand","x") rule above). "so my next
    # HUNDRED X or 350x" - cleanup()'s digit merge only fires on a literal digit token, so the
    # spelled-out form needs a phrase rule. Both other decodes render it as the figure: the MASTER
    # reads "so my next 100x or 350x" and small.en on an isolated 58.4-64.6 s window returns "So my
    # next 100x or 350x, instead of 350xing $80". 3 tokens -> 2 words (the 3rd timing is dropped,
    # which is supported).
    (("next", "hundred", "x"), ["next", "100x"]),
    # The compounding itemisation, "200 here, A HUNDRED here, 300 there." Whisper spells only the
    # middle figure out, so the trio renders on screen as "200 here, a hundred here, 300 there" -
    # mixed words and digits inside one breath, in a clip whose whole payload is numbers. Both other
    # decodes render it as a figure (the MASTER reads "200 here 100 here 300 there"; small.en on an
    # isolated 55.8-59.2 s window returns "you know, 200 here, 100 here, 300 there"). 3 tokens -> 2
    # words (the 3rd timing is dropped, which is supported). Keyed on the trailing "here" so an
    # ordinary "a hundred" elsewhere is never touched.
    (("a", "hundred", "here"), ["100", "here"]),
    # THE PAYOFF LINE, both halves: "instead of 350XING $80, I'm going to be 350XING, you know, like
    # a $300 or $500." This clip's own pass hears the "-ing" of both gerunds as the word "and"
    # (62.88 and 65.60 s), which turns each one into a LIST of two things ("350x AND $80") and
    # inverts the sentence: he is contrasting the multiple applied to a small position with the same
    # multiple applied to a big one, not adding a dollar figure to a multiple. Three independent
    # decodes carry the gerund: the MASTER reads "instead of 350xing $80 I'm gonna be 350xing you
    # know like $300 or $500", small.en on an isolated 58.4-64.6 s window returns "instead of 350xing
    # $80" and small.en on a differently-offset 63.6-68.2 s window returns "I'm gonna be 350 axing,
    # you know, like $300 or $500". cleanup() merges each "350" + " X" into "350x" before phrases
    # run, so both keys start from that token; the trailing comma of the matched run rides along.
    (("350x", "and", "80"), ["350xing", "$80"]),
    (("350x", "and", "you", "know"), ["350xing", "you", "know"]),
    # NOT corrected, deliberately (cooper-cheerleaders/thirty-dollar-wallet-full):
    #  - "and it's driving you nuts, YOU'RE NOT swing trading" (30.10 s). The MASTER pass reads "you
    #    DO not swing trading" and the run contract flags that odd phrasing as verbatim, but the
    #    MASTER is the ONLY one of four decodes that produces it and it is the model's own weakest
    #    guess there (" do" p 0.39, " trading" p 0.09). The other three all hear the contraction:
    #    this clip's own pass ("you're not swing trading"), medium.en on an isolated 29.0-31.4 s
    #    window ("you're not swing trading, you're just") and small.en on the same window ("you're
    #    not a swing trader, you're just"). The captions therefore ship the clip's own reading
    #    unchanged - which is also what "caption it as spoken" requires: no correction is applied
    #    here in EITHER direction, and no audio is cut.
    #  - "you know" x3, "just because", "or whatever it is" - his own connectives, left verbatim.
    # --- cooper-cheerleaders batch, 2026-08-18 (kaspa-steak-dca-full clip 4) ---
    # "there might be SOME PEOPLE HERE AND THERE like, uh, man, Kaspa sucks" - the people he expects
    # to capitulate. This clip's own pass renders the location as " in" + " the" + " air"
    # (42.76-43.12 s, p 0.94 / 0.92 / 0.53), so the caption reads "some people here IN THE AIR",
    # which is not a thing anyone says. TWO independent isolated medium.en decodes of this spine
    # return the idiom: 41.8+4.0 s gives "some people here and there like," (' and' 42.60-42.72,
    # ' there' 42.72-42.96) and a differently-offset 40.6+5.2 s gives "there's still some might be
    # some people here and there like" (' and' 42.60-42.76, ' there' 42.76-42.96); small.en on
    # 42.2+2.6 s hears the same two syllables as "and they're". No decode supports "the air".
    # 5 tokens -> 4 words (the 5th timing is dropped, which is supported). Keyed through the
    # preceding "people" so a genuine "up here in the air" can never be rewritten.
    (("people", "here", "in", "the", "air"), ["people", "here", "and", "there"]),
    # THE 2022 RECEIPT. "everybody's just like, yeah, I'm gonna BUY BACK IN AT 10" - the influencer
    # promise he is about to say never happened. This clip's own pass hears the preposition as the
    # article " a" (62.22-62.38 s, p 0.67), so the caption reads "buy back in A 10", which is not
    # English for a price. medium.en on an isolated 60.2+3.6 s window returns " at" (p 0.87) inside
    # "I'm going to buy back in at 10."; the same construction is spoken UNCORRECTED five seconds
    # later in this very clip ("you're gonna get back in AT 8k", 68.08-68.62 s, p 0.85), which is
    # the decisive corroboration. 5 tokens -> 5 words, so every timing is untouched. Keyed on the
    # full "buy back in a 10" run, which cannot occur in English.
    (("buy", "back", "in", "a", "10"), ["buy", "back", "in", "at", "10"]),
    # THE BITCOIN LOW. "they couldn't get back in. 15 was, 15 was THE LOW." This clip's own pass
    # hears the last word as " alone" (76.44-76.64 s, p 0.31 - the model's own weakest guess in the
    # sentence), so the caption reads "15 was alone", which has no meaning. THREE independent
    # isolated decodes return a low: medium.en on 74.6+3.2 s and on 75.0+2.4 s both read "15 was, I
    # thought 15 was a low." and medium (multilingual) on 73.6+4.2 s reads "15 was, I thought 15 was
    # the low." The figure is his own two sentences earlier ("it was like around 15") and the base
    # screen-share behind this beat is the BTCUSD weekly chart. 5 tokens -> 5 words, every timing
    # preserved; the period breaks the caption on the sentence instead of running "somebody thinks"
    # into it. Keyed on the whole restart, which cannot occur in English.
    (("15", "was", "15", "was", "alone"), ["15", "was", "15", "was", "the low."]),
    # THE DOOMER PRICE, and the line the close rejects. "somebody thinks Kaspa at a half of a CENT."
    # This clip's own pass hears the unit as " set" (80.10-80.32 s, p 0.75); medium.en on an isolated
    # 77.0+4.6 s window hears " sec." and small.en on 78.2+3.0 s hears " second." - three different
    # non-words for the same syllable, none of which is a price. The PICTURE settles it: the base
    # screen-share carries the viewer chat line this beat is answering, parked on screen from ~84 to
    # ~92 s - "@LarryFinklestein: I think Kasp 0.005 lol" - and 0.005 dollars IS half a cent. The
    # whole clip is denominated in cents (2.5 cents at 1.04 s, 1.4 cents at 20.50 / 24.02 / 35.50 /
    # 90.44 s). 6 tokens -> 6 words, so every timing is untouched. Keyed on the full six-token run
    # ("at a half of a set"), which cannot occur in English.
    (("at", "a", "half", "of", "a", "set"), ["at", "a", "half", "of", "a", "cent"]),
    # NOT corrected, deliberately (cooper-cheerleaders/kaspa-steak-dca-full):
    #  - the opening "I GUESS IT WAS a steak at 2.5 cents". One decode (medium.en on 0+9.0 s) reads
    #    "A caspa is a steak", which would have made the first caption of the short read "kaspa is a
    #    steak" - the clip's own title. It is NOT what he says: this clip's own pass, medium.en on
    #    0+3.6 s and medium on 0+6.0 s all three return "I guess it was a steak", so the hook ships
    #    verbatim and the pun stays in the TITLE and the cover, where it belongs.
    #  - " Casper's a steak" (8.04 s) and " casper" (33.46 / 44.16 / 77.46 s) need no rule here: the
    #    global cas+per entry in CORRECTIONS already renders all four as kaspa/kaspa's.
    #  - the 71.12-73.64 s and 83.52-85.44 s spans. Both carry speech-level energy (5 ms RMS: -13 to
    #    -20 dB and -20 to -25 dB), so neither is a pause, but NO model produces a word either one
    #    corroborates: five isolated decodes of the first (medium.en, small.en, medium x2, large-v3
    #    x2) return nothing between the words on each side, and the .en models answer the second with
    #    the classic "Thanks for watching!" hallucination. They are non-lexical vocalisations and are
    #    left uncaptioned rather than invented.
    #  - "then so as it's all then then" (95.86-98.14 s). Loud (-13 to -20 dB) but genuinely mumbled:
    #    medium.en, small.en and medium each return a DIFFERENT reading ("then it", "and then it",
    #    "and sort of zoom it's not them then"), i.e. there is no corroborated correction to make, so
    #    the clip's own pass ships verbatim.
    # --- back-in-ny batch, 2026-08-25 (everything-at-27-million-impact, clip 4) ---
    # Three Robinhood-chain memecoins are NAMED in this clip and NONE of them has a reference logo on
    # disk, so the captions are the only place their names appear correctly. Two of the three are
    # settled by a RECEIPT ON MIKE'S OWN SCREEN-SHARE, which outranks any decode:
    #  - ARTIFICIAL INU. The clip's own pass renders it " artificial" + " enu" (p 0.55 on the tail,
    #    i.e. the model has nothing). The base video from 10.78 s to the end is the CoinMarketCap
    #    page for the token, whose headings read "Artificial Inu" and "Artificial Inu Markets" (frame
    #    grabs at t=13.0 and t=17.0 s), so the spelling is not a guess. The batch caption gate lists
    #    the same fix ("artificial enu" -> "Artificial Inu"). Merged to ONE token deliberately: the
    #    name is one unit, and as two tokens the grouper puts "we had artificial" on screen and then
    #    strands the tail in "enu we have pipe dog" (5 short words, 1.38 s). Same class as
    #    ("nine","hood") -> ["ninehood"], but the house spelling keeps the space, exactly like
    #    ("good","for","meme") -> ["good","for a","meme"].
    (("artificial", "enu"), ["artificial inu"]),
    #  - PIPE DOG. Textually a no-op merge, and that is the entire point: it makes the two-word
    #    project name ONE grouping unit. Without it the 3/5 word caps split the list line as
    #    "inu we have pipe dog" / "and now we have like", which breaks the name away from its verb
    #    and buries the second of the three coins he is counting off.
    (("pipe", "dog"), ["pipe dog"]),
    #  - STONKBROKER. The clip's own pass hears the ordinary English word " stockbroker." (p 0.85)
    #    and the batch caption gate guessed "Stonk Brokers", but the RECEIPT decides both the
    #    spelling and the number: the base screen-share for the whole first half is the DexScreener
    #    page for this token, whose header reads "STONKBROKER / ETH ... Robinhood > Uniswap v4" and
    #    whose liquidity row reads "Pooled STONKBROKER 99,864,006" (frame grabs at t=0.5 and t=9.5 s).
    #    It is ONE word and SINGULAR on screen, and singular in the audio. Keyed on the preceding
    #    "like" rather than applied globally because "stockbroker" is a real English word that a
    #    future clip could legitimately use (same discipline as ("think","cast") -> kaspa).
    (("like", "stockbroker"), ["like", "stonkbroker"]),
    #  - COINMARKETCAP, the site he names as half the answer ("coin market cap plus centralized
    #    exchanges"). Whisper splits the product name into three tokens, which the 3-word cap then
    #    strands as "everywhere coin market" / "cap plus centralized" - a caption reading "cap plus"
    #    means nothing. Merging keeps the whole 13.66-14.52 s span and puts the site's name on screen
    #    as one unit. Same class as ("cash","cat") -> ["cashcat"] and ("house","coin") -> ["housecoin"].
    (("coin", "market", "cap"), ["coinmarketcap"]),
    # "you got a team that's GETTING LISTED everywhere" — the answer the whole clip turns on. The
    # clip's own pass hears the single word " enlisted" (p 0.69), which is not what a token does;
    # you get LISTED on an exchange. TWO 1x passes on this clip's own audio decompose the same
    # /ɪnˈlɪstɪd/ run: the shipped pass reads "getting enlisted everywhere" and small.en whole-clip
    # reads "getting IT LISTED everywhere", i.e. the word "listed" IS produced by a 1x pass and
    # nothing here is invented (the same standard the akita "a freaking inu" entry was held to).
    # Corroborated by the picture and by the clip plan: the base screen-share under this line is the
    # CoinMarketCap "Artificial Inu Markets" table with its CEX / DEX / Spot tabs, and the batch
    # clip-plan states the topic as "CoinMarketCap plus centralized exchange LISTINGS are the
    # deciding factor". Keyed on the preceding "getting" so a genuine "enlisted" elsewhere (a person
    # enlisting) can never match. 2 tokens -> 2 words, every timing preserved.
    (("getting", "enlisted"), ["getting", "listed"]),
    # Market caps render as FIGURES, and as ONE SHORT token. Exactly the defect the october-bottom
    # ("the","high","is",...) -> ["the","high","is","169m"] entry documents: a group holding the
    # 7-char word "million" caps at 3 words, so "27" and "million" land in DIFFERENT captions and the
    # number the whole clip is about is split across a cut ("why is it 27" / "million?",
    # "everything's at 27" / "million."). "27m" is <=4 chars, so it stays in its group and the line
    # reads "why is it 27m?" / "at 27m?" / "everything's at 27m." It also matches the figures on
    # Mike's own screen-share for this exact moment (DexScreener "MKT CAP $27.5M", CoinMarketCap
    # "Market cap $27.57M"). Not dollarised: he never says a dollar sign, and the early-crash
    # precedent keeps a spoken "3 billion" bare and leaves the "$" to the code-drawn thumbnail.
    (("27", "million"), ["27m"]),
    # --- back-in-ny batch, 2026-08-25 (sold-cooper-rest-stop, clip 1) ---
    # THE CHAIN. "I was looking for a dog on the ROBINHOOD CHAIN." This clip's own pass renders the
    # name as " Romney" + " Hoot" (p 0.28 / 0.20, i.e. the model has nothing) and medium.en on an
    # isolated 9.2+5.2 s window returns "on the romno chain" - two different non-words for the same
    # run, neither of them a chain. The RECEIPT decides it: the base screen-share under this exact
    # line is the DexScreener COOPER/WETH page whose pair header reads "Robinhood > Uniswap v3"
    # (frame grab at t=3.0 s), and the batch caption gate lists the same class of fix ("Romano
    # chain" / "rabbit hood" / "robert her chain" -> "Robinhood chain"). NOT a global \bromney\b
    # rule: Romney is a real surname. 3 tokens -> 2 words (the third timing is dropped, which is
    # supported), keyed on the full run so nothing else can match.
    (("romney", "hoot", "chain"), ["robinhood", "chain"]),
    # THE ROTATION, and the clip's scoped build directive `uptober-reference` (Mike, 2026-08-25):
    # "the coin Mike rotates into after selling Cooper is UPTOBER, not October." This clip's own pass
    # renders the sentence as the ungrammatical "I just put IT'S A October" (p 0.38 / 0.37 / 0.80);
    # medium.en on an isolated 61.3+5.3 s window and on a tight 63.2+2.0 s window BOTH return "I just
    # put INTO October", so the preposition is real and nothing is invented. The token itself is the
    # COIN, not the month: the base video cuts to the UPTOBER site nine seconds later and holds it to
    # the end ("$UPTOBER is the green signal", COMMUNITY COIN / ROBINHOOD CHAIN). 6 tokens -> 5 words
    # (the last timing is dropped, which is supported). Keyed on the whole six-token run, so the
    # clip's FOUR other "October"s - which are all the MONTH ("October, October is probably gonna be
    # green" 68.54, "if October, if October is not green" 83.20/84.42, "if and when October turns out
    # to be a green month" 93.94) - are untouched and stay "october" on screen. The directive scopes
    # the fix to the coin; a global rule would rewrite his own thesis.
    (("i", "just", "put", "its", "a", "october"), ["i", "just", "put", "into", "uptober"]),
    # "instead of that infamous bottom that EVERYBODY'S EXPECTING". The clip's own pass drops the
    # ending (" expect", p 0.65), which leaves an ungrammatical caption. medium.en on an isolated
    # 87.2+4.0 s window returns "infamous bottom that everybody's expecting." 2 tokens -> 2 words,
    # every timing preserved.
    (("everybodys", "expect"), ["everybody's", "expecting"]),
    # THE THESIS WORD. "I lose my money, I lose everything. BUT IT'S ASYMMETRICAL, I would imagine."
    # The clip's own pass renders the run as " What it says for metrical" with probabilities
    # 0.02 / 0.37 / 0.34 / 0.36 / 0.52 - the 0.02 is the model telling you it has nothing - and
    # "what it says for metrical" is not English. TWO isolated medium.en decodes return the same
    # sentence: 89.4+5.2 s reads "I lose everything. But it's asymmetrical. I would imagine that if
    # and when October..." and a tight 90.4+2.2 s reads "But it's asymmetrical, I would imagine."
    # It is also the clip's thesis in one word (an asymmetric bet: he loses one bag, or the coin
    # pumps like hell). 5 tokens -> 3 words (the last two timings are dropped, which is supported);
    # the period breaks the caption group exactly where the clause does.
    (("what", "it", "says", "for", "metrical"), ["but", "it's", "asymmetrical."]),
    # --- back-in-ny batch, 2026-08-25 (bots-back-to-life, clip 5) ---
    # THE 550X RECEIPT, and the clip's biggest number. Two things are wrong in this clip's own pass
    # ("this is a highly advanced bot 550 X AND MY X, right?"): the preposition and the token.
    #  - The TOKEN is MYX, not "my X" and not NYX. ⛔ MIKE CORRECTED "nyx" -> "MYX" ON 2026-08-10 (see
    #    the ("memoy","x") entry above: "his call is final and overrides the ASR evidence"), and this
    #    build's run contract asked for "NYX" - the reading he already rejected - so his standing call
    #    wins. It is also corroborated here rather than assumed: FIVE isolated decodes of this spine
    #    all produce the token, medium.en on 8.60+3.60 s and 9.00+2.40 s reading "550X at MYX" and
    #    large-v3 on 8.20+7.60 / 8.80+4.40 / 9.00+2.60 s reading "550x on myx" every time.
    #  - The PREPOSITION is "on": all THREE large-v3 windows return "on myx", and it is his own idiom
    #    for this exact receipt in another livestream (tutorial batch: "the 550X on MYX on BNB").
    # 4 tokens -> 3 words (the trailing "x" timing is dropped, which is supported). Keyed on the
    # merged "550x" so nothing else in the corpus can match.
    (("550x", "and", "my", "x"), ["550x", "on", "myx"]),
    # THE 130X, spoken twice, and a number the whole clip turns on. Whisper renders both as SPELLED-OUT
    # words ("the hundred and thirty X", "it's a hundred thirty X"), which the 3-word cap then splits
    # across two captions ("right the hundred" / "and thirty x on") so the receipt never appears on
    # screen as a figure at all. Same defect and same fix as ("27","million") -> ["27m"] and
    # ("the","high","is",...) -> [...,"169m"]. Both are 1-word MERGES, so each keeps its whole span
    # (11.74-13.00 s and 18.20-19.12 s) and no timing is invented. The 4-token key is listed FIRST so
    # "hundred AND thirty x" can never be matched by the 3-token rule. Neither run can mean anything
    # but 130x in English. The figure matches Mike's own screen-share, whose "Multipliers" column
    # reads 130x on the Insider Alert row for this exact beat.
    (("hundred", "and", "thirty", "x"), ["130x"]),
    (("hundred", "thirty", "x"), ["130x"]),
    # $TUT. The token is TUTORIAL, ticker $TUT, and the montserrat preset renders everything lowercase
    # via CSS, so a bare "tutorial" is indistinguishable from the ordinary English word - exactly the
    # finding the tutorial batch recorded above for ("is","tutorial","on") and ("so","tutorial","for"),
    # and it matters more here because the sentence around it ("the 130x on tutorial and bnb") reads
    # perfectly well as a how-to video. This clip ALSO has the project's real logo on disk
    # (schedule-tweets/images/reference/TUT-tutorial.jpg), which is what the b-roll beat over this line
    # is generated from. Keyed on its neighbours so an ordinary "tutorial" can never match; idempotent,
    # because core("$tut") == "tut". 3 tokens -> 3 words, every timing preserved.
    (("on", "tutorial", "and"), ["on", "$tut", "and"]),
    # "which was a 94x UP UNTIL September of last year" - the 94x is the before-figure of the 130x
    # receipt. This clip's own pass inserts a phantom " and" (16.00-16.18 s) that turns the clause into
    # "a 94x and up until September", which is not English and hides the comparison. TWO independent
    # decodes of this spine drop it: medium.en whole-file reads "which was a 94x up until September of
    # last year" and large-v3 on an isolated 14.40+6.60 s window reads the same. 4 tokens -> 3 words
    # (the last timing is dropped, which is supported); keyed on the merged "94x" so nothing else
    # can match.
    (("94x", "and", "up", "until"), ["94x", "up", "until"]),
    # MATT FURIE'S DISCO, the 47x community find (ticker DISCO). Nobody's decoder gets the possessive:
    # this clip's own pass hears " Matt Furious", medium.en on isolated 44.40+4.20 s and 46.60+4.00 s
    # windows hears "Matt Fieri's", large-v3 on 44.80+8.80 s and 45.20+3.40 s hears "Matt Fury's", and
    # the MASTER livestream pass hears "math series" - four different non-names for one possessive,
    # which is why the run contract's "Math Series Disco" is the master's garble rather than the token.
    # Matt Furie (Pepe's creator) is a recurring real person in Mike's meme-coin content, and the
    # robinhood batch already shipped exactly this fix ("Matt Fury"/"Matt Furies" -> "matt furie",
    # constants-hr.ts). 3 tokens -> 3 words, every timing preserved. IP note: only the NAME appears, in
    # the spoken captions; no Furie artwork or likeness is generated anywhere in this clip.
    (("matt", "furious", "disco"), ["matt", "furie's", "disco"]),
    # THE DEGEN MONITOR, the bot channel that found both community plays. Every decoder garbles it and
    # none of them into anything meaningful ("the DJ monitor" here, "DJ mod" / "DJ Modern" / "DJ and
    # monitor" / "DJI Modern" across five isolated windows). The RECEIPT settles it and outranks all of
    # them: the base screen-share for the whole clip is Mike's own Crypto Rich "Top Performing Assets"
    # table, whose "Called by" column literally reads **Degen Monitor** on the 60x and 47x rows he is
    # naming (frame grabs at t=5/21/44/46/52 s). The batch caption gate lists the same fix
    # ("dj / dgn / deejay" -> "degen"), and the tutorial batch shipped the sibling rule
    # ("the","dj","mindset") -> ["the","degen","mindset"]. Keyed on "the" so a real DJ can never match.
    # 3 tokens -> 3 words, every timing preserved.
    (("the", "dj", "monitor"), ["the", "degen", "monitor"]),
    # "where they're being LISTED" - the last thing his bots check. This clip's own pass truncates the
    # word to " list." (31.08-31.32 s), which ships a caption ending in a bare noun and breaks the
    # sentence. medium.en whole-file on this spine returns "and where they're being listed". 2 tokens
    # -> 2 words, every timing preserved. Same class as ("everybodys","expect") -> ["everybody's",
    # "expecting"] and ("getting","enlisted") -> ["getting","listed"] earlier in this same batch.
    (("being", "list"), ["being", "listed"]),
    # "...of 47x in September. THAT was like, that was a euphoria" - the September euphoria the 47x
    # rode. Two defects in one run. (a) This clip's own pass opens the new sentence with " There"
    # (50.64-51.16 s), stranding the restart as "there was like that was a euphoria"; THREE
    # independent decodes read it with "that" (medium.en whole-file, medium.en on an isolated
    # 44.80+8.80 s window, and large-v3 on the same window all return "That was like, that was a
    # euphoria in September, right?"). (b) The pass puts NO sentence-ending punctuation on the
    # preceding "September", so the group break never fires and the caption welds the two sentences
    # into "september that was"; the same three decodes all end the sentence there. 4 tokens -> 4
    # words, every timing preserved. Keyed on "september there was like", which cannot recur.
    (("september", "there", "was", "like"), ["september.", "that", "was", "like,"]),
    # THE AWE BEAT. "that's amazing, man. HOLY CRAP, MAN. we have these highly advanced bots..." The
    # pass puts no period on the second "man" (22.78-22.84 s) and Whisper's own boundary is 0.00 s
    # wide there, so the group break cannot fire and the emotional peak ships welded to the next
    # sentence as "holy crap, man we have". The boundary is REAL and measured: a 20 ms-RMS scan of
    # this spine finds DIGITAL SILENCE at 22.975-23.300 s (min -180 dBFS) between them, and medium.en
    # whole-file reads "That's amazing, man. Holy crap, man. So we have these highly advanced bots".
    # 3 tokens -> 3 words, every timing preserved. Keyed on the preceding "crap" so an ordinary
    # "man we" can never match.
    (("crap", "man", "we"), ["crap,", "man.", "we"]),
    # THE 60X RECEIPT. "Bobby the Cat was found in there. we did a 60X. OH, Matt Furie's Disco..."
    # The pass leaves the number unpunctuated, so the 5-short-word cap sweeps the next sentence's
    # opening interjection into the receipt's caption ("we did a 60x oh") and the community find
    # reads as a fumble instead of a number. Every decode of this spine ends the sentence on the
    # figure: medium.en on an isolated 44.40+4.20 s window returns "did a 60x. Oh, Matt Fieri's
    # disco...", large-v3 on 44.80+8.80 s and medium.en whole-file the same. 2 tokens -> 2 words,
    # every timing preserved. Keyed on the merged "60x" plus the interjection after it. ⚠ The key is
    # deliberately TWO tokens, not three: a ("60x","oh","matt") key CONSUMES "matt", so the scan
    # resumes at "furious" and the ("matt","furious","disco") rule below can never match (and the
    # fixpoint pass cannot recover it, because core("60x.") == "60x" re-matches on every pass).
    (("60x", "oh"), ["60x.", "oh"]),
    # --- everything-will-pump batch, 2026-08-27 (october-zombies-impact, clip 6) ---
    # "...zombies just buying it out, JUST buying in." The clip's own pass renders the second
    # "just" as "is", which produces "buying it out IS buying in" - not English, and it destroys the
    # parallel construction that is the rhythm of the line. NINE independent decodes settle it:
    # "just" in the MASTER word pass (446.42 s, p 0.60), in medium.en on an isolated master
    # 445.0-448.2 s, in medium.en on an isolated clip 2.0-5.6 s, in the clip's medium.en WHOLE-file
    # pass, and in small.en on both an isolated clip 3.0-5.4 s and master 445.0-448.2 s; only three
    # decodes read "is". (The neighbouring "out" is deliberately NOT corrected - it was checked in
    # the same sweep and 7 of 9 decodes read "out", so the clip's own pass is right there and the
    # clip plan's paraphrase "buying it up" is what is wrong.) The two punctuation marks are exactly
    # where the clip's own medium.en whole-file pass punctuates ("...just buying it out, just buying
    # in. Oh my god."), and the period on "in." is ALSO the assembly seam: this spine is three
    # livestream segments spliced together and the picture hard-cuts at a MEASURED t=5.240 s
    # (frame-difference scan: 0.8 median |delta| vs 63.3 at that frame), so a caption group spanning
    # it would straddle two different moments of the stream. 5 -> 5 words, every timing preserved.
    # The key "it out is buying in" is not English and cannot occur legitimately.
    (("it", "out", "is", "buying", "in"), ["it", "out,", "just", "buying", "in."]),
    # Same clip. "Oh my god. IT'S A TRANSFER of wealth" - two sentences, and without the period the
    # 5-short-word cap welds them into one 1.32 s caption reading "oh my god it's a". The clip's own
    # medium.en whole-file pass punctuates it as two sentences. Idempotent (the key re-matches its
    # own output and re-emits it unchanged), 5 -> 5 words, every timing preserved.
    (("my", "god", "its", "a", "transfer"), ["my", "god.", "it's", "a", "transfer"]),
    # Same clip, the SECOND assembly seam. "...a transfer of wealth from them to us. WE ARE GONNA
    # SEND." The picture hard-cuts at a MEASURED t=8.880 s (mean |delta| 48.7 vs a 0.8 median) into
    # a different point of the livestream, and the clip's own medium.en whole-file pass punctuates
    # the sentence break there. Without it the caption "to us we are" straddles the cut. Keyed on
    # the full six-token run back through "wealth" so a generic "them to us we are" cannot match.
    # Idempotent, 6 -> 6 words, every timing preserved.
    (("wealth", "from", "them", "to", "us", "we"),
     ["wealth", "from", "them", "to", "us.", "we"]),
    # Same clip, the payoff repeat: "and it's gonna be, IT'S GONNA BE very, very soon." Without a
    # break on the first limb the 3-word cap welds the two limbs into a caption reading "gonna be
    # it's", i.e. the end of one limb plus the head of the next. The clip's own medium.en whole-file
    # pass punctuates the seam ("...it's gonna be, it's gonna be very soon."), and the pause is
    # MEASURED on this spine at 5 ms RMS: a 40 ms trough at 11.440-11.480 s, floor -56.7 dB, between
    # the two limbs. Escalating that comma to a period is the same move the ("craziness",
    # "craziness","man") entry documents - one period, on the FIRST limb only - and it splits the
    # run into "gonna be." / "it's gonna be" / "very soon." so the repeat reads AS a repeat.
    # Idempotent, 5 -> 5 words, every timing preserved.
    (("gonna", "be", "its", "gonna", "be"), ["gonna", "be.", "it's", "gonna", "be"]),
    # --- everything-will-pump batch, 2026-08-27 (october-zombies-wealth-transfer, clip 1) ---
    # THE TITLE LINE'S IMAGE: "there's gonna be HORDES AND HORDES AND HORDES of four year cycle
    # zombies". This clip's own word pass renders all three as "hoards" (a stash), which is the
    # wrong word for a crowd and reads as a typo on screen. Settled by decodes that are not this
    # clip's pass: medium.en on an isolated 91.0-95.2 s returns "There's gonna be hordes and hordes
    # and hordes of four-year cycle zombies", and the SIBLING clip 6 (october-zombies-impact) is cut
    # from this exact audio and its own word pass reads "Hordes and hordes and hordes" verbatim.
    # NOT a global \bhoards\b rule: "hoards" is a real English word (and a real verb, "he hoards
    # his coins"), so the key is the full five-token run, which cannot occur legitimately. 5 -> 5
    # words, every timing preserved, and the run's limbs are never ADJACENT (each is separated by
    # "and"), so the stutter collapse never touched it and no PROTECTED_DOUBLES entry is needed.
    (("hoards", "and", "hoards", "and", "hoards"),
     ["hordes", "and", "hordes", "and", "hordes"]),
    # Same clip: "and if there's a BLACK SWAN event in October" at 77.70 s. The word pass hears
    # "block swan" (p 0.38); "block swan" is not a phrase in any catalogue, and the SAME clip says
    # "black swan" correctly twice more (88.42 s and 108.06 s in the tail, both p > 0.8). Verified
    # by medium.en on an isolated 76.2-79.6 s, which returns "And if there's a Black Swan event in
    # October." 2 -> 2 words, every timing preserved.
    (("block", "swan"), ["black", "swan"]),
    # Same clip: the Bitcoin price levels he sold and buys back at. Whisper splits every one of them
    # into "<number>" + "K" ("a hundred K, 90 K, 85 K", "a hundred and 10, 120 K"), the same class
    # as the ("62","k") / ("900","k") entries above - cleanup()'s digit merge only fires on
    # ""/"percent"/"x", so a thousands "k" needs a keyed pair here, and the house style is figures.
    # All five verified in one medium.en decode of an isolated 57.4-67.2 s, which returns "when
    # Bitcoin was like 100k, 90k, 85k, they're going to be getting in. They're going to be jumping
    # back in when Bitcoin is like 110, 120k." The two "a hundred" keys are 3 and 4 tokens so a bare
    # "hundred" is never touched; the number pairs are keyed on the exact digits.
    (("a", "hundred", "k"), ["100k"]),
    (("a", "hundred", "and", "10"), ["110"]),
    (("90", "k"), ["90k"]),
    (("85", "k"), ["85k"]),
    (("120", "k"), ["120k"]),
    # Same clip: "let's say like 20 or $50,000 worth of crypto". Whisper emits the figure as TWO
    # tokens, "$50" + ",000" - the comma continuation is the same failure class as the "." decimal
    # continuation cleanup() already merges, but cleanup()'s rule only matches a leading ".", so the
    # thousands comma needs a keyed pair. Left alone it renders on screen as "$50 ,000". Verified by
    # medium.en on an isolated 38.6-42.4 s ("let's say like 20 or 50 thousand dollars worth of
    # crypto and they sold") and by the clip's medium.en whole-file pass ("like 20 or $50,000 worth
    # of crypto"). 2 tokens -> 1 word, the whole 39.94-40.72 s span kept.
    (("50", "000"), ["$50,000"]),
    # --- everything-will-pump batch, 2026-08-27 (kaspa-real-explosion-impact, clip 8) ---
    # "KASPA ITSELF has not had this, has not had its real explosion yet." The single-token
    # casper->kaspa correction above fires first (cleanup() runs before apply_phrases), so this
    # clip's own pass would ship the caption "kaspa self has", which is not English. Both
    # independent second decodes of this spine read the pronoun in full: medium.en on an isolated
    # 0.0-5.2 s returns "Casper itself has not had its real explosion yet" and small.en whole-file
    # returns "Casper itself has not had its real explosion yet". Keyed on "kaspa" (the POST-
    # correction core) so a bare "self" is never touched; "kaspa self" cannot occur legitimately.
    # 2 tokens -> 2 words, every timing preserved.
    (("kaspa", "self"), ["kaspa", "itself"]),
    # Same clip. Multiples are ALWAYS captioned as digits (the ("a","thousand","x") rule above), but
    # he drops the article twice here - "there's gonna be LIKE THOUSAND X" and "a lot OF THOUSAND X
    # plays" - so neither the numeric merge in cleanup() nor the existing ("a","thousand","x") key
    # can reach them, and the caption would read "thousand x". Both readings are confirmed on three
    # decodes of this spine: the clip's own word pass, medium.en on an isolated 9.8-14.8 s ("there's
    # going to be like thousand X there's going to be a lot of thousand X players across the board")
    # and small.en whole-file ("like thousand x-cra- ... a lot of thousand x-plays"). Keyed on the
    # word BEFORE the number so a bare "thousand x" elsewhere is untouched. 3/4 tokens -> 2/3 words
    # (the trailing timing is dropped, which is supported).
    (("like", "thousand", "x"), ["like", "1000x"]),
    (("lot", "of", "thousand", "x"), ["lot", "of", "1000x"]),
    # Same clip, the climax: "a lot of 1000X'S and 2000X'S and 5000X'S". core() strips the
    # apostrophe, so the plural keys are ("...","thousand","xs"). The pre-existing ("thousand","xs")
    # rule handles the FIRST one (it is preceded by "of"), but on its own it would turn the other
    # two into "two 1000x's" / "five 1000x's" - the multiplier read as a count. medium.en on an
    # isolated 15.8-20.6 s of this spine returns the figures outright: "There's going to be a lot of
    # 1000Xs and 2000Xs and 5000Xs." Keyed with the multiplier word so the generic rule cannot win
    # the position. 3 tokens -> 1 word, the whole span kept.
    (("two", "thousand", "xs"), ["2000x's"]),
    (("five", "thousand", "xs"), ["5000x's"]),
    # Same clip, three sentence boundaries the clip's own pass leaves unpunctuated. The montserrat
    # grouping breaks only on a >0.45 s gap or [.?!], and this spine is desilenced so tightly that
    # NO gap in it reaches 0.45 s - so without these the three sentence seams ship welded ("back
    # this is what i've", "been saying there's", "the board we"/"ones there's gonna"). Each period
    # below is (a) what BOTH independent second decodes punctuate and (b) sitting on a MEASURED
    # trough in a 5 ms RMS scan of this spine, so the caption break lands in real silence:
    #   "come back." -> 90 ms trough at 7.240-7.330 s (-61.2 dB)
    #   "been saying." -> 65 ms TRUE silence at 10.065-10.130 s (-120 dB), which is also this
    #      clip's assembly seam: the picture hard-cuts at a MEASURED t=10.10-10.12 s (frame-
    #      difference scan: 1.34 mean |delta| across the clip vs 16.74 at that frame), so a group
    #      spanning it would straddle two different moments of the livestream.
    #   "which ones." -> 55 ms TRUE silence at 16.140-16.195 s (-120 dB)
    # Each key carries the word on BOTH sides of the seam, so an ordinary "come back this" /
    # "been saying there's" / "which ones there's" elsewhere cannot match by accident. Idempotent
    # (the keys re-match their own output and re-emit it unchanged); every timing preserved.
    (("come", "back", "this"), ["come", "back.", "this"]),
    (("been", "saying", "theres"), ["been", "saying.", "there's"]),
    (("which", "ones", "theres"), ["which", "ones.", "there's"]),
    # Same clip, the FOURTH seam of the same class: "a lot of 1000x plays across THE BOARD. WE don't
    # know which ones." Without it the caption ends on a dangling "board we don't", exactly like the
    # three above. Three decodes punctuate it: medium.en on an isolated 13.60-16.60 s ("across the
    # board. We don't know which ones."), medium.en on an isolated 13.20-17.00 s (same) and small.en
    # whole-file. The pause is the shallowest of the four - a 25 ms trough at 14.555-14.580 s, floor
    # -64.6 dB - so the resulting "board." caption is only 0.24 s; that is deliberate and it is the
    # SHORT side of the trade (the alternative is a caption whose last word belongs to the next
    # sentence). Downstream it also re-splits the tail into "we don't know" (0.70 s) + "which ones."
    # (0.84 s), both squarely in the style guide's 0.4-0.8 s band.
    (("the", "board", "we"), ["the", "board.", "we"]),
    # --- everything-will-pump batch, 2026-08-27 (kaspa-real-explosion, clip 3, the FULL cut) ---
    # ⚠ This clip and clip 8 (kaspa-real-explosion-impact) are cut from the SAME passage of the
    # livestream, so the eight clip-8 keys above already fire here and are deliberately reused
    # rather than duplicated. What follows is only what clip 3's longer cut adds.
    #
    # ⛔ THE RECEIPT THAT SETTLES THIS CLIP: the base screen-share is the X post Mike is reading out
    # loud (@GabrielNico21, "Unpopular opinion:"), legible in every frame of the 47 s clip. Its text
    # IS the script, so the two ASR garbles below are decided by the SOURCE, not by a vote:
    #   "...come back hard if they are already well known in the ecosystem."
    #   "...people will look for the names they already recognize."
    #
    # "well known FOR in the ecosystem" - the clip's own pass emits a spurious "for" (18.58-18.82 s)
    # that makes the caption ungrammatical. Corroborated as spurious by FOUR decodes of this spine:
    # medium.en on isolated 16.0-20.2 s and 16.8-20.6 s, small.en on 16.0-20.2 s, and both whole-file
    # passes (small.en + medium.en) - all read "well known in the ecosystem". Only the two NARROWEST
    # windows (17.2-20.0 / 17.6-19.9 s) read "well known for any ecosystem", i.e. the classic
    # window-boundary artefact. 3 tokens -> 2 words (the trailing timing is dropped, which is
    # supported, same as the ("94x","and","up","until") entry above). Keyed on "known ... in" so an
    # ordinary "known for" elsewhere cannot match.
    (("known", "for", "in"), ["known", "in"]),
    # "people look for the names ARE ALREADY RECOGNIZED" - not English, and it inverts the sentence's
    # agent. The post says "the names they already recognize" and FOUR decodes read it that way:
    # medium.en on isolated 25.8-30.4 s and 26.4-29.4 s, small.en whole-file and medium.en
    # whole-file. Only the narrowest window (27.0-28.9 s) and the clip's own pass read "are already
    # recognized". 4 -> 4 words, every timing preserved.
    (("names", "are", "already", "recognized"), ["names", "they", "already", "recognize"]),
    # Eight sentence seams this clip's own pass leaves unpunctuated. montserrat breaks only on a
    # >0.45 s gap or [.?!], and this spine is desilenced tightly enough that NO Whisper word gap in
    # it reaches 0.45 s, so without these the seams ship welded ("explosion yet when", "been saying
    # people", "year dead they're", "the ecosystem low", "liquidity arrives people", "recognize
    # recognition", "than activity this", "well said whales", "narratives there's"). Every period
    # below is (a) punctuated by BOTH whole-file decodes of this spine and (b) sitting on a MEASURED
    # trough in a 20 ms-RMS / 5 ms-hop scan of this spine, so each caption break lands in real
    # silence:
    #   "explosion yet."      -> 90 ms trough at 4.440-4.530 s (-57.0 dB)
    #   "been saying."        -> 105 ms TRUE silence at 10.027-10.132 s (-240 dB)
    #   "last year dead."     -> 105 ms trough at 12.517-12.621 s (-75.4 dB)
    #   "the ecosystem."      -> 105 ms trough at 19.750-19.855 s (-91.4 dB)
    #   "liquidity arrives."  -> 170 ms trough at 26.330-26.500 s (-96.9 dB)
    #   "already recognize."  -> 90 ms trough at 28.510-28.600 s (-57.2 dB)
    #   "than activity."      -> 145 ms trough at 30.256-30.401 s (-70.2 dB)
    #   "well said."          -> 105 ms trough at 31.394-31.498 s (-67.0 dB)
    #   "strongest narratives."-> 140 ms trough at 36.392-36.532 s (-101.1 dB)
    # Both whole-file passes render the "arrives" seam with a COMMA rather than a period; escalating
    # that one comma is the same move the ("gonna","be","its","gonna","be") entry above documents,
    # and the 170 ms measured silence is the second-longest pause in the clip. Each key carries the
    # word on BOTH sides of the seam so an ordinary phrase elsewhere cannot match. All idempotent
    # (each key re-matches its own output and re-emits it unchanged); every timing preserved.
    # ⚠ ("already","recognize","recognition") is CASCADING: it can only match after the
    # ("names","are","already","recognized") rule above has run, which the fixpoint loop guarantees.
    # ⚠ The first key below is FIVE tokens and carries BOTH the "explosion yet." seam and the
    # "when it does." break documented under it, because a 3-token ("explosion","yet","when") rule
    # CONSUMES "when" and the scan then resumes at "it" - so a separate key starting at "when" could
    # never match, on any pass (core() strips the period, so the 3-token rule re-matches its own
    # output forever). Exactly the collision the ("60x","oh") entry above documents. It must also sit
    # BEFORE the 3-token fallback, since _apply_phrases_once takes the FIRST matching rule at a
    # position. 5 -> 5 words, every timing preserved, idempotent.
    (("explosion", "yet", "when", "it", "does"), ["explosion", "yet.", "when", "it", "does."]),
    (("explosion", "yet", "when"), ["explosion", "yet.", "when"]),
    # THE SECOND HALF OF THAT KEY, added for a MEASURED reason rather than a grammatical one. "when it does even
    # dead" is five <=4-char words, so the 5-short-word cap keeps them in ONE group whose settled
    # width MEASURES 980 px on the draft render - exactly the caption box - and the shared caption
    # component's bounce spring (damping 11 / stiffness 360, from 0.7) overshoots to 1.115x, which
    # pushes it to ~1093 px and CLIPS the first and last glyph against the 1080 px frame for ~4
    # frames. Measured on the draft: the caption's black stroke spans cols 0-1079 at the bounce peak
    # (frame 140) versus 40-1037 one frame group later. It was the ONLY group in the clip to touch
    # an edge (next widest peak is "people calling memes" at 1005 px, a 37 px margin).
    # The break is not a workaround, it is where the sentence actually divides: the SOURCE POST reads
    # "When it does, even 'dead' memes can come back hard", both whole-file decodes punctuate the
    # same clause boundary, and a 5 ms-RMS scan of this spine finds a real 5.208-5.268 s notch there
    # (floor -41.4 dBFS) - which is also the frame the comp cuts to its dead-memes b-roll beat, so
    # the caption change and the picture change now land together. Escalating that comma to a period
    # is the same move the ("gonna","be","its","gonna","be") entry above documents. Result:
    # "when it does." / "even dead memes" / "can come back." - 0.74 / 1.16 / 0.92 s, all inside the
    # style guide's band, and the widest of the three measures well under the box.
    (("been", "saying", "people"), ["been", "saying.", "people"]),
    (("year", "dead", "theyre"), ["year", "dead.", "they're"]),
    (("the", "ecosystem", "low"), ["the", "ecosystem.", "low"]),
    (("liquidity", "arrives", "people"), ["liquidity", "arrives.", "people"]),
    (("already", "recognize", "recognition"), ["already", "recognize.", "recognition"]),
    (("than", "activity", "this"), ["than", "activity.", "this"]),
    (("well", "said", "whales"), ["well", "said.", "whales"]),
    (("strongest", "narratives", "theres"), ["strongest", "narratives.", "there's"]),
    # THE $TUT RECEIPT: "and then we just proved that with TUTORIAL, right?" The token is TUTORIAL,
    # ticker $TUT (persona project_handles maps tutorial/tut -> @tutorialtoken) and this batch's
    # clip-plan mandates the fix in terms ("tutorial": "Tutorial ($TUT)"). The montserrat preset
    # renders everything lowercase via CSS, so a CASING fix is invisible on screen and only the
    # cashtag disambiguates it from the common noun - the identical finding the tutorial-batch and
    # cooper-50x rules above record. Keyed on both neighbours so an ordinary "with tutorial right"
    # can never match; idempotent (core("$tut") == "tut"), 3 -> 3 words, every timing preserved.
    (("with", "tutorial", "right"), ["with", "$tut", "right"]),
    # --- everything-will-pump batch, 2026-08-27 (longevity-escape-velocity, clip 4) ---
    # THE CLIP'S OWN TERM, third utterance: "and longevity ESCAPE VELOCITY is supposed to be within
    # the next three to six years". He says "longevity escape velocity" three times (19.72-21.24,
    # 34.48-35.58, 49.22-50.08 s); this clip's word pass renders the FIRST TWO as "velocity" and the
    # THIRD as "PHILOSOPHY" - a term that does not exist, sitting on the one line that carries the
    # clip's headline timeline. "philosophy" and "velocity" are both four syllables with a near
    # identical unstressed tail, which is exactly the confusion an ASR makes here.
    # Settled MECHANICALLY, not by preference, because four literal decodes DO read "philosophy"
    # (this clip's own pass + small.en on three staggered isolated windows) and only the master
    # whole-livestream transcript reads "velocity" - a whole-file pass has the other two utterances
    # as context, so on its own it is the weaker witness. Two decisive pieces of evidence:
    #   1. ACOUSTIC. MFCC (12-coef, 25 ms/10 ms, per-token mean-var normalised) + DTW on this
    #      spine's own audio: the disputed token (49.54-50.08 s) is CLOSER to both confirmed
    #      "velocity" tokens (1.494 to 20.68-21.24 s, 1.660 to 35.16-35.58 s) than those two
    #      confirmed tokens are TO EACH OTHER (1.734), while three same-length control tokens from
    #      elsewhere in the clip sit at 2.218-2.639. It is the same word he said twice before.
    #   2. A LITERAL DECODE THAT AGREES. small.en on a TIGHT isolated 48.75+1.60 s window (i.e. no
    #      surrounding context to prime it) returns "longevity escape velocities".
    # Keyed on "escape" so a real "philosophy" elsewhere is never touched; "escape philosophy" is
    # not a phrase in any catalogue. 2 tokens -> 2 words, every timing preserved.
    (("escape", "philosophy"), ["escape", "velocity"]),
    # Same clip, the tail of the reveal: "and you become limited, your death becomes limited TO THE
    # TWO, TO accidents." The master transcript shows what he actually says - "limited to the to to
    # accidents", a stammer on the preposition - and this clip's pass renders the middle limb as the
    # NUMERAL "two". On screen, in a clip whose whole payload is figures (50 years, 3 to 6 years,
    # 2033), "limited to the two, to accidents" reads as a COUNT of something. The stammer itself is
    # what cleanup() already drops elsewhere (it only misses this one because "the two to" are not
    # adjacent duplicates), and the skill's own rule is that captions are not 1:1 with audio and
    # readability wins. 6 tokens -> 3 words: the three stammer tokens are dropped and every
    # surviving token keeps its exact timing, so the caption reads "your death / becomes limited to"
    # / "accidents." Keyed on the full six-token run, which cannot occur legitimately.
    (("becomes", "limited", "to", "the", "two", "to"), ["becomes", "limited", "to"]),
    # Same clip: "this is ACTING ON a car accident, whatever it is" (46.38-48.52 s). "acting on a car
    # accident" is not English and it lands on the sentence that explains the whole reveal. The word
    # "acting" is an ASR artefact and nothing else: the model that settles it is medium.en, which
    # reads a clean sentence on THREE staggered isolated windows of this spine - 45.60+3.60,
    # 46.10+2.80 and 45.90+3.20 all return "This is a car accident, whatever it is." A fourth
    # medium.en pass (whole-file, on the FINAL RENDER's own audio) returns "You know, car accident,
    # whatever it is", and the master livestream transcript reads "this you know car accident
    # whatever it is" - i.e. every medium.en reading drops "acting on", and the two candidates differ
    # only in whether the filler is "is a" or "you know". The isolated majority (3 of 4) is taken,
    # which is also the reading that needs the FEWEST tokens changed. Only small.en and this clip's
    # own word pass hear "acting" at all.
    # 6 tokens -> 4 words: "on" and the duplicated "a" are dropped and the real "car" (47.46 s) keeps
    # its exact timing, so the caption reads "accidents." / "this is a" / "car accident, whatever" /
    # "it is." Keyed back through "accidents" so a legitimate "this is acting on a ..." elsewhere can
    # never match; idempotent (the output no longer contains "acting").
    (("accidents", "this", "is", "acting", "on", "a"), ["accidents.", "this", "is", "a"]),
    # NOT corrected, deliberately (same clip), and reported instead of rewritten:
    #   - "and I CAME, I CAME, I CAME to learn about this term" (16.14-18.36 s). A real stammer, not
    #     an ASR artefact: this clip's word pass gives all three limbs their own spans, small.en on
    #     a TIGHT isolated 16.10+2.30 s window returns "I came, I came, I came", medium.en
    #     whole-file on the FINAL RENDER returns "And I came, I came, I came to learn about this
    #     term called longevity escape velocity", and 2.22 s of continuous voiced audio (a 20 ms-RMS
    #     scan finds no trough >= 70 ms under -36 dBFS anywhere between 16.02 and 23.17 s) cannot
    #     hold a single three-word "and I came" - the neighbouring "to learn about this" takes only
    #     0.90 s for four words. (medium.en on isolated windows and on the bare spine collapses it to
    #     one limb; three passes hear three, three hear one, and the duration decides.) House style
    #     preserves his casual speech, so it ships as spoken. It needs NO PROTECTED_DOUBLES entry
    #     either: the limbs alternate with "I", so no two ADJACENT tokens repeat and the stutter
    #     collapse never reaches it (verified on the built array).
    # --- everything-will-pump batch, 2026-08-27 (dead-memes-comeback-receipts, clip 2) ---
    # THE VELVET RECEIPT: "I sold this baby at the top, called it like WE CALLED IT way back here."
    # This clip's own word pass reads "we call that" on its three weakest tokens of the sentence
    # (p 0.89 / 0.60 / 0.59) and ships "called it like we call that way back here", which is not
    # English. FOUR independent decodes settle it: medium.en on isolated 53.5+5.0 s, 54.0+3.0 s and
    # 52.5+6.5 s windows all return "called it like we called it way back here", and small.en on
    # 52.0+6.6 s returns "called it like, called it way back here". Keyed on the preceding "like"
    # so a legitimate "we call that ..." elsewhere can never match. 4 -> 4 words, every timing
    # preserved.
    (("like", "we", "call", "that"), ["like", "we", "called", "it"]),
    # Same clip: "and then now I bought back in, RIGHT? IT'S the same concept as Tutorial." The word
    # pass renders the two tokens after "in" as "right" + "is" at p 0.42 / 0.33 - its two lowest
    # probabilities in the whole clip - producing "bought back in right is the same concept", which
    # has no subject. THREE medium.en decodes of isolated windows (59.5+4.0, 60.2+3.0, 58.5+5.5 s)
    # and one small.en pass (58.0+8.5 s) all return "right? It's the same concept as tutorial". The
    # question mark is also the sentence break the pass never emits, so the caption group splits on
    # it instead of welding the tag question to the next clause. 3 -> 3 words, every timing
    # preserved. Keyed on the "right is the same" run, which cannot occur legitimately.
    (("right", "is", "the", "same"), ["right?", "it's", "the", "same"]),
    # Same clip: the project is TUTORIAL ($TUT), and the montserrat preset renders every caption
    # all-lowercase via CSS, so a bare "tutorial" is indistinguishable from the common noun ("the
    # same concept as tutorial" reads as a how-to guide). The cashtag is the only disambiguator that
    # is actually VISIBLE on screen - exactly the fix the `tutorial` and `back-in-ny` batches
    # already shipped for this same token. Keyed on the preposition before it, so a genuine
    # "tutorial" (a how-to video) elsewhere is never rewritten. Both occurrences in this clip
    # (62.24 s and 65.62 s) are the project. 2 -> 2 words, every timing preserved.
    (("as", "tutorial"), ["as", "$tut"]),
    (("than", "tutorial"), ["than", "$tut"]),
    # Same clip, THE CLIP'S PAYOFF FIGURE: "after previously selling SIX HUNDRED AND THIRTY PERCENT
    # higher." House rule (the ("a","thousand","x") / ("900","k") class): multiples and percentages
    # render as FIGURES, never spelled out - cleanup()'s numeric merge only fires on a literal digit
    # token, so a spelled-out percentage needs a keyed run. Five tokens on screen would also split
    # the payoff across three caption groups. The livestream MASTER transcript reads "630 %" at this
    # exact point (1808.29-1809.95 s), which is where the figure comes from. 5 tokens -> 1 word, so
    # the merge keeps the whole span (77.20-78.84 s) and the caption reads "630% higher".
    (("six", "hundred", "and", "thirty", "percent"), ["630%"]),
    # Same clip, the FUMBLE in front of that figure: "I just bought back IN THAT, AFTER previously
    # selling 630% higher." The "that" is a false-start restart (the livestream master carries it
    # too), and with it in place the 3-word cap splits the payoff as "previously selling 630%" +
    # "higher" - stranding a single 6-char word on screen for 3.88 s, because the spine's next
    # spoken word is 3.63 s later. Dropping the restart is the same move the
    # ("becomes","limited","to","the","two","to") entry documents (readability wins; captions are
    # not 1:1 with audio) and it re-groups the tail as "in after previously" / "selling 630% higher",
    # i.e. the whole receipt on one line with the figure intact. 4 tokens -> 3 words (the 4th timing
    # is dropped, which is supported). Keyed on the full four-token run.
    (("in", "that", "after", "previously"), ["in", "after", "previously"]),
    # Same clip, the OTHER payoff figure: "we get into this and it's a freaking HUNDRED AND THIRTY
    # X." Same class, and confirmed by small.en on an isolated 28.0+6.2 s window ("it's a freaking
    # 130X"). Keyed WITHOUT the leading "freaking" so the run is exactly the number; 4 tokens -> 1
    # word, keeping the whole span (32.36-33.70 s).
    (("hundred", "and", "thirty", "x"), ["130x"]),
    # NOT corrected, deliberately (same clip), and reported instead of rewritten: "I see all these
    # influencers FIGHTING ON these coins from last year". The batch clip-plan flags it as "probably
    # Whisper for 'hating on'" and asks for a caption-time check. It is NOT: FOUR independent 1x
    # passes read "fighting on" - this clip's own medium word pass (p 0.91 on "fighting"), small.en
    # on isolated 33.5+6.0 s and 34.5+4.0 s windows, and small.en on the SAME 33.5+6.0 s window run
    # with an initial_prompt that explicitly seeds the word "hating". Not one pass produced
    # "hating", including the one biased toward it, so the house rule (never ship words no 1x pass
    # produced) settles it and the line ships as spoken.
    # Same clip, FOUR sentence breaks the word pass never emits. Each one is a real sentence
    # boundary that the 5-short-word cap otherwise welds shut, and each was checked against an
    # isolated decode that punctuates it the same way. All are idempotent (core() strips the added
    # mark, so the key re-matches its own output and re-emits it unchanged) and every timing is
    # preserved.
    #  - THE CLIP'S PAYOFF NUMBER: "...it's a freaking 130X. YOU KNOW, I see all these influencers".
    #    Without the period the group runs "130x you know, i see" - the receipt the whole first half
    #    builds to, welded to the opening of the next sentence and parked on screen for 2.76 s, the
    #    single worst caption in the clip. small.en on an isolated 28.0+6.2 s window ends the
    #    sentence on the figure ("it's a freaking 130X."). Fires on the pass AFTER the
    #    ("hundred","and","thirty","x") merge above.
    (("130x", "you", "know"), ["130x.", "you", "know"]),
    #  - THE HOOK: "I tell you, things make a COMEBACK. IF YOU look at this". Without the period the
    #    hook's thesis ships as "comeback if you". small.en on an isolated 0.0+5.6 s window
    #    punctuates it as two sentences.
    (("comeback", "if", "you"), ["comeback.", "if", "you"]),
    #  - "damn, that looks like a rug, I'm not GETTING INTO THAT. SO we did a 94x up here." Without
    #    the period the sentence that sets up the clip's first receipt ships welded to the receipt
    #    itself ("into that so we did"). Keyed on the preceding "getting" so a generic "into that so
    #    we" cannot match.
    (("getting", "into", "that", "so"), ["getting", "into", "that.", "so"]),
    #  - "...these coins from last year, MAN. I DON'T, I DON'T know what to say." Without the period
    #    the caption reads "year, man i don't i". Keyed on the full stammer run, which cannot occur
    #    legitimately; the stammer itself is preserved (its limbs alternate with "I", so the
    #    ADJACENT stutter collapse never touches it).
    (("man", "i", "dont", "i", "dont"), ["man.", "i", "don't", "i", "don't"]),
    #  - THE DOUBLED CLIMAX: "it's gonna make a comeback, it's gonna make A COMEBACK. I SENT an
    #    alert saying I just bought back in." Without the period the second limb of the doubling -
    #    the line the whole clip is titled after - ships with the next sentence's subject dangling
    #    off it ("a comeback i"). Keyed on the "comeback i sent" run.
    (("comeback", "i", "sent"), ["comeback.", "i", "sent"]),
    # --- everything-will-pump batch, 2026-08-27 (housecoin-free-publicity, clip 5) ---
    # THE HOOK LINE: "a lot of talk about the HOUSING MARKET more than usual". The word pass renders
    # the noun as a bare "mark" (p=0.21, the lowest confidence in the clip) because the "-et" is
    # swallowed into the following "more". "the housing mark" is not English; small.en on an isolated
    # 5.20-7.30 s window reads "about the housing market more than you would". Same mechanical class
    # as ("market","cat") -> ("market","cap"): 2 tokens -> 2 words, every timing preserved, and the
    # key is tight enough that it can only ever be this mishear.
    (("housing", "mark"), ["housing", "market"]),
    # Same clip, A REAL RESTART STUTTER: "Housecoin has NONSTOP CON... NONSTOP CONTENT all the time."
    # The stutter is REAL, not a decode artifact - two isolated medium.en windows split it exactly
    # ("It's nonstop con." on 19.30-21.00, "non-stop content." on 20.70-22.50), which is why it is
    # collapsed rather than "corrected": cleanup()'s adjacent-duplicate collapse cannot reach it
    # (the limbs are separated by the partial word "con"), and captioning a partial word plus its
    # restart is exactly the disfluency the house method drops ("captions are NOT 1:1 with audio;
    # readability wins"). 3 tokens -> 1 merged word keeps the whole 19.52-21.84 s span, so no
    # timing is invented and the following "content" keeps its own. Keyed on the full run.
    # 4 tokens -> 2 words (the trailing two timings are dropped, which is supported and is the
    # ("50","week","moving","average") -> ["50-week","sma"] class): mapping in place puts the caption
    # break at 20.52 instead of 21.84, so the group holding it is on screen 1.68 s rather than 3.00 s
    # - the merged-span alternative ("nonstop","con","nonstop") -> ["nonstop"] parks ONE caption over
    # the whole 3.0 s stutter, which is the exact defect --max-secs exists to prevent.
    (("nonstop", "con", "nonstop", "content"), ["nonstop", "content"]),
    # Same clip: the stutter collapse eats the second limb of "let's, let's get Housecoin pumping"
    # (correctly - it is an adjacent duplicate), but the surviving limb keeps the comma the pause
    # earned, so the caption ships as "let's, get housecoin pumping" with a comma between the verb
    # and its object. 4 -> 4 words, every timing preserved, idempotent (core() strips the marks so
    # the rule re-matches its own output). Keyed on the full "i mean let's get" run.
    (("i", "mean", "lets", "get"), ["i", "mean,", "let's", "get"]),
    # Same clip, THE CLIP'S ONE MARKET-CAP FIGURE: "Housecoin's all time high was like A HUNDRED
    # MILLION, right?" House rule (the ("a","thousand","dollars") -> ["$1,000"] / ("900","k") ->
    # ["900k"] class): figures render as digits, never spelled out, and cleanup()'s numeric merge
    # only fires on a literal digit token. It is also the number the comp's ATH badge draws, so the
    # caption and the badge must not disagree. 3 tokens -> 1 word keeps the whole 24.86-25.64 s span.
    (("a", "hundred", "million"), ["100m"]),
    # --- my-new-100x batch, 2026-08-28 (boner-paired-with-hims clip 5) ---
    # "he turned $200 into $1,500 overnight" - the clip's closing receipt. Whisper emits the second
    # figure as TWO tokens, "$1" + ",500" (30.84-31.10 and 31.10-31.34 on this spine). The emitted
    # line already READS "$1,500" because the whitespace/punctuation collapse joins them, but they
    # stay two tokens, so a --colorize tag can only ever paint half of the number. Same money-figure
    # class as ("900","k") -> "900k" and ("62","k") -> "62k" above; the 1-word replacement MERGES the
    # pair and keeps the whole 30.84-31.34 span. core() strips the "$" and the comma, so the key is
    # the bare digit pair.
    (("1", "500"), ["$1,500"]),
    # "THE MARKET SPENT years searching for hard money" - the clip's first punchline, and he is
    # reading it off the screen: the pinned @bonercoinlong post visible in the base video at that
    # exact moment says verbatim "The market spent years searching for hard money." This spine's
    # word pass renders the verb as "market's spending", and gives "spending" a 0.14 s duration
    # (22.40-22.54), which is physically impossible for the word. THREE independent decodes of THIS
    # clip's own audio disagree with it: medium.en whole-file -> "The market spent years searching
    # for hard money"; small.en isolated 21.0-25.6 -> "The market spent years just searching for
    # hard money"; small.en isolated 21.3-24.3 -> "The market's spent years just searching". 2 of 3
    # + the on-screen text give "market spent", so that is what ships. Keyed on the pair so no
    # unrelated "market's spending" could match by accident.
    (("markets", "spending"), ["market", "spent"]),
    # "okay, so this one is ACTUALLY boner" - this spine's word pass drops the adverbial -ly
    # ("actual boner"). Both independent decodes of the same audio return the adverb: medium.en
    # whole-file -> "so this one is actually boner", small.en isolated 3.4-5.8 -> "Okay, so this one
    # is actually boner." Keyed on the full three-token run so a legitimate "... is actual ..."
    # elsewhere is never rewritten.
    (("one", "is", "actual"), ["one", "is", "actually"]),
    # HIMS = Hims & Hers Health, the men's-health telehealth company the coin is LP-paired against on
    # Robinhood chain. The receipt is in this clip's OWN base video: the dexscreener header reads
    # "BONER/HIMS (Market Cap) on Uniswap", the transactions table has a HIMS column, and the
    # project's pinned X post reads "Turns out it was paired with HIMS". Whisper renders it "hems"
    # on this clip's shipped word pass and "hymns" on a medium.en re-transcribe of the same audio.
    # BOTH are real English words, so they are keyed on their NEIGHBOURS here instead of going into
    # CORRECTIONS as a global single-token rule - the same reasoning that keeps ("think","cast") ->
    # kaspa out of CORRECTIONS. A bare hems rule would rewrite a real hem in a future batch.
    (("with", "hems"), ["with", "hims"]),
    (("with", "hymns"), ["with", "hims"]),
    # "HIMS AND HERS, the company" - the company's real name is Hims & Hers; Whisper also drops the
    # plural s on the second limb ("Hems and Her, the company").
    (("hems", "and", "her"), ["hims", "and", "hers"]),
    (("hymns", "and", "her"), ["hims", "and", "hers"]),
    (("hems", "and", "hers"), ["hims", "and", "hers"]),
    (("hymns", "and", "hers"), ["hims", "and", "hers"]),
    # --- my-new-100x batch, 2026-08-28 (packed-my-new-100x-impact clip 6) ---
    # THE CLIP'S WHOLE PREMISE: "if this retraces down to 800k and then it 100X'S FROM THERE". The
    # word is the VERB (to 100x), and this clip's own word pass renders its /z/ as a separate token
    # "is" ("it 100x is from there"), which is not English and flips a forward call into a statement
    # about where the price already IS. VERIFIED 2026-08-28: small.en on an ISOLATED 2.3-4.2 s window
    # returns "and 100 X's from there." while the SAME model's whole-clip pass repeats the "100x is"
    # welding - i.e. the pass that isolates the phoneme hears the verb, exactly the pattern behind
    # the ("i","had","to","list","it") entry above. Keyed on the 3-token run so a legitimate
    # "... is from ..." elsewhere can never match; 3 tokens -> 2 words (the third timing is dropped,
    # which is supported). Idempotent: core("100x's") == "100xs" != "100x", so the fixpoint pass is
    # a no-op.
    (("100x", "is", "from"), ["100x's", "from"]),
    # --- my-new-100x batch, 2026-08-28 (packed-my-new-100x, clip 1) ---
    # THE TOKEN'S NAME. Whisper hears PACT as "packed" ("so PACKED, our lows were like 400k"). Mike
    # confirmed the token 2026-08-28 and the clip's OWN base video spells it out on screen all the
    # way through (the CoinMarketCap page header "PACT", the "PACT Markets" table, the "Buy PACT"
    # button, "125B PACT" max supply), so this is a receipt, not a guess. NOT a global packed
    # rule: "packed" is an ordinary English word that a future clip will legitimately use, so it is
    # keyed on the "so packed" run that opens this clip. 2 tokens -> 2 words, timings preserved.
    (("so", "packed"), ["so", "pact"]),
    # Same clip, THE EXCHANGE: "it's with the big boys right here, GATE AND KRAKEN". The word pass
    # renders Kraken as "cracking" (the batch's STT sheet flags it at master 1707.3 s, and the
    # livestream MASTER pass reads "gate and cracking" too). The receipt is again on his screen: the
    # CMC "PACT Markets" table lists exactly two centralized exchanges, row 1 Gate (PACT/USDT) and
    # row 2 Kraken (PACT/USD), and his cursor is parked on those two rows while he says it. Same
    # class as the ("gate","and","mexi") entries above; keyed on the 3-token run so a literal
    # "cracking" elsewhere is untouched. 3 -> 3 words, timings preserved.
    (("gate", "and", "cracking"), ["gate", "and", "kraken"]),
    # Same clip, A REAL RESTART STUTTER: "we just SAID DID some good pumps". The stutter is in the
    # audio (the livestream MASTER pass reads "We just said did some good pumps" verbatim, and
    # small.en on an isolated 30.2-33.6 s window of this spine returns the same), so the partial
    # restart is DROPPED as the disfluency it is rather than captioned - cleanup()'s adjacent-
    # duplicate collapse cannot reach it because the two tokens are different words. 3 tokens -> 2
    # words (the third timing is dropped, which is supported).
    (("just", "said", "did"), ["just", "did"]),
    # Same phrase, the noun: "some good PUMPS", which this clip's word pass renders "plumps". The
    # MASTER pass and three isolated small.en windows (28.8-32.3, 29.9-32.6, 30.2-33.6 s) all read
    # "pumps"; "good plumps" is not English. Keyed on the preceding "good" so a legitimate "plumps"
    # could never match. 2 -> 2 words, timings preserved.
    (("good", "plumps"), ["good", "pumps"]),
    # Same clip, THE TITLE'S RECEIPT: "so this was just like two days ago. 10X." This spine's own
    # word pass renders the punchline as "an X." (66.80-67.10 s) because the clip SPLICES a new
    # livestream segment in at 67.12 s, so every window that spans the seam melts "10 X. That's"
    # into "and that's" (small.en on 64.9-67.2 / 65.9-67.3 / 66.3-68.0 all do). The livestream
    # MASTER pass, which has no seam there, transcribes it as its own sentence: "10 X."
    # (1985.58-1986.02 s), inside this clip's segment 9 (1982.54-1986.30), and FOUR isolated small.en
    # decodes of that master window (1984.2 s +0.0-3.0 / +1.0-2.6 / +1.2-2.3 / +0.6-2.8 s) return
    # "ago. 10x." / "10X" / "10X" / "10X." with no dissent. It is also the number the
    # short is TITLED after. The period on "ago." lands the punchline as its own caption instead of
    # welding it to the set-up. 4 tokens -> 3 words (the fourth timing is dropped, which is
    # supported); the key is this exact mishear and cannot occur legitimately.
    (("days", "ago", "an", "x"), ["days", "ago.", "10x."]),
    # Same clip, the forward call: "and then IT 100x's from there". The word pass hears the pronoun
    # as "at" ("and then AT 100x is from there"), which is not English; the MASTER pass reads "and
    # then IT 100 X is from there". Keyed on the "then at 100x" run so a real "at 100x" elsewhere is
    # untouched. 3 -> 3 words, timings preserved. It CASCADES into the ("100x","is","from") entry
    # above on the next fixpoint pass, which turns the stray "is" into the verb's own /z/.
    (("then", "at", "100x"), ["then", "it", "100x"]),
    # Same clip, WHAT THE PROJECT IS: "now, this is not the typical one, see A TABLE OF STABLE COIN
    # infrastructure". The receipt is on his screen at that exact second - he has just opened PACT's
    # own site and HIGHLIGHTED its headline, "Stablecoin Infrastructure for Financial Markets" - and
    # four isolated decodes of this spine return the compound with no "table" in it at all
    # (small.en on 37.2-41.0 "so you have a stable coin infrastructure", 38.2-40.6 "one stable coin
    # infrastructure", 38.4-40.4 "on Stablecoin infrastructure", 37.6-40.3 "Not the typical one,
    # Stablecoin infrastructure"). "a table of" is a restart no decode settles, so it is dropped as
    # a disfluency (the house method: captions are NOT 1:1 with audio, readability wins) rather than
    # rewritten into words no pass produced; "stablecoin" is merged the same way ("house","coin") ->
    # "housecoin" is. 6 tokens -> 3 words (three timings dropped, which is supported).
    (("see", "a", "table", "of", "stable", "coin"), ["see", "a", "stablecoin"]),
    # Same clip, THE MARKET CAP HE SOLD INTO: "one of my sell orders was right at the top, like A
    # THREE MILLION market cap". House rule (the ("a","hundred","million") -> ["100m"] class):
    # figures render as digits, never spelled out, and cleanup()'s numeric merge only fires on a
    # literal digit token. It is also the figure the comp's code-drawn badge states at the same
    # second, so caption and badge must not disagree. 3 tokens -> 1 word keeps the whole
    # 63.90-64.40 s span. Idempotent: core("3m") != "a".
    (("a", "three", "million"), ["3m"]),
    # --- my-new-100x batch, 2026-08-28 (kaspa-lambo-color-argument, clip 8) ---
    # THE OPENING LINE. This clip's own word pass opens "Had I had to show this is awesome", which is
    # not English: the leading "Had" is the first syllable of "I had" doubled by the decoder, and the
    # SECOND "this" of "show this. THIS is awesome" is swallowed. Both of small.en's independent
    # passes of this spine (whole-file, and an isolated 0.0-9.0 s window) read "I had a show this,
    # this is awesome", i.e. seven tokens with two "this". 7 tokens -> 7 words, so every timing is
    # preserved in place and nothing is invented beyond the relabelling; the period also puts the
    # caption break where the sentence actually divides (1.32 s), instead of welding the hook into
    # one run. Keyed on the whole seven-token run, which cannot occur legitimately.
    (("had", "i", "had", "to", "show", "this", "is"),
     ["i", "had", "to", "show", "this.", "this", "is"]),
    # "greenish cyan. SOME people say teal." The word pass renders the sentence boundary as "and"
    # ("greenish scion and people say teal"), which welds Mike's own colour claim to the OTHER
    # camp's word and inverts the contrast the line exists for. small.en's whole-file pass AND an
    # isolated 4.5-12.0 s window both read "Some people say teal"; persona.json
    # (`kaspa_color_cyan_not_scion`) also records "teal" as specifically the word OTHER people use.
    # Keyed on the preceding "cyan" so a legitimate "... and people say ..." elsewhere can never
    # match, and the period is the sentence break the desilenced spine has no gap for.
    (("cyan", "and", "people", "say"), ["cyan.", "some", "people", "say"]),
    # "I had an argument with a guy one time. NOT AN ARGUMENT, my graphics guy." The word pass hears
    # the correction as "Not arguing my graphics guy", which reverses the joke (he is walking the
    # word "argument" back, not describing an activity). small.en reads "not argument, my graphics
    # guy" whole-file and "not an argument, but my graphics guy" on an isolated 11.2-21.4 s window.
    # 2 tokens -> 2 tokens with the article folded into the second (the ("ismpmi") -> "ism pmi"
    # class: one TOKEN, two rendered words), so both timings are preserved.
    (("not", "arguing"), ["not", "an argument,"]),
    # "I even asked Claude. CLAUDE extracted the color code." The repetition is REAL (small.en's
    # whole-file pass reads it), and it is a sentence boundary, not a stutter - which is why the pair
    # is also keyed into PROTECTED_DOUBLES below, so cleanup()'s adjacent-duplicate collapse cannot
    # eat the second limb and leave "asked claude extracted the color code". This rule only adds the
    # period. Keyed with the preceding "asked" so a genuine "claude claude" stutter elsewhere is
    # unaffected.
    (("asked", "claude", "claude"), ["asked", "claude.", "claude"]),
    # Same sentence's end: "...extracted the color CODE. He said it's greenish cyan." No gap in this
    # desilenced spine reaches the 0.45 s break threshold there, so without the period the caption
    # ships welded ("code he said his"). Keyed on "color code he".
    (("color", "code", "he"), ["color", "code.", "he"]),
    # THE PAYOFF SEAM: "he said it's greenish CYAN. WHO'D HAVE THOUGHT?" The word pass renders the
    # idiom as "would have thought", which is not what the sentence is - four independent decodes
    # (small.en whole-file plus isolated 35.8-44.6 / 41.8-49.4 / 43.4-50.2 s windows) all read
    # "Who'd have thought?". Keyed on the preceding "cyan" so a legitimate "I would have thought"
    # elsewhere can never match; it also supplies the sentence break and the question mark, both of
    # which this spine has no pause for.
    (("cyan", "would", "have", "thought"), ["cyan.", "who'd", "have", "thought?"]),
    # "...five different shades of CYAN. AND NONETHELESS, Kaspa's color was cyan." Same missing-break
    # class: without the period the two sentences ship as one run ("of cyan and nonetheless"). Keyed
    # on "cyan and nonetheless", which can only be this seam.
    (("cyan", "and", "nonetheless"), ["cyan.", "and", "nonetheless"]),
    # THE CHAT NAME. He greets a viewer whose message is BURNED INTO the base video at that exact
    # second: the livestream chat banner in the screen-share reads "@ShayKaspa - Good morning
    # brother" (t 48.5-52.5 s, verified on frame grabs at 49 and 52 s). The word pass renders the
    # name "She Kasper" (and CORRECTIONS then maps Kasper -> kaspa); small.en variously hears "Shake
    # Casper" / "Shakehaspa" / "Shake has". The on-screen receipt settles the spelling, and the
    # period is the boundary before he reads the message itself ("soon Lambo"). Keyed with the
    # following "soon" so nothing else can match.
    (("she", "kaspa", "soon"), ["shay", "kaspa.", "soon"]),
    # "...and he told me it's CYAN. I WAS LIKE, no, it's not cyan." Another missing sentence break:
    # without it the graphics guy's claim and Mike's denial ship in ONE caption ("cyan i was like
    # no"), which reads as a single speaker's line. Keyed on "cyan i was like".
    (("cyan", "i", "was", "like"), ["cyan.", "i", "was", "like"]),
    # THE CLIP'S LAST PAYOFF WORD: "...it has its shade of a color, greenish CYAN. WHAT'S GOING ON?"
    # Without the period the payoff welds into the next line and ships as "cyan what's going" / "on?"
    # - the punchline word sharing a caption with an unrelated aside, and a one-word "on?" orphan.
    # Keyed on "cyan what's going", which can only be this seam.
    (("cyan", "whats", "going"), ["cyan.", "what's", "going"]),
    # "an image with bars of colors, AND THERE'S five different shades of cyan." The clip's own word
    # pass renders the contraction as the possessive "his", which makes the sentence say the colour
    # card belongs to somebody. SETTLED ON THE SHIPPED AUDIO: whole-file medium.en AND small.en
    # decodes of the FINAL RENDER both read "And there's five different shades of cyan", as does an
    # isolated 32.2-36.0 s window of the mix; the only reads that carry "his" are the clip's own pass
    # and one narrow window (a third window produced the non-word "and is five"). Keyed on
    # "and his five", which can only be this seam.
    (("and", "his", "five"), ["and", "there's", "five"]),
    # "Claude extracted the color code. HE SAID IT'S greenish cyan." Same contraction, same failure:
    # "he said his greenish cyan" is not a sentence. The whole-file medium.en decode of the FINAL
    # RENDER reads "He said it's greenish, cyan"; the "his" reads all come from small.en (whole-file
    # and two narrow windows), which is the weaker model here. Keyed on "said his greenish" so only
    # this occurrence can match.
    (("said", "his", "greenish"), ["said", "it's", "greenish"]),
    # THE HARD-OUT: "Totally. HELL YEAH." The word pass punctuates the interjection in the middle
    # ("Hell. Yeah"), which breaks the two-word payoff across two captions. Removing the period lets
    # the pair group normally (both <= 4 chars, 0.12 s apart) and ship as one caption. 2 -> 2 words,
    # both timings preserved.
    (("hell", "yeah"), ["hell", "yeah"]),
    # --- my-new-100x batch, 2026-08-28 (swole-cat-vlad-2021, clip 4) ---
    # "it went from like 200 AND ALL THE WAY TO LIKE 400K". The word pass renders the middle of the
    # run as "and all the real like" ("real" is its LOWEST-confidence token in the clip, p 0.18),
    # which is not English. Settled by decode, not by guess: medium.en on an isolated 7.90-11.30 s
    # window reads "It went from like 200 and all the way to like 400k." and small.en's whole-file
    # pass reads "it went from like 200, all the way to like 400K". 4 tokens -> 4 replacement words
    # with the article folded into the third (the ("ismpmi") -> "ism pmi" class: one TOKEN, two
    # rendered words), so every timing is preserved in place. Keyed on the whole four-token run,
    # which cannot occur legitimately.
    (("all", "the", "real", "like"), ["all", "the", "way to", "like"]),
    # ⛔ The number itself ships as SPOKEN: "200". The batch note guessed "260" (a market cap read
    # off the DexScreener crosshair, which sits at 266.82K on the frame at t = 9 s), but the TAPE
    # says 200 on every one of EIGHT independent decodes - the clip's own word pass (p 0.85),
    # medium.en on 8.30-9.90 / 8.60-9.60 / 7.90-11.30 and with a market-cap initial_prompt, and
    # small.en on 7.20-13.00 / 7.80-12.60 / 8.40-12.20 / whole-file. House rule: never ship a word
    # no 1x pass produced. No correction entry, deliberately.
    # "NOW I DID CHECK THEM TODAY. THIS IS SWOLE. it's fucking crazy." The word pass hears the token
    # sequence as "It's a swallow." (p 0.37 on "swallow", its second-lowest in the clip). Settled by
    # decode: medium.en reads "This is Swole" on 20.90-23.60, on 21.30-23.30 with a Swole-Cat
    # initial_prompt and (as "Swolel") on 21.00-22.90, and small.en hears "as a swole" on
    # 21.20-23.40; the base video's own screen-share at that moment is the X profile "swole cat"
    # @SwoleCatOnLunch / ticker SWOLE, which is the receipt for the spelling. 3 tokens -> 3 words,
    # so all three timings are preserved and the sentence break lands where he actually stops.
    (("its", "a", "swallow"), ["this", "is", "swole"]),
    # "AND THE THING IS THAT VLAD TWEETED ABOUT THIS CHARACTER back in 2021." Two separate misses in
    # one sentence, both settled by decode: medium.en on 23.30-27.90 reads "The thing is that Vlad
    # tweeted about this character back in 2021" and small.en agrees on "this character" in all
    # three of its windows. (1) "is THE vlad" -> "is THAT vlad": 3 -> 3 in place. (2) the word pass
    # drops the determiner before "character" entirely (its p is 0.01, i.e. the model has nothing
    # there), so "about" carries it as one TOKEN rendering two words - again the ("ismpmi") class,
    # because a replacement may never be LONGER than the run it matches. Both keys carry enough
    # context that they cannot fire on another clip.
    (("is", "the", "vlad"), ["is", "that", "vlad"]),
    (("about", "character"), ["about", "this character"]),
    # "maybe it's going to RUG" - the word pass hears "rub" (p 0.33). Mandated by the batch's own
    # caption-fix list (master 1378.7 s) and corroborated by small.en's whole-file pass ("maybe it's
    # gonna rug"); the sentence continues "...because there were two other swole cats on the
    # Robinhood chain four weeks ago that completely failed", so nothing else fits. Keyed on the
    # three-token run so a literal "going to rub" elsewhere is untouched.
    (("going", "to", "rub"), ["going", "to", "rug"]),
    # Market caps render as FIGURES: the thousands "k" arrives as its own token twice in this clip
    # ("400 K" at 10.50-11.24 and 19.26-20.14). Same keyed-pair class as ("900","k") -> "900k" and
    # ("500","k") -> "500k" above; cleanup()'s digit merge only fires on ""/"percent"/"x".
    (("400", "k"), ["400k"]),
    # --- my-new-100x batch, 2026-08-28 (boomer-tokenized-stocks, clip 3) ---
    # THE CHAIN. "it's just ROBINHOOD CHAIN is so new" - this clip's own word pass renders it
    # "Robert chain", and those two tokens carry the LOWEST confidences in the whole clip (0.23 /
    # 0.26, i.e. the model has nothing). The receipt is in the clip's OWN base video: the DEXScreener
    # right rail reads "Robinhood > Uniswap V4" for the first 9 s and again from 44.4 s, and the
    # boomerstocks.com Stockholder Club banner reads "SOLD OUT: 1,000 / 1,000 ON ROBINHOOD MAINNET".
    # VERIFIED 2026-08-28: medium.en on an ISOLATED 53.7-56.0 s window returns "It's just Robinhood
    # Chain is so new" verbatim. NOT a global rule - Robert is a real name - so it is keyed on the
    # ("robert","chain") pair, the same reasoning as the existing ("robber","hood") / ("robin","hood")
    # entries above. 2 tokens -> 2 words, timings preserved.
    (("robert", "chain"), ["robinhood", "chain"]),
    # Same clip, THE MECHANIC: "so, I GUESS, you get randomly distributed tokenized stocks in your
    # wallet". The word pass renders it "so YOU JUST guess you get" (p 0.37 / 0.27), which inverts the
    # sentence - it is not the holder who does the guessing, it is Mike hedging about how the
    # distribution works. VERIFIED 2026-08-28 across FOUR medium.en decodes of this spine: isolated
    # 18.4-22.0 s and 18.3-24.2 s windows and the whole-file pass all return "So I guess you get
    # randomly distributed tokenized stocks", and a word-timestamped 18.3-21.0 s decode puts "I" at
    # 18.96 s and "guess" at 18.98-19.52 s. 4 tokens -> 3 words (the fourth timing is dropped, which
    # is supported). Keyed on the full four-token run so nothing else can match.
    (("so", "you", "just", "guess"), ["so", "i", "guess"]),
    # Same clip, THE HOOK: "IT'S a boring meme of old people, right?" The word pass hears "it was a"
    # (p 0.37 / 0.64) and squeezes "was" into 60 ms, the classic contraction split. VERIFIED
    # 2026-08-28: medium.en on an isolated 4.9-8.4 s window, medium.en whole-file and small.en
    # whole-file ALL return "It's a boring meme of old people, right?" Keyed on the full five-token
    # run rather than a bare ("it","was","a") so a legitimate "it was a boring ..." in some future
    # clip can never match. 5 tokens -> 4 words (the fifth timing is dropped, which is supported).
    (("it", "was", "a", "boring", "meme"), ["it's", "a", "boring", "meme"]),
    # Same clip, TWO PUNCTUATION MARKS THAT CAUSE A 3-FRAME CAPTION FLICKER. Grouping breaks on
    # [.?!], so a full stop the better models do not hear strands one token in its own group; when
    # Whisper has also squeezed that token, the group lands at 0.10 s = 3 frames at 30 fps, which is
    # SHORTER than the shared component's own 12-frame bounce-in, so it renders as a flicker rather
    # than as a caption. Both are corrected to the mark the better decodes actually produce.
    #  - "uh, OKAY, WHAT IS THIS?" The word pass punctuates "okay." as its own sentence and gives it
    #    4.76-4.86 s, i.e. 0.10 s on screen. medium.en whole-file reads "OK, what is this?" and
    #    small.en whole-file "Okay, what is this?" - one clause, comma. With the comma all four
    #    tokens are <=4 chars so they ride ONE group for 0.50 s. 4 -> 4 words, timings preserved,
    #    idempotent (core() strips the mark, so the rule re-matches its own output).
    (("okay", "what", "is", "this"), ["okay,", "what", "is", "this"]),
    #  - "we got in, uh, I DON'T KNOW, WHERE WAS IT? like a hundred and something." Same defect,
    #    worse timings: the word pass gives "don't" a ZERO-WIDTH span (38.68-38.68) and "know." a
    #    20 ms one (38.68-38.70), then breaks on the period, so "know." also shows for 0.10 s.
    #    medium.en whole-file reads "I don't know where was it, like 100 and something", small.en
    #    whole-file the same, and medium.en on an isolated 38.2-41.0 s window reads "I don't know,
    #    what was it" - all three punctuate the hedge with a comma, none with a full stop. 4 tokens
    #    -> 1 MERGED word keeps the whole 38.68-39.08 s span (no timing is invented), so the group
    #    lands at 0.40 s and reads "know, where was it?" on one line.
    (("know", "where", "was", "it"), ["know, where was it?"]),
    # Same clip, A PROFIT CLAIM THE AUDIO DOES NOT MAKE. "we're, UH, but hopefully we're gonna be up
    # like a whole lot more" - this clip's own word pass renders the 180 ms token at 42.00-42.18 s as
    # "up," (p 0.54, its second-lowest confidence in the clip), which puts "we're up" on screen, i.e.
    # a statement about his position that he never makes. SIX independent decodes hear the filler
    # instead: medium.en on isolated 41.6-42.8 s ("We're, uh, but I hope we're gonna-") and 41.3-44.0 s
    # ("We're uh, but hopefully we're gonna be up like a whole lot more"), small.en on 41.3-44.0 s
    # ("We're uh, but hopefully gonna be up like a whole lot more"), medium.en and small.en whole-file
    # passes of the spine, and a medium.en whole-file pass of the FINISHED RENDER. Not one of them has
    # "up" at 42.0; the only "up" any of them hears is the later one at 43.04 ("gonna be UP like a whole
    # lot more"), which the caption keeps. A word-timestamped medium.en decode of 41.3-44.4 s starts the
    # clause at "But" 41.72 s with nothing before it. So the token is the filler FILLER already drops
    # everywhere else, and the abandoned "we're" that precedes it is captioned as the false start it is.
    # 5 tokens -> 4 words (the fifth timing is dropped, which is supported); keyed on the full
    # five-token run so a clip where he genuinely says "we're up, but hopefully we're ..." is safe.
    (("were", "up", "but", "hopefully", "were"), ["we're,", "but", "hopefully", "we're"]),
    # --- tendies batch, 2026-09-03 (doggy-mode-paired-with-tesla, clip 2, the FULL cut) ---
    # ⛔ THE BRAND SPELLING IS `DOGGIE`, AND IT WAS VERIFIED ON THE PICTURE, NOT ASSUMED. Whisper
    # spells the token "doggy" on every one of this clip's 8 occurrences; the project spells it
    # DOGGIE. Receipts, all inside this clip's OWN base video: the DexScreener pair header reads
    # "DOGGIE (i) / TSLA" over "Robinhood > Uniswap v4", the chart title reads "DOGGIE/TSLA (Market
    # Cap) on Uniswap", the transactions table has DOGGIE and TSLA columns plus a "Pooled DOGGIE"
    # row, and the livestream's burned-in chat banner at 30-31 s reads "@SmokingWrench - Doggie coin
    # paired with Tesla" (he is reading that line aloud when he says it). The project's own X banner
    # is on disk as schedule-tweets/images/reference/doggie-mode.jpg and says "$DOGGIE  $TSLA".
    # This is a SPELLING fix, not a casing one, so it IS visible: the montserrat preset lowercases
    # via CSS, and "doggy" vs "doggie" differ in the letters.
    # Each occurrence is keyed on its NEIGHBOURS rather than going into CORRECTIONS as a global
    # \bdoggy\b rule, because "doggy" is a real English word and a bare rule would corrupt a future
    # batch that genuinely says it (the same reasoning that keeps ("think","cast") -> kaspa out of
    # CORRECTIONS). 2 or 3 tokens -> the same count, rewritten in place.
    (("into", "doggy"), ["into", "doggie"]),            # "but now I got into doggie."      5.68-6.38 s
    (("so", "doggy", "mode"), ["so", "doggie", "mode"]),  # "so doggie, doggie mode."       6.38-7.94 s
    (("had", "doggy", "mode"), ["had", "doggie", "mode"]),  # "we had doggie mode pump"    13.26-14.34 s
    (("holy", "doggy", "coin"), ["holy", "doggie", "coin"]),  # "doggie coin paired..."    27.60-29.28 s
    (("this", "doggy", "meme"), ["this", "doggie", "meme"]),  # "this doggie meme has..."  38.78-39.80 s
    (("doggy", "is", "paired"), ["doggie", "is", "paired"]),  # "doggie is paired w/ tesla" 47.30-48.22 s
    # "yeah, I like Doggie. ARE THEY IN CoinMarketCap? I doubt it." - this spine SPLICES two
    # livestream segments together right after "doggie" (master 1003.47 -> 1022.55), and the word
    # pass renders the whole opening of the second segment as the single token "other" (32.10-32.50),
    # which ships the nonsense caption "i like doggy other coinmarketcap". THREE independent decodes
    # of this clip's own audio hear the question: medium.en isolated 31.6-33.8 -> "Are they in
    # CoinMarketCap? I doubt it."; small.en isolated 31.6-33.8 -> "Are they on coin market cap? I
    # doubt it."; medium.en 30.2-35.5 -> "Yeah, I like doggy. Are they in coin market cap? I doubt
    # it. Yes, they are." Written as ONE 6-token rule because a separate ("like","doggy") rule would
    # consume the tokens first and this could then never match. 6 tokens -> 4 words (the "market"
    # and "cap" timings are dropped, which is supported).
    # THE PUNCTUATION IS LOAD-BEARING, not decoration. Grouping breaks only on a cap overflow, a
    # >0.45 s gap, or a [.?!], and these six tokens are contiguous with no gap. Measured in
    # ariblk.ttf at the comp's 74 px: "are they in coinmarketcap?" is 1126 px against a 980 px
    # caption box, so any replacement that leaves it as one group WRAPS to two lines across the
    # zone seam. The "..." forces the break, and it also lands the split on the right frame: he says
    # "are they in" over 32.10-32.50 and "coin market cap" over 32.50-33.36, so "coinmarketcap?"
    # comes up at 32.50 exactly as he starts saying it and holds 0.88 s (the 6-word alternative put
    # it at 33.10 for 0.28 s, a flash). The "." after "doggie" is real (end of the pre-splice
    # sentence); the "?" is spelled in so the tail-carry leaves it alone.
    (("like", "doggy", "other", "coin", "market", "cap"),
     ["like", "doggie.", "are they in...", "coinmarketcap?"]),
    # Multiples are ALWAYS captioned as digits, and this one IS the clip's title line ("for me
    # that's like a FOUR OR FIVE X almost"). cleanup()'s numeric merge only fires on a literal digit
    # token, so the spelled-out form needs a phrase rule - the documented ("a","thousand","x") ->
    # "1000x" pattern. 4 tokens -> 1 word MERGES the whole 19.42-20.22 s span. Keyed on the full run
    # so a bare "five" / "four" elsewhere is never rewritten.
    (("four", "or", "five", "x"), ["4-5x"]),
    # "I'm not trying to FUD good, but I think this doggie meme has more potential than Good in the
    # Hood." This clip's shipped word pass renders the verb as "find", which is not English here
    # ("not trying to find good"). FOUR decodes of the same audio disagree with it and three of them
    # give the crypto verb: large-v3 isolated 35.4-38.2 -> "I'm not trying to fud good, but I think
    # I"; medium.en isolated 35.2-38.4 -> "I'm not trying to fud good, but I think, I think..."; the
    # medium.en whole-file pass -> "fight"; tight 35.6-37.9 windows garble the fricative into an
    # obscenity that is plainly not the word (the sentence continues "...but I think this doggie meme
    # has more potential", i.e. he is disclaiming FUD about the rival token he is about to rank
    # lower). The batch's own clip-plan already documents this speaker's "spread fun" -> "spread FUD"
    # mishear in the same livestream. Keyed on the three-token run.
    (("to", "find", "good"), ["to", "fud", "good"]),
    # "GOOD is just paired with WRAPPED ETH" - Whisper renders the ticker as "eath" here and "teeth"
    # on the whole-file pass. Neither is a word; the pair is on screen in this clip's own base video
    # (the GOOD/WETH DexScreener chart, 43.5-47 s). Same class as the batch's documented "wrapped
    # east" -> wrapped ETH note.
    (("wrapped", "eath"), ["wrapped", "eth"]),
    # --- tendies batch, 2026-09-03 (my-plays-run-to-a-billion, clip 4, the FULL cut) ---
    # THE HOOK, "most of my phenomenal plays are not, WITH LIKE, degen plays." FOUR decodes of this
    # clip's own audio (medium.en on isolated 0.0-4.5 and 0.5-6.5 s windows, large-v3 on 1.5-4.3 and
    # 0.0-7.0 s, small.en whole-file, medium.en whole-file) ALL render the stray "with", so it is
    # genuinely spoken - a stumble mid-phrase, not a mishear. It is dropped as the filler it is,
    # which is the readability call captions.md method step 3 sanctions ("captions are NOT 1:1 with
    # audio"), and it lands the line on Mike's own approved 4b title, "My Phenomenal Plays Are Not
    # Degen Plays." Keyed on the FULL four-token run (through "degen") so a legitimate "not with
    # like ..." in a future clip can never match. 4 tokens -> 3 words: the fourth timing is dropped,
    # which is supported, and it only moves "degen" 0.28 s early inside its own sentence.
    (("not", "with", "like", "degen"), ["not", "like", "degen"]),
    # THE PAYOFF MULTIPLE, "it's gonna be an over a billion market cap, it's gonna be ANOTHER 100X
    # for me." Every decoder hears "another hundred EXTRA for me" (this clip's word pass, large-v3 on
    # 39.6-41.6 s -> "going to be another 100 extra for me", small.en and medium.en whole-file), which
    # is not English. "hundred extra" is this speaker's /ks/ + schwa on "hundred X", and the batch's
    # own clip-plan lists it in stt_caption_fixes ("another hundred extra for me" -> "another 100x for
    # me", master 2030.32-2031.34). There is already PRECEDENT for exactly this mishear from the same
    # speaker: ("a","hundred","extra","me") -> ["100x","from","here."] above. That rule cannot fire
    # here because "for" sits between "extra" and "me", so this run needs its own key. 3 -> 2 words.
    (("another", "hundred", "extra"), ["another", "100x"]),
    # DeAgentAI, the Sui project his alert bot called. Whisper splits it into "deagen" + ".ai" and
    # the decoders disagree wildly on it (large-v3 isolated 53.2-56.4 -> "the agent AI", small.en
    # whole-file -> "D-Agent AI", medium.en whole-file -> "d-agent AI"). The receipt is in this
    # clip's OWN base video: at 44 s the Crypto Rich winners ticker strip reads "AIA +12660.5% 127x",
    # and at 55 s - exactly while he says this line - he text-highlights the 127x / +12660.5% row of
    # the Top Performing Assets table. AIA is DeAgentAI's ticker, and the project's X profile badge
    # is on disk as schedule-tweets/images/reference/DeAgentAI.png. 2 tokens -> 1 MERGED word keeps
    # the whole 54.18-54.94 s span. Unlike a casing fix this IS visible: the montserrat preset
    # lowercases via CSS, so only the letters reaching the screen change.
    (("deagen", "ai"), ["deagentai"]),
    # ...WHO IS ON SUI. The word pass spells the chain "suey."; medium.en whole-file reads "who is on
    # Sui". Keyed on the pair rather than a global \bsuey\b rule because "chop suey" is a real phrase.
    # The trailing "." is carried automatically onto the replacement.
    (("on", "suey"), ["on", "sui"]),
    # "runners getting launched right now on BNB, BASE." The word pass hears the chain as "Bakes.";
    # medium.en whole-file reads "on BNB, base" and both small.en whole-file and a medium.en decode
    # of an isolated 62.6-68.8 s window read "on BNB based". Base is the chain, and "bakes" is not a
    # word in this catalogue. Keyed on the pair so a literal "bakes" elsewhere is untouched. The
    # comma on "bnb," is spelled in (only the LAST token's punctuation is carried automatically).
    (("bnb", "bakes"), ["bnb,", "base"]),
    # THE CLOSING HYPE, "when all those FOUR-YEAR CYCLE ZOMBIES start buying back in." The word pass
    # renders the noun as "cycles on me", which is meaningless. Two medium.en decodes of isolated
    # windows (68.4-75.6 and 70.0-74.6 s) and the medium.en whole-file pass all read "four year cycle
    # zombies", the batch's clip-plan quotes the peak beat with "four-year cycle zombies", and it is
    # this speaker's standing term for late buyers. Keyed on the four-token run INCLUDING the
    # following "start" so the trigram can never fire on unrelated speech; the ("four","year") ->
    # "four-year" rule above has already merged the two tokens before it by the time this matches
    # (apply_phrases runs to a fixpoint). 4 tokens -> 3 words.
    (("cycles", "on", "me", "start"), ["cycle", "zombies", "start"]),
    # --- tendies batch, 2026-09-03 (tendies-crypto-com-ath, clip 3, the FULL cut) ---
    # THE TITLE FACT, "we had TENDIES getting listed on Crypto.com." The shipped word pass renders
    # the token as "10 days" - the SAME mishear early-crash's tendies-funny-stupid clip hit, which is
    # why ("theres","10","days") -> "there's tendies" already exists above. Two decodes of THIS
    # clip's own audio disagree with the word pass and both say the coin name: medium.en on an
    # isolated 4.4-10.0 s window reads "We had Tendi's getting listed on crypto.com." and the
    # medium.en whole-file pass reads "We had Tendi's getting listed on crypto.com." too. Keyed on
    # FOUR tokens ("we had 10 days") rather than the bare pair, for the reason the sibling rule
    # documents: "10 days" IS a real English phrase and a bare ("10","days") pair would corrupt a
    # future clip. 4 tokens -> 3 words (the 4th timing is dropped, which is supported); the drop
    # leaves a 0.48 s hole before "getting", which breaks the caption group exactly where a clean
    # 2-token merge would have, so the emitted chunks are identical either way.
    (("we", "had", "10", "days"), ["we", "had", "tendies"]),
    # "...listed on CRYPTO.COM. TENDIES. Hell yeah, man." The spine SPLICES livestream segment 0 to
    # segment 1 at 9.48 s (a -81.6 dB trough, confirmed by both the RMS scan and a content-zone scene
    # cut), and the word pass renders the whole first word of segment 1 as the two tokens "and"
    # + "these" (9.48-10.80), shipping the nonsense caption "crypto.com and these hell yeah". Two
    # decodes hear the coin name there: medium.en on an isolated 9.2-13.6 s window reads "Tendi's
    # hell yeah man" and the medium.en whole-file pass reads "...crypto.com. Tendi's. Hell yeah,
    # man." Written as ONE 4-token rule anchored on "crypto"+"com" because ("and","these") is one of
    # the commonest bigrams in English and could never be a rule on its own. 4 tokens -> 3 words:
    # "crypto" and ".com." keep their own timings (the emit-time whitespace-before-punctuation rule
    # joins them into "crypto.com." on screen, as it already did before this rule), "tendies." takes
    # the "and" slot so it comes up at 9.48 s exactly on the splice, and the dropped 4th timing lets
    # it hold to 10.80 s where "hell" starts. The spelled-in "." on ".com." is load-bearing: grouping
    # breaks only on a cap overflow, a >0.45 s gap or a [.?!], and without it "crypto.com tendies."
    # is one 2.66 s caption instead of two well-paced ones.
    (("crypto", "com", "and", "these"), ["crypto", ".com.", "tendies."]),
    # "...but it was a nice pump. HOW'S TENDIES DOING?" The word pass renders the first word of the
    # segment-2 -> segment-3 splice (19.12 s, a -240 dB digital silence) as "test.", welding it onto
    # the previous sentence and then opening the next caption on the fragment "tendis doing,". Two
    # decodes read the question: medium.en on an isolated 19.0-24.2 s window reads "How's Tendi's
    # doing? Oh, I got it in my watch list right here. Up 70% for the day." and the medium.en
    # whole-file pass reads "...it was a nice pump. How's Tendi's doing?". 4 tokens -> 4 words, all
    # timings preserved. Keyed with "tendies" inside the run (the single-token \btendis\b ->
    # "tendies" correction in CORRECTIONS has already fired by the time phrases run), so no
    # unrelated clip can match. The "." on "pump." and the "?" on "doing?" break the groups on the
    # two real sentence ends.
    (("pump", "test", "tendies", "doing"), ["pump.", "how's", "tendies", "doing?"]),
    # "HOLY CROCAMOLE." - his own coinage (croc + guacamole), the reaction to the new all-time high.
    # The word pass renders it as the four tokens "holy crock, i'm only," which is not English. Two
    # decodes of this clip's own audio agree it is one word: medium.en on an isolated 33.4-37.2 s
    # window reads "Holy crocamole! Oh my god, man." and medium.en on 30.8-35.4 s reads "...new
    # all-time high holy crock-a-moly". The batch's clip-plan already documents this speaker's
    # "holy quack holy guacamole" -> "holy guac, holy guacamole" in the same livestream, and its
    # stt_caption_fixes says to KEEP the "croc" as heard rather than sanitising it to "holy crap" -
    # which "crocamole" does. 4 tokens -> 2 words MERGE nothing (an N-word replacement rewrites in
    # place), so "crocamole." takes the "crock," slot at 34.08 s and the two dropped timings let it
    # hold to 35.34 s where "oh my god" starts.
    (("holy", "crock", "im", "only"), ["holy", "crocamole."]),
    # THE PAYOFF NUMBER, "the high is 37.5, 37 million." He is hovering the ATH candle and the
    # DexScreener OHLC line burned into this clip's own picture at 38 s reads
    # "O 27.80M H 37.55M L 25.88M C 36.92M" - i.e. the HIGH really is 37.55M. The word pass splits
    # the spoken digits into "37," + "537", which renders as the meaningless "the high is 37, 537
    # million". The medium.en whole-file pass reads "The high is thirty seven five. Thirty seven
    # million." and medium.en on an isolated 37.4-42.6 s window reads "The high is 37.5 million."
    # The batch clip-plan's stt_caption_fixes specifies this caption as "37.5, 37 million".
    # 3 tokens -> 3 words, all timings preserved. THE "." AFTER 37.5 IS LOAD-BEARING and is exactly
    # how the whole-file decode punctuates it ("The high is thirty seven five. Thirty seven
    # million."): the word pass gives "537" a 1.44 s span (39.98-41.42) because a real 0.11 s pause
    # at 40.04-40.15 sits INSIDE that one token, so neither the word caps nor the 0.45 s gap break
    # can split the run and the group would otherwise hold ONE caption for 3.10 s of continuous
    # speech. The period breaks it into "the high is 37.5." / "37 million.", which also matches the
    # delivery. Using punctuation instead of --max-secs keeps the invocation at the historical
    # defaults.
    (("37", "537", "million"), ["37.5.", "37", "million."]),
    # "oh, it was RETRACING. THIS RETRACING." - PUNCTUATION ONLY, the four words are exactly as the
    # word pass heard them and all four timings are preserved in place. Without the added periods the
    # run groups as ONE caption, "retracing this retracing.", which MEASURES 984 px in ariblk.ttf at
    # the comp's 74 px against a 1080 - 2x50 = 980 px caption box, i.e. it wraps to two lines across
    # the zone seam - the only caption in this clip that overflows. The periods split it into
    # "retracing." (420 px) and "this retracing." (600 px), which also matches the delivery (he says
    # it twice, as two beats). Deliberately NOT rewritten to the whole-file decode's "it's
    # retracing, it's retracing": the "was" token in this pass is ZERO LENGTH (24.38-24.38 s), so any
    # rewrite that shifts words across it lands two words on the same timestamp and desyncs the pair.
    (("was", "retracing", "this", "retracing"), ["was", "retracing.", "this", "retracing."]),
    # --- tendies batch, 2026-09-03 (artificial-inu-is-the-king-impact, clip 6, the IMPACT cut) ---
    # "That was yesterday. THAT WAS CRAZY." The shipped small word pass renders the verb as "is",
    # which puts the $20M buy order in the present tense one sentence after he has just placed it in
    # the past ("that was yesterday"). FOUR decodes of this clip's own audio say "was" and the two
    # that say "is" are both low-confidence: medium.en whole-file reads "That was crazy.", large-v3
    # on an isolated 6.1-9.0 s window reads " was" with p=0.88, large-v3 on an isolated 6.9-8.6 s
    # window reads "That was crazy." and medium.en on the same window reads "That was crazy!";
    # against that, large-v3's whole-file pass reads " is" at p=0.56 and the small word pass (which
    # is what ships) has no per-word probability worth quoting. The batch clip-plan's own summary of
    # this beat also quotes "that was crazy". Keyed on FOUR tokens INCLUDING the preceding
    # "yesterday", never on the bare ("that","is","crazy"): "that is crazy" is an extremely common
    # English phrase and a 3-token rule would corrupt a future clip. 4 tokens -> 4 words, all
    # timings preserved in place. THE "." ON "yesterday." IS SPELLED IN because only the LAST
    # matched token's punctuation is carried automatically - without it the sentence break is lost
    # and "that was yesterday that was" welds into one caption.
    (("yesterday", "that", "is", "crazy"), ["yesterday.", "that", "was", "crazy"]),
    # --- tendies batch, 2026-09-03 (hayes-flipped-eth-flips-btc, clip 5, the FULL cut) ---
    # A MULTIPLE RANGE IS ALWAYS ONE TOKEN, "3-5x", never "3 to 5x" - the same normalisation the
    # sibling rule ("four","or","five","x") -> ["4-5x"] performs for clip 2 of this very batch, and
    # the same house convention as ("a","thousand","x") -> "1000x" above. cleanup()'s numeric merge
    # only fires on a digit + a bare unit token, so a range spelled across three tokens needs a
    # phrase rule. It is NOT keyed on neighbours because, unlike "10 days" or "i was like", the run
    # "3 to 5x" has exactly ONE meaning in this catalogue (a multiple range) and there is no
    # sentence in which merging it could be wrong. This clip says it twice: "expecting a potential
    # 3 to 5x move" (6.68-7.90, him reading the Cointelegraph post aloud, whose own text on screen
    # reads "a potential 3x to 5x move") and "you think Ethereum is going to go to 3 to 5x,"
    # (17.72-18.44). 3 tokens -> 1 word MERGES the whole span (first .t -> last .end), so the
    # caption holds exactly as long as the spoken range, and it matches the number on the clip's own
    # code-drawn Arthur Hayes stat card ("ETH: 3-5X") and Mike's 4b title line.
    (("3", "to", "5x"), ["3-5x"]),
    # --- biggest-bullrun batch, 2026-09-06 (fiat-debasement-minimum-wage-house, clip 1) ---
    # "they have like a decent degree, ENGINEERING DEGREE, who knows?" The clip's own shipped word
    # pass is the ONLY decode that hears the repeated token "engineer, engineer" there; large-v3 on
    # an isolated 31.80-35.60 s window, medium.en on three staggered isolated windows and medium.en's
    # whole-file pass all read "engineering degree" (see the PROTECTED_DOUBLES entry, which is what
    # keeps the pair alive long enough for this rule to fire). 4 tokens -> 4 words, rewritten in
    # place, so both spoken words keep their own timing. Keyed with the words on both sides
    # ("decent DEGREE engineer engineer WHO knows") so it can only ever match this run.
    (("degree", "engineer", "engineer", "who"), ["degree,", "engineering", "degree,", "who"]),
    # "now, like IT MAKES ME think of this boomer coin on Robinhood that I have, right?" The shipped
    # word pass renders it "like I made me think", which is not English (the doubled object pronoun
    # gives it away). FOUR decodes of this spine agree the verb is "makes": medium.en on isolated
    # 9.40-11.80 and 9.00-12.40 s windows ("now that makes me think" / "now, that kind of makes me
    # think"), small.en on 9.40-11.80 ("now, it like, it makes me think") and medium.en's whole-file
    # pass ("now, like it makes me think"). The pronoun is taken from the two decodes that keep the
    # "like" ("it"), not from the two that replace the whole run with "that". 4 tokens -> 4 words in
    # place. "like i made me" is not a phrase in any catalogue, so the key cannot misfire.
    (("like", "i", "made", "me"), ["like", "it", "makes", "me"]),
    # "it's kind of nuts, which, you know, WHICH LED US to Bitcoin, which was the reason why Bitcoin
    # was made." The shipped word pass inserts a spurious "was" between the restarted "which" and
    # "led" (56.60 "which" / 56.72 "was" / 56.96 "led"), producing the ungrammatical caption "which
    # was led us to bitcoin". FOUR decodes read it without that "was": large-v3 on an isolated
    # 54.40-60.00 s window ("which, you know, which led us to Bitcoin"), medium.en on 54.40-60.00,
    # 55.20-59.60 and 55.40-58.20, and medium.en's whole-file pass. The batch tighten plan flags the
    # same run ("'which was led us to bitcoin' is probably 'which is what led us to Bitcoin'"); no
    # decode of this spine hears "is what", so only the spurious auxiliary is removed and nothing is
    # invented. 3 tokens -> 1 replacement word MERGES the span (56.60 -> 56.96), which
    # is the only way to drop a token in this tool, and the replacement RENDERS as two words exactly
    # like ("ismpmi") -> "ism pmi". The FIRST "which was," (55.60-55.98) is deliberately left alone:
    # it is his real restart and reads fine.
    (("which", "was", "led"), ["which led"]),
    # --- biggest-bullrun batch, 2026-09-06 (fiat-debasement-minimum-wage-house-IMPACT, clip 4) ---
    # "But we got a ROCKY ROAD, man." The clip's own shipped word pass invents a word that is not in
    # the audio, "rocky HOOK, rocky" (hook = 9.34-9.58), because he aborts the first syllable of
    # "road" and restarts: medium.en on an isolated 8.2-12.4 s window of this spine transcribes the
    # aborted syllable literally as "But we got a rocky ho- rocky road, man." FOUR other decodes of
    # this exact spine read the phrase with NO extra noun: medium.en on 7.8-11.8, large-v3 on
    # 7.6-12.6, and both models' whole-file passes, all "But we got a rocky road, man." The batch
    # clip-plan quotes the same line as "But we got a rocky road, man". A false noun on screen is
    # worse than a dropped restart (captions are not 1:1 with audio; readability wins - see the
    # cleanup() stutter collapse), so the aborted syllable is merged away: 3 tokens -> 1 replacement
    # word MERGES the span (9.10 -> 10.20), which is the only way this tool can drop a token, and
    # "road," keeps its own timing right after it. Keyed on the doubled "rocky" so it can only match
    # this restart; "rocky hook rocky" is not a phrase in any catalogue.
    (("rocky", "hook", "rocky"), ["rocky"]),
    # SAME CLIP, the HARD-OUT: "just because everything WILL be so goddamn cheap." This clip's own
    # word pass reads "would" (26.06), and so does large-v3's whole-file pass, but SEVEN decodes with
    # real context say "will": medium.en on FOUR staggered windows of this spine (24.0-27.81,
    # 24.6-27.81, 25.0-27.81, 23.0-27.81), large-v3 on THREE (24.0-27.81, 24.6-27.81, 25.0-27.81),
    # and - the decisive cross-check - both models on the SIBLING clip 1 spine, which is the SAME
    # audio cut differently ("...just because everything will be so goddamn cheap", 72.8-76.46),
    # whose own shipped word pass ALSO reads "will" (74.64). Clip 1 shipped "will" for this line.
    # He genuinely mixes tenses here ("...the job WOULD be able to afford ... just because everything
    # WILL be so cheap"); the captions ship what is spoken, not what is grammatically tidy. 4 tokens
    # -> 4 words rewritten IN PLACE, so every timing survives. Keyed on both neighbours
    # ("EVERYTHING would be SO") so it can only ever match this construction; no other clip in the
    # batch contains the run at all.
    (("everything", "would", "be", "so"), ["everything", "will", "be", "so"]),
    # --- biggest-bullrun batch, 2026-09-06 (youtube-10x-discord-100x, clip 2) ---
    # ⛔ NOT A RULE, ON PURPOSE. The clip's first token is a 0.24 s fragment that the shipped small
    # word pass renders as "like". A first pass rewrote it to "for" on the strength of large-v3 and
    # medium.en on ONE isolated 0.0-4.2 s window. It was REVERTED on 2026-09-06 after re-verifying on
    # this clip's own audio with SIX more decodes (large-v3 / medium.en / small.en on 0.00-3.20 and
    # 0.00-2.20 s): every one of them opens on "Anybody who knows me" with NO word in front of it,
    # and the only things any decode invents there are medium.en's hard-cut hallucinations ("I got
    # that", "I think I got it"). So there is no positive evidence for "for", "like" IS Mike's
    # habitual discourse opener and appears all over this same clip, and the shipped pass heard it.
    # The caption ships as spoken and as transcribed: "like anybody who knows me".
    # "the insider alert scans the markets and CALLS GOOD COINS, right?" The word pass hears "points".
    # THREE decodes of this spine say "coins": large-v3 and medium.en on an isolated 14.0-19.6 s
    # window and medium.en's whole-file pass, and the batch clip-plan quotes the line as "calls good
    # coins". Keyed on the preceding verb, never on the bare ("good","points"): "good points" is
    # ordinary English and a 2-token rule would corrupt a future clip. 3 tokens -> 3 words in place.
    (("calls", "good", "points"), ["calls", "good", "coins"]),
    # "I REMEMBER when I started making this software." The word pass emits the non-phrase "I'm room"
    # for the 0.26 s run at 18.58-18.84. Four decodes read "I remember": large-v3 and medium.en on an
    # isolated 17.8-23.4 s window, medium.en on 9.8-16.2 (which overlaps the phrase) and medium.en's
    # whole-file pass. 3 tokens -> 3 words in place.
    (("im", "room", "when"), ["i", "remember", "when"]),
    # ⛔ NOT A RULE, ON PURPOSE. "a gigantic green bubble AND crypto bubbles" reads oddly and the site
    # on this clip's own screen-share is literally titled CRYPTO BUBBLES, so a first pass rewrote the
    # conjunction to "in" on the strength of large-v3. It was REVERTED on 2026-09-06 after
    # re-verifying with six decodes on two staggered windows (31.20-34.40 and 30.60-35.00 s): FOUR of
    # them (medium.en x2, small.en x2) read "and" and only large-v3 x2 reads "in". Meaning argued for
    # "in"; the audio did not. Captions follow the audio, and the house style preserves his casual
    # speech, so it ships as spoken.
    # "INSIDER ALERT CALLED Mars coin." The word pass renders the three words as "inside earlier
    # cold", which is not a phrase in any language. medium.en's whole-file pass reads "Insider Alert
    # called Mars coin", medium.en on an isolated 39.4-46.0 s window reads "Inside earlier I called
    # Mars coin" and large-v3 on the same window reads "Inside earlier, cold Mars coin" - i.e. the
    # models agree on the shape and only the whole-file pass resolves it. The clip-plan and the
    # tighten plan both name this segment "the insider alert called Mars coin", and the bot is called
    # the Insider Alert everywhere else in this same clip (14.88-15.60 s, captioned correctly there).
    # 3 tokens -> 3 words in place.
    (("inside", "earlier", "cold"), ["insider", "alert", "called"]),
    # "it's like 180 million right now. SO IT'S CRAZY." The word pass inserts a 0.38 s "This is and"
    # between "now" and "it's crazy" (49.50-49.88). No other decode has it: medium.en's whole-file
    # pass reads "It's like 180 million right now. So it's crazy.", and large-v3 and medium.en on an
    # isolated 46.6-53.6 s window both read "It's like $180 million right now. It's crazy." 6 tokens
    # -> 3 words: "now." keeps its own 48.92-49.16 slot and the three junk timings are dropped, which
    # is supported, so the surviving "it's" (49.88) and "crazy" (50.18) are untouched. The "." is
    # spelled in because grouping breaks on it and the sentence really does end there.
    (("million", "right", "now", "this", "is", "and"), ["million", "right", "now."]),
    # ⛔ NOT A RULE, ON PURPOSE - and this is the clearest case in the batch of an INHERITED fix that
    # the clip's own audio refuses. Both upstream plans specify "within the quantity" -> "with the
    # quantity" (clip-plan stt_caption_fixes at master ~941 and the tighten plan's caption notes),
    # and a first pass applied it because "within the quantity of centralized exchanges it was
    # getting" is not English. It was REVERTED on 2026-09-06 after re-verifying with word timings on
    # two staggered windows (49.30-52.60 and 48.90-53.20 s): SIX decodes out of six read "within",
    # large-v3 at p=0.98 and p=1.00, and the token measures 0.38-0.44 s, i.e. TWO syllables, not one.
    # That is not an ambiguous unstressed syllable - he says "within". The upstream fixes were
    # authored off the MASTER transcript, not off this cut, and this one is simply wrong for it.
    # "that's what it needs. WHAT IS IT, 29 at this point?" - he is counting the exchange rows on his
    # own screen. The word pass reads "Was a 29"; medium.en on an isolated 56.8-63.8 s window reads
    # "Uh, what is it? 29 at this point?", large-v3 on the same window reads "uh what is a 29 at this
    # point" and medium.en's whole-file pass reads "What is it, 29 at this point?". The batch
    # delegation flagged exactly this line for confirmation. 4 tokens -> 4 words in place; the middle
    # replacement carries two words in one slot (same device as ("good","for","meme")), and the "."
    # on "needs." is spelled in so the sentence break is not lost.
    (("needs", "was", "a", "29"), ["needs.", "what", "is it,", "29"]),
    # "it GOT BINANCE, like, today. it's unreal." cleanup()'s hyphen-continuation merges the word
    # pass's "brain" + "-ashed" into the single token "brain-ashed" (61.72-62.20), so this rule is
    # keyed on the merged core. FOUR decodes of this spine produce a NON-WORD here and never converge
    # ("Got Bayonets like today" medium.en 60.0-66.6, "got brain hashtag today" large-v3 60.0-66.6,
    # "Got brain asked today" medium.en whole-file, "Got brain ash like today" large-v3 60.4-64.4),
    # which is the signature of a mishear rather than a real word. The evidence for Binance is
    # documentary and visual: the batch tighten plan removes the false start 961.08-964.75 s of the
    # master with the note "false start 'it's you know it's on Binance right'; the emphatic repeat
    # 'got Binance, like, today, it's unreal' carries it", the clip-plan independently quotes "got
    # Binance today, it's unreal", and this clip's own base video has the coin's CoinMarketCap
    # Markets table on screen at that moment with Binance as exchange rows 1, 2 and 4. 3 tokens -> 3
    # words in place.
    (("got", "brainashed", "like"), ["got", "binance", "like"]),
    # "some of my MEMBERS got it. that's what's good, right?" This one WAS re-verified against the
    # clip's own audio on 2026-09-06 (its two sibling inherited fixes were reverted on the same pass,
    # see the blocks above) and it SURVIVED: on two staggered windows with word timings
    # (69.20-72.00 and 68.60-72.60 s), large-v3 reads "members" twice (p=0.48 / 0.73) and small.en
    # reads "members" twice (p=0.94 / 0.64); only medium.en reads "numbers" (p=0.81 twice). That is
    # FOUR decodes for "members" against two, with the strongest model on the "members" side. The
    # semantics agree - "some of my numbers got it" is not a sentence anyone says, and the very next
    # lines are "my public subscribers... but my Discord members" - and both upstream plans specify
    # the same fix (clip-plan stt_caption_fixes at master ~984-985, tighten plan caption notes), but
    # the fix now rests on THIS cut's audio, not on the master transcript. 4 tokens -> 4 words in
    # place.
    (("some", "of", "my", "numbers"), ["some", "of", "my", "members"]),
    # "so if WE'RE PRIVATELY up in my Discord 10x" - the word pass inserts a spurious 0.12 s "a"
    # between them. large-v3 and medium.en on an isolated 80.6-87.4 s window and medium.en's
    # whole-file pass all read "if we're privately up in my Discord". 3 tokens -> 1 replacement MERGES
    # the span (82.28 -> 83.54) and RENDERS as two words, the same device as ("which","was","led").
    (("were", "a", "privately"), ["we're privately"]),
    # "we're up around this DEFI PLAY" - the word pass renders the term as the non-word "d5". Three
    # decodes read DeFi (large-v3 and medium.en on an isolated 76.6-83.0 s window, medium.en
    # whole-file) and the batch clip-plan and tighten plan both specify "d5 play" -> "DeFi play".
    # 2 tokens -> 2 words in place; the montserrat preset renders it lowercase as "defi play".
    (("d5", "play"), ["defi", "play"]),
    # --- biggest-bullrun batch, clip 7 `kaspa-fud-high-explosion`, 2026-09-06 ---
    # "This year's ROBINHOOD, next year's KASPA?" - the chat line Mike reads on the hook. This
    # spine's word pass renders the brand as the non-word pair "Robo Herd" (p=0.15 / 0.57) and
    # large-v3 reads "rob with her"; medium.en's whole-file pass and large-v3's whole-file pass
    # BOTH read "Robin Hood" / "Robyn", and the base video settles it documentarily - the
    # livestream's burned-in chat banner is on screen for the whole hook reading
    # "@Tayvian-e9p: this year is robinhood and next year is kas". 2 tokens -> 1 merged word,
    # keeping the whole 0.84-1.34 s span. Keyed on the pair so no real "herd" is touched.
    (("robo", "herd"), ["robinhood"]),
    # ...and the second half of that same line. This spine renders Kaspa as a bare " Cas." (p=0.50)
    # at 2.36-2.42; large-v3 reads "cast"/"Cas" and the whole-file passes read "Casper"/"Cas by"
    # (the later, clearer occurrences arrive as "Caspa" and are already handled by the shared
    # `caspa -> kaspa` CORRECTION). Keyed on the PRECEDING "year's" exactly like the existing
    # ("think","cast") / ("wish","cast") pairs, because a bare cas rule would corrupt a real
    # word (and "cast" is a Farcaster term of art) in a future batch. 2 tokens -> 2 words in place;
    # the trailing "." rides onto "kaspa" so the sentence break survives into grouping.
    (("years", "cas"), ["year's", "kaspa"]),
    # "fair launch, proof of work, zero insider UNLOCKS" - he is reading his own X poll card aloud.
    # small.en hears "locks"; large-v3 (two independent windows) and medium.en's whole-file pass all
    # read "unlocks", AND the card itself is on screen in the base video at that moment, saying
    # verbatim "zero insider unlocks". NOTE the batch clip-plan's stt_caption_fixes proposes
    # "insider allocation" here: that is WRONG for this cut and is deliberately not applied - it is
    # neither what he says nor what the receipt behind him says. 2 tokens -> 2 words in place.
    (("insider", "locks"), ["insider", "unlocks"]),
    # --- biggest-bullrun / clip 8 `coin-about-farts-devs-funding`, 2026-09-06 ---
    # Five mishears VERIFIED on THIS clip's own audio with staggered windowed decodes (medium.en +
    # large-v3, 2-4 windows each; the whole-file small.en pass that produced the spine's
    # whisper-words.json is the ONLY source that reads them the broken way). Every key is long enough
    # that it cannot fire on a sane English sentence in another batch.
    #
    # "not sure if you bought the dip, BUT IT'S BACK AT 100." small.en hears "what is back at her".
    # medium.en and large-v3 BOTH return "but it's back at 100." on two independent wide windows
    # (21.8-24.4 and 21.6-25.8). The "." is written into the replacement so the sentence break
    # survives into grouping (the next token "I" butts against it with a 0.00 s gap).
    (("what", "is", "back", "at", "her"), ["but", "it's", "back", "at", "100."]),
    # He points at the chart bottom after 3.05 s of dead air: "RIGHT HERE. THAT'S WHAT I called it."
    # small.en hears "I hear this one. I". Four decodes agree (medium.en + large-v3 over 31.3-34.1
    # and 31.6-33.6, plus small.en/medium.en over 28.2-32.4). The trailing "I" is IN THE KEY on
    # purpose: it is the only way to stop apply_phrases' tail-carry from moving the "." off "one."
    # onto "what", which would print a period mid-sentence and split the caption after "what".
    (("i", "hear", "this", "one", "i"), ["right", "here.", "that's", "what", "i"]),
    # "hooker has even more centralized exchanges AND HAS utility behind her." small.en hears "and
    # as". medium.en says "has" on both windows (34.6-37.4, 35.4-37.6) and large-v3 says "has" on
    # one; "and as utility" is not a sentence anyone finishes this way. Keyed on the preceding
    # "exchanges" so a genuine "and as utility grows" in a future batch is untouched.
    (("exchanges", "and", "as", "utility"), ["exchanges", "and", "has", "utility"]),
    # "so it's NOT A RANDOM MEME." small.en hears "mean". medium.en and large-v3 both return "a
    # random meme" on 37.0-41.8. Keyed with "not a" in front so a statistician's "random mean" can
    # never match.
    (("not", "a", "random", "mean"), ["not", "a", "random", "meme"]),
    # "I thought it WAS A JOKE MEME, send nudes." small.en hears "was got joke me"; "got joke me" is
    # not English. medium.en reads "a joke meme" verbatim on 41.2-44.3 and both models agree on the
    # "a". The line's whole point is meme-vs-real-project, which he restates twice in the next 10 s.
    (("was", "got", "joke", "me"), ["was", "a", "joke", "meme"]),
    # "in fact it's NOT A FUNNY meme at all" - he stumbles "fun" into "funny" on the last line. Not a
    # duplicate-token stutter, so cleanup()'s collapse cannot see it. medium.en and large-v3 both read
    # "not a funny meme at all" on two windows (47.4-52.92, 50.5-52.92). 4 tokens -> 3 drops the
    # stumble and keeps "funny" on the "fun" onset, which is when he actually starts the word.
    (("not", "a", "fun", "funny"), ["not", "a", "funny"]),
    # ...and the seventh, found by whisper-verifying the FINAL RENDER (SKILL row 7). "It's not just a
    # funny meme. IT'S NOT EVEN... In fact, it's not a funny meme at all." The whole-file small.en
    # pass hears "No, it's not" over 49.34-49.88 s and it is the ONLY source that does: three
    # independent (model, window) pairs - small.en and large-v3 over 49.20-50.10 and medium.en over
    # 49.34-49.90 - all return "it's not even" (two of them prefixed "you know,", which will not fit
    # in three tokens and is therefore dropped rather than invented). The clean caption-vs-render
    # decode flagged this as the single remaining mismatch in 166 caption words. Keyed on the
    # "meme" before and the "in" after so a genuine "no, it's not" in another batch can never match;
    # the replacement carries "meme." with its period so the sentence break survives into grouping.
    (("meme", "no", "its", "not", "in"), ["meme.", "it's", "not", "even", "in"]),
    # ...and an EIGHTH, from the same render-verify pass. "The only thing THAT WILL get me to buy
    # this" - the whole-file small.en pass drops the "that" entirely and emits only "thing will get",
    # which reads ungrammatically on screen. ALL NINE re-decodes (small.en, medium.en and large-v3 x
    # three windows: 10.4-14.2, 10.6-13.4, 10.9-12.8) contain the "that"; 6 of 9 read "that will",
    # 3 read "that would". A correction can never be LONGER than the run it matches, so the two words
    # ride in ONE token exactly like the existing ("like","doggy",...) -> "are they in..." rule does.
    # Keyed on "only thing will get", which is not a grammatical English sequence, so it cannot fire
    # on a real phrase in another batch.
    (("only", "thing", "will", "get"), ["only", "thing", "that will", "get"]),
    # --- batch kaspa / clip 2 `some-things-dont-die`, 2026-09-10 -----------------------------
    # "all these, A LOT OF memes in particular". small.en emits the false start and the phrase
    # welded together as "all these lot of memes", which is not English. large-v3 on the same
    # window (4.4-7.0 and 4.0-11.5) reads "Everybody's fighting on all these things, all these,
    # a lot of memes in particular" - i.e. "all these" is a FALSE START he abandons and restarts
    # as "a lot of". A correction can never be longer than the run it matches, so the false start
    # is DROPPED rather than punctuated (cleanup() already drops fillers/false starts; readability
    # wins, captions are not 1:1). 3 tokens -> 2 leaves "a lot of memes in particular".
    # Keyed on "all these lot", which is not a grammatical English sequence, so it cannot fire on
    # a real phrase (the same clip's earlier "on all these things" does NOT match).
    (("all", "these", "lot"), ["a", "lot"]),
    # "beat their ALL-TIME HIGH again" - small.en hears "whole time high". Confirmed by the clip's
    # own clip-plan stt_caption_fixes entry ("whole time high" -> "all-time high", ~395, clip 2)
    # and by the medium.en whole-file pass. 3 tokens -> 2 (the surplus token is dropped by the
    # zip in _apply_phrases_once, which is how every shortening rule here works).
    (("whole", "time", "high"), ["all-time", "high"]),
    # "you would have spent $10,000 or something like that" - Whisper splits the figure into TWO
    # tokens, "$10" + ",000", exactly like the existing ("50","000") -> "$50,000" rule from the
    # my-new-100x batch. Left alone it renders on screen as "$10 ,000" and the group break lands
    # inside the number. core() strips the "$" and the comma, so the key is ("10","000").
    (("10", "000"), ["$10,000"]),
    # "if you put like A HUNDRED DOLLARS into Bitcoin" -> "$100". House rule, same as the existing
    # ("a","thousand","dollars") -> ["$1,000"]: money and market caps render as FIGURES, not words.
    (("a", "hundred", "dollars"), ["$100"]),
    # --- kaspa batch, 2026-09-10 (foxy-linea-swift-bet, clip 5) ---
    # "I give it its due because it's the mascot of the Linea chain". This clip's word pass renders
    # the idiom as "I give it TO IT'S due" (10.88-12.18: i / give / it / to / it's / due), which is
    # not English and reads as a transcription fault on screen. The clip-plan's own notes flag it
    # by name ("'I give it to it's due' = I give it its due"), and the medium.en decode of the
    # 10.6-12.6 window reads "I give it its due". core() strips the apostrophe, so the 4th token's
    # core is "its"; the key is therefore ("give","it","to","its") and the 4-token run is rewritten
    # to 3 (the surplus token is dropped by the zip in _apply_phrases_once, the standard shortening
    # shape here - a correction may never be LONGER than the run it matches). Keyed on the
    # ungrammatical "give it to its" so it can never fire on a real phrase.
    (("give", "it", "to", "its"), ["give", "it", "its"]),
    # --- kaspa batch, 2026-09-10 (tao-20000-not-unrealistic, clips 3 / 7) ---
    # THE OPENING PRICE ANCHOR, "a 10X is a $2,600 TAO". This clip's own small word pass WELDS the
    # multiple into one non-word token, "Tenex" (0.00-0.50 s), so the caption opened on "tenex is a
    # $2,600 tao" - a garble in the very first caption of the short. VERIFIED against the same audio:
    # medium.en reads "TENX" on isolated 0-3 / 0-4 / 0-6 s windows and "TANX" on the whole-file pass,
    # i.e. every decoder hears "ten X"; the clip-plan quotes the line as "a 10x is a $2,600 TAO".
    # Multiples are always captioned as digits in this repo (see ("two","x") -> "2x" above), so the
    # fix is "10x". Keyed on the FOLLOWING "is" rather than as a global \btenex\b CORRECTION because
    # TENEX is a real DEX name and a bare rule would corrupt a future clip that actually means it.
    # 2 tokens -> 2 words, so no timing is invented: the article "a" he speaks is absorbed into the
    # welded token exactly as Whisper welded it.
    (("tenex", "is"), ["10x", "is"]),
    # THE CLOSING QUESTION, "...whatever it's going to BE, IS 100x for TAO unrealistic?" The word
    # pass renders the pivot as a stutter run, "be / is / like / is" (41.10-42.62 s), with the
    # second "is" stretched to 0.78 s - so the caption read "is like is 100x for" on screen, which
    # is not a sentence. The stray "like" IS spoken (a verbal tic mid-pivot) and the doubled "is" is
    # a stumble, not a persona doubling; captions.md method step 3 sanctions collapsing exactly this
    # for readability. Keyed on the four-token run THROUGH "be" so it can only fire on this pivot,
    # and rewritten to the ONE token "be is": a 1-word replacement MERGES the run and keeps its whole
    # span (41.10 -> 42.62), which means the following "100x" keeps its own true 42.62 timing instead
    # of being pulled 0.78 s early - the shape a 4-tokens-to-3-words rewrite would have produced.
    (("be", "is", "like", "is"), ["be is"]),
    # THE TWO PRICE FIGURES of this clip arrive as SPLIT tokens - Whisper emits the thousands comma
    # as its own token ("$2" + ",600" at 0.84-1.46 s, "$20" + ",000" at 3.20-3.86 and 26.48-27.34).
    # cleanup()'s numeric merge only fires on ""/"percent"/"x", so money needs a phrase rule; the
    # ("1","500") -> "$1,500" entry above is the same fix from an earlier batch. Merging also makes
    # the figure ONE colourable token: without it, --colorize can only match the "$20" half and the
    # caption renders a yellow "$20" welded to a white ",000". core() strips the "$" and the comma,
    # so the keys are the bare digit pairs; a 1-word replacement merges and keeps the whole span.
    (("2", "600"), ["$2,600"]),
    (("20", "000"), ["$20,000"]),
    # --- kaspa batch, 2026-09-10 (kaspa-10-cents-vs-3-dollars-impact, clip 6) ---
    # THE HOOK LINE. The clip's own small word pass renders "not even going to get ALL past his all
    # time high", which is not English and puts a stray 0.42 s "all" (4.94-5.36) between "get" and
    # "past". medium.en on TWO isolated windows of this exact spine (0.0-7.0 and 3.5-9.0) both read
    # "not even going to get past this all-time high" - no "all" before "past" in either - and the
    # batch clip-plan quotes the master the same way. So this is one keyed rewrite of the whole run:
    # it DROPS the spurious token and hyphenates the compound the same way the existing
    # ("whole","time","high") -> ["all-time","high"] rule does (the clip-plan's own
    # stt_caption_fixes mandates "all-time high"). Keyed on all seven tokens THROUGH "get ... his"
    # so it can only fire on this sentence; a genuine "get all past" elsewhere is untouched. 7 -> 5.
    (("get", "all", "past", "his", "all", "time", "high"),
     ["get", "past", "his", "all-time", "high"]),
    # "He says it's not even going to go past 10 CENT." Singular, and it is the number the whole
    # clip argues against, so it is on screen as the punch. Both medium.en windows read "10 cents";
    # the clip-plan's stt_caption_fixes lists "10 cent" -> "10 cents" by name for clips 1 and 6.
    # cleanup()'s numeric merge only fires on ""/"percent"/"x", so a bare "cent" needs a phrase rule
    # (same class as the ("at","a","half","of","a","set") -> "cent" entry above). Keyed THROUGH the
    # preceding "go past" so a genuine "10 cent" elsewhere is untouched. 4 -> 4, timings all kept.
    (("go", "past", "10", "cent"), ["go", "past", "10", "cents"]),
    # THE HARD-OUT. "I'm a Kas- ... Kaspa maxi." He restarts the word: the pass emits "Caps"
    # (20.06-20.06... actually 19.74-20.06) immediately followed by "Casper" (-> kaspa, 20.06-20.66),
    # and medium.en on 18.0-21.0 reads the same shape ("I'm a Cap's Casper Maxi"). The clip-plan
    # quotes the master as "I'm a Kaspa Maxi", so the first limb is a truncated false start, NOT a
    # word. The stutter-collapse can never catch it (the two tokens are not equal after correction),
    # so it needs a keyed rule. Keyed THROUGH the preceding "a" so it can only fire on this line.
    # 3 -> 2: the replacement keeps "kaspa" and drops the fragment.
    (("a", "caps", "kaspa"), ["a", "kaspa"]),
    # --- silver batch, 2026-09-11 (zombies-fomo-back-in-at-the-top, clips 1 and 5) ---
    # "because of a RATE hike and people getting scared." The clip's own pass renders it "rain
    # hike" (4.96-5.50 s on clip 1's spine); the clip plan lists 'raid hike' -> 'rate hike' as a
    # mandated caption-time STT fix. Keyed on "hike" so a literal "rain" elsewhere is never touched.
    (("rain", "hike"), ["rate", "hike"]),
    (("raid", "hike"), ["rate", "hike"]),
    # --- silver batch, 2026-09-11 (kaspa-not-fading-away, clip 2) ---
    # "mentions from people like Matt HOUGAN" (Bitwise CIO). Both small and medium.en hear
    # "Matt Hogan"; the clip plan mandates the fix. Keyed through "matt" so a literal Hogan
    # elsewhere is never touched.
    (("matt", "hogan"), ["matt", "hougan"]),
    # "other people might be learning about Kaspa that never heard of IT before." Both models
    # hear "heard of her before" (13.56-14.36 / 42.94-43.56 on clip 2's spine); a coin is "it".
    # Keyed through "heard of ... before" so a real "her" elsewhere is never touched. 4 -> 4.
    (("heard", "of", "her", "before"), ["heard", "of", "it", "before"]),
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
    # uptober/golden-kitty-50-million (clip 5), 2026-10-01. "That is gonna be like a BIG, BIG pump." The
    # clip's peak beat (clip-plan peak_beats): an intensifier doubling, not a stutter. medium.en renders
    # "a big, big pump" on the 11-18.5 AND 14.5-21.5 windows; two full tokens (17.00-17.20 / 17.20-17.42).
    # Keyed with the words on both sides so a genuine "big big" stutter elsewhere still collapses.
    ("a", "big", "big", "pump"),
    # uptober/no-job-is-safe-robots (clip 3), 2026-10-01. "we're in for like an unimaginable future, a
    # REALLY, REALLY, like an unimaginable future." An intensifier doubling, not a stutter: medium.en
    # renders "a really really" on the whole clip, two full tokens (23.48-23.74 / 23.74-24.02), and the
    # tighten plan deliberately left the restatement in. The collapse shipped "a / really / like an".
    # Keyed with the words on both sides so a genuine "really really" stutter elsewhere still collapses.
    ("a", "really", "really", "like"),
    # beer-and-kaspa/first-vprog-live-on-kaspa (clip 3), 2026-09-27. "I think it's REALLY, REALLY
    # bullish for Kaspa." The clip's peak beat (clip-plan peak_beats): an intensifier doubling, not a
    # stutter. medium.en renders "really, really bullish" on the whole file; the two limbs are full
    # tokens (19.90-20.16 / 20.16-20.38). The collapse shipped "it's really, bullish". Keyed with the
    # words on both sides so a genuine "really really" stutter elsewhere still collapses.
    ("its", "really", "really", "bullish"),
    # golden-kitty-dominance/golden-kitty-only-meme-doing-anything (clip 1), 2026-09-25. "155,000 in
    # real gold. That's VERY, VERY attractive." An intensifier doubling, not a stutter: medium.en
    # renders "very, very" on the whole file AND on the isolated 34.5-47.0 window, two full tokens
    # (40.64 / 40.98). The collapse shipped "that's very, attractive." (limb 1's comma, limb 2 gone).
    # Keyed with the words on both sides so a genuine "very very" stutter elsewhere still collapses.
    ("thats", "very", "very", "attractive"),
    # archie-promo/archie-dumped-if-before-october (clip 1), 2026-09-24. "if you know MORE, MORE, MORE
    # people are gonna be coming into the market" - an emphatic TRIPLE (3.46-5.16, each limb a full
    # 0.4-0.6 s token), not a stutter. Keyed on both overlapping pairs so all three limbs survive.
    ("know", "more", "more", "more"),
    ("more", "more", "more", "people"),
    # perpspad/kaspa-ran-57-off-a-level-i-thought-was-impossibl (clip 3), 2026-09-14. "and make a
    # REAL, REAL comeback, man." The clip's punchline: an emphasis doubling, not a stutter. MEASURED on
    # this spine: "real" 32.02-32.62 and "real" 32.62-33.00 are two full tokens in one voiced run, and
    # medium.en renders the line "make a real, real comeback, man" on the whole file and on the
    # isolated 30.8-34.4 window. The collapse shipped "and make a real / comeback man", which flattens
    # the payoff the whole clip builds to. Keyed with the words on both sides ("a real real comeback")
    # so a genuine "real real" stutter elsewhere still collapses.
    ("a", "real", "real", "comeback"),
    # kaspa/kaspa-10-cents-vs-3-dollars (clip 1), 2026-09-10. "a MULTI, MULTI trillion dollar market
    # cap." An intensifier doubling, not a stutter: the two limbs are separated by a real 0.12 s
    # trough (34.62 -> 34.74) and the first carries its own comma, which is exactly how he stacks
    # "multi" to make the number feel bigger. The collapse ate the second limb and shipped "with a
    # multi trillion dollar market cap", which flattens the clip's own scale argument. Keyed with the
    # words on BOTH sides ("a multi multi trillion") so a genuine "multi multi" stutter elsewhere
    # still collapses.
    ("a", "multi", "multi", "trillion"),
    # my-new-100x/profit-flywheel-bull-run clip 2 (the FULL cut), 2026-08-28. "this bull run, THIS,
    # THIS freaking bull run." NOT a stutter to collapse: it is Mike's emphasis doubling on the
    # pivot line of the clip, and the clip's tighten plan removed the OTHER doublings in this same
    # clip BY NAME (a doubled "and and" stall at master 2071.96 and a doubled "last," at 2123.58)
    # while deliberately leaving this one uncut, so the audio says it twice. MEASURED on this spine:
    # "this," 35.98-36.24 and "this" 36.24-36.52 are two real tokens butted with zero gap, inside a
    # continuous voiced run (the nearest trough is the 35.415-35.754 s digital silence BEFORE them).
    # The collapse's output was worse than either alternative - it ate the second limb but kept the
    # FIRST limb's comma, shipping a caption that read "this, freaking bull". Keyed with the words on
    # both sides ("bull RUN, this this FREAKING") so a genuine "this this" stutter elsewhere still
    # collapses.
    ("run", "this", "this", "freaking"),   # "this bull run, THIS, THIS freaking bull run" 35.08-37.32 s
    # my-new-100x/packed-my-new-100x (clip 1), 2026-08-28. NOT an emphasis doubling: this spine
    # SPLICES two livestream segments together at 59.38 s, so the "one" that ends segment 8
    # ("...except for this one." 1946.10-1949.14 s) is immediately followed by the "One" that OPENS
    # segment 9 ("One of my sell orders was right at the top" 1970.00 s). They are two different
    # words 0.60 s apart in two different sentences; collapsing the second one produces "except for
    # this one of my sell orders", which inverts the meaning of both. Keyed on the full five-token
    # run across the seam so no real stutter is spared.
    ("for", "this", "one", "one", "of"),
    ("use", "use", "an", "app"),            # eliza/phantom-hack 66.62-67.48 s
    ("dont", "dont", "use", "a", "chrome"),  # eliza/phantom-hack 68.64-69.64 s
    # early-crash/akita-3b-robinhood, both listed as KEPT persona doublings in the clip's tighten
    # plan (the audio was deliberately left uncut, so the captions must not undo it):
    ("was", "down", "down", "down", "down"),  # "it WAS DOWN, DOWN, DOWN, DOWN" 19.46-20.62 s
    ("is", "akita", "akita", "inu"),          # "this is AKITA, AKITA INU" 11.32-12.86 s
    # tutorial/94x-euphoria (clips 1 + 6), 2026-08-09. The cold open IS the repetition: "now look at
    # this man. LOOK AT, LOOK AT THIS. LOOK, LOOK. holy crap." The clip took ZERO tighten removals
    # and its plan says in terms: "do NOT dedupe 'look at, look at this, look, look' or 'holy crap',
    # the repetition IS the clip." Only the final adjacent pair is at risk (the earlier ones
    # alternate with "at" and survive), so the run is keyed with the words on both sides of it.
    ("this", "look", "look", "holy"),         # "look at this. LOOK, LOOK. holy crap" 3.26-5.28 s
    # tutorial/94x-euphoria clip 1 (the FULL cut), 2026-08-09. NOT a stutter: two different
    # sentences butt against each other across a 0.22 s pause, "look at THIS. THIS one actually
    # makes a lot of sense." The collapse ate the second "This" and shipped a caption reading
    # "one actually makes", which opens the clip's second sentence on a dangling word. Keyed with
    # the words on both sides so a genuine "this this" stutter elsewhere still collapses.
    ("at", "this", "this", "one"),            # "look at THIS. THIS one actually" 6.28-7.50 s
    # tutorial/freaking-early-not-degen clip 4 (the FULL cut), 2026-08-09. The clip's tighten plan
    # lists this under "PRESERVED DEVICES, do not re-cut and DO NOT DEDUPE IN CAPTIONS" and records
    # that the line "that's, that's the degen mindset. I don't really. [0.8s] I don't really trade
    # like that." survives 100% verbatim, i.e. the audio was deliberately left uncut. The collapse ate
    # the second "that's" and shipped "you know, that's / the degen mindset", losing the stammer that
    # lands the clip's TITLE line. Keyed with the words on both sides ("you KNOW, that's that's THE")
    # so a genuine "that's that's" stutter elsewhere still collapses. Keyed on "dj"? No: the run stops
    # at "the", because PROTECTED_DOUBLES is matched in cleanup(), BEFORE apply_phrases() rewrites
    # ("the","dj","mindset") -> ("the","degen","mindset").
    ("know", "thats", "thats", "the"),        # "you know, THAT'S, THAT'S the degen mindset" 6.50-7.20 s
    # tutorial/robinhood-meme-rankings clip 2 (the FULL cut), 2026-08-09. "What If is MY, MY favorite."
    # The clip's tighten plan lists this under "KEPT VERBATIM BY DESIGN, do not dedupe in captions"
    # (segment 0 takes NO content removals at all), and the doubling is MEASURED on this spine at 5 ms
    # RMS: "my" 8.025-8.335, an 80 ms TRUE silence at 8.455-8.535, "my" 8.550-8.660, another silence,
    # then "favorite" 8.780-9.065. The collapse ate the second "my" and shipped "is my favorite",
    # flattening the one hesitation that sells the #1 pick. Keyed with the words on both sides
    # ("what if IS my my FAVORITE") so a genuine "my my" stutter elsewhere still collapses.
    ("is", "my", "my", "favorite"),           # "what if is MY, MY favorite" 7.90-9.07 s
    # tutorial/doginme-100x-if-500x clip 5 (the FULL cut), 2026-08-10. THE DOUBLED HARD-OUT, protected
    # by name in the run contract (master 4571.88-4574.84) and the last thing the viewer hears:
    # "Craziness, craziness, man. Good times ahead. Good times ahead." MEASURED on this spine at 5 ms
    # RMS: "craziness" 36.60-37.13, a 60 ms articulatory trough, then the second "craziness"
    # 37.20-37.70 - two full utterances, deliberately left uncut (the clip's tighten plan takes NO
    # removal anywhere in this segment). The collapse ate the second one and shipped a single
    # "craziness, man", which flattens the ending the whole clip builds to. The other three protected
    # doublings in this clip need NO entry, verified on the built array: "I got that dog in/with me",
    # "isn't it reasonable" and "100X from here" are never ADJACENT repeats, and neither is the
    # "good times ahead" pair (the second "good" follows "ahead"). Keyed with the word after the pair.
    ("craziness", "craziness", "man"),        # "CRAZINESS, CRAZINESS, man." 36.60-37.92 s
    # last-year/meme-fud-130x clip 1 (the FULL cut), 2026-08-11. The clip's tighten log names its
    # kept persona doublings in terms - "Doubling kept on purpose (persona): 'velvet velvet', 'this
    # this thing', 'and then and then', 'just from last year, just from last year'" - i.e. the audio
    # was deliberately left uncut, so the captions must not undo it. Only the first two are ADJACENT
    # repeats and therefore at risk; verified on the built array, "and then and then" survives the
    # tighten as a single "and then" in this clip's own pass, and the "just from last year" pair is
    # never adjacent. Both keys carry the words on both sides so a genuine stutter elsewhere still
    # collapses. All four decodes of this clip (its own pass, the MASTER, medium.en on an isolated
    # 41.60-45.30 s and large-v3 on 41.60-45.40 s) return "Velvet. Velvet is pumping too, right?".
    ("here", "velvet", "velvet", "is"),       # "look at here VELVET, VELVET is pumping" 42.20-43.60 s
    ("yeah", "this", "this", "thing"),        # "yeah, THIS THIS thing is flying" 49.16-50.06 s
    # last-year/kitsu-vlads-dog clip 3 (the FULL cut), 2026-08-11. "the name sounds the same. KITSU,
    # KITSU, KITSU. very good chart." The repetition IS the point of the beat - he is savouring how
    # close the new coin's name sits to the 2021 token he just charted - and it is three ADJACENT
    # repeats, so the collapse would eat two of them and ship a bare "kitsu". Verified as three
    # separate utterances on this spine (82.02-82.40, 82.54-82.88, 82.94-83.20, with true troughs
    # between) and all three measured as Kitsu, not Kishu (frication centroids 4090/4499/5764 Hz vs
    # this speaker's own Kishu references at 3460/3429 Hz). Keyed with the words on both sides so a
    # genuine "kitsu kitsu" stutter elsewhere still collapses.
    ("same", "kitsu", "kitsu", "kitsu", "very"),   # "the name sounds the SAME. KITSU, KITSU, KITSU. VERY good chart" 82.02-83.20 s
    # johnny/johnny-cash-button clip 1 (the FULL cut), 2026-08-12. THREE triple-repeats, and every one
    # of them is the clip: it is built around the "going down, down, down" lyric of the song he is
    # threatening to play. All three are ADJACENT repeats, so the stutter collapse would eat two
    # thirds of each and leave a bare "down"/"burns". None is a stutter - each is a separate sung or
    # spoken utterance with a real trough between (measured at 0.10 s RMS on this spine: 0.42-0.88 /
    # 1.12-1.38 / 1.68-1.74, 46.54-47.02 / 47.02-47.78 / 47.02-47.78, 50.80-51.04 / 51.04-51.58 /
    # 51.86-52.18). The clip's tighten plan takes NO removal anywhere near them, i.e. the audio was
    # deliberately left uncut, and the SONG span is protected by a scoped build directive
    # (clip-plan.json -> four_b_verdicts.build_directives 'protect-johnny-cash-music'). Each key
    # carries the word on both sides so a genuine "down down" stutter elsewhere still collapses.
    ("going", "down", "down", "down", "oh"),   # the HOOK, sung: "GOING DOWN, DOWN, DOWN. oh my god" 0.00-1.98 s
    ("went", "down", "down", "down", "and"),   # the SONG: "I went DOWN, DOWN, DOWN. and the flames" 45.56-48.06 s
    ("it", "burns", "burns", "burns", "the"),  # the SONG: "and it BURNS, BURNS, BURNS. the ring of fire" 50.80-53.44 s
    # johnny/duck-vs-peanut clip 2 (the FULL cut), 2026-08-12. Both entries are the same defect class
    # as ("at","this","this","one") above: NOT a stutter, but a restatement that STARTS THE NEXT
    # CLAUSE, so collapsing it strands a caption with no subject.
    #  - "whereas with peanut, the squirrel. PEANUT, PEANUT WAS a squirrel that had a social media
    #    presence." Both tokens are full utterances on this spine (27.08-27.48 and 27.52-28.02, i.e.
    #    0.40 s and 0.50 s, far longer than any true stutter blip in this clip). The collapse ate the
    #    second one and shipped "the squirrel peanut," / "was a squirrel", which puts a verb on
    #    screen with nothing in front of it. Keyed with the words on both sides.
    ("squirrel", "peanut", "peanut", "was"),   # "the SQUIRREL. PEANUT, PEANUT WAS a squirrel" 26.78-28.76 s
    #  - "so that produced outrage. SO THAT, THAT IS WHAT caused peanut to go flying." The collapse
    #    ate the second "that" and shipped "so that, is what caused", i.e. a comma followed by a bare
    #    verb. Keyed with the words on both sides so a genuine "that that" stutter still collapses.
    ("so", "that", "that", "is", "what"),      # "SO THAT, THAT IS WHAT caused peanut" 45.40-46.46 s
    # cooper-50x/pmi-never-before clip 7, 2026-08-15. The clip's ENTIRE payoff is the escalation:
    # "it's going to be very interesting, VERY, VERY, VERY interesting stuff." Three ADJACENT repeats,
    # so the stutter collapse eats two of them and ships a flat "very interesting stuff". Not a
    # stutter: three separate stressed utterances with real troughs between them, measured at 5 ms RMS
    # on this spine (11.72-11.98, 11.98-12.34, 12.34-12.46), and the MASTER pass reads the same three
    # tokens at p 0.64/0.95/0.75 on uncut audio. The clip takes no tighten removal anywhere in this
    # sentence, i.e. the audio was deliberately left uncut. Keyed with the word on both sides
    # ("INTERESTING, very very very, INTERESTING") so a genuine "very very" stutter still collapses.
    ("interesting", "very", "very", "very", "interesting"),
    # cooper-50x/two-billies clip 8, 2026-08-15. "so market cap on BILLY, BILLY, the dog on Solana."
    # NOT a stutter: he names the token, pauses, then names it again as he points at the second one,
    # which is the whole premise of the clip (there are two of them). Measured on this spine: "Billy"
    # 10.26-10.58, a 0.12 s gap, "Billy" 10.70-10.94, both at p=0.99 on the shipped pass. The collapse
    # would eat the second limb and flatten the setup for the title joke. Keyed with the words on both
    # sides ("ON billy billy THE") so a genuine "billy billy" stutter elsewhere still collapses.
    ("on", "billy", "billy", "the"),
    # cooper-50x/two-billies clip 8, 2026-08-15. The live discovery IS the product: "or is this the
    # wrong Billy? OH NO, NO, this is the wrong Billy." Two separate stressed utterances (10.26 ms
    # apart on this spine: "no" 4.02-4.16, gap, "no" 4.26-4.38, p 0.70/0.91), and the clip takes no
    # tighten removal anywhere in that sentence. Collapsing it flattens the moment the joke lands.
    # Keyed with the words on both sides ("OH no no THIS").
    ("oh", "no", "no", "this"),
    # cooper-50x/two-billies clip 8, 2026-08-15. "so right now is what is 1.1, 1.1 MILLION." He says
    # the number, pauses on it, then says it again as he lands the sentence. Both limbs are stretched
    # and separated (1.1 at 14.48-15.86, 1.1 at 15.86-16.64 after the decimal halves are merged into
    # one token each), so collapsing the pair does not shorten the caption at all: it just leaves ONE
    # group parked on screen for 2.74 s of continuous speech. Keyed with the words on both sides
    # ("IS 1.1 1.1 MILLION") so a genuine number stutter elsewhere still collapses.
    ("is", "11", "11", "million"),
    # cooper-cheerleaders/dog-on-robinhood-full clip 1, 2026-08-18. THE PAYOFF CHANT, and the whole
    # reason the clip exists: "and if it's Cooper, we're going to be freaking rich. IF IT'S COOPER,
    # COOPER, COOPER." MEASURED on this spine, the three limbs are three separate utterances with
    # real troughs between them (34.06-34.30, 34.52-34.78, 34.94-35.30 s), i.e. a deliberate chant
    # left uncut by the tighten pass, not a stutter. cleanup()'s ADJACENT collapse would eat limbs 2
    # and 3 and ship a flat "if it's cooper", killing the chant the title is built on. Keyed with the
    # words on both sides ("IT'S cooper cooper cooper YEAH") so a genuine "cooper cooper" stutter in
    # some other clip still collapses, and so the EARLIER single "if it's Cooper" at 31.54-32.02 s
    # cannot match.
    ("its", "cooper", "cooper", "cooper", "yeah"),
    # cooper-cheerleaders/kaspa-more-than-5x-full clip 2, 2026-08-18. THE HOOK PAYOFF: chat lowballs
    # Kaspa at 5x and he answers "I don't think so. I think in the long run it's gonna be a MUCH,
    # MUCH higher." Not a stutter: "much, much" is a fixed English intensifier, and the two limbs are
    # separated by a MEASURED 25 ms articulatory trough on this spine (5 ms RMS: 6.985-7.010 s, min
    # -49 dB, with a second trough at 7.260-7.310 s before "higher"). The clip takes no tighten
    # removal inside the sentence. Collapsing the pair strands "gonna be a much higher" on screen,
    # which flattens the one line the whole short is answering the chat with. Keyed with the words on
    # both sides ("BE A much much HIGHER") so a genuine "much much" stutter elsewhere still collapses.
    ("be", "a", "much", "much", "higher"),
    # back-in-ny/sold-cooper-rest-stop clip 1, 2026-08-25. THE THESIS, and the doubling the build
    # contract protects by name: "this is the whole thing that I've been saying the whole time, this
    # whole time, that OCTOBER, OCTOBER is probably gonna be green." The two limbs are two separate
    # stressed utterances, MEASURED on this spine at 5 ms RMS: limb 1 runs 68.54-69.30 and limb 2
    # 69.38-70.08, with a real articulatory trough between them (69.30-69.37, -23 -> -41 dB) and a
    # 520 ms pause in front (68.00-68.52, floor -64 dB). The clip takes no tighten removal anywhere
    # in the sentence, i.e. the audio was deliberately left uncut. cleanup()'s ADJACENT collapse
    # would eat limb 2 and flatten the line the whole rotation rests on. Keyed with the two words
    # AFTER the pair so a genuine "october october" stutter elsewhere still collapses - and note the
    # clip's OTHER October doubling, "if October, if October is not green" (83.20/84.42 s), needs no
    # entry and gets none: its limbs are separated by "if", so they are never adjacent.
    ("october", "october", "is", "probably"),
    # everything-will-pump/dead-memes-comeback-impact clip 7, 2026-08-27. Same defect class as
    # ("at","this","this","one") and ("so","that","that","is","what") above: NOT a stutter, but a
    # restatement that STARTS THE NEXT SENTENCE, so collapsing it strands a caption with no subject.
    # "I'm not getting into that. THAT looks like a rug." The collapse ate the second "that" and
    # shipped a caption reading "into that looks" / "like a rug so we", i.e. "I'm not getting into
    # that looks like a rug", which is not English and loses the clip's whole hook line (it is said
    # twice on purpose: 2.08 s and 4.66 s). MEASURED on this spine at 5 ms RMS: limb 1 decays from
    # -19 dB to a 75 ms trough at 3.770-3.845 s with a -71.7 dB floor, then limb 2 onsets hard at
    # 3.845 s (-15 dB) - a real articulatory separation, not a blip. Two independent decodes of an
    # isolated 2.0-5.4 s window agree on two tokens, and small.en punctuates them as two sentences
    # ("into that. That looks like a rug."). The clip takes ZERO tighten removals and its filler
    # pass is passthrough, i.e. the audio was deliberately left uncut. Keyed with the words on both
    # sides ("INTO that that LOOKS") so a genuine "that that" stutter elsewhere still collapses.
    ("into", "that", "that", "looks"),
    # everything-will-pump/october-zombies-impact clip 6, 2026-08-27. THE PAYOFF, and the clip's
    # title: the whole 14 s builds to "it's gonna be very soon. It's gonna be VERY, VERY soon."
    # The escalation from one "very" to two IS the ending, so cleanup()'s ADJACENT collapse would
    # eat the second limb and ship the identical caption twice ("very soon." / "very soon"), which
    # reads as a duplicated line rather than as him leaning in. Not a stutter: MEASURED on this
    # spine at 5 ms RMS the two limbs are separate stressed utterances (13.140-13.360 and
    # 13.380-13.640, with a real articulatory trough at 13.640-13.660 dipping to -32 dB), the MASTER
    # word pass reads them at p 1.00/0.98 on uncut audio (891.76-892.20 s), medium.en on an isolated
    # 11.5-14.0 s window returns verbatim "It's going to be very soon. It's going to be very, very
    # soon.", and the clip's tighten plan takes ZERO removals anywhere in this spine (removals: []),
    # i.e. the audio was deliberately left uncut. Keyed with the words on both sides ("BE very very
    # SOON") so a genuine "very very" stutter elsewhere still collapses, and so the EARLIER single
    # "very soon" at 12.02-12.60 s cannot match.
    ("be", "very", "very", "soon"),
    # everything-will-pump/october-zombies-wealth-transfer clip 1, 2026-08-27. THE HOOK: "there are
    # going to be some MAJOR, MAJOR PUMPS in October" - the doubling is the whole scale claim and it
    # is the first thing the viewer hears. Two full utterances, MEASURED on this spine (25 ms RMS /
    # 5 ms hop): "major," ~3.42-3.75 and "major" ~3.84-3.92, with a real 60 ms trough between them
    # (3.760-3.820, floor -31 dB) and another in front of "pumps" (3.955-4.040, floor -46 dB); the
    # clip takes no tighten removal in the sentence, i.e. the audio was deliberately left uncut.
    # medium.en on an isolated 0.0-5.0 s returns "some major major pumps in
    # October", so both limbs are there. cleanup()'s ADJACENT collapse would eat the second one and
    # flatten the hook to "some major pumps". Keyed with the words on both sides so a genuine
    # "major major" stutter elsewhere still collapses.
    ("some", "major", "major", "pumps"),
    # everything-will-pump/dead-memes-comeback-receipts clip 2, 2026-08-27. TWO doublings, both
    # MEASURED as separate utterances on this spine (10 ms RMS / 5 ms hop), and each one is the beat
    # it sits on:
    #  - "so VELVET, VELVET, I called in July of last year." The two limbs are separated by 95 ms of
    #    DIGITAL SILENCE (48.100-48.195 s, floor -92 dBFS): two full namings of the project with a
    #    real pause between them, not a stutter blip, and the clip's tighten plan takes no removal
    #    anywhere in the sentence. Corroborated by small.en on isolated 46.5+6.5 s and 42.0+6.2 s
    #    windows, both of which return "So velvet velvet I called in July of last year". The
    #    ADJACENT collapse would eat limb 2 and flatten the moment the clip's second project is
    #    named. Keyed with the words on both sides ("SO velvet velvet I") so a genuine "velvet
    #    velvet" stutter elsewhere still collapses, and so the last-year batch's existing
    #    ("here","velvet","velvet","is") entry stays independent of this one.
    ("so", "velvet", "velvet", "i"),
    #  - "I called it like WAY, WAY, WAY down here." Three stressed limbs (13.12-13.56 / 13.56-13.88
    #    / 13.88-14.16 s, each with its own /w/ onset dip in the 10 ms-RMS trace), and the emphasis
    #    IS the receipt: he is pointing at the very bottom of the chart he called. Confirmed by
    #    small.en on an isolated 10.0+6.0 s window ("I called it like way way way down here"). The
    #    collapse would eat two of the three and ship a flat "like way down here". Same class as the
    #    protected ("interesting","very","very","very","interesting") run. Keyed with the words on
    #    both sides ("LIKE way way way DOWN").
    ("like", "way", "way", "way", "down"),
    # my-new-100x/kaspa-lambo-color-argument clip 8, 2026-08-28. THE RECEIPT HE WENT AND FETCHED:
    # "I even asked Claude. CLAUDE EXTRACTED the color code." The repetition is a real sentence
    # boundary, not a stutter - the two limbs are separately timed on this spine (39.20-39.72 and
    # 39.72-40.30 s) and small.en's whole-file pass reads both ("I even asked Claude, Claude
    # extracted the color code"). cleanup()'s ADJACENT collapse would eat the second limb and leave
    # "asked claude extracted the color code", which loses the subject of the sentence that carries
    # the clip's proof. Keyed with the words on both sides ("ASKED claude claude EXTRACTED") so a
    # genuine "claude claude" stutter elsewhere still collapses.
    ("asked", "claude", "claude", "extracted"),
    # tendies/artificial-inu-is-the-king-impact clip 6, 2026-09-03. THE REACTION BEAT IS THE HOOK:
    # after "a $20 million buy order, man." he lets out TWO separate drawn vocalizations before
    # speaking again, and the clip's own delegation names that reaction energy as protected content
    # ("a drawn ohhh plus what reads as a laugh"). They are two real bursts, not a stutter and not
    # one smeared token: a 5 ms RMS scan of this spine shows burst 1 at 3.400-4.410 s (mean -22.5,
    # peak -16.8 dB) and burst 2 at 4.535-6.080 s (mean -23.6, peak -11.7 dB), separated by 125 ms
    # of TRUE DIGITAL SILENCE at 4.410-4.535 (-120 dB). medium.en's whole-file pass reads "Ooh.
    # Ooh.", large-v3's whole-file word pass emits two "Ooh." tokens (3.180-3.540 and 4.400-4.760)
    # and medium.en on an isolated 3.30-6.15 s window reads "oooh oooh". The shipped small word pass
    # kept only ONE of them and mistimed it, so the second limb is restored in this clip's
    # whisper-words-verified.json (a missing word can never be a PHRASE_CORRECTION) - and once
    # restored, cleanup()'s ADJACENT collapse would immediately eat it again, flattening a 2.7 s
    # reaction into a single "ooh." and leaving the previous caption on screen for 2.96 s. Keyed
    # with the words on both sides ("MAN. ooh ooh THAT") so a genuine "ooh ooh" stutter elsewhere
    # still collapses.
    ("man", "ooh", "ooh", "that"),
    # biggest-bullrun/fiat-debasement-minimum-wage-house clip 1 (the FULL cut), 2026-09-06. NOT a
    # doubling at all and NOT a stutter: the audio says "they have like a decent degree, ENGINEERING
    # DEGREE, who knows?" and only the clip's own shipped word pass renders those two words as the
    # repeated token "engineer, engineer" (33.58-34.10 and 34.10-34.60). FIVE stronger decodes of
    # this exact spine disagree with it: large-v3 on an isolated 31.80-35.60 s window reads "like
    # decent degree, engineering degree, who knows?", medium.en reads "engineering degree" on THREE
    # staggered isolated windows (31.80-35.60, 31.20-36.10, 32.20-35.20) and again on its whole-file
    # pass, and the batch tighten plan independently lists this span as a caption STT fix
    # ("mayor engineer in degree" -> "maybe an engineering degree" at master ~250.2). The collapse
    # would eat the second token and ship "a decent degree, engineer, who knows", which is not what
    # he says; it is spared here ONLY so the ("degree","engineer","engineer","who") PHRASE rule below
    # can rewrite the pair into "engineering degree" (apply_phrases runs AFTER cleanup, so a
    # collapsed pair is unreachable and a 1-token -> 2-word expansion does not exist). Keyed with the
    # words on both sides so a genuine "engineer engineer" stutter elsewhere still collapses.
    ("degree", "engineer", "engineer", "who"),
    # biggest-bullrun/youtube-10x-discord-100x clip 2 (the FULL cut), 2026-09-06. THE HOOK'S FLEX
    # LINE: "I've been known for getting some REALLY, REALLY like parabolic plays, even in a bear
    # market." An intensifier doubling, not a stutter: the two limbs are separately timed on this
    # spine (5.26-5.56 and 5.56-6.26) and the SECOND one is the stressed, elongated limb at 0.70 s,
    # 2.7x the length of the first. medium.en's whole-file pass of this spine reads both ("getting
    # some really, really like parabolic plays"). cleanup()'s adjacent collapse keeps only the SHORT
    # first limb, and because the next word ("like") does not voice until 6.74 the caption "some
    # really" then sits on screen for 1.48 s - twice the style guide's 0.4-0.8 s group - showing half
    # of what the audio says on the clip's hook. Sparing both limbs puts all three words in one
    # chunk over the same 1.48 s. Keyed with the words on both sides ("SOME really really LIKE") so a
    # genuine "really really" stutter elsewhere still collapses.
    ("some", "really", "really", "like"),
    # perpspad/perps-pad-did-a-90x-while-i-slept (clip 1), 2026-09-14. "Never financial advice.
    # Never EVER EVER financial advice." The stacked "ever ever" is the punchline of the disclaimer
    # bit (he escalates the same line three times for the laugh), not a stutter: the two limbs are
    # separate 0.3 s words in every model pass. The collapse would ship "never ever financial
    # advice" and lose the escalation. Keyed with both neighbours so a real "ever ever" stutter
    # elsewhere still collapses.
    ("never", "ever", "ever", "financial"),
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
            # bare number + "k" (a price level: "below 57 K.") -> "57k", same shape as the x/% merges
            # so the level never splits across two captions or reads as a bare "k". Trailing
            # punctuation of the "k" token is kept ("K." -> "57k."). (perpspad clip 2, 2026-09-14.)
            if nxt == "k":
                tail = re.sub(r"^[^.,!?]*", "", norm[i+1]["w"].strip())
                words.append({"t": cur["t"], "end": norm[i+1]["end"], "w": c + "k" + tail}); i += 2; continue
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


def _quote_marks(words, quote):
    """Resolve --quote 'A:B' into (set_of_open_indices, close_index) over the CLEANED word list.

    ⛔ WHY THIS EXISTS (2026-08-10, tutorial clip 8 `freaking-early-not-degen-impact`): some clips
    contain QUOTED IMAGINED SPEECH, and captioning it flat turns a hypothetical into a claim. That
    clip's whole payload is "I'm going to be like, holy crap, I was so freaking early, like this
    particular token is like 700 million and I got in at like 1.8 million." — a future scene Mike is
    PICTURING. Its clip-plan and tighten-plan both carry a hard caption guard ("never caption or title
    it as a realised trade"), the token is deliberately unnamed, AND the base screen-share happens to
    be a live token page whose market cap is a similar order of magnitude to the figure he says, so a
    flat caption reads as a receipt for a position he does not claim to hold.

    Quotation marks are the correct fix and they are the ONLY one available in the caption domain:
    a colour highlight would EMPHASISE the figures (the opposite of what the guard wants), and a
    PHRASE_CORRECTION cannot be used because that clip shares its audio with its already-shipped
    full-cut twin (clip 4), so any token-keyed rule would silently rewrite the twin's captions too.
    A per-invocation flag cannot: it is scoped to the one command line that passes it.

    Behaviour: an opening `"` on the first word of the span, a closing `"` on its last word, and a
    RE-OPENING `"` on the first word after any pause longer than the group-break threshold (0.45 s)
    inside the span. Re-opening after a break is the standard convention for continued quotation, and
    it is what makes the frame unmissable rather than only visible at the two ends: the caption groups
    a viewer re-engages on after a deliberate beat each carry the mark.

    The marks are PRESENTATIONAL — injected at emit time, never into the token text — so grouping,
    the 0.45 s gap break, the [.?!] sentence break, the word caps and --max-secs are all provably
    untouched. Default "" = off, so every past build re-renders byte-identically.
    """
    if not quote:
        return set(), -1
    a_s, b_s = quote.split(":")
    a, b = float(a_s), float(b_s)
    inside = [i for i, w in enumerate(words) if w["t"] >= a - 1e-6 and w["end"] <= b + 1e-6]
    if not inside:
        raise SystemExit(f"--quote {quote}: no words fall inside that span")
    first, last = inside[0], inside[-1]
    opens = {first}
    for i in range(first + 1, last + 1):
        if words[i]["t"] - words[i - 1]["end"] > 0.45:
            opens.add(i)
    return opens, last


def build_montserrat(words, var, colorize, max_words=3, max_short=5, max_secs=0.0, quote=""):
    # word caps: max_words normally, up to max_short if every word in the group is very small (<=4 chars).
    # Defaults 3/5 = shorts. LONGFORM-EDITED uses 2/4 (Mike, 2026-06-17) -> --max-words 2 --max-short 4.
    #
    # max_secs = OPTIONAL duration cap on a caption group (0 = OFF, the historical behaviour, so every
    # past build re-renders byte-identically). The word caps + the 0.45 s gap break assume normal
    # delivery; when Mike STRETCHES words for effect they stop bounding anything, because a stretched
    # run has no gaps in it. Real case (tutorial/94x-euphoria-impact, 2026-08-09): "the 550X on NYX on
    # BNB" is five <=4-char words with zero gaps and a 1.98 s "550X", so the 3/5 caps put ONE caption
    # on screen for 4.86 s of continuous speech - roughly double the worst caption ever shipped, and
    # far outside the style guide's ~0.4-0.8 s per group. This is the same guard the sibling
    # arial-black preset has always had (its MAX_SECS = 1.6); montserrat just never got one.
    # Set it ABOVE any deliberately-held vowel in the clip (that clip's protected 2.74 s "ohhh man"
    # forced 2.80), so a genuine sustain still gets ONE caption.
    def is_short(x): return len(re.sub(r"[^a-z0-9]", "", x["w"].lower())) <= 4
    chunks, cur = [], []
    for j, w in enumerate(words):
        # decide the cap from the group INCLUDING w, then flush BEFORE adding if it would overflow
        tentative = cur + [w]
        cap = max_short if all(is_short(x) for x in tentative) else max_words
        too_long = bool(max_secs) and bool(cur) and (w["end"] - cur[0]["t"]) > max_secs
        if cur and (len(tentative) > cap or too_long):
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

    # Quoted-imagined-speech marks (see _quote_marks). PRESENTATIONAL ONLY: resolved against the
    # already-built `chunks`, injected into the emitted text, never into a token, so nothing above
    # this line can be affected by them.
    q_open, q_close = _quote_marks(words, quote)
    q_idx = {id(w): i for i, w in enumerate(words)}

    def deco(x):
        i = q_idx[id(x)]
        s = colour(x["w"])
        if i in q_open:
            s = '"' + s
        if i == q_close:
            s = s + '"'
        return s

    lines = [f"export const {var}: {{ t: number; h: string }}[] = ["]
    for c in chunks:
        text = " ".join(deco(x) for x in c)
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
    ap.add_argument("--max-secs", type=float, default=0.0,
                    help="montserrat: OPTIONAL max seconds per caption group (0 = off, historical default). "
                         "Use on clips with STRETCHED words, where the word caps and the 0.45s gap break "
                         "stop bounding anything; set it above any deliberately-held vowel.")
    ap.add_argument("--quote", default="",
                    help="montserrat: 'A:B' seconds — wrap the words in that span in quotation marks "
                         "as QUOTED IMAGINED/REPORTED SPEECH (opening mark on the first word, closing "
                         "on the last, re-opened after every pause > 0.45 s). Presentational only, "
                         "grouping is untouched; '' = off. Use when a clip voices a future "
                         "hypothetical that a flat caption would read as a claim.")
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
                # Separator: "," normally, or "|" when the LIST ITSELF contains a comma. A money
                # figure is emitted by cleanup()/PHRASE_CORRECTIONS as ONE token with a thousands
                # comma in it ("$1,500"), which a comma-split can never express - it would silently
                # register the two halves "$1" and "500" and colour nothing (my-new-100x clip 5,
                # 2026-08-28). If the value contains a "|", split on that instead. Fully backward
                # compatible: no existing --colorize value contains a pipe, so every past build
                # re-renders byte-identically.
                sep = "|" if "|" in ws else ","
                colorize[tag] = set(w.lower() for w in ws.split(sep) if w)
        out = build_montserrat(words, args.var, colorize, args.max_words, args.max_short,
                               args.max_secs, args.quote)
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
