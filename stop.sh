#!/usr/bin/env bash
# Stop the local development server

APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT=8080

if [ -f "$APP_DIR/.server.pid" ]; then
    PID=$(cat "$APP_DIR/.server.pid")
    if ps -p $PID > /dev/null 2>&1; then
        kill $PID
        echo "Stopped server process $PID."
    fi
    rm -f "$APP_DIR/.server.pid"
fi

# Fallback check on port 8080
PIDS=$(lsof -t -i:$PORT 2>/dev/null)
if [ -n "$PIDS" ]; then
    echo "Killing processes listening on port $PORT: $PIDS"
    kill -9 $PIDS 2>/dev/null
fi

echo "Local server on port $PORT is stopped."
