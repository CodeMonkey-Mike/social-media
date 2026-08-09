"""finish_batch.py — CANONICAL Phase 5C + 6 "finish" (livestream-repurpose shorts, Wave 4).

Runs AFTER Mike's 2nd review of the tightened+desilenced clips — the invocation itself is the
record of his approval (the human decision travels IN the invocation, same contract as the
tighten segment's --min-sil). Takes every surviving clip from tightened+desilenced spine to
build-ready:

  fillers     Phase 5C. Per clip: if shorts/<batch>/filler-plan.json has approved spans for
              the slug, excise them via the canonical cut_fillers.py (RMS snap, 8 ms declick,
              its own 8% ceiling + overlap aborts); otherwise PASSTHROUGH-COPY. Either way
              every clip ends with <slug>/<slug>-final.mp4 — downstream never special-cases.
              The plan file is OPTIONAL (no file = no spans = all passthrough): most batches
              skip 5C, and the span list is JUDGMENT — filler_map.py proposes, a human/LLM
              adjudicates (stall-phrase / discourse-like false positives), the approved spans
              land in filler-plan.json BEFORE this runs. This script never invents cuts.
              Results -> filler_log.json.
  transcribe  Phase 6 caption source: canonical transcribe_clips.py --force re-transcribes
              every clip's -final.mp4 (word timestamps -> <clip>/whisper-words.json). Always
              --force: a pre-5C whisper-words.json against a post-5C spine drifts every
              caption after the first splice.
  assets      Stage render-assets/: canonical setup_render_assets.py GOP re-encodes each
              -final spine to render-assets/<slug>.mp4 (seek-friendly -g 25 -bf 0; the
              "No frame found at position N" prevention) — the render copy only, the clip
              folder's spine untouched.
  finalize    Dashboard rebuilt IN PLACE (canonical builder, status "filler-cut (final)") +
              progress.json flipped to the ready-for-build gate (output_mp4 -> -final.mp4,
              per-clip whisper_words recorded). REFUSES to touch a batch already past this
              stage (--force to override).
  all         everything (the manual one-shot; the graph runs stages as separate nodes).

What this deliberately does NOT touch (the judgment seams stay seams):
  - filler span adjudication (see above; skills/filler-removal/filler-removal.md)
  - caption corrections (PHRASE_CORRECTIONS / PROTECTED_DOUBLES / verified-words patches)
    — those live in the Phase 7 builder loop against the clip's OWN audio
  - everything Phase 7: BROLL-PLAN, ChatGPT b-roll (browser stack, ports LAST per the
    2026-08-02 decision of record), comp authoring, SFX, renders, the finalized-short gate

Usage:
    python video-creation/livestream-repurpose/scripts/finish_batch.py --batch <batch>
        [--stage all|fillers|transcribe|assets|finalize] [--plan PATH] [--out-base DIR]
        [--shorts-root DIR] [--assets-root DIR] [--model medium] [--title TEXT]
        [--subtitle TEXT] [--force]

Defaults: plan = shorts/<batch>/filler-plan.json (optional) · out-base =
video-creation/shorts/<batch> · model = medium.

Prints PROGRESS n% + per-clip FILLER/TRANSCRIBED/SPINE lines (graph heartbeat) and
machine-readable LOG= / DASHBOARD= / PROGRESSFILE= / STAGE-DONE lines (graph verification).
"""
import argparse
import json
import shutil
import subprocess
import sys
from datetime import datetime
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

HERE = Path(__file__).resolve().parent
REPO_ROOT = HERE.parents[2]
sys.path.insert(0, str(REPO_ROOT / "video-creation" / "shorts" / "_tooling"))
from build_clip_dashboard import build_dashboard          # noqa: E402

CUT_FILLERS = (REPO_ROOT / "video-creation" / "skills" / "filler-removal" / "scripts"
               / "cut_fillers.py")
TRANSCRIBE = (REPO_ROOT / "video-creation" / "shorts" / "_tooling" / "transcribe_clips.py")
SETUP_ASSETS = HERE / "setup_render_assets.py"

FILLER_CAP = 0.08          # cut_fillers.py's own hard ceiling, pre-checked here (fail fast)
SNAP_TOL = 0.10            # cut_fillers may move each boundary +/- this to the RMS minimum

# progress.json phases that mean the batch has NOT yet passed the finish stage
NOT_PAST_FINISH = (None, "cut", "tightened", "5B-desilenced", "5C-final", "6-transcribed")


def die(msg):
    print(f"FATAL: {msg}", file=sys.stderr, flush=True)
    sys.exit(2)


def dur(p):
    try:
        return float(subprocess.check_output(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration",
             "-of", "csv=p=0", str(p)]).decode().strip())
    except Exception:
        return None


def load_progress(out_base: Path):
    p = out_base / "progress.json"
    if not p.is_file():
        die(f"progress.json not found: {p} (the finish stage runs on a batch the cut/tighten "
            "graphs already initialized)")
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception as e:
        die(f"progress.json unparseable: {e}")


def resolve_spine(out_base: Path, clip: dict) -> Path:
    """The tightened+desilenced spine the 5C pass consumes (NOT -final: that's our output)."""
    slug = clip["slug"]
    om = clip.get("output_mp4")
    if om and not om.endswith("-final.mp4"):
        p = out_base / om
        if p.is_file():
            return p
    for name in (f"{slug}-tightened-desilenced.mp4", f"{slug}-tightened.mp4"):
        p = out_base / slug / name
        if p.is_file():
            return p
    die(f"{slug}: no tightened spine found under {out_base / slug}")


def validate_filler_plan(plan, prog_clips, spine_durs):
    """Fail-fast checks + per-clip measures. ONE source of truth: run.py imports this.
    Returns {slug: {"spans": [...], "removed_s": float, "base_s": float}} for EVERY
    surviving clip (empty spans = passthrough)."""
    by_slug = {}
    plan_clips = (plan or {}).get("clips", [])
    known = {c["slug"] for c in prog_clips}
    for pc in plan_clips:
        slug = pc.get("slug")
        if slug not in known:
            die(f"filler-plan.json names unknown clip {slug!r} (not in progress.json)")
        if slug in by_slug:
            die(f"filler-plan.json lists {slug!r} twice")
        spans = pc.get("spans", [])
        base = spine_durs[slug]
        prev_end = -1.0
        for s in sorted(spans, key=lambda x: x["start"]):
            a, b = float(s["start"]), float(s["end"])
            if not (0 <= a < b <= base + 0.05):
                die(f"{slug}: span {a:.2f}-{b:.2f} outside the clip (0-{base:.2f}s)")
            if a < prev_end:
                die(f"{slug}: overlapping spans at {a:.2f}")
            prev_end = b
        removed = sum(float(s["end"]) - float(s["start"]) for s in spans)
        if base and removed / base > FILLER_CAP:
            die(f"{slug}: plan removes {removed / base:.1%} (ceiling {FILLER_CAP:.0%}) — "
                "review the span list")
        by_slug[slug] = {"spans": spans, "removed_s": removed, "base_s": base}
    for c in prog_clips:
        by_slug.setdefault(c["slug"], {"spans": [], "removed_s": 0.0,
                                       "base_s": spine_durs[c["slug"]]})
    return by_slug


def stage_fillers(out_base: Path, prog_clips, measures):
    log = []
    for i, c in enumerate(prog_clips):
        slug, n = c["slug"], c.get("n")
        m = measures[slug]
        src = resolve_spine(out_base, c)
        final = out_base / slug / f"{slug}-final.mp4"
        if m["spans"]:
            spans_path = out_base / slug / "filler-spans.json"
            spans_path.write_text(json.dumps(m["spans"], indent=1), encoding="utf-8")
            rc = subprocess.run(
                [sys.executable, "-u", str(CUT_FILLERS), str(src),
                 "--spans", str(spans_path), "--out", str(final)],
                capture_output=True, text=True, encoding="utf-8", errors="replace")
            sys.stdout.write(rc.stdout)
            if rc.returncode != 0:
                sys.stderr.write(rc.stderr)
                die(f"{slug}: cut_fillers.py exit {rc.returncode}")
            try:
                result = json.loads(rc.stdout[rc.stdout.index("{"):])
            except Exception:
                die(f"{slug}: cut_fillers.py output was not the expected JSON")
            entry = {"n": n, "slug": slug, "mode": "cut", "in_s": result["in_s"],
                     "out_s": result["out_s"], "removed_s": result["removed_s"],
                     "removed_pct": result["removed_pct"], "cuts": result["cuts"]}
        else:
            shutil.copyfile(src, final)
            d = dur(final)
            if d is None:
                die(f"{slug}: passthrough copy unreadable: {final}")
            entry = {"n": n, "slug": slug, "mode": "passthrough",
                     "in_s": round(m["base_s"], 2), "out_s": round(d, 2),
                     "removed_s": 0.0, "removed_pct": 0.0, "cuts": []}
        entry["src"] = src.name
        log.append(entry)
        print(f"FILLER n={n} slug={slug} mode={entry['mode']} "
              f"removed={entry['removed_s']:.2f} out={entry['out_s']:.3f}", flush=True)
        print(f"PROGRESS {int(100 * (i + 1) / len(prog_clips))}% "
              f"clip {i + 1}/{len(prog_clips)}", flush=True)
    log_path = out_base / "filler_log.json"
    log_path.write_text(json.dumps(log, indent=2), encoding="utf-8")
    print(f"LOG={log_path}", flush=True)
    print("STAGE-DONE fillers", flush=True)


def stage_transcribe(args, out_base: Path):
    cmd = [sys.executable, "-u", str(TRANSCRIBE), args.batch, "--model", args.model,
           "--force", "--shorts-root", str(out_base.parent)]
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                            text=True, encoding="utf-8", errors="replace")
    for line in proc.stdout:
        print(line, end="", flush=True)
    proc.wait()
    if proc.returncode != 0:
        die(f"transcribe_clips.py exit {proc.returncode}")
    print("STAGE-DONE transcribe", flush=True)


def stage_assets(args, out_base: Path):
    cmd = [sys.executable, "-u", str(SETUP_ASSETS), args.batch,
           "--out-base", str(out_base)]
    if args.assets_root:
        cmd += ["--assets-root", args.assets_root]
    if args.force:
        cmd += ["--force"]
    proc = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                            text=True, encoding="utf-8", errors="replace")
    for line in proc.stdout:
        print(line, end="", flush=True)
    proc.wait()
    if proc.returncode != 0:
        die(f"setup_render_assets.py exit {proc.returncode}")
    # STAGE-DONE assets printed by setup_render_assets.py itself


def stage_finalize(args, out_base: Path):
    log_path = out_base / "filler_log.json"
    if not log_path.is_file():
        die(f"finalize needs {log_path} — run --stage fillers first")
    log = json.loads(log_path.read_text(encoding="utf-8"))
    by_slug = {e["slug"]: e for e in log}

    prog = load_progress(out_base)
    past = [c.get("slug") for c in prog.get("clips", [])
            if c.get("slug") in by_slug and c.get("phase") not in NOT_PAST_FINISH]
    if past and not args.force:
        die(f"progress.json clips already past the finish stage: {past} — refusing to reset "
            "(re-run with --force only if you mean to re-finish a built batch)")

    cards = []
    for e in log:
        slug = e["slug"]
        pc = next((c for c in prog.get("clips", []) if c.get("slug") == slug), {})
        words = "?"
        ww = out_base / slug / "whisper-words.json"
        if ww.is_file():
            try:
                wj = json.loads(ww.read_text(encoding="utf-8"))
                words = sum(len(s.get("words", [])) for s in wj.get("segments", []))
            except Exception:
                pass
        five_c = (f"{len(e['cuts'])} filler cut(s) = -{e['removed_s']:.1f}s"
                  if e["mode"] == "cut" else "no approved spans (passthrough)")
        cards.append(dict(
            n=e["n"], title=pc.get("title", slug),
            video=f"{slug}/{slug}-final.mp4", variant=pc.get("variant", "full"),
            status="filler-cut (final)", duration=e["out_s"],
            src=f"5C: {five_c} - final {e['out_s']:.1f}s - {words} words transcribed - "
                "render-assets staged (GOP 25)",
            note=(pc.get("note", "") or "")[:600],
        ))

    dash = build_dashboard(
        args.batch, str(out_base), cards,
        title=args.title or f"{args.batch} — 5C final + transcribed, ready for build",
        subtitle_extra=args.subtitle or
        "final spines (-final.mp4) + whisper-words + render-assets staged; "
        "next: remotion-builder (7) per clip, then publish (8)")
    print(f"DASHBOARD={dash}", flush=True)

    prog.setdefault("batch", args.batch)
    prog["phase"] = "6-transcribed"
    prog["status"] = "ready-for-build"
    prog["last_updated"] = datetime.now().isoformat(timespec="seconds")
    prog["dashboard_status"] = ("5C + captions source done; spines final, render-assets "
                                "staged. Next: remotion-builder (7) per clip "
                                "(ChatGPT b-roll stays in the builder), then publish (8).")
    prog["filler_log"] = f"video-creation/shorts/{args.batch}/filler_log.json"
    for c in prog.get("clips", []):
        e = by_slug.get(c.get("slug"))
        if e:
            c["duration_seconds"] = e["out_s"]
            c["output_mp4"] = f"{c['slug']}/{c['slug']}-final.mp4"
            c["whisper_words"] = f"{c['slug']}/whisper-words.json"
            c["phase"] = "6-transcribed"
            c["gate"] = "ready-for-build"
    (out_base / "progress.json").write_text(json.dumps(prog, indent=2), encoding="utf-8")
    print(f"PROGRESSFILE={out_base / 'progress.json'}", flush=True)
    print("STAGE-DONE finalize", flush=True)


def main():
    ap = argparse.ArgumentParser(description="Canonical Phase 5C + 6 finish (Wave 4).")
    ap.add_argument("--batch", required=True)
    ap.add_argument("--stage", choices=["all", "fillers", "transcribe", "assets", "finalize"],
                    default="all")
    ap.add_argument("--plan", default=None, help="filler-plan.json (OPTIONAL — absent = "
                                                 "no approved spans = all passthrough)")
    ap.add_argument("--out-base", default=None)
    ap.add_argument("--assets-root", default=None,
                    help="shared assets root override (sandbox runs)")
    ap.add_argument("--model", default="medium", help="whisper model (default medium)")
    ap.add_argument("--title", default=None)
    ap.add_argument("--subtitle", default=None)
    ap.add_argument("--force", action="store_true",
                    help="let finalize reset progress entries already past this stage / "
                         "re-encode current render-assets spines")
    args = ap.parse_args()

    out_base = Path(args.out_base) if args.out_base else (
        REPO_ROOT / "video-creation" / "shorts" / args.batch)
    prog = load_progress(out_base)
    prog_clips = [c for c in prog.get("clips", []) if c.get("slug")]
    if not prog_clips:
        die("progress.json has no clips")

    plan_path = Path(args.plan) if args.plan else out_base / "filler-plan.json"
    plan = None
    if plan_path.is_file():
        try:
            plan = json.loads(plan_path.read_text(encoding="utf-8"))
        except Exception as e:
            die(f"filler-plan.json is not valid JSON: {e}")

    spine_durs = {}
    for c in prog_clips:
        d = dur(resolve_spine(out_base, c))
        if d is None:
            die(f"{c['slug']}: cannot probe the tightened spine")
        spine_durs[c["slug"]] = d
    measures = validate_filler_plan(plan, prog_clips, spine_durs)

    n_span = sum(1 for m in measures.values() if m["spans"])
    print(f"finish_batch | batch {args.batch} | {len(prog_clips)} clips | stage {args.stage} "
          f"| filler plan: {n_span} clip(s) with spans"
          + ("" if plan is not None else " (no filler-plan.json — all passthrough)"),
          flush=True)

    if args.stage in ("all", "fillers"):
        stage_fillers(out_base, prog_clips, measures)
    if args.stage in ("all", "transcribe"):
        stage_transcribe(args, out_base)
    if args.stage in ("all", "assets"):
        stage_assets(args, out_base)
    if args.stage in ("all", "finalize"):
        stage_finalize(args, out_base)


if __name__ == "__main__":
    main()
