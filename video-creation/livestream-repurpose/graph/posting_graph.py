# posting_graph.py — the POSTING graph (posting-tail migration, 2026-08-11).
#
# One invocation posts ONE pending entry to ONE platform: POSTING STAYS MIKE-GATED
# AND SEQUENTIAL — the invocation IS his decision to post, exactly like every other
# segment's contract. 2-node StateGraph per the house template:
#
#   START -> post -> verify_post -> END          (halt edge on both nodes)
#
# `post` shells the CANONICAL ported Python uploader for the platform (which does
# its own title-keyed longs.json write-back — the duplicate-post guard). `verify_post`
# then re-reads longs.json FROM DISK and asserts the exact entry captured at the
# front door flipped to posted/posted_unverified with a URL. One attempt per run,
# zero retries by topology: on failure READ THE LOG, never relaunch blindly (a
# "failed" post may have landed — the write-back and the platform page are truth).
#
# Wired kinds: --kind longform (rumble | bitchute | facebook, longs.json) and
# --kind short (bitchute only so far, shorts.json). Further shorts/social posters
# join the SHORT_SCRIPTS map only as each port is live-blessed.

import json
import sys
from pathlib import Path
from typing import Optional, TypedDict

sys.path.insert(0, str(Path(__file__).resolve().parent))
from intake_graph import _run_streaming, record_run, finish_progress  # noqa: E402

from langgraph.graph import StateGraph, START, END  # noqa: E402

REPO_ROOT = Path(__file__).resolve().parents[3]
ST_SCRIPTS = REPO_ROOT / "schedule-tweets" / "scripts"
LONGS_JSON = REPO_ROOT / "schedule-tweets" / "data" / "longs.json"
SHORTS_JSON = REPO_ROOT / "schedule-tweets" / "data" / "shorts.json"

LONGFORM_SCRIPTS = {
    "rumble": "upload_longform_rumble.py",
    "bitchute": "upload_longform_bitchute.py",
    "facebook": "upload_longform_facebook.py",
}
# Shorts/social posters join this map ONLY as each port is live-blessed; until
# then the JS twin stays the invoked poster (bless-pending doctrine).
SHORT_SCRIPTS = {
    "bitchute": "post_bitchute_short.py",
}

OK_STATUSES = {"posted", "posted_unverified"}


class PostState(TypedDict, total=False):
    kind: str
    platform: str
    entry_id: str
    entry_title: str
    stub: str
    status: str
    error: Optional[str]
    post_out: dict
    post: dict


def _route(next_node):
    def route(state):
        return "halt" if state.get("status") == "failed" else next_node
    return route


def post(state: PostState) -> dict:
    if state.get("stub"):
        if state["stub"] == "fail":
            return {"status": "failed", "error": "stub fail"}
        return {"post_out": {"stub": True}}
    scripts = SHORT_SCRIPTS if state.get("kind") == "short" else LONGFORM_SCRIPTS
    script = scripts[state["platform"]]
    rc, output = _run_streaming(
        [sys.executable, "-u", str(ST_SCRIPTS / script)],
        lane=7, node="post")
    if rc != 0:
        return {"status": "failed",
                "error": f"{script} exited {rc} — READ THE LOG before any re-run: "
                         f"the post may have landed (check longs.json + the platform page)."}
    return {"post_out": {"rc": rc}}


def verify_post(state: PostState) -> dict:
    """Verify FROM DISK: the exact entry captured at the front door must now read
    posted/posted_unverified with a URL for this platform."""
    if state.get("stub"):
        return {"post": {"platform": state.get("platform", "stub"),
                         "status": "posted", "url": "stub://ok",
                         "title": state.get("entry_title", "stub")},
                "status": "done"}
    is_short = state.get("kind") == "short"
    qpath, qkey = (SHORTS_JSON, "shorts") if is_short else (LONGS_JSON, "longs")
    data = json.loads(qpath.read_text(encoding="utf-8"))
    row = next((l for l in data.get(qkey) or [] if l.get("id") == state["entry_id"]), None)
    if not row:
        return {"status": "failed",
                "error": f"entry {state['entry_id']} vanished from {qpath.name}"}
    plat = (row.get("platforms") or {}).get(state["platform"]) or {}
    if plat.get("status") not in OK_STATUSES or not plat.get("url"):
        return {"status": "failed",
                "error": f"{qpath.name} did not flip: {state['platform']} status="
                         f"{plat.get('status')!r} url={plat.get('url')!r}. The uploader "
                         f"printed its own diagnosis — read its output; do NOT blindly "
                         f"re-run (re-running a landed-but-unrecorded post duplicates it)."}
    return {"post": {"platform": state["platform"], "status": plat["status"],
                     "url": plat["url"], "title": row.get("title"),
                     "posted_at": plat.get("posted_at")},
            "status": "done"}


def build_post_graph(checkpointer=None):
    g = StateGraph(PostState)
    g.add_node("post", post)                     # default retry policy = none. Keep it.
    g.add_node("verify_post", verify_post)
    g.add_edge(START, "post")
    g.add_conditional_edges("post", _route("verify_post"),
                            {"verify_post": "verify_post", "halt": END})
    g.add_edge("verify_post", END)
    return g.compile(checkpointer=checkpointer)
