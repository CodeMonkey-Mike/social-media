"""check-fable-fallback.py: prove every headless agent spawner falls back from Fable to Opus.

Mike, 2026-10-10: "Make sure that any agent that is going to be using Fable has the ability to switch over to
Opus." When the weekly Fable allowance is out, the claude CLI refuses a `model: fable` agent with
"You've reached your Fable limit. ..." and exits 1. Every spawner must then respawn that agent ONCE with
`--model opus` (the CLI flag beats the agent frontmatter; the definitions are never edited).

What this checks:
  1. DISCOVERY: every Python file in the repo that spawns a headless agent (`claude -p --agent ...`) carries the
     canonical FABLE_LIMIT_RE and an opus respawn. A NEW spawner without them FAILS here.
  2. LIVE PROOF: the REAL spawn functions of the longform graph (longform, vertical and short lanes, incl. the
     parallel asset factory) and the livestream batch orchestrator (Lane 2 + Lane 3) are run against a fake claude
     CLI that answers like the exhausted-allowance CLI unless called with --model opus. Each Fable agent must be
     refused, then respawned on Opus, and succeed. The dashboard heartbeat is stubbed and logs go to a temp folder,
     so a graph running at the same time is never touched.
  3. The list of `model: fable` agents in .claude/agents (informational).

Usage:  python scripts/check-fable-fallback.py        exit 0 = every spawner falls back, 1 = something does not.
"""
import re
import sys
import tempfile
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8")
ROOT = Path(__file__).resolve().parents[1]
SKIP_DIRS = {"node_modules", ".git", "__pycache__", "media", "private", "assets"}
CANON = r"\bFable\b[^\n]{0,40}\blimit\b|\blimit\b[^\n]{0,40}\bFable\b"
REAL_MESSAGE = ("You've reached your Fable limit. Switch to another model, or manage usage credits at "
                "claude.ai/settings/usage?from=cc_cli_limit_message, to continue.")
FAKE_CLI = '''import sys
argv = sys.argv[1:]
agent = argv[argv.index("--agent") + 1] if "--agent" in argv else "?"
model = argv[argv.index("--model") + 1] if "--model" in argv else None
if model == "opus":
    print(f"OPUS RAN {agent}")
    sys.exit(0)
print(%r)
sys.exit(1)
''' % REAL_MESSAGE

fails = 0


def report(ok: bool, label: str):
    global fails
    fails += 0 if ok else 1
    print(f"{'PASS' if ok else 'FAIL'}  {label}")


def py_files():
    for p in ROOT.rglob("*.py"):
        if any(part in SKIP_DIRS for part in p.relative_to(ROOT).parts[:-1]):
            continue
        yield p


# 1. discovery ---------------------------------------------------------------------------------------------------
print("== 1. every headless spawner carries the fallback")
spawners = []
for p in py_files():
    if p.resolve() == Path(__file__).resolve():
        continue
    try:
        t = p.read_text(encoding="utf-8")
    except Exception:
        continue
    if re.search(r"""["']--agent["']""", t) and re.search(r"""["']-p["']""", t):
        spawners.append(p)
        m = re.search(r'^FABLE_LIMIT_RE = re\.compile\(r"(.*?)", re\.I\)$', t, re.M)
        has_pat = bool(m and m.group(1) == CANON)
        has_opus = bool(re.search(r"""FABLE_FALLBACK_MODEL|model\s*=\s*["']opus["']""", t))
        report(has_pat and has_opus, f"{p.relative_to(ROOT).as_posix()}: canonical pattern {has_pat}, opus respawn {has_opus}")
report(bool(spawners), f"{len(spawners)} spawner file(s) found")
pat = re.compile(CANON, re.I)
report(bool(pat.search(REAL_MESSAGE)), "the canonical pattern matches the CLI's real limit message")
report(not pat.search("coverage plan written") and not pat.search("rate limit on Envato, retrying"),
       "the canonical pattern ignores ordinary output")

# 2. live proof --------------------------------------------------------------------------------------------------
print("\n== 2. the real spawn functions respawn a refused Fable agent on Opus")
tmp = Path(tempfile.mkdtemp(prefix="fable-fallback-"))
fake = tmp / "fake_claude.py"
fake.write_text(FAKE_CLI, encoding="utf-8")


def proof(label, rc, out, log: Path):
    text = log.read_text(encoding="utf-8") if log.is_file() else ""
    i_limit, i_opus = text.find("reached your Fable limit"), text.find("OPUS RAN")
    report(rc == 0 and "OPUS RAN" in out and 0 <= i_limit < i_opus, f"{label}: refused on Fable, then ran on Opus")


sys.path.insert(0, str(ROOT / "video-creation" / "longform-edited" / "graph"))
import common as C  # noqa: E402
C.DATA, C._beat, C.claude_cmd = tmp / "longform", (lambda *a, **k: None), (lambda: [sys.executable, str(fake)])
st = {"project": "fable-fallback-check"}
rc, out = C.spawn_agent(st, "check", "coverage-strategist", "line one\nline two", "a.log")
proof("longform spawn_agent (longform / vertical / short lanes)", rc, out, C.DATA / "a.log")
res = C.spawn_agents_parallel(st, "check", [("transition-strategist", "p", "b.log"), ("music-placement-strategist", "p", "c.log")])
for a, lg in (("transition-strategist", "b.log"), ("music-placement-strategist", "c.log")):
    proof(f"longform spawn_agents_parallel {a}", *res[a], C.DATA / lg)

sys.path.insert(0, str(ROOT / "video-creation" / "livestream-repurpose" / "graph"))
import batch_graph as B  # noqa: E402
B.DATA, B._beat, B.claude_cmd = tmp / "batch", (lambda *a, **k: None), (lambda: [sys.executable, str(fake)])
B.DATA.mkdir(parents=True, exist_ok=True)
rc, out = B.spawn_agent({"batch": "fable-fallback-check"}, "check", "clip-strategist", "line one\nline two", "d.log")
proof("batch spawn_agent (Lane 2 + Lane 3)", rc, out, B.DATA / "d.log")

# 3. the Fable agents ---------------------------------------------------------------------------------------------
print("\n== 3. agents defined on Fable (each is covered by the spawners above, and by the main loop's Opus re-dispatch)")
for md in sorted((ROOT / ".claude" / "agents").rglob("*.md")):
    head = md.read_text(encoding="utf-8").split("---")[1] if md.read_text(encoding="utf-8").startswith("---") else ""
    if re.search(r"^model:\s*fable\b", head, re.M):
        print("  ", md.relative_to(ROOT / ".claude" / "agents").as_posix())

print(f"\n{'ALL PASS' if not fails else str(fails) + ' FAIL'}")
sys.exit(1 if fails else 0)
