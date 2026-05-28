"""
gen-images-k3d.py
Generate b-roll images for the Kaspa3Dollar short via ChatGPT DALL-E in the browser.
Saves PNGs to video-creation/assets/.

Images to generate:
  1. k3d-hook-bg.png  — Dark cinematic Kaspa coin background for the hook panel
  2. k3d-100b-bg.png  — Abstract market cap / money growth visual for the $100B panel

Usage:
    python gen-images-k3d.py
"""

import time, os, requests, re
from pathlib import Path
from playwright.sync_api import sync_playwright

ASSETS = Path(__file__).parent / "assets"
ASSETS.mkdir(exist_ok=True)

IMAGES = [
    {
        "filename": "k3d-hook-bg.png",
        "prompt": (
            "Cinematic dark background, teal/cyan glowing Kaspa cryptocurrency coin "
            "(hexagonal shape, the letter K inside glowing), floating in space with "
            "distant stars, neon teal light rays, deep black background, no text, "
            "ultra-wide cinematic crop, 16:9 aspect ratio, dramatic lighting, "
            "crypto art poster aesthetic"
        ),
    },
    {
        "filename": "k3d-100b-bg.png",
        "prompt": (
            "Abstract dark background, glowing orange and teal data streams, "
            "rising bar chart silhouette in neon orange, dramatic upward momentum, "
            "market cap growth visualization, no text, no numbers, pure abstract, "
            "16:9 wide crop, crypto bull run aesthetic, professional dark theme"
        ),
    },
]


def generate_images():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=200)
        context = browser.new_context(
            storage_state="C:/Users/mnede/AppData/Local/ms-playwright/chatgpt_auth.json"
            if Path("C:/Users/mnede/AppData/Local/ms-playwright/chatgpt_auth.json").exists()
            else None,
            viewport={"width": 1280, "height": 900},
        )
        page = context.new_page()

        print("[1] Opening ChatGPT...")
        page.goto("https://chatgpt.com", timeout=30000)
        page.wait_for_load_state("networkidle", timeout=20000)
        time.sleep(3)

        for i, img in enumerate(IMAGES):
            print(f"\n[{i+2}] Generating: {img['filename']}")
            print(f"     Prompt: {img['prompt'][:80]}...")

            # Start a new chat for each image
            if i > 0:
                # Click "New Chat" button
                try:
                    page.click("a[href='/']", timeout=5000)
                    time.sleep(2)
                except Exception:
                    page.goto("https://chatgpt.com", timeout=20000)
                    time.sleep(3)

            # Find the message input
            textarea = page.locator("textarea, [contenteditable='true']").first
            textarea.click()
            time.sleep(0.5)

            # Type the prompt
            textarea.fill(img["prompt"])
            time.sleep(0.5)

            # Submit
            page.keyboard.press("Enter")
            print("     Waiting for image generation (up to 90s)...")

            # Wait for the generated image to appear
            img_locator = page.locator("img[alt*='Generated'], img[class*='dalle'], .generated-image img, article img").first
            try:
                img_locator.wait_for(state="visible", timeout=90000)
            except Exception:
                # Fallback: look for any image that appeared after sending
                time.sleep(30)
                img_locator = page.locator("article img, .message img").last

            time.sleep(2)

            # Get image src
            try:
                src = img_locator.get_attribute("src")
                if src and src.startswith("http"):
                    print(f"     Downloading from: {src[:60]}...")
                    resp = requests.get(src, timeout=30)
                    out_path = ASSETS / img["filename"]
                    out_path.write_bytes(resp.content)
                    print(f"     Saved: {out_path}")
                else:
                    # Try to find image via download button
                    print("     No direct src — trying download button...")
                    page.locator("button[aria-label*='download'], button[aria-label*='Download']").first.click(timeout=5000)
                    time.sleep(5)
                    print("     Check your Downloads folder and copy to assets/ manually.")
            except Exception as e:
                print(f"     Could not auto-download: {e}")
                print(f"     Please manually save the image as assets/{img['filename']}")
                input("     Press Enter when saved and ready for next image...")

        print("\n[Done] All images generated.")
        print("Images saved to:", ASSETS)
        input("Press Enter to close browser...")
        browser.close()


if __name__ == "__main__":
    generate_images()
