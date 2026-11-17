import subprocess, time, json
from pathlib import Path
V = Path(__file__).resolve().parent.parent; O = V/"orig"; L = V/"source-dims.log"; seen = set()
end = time.time() + 7000
while time.time() < end:
    for f in O.iterdir():
        if f.suffix.lower() in (".mov",".mp4") and ".master" not in f.name and f.name not in seen:
            r = subprocess.run(["ffprobe","-v","error","-select_streams","v:0","-show_entries","stream=codec_name,width,height,r_frame_rate","-of","csv=p=0",str(f)],capture_output=True,text=True).stdout.strip()
            if r:
                seen.add(f.name)
                with open(L,"a") as h: h.write(f"{f.name} {r} {f.stat().st_size}\n")
    if (V/"fetch-run.log").exists() and "FETCH-ALL DONE" in (V/"fetch-run.log").read_text(): break
    time.sleep(2)
