#!/bin/bash
# ── Gigafy Backend — Stop ───────────────────────────────────────────────────
# Stops the Python backend and cleans up ngrok.

DIR="$(cd "$(dirname "$0")" && pwd)"
PIDFILE="$DIR/.server.pid"

if [ -f "$PIDFILE" ]; then
  PID=$(cat "$PIDFILE")
  if kill -0 "$PID" 2>/dev/null; then
    echo "🛑 Stopping Gigafy backend (PID $PID)..."
    kill "$PID" 2>/dev/null
    sleep 1
    # Force-kill if still running
    kill -9 "$PID" 2>/dev/null
  fi
  rm -f "$PIDFILE"
else
  echo "⚠️  No PID file found. Killing any python3 server.py processes..."
  pkill -f "python3 server.py" 2>/dev/null
fi

# Kill any lingering ngrok processes
pkill -f ngrok 2>/dev/null

# Free the port just in case
lsof -ti :5001 | xargs kill -9 2>/dev/null

rm -f "$DIR/.ngrok_url"

echo "✅ Gigafy backend stopped."
