"""effects_catalog.py: the EFFECTS library's one tool (video-creation/skills/effects-library/effects-library.md).

  python video-creation/skills/effects-library/scripts/effects_catalog.py check            # EFFECTS-CATALOG PASS|FAIL
  python video-creation/skills/effects-library/scripts/effects_catalog.py report [--theme kinetic-text-2023] [--grep text]
  python video-creation/skills/effects-library/scripts/effects_catalog.py engines          # which devices have a Remotion engine

`check` proves, from disk, that every device in assets/effects/library.json is USABLE:
  - every sound id it names (sound[].id, sound_by_meaning[].id, the text_swap / punch / variant sub-rows) exists in the
    SFX catalog index (assets/sfx/library.json -> index), so the edit plan can name it and the mixer can find the file;
  - every asset path it names (assets{}, the theme's textures{} / graphics{}) exists on disk;
  - every theme's `devices` list names real devices and every device belongs to exactly one theme;
  - a device that names an `engine` has that file under remotion/src/effects/ (a device without one is reported as
    "no engine yet", which is allowed: the comp-builder builds it to the row's numbers); a row marked
    `house_rule_conflict` is DOCUMENTATION ONLY (it records what a source did against a house rule) and must name no engine.
A row still marked PENDING (motion numbers not read from the source project yet) is listed, not failed.
"""
import argparse
import json
import re
import sys
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[3]
VC = REPO / "video-creation"
EFFECTS = VC / "assets" / "effects"
LIB = EFFECTS / "library.json"
SFX_INDEX = VC / "assets" / "sfx" / "library.json"
ENGINES = VC / "remotion" / "src" / "effects"


def load(p: Path) -> dict:
    return json.loads(p.read_text(encoding="utf-8"))


def sound_ids(row) -> set:
    """Every `id` under a device row's sound fields, recursively (sound, sound_by_meaning, sub-variants)."""
    out = set()

    def walk(x):
        if isinstance(x, dict):
            if "id" in x and isinstance(x["id"], str) and ("when" in x or "meaning" in x):
                out.add(x["id"])
            for k, v in x.items():
                if k == "sound" and isinstance(v, str):
                    # "punch-1-2023 ON the first frame" style one-liners in sub-variants
                    out.add(v.split()[0])
                else:
                    walk(v)
        elif isinstance(x, list):
            for v in x:
                walk(v)
    walk(row)
    return out


def asset_paths(row) -> list:
    out = []
    for v in (row.get("assets") or {}).values():
        if isinstance(v, str):
            out.append(v.split(" (")[0].strip())
    return out


def check(lib: dict) -> int:
    fails, warns = [], []
    sfx = load(SFX_INDEX)
    known = {r["id"] for r in sfx.get("index", [])}
    devices = {k: v for k, v in lib["devices"].items() if not k.startswith("$")}
    themes = {k: v for k, v in lib["themes"].items() if not k.startswith("$")}
    owner = {}
    for tid, t in themes.items():
        for did in t.get("devices", []):
            if did not in devices:
                fails.append(f"theme {tid} names unknown device {did}")
            owner.setdefault(did, []).append(tid)
        for role, rel in {**(t.get("textures") or {}), **(t.get("graphics") or {})}.items():
            p = EFFECTS / rel.split(" (")[0].strip()
            if not p.exists():
                fails.append(f"theme {tid} {role}: missing on disk {p.relative_to(REPO).as_posix()}")
    for did, row in devices.items():
        if did not in owner:
            fails.append(f"device {did} belongs to no theme")
        elif len(owner[did]) > 1:
            fails.append(f"device {did} belongs to {len(owner[did])} themes {owner[did]}")
        for sid in sorted(sound_ids(row)):
            if sid not in known:
                fails.append(f"device {did}: sound id {sid!r} is not in the SFX catalog index")
        for rel in asset_paths(row):
            p = EFFECTS / rel
            if not p.exists():
                fails.append(f"device {did}: asset missing on disk {p.relative_to(REPO).as_posix()}")
        eng = row.get("engine")
        if row.get("house_rule_conflict"):
            if eng:
                fails.append(f"device {did}: marked house_rule_conflict (documentation only) but names an engine {eng}")
            else:
                warns.append(f"device {did}: DOCUMENTATION ONLY (house_rule_conflict): no engine by design, never built")
        elif eng:
            if not (ENGINES / eng).is_file():
                fails.append(f"device {did}: engine {eng} missing under remotion/src/effects/")
        else:
            warns.append(f"device {did}: no engine yet (the comp-builder builds it to the row's numbers)")
        if "PENDING" in json.dumps(row):
            warns.append(f"device {did}: PENDING motion numbers (not read from the source project yet)")
    for w in warns:
        print("WARN", w)
    for f in fails:
        print("FAIL", f)
    print(f"EFFECTS-CATALOG {'FAIL' if fails else 'PASS'} devices={len(devices)} themes={len(themes)} fails={len(fails)} warns={len(warns)}")
    return 1 if fails else 0


def report(lib: dict, theme: str | None, grep: str | None):
    devices = {k: v for k, v in lib["devices"].items() if not k.startswith("$")}
    themes = {k: v for k, v in lib["themes"].items() if not k.startswith("$")}
    for tid, t in themes.items():
        if theme and tid != theme:
            continue
        print(f"== THEME {tid}: {t.get('name', '')}")
        print(f"   rule: {t.get('rule', '')}")
        for did in t.get("devices", []):
            row = devices.get(did, {})
            blob = json.dumps(row, ensure_ascii=False)
            if grep and not re.search(grep, blob, re.I):
                continue
            snds = ", ".join(sorted(sound_ids(row))) or "-"
            pend = " [PENDING numbers]" if "PENDING" in blob else ""
            eng = f" engine={row['engine']}" if row.get("engine") else (" [DOCUMENTATION ONLY: house rule conflict, never built]" if row.get("house_rule_conflict") else " (no engine yet)")
            print(f"-- {did}: {row.get('name', '')}{pend}{eng}")
            print(f"   trigger: {row.get('trigger', '')}")
            print(f"   sounds: {snds}")


def engines(lib: dict):
    for did, row in lib["devices"].items():
        if did.startswith("$"):
            continue
        eng = row.get("engine")
        state = "OK" if eng and (ENGINES / eng).is_file() else ("MISSING FILE" if eng else ("doc-only (house rule)" if row.get("house_rule_conflict") else "none"))
        print(f"{did:26s} {eng or '-':50s} {state}")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = ap.add_subparsers(dest="cmd", required=True)
    sub.add_parser("check")
    r = sub.add_parser("report")
    r.add_argument("--theme")
    r.add_argument("--grep")
    sub.add_parser("engines")
    a = ap.parse_args()
    lib = load(LIB)
    if a.cmd == "check":
        sys.exit(check(lib))
    if a.cmd == "report":
        report(lib, a.theme, a.grep)
    if a.cmd == "engines":
        engines(lib)


if __name__ == "__main__":
    main()
