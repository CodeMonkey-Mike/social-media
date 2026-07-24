import http.server
import json
import mimetypes
import os
import socketserver

BASE_DIR         = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
REPLY_GUY_DIR    = os.path.join(os.path.dirname(BASE_DIR), "x-reply-guy")
REPLY_GUY_PREFIX = "/x-reply-guy/"
QUEUE_PATH       = os.path.join(REPLY_GUY_DIR, "data", "replies_to_post.json")
OPPS_PATH        = os.path.join(REPLY_GUY_DIR, "data", "reply_opportunities.json")

class CORSHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith(REPLY_GUY_PREFIX):
            rel = self.path[len(REPLY_GUY_PREFIX):].split("?")[0]
            full = os.path.join(REPLY_GUY_DIR, rel)
            if os.path.isfile(full):
                with open(full, "rb") as f:
                    data = f.read()
                ctype = mimetypes.guess_type(full)[0] or "application/json"
                self.send_response(200)
                self.send_header("Content-Type", ctype)
                self.send_header("Content-Length", str(len(data)))
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(data)
            else:
                self.send_error(404)
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

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
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
