#!/usr/bin/env python
"""
download_ss_sfx.py: download a Soundstripe SOUND EFFECT (not a song) from its
/library/sound-effects/<id> page, capturing its on-page / API metadata.
Python port of download-ss-sfx.js (2026-11-23).

    python download_ss_sfx.py <sfxId> --dest "<dir>"

Soundstripe SFX have NO Content-ID code (per Mike: only a usage-acknowledgement doc, no embeddable
code) so none is minted here. This grabs the file + metadata (title, duration, tags, description)
sniffed off the /app/sound_effects API response, and saves a <dest>/_ss-<id>-meta.json sidecar.
--dest defaults to the throwaway staging folder video-creation/cache/music-sourcing/downloads/.
"""
import argparse
import json
import re
import sys
from pathlib import Path

from soundstripe import DEFAULT_DEST, cache_dir, click_center, iso_now, launch

API_RE = re.compile(r"api\.soundstripe\.com/app/sound_effects")


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("sfxId")
    ap.add_argument("--dest")
    a = ap.parse_args()
    sfx_id = a.sfxId
    dest = Path(a.dest) if a.dest else DEFAULT_DEST
    dest.mkdir(parents=True, exist_ok=True)
    shots = cache_dir("music-sourcing", "recon", "sfx")

    state = {"api": None}
    downloads = []
    saved_file = None

    def on_response(resp):
        if API_RE.search(resp.url) and resp.request.method == "GET":
            try:
                j = resp.json()
                # single resource or collection; keep the one matching our id
                data = j.get("data")
                if isinstance(data, list):
                    data = next((d for d in data if str(d.get("id")) == str(sfx_id)), None)
                if data and (not state["api"] or str(data.get("id")) == str(sfx_id)):
                    state["api"] = {"data": data, "included": j.get("included") or None}
            except Exception:
                pass

    def shot(name):
        try:
            page.screenshot(path=str(shots / name))
        except Exception:
            pass

    def visible(locator):
        try:
            return bool(locator.count() and locator.is_visible())
        except Exception:
            return False

    with launch(slow_mo=60) as (_ctx, page):
        page.on("response", on_response)
        page.on("download", lambda dl: downloads.append(dl))
        try:
            page.goto("https://www.soundstripe.com/library", wait_until="domcontentloaded")
            page.wait_for_timeout(4000)
            page.goto(f"https://www.soundstripe.com/library/sound-effects/{sfx_id}", wait_until="domcontentloaded")
            page.wait_for_timeout(6000)
            shot(f"{sfx_id}-1-page.png")

            # Click a download control. Try the most specific selectors first.
            clicked = False
            for sel in ['button[data-testid="sound-effect-license-btn"]',
                        'button[data-testid="sfx-license-btn"]',
                        'button[aria-label*="ownload" i]',
                        'button[title*="ownload" i]',
                        'button:has-text("Download")',
                        '[data-testid*="download" i] button',
                        'a:has-text("Download")']:
                b = page.locator(sel).first
                if visible(b):
                    print("  download control:", sel)
                    try:
                        b.scroll_into_view_if_needed()
                    except Exception:
                        pass
                    try:
                        click_center(page, b)
                    except Exception:
                        pass
                    clicked = True
                    break
            if not clicked:
                print("  (no obvious download button found: see screenshot)")
            page.wait_for_timeout(3500)
            shot(f"{sfx_id}-2-afterclick.png")

            # format / confirm modal: prefer WAV, else MP3, else generic Download
            # 2026-10-16: the confirm modal is NOT role=dialog; its button reads "Download Sound Effect".
            # The generic 'button:has-text("Download")' below matched the page's own Download button
            # behind the modal first.
            for sel in ['button:has-text("Download Sound Effect")', '[role="dialog"] button:has-text("WAV")',
                        'button:has-text("Download WAV")', '[role="menuitem"]:has-text("WAV")',
                        '[role="dialog"] button:has-text("MP3")', 'button:has-text("Download MP3")',
                        '[role="menuitem"]:has-text("MP3")', '[role="dialog"] button:has-text("Download")',
                        'button:has-text("Download")']:
                b = page.locator(sel).first
                if visible(b):
                    print("  format/confirm:", sel)
                    try:
                        b.click()
                    except Exception:
                        pass
                    page.wait_for_timeout(3500)
                    break
            page.wait_for_timeout(6000)
            shot(f"{sfx_id}-3-final.png")
        except Exception as e:
            print("  error:", str(e).splitlines()[0], file=sys.stderr)

        # save every download that started, waiting for each to finish before Chrome closes
        for dl in downloads:
            out = dest / (dl.suggested_filename or f"sfx-{sfx_id}.wav")
            try:
                dl.save_as(str(out))
                saved_file = out
                print("  downloaded:", out.name)
            except Exception as e:
                print("  saveAs failed:", out.name, str(e).splitlines()[0])

    meta = {"sfx_id": sfx_id, "source": "soundstripe",
            "url": f"https://www.soundstripe.com/library/sound-effects/{sfx_id}",
            "api": state["api"], "file": saved_file.name if saved_file else None, "downloaded_at": iso_now()}
    (dest / f"_ss-{sfx_id}-meta.json").write_text(json.dumps(meta, indent=2, ensure_ascii=False),
                                                 encoding="utf-8", newline="\n")
    print(f"\nDONE. file: {saved_file}" if saved_file
          else "\nNo file downloaded: inspect screenshots in cache/music-sourcing/recon/sfx/.")
    print("  api metadata captured?", "true" if state["api"] else "false")
    if not saved_file:
        sys.exit(2)


if __name__ == "__main__":
    try:
        main()
    except SystemExit:
        raise
    except Exception as e:
        print("fatal:", str(e).splitlines()[0] if str(e) else type(e).__name__, file=sys.stderr)
        sys.exit(1)
