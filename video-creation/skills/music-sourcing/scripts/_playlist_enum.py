#!/usr/bin/env python
"""
_playlist_enum.py: open a private Soundstripe playlist with the authed profile, sniff the app API, and
dump the playlist's songs (id + title + artists) to
video-creation/cache/music-sourcing/recon/playlist-<id>.json. Step 1 of bulk-downloading a playlist
(SKILL.md 2b). Python port of _playlist-enum.js (2026-11-23).

    python _playlist_enum.py <playlistId>
"""
import json
import re
import sys

from soundstripe import algolia_get_object, cache_dir, launch

RECON = cache_dir("music-sourcing", "recon")
IDS_JS = """() => { const out = [];
  document.querySelectorAll('a[href*="/library/songs/"], [data-download-handoff-media-id-value]').forEach((el) => {
    const m = (el.getAttribute('href') || '').match(/\\/library\\/songs\\/(\\d+)/);
    const id = m ? m[1] : el.getAttribute('data-download-handoff-media-id-value');
    if (id && /^\\d+$/.test(id) && !out.includes(id)) out.push(id);
  });
  return out; }"""


def dump(name, obj, indent=2):
    (RECON / name).write_text(json.dumps(obj, indent=indent, ensure_ascii=False), encoding="utf-8", newline="\n")


def main():
    if len(sys.argv) < 2:
        print("Usage: python _playlist_enum.py <playlistId>", file=sys.stderr)
        sys.exit(1)
    playlist_id = sys.argv[1]

    api_hits = []  # {url, status, keys}
    state = {"token": None}
    songs = []

    def on_request(req):
        t = req.headers.get("x-soundstripe-auth-token")
        if t and not state["token"]:
            state["token"] = t

    def on_response(resp):
        u = resp.url
        if "api.soundstripe.com" in u:
            try:
                j = resp.json()
            except Exception:
                j = None
            api_hits.append({"url": u.replace("https://api.soundstripe.com", ""), "status": resp.status,
                             "keys": list(j.keys()) if isinstance(j, dict) and j else None})

    # The login cookie is session-only since 2026-10: launch() re-injects the cookies
    # `soundstripe.py login` saved.
    with launch(slow_mo=40) as (_ctx, page):
        page.on("request", on_request)
        page.on("response", on_response)
        try:
            page.goto("https://www.soundstripe.com/library", wait_until="domcontentloaded")
            page.wait_for_timeout(4000)
            page.goto(f"https://www.soundstripe.com/library/private_playlists/music/{playlist_id}",
                      wait_until="domcontentloaded")
            page.wait_for_timeout(9000)
            # scroll to force lazy-loaded songs to fetch
            for _ in range(8):
                page.mouse.wheel(0, 2000)
                page.wait_for_timeout(1200)
            try:
                page.screenshot(path=str(RECON / f"playlist-{playlist_id}.png"), full_page=True)
            except Exception:
                pass
        except Exception as e:
            print("nav error:", str(e).splitlines()[0], file=sys.stderr)

        # If we captured the auth token, hit the playlist API directly with a big page size, paging
        # through JSON:API links until exhausted.
        if state["token"]:
            limit = 100
            offset = 0
            for _ in range(40):
                url = (f"https://api.soundstripe.com/app/playlists/{playlist_id}/songs"
                       f"?page%5Boffset%5D={offset}&page%5Blimit%5D={limit}")
                try:
                    resp = page.request.get(url, headers={"x-soundstripe-auth-token": state["token"],
                                                          "accept": "application/vnd.api+json"})
                    try:
                        j = resp.json()
                    except Exception:
                        j = None
                except Exception as e:
                    print("page fetch err:", str(e).splitlines()[0])
                    break
                if not j:
                    break
                dump(f"playlist-api-{playlist_id}-off{offset}.json", j)
                data = j.get("data")
                data = data if isinstance(data, list) else ([data] if data else [])
                artists_by_id = {inc.get("id"): (inc.get("attributes") or {}).get("name")
                                 for inc in (j.get("included") or []) if re.search("artist", inc.get("type") or "", re.I)}
                for s in data:
                    if not re.search("song", s.get("type") or "", re.I):
                        continue
                    attrs = s.get("attributes") or {}
                    rel = ((s.get("relationships") or {}).get("artists") or {}).get("data") or []
                    arts = [artists_by_id.get(x.get("id")) for x in rel]
                    songs.append({"id": str(s.get("id")), "title": attrs.get("title"),
                                  "artists": [x for x in arts if x],
                                  "duration": attrs.get("primary_audio_file_duration") or attrs.get("duration")})
                if len(data) < limit:
                    break  # last page
                offset += limit

        # DOM fallback (2026-10): the playlist page is server-rendered now and makes no
        # api.soundstripe.com calls, so no token is sniffed. Read the song ids off the rows (song links
        # + the download-handoff anchors, in page order), then resolve title / artists / duration from
        # Algolia getObject.
        if not songs:
            try:
                ids = page.evaluate(IDS_JS)
            except Exception:
                ids = []
            for sid in ids:
                hit = algolia_get_object(sid, ok_only=True) or {}
                artists = [(x if isinstance(x, str) else (x or {}).get("name")) for x in (hit.get("artists") or [])]
                songs.append({"id": sid, "title": hit.get("title") or None,
                              "artists": [x for x in artists if x],
                              "duration": hit.get("primary_audio_file_duration") or None, "source": "dom"})

    # dedupe by id
    uniq = []
    seen = set()
    for s in songs:
        if s["id"] not in seen:
            seen.add(s["id"])
            uniq.append(s)

    dump(f"playlist-{playlist_id}.json",
         {"playlistId": playlist_id, "authToken": "(captured)" if state["token"] else None,
          "count": len(uniq), "songs": uniq})
    # dump all raw api hit urls so we can find the right endpoint if the guesses missed
    dump(f"playlist-{playlist_id}-apihits.json", api_hits)

    print("auth token:", "captured" if state["token"] else "MISSING")
    print("songs found:", len(uniq))
    for s in uniq:
        print(f"  [{s['id']}] {s['title']} — {', '.join(s.get('artists') or [])}")
    print(f"\nApi hits observed: {len(api_hits)} (see cache/music-sourcing/recon/playlist-{playlist_id}-apihits.json)")


if __name__ == "__main__":
    main()
