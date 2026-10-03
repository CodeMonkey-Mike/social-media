# Diagnostic (2026-09-10): what happens at SEND in a FRESH chat with a reference attached.
# Opens the generator's profile, uploads the V4 slide reference, types the real prompt for
# the failing slide, presses Enter, then every 5 s for 60 s prints: URL, whether the user
# message shows in the thread, any dialog/toast text, composer text, and takes a screenshot.
import json, sys, time
from pathlib import Path
sys.path.insert(0, r"C:\Users\mnede\Documents\Claude\social-media\repurpose")
from gen_images import PROFILE_DIR, COMPOSER_SEL, composer_loaded, dismiss_dialog, upload_ref
from playwright.sync_api import sync_playwright

item = json.loads(Path(r"C:\Users\mnede\Documents\Claude\social-media\repurpose\output\kaspa-lane3-fix\item-aa13fcdf.json").read_text(encoding="utf-8"))[0]
OUT = Path(r"C:\Users\mnede\Documents\Claude\social-media\repurpose\output\kaspa-lane3-fix\probe_send")
OUT.mkdir(exist_ok=True)
STATE_JS = r"""
() => {
  const q = s => Array.from(document.querySelectorAll(s));
  const dialogs = q('[role="dialog"], [role="alertdialog"]').map(d => d.innerText.trim().slice(0, 200));
  const toasts = q('[role="status"], [role="alert"], [data-testid*="toast"]').map(d => d.innerText.trim().slice(0, 200)).filter(Boolean);
  const userMsgs = q('[data-message-author-role="user"]').length;
  const asstMsgs = q('[data-message-author-role="assistant"]').length;
  const comp = document.querySelector('#prompt-textarea');
  const send = document.querySelector('button[data-testid="send-button"], button[aria-label*="Send"]');
  const stop = document.querySelector('button[data-testid="stop-button"], button[aria-label*="Stop"]');
  const attach = q('[data-testid*="attachment"], img[alt*="Uploaded"], [aria-label*="Remove file"]').length;
  return { url: location.href, userMsgs, asstMsgs, dialogs, toasts, composer: comp ? comp.innerText.trim().slice(0, 60) : null,
           sendDisabled: send ? send.disabled : null, stopVisible: !!stop, attachments: attach,
           bodyHints: (document.body.innerText.match(/(limit|try again|upgrade|something went wrong|unable|temporary chat)[^\n]{0,80}/gi) || []).slice(0, 5) };
}
"""
with sync_playwright() as p:
    b = p.chromium.launch_persistent_context(PROFILE_DIR, channel="chrome", headless=False,
        ignore_default_args=["--enable-automation"], args=["--disable-blink-features=AutomationControlled"], no_viewport=True)
    b.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    page = b.new_page(); page.goto("https://chatgpt.com/"); page.wait_for_load_state("domcontentloaded")
    print("composer loaded:", composer_loaded(page, 30000)); page.wait_for_timeout(3000); dismiss_dialog(page)
    print("STATE before:", json.dumps(page.evaluate(STATE_JS))[:600])
    c = page.locator(COMPOSER_SEL).first; c.click(); page.wait_for_timeout(500)
    print("upload ref:", upload_ref(page, item["ref"])); page.wait_for_timeout(5000)
    print("STATE after upload:", json.dumps(page.evaluate(STATE_JS))[:600])
    c = page.locator(COMPOSER_SEL).first; c.click(); page.keyboard.press("Control+A"); page.keyboard.press("Delete"); page.wait_for_timeout(300)
    c.click(); page.keyboard.press("End")
    page.keyboard.type(item["prompt"], delay=12)
    page.wait_for_timeout(1500)
    got = " ".join(page.locator(COMPOSER_SEL).first.inner_text().split()); want = " ".join(item["prompt"].split())
    print("composer == prompt:", got == want, "| len", len(got), "/", len(want))
    page.screenshot(path=str(OUT / "0_before_enter.png"))
    page.keyboard.press("Enter")
    t0 = time.time()
    for i in range(12):
        page.wait_for_timeout(5000)
        st = page.evaluate(STATE_JS)
        print(f"+{int(time.time()-t0):3d}s", json.dumps(st)[:700])
        page.screenshot(path=str(OUT / f"{i+1}_after_{int(time.time()-t0)}s.png"))
        if st.get("asstMsgs", 0) > 0 and not st.get("stopVisible"):
            break
    print("final url:", page.url)
    b.close()
print("PROBE DONE")
