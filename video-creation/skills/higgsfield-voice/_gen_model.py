#!/usr/bin/env python
"""
_gen_model.py: generate chunks on a NON-default TTS model of the Audio page (Seed Audio 1.0 /
ElevenLabs v3 / ...), one at a time. SPENDS CREDITS: only with Mike's OK.
Python port of _gen-model.js (2026-11-23).

    python _gen_model.py "<model name>" <chunks.json> <outDir> ["voice details"]
        chunks.json = [{file, text}]; for Seed Audio 1.0 the text is prefixed with the voice handle
        (e.g. "@ana-2 ").

Each result is taken from `higgsfield generate list --json` (the CLI lists Text-to-Speech jobs with
their mp3 URLs): after each Generate it waits for a NEW completed job id, downloads that mp3 into
<outDir>, and records it in <outDir>/_manifest.json.
"""
import json
import re
import subprocess
import sys
import urllib.request
from pathlib import Path

from _cdp import IS_VIS, OPEN_MODEL_SELECTOR_JS, click_generate, connect, run

TTS_RE = re.compile(r"speech|audio|tts|voice", re.IGNORECASE)  # TTS V2, Seed Audio 1.0, ElevenLabs vN
MODEL_SHOWN_JS = """([m, v]) => { const isVis = eval(v);
  return [...document.querySelectorAll('*')].some(e => (e.innerText||'').trim() === m && e.children.length === 0
    && isVis(e) && e.getBoundingClientRect().left < 620); }"""
MODEL_BOX_JS = """([t, v]) => { const isVis = eval(v);
  for (const e of document.querySelectorAll('*')) {
    if ((e.innerText||'').trim() !== t || e.children.length > 1 || !isVis(e)) continue;
    const r = e.getBoundingClientRect(); return { x: r.left + r.width/2, y: r.top + r.height/2 }; }
  return null; }"""
TYPED_JS = """() => ({ script: (document.querySelector('[contenteditable="true"]')||{}).innerText,
  details: (document.querySelector('textarea')||{}).value })"""


def list_tts():
    """The account's TTS jobs, newest first, from the higgsfield CLI. None when the CLI call fails."""
    try:
        out = subprocess.run("higgsfield generate list --json", shell=True, capture_output=True, check=True).stdout
        j = json.loads(out.decode("utf-8", errors="replace"))
        arr = j if isinstance(j, list) else (j.get("items") or j.get("jobs") or [])
        return [x for x in arr
                if TTS_RE.search(json.dumps([x.get("job_type"), x.get("display_name"), x.get("model")]))]
    except Exception:
        return None


def download(url, dest):
    """Save the take's mp3. The JS version shelled out to `curl -s -o`; same request, no shell."""
    req = urllib.request.Request(url, headers={"User-Agent": "curl/8.0"})
    with urllib.request.urlopen(req, timeout=120) as res:
        Path(dest).write_bytes(res.read())


def main():
    if len(sys.argv) < 4:
        print('usage: python _gen_model.py "<model name>" <chunks.json> <outDir> ["voice details"]', file=sys.stderr)
        sys.exit(1)
    model, chunks_file, out_dir = sys.argv[1], sys.argv[2], Path(sys.argv[3])
    details = sys.argv[4] if len(sys.argv) > 4 else None
    chunks = json.loads(Path(chunks_file).read_text(encoding="utf-8"))
    out_dir.mkdir(parents=True, exist_ok=True)
    manifest = []

    def save():
        (out_dir / "_manifest.json").write_text(json.dumps(manifest, indent=1, ensure_ascii=False), encoding="utf-8")

    with connect() as (_browser, _ctx, page):
        # 1. pick the model if not already shown in the left panel
        if not page.evaluate(MODEL_SHOWN_JS, [model, IS_VIS]):
            page.evaluate(OPEN_MODEL_SELECTOR_JS, IS_VIS)
            page.wait_for_timeout(2000)
            box = page.evaluate(MODEL_BOX_JS, [model, IS_VIS])
            if not box:
                print("MODEL NOT FOUND", model, file=sys.stderr)
                sys.exit(2)
            page.mouse.click(box["x"], box["y"])
            page.wait_for_timeout(2500)
        print("model:", model)

        for c in chunks:
            # Script box = the contenteditable; "Voice details" (Seed Audio 1.0) = the only textarea.
            ce = page.query_selector('[contenteditable="true"]')
            if not ce:
                print("no script box", file=sys.stderr)
                sys.exit(3)
            ce.click()
            page.keyboard.press("Control+A")
            page.keyboard.press("Delete")
            page.keyboard.type(c["text"], delay=6)
            page.wait_for_timeout(300)
            ta = page.query_selector("textarea")
            if details and ta:
                ta.click()
                page.keyboard.press("Control+A")
                page.keyboard.press("Delete")
                page.keyboard.type(details, delay=4)
                page.wait_for_timeout(300)
            typed = page.evaluate(TYPED_JS)
            print("typed:", json.dumps(typed, ensure_ascii=False, separators=(",", ":"))[:160])

            before = [x.get("id") for x in (list_tts() or [])]
            if not click_generate(page, min_height=0):
                manifest.append({"file": c["file"], "ok": False, "err": "no-generate-btn"})
                save()
                continue
            job = None
            for _ in range(90):
                page.wait_for_timeout(2000)
                job = next((x for x in (list_tts() or [])
                            if x.get("id") not in before and re.search("completed", x.get("status") or "", re.I)
                            and x.get("result_url")), None)
                if job:
                    break
            if not job:
                manifest.append({"file": c["file"], "ok": False, "err": "timeout"})
                save()
                print("FAIL", c["file"])
                continue
            download(job["result_url"], out_dir / c["file"])
            manifest.append({"file": c["file"], "ok": True, "url": job["result_url"], "id": job.get("id")})
            print("OK  ", c["file"], job["result_url"])
            save()
            page.wait_for_timeout(800)

    print("DONE", str(sum(1 for m in manifest if m["ok"])) + "/" + str(len(chunks)))


if __name__ == "__main__":
    run(main)
