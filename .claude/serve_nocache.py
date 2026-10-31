import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCacheHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


port = int(sys.argv[1])
directory = sys.argv[2] if len(sys.argv) > 2 else "."
ThreadingHTTPServer(("", port), partial(NoCacheHandler, directory=directory)).serve_forever()
