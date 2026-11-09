"""gen_face_swap.py — submit ONE face background-swap generation to Higgsfield Seedance 2.0 (comp-build.md 3b, step 4).

    python scripts/gen_face_swap.py <media/<project>> <name> --backdrop <image> --prompt-file <txt> [--voice <mp3>]

Reads  assets/face-swap/<name>-raw-for-higgsfield.json  (build_face_swap_source.py) for the clip path and its whole-second
length, sends the clip as the video reference, the backdrop image as the image reference and the REAL voice
(_previews/qa/bg-swap/<name>-audio.mp3 from build_swap_voice_ref.py) as the audio reference, at 480p (the hard rule),
--duration = the clip length, 16:9, and waits. Downloads the returned mp4 to _previews/qa/bg-swap/<name>-returned.mp4
and the job JSON beside it. Machine line: SWAP-GEN ok|FAIL name=<n> duration=<s> credits=<n> job=<id>.
Never pick a resolution above 480p: Remotion upscales for free, 720p/1080p only burn credits.
"""
import argparse, json, re, subprocess, sys, urllib.request
from pathlib import Path

ap = argparse.ArgumentParser()
ap.add_argument("project"); ap.add_argument("name")
ap.add_argument("--backdrop", required=True, help="the look reference image of the NEW room (no person in it)")
ap.add_argument("--prompt-file", required=True, help="the prompt text (keep the man + clothing + mic lock, replace ONLY the room)")
ap.add_argument("--voice", default=None, help="override the voice reference mp3")
ap.add_argument("--look-ref", default=None, help="a frame of an APPROVED swap clip, passed as a second image reference so every window gets the same room")
ap.add_argument("--wait-timeout", default="20m")
ap.add_argument("--vertical", action="store_true", help="the 9:16 lane (vertical-repurpose.md 1c): sources from assets/vertical/face-swap/, --aspect_ratio 9:16, returned clip in _previews/qa/bg-swap-vertical/")
a = ap.parse_args()

P = Path(a.project).resolve(); name = a.name
QA_DIR = P / ("_previews/qa/bg-swap-vertical" if a.vertical else "_previews/qa/bg-swap")
src = json.loads((P / ("assets/vertical/face-swap" if a.vertical else "assets/face-swap") / f"{name}-raw-for-higgsfield.json").read_text(encoding="utf-8"))
clip = Path(src["clip"]); dur = float(src["clip_s"])
if abs(dur - round(dur)) > 1e-6:
    print(f"SWAP-GEN FAIL name={name} clip is not a whole number of seconds ({dur}); rebuild with --whole-seconds"); sys.exit(1)
voice = Path(a.voice) if a.voice else QA_DIR / f"{name}-audio.mp3"
for f in (clip, Path(a.backdrop), voice) + ((Path(a.look_ref),) if a.look_ref else ()):
    if not f.is_file():
        print(f"SWAP-GEN FAIL name={name} missing {f}"); sys.exit(1)
prompt = Path(a.prompt_file).read_text(encoding="utf-8").strip()
out_dir = QA_DIR; out_dir.mkdir(parents=True, exist_ok=True)
cmd = ["higgsfield", "generate", "create", "seedance_2_0", "--prompt", prompt,
       "--video-references", str(clip), "--image-references", str(Path(a.backdrop).resolve()),
       *(["--image-references", str(Path(a.look_ref).resolve())] if a.look_ref else []), "--audio-references", str(voice),
       "--resolution", "480p", "--duration", str(int(round(dur))), "--aspect_ratio", "9:16" if a.vertical else "16:9",
       "--wait", "--wait-timeout", a.wait_timeout, "--json"]
(out_dir / f"{name}-gen.cmd.txt").write_text(" ".join(f'"{c}"' if " " in c else c for c in cmd), encoding="utf-8")
r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace", shell=True)
raw = (r.stdout or "") + "\n" + (r.stderr or "")
(out_dir / f"{name}-gen.raw.txt").write_text(raw, encoding="utf-8")
m = re.search(r"\{.*\}", raw, re.S)
if not m:
    print(f"SWAP-GEN FAIL name={name} no JSON from the CLI (rc {r.returncode}): {raw[-400:]}"); sys.exit(1)
j = json.loads(m.group(0))
(out_dir / f"{name}-gen.json").write_text(json.dumps(j, indent=2), encoding="utf-8")
urls = sorted(set(re.findall(r"https?://[^\s\"']+", json.dumps(j))))
vids = [u for u in urls if re.search(r"/hf_[^/]+\.mp4", u)] or [u for u in urls if u.lower().endswith(".mp4") and "raw-for-higgsfield" not in u]
job = j.get("id") or j.get("job_id") or (j.get("job") or {}).get("id")
credits = j.get("credits") or j.get("cost") or (j.get("job") or {}).get("credits")
if str(j.get("status", "")).lower() not in ("completed", "succeeded", "success", "done") or not vids:
    print(f"SWAP-GEN FAIL name={name} status={j.get('status')} job={job} urls={len(urls)}"); sys.exit(1)
dest = out_dir / f"{name}-returned.mp4"
urllib.request.urlretrieve(vids[0], dest)
probe = subprocess.run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,r_frame_rate,duration",
                        "-of", "csv=p=0", str(dest)], capture_output=True, text=True).stdout.strip()
print(f"SWAP-GEN ok name={name} duration={int(round(dur))} credits={credits} job={job} returned={dest} probe={probe}")
