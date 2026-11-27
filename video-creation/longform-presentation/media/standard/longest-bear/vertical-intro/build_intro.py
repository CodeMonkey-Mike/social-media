"""longest-bear vertical cold open: the three AI clips + his real voice, then a few seconds of the real recording to show
the seam. 1080x1920, 30 fps. python vertical-intro/build_intro.py [--tail 5] [--out vertical-intro/intro-preview-v1.mp4]

Timeline: video 0-5 c1 (its own sound effects), 5-9 c2a, 9-10.7 the rest of c2, 10.7-15.7 c3, then the real face scene
from spine 9.0 s. His voice is the REAL recording, one unbroken piece: spine 0.30 s lands at video 7.03
(video = spine + 6.73), so the generated clips' own speech is never used. A synthetic wind runs under the mountain and fades as the room appears."""
import argparse
import subprocess
from pathlib import Path

HERE = Path(__file__).resolve().parent
PROJ = HERE.parent
SPINE = PROJ / "spine" / "longest-bear EDIT.enhanced.mp4"
CROP = "crop=606:1076:810:2"          # the vertical face crop: the last AI frame is built to it (refs/e-9.00.png)
# The picture, in 30 fps frames: (clip, trim start s, frames). c2a (the retake of the walk-in) runs 4 s, then the old c2
# carries on from its own 3.25 s (c2t = match_cut.py: reframed to where c2a leaves him; 2026-11-25 lip-sync fix).
SHOTS = (("c1", 0.0, 150), ("c2b", 0.0, 180), ("c3m", 0.0, 150))   # take 3 (v3): one continuous walk-in; c3m = c3, eased from c2b framing
INTRO = sum(n for _, _, n in SHOTS) / 30                      # 15.733 s: the real picture starts here
RESUME, V0 = 9.0, 0.30                                        # ... at spine RESUME; his voice starts at spine V0
OFFSET = INTRO - RESUME                                       # video = spine + OFFSET, picture and voice
C3_START = sum(n for _, _, n in SHOTS[:3]) / 30


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--tail", type=float, default=5.0, help="seconds of the real recording after the intro")
    ap.add_argument("--out", default=str(HERE / "intro-preview-v3.mp4"))
    a = ap.parse_args()
    clips = [HERE / "clips" / f"{c}.mp4" for c, _, _ in SHOTS]
    total = INTRO + a.tail
    voice_len = RESUME + a.tail - V0
    cmd = ["ffmpeg", "-y", "-v", "error"]
    for c in clips:
        cmd += ["-i", str(c)]
    cmd += ["-ss", f"{RESUME}", "-t", f"{a.tail}", "-i", str(SPINE),                    # 3: the real picture
            "-ss", f"{V0}", "-t", f"{voice_len}", "-i", str(SPINE),                     # 4: the real voice
            "-f", "lavfi", "-t", "16", "-i", "anoisesrc=color=brown:sample_rate=48000:amplitude=0.5"]   # 6: wind
    g = []
    for i, (_, start, n) in enumerate(SHOTS):
        g.append(f"[{i}:v]trim=start={start},setpts=PTS-STARTPTS,fps=30,scale=1080:1920:flags=lanczos,setsar=1,"
                 f"tpad=stop_mode=clone:stop_duration=1,trim=end_frame={n},setpts=PTS-STARTPTS,format=yuv420p[v{i}]")
    k = len(SHOTS)                                          # inputs: k = real picture, k+1 = real voice, k+2 = wind
    g.append(f"[{k}:v]fps=30,{CROP},scale=1080:1920:flags=lanczos,setsar=1,trim=end_frame={round(a.tail * 30)},"
             f"setpts=PTS-STARTPTS,format=yuv420p[v{k}]")
    g.append("".join(f"[v{i}]" for i in range(k + 1)) + f"concat=n={k + 1}:v=1:a=0[v]")
    g.append("[0:a]aformat=sample_rates=48000:channel_layouts=stereo,loudnorm=I=-19:TP=-1.5:LRA=11,"
             "aresample=48000,atrim=end=5.0,afade=t=out:st=4.5:d=0.5[fx]")
    g.append(f"[{k + 1}:a]aformat=sample_rates=48000:channel_layouts=stereo,adelay={int((V0 + OFFSET) * 1000)}:all=1[vo]")
    fade = C3_START + 1.4 - 4.4                              # the wind dies as the room appears, 1.4 s into c3
    g.append(f"[{k + 2}:a]lowpass=f=520,highpass=f=90,aformat=sample_rates=48000:channel_layouts=stereo,volume=-24dB,"
             f"afade=t=in:d=0.8,afade=t=out:st={fade:.3f}:d=1.4,atrim=end={fade + 1.4:.3f},asetpts=PTS-STARTPTS,"
             "adelay=4400:all=1[wind]")
    g.append(f"[fx][vo][wind]amix=inputs=3:duration=longest:normalize=0,apad,atrim=end={total}[a]")
    cmd += ["-filter_complex", ";".join(g), "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-crf", "18", "-preset", "medium",
            "-c:a", "aac", "-b:a", "320k", "-movflags", "+faststart", a.out]
    subprocess.run(cmd, check=True)
    print("intro ->", a.out)
    print(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "stream=codec_type,width,height,duration,nb_frames",
                          "-of", "compact", a.out], capture_output=True, text=True).stdout)


if __name__ == "__main__":
    main()
