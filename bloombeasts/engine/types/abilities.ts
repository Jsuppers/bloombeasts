/**
 * Comprehensive ability system types for Bloom Beasts
 */

import { CounterType, Affinity } from './core';

/**
 * Target types for abilities
 */
export type AbilityTarget =
  | 'self'
  | 'target'           // The target of an attack or ability
  | 'attacker'         // The unit attacking this unit
  | 'all-allies'       // All allied Bloom Beasts
  | 'all-enemies'      // All enemy Bloom Beasts
  | 'adjacent-allies'  // Adjacent allied units
  | 'adjacent-enemies' // Adjacent enemy units
  | 'opponent-gardener' // The opponent player
  | 'player-gardener'  // The controlling player
  | 'random-enemy'     // Random enemy unit
  | 'all-units'        // All units on board
  | 'damaged-enemies'  // All damaged enemy units
  | 'wilting-enemies'  // Enemy units at 1 HP
  | 'highest-attack-enemy' // Enemy with highest ATK
  | 'lowest-health-enemy'  // Enemy with lowest HP
  | 'summoned-unit'    // Unit being summoned (for global effects)
  | 'destroyed-unit'   // Unit that was just destroyed
  | 'other-ally'       // Another allied unit (not self)
  | 'attacked-enemy';  // The enemy unit that was attacked

/**
 * Duration of effects
 */
export type EffectDuration =
  | 'permanent'
  | 'end-of-turn'
  | 'start-of-next-turn'
  | 'instant'
  | 'while-on-field'   // Active while this unit is on field
  | 'next-attack'      // Until next attack
  | 'this-turn';       // Only this turn

/**
 * Types of effects
 */
export type EffectType =
  | 'modify-stats'
  | 'deal-damage'
  | 'heal'
  | 'draw-cards'
  | 'discard-cards'
  | 'apply-counter'
  | 'remove-counter'
  | 'immunity'
  | 'cannot-be-targeted'
  | 'remove-summoning-sickness'
  | 'attack-modification'
  | 'move-unit'
  | 'return-to-hand'
  | 'destroy'
  | 'gain-resource'
  | 'search-deck'
  | 'prevent-attack'
  | 'prevent-abilities'
  | 'swap-positions'
  | 'copy-ability'
  | 'nullify-effect'
  | 'redirect-damage'
  | 'temporary-hp'
  | 'damage-reduction'
  | 'retaliation';

/**
 * Condition for triggering effects
 */
export interface AbilityCondition {
  type: 'has-counter' | 'health-below' | 'health-above' | 'cost-above' |
        'cost-below' | 'affinity-matches' | 'is-damaged' | 'is-wilting' |
        'turn-count' | 'units-on-field' | 'resource-available';
  value?: number | Affinity | CounterType;
  comparison?: 'equal' | 'greater' | 'less' | 'greater-equal' | 'less-equal';
}

/**
 * Base effect interface
 */
export interface BaseEffect {
  type: EffectType;
  target: AbilityTarget;
  duration?: EffectDuration;
  condition?: AbilityCondition;
}

/**
 * Stat modification effect
 */
export interface StatModificationEffect extends BaseEffect {
  type: 'modify-stats';
  stat: 'attack' | 'health' | 'both';
  value: number;  // Positive for buff, negative for debuff
  duration: EffectDuration;
}

/**
 * Damage effect
 */
export interface DamageEffect extends BaseEffect {
  type: 'deal-damage';
  value: number | 'attack-value';  // Fixed damage or based on attack
  piercing?: boolean;  // Ignores armor/damage reduction
}

/**
 * Healing effect
 */
export interface HealEffect extends BaseEffect {
  type: 'heal';
  value: number | 'full';
}

/**
 * Card draw effect
 */
export interface DrawCardEffect extends BaseEffect {
  type: 'draw-cards';
  value: number;
}

/**
 * Counter application effect
 */
export interface ApplyCounterEffect extends BaseEffect {
  type: 'apply-counter';
  counter: CounterType;
  value: number;
}

/**
 * Counter removal effect
 */
export interface RemoveCounterEffect extends BaseEffect {
  type: 'remove-counter';
  counter?: CounterType;
}

/**
 * Immunity effect
 */
export interface ImmunityEffect extends BaseEffect {
  type: 'immunity';
  immuneTo: Array<'magic' | 'trap' | 'bloom-abilities' | 'bloom-attacks' |
                   'counters' | 'damage' | 'targeting' | 'negative-effects'>;
  duration: EffectDuration;
}

/**
 * Cannot be targeted effect
 */
export interface CannotBeTargetedEffect extends BaseEffect {
  type: 'cannot-be-targeted';
  by: Array<'magic' | 'trap' | 'abilities' | 'attacks' | 'high-cost-units' | 'all'>;
  costThreshold?: number;  // For "cost 3 or higher" type restrictions
}

/**
 * Attack modification effect
 */
export interface AttackModificationEffect extends BaseEffect {
  type: 'attack-modification';
  modification: 'double-damage' | 'triple-damage' | 'instant-destroy' |
                'attack-twice' | 'attack-first' | 'cannot-counterattack' |
                'piercing' | 'lifesteal';
  condition?: AbilityCondition;
}

/**
 * Movement effect
 */
export interface MoveEffect extends BaseEffect {
  type: 'move-unit';
  destination: 'any-slot' | 'adjacent-slot' | 'swap-with-target';
}

/**
 * Resource gain effect
 */
export interface ResourceGainEffect extends BaseEffect {
  type: 'gain-resource';
  resource: 'nectar' | 'extra-summon' | 'extra-nectar-play';
  value: number;
}

/**
 * Prevent effect
 */
export interface PreventEffect extends BaseEffect {
  type: 'prevent-attack' | 'prevent-abilities';
  duration: EffectDuration;
}

/**
 * Search deck effect
 */
export interface SearchDeckEffect extends BaseEffect {
  type: 'search-deck';
  searchFor: 'any' | 'bloom' | 'magic' | 'trap' | 'habitat' | 'specific-affinity';
  affinity?: Affinity;
  quantity: number;
}

/**
 * Destroy effect
 */
export interface DestroyEffect extends BaseEffect {
  type: 'destroy';
  condition?: AbilityCondition;
}

/**
 * Temporary HP effect
 */
export interface TemporaryHPEffect extends BaseEffect {
  type: 'temporary-hp';
  value: number;
}

/**
 * Remove summoning sickness effect
 */
export interface RemoveSummoningSicknessEffect extends BaseEffect {
  type: 'remove-summoning-sickness';
}

/**
 * Damage reduction effect
 */
export interface DamageReductionEffect extends BaseEffect {
  type: 'damage-reduction';
  value: number;
  duration: EffectDuration;
}

/**
 * Retaliation effect
 */
export interface RetaliationEffect extends BaseEffect {
  type: 'retaliation';
  value: number | 'reflected'; // Fixed damage or reflect all damage
  applyCounter?: CounterType; // Optional counter to apply
  counterValue?: number;
}

/**
 * Swap positions effect
 */
export interface SwapPositionsEffect extends BaseEffect {
  type: 'swap-positions';
  // target specifies which units to swap
}

/**
 * Return to hand effect
 */
export interface ReturnToHandEffect extends BaseEffect {
  type: 'return-to-hand';
  value?: number; // Number of units to return
}

/**
 * Discard cards effect
 */
export interface DiscardCardsEffect extends BaseEffect {
  type: 'discard-cards';
  value: number;
}

/**
 * Copy ability effect
 */
export interface CopyAbilityEffect extends BaseEffect {
  type: 'copy-ability';
  abilityType?: 'passive' | 'bloom';
}

/**
 * Nullify effect
 */
export interface NullifyEffectEffect extends BaseEffect {
  type: 'nullify-effect';
}

/**
 * Redirect damage effect
 */
export interface RedirectDamageEffect extends BaseEffect {
  type: 'redirect-damage';
  redirectTo: AbilityTarget;
}

/**
 * Union of all effect types
 */
export type AbilityEffect =
  | StatModificationEffect
  | DamageEffect
  | HealEffect
  | DrawCardEffect
  | ApplyCounterEffect
  | RemoveCounterEffect
  | ImmunityEffect
  | CannotBeTargetedEffect
  | AttackModificationEffect
  | MoveEffect
  | ResourceGainEffect
  | PreventEffect
  | SearchDeckEffect
  | DestroyEffect
  | TemporaryHPEffect
  | RemoveSummoningSicknessEffect
  | DamageReductionEffect
  | RetaliationEffect
  | SwapPositionsEffect
  | ReturnToHandEffect
  | DiscardCardsEffect
  | CopyAbilityEffect
  | NullifyEffectEffect
  | RedirectDamageEffect;

/**
 * Cost for activating abilities
 */
export interface AbilityCost {
  type: 'nectar' | 'discard' | 'sacrifice' | 'remove-counter';
  value?: number;
  counter?: CounterType;
}

/**
 * Complete ability definition
 */
export interface StructuredAbility {
  name: string;
  description: string;
  trigger?: 'OnSummon' | 'OnAttack' | 'OnDamage' | 'OnDestroy' |
           'StartOfTurn' | 'EndOfTurn' | 'Passive' | 'Activated';
  cost?: AbilityCost;  // For activated abilities
  effects: AbilityEffect[];
  maxUsesPerTurn?: number;  // For activated abilities
  maxUsesPerGame?: number;  // For once per game abilities
}