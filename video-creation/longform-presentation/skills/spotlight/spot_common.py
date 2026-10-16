"""spot_common.py — shared helpers for the spotlight skill (read spotlight.md first).

The TIMELINE of a spotlight deliverable: the EDIT's own footage for the head [0, head_until) and the tail
[tail_from, end), and in between the Remotion middle. Since 2026-10-14 the middle may hold CHAPTER PAUSES: at every
chapter card `dur` seconds of freeze + digital silence are inserted into the EDIT timeline (Mike: "a nice pause ...
the title of the new chapter can be on the screen during that pause"). The pauses are NOT baked into the EDIT file
(that would cost a lossy generation and a second transcript): the middle's VIDEO is rendered by Remotion on the
paused timeline, and the middle's AUDIO is assembled at stitch time from EDIT slices + exact `anullsrc` silences,
sample-exact (atrim + concat, 8 ms fades at the inserted edges). cue_scenes.py plans the pauses and writes the
`timeline` block of <project>.scenes.resolved.json; render_spotlight.py and stitch.py read it through here.

  paused time of an EDIT time t  =  t + sum(dur of pauses with at <= t)
  a chapter card starts AT its pause (t_paused = at + earlier pauses), the chapter's first word follows the silence.
"""
import json, os, subprocess

FADE = 0.008   # s, the declick fade on an EDIT slice edge that meets an inserted silence (the desilencer's value)


def load_resolved(project):
    name = os.path.basename(os.path.abspath(project))
    path = os.path.join(project, f"{name}.scenes.resolved.json")
    if not os.path.isfile(path):
        raise SystemExit(f"missing {path} (run cue_scenes.py first)")
    return json.load(open(path, encoding="utf-8"))


def timeline(spec):
    """{fps, head, tail (EDIT s), pauses [(at_edit, dur)], pause_total, tail_paused, middle_frames}"""
    fps = spec.get("fps", 30)
    head = spec["head_until"]["t"]
    tail = spec["tail_from"]["t"]
    tl = spec.get("timeline")
    if tl:
        pauses = [(float(p["at"]), float(p["dur"])) for p in tl.get("pauses", [])]
        frames = int(tl["middle_frames"])
    else:
        pauses, frames = [], round((tail - head) * fps)
    total = sum(d for _, d in pauses)
    return dict(fps=fps, head=head, tail=tail, pauses=sorted(pauses), pause_total=total,
                tail_paused=tail + total, middle_frames=frames)


def paused(t, pauses):
    """EDIT second -> paused-timeline second."""
    return t + sum(d for a, d in pauses if a <= t)


def audio_format(path):
    out = subprocess.check_output(["ffprobe", "-v", "error", "-select_streams", "a:0", "-show_entries",
                                   "stream=sample_rate,channel_layout", "-of", "json", path]).decode()
    s = json.loads(out)["streams"][0]
    return int(s.get("sample_rate", 44100)), s.get("channel_layout", "stereo") or "stereo"


def middle_audio_graph(tl, sr, layout, src="0:a", out="ma"):
    """filter_complex lines that produce [out] = the EDIT audio of [head, tail) with every pause's silence inserted.
    Sample-exact: atrim slices + anullsrc silences, one concat. Returns the list of lines (each ends with ';')."""
    head, tail = tl["head"], tl["tail"]
    segs, cur = [], head
    for a, d in tl["pauses"]:
        if a < head - 1e-6 or a > tail + 1e-6:
            continue
        if a > cur + 1e-6:
            segs.append(("a", cur, a))
        segs.append(("z", d))
        cur = max(cur, a)
    if tail > cur + 1e-6:
        segs.append(("a", cur, tail))
    lines, labels = [], []
    for i, sg in enumerate(segs):
        lab = f"{out}_{i}"
        if sg[0] == "a":
            _, s, e = sg
            f = f"[{src}]atrim=start={s:.3f}:end={e:.3f},asetpts=PTS-STARTPTS"
            if i + 1 < len(segs) and segs[i + 1][0] == "z":
                f += f",afade=t=out:st={max(0.0, e - s - FADE):.3f}:d={FADE}"
            if i > 0 and segs[i - 1][0] == "z":
                f += f",afade=t=in:st=0:d={FADE}"
            lines.append(f + f"[{lab}];")
        else:
            lines.append(f"anullsrc=r={sr}:cl={layout},atrim=duration={sg[1]:.3f},asetpts=PTS-STARTPTS[{lab}];")
        labels.append(f"[{lab}]")
    lines.append("".join(labels) + f"concat=n={len(segs)}:v=0:a=1[{out}];")
    return lines


def describe(tl):
    s = (f"middle window EDIT {tl['head']:.3f} -> {tl['tail']:.3f} s"
         f" (+ {len(tl['pauses'])} chapter pauses = {tl['pause_total']:.2f} s) = {tl['middle_frames']} frames @ {tl['fps']}")
    return s
