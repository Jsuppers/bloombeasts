#!/bin/bash
echo "Starting Bloom Beasts Web Server..."
echo ""
echo "Open your browser to: http://localhost:8000"
echo "Press Ctrl+C to stop the server"
echo ""

# Try different server options
if command -v python3 &> /dev/null; then
    echo "Using Python HTTP server..."
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "Using Python HTTP server..."
    python -m http.server 8000
elif command -v node &> /dev/null; then
    echo "Using Node.js HTTP server..."
    npx http-server -p 8000
else
    echo "ERROR: Neither Python nor Node.js found!"
    echo "Please install one of them to run the web server."
    exit 1
fi
