"""Windowed word-level transcription for filler detection (track-agnostic).

WHY THIS EXISTS
---------------
Whisper de-disfluences. On a 27-minute master it transcribed 3 "um"s for a whole
livestream; on the 7 October-pumps clips the `medium` model returned ZERO. Worse, a
whole-clip pass produces BROKEN word alignment: it reported a single 3.30s token "to"
that windowed decoding resolves as a complete 10-word sentence, and a 0.40s "uh" that
is really the number "240".

So the Phase 5 tighten skill's step 2 ("auto-remove filler disfluencies ... word
boundaries come from the Whisper word JSON") silently NO-OPS, and any acoustic gap
detector layered on whole-clip words finds nothing because Whisper stretches word spans
to cover the gaps.

Fix: decode in short OVERLAPPING windows. Short context defeats the model's fluency
prior and keeps the alignment honest. Dedupe on the overlap by preferring the word from
the window whose CENTRE is nearest the word (edge words are the badly-aligned ones).

Output is a plain word list [{start,end,word}] in CLIP-LOCAL seconds, plus a ranked
list of filler candidates. It PROPOSES, it never cuts.
"""
import argparse, json, os, re, subprocess, sys, tempfile

WIN, OVERLAP, MODEL = 10.0, 3.0, "small"

TIC = re.compile(r"^(um+|uh+|erm|hmm+|mm+|ah+|er)$", re.I)
# multi-word stall phrases, matched on the token stream
PHRASES = [("you", "know"), ("i", "mean"), ("kind", "of"), ("sort", "of")]


def dur(p):
    return float(subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p],
        capture_output=True, text=True, check=True).stdout.strip())


def transcribe_windowed(src, model_name=MODEL, win=WIN, ov=OVERLAP, verbose=True):
    import whisper
    m = whisper.load_model(model_name)
    total = dur(src)
    step = win - ov
    tmp = tempfile.mkdtemp(prefix="fillermap_")
    picked = []  # (start, end, word, dist_to_window_centre)
    t = 0.0
    while t < total:
        a, b = t, min(t + win, total)
        chunk = os.path.join(tmp, f"w_{a:.1f}.wav")
        subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", src, "-ss", f"{a}", "-to", f"{b}",
                        "-vn", "-ac", "1", "-ar", "16000", chunk], check=True)
        r = m.transcribe(chunk, language="en", word_timestamps=True,
                         condition_on_previous_text=False, temperature=0.0)
        centre = (a + b) / 2
        for s in r["segments"]:
            for w in s.get("words", []):
                ws, we = a + w["start"], a + w["end"]
                picked.append([ws, we, w["word"], abs((ws + we) / 2 - centre)])
        if verbose:
            print(f"  window {a:6.1f}-{b:6.1f}s", file=sys.stderr)
        if b >= total:
            break
        t += step
    # dedupe: cluster words that overlap in time, keep the one nearest its window centre
    picked.sort(key=lambda x: x[0])
    out = []
    for w in picked:
        if out and w[0] < out[-1][1] - 0.02:      # overlaps the previous kept word
            if w[3] < out[-1][3]:
                out[-1] = w
            continue
        out.append(w)
    return [{"start": round(w[0], 2), "end": round(w[1], 2), "word": w[2]} for w in out]


def candidates(words):
    """Rank filler candidates. Tics are certain; phrases and stretched hedges are proposals."""
    toks = [w["word"].strip().lower().strip(",.?!\"'") for w in words]
    out = []
    for i, w in enumerate(words):
        d = w["end"] - w["start"]
        ctx = " ".join(x["word"].strip() for x in words[max(0, i - 4):i + 5])
        if TIC.match(toks[i]):
            out.append(dict(start=w["start"], end=w["end"], text=toks[i], kind="tic",
                            confidence="certain", ctx=ctx))
        elif toks[i] == "like" and i and toks[i - 1] not in ("looks", "look", "feels", "sounds", "just")\
                and (i + 1 >= len(toks) or toks[i + 1] not in ("this", "that", "it", "a", "the")):
            out.append(dict(start=w["start"], end=w["end"], text="like", kind="discourse-like",
                            confidence="review", ctx=ctx))
    for i in range(len(toks) - 1):
        for p in PHRASES:
            if (toks[i], toks[i + 1]) == p:
                out.append(dict(start=words[i]["start"], end=words[i + 1]["end"],
                                text=" ".join(p), kind="stall-phrase", confidence="review",
                                ctx=" ".join(x["word"].strip() for x in words[max(0, i - 4):i + 6])))
    out.sort(key=lambda c: c["start"])
    return out


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("--out", required=True)
    ap.add_argument("--model", default=MODEL)
    a = ap.parse_args()
    words = transcribe_windowed(a.src, a.model)
    cands = candidates(words)
    json.dump({"src": a.src, "duration": dur(a.src), "model": a.model,
               "window": WIN, "overlap": OVERLAP, "words": words, "candidates": cands},
              open(a.out, "w"), indent=1)
    print(f"{os.path.basename(a.src)}: {len(words)} words, {len(cands)} candidates "
          f"({sum(1 for c in cands if c['confidence']=='certain')} certain)")
