# test_chat_lifecycle.py — end-to-end smoke test of the chat registry lifecycle (Python
# port of test-chat-lifecycle.js, extended 2026-09-17 for birth registration, the
# zero-image rule, the run journal / REVIEW class and orphan adoption):
#   [F] probe_session registers + retires + sweeps whatever a probe created
#   [A] fresh chat -> confirm_and_register AT BIRTH -> retire_url -> sweep (deleted, 404)
#   [B] un-renamed chat forced onto retired -> sweep must REFUSE (title gate), stays alive
#   [C] ZERO-IMAGE rule: a born chat with count 0 is retired + swept
#   [D] REVIEW: an unregistered chat created inside a journal window is REPORTED by
#       run_reconcile and NEVER touched by --fix
#   [E] ORPHAN: a gate-titled chat missing from the registry is queued by --fix and swept
# Creates its own throwaway TEXT chats ("Reply with only the word ok.", no image gen) on
# a TEMP registry, and cleans up everything it makes. Uses test-only purposes.
#
# HARD RULE (2026-09-17, learned the expensive way): every run_reconcile(fix=True) call in
# here passes fix_ids={<this test's chat>}. With a scratch registry, EVERY production chat
# on the live account looks like an orphan; the first unscoped run of this test adopted
# and deleted all 7 registered production chats (gate-titled, disposable, images on
# disk — but still not the test's to touch).
#
# Usage: python repurpose/test_chat_lifecycle.py   (needs the chatgpt profile; do NOT run
#        while an image-gen stage holds the chatgpt stage lock)

import json
import re
import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import chat_pool as pool          # noqa: E402
import chat_delete                # noqa: E402
import reconcile_chats            # noqa: E402

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

T = "lifecycle-test-broll"          # contains "broll" -> "b-roll: " prefix
PASS = FAIL = 0


def check(name, cond, detail=""):
    global PASS, FAIL
    print(f"  {'PASS' if cond else 'FAIL'}  {name}{(' — ' + str(detail)) if detail else ''}")
    if cond:
        PASS += 1
    else:
        FAIL += 1


def cid(url):
    m = re.search(r"/c/([a-z0-9-]+)", str(url or ""), re.IGNORECASE)
    return m.group(1) if m else None


def new_throwaway_chat(page):
    page.goto("https://chatgpt.com/", wait_until="domcontentloaded", timeout=60000)
    box = page.locator("#prompt-textarea")
    box.wait_for(state="visible", timeout=30000)
    box.click()
    box.fill("Reply with only the word ok.")
    page.keyboard.press("Enter")
    page.wait_for_timeout(2000)
    try:  # 2026-09-10: Enter may not submit in a fresh chat — click send if the text sits
        if len(box.inner_text().strip()) > 5:
            page.locator('button[data-testid="send-button"], button[aria-label*="Send"]') \
                .first.click(timeout=5000)
    except Exception:
        pass
    try:
        page.wait_for_url(re.compile(r"chatgpt\.com/c/"), timeout=30000)
    except Exception:
        pass
    page.wait_for_timeout(3000)
    return cid(page.url)


def api_get(page, chat_id):
    return chat_delete._api_get_chat(page, chat_id)


def api_hide(page, chat_id):
    """Raw cleanup of our OWN un-renamed test chat (bypasses the gate on purpose)."""
    return page.evaluate(chat_delete._HIDE_JS, chat_id).get("status")


def main():
    reg = Path(tempfile.gettempdir()) / "chat-lifecycle-test-registry.json"
    reg.write_text(json.dumps({"cap": 25, "chats": [], "retired": []}), encoding="utf-8")
    print(f"temp registry: {reg}")

    # ── pure checks (no browser) ─────────────────────────────────────────────
    check("title_for(broll purpose) -> b-roll prefix",
          pool.title_for("carry-trade-broll") == "b-roll: carry-trade-broll")
    check("title_for(social purpose) -> social prefix", pool.title_for("x-tweets") == "social: x-tweets")
    check("gate accepts b-roll", bool(pool.TITLE_GATE_RE.match("b-roll: broll")))
    check("gate accepts social", bool(pool.TITLE_GATE_RE.match("social: yt-posts")))
    check("gate rejects auto-title", not pool.TITLE_GATE_RE.match("Tug-of-War Scene"))
    check("gate rejects mid-string", not pool.TITLE_GATE_RE.match("my social chat"))
    pool.register_new_chat("pure-a", "https://chatgpt.com/c/aaaa1111", title="social: pure-a",
                           reg_path=reg)
    check("count_for_url starts at 0", pool.count_for_url("https://chatgpt.com/c/aaaa1111", reg) == 0)
    check("retire_url moves it to retired",
          pool.retire_url("https://chatgpt.com/c/aaaa1111", "t", reg)
          and any(x["url"].endswith("aaaa1111") for x in pool.get_retired(reg))
          and not pool.get_active_url("pure-a", reg))
    check("queue_orphan refuses an un-gated title",
          not pool.queue_orphan("https://chatgpt.com/c/bbbb2222", "x", "Some Auto Title", "t", reg))
    check("queue_orphan queues a gated title",
          pool.queue_orphan("https://chatgpt.com/c/bbbb2222", "x", "social: x", "t", reg)
          and any(x["url"].endswith("bbbb2222") for x in pool.get_retired(reg)))
    rid = pool.journal_start("pure-run", "batch-x", reg)
    pool.journal_end(rid, reg, ok=1, fail=0)
    w = pool.run_windows(reg)
    check("journal window recorded + closed", len(w) == 1 and w[0][1] is not None and w[0][2]["ok"] == 1)
    d = pool.load(reg)
    d["retired"] = []
    pool.save(d, reg)

    # ── [F] probe_session ────────────────────────────────────────────────────
    print("\n[F] probe_session: throwaway chat -> auto register + retire + sweep on exit")
    f_id = None
    with pool.probe_session("lifecycle", reg) as page:
        f_id = new_throwaway_chat(page)
    check("probe created a /c/ chat", bool(f_id), f_id)
    end = pool.load(reg)
    check("probe run journaled", any(r["purpose"] == "probe-lifecycle" and r["ended"] for r in end.get("runs", [])))
    check("probe chat not left active/retired",
          not any(cid(x["url"]) == f_id for x in end["chats"] + end["retired"]))

    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        browser = pool.launch_profile(p)
        page = browser.new_page()
        try:
            page.goto("https://chatgpt.com/", wait_until="domcontentloaded")
            page.wait_for_timeout(3000)
            if f_id:
                check("probe chat verifiably gone (404)", api_get(page, f_id).get("status") == 404)

            # ── [A] birth registration -> retire -> sweep ────────────────────
            print("\n[A] fresh chat -> confirm_and_register at birth -> retire_url -> sweep")
            a_id = new_throwaway_chat(page)
            r = pool.confirm_and_register(page, T, "test-batch", reg)
            check("confirm_and_register returned a url", bool(r and r.get("url")), r and r.get("url"))
            if r:
                live = api_get(page, cid(r["url"]))
                check("registered id resolves via API", live.get("status") == 200, live.get("status"))
                check("live title is the gated title", live.get("title") == f"b-roll: {T}", live.get("title"))
                check("registry entry recorded with title + batch",
                      any(c["purpose"] == T and c.get("title") == f"b-roll: {T}" and c.get("batch") == "test-batch"
                          for c in pool.load(reg)["chats"]))
                pool.retire_url(r["url"], "lifecycle test", reg)
            s1 = chat_delete.sweep_retired(page, reg)
            check("sweep deleted the gated chat", s1["deleted"] >= 1 and s1["gated"] == 0, s1)
            if a_id:
                check("chat A verifiably gone (404)", api_get(page, a_id).get("status") == 404)

            # ── [B] un-renamed chat must be refused ──────────────────────────
            print("\n[B] fresh chat NOT renamed -> forced onto retired -> sweep must refuse")
            b_id = new_throwaway_chat(page)
            check("chat B has a /c/ url", bool(b_id), b_id)
            if b_id:
                b_url = f"https://chatgpt.com/c/{b_id}"
                pool.register_new_chat(T + "-b", b_url, reg_path=reg)
                pool.retire(T + "-b", "gate check", reg)
                s2 = chat_delete.sweep_retired(page, reg)
                check("sweep REFUSED the un-renamed chat", s2["gated"] >= 1 and s2["deleted"] == 0, s2)
                check("chat B still alive", api_get(page, b_id).get("status") == 200)
                check("refusal recorded in title_gate_skipped",
                      any(x["url"] == b_url for x in pool.load(reg).get("title_gate_skipped", [])))
                check("cleanup: chat B hidden", api_hide(page, b_id) == 200)
                d = pool.load(reg)
                d["title_gate_skipped"] = [x for x in d.get("title_gate_skipped", []) if x["url"] != b_url]
                pool.save(d, reg)

            # ── [C] zero-image rule ──────────────────────────────────────────
            print("\n[C] born chat with 0 images -> retired by the zero-image rule -> swept")
            c_id = new_throwaway_chat(page)
            r = pool.confirm_and_register(page, T + "-c", None, reg)
            if r and pool.count_for_url(r["url"], reg) == 0:
                pool.retire_url(r["url"], "zero images: born this run, produced nothing", reg)
            s3 = chat_delete.sweep_retired(page, reg)
            check("zero-image chat retired + deleted", s3["deleted"] >= 1, s3)
            if c_id:
                check("chat C verifiably gone (404)", api_get(page, c_id).get("status") == 404)

            # ── [D] REVIEW class via the journal window ──────────────────────
            print("\n[D] unregistered chat inside a journal window -> REVIEW, untouched by --fix")
            rid = pool.journal_start("lifecycle-window", "batch-d", reg)
            d_id = new_throwaway_chat(page)
            pool.journal_end(rid, reg)
            summ = reconcile_chats.run_reconcile(page, reg, fix=True, fix_ids={d_id})
            rl = summ.get("review_list") or []
            check("chat D reported on REVIEW", any(x["id"] == d_id for x in rl), [x["id"][:8] for x in rl])
            check("chat D NOT in the registry after --fix",
                  not any(cid(x["url"]) == d_id for x in pool.load(reg)["chats"] + pool.load(reg)["retired"]))
            if d_id:
                check("chat D still alive after --fix", api_get(page, d_id).get("status") == 200)
                check("cleanup: chat D hidden", api_hide(page, d_id) == 200)

            # ── [E] ORPHAN adoption ──────────────────────────────────────────
            print("\n[E] gate-titled chat missing from the registry -> --fix queues it -> swept")
            e_id = new_throwaway_chat(page)
            r = pool.confirm_and_register(page, T + "-e", None, reg)
            d = pool.load(reg)
            d["chats"] = [x for x in d["chats"] if cid(x["url"]) != e_id]   # simulate the orphan
            pool.save(d, reg)
            summ = reconcile_chats.run_reconcile(page, reg, fix=True, fix_ids={e_id})
            check("orphan E detected", any(x["id"] == e_id for x in summ.get("orphan_list") or []))
            check("--fix adopted ONLY the test chat",
                  all(cid(x["url"]) == e_id for x in pool.get_retired(reg)), len(pool.get_retired(reg)))
            check("orphan E queued for deletion", any(cid(x["url"]) == e_id for x in pool.get_retired(reg)))
            s5 = chat_delete.sweep_retired(page, reg)
            check("orphan E swept", s5["deleted"] >= 1 and s5["gated"] == 0, s5)
            if e_id:
                check("chat E verifiably gone (404)", api_get(page, e_id).get("status") == 404)

            end = pool.load(reg)
            residue = [x for x in end["chats"] + end["retired"] + end.get("title_gate_skipped", [])
                       if str(x.get("purpose", "")).startswith("lifecycle")]
            check("registry clean of test residue", not residue, residue)
        finally:
            browser.close()

    print(f"\n{PASS} passed, {FAIL} failed")
    sys.exit(1 if FAIL else 0)


if __name__ == "__main__":
    main()
