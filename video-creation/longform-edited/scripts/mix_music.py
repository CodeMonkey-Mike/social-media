#!/usr/bin/env python
"""
mix_music.py — the MUSIC + SFX POST-MIX onto a rendered draft/final (longform graph `mix_audio` node,
2026-09-28; Python, ONE sync-safe filter_complex, video stream copied). comp-build.md §9 / music.md: the comp
renders picture + VO only; beds, ducks, breaths, impacts, risers and the library transitions' SFX are mixed
on afterwards so an audio change never re-renders, and the mix lives as a re-runnable PROJECT artifact
(this script + the resolved `mix-audio.json` it writes), never as shell history (the ethereum-rwa lesson).

Sources (all SOURCE-spine seconds, routed through sh() with CARD_T/PAUSE from spine/<scope>.<x>.paused.json):
  MUSIC-PLAN.json      beds (source_file, source_in, span, cover, remotion_gain_db, fade_in_sec, automation windows)
  EDIT-PLAN.md         [IMPACT] / [RISER] rows: `<file>.wav|.mp3` + `file start <t>` (else the row's own time)
  TRANSITION-PLAN.json lib:<id> rows -> the library row's sfx, placed at the engine-window start sh(tc) - dur/2
Bed timing rules (music.md): a bed whose span starts at a title card fades IN so it is full on the chapter's
first word (i.e. starts fade_in_sec before the pause ends); a bed ending at a card fades OUT over 0.4 s from
the card start; the last bed fades over 0.25 s to the last frame. Gains = the plan's remotion_gain_db
(measured LUFS-relative), automation = the plan's windows as dB-relative dips with their ramps.

Usage: python mix_music.py <media/<project>> --video <draft.mp4> [--out <mp4>] [--scope ALL]
         [--sfx-db -6] [--lib-sfx-db -9] [--sfx-max 1.8]
Machine lines: MIX-PLAN beds=N sfx=N lib_sfx=N · MIX-DONE out=<file> dur=X lufs_in=A lufs_out=B peak_out=P · PROGRESS 100%
"""
import argparse
import json
import re
import subprocess
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
HERE = Path(__file__).resolve().parent
REPO = HERE.parents[2]
SFX_ROOT = REPO / "video-creation" / "assets" / "sfx"
TR_ROOT = REPO / "video-creation" / "assets" / "transitions"
LIB = TR_ROOT / "library.json"
SFX_ROW_RE = re.compile(r"\[(IMPACT|RISER)[^\]]*\]\s*(?:[^\n]{0,80}?)?([A-Za-z0-9_ .()-]+?\.(?:wav|mp3))(.{0,160}?)(?:file start|starts at)\s*(\d+:\d\d\.\d|\d+(?:\.\d+)?)", re.S)
EVENT_RE = re.compile(r"^(\d+):(\d{2}\.\d)\s+")


def probe(path, entries, select=None):
    cmd = ["ffprobe", "-v", "error"] + (["-select_streams", select] if select else []) + ["-show_entries", entries, "-of", "csv=p=0", str(path)]
    return subprocess.run(cmd, capture_output=True, text=True).stdout.strip()


def duration(path):
    try:
        return float(probe(path, "format=duration").splitlines()[0])
    except Exception:
        return 0.0


def lufs_and_peak(path):
    r = subprocess.run(["ffmpeg", "-hide_banner", "-i", str(path), "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True)
    m = re.findall(r"I:\s+(-?[\d.]+) LUFS", r.stderr)
    p = re.findall(r"Peak:\s+(-?[\d.]+) dBFS", r.stderr)
    return (float(m[-1]) if m else None), (float(p[-1]) if p else None)


def _num(v):
    try:
        return None if v is None else float(v)
    except (TypeError, ValueError):
        return None


def tc(s):
    if ":" in s:
        m, sec = s.split(":")
        return int(m) * 60 + float(sec)
    return float(s)


def bed_chain(k, b, file_len):
    """The filter chain for one resolved bed. REMIX LOOP (music.md section LOOP, Mike 2026-10-06): when the bed names a
    bar-aligned region loop_in/loop_out (file seconds), the region is repeated with aloop as many times as the span
    needs (N extra passes) and the file's real ending stays in place; nothing restarts from the top. A right-aligned
    bed (align_end) sheds the surplus from its head so the ending lands on the span end; any other bed sheds it from
    the tail. Legacy rows with cover=loop and no region keep the old whole-file restart (the input gets -stream_loop)."""
    import math
    length = b["t_end"] - b["t_start"]
    g = 10 ** (b["gain_db"] / 20)
    expr = f"{g:.6f}"
    for au in b["automation"]:
        mlt = 10 ** (au["rel_db"] / 20)
        r = max(0.05, au["ramp"])
        f = f"clip((t-{au['start']:.3f})/{r:.3f},0,1)*clip(({au['end']:.3f}-t)/{r:.3f},0,1)"
        expr += f"*(1+({mlt:.6f}-1)*{f})"
    fo_st = max(0.0, length - b["fade_out"])
    tail = ((f"afade=t=in:st=0:d={b['fade_in']:.3f}," if b["fade_in"] > 0 else "")
            + f"afade=t=out:st={fo_st:.3f}:d={b['fade_out']:.3f},volume='{expr}':eval=frame,"
            f"adelay={int(round(b['t_start'] * 1000))}|{int(round(b['t_start'] * 1000))}[m{k}]")
    li, lo = b.get("loop_in"), b.get("loop_out")
    if li is not None and lo is not None:
        src_in = b["source_in"]
        avail = max(0.0, file_len - src_in)
        reps = 0 if avail + 0.01 >= length else int(math.ceil((length - avail) / (lo - li)))
        total = avail + reps * (lo - li)
        head = max(0.0, total - length) if b.get("align_end") else 0.0
        b["loop_resolved"] = {"loop_in": li, "loop_out": lo, "extra_passes": reps, "head_trim": round(head, 3),
                              "tail_trim": round(0.0 if b.get("align_end") else max(0.0, total - length), 3)}
        loop = (f"aloop=loop={reps}:size={int(round((lo - li) * 48000))}:start={int(round((li - src_in) * 48000))},"
                if reps > 0 else "")
        return (f"[{k}:a]atrim=start={src_in:.3f},asetpts=PTS-STARTPTS,aformat=sample_rates=48000:channel_layouts=stereo,"
                f"{loop}atrim=start={head:.3f}:end={head + length:.3f},asetpts=PTS-STARTPTS," + tail)
    return (f"[{k}:a]atrim=start={b['source_in']:.3f}:end={b['source_in'] + length:.3f},asetpts=PTS-STARTPTS,"
            f"aformat=sample_rates=48000:channel_layouts=stereo," + tail)


def find_sfx(name):
    for p in SFX_ROOT.rglob(name):
        if "_source" not in p.parts:
            return p
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project_dir")
    ap.add_argument("--video", required=True)
    ap.add_argument("--out", default=None)
    ap.add_argument("--scope", default="ALL")
    ap.add_argument("--sfx-db", type=float, default=-6.0)
    ap.add_argument("--lib-sfx-db", type=float, default=-9.0)
    ap.add_argument("--sfx-max", type=float, default=1.8)
    ap.add_argument("--dry-run", action="store_true", help="resolve and print the beds, render nothing")
    ap.add_argument("--vo", default=None,
                    help="the VOICE track to mix under (default: the project's paused spine assets/spine.mp4 when its length matches "
                         "the video; else the video's own audio). A Remotion render's audio runs 43 to 92 ms LATE against its own "
                         "picture (AAC priming plus stepped drift, golden-kitty 2026-10-02), so the VO is taken from the spine itself.")
    a = ap.parse_args()
    proj = Path(a.project_dir).resolve()
    video = Path(a.video).resolve()
    out = Path(a.out).resolve() if a.out else video.with_name(video.stem + "-mix.mp4")
    paused = sorted(proj.glob(f"spine/{a.scope}.*.paused.json"), key=lambda p: p.name)
    if not paused:
        print("FATAL: no paused sidecar in spine/", file=sys.stderr)
        sys.exit(2)
    meta = json.loads(paused[-1].read_text(encoding="utf-8"))
    PAUSE = float(meta.get("pause_s") or 1.0)
    # every baked pause: title cards (dur = pause_s, a bed breathes at them) AND clip inserts (their own dur, e.g. a 10 s
    # spliced clip whose audio sits in the VO track; no card breath, the plan's automation ducks the bed). 2026-10-08.
    PAUSES = [(float(p["at"]), float(p.get("dur") or PAUSE), bool(p.get("card"))) for p in meta.get("pauses") or []]
    CARD_T = [at for at, _, is_card in PAUSES if is_card]
    total = duration(video)
    vo = Path(a.vo).resolve() if a.vo else (proj / "assets" / "spine.mp4")
    if not (vo.is_file() and abs(duration(vo) - total) <= 0.3):
        if a.vo:
            print(f"FATAL: --vo {vo} missing or not the video's length", file=sys.stderr)
            sys.exit(2)
        vo = video                          # no matching spine: the video's own audio is the VO

    def sh(t):
        return t + sum(dur for at, dur, _ in PAUSES if at <= t + 1e-6)

    def card_start(t):  # paused-spine time where the card at source t begins
        return sh(t) - PAUSE

    plan = json.loads((proj / "MUSIC-PLAN.json").read_text(encoding="utf-8"))
    beds = sorted(plan.get("beds") or [], key=lambda b: float(b["span"][0]))
    resolved_beds = []
    prev_row = None
    for i, b in enumerate(beds):
        s0, s1 = float(b["span"][0]), float(b["span"][1])
        # a card may have been trough-snapped a few hundred ms off the plan's chapter time (137.58 -> 137.46)
        card0 = next((c for c in CARD_T if abs(s0 - c) < 0.35), None)
        card1 = next((c for c in CARD_T if abs(s1 - c) < 0.35), None)
        starts_at_card, ends_at_card = card0 is not None, card1 is not None
        last = i == len(beds) - 1
        # fade_out_sec (optional, golden-kitty 2026-10-02): a bed that hands over to another bed MID-chapter, with no card,
        # needs a real fade for the crossfade; the default 0.25 s is only right for the last bed's stop
        fo = float(b.get("fade_out_sec") or (0.4 if ends_at_card else 0.25))
        t_end_full = card_start(card1) if ends_at_card else min(sh(s1), total)
        t_end = min(total, t_end_full + (fo if ends_at_card else 0.0))
        if not ends_at_card:
            # only the LAST bed runs to the end of the file. A mid-video bed that does not end on a card stops at
            # its own span end (golden-kitty 2026-10-01: CH2 and CH6 continue cardless into CH3 and CH7; the old
            # `t_end = total` kept those rows playing to the end of the video, doubled over the rows after them).
            t_end = total if last else min(total, sh(s1))
        gain_db = float(b.get("remotion_gain_db"))
        # A CARDLESS CONTINUATION: the same file, sample-continuous with the row before it, and no card (so no
        # pause) at the boundary. It is ONE physical placement: extend the previous bed through this row instead
        # of starting a second copy of the file, and keep this row's automation on the merged bed's clock.
        if prev_row is not None and resolved_beds and card0 is None \
                and str(prev_row.get("source_file")) == str(b.get("source_file")) \
                and abs((float(b.get("source_in") or 0.0) - float(prev_row.get("source_in") or 0.0))
                        - (s0 - float(prev_row["span"][0]))) < 0.15:
            rb = resolved_beds[-1]
            rb["t_end"], rb["fade_out"] = round(t_end, 3), fo
            rb["chapter"] = f"{rb['chapter']}+{b.get('chapter')}"
            if abs(gain_db - rb["gain_db"]) > 0.05:      # the row is seated at a different level: a step, not a restart
                rb["automation"].append({"start": sh(s0) - rb["t_start"], "end": sh(s1) - rb["t_start"] + 1.0,
                                         "rel_db": gain_db - rb["gain_db"], "ramp": 0.5})
            for au in b.get("automation") or []:
                w0, w1 = (float(x) for x in au["window"])
                g_au = float(au["gain_db"])
                rel_db = g_au if (au.get("relative") or g_au > -15) else g_au - gain_db
                rb["automation"].append({"start": sh(w0) - rb["t_start"], "end": sh(w1) - rb["t_start"], "rel_db": rel_db,
                                         "ramp": float(au.get("ramp_sec") or 0.2)})
            prev_row = b
            continue
        prev_row = b
        fi = float(b.get("fade_in_sec") or 0.0)
        t_full = sh(s0)
        t_start = max(0.0, t_full - fi) if (starts_at_card or i > 0) else 0.0
        src_in = float(b.get("source_in") or 0.0) - (t_full - t_start)  # so the plan's file position lands on the first word
        autom = []
        for au in b.get("automation") or []:
            w0, w1 = (float(x) for x in au["window"])
            g_au = float(au["gain_db"])
            # a window's gain_db is ABSOLUTE (a seat like -34.1 dB) unless the row says `relative: true`
            # or the value is plainly a dip (> -15 dB, e.g. the -4.2 dB vibe-cut duck)
            rel_db = g_au if (au.get("relative") or g_au > -15) else g_au - gain_db
            autom.append({"start": sh(w0) - t_start, "end": sh(w1) - t_start, "rel_db": rel_db, "ramp": float(au.get("ramp_sec") or 0.2)})
        resolved_beds.append({"chapter": b.get("chapter"), "file": str((REPO / b["source_file"]).resolve() if not Path(b["source_file"]).is_absolute() else b["source_file"]),
                              "t_start": round(t_start, 3), "t_end": round(t_end, 3), "source_in": round(max(0.0, src_in), 3),
                              "fade_in": fi if t_start < t_full else 0.0, "fade_out": fo, "gain_db": gain_db, "loop": str(b.get("cover", "")).lower() == "loop",
                              "loop_in": _num(b.get("loop_in_sec", b.get("loop_point_sec"))) if b.get("loop_out_sec") is not None else None,
                              "loop_out": _num(b.get("loop_out_sec")),
                              "align_end": bool(b.get("align_end")) or str(b.get("align", "")).lower() == "end" or last,
                              "automation": autom})
    # CLIP INSERTS duck the bed automatically (2026-10-08, every-job R17): a spliced clip's voice sits in the VO track over
    # a baked pause, so every bed that overlaps the insert's paused-time window dips INSERT_DUCK_DB with a short ramp.
    INSERT_DUCK_DB, INSERT_RAMP = -14.0, 0.3
    for at, dur, is_card in PAUSES:
        if is_card:
            continue
        ps = at + sum(d for a2, d, _ in PAUSES if a2 < at - 1e-6)       # paused time where the insert begins
        pe = ps + dur
        for rb in resolved_beds:
            if rb["t_start"] < pe and rb["t_end"] > ps:
                rb["automation"].append({"start": round(max(0.0, ps - rb["t_start"]), 3), "end": round(min(rb["t_end"], pe) - rb["t_start"], 3),
                                         "rel_db": INSERT_DUCK_DB, "ramp": INSERT_RAMP, "why": f"clip insert at source {at} ({dur:.1f}s)"})
    # SFX rows from the event log
    ep = (proj / "EDIT-PLAN.md").read_text(encoding="utf-8")
    ep_lines = ep.split("\n")
    card_turn = 0.37
    tp_rows = json.loads((proj / "TRANSITION-PLAN.json").read_text(encoding="utf-8")).get("transitions") or [] if (proj / "TRANSITION-PLAN.json").is_file() else []
    for r in tp_rows:
        if str(r.get("role")) == "card" and r.get("duration_s"):
            card_turn = float(r["duration_s"])
    sfx, seen_rows = [], set()
    for m in SFX_ROW_RE.finditer(ep):  # rows with an explicit `file start` / `starts at`
        kind, fname, _, start = m.group(1), m.group(2).strip(), m.group(3), m.group(4)
        path = find_sfx(fname)
        if not path:
            print(f"  warn  SFX file not found in assets/sfx: {fname}")
            continue
        t_src = tc(start)
        seen_rows.add(ep.count("\n", 0, m.start()))
        sfx.append({"kind": kind, "file": str(path), "t": round(sh(t_src), 3), "source_t": t_src, "gain_db": a.sfx_db})
    # rows WITHOUT an explicit start (e.g. the card impacts "on the card's landing frame"): the row's own time;
    # a [CARD] row lands at card start + the card turn
    for i, ln in enumerate(ep_lines):
        mm = re.search(r"\[(IMPACT|RISER)[^\]]*\]\s*(?:[^\n]{0,60}?)?([A-Za-z0-9_ .()-]+?\.(?:wav|mp3))", ln)
        if not mm or i in seen_rows or any(abs(i - s) <= 1 for s in seen_rows):
            continue
        j = i
        while j >= 0 and not EVENT_RE.match(ep_lines[j]):
            j -= 1
        if j < 0:
            continue
        e = EVENT_RE.match(ep_lines[j])
        t_src = int(e.group(1)) * 60 + float(e.group(2))
        path = find_sfx(mm.group(2).strip())
        if not path:
            print(f"  warn  SFX file not found in assets/sfx: {mm.group(2)}")
            continue
        is_card = "[CARD]" in ep_lines[j]
        card = next((c for c in CARD_T if abs(c - t_src) < 0.35), None) if is_card else None
        t_out = (card_start(card) + card_turn) if card is not None else sh(t_src)
        sfx.append({"kind": mm.group(1), "file": str(path), "t": round(t_out, 3), "source_t": t_src, "gain_db": a.sfx_db,
                    "placed": "card landing" if card is not None else "row time"})
    sfx.sort(key=lambda s: s["t"])
    # library transition SFX
    lib_sfx = []
    tp = proj / "TRANSITION-PLAN.json"
    if tp.is_file() and LIB.is_file():
        raw = json.loads(LIB.read_text(encoding="utf-8"))
        rows = {r["id"]: r for r in (raw if isinstance(raw, list) else (raw.get("rows") or raw.get("transitions") or next(iter(raw.values())))) if isinstance(r, dict)}
        for r in json.loads(tp.read_text(encoding="utf-8")).get("transitions") or []:
            tid = str(r.get("id", ""))
            if not tid.startswith("lib:"):
                continue
            row = rows.get(tid[4:]) or {}
            rel = row.get("sfx") or (row.get("params") or {}).get("sfx")
            if not rel:
                continue
            p = None
            for base in (proj / "assets", TR_ROOT, TR_ROOT.parent):
                cand = base / rel
                if cand.is_file():
                    p = cand
                    break
            if not p:
                print(f"  warn  library sfx missing on disk: {rel}")
                continue
            dur = float(r.get("duration_s") or 0.5)
            lib_sfx.append({"id": tid, "file": str(p), "t": round(max(0.0, sh(float(r["tc"])) - dur / 2), 3), "gain_db": a.lib_sfx_db})
    print(f"MIX-PLAN beds={len(resolved_beds)} sfx={len(sfx)} lib_sfx={len(lib_sfx)}")
    if a.dry_run:      # resolve only: show where every bed starts and stops, render nothing, write nothing
        for b in resolved_beds:
            print(f"  BED {b['chapter']:10} {b['t_start']:8.3f} -> {b['t_end']:8.3f}  file@{b['source_in']:.3f}  gain {b['gain_db']} dB  "
                  f"fade in {b['fade_in']} / out {b['fade_out']}  automation {len(b['automation'])}  {Path(b['file']).name}")
            if b.get("loop_in") is not None and b.get("loop_out") is not None:
                bed_chain(0, b, duration(b["file"]))   # resolve the loop for the report
                lr = b["loop_resolved"]
                print(f"      LOOP {lr['loop_in']:.3f}-{lr['loop_out']:.3f}s x{lr['extra_passes']} extra pass(es), head trim {lr['head_trim']}s, "
                      f"tail trim {lr['tail_trim']}s, {'END-aligned' if b.get('align_end') else 'start-aligned'}")
            elif b["loop"]:
                print("      LOOP: whole-file restart (no region given; music.md wants loop_in_sec/loop_out_sec)")
        print("DRY-RUN (nothing rendered)")
        return

    # ── filter graph ────────────────────────────────────────────────────────────────────
    inputs = ["-i", str(video), "-i", str(vo)]          # 0 = picture, 1 = the VO (the spine's audio, or the video's own)
    chains, labels = [], []
    k = 2
    for b in resolved_beds:
        file_len = duration(b["file"])
        has_region = b.get("loop_in") is not None and b.get("loop_out") is not None
        if b["loop"] and not has_region:
            print(f"WARN bed {b['chapter']}: cover=loop with no loop_in_sec/loop_out_sec, falling back to a whole-file restart "
                  "(music.md: loops are bar-aligned section repeats; give the region)", flush=True)
            inputs += ["-stream_loop", "-1"]
        inputs += ["-i", b["file"]]
        chains.append(bed_chain(k, b, file_len))
        labels.append(f"[m{k}]")
        k += 1
    for s in sfx + lib_sfx:
        inputs += ["-i", s["file"]]
        d = duration(s["file"])
        trim = ""
        if d > a.sfx_max:
            trim = f"atrim=end={a.sfx_max:.2f},afade=t=out:st={a.sfx_max - 0.5:.2f}:d=0.5,"
        chains.append(f"[{k}:a]{trim}aformat=sample_rates=48000:channel_layouts=stereo,volume={10 ** (s['gain_db'] / 20):.4f},"
                      f"adelay={int(round(s['t'] * 1000))}|{int(round(s['t'] * 1000))}[s{k}]")
        labels.append(f"[s{k}]")
        k += 1
    n = 1 + len(labels)
    fc = ";".join(chains) + (";" if chains else "") + "[1:a]" + "".join(labels) + f"amix=inputs={n}:normalize=0:duration=first[ao]"
    cmd = ["ffmpeg", "-y", "-loglevel", "error", *inputs, "-filter_complex", fc, "-map", "0:v", "-c:v", "copy", "-map", "[ao]",
           "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", str(out)]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print("FATAL: ffmpeg failed\n" + r.stderr[-1500:], file=sys.stderr)
        sys.exit(1)
    li, _ = lufs_and_peak(vo)
    lo, po = lufs_and_peak(out)
    side = proj / "mix-audio.json"
    side.write_text(json.dumps({"video": str(video), "vo": str(vo), "out": str(out), "card_t": CARD_T, "pause_s": PAUSE, "pauses": [{"at": a, "dur": d, "card": c} for a, d, c in PAUSES], "beds": resolved_beds,
                                "sfx": sfx, "lib_sfx": lib_sfx, "lufs_in": li, "lufs_out": lo, "peak_out_dbfs": po,
                                "rerun": f"python video-creation/longform-edited/scripts/mix_music.py \"{proj}\" --video \"{video}\""},
                               indent=2), encoding="utf-8")
    print(f"MIX-DONE out={out} dur={duration(out):.3f} lufs_in={li} lufs_out={lo} peak_out={po} vo={'spine' if vo != video else 'video'}")
    print(f"WROTE {side}")
    print("PROGRESS 100%")


if __name__ == "__main__":
    main()
