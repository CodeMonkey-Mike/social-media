#!/usr/bin/env python
"""
lint_comp_imports.py — MECHANICAL gate: a longform-edited composition depends ONLY on shared Remotion
infrastructure and its own files, never on another project's React files (Mike, 2026-09-28: "make sure we are
not relying on any remotion react files from any of the previous longform edited projects"; project folders
and their comps are recycled after publish, so a cross-project import is a time bomb AND a copy-drift risk).

  python video-creation/longform-edited/skills/comp-build/lint_comp_imports.py <comp.tsx>

Walks every relative import starting at <comp.tsx>. ALLOWED targets: package imports (react, remotion,
@remotion/*, ...), `./transitions/*` and `./captions/*` (the shared engines and caption infra under
remotion/src/), and the comp's OWN files (same PascalCase prefix as the comp: `<Project>*.ts[x]`).
FAILS on any relative import outside that set (e.g. `./Kaspa40Charts`, `./EthereumRwa`, `./SmkFull`).
Exit 0 = PASS · 1 = FAIL · 2 = usage. Machine line: COMP-IMPORTS-LINT PASS|FAIL files=N fails=N
"""
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
IMPORT_RE = re.compile(r"""(?:import|export)\s+(?:[^'";]*?\s+from\s+)?['"]([^'"]+)['"]|require\(\s*['"]([^'"]+)['"]\s*\)""")
SHARED_DIRS = ("transitions", "captions")


def resolve(base: Path, spec: str):
    p = (base.parent / spec).resolve()
    for cand in (p, p.with_suffix(".tsx"), p.with_suffix(".ts"), p / "index.tsx", p / "index.ts"):
        if cand.is_file():
            return cand
    return p


def main():
    if len(sys.argv) < 2:
        print("usage: lint_comp_imports.py <comp.tsx>", file=sys.stderr)
        sys.exit(2)
    comp = Path(sys.argv[1]).resolve()
    if not comp.is_file():
        print(f"FATAL: {comp} missing", file=sys.stderr)
        sys.exit(2)
    src_root = comp.parent
    m = re.match(r"^([A-Z][A-Za-z0-9]*?)(?:Captions|Chart[A-Za-z0-9]*|Charts|Vertical|Short)?\.tsx$", comp.name)
    prefix = m.group(1) if m else comp.stem
    fails, seen, queue = [], set(), [comp]
    while queue:
        f = queue.pop()
        if f in seen:
            continue
        seen.add(f)
        text = f.read_text(encoding="utf-8", errors="replace")
        for a, b in IMPORT_RE.findall(text):
            spec = a or b
            if not spec.startswith("."):
                continue  # a package
            target = resolve(f, spec)
            try:
                rel = target.relative_to(src_root)
            except ValueError:
                fails.append(f"{f.name}: imports outside remotion/src: {spec}")
                continue
            top = rel.parts[0]
            # own file = same PascalCase prefix, or (older camelCase naming) a shared leading project token of >= 6 chars
            a_s, b_s = comp.stem.lower(), rel.stem.lower()
            common = 0
            while common < min(len(a_s), len(b_s)) and a_s[common] == b_s[common]:
                common += 1
            own = len(rel.parts) == 1 and (rel.stem.startswith(prefix) or common >= 6)
            shared = top in SHARED_DIRS
            if not (own or shared):
                fails.append(f"{f.name}: imports another project's file `{spec}` -> {rel.as_posix()} (only ./transitions/*, ./captions/* and {prefix}* are allowed)")
                continue
            if target.is_file() and own:
                queue.append(target)
    print(f"\nlint_comp_imports — {comp.name} (own prefix `{prefix}`, {len(seen)} file(s) walked)\n{'-' * 64}")
    for x in fails:
        print(f"  FAIL  {x}")
    print("-" * 64)
    print(f"COMP-IMPORTS-LINT {'FAIL' if fails else 'PASS'} files={len(seen)} fails={len(fails)}")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
