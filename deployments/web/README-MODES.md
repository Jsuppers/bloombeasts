# BloomBeasts Web Deployment - Development Modes

This deployment supports two different running modes for different development needs.

## Dev Mode (Default)
**Quick development with hot reload**

Uses direct imports from source files via Rollup bundling. Fast rebuilds and easier debugging.

### Usage:
```bash
npm run dev
```

- Starts build watcher that rebuilds on file changes
- Serves on http://localhost:8000/deployments/web/
- Opens `index.html`
- Bundle size: ~580KB
- Best for: Rapid development and debugging

### How it works:
- Rollup bundles all TypeScript source files into `dist/bundle.js`
- Direct imports from `../../bloombeasts/**` and `../../shared/**`
- Hot reload when files change

---

## Production Mode (Horizon Simulation)
**Simulates Meta Horizon environment as closely as possible**

Uses a standalone bundled game engine with namespace, matching the Meta Horizon deployment approach.

### Usage:
```bash
npm run build:prod    # Build production bundles
npm run serve:prod    # Serve on port 8001
```

Then open http://localhost:8001/deployments/web/index-prod.html

- Serves on http://localhost:8001/deployments/web/index-prod.html
- Opens `index-prod.html`
- Standalone bundle: ~449KB
- Platform bundle: ~204KB
- Best for: Testing Horizon-like environment before deployment

### How it works:
1. Creates standalone `BloomBeasts-GameEngine-Standalone.ts` bundle with namespace
2. Compiles it to `BloomBeasts-GameEngine-Standalone.js`
3. Bundles platform code and entry point into `bundle-prod.js`
4. Loads game engine globally via `<script>` tag (simulates Meta Horizon)
5. Entry point uses `new BloomBeasts.GameManager(platform)` namespace syntax

### Why use Production Mode?
- **Validates Horizon compatibility**: Tests that the namespace approach works before deploying to Meta Horizon
- **Catches integration issues**: Finds problems with the standalone bundle early
- **Realistic testing**: Simulates the actual deployment environment

---

## Quick Reference

| Command | Mode | Port | HTML File | Purpose |
|---------|------|------|-----------|---------|
| `npm run dev` | Dev | 8000 | index.html | Fast development |
| `npm run build:prod` + `npm run serve:prod` | Production | 8001 | index-prod.html | Horizon simulation |
| `npm run build` | - | - | - | Build dev bundle only |
| `npm run serve` | - | 8000 | - | Serve without building |

---

## File Structure

```
deployments/web/
├── index.html                    # Dev mode HTML
├── index-prod.html               # Production mode HTML (with mode badge)
├── src/
│   ├── main.ts                   # Dev mode entry point
│   ├── main-prod.ts              # Production mode entry point (uses BloomBeasts namespace)
│   ├── platform.ts               # Platform implementation
│   └── ...
├── dist/
│   ├── bundle.js                 # Dev mode bundle (~580KB)
│   ├── bundle-prod.js            # Production platform bundle (~204KB)
│   ├── BloomBeasts-GameEngine-Standalone.ts   # Standalone TypeScript bundle
│   └── BloomBeasts-GameEngine-Standalone.js   # Standalone JavaScript bundle (~449KB)
├── rollup.config.js              # Dev mode Rollup config
├── rollup.config.prod.js         # Production mode Rollup config
└── bundle-with-namespace.js      # Creates standalone namespace bundle
```

---

## Notes

- Dev mode uses direct imports for faster rebuilds
- Production mode duplicates some code between bundles (acceptable for testing purposes)
- Production mode has a visual badge indicating it's running in simulation mode
- Both modes use the same `WebPlatform` implementation
