/**
 * EffectHandlerRegistry
 *
 * Strategy Pattern implementation for effect processing.
 * Provides extensible, testable effect handling without large switch statements.
 */

import { BloomBeastInstance } from '../types/leveling';
import { Player, GameState } from '../types/game';
import { AbilityEffect, EffectType } from '../types/abilities';

/**
 * Context for effect processing
 */
export interface EffectContext {
  source: BloomBeastInstance;
  target?: BloomBeastInstance;
  targets?: BloomBeastInstance[];
  attacker?: BloomBeastInstance;
  gameState: GameState;
  controllingPlayer: Player;
  opposingPlayer: Player;
}

/**
 * Result of effect processing
 */
export interface EffectProcessResult {
  success: boolean;
  message?: string;
  modifiedState?: Partial<GameState>;
  modifiedUnits?: BloomBeastInstance[];
}

/**
 * Effect handler interface
 */
export interface EffectHandler {
  /**
   * Check if this handler can process the effect
   */
  canHandle(effect: AbilityEffect): boolean;

  /**
   * Process the effect
   */
  process(effect: AbilityEffect, context: EffectContext): EffectProcessResult;

  /**
   * Priority for handler execution (higher = earlier)
   * Useful if multiple handlers can process the same effect
   */
  priority?: number;
}

/**
 * Registry for effect handlers
 */
export class EffectHandlerRegistry {
  private handlers: Map<EffectType, EffectHandler[]> = new Map();
  private fallbackHandler?: EffectHandler;

  /**
   * Register a handler for a specific effect type
   */
  register(effectType: EffectType, handler: EffectHandler): void {
    if (!this.handlers.has(effectType)) {
      this.handlers.set(effectType, []);
    }

    const handlers = this.handlers.get(effectType)!;
    handlers.push(handler);

    // Sort by priority (highest first)
    handlers.sort((a, b) => (b.priority || 0) - (a.priority || 0));
  }

  /**
   * Register a handler for multiple effect types
   */
  registerMultiple(effectTypes: EffectType[], handler: EffectHandler): void {
    for (const effectType of effectTypes) {
      this.register(effectType, handler);
    }
  }

  /**
   * Set a fallback handler for unknown effect types
   */
  setFallback(handler: EffectHandler): void {
    this.fallbackHandler = handler;
  }

  /**
   * Process an effect using registered handlers
   */
  process(effect: AbilityEffect, context: EffectContext): EffectProcessResult {
    const handlers = this.handlers.get(effect.type);

    if (handlers) {
      // Try each handler in priority order
      for (const handler of handlers) {
        if (handler.canHandle(effect)) {
          return handler.process(effect, context);
        }
      }
    }

    // Try fallback handler
    if (this.fallbackHandler && this.fallbackHandler.canHandle(effect)) {
      return this.fallbackHandler.process(effect, context);
    }

    // No handler found
    return {
      success: false,
      message: `No handler found for effect type: ${effect.type}`,
    };
  }

  /**
   * Check if a handler exists for an effect type
   */
  hasHandler(effectType: EffectType): boolean {
    return this.handlers.has(effectType);
  }

  /**
   * Get all handlers for an effect type
   */
  getHandlers(effectType: EffectType): EffectHandler[] {
    return this.handlers.get(effectType) || [];
  }

  /**
   * Remove a handler
   */
  unregister(effectType: EffectType, handler: EffectHandler): boolean {
    const handlers = this.handlers.get(effectType);
    if (!handlers) {
      return false;
    }

    const index = handlers.indexOf(handler);
    if (index !== -1) {
      handlers.splice(index, 1);
      return true;
    }

    return false;
  }

  /**
   * Clear all handlers
   */
  clear(): void {
    this.handlers.clear();
    this.fallbackHandler = undefined;
  }

  /**
   * Get all registered effect types
   */
  getRegisteredTypes(): EffectType[] {
    return Array.from(this.handlers.keys());
  }
}

/**
 * Create and return a singleton registry
 */
export const effectRegistry = new EffectHandlerRegistry();

/**
 * Helper to create a simple effect handler
 */
export function createEffectHandler(
  effectType: EffectType | EffectType[],
  processor: (effect: AbilityEffect, context: EffectContext) => EffectProcessResult,
  priority: number = 0
): EffectHandler {
  const types = Array.isArray(effectType) ? effectType : [effectType];

  return {
    canHandle: (effect: AbilityEffect) => types.includes(effect.type),
    process: processor,
    priority,
  };
}

/**
 * Decorator for registering effect handlers
 */
export function RegisterEffectHandler(effectType: EffectType | EffectType[], priority: number = 0) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    const handler = createEffectHandler(effectType, originalMethod, priority);

    const types = Array.isArray(effectType) ? effectType : [effectType];
    for (const type of types) {
      effectRegistry.register(type, handler);
    }

    return descriptor;
  };
}
