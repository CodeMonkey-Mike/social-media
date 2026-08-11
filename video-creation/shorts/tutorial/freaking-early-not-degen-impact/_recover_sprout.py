"""tutorial / clip 8 — READ-ONLY recovery of the SPROUT b-roll image from the ChatGPT broll chat.

WHY THIS EXISTS (2026-08-10). Three prompts were sent for this clip through the canonical
`repurpose/generate-broll-reload.js` (cover, lookup, sprout), one invocation each inside one held
`chatgpt` stage lock. All three GENERATED fine, but the CAPTURES came back shifted by one:

    thumb-tutfei.png            <- a PRE-EXISTING golden firework already in the chat (off-brief)
    broll-tut-fei-ov-lookup.png <- actually the COVER art (lone silhouette on a cliff)
    broll-tut-fei-ov-sprout.png <- actually the LOOKUP art (crowd below, blank panels above)

That is exactly the generator's documented "WRONG-IMAGE grab" failure mode, and the documented cause
applies: its seen-set of estuary `file_id`s starts EMPTY on every invocation, so run 1 against an
ALREADY-POPULATED chat (this one was at 12/25 images) can legitimately pick a pre-existing image as
"the one whose file_id I have not seen", after which every later run is one behind. The SKILL says in
terms: "BEST used against a FRESH chat (retire the active broll chat first) so the seen-set starts
clean." It was not; that is the miss, and it is recorded here rather than hidden.

THE FIX FOLLOWS THE SKILL, WHICH FORBIDS THE OBVIOUS SHORTCUTS:
  * "NEVER re-send a prompt (a re-send is a duplicate generation)" — so the sprout prompt is NOT sent
    again. The image already exists server-side; this script only READS it.
  * "when an image is off-brief, recover the truth READ-ONLY from the conversation before assuming a
    capture bug" — so this opens the conversation, enumerates every generated image, and matches by
    CONTENT against what is already on disk. Nothing is typed, no message is sent, the composer is
    never touched.
The two correctly-generated files are RENAMED to their true identities (never regenerated), per the
SKILL's "do NOT regenerate mid-build - REMAP" rule.

Run from the repo root, inside the `chatgpt` stage lock (it drives the shared chatgpt-profile Chrome):
  python video-creation/shorts/tutorial/freaking-early-not-degen-impact/_recover_sprout.py
"""
import hashlib
import json
import os
import re
import subprocess
import sys

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".."))
RA = os.path.join(REPO, "video-creation", "shorts", "tutorial", "render-assets")
CHAT = "https://chatgpt.com/c/6a78e528-8e70-83ea-aebb-d45c588eef5e"
TARGET = os.path.join(RA, "broll-tut-fei-ov-sprout.png")

# md5s of every image already on disk in the batch public dir: the recovered image must match NONE of
# them (that is what proves it is the uncaptured sprout and not another off-by-one grab).
known = {}
for f in sorted(os.listdir(RA)):
    if f.lower().endswith(".png"):
        known[hashlib.md5(open(os.path.join(RA, f), "rb").read()).hexdigest()] = f

JS = r"""
const { chromium } = require('playwright');
const fs = require('fs');
const PROFILE_DIR = 'C:\\Users\\mnede\\AppData\\Local\\Google\\Chrome\\chatgpt-profile';
const CHAT = process.argv[2];
const OUTDIR = process.argv[3];
(async () => {
  // Same launch shape as the canonical generate-broll-reload.js: channel 'chrome' (the repo does NOT
  // install playwright's bundled chromium) + the anti-detection flags.
  const ctx = await chromium.launchPersistentContext(PROFILE_DIR, {
    channel: 'chrome', headless: false, ignoreDefaultArgs: ['--enable-automation'],
    args: ['--disable-blink-features=AutomationControlled'], viewport: null });
  await ctx.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => undefined }));
  const page = await ctx.newPage();
  await page.goto(CHAT);
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(9000);
  // READ-ONLY via the backend API the SKILL names: /backend-api/conversation/<id> lists every message
  // with its image asset_pointers, and /backend-api/files/<file_id>/download returns a signed URL.
  // This never touches the composer and sends no message.
  const cid = CHAT.split('/').pop();
  // /backend-api/* needs the OAuth access token, not just cookies (cookie-only returns 404/401).
  // The web app itself reads it from /api/auth/session; doing the same is still READ-ONLY.
  const tok = await page.evaluate(async () => {
    try {
      const r = await fetch('/api/auth/session', { credentials: 'include' });
      if (!r.ok) return null;
      const j = await r.json();
      return j.accessToken || null;
    } catch (e) { return null; }
  });
  console.log('access token: ' + (tok ? 'obtained' : 'MISSING'));
  const ids = await page.evaluate(async ([cid, tok]) => {
    const H = tok ? { Authorization: 'Bearer ' + tok } : {};
    const r = await fetch('/backend-api/conversation/' + cid, { credentials: 'include', headers: H });
    if (!r.ok) return { err: 'conversation ' + r.status };
    const j = await r.json();
    const out = [];
    for (const k of Object.keys(j.mapping || {})) {
      const m = j.mapping[k].message;
      if (!m || !m.content || !Array.isArray(m.content.parts)) continue;
      for (const p of m.content.parts) {
        if (p && typeof p === 'object' && p.asset_pointer) {
          const fid = String(p.asset_pointer).split('/').pop();
          out.push({ fid, ct: m.create_time || 0 });
        }
      }
    }
    out.sort((a, b) => a.ct - b.ct);
    return { ids: out };
  }, [cid, tok]);
  if (ids.err) { console.log('CANDIDATES []'); console.log('API-ERR ' + ids.err); await ctx.close(); return; }
  console.log('FOUND ' + ids.ids.length + ' asset pointers');
  const out = [];
  const tail = ids.ids.slice(-6);
  for (let n = 0; n < tail.length; n++) {
    const { fid } = tail[n];
    try {
      const dl = await page.evaluate(async ([fid, tok]) => {
        const H = tok ? { Authorization: 'Bearer ' + tok } : {};
        const r = await fetch('/backend-api/files/' + fid + '/download', { credentials: 'include', headers: H });
        if (!r.ok) return null;
        const j = await r.json();
        return j.download_url || null;
      }, [fid, tok]);
      if (!dl) continue;
      const r = await page.request.get(dl);
      if (!r.ok()) continue;
      const b = await r.body();
      if (!b || b.length < 5000) continue;
      const p = OUTDIR + '\\cand-' + n + '-' + fid + '.png';
      fs.writeFileSync(p, b);
      out.push({ i: ids.ids.length - tail.length + n, id: fid, path: p, bytes: b.length });
    } catch (e) {}
  }
  console.log('CANDIDATES ' + JSON.stringify(out));
  await ctx.close();
})();
"""

# The helper MUST live in repurpose/ : node resolves `require('playwright')` relative to the SCRIPT's
# own directory, not the cwd, and that is where the repo's node_modules is.
tmp = os.path.join(REPO, "repurpose", "_recover_sprout_tmp.js")
open(tmp, "w", encoding="utf-8").write(JS)
cand_dir = os.path.join(os.environ.get("TEMP", "."), "tutfei-cands")
os.makedirs(cand_dir, exist_ok=True)
r = subprocess.run(["node", tmp, CHAT, cand_dir], cwd=os.path.join(REPO, "repurpose"),
                   capture_output=True, text=True, encoding="utf-8", errors="replace")
try:
    os.remove(tmp)
except OSError:
    pass
print(r.stdout[-3000:])
if r.returncode != 0:
    print(r.stderr[-2000:], file=sys.stderr)
    sys.exit("recovery browser run failed")

m = re.search(r"CANDIDATES (\[.*\])", r.stdout)
if not m:
    sys.exit("no candidate list returned")
cands = json.loads(m.group(1))
print(f"\n{len(cands)} candidate images pulled (newest last):")
fresh = []
for c in cands:
    h = hashlib.md5(open(c["path"], "rb").read()).hexdigest()
    tag = known.get(h)
    print(f"  idx {c['i']:3d} {c['id']:28s} {c['bytes']/1024:7.0f} KB  "
          f"{'ALREADY ON DISK as ' + tag if tag else 'NEW (not on disk)'}")
    if not tag:
        fresh.append(c)
if not fresh:
    sys.exit("no NEW image found in the chat - do NOT re-send; investigate manually")
pick = fresh[-1]   # newest un-captured image = the sprout, the last prompt sent
import shutil
shutil.copyfile(pick["path"], TARGET)
print(f"\nrecovered -> {TARGET}\n  from {pick['id']} ({pick['bytes']/1024:.0f} KB), DOM index {pick['i']}")
print("  VERIFY VISUALLY before use (persona inspection is mandatory).")
