/**
 * BloomBeasts game implementation using the TURBO library
 */

import { Turbo } from '../lib/Turbo-Standalone';

// Import existing BloomBeasts types
import { CardType } from '../engine/types/core';
import {
  BloomBeastCard,
  MagicCard,
  TrapCard,
  BuffCard,
  HabitatCard,
} from '../engine/types/core';
import { Player as BloomPlayer } from '../engine/types/game';
import { shuffle } from '../engine/utils/random';
import {
  ActionHandlerRegistry,
  DrawCardActionHandler,
  PlayCardActionHandler,
  AttackActionHandler,
  EndTurnActionHandler,
  TimeoutActionHandler,
  ForfeitActionHandler,
  TriggerContext,
} from './actions';
// Import types from ./types to avoid circular dependencies with action handlers
import type {
  BloomBeastsState,
  BloomBeastsActionData,
  BloomBeastsPlayer,
  RuntimeBeast,
  RuntimeCard,
} from './types';
import { BloomBeastsActionType } from './types';
import { WinConditionChecker } from './core/WinConditionChecker';

/**
 * Trigger timing enum for effect processing
 */
enum TriggerTiming {
  START_OF_TURN = 'start_of_turn',
  END_OF_TURN = 'end_of_turn',
  ON_ACTION = 'on_action',
  ON_EVENT = 'on_event',
}

/**
 * Effect system for processing game effects and triggers
 */
class EffectSystem<TState extends Record<string, unknown>> {
  processEffects(
    timing: TriggerTiming,
    state: Turbo.IGameState<TState>,
    context?: TriggerContext
  ): { success: boolean; newState?: Turbo.IGameState<TState> } {
    // Clone state to avoid mutating the original - use structuredClone to preserve Sets, Maps, etc.
    const newState = structuredClone(state) as Turbo.IGameState<TState>;
    const bloomState = newState.gameData as unknown as BloomBeastsState;

    // Handle OnSummon triggers
    if (timing === TriggerTiming.ON_ACTION && context?.action === 'summon' && context.card) {
      const card = context.card;

      // Check if this card has abilities
      if (card.abilities && card.abilities.length > 0) {
        for (const ability of card.abilities) {
          // Type guard: check if this is a StructuredAbility with trigger and effects
          if ('trigger' in ability && ability.trigger === 'OnSummon' && 'effects' in ability && ability.effects) {
            // Process each effect
            for (const effect of ability.effects) {
              this.processEffect(effect, bloomState, newState.turnInfo!.currentPlayerId);
            }
          }
        }
      }
    }

    // Handle WhileOnField effects when card enters field
    if (timing === TriggerTiming.ON_ACTION && context?.action === 'enter_field' && context.card) {
      const card = context.card;

      // Check if this card has abilities
      if (card.abilities && card.abilities.length > 0) {
        for (const ability of card.abilities) {
          // Type guard: check if this is a StructuredAbility with trigger and effects
          if ('trigger' in ability && ability.trigger === 'WhileOnField' && 'effects' in ability && ability.effects) {
            // Process each effect
            for (const effect of ability.effects) {
              this.processEffect(effect, bloomState, newState.turnInfo!.currentPlayerId);
            }
          }
        }
      }
    }

    // Handle start of turn triggers
    if (timing === TriggerTiming.START_OF_TURN) {
      // Process OnOwnStartOfTurn triggers
      this.processStartOfTurnTriggers(bloomState, newState.turnInfo!.currentPlayerId);
    }

    // Handle end of turn triggers
    if (timing === TriggerTiming.END_OF_TURN) {
      this.processEndOfTurnTriggers(bloomState, newState.turnInfo!.currentPlayerId);
    }

    return { success: true, newState };
  }

  private processEffect(effect: any, state: BloomBeastsState, currentPlayerId: string): void {
    const currentPlayerIndex = state.players.findIndex(p => p.id === currentPlayerId);
    const currentPlayer = state.players[currentPlayerIndex];

    switch (effect.type) {
      case 'draw-cards':
        // Draw cards from deck
        const cardsToDraw = effect.value || 1;
        for (let i = 0; i < cardsToDraw; i++) {
          if (currentPlayer.deck.length > 0 && currentPlayer.hand.length < currentPlayer.maxHandSize) {
            const drawnCard = currentPlayer.deck.shift()!;
            currentPlayer.hand.push(drawnCard);
          }
        }
        break;

      case 'modify-stats':
        // Modify stats of target beasts
        this.processStatModification(effect, state, currentPlayerIndex);
        break;

      case 'gain-resource':
        // Gain resources (already handled in processMagicCard)
        if (effect.resource === 'energy') {
          const value = effect.value || 0;
          currentPlayer.energy = Math.min(currentPlayer.energy + value, 10); // maxEnergy = 10
        }
        break;
    }
  }

  private processStatModification(effect: any, state: BloomBeastsState, currentPlayerIndex: number): void {
    const field = currentPlayerIndex === 0 ? state.field.player1 : state.field.player2;
    const targets = this.resolveTargets(effect.target, field, state);

    for (const target of targets) {
      if (effect.stat === 'attack' || effect.stat === 'both') {
        target.currentAttack = Math.max(0, target.currentAttack + effect.value);
      }
      if (effect.stat === 'health' || effect.stat === 'both') {
        target.currentHealth = Math.max(0, target.currentHealth + effect.value);
        // Also increase maxHealth for permanent buffs
        if (effect.duration === 'permanent' && effect.value > 0) {
          target.maxHealth += effect.value;
        }
      }
    }
  }

  private resolveTargets(targetType: string, field: any, state: BloomBeastsState): RuntimeBeast[] {
    const targets: RuntimeBeast[] = [];

    switch (targetType) {
      case 'all-allies':
        // Get all allied beasts on the field
        for (const beast of field.beasts) {
          if (beast !== null) {
            targets.push(beast);
          }
        }
        break;
      case 'self':
        // Would need context to know which beast is self
        break;
      // Add more target types as needed
    }

    return targets;
  }

  private processStartOfTurnTriggers(state: BloomBeastsState, currentPlayerId: string): void {
    const currentPlayerIndex = state.players.findIndex(p => p.id === currentPlayerId);
    const field = currentPlayerIndex === 0 ? state.field.player1 : state.field.player2;

    // Process OnOwnStartOfTurn triggers
    for (const beast of field.beasts) {
      if (beast && beast.abilities) {
        for (const ability of beast.abilities) {
          if ('trigger' in ability && ability.trigger === 'OnOwnStartOfTurn' && 'effects' in ability && ability.effects) {
            for (const effect of ability.effects) {
              this.processEffect(effect, state, currentPlayerId);
            }
          }
        }
      }
    }
  }

  private applyWhileOnFieldEffects(state: BloomBeastsState, currentPlayerId: string): void {
    const currentPlayerIndex = state.players.findIndex(p => p.id === currentPlayerId);
    const field = currentPlayerIndex === 0 ? state.field.player1 : state.field.player2;

    // Apply WhileOnField effects from beasts
    for (const beast of field.beasts) {
      if (beast && beast.abilities) {
        for (const ability of beast.abilities) {
          if ('trigger' in ability && ability.trigger === 'WhileOnField' && 'effects' in ability && ability.effects) {
            for (const effect of ability.effects) {
              this.processEffect(effect, state, currentPlayerId);
            }
          }
        }
      }
    }

    // Apply WhileOnField effects from habitat
    if (field.habitat && field.habitat.abilities) {
      for (const ability of field.habitat.abilities) {
        if ('trigger' in ability && ability.trigger === 'WhileOnField' && 'effects' in ability && ability.effects) {
          for (const effect of ability.effects) {
            this.processEffect(effect, state, currentPlayerId);
          }
        }
      }
    }
  }

  private processEndOfTurnTriggers(state: BloomBeastsState, currentPlayerId: string): void {
    const currentPlayerIndex = state.players.findIndex(p => p.id === currentPlayerId);
    const field = currentPlayerIndex === 0 ? state.field.player1 : state.field.player2;

    // Process OnOwnEndOfTurn triggers
    for (const beast of field.beasts) {
      if (beast && beast.abilities) {
        for (const ability of beast.abilities) {
          if ('trigger' in ability && ability.trigger === 'OnOwnEndOfTurn' && 'effects' in ability && ability.effects) {
            for (const effect of ability.effects) {
              this.processEffect(effect, state, currentPlayerId);
            }
          }
        }
      }
    }
  }

  clearExpiredEffects(state: Turbo.IGameState<TState>): void {
    // Stub implementation - clear temporary effects here
  }
}

// Types are defined in ./types.ts to avoid circular dependencies
export type { BloomBeastsState, BloomBeastsActionData, BloomBeastsPlayer, RuntimeBeast, RuntimeCard } from './types';
export { BloomBeastsActionType } from './types';

/**
 * BloomBeasts game configuration
 */
export interface BloomBeastsConfig {
  startingHandSize: number;
  maxFieldBeasts: number;
  maxFieldBuffs: number;
  maxFieldTraps: number;
  startingHealth: number;
  maxEnergy: number;
}

/**
 * Default game configuration
 */
const DEFAULT_CONFIG: BloomBeastsConfig = {
  startingHandSize: 3,
  maxFieldBeasts: 3,
  maxFieldBuffs: 3,
  maxFieldTraps: 3,
  startingHealth: 30,
  maxEnergy: 10,
};

/**
 * BloomBeasts game rules implementation
 */
export class BloomBeastsRules implements Turbo.IGameRules<BloomBeastsState, BloomBeastsActionData> {
  private config: BloomBeastsConfig;
  private effectSystem: EffectSystem<BloomBeastsState>;
  private actionHandlers: ActionHandlerRegistry;
  private winConditionChecker: WinConditionChecker;

  constructor(config: Partial<BloomBeastsConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.effectSystem = new EffectSystem<BloomBeastsState>();
    this.actionHandlers = new ActionHandlerRegistry();
    this.winConditionChecker = new WinConditionChecker();

    // Register action handlers
    this.actionHandlers.registerAll([
      new DrawCardActionHandler(),
      new PlayCardActionHandler(),
      new AttackActionHandler(),
      new EndTurnActionHandler(),
      new TimeoutActionHandler(),
      new ForfeitActionHandler(),
    ]);

    this.registerEffectHandlers();
  }

  /**
   * Initialize the game state
   */
  createInitialState(config: Turbo.IGameConfig): Turbo.IGameState<BloomBeastsState> {
    const players = config.players.map(p => this.createPlayer(p));

    // Shuffle decks and draw starting hands
    players.forEach(player => {
      player.deck = shuffle(player.deck);
      for (let i = 0; i < this.config.startingHandSize; i++) {
        this.drawCard(player);
      }
    });

    const gameData: BloomBeastsState = {
      players,
      field: {
        player1: {
          beasts: [null, null, null],
          buffs: [null, null, null],
          habitat: null,
          traps: [],
        },
        player2: {
          beasts: [null, null, null],
          buffs: [null, null, null],
          habitat: null,
          traps: [],
        },
      },
      currentTurnActions: {
        hasDrawnCard: false,
        cardsPlayed: 0,
        hasAttacked: new Set(),
      },
    };

    // Give first player 1 energy to start the game
    players[0].energy = 1;

    return {
      gameData,
      turnInfo: {
        turnNumber: 1,
        currentPlayerId: players[0].id,
        movesThisTurn: 0,
        timeStarted: Date.now(),
      },
      players: config.players,
      phase: Turbo.GamePhase.PLAYING,
      isComplete: false,
    };
  }

  /**
   * Validate if an action can be performed
   *
   * This now delegates to action handlers for validation.
   * Handlers contain all the validation logic specific to each action type.
   */
  validateAction(
    action: Turbo.IGameAction<BloomBeastsActionData>,
    state: Turbo.IGameState<BloomBeastsState>
  ): Turbo.IActionValidation {
    // Check if it's the current player's turn
    const currentPlayerIndex = this.getCurrentPlayerIndex(state);
    const currentPlayer = state.gameData!.players[currentPlayerIndex];

    if (action.playerId !== currentPlayer.id) {
      return { isValid: false, reason: 'Not your turn' };
    }

    // Get the appropriate handler
    const handler = this.actionHandlers.get(action.data.type);
    if (!handler) {
      return { isValid: false, reason: 'Unknown action type' };
    }

    // Delegate validation to the handler
    const validation = handler.validate(action.data, state, action.playerId);

    return {
      isValid: validation.valid,
      reason: !validation.valid ? validation.reason : undefined,
    };
  }

  /**
   * Execute an action and return the new state
   *
   * This is now a simple dispatcher that delegates to action handlers.
   * All action-specific logic, event generation, and trigger processing
   * is handled by the respective action handlers.
   */
  executeAction(
    action: Turbo.IGameAction<BloomBeastsActionData>,
    state: Turbo.IGameState<BloomBeastsState>
  ): Turbo.IActionResult<BloomBeastsState> {
    try {
      // Get the appropriate handler
      const handler = this.actionHandlers.get(action.data.type);
      if (!handler) {
        return {
          success: false,
          error: new Error(`No handler found for action type: ${action.data.type}`),
        };
      }

      // Validate the action
      const validation = handler.validate(action.data, state, action.playerId);
      if (!validation.valid) {
        const reason = 'reason' in validation ? validation.reason : 'Validation failed';
        return {
          success: false,
          error: new Error(reason),
        };
      }

      // Create context with trigger and effect processing functions
      const context = {
        processTriggers: (timing: string, newState: Turbo.IGameState<BloomBeastsState>, ctx?: TriggerContext) => {
          this.processTriggers(timing as TriggerTiming, newState, ctx);
        },
        processMagicCard: (card: MagicCard, newState: Turbo.IGameState<BloomBeastsState>) => {
          this.processMagicCard(card, newState);
        },
      };

      // Execute the action - handler returns full result with events
      const result = handler.execute(action.data, state, action.playerId, context);

      return result;
    } catch (error) {
      console.error('[BloomBeastsGame] Action execution failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  }

  /**
   * Check if the game has ended
   *
   * Delegates to WinConditionChecker for all win condition logic
   */
  checkEndCondition(state: Turbo.IGameState<BloomBeastsState>): { isEnded: boolean; winnerId?: string; reason?: string } {
    // Check if game should end using WinConditionChecker
    if (!this.winConditionChecker.shouldGameEnd(state)) {
      return { isEnded: false };
    }

    // Game should end - determine winner and reason
    const winnerId = this.winConditionChecker.getWinnerId(state) ?? undefined;

    // Determine reason based on state
    let reason = 'Victory';

    if (state.gameData.suddenEnd) {
      const reasonMap = {
        'timeout': 'Timeout',
        'forfeit': 'Forfeit',
        'disconnect': 'Disconnect'
      };
      reason = reasonMap[state.gameData.suddenEnd.reason] || 'Unknown';
    } else {
      const players = state.gameData!.players;
      const aliveByHealth = players.filter(p => p.health > 0);
      if (aliveByHealth.length < 2) {
        reason = 'Opponent eliminated';
      } else {
        reason = 'Opponent decked out';
      }
    }

    return { isEnded: true, winnerId, reason };
  }

  /**
   * Get valid actions for the current player
   */
  getValidActions(state: Turbo.IGameState<BloomBeastsState>): Turbo.IGameAction<BloomBeastsActionData>[] {
    const actions: Turbo.IGameAction<BloomBeastsActionData>[] = [];
    const currentPlayer = state.gameData!.players[this.getCurrentPlayerIndex(state)];


    // Draw card action
    if (!state.gameData!.currentTurnActions.hasDrawnCard && currentPlayer.deck.length > 0) {
      actions.push({
        type: 'game_action',
        playerId: currentPlayer.id,
        data: { type: BloomBeastsActionType.DRAW_CARD },
      });
    }

    // Play card actions
    currentPlayer.hand.forEach(card => {
      if (card.cost <= currentPlayer.energy) {
        const positions = this.getValidPositionsForCard(card, state);
        positions.forEach(position => {
          actions.push({
            type: 'game_action',
            playerId: currentPlayer.id,
            data: {
              type: BloomBeastsActionType.PLAY_CARD,
              cardId: card.id,
              position,
            },
          });
        });
      }
    });

    // Attack actions
    const field = this.getCurrentPlayerIndex(state) === 0 ? state.gameData!.field.player1 : state.gameData!.field.player2;
    field.beasts.forEach(beast => {
      if (beast && !beast.summoningSickness && !state.gameData!.currentTurnActions.hasAttacked.has(beast.id)) {
        const targets = this.getValidAttackTargets(beast, state);
        targets.forEach(targetId => {
          actions.push({
            type: 'game_action',
            playerId: currentPlayer.id,
            data: {
              type: BloomBeastsActionType.ATTACK,
              cardId: beast.id,
              targetId,
            },
          });
        });
      }
    });

    // End turn action (always available)
    actions.push({
      type: 'game_action',
      playerId: currentPlayer.id,
      data: { type: BloomBeastsActionType.END_TURN },
    });

    return actions;
  }

  /**
   * Handle phase transitions
   */
  getNextPhase(currentPhase: string, state: Turbo.IGameState<BloomBeastsState>): string {
    // BloomBeasts has a simple phase structure
    return 'main';
  }

  /**
   * Private helper methods
   */

  private getCurrentPlayerIndex(state: Turbo.IGameState<BloomBeastsState>): number {
    const currentPlayerId = state.turnInfo!.currentPlayerId;
    return state.gameData!.players.findIndex(p => p.id === currentPlayerId);
  }

  private createPlayer(config: Turbo.IPlayer): BloomBeastsPlayer {
    // Get deck from metadata - should already be RuntimeCard[] from BattleController
    const deck = (config.metadata?.deck as RuntimeCard[]) || [];
    return {
      id: config.id,
      name: config.name,
      health: this.config.startingHealth,
      energy: 0,
      deck: [...deck],
      hand: [],
      graveyard: [],
      maxHandSize: 10,
      maxHealth: this.config.startingHealth,
    };
  }

  private drawCard(player: BloomBeastsPlayer): RuntimeCard | null {
    if (player.deck.length === 0) {
      return null;
    }

    const card = player.deck.shift()!;
    player.hand.push(card);
    return card;
  }

  private getValidPositionsForCard(card: RuntimeCard, state: Turbo.IGameState<BloomBeastsState>): number[] {
    const positions: number[] = [];
    const field = this.getCurrentPlayerIndex(state) === 0 ? state.gameData!.field.player1 : state.gameData!.field.player2;

    switch (card.type) {
      case 'Beast':
        field.beasts.forEach((slot, index) => {
          if (slot === null) {
            positions.push(index);
          }
        });
        break;

      case 'Buff':
        field.buffs.forEach((slot, index) => {
          if (slot === null) {
            positions.push(index);
          }
        });
        break;

      case 'Trap':
      case 'Habitat':
      case 'Magic':
        positions.push(0); // Single valid position for these
        break;
    }

    return positions;
  }

  private findBeastOnField(beastId: string, state: Turbo.IGameState<BloomBeastsState>): RuntimeBeast | null {
    for (const field of [state.gameData!.field.player1, state.gameData!.field.player2]) {
      for (const beast of field.beasts) {
        if (beast?.id === beastId) {
          return beast;
        }
      }
    }
    return null;
  }

  private getValidAttackTargets(beast: RuntimeBeast, state: Turbo.IGameState<BloomBeastsState>): string[] {
    const targets: string[] = [];
    const opponentField = this.getCurrentPlayerIndex(state) === 0 ?
                          state.gameData!.field.player2 :
                          state.gameData!.field.player1;

    // Can attack opponent beasts
    opponentField.beasts.forEach(opponentBeast => {
      if (opponentBeast) {
        targets.push(opponentBeast.id);
      }
    });

    // Can attack opponent directly if no beasts
    if (opponentField.beasts.every(b => b === null)) {
      const opponentPlayer = state.gameData!.players[1 - this.getCurrentPlayerIndex(state)];
      targets.push(opponentPlayer.id);
    }

    return targets;
  }

  private processMagicCard(card: MagicCard, state: Turbo.IGameState<BloomBeastsState>): void {
    // Process magic card effects
    if (!card.abilities || card.abilities.length === 0) {
      return;
    }

    // Get current player
    const currentPlayerIndex = this.getCurrentPlayerIndex(state);
    const currentPlayer = state.gameData.players[currentPlayerIndex];

    // Process each ability
    card.abilities.forEach(ability => {
      // Type guard: check if this is a StructuredAbility with effects
      if ('effects' in ability && ability.effects) {
        ability.effects.forEach((effect: any) => {
          // Handle GainResource effects (for Energy Block, Energy Surge, etc.)
          if (effect.type === 'gain-resource' && effect.resource === 'energy') {
            const value = effect.value || 0;
            currentPlayer.energy = Math.min(
              currentPlayer.energy + value,
              this.config.maxEnergy
            );
          }
          // Handle DrawCards effects
          else if (effect.type === 'draw-cards') {
            const cardsToDraw = effect.value || 1;
            for (let i = 0; i < cardsToDraw; i++) {
              if (currentPlayer.deck.length > 0 && currentPlayer.hand.length < currentPlayer.maxHandSize) {
                const drawnCard = currentPlayer.deck.shift()!;
                currentPlayer.hand.push(drawnCard);
              }
            }
          }
          // Add more effect handlers here as needed
        });
      }
    });
  }

  private processTriggers(
    timing: TriggerTiming,
    state: Turbo.IGameState<BloomBeastsState>,
    context?: TriggerContext
  ): void {
    // Process triggers using the effect system
    const result = this.effectSystem.processEffects(timing, state, context);
    if (result.success && result.newState) {
      // Update state with processed effects
      Object.assign(state, result.newState);
    }
  }

  private registerEffectHandlers(): void{
    // Register effect handlers for BloomBeasts-specific effects
    // This would include handlers for abilities like:
    // - Stat modifications
    // - Damage effects
    // - Healing
    // - Card draw
    // - etc.
  }
}

/**
 * Factory function to create a BloomBeasts game instance
 */
export function createBloomBeastsGame(config?: Partial<BloomBeastsConfig>): Turbo.GameController<BloomBeastsState, BloomBeastsActionData> {
  const rules = new BloomBeastsRules(config);
  return new Turbo.GameController(rules);
}