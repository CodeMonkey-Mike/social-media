"""list_face_joins.py — every JUMP CUT inside every FACE window of the FINAL spine, to the frame (comp-build.md section 5:
"mid-face punch-ins / hits snap to desilencer JOINS"; Mike 2026-10-07: the punch-in + a library light leak land ON these cuts).

    python scripts/list_face_joins.py <media/<project>> [--scope ALL] [--out spine/jumpcuts-final.json]

A join is any place where two non-adjacent source frames meet in the final spine:
  * a DEFUMBLE cut   (`spine/<scope>.a.defumbled.mp4.spans.json`, cuts in lowbps time -> joins in a-time),
  * a COARSE desilence cut (`spine/<scope>.c.desilenced.map.json`, cuts in b-time -> joins in c-time),
  * a BURST-REMOVAL cut (`spine/<scope>.d.cleaned.mp4.cuts.json`, when the spine review asked for one: cuts in c-time),
  * a FINAL  desilence cut (the highest-letter `spine/<scope>.<x>.desilenced.map.json` above c: `d` without a burst stage,
    `e` after `d.cleaned`; cuts in the time of its input).
Each is mapped forward to FINAL-spine seconds (d-time) through the later maps, snapped to the 30 fps grid, de-duplicated
(two sources landing on the same frame = one join). The FACE windows come from AS-RECORDED.md ("## FACE windows" table).
Output JSON: {"fps", "final_spine", "joins_s" (every join), "face_windows": [{"n", "window_s", "joins_s", "sources"}], ...}.
Times are pre-card-pause final-spine seconds (the comp routes them through sh() like every other cue).
"""
import argparse, json, re
from pathlib import Path

FPS = 30


def removed_before(t, cuts):
    """how much source time the cut list removes before source time t (t itself must be outside every cut)."""
    r = 0.0
    for s, e in sorted(cuts):
        if e <= t + 1e-6:
            r += e - s
        elif s < t < e:
            return None          # t sits inside a removed region: it does not exist downstream
    return r


def src_to_out(t, cuts):
    r = removed_before(t, cuts)
    return None if r is None else t - r


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project"); ap.add_argument("--scope", default="ALL"); ap.add_argument("--out", default=None)
    ap.add_argument("--edge-margin", type=float, default=0.5, help="a join closer than this to a window edge is listed but is not a punch candidate (s)")
    ap.add_argument("--min-gap", type=float, default=1.5, help="minimum spacing between two punch candidates in one window (s); the earlier one wins")
    a = ap.parse_args()
    P = Path(a.project).resolve(); S = P / "spine"; sc = a.scope
    # the FINAL desilence map = the highest letter above c (d without burst removal, e after d.cleaned; retire-early 2026-10-11)
    finals = sorted(p for p in S.glob(f"{sc}.?.desilenced.map.json") if p.name[len(sc) + 1] > "c")
    if not finals:
        raise SystemExit(f"no final desilence map ({sc}.<d|e>.desilenced.map.json) in {S}")
    final_p = finals[-1]
    final_letter = final_p.name[len(sc) + 1]
    d_map = json.loads(final_p.read_text(encoding="utf-8"))
    c_map = json.loads((S / f"{sc}.c.desilenced.map.json").read_text(encoding="utf-8"))
    burst_p = next(iter(sorted(S.glob(f"{sc}.?.cleaned.mp4.cuts.json"))), None) if final_letter > "d" else None
    burst_cuts = ([[float(c["cut_start"]), float(c["cut_end"])] for c in json.loads(burst_p.read_text(encoding="utf-8"))["cuts"]]
                  if burst_p else [])

    def c_to_final(t_c):
        """c-time -> final-spine time, through the burst cuts when the chain has them."""
        if t_c is None:
            return None
        t_d = src_to_out(t_c, burst_cuts) if burst_cuts else t_c
        return None if t_d is None else src_to_out(t_d, d_map["cuts"])
    spans_p = S / f"{sc}.a.defumbled.mp4.spans.json"
    a_cuts = json.loads(spans_p.read_text(encoding="utf-8"))["cuts"] if spans_p.is_file() else []
    joins = {}                                    # final-spine frame -> set(sources)

    def add(t_final, src):
        if t_final is None or t_final < 0:
            return
        f = int(round(t_final * FPS))
        joins.setdefault(f, set()).add(src)

    # defumble joins: lowbps cut [s, e] -> a-time s - removed_before(s) ; then b == a ; -> c -> d
    for s, e in a_cuts:
        t_a = s - sum(e2 - s2 for s2, e2 in a_cuts if e2 <= s + 1e-6)
        t_c = src_to_out(t_a, c_map["cuts"])
        add(c_to_final(t_c), "defumble")
    # coarse desilence joins: b-cut [s, e] -> c-time s - removed_before(s) -> d
    for s, e in c_map["cuts"]:
        t_c = s - sum(e2 - s2 for s2, e2 in c_map["cuts"] if e2 <= s + 1e-6)
        add(c_to_final(t_c), "desilence-coarse")
    # burst-removal joins: c-cut [s, e] -> d-time (a cut at the very head is a trim, not a join)
    for s, e in burst_cuts:
        if s <= 1e-6:
            continue
        t_d = s - sum(e2 - s2 for s2, e2 in burst_cuts if e2 <= s + 1e-6)
        add(src_to_out(t_d, d_map["cuts"]), "burst-removal")
    # final desilence joins: a cut in the final pass's input time -> final-spine time
    for s, e in d_map["cuts"]:
        add(s - sum(e2 - s2 for s2, e2 in d_map["cuts"] if e2 <= s + 1e-6), "desilence-final")

    # FACE windows from AS-RECORDED.md
    asr = (P / "AS-RECORDED.md").read_text(encoding="utf-8")
    wins = []
    for m in re.finditer(r"^\|\s*(\d+)\s*\|\s*([\d.]+)-([\d.]+)\s*\|", asr, re.M):
        wins.append({"n": int(m.group(1)), "window_s": [float(m.group(2)), float(m.group(3))]})
    all_joins = sorted(joins)
    face = []
    for w in wins:
        w0, w1 = w["window_s"]
        inside = [f for f in all_joins if w0 * FPS + 0.5 < f < w1 * FPS - 0.5]      # strictly inside, not the edges
        margin = a.edge_margin * FPS                                   # a join right before the cut-out is not a punch point
        punch = []
        for f in inside:
            if not (w0 * FPS + margin <= f <= w1 * FPS - margin):
                continue
            if punch and f - punch[-1] < a.min_gap * FPS:               # two steps a second apart read as a stutter: keep the first
                continue
            punch.append(f)
        face.append({"n": w["n"], "window_s": [w0, w1], "length_s": round(w1 - w0, 3),
                     "joins_s": [round(f / FPS, 3) for f in inside],
                     "joins_frames": inside,
                     "punch_candidates_s": [round(f / FPS, 3) for f in punch],
                     "sources": {str(round(f / FPS, 3)): sorted(joins[f]) for f in inside}})
    out = {"fps": FPS, "final_spine": str(S / f"{sc}.{final_letter}.desilenced.mp4"), "final_map": final_p.name,
           "burst_cuts": str(burst_p.name) if burst_p else None, "note": "final-spine seconds, pre-card-pause; the comp routes every value through sh()",
           "joins_s": [round(f / FPS, 3) for f in all_joins], "joins_total": len(all_joins),
           "edge_margin_s": a.edge_margin, "min_gap_s": a.min_gap, "face_windows": face, "face_windows_with_joins": sum(1 for w in face if w["joins_s"]),
           "punch_points_total": sum(len(w["punch_candidates_s"]) for w in face)}
    dest = Path(a.out) if a.out else S / "jumpcuts-final.json"
    dest.write_text(json.dumps(out, indent=1), encoding="utf-8")
    print(f"FACE-JOINS ok joins={len(all_joins)} face_windows={len(face)} with_joins={out['face_windows_with_joins']} punch_points={out['punch_points_total']} -> {dest}")
    for w in face:
        print(f"  F{w['n']:<2} {w['window_s'][0]:9.3f}-{w['window_s'][1]:<9.3f} ({w['length_s']:5.2f}s)  joins: {w['joins_s'] or 'none'}  punch points: {w['punch_candidates_s'] or 'none'}")


if __name__ == "__main__":
    main()
