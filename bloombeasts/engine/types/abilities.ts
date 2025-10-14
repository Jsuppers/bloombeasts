/**
 * Comprehensive ability system types for Bloom Beasts
 */

import { CounterType, Affinity } from './core';

/**
 * Target types for abilities
 */
export enum AbilityTarget {
  Self = 'self',
  Target = 'target',                           // The target of an attack or ability
  Attacker = 'attacker',                       // The unit attacking this unit
  AllAllies = 'all-allies',                    // All allied Bloom Beasts
  AllEnemies = 'all-enemies',                  // All enemy Bloom Beasts
  AdjacentAllies = 'adjacent-allies',          // Adjacent allied units
  AdjacentEnemies = 'adjacent-enemies',        // Adjacent enemy units
  OpponentGardener = 'opponent-gardener',      // The opponent player
  PlayerGardener = 'player-gardener',          // The controlling player
  RandomEnemy = 'random-enemy',                // Random enemy unit
  AllUnits = 'all-units',                      // All units on board
  DamagedEnemies = 'damaged-enemies',          // All damaged enemy units
  WiltingEnemies = 'wilting-enemies',          // Enemy units at 1 HP
  HighestAttackEnemy = 'highest-attack-enemy', // Enemy with highest ATK
  LowestHealthEnemy = 'lowest-health-enemy',   // Enemy with lowest HP
  SummonedUnit = 'summoned-unit',              // Unit being summoned (for global effects)
  DestroyedUnit = 'destroyed-unit',            // Unit that was just destroyed
  OtherAlly = 'other-ally',                    // Another allied unit (not self)
  AttackedEnemy = 'attacked-enemy'             // The enemy unit that was attacked
}

/**
 * Duration of effects
 */
export enum EffectDuration {
  Permanent = 'permanent',
  EndOfTurn = 'end-of-turn',
  StartOfNextTurn = 'start-of-next-turn',
  Instant = 'instant',
  WhileOnField = 'while-on-field',    // Active while this unit is on field
  NextAttack = 'next-attack',          // Until next attack
  ThisTurn = 'this-turn'               // Only this turn
}

/**
 * Types of effects
 */
export enum EffectType {
  ModifyStats = 'modify-stats',
  DealDamage = 'deal-damage',
  Heal = 'heal',
  DrawCards = 'draw-cards',
  DiscardCards = 'discard-cards',
  ApplyCounter = 'apply-counter',
  RemoveCounter = 'remove-counter',
  Immunity = 'immunity',
  CannotBeTargeted = 'cannot-be-targeted',
  RemoveSummoningSickness = 'remove-summoning-sickness',
  AttackModification = 'attack-modification',
  MoveUnit = 'move-unit',
  ReturnToHand = 'return-to-hand',
  Destroy = 'destroy',
  GainResource = 'gain-resource',
  SearchDeck = 'search-deck',
  PreventAttack = 'prevent-attack',
  PreventAbilities = 'prevent-abilities',
  SwapPositions = 'swap-positions',
  CopyAbility = 'copy-ability',
  NullifyEffect = 'nullify-effect',
  RedirectDamage = 'redirect-damage',
  TemporaryHP = 'temporary-hp',
  DamageReduction = 'damage-reduction',
  Retaliation = 'retaliation'
}

/**
 * Condition types for abilities
 */
export enum ConditionType {
  HasCounter = 'has-counter',
  HealthBelow = 'health-below',
  HealthAbove = 'health-above',
  CostAbove = 'cost-above',
  CostBelow = 'cost-below',
  AffinityMatches = 'affinity-matches',
  IsDamaged = 'is-damaged',
  IsWilting = 'is-wilting',
  TurnCount = 'turn-count',
  UnitsOnField = 'units-on-field',
  ResourceAvailable = 'resource-available'
}

/**
 * Comparison operators
 */
export enum Comparison {
  Equal = 'equal',
  Greater = 'greater',
  Less = 'less',
  GreaterEqual = 'greater-equal',
  LessEqual = 'less-equal'
}

/**
 * Ability triggers
 */
export enum AbilityTrigger {
  OnSummon = 'OnSummon',
  OnAllySummon = 'OnAllySummon',      // When another ally is summoned
  OnAttack = 'OnAttack',
  OnDamage = 'OnDamage',
  OnDestroy = 'OnDestroy',
  StartOfTurn = 'StartOfTurn',
  EndOfTurn = 'EndOfTurn',
  Passive = 'Passive',
  Activated = 'Activated'
}

/**
 * Resource types
 */
export enum ResourceType {
  Nectar = 'nectar',
  ExtraSummon = 'extra-summon',
  ExtraNectarPlay = 'extra-nectar-play'
}

/**
 * Cost types for abilities
 */
export enum CostType {
  Nectar = 'nectar',
  Discard = 'discard',
  Sacrifice = 'sacrifice',
  RemoveCounter = 'remove-counter'
}

/**
 * Condition for triggering effects
 */
export interface AbilityCondition {
  type: ConditionType;
  value?: number | Affinity | CounterType;
  comparison?: Comparison;
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
 * Stat types
 */
export enum StatType {
  Attack = 'attack',
  Health = 'health',
  Both = 'both'
}

/**
 * Damage value types
 */
export enum DamageValueType {
  Fixed = 'fixed',
  AttackValue = 'attack-value'
}

/**
 * Heal value types
 */
export enum HealValueType {
  Fixed = 'fixed',
  Full = 'full'
}

/**
 * Stat modification effect
 */
export interface StatModificationEffect extends BaseEffect {
  type: EffectType.ModifyStats;
  stat: StatType;
  value: number;  // Positive for buff, negative for debuff
  duration: EffectDuration;
}

/**
 * Damage effect
 */
export interface DamageEffect extends BaseEffect {
  type: EffectType.DealDamage;
  value: number | DamageValueType.AttackValue;  // Fixed damage or based on attack
  piercing?: boolean;  // Ignores armor/damage reduction
}

/**
 * Healing effect
 */
export interface HealEffect extends BaseEffect {
  type: EffectType.Heal;
  value: number | HealValueType.Full;
}

/**
 * Card draw effect
 */
export interface DrawCardEffect extends BaseEffect {
  type: EffectType.DrawCards;
  value: number;
}

/**
 * Counter application effect
 */
export interface ApplyCounterEffect extends BaseEffect {
  type: EffectType.ApplyCounter;
  counter: CounterType;
  value: number;
}

/**
 * Counter removal effect
 */
export interface RemoveCounterEffect extends BaseEffect {
  type: EffectType.RemoveCounter;
  counter?: CounterType;
}

/**
 * Immunity types
 */
export enum ImmunityType {
  Magic = 'magic',
  Trap = 'trap',
  Abilities = 'abilities',
  Attacks = 'attacks',
  Counters = 'counters',
  Damage = 'damage',
  Targeting = 'targeting',
  NegativeEffects = 'negative-effects'
}

/**
 * Immunity effect
 */
export interface ImmunityEffect extends BaseEffect {
  type: EffectType.Immunity;
  immuneTo: ImmunityType[];
  duration: EffectDuration;
}

/**
 * Cannot be targeted effect
 */
export interface CannotBeTargetedEffect extends BaseEffect {
  type: EffectType.CannotBeTargeted;
  by: Array<'magic' | 'trap' | 'abilities' | 'attacks' | 'high-cost-units' | 'all'>;
  costThreshold?: number;  // For "cost 3 or higher" type restrictions
}

/**
 * Attack modification effect
 */
export interface AttackModificationEffect extends BaseEffect {
  type: EffectType.AttackModification;
  modification: 'double-damage' | 'triple-damage' | 'instant-destroy' |
                'attack-twice' | 'attack-first' | 'cannot-counterattack' |
                'piercing' | 'lifesteal';
  condition?: AbilityCondition;
}

/**
 * Movement effect
 */
export interface MoveEffect extends BaseEffect {
  type: EffectType.MoveUnit;
  destination: 'any-slot' | 'adjacent-slot' | 'swap-with-target';
}

/**
 * Resource gain effect
 */
export interface ResourceGainEffect extends BaseEffect {
  type: EffectType.GainResource;
  resource: ResourceType;
  value: number;
}

/**
 * Prevent effect
 */
export interface PreventEffect extends BaseEffect {
  type: EffectType.PreventAttack | EffectType.PreventAbilities;
  duration: EffectDuration;
}

/**
 * Search deck effect
 */
export interface SearchDeckEffect extends BaseEffect {
  type: EffectType.SearchDeck;
  searchFor: 'any' | 'bloom' | 'magic' | 'trap' | 'habitat' | 'specific-affinity';
  affinity?: Affinity;
  quantity: number;
}

/**
 * Destroy effect
 */
export interface DestroyEffect extends BaseEffect {
  type: EffectType.Destroy;
  condition?: AbilityCondition;
}

/**
 * Temporary HP effect
 */
export interface TemporaryHPEffect extends BaseEffect {
  type: EffectType.TemporaryHP;
  value: number;
}

/**
 * Remove summoning sickness effect
 */
export interface RemoveSummoningSicknessEffect extends BaseEffect {
  type: EffectType.RemoveSummoningSickness;
}

/**
 * Damage reduction effect
 */
export interface DamageReductionEffect extends BaseEffect {
  type: EffectType.DamageReduction;
  value: number;
  duration: EffectDuration;
}

/**
 * Retaliation effect
 */
export interface RetaliationEffect extends BaseEffect {
  type: EffectType.Retaliation;
  value: number | 'reflected'; // Fixed damage or reflect all damage
  applyCounter?: CounterType; // Optional counter to apply
  counterValue?: number;
}

/**
 * Swap positions effect
 */
export interface SwapPositionsEffect extends BaseEffect {
  type: EffectType.SwapPositions;
  // target specifies which units to swap
}

/**
 * Return to hand effect
 */
export interface ReturnToHandEffect extends BaseEffect {
  type: EffectType.ReturnToHand;
  value?: number; // Number of units to return
}

/**
 * Discard cards effect
 */
export interface DiscardCardsEffect extends BaseEffect {
  type: EffectType.DiscardCards;
  value: number;
}

/**
 * Copy ability effect
 */
export interface CopyAbilityEffect extends BaseEffect {
  type: EffectType.CopyAbility;
  abilityType?: 'passive' | 'activated';
}

/**
 * Nullify effect
 */
export interface NullifyEffectEffect extends BaseEffect {
  type: EffectType.NullifyEffect;
}

/**
 * Redirect damage effect
 */
export interface RedirectDamageEffect extends BaseEffect {
  type: EffectType.RedirectDamage;
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
  type: CostType;
  value?: number;
  counter?: CounterType;
}

/**
 * Complete ability definition
 */
export interface StructuredAbility {
  name: string;
  trigger?: AbilityTrigger;
  cost?: AbilityCost;  // For activated abilities
  effects: AbilityEffect[];
  maxUsesPerTurn?: number;  // For activated abilities
  maxUsesPerGame?: number;  // For once per game abilities
}