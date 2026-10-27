#!/usr/bin/env python3
"""
Presenter-beacon presence service.

Holds ONE shared piece of state: "what is the presenter currently showing".
No user accounts, no per-student identity -- every student's browser can
read this state freely (GET /api/state), and only whoever knows the
presenter passphrase can change it (POST /api/state). This lets students
browse independently while still seeing an unobtrusive "presenter is on
Paper X" beacon they can choose to follow or ignore.

Stdlib only, no dependencies, so it runs in a bare python:alpine container.
"""

import json
import os
import threading
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

PORT = int(os.environ.get("PRESENCE_PORT", "8090"))
TOKEN = os.environ.get("PRESENTER_TOKEN", "")

if not TOKEN:
    print("=" * 70)
    print("WARNING: PRESENTER_TOKEN is not set. Presenter-mode updates will")
    print("be REJECTED until you set PRESENTER_TOKEN in the environment.")
    print("Set it in docker-compose.yml before using presenter mode in class.")
    print("=" * 70)

_lock = threading.Lock()
_state = {
    "paper": None,      # e.g. "paper1" .. "paper4", or "frontier"
    "category": "all",  # active Q&A filter category, optional
    "label": None,       # human-readable text for the beacon, optional
    "ts": 0,             # server-side epoch seconds of the last update
    "jumpId": 0,         # bumped only by an explicit "Push to Everyone" click;
                          # students auto-navigate when this changes, unlike
                          # the passive per-navigation "ts" update above.
    "refreshId": 0,      # bumped only by an explicit "Refresh Everyone" click;
                          # students hard-reload (picking up a "goto" to land
                          # back on the presenter's screen) when this changes.
}


class Handler(BaseHTTPRequestHandler):
    server_version = "PresenceBeacon/1.0"

    def _send_json(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self._send_json(204, {})

    def do_GET(self):
        if self.path.rstrip("/") in ("/api/state", "/api/state".rstrip("/")):
            with _lock:
                self._send_json(200, dict(_state))
            return
        if self.path.rstrip("/") == "/api/health":
            self._send_json(200, {"ok": True})
            return
        self._send_json(404, {"error": "not found"})

    def do_POST(self):
        if self.path.rstrip("/") != "/api/state":
            self._send_json(404, {"error": "not found"})
            return

        length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(length) if length else b"{}"
        try:
            data = json.loads(raw.decode("utf-8"))
        except (ValueError, UnicodeDecodeError):
            self._send_json(400, {"error": "invalid json"})
            return

        if not TOKEN or data.get("token") != TOKEN:
            self._send_json(403, {"error": "invalid or missing presenter token"})
            return

        with _lock:
            _state["paper"] = data.get("paper", _state["paper"])
            _state["category"] = data.get("category", _state["category"])
            _state["label"] = data.get("label", _state["label"])
            _state["ts"] = int(time.time())
            if data.get("forceJump"):
                _state["jumpId"] = int(time.time() * 1000)
            if data.get("forceRefresh"):
                _state["refreshId"] = int(time.time() * 1000)
            snapshot = dict(_state)

        self._send_json(200, snapshot)

    def log_message(self, fmt, *args):
        # Keep the container log quiet; presence pings happen every few
        # seconds per connected student and aren't worth logging per-request.
        pass


if __name__ == "__main__":
    server = ThreadingHTTPServer(("0.0.0.0", PORT), Handler)
    print(f"Presence beacon listening on 0.0.0.0:{PORT}")
    server.serve_forever()
