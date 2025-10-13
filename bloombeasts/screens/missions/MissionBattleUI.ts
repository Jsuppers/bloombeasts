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
  private opponentActionCallback: ((action: string) => void) | null = null;
  private playerLowHealthTriggered: boolean = false; // Track if low health sound already played

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
   * Set a callback for opponent actions (for sound effects, etc.)
   */
  setOpponentActionCallback(callback: (action: string) => void): void {
    this.opponentActionCallback = callback;
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
      buffZone: [],
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
    const opponent = this.currentBattle.gameState.players[1];

    // Validate card index
    if (cardIndex < 0 || cardIndex >= player.hand.length) {
      console.error(`Invalid card index: ${cardIndex}`);
      return { success: false, message: 'Invalid card index' };
    }

    const card: any = player.hand[cardIndex];

    // Check if player has enough nectar
    if (card.cost > player.currentNectar) {
      console.log('Not enough nectar to play this card');
      return { success: false, message: 'Not enough nectar' };
    }

    // Handle different card types
    switch (card.type) {
      case 'Bloom':
        // Check if field has space (max 3 beasts)
        if (player.field.length >= 3) {
          console.log('Field is full');
          return { success: false, message: 'Field is full' };
        }

        // Remove card from hand
        const bloomCard: any = player.hand.splice(cardIndex, 1)[0];

        // Deduct nectar cost
        player.currentNectar -= bloomCard.cost;

        // Create proper BloomBeastInstance for the field
        const beastInstance: any = {
          cardId: bloomCard.id,
          instanceId: bloomCard.instanceId || `${bloomCard.id}-${Date.now()}`,
          currentLevel: (bloomCard as any).level || 1, // Use card's level if available
          currentXP: 0,
          currentAttack: bloomCard.baseAttack,
          currentHealth: bloomCard.baseHealth,
          maxHealth: bloomCard.baseHealth,
          counters: [],
          statusEffects: [],
          slotIndex: player.field.length,
          summoningSickness: true, // Can't attack on first turn
          usedAbilityThisTurn: false, // Track ability usage
          // Store original card data for display (needed for unified rendering)
          type: 'Bloom',
          name: bloomCard.name,
          affinity: bloomCard.affinity,
          cost: bloomCard.cost,
          baseAttack: bloomCard.baseAttack,
          baseHealth: bloomCard.baseHealth,
          ability: bloomCard.ability,
        };

        // Add to field
        player.field.push(beastInstance);

        // Apply buff effects to newly summoned beast
        this.applyStatBuffEffects(player);

        // Process OnSummon trigger
        this.processOnSummonTrigger(beastInstance, player, opponent);

        console.log(`Played ${bloomCard.name} - Nectar: ${player.currentNectar}`);
        return { success: true, message: `Played ${bloomCard.name}` };

      case 'Magic':
        // Remove card from hand
        const magicCard: any = player.hand.splice(cardIndex, 1)[0];

        // Deduct nectar cost
        player.currentNectar -= magicCard.cost;

        // Process magic card effects immediately
        if (magicCard.effects && Array.isArray(magicCard.effects)) {
          for (const effect of magicCard.effects) {
            this.processMagicEffect(effect, player, opponent);
          }
        }

        // Magic cards go to graveyard after use
        player.graveyard.push(magicCard);

        console.log(`Played magic card: ${magicCard.name}`);
        return { success: true, message: `Played ${magicCard.name}` };

      case 'Trap':
        // Check if trap zone has space (max 3 traps)
        if (player.trapZone.length >= 3) {
          console.log('Trap zone is full');
          return { success: false, message: 'Trap zone is full' };
        }

        // Remove card from hand
        const trapCard: any = player.hand.splice(cardIndex, 1)[0];

        // Deduct nectar cost
        player.currentNectar -= trapCard.cost;

        // Add to trap zone
        player.trapZone.push(trapCard);

        console.log(`Set trap: ${trapCard.name}`);

        // TODO: Trap Activation Logic
        // Traps should activate based on specific triggers (e.g., when opponent attacks, casts spell, etc.)
        // When a trap activates:
        //   1. Process the trap's effects from trapCard.effects
        //   2. Trigger callback: if (this.opponentActionCallback) this.opponentActionCallback('trap-activated');
        //   3. This will play the sfx/trapCardActivated.wav sound in GameManager
        //   4. Remove the trap from trapZone and move to graveyard
        // Implementation needed in: processOpponentTurn(), attackBeast(), attackPlayer(), processMagicEffect()

        return { success: true, message: `Set ${trapCard.name}`, isTrap: true };

      case 'Buff':
        // Check if buff zone has space (max 2 buffs)
        if (player.buffZone.length >= 2) {
          console.log('Buff zone is full');
          return { success: false, message: 'Buff zone is full' };
        }

        // Remove card from hand
        const buffCard: any = player.hand.splice(cardIndex, 1)[0];

        // Deduct nectar cost
        player.currentNectar -= buffCard.cost;

        // Add to buff zone (buff cards stay on board and provide ongoing effects)
        player.buffZone.push(buffCard);

        // Apply initial stat buff effects immediately (Battle Fury, Mystic Shield)
        this.applyStatBuffEffects(player);

        console.log(`Played buff: ${buffCard.name}`);
        return { success: true, message: `Played ${buffCard.name}` };

      case 'Habitat':
        // Remove card from hand
        const habitatCard: any = player.hand.splice(cardIndex, 1)[0];

        // Deduct nectar cost
        player.currentNectar -= habitatCard.cost;

        // Set habitat zone
        this.currentBattle.gameState.habitatZone = habitatCard;

        // Process on-play effects
        if (habitatCard.onPlayEffects && Array.isArray(habitatCard.onPlayEffects)) {
          for (const effect of habitatCard.onPlayEffects) {
            this.processHabitatEffect(effect, player, opponent);
          }
        }

        console.log(`Played habitat: ${habitatCard.name}`);
        return { success: true, message: `Played ${habitatCard.name}` };

      default:
        console.log(`Cannot play card type: ${card.type}`);
        return { success: false, message: 'Invalid card type' };
    }
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

    // Process OnAttack trigger for the attacker
    this.processOnAttackTrigger(attacker, player, opponent);

    // Check for trap activation (opponent's traps)
    this.checkAndActivateTraps(opponent, player, 'attack');

    // Deal damage to each other
    const attackerDamage = attacker.currentAttack || 0;
    const targetDamage = target.currentAttack || 0;

    target.currentHealth -= attackerDamage;
    attacker.currentHealth -= targetDamage;

    // Process OnDamage triggers for beasts that took damage
    if (attackerDamage > 0) {
      this.processOnDamageTrigger(target, opponent, player);
    }
    if (targetDamage > 0) {
      this.processOnDamageTrigger(attacker, player, opponent);
    }

    // Remove dead beasts
    if (target.currentHealth <= 0) {
      // Process OnDestroy trigger before removing
      this.processOnDestroyTrigger(target, opponent, player);
      opponent.field.splice(targetIndex, 1);
      console.log(`${target.name} was defeated!`);
    }
    if (attacker.currentHealth <= 0) {
      // Process OnDestroy trigger before removing
      this.processOnDestroyTrigger(attacker, player, opponent);
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

    // Process OnAttack trigger for the attacker
    this.processOnAttackTrigger(attacker, player, opponent);

    // Check for trap activation (opponent's traps)
    this.checkAndActivateTraps(opponent, player, 'attack');

    opponent.health -= damage;

    console.log(`${attacker.name} attacks opponent for ${damage} damage!`);

    // Mark beast as having attacked
    attacker.summoningSickness = true; // Reuse this to prevent multiple attacks

    return { success: true, damage };
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

    // Check if beast has an ability
    if (!beast.ability) {
      return { success: false, message: 'Beast has no ability' };
    }

    // Check if ability was already used this turn
    if (beast.usedAbilityThisTurn) {
      return { success: false, message: 'Ability already used this turn' };
    }

    const ability = beast.ability as any;

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
          // Remove counters from habitat zone
          if (this.currentBattle && this.currentBattle.gameState && this.currentBattle.gameState.habitatZone) {
            const habitat = this.currentBattle.gameState.habitatZone as any;
            if (habitat.counters && Array.isArray(habitat.counters)) {
              const counterCost = ability.cost.value || 1;
              const removedCount = Math.min(counterCost, habitat.counters.length);
              habitat.counters.splice(0, removedCount);
              console.log(`Removed ${removedCount} counter(s) from ${habitat.name}`);
            } else {
              return { success: false, message: 'No counters available on habitat' };
            }
          } else {
            return { success: false, message: 'No habitat on field' };
          }
          break;
      }
    }

    // Process ability effects
    if (ability.effects && Array.isArray(ability.effects)) {
      for (const effect of ability.effects) {
        this.processAbilityEffect(effect, beast, player, opponent);
      }
    }

    // Mark ability as used this turn
    beast.usedAbilityThisTurn = true;

    console.log(`Activated ability: ${ability.name}`);
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
        // Deal damage based on target
        const damageTargets = this.getEffectTargets(effect.target, player, opponent, effect.condition);
        damageTargets.forEach((target: any) => {
          if (target.currentHealth !== undefined) {
            // It's a beast
            target.currentHealth -= effect.value || 0;
            if (target.currentHealth <= 0) {
              // Remove dead beast
              const ownerField = player.field.includes(target) ? player.field : opponent.field;
              const owner = player.field.includes(target) ? player : opponent;
              const otherPlayer = player.field.includes(target) ? opponent : player;
              const index = ownerField.indexOf(target);
              if (index > -1) {
                // Process OnDestroy trigger before removing
                this.processOnDestroyTrigger(target, owner, otherPlayer);
                ownerField.splice(index, 1);
                console.log(`${target.name} was destroyed by ${source.name}'s ability!`);
              }
            }
          } else if (target.health !== undefined) {
            // It's a player
            target.health -= effect.value || 0;
            console.log(`${effect.value} damage dealt to ${target.name}`);
          }
        });
        break;

      case 'immunity':
        // Implement immunity tracking
        if (effect.target === 'self') {
          if (!source.statusEffects) source.statusEffects = [];
          // Add immunity status effect
          const immunityEffect = {
            type: 'immunity',
            immuneTo: effect.immuneTo || 'all',
            duration: effect.duration || 'permanent'
          };
          source.statusEffects.push(immunityEffect);
          console.log(`${source.name} gained immunity to ${effect.immuneTo || 'all'}`);
        }
        break;

      case 'apply-counter':
        // Apply counters to habitat zone or beasts
        if (effect.counter === 'Spore' && this.currentBattle && this.currentBattle.gameState) {
          // Spore counters go on the habitat zone
          const habitatZone = this.currentBattle.gameState.habitatZone as any;
          if (habitatZone) {
            if (!habitatZone.counters) {
              habitatZone.counters = [];
            }
            // Find existing Spore counter or create new one
            const existingCounter = habitatZone.counters.find((c: any) => c.type === effect.counter);
            if (existingCounter) {
              existingCounter.amount += effect.value || 1;
            } else {
              habitatZone.counters.push({
                type: effect.counter,
                amount: effect.value || 1,
              });
            }
            console.log(`Added ${effect.value || 1} ${effect.counter} counter(s) to ${habitatZone.name}`);
          } else {
            console.log('No habitat zone to apply counters to');
          }
        } else {
          // Other counters (Burn, Freeze, etc.) go on the beast itself
          if (!source.counters) {
            source.counters = [];
          }
          const existingCounter = source.counters.find((c: any) => c.type === effect.counter);
          if (existingCounter) {
            existingCounter.amount += effect.value || 1;
          } else {
            source.counters.push({
              type: effect.counter,
              amount: effect.value || 1,
            });
          }
          console.log(`Added ${effect.value || 1} ${effect.counter} counter(s) to ${source.name}`);
        }
        break;

      default:
        console.log(`Unknown effect type: ${effect.type}`);
    }
  }

  /**
   * Process a magic card effect
   */
  private processMagicEffect(effect: any, player: any, opponent: any): void {
    switch (effect.type) {
      case 'deal-damage':
        const damageTarget = this.getEffectTargets(effect.target, player, opponent, effect.condition);
        damageTarget.forEach((target: any) => {
          if (target.currentHealth !== undefined) {
            // It's a beast
            target.currentHealth -= effect.value || 0;
            if (target.currentHealth <= 0) {
              // Remove dead beast
              const ownerField = target === player.field.find((b: any) => b === target)
                ? player.field
                : opponent.field;
              const owner = player.field.includes(target) ? player : opponent;
              const otherPlayer = player.field.includes(target) ? opponent : player;
              const index = ownerField.indexOf(target);
              if (index > -1) {
                // Process OnDestroy trigger before removing
                this.processOnDestroyTrigger(target, owner, otherPlayer);
                ownerField.splice(index, 1);
              }
            }
          } else if (target.health !== undefined) {
            // It's a player
            target.health -= effect.value || 0;
          }
        });
        break;

      case 'heal':
        const healTarget = this.getEffectTargets(effect.target, player, opponent, effect.condition);
        healTarget.forEach((target: any) => {
          if (target.currentHealth !== undefined && target.maxHealth !== undefined) {
            // It's a beast
            target.currentHealth = Math.min(target.maxHealth, target.currentHealth + (effect.value || 0));
          } else if (target.health !== undefined && target.maxHealth !== undefined) {
            // It's a player
            target.health = Math.min(target.maxHealth, target.health + (effect.value || 0));
          }
        });
        break;

      case 'draw-cards':
        for (let i = 0; i < (effect.value || 1); i++) {
          this.drawCard(player);
        }
        break;

      case 'destroy':
        const destroyTarget = this.getEffectTargets(effect.target, player, opponent, effect.condition);
        destroyTarget.forEach((target: any) => {
          if (target.currentHealth !== undefined) {
            // It's a beast - remove it
            const ownerField = player.field.includes(target) ? player.field : opponent.field;
            const owner = player.field.includes(target) ? player : opponent;
            const otherPlayer = player.field.includes(target) ? opponent : player;
            const index = ownerField.indexOf(target);
            if (index > -1) {
              // Process OnDestroy trigger before removing
              this.processOnDestroyTrigger(target, owner, otherPlayer);
              ownerField.splice(index, 1);
            }
          }
        });
        break;

      case 'modify-stats':
        const statTarget = this.getEffectTargets(effect.target, player, opponent, effect.condition);
        statTarget.forEach((target: any) => {
          if (target.currentAttack !== undefined) {
            if (effect.stat === 'attack' || effect.stat === 'both') {
              target.currentAttack += effect.value || 0;
            }
            if (effect.stat === 'health' || effect.stat === 'both') {
              target.currentHealth += effect.value || 0;
              target.maxHealth += effect.value || 0;
            }
          }
        });
        break;

      case 'gain-resource':
        // Handle resource gain effects (like NectarBlock)
        if (effect.resource === 'nectar') {
          player.currentNectar += effect.value || 1;
          console.log(`Gained ${effect.value || 1} nectar`);
        }
        break;

      case 'remove-counter':
        // Handle counter removal effects (like Cleansing Downpour)
        const removeTargets = this.getEffectTargets(effect.target, player, opponent, effect.condition);
        removeTargets.forEach((target: any) => {
          if (target.counters && Array.isArray(target.counters)) {
            if (effect.counter) {
              // Remove specific counter type
              target.counters = target.counters.filter((c: any) => c.type !== effect.counter);
              console.log(`Removed ${effect.counter} counters from ${target.name || 'target'}`);
            } else {
              // Remove all counters
              const counterCount = target.counters.length;
              target.counters = [];
              console.log(`Removed all counters from ${target.name || 'target'} (${counterCount} counters)`);
            }
          }
        });
        break;

      default:
        console.log(`Unhandled magic effect type: ${effect.type}`);
    }
  }

  /**
   * Process a habitat card effect
   */
  private processHabitatEffect(effect: any, player: any, opponent: any): void {
    // Similar to magic effects but for habitat-specific effects
    switch (effect.type) {
      case 'gain-resource':
        if (effect.resource === 'nectar') {
          player.currentNectar += effect.value || 1;
        }
        break;

      case 'modify-stats':
        // Apply stat modifications to matching affinity beasts
        if (effect.affinity) {
          player.field.forEach((beast: any) => {
            if (beast.affinity === effect.affinity) {
              if (effect.stat === 'attack' || effect.stat === 'both') {
                beast.currentAttack += effect.value || 0;
              }
              if (effect.stat === 'health' || effect.stat === 'both') {
                beast.currentHealth += effect.value || 0;
                beast.maxHealth += effect.value || 0;
              }
            }
          });
        }
        break;

      case 'draw-cards':
        for (let i = 0; i < (effect.value || 1); i++) {
          this.drawCard(player);
        }
        break;

      case 'remove-counter':
        // Handle counter removal for habitat onPlayEffects (like Ancient Forest)
        const removeTargets = this.getEffectTargets(effect.target, player, opponent, effect.condition);
        removeTargets.forEach((target: any) => {
          if (target.counters && Array.isArray(target.counters)) {
            if (effect.counter) {
              // Remove specific counter type
              target.counters = target.counters.filter((c: any) => c.type !== effect.counter);
              console.log(`Removed ${effect.counter} counters from ${target.name || 'target'}`);
            } else {
              // Remove all counters
              const counterCount = target.counters.length;
              target.counters = [];
              console.log(`Removed all counters from ${target.name || 'target'} (${counterCount} counters)`);
            }
          }
        });
        break;

      case 'deal-damage':
        // Handle damage effects for habitat onPlayEffects (like Volcanic Scar)
        const damageTargets = this.getEffectTargets(effect.target, player, opponent, effect.condition);
        damageTargets.forEach((target: any) => {
          if (target.currentHealth !== undefined) {
            // It's a beast
            target.currentHealth -= effect.value || 0;
            if (target.currentHealth <= 0) {
              // Remove dead beast
              const ownerField = player.field.includes(target) ? player.field : opponent.field;
              const owner = player.field.includes(target) ? player : opponent;
              const otherPlayer = player.field.includes(target) ? opponent : player;
              const index = ownerField.indexOf(target);
              if (index > -1) {
                // Process OnDestroy trigger before removing
                this.processOnDestroyTrigger(target, owner, otherPlayer);
                ownerField.splice(index, 1);
              }
            }
          } else if (target.health !== undefined) {
            // It's a player
            target.health -= effect.value || 0;
          }
        });
        break;

      default:
        console.log(`Unhandled habitat effect type: ${effect.type}`);
    }
  }

  /**
   * Helper to get effect targets based on target type
   */
  private getEffectTargets(targetType: string, player: any, opponent: any, condition?: any): any[] {
    let targets: any[] = [];

    switch (targetType) {
      case 'all-enemies':
        targets = [...opponent.field];
        break;
      case 'all-allies':
        targets = [...player.field];
        break;
      case 'random-enemy':
        targets = opponent.field.length > 0
          ? [opponent.field[Math.floor(Math.random() * opponent.field.length)]]
          : [];
        break;
      case 'opponent-gardener':
        targets = [opponent];
        break;
      case 'player-gardener':
        targets = [player];
        break;
      case 'all-units':
        targets = [...player.field, ...opponent.field];
        break;
      default:
        targets = [];
    }

    // Apply condition filtering if provided
    if (condition) {
      targets = targets.filter(target => this.checkCondition(target, condition));
    }

    return targets;
  }

  /**
   * Check if a target passes a condition
   */
  private checkCondition(target: any, condition: any): boolean {
    if (!condition || !condition.type) return true;

    switch (condition.type) {
      case 'affinity-matches':
        return target.affinity === condition.value;

      case 'affinity-not-matches':
        return target.affinity !== condition.value;

      case 'health-below':
        if (target.currentHealth === undefined) return false;
        const comparison = condition.comparison || 'less';
        if (comparison === 'less') {
          return target.currentHealth < (condition.value || 0);
        } else if (comparison === 'less-equal') {
          return target.currentHealth <= (condition.value || 0);
        }
        return false;

      case 'health-above':
        if (target.currentHealth === undefined) return false;
        return target.currentHealth > (condition.value || 0);

      case 'is-damaged':
        return target.currentHealth !== undefined &&
               target.maxHealth !== undefined &&
               target.currentHealth < target.maxHealth;

      case 'is-wilting':
        // Wilting = health below 50%
        if (target.currentHealth === undefined || target.maxHealth === undefined) return false;
        return target.currentHealth < (target.maxHealth / 2);

      case 'cost-above':
        return target.cost > (condition.value || 0);

      case 'cost-below':
        return target.cost < (condition.value || 0);

      case 'has-counter':
        if (!target.counters || !Array.isArray(target.counters)) return false;
        if (condition.value) {
          // Check for specific counter type
          return target.counters.some((c: any) => c.type === condition.value);
        }
        // Check if has any counters
        return target.counters.length > 0;

      default:
        console.log(`Unknown condition type: ${condition.type}`);
        return true;
    }
  }

  /**
   * Process OnSummon triggers for a beast that was just summoned
   * @param beast The beast that was summoned
   * @param owner The player who owns the beast
   * @param opponent The opponent player
   */
  private processOnSummonTrigger(beast: any, owner: any, opponent: any): void {
    if (!beast.ability) return;

    const ability = beast.ability as any;

    // Check if ability has OnSummon trigger
    if (ability.trigger === 'OnSummon') {
      console.log(`OnSummon trigger activated for ${beast.name}!`);

      // Process ability effects
      if (ability.effects && Array.isArray(ability.effects)) {
        for (const effect of ability.effects) {
          this.processAbilityEffect(effect, beast, owner, opponent);
        }
      }
    }

    // Also check for Passive abilities that apply on summon (like RemoveSummoningSickness)
    if (ability.trigger === 'Passive') {
      if (ability.effects && Array.isArray(ability.effects)) {
        for (const effect of ability.effects) {
          if (effect.type === 'remove-summoning-sickness') {
            // Remove summoning sickness immediately for Passive abilities like Quick Strike
            beast.summoningSickness = false;
            console.log(`${beast.name} can attack immediately (Passive: RemoveSummoningSickness)!`);
          }
        }
      }
    }
  }

  /**
   * Process OnAttack triggers for a beast that is attacking
   * @param beast The beast that is attacking
   * @param owner The player who owns the beast
   * @param opponent The opponent player
   */
  private processOnAttackTrigger(beast: any, owner: any, opponent: any): void {
    if (!beast.ability) return;

    const ability = beast.ability as any;

    // Check if ability has OnAttack trigger
    if (ability.trigger === 'OnAttack') {
      console.log(`OnAttack trigger activated for ${beast.name}!`);

      // Process ability effects
      if (ability.effects && Array.isArray(ability.effects)) {
        for (const effect of ability.effects) {
          this.processAbilityEffect(effect, beast, owner, opponent);
        }
      }
    }
  }

  /**
   * Process OnDamage triggers for a beast that took damage
   * @param beast The beast that took damage
   * @param owner The player who owns the beast
   * @param opponent The opponent player
   */
  private processOnDamageTrigger(beast: any, owner: any, opponent: any): void {
    if (!beast.ability) return;

    const ability = beast.ability as any;

    // Check if ability has OnDamage trigger
    if (ability.trigger === 'OnDamage') {
      console.log(`OnDamage trigger activated for ${beast.name}!`);

      // Process ability effects
      if (ability.effects && Array.isArray(ability.effects)) {
        for (const effect of ability.effects) {
          this.processAbilityEffect(effect, beast, owner, opponent);
        }
      }
    }
  }

  /**
   * Process OnDestroy triggers for a beast that is about to be destroyed
   * @param beast The beast that is being destroyed
   * @param owner The player who owns the beast
   * @param opponent The opponent player
   */
  private processOnDestroyTrigger(beast: any, owner: any, opponent: any): void {
    if (!beast.ability) return;

    const ability = beast.ability as any;

    // Check if ability has OnDestroy trigger
    if (ability.trigger === 'OnDestroy') {
      console.log(`OnDestroy trigger activated for ${beast.name}!`);

      // Process ability effects
      if (ability.effects && Array.isArray(ability.effects)) {
        for (const effect of ability.effects) {
          this.processAbilityEffect(effect, beast, owner, opponent);
        }
      }
    }
  }

  /**
   * Process StartOfTurn triggers for all beasts on the field
   * @param player The player whose turn is starting
   * @param opponent The opponent player
   */
  private processStartOfTurnTriggers(player: any, opponent: any): void {
    // Process triggers for all beasts on the player's field
    player.field.forEach((beast: any) => {
      if (!beast || !beast.ability) return;

      const ability = beast.ability as any;

      // Check if ability has StartOfTurn trigger
      if (ability.trigger === 'StartOfTurn') {
        console.log(`StartOfTurn trigger activated for ${beast.name}!`);

        // Process ability effects
        if (ability.effects && Array.isArray(ability.effects)) {
          for (const effect of ability.effects) {
            this.processAbilityEffect(effect, beast, player, opponent);
          }
        }
      }
    });
  }

  /**
   * Process EndOfTurn triggers for all beasts on the field
   * @param player The player whose turn is ending
   * @param opponent The opponent player
   */
  private processEndOfTurnTriggers(player: any, opponent: any): void {
    // Process triggers for all beasts on the player's field
    player.field.forEach((beast: any) => {
      if (!beast || !beast.ability) return;

      const ability = beast.ability as any;

      // Check if ability has EndOfTurn trigger
      if (ability.trigger === 'EndOfTurn') {
        console.log(`EndOfTurn trigger activated for ${beast.name}!`);

        // Process ability effects
        if (ability.effects && Array.isArray(ability.effects)) {
          for (const effect of ability.effects) {
            this.processAbilityEffect(effect, beast, player, opponent);
          }
        }
      }
    });
  }

  /**
   * Check and activate traps based on trigger event
   * @param defender The player whose traps might activate
   * @param attacker The player performing the action that triggers traps
   * @param triggerType The type of action that might trigger traps ('attack', 'spell', 'summon', etc.)
   */
  private checkAndActivateTraps(defender: any, attacker: any, triggerType: string): void {
    if (!defender.trapZone || defender.trapZone.length === 0) return;

    // Check each trap to see if it should activate
    for (let i = defender.trapZone.length - 1; i >= 0; i--) {
      const trap: any = defender.trapZone[i];

      // Check if trap triggers on this event type
      // For now, we'll activate traps on 'attack' events
      if (triggerType === 'attack' && trap.trigger === 'OnAttack') {
        console.log(`Trap activated: ${trap.name}!`);

        // Trigger sound effect callback
        if (this.opponentActionCallback) {
          this.opponentActionCallback('trap-activated');
        }

        // Process trap effects
        if (trap.effects && Array.isArray(trap.effects)) {
          for (const effect of trap.effects) {
            this.processMagicEffect(effect, defender, attacker);
          }
        }

        // Remove trap from zone and send to graveyard
        const activatedTrap = defender.trapZone.splice(i, 1)[0];
        defender.graveyard.push(activatedTrap);
      }
    }
  }

  /**
   * Apply stat modification effects from active buff cards
   * Called when buffs are played or when beasts are summoned
   */
  private applyStatBuffEffects(player: any): void {
    if (!player.buffZone || player.buffZone.length === 0) return;

    player.buffZone.forEach((buff: any) => {
      if (!buff.ongoingEffects) return;

      buff.ongoingEffects.forEach((effect: any) => {
        if (effect.type === 'modify-stats') {
          // Apply stat modifications to all ally beasts
          if (effect.target === 'all-allies') {
            player.field.forEach((beast: any) => {
              if (effect.stat === 'attack') {
                beast.currentAttack = (beast.baseAttack || 0) + (effect.value || 0);
              } else if (effect.stat === 'health') {
                const healthBoost = effect.value || 0;
                beast.maxHealth = (beast.baseHealth || 0) + healthBoost;
                beast.currentHealth = Math.min(beast.currentHealth + healthBoost, beast.maxHealth);
              }
            });
          }
        }
      });
    });
  }

  /**
   * Apply start-of-turn effects from active buff cards
   * Called at the beginning of each player's turn
   */
  private applyBuffStartOfTurnEffects(player: any, opponent: any): void {
    if (!player.buffZone || player.buffZone.length === 0) return;

    player.buffZone.forEach((buff: any) => {
      if (!buff.ongoingEffects) return;

      buff.ongoingEffects.forEach((effect: any) => {
        switch (effect.type) {
          case 'gain-resource':
            // Swift Wind: Gain 1 extra Nectar at start of turn
            if (effect.resource === 'nectar') {
              player.currentNectar += effect.value || 1;
              console.log(`${buff.name}: Gained ${effect.value || 1} nectar`);
            }
            break;

          case 'heal':
            // Nature's Blessing: Heal all your Beasts for 1 HP at start of turn
            if (effect.target === 'all-allies') {
              player.field.forEach((beast: any) => {
                if (beast.currentHealth < beast.maxHealth) {
                  beast.currentHealth = Math.min(beast.maxHealth, beast.currentHealth + (effect.value || 1));
                }
              });
              console.log(`${buff.name}: Healed all beasts for ${effect.value || 1} HP`);
            }
            break;
        }
      });
    });
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
    this.processEndOfTurnTriggers(player, opponent);

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
      console.log(`Deathmatch! Both players lose ${deathmatchDamage} health`);
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
    this.applyBuffStartOfTurnEffects(player, opponent);

    // Process StartOfTurn triggers for player beasts
    this.processStartOfTurnTriggers(player, opponent);

    // Reapply stat buffs to all beasts (Battle Fury, Mystic Shield)
    this.applyStatBuffEffects(player);

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

    // Apply buff card start-of-turn effects for opponent (Swift Wind, Nature's Blessing)
    this.applyBuffStartOfTurnEffects(opponent, player);

    // Process StartOfTurn triggers for opponent beasts
    this.processStartOfTurnTriggers(opponent, player);

    // Reapply stat buffs to all opponent beasts (Battle Fury, Mystic Shield)
    this.applyStatBuffEffects(opponent);

    // Remove summoning sickness from beasts that were already on the field at start of turn
    // (Don't remove from beasts that will be summoned this turn)
    opponent.field.forEach((beast: any) => {
      if (beast) {
        beast.summoningSickness = false;
        beast.usedAbilityThisTurn = false; // Reset ability usage
      }
    });

    // Simple AI: Play cards if affordable and field has space
    for (let i = opponent.hand.length - 1; i >= 0; i--) {
      const card: any = opponent.hand[i];

      if (card.cost <= opponent.currentNectar) {
        if (card.type === 'Bloom' && opponent.field.length < 3) {
          // Play Bloom card
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
            usedAbilityThisTurn: false, // Track ability usage
            // Store original card data for display (needed for unified rendering)
            type: 'Bloom',
            name: playedCard.name,
            affinity: playedCard.affinity,
            cost: playedCard.cost,
            baseAttack: playedCard.baseAttack,
            baseHealth: playedCard.baseHealth,
            ability: playedCard.ability,
          };

          opponent.field.push(beastInstance);

          // Apply buff effects to newly summoned beast
          this.applyStatBuffEffects(opponent);

          // Process OnSummon trigger
          this.processOnSummonTrigger(beastInstance, opponent, player);

          console.log(`Opponent played ${playedCard.name}`);

          // Notify action callback for sound effects
          if (this.opponentActionCallback) this.opponentActionCallback('play-card');

          // Render and delay after playing card
          if (this.renderCallback) this.renderCallback();
          await delay(1200);
        } else if (card.type === 'Magic') {
          // Play Magic card
          const playedCard: any = opponent.hand.splice(i, 1)[0];
          opponent.currentNectar -= playedCard.cost;

          // Process magic card effects immediately
          if (playedCard.effects && Array.isArray(playedCard.effects)) {
            for (const effect of playedCard.effects) {
              this.processMagicEffect(effect, opponent, player);
            }
          }

          // Magic cards go to graveyard after use
          opponent.graveyard.push(playedCard);
          console.log(`Opponent played magic card: ${playedCard.name}`);

          // Notify action callback with card details for popup
          if (this.opponentActionCallback) {
            this.opponentActionCallback(`play-magic-card:${JSON.stringify(playedCard)}`);
          }

          // Render and delay after playing card
          if (this.renderCallback) this.renderCallback();
          await delay(3500); // Longer delay to allow popup to show
        } else if (card.type === 'Trap' && opponent.trapZone.length < 3) {
          // Play Trap card
          const playedCard: any = opponent.hand.splice(i, 1)[0];
          opponent.currentNectar -= playedCard.cost;

          // Add to trap zone
          opponent.trapZone.push(playedCard);
          console.log(`Opponent set trap: ${playedCard.name}`);

          // Notify action callback with card details for popup
          if (this.opponentActionCallback) {
            this.opponentActionCallback(`play-trap-card:${JSON.stringify(playedCard)}`);
          }

          // Render and delay after playing card
          if (this.renderCallback) this.renderCallback();
          await delay(3500); // Longer delay to allow popup to show
        } else if (card.type === 'Buff' && opponent.buffZone.length < 2) {
          // Play Buff card
          const playedCard: any = opponent.hand.splice(i, 1)[0];
          opponent.currentNectar -= playedCard.cost;

          // Add to buff zone
          opponent.buffZone.push(playedCard);

          // Apply initial stat buff effects immediately (Battle Fury, Mystic Shield)
          this.applyStatBuffEffects(opponent);

          console.log(`Opponent played buff: ${playedCard.name}`);

          // Notify action callback with card details for popup
          if (this.opponentActionCallback) {
            this.opponentActionCallback(`play-buff-card:${JSON.stringify(playedCard)}`);
          }

          // Render and delay after playing card
          if (this.renderCallback) this.renderCallback();
          await delay(3500); // Longer delay to allow popup to show
        } else if (card.type === 'Habitat' && !this.currentBattle.gameState.habitatZone) {
          // Play Habitat card (only if no habitat is currently active)
          const playedCard: any = opponent.hand.splice(i, 1)[0];
          opponent.currentNectar -= playedCard.cost;

          // Set habitat zone
          this.currentBattle.gameState.habitatZone = playedCard;

          // Process on-play effects
          if (playedCard.onPlayEffects && Array.isArray(playedCard.onPlayEffects)) {
            for (const effect of playedCard.onPlayEffects) {
              this.processHabitatEffect(effect, opponent, player);
            }
          }

          console.log(`Opponent played habitat: ${playedCard.name}`);

          // Notify action callback with card details for popup
          if (this.opponentActionCallback) {
            this.opponentActionCallback(`play-habitat-card:${JSON.stringify(playedCard)}`);
          }

          // Render and delay after playing card
          if (this.renderCallback) this.renderCallback();
          await delay(3500); // Longer delay to allow popup to show
        }
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

            // Process OnAttack trigger for the attacker
            this.processOnAttackTrigger(beast, opponent, player);

            // Notify action callback with detailed attack info
            if (this.opponentActionCallback) {
              this.opponentActionCallback(`attack-beast-opponent-${index}-player-${targetIndex}`);
            }

            // Deal damage to each other
            const opponentBeastDamage = beast.currentAttack || 0;
            const playerBeastDamage = target.currentAttack || 0;

            target.currentHealth -= opponentBeastDamage;
            beast.currentHealth -= playerBeastDamage;

            // Process OnDamage triggers for beasts that took damage
            if (opponentBeastDamage > 0) {
              this.processOnDamageTrigger(target, player, opponent);
            }
            if (playerBeastDamage > 0) {
              this.processOnDamageTrigger(beast, opponent, player);
            }

            // Remove dead beasts
            if (target.currentHealth <= 0) {
              // Process OnDestroy trigger before removing
              this.processOnDestroyTrigger(target, player, opponent);
              player.field.splice(targetIndex, 1);
              console.log(`${target.name} was defeated!`);
            }
            if (beast.currentHealth <= 0) {
              // Process OnDestroy trigger before removing
              this.processOnDestroyTrigger(beast, opponent, player);
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

          // Process OnAttack trigger for the attacker
          this.processOnAttackTrigger(beast, opponent, player);

          const previousHealth = player.health;
          player.health -= damage;
          console.log(`Opponent's ${beast.name} attacks you directly for ${damage} damage!`);

          // Check if player health dropped below 10% threshold
          const healthPercentage = (player.health / player.maxHealth) * 100;
          if (healthPercentage <= 10 && previousHealth > player.health && !this.playerLowHealthTriggered) {
            this.playerLowHealthTriggered = true;
            if (this.opponentActionCallback) this.opponentActionCallback('player-low-health');
          }

          // Notify action callback with detailed attack info (opponent attacking player health)
          if (this.opponentActionCallback) {
            this.opponentActionCallback(`attack-player-opponent-${index}`);
          }

          // Render and delay after direct attack
          if (this.renderCallback) this.renderCallback();
          await delay(1000);

          // Check if player health reached 0 - end battle immediately
          if (player.health <= 0) {
            this.endBattle();
            return; // Stop opponent turn processing
          }
        }
      }
    }

    // Process EndOfTurn triggers for opponent beasts before ending turn
    this.processEndOfTurnTriggers(opponent, player);

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
    this.playerLowHealthTriggered = false; // Reset low health flag
  }
}