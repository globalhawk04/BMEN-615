#!/usr/bin/env python3
"""
Interactive Scientific Paper Explainer - Local Testing Server
Serves the web application at http://localhost:8080
"""

import http.server
import socketserver
import os
import sys

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class CustomHTTPHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def guess_type(self, path):
        if path.endswith('.js'):
            return 'application/javascript'
        if path.endswith('.json'):
            return 'application/json'
        return super().guess_type(path)

if __name__ == '__main__':
    os.chdir(DIRECTORY)
    try:
        with socketserver.TCPServer(("", PORT), CustomHTTPHandler) as httpd:
            print(f"================================================================")
            print(f"  Interactive Scientific Paper App is Running!")
            print(f"  Open in your browser: http://localhost:{PORT}")
            print(f"  Document Root: {DIRECTORY}")
            print(f"================================================================")
            httpd.serve_forever()
    except OSError as e:
        if e.errno == 98: # Address already in use
            PORT = 8081
            with socketserver.TCPServer(("", PORT), CustomHTTPHandler) as httpd:
                print(f"Port 8080 was busy. Server started at: http://localhost:{PORT}")
                httpd.serve_forever()
        else:
            raise e
