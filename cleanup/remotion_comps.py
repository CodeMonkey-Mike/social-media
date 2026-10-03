#!/usr/bin/env python
"""
remotion_comps.py — the cleanup tier for the LIVESTREAM-SHORTS React files in video-creation/remotion/src/
(Mike, 2026-10-03: "add that to the cleanup job so the cleanup job knows that it should check for those").

Every short the pipeline builds leaves a family of files in the flat remotion/src/ namespace: the comp
(`<Comp>.tsx`), its `constants-<batch>-<clip>.ts` and its `captions<Comp>.ts` (the earliest batches: a
shared `data*.ts`), plus an import and a <Composition> block in Root.tsx. Nothing ever removed them, so
they piled up (461 files / 227 registrations by 2026-10-03) and old comps stayed around to be copied from.

  python cleanup/remotion_comps.py [--dry-run]          (cleanup.js spawns it with the video-creation target)

WHAT COUNTS AS A SHORTS FAMILY: a composition registered in Root.tsx that renders through the shorts kit
(`component={LivestreamShort}`, or a component that imports `_kit.tsx` / `LivestreamShort.tsx`), plus the
top-level files only it uses. Everything else registered in Root.tsx (longform-edited, ai-engineering, the
transition demos) and everything those comps import is PROTECTED and never touched; so are Root.tsx,
index.ts, the kit itself and the shared subfolders (transitions/, captions/).

KEPT (the cleanup job's doctrine: an active batch is in flight):
  - owned by an ACTIVE batch: named as a clip's `composition` / `constants` in that batch's
    shorts/<batch>/progress.json, or on the `Composition:` line of one of its BROLL-PLAN.md files
    (a shorts folder that matches no batch in batches.json counts as active);
  - FRESH: any file of the family written in the last COMP_FRESH_HOURS (default 24), so the session in
    progress is never touched, even before its comps are recorded anywhere.
RECYCLED: every other shorts family; its imports and <Composition> block (with their comments) come out
of Root.tsx. Stale shorts-shaped ORPHANS that Root.tsx no longer reaches go too (constants*.ts,
captions*.ts, data*.ts, _index-*.tsx scratch roots, _gen_*.py generators, unregistered kit comps).

SAFETY (live run): Root.tsx is rewritten FIRST and type-checked (`npx tsc --noEmit`, zero errors under
src/) BEFORE any file moves; a failed check restores Root.tsx and recycles nothing. The run is skipped
while a shorts render holds the stage lock. Files go to the Recycle Bin (cleanup/lib.js), never deleted.
Exit 0 = done / nothing to do / skipped · 1 = failed.
"""
import argparse
import json
import os
import re
import subprocess
import sys
import tempfile
import time
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")
REPO = Path(__file__).resolve().parents[1]
REMOTION = REPO / "video-creation" / "remotion"
SRC = REMOTION / "src"
ROOT_TSX = SRC / "Root.tsx"
SHORTS = REPO / "video-creation" / "shorts"
KIT = {"_kit.tsx", "LivestreamShort.tsx"}      # the shorts renderer: a comp that reaches either is a livestream short
PROTECTED = {"Root.tsx", "index.ts"} | KIT
FRESH_HOURS = float(os.environ.get("COMP_FRESH_HOURS", "24"))
STALE_LOCK_MIN = 90                            # stage_lock.py's own stale threshold
ORPHAN_RE = re.compile(r"^(constants.*\.ts|captions[A-Z0-9].*\.ts|data[A-Z0-9].*\.ts|_index-.*\.tsx|_gen_.*\.py)$")
IMPORT_RE = re.compile(r"""(?:import|export)\s+(?:[^'";]*?\s+from\s+)?['"](\.{1,2}/[^'"]+)['"]|(?:require|import)\(\s*['"](\.{1,2}/[^'"]+)['"]\s*\)""")
IDENT_RE = re.compile(r"[A-Za-z_$][\w$]*")
STRING_RE = re.compile(r"'(?:\\.|[^'\\])*'|\"(?:\\.|[^\"\\])*\"|`(?:\\.|[^`\\])*`")


class Abort(Exception):
    pass


def read(p):
    with open(p, encoding="utf-8", newline="") as f:      # newline="" keeps the file's own line endings
        return f.read()


def rel(p):
    return Path(p).relative_to(REPO).as_posix()


# ── import graph ─────────────────────────────────────────────────────────────────────────────────
def resolve(frm, spec):
    """A relative import in `frm` (posix path under src/) -> the src-relative file it names, or None."""
    base = os.path.normpath(os.path.join(os.path.dirname(frm), spec)).replace("\\", "/")
    for cand in (base, base + ".tsx", base + ".ts", base + "/index.tsx", base + "/index.ts"):
        if (SRC / cand).is_file():
            return cand
    return None


def build_graph():
    graph = {}
    for p in SRC.rglob("*"):
        if p.is_file() and p.suffix in (".ts", ".tsx"):
            f = p.relative_to(SRC).as_posix()
            deps = {resolve(f, a or b) for a, b in IMPORT_RE.findall(read(p))}
            graph[f] = sorted(d for d in deps if d)
    return graph


def closure(seeds, graph):
    seen, stack = set(), list(seeds)
    while stack:
        f = stack.pop()
        if f not in seen:
            seen.add(f)
            stack.extend(graph.get(f, []))
    return seen


# ── Root.tsx ─────────────────────────────────────────────────────────────────────────────────────
def import_locals(clause):
    names, clause = [], re.sub(r"^\s*type\s+", "", clause)
    m = re.search(r"\{([^}]*)\}", clause, re.S)
    if m:
        names += [re.sub(r"^type\s+", "", x.strip()).split(" as ")[-1].strip() for x in m.group(1).split(",") if x.strip()]
        clause = clause[:m.start()] + clause[m.end():]
    for part in (x.strip() for x in clause.split(",")):
        if part.startswith("* as "):
            names.append(part[5:].strip())
        elif part:
            names.append(part.split()[-1])
    return names


def element_end(text, i):
    """End offset of the self-closing <Composition ... /> that starts at i (brace- and string-aware)."""
    depth, quote, j = 0, None, i
    while j < len(text):
        c = text[j]
        if quote:
            if c == "\\":
                j += 1
            elif c == quote:
                quote = None
        elif c in "\"'`":
            quote = c
        elif c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
        elif depth == 0 and text.startswith("/>", j):
            return j + 2
        j += 1
    raise Abort(f"Root.tsx: unterminated <Composition> at offset {i}")


def parse_root(text):
    """-> (imports, elements). Offsets are into `text`; `first` is where the unit's own comment block starts."""
    m = re.search(r"^export const RemotionRoot\b", text, re.M)
    if not m:
        raise Abort("Root.tsx: `export const RemotionRoot` not found")
    imports, pos, comment_at, lines = [], 0, None, text[:m.start()].splitlines(keepends=True)
    i = 0
    while i < len(lines):
        s = lines[i].strip()
        if s.startswith("//"):
            comment_at = pos if comment_at is None else comment_at
        elif s.startswith("import"):
            j, stmt = i, lines[i]
            while not re.search(r"""(?:from\s*)?['"][^'"]+['"]\s*;?\s*$""", stmt.strip()):
                j += 1
                if j >= len(lines):
                    raise Abort(f"Root.tsx: unterminated import at line {i + 1}")
                stmt += lines[j]
            mm = re.match(r"""\s*import\s+(?:(.*?)\s+from\s*)?['"]([^'"]+)['"]""", stmt, re.S)
            spec = mm.group(2)
            imports.append({"start": pos, "end": pos + len(stmt), "first": pos if comment_at is None else comment_at,
                            "spec": spec, "locals": import_locals(mm.group(1) or ""),
                            "file": resolve("Root.tsx", spec) if spec.startswith(".") else None})
            pos, i, comment_at = pos + len(stmt), j + 1, None
            continue
        elif s:
            raise Abort(f"Root.tsx line {i + 1}: expected an import or a comment, found `{s[:60]}`")
        else:
            comment_at = None
        pos += len(lines[i])
        i += 1

    body_open, body_close = text.find("<>", m.start()), text.rfind("</>")
    if body_open < 0 or body_close < body_open:
        raise Abort("Root.tsx: the <> ... </> fragment was not found")
    elements, i, comment_at = [], body_open + 2, None
    while i < body_close:
        if text[i].isspace():
            i += 1
        elif text.startswith("{/*", i):
            end = text.find("*/}", i)
            if end < 0:
                raise Abort(f"Root.tsx: unterminated JSX comment at offset {i}")
            comment_at = i if comment_at is None else comment_at
            i = end + 3
        elif text.startswith("<Composition", i):
            end = element_end(text, i)
            src = text[i:end]
            cid = re.search(r"""\bid\s*=\s*\{?\s*["']([^"']+)["']""", src)
            comp = re.search(r"\bcomponent\s*=\s*\{\s*([A-Za-z_$][\w$]*)\s*\}", src)
            if not cid or not comp:
                raise Abort(f"Root.tsx: a <Composition> without a literal id/component at offset {i}")
            elements.append({"start": i, "end": end, "first": i if comment_at is None else comment_at, "id": cid.group(1),
                             "component": comp.group(1), "idents": set(IDENT_RE.findall(STRING_RE.sub("''", src)))})
            i, comment_at = end, None
        else:
            raise Abort(f"Root.tsx: unexpected content in the fragment at offset {i}: `{text[i:i + 50]!r}`")
    return imports, elements


def cut(text, spans):
    """Delete spans, widened to whole lines wherever the unit sits alone on its lines; collapse blank runs."""
    for a, b in sorted(spans, reverse=True):
        ls = text.rfind("\n", 0, a) + 1
        if not text[ls:a].strip():
            a = ls
        le = text.find("\n", b)
        le = len(text) if le < 0 else le + 1
        if not text[b:le].strip():
            b = le
        text = text[:a] + text[b:]
    return re.sub(r"(\r?\n)(?:[ \t]*\r?\n){2,}", r"\1\1", text)      # Root.tsx mixes LF and CRLF: keep each run's own ending


def code_only(text):
    text = re.sub(r"\{/\*.*?\*/\}|/\*.*?\*/", "", text, flags=re.S)
    return STRING_RE.sub("''", re.sub(r"(?m)//.*$", "", text))


# ── who is in flight ─────────────────────────────────────────────────────────────────────────────
def active_ownership():
    """{name: batch label} for every comp id / file name an ACTIVE batch's working folder claims."""
    batches = json.loads(read(REPO / "batches.json"))["batches"]
    by_dir = {str((REPO / d).resolve()).lower(): b for b in batches for d in (b.get("directories") or [])}
    owned = {}

    def claim(value, label):
        name = Path(str(value).replace("\\", "/")).name
        for n in (name, name.rsplit(".", 1)[0]):
            if n:
                owned.setdefault(n, label)

    for folder in sorted(SHORTS.iterdir()) if SHORTS.is_dir() else []:
        if not folder.is_dir() or folder.name.startswith("_"):
            continue
        b = by_dir.get(str(folder.resolve()).lower())
        if b is not None and b.get("status") != "active":
            continue
        label = f"active batch {b['batch']}" if b else f"unregistered shorts folder {folder.name}"
        prog = folder / "progress.json"
        if prog.is_file():
            try:
                clips = json.loads(read(prog)).get("clips") or []
            except (ValueError, AttributeError):
                raise Abort(f"{rel(prog)} is unreadable; cannot tell which comps the batch owns")
            for c in (clips.values() if isinstance(clips, dict) else clips):
                for key in ("composition", "comp", "comp_id", "constants", "captions"):
                    if isinstance(c, dict) and isinstance(c.get(key), str):
                        claim(c[key], label)
        for plan in list(folder.glob("BROLL-PLAN*.md")) + list(folder.glob("*/BROLL-PLAN*.md")):
            lines = read(plan).splitlines()
            for n, line in enumerate(lines):
                if re.match(r"\s*(Composition|Comp)\s*:", line):
                    block = line
                    for nxt in lines[n + 1:n + 3]:                 # the line wraps: comp, constants, captions
                        if block.rstrip().endswith((").", ")")) or not nxt.strip():
                            break
                        block += " " + nxt
                    for token in re.findall(r"`([^`]+)`", block):
                        claim(token, label)
    return owned


def render_lock_holders():
    try:
        sys.path.insert(0, str(SHORTS / "_tooling"))
        import stage_lock
        return [f"{cur.get('owner')} ({(time.time() - cur.get('ts', 0)) / 60:.0f} min)" for _i, cur in stage_lock.holders("render")
                if (time.time() - cur.get("ts", 0)) / 60 <= STALE_LOCK_MIN]
    except Exception as e:                                         # no lock info is not a reason to block cleanup
        print(f"  WARNING: could not read the render stage lock ({e}); continuing.")
        return []


# ── the plan ─────────────────────────────────────────────────────────────────────────────────────
def make_plan():
    text = read(ROOT_TSX)
    graph = build_graph()
    imports, elements = parse_root(text)
    local_file = {name: imp["file"] for imp in imports for name in imp["locals"]}
    owned = active_ownership()
    now = time.time()

    def fresh(files):
        return any(now - (SRC / f).stat().st_mtime < FRESH_HOURS * 3600 for f in files if (SRC / f).is_file())

    def claimed(names):
        return next((owned[n] for n in names if n in owned), None)

    kept_files, remove = set(PROTECTED), []
    counts = {"protected": 0, "owned": 0, "fresh": 0}
    kept_notes = []
    for el in elements:
        if el["component"] not in local_file:
            raise Abort(f"Root.tsx: <Composition id=\"{el['id']}\"> uses `{el['component']}`, which is not imported")
        el["reach"] = closure({local_file[i] for i in el["idents"] if local_file.get(i)}, graph)
        el["family"] = sorted(f for f in el["reach"] if "/" not in f and f not in PROTECTED)
        if not el["reach"] & KIT:
            counts["protected"] += 1
        elif not el["family"]:
            kept_notes.append(f"{el['id']} — shorts comp with no files of its own")
        else:
            why = claimed([el["id"]] + el["family"] + [f.rsplit(".", 1)[0] for f in el["family"]])
            if why:
                counts["owned"] += 1
                kept_notes.append(f"{el['id']} — {why}")
            elif fresh(el["family"]):
                counts["fresh"] += 1
                kept_notes.append(f"{el['id']} — written in the last {FRESH_HOURS:g} h")
            else:
                remove.append(el)
                continue
        kept_files |= el["reach"]

    # orphans: top-level files Root.tsx no longer reaches
    reached = closure({"Root.tsx", "index.ts"}, graph)
    top = sorted(p.name for p in SRC.iterdir() if p.is_file())
    loose = [f for f in top if f not in reached and f not in PROTECTED]
    importers = {}
    for f, deps in graph.items():
        for d in deps:
            importers.setdefault(d, set()).add(f)
    shaped = {f for f in loose if ORPHAN_RE.match(f) or closure({f}, graph) & KIT}
    grew = True
    while grew:                                                    # a private dep of a shorts orphan is one too
        more = {f for f in loose if f not in shaped and importers.get(f) and importers[f] <= shaped}
        grew = bool(more)
        shaped |= more
    orphans, left_alone = [], sorted(f for f in loose if f not in shaped)
    for f in sorted(shaped):
        why = claimed([f, f.rsplit(".", 1)[0]])
        if why or fresh([f]):
            kept_notes.append(f"{f} — orphan, {why or f'written in the last {FRESH_HOURS:g} h'}")
            kept_files |= closure({f}, graph)
        else:
            orphans.append(f)

    recycle = (set().union(*(el["family"] for el in remove)) | set(orphans)) - kept_files
    for f in sorted(set(graph) - recycle - {"Root.tsx"}):          # nothing that stays may import something that goes
        bad = [d for d in graph[f] if d in recycle]
        if bad:
            raise Abort(f"{f} stays but imports {bad}, which would be recycled")

    removed_ids = {el["id"] for el in remove}
    gone_imports = [imp for imp in imports if imp["file"] in recycle]
    new_text = cut(text, [(u["first"], u["end"]) for u in gone_imports + remove])
    imports2, elements2 = parse_root(new_text)                     # the rewritten file must still parse...
    code = code_only(new_text)
    dangling = sorted(n for imp in gone_imports for n in imp["locals"] if re.search(rf"(?<![\w$]){re.escape(n)}(?![\w$])", code))
    if dangling:                                                   # ...and reference nothing it stopped importing
        raise Abort(f"Root.tsx rewrite would leave dangling identifiers: {dangling[:8]}")
    if [e["id"] for e in elements2] != [e["id"] for e in elements if e["id"] not in removed_ids]:
        raise Abort("Root.tsx rewrite changed the kept compositions")
    if any(imp["file"] in recycle or (imp["spec"].startswith(".") and not imp["file"]) for imp in imports2):
        raise Abort("Root.tsx rewrite kept an import of a recycled or missing file")
    return {"text": text, "new_text": new_text, "elements": elements, "remove": remove, "orphans": orphans, "recycle": sorted(recycle),
            "counts": counts, "kept_notes": kept_notes, "left_alone": left_alone, "gone_imports": gone_imports}


# ── live steps ───────────────────────────────────────────────────────────────────────────────────
def tsc_src_errors():
    r = subprocess.run("npx tsc --noEmit -p .", cwd=REMOTION, shell=True, capture_output=True, text=True,
                       encoding="utf-8", errors="replace", timeout=900)
    out = (r.stdout or "") + (r.stderr or "")
    if r.returncode != 0 and "error TS" not in out:
        raise Abort(f"tsc did not run: {out.strip()[-300:]}")
    return [line for line in out.splitlines() if "error TS" in line and line.replace("\\", "/").startswith("src/")]


def recycle_paths(paths):
    with tempfile.NamedTemporaryFile("w", suffix=".json", delete=False, encoding="utf-8") as f:
        json.dump([str(p) for p in paths], f)
    js = "const l=require('./cleanup/lib.js');process.exit(l.recyclePaths(JSON.parse(require('fs').readFileSync(process.argv[1],'utf8')))?0:1)"
    try:
        ok = subprocess.run(["node", "-e", js, f.name], cwd=REPO).returncode == 0
    finally:
        os.unlink(f.name)
    return ok and not any(Path(p).exists() for p in paths)


def kb(files):
    return sum((SRC / f).stat().st_size for f in files if (SRC / f).is_file()) / 1024


def main():
    ap = argparse.ArgumentParser(description="Recycle the React files of finished livestream shorts and de-register them from Root.tsx.")
    ap.add_argument("--dry-run", action="store_true", help="print the plan; change nothing")
    a = ap.parse_args()
    try:
        p = make_plan()
    except Abort as e:
        print(f"  FAILED (nothing changed): {e}")
        return 1
    c, shorts_total = p["counts"], len(p["elements"]) - p["counts"]["protected"]
    print(f"  registered compositions : {len(p['elements'])}  (livestream shorts {shorts_total} · protected {c['protected']})")
    print(f"  shorts kept             : {shorts_total - len(p['remove'])}  (active batch {c['owned']} · fresh {c['fresh']})")
    print(f"  eligible to recycle     : {len(p['recycle'])} file(s), {kb(p['recycle']):.0f} KB  ({len(p['remove'])} composition(s), {len(p['orphans'])} orphan file(s))")
    print(f"  Root.tsx                : {len(p['gone_imports'])} import(s) and {len(p['remove'])} <Composition> block(s) to remove")
    for note in p["kept_notes"]:
        print(f"    kept: {note}")
    for f in p["left_alone"]:
        print(f"    left alone: {f} — not reached by Root.tsx and not shorts-shaped")
    if not p["recycle"]:
        print("\n  Nothing to recycle.")
        return 0
    print("\n  Would recycle:" if a.dry_run else "\n  Recycling:")
    listed = set()
    for el in p["remove"]:
        mine = [f for f in el["family"] if f in p["recycle"] and f not in listed]
        listed |= set(mine)
        print(f"    {el['id']} — shorts comp, batch not active: {', '.join(mine) or '(files shared with a kept comp)'}")
    for f in p["orphans"]:
        if f in p["recycle"] and f not in listed:
            print(f"    {f} — orphan shorts file (Root.tsx no longer reaches it)")
    if a.dry_run:
        print("\n  [dry-run] nothing moved, Root.tsx untouched.")
        return 0

    holders = render_lock_holders()
    if holders:
        print(f"\n  SKIPPED: a shorts render holds the stage lock ({', '.join(holders)}). Re-run when it is done.")
        return 0
    if read(ROOT_TSX) != p["text"]:
        print("\n  SKIPPED: Root.tsx changed while planning (a builder is registering a comp). Re-run.")
        return 0
    try:
        with open(ROOT_TSX, "w", encoding="utf-8", newline="") as f:
            f.write(p["new_text"])
        errors = tsc_src_errors()
        if errors:
            raise Abort("the rewritten Root.tsx does not type-check:\n      " + "\n      ".join(errors[:10]))
    except (Abort, subprocess.TimeoutExpired, OSError) as e:
        with open(ROOT_TSX, "w", encoding="utf-8", newline="") as f:
            f.write(p["text"])
        print(f"\n  FAILED, Root.tsx restored, nothing recycled: {e}")
        return 1
    print("\n  Root.tsx rewritten and type-checked (0 errors under src/). Moving to Recycle Bin...")
    if not recycle_paths([SRC / f for f in p["recycle"]]):
        print("  Recycle Bin operation FAILED. Root.tsx no longer imports these files; the next run retries the leftovers.")
        return 1
    after = tsc_src_errors()
    if after:
        print("  FAILED: type errors under src/ after the move (the files are in the Recycle Bin):\n      " + "\n      ".join(after[:10]))
        return 1
    print(f"  Done. Recycled {len(p['recycle'])} file(s), de-registered {len(p['remove'])} composition(s); src/ type-checks clean.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
