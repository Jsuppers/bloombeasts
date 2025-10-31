/**
 * BattleController - Core battle orchestrator
 *
 * Generic battle controller that works with any two players.
 * Handles:
 * - Battle initialization
 * - Turn management
 * - Victory conditions
 * - Action processing coordination
 *
 * This class is platform-agnostic and player-agnostic - it doesn't care
 * if players are human, AI, or networked.
 */

import { GameState, Player, BattlePhase } from '../../engine/types/game';
import { AnyCard } from '../../engine/types/core';
import { Logger } from '../../engine/utils/Logger';
import { SimpleMap } from '../../utils/polyfills';
import { shuffle } from '../../engine/utils/random';
import type { AsyncMethods } from '../../ui/types/bindings';
import {
  BattleConfig,
  BattleState,
  BattleCallbacks,
  BattleResult,
  BattleActionResult,
} from '../types';

export class BattleController {
  private async: AsyncMethods;
  private currentBattle: BattleState | null = null;
  private callbacks: BattleCallbacks;

  constructor(async: AsyncMethods, callbacks: BattleCallbacks = {}) {
    this.async = async;
    this.callbacks = callbacks;
  }

  /**
   * Initialize a new battle between two players
   */
  initializeBattle(config: BattleConfig): BattleState {
    Logger.info('[BattleController] Initializing battle');

    // Create player 1
    const player1: Player = {
      id: config.player1.id,
      name: config.player1.name,
      health: config.player1.health ?? 30,
      maxHealth: config.player1.maxHealth ?? 30,
      deck: [...config.player1.deck], // Copy deck to avoid mutation
      hand: [],
      field: [],
      graveyard: [],
      trapZone: [],
      buffZone: [],
      currentNectar: 1,
      summonsThisTurn: 0,
    };

    // Create player 2
    const player2: Player = {
      id: config.player2.id,
      name: config.player2.name,
      health: config.player2.health ?? 30,
      maxHealth: config.player2.maxHealth ?? 30,
      deck: [...config.player2.deck], // Copy deck to avoid mutation
      hand: [],
      field: [],
      graveyard: [],
      trapZone: [],
      buffZone: [],
      currentNectar: 1,
      summonsThisTurn: 0,
    };

    // Create game state
    const gameState: GameState = {
      players: [player1, player2],
      activePlayer: 0,
      habitatZone: null,
      turn: 1,
      phase: 'Setup',
      battleState: BattlePhase.Player1StartOfTurn,
      turnHistory: [],
    };

    // Create battle state
    this.currentBattle = {
      gameState,
      isComplete: false,
      winner: null,
      turn: 1,
    };

    // Shuffle decks
    this.shuffleDeck(player1.deck);
    this.shuffleDeck(player2.deck);

    // Draw initial hands (3 cards each)
    for (let i = 0; i < 3; i++) {
      this.drawCard(player1);
      this.drawCard(player2);
    }

    Logger.info('[BattleController] Battle initialized');
    return this.currentBattle;
  }

  /**
   * Get the current battle state
   */
  getCurrentBattle(): BattleState | null {
    return this.currentBattle;
  }

  /**
   * Check if battle has ended and determine winner
   */
  checkBattleEnd(): BattleResult | null {
    if (!this.currentBattle) return null;

    const player1 = this.currentBattle.gameState.players[0];
    const player2 = this.currentBattle.gameState.players[1];

    // Check if either player is defeated
    if (player1.health <= 0 && player2.health <= 0) {
      // Both died (rare tie case)
      return {
        winner: null,
        turns: this.currentBattle.turn,
        player1Health: player1.health,
        player2Health: player2.health,
      };
    } else if (player1.health <= 0) {
      // Player 1 lost
      return {
        winner: 'player2',
        turns: this.currentBattle.turn,
        player1Health: player1.health,
        player2Health: player2.health,
      };
    } else if (player2.health <= 0) {
      // Player 2 lost
      return {
        winner: 'player1',
        turns: this.currentBattle.turn,
        player1Health: player1.health,
        player2Health: player2.health,
      };
    }

    // Check deck-out condition (no cards left to draw)
    if (player1.deck.length === 0 && player1.hand.length === 0 && player1.field.every(b => !b)) {
      return {
        winner: 'player2',
        turns: this.currentBattle.turn,
        player1Health: player1.health,
        player2Health: player2.health,
      };
    }
    if (player2.deck.length === 0 && player2.hand.length === 0 && player2.field.every(b => !b)) {
      return {
        winner: 'player1',
        turns: this.currentBattle.turn,
        player1Health: player1.health,
        player2Health: player2.health,
      };
    }

    return null;
  }

  /**
   * Mark battle as complete
   */
  completeBattle(winner: 'player1' | 'player2' | null): void {
    if (!this.currentBattle) return;

    this.currentBattle.isComplete = true;
    this.currentBattle.winner = winner;

    if (this.callbacks.onBattleEnd) {
      this.callbacks.onBattleEnd(winner);
    }

    Logger.info(`[BattleController] Battle complete. Winner: ${winner || 'tie'}`);
  }

  /**
   * Start a player's turn
   */
  startTurn(playerIndex: number): void {
    if (!this.currentBattle) return;

    const gameState = this.currentBattle.gameState;
    gameState.activePlayer = playerIndex as 0 | 1;

    const player = gameState.players[playerIndex];
    const opponent = gameState.players[1 - playerIndex];

    // Draw a card at start of turn
    this.drawCard(player);

    // Increase nectar (max 10)
    player.currentNectar = Math.min(10, this.currentBattle.turn);

    // Reset summoning sickness and ability usage for player's beasts
    player.field.forEach((beast: any) => {
      if (beast) {
        beast.summoningSickness = false;
        beast.usedAbilityThisTurn = false;
      }
    });

    if (this.callbacks.onTurnStart) {
      this.callbacks.onTurnStart(playerIndex);
    }

    if (this.callbacks.onRender) {
      this.callbacks.onRender();
    }
  }

  /**
   * End a player's turn
   */
  endTurn(playerIndex: number): void {
    if (!this.currentBattle) return;

    if (this.callbacks.onTurnEnd) {
      this.callbacks.onTurnEnd(playerIndex);
    }

    // Increment turn counter when player 2 ends their turn
    if (playerIndex === 1) {
      this.currentBattle.turn++;
    }
  }

  /**
   * Draw a card from player's deck
   */
  private drawCard(player: Player): void {
    if (player.deck.length === 0) {
      Logger.debug(`[BattleController] No cards left in deck for ${player.name}`);
      return;
    }

    const card = player.deck.shift();
    if (card) {
      player.hand.push(card);
      Logger.debug(`[BattleController] ${player.name} drew a card: ${card.name}`);
    }
  }

  /**
   * Shuffle a deck
   */
  private shuffleDeck(deck: AnyCard[]): void {
    shuffle(deck);
  }

  /**
   * Clean up battle resources
   */
  dispose(): void {
    this.currentBattle = null;
    Logger.info('[BattleController] Battle controller disposed');
  }
}
