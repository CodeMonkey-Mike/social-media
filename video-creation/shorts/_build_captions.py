"""Group Whisper word timings into 2-3 word caption chunks for a Remotion CAPTIONS array.
Usage: python _build_captions.py <clip-folder-name>
Reads <folder>/whisper-words.json, cleans fillers/mishears, prints a TS-ready array.
Captions don't have to be 1:1 with audio — fillers and stutters are dropped for readability.
"""
import sys, os, json, re

SHORTS = os.path.dirname(os.path.abspath(__file__))

FILLER = {"uh", "um", "uhh", "umm", "mm", "hmm"}

def clean_token(w):
    """Lowercase, strip, fix mishears. Returns cleaned text (may keep trailing punctuation)."""
    t = w.strip().lower()
    t = re.sub(r"\bcas+per\b", "kaspa", t)
    t = re.sub(r"\bkas+per\b", "kaspa", t)
    t = re.sub(r"\bcaspa\b", "kaspa", t)
    t = re.sub(r"\bsailor\b", "saylor", t)
    return t

def core(w):
    """Alpha/num core of a token for duplicate detection."""
    return re.sub(r"[^a-z0-9]", "", w.lower())

def main():
    folder = sys.argv[1] if len(sys.argv) > 1 else "xrp-vs-kaspa"
    data = json.load(open(os.path.join(SHORTS, folder, "whisper-words.json"), encoding="utf-8"))

    raw = []
    for seg in data["segments"]:
        for w in seg.get("words", []):
            txt = w["word"].strip()
            if txt:
                raw.append({"t": round(w["start"], 2), "end": round(w["end"], 2), "w": clean_token(txt)})

    # ── word-level cleanup ────────────────────────────────────────────────
    words = []
    i = 0
    while i < len(raw):
        cur = raw[i]
        c = core(cur["w"])

        # drop pure fillers
        if c in FILLER:
            i += 1
            continue

        # "pre" + "-mind/-mine/mind/mine" -> "premine"
        if c == "pre" and i + 1 < len(raw) and core(raw[i+1]["w"]) in {"mind", "mine"}:
            words.append({"t": cur["t"], "end": raw[i+1]["end"], "w": "premine"})
            i += 2
            continue

        # digit token followed by % / percent / x -> merge
        if re.fullmatch(r"\d+", c) and i + 1 < len(raw):
            nxt = core(raw[i+1]["w"])
            if nxt in {"", "percent"} or raw[i+1]["w"].strip().startswith("%"):
                words.append({"t": cur["t"], "end": raw[i+1]["end"], "w": c + "%"})
                i += 2
                continue
            if nxt == "x":
                words.append({"t": cur["t"], "end": raw[i+1]["end"], "w": c + "x"})
                i += 2
                continue

        # collapse consecutive duplicate words (stutters: "not, not, not")
        if words and core(words[-1]["w"]) == c and c:
            i += 1
            continue

        words.append({"t": cur["t"], "end": cur["end"], "w": cur["w"]})
        i += 1

    # ── group into 2-3 word chunks ────────────────────────────────────────
    chunks = []
    cur = []
    for j, w in enumerate(words):
        cur.append(w)
        gap_next = (words[j+1]["t"] - w["end"]) if j+1 < len(words) else 99
        ends_sentence = bool(re.search(r"[.?!]$", w["w"]))
        if len(cur) >= 3 or gap_next > 0.45 or ends_sentence:
            chunks.append(cur); cur = []
    if cur:
        chunks.append(cur)

    print(f"clean words: {len(words)}  chunks: {len(chunks)}  clip end: {words[-1]['end']}s")
    print("export const CAPTIONS_XRPK: { t: number; h: string }[] = [")
    for c in chunks:
        t = c[0]["t"]
        text = " ".join(x["w"] for x in c)
        text = re.sub(r"\s+([.,?!%])", r"\1", text)            # no space before punct/%
        text = re.sub(r"[,]+$", "", text).strip()               # drop trailing comma
        text = text.replace("'", "\\'")
        print(f"  {{ t: {t:6.2f}, h: '{text}' }},")
    print("];")

if __name__ == "__main__":
    main()
