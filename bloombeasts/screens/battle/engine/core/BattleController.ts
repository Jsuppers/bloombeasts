/**
 * BattleController - Thin facade for battle management
 *
 * This is now a simple facade that delegates to specialized subsystems:
 * - BattleOrchestrator: Battle lifecycle and event coordination
 * - AIManager: AI player management and turn execution
 * - ActionProcessor: Player action handling
 * - WinConditionChecker: Battle end conditions
 *
 * All the complex logic has been extracted into focused, testable classes.
 *
 * Consumers should use getGameController() to subscribe to TURBO events directly
 * instead of using callbacks.
 */

import { Turbo } from '../../../../lib/Turbo-Standalone';

import type { AsyncMethods } from '../../../../common/ui/types/types/bindings';
import type { BattleConfig, BattleState, BattleResult } from '../types';
import { BattleOrchestrator } from './BattleOrchestrator';
import type { BloomBeastsState, BloomBeastsActionData } from '../BloomBeastsGame';

export class BattleController {
  private orchestrator: BattleOrchestrator;

  constructor(async: AsyncMethods) {
    this.orchestrator = new BattleOrchestrator(async);
  }

  /**
   * Initialize a new battle
   */
  initializeBattle(config: BattleConfig): BattleState {
    return this.orchestrator.initializeBattle(config);
  }

  /**
   * Get current battle state
   */
  getCurrentBattle(): BattleState | null {
    return this.orchestrator.getState();
  }

  /**
   * Check if battle has ended
   */
  checkBattleEnd(): BattleResult | null {
    const state = this.orchestrator.getState().turboState;
    return this.orchestrator.winChecker.checkBattleEnd(state);
  }

  /**
   * Mark battle as complete
   */
  completeBattle(winner: 'player1' | 'player2' | null): void {
    // Battle completion is handled automatically by TURBO
  }

  /**
   * Draw a card
   */
  drawCard(playerId: string): boolean {
    return this.orchestrator.actions.drawCard(playerId);
  }

  /**
   * Play a card
   */
  playCard(cardId: string, playerId: string, position?: number): boolean {
    return this.orchestrator.actions.playCard(cardId, playerId, position);
  }

  /**
   * Attack with a beast
   */
  attackBeast(attackerId: string, targetId: string, playerId: string): boolean {
    return this.orchestrator.actions.attack(attackerId, targetId, playerId);
  }

  /**
   * Attack player directly
   */
  attackPlayer(attackerId: string, playerId: string): boolean {
    return this.orchestrator.actions.attackPlayer(attackerId, playerId);
  }

  /**
   * Use creature ability
   */
  useAbility(creatureId: string, targetId: string | null, playerId: string): boolean {
    return this.orchestrator.actions.useAbility(creatureId, targetId, playerId);
  }

  /**
   * End turn
   */
  endTurn(playerId: string): void {
    this.orchestrator.actions.endTurn(playerId);
  }

  /**
   * REMOVED: timeoutLoss() - Timeout is now handled through TURBO actions
   * See TimeoutActionHandler and WinConditionChecker for timeout handling
   */

  /**
   * Execute AI turn
   * @param onActionComplete Optional callback called after each AI action to update UI
   */
  async executeAITurn(onActionComplete?: () => void): Promise<void> {
    return this.orchestrator.ai.executeAITurn(onActionComplete);
  }

  /**
   * Get current player
   */
  getCurrentPlayer() {
    return this.orchestrator.getCurrentPlayer();
  }

  /**
   * Get opponent player
   */
  getOpponentPlayer() {
    return this.orchestrator.getOpponentPlayer();
  }

  /**
   * Check if current player is AI
   */
  isAIPlayerTurn(): boolean {
    return this.orchestrator.ai.isAIPlayerTurn();
  }

  /**
   * Get available actions
   */
  getAvailableActions() {
    return this.orchestrator.actions.getAvailableActions();
  }

  /**
   * Get the underlying TURBO game controller
   * Use this to subscribe to TURBO events directly
   */
  getGameController(): Turbo.GameController<BloomBeastsState, BloomBeastsActionData> {
    return this.orchestrator.getGameController();
  }

  /**
   * Dispose battle resources
   */
  dispose(): void {
    this.orchestrator.dispose();
  }
}
