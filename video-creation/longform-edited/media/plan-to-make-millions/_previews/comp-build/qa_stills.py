"""QA stills for plan-to-make-millions from ONE prebuilt bundle (npx remotion still, one frame each).
usage: python qa_stills.py <bundle dir> <label=t|fN> ...   (t = SOURCE second through sh(); fN = an absolute frame)"""
import subprocess
import sys
from pathlib import Path

INSERTS = [(9.815, 2.6), (9.815, 3.2), (9.815, 3.5), (9.815, 3.6), (79.2, 1.5), (265.6, 1.5), (471.33, 1.5)]
REMOTION = Path(__file__).resolve().parents[5] / "remotion"
OUT = Path(__file__).resolve().parents[1] / "qa" / "stills"


def F(t):
    return round((t + sum(d for a, d in INSERTS if a <= t)) * 30)


def main():
    bundle = sys.argv[1]
    OUT.mkdir(parents=True, exist_ok=True)
    for spec in sys.argv[2:]:
        label, v = spec.split("=")
        fr = int(v[1:]) if v.startswith("f") else F(float(v))
        out = OUT / f"{label}_{fr}.jpg"
        r = subprocess.run(f'npx remotion still "{bundle}" PlanToMakeMillions "{out}" --frame={fr} --image-format=jpeg --jpeg-quality=80 --log=error',
                           cwd=REMOTION, shell=True, capture_output=True, text=True, encoding="utf-8", errors="replace")
        err = [l for l in (r.stdout + r.stderr).splitlines() if "rror" in l and "network requests" not in l]
        print(f"{label} frame {fr} -> {'OK' if out.exists() and not err else 'FAIL ' + ' | '.join(err)[:300]}", flush=True)


if __name__ == "__main__":
    main()
