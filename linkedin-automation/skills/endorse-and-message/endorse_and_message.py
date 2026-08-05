# endorse_and_message.py — for each already-CONNECTED member in members.json
# (oldest connected_on first): endorse a random 9-15 of their top skills, then
# send ONE fixed favor-request DM asking them to endorse Mike's automation
# skills back.
#
# Python port of endorse-and-message.js (freeze-and-port, 2026-08-01); logic,
# selectors, pacing, DM template, name cleaning, and OUTPUT FORMAT are 1:1 with
# the JS original, which stays alongside as rollback until this port is blessed
# on a live run. The output lines must stay byte-identical: the Lane 5 graph
# wrapper (graph/lane_graph.py) parses them (ENDORSED / DM SENT / NO ENDORSABLE
# SKILLS / DM <status> / [i/N] / DONE).
#
# THE ONLY DM IN THIS FOLDER. The folder-wide "no DMs" rule has exactly one
# sanctioned exception (Mike, 2026-07-02): this script's fixed template, sent
# ONLY to members who already accepted our connection request AND whose skills
# we just endorsed. Never a cold DM. The only per-member variable is the
# recipient's FIRST NAME in the greeting (Mike, 2026-07-14) — read from their
# profile top card, falling back to "Hi there," when no clean name is found; the
# body below the greeting is fixed.
#
# ZERO-SKILLS RULE (Mike): if a member has no endorsable skills, ABANDON them —
# no endorsements means no DM either (the message says "I just endorsed you",
# which would be a lie). They're marked endorse_status:"no_skills" so we never
# revisit.
#
# members.json gains these fields per member as we go:
#   endorse_status   endorsed | no_skills
#   endorsed_at      date (YYYY-MM-DD) of the endorsements
#   endorsed_count   how many skills we endorsed
#   dm_status        sent
#   dm_sent_at       date (YYYY-MM-DD) the favor-request DM went out
#
# MANUAL EXCLUSIONS: a member can carry `dm_excluded: true` (+ optional
# `dm_excluded_reason`) to permanently skip endorse+DM regardless of connected_on
# age — set by hand for a specific person Mike names (e.g. andrew-masih,
# 2026-07-16: a personal connection, never endorse/DM). Never cleared automatically.
#
# Run:  python linkedin-automation/skills/endorse-and-message/endorse_and_message.py [--max=N] [--dry-run]
#   --max=N     process at most N members this run. DEFAULT 3 — each member is a
#               profile view against the same daily volume budget as the scraper
#               and the invite sender, plus ~10 endorse clicks and a DM (a brand
#               new action signature for this account), so keep runs SMALL.
#   --dry-run   navigate to each member, count their endorsable skills, and
#               locate the Message button, but click/endorse/send NOTHING.
#
# Selector notes (probed live on sindhura-karnati, 2026-07-02, _probe_endorse.py):
#   - Endorse buttons: aria-label "Endorse <SkillName>" with visible text exactly
#     "Endorse". An already-endorsed skill does NOT match [aria-label^="Endorse "]
#     (no trailing space in "Endorsed..."). DOM order = display order = top first.
#   - The skills page has a "Navigate back to profile main screen" button.
#   - The profile OWNER's Message control is a plain <a> with NO aria-label,
#     text exactly "Message", href /messaging/compose/?...recipient=<urn>. The
#     "More profiles for you" module's "Message <OTHER person>" anchors ALL have
#     aria-labels — never match a bare aria-label*="Message" (wrong person;
#     selector-discipline rule #1, confirmed by _probe_message.py).
#   - The composer is div.msg-form__contenteditable[contenteditable]. Its Send
#     button does NOT render until text is typed — locate it AFTER typing. Line
#     breaks must be Shift+Enter (bare Enter can send a half-typed message).
#
# Single-instance: don't run while another li-bot-profile session is open.

import json
import re
import sys
from datetime import date
from pathlib import Path

# Skill names and profile display names are routinely non-ASCII, and this script
# prints them (the "endorse: <skill>" pause label). Windows' default cp1252
# console encoding crashed the Lane 2 run on 2026-07-30 the same way, so force
# UTF-8 here too — the wrapper already sets PYTHONIOENCODING for the subprocess,
# this covers a direct terminal invocation.
sys.stdout.reconfigure(encoding="utf-8", errors="replace")
sys.stderr.reconfigure(encoding="utf-8", errors="replace")

sys.path.insert(0, str(Path(__file__).resolve().parents[2] / "lib"))
import li_session as S  # noqa: E402

MEMBERS = Path(__file__).resolve().parents[2] / "data" / "members.json"

# The favor-request DM. The greeting is personalized with the recipient's first
# name ("Hi <First>,", Mike 2026-07-14) when we can read a clean one off their
# profile, otherwise it falls back to "Hi there,". Everything from the greeting
# on ("we connected a couple of weeks ago...", including that phrasing regardless
# of the actual connection date) is FIXED. Lines are joined with Shift+Enter in
# the composer; '' = paragraph break.
MESSAGE_INTRO = (
    "we connected a couple of weeks ago. I am trying to build up my profile right now "
    "because my biggest issue is that I am getting a lot of recruiters contacting me "
    "about Front End and React roles... but I have been doing AI engineering work for "
    "almost two years. And my LinkedIn profile seems to be overwhelmingly optimized for "
    "front-end development. \U0001f631"
)
MESSAGE_BODY_LINES = [
    "",
    "I'm asking people if they could endorse some of my skills at the top of my list that "
    "are AI related. A direct link is here - "
    "https://www.linkedin.com/in/michael-luis/details/skills/",
    "",
    "I just endorsed you for a bunch of your skills. I was just curious if you would be "
    "kind enough to return the favor.",
    "",
    "Sincerely yours,",
    "Miguel \U0001f607",
]


def build_message_lines(first_name):
    """The DM lines for a given first name. first_name None/empty -> "Hi there,"."""
    greeting = f"Hi {first_name}," if first_name else "Hi there,"
    return [f"{greeting} {MESSAGE_INTRO}"] + MESSAGE_BODY_LINES


# Reduce a raw profile display name to a usable, presentable FIRST name, or None
# if nothing clean is available (so the greeting safely falls back to "there").
# Tokenizes, strips anything that isn't a letter/apostrophe/hyphen, skips a leading
# honorific ("Dr. Amanda Lee" -> "Amanda"), rejects implausible lengths, and
# title-cases ALL-CAPS or all-lowercase tokens (leaving mixed case like "McKay").
HONORIFICS = {
    "dr", "mr", "mrs", "ms", "miss", "mx", "prof", "professor", "sir", "dame",
    "rev", "er", "eng", "capt", "col", "lt", "sgt",
}


def clean_first_name(raw):
    if not raw:
        return None
    # str.isalpha() is the Python equivalent of the JS regex's \p{L} class.
    tokens = [
        "".join(c for c in t if c.isalpha() or c in "'-")
        for t in str(raw).strip().split()
    ]
    tokens = [t for t in tokens if t]
    idx = 0
    while idx < len(tokens) - 1 and tokens[idx].lower() in HONORIFICS:
        idx += 1
    tok = tokens[idx] if idx < len(tokens) else None
    if not tok or len(tok) < 2 or len(tok) > 20:
        return None
    if tok == tok.upper() or tok == tok.lower():
        tok = tok[:1].upper() + tok[1:].lower()
    return tok


# CLI flags.
ARGV = sys.argv[1:]


def _flag(name):
    for a in ARGV:
        if a.startswith(f"--{name}="):
            return a.split("=", 1)[1]
    return None


MAX_MEMBERS = int(_flag("max")) if _flag("max") else 3
DRY_RUN = "--dry-run" in ARGV

# How many skills to endorse: random 9-15 (Mike, 2026-07-15), fewer if the
# member lists fewer.
ENDORSE_MIN = 9
ENDORSE_MAX = 15

# Pacing (ms). Endorse clicks are quick human actions (2-6s apart); the DM flow
# gets wider invite-style gaps before each click; members get a wide gap between.
ENDORSE_GAP_MIN = 2000
ENDORSE_GAP_MAX = 6000
CLICK_GAP_MIN = 5000
CLICK_GAP_MAX = 15000
MEMBER_MIN = 40000
MEMBER_MAX = 90000

ENDORSE_BTN = 'main button[aria-label^="Endorse " i]'


def today():
    return date.today().strftime("%Y-%m-%d")


def first_line(err):
    """First line of an error message — the JS's String(e.message).split('\\n')[0].
    Deliberately NOT splitlines(), which returns [] (IndexError) on an empty message."""
    return str(err).split("\n")[0]


def type_rich(page, text):
    """Type text into the focused composer character-by-character. Astral chars
    (emoji) go via keyboard.insert_text — keyboard.type can mangle them."""
    for ch in text:
        if ord(ch) > 0xFFFF:
            page.keyboard.insert_text(ch)
        else:
            page.keyboard.type(ch)
        page.wait_for_timeout(S.random_between(S.CHAR_DELAY_MIN, S.CHAR_DELAY_MAX))


def first_name_from_profile(page):
    """Read the recipient's first name off the profile top card. LinkedIn profiles
    have NO <h1> and ship hashed CSS class names (documented in the scraper's
    read_location + PROJECT-LOG problem #2), so class/tag selectors find nothing.
    The stable, well-ordered source is <main>'s innerText, whose FIRST line is the
    display name (line 2 = headline, then location...). Same technique as the
    scraper. Returns a clean first name or None (greeting falls back to "there")."""
    try:
        page.wait_for_function(
            """() => {
                const m = document.querySelector('main');
                return m && m.innerText && m.innerText.trim().length > 80;
            }""",
            timeout=15000,
        )
    except Exception:
        pass
    try:
        main = page.eval_on_selector("main", "el => el.innerText")
    except Exception:
        main = ""
    if not main:
        return None
    lines = [s.strip() for s in main.split("\n")]
    lines = [s for s in lines if s]
    return clean_first_name(lines[0]) if lines else None


def dismiss_dialog(page):
    """If an endorsement follow-up dialog pops ("How do you know ... ?"), dismiss it."""
    dlg = page.locator('div[role="dialog"]').first
    try:
        count = dlg.count()
    except Exception:
        count = 0
    try:
        visible = dlg.is_visible()
    except Exception:
        visible = False
    if count and visible:
        try:
            page.keyboard.press("Escape")
        except Exception:
            pass
        S.pause(page, 600, 1200, "dismissed follow-up dialog")


# ----------------------------------------------------------------------------
# Phase 1 — endorse: open <profile>/details/skills/, click Endorse on a random
# 9-15 of the TOP skills. Returns (status, count) with status
# 'endorsed' | 'no_skills' | 'restricted' | 'dry' | 'error'.
# ----------------------------------------------------------------------------
def endorse_skills(page, profile_url):
    base = S.canonical_profile_url(profile_url) or profile_url
    page.goto(base + "details/skills/", wait_until="domcontentloaded")
    S.pause(page, 3000, 6000, "skills page render")

    if S.is_restricted(page):
        return "restricted", 0

    # Endorsable = aria "Endorse <skill>" AND visible text exactly "Endorse".
    # Scroll a little if the list renders fewer than we want (lazy list).
    # NOTE: element HANDLES, not locator.all() — a clicked button's aria-label
    # flips out of the matched set, so nth-index locators would shift mid-loop
    # and endorse the wrong skills. Handles stay pinned to their DOM nodes.
    buttons = []
    for _ in range(3):
        buttons = []
        for b in page.query_selector_all(ENDORSE_BTN):
            try:
                ok = b.evaluate(
                    """el => (el.innerText || '').trim() === 'Endorse' &&
                             !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)"""
                )
            except Exception:
                ok = False
            if ok:
                buttons.append(b)
        if len(buttons) >= ENDORSE_MAX:
            break
        try:
            page.evaluate("() => window.scrollBy(0, 1200)")
        except Exception:
            pass
        S.pause(page, S.ACTION_MIN, S.ACTION_MAX, "scroll skills list")

    if not buttons:
        # Nothing to endorse. Distinguish "no skills at all" from "we already
        # endorsed everything" (aria flips off the "Endorse " prefix once endorsed).
        return "no_skills", 0

    target = min(S.random_between(ENDORSE_MIN, ENDORSE_MAX), len(buttons))
    print(f"   {len(buttons)} endorsable skill(s) visible; endorsing the top {target}.")
    if DRY_RUN:
        return "dry", target

    clicked = 0
    for b in buttons[:target]:
        try:
            aria = b.get_attribute("aria-label") or ""
        except Exception:
            aria = ""
        try:
            b.scroll_into_view_if_needed()
        except Exception:
            pass
        S.pause(page, ENDORSE_GAP_MIN, ENDORSE_GAP_MAX,
                f"endorse: {re.sub(r'^Endorse ', '', aria, flags=re.I)}")
        try:
            b.click(timeout=5000)
            clicked += 1
        except Exception as e:
            print(f"   endorse click failed ({aria}): {first_line(e)}")
        dismiss_dialog(page)
    return ("endorsed" if clicked > 0 else "error"), clicked


# ----------------------------------------------------------------------------
# Phase 2 — DM: back to the profile, open the Message composer, type the fixed
# template (Shift+Enter line breaks), click Send, verify the box emptied.
# Returns 'sent' | 'no_message_button' | 'no_composer' | 'no_send_button'
#         | 'typing_failed' | 'not_verified' | 'dry-found'.
# ----------------------------------------------------------------------------
def send_dm(page, profile_url):
    # Human-like return: the skills page has an explicit back button.
    back = page.locator('main button[aria-label="Navigate back to profile main screen"]').first
    try:
        back_count = back.count()
    except Exception:
        back_count = 0
    try:
        back_visible = back.is_visible()
    except Exception:
        back_visible = False
    if back_count and back_visible:
        S.pause(page, 1000, 2500, "back to profile")
        try:
            back.click(timeout=5000)
        except Exception:
            pass
    elif re.search(r"details/skills", page.url):
        try:
            page.go_back(wait_until="domcontentloaded")
        except Exception:
            pass
    if not re.search(r"/in/", page.url) or re.search(r"details/", page.url):
        base = S.canonical_profile_url(profile_url) or profile_url
        try:
            page.goto(base, wait_until="domcontentloaded")
        except Exception:
            pass
    S.pause(page, 2500, 5000, "profile re-render")

    # Read the recipient's first name for the greeting BEFORE the composer overlay
    # covers the profile. Falls back to "there" if no clean name is found.
    first_name = first_name_from_profile(page)
    message_lines = build_message_lines(first_name)
    print(f'   greeting: "{message_lines[0].split(",")[0]}," '
          + ("(first name from profile)" if first_name
             else '(no clean name — fell back to "there")'))

    # The PROFILE OWNER's Message control (probed 2026-07-02, _probe_message.py):
    # a plain <a> with NO aria-label, visible text exactly "Message", and an href
    # to /messaging/compose/?...recipient=<their urn>. The "More profiles for you"
    # module's "Message <someone else>" anchors ALL carry aria-labels, so
    # "no aria-label + exact text Message + compose href" is what disambiguates —
    # never match a bare aria-label*="Message" here (it DMs the wrong person).
    msg_btn = None
    for h in page.query_selector_all('main a[href*="/messaging/compose"], main button'):
        try:
            ok = h.evaluate(
                """el => (el.innerText || '').trim() === 'Message' &&
                         !el.getAttribute('aria-label') &&
                         !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)"""
            )
        except Exception:
            ok = False
        if ok:
            msg_btn = h
            break
    if msg_btn is None:
        # Older top-card form: the owner's name inside the aria-label.
        first = (S.name_query_from_url(profile_url) or "").split(" ")[0]
        if first:
            scoped = page.locator(
                f'main button[aria-label*="Message {first}" i], '
                f'main a[aria-label*="Message {first}" i]'
            ).first
            try:
                scoped_count = scoped.count()
            except Exception:
                scoped_count = 0
            try:
                scoped_visible = scoped.is_visible()
            except Exception:
                scoped_visible = False
            if scoped_count and scoped_visible:
                msg_btn = scoped
    if msg_btn is None:
        return "no_message_button"
    if DRY_RUN:
        return "dry-found"

    S.pause(page, CLICK_GAP_MIN, CLICK_GAP_MAX, "before Message")
    msg_btn.click(timeout=6000)
    S.pause(page, 2500, 4500, "composer open")

    box = page.locator(
        'div.msg-form__contenteditable[contenteditable="true"], '
        'div[contenteditable="true"][aria-label*="message" i], '
        '[role="textbox"][contenteditable="true"]'
    ).first
    try:
        box_count = box.count()
    except Exception:
        box_count = 0
    if not box_count:
        return "no_composer"
    try:
        box.click(timeout=5000)
    except Exception:
        pass
    S.pause(page, 800, 1800, "focus composer")

    # Clear any leftover draft (e.g. from an interrupted earlier run) so the
    # member can never receive the template twice in one message.
    try:
        draft = box.inner_text()
    except Exception:
        draft = ""
    if (draft or "").strip():
        print("   clearing a leftover draft first.")
        page.keyboard.press("Control+a")
        page.wait_for_timeout(300)
        page.keyboard.press("Delete")
        S.pause(page, 600, 1200, "cleared draft")

    # Type the template. Line breaks are Shift+Enter — NEVER bare Enter (this
    # account has "Press Enter to send" ON, so a bare Enter fires the message).
    for i, line in enumerate(message_lines):
        if line:
            type_rich(page, line)
        if i < len(message_lines) - 1:
            page.keyboard.down("Shift")
            page.keyboard.press("Enter")
            page.keyboard.up("Shift")
            page.wait_for_timeout(S.random_between(60, 200))
    S.pause(page, 1500, 3000, "typed DM")

    # Verify the text actually landed BEFORE sending — otherwise an Enter on an
    # empty box "succeeds" silently and we'd wrongly mark the member dm_sent.
    try:
        typed = box.inner_text()
    except Exception:
        typed = ""
    typed_len = len((typed or "").strip())
    if typed_len < 100:
        print(f"   composer only has {typed_len} chars after typing — aborting the send.")
        for key in ("Control+a", "Delete", "Escape"):
            try:
                page.keyboard.press(key)
            except Exception:
                pass
        return "typing_failed"

    # Send. Two account modes (probed 2026-07-02, _probe_send.py):
    #   - "Press Enter to send" OFF: a Send button renders once there's content.
    #   - "Press Enter to send" ON (Mike's setting): NO Send button exists at all —
    #     the footer shows only a .msg-form__send-toggle ("Open send options")
    #     circle, and the send action is a bare Enter in the composer.
    send = None
    for sel in (
        "button.msg-form__send-button",
        '.msg-form button[type="submit"]',
        '.msg-convo-wrapper button[aria-label*="Send" i]',
    ):
        cand = page.locator(sel).first
        try:
            cand_count = cand.count()
        except Exception:
            cand_count = 0
        try:
            cand_visible = cand.is_visible()
        except Exception:
            cand_visible = False
        if cand_count and cand_visible:
            send = cand
            break
    if send is None:
        by_text = page.locator(".msg-convo-wrapper button").filter(
            has_text=re.compile(r"^Send$")
        ).first
        try:
            by_text_count = by_text.count()
        except Exception:
            by_text_count = 0
        try:
            by_text_visible = by_text.is_visible()
        except Exception:
            by_text_visible = False
        if by_text_count and by_text_visible:
            send = by_text

    S.pause(page, CLICK_GAP_MIN, CLICK_GAP_MAX, "before Send")
    if send is not None:
        send.click(timeout=6000)
    else:
        try:
            toggle = page.locator(".msg-form__send-toggle").first.count()
        except Exception:
            toggle = 0
        if toggle:
            print("   no Send button + send-toggle present (Enter-to-send mode)"
                  " — sending with Enter.")
            try:
                box.click(timeout=4000)
            except Exception:
                pass
            page.keyboard.press("Enter")
        else:
            return "no_send_button"
    S.pause(page, 2000, 3500, "after send")

    # Verify: on success the composer empties.
    try:
        leftover = box.inner_text()
    except Exception:
        leftover = ""
    leftover = (leftover or "").strip()
    try:
        page.keyboard.press("Escape")  # close the overlay
    except Exception:
        pass
    return "sent" if leftover == "" else "not_verified"


# ----------------------------------------------------------------------------
# Main
# ----------------------------------------------------------------------------
def _eligible(m):
    """Accepted our invite, not yet DM'd, not abandoned for zero skills, not
    manually excluded."""
    return (m.get("contact_status") == "connected"
            and not m.get("dm_sent_at")
            and m.get("endorse_status") != "no_skills"
            and not m.get("dm_excluded"))


def main():
    members = S.read_json(MEMBERS, [])
    # Oldest connection first (stable sort keeps file order on ties).
    todo = sorted((m for m in members if _eligible(m)),
                  key=lambda m: str(m.get("connected_on") or "9999"))

    print(f"members.json: {len(members)} total, {len(todo)} connected member(s) "
          "eligible for endorse+DM.")
    if DRY_RUN:
        print("** DRY RUN ** — will count skills + locate Message, but endorse/send NOTHING.\n")
    print(f"--max={MAX_MEMBERS}: processing at most {MAX_MEMBERS} member(s) this run.\n")

    batch = todo[:MAX_MEMBERS]
    if not batch:
        print("Nothing to do.")
        return

    pw, browser, page = S.launch_session()
    tally = {}
    done = 0

    try:
        i = 0
        for m in batch:
            i += 1
            print(f"[{i}/{len(batch)}] {m['profile_url']} (connected {m.get('connected_on')})")
            try:
                nav = S.search_and_open(page, m)
                S.ensure_logged_in(page)
                print(f"   reached via {nav}")

                if S.is_restricted(page):
                    print("\n!! LinkedIn restriction / unusual-activity page detected. STOPPING.")
                    break
                if not re.search(r"/in/", page.url):
                    raise RuntimeError(f"not on a profile page ({page.url})")
                try:
                    page.wait_for_selector("main", timeout=15000)
                except Exception:
                    pass
                S.pause(page, S.ACTION_MIN, S.ACTION_MAX, "read profile")

                # Phase 1 — endorse (skipped if a previous run already endorsed them).
                if m.get("endorse_status") != "endorsed":
                    e_status, e_count = endorse_skills(page, m["profile_url"])
                    if e_status == "restricted":
                        print("\n!! Restriction page on the skills page. STOPPING.")
                        break
                    if e_status == "no_skills":
                        # Mike's rule: no endorsable skills -> abandon, no DM, never revisit.
                        m["endorse_status"] = "no_skills"
                        m["endorsed_at"] = today()
                        S.write_json(MEMBERS, members)
                        tally["no_skills"] = tally.get("no_skills", 0) + 1
                        print("   NO ENDORSABLE SKILLS — abandoned (no DM), marked no_skills.")
                        continue
                    if e_status == "dry":
                        print(f"   [dry] would endorse {e_count} skill(s).")
                    elif e_status == "endorsed":
                        m["endorse_status"] = "endorsed"
                        m["endorsed_at"] = today()
                        m["endorsed_count"] = e_count
                        S.write_json(MEMBERS, members)
                        print(f"   ENDORSED {e_count} skill(s).")
                    else:
                        tally["endorse_error"] = tally.get("endorse_error", 0) + 1
                        print("   endorse failed (left for retry next run)")
                        continue
                else:
                    print("   already endorsed on a previous run — going straight to the DM.")

                # Phase 2 — the favor-request DM.
                d = send_dm(page, m["profile_url"])
                tally[d] = tally.get(d, 0) + 1
                if d == "sent":
                    m["dm_status"] = "sent"
                    m["dm_sent_at"] = today()
                    S.write_json(MEMBERS, members)
                    done += 1
                    print("   DM SENT.")
                elif d == "dry-found":
                    print("   [dry] Message button located — would send the template.")
                else:
                    print(f"   DM {d} — endorsements recorded, DM left for retry next run.")
            except Exception as err:
                tally["error"] = tally.get("error", 0) + 1
                print(f"   error (will retry next run): {first_line(err)}")

            if i < len(batch):
                S.pause(page, MEMBER_MIN, MEMBER_MAX, "between members")

        remaining = sum(1 for x in members if _eligible(x))
        print("\n============================================================")
        print(f" DONE this run. {done} member(s) endorsed + DM'd.")
        print(f" Tally: {json.dumps(tally, separators=(',', ':'))}")
        print(f" {remaining} eligible member(s) remaining.")
        print("============================================================")
    except Exception as err:
        print(f"\nFATAL: {err}", file=sys.stderr)
    finally:
        browser.close()
        pw.stop()


if __name__ == "__main__":
    main()
