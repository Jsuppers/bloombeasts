# BloomBeasts Build System

This document explains the consolidated build system for BloomBeasts.

## Architecture

The project uses a **single source of truth** for the standalone game engine bundle:

```
bloombeasts/
├── bundle-with-namespace.js          # Bundler script (creates standalone TS bundle)
├── dist/                              # Shared build output
│   ├── BloomBeasts-GameEngine-Standalone.ts    # Standalone TypeScript bundle with namespace
│   └── BloomBeasts-GameEngine-Standalone.js    # Compiled JavaScript (for web)
├── deployments/
│   ├── horizon/                       # Meta Horizon deployment
│   │   └── package.json              # Builds using root bundler
│   └── web/                          # Web deployment
│       ├── dist/
│       │   ├── bundle.js             # Dev mode bundle (direct imports)
│       │   └── bundle-prod.js        # Production mode bundle (uses namespace)
│       ├── index.html                # Dev mode HTML
│       └── index-prod.html           # Production mode HTML
```

## Build Commands

### Root Level (Recommended)

```bash
# Build standalone namespace bundle (used by both deployments)
npm run build:standalone

# Build for Meta Horizon deployment
npm run build:horizon

# Build for Web production mode
npm run build:web:prod

# Run tests
npm test
```

### Horizon Deployment

```bash
cd deployments/horizon

# Build standalone bundle for Horizon
npm run build

# Output: ../../dist/BloomBeasts-GameEngine-Standalone.ts
```

### Web Deployment

```bash
cd deployments/web

# Dev mode (fast development with direct imports)
npm run dev                           # Build + serve on port 8000
# Opens: http://localhost:8000/deployments/web/index.html

# Production mode (simulates Meta Horizon environment)
npm run build:prod                    # Build standalone + production bundle
npm run serve:prod                    # Serve on port 8001
# Opens: http://localhost:8001/deployments/web/index-prod.html
```

## How It Works

### 1. Standalone Bundle Creation

The `bundle-with-namespace.js` script:
- Starts from entry point: `bloombeasts/engine/index.ts`
- Follows all imports depth-first
- Removes all import/export statements
- Wraps everything in `namespace BloomBeasts {}`
- Outputs to: `dist/BloomBeasts-GameEngine-Standalone.ts`

### 2. Horizon Deployment

**Simple approach**: Just uses the standalone TypeScript bundle

```bash
npm run build:horizon
# → Creates dist/BloomBeasts-GameEngine-Standalone.ts (444KB)
# → Upload this .ts file to Meta Horizon (they compile it)
# → Use: new BloomBeasts.GameManager(platform)
```

**Note**: Only creates `.ts` file - Meta Horizon compiles TypeScript themselves

### 3. Web Deployment

**Two modes for different purposes**:

#### Dev Mode
- Direct imports from source files
- Fast rebuilds (Rollup watch mode)
- Easy debugging
- Bundle: `deployments/web/dist/bundle.js` (~580KB)

#### Production Mode
- Uses standalone namespace bundle (simulates Horizon)
- Tests the actual deployment approach
- Helps catch integration issues before deploying
- Bundles:
  - Root `dist/BloomBeasts-GameEngine-Standalone.ts` (~444KB) - TypeScript source
  - Root `dist/BloomBeasts-GameEngine-Standalone.js` (~449KB) - Compiled for browser
  - `deployments/web/dist/bundle-prod.js` (~204KB) - Platform code

**Note**: Creates both `.ts` and `.js` files - browser needs JavaScript to run

## Why This Architecture?

### Benefits

1. **Single Source of Truth**
   - One bundler script at root
   - One output location (`/dist`)
   - Both Horizon and Web production use the same bundle

2. **No Duplication**
   - Bundler script isn't duplicated
   - Standalone bundle built once, used by both deployments

3. **Easy Testing**
   - Web production mode lets you test Horizon deployment locally
   - Catch namespace/integration issues before uploading to Horizon

4. **Clean Structure**
   - Root `dist/` for shared builds
   - Deployment-specific `dist/` for their own bundles
   - Clear separation of concerns

### When to Use Each Mode

| Need | Command | Mode |
|------|---------|------|
| Fast development | `cd deployments/web && npm run dev` | Web Dev |
| Test Horizon locally | `cd deployments/web && npm run build:prod && npm run serve:prod` | Web Production |
| Deploy to Horizon | `npm run build:horizon` | Horizon Build |

## File Locations

### Source Files
- `bloombeasts/` - Game engine source code
- `shared/` - Shared utilities and constants
- `deployments/*/src/` - Platform-specific code

### Build Outputs

**Created by `npm run build:horizon`:**
- `dist/BloomBeasts-GameEngine-Standalone.ts` - TypeScript bundle (upload to Horizon)

**Created by `npm run build:web:prod`:**
- `dist/BloomBeasts-GameEngine-Standalone.ts` - TypeScript bundle (shared)
- `dist/BloomBeasts-GameEngine-Standalone.js` - Compiled for browser
- `deployments/web/dist/bundle-prod.js` - Platform code bundle

**Created by web dev mode:**
- `deployments/web/dist/bundle.js` - Web dev mode bundle (direct imports)

## TypeScript Compilation

The standalone bundle compiles with:
- `target`: ES2020
- `module`: CommonJS (for Horizon) or ES2020 (for web)
- `lib`: ES2020 (no DOM - custom type declarations included)
- All code in `BloomBeasts` namespace
- Zero external dependencies
