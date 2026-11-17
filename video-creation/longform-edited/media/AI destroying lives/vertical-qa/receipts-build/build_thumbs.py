"""R-THUMB1/2 vertical: the maxres thumbnail + exact title + date, on the locked container stylesheet, 1080x1920."""
import re, io, json
from pathlib import Path
from PIL import Image
from playwright.sync_api import sync_playwright

HERE = Path(__file__).parent
SRC = (HERE / "../../assets/vertical/slide-sources/containers.html").resolve()
OUT = (HERE / "../../assets/vertical/receipts").resolve()
css = "\n".join(re.findall(r"<style>(.*?)</style>", SRC.read_text(encoding="utf-8"), re.S))
head = SRC.read_text(encoding="utf-8")
link = re.search(r"<link[^>]*fonts.googleapis[^>]*>", head).group(0)

CARDS = [
 ("R-THUMB1-literally-every-job", "dKwFdQMXv-c", "Literally Every Job Is at Risk. Here's How to Protect Yourself", "October <span class=mono>8</span>, <span class=mono>2026</span>", "My video, <span class=mono>8</span> October"),
 ("R-THUMB2-wipe-these-jobs-out", "Ccriu5vuxf8", "\U0001F6A8 AI Will Wipe These Jobs Out Next", "October <span class=mono>27</span>, <span class=mono>2026</span>", "My video, <span class=mono>27</span> October"),
]
page_css = """
body{margin:0;background:#04060d}
.frame{width:1080px;height:1920px;padding:0 40px;justify-content:center}
.card{padding:56px 44px 60px}
.big .th{border-radius:18px}
.big .tt{text-wrap:balance;font:700 56px/1.22 'DM Sans';color:var(--text-primary);margin-top:40px}
.big .dt{font:500 34px/1.3 'DM Sans';color:var(--text-muted);margin-top:18px}
.big .ey{margin-bottom:34px;font-size:30px}
.big .tile{flex:none;width:100%}
"""
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    pg = b.new_page(viewport={"width": 1080, "height": 1920}, device_scale_factor=2)
    for name, vid, title, date, ey in CARDS:
        img = (HERE / f"thumbs/{vid}.jpg").resolve().as_uri()
        html = f"""<!doctype html><html><head><meta charset=utf-8>{link}<style>{css}</style><style>{page_css}</style></head><body>
<div class="frame big" id="f"><div class="orb" style="width:760px;height:760px;right:-200px;top:-260px;background:#00c2ff"></div><div class="orb" style="width:620px;height:620px;left:-240px;bottom:-280px;background:#00e68a;opacity:.18"></div>
<div class="card"><div class="top"></div><div class="ey">{ey}</div><div class="tile"><div class="th"><img src="{img}"></div><div class="tt">{title}</div><div class="dt">{date}</div></div></div></div></body></html>"""
        f = HERE / f"_{name}.html"; f.write_text(html, encoding="utf-8")
        pg.goto(f.as_uri(), wait_until="networkidle"); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(800)
        png = pg.locator("#f").screenshot()
        im = Image.open(io.BytesIO(png)).convert("RGB").resize((1080, 1920), Image.LANCZOS)
        im.save(OUT / f"{name}.png"); print("OK", name, im.size)
    b.close()
