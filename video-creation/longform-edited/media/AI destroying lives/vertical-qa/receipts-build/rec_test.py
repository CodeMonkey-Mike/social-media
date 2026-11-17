import time, sys, shutil
from pathlib import Path
from playwright.sync_api import sync_playwright
import rc
UA = rc.UA
url = sys.argv[1]; tag = sys.argv[2]; dsf = float(sys.argv[3]) if len(sys.argv) > 3 else 1
with sync_playwright() as p:
    b = p.chromium.launch(headless=True, channel="chrome")
    ctx = b.new_context(viewport={"width": 390, "height": 693}, device_scale_factor=dsf, is_mobile=True, has_touch=True, user_agent=UA,
                        record_video_dir=f"rec/{tag}", record_video_size={"width": 1080, "height": 1920})
    pg = ctx.new_page()
    pg.goto(url, wait_until="domcontentloaded", timeout=90000)
    time.sleep(6)
    print(pg.title(), pg.evaluate("document.documentElement.scrollHeight"))
    pg.screenshot(path=f"rec/{tag}-shot.png")
    ctx.close(); b.close()
print(list(Path(f"rec/{tag}").glob("*.webm")))
