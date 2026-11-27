"""plan-to-make-millions: EXAMPLE IMAGES of a restyled face scene (Mike, 2026-11-23: "a background that's
Bitcoin-themed ... my clothing similar to what I have in the thumbnail ... give me some example images").

These are LOOK examples for Mike to pick from, not the swap itself: one real frame of the recording (cropped to the
likely face framing) + his thumbnail portrait as the clothing reference go to Higgsfield Nano Banana Pro, once per
background. The look he picks becomes the backdrop + prompt of the video swap (comp-build.md section 3b,
face-bg-swap.reference.md: Seedance video-to-video, 480p, one window first as a test).

    python gen_looks.py [neon vault trading city bright]     -> look-<name>.png + look-<name>.json, looks-sheet.jpg
"""
import json
import os
import shutil
import subprocess
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).resolve().parent
PROJ = HERE.parents[2]
FRAME = HERE / "frame-30.63-reframed.png"
CLOTHES = PROJ / "thumbnail" / "refs" / "mike-portrait-plate.png"

# the npm `higgsfield` on Windows is a .cmd shim: call the real binary so the prompt's commas and quotes pass intact
HF = Path(os.environ.get("APPDATA", "")) / "npm" / "node_modules" / "@higgsfield" / "cli" / "vendor" / "hf.exe"
HF = str(HF) if HF.is_file() else (shutil.which("higgsfield") or "higgsfield")

KEEP = ("Edit the first image. Keep the man exactly as he is in the first image: the same face, the same green eyes, the "
        "same dark curly hair, the same expression, the same head position and the same size in the frame. Keep the black "
        "microphone with its round foam windscreen in front of him and its boom arm at the lower right exactly where they "
        "are. Change his clothing to the outfit he wears in the second image: a casual dark navy zip-up bomber jacket worn "
        "open over a plain charcoal grey crew-neck t-shirt. Replace ONLY the room behind him: remove the blue wall, the "
        "wooden door, the lamp and the light switch, and put him in this place: ")
END = (" The background is softly out of focus and he is lit to match it. No words, no letters and no numbers anywhere; "
       "the only symbol allowed is the Bitcoin B. Same camera, same framing, photorealistic.")
LOOKS = {
    "neon": "a dark modern studio with a deep charcoal wall, and one large glowing orange neon Bitcoin B sign mounted on the "
            "wall behind his right shoulder, its warm orange light rim-lighting his hair and jacket.",
    "vault": "the inside of a bank vault: steel shelves of stacked gold Bitcoin coins and gold bars receding behind him, "
             "the round steel vault door open behind him on the right, warm golden light.",
    "trading": "a dark trading room at night: a wall of large monitors behind him showing green candlestick charts climbing "
               "upward, and one screen showing the orange Bitcoin B symbol, a green and orange glow on his hair and shoulders.",
    "city": "a penthouse at night in front of a floor-to-ceiling window over a city skyline, with a giant glowing orange "
            "Bitcoin B symbol floating above the skyline as a hologram, cool blue city light with warm orange highlights.",
    "bright": "a bright, clean modern studio: a smooth off-white wall with one big matte orange round Bitcoin B emblem "
              "mounted on it behind his right shoulder, soft daylight from the left, light and airy.",
}


def gen(name):
    out_json = HERE / f"look-{name}.json"
    cmd = [HF, "generate", "create", "nano_banana_pro", "--prompt", KEEP + LOOKS[name] + END,
           "--image-references", str(FRAME), "--image-references", str(CLOTHES),
           "--aspect_ratio", "16:9", "--resolution", "2k", "--wait", "--json"]
    r = subprocess.run(cmd, capture_output=True, text=True, shell=False)
    out_json.write_text(r.stdout or r.stderr, encoding="utf-8")
    try:
        data = json.loads(r.stdout)
        job = data[0] if isinstance(data, list) else data
        url = job.get("result_url")
        status = job.get("status")
    except Exception:
        return name, "FAIL", (r.stderr or r.stdout)[-300:]
    if not url:
        return name, status or "FAIL", json.dumps(job)[-300:]
    urllib.request.urlretrieve(url, HERE / f"look-{name}.png")
    return name, status, str(HERE / f"look-{name}.png")


def sheet():
    names = [n for n in LOOKS if (HERE / f"look-{n}.png").is_file()]
    if not names:
        return
    f = ImageFont.truetype(r"C:/Windows/Fonts/arialbd.ttf", 30)
    cells = [("recorded", Image.open(FRAME))] + [(n, Image.open(HERE / f"look-{n}.png")) for n in names]
    rows = (len(cells) + 1) // 2
    sh = Image.new("RGB", (960 * 2 + 12, 540 * rows + 12 * (rows - 1)), (60, 60, 60))
    for i, (n, im) in enumerate(cells):
        im = im.convert("RGB").resize((960, 540), Image.LANCZOS)
        d = ImageDraw.Draw(im)
        label = f"{i}. {n}" if i else "as recorded"
        d.rectangle([0, 0, 28 + int(d.textlength(label, font=f)), 46], fill=(0, 0, 0))
        d.text((14, 6), label, font=f, fill=(255, 255, 0))
        sh.paste(im, ((i % 2) * 972, (i // 2) * 552))
    sh.save(HERE / "looks-sheet.jpg", quality=90)


if __name__ == "__main__":
    names = [n for n in sys.argv[1:] if n in LOOKS] or list(LOOKS)
    with ThreadPoolExecutor(len(names)) as ex:
        for res in ex.map(gen, names):
            print("LOOK", *res)
    sheet()
