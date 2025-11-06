/**
 * Action Handler Interface
 *
 * Defines the contract for handling specific game actions.
 * Each action type gets its own handler class, breaking down the monolithic
 * executeAction() method into manageable, testable pieces.
 *
 * Benefits:
 * - Single Responsibility: Each handler does one thing
 * - Testability: Easy to unit test individual actions
 * - Maintainability: Changes to one action don't affect others
 * - Extensibility: Easy to add new action types
 */

import { Turbo } from '../../lib/Turbo-Standalone';

import type { BloomBeastsState } from '../types';
import type { MagicCard, AnyCard } from '../../engine/types/core';

/**
 * Generic action data shape
 */
export interface ActionData {
  type: string;
  [key: string]: unknown;
}

/**
 * Trigger context - data passed when processing triggers
 */
export interface TriggerContext {
  action?: string;
  card?: AnyCard;
  [key: string]: unknown;
}

/**
 * Action handler context - additional dependencies passed to handlers
 */
export interface ActionHandlerContext {
  /**
   * Process triggers at a specific timing
   */
  processTriggers?: (timing: string, state: Turbo.IGameState<BloomBeastsState>, context?: TriggerContext) => void;

  /**
   * Process magic card effects
   */
  processMagicCard?: (card: MagicCard, state: Turbo.IGameState<BloomBeastsState>) => void;
}

/**
 * Action handler interface
 * Implementations process a specific type of game action
 */
export interface IActionHandler<TActionData extends ActionData = ActionData> {
  /**
   * The action type this handler processes
   */
  readonly actionType: string;

  /**
   * Validate that the action can be performed
   * @returns { valid: true } if valid, or { valid: false, reason: string } if invalid
   */
  validate(
    actionData: TActionData,
    state: Turbo.IGameState<BloomBeastsState>,
    playerId: string
  ): ActionValidationResult;

  /**
   * Execute the action and return the full result including new state, events, and side effects
   * Note: Must not mutate the input state
   */
  execute(
    actionData: TActionData,
    state: Turbo.IGameState<BloomBeastsState>,
    playerId: string,
    context?: ActionHandlerContext
  ): Turbo.IActionResult<BloomBeastsState>;
}

/**
 * Result of action validation
 */
export interface ActionValidationResult {
  valid: boolean;
  reason?: string;
}

/**
 * Action handler registry
 * Maps action types to their handlers
 */
export class ActionHandlerRegistry {
  private handlers: Map<string, IActionHandler>;

  constructor() {
    this.handlers = new Map();
  }

  /**
   * Register an action handler
   */
  register(handler: IActionHandler): void {
    if (this.handlers.has(handler.actionType)) {
      console.warn(`[ActionHandlerRegistry] Overwriting handler for action type: ${handler.actionType}`);
    }
    this.handlers.set(handler.actionType, handler);
  }

  /**
   * Register multiple handlers at once
   */
  registerAll(handlers: IActionHandler[]): void {
    handlers.forEach(handler => this.register(handler));
  }

  /**
   * Get handler for an action type
   */
  get(actionType: string): IActionHandler | undefined {
    return this.handlers.get(actionType);
  }

  /**
   * Check if a handler is registered for an action type
   */
  has(actionType: string): boolean {
    return this.handlers.has(actionType);
  }

  /**
   * Get all registered action types
   */
  getRegisteredTypes(): string[] {
    return Array.from(this.handlers.keys());
  }
}

/**
 * Base action handler with common utilities
 * Extend this for specific action handlers
 */
export abstract class BaseActionHandler<TActionData extends ActionData = ActionData>
  implements IActionHandler<TActionData> {

  abstract readonly actionType: string;

  /**
   * Validate the action
   * Override to add specific validation logic
   */
  abstract validate(
    actionData: TActionData,
    state: Turbo.IGameState<BloomBeastsState>,
    playerId: string
  ): ActionValidationResult;

  /**
   * Execute the action and return full result
   * Override to implement action-specific logic
   */
  abstract execute(
    actionData: TActionData,
    state: Turbo.IGameState<BloomBeastsState>,
    playerId: string,
    context?: ActionHandlerContext
  ): Turbo.IActionResult<BloomBeastsState>;

  /**
   * Helper: Get current player from state
   */
  protected getCurrentPlayer(state: Turbo.IGameState<BloomBeastsState>, playerId: string) {
    const player = state.gameData.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error(`Player ${playerId} not found in state`);
    }
    return player;
  }

  /**
   * Helper: Get opponent player from state
   */
  protected getOpponentPlayer(state: Turbo.IGameState<BloomBeastsState>, playerId: string) {
    const opponent = state.gameData.players.find(p => p.id !== playerId);
    if (!opponent) {
      throw new Error(`Opponent not found for player ${playerId}`);
    }
    return opponent;
  }

  /**
   * Helper: Get current player index
   */
  protected getCurrentPlayerIndex(state: Turbo.IGameState<BloomBeastsState>, playerId: string): number {
    return state.gameData.players.findIndex(p => p.id === playerId);
  }

  /**
   * Helper: Clone state (deep copy)
   * Uses structuredClone for proper handling of Sets, Maps, Dates, etc.
   */
  protected cloneState(state: Turbo.IGameState<BloomBeastsState>): Turbo.IGameState<BloomBeastsState> {
    return structuredClone(state) as Turbo.IGameState<BloomBeastsState>;
  }

  /**
   * Helper: Create event for action result
   */
  protected createEvent(type: string, playerId: string, data?: Record<string, unknown>) {
    return {
      type,
      description: `${type} for player ${playerId}`,
      data: {
        type,
        playerId,
        data: data || {},
        timestamp: Date.now(),
      }
    };
  }
}
