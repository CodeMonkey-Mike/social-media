"""longest-bear vertical cold open (Mike 2026-11-25): the key stills, on Higgsfield (nano_banana_pro, 9:16, 2k).
python vertical-intro/make_stills.py [s1 s2 s3 s4] [--tag v2]    outputs vertical-intro/stills/<id>[-<tag>].png + a .json
of the job. 720p video for THIS intro only (his OK 2026-11-25); the stills are the approval step before any video."""
import json
import re
import subprocess
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

HERE = Path(__file__).resolve().parent
REFS = HERE / "refs"
OUT = HERE / "stills"
HF = "higgsfield"
SAYLOR = [REFS / "saylor-face.png"]
MIKE = [REFS / "mike-face-6.0.png", REFS / "mike-face-9.0.png", REFS / "mike-face-14.0.png"]

LOOK = ("Vertical 9:16 photorealistic film still, over-the-top comedic action-movie parody, a snow-covered mountain summit "
        "with jagged peaks, blowing snow, cold blue sky with warm low sunlight, dramatic low camera angle. No text, no "
        "captions, no logos, no watermark.")
HERO = ("Michael Saylor (match the face in the reference photo: swept silver-grey hair, short grey-white beard), as an absurdly "
        "muscular parody action hero: shirtless, huge defined muscles, tight black leather pants, black boots, furious angry face")

SHOTS = {
    "s1": (SAYLOR, f"{LOOK} {HERO}, fists clenched, standing face to face with an enormous angry polar bear reared up on its hind "
                   "legs near the cliff edge. A tense standoff, both full body in frame."),
    "s2": (SAYLOR, f"{LOOK} {HERO}, landing a huge flying front kick: his boot hits the chest of a big polar bear and launches it "
                   "off the cliff into the sky, the bear tumbling through the air with a surprised cartoon expression, a burst of "
                   "snow. Slapstick, no blood, no injury. Full body in frame."),
    "s3": (SAYLOR, f"{LOOK} {HERO}, standing alone at the cliff edge, flexing both biceps, veins bulging, roaring with fury, hair "
                   "blown by the wind. Far away in the sky a tiny polar bear silhouette disappears with a small twinkle of light. "
                   "Knees-up framing, he fills the frame."),
    "s4": (MIKE + SAYLOR, f"{LOOK} Two men side by side on the summit. LEFT, in front: the man from the first three reference "
                          "photos, exactly his face, curly dark shoulder-length hair, green eyes, clean-shaven light stubble, normal "
                          "build, wearing the same plain black V-neck T-shirt as in the first three reference photos (a V neckline) and dark jeans, relaxed and friendly, mouth open mid "
                          "sentence, talking straight to the camera, waist-up. RIGHT, slightly behind him: " + HERO +
                          " (the face of the last reference photo), arms flexed, still glaring."),
}


def run(sid, tag):
    refs, prompt = SHOTS[sid]
    cmd = [HF, "generate", "create", "nano_banana_pro", "--prompt", prompt, "--aspect_ratio", "9:16", "--resolution", "2k"]
    for r in refs:
        cmd += ["--image", str(r)]
    cmd += ["--wait", "--wait-timeout", "15m", "--json"]
    p = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace", shell=False)
    name = sid + (f"-{tag}" if tag else "")
    (OUT / f"{name}.json").write_text(p.stdout + ("\n--- stderr ---\n" + p.stderr if p.stderr else ""), encoding="utf-8")
    urls = re.findall(r'"result_url"\s*:\s*"([^"]+)"', p.stdout) or re.findall(r'https://[^"\s]+\.(?:png|jpe?g|webp)', p.stdout)
    status = re.findall(r'"status"\s*:\s*"([^"]+)"', p.stdout)
    if p.returncode or not urls:
        return f"{name}: NO IMAGE (exit {p.returncode}, status {status[-1:] or '?'}) {(p.stderr or p.stdout).strip()[-400:]}"
    dst = OUT / f"{name}.png"
    urllib.request.urlretrieve(urls[0], dst)
    return f"{name}: ok -> {dst}"


def main():
    import shutil
    global HF
    HF = shutil.which("higgsfield") or "higgsfield"
    args = sys.argv[1:]
    tag = ""
    if "--tag" in args:
        i = args.index("--tag")
        tag, args = args[i + 1], args[:i] + args[i + 2:]
    ids = args or list(SHOTS)
    OUT.mkdir(parents=True, exist_ok=True)
    with ThreadPoolExecutor(max_workers=4) as ex:
        for line in ex.map(lambda s: run(s, tag), ids):
            print(line, flush=True)


if __name__ == "__main__":
    main()
