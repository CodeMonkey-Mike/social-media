#!/usr/bin/env python
"""
usage_ledger.py — the VARIETY ledger: which music and which transitions every finished video used,
so the next video picks something else (Mike, 2026-10-01: "make use of basically all our transitions
and all of our background music over time"). Canonical doc: usage-ledger.md (this folder).

ONE source of truth: video-creation/assets/usage-ledger.json (outside every project folder, because
project folders are deleted after publish). The catalogs' own `used_in` fields are frozen legacy notes;
nothing writes them any more.

Commands
  record  --project <name|dir> [--track longform-edited] [--date YYYY-MM-DD] [--source graph|backfill]
          Read the project's MUSIC-PLAN.json + TRANSITION-PLAN.json (or TRANSITIONS.md when there is no
          JSON plan) and upsert its entry in the ledger. Idempotent. The longform graph runs it in
          `stage_longform` (the moment a video is delivered).
  check   --project <name|dir> [--what music|transitions|all] [--track ...]
          The variety GATE for a plan that is not delivered yet. FAIL = it repeats the PREVIOUS video
          (same track of work) in a rotating pool/slot with no waiver; WARN = it repeats one of the last
          three. Machine line: USAGE-LINT PASS|FAIL what=<w> fails=N warns=N
  report  [--what music|transitions|all] [--exclude-project <name>] [--track ...] [--json] [--top N]
          What the strategists read before they pick: per pool/slot, what the previous video used
          (BLOCKED), what the last three used (avoid), and the candidates ranked never-used first, then
          least recently used.

POOLS (music, one rotation each): intro_hype (the track that opens the video) · subtle_bed (gear-2
explainer beds) · hype_body (aggressive mid-video beds) · epic_close (the track on the final chapter).
A track the previous video used in ANY pool is blocked for the next video.

SLOTS (transitions): ROTATING, gated: card (the one title-card move) · marquee_melt · marquee_spin (the
look, i.e. library category/variant). ADVISORY, reported only: face_cut (film burn vs the Blocks glitch is
a per-video pick) · ai_still. CONSTANT house style, never rotated: punch_in · broll (dissolve) ·
container (cross-fade + scale-in) · image_broll (cross-warp).

Waiver (Mike's explicit call only): a top-level `"usage_waivers": {"<track id | card name | CATEGORY/Variant>":
"who, when, why"}` in MUSIC-PLAN.json / TRANSITION-PLAN.json turns that FAIL into a WARN.
Exit: 0 = ok / PASS · 1 = FAIL · 2 = usage.
"""
import argparse
import json
import re
import sys
from collections import Counter, defaultdict
from datetime import date, datetime
from pathlib import Path

sys.stdout.reconfigure(encoding="utf-8", errors="replace")

HERE = Path(__file__).resolve().parent
REPO = HERE.parents[2]
LEDGER = REPO / "video-creation" / "assets" / "usage-ledger.json"
MUSIC_LIB = REPO / "video-creation" / "assets" / "music" / "library.json"
TRANS_LIB = REPO / "video-creation" / "assets" / "transitions" / "library.json"
MEDIA = REPO / "video-creation" / "longform-edited" / "media"

POOLS = ("intro_hype", "subtle_bed", "hype_body", "epic_close")
POOL_ROLE = {"intro_hype": "intro_hype", "subtle_bed": "explainer_bed", "hype_body": "hype_peak", "epic_close": "epic_outro"}
ROTATING = ("card", "marquee_melt", "marquee_spin")
ADVISORY = ("face_cut", "ai_still")
CONSTANT = ("punch_in", "broll", "container", "image_broll")
CARD_NAMES = {"cube", "flip", "slide", "book-flip", "swap", "fade"}
CARD_SAFE = ("cube", "flip", "slide")            # book-flip / swap need the canvas render flag
RECENT_N = 3


# ---------------------------------------------------------------- catalogs
def music_catalog():
    return json.loads(MUSIC_LIB.read_text(encoding="utf-8"))["tracks"]


def trans_catalog():
    raw = json.loads(TRANS_LIB.read_text(encoding="utf-8"))
    return {r["id"]: r for r in raw["transitions"]}


def roles_of(t):
    return set(t.get("roles") or []) | set((t.get("analysis") or {}).get("roles") or []) | set(t.get("roles_pinned") or [])


def match_track(source_file, cat):
    """A bed's source_file -> the catalog track id (by the track's folder, then by file name)."""
    norm = str(source_file).replace("\\", "/").lower()
    parts = [p for p in norm.split("/") if p]
    for t in cat:
        folder = str(t.get("folder", "")).replace("\\", "/").lower().rstrip("/").split("/")[-1]
        if folder and folder in parts:
            return t["id"]
    name = parts[-1] if parts else ""
    for t in cat:
        files = [str(t.get("primary_file", "")).lower()] + [str(s.get("file", "")).lower() for s in t.get("sections") or []]
        if name and name in files:
            return t["id"]
    return "unknown:" + (parts[-2] if len(parts) > 1 else name or "?")


def tkey(tid, lib):
    """The ROTATION key of a transition id: library rows rotate by look (CATEGORY/Variant, 'Short' folded
    in), hand / rmn moves by their name ('cube-3d' and 'cube' are the same card move)."""
    src, _, name = tid.partition(":")
    if src == "lib":
        r = lib.get(name) or next((v for k, v in sorted(lib.items()) if k.startswith(name + "-")), None)
        if r:
            return f"{r['category']}/{re.sub(r' Short$', '', r['variant'])}"
        return f"lib/{name}"
    return re.sub(r"-3d$", "", name)


def slot_of(tid, key, bucket="", role=""):
    b, r = bucket.lower(), role.lower()
    if b == "card" or r == "card":
        return "card"
    if r == "face-cut":
        return "face_cut"
    if r == "punch-in":
        return "punch_in"
    if r == "glitch-still" or b == "ai-still":
        return "ai_still"
    if r.startswith("melt"):
        return "marquee_melt"
    if r.startswith("spin"):
        return "marquee_spin"
    if r == "broll-fade" or b == "broll":
        return "broll"
    if r == "container-xfade" or b == "container":
        return "container"
    # no bucket / role (a TRANSITIONS.md backfill, or an unknown row): place it by what the move IS
    src, _, name = tid.partition(":")
    if src in ("rmn", "hand") and key in CARD_NAMES and name != "fade":
        return "card"
    if src == "rmn":
        return "card"
    if name == "punch":
        return "punch_in"
    if name in ("fade",):
        return "broll"
    if name.startswith("xfade"):
        return "container"
    if name == "cross-warp":
        return "image_broll"
    if name in ("filmburn", "film-burn"):
        return "face_cut"
    if key.startswith("MELT/"):
        return "marquee_melt"
    if key.startswith("SPIN/"):
        return "marquee_spin"
    if key == "GLITCH/Blocks":
        return "face_cut"
    if key == "GLITCH/Cinematic Bad Signal":
        return "ai_still"
    return b or "other"


# ---------------------------------------------------------------- reading a project
def project_dir(name_or_path):
    p = Path(name_or_path)
    return p.resolve() if (p.is_absolute() or p.is_dir()) else (MEDIA / name_or_path).resolve()


def music_of(proj: Path, cat):
    f = proj / "MUSIC-PLAN.json"
    if not f.is_file():
        return None, {}
    plan = json.loads(f.read_text(encoding="utf-8"))
    beds = sorted(plan.get("beds") or [], key=lambda b: float(b["span"][0]))
    agg = {}
    for i, b in enumerate(beds):
        tid = match_track(b.get("source_file", ""), cat)
        inten, reg = str(b.get("intensity", "")).lower(), str(b.get("register", "")).lower()
        loud = any(w in inten for w in ("aggress", "build", "rising")) or any(w in reg for w in ("epic", "rising", "building", "lifting", "spike"))
        pool = "subtle_bed" if ("subtle" in inten or "dip" in inten or ("gear-2" in reg and not loud)) else "hype_body"
        pools = {pool}
        if i == 0:
            pools = {"intro_hype"}
        if i == len(beds) - 1:
            pools = {"epic_close"} if i else {"intro_hype", "epic_close"}
        row = agg.setdefault(tid, {"id": tid, "pools": set(), "chapters": []})
        row["pools"] |= pools
        ch = str(b.get("chapter", "")).replace(" ", "")
        if ch and ch not in row["chapters"]:
            row["chapters"].append(ch)
    rows = [{"id": r["id"], "pools": sorted(r["pools"], key=POOLS.index), "chapters": r["chapters"]} for r in agg.values()]
    return rows, (plan.get("usage_waivers") or {})


def transitions_of(proj: Path, lib):
    """(rows, waivers, source). Prefers TRANSITION-PLAN.json (bucket + role known); falls back to the prefixed
    ids written in TRANSITIONS.md (older videos), where the slot is derived from what the move is."""
    f = proj / "TRANSITION-PLAN.json"
    counts, waivers, source = Counter(), {}, None
    if f.is_file():
        plan = json.loads(f.read_text(encoding="utf-8"))
        waivers, source = (plan.get("usage_waivers") or {}), "plan"
        for r in plan.get("transitions") or []:
            tid, src = str(r.get("id", "")), str(r.get("source", "")).strip().lower()
            if tid and not re.match(r"^(rmn|lib|hand):", tid) and src in ("lib", "rmn", "hand"):
                tid = f"{src}:{tid}"
            if not re.match(r"^(rmn|lib|hand):", tid):
                continue
            key = tkey(tid, lib)
            counts[(slot_of(tid, key, str(r.get("bucket", "")), str(r.get("role", ""))), tid, key)] += 1
    else:
        md = proj / "TRANSITIONS.md"
        if not md.is_file():
            return None, {}, None
        source = "transitions-md"
        for m in re.finditer(r"(?<![A-Za-z0-9-])((?:lib|rmn|hand):[a-z0-9]+(?:-[a-z0-9]+)*)", md.read_text(encoding="utf-8")):
            tid = m.group(1)
            key = tkey(tid, lib)
            counts[(slot_of(tid, key), tid, key)] += 1
    rows = [{"slot": s, "id": i, "key": k, "count": n} for (s, i, k), n in sorted(counts.items())]
    return rows, waivers, source


def delivered_date(proj: Path):
    finals = sorted(proj.glob("*-FINAL.mp4"), key=lambda p: p.stat().st_mtime)
    if finals:
        return datetime.fromtimestamp(finals[-1].stat().st_mtime).date().isoformat()
    return None


# ---------------------------------------------------------------- ledger
def load_ledger():
    if LEDGER.is_file():
        return json.loads(LEDGER.read_text(encoding="utf-8"))
    return {"$doc": "Usage ledger: the music and the transitions every finished video used, so the next video picks "
                    "something else. Written by video-creation/skills/usage-ledger/usage_ledger.py (record), read by its "
                    "report / check commands. One entry per video, oldest first. Do not hand-edit picks; re-run record.",
            "videos": []}


def save_ledger(data):
    data["videos"].sort(key=lambda v: (v.get("date") or "", v.get("project") or ""))
    LEDGER.write_text(json.dumps(data, indent=1, ensure_ascii=False) + "\n", encoding="utf-8", newline="\n")


def history(ledger, track, exclude=None):
    vids = [v for v in ledger["videos"] if v.get("track") == track and v.get("project") != exclude]
    return sorted(vids, key=lambda v: (v.get("date") or "", v.get("project") or ""))


# ---------------------------------------------------------------- commands
def cmd_record(a):
    proj = project_dir(a.project)
    if not proj.is_dir():
        print(f"usage: no such project folder {proj}", file=sys.stderr)
        return 2
    cat, lib = music_catalog(), trans_catalog()
    music, _ = music_of(proj, cat)
    trans, _, tsrc = transitions_of(proj, lib)
    if music is None and trans is None:
        print(f"USAGE-RECORD FAIL project={proj.name} (no MUSIC-PLAN.json, TRANSITION-PLAN.json or TRANSITIONS.md)")
        return 1
    entry = {"project": proj.name, "track": a.track, "date": a.date or delivered_date(proj) or date.today().isoformat(),
             "source": a.source, "transitions_from": tsrc, "music": music or [], "transitions": trans or []}
    led = load_ledger()
    led["videos"] = [v for v in led["videos"] if v.get("project") != proj.name] + [entry]
    save_ledger(led)
    print(f"USAGE-RECORD ok project={proj.name} date={entry['date']} music={len(entry['music'])} "
          f"transition_rows={sum(t['count'] for t in entry['transitions'])} ledger={LEDGER}")
    return 0


def _used_music(vids):
    """track id -> [(date, project, pools)] newest last."""
    out = defaultdict(list)
    for v in vids:
        for m in v.get("music") or []:
            out[m["id"]].append((v.get("date"), v["project"], m.get("pools") or []))
    return out


def _used_keys(vids, slot):
    out = defaultdict(list)
    for v in vids:
        for t in v.get("transitions") or []:
            if t["slot"] == slot:
                if not out[t["key"]] or out[t["key"]][-1][1] != v["project"]:
                    out[t["key"]].append((v.get("date"), v["project"]))
    return out


def cmd_check(a):
    proj = project_dir(a.project)
    cat, lib = music_catalog(), trans_catalog()
    vids = history(load_ledger(), a.track, exclude=proj.name)
    prev, recent = (vids[-1] if vids else None), vids[-RECENT_N:]
    fails, warns, infos = [], [], []
    if not vids:
        infos.append("the ledger has no earlier video for this track: nothing to rotate against")
    if a.what in ("music", "all"):
        music, waivers = music_of(proj, cat)
        if music is None:
            infos.append("no MUSIC-PLAN.json yet")
        else:
            prev_ids = {m["id"] for m in (prev or {}).get("music") or []}
            recent_ids = {m["id"]: v["project"] for v in recent for m in v.get("music") or []}
            for m in music:
                tid = m["id"]
                where = f"{tid} ({'+'.join(m['pools'])}, {','.join(m['chapters'])})"
                if tid.startswith("unknown:"):
                    warns.append(f"music: {where} is not a catalog track, so its use cannot be rotated (promote it to library.json or accept)")
                elif tid in prev_ids:
                    if waivers.get(tid):
                        warns.append(f"music: {where} repeats the previous video ({prev['project']}), WAIVED: {waivers[tid]}")
                    else:
                        fails.append(f"music: {where} was used in the previous video ({prev['project']}); pick another track, "
                                     f"or add \"usage_waivers\": {{\"{tid}\": \"<Mike's call>\"}} to MUSIC-PLAN.json")
                elif tid in recent_ids:
                    warns.append(f"music: {where} was used {len([1 for v in recent if any(x['id'] == tid for x in v.get('music') or [])])}x in the last {len(recent)} videos (last: {recent_ids[tid]})")
    if a.what in ("transitions", "all"):
        trans, waivers, tsrc = transitions_of(proj, lib)
        if trans is None:
            infos.append("no TRANSITION-PLAN.json yet")
        else:
            for slot in ROTATING:
                mine = sorted({t["key"] for t in trans if t["slot"] == slot})
                prev_keys = {t["key"] for t in (prev or {}).get("transitions") or [] if t["slot"] == slot}
                recent_keys = {t["key"] for v in recent for t in v.get("transitions") or [] if t["slot"] == slot}
                for k in mine:
                    if k in prev_keys:
                        if waivers.get(k):
                            warns.append(f"transitions: {slot} = {k} repeats the previous video ({prev['project']}), WAIVED: {waivers[k]}")
                        else:
                            fails.append(f"transitions: {slot} = {k} is the same look the previous video ({prev['project']}) used; "
                                         f"pick another, or add \"usage_waivers\": {{\"{k}\": \"<Mike's call>\"}} to TRANSITION-PLAN.json")
                    elif k in recent_keys:
                        warns.append(f"transitions: {slot} = {k} was used in the last {len(recent)} videos")
            for slot in ADVISORY:
                mine = sorted({t["key"] for t in trans if t["slot"] == slot})
                prev_keys = sorted({t["key"] for t in (prev or {}).get("transitions") or [] if t["slot"] == slot})
                if mine:
                    infos.append(f"transitions: {slot} = {', '.join(mine)} (previous video: {', '.join(prev_keys) or 'none'}; advisory, not gated)")
    for i in infos:
        print(f"INFO  {i}")
    for w in warns:
        print(f"WARN  {w}")
    for f in fails:
        print(f"FAIL  {f}")
    print(f"USAGE-LINT {'FAIL' if fails else 'PASS'} what={a.what} fails={len(fails)} warns={len(warns)} "
          f"previous={(prev or {}).get('project', 'none')} project={proj.name}")
    return 1 if fails else 0


def _music_report(vids, cat, top):
    used = _used_music(vids)
    prev, recent = (vids[-1] if vids else None), vids[-RECENT_N:]
    prev_ids = {m["id"] for m in (prev or {}).get("music") or []}
    recent_ids = {m["id"] for v in recent for m in v.get("music") or []}
    pools = {}
    for pool in POOLS:
        role = POOL_ROLE[pool]
        cands = []
        for t in cat:
            if role not in roles_of(t):
                continue
            a = t.get("analysis") or {}
            h = used.get(t["id"], [])
            legacy = bool(t.get("used_in"))
            status = "BLOCKED" if t["id"] in prev_ids else ("recent" if t["id"] in recent_ids else ("fresh" if not h and not legacy else "used"))
            cands.append({"id": t["id"], "status": status, "times_used": len(h), "last_used": (h[-1][0] if h else None),
                          "last_project": (h[-1][1] if h else None), "legacy_use": (t.get("used_in") or [None])[0] if legacy and not h else None,
                          "aggression": a.get("aggression"), "bpm": t.get("bpm"), "duration_sec": a.get("duration_sec") or t.get("duration_sec"),
                          "opening": a.get("opening"), "ending": a.get("ending"), "mood": t.get("mood") or [],
                          "has_license_code": bool(t.get("yt_license_code"))})
        order = {"fresh": 0, "used": 1, "recent": 2, "BLOCKED": 3}

        def fit(c, pool=pool):
            """Within one freshness tier, list the likeliest fits first (a hint, never a substitute for judgment)."""
            ag = c["aggression"] if c["aggression"] is not None else 50
            if pool == "subtle_bed":
                return (ag,)                                        # the quietest beds first
            if pool == "intro_hype":
                return (0 if c["opening"] == "cold_hot" else 1, -ag)   # hot on word one
            if pool == "epic_close":
                return (0 if c["ending"] == "epic_hit" else 1, -ag)    # ends big
            return (-ag,)

        cands.sort(key=lambda c: (order[c["status"]], c["times_used"], c["last_used"] or "") + fit(c))
        pools[pool] = {"catalog_role": role,
                       "previous_video": sorted(m["id"] for m in (prev or {}).get("music") or [] if pool in (m.get("pools") or [])),
                       "counts": dict(Counter(c["status"] for c in cands)), "candidates": cands}
    return {"previous_video": (prev or {}).get("project"), "previous_date": (prev or {}).get("date"),
            "blocked_tracks": sorted(prev_ids), "recent_tracks": sorted(recent_ids - prev_ids), "pools": pools}


def _trans_report(vids, lib):
    prev, recent = (vids[-1] if vids else None), vids[-RECENT_N:]
    fams = defaultdict(list)
    for r in lib.values():
        fams[f"{r['category']}/{re.sub(r' Short$', '', r['variant'])}"].append(r["id"])
    used_ids = Counter(t["id"].split(":", 1)[1] for v in vids for t in v.get("transitions") or [] if t["id"].startswith("lib:"))
    slots = {}
    for slot in ROTATING + ADVISORY:
        used = _used_keys(vids, slot)
        prev_keys = sorted({t["key"] for t in (prev or {}).get("transitions") or [] if t["slot"] == slot})
        recent_keys = sorted({t["key"] for v in recent for t in v.get("transitions") or [] if t["slot"] == slot})
        if slot == "card":
            options = list(CARD_SAFE) + ["book-flip", "swap"]
        elif slot.startswith("marquee_"):
            options = sorted(k for k in fams if k.startswith(slot.split("_")[1].upper() + "/"))
        elif slot == "face_cut":
            options = ["film-burn", "GLITCH/Blocks"]
        else:
            options = sorted(k for k in fams if k.startswith("GLITCH/"))
        rows = []
        for k in options:
            h = used.get(k, [])
            status = ("BLOCKED" if (k in prev_keys and slot in ROTATING) else "recent" if k in recent_keys else "fresh" if not h else "used")
            rows.append({"key": k, "status": status, "times_used": len(h), "last_used": (h[-1][0] if h else None),
                         "last_project": (h[-1][1] if h else None), "library_ids": len(fams.get(k, []))})
        order = {"fresh": 0, "used": 1, "recent": 2, "BLOCKED": 3}
        rows.sort(key=lambda c: (order[c["status"]], c["times_used"], c["last_used"] or ""))
        slots[slot] = {"gated": slot in ROTATING, "previous_video": prev_keys, "options": rows}
    coverage = {}
    for cat_name in sorted({r["category"] for r in lib.values()}):
        ids = [i for i, r in lib.items() if r["category"] == cat_name]
        looks = sorted({k for k in fams if k.startswith(cat_name + "/")})
        used_looks = sorted({k for k in looks if any(used_ids.get(i) for i in fams[k])})
        coverage[cat_name] = {"rows": len(ids), "rows_used": sum(1 for i in ids if used_ids.get(i)),
                              "looks": len(looks), "looks_used": len(used_looks)}
    return {"previous_video": (prev or {}).get("project"), "slots": slots, "constant_house_style": list(CONSTANT),
            "library_coverage": coverage}


def cmd_report(a):
    vids = history(load_ledger(), a.track, exclude=a.exclude_project)
    out = {"ledger": str(LEDGER), "track": a.track, "videos_on_record": [f"{v.get('date')} {v['project']}" for v in vids]}
    if a.what in ("music", "all"):
        out["music"] = _music_report(vids, music_catalog(), a.top)
    if a.what in ("transitions", "all"):
        out["transitions"] = _trans_report(vids, trans_catalog())
    if a.json:
        print(json.dumps(out, indent=1, ensure_ascii=False))
        return 0
    print(f"USAGE REPORT  track={a.track}  videos on record: {len(vids)}"
          + (f"  previous = {vids[-1]['project']} ({vids[-1].get('date')})" if vids else ""))
    for v in vids[-RECENT_N:]:
        print(f"  {v.get('date')}  {v['project']}: music " + ", ".join(f"{m['id']}[{'+'.join(m['pools'])}]" for m in v.get("music") or []))
    if "music" in out:
        m = out["music"]
        print("\nMUSIC  rule: a track the previous video used is BLOCKED; avoid the last three videos' tracks; in each pool")
        print("       prefer `fresh` (never used), then least recently used. Fit to the mood comes first.")
        print(f"  BLOCKED (previous video): {', '.join(m['blocked_tracks']) or 'none'}")
        print(f"  avoid (last {RECENT_N} videos): {', '.join(m['recent_tracks']) or 'none'}")
        for pool, p in m["pools"].items():
            c = p["counts"]
            print(f"\n  pool {pool}  (catalog role {p['catalog_role']}): {c.get('fresh', 0)} fresh, {c.get('used', 0)} used before, "
                  f"{c.get('recent', 0)} recent, {c.get('BLOCKED', 0)} blocked. Previous video used: {', '.join(p['previous_video']) or 'none'}")
            for x in p["candidates"][: a.top]:
                when = (f"{x['times_used']}x, last {x['last_used']} {x['last_project']}" if x["times_used"]
                        else ("legacy: " + str(x["legacy_use"])[:40] if x["legacy_use"] else "never"))
                print(f"    {x['status']:7} {x['id']:34} aggr {str(x['aggression']):>4}  bpm {str(x['bpm']):>4}  {str(x['duration_sec']):>5}s  "
                      f"{str(x['opening']):9} -> {str(x['ending']):9} {'/'.join(x['mood'][:3]):28} {'' if x['has_license_code'] else '[no license code] '}({when})")
            if len(p["candidates"]) > a.top:
                print(f"    ... {len(p['candidates']) - a.top} more (--top N or --json for all)")
    if "transitions" in out:
        t = out["transitions"]
        print("\nTRANSITIONS  rule: in a GATED slot the previous video's look is BLOCKED; prefer `fresh`, then least recently used.")
        print(f"  constant house style, never rotated: {', '.join(t['constant_house_style'])}")
        for slot, s in t["slots"].items():
            print(f"\n  slot {slot}  ({'GATED' if s['gated'] else 'advisory'}). Previous video used: {', '.join(s['previous_video']) or 'none'}")
            for x in s["options"]:
                when = f"{x['times_used']}x, last {x['last_used']} {x['last_project']}" if x["times_used"] else "never"
                print(f"    {x['status']:7} {x['key']:34} {('%d library ids' % x['library_ids']) if x['library_ids'] else '':16} ({when})")
        print("\n  library coverage so far (rows used / rows, looks used / looks):")
        for c, v in t["library_coverage"].items():
            print(f"    {c:12} rows {v['rows_used']:3}/{v['rows']:3}   looks {v['looks_used']:2}/{v['looks']:2}")
    return 0


def main():
    ap = argparse.ArgumentParser(description="Usage ledger: record / check / report music + transition variety.")
    sub = ap.add_subparsers(dest="cmd", required=True)
    r = sub.add_parser("record")
    r.add_argument("--project", required=True)
    r.add_argument("--track", default="longform-edited")
    r.add_argument("--date", default=None)
    r.add_argument("--source", default="graph", choices=["graph", "backfill"])
    c = sub.add_parser("check")
    c.add_argument("--project", required=True)
    c.add_argument("--track", default="longform-edited")
    c.add_argument("--what", default="all", choices=["music", "transitions", "all"])
    p = sub.add_parser("report")
    p.add_argument("--track", default="longform-edited")
    p.add_argument("--what", default="all", choices=["music", "transitions", "all"])
    p.add_argument("--exclude-project", default=None)
    p.add_argument("--json", action="store_true")
    p.add_argument("--top", type=int, default=14)
    a = ap.parse_args()
    sys.exit({"record": cmd_record, "check": cmd_check, "report": cmd_report}[a.cmd](a))


if __name__ == "__main__":
    main()
