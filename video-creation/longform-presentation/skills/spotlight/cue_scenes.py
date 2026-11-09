"""cue_scenes.py — resolve a spotlight scene spec's cue phrases to EDIT-timeline seconds, plan the chapter pauses,
emit the comp data.

Part of longform-presentation/skills/spotlight (read spotlight.md first).

Input : <project>.scenes.json  (the spec: scenes with `cue` phrases; see the skill doc for the schema)
        <EDIT>.medium-words.json (Whisper medium word timings of the FINAL EDIT, from scripts/transcribe.py)
        --edit <EDIT>.mp4        (only when the spec asks for chapter pauses: the pause point is snapped into the
                                  quiet gap before the chapter's first word by scanning the EDIT audio)
Output: <project>.scenes.resolved.json (same spec + `t`, `score`, `match` per scene / bullet item, the frame-snapped
        head_until / tail_from, and a `timeline` block with the planned pauses) and, with --emit-ts, the Remotion
        data file the project comp imports (all times on the PAUSED timeline the comp renders).

Matching: every cue is a phrase Mike says; we slide a window over the transcript words (sizes n-2..n+2) and score
difflib similarity of the normalized text, searching MONOTONICALLY from the previous scene (a scene can never
cue earlier than the one before it; a bullet item cues inside its own scene). `t` = start of the first word of
the best window. Scores under --min-score are printed with ?? for a human look; a pinned `"t": <sec>` in the
spec always wins (that is how a mis-resolved cue is fixed: pin it, do not edit the words JSON).

Chapter pauses (2026-10-14, Mike: "add an extra second at the end of each chapter and before the next chapter
starts ... the title of the new chapter can be on the screen during that pause"): a top-level `"chapter_pause": 1.0`
inserts that many seconds of silence + the chapter card before EVERY `chapter` scene (`"pause": false` on a scene
skips it, `"pause": 1.5` overrides it). The insert point `at` is the centre of the quiet gap (<= -50 dB, >= 40 ms)
right before the chapter's first word, snapped to a frame; the card starts AT the pause, the words follow it. The
pauses live in the `timeline` block; stitch.py inserts the matching silence into the audio, the EDIT file itself
is never re-encoded for them (spot_common.py explains the timeline). If the first chapter's pause lands before
`head_until`, head_until moves back to the pause (the pause must be inside the rendered middle, the head is
as-filmed footage).

--provisional (no words file): t = i * --provisional-gap from 0, head_until 0, no pauses; for a look-see render of
the containers before the transcript exists. Never render a deliverable from provisional times.

Usage:
  python cue_scenes.py "<project>.scenes.json" --words "<EDIT>.medium-words.json" --edit "<EDIT>.mp4" \
      --emit-ts "<remotion>/src/<Comp>Data.ts"
  python cue_scenes.py "<project>.scenes.json" --provisional --emit-ts ...
"""
import argparse, difflib, json, math, os, re, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from spot_common import paused as paused_time  # noqa: E402

TROUGH_DB = -50.0     # a 10 ms bin at or under this is quiet
TROUGH_MIN = 0.04     # s: the shortest quiet run that counts as the gap before a word
TROUGH_SCAN = (0.7, 0.15)   # s scanned before / after the planned (first-word) time


ITEM_KINDS = ("bullets", "block", "flow")   # scene kinds whose `items` carry their own cues (the active highlight)


def norm(s):
    s = s.lower().replace("’", "'")
    s = re.sub(r"[^a-z0-9$%' ]+", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    return s


def load_words(path):
    data = json.load(open(path, encoding="utf-8"))
    words = []
    for seg in data["segments"]:
        for w in seg.get("words", []):
            n = norm(w["word"])
            if n:
                words.append((n, float(w["start"]), float(w["end"]), w["word"].strip()))
    return words


def best_match(words, cue, t_from, t_to, n_tok):
    """best (score, t, matched_text) for cue among windows whose first word starts in [t_from, t_to)."""
    cue_n = norm(cue)
    cue_first = cue_n.split()[0] if cue_n else ""
    best = (-1.0, None, "")
    idx = [i for i, w in enumerate(words) if t_from <= w[1] < t_to]
    if not idx:
        return best
    for i in idx:
        for size in (n_tok - 2, n_tok - 1, n_tok, n_tok + 1, n_tok + 2):
            if size < 1 or i + size > len(words):
                continue
            win = words[i:i + size]
            text = " ".join(w[0] for w in win)
            sc = difflib.SequenceMatcher(None, text, cue_n).ratio()
            if win[0][0] == cue_first:
                sc += 0.05
            if sc > best[0]:
                best = (sc, win[0][1], " ".join(w[3] for w in win))
    return best


def resolve(spec, words, min_score, lookahead):
    fps = spec.get("fps", 30)
    snap = lambda t: math.floor(t * fps + 1e-6) / fps
    report = []

    def find(cue, t_from, label, hard_end=None):
        n_tok = len(norm(cue).split())
        t_to = hard_end if hard_end is not None else t_from + lookahead
        sc, t, txt = best_match(words, cue, t_from, t_to, n_tok)
        if (sc < min_score or t is None) and hard_end is None:          # widen to the end of the file
            sc2, t2, txt2 = best_match(words, cue, t_from, 1e9, n_tok)
            if sc2 > sc:
                sc, t, txt = sc2, t2, txt2
        report.append((label, t, sc, txt, cue))
        return t, sc, txt

    # head / tail bounds
    h = spec["head_until"]
    if "t" in h:
        head = snap(h["t"]); report.append(("head_until", head, 1.0, "(pinned)", h.get("cue", "")))
    else:
        t, sc, txt = find(h["cue"], 0.0, "head_until")
        head = snap(t if t is not None else 0.0)
    h["t"] = head

    prev = head
    for s in spec["scenes"]:
        if "t" in s and s["t"] is not None:
            s["score"] = 1.0; s["match"] = "(pinned)"
            report.append((s["id"], s["t"], 1.0, "(pinned)", s.get("cue", "")))
        else:
            t, sc, txt = find(s["cue"], max(prev - 1.0, head), s["id"])
            if t is None:
                t = prev + 0.5
            s["t"], s["score"], s["match"] = round(t, 3), round(sc, 3), txt
        if s["t"] < prev:
            report.append((s["id"], s["t"], 0.0, f"!! BEFORE previous scene ({prev:.2f}) -> clamped", s.get("cue", "")))
            s["t"] = round(prev + 0.5, 3)
        prev = s["t"]
    # bullet items: inside their scene, before the next scene
    for i, s in enumerate(spec["scenes"]):
        if s.get("kind") not in ITEM_KINDS:
            continue
        s_end = spec["scenes"][i + 1]["t"] if i + 1 < len(spec["scenes"]) else 1e9
        p = s["t"]
        for j, it in enumerate(s.get("items", [])):
            if "t" in it and it["t"] is not None:
                p = it["t"]; continue
            if not it.get("cue"):
                continue
            t, sc, txt = find(it["cue"], max(p - 0.5, s["t"] - 0.5), f"  {s['id']}[{j}]", hard_end=s_end)
            if t is None:
                report.append((f"  {s['id']}[{j}]", None, 0.0, "!! no match inside the scene -> item never highlights", it["cue"]))
                continue
            it["t"], it["score"], it["match"] = round(t, 3), round(sc, 3), txt
            p = t

    tl = spec["tail_from"]
    if "t" in tl:
        tail = snap(tl["t"]); report.append(("tail_from", tail, 1.0, "(pinned)", tl.get("cue", "")))
    else:
        t, sc, txt = find(tl["cue"], prev, "tail_from")
        tail = snap(t if t is not None else (words[-1][2] if words else prev))
    tl["t"] = tail
    return report


# ---------------------------------------------------------------- chapter pauses
def rms_bins(path, start, length, bin_s=0.01):
    n = int(round(44100 * bin_s))
    r = subprocess.run(["ffmpeg", "-hide_banner", "-ss", f"{max(0.0, start):.3f}", "-t", f"{length:.3f}", "-i", path, "-vn",
                        "-af", f"aresample=44100,asetnsamples=n={n}:p=0,astats=metadata=1:reset=1,"
                               "ametadata=print:key=lavfi.astats.Overall.RMS_level",
                        "-f", "null", "-"], capture_output=True, text=True)
    vals = [(-120.0 if ("inf" in v or "nan" in v) else float(v))
            for v in re.findall(r"RMS_level=(-?inf|nan|-?[\d.]+)", r.stderr)]
    return [(max(0.0, start) + i * bin_s, v) for i, v in enumerate(vals)]


def trough_before(edit, planned):
    """centre of the quiet gap right before the planned first-word time -> (at, note) or (None, why)."""
    bins = rms_bins(edit, planned - TROUGH_SCAN[0], TROUGH_SCAN[0] + TROUGH_SCAN[1])
    runs, cur = [], None
    for bt, v in bins:
        if v <= TROUGH_DB:
            cur = [bt, bt + 0.01] if cur is None else [cur[0], bt + 0.01]
        else:
            if cur and cur[1] - cur[0] >= TROUGH_MIN - 1e-9:
                runs.append(cur)
            cur = None
    if cur and cur[1] - cur[0] >= TROUGH_MIN - 1e-9:
        runs.append(cur)
    # the gap before the word = the LONGEST quiet run that starts before the planned time (+50 ms Whisper slack);
    # ties go to the latest. Never "the last run": a Whisper word start can be late by 0.4 s, and then the last
    # quiet run is a dip INSIDE the word (ch09 of history-of-crypto, a 40 ms dip chosen over the 300 ms gap).
    cands = [r for r in runs if r[0] <= planned + 0.05]
    if not cands:
        return None, f"no quiet run (<= {TROUGH_DB:.0f} dB, >= {TROUGH_MIN*1000:.0f} ms) in [{planned-TROUGH_SCAN[0]:.2f}, {planned+TROUGH_SCAN[1]:.2f}]"
    r = max(cands, key=lambda r: (round(r[1] - r[0], 3), r[0]))
    return (r[0] + r[1]) / 2.0, f"gap {r[0]:.2f}-{r[1]:.2f} ({(r[1]-r[0])*1000:.0f} ms)"


def plan_pauses(spec, edit, report):
    """Plan the chapter pauses on the EDIT timeline; fills spec['timeline']; may move head_until back."""
    fps = spec.get("fps", 30)
    snap = lambda t: math.floor(t * fps + 1e-6) / fps
    default = float(spec.get("chapter_pause", 0) or 0)
    pauses = []
    for s in spec["scenes"]:
        if s.get("kind") != "chapter":
            continue
        d = s.get("pause", default)
        if d in (False, None) or float(d) <= 0:
            continue
        d = float(d)
        if "pause_at" in s and s["pause_at"] is not None:                      # pinned insert point
            at, note = snap(float(s["pause_at"])), "(pinned pause_at)"
        else:
            if not edit:
                sys.exit("chapter pauses need --edit <EDIT.mp4> (the pause point is snapped into the EDIT audio)")
            at, note = trough_before(edit, s["t"])
            if at is None:
                report.append((f"  pause {s['id']}", None, 0.0, f"!! {note} -> pause NOT planned; pin pause_at", ""))
                continue
            at = snap(at)
        if pauses and at <= pauses[-1]["at"]:
            report.append((f"  pause {s['id']}", at, 0.0, f"!! pause point not after the previous pause ({pauses[-1]['at']:.2f}) -> skipped", ""))
            continue
        pauses.append({"scene": s["id"], "planned": s["t"], "at": round(at, 3), "dur": d, "note": note})
    head = spec["head_until"]["t"]
    if pauses and pauses[0]["at"] < head:
        report.append(("head_until", pauses[0]["at"], 1.0, f"moved back from {head:.3f} to the first pause", ""))
        head = pauses[0]["at"]
        spec["head_until"]["t"] = head
    tail = spec["tail_from"]["t"]
    pl = [(p["at"], p["dur"]) for p in pauses]
    total = sum(d for _, d in pl)
    for p in pauses:
        p["t_paused"] = round(p["at"] + sum(d for a, d in pl if a < p["at"]), 3)
        report.append((f"  pause {p['scene']}", p["at"], 1.0, f"{p['dur']:.2f}s silence + card at EDIT {p['at']:.2f} -> out {p['t_paused']:.2f}; {p['note']}", ""))
    spec["timeline"] = {"chapter_pause": default, "pauses": pauses, "pause_total": round(total, 3),
                        "head_until": head, "tail_from_edit": tail, "tail_from_paused": round(tail + total, 3),
                        "middle_frames": round((tail - head + total) * fps),
                        "_doc": "paused time = EDIT time + sum(dur of pauses with at <= t); a chapter card starts AT its pause; "
                                "stitch.py inserts the silences into the audio, the EDIT file is not re-encoded"}
    return pauses


def provisional(spec, gap):
    spec["head_until"]["t"] = 0.0
    t = 0.0
    for s in spec["scenes"]:
        s["t"] = round(t, 3); s["score"] = 0.0; s["match"] = "(provisional)"
        if s.get("kind") in ITEM_KINDS:
            k = 0
            for it in s.get("items", []):
                if it.get("cue"):
                    k += 1; it["t"] = round(t + k * gap / (len(s["items"]) + 1), 3)
        t += gap
    spec["tail_from"]["t"] = round(t, 3)
    spec["timeline"] = {"chapter_pause": 0, "pauses": [], "pause_total": 0.0, "head_until": 0.0,
                        "tail_from_edit": spec["tail_from"]["t"], "tail_from_paused": spec["tail_from"]["t"],
                        "middle_frames": round(spec["tail_from"]["t"] * spec.get("fps", 30))}


def tc(t):
    if t is None:
        return "   --:--  "
    m, s = divmod(t, 60)
    return f"{int(m)}:{s:05.2f}".rjust(9)


def emit_ts(spec, path, comp_hint):
    """the comp's data: every time on the PAUSED timeline (what the middle render plays)."""
    keep_scene = {"id", "kind", "t", "eyebrow", "title", "icon", "sub", "label", "items", "active", "date",
                  "num", "peak", "crash", "cycles", "variant", "text", "rows", "note"}
    tl = spec.get("timeline", {})
    pl = [(p["at"], p["dur"]) for p in tl.get("pauses", [])]
    pause_of = {p["scene"]: p for p in tl.get("pauses", [])}
    scenes = []
    for s in spec["scenes"]:
        o = {k: v for k, v in s.items() if k in keep_scene}
        if s["id"] in pause_of:
            o["t"] = pause_of[s["id"]]["t_paused"]           # the card comes up with the silence
        else:
            o["t"] = round(paused_time(s["t"], pl), 3)
        if "items" in o:
            items = []
            for it in o["items"]:
                oi = {k: v for k, v in it.items() if k in ("strong", "rest", "t")}
                if "t" in oi and oi["t"] is not None:
                    oi["t"] = round(paused_time(oi["t"], pl), 3)
                items.append(oi)
            o["items"] = items
        scenes.append(o)
    fps = spec.get("fps", 30)
    head = spec["head_until"]["t"]
    tail_paused = tl.get("tail_from_paused", spec["tail_from"]["t"])
    body = json.dumps(scenes, ensure_ascii=False, indent=2)
    src = ("// GENERATED by longform-presentation/skills/spotlight/cue_scenes.py from\n"
           f"// {os.path.basename(comp_hint)} — do not hand-edit; pin a `t` in the spec and re-run instead.\n"
           "// Times are PAUSED-timeline seconds (EDIT time + the chapter pauses before it); frame 0 = HEAD_UNTIL.\n"
           "import type { SpotScene } from './SpotlightPresentation';\n\n"
           f"export const FPS = {fps};\n"
           f"export const HEAD_UNTIL = {head};\n"
           f"export const TAIL_FROM = {tail_paused};\n"
           f"export const PAUSES: {{ scene: string; t: number; dur: number }}[] = "
           f"{json.dumps([{'scene': p['scene'], 't': p['t_paused'], 'dur': p['dur']} for p in tl.get('pauses', [])])};\n"
           f"export const SCENES: SpotScene[] = {body};\n")
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(src)
    return len(scenes)


def main():
    ap = argparse.ArgumentParser(description="resolve spotlight scene cues against the EDIT word timings")
    ap.add_argument("spec")
    ap.add_argument("--words", help="<EDIT>.medium-words.json (word-level Whisper of the FINAL EDIT)")
    ap.add_argument("--edit", help="<EDIT>.mp4, needed when the spec plans chapter pauses (audio gap scan)")
    ap.add_argument("--emit-ts", help="write the Remotion data file here (src/<Comp>Data.ts)")
    ap.add_argument("--min-score", type=float, default=0.62, help="flag matches under this (default 0.62)")
    ap.add_argument("--lookahead", type=float, default=420.0,
                    help="seconds after the previous scene searched first; widened to EOF when nothing scores (default 420)")
    ap.add_argument("--provisional", action="store_true", help="no transcript yet: evenly spaced times for a look-see")
    ap.add_argument("--provisional-gap", type=float, default=6.0)
    args = ap.parse_args()

    spec = json.load(open(args.spec, encoding="utf-8"))
    out_path = os.path.splitext(args.spec)[0] + ".resolved.json"
    fps = spec.get("fps", 30)
    if args.provisional:
        provisional(spec, args.provisional_gap)
        print(f"PROVISIONAL times: {len(spec['scenes'])} scenes x {args.provisional_gap}s "
              f"(0 .. {spec['tail_from']['t']}s). Not for a deliverable.")
    else:
        if not args.words:
            sys.exit("--words is required (or --provisional)")
        words = load_words(args.words)
        print(f"{len(words)} words in {os.path.basename(args.words)}; resolving {len(spec['scenes'])} scenes ...")
        report = resolve(spec, words, args.min_score, args.lookahead)
        pauses = plan_pauses(spec, args.edit, report)
        flagged = 0
        print(f"{'scene':<22} {'t (EDIT)':>10}  score  matched text  <-  cue")
        for label, t, sc, txt, cue in report:
            flag = "??" if sc < args.min_score else "  "
            flagged += sc < args.min_score
            print(f"{flag}{label:<20} {tc(t)}  {sc:4.2f}  \"{txt}\"" + (f"  <-  \"{cue}\"" if cue else ""))
        tl = spec["timeline"]
        print(f"\nhead_until {tc(spec['head_until']['t'])}  tail_from {tc(spec['tail_from']['t'])} (EDIT)  "
              f"+ {len(pauses)} chapter pauses = {tl['pause_total']:.2f}s  ->  middle "
              f"{tl['tail_from_paused'] - tl['head_until']:.2f}s = {tl['middle_frames']} frames @ {fps}")
        print(f"{flagged} match(es) under {args.min_score}: eyeball them in the transcript, pin a `t` in the spec if wrong.")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(spec, f, ensure_ascii=False, indent=1)
    print("resolved ->", out_path)
    if args.emit_ts:
        n = emit_ts(spec, args.emit_ts, args.spec)
        print(f"data file -> {args.emit_ts}  ({n} scenes, paused timeline)")


if __name__ == "__main__":
    main()
