# BloomBeasts Unified UI System

A platform-agnostic UI system that allows seamless switching between Horizon (Meta) and Web platforms using a simple enum-based configuration.

## Overview

The unified UI system provides a single import path (`bloombeasts/ui`) that works across both Horizon and Web platforms. You can switch between platforms by simply changing a Platform enum value, without modifying any of your UI code.

## Quick Start

```typescript
// Import from unified UI system
import { Platform, setPlatform, View, Text, Pressable } from 'bloombeasts/ui';

// Choose your platform
setPlatform(Platform.horizon);  // For Horizon platform
// OR
setPlatform(Platform.web);      // For Web platform

// Write UI code that works on both platforms!
const myUI = View({
  style: { backgroundColor: '#1a1a2e' },
  children: [
    Text({ content: 'Hello BloomBeasts!' }),
    Pressable({
      onPress: () => console.log('Clicked!'),
      children: Text({ content: 'Click Me' })
    })
  ]
});
```

## Features

### ✅ Unified Component API
All standard UI components work identically on both platforms:
- `View` - Container component
- `Text` - Text display
- `Image` - Image display
- `Pressable` - Clickable elements
- `ScrollView` - Scrollable containers
- `DynamicList` - Dynamic list rendering (polyfilled for Web)

### ✅ Data Binding System
Reactive data binding works on both platforms:
```typescript
const counter = new Binding(0);
const doubled = new DerivedBinding([counter], (c) => c * 2);

counter.set(5);  // doubled.value is now 10
```

### ✅ Animation System
Animations work consistently across platforms:
```typescript
const fadeIn = Animation.timing({
  duration: 300,
  easing: Easing.inOut
});
```

### ✅ Platform Capabilities
Check platform-specific features:
```typescript
const capabilities = getPlatformCapabilities();

if (capabilities.hasVR) {
  // Enable VR features
}

if (isHorizon()) {
  // Use Horizon-specific features
}

if (isWeb()) {
  // Use Web-specific features
}
```

## Project Structure

```
bloombeasts/ui/
├── index.ts                 # Main entry point with platform selection
├── platform.ts              # Platform enum and configuration
├── types.ts                 # Unified TypeScript definitions
├── adapters/
│   ├── horizon.ts           # Horizon platform adapter
│   └── web.ts               # Web platform adapter
└── polyfills/
    └── DynamicList.ts       # DynamicList implementation for Web
```

## Migration Guide

### From Horizon

**Before:**
```typescript
import { View, Text } from 'horizon/ui';
import * as hz from 'horizon/core';
```

**After:**
```typescript
import { Platform, setPlatform, View, Text } from 'bloombeasts/ui';
setPlatform(Platform.horizon);
// Still import horizon/core for platform-specific features
import * as hz from 'horizon/core';
```

### From Web

**Before:**
```typescript
import { View, Text } from '../ui';
```

**After:**
```typescript
import { Platform, setPlatform, View, Text } from 'bloombeasts/ui';
setPlatform(Platform.web);
```

## Platform Comparison

| Feature | Horizon | Web |
|---------|---------|-----|
| Native UI | ✅ | ❌ (Canvas) |
| Canvas Rendering | ❌ | ✅ |
| Persistent Storage | ✅ | ❌ |
| Multiplayer | ✅ | ❌ |
| VR Support | ✅ | ❌ |
| Props System | ✅ | ❌ (Stub) |
| DynamicList | ✅ | ✅ (Polyfill) |

## API Reference

### Platform Selection

```typescript
enum Platform {
  horizon = 'horizon',
  web = 'web'
}

setPlatform(platform: Platform): void
getPlatform(): Platform
isHorizon(): boolean
isWeb(): boolean
```

### Platform Configuration

```typescript
getPlatformCapabilities(): PlatformCapabilities
getPlatformConfig(): PlatformConfig
initializePlatform(): void
cleanupPlatform(): void
```

### Components

All components follow the same API regardless of platform:
- `View(props: ViewProps)`
- `Text(props: TextProps)`
- `Image(props: ImageProps)`
- `Pressable(props: PressableProps)`
- `ScrollView(props: ScrollViewProps)`
- `DynamicList(props: DynamicListProps)`

## Advanced Usage

### Conditional Platform Code

```typescript
import { isHorizon, isWeb } from 'bloombeasts/ui';

if (isHorizon()) {
  // Horizon-specific code
  // Can use persistent storage, multiplayer, etc.
}

if (isWeb()) {
  // Web-specific code
  // Can use canvas rendering, DOM events, etc.
}
```

### Platform-Specific Imports

When you need platform-specific features:

```typescript
// For Horizon-specific features
if (isHorizon()) {
  import('horizon/core').then(hz => {
    // Use Horizon core features
  });
}

// For Web-specific features
if (isWeb()) {
  // Use Web-specific features
}
```

## Testing

Run the test suite:
```bash
node bloombeasts/ui/test.js
```

View the demo:
```bash
node bloombeasts/ui/demo.js
```

## Future Enhancements

- [ ] Add more platforms (React Native, Unity, etc.)
- [ ] Implement remaining Horizon components for Web
- [ ] Add platform-specific optimization hints
- [ ] Create automatic platform detection
- [ ] Add hot-reload support for platform switching

## License

Part of the BloomBeasts project.