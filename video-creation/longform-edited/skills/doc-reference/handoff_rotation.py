"""The hook-to-body HANDOFF line rotation (Mike 2026-10-01; enforced in code 2026-11-01).

The line that closes CH1 ("So, let's dive into all this.") must not repeat from video to video. The variant
list lives in persona.json -> spoken_voice.signature_devices.dive_in_variants. Two failures let the same line
come back every time: `recent_use` was only ever updated by hand (it went stale after 2026-10-16), and the
rule only excluded the ONE line at its top, so the first `approved` line stayed "least recently used" forever.

This module is the mechanical half of the rule:
  find_handoff(text)                the scripted handoff sentence in a SCREENPLAY's CH1, or None
  blocked(project, n=3)             the normalized lines of the last n `recent_use` entries (other projects)
  record(project, line, note)       put the line at the top of `recent_use` (one entry per project, replaced on
                                    re-record) and make sure it sits in `approved`; called by the longform graph
                                    when GATE 1 (screenplay) is approved
CLI: python handoff_rotation.py <SCREENPLAY.md>          prints the handoff + whether it is blocked
     python handoff_rotation.py <SCREENPLAY.md> --record  records it (what the graph does at GATE 1)
"""
import json
import re
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[4]
PERSONA = ROOT / "persona" / "persona.json"
WINDOW = 3   # a handoff may not repeat any of the last 3 videos' lines

_SENT = re.compile(r"\bSo,?\s+(?:let(?:'|’)s|let us|let me|here(?:'|’)s)\b[^.?!]*[.?!]", re.I)
_SPOKEN = re.compile(r"`\[(?:FACE|COVER|SAY-EXACT)\]`")


def norm(s: str) -> str:
    s = re.sub(r"[^a-z0-9 ]+", " ", s.lower().replace("’", "'").replace("'", ""))
    s = re.sub(r"\s+", " ", s).strip()
    return re.sub(r"^so ", "", s)


def find_handoff(text: str):
    """The LAST 'So, let's ...' sentence on a spoken line inside the CH1 section, or None (no handoff scripted)."""
    m = re.search(r"^##\s+CH\s*1\b.*?(?=^##\s|\Z)", text, re.M | re.S | re.I)
    if not m:
        return None
    found = None
    for line in m.group(0).splitlines():
        if _SPOKEN.search(line):
            for s in _SENT.finditer(re.sub(r"`[^`]*`", "", line)):
                found = s.group(0).strip()
    return found


def _load():
    with open(PERSONA, encoding="utf-8", newline="") as f:   # keep CRLF visible: the file is written back as it was
        raw = f.read()
    return json.loads(raw), raw


def _variants(d):
    return d["spoken_voice"]["signature_devices"]["dive_in_variants"]


def _entry_line(entry: str) -> str:
    m = re.search(r"\):\s*(.+)$", entry)
    return (m.group(1) if m else entry.split(":", 1)[-1]).strip()


def _entry_project(entry: str) -> str:
    return entry.split(" (", 1)[0].strip()


def blocked(project: str, n: int = WINDOW):
    """{normalized line: the recent_use entry} for the last n entries that belong to OTHER projects."""
    v = _variants(_load()[0])
    out = {}
    for e in [e for e in v.get("recent_use", []) if _entry_project(e) != project][:n]:
        out[norm(_entry_line(e))] = e
    return out


def record(project: str, line: str, note: str = "scripted, GATE 1 approved") -> str:
    d, raw = _load()
    v = _variants(d)
    entry = f"{project} ({date.today().isoformat()}, {note}): {line}"
    v["recent_use"] = [entry] + [e for e in v.get("recent_use", []) if _entry_project(e) != project]
    if line in v.get("proposed", []):
        v["proposed"].remove(line)
    if norm(line) not in {norm(x) for x in v.get("approved", [])}:
        v.setdefault("approved", []).append(line)
    nl = "\r\n" if "\r\n" in raw else "\n"
    PERSONA.write_text(json.dumps(d, indent=2, ensure_ascii=False).replace("\n", nl), encoding="utf-8", newline="")
    return entry


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(2)
    sp = Path(sys.argv[1])
    project = sp.resolve().parent.name
    line = find_handoff(sp.read_text(encoding="utf-8"))
    if not line:
        print(f"HANDOFF none scripted in CH1 ({project})")
        return
    hit = blocked(project).get(norm(line))
    print(f"HANDOFF {'BLOCKED' if hit else 'OK'} '{line}'" + (f" (recent: {hit})" if hit else ""))
    if "--record" in sys.argv[2:]:
        print("RECORDED", record(project, line))


if __name__ == "__main__":
    main()
