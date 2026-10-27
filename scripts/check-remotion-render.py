#!/usr/bin/env python
"""check-remotion-render.py — every Remotion RENDER goes through the shared chunked renderer (Mike, 2026-10-27).

    python scripts/check-remotion-render.py        # exit 0 = clean; exit 1 lists every direct render call

The rule (video-creation/skills/chunked-render/chunked-render.md): a script never runs `npx remotion render` itself; it
calls chunked_render.render() (1-minute chunks, watchdog + retry, resume, the run-queue pause, desktop notifications), or
longform-edited/scripts/render_comp.py, which does. A direct call silently loses all of that, which is how a 94% render
was lost on 2026-10-27. Stills (`remotion still`) and bundles (`remotion bundle`) are fine.

EXEMPT (Mike's call, 2026-10-27): the livestream shorts renderer (30-60 s shorts, one render each; it still takes the
run-queue turn through the batch run that drives it) and the renderer + its test fake themselves.
Sibling of scripts/check-fable-fallback.py: run it after touching any render script.
"""
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
ROOTS = [REPO / "video-creation", REPO / "scripts"]
EXEMPT = {
    "video-creation/skills/chunked-render/chunked_render.py",
    "video-creation/skills/chunked-render/fake_remotion.py",
    "video-creation/livestream-repurpose/skills/remotion-shorts-build/scripts/render_short.py",
    "scripts/check-remotion-render.py",
}
SKIP_DIRS = {"node_modules", ".git", "__pycache__", "_previews", "media", "build", "out", "dist"}
# a list-form invocation ("remotion", "render") or a quoted shell string that starts `npx remotion render`
PATTERNS = [re.compile(r"""["']remotion["']\s*,\s*["']render["']"""),
            re.compile(r"""["']npx\s+remotion\s+render\b""")]


def main():
    hits = []
    for root in ROOTS:
        for p in root.rglob("*"):
            if p.suffix not in (".py", ".js", ".mjs", ".ts", ".cmd", ".bat", ".ps1") or not p.is_file():
                continue
            if any(part in SKIP_DIRS for part in p.relative_to(REPO).parts):
                continue
            rel = p.relative_to(REPO).as_posix()
            if rel in EXEMPT:
                continue
            for n, line in enumerate(p.read_text(encoding="utf-8", errors="replace").splitlines(), 1):
                code = line.split("#", 1)[0] if p.suffix == ".py" else line.split("//", 1)[0]
                if any(rx.search(code) for rx in PATTERNS):
                    hits.append(f"{rel}:{n}: {line.strip()[:140]}")
    for h in hits:
        print(f"  DIRECT RENDER  {h}")
    print(f"REMOTION-RENDER-CHECK {'FAIL' if hits else 'PASS'} direct_calls={len(hits)}")
    sys.exit(1 if hits else 0)


if __name__ == "__main__":
    main()
