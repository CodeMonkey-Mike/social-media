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
    # Whisper splits this as "post" + "-having"; the hyphen merge in cleanup() rejoins it and then
    # re-runs clean_token, so this single-token form is the one that actually fires.
    (r"\bpost-?having\b", "post-halving"),
    # NOTE: every other October-pumps mishear is MULTI-WORD and lives in PHRASE_CORRECTIONS below.
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
]


def apply_phrases(words):
    """Rewrite multi-word mishears on the token sequence. Runs AFTER cleanup()."""
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
FILLER = {"uh", "um", "uhh", "umm", "mm", "hmm"}


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
        if words and core(words[-1]["w"]) == c and c:
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
