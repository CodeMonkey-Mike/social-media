# One-off repair driver for batch kaspa (2026-09-10): the two V4 data slides that failed
# twice with `no-capture` on the pooled yt-posts chat. Rotates that chat (chat_pool.mark_dead:
# the documented remedy when a chat stops surfacing renders), regenerates each slide with the
# canonical gen_images.py ONE item per invocation under the chatgpt stage lock, then runs
# the full repurpose graph (idempotent) so the two held-back YT posts append and
# pipelines.repurpose flips to done. Everything else for this batch is already queued.
import subprocess, sys, time
from pathlib import Path

REPO = Path(r"C:\Users\mnede\Documents\Claude\social-media")
sys.path.insert(0, str(REPO / "repurpose"))
LOCK = REPO / "video-creation" / "shorts" / "_tooling" / "stage_lock.py"
IMG = REPO / "schedule-tweets" / "images" / "yt"
ITEMS = [("7e20eeb6", "02-the-week"), ("aa13fcdf", "02-the-comeback-list")]
OWNER = "lane3-fix-kaspa"


def run(cmd, **kw):
    print("$", " ".join(str(c) for c in cmd), flush=True)
    return subprocess.run([str(c) for c in cmd], cwd=str(REPO), **kw).returncode


def have(iid, slug):
    f = IMG / f"yt-posts-{iid}-{slug}.png"
    return f.is_file() and f.stat().st_size > 5000


missing = [(i, s) for i, s in ITEMS if not have(i, s)]
print(f"missing slides: {missing}", flush=True)
if missing:
    import chat_pool
    chat_pool.mark_dead("yt-posts")          # fresh chat on the next generation
    print("acquiring chatgpt stage lock (waits behind builders)...", flush=True)
    if run([sys.executable, LOCK, "acquire", "chatgpt", "--owner", OWNER, "--timeout-min", "240"]) != 0:
        sys.exit("could not acquire the chatgpt lock")
    try:
        for iid, slug in missing:
            for attempt in (1, 2):
                rc = run([sys.executable, "-X", "utf8", "-u", REPO / "repurpose" / "gen_images.py",
                          "--list", REPO / "repurpose" / "output" / "kaspa-lane3-fix" / f"item-{iid}.json",
                          "--prefix", "yt-posts", "--batch", "kaspa"])
                if have(iid, slug):
                    print(f"OK {slug}", flush=True)
                    break
                print(f"attempt {attempt} for {slug} did not land (rc {rc})", flush=True)
                if attempt == 1:
                    chat_pool.mark_dead("yt-posts")   # one more fresh chat, then stop
                    time.sleep(10)
    finally:
        run([sys.executable, LOCK, "release", "chatgpt", "--owner", OWNER])

still = [(i, s) for i, s in ITEMS if not have(i, s)]
if still:
    print(f"SLIDES STILL MISSING after fresh-chat retries: {still} -> needs Mike (reference/prompt change)", flush=True)
    sys.exit(2)
print("all slides present; running the full repurpose graph (idempotent)", flush=True)
rc = run([sys.executable, "-X", "utf8", "-u",
          REPO / "video-creation" / "livestream-repurpose" / "graph" / "run.py",
          "repurpose", "--batch", "kaspa"])
print(f"repurpose graph rc={rc}", flush=True)
sys.exit(rc)
