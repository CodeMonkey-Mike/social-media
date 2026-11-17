"""chain_splice_then_vertical.py (Mike, 2026-11-14: "after this fix, and the final render is updated, go straight into the full
vertical conversion").

1. take a machine-wide run-queue TURN (the splice is a heavy re-encode; one video job owns the machine at a time), so this
   starts only after the queued patch render has finished and released its turn;
2. splice the re-rendered C3 window into the delivered final and VERIFY it (splice_c3.py: frame total, audio untouched, seams,
   every C3 axis label in line on every frame);
3. replace <project>-FINAL.mp4 ONLY if every gate passed AND the file at the root is still byte-identical to final-v1-mix.mp4
   (so the original is preserved in _previews/ and nothing a person changed is overwritten);
4. release the turn, then launch `run.py vertical` (it queues itself, runs detached, and stops at its human gate).
Any failure stops the chain with the vertical lane NOT started.
"""
import hashlib, os, shutil, subprocess, sys, time
from pathlib import Path

HERE = Path(__file__).resolve().parent
PROJ = HERE.parents[1]
REPO = HERE.parents[5]
PROJECT = PROJ.name
sys.path.insert(0, str(REPO / "video-creation" / "skills" / "run-queue"))
sys.path.insert(0, str(HERE))
import run_queue  # noqa: E402
import splice_c3 as S  # noqa: E402


def log(*a):
    print(time.strftime("%H:%M:%S"), *a, flush=True)


def md5(p: Path) -> str:
    h = hashlib.md5()
    with open(p, "rb") as f:
        for chunk in iter(lambda: f.read(1 << 20), b""):
            h.update(chunk)
    return h.hexdigest()


ok = False
log("chain start: waiting for a machine turn (the patch render goes first)")
with run_queue.turn(f"{PROJECT} splice the C3 fix into FINAL", kind="render", project=PROJECT):
    log("turn taken")
    try:
        S.check_patch()
        S.encode_video(S.SRC_MIX)
        S.mux(S.SRC_MIX, S.OUT_MIX)
        ok = bool(S.verify(S.OUT_MIX, S.SRC_MIX))
        S.mux(S.SRC_PLAIN, S.OUT_PLAIN)
    except SystemExit as e:
        log("a splice step stopped:", e.code)
        ok = False
    if ok:
        final = PROJ / f"{PROJECT}-FINAL.mp4"
        if md5(final) != md5(S.SRC_MIX):
            log("STOP: the root FINAL.mp4 is no longer byte-identical to final-v1-mix.mp4; not overwriting it")
            ok = False
        else:
            tmp = final.with_name(final.stem + ".spliced.tmp.mp4")
            shutil.copyfile(S.OUT_MIX, tmp)
            os.replace(tmp, final)
            log(f"FINAL REPLACED: {final} <- {S.OUT_MIX.name}; the previous file is kept as _previews/{S.SRC_MIX.name}")
if not ok:
    log("CHAIN STOP: the vertical lane is NOT started")
    sys.exit(2)
log("starting the vertical lane (it queues itself and stops at its human gate)")
rc = subprocess.run([sys.executable, "-u", str(REPO / "video-creation" / "longform-edited" / "graph" / "run.py"), "vertical", "--project", PROJECT]).returncode
log("vertical run exited with", rc, "(2 = waiting at its gate)")
sys.exit(rc)
