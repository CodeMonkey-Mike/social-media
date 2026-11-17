"""C6 vertical: the SEC filing is a print-layout conversion (816 px fixed page, every line absolutely positioned) with NO mobile reflow,
so per vertical-repurpose.md section 1 both views are rebuilt as code containers quoting the live filing text (asserted verbatim)."""
from vlib import *
import html as H
U = "https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm"
UA_D = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
SENT_KEY = "over 90% of the contributions to our codebase in September 2026 were written by Claude"
PAGE_TC = r"""(args)=>{ const [needle]=args; const norm=s=>s.replace(/\s+/g,' ');
  const pages=[...document.querySelectorAll('body div')].filter(d=>{const c=getComputedStyle(d);return c.position==='relative'&&c.width==='816px'});
  let idx=-1; for(let i=0;i<pages.length;i++){ if(norm(pages[i].textContent).includes(needle)){idx=i;break} }
  return {idx, n:pages.length, tc: norm(pages[idx].textContent)}; }"""
URL_SHOWN = "sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm"


def live_text():
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True, channel="chrome")
        ctx = b.new_context(viewport={"width": 1000, "height": 800}, device_scale_factor=1, user_agent=UA_D, locale="en-US")
        pg = ctx.new_page()
        pg.goto(U, wait_until="load", timeout=240000)
        time.sleep(8)
        ts = now()
        sp = pg.evaluate(PAGE_TC, [SENT_KEY])
        cov = pg.evaluate(PAGE_TC, ["FORM S-1"])
        b.close()
    return ts, sp, cov


ts, sp, cov = live_text()
print("live text captured", ts, "| sentence page idx", sp["idx"], "(printed page 136) | cover idx", cov["idx"])
T, C = sp["tc"], cov["tc"]
# ---- sentence page: heading + paragraph 1 (holds the sentence) + paragraph 2, sliced out of the live text
h0 = T.index("Operating Efficiency")
p1a = T.index("Our operating efficiency is derived")
p1b = T.index("December 31, 2024.") + len("December 31, 2024.")
p2a = T.index("From September 30, 2025 to September 30, 2026")
p2b = T.index("a culture built to compound it.") + len("a culture built to compound it.")
HEAD = T[h0:h0 + len("Operating Efficiency")]
P1 = T[p1a:p1b]
P2 = T[p2a:p2b]
SENT_FULL = "For example, over 90% of the contributions to our codebase in September 2026 were written by Claude."
assert SENT_FULL in P1 and "Table of Contents" in T and "136" in T
for s in (HEAD, P1, P2):
    assert "—" not in s and "–" not in s, "dash on screen"
print("P1:", P1[:80], "...", P1[-40:])
print("P2:", P2[:60], "...", P2[-40:])
# ---- cover: each title-block string must be in the live cover text
CV = ["As filed with the Securities and Exchange Commission on October 26, 2026.", "Registration No. 333-", "UNITED STATES",
      "SECURITIES AND EXCHANGE COMMISSION", "WASHINGTON, D.C. 20549", "FORM S-1", "REGISTRATION STATEMENT", "UNDER",
      "THE SECURITIES ACT OF 1933", "Anthropic, PBC", "(Exact name of registrant as specified in its charter)"]
for s in CV:
    assert s in C, "cover string not in live text: " + s
print("cover title-block strings all present verbatim in the live page:", len(CV))

CSS = """
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:1080px;height:1920px;background:#E4E4E4;overflow:hidden}
body{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:34px}
.url{font:600 24px/1.2 Arial,Helvetica,sans-serif;color:#5a5a5a;width:1000px;text-align:left;white-space:nowrap}
.sheet{width:1000px;background:#fff;border:2px solid #CCCCCC;box-shadow:0 3px 14px rgba(0,0,0,.14);color:#000}
"""
i_s = P1.index(SENT_FULL)
lead = "For example, "
rest = SENT_FULL[len("For example, over 90%"):]
SHEET_BODY = (
    "<style>" + CSS + """
.sheet.body{padding:44px 58px 52px;font-family:Georgia,'Times New Roman',serif}
.toc{font:700 27px/1 Georgia,serif;margin-bottom:46px}
h2{font:700 56px/1.15 Georgia,serif;margin-bottom:34px}
p{font:400 41px/1.43 Georgia,serif;text-align:left;margin-bottom:34px}
.pg{font:400 30px/1 Georgia,serif;text-align:center;margin-top:18px}
</style>
<div class="url">""" + URL_SHOWN + """</div>
<div class="sheet body" lang="en"><div class="toc">Table of Contents</div><h2>""" + H.escape(HEAD) + """</h2>
<p id="p1">""" + H.escape(P1[:i_s]) + '<span id="sent">' + H.escape(lead) + '<span id="over90">over 90%</span>' + H.escape(rest) + "</span>"
    + H.escape(P1[i_s + len(SENT_FULL):]) + """</p>
<p id="p2">""" + H.escape(P2) + """</p><div class="pg">136</div></div>""")
SHEET_COVER = (
    "<style>" + CSS + """
.sheet.cover{padding:54px 54px 62px;font-family:'Times New Roman',Times,serif;font-weight:700;text-align:center}
.top{font:700 37px/1.3 'Times New Roman',serif;text-align:center}
.reg{font:700 37px/1.3 'Times New Roman',serif;text-align:right;margin-top:6px;padding-bottom:16px;border-bottom:8px double #000}
.big{font:700 60px/1.22 'Times New Roman',serif}
.mid{font:700 42px/1.3 'Times New Roman',serif}
.it{font:italic 700 42px/1.3 'Times New Roman',serif}
.rule{width:300px;border-top:3px solid #000;margin:26px auto}
.co{font:700 92px/1.1 'Times New Roman',serif;margin-top:6px}
.cap{font:700 35px/1.3 'Times New Roman',serif;margin-top:14px}
</style>
<div class="url">""" + URL_SHOWN + """</div>
<div class="sheet cover"><div class="top">As filed with the Securities and Exchange Commission on October 26, 2026.</div><div class="reg">Registration No. 333-</div>
<div style="height:44px"></div><div class="big">UNITED STATES</div><div class="big">SECURITIES AND<br>EXCHANGE COMMISSION</div><div class="mid" style="margin-top:8px">WASHINGTON, D.C. 20549</div><div class="rule"></div>
<div class="big" style="margin-top:34px">FORM S-1</div><div class="big">REGISTRATION STATEMENT</div><div class="it" style="margin-top:10px">UNDER</div><div class="it">THE SECURITIES ACT OF 1933</div><div class="rule"></div>
<div class="co">Anthropic, PBC</div><div class="cap">(Exact name of registrant as specified in its charter)</div></div>""")


def render(inner, name, geo_js=None):
    OUT.mkdir(parents=True, exist_ok=True)
    f = HERE / (name + ".html")
    f.write_text("<!doctype html><html><head><meta charset='utf-8'></head><body>" + inner + "</body></html>", encoding="utf-8")
    with sync_playwright() as p:
        b = p.chromium.launch(headless=True, channel="chrome")
        ctx = b.new_context(viewport={"width": 1080, "height": 1920}, device_scale_factor=2, locale="en-US")
        pg = ctx.new_page()
        pg.goto(f.as_uri())
        time.sleep(1.0)
        geo = pg.evaluate(geo_js) if geo_js else None
        png = pg.screenshot()
        b.close()
    im = Image.open(io.BytesIO(png)).convert("RGB").resize((1080, 1920), Image.LANCZOS)
    path = OUT / (name + ".png")
    im.save(path)
    return path, geo


GEO_JS = """()=>{const rr=(el)=>{const out=[];for(const q of el.getClientRects())out.push({x:+q.x.toFixed(1),y:+q.y.toFixed(1),w:+q.width.toFixed(1),h:+q.height.toFixed(1)});return out};
  const s=document.getElementById('sent'), o=document.getElementById('over90'); const sh=document.querySelector('.sheet').getBoundingClientRect();
  return {sentence_line_rects:rr(s), over90_rects:rr(o), sheet:{x:sh.x,y:sh.y,w:sh.width,h:sh.height}}}"""
p1, geo = render(SHEET_BODY, "C6-sentence", GEO_JS)
print("sentence ->", p1, margin_check(p1))
print("geo", json.dumps(geo)[:400])
p2, _ = render(SHEET_COVER, "C6-cover")
print("cover ->", p2, margin_check(p2))
save_geo("C6-sentence", {"captured": ts, "type": "code container (filing has no mobile reflow)", "source": U, "printed_page": 136, "frame": "1080x1920 px", **geo})
save_geo("C6-cover", {"captured": ts, "type": "code container quoting the title block", "source": U})
