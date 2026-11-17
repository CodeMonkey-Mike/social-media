from rc_lib import *
import re
URLS = {
 "S-1":     "https://www.sec.gov/Archives/edgar/data/2130357/000162828026067168/anthropicpbc-sx1.htm",
 "S-1/A2":  "https://www.sec.gov/Archives/edgar/data/2130357/000162828026072484/anthropicpbc-sx1ax2.htm",
}
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(user_agent=UA, locale="en-US")
    for k, u in URLS.items():
        t0 = time.time()
        r = ctx.request.get(u, timeout=180000)
        txt = r.text()
        print(f"== {k} status {r.status} bytes {len(txt):,} in {time.time()-t0:.0f}s | content-type {r.headers.get('content-type')}")
        print("   head:", re.sub(r"\s+"," ",re.sub(r"<[^>]+>"," ",txt[:3000]))[:300])
        plain = re.sub(r"\s+"," ",re.sub(r"<[^>]+>"," ",txt)).replace("&#8221;",'"').replace("&#8220;",'"')
        for needle in ["contributions to our codebase", "written by Claude"]:
            for m in list(re.finditer(re.escape(needle), plain))[:4]:
                print(f"   [{needle}] ...{plain[max(0,m.start()-230):m.end()+160]}...")
        m = re.search(r"As filed with the Securities and Exchange Commission on ([A-Za-z]+ \d+, \d{4})", plain)
        print("   filed:", m.group(0) if m else "?")
    # filing index for newer amendments
    for idx in ["https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=2130357&type=S-1&dateb=&owner=include&count=40",
                "https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=2130357&owner=include&count=40"]:
        r = ctx.request.get(idx, timeout=60000)
        print("== index", r.status, len(r.text()))
        t = re.sub(r"\s+"," ",re.sub(r"<[^>]+>"," ",r.text()))
        print("  ", t[:1500])
    b.close()
