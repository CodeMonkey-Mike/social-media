#!/usr/bin/env python3
"""
add_members.py  —  Rate-limited X list member adder for @mikeneder
List: https://x.com/i/lists/2051819466921533779

Usage:
    python add_members.py                   # up to 10 adds, 30-90 min delays
    python add_members.py --max 3           # cap this session at 3 adds
    python add_members.py --delay 2 5       # 2-5 min delays (testing only)
    python add_members.py --dry-run         # preview queue, no browser

Run scan_profile.py first to create x_session.json (one-time login).
Regular Chrome can stay open.
"""

import argparse
import json
import logging
import random
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path

try:
    from playwright.sync_api import sync_playwright, TimeoutError as PWTimeout
except ImportError:
    print("ERROR: playwright not installed. Run: pip install playwright")
    sys.exit(1)

# ── Config ────────────────────────────────────────────────────────────────────
LIST_URL = "https://x.com/i/lists/2051819466921533779"
CHROME_PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\xbot-profile"

HERE = Path(__file__).parent
STATE_FILE = HERE / "config" / "state.json"
LOG_FILE   = HERE / "data" / "add_members.log"

RATE_LIMIT_TEXT = "You aren't allowed to add this member"

ACTION_DELAY_MIN = 2   # seconds between individual UI actions
ACTION_DELAY_MAX = 4

# ── Remaining handles in priority order ───────────────────────────────────────
# Tier 3A/3C first because they were blocked mid-session and may already be
# eligible — the rate limit from prior sessions should have lifted.
HANDLES = [
    # Tier 3A — previously rate-limited, retry
    "@HighCoinviction", "@S4mmyEth", "@cryptopunk7213", "@shawmakesmagic",
    "@aixbt_agent", "@0xfoobar", "@MustStopMurad",
    # Tier 3C — previously rate-limited, retry
    "@VitalikButerin", "@sassal0x", "@rajgokal", "@0xMert_",
    "@iamDCInvestor", "@MessariCrypto",
    # Tier 3D — not yet attempted
    "@RaoulGMI", "@100trillionUSD", "@CryptoHayes", "@LynAldenContact",
    "@CaitlinLong_", "@woonomic", "@APompliano", "@PrestonPysh",
    "@Pentosh1", "@CryptoKaleo", "@inversebrah", "@AltcoinGordon",
    "@CryptoDonAlt", "@CryptoCred", "@milesdeutscher", "@blknoiz06",
    # Tier 4A
    "@ton_blockchain", "@ton_society", "@toncommunityhq", "@ManuelStotz", "@tonkongz",
    # Tier 4B
    "@ston_fi", "@dedust_io", "@evaaprotocol", "@tonstakers",
    "@storm_trade_ton", "@AffluentOrg",
    # Tier 4C
    "@thenotcoin", "@takoy_sasha", "@hamster_kombat", "@CatizenAI",
    "@realDogsHouse", "@blumcrypto",
    # Tier 4D
    "@tonkeeper", "@mytonwallet_io", "@wallet",
    # Tier 4E
    "@durov",
    # Tier 4F
    "@s0meone_u_know", "@Giooton", "@ZenithTON", "@ton_research", "@realtbook",
]


# ── State helpers ─────────────────────────────────────────────────────────────

def load_state() -> dict:
    if STATE_FILE.exists():
        return json.loads(STATE_FILE.read_text(encoding="utf-8"))
    return {"added": [], "not_found": [], "failed": [], "silent_block": []}


def save_state(state: dict):
    STATE_FILE.write_text(json.dumps(state, indent=2), encoding="utf-8")


def pending_handles(state: dict) -> list:
    done = {
        h.lower()
        for bucket in ("added", "not_found", "failed", "silent_block")
        for h in state.get(bucket, [])
    }
    return [h for h in HANDLES if h.lower() not in done]


# ── Core add logic ────────────────────────────────────────────────────────────

def human_pause(log, label: str = ""):
    """Sleep a random 30–50 s to mimic a human reading/deciding between actions."""
    delay = random.randint(ACTION_DELAY_MIN, ACTION_DELAY_MAX)
    msg = f"  ~ pause {delay}s{f' ({label})' if label else ''}"
    log.info(msg)
    time.sleep(delay)


def add_handle(page, handle: str, log) -> str:
    """
    Navigate to the list, open the member-management dialog, search for
    handle, and click Add.

    Returns one of:
        "added"          — button changed to Remove (confirmed success)
        "already_member" — Remove button was already showing
        "not_found"      — no matching UserCell after search
        "silent_block"   — Add clicked but button never changed, no toast
        "rate_limited"   — X error toast appeared
        "error"          — timeout or unexpected exception
    """
    clean = handle.lstrip("@")

    try:
        # ── 1. Load list page ────────────────────────────────────────────────
        log.info("  Loading list page...")
        page.goto(LIST_URL, wait_until="domcontentloaded", timeout=30_000)
        page.wait_for_timeout(2500)

        # Early rate-limit check (persists across page loads)
        if page.locator(f"text={RATE_LIMIT_TEXT}").count() > 0:
            return "rate_limited"

        # ── 2. Click Edit list ───────────────────────────────────────────────
        edit_btn = page.get_by_role("button", name="Edit list")
        try:
            edit_btn.wait_for(state="visible", timeout=10_000)
        except PWTimeout:
            edit_btn = page.locator("text=Edit list").first
            try:
                edit_btn.wait_for(state="visible", timeout=6_000)
            except PWTimeout:
                log.warning("  'Edit list' button not found — page may not have loaded correctly")
                return "error"

        human_pause(log, "before Edit list")
        edit_btn.click()

        # ── 3. Click Manage members ──────────────────────────────────────────
        manage_btn = page.locator("text=Manage members").first
        try:
            manage_btn.wait_for(state="visible", timeout=10_000)
        except PWTimeout:
            log.warning("  'Manage members' option not found")
            return "error"

        human_pause(log, "before Manage members")
        manage_btn.click()

        # ── 4. Click Suggested tab ───────────────────────────────────────────
        suggested = page.get_by_role("tab", name="Suggested")
        try:
            suggested.wait_for(state="visible", timeout=10_000)
        except PWTimeout:
            suggested = page.locator("text=Suggested").first
            try:
                suggested.wait_for(state="visible", timeout=6_000)
            except PWTimeout:
                log.warning("  'Suggested' tab not found")
                return "error"

        human_pause(log, "before Suggested tab")
        suggested.click()

        # ── 5. Search for the handle ─────────────────────────────────────────
        search = page.locator('input[placeholder="Search people"]')
        try:
            search.wait_for(state="visible", timeout=10_000)
        except PWTimeout:
            log.warning("  Search box not found")
            return "error"

        human_pause(log, "before typing handle")
        search.click()
        page.wait_for_timeout(400)
        search.fill("")   # clear any prior search text
        search.press_sequentially(clean, delay=80)

        log.info("  Waiting for search results...")
        human_pause(log, "after typing — waiting for results")

        # ── 6. Verify the searched handle appears in results ─────────────────
        # Check for @handle OR just the username (X sometimes omits @)
        handle_on_page = (
            page.locator(f"text=@{clean}").count() > 0
            or page.locator(f"text={clean}").count() > 0
        )
        if not handle_on_page:
            log.info("  Handle not found in search results")
            return "not_found"

        log.info(f"  Found @{clean} in results")

        # ── 7. Check if already a member ─────────────────────────────────────
        if page.get_by_role("button", name="Remove").count() > 0:
            return "already_member"

        # ── 8. Find Add button by visual position and click with mouse ──────────
        # Use text-content selector (more reliable than role name in modals)
        add_btns = page.locator('button:has-text("Add")')
        clicked = False
        for i in range(add_btns.count()):
            btn = add_btns.nth(i)
            try:
                bbox = btn.bounding_box()
            except Exception:
                continue
            if bbox and bbox["width"] > 0 and bbox["height"] > 0 and bbox["y"] > 0:
                human_pause(log, "before Add")
                cx = bbox["x"] + bbox["width"] / 2
                cy = bbox["y"] + bbox["height"] / 2
                page.mouse.click(cx, cy)
                log.info(f"  Add button clicked at ({cx:.0f}, {cy:.0f})")
                clicked = True
                break

        if not clicked:
            log.warning("  No Add button with valid position found")
            return "error"

        page.wait_for_timeout(3000)

        # ── 9. Detect outcome ─────────────────────────────────────────────────
        if page.locator(f"text={RATE_LIMIT_TEXT}").count() > 0:
            return "rate_limited"

        if page.get_by_role("button", name="Remove").count() > 0:
            return "added"

        return "silent_block"

    except PWTimeout:
        log.warning("  Operation timed out")
        return "error"
    except Exception as exc:
        log.error(f"  Unexpected exception: {exc}")
        return "error"


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="Add members to X list (rate-limit safe)")
    parser.add_argument("--max", type=int, default=10, metavar="N",
                        help="Max adds this session (default: 10)")
    parser.add_argument("--delay", type=float, nargs=2, default=[30.0, 90.0],
                        metavar=("MIN", "MAX"),
                        help="Delay range in minutes between adds (default: 30 90)")
    parser.add_argument("--dry-run", action="store_true",
                        help="Show queue without launching browser")
    args = parser.parse_args()

    # Logging
    fmt = "%(asctime)s  %(levelname)-8s  %(message)s"
    logging.basicConfig(
        level=logging.INFO,
        format=fmt,
        handlers=[
            logging.FileHandler(LOG_FILE, encoding="utf-8"),
            logging.StreamHandler(sys.stdout),
        ],
    )
    log = logging.getLogger("add_members")

    state = load_state()
    queue = pending_handles(state)

    log.info("=" * 65)
    log.info(f"Session start: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    log.info(
        f"Progress — added: {len(state['added'])}  |  "
        f"pending: {len(queue)}  |  "
        f"not_found: {len(state['not_found'])}  |  "
        f"failed: {len(state['failed'])}  |  "
        f"silent_block: {len(state.get('silent_block', []))}"
    )

    if not queue:
        log.info("Nothing left to do — all handles have been attempted.")
        return

    to_add = queue[: args.max]
    log.info(f"This session: {args.max} max, {args.delay[0]}–{args.delay[1]} min delays")
    log.info(f"Queue ({len(to_add)}): {', '.join(to_add)}")

    if args.dry_run:
        log.info("Dry run — exiting without launching browser.")
        return

    delay_min_s = int(args.delay[0] * 60)
    delay_max_s = int(args.delay[1] * 60)

    # Random session start jitter (15-90s) so runs never kick off at identical times
    start_jitter = random.randint(15, 90)
    log.info(f"Start jitter: waiting {start_jitter}s before first action...")
    time.sleep(start_jitter)

    with sync_playwright() as pw:
        log.info("\nLaunching Chrome with xbot-profile (X session already saved)...")
        ctx = pw.chromium.launch_persistent_context(
            user_data_dir=CHROME_PROFILE,
            channel="chrome",
            headless=False,
            slow_mo=50,
            args=["--disable-blink-features=AutomationControlled"],
            ignore_default_args=["--enable-automation"],
        )
        page = ctx.pages[0] if ctx.pages else ctx.new_page()

        for idx, handle in enumerate(to_add):
            log.info(f"\n--- [{idx + 1}/{len(to_add)}] {handle} ---")
            result = add_handle(page, handle, log)

            if result == "added":
                log.info(f"  ✓ ADDED")
                state["added"].append(handle)

            elif result == "already_member":
                log.info(f"  ~ ALREADY A MEMBER (counted as done)")
                state["added"].append(handle)

            elif result == "not_found":
                log.info(f"  ? NOT FOUND — handle may be private or renamed")
                state["not_found"].append(handle)

            elif result == "silent_block":
                log.warning(f"  ! SILENT BLOCK — Add clicked but no confirmation; retry manually")
                state["silent_block"].append(handle)

            elif result == "rate_limited":
                log.error(f"  ✗ RATE LIMITED — stopping session immediately")
                log.error("  Wait 24–72 hours before running again.")
                # Don't add to failed — leave it in pending so it retries next time
                save_state(state)
                break

            elif result == "error":
                log.warning(f"  ! ERROR — marking as failed, will need manual check")
                state["failed"].append(handle)

            save_state(state)

            # Delay before next handle (skip after the last one)
            if idx < len(to_add) - 1 and result != "rate_limited":
                delay_s = random.randint(delay_min_s, delay_max_s)
                resume_at = datetime.fromtimestamp(time.time() + delay_s).strftime("%H:%M:%S")
                log.info(f"  Sleeping {delay_s // 60}m {delay_s % 60}s — next add at ~{resume_at}")
                time.sleep(delay_s)

        log.info("\nSession done — browser will close in 15 seconds so you can review.")
        time.sleep(15)
        ctx.close()

    # Summary
    state = load_state()
    queue_remaining = pending_handles(state)
    log.info("\n" + "=" * 65)
    log.info("Session complete")
    log.info(f"  Added total:    {len(state['added'])}")
    log.info(f"  Not found:      {len(state['not_found'])}")
    log.info(f"  Failed/errors:  {len(state['failed'])}")
    log.info(f"  Silent blocks:  {len(state.get('silent_block', []))}")
    log.info(f"  Still pending:  {len(queue_remaining)}")
    if queue_remaining:
        log.info(f"  Next up:        {queue_remaining[0]}")


if __name__ == "__main__":
    main()
