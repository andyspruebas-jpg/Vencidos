#!/bin/bash
cd "$(dirname "$0")"
exec python3 -m uvicorn main:app --host 127.0.0.1 --port 5177 --workers 1
