import subprocess, sys, time, re
from pathlib import Path
V = Path(__file__).resolve().parent.parent; done = set(f"BR-{i}" for i in range(1,10)); end = time.time()+7000
while time.time() < end:
    log = (V/"fetch-run.log").read_text()
    ok = set(re.findall(r"^(BR-\d+): master ok", log, re.M))
    for b in sorted(ok - done, key=lambda x: int(x[3:])):
        r = subprocess.run([sys.executable, "-I", str(V/"_tools/finalize.py"), b], capture_output=True, text=True)
        print(r.stdout.strip(), r.stderr.strip()[-300:], flush=True); done.add(b)
    if "FETCH-ALL DONE" in log and not (ok - done): break
    time.sleep(5)
print("AUTO-FINALIZE DONE", flush=True)
