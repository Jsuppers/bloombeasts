/**
 * Combat Helper Utilities
 */

import { RuntimeBeast, GameState } from '../types/game';
import { AbilityEffect } from '../types/abilities';
import { Logger } from './Logger';
import { getAllBeasts, getAliveBeasts } from './fieldUtils';

/**
 * Calculate damage after applying modifiers
 */
export function calculateDamage(
  baseDamage: number,
  attacker: RuntimeBeast,
  defender: RuntimeBeast
): number {
  let damage = baseDamage;

  // Check for damage amplification on attacker (from statusEffects)
  const ampEffect = attacker.statusEffects?.find(e => e.type === 'damage-amp');
  if (ampEffect) {
    damage = Math.floor(damage * (ampEffect.value || 1));
  }

  // Check for attack modification abilities on attacker
  if (attacker.abilities) {
    for (const ability of attacker.abilities) {
      if ('trigger' in ability && ability.trigger === 'WhileOnField' && 'effects' in ability && ability.effects) {
        for (const effect of ability.effects) {
          if (effect.type === 'attack-modification' && 'modification' in effect) {
            const mod = effect.modification;
            if (mod === 'double-damage') {
              damage *= 2;
            } else if (mod === 'triple-damage') {
              damage *= 3;
            } else if (mod === 'piercing') {
              // Piercing damage ignores damage reduction (handled below)
            }
          }
        }
      }
    }
  }

  // Check for damage reduction on defender (from statusEffects)
  const reduction = defender.statusEffects?.find(e => e.type === 'damage-reduction');
  if (reduction) {
    damage = Math.max(0, damage - (reduction.value || 0));
  }

  // Check for damage reduction from WhileOnField abilities
  let totalReduction = 0;
  let isPiercing = false;

  // Check if attacker has piercing
  if (attacker.abilities) {
    for (const ability of attacker.abilities) {
      if ('trigger' in ability && ability.trigger === 'WhileOnField' && 'effects' in ability && ability.effects) {
        for (const effect of ability.effects) {
          if (effect.type === 'attack-modification' && 'modification' in effect && effect.modification === 'piercing') {
            isPiercing = true;
          }
        }
      }
    }
  }

  // Only apply damage reduction if not piercing
  if (!isPiercing && defender.abilities) {
    for (const ability of defender.abilities) {
      if ('trigger' in ability && ability.trigger === 'WhileOnField' && 'effects' in ability && ability.effects) {
        for (const effect of ability.effects) {
          if (effect.type === 'damage-reduction' && 'value' in effect) {
            totalReduction += effect.value || 0;
          }
        }
      }
    }
    damage = Math.max(0, damage - totalReduction);
  }

  return damage;
}

/**
 * Check if a beast can attack
 */
export function canAttack(beast: RuntimeBeast): boolean {
  // Check summoning sickness (unless removed by ability)
  let hasSummoningSickness = beast.summoningSickness;

  // Check for RemoveSummoningSickness abilities
  if (beast.abilities && hasSummoningSickness) {
    for (const ability of beast.abilities) {
      if ('trigger' in ability && ability.trigger === 'WhileOnField' && 'effects' in ability && ability.effects) {
        for (const effect of ability.effects) {
          if (effect.type === 'remove-summoning-sickness') {
            hasSummoningSickness = false;
          }
        }
      }
    }
  }

  if (hasSummoningSickness) {
    return false;
  }

  // Check attack prevention effects from statusEffects
  const preventAttack = beast.statusEffects?.find(e => e.type === 'prevent-attack');
  if (preventAttack) {
    return false;
  }

  // Check for preventions from abilities
  if (beast.preventions) {
    const hasAttackPrevention = beast.preventions.some(p => p.type === 'prevent-attack');
    if (hasAttackPrevention) {
      return false;
    }
  }

  return true;
}

/**
 * Check if any beasts in a field can attack
 */
export function hasAttackableBeasts(field: (RuntimeBeast | null)[]): boolean {
  if (!field) return false;

  for (const beast of field) {
    if (beast && canAttack(beast)) {
      return true;
    }
  }

  return false;
}

/**
 * Get valid attack targets for a beast
 */
export function getValidTargets(
  attacker: RuntimeBeast,
  gameState: GameState,
  attackerPlayer: number
): RuntimeBeast[] {
  const opponentPlayer = attackerPlayer === 0 ? 1 : 0;
  const opponent = gameState.players[opponentPlayer];

  const targets: RuntimeBeast[] = [];

  // Check for taunt effects
  const allOpponentBeasts = getAllBeasts(opponent.field);
  const taunters = allOpponentBeasts.filter(b =>
    b.statusEffects?.some(e => e.type === 'taunt')
  );

  if (taunters.length > 0) {
    return taunters;
  }

  // Otherwise all alive opponent beasts are valid targets
  return getAliveBeasts(opponent.field);
}

/**
 * Check if a beast has a specific ability effect
 */
export function hasAbilityEffect(
  beast: RuntimeBeast,
  effectType: string
): boolean {
  return beast.statusEffects?.some(e => e.type === effectType) || false;
}

/**
 * Apply a status effect to a beast
 */
export function applyStatusEffect(
  beast: RuntimeBeast,
  effect: AbilityEffect
): void {
  if (!beast.statusEffects) {
    beast.statusEffects = [];
  }

  // Check for immunity
  if (hasAbilityEffect(beast, 'immunity')) {
    Logger.debug(`${beast.id} is immune to status effects`);
    return;
  }

  beast.statusEffects.push({
    type: effect.type,
    value: 'value' in effect ? effect.value : undefined,
    duration: 'duration' in effect ? effect.duration : undefined,
    turnsRemaining: 'duration' in effect && effect.duration ? getEffectDuration(effect.duration) : undefined,
  });
}

/**
 * Get effect duration in turns
 */
function getEffectDuration(duration: string): number {
  switch (duration) {
    case 'end-of-turn':
      return 1;
    case 'start-of-next-turn':
      return 1;
    case 'next-attack':
      return -1; // Special handling needed
    case 'permanent':
      return 999;
    case 'while-on-field':
      return 999;
    default:
      return 1;
  }
}

/**
 * Remove expired status effects
 */
export function cleanupStatusEffects(beast: RuntimeBeast): void {
  if (!beast.statusEffects) return;

  beast.statusEffects = beast.statusEffects.filter(effect => {
    if (effect.turnsRemaining === undefined) return true;
    return effect.turnsRemaining > 0;
  });
}

/**
 * Decrease status effect durations
 */
export function tickStatusEffects(beast: RuntimeBeast): void {
  if (!beast.statusEffects) return;

  beast.statusEffects.forEach(effect => {
    if (effect.turnsRemaining !== undefined && effect.turnsRemaining > 0) {
      effect.turnsRemaining--;
    }
  });
}


