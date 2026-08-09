# repurpose_graph.py — livestream-repurpose Lane 3 (text/image repurpose) as a
# LangGraph StateGraph. Wave 6 (2026-08-09).
#
# Same doctrine as intake_graph.py (the template — read its header): canonical scripts
# wrapped as subprocesses, disk is the contract, zero retries, verify nodes HALT,
# SQLite checkpoints, stub + sandbox modes, runs feed the :8766 dashboard.
#
# ONE graph = ONE mechanical segment. Lane 3's judgment — topic choice, fact-checking,
# drafting every word of copy, image prompt authoring — happens in the Claude session
# and lands on disk as repurpose/output/<batch>-lane3-plan.json BEFORE this segment
# runs (the clip-plan.json seam contract). The segment executes the plan mechanically:
#
#   START -> generate -> verify_images -> queues -> verify_queues
#         -> lint -> finalize -> verify_finalize -> END
#   any node:      -> (failed) -> END                   <- HALT route
#
# generate drives the ported Python browser stack (repurpose/gen_images.py +
# chat_pool.py + chat_delete.py — the JS twins are FROZEN rollback) under the shared
# `chatgpt` stage lock. verify_images is a SUBPROCESS stage (lane3_batch --stage
# verify), a documented deviation from the in-node verify style: the image checks
# (PIL dims, byte-dup) live in ONE place, lane3_batch.py, shared with hand runs; the
# node still trusts only disk and still halts on rc != 0. verify_queues / verify_
# finalize are in-node like the rest of the family.
#
# Sandbox: --test-sandbox redirects data-dir/images-base/chat-registry/batches.json
# into scratch AND forces --fake-gen (placeholder renders) — the sandbox never drives
# the real browser, never touches the real ChatGPT account or registry. The browser
# stack's own bless is therefore the LIVE run (staged within it: registry read ->
# generation -> deletion sweep last), per Mike's 2026-08-09 "port Lane 3 now" call
# overriding the ports-LAST ordering.

import json
import re
import sys
from pathlib import Path
from typing import Optional, TypedDict

from langgraph.graph import StateGraph, START, END

sys.path.insert(0, str(Path(__file__).resolve().parent))
from intake_graph import (  # noqa: E402
    REPO_ROOT, _fail, _read_json, _run_streaming,
)

LANE3 = REPO_ROOT / "repurpose" / "lane3_batch.py"
PERSONA_LINT = REPO_ROOT / "scripts" / "persona-lint.py"

IMG_RE = re.compile(r"^IMG (OK|SKIP|FAIL) purpose=(\S+) id=(\S+) slug=(\S+)")
VERIFY_IMG_RE = re.compile(r"^VERIFY IMG OK id=(\S+)")
ENTRY_RE = re.compile(r"^\s*entry (ADDED|SKIP \(present\))\s*:\s*(\S+)")
REGISTERED_RE = re.compile(r"^REGISTERED=(\S+)")

# queue plan-key -> (file name, list key, entry lookup field)
QUEUES = {
    "x_tweets": ("x-tweets.json", "tweets", "image_id"),
    "x_threads": ("x-threads.json", "threads", "id"),
    "x_polls": ("x-polls.json", "polls", "id"),
    "yt_posts": ("yt-posts.json", "posts", "id"),
    "yt_text_polls": ("yt-text-polls.json", "polls", "id"),
    "ig_single": ("ig-single-image.json", "posts", "id"),
}


class RepurposeState(TypedDict, total=False):
    # inputs (set by run.py, deterministic for the whole run)
    batch: str
    plan_path: str
    run_date: str
    data_dir: str            # schedule-tweets/data (or its sandbox twin)
    images_base: str         # schedule-tweets/images (or its sandbox twin)
    registry: str            # "" = production chatgpt-image-chats.json
    registry_root: str       # dir holding batches.json (repo root, or the sandbox)
    fake_gen: bool           # sandbox-only placeholder renders
    test_sandbox: str        # "" = real run
    stub: str                # "" = real; ok|fail = structural test
    # derived by run.py from the validated plan (nodes never re-derive)
    expected_images: list    # [{id, purpose, slug, file}] — file is absolute
    expected_entries: dict   # {plan_key: [entry keys]}
    # bookkeeping
    generate_out: dict
    queues_out: dict
    lint_out: dict
    finalize_out: dict
    repurpose: dict          # verify_finalize's final assembled summary
    status: str              # running | done | failed
    error: Optional[str]


# ── stubs (structural tests — no browser, no writes) ─────────────────────────

def _stub_script(node: str, kind: str) -> str:
    if kind == "fail":
        return ("import sys\n"
                'print("stub: pretending to repurpose")\n'
                'print("FATAL: stub failure", file=sys.stderr)\n'
                "sys.exit(3)")
    lines = {
        "generate": ['print("IMG OK purpose=x-tweets id=deadbee1 slug=stub bytes=9999 out=stub.png")',
                     'print("PROGRESS 100%")',
                     'print("GEN DONE ok=1 skip=0 fail=0")',
                     'print("STAGE-DONE generate (fails=0)")'],
        "verify": ['print("VERIFY IMG OK id=deadbee1 slug=stub dims=1024x1024 bytes=9999")',
                   'print("STAGE-DONE verify (problems=0)")'],
        "queues": ['print("  entry ADDED       : deadbee1  (x-tweets.json)")',
                   'print("QUEUE x-tweets.json added=1 skipped=0 total=1")',
                   'print("STAGE-DONE queues")'],
        "lint": ['print("persona-lint: stub clean")'],
        "finalize": ['print("REGISTERED=stub-batch (new batches.json entry)")',
                     'print("PIPELINE repurpose=done")',
                     'print("STAGE-DONE finalize")'],
    }[node]
    return "\n".join(lines)


def _cmd_for(state: RepurposeState, node: str, real_cmd):
    if state.get("stub"):
        return [sys.executable, "-c", _stub_script(node, state["stub"])]
    return real_cmd


def _lane3_cmd(state: RepurposeState, stage: str):
    args = [sys.executable, "-u", str(LANE3), "--plan", state["plan_path"],
            "--stage", stage]
    if state.get("data_dir"):
        args += ["--data-dir", state["data_dir"]]
    if state.get("images_base"):
        args += ["--images-base", state["images_base"]]
    if state.get("registry"):
        args += ["--registry", state["registry"]]
    if state.get("registry_root"):
        args += ["--registry-root", state["registry_root"]]
    if state.get("fake_gen"):
        args += ["--fake-gen"]
    return args


def _route(next_name):
    def route(state):
        return "halt" if state.get("status") == "failed" else next_name
    return route


# ── nodes ────────────────────────────────────────────────────────────────────

def generate(state: RepurposeState) -> RepurposeState:
    """Generate every plan image via the ported Python browser stack (gen_images.py,
    pool-managed chats, reload-capture), holding the chatgpt stage lock."""
    cmd = _cmd_for(state, "generate", _lane3_cmd(state, "generate"))
    rc, output = _run_streaming(cmd, lane=6, node="generate",
                                stub=state.get("stub", ""))
    imgs = [{"action": m.group(1), "purpose": m.group(2), "id": m.group(3),
             "slug": m.group(4)}
            for m in map(IMG_RE.match, output.splitlines()) if m]
    parsed = {"ok": sum(1 for i in imgs if i["action"] == "OK"),
              "skipped": sum(1 for i in imgs if i["action"] == "SKIP"),
              "failed": sum(1 for i in imgs if i["action"] == "FAIL"),
              "images": imgs, "output_tail": output[-2000:]}
    if rc != 0:
        return _fail("generate_out", parsed, rc, output,
                     "lane3_batch.py --stage generate")
    return {"generate_out": parsed, "status": "running"}


def verify_images(state: RepurposeState) -> RepurposeState:
    """Disk-truth image verification via the ONE shared implementation
    (lane3_batch --stage verify: exists, >=5 KB, PIL dims per purpose, byte-dup)."""
    cmd = _cmd_for(state, "verify", _lane3_cmd(state, "verify"))
    rc, output = _run_streaming(cmd, lane=6, node="verify_images",
                                stub=state.get("stub", ""))
    verified = [m.group(1) for m in map(VERIFY_IMG_RE.match, output.splitlines()) if m]
    if rc != 0:
        return _fail("generate_out",
                     {**state.get("generate_out", {}), "verified": len(verified)},
                     rc, output, "lane3_batch.py --stage verify")
    want = len(state.get("expected_images", []))
    if not state.get("stub") and len(verified) != want:
        return {"status": "failed",
                "error": f"verify_images: {len(verified)} images verified != "
                         f"{want} planned"}
    return {"generate_out": {**state.get("generate_out", {}),
                             "verified": len(verified)},
            "status": "running"}


def queues(state: RepurposeState) -> RepurposeState:
    """Append every plan entry to its queue file (queue_writer: idempotent,
    indent-preserving, emoji-safe; existing entries never touched)."""
    cmd = _cmd_for(state, "queues", _lane3_cmd(state, "queues"))
    rc, output = _run_streaming(cmd, lane=6, node="queues", stub=state.get("stub", ""))
    entries = [{"action": m.group(1), "key": m.group(2)}
               for m in map(ENTRY_RE.match, output.splitlines()) if m]
    parsed = {"entries": entries,
              "added": sum(1 for e in entries if e["action"] == "ADDED"),
              "skipped": sum(1 for e in entries if e["action"] != "ADDED"),
              "output_tail": output[-2000:]}
    if rc != 0:
        return _fail("queues_out", parsed, rc, output, "lane3_batch.py --stage queues")
    return {"queues_out": parsed, "status": "running"}


def verify_queues(state: RepurposeState) -> RepurposeState:
    """Trust the disk: every planned entry is IN its queue file at status pending,
    its copy is em/en-dash free, its image files exist where this run wrote them,
    thread lengths hold."""
    if state.get("stub"):
        return {"queues_out": {**state.get("queues_out", {}),
                               "verified": "(stub - skipped)"},
                "status": "running"}
    data_dir = Path(state["data_dir"])
    images_base = Path(state["images_base"])

    def img_file_ok(rel_path: str) -> bool:
        # entries carry the PROD-relative path by design; the file this run wrote
        # lives under images_base (identical in prod, redirected in sandbox)
        name = Path(rel_path).name
        sub = Path(rel_path).parent.name
        return (images_base / sub / name).is_file()

    for plan_key, keys in (state.get("expected_entries") or {}).items():
        if not keys:
            continue
        fname, listkey, lookup = QUEUES[plan_key]
        data = _read_json(data_dir / fname, None)
        if not isinstance(data, dict) or not isinstance(data.get(listkey), list):
            return {"status": "failed",
                    "error": f"{fname}: unreadable or missing {listkey!r} array"}
        by_key = {e.get(lookup): e for e in data[listkey] if isinstance(e, dict)}
        for key in keys:
            e = by_key.get(key)
            if e is None:
                return {"status": "failed",
                        "error": f"{fname}: planned entry {key!r} NOT in the queue"}
            if e.get("status") != "pending":
                return {"status": "failed",
                        "error": f"{fname}: {key}: status {e.get('status')!r} != "
                                 "'pending'"}
            blob = json.dumps(e, ensure_ascii=False)
            if "—" in blob or "–" in blob:
                return {"status": "failed",
                        "error": f"{fname}: {key}: em/en dash in the new entry"}
            if plan_key in ("x_tweets", "ig_single"):
                if not e.get("image_path") or not img_file_ok(e["image_path"]):
                    return {"status": "failed",
                            "error": f"{fname}: {key}: image file missing "
                                     f"({e.get('image_path')})"}
            for img in e.get("images", []) or []:
                if not img.get("image_path") or not img_file_ok(img["image_path"]):
                    return {"status": "failed",
                            "error": f"{fname}: {key}: carousel image missing "
                                     f"({img.get('image_path')})"}
            if plan_key == "x_threads" and not 5 <= len(e.get("tweets", [])) <= 8:
                return {"status": "failed",
                        "error": f"{fname}: {key}: {len(e.get('tweets', []))} tweets "
                                 "(threads are 5-8)"}
    return {"queues_out": {**state.get("queues_out", {}), "verified": True},
            "status": "running"}


def lint(state: RepurposeState) -> RepurposeState:
    """Persona gate over every queue file this run touched (persona-lint.py --file;
    exit 1 = violations, the run halts with them in the tail)."""
    if state.get("stub"):
        cmd = _cmd_for(state, "lint", None)
        rc, output = _run_streaming(cmd, lane=6, node="lint", stub=state["stub"])
        if rc != 0:
            return _fail("lint_out", {"output_tail": output[-2000:]}, rc, output,
                         "persona-lint (stub)")
        return {"lint_out": {"clean": True}, "status": "running"}
    data_dir = Path(state["data_dir"])
    touched = [QUEUES[k][0] for k, keys in
               (state.get("expected_entries") or {}).items() if keys]
    tails = []
    for fname in touched:
        rc, output = _run_streaming(
            [sys.executable, "-u", str(PERSONA_LINT), "--file",
             str(data_dir / fname)],
            lane=6, node=f"lint:{fname}", stub="")
        tails.append(output[-500:])
        if rc != 0:
            return _fail("lint_out", {"file": fname, "output_tail": output[-2000:]},
                         rc, output,
                         f"persona-lint.py --file {fname} (violations — fix, re-run)")
    return {"lint_out": {"clean": True, "files": touched,
                         "output_tail": "\n".join(tails)[-2000:]},
            "status": "running"}


def finalize(state: RepurposeState) -> RepurposeState:
    """batches.json upsert: pipelines.repurpose = done (creates the entry when Lane 3
    runs first for a batch)."""
    cmd = _cmd_for(state, "finalize", _lane3_cmd(state, "finalize"))
    rc, output = _run_streaming(cmd, lane=6, node="finalize",
                                stub=state.get("stub", ""))
    reg = next((m.group(1) for m in map(REGISTERED_RE.match, output.splitlines())
                if m), None)
    parsed = {"registered": reg, "output_tail": output[-2000:]}
    if rc != 0:
        return _fail("finalize_out", parsed, rc, output,
                     "lane3_batch.py --stage finalize")
    return {"finalize_out": parsed, "status": "running"}


def verify_finalize(state: RepurposeState) -> RepurposeState:
    """batches.json really says repurpose=done; assemble the run summary."""
    if state.get("stub"):
        return {"repurpose": {"batch": state.get("batch"), "stub": True,
                              "images_ok": state.get("generate_out", {}).get("ok", 0)},
                "status": "done"}
    reg = _read_json(Path(state["registry_root"]) / "batches.json", None)
    if not isinstance(reg, dict) or not isinstance(reg.get("batches"), list):
        return {"status": "failed", "error": "batches.json unreadable after finalize"}
    entry = next((b for b in reg["batches"] if b.get("batch") == state["batch"]), None)
    if entry is None or (entry.get("pipelines") or {}).get("repurpose") != "done":
        return {"status": "failed",
                "error": f"batches.json: {state['batch']} pipelines.repurpose is not "
                         "'done' after finalize"}
    gen = state.get("generate_out", {})
    q = state.get("queues_out", {})
    per_queue = {}
    for plan_key, keys in (state.get("expected_entries") or {}).items():
        if keys:
            data = _read_json(Path(state["data_dir"]) / QUEUES[plan_key][0], {})
            per_queue[QUEUES[plan_key][0]] = {
                "planned": len(keys),
                "queue_total": len(data.get(QUEUES[plan_key][1], []))
                if isinstance(data, dict) else None}
    summary = {
        "batch": state.get("batch"),
        "sandbox": bool(state.get("test_sandbox")),
        "fake_gen": bool(state.get("fake_gen")),
        "date": state.get("run_date"),
        "images": {"planned": len(state.get("expected_images", [])),
                   "generated": gen.get("ok"), "skipped": gen.get("skipped"),
                   "verified": gen.get("verified")},
        "entries_added": q.get("added"), "entries_skipped": q.get("skipped"),
        "queues": per_queue,
        "lint": "clean",
        "registered": state.get("finalize_out", {}).get("registered"),
    }
    return {"repurpose": summary, "status": "done"}


def build_repurpose_graph(checkpointer=None):
    g = StateGraph(RepurposeState)
    for name, fn in (("generate", generate), ("verify_images", verify_images),
                     ("queues", queues), ("verify_queues", verify_queues),
                     ("lint", lint), ("finalize", finalize),
                     ("verify_finalize", verify_finalize)):
        g.add_node(name, fn)                 # default retry policy = none. Keep it.
    g.add_edge(START, "generate")
    order = ["generate", "verify_images", "queues", "verify_queues", "lint",
             "finalize", "verify_finalize"]
    for a, b in zip(order, order[1:]):
        g.add_conditional_edges(a, _route(b), {b: b, "halt": END})
    g.add_edge("verify_finalize", END)
    return g.compile(checkpointer=checkpointer)
