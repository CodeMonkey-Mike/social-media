"""finish_swap.py: re-run the (corrected) verification on the ALREADY-BUILT final-v2-mix.mp4 and, only on a pass, replace the root
FINAL.mp4 (after proving the root file is still byte-identical to final-v1-mix.mp4). No re-encode."""
import hashlib, os, shutil, sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
import splice_c3 as S
PROJ = S.PRE.parent
FINAL = PROJ / "future-of-software-engineers-FINAL.mp4"
def md5(p):
    h = hashlib.md5()
    with open(p, "rb") as f:
        for c in iter(lambda: f.read(1 << 20), b""): h.update(c)
    return h.hexdigest()
ok = S.verify(S.OUT_MIX, S.SRC_MIX)
if not ok: print("NOT SWAPPING: verification failed"); sys.exit(2)
if md5(FINAL) != md5(S.SRC_MIX): print("NOT SWAPPING: root FINAL.mp4 is not the original any more"); sys.exit(3)
tmp = FINAL.with_name(FINAL.stem + ".spliced.tmp.mp4")
shutil.copyfile(S.OUT_MIX, tmp); os.replace(tmp, FINAL)
print("FINAL REPLACED:", FINAL, "<-", S.OUT_MIX.name, "| md5", md5(FINAL), "| the previous file is kept as _previews/" + S.SRC_MIX.name)
