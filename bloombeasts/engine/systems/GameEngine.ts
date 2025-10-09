/**
 * Game Engine - Main game controller and state manager
 */

import { GameState, Player, Phase, BloomBeastInstance } from '../types/game';
import { AnyCard } from '../types/core';
import { CombatSystem } from './CombatSystem';
import { AbilityProcessor } from './AbilityProcessor';
import { LevelingSystem } from './LevelingSystem';
import { DeckList } from '../utils/deckBuilder';
import { SimpleMap } from '../../utils/polyfills';

export interface MatchOptions {
  player1Name?: string;
  player2Name?: string;
  turnTimeLimit?: number;
  maxTurns?: number;
}

export class GameEngine {
  private gameState: GameState;
  private combatSystem: CombatSystem;
  private abilityProcessor: AbilityProcessor;

  constructor() {
    this.gameState = this.createInitialState();
    this.combatSystem = new CombatSystem();
    this.abilityProcessor = new AbilityProcessor();
  }

  /**
   * Create initial game state
   */
  private createInitialState(): GameState {
    return {
      turn: 1,
      phase: 'Setup',
      activePlayer: 0,
      players: [
        this.createPlayer('Player 1'),
        this.createPlayer('Player 2'),
      ],
      habitatZone: null,
      turnHistory: [],
    };
  }

  /**
   * Create a new player
   */
  private createPlayer(name: string): Player {
    return {
      name,
      health: 30,
      currentNectar: 0,
      deck: [],
      hand: [],
      field: [null, null, null],
      graveyard: [],
      summonsThisTurn: 0,
      habitatCounters: new SimpleMap(),
    };
  }

  /**
   * Start a new match
   */
  public async startMatch(
    player1Deck: DeckList,
    player2Deck: DeckList,
    options: MatchOptions = {}
  ): Promise<void> {
    console.log('Starting new match...');

    // Set player names
    if (options.player1Name) {
      this.gameState.players[0].name = options.player1Name;
    }
    if (options.player2Name) {
      this.gameState.players[1].name = options.player2Name;
    }

    // Load decks
    this.gameState.players[0].deck = [...player1Deck.cards];
    this.gameState.players[1].deck = [...player2Deck.cards];

    // Shuffle decks
    this.shuffleDeck(this.gameState.players[0]);
    this.shuffleDeck(this.gameState.players[1]);

    // Draw initial hands
    this.drawCards(this.gameState.players[0], 5);
    this.drawCards(this.gameState.players[1], 5);

    // Start first turn
    this.gameState.phase = 'Main';
    await this.startTurn();
  }

  /**
   * Start a new turn
   */
  private async startTurn(): Promise<void> {
    const activePlayer = this.gameState.players[this.gameState.activePlayer];

    console.log(`Turn ${this.gameState.turn}: ${activePlayer.name}'s turn`);

    // Reset turn counters
    activePlayer.summonsThisTurn = 0;

    // Draw card (except first turn)
    if (this.gameState.turn > 1) {
      this.drawCards(activePlayer, 1);
    }

    // Gain nectar
    activePlayer.currentNectar = Math.min(10, this.gameState.turn);

    // Trigger start of turn abilities
    await this.triggerStartOfTurnAbilities();

    // Set phase to main
    this.gameState.phase = 'Main';
  }

  /**
   * End current turn
   */
  public async endTurn(): Promise<void> {
    // Trigger end of turn abilities
    await this.triggerEndOfTurnAbilities();

    // Switch active player
    this.gameState.activePlayer = this.gameState.activePlayer === 0 ? 1 : 0;

    // Increment turn counter when player 2 ends
    if (this.gameState.activePlayer === 0) {
      this.gameState.turn++;
    }

    // Check win conditions
    const result = this.combatSystem.checkWinCondition(this.gameState);
    if (result) {
      this.endMatch(result);
      return;
    }

    // Start next turn
    await this.startTurn();
  }

  /**
   * Summon a beast to the field
   */
  public summonBeast(
    player: Player,
    beastCard: AnyCard,
    position: number
  ): boolean {
    if (position < 0 || position > 2) {
      console.error('Invalid field position');
      return false;
    }

    if (player.field[position] !== null) {
      console.error('Field position already occupied');
      return false;
    }

    if (player.summonsThisTurn >= 1) {
      console.error('Already summoned this turn');
      return false;
    }

    // Create beast instance
    const instance: BloomBeastInstance = {
      instanceId: `${beastCard.id}-${Date.now()}`,
      cardId: beastCard.id,
      currentLevel: 1,
      currentXP: 0,
      currentAttack: (beastCard as any).baseAttack || 0,
      currentHealth: (beastCard as any).baseHealth || 0,
      maxHealth: (beastCard as any).baseHealth || 0,
      statusEffects: [],
      counters: [],
      summoningSickness: true,
      slotIndex: position,
    };

    // Place on field
    player.field[position] = instance;
    player.summonsThisTurn++;

    // Trigger summon abilities
    this.triggerSummonAbilities(instance);

    return true;
  }

  /**
   * Play a card from hand
   */
  public playCard(
    player: Player,
    cardIndex: number,
    target?: any
  ): boolean {
    if (cardIndex < 0 || cardIndex >= player.hand.length) {
      console.error('Invalid card index');
      return false;
    }

    const card = player.hand[cardIndex];

    // Check nectar cost
    if (card.cost > player.currentNectar) {
      console.error('Not enough nectar');
      return false;
    }

    // Pay cost
    player.currentNectar -= card.cost;

    // Remove from hand
    player.hand.splice(cardIndex, 1);

    // Handle based on card type
    switch (card.type) {
      case 'Bloom':
        // Find empty field position
        const emptyPos = player.field.findIndex(slot => slot === null);
        if (emptyPos !== -1) {
          return this.summonBeast(player, card, emptyPos);
        }
        break;
      case 'Habitat':
        this.gameState.habitatZone = card;
        break;
      // TODO: Handle other card types
    }

    return true;
  }

  /**
   * Draw cards from deck
   */
  private drawCards(player: Player, count: number): void {
    for (let i = 0; i < count; i++) {
      if (player.deck.length > 0) {
        const card = player.deck.pop();
        if (card) {
          player.hand.push(card);
        }
      }
    }
  }

  /**
   * Shuffle a player's deck
   */
  private shuffleDeck(player: Player): void {
    for (let i = player.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [player.deck[i], player.deck[j]] = [player.deck[j], player.deck[i]];
    }
  }

  /**
   * Trigger abilities at start of turn
   */
  private async triggerStartOfTurnAbilities(): Promise<void> {
    // TODO: Process all start of turn abilities
  }

  /**
   * Trigger abilities at end of turn
   */
  private async triggerEndOfTurnAbilities(): Promise<void> {
    // TODO: Process all end of turn abilities
  }

  /**
   * Trigger summon abilities
   */
  private triggerSummonAbilities(beast: BloomBeastInstance): void {
    // TODO: Process on-summon abilities
  }

  /**
   * End the match
   */
  private endMatch(result: any): void {
    console.log('Match ended!', result);
    // TODO: Handle match end, rewards, etc.
  }

  /**
   * Get current game state
   */
  public getState(): GameState {
    return this.gameState;
  }

  /**
   * Reset for new game
   */
  public reset(): void {
    this.gameState = this.createInitialState();
    this.combatSystem.reset();
  }
}