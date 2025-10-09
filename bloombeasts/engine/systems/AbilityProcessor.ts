/**
 * Ability Processor - Executes ability effects in the game
 */

import { BloomBeastInstance } from '../types/leveling';
import { GameState, Player } from '../types/game';
import { BloomBeastCard, Counter, CounterType } from '../types/core';
import {
  AbilityEffect,
  AbilityTarget,
  EffectDuration,
  AbilityCondition,
  StructuredAbility,
  StatModificationEffect,
  DamageEffect,
  HealEffect,
  DrawCardEffect,
  ApplyCounterEffect,
  ImmunityEffect,
  CannotBeTargetedEffect,
  AttackModificationEffect,
  MoveEffect,
  ResourceGainEffect,
  PreventEffect,
  SearchDeckEffect,
  DestroyEffect,
  TemporaryHPEffect,
} from '../types/abilities';

export interface AbilityContext {
  source: BloomBeastInstance;        // The unit using the ability
  sourceCard?: BloomBeastCard;       // The card definition of the source
  trigger: string;                    // What triggered this ability
  target?: BloomBeastInstance;        // Direct target if applicable
  attacker?: BloomBeastInstance;      // Attacking unit if this is a defense trigger
  gameState: GameState;
  controllingPlayer: Player;
  opposingPlayer: Player;
}

export interface EffectResult {
  success: boolean;
  message?: string;
  modifiedState?: Partial<GameState>;
  modifiedUnits?: BloomBeastInstance[];
}

export class AbilityProcessor {
  /**
   * Process a structured ability
   */
  static processAbility(
    ability: StructuredAbility,
    context: AbilityContext
  ): EffectResult[] {
    // Check if ability can be used
    if (!this.canUseAbility(ability, context)) {
      return [{ success: false, message: 'Cannot use ability' }];
    }

    // Process each effect
    const results: EffectResult[] = [];
    for (const effect of ability.effects) {
      const result = this.processEffect(effect, context);
      results.push(result);
    }

    return results;
  }

  /**
   * Check if ability can be used
   */
  private static canUseAbility(
    ability: StructuredAbility,
    context: AbilityContext
  ): boolean {
    // Check cost
    if (ability.cost) {
      switch (ability.cost.type) {
        case 'nectar':
          if (context.controllingPlayer.currentNectar < (ability.cost.value || 1)) {
            return false;
          }
          break;
        case 'discard':
          if (context.controllingPlayer.hand.length < (ability.cost.value || 1)) {
            return false;
          }
          break;
        case 'remove-counter':
          const counter = context.gameState.habitatCounters?.find(
            c => c.type === ability.cost!.counter
          );
          if (!counter || counter.amount < (ability.cost.value || 1)) {
            return false;
          }
          break;
      }
    }

    return true;
  }

  /**
   * Process a single effect
   */
  private static processEffect(
    effect: AbilityEffect,
    context: AbilityContext
  ): EffectResult {
    // Check condition if present
    if (effect.condition && !this.checkCondition(effect.condition, context)) {
      return { success: false, message: 'Condition not met' };
    }

    // Get targets
    const targets = this.resolveTargets(effect.target, context);
    if (targets.length === 0 && effect.target !== 'opponent-gardener' && effect.target !== 'player-gardener') {
      return { success: false, message: 'No valid targets' };
    }

    // Process based on effect type
    switch (effect.type) {
      case 'modify-stats':
        return this.processStatModification(effect as StatModificationEffect, targets, context);
      case 'deal-damage':
        return this.processDamage(effect as DamageEffect, targets, context);
      case 'heal':
        return this.processHeal(effect as HealEffect, targets, context);
      case 'draw-cards':
        return this.processDrawCards(effect as DrawCardEffect, context);
      case 'apply-counter':
        return this.processApplyCounter(effect as ApplyCounterEffect, targets, context);
      case 'immunity':
        return this.processImmunity(effect as ImmunityEffect, targets, context);
      case 'cannot-be-targeted':
        return this.processCannotBeTargeted(effect as CannotBeTargetedEffect, targets, context);
      case 'attack-modification':
        return this.processAttackModification(effect as AttackModificationEffect, context);
      case 'move-unit':
        return this.processMoveUnit(effect as MoveEffect, targets, context);
      case 'gain-resource':
        return this.processResourceGain(effect as ResourceGainEffect, context);
      case 'prevent-attack':
      case 'prevent-abilities':
        return this.processPrevent(effect as PreventEffect, targets, context);
      case 'search-deck':
        return this.processSearchDeck(effect as SearchDeckEffect, context);
      case 'destroy':
        return this.processDestroy(effect as DestroyEffect, targets, context);
      case 'temporary-hp':
        return this.processTemporaryHP(effect as TemporaryHPEffect, targets, context);
      default:
        return { success: false, message: 'Unknown effect type' };
    }
  }

  /**
   * Resolve targets based on target type
   */
  private static resolveTargets(
    targetType: AbilityTarget,
    context: AbilityContext
  ): BloomBeastInstance[] {
    const targets: BloomBeastInstance[] = [];

    switch (targetType) {
      case 'self':
        targets.push(context.source);
        break;
      case 'target':
        if (context.target) targets.push(context.target);
        break;
      case 'attacker':
        if (context.attacker) targets.push(context.attacker);
        break;
      case 'all-allies':
        targets.push(...context.controllingPlayer.field.filter(u => u !== null) as BloomBeastInstance[]);
        break;
      case 'all-enemies':
        targets.push(...context.opposingPlayer.field.filter(u => u !== null) as BloomBeastInstance[]);
        break;
      case 'adjacent-allies':
        const sourceIndex = context.source.slotIndex;
        if (sourceIndex > 0 && context.controllingPlayer.field[sourceIndex - 1]) {
          targets.push(context.controllingPlayer.field[sourceIndex - 1]!);
        }
        if (sourceIndex < 4 && context.controllingPlayer.field[sourceIndex + 1]) {
          targets.push(context.controllingPlayer.field[sourceIndex + 1]!);
        }
        break;
      case 'adjacent-enemies':
        const adjacentIndices = [context.source.slotIndex - 1, context.source.slotIndex, context.source.slotIndex + 1]
          .filter(i => i >= 0 && i < 5);
        for (const idx of adjacentIndices) {
          if (context.opposingPlayer.field[idx]) {
            targets.push(context.opposingPlayer.field[idx]!);
          }
        }
        break;
      case 'random-enemy':
        const enemies = context.opposingPlayer.field.filter(u => u !== null) as BloomBeastInstance[];
        if (enemies.length > 0) {
          targets.push(enemies[Math.floor(Math.random() * enemies.length)]);
        }
        break;
      case 'damaged-enemies':
        targets.push(...context.opposingPlayer.field
          .filter(u => u !== null && u.currentHealth < u.maxHealth) as BloomBeastInstance[]);
        break;
      case 'wilting-enemies':
        targets.push(...context.opposingPlayer.field
          .filter(u => u !== null && u.currentHealth === 1) as BloomBeastInstance[]);
        break;
      case 'highest-attack-enemy':
        const highestAtk = context.opposingPlayer.field
          .filter(u => u !== null)
          .reduce((highest, current) => {
            if (!highest || (current as BloomBeastInstance).currentAttack > highest.currentAttack) {
              return current as BloomBeastInstance;
            }
            return highest;
          }, null as BloomBeastInstance | null);
        if (highestAtk) targets.push(highestAtk);
        break;
      case 'lowest-health-enemy':
        const lowestHP = context.opposingPlayer.field
          .filter(u => u !== null)
          .reduce((lowest, current) => {
            if (!lowest || (current as BloomBeastInstance).currentHealth < lowest.currentHealth) {
              return current as BloomBeastInstance;
            }
            return lowest;
          }, null as BloomBeastInstance | null);
        if (lowestHP) targets.push(lowestHP);
        break;
    }

    return targets;
  }

  /**
   * Check if a condition is met
   */
  private static checkCondition(
    condition: AbilityCondition,
    context: AbilityContext
  ): boolean {
    switch (condition.type) {
      case 'has-counter':
        return context.source.counters.some(c => c.type === condition.value);
      case 'health-below':
        return context.source.currentHealth < (condition.value as number);
      case 'health-above':
        return context.source.currentHealth > (condition.value as number);
      case 'is-damaged':
        return context.source.currentHealth < context.source.maxHealth;
      case 'is-wilting':
        return context.source.currentHealth === 1;
      default:
        return true;
    }
  }

  /**
   * Process stat modification effect
   */
  private static processStatModification(
    effect: StatModificationEffect,
    targets: BloomBeastInstance[],
    context: AbilityContext
  ): EffectResult {
    const modifiedUnits: BloomBeastInstance[] = [];

    for (const target of targets) {
      const modified = { ...target };

      if (effect.stat === 'attack' || effect.stat === 'both') {
        modified.currentAttack = Math.max(0, modified.currentAttack + effect.value);
      }

      if (effect.stat === 'health' || effect.stat === 'both') {
        modified.currentHealth = Math.min(
          modified.maxHealth,
          Math.max(0, modified.currentHealth + effect.value)
        );
        if (effect.duration === 'permanent' && effect.value > 0) {
          modified.maxHealth += effect.value;
        }
      }

      // Store duration info if not permanent
      if (effect.duration !== 'permanent') {
        modified.temporaryEffects = modified.temporaryEffects || [];
        modified.temporaryEffects.push({
          type: 'stat-mod',
          stat: effect.stat,
          value: effect.value,
          duration: effect.duration,
          turnsRemaining: effect.duration === 'end-of-turn' ? 0 : 1,
        });
      }

      modifiedUnits.push(modified);
    }

    return {
      success: true,
      modifiedUnits,
      message: `Applied stat modification to ${targets.length} unit(s)`,
    };
  }

  /**
   * Process damage effect
   */
  private static processDamage(
    effect: DamageEffect,
    targets: BloomBeastInstance[],
    context: AbilityContext
  ): EffectResult {
    const modifiedUnits: BloomBeastInstance[] = [];
    let totalDamage = 0;

    for (const target of targets) {
      const damage = effect.value === 'attack-value'
        ? context.source.currentAttack
        : effect.value;

      const modified = { ...target };
      modified.currentHealth = Math.max(0, modified.currentHealth - damage);
      totalDamage += damage;
      modifiedUnits.push(modified);
    }

    // Handle damage to gardener
    if (effect.target === 'opponent-gardener') {
      const damage = effect.value === 'attack-value'
        ? context.source.currentAttack
        : effect.value;
      return {
        success: true,
        message: `Dealt ${damage} damage to opponent Gardener`,
        modifiedState: {
          players: [
            context.gameState.players[0] === context.opposingPlayer
              ? { ...context.gameState.players[0], health: context.gameState.players[0].health - damage }
              : context.gameState.players[0],
            context.gameState.players[1] === context.opposingPlayer
              ? { ...context.gameState.players[1], health: context.gameState.players[1].health - damage }
              : context.gameState.players[1],
          ] as [Player, Player],
        },
      };
    }

    return {
      success: true,
      modifiedUnits,
      message: `Dealt ${totalDamage} total damage`,
    };
  }

  /**
   * Process heal effect
   */
  private static processHeal(
    effect: HealEffect,
    targets: BloomBeastInstance[],
    context: AbilityContext
  ): EffectResult {
    const modifiedUnits: BloomBeastInstance[] = [];

    for (const target of targets) {
      const modified = { ...target };
      if (effect.value === 'full') {
        modified.currentHealth = modified.maxHealth;
      } else {
        modified.currentHealth = Math.min(
          modified.maxHealth,
          modified.currentHealth + effect.value
        );
      }
      modifiedUnits.push(modified);
    }

    return {
      success: true,
      modifiedUnits,
      message: `Healed ${targets.length} unit(s)`,
    };
  }

  /**
   * Process draw cards effect
   */
  private static processDrawCards(
    effect: DrawCardEffect,
    context: AbilityContext
  ): EffectResult {
    // This would be implemented by the game engine
    return {
      success: true,
      message: `Draw ${effect.value} card(s)`,
      modifiedState: {
        drawCardsQueued: effect.value,
      },
    };
  }

  /**
   * Process apply counter effect
   */
  private static processApplyCounter(
    effect: ApplyCounterEffect,
    targets: BloomBeastInstance[],
    context: AbilityContext
  ): EffectResult {
    const modifiedUnits: BloomBeastInstance[] = [];

    for (const target of targets) {
      const modified = { ...target };
      const existingCounter = modified.counters.find(c => c.type === effect.counter);

      if (existingCounter) {
        existingCounter.amount += effect.value;
      } else {
        modified.counters.push({
          type: effect.counter,
          amount: effect.value,
        });
      }

      modifiedUnits.push(modified);
    }

    // Handle habitat counters
    if (effect.target === 'self' && effect.counter === 'Spore') {
      return {
        success: true,
        message: `Added ${effect.value} ${effect.counter} counter(s) to Habitat`,
        modifiedState: {
          habitatCounters: [
            ...(context.gameState.habitatCounters || []).filter(c => c.type !== 'Spore'),
            {
              type: 'Spore',
              amount: ((context.gameState.habitatCounters || []).find(c => c.type === 'Spore')?.amount || 0) + effect.value,
            },
          ],
        },
      };
    }

    return {
      success: true,
      modifiedUnits,
      message: `Applied ${effect.value} ${effect.counter} counter(s)`,
    };
  }

  /**
   * Process immunity effect
   */
  private static processImmunity(
    effect: ImmunityEffect,
    targets: BloomBeastInstance[],
    context: AbilityContext
  ): EffectResult {
    const modifiedUnits: BloomBeastInstance[] = [];

    for (const target of targets) {
      const modified = { ...target };
      modified.immunities = modified.immunities || [];
      modified.immunities.push(...effect.immuneTo);
      modifiedUnits.push(modified);
    }

    return {
      success: true,
      modifiedUnits,
      message: `Applied immunity to ${targets.length} unit(s)`,
    };
  }

  /**
   * Process cannot be targeted effect
   */
  private static processCannotBeTargeted(
    effect: CannotBeTargetedEffect,
    targets: BloomBeastInstance[],
    context: AbilityContext
  ): EffectResult {
    const modifiedUnits: BloomBeastInstance[] = [];

    for (const target of targets) {
      const modified = { ...target };
      modified.cannotBeTargetedBy = modified.cannotBeTargetedBy || [];
      modified.cannotBeTargetedBy.push(...effect.by);
      if (effect.costThreshold !== undefined) {
        modified.targetingRestrictions = modified.targetingRestrictions || {};
        modified.targetingRestrictions.costThreshold = effect.costThreshold;
      }
      modifiedUnits.push(modified);
    }

    return {
      success: true,
      modifiedUnits,
      message: `Applied targeting restrictions to ${targets.length} unit(s)`,
    };
  }

  /**
   * Process attack modification effect
   */
  private static processAttackModification(
    effect: AttackModificationEffect,
    context: AbilityContext
  ): EffectResult {
    const modified = { ...context.source };
    modified.attackModifications = modified.attackModifications || [];
    modified.attackModifications.push(effect.modification);

    return {
      success: true,
      modifiedUnits: [modified],
      message: `Applied attack modification: ${effect.modification}`,
    };
  }

  /**
   * Process move unit effect
   */
  private static processMoveUnit(
    effect: MoveEffect,
    targets: BloomBeastInstance[],
    context: AbilityContext
  ): EffectResult {
    // This would be implemented by the game engine
    return {
      success: true,
      message: `Move unit to ${effect.destination}`,
      modifiedState: {
        pendingMove: {
          unit: targets[0],
          destination: effect.destination,
        },
      },
    };
  }

  /**
   * Process resource gain effect
   */
  private static processResourceGain(
    effect: ResourceGainEffect,
    context: AbilityContext
  ): EffectResult {
    switch (effect.resource) {
      case 'nectar':
        return {
          success: true,
          message: `Gain ${effect.value} Nectar`,
          modifiedState: {
            players: [
              context.gameState.players[0] === context.controllingPlayer
                ? { ...context.gameState.players[0], currentNectar: context.gameState.players[0].currentNectar + effect.value }
                : context.gameState.players[0],
              context.gameState.players[1] === context.controllingPlayer
                ? { ...context.gameState.players[1], currentNectar: context.gameState.players[1].currentNectar + effect.value }
                : context.gameState.players[1],
            ] as [Player, Player],
          },
        };
      case 'extra-summon':
        return {
          success: true,
          message: `Gain ${effect.value} extra summon(s)`,
          modifiedState: {
            players: [
              context.gameState.players[0] === context.controllingPlayer
                ? { ...context.gameState.players[0], summonsThisTurn: Math.max(0, context.gameState.players[0].summonsThisTurn - effect.value) }
                : context.gameState.players[0],
              context.gameState.players[1] === context.controllingPlayer
                ? { ...context.gameState.players[1], summonsThisTurn: Math.max(0, context.gameState.players[1].summonsThisTurn - effect.value) }
                : context.gameState.players[1],
            ] as [Player, Player],
          },
        };
      default:
        return { success: false, message: 'Unknown resource type' };
    }
  }

  /**
   * Process prevent effect
   */
  private static processPrevent(
    effect: PreventEffect,
    targets: BloomBeastInstance[],
    context: AbilityContext
  ): EffectResult {
    const modifiedUnits: BloomBeastInstance[] = [];

    for (const target of targets) {
      const modified = { ...target };
      modified.preventions = modified.preventions || [];
      modified.preventions.push({
        type: effect.type,
        duration: effect.duration,
      });
      modifiedUnits.push(modified);
    }

    return {
      success: true,
      modifiedUnits,
      message: `Applied ${effect.type} to ${targets.length} unit(s)`,
    };
  }

  /**
   * Process search deck effect
   */
  private static processSearchDeck(
    effect: SearchDeckEffect,
    context: AbilityContext
  ): EffectResult {
    return {
      success: true,
      message: `Search deck for ${effect.quantity} ${effect.searchFor} card(s)`,
      modifiedState: {
        pendingSearch: {
          searchFor: effect.searchFor,
          quantity: effect.quantity,
          affinity: effect.affinity,
        },
      },
    };
  }

  /**
   * Process destroy effect
   */
  private static processDestroy(
    effect: DestroyEffect,
    targets: BloomBeastInstance[],
    context: AbilityContext
  ): EffectResult {
    const modifiedUnits: BloomBeastInstance[] = [];

    for (const target of targets) {
      const modified = { ...target };
      modified.currentHealth = 0;
      modifiedUnits.push(modified);
    }

    return {
      success: true,
      modifiedUnits,
      message: `Destroyed ${targets.length} unit(s)`,
    };
  }

  /**
   * Process temporary HP effect
   */
  private static processTemporaryHP(
    effect: TemporaryHPEffect,
    targets: BloomBeastInstance[],
    context: AbilityContext
  ): EffectResult {
    const modifiedUnits: BloomBeastInstance[] = [];

    for (const target of targets) {
      const modified = { ...target };
      modified.temporaryHP = (modified.temporaryHP || 0) + effect.value;
      modifiedUnits.push(modified);
    }

    return {
      success: true,
      modifiedUnits,
      message: `Added ${effect.value} temporary HP to ${targets.length} unit(s)`,
    };
  }
}