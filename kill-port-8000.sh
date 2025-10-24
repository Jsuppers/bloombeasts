#!/bin/bash

# Kill process running on port 8000

PORT=8000

echo "Searching for process on port $PORT..."

# Find the PID using netstat
PID=$(netstat -ano | grep ":$PORT " | grep "LISTENING" | awk '{print $5}' | head -n 1)

if [ -z "$PID" ]; then
    echo "No process found running on port $PORT"
    exit 0
fi

echo "Found process $PID on port $PORT"
echo "Killing process..."

# Kill the process
taskkill //PID $PID //F

if [ $? -eq 0 ]; then
    echo "Successfully killed process $PID on port $PORT"
else
    echo "Failed to kill process $PID"
    exit 1
fi
