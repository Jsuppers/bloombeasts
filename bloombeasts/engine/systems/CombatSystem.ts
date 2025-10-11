/**
 * Combat System - Handles battle mechanics and turn flow
 */

import { BloomBeastInstance, Player, GameState } from '../types/game';
import { AbilityProcessor } from './AbilityProcessor';
import { LevelingSystem } from './LevelingSystem';
import { SimpleMap } from '../../utils/polyfills';

export interface CombatResult {
  winner: 'player1' | 'player2' | 'draw';
  turnsPlayed: number;
  damageDealt: {
    player1: number;
    player2: number;
  };
  xpGained: {
    player1: SimpleMap<string, number>;
    player2: SimpleMap<string, number>;
  };
}

export class CombatSystem {
  private abilityProcessor: AbilityProcessor;
  private currentTurn: number = 0;
  private maxTurns: number = 50;

  constructor() {
    this.abilityProcessor = new AbilityProcessor();
  }

  /**
   * Execute a combat phase between two players
   */
  public async executeCombat(
    gameState: GameState,
    attacker: Player,
    defender: Player
  ): Promise<void> {
    console.log(`Combat phase: ${attacker.name} attacks ${defender.name}`);

    // TODO: Implement combat resolution
    // 1. Apply pre-attack abilities
    // 2. Calculate damage
    // 3. Apply damage
    // 4. Trigger on-damage abilities
    // 5. Check for defeated beasts
    // 6. Award XP for defeats
  }

  /**
   * Process an attack between two beasts
   */
  public processAttack(
    attacker: BloomBeastInstance,
    defender: BloomBeastInstance,
    gameState: GameState
  ): number {
    const baseDamage = attacker.currentAttack;

    // TODO: Apply damage modifiers
    // - Check for damage reduction
    // - Check for damage amplification
    // - Check for immunity

    return baseDamage;
  }

  /**
   * Apply damage to a beast
   */
  public applyDamage(
    target: BloomBeastInstance,
    damage: number,
    source: BloomBeastInstance | null = null
  ): void {
    target.currentHealth = Math.max(0, target.currentHealth - damage);

    if (target.currentHealth === 0) {
      this.handleDefeat(target, source);
    }
  }

  /**
   * Handle a beast being defeated
   */
  private handleDefeat(
    defeated: BloomBeastInstance,
    victor: BloomBeastInstance | null
  ): void {
    console.log(`${defeated.cardId} was defeated!`);

    if (victor) {
      // Award combat XP
      LevelingSystem.addCombatXP(victor);
    }

    // TODO: Trigger on-destroy abilities
    // TODO: Remove from field
  }

  /**
   * Check if combat should end
   */
  public checkWinCondition(gameState: GameState): CombatResult | null {
    const player1Health = gameState.players[0].health;
    const player2Health = gameState.players[1].health;

    // Check for player health reaching 0
    if (player1Health <= 0 && player2Health <= 0) {
      return this.createCombatResult('draw', gameState);
    } else if (player1Health <= 0) {
      return this.createCombatResult('player2', gameState);
    } else if (player2Health <= 0) {
      return this.createCombatResult('player1', gameState);
    }

    // Check for beasts on field
    const player1HasBeasts = gameState.players[0].field.some(b => b && b.currentHealth > 0);
    const player2HasBeasts = gameState.players[1].field.some(b => b && b.currentHealth > 0);

    if (!player1HasBeasts && !player2HasBeasts) {
      return this.createCombatResult('draw', gameState);
    } else if (!player1HasBeasts) {
      return this.createCombatResult('player2', gameState);
    } else if (!player2HasBeasts) {
      return this.createCombatResult('player1', gameState);
    }

    // Check for max turns
    if (this.currentTurn >= this.maxTurns) {
      return this.createCombatResult('draw', gameState);
    }

    return null;
  }

  /**
   * Create combat result summary
   */
  private createCombatResult(
    winner: 'player1' | 'player2' | 'draw',
    gameState: GameState
  ): CombatResult {
    return {
      winner,
      turnsPlayed: this.currentTurn,
      damageDealt: {
        player1: 30 - gameState.players[1].health,
        player2: 30 - gameState.players[0].health,
      },
      xpGained: {
        player1: new SimpleMap(),
        player2: new SimpleMap(),
      },
    };
  }

  /**
   * Reset combat system for new battle
   */
  public reset(): void {
    this.currentTurn = 0;
  }
}