"""
Build captions.ts.draft for a given clip's whisper-words.json.
Usage:
    python _build_captions_meme.py <slug>

Reads:  meme-coins-clips/<slug>/whisper-words.json
Writes: meme-coins-clips/<slug>/captions.ts.draft
"""
import json, re, sys
from pathlib import Path

HERE = Path(__file__).parent
SHORT_LEN = 4
GAP_BREAK = 0.22

# ─── Per-clip vocabulary (whisper corrections + colour buckets) ────────────────
# `corrections` are applied as whole-word/whole-token rewrites BEFORE colouring.
# Colour buckets are matched case-insensitive on the cleaned word.
SCHEMES = {
    "stop-hating-build-business": {
        "corrections": {},
        "merge": [
            (("house", "coin"), "housecoin"),
        ],
        "g":  {"housecoin"},
        "y":  set(),
        "gr": {"build", "business", "skill", "compound", "rich", "better"},
        "r":  {"hating", "hate", "vices"},
    },
    "house-coin-1000x": {
        "corrections": {},
        "merge": [
            (("house", "coin"), "housecoin"),
            (("house", "coins"), "housecoin"),
        ],
        "g":  {"housecoin"},
        "y":  {"surviving"},
        "gr": {"1000x", "thousand", "500x", "5x", "28x", "100x", "rock", "solid"},
        "r":  {"hate", "bear", "wrong"},
    },
    "pengu-flips-pepe": {
        "corrections": {
            # whisper sometimes mis-transcribes; fixes go here
        },
        "merge": [],
        "g":  {"pengu"},
        "y":  {"toshi"},
        "gr": {"40", "billion", "10", "times", "flip", "beat"},
        "r":  {"pepe"},
    },
    "pythia-28x": {
        "corrections": {
            # whisper variants for Pythia (a Bittensor subnet) and rodent meme
            "pythea":   "pythia",
            "pithia":   "pythia",
            "bridgen":  "bridging",
            "pythia,":  "pythia,",
        },
        "merge": [],
        "g":  {"pythia", "tao", "bittensor"},
        "y":  {"rodent", "rodent's"},
        "gr": {"28x", "comeback"},
        "r":  set(),
    },
}


def load_words(slug):
    p = HERE / "meme-coins-clips" / slug / "whisper-words.json"
    data = json.loads(p.read_text())
    words = []
    for seg in data["segments"]:
        for w in seg.get("words", []):
            words.append({"word": w["word"].strip(), "start": w["start"], "end": w["end"]})
    return words


def apply_corrections(words, corrections):
    for w in words:
        clean = re.sub(r"[.,!?']", "", w["word"]).lower()
        if clean in corrections:
            # keep trailing punctuation
            tail = w["word"][len(re.sub(r"[.,!?']*$", "", w["word"])):]
            w["word"] = corrections[clean] + tail
    return words


def merge_phrases(words, merge_rules):
    """Each rule: ((token_a, token_b, ...), joined). Match on lowercased clean tokens."""
    if not merge_rules:
        return words
    out = []
    i = 0
    while i < len(words):
        matched = False
        for seq, joined in merge_rules:
            n = len(seq)
            if i + n <= len(words):
                tokens = [re.sub(r"[.,!?']", "", words[i + k]["word"]).lower() for k in range(n)]
                if tokens == list(seq):
                    out.append({
                        "word": joined,
                        "start": words[i]["start"],
                        "end":   words[i + n - 1]["end"],
                    })
                    i += n
                    matched = True
                    break
        if not matched:
            out.append(words[i])
            i += 1
    return out


def is_short(s):
    return len(re.sub(r"[.,!?']", "", s)) <= SHORT_LEN


def colorize(raw, scheme):
    clean = re.sub(r"[.,!?']", "", raw).lower()
    for tag in ("g", "y", "gr", "r"):
        if clean in scheme[tag]:
            return f"<{tag}>{raw}</{tag}>"
    return raw


def group(words):
    groups = []
    current = []
    current_start = None
    for i, w in enumerate(words):
        if not current:
            current = [w]; current_start = w["start"]; continue
        gap = w["start"] - words[i - 1]["end"]
        all_short = all(is_short(x["word"]) for x in current + [w])
        max_words = 4 if all_short else 3
        if gap > GAP_BREAK or len(current) >= max_words:
            groups.append((current_start, current))
            current = [w]; current_start = w["start"]
        else:
            current.append(w)
    if current:
        groups.append((current_start, current))
    return groups


def emit(slug, groups, scheme):
    var = "CAPTIONS_" + slug.upper().replace("-", "_")
    lines = []
    lines.append(f"// Draft captions for {slug} (generated from whisper-words.json).")
    lines.append("// Colour spans: <g>=teal <y>=yellow <gr>=green <r>=red.")
    lines.append(f"export const {var}: {{ t: number; h: string }}[] = [")
    for t, grp in groups:
        html = " ".join(colorize(w["word"], scheme) for w in grp)
        html_js = html.replace("'", "\\'")
        lines.append(f"  {{ t: {t:6.2f}, h: '{html_js}' }},")
    lines.append("];")
    return "\n".join(lines) + "\n"


def main(slug):
    scheme = SCHEMES[slug]
    words = load_words(slug)
    words = apply_corrections(words, scheme["corrections"])
    words = merge_phrases(words, scheme["merge"])
    groups = group(words)
    out = emit(slug, groups, scheme)
    out_path = HERE / "meme-coins-clips" / slug / "captions.ts.draft"
    out_path.write_text(out)
    print(f"Wrote {out_path} ({len(groups)} groups, last at {groups[-1][0]:.2f}s)")


if __name__ == "__main__":
    for slug in sys.argv[1:]:
        main(slug)
