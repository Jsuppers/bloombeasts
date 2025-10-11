/**
 * Mission Battle UI - Handles the mission battle screen and integration with game engine
 */

import { Mission } from './types';
import { MissionManager, MissionRunProgress, RewardResult } from './MissionManager';
import { GameEngine } from '../../engine/systems/GameEngine';
import { GameState, Player } from '../../engine/types/game';
import { AnyCard } from '../../engine/types/core';
import { SimpleMap } from '../../utils/polyfills';

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
  private currentBattle: BattleUIState | null = null;
  private renderCallback: (() => void) | null = null;

  constructor(missionManager: MissionManager, gameEngine: GameEngine) {
    this.missionManager = missionManager;
    this.gameEngine = gameEngine;
  }

  /**
   * Set a callback to trigger UI re-rendering
   */
  setRenderCallback(callback: () => void): void {
    this.renderCallback = callback;
  }

  /**
   * Initialize a mission battle
   */
  initializeBattle(playerDeckCards: AnyCard[]): BattleUIState | null {
    const mission = this.missionManager.getCurrentMission();
    if (!mission) {
      console.error('No mission selected');
      return null;
    }

    // Create player
    const player: Player = {
      id: 'player',
      name: 'Player',
      health: 30,
      maxHealth: 30,
      deck: playerDeckCards,
      hand: [],
      field: [],
      graveyard: [],
      trapZone: [],
      currentNectar: 1,
      summonsThisTurn: 0,
      habitatCounters: new SimpleMap(),
    };

    // Create AI opponent with mission-specific configuration
    const opponent: Player = {
      id: 'opponent',
      name: mission.opponentAI.name,
      health: 30,
      maxHealth: 30,
      deck: mission.opponentDeck.cards,
      hand: [],
      field: [],
      graveyard: [],
      trapZone: [],
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

    // Initialize game
    // TODO: GameEngine.initializeGame needs to be implemented
    const gameState: GameState = {
      players: [player, opponent],
      activePlayer: 0,
      habitatZone: null,
      turn: 1,
      phase: 'Setup',
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
      console.error('No active battle');
      return;
    }

    let result: any = {
      success: false,
      damage: data?.damage || 0,
    };

    // Handle different action types
    if (action.startsWith('play-card-')) {
      // Extract card index from action (e.g., 'play-card-0' -> 0)
      const cardIndex = parseInt(action.substring('play-card-'.length), 10);
      result = this.playCard(cardIndex);
    } else if (action.startsWith('use-bloom-')) {
      // Extract beast index (e.g., 'use-bloom-0' -> 0)
      const beastIndex = parseInt(action.substring('use-bloom-'.length), 10);
      result = this.useBloomAbility(beastIndex);
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
      // Process other actions through the game engine
      // TODO: GameEngine.processAction needs to be implemented
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
  private playCard(cardIndex: number): any {
    if (!this.currentBattle || !this.currentBattle.gameState) {
      return { success: false, message: 'No active battle' };
    }

    const player = this.currentBattle.gameState.players[0];

    // Validate card index
    if (cardIndex < 0 || cardIndex >= player.hand.length) {
      console.error(`Invalid card index: ${cardIndex}`);
      return { success: false, message: 'Invalid card index' };
    }

    const card: any = player.hand[cardIndex];

    // Only Bloom Beast cards can be played to the field
    if (card.type !== 'Bloom') {
      console.log('Only Bloom Beasts can be played to the field');
      return { success: false, message: 'Invalid card type' };
    }

    // Check if player has enough nectar
    if (card.cost > player.currentNectar) {
      console.log('Not enough nectar to play this card');
      return { success: false, message: 'Not enough nectar' };
    }

    // Check if field has space (max 3 beasts)
    if (player.field.length >= 3) {
      console.log('Field is full');
      return { success: false, message: 'Field is full' };
    }

    // Remove card from hand
    const playedCard: any = player.hand.splice(cardIndex, 1)[0];

    // Deduct nectar cost
    player.currentNectar -= playedCard.cost;

    // Create proper BloomBeastInstance for the field
    const beastInstance: any = {
      cardId: playedCard.id,
      instanceId: playedCard.instanceId || `${playedCard.id}-${Date.now()}`,
      currentLevel: (playedCard as any).level || 1, // Use card's level if available
      currentXP: 0,
      currentAttack: playedCard.baseAttack,
      currentHealth: playedCard.baseHealth,
      maxHealth: playedCard.baseHealth,
      counters: [],
      statusEffects: [],
      slotIndex: player.field.length,
      summoningSickness: true, // Can't attack on first turn
      usedBloomThisTurn: false, // Track bloom ability usage
      // Store original card data for display
      name: playedCard.name,
      affinity: playedCard.affinity,
      baseAttack: playedCard.baseAttack,
      passiveAbility: playedCard.passiveAbility,
      bloomAbility: playedCard.bloomAbility,
    };

    // Add to field
    player.field.push(beastInstance);

    console.log(`Played ${playedCard.name} - Nectar: ${player.currentNectar}`);

    return { success: true, message: `Played ${playedCard.name}` };
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

    // Validate indices
    if (attackerIndex < 0 || attackerIndex >= player.field.length) {
      return { success: false, message: 'Invalid attacker' };
    }
    if (targetIndex < 0 || targetIndex >= opponent.field.length) {
      return { success: false, message: 'Invalid target' };
    }

    const attacker: any = player.field[attackerIndex];
    const target: any = opponent.field[targetIndex];

    // Check if attacker can attack
    if (attacker.summoningSickness) {
      console.log('Beast has summoning sickness and cannot attack');
      return { success: false, message: 'Summoning sickness' };
    }

    console.log(`${attacker.name} attacks ${target.name}!`);

    // Deal damage to each other
    const attackerDamage = attacker.currentAttack || 0;
    const targetDamage = target.currentAttack || 0;

    target.currentHealth -= attackerDamage;
    attacker.currentHealth -= targetDamage;

    // Remove dead beasts
    if (target.currentHealth <= 0) {
      opponent.field.splice(targetIndex, 1);
      console.log(`${target.name} was defeated!`);
    }
    if (attacker.currentHealth <= 0) {
      player.field.splice(attackerIndex, 1);
      console.log(`${attacker.name} was defeated!`);
    }

    // Mark beast as having attacked (can't attack again this turn)
    if (attacker.currentHealth > 0) {
      attacker.summoningSickness = true; // Reuse this to prevent multiple attacks
    }

    return { success: true, damage: attackerDamage };
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

    // Validate index
    if (attackerIndex < 0 || attackerIndex >= player.field.length) {
      return { success: false, message: 'Invalid attacker' };
    }

    // Can only attack player directly if opponent has no beasts
    if (opponent.field.length > 0) {
      console.log('Cannot attack player directly while opponent has beasts');
      return { success: false, message: 'Must attack beasts first' };
    }

    const attacker: any = player.field[attackerIndex];

    // Check if attacker can attack
    if (attacker.summoningSickness) {
      console.log('Beast has summoning sickness and cannot attack');
      return { success: false, message: 'Summoning sickness' };
    }

    const damage = attacker.currentAttack || 0;
    opponent.health -= damage;

    console.log(`${attacker.name} attacks opponent for ${damage} damage!`);

    // Mark beast as having attacked
    attacker.summoningSickness = true; // Reuse this to prevent multiple attacks

    return { success: true, damage };
  }

  /**
   * Activate a beast's bloom ability
   */
  private useBloomAbility(beastIndex: number): any {
    if (!this.currentBattle || !this.currentBattle.gameState) {
      return { success: false, message: 'No active battle' };
    }

    const player = this.currentBattle.gameState.players[0];
    const opponent = this.currentBattle.gameState.players[1];

    // Validate beast index
    if (beastIndex < 0 || beastIndex >= player.field.length) {
      return { success: false, message: 'Invalid beast index' };
    }

    const beast: any = player.field[beastIndex];
    if (!beast) {
      return { success: false, message: 'No beast at this position' };
    }

    // Check if beast has summoning sickness
    if (beast.summoningSickness) {
      return { success: false, message: 'Beast has summoning sickness' };
    }

    // Check if beast has a bloom ability
    if (!beast.bloomAbility) {
      return { success: false, message: 'Beast has no bloom ability' };
    }

    // Check if bloom ability was already used this turn
    if (beast.usedBloomThisTurn) {
      return { success: false, message: 'Bloom ability already used this turn' };
    }

    const ability = beast.bloomAbility as any;

    // Check and pay costs
    if (ability.cost) {
      switch (ability.cost.type) {
        case 'nectar':
          const nectarCost = ability.cost.value || 1;
          if (player.currentNectar < nectarCost) {
            return { success: false, message: 'Not enough nectar' };
          }
          player.currentNectar -= nectarCost;
          break;
        case 'discard':
          const discardCost = ability.cost.value || 1;
          if (player.hand.length < discardCost) {
            return { success: false, message: 'Not enough cards to discard' };
          }
          for (let i = 0; i < discardCost; i++) {
            const card = player.hand.pop();
            if (card) player.graveyard.push(card);
          }
          break;
        case 'remove-counter':
          // TODO: Implement counter removal from habitat
          console.log('Counter removal not yet implemented');
          break;
      }
    }

    // Process bloom ability effects
    if (ability.effects && Array.isArray(ability.effects)) {
      for (const effect of ability.effects) {
        this.processAbilityEffect(effect, beast, player, opponent);
      }
    }

    // Mark ability as used this turn
    beast.usedBloomThisTurn = true;

    console.log(`Activated bloom ability: ${ability.name}`);
    return { success: true, message: `Used ${ability.name}` };
  }

  /**
   * Process a single ability effect
   */
  private processAbilityEffect(effect: any, source: any, player: any, opponent: any): void {
    switch (effect.type) {
      case 'modify-stats':
        if (effect.target === 'self') {
          if (effect.stat === 'attack') {
            source.currentAttack += effect.value || 0;
          } else if (effect.stat === 'health') {
            source.currentHealth += effect.value || 0;
            source.maxHealth += effect.value || 0; // Also increase max health
          }
        }
        break;

      case 'heal':
        if (effect.target === 'self') {
          const healAmount = effect.value || 0;
          source.currentHealth = Math.min(source.maxHealth, source.currentHealth + healAmount);
        }
        break;

      case 'damage':
        // TODO: Implement damage targeting
        console.log(`Damage effect: ${effect.value}`);
        break;

      case 'immunity':
        // TODO: Implement immunity tracking
        console.log(`Immunity effect: ${effect.immuneTo}`);
        break;

      default:
        console.log(`Unknown effect type: ${effect.type}`);
    }
  }

  /**
   * End player's turn and start opponent's turn
   */
  private async endPlayerTurn(): Promise<any> {
    if (!this.currentBattle || !this.currentBattle.gameState) {
      return { success: false };
    }

    const gameState = this.currentBattle.gameState;

    // Remove summoning sickness and reset bloom usage for all player beasts
    const player = gameState.players[0];
    player.field.forEach((beast: any) => {
      if (beast) {
        beast.summoningSickness = false;
        beast.usedBloomThisTurn = false; // Reset bloom ability usage
      }
    });

    // Switch to opponent turn
    gameState.activePlayer = 1;

    // Process opponent AI turn with delays for visibility
    await this.processOpponentTurn();

    // Switch back to player
    gameState.activePlayer = 0;
    gameState.turn++;

    // Draw a card for player at start of their turn
    this.drawCard(player);

    // Increase player nectar (max 10)
    player.currentNectar = Math.min(10, gameState.turn);

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
        console.log(`Drew card: ${card.name}`);
      }
    } else {
      console.log('Deck is empty - cannot draw');
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
    const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    // Draw a card
    this.drawCard(opponent);
    if (this.renderCallback) this.renderCallback();
    await delay(800);

    // Increase opponent nectar
    opponent.currentNectar = Math.min(10, this.currentBattle.gameState.turn);
    if (this.renderCallback) this.renderCallback();
    await delay(500);

    // Remove summoning sickness from beasts that were already on the field at start of turn
    // (Don't remove from beasts that will be summoned this turn)
    opponent.field.forEach((beast: any) => {
      if (beast) {
        beast.summoningSickness = false;
        beast.usedBloomThisTurn = false; // Reset bloom ability usage
      }
    });

    // Simple AI: Play cards if affordable and field has space
    for (let i = opponent.hand.length - 1; i >= 0; i--) {
      const card: any = opponent.hand[i];

      if (card.type === 'Bloom' && card.cost <= opponent.currentNectar && opponent.field.length < 3) {
        // Play the card
        const playedCard: any = opponent.hand.splice(i, 1)[0];
        opponent.currentNectar -= playedCard.cost;

        const beastInstance: any = {
          cardId: playedCard.id,
          instanceId: playedCard.instanceId || `${playedCard.id}-${Date.now()}`,
          currentLevel: 1 as any,
          currentXP: 0,
          currentAttack: playedCard.baseAttack,
          currentHealth: playedCard.baseHealth,
          maxHealth: playedCard.baseHealth,
          counters: [],
          statusEffects: [],
          slotIndex: opponent.field.length,
          summoningSickness: true, // Can't attack on the turn they're summoned
          usedBloomThisTurn: false, // Track bloom ability usage
          // Store original card data for display
          name: playedCard.name,
          affinity: playedCard.affinity,
          baseAttack: playedCard.baseAttack,
          passiveAbility: playedCard.passiveAbility,
          bloomAbility: playedCard.bloomAbility,
        };

        opponent.field.push(beastInstance);
        console.log(`Opponent played ${playedCard.name}`);

        // Render and delay after playing card
        if (this.renderCallback) this.renderCallback();
        await delay(1200);
      }
    }

    // Attack with all beasts that don't have summoning sickness
    for (let index = opponent.field.length - 1; index >= 0; index--) {
      const beast: any = opponent.field[index];

      if (beast && !beast.summoningSickness) {
        if (player.field.length > 0) {
          // Attack a random player beast
          const targetIndex = Math.floor(Math.random() * player.field.length);
          const target: any = player.field[targetIndex];

          if (target) {
            console.log(`Opponent's ${beast.name} attacks ${target.name}`);

            // Deal damage to each other
            target.currentHealth -= beast.currentAttack || 0;
            beast.currentHealth -= target.currentAttack || 0;

            // Remove dead beasts
            if (target.currentHealth <= 0) {
              player.field.splice(targetIndex, 1);
              console.log(`${target.name} was defeated!`);
            }
            if (beast.currentHealth <= 0) {
              opponent.field.splice(index, 1);
              console.log(`Opponent's ${beast.name} was defeated!`);
            }

            // Render and delay after attack
            if (this.renderCallback) this.renderCallback();
            await delay(1000);
          }
        } else {
          // No beasts to attack - attack player directly
          const damage = beast.currentAttack || 0;
          player.health -= damage;
          console.log(`Opponent's ${beast.name} attacks you directly for ${damage} damage!`);

          // Render and delay after direct attack
          if (this.renderCallback) this.renderCallback();
          await delay(1000);
        }
      }
    }

    console.log('Opponent turn ended');
  }

  /**
   * Shuffle a deck using Fisher-Yates algorithm
   */
  private shuffleDeck(deck: any[]): void {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
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
            // Apply periodic buffs to Fire and Water beasts
            // TODO: This needs refactoring to work with BloomBeastInstance
            // which doesn't have direct card or tempStats properties
            /*
            gameState.players.forEach(player => {
              player.field.forEach(beast => {
                if (beast && beast.card && (beast.card.affinity === 'Fire' || beast.card.affinity === 'Water')) {
                  beast.tempStats.atk = (beast.tempStats.atk || 0) + 1;
                  beast.currentHealth++;
                }
              });
            });
            */
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

    const player = this.currentBattle.gameState?.players[0];
    const opponent = this.currentBattle.gameState?.players[1];

    if (player && opponent && opponent.health <= 0 && player.health > 0) {
      // Victory!
      const rewards = this.missionManager.completeMission();

      if (rewards) {
        this.currentBattle.isComplete = true;
        this.currentBattle.rewards = rewards;
        console.log('Mission Complete!', rewards);
      }
    } else {
      // Defeat - player health reached 0 or other loss condition
      console.log('Mission Failed - Player Defeated');
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
    if (progressDisplay) {
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

    if (rewards.nectarGained > 0) {
      display.push(`Nectar Gained: ${rewards.nectarGained}`);
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
    this.currentBattle = null;
    this.renderCallback = null; // Clear callback to prevent race conditions
  }
}