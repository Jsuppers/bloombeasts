/**
 * AnimatedBinding - Web implementation matching Horizon's AnimatedBinding API
 * Supports animations for numeric values with timing, easing, and composition
 */

import { Binding } from './Binding';

// Polyfill for requestAnimationFrame in environments where it's not available
// @ts-ignore - Access global object safely across environments
const _global = (typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : {}) as any;

const requestAnimationFrame: (callback: (time: number) => void) => number =
  _global.requestAnimationFrame?.bind(_global) ||
  ((callback: (time: number) => void) => setTimeout(() => callback(Date.now()), 16) as any);

const cancelAnimationFrame: (id: number) => void =
  _global.cancelAnimationFrame?.bind(_global) ||
  ((id: number) => clearTimeout(id as any));

export type AnimationOnEndCallback = (finished: boolean) => void;

export interface TimingConfig {
  duration?: number;
  easing?: (value: number) => number;
}

export interface AnimationObject {
  type: 'timing' | 'delay' | 'repeat' | 'sequence';
  value?: number | ((prev: number) => number);
  config?: TimingConfig;
  delay?: number;
  animation?: AnimationObject;
  animations?: AnimationObject[];
  count?: number;
}

/**
 * AnimatedBinding class - extends Binding but only supports numbers
 */
export class AnimatedBinding extends Binding<number> {
  private currentAnimation: number | null = null;
  private animationStartTime: number = 0;
  private animationStartValue: number = 0;
  private renderCallback: (() => void) | null = null;

  constructor(initialValue: number) {
    super(initialValue);
  }

  /**
   * Set a render callback that will be called during animations
   * This allows the renderer to batch updates instead of subscribing
   */
  setRenderCallback(callback: () => void): void {
    this.renderCallback = callback;
  }

  /**
   * Set the value with optional animation
   * @override - Extends parent to support animations
   * Supports both parent signature and animation signature
   */
  set(
    value: number | ((prev: number) => number) | AnimationObject,
    onEndOrPlayers?: AnimationOnEndCallback | string[],
    _players?: string[]
  ): void {
    // If it's a plain number or function, delegate to parent
    if (typeof value === 'number' || typeof value === 'function') {
      // Check if second param is players array (parent signature)
      if (Array.isArray(onEndOrPlayers)) {
        super.set(value as any, onEndOrPlayers);
      } else {
        super.set(value as any);
      }
      return;
    }

    // It's an animation object
    const onEnd = typeof onEndOrPlayers === 'function' ? onEndOrPlayers : undefined;
    this.startAnimation(value, onEnd);
  }

  /**
   * Stop the current animation
   */
  stopAnimation(): void {
    if (this.currentAnimation !== null) {
      cancelAnimationFrame(this.currentAnimation);
      this.currentAnimation = null;
    }
  }

  /**
   * Interpolate the animated value to a new range
   */
  interpolate<T extends number | string>(
    inputRange: number[],
    outputRange: T[]
  ): Binding<T> {
    if (inputRange.length !== outputRange.length) {
      throw new Error('Input and output ranges must have the same length');
    }
    if (inputRange.length < 2) {
      throw new Error('Ranges must have at least 2 elements');
    }

    // Create a derived binding that interpolates values
    const derived = this.derive((value: number) => {
      return interpolateValue(value, inputRange, outputRange);
    });
    // Return as Binding (safe because we control the output type)
    return derived as any as Binding<T>;
  }

  /**
   * Start an animation
   */
  private startAnimation(animation: AnimationObject, onEnd?: AnimationOnEndCallback): void {
    this.stopAnimation();

    const executeAnimation = (anim: AnimationObject, callback?: AnimationOnEndCallback) => {
      switch (anim.type) {
        case 'timing':
          return this.executeTiming(anim, callback);
        case 'delay':
          return this.executeDelay(anim, callback);
        case 'repeat':
          return this.executeRepeat(anim, callback);
        case 'sequence':
          return this.executeSequence(anim, callback);
        default:
          if (callback) callback(false);
      }
    };

    executeAnimation(animation, onEnd);
  }

  /**
   * Execute a timing animation
   */
  private executeTiming(anim: AnimationObject, onEnd?: AnimationOnEndCallback): void {
    const config = anim.config || {};
    const duration = config.duration || 500;
    const easing = config.easing || Easing.inOut(Easing.ease);

    // Calculate target value
    const currentValue = this.get();
    const targetValue = typeof anim.value === 'function'
      ? anim.value(currentValue)
      : anim.value || currentValue;

    this.animationStartTime = performance.now();
    this.animationStartValue = currentValue;

    const animate = (timestamp: number) => {
      const elapsed = timestamp - this.animationStartTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);

      const newValue = this.animationStartValue + (targetValue - this.animationStartValue) * easedProgress;

      // Update value silently without triggering all subscribers
      // Only notify at the end or if renderCallback is set
      (this as any)._value = newValue;

      // If a render callback is set, use it instead of full subscriber notification
      if (this.renderCallback) {
        this.renderCallback();
      }

      if (progress < 1) {
        this.currentAnimation = requestAnimationFrame(animate);
      } else {
        this.currentAnimation = null;
        // Notify all subscribers at the end
        super.set(newValue);
        if (onEnd) onEnd(true);
      }
    };

    this.currentAnimation = requestAnimationFrame(animate);
  }

  /**
   * Execute a delay before an animation
   */
  private executeDelay(anim: AnimationObject, onEnd?: AnimationOnEndCallback): void {
    const delayMs = anim.delay || 0;

    setTimeout(() => {
      if (anim.animation) {
        this.startAnimation(anim.animation, onEnd);
      } else {
        if (onEnd) onEnd(true);
      }
    }, delayMs);
  }

  /**
   * Execute a repeated animation
   */
  private executeRepeat(anim: AnimationObject, onEnd?: AnimationOnEndCallback): void {
    const count = anim.count !== undefined && anim.count >= 0 ? anim.count : -1;
    const initialValue = this.get();
    let iteration = 0;

    const repeatOnce = () => {
      if (count === -1 || iteration < count) {
        iteration++;
        // Reset to initial value before each iteration
        super.set(initialValue);

        if (anim.animation) {
          this.startAnimation(anim.animation, (finished) => {
            if (finished) {
              // Continue to next iteration
              repeatOnce();
            } else {
              // Animation was stopped
              if (onEnd) onEnd(false);
            }
          });
        }
      } else {
        // All iterations complete
        if (onEnd) onEnd(true);
      }
    };

    repeatOnce();
  }

  /**
   * Execute a sequence of animations
   */
  private executeSequence(anim: AnimationObject, onEnd?: AnimationOnEndCallback): void {
    const animations = anim.animations || [];
    let index = 0;

    const executeNext = () => {
      if (index < animations.length) {
        const currentAnim = animations[index];
        index++;

        this.startAnimation(currentAnim, (finished) => {
          if (finished) {
            executeNext();
          } else {
            // Animation was stopped
            if (onEnd) onEnd(false);
          }
        });
      } else {
        // Sequence complete
        if (onEnd) onEnd(true);
      }
    };

    executeNext();
  }
}

/**
 * Animation helper functions matching Horizon API
 */
export const Animation = {
  /**
   * Create a timing animation
   */
  timing(
    value: number | ((prev: number) => number),
    config?: TimingConfig
  ): AnimationObject {
    return {
      type: 'timing',
      value,
      config,
    };
  },

  /**
   * Create a delayed animation
   */
  delay(delayMs: number, animation: AnimationObject): AnimationObject {
    return {
      type: 'delay',
      delay: delayMs,
      animation,
    };
  },

  /**
   * Create a repeated animation
   */
  repeat(animation: AnimationObject, count?: number): AnimationObject {
    return {
      type: 'repeat',
      animation,
      count,
    };
  },

  /**
   * Create a sequence of animations
   */
  sequence(...animations: AnimationObject[]): AnimationObject {
    return {
      type: 'sequence',
      animations,
    };
  },
};

/**
 * Easing functions matching Horizon API
 */
export const Easing = {
  linear: (t: number) => t,

  ease: (t: number) => {
    // Cubic ease-in-out
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  },

  quad: (t: number) => t * t,

  cubic: (t: number) => t * t * t,

  sin: (t: number) => Math.sin((t * Math.PI) / 2),

  circle: (t: number) => 1 - Math.sqrt(1 - t * t),

  exp: (t: number) => (t === 0 ? 0 : Math.pow(2, 10 * (t - 1))),

  elastic: (t: number) => {
    if (t === 0 || t === 1) return t;
    return -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI);
  },

  back: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  },

  bounce: (t: number) => {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (t < 1 / d1) {
      return n1 * t * t;
    } else if (t < 2 / d1) {
      return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
      return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
      return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
  },

  in: (easing: (t: number) => number) => easing,

  out: (easing: (t: number) => number) => (t: number) => 1 - easing(1 - t),

  inOut: (easing: (t: number) => number) => (t: number) => {
    if (t < 0.5) {
      return easing(t * 2) / 2;
    } else {
      return 1 - easing((1 - t) * 2) / 2;
    }
  },
};

/**
 * Interpolate a value between input and output ranges
 */
function interpolateValue<T extends number | string>(
  value: number,
  inputRange: number[],
  outputRange: T[]
): T {
  // Find the segment
  let segmentIndex = 0;
  for (let i = 1; i < inputRange.length; i++) {
    if (value <= inputRange[i]) {
      segmentIndex = i - 1;
      break;
    }
    if (i === inputRange.length - 1) {
      segmentIndex = i - 1;
    }
  }

  const inputMin = inputRange[segmentIndex];
  const inputMax = inputRange[segmentIndex + 1];
  const outputMin = outputRange[segmentIndex];
  const outputMax = outputRange[segmentIndex + 1];

  // Linear interpolation
  const progress = (value - inputMin) / (inputMax - inputMin);

  // Handle different output types
  if (typeof outputMin === 'number' && typeof outputMax === 'number') {
    return (outputMin + (outputMax - outputMin) * progress) as T;
  }

  if (typeof outputMin === 'string' && typeof outputMax === 'string') {
    // Check if it's a color
    if (isColor(outputMin) && isColor(outputMax)) {
      return interpolateColor(outputMin, outputMax, progress) as T;
    }

    // Check if it's a suffixed number (e.g., "50px", "90deg")
    const minMatch = outputMin.match(/^([\d.]+)(.*)$/);
    const maxMatch = outputMax.match(/^([\d.]+)(.*)$/);

    if (minMatch && maxMatch && minMatch[2] === maxMatch[2]) {
      const minNum = parseFloat(minMatch[1]);
      const maxNum = parseFloat(maxMatch[1]);
      const suffix = minMatch[2];
      const result = minNum + (maxNum - minNum) * progress;
      return `${result}${suffix}` as T;
    }
  }

  // Fallback: just return the start or end value
  return progress < 0.5 ? outputMin : outputMax;
}

/**
 * Check if a string is a color
 */
function isColor(str: string): boolean {
  return /^#[0-9A-Fa-f]{3,8}$/.test(str) ||
         /^rgb\(/.test(str) ||
         /^rgba\(/.test(str) ||
         /^hsl\(/.test(str) ||
         ['red', 'green', 'blue', 'black', 'white', 'transparent'].includes(str.toLowerCase());
}

/**
 * Interpolate between two colors
 */
function interpolateColor(color1: string, color2: string, progress: number): string {
  const rgb1 = parseColor(color1);
  const rgb2 = parseColor(color2);

  if (!rgb1 || !rgb2) return progress < 0.5 ? color1 : color2;

  const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * progress);
  const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * progress);
  const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * progress);
  const a = rgb1.a + (rgb2.a - rgb1.a) * progress;

  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/**
 * Parse a color string to RGB
 */
function parseColor(color: string): { r: number; g: number; b: number; a: number } | null {
  // Handle hex colors
  if (color.startsWith('#')) {
    const hex = color.slice(1);
    let r, g, b, a = 1;

    if (hex.length === 3) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    } else if (hex.length === 6) {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    } else {
      return null;
    }

    return { r, g, b, a };
  }

  // Handle rgb/rgba
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]),
      g: parseInt(rgbMatch[2]),
      b: parseInt(rgbMatch[3]),
      a: rgbMatch[4] ? parseFloat(rgbMatch[4]) : 1,
    };
  }

  // Handle named colors
  const namedColors: Record<string, { r: number; g: number; b: number; a: number }> = {
    red: { r: 255, g: 0, b: 0, a: 1 },
    green: { r: 0, g: 128, b: 0, a: 1 },
    blue: { r: 0, g: 0, b: 255, a: 1 },
    black: { r: 0, g: 0, b: 0, a: 1 },
    white: { r: 255, g: 255, b: 255, a: 1 },
    transparent: { r: 0, g: 0, b: 0, a: 0 },
  };

  return namedColors[color.toLowerCase()] || null;
}
