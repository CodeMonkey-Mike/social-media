import http.server
import socketserver
import os

class CORSHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Private-Network', 'true')
        super().end_headers()
    def log_message(self, format, *args):
        pass  # suppress logs

os.chdir(r'C:\Users\mnede\Documents\Claude\social-media\schedule-tweets\images')
print("Serving images at http://localhost:8765", flush=True)
with socketserver.TCPServer(("", 8765), CORSHandler) as httpd:
    httpd.serve_forever()
