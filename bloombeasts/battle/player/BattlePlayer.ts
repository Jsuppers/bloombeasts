/**
 * BattlePlayer - Base interface for players in a battle
 *
 * This interface abstracts different player types (human, AI, networked)
 * so the battle system doesn't need to know the implementation details.
 */

import { Player } from '../../engine/types/game';
import type { AsyncMethods } from '../../ui/types/bindings';

export interface BattlePlayerCallbacks {
  onAction?: (action: string) => void;
  onRender?: () => void;
}

/**
 * Base interface for a player in battle
 */
export interface IBattlePlayer {
  /**
   * Get the player data
   */
  getPlayer(): Player;

  /**
   * Get whether this player is AI-controlled
   */
  isAI(): boolean;

  /**
   * Execute a turn (for AI players)
   * For human players, this does nothing (they control via UI)
   */
  executeTurn(
    opponent: Player,
    gameState: any,
    effectProcessors: any,
    shouldStopGetter?: () => boolean
  ): Promise<void>;
}

/**
 * Human player implementation
 */
export class HumanPlayer implements IBattlePlayer {
  private player: Player;

  constructor(player: Player) {
    this.player = player;
  }

  getPlayer(): Player {
    return this.player;
  }

  isAI(): boolean {
    return false;
  }

  async executeTurn(): Promise<void> {
    // Human players don't auto-execute turns - they control via UI
    return Promise.resolve();
  }
}

/**
 * AI player implementation
 */
export class AIBattlePlayer implements IBattlePlayer {
  private player: Player;
  private ai: any; // OpponentAI instance
  private async: AsyncMethods;

  constructor(player: Player, ai: any, async: AsyncMethods) {
    this.player = player;
    this.ai = ai;
    this.async = async;
  }

  getPlayer(): Player {
    return this.player;
  }

  isAI(): boolean {
    return true;
  }

  async executeTurn(
    opponent: Player,
    gameState: any,
    effectProcessors: any,
    shouldStopGetter?: () => boolean
  ): Promise<void> {
    // Delegate to AI
    await this.ai.executeTurn(
      this.player,
      opponent,
      gameState,
      effectProcessors,
      shouldStopGetter
    );
  }
}
