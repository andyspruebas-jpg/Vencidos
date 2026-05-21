#!/bin/bash
# Vencidos Backend Startup Script
# Run: nohup /home/gabriel/vencidos/backend/run-backend.sh &
# Or add to crontab: @reboot /home/gabriel/vencidos/backend/run-backend.sh

cd "$(dirname "$0")"

# Kill any existing process on port 5177
lsof -i :5177 -sTCP:LISTEN -t | xargs kill -9 2>/dev/null || true
sleep 1

# Start backend
exec python3 -m uvicorn main:app --host 127.0.0.1 --port 5177 --workers 1 >> /tmp/vencidos-backend.log 2>&1
