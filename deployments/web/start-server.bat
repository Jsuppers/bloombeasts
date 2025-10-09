@echo off
echo Starting Bloom Beasts Web Server...
echo.
echo Open your browser to: http://localhost:8000
echo Press Ctrl+C to stop the server
echo.

REM Try different server options
where python >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Using Python HTTP server...
    python -m http.server 8000
    goto :end
)

where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo Using Node.js HTTP server...
    npx http-server -p 8000
    goto :end
)

echo ERROR: Neither Python nor Node.js found!
echo Please install one of them to run the web server.
pause

:end
