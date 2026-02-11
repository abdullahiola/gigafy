#!/bin/bash
# ── Gigafy Backend — Start ──────────────────────────────────────────────────
# Starts the Python backend + ngrok tunnel in the background.
# The public URL is printed to the terminal and saved to .ngrok_url for reference.

DIR="$(cd "$(dirname "$0")" && pwd)"
PIDFILE="$DIR/.server.pid"

# Check if already running
if [ -f "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
  echo "⚠️  Server is already running (PID $(cat "$PIDFILE")). Run ./stop.sh first."
  exit 1
fi

# Kill any leftover processes on port 5001
lsof -ti :5001 | xargs kill -9 2>/dev/null

echo "🚀 Starting Gigafy backend..."
cd "$DIR"
nohup python3 server.py > server.log 2>&1 &
SERVER_PID=$!
echo "$SERVER_PID" > "$PIDFILE"

# Wait for the server to start and grab the ngrok URL
sleep 5
NGROK_URL=$(grep -o 'https://[^ ]*ngrok-free\.dev' server.log | head -1)

echo ""
echo "============================================================"
echo "  ✅  Gigafy backend started (PID $SERVER_PID)"
echo "  📍  Local:  http://localhost:5001"
if [ -n "$NGROK_URL" ]; then
  echo "  🌍  Public: $NGROK_URL"
  echo "$NGROK_URL" > "$DIR/.ngrok_url"
  echo "============================================================"
  echo ""
  echo "  To use in production, set in .env.local:"
  echo "  NEXT_PUBLIC_API_URL=$NGROK_URL"
else
  echo "  ⚠️  Ngrok URL not found yet — check server.log"
  echo "============================================================"
fi
echo ""
echo "  Logs: tail -f server.log"
echo "  Stop: ./stop.sh"
echo ""
