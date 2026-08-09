# lane3_batch.py — canonical Lane 3 stage runner (Wave 6, 2026-08-09).
# The repurpose graph (graph/repurpose_graph.py) wraps THESE stages as nodes; hand runs
# use the same CLI. Consumes the per-batch lane3-plan.json seam artifact (drafting is
# judgment and stays in the Claude session; this executes the plan mechanically).
#
#   python repurpose/lane3_batch.py --plan <lane3-plan.json>
#       --stage validate|generate|verify|queues|finalize|all
#       [--data-dir DIR] [--images-base DIR] [--registry PATH]
#       [--registry-root DIR] [--fake-gen] [--no-lock]
#
# Stages:
#   validate  fail-fast plan validation (queue_writer.validate_lane3_plan — the same
#             one-source-of-truth function run.py calls before building the graph)
#   generate  ChatGPT images via gen_images.py, grouped by purpose, SEQUENTIAL, holding
#             the `chatgpt` stage lock for the whole stage (shared Chrome profile —
#             two concurrent runs mis-capture each other's images). --fake-gen
#             (sandbox only) writes placeholder renders and skips the lock.
#   verify    every plan image on disk: exists, >=5 KB, PIL-opens, aspect ratio matches
#             its purpose (1:1 x/yt · 4:5 ig), no byte-dup among the new set or against
#             same-size files already in the images dirs.
#   queues    queue_writer.append_to_queues — idempotent, indent-preserving, emoji-safe
#   finalize  batches.json upsert: pipelines.repurpose = "done" (creates the batch
#             entry in the livestream-repurpose shape if the batch is Lane-3-first)
#
# Machine lines (the graph parses these): IMG OK/SKIP/FAIL · VERIFY IMG OK ·
# entry ADDED/SKIP · QUEUE <file> added= · REGISTERED=<batch> · STAGE-DONE <stage>

import argparse
import json
import subprocess
import sys
from datetime import datetime
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO_ROOT = HERE.parent
sys.path.insert(0, str(HERE))

import queue_writer as qw  # noqa: E402
from gen_images import Generator, subdir_for  # noqa: E402

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

STAGE_LOCK = REPO_ROOT / "video-creation" / "shorts" / "_tooling" / "stage_lock.py"
RATIO = {"x-tweets": 1.0, "yt-posts": 1.0, "ig-single": 0.8, "ig-carousel": 1.0}
RATIO_TOL = 0.10


def load_plan(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        raise SystemExit(f"lane3-plan not found: {path}")
    except Exception as e:
        raise SystemExit(f"lane3-plan is not valid JSON: {e}")


# ── generate ─────────────────────────────────────────────────────────────────

def _lock(action: str, owner: str):
    r = subprocess.run([sys.executable, str(STAGE_LOCK), action, "chatgpt",
                        "--owner", owner], cwd=str(REPO_ROOT))
    if action == "acquire" and r.returncode != 0:
        raise SystemExit(f"could not acquire the chatgpt stage lock (rc {r.returncode})")


def stage_generate(plan, args) -> int:
    images = plan.get("images") or []
    if not images:
        print("no images in plan — nothing to generate")
        print("STAGE-DONE generate")
        return 0
    # ONE ITEM PER INVOCATION (SKILL.md, 2026-07-14 cross-assignment regression):
    # consecutive prompts into one chat with an outstanding generation can bind a late
    # render to the wrong filename. The blessed early-crash runner spawned every item
    # as its own single-item invocation; this reproduces that exactly (a fresh browser
    # per item; the pool still reuses one chat per purpose via the registry). Within a
    # purpose, no-ref items run FIRST and reference-attached items LAST — an attached
    # ref CONTAMINATES the chat's sibling generations (measured 2026-08-07).
    by_purpose = {}
    for im in images:
        by_purpose.setdefault(im["purpose"], []).append(im)
    ordered = []
    for purpose, items in by_purpose.items():
        ordered += [i for i in items if not i.get("ref")]
        ordered += [i for i in items if i.get("ref")]

    owner = f"lane3-{plan['batch']}"
    locked = False
    fails = 0
    try:
        if not (args.fake_gen or args.no_lock):
            print(f"acquiring chatgpt stage lock (owner {owner}) — builders may hold "
                  "it; this blocks until free...")
            _lock("acquire", owner)
            locked = True
        for k, item in enumerate(ordered):
            print(f"\n── item {k + 1}/{len(ordered)}: {item['purpose']} "
                  f"{item['image_id']} {item['slug']}"
                  f"{' [+ref]' if item.get('ref') else ''} ──")
            g = Generator(item["purpose"], images_base=args.images_base,
                          registry=args.registry, batch=plan["batch"],
                          fake=args.fake_gen)
            res = g.run([item])
            fails += res["fail"]
            print(f"PROGRESS {int((k + 1) * 100 / len(ordered))}% "
                  f"(batch item {k + 1}/{len(ordered)})")
    finally:
        if locked:
            _lock("release", owner)
    print(f"STAGE-DONE generate (fails={fails})")
    return 1 if fails else 0


# ── verify ───────────────────────────────────────────────────────────────────

def verify_images(plan, images_base=None) -> list:
    """Return a list of problem strings (empty = clean). Shared with the graph's
    verify node via lane3_batch --stage verify (rc 1 on any problem)."""
    from PIL import Image
    base = Path(images_base) if images_base else qw.IMAGES_BASE_DEFAULT
    problems = []
    new_paths = []
    for im in plan.get("images") or []:
        p = base / subdir_for(im["purpose"]) / \
            f"{im['purpose']}-{im['image_id']}-{im['slug']}.png"
        if not p.is_file():
            problems.append(f"{im['image_id']} {im['slug']}: MISSING {p}")
            continue
        size = p.stat().st_size
        if size < 5000:
            problems.append(f"{im['image_id']} {im['slug']}: only {size} bytes")
            continue
        try:
            with Image.open(p) as img:
                w, h = img.size
        except Exception as e:
            problems.append(f"{im['image_id']} {im['slug']}: unreadable ({e})")
            continue
        want = RATIO.get(im["purpose"], 1.0)
        if abs((w / h) - want) > RATIO_TOL:
            problems.append(f"{im['image_id']} {im['slug']}: aspect {w}x{h} "
                            f"(={w / h:.2f}) != {want} ±{RATIO_TOL} "
                            f"for {im['purpose']}")
            continue
        new_paths.append((im, p, size))
        print(f"VERIFY IMG OK id={im['image_id']} slug={im['slug']} "
              f"dims={w}x{h} bytes={size}")

    # byte-dup: among the new set, and vs same-size pre-existing files (every image
    # is unique — a dup means a mis-capture shipped).
    by_size = {}
    for im, p, size in new_paths:
        by_size.setdefault(size, []).append((im, p))
    new_set = {p for _, p, _ in new_paths}
    for size, group in by_size.items():
        blobs = [(im, p, p.read_bytes()) for im, p in group]
        for i in range(len(blobs)):
            for j in range(i + 1, len(blobs)):
                if blobs[i][2] == blobs[j][2]:
                    problems.append(f"byte-dup: {blobs[i][1].name} == {blobs[j][1].name}")
        dirs = {p.parent for _, p in group}
        for d in dirs:
            for f in d.glob("*.png"):
                if f in new_set or f.stat().st_size != size:
                    continue
                fb = f.read_bytes()
                for im, p, blob in blobs:
                    if blob == fb:
                        problems.append(f"byte-dup vs existing: {p.name} == {f.name}")
    return problems


def stage_verify(plan, args) -> int:
    problems = verify_images(plan, args.images_base)
    for pr in problems:
        print(f"FATAL verify: {pr}", file=sys.stderr)
    print(f"STAGE-DONE verify (problems={len(problems)})")
    return 1 if problems else 0


# ── queues ───────────────────────────────────────────────────────────────────

def stage_queues(plan, args) -> int:
    qw.append_to_queues(plan, data_dir=args.data_dir)
    print("STAGE-DONE queues")
    return 0


# ── finalize (batches.json) ──────────────────────────────────────────────────

def stage_finalize(plan, args) -> int:
    root = Path(args.registry_root) if args.registry_root else REPO_ROOT
    reg_path = root / "batches.json"
    reg = qw.load_queue(reg_path, "batches") if reg_path.is_file() else \
        ({"batches": []}, 1)
    data, indent = reg
    batch = plan["batch"]
    entry = next((b for b in data["batches"] if b.get("batch") == batch), None)
    if entry is None:
        media = f"video-creation/livestream-repurpose/media/{batch}/"
        tplain = plan["source_transcript"]
        tdir = str(Path(tplain).parent).replace("\\", "/")
        if not tdir.startswith("video-creation/"):
            tdir = f"video-creation/{tdir}"
        tplain_full = tplain if tplain.startswith("video-creation/") \
            else f"video-creation/{tplain}"
        title = None
        meta_p = root / "video-creation" / "livestream-repurpose" / "media" / batch \
            / "longform-meta.json"
        if meta_p.is_file():
            try:
                title = json.loads(meta_p.read_text(encoding="utf-8")).get("title")
            except Exception:
                pass
        entry = {
            "batch": batch, "track": "livestream-repurpose", "status": "active",
            "date": plan["date"], "livestream_title": batch, "title": title,
            "shorts_source": f"{media}{batch} LOW BPS VERTICAL.mp4",
            "source_media": media, "transcript_plain": tplain_full,
            "transcripts_dir": tdir + "/",
            "dashboard": None,
            "directories": [media.rstrip("/"), tdir],
            "pipelines": {"shorts": "pending", "repurpose": "done",
                          "longform": "done"},
            "note": f"Registered by lane3_batch.py finalize (Wave 6 repurpose graph) "
                    f"on {datetime.now():%Y-%m-%d}.",
        }
        data["batches"].append(entry)
        print(f"REGISTERED={batch} (new batches.json entry)")
    else:
        entry.setdefault("pipelines", {})
        entry["pipelines"]["repurpose"] = "done"
        print(f"REGISTERED={batch} (existing entry)")
    print("PIPELINE repurpose=done")
    qw.save_queue(reg_path, data, indent)
    print("STAGE-DONE finalize")
    return 0


# ── main ─────────────────────────────────────────────────────────────────────

def main():
    ap = argparse.ArgumentParser(description="Lane 3 stage runner (Wave 6).")
    ap.add_argument("--plan", required=True)
    ap.add_argument("--stage", required=True,
                    choices=["validate", "generate", "verify", "queues", "finalize",
                             "all"])
    ap.add_argument("--data-dir", default=None)
    ap.add_argument("--images-base", default=None)
    ap.add_argument("--registry", default=None,
                    help="chat registry override (sandbox)")
    ap.add_argument("--registry-root", default=None,
                    help="dir holding batches.json (sandbox)")
    ap.add_argument("--fake-gen", action="store_true",
                    help="SANDBOX ONLY: placeholder renders, no browser, no lock")
    ap.add_argument("--no-lock", action="store_true")
    args = ap.parse_args()

    plan = load_plan(Path(args.plan))
    # Validation runs FIRST for every stage (one source of truth; the graph's runner
    # already validated, but a hand run must not skip it).
    qw.validate_lane3_plan(
        plan,
        data_dir=args.data_dir,
        images_base=args.images_base if args.stage != "validate" else args.images_base)
    if args.stage == "validate":
        print(f"lane3-plan VALID: {len(plan.get('images') or [])} images, "
              + ", ".join(f"{k}={len(plan.get(k) or [])}" for k in qw.QUEUE_FILES))
        print("STAGE-DONE validate")
        return 0

    stages = (["generate", "verify", "queues", "finalize"] if args.stage == "all"
              else [args.stage])
    for st in stages:
        rc = {"generate": stage_generate, "verify": stage_verify,
              "queues": stage_queues, "finalize": stage_finalize}[st](plan, args)
        if rc:
            return rc
    return 0


if __name__ == "__main__":
    sys.exit(main())
