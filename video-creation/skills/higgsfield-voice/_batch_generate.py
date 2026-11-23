#!/usr/bin/env python
"""
_batch_generate.py: batch Seed Speech generation over CDP for the CURRENTLY-SELECTED voice.
SPENDS CREDITS: only with Mike's OK. Python port of _batch-generate.js (2026-11-23).

    python _batch_generate.py <chunks.json> <audioDir> [SCRIPT.md]
        chunks.json = [{ "file": "chunk-04.mp3", "text": "...TTS-ready text..." }, ...]

Writes each result to <audioDir>/_manifest.json as it goes: [{file, ok, url, err}].
Does NOT download: capture the URLs, then curl them (cloudfront paths are stable / unsigned).

SAFETY GATES (both abort BEFORE spending any credits):
  1. SCRIPT gate: if a SCRIPT.md is passed (3rd arg or HF_SCRIPT env), every chunk's text MUST match
     the canonical script (verify_tts.py). Added 2026-07-16 after tts-chunks.json was hand-authored
     from a stale draft and 10 chunks got voiced with wrong text. Exit 3.
  2. VOICE gate: aborts if the selected voice is not MIKE-CLONE (override: HF_VOICE). Exit 2.
"""
import json
import os
import re
import sys
from pathlib import Path

from _cdp import DOM_AUDIO_JS, click_generate, connect, run, wait_for_new_mp3, watch_mp3s
from verify_tts import check

MP3_RE = re.compile(r"\.mp3(\?|$)", re.IGNORECASE)

# The selected-voice label lives in the LEFT composer panel (2026-10 layout: "Selected Voice" card,
# x<480); the older layout had it bottom-right (x>820, y>650). History cards (x~500) also print voice
# names, so geometry matters. Card text is lowercase in the DOM (CSS-uppercased) -> compare upper-cased.
READ_VOICE_JS = """() => { let fallback = '?';
  for (const e of document.querySelectorAll('*')) {
    const t = (e.innerText || '').trim();
    if (/^(MIKE-CLONE|YULI-1|ANA-2|MIKE)$/i.test(t) && e.children.length === 0) {
      const r = e.getBoundingClientRect();
      if (r.width < 4 || r.height < 4) continue;
      if (r.left < 480 && r.top < 650) return t.toUpperCase();   // left composer panel = the selected voice
      if (r.left > 820 && r.top > 650) fallback = t.toUpperCase(); // legacy layout
    }
  }
  return fallback; }"""


def main():
    if len(sys.argv) < 3:
        print("usage: python _batch_generate.py <chunks.json> <audioDir> [SCRIPT.md]", file=sys.stderr)
        sys.exit(1)
    chunks_file, audio_dir = sys.argv[1], Path(sys.argv[2])
    script_path = (sys.argv[3] if len(sys.argv) > 3 else None) or os.environ.get("HF_SCRIPT") or None
    expect_voice = (os.environ.get("HF_VOICE") or "MIKE-CLONE").upper()
    chunks = json.loads(Path(chunks_file).read_text(encoding="utf-8"))
    manifest_path = audio_dir / "_manifest.json"
    audio_dir.mkdir(parents=True, exist_ok=True)  # before any credit is spent: the manifest must be writable

    # GATE 1: canonical-script match (no browser, no credits until this passes).
    if script_path:
        res = check(script_path, chunks)
        if not res["ok"]:
            print("SCRIPT GATE FAILED - tts-chunks do NOT match " + script_path + " (no credits spent):",
                  file=sys.stderr)
            for m in res["mismatches"]:
                print("  chunk " + str(m["n"]) + ": " + m["reason"], file=sys.stderr)
            sys.exit(3)
        print("SCRIPT GATE OK - " + str(len(chunks)) + " chunks match " + script_path)
    else:
        print("WARNING: no SCRIPT.md passed - running WITHOUT the script-match gate. "
              "Prefer: python _batch_generate.py <chunks.json> <audioDir> <SCRIPT.md>")

    manifest = []

    def save():
        manifest_path.write_text(json.dumps(manifest, indent=1, ensure_ascii=False), encoding="utf-8")

    with connect() as (_browser, _ctx, page):
        page.wait_for_timeout(500)

        # GATE 2: the selected voice.
        voice = page.evaluate(READ_VOICE_JS)
        print("VOICE:", voice)
        if voice != expect_voice:
            print("WRONG VOICE - aborting", file=sys.stderr)
            sys.exit(2)

        seen = watch_mp3s(page, MP3_RE)
        for u in page.evaluate(DOM_AUDIO_JS):
            if ".mp3" in u.lower():
                seen.setdefault(u, True)

        for c in chunks:
            # fill prompt
            h = page.query_selector("textarea") or page.query_selector('[contenteditable="true"]')
            h.click()
            page.wait_for_timeout(150)
            page.keyboard.press("Control+A")
            page.keyboard.press("Delete")
            page.wait_for_timeout(120)
            page.keyboard.type(c["text"], delay=8)
            page.wait_for_timeout(300)

            before = set(seen)
            if not click_generate(page):
                manifest.append({"file": c["file"], "ok": False, "err": "no-generate-btn"})
                save()
                continue

            # 2026-10-17: the Audio page no longer mounts an <audio> element for a fresh generation; the
            # result appears as a NEW History card and its mp3 only loads when the row's Play is clicked
            # (wait_for_new_mp3 handles both).
            url = wait_for_new_mp3(page, seen, before, 70)
            if not url:
                manifest.append({"file": c["file"], "ok": False, "err": "timeout"})
            else:
                seen.setdefault(url, True)
                manifest.append({"file": c["file"], "ok": True, "url": url})
            print(("OK  " if url else "FAIL") + " " + c["file"] + (" " + url if url else ""))
            save()
            page.wait_for_timeout(700)

    print("DONE " + str(sum(1 for m in manifest if m["ok"])) + "/" + str(len(chunks)))


if __name__ == "__main__":
    run(main)
