"""longest-bear vertical cold open: the three video clips on Higgsfield, Seedance 2.5, 720p (Mike approved 720p for THIS
intro only, 2026-11-25), 9:16, 5 s each.
    python vertical-intro/make_clips.py c1 c2 [--tag v2]      # c3 needs c2's last frame: run it after c2
c1: starts on the kick still, ends on the flex still. c2: starts on the flex still, Mike walks in and speaks (audio
reference). c3: starts on c2's LAST frame, he sits, the mountain becomes his room, ends on the real recording frame."""
import json
import re
import shutil
import subprocess
import sys
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

HERE = Path(__file__).resolve().parent
ST, RF, AU, OUT = HERE / "stills", HERE / "refs", HERE / "audio", HERE / "clips"
HF = shutil.which("higgsfield") or "higgsfield"
MIKE_LOOK = [RF / "mike-face-6.0.png", ST / "s4-v2.png"]

CLIPS = {
    "c1": {"start": ST / "s2.png", "end": ST / "s3.png", "images": [], "audio": None, "sound": "true",
           "prompt": "Over-the-top comedic action-movie parody on a snowy mountain summit. The shirtless muscular man in black "
                     "leather pants follows through his huge kick: the polar bear flies off the mountain, spinning slapstick "
                     "through the sky, shrinking into the distance and vanishing with a small twinkle of light, no blood, no "
                     "injury. The man lands, plants his boots, clenches his fists and flexes with a furious roar as the camera "
                     "pushes in. Blowing snow, dramatic wind. Sound: howling wind, a heavy impact boom, a cartoonish bear "
                     "yelp fading away, a deep roar. No speech, no music, no text."},
    "c2": {"start": ST / "s3.png", "end": None, "images": MIKE_LOOK, "audio": AU / "clip2-speech.wav", "sound": "false",
           "prompt": "Same snowy mountain summit, same shirtless muscular man in black leather pants, still furious and flexing, "
                     "silent, he never speaks. After a moment a second man (the man in the reference images: curly dark "
                     "shoulder-length hair, green eyes, plain black V-neck T-shirt, dark jeans) casually walks into frame in the "
                     "foreground, stops beside and in front of him, turns to the camera and talks to the viewer in a relaxed, "
                     "friendly way, his lips matching the reference audio. The camera slowly moves to a waist-up framing on the "
                     "talking man. Blowing snow. No text."},
    # 2026-11-25 fix: his lips were off while he was still walking in (video 0:05-0:08). c2a replaces c2's first 3.25 s:
    # two silent seconds to walk in, then "What's up you guys" standing still; it ENDS on c2's own frame at 3.25 s.
    "c2a": {"start": ST / "s3.png", "end": OUT / "c2-at-3.25.png", "images": MIKE_LOOK, "audio": AU / "clip2a-speech.wav",
            "sound": "false", "dur": "4",
            "prompt": "Same snowy mountain summit, the shirtless muscular man in black leather pants stands behind, furious, silent, "
                      "he never speaks. During the first TWO seconds a second man (the man in the reference images: curly dark "
                      "shoulder-length hair, green eyes, plain black V-neck T-shirt) walks briskly into the foreground with his "
                      "MOUTH CLOSED, stops, and faces the camera. Only then, standing still and looking straight into the lens, he "
                      "greets the viewer, saying 'What's up you guys' with clear natural lip movements exactly in sync with the "
                      "reference audio. Ends exactly on the last frame. Blowing snow. No text."},
    # take 3 of the walk-in (Mike 2026-11-25: "one more take"): ONE continuous 6 s shot, no splice; no extra image refs, so
    # the end frame is honoured (as in c3) and c3 still joins.
    "c2b": {"start": ST / "s3.png", "end": OUT / "c2-last.png", "images": [], "audio": AU / "clip2b-speech.wav",
            "sound": "false", "dur": "6",
            "prompt": "One continuous shot on a snowy mountain summit. The shirtless muscular man in black leather pants stands "
                      "behind, furious, silent, he never speaks. In the first two seconds the second man from the last frame (curly "
                      "dark shoulder-length hair, plain black V-neck T-shirt) walks into the foreground with his mouth firmly "
                      "closed, stops, and faces the camera. He waits a beat, then looking straight into the lens he talks to the "
                      "viewer: his lips, jaw and mouth shapes match the reference audio precisely from the very first word, and his "
                      "mouth stays closed whenever the audio is silent. The camera slowly pushes in and ends exactly on the last "
                      "frame. Blowing snow. No text."},
    "c3": {"start": OUT / "c2-last.png", "end": RF / "e-9.00.png", "images": [], "audio": AU / "clip3-speech.wav", "sound": "false",
           "prompt": "One continuous shot. The talking man in the black V-neck T-shirt keeps speaking to the camera, lips "
                     "matching the reference audio, and calmly sits down. As he sits, the snowy mountain and the man behind him "
                     "dissolve away in a swirl of snow and the scene becomes his own room: a blue-lit wall, a hanging lamp, a "
                     "wooden door, a black microphone in front of him, ending exactly on the last frame. Natural movement, no "
                     "cuts, no text."},
}


def run(cid, tag):
    c = CLIPS[cid]
    cmd = [HF, "generate", "create", "seedance_2_5", "--prompt", c["prompt"], "--mode", "omni_reference",
           "--resolution", "720p", "--duration", c.get("dur", "5"), "--aspect_ratio", "9:16", "--generate_audio", c["sound"],
           "--start-image", str(c["start"])]
    if c["end"]:
        cmd += ["--end-image", str(c["end"])]
    for r in c["images"]:
        cmd += ["--image", str(r)]
    if c["audio"]:
        cmd += ["--audio", str(c["audio"])]
    cmd += ["--wait", "--wait-timeout", "30m", "--json"]
    p = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8", errors="replace")
    name = cid + (f"-{tag}" if tag else "")
    (OUT / f"{name}.json").write_text(p.stdout + ("\n--- stderr ---\n" + p.stderr if p.stderr else ""), encoding="utf-8")
    urls = re.findall(r'"result_url"\s*:\s*"([^"]+)"', p.stdout) or re.findall(r'https://[^"\s]+\.mp4', p.stdout)
    if p.returncode or not urls:
        return f"{name}: NO VIDEO (exit {p.returncode}) {(p.stderr or p.stdout).strip()[-500:]}"
    dst = OUT / f"{name}.mp4"
    urllib.request.urlretrieve(urls[0], dst)
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-sseof", "-0.2", "-i", str(dst), "-update", "1", "-frames:v", "10",
                    str(OUT / f"{name}-last.png")])
    info = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,width,height,nb_frames:format=duration",
                           "-of", "compact", str(dst)], capture_output=True, text=True).stdout.split()
    return f"{name}: ok -> {dst} {' '.join(info)}"


def main():
    args = sys.argv[1:]
    tag = ""
    if "--tag" in args:
        i = args.index("--tag")
        tag, args = args[i + 1], args[:i] + args[i + 2:]
    OUT.mkdir(parents=True, exist_ok=True)
    with ThreadPoolExecutor(max_workers=3) as ex:
        for line in ex.map(lambda c: run(c, tag), args):
            print(line, flush=True)


if __name__ == "__main__":
    main()
