/**
 * Combat Helper Utilities
 */

import { BloomBeastInstance, Player, GameState } from '../types/game';
import { AbilityEffect } from '../types/abilities';
import { Logger } from './Logger';
import { FIELD_SIZE } from '../constants/gameRules';
import { getAllBeasts, getAliveBeasts } from './fieldUtils';

/**
 * Calculate damage after applying modifiers
 */
export function calculateDamage(
  baseDamage: number,
  attacker: BloomBeastInstance,
  defender: BloomBeastInstance
): number {
  let damage = baseDamage;

  // Check for damage amplification on attacker
  const ampEffect = attacker.statusEffects?.find(e => e.type === 'damage-amp');
  if (ampEffect) {
    damage = Math.floor(damage * (ampEffect.value || 1));
  }

  // Check for damage reduction on defender
  const reduction = defender.statusEffects?.find(e => e.type === 'damage-reduction');
  if (reduction) {
    damage = Math.max(0, damage - (reduction.value || 0));
  }

  return damage;
}

/**
 * Check if a beast can attack
 */
export function canAttack(beast: BloomBeastInstance): boolean {
  // Check summoning sickness
  if (beast.summoningSickness) {
    return false;
  }

  // Counter checks removed

  // Check attack prevention effects
  const preventAttack = beast.statusEffects?.find(e => e.type === 'prevent-attack');
  if (preventAttack) {
    return false;
  }

  return true;
}

/**
 * Get valid attack targets for a beast
 */
export function getValidTargets(
  attacker: BloomBeastInstance,
  gameState: GameState,
  attackerPlayer: number
): BloomBeastInstance[] {
  const opponentPlayer = attackerPlayer === 0 ? 1 : 0;
  const opponent = gameState.players[opponentPlayer];

  const targets: BloomBeastInstance[] = [];

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
  beast: BloomBeastInstance,
  effectType: string
): boolean {
  return beast.statusEffects?.some(e => e.type === effectType) || false;
}

/**
 * Apply a status effect to a beast
 */
export function applyStatusEffect(
  beast: BloomBeastInstance,
  effect: AbilityEffect
): void {
  if (!beast.statusEffects) {
    beast.statusEffects = [];
  }

  // Check for immunity
  if (hasAbilityEffect(beast, 'immunity')) {
    Logger.debug(`${beast.cardId} is immune to status effects`);
    return;
  }

  beast.statusEffects.push({
    type: effect.type,
    value: (effect as any).value,
    duration: (effect as any).duration,
    turnsRemaining: getEffectDuration((effect as any).duration),
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
export function cleanupStatusEffects(beast: BloomBeastInstance): void {
  if (!beast.statusEffects) return;

  beast.statusEffects = beast.statusEffects.filter(effect => {
    if (effect.turnsRemaining === undefined) return true;
    return effect.turnsRemaining > 0;
  });
}

/**
 * Decrease status effect durations
 */
export function tickStatusEffects(beast: BloomBeastInstance): void {
  if (!beast.statusEffects) return;

  beast.statusEffects.forEach(effect => {
    if (effect.turnsRemaining !== undefined && effect.turnsRemaining > 0) {
      effect.turnsRemaining--;
    }
  });
}

/**
 * Check if a position is adjacent
 */
export function isAdjacent(pos1: number, pos2: number): boolean {
  return Math.abs(pos1 - pos2) === 1;
}

/**
 * Get adjacent positions
 */
export function getAdjacentPositions(position: number): number[] {
  const adjacent: number[] = [];
  if (position > 0) adjacent.push(position - 1);
  if (position < FIELD_SIZE - 1) adjacent.push(position + 1);
  return adjacent;
}

/**
 * Check if player has lost (no beasts on field and no cards in hand)
 */
export function hasPlayerLost(player: Player): boolean {
  const hasFieldBeasts = getAliveBeasts(player.field).length > 0;
  const hasPlayableCards = player.hand.length > 0 || player.deck.length > 0;

  return !hasFieldBeasts && !hasPlayableCards;
}