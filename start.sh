#!/usr/bin/env bash
# Start the local development server for the Cell App

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT=8080

# Check if already running
if lsof -Pi :$PORT -sTCP:LISTEN -t >/dev/null ; then
    echo "=========================================================="
    echo "  App is already running at: http://localhost:$PORT"
    echo "=========================================================="
    exit 0
fi

echo "Starting local server at http://localhost:$PORT..."
nohup python3 "$APP_DIR/server.py" > "$APP_DIR/server.log" 2>&1 &
SERVER_PID=$!
echo $SERVER_PID > "$APP_DIR/.server.pid"

sleep 1
if ps -p $SERVER_PID > /dev/null ; then
    echo "=========================================================="
    echo "  App successfully started (PID: $SERVER_PID)!"
    echo "  Open in your browser: http://localhost:$PORT"
    echo "  Logs: $APP_DIR/server.log"
    echo "  To stop: ./stop.sh"
    echo "=========================================================="
else
    echo "Failed to start server. Check $APP_DIR/server.log"
fi
