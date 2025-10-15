/**
 * Generates human-readable descriptions for all card types
 * (Magic, Trap, Buff, Habitat, and Bloom cards)
 */

import {
  MagicCard,
  TrapCard,
  BuffCard,
  HabitatCard,
  BloomBeastCard,
  TrapTrigger
} from '../types/core';
import {
  AbilityEffect,
  EffectType,
  AbilityTarget,
  StatType,
  EffectDuration,
  HealValueType,
  ImmunityType,
  ResourceType,
  ConditionType,
  Comparison
} from '../types/abilities';
import { getAbilityDescription } from './getAbilityDescription';

/**
 * Get description for any card type
 */
export function getCardDescription(card: any): string {
  if (!card) return '';

  // Debug logging
  console.log('[getCardDescription] Card:', {
    name: card.name,
    type: card.type,
    hasEffects: !!card.effects,
    hasAbilities: !!card.abilities,
    hasOngoingEffects: !!card.ongoingEffects,
    hasActivation: !!card.activation
  });

  // Handle Bloom cards (have abilities array)
  if (card.type === 'Bloom' && card.abilities && Array.isArray(card.abilities)) {
    // Generate descriptions for all abilities and combine them
    const abilityDescriptions = card.abilities.map((ability: any) => getAbilityDescription(ability));
    // Combine ability descriptions with bullet points if multiple
    if (abilityDescriptions.length === 0) {
      return '';
    } else if (abilityDescriptions.length === 1) {
      return abilityDescriptions[0];
    } else {
      // Multiple abilities: join with bullet points
      return abilityDescriptions.map((desc: string) => `• ${desc}`).join(' ');
    }
  }

  // Handle Magic cards
  if (card.type === 'Magic' && card.effects) {
    const desc = generateMagicCardDescription(card as MagicCard);
    console.log('[getCardDescription] Magic description:', desc);
    return desc;
  }

  // Handle Trap cards
  if (card.type === 'Trap' && card.effects) {
    const desc = generateTrapCardDescription(card as TrapCard);
    console.log('[getCardDescription] Trap description:', desc);
    return desc;
  }

  // Handle Buff cards
  if (card.type === 'Buff' && card.ongoingEffects) {
    const desc = generateBuffCardDescription(card as BuffCard);
    console.log('[getCardDescription] Buff description:', desc);
    return desc;
  }

  // Handle Habitat cards
  if (card.type === 'Habitat') {
    const desc = generateHabitatCardDescription(card as HabitatCard);
    console.log('[getCardDescription] Habitat description:', desc);
    return desc;
  }

  // Fallback: return card description if it exists, otherwise empty
  console.log('[getCardDescription] Fallback, no description generated');
  return card.description || '';
}

/**
 * Generate description for Magic cards
 */
function generateMagicCardDescription(card: MagicCard): string {
  if (!card.effects || card.effects.length === 0) {
    return '';
  }

  const effectTexts = card.effects.map(effect => getEffectText(effect));
  return combineEffects(effectTexts);
}

/**
 * Generate description for Trap cards
 */
function generateTrapCardDescription(card: TrapCard): string {
  const parts: string[] = [];

  // Add trigger context
  if (card.activation?.trigger) {
    const triggerText = getTrapTriggerText(card.activation.trigger);
    if (triggerText) {
      parts.push(triggerText);
    }
  }

  // Add effects
  if (card.effects && card.effects.length > 0) {
    const effectTexts = card.effects.map(effect => getEffectText(effect));
    const combined = combineEffects(effectTexts);
    parts.push(combined);
  }

  return parts.join(' ');
}

/**
 * Generate description for Buff cards
 */
function generateBuffCardDescription(card: BuffCard): string {
  if (!card.ongoingEffects || card.ongoingEffects.length === 0) {
    return '';
  }

  const parts: string[] = [];

  // Buff cards have ongoing effects while on field
  parts.push('While active:');

  const effectTexts = card.ongoingEffects.map(effect => getEffectText(effect));
  const combined = combineEffects(effectTexts);
  parts.push(combined);

  return parts.join(' ');
}

/**
 * Generate description for Habitat cards
 */
function generateHabitatCardDescription(card: HabitatCard): string {
  const parts: string[] = [];

  // On play effects
  if (card.onPlayEffects && card.onPlayEffects.length > 0) {
    parts.push('When played:');
    const playEffects = card.onPlayEffects.map(effect => getEffectText(effect));
    parts.push(combineEffects(playEffects));
  }

  // Ongoing effects
  if (card.ongoingEffects && card.ongoingEffects.length > 0) {
    if (parts.length > 0) {
      parts.push('•');
    }
    parts.push('While active:');
    const ongoingEffects = card.ongoingEffects.map(effect => getEffectText(effect));
    parts.push(combineEffects(ongoingEffects));
  }

  return parts.join(' ');
}

/**
 * Get trap trigger text
 */
function getTrapTriggerText(trigger: TrapTrigger): string {
  switch (trigger) {
    case TrapTrigger.OnAttack:
      return 'When opponent attacks,';
    case TrapTrigger.OnBloomPlay:
      return 'When opponent plays Bloom,';
    case TrapTrigger.OnMagicPlay:
      return 'When opponent plays Magic,';
    case TrapTrigger.OnHabitatPlay:
      return 'When opponent plays Habitat,';
    case TrapTrigger.OnAbilityUse:
      return 'When opponent uses ability,';
    case TrapTrigger.OnDamage:
      return 'When you take damage,';
    case TrapTrigger.OnDestroy:
      return 'When your unit is destroyed,';
    case TrapTrigger.OnDraw:
      return 'When opponent draws,';
    case TrapTrigger.OnHeal:
      return 'When opponent heals,';
    default:
      return '';
  }
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
      return 'all your Beasts';
    case AbilityTarget.AllEnemies:
      return 'all enemy Beasts';
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
      return condition.value ? `if ${condition.value}` : '';
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
      const conditionPart = condition ? ` ${condition}` : '';
      return `${target} get${target === 'this' || target === 'you' ? 's' : ''} ${sign}${effect.value} ${stat}${conditionPart}${durationPart}`;
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
      if (mod === 'attack-first') return 'strike first (defender cannot counter if killed)';
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

    case EffectType.NullifyEffect: {
      return `counter ${target}`;
    }

    case EffectType.DiscardCards: {
      return `discard ${effect.value} card${effect.value > 1 ? 's' : ''}`;
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
