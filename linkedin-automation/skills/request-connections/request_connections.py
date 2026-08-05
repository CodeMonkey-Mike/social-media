# request_connections.py — send a LinkedIn connection request (WITH a short
# personalized note) to each captured member in members.json we haven't
# contacted yet, then record it.
#
# Python port of request-connections.js (freeze-and-port, 2026-07-30); logic,
# selectors, pacing, identity guards, and OUTPUT FORMAT are 1:1 with the JS
# original, which stays alongside as rollback until this port is blessed on a
# live run. The output lines must stay byte-identical: the Lane 3 graph wrapper
# (graph/lane_graph.py) parses them (INVITE SENT / already_* / no_connect_button
# / LIMIT / error / [i/N] / DONE).
#
# members.json gains fields per member as we go:
#   contacted        true once an invite exists (sent now, or already pending/connected)
#   contacted_at     the date (YYYY-MM-DD) we sent / observed the invite
#   contact_status   sent | already_pending | already_connected | no_connect_button
#   nocb_count/_last no-Connect-button strikes (2 strikes on different days = retired)
#
# Run:  python linkedin-automation/skills/request-connections/request_connections.py [--max=N] [--dry-run]
#   --max=N     send at most N invites this run, then stop. DEFAULT 10 if omitted
#               (no fixed daily cap as of 2026-07-28 — pass --max per Mike's ask).
#   --dry-run   navigate to each profile and locate the Connect button, but DON'T
#               click/send anything. Safe way to verify the flow.
#
# HARD LIMITS (LinkedIn, not this script): personalized-note invites need Premium
# (Mike has it); there is still a weekly invitation cap (~100-200). If LinkedIn
# shows a limit or restriction page, the run STOPS and reports — it never hammers.
#
# Single-instance: don't run while another li-bot-profile session is open.

import json
import re
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "lib"))
import li_session as S

# ----------------------------------------------------------------------------
# Config
# ----------------------------------------------------------------------------
MEMBERS = Path(__file__).resolve().parents[2] / "data" / "members.json"

# The note sent with every invite. No first name (Mike's call), no em dashes,
# well under LinkedIn's 300-char note limit.
MESSAGE = "Hello there, I noticed we are in the same AI automation group. I am trying to build my connections list, and just wanted to see if I can connect with some like-minded people."

# CLI flags.
ARGV = sys.argv[1:]


def _flag(name):
    for a in ARGV:
        if a.startswith(f"--{name}="):
            return a.split("=", 1)[1]
    return None


MAX_INVITES = int(_flag("max")) if _flag("max") else 10  # default daily cap
DRY_RUN = "--dry-run" in ARGV

# Pacing between invites (ms) — wide, like the scraper.
INVITE_MIN = 40000
INVITE_MAX = 90000

# Randomized pause before EVERY click inside the connect flow (open More, click
# Connect, Add a note, Send) — deliberately slow / human.
CLICK_GAP_MIN = 5000
CLICK_GAP_MAX = 20000


def gap(page, label):
    S.pause(page, CLICK_GAP_MIN, CLICK_GAP_MAX, label)


def today():
    """Today's date as YYYY-MM-DD (local)."""
    return date.today().strftime("%Y-%m-%d")


def body_text(page):
    try:
        return page.evaluate("() => (document.body && document.body.innerText) || ''")
    except Exception:
        return ""


def norm(s):
    return re.sub(r"\s+", " ", str(s or "")).strip().lower()


# ----------------------------------------------------------------------------
# Send one connection request from the member's profile page.
# Returns: 'sent' | 'already_pending' | 'already_connected' | 'no_connect_button'
#          | 'limit_reached' | 'error' | 'dry-found'
# ----------------------------------------------------------------------------
def send_connection_request(page):
    try:
        page.wait_for_selector("main", timeout=15000)
    except Exception:
        pass
    S.pause(page, S.ACTION_MIN, S.ACTION_MAX, "read profile")

    # The profile owner's displayed name — the anchor for the identity guard.
    # Sources in order: legacy `main h1`; the tab title ("(3) Ana Bakšaj | LinkedIn"
    # — the new 2026 UI has NO h1 in main, which silently zeroed out a whole batch
    # on 2026-07-22); the top-card "Follow <Name>" aria-label. No name = fail closed.
    try:
        profile_name = norm(page.locator("main h1").first.inner_text(timeout=2500))
    except Exception:
        profile_name = ""
    if not profile_name:
        try:
            t = page.title()
        except Exception:
            t = ""
        cand = norm(re.sub(r"^\(\d+\)\s*", "", t).split("|")[0].split(" - ")[0])
        if cand and not re.search(r"linkedin", cand, re.I):
            profile_name = cand
    if not profile_name:
        try:
            fol = page.locator('main [aria-label^="Follow "]').first.get_attribute("aria-label")
        except Exception:
            fol = ""
        profile_name = norm(re.sub(r"^follow\s+", "", fol or "", flags=re.I))
    if not profile_name:
        return "no_connect_button"
    print(f'   profile owner: "{profile_name}"')

    # Already invited?
    try:
        pending = page.locator('button[aria-label*="Pending" i]').first.count()
    except Exception:
        pending = 0
    if pending:
        return "already_pending"

    # Find the Connect button. LinkedIn puts it in one of two places (seemingly at
    # random): a top-card PRIMARY control on the left, OR inside the top-card "More"
    # menu as a plain <a> with text "Connect".
    # The top-card primary is sometimes a <button> and sometimes an <a> anchor
    # (href=/preload/custom-invite, aria-label "Invite <Name> to connect", with a
    # <span>Connect</span> inside). We MUST match BOTH tags: matching only <button>
    # missed the anchor form and fell through to More, which then has no Connect
    # either -> false "no_connect_button" (hamza-moghe, 2026-06-29).
    # IDENTITY GUARD (2026-07-22): the aria-label must name the person whose profile
    # this is. A bare .first grabbed "More profiles for you" suggestion-card
    # Connect buttons whenever the top card had none, inviting ~50 strangers with
    # our note (Ja'Claylyn Hamner incident). A button naming anyone else is skipped.
    connect = None
    candidates = page.locator(
        'main button[aria-label*="to connect" i], main a[aria-label*="to connect" i]'
    )
    try:
        els = candidates.all()
    except Exception:
        els = []
    for el in els:
        try:
            label = norm(el.get_attribute("aria-label"))
        except Exception:
            label = ""
        try:
            visible = el.is_visible()
        except Exception:
            visible = False
        if profile_name in label and visible:
            connect = el
            break
    have_connect = connect is not None
    if not have_connect:
        # Open the top-card "More" menu. The VISIBLE More button has no aria-label and
        # text exactly "More" (there's also a hidden aria-label="More" duplicate, and
        # unrelated "… more" buttons in the activity feed — so match text exactly).
        more = page.locator("main button:visible", has_text=re.compile(r"^More$")).first
        try:
            more_count = more.count()
        except Exception:
            more_count = 0
        if more_count:
            gap(page, "before opening More")
            try:
                more.click(timeout=6000)
            except Exception:
                pass
            S.pause(page, 800, 1600, "open More menu")
            connect = (
                page.locator(
                    'div[role="menu"] a, div[role="menu"] [role="menuitem"], div[role="menu"] button'
                )
                .filter(has_text=re.compile(r"^Connect$"))
                .first
            )
            try:
                have_connect = connect.count()
            except Exception:
                have_connect = 0
    if not have_connect:
        # No Connect anywhere: either already a 1st-degree connection (Message shown)
        # or follow-only / out of network.
        try:
            msg_btn = page.locator('main button[aria-label*="Message" i]').first.count()
        except Exception:
            msg_btn = 0
        return "already_connected" if msg_btn else "no_connect_button"

    if DRY_RUN:
        return "dry-found"

    gap(page, "before clicking Connect")
    connect.click(timeout=6000)
    S.pause(page, 1200, 2500, "connect modal")

    # A weekly-limit or restriction modal can appear right here.
    if re.search(
        r"weekly invitation limit|reached the limit|no invitations left|temporarily restricted",
        body_text(page), re.I,
    ):
        return "limit_reached"

    # Some members require the sender to enter their email to verify they know them
    # (a per-member privacy setting) before a note can even be added. We never have
    # a member's email, and guessing/typing into an unfamiliar modal is unsafe, so
    # treat this exactly like no_connect_button: close the dialog and skip them.
    if re.search(r"enter their email", body_text(page), re.I):
        try:
            page.keyboard.press("Escape")
        except Exception:
            pass
        S.pause(page, 500, 1000, "closed email-verification modal")
        return "no_connect_button"

    # The modal opens on "Add a note" / "Send without a note". Click "Add a note"
    # to reveal the textarea (NEVER click "Send without a note").
    add_note = page.locator(
        'div[role="dialog"] button[aria-label="Add a note"], div[role="dialog"] button:has-text("Add a note")'
    ).first
    try:
        add_note_count = add_note.count()
    except Exception:
        add_note_count = 0
    try:
        add_note_visible = add_note.is_visible()
    except Exception:
        add_note_visible = False
    if add_note_count and add_note_visible:
        gap(page, "before Add a note")
        add_note.click(timeout=5000)
        S.pause(page, 800, 1600, "add note")

    textarea = page.locator(
        'div[role="dialog"] textarea[name="message"], div[role="dialog"] #custom-message, div[role="dialog"] textarea'
    ).first
    try:
        textarea_count = textarea.count()
    except Exception:
        textarea_count = 0
    if not textarea_count:
        if re.search(r"reached the limit|upgrade to|premium", body_text(page), re.I):
            return "limit_reached"
        return "error"
    # Focus the field, then type the note character-by-character with a randomized
    # per-keystroke delay (same human-typing pattern as the posting scripts).
    try:
        textarea.click(timeout=4000)
    except Exception:
        pass
    S.type_human(page, MESSAGE)
    S.pause(page, 600, 1400, "typed note")

    # "Send invitation" (text "Send"). Scope to the dialog so we never grab the
    # "Send without a note" button (which is replaced once a note is added anyway).
    send = page.locator(
        'div[role="dialog"] button[aria-label="Send invitation" i], div[role="dialog"] button[aria-label="Send now" i], div[role="dialog"] button[aria-label="Send" i]'
    ).first
    try:
        send_count = send.count()
    except Exception:
        send_count = 0
    if not send_count:
        return "error"
    gap(page, "before Send")
    send.click(timeout=6000)
    S.pause(page, 1500, 3000, "after send")

    if re.search(r"weekly invitation limit|no invitations left", body_text(page), re.I):
        return "limit_reached"
    return "sent"


# ----------------------------------------------------------------------------
# Main
# ----------------------------------------------------------------------------
def main():
    members = S.read_json(MEMBERS, [])
    # Skip anyone who already took a no_connect_button strike TODAY. The two-strike
    # retirement rule assumes one run/day; on a multi-batch day (60-invite backlog
    # run, 2026-07-23) the next batch would re-hit a strike-1 member minutes later,
    # burning a second profile view and retiring them without a real retry gap.
    todo = [m for m in members if m.get("contacted") is not True and m.get("nocb_last") != today()]
    print(f"members.json: {len(members)} total, {len(members) - len(todo)} already contacted, {len(todo)} to contact.")
    if DRY_RUN:
        print("** DRY RUN ** — will locate the Connect button but NOT send anything.\n")
    print(f"--max={MAX_INVITES}: sending at most {MAX_INVITES} invite(s) this run.\n")

    batch = todo[:MAX_INVITES]
    if not batch:
        print("Nothing to do.")
        return

    pw, browser, page = S.launch_session()
    tally = {}
    sent = 0

    try:
        i = 0
        for m in batch:
            i += 1
            url = m["profile_url"]
            print(f"[{i}/{len(batch)}] {url}")
            try:
                nav = S.search_and_open(page, m)
                S.ensure_logged_in(page)
                print(f"   reached via {nav}")

                if S.is_restricted(page):
                    print("\n!! LinkedIn restriction / unusual-activity page detected. STOPPING.")
                    break
                # Must be on the EXACT profile we intended — a redirect or wrong search
                # click means any Connect on this page belongs to someone else.
                landed = (S.slug_from_url(page.url) or "").lower()
                wanted = (S.slug_from_url(url) or "").lower()
                if not landed or landed != wanted:
                    raise RuntimeError(f"landed on wrong page ({page.url})")

                status = send_connection_request(page)
                tally[status] = tally.get(status, 0) + 1

                if status == "limit_reached":
                    print("   LIMIT reached (weekly invite or note limit). STOPPING — not marking this one.")
                    break

                if status in ("sent", "already_pending", "already_connected"):
                    m["contacted"] = True
                    m["contacted_at"] = today()
                    m["contact_status"] = status
                    S.write_json(MEMBERS, members)
                    if status == "sent":
                        sent += 1
                    print(f"   {'INVITE SENT' if status == 'sent' else status}")
                elif status == "dry-found":
                    print("   [dry] Connect available — would send the note.")
                elif status == "no_connect_button":
                    # Retire after 2 strikes so follow-only profiles don't clog the front
                    # of the queue on every run (matters with the 137-member re-invite
                    # backlog, 2026-07-22).
                    m["nocb_count"] = (m.get("nocb_count") or 0) + 1
                    m["nocb_last"] = today()  # gates same-day re-attempts (see todo filter)
                    if m["nocb_count"] >= 2:
                        m["contacted"] = True
                        m["contacted_at"] = today()
                        m["contact_status"] = "no_connect_button"
                        print("   no_connect_button (2nd strike — retired from queue)")
                    else:
                        print("   no_connect_button (strike 1, one retry left)")
                    S.write_json(MEMBERS, members)
                else:
                    # error -> leave contacted:false so it's retried.
                    print(f"   {status} (left for retry next run)")
            except Exception as err:
                tally["error"] = tally.get("error", 0) + 1
                print(f"   error (will retry next run): {str(err).splitlines()[0]}")

            if i < len(batch):
                S.pause(page, INVITE_MIN, INVITE_MAX, "between invites")

        remaining = sum(1 for x in members if x.get("contacted") is not True)
        print("\n============================================================")
        print(f" DONE this run. {sent} invite(s) sent.")
        print(f" Tally: {json.dumps(tally, separators=(',', ':'))}")
        print(f" {remaining} member(s) still to contact (run again, max {MAX_INVITES}/day).")
        print("============================================================")
    except Exception as err:
        print(f"\nFATAL: {err}", file=sys.stderr)
    finally:
        browser.close()
        pw.stop()


if __name__ == "__main__":
    main()
