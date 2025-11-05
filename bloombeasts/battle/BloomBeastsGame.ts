/**
 * BloomBeasts game implementation using the TURBO library
 */

import {
  IGameRules,
  IGameState,
  IGameAction,
  IActionResult,
  IActionValidation,
  IGameConfig,
  IPlayer,
  GameController,
  GamePhase,
} from '../../turbo/src';

// Import existing BloomBeasts types
import { CardType } from '../engine/types/core';
import {
  AnyCard as Card,
  BloomBeastCard,
  MagicCard,
  TrapCard,
  BuffCard,
  HabitatCard,
} from '../engine/types/core';
import { Player as BloomPlayer } from '../engine/types/game';
import { shuffle } from '../engine/utils/random';

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
 * Simple effect system for processing game effects and triggers
 * This is a stub implementation that can be expanded as needed
 */
class EffectSystem<TState extends Record<string, unknown>> {
  processEffects(
    timing: TriggerTiming,
    state: IGameState<TState>,
    context?: any
  ): { success: boolean; newState?: IGameState<TState> } {
    // Stub implementation - effects can be added here in the future
    return { success: true, newState: state };
  }

  clearExpiredEffects(state: IGameState<TState>): void {
    // Stub implementation - clear temporary effects here
  }
}

/**
 * BeastCard with runtime properties when on field
 */
export interface BeastFieldCard extends BloomBeastCard {
  attack: number;  // Current attack (can be modified from baseAttack)
  health: number;  // Current health (can be modified from baseHealth)
  summoningSickness?: boolean;
  usedAbilityThisTurn?: boolean;
}

/**
 * BloomBeasts specific game state
 */
export interface BloomBeastsState extends Record<string, unknown> {
  players: BloomBeastsPlayer[];
  field: {
    player1: {
      beasts: (BeastFieldCard | null)[];
      buffs: (BuffCard | null)[];
      habitat: HabitatCard | null;
      traps: TrapCard[];
    };
    player2: {
      beasts: (BeastFieldCard | null)[];
      buffs: (BuffCard | null)[];
      habitat: HabitatCard | null;
      traps: TrapCard[];
    };
  };
  currentTurnActions: {
    hasDrawnCard: boolean;
    cardsPlayed: number;
    hasAttacked: Set<string>;
  };
}

/**
 * BloomBeasts player data
 */
export interface BloomBeastsPlayer {
  id: string;
  name: string;
  health: number;
  energy: number;
  deck: Card[];
  hand: Card[];
  graveyard: Card[];
  maxHandSize: number;
  maxHealth: number;
}

/**
 * BloomBeasts action types
 */
export enum BloomBeastsActionType {
  DRAW_CARD = 'draw_card',
  PLAY_CARD = 'play_card',
  ATTACK = 'attack',
  USE_ABILITY = 'use_ability',
  END_TURN = 'end_turn',
}

/**
 * BloomBeasts action data
 */
export interface BloomBeastsActionData extends Record<string, unknown> {
  type: BloomBeastsActionType;
  cardId?: string;
  targetId?: string;
  position?: number;
  abilityId?: string;
}

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
  maxFieldTraps: 5,
  startingHealth: 30,
  maxEnergy: 10,
};

/**
 * BloomBeasts game rules implementation
 */
export class BloomBeastsRules implements IGameRules<BloomBeastsState, BloomBeastsActionData> {
  private config: BloomBeastsConfig;
  private effectSystem: EffectSystem<BloomBeastsState>;

  constructor(config: Partial<BloomBeastsConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.effectSystem = new EffectSystem<BloomBeastsState>();
    this.registerEffectHandlers();
  }

  /**
   * Initialize the game state
   */
  createInitialState(config: IGameConfig): IGameState<BloomBeastsState> {
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
      phase: GamePhase.PLAYING,
      isComplete: false,
    };
  }

  /**
   * Validate if an action can be performed
   */
  validateAction(
    action: IGameAction<BloomBeastsActionData>,
    state: IGameState<BloomBeastsState>
  ): IActionValidation {
    const currentPlayerIndex = this.getCurrentPlayerIndex(state);
    const currentPlayer = state.gameData!.players[currentPlayerIndex];

    if (action.playerId !== currentPlayer.id) {
      return { isValid: false, reason: 'Not your turn' };
    }

    switch (action.data.type) {
      case BloomBeastsActionType.DRAW_CARD:
        if (state.gameData!.currentTurnActions.hasDrawnCard) {
          return { isValid: false, reason: 'Already drawn a card this turn' };
        }
        if (currentPlayer.deck.length === 0) {
          return { isValid: false, reason: 'No cards left in deck' };
        }
        break;

      case BloomBeastsActionType.PLAY_CARD:
        const card = currentPlayer.hand.find(c => c.id === action.data.cardId);
        if (!card) {
          return { isValid: false, reason: 'Card not in hand' };
        }
        if (card.cost > currentPlayer.energy) {
          return { isValid: false, reason: 'Not enough energy' };
        }
        // Additional validation based on card type
        if (!this.validateCardPlacement(card, action.data.position, state)) {
          return { isValid: false, reason: 'Invalid card placement' };
        }
        break;

      case BloomBeastsActionType.ATTACK:
        if (!action.data.cardId) {
          return { isValid: false, reason: 'No attacker specified' };
        }
        if (state.gameData!.currentTurnActions.hasAttacked.has(action.data.cardId)) {
          return { isValid: false, reason: 'This creature has already attacked' };
        }
        // Check if creature has summoning sickness
        const attacker = this.findBeastOnField(action.data.cardId, state);
        if (attacker && attacker.summoningSickness) {
          return { isValid: false, reason: 'Creature has summoning sickness' };
        }
        break;

      case BloomBeastsActionType.END_TURN:
        // Always valid
        break;

      default:
        return { isValid: false, reason: 'Unknown action type' };
    }

    return { isValid: true };
  }

  /**
   * Execute an action and return the new state
   */
  executeAction(
    action: IGameAction<BloomBeastsActionData>,
    state: IGameState<BloomBeastsState>
  ): IActionResult<BloomBeastsState> {
    // Use structuredClone for proper deep cloning (handles Sets, Maps, Dates, etc.)
    const newState = structuredClone(state) as IGameState<BloomBeastsState>;

    const currentPlayerIndex = this.getCurrentPlayerIndex(newState);
    const currentPlayer = newState.gameData!.players[currentPlayerIndex];
    const events = [];

    try {
      switch (action.data.type) {
        case BloomBeastsActionType.DRAW_CARD:
          this.drawCard(currentPlayer);
          newState.gameData!.currentTurnActions.hasDrawnCard = true;
          events.push({
            type: 'card_drawn',
            playerId: currentPlayer.id,
            data: {},
            timestamp: Date.now(),
          });
          break;

        case BloomBeastsActionType.PLAY_CARD:
          const card = currentPlayer.hand.find(c => c.id === action.data.cardId)!;
          this.playCard(card, currentPlayer, action.data.position, newState);
          newState.gameData!.currentTurnActions.cardsPlayed++;
          events.push({
            type: 'card_played',
            playerId: currentPlayer.id,
            data: { cardId: card.id, cardType: card.type },
            timestamp: Date.now(),
          });

          // Process OnSummon triggers for Beast cards
          if (card.type === CardType.Beast) {
            this.processTriggers(TriggerTiming.ON_ACTION, newState, { action: 'summon', card });
          }
          break;

        case BloomBeastsActionType.ATTACK:
          const attackResult = this.processAttack(
            action.data.cardId!,
            action.data.targetId,
            newState
          );
          newState.gameData!.currentTurnActions.hasAttacked.add(action.data.cardId!);
          events.push({
            type: 'attack',
            playerId: currentPlayer.id,
            data: attackResult,
            timestamp: Date.now(),
          });

          // Process OnAttack triggers
          this.processTriggers(TriggerTiming.ON_ACTION, newState, { action: 'attack', ...attackResult });
          break;

        case BloomBeastsActionType.END_TURN:
          // Process end of turn effects
          this.processTriggers(TriggerTiming.END_OF_TURN, newState);

          // Clear temporary effects
          this.clearTemporaryEffects(newState);

          // Switch to next player
          const players = newState.gameData!.players;
          const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
          const nextPlayerId = players[nextPlayerIndex].id;

          // Update turn info
          newState.turnInfo = {
            ...newState.turnInfo!,
            currentPlayerId: nextPlayerId,
            turnNumber: nextPlayerIndex === 0 ? newState.turnInfo!.turnNumber + 1 : newState.turnInfo!.turnNumber,
            movesThisTurn: 0,
            timeStarted: Date.now(),
          };

          console.log(`[BloomBeastsGame] END_TURN: Player ${currentPlayer.id} ended turn. Now ${nextPlayerId}'s turn (index: ${nextPlayerIndex})`);

          // Start new turn (don't skip draw - we want to draw on each turn start)
          this.startNewTurn(newState, false);

          events.push({
            type: 'turn_ended',
            playerId: currentPlayer.id,
            data: {},
            timestamp: Date.now(),
          });
          break;
      }

      return {
        success: true,
        newState,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  }

  /**
   * Check if the game has ended
   */
  checkEndCondition(state: IGameState<BloomBeastsState>): { isEnded: boolean; winnerId?: string; reason?: string } {
    const players = state.gameData!.players;

    // Count alive players by health
    const aliveByHealth = players.filter(p => p.health > 0);

    // Check for player death - handle ties first
    if (aliveByHealth.length === 0) {
      // Both players dead - tie
      return { isEnded: true, winnerId: undefined, reason: 'Both players eliminated' };
    } else if (aliveByHealth.length === 1) {
      // One player alive - they win
      return { isEnded: true, winnerId: aliveByHealth[0].id, reason: 'Opponent eliminated' };
    }

    // Check for deck out
    const aliveByDeck = players.filter(p => p.deck.length > 0 || p.hand.length > 0);
    if (aliveByDeck.length === 0) {
      // Both players decked out - tie
      return { isEnded: true, winnerId: undefined, reason: 'Both players decked out' };
    } else if (aliveByDeck.length === 1) {
      // One player has cards - they win
      return { isEnded: true, winnerId: aliveByDeck[0].id, reason: 'Opponent decked out' };
    }

    return { isEnded: false };
  }

  /**
   * Get valid actions for the current player
   */
  getValidActions(state: IGameState<BloomBeastsState>): IGameAction<BloomBeastsActionData>[] {
    const actions: IGameAction<BloomBeastsActionData>[] = [];
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
  getNextPhase(currentPhase: string, state: IGameState<BloomBeastsState>): string {
    // BloomBeasts has a simple phase structure
    return 'main';
  }

  /**
   * Private helper methods
   */

  private getCurrentPlayerIndex(state: IGameState<BloomBeastsState>): number {
    const currentPlayerId = state.turnInfo!.currentPlayerId;
    return state.gameData!.players.findIndex(p => p.id === currentPlayerId);
  }

  private createPlayer(config: IPlayer): BloomBeastsPlayer {
    // Get deck from metadata
    const deck = (config.metadata?.deck as Card[]) || [];
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

  private drawCard(player: BloomBeastsPlayer): Card | null {
    if (player.deck.length === 0) {
      return null;
    }

    const card = player.deck.shift()!;
    player.hand.push(card);
    return card;
  }

  private playCard(
    card: Card,
    player: BloomBeastsPlayer,
    position: number | undefined,
    state: IGameState<BloomBeastsState>
  ): void {
    // Remove from hand
    const cardIndex = player.hand.findIndex(c => c.id === card.id);
    if (cardIndex !== -1) {
      player.hand.splice(cardIndex, 1);
    }

    // Deduct energy cost
    player.energy -= card.cost;

    // Place card on field based on type
    const field = this.getCurrentPlayerIndex(state) === 0 ? state.gameData!.field.player1 : state.gameData!.field.player2;

    switch (card.type) {
      case 'Beast':
        const beastCard = card as BloomBeastCard;
        const fieldCard: BeastFieldCard = {
          ...beastCard,
          attack: beastCard.baseAttack,
          health: beastCard.baseHealth,
          summoningSickness: true,
          usedAbilityThisTurn: false
        };
        if (position !== undefined && position < field.beasts.length) {
          field.beasts[position] = fieldCard;
        }
        break;

      case 'Magic':
        // Magic cards are instant and go to graveyard
        this.processMagicCard(card as MagicCard, state);
        player.graveyard.push(card);
        break;

      case 'Trap':
        field.traps.push(card as TrapCard);
        break;

      case 'Buff':
        if (position !== undefined && position < field.buffs.length) {
          field.buffs[position] = card as BuffCard;
        }
        break;

      case 'Habitat':
        field.habitat = card as HabitatCard;
        break;
    }
  }

  private validateCardPlacement(
    card: Card,
    position: number | undefined,
    state: IGameState<BloomBeastsState>
  ): boolean {
    const field = this.getCurrentPlayerIndex(state) === 0 ? state.gameData!.field.player1 : state.gameData!.field.player2;

    switch (card.type) {
      case 'Beast':
        return position !== undefined &&
               position < field.beasts.length &&
               field.beasts[position] === null;

      case 'Buff':
        return position !== undefined &&
               position < field.buffs.length &&
               field.buffs[position] === null;

      case 'Trap':
        return field.traps.length < this.config.maxFieldTraps;

      case 'Habitat':
        return true; // Can always play, replaces existing

      case 'Magic':
        return true; // Instant cards always valid

      default:
        return false;
    }
  }

  private getValidPositionsForCard(card: Card, state: IGameState<BloomBeastsState>): number[] {
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

  private findBeastOnField(beastId: string, state: IGameState<BloomBeastsState>): BeastFieldCard | null {
    for (const field of [state.gameData!.field.player1, state.gameData!.field.player2]) {
      for (const beast of field.beasts) {
        if (beast?.id === beastId) {
          return beast;
        }
      }
    }
    return null;
  }

  private getValidAttackTargets(beast: BeastFieldCard, state: IGameState<BloomBeastsState>): string[] {
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

  private processAttack(
    attackerId: string,
    targetId: string | undefined,
    state: IGameState<BloomBeastsState>
  ): any {
    const attacker = this.findBeastOnField(attackerId, state);
    if (!attacker) return { error: 'Attacker not found' };

    const opponentPlayer = state.gameData!.players[1 - this.getCurrentPlayerIndex(state)];

    if (!targetId || targetId === opponentPlayer.id) {
      // Direct attack on player
      opponentPlayer.health -= attacker.attack;
      return {
        type: 'direct',
        damage: attacker.attack,
        targetHealth: opponentPlayer.health,
      };
    } else {
      // Attack on beast
      const target = this.findBeastOnField(targetId, state);
      if (!target) return { error: 'Target not found' };

      // Both creatures deal damage to each other
      target.health -= attacker.attack;
      attacker.health -= target.attack;

      // Check for defeats
      const defeated = [];
      if (target.health <= 0) {
        this.destroyBeast(target, state);
        defeated.push(target.id);
      }
      if (attacker.health <= 0) {
        this.destroyBeast(attacker, state);
        defeated.push(attacker.id);
      }

      return {
        type: 'creature',
        attackerDamage: target.attack,
        targetDamage: attacker.attack,
        defeated,
      };
    }
  }

  private destroyBeast(beast: BeastFieldCard, state: IGameState<BloomBeastsState>): void {
    // Remove from field
    for (const field of [state.gameData!.field.player1, state.gameData!.field.player2]) {
      const index = field.beasts.findIndex(b => b?.id === beast.id);
      if (index !== -1) {
        field.beasts[index] = null;

        // Add to graveyard
        const owner = state.gameData!.players.find(p =>
          (p === state.gameData!.players[0] && field === state.gameData!.field.player1) ||
          (p === state.gameData!.players[1] && field === state.gameData!.field.player2)
        );
        if (owner) {
          owner.graveyard.push(beast);
        }
        break;
      }
    }

    // Process OnDestroy triggers
    this.processTriggers(TriggerTiming.ON_EVENT, state, { event: 'destroy', card: beast });
  }

  private processMagicCard(card: MagicCard, state: IGameState<BloomBeastsState>): void {
    // Process magic card effects
    // This would be implemented based on specific magic card effects
  }

  private processTriggers(
    timing: TriggerTiming,
    state: IGameState<BloomBeastsState>,
    context?: any
  ): void {
    // Process triggers using the effect system
    const result = this.effectSystem.processEffects(timing, state, context);
    if (result.success && result.newState) {
      // Update state with processed effects
      Object.assign(state, result.newState);
    }
  }

  private clearTemporaryEffects(state: IGameState<BloomBeastsState>): void {
    // Clear effects that last until end of turn
    this.effectSystem.clearExpiredEffects(state);

    // Remove summoning sickness
    for (const field of [state.gameData!.field.player1, state.gameData!.field.player2]) {
      field.beasts.forEach(beast => {
        if (beast) {
          beast.summoningSickness = false;
        }
      });
    }
  }

  private startNewTurn(state: IGameState<BloomBeastsState>, skipDraw: boolean = false): void {
    const currentPlayer = state.gameData!.players[this.getCurrentPlayerIndex(state)];

    console.log(`[BloomBeastsGame] startNewTurn for ${currentPlayer.id}, skipDraw: ${skipDraw}, deck size: ${currentPlayer.deck.length}, hand size: ${currentPlayer.hand.length}`);

    // Reset turn actions
    state.gameData!.currentTurnActions = {
      hasDrawnCard: false,
      cardsPlayed: 0,
      hasAttacked: new Set(),
    };

    // Draw card at start of turn (unless this is the very first turn during initialization)
    if (!skipDraw && currentPlayer.deck.length > 0) {
      const drawnCard = this.drawCard(currentPlayer);
      state.gameData!.currentTurnActions.hasDrawnCard = true;
      console.log(`[BloomBeastsGame] ${currentPlayer.id} drew a card: ${drawnCard?.name}`);
    }

    // Restore energy - turn 1 = 1 energy, turn 2 = 2 energy, etc.
    // turnNumber represents the round number (both players have played)
    currentPlayer.energy = Math.min(state.turnInfo!.turnNumber, this.config.maxEnergy);
    console.log(`[BloomBeastsGame] ${currentPlayer.id} energy set to ${currentPlayer.energy} (turn ${state.turnInfo!.turnNumber})`);

    // Process start of turn triggers
    this.processTriggers(TriggerTiming.START_OF_TURN, state);
  }

  private registerEffectHandlers(): void {
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
export function createBloomBeastsGame(config?: Partial<BloomBeastsConfig>): GameController<BloomBeastsState, BloomBeastsActionData> {
  const rules = new BloomBeastsRules(config);
  return new GameController(rules);
}