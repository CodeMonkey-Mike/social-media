#!/usr/bin/env python
"""
lipsync_create.py: drive the ElevenLabs Image & Video > Lip sync playground (UI-only, no API) to set up
a lip-sync from a face IMAGE (or a driving VIDEO) + a Speech AUDIO file, then optionally Generate.
Real Chrome via elevenlabs-profile (run setup_elevenlabs.py once to log in).
Python port of lipsync-create.js (2026-11-23).

Anti-automation (house pattern, like the schedule-tweets posters):
  - real Chrome, AutomationControlled disabled, navigator.webdriver masked
  - hover -> randomized pause -> click on every interaction
  - randomized action pauses between steps
  - per-character typing for any text entry

    python lipsync_create.py --image <face.png> --audio <line.wav> [--model "Creatify Aurora"]
           [--prompt "optional guidance"] [--resolution 480p] [--generate]

For VIDEO->lipsync models (Sync 3, Sync Lipsync 2 Pro, Veed Lipsync), pass a driving clip with
--video <clip.mp4> instead of --image (those models expose a video file input, not an image one).
Default STAGES everything and STOPS before Generate (the paid action). Add --generate to submit.
"""
import argparse
import json
import os
import re
import sys

from _el import MODELS_RE, URL, launch, rnd, run, shot, vis

RES_OPTION_JS = """(res) => {
  for (const e of document.querySelectorAll('*')) {
    if ((e.textContent || '').trim().toLowerCase() !== res.toLowerCase()) continue;
    const b = e.getBoundingClientRect();
    if (b.width < 3 || b.height < 3 || b.top > innerHeight || b.left > innerWidth) continue;
    const s = getComputedStyle(e);
    if (s.visibility === 'hidden' || s.display === 'none' || +s.opacity === 0) continue;
    return { x: b.left + b.width / 2, y: b.top + b.height / 2 };
  }
  return null; }"""
SUBMIT_CANDIDATES_JS = """() => [...document.querySelectorAll('button:not([disabled])')]
  .map(b => ({ t: (b.innerText||'').trim().slice(0,20), aria: b.getAttribute('aria-label')||'',
               r: (() => { const x = b.getBoundingClientRect(); return [Math.round(x.right), Math.round(x.bottom)]; })() }))
  .filter(b => b.aria || b.t).slice(-12)"""
BOTTOM_RIGHT_ICON_JS = """() => {
  const btns = [...document.querySelectorAll('button:not([disabled])')];
  const vh = window.innerHeight; let best = null, bs = -1;
  for (const b of btns) { const r = b.getBoundingClientRect(); if (!r.width || r.top < vh*0.55) continue;
    if ((b.innerText||'').trim().length > 2) continue; const s = r.right + r.bottom; if (s > bs) { bs = s; best = b; } }
  return best; }"""
STATUS_JS = """() => [...document.querySelectorAll('*')].filter(e => !e.children.length)
  .map(e => (e.innerText||'').trim()).filter(t => /Generating|Queued|Processing|In progress|%|remaining/i.test(t) && t.length < 40)"""


def pause(page, lbl=""):
    ms = rnd(1500, 4000)
    if lbl:
        print(f"  ~{ms / 1000:.1f}s {lbl}")
    page.wait_for_timeout(ms)


def human_click(page, locator, lbl=""):
    for step in (locator.scroll_into_view_if_needed, locator.hover):
        try:
            step()
        except Exception:
            pass
    page.wait_for_timeout(rnd(450, 1300))
    # 2026-10-17: the hover can open a radix tooltip that sits over the control and intercepts the
    # pointer (seen on the "Lip sync" modality radio) -> retry once with a forced click instead of
    # timing out.
    try:
        locator.click(timeout=6000)
    except Exception:
        try:
            page.keyboard.press("Escape")
        except Exception:
            pass
        locator.click(force=True, timeout=6000)
        if lbl:
            print("  (forced) ")
    if lbl:
        print(f"  clicked: {lbl}")
    page.wait_for_timeout(rnd(400, 900))


def type_human(page, locator, text):
    human_click(page, locator, "focus text field")
    for ch in text:
        page.keyboard.type(ch)
        page.wait_for_timeout(rnd(40, 120))


def dismiss_popovers(page):
    """Dismiss one-time announcement popovers / modals (radix popper) that intercept pointer events."""
    for _ in range(3):
        popper = page.locator('[data-radix-popper-content-wrapper], [role="dialog"]').first
        if not vis(popper):
            # also dismiss the GPT-Image launch promo specifically if its image is present
            promo = page.locator('img[alt*="just launched" i]').first
            if not vis(promo):
                return
        # try a named close/dismiss button, else Escape, else click a neutral corner
        btn = page.locator(
            'button:has-text("Got it"), button:has-text("Dismiss"), button:has-text("Skip"), '
            'button:has-text("Maybe later"), button[aria-label*="close" i], button[aria-label*="dismiss" i]').first
        try:
            if vis(btn):
                btn.click()
            else:
                page.keyboard.press("Escape")
                page.mouse.click(8, 8)
        except Exception:
            pass
        page.wait_for_timeout(rnd(600, 1100))
    print("  dismissed announcement popover(s)")


def set_resolution(page, res):
    """Set Resolution (project rule 480p; the composer defaults to 720p). NON-FATAL: never blocks Generate."""
    try:
        res_pill = page.locator('[aria-label="Resolution"], button:has-text("720p"), button:has-text("1080p")').first
        if not vis(res_pill):
            print("  resolution control not found")
            return
        try:
            cur = res_pill.inner_text().strip()
        except Exception:
            cur = ""
        if re.search(res, cur, re.I):
            print(f"  resolution already {cur}")
            return
        human_click(page, res_pill, f'resolution menu (was "{cur}")')
        pause(page, "resolution menu")
        # click the visible menu option whose exact text is `res`, by its center point (portal-safe)
        pt = page.evaluate(RES_OPTION_JS, res)
        if pt:
            page.mouse.click(pt["x"], pt["y"])
            print(f"  resolution set {res}")
            pause(page, "res set")
        else:
            print(f"  {res} option not found; pressing Escape, leaving default")
            try:
                page.keyboard.press("Escape")
            except Exception:
                pass
    except Exception as e:
        print("  resolution step skipped (non-fatal):", str(e).splitlines()[0])


def submit(page):
    """Click Generate (an icon button, not a text button), accept the one-time policy modal, report status."""
    # log candidate submit buttons for the record
    cands = page.evaluate(SUBMIT_CANDIDATES_JS)
    print("  submit candidates (last 12 enabled):", json.dumps(cands, ensure_ascii=False, separators=(",", ":")))

    clicked = False
    named = page.locator(
        'button:has-text("Generate"), button[aria-label*="Generate" i], '
        'button[aria-label*="Create video" i], button[aria-label*="Submit" i]').first
    if vis(named):
        human_click(page, named, "Generate (named)")
        clicked = True
    else:
        # click the bottom-right enabled icon button directly via handle
        el = page.evaluate_handle(BOTTOM_RIGHT_ICON_JS).as_element()
        if el:
            try:
                el.hover()
            except Exception:
                pass
            page.wait_for_timeout(rnd(500, 1200))
            try:
                el.click()
            except Exception:
                pass
            clicked = True
            print("  clicked: submit (bottom-right icon)")

    if not clicked:
        print("  could not locate submit control: left staged.")
        return
    page.wait_for_timeout(rnd(1500, 2500))
    # one-time "Prohibited Use Policy" consent modal
    consent = page.locator('button:has-text("Continue with Generation")').first
    if vis(consent):
        print("  policy consent modal -> Continue with Generation")
        human_click(page, consent, "Continue with Generation")
    print("  submitted. Waiting for render to register...")
    page.wait_for_timeout(10000)
    shot(page, "el-generating.png")
    status = page.evaluate(STATUS_JS)
    print("  status hints:", json.dumps(list(dict.fromkeys(status))[:8], ensure_ascii=False, separators=(",", ":")))
    print("  screenshot: el-generating.png (render runs server-side; check History / Assets)")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--image")
    ap.add_argument("--video")  # driving clip for video->lipsync models (Sync 3, Sync Lipsync 2 Pro, Veed Lipsync)
    ap.add_argument("--audio")
    ap.add_argument("--model", default="Creatify Aurora")
    ap.add_argument("--prompt")
    ap.add_argument("--resolution", default="480p")  # project rule: always 480p (Remotion upscales free; saves EL allowance)
    ap.add_argument("--generate", action="store_true")
    a = ap.parse_args()
    face = a.image or a.video
    if not face or not a.audio or not os.path.exists(face) or not os.path.exists(a.audio):
        print("Need valid --image OR --video, plus --audio paths.", file=sys.stderr)
        sys.exit(1)

    with launch() as (_ctx, page):
        print("opening Image & Video...")
        page.goto(URL, wait_until="domcontentloaded", timeout=60000)
        pause(page, "load")

        # 0) dismiss any one-time announcement popovers (e.g. "GPT Image 2 just launched!") that overlay
        #    a radix popper and intercept pointer events. (Appeared 2026-06-12.)
        dismiss_popovers(page)

        # 1) Lip sync modality
        human_click(page, page.locator('[role="radio"]:has-text("Lip sync"), button:has-text("Lip sync")').first,
                    "Lip sync tab")
        pause(page, "modality")

        # 2) open model menu (pill shows current model) and pick the model
        pill = page.locator("button").filter(has_text=MODELS_RE).first
        try:
            pill_text = pill.inner_text().strip()
        except Exception:
            pill_text = ""
        if re.search(a.model, pill_text, re.I):
            print(f'  model already "{pill_text}"')
        else:
            human_click(page, pill, f'model menu (was "{pill_text}")')
            pause(page, "model menu open")
            human_click(page, page.locator(f"text=/{a.model}/i").first, a.model)
            pause(page, "model selected")

        # 3) upload the face to the Avatar input, audio to the Speech (audio) input.
        #    VIDEO->lipsync models expose a video file input instead of an image one; pass --video for
        #    those, --image for image->lipsync models.
        if a.video:
            page.locator('input[type="file"][accept*="video"]').first.set_input_files(a.video)
            print("  uploaded driving video:", a.video)
        else:
            page.locator('input[type="file"][accept*="image"]').first.set_input_files(a.image)
            print("  uploaded avatar image:", a.image)
        pause(page, "avatar upload settle")

        page.locator('input[type="file"][accept*="audio"]').first.set_input_files(a.audio)
        print("  uploaded speech audio:", a.audio)
        pause(page, "speech upload settle")

        # 4) optional guidance prompt
        if a.prompt:
            box = page.locator('textarea, [contenteditable="true"], input[placeholder*="Guide" i]').first
            if vis(box):
                type_human(page, box, a.prompt)
            pause(page, "prompt typed")

        # 5) Resolution
        set_resolution(page, a.resolution)

        page.wait_for_timeout(rnd(1800, 2800))
        shot(page, "el-staged.png")
        print("\nSTAGED. Screenshot: el-staged.png")

        if a.generate:
            submit(page)
            page.wait_for_timeout(4000)
        else:
            print("Default = staged only. Re-run with --generate to submit.")
            page.wait_for_timeout(3000)


if __name__ == "__main__":
    run(main, "lipsync-create")
