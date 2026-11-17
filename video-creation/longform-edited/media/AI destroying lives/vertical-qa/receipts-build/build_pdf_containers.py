"""C34 + R-IZA vertical: the PDFs have no mobile reflow, so each is a CODE CONTAINER (locked stylesheet, 1080x1920) quoting the
document's own text, pulled from the PDF text layer by code (never retyped)."""
import re, io, html
from pathlib import Path
import fitz
from PIL import Image
from playwright.sync_api import sync_playwright

HERE = Path(__file__).parent
SRC = (HERE / "../../assets/vertical/slide-sources/containers.html").resolve()
OUT = (HERE / "../../assets/vertical/receipts").resolve()
raw = SRC.read_text(encoding="utf-8")
css = "\n".join(re.findall(r"<style>(.*?)</style>", raw, re.S))
link = re.search(r"<link[^>]*fonts.googleapis[^>]*>", raw).group(0)
fix = lambda s: re.sub(r"\s+", " ", s.replace("\ufffd", "\u2019")).strip()

# ---- C34: Quinnipiac page 4 ----
qu = fitz.open(HERE / "pdf_dl/qu.pdf")
p4 = qu[3].get_text()
m = re.search(r"[\u201c\u201d\ufffd\"](Americans are more worried.*?workplace,)[\u201c\u201d\ufffd\"]\s*added\s*Triantoro", p4, re.S)
quote = fix(m.group(1)).replace("\u2019", "'")           # inner text has no apostrophes; guard anyway
assert "losing end" in quote and quote.endswith("workplace,"), quote
# kept verbatim: the source closes the quote after a comma ("..., added Triantoro")
who = fix(re.search(r"(Ph\.D\., Associate Professor of Business Analytics and Information Systems, Quinnipiac University School of Business)\.", re.sub(r"\s+", " ", p4)).group(1))
assert "Associate Professor" in who
p3 = qu[2].get_text()
name = re.search(r"said (Tamilla Triantoro),", p3).group(1)
p1 = qu[0].get_text()
rel = re.search(r"FOR RELEASE: ([A-Z]+ \d+, \d{4})", p1).group(1).title()        # March 30, 2026
title = fix(re.search(r"(THE AGE OF ARTIFICIAL INTELLIGENCE:.*?SOUR,)", p1, re.S).group(1)).rstrip(",")
title = title.title().replace("Ai", "AI").replace("Age Of", "Age of").replace("Americans\u2019 AI Use Increases While Views On It Sour", "Americans\u2019 AI use increases while views on it sour")
print("C34:", rel, "|", title, "|", name, "|", who); print(quote)

# ---- R-IZA: page 1 title block ----
iz = fitz.open(HERE / "pdf_dl/iza.pdf")
t1 = iz[0].get_text()
dp = re.search(r"IZA DP No\. \d+", t1).group(0)
ttl = fix(re.search(r"Werner\s*(Automatability.*?Train)", t1, re.S).group(1))
authors = ["Philipp Lergetporer", "Katharina Wedel", "Katharina Werner"]
for a in authors: assert a in t1
date = re.search(r"(DECEMBER 2023)", t1).group(1).title()
print("IZA:", dp, "|", ttl, "|", date)

def mono_nums(s):  # every number/date in JetBrains Mono per the stylesheet
    return re.sub(r"(\d[\d,.]*)", r'<span class="mono">\1</span>', html.escape(s, quote=False))

page_css = """
body{margin:0;background:#04060d}
.frame{width:1080px;height:1920px;padding:0 52px;justify-content:center}
.card{padding:72px 68px 70px}
.card .ey{font-size:30px;margin-bottom:34px;line-height:1.5}
.q{font:700 62px/1.28 'Playfair Display',serif;letter-spacing:-.01em;color:var(--text-primary)}
.who{font:600 40px/1.35 'DM Sans';color:var(--text-primary);margin:0;padding:0;border:0}
.who2{font:500 33px/1.45 'DM Sans';color:var(--text-secondary);margin-top:10px}
.src{font:500 29px/1.5 'DM Sans';color:var(--text-muted);margin-top:46px;letter-spacing:.01em}
.src b{color:var(--text-secondary);font-weight:600}
.dp{font:600 40px/1.2 'JetBrains Mono';color:var(--accent-cyan);letter-spacing:.04em;margin-bottom:26px}
.tt{text-wrap:balance;font:900 80px/1.1 'Playfair Display',serif;letter-spacing:-.02em;color:var(--text-primary)}
.au{font:600 44px/1.5 'DM Sans';color:var(--text-primary)}
.dt{font:600 36px/1.3 'JetBrains Mono';color:var(--text-muted);margin-top:34px}
.divider{margin:44px 0}
"""
ORBS = '<div class="orb" style="width:760px;height:760px;right:-200px;top:-260px;background:#00c2ff"></div><div class="orb" style="width:620px;height:620px;left:-240px;bottom:-280px;background:#00e68a;opacity:.18"></div>'
C34 = f"""<div class="card"><div class="top"></div><div class="ey">Quinnipiac University Poll, released {mono_nums(rel)}</div>
<div class="q">\u201c{html.escape(quote, quote=False)}\u201d</div><div class="divider"></div>
<div class="who"><span style="color:var(--text-secondary);font-weight:500">added</span> {html.escape(name)}, Ph.D.</div><div class="who2">{html.escape(who.replace('Ph.D., ', ''))}</div>
<div class="src"><b>Quinnipiac University Poll on AI</b>, page {mono_nums('4')}<br>{html.escape(title)}</div></div>"""
IZA = f"""<div class="card"><div class="top"></div><div class="ey">IZA Institute of Labor Economics<br>Discussion Paper Series</div>
<div class="dp">{html.escape(dp)}</div><div class="tt">{html.escape(ttl)}</div><div class="divider"></div>
<div class="au">{'<br>'.join(authors)}</div><div class="dt">{html.escape(date.upper())}</div>
<div class="src">Page {mono_nums('1')} of the paper, docs.iza.org</div></div>"""

JOBS = [("C34-quinnipiac-poll", C34), ("R-IZA-dp16687", IZA)]
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    pg = b.new_page(viewport={"width": 1080, "height": 1920}, device_scale_factor=2)
    for name_, body in JOBS:
        doc = f'<!doctype html><html><head><meta charset=utf-8>{link}<style>{css}</style><style>{page_css}</style></head><body><div class="frame" id="f">{ORBS}{body}</div></body></html>'
        f = HERE / f"_{name_}.html"; f.write_text(doc, encoding="utf-8")
        pg.goto(f.as_uri(), wait_until="networkidle"); pg.evaluate("document.fonts.ready"); pg.wait_for_timeout(800)
        box = pg.evaluate("(() => { const c = document.querySelector('.card').getBoundingClientRect(); return [c.top, c.bottom, c.left, c.right]; })()")
        print(name_, "card box", [round(v) for v in box])
        im = Image.open(io.BytesIO(pg.locator('#f').screenshot())).convert("RGB").resize((1080, 1920), Image.LANCZOS)
        im.save(OUT / f"{name_}.png"); print("OK", name_, im.size)
    b.close()
