/**
 * BattleStateManager - Handles battle state and game rules
 *
 * Responsibilities:
 * - Card playing logic (validation, field management)
 * - Combat resolution (attack calculations, damage dealing)
 * - Ability and effect processing
 * - Trigger management (OnSummon, OnAttack, OnDamage, OnDestroy, StartOfTurn, EndOfTurn)
 * - Trap activation
 * - Buff and debuff application
 * - Win/loss conditions
 */

import { Player, GameState } from '../../engine/types/game';
import { Logger } from '../../engine/utils/Logger';
import { pickRandom } from '../../engine/utils/random';
import { StatModifierManager } from '../../engine/utils/StatModifierManager';
import { StatModifierSource } from '../../engine/types/leveling';

export interface PlayCardResult {
  success: boolean;
  message?: string;
  isTrap?: boolean;
}

export interface AttackResult {
  success: boolean;
  damage?: number;
  message?: string;
}

export interface AbilityResult {
  success: boolean;
  message?: string;
}

export class BattleStateManager {

  /**
   * Play a card from a player's hand
   */
  playCard(
    cardIndex: number,
    player: Player,
    opponent: Player,
    gameState: GameState
  ): PlayCardResult {
    // Validate card index
    if (cardIndex < 0 || cardIndex >= player.hand.length) {
      Logger.error(`Invalid card index: ${cardIndex}`);
      return { success: false, message: 'Invalid card index' };
    }

    const card: any = player.hand[cardIndex];

    // Check if player has enough nectar
    if (card.cost > player.currentNectar) {
      Logger.debug('Not enough nectar to play this card');
      return { success: false, message: 'Not enough nectar' };
    }

    // Handle different card types
    switch (card.type) {
      case 'Bloom':
        return this.playBloomCard(cardIndex, player, opponent);

      case 'Magic':
        return this.playMagicCard(cardIndex, player, opponent);

      case 'Trap':
        return this.playTrapCard(cardIndex, player);

      case 'Buff':
        return this.playBuffCard(cardIndex, player);

      case 'Habitat':
        return this.playHabitatCard(cardIndex, player, opponent, gameState);

      default:
        Logger.debug(`Cannot play card type: ${card.type}`);
        return { success: false, message: 'Invalid card type' };
    }
  }

  /**
   * Play a Bloom Beast card
   */
  private playBloomCard(cardIndex: number, player: Player, opponent: Player): PlayCardResult {
    // Check if field has space (max 3 beasts)
    if (player.field.length >= 3) {
      Logger.debug('Field is full');
      return { success: false, message: 'Field is full' };
    }

    const bloomCard: any = player.hand.splice(cardIndex, 1)[0];
    player.currentNectar -= bloomCard.cost;

    // Create BloomBeastInstance for the field
    const beastInstance: any = {
      cardId: bloomCard.id,
      instanceId: bloomCard.instanceId || `${bloomCard.id}-${Date.now()}`,
      currentLevel: (bloomCard as any).level || 1,
      currentXP: 0,
      baseAttack: bloomCard.baseAttack,
      baseHealth: bloomCard.baseHealth,
      currentAttack: bloomCard.baseAttack,
      currentHealth: bloomCard.baseHealth,
      maxHealth: bloomCard.baseHealth,
      counters: [],
      statusEffects: [],
      slotIndex: player.field.length,
      summoningSickness: true,
      usedAbilityThisTurn: false,
      statModifiers: [],
      // Store original card data for display
      type: 'Bloom',
      name: bloomCard.name,
      affinity: bloomCard.affinity,
      cost: bloomCard.cost,
      ability: bloomCard.abilities && bloomCard.abilities.length > 0 ? bloomCard.abilities[0] : undefined,
    };

    // Initialize stat system
    StatModifierManager.initializeStatSystem(beastInstance);

    player.field.push(beastInstance);

    // Apply buff effects and process OnSummon trigger
    this.applyStatBuffEffects(player);
    this.processOnSummonTrigger(beastInstance, player, opponent);

    Logger.debug(`Played ${bloomCard.name} - Nectar: ${player.currentNectar}`);
    return { success: true, message: `Played ${bloomCard.name}` };
  }

  /**
   * Play a Magic card
   */
  private playMagicCard(cardIndex: number, player: Player, opponent: Player): PlayCardResult {
    const magicCard: any = player.hand.splice(cardIndex, 1)[0];
    player.currentNectar -= magicCard.cost;

    // Process magic card effects immediately
    if (magicCard.effects && Array.isArray(magicCard.effects)) {
      for (const effect of magicCard.effects) {
        this.processMagicEffect(effect, player, opponent);
      }
    }

    player.graveyard.push(magicCard);

    Logger.debug(`Played magic card: ${magicCard.name}`);
    return { success: true, message: `Played ${magicCard.name}` };
  }

  /**
   * Play a Trap card
   */
  private playTrapCard(cardIndex: number, player: Player): PlayCardResult {
    // Check if trap zone has space (max 3 traps)
    if (player.trapZone.length >= 3) {
      Logger.debug('Trap zone is full');
      return { success: false, message: 'Trap zone is full' };
    }

    const trapCard: any = player.hand.splice(cardIndex, 1)[0];
    player.currentNectar -= trapCard.cost;
    player.trapZone.push(trapCard);

    Logger.debug(`Set trap: ${trapCard.name}`);
    return { success: true, message: `Set ${trapCard.name}`, isTrap: true };
  }

  /**
   * Play a Buff card
   */
  private playBuffCard(cardIndex: number, player: Player): PlayCardResult {
    // Check if buff zone has space (max 2 buffs)
    if (player.buffZone.length >= 2) {
      Logger.debug('Buff zone is full');
      return { success: false, message: 'Buff zone is full' };
    }

    const buffCard: any = player.hand.splice(cardIndex, 1)[0];
    player.currentNectar -= buffCard.cost;
    player.buffZone.push(buffCard);

    // Apply initial stat buff effects immediately
    this.applyStatBuffEffects(player);

    Logger.debug(`Played buff: ${buffCard.name}`);
    return { success: true, message: `Played ${buffCard.name}` };
  }

  /**
   * Play a Habitat card
   */
  private playHabitatCard(
    cardIndex: number,
    player: Player,
    opponent: Player,
    gameState: GameState
  ): PlayCardResult {
    const habitatCard: any = player.hand.splice(cardIndex, 1)[0];
    player.currentNectar -= habitatCard.cost;

    // Set habitat zone
    gameState.habitatZone = habitatCard;

    // Process on-play effects
    if (habitatCard.onPlayEffects && Array.isArray(habitatCard.onPlayEffects)) {
      for (const effect of habitatCard.onPlayEffects) {
        this.processHabitatEffect(effect, player, opponent);
      }
    }

    Logger.debug(`Played habitat: ${habitatCard.name}`);
    return { success: true, message: `Played ${habitatCard.name}` };
  }

  /**
   * Attack an opponent beast with a player beast
   */
  attackBeast(
    attackerIndex: number,
    targetIndex: number,
    player: Player,
    opponent: Player,
    onTrapCallback?: (trapName: string) => void
  ): AttackResult {
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
      Logger.debug('Beast has summoning sickness and cannot attack');
      return { success: false, message: 'Summoning sickness' };
    }

    Logger.debug(`${attacker.name} attacks ${target.name}!`);

    // Process OnAttack trigger
    this.processOnAttackTrigger(attacker, player, opponent);

    // Check for trap activation
    this.checkAndActivateTraps(opponent, player, 'attack', onTrapCallback);

    // Deal damage to each other
    const attackerDamage = attacker.currentAttack || 0;
    const targetDamage = target.currentAttack || 0;

    target.currentHealth -= attackerDamage;
    attacker.currentHealth -= targetDamage;

    // Process OnDamage triggers
    if (attackerDamage > 0) {
      this.processOnDamageTrigger(target, opponent, player);
    }
    if (targetDamage > 0) {
      this.processOnDamageTrigger(attacker, player, opponent);
    }

    // Remove dead beasts
    if (target.currentHealth <= 0) {
      this.processOnDestroyTrigger(target, opponent, player);
      opponent.field.splice(targetIndex, 1);
      Logger.debug(`${target.name} was defeated!`);
    }
    if (attacker.currentHealth <= 0) {
      this.processOnDestroyTrigger(attacker, player, opponent);
      player.field.splice(attackerIndex, 1);
      Logger.debug(`${attacker.name} was defeated!`);
    }

    // Mark beast as having attacked
    if (attacker.currentHealth > 0) {
      attacker.summoningSickness = true;
    }

    return { success: true, damage: attackerDamage };
  }

  /**
   * Attack opponent player directly
   */
  attackPlayer(
    attackerIndex: number,
    player: Player,
    opponent: Player,
    onTrapCallback?: (trapName: string) => void
  ): AttackResult {
    // Validate index
    if (attackerIndex < 0 || attackerIndex >= player.field.length) {
      return { success: false, message: 'Invalid attacker' };
    }

    // Can only attack player directly if opponent has no beasts
    if (opponent.field.length > 0) {
      Logger.debug('Cannot attack player directly while opponent has beasts');
      return { success: false, message: 'Must attack beasts first' };
    }

    const attacker: any = player.field[attackerIndex];

    // Check if attacker can attack
    if (attacker.summoningSickness) {
      Logger.debug('Beast has summoning sickness and cannot attack');
      return { success: false, message: 'Summoning sickness' };
    }

    const damage = attacker.currentAttack || 0;

    // Process OnAttack trigger
    this.processOnAttackTrigger(attacker, player, opponent);

    // Check for trap activation
    this.checkAndActivateTraps(opponent, player, 'attack', onTrapCallback);

    opponent.health -= damage;

    Logger.debug(`${attacker.name} attacks opponent for ${damage} damage!`);

    // Mark beast as having attacked
    attacker.summoningSickness = true;

    return { success: true, damage };
  }

  /**
   * Use a beast's ability
   */
  useAbility(
    beastIndex: number,
    player: Player,
    opponent: Player,
    gameState: GameState
  ): AbilityResult {
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
      const costResult = this.payAbilityCost(ability.cost, player, gameState);
      if (!costResult.success) {
        return costResult;
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

    Logger.debug(`Activated ability: ${ability.name}`);
    return { success: true, message: `Used ${ability.name}` };
  }

  /**
   * Pay the cost for an ability
   */
  private payAbilityCost(cost: any, player: Player, gameState: GameState): AbilityResult {
    switch (cost.type) {
      case 'nectar':
        const nectarCost = cost.value || 1;
        if (player.currentNectar < nectarCost) {
          return { success: false, message: 'Not enough nectar' };
        }
        player.currentNectar -= nectarCost;
        break;

      case 'discard':
        const discardCost = cost.value || 1;
        if (player.hand.length < discardCost) {
          return { success: false, message: 'Not enough cards to discard' };
        }
        for (let i = 0; i < discardCost; i++) {
          const card = player.hand.pop();
          if (card) player.graveyard.push(card);
        }
        break;

      case 'remove-counter':
        const habitat = gameState.habitatZone as any;
        if (!habitat || !habitat.counters || !Array.isArray(habitat.counters)) {
          return { success: false, message: 'No habitat on field' };
        }
        const counterCost = cost.value || 1;
        const removedCount = Math.min(counterCost, habitat.counters.length);
        if (removedCount < counterCost) {
          return { success: false, message: 'No counters available on habitat' };
        }
        habitat.counters.splice(0, removedCount);
        Logger.debug(`Removed ${removedCount} counter(s) from ${habitat.name}`);
        break;
    }

    return { success: true };
  }

  /**
   * Process a single ability effect
   */
  processAbilityEffect(effect: any, source: any, player: any, opponent: any): void {
    switch (effect.type) {
      case 'modify-stats':
        if (effect.target === 'self') {
          // Determine duration based on effect.duration or default to end-of-turn
          const duration = effect.duration || 'end-of-turn';
          const turnsRemaining = duration === 'end-of-turn' ? 1 : undefined;

          if (effect.stat === 'attack') {
            StatModifierManager.addModifier(
              source,
              StatModifierSource.Ability,
              source.ability?.name || 'ability',
              'attack',
              effect.value || 0,
              duration,
              turnsRemaining
            );
          } else if (effect.stat === 'health') {
            StatModifierManager.addModifier(
              source,
              StatModifierSource.Ability,
              source.ability?.name || 'ability',
              'maxHealth',
              effect.value || 0,
              duration,
              turnsRemaining
            );
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
        const damageTargets = this.getEffectTargets(effect.target, player, opponent, effect.condition);
        damageTargets.forEach((target: any) => {
          if (target.currentHealth !== undefined) {
            // It's a beast
            target.currentHealth -= effect.value || 0;
            if (target.currentHealth <= 0) {
              const ownerField = player.field.includes(target) ? player.field : opponent.field;
              const owner = player.field.includes(target) ? player : opponent;
              const otherPlayer = player.field.includes(target) ? opponent : player;
              const index = ownerField.indexOf(target);
              if (index > -1) {
                this.processOnDestroyTrigger(target, owner, otherPlayer);
                ownerField.splice(index, 1);
                Logger.debug(`${target.name} was destroyed by ${source.name}'s ability!`);
              }
            }
          } else if (target.health !== undefined) {
            // It's a player
            target.health -= effect.value || 0;
            Logger.debug(`${effect.value} damage dealt to ${target.name}`);
          }
        });
        break;

      case 'immunity':
        if (effect.target === 'self') {
          if (!source.statusEffects) source.statusEffects = [];
          const immunityEffect = {
            type: 'immunity',
            immuneTo: effect.immuneTo || 'all',
            duration: effect.duration || 'permanent'
          };
          source.statusEffects.push(immunityEffect);
          Logger.debug(`${source.name} gained immunity to ${effect.immuneTo || 'all'}`);
        }
        break;

      case 'apply-counter':
        // Handle counter application (on habitat or beasts)
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
        Logger.debug(`Added ${effect.value || 1} ${effect.counter} counter(s) to ${source.name}`);
        break;

      case 'draw-cards':
      case 'DrawCards':
        // Draw cards from deck to hand
        const abilityDrawCount = effect.value || 1;
        for (let i = 0; i < abilityDrawCount; i++) {
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
        break;

      default:
        Logger.debug(`Unknown effect type: ${effect.type}`);
    }
  }

  /**
   * Process a magic card effect
   */
  processMagicEffect(effect: any, player: any, opponent: any): void {
    switch (effect.type) {
      case 'deal-damage':
        const damageTarget = this.getEffectTargets(effect.target, player, opponent, effect.condition);
        damageTarget.forEach((target: any) => {
          if (target.currentHealth !== undefined) {
            target.currentHealth -= effect.value || 0;
            if (target.currentHealth <= 0) {
              const ownerField = player.field.includes(target) ? player.field : opponent.field;
              const owner = player.field.includes(target) ? player : opponent;
              const otherPlayer = player.field.includes(target) ? opponent : player;
              const index = ownerField.indexOf(target);
              if (index > -1) {
                this.processOnDestroyTrigger(target, owner, otherPlayer);
                ownerField.splice(index, 1);
              }
            }
          } else if (target.health !== undefined) {
            target.health -= effect.value || 0;
          }
        });
        break;

      case 'heal':
        const healTarget = this.getEffectTargets(effect.target, player, opponent, effect.condition);
        healTarget.forEach((target: any) => {
          if (target.currentHealth !== undefined && target.maxHealth !== undefined) {
            target.currentHealth = Math.min(target.maxHealth, target.currentHealth + (effect.value || 0));
          } else if (target.health !== undefined && target.maxHealth !== undefined) {
            target.health = Math.min(target.maxHealth, target.health + (effect.value || 0));
          }
        });
        break;

      case 'draw-cards':
      case 'DrawCards':
        // Draw cards from deck to hand
        const drawCount = effect.value || 1;
        for (let i = 0; i < drawCount; i++) {
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
        break;

      case 'destroy':
        const destroyTarget = this.getEffectTargets(effect.target, player, opponent, effect.condition);
        destroyTarget.forEach((target: any) => {
          if (target.currentHealth !== undefined) {
            const ownerField = player.field.includes(target) ? player.field : opponent.field;
            const owner = player.field.includes(target) ? player : opponent;
            const otherPlayer = player.field.includes(target) ? opponent : player;
            const index = ownerField.indexOf(target);
            if (index > -1) {
              this.processOnDestroyTrigger(target, owner, otherPlayer);
              ownerField.splice(index, 1);
            }
          }
        });
        break;

      case 'modify-stats':
        const statTarget = this.getEffectTargets(effect.target, player, opponent, effect.condition);
        const magicDuration = effect.duration || 'permanent';
        statTarget.forEach((target: any) => {
          if (target.currentAttack !== undefined) {
            if (effect.stat === 'attack' || effect.stat === 'both') {
              StatModifierManager.addModifier(
                target,
                StatModifierSource.Magic,
                'magic-card',
                'attack',
                effect.value || 0,
                magicDuration
              );
            }
            if (effect.stat === 'health' || effect.stat === 'both') {
              StatModifierManager.addModifier(
                target,
                StatModifierSource.Magic,
                'magic-card',
                'maxHealth',
                effect.value || 0,
                magicDuration
              );
            }
          }
        });
        break;

      case 'gain-resource':
        if (effect.resource === 'nectar') {
          player.currentNectar += effect.value || 1;
          Logger.debug(`Gained ${effect.value || 1} nectar`);
        }
        break;

      case 'remove-counter':
        const removeTargets = this.getEffectTargets(effect.target, player, opponent, effect.condition);
        removeTargets.forEach((target: any) => {
          if (target.counters && Array.isArray(target.counters)) {
            if (effect.counter) {
              target.counters = target.counters.filter((c: any) => c.type !== effect.counter);
              Logger.debug(`Removed ${effect.counter} counters from ${target.name || 'target'}`);
            } else {
              const counterCount = target.counters.length;
              target.counters = [];
              Logger.debug(`Removed all counters from ${target.name || 'target'} (${counterCount} counters)`);
            }
          }
        });
        break;

      default:
        Logger.debug(`Unhandled magic effect type: ${effect.type}`);
    }
  }

  /**
   * Process a habitat card effect
   */
  processHabitatEffect(effect: any, player: any, opponent: any): void {
    switch (effect.type) {
      case 'gain-resource':
        if (effect.resource === 'nectar') {
          player.currentNectar += effect.value || 1;
        }
        break;

      case 'modify-stats':
        if (effect.affinity) {
          player.field.forEach((beast: any) => {
            if (beast.affinity === effect.affinity) {
              const habitatDuration = effect.duration || 'while-active';
              if (effect.stat === 'attack' || effect.stat === 'both') {
                StatModifierManager.addModifier(
                  beast,
                  StatModifierSource.Habitat,
                  'habitat',
                  'attack',
                  effect.value || 0,
                  habitatDuration
                );
              }
              if (effect.stat === 'health' || effect.stat === 'both') {
                StatModifierManager.addModifier(
                  beast,
                  StatModifierSource.Habitat,
                  'habitat',
                  'maxHealth',
                  effect.value || 0,
                  habitatDuration
                );
              }
            }
          });
        }
        break;

      case 'draw-cards':
      case 'DrawCards':
        // Draw cards from deck to hand
        const habitatDrawCount = effect.value || 1;
        for (let i = 0; i < habitatDrawCount; i++) {
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
        break;

      case 'remove-counter':
        const removeTargets = this.getEffectTargets(effect.target, player, opponent, effect.condition);
        removeTargets.forEach((target: any) => {
          if (target.counters && Array.isArray(target.counters)) {
            if (effect.counter) {
              target.counters = target.counters.filter((c: any) => c.type !== effect.counter);
              Logger.debug(`Removed ${effect.counter} counters from ${target.name || 'target'}`);
            } else {
              const counterCount = target.counters.length;
              target.counters = [];
              Logger.debug(`Removed all counters from ${target.name || 'target'} (${counterCount} counters)`);
            }
          }
        });
        break;

      case 'deal-damage':
        const damageTargets = this.getEffectTargets(effect.target, player, opponent, effect.condition);
        damageTargets.forEach((target: any) => {
          if (target.currentHealth !== undefined) {
            target.currentHealth -= effect.value || 0;
            if (target.currentHealth <= 0) {
              const ownerField = player.field.includes(target) ? player.field : opponent.field;
              const owner = player.field.includes(target) ? player : opponent;
              const otherPlayer = player.field.includes(target) ? opponent : player;
              const index = ownerField.indexOf(target);
              if (index > -1) {
                this.processOnDestroyTrigger(target, owner, otherPlayer);
                ownerField.splice(index, 1);
              }
            }
          } else if (target.health !== undefined) {
            target.health -= effect.value || 0;
          }
        });
        break;

      default:
        Logger.debug(`Unhandled habitat effect type: ${effect.type}`);
    }
  }

  /**
   * Get effect targets based on target type
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
        const randomEnemy = pickRandom(opponent.field);
        targets = randomEnemy ? [randomEnemy] : [];
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
        if (target.currentHealth === undefined || target.maxHealth === undefined) return false;
        return target.currentHealth < (target.maxHealth / 2);

      case 'cost-above':
        return target.cost > (condition.value || 0);

      case 'cost-below':
        return target.cost < (condition.value || 0);

      case 'has-counter':
        if (!target.counters || !Array.isArray(target.counters)) return false;
        if (condition.value) {
          return target.counters.some((c: any) => c.type === condition.value);
        }
        return target.counters.length > 0;

      default:
        Logger.debug(`Unknown condition type: ${condition.type}`);
        return true;
    }
  }

  /**
   * Process OnSummon triggers for a beast that was just summoned
   */
  processOnSummonTrigger(beast: any, owner: any, opponent: any): void {
    if (!beast.ability) return;

    const ability = beast.ability as any;

    // Check if ability has OnSummon trigger
    if (ability.trigger === 'OnSummon') {
      Logger.debug(`OnSummon trigger activated for ${beast.name}!`);

      if (ability.effects && Array.isArray(ability.effects)) {
        for (const effect of ability.effects) {
          this.processAbilityEffect(effect, beast, owner, opponent);
        }
      }
    }

    // Also check for Passive abilities that apply on summon
    if (ability.trigger === 'Passive') {
      if (ability.effects && Array.isArray(ability.effects)) {
        for (const effect of ability.effects) {
          if (effect.type === 'remove-summoning-sickness') {
            beast.summoningSickness = false;
            Logger.debug(`${beast.name} can attack immediately (Passive: RemoveSummoningSickness)!`);
          }
        }
      }
    }
  }

  /**
   * Process OnAttack triggers for a beast that is attacking
   */
  processOnAttackTrigger(beast: any, owner: any, opponent: any): void {
    if (!beast.ability) return;

    const ability = beast.ability as any;

    if (ability.trigger === 'OnAttack') {
      Logger.debug(`OnAttack trigger activated for ${beast.name}!`);

      if (ability.effects && Array.isArray(ability.effects)) {
        for (const effect of ability.effects) {
          this.processAbilityEffect(effect, beast, owner, opponent);
        }
      }
    }
  }

  /**
   * Process OnDamage triggers for a beast that took damage
   */
  processOnDamageTrigger(beast: any, owner: any, opponent: any): void {
    if (!beast.ability) return;

    const ability = beast.ability as any;

    if (ability.trigger === 'OnDamage') {
      Logger.debug(`OnDamage trigger activated for ${beast.name}!`);

      if (ability.effects && Array.isArray(ability.effects)) {
        for (const effect of ability.effects) {
          this.processAbilityEffect(effect, beast, owner, opponent);
        }
      }
    }
  }

  /**
   * Process OnDestroy triggers for a beast that is about to be destroyed
   */
  processOnDestroyTrigger(beast: any, owner: any, opponent: any): void {
    if (!beast.ability) return;

    const ability = beast.ability as any;

    if (ability.trigger === 'OnDestroy') {
      Logger.debug(`OnDestroy trigger activated for ${beast.name}!`);

      if (ability.effects && Array.isArray(ability.effects)) {
        for (const effect of ability.effects) {
          this.processAbilityEffect(effect, beast, owner, opponent);
        }
      }
    }
  }

  /**
   * Process StartOfTurn triggers for all beasts on the field
   */
  processStartOfTurnTriggers(player: any, opponent: any): void {
    player.field.forEach((beast: any) => {
      if (!beast || !beast.ability) return;

      const ability = beast.ability as any;

      if (ability.trigger === 'StartOfTurn') {
        Logger.debug(`StartOfTurn trigger activated for ${beast.name}!`);

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
   */
  processEndOfTurnTriggers(player: any, opponent: any): void {
    player.field.forEach((beast: any) => {
      if (!beast) return;

      // Update stat modifiers (remove expired effects)
      StatModifierManager.updateEndOfTurn(beast);

      // Process ability triggers
      if (beast.ability) {
        const ability = beast.ability as any;

        if (ability.trigger === 'EndOfTurn') {
          Logger.debug(`EndOfTurn trigger activated for ${beast.name}!`);

          if (ability.effects && Array.isArray(ability.effects)) {
            for (const effect of ability.effects) {
              this.processAbilityEffect(effect, beast, player, opponent);
            }
          }
        }
      }
    });
  }

  /**
   * Check and activate traps based on trigger event
   */
  checkAndActivateTraps(
    defender: any,
    attacker: any,
    triggerType: string,
    onTrapCallback?: (trapName: string) => void
  ): void {
    if (!defender.trapZone || defender.trapZone.length === 0) return;

    for (let i = defender.trapZone.length - 1; i >= 0; i--) {
      const trap: any = defender.trapZone[i];

      if (triggerType === 'attack' && trap.trigger === 'OnAttack') {
        Logger.debug(`Trap activated: ${trap.name}!`);

        if (onTrapCallback) {
          onTrapCallback('trap-activated');
        }

        // Process trap effects
        if (trap.effects && Array.isArray(trap.effects)) {
          for (const effect of trap.effects) {
            this.processMagicEffect(effect, defender, attacker);
          }
        }

        // Remove trap from zone
        const activatedTrap = defender.trapZone.splice(i, 1)[0];
        defender.graveyard.push(activatedTrap);
      }
    }
  }

  /**
   * Apply stat modification effects from active buff cards
   * Uses the StatModifierManager to properly track buff zone modifications
   *
   * This should be called when:
   * 1. A buff is played
   * 2. A new beast is summoned (to apply existing buffs)
   * 3. A buff is removed from the buff zone
   */
  applyStatBuffEffects(player: any): void {
    // First, remove all existing buff-zone modifiers from all beasts
    player.field.forEach((beast: any) => {
      StatModifierManager.removeModifiersBySource(beast, StatModifierSource.BuffZone);
    });

    // Now apply current buff effects to all beasts
    if (!player.buffZone || player.buffZone.length === 0) return;

    player.buffZone.forEach((buff: any) => {
      if (!buff.ongoingEffects) return;

      buff.ongoingEffects.forEach((effect: any) => {
        if (effect.type === 'modify-stats' && effect.target === 'all-allies') {
          player.field.forEach((beast: any) => {
            if (effect.stat === 'attack') {
              StatModifierManager.addModifier(
                beast,
                StatModifierSource.BuffZone,
                buff.id || buff.name,
                'attack',
                effect.value || 0,
                'while-active'
              );
            } else if (effect.stat === 'health') {
              StatModifierManager.addModifier(
                beast,
                StatModifierSource.BuffZone,
                buff.id || buff.name,
                'maxHealth',
                effect.value || 0,
                'while-active'
              );
            }
          });
        }
      });
    });
  }

  /**
   * Apply start-of-turn effects from active buff cards
   */
  applyBuffStartOfTurnEffects(player: any, opponent: any): void {
    if (!player.buffZone || player.buffZone.length === 0) return;

    player.buffZone.forEach((buff: any) => {
      if (!buff.ongoingEffects) return;

      buff.ongoingEffects.forEach((effect: any) => {
        switch (effect.type) {
          case 'gain-resource':
            if (effect.resource === 'nectar') {
              player.currentNectar += effect.value || 1;
              Logger.debug(`${buff.name}: Gained ${effect.value || 1} nectar`);
            }
            break;

          case 'heal':
            if (effect.target === 'all-allies') {
              player.field.forEach((beast: any) => {
                if (beast.currentHealth < beast.maxHealth) {
                  beast.currentHealth = Math.min(beast.maxHealth, beast.currentHealth + (effect.value || 1));
                }
              });
              Logger.debug(`${buff.name}: Healed all beasts for ${effect.value || 1} HP`);
            }
            break;
        }
      });
    });
  }
}
