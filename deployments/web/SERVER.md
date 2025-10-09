# Server Management Guide

This guide explains how to manage the local development server for Bloom Beasts web deployment.

## Starting the Server

```bash
cd deployments/web
npm run serve
```

The server will start at: **http://127.0.0.1:8000**

Access the game at: **http://127.0.0.1:8000/deployments/web/**

## Finding Running Servers

### On Windows (Git Bash/MSYS)

```bash
# Find which process is using port 8000
netstat -ano | grep :8000 | grep LISTENING

# Output example:
# TCP    0.0.0.0:8000    0.0.0.0:0    LISTENING    12345
#                                                    ^^^^^
#                                                    PID (Process ID)
```

### On Linux/Mac

```bash
# Find which process is using port 8000
lsof -i :8000

# Or using netstat
netstat -tuln | grep :8000
```

## Stopping the Server

### Method 1: Using Ctrl+C (If Running in Foreground)

If you started the server in your terminal and can see it running:
1. Press `Ctrl+C` to stop it

### Method 2: Kill by Process ID (Windows)

```bash
# First, find the PID (Process ID)
netstat -ano | grep :8000 | grep LISTENING

# Then kill the process using the PID (replace 12345 with your PID)
taskkill //PID 12345 //F
```

### Method 3: Kill by Process ID (Linux/Mac)

```bash
# Find the PID
lsof -i :8000

# Kill the process (replace 12345 with your PID)
kill -9 12345
```

### Method 4: Kill All Node Processes (Use with Caution!)

**Warning:** This will stop ALL Node.js processes, not just the server!

**Windows:**
```bash
taskkill //IM node.exe //F
```

**Linux/Mac:**
```bash
pkill -9 node
```

## Common Issues

### Error: `EADDRINUSE: address already in use 0.0.0.0:8000`

This means a server is already running on port 8000.

**Solution:**
1. Find the running process (see "Finding Running Servers" above)
2. Stop it using one of the methods above
3. Start your server again

### Can't Find the Process

If `netstat` shows a process on port 8000 but you can't kill it:

**Windows:**
```bash
# Get detailed info about port 8000
netstat -ano | findstr :8000

# Force kill with admin privileges (run as Administrator)
taskkill //PID <PID> //F //T
```

## Server Configuration

The server is configured in `package.json`:

```json
"serve": "cd ../.. && http-server -p 8000 -c-1"
```

- **Port:** 8000
- **Root Directory:** Project root (../../)
- **Cache:** Disabled (-c-1)

This allows the server to access `/shared/` images directly without copying.

## Development Workflow

### Recommended Workflow

```bash
# Terminal 1: Watch and rebuild on changes
npm run build:watch

# Terminal 2: Run the server
npm run serve

# Or use both in one command:
npm run dev
```

### Quick Restart

```bash
# Stop the server (Ctrl+C)
# Then restart
npm run serve
```

## Troubleshooting

### Images Not Loading

1. Ensure the server is running from the project root
2. Check that paths in the code use absolute paths starting with `/`
3. Verify images exist in `/shared/images/`

### Port Already in Use

1. Find the PID: `netstat -ano | grep :8000`
2. Kill it: `taskkill //PID <PID> //F`
3. Restart server

### Server Won't Start

1. Check if `node_modules` exists: `npm install`
2. Verify you're in the correct directory: `cd deployments/web`
3. Check Node.js is installed: `node --version`

## Alternative Ports

If port 8000 is needed for something else, you can change it:

Edit `package.json`:
```json
"serve": "cd ../.. && http-server -p 3000 -c-1"
```

Then access at: http://127.0.0.1:3000/deployments/web/
