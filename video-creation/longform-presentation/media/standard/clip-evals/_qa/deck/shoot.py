"""QA for the clip-evals deck: step through every slide with the deck's own keys and screenshot each one.

    python _qa/deck/shoot.py            (run from anywhere; paths are resolved from this file)

Writes _qa/deck/slide-NN.png (1920x1080, as recorded), _qa/deck/helper-guide.png (the G webcam guide box on) and
_qa/deck/report.json. Exits 1 when a check fails. Checks, per slide: the next-slide key really advanced, the slide
fills the viewport exactly, every fade-in finished, no text is clipped, no text reaches the right 32vw of the
screen, no text is under the webcam guide box. Once: G toggles the guide box, F asks for fullscreen, the back key
goes back, the file has no em or en dash.
"""
import json
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
DECK = HERE.parent.parent / "clip-evals.html"
W, H = 1920, 1080
EXPECTED_SLIDES = 17
NEXT_KEYS = ["ArrowRight", "ArrowDown", " "]          # the three "next" keys, used in turn

MEASURE_JS = r"""
(idx) => {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const s = slides[idx];
  const vw = window.innerWidth, vh = window.innerHeight;
  const sr = s.getBoundingClientRect();
  const pip = {left: vw*(1-0.0208-0.25), top: vh*(1-0.037-0.25), right: vw*(1-0.0208), bottom: vh*(1-0.037)};
  const limitX = vw*0.68;
  let maxRight = 0, maxBottom = 0, minLeft = 1e9, minTop = 1e9;
  const pastLimit = [], underCam = [], offSlide = [];
  const walker = document.createTreeWalker(s, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = walker.nextNode())) {
    const t = n.textContent.trim();
    if (!t) continue;
    const range = document.createRange();
    range.selectNodeContents(n);
    for (const r of range.getClientRects()) {
      if (r.width < 1 || r.height < 1) continue;
      maxRight = Math.max(maxRight, r.right); maxBottom = Math.max(maxBottom, r.bottom);
      minLeft = Math.min(minLeft, r.left); minTop = Math.min(minTop, r.top);
      if (r.right > limitX + 0.5) pastLimit.push([t.slice(0, 50), Math.round(r.right)]);
      if (r.right > pip.left && r.left < pip.right && r.bottom > pip.top && r.top < pip.bottom) underCam.push(t.slice(0, 50));
      if (r.left < sr.left || r.right > sr.right || r.top < sr.top || r.bottom > sr.bottom) offSlide.push(t.slice(0, 50));
    }
  }
  const clipped = [];
  s.querySelectorAll('.wrap, .wrap *').forEach(el => {
    const cs = getComputedStyle(el);
    if (cs.display === 'inline') return;
    if (el.scrollWidth > el.clientWidth + 1 || el.scrollHeight > el.clientHeight + 1) {
      if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible')
        clipped.push(el.className + ' ' + el.scrollWidth + 'x' + el.scrollHeight + ' in ' + el.clientWidth + 'x' + el.clientHeight);
    }
  });
  const fades = Array.from(s.querySelectorAll('.fade-in'));
  const notShown = fades.filter(el => parseFloat(getComputedStyle(el).opacity) < 0.99).length;
  const fonts = new Set();
  s.querySelectorAll('h1,h2,.pts li,.ey,.mono,.big,.url').forEach(el => fonts.add(getComputedStyle(el).fontFamily.split(',')[0].replace(/["']/g, '')));
  return {
    id: s.id, scrollY: Math.round(window.scrollY), top: Math.round(sr.top), height: Math.round(sr.height * 100) / 100,
    headline: (s.querySelector('h1,h2') || {}).innerText || '', eyebrow: (s.querySelector('.ey') || {}).innerText || '',
    points: Array.from(s.querySelectorAll('.pts li, .parts .card, .say')).map(el => el.innerText.replace(/\s+/g, ' ').trim()),
    textBox: [Math.round(minLeft), Math.round(minTop), Math.round(maxRight), Math.round(maxBottom)],
    limitX: Math.round(limitX), pip: Object.fromEntries(Object.entries(pip).map(([k, v]) => [k, Math.round(v)])),
    pastLimit, underCam, offSlide, clipped, fades: fades.length, notShown,
    activeDot: Array.from(document.querySelectorAll('#navDots button')).findIndex(b => b.classList.contains('active')),
    fonts: Array.from(fonts),
  };
}
"""


def settle(page):
    """Wait for the smooth scroll to stop, then for the longest fade-in (0.75 s delay + 0.7 s) to finish."""
    last, stable = None, 0
    for _ in range(80):
        y = page.evaluate("window.scrollY")
        stable = stable + 1 if y == last else 0
        last = y
        if stable >= 5:
            break
        page.wait_for_timeout(80)
    page.wait_for_timeout(1700)


def main():
    problems = []
    text = DECK.read_text(encoding="utf-8")
    for ch, name in (("—", "em dash"), ("–", "en dash")):
        if ch in text:
            problems.append(f"file contains an {name} ({text.count(ch)}x)")
    report = {"deck": str(DECK), "viewport": [W, H], "slides": []}

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": W, "height": H}, device_scale_factor=1)
        page.add_init_script(
            "window.__fs = 0; const _rf = Element.prototype.requestFullscreen;"
            "Element.prototype.requestFullscreen = function(){ window.__fs++; try { return _rf.apply(this, arguments).catch(()=>{}); } catch(e) { return Promise.resolve(); } };"
        )
        errors = []
        page.on("pageerror", lambda e: errors.append(str(e)))
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.goto(DECK.as_uri(), wait_until="networkidle")
        page.evaluate("document.fonts.ready")
        report["title"] = page.title()
        report["fonts_loaded"] = page.evaluate(
            "['Playfair Display','DM Sans','JetBrains Mono'].map(f => [f, document.fonts.check('700 20px \"'+f+'\"')])")
        for fam, ok in report["fonts_loaded"]:
            if not ok:
                problems.append(f"web font not loaded: {fam}")
        count = page.evaluate("document.querySelectorAll('.slide').length")
        report["slide_count"] = count
        if count != EXPECTED_SLIDES:
            problems.append(f"expected {EXPECTED_SLIDES} slides, found {count}")
        dots = page.evaluate("document.querySelectorAll('#navDots button').length")
        if dots != count:
            problems.append(f"nav dots {dots} != slides {count}")

        for i in range(count):
            key = None
            if i > 0:
                key = NEXT_KEYS[(i - 1) % len(NEXT_KEYS)]
                page.keyboard.press(key)
            settle(page)
            m = page.evaluate(MEASURE_JS, i)
            m["key"] = key
            tag = f"slide {i + 1:02d}"
            if m["scrollY"] != i * H or m["top"] != 0:
                problems.append(f"{tag}: key {key!r} did not land on the slide (scrollY {m['scrollY']}, top {m['top']})")
            if abs(m["height"] - H) > 0.5:
                problems.append(f"{tag}: slide height {m['height']} is not the viewport height {H}")
            if m["notShown"]:
                problems.append(f"{tag}: {m['notShown']} fade-in element(s) not visible")
            if m["pastLimit"]:
                problems.append(f"{tag}: text past the left 68vw: {m['pastLimit'][:3]}")
            if m["underCam"]:
                problems.append(f"{tag}: text under the webcam box: {m['underCam'][:3]}")
            if m["offSlide"]:
                problems.append(f"{tag}: text outside the slide: {m['offSlide'][:3]}")
            if m["clipped"]:
                problems.append(f"{tag}: clipped content: {m['clipped'][:3]}")
            if m["activeDot"] != i:
                problems.append(f"{tag}: active nav dot is {m['activeDot']}")
            page.screenshot(path=str(HERE / f"slide-{i + 1:02d}.png"))
            report["slides"].append(m)

        # past the last slide the next key must stay on the last slide
        page.keyboard.press("ArrowRight"); settle(page)
        if page.evaluate("Math.round(window.scrollY)") != (count - 1) * H:
            problems.append("next key on the last slide moved the page")
        # back key
        page.keyboard.press("ArrowLeft"); settle(page)
        back_ok = page.evaluate("Math.round(window.scrollY)") == (count - 2) * H
        page.keyboard.press("ArrowUp"); settle(page)
        back_ok = back_ok and page.evaluate("Math.round(window.scrollY)") == (count - 3) * H
        report["back_keys_ok"] = back_ok
        if not back_ok:
            problems.append("back keys (ArrowLeft / ArrowUp) did not go back one slide each")
        # G = webcam guide box
        page.keyboard.press("g"); page.wait_for_timeout(200)
        g_on = page.evaluate("getComputedStyle(document.getElementById('pip-zone')).display") == "flex"
        page.keyboard.press("ArrowRight"); settle(page)
        page.keyboard.press("ArrowRight"); settle(page)
        page.screenshot(path=str(HERE / "helper-guide.png"))
        page.keyboard.press("G"); page.wait_for_timeout(200)
        g_off = page.evaluate("getComputedStyle(document.getElementById('pip-zone')).display") == "none"
        report["guide_key_ok"] = g_on and g_off
        if not (g_on and g_off):
            problems.append(f"G key: guide on={g_on} off={g_off}")
        # F = fullscreen (headless cannot enter it; the helper must at least ask for it)
        page.keyboard.press("f"); page.wait_for_timeout(200)
        report["fullscreen_requests"] = page.evaluate("window.__fs")
        if report["fullscreen_requests"] != 1:
            problems.append(f"F key asked for fullscreen {report['fullscreen_requests']} times, expected 1")
        report["page_errors"] = errors
        if errors:
            problems.append(f"page errors: {errors[:3]}")
        browser.close()

    report["problems"] = problems
    (HERE / "report.json").write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    for m in report["slides"]:
        print(f"{m['id']:>5}  key={m['key']!r:<12} y={m['scrollY']:<6} h={m['height']:<7} text x {m['textBox'][0]}..{m['textBox'][2]}"
              f" y {m['textBox'][1]}..{m['textBox'][3]}  | {m['eyebrow']} | {m['headline']!r}")
    print("title:", report["title"], "| fonts:", report["fonts_loaded"], "| back keys:", report.get("back_keys_ok"),
          "| G:", report.get("guide_key_ok"), "| F requests:", report.get("fullscreen_requests"))
    print("PROBLEMS:" if problems else "ALL CHECKS PASS")
    for p in problems:
        print("  -", p)
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
