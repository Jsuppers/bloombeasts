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

import type { IGameState, IActionResult } from '../../../turbo/src';
import type { BloomBeastsState } from '../BloomBeastsGame';

/**
 * Generic action data shape
 */
export interface ActionData {
  type: string;
  [key: string]: any;
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
    state: IGameState<BloomBeastsState>,
    playerId: string
  ): ActionValidationResult;

  /**
   * Execute the action and return the new state
   * Note: Must not mutate the input state
   */
  execute(
    actionData: TActionData,
    state: IGameState<BloomBeastsState>,
    playerId: string
  ): IActionResult<BloomBeastsState>;
}

/**
 * Result of action validation
 */
export type ActionValidationResult =
  | { valid: true }
  | { valid: false; reason: string };

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
    state: IGameState<BloomBeastsState>,
    playerId: string
  ): ActionValidationResult;

  /**
   * Execute the action
   * Override to implement action-specific logic
   */
  abstract execute(
    actionData: TActionData,
    state: IGameState<BloomBeastsState>,
    playerId: string
  ): IActionResult<BloomBeastsState>;

  /**
   * Helper: Get current player from state
   */
  protected getCurrentPlayer(state: IGameState<BloomBeastsState>, playerId: string) {
    const player = state.gameData.players.find(p => p.id === playerId);
    if (!player) {
      throw new Error(`Player ${playerId} not found in state`);
    }
    return player;
  }

  /**
   * Helper: Get opponent player from state
   */
  protected getOpponentPlayer(state: IGameState<BloomBeastsState>, playerId: string) {
    const opponent = state.gameData.players.find(p => p.id !== playerId);
    if (!opponent) {
      throw new Error(`Opponent not found for player ${playerId}`);
    }
    return opponent;
  }

  /**
   * Helper: Get current player index
   */
  protected getCurrentPlayerIndex(state: IGameState<BloomBeastsState>, playerId: string): number {
    return state.gameData.players.findIndex(p => p.id === playerId);
  }

  /**
   * Helper: Clone state (deep copy)
   * TODO: Replace with better cloning strategy (structuredClone or Immer)
   */
  protected cloneState(state: IGameState<BloomBeastsState>): IGameState<BloomBeastsState> {
    // This is a temporary solution - the JSON serialization approach has issues
    // with Set objects and other non-JSON types
    const cloned = JSON.parse(JSON.stringify(state)) as IGameState<BloomBeastsState>;

    // Restore Set objects if they exist
    if (cloned.gameData?.currentTurnActions?.hasAttacked) {
      const hasAttackedArray = Array.isArray(cloned.gameData.currentTurnActions.hasAttacked)
        ? cloned.gameData.currentTurnActions.hasAttacked
        : Array.from(cloned.gameData.currentTurnActions.hasAttacked as any);
      cloned.gameData.currentTurnActions.hasAttacked = new Set(hasAttackedArray);
    }

    return cloned;
  }

  /**
   * Helper: Create success result
   */
  protected success(newState: IGameState<BloomBeastsState>, message?: string): IActionResult<BloomBeastsState> {
    return {
      success: true,
      state: newState,
      message,
    };
  }

  /**
   * Helper: Create failure result
   */
  protected failure(reason: string): IActionResult<BloomBeastsState> {
    return {
      success: false,
      message: reason,
    };
  }
}
