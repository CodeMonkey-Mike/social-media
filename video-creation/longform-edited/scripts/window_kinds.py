#!/usr/bin/env python
"""
window_kinds.py: the ONE source of truth for the KIND of every visible window on a longform-edited spine
(face mode `mixed`, longform-edited.md house rule #1c; Mike 2026-11-09, canton).

A visible (non-black) window on the spine is one of two kinds:
  face        = the normal gated full-frame face scene: face reframe, punch-ins, the face transitions, captions.
  screenshare = Mike's OBS screen share (webcam bottom-right, CTA box top-right, as recorded): the comp paints the deck
                area (x 0 to 1464) with a COVER-PLAN `face_body` row; NO captions, NO face reframe, NO punch-in.
face_mode `gated` makes every window `face`, `screenshare` makes every window `screenshare`; only `mixed` reads a kind
per window, from:
  1. AS-RECORDED.md `## FACE windows` (measured on the FINAL spine, the table every plan / build script already reads):
     each row names exactly ONE kind, by its scripted-beat tag (`[FACE]` / 👤 = face, `[SCREENSHARE]` / 🖥️ = screenshare)
     or an explicit `kind: face|screenshare`. A row naming both is two beats merged into one window (a FACE beat and a
     SCREENSHARE beat back to back with no black between): the row is split at the OBS scene switch, never guessed.
  2. the cover-blackout map (spine/<scope>.b.*.cover.json, the DEFUMBLED spine; cover_blackout tagged each visible
     window from the screenplay) is the cross-check. The desilence passes move times, never the ORDER of the windows,
     so when the map carries kinds its kind sequence must equal AS-RECORDED's, in order; a count or order mismatch FAILS.
     A row with no kind of its own takes the map's kind at its position (the counts must match).

API (importable: graph/common.py re-exports it; the scripts add this folder to sys.path):
  face_mode(proj) -> 'gated' | 'screenshare' | 'mixed'          (GRAPH-PROGRESS.json settings.face_mode)
  visible_windows(proj, scope='ALL') -> [{'n', 'a', 'z', 'kind'}]  raises WindowKindError (mixed only) on any doubt
  windows_of(wins, kind) -> [(a, z)] · inside(t, wins) -> bool
CLI:  python window_kinds.py <media/<project>> [--scope ALL] [--json]
Machine line: WINDOW-KINDS PASS|FAIL mode=<m> windows=N face=N screenshare=N
"""
import argparse
import json
import re
import sys
from pathlib import Path

KINDS = ("face", "screenshare")
FACE_MODES = ("gated", "screenshare", "mixed")
FACE_ROW_RE = re.compile(r"^\|\s*(\d+)\s*\|\s*(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*\|(.*)$", re.M)
SECTION_RE = re.compile(r"^##\s+FACE windows.*?(?=^##\s|\Z)", re.M | re.S)
_SS = re.compile(r"\[SCREENSHARE\]|\U0001F5A5|\bkind\s*[:=]\s*`?screenshare\b", re.I)
_FACE = re.compile(r"\[FACE\]|\U0001F464|\bkind\s*[:=]\s*`?face\b", re.I)
_START_KEYS = ("span", "window", "window_s", "range")


class WindowKindError(ValueError):
    """The visible windows' kinds cannot be read without guessing (face mode mixed)."""


def settings(proj: Path) -> dict:
    try:
        d = json.loads((Path(proj) / "GRAPH-PROGRESS.json").read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {}
    return (d.get("settings") or {}) if isinstance(d, dict) else {}


def face_mode(proj: Path) -> str:
    v = settings(proj).get("face_mode", "gated")
    return v if v in FACE_MODES else "gated"


def row_kind(cells: str):
    """The kind a FACE-windows row names ('face' / 'screenshare'), None when it names none; raises when it names both."""
    ss, fc = bool(_SS.search(cells)), bool(_FACE.search(cells))
    if ss and fc:
        raise WindowKindError("names BOTH [FACE] and [SCREENSHARE]: a face beat and a screen-share beat ran back to back in one "
                              "window; split the row at the OBS scene switch (the frame the webcam layout appears / leaves)")
    return "screenshare" if ss else ("face" if fc else None)


def ar_rows(text: str) -> list:
    """[(n, a, z, cells)] from the `## FACE windows` section of AS-RECORDED.md."""
    sec = SECTION_RE.search(text or "")
    return [(int(m.group(1)), float(m.group(2)), float(m.group(3)), m.group(4))
            for m in FACE_ROW_RE.finditer(sec.group(0) if sec else "")]


def _start_of(d: dict):
    for k in _START_KEYS:
        v = d.get(k)
        if isinstance(v, (list, tuple)) and v and isinstance(v[0], (int, float)):
            return float(v[0])
    for k in ("start", "tIn", "a", "t0", "from"):
        if isinstance(d.get(k), (int, float)):
            return float(d[k])
    return None


def cover_map(proj: Path, scope: str = "ALL"):
    hits = sorted((Path(proj) / "spine").glob(f"{scope}.b.*.cover.json"))
    return hits[-1] if hits else None


def map_kinds(proj: Path, scope: str = "ALL"):
    """The kind sequence the cover-blackout map carries, in time order, or None when it carries none."""
    p = cover_map(proj, scope)
    if not p:
        return None
    try:
        data = json.loads(p.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return None
    found = {}

    def walk(x):
        if isinstance(x, dict):
            k = str(x.get("kind", "")).strip().lower().replace("-", "").replace(" ", "")
            if k in KINDS:
                t = _start_of(x)
                if t is not None:
                    found.setdefault(round(t, 2), k)
            for v in x.values():
                walk(v)
        elif isinstance(x, list):
            for v in x:
                walk(v)
    walk(data)
    return [found[t] for t in sorted(found)] or None


def visible_windows(proj: Path, scope: str = "ALL", ar_text: str = None, mode: str = None) -> list:
    """Every visible window of the FINAL spine with its kind: [{'n', 'a', 'z', 'kind'}] in AS-RECORDED order.
    gated -> all 'face', screenshare -> all 'screenshare'; mixed -> per row (see the module docstring), WindowKindError on
    a row with no readable kind, a row naming both, or a disagreement with the cover-blackout map."""
    proj = Path(proj)
    mode = mode or face_mode(proj)
    if ar_text is None:
        ar = proj / "AS-RECORDED.md"
        ar_text = ar.read_text(encoding="utf-8") if ar.is_file() else ""
    rows = ar_rows(ar_text)
    if mode != "mixed":
        k = "screenshare" if mode == "screenshare" else "face"
        return [{"n": n, "a": a, "z": z, "kind": k} for n, a, z, _ in rows]
    out, problems = [], []
    for n, a, z, cells in rows:
        try:
            k = row_kind(cells)
        except WindowKindError as e:
            problems.append(f"AS-RECORDED FACE window {n} ({a:.2f}-{z:.2f}s) {e}")
            k = None
        out.append({"n": n, "a": a, "z": z, "kind": k})
    if problems:
        raise WindowKindError("; ".join(problems))
    mk = map_kinds(proj, scope)
    mp = cover_map(proj, scope)
    if mk is not None:
        if len(mk) != len(out):
            raise WindowKindError(
                f"the cover-blackout map {mp.name if mp else '?'} tags {len(mk)} visible window(s) ({', '.join(mk)}) but AS-RECORDED.md "
                f"lists {len(out)} (a window lost or merged between the defumbled spine and the FINAL spine, or two beats of "
                "different kinds merged into one AS-RECORDED row: split it at the OBS scene switch)")
        for w, k in zip(out, mk):
            if w["kind"] is None:
                w["kind"] = k
            elif w["kind"] != k:
                raise WindowKindError(f"AS-RECORDED FACE window {w['n']} ({w['a']:.2f}-{w['z']:.2f}s) is {w['kind']}, the cover-blackout "
                                      f"map's window {out.index(w) + 1} is {k} (same order on both spines): fix the wrong one")
    missing = [w for w in out if w["kind"] is None]
    if missing:
        raise WindowKindError("AS-RECORDED FACE window(s) " + ", ".join(f"{w['n']} ({w['a']:.2f}-{w['z']:.2f}s)" for w in missing)
                              + " name no kind (`[FACE]` or `[SCREENSHARE]` in the scripted-beat cell) and the cover-blackout map "
                              + ("carries none" if mk is None else "cannot settle it"))
    return out


def windows_of(wins: list, kind: str) -> list:
    return [(float(w["a"]), float(w["z"])) for w in wins if w.get("kind") == kind]


def inside(t: float, wins, tol: float = 0.05) -> bool:
    return any(a - tol <= float(t) <= z + tol for a, z in wins)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project_dir")
    ap.add_argument("--scope", default="ALL")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()
    proj = Path(a.project_dir).resolve()
    mode = face_mode(proj)
    try:
        wins = visible_windows(proj, a.scope, mode=mode)
    except WindowKindError as e:
        print(f"FAIL  {e}")
        print(f"WINDOW-KINDS FAIL mode={mode} windows=? face=? screenshare=?")
        sys.exit(1)
    if a.json:
        print(json.dumps(wins, indent=1))
    else:
        for w in wins:
            print(f"  F{w['n']:<2} {w['a']:9.3f}-{w['z']:<9.3f} {w['kind']}")
    nf = sum(1 for w in wins if w["kind"] == "face")
    print(f"WINDOW-KINDS PASS mode={mode} windows={len(wins)} face={nf} screenshare={len(wins) - nf}")


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    main()
