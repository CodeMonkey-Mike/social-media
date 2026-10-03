# Diagnostic (2026-09-10): what ChatGPT actually holds for the failing generations. Lists
# the newest conversations and prints the last assistant reply of each, via the backend
# API with the profile's session token. Sends nothing, changes nothing.
import json, sys
sys.path.insert(0, r"C:\Users\mnede\Documents\Claude\social-media\repurpose")
from gen_images import PROFILE_DIR
from playwright.sync_api import sync_playwright

JS = r"""
async (ids) => {
  const s = await fetch('/api/auth/session', { credentials: 'include' }).then(x => x.ok ? x.json() : null).catch(() => null);
  const tok = s && s.accessToken;
  if (!tok) return { error: 'no access token' };
  const H = { Authorization: 'Bearer ' + tok, 'Content-Type': 'application/json' };
  const out = { account: (s.user && s.user.email) || null, list: [], convs: [] };
  const l = await fetch('/backend-api/conversations?offset=0&limit=8&order=updated', { credentials: 'include', headers: H });
  out.list_status = l.status;
  if (l.ok) { const j = await l.json(); out.list = (j.items || []).map(it => ({ id: it.id, title: it.title, created: it.create_time, updated: it.update_time })); }
  const want = ids.length ? ids : out.list.slice(0, 3).map(x => x.id);
  for (const id of want) {
    const g = await fetch('/backend-api/conversation/' + id, { credentials: 'include', headers: H });
    if (!g.ok) { out.convs.push({ id, status: g.status }); continue; }
    const c = await g.json();
    const msgs = Object.values(c.mapping || {}).map(n => n.message).filter(Boolean)
      .sort((a, b) => (a.create_time || 0) - (b.create_time || 0));
    const tail = msgs.slice(-4).map(m => ({
      role: m.author && m.author.role, ctype: m.content && m.content.content_type,
      text: (m.content && m.content.parts ? m.content.parts.map(p => typeof p === 'string' ? p : (p.content_type || JSON.stringify(p).slice(0, 80))).join(' | ') : '').slice(0, 300),
      status: m.status, meta: m.metadata ? Object.keys(m.metadata).slice(0, 8) : []
    }));
    out.convs.push({ id, status: 200, title: c.title, n_msgs: msgs.length, tail });
  }
  return out;
}
"""

ids = sys.argv[1:]
with sync_playwright() as p:
    b = p.chromium.launch_persistent_context(
        PROFILE_DIR, channel="chrome", headless=False,
        ignore_default_args=["--enable-automation"],
        args=["--disable-blink-features=AutomationControlled"], no_viewport=True)
    b.add_init_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
    page = b.new_page()
    page.goto("https://chatgpt.com/")
    page.wait_for_load_state("domcontentloaded")
    page.wait_for_timeout(4000)
    r = page.evaluate(JS, ids)
    print(json.dumps(r, indent=1, ensure_ascii=False)[:6000])
    b.close()
print("PROBE DONE")
