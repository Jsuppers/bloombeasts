/**
 * Game Test Utilities - Helper functions for integration testing
 */

import { GameEngine } from '../../systems/GameEngine';
import { GameState, Player } from '../../types/game';
import { AnyCard, BloomBeastCard } from '../../types/core';
import { BloomBeastInstance } from '../../types/leveling';
import { DeckList } from '../../utils/deckBuilder';
import { SimpleMap } from '../../../utils/polyfills';
import { STARTING_HEALTH, FIELD_SIZE } from '../../constants/gameRules';

/**
 * Create a test game engine with two players
 */
export function createTestGame(): GameEngine {
  return new GameEngine();
}

/**
 * Create a simple deck with specific cards
 */
export function createDeck(cards: AnyCard[]): DeckList {
  return {
    cards: [...cards],
    totalCards: cards.length,
    habitatCard: null,
  };
}

/**
 * Create a player for testing
 */
export function createTestPlayer(name: string): Player {
  return {
    name,
    health: STARTING_HEALTH,
    currentNectar: 0,
    deck: [],
    hand: [],
    field: Array(FIELD_SIZE).fill(null),
    trapZone: Array(FIELD_SIZE).fill(null),
    buffZone: [null, null],
    graveyard: [],
    summonsThisTurn: 0,
    habitatCounters: new SimpleMap(),
  };
}

/**
 * Create a beast instance for testing
 */
export function createTestBeast(
  card: BloomBeastCard,
  overrides?: Partial<BloomBeastInstance>
): BloomBeastInstance {
  const instance: BloomBeastInstance = {
    instanceId: `test-${card.id}-${Date.now()}-${Math.random()}`,
    cardId: card.id,
    name: card.name,
    affinity: card.affinity,
    currentLevel: 1,
    currentXP: 0,
    baseAttack: card.baseAttack,
    baseHealth: card.baseHealth,
    currentAttack: card.baseAttack,
    currentHealth: card.baseHealth,
    maxHealth: card.baseHealth,
    statusEffects: [],
    counters: [],
    summoningSickness: false,
    slotIndex: 0,
    ...overrides,
  };
  return instance;
}

/**
 * Setup a game state with specific beasts on the field
 */
export function setupGameState(
  player1Beasts: (BloomBeastInstance | null)[],
  player2Beasts: (BloomBeastInstance | null)[],
  overrides?: Partial<GameState>
): GameState {
  const player1 = createTestPlayer('Player 1');
  const player2 = createTestPlayer('Player 2');

  player1.field = [...player1Beasts];
  player2.field = [...player2Beasts];

  return {
    turn: 1,
    phase: 'Main',
    activePlayer: 0,
    players: [player1, player2],
    habitatZone: null,
    turnHistory: [],
    ...overrides,
  };
}

/**
 * Give a player cards in hand for testing
 */
export function giveCards(player: Player, cards: AnyCard[]): void {
  player.hand.push(...cards);
}

/**
 * Replace player's hand with specific cards (clears existing hand)
 */
export function setHand(player: Player, cards: AnyCard[]): void {
  player.hand = [...cards];
}

/**
 * Give a player nectar (adds to current amount)
 */
export function giveNectar(player: Player, amount: number): void {
  player.currentNectar += amount;
}

/**
 * Place a beast on the field at a specific position
 */
export function placeBeast(
  player: Player,
  beast: BloomBeastInstance,
  position: number
): void {
  if (position >= 0 && position < player.field.length) {
    beast.slotIndex = position;
    player.field[position] = beast;
  }
}

/**
 * Get the active player
 */
export function getActivePlayer(gameState: GameState): Player {
  return gameState.players[gameState.activePlayer];
}

/**
 * Get the opponent player
 */
export function getOpponent(gameState: GameState): Player {
  return gameState.players[gameState.activePlayer === 0 ? 1 : 0];
}

/**
 * Count beasts on field
 */
export function countBeasts(player: Player): number {
  return player.field.filter(b => b !== null).length;
}

/**
 * Count alive beasts on field
 */
export function countAliveBeasts(player: Player): number {
  return player.field.filter(b => b !== null && b.currentHealth > 0).length;
}

/**
 * Get total health of all beasts
 */
export function getTotalHealth(player: Player): number {
  return player.field.reduce((sum, beast) => {
    return sum + (beast ? beast.currentHealth : 0);
  }, 0);
}

/**
 * Get total attack of all beasts
 */
export function getTotalAttack(player: Player): number {
  return player.field.reduce((sum, beast) => {
    return sum + (beast ? beast.currentAttack : 0);
  }, 0);
}

/**
 * Find beast by card ID
 */
export function findBeastByCardId(
  player: Player,
  cardId: string
): BloomBeastInstance | null {
  return player.field.find(b => b && b.cardId === cardId) || null;
}

/**
 * Check if beast has counter
 */
export function hasCounter(beast: BloomBeastInstance, counterType: string): boolean {
  return beast.counters.some(c => c.type === counterType && c.amount > 0);
}

/**
 * Get counter amount
 */
export function getCounterAmount(beast: BloomBeastInstance, counterType: string): number {
  const counter = beast.counters.find(c => c.type === counterType);
  return counter ? counter.amount : 0;
}

/**
 * Assert helper - check beast stats
 */
export function expectBeastStats(
  beast: BloomBeastInstance,
  expectedAttack: number,
  expectedHealth: number
): void {
  if (beast.currentAttack !== expectedAttack) {
    throw new Error(
      `Expected attack ${expectedAttack}, got ${beast.currentAttack}`
    );
  }
  if (beast.currentHealth !== expectedHealth) {
    throw new Error(
      `Expected health ${expectedHealth}, got ${beast.currentHealth}`
    );
  }
}

/**
 * Wait for async operations
 */
export async function waitForEffects(): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, 10));
}
