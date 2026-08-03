"""Word-level Whisper transcription for a batch's FINAL clip spines (Phase 6 caption source).

GENERIC, batch-driven — supersedes the stale hardcoded one-offs in this folder
(`_transcribe_batch.py` = a 2026-05 Weekend Red list, `_caption_transcribe_tightened.py` = a
best-coin-to-buy list). Reads the clip list from `shorts/<batch>/progress.json`, transcribes each
clip's CURRENT final spine, and writes `<clip>/whisper-words.json` (the caption source the
remotion-builder consumes). Skips clips whose json already exists, so it is safe to re-run.

    python video-creation/shorts/_tooling/transcribe_clips.py <batch> [--model medium] [--force]

Which file it transcribes, in priority order: the clip's `output_mp4` from progress.json, else
`<slug>-tightened-desilenced.mp4`, `<slug>-tightened.mp4`, `desilenced.mp4`, `tightened.mp4`,
`<slug>-full.mp4`. ALWAYS transcribe the FINAL spine — captions cut against an earlier spine drift
out of sync the moment a later pass removes time.
"""
import argparse, json, os, sys, time

SHORTS = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

CANDIDATES = [
    "{slug}-tightened-desilenced.mp4",
    "{slug}-tightened.mp4",
    "desilenced.mp4",
    "tightened.mp4",
    "{slug}-full.mp4",
]


def find_spine(clip_dir, slug, output_mp4):
    # progress.json `output_mp4` is relative to the BATCH dir (e.g. "<slug>/<slug>-tightened....mp4")
    if output_mp4:
        p = os.path.join(os.path.dirname(clip_dir), output_mp4)
        if os.path.exists(p):
            return p
    for pat in CANDIDATES:
        p = os.path.join(clip_dir, pat.format(slug=slug))
        if os.path.exists(p):
            return p
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("batch")
    ap.add_argument("--model", default="medium", help="whisper model (default medium)")
    ap.add_argument("--force", action="store_true", help="re-transcribe even if json exists")
    a = ap.parse_args()

    outdir = os.path.join(SHORTS, a.batch)
    prog_path = os.path.join(outdir, "progress.json")
    with open(prog_path, encoding="utf-8") as f:
        prog = json.load(f)

    todo = []
    for c in prog["clips"]:
        slug = c["slug"]
        clip_dir = os.path.join(outdir, slug)
        spine = find_spine(clip_dir, slug, c.get("output_mp4"))
        out = os.path.join(clip_dir, "whisper-words.json")
        if spine is None:
            print(f"  n={c.get('n')} {slug}: NO spine mp4 found -> SKIP", flush=True)
            continue
        if os.path.exists(out) and not a.force:
            print(f"  n={c.get('n')} {slug}: whisper-words.json exists -> skip", flush=True)
            continue
        todo.append((c.get("n"), slug, spine, out))

    if not todo:
        print("nothing to transcribe.")
        return

    import whisper
    import torch
    dev = "cuda" if torch.cuda.is_available() else "cpu"
    print(f"loading whisper '{a.model}' on {dev} for {len(todo)} clip(s)...", flush=True)
    model = whisper.load_model(a.model, device=dev)

    for n, slug, spine, out in todo:
        t0 = time.time()
        print(f"  n={n} {slug}: transcribing {os.path.basename(spine)} ...", flush=True)
        r = model.transcribe(spine, word_timestamps=True, language="en",
                             fp16=(dev == "cuda"))
        with open(out, "w", encoding="utf-8") as f:
            json.dump(r, f, ensure_ascii=False, indent=2)
        nw = sum(len(s.get("words", [])) for s in r["segments"])
        print(f"     -> {nw} words, {time.time() - t0:.0f}s -> whisper-words.json", flush=True)

    print("ALL TRANSCRIPTIONS DONE", flush=True)


if __name__ == "__main__":
    sys.exit(main())
