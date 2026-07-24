#!/usr/bin/env python
"""
analyze-music.py — measure waveform-energy metadata for tracks in assets/music/library.json.

Per audio file (full master + every top-level section cut in the track folder; stems and
_waveforms subfolders are ignored) it computes a machine-written `analysis` block:

  mean_db / max_db   overall RMS dBFS + peak sample dBFS (matches ffmpeg volumedetect)
  env                the waveform as text: RMS per 2s window, quantized 0-9 on an ABSOLUTE
                     scale (digit d covers [-36+3d, -33+3d) dBFS; 0 = quieter than -36,
                     9 = louder than -9). Comparable across files. char_index*2 = seconds.
  env_win_sec        window size for env (2)
  aggression         0-100: 35% loudness (mean_db mapped -30..-8) + 65% transient density
                     (onsets/sec 0..3+, measured on the high-pass-differenced signal).
                     Punchy drums score high, loud-but-smooth pads score low.
  segments           env merged into runs: {t:[start,end] sec, level: low|mid|high,
                     kind: intro|build|peak|bed|breakdown|outro}
  opening            cold_hot | build | ambient | steady   (first 8s vs the track)
  ending             epic_hit | hard_stop | fade | resolve (shape of the final windows)

Track-level it also derives `roles[]` (controlled vocab, v1 measured-only rules:
intro_hype, hype_peak, explainer_bed, epic_outro; mood-aware rules like `tension`
need Soundstripe metadata and come later), upgrades `sections[]` from filename strings
to objects {file, mix, role, len_sec, analysis}, removes the superseded ad-hoc
`energy_measured` block if present, and stamps analysis_complete/analyzed_at.

Usage:
  python analyze-music.py <track-id> [--dry-run]
  python analyze-music.py --all      [--dry-run]      (skips already-analyzed tracks)
  python analyze-music.py --all --limit N             (next N unanalyzed tracks, then stop)
  python analyze-music.py --all --force               (re-analyze everything)
  python analyze-music.py --file <path> [...]         (analyze ANY audio file(s), print JSON
                                                       to stdout, write nothing — for music not
                                                       in the library, e.g. project-local beds)

ALL analysis fields are machine-written by this script. Do not hand-edit them; re-run
the script instead. Human judgment lives in vibe / roles_pinned / used_in / *_note.
"""

import json
import math
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

import numpy as np

SCRIPT_DIR = Path(__file__).resolve().parent
VC_ROOT = SCRIPT_DIR.parent.parent.parent          # .../video-creation
LIBRARY = VC_ROOT / "assets" / "music" / "library.json"

SR = 22050
ENV_WIN_SEC = 2
AUDIO_EXTS = {".wav", ".mp3"}
EPS = 1e-12

ANALYSIS_NOTE = (
    "analysis blocks are MACHINE-WRITTEN by skills/music-sourcing/scripts/analyze-music.py; "
    "never hand-edit them, re-run the script. env = RMS per 2s window quantized 0-9 on an "
    "absolute dBFS scale (digit d covers -36+3d to -33+3d; 0 = under -36, 9 = over -9), so "
    "digits are comparable across files and char_index*2 = seconds into the file. "
    "mean_db/max_db use ffmpeg volumedetect semantics (mean power across all channels, no downmix). "
    "aggression 0-100 = 35% loudness (mean_db -30..-8) + 65% transient density (onsets/sec 0..3, "
    "measured on the high-pass-differenced signal): punchy drums score high, loud smooth pads low. "
    "segments merge env into runs (level low 0-3 / mid 4-6 / high 7-9; kind intro|build|peak|bed|"
    "breakdown|outro). opening: cold_hot|build|ambient|steady. ending: epic_hit|hard_stop|fade|resolve. "
    "roles[] is derived by rule from the analysis (v1 measured-only: intro_hype, hype_peak, "
    "explainer_bed, epic_outro; reserved for later, mood-aware: tension). Manual role overrides go "
    "in roles_pinned[] which the script never touches. sections[] objects: mix = instrumental|"
    "bg_vocals, role = intro|verse|chorus|bridge|full|null (parsed from the Soundstripe filename; "
    "full = matches master duration)."
)


# ---------- decoding + measurement ----------
# Loudness semantics = ffmpeg volumedetect: mean power over ALL samples of ALL channels
# (no mono downmix; ffmpeg's default downmix normalization inflates correlated content
# ~2-3 dB, which would break comparability with the catalog's historical numbers).

def decode_audio(path: Path) -> np.ndarray:
    """Decode to float32 at SR, native channels, shaped (n_frames, ch)."""
    probe = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "a:0",
         "-show_entries", "stream=channels", "-of", "csv=p=0", str(path)],
        capture_output=True, check=True, text=True)
    ch = max(1, int(probe.stdout.strip() or 1))
    out = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(path), "-ar", str(SR), "-f", "f32le", "-"],
        capture_output=True, check=True).stdout
    x = np.frombuffer(out, dtype=np.float32)
    return x[: len(x) - len(x) % ch].reshape(-1, ch)


def rms_db(x: np.ndarray) -> float:
    return 10.0 * math.log10(float(np.mean(x.astype(np.float64) ** 2)) + EPS)


def env_digits(x: np.ndarray) -> list[int]:
    """RMS dB per ENV_WIN_SEC window -> digit 0-9 on the absolute scale."""
    win = SR * ENV_WIN_SEC
    digits = []
    for i in range(0, len(x), win):
        chunk = x[i:i + win]
        if len(chunk) < SR // 2:      # ignore a trailing sliver under 0.5s
            break
        db = rms_db(chunk)
        digits.append(max(0, min(9, int((db + 36) // 3))))
    return digits


def onset_rate(x: np.ndarray) -> float:
    """Transients/sec. Detected on the first-differenced signal (a 6 dB/oct high-pass)
    so drum/pluck attacks register even when sustained pads fill the mix floor."""
    d = np.diff(x.astype(np.float64), axis=0)
    win, hop = 1024, 512
    n = (len(d) - win) // hop
    if n < 4:
        return 0.0
    idx = np.arange(n)[:, None] * hop + np.arange(win)[None, :]
    rms = np.sqrt(np.mean(d[idx] ** 2, axis=(1, 2)))
    floor_db = rms_db(x) - 18                      # ignore frames far under the track's own level
    floor = 10 ** (floor_db / 20)
    rel = np.diff(rms) / np.maximum(rms[:-1], EPS)
    hits = (rel > 0.25) & (rms[1:] > floor)
    # enforce >=5 hops (~116ms) spacing so one drum hit counts once
    count, last = 0, -10
    for i in np.flatnonzero(hits):
        if i - last >= 5:
            count += 1
            last = i
    return count / (len(x) / SR)


def aggression_score(mean_db: float, onsets_per_sec: float) -> int:
    # punch-weighted: "aggressive" means punchy, not merely loud-mastered
    # (a loud ambient pad should read low, a driving drum mix high)
    loud = max(0.0, min(1.0, (mean_db + 30) / 22))        # -30 -> 0, -8 -> 1
    punch = max(0.0, min(1.0, onsets_per_sec / 3.0))      # 3+/sec -> 1
    return round(100 * (0.35 * loud + 0.65 * punch))


# ---------- shape classification ----------

LEVEL_RANK = {"low": 0, "mid": 1, "high": 2}


def level_of(digit: int) -> str:
    return "low" if digit <= 3 else ("mid" if digit <= 6 else "high")


def segment_runs(digits: list[int]) -> list[dict]:
    n = len(digits)
    if n == 0:
        return []
    min_run = min(3, max(1, n // 3))
    runs = []                                              # [level, start_win, end_win)
    for i, d in enumerate(digits):
        lv = level_of(d)
        if runs and runs[-1][0] == lv:
            runs[-1][2] = i + 1
        else:
            runs.append([lv, i, i + 1])
    merged = []
    for r in runs:                                         # absorb short runs into the previous
        if merged and (r[2] - r[1]) < min_run:
            merged[-1][2] = r[2]
        else:
            merged.append(r)
    if len(merged) >= 2 and (merged[0][2] - merged[0][1]) < min_run:
        merged[1][1] = merged[0][1]                        # short FIRST run folds forward
        merged.pop(0)
    dedup = []                                             # re-merge same-level neighbors
    for r in merged:
        if dedup and dedup[-1][0] == r[0]:
            dedup[-1][2] = r[2]
        else:
            dedup.append(r)
    segs = []
    for i, (lv, a, b) in enumerate(dedup):
        last = i == len(dedup) - 1
        if last and i > 0 and LEVEL_RANK[lv] < LEVEL_RANK[dedup[i - 1][0]]:
            kind = "outro"                                 # only a distinct final drop-off
        elif lv == "high":
            kind = "peak"
        elif lv == "mid":
            kind = "build" if (not last and dedup[i + 1][0] == "high") else "bed"
        else:  # low
            if i == 0 and not last:
                kind = "intro"
            elif not last and dedup[i + 1][0] in ("mid", "high"):
                kind = "build"
            else:
                kind = "breakdown"
        segs.append({"t": [a * ENV_WIN_SEC, b * ENV_WIN_SEC], "level": lv, "kind": kind})
    return segs


def classify_opening(digits: list[int], x: np.ndarray, track_mean_db: float,
                     aggression: int) -> str:
    if digits and digits[0] >= 7 and aggression >= 60:
        return "cold_hot"                                  # slams in at full level from bar 1
    first = x[: 8 * SR]
    if len(first) < SR:
        return "steady"
    f8 = rms_db(first)
    if f8 <= track_mean_db - 4:
        return "build"                                     # starts well under its own body
    if aggression <= 45:
        return "ambient"
    return "steady"


def classify_ending(digits: list[int]) -> str:
    n = len(digits)
    if n < 3:
        return "resolve"
    highs = [i for i, d in enumerate(digits) if d >= 7]
    tail_slice = digits[-5:]
    monotonic_decline = all(b <= a + 1 for a, b in zip(tail_slice, tail_slice[1:])) and \
        tail_slice[0] - tail_slice[-1] >= 3
    if highs:
        tail = (n - 1) - highs[-1]
        if tail == 0:
            return "hard_stop"                             # peak into the wall (section cuts)
        if tail <= 2 or (tail <= 4 and digits[-1] <= 1):
            return "epic_hit"                              # final hit + ring-out (up to ~8s tail)
    return "fade" if monotonic_decline else "resolve"


# ---------- per-file + per-track ----------

def analyze_file(path: Path) -> dict:
    x = decode_audio(path)
    digits = env_digits(x)
    mean = rms_db(x)
    peak = 20.0 * math.log10(float(np.max(np.abs(x))) + EPS)
    aggr = aggression_score(mean, onset_rate(x))
    return {
        "duration_sec": round(len(x) / SR),
        "mean_db": round(mean, 1),
        "max_db": round(peak, 1),
        "aggression": aggr,
        "env": "".join(str(d) for d in digits),
        "env_win_sec": ENV_WIN_SEC,
        "segments": segment_runs(digits),
        "opening": classify_opening(digits, x, mean, aggr),
        "ending": classify_ending(digits),
    }


def parse_mix(name: str) -> str | None:
    low = name.lower()
    if "background_vocals" in low:
        return "bg_vocals"
    if "instrumental" in low:
        return "instrumental"
    return None


def parse_role(name: str, dur: int, primary_dur: int | None) -> str | None:
    low = name.lower()
    for role in ("intro", "verse", "chorus", "bridge", "full"):
        if f"_{role}_" in low or low.startswith(role + "_"):
            return role
    if primary_dur and abs(dur - primary_dur) <= 4:
        return "full"
    return None


def derive_roles(track: dict) -> list[str]:
    roles = set()
    files = [("primary", track.get("analysis"), parse_mix(track.get("primary_file", "")))]
    for s in track.get("sections", []):
        if isinstance(s, dict):
            files.append((s["file"], s.get("analysis"), s.get("mix")))
    for tag, a, mix in files:
        if not a:
            continue
        if a["aggression"] >= 60:
            roles.add("hype_peak")
            if a["opening"] != "ambient":
                roles.add("intro_hype")
        if a["aggression"] <= 45 and mix == "instrumental":
            roles.add("explainer_bed")
        segs = a.get("segments") or []
        # a section cut's hard_stop is a chop artifact, not a musical ending; only a real
        # hit+ring-out (epic_hit) counts on cuts, hard_stop only on the master itself
        ends_big = a["ending"] == "epic_hit" or (tag == "primary" and a["ending"] == "hard_stop")
        if ends_big and segs and segs[-1]["level"] == "high":
            roles.add("epic_outro")
    return sorted(roles)


def analyze_track(track: dict, dry: bool) -> None:
    folder_rel = track.get("folder")
    primary = track.get("primary_file")
    if not folder_rel and "/" in (track.get("file") or ""):
        # legacy entry shape ({file: "<Folder>/<name>"}): normalize in place
        d, _, base = track["file"].rpartition("/")
        folder_rel = "assets/music/" + d
        primary = primary or base
        track["folder"] = folder_rel
        track["primary_file"] = primary
        print(f"  (normalized legacy entry -> folder + primary_file)")
    if not folder_rel:
        raise RuntimeError("entry has no folder / primary_file / file keys")
    folder = VC_ROOT / folder_rel
    if not folder.is_dir():
        print(f"  !! folder missing: {folder}")
        return
    audio = sorted(p for p in folder.iterdir()
                   if p.is_file() and p.suffix.lower() in AUDIO_EXTS)
    if not audio:
        print(f"  !! no audio files in {folder}")
        return
    results = {}
    for p in audio:
        print(f"  measuring {p.name} ...", flush=True)
        results[p.name] = analyze_file(p)

    primary_dur = results.get(primary, {}).get("duration_sec")
    if primary in results:
        track["analysis"] = results[primary]
    else:
        print(f"  !! primary_file {primary} not found on disk; skipping track-level analysis")

    old_sections = track.get("sections")
    section_files = [n for n in results if n != primary]
    # drop an mp3 twin when the same take exists as wav (or IS the primary, e.g. a
    # duplicate-encode master like corporate's .wav + .mp3 pair)
    twins = {n[: n.rfind(".")] for n in section_files if n.lower().endswith(".wav")}
    if primary and "." in primary:
        twins.add(primary[: primary.rfind(".")])
    section_files = [n for n in section_files
                     if (n.lower().endswith(".wav") or n[: n.rfind(".")] not in twins)
                     and n[: n.rfind(".")] != (primary[: primary.rfind(".")] if primary else "")]
    if section_files:
        track["sections"] = [{
            "file": n,
            "mix": parse_mix(n),
            "role": parse_role(n, results[n]["duration_sec"], primary_dur),
            "len_sec": results[n]["duration_sec"],
            "analysis": results[n],
        } for n in section_files]
    if isinstance(old_sections, list) and old_sections and isinstance(old_sections[0], str):
        on_disk = set(section_files)
        missing = [s for s in old_sections if s not in on_disk and s != primary]
        if missing:
            print(f"  !! sections listed in catalog but not on disk top-level: {missing}")

    if "energy_measured" in track:
        print("  (removing superseded hand-made energy_measured block)")
        del track["energy_measured"]

    track["roles"] = derive_roles(track)
    if primary in results:                     # a track whose master is missing stays incomplete
        track["analysis_complete"] = True
        track["analyzed_at"] = datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")

    for name in ([primary] if primary in results else []) + section_files:
        a = results[name]
        print(f"    {name}: {a['duration_sec']}s mean {a['mean_db']} dB aggr {a['aggression']} "
              f"open {a['opening']} end {a['ending']} env {a['env']}")
    print(f"  roles: {track['roles']}")


# ---------- main ----------

def main() -> None:
    argv = sys.argv[1:]
    limit = None
    if "--limit" in argv:
        i = argv.index("--limit")
        limit = int(argv[i + 1])
        del argv[i:i + 2]
    dry = "--dry-run" in argv
    force = "--force" in argv
    args = [a for a in argv if not a.startswith("--")]
    do_all = "--all" in argv
    if "--file" in argv:
        if not args:
            sys.exit("usage: analyze-music.py --file <path> [...]")
        out = {}
        for p in args:
            path = Path(p)
            if not path.is_file():
                sys.exit(f"not a file: {p}")
            out[path.name] = analyze_file(path)
        print(json.dumps(out, indent=1))
        return
    if not do_all and not args:
        sys.exit("usage: analyze-music.py <track-id> [--dry-run] | --all [--force] [--dry-run] "
                 "| --file <path> [...]")

    lib = json.loads(LIBRARY.read_text(encoding="utf-8"))
    targets = lib["tracks"] if do_all else [t for t in lib["tracks"] if t["id"] in args]
    if not targets:
        sys.exit(f"no track with id {args!r} in {LIBRARY}")

    done = 0
    failed = []
    for track in targets:
        if do_all and not force and track.get("analysis_complete"):
            continue
        if limit is not None and done >= limit:
            break
        print(f"== {track['id']}")
        try:
            analyze_track(track, dry)
        except Exception as e:                 # a bad entry must not kill the batch
            print(f"  !! FAILED {track['id']}: {e}")
            failed.append(track["id"])
        done += 1

    if dry:
        print("(dry-run: library.json NOT written)")
        return

    out = {}
    for k, v in lib.items():                     # keep $analysis_note near the top
        out[k] = v
        if k == "$schema_note":
            out["$analysis_note"] = ANALYSIS_NOTE
    if "$analysis_note" not in out:
        out = {"$analysis_note": ANALYSIS_NOTE, **lib}
    else:
        lib_note = lib.get("$analysis_note")     # already existed: keep original position
        if lib_note is not None:
            out = lib
            out["$analysis_note"] = ANALYSIS_NOTE

    text = json.dumps(out, ensure_ascii=False, indent=1)
    LIBRARY.write_bytes(text.encode("utf-8"))    # LF, no trailing newline: matches existing file
    print(f"wrote {LIBRARY}")
    if failed:
        print(f"FAILED tracks ({len(failed)}): {', '.join(failed)} -- fix and re-run, they stay unanalyzed")


if __name__ == "__main__":
    main()
