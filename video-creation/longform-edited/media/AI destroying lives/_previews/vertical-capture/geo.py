import sys
sys.path.insert(0,'.')
from receipts_run import *
import json
spec = json.loads(sys.argv[1])   # {"name":..., "url":..., "ranges":[[a,b],...], "click":"text"}
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel='chrome')
    ctx, page = load(b, spec["url"], wait=4500)
    print(prep(page))
    if spec.get("click"):
        page.get_by_text(spec["click"], exact=True).first.click(); time.sleep(1.5)
    print("height", page.evaluate("document.documentElement.scrollHeight"))
    for a,z in spec["ranges"]:
        print("--", a, z); dump(page, a, z)
    ctx.close(); b.close()
