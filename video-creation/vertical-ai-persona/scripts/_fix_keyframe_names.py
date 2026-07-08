"""One-time fix: the first keyframe batch saved files as keyframes/<scene-id>.png
(e.g. s1b-crypto.png), but the manifest/dashboard expect each scene's declared
`keyframe` path (e.g. keyframes/s1b.png). Move each <id>.png to its manifest
keyframe path. If the destination already exists (a locked pick like s1a.png),
keep the locked one and discard the stray regen.
"""
import json, os, shutil, sys

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.join(HERE, "..", "crypto-promo")
man = json.load(open(os.path.join(PROJECT, "storyboard.json"), encoding="utf-8"))

for sc in man["scenes"]:
    sid = sc["id"]
    src = os.path.join(PROJECT, "keyframes", sid + ".png")
    dst = os.path.join(PROJECT, sc["keyframe"])
    if not os.path.exists(src):
        continue
    if os.path.exists(dst) and os.path.abspath(src) != os.path.abspath(dst):
        os.remove(src)
        print(f"kept locked {sc['keyframe']}, discarded {sid}.png")
        continue
    shutil.move(src, dst)
    print(f"{sid}.png -> {sc['keyframe']}")
