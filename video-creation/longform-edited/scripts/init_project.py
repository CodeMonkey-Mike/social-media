# init_project.py — create a longform-edited project folder to the FIXED layout
# (comp-build.md section 13a + section 10) and seed PROJECT-LOG.md with the concept brief.
# The first node of the longform graph (graph/longform_graph.py); also fine by hand.
#
# Why a script: claudeisnaughty #1 (spine files loose in the root with ad-hoc names) and
# #2 (an invented DOSSIER.md) were both "the convention existed by example, not in code".
# A node that writes fixed, parameterized paths cannot drift.
#
# Usage: python video-creation/longform-edited/scripts/init_project.py --project <name|path>
#            [--brief "..."] [--constraints "..."] [--title "..."]
# Idempotent: never overwrites an existing PROJECT-LOG.md; a new brief is APPENDED as a
# dated entry (the log is a decision trail). Prints INIT ok ... + PROGRESS 100%.

import argparse
import sys
from datetime import date
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HERE = Path(__file__).resolve().parent
TRACK = HERE.parent
MEDIA = TRACK / "media"
ASSET_DIRS = ("img", "vid", "title-slides", "card-slides", "receipts", "charts", "diagrams",
              "slide-sources", "transitions")
DIRS = ("raw", "spine", "assets", "_previews", "_previews/qa") + tuple(f"assets/{d}" for d in ASSET_DIRS)


def project_dir(name_or_path: str) -> Path:
    p = Path(name_or_path)
    return p.resolve() if (p.is_absolute() or p.exists()) else (MEDIA / name_or_path).resolve()


def log_skeleton(name: str, brief: str, constraints: str, title: str) -> str:
    today = date.today().isoformat()
    return f"""# {name} — PROJECT-LOG

Decision trail + resume pointer for this longform-edited video. Created {today} by the longform
graph (`python video-creation/longform-edited/graph/run.py longform --project "{name}"`); the graph
records its gate approvals in `GRAPH-PROGRESS.json` next to this file.

## Concept brief (LOCKED for GATE 1 — Mike rules on it together with the screenplay)

{brief.strip() or "(no brief given yet: add it here before the research node runs)"}

## Hard constraints (Mike)

{constraints.strip() or "(none recorded)"}

## Decisions

- **{today} — created.** Working title: {title.strip() or "(TBD)"}. Folder laid out per comp-build.md
  section 13a (raw/ · spine/ · assets/ · _previews/); the brief + constraints above are the
  commission for `data-researcher` (DATA.md) and `screenplay-strategist` (SCREENPLAY.md).

## Open flags (load-bearing)

- (none yet)
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--project", required=True)
    ap.add_argument("--brief", default="")
    ap.add_argument("--constraints", default="")
    ap.add_argument("--title", default="")
    args = ap.parse_args()

    proj = project_dir(args.project)
    created = []
    for d in DIRS:
        p = proj / d
        if not p.is_dir():
            p.mkdir(parents=True, exist_ok=True)
            created.append(d)
    log = proj / "PROJECT-LOG.md"
    if not log.is_file():
        log.write_text(log_skeleton(proj.name, args.brief, args.constraints, args.title),
                       encoding="utf-8", newline="\n")
        created.append("PROJECT-LOG.md")
    elif args.brief or args.constraints:
        text = log.read_text(encoding="utf-8")
        add = ""
        if args.brief and args.brief.strip() not in text:
            add += f"\n## Concept brief (updated {date.today().isoformat()})\n\n{args.brief.strip()}\n"
        if args.constraints and args.constraints.strip() not in text:
            add += f"\n## Hard constraints (updated {date.today().isoformat()})\n\n{args.constraints.strip()}\n"
        if add:
            log.write_text(text.rstrip("\n") + "\n" + add, encoding="utf-8", newline="\n")
            created.append("PROJECT-LOG.md (brief/constraints appended)")
    print(f"PROJECT_DIR={proj}")
    print(f"INIT ok project={proj.name} created={len(created)} {created}")
    print("PROGRESS 100%")


if __name__ == "__main__":
    main()
