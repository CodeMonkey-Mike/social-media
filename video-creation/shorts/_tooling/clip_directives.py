"""clip_directives.py — SCOPED build-directive reader for a shorts batch.

WHY THIS EXISTS (2026-08-10, batch `tutorial`). Mike gave a Phase 7 visual directive that was
meant for CLIP 1 ONLY ("i only do not want full screen broll, nor content zone broll. you can do
captions, sfx, and any overlaying graphics or images with background transparency"). It was written
into `clip-plan.json` as free prose under the heading "PHASE 7 VISUAL DIRECTIVE, WHOLE BATCH", and
the sentence itself carries no scope marker, so nothing downstream could tell it had ever been about
one clip. The resume contract then said the directive "rides VERBATIM in every builder contract",
and all 8 clips were built with zero full-screen and zero content-zone b-roll. Eight builders each
reported the coverage requirement unmet, and eight prose flags blocked nothing.

The previous batch (`early-crash`) had done it correctly: the same class of directive was scoped to
clips 1 and 6, which shipped at 11.3% / 17.1% coverage while its siblings shipped at ~30%. So
per-clip scoping is the norm; this batch lost it in the note-taking.

THE FIX, and it is deliberately at DISPATCH time because that is where the error happened:
a directive is no longer prose the orchestrator eyeballs. It is a record with an explicit
`applies_to`, and this module is the ONLY sanctioned way to ask "what applies to clip N?".
An unscoped directive is a HARD ERROR, so it can never again default to the whole batch.

Directive record shape (in `shorts/<batch>/clip-plan.json` -> `four_b_verdicts.build_directives`):

    {
      "id": "phase7-visual",                 # stable slug, referenced by gates
      "applies_to": [1],                     # REQUIRED: list of clip numbers, or the string "all"
      "authority": "Mike, 2026-08-09",        # who said it, so a future session can weigh it
      "directive": "…verbatim words…",
      "coverage_exempt": true                 # optional: this directive waives the b-roll
                                              # coverage requirement for the clips it applies to
    }

A bare string is still ACCEPTED FOR READING (old batches are full of them) but is reported as
UNSCOPED, and `--check` exits non-zero on it. Nothing silently inherits a batch-wide scope.

Usage:
  python clip_directives.py --batch tutorial --check
  python clip_directives.py --batch tutorial --clip 1
  python clip_directives.py --batch tutorial --clip 3 --json
  python clip_directives.py --plan <path/to/clip-plan.json> --clip 6
"""
import argparse
import json
import os
import sys

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", ".."))


def plan_path_for(batch):
    return os.path.join(REPO_ROOT, "video-creation", "shorts", batch, "clip-plan.json")


def load_directives(plan_path):
    """Return (directives, clip_numbers). Directives keep their on-disk order."""
    if not os.path.isfile(plan_path):
        sys.exit(f"clip-plan.json not found: {plan_path}")
    with open(plan_path, encoding="utf-8") as f:
        plan = json.load(f)
    # Older batches store four_b_verdicts as a free-text STRING (early-crash does), and some have
    # no verdict block at all. Either way there are no scoped directives to hand out, and that is
    # NOT an error: it means nothing may be inherited, which is the safe direction.
    fb = plan.get("four_b_verdicts")
    if not isinstance(fb, dict):
        fb = {}
    raw = fb.get("build_directives") or []
    clips = [c.get("clip_id") for c in plan.get("clips", []) if c.get("clip_id") is not None]
    out = []
    for i, d in enumerate(raw):
        if isinstance(d, str):
            out.append({"id": f"unscoped-{i + 1}", "applies_to": None,
                        "authority": None, "directive": d, "coverage_exempt": None,
                        "_unscoped": True})
        elif isinstance(d, dict):
            rec = dict(d)
            rec.setdefault("id", f"directive-{i + 1}")
            rec.setdefault("authority", None)
            rec.setdefault("coverage_exempt", None)
            rec["_unscoped"] = "applies_to" not in d or d.get("applies_to") in (None, "")
            out.append(rec)
        else:
            sys.exit(f"build_directives[{i}] is neither a string nor an object: {type(d).__name__}")
    return out, clips


def validate_directives(plan_path):
    """Front-door handoff validator (imported by run.py `finish`, the same pattern as
    finish_batch.validate_filler_plan and queue_writer.validate_lane3_plan): return
    this plan's UNSCOPED directives. Empty list = every directive is explicitly
    scoped, so the Phase 7 handoff can be composed from records. The `finish`
    segment is the last machine-owned step before Phase 7 dispatch, which makes it
    the right door to refuse at — the 2026-08-10 scoping failure survived to eight
    staged shorts precisely because no such door existed."""
    directives, _clips = load_directives(plan_path)
    return [d for d in directives if d["_unscoped"]]


def applies(directive, clip):
    """Does this directive apply to clip number `clip`? Unscoped -> False (never inherited)."""
    scope = directive.get("applies_to")
    if scope in (None, ""):
        return False
    if isinstance(scope, str):
        if scope.strip().lower() == "all":
            return True
        sys.exit(f"directive {directive.get('id')!r}: applies_to must be a list of clip "
                 f"numbers or the string \"all\", got {scope!r}")
    if isinstance(scope, (list, tuple)):
        return int(clip) in [int(x) for x in scope]
    sys.exit(f"directive {directive.get('id')!r}: bad applies_to type {type(scope).__name__}")


def coverage_exempt_for(directives, clip):
    """Return the directive that waives the coverage requirement for this clip, or None."""
    for d in directives:
        if d.get("coverage_exempt") and applies(d, clip):
            return d
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--batch")
    ap.add_argument("--plan")
    ap.add_argument("--clip", type=int)
    ap.add_argument("--check", action="store_true",
                    help="validate that every directive carries an explicit applies_to; "
                         "exit 1 if any is unscoped")
    ap.add_argument("--json", action="store_true")
    a = ap.parse_args()

    if not a.plan and not a.batch:
        sys.exit("pass --batch <name> or --plan <path>")
    plan_path = a.plan or plan_path_for(a.batch)
    directives, clips = load_directives(plan_path)

    if a.check:
        unscoped = [d for d in directives if d["_unscoped"]]
        print(f"clip-plan: {plan_path}")
        print(f"  clips: {clips or 'none listed'}")
        print(f"  directives: {len(directives)}  ({len(unscoped)} UNSCOPED)")
        for d in directives:
            scope = "UNSCOPED" if d["_unscoped"] else (
                "all clips" if str(d["applies_to"]).lower() == "all"
                else f"clips {d['applies_to']}")
            flag = "  <-- FAIL" if d["_unscoped"] else ""
            extra = " [coverage_exempt]" if d.get("coverage_exempt") else ""
            print(f"    - {d['id']}: {scope}{extra}{flag}")
        if unscoped:
            print()
            print("FAIL: a directive with no `applies_to` cannot be dispatched. An unscoped "
                  "directive is exactly how batch `tutorial` applied a clip-1-only instruction "
                  "to all 8 clips. Add an explicit applies_to (list of clip numbers, or \"all\").")
            sys.exit(1)
        print("PASS: every directive is explicitly scoped.")
        return

    if a.clip is None:
        sys.exit("pass --clip N (which clip's contract are you composing?) or --check")
    if clips and a.clip not in clips:
        sys.exit(f"clip {a.clip} is not in this batch (clips: {clips})")

    mine = [d for d in directives if applies(d, a.clip)]
    unscoped = [d for d in directives if d["_unscoped"]]

    if a.json:
        print(json.dumps({"batch": a.batch, "clip": a.clip,
                          "directives": [{k: v for k, v in d.items() if not k.startswith("_")}
                                         for d in mine],
                          "unscoped_ignored": [d["id"] for d in unscoped]},
                         indent=2, ensure_ascii=False))
        return

    print(f"build directives that apply to clip {a.clip}  ({len(mine)} of {len(directives)}):")
    if not mine:
        print("  (none)")
    for d in mine:
        auth = f" [{d['authority']}]" if d.get("authority") else ""
        print(f"\n  * {d['id']}{auth}")
        print(f"    {d['directive']}")
    if unscoped:
        print(f"\n  ⚠ {len(unscoped)} UNSCOPED directive(s) were NOT applied: "
              f"{[d['id'] for d in unscoped]}")
        print("    Scope them in clip-plan.json before relying on them; this tool refuses to "
              "guess a scope, which is the bug it exists to prevent.")


if __name__ == "__main__":
    main()
