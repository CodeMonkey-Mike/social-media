import http.server
import json
import mimetypes
import os
import re
import socketserver

BASE_DIR         = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPLY_GUY_DIR    = os.path.join(os.path.dirname(BASE_DIR), "x-reply-guy")
REPLY_GUY_PREFIX = "/x-reply-guy/"
QUEUE_PATH       = os.path.join(REPLY_GUY_DIR, "data", "replies_to_post.json")
OPPS_PATH        = os.path.join(REPLY_GUY_DIR, "data", "reply_opportunities.json")

# The LangGraph page's feeds — one entry per automation, matching AUTOMATIONS in
# langgraph.html. Adding an automation is one line here.
#
# Deliberately an ALLOWLIST of filenames, not a directory mount like /x-reply-guy/:
# linkedin-automation also holds members.json, the project log and the restriction
# history, and the page needs exactly these two files. Keep it that way — a new
# automation gets a folder entry, never a wildcard.
GRAPH_FEED_DIRS = {
    "linkedin": os.path.join(os.path.dirname(BASE_DIR), "linkedin-automation", "data"),
    "livestream": os.path.join(os.path.dirname(BASE_DIR), "video-creation",
                               "livestream-repurpose", "graph", "data"),
    # longform-edited LangGraph (2026-09-17): one StateGraph per video, five stage cards.
    "longform": os.path.join(os.path.dirname(BASE_DIR), "video-creation",
                             "longform-edited", "graph", "data"),
}
GRAPH_FEED_ALLOWED = {"lane_runs.json", "lane_progress.json"}

# ── gate-artifact feed (added 2026-08-15) ───────────────────────────────────
# WHY: a HITL gate / agent handoff on the LangGraph page used to infer its status
# purely from "has the segment AFTER me finished?". That lags reality badly — the
# drafting seam read "pending" while segment 6 was actively generating images off the
# very plan that seam produces, and the clip-plan seam read "pending" while the
# clip-strategist was mid-flight. The handoff ARTIFACT is the real contract (the
# graphs refuse to start without it), so serve its existence and let the page read
# the truth off disk instead of guessing from run history.
REPO_ROOT = os.path.dirname(BASE_DIR)
LIVESTREAM_GATES = {
    "longform_meta": "video-creation/livestream-repurpose/media/{batch}/longform-meta.json",
    "clip_plan":     "video-creation/shorts/{batch}/clip-plan.json",
    "tighten_plan":  "video-creation/shorts/{batch}/tighten-plan.json",
    "filler_plan":   "video-creation/shorts/{batch}/filler-plan.json",
    "publish_meta":  "video-creation/shorts/{batch}/publish-meta.json",
    "lane3_plan":    "repurpose/output/{batch}-lane3-plan.json",
}
# longform-edited graph (2026-09-17): the handoff artifacts are the per-video document set +
# spine chain (comp-build.md §13/§13a); Mike's approvals + hand-done placeholders live in the
# project's GRAPH-PROGRESS.json. `batch` = the project folder name.
LONGFORM_MEDIA = "video-creation/longform-edited/media/{batch}"
LONGFORM_GATE_FILES = {
    "data": "DATA.md", "screenplay_doc": "SCREENPLAY.md", "as_recorded": "AS-RECORDED.md",
    "cover_plan": "COVER-PLAN.json", "music_plan": "MUSIC-PLAN.json", "broll_plan": "BROLL-PLAN.md",
    "edit_plan": "EDIT-PLAN.md", "cue_sheet": "CUE-SHEET.md", "transitions": "TRANSITIONS.md",
    "spine_assets": "assets/spine.mp4",
}
LONGFORM_GATE_GLOBS = {
    "recording": "raw/*.mkv|raw/*.mp4|raw/*.mov", "lowbps": "spine/*.lowbps.mp4",
    "defumbled": "spine/*.a.defumbled.mp4", "blackout": "spine/*.b.blackout.mp4",
    "coarse": "spine/*.c.desilenced.mp4", "cleaned": "spine/*.d.cleaned.mp4",
    "desilenced": "spine/*.d.desilenced.mp4|spine/*.e.desilenced.mp4|spine/*.f.desilenced.mp4",
    "words": "spine/*.medium-words.json",
    "draft": "_previews/*draft*.mp4", "final": "*-FINAL.mp4",
}


def longform_gates(batch):
    import glob as _glob
    proj = os.path.join(REPO_ROOT, *LONGFORM_MEDIA.format(batch=batch).split("/"))
    gates = {}
    for key, rel in LONGFORM_GATE_FILES.items():
        gates[key] = os.path.isfile(os.path.join(proj, *rel.split("/")))
    for key, pats in LONGFORM_GATE_GLOBS.items():
        gates[key] = any(_glob.glob(os.path.join(proj, *p.split("/"))) for p in pats.split("|"))
    gates["staged"] = bool(_glob.glob(os.path.join(REPO_ROOT, "schedule-tweets", "longform", batch, "*.mp4")))
    try:
        with open(os.path.join(proj, "GRAPH-PROGRESS.json"), encoding="utf-8") as f:
            prog = json.load(f)
        for g in (prog.get("gates") or {}):
            gates["approve_" + g] = True
        for n in (prog.get("manual_done") or {}):
            gates["done_" + n] = True
    except Exception:
        pass
    return gates


# Batch ids are slugs. Anything else is refused rather than interpolated into a path.
BATCH_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$")

class CORSHandler(http.server.SimpleHTTPRequestHandler):
    def _serve_file(self, full, no_store=False):
        if not os.path.isfile(full):
            self.send_error(404)
            return
        with open(full, "rb") as f:
            data = f.read()
        ctype = mimetypes.guess_type(full)[0] or "application/json"
        self.send_response(200)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        if no_store:
            # The LangGraph page polls these while a run writes them — a cached
            # heartbeat is a lying heartbeat.
            self.send_header("Cache-Control", "no-store")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        if self.path.startswith(REPLY_GUY_PREFIX):
            rel = self.path[len(REPLY_GUY_PREFIX):].split("?")[0]
            self._serve_file(os.path.join(REPLY_GUY_DIR, rel))
            return
        # /livestream/gates.json?batch=<slug> — COMPUTED, not a file on disk: which
        # handoff artifacts exist right now for that batch.
        raw = self.path.lstrip("/")
        route, _, query = raw.partition("?")
        if route in ("livestream/gates.json", "longform/gates.json"):
            batch = ""
            for kv in query.split("&"):
                k, _, v = kv.partition("=")
                if k == "batch":
                    batch = v
            gates = {}
            if batch and BATCH_RE.match(batch) and route.startswith("longform/"):
                gates = longform_gates(batch)
            elif batch and BATCH_RE.match(batch):
                for key, tmpl in LIVESTREAM_GATES.items():
                    gates[key] = os.path.isfile(
                        os.path.join(REPO_ROOT, *tmpl.format(batch=batch).split("/")))
            body = json.dumps({"batch": batch, "gates": gates}).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(body)
            return
        # /<automation>/<feed file> for any registered LangGraph automation.
        parts = self.path.lstrip("/").split("?")[0].split("/")
        if len(parts) == 2 and parts[0] in GRAPH_FEED_DIRS:
            if parts[1] not in GRAPH_FEED_ALLOWED:   # allowlist, not a directory mount
                self.send_error(404)
                return
            self._serve_file(os.path.join(GRAPH_FEED_DIRS[parts[0]], parts[1]), no_store=True)
            return
        super().do_GET()

    def do_POST(self):
        if self.path == "/x-reply-guy/queue":
            length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(length)
            try:
                entry = json.loads(body)
            except Exception:
                self.send_error(400)
                return

            # Append to replies_to_post.json
            try:
                with open(QUEUE_PATH, "r", encoding="utf-8") as f:
                    queue = json.load(f)
            except Exception:
                queue = []
            # One queue for all reply types. Carry through gif_search (GIF
            # reactions) and image_* (image replies) so they survive queuing —
            # all types post via the same post_replies.py.
            item = {k: entry[k] for k in ("author", "tweet_url", "reply_text", "gif_search",
                                          "image_style", "image_prompt", "image_path") if k in entry}
            if entry.get("reaction_only"):
                item["reaction_only"] = True
            queue.append(item)
            with open(QUEUE_PATH, "w", encoding="utf-8") as f:
                json.dump(queue, f, indent=2, ensure_ascii=False)

            # Remove from reply_opportunities.json
            try:
                with open(OPPS_PATH, "r", encoding="utf-8") as f:
                    opps = json.load(f)
            except Exception:
                opps = []
            opps = [o for o in opps if o.get("tweet_url") != entry.get("tweet_url")]
            with open(OPPS_PATH, "w", encoding="utf-8") as f:
                json.dump(opps, f, indent=2, ensure_ascii=False)

            resp = json.dumps({"ok": True}).encode()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(resp)))
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(resp)
        else:
            self.send_error(404)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    # Images are REGENERATED IN PLACE (a regen reuses the same image_id, so the queue's image_path
    # stays valid and the URL never changes). SimpleHTTPRequestHandler sends Last-Modified but no
    # cache policy, so Brave/Chrome heuristically cache the old bytes and keep showing a stale image.
    # Ctrl+Shift+R does NOT fix it: index.html injects the <img> tags from JS AFTER load, and a hard
    # reload only bypasses cache for the document's own load, not for later JS-driven requests.
    # "no-cache" (revalidate every time), NOT "no-store" (never cache): a 304 costs one round trip
    # and no re-download, so an unchanged gallery stays cheap while a regen shows up immediately.
    IMAGE_EXTS = ('.png', '.jpg', '.jpeg', '.gif', '.webp')

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        if self.path.split('?')[0].lower().endswith(self.IMAGE_EXTS):
            self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

    def log_message(self, format, *args):
        pass

class ThreadingHTTPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    daemon_threads = True
    allow_reuse_address = True

os.chdir(BASE_DIR)
print("Dashboard at http://localhost:8766", flush=True)
with ThreadingHTTPServer(("", 8766), CORSHandler) as httpd:
    httpd.serve_forever()
