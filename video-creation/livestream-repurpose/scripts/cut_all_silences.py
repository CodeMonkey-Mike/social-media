"""
Run cut-silences.py on all 5 draft clips. Overwrites preview.mp4 in place.
"""
import subprocess, os, shutil

SCRIPT   = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\cut-silences.py"
CLIPS_DIR = r"C:\Users\mnede\Documents\Claude\social-media\video-creation\shorts\market-update-clips"

clips = [
    "ai-job-market",
    "kaspa-hard-fork",
    "meme-bear-market",
    "meme-holds",
    "tao-ai-play",
]

for slug in clips:
    src = os.path.join(CLIPS_DIR, slug, "preview.mp4")
    tmp = os.path.join(CLIPS_DIR, slug, "preview_cut.mp4")

    print(f"\n{'='*60}")
    print(f"  {slug}")
    print(f"{'='*60}")

    result = subprocess.run(
        ["python", SCRIPT, "--input", src, "--output", tmp,
         "--noise=-35dB", "--duration", "0.3", "--pad", "0.05"],
        text=True
    )

    if result.returncode == 0 and os.path.exists(tmp):
        shutil.move(tmp, src)
        print(f"  -> preview.mp4 updated")
    else:
        print(f"  FAILED — preview.mp4 unchanged")
        if os.path.exists(tmp):
            os.remove(tmp)

print("\nAll done.")
