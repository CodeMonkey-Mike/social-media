# serve_dashboard.py — minimal dashboard server for the LinkedIn automation.
#
# Trimmed from the original multi-automation dashboard: this build serves ONLY the
# LangGraph page (langgraph.html, in this folder) and its two LinkedIn data feeds.
#
#   python3 dashboard/serve_dashboard.py   ->   http://localhost:8766
#
# Feeds are an ALLOWLIST of filenames, not a directory mount: ../data also holds
# members.json and the rest of the outreach state, and the page needs exactly these
# two files. Keep it that way.

import http.server
import mimetypes
import os
import socketserver

DASH_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(DASH_DIR)
DATA_DIR = os.path.join(ROOT_DIR, "data")

GRAPH_FEED_DIRS = {"linkedin": DATA_DIR}
GRAPH_FEED_ALLOWED = {"lane_runs.json", "lane_progress.json"}
PORT = 8766


class Handler(http.server.SimpleHTTPRequestHandler):
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
            # The page polls these while a run writes them — a cached heartbeat
            # is a lying heartbeat.
            self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        parts = self.path.lstrip("/").split("?")[0].split("/")
        if len(parts) == 2 and parts[0] in GRAPH_FEED_DIRS:
            if parts[1] not in GRAPH_FEED_ALLOWED:  # allowlist, not a directory mount
                self.send_error(404)
                return
            self._serve_file(os.path.join(GRAPH_FEED_DIRS[parts[0]], parts[1]), no_store=True)
            return
        if self.path in ("/", "/index.html"):
            self.send_response(302)
            self.send_header("Location", "/langgraph.html")
            self.end_headers()
            return
        super().do_GET()

    def log_message(self, format, *args):
        pass


class ThreadingHTTPServer(socketserver.ThreadingMixIn, socketserver.TCPServer):
    daemon_threads = True
    allow_reuse_address = True


os.chdir(DASH_DIR)  # static files (langgraph.html) served from this folder
print(f"Dashboard at http://localhost:{PORT}", flush=True)
with ThreadingHTTPServer(("", PORT), Handler) as httpd:
    httpd.serve_forever()
