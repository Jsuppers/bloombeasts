/**
 * Generates human-readable descriptions from ability effects
 */

import {
  StructuredAbility,
  AbilityEffect,
  EffectType,
  AbilityTarget,
  AbilityTrigger,
  StatType,
  EffectDuration,
  HealValueType,
  ImmunityType,
  ResourceType,
  ConditionType,
  Comparison
} from '../types/abilities';

/**
 * Generate a complete description from a StructuredAbility
 */
export function generateAbilityDescription(ability: StructuredAbility): string {
  // Handle edge cases
  if (!ability) {
    return '';
  }

  const parts: string[] = [];

  // Add trigger context
  const triggerText = getTriggerText(ability.trigger);
  if (triggerText) {
    parts.push(triggerText);
  }

  // Add cost if present
  if (ability.cost) {
    const costText = getCostText(ability.cost);
    if (costText) {
      parts.push(costText);
    }
  }

  // Generate effect descriptions
  if (ability.effects && ability.effects.length > 0) {
    const effectTexts = ability.effects.map(effect => getEffectText(effect));
    const combinedEffects = combineEffects(effectTexts);
    parts.push(combinedEffects);
  }

  // Add usage limitations
  if (ability.maxUsesPerTurn) {
    parts.push(`(${ability.maxUsesPerTurn}x per turn)`);
  }
  if (ability.maxUsesPerGame) {
    parts.push(`(once per game)`);
  }

  // If no parts were generated, at least return the ability name
  if (parts.length === 0) {
    return ability.name || '';
  }

  return parts.join(' ').replace(/\s+/g, ' ').trim();
}

/**
 * Get trigger prefix text
 */
function getTriggerText(trigger?: AbilityTrigger): string {
  switch (trigger) {
    case AbilityTrigger.OnSummon:
      return 'When summoned,';
    case AbilityTrigger.OnAllySummon:
      return 'When you summon another ally,';
    case AbilityTrigger.OnAttack:
      return 'When attacking,';
    case AbilityTrigger.OnDamage:
      return 'When attacked,';
    case AbilityTrigger.OnDestroy:
      return 'When destroyed,';
    case AbilityTrigger.StartOfTurn:
      return 'At turn start,';
    case AbilityTrigger.EndOfTurn:
      return 'At turn end,';
    case AbilityTrigger.Passive:
      return '';
    case AbilityTrigger.Activated:
      return '';
    default:
      return '';
  }
}

/**
 * Get cost text
 */
function getCostText(cost: any): string {
  if (cost.type === 'nectar') {
    return `Pay ${cost.value} Nectar:`;
  }
  if (cost.type === 'discard') {
    return `Discard ${cost.value} card${cost.value > 1 ? 's' : ''}:`;
  }
  if (cost.type === 'sacrifice') {
    return `Sacrifice ${cost.value} unit${cost.value > 1 ? 's' : ''}:`;
  }
  if (cost.type === 'remove-counter') {
    return `Remove ${cost.value} ${cost.counter} counter${cost.value > 1 ? 's' : ''}:`;
  }
  return '';
}

/**
 * Get target text
 */
function getTargetText(target: AbilityTarget): string {
  switch (target) {
    case AbilityTarget.Self:
      return 'this';
    case AbilityTarget.Target:
      return 'target';
    case AbilityTarget.Attacker:
      return 'attacker';
    case AbilityTarget.AllAllies:
      return 'all allies';
    case AbilityTarget.AllEnemies:
      return 'all enemies';
    case AbilityTarget.AdjacentAllies:
      return 'adjacent allies';
    case AbilityTarget.AdjacentEnemies:
      return 'adjacent enemies';
    case AbilityTarget.OpponentGardener:
      return 'opponent';
    case AbilityTarget.PlayerGardener:
      return 'you';
    case AbilityTarget.RandomEnemy:
      return 'random enemy';
    case AbilityTarget.AllUnits:
      return 'all Beasts';
    case AbilityTarget.OtherAlly:
      return 'another ally';
    default:
      return target;
  }
}

/**
 * Get duration text
 */
function getDurationText(duration?: EffectDuration): string {
  switch (duration) {
    case EffectDuration.Permanent:
      return 'permanently';
    case EffectDuration.EndOfTurn:
      return 'until end of turn';
    case EffectDuration.StartOfNextTurn:
      return 'until your next turn';
    case EffectDuration.WhileOnField:
      return '';
    case EffectDuration.ThisTurn:
      return 'this turn';
    case EffectDuration.NextAttack:
      return 'for next attack';
    default:
      return '';
  }
}

/**
 * Get condition text
 */
function getConditionText(condition?: any): string {
  if (!condition) return '';

  switch (condition.type) {
    case ConditionType.IsDamaged:
      return 'if damaged';
    case ConditionType.IsWilting:
      return 'if Wilting';
    case ConditionType.AffinityMatches:
      return `if ${condition.value}`;
    case ConditionType.HealthBelow:
      return `if HP < ${condition.value}`;
    case ConditionType.CostAbove:
      return `if Cost ${condition.value}+`;
    default:
      return '';
  }
}

/**
 * Get effect text for a single effect
 */
function getEffectText(effect: AbilityEffect): string {
  const target = getTargetText(effect.target);
  const condition = getConditionText(effect.condition);
  const duration = getDurationText(effect.duration);

  switch (effect.type) {
    case EffectType.ModifyStats: {
      const stat = effect.stat === StatType.Attack ? 'ATK' :
                   effect.stat === StatType.Health ? 'HP' : 'ATK/HP';
      const sign = effect.value >= 0 ? '+' : '';
      const durationPart = duration ? ` ${duration}` : '';
      return `${target} get${target === 'this' ? 's' : ''} ${sign}${effect.value} ${stat}${durationPart}`;
    }

    case EffectType.DealDamage: {
      return `deal ${effect.value} damage to ${target}`;
    }

    case EffectType.Heal: {
      if (effect.value === HealValueType.Full) {
        return `fully heal ${target}`;
      }
      return `heal ${target} by ${effect.value} HP`;
    }

    case EffectType.DrawCards: {
      return `draw ${effect.value} card${effect.value > 1 ? 's' : ''}`;
    }

    case EffectType.ApplyCounter: {
      return `place ${effect.value} ${effect.counter} counter${effect.value > 1 ? 's' : ''} on ${target}`;
    }

    case EffectType.RemoveCounter: {
      if (effect.counter) {
        return `remove ${effect.counter} counters from ${target}`;
      }
      return `remove all counters from ${target}`;
    }

    case EffectType.CannotBeTargeted: {
      const byWhat = effect.by.join(', ').replace(/,([^,]*)$/, ' or$1');
      return `cannot be targeted by ${byWhat}`;
    }

    case EffectType.Immunity: {
      const immunities = effect.immuneTo.map(type => {
        switch (type) {
          case ImmunityType.Magic: return 'Magic';
          case ImmunityType.Trap: return 'Trap';
          case ImmunityType.Abilities: return 'abilities';
          case ImmunityType.NegativeEffects: return 'negative effects';
          case ImmunityType.Damage: return 'damage';
          default: return type;
        }
      }).join(' and ');
      return `immune to ${immunities}`;
    }

    case EffectType.AttackModification: {
      const mod = effect.modification;
      if (mod === 'double-damage') return 'deal double damage';
      if (mod === 'triple-damage') return 'deal triple damage';
      if (mod === 'instant-destroy') return 'instantly destroy target';
      if (mod === 'attack-twice') return 'attack twice';
      if (mod === 'attack-first') return 'attack first';
      if (mod === 'cannot-counterattack') return 'cannot be counterattacked';
      if (mod === 'piercing') return 'ignore defensive abilities';
      return mod;
    }

    case EffectType.RemoveSummoningSickness: {
      return 'can attack immediately';
    }

    case EffectType.GainResource: {
      if (effect.resource === ResourceType.Nectar) {
        return `gain ${effect.value} Nectar${duration ? ` ${duration}` : ''}`;
      }
      if (effect.resource === ResourceType.ExtraNectarPlay) {
        return `play ${effect.value} additional Nectar Card${effect.value > 1 ? 's' : ''}${duration ? ` ${duration}` : ''}`;
      }
      return `gain ${effect.value} ${effect.resource}`;
    }

    case EffectType.MoveUnit: {
      if (effect.destination === 'any-slot') {
        return 'move to any empty slot';
      }
      if (effect.destination === 'adjacent-slot') {
        return 'move to adjacent empty slot';
      }
      return 'move';
    }

    case EffectType.PreventAttack: {
      return `${target} cannot attack${duration ? ` ${duration}` : ''}`;
    }

    case EffectType.PreventAbilities: {
      return `${target} cannot use abilities${duration ? ` ${duration}` : ''}`;
    }

    case EffectType.SearchDeck: {
      const what = effect.searchFor === 'any' ? 'any card' :
                   effect.searchFor === 'bloom' ? 'Bloom Card' : effect.searchFor;
      return `search deck for ${effect.quantity} ${what}`;
    }

    case EffectType.DamageReduction: {
      return `reduce damage by ${effect.value}${duration ? ` ${duration}` : ''}`;
    }

    case EffectType.Retaliation: {
      if (effect.value === 'reflected') {
        return 'reflect all damage to attacker';
      }
      return `deal ${effect.value} damage to attacker`;
    }

    case EffectType.TemporaryHP: {
      return `${target} gain${target === 'this' ? 's' : ''} ${effect.value} temporary HP`;
    }

    case EffectType.SwapPositions: {
      return `swap ${target} positions`;
    }

    case EffectType.ReturnToHand: {
      return `return ${target} to hand`;
    }

    case EffectType.Destroy: {
      const conditionText = condition ? ` ${condition}` : '';
      return `destroy ${target}${conditionText}`;
    }

    default:
      return effect.type;
  }
}

/**
 * Combine multiple effect texts intelligently
 */
function combineEffects(effects: string[]): string {
  if (effects.length === 0) return '';
  if (effects.length === 1) return effects[0];
  if (effects.length === 2) return `${effects[0]} and ${effects[1]}`;

  // Multiple effects: use commas and "and" for last one
  const allButLast = effects.slice(0, -1).join(', ');
  const last = effects[effects.length - 1];
  return `${allButLast}, and ${last}`;
}
