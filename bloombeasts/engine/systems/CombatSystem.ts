/**
 * Combat System - Handles battle mechanics and turn flow
 */

import { BloomBeastInstance, Player, GameState } from '../types/game';
import { AbilityProcessor } from './AbilityProcessor';
import { LevelingSystem } from './LevelingSystem';
import { SimpleMap } from '../../utils/polyfills';
import { Logger } from '../utils/Logger';
import { STARTING_HEALTH, MAX_TURNS } from '../constants/gameRules';
import { getAliveBeasts } from '../utils/fieldUtils';
import { ICombatSystem } from './interfaces';

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

export class CombatSystem implements ICombatSystem {
  private abilityProcessor: AbilityProcessor;
  private levelingSystem: LevelingSystem;
  private currentTurn: number = 0;
  private maxTurns: number = MAX_TURNS;

  constructor() {
    this.abilityProcessor = new AbilityProcessor();
    this.levelingSystem = new LevelingSystem();
  }

  /**
   * Execute a combat phase between two players
   */
  public async executeCombat(
    gameState: GameState,
    attacker: Player,
    defender: Player
  ): Promise<void> {
    Logger.debug(`Combat phase: ${attacker.name} attacks ${defender.name}`);

    // Note: Full combat resolution is implemented in GameEngine.ts
    // The GameEngine handles:
    // 1. Pre-attack abilities (via triggerCombatAbilities with 'OnAttack')
    // 2. Damage calculation (processAttack method)
    // 3. Damage application (via applyDamage or direct health modification)
    // 4. On-damage abilities (via triggerCombatAbilities with 'OnDamage')
    // 5. Defeat detection and graveyard management
    // 6. XP awards (via LevelingSystem.addCombatXP)
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

    // Note: Damage modifiers are applied through:
    // - Status effects on the beast (stored in statusEffects array)
    // - Habitat zone ongoing effects (ModifyStats effects)
    // - Buff zone ongoing effects (ModifyStats effects)
    // - Counter effects (Burn, Freeze, etc.)
    // The GameEngine applies these modifiers when calculating final stats

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
    Logger.debug(`${defeated.cardId} was defeated!`);

    if (victor) {
      // Award combat XP
      this.levelingSystem.addCombatXP(victor);
    }

    // Note: On-destroy abilities and field removal are handled by GameEngine:
    // - GameEngine.executeAttack triggers 'OnDestroy' abilities via triggerCombatAbilities
    // - GameEngine.executeAttack removes defeated beasts from field and adds to graveyard
    // - GameEngine.processCounterEffects also handles death from burn/poison effects
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
    const player1HasBeasts = getAliveBeasts(gameState.players[0].field).length > 0;
    const player2HasBeasts = getAliveBeasts(gameState.players[1].field).length > 0;

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
        player1: STARTING_HEALTH - gameState.players[1].health,
        player2: STARTING_HEALTH - gameState.players[0].health,
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