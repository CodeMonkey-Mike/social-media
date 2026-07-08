"""Generate a keyframe still for each scene in a project's storyboard.json.

For each scene it picks the right reference image(s) based on the scene's
`character` field (Mike's photo, the woman's before/after base, or both for a
two-shot), runs Nano Banana Pro to compose the shot, and saves it to
keyframes/<id>.png. Scenes whose keyframe already exists are skipped (so locked
picks like s1a aren't overwritten). Re-run rebuild_storyboard.py afterward.

Usage:  python gen_keyframes.py [project-dir]   (default: ../crypto-promo)
"""
import json, subprocess, os, sys, re, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
PROJECT = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else os.path.join(HERE, "..", "crypto-promo")
MANIFEST = os.path.join(PROJECT, "storyboard.json")
KFDIR = os.path.join(PROJECT, "keyframes")
os.makedirs(KFDIR, exist_ok=True)

# the real Higgsfield binary (the `higgsfield` command is a .cmd shim Python's
# subprocess can't launch directly on Windows)
HF = r"C:\Users\mnede\AppData\Roaming\npm\node_modules\@higgsfield\cli\vendor\hf.exe"

# reference images (relative to PROJECT, which is the cwd we run higgsfield from)
MIKE = "../identity/shot1.png"
WOMAN_BEFORE = "characters/woman/before-base.png"
WOMAN_AFTER = "characters/woman/after-base.png"


def refs_for(character):
    c = (character or "").lower()
    has_you = "you" in c
    has_woman = "woman" in c or "friend" in c
    woman_base = WOMAN_BEFORE if "before" in c else WOMAN_AFTER
    if has_you and has_woman:
        return [MIKE, woman_base]
    if has_woman:
        return [woman_base]
    if has_you:
        return [MIKE]
    return []


def clean_prompt(p):
    p = p or ""
    # strip bracketed production notes like "[needs woman character ...]"
    p = re.sub(r"\[[^\]]*\]", "", p)
    # strip the spoken dialogue (in quotes) — otherwise the image model renders
    # it as a comic speech bubble baked into the still. Keyframes are visual-only.
    p = re.sub(r'"[^"]*"', "", p)
    # tidy dangling "... says," / "... asks," lead-ins and extra whitespace
    p = re.sub(r"\b(says|asks|saying|asking|say|ask)[,:]?\s*([.\"]|$)", r"\2", p, flags=re.I)
    p = re.sub(r"\s{2,}", " ", p)
    p = re.sub(r"\s+([.,])", r"\1", p)
    return p.strip()


with open(MANIFEST, encoding="utf-8") as f:
    man = json.load(f)

scenes = man.get("scenes", [])
done, skipped, failed = 0, 0, 0
for sc in scenes:
    sid = sc.get("id")
    kf_rel = sc.get("keyframe") or f"keyframes/{sid}.png"
    kf = os.path.join(PROJECT, kf_rel)
    if os.path.exists(kf):
        print(f"[skip] {sid} (keyframe exists)")
        skipped += 1
        continue
    refs = refs_for(sc.get("character", ""))
    prompt = clean_prompt(sc.get("prompt", ""))
    if not refs or not prompt:
        print(f"[skip] {sid} (no refs/prompt — likely a title card)")
        skipped += 1
        continue
    cmd = [HF, "generate", "create", "nano_banana_2"]
    for r in refs:
        cmd += ["--image", r]
    cmd += ["--prompt", prompt, "--aspect_ratio", "9:16", "--resolution", "2k", "--wait", "--wait-timeout", "20m"]
    print(f"[gen ] {sid}  refs={len(refs)} ...", flush=True)
    try:
        out = subprocess.check_output(cmd, text=True, cwd=PROJECT, stderr=subprocess.STDOUT)
        urls = [ln.strip() for ln in out.splitlines() if ln.strip().startswith("http")]
        if not urls:
            print(f"[FAIL] {sid}: no URL returned\n{out}")
            failed += 1
            continue
        urllib.request.urlretrieve(urls[-1], kf)
        print(f"[ok  ] {sid} -> {kf_rel}")
        done += 1
    except subprocess.CalledProcessError as e:
        print(f"[FAIL] {sid}: {e.output}")
        failed += 1
    except Exception as e:
        print(f"[FAIL] {sid}: {e}")
        failed += 1

print(f"\nKeyframes: {done} generated, {skipped} skipped, {failed} failed.")
print("Now run: python scripts/rebuild_storyboard.py")
