#!/usr/bin/env python
"""
Builds the five slides of the `langgraph-updates` session: ONE slide per browser tab (Mike, 2026-11-06: "I just want to have
a tab open to a single slide"), in the same look as the quant session's slide. No scrolling, no animation to wait for.

Every number is computed at build time from the real code and the real run:
  agents + agent calls   the `spawn_agent(...)` calls in batch_graph.py, now and at BEFORE_REV (the commit before the change)
  model tiers            each agent definition's frontmatter
  agent runs             the `===== <agent> @ <time> =====` headers the graph writes into graph/data/agent-*-<batch>*.log
  images + image checks  each clip's broll-images.json and broll-visual-qa.md in video-creation/shorts/<batch>/
The numbers are saved to ../research/facts.json. When the run's logs have been cleaned up, the build reuses that file.

  python build_slides.py            build the five .html files
  python build_slides.py --shoot    also screenshot each one into _qa/ (1920x1080 and 1920x940) for a look
"""
import json
import re
import subprocess
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
HERE = Path(__file__).resolve().parent
REPO = HERE.parents[4]
BATCH = "ripping"
BEFORE_REV = "3e7033a1"   # the last commit before the build step was split
GRAPH_REL = "video-creation/livestream-repurpose/graph/batch_graph.py"
LOGS = REPO / "video-creation/livestream-repurpose/graph/data"
SHORTS = REPO / "video-creation/shorts" / BATCH
FACTS = HERE.parent / "research" / "facts.json"
READ = "Nov 19, 2026"

AGENT_FILES = {
    "clip-strategist": ".claude/agents/clip-strategist.md",
    "tighten-strategist": ".claude/agents/tighten-strategist.md",
    "lane3-drafter": ".claude/agents/lane3-drafter.md",
    "remotion-builder": ".claude/agents/remotion-builder.md",
    "image-gen": ".claude/agents/longform-edited/image-gen.md",
    "visual-qa": ".claude/agents/shared/visual-qa.md",
    "publish-meta-author": ".claude/agents/publish-meta-author.md",
}
SPAWN_RE = re.compile(r'spawn_agent\(state, node, "([\w-]+)"')


def compute():
    now = SPAWN_RE.findall((REPO / GRAPH_REL).read_text(encoding="utf-8"))
    old_src = subprocess.run(["git", "show", f"{BEFORE_REV}:{GRAPH_REL}"], cwd=str(REPO), capture_output=True, text=True,
                             encoding="utf-8", check=True).stdout
    old = SPAWN_RE.findall(old_src)
    tiers = {}
    for name, rel in AGENT_FILES.items():
        head = (REPO / rel).read_text(encoding="utf-8").split("---")[1]
        model = re.search(r"^model:\s*(\S+)", head, re.M).group(1)
        effort = re.search(r"^effort:\s*(\S+)", head, re.M).group(1)
        tiers[name] = f"{model}, {effort} effort"
    runs = {}
    logs = sorted(LOGS.glob(f"agent-*{BATCH}*.log"))
    if not logs:
        raise FileNotFoundError(f"no agent logs for batch {BATCH} in {LOGS}")
    for f in logs:
        for agent in re.findall(r"^===== (\S+) @ \S+ =====$", f.read_text(encoding="utf-8", errors="replace"), re.M):
            runs[agent] = runs.get(agent, 0) + 1
    clips = json.loads((SHORTS / "progress.json").read_text(encoding="utf-8"))["clips"]
    clips = [c for c in clips if not str(c.get("gate", "")).startswith("deleted")]
    images, first, retry, still = 0, 0, 0, 0
    for c in clips:
        d = SHORTS / c["slug"]
        images += len(json.loads((d / "broll-images.json").read_text(encoding="utf-8")))
        report = (d / "broll-visual-qa.md").read_text(encoding="utf-8")
        rnd = int(re.search(r"visual QA, round (\d+)", report.splitlines()[0]).group(1))
        verdict = re.findall(r"^\W*VERDICT:\s*(PASS|FAIL)\b", report, re.M)[-1]
        first += verdict == "PASS" and rnd == 1
        retry += verdict == "PASS" and rnd > 1
        still += verdict == "FAIL"
    built = sum(1 for c in clips if str(c.get("phase")) == "7-built" and "PASS" in str(c.get("gate", "")))
    f = {
        "agents_now": sorted(set(now)), "calls_now": len(now), "agents_before": sorted(set(old)), "calls_before": len(old),
        "tiers": tiers, "runs": runs, "runs_total": sum(runs.values()), "clips": len(clips), "built": built, "images": images,
        "check_first": first, "check_retry": retry, "check_still": still,
        # what the one-agent build would have run for the same clips: every other agent as it ran, one builder per clip,
        # and visual-qa once (the post images). Computed, never measured.
        "runs_old_design": runs["clip-strategist"] + runs["tighten-strategist"] + runs["lane3-drafter"]
                           + runs["publish-meta-author"] + len(clips) + 1,
    }
    n = f["clips"]
    assert set(f["agents_now"]) == set(AGENT_FILES), f["agents_now"]
    assert f["runs"]["remotion-builder"] == 2 * n, "the builder should have run twice per clip"
    assert f["check_first"] + f["check_retry"] + f["check_still"] == n and f["built"] == n
    return f


def facts():
    try:
        f = compute()
        FACTS.parent.mkdir(parents=True, exist_ok=True)
        FACTS.write_text(json.dumps(f, indent=2) + "\n", encoding="utf-8")
        print("FACTS computed ->", FACTS)
        return f
    except FileNotFoundError as e:
        if not FACTS.is_file():
            raise
        print(f"FACTS reused from {FACTS} ({e})")
        return json.loads(FACTS.read_text(encoding="utf-8"))


CSS = """
:root{--bg:#0a0c10;--card:#12151c;--green:#00e68a;--cyan:#00c2ff;--gold:#ffd700;--red:#ff4060;--text:#e8eaf0;--muted:#8892a4;--border:#1e2330}
html{font-size:min(2.1vh,1.19vw);background:var(--bg)}
*{box-sizing:border-box}
body{margin:0;height:100vh;overflow:hidden;background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;display:flex;flex-direction:column;justify-content:center;padding:2.4rem 4.5rem;position:relative}
body>*{position:relative;z-index:1}
.orb{position:absolute;width:520px;height:520px;border-radius:50%;filter:blur(100px);opacity:.2;background:var(--cyan);bottom:-240px;left:-140px;z-index:0}
.label{font-size:.8rem;text-transform:uppercase;letter-spacing:.18em;color:#6b7588;font-weight:500}
h1{font-family:'Playfair Display',serif;font-weight:900;font-variant-numeric:lining-nums;font-size:3.4rem;line-height:1.1;margin:.5rem 0 0}
.divider{width:60px;height:3px;background:linear-gradient(90deg,var(--green),var(--cyan));border-radius:2px;margin:1rem 0 1.3rem}
.mono{font-family:'JetBrains Mono',monospace;font-weight:600}
.box{background:linear-gradient(135deg,rgba(0,230,138,.08),rgba(0,194,255,.06));border:1px solid rgba(0,230,138,.2);border-radius:12px;padding:.95rem 1.5rem;font-size:1.25rem;line-height:1.45;margin-top:1.3rem}
.box b{color:var(--green);font-weight:700}
.source{font-size:.8rem;color:#7a8496;margin-top:.8rem}
.tag{display:inline-block;font-family:'JetBrains Mono',monospace;font-weight:600;font-size:.72rem;letter-spacing:.1em;padding:.16rem .5rem;border-radius:999px;vertical-align:middle;margin-left:.5rem}
.tag.new{background:var(--gold);color:#141000}
.tag.more{border:1px solid var(--cyan);color:var(--cyan)}
"""

HEAD = """<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=JetBrains+Mono:wght@600&family=Playfair+Display:wght@700;900&display=swap" rel="stylesheet">
<style>"""


def page(name, title, label, h1, body, css):
    html = (HEAD.replace("{title}", title) + CSS + css + "</style></head><body>\n<div class=\"orb\"></div>\n"
            f"<div class=\"label\">{label}</div>\n<h1>{h1}</h1><div class=\"divider\"></div>\n{body}\n</body></html>\n")
    if "—" in html or "–" in html:
        raise SystemExit(f"{name}: a dash on the slide")
    out = HERE / name
    out.write_text(html, encoding="utf-8")
    print("WROTE", out)
    return out


# ── 1. one agent became four steps ────────────────────────────────────────────────────────────────────────────────────
def slide_steps(f):
    css = """
.rowlabel{font-size:.78rem;text-transform:uppercase;letter-spacing:.16em;color:#6b7588;font-weight:700;margin:0 0 .5rem}
.old{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:.85rem 1.3rem;display:flex;align-items:center;gap:1.6rem;margin-bottom:1.5rem}
.old .who{font-size:1.2rem;color:var(--muted);white-space:nowrap}
.old .jobs{display:flex;gap:.6rem;flex-wrap:nowrap}
.old .jobs span{border:1px solid #2a3142;border-radius:999px;padding:.3rem .85rem;font-size:1rem;color:#aab3c5;white-space:nowrap}
.old .count{margin-left:auto;font-size:.95rem;color:var(--muted);white-space:nowrap}
.flow,.back{display:grid;grid-template-columns:1fr 2.4rem 1fr 2.4rem 1fr 2.4rem 1fr}
.flow{align-items:stretch}
.node{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:1rem 1.15rem 1.05rem;position:relative;overflow:hidden}
.node::before{content:"";position:absolute;top:0;left:0;right:0;height:3px;background:var(--c)}
.node .step{font-size:.78rem;letter-spacing:.16em;font-weight:700;color:var(--c)}
.node .who{font-size:1.28rem;margin:.45rem 0 .5rem}
.node .what{font-size:1.02rem;line-height:1.4;color:#c3cad8}
.node .code{display:block;margin-top:.55rem;font-size:.86rem;color:var(--muted)}
.cy{--c:var(--cyan)}.gd{--c:var(--gold)}.gr{--c:var(--green)}
.arrow{display:flex;align-items:center;justify-content:center;font-size:1.6rem;color:#56607a}
.back .loop{grid-column:3 / 6;margin:0 23%;height:2.5rem;border:2px dashed var(--gold);border-top:none;border-radius:0 0 14px 14px;position:relative}
.back .loop::before{content:"";position:absolute;left:-.48rem;top:-.45rem;border-left:.42rem solid transparent;border-right:.42rem solid transparent;border-bottom:.7rem solid var(--gold)}
.back .note{grid-column:3 / 6;text-align:center;font-size:.98rem;color:var(--gold);margin-top:.45rem}
"""
    body = f"""<div class="rowlabel">Before</div>
<div class="old"><div class="who mono">remotion-builder</div>
<div class="jobs"><span>plans the images</span><span>generates them in the browser</span><span>checks its own images</span><span>builds the video</span></div>
<div class="count">1 agent, 1 run per short</div></div>
<div class="rowlabel">Now</div>
<div class="flow">
<div class="node cy"><div class="step">1 · PLAN</div><div class="who mono">remotion-builder</div><div class="what">Writes the plan and a JSON list of the images to make. Then it stops.</div></div>
<div class="arrow">&rarr;</div>
<div class="node gd"><div class="step">2 · IMAGES<span class="tag new">NEW</span></div><div class="who mono">image-gen</div><div class="what">Generates every image on the list.<span class="code">The graph's code holds the browser lock.</span></div></div>
<div class="arrow">&rarr;</div>
<div class="node gr"><div class="step">3 · IMAGE CHECK</div><div class="who mono">visual-qa</div><div class="what">Opens every image. Reports PASS or FAIL and changes nothing.</div></div>
<div class="arrow">&rarr;</div>
<div class="node cy"><div class="step">4 · BUILD</div><div class="who mono">remotion-builder</div><div class="what">Builds the video from the files on disk.</div></div>
</div>
<div class="back"><div class="loop"></div><div class="note">FAIL: back to image-gen with the checker's report, 2 rounds at most</div></div>
<div class="box"><b>4 steps, 3 agents per short.</b> The same builder is called twice, and it never touches the browser.</div>
<div class="source">Source: batch_graph.py, the per-clip build pipeline, read {READ}.</div>"""
    return page("one-agent-became-four-steps.html", "One Agent Became Four Steps", "The livestream graph &middot; the step that builds each short",
                "One Agent Became Four Steps", body, css)


# ── 2. why split it ───────────────────────────────────────────────────────────────────────────────────────────────────
def slide_why(f):
    t = f["tiers"]
    css = """
.rows{display:grid;grid-template-columns:1fr 2.6rem 1fr;row-gap:.85rem;align-items:stretch}
.head{font-size:.78rem;text-transform:uppercase;letter-spacing:.16em;font-weight:700;color:#6b7588;padding:0 0 .1rem .2rem}
.cell{border-radius:14px;padding:.85rem 1.25rem .9rem;border:1px solid var(--border);background:var(--card)}
.cell h3{margin:0 0 .3rem;font-size:1.28rem;font-weight:700;line-height:1.25}
.cell p{margin:0;font-size:1.02rem;line-height:1.4;color:#c3cad8}
.bad{border-color:rgba(255,64,96,.35);background:rgba(255,64,96,.05)}.bad h3{color:#ff8fa3}
.good{border-color:rgba(0,230,138,.35);background:rgba(0,230,138,.05)}.good h3{color:var(--green)}
.arrow{display:flex;align-items:center;justify-content:center;font-size:1.6rem;color:#56607a}
.rule{margin-top:1.2rem;border:1px solid rgba(255,215,0,.35);background:rgba(255,215,0,.05);border-radius:12px;padding:.9rem 1.5rem;font-size:1.4rem;font-weight:700;color:var(--gold)}
.rule span{color:var(--text);font-weight:500}
"""
    body = f"""<div class="rows">
<div class="head">The one-agent build</div><div></div><div class="head">What changed</div>
<div class="cell bad"><h3>It waited for the browser, and a waiting agent can quit</h3><p>One browser, one image at a time. A builder once ended its turn while it waited, and the run sat there.</p></div>
<div class="arrow">&rarr;</div>
<div class="cell good"><h3>The lock moved into code</h3><p>The graph takes the lock, starts the image agent, and releases it in a <span class="mono">finally</span> block.</p></div>
<div class="cell bad"><h3>It checked its own images</h3><p>No second pair of eyes saw a short's images before the video was built.</p></div>
<div class="arrow">&rarr;</div>
<div class="cell good"><h3>A separate agent checks every image</h3><p>It only reports: PASS or FAIL, the defect, and the fix for the prompt.</p></div>
<div class="cell bad"><h3>Mechanical work ran on the builder's model</h3><p>Image generation ran inside the builder: <span class="mono">{t['remotion-builder']}</span>.</p></div>
<div class="arrow">&rarr;</div>
<div class="cell good"><h3>The image agent runs on a smaller model</h3><p><span class="mono">{t['image-gen']}</span>. The builder keeps its model for the video code.</p></div>
</div>
<div class="rule">One agent per decision. <span>Where nothing is being decided, it's code.</span></div>"""
    return page("why-i-split-it.html", "Why I Split It", "Why the build step was rebuilt", "Three Problems With One Agent Doing It All", body, css)


# ── 3. the 7 agents ───────────────────────────────────────────────────────────────────────────────────────────────────
def slide_agents(f):
    t = f["tiers"]
    n_now, n_before = len(f["agents_now"]), len(f["agents_before"])
    css = """
.cols{display:grid;grid-template-columns:1fr 1.12fr;gap:1.4rem;align-items:stretch}
.left{display:flex;flex-direction:column;justify-content:space-between}
.group{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:.9rem 1.3rem .5rem;position:relative;overflow:hidden}
.group::before{content:"";position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--c),transparent)}
.group .gl{font-size:.78rem;text-transform:uppercase;letter-spacing:.16em;font-weight:700;color:var(--c);margin-bottom:.35rem}
.agent{padding:.62rem 0;border-top:1px solid var(--border)}
.agent:first-of-type{border-top:none}
.agent .top{display:flex;align-items:baseline;justify-content:space-between;gap:1rem}
.agent .name{font-size:1.18rem}
.agent .tier{font-size:.86rem;color:var(--muted);white-space:nowrap}
.agent .job{font-size:1rem;color:#c3cad8;margin-top:.2rem}
.agent.hl{background:rgba(255,215,0,.05);margin:0 -1.3rem;padding-left:1.3rem;padding-right:1.3rem;border-top-color:rgba(255,215,0,.3)}
.agent.hl + .agent{border-top-color:rgba(255,215,0,.3)}
.stats{display:grid;grid-template-columns:1fr 1fr;gap:1rem;margin-top:1rem}
.stat{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:.7rem 1.1rem}
.stat .big{font-family:'JetBrains Mono',monospace;font-weight:600;font-size:2rem;color:var(--green)}
.stat .big i{font-style:normal;color:#56607a;font-size:1.5rem;margin:0 .35rem}
.stat .big s{text-decoration:none;color:var(--muted)}
.stat .cap{font-size:.95rem;color:#c3cad8;margin-top:.1rem}
"""

    def agent(name, job, tag="", hl=False):
        return (f'<div class="agent{" hl" if hl else ""}"><div class="top"><div class="name mono">{name}{tag}</div>'
                f'<div class="tier mono">{t[name]}</div></div><div class="job">{job}</div></div>')

    body = f"""<div class="cols">
<div class="left">
<div class="group" style="--c:var(--cyan)"><div class="gl">Judgment, hands back a plan</div>
{agent("clip-strategist", "picks the clips from the transcript")}
{agent("tighten-strategist", "plans which filler to cut from a clip")}
{agent("lane3-drafter", "drafts the tweets, threads and posts")}
</div>
<div class="stats">
<div class="stat"><div class="big"><s>{n_before}</s><i>&rarr;</i>{n_now}</div><div class="cap">agents in this graph</div></div>
<div class="stat"><div class="big"><s>{f['calls_before']}</s><i>&rarr;</i>{f['calls_now']}</div><div class="cap">places the code starts an agent</div></div>
</div>
</div>
<div class="group" style="--c:var(--green)"><div class="gl">Builds or checks</div>
{agent("remotion-builder", "plans each short's images, then builds its video", '<span class="tag more">CALLED TWICE PER SHORT</span>')}
{agent("image-gen", "generates each short's images in the browser", '<span class="tag new">NEW IN THIS GRAPH</span>', hl=True)}
{agent("visual-qa", "checks every generated image, for the posts and now for the shorts", '<span class="tag more">2 JOBS NOW</span>')}
{agent("publish-meta-author", "writes the titles and captions")}
</div>
</div>
<div class="source">Source: the spawn_agent calls in batch_graph.py and each agent definition's model and effort lines, read {READ}.</div>"""
    return page("seven-agents.html", f"{n_now} Agents Work Inside This Graph", "The agents", f"{n_now} Agents Work Inside This Graph", body, css)


# ── 4. the first live run ─────────────────────────────────────────────────────────────────────────────────────────────
def slide_run(f):
    r, n = f["runs"], f["clips"]
    retries = r["image-gen"] - n
    detail = {
        "remotion-builder": f"{n} plans + {n} builds",
        "visual-qa": f"{r['visual-qa'] - 1} for the shorts + 1 for the posts",
        "image-gen": f"{n} first rounds + {retries} retries",
        "tighten-strategist": "", "clip-strategist": "", "lane3-drafter": "", "publish-meta-author": "",
    }
    top = max(r.values())
    css = """
.cols{display:grid;grid-template-columns:1.55fr 1fr;gap:1.6rem;align-items:stretch}
.card{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:1rem 1.3rem;position:relative;overflow:hidden}
.card::before{content:"";position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--gold),transparent)}
.bar{display:grid;grid-template-columns:12.6rem 1fr;align-items:center;gap:.9rem;padding:.42rem 0}
.bar .name{font-size:1.02rem;color:#c3cad8}
.bar .track{display:flex;align-items:center;gap:.7rem}
.bar .fill{flex:0 0 auto;height:1.25rem;border-radius:6px;background:linear-gradient(90deg,var(--cyan),var(--green))}
.bar .num{font-family:'JetBrains Mono',monospace;font-weight:600;font-size:1.25rem;color:var(--text)}
.bar .why{font-size:.88rem;color:var(--muted);white-space:nowrap}
.bar.small .fill{background:#3a4358}
.side{display:grid;gap:.8rem}
.stat{background:var(--card);border:1px solid var(--border);border-radius:14px;padding:.75rem 1.2rem}
.stat .big{font-family:'JetBrains Mono',monospace;font-weight:600;font-size:2.3rem;color:var(--green);line-height:1.1}
.stat .cap{font-size:1rem;color:#c3cad8}
.stat.dim .big{color:var(--muted)}
.pillhead{font-size:.8rem;text-transform:uppercase;letter-spacing:.16em;font-weight:700;color:#7a8496;margin:1.1rem 0 .5rem}
.pills{display:grid;grid-template-columns:1fr 1fr 1.7fr;gap:.8rem}
.pill{border-radius:12px;padding:.7rem 1.1rem;border:1px solid var(--c);background:var(--card);font-size:1.02rem;line-height:1.35;color:#c3cad8;display:flex;align-items:center;gap:.9rem}
.pill b{font-family:'JetBrains Mono',monospace;font-weight:600;font-size:2rem;color:var(--c)}
"""
    order = sorted(r, key=lambda k: (-r[k], k))
    bars = ""
    for name in order:
        why = f'<span class="why">{detail.get(name, "")}</span>' if detail.get(name) else ""
        bars += (f'<div class="bar{" small" if r[name] < 3 else ""}"><div class="name mono">{name}</div><div class="track">'
                 f'<div class="fill" style="width:{r[name] / top * 11:.2f}rem"></div><div class="num">{r[name]}</div>{why}</div></div>')
    body = f"""<div class="cols">
<div class="card">{bars}</div>
<div class="side">
<div class="stat"><div class="big">{f['built']}</div><div class="cap">shorts built, every one through all 4 steps</div></div>
<div class="stat"><div class="big">{f['images']}</div><div class="cap">images planned by the builder</div></div>
<div class="stat dim"><div class="big">{f['runs_old_design']}</div><div class="cap">runs the one-agent build would have taken (computed)</div></div>
</div>
</div>
<div class="pillhead">The image check, by short</div>
<div class="pills">
<div class="pill" style="--c:var(--green)"><b>{f['check_first']}</b><span>passed the first time</span></div>
<div class="pill" style="--c:var(--cyan)"><b>{f['check_retry']}</b><span>passed after one retry</span></div>
<div class="pill" style="--c:var(--gold)"><b>{f['check_still']}</b><span>still had a rejected image after 2 rounds, so the builder built without it</span></div>
</div>
<div class="source">Source: the graph's own agent logs and each short's image list and image-check report, one livestream, Nov 18 to 19, 2026.</div>"""
    return page("first-live-run.html", f"One Livestream. {f['runs_total']} Agent Runs.", "The first live run", f"One Livestream. {f['runs_total']} Agent Runs.", body, css)


# ── 5. what the image check caught ────────────────────────────────────────────────────────────────────────────────────
PAIRS = [
    # (rejected source, passing source, jpg stem, box class, what the checker wrote (verbatim from its report), where from)
    ("hate-eth-go-where-the-money-is/_qa/rejected/broll-rip4-hate-it.round1.png", "render-assets/broll-rip4-hate-it.png", "coin", "sq",
     "the model added a flat cartoon face (two eyes and a smirk) left of the diamond",
     "The prompt asked for only the coin's own mark."),
    ("pieverse-17x-at-a-billion-impact/_qa/rejected/broll-rip6-hook-billion.r1-satchel.png", "render-assets/broll-rip6-hook-billion.png", "cat", "tall",
     "the cat wears a satchel and bedroll that are in neither the prompt nor the reference",
     "The same in all 5 images of that short."),
]


def slide_caught(f):
    from PIL import Image
    img = HERE / "img"
    img.mkdir(exist_ok=True)
    prog = SHORTS / "progress.json"
    numbers = {c["slug"]: c["n"] for c in json.loads(prog.read_text(encoding="utf-8"))["clips"]} if prog.is_file() else {}
    for bad, good, stem, _cls, quote, _note in PAIRS:
        for src, kind in ((bad, "rejected"), (good, "passed")):
            jpg = img / f"{stem}-{kind}.jpg"
            if (SHORTS / src).is_file():
                im = Image.open(SHORTS / src).convert("RGB")
                im.thumbnail((900, 900))
                im.save(jpg, quality=88)
            elif not jpg.is_file():   # the batch's own images are recycled when it completes: the copy here is then the record
                raise SystemExit(f"caught: neither {SHORTS / src} nor {jpg} exists")
        # the quoted words must be the checker's own, from its first-round report in the graph's log (while that log exists)
        log = LOGS / f"agent-visual-qa-{BATCH}-clip{numbers.get(bad.split('/')[0])}.log"
        if log.is_file() and quote not in log.read_text(encoding="utf-8", errors="replace"):
            raise SystemExit(f"caught: the quoted words are not in {log.name}: {quote}")
    css = """
.pairs{display:flex;justify-content:center;gap:3.4rem;align-items:flex-start}
.pair .imgs{display:flex;align-items:center;gap:.8rem}
.shot{position:relative;border-radius:14px;overflow:hidden;border:3px solid var(--c);height:19rem;flex:0 0 auto}
.shot img{display:block;height:100%;width:100%;object-fit:cover}
.pair.sq{width:41.2rem}.pair.tall{width:30.6rem}
.sq .shot{width:19rem}
.tall .shot{width:13.7rem}
.tall .shot img{object-position:50% 78%}
.shot .cap{position:absolute;left:.6rem;top:.6rem;font-family:'JetBrains Mono',monospace;font-weight:600;font-size:.72rem;letter-spacing:.1em;padding:.2rem .55rem;border-radius:999px;background:var(--c);color:#0a0c10}
.arrow{font-size:1.6rem;color:#56607a;flex:1 1 auto;text-align:center}
.said{margin-top:.8rem;font-size:1.05rem;line-height:1.4;color:#c3cad8}
.said q{color:var(--text);font-style:italic}
.said .note{display:block}
.said .who{display:block;font-size:.78rem;text-transform:uppercase;letter-spacing:.16em;font-weight:700;color:#6b7588;margin-bottom:.2rem}
"""
    blocks = ""
    for _bad, _good, stem, cls, quote, note in PAIRS:
        blocks += f"""<div class="pair {cls}"><div class="imgs">
<div class="shot" style="--c:var(--red)"><img src="img/{stem}-rejected.jpg" alt=""><div class="cap">REJECTED</div></div>
<div class="arrow">&rarr;</div>
<div class="shot" style="--c:var(--green)"><img src="img/{stem}-passed.jpg" alt=""><div class="cap">AFTER THE RETRY</div></div>
</div><div class="said"><span class="who">The checker's report</span><q>{quote}</q><span class="note">{note}</span></div></div>
"""
    body = f"""<div class="pairs">{blocks}</div>
<div class="box">The checker reports the defect <b>and the fix for the prompt</b>. The image agent regenerates only the rejected files.</div>"""
    return page("what-the-check-caught.html", "What The Image Check Caught", "The first live run &middot; the independent check",
                "What The Image Check Caught", body, css)


def shoot(pages):
    from playwright.sync_api import sync_playwright
    qa = HERE / "_qa"
    qa.mkdir(exist_ok=True)
    with sync_playwright() as pw:
        b = pw.chromium.launch(channel="chrome", headless=True)
        for w, h in ((1920, 1080), (1920, 940)):   # full screen, and a maximized Chrome window under its address bar
            pg = b.new_page(viewport={"width": w, "height": h})
            for p in pages:
                pg.goto(p.as_uri(), wait_until="networkidle")
                pg.wait_for_timeout(600)
                over = pg.evaluate("() => [document.body.scrollHeight - innerHeight, document.body.scrollWidth - innerWidth,"
                                   " [...document.body.children].filter(e => { if (e.className === 'orb') return false; const r = e.getBoundingClientRect(); return r.bottom > innerHeight + 1 || r.top < -1 || r.right > innerWidth + 1; }).length]")
                out = qa / f"{p.stem}-{w}x{h}.png"
                pg.screenshot(path=str(out))
                print(f"SHOT {out.name} overflow(y,x,elements)={over}")
            pg.close()
        b.close()


if __name__ == "__main__":
    F = facts()
    print(json.dumps({k: v for k, v in F.items() if k != "tiers"}, indent=1))
    PAGES = [slide_steps(F), slide_why(F), slide_agents(F), slide_run(F), slide_caught(F)]
    if "--shoot" in sys.argv:
        shoot(PAGES)
