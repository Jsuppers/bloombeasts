/**
 * BloomBeasts Unified UI System
 * Main entry point for platform-agnostic UI components
 *
 * Usage:
 * ```typescript
 * import { Platform, setPlatform, View, Text } from 'bloombeasts/ui';
 *
 * // Set platform at app initialization
 * setPlatform(Platform.horizon);  // or Platform.web
 *
 * // Use components normally
 * const myView = View({
 *   children: Text({ content: 'Hello BloomBeasts!' })
 * });
 * ```
 */

// Import platform functions
import { Platform, setPlatform as setPlatformFn, getPlatform as getPlatformFn, isHorizon as isHorizonFn, isWeb as isWebFn, getPlatformCapabilities as getCapabilitiesFn, getPlatformConfig as getConfigFn } from './platform';

// Re-export platform configuration
export { Platform } from './platform';
export type { PlatformCapabilities, PlatformConfig } from './platform';

// Export platform functions
export const setPlatform = setPlatformFn;
export const getPlatform = getPlatformFn;
export const isHorizon = isHorizonFn;
export const isWeb = isWebFn;
export const getPlatformCapabilities = getCapabilitiesFn;
export const getPlatformConfig = getConfigFn;

// Import adapters
import * as HorizonAdapter from './adapters/horizon';
import * as WebAdapter from './adapters/web';

// Re-export unified types
export * from './types';

/**
 * Dynamic component getter
 * Returns the appropriate component based on current platform
 */
function getComponent<T>(componentName: string): T {
  const platform = getPlatformFn();
  const adapter = platform === Platform.horizon ? HorizonAdapter : WebAdapter;

  if (!(componentName in adapter)) {
    throw new Error(`Component '${componentName}' not found in ${platform} adapter`);
  }

  return (adapter as any)[componentName] as T;
}

/**
 * Core UI Components
 * These are available on all platforms
 */

// Lazy getters for components - they resolve based on current platform
export const UIComponent = (() => {
  let cached: any;
  return () => {
    if (!cached || cached._platform !== getPlatformFn()) {
      cached = getComponent<typeof HorizonAdapter.UIComponent>('UIComponent');
      cached._platform = getPlatformFn();
    }
    return cached;
  };
})();

export const View = (() => {
  let cached: any;
  let cachedPlatform: Platform;
  return (props?: any) => {
    const currentPlatform = getPlatformFn();
    if (!cached || cachedPlatform !== currentPlatform) {
      cached = getComponent<typeof HorizonAdapter.View>('View');
      cachedPlatform = currentPlatform;
    }
    return cached(props);
  };
})();

export const Text = (() => {
  let cached: any;
  let cachedPlatform: Platform;
  return (props?: any) => {
    const currentPlatform = getPlatformFn();
    if (!cached || cachedPlatform !== currentPlatform) {
      cached = getComponent<typeof HorizonAdapter.Text>('Text');
      cachedPlatform = currentPlatform;
    }
    return cached(props);
  };
})();

export const Image = (() => {
  let cached: any;
  let cachedPlatform: Platform;
  return (props?: any) => {
    const currentPlatform = getPlatformFn();
    if (!cached || cachedPlatform !== currentPlatform) {
      cached = getComponent<typeof HorizonAdapter.Image>('Image');
      cachedPlatform = currentPlatform;
    }
    return cached(props);
  };
})();

export const Pressable = (() => {
  let cached: any;
  let cachedPlatform: Platform;
  return (props?: any) => {
    const currentPlatform = getPlatformFn();
    if (!cached || cachedPlatform !== currentPlatform) {
      cached = getComponent<typeof HorizonAdapter.Pressable>('Pressable');
      cachedPlatform = currentPlatform;
    }
    return cached(props);
  };
})();

export const ScrollView = (() => {
  let cached: any;
  let cachedPlatform: Platform;
  return (props?: any) => {
    const currentPlatform = getPlatformFn();
    if (!cached || cachedPlatform !== currentPlatform) {
      cached = getComponent<typeof HorizonAdapter.ScrollView>('ScrollView');
      cachedPlatform = currentPlatform;
    }
    return cached(props);
  };
})();

export const DynamicList = (() => {
  let cached: any;
  let cachedPlatform: Platform;
  return (props?: any) => {
    const currentPlatform = getPlatformFn();
    if (!cached || cachedPlatform !== currentPlatform) {
      cached = getComponent<typeof HorizonAdapter.DynamicList>('DynamicList');
      cachedPlatform = currentPlatform;
    }
    return cached(props);
  };
})();

/**
 * Data Binding Components
 */
export const Binding = (() => {
  let cached: any;
  let cachedPlatform: Platform;

  class BindingProxy {
    constructor(...args: any[]) {
      const currentPlatform = getPlatformFn();
      if (!cached || cachedPlatform !== currentPlatform) {
        const BindingClass = getComponent<any>('Binding');
        cached = BindingClass;
        cachedPlatform = currentPlatform;
      }
      return new cached(...args);
    }

    // Static derive method
    static derive(...args: any[]): any {
      const currentPlatform = getPlatformFn();
      if (!cached || cachedPlatform !== currentPlatform) {
        const BindingClass = getComponent<any>('Binding');
        cached = BindingClass;
        cachedPlatform = currentPlatform;
      }
      return cached.derive(...args);
    }
  }

  return BindingProxy as any;
})();

export const DerivedBinding = (() => {
  let cached: any;
  let cachedPlatform: Platform;

  class DerivedBindingProxy {
    constructor(...args: any[]) {
      const currentPlatform = getPlatformFn();
      if (!cached || cachedPlatform !== currentPlatform) {
        const DerivedBindingClass = getComponent<any>('DerivedBinding');
        cached = DerivedBindingClass;
        cachedPlatform = currentPlatform;
      }
      return new cached(...args);
    }
  }

  return DerivedBindingProxy as any;
})();

export const AnimatedBinding = (() => {
  let cached: any;
  let cachedPlatform: Platform;

  class AnimatedBindingProxy {
    constructor(...args: any[]) {
      const currentPlatform = getPlatformFn();
      if (!cached || cachedPlatform !== currentPlatform) {
        const AnimatedBindingClass = getComponent<any>('AnimatedBinding');
        cached = AnimatedBindingClass;
        cachedPlatform = currentPlatform;
      }
      return new cached(...args);
    }
  }

  return AnimatedBindingProxy as any;
})();

/**
 * UI Node System
 */
export const UINode = (() => {
  let cached: any;
  let cachedPlatform: Platform;

  return new Proxy({}, {
    get: (target, prop) => {
      const currentPlatform = getPlatformFn();
      if (!cached || cachedPlatform !== currentPlatform) {
        cached = getComponent<any>('UINode');
        cachedPlatform = currentPlatform;
      }
      return cached[prop];
    },
    construct: (target, args) => {
      const currentPlatform = getPlatformFn();
      if (!cached || cachedPlatform !== currentPlatform) {
        cached = getComponent<any>('UINode');
        cachedPlatform = currentPlatform;
      }
      return new cached(...args);
    }
  }) as any;
})();

/**
 * Animation System
 */
export const Animation = (() => {
  let cached: any;
  let cachedPlatform: Platform;

  return new Proxy({}, {
    get: (target, prop) => {
      const currentPlatform = getPlatformFn();
      if (!cached || cachedPlatform !== currentPlatform) {
        cached = getComponent<any>('Animation');
        cachedPlatform = currentPlatform;
      }
      return cached[prop];
    }
  }) as any;
})();

export const Easing = (() => {
  let cached: any;
  let cachedPlatform: Platform;

  return new Proxy({}, {
    get: (target, prop) => {
      const currentPlatform = getPlatformFn();
      if (!cached || cachedPlatform !== currentPlatform) {
        cached = getComponent<any>('Easing');
        cachedPlatform = currentPlatform;
      }
      return cached[prop];
    }
  }) as any;
})();

/**
 * Type exports
 * These need to be available at compile time
 */
export type {
  // Component types
  ImageSource,
  ValueBindingBase,

  // Style types
  LayoutStyle,
  TextStyle,
  ImageStyle,
  ViewStyle,
  DimensionValue,
  ColorValue,
  FlexDirection,
  FlexAlign,
  FlexJustify,
  FlexWrap,
  Position,
  TextAlign,
  FontWeight,
  ImageResizeMode,
  BorderStyle,
  Overflow,
  Display,
  PointerEvents,

  // Player type (Horizon-specific, but exported for compatibility)
  Player
} from './adapters/horizon';

/**
 * Web-specific exports (only available on web platform)
 */
export { UIRenderer } from '../../deployments/web/src/ui';

/**
 * Platform-specific utilities
 */
export function initializePlatform(): void {
  const platform = getPlatformFn();
  if (platform === Platform.horizon) {
    HorizonAdapter.initializePlatform();
  } else {
    WebAdapter.initializePlatform();
  }
}

export function cleanupPlatform(): void {
  const platform = getPlatformFn();
  if (platform === Platform.horizon) {
    HorizonAdapter.cleanupPlatform();
  } else {
    WebAdapter.cleanupPlatform();
  }
}

export function getCurrentPlayer(): any {
  const platform = getPlatformFn();
  if (platform === Platform.horizon) {
    return HorizonAdapter.getCurrentPlayer();
  } else {
    return WebAdapter.getCurrentPlayer();
  }
}

/**
 * Platform-specific props system
 */
export type { HorizonPropsDefinition } from './adapters/horizon';

export function createPropsDefinition(props: HorizonAdapter.HorizonPropsDefinition): HorizonAdapter.HorizonPropsDefinition {
  const platform = getPlatformFn();
  if (platform === Platform.horizon) {
    return HorizonAdapter.createPropsDefinition(props);
  } else {
    return WebAdapter.createPropsDefinition(props);
  }
}

/**
 * Helper to check if a component is available on current platform
 */
export function isComponentAvailable(componentName: string): boolean {
  try {
    getComponent(componentName);
    return true;
  } catch {
    return false;
  }
}

/**
 * Default export for convenience
 */
export default {
  Platform,
  setPlatform: setPlatformFn,
  getPlatform: getPlatformFn,
  isHorizon: isHorizonFn,
  isWeb: isWebFn,
  View,
  Text,
  Image,
  Pressable,
  ScrollView,
  DynamicList,
  Binding,
  DerivedBinding,
  AnimatedBinding,
  UINode,
  Animation,
  Easing,
  initializePlatform,
  cleanupPlatform,
  getCurrentPlayer,
  createPropsDefinition,
  isComponentAvailable
};