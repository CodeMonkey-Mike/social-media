# Diagnostic (2026-09-10): can a rendered image be pulled through the backend API without
# the DOM? Reads a conversation, finds assistant/tool image_asset_pointer parts, resolves the
# file id and asks /backend-api/files/<id>/download for a signed URL. Downloads nothing to
# the images tree; prints shapes only.
import json, sys
sys.path.insert(0, r"C:\Users\mnede\Documents\Claude\social-media\repurpose")
from gen_images import PROFILE_DIR
from playwright.sync_api import sync_playwright

JS = r"""
async (convId) => {
  const s = await fetch('/api/auth/session', { credentials: 'include' }).then(x => x.ok ? x.json() : null).catch(() => null);
  const tok = s && s.accessToken; if (!tok) return { error: 'no token' };
  const H = { Authorization: 'Bearer ' + tok, 'Content-Type': 'application/json' };
  const g = await fetch('/backend-api/conversation/' + convId, { credentials: 'include', headers: H });
  if (!g.ok) return { error: 'conversation HTTP ' + g.status };
  const c = await g.json();
  const msgs = Object.values(c.mapping || {}).map(n => n.message).filter(Boolean).sort((a, b) => (a.create_time || 0) - (b.create_time || 0));
  const found = [];
  for (const m of msgs) {
    const parts = (m.content && m.content.parts) || [];
    for (const p of parts) {
      if (p && typeof p === 'object' && p.content_type === 'image_asset_pointer') {
        found.push({ role: m.author && m.author.role, asset_pointer: p.asset_pointer, size_bytes: p.size_bytes, w: p.width, h: p.height, meta_keys: Object.keys(p.metadata || {}) });
      }
    }
  }
  const out = { title: c.title, n_msgs: msgs.length, images: found, download: [] };
  for (const f of found) {
    const id = (f.asset_pointer || '').split('://')[1] || f.asset_pointer;
    const d = await fetch('/backend-api/files/' + id + '/download', { credentials: 'include', headers: H });
    let body = null; try { body = await d.json(); } catch (e) { body = { text: (await d.text()).slice(0, 200) }; }
    out.download.push({ id, status: d.status, keys: Object.keys(body || {}), has_url: !!(body && (body.download_url || body.url)), file_name: body && body.file_name });
  }
  return out;
}
"""
conv = sys.argv[1]
with sync_playwright() as p:
    b = p.chromium.launch_persistent_context(PROFILE_DIR, channel="chrome", headless=False,
        ignore_default_args=["--enable-automation"], args=["--disable-blink-features=AutomationControlled"], no_viewport=True)
    b.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    page = b.new_page(); page.goto("https://chatgpt.com/"); page.wait_for_load_state("domcontentloaded"); page.wait_for_timeout(3000)
    print(json.dumps(page.evaluate(JS, conv), indent=1, ensure_ascii=False))
    b.close()
print("PROBE DONE")
