@echo off
echo Building Bloombeasts compiled code...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Run the bundler
echo Running bundler...
node bundle.js

if %errorlevel% equ 0 (
    echo.
    echo Build successful!
    echo Output file: ..\Bloombeasts-Compiled-Code.ts
) else (
    echo.
    echo Build failed!
)

echo.
pause