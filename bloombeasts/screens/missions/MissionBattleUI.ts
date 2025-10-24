/**
 * Mission Battle UI - Handles the mission battle screen and integration with game engine
 */

import { Mission, resolveDeck } from './types';
import { MissionManager, MissionRunProgress, RewardResult } from './MissionManager';
import { GameEngine } from '../../engine/systems/GameEngine';
import { GameState, Player, BattleState } from '../../engine/types/game';
import { AnyCard } from '../../engine/types/core';
import { SimpleMap } from '../../utils/polyfills';
import { Logger } from '../../engine/utils/Logger';
import { getAllBeasts } from '../../engine/utils/fieldUtils';
import { pickRandom, shuffle } from '../../engine/utils/random';
import { OpponentAI } from './OpponentAI';
import { BattleStateManager } from './BattleStateManager';
import type { AsyncMethods } from '../../ui/types/bindings';

export interface BattleUIState {
  mission: Mission;
  gameState: GameState | null;
  progress: MissionRunProgress | null;
  isComplete: boolean;
  rewards: RewardResult | null;
}

export class MissionBattleUI {
  private missionManager: MissionManager;
  private gameEngine: GameEngine;
  private async: AsyncMethods;
  private currentBattle: BattleUIState | null = null;
  private renderCallback: (() => void) | null = null;
  private opponentActionCallback: ((action: string) => void) | null = null;
  private playerLowHealthTriggered: boolean = false; // Track if low health sound already played
  private battleStateManager: BattleStateManager;
  private opponentAI: OpponentAI;
  private shouldStopAI: boolean = false; // Flag to stop AI turn processing

  constructor(missionManager: MissionManager, gameEngine: GameEngine, async: AsyncMethods) {
    this.missionManager = missionManager;
    this.gameEngine = gameEngine;
    this.async = async;
    this.battleStateManager = new BattleStateManager();
    this.opponentAI = new OpponentAI({
      async,
      onAction: (action: string) => {
        if (this.opponentActionCallback) this.opponentActionCallback(action);
      },
      onRender: () => {
        if (this.renderCallback) this.renderCallback();
      },
    });
  }

  /**
   * Set a callback to trigger UI re-rendering
   */
  setRenderCallback(callback: () => void): void {
    this.renderCallback = callback;
  }

  /**
   * Set a callback for opponent actions (for sound effects, etc.)
   */
  setOpponentActionCallback(callback: (action: string) => void): void {
    this.opponentActionCallback = callback;
  }

  /**
   * Initialize a mission battle
   */
  initializeBattle(playerDeckCards: AnyCard[]): BattleUIState | null {
    // Reset AI stop flag for new battle
    this.shouldStopAI = false;

    const mission = this.missionManager.getCurrentMission();
    if (!mission) {
      Logger.error('No mission selected');
      return null;
    }

    // Create player
    const player: Player = {
      id: 'player',
      name: 'Player',
      health: 1,
      maxHealth: 30,
      deck: playerDeckCards,
      hand: [],
      field: [],
      graveyard: [],
      trapZone: [],
      buffZone: [],
      currentNectar: 1,
      summonsThisTurn: 0,
      habitatCounters: new SimpleMap(),
    };

    console.log('playerDeckCards', playerDeckCards);

    // Resolve the opponent deck (handles both DeckList and factory functions)
    const opponentDeck = resolveDeck(mission.opponentDeck);
    console.log('opponentDeck.cards', opponentDeck.cards);

    // Create AI opponent with mission-specific configuration
    // IMPORTANT: Create a copy of the deck cards to avoid mutation
    const opponentDeckCopy = [...opponentDeck.cards];
    console.log('opponentDeckCopy', opponentDeckCopy);

    const opponent: Player = {
      id: 'opponent',
      name: mission.opponentAI?.name || 'Opponent',
      health: 1,
      maxHealth: 1,
      deck: opponentDeckCopy,
      hand: [],
      field: [],
      graveyard: [],
      trapZone: [],
      buffZone: [],
      currentNectar: 1,
      summonsThisTurn: 0,
      habitatCounters: new SimpleMap(),
    };

    // Apply special rules that affect starting conditions
    mission.specialRules?.forEach(rule => {
      // Check by rule ID for specific effects
      if (rule.id === 'masters-domain') {
        opponent.health = 40;
        opponent.maxHealth = 40;
      }
    });

    // Initialize game state
    // Note: Game initialization is handled inline here rather than in GameEngine
    // to allow mission-specific customization (special rules, starting conditions, etc.)
    const gameState: GameState = {
      players: [player, opponent],
      activePlayer: 0,
      habitatZone: null,
      turn: 1,
      phase: 'Setup',
      battleState: BattleState.Player1StartOfTurn,  // Start with Player 1's turn
      turnHistory: [],
    };

    this.currentBattle = {
      mission,
      gameState,
      progress: this.missionManager.getProgress(),
      isComplete: false,
      rewards: null,
    };

    // Shuffle decks (simple shuffle)
    this.shuffleDeck(player.deck);
    this.shuffleDeck(opponent.deck);

    // Draw initial hands (3 cards each)
    for (let i = 0; i < 3; i++) {
      this.drawCard(player);
      this.drawCard(opponent);
    }

    return this.currentBattle;
  }

  /**
   * Process a player action
   */
  async processPlayerAction(action: string, data: any): Promise<void> {
    if (!this.currentBattle || !this.currentBattle.gameState) {
      Logger.error('No active battle');
      return;
    }

    let result: any = {
      success: false,
      damage: data?.damage || 0,
    };

    // Handle different action types
    if (action.startsWith('play-card-')) {
      // Extract card index and optional target from action
      // Format: 'play-card-X' or 'play-card-X-target-Y'
      const parts = action.substring('play-card-'.length).split('-target-');
      const cardIndex = parseInt(parts[0], 10);
      const targetIndex = parts.length > 1 ? parseInt(parts[1], 10) : undefined;

      console.log('[MissionBattleUI] Playing card:', { cardIndex, targetIndex });
      result = this.playCard(cardIndex, targetIndex);
    } else if (action.startsWith('use-ability-')) {
      // Extract beast index (e.g., 'use-ability-0' -> 0)
      const beastIndex = parseInt(action.substring('use-ability-'.length), 10);
      result = this.useAbility(beastIndex);
    } else if (action.startsWith('attack-beast-')) {
      // Extract attacker and target indices (e.g., 'attack-beast-0-1' -> attacker=0, target=1)
      const parts = action.substring('attack-beast-'.length).split('-');
      const attackerIndex = parseInt(parts[0], 10);
      const targetIndex = parseInt(parts[1], 10);
      result = this.attackBeast(attackerIndex, targetIndex);
    } else if (action.startsWith('attack-player-')) {
      // Extract attacker index (e.g., 'attack-player-0' -> attacker=0)
      const attackerIndex = parseInt(action.substring('attack-player-'.length), 10);
      result = this.attackPlayer(attackerIndex);
    } else if (action === 'end-turn') {
      result = await this.endPlayerTurn();
    } else {
      // Fallback for any unhandled action types
      // Note: All current actions are handled by the specific handlers above
      result = {
        success: true,
        damage: data?.damage || 0,
      };
    }

    // Update mission progress based on the action
    this.updateMissionProgress(action, result);

    // Check for battle end
    if (this.checkBattleEnd()) {
      this.endBattle();
    }
  }

  /**
   * Play a card from the player's hand
   */
  private playCard(cardIndex: number, targetIndex?: number): any {
    if (!this.currentBattle || !this.currentBattle.gameState) {
      return { success: false, message: 'No active battle' };
    }

    const player = this.currentBattle.gameState.players[0];
    const opponent = this.currentBattle.gameState.players[1];

    return this.battleStateManager.playCard(cardIndex, player, opponent, this.currentBattle.gameState, targetIndex);
  }

  /**
   * Attack an opponent beast with a player beast
   */
  private attackBeast(attackerIndex: number, targetIndex: number): any {
    if (!this.currentBattle || !this.currentBattle.gameState) {
      return { success: false, message: 'No active battle' };
    }

    const player = this.currentBattle.gameState.players[0];
    const opponent = this.currentBattle.gameState.players[1];

    return this.battleStateManager.attackBeast(attackerIndex, targetIndex, player, opponent, (trapName: string) => {
      if (this.opponentActionCallback) {
        this.opponentActionCallback('trap-activated');
      }
    });
  }

  /**
   * Attack opponent player directly with a beast
   */
  private attackPlayer(attackerIndex: number): any {
    if (!this.currentBattle || !this.currentBattle.gameState) {
      return { success: false, message: 'No active battle' };
    }

    const player = this.currentBattle.gameState.players[0];
    const opponent = this.currentBattle.gameState.players[1];

    return this.battleStateManager.attackPlayer(attackerIndex, player, opponent, (trapName: string) => {
      if (this.opponentActionCallback) {
        this.opponentActionCallback('trap-activated');
      }
    });
  }

  /**
   * Activate a beast's ability
   */
  private useAbility(beastIndex: number): any {
    if (!this.currentBattle || !this.currentBattle.gameState) {
      return { success: false, message: 'No active battle' };
    }

    const player = this.currentBattle.gameState.players[0];
    const opponent = this.currentBattle.gameState.players[1];

    return this.battleStateManager.useAbility(beastIndex, player, opponent, this.currentBattle.gameState);
  }


  /**
   * End player's turn and start opponent's turn
   */
  private async endPlayerTurn(): Promise<any> {
    if (!this.currentBattle || !this.currentBattle.gameState) {
      return { success: false };
    }

    const gameState = this.currentBattle.gameState;

    // Remove summoning sickness and reset ability usage for all player beasts
    const player = gameState.players[0];
    const opponent = gameState.players[1];
    player.field.forEach((beast: any) => {
      if (beast) {
        beast.summoningSickness = false;
        beast.usedAbilityThisTurn = false; // Reset ability usage
      }
    });

    // Process EndOfTurn triggers for player beasts before ending turn
    this.battleStateManager.processEndOfTurnTriggers(player, opponent);

    // Switch to opponent turn
    gameState.activePlayer = 1;

    // Process opponent AI turn with delays for visibility
    await this.processOpponentTurn();

    // Switch back to player
    gameState.activePlayer = 0;
    gameState.turn++;

    // Apply deathmatch damage after turn 30 (prevents stalemate)
    // Damage escalates every 5 turns: 30-34 = 1 dmg, 35-39 = 2 dmg, 40-44 = 3 dmg, etc.
    if (gameState.turn >= 30) {
      const opponent = gameState.players[1];
      const deathmatchDamage = Math.floor((gameState.turn - 30) / 5) + 1;
      Logger.debug(`Deathmatch! Both players lose ${deathmatchDamage} health`);
      player.health -= deathmatchDamage;
      opponent.health -= deathmatchDamage;

      // Check if either player died from deathmatch damage
      if (player.health <= 0 || opponent.health <= 0) {
        // Trigger render to show the damage
        if (this.renderCallback) this.renderCallback();
        // Battle will end after this function returns
      }
    }

    // Draw a card for player at start of their turn
    this.drawCard(player);

    // Increase player nectar (max 10)
    player.currentNectar = Math.min(10, gameState.turn);

    // Apply buff card start-of-turn effects (Swift Wind, Nature's Blessing)
    this.battleStateManager.applyBuffStartOfTurnEffects(player, opponent);

    // Process StartOfTurn triggers for player beasts
    this.battleStateManager.processStartOfTurnTriggers(player, opponent);

    // Reapply stat buffs to all beasts (Battle Fury, Mystic Shield)
    this.battleStateManager.applyStatBuffEffects(player);

    // Reset summoning counter
    player.summonsThisTurn = 0;

    return { success: true };
  }

  /**
   * Draw a card from the deck
   */
  private drawCard(player: Player): void {
    if (player.deck.length > 0) {
      const card = player.deck.pop();
      if (card) {
        player.hand.push(card);
        Logger.debug(`Drew card: ${card.name}`);
      }
    } else {
      Logger.debug('Deck is empty - cannot draw');
    }
  }

  /**
   * Process opponent AI turn (simplified) with delays for visibility
   */
  private async processOpponentTurn(): Promise<void> {
    if (!this.currentBattle || !this.currentBattle.gameState) return;

    const opponent = this.currentBattle.gameState.players[1];
    const player = this.currentBattle.gameState.players[0];

    // Helper function for delays
    const delay = (ms: number) => new Promise(resolve => this.async.setTimeout(resolve, ms));

    // Draw a card
    this.drawCard(opponent);
    if (this.renderCallback) this.renderCallback();
    await delay(800);
    if (this.shouldStopAI) return; // Stop if battle ended

    // Increase opponent nectar
    opponent.currentNectar = Math.min(10, this.currentBattle.gameState.turn);
    if (this.renderCallback) this.renderCallback();
    await delay(500);
    if (this.shouldStopAI) return; // Stop if battle ended

    // Apply buff card start-of-turn effects for opponent (Swift Wind, Nature's Blessing)
    this.battleStateManager.applyBuffStartOfTurnEffects(opponent, player);

    // Process StartOfTurn triggers for opponent beasts
    this.battleStateManager.processStartOfTurnTriggers(opponent, player);

    // Reapply stat buffs to all opponent beasts (Battle Fury, Mystic Shield)
    this.battleStateManager.applyStatBuffEffects(opponent);

    // Remove summoning sickness from beasts that were already on the field at start of turn
    // (Don't remove from beasts that will be summoned this turn)
    opponent.field.forEach((beast: any) => {
      if (beast) {
        beast.summoningSickness = false;
        beast.usedAbilityThisTurn = false; // Reset ability usage
      }
    });

    // Delegate to OpponentAI for decision making and execution
    await this.opponentAI.executeTurn(opponent, player, this.currentBattle.gameState, {
      processOnSummonTrigger: this.battleStateManager.processOnSummonTrigger.bind(this.battleStateManager),
      processOnAttackTrigger: this.battleStateManager.processOnAttackTrigger.bind(this.battleStateManager),
      processOnDamageTrigger: this.battleStateManager.processOnDamageTrigger.bind(this.battleStateManager),
      processOnDestroyTrigger: this.battleStateManager.processOnDestroyTrigger.bind(this.battleStateManager),
      processMagicEffect: this.battleStateManager.processMagicEffect.bind(this.battleStateManager),
      processHabitatEffect: this.battleStateManager.processHabitatEffect.bind(this.battleStateManager),
      applyStatBuffEffects: this.battleStateManager.applyStatBuffEffects.bind(this.battleStateManager),
    }, () => this.shouldStopAI); // Pass shouldStopAI getter

    if (this.shouldStopAI) return; // Stop if battle ended

    // Check if player health reached 0 during AI turn - end battle immediately
    if (player.health <= 0) {
      this.endBattle();
      return; // Stop opponent turn processing
    }

    // Check if player health dropped below 10% threshold (for low health sound)
    const maxHealth = player.maxHealth || 30;
    const healthPercentage = (player.health / maxHealth) * 100;
    if (healthPercentage <= 10 && !this.playerLowHealthTriggered) {
      this.playerLowHealthTriggered = true;
      if (this.opponentActionCallback) this.opponentActionCallback('player-low-health');
    }
  }

  /**
   * Shuffle a deck using Fisher-Yates algorithm
   */
  private shuffleDeck(deck: any[]): void {
    shuffle(deck);
  }

  /**
   * Update mission progress based on game events
   */
  private updateMissionProgress(action: string, result: any): void {
    if (!this.currentBattle) return;

    // Handle play-card actions as summons
    if (action.startsWith('play-card-')) {
      if (result.success) {
        this.missionManager.updateProgress('beast-summoned', {});
      }
      return;
    }

    switch (action) {
      case 'end-turn':
        this.missionManager.updateProgress('turn-end', {});
        this.applyTurnBasedEffects();
        break;

      case 'attack':
        if (result.damage) {
          this.missionManager.updateProgress('damage-dealt', {
            amount: result.damage,
          });
        }
        break;

      case 'summon':
        if (result.success) {
          this.missionManager.updateProgress('beast-summoned', {});
        }
        break;

      case 'use-ability':
        if (result.success) {
          this.missionManager.updateProgress('ability-used', {});
        }
        break;
    }

    // Update health tracking
    if (this.currentBattle.gameState) {
      const player = this.currentBattle.gameState.players[0];
      const opponent = this.currentBattle.gameState.players[1];

      if (player && opponent) {
        this.missionManager.updateProgress('health-update', {
          playerHealth: player.health,
          opponentHealth: opponent.health,
        });
      }
    }
  }

  /**
   * Apply mission-specific turn-based effects
   */
  private applyTurnBasedEffects(): void {
    if (!this.currentBattle || !this.currentBattle.gameState) return;

    const mission = this.currentBattle.mission;
    const gameState = this.currentBattle.gameState;

    mission.specialRules?.forEach(rule => {
      switch (rule.effect) {
        case 'burn-damage':
          // Apply burn damage to all units
          gameState.players.forEach(player => {
            player.field.forEach(beast => {
              if (beast && beast.currentHealth > 0) {
                beast.currentHealth = Math.max(0, beast.currentHealth - 2);
              }
            });
          });
          break;

        case 'fast-nectar':
          // Give both players extra nectar
          gameState.players.forEach(player => {
            if (player.permanentNectar !== undefined) {
              player.permanentNectar = Math.min(10, player.permanentNectar + 1);
            }
          });
          break;

        case 'heal-per-turn':
          // Heal all beasts or regenerate player health based on rule
          if (rule.id === 'natural-cycle') {
            // Regenerate player health
            gameState.players.forEach(player => {
              const maxHp = player.maxHealth || 30;
              if (player.health < maxHp) {
                player.health = Math.min(maxHp, player.health + 1);
              }
            });
          } else {
            // Heal all beasts
            gameState.players.forEach(player => {
              player.field.forEach(beast => {
                if (beast && beast.currentHealth > 0 && beast.currentHealth < beast.maxHealth) {
                  beast.currentHealth = Math.min(beast.maxHealth, beast.currentHealth + 1);
                }
              });
            });
          }
          break;

        case 'random-effects':
          // Apply various random effects based on rule ID
          if (rule.id === 'elemental-flux' && gameState.turn % 3 === 0) {
            // Apply periodic buffs to Fire and Water beasts every 3 turns
            gameState.players.forEach(player => {
              player.field.forEach(beast => {
                if (beast && (beast.affinity === 'Fire' || beast.affinity === 'Water')) {
                  // Buff Fire and Water affinity beasts
                  beast.currentAttack = (beast.currentAttack || 0) + 1;
                  beast.currentHealth = Math.min(beast.maxHealth, beast.currentHealth + 1);
                  Logger.debug(`${beast.name} buffed by Elemental Flux (+1/+1)`);
                }
              });
            });
          }
          break;
      }
    });
  }

  /**
   * Check if the battle has ended
   */
  private checkBattleEnd(): boolean {
    if (!this.currentBattle || !this.currentBattle.gameState) return false;

    const player = this.currentBattle.gameState.players[0];
    const opponent = this.currentBattle.gameState.players[1];

    if (!player || !opponent) return false;

    // Check for defeat
    if (player.health <= 0) {
      return true;
    }

    // Check for victory
    if (opponent.health <= 0) {
      this.missionManager.updateProgress('opponent-defeated', {});
      return true;
    }

    // Check turn limit
    if (this.currentBattle.mission.turnLimit &&
        this.currentBattle.gameState.turn >= this.currentBattle.mission.turnLimit) {
      return true;
    }

    return false;
  }

  /**
   * End the battle and process rewards
   */
  private endBattle(): void {
    if (!this.currentBattle) return;

    // Stop AI turn processing immediately
    this.shouldStopAI = true;

    const player = this.currentBattle.gameState?.players[0];
    const opponent = this.currentBattle.gameState?.players[1];

    if (player && opponent && opponent.health <= 0 && player.health > 0) {
      // Victory!
      const rewards = this.missionManager.completeMission();

      if (rewards) {
        this.currentBattle.isComplete = true;
        this.currentBattle.rewards = rewards;
        Logger.debug('Mission Complete!', rewards);
      }
    } else {
      // Defeat - player health reached 0 or other loss condition
      Logger.debug('Mission Failed - Player Defeated');
      this.currentBattle.isComplete = true;
      this.currentBattle.rewards = null; // No rewards for losing
    }
  }

  /**
   * Get current battle display
   */
  getBattleDisplay(): string[] | null {
    if (!this.currentBattle || !this.currentBattle.gameState) {
      return null;
    }

    const player = this.currentBattle.gameState.players[0];
    const opponent = this.currentBattle.gameState.players[1];

    if (!player || !opponent) return null;

    const display: string[] = [
      `=== ${this.currentBattle.mission.name} ===`,
      '',
      `Turn: ${this.currentBattle.gameState.turn}`,
      '',
      'Player:',
      `  Health: ${player.health}/${player.maxHealth}`,
      `  Nectar: ${player.currentNectar}`,
      `  Hand: ${player.hand.length} cards`,
      `  Field: ${player.field.length} beasts`,
      '',
      `${opponent.name}:`,
      `  Health: ${opponent.health}/${opponent.maxHealth}`,
      `  Nectar: ${opponent.currentNectar}`,
      `  Hand: ${opponent.hand.length} cards`,
      `  Field: ${opponent.field.length} beasts`,
    ];

    // Add objective progress
    const progressDisplay = this.missionManager.getProgress();
    if (progressDisplay && this.currentBattle.mission.objectives) {
      display.push('');
      display.push('Objectives:');

      this.currentBattle.mission.objectives.forEach(obj => {
        const key = `${obj.type}-${obj.target || 0}`;
        const progress = progressDisplay.objectiveProgress.get(key) || 0;
        const target = obj.target || 1;
        const status = progress >= target ? '✅' : '⬜';
        display.push(`  ${status} ${obj.description}`);
      });
    }

    // Add special rules reminder
    if (this.currentBattle.mission.specialRules &&
        this.currentBattle.mission.specialRules.length > 0) {
      display.push('');
      display.push('Active Effects:');
      this.currentBattle.mission.specialRules.forEach(rule => {
        display.push(`  • ${rule.name}`);
      });
    }

    return display;
  }

  /**
   * Get reward display
   */
  getRewardDisplay(): string[] | null {
    if (!this.currentBattle || !this.currentBattle.rewards) {
      return null;
    }

    const rewards = this.currentBattle.rewards;
    const display: string[] = [
      '🎉 MISSION COMPLETE! 🎉',
      '',
      '=== Rewards ===',
      `XP Gained: ${rewards.xpGained}`,
    ];

    if (rewards.cardsReceived.length > 0) {
      display.push('');
      display.push('Cards Received:');
      rewards.cardsReceived.forEach(card => {
        display.push(`  • ${card.name} (${card.type})`);
      });
    }

    if (rewards.bonusRewards && rewards.bonusRewards.length > 0) {
      display.push('');
      display.push('Bonus Rewards:');
      rewards.bonusRewards.forEach(bonus => {
        display.push(`  • ${bonus}`);
      });
    }

    return display;
  }

  /**
   * Get current battle state
   */
  getCurrentBattle(): BattleUIState | null {
    return this.currentBattle;
  }

  /**
   * Clear the current battle
   */
  clearBattle(): void {
    this.shouldStopAI = true; // Stop any ongoing AI processing
    this.currentBattle = null;
    this.renderCallback = null; // Clear callback to prevent race conditions
    this.playerLowHealthTriggered = false; // Reset low health flag
  }
}