"""Generate b-roll images for the Toccata short."""
import time, os, requests
from pathlib import Path
from playwright.sync_api import sync_playwright

ASSETS = Path(__file__).parent / "assets"

IMAGES = [
    {
        "filename": "toccata-hook-bg.png",
        "prompt": (
            "Cinematic dark background, glowing teal/cyan Kaspa network nodes connected by "
            "light streams, blockchain upgrade visual, deep black background, no text, "
            "16:9 wide crop, dramatic neon teal lighting, crypto technology art poster aesthetic, "
            "nodes upgrading into a bigger network, epic scale"
        ),
    },
    {
        "filename": "toccata-covenant-bg.png",
        "prompt": (
            "Dark background, a glowing teal/cyan coin floating in space with a chain of "
            "glowing rules/contracts attached to it, the coin has a K symbol, "
            "neon teal light, dark moody atmosphere, no text, abstract crypto concept art, "
            "16:9 wide cinematic crop, ultra-detailed, dramatic lighting"
        ),
    },
]


def generate():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=150)
        ctx = browser.new_context(viewport={"width": 1280, "height": 900})
        page = ctx.new_page()
        page.goto("https://chatgpt.com", timeout=30000)
        page.wait_for_load_state("networkidle", timeout=20000)
        time.sleep(3)

        for i, img in enumerate(IMAGES):
            print(f"\n[{i+1}/{len(IMAGES)}] {img['filename']}")
            if i > 0:
                try:
                    page.click("a[href='/']", timeout=4000)
                    time.sleep(2)
                except Exception:
                    page.goto("https://chatgpt.com")
                    time.sleep(3)

            ta = page.locator("textarea, [contenteditable='true']").first
            ta.click()
            ta.fill(img["prompt"])
            page.keyboard.press("Enter")
            print("  Waiting for image (up to 90s)...")

            try:
                img_el = page.locator("article img").last
                img_el.wait_for(state="visible", timeout=90000)
                time.sleep(2)
                src = img_el.get_attribute("src")
                if src and src.startswith("http"):
                    data = requests.get(src, timeout=30).content
                    out = ASSETS / img["filename"]
                    out.write_bytes(data)
                    print(f"  Saved: {out}")
                else:
                    raise ValueError("no http src")
            except Exception as e:
                print(f"  Auto-download failed ({e}). Save manually as assets/{img['filename']}")
                input("  Press Enter when saved...")

        print("\nDone. Closing browser.")
        browser.close()


if __name__ == "__main__":
    generate()
