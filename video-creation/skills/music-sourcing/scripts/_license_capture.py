#!/usr/bin/env python
"""
_license_capture.py: SUPERVISED recon, for when the license-code step of `soundstripe.py download`
stops working. Opens the logged-in soundstripe-profile browser. Mike navigates to wherever he gets the
YouTube / Content-ID code for a downloaded track (Profile > Downloads, the YouTube icon on the row) and
triggers it. This captures the EXACT request that produces the code (method, url, request headers incl.
the auth token, request body) plus the response, and dumps it to
    video-creation/cache/music-sourcing/recon/license-capture.json
so the replay in soundstripe.py can be rewired. It also records every /songs/sales and
/songs/*/download call (the likely precursors that carry the sale / song id the license call
references). First used 2026-06-04: that is how the content_id_licenses call was mapped.
Python port of _license-capture.js (2026-11-23).

    python _license_capture.py
"""
import json
import re

from soundstripe import cache_path, iso_now, launch

OUT = cache_path("music-sourcing", "recon", "license-capture.json")
WATCH = re.compile(r"content_id_licenses|/songs/sales|/songs/\d+/download|copyright", re.IGNORECASE)
API = "https://api.soundstripe.com"
cap = {"started": iso_now(), "bearer": None, "events": [], "license": None}


def save():
    OUT.write_text(json.dumps(cap, indent=2, ensure_ascii=False), encoding="utf-8", newline="\n")


def on_request(req):
    u = req.url
    if "api.soundstripe.com" not in u:
        return
    auth = req.headers.get("authorization")
    if auth and not cap["bearer"]:
        cap["bearer"] = auth
        save()
    if WATCH.search(u):
        try:
            pd = req.post_data
        except Exception:
            pd = None
        cap["events"].append({"t": iso_now(), "method": req.method, "url": u, "headers": dict(req.headers),
                              "postData": pd, "resourceType": req.resource_type})
        save()
        print(f"[REQ] {req.method} {u.replace(API, '')}  body={pd or '(none)'}", flush=True)


def on_response(resp):
    u = resp.url
    if not WATCH.search(u):
        return
    try:
        body = resp.text()
    except Exception:
        body = None
    ev = next((e for e in cap["events"] if e["url"] == u and not e.get("_status")), None)
    if ev:
        ev["_status"] = resp.status
        ev["_response"] = body
    print(f"[RESP] {resp.status} {u.replace(API, '')}  -> {(body or '')[:120]}", flush=True)
    if "content_id_licenses" in u and body and '"code"' in body:
        try:
            cap["license"] = {
                "code": json.loads(body).get("code"),
                "request": next((e for e in cap["events"]
                                 if "content_id_licenses" in e["url"] and e["method"] == "POST"), None),
            }
        except ValueError:
            pass
        cap["captured_at"] = iso_now()
        save()
        lic = cap["license"] or {}
        print("\n*** LICENSE CODE CAPTURED -> " + str(lic.get("code")) + " ***")
        print("*** request body: " + json.dumps((lic.get("request") or {}).get("postData")) + " ***")
        print(f"Capture written to {OUT}. You can close the browser now.\n", flush=True)


def main():
    with launch(slow_mo=40) as (ctx, page):
        page.on("request", on_request)
        page.on("response", on_response)
        try:
            page.goto("https://www.soundstripe.com/library", wait_until="domcontentloaded")
        except Exception:
            pass
        print("\n================= SUPERVISED CAPTURE READY =================")
        print("Browser is open and logged in. Now: go to wherever you normally GET")
        print("the YouTube / Content-ID code for a downloaded track")
        print("  (Profile > Downloads, the YouTube icon on the track's row),")
        print("and click whatever reveals/copies the 16-char code.")
        print('I am recording. When you see "LICENSE CODE CAPTURED" you can close the tab.')
        print(f"Capture file: {OUT}")
        print("===========================================================\n", flush=True)

        # keep alive until the browser is closed by Mike (or a 15 min safety cap)
        try:
            ctx.wait_for_event("close", timeout=15 * 60 * 1000)
        except Exception:
            pass
        cap["ended"] = iso_now()
        save()
    print(f"Capture session ended. Wrote {OUT}")


if __name__ == "__main__":
    main()
