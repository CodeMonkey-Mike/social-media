#!/usr/bin/env python
"""
soundstripe.py: search Soundstripe (Algolia) and download tracks with their YouTube / Content-ID
license code, for use as background music in video-creation. Python port of soundstripe.js (2026-11-23).

    python soundstripe.py login [--wait 10]
    python soundstripe.py search "<query>" [--limit 24] [--all-partners]
    python soundstripe.py download <objectID> [--query "<locate text>"] [--dest <dir>]
    python soundstripe.py download-alt <objectID> [--query "<text>"] [--dest <dir>] [--stems] [--no-alt]

search       -> writes video-creation/cache/music-sourcing/candidates.json + board.html (a self-contained
                audition board with <audio> preview players). No browser, no auth.
download     -> drives the logged-in soundstripe-profile Chrome, clicks the track's download control,
                saves the mp3, captures the content-id license code, and upserts ../library.json.
download-alt -> the "Alternate Versions" WAV zip (section cuts), and with --stems the Stems zip.
login        -> saves the session cookies after Mike signs in (the login cookie is session-only).

Algolia creds are the PUBLIC search-only key embedded in Soundstripe's web client. The key stays out of
git: see algolia_key.py. Full procedure: ../SKILL.md.
"""
import argparse
import json
import math
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE.parent.parent))  # video-creation/skills/
from cache_path import cache_dir, cache_path  # noqa: E402  shared tool cache: video-creation/cache/<tool>/

from algolia_key import algolia_key  # noqa: E402

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

MUSIC_DIR = HERE.parent
LIBRARY = MUSIC_DIR / "library.json"
CANDID = cache_path("music-sourcing", "candidates.json")
BOARD = cache_path("music-sourcing", "board.html")
DEFAULT_DEST = cache_dir("music-sourcing", "downloads")

ALGOLIA_APP = "W1S5J3A2XP"
ALGOLIA_INDEX = "prod_songs_all_partners_most_recent"
ALGOLIA_HOST = "https://" + ALGOLIA_APP.lower() + "-dsn.algolia.net"

PROFILE = r"C:\Users\mnede\AppData\Local\Google\Chrome\soundstripe-profile"
# Soundstripe's login cookie (_soundstripe_session) became a SESSION cookie (no expiry) in 2026-10, so
# Chrome drops it every time the automated browser closes and the next run is logged out.
# `login` saves the cookies once (after Mike signs in); every browser run re-injects them.
SESSION = cache_path("music-sourcing", "recon", "session-cookies.json")
NOT_SIGNED_IN = ("NOT SIGNED IN: the soundstripe-profile session is gone. "
                 "Run `python soundstripe.py login`, sign in, then retry.")
MASK_WEBDRIVER = "Object.defineProperty(navigator, 'webdriver', { get: () => undefined });"
SIGNED_IN_JS = """() => { const el = document.querySelector('[data-download-handoff-signed-in-value]');
  return el ? el.getAttribute('data-download-handoff-signed-in-value') === 'true' : null; }"""


# ── helpers ──────────────────────────────────────────────────────────────────
def js_round(x):
    """Math.round (halves up); Python's round() sends halves to the even digit."""
    f = math.floor(x)
    return f + 1 if x - f >= 0.5 else f


def js_str(v):
    return "undefined" if v is None else str(v)


def iso_now():
    """new Date().toISOString(): UTC, milliseconds, Z."""
    d = datetime.now(timezone.utc)
    return d.strftime("%Y-%m-%dT%H:%M:%S.") + f"{d.microsecond // 1000:03d}Z"


def mmss(sec):
    sec = js_round(sec or 0)
    return str(sec // 60) + ":" + str(sec % 60).rjust(2, "0")


@contextmanager
def launch(slow_mo=60, mask=True):
    """Open the dedicated soundstripe-profile Chrome (real Chrome, automation flags off).
    Yields (ctx, page): the profile's first tab. Closes Chrome on exit."""
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        ctx = p.chromium.launch_persistent_context(
            PROFILE, channel="chrome", headless=False, slow_mo=slow_mo, accept_downloads=True,
            ignore_default_args=["--enable-automation"],
            args=["--disable-blink-features=AutomationControlled"], no_viewport=True)
        try:
            if mask:
                ctx.add_init_script(MASK_WEBDRIVER)
            inject_session(ctx)
            yield ctx, (ctx.pages[0] if ctx.pages else ctx.new_page())
        finally:
            try:
                ctx.close()
            except Exception:
                pass


def inject_session(ctx):
    if not SESSION.exists():
        print("  (no saved session; run `python soundstripe.py login` if the run turns out logged out)")
        return False
    try:
        ctx.add_cookies(json.loads(SESSION.read_text(encoding="utf-8")))
        return True
    except Exception as e:
        print("  session inject failed:", str(e).splitlines()[0])
        return False


def save_session(ctx):
    try:
        SESSION.parent.mkdir(parents=True, exist_ok=True)
        SESSION.write_text(json.dumps(ctx.cookies(), separators=(",", ":")), encoding="utf-8")
    except Exception as e:
        print("  session save failed:", str(e).splitlines()[0])


def signed_in(page):
    """Is the page rendered for a signed-in member? True / False, or None when the page carries no
    download control (every download control carries this flag)."""
    try:
        return page.evaluate(SIGNED_IN_JS)
    except Exception:
        return None


def download_control(page, object_id):
    """The song page's download control for THIS objectID (markup changed 2026-10: the controls are
    <a data-controller="download-handoff"> anchors; the old button[data-testid="song-license-btn"] is gone)."""
    return page.locator(", ".join([
        f'a[data-song-detail-row-action="download"][data-download-handoff-media-id-value="{object_id}"]',
        f'a[data-song-detail-action="download"][data-download-handoff-media-id-value="{object_id}"]',
        'button[data-testid="song-license-btn"]',
    ])).first


def modal_row(page, heading):
    """A Download-Song modal row ("Full Track" / "Alternate Versions" / "Stems"): the heading text's
    nearest ancestor that contains a WAV button. Markup-agnostic (the rows stopped being <li> in 2026-10)."""
    return (page.get_by_text(heading, exact=True).first
            .locator('xpath=ancestor::*[.//button[contains(normalize-space(.), "WAV")]][1]'))


def click_center(page, locator):
    """Robust mouse click on the control's centre (matches the repo's posting scripts)."""
    bb = locator.bounding_box()
    if bb:
        page.mouse.click(bb["x"] + bb["width"] / 2, bb["y"] + bb["height"] / 2)
    else:
        locator.click()


def _http_json(req):
    """(status, parsed JSON or None, raw text). Non-2xx answers are returned, not raised."""
    try:
        with urllib.request.urlopen(req, timeout=60) as res:
            status, raw = res.status, res.read()
    except urllib.error.HTTPError as e:
        status, raw = e.code, e.read()
    text = raw.decode("utf-8", errors="replace")
    try:
        return status, json.loads(text), text
    except ValueError:
        return status, None, text


def algolia_search(query, limit=24, all_partners=False):
    facet_filters = [] if all_partners else [["content_partner.name:Soundstripe"]]
    params = urllib.parse.urlencode({"hitsPerPage": str(limit),
                                     "facetFilters": json.dumps(facet_filters, separators=(",", ":"))})
    body = json.dumps({"requests": [{"indexName": ALGOLIA_INDEX, "query": query, "params": params}]},
                      separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    url = (ALGOLIA_HOST + "/1/indexes/*/queries"
           + "?x-algolia-agent=soundstripe-skill&x-algolia-api-key=" + algolia_key()
           + "&x-algolia-application-id=" + ALGOLIA_APP)
    req = urllib.request.Request(url, data=body, method="POST", headers={"Content-Type": "application/json"})
    _status, j, text = _http_json(req)
    try:
        return j["results"][0]
    except (TypeError, KeyError, IndexError):
        raise RuntimeError("Algolia parse failed: " + text[:200]) from None


def algolia_get_object(object_id, ok_only=False):
    """The index record for one song id; None when the request fails (or, with ok_only, is not a 2xx)."""
    url = (ALGOLIA_HOST + "/1/indexes/" + ALGOLIA_INDEX + "/" + urllib.parse.quote(str(object_id), safe="-_.!~*'()")
           + "?x-algolia-api-key=" + algolia_key() + "&x-algolia-application-id=" + ALGOLIA_APP)
    try:
        status, j, _text = _http_json(urllib.request.Request(url))
    except Exception:
        return None
    if ok_only and not 200 <= status < 300:
        return None
    return j


def hit_to_record(h):
    """One Algolia hit as the record this skill stores. A field the hit does not carry is left out
    (as JSON.stringify left out `undefined`), so stored records keep the shape they always had."""
    files = h.get("audio_files") or []
    primary = next((a for a in files if a.get("primary")), None) or (files[0] if files else {})
    tags = h.get("tags") or {}
    key = h.get("key")
    rec = {"objectID": js_str(h.get("objectID"))}
    if "title" in h:
        rec["title"] = h["title"]
    rec["artists"] = [a.get("name") for a in (h.get("artists") or [])]
    rec["duration_sec"] = js_round(h.get("primary_audio_file_duration") or primary.get("duration") or 0)
    for k in ("bpm", "energy"):
        if k in h:
            rec[k] = h[k]
    rec["key"] = f"{js_str(key.get('name'))} {js_str(key.get('mode'))}" if key else None
    rec["mood"] = tags.get("mood") or []
    rec["genre"] = tags.get("genre") or []
    rec["instrument"] = tags.get("instrument") or []
    rec["characteristic"] = tags.get("characteristic") or []
    rec["keywords"] = (h.get("keywords") or [])[:12]
    if "has_vocal_version" in h:
        rec["has_vocal_version"] = h["has_vocal_version"]
    if isinstance(h.get("content_partner"), dict) and "name" in h["content_partner"]:
        rec["content_partner"] = h["content_partner"]["name"]
    rec["artwork"] = (h.get("album_artwork") or {}).get("thumbnail_url") or None
    rec["preview_url"] = primary.get("playback_url") or None
    if "primary_audio_file_id" in h:
        rec["primary_audio_file_id"] = h["primary_audio_file_id"]
    return rec


def build_board(query, records):
    cards = "".join(f"""
    <div class="card">
      <div class="top">
        {f'<img src="{r["artwork"]}" />' if r["artwork"] else '<div class="noart"></div>'}
        <div class="meta">
          <div class="title">{js_str(r.get("title"))}</div>
          <div class="artist">{", ".join(a or "" for a in r["artists"])}</div>
          <div class="facts">{mmss(r["duration_sec"])} &middot; {r.get("bpm") or "?"}bpm &middot; {r.get("energy") or ""}</div>
        </div>
      </div>
      <div class="tags">{"".join(f"<span>{t}</span>" for t in (r["mood"] + r["genre"])[:6])}</div>
      {f'<audio controls preload="none" src="{r["preview_url"]}"></audio>' if r["preview_url"] else '<div class="noaudio">no preview</div>'}
      <div class="dl"><code>python soundstripe.py download {r["objectID"]}</code></div>
    </div>""" for r in records)
    return ("""<!doctype html><html><head><meta charset="utf-8"><title>Soundstripe: """ + query + """</title>
  <style>
    body{background:#0d0f12;color:#e8eaed;font:14px/1.4 system-ui,Segoe UI,Arial;margin:0;padding:20px}
    h1{font-size:18px;font-weight:600}.q{color:#8ab4f8}
    .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px;margin-top:14px}
    .card{background:#16191d;border:1px solid #23272e;border-radius:10px;padding:12px}
    .top{display:flex;gap:10px}.top img,.noart{width:60px;height:60px;border-radius:6px;object-fit:cover;background:#23272e;flex:none}
    .title{font-weight:600}.artist{color:#9aa0a6;font-size:13px}.facts{color:#6b7177;font-size:12px;margin-top:3px}
    .tags{margin:8px 0;display:flex;flex-wrap:wrap;gap:5px}.tags span{background:#23272e;color:#9aa0a6;border-radius:4px;padding:1px 7px;font-size:11px}
    audio{width:100%;margin-top:6px;height:34px}
    .dl{margin-top:8px}.dl code{background:#0a0c0f;color:#7ee787;font-size:11px;padding:3px 6px;border-radius:4px;display:block;overflow:auto}
  </style></head><body>
  <h1>Soundstripe results for <span class="q">\"""" + query + """\"</span> &middot; """ + str(len(records)) + """ tracks</h1>
  <div class="grid">""" + cards + """</div></body></html>""")


def upsert_library(entry):
    lib = {"$doc": "Downloaded music tracks + their Soundstripe Content-ID license codes. license_code must be "
                   "placed in the YouTube/Facebook/IG video description to avoid copyright claims.", "tracks": []}
    if LIBRARY.exists():
        try:
            lib = json.loads(LIBRARY.read_text(encoding="utf-8"))
        except ValueError:
            pass
    lib["tracks"] = [t for t in (lib.get("tracks") or []) if t.get("objectID") != entry["objectID"]]
    lib["tracks"].append(entry)
    LIBRARY.write_text(json.dumps(lib, indent=2, ensure_ascii=False), encoding="utf-8", newline="\n")
    print("  library.json updated.")


def resolve_track(object_id, query):
    """(algolia record or None, title or None, the text that locates it). Exits when neither is known."""
    obj = algolia_get_object(object_id)
    title = obj.get("title") if isinstance(obj, dict) and obj.get("title") else None
    locate = query or title or ""
    if not locate:
        print("Could not resolve a title for", object_id, '- pass --query "<track title>".', file=sys.stderr)
        sys.exit(1)
    return obj, title, locate


def shot(page, name):
    try:
        page.screenshot(path=str(cache_path("music-sourcing", "recon", "shots", name)))
    except Exception:
        pass


def open_song_page(page, object_id, first_wait):
    """Load the library first (so the app emits its auth token), then go straight to the song's OWN
    page (objectID-exact). This avoids the fuzzy title search grabbing the wrong track on collisions
    (e.g. Diamonds / Like Diamonds / Chocolate Diamonds). On the song page the FIRST download control
    is the target track's own; "Similar Songs" rows follow below."""
    page.goto("https://www.soundstripe.com/library", wait_until="domcontentloaded")
    page.wait_for_timeout(first_wait)
    page.goto(f"https://www.soundstripe.com/library/songs/{object_id}", wait_until="domcontentloaded")
    page.wait_for_timeout(7000)


# ── commands ─────────────────────────────────────────────────────────────────
def cmd_search(a):
    r = algolia_search(a.query, limit=a.limit, all_partners=a.all_partners)
    records = [hit_to_record(h) for h in r["hits"]]
    CANDID.write_text(json.dumps({"query": a.query, "nbHits": r.get("nbHits"), "fetched": len(records),
                                  "at": iso_now(), "records": records}, indent=2, ensure_ascii=False),
                      encoding="utf-8", newline="\n")
    BOARD.write_text(build_board(a.query, records), encoding="utf-8", newline="\n")
    print(f'"{a.query}" -> {r.get("nbHits")} total, showing {len(records)}.')
    for x in records:
        print(f"  [{x['objectID']}] {js_str(x.get('title'))} — {', '.join(n or '' for n in x['artists'])} | "
              f"{mmss(x['duration_sec'])} | {js_str(x.get('bpm'))}bpm {js_str(x.get('energy'))} | {'/'.join(x['mood'])}")
    print(f"\nAudition board: {BOARD}")
    print("Download one:   python soundstripe.py download <objectID>")


def cmd_download(a):
    object_id = a.objectID
    dest = Path(a.dest) if a.dest else DEFAULT_DEST
    dest.mkdir(parents=True, exist_ok=True)

    # look the track up by objectID so we know its title
    obj, title, locate = resolve_track(object_id, a.query)
    print(f'Downloading [{object_id}] "{title or locate}" -> {dest}')

    state = {"license": None, "token": None, "posts": 0}
    downloads = []
    saved_file = None

    def on_request(req):
        u = req.url
        if "api.soundstripe.com" in u:
            # Soundstripe authenticates app API calls with this custom JWT header (NOT a Bearer /
            # cookie). Captured from any observed request, then replayed below to fetch the
            # Content-ID license code for this exact song.
            t = req.headers.get("x-soundstripe-auth-token")
            if t and not state["token"]:
                state["token"] = t
            if req.method == "POST" and ("/download" in u or "content_id_licenses" in u):
                try:
                    pd = req.post_data
                except Exception:
                    pd = None
                state["posts"] += 1
                print("  [POST]", u.replace("https://api.soundstripe.com", ""), "|", pd)

    def on_response(resp):
        if "content_id_licenses" in resp.url:
            try:
                j = resp.json()
                if j and j.get("code"):
                    state["license"] = j["code"]
            except Exception:
                pass

    with launch(slow_mo=60) as (ctx, page):
        page.on("request", on_request)
        page.on("response", on_response)
        page.on("download", lambda dl: downloads.append(dl))
        try:
            open_song_page(page, object_id, 5000)
            shot(page, "d1-results.png")
            if signed_in(page) is False:
                raise RuntimeError(NOT_SIGNED_IN)

            btn = download_control(page, object_id)
            btn.wait_for(timeout=15000)
            try:
                btn.scroll_into_view_if_needed()
            except Exception:
                pass
            click_center(page, btn)
            page.wait_for_timeout(4000)
            shot(page, "d2-after-click.png")

            # if a format/confirm dialog/menu appears, click its Download / MP3 control
            for sel in ['[role="dialog"] button:has-text("Download")', 'button:has-text("Download MP3")',
                        '[role="menuitem"]:has-text("MP3")', 'button:has-text("MP3")',
                        '[data-testid="download-button"] button', 'button:has-text("Download")']:
                b = page.locator(sel).first
                try:
                    hit = b.count() and b.is_visible()
                except Exception:
                    hit = False
                if hit:
                    print("  clicking format/confirm:", sel)
                    try:
                        b.click()
                    except Exception:
                        pass
                    page.wait_for_timeout(4000)
                    break
            page.wait_for_timeout(6000)  # allow download + license calls to settle
            shot(page, "d3-final.png")

            # Fallback (2026-10-14): some downloads fire NO api.soundstripe.com request at all (served
            # from cache), so no auth token is sniffed and the code cannot be minted below. The modal's
            # own "Generate YouTube Code" control POSTs /app/content_id_licenses for this song; the
            # response listener above captures the code (and the request sniffer captures the token).
            if not state["license"] and not state["token"]:
                gen = page.get_by_text("Generate YouTube Code", exact=True).first
                try:
                    hit = gen.count() and gen.is_visible()
                except Exception:
                    hit = False
                if hit:
                    print('  no API traffic seen; clicking "Generate YouTube Code" in the modal')
                    try:
                        gen.click()
                    except Exception as e:
                        print("  generate-code click err:", str(e).splitlines()[0])
                    page.wait_for_timeout(5000)

            # Fetch the YouTube / Content-ID license code directly (the download modal never fires it).
            # POST /app/content_id_licenses {"song_id":"<objectID>"} with the captured
            # x-soundstripe-auth-token -> {"code":"<16 chars>"}. (Mapped 2026-06-04 via supervised
            # capture; see cache/music-sourcing/recon/license-capture.json.) Each call mints a NEW
            # code, so this runs once per download and the stored value is the source of truth.
            if not state["license"] and state["token"]:
                try:
                    resp = page.request.post(
                        "https://api.soundstripe.com/app/content_id_licenses",
                        headers={"x-soundstripe-auth-token": state["token"],
                                 "content-type": "application/vnd.api+json", "accept": "application/vnd.api+json"},
                        data=json.dumps({"song_id": str(object_id)}, separators=(",", ":")))
                    try:
                        j = resp.json()
                    except Exception:
                        j = None
                    if j and j.get("code"):
                        state["license"] = j["code"]
                        print("  license code:", state["license"])
                    else:
                        print("  content_id_licenses returned", resp.status, json.dumps(j))
                except Exception as e:
                    print("  license fetch failed:", str(e).splitlines()[0])
            print("  auth token captured?", "true" if state["token"] else "false",
                  "| download/license POSTs seen:", state["posts"])
            save_session(ctx)
        except Exception as e:
            print("  download error:", str(e).splitlines()[0], file=sys.stderr)

        # save every download that started, waiting for each to finish before Chrome closes
        for dl in downloads:
            out = dest / (dl.suggested_filename or f"{object_id}.mp3")
            try:
                dl.save_as(str(out))
                saved_file = out
                print("  downloaded:", out.name)
            except Exception as e:
                print("  saveAs failed:", out.name, str(e).splitlines()[0])

    if saved_file:
        try:
            rel = os.path.relpath(saved_file, MUSIC_DIR)
        except ValueError:  # another drive
            rel = str(saved_file)
        upsert_library({"objectID": object_id, "title": title, "file": rel, "license_code": state["license"],
                        "source": "soundstripe", "downloaded_at": iso_now(),
                        "meta": hit_to_record(obj) if obj else None})
        print(f"\nDONE. file: {saved_file}\n      license_code: "
              f"{state['license'] or '(NOT captured: check Soundstripe download section)'}")
    else:
        print("\nNo file downloaded. The download click flow needs adjustment "
              "(see screenshots / re-run supervised).", file=sys.stderr)
        sys.exit(2)


def cmd_download_alt(a):
    """The "Alternate Versions" zip (the broken-up section cuts: chorus / verse / intro / bridge,
    instrumental + bg-vocal mixes) as one WAV zip, the same bundle the UI's Download-Song modal offers
    under "Alternate Versions". With --stems also the "Stems" zip. Does NOT touch library.json: the
    section files are registered in assets/music/library.json (the canonical catalog) after unzip,
    since the master full-track entry already lives there. Same modal / auth flow as download."""
    object_id = a.objectID
    dest = Path(a.dest) if a.dest else DEFAULT_DEST
    want_stems, want_alt = a.stems, not a.no_alt  # --no-alt skips the alternate-versions zip (stems only)
    dest.mkdir(parents=True, exist_ok=True)

    _obj, title, locate = resolve_track(object_id, a.query)
    print(f'Alt-tracks for [{object_id}] "{title or locate}" -> {dest}{" (+stems)" if want_stems else ""}')

    downloads = []
    saved = []

    def click_wav(row_name, label, settle):
        row = modal_row(page, row_name)
        if not row.count():
            return False
        wav = row.locator('button:has-text("WAV")').first
        if wav.count():
            try:
                wav.scroll_into_view_if_needed()
            except Exception:
                pass
            try:
                wav.click()
            except Exception as e:
                print(f"  {label} WAV click err:", str(e).splitlines()[0])
            page.wait_for_timeout(settle)
        elif label == "alt":
            print("  no WAV button in Alternate Versions row")
        return True

    with launch(slow_mo=60) as (ctx, page):
        def on_download(dl):
            print("  saving:", dl.suggested_filename or f"{object_id}_alt.zip", "...")
            downloads.append(dl)

        page.on("download", on_download)
        try:
            open_song_page(page, object_id, 4000)

            # open the Download-Song modal (same control the full-track download uses)
            if signed_in(page) is False:
                raise RuntimeError(NOT_SIGNED_IN)
            lic = download_control(page, object_id)
            lic.wait_for(timeout=15000)
            click_center(page, lic)
            page.wait_for_timeout(4000)
            shot(page, "alt1-modal.png")

            # Alternate Versions zip: its row has its own WAV button that bundles every section cut
            # into <Title>_alternate_tracks_wav.zip
            if want_alt and not click_wav("Alternate Versions", "alt", 7000):
                print('  NO "Alternate Versions" section for this track (nothing to grab).')
            # Stems zip (optional): the "Stems" row has a WAV button -> <Title>_stems_wav.zip
            if want_stems and not click_wav("Stems", "stems", 8000):
                print('  NO "Stems" section for this track.')
            shot(page, "alt2-final.png")
            save_session(ctx)
        except Exception as e:
            print("  download-alt error:", str(e).splitlines()[0], file=sys.stderr)

        # wait for every started download to finish writing before closing the browser (alternate /
        # stems zips can be 150MB+ and outrun a fixed timer)
        if downloads:
            print(f"  waiting for {len(downloads)} download(s) to finish...")
        for dl in downloads:
            out = dest / (dl.suggested_filename or f"{object_id}_alt.zip")
            try:
                dl.save_as(str(out))
                saved.append(out)
                print("  downloaded:", out.name)
            except Exception as e:
                print("  saveAs failed:", out.name, str(e).splitlines()[0])

    if saved:
        print(f"\nDONE. {len(saved)} file(s):\n  " + "\n  ".join(s.name for s in saved))
    else:
        print("\nNo file downloaded (no alternate versions, or the click flow needs adjustment: "
              "see cache/music-sourcing/recon/shots/alt*.png).", file=sys.stderr)
        sys.exit(2)


def cmd_login(a):
    """Open the soundstripe-profile Chrome on the sign-in page, wait (up to --wait minutes, default 10)
    for Mike to sign in, then persist the cookies to cache/music-sourcing/recon/session-cookies.json so
    every later download / download-alt run can re-inject them (the login cookie is session-only)."""
    probe_url = "https://www.soundstripe.com/library/songs/15847"
    ok = False
    with launch(slow_mo=0, mask=False) as (ctx, page):
        page.goto(probe_url, wait_until="domcontentloaded")
        page.wait_for_timeout(5000)
        if signed_in(page) is True:
            save_session(ctx)
            print("Already signed in; session saved to", SESSION)
            return
        page.goto("https://app.soundstripe.com/login", wait_until="domcontentloaded")
        print(f"Sign in to Soundstripe in the Chrome window that just opened. Waiting up to {a.wait:g} min...",
              flush=True)
        deadline = time.time() + a.wait * 60
        while time.time() < deadline:
            page.wait_for_timeout(5000)
            probe = ctx.new_page()
            try:
                probe.goto(probe_url, wait_until="domcontentloaded")
                probe.wait_for_timeout(3000)
                if signed_in(probe) is True:
                    ok = True
            except Exception:
                pass
            try:
                probe.close()
            except Exception:
                pass
            if ok:
                break
        if ok:
            save_session(ctx)
            print("Signed in. Session saved to", SESSION)
        else:
            print("Timed out waiting for sign-in; nothing saved.", file=sys.stderr)
    if not ok:
        sys.exit(2)


def main():
    ap = argparse.ArgumentParser(description="Soundstripe search + download (see ../SKILL.md)")
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("login")
    s.add_argument("--wait", type=float, default=10)
    s.set_defaults(fn=cmd_login)
    s = sub.add_parser("search")
    s.add_argument("query")
    s.add_argument("--limit", type=int, default=24)
    s.add_argument("--all-partners", action="store_true")
    s.set_defaults(fn=cmd_search)
    for name, fn in (("download", cmd_download), ("download-alt", cmd_download_alt)):
        s = sub.add_parser(name)
        s.add_argument("objectID")
        s.add_argument("--query")
        s.add_argument("--dest")
        if name == "download-alt":
            s.add_argument("--stems", action="store_true")
            s.add_argument("--no-alt", action="store_true")
        s.set_defaults(fn=fn)
    a = ap.parse_args()
    a.fn(a)


if __name__ == "__main__":
    main()
