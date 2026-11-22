# _diag_bitchute_thumb.py <video.mp4> — READ-ONLY diagnostic.
# Opens the BitChute upload page, attaches a video, and dumps every file input
# + thumbnail-area control so we can find the custom-thumbnail upload selector.
# Does NOT proceed/publish — closes the upload tab without submitting (an abandoned
# upload page leaves no draft on BitChute).
# (Python port of _diag-bitchute-thumb.js, 2026-11-22; the JS file is deleted. The JS
#  hardcoded one clip's path; the video to attach is now the first argument.)
#
# Usage:  python scripts/_diag_bitchute_thumb.py "<path to any short .mp4>"
import json
import sys
from pathlib import Path

from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\bitchutebot-profile"
BITCHUTE_HOME = "https://www.bitchute.com/"

LOGGED_IN_JS = ("() => !![...document.querySelectorAll('button')]"
                ".find(b => b.innerText?.trim().includes('video_call'))")

DUMP_JS = r"""
() => {
  const out = { fileInputs: [], buttons: [], thumbMentions: [] };
  document.querySelectorAll('input[type="file"]').forEach((el, i) => {
    const r = el.getBoundingClientRect();
    out.fileInputs.push({
      i, accept: el.accept || '', name: el.name || '', id: el.id || '',
      cls: el.className || '', hidden: el.offsetParent === null,
      rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
    });
  });
  [...document.querySelectorAll('button')].forEach(b => {
    const t = (b.innerText || '').trim();
    if (t) out.buttons.push({ text: t.slice(0, 40), id: b.id || '', cls: (b.className || '').slice(0, 60) });
  });
  // Any element mentioning thumbnail / cover / image upload
  [...document.querySelectorAll('*')].forEach(el => {
    const t = (el.childNodes.length === 1 && el.textContent || '').trim();
    if (/thumbnail|cover image|upload.*image|custom.*thumb/i.test(t) && t.length < 60) {
      out.thumbMentions.push({ tag: el.tagName, text: t, cls: (el.className || '').toString().slice(0, 50) });
    }
  });
  return out;
}
"""


def main(video):
    with sync_playwright() as p:
        context = p.chromium.launch_persistent_context(
            CHROME_PROFILE,
            channel="chrome",
            headless=False,
            slow_mo=50,
            ignore_default_args=["--enable-automation"],
            args=["--disable-blink-features=AutomationControlled"],
            no_viewport=True,
        )
        page = context.pages[0] if context.pages else context.new_page()
        try:
            page.goto(BITCHUTE_HOME, wait_until="domcontentloaded")
            page.wait_for_timeout(2000)
            print("Waiting for upload icon (login)...", flush=True)
            page.wait_for_function(LOGGED_IN_JS, timeout=600000)
            print("Logged in ✓")
            page.wait_for_timeout(1000)

            page.locator('button:has-text("video_call")').first.evaluate("el => el.click()")
            page.wait_for_timeout(800)
            upload_video_el = page.get_by_text("Upload Video", exact=True).first
            with context.expect_page(timeout=15000) as up_info:
                upload_video_el.evaluate("el => el.click()")
            up = up_info.value
            up.wait_for_load_state("domcontentloaded")
            print("Upload page:", up.url)
            up.wait_for_timeout(2500)

            # Attach video so the thumbnail UI renders
            vin = up.locator('input[type="file"]').nth(0)
            vin.wait_for(state="attached", timeout=20000)
            vin.set_input_files(video)
            print("Video attached. Waiting for thumbnail UI...", flush=True)
            up.wait_for_timeout(6000)

            d = up.evaluate(DUMP_JS)
            print("\n=== FILE INPUTS ===")
            for f in d["fileInputs"]:
                print(json.dumps(f, ensure_ascii=False))
            print("\n=== BUTTONS ===")
            for b in d["buttons"]:
                print(json.dumps(b, ensure_ascii=False))
            print("\n=== THUMBNAIL MENTIONS ===")
            for m in d["thumbMentions"]:
                print(json.dumps(m, ensure_ascii=False))

            print("\nClosing upload tab WITHOUT proceeding (no draft).")
            up.close()
        except Exception as e:
            print(f"Diag error: {e}", file=sys.stderr)
        finally:
            context.close()


if __name__ == "__main__":
    if len(sys.argv) < 2 or not Path(sys.argv[1]).is_file():
        print('usage: python scripts/_diag_bitchute_thumb.py "<path to any short .mp4>"',
              file=sys.stderr)
        sys.exit(1)
    main(str(Path(sys.argv[1]).resolve()))
