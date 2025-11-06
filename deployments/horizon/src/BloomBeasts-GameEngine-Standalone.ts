/**
 * BloomBeasts Game Engine - Meta Horizon Edition
 * Standalone TypeScript Bundle
 *
 * This file contains the complete BloomBeasts game engine in a single standalone TypeScript file.
 * All code is wrapped in the BloomBeasts namespace to avoid global scope pollution.
 *
 * Usage in Meta Horizon:
 *   // Access types and classes via the BloomBeasts namespace
 *   const game = new BloomBeasts.GameManager(platform);
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated: 2025-11-06T01:45:19.881Z
 * Files: 112
 *
 * @version 1.0.0
 * @license MIT
 */

/* eslint-disable */
/* tslint:disable */

// ==================== Global Type Declarations ====================

// ==================== BloomBeasts Namespace ====================

namespace BloomBeasts {

  // ==================== Game Engine Code ====================
  // All type declarations and implementations are included from source files below.
  // UI implementations are provided by the platform via UIMethodMappings interface.

  // ==================== bloombeasts\engine\types\abilities.ts ====================

  /**
   * Comprehensive ability system types for BloomBeasts
   */


  /**
   * Target types for abilities
   */
  export enum AbilityTarget {
    Self = 'self',
    Attacker = 'attacker',                       // The unit attacking this unit
    AllAllies = 'all-allies',                    // All allied Beasts
    AllEnemies = 'all-enemies',                  // All enemy Beasts
    AdjacentAllies = 'adjacent-allies',          // Adjacent allied units
    AdjacentEnemies = 'adjacent-enemies',        // Adjacent enemy units
    Opponent = 'opponent',                       // The opponent player
    Player = 'player',                           // The controlling player
    RandomEnemy = 'random-enemy',                // Random enemy unit
    RandomAlly = 'random-ally',                  // Random allied unit
    AllUnits = 'all-units',                      // All units on board
    DamagedEnemies = 'damaged-enemies',          // All damaged enemy units
    WiltingEnemies = 'wilting-enemies',          // Enemy units at 1 HP
    HighestAttackEnemy = 'highest-attack-enemy', // Enemy with highest ATK
    LowestHealthEnemy = 'lowest-health-enemy',   // Enemy with lowest HP
    SummonedUnit = 'summoned-unit',              // Unit being summoned (for global effects)
    DestroyedUnit = 'destroyed-unit',            // Unit that was just destroyed
    OtherAlly = 'other-ally',                    // Another allied unit (not self)
    AttackedEnemy = 'attacked-enemy',            // The enemy unit that was attacked
    PlayedCard = 'played-card'                   // The card that was just played (triggers traps)
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
    Immunity = 'immunity',
    CannotBeTargeted = 'cannot-be-targeted',
    RemoveSummoningSickness = 'remove-summoning-sickness',
    AttackModification = 'attack-modification',
    MoveUnit = 'move-unit',
    ReturnToHand = 'return-to-hand',
    Destroy = 'destroy',
    GainResource = 'gain-resource',
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
    // Combat triggers
    OnSummon = 'OnSummon',
    OnAllySummon = 'OnAllySummon',      // When another ally is summoned
    OnAttack = 'OnAttack',
    OnDamage = 'OnDamage',
    OnDestroy = 'OnDestroy',

    // Turn-based triggers
    OnOwnStartOfTurn = 'OnOwnStartOfTurn',  // Triggers only on controlling player's start
    OnOwnEndOfTurn = 'OnOwnEndOfTurn',      // Triggers only on controlling player's end

    // Continuous ability
    WhileOnField = 'WhileOnField'  // Active while the card is on the field
  }

  /**
   * Resource types
   */
  export enum ResourceType {
    Energy = 'energy',
    ExtraSummon = 'extra-summon',
    ExtraEnergyPlay = 'extra-energy-play'
  }

  /**
   * Cost types for abilities
   */
  export enum CostType {
    Energy = 'energy',
    Discard = 'discard',
    Sacrifice = 'sacrifice'
  }

  /**
   * Condition for triggering effects
   */
  export interface AbilityCondition {
    type: ConditionType;
    value?: number | Affinity;
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

  // Counter effects removed to reduce game complexity

  /**
   * Immunity types
   */
  export enum ImmunityType {
    Magic = 'magic',
    Trap = 'trap',
    Abilities = 'abilities',
    Attacks = 'attacks',
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
    | ImmunityEffect
    | CannotBeTargetedEffect
    | AttackModificationEffect
    | MoveEffect
    | ResourceGainEffect
    | PreventEffect
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

  // ==================== bloombeasts\engine\types\core.ts ====================

  /**
   * Core type definitions for BloomBeasts card game
   */


  export enum Affinity {
    Forest = 'Forest',
    Fire = 'Fire',
    Water = 'Water',
    Sky = 'Sky',
    Generic = 'Generic',
    Boss = 'Boss'
  }

  export enum CardType {
    Magic = 'Magic',
    Trap = 'Trap',
    Beast = 'Beast',
    Habitat = 'Habitat',
    Buff = 'Buff'
  }

  // Counter types removed to reduce game complexity

  /**
   * Base card interface
   */
  export interface Card {
    id: string;
    name: string;
    type: CardType;
    cost: number;
    titleColor?: string;  // Optional custom color for card title (hex color, e.g., '#000000')
  }

  /**
   * Trigger conditions for trap cards
   */
  export enum TrapTrigger {
    OnBeastPlay = 'OnBeastPlay',          // When opponent plays a Beast
    OnHabitatPlay = 'OnHabitatPlay',      // When opponent plays a Habitat
    OnMagicPlay = 'OnMagicPlay',          // When opponent plays a Magic card
    OnAttack = 'OnAttack',                // When opponent attacks
    OnDamage = 'OnDamage',                // When your units take damage
    OnDestroy = 'OnDestroy',              // When your units are destroyed
    OnDraw = 'OnDraw',                    // When opponent draws cards
    OnHeal = 'OnHeal',                    // When opponent heals
    OnAbilityUse = 'OnAbilityUse'        // When opponent uses an ability
  }

  /**
   * Trap condition types
   */
  export enum TrapConditionType {
    CostAbove = 'cost-above',
    CostBelow = 'cost-below',
    AffinityMatches = 'affinity-matches',
    DamageAbove = 'damage-above'
  }

  /**
   * Structured trap activation
   */
  export interface TrapActivation {
    trigger: TrapTrigger;
    condition?: {
      type: TrapConditionType;
      value?: number | Affinity;
    };
  }

  /**
   * Magic card
   */
  export interface MagicCard extends Card {
    type: CardType.Magic;
    abilities: Ability[];  // Standardized to use abilities like Beast cards
    targetRequired?: boolean;  // Whether the card needs a target
  }

  /**
   * Trap card
   */
  export interface TrapCard extends Card {
    type: CardType.Trap;
    activation: TrapActivation;  // Structured activation instead of string
    abilities: Ability[];         // Standardized to use abilities like Beast cards
  }

  /**
   * Habitat card
   */
  export interface HabitatCard extends Card {
    type: CardType.Habitat;
    affinity: Affinity;
    abilities: Ability[];  // Standardized to use abilities like Beast cards
  }

  /**
   * Buff card - stays on board and provides ongoing effects
   */
  export interface BuffCard extends Card {
    type: CardType.Buff;
    affinity?: Affinity;  // Optional affinity for buff cards
    abilities: Ability[];  // Standardized to use abilities like Beast cards
    duration?: number;  // Optional turn duration (undefined = permanent)
  }

  /**
   * Beast card
   *
   * All cards use standard leveling progression:
   * - Standard XP requirements (10, 20, 40, 80, 160, 320, 640, 1280)
   * - Standard stat boosts (+0-8 HP, +0-6 ATK over 9 levels)
   * - Abilities remain constant across all levels
   */
  export interface BloomBeastCard extends Card {
    type: CardType.Beast;
    affinity: Affinity;
    baseAttack: number;
    baseHealth: number;
    abilities: Ability[];  // Array of passive abilities (constant across all levels)
    // Note: Card definitions are blueprints. All cards (Beast, Magic, Trap, Habitat, Buff)
    // start at level 1 with 0 XP when added to player's collection as CardInstance objects.
    // Level and XP tracking is handled by the CardInstance interface, not the card definitions.
  }

  /**
   * Simple ability definition (for backward compatibility)
   */
  export interface SimpleAbility {
    name: string;
    trigger?: 'OnSummon' | 'OnAttack' | 'OnDamage' | 'OnDestroy' | 'StartOfTurn' | 'EndOfTurn' | 'Passive' | 'Activated';
  }

  /**
   * Ability can be either simple (text-only) or structured (with effects)
   * Import StructuredAbility from './abilities' for full type
   */
  export type Ability = SimpleAbility | StructuredAbility;

  /**
   * Union type for all cards
   */
  export type AnyCard = MagicCard | TrapCard | HabitatCard | BloomBeastCard | BuffCard;

  // ==================== bloombeasts\engine\types\leveling.ts ====================

  /**
   * Type definitions for the leveling and progression system
   */


  export type Level = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

  /**
   * Stat progression by level
   */
  export interface StatGain {
    cumulativeHP: number;
    cumulativeATK: number;
  }

  /**
   * XP source tracking
   */
  export enum XPSource {
    Combat = 'Combat',
    EnergySacrifice = 'EnergySacrifice'
  }

  /**
   * Temporary effect on a unit
   */
  export interface TemporaryEffect {
    type: string;
    stat?: 'attack' | 'health' | 'both';
    value?: number;
    duration: string;
    turnsRemaining: number;
  }

  /**
   * Prevention effect on a unit
   */
  export interface PreventionEffect {
    type: 'prevent-attack' | 'prevent-abilities';
    duration: string;
  }

  /**
   * Targeting restrictions
   */
  export interface TargetingRestrictions {
    costThreshold?: number;
  }

  /**
   * Source of a stat modification
   */
  export enum StatModifierSource {
    Base = 'base',              // Base stats from card + level
    BuffZone = 'buff-zone',     // From buff cards in buff zone
    Ability = 'ability',        // From triggered abilities (temporary)
    Magic = 'magic',            // From magic card effects
    Habitat = 'habitat',        // From habitat cards
    Equipment = 'equipment'     // Future: From equipment
  }

  /**
   * A single stat modifier
   */
  export interface StatModifier {
    source: StatModifierSource;
    sourceId: string;           // ID of the card/ability that applied this
    stat: 'attack' | 'health' | 'maxHealth';
    value: number;              // Amount of modification (can be negative)
    duration?: 'permanent' | 'end-of-turn' | 'while-active';
    turnsRemaining?: number;    // For temporary effects
  }

  // BloomBeastInstance has been removed. Use RuntimeBeast from engine/types/runtime.ts instead.

  // ==================== bloombeasts\engine\types\runtime.ts ====================

  /**
   * Runtime Card Types
   *
   * Unified type system for cards during gameplay (battle, field, UI rendering).
   * These types extend card definitions with instance metadata and runtime state.
   *
   * REPLACES:
   * - BattleBeast, BattleMagic, BattleTrap, BattleBuff, BattleHabitat (from battle/types.ts)
   * - BloomBeastInstance (from engine/types/leveling.ts)
   * - CardDisplay (from utils/cardUtils.ts)
   *
   * ARCHITECTURE:
   * - CardInstance (screens/cards/types.ts): Minimal storage (id, cardId, currentXP)
   * - *Card types (engine/types/core.ts): Readonly catalog definitions
   * - Runtime* types (this file): Full gameplay state (extends card definitions)
   */


  /**
   * Base runtime card interface
   * Extends card definitions with instance metadata
   */
  export interface RuntimeCardBase {
    // Instance identity (from CardInstance)
    instanceId: string;    // Unique instance ID (e.g., "forest-beast-1-1")
    currentXP: number;     // Current XP for leveling
    level: number;         // Current level (1-9), computed from currentXP

    // All card definition properties inherited via extension
  }

  /**
   * Runtime Beast Card
   *
   * Unified type for beasts in any context:
   * - In deck/hand: Basic state (summoningSickness not set)
   * - On field: Full state with slotIndex, modifiers, effects
   * - In UI: All display properties available
   *
   * REPLACES: BattleBeast, BloomBeastInstance, CardDisplay (for beasts)
   */
  export interface RuntimeBeast extends BloomBeastCard, RuntimeCardBase {
    // Card definition properties from BloomBeastCard:
    // - id: string (base card ID, e.g., "forest-beast")
    // - name: string
    // - type: CardType.Beast
    // - cost: number
    // - affinity: Affinity
    // - baseAttack: number (base stats without level bonuses or modifiers)
    // - baseHealth: number
    // - abilities: Ability[]
    // - titleColor?: string

    // Additional tracking (from BloomBeastInstance)
    cardId: string;          // Base card ID (same as id, kept for compatibility)

    // Runtime combat stats (includes level scaling and modifiers)
    currentAttack: number;   // Current attack (base + level + modifiers)
    currentHealth: number;   // Current health (decreases with damage)
    maxHealth: number;       // Maximum health for this level (base + level bonuses)

    // Game engine tracking (required for game engine)
    currentLevel: Level;             // Strongly-typed level (1-9)
    statusEffects: any[];            // Status effects like burn, freeze, etc.
    statModifiers?: StatModifier[];  // Active stat modifications

    // Battle state (optional - only set when card is in play)
    summoningSickness?: boolean;     // True when first played, prevents actions
    usedAbilityThisTurn?: boolean;   // True if ability was used this turn
    slotIndex?: number;              // Position on field (0-2)
    temporaryHP?: number;            // Temporary HP from abilities
    temporaryEffects?: TemporaryEffect[];  // Temporary stat/effect modifications
    immunities?: Array<string>;      // Immunity to specific effects
    cannotBeTargetedBy?: Array<string>;  // Targeting restrictions
    targetingRestrictions?: TargetingRestrictions;
    attackModifications?: Array<string>;  // Attack modifications
    preventions?: PreventionEffect[];     // Prevention effects (can't attack, etc.)
  }

  /**
   * Runtime Magic Card
   *
   * Used for magic cards in deck, hand, or being played.
   * Magic cards are one-time use and don't persist on field.
   *
   * REPLACES: BattleMagic
   */
  export interface RuntimeMagic extends MagicCard, RuntimeCardBase {
    // Card definition properties from MagicCard:
    // - id, name, type: CardType.Magic, cost, abilities, targetRequired, titleColor

    // Magic cards have no additional runtime state
  }

  /**
   * Runtime Trap Card
   *
   * Used for traps in deck, hand, or trap zone.
   * Traps activate when their trigger condition is met.
   *
   * REPLACES: BattleTrap
   */
  export interface RuntimeTrap extends TrapCard, RuntimeCardBase {
    // Card definition properties from TrapCard:
    // - id, name, type: CardType.Trap, cost, activation, abilities, titleColor

    // Trap-specific runtime state
    isActive?: boolean;         // True when trap is set and active
    turnsActive?: number;       // How many turns the trap has been active
  }

  /**
   * Runtime Buff Card
   *
   * Used for buff cards in deck, hand, or buff zone.
   * Buffs provide ongoing effects while on field.
   *
   * REPLACES: BattleBuff
   */
  export interface RuntimeBuff extends BuffCard, RuntimeCardBase {
    // Card definition properties from BuffCard:
    // - id, name, type: CardType.Buff, cost, affinity, abilities, duration, titleColor

    // Buff-specific runtime state
    turnsRemaining?: number;    // Remaining turns (for temporary buffs)
    isActive?: boolean;         // True when buff is on field and active
  }

  /**
   * Runtime Habitat Card
   *
   * Used for habitat cards in deck, hand, or habitat zone.
   * Habitats provide field-wide effects.
   *
   * REPLACES: BattleHabitat
   */
  export interface RuntimeHabitat extends HabitatCard, RuntimeCardBase {
    // Card definition properties from HabitatCard:
    // - id, name, type: CardType.Habitat, cost, affinity, abilities, titleColor

    // Habitat-specific runtime state
    isActive?: boolean;         // True when habitat is on field
    turnsActive?: number;       // How many turns habitat has been active
  }

  /**
   * Union type for all runtime cards
   *
   * REPLACES: BattleCard
   */
  export type RuntimeCard = RuntimeBeast | RuntimeMagic | RuntimeTrap | RuntimeBuff | RuntimeHabitat;

  /**
   * Type guards for runtime cards
   */
  export function isRuntimeBeast(card: RuntimeCard): card is RuntimeBeast {
    return card.type === CardType.Beast;
  }

  export function isRuntimeMagic(card: RuntimeCard): card is RuntimeMagic {
    return card.type === CardType.Magic;
  }

  export function isRuntimeTrap(card: RuntimeCard): card is RuntimeTrap {
    return card.type === CardType.Trap;
  }

  export function isRuntimeBuff(card: RuntimeCard): card is RuntimeBuff {
    return card.type === CardType.Buff;
  }

  export function isRuntimeHabitat(card: RuntimeCard): card is RuntimeHabitat {
    return card.type === CardType.Habitat;
  }

  // ==================== bloombeasts\utils\polyfills.ts ====================

  /**
   * Polyfills and type definitions for ES2020 compatibility
   * This file provides alternatives to Map, Promise, and Array methods
   */

  /**
   * Simple Map alternative using object storage
   */
  export class SimpleMap<K extends string | number, V> {
    private storage: Record<string, V> = {};
    private keyList: K[] = [];

    constructor(entries?: Array<[K, V]>) {
      if (entries) {
        entries.forEach(([key, value]) => {
          this.set(key, value);
        });
      }
    }

    set(key: K, value: V): this {
      const keyStr = String(key);
      if (!(keyStr in this.storage)) {
        this.keyList.push(key);
      }
      this.storage[keyStr] = value;
      return this;
    }

    get(key: K): V | undefined {
      return this.storage[String(key)];
    }

    has(key: K): boolean {
      return String(key) in this.storage;
    }

    delete(key: K): boolean {
      const keyStr = String(key);
      if (keyStr in this.storage) {
        delete this.storage[keyStr];
        const index = this.keyList.indexOf(key);
        if (index > -1) {
          this.keyList.splice(index, 1);
        }
        return true;
      }
      return false;
    }

    clear(): void {
      this.storage = {};
      this.keyList = [];
    }

    get size(): number {
      return this.keyList.length;
    }

    keys(): K[] {
      return [...this.keyList];
    }

    values(): V[] {
      return this.keyList.map(key => this.storage[String(key)]);
    }

    entries(): Array<[K, V]> {
      return this.keyList.map(key => [key, this.storage[String(key)]]);
    }

    forEach(callback: (value: V, key: K, map: SimpleMap<K, V>) => void): void {
      this.keyList.forEach(key => {
        callback(this.storage[String(key)], key, this);
      });
    }
  }

  /**
   * Array.from polyfill
   */
  export function arrayFrom<T>(iterable: ArrayLike<T> | Iterable<T>): T[] {
    const result: T[] = [];
    if ('length' in iterable) {
      // ArrayLike
      for (let i = 0; i < iterable.length; i++) {
        result.push(iterable[i]);
      }
    } else if (Symbol.iterator in iterable) {
      // Iterable - manual iteration to avoid downlevelIteration requirement
      const iterator = (iterable as Iterable<T>)[Symbol.iterator]();
      let iterResult = iterator.next();
      while (!iterResult.done) {
        result.push(iterResult.value);
        iterResult = iterator.next();
      }
    }
    return result;
  }

  /**
   * Array.find polyfill
   */
  export function arrayFind<T>(
    array: T[],
    predicate: (value: T, index: number, array: T[]) => boolean
  ): T | undefined {
    for (let i = 0; i < array.length; i++) {
      if (predicate(array[i], i, array)) {
        return array[i];
      }
    }
    return undefined;
  }

  // Export as global Map replacement if needed
  export type MapPolyfill<K extends string | number, V> = SimpleMap<K, V>;

  // ==================== bloombeasts\engine\types\game.ts ====================

  /**
   * Game state and player types
   */


  // Re-export for convenience

  // Battle state enum for state-based battle flow
  export enum BattlePhase {
    Setup = 'Setup',
    Player1StartOfTurn = 'Player1StartOfTurn',
    Player1Playing = 'Player1Playing',
    Player1EndOfTurn = 'Player1EndOfTurn',
    Player2StartOfTurn = 'Player2StartOfTurn',
    Player2Playing = 'Player2Playing',
    Player2EndOfTurn = 'Player2EndOfTurn',
    Finished = 'Finished'
  }

  // Phase type for game flow (kept for backward compatibility)
  export enum Phase {
    Setup = 'Setup',
    Draw = 'Draw',
    Main = 'Main',
    Combat = 'Combat',
    End = 'End'
  }

  export interface Player {
    id?: string;
    name: string;
    health: number;
    maxHealth?: number;
    energy?: number;
    permanentEnergy?: number;
    temporaryEnergy?: number;
    currentEnergy: number;  // Available energy this turn
    summonsThisTurn: number; // Track summons for extra summon effects
    deck: AnyCard[];
    hand: AnyCard[];
    discardPile?: AnyCard[];
    graveyard: AnyCard[];  // Cards that have been destroyed
    field: (RuntimeBeast | null)[]; // Nullable for empty slots
    trapZone: (AnyCard | null)[]; // Face-down trap cards (max 3)
    buffZone: (AnyCard | null)[]; // Active buff cards (max 2)
  }

  export interface GameState {
    players: [Player, Player];
    currentPlayerIndex?: 0 | 1;
    activePlayer: 0 | 1;  // Current player's turn
    habitatZone: HabitatCard | null;
    turn: number;
    phase: Phase;  // Kept for backward compatibility
    battleState: BattlePhase;  // New state-based battle flow
    turnHistory: any[];  // History of actions taken
    // Pending actions that need to be resolved
    drawCardsQueued?: number;
    drawForPlayerIndex?: 0 | 1;
    pendingMove?: {
      unit: RuntimeBeast;
      destination: string;
    };
    pendingSearch?: {
      searchFor: string;
      quantity: number;
      affinity?: string;
    };
  }

  // Alias for Phase from core
  export type GamePhase = Phase;

  export interface GameAction {
    type: string;
    playerId: string;
    timestamp: number;
  }

  export interface SummonAction extends GameAction {
    type: 'SUMMON';
    cardId: string;
    slotIndex: number;
  }

  export interface AttackAction extends GameAction {
    type: 'ATTACK';
    attackerInstanceId: string;
    targetInstanceId?: string; // undefined means attacking player directly
  }

  export interface PlayMagicAction extends GameAction {
    type: 'PLAY_MAGIC';
    cardId: string;
    targetInstanceId?: string;
  }

  export interface GainXPAction extends GameAction {
    type: 'GAIN_XP';
    instanceId: string;
    amount: number;
    source: XPSource;
  }

  export interface HabitatShiftAction extends GameAction {
    type: 'HABITAT_SHIFT';
    habitatCardId: string;
  }

  // ==================== bloombeasts\engine\cards\deckConfig.ts ====================

  /**
   * Deck Configuration - Simplified deck building using card utilities
   */


  export type DeckCardEntry<T = AnyCard> = {
    card: T;
    quantity: number;
  };

  // Deck config that stores card IDs instead of card objects (for lazy loading)
  export type DeckCardIdEntry = {
    cardId: string;
    quantity: number;
  };

  export type AffinityType = 'Forest' | 'Fire' | 'Water' | 'Sky';

  /**
   * Deck configuration for each affinity (with card IDs)
   */
  export interface AffinityDeckConfigIds {
    name: string;
    affinity: AffinityType;
    beasts: DeckCardIdEntry[];
    habitats: DeckCardIdEntry[];
  }

  /**
   * Deck configuration for each affinity (with resolved cards)
   */
  export interface AffinityDeckConfig {
    name: string;
    affinity: AffinityType;
    beasts: DeckCardEntry<BloomBeastCard>[];
    habitats: DeckCardEntry<HabitatCard>[];
  }

  /**
   * Static deck configurations using card IDs (no catalog dependency)
   * These can be loaded at module initialization time
   */
  const AFFINITY_DECK_CONFIG_IDS: Record<AffinityType, AffinityDeckConfigIds> = {
    Forest: {
      name: 'Forest Starter: The Growth Deck',
      affinity: 'Forest',
      beasts: [
        { cardId: 'mosslet', quantity: 4 },
        { cardId: 'rootling', quantity: 4 },
        { cardId: 'mushroomancer', quantity: 2 },
        { cardId: 'leaf-sprite', quantity: 3 },
      ],
      habitats: [
        { cardId: 'ancient-forest', quantity: 3 },
      ],
    },
    Fire: {
      name: 'Fire Starter: The Aggro Deck',
      affinity: 'Fire',
      beasts: [
        { cardId: 'cinder-pup', quantity: 4 },
        { cardId: 'blazefinch', quantity: 4 },
        { cardId: 'magmite', quantity: 2 },
        { cardId: 'charcoil', quantity: 3 },
      ],
      habitats: [
        { cardId: 'volcanic-scar', quantity: 3 },
      ],
    },
    Water: {
      name: 'Water Starter: The Control Deck',
      affinity: 'Water',
      beasts: [
        { cardId: 'bubblefin', quantity: 4 },
        { cardId: 'aqua-pebble', quantity: 4 },
        { cardId: 'dewdrop-drake', quantity: 2 },
        { cardId: 'kelp-cub', quantity: 3 },
      ],
      habitats: [
        { cardId: 'deep-sea-grotto', quantity: 3 },
      ],
    },
    Sky: {
      name: 'Sky Starter: The Utility Deck',
      affinity: 'Sky',
      beasts: [
        { cardId: 'cirrus-floof', quantity: 4 },
        { cardId: 'gale-glider', quantity: 4 },
        { cardId: 'star-bloom', quantity: 2 },
        { cardId: 'aero-moth', quantity: 3 },
      ],
      habitats: [
        { cardId: 'clear-zenith', quantity: 3 },
      ],
    },
  };

  /**
   * Shared core cards (card IDs) - Simplified for Forest starter deck
   */
  const SHARED_CORE_CARD_IDS: DeckCardIdEntry[] = [
    // Basic resource generation
    { cardId: 'nectar-block', quantity: 10 },
    { cardId: 'nectar-surge', quantity: 2 },
  ];

  /**
   * Resolve card IDs to card objects
   */
  function resolveCardIds<T = AnyCard>(catalogManager: any, cardIdEntries: DeckCardIdEntry[]): DeckCardEntry<T>[] {
    if (!catalogManager) {
      console.error('[deckConfig] catalogManager not provided');
      return [];
    }
    return cardIdEntries.map(({ cardId, quantity }) => ({
      card: catalogManager.getCard(cardId) as T,
      quantity,
    }));
  }

  /**
   * Get shared core cards configuration (resolved from IDs)
   */
  export function getSharedCoreCards(catalogManager: any): DeckCardEntry<MagicCard | TrapCard>[] {
    return resolveCardIds<MagicCard | TrapCard>(catalogManager, SHARED_CORE_CARD_IDS);
  }

  /**
   * Get deck configuration for a specific affinity (resolves card IDs to cards)
   */
  export function getDeckConfig(catalogManager: any, affinity: AffinityType): AffinityDeckConfig {
    const configIds = AFFINITY_DECK_CONFIG_IDS[affinity];

    return {
      name: configIds.name,
      affinity: configIds.affinity,
      beasts: resolveCardIds<BloomBeastCard>(catalogManager, configIds.beasts),
      habitats: resolveCardIds<HabitatCard>(catalogManager, configIds.habitats),
    };
  }

  /**
   * Get all deck configurations (resolves card IDs to cards)
   */
  export function getAllDeckConfigs(catalogManager: any): AffinityDeckConfig[] {
    return Object.values(AFFINITY_DECK_CONFIG_IDS).map(configIds => ({
      name: configIds.name,
      affinity: configIds.affinity,
      beasts: resolveCardIds<BloomBeastCard>(catalogManager, configIds.beasts),
      habitats: resolveCardIds<HabitatCard>(catalogManager, configIds.habitats),
    }));
  }

  // ==================== bloombeasts\engine\cards\index.ts ====================

  /**
   * Central card registry
   */

  // Re-export everything from config

  // ==================== bloombeasts\engine\constants\leveling.ts ====================

  /**
   * Constants for the leveling and progression system
   *
   * Balanced leveling system with incremental difficulty:
   * - Beast cards gain XP from battles (distributed evenly across deck)
   * - Player gains XP from mission victories
   * - Each level requires progressively more XP (exponential scaling)
   */


  /**
   * XP required to reach each level from the previous level
   * Formula: XP = 10 * (2.0 ^ (level - 1))
   * This creates steeper exponential growth with significant difficulty increases
   */
  export const XP_REQUIREMENTS: Record<Level, number> = {
    1: 0,      // Starting level
    2: 10,     // 10 XP total
    3: 20,     // 30 XP total
    4: 40,     // 70 XP total
    5: 80,     // 150 XP total
    6: 160,    // 310 XP total
    7: 320,    // 630 XP total
    8: 640,    // 1270 XP total
    9: 1280,   // 2550 XP total
  };

  /**
   * Cumulative stat gains at each level
   * Beasts gain +1 HP and +1 ATK every 2-3 levels on average
   */
  export const STAT_PROGRESSION: Record<Level, StatGain> = {
    1: {
      cumulativeHP: 0,
      cumulativeATK: 0,
    },
    2: {
      cumulativeHP: 1,
      cumulativeATK: 0,
    },
    3: {
      cumulativeHP: 1,
      cumulativeATK: 1,
    },
    4: {
      cumulativeHP: 2,
      cumulativeATK: 1,
    },
    5: {
      cumulativeHP: 3,
      cumulativeATK: 2,
    },
    6: {
      cumulativeHP: 4,
      cumulativeATK: 3,
    },
    7: {
      cumulativeHP: 5,
      cumulativeATK: 4,
    },
    8: {
      cumulativeHP: 6,
      cumulativeATK: 5,
    },
    9: {
      cumulativeHP: 8,
      cumulativeATK: 6,
    },
  };

  export const MAX_LEVEL: Level = 9;

  export const ENERGY_XP_COST = 1;

  // ==================== bloombeasts\engine\utils\deckBuilder.ts ====================

  /**
   * Deck Builder Utilities - Construct and manage decks
   */


  // Module-level catalog manager reference for deck builder
  // Set via setCatalogManagerForDeckBuilder() which is called by BloomBeastsGame
  let _deckBuilderCatalogManager: any = null;

  /**
   * Set the catalog manager instance for deck builder functions
   * Called by BloomBeastsGame during construction
   */
  export function setCatalogManagerForDeckBuilder(catalogManager: any): void {
    _deckBuilderCatalogManager = catalogManager;
  }

  export type DeckType = AffinityType;

  export interface DeckList {
    name: string;
    affinity: DeckType;
    cards: AnyCard[];
    totalCards: number;
  }

  /**
   * Expand cards based on quantity
   */
  function expandCards<T extends AnyCard>(cardQuantities: DeckCardEntry<T>[]): T[] {
    const result: T[] = [];

    for (const { card, quantity } of cardQuantities) {
      for (let i = 0; i < quantity; i++) {
        // Create a unique copy with an instance ID
        result.push({
          ...card,
          instanceId: `${card.id}-${i + 1}`,
        });
      }
    }

    return result;
  }

  /**
   * Build a complete deck with shared cards and affinity-specific cards
   */
  function buildDeck(type: DeckType): DeckList {
    if (!_deckBuilderCatalogManager) {
      console.error('[deckBuilder] catalogManager not initialized');
      return { name: '', affinity: type, cards: [], totalCards: 0 };
    }

    // Get deck configuration from centralized config
    const deckConfig = getDeckConfig(_deckBuilderCatalogManager, type);

    const sharedCards = expandCards(getSharedCoreCards(_deckBuilderCatalogManager));
    const beasts = expandCards(deckConfig.beasts);
    const habitats = expandCards(deckConfig.habitats);

    const allCards = [...sharedCards, ...beasts, ...habitats];

    return {
      name: deckConfig.name,
      affinity: type,
      cards: allCards,
      totalCards: allCards.length,
    };
  }

  /**
   * Build Forest starter deck
   */
  export function buildForestDeck(): DeckList {
    return buildDeck('Forest');
  }

  /**
   * Build Fire starter deck
   */
  export function buildFireDeck(): DeckList {
    return buildDeck('Fire');
  }

  /**
   * Build Water starter deck
   */
  export function buildWaterDeck(): DeckList {
    return buildDeck('Water');
  }

  /**
   * Build Sky starter deck
   */
  export function buildSkyDeck(): DeckList {
    return buildDeck('Sky');
  }

  /**
   * Get all starter decks
   */
  export function getAllStarterDecks(): DeckList[] {
    return (['Forest', 'Fire', 'Water', 'Sky'] as DeckType[]).map(buildDeck);
  }

  /**
   * Get a specific starter deck by type
   */
  export function getStarterDeck(type: DeckType): DeckList {
    // Use simple Forest starter deck
    return buildDeck('Forest');
  }

  /**
   * Get a quick win deck with just a few low-level beasts for fast testing
   * This creates a minimal deck for quick victories in testing
   */
  export function quickWinDeck(type: DeckType): DeckList {
    if (!_deckBuilderCatalogManager) {
      console.error('[deckBuilder] catalogManager not initialized');
      return { name: '', affinity: type, cards: [], totalCards: 0 };
    }

    const deckConfig = getDeckConfig(_deckBuilderCatalogManager, type);
    const allCards: AnyCard[] = [];

    // Add just a few level 1 beasts (3 total - easy to draw and summon quickly)
    const beastEntry = deckConfig.beasts[0]; // Get the first beast type
    if (beastEntry) {
      for (let i = 1; i <= 3; i++) {
        allCards.push({
          ...beastEntry.card,
          instanceId: `${beastEntry.card.id}-${i}`,
        } as unknown as AnyCard);
      }
    }

    // Add 27 Energy Blocks for fast summoning
    const energyBlock = _deckBuilderCatalogManager.getCard('nectar-block');
    if (energyBlock) {
      for (let i = 1; i <= 27; i++) {
        allCards.push({
          ...energyBlock,
          instanceId: `nectar-block-${i}`,
        } as unknown as AnyCard);
      }
    }

    return {
      name: `${deckConfig.name} (Quick Win)`,
      affinity: type,
      cards: allCards,
      totalCards: allCards.length,
    };
  }

  /**
   * Get a testing deck with 1 of each card (for easy testing)
   * This includes 1 of every card in the game across all affinities
   */
  export function getTestingDeck(type: DeckType): DeckList {
    if (!_deckBuilderCatalogManager) {
      console.error('[deckBuilder] catalogManager not initialized');
      return { name: '', affinity: type, cards: [], totalCards: 0 };
    }

    const deckConfig = getDeckConfig(_deckBuilderCatalogManager, type);

    // Get 1 of each card from all affinities
    const allCards: AnyCard[] = [];

    // Add shared cards (Magic, Trap) - 1 of each
    const sharedCards = getSharedCoreCards(_deckBuilderCatalogManager);
    sharedCards.forEach(({ card }) => {
      allCards.push({
        ...card,
        instanceId: `${card.id}-1`,
      } as unknown as AnyCard);
    });

    // Add buff cards - 1 of each
    const buffCards = _deckBuilderCatalogManager.getAllBuffCards();
    buffCards.forEach((card: any) => {
      allCards.push({
        ...card,
        instanceId: `${card.id}-1`,
      } as unknown as AnyCard);
    });

    // Add all beasts from all affinities - 1 of each
    (['Forest', 'Fire', 'Water', 'Sky'] as DeckType[]).forEach(affinity => {
      const affinityConfig = getDeckConfig(_deckBuilderCatalogManager, affinity);

      // Add beasts
      affinityConfig.beasts.forEach(({ card }) => {
        allCards.push({
          ...card,
          instanceId: `${card.id}-1`,
        } as unknown as AnyCard);
      });

      // Add habitats
      affinityConfig.habitats.forEach(({ card }) => {
        allCards.push({
          ...card,
          instanceId: `${card.id}-1`,
        } as unknown as AnyCard);
      });
    });

    return {
      name: `${deckConfig.name} (Testing)`,
      affinity: type,
      cards: allCards,
      totalCards: allCards.length,
    };
  }

  /**
   * Shuffle a deck
   */
  export function shuffleDeck(cards: AnyCard[]): AnyCard[] {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Validate deck (30 cards required)
   */
  export function validateDeck(cards: AnyCard[]): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (cards.length !== 30) {
      errors.push(`Deck must contain exactly 30 cards. Current: ${cards.length}`);
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  // ==================== bloombeasts\engine\utils\cardHelpers.ts ====================

  /**
   * Card Helper Utilities - Query and filter cards
   */


  /**
   * Check if a card is a Beast
   */
  export function isBloomBeast(card: AnyCard): card is BloomBeastCard {
    return card.type === CardType.Beast;
  }

  /**
   * Filter cards by type
   */
  export function filterByType<T extends CardType>(cards: AnyCard[], type: T): Extract<AnyCard, { type: T }>[] {
    return cards.filter((card) => card.type === type) as Extract<AnyCard, { type: T }>[];
  }

  /**
   * Filter Beasts by affinity
   */
  export function filterByAffinity(cards: AnyCard[], affinity: Affinity): BloomBeastCard[] {
    return cards.filter((card): card is BloomBeastCard => isBloomBeast(card) && card.affinity === affinity);
  }

  /**
   * Get all Beasts from a card list
   */
  export function getBloomBeasts(cards: AnyCard[]): BloomBeastCard[] {
    return cards.filter(isBloomBeast);
  }

  /**
   * Find a card by ID
   */
  export function findCardById(cards: AnyCard[], id: string): AnyCard | undefined {
    return cards.find((card) => card.id === id);
  }

  /**
   * Get card by name
   */
  export function findCardByName(cards: AnyCard[], name: string): AnyCard | undefined {
    return cards.find((card) => card.name.toLowerCase() === name.toLowerCase());
  }

  /**
   * Group cards by type
   */
  export function groupByType(cards: AnyCard[]): Record<CardType, AnyCard[]> {
    const grouped: Partial<Record<CardType, AnyCard[]>> = {};

    for (const card of cards) {
      if (!grouped[card.type]) {
        grouped[card.type] = [];
      }
      grouped[card.type]!.push(card);
    }

    return grouped as Record<CardType, AnyCard[]>;
  }

  /**
   * Get cards by cost range
   */
  export function filterByCost(cards: AnyCard[], minCost: number, maxCost: number): AnyCard[] {
    return cards.filter((card) => card.cost >= minCost && card.cost <= maxCost);
  }

  /**
   * Calculate total deck cost (for analytics)
   */
  export function calculateTotalCost(cards: AnyCard[]): number {
    return cards.reduce((sum, card) => sum + card.cost, 0);
  }

  /**
   * Calculate average card cost
   */
  export function calculateAverageCost(cards: AnyCard[]): number {
    if (cards.length === 0) return 0;
    return calculateTotalCost(cards) / cards.length;
  }

  /**
   * Get cost distribution
   */
  export function getCostDistribution(cards: AnyCard[]): Record<number, number> {
    const distribution: Record<number, number> = {};

    for (const card of cards) {
      distribution[card.cost] = (distribution[card.cost] || 0) + 1;
    }

    return distribution;
  }

  // ==================== bloombeasts\engine\index.ts ====================

  /**
   * Bloom Beasts Card Game - Main Export Index
   *
   * A comprehensive card game system with leveling, ability evolution, and strategic gameplay.
   */

  // Types

  // Systems

  // Cards

  // Constants

  // Utilities

  // ==================== bloombeasts\gameManager.ts ====================

  /**
   * Type Definitions for BloomBeasts Game
   *
   * NOTE: This file only contains type exports used by the UI layer.
   * The actual game logic is in BloomBeastsGame.ts.
   */


  /**
   * Player statistics displayed in UI
   */
  export interface MenuStats {
    playerLevel: number;
    totalXP: number;
    coins: number;
    serums: number;
  }

  /**
   * Sound settings for audio playback
   */
  export interface SoundSettings {
    musicVolume: number; // 0-100
    sfxVolume: number; // 0-100
    musicEnabled: boolean;
    sfxEnabled: boolean;
  }

  /**
   * Mission information for display in mission selection
   */
  export interface MissionDisplay {
    id: string;
    name: string;
    level: number;
    difficulty: string;
    isAvailable: boolean;
    isCompleted: boolean;
    description: string;
    affinity?: 'Forest' | 'Water' | 'Fire' | 'Sky' | 'Boss';
    beastId?: string;
  }

  /**
   * Card detail popup information
   */
  export interface CardDetailDisplay {
    card: RuntimeCard;
    buttons: string[];
    isInDeck: boolean;
  }

  /**
   * Complete battle state for display in battle screen
   */
  export interface BattleDisplay {
    playerHealth: number;
    playerMaxHealth: number;
    playerDeckCount: number;
    playerEnergy: number;
    playerHand: any[];
    playerTrapZone: any[]; // Player's trap cards (face-down)
    playerBuffZone: any[]; // Player's active buff cards
    opponentHealth: number;
    opponentMaxHealth: number;
    opponentDeckCount: number;
    opponentEnergy: number;
    opponentField: any[];
    opponentTrapZone: any[]; // Opponent's trap cards (face-down)
    opponentBuffZone: any[]; // Opponent's active buff cards
    playerField: any[];
    currentTurn: number;
    turnPlayer: string;
    turnTimeRemaining: number;
    objectives: ObjectiveDisplay[];
    habitatZone: any | null; // Current habitat card
    attackAnimation?: { // Attack animation state
      attackerPlayer: 'player' | 'opponent';
      attackerIndex: number;
      targetPlayer: 'player' | 'opponent' | 'health';
      targetIndex?: number; // undefined if targeting health
    } | null;
    cardPopup?: { // Card popup display (for magic/trap/buff cards)
      card: any;
      player: 'player' | 'opponent';
      showCloseButton?: boolean; // Show close button for manual popups
    } | null;
  }

  /**
   * Mission objective progress for display
   */
  export interface ObjectiveDisplay {
    description: string;
    progress: number;
    target: number;
    isComplete: boolean;
  }

  // ==================== bloombeasts\ui\styles\colors.ts ====================

  /**
   * Shared color palette for BloomBeasts
   * Used across both Web and Horizon platforms
   */

  export const COLORS = {
    // Primary colors
    background: '#1a1a2e',
    backgroundDark: '#0f0f1e',
    primary: '#00d9ff',
    primaryLight: '#3498db',

    // Text colors
    textPrimary: '#ffffff',
    textSecondary: '#aaaaaa',
    textMuted: '#666666',

    // UI element colors
    buttonPrimary: '#3498db',
    buttonDanger: '#e74c3c',
    buttonSuccess: '#27ae60',
    buttonDisabled: '#555555',
    surface: '#2c3e50',
    disabled: '#555555',
    error: '#e74c3c',

    // Card/Panel colors
    cardBackground: '#2c3e50',
    panelBackground: '#1a1a1a',
    overlayBackground: 'rgba(0, 0, 0, 0.8)',
    overlayBackgroundDark: 'rgba(0, 0, 0, 0.9)',

    // Borders
    borderPrimary: '#00d9ff',
    borderSuccess: '#27ae60',
    borderDefault: '#3498db',
    border: '#3a3a4a',

    // Affinity colors
    affinity: {
      fire: '#e74c3c',
      water: '#3498db',
      forest: '#27ae60',
      sky: '#9b59b6',
      neutral: '#95a5a6',
    },

    // Status colors
    success: '#27ae60',
    warning: '#f39c12',
    danger: '#e74c3c',
    info: '#3498db',

    // Rarity colors (for cards)
    rarity: {
      common: '#95a5a6',
      uncommon: '#27ae60',
      rare: '#3498db',
      epic: '#9b59b6',
      legendary: '#f39c12',
    },
  } as const;

  // ==================== bloombeasts\ui\styles\dimensions.ts ====================

  /**
   * Shared dimensions and spacing for BloomBeasts
   * Used across both Web and Horizon platforms
   */

  export const DIMENSIONS = {
    // Panel/Screen dimensions
    panel: {
      width: 1280,
      height: 720,
    },

    // Button dimensions
    button: {
      height: 50,
      minWidth: 200,
      padding: 15,
      borderRadius: 10,
    },

    buttonSmall: {
      height: 40,
      minWidth: 100,
      padding: 10,
      borderRadius: 8,
    },

    // Card dimensions
    card: {
      width: 150,
      height: 200,
      borderRadius: 10,
      borderWidth: 2,
      padding: 10,
    },

    // Mission card dimensions
    missionCard: {
      padding: 15,
      borderRadius: 10,
      borderWidth: 2,
      minHeight: 80,
    },

    // Dialog/Modal dimensions
    dialog: {
      minWidth: 400,
      maxWidth: 600,
      padding: 30,
      borderRadius: 15,
    },

    // Spacing scale
    spacing: {
      xs: 5,
      sm: 10,
      md: 15,
      lg: 20,
      xl: 30,
      xxl: 40,
    },

    // Font sizes
    fontSize: {
      xs: 12,
      sm: 14,
      md: 18,
      lg: 20,
      xl: 24,
      xxl: 28,
      title: 36,
      hero: 72,
    },

    // Border widths
    borderWidth: {
      thin: 1,
      normal: 2,
      thick: 3,
    },

    // Stat badge dimensions
    statBadge: {
      padding: 10,
      borderRadius: 8,
      borderWidth: 2,
    },
  } as const;

  /**
   * Common gaps for flexbox layouts
   */
  export const GAPS = {
    cards: 15,
    buttons: 3,
    missions: 10,
    stats: 20,
    sections: 30,
  } as const;

  // ==================== bloombeasts\ui\constants\dimensions.ts ====================

  // Multi-use card dimensions
  export const standardCardDimensions = {
    width: 210,
    height: 280,
  };

  export const missionCompleteCardDimensions = {
    width: 550,
    height: 330,
  };

  export const chestImageMissionCompleteDimensions = {
    width: 160,
    height: 180,
  };

  // Multi-use button dimensions
  export const sideMenuButtonDimensions = {
    width: 175,
    height: 72,
  };

  export const longButtonDimensions = {
    width: 201,
    height: 35,
  };

  export const smallButtonDimensions = {
    width: 89,
    height: 89,
  };

  // ==================== bloombeasts\ui\screens\ScreenUtils.ts ====================

  /**
   * Utilities for screen components
   * Provides type-safe ways to work with dynamic UI components
   */


  /**
   * Type annotation for UINode - since UINode is dynamically loaded, we use 'any' type
   */
  export type UINodeType<T = any> = any;

  /**
   * UI wrapper for RuntimeCard with additional UI properties
   * These are properties used in the UI but not in the core game model
   */
  export interface UICardDisplay {
    // The runtime card data
    card: RuntimeCard;
    // Add emoji based on affinity
    emoji?: string;
    // Use level as rarity indicator
    rarityLevel?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
    // Map attack/defense/health for display
    attack?: number;
    defense?: number;
    health?: number;
  }

  /**
   * Convert RuntimeCard to UICardDisplay with additional UI properties
   */
  export function toUICard(card: RuntimeCard): UICardDisplay {
    const uiCard: UICardDisplay = {
      card: card,
      attack: 'baseAttack' in card ? card.baseAttack : undefined,
      defense: 0, // Not in RuntimeCard - using 0 as default
      health: 'baseHealth' in card ? card.baseHealth : undefined,
      emoji: getCardEmoji(card),
      rarityLevel: getCardRarity(card)
    };
    return uiCard;
  }

  /**
   * Get emoji based on card affinity
   */
  function getCardEmoji(card: RuntimeCard): string {
    // Check if card has affinity property (Beast, Buff, Habitat cards)
    const affinity = 'affinity' in card ? (card as any).affinity : undefined;
    switch (affinity?.toLowerCase()) {
      case 'fire':
        return '🔥';
      case 'water':
        return '💧';
      case 'forest':
        return '🌿';
      case 'sky':
        return '☁️';
      default:
        return '✨';
    }
  }

  /**
   * Determine rarity based on card level
   */
  function getCardRarity(card: RuntimeCard): 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' {
    const level = card.level || 1;
    if (level >= 10) return 'legendary';
    if (level >= 7) return 'epic';
    if (level >= 5) return 'rare';
    if (level >= 3) return 'uncommon';
    return 'common';
  }

  /**
   * Extend MissionDisplay with UI properties
   */
  export interface UIMissionDisplay {
    id: string;
    name: string;
    level: number;
    difficulty: string;
    isAvailable: boolean;
    isCompleted: boolean;
    description: string;
    affinity?: 'Forest' | 'Water' | 'Fire' | 'Sky' | 'Boss';
    beastId?: string;
    // Additional UI properties
    progress?: number;
    requirement?: number;
    rewards?: {
      coins?: number;
    };
  }

  // ==================== bloombeasts\ui\constants\positions.ts ====================

  // Type definitions
  export interface SimplePosition {
    x: number;
    y: number;
  }

  interface PlayerCardPositions {
    beastOne: SimplePosition;
    beastTwo: SimplePosition;
    beastThree: SimplePosition;
    buffOne: SimplePosition;
    buffTwo: SimplePosition;
    trapOne: SimplePosition;
    trapTwo: SimplePosition;
    trapThree: SimplePosition;
    health: SimplePosition;
    energy: SimplePosition;
    deckCount: SimplePosition;
  }

  interface CardTextInfo extends SimplePosition {
    size: number;
    textAlign?: 'left' | 'right' | 'center' | 'start' | 'end';
    textBaseline?: 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom';
  }

  export interface CardTextPositions {
    cost: CardTextInfo;
    affinity: SimplePosition;
    level: CardTextInfo;
    experienceBar: SimplePosition;
    name: CardTextInfo;
    ability: CardTextInfo;
    attack: CardTextInfo;
    health: CardTextInfo;
    beastImage: SimplePosition;
    icons: {
      attack: CardTextInfo;
      ability: CardTextInfo;
    };
  }

  export interface UIButtonPositions {
    x: number;
    y: number;
    width: number;
    height: number;
    spacing: number;
  }

  export interface UITextSafeZone {
    x: number;
    y: number;
    lineHeight: number;
  }

  export interface SideMenuPositions {
    x: number;
    y: number;
    headerStartPosition: SimplePosition;
    textStartPosition: SimplePosition;
    buttonStartPosition: SimplePosition;
    playerName: CardTextInfo;
    playerLevel: CardTextInfo;
    playerExperienceBar: SimplePosition & { maxWidth: number };
  }

  export interface BattleBoardAssetPositions {
    playerOne: PlayerCardPositions;
    playOneInfoPosition: SimplePosition;
    playerTwo: PlayerCardPositions;
    playerTwoInfoPosition: SimplePosition;
    habitatZone: SimplePosition;
    cardTextPositions: CardTextPositions;
  }


  /**
   * Safe zone for UI buttons and interactive elements
   * This position ensures elements won't be covered by platform-specific UI (status bars, navigation, etc.)
   */
  export const uiSafeZoneButtons: UIButtonPositions = {
    x: 1149,
    y: 131,
    width: DIMENSIONS.button.minWidth,
    height: DIMENSIONS.button.height,
    spacing: DIMENSIONS.spacing.xxl * 2, // Vertical spacing between stacked buttons
  };

  /**
   * Safe zone for text display (titles, counters, etc.)
   * This area is safe for displaying informational text
   */
  export const uiSafeZoneText: UITextSafeZone = {
    x: 1152,
    y: 407,
    lineHeight: DIMENSIONS.spacing.xl, // Vertical spacing between lines of text
  };

  /**
   * Side menu positions
   * The side menu contains player info, text, and buttons
   */
  export const sideMenuPositions: SideMenuPositions = {
    x: 1045,  // Moved 100px left
    y: 128,
    headerStartPosition: { x: 1070, y: 152 },  // Moved 100px left
    textStartPosition: { x: 1082, y: 240 },  // Moved 100px left
    buttonStartPosition: { x: 1070, y: 304 },  // Moved 100px left and up (text area now half size)
    playerName: { x: 10, y: 426, textAlign: 'left', textBaseline: 'top', size: DIMENSIONS.fontSize.sm },
    playerLevel: { x: 64, y: 445, textAlign: 'center', textBaseline: 'top', size: DIMENSIONS.fontSize.xs },
    playerExperienceBar: { x: 9, y: 445, maxWidth: 109 },
  };

  /**
   * Mission complete popup card positions
   */
  export const missionCompleteCardPositions = {
    title: { x: 275, y: 24, size: DIMENSIONS.fontSize.title, textAlign: 'center', textBaseline: 'top' },
    chestImage: { x: 73, y: 76 },
    infoText: { x: 245, y: 98, size: DIMENSIONS.fontSize.sm, textAlign: 'left', textBaseline: 'top' },
    claimRewardButton: { x: 175, y: 271 },
  };

  // ==================== bloombeasts\ui\types\bindings.ts ====================

  /**
   * Binding Type Declarations
   *
   * These are type-only declarations for reactive data bindings.
   * Actual implementations are provided by the platform via UIMethodMappings.
   */

  /**
   * Base class for value bindings
   */
  declare class ValueBindingBase<T> {
    protected _key: string;
    protected _isInitialized: boolean;
  }

  /**
   * Reactive data binding
   * Matches Horizon's Binding API (no get() or subscribe() methods)
   */
  declare class Binding<T = any> extends ValueBindingBase<T> {
    constructor(value: T);
    set(value: T | ((prev: T) => T)): void;
    derive<U>(fn: (value: T) => U): Binding<U>;
    static derive<T extends any[], R>(
      bindings: { [K in keyof T]: Binding<T[K]> },
      deriveFn: (...values: T) => R
    ): Binding<R>;
  }

  /**
   * Platform async methods interface
   * Provides setTimeout, setInterval, clearTimeout, clearInterval
   *
   * For web: Uses standard window.setTimeout, etc.
   * For Horizon: Uses component.async.setTimeout, etc.
   */
  export interface AsyncMethods {
    /**
     * Sets a timer which executes a function once the timer expires
     */
    setTimeout: (callback: (...args: any[]) => void, timeout?: number) => number;

    /**
     * Cancels a timeout previously established by setTimeout
     */
    clearTimeout: (id: number) => void;

    /**
     * Repeatedly calls a function with a fixed time delay between calls
     */
    setInterval: (callback: (...args: any[]) => void, timeout?: number) => number;

    /**
     * Cancels a timed, repeating action established by setInterval
     */
    clearInterval: (id: number) => void;
  }

  // ==================== bloombeasts\ui\common\Button.ts ====================

  /**
   * Common Button Component
   * Reusable button with hover effects and sound
   */


  export type ButtonType = 'default' | 'short' | 'long';
  export type ButtonColor = 'default' | 'red' | 'green';

  export interface ButtonProps {
    ui: UIMethodMappings;
    label: string | ValueBindingBase<string> | ReadonlyBindingInterface<string>;
    onClick: () => void;
    type?: ButtonType;

    // Simple usage: just pass color string (static)
    color?: ButtonColor;
    disabled?: boolean | ValueBindingBase<boolean> | ReadonlyBindingInterface<boolean>;

    // Advanced usage: pass complete bindings that return final computed values
    // Use these when you need reactive bindings (avoids .derive() on derived bindings)
    imageSource?: any; // Binding or static image source for button background
    opacity?: any; // Binding or static opacity value (0-1)
    textColor?: any; // Binding or static text color string

    playSfx?: (sfxId: string) => void;
    style?: any; // Additional style overrides
  }

  /**
   * Get button dimensions based on type
   */
  function getButtonDimensions(type: ButtonType): { width: number; height: number } {
    switch (type) {
      case 'short':
        return { width: 80, height: 36 };
      case 'long':
        return longButtonDimensions;
      case 'default':
      default:
        return sideMenuButtonDimensions;
    }
  }

  /**
   * Get button asset ID based on color and type
   */
  function getButtonAssetId(color: ButtonColor, type: ButtonType): string {
    // Long buttons have their own green variant
    if (type === 'long' && color === 'green') {
      return 'long-green-button';
    }

    // Standard color mapping
    switch (color) {
      case 'red':
        return 'red-button';
      case 'green':
        return 'green-button';
      case 'default':
      default:
        return 'standard-button';
    }
  }

  /**
   * Create a common button with hover effects and sound
   *
   * Two usage patterns:
   * 1. Simple: Pass static `color` and `disabled` props (for static buttons)
   * 2. Advanced: Pass complete `imageSource`, `opacity`, `textColor` bindings
   *    (for reactive buttons - avoids calling .derive() on derived bindings)
   */
  export function createButton(props: ButtonProps): UINodeType {
    const {
      ui,
      label,
      onClick,
      type = 'default',
      color = 'default',
      disabled = false,
      imageSource: customImageSource,
      opacity: customOpacity,
      textColor: customTextColor,
      playSfx,
      style = {},
    } = props;

    const dimensions = getButtonDimensions(type);

    // Use custom bindings if provided, otherwise compute from color/disabled
    const imageSource = customImageSource ?? (ui.assetIdToImageSource?.(getButtonAssetId(color, type)) || null);

    // For opacity and textColor:
    // - If custom values provided, use them (supports reactive bindings)
    // - If disabled is a static boolean, use it to determine appearance
    // - If disabled is a binding, use enabled appearance by default
    //   (caller should provide customOpacity/customTextColor for reactive appearance)
    const opacity = customOpacity ?? (
      (typeof disabled === 'boolean' && disabled) ? 0.5 : 1.0
    );
    const textColor = customTextColor ?? (
      (typeof disabled === 'boolean' && disabled) ? '#888' : COLORS.textPrimary
    );

    return ui.Pressable({
      onClick: () => {
        if (playSfx) {
          playSfx('sfx-menu-button-select');
        }
        onClick();
      },
      disabled: disabled,
      style: {
        width: dimensions.width,
        height: dimensions.height,
        ...style,
      },
      children: [
        // Button background image
        ui.Image({
          source: imageSource,
          style: {
            position: 'absolute',
            width: dimensions.width,
            height: dimensions.height,
            opacity: opacity,
          },
        }),
        // Button text centered
        ui.View({
          style: {
            position: 'absolute',
            width: dimensions.width,
            height: dimensions.height,
            justifyContent: 'center',
            alignItems: 'center',
          },
          children: ui.Text({
            text: label,
            style: {
              fontSize: style.fontSize ?? DIMENSIONS.fontSize.md,
              color: textColor,
              textAlign: style.textAlign ?? 'center',
              fontWeight: style.fontWeight ?? 'bold',
              textAlignVertical: 'center',
              marginTop: style.paddingTop ?? 0,
            },
          }),
        }),
      ],
    });
  }

  // ==================== bloombeasts\ui\types\BindingManager.ts ====================

  /**
   * Centralized Binding Manager
   * Horizon has a strict binding limit (~10 bindings total)
   * This manager provides controlled access to all bindings in the app
   */


  export enum BindingType {
    PlayerData = 'playerData',
    CurrentScreen = 'currentScreen',
    IntervaledBinding = 'intervaledBinding', // runs every 200ms to change the frame animation
    Missions = 'missions',
    LeaderboardData = 'leaderboardData',
    BattleDisplay = 'battleDisplay',
    MissionCompletePopup = 'missionCompletePopup',
    ForfeitPopup = 'forfeitPopup',
    CardDetailPopup = 'cardDetailPopup',
    UIState = 'uiState', // Consolidated UI state (scroll, selected items, timers, etc.)
  }

  /**
   * Consolidated UI State
   * Replaces multiple screen-local bindings with single state object
   */
  export interface UIState {
    // BattleScreen state
    battle?: {
      showHand: boolean;
      handScrollOffset: number;
      playerTimer: number;
      opponentTimer: number;
      selectedCardDetail: any | null;
    };

    // CardsScreen state
    cards?: {
      selectedCardId: string | null;
      scrollOffset: number;
    };

    // MissionScreen state
    missions?: {
      scrollOffset?: number;
    };

    // UpgradeScreen state
    upgrade?: {
      selectedUpgradeId: string | null;
    };
  }

  export interface BindingManagerInterface {
    /**
     * Create a derived value from one or more bindings
     * This is the ONLY way to create derived bindings in the app
     */
    derive<T>(bindingTypes: BindingType[], deriveFn: (...values: any[]) => T): any;

    /**
     * Get a binding directly (for setting values)
     */
    setBinding(bindingType: BindingType, value: any): void;

    /**
     * Get a snapshot of the current value of a binding.
     * Note: Use carefully, ideally only for on click events when you need to access the current value of a binding.
     */
    getSnapshot(bindingType: BindingType): any;

    /**
     * Get the raw binding object for a specific binding type
     * Use this to call .derive() on a single binding
     */
    getBinding(bindingType: BindingType): any;

    /**
     * Legacy accessor for PlayerData binding
     * @deprecated Use getBinding(BindingType.PlayerData) instead
     */
    readonly playerDataBinding: { binding: any };
  }

  export class BindingManager implements BindingManagerInterface {
    private bindings: Map<BindingType, {
      binding: any;
      snapshot: any;
    }>;
    private BindingClass: any;
    private async: AsyncMethods;

    constructor(BindingClass: any, async: AsyncMethods) {
      this.BindingClass = BindingClass;
      this.async = async;
      this.bindings = new Map();

      // Initialize ALL bindings here (single source of truth)
      // PlayerData binding - must start with valid structure due to Horizon limitation
      this.bindings.set(BindingType.PlayerData, this.createBindingEntry({
        name: '',
        totalXP: 0,
        coins: 0,
        items: [],
        cards: { collected: [], deck: [] },
        missions: { completedMissions: {} },
        boosts: {
          'coin-boost': 0,
          'exp-boost': 0,
          'luck-boost': 0,
          'rooster': 0
        },
        settings: { musicVolume: 10, sfxVolume: 50, musicEnabled: true, sfxEnabled: true }
      }));

      // Menu state binding - use a simple counter instead of timestamp
      this.bindings.set(BindingType.IntervaledBinding, this.createBindingEntry(0));
      let frameCounter = 0;
      this.async.setInterval(() => {
        frameCounter = (frameCounter + 1) % 1000; // Reset every 1000 to prevent overflow
        this.setBinding(BindingType.IntervaledBinding, frameCounter);
      }, 200);

      // UI navigation binding
      this.bindings.set(BindingType.CurrentScreen, this.createBindingEntry('loading'));

      // Mission data binding
      this.bindings.set(BindingType.Missions, this.createBindingEntry([]));

      // Leaderboard data binding
      this.bindings.set(BindingType.LeaderboardData, this.createBindingEntry());

      // Battle display binding
      this.bindings.set(BindingType.BattleDisplay, this.createBindingEntry());

      // Popup bindings
      this.bindings.set(BindingType.MissionCompletePopup, this.createBindingEntry());
      this.bindings.set(BindingType.ForfeitPopup, this.createBindingEntry());
      this.bindings.set(BindingType.CardDetailPopup, this.createBindingEntry());

      // Consolidated UI state binding
      this.bindings.set(BindingType.UIState, this.createBindingEntry({
        battle: {
          showHand: true,
          handScrollOffset: 0,
          playerTimer: 0,
          opponentTimer: 0,
          selectedCardDetail: null,
        },
        cards: {
          selectedCardId: null,
          scrollOffset: 0,
        },
        missions: {
          scrollOffset: 0,
        },
        menu: {
          displayedText: '',
          frameAnimation: '',
        },
        upgrade: {
          selectedUpgradeId: null,
        },
      }));

    }

    derive<T>(bindingTypes: BindingType[], deriveFn: (...values: any[]) => T): any {
      // Get the actual binding objects
      const actualBindings = bindingTypes.map(type => {
        const binding = this.bindings.get(type);
        if (!binding) {
          throw new Error(`Binding not found: ${type}`);
        }
        return binding.binding;
      });

      if (actualBindings.length === 1) {
        return actualBindings[0].derive(deriveFn);
      }
      return this.BindingClass.derive(actualBindings, deriveFn);
    }

    setBinding(bindingType: BindingType, value: any): void {
      const binding = this.bindings.get(bindingType);
      if (!binding) {
        throw new Error(`Binding not found: ${bindingType}`);
      }
      binding.binding.set(value);
      binding.snapshot = value;
    }

    getSnapshot(bindingType: BindingType): any {
      const binding = this.bindings.get(bindingType);
      if (!binding) {
        throw new Error(`Binding not found: ${bindingType}`);
      }
      return binding.snapshot;
    }

    getBinding(bindingType: BindingType): any {
      const binding = this.bindings.get(bindingType);
      if (!binding) {
        throw new Error(`Binding not found: ${bindingType}`);
      }
      return binding.binding;
    }

    /**
     * Legacy accessor for PlayerData binding
     * Returns an object with a 'binding' property for backwards compatibility
     */
    get playerDataBinding(): { binding: any } {
      const binding = this.bindings.get(BindingType.PlayerData);
      if (!binding) {
        throw new Error(`PlayerData binding not found`);
      }
      return { binding: binding.binding };
    }

    private createBindingEntry(value: any = null): { binding: any, snapshot: any } {
      return {
        binding: new this.BindingClass(value),
        snapshot: value,
      };
    }
  }

  // ==================== bloombeasts\ui\screens\common\SideMenu.ts ====================

  /**
   * Common Side Menu Component
   * Shared sidebar used across all unified screens (Horizon & Web)
   */


  // SideMenu-specific constants
  const sideMenuDimensions = {
    width: 225,
    height: 497,
  };

  export interface SideMenuButton {
      label: string | ValueBindingBase<string>;
      onClick: () => void;
      disabled?: boolean | ValueBindingBase<boolean>;
      opacity?: any; // Binding or static opacity value
      textColor?: any; // Binding or static text color value
      yOffset?: number; // Vertical offset from buttonStartPosition
  }

  export interface SideMenuConfig {
      /** Title text displayed at headerStartPosition */
      title?: string | ValueBindingBase<string>;
      /** Custom content items to display at textStartPosition */
      customTextContent?: UINodeType[];
      /** Buttons to display at buttonStartPosition */
      buttons?: SideMenuButton[];
      /** Bottom button at headerStartPosition */
      bottomButton?: SideMenuButton;
      /** Callback for XP bar click */
      onXPBarClick?: (title: string, message: string) => void;
      /** Callback for playing sound effects */
      playSfx?: (sfxId: string) => void;
  }

  /**
   * Create a common sidebar used across all screens
   */
  export function createSideMenu(ui: UIMethodMappings, config: SideMenuConfig): UINodeType {
      const children: UINodeType[] = [];

      // Calculate positions relative to sidebar origin (using sideMenuPositions)
      const headerRelativeX = sideMenuPositions.headerStartPosition.x - sideMenuPositions.x;
      const headerRelativeY = sideMenuPositions.headerStartPosition.y - sideMenuPositions.y;
      const textRelativeX = sideMenuPositions.textStartPosition.x - sideMenuPositions.x;
      const textRelativeY = sideMenuPositions.textStartPosition.y - sideMenuPositions.y;
      const buttonRelativeX = sideMenuPositions.buttonStartPosition.x - sideMenuPositions.x;
      const buttonRelativeY = sideMenuPositions.buttonStartPosition.y - sideMenuPositions.y;

      // Title at headerStartPosition (if provided)
      if (config.title) {
          children.push(
              ui.View({
                  style: {
                      position: 'absolute',
                      left: headerRelativeX,
                      top: headerRelativeY,
                  },
                  children: ui.Text({
                      text: config.title,
                      style: {
                          fontSize: DIMENSIONS.fontSize.md,
                          color: COLORS.textPrimary,
                          fontWeight: 'bold',
                      },
                  }),
              })
          );
      }

      // Custom text content at textStartPosition
      if (config.customTextContent && config.customTextContent.length > 0) {
          children.push(
              ui.View({
                  style: {
                      position: 'absolute',
                      left: textRelativeX,
                      top: textRelativeY,
                      flexDirection: 'column',
                  },
                  children: config.customTextContent,
              })
          );
      }

      // Buttons at buttonStartPosition
      if (config.buttons && config.buttons.length > 0) {
          children.push(
              ui.View({
                  style: {
                      position: 'absolute',
                      left: buttonRelativeX,
                      top: buttonRelativeY,
                      flexDirection: 'column',
                  },
                  children: config.buttons.map((button, index) =>
                      createButton({
                          ui,
                          label: button.label,
                          onClick: button.onClick,
                          disabled: button.disabled,
                          playSfx: config.playSfx,
                          style: {
                              // Use marginBottom for spacing between buttons (except last button)
                              marginBottom: index < config.buttons!.length - 1 ? GAPS.buttons : 0,
                          },
                      })
                  ),
              })
          );
      }

      // Player info removed - no longer displayed in side menu

      // Bottom button (if provided, at headerStartPosition)
      if (config.bottomButton) {
          children.push(
              createButton({
                  ui,
                  label: config.bottomButton.label,
                  onClick: config.bottomButton.onClick,
                  disabled: config.bottomButton.disabled,
                  playSfx: config.playSfx,
                  style: {
                      position: 'absolute',
                      left: headerRelativeX,
                      top: headerRelativeY,
                  },
              })
          );
      }

      return ui.View({
          style: {
              position: 'absolute',
              left: sideMenuPositions.x,
              top: sideMenuPositions.y,
              width: sideMenuDimensions.width,
              height: sideMenuDimensions.height,
              flexDirection: 'column',
          },
          children: [
              // Sidebar background image - assets preload automatically
              ui.Image({
                  source: ui.assetIdToImageSource?.('container-side-menu') || null,
                  style: {
                      position: 'absolute',
                      width: sideMenuDimensions.width,
                      height: sideMenuDimensions.height,
                      top: 0,
                      left: 0,
                  },
              }),
              // Sidebar content
              ...children,
          ],
      });
  }

  /**
   * Create player info display (name, level and XP text)
   * Positioned using sideMenuPositions
   */
  function createPlayerInfo(
      ui: UIMethodMappings,
      onXPBarClick?: (title: string, message: string) => void
  ): UINodeType {
      // Helper to get item quantity
      const getItemQuantity = (items: any[], itemId: string) => {
          const item = items?.find((i: any) => i.itemId === itemId);
          return item ? item.quantity : 0;
      };

      // Helper to extract MenuStats from PlayerData
      const extractStats = (pd: any): MenuStats | null => {
          if (!pd) return null;
          return {
              playerLevel: pd.playerLevel || 1,
              totalXP: pd.totalXP || 0,
              coins: pd.coins || 0,
              serums: getItemQuantity(pd.items || [], 'serum'),
          };
      };

      // XP text only (level is now in player stats container)
      const xpTextBinding = ui.bindingManager.playerDataBinding.binding.derive((data: any) => {
          const statsVal = extractStats(data);
          if (!statsVal) return '0/100';

          const xpThresholds = [0, 100, 300, 700, 1500, 3100, 6300, 12700, 25500];
          const currentLevel = statsVal.playerLevel;
          const totalXP = statsVal.totalXP;
          const xpForCurrentLevel = xpThresholds[currentLevel - 1];
          const xpForNextLevel = currentLevel < 9 ? xpThresholds[currentLevel] : xpThresholds[8];
          const currentXP = totalXP - xpForCurrentLevel;
          const xpNeeded = xpForNextLevel - xpForCurrentLevel;

          return `${currentXP}/${xpNeeded}`;
      });

      return ui.View({
          style: {
              position: 'relative',
          },
          children: [
              // Player name
              ui.View({
                  style: {
                      position: 'absolute',
                      left: sideMenuPositions.playerName.x,
                      top: 0,
                  },
                  children: ui.Text({
                      text: 'Player',
                      style: {
                          fontSize: sideMenuPositions.playerName.size,
                          color: COLORS.textPrimary,
                          textAlign: sideMenuPositions.playerName.textAlign as any,
                      },
                  }),
              }),

              // XP text only
              ui.View({
                  style: {
                      position: 'absolute',
                      left: sideMenuPositions.playerName.x,
                      top: 19,
                  },
                  children: ui.Text({
                      text: xpTextBinding,
                      style: {
                          fontSize: DIMENSIONS.fontSize.xs,
                          color: COLORS.textSecondary,
                      },
                  }),
              }),
          ],
      });
  }

  /**
   * Helper: Create a text row component
   */
  export function createTextRow(ui: UIMethodMappings, text: string | ValueBindingBase<string>, top: number = 0): UINodeType {
      return ui.View({
          style: {
              position: 'absolute',
              top: top,
          },
          children: ui.Text({
              text: text,
              style: {
                  fontSize: DIMENSIONS.fontSize.md,
                  color: COLORS.textPrimary,
              },
          }),
      });
  }

  /**
   * Helper: Create a resource row (emoji + count)
   */
  export function createResourceRow(ui: UIMethodMappings, 
      emoji: string,
      amount: number | ValueBindingBase<number>,
      top: number = 0
  ): UINodeType {
      const amountText = typeof amount === 'number'
          ? `${emoji} ${amount}`
          : (amount as any).derive((a: number) => `${emoji} ${a}`);

      return ui.View({
          style: {
              position: 'absolute',
              top: top,
          },
          children: ui.Text({
              text: amountText,
              style: {
                  fontSize: 18,
                  color: COLORS.textPrimary,
              },
          }),
      });
  }

  // ==================== bloombeasts\ui\screens\MenuScreen.ts ====================

  /**
   * Unified Menu Screen Component
   * Works on both Horizon and Web platforms
   * Matches the styling from menuScreen.new.ts
   */


  export interface MenuScreenProps {
    ui: UIMethodMappings;
    onButtonClick?: (buttonId: string) => void;
    onNavigate?: (screen: string) => void;
    onRenderNeeded?: () => void;
    playSfx?: (sfxId: string) => void;
  }

  /**
   * Unified Menu Screen that works on both platforms
   */
  export class MenuScreen {
    // UI methods (injected)
    private ui: UIMethodMappings;


    // Menu frame IDs
    private menuFrameIds: string[] = [
      'menu-frame-1', 'menu-frame-2', 'menu-frame-3', 'menu-frame-4', 'menu-frame-5',
      'menu-frame-6', 'menu-frame-7', 'menu-frame-8', 'menu-frame-9', 'menu-frame-10',
    ];

    private quotes: string[] = [
      'Welcome back, Trainer!',
    ];

    // Callbacks
    private onButtonClick?: (buttonId: string) => void;
    private onNavigate?: (screen: string) => void;
    private onRenderNeeded?: () => void;
    private playSfx?: (sfxId: string) => void;

    constructor(props: MenuScreenProps) {
      this.ui = props.ui;
      this.onButtonClick = props.onButtonClick;
      this.onNavigate = props.onNavigate;
      this.onRenderNeeded = props.onRenderNeeded;
      this.playSfx = props.playSfx;

    }

    /**
     * Create the unified menu UI - uses common side menu
     */
    createUI(): UINodeType {
      const menuOptions = ['cards', 'upgrades', 'leaderboard', 'settings'];  // Removed 'missions'
      const lineHeight = DIMENSIONS.fontSize.lg + 5;

      // Create menu buttons for the side menu
      const menuButtons = menuOptions.map((option, index) => ({
        label: this.getMenuLabel(option),
        onClick: () => {
          if (this.onButtonClick) {
            this.onButtonClick(`btn-${option}`);
          }
          if (this.onNavigate) {
            this.onNavigate(option);
          }
        },
        disabled: false,
        yOffset: index * (sideMenuButtonDimensions.height + GAPS.buttons),
      }));

      const customTextContent = [
        this.ui.View({
          style: {
            position: 'relative',
          },
          children: [
            // Quote text (lines 0-2)
            this.ui.View({
              style: {
                position: 'absolute',
                top: 0,
                width: 150,
              },
              children: this.ui.Text({
                text: this.quotes[0], // TODO: listen on intervaled binding to change the quote
                numberOfLines: 2,
                style: {
                  fontSize: DIMENSIONS.fontSize.lg,
                  color: COLORS.textPrimary,
                  lineHeight: lineHeight,
                },
              }),
            }),
          ],
        }),
      ];

      return this.ui.View({
        style: {
          width: '100%',
          height: '100%',
          position: 'relative',
        },
        children: [
          // Background image (full screen)
          this.ui.Image({
            source: this.ui.assetIdToImageSource?.('background') || null,
            style: {
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
            },
          }),

          // Main content area with animated character
          this.ui.View({
            style: {
              position: 'absolute',
              width: '100%',
              height: '100%',
            },
            children: [
              // Animated character frame - derive directly from UIState
              this.ui.Image({
                  source: this.ui.assetIdToImageSource?.(this.menuFrameIds[0]) || null,
                  // source: this.ui.bindingManager.derive([BindingType.IntervaledBinding], (counter: number) => {
                  //   const frameId = this.menuFrameIds[counter % this.menuFrameIds.length];
                  //   return this.ui.assetIdToImageSource?.(frameId) || null;
                  // }),
                  style: {
                    position: 'absolute',
                    left: 290,
                    top: 40,
                    width: 675,
                    height: 630,
                  },
                }),
            ],
          }),

          // Player stats container at top middle
          this.createPlayerStatsContainer(),

          // "Play" button in the middle of the page, slightly down
          createButton({
            ui: this.ui,
            label: 'Play',
            onClick: () => {
              if (this.onButtonClick) {
                this.onButtonClick('btn-missions');
              }
              if (this.onNavigate) {
                this.onNavigate('missions');
              }
            },
            imageSource: this.ui.assetIdToImageSource?.('yellow-button') || null,
            playSfx: this.playSfx,
            style: {
              fontSize: 32,
              fontWeight: 'bold',
              textAlign: 'center',
              // paddingTop: 4,
              position: 'absolute',
              left: 552,  // Centered horizontally (1280/2 - 175/2 ≈ 552)
              top: 400,   // Slightly down from center
            },
          }),

          // Side menu (positioned absolutely on top)
          createSideMenu(this.ui, {
            customTextContent,
            buttons: menuButtons,
            bottomButton: {
              label: 'Close',
              onClick: () => {}, // Disabled button
              disabled: true,
            },
            onXPBarClick: (title: string, message: string) => {
              if (this.onButtonClick) {
                this.onButtonClick(`show-counter-info:${title}:${message}`);
              }
            },
            playSfx: this.playSfx,
          }),
        ],
      });
    }

    /**
     * Get menu label for option
     */
    private getMenuLabel(option: string): string {
      const labels: Record<string, string> = {
        missions: 'Missions',
        cards: 'Cards',
        upgrades: 'Upgrades',
        leaderboard: 'Leaderboard',
        settings: 'Settings',
      };
      return labels[option] || option;
    }

    /**
     * Create player stats container at top middle
     */
    private createPlayerStatsContainer(): UINodeType {
      const containerWidth = 487;
      const containerHeight = 82;
      const screenWidth = 1280;
      const containerX = (screenWidth - containerWidth) / 2;
      const containerY = 20;

      // Icon dimensions
      const iconSize = 28;

      // Helper to get item quantity
      const getItemQuantity = (items: any[], itemId: string) => {
        const item = items?.find((i: any) => i.itemId === itemId);
        return item ? item.quantity : 0;
      };

      // Binding for level text with XP
      const levelTextBinding = this.ui.bindingManager.playerDataBinding.binding.derive((data: any) => {
        if (!data) return 'Lvl 1. 0/100';
        const xpThresholds = [0, 100, 300, 700, 1500, 3100, 6300, 12700, 25500];
        const playerLevel = data.playerLevel || 1;
        const totalXP = data.totalXP || 0;
        const xpForCurrentLevel = xpThresholds[playerLevel - 1];
        const xpForNextLevel = playerLevel < 9 ? xpThresholds[playerLevel] : xpThresholds[8];
        const currentXP = totalXP - xpForCurrentLevel;
        const xpNeeded = xpForNextLevel - xpForCurrentLevel;
        return `Lvl ${playerLevel}. ${currentXP}/${xpNeeded}`;
      });

      // Binding for coins
      const coinsBinding = this.ui.bindingManager.playerDataBinding.binding.derive((data: any) => {
        if (!data) return '0';
        return String(data.coins || 0);
      });

      // Binding for serums
      const serumsBinding = this.ui.bindingManager.playerDataBinding.binding.derive((data: any) => {
        if (!data) return '0';
        const serums = getItemQuantity(data.items || [], 'serum');
        return String(serums);
      });

      return this.ui.View({
        style: {
          position: 'absolute',
          left: containerX,
          top: containerY,
          width: containerWidth,
          height: containerHeight,
        },
        children: [
          // Background container image
          this.ui.Image({
            source: this.ui.assetIdToImageSource?.('player-stats-container') || null,
            style: {
              position: 'absolute',
              width: containerWidth,
              height: containerHeight,
              top: 0,
              left: 0,
            },
          }),

          // Level text - left aligned
          this.ui.View({
            style: {
              position: 'absolute',
              left: 85,
              top: 29,
            },
            children: this.ui.Text({
              text: levelTextBinding,
              style: {
                fontSize: DIMENSIONS.fontSize.lg,
                color: COLORS.textPrimary,
                fontWeight: 'bold',
                textAlign: 'left',
              },
            }),
          }),

          // Coins section (icon + text) - centered in middle section
          this.ui.View({
            style: {
              position: 'absolute',
              left: 250,
              top: 28,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            },
            children: [
              // Coin icon
              this.ui.Image({
                source: this.ui.assetIdToImageSource?.('icon-coin') || null,
                style: {
                  width: iconSize,
                  height: iconSize,
                },
              }),
              // Coin amount - black text
              this.ui.Text({
                text: coinsBinding,
                style: {
                  fontSize: DIMENSIONS.fontSize.lg,
                  color: '#000000',
                  fontWeight: 'bold',
                  marginLeft: 4,
                },
              }),
            ],
          }),

          // Serums section (icon + text) - centered in right section
          this.ui.View({
            style: {
              position: 'absolute',
              left: 370,
              top: 28,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            },
            children: [
              // Serum icon
              this.ui.Image({
                source: this.ui.assetIdToImageSource?.('icon-serum') || null,
                style: {
                  width: iconSize,
                  height: iconSize,
                },
              }),
              // Serum amount - black text
              this.ui.Text({
                text: serumsBinding,
                style: {
                  fontSize: DIMENSIONS.fontSize.lg,
                  color: '#000000',
                  fontWeight: 'bold',
                  marginLeft: 4,
                },
              }),
            ],
          }),
        ],
      });
    }

    dispose() {
    }
  }

  // ==================== bloombeasts\ui\constants\emojis.ts ====================

  export const energyEmoji = '⚡';
  export const missionEmoji = '🎯';
  export const deckEmoji = '🎲';
  export const playerLevelEmoji = '💪';
  export const playerExperienceEmoji = '🧪';

  // ==================== bloombeasts\screens\common\types.ts ====================

  /**
   * Minimal card instance in player's collection
   * All other data (level, stats, etc.) is computed on-demand from currentXP and card definition
   */
  export interface CardInstance {
    id: string;                    // Unique instance ID (e.g., "forest-beast-1-1")
    cardId: string;                 // Base card ID (e.g., "forest-beast")
    currentXP: number;              // Only persistent data - everything else is derived
  }

  // ==================== bloombeasts\engine\utils\abilityDescriptionGenerator.ts ====================

  /**
   * Generates human-readable descriptions from ability effects
   */


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
      case AbilityTrigger.OnOwnStartOfTurn:
        return 'At turn start,';
      case AbilityTrigger.OnOwnEndOfTurn:
        return 'At turn end,';
      case AbilityTrigger.WhileOnField:
        return '';
      default:
        return '';
    }
  }

  /**
   * Get cost text
   */
  function getCostText(cost: any): string {
    if (cost.type === 'energy') {
      return `Pay ${cost.value} Energy:`;
    }
    if (cost.type === 'discard') {
      return `Discard ${cost.value} card${cost.value > 1 ? 's' : ''}:`;
    }
    if (cost.type === 'sacrifice') {
      return `Sacrifice ${cost.value} unit${cost.value > 1 ? 's' : ''}:`;
    }
    // Counter costs removed
    return '';
  }

  /**
   * Get target text
   */
  function getTargetText(target: AbilityTarget): string {
    switch (target) {
      case AbilityTarget.Self:
        return 'this';
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
      case AbilityTarget.Opponent:
        return 'opponent';
      case AbilityTarget.Player:
        return 'you';
      case AbilityTarget.RandomEnemy:
        return 'random enemy';
      case AbilityTarget.RandomAlly:
        return 'random ally';
      case AbilityTarget.AllUnits:
        return 'all Beasts';
      case AbilityTarget.OtherAlly:
        return 'another ally';
      case AbilityTarget.AttackedEnemy:
        return 'attacked enemy';
      case AbilityTarget.PlayedCard:
        return 'played card';
      case AbilityTarget.LowestHealthEnemy:
        return 'lowest health enemy';
      case AbilityTarget.HighestAttackEnemy:
        return 'highest attack enemy';
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

      // Counter effects removed

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
        if (effect.resource === ResourceType.Energy) {
          return `gain ${effect.value} Energy${duration ? ` ${duration}` : ''}`;
        }
        if (effect.resource === ResourceType.ExtraEnergyPlay) {
          return `play ${effect.value} additional Energy Card${effect.value > 1 ? 's' : ''}${duration ? ` ${duration}` : ''}`;
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

  // ==================== bloombeasts\engine\utils\getAbilityDescription.ts ====================

  /**
   * Helper function to get ability description
   * Generates description from ability effects
   */


  /**
   * Get the description for an ability
   * @param ability The ability to get description for
   * @returns The description string
   */
  export function getAbilityDescription(ability: StructuredAbility): string {
    return generateAbilityDescription(ability);
  }

  // ==================== bloombeasts\engine\utils\cardDescriptionGenerator.ts ====================

  /**
   * Generates human-readable descriptions for all card types
   * (Magic, Trap, Buff, Habitat, and Bloom cards)
   */


  /**
   * Get description for any card type
   * All cards now use the standardized abilities structure
   */
  export function getCardDescription(card: any): string {
    if (!card) return '';

    // All cards use abilities array
    if (card.abilities && Array.isArray(card.abilities)) {
      // Generate descriptions for all abilities and combine them
      const abilityDescriptions = card.abilities
        .map((ability: any) => getAbilityDescription(ability))
        .filter((desc: string) => desc.length > 0);

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

    // Fallback: return card description if it exists, otherwise empty
    return card.description || '';
  }

  // ==================== bloombeasts\utils\cardUtils.ts ====================

  /**
   * Card utility functions for level/XP calculations and stat computation
   */


  // Module-level catalog manager reference for card utils
  // Set via setCatalogManagerForUtils() which is called by BloomBeastsGame
  let _cardUtilsCatalogManager: any = null;

  /**
   * Set the catalog manager instance for card utility functions
   * Called by BloomBeastsGame during construction
   */
  export function setCatalogManagerForUtils(catalogManager: any): void {
    _cardUtilsCatalogManager = catalogManager;
  }

  /**
   * Battle-specific card stats (runtime only, not persisted)
   * Created when a card enters battle, mutated during combat
   */
  export interface CardBattleStats {
    baseAttack?: number;
    currentAttack?: number;
    baseHealth?: number;
    currentHealth?: number;
    abilities?: any[];
  }

  /**
   * XP thresholds for card leveling (cumulative)
   * Level 2: 100 XP, Level 3: 300 XP, etc.
   */
  const CARD_XP_THRESHOLDS = [
    0,      // Level 1
    100,    // Level 2
    300,    // Level 3
    700,    // Level 4
    1500,   // Level 5
    3100,   // Level 6
    6300,   // Level 7
    12700,  // Level 8
    25500,  // Level 9
  ];

  /**
   * Calculate card level from current XP
   * Works for all card types (Beast, Magic, Trap, Habitat, Buff)
   * Uses standard XP thresholds for all cards
   */
  export function getCardLevel(currentXP: number): number {
    // Standard XP thresholds
    for (let level = 9; level >= 1; level--) {
      if (currentXP >= CARD_XP_THRESHOLDS[level - 1]) {
        return level;
      }
    }
    return 1;
  }

  /**
   * Calculate XP required for next level (uses standard progression)
   */
  export function getXPRequired(currentLevel: number, currentXP: number): number {
    if (currentLevel >= 9) return 0; // Max level

    const nextLevel = currentLevel + 1;

    // Standard XP requirements
    const nextLevelXP = CARD_XP_THRESHOLDS[nextLevel - 1];
    return nextLevelXP - currentXP;
  }

  export function getXPThreshold(level: number): number {
    return CARD_XP_THRESHOLDS[level - 1];
  }

  /**
   * Get card definition by ID
   */
  export function getCardDefinition(cardId: string): AnyCard | undefined {
    if (!_cardUtilsCatalogManager) {
      console.warn('[cardUtils] catalogManager not initialized');
      return undefined;
    }
    const allCards = _cardUtilsCatalogManager.getAllCardData();
    return allCards.find((c: any) => c && c.id === cardId);
  }

  /**
   * Extract base card ID (remove instance suffix)
   * e.g., "forest-beast-1-1" → "forest-beast"
   */
  export function extractBaseCardId(instanceId: string): string {
    if (!instanceId) return '';
    return instanceId.replace(/-\d+-\d+$/, '');
  }

  // CardDisplay and computeCardDisplay have been removed.
  // Use RuntimeCard directly (from engine/types/runtime).
  // To convert CardInstance to RuntimeCard, use createBattleCard().

  /**
   * Compute level-scaled stat value
   * Each level increases stats by 10% (Level 1 = 100%, Level 9 = 180%)
   *
   * @param baseStat - Base stat value at level 1
   * @param level - Current level (1-9)
   * @returns Scaled stat value
   */
  export function computeLeveledStat(baseStat: number, level: number): number {
    if (level < 1) level = 1;
    if (level > 9) level = 9;

    const multiplier = 1.0 + ((level - 1) * 0.1); // 1.0 at level 1, 1.8 at level 9
    return Math.round(baseStat * multiplier);
  }

  /**
   * Create a RuntimeCard from a CardInstance
   * Transforms collection instance into battle-ready card with computed level and stats
   *
   * @param instance - CardInstance from player's collection
   * @param cardDef - Card definition from catalog
   * @returns RuntimeCard ready for battle (deck, hand, or field)
   */
  export function createBattleCard(instance: CardInstance, cardDef: AnyCard): RuntimeCard {
    const level = getCardLevel(instance.currentXP);

    // For Beast cards, compute level-scaled stats
    if (cardDef.type === CardTypeEnum.Beast && 'baseAttack' in cardDef && 'baseHealth' in cardDef) {
      const beastCard = cardDef as BloomBeastCard;
      const scaledAttack = computeLeveledStat(beastCard.baseAttack, level);
      const scaledHealth = computeLeveledStat(beastCard.baseHealth, level);

      const runtimeBeast: RuntimeBeast = {
        ...beastCard,
        instanceId: instance.id,
        cardId: beastCard.id,      // Base card ID (required by RuntimeBeast)
        currentXP: instance.currentXP,
        level,
        currentLevel: level as Level,  // Strongly-typed level (required by RuntimeBeast)
        currentAttack: scaledAttack,
        currentHealth: scaledHealth,
        maxHealth: scaledHealth,
        statusEffects: [],         // Initialize empty status effects (required by RuntimeBeast)
      };

      return runtimeBeast;
    }

    // For non-Beast cards, just add instance metadata
    const runtimeCard = {
      ...cardDef,
      instanceId: instance.id,
      currentXP: instance.currentXP,
      level,
    } as RuntimeCard;

    return runtimeCard;
  }

  /**
   * Get player's deck cards for battle
   * Converts minimal CardInstance to full battle cards using definitions
   */
  export function getPlayerDeckCards(playerDeck: string[], cardInstances: CardInstance[]): RuntimeCard[] {
    if (!_cardUtilsCatalogManager) {
      console.warn('[cardUtils] catalogManager not initialized');
      return [];
    }

    const deckCards: RuntimeCard[] = [];
    const allCardDefs = _cardUtilsCatalogManager.getAllCardData();

    // Convert all cards from player's deck to RuntimeCards
    for (const cardId of playerDeck) {
      const cardInstance = cardInstances.find(c => c.id === cardId);

      if (cardInstance) {
        // Get the card definition
        const baseCardId = extractBaseCardId(cardInstance.cardId);
        const cardDef = allCardDefs.find((card: any) => card && card.id === baseCardId);

        if (!cardDef) {
          console.warn(`[cardUtils] Card definition not found for ${cardInstance.cardId}`);
          continue;
        }

        // Use createBattleCard to get level-scaled stats
        const battleCard = createBattleCard(cardInstance, cardDef as AnyCard);
        deckCards.push(battleCard);
      }
    }

    return deckCards;
  }

  /**
   * Award experience to all cards in the player's deck
   * Level is computed from XP on-demand, so we just add XP here
   */
  export function awardDeckExperience(totalCardXP: number, playerDeck: string[], cardInstances: CardInstance[]): void {
    if (playerDeck.length === 0) return;

    // Distribute XP evenly across all cards in deck
    const xpPerCard = Math.floor(totalCardXP / playerDeck.length);

    // Award XP to each card in the deck
    for (const cardId of playerDeck) {
      const cardInstance = cardInstances.find(c => c.id === cardId);
      if (cardInstance) {
        cardInstance.currentXP += xpPerCard;
      }
    }
  }

  /**
   * Add card reward to collection (minimal format)
   */
  export function addCardReward(card: any, cardInstances: CardInstance[], index: number): void {
    const instanceId = `${card.id}-reward-${Date.now()}-${index}`;

    // Create minimal card instance (all types use same format)
    const cardInstance: CardInstance = {
      id: instanceId,
      cardId: card.id,
      currentXP: 0, // New cards start at 0 XP (level 1)
    };

    cardInstances.push(cardInstance);
  }

  // ==================== bloombeasts\ui\screens\common\CardRenderer.ts ====================

  /**
   * Common Card Rendering Component
   * Reusable card display with multi-layer rendering
   */


  export interface CardRendererProps {
    card: RuntimeCard;
    isInDeck?: boolean;
    onClick?: (cardId: string) => void;
    showDeckIndicator?: boolean;
  }

  /**
   * Create a card UI component with proper multi-layer rendering
   * This follows the standard card format:
   * - Layer 1: Card artwork (185x185) - beast image for Beast, card art for others
   * - Layer 2: Card frame (210x280) - base-card for Beast, type-specific for others (buff-card, magic-card, etc.)
   * - Layer 3: Affinity icon (for Beast cards)
   * - Layer 4: Experience bar (for Beast cards with levels)
   * - Layer 5: Text overlays (name, cost, stats, level, ability)
   * - Layer 6: Deck indicator (if showDeckIndicator is true)
   */
  export function createCardComponent(ui: UIMethodMappings, props: CardRendererProps): UINodeType {
    const { card, isInDeck = false, onClick, showDeckIndicator = true } = props;

    // Standard card dimensions from shared constants
    const cardWidth = 210; // standardCardDimensions.width
    const cardHeight = 280; // standardCardDimensions.height
    const beastImageWidth = 185; // standardCardBeastImageDimensions.width
    const beastImageHeight = 185; // standardCardBeastImageDimensions.height

    // Standard card positions (offsets within the card)
    const positions = {
      beastImage: { x: 12, y: 13 },
      cost: { x: 20, y: 10 },
      affinity: { x: 175, y: 7 },
      level: { x: 105, y: 182 },
      experienceBar: { x: 44, y: 182 },
      name: { x: 105, y: 13 },
      ability: { x: 21, y: 212 },
      attack: { x: 20, y: 176 },
      health: { x: 188, y: 176 },
    };

    // Extract base card ID for asset lookup
    // Card IDs may have timestamp suffixes (e.g., "nectar-block-1761200302194-0")
    // We need to extract the base ID (e.g., "nectar-block") to match catalog IDs
    const extractBaseId = (id: string | undefined): string => {
      if (!id) {
        console.warn('[CardRenderer] Card missing id, using name fallback:', card);
        // Fallback: use card name converted to kebab-case
        return card.name.toLowerCase().replace(/\s+/g, '-');
      }
      // Remove timestamp pattern: -digits-digits at the end
      return id.replace(/-\d+-\d+$/, '');
    };

    // Generate unique image URI keys for this card
    // Extract base ID from card.id to match asset catalog IDs
    const baseId = extractBaseId(card.id);
    const cardImageKey = baseId; // Card images use the base card ID
    const beastImageKey = baseId; // Beast images use the base card ID

    // Check if card has affinity property (Beast, Buff, Habitat cards)
    const affinity = 'affinity' in card ? (card as any).affinity : undefined;

    // Card frame key: Beast cards use base-card, others use type-specific frames
    let cardFrameKey = '';
    if (card.type === CardType.Beast) {
      cardFrameKey = 'base-card';
    } else if (card.type === CardType.Habitat && affinity) {
      cardFrameKey = `${affinity.toLowerCase()}-habitat`;
    } else {
      cardFrameKey = `${card.type.toLowerCase()}-card`;
    }

    // Affinity icon key format: affinity-icon (e.g., 'forest-icon', 'fire-icon')
    const affinityKey = affinity ? `${affinity.toLowerCase()}-icon` : '';
    const expBarKey = 'experience-bar';

    // Get card description for ability text using the official cardDescriptionGenerator
    const abilityText = getCardDescription(card);

    // Debug logging for cards without descriptions
    if ((!abilityText || abilityText.trim() === '') && card.type !== 'Beast') {
    } else if (card.type !== 'Beast') {
    }

    const imageSourceKey = card.type === CardType.Beast ? beastImageKey : cardImageKey;

    const children = [
        // Layer 1: Card/Beast artwork image (185x185)
        // For Beast cards: use beast image
        // For other cards (Magic/Trap/Buff/Habitat): use card artwork image
        ui.Image({
          source: ui.assetIdToImageSource?.(imageSourceKey) || null,
          style: {
            width: beastImageWidth,
            height: beastImageHeight,
            position: 'absolute',
            top: positions.beastImage.y,
            left: positions.beastImage.x,
          },
        }),

        // Layer 2: Card frame - Beast cards use base-card, others use type-specific frames
        ui.Image({
          source: ui.assetIdToImageSource?.(cardFrameKey) || null,
          style: {
            width: cardWidth,
            height: cardHeight,
            position: 'absolute',
            top: 0,
            left: 0,
          },
        }),

        // Layer 3: Affinity icon (for Beast cards)
        ...(card.type === CardType.Beast && card.affinity && affinityKey ? [
          ui.Image({
            source: ui.assetIdToImageSource?.(affinityKey) || null,
            style: {
              width: 30,
              height: 30,
              position: 'absolute',
              top: positions.affinity.y,
              left: positions.affinity.x,
            },
          })
        ] : []),

        // Layer 4: Text overlays
        // Card name
        ui.Text({
          text: card.name || '',
          style: {
            position: 'absolute',
            top: positions.name.y,
            left: 0,
            width: cardWidth,
            fontSize: DIMENSIONS.fontSize.md,
            color: COLORS.textPrimary,
            textAlign: 'center',
          },
        }),

        // Cost (top-left)
        ...(card.cost !== undefined ? [
          ui.Text({
            text: String(card.cost),
            style: {
              position: 'absolute',
              top: positions.cost.y,
              left: positions.cost.x - 10,
              width: 20,
              fontSize: DIMENSIONS.fontSize.xxl,
              color: COLORS.textPrimary,
              textAlign: 'center',
            },
          })
        ] : []),

        // Attack and Health (for Beast cards)
        ...(card.type === CardType.Beast && ((card as any).currentAttack !== undefined || (card as any).baseAttack !== undefined) ? [
          ui.Text({
            text: String((card as any).currentAttack ?? (card as any).baseAttack ?? 0),
            style: {
              position: 'absolute',
              top: positions.attack.y,
              left: positions.attack.x - 10,
              width: 20,
              fontSize: DIMENSIONS.fontSize.xxl,
              color: COLORS.textPrimary,
              textAlign: 'center',
            },
          })
        ] : []),

        ...(card.type === CardType.Beast && ((card as any).currentHealth !== undefined || (card as any).baseHealth !== undefined) ? [
          ui.Text({
            text: String((card as any).currentHealth ?? (card as any).baseHealth ?? 0),
            style: {
              position: 'absolute',
              top: positions.health.y,
              left: positions.health.x - 10,
              width: 20,
              fontSize: DIMENSIONS.fontSize.xxl,
              color: COLORS.textPrimary,
              textAlign: 'center',
            },
          })
        ] : []),

        // Level and Experience (for all cards with level)
        ...(card.level !== undefined ? [
          ui.Text({
            text: `lvl ${card.level}. ${card.currentXP || 0}/${getXPThreshold(card.level)}`,
            style: {
              position: 'absolute',
              top: positions.level.y,
              left: 0,
              width: cardWidth,
              fontSize: DIMENSIONS.fontSize.xs,
              color: COLORS.textPrimary,
              textAlign: 'center',
            },
          })
        ] : []),

        // Ability/Effect text (for all cards)
        ...(abilityText ? [
          ui.Text({
            text: abilityText,
            numberOfLines: 3,
            style: {
              position: 'absolute',
              top: positions.ability.y,
              left: positions.ability.x,
              width: 168,
              fontSize: 16,
              color: '#000000',
              textAlign: 'left',
            },
          })
        ] : []),

        // Deck indicator border if in deck and showDeckIndicator is true
        ...(isInDeck && showDeckIndicator ? [
          ui.View({
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              width: cardWidth,
              height: cardHeight,
              borderWidth: 4,
              borderColor: COLORS.success,
              borderRadius: 8,
            },
          })
        ] : []),
      ];

    // Filter out any undefined values to prevent rendering errors
    const filteredChildren = children.filter(child => child !== undefined && child !== null);

    // Only wrap in Pressable if onClick is provided
    // Otherwise use View to avoid blocking parent click handlers
    if (onClick) {
      return ui.Pressable({
        onClick: () => onClick(card.id),
        style: {
          width: cardWidth,
          height: cardHeight,
          position: 'relative',
        },
        children: filteredChildren,
      });
    } else {
      return ui.View({
        style: {
          width: cardWidth,
          height: cardHeight,
          position: 'relative',
        },
        children: filteredChildren,
      });
    }
  }

  /**
   * Props for reactive card component that uses bindings
   */
  export interface ReactiveCardRendererProps {

    // Mode selection
    mode: 'selectedCard' | 'slot' | 'battleBeast' | 'battleHand' | 'battleSelectedCard';

    // Slot-based selection (required for slot and battle modes)
    slotIndex?: number;
    cardsPerPage?: number;

    // Battle-specific props
    player?: 'player' | 'opponent'; // Required for battleBeast mode

    onClick?: (cardId: string) => void;
    showDeckIndicator?: boolean;
  }

  /**
   * Create a reactive card UI component using bindings
   */
  export function createReactiveCardComponent(ui: UIMethodMappings, props: ReactiveCardRendererProps): UINodeType {
    const {
      mode,
      slotIndex,
      cardsPerPage,
      player,
      onClick,
      showDeckIndicator = true
    } = props;

    // Determine which mode we're in
    const isSelectedCardMode = mode === 'selectedCard';
    const isSlotMode = mode === 'slot';
    const isBattleBeastMode = mode === 'battleBeast';
    const isBattleHandMode = mode === 'battleHand';
    const isBattleSelectedCardMode = mode === 'battleSelectedCard';

    // Standard card dimensions
    const cardWidth = 210;
    const cardHeight = 280;
    const beastImageWidth = 185;
    const beastImageHeight = 185;

    // Standard card positions
    const positions = {
      beastImage: { x: 12, y: 13 },
      cost: { x: 21, y: 7 },
      affinity: { x: 171, y: 7 },
      level: { x: 105, y: 182 },
      experienceBar: { x: 44, y: 182 },
      name: { x: 105, y: 13 },
      ability: { x: 21, y: 212 },
      attack: { x: 21, y: 171 },
      health: { x: 188, y: 171 },
    };

    // Helper function to extract base ID
    const extractBaseId = (id: string | undefined, name: string): string => {
      if (!id) {
        return name.toLowerCase().replace(/\s+/g, '-');
      }
      return id.replace(/-\d+-\d+$/, '');
    };

    // Helper to get card from combined data
    // Now accepts uiState, playerData, and battleDisplay to properly react to changes
    const getCard = (uiState: UIState, playerData: PlayerData, battleDisplay: BattleDisplay | null): RuntimeCard | null => {
      // Battle modes - get card directly from battleDisplay
      if (isBattleBeastMode && slotIndex !== undefined && player) {
        if (!battleDisplay) return null;
        const field = player === 'player' ? battleDisplay.playerField : battleDisplay.opponentField;
        const beast = field?.[slotIndex];
        return beast || null; // BattleDisplay cards are already RuntimeCard
      }

      if (isBattleHandMode && slotIndex !== undefined && cardsPerPage !== undefined) {
        if (!battleDisplay) return null;
        const scrollOffset = uiState.battle?.handScrollOffset ?? 0;
        const actualIndex = scrollOffset * cardsPerPage + slotIndex;
        const card = battleDisplay.playerHand?.[actualIndex];
        return card || null; // BattleDisplay cards are already RuntimeCard
      }

      if (isBattleSelectedCardMode) {
        const card = uiState.battle?.selectedCardDetail;
        return card || null; // BattleDisplay cards are already RuntimeCard
      }

      // PlayerData modes - get card from collected cards
      const cardInstances: CardInstance[] = playerData?.cards?.collected || [];

      let instance: CardInstance | null = null;

      if (isSelectedCardMode) {
        const cardId = uiState.cards?.selectedCardId;
        // ID-based mode: find card by ID
        if (!cardId) return null;
        instance = cardInstances.find((c: CardInstance) => c.id === cardId) || null;
      } else if (isSlotMode && slotIndex !== undefined && cardsPerPage !== undefined) {
        // Slot-based mode: find card by slot index
        const pageStart = (uiState.cards?.scrollOffset ?? 0) * cardsPerPage;
        const cardIndex = pageStart + slotIndex;
        instance = cardIndex < cardInstances.length ? cardInstances[cardIndex] : null;
      }

      // Convert CardInstance to RuntimeCard
      if (!instance) return null;
      const baseCardId = extractBaseCardId(instance.cardId);
      const cardDef = getCardDefinition(baseCardId);
      return cardDef ? createBattleCard(instance, cardDef) : null;
    };


    // Helper to check if card is in deck
    const isCardInDeck = (playerData: PlayerData, cardId: string | undefined): boolean => {
      if (!showDeckIndicator || !cardId) return false;
      const deckCardIds: string[] = playerData?.cards?.deck || [];
      return deckCardIds.includes(cardId);
    };

    // Determine which bindings to watch based on mode
    const isBattleMode = isBattleBeastMode || isBattleHandMode || isBattleSelectedCardMode;
    const bindingTypes = isBattleMode
      ? [BindingType.UIState, BindingType.BattleDisplay]
      : [BindingType.UIState, BindingType.PlayerData];

    // Create reactive text bindings that watch the appropriate bindings
    // Battle modes: UIState + BattleDisplay
    // Card screen modes: UIState + PlayerData
    const cardNameBinding = ui.bindingManager.derive(bindingTypes, (...args: any[]) => {
      const [uiState, data] = args;
      const card = isBattleMode
        ? getCard(uiState, {} as PlayerData, data as BattleDisplay)
        : getCard(uiState, data as PlayerData, null);
      return card?.name || '';
    });

    const cardCostBinding = ui.bindingManager.derive(bindingTypes, (...args: any[]) => {
      const [uiState, data] = args;
      const card = isBattleMode
        ? getCard(uiState, {} as PlayerData, data as BattleDisplay)
        : getCard(uiState, data as PlayerData, null);
      return card && card.cost !== undefined ? String(card.cost) : '';
    });

    const cardAttackBinding = ui.bindingManager.derive(bindingTypes, (...args: any[]) => {
      const [uiState, data] = args;
      const card = isBattleMode
        ? getCard(uiState, {} as PlayerData, data as BattleDisplay)
        : getCard(uiState, data as PlayerData, null);
      if (!card || card.type !== CardType.Beast) return '';
      const beastCard = card as any;
      return String(beastCard.currentAttack ?? beastCard.baseAttack ?? 0);
    });

    const cardHealthBinding = ui.bindingManager.derive(bindingTypes, (...args: any[]) => {
      const [uiState, data] = args;
      const card = isBattleMode
        ? getCard(uiState, {} as PlayerData, data as BattleDisplay)
        : getCard(uiState, data as PlayerData, null);
      if (!card || card.type !== CardType.Beast) return '';
      const beastCard = card as any;
      return String(beastCard.currentHealth ?? beastCard.baseHealth ?? 0);
    });

    const cardLevelBinding = ui.bindingManager.derive(bindingTypes, (...args: any[]) => {
      const [uiState, data] = args;
      const card = isBattleMode
        ? getCard(uiState, {} as PlayerData, data as BattleDisplay)
        : getCard(uiState, data as PlayerData, null);
      if (!card || card.level === undefined) return '';

      // For all cards, show level and experience
      const exp = card.currentXP || 0;
      return `lvl ${card.level}. ${exp}/${getXPThreshold(card.level)}`;
    });

    const abilityTextBinding = ui.bindingManager.derive(bindingTypes, (...args: any[]) => {
      const [uiState, data] = args;
      const card = isBattleMode
        ? getCard(uiState, {} as PlayerData, data as BattleDisplay)
        : getCard(uiState, data as PlayerData, null);
      return card ? getCardDescription(card) : '';
    });

    // Create image source bindings that watch the appropriate bindings
    const baseCardImageBinding = ui.bindingManager.derive(bindingTypes, (...args: any[]) => {
      const [uiState, data] = args;
      const card = isBattleMode
        ? getCard(uiState, {} as PlayerData, data as BattleDisplay)
        : getCard(uiState, data as PlayerData, null);
      if (!card) {
        return null;
      }
      const baseId = extractBaseId(card.id, card.name);
      if (!baseId) {
        return null;
      }
      const imageSource = ui.assetIdToImageSource?.(baseId) ?? null;
      return imageSource;
    });

    const templateImageBinding = ui.bindingManager.derive(bindingTypes, (...args: any[]) => {
      const [uiState, data] = args;
      const card = isBattleMode
        ? getCard(uiState, {} as PlayerData, data as BattleDisplay)
        : getCard(uiState, data as PlayerData, null);
      if (!card) return null;

      let templateAssetId = '';
      if (card.type === CardType.Habitat && card.affinity) {
        templateAssetId = `${card.affinity.toLowerCase()}-habitat`;
      } else if (card.type !== CardType.Beast) {
        templateAssetId = `${card.type.toLowerCase()}-card`;
      }

      return templateAssetId ? (ui.assetIdToImageSource?.(templateAssetId) ?? null) : null;
    });

    const affinityIconBinding = ui.bindingManager.derive(bindingTypes, (...args: any[]) => {
      const [uiState, data] = args;
      const card = isBattleMode
        ? getCard(uiState, {} as PlayerData, data as BattleDisplay)
        : getCard(uiState, data as PlayerData, null);
      if (!card || card.type !== CardType.Beast || !card.affinity) return null;
      const affinityAssetId = `${card.affinity.toLowerCase()}-icon`;
      if (!affinityAssetId) return null;
      return ui.assetIdToImageSource?.(affinityAssetId) ?? null;
    });


    // Render all layers without conditional wrapping
    // Null/empty values will naturally hide elements
    const children = [
      // Layer 1: Card/Beast artwork image
      ui.Image({
        source: baseCardImageBinding,
        style: {
          width: beastImageWidth,
          height: beastImageHeight,
          position: 'absolute',
          top: positions.beastImage.y,
          left: positions.beastImage.x,
        },
      }),

      // Layer 2: Card frame (base-card for Bloom, type-specific for others)
      ui.Image({
        source: ui.bindingManager.derive(bindingTypes, (...args: any[]) => {
          const [uiState, data] = args;
          const card = isBattleMode
            ? getCard(uiState, {} as PlayerData, data as BattleDisplay)
            : getCard(uiState, data as PlayerData, null);
          if (!card) return null;

          // Beast cards use base-card
          if (card.type === CardType.Beast) {
            return ui.assetIdToImageSource?.('base-card') ?? null;
          }

          // Other cards use their type-specific frame
          let frameAssetId = '';
          if (card.type === CardType.Habitat && card.affinity) {
            frameAssetId = `${card.affinity.toLowerCase()}-habitat`;
          } else {
            frameAssetId = `${card.type.toLowerCase()}-card`;
          }

          return frameAssetId ? (ui.assetIdToImageSource?.(frameAssetId) ?? null) : null;
        }),
        style: {
          width: cardWidth,
          height: cardHeight,
          position: 'absolute',
          top: 0,
          left: 0,
        },
      }),

      // Layer 4: Affinity icon
      ui.Image({
        source: affinityIconBinding,
        style: {
          width: 30,
          height: 30,
          position: 'absolute',
          top: positions.affinity.y,
          left: positions.affinity.x,
        },
      }),

      // Layer 5: Text overlays
      // Card name
      ui.Text({
        text: cardNameBinding,
        style: {
          position: 'absolute',
          top: positions.name.y,
          left: 0,
          width: cardWidth,
          fontSize: DIMENSIONS.fontSize.md,
          color: COLORS.textPrimary,
          textAlign: 'center',
        },
      }),

      // Cost
      ui.Text({
        text: cardCostBinding,
        style: {
          position: 'absolute',
          top: positions.cost.y,
          left: positions.cost.x - 10,
          width: 20,
          fontSize: DIMENSIONS.fontSize.xxl,
          color: COLORS.textPrimary,
          textAlign: 'center',
        },
      }),

      // Attack
      ui.Text({
        text: cardAttackBinding,
        style: {
          position: 'absolute',
          top: positions.attack.y,
          left: positions.attack.x - 10,
          width: 20,
          fontSize: DIMENSIONS.fontSize.xxl,
          color: COLORS.textPrimary,
          textAlign: 'center',
        },
      }),

      // Health
      ui.Text({
        text: cardHealthBinding,
        style: {
          position: 'absolute',
          top: positions.health.y,
          left: positions.health.x - 10,
          width: 20,
          fontSize: DIMENSIONS.fontSize.xxl,
          color: COLORS.textPrimary,
          textAlign: 'center',
        },
      }),

      // Level
      ui.Text({
        text: cardLevelBinding,
        style: {
          position: 'absolute',
          top: positions.level.y,
          left: 0,
          width: cardWidth,
          fontSize: DIMENSIONS.fontSize.xs,
          color: COLORS.textPrimary,
          textAlign: 'center',
        },
      }),

      // Ability text
      ui.Text({
        text: abilityTextBinding,
        numberOfLines: 3,
        style: {
          position: 'absolute',
          top: positions.ability.y,
          left: positions.ability.x,
          width: 168,
          fontSize: 16,
          color: '#000000',
          textAlign: 'left',
        },
      }),

      // Layer 7: Deck indicator border (only if showDeckIndicator is true and not in battle mode)
      ...(showDeckIndicator && !isBattleMode ? [ui.View({
        style: ui.bindingManager.derive([BindingType.UIState, BindingType.PlayerData], (uiState: UIState, playerData: PlayerData) => {
          const card = getCard(uiState, playerData, null);
          const inDeck = isCardInDeck(playerData, card?.id);

          return {
            position: 'absolute',
            top: 0,
            left: 0,
            width: cardWidth,
            height: cardHeight,
            borderWidth: inDeck ? 4 : 0,
            borderColor: COLORS.success,
            borderRadius: 8,
            pointerEvents: 'none' as const, // Allow clicks to pass through
          };
        }),
      })] : []),
    ];

    const filteredChildren = children.filter(child => child !== undefined && child !== null);

    // Wrap in Pressable if onClick is provided, otherwise use View
    if (onClick) {
      return ui.Pressable({
        onClick: () => {
          // Get current state to determine which card was clicked
          const currentState = ui.bindingManager.getSnapshot(BindingType.UIState);
          const playerData = ui.bindingManager.getSnapshot(BindingType.PlayerData);
          const card = getCard(currentState, playerData, null);
          if (card?.id) {
            onClick(card.id);
          }
        },
        style: {
          width: cardWidth,
          height: cardHeight,
          position: 'relative',
        },
        children: filteredChildren,
      });
    } else {
      return ui.View({
        style: {
          width: cardWidth,
          height: cardHeight,
          position: 'relative',
        },
        children: filteredChildren,
      });
    }
  }

  /**
   * Standard card dimensions for external use
   */
  export const CARD_DIMENSIONS = {
    width: 210,
    height: 280,
    imageWidth: 185,
    imageHeight: 185,
  };

  // ==================== bloombeasts\ui\common\Popup.ts ====================

  /**
   * Common Popup Component
   * Reusable popup with title, description, content, and buttons
   */


  export interface PopupButton {
    label: string | ValueBindingBase<string> | ReadonlyBindingInterface<string>;
    onClick: () => void;
    color?: ButtonColor;
    type?: ButtonType;
    disabled?: boolean | ValueBindingBase<boolean> | ReadonlyBindingInterface<boolean>;
  }

  export interface PopupProps {
    ui: UIMethodMappings;
    title: string | ValueBindingBase<string> | ReadonlyBindingInterface<string>;
    titleColor?: string; // Optional custom title color
    description?: string | ValueBindingBase<string> | ReadonlyBindingInterface<string>;
    content?: UINodeType[];
    buttons?: PopupButton[];
    playSfx?: (sfxId: string) => void;
    width?: number;
    height?: number;
    onBackdropClick?: () => void;
    hideBackdrop?: boolean; // Hide the semi-transparent backdrop
  }

  /**
   * Create a common popup with mission-container background
   */
  export function createPopup(props: PopupProps): UINodeType {
    const {
      ui,
      title,
      titleColor = COLORS.textPrimary,
      description,
      content = [],
      buttons = [],
      playSfx,
      width = 550,
      height = 400,
      onBackdropClick,
      hideBackdrop = false,
    } = props;

    // Calculate center position (assuming 1280x720 screen)
    const screenWidth = 1280;
    const screenHeight = 720;
    const centerX = (screenWidth - width) / 2;
    const centerY = (screenHeight - height) / 2;

    // Text component accepts string or binding directly
    const titleBinding = title;
    const descriptionBinding = description || null;

    // Calculate content area dimensions
    const contentPaddingTop = 80; // Space for title
    const contentPaddingBottom = buttons.length > 0 ? 80 : 20; // Space for buttons
    const contentHeight = height - contentPaddingTop - contentPaddingBottom;
    const contentPadding = 30;

    return ui.View({
      style: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        zIndex: 1000,
      },
      children: [
        // Semi-transparent backdrop (optional)
        ...(hideBackdrop ? [] : [
          onBackdropClick
            ? ui.Pressable({
                onClick: onBackdropClick,
                style: {
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
              })
            : ui.View({
                style: {
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
              })
        ]),

        // Content container with mission-container image (centered)
        ui.View({
          style: {
            position: 'absolute',
            left: centerX,
            top: centerY,
            width: width,
            height: height,
          },
          children: [
            // Mission container background image - assets preload automatically
            ui.Image({
              source: ui.assetIdToImageSource?.('mission-container') ?? null,
              style: {
                position: 'absolute',
                width: width,
                height: height,
                top: 0,
                left: 0,
              },
            }),

            // Title
            ui.View({
              style: {
                position: 'absolute',
                top: 20,
                left: contentPadding,
                width: width - contentPadding * 2,
              },
              children: ui.Text({
                text: titleBinding,
                style: {
                  fontSize: DIMENSIONS.fontSize.xl,
                  fontWeight: 'bold',
                  color: titleColor,
                  textAlign: 'center',
                },
              }),
            }),

            // Description (optional)
            descriptionBinding
              ? ui.View({
                  style: {
                    position: 'absolute',
                    top: 60,
                    left: contentPadding,
                    width: width - contentPadding * 2,
                  },
                  children: ui.Text({
                    text: descriptionBinding,
                    style: {
                      fontSize: DIMENSIONS.fontSize.md,
                      color: COLORS.textSecondary,
                      textAlign: 'center',
                    },
                  }),
                })
              : null,

            // Content area (scrollable if needed)
            content.length > 0
              ? ui.View({
                  style: {
                    position: 'absolute',
                    top: description ? 100 : contentPaddingTop,
                    left: contentPadding,
                    width: width - contentPadding * 2,
                    height: description
                      ? contentHeight - 40
                      : contentHeight,
                    flexDirection: 'column',
                    gap: DIMENSIONS.spacing.sm,
                  },
                  children: content,
                })
              : null,

            // Buttons row at bottom
            buttons.length > 0
              ? ui.View({
                  style: {
                    position: 'absolute',
                    bottom: 20,
                    left: 0,
                    width: width,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: DIMENSIONS.spacing.md,
                  },
                  children: buttons.map((button) =>
                    createButton({
                      ui,
                      label: button.label,
                      onClick: button.onClick,
                      color: button.color,
                      type: button.type,
                      disabled: button.disabled,
                      playSfx,
                    })
                  ),
                })
              : null,
          ].filter(Boolean),
        }),
      ],
    });
  }

  // ==================== bloombeasts\ui\screens\common\CardDetailPopup.ts ====================

  /**
   * Card Detail Popup Component
   * Shows card details in a popup overlay with action buttons
   */


  export interface CardDetailPopupProps {
    cardDetail: CardDetailDisplay;
    onButtonClick: (buttonId: string) => void;
    playSfx?: (sfxId: string) => void;
    hideBackdrop?: boolean; // Hide the semi-transparent backdrop
  }

  export interface ReactiveCardDetailPopupProps {
    onClose: () => void;
    buttons?: PopupButton[]; // Buttons to display at bottom
    playSfx?: (sfxId: string) => void;
  }

  /**
   * Create a reactive card detail popup overlay using common Popup
   */
  export function createReactiveCardDetailPopup(ui: UIMethodMappings, props: ReactiveCardDetailPopupProps): UINodeType {
    const { onClose, buttons = [], playSfx } = props;

    // Derive card name using instance method (no new binding)
    const cardNameBinding = ui.bindingManager.derive([BindingType.UIState], (uiState: UIState) => {
      const pd = ui.bindingManager.getSnapshot(BindingType.PlayerData);
      const card = pd?.cards?.collected?.find((c: any) => c.id === uiState.cards?.selectedCardId);
      return card?.name || 'Card Details';
    });

    // Create content with card display (centered)
    const content = [
      ui.View({
        style: {
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        },
        children: createReactiveCardComponent(ui, {
          mode: 'selectedCard',
          onClick: undefined, // No click handler in popup
          showDeckIndicator: true, // Show deck indicator
        }),
      }),
    ];

    return createPopup({
      ui,
      title: cardNameBinding,
      content,
      buttons, // Buttons will be centered at bottom in a row
      playSfx,
      width: 450,
      height: 520,
      onBackdropClick: onClose,
    });
  }

  /**
   * Create a reactive card detail popup that derives content from CardDetailPopup binding
   */
  export function createReactiveCardDetailPopupFromBinding(ui: UIMethodMappings): UINodeType {
    // Get snapshot for non-reactive parts (buttons, callbacks)
    const propsSnapshot = ui.bindingManager.getSnapshot(BindingType.CardDetailPopup);

    // Derive title from binding
    const titleBinding = ui.bindingManager.derive([BindingType.CardDetailPopup], (props: any) => {
      return props?.cardDetail?.card?.name || 'Card Details';
    });

    // Build card structure with reactive bindings (can't use createCardComponent with null data)
    const cardWidth = 210;
    const cardHeight = 280;
    const beastImageWidth = 185;
    const beastImageHeight = 185;

    const positions = {
      beastImage: { x: 12, y: 13 },
      cost: { x: 21, y: 7 },
      affinity: { x: 171, y: 7 },
      name: { x: 105, y: 13 },
      ability: { x: 21, y: 212 },
      attack: { x: 21, y: 171 },
      health: { x: 188, y: 171 },
    };

    const cardContent = [
      ui.View({
        style: {
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20,
        },
        children: ui.View({
          style: {
            width: cardWidth,
            height: cardHeight,
            position: 'relative',
          },
          children: [
            // Layer 1: Card/Beast artwork
            ui.Image({
              source: ui.bindingManager.derive([BindingType.CardDetailPopup], (props: any) => {
                const card = props?.cardDetail?.card;
                if (!card || !card.id) return null;
                const baseId = card.id?.replace(/-\d+-\d+$/, '') || card.name?.toLowerCase().replace(/\s+/g, '-');
                return ui.assetIdToImageSource?.(baseId) || null;
              }),
              style: {
                width: beastImageWidth,
                height: beastImageHeight,
                position: 'absolute',
                top: positions.beastImage.y,
                left: positions.beastImage.x,
              },
            }),

            // Layer 2: Card frame
            ui.Image({
              source: ui.bindingManager.derive([BindingType.CardDetailPopup], (props: any) => {
                const card = props?.cardDetail?.card;
                if (!card) return null;

                let templateKey = '';
                if (card.type === CardType.Beast) {
                  templateKey = 'base-card';
                } else if (card.type === CardType.Habitat && card.affinity) {
                  templateKey = `${card.affinity.toLowerCase()}-habitat`;
                } else {
                  templateKey = `${card.type.toLowerCase()}-card`;
                }
                return ui.assetIdToImageSource?.(templateKey) || null;
              }),
              style: {
                width: cardWidth,
                height: cardHeight,
                position: 'absolute',
                top: 0,
                left: 0,
              },
            }),

            // Layer 3: Affinity icon (for Bloom cards)
            ui.Image({
              source: ui.bindingManager.derive([BindingType.CardDetailPopup], (props: any) => {
                const card = props?.cardDetail?.card;
                if (!card || card.type !== 'Bloom' || !card.affinity) return null;
                return ui.assetIdToImageSource?.(`${card.affinity.toLowerCase()}-icon`) || null;
              }),
              style: {
                width: 30,
                height: 30,
                position: 'absolute',
                top: positions.affinity.y,
                left: positions.affinity.x,
              },
            }),

            // Layer 4: Card name
            ui.Text({
              text: ui.bindingManager.derive([BindingType.CardDetailPopup], (props: any) => {
                return props?.cardDetail?.card?.name || '';
              }),
              style: {
                position: 'absolute',
                top: positions.name.y,
                left: 0,
                width: cardWidth,
                fontSize: 14,
                color: '#fff',
                textAlign: 'center',
              },
            }),

            // Layer 5: Cost
            ui.Text({
              text: ui.bindingManager.derive([BindingType.CardDetailPopup], (props: any) => {
                const card = props?.cardDetail?.card;
                return card && card.cost !== undefined ? String(card.cost) : '';
              }),
              style: {
                position: 'absolute',
                top: positions.cost.y,
                left: positions.cost.x - 10,
                width: 20,
                fontSize: 24,
                color: '#fff',
                textAlign: 'center',
              },
            }),

            // Layer 6: Attack (for Bloom cards)
            ui.Text({
              text: ui.bindingManager.derive([BindingType.CardDetailPopup], (props: any) => {
                const card = props?.cardDetail?.card;
                if (!card || card.type !== 'Bloom') return '';
                return String((card as any).currentAttack ?? (card as any).baseAttack ?? 0);
              }),
              style: {
                position: 'absolute',
                top: positions.attack.y,
                left: positions.attack.x - 10,
                width: 20,
                fontSize: 24,
                color: '#fff',
                textAlign: 'center',
              },
            }),

            // Layer 7: Health (for Bloom cards)
            ui.Text({
              text: ui.bindingManager.derive([BindingType.CardDetailPopup], (props: any) => {
                const card = props?.cardDetail?.card;
                if (!card || card.type !== 'Bloom') return '';
                return String((card as any).currentHealth ?? (card as any).baseHealth ?? 0);
              }),
              style: {
                position: 'absolute',
                top: positions.health.y,
                left: positions.health.x - 10,
                width: 20,
                fontSize: 24,
                color: '#fff',
                textAlign: 'center',
              },
            }),

            // Layer 8: Ability text
            ui.Text({
              text: ui.bindingManager.derive([BindingType.CardDetailPopup], (props: any) => {
                const card = props?.cardDetail?.card;
                if (!card) return '';
                return getCardDescription(card);
              }),
              numberOfLines: 3,
              style: {
                position: 'absolute',
                top: positions.ability.y,
                left: positions.ability.x,
                width: 168,
                fontSize: 16,
                color: '#000000',
                textAlign: 'left',
              },
            }),
          ],
        }),
      }),
    ];

    // Get buttons from binding
    const popupButtons: PopupButton[] = (propsSnapshot?.cardDetail?.buttons || [])
      .filter((b: any) => b)
      .map((buttonText: string) => ({
        label: buttonText,
        onClick: () => {
          const buttonId = `btn-card-${buttonText.toLowerCase().replace(/ /g, '-')}`;
          propsSnapshot?.onButtonClick?.(buttonId);
        },
        color: (buttonText === 'Add' ? 'green' : buttonText === 'Remove' ? 'red' : 'default') as any,
      }));

    return createPopup({
      ui,
      title: titleBinding,
      content: cardContent,
      buttons: popupButtons,
      playSfx: propsSnapshot?.playSfx,
      width: 400,
      height: 500,
      onBackdropClick: () => propsSnapshot?.onButtonClick?.('btn-card-close'),
      hideBackdrop: propsSnapshot?.hideBackdrop || false,
    });
  }

  /**
   * Create a card detail popup overlay using common Popup component
   */
  export function createCardDetailPopup(ui: UIMethodMappings, props: CardDetailPopupProps): UINodeType {
    const { cardDetail, onButtonClick, playSfx, hideBackdrop = false } = props;

    // Create card component as content
    const cardContent = [
      ui.View({
        style: {
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 20,
        },
        children: createCardComponent(ui, {
          card: cardDetail.card,
          isInDeck: cardDetail.isInDeck,
          showDeckIndicator: false, // Don't show deck indicator in detail view
        }),
      }),
    ];

    // Convert buttons to PopupButton format
    const popupButtons: PopupButton[] = (cardDetail.buttons || [])
      .filter(b => b)
      .map((buttonText) => ({
        label: buttonText,
        onClick: () => {
          const buttonId = `btn-card-${buttonText.toLowerCase().replace(/ /g, '-')}`;
          onButtonClick(buttonId);
        },
        color: buttonText === 'Add' ? 'green' : buttonText === 'Remove' ? 'red' : 'default',
      }));

    return createPopup({
      ui,
      title: cardDetail.card.name || 'Card Details',
      content: cardContent,
      buttons: popupButtons,
      playSfx,
      width: 400,
      height: 500,
      onBackdropClick: () => onButtonClick('btn-card-close'),
      hideBackdrop,
    });
  }

  // ==================== bloombeasts\ui\screens\CardsScreen.ts ====================

  /**
   * Unified Cards Screen Component
   * Works on both Horizon and Web platforms
   * Matches the styling from cardsScreen.new.ts
   */


  export interface CardsScreenProps {
    ui: UIMethodMappings;
    onCardSelect?: (cardId: string) => void;
    onNavigate?: (screen: string) => void;
    onRenderNeeded?: () => void;
    playSfx?: (sfxId: string) => void;
  }

  /**
   * Unified Cards Screen
   */
  export class CardsScreen {
    // UI methods (injected)
    private ui: UIMethodMappings;

    private cardsPerRow = 4;
    private rowsPerPage = 2;
    private onCardSelect?: (cardId: string) => void;
    private onNavigate?: (screen: string) => void;
    private onRenderNeeded?: () => void;
    private playSfx?: (sfxId: string) => void;

    constructor(props: CardsScreenProps) {
      this.ui = props.ui;
      this.onCardSelect = props.onCardSelect;
      this.onNavigate = props.onNavigate;
      this.onRenderNeeded = props.onRenderNeeded;
      this.playSfx = props.playSfx;

    }


    /**
     * Create a single card slot using reactive card component
     * Passes playerDataBinding to avoid binding nesting
     */
    private createCardSlot(
      slotIndex: number,
      cardsPerPage: number,
      hasMarginRight: boolean
    ): UINodeType {
      return this.ui.View({
        style: {
          marginRight: hasMarginRight ? GAPS.cards : 0,
        },
        children: createReactiveCardComponent(this.ui, {
          mode: 'slot',
          slotIndex,
          cardsPerPage,
          onClick: (cardId: string) => {
            this.handleCardClick(cardId);
          },
          showDeckIndicator: true,
        }),
      });
    }

    /**
     * Create card grid with reactive bindings
     * Card slots derive directly from playerDataBinding to avoid nesting
     */
    private createCardGrid(): UINodeType {
      const cardsPerPage = this.cardsPerRow * this.rowsPerPage;
      return this.ui.View({
        style: {
          position: 'absolute',
          left: 70,
          top: 70,
          width: 920,
          height: 580,
        },
        children: [
          // Empty state - derive directly from playerDataBinding
          ...(this.ui.UINode ? [this.ui.UINode.if(
            this.ui.bindingManager.derive([BindingType.PlayerData], (pd: any) => {
              const cards = pd?.cards?.collected || [];
              return cards.length === 0 ? true : false;
            }),
            this.ui.View({
              style: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              },
              children: this.ui.Text({
                text: 'No cards in your collection yet.',
                style: {
                  fontSize: DIMENSIONS.fontSize.xl,
                  color: COLORS.textPrimary,
                },
              }),
            })
          )] : []),

          // Card grid - pre-create 8 slots using reactive card components
          this.ui.View({
            style: {
              flexDirection: 'column',
            },
            children: Array.from({ length: this.rowsPerPage }, (_, rowIndex) =>
              this.ui.View({
                style: {
                  flexDirection: 'row',
                  marginBottom: rowIndex < this.rowsPerPage - 1 ? GAPS.cards : 0,
                },
                children: Array.from({ length: this.cardsPerRow }, (_, colIndex) => {
                  const slotIndex = rowIndex * this.cardsPerRow + colIndex;

                  // Create card slot - passes playerDataBinding
                  return this.createCardSlot(slotIndex, cardsPerPage, colIndex < this.cardsPerRow - 1);
                }),
              })
            ),
          }),
        ],
      });
    }

    createUI(): UINodeType {

      // Create scroll buttons for the side menu
      // Check bounds inside onClick to avoid multi-binding derives (which create new bindings)
      const scrollButtons = [
        {
          label: 'Previous',
          onClick: () => {
            // Check bounds before scrolling
            const currentState = this.ui.bindingManager.getSnapshot(BindingType.UIState);
            const currentOffset = currentState.cards?.scrollOffset ?? 0;
            if (currentOffset > 0) {
              // Update UIState binding
              this.ui.bindingManager.setBinding(BindingType.UIState, {
                ...currentState,
                cards: {
                  ...currentState.cards,
                  scrollOffset: currentOffset - 1
                }
              });
              // Trigger re-render for web
              if (this.onRenderNeeded) {
                this.onRenderNeeded();
              }
            }
          },
          disabled: this.ui.bindingManager.derive(
            [BindingType.UIState],
            (uiState: UIState) => {
              const offset = uiState.cards?.scrollOffset ?? 0;
              return offset <= 0;
            }
          ),
          opacity: this.ui.bindingManager.derive(
            [BindingType.UIState],
            (uiState: UIState) => {
              const offset = uiState.cards?.scrollOffset ?? 0;
              return offset <= 0 ? 0.5 : 1.0;
            }
          ),
          textColor: this.ui.bindingManager.derive(
            [BindingType.UIState],
            (uiState: UIState) => {
              const offset = uiState.cards?.scrollOffset ?? 0;
              return offset <= 0 ? '#888' : '#fff';
            }
          ),
          yOffset: 0,
        },
        {
          label: 'Next',
          onClick: () => {
            // Reactive disabled state prevents invalid scrolling, so just increment
            const currentState = this.ui.bindingManager.getSnapshot(BindingType.UIState);
            const playerData = this.ui.bindingManager.getSnapshot(BindingType.PlayerData);
            const cards = playerData?.cards?.collected || [];
            const cardsPerPage = this.cardsPerRow * this.rowsPerPage;
            const totalPages = Math.ceil(cards.length / cardsPerPage);
            const currentOffset = currentState.cards?.scrollOffset ?? 0;
            if (currentOffset < totalPages - 1) {
              this.ui.bindingManager.setBinding(BindingType.UIState, {
                ...currentState,
                cards: {
                  ...currentState.cards,
                  scrollOffset: currentOffset + 1
                }
              });
              // Trigger re-render for web
              if (this.onRenderNeeded) {
                this.onRenderNeeded();
              }
            }
          },
          disabled: this.ui.bindingManager.derive(
            [BindingType.UIState, BindingType.PlayerData],
            (uiState: UIState, pd: any) => {
              const offset = uiState.cards?.scrollOffset ?? 0;
              const cards = pd?.cards?.collected || [];
              const cardsPerPage = this.cardsPerRow * this.rowsPerPage;
              const totalPages = Math.ceil(cards.length / cardsPerPage);
              return offset >= totalPages - 1;
            }
          ),
          opacity: this.ui.bindingManager.derive(
            [BindingType.UIState, BindingType.PlayerData],
            (uiState: UIState, pd: any) => {
              const offset = uiState.cards?.scrollOffset ?? 0;
              const cards = pd?.cards?.collected || [];
              const cardsPerPage = this.cardsPerRow * this.rowsPerPage;
              const totalPages = Math.ceil(cards.length / cardsPerPage);
              return offset >= totalPages - 1 ? 0.5 : 1.0;
            }
          ),
          textColor: this.ui.bindingManager.derive(
            [BindingType.UIState, BindingType.PlayerData],
            (uiState: UIState, pd: any) => {
              const offset = uiState.cards?.scrollOffset ?? 0;
              const cards = pd?.cards?.collected || [];
              const cardsPerPage = this.cardsPerRow * this.rowsPerPage;
              const totalPages = Math.ceil(cards.length / cardsPerPage);
              return offset >= totalPages - 1 ? '#888' : '#fff';
            }
          ),
          yOffset: sideMenuButtonDimensions.height + GAPS.buttons,
        },
      ];

      // Deck info text - derive directly from playerDataBinding to avoid nesting
      const deckInfoText = this.ui.bindingManager.derive([BindingType.PlayerData], (pd: any) => `${deckEmoji} ${pd?.cards?.deck?.length || 0}/30`);

      return this.ui.View({
        style: {
          width: '100%',
          height: '100%',
          position: 'relative',
        },
        children: [
          // Background
          this.ui.Image({
            source: this.ui.assetIdToImageSource?.('background') || null,
            style: {
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
            },
          }),
          // Cards Container image as background
          this.ui.Image({
            source: this.ui.assetIdToImageSource?.('cards-container') || null,
            style: {
              position: 'absolute',
              left: 40,
              top: 40,
              width: 980,
              height: 640,
            },
          }),
          // Main content - card grid
          // Card grid view with Horizon-compatible pattern (derives bindings internally)
          this.createCardGrid(),
          // Sidebar with common side menu
          createSideMenu(this.ui, {
            title: 'Cards',
            customTextContent: [
              createTextRow(this.ui, deckInfoText, 0),
            ],
            buttons: scrollButtons,
            bottomButton: {
              label: 'Back',
              onClick: () => {
                if (this.onNavigate) this.onNavigate('menu');
              },
              disabled: false,
            },
            playSfx: this.playSfx,
          }),

          // Card detail popup overlay container (conditionally rendered)
          // Uses UINode.if() for proper conditional rendering per Horizon docs
          ...(this.ui.UINode ? [this.ui.UINode.if(
            this.ui.bindingManager.derive([BindingType.UIState], (state: any) => (state.cards?.selectedCardId ?? null) !== null),
            this.ui.View({
              style: {
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
              },
              children: createReactiveCardDetailPopup(this.ui, {
                onClose: () => this.closePopup(),
                buttons: this.createPopupButtons(),
                playSfx: this.playSfx,
              }),
            })
          )] : []),
        ],
      });
    }

    /**
     * Handle card click - show popup with Add/Remove options
     */
    private handleCardClick(cardId: string): void {
      const currentState = this.ui.bindingManager.getSnapshot(BindingType.UIState);
      this.ui.bindingManager.setBinding(BindingType.UIState, {
        ...currentState,
        cards: {
          ...currentState.cards,
          selectedCardId: cardId
        }
      });
      this.onRenderNeeded?.();
    }

    /**
     * Close the popup
     */
    private closePopup(): void {
      const currentState = this.ui.bindingManager.getSnapshot(BindingType.UIState);
      this.ui.bindingManager.setBinding(BindingType.UIState, {
        ...currentState,
        cards: {
          ...currentState.cards,
          selectedCardId: null
        }
      });
      this.onRenderNeeded?.();
    }

    /**
     * Create reactive popup buttons
     * Returns Add/Remove and Close buttons as PopupButton array
     */
    private createPopupButtons(): PopupButton[] {
      // Derive button label (Add/Remove) based on deck status
      const buttonLabel = this.ui.bindingManager.derive(
        [BindingType.PlayerData],
        (pd: any) => {
          const state = this.ui.bindingManager.getSnapshot(BindingType.UIState);
          const cardId = state.cards?.selectedCardId ?? null;
          if (!cardId) return '';
          const deckCardIds: string[] = pd?.cards?.deck || [];
          const isInDeck = deckCardIds.includes(cardId);
          return isInDeck ? 'Remove' : 'Add';
        }
      );

      // Derive button color based on deck status
      const buttonColor = this.ui.bindingManager.derive(
        [BindingType.PlayerData],
        (pd: any) => {
          const state = this.ui.bindingManager.getSnapshot(BindingType.UIState);
          const cardId = state.cards?.selectedCardId ?? null;
          if (!cardId) return 'default' as ButtonColor;
          const deckCardIds: string[] = pd?.cards?.deck || [];
          const isInDeck = deckCardIds.includes(cardId);
          return (isInDeck ? 'red' : 'green') as ButtonColor;
        }
      );

      return [
        // Add/Remove button
        {
          label: buttonLabel,
          onClick: () => {
            const currentState = this.ui.bindingManager.getSnapshot(BindingType.UIState);
            const cardId = currentState.cards?.selectedCardId ?? null;
            if (cardId && this.onCardSelect) {
              this.onCardSelect(cardId);
            }
          },
          color: buttonColor as any,
        },

        // Close button
        {
          label: 'Close',
          onClick: () => this.closePopup(),
          color: 'default',
        },
      ];
    }

    dispose(): void {
      // Nothing to clean up
    }
  }

  // ==================== bloombeasts\constants\upgrades.ts ====================

  /**
   * Upgrade Constants
   * Defines all available upgrades and their properties
   */

  export interface UpgradeDefinition {
    id: string;
    name: string;
    description: string;
    assetId: string;
    costs: number[]; // Cost for each level (index 0 = level 1, index 5 = level 6)
    values?: number[]; // Value of the upgrade (0-100) for each level
  }

  export const COIN_BOOST: UpgradeDefinition = {
    id: 'coin-boost',
    name: 'Coin Boost',
    description: 'Earn more coins!',
    assetId: 'upgrade-coin-boost',
    costs: [100, 200, 400, 800, 1600, 3200], // Levels 1-6
    values: [5, 15, 25, 50, 100, 200]
  };

  export const EXP_BOOST: UpgradeDefinition = {
    id: 'exp-boost',
    name: 'Experience Boost',
    description: 'Gain more experience!',
    assetId: 'upgrade-exp-boost',
    costs: [100, 200, 400, 800, 1600, 3200], // Levels 1-6
    values: [5, 15, 25, 50, 100, 200]
  };

  export const LUCK_BOOST: UpgradeDefinition = {
    id: 'luck-boost',
    name: 'Luck Boost',
    description: 'Increase your chances in getting loot!',
    assetId: 'upgrade-luck-boost',
    costs: [100, 200, 400, 800, 1600, 3200], // Levels 1-6
    values: [5, 15, 25, 50, 100, 200]
  };

  export const ROOSTER: UpgradeDefinition = {
    id: 'rooster',
    name: 'Rooster',
    description: 'Please ignore this rooster, nothing good will come of it!',
    assetId: 'upgrade-rooster',
    costs: [400, 800, 1600, 3200, 6400, 12800], // Levels 1-6
  };

  // Array of all upgrades for iteration
  export const ALL_UPGRADES: UpgradeDefinition[] = [
    COIN_BOOST,
    EXP_BOOST,
    LUCK_BOOST,
    ROOSTER
  ];

  // Map of upgrade costs by ID for quick lookup
  export const UPGRADE_COSTS: { [key: string]: number[] } = {
    [COIN_BOOST.id]: COIN_BOOST.costs,
    [EXP_BOOST.id]: EXP_BOOST.costs,
    [LUCK_BOOST.id]: LUCK_BOOST.costs,
    [ROOSTER.id]: ROOSTER.costs
  };

  // ==================== bloombeasts\ui\screens\UpgradeScreen.ts ====================

  /**
   * Upgrade Screen Component
   * Displays available upgrades for purchase
   */


  export interface UpgradeScreenProps {
    ui: UIMethodMappings;
    onNavigate?: (screen: string) => void;
    onUpgrade?: (boostId: string) => void;
    onRenderNeeded?: () => void;
    playSfx?: (sfxId: string) => void;
  }

  export class UpgradeScreen {
    private ui: UIMethodMappings;
    private onNavigate?: (screen: string) => void;
    private onUpgrade?: (boostId: string) => void;
    private onRenderNeeded?: () => void;
    private playSfx?: (sfxId: string) => void;

    constructor(props: UpgradeScreenProps) {
      this.ui = props.ui;
      this.onNavigate = props.onNavigate;
      this.onUpgrade = props.onUpgrade;
      this.onRenderNeeded = props.onRenderNeeded;
      this.playSfx = props.playSfx;
    }

    /**
     * Create a single upgrade item
     */
    private createUpgradeItem(upgrade: UpgradeDefinition): UINodeType {
      const containerSize = 150;
      const imageSize = { width: 142, height: 120 };
      const imageOffset = { top: 4, left: 4 };
      const upgradeBoxSize = { width: 25, height: 26 };

      return this.ui.Pressable({
        onClick: () => {
          const currentState = this.ui.bindingManager.getSnapshot(BindingType.UIState);
          // Update UIState binding
          this.ui.bindingManager.setBinding(BindingType.UIState, {
            ...currentState,
            upgrade: {
              ...currentState.upgrade,
              selectedUpgradeId: upgrade.id
            }
          });
          this.onRenderNeeded?.();
        },
        style: {
          width: containerSize,
          height: containerSize,
          position: 'relative',
        },
        children: [
          // Container background
          this.ui.Image({
            source: this.ui.assetIdToImageSource?.('upgrade-container-card') || null,
            style: {
              position: 'absolute',
              width: containerSize,
              height: containerSize,
              top: 0,
              left: 0,
              opacity: 1.0,
            },
          }),
          // Upgrade image overlay
          this.ui.Image({
            source: this.ui.assetIdToImageSource?.(upgrade.assetId) || null,
            style: {
              position: 'absolute',
              width: imageSize.width,
              height: imageSize.height,
              top: imageOffset.top,
              left: imageOffset.left,
            },
          }),
          // Upgrade level indicator (text at center bottom)
          this.ui.Text({
            text: this.ui.bindingManager.playerDataBinding.binding.derive((pd: any) => {
              const level = pd?.boosts?.[upgrade.id] || 0;
              return `Level ${level}`;
            }),
            style: {
              position: 'absolute',
              bottom: 8,
              left: 0,
              width: containerSize,
              fontSize: 14,
              fontWeight: 'bold',
              color: '#fff',
              textAlign: 'center',
            },
          }),
        ],
      });
    }

    /**
     * Create the upgrade grid
     */
    private createUpgradeGrid(): UINodeType {
      return this.ui.View({
        style: {
          position: 'absolute',
          left: 70,
          top: 70,
          width: 920,
          height: 580,
        },
        children: [
          this.ui.View({
            style: {
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 40,
            },
            children: ALL_UPGRADES.map((upgrade) =>
              this.createUpgradeItem(upgrade)
            ),
          }),
        ],
      });
    }

    createUI(): UINodeType {
      return this.ui.View({
        style: {
          width: '100%',
          height: '100%',
          position: 'relative',
        },
        children: [
          // Background
          this.ui.Image({
            source: this.ui.assetIdToImageSource?.('background') || null,
            style: {
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
            },
          }),
          // Cards Container image as background
          this.ui.Image({
            source: this.ui.assetIdToImageSource?.('cards-container') || null,
            style: {
              position: 'absolute',
              left: 40,
              top: 40,
              width: 980,
              height: 640,
            },
          }),
          // Upgrade grid
          this.createUpgradeGrid(),
          // Sidebar with common side menu
          createSideMenu(this.ui, {
            title: 'Upgrades',
            customTextContent: [],
            buttons: [],
            bottomButton: {
              label: 'Back',
              onClick: () => {
                if (this.onNavigate) this.onNavigate('menu');
              },
              disabled: false,
            },
            playSfx: this.playSfx,
          }),
          // Upgrade popup (conditionally rendered) - derive from UIState
          ...(this.ui.UINode ? [this.ui.UINode.if(
            this.ui.bindingManager.derive([BindingType.UIState], (state: any) => {
              const shouldShow = (state.upgrade?.selectedUpgradeId ?? null) !== null;
              return shouldShow;
            }),
            this.createUpgradePopup()
          )] : []),
        ],
      });
    }

    /**
     * Create the upgrade popup
     */
    private createUpgradePopup(): UINodeType {

      return createPopup({
        ui: this.ui,
        title: 'Upgrade',
        description: this.ui.bindingManager.derive([BindingType.PlayerData, BindingType.UIState], (pd: any, state: any) => {
          const upgradeId = state.upgrade?.selectedUpgradeId ?? null;
          const upgrade = ALL_UPGRADES.find(u => u.id === upgradeId);
          if (!upgrade) return '';
          const currentLevel = pd?.boosts?.[upgradeId] || 0;
          const coins = pd?.coins ?? 0;

          if (currentLevel >= 6) {
            return `${upgrade.name}\n${upgrade.description}\n\nLevel: ${currentLevel}/6 (MAX)\nYour coins: ${coins}`;
          }

          const nextLevelCost = upgrade.costs[currentLevel];
          return `${upgrade.name}\n${upgrade.description}\n\nLevel: ${currentLevel}/6\nNext upgrade cost: ${nextLevelCost} coins\nYour coins: ${coins}`;
        }),
        buttons: [
          {
            label: 'Upgrade',
            onClick: () => {
              const currentState = this.ui.bindingManager.getSnapshot(BindingType.UIState);
              const upgradeId = currentState.upgrade?.selectedUpgradeId ?? null;
              if (!upgradeId) return;
              if (this.onUpgrade) {
                this.onUpgrade(upgradeId);
              }
              // Update UIState binding
              this.ui.bindingManager.setBinding(BindingType.UIState, {
                ...currentState,
                upgrade: {
                  ...currentState.upgrade,
                  selectedUpgradeId: null
                }
              });
              this.onRenderNeeded?.();
            },
            color: 'green',
            disabled: this.ui.bindingManager.derive([BindingType.PlayerData, BindingType.UIState], (pd: any, state: any) => {
              const upgradeId = state.upgrade?.selectedUpgradeId ?? null;
              if (!upgradeId) {
                return true;
              }
              const upgrade = ALL_UPGRADES.find(u => u.id === upgradeId);
              if (!upgrade) {
                return true;
              }
              const currentLevel = pd?.boosts?.[upgradeId] || 0;
              if (currentLevel >= 6) {
                return true;
              }

              const nextLevelCost = upgrade.costs[currentLevel];
              const coins = pd?.coins ?? 0;
              const isDisabled = coins < nextLevelCost;
              return isDisabled;
            }),
          },
          {
            label: 'Close',
            onClick: () => {
              const currentState = this.ui.bindingManager.getSnapshot(BindingType.UIState);
              // Update UIState binding
              this.ui.bindingManager.setBinding(BindingType.UIState, {
                ...currentState,
                upgrade: {
                  ...currentState.upgrade,
                  selectedUpgradeId: null
                }
              });
              this.onRenderNeeded?.();
            },
            color: 'default',
          },
        ],
        playSfx: this.playSfx,
      });
    }

    dispose(): void {
      // Nothing to clean up
    }
  }

  // ==================== bloombeasts\ui\screens\common\MissionRenderer.ts ====================

  /**
   * Mission Renderer Component
   * Creates reactive mission cards for the mission selection screen
   */


  /**
   * Mission card dimensions
   */
  export const MISSION_DIMENSIONS = {
    width: 290,
    height: 185,
  };

  /**
   * Props for reactive mission component
   */
  export interface ReactiveMissionRendererProps {
    slotIndex: number;
    missionsPerPage: number;
    onClick?: (missionId: string) => void;
  }

  /**
   * Create a reactive mission component that updates based on bindings
   */
  export function createReactiveMissionComponent(ui: UIMethodMappings, props: ReactiveMissionRendererProps): UINodeType {
    const {
      slotIndex,
      missionsPerPage,
      onClick,
    } = props;

    // Track mission data for click handler
    let trackedMission: MissionDisplay | null = null;

    // Mission card positions
    const positions = {
      image: { x: 16, y: 16 },
      text: { x: 97, y: 10 },
    };

    const cardWidth = MISSION_DIMENSIONS.width;
    const cardHeight = MISSION_DIMENSIONS.height;
    const beastSize = 70;

    // Create a single binding for all text content
    const missionTextBinding = ui.bindingManager.derive([BindingType.Missions, BindingType.UIState], (missions: MissionDisplay[], uiState: UIState) => {
      const offset: number = uiState.missions?.scrollOffset ?? 0;
      const pageStart = offset * missionsPerPage;
      const missionIndex = pageStart + slotIndex;
      const mission = missionIndex < missions.length ? missions[missionIndex] : null;

      // Track the mission for click handler
      trackedMission = mission;

      if (!mission) return '';

      // Format difficulty nicely (capitalize first letter)
      const formattedDifficulty = mission.difficulty.charAt(0).toUpperCase() + mission.difficulty.slice(1);

      // Add completion indicator if mission is completed
      const completionIndicator = mission.isCompleted ? '✓ ' : '';

      // Combine all text with line breaks
      return `${completionIndicator}${mission.name}\nLevel ${mission.level} - ${formattedDifficulty}\n\n${mission.description}`;
    });

    const missionImageBinding = ui.bindingManager.derive([BindingType.Missions, BindingType.UIState], (missions: MissionDisplay[], uiState: UIState) => {
      const offset: number = uiState.missions?.scrollOffset ?? 0;
      const pageStart = offset * missionsPerPage;
      const missionIndex = pageStart + slotIndex;
      const mission = missionIndex < missions.length ? missions[missionIndex] : null;

      if (!mission) return null;

      // Determine mission background image based on affinity
      let missionImageName = 'forest-mission';
      if (mission.affinity === 'Water') missionImageName = 'water-mission';
      else if (mission.affinity === 'Fire') missionImageName = 'fire-mission';
      else if (mission.affinity === 'Sky') missionImageName = 'sky-mission';
      else if (mission.affinity === 'Boss') missionImageName = 'boss-mission';

      return ui.assetIdToImageSource?.(missionImageName) ?? null;
    });

    const beastImageBinding = ui.bindingManager.derive([BindingType.Missions, BindingType.UIState], (missions: MissionDisplay[], uiState: UIState) => {
      const offset: number = uiState.missions?.scrollOffset ?? 0;
      const pageStart = offset * missionsPerPage;
      const missionIndex = pageStart + slotIndex;
      const mission = missionIndex < missions.length ? missions[missionIndex] : null;

      if (!mission || !mission.beastId) return null;

      const beastAssetId = mission.beastId.toLowerCase().replace(/\s+/g, '-');
      if (!beastAssetId) return null; // Don't try to load empty asset IDs
      return ui.assetIdToImageSource?.(beastAssetId) ?? null;
    });

    const opacityBinding = ui.bindingManager.derive([BindingType.Missions, BindingType.UIState], (missions: MissionDisplay[], uiState: UIState) => {
      const offset: number = uiState.missions?.scrollOffset ?? 0;
      const pageStart = offset * missionsPerPage;
      const missionIndex = pageStart + slotIndex;
      const mission = missionIndex < missions.length ? missions[missionIndex] : null;
      return mission?.isAvailable ? 1 : 0.4;
    });

    const lockOverlayOpacityBinding = ui.bindingManager.derive([BindingType.Missions, BindingType.UIState], (missions: MissionDisplay[], uiState: UIState) => {
      const offset: number = uiState.missions?.scrollOffset ?? 0;
      const pageStart = offset * missionsPerPage;
      const missionIndex = pageStart + slotIndex;
      const mission = missionIndex < missions.length ? missions[missionIndex] : null;
      const lockOpacity = (mission && !mission.isAvailable) ? 1 : 0;

      // Debug log for first 3 slots
      if (slotIndex < 3 && mission) {
      }

      return lockOpacity;
    });

    // Render all layers - use opacity to hide/show
    const children = [
      // Mission background image
      ui.Image({
        source: missionImageBinding,
        style: {
          position: 'absolute',
          width: cardWidth,
          height: cardHeight,
          top: 0,
          left: 0,
        },
      }),

      // Beast image
      ui.Image({
        source: beastImageBinding,
        style: {
          position: 'absolute',
          width: beastSize,
          height: beastSize,
          left: positions.image.x,
          top: positions.image.y,
          opacity: opacityBinding,
        },
      }),

      // All mission text (name, level, difficulty, description)
      ui.Text({
        text: missionTextBinding,
        numberOfLines: 8,
        style: {
          position: 'absolute',
          left: positions.text.x,
          top: positions.text.y,
          width: cardWidth - positions.text.x - 10,
          fontSize: DIMENSIONS.fontSize.sm,
          color: COLORS.textPrimary,
          lineHeight: 16,
        },
      }),

      // Lock overlay (for unavailable missions)
      ui.View({
        style: {
          position: 'absolute',
          width: cardWidth,
          height: cardHeight,
          top: 0,
          left: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          opacity: lockOverlayOpacityBinding,
        },
        children: ui.Text({
          text: '🔒',
          style: {
            position: 'absolute',
            left: cardWidth / 2 - 15,
            top: cardHeight / 2 - 15,
            fontSize: 30,
            color: COLORS.textPrimary,
          },
        }),
      }),
    ];

    // Wrap in pressable container
    return ui.Pressable({
      onClick: () => {
        if (trackedMission && trackedMission.isAvailable && onClick) {
          onClick(trackedMission.id);
        }
      },
      style: {
        width: cardWidth,
        height: cardHeight,
        position: 'relative',
        opacity: opacityBinding,
      },
      children: children.filter(child => child !== undefined && child !== null),
    });
  }

  // ==================== bloombeasts\ui\screens\MissionScreen.ts ====================

  /**
   * Mission Screen - Refactored with UI Component System
   */


  // MissionScreen-specific constants
  const cardsUIContainerDimensions = {
    width: 950,
    height: 640,
  };

  const cardsUIContainerPosition: SimplePosition = {
    x: 103,
    y: 41,
  };

  export interface MissionScreenProps {
    ui: UIMethodMappings;
    onMissionSelect?: (missionId: string) => void;
    onNavigate?: (screen: string) => void;
    onRenderNeeded?: () => void;
    playSfx?: (sfxId: string) => void;
  }

  /**
   * Unified Mission Screen that works on both platforms
   */
  export class MissionScreen {
    // UI methods (injected)
    private ui: UIMethodMappings;

    // Configuration
    private missionsPerRow: number = 3;
    private rowsPerPage: number = 3;

    // Callbacks
    private onMissionSelect?: (missionId: string) => void;
    private onNavigate?: (screen: string) => void;
    private onRenderNeeded?: () => void;
    private playSfx?: (sfxId: string) => void;

    constructor(props: MissionScreenProps) {
      this.ui = props.ui;
      this.onMissionSelect = props.onMissionSelect;
      this.onNavigate = props.onNavigate;
      this.onRenderNeeded = props.onRenderNeeded;
      this.playSfx = props.playSfx;
    }

    /**
     * Create the missions UI
     */
    createUI(): UINodeType {
      return this.ui.View({
        style: {
          width: '100%',
          height: '100%',
          position: 'relative',
        },
        children: [
          // Background image (full screen)
          this.createBackground(),

          // Main content area with mission grid
          this.createMainContent(),

          // Side menu with controls (absolutely positioned)
          this.createSideMenu(),
        ],
      });
    }

    /**
     * Create full-screen background image
     */
    private createBackground(): UINodeType {
      return this.ui.Image({
        source: this.ui.assetIdToImageSource?.('background') || null,
        style: {
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
        },
      });
    }

    /**
     * Create main content area with mission grid
     */
    private createMainContent(): UINodeType {
      return this.ui.View({
        style: {
          position: 'absolute',
          left: cardsUIContainerPosition.x,
          top: cardsUIContainerPosition.y,
          width: cardsUIContainerDimensions.width,
          height: cardsUIContainerDimensions.height,
        },
        children: [
          // Cards container background image
          this.ui.Image({
            source: this.ui.assetIdToImageSource?.('cards-container') || null,
            style: {
              position: 'absolute',
              width: cardsUIContainerDimensions.width,
              height: cardsUIContainerDimensions.height,
              top: 0,
              left: 0,
            },
          }),
          // Content on top of container image
          // Mission grid container with reactive missions
          this.createMissionGrid(),
        ],
      });
    }

    /**
     * Create a single mission slot using reactive mission component
     */
    private createMissionSlot(slotIndex: number, missionsPerPage: number, row: number, col: number): UINodeType {
      const cardWidth = MISSION_DIMENSIONS.width;
      const cardHeight = MISSION_DIMENSIONS.height;
      const gapX = 12;
      const gapY = 12;
      const startX = 24;
      const startY = 24;
      const spacingX = cardWidth + gapX;
      const spacingY = cardHeight + gapY;
      const x = startX + col * spacingX;
      const y = startY + row * spacingY;

      return this.ui.View({
        style: {
          position: 'absolute',
          left: x,
          top: y,
        },
        children: createReactiveMissionComponent(this.ui, {
          slotIndex,
          missionsPerPage,
          onClick: (missionId: string) => {
            if (this.onMissionSelect) {
              this.onMissionSelect(missionId);
            }
          },
        }),
      });
    }


    /**
     * Create the mission grid using single binding (Horizon-compatible)
     */
    private createMissionGrid(): UINodeType {
      const missionsPerPage = this.missionsPerRow * this.rowsPerPage;

      return this.ui.View({
        style: {
          position: 'relative',
          paddingLeft: 4,
          paddingTop: 4,
          width: cardsUIContainerDimensions.width,
          height: cardsUIContainerDimensions.height,
        },
        children: [
          // Mission grid - pre-create all slots
          this.ui.View({
            style: {
              position: 'relative',
              width: '100%',
              height: '100%',
            },
            children: Array.from({ length: this.rowsPerPage }, (_, rowIndex) =>
              Array.from({ length: this.missionsPerRow }, (_, colIndex) => {
                const slotIndex = rowIndex * this.missionsPerRow + colIndex;
                return this.createMissionSlot(slotIndex, missionsPerPage, rowIndex, colIndex);
              })
            ).flat(),
          }),

          // Empty state message (only show when no missions, render on top)
          ...(this.ui.UINode ? [this.ui.UINode.if(
            this.ui.bindingManager.derive([BindingType.Missions], (missions: MissionDisplay[]) => {
              return missions.length === 0 ? true : false;
            }),
            this.ui.View({
              style: {
                position: 'absolute',
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                top: 0,
                left: 0,
              },
              children: this.ui.Text({
                text: 'No missions available yet.',
                style: {
                  fontSize: DIMENSIONS.fontSize.xl,
                  color: COLORS.textSecondary,
                },
              }),
            })
          )] : []),
        ],
      });
    }


    /**
     * Create side menu with controls
     */
    private createSideMenu(): UINodeType {
      const completionText = this.ui.bindingManager.derive([BindingType.Missions], (missions: MissionDisplay[]) => {
        const completedCount = missions.filter((m: MissionDisplay) => m.isCompleted).length;
        return `${missionEmoji} ${completedCount}/${missions.length}`;
      });

      return createSideMenu(this.ui, {
        title: 'Missions',
        customTextContent: [
          createTextRow(this.ui, completionText as any, 0),
        ],
        buttons: [
          {
            label: 'Previous',
            onClick: () => {
              const currentState = this.ui.bindingManager.getSnapshot(BindingType.UIState);
              // Reactive disabled state prevents invalid scrolling, so just decrement
              this.ui.bindingManager.setBinding(BindingType.UIState, {
                ...currentState,
                missions: {
                  ...currentState.missions,
                  scrollOffset: (currentState.missions?.scrollOffset ?? 0) - 1
                }
              });
              this.onRenderNeeded?.();
            },
            disabled: this.ui.bindingManager.derive([BindingType.Missions, BindingType.UIState], (missions: MissionDisplay[], uiState: UIState) => {
              const offset: number = uiState.missions?.scrollOffset ?? 0;
              return offset <= 0 ? true : false;
            }),
            opacity: this.ui.bindingManager.derive([BindingType.Missions, BindingType.UIState], (missions: MissionDisplay[], uiState: UIState) => {
              const offset: number = uiState.missions?.scrollOffset ?? 0;
              return offset <= 0 ? 0.5 : 1.0;
            }),
            textColor: this.ui.bindingManager.derive([BindingType.Missions, BindingType.UIState], (missions: MissionDisplay[], uiState: UIState) => {
              const offset: number = uiState.missions?.scrollOffset ?? 0;
              return offset <= 0 ? '#888' : '#fff';
            }),
            yOffset: 0,
          },
          {
            label: 'Next',
            onClick: () => {
              const currentState = this.ui.bindingManager.getSnapshot(BindingType.UIState);
              // Reactive disabled state prevents invalid scrolling, so just increment
              this.ui.bindingManager.setBinding(BindingType.UIState, {
                ...currentState,
                missions: {
                  ...currentState.missions,
                  scrollOffset: (currentState.missions?.scrollOffset ?? 0) + 1
                }
              });
              this.onRenderNeeded?.();
            },
            disabled: this.ui.bindingManager.derive([BindingType.Missions, BindingType.UIState], (missions: MissionDisplay[], uiState: UIState) => {
              const offset: number = uiState.missions?.scrollOffset ?? 0;
              const missionsPerPage = this.missionsPerRow * this.rowsPerPage;
              const totalPages = Math.ceil(missions.length / missionsPerPage);
              return offset >= totalPages - 1 ? true : false;
            }),
            opacity: this.ui.bindingManager.derive([BindingType.Missions, BindingType.UIState], (missions: MissionDisplay[], uiState: UIState) => {
              const offset: number = uiState.missions?.scrollOffset ?? 0;
              const missionsPerPage = this.missionsPerRow * this.rowsPerPage;
              const totalPages = Math.ceil(missions.length / missionsPerPage);
              return offset >= totalPages - 1 ? 0.5 : 1.0;
            }),
            textColor: this.ui.bindingManager.derive([BindingType.Missions, BindingType.UIState], (missions: MissionDisplay[], uiState: UIState) => {
              const offset: number = uiState.missions?.scrollOffset ?? 0;
              const missionsPerPage = this.missionsPerRow * this.rowsPerPage;
              const totalPages = Math.ceil(missions.length / missionsPerPage);
              return offset >= totalPages - 1 ? '#888' : '#fff';
            }),
            yOffset: sideMenuButtonDimensions.height + GAPS.buttons,
          },
        ],
        bottomButton: {
          label: 'Back',
          onClick: () => {
            if (this.onNavigate) {
              this.onNavigate('menu');
            }
          },
          disabled: false,
        },
        playSfx: this.playSfx,
      });
    }

    /**
     * Cleanup
     */
    dispose(): void {
      // Nothing to clean up
    }
  }

  // ==================== bloombeasts\engine\utils\Logger.ts ====================

  /**
   * Logger
   *
   * Professional logging system with configurable log levels.
   * Replaces console.log statements throughout the codebase.
   */

  export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    NONE = 4,
  }

  export interface LoggerConfig {
    level: LogLevel;
    prefix?: string;
    timestamps?: boolean;
    colors?: boolean;
  }

  class LoggerClass {
    private config: LoggerConfig = {
      level: LogLevel.INFO,
      timestamps: true,
      colors: true,
    };

    /**
     * Configure the logger
     * @param config Logger configuration
     */
    configure(config: Partial<LoggerConfig>): void {
      this.config = { ...this.config, ...config };
    }

    /**
     * Set log level
     * @param level The minimum log level to display
     */
    setLevel(level: LogLevel): void {
      this.config.level = level;
    }

    /**
     * Get current log level
     * @returns Current log level
     */
    getLevel(): LogLevel {
      return this.config.level;
    }

    /**
     * Format log message with timestamp and prefix
     */
    private format(level: string, message: string, prefix?: string): string {
      const parts: string[] = [];

      if (this.config.timestamps) {
        const timestamp = new Date().toISOString();
        parts.push(`[${timestamp}]`);
      }

      parts.push(`[${level}]`);

      if (prefix || this.config.prefix) {
        parts.push(`[${prefix || this.config.prefix}]`);
      }

      parts.push(message);

      return parts.join(' ');
    }

    /**
     * Log debug message
     * @param message Message to log
     * @param data Optional data to log
     */
    debug(message: string, ...data: any[]): void {
      if (this.config.level <= LogLevel.DEBUG) {
        const formatted = this.format('DEBUG', message);
        console.log(formatted, ...data);
      }
    }

    /**
     * Log info message
     * @param message Message to log
     * @param data Optional data to log
     */
    info(message: string, ...data: any[]): void {
      if (this.config.level <= LogLevel.INFO) {
        const formatted = this.format('INFO', message);
        console.log(formatted, ...data);
      }
    }

    /**
     * Log warning message
     * @param message Message to log
     * @param data Optional data to log
     */
    warn(message: string, ...data: any[]): void {
      if (this.config.level <= LogLevel.WARN) {
        const formatted = this.format('WARN', message);
        console.warn(formatted, ...data);
      }
    }

    /**
     * Log error message
     * @param message Message to log
     * @param data Optional data to log
     */
    error(message: string, ...data: any[]): void {
      if (this.config.level <= LogLevel.ERROR) {
        const formatted = this.format('ERROR', message);
        console.error(formatted, ...data);
      }
    }

    /**
     * Create a child logger with a specific prefix
     * @param prefix Prefix for all logs from this logger
     * @returns New logger instance with prefix
     */
    child(prefix: string): ChildLogger {
      return new ChildLogger(this, prefix);
    }

    private timers: Map<string, number> = new Map();

    /**
     * Group related logs together (simplified for basic console support)
     * @param label Group label
     * @param collapsed Whether group should be collapsed by default (ignored)
     */
    group(label: string, collapsed: boolean = false): void {
      if (this.config.level <= LogLevel.INFO) {
        const formatted = this.format('GROUP', `>>> ${label}`);
        console.log(formatted);
      }
    }

    /**
     * End a log group (simplified for basic console support)
     */
    groupEnd(): void {
      if (this.config.level <= LogLevel.INFO) {
        const formatted = this.format('GROUP', `<<<`);
        console.log(formatted);
      }
    }

    /**
     * Log a table (simplified for basic console support)
     * @param data Data to display as table
     */
    table(data: any): void {
      if (this.config.level <= LogLevel.INFO) {
        const formatted = this.format('TABLE', JSON.stringify(data, null, 2));
        console.log(formatted);
      }
    }

    /**
     * Start a performance timer
     * @param label Timer label
     */
    time(label: string): void {
      if (this.config.level <= LogLevel.DEBUG) {
        this.timers.set(label, Date.now());
        const formatted = this.format('TIMER', `${label}: started`);
        console.log(formatted);
      }
    }

    /**
     * End a performance timer and log the result
     * @param label Timer label
     */
    timeEnd(label: string): void {
      if (this.config.level <= LogLevel.DEBUG) {
        const startTime = this.timers.get(label);
        if (startTime) {
          const duration = Date.now() - startTime;
          this.timers.delete(label);
          const formatted = this.format('TIMER', `${label}: ${duration}ms`);
          console.log(formatted);
        }
      }
    }

    /**
     * Assert a condition and log error if false
     * @param condition Condition to check
     * @param message Error message if condition is false
     */
    assert(condition: boolean, message: string): void {
      if (this.config.level <= LogLevel.ERROR) {
        if (!condition) {
          const formatted = this.format('ASSERT', message);
          console.error(formatted);
        }
      }
    }
  }

  /**
   * Child logger with a specific prefix
   */
  class ChildLogger {
    constructor(
      private parent: LoggerClass,
      private prefix: string
    ) {}

    debug(message: string, ...data: any[]): void {
      this.parent.debug(`[${this.prefix}] ${message}`, ...data);
    }

    info(message: string, ...data: any[]): void {
      this.parent.info(`[${this.prefix}] ${message}`, ...data);
    }

    warn(message: string, ...data: any[]): void {
      this.parent.warn(`[${this.prefix}] ${message}`, ...data);
    }

    error(message: string, ...data: any[]): void {
      this.parent.error(`[${this.prefix}] ${message}`, ...data);
    }

    group(label: string, collapsed?: boolean): void {
      this.parent.group(`[${this.prefix}] ${label}`, collapsed);
    }

    groupEnd(): void {
      this.parent.groupEnd();
    }

    table(data: any): void {
      this.parent.table(data);
    }

    time(label: string): void {
      this.parent.time(`[${this.prefix}] ${label}`);
    }

    timeEnd(label: string): void {
      this.parent.timeEnd(`[${this.prefix}] ${label}`);
    }
  }

  // Export singleton instance
  export const Logger = new LoggerClass();

  // Configure based on environment
  // if (typeof process !== 'undefined' && process.env) {
  //   const env = 'development';

  //   if (env === 'production') {
  //     Logger.setLevel(LogLevel.WARN);
  //   } else if (env === 'test') {
  //     Logger.setLevel(LogLevel.ERROR);
  //   } else {
      Logger.setLevel(LogLevel.DEBUG);
  //   }
  // }

  // ==================== bloombeasts\engine\constants\gameRules.ts ====================

  /**
   * Game Rules Constants
   *
   * Central location for all game rule constants to avoid magic numbers
   * throughout the codebase.
   */

  // Field Configuration
  export const FIELD_SIZE = 3;

  // Deck Configuration
  export const DECK_SIZE = 30;
  export const MIN_DECK_SIZE = 30;
  export const MAX_DECK_SIZE = 30;

  // Health Configuration
  export const STARTING_HEALTH = 30;
  export const PLAYER_MAX_HEALTH = 30;

  // Turn Configuration
  export const TURN_TIME_LIMIT = 60; // seconds
  export const MAX_TURNS = 100; // to prevent infinite games

  // Hand Configuration
  export const MAX_HAND_SIZE = 10;
  export const STARTING_HAND_SIZE = 5;

  // Zone Limits
  export const MAX_TRAP_ZONE_SIZE = 3;
  export const MAX_MAGIC_ZONE_SIZE = 3;

  // Cost Limits
  export const MAX_CARD_COST = 10;
  export const MIN_CARD_COST = 0;

  // Resource Limits
  export const MAX_ENERGY = 10;
  export const MIN_ENERGY = 0;

  // Level Configuration
  export const MIN_LEVEL = 1;
  // MAX_LEVEL is defined in leveling.ts

  // Stat Limits
  export const MAX_ATTACK = 99;
  export const MAX_HEALTH = 99;
  export const MIN_ATTACK = 0;
  export const MIN_HEALTH = 1;

  // Counter limits removed

  // Card Limits
  export const MAX_COPIES_PER_CARD = 3;

  // Battle Configuration
  export const FIRST_PLAYER_DRAWS_ON_FIRST_TURN = false;

  // ==================== bloombeasts\engine\utils\fieldUtils.ts ====================

  /**
   * Field Utilities
   *
   * Helper functions for working with the battlefield and beast fields.
   * Eliminates common iteration patterns throughout the codebase.
   */


  /**
   * Iterate over all beasts in the field, including null slots
   * @param field The field array
   * @param callback Function to call for each slot
   */
  export function forEachBeast(
    field: (RuntimeBeast | null)[],
    callback: (beast: RuntimeBeast | null, index: number) => void
  ): void {
    field.forEach((beast, index) => callback(beast, index));
  }

  /**
   * Iterate over only non-null beasts in the field
   * @param field The field array
   * @param callback Function to call for each beast
   */
  export function forEachActiveBeast(
    field: (RuntimeBeast | null)[],
    callback: (beast: RuntimeBeast, index: number) => void
  ): void {
    field.forEach((beast, index) => {
      if (beast !== null) {
        callback(beast, index);
      }
    });
  }

  /**
   * Get all beasts from the field (including null slots)
   * @param field The field array
   * @returns Array of beasts and nulls
   */
  export function getAllSlots(field: (RuntimeBeast | null)[]): (RuntimeBeast | null)[] {
    return [...field];
  }

  /**
   * Get all non-null beasts from the field
   * @param field The field array
   * @returns Array of beasts (no nulls)
   */
  export function getAllBeasts(field: (RuntimeBeast | null)[]): RuntimeBeast[] {
    return field.filter((beast): beast is RuntimeBeast => beast !== null);
  }

  /**
   * Get all alive (HP > 0) beasts from the field
   * @param field The field array
   * @returns Array of alive beasts
   */
  export function getAliveBeasts(field: (RuntimeBeast | null)[]): RuntimeBeast[] {
    return field.filter(
      (beast): beast is RuntimeBeast => beast !== null && beast.currentHealth > 0
    );
  }

  /**
   * Get all dead (HP <= 0) beasts from the field
   * @param field The field array
   * @returns Array of dead beasts
   */
  export function getDeadBeasts(field: (RuntimeBeast | null)[]): RuntimeBeast[] {
    return field.filter(
      (beast): beast is RuntimeBeast => beast !== null && beast.currentHealth <= 0
    );
  }

  /**
   * Count alive beasts in the field
   * @param field The field array
   * @returns Number of alive beasts
   */
  export function countAliveBeasts(field: (RuntimeBeast | null)[]): number {
    return getAliveBeasts(field).length;
  }

  /**
   * Count total beasts in the field (excluding null slots)
   * @param field The field array
   * @returns Number of beasts
   */
  export function countBeasts(field: (RuntimeBeast | null)[]): number {
    return getAllBeasts(field).length;
  }

  /**
   * Find first empty slot in the field
   * @param field The field array
   * @returns Index of first empty slot, or -1 if none
   */
  export function findEmptySlot(field: (RuntimeBeast | null)[]): number {
    return field.findIndex((beast) => beast === null);
  }

  /**
   * Check if field has any empty slots
   * @param field The field array
   * @returns True if at least one empty slot exists
   */
  export function hasEmptySlot(field: (RuntimeBeast | null)[]): boolean {
    return findEmptySlot(field) !== -1;
  }

  /**
   * Check if field is full (no empty slots)
   * @param field The field array
   * @returns True if no empty slots
   */
  export function isFieldFull(field: (RuntimeBeast | null)[]): boolean {
    return !hasEmptySlot(field);
  }

  /**
   * Get beasts by affinity
   * @param field The field array
   * @param affinity The affinity to filter by
   * @returns Array of beasts with matching affinity
   */
  export function getBeastsByAffinity(
    field: (RuntimeBeast | null)[],
    affinity: string
  ): RuntimeBeast[] {
    return getAllBeasts(field).filter((beast) => beast.affinity === affinity);
  }

  /**
   * Get beast at specific index
   * @param field The field array
   * @param index The slot index
   * @returns Beast at index or null
   */
  export function getBeastAtIndex(
    field: (RuntimeBeast | null)[],
    index: number
  ): RuntimeBeast | null {
    if (index < 0 || index >= field.length) {
      return null;
    }
    return field[index];
  }

  /**
   * Find beast by instance ID
   * @param field The field array
   * @param instanceId The instance ID to find
   * @returns Object with beast and index, or null if not found
   */
  export function findBeastById(
    field: (RuntimeBeast | null)[],
    instanceId: string
  ): { beast: RuntimeBeast; index: number } | null {
    for (let i = 0; i < field.length; i++) {
      const beast = field[i];
      if (beast && beast.instanceId === instanceId) {
        return { beast, index: i };
      }
    }
    return null;
  }

  /**
   * Get adjacent beasts (left and right neighbors)
   * @param field The field array
   * @param index The slot index
   * @returns Array of adjacent beasts (may be empty or contain 1-2 beasts)
   */
  export function getAdjacentBeasts(
    field: (RuntimeBeast | null)[],
    index: number
  ): RuntimeBeast[] {
    const adjacent: RuntimeBeast[] = [];

    // Left neighbor
    if (index > 0 && field[index - 1]) {
      adjacent.push(field[index - 1]!);
    }

    // Right neighbor
    if (index < field.length - 1 && field[index + 1]) {
      adjacent.push(field[index + 1]!);
    }

    return adjacent;
  }

  /**
   * Clear all dead beasts from field and move to graveyard
   * @param player The player whose field to clear
   * @returns Array of removed beasts
   */
  export function clearDeadBeasts(player: Player): RuntimeBeast[] {
    const deadBeasts: RuntimeBeast[] = [];

    for (let i = 0; i < player.field.length; i++) {
      const beast = player.field[i];
      if (beast && beast.currentHealth <= 0) {
        deadBeasts.push(beast);
        player.field[i] = null;
      }
    }

    return deadBeasts;
  }

  /**
   * Get total attack power of all alive beasts
   * @param field The field array
   * @returns Sum of all attack values
   */
  export function getTotalAttackPower(field: (RuntimeBeast | null)[]): number {
    return getAliveBeasts(field).reduce((total, beast) => total + beast.currentAttack, 0);
  }

  /**
   * Get total health of all alive beasts
   * @param field The field array
   * @returns Sum of all health values
   */
  export function getTotalHealth(field: (RuntimeBeast | null)[]): number {
    return getAliveBeasts(field).reduce((total, beast) => total + beast.currentHealth, 0);
  }

  // ==================== bloombeasts\engine\utils\combatHelpers.ts ====================

  /**
   * Combat Helper Utilities
   */


  /**
   * Calculate damage after applying modifiers
   */
  export function calculateDamage(
    baseDamage: number,
    attacker: RuntimeBeast,
    defender: RuntimeBeast
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
  export function canAttack(beast: RuntimeBeast): boolean {
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

  // ==================== bloombeasts\engine\constants\battleConstants.ts ====================

  /**
   * Battle System Constants
   *
   * Centralized constants for battle timing, limits, and other magic numbers.
   * Extract magic numbers here to improve maintainability and readability.
   */

  /**
   * AI Turn Execution
   */
  export const MAX_AI_ACTIONS_PER_TURN = 50;

  /**
   * Animation and Delay Timing (milliseconds)
   */
  export const BEAST_PLAY_DELAY_MS = 1200;
  export const MAGIC_PLAY_DELAY_MS = 3500;
  export const TRAP_PLAY_DELAY_MS = 1200;
  export const BUFF_PLAY_DELAY_MS = 1200;
  export const HABITAT_PLAY_DELAY_MS = 1200;
  export const ATTACK_ANIMATION_DELAY_MS = 1000;
  export const AUTO_ATTACK_TOTAL_DELAY_MS = 3500;

  /**
   * Turn Timer (seconds)
   */
  export const TURN_TIMER_SECONDS = 300; // 5 minutes per turn

  /**
   * Field Limits
   */
  export const MAX_BEASTS_ON_FIELD = 3;
  export const MAX_TRAPS_IN_ZONE = 3;
  export const MAX_BUFFS_IN_ZONE = 2;

  /**
   * Battle Event Thresholds
   */
  export const LOW_HEALTH_THRESHOLD_PERCENT = 10;

  // ==================== bloombeasts\ui\screens\battle\types.ts ====================

  /**
   * Shared types and constants for Battle Screen components
   */


  // Re-export standardCardDimensions from dimensions.ts to avoid duplication

  /**
   * Card dimensions (battle-specific)
   */

  export const trapCardDimensions = {
    width: 100,
    height: 133,
  };

  export const buffCardDimensions = {
    width: 100,
    height: 133,
  };

  export const habitatShiftCardDimensions = {
    width: 100,
    height: 133,
  };

  /**
   * Game dimensions
   */
  export const gameDimensions = {
    panelWidth: 1280,
    panelHeight: 720,
  };

  /**
   * Battle board asset positions (from canvas version)
   */
  export const battleBoardAssetPositions = {
    playerOne: {
      beastOne: { x: 170, y: 50 },
      beastTwo: { x: 535, y: 50 },
      beastThree: { x: 900, y: 50 },
      trapOne: { x: 120, y: 240 },
      trapTwo: { x: 590, y: 240 },
      trapThree: { x: 1060, y: 240 },
      buffOne: { x: 20, y: 50 },
      buffTwo: { x: 20, y: 193 },
      health: { x: 30, y: 10 },
      energy: { x: 930, y: 10 },
      deckCount: { x: 1150, y: 10 },
    },
    playerTwo: {
      beastOne: { x: 170, y: 390 },
      beastTwo: { x: 535, y: 390 },
      beastThree: { x: 900, y: 390 },
      trapOne: { x: 120, y: 347 },
      trapTwo: { x: 590, y: 347 },
      trapThree: { x: 1060, y: 347 },
      buffOne: { x: 1160, y: 477 },
      buffTwo: { x: 1160, y: 587 },
      health: { x: 30, y: 680 },
      energy: { x: 930, y: 680 },
      deckCount: { x: 1150, y: 680 },
    },
    habitatZone: { x: 330, y: 293 },
    playOneInfoPosition: { x: 640, y: 20 },
    playTwoInfoPosition: { x: 640, y: 680 },
  };

  /**
   * Component props interface for battle components
   */
  export interface BattleComponentProps {
    ui: UIMethodMappings;
  }

  /**
   * Extended props for components that need callbacks
   */
  export interface BattleComponentWithCallbacks extends BattleComponentProps {
    onAction?: (action: string) => void;
    showPlayedCard?: (card: any, callback?: () => void) => void;
    onCardDetailSelected?: (card: any) => void;
  }

  /**
   * Props for PlayerHand component
   */
  export interface PlayerHandProps extends BattleComponentProps {
    getBattleDisplayValue: () => any | null; // Function to get current battle display value for onClick handlers
    onAction?: (action: string) => void;
    onShowHandChange?: (newValue: boolean) => void;
    onScrollOffsetChange?: (newValue: number) => void;
    onRenderNeeded?: () => void;
    showPlayedCard?: (card: any, callback?: () => void) => void;
  }

  /**
   * Props for BattleSideMenu component
   */
  export interface BattleSideMenuProps extends BattleComponentProps {
    getIsPlayerTurn: () => boolean; // Function to get current turn state
    getHasAttackableBeasts: () => boolean; // Function to check if player has beasts that can attack
    onAction?: (action: string) => void;
    onActionAsync?: (action: string) => Promise<void>; // Async version for actions that need to wait
    onStopTurnTimer?: () => void;
    playSfx?: (sfxId: string) => void;
  }

  /**
   * Props for InfoDisplays component
   */
  export interface InfoDisplaysProps extends BattleComponentProps {
  }

  // ==================== bloombeasts\ui\screens\battle\BattleBackground.ts ====================

  /**
   * Battle background and playboard rendering
   */


  export class BattleBackground {
    private ui: BattleComponentProps['ui'];

    constructor(props: BattleComponentProps) {
      this.ui = props.ui;
    }

    /**
     * Create full-screen background - assets preload automatically
     */
    createBackground(): UINodeType {
      return this.ui.Image({
        source: this.ui.assetIdToImageSource?.('background') || null,
        style: {
          position: 'absolute',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
        },
      });
    }

    /**
     * Create playboard overlay image - assets preload automatically
     */
    createPlayboard(): UINodeType {
      return this.ui.Image({
        source: this.ui.assetIdToImageSource?.('playboard') || null,
        style: {
          position: 'absolute',
          width: gameDimensions.panelWidth,
          height: gameDimensions.panelHeight,
          top: 0,
          left: 0,
        },
      });
    }
  }

  // ==================== bloombeasts\ui\screens\battle\BeastField.ts ====================

  /**
   * Beast field rendering - 3 slots per player
   */


  export class BeastField {
    private ui: BattleComponentWithCallbacks['ui'];
    private onAction?: (action: string) => void;
    private showPlayedCard?: (card: any, callback?: () => void) => void;

    constructor(props: BattleComponentWithCallbacks) {
      this.ui = props.ui;
      this.onAction = props.onAction;
      this.showPlayedCard = props.showPlayedCard;
    }

    /**
     * Create static beast card structure with reactive properties
     * Now uses the shared reactive card component
     */
    private createBeastCardStructure(player: 'player' | 'opponent', slotIndex: number): UINodeType {
      return createReactiveCardComponent(this.ui, {
        mode: 'battleBeast',
        player,
        slotIndex,
        showDeckIndicator: false,
      });
    }

    /**
     * Create beast field for a player - REACTIVE
     * Creates 3 slots, bindings determine what's shown
     */
    createBeastField(player: 'player' | 'opponent'): UINodeType[] {
      const positions = player === 'player'
        ? battleBoardAssetPositions.playerTwo
        : battleBoardAssetPositions.playerOne;
      const slots = [positions.beastOne, positions.beastTwo, positions.beastThree];

      // Create 3 beast slots
      return slots.map((pos, index) => {
        // All bindings must derive from this.battleDisplay, not from other derived bindings
        return this.ui.View({
          style: {
            position: 'absolute',
            left: pos.x,
            top: pos.y,
            width: standardCardDimensions.width,
            height: standardCardDimensions.height,
            // Hide slot if no beast - derive directly from battleDisplay
            display: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay | null) => {
                if (!state) return 'none';
                const field = player === 'player' ? state.playerField : state.opponentField;
                const beast = field?.[index];
                return beast ? 'flex' : 'none';
              }
            ),
          },
          children: [
            // Beast card - static structure with reactive properties
            this.ui.Pressable({
              onClick: () => {
                // View card details only (selection removed)
                this.onAction?.(`view-field-card-${player}-${index}`);
              },
              style: {
                width: standardCardDimensions.width,
                height: standardCardDimensions.height,
                position: 'relative',
              },
              children: this.createBeastCardStructure(player, index),
            }),

            // Attack animation overlay - derive directly from battleDisplay
            this.ui.View({
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay | null) => {
                    const isAttacking = state?.attackAnimation?.attackerPlayer === player &&
                                       state?.attackAnimation?.attackerIndex === index;
                    const isTarget = state?.attackAnimation?.targetPlayer === player &&
                                    state?.attackAnimation?.targetIndex === index;
                    if (isAttacking) return 'rgba(0, 255, 0, 0.4)';
                    if (isTarget) return 'rgba(255, 0, 0, 0.4)';
                    return 'transparent';
                  }
                ),
                borderRadius: 12,
                display: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay | null) => {
                    const isAttacking = state?.attackAnimation?.attackerPlayer === player &&
                                       state?.attackAnimation?.attackerIndex === index;
                    const isTarget = state?.attackAnimation?.targetPlayer === player &&
                                    state?.attackAnimation?.targetIndex === index;
                    return (isAttacking || isTarget) ? 'flex' : 'none';
                  }
                ),
              },
            }),

            // Action icons overlay wrapper - always exists, visibility controlled by display
            this.ui.View({
              style: {
                position: 'absolute',
                left: 17,
                top: 44,
                width: 26,
                height: 26,
                // Hide when no beast or beast has summoning sickness
                display: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay | null) => {
                    if (!state) return 'none';
                    const field = player === 'player' ? state.playerField : state.opponentField;
                    const beast = field?.[index];
                    if (!beast || beast.summoningSickness) return 'none';
                    return 'flex';
                  }
                ),
              },
              children: this.ui.Image({
                source: this.ui.assetIdToImageSource?.('icon-attack') || null,
                style: { width: 26, height: 26 },
              }),
            }),
          ],
        });
      });
    }
  }

  // ==================== bloombeasts\ui\screens\battle\TrapZone.ts ====================

  /**
   * Trap zone rendering - 3 slots per player
   */


  export class TrapZone {
    private ui: BattleComponentWithCallbacks['ui'];
    private onCardDetailSelected?: (card: any) => void;

    constructor(props: BattleComponentWithCallbacks) {
      this.ui = props.ui;
      this.onCardDetailSelected = props.onCardDetailSelected;
    }

    /**
     * Create trap zone for a player - REACTIVE
     * Creates 3 slots, bindings determine what's shown
     */
    createTrapZone(player: 'player' | 'opponent'): UINodeType[] {
      const positions = player === 'player'
        ? battleBoardAssetPositions.playerTwo
        : battleBoardAssetPositions.playerOne;
      const trapSlots = [positions.trapOne, positions.trapTwo, positions.trapThree];

      // Create 3 trap slots
      return trapSlots.map((pos, index) => {
        // Get trap card image source directly
        const trapCardSource = this.ui.assetIdToImageSource?.('trap-card-playboard') || null;

        return this.ui.View({
          style: {
            position: 'absolute',
            left: pos.x,
            top: pos.y,
            width: trapCardDimensions.width,
            height: trapCardDimensions.height,
            // Hide slot if no trap - derive from battleDisplay
            display: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay | null) => {
              if (!state) return 'none';
              const trapZone = player === 'player' ? state.playerTrapZone : state.opponentTrapZone;
              const trap = trapZone?.[index];
              return trap ? 'flex' : 'none';
            }),
          },
          children: [
            // Clickable wrapper for trap card
            this.ui.Pressable({
              onClick: () => {
                // Only allow player to view their own trap cards
                if (player === 'player') {
                  // Get current trap at click time
                  const state = this.ui.bindingManager.getSnapshot(BindingType.BattleDisplay) as BattleDisplay | null;
                  if (state) {
                    const trapZone = state?.playerTrapZone;
                    const trap = trapZone?.[index];
                    if (trap) {
                      this.onCardDetailSelected?.(trap);
                    }
                  }
                }
              },
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              },
              children: [
                // Trap card playboard image (face-down)
                this.ui.Image({
                  source: trapCardSource,
                  style: {
                    width: trapCardDimensions.width,
                    height: trapCardDimensions.height,
                  },
                }),
              ],
            }),
          ],
        });
      });
    }
  }

  // ==================== bloombeasts\ui\screens\battle\BuffZone.ts ====================

  /**
   * Buff zone rendering - 2 slots per player
   */


  export class BuffZone {
    private ui: BattleComponentWithCallbacks['ui'];
    private onCardDetailSelected?: (card: any) => void;

    constructor(props: BattleComponentWithCallbacks) {
      this.ui = props.ui;
      this.onCardDetailSelected = props.onCardDetailSelected;
    }

    /**
     * Create buff zone for a player - REACTIVE
     * Creates 2 slots, bindings determine what's shown
     */
    createBuffZone(player: 'player' | 'opponent'): UINodeType[] {
      const positions = player === 'player'
        ? battleBoardAssetPositions.playerTwo
        : battleBoardAssetPositions.playerOne;
      const buffSlots = [positions.buffOne, positions.buffTwo];

      // Create 2 buff slots
      return buffSlots.map((pos, index) => {
        // Get buff card template source directly
        const buffCardSource = this.ui.assetIdToImageSource?.('buff-card-playboard') || null;

        return this.ui.View({
          style: {
            position: 'absolute',
            left: pos.x,
            top: pos.y,
            width: buffCardDimensions.width,
            height: buffCardDimensions.height,
            // Hide slot if no buff - derive from battleDisplay
            display: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay | null) => {
              if (!state) return 'none';
              const buffZone = player === 'player' ? state.playerBuffZone : state.opponentBuffZone;
              const buff = buffZone?.[index];
              return buff ? 'flex' : 'none';
            }),
          },
          children: [
            // Clickable wrapper for buff card
            this.ui.Pressable({
              onClick: () => {
                // Get current buff at click time
                const state = this.ui.bindingManager.getSnapshot(BindingType.BattleDisplay);
                if (state && typeof state === 'object' && 'playerBuffZone' in state) {
                  const buffZone = player === 'player' ? (state as any).playerBuffZone : (state as any).opponentBuffZone;
                  const buff = buffZone?.[index];
                  if (buff) {
                    this.onCardDetailSelected?.(buff);
                  }
                }
              },
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              },
              children: [
                // Buff card playboard template (face-up)
                this.ui.Image({
                  source: buffCardSource,
                  style: {
                    width: buffCardDimensions.width,
                    height: buffCardDimensions.height,
                  },
                }),

                // Buff card artwork image wrapper - always exists, image source is reactive
                this.ui.View({
                  style: {
                    position: 'absolute',
                    top: (buffCardDimensions.height - 100) / 2,
                    left: (buffCardDimensions.width - 100) / 2,
                    width: 100,
                    height: 100,
                  },
                  children: this.ui.Image({
                    source: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay | null) => {
                      if (!state) return null;
                      const buffZone = player === 'player' ? state?.playerBuffZone : state?.opponentBuffZone;
                      const buff = buffZone?.[index];
                      if (!buff) return null;
                      return this.ui.assetIdToImageSource?.(buff.id?.replace(/-\d+-\d+$/, '') || buff.name.toLowerCase().replace(/\s+/g, '-'));
                    }),
                    style: {
                      width: 100,
                      height: 100,
                    },
                  }),
                }),

                // Golden glow effect
                this.ui.View({
                  style: {
                    position: 'absolute',
                    top: -3,
                    left: -3,
                    right: -3,
                    bottom: -3,
                    borderWidth: 3,
                    borderColor: '#FFD700',
                    borderRadius: 8,
                    shadowColor: '#FFD700',
                    shadowRadius: 8,
                  },
                }),
              ],
            }),
          ],
        });
      });
    }
  }

  // ==================== bloombeasts\ui\screens\battle\HabitatZone.ts ====================

  /**
   * Habitat zone rendering (center of board)
   */


  export class HabitatZone {
    private ui: BattleComponentWithCallbacks['ui'];
    private onCardDetailSelected?: (card: any) => void;

    constructor(props: BattleComponentWithCallbacks) {
      this.ui = props.ui;
      this.onCardDetailSelected = props.onCardDetailSelected;
    }

    /**
     * Create habitat zone - REACTIVE
     * Derives habitat from battleDisplay binding
     */
    createHabitatZone(): UINodeType {
      const pos = battleBoardAssetPositions.habitatZone;

      return this.ui.View({
        style: {
          position: 'absolute',
          left: pos.x,
          top: pos.y,
          width: habitatShiftCardDimensions.width,
          height: habitatShiftCardDimensions.height,
          // Hide if no habitat
          display: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay | null) =>
            state?.habitatZone ? 'flex' : 'none'
          ),
        },
        children: [
          // Clickable wrapper for entire habitat card
          this.ui.Pressable({
            onClick: () => {
              // Get current habitat at click time
              const state = this.ui.bindingManager.getSnapshot(BindingType.BattleDisplay);
              if (state && typeof state === 'object' && 'habitatZone' in state) {
                const habitat = (state as any).habitatZone;
                if (habitat) {
                  const habitatWithType = { ...habitat, type: 'Habitat' };
                  this.onCardDetailSelected?.(habitatWithType);
                }
              }
            },
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            },
            children: [
              // Habitat artwork image wrapper - always exists, image source is reactive
              this.ui.View({
                style: {
                  position: 'absolute',
                  top: (habitatShiftCardDimensions.height - 70) / 2,
                  left: (habitatShiftCardDimensions.width - 70) / 2,
                  width: 70,
                  height: 70,
                },
                children: this.ui.Image({
                  source: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay | null) => {
                    if (!state?.habitatZone) return null;
                    const habitat = state?.habitatZone;
                    return this.ui.assetIdToImageSource?.(habitat.id?.replace(/-\d+-\d+$/, '') || habitat.name.toLowerCase().replace(/\s+/g, '-'));
                  }),
                  style: {
                    width: 70,
                    height: 70,
                  },
                }),
              }),

              // Green glow effect
              this.ui.View({
                style: {
                  position: 'absolute',
                  top: -4,
                  left: -4,
                  right: -4,
                  bottom: -4,
                  borderWidth: 4,
                  borderColor: '#4caf50',
                  borderRadius: 8,
                  shadowColor: '#4caf50',
                  shadowRadius: 10,
                },
              }),
            ],
          }),
        ],
      });
    }
  }

  // ==================== bloombeasts\ui\screens\battle\PlayerHand.ts ====================

  /**
   * Player hand overlay - 5 card slots with scroll and toggle
   */


  export class PlayerHand {
    private ui: PlayerHandProps['ui'];
    private getBattleDisplayValue: () => any | null;
    private onAction?: (action: string) => void;
    private onShowHandChange?: (newValue: boolean) => void;
    private onScrollOffsetChange?: (newValue: number) => void;
    private onRenderNeeded?: () => void;
    private showPlayedCard?: (card: any, callback?: () => void) => void;

    // Combined binding to avoid creating multiple multi-binding derives
    private handDataBinding: any;

    constructor(props: PlayerHandProps) {
      this.ui = props.ui;
      this.getBattleDisplayValue = props.getBattleDisplayValue;
      this.onAction = props.onAction;
      this.onShowHandChange = props.onShowHandChange;
      this.onScrollOffsetChange = props.onScrollOffsetChange;
      this.onRenderNeeded = props.onRenderNeeded;
      this.showPlayedCard = props.showPlayedCard;
    }

    /**
     * Create static card structure with reactive properties for hand slot
     * Now uses the shared reactive card component
     */
    private createHandCardStructure(slotIndex: number, cardsPerPage: number): UINodeType {
      return createReactiveCardComponent(this.ui, {
        mode: 'battleHand',
        slotIndex,
        cardsPerPage,
        showDeckIndicator: false,
      });
    }

    /**
     * Create player hand overlay - REACTIVE version using bindings
     * Creates all slots upfront, uses bindings to show/hide cards
     */
    createPlayerHand(): UINodeType {
      // Hand overlay dimensions
      const cardWidth = standardCardDimensions.width;  // 210
      const cardHeight = standardCardDimensions.height; // 280
      const cardsPerRow = 5;
      const rowsPerPage = 1;
      const spacing = 10;
      const startX = 50;
      const overlayWidth = 1210;
      const startY = 10;

      const cardsPerPage = cardsPerRow * rowsPerPage;

      // Create card slots (5 slots total for one row)
      const cardSlots = Array.from({ length: cardsPerPage }, (_, slotIndex) => {
        const col = slotIndex % cardsPerRow;
        const row = Math.floor(slotIndex / cardsPerRow);
        const x = startX + col * (cardWidth + spacing);
        const y = startY + row * (cardHeight + spacing);

        return this.ui.View({
          style: {
            position: 'absolute',
            left: x,
            top: y,
            width: cardWidth,
            height: cardHeight,
            // Hide slot if no card - derive directly from battleDisplay and handScrollOffset
            display: this.ui.bindingManager.derive(
              [BindingType.BattleDisplay, BindingType.UIState],
              (display: BattleDisplay | null, uiState: UIState) => {
                const scrollOffset = uiState.battle?.handScrollOffset ?? 0;
                if (!display || !display.playerHand) return 'none';
                const actualIndex = scrollOffset * cardsPerPage + slotIndex;
                const card = display.playerHand[actualIndex];
                return card ? 'flex' : 'none';
              }
            ),
          },
          children: [
            // Card component wrapper - always exists, card content is reactive
            this.ui.View({
              style: {
                width: cardWidth,
                height: cardHeight,
              },
              children: this.ui.Pressable({
                onClick: () => {
                  const scrollOffset = this.ui.bindingManager.getSnapshot(BindingType.UIState).battle?.handScrollOffset ?? 0;
                  const actualIndex = scrollOffset * cardsPerPage + slotIndex;
                  // Get current card state from cached value
                  const display = this.getBattleDisplayValue();
                  if (display && display.playerHand) {
                    const card = display.playerHand[actualIndex];
                    if (card) {

                      // Show card popup for magic/buff cards, then play
                      if (card.type === CardType.Magic || card.type === CardType.Buff) {
                        this.showPlayedCard?.(card, () => {
                          this.onAction?.(`play-card-${actualIndex}`);
                        });
                      } else {
                        this.onAction?.(`play-card-${actualIndex}`);
                      }
                    } else {
                    }
                  } else {
                  }
                },
                style: {
                  width: cardWidth,
                  height: cardHeight,
                  position: 'relative',
                },
                children: this.createHandCardStructure(slotIndex, cardsPerPage),
              }),
            }),

            // Dim overlay if not affordable - derive directly from battleDisplay and handScrollOffset
            this.ui.View({
              style: {
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: this.ui.bindingManager.derive(
                  [BindingType.BattleDisplay, BindingType.UIState],
                  (display: BattleDisplay | null, uiState: UIState) => {
                    const scrollOffset = uiState.battle?.handScrollOffset ?? 0;
                    if (!display || !display.playerHand) return 'transparent';
                    const actualIndex = scrollOffset * cardsPerPage + slotIndex;
                    const card = display.playerHand[actualIndex];
                    if (!card) return 'transparent';
                    const canAfford = card.cost <= display.playerEnergy;
                    return canAfford ? 'transparent' : 'rgba(0, 0, 0, 0.5)';
                  }
                ),
              },
            }),
          ].filter(Boolean),
        });
      });

      return this.ui.View({
        style: {
          position: 'absolute',
          left: (gameDimensions.panelWidth - overlayWidth) / 2,
          bottom: 0,
          width: overlayWidth,
          height: this.ui.bindingManager.derive(
            [BindingType.UIState],
            (uiState: UIState) => {
              const showFull = uiState.battle?.showHand ?? false;
              return showFull ? 300 : 80;
            }
          ),
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderWidth: 3,
          borderColor: '#4a8ec2',
        },
        children: [
          // Background blocker to prevent clicks passing through
          this.ui.Pressable({
            onClick: () => {
              // Consume clicks to prevent them from passing through
            },
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: -1,
            },
            children: [],
          }),

          // Render all card slots (they show/hide based on bindings)
          ...cardSlots,

          // Toggle button
          this.ui.Pressable({
            onClick: () => {
              const snapshot = this.ui.bindingManager.getSnapshot(BindingType.UIState);
              const showFull = snapshot.battle?.showHand ?? false;
              const newShowHand = !showFull;
              this.ui.bindingManager.setBinding(BindingType.UIState, {
                ...snapshot,
                battle: {
                  ...snapshot.battle,
                  showHand: newShowHand,
                },
              });
              this.onRenderNeeded?.();
              this.onShowHandChange?.(newShowHand);
              this.onAction?.('toggle-hand');
            },
            style: {
              position: 'absolute',
              left: overlayWidth - 80,
              top: 10,
              width: 60,
              height: 50,
              backgroundColor: '#4a8ec2',
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
            },
            children: this.ui.Text({
              text: this.ui.bindingManager.derive(
                [BindingType.UIState],
                (uiState: UIState) => {
                  const showFull = uiState.battle?.showHand ?? false;
                  return showFull ? 'X' : '↑';
                }
              ),
              style: {
                fontSize: 24,
                fontWeight: 'bold',
                color: '#fff',
              },
            }),
          }),

          // Scroll buttons (show/hide based on showHand binding)
          // Up button (positioned below toggle button)
          this.ui.Pressable({
            onClick: () => {
              const snapshot = this.ui.bindingManager.getSnapshot(BindingType.UIState);
              const scrollOffset = snapshot.battle?.handScrollOffset ?? 0;
              const newOffset = Math.max(0, scrollOffset - 1);
              this.onScrollOffsetChange?.(newOffset);
            },
            disabled: this.ui.bindingManager.derive(
              [BindingType.UIState],
              (uiState: UIState) => {
                const scrollOffset = uiState.battle?.handScrollOffset ?? 0;
                return scrollOffset <= 0;
              }
            ),
            style: {
              position: 'absolute',
              left: overlayWidth - 80,
              top: 10 + 50 + 10, // Below toggle button
              width: 60,
              height: 50,
              backgroundColor: this.ui.bindingManager.derive(
                [BindingType.UIState],
                (uiState: UIState) => {
                  const scrollOffset = uiState.battle?.handScrollOffset ?? 0;
                  return scrollOffset > 0 ? '#4a8ec2' : '#666';
                }
              ),
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: this.ui.bindingManager.derive(
                [BindingType.UIState],
                (uiState: UIState) => {
                  const scrollOffset = uiState.battle?.handScrollOffset ?? 0;
                  return scrollOffset > 0 ? 1 : 0.5;
                }
              ),
              display: this.ui.bindingManager.derive(
                [BindingType.UIState],
                (uiState: UIState) => {
                  const showFull = uiState.battle?.showHand ?? false;
                  return showFull ? 'flex' : 'none';
                }
              ),
            },
            children: this.ui.Text({
              text: '⬆',
              style: {
                fontSize: 32,
                color: '#fff',
              },
            }),
          }),

          // Down button (positioned below up button)
          this.ui.Pressable({
            onClick: () => {
              const snapshot = this.ui.bindingManager.getSnapshot(BindingType.UIState);
              const scrollOffset = snapshot.battle?.handScrollOffset ?? 0;
              const newOffset = scrollOffset + 1;
              this.onScrollOffsetChange?.(newOffset);
            },
            disabled: this.ui.bindingManager.derive(
              [BindingType.UIState, BindingType.BattleDisplay],
              (uiState: UIState, display: BattleDisplay | null) => {
                const scrollOffset = uiState.battle?.handScrollOffset ?? 0;
                const totalPages = Math.ceil(display?.playerHand?.length ?? 0 / cardsPerPage);
                return scrollOffset >= totalPages - 1 || (display?.playerHand?.length ?? 0) <= cardsPerPage;
              }
            ),
            style: {
              position: 'absolute',
              left: overlayWidth - 80,
              top: 10 + 50 + 10 + 50 + 10, // Below up button
              width: 60,
              height: 50,
              backgroundColor: this.ui.bindingManager.derive(
                [BindingType.UIState, BindingType.BattleDisplay],
                (uiState: UIState, display: BattleDisplay | null) => {
                  const scrollOffset = uiState.battle?.handScrollOffset ?? 0;
                  const totalPages = Math.ceil(display?.playerHand?.length ?? 0 / cardsPerPage);
                  return (scrollOffset < totalPages - 1 && (display?.playerHand?.length ?? 0) > cardsPerPage) ? '#4a8ec2' : '#666';
                }
              ),
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: this.ui.bindingManager.derive(
                [BindingType.UIState, BindingType.BattleDisplay],
                (uiState: UIState, display: BattleDisplay | null) => {
                  const scrollOffset = uiState.battle?.handScrollOffset ?? 0;
                  const totalPages = Math.ceil(display?.playerHand?.length ?? 0 / cardsPerPage);
                  return (scrollOffset < totalPages - 1 && (display?.playerHand?.length ?? 0) > cardsPerPage) ? 1 : 0.5;
                }
              ),
              display: this.ui.bindingManager.derive(
                [BindingType.UIState],
                (uiState: UIState) => {
                  const showFull = uiState.battle?.showHand ?? false;
                  return showFull ? 'flex' : 'none';
                }
              ),
            },
            children: this.ui.Text({
              text: '⬇',
              style: {
                fontSize: 32,
                color: '#fff',
              },
            }),
          }),
        ].filter(Boolean),
      });
    }
  }

  // ==================== bloombeasts\ui\screens\battle\InfoDisplays.ts ====================

  /**
   * Player and opponent info displays (health, energy, deck count, timer)
   */


  // Helper to format timer display
  function formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }

  export class InfoDisplays {
    private ui: InfoDisplaysProps['ui'];

    constructor(props: InfoDisplaysProps) {
      this.ui = props.ui;
    }

    /**
     * Create player and opponent info displays - Centered at top with two columns
     */
    createInfoDisplays(): UINodeType {
      const boxWidth = 225;
      const centerX = 640; // Center of 1280px wide screen
      const topY = 10;

      return this.ui.View({
        style: {
          position: 'absolute',
          left: centerX - boxWidth / 2,
          top: topY,
          width: boxWidth,
          height: 125,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          borderRadius: 12,
          borderWidth: 2,
          borderColor: 'rgba(74, 142, 194, 0.8)',
          flexDirection: 'row',
          paddingTop: 15,
          paddingBottom: 10,
          paddingLeft: 10,
          paddingRight: 10,
          gap: 10,
        },
        children: [
          // Opponent column (left)
          this.ui.View({
            style: {
              flex: 1,
              flexDirection: 'column',
              gap: 3,
              paddingRight: 5,
              borderRightWidth: 1,
              borderRightColor: 'rgba(255, 255, 255, 0.3)',
            },
            children: [
              this.ui.Text({
                text: 'Opponent',
                style: {
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#ff6b6b',
                  textAlign: 'center',
                },
              }),
              // Timer
              this.ui.Text({
                text: this.ui.bindingManager.derive([BindingType.UIState], (state: UIState) =>
                  state.battle?.opponentTimer ? `⏱️ ${formatTime(state.battle.opponentTimer)}` : '⏱️ 0:00'
                ),
                style: {
                  fontSize: 15,
                  fontWeight: 'bold',
                  color: this.ui.bindingManager.derive([BindingType.UIState], (state: UIState) =>
                    state.battle?.opponentTimer ? '#ff6b6b' : '#fff'
                  ),
                  textAlign: 'center',
                },
              }),
              this.ui.Text({
                text: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) =>
                  state ? `❤️ ${state?.opponentHealth}/${state?.opponentMaxHealth}` : '❤️ 20/20'
                ),
                style: {
                  fontSize: 15,
                  color: '#fff',
                  textAlign: 'center',
                },
              }),
              this.ui.Text({
                text: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) =>
                  state ? `${energyEmoji} ${state.opponentEnergy}/10` : `${energyEmoji} 0/10`
                ),
                style: {
                  fontSize: 15,
                  color: '#fff',
                  textAlign: 'center',
                },
              }),
              this.ui.Text({
                text: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) =>
                  state ? `${deckEmoji} ${state.opponentDeckCount}/30` : `${deckEmoji} 30/30`
                ),
                style: {
                  fontSize: 15,
                  color: '#fff',
                  textAlign: 'center',
                },
              }),
            ],
          }),

          // Player column (right)
          this.ui.View({
            style: {
              flex: 1,
              flexDirection: 'column',
              gap: 3,
              paddingLeft: 5,
            },
            children: [
              this.ui.Text({
                text: 'Player',
                style: {
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: '#4a8ec2',
                  textAlign: 'center',
                },
              }),
              // Timer
              this.ui.Text({
                text: this.ui.bindingManager.derive([BindingType.UIState], (state: UIState) =>
                  state.battle?.playerTimer ? `⏱️ ${formatTime(state.battle.playerTimer)}` : '⏱️ 0:00'
                ),
                style: {
                  fontSize: 15,
                  fontWeight: 'bold',
                  color: this.ui.bindingManager.derive([BindingType.UIState], (state: UIState) =>
                    state.battle?.playerTimer ? '#4a8ec2' : '#fff'
                  ),
                  textAlign: 'center',
                },
              }),
              this.ui.Text({
                text: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) =>
                  state ? `❤️ ${state.playerHealth}/${state.playerMaxHealth}` : '❤️ 20/20'
                ),
                style: {
                  fontSize: 15,
                  color: '#fff',
                  textAlign: 'center',
                },
              }),
              this.ui.Text({
                text: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) =>
                  state ? `${energyEmoji} ${state.playerEnergy}/10` : `${energyEmoji} 0/10`
                ),
                style: {
                  fontSize: 15,
                  color: '#fff',
                  textAlign: 'center',
                },
              }),
              this.ui.Text({
                text: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) =>
                  state ? `${deckEmoji} ${state?.playerDeckCount}/30` : `${deckEmoji} 30/30`
                ),
                style: {
                  fontSize: 15,
                  color: '#fff',
                  textAlign: 'center',
                },
              }),
            ],
          }),
        ],
      });
    }
  }

  // ==================== bloombeasts\ui\screens\battle\BattleSideMenu.ts ====================

  /**
   * Battle side menu - Turn counter, end turn button, forfeit
   */


  export class BattleSideMenu {
    private ui: BattleSideMenuProps['ui'];
    private getIsPlayerTurn: () => boolean;
    private getHasAttackableBeasts: () => boolean;
    private onAction?: (action: string) => void;
    private onActionAsync?: (action: string) => Promise<void>;
    private onStopTurnTimer?: () => void;
    private playSfx?: (sfxId: string) => void;

    constructor(props: BattleSideMenuProps) {
      this.ui = props.ui;
      this.getIsPlayerTurn = props.getIsPlayerTurn;
      this.getHasAttackableBeasts = props.getHasAttackableBeasts;
      this.onAction = props.onAction;
      this.onActionAsync = props.onActionAsync;
      this.onStopTurnTimer = props.onStopTurnTimer;
      this.playSfx = props.playSfx;
    }

    /**
     * Create battle-specific side menu - Fully reactive
     */
    createBattleSideMenu(): UINodeType {
      return this.ui.View({
        style: {
          position: 'absolute',
          left: sideMenuPositions.x,
          top: sideMenuPositions.y,
          width: 225,
          height: 497,
        },
        children: [
          this.ui.Image({
            source: this.ui.assetIdToImageSource?.('container-side-menu') || null,
            style: {
              position: 'absolute',
              width: 225,
              height: 497,
            },
          }),

          // Forfeit button (at header position)
          createButton({
            ui: this.ui,
            label: 'Forfeit',
            onClick: () => {
              this.onAction?.('btn-forfeit');
            },
            color: 'default',
            playSfx: this.playSfx,
            style: {
              position: 'absolute',
              left: sideMenuPositions.headerStartPosition.x - sideMenuPositions.x,
              top: sideMenuPositions.headerStartPosition.y - sideMenuPositions.y,
            },
          }),

          // Attack button (red) - positioned above End Turn button
          createButton({
            ui: this.ui,
            label: 'Attack',
            onClick: async () => {
              const currentIsPlayerTurn = this.getIsPlayerTurn();
              const hasAttackable = this.getHasAttackableBeasts();

              if (currentIsPlayerTurn && hasAttackable) {
                // Attack and wait for it to complete, then auto end turn
                await this.onActionAsync?.('auto-attack-all');
                this.onStopTurnTimer?.();
                this.onAction?.('end-turn');
              }
            },
            // Use complete bindings (avoids .derive() on derived bindings)
            imageSource: this.ui.assetIdToImageSource?.('red-button') || null,
            opacity: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) => {
              // Disabled if state not ready
              if (!state) return 0.5;

              // Disabled if not player turn
              if (state.turnPlayer !== 'player') return 0.5;

              // Check if player has any attackable beasts
              let hasAttackable = false;
              if (state.playerField && Array.isArray(state.playerField)) {
                for (const beast of state.playerField) {
                  if (beast && canAttack(beast)) {
                    hasAttackable = true;
                    break;
                  }
                }
              }

              return hasAttackable ? 1.0 : 0.5;
            }),
            textColor: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) => {
              // Disabled if state not ready
              if (!state) return '#888';

              // Disabled if not player turn
              if (state.turnPlayer !== 'player') return '#888';

              // Check if player has any attackable beasts
              let hasAttackable = false;
              if (state.playerField && Array.isArray(state.playerField)) {
                for (const beast of state.playerField) {
                  if (beast && canAttack(beast)) {
                    hasAttackable = true;
                    break;
                  }
                }
              }

              return hasAttackable ? COLORS.textPrimary : '#888';
            }),
            disabled: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) => {
              // Disabled if state not ready
              if (!state) return true;

              // Disabled if not player turn
              const notPlayerTurn = state.turnPlayer !== 'player';
              if (notPlayerTurn) return true;

              // Check if player has any attackable beasts (using proper canAttack check)
              let hasAttackable = false;
              if (state.playerField && Array.isArray(state.playerField)) {
                for (const beast of state.playerField) {
                  if (beast && canAttack(beast)) {
                    hasAttackable = true;
                    break;
                  }
                }
              }

              // Disabled if no attackable beasts
              return !hasAttackable;
            }),
            playSfx: this.playSfx,
            style: {
              position: 'absolute',
              left: sideMenuPositions.buttonStartPosition.x - sideMenuPositions.x,
              top: sideMenuPositions.buttonStartPosition.y - sideMenuPositions.y - sideMenuButtonDimensions.height - GAPS.buttons,
            },
          }),

          // Skip button with timer - uses derived bindings for reactive updates
          createButton({
            ui: this.ui,
            label: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) =>
              state?.turnPlayer === 'player' ? 'Skip' : 'Enemy Turn'
            ),
            onClick: () => {
              const currentIsPlayerTurn = this.getIsPlayerTurn();
              if (currentIsPlayerTurn) {
                this.onStopTurnTimer?.();
                this.onAction?.('end-turn');
              }
            },
            // Use complete bindings (avoids .derive() on derived bindings)
            imageSource: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) => {
              const color = state?.turnPlayer === 'player' ? 'green' : 'default';
              const assetId = color === 'green' ? 'green-button' : 'standard-button';
              return this.ui.assetIdToImageSource?.(assetId) || null;
            }),
            opacity: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) =>
              state?.turnPlayer !== 'player' ? 0.5 : 1.0
            ),
            textColor: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) =>
              state?.turnPlayer !== 'player' ? '#888' : COLORS.textPrimary
            ),
            disabled: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) =>
              state?.turnPlayer !== 'player'
            ),
            playSfx: this.playSfx,
            style: {
              position: 'absolute',
              left: sideMenuPositions.buttonStartPosition.x - sideMenuPositions.x,
              top: sideMenuPositions.buttonStartPosition.y - sideMenuPositions.y,
            },
          }),
        ],
      });
    }
  }

  // ==================== bloombeasts\ui\screens\battle\index.ts ====================

  /**
   * Battle screen components - Modular, reactive battle UI
   */

  // Export components

  // Export constants from types

  // Note: Prop interfaces (BattleComponentProps, etc.) are exported from types.ts
  // but not re-exported here to avoid namespace bundling issues.
  // Import them directly from './types' if needed externally.

  // ==================== bloombeasts\ui\screens\BattleScreen.ts ====================

  /**
   * Unified Battle Screen Component
   * Works on both Horizon and Web platforms
   * Exactly mimics the UI from deployments/web/src/screens/battleScreen.ts
   */


  // Import modular battle components

  export interface BattleScreenProps {
    ui: UIMethodMappings;
    async: AsyncMethods;
    onAction?: (action: string) => void;
    onNavigate?: (screen: string) => void;
    onRenderNeeded?: () => void;
    onShowCardDetail?: (card: any, durationMs: number, callback?: () => void) => void;
    playSfx?: (sfxId: string) => void;
  }

  /**
   * Unified Battle Screen that exactly replicates web deployment's battle UI
   */
  export class BattleScreen {
    // UI methods (injected)
    private ui: UIMethodMappings;
    private async: AsyncMethods;

    // Temporary card display (for showing played cards)
    private playedCardDisplay: any | null = null;
    private playedCardTimeout: number | null = null;

    // Timer management
    private timerInterval: number | null = null;

    // Track binding values separately (as per Horizon docs - no .get() method)
    private playerTimerValue = TURN_TIMER_SECONDS;
    private opponentTimerValue = TURN_TIMER_SECONDS;
    private isPlayerTurnValue = false;
    private battleDisplayValue: any | null = null;
    private hasAttackableBeasts = false;

    // Track current UIState value for updates
    private currentUIState: any = {
      battle: {
        showHand: true,
        handScrollOffset: 0,
        playerTimer: 300,
        opponentTimer: 300,
        selectedCardDetail: null,
      },
    };

    // Render guard to prevent infinite loops
    private isRendering = false;
    private needsRerender = false;

    // Callbacks
    private onAction?: (action: string) => void;
    private onNavigate?: (screen: string) => void;
    private onRenderNeeded?: () => void;
    private onShowCardDetail?: (card: any, durationMs: number, callback?: () => void) => void;
    private playSfx?: (sfxId: string) => void;

    // Battle components (modular)
    private backgroundComponent!: BattleBackground;
    private beastFieldComponent!: BeastField;
    private trapZoneComponent!: TrapZone;
    private buffZoneComponent!: BuffZone;
    private habitatZoneComponent!: HabitatZone;
    private playerHandComponent!: PlayerHand;
    private infoDisplaysComponent!: InfoDisplays;
    private sideMenuComponent!: BattleSideMenu;

    constructor(props: BattleScreenProps) {
      this.ui = props.ui;
      this.async = props.async;

      // Initialize local value trackers
      this.playerTimerValue = TURN_TIMER_SECONDS;
      this.opponentTimerValue = TURN_TIMER_SECONDS;

      // Wrap onAction to add logging
      this.onAction = props.onAction ? (action: string) => {
        props.onAction!(action);
      } : undefined;

      this.onNavigate = props.onNavigate;
      this.onRenderNeeded = props.onRenderNeeded;
      this.onShowCardDetail = props.onShowCardDetail;
      this.playSfx = props.playSfx;

      // Initialize player turn tracking - derive from battleDisplay only (not multi-binding)
      // NOTE: this should be moved to the battle logic right?
      this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay | null) => {
        const newIsPlayerTurn = state?.turnPlayer === 'player';

        // Cache battle display value for onClick handlers
        this.battleDisplayValue = state;

        // Check if player has any beasts that can attack (using proper canAttack check)
        this.hasAttackableBeasts = false;
        if (state && state.playerField) {
          for (const beast of state.playerField) {
            if (beast && canAttack(beast)) {
              this.hasAttackableBeasts = true;
              break;
            }
          }
        }

        // Start/restart timer based on turn changes or if timer not running
        if (this.isPlayerTurnValue !== newIsPlayerTurn) {
          this.isPlayerTurnValue = newIsPlayerTurn;
          // Restart timer to ensure it's tracking the correct player
          this.stopTurnTimer();
          this.startTurnTimer();
        } else if (state && this.timerInterval === null) {
          // Start timer if it's not running but we have a valid battle state
          this.startTurnTimer();
        }

        return newIsPlayerTurn;
      });

      // Initialize battle components
      this.backgroundComponent = new BattleBackground({
        ui: this.ui,
      });

      this.beastFieldComponent = new BeastField({
        ui: this.ui,
        onAction: this.onAction,
        showPlayedCard: this.showPlayedCard.bind(this),
      });

      this.trapZoneComponent = new TrapZone({
        ui: this.ui,
        onCardDetailSelected: (card) => {
          this.updateUIState({ selectedCardDetail: card });
        },
      });

      this.buffZoneComponent = new BuffZone({
        ui: this.ui,
        onCardDetailSelected: (card) => {
          this.updateUIState({ selectedCardDetail: card });
        },
      });

      this.habitatZoneComponent = new HabitatZone({
        ui: this.ui,
        onCardDetailSelected: (card) => {
          const habitatWithType = { ...card, type: 'Habitat' };
          this.updateUIState({ selectedCardDetail: habitatWithType });
        },
      });

      this.playerHandComponent = new PlayerHand({
        ui: this.ui,
        getBattleDisplayValue: () => this.battleDisplayValue,
        onAction: this.onAction,
        onShowHandChange: (newValue) => {
          this.updateUIState({ showHand: newValue });
        },
        onScrollOffsetChange: (newValue) => {
          this.updateUIState({ handScrollOffset: newValue });
        },
        onRenderNeeded: this.onRenderNeeded,
        showPlayedCard: this.showPlayedCard.bind(this),
      });

      this.infoDisplaysComponent = new InfoDisplays({
        ui: this.ui,
      });

      this.sideMenuComponent = new BattleSideMenu({
        ui: this.ui,
        getIsPlayerTurn: () => this.isPlayerTurnValue,
        getHasAttackableBeasts: () => this.hasAttackableBeasts,
        onAction: this.onAction,
        onActionAsync: async (action: string) => {
          // Call the action and wait for animations to complete
          if (this.onAction) {
            this.onAction!(action);
            // Wait for attack animations to complete (auto-attack-all can have multiple animations)
            // Each attack takes about 1 second, and there can be up to 3 attacks
            await new Promise<void>((resolve) => {
              this.async.setTimeout(() => resolve(), AUTO_ATTACK_TOTAL_DELAY_MS);
            });
          }
        },
        onStopTurnTimer: () => this.stopTurnTimer(),
        playSfx: this.playSfx,
      });
    }

    /**
     * Helper to update UIState.battle
     */
    private updateUIState(updates: Partial<typeof this.currentUIState.battle>): void {
      this.currentUIState = {
        ...this.currentUIState,
        battle: {
          ...this.currentUIState.battle,
          ...updates,
        },
      };
      this.ui.bindingManager.setBinding(BindingType.UIState, this.currentUIState);
      this.onRenderNeeded?.();
    }

    /**
     * Create the complete battle UI
     */
    createUI(): UINodeType {
      this.isRendering = true;
      this.needsRerender = false;

      // Mark rendering as complete
      this.finishRender();

      // Full battle UI - all structure created once, bindings handle updates
      return this.ui.View({
        style: {
          width: '100%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // Stretched background layer
          this.backgroundComponent.createBackground(),

          // Game content container - all content scales to fit screen
          this.ui.View({
            style: {
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
            },
            children: [
                // Layer 2: Playboard overlay
                // TODO futre
                // this.backgroundComponent.createPlayboard(),

                // Layer 3: Battle zones (beasts, traps, buffs, habitat)
                ...this.beastFieldComponent.createBeastField('player'),
                ...this.beastFieldComponent.createBeastField('opponent'),
                ...this.trapZoneComponent.createTrapZone('player'),
                ...this.trapZoneComponent.createTrapZone('opponent'),
                ...this.buffZoneComponent.createBuffZone('player'),
                ...this.buffZoneComponent.createBuffZone('opponent'),
                this.habitatZoneComponent.createHabitatZone(),

                // Layer 4: Player/Opponent info displays
                this.infoDisplaysComponent.createInfoDisplays(),

                // Layer 5: Side menu with controls
                this.sideMenuComponent.createBattleSideMenu(),

                // Layer 6: Player hand overlay (always rendered, bindings control visibility)
                this.playerHandComponent.createPlayerHand(),

                // Layer 7: Card detail popup (from battleDisplay) - conditionally visible
                this.createCardPopupLayer(),

                // Layer 7.25: Selected card detail popup (from clicking buff/trap cards) - conditionally visible
                this.createSelectedCardDetailLayer(),

                // Layer 7.5: Played card popup (temporary 2-second display) - conditionally visible
                this.createPlayedCardPopupLayer(),

                // Layer 8: Attack animation overlays
                this.createAttackAnimations(),
            ],
          }),

          // Note: Forfeit popup is handled at the root level in BloomBeastsGame
        ],
      });
    }


    /**
     * Create card popup layer with conditional visibility
     */
    private createCardPopupLayer(): UINodeType {
      // Use UINode.if for conditional rendering if available
      if (this.ui.UINode?.if) {
        return this.ui.UINode.if(
          this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay | null) => !!state?.cardPopup),
          this.ui.View({
            style: {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 1000,
            },
            children: this.ui.Text({
              text: 'Card Popup - TODO: Implement with reactive data',
              style: { color: '#fff', fontSize: 20 }
            }),
          })
        );
      }

      // Fallback: empty View (popup won't work)
      return this.ui.View({ style: { display: 'none' } });
    }

    /**
     * Create selected card detail popup layer with conditional visibility
     */
    private createSelectedCardDetailLayer(): UINodeType {
      // Use UINode.if for conditional rendering if available
      if (this.ui.UINode?.if) {
        return this.ui.UINode.if(
          // Derive visibility from base UIState binding (not from derived selectedCardDetail)
          this.ui.bindingManager.derive([BindingType.UIState], (state: UIState) => !!(state.battle?.selectedCardDetail)),
          this.ui.View({
            style: {
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
            },
            children: [
              // Black backdrop
              this.ui.Pressable({
                onClick: () => {
                  this.updateUIState({ selectedCardDetail: null });
                },
                style: {
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
              }),
              // Card display centered on screen with reactive rendering
              this.ui.View({
                style: {
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                children: this.createBattleCardDisplay(),
              }),
            ],
          })
        );
      }

      // Fallback: empty View
      return this.ui.View({ style: { display: 'none' } });
    }

    /**
     * Create played card popup layer with conditional visibility
     */
    private createPlayedCardPopupLayer(): UINodeType {
      // For now, return empty View since playedCardDisplay is not reactive yet
      // TODO: Make playedCardDisplay reactive and implement properly
      return this.ui.View({ style: { display: 'none' } });
    }

    /**
     * Forfeit popup is now handled at the root level in BloomBeastsGame.ts
     * This method has been removed to avoid duplicate popups
     */

    /**
     * Create battle card display with reactive bindings for selectedCardDetail
     * Now uses the shared reactive card component
     */
    private createBattleCardDisplay(): UINodeType {
      return createReactiveCardComponent(this.ui, {
        mode: 'battleSelectedCard',
        showDeckIndicator: false,
      });
    }

    /**
     * Create card popup overlay
     */
    private createCardPopup(popup: any): UINodeType {
      return this.ui.View({
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
        },
        children: [
          // Card detail popup
          createCardDetailPopup(this.ui, {
            cardDetail: {
              card: popup.card,
              isInDeck: false,
              buttons: popup.showCloseButton ? ['Close'] : []
            },
            onButtonClick: () => this.onAction?.('btn-card-close'),
          }),
        ],
      });
    }

    /**
     * Create attack animation overlays
     */
    private createAttackAnimations(): UINodeType | null {
      // Attack animations are handled directly in the beast field rendering (reactive)
      // This is a placeholder for any additional animation effects
      return null;
    }

    /**
     * Start the turn timer (chess-clock style)
     */
    private startTurnTimer(): void {
      // Don't start if already running
      if (this.timerInterval !== null) {
        return;
      }

      this.onRenderNeeded?.(); // Trigger re-render

      this.timerInterval = this.async.setInterval(() => {
        // Count down the current player's timer
        if (this.isPlayerTurnValue) {
          const current = this.playerTimerValue;
          if (current <= 0) {
            this.stopTurnTimer();
            // Player ran out of time - they lose immediately
            this.onAction?.('timeout-player');
          } else {
            this.playerTimerValue = current - 1;
            this.updateUIState({ playerTimer: this.playerTimerValue });
          }
        } else {
          const current = this.opponentTimerValue;
          if (current <= 0) {
            this.stopTurnTimer();
            // Opponent ran out of time - they lose immediately
            this.onAction?.('timeout-opponent');
          } else {
            this.opponentTimerValue = current - 1;
            this.updateUIState({ opponentTimer: this.opponentTimerValue });
          }
        }
      }, 1000);
    }

    /**
     * Stop the turn timer
     */
    private stopTurnTimer(): void {
      if (this.timerInterval) {
        this.async.clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    }

    /**
     * Update the end turn button text based on turn and timer
     */
    private updateEndTurnButtonText(): void {
      // endTurnButtonText is now a derived binding, so it updates automatically
      // This method is kept for compatibility but doesn't need to do anything
    }

    /**
     * Finish render and trigger re-render if needed
     */
    private finishRender(): void {
      this.isRendering = false;
      if (this.needsRerender) {
        this.needsRerender = false;
        // Use setTimeout to break out of the current call stack
        this.async.setTimeout(() => this.onRenderNeeded?.(), 0);
      }
    }

    /**
     * Cleanup resources
     */
    /**
     * Create played card popup (shows for 2 seconds when card is played)
     */
    private createPlayedCardPopup(card: any): UINodeType {
      return createCardDetailPopup(this.ui, {
        cardDetail: {
          card: card,
          isInDeck: false,
          buttons: []
        },
        onButtonClick: (buttonId: string) => {
          // User can close early by clicking
          if (this.playedCardTimeout) {
            this.async.clearTimeout(this.playedCardTimeout);
            this.playedCardTimeout = null;
          }
          this.playedCardDisplay = null;
          this.onRenderNeeded?.();
        }
      });
    }

    /**
     * Show a played card popup for 2 seconds, then execute callback
     */
    private showPlayedCard(card: any, callback?: () => void): void {

      // Use the onShowCardDetail callback if available
      if (this.onShowCardDetail) {
        this.onShowCardDetail(card, 2000, callback);
      } else {
        console.warn('[BattleScreen] onShowCardDetail not defined, executing callback immediately');
        callback?.();
      }
    }

    public cleanup(): void {
      this.stopTurnTimer();
      // Reset all UI state
      this.playerTimerValue = TURN_TIMER_SECONDS;
      this.opponentTimerValue = TURN_TIMER_SECONDS;

      // Update UIState with reset values
      this.updateUIState({
        playerTimer: 300,
        opponentTimer: 300,
        showHand: true,
        handScrollOffset: 0,
        selectedCardDetail: null,
      });

      // Trigger final re-render
      this.onRenderNeeded?.();

      // Clear played card timeout
      if (this.playedCardTimeout) {
        this.async.clearTimeout(this.playedCardTimeout);
        this.playedCardTimeout = null;
      }
      this.playedCardDisplay = null;
    }
  }

  // ==================== bloombeasts\ui\screens\SettingsScreen.ts ====================

  /**
   * Unified Settings Screen Component
   * Works on both Horizon and Web platforms
   * Matches the styling from settingsScreen.new.ts
   */


  export interface SettingsScreenProps {
    ui: UIMethodMappings;
    onSettingChange?: (settingId: string, value: any) => void;
    onNavigate?: (screen: string) => void;
    onRenderNeeded?: () => void;
    playSfx?: (sfxId: string) => void;
  }

  /**
   * Unified Settings Screen
   */
  export class SettingsScreen {
    // UI methods (injected)
    private ui: UIMethodMappings;
    private settingsValue: any = {};

    private onSettingChange?: (settingId: string, value: any) => void;
    private onNavigate?: (screen: string) => void;
    private onRenderNeeded?: () => void;
    private playSfx?: (sfxId: string) => void;

    constructor(props: SettingsScreenProps) {
      this.ui = props.ui;
      this.onSettingChange = props.onSettingChange;
      this.onNavigate = props.onNavigate;
      this.onRenderNeeded = props.onRenderNeeded;
      this.playSfx = props.playSfx;
    }

    createUI(): UINodeType {
      return this.ui.View({
        style: {
          width: '100%',
          height: '100%',
          position: 'relative',
        },
        children: [
          // Background
          this.ui.Image({
            source: this.ui.assetIdToImageSource?.('background') || null,
            style: {
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
            },
          }),
          // Cards Container image as background
          this.ui.Image({
            source: this.ui.assetIdToImageSource?.('cards-container') || null,
            style: {
              position: 'absolute',
              left: 40,
              top: 40,
              width: 980,
              height: 640,
            },
          }),
          // Main content - settings panel
          // Pass playerDataBinding directly to controls to avoid nesting
          this.ui.View({
            style: {
              position: 'absolute',
              left: 70,
              top: 70,
              width: 920,
              height: 580,
              padding: 40,
            },
            children: [
              // Music settings (pass playerDataBinding directly)
              this.createVolumeControl('Music Volume', 'musicVolume', 'musicVolume'),
              this.createToggleControl('Music', 'musicEnabled', 'musicEnabled'),

              // SFX settings (pass playerDataBinding directly)
              this.createVolumeControl('SFX Volume', 'sfxVolume', 'sfxVolume'),
              this.createToggleControl('Sound Effects', 'sfxEnabled', 'sfxEnabled'),
            ],
          }),
          // Sidebar with common side menu
          createSideMenu(this.ui, {
            title: 'Settings',
            bottomButton: {
              label: 'Back',
              onClick: () => {
                if (this.onNavigate) this.onNavigate('menu');
              },
              disabled: false,
            },
            playSfx: this.playSfx,
          }),
        ],
      });
    }

    /**
     * Create volume control with +/- buttons
     */
    private createVolumeControl(
      label: string,
      settingKey: 'musicVolume' | 'sfxVolume',
      settingId: string
    ): UINodeType {
      return this.ui.View({
        style: {
          marginBottom: 30,
        },
        children: [
          // Label and value
          this.ui.View({
            style: {
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 10,
              alignItems: 'center',
            },
            children: [
              this.ui.Text({
                text: label,
                style: {
                  fontSize: DIMENSIONS.fontSize.xl,
                  color: COLORS.textPrimary,
                },
              }),
              // Volume control: - button, value, + button
              this.ui.View({
                style: {
                  flexDirection: 'row',
                  alignItems: 'center',
                },
                children: [
                  // Decrease button
                  this.ui.Pressable({
                    onClick: () => {
                      if (this.onSettingChange) {
                        const currentSettings = this.settingsValue;
                        const currentValue = currentSettings[settingKey] || 0;
                        const newValue = Math.max(0, currentValue - 10);
                        this.onSettingChange(settingId, newValue);
                      }
                    },
                    style: {
                      width: 40,
                      height: 40,
                      backgroundColor: COLORS.surface,
                      borderRadius: 5,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 15,
                    },
                    children: this.ui.Text({
                      text: '-',
                      style: {
                        fontSize: DIMENSIONS.fontSize.xl,
                        color: COLORS.textPrimary,
                        textAlign: 'center',
                        fontWeight: 'bold',
                      },
                    }),
                  }),
                  // Volume display
                  this.ui.Text({
                    text: this.ui.bindingManager.derive([BindingType.PlayerData], (pd: any) => {
                      const settings = pd?.settings;
                      this.settingsValue = settings;
                      const volume = settings?.[settingKey];
                      return `${volume !== undefined && volume !== null && typeof volume === 'number' ? Math.round(volume) : 0}%`;
                    }),
                    style: {
                      fontSize: DIMENSIONS.fontSize.xl,
                      color: COLORS.success,
                      width: 70,
                      textAlign: 'center',
                    },
                  }),
                  // Increase button
                  this.ui.Pressable({
                    onClick: () => {
                      if (this.onSettingChange) {
                        const currentSettings = this.settingsValue;
                        const currentValue = currentSettings[settingKey] || 0;
                        const newValue = Math.min(100, currentValue + 10);
                        this.onSettingChange(settingId, newValue);
                      }
                    },
                    style: {
                      width: 40,
                      height: 40,
                      backgroundColor: COLORS.surface,
                      borderRadius: 5,
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginLeft: 15,
                    },
                    children: this.ui.Text({
                      text: '+',
                      style: {
                        fontSize: DIMENSIONS.fontSize.xl,
                        color: COLORS.textPrimary,
                        textAlign: 'center',
                        fontWeight: 'bold',
                      },
                    }),
                  }),
                ],
              }),
            ],
          }),
        ],
      });
    }

    /**
     * Create toggle button control
     */
    private createToggleControl(
      label: string,
      settingKey: 'musicEnabled' | 'sfxEnabled',
      settingId: string
    ): UINodeType {
      return this.ui.View({
        style: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 30,
        },
        children: [
          this.ui.Text({
            text: label,
            style: {
              fontSize: DIMENSIONS.fontSize.xl,
              color: COLORS.textPrimary,
            },
          }),

          // Toggle button
          this.ui.Pressable({
            onClick: () => {
              if (this.onSettingChange) {
                const currentSettings = this.settingsValue;
                const currentValue = currentSettings[settingKey];
                const newValue = !currentValue;

                // Just call the callback - let the parent handle updating the binding
                // The binding update will trigger a re-render automatically
                this.onSettingChange(settingId, newValue);
              }
            },
            style: {
              position: 'relative',
              width: 120,
              height: 40,
            },
            children: [
              // Button background image (standard or green based on state)
              this.ui.Image({
                source: this.ui.bindingManager.derive([BindingType.PlayerData], (pd: any) => {
                  const settings = pd?.settings;
                  return this.ui.assetIdToImageSource?.(settings?.[settingKey] ? 'green-button' : 'standard-button') ?? null;
                }),
                style: {
                  position: 'absolute',
                  width: 120,
                  height: 40,
                },
              }),
              // Button text centered
              this.ui.View({
                style: {
                  position: 'absolute',
                  width: 120,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                children: this.ui.Text({
                  text: this.ui.bindingManager.derive([BindingType.PlayerData], (pd: any) => {
                    const settings = pd?.settings;
                    return settings?.[settingKey] ? 'ON' : 'OFF';
                  }),
                  style: {
                    fontSize: DIMENSIONS.fontSize.md,
                    color: COLORS.textPrimary,
                    textAlign: 'center',
                    fontWeight: 'bold',
                    textAlignVertical: 'center',
                  },
                }),
              }),
            ],
          }),
        ],
      });
    }

    dispose(): void {
      // Cleanup
    }
  }

  // ==================== bloombeasts\ui\screens\LeaderboardScreen.ts ====================

  /**
   * Leaderboard Screen Component
   * Displays top players by experience and fastest Cluck Norris completion time
   */


  export interface LeaderboardEntry {
    playerName: string;
    score: number; // XP for experience leaderboard, time in seconds for speed leaderboard
    level?: number; // Only for experience leaderboard
  }

  export interface LeaderboardData {
    topExperience: LeaderboardEntry[];
    fastestCluckNorris: LeaderboardEntry[];
  }

  export interface LeaderboardScreenProps {
    ui: UIMethodMappings;
    onNavigate?: (screen: string) => void;
    playSfx?: (sfxId: string) => void;
  }

  export class LeaderboardScreen {
    private ui: UIMethodMappings;
    private onNavigate?: (screen: string) => void;
    private playSfx?: (sfxId: string) => void;

    constructor(props: LeaderboardScreenProps) {
      this.ui = props.ui;
      this.onNavigate = props.onNavigate;
      this.playSfx = props.playSfx;
    }

    /**
     * Format all leaderboard entries as a single text string
     */
    private formatLeaderboardText(leaderboardType: 'experience' | 'speed'): any {
      return this.ui.bindingManager.derive([BindingType.LeaderboardData], (data: LeaderboardData | null) => {
        if (!data) return '';
        const entries = leaderboardType === 'experience' ? data.topExperience : data.fastestCluckNorris;
        if (!entries || entries.length === 0) return 'No entries yet...';

        const lines: string[] = [];
        for (let i = 0; i < 10; i++) {
          const rank = i + 1;
          const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}.`;

          if (entries[i]) {
            const entry = entries[i];
            let scoreText = '';
            if (leaderboardType === 'speed') {
              scoreText = this.formatTime(entry.score);
            } else {
              scoreText = entry.level ? `Lv${entry.level} ${entry.score}XP` : `${entry.score}XP`;
            }
            lines.push(`${rankEmoji} ${entry.playerName} - ${scoreText}`);
          } else {
            lines.push(`${rankEmoji} ---`);
          }
        }
        return lines.join('\n');
      });
    }

    /**
     * Format time in seconds to readable format
     */
    private formatTime(seconds: number): string {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Create a single leaderboard panel with text column
     */
    private createLeaderboardPanel(
      title: string,
      leaderboardType: 'experience' | 'speed',
      left: number
    ): UINodeType {
      const panelWidth = 450;
      const panelHeight = 580;

      return this.ui.View({
        style: {
          position: 'absolute',
          left: left,
          top: 70,
          width: panelWidth,
          height: panelHeight,
        },
        children: [
          // Title
          this.ui.View({
            style: {
              width: panelWidth,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              // backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: 10,
            },
            children: this.ui.Text({
              text: title,
              style: {
                fontSize: DIMENSIONS.fontSize.xl,
                fontWeight: 'bold',
                color: COLORS.primary,
                // textAlign: 'center',
              },
            }),
          }),
          // All entries as a single text column
          this.ui.View({
            style: {
              position: 'absolute',
              top: 70,
              left: 25,
              width: panelWidth - 50,
              height: panelHeight - 80,
              // backgroundColor: 'rgba(0, 0, 0, 0.5)',
              borderRadius: 10,
              padding: 15,
            },
            children: this.ui.Text({
              text: this.formatLeaderboardText(leaderboardType),
              numberOfLines: 10,
              style: {
                fontSize: DIMENSIONS.fontSize.md,
                color: COLORS.textPrimary,
                lineHeight: 40,
              },
            }),
          }),
        ],
      });
    }

    createUI(): UINodeType {
      return this.ui.View({
        style: {
          width: '100%',
          height: '100%',
          position: 'relative',
        },
        children: [
          // Background
          this.ui.Image({
            source: this.ui.assetIdToImageSource?.('background') || null,
            style: {
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
            },
          }),
          // Cards Container image as background
          this.ui.Image({
            source: this.ui.assetIdToImageSource?.('cards-container') || null,
            style: {
              position: 'absolute',
              left: 40,
              top: 40,
              width: 980,
              height: 640,
            },
          }),
          // Leaderboard panels - pre-created with reactive data
          this.ui.View({
            style: {
              position: 'absolute',
              left: 70,
              top: 0,
              width: 920,
              height: 720,
            },
            children: [
              // Experience Leaderboard (left)
              this.createLeaderboardPanel(
                '🏆 Top Experience',
                'experience',
                0
              ),
              // Speed Leaderboard (right)
              this.createLeaderboardPanel(
                '🐔 Fastest Cluck Norris',
                'speed',
                460
              ),
            ],
          }),
          // Sidebar with common side menu
          createSideMenu(this.ui, {
            title: 'Leaderboard',
            customTextContent: [
              this.ui.View({
                style: {
                  position: 'relative',
                  width: 150,
                },
                children: this.ui.Text({
                  text: 'Who is the Cluck Mister?',
                  numberOfLines: 2,
                  style: {
                    fontSize: DIMENSIONS.fontSize.lg,
                    color: COLORS.textPrimary,
                    lineHeight: DIMENSIONS.fontSize.lg + 5,
                  },
                }),
              }),
            ],
            buttons: [],
            bottomButton: {
              label: 'Back',
              onClick: () => {
                if (this.onNavigate) this.onNavigate('menu');
              },
              disabled: false,
            },
            playSfx: this.playSfx,
          }),
        ],
      });
    }

    dispose(): void {
      // Nothing to clean up
    }
  }

  // ==================== bloombeasts\ui\screens\common\MissionCompletePopup.ts ====================

  /**
   * Unified Mission Complete Popup Component
   * Works on both Horizon and Web platforms
   * Exactly mimics the UI from bloombeasts/screens/missions/MissionCompletePopup.ts
   */


  export interface MissionCompletePopupProps {
    mission: {
      id: string;
      name: string;
      affinity?: 'Forest' | 'Water' | 'Fire' | 'Sky' | 'Boss';
    };
    rewards: {
      xpGained: number;
      beastXP: number;
      coinsReceived?: number;
      completionTimeSeconds: number;
      cardsReceived: any[];
      itemsReceived: Array<{
        itemId: string;
        quantity: number;
        emoji?: string;
        name?: string;
      }>;
      bonusRewards?: string[];
    } | null; // null for mission failed
    chestOpened: boolean;
    onClaimRewards?: () => void;
    onContinue?: () => void;
    playSfx?: (sfxId: string) => void;
  }

  /**
   * Unified Mission Complete Popup using common Popup component
   * Derives content from MissionCompletePopup binding
   */
  export function createMissionCompletePopup(ui: UIMethodMappings, bindingManager: any): UINodeType {
    // Get the playSfx function from current binding state
    const currentProps = bindingManager.getSnapshot(BindingType.MissionCompletePopup);
    const playSfx = currentProps?.playSfx;

    // Derive chest image source
    const chestImageSource = bindingManager.derive([BindingType.MissionCompletePopup], (props: any) => {
      if (!props) return null;
      if (!props.rewards) {
        return ui.assetIdToImageSource?.('lose-image') || null;
      }
      const affinity = props.mission.affinity === 'Boss' ? 'Fire' : (props.mission.affinity || 'Forest');
      const state = props.chestOpened ? 'opened' : 'closed';
      return ui.assetIdToImageSource?.(`${affinity}-chest-${state}`.toLowerCase()) || null;
    });

    // Derive info text
    const infoText = bindingManager.derive([BindingType.MissionCompletePopup], (props: any) => {
      if (!props) return '';
      if (!props.rewards) {
        return 'Better luck next time!\n\nKeep training your beasts\nand try again.';
      }
      if (props.chestOpened) {
        // Show detailed rewards
        const lines: string[] = [];
        if (props.rewards.coinsReceived) {
          lines.push(`🪙 ${props.rewards.coinsReceived} Coins`);
        }
        if (props.rewards.bonusRewards && props.rewards.bonusRewards.length > 0) {
          lines.push(...props.rewards.bonusRewards);
        }
        if (props.rewards.cardsReceived && props.rewards.cardsReceived.length > 0) {
          lines.push('', 'Cards Received:');
          props.rewards.cardsReceived.forEach((card: any) => {
            lines.push(`• ${card.name}`);
          });
        }
        return lines.join('\n');
      } else {
        // Show basic info
        const minutes = Math.floor(props.rewards.completionTimeSeconds / 60);
        const seconds = props.rewards.completionTimeSeconds % 60;
        const timeString = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
        const lines = [
          `Time: ${timeString}`,
          '',
          `Player XP: +${props.rewards.xpGained}`,
          `Beast XP: +${props.rewards.beastXP}`
        ];
        if (props.rewards.coinsReceived) {
          lines.push(`Coins: +${props.rewards.coinsReceived}`);
        }
        return lines.join('\n');
      }
    });

    // Create content
    const content: UINodeType[] = [
      ui.View({
        style: {
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 20,
          marginTop: 10,
          marginBottom: 20,
        },
        children: [
          // Chest or lose image
          ui.Image({
            source: chestImageSource as any,
            style: {
              width: chestImageMissionCompleteDimensions.width,
              height: chestImageMissionCompleteDimensions.height,
            },
          }),

          // Info text
          ui.View({
            style: {
              flex: 1,
              paddingRight: 20,
            },
            children: ui.Text({
              text: infoText as any,
              numberOfLines: 15,
              style: {
                fontSize: DIMENSIONS.fontSize.md,
                color: COLORS.textPrimary,
                textAlign: 'left',
                lineHeight: 20,
              },
            }),
          }),
        ],
      }),
    ];

    // Create button with derived label
    const popupButton: PopupButton = {
      label: bindingManager.derive([BindingType.MissionCompletePopup], (props: any) => {
        if (!props) return 'CONTINUE';
        if (!props.rewards || props.chestOpened) return 'CONTINUE';
        return 'CLAIM REWARDS';
      }) as any,
      onClick: () => {
        const props = bindingManager.getSnapshot(BindingType.MissionCompletePopup);
        if (!props) return;

        if (!props.rewards || props.chestOpened) {
          props.onContinue?.();
        } else {
          props.onClaimRewards?.();
        }
      },
      type: 'long',
      color: 'green',
    };

    return createPopup({
      ui,
      title: bindingManager.derive([BindingType.MissionCompletePopup], (props: any) => {
        return props?.rewards === null ? 'MISSION FAILED' : 'MISSION COMPLETE!';
      }) as any,
      titleColor: bindingManager.derive([BindingType.MissionCompletePopup], (props: any) => {
        return props?.rewards === null ? '#FF4444' : '#FFD700';
      }) as any,
      content,
      buttons: [popupButton],
      playSfx, // Direct function reference, not a binding
      width: missionCompleteCardDimensions.width,
      height: missionCompleteCardDimensions.height,
    });
  }

  /**
   * Create failed mission info text
   */
  function createFailedInfo(ui: UIMethodMappings): UINodeType {
    return ui.View({
      style: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      },
      children: [
        ui.Text({
          text: 'Better luck next time!\n\nKeep training your beasts\nand try again.',
          style: {
            fontSize: DIMENSIONS.fontSize.md,
            lineHeight: 20,
            color: COLORS.textPrimary,
            textAlign: 'center',
          },
        }),
      ],
    });
  }

  /**
   * Create basic info (before chest opened)
   */
  function createBasicInfo(ui: UIMethodMappings, rewards: any): UINodeType {
    const minutes = Math.floor(rewards.completionTimeSeconds / 60);
    const seconds = rewards.completionTimeSeconds % 60;
    const timeString = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

    const lines = [`Time: ${timeString}`, '', `Player XP: +${rewards.xpGained}`, `Beast XP: +${rewards.beastXP}`];

    // Add coins if present
    if (rewards.coinsReceived) {
      lines.push(`Coins: +${rewards.coinsReceived}`);
    }

    // Add bonus rewards if present
    if (rewards.bonusRewards && rewards.bonusRewards.length > 0) {
      lines.push('');
      rewards.bonusRewards.forEach((bonus: string) => {
        lines.push(bonus);
      });
    }

    return ui.View({
      style: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      },
      children: lines.map((line, index) =>
        ui.Text({
          text: line,
          style: {
            fontSize: DIMENSIONS.fontSize.md,
            color: line.includes('Boost:') ? '#FFD700' : COLORS.textPrimary,
            textAlign: 'center',
            marginBottom: 5,
          },
        })
      ),
    });
  }

  /**
   * Create detailed rewards (after chest opened)
   */
  function createDetailedRewards(ui: UIMethodMappings, rewards: any): UINodeType {
    const elements: UINodeType[] = [];

    // Coins received
    if (rewards.coinsReceived) {
      elements.push(
        ui.Text({
          text: `🪙 ${rewards.coinsReceived} Coins`,
          style: {
            fontSize: DIMENSIONS.fontSize.md,
            color: '#FFD700',
            textAlign: 'center',
            marginBottom: 10,
            fontWeight: 'bold',
          },
        })
      );
    }

    // Bonus rewards (boosts)
    if (rewards.bonusRewards && rewards.bonusRewards.length > 0) {
      rewards.bonusRewards.forEach((bonus: string) => {
        elements.push(
          ui.Text({
            text: bonus,
            style: {
              fontSize: DIMENSIONS.fontSize.sm,
              color: '#FFD700',
              textAlign: 'center',
              marginBottom: 5,
            },
          })
        );
      });
      elements.push(
        ui.View({
          style: { height: 10 },
        })
      );
    }

    // Cards received
    if (rewards.cardsReceived && rewards.cardsReceived.length > 0) {
      elements.push(
        ui.Text({
          text: 'Cards Received:',
          style: {
            fontSize: DIMENSIONS.fontSize.md,
            color: '#FFD700',
            textAlign: 'center',
            marginBottom: 5,
            fontWeight: 'bold',
          },
        })
      );

      rewards.cardsReceived.forEach((card: any, index: number) => {
        elements.push(
          ui.Text({
            text: `• ${card.name}`,
            style: {
              fontSize: DIMENSIONS.fontSize.sm,
              color: COLORS.textPrimary,
              textAlign: 'center',
              marginBottom: 5,
            },
          })
        );
      });

      // Extra spacing
      elements.push(
        ui.View({
          style: { height: 10 },
        })
      );
    }

    // Items received
    if (rewards.itemsReceived && rewards.itemsReceived.length > 0) {
      elements.push(
        ui.Text({
          text: 'Items Received:',
          style: {
            fontSize: DIMENSIONS.fontSize.md,
            color: '#FFD700',
            textAlign: 'center',
            marginBottom: 5,
            fontWeight: 'bold',
          },
        })
      );

      rewards.itemsReceived.forEach((itemReward: any, index: number) => {
        const emoji = itemReward.emoji || '';
        const itemName = itemReward.name || itemReward.itemId;
        elements.push(
          ui.Text({
            text: `${emoji} ${itemName} x${itemReward.quantity}`,
            style: {
              fontSize: DIMENSIONS.fontSize.sm,
              color: COLORS.textPrimary,
              textAlign: 'center',
              marginBottom: 5,
            },
          })
        );
      });

      // Extra spacing
      elements.push(
        ui.View({
          style: { height: 10 },
        })
      );
    }

    return ui.View({
      style: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      },
      children: elements,
    });
  }

  // ==================== bloombeasts\ui\screens\common\ButtonPopup.ts ====================

  /**
   * Button Popup Component
   * Simple popup that shows buttons for user choices
   */


  export interface ButtonPopupProps {
    title: string;
    message?: string;
    buttons: {
      text: string;
      onClick: () => void;
      color?: 'default' | 'red' | 'green';
    }[];
    playSfx?: (sfxId: string) => void;
  }

  /**
   * Create a button popup using the common Popup component
   * Derives content from ForfeitPopup binding
   */
  export function createButtonPopup(ui: UIMethodMappings, bindingManager: any): any {
    // Get the playSfx function from current binding state
    const currentProps = bindingManager.getSnapshot(BindingType.ForfeitPopup);
    const playSfx = currentProps?.playSfx;

    // Derive title
    const title = bindingManager.derive([BindingType.ForfeitPopup], (props: any) => {
      return props?.title || '';
    });

    // Derive message
    const message = bindingManager.derive([BindingType.ForfeitPopup], (props: any) => {
      return props?.message || '';
    });

    // Create buttons that capture click handlers at click time
    const popupButtons: PopupButton[] = [
      {
        label: bindingManager.derive([BindingType.ForfeitPopup], (props: any) => {
          return props?.buttons?.[0]?.text || 'Yes';
        }) as any,
        onClick: () => {
          const props = bindingManager.getSnapshot(BindingType.ForfeitPopup);
          if (props?.buttons?.[0]?.onClick) {
            props.buttons[0].onClick();
          }
        },
        color: bindingManager.derive([BindingType.ForfeitPopup], (props: any) => {
          return (props?.buttons?.[0]?.color || 'default') as ButtonColor;
        }) as any,
      },
      {
        label: bindingManager.derive([BindingType.ForfeitPopup], (props: any) => {
          return props?.buttons?.[1]?.text || 'No';
        }) as any,
        onClick: () => {
          const props = bindingManager.getSnapshot(BindingType.ForfeitPopup);
          if (props?.buttons?.[1]?.onClick) {
            props.buttons[1].onClick();
          }
        },
        color: bindingManager.derive([BindingType.ForfeitPopup], (props: any) => {
          return (props?.buttons?.[1]?.color || 'default') as ButtonColor;
        }) as any,
      },
    ];

    return createPopup({
      ui,
      title: title as any,
      description: message as any,
      buttons: popupButtons,
      playSfx, // Direct function reference, not a binding
      width: 450,
      height: 280,
    });
  }

  // ==================== bloombeasts\screens\battle\BattleDisplayManager.ts ====================

  /**
   * BattleDisplayManager - Handles battle UI rendering and display enrichment
   * Manages battle state visualization, animations, and card popups
   */


  export class BattleDisplayManager {
    private catalogManager: any;

    constructor(catalogManager: any) {
      this.catalogManager = catalogManager;
    }
    /**
     * Create a battle display object from battle state
     */
    createBattleDisplay(
      battleUIState: any,
      attackAnimation?: {
        attackerPlayer: 'player' | 'opponent';
        attackerIndex: number;
        targetPlayer: 'player' | 'opponent' | 'health';
        targetIndex?: number;
      } | null
    ): BattleDisplay | null {
      // Handle new TURBO-based battle state structure
      if (!battleUIState || !battleUIState.battleState || !battleUIState.battleState.turboState) {
        return null;
      }

      const turboState = battleUIState.battleState.turboState;
      const gameData = turboState.gameData;

      // Extract players and field from TURBO state
      const player = gameData.players[0];
      const opponent = gameData.players[1];
      const playerField = gameData.field.player1;
      const opponentField = gameData.field.player2;

      if (!player || !opponent) return null;

      // Determine current turn player
      const turnPlayer = turboState.turnInfo.currentPlayerId === 'player' ? 'player' : 'opponent';

      // Convert to display format
      const display: BattleDisplay = {
        playerHealth: player.health,
        playerMaxHealth: player.maxHealth || STARTING_HEALTH,
        playerDeckCount: player.deck.length,
        playerEnergy: player.energy,
        playerHand: this.enrichHandCards(player.hand),
        playerTrapZone: playerField.traps || [],
        playerBuffZone: playerField.buffs || [],
        opponentHealth: opponent.health,
        opponentMaxHealth: opponent.maxHealth || STARTING_HEALTH,
        opponentDeckCount: opponent.deck.length,
        opponentEnergy: opponent.energy,
        opponentField: this.enrichFieldBeasts(opponentField.beasts, turboState, 1),
        opponentTrapZone: opponentField.traps || [],
        opponentBuffZone: opponentField.buffs || [],
        playerField: this.enrichFieldBeasts(playerField.beasts, turboState, 0),
        currentTurn: turboState.turnInfo.turnNumber,
        turnPlayer: turnPlayer,
        turnTimeRemaining: TURN_TIME_LIMIT,
        objectives: this.getObjectiveDisplay(battleUIState),
        habitatZone: playerField.habitat || opponentField.habitat, // Use whichever has a habitat
        attackAnimation: attackAnimation,
      };

      return display;
    }

    /**
     * Get objective display for current battle
     */
    private getObjectiveDisplay(battleState: any): ObjectiveDisplay[] {
      if (!battleState.mission || !battleState.progress) {
        return [];
      }

      // Check if mission has objectives defined
      if (!battleState.mission.objectives || !Array.isArray(battleState.mission.objectives)) {
        return [];
      }

      return battleState.mission.objectives.map((obj: any) => {
        const key = `${obj.type}-${obj.target || 0}`;
        const progress = battleState.progress.objectiveProgress.get(key) || 0;
        const target = obj.target || 1;

        return {
          description: obj.description || 'Unknown objective',
          progress: Math.min(progress, target),
          target: target,
          isComplete: progress >= target,
        };
      });
    }

    /**
     * Return field beasts as RuntimeCard
     * NOTE: Do NOT apply bonuses here - the engine's StatModifierManager already handles this!
     */
    private enrichFieldBeasts(field: RuntimeCard[], turboState?: any, playerIndex?: number): RuntimeCard[] {
      return field.filter(beast => beast !== null);
    }

    /**
     * Return hand cards as RuntimeCard
     */
    private enrichHandCards(hand: RuntimeCard[]): RuntimeCard[] {
      return hand.filter(card => card !== null);
    }

  }

  // ==================== bloombeasts\screens\missions\types.ts ====================

  /**
   * Mission System Type Definitions
   */


  export type MissionDifficulty = 'beginner' | 'easy' | 'normal' | 'hard' | 'expert';

  export type CardPool = 'common' | 'uncommon' | 'rare' | 'affinity' | 'any';

  export interface ItemReward {
    itemId: string;               // Item ID from items.ts
    minAmount: number;            // Minimum items to receive
    maxAmount: number;            // Maximum items to receive
    dropChance: number;           // Chance to receive (0-1)
  }

  export interface MissionRewards {
    guaranteedXP: number;        // Minimum XP earned
    bonusXPChance: number;        // Chance for bonus XP (0-1)
    bonusXPAmount: number;        // Amount of bonus XP if triggered
    cardRewards: CardReward[];    // Possible card rewards
    coinRewards?: {               // Coin rewards
      minAmount: number;
      maxAmount: number;
      dropChance: number;
    };
    itemRewards?: ItemReward[];   // Possible item rewards (serums, etc)
  }

  export interface CardReward {
    cardPool: CardPool;
    affinity?: Affinity;         // If cardPool is 'affinity'
    minAmount: number;            // Minimum cards to receive
    maxAmount: number;            // Maximum cards to receive
    dropChance: number;           // Chance to receive (0-1)
  }

  export interface MissionObjective {
    type: 'defeat-opponent' | 'survive-turns' | 'deal-damage' |
          'summon-beasts' | 'use-abilities' | 'maintain-health';
    target?: number;              // Target value for objective
    description: string;
  }

  export interface Mission {
    id: string;
    name: string;
    description: string;
    storyText?: string;           // Lore/flavor text
    difficulty: MissionDifficulty;
    level: number;                // Mission level (1-10)
    affinity?: 'Forest' | 'Water' | 'Fire' | 'Sky' | 'Boss'; // Mission affinity for visuals
    beastId: string;              // Beast card ID for mission image (e.g., 'Rootling')

    // Battle configuration
    playerDeck?: DeckList | (() => DeckList);        // Optional fixed deck for player (or factory function)
    opponentDeck: DeckList | (() => DeckList);       // AI opponent's deck (or factory function)
    opponentAI?: AIProfile;        // AI behavior profile (optional)

    // Mission specifics (all optional now)
    objectives?: MissionObjective[];
    turnLimit?: number;           // Optional turn limit

    // Rewards
    rewards: MissionRewards;
    firstTimeBonus?: MissionRewards; // Extra rewards for first completion

    // Progress tracking
    timesCompleted: number;
    bestScore?: number;
    lastPlayed?: Date;
    unlocked: boolean;
  }

  export interface AIProfile {
    name: string;
    difficulty: MissionDifficulty;
    personality: 'aggressive' | 'defensive' | 'balanced' | 'strategic' | 'chaotic';

    // AI behavior weights (0-1)
    aggressiveness: number;       // Likelihood to attack
    resourceManagement: number;   // How well it manages energy
    targetPriority: 'strongest' | 'weakest' | 'random' | 'strategic';
    abilityUsage: number;        // Likelihood to use abilities

    // Special AI behaviors
    behaviors?: AIBehavior[];
  }

  export interface AIBehavior {
    trigger: 'low-health' | 'high-energy' | 'empty-field' | 'turn-count';
    condition?: number;
    action: 'play-defensive' | 'all-out-attack' | 'summon-rush' | 'ability-spam';
  }

  export interface MissionResult {
    missionId: string;
    completed: boolean;
    objectivesCompleted: string[];
    turnsUsed: number;
    damageDealt: number;
    beastsDefeated: number;
    score: number;

    // Rewards earned
    xpEarned: number;
    cardsEarned: AnyCard[];
    energyEarned: number;
  }

  export interface MissionProgress {
    missionId: string;
    attempts: number;
    completions: number;
    bestScore: number;
    totalXPEarned: number;
    totalCardsEarned: number;
    averageCompletion: number;   // Average turns to complete
    currentStreak: number;        // Consecutive completions
  }

  /**
   * Helper to resolve a deck (handles both direct DeckList and factory functions)
   */
  export function resolveDeck(deckOrFactory: DeckList | (() => DeckList)): DeckList {
    if (typeof deckOrFactory === 'function') {
      return deckOrFactory();
    }
    return deckOrFactory;
  }

  // ==================== bloombeasts\screens\missions\definitions\mission01.ts ====================

  /**
   * Mission 01: Rootling
   * Forest Affinity Mission
   */


  export const mission01: Mission = {
    id: 'mission-01',
    name: 'Rootling',
    description: 'Battle the Rootling in the forest depths.',
    difficulty: 'beginner',
    level: 1,
    affinity: 'Forest',
    beastId: 'Rootling',

    // Use a function to build the deck on demand (after catalogs are loaded)
    opponentDeck: () => {
      // Use the proper Forest starter deck builder for a balanced deck
      const deck = buildForestDeck();

      // Safety check - return empty deck if builder failed
      if (!deck || deck.cards.length === 0) {
        console.error('[mission01] Failed to build Forest deck');
        return { name: 'Rootling Deck', affinity: 'Forest' as const, cards: [], totalCards: 0 };
      }

      // Override the name for tutorial context
      return {
        ...deck,
        name: 'Rootling (Tutorial Deck)',
      };
    },

    rewards: {
      guaranteedXP: 50,
      bonusXPChance: 0.5,
      bonusXPAmount: 25,
      cardRewards: [
        {
          cardPool: 'common',
          minAmount: 1,
          maxAmount: 2,
          dropChance: 1.0,
        },
      ],
      coinRewards: {
        minAmount: 50,
        maxAmount: 150,
        dropChance: 1.0,
      },
    },

    timesCompleted: 0,
    unlocked: true, // First mission is always unlocked
  };

  // ==================== bloombeasts\screens\missions\definitions\mission02.ts ====================

  /**
   * Mission 02: Mosslet
   * Forest Affinity Mission
   */


  export const mission02: Mission = {
    id: 'mission-02',
    name: 'Mushroomancer',
    description: 'Face the mystical Mushroomancer among the trees.',
    difficulty: 'beginner',
    level: 2,
    affinity: 'Forest',
    beastId: 'Mushroomancer',

    opponentDeck: () => {
      // Get the catalog manager to access cards
      const game = (globalThis as any).bloomBeastsGame;
      if (!game?.catalogManager) {
        console.error('[mission02] Catalog manager not available');
        return { name: 'Mushroomancer Deck', affinity: 'Forest', cards: [], totalCards: 0 };
      }

      // Simple beginner deck: 3 Mushroomancers only
      const mushroomancerCard = game.catalogManager.getCard('mushroomancer');
      if (!mushroomancerCard) {
        console.error('[mission02] Mushroomancer card not found');
        return { name: 'Mushroomancer Deck', affinity: 'Forest', cards: [], totalCards: 0 };
      }

      const cards = [];
      for (let i = 1; i <= 20; i++) {
        cards.push({
          ...mushroomancerCard,
          instanceId: `mushroomancer-${i}`,
        });
      }

      return {
        name: 'Mushroomancer Pack',
        affinity: 'Forest' as const,
        cards,
        totalCards: cards.length,
      };
    },

    rewards: {
      guaranteedXP: 60,
      bonusXPChance: 0.5,
      bonusXPAmount: 30,
      cardRewards: [
        {
          cardPool: 'common',
          minAmount: 1,
          maxAmount: 2,
          dropChance: 0.9,
        },
      ],
      coinRewards: {
        minAmount: 75,
        maxAmount: 175,
        dropChance: 1.0,
      },
    },

    timesCompleted: 0,
    unlocked: false,
  };

  // ==================== bloombeasts\screens\missions\definitions\mission03.ts ====================

  /**
   * Mission 03: Mosslet
   * Forest Affinity Mission
   */


  export const mission03: Mission = {
    id: 'mission-03',
    name: 'Mosslet',
    description: 'Challenge the sturdy Mosslet in the mossy glen.',
    difficulty: 'easy',
    level: 3,
    affinity: 'Forest',
    beastId: 'Mosslet',

    opponentDeck: () => {
      // Get the catalog manager to access cards
      const game = (globalThis as any).bloomBeastsGame;
      if (!game?.catalogManager) {
        console.error('[mission03] Catalog manager not available');
        return { name: 'Mosslet Deck', affinity: 'Forest', cards: [], totalCards: 0 };
      }

      // Beginner deck: 2 Mosslets + 2 Rootlings + 3 Energy Blocks
      const mossletCard = game.catalogManager.getCard('mosslet');
      const rootlingCard = game.catalogManager.getCard('rootling');
      const energyBlockCard = game.catalogManager.getCard('nectar-block');

      const cards = [];

      // Add 2 Mosslets
      for (let i = 1; i <= 5; i++) {
        cards.push({ ...mossletCard, instanceId: `mosslet-${i}` });
      }

      // Add 2 Rootlings
      for (let i = 1; i <= 5; i++) {
        cards.push({ ...rootlingCard, instanceId: `rootling-${i}` });
      }

      // Add 3 Energy Blocks
      for (let i = 1; i <= 5; i++) {
        cards.push({ ...energyBlockCard, instanceId: `nectar-block-${i}` });
      }

      return {
        name: 'Forest Basics',
        affinity: 'Forest' as const,
        cards,
        totalCards: cards.length,
      };
    },

    rewards: {
      guaranteedXP: 70,
      bonusXPChance: 0.5,
      bonusXPAmount: 35,
      cardRewards: [
        {
          cardPool: 'common',
          minAmount: 1,
          maxAmount: 2,
          dropChance: 0.8,
        },
      ],
      coinRewards: {
        minAmount: 100,
        maxAmount: 200,
        dropChance: 1.0,
      },
    },

    timesCompleted: 0,
    unlocked: false,
  };

  // ==================== bloombeasts\screens\missions\definitions\mission04.ts ====================

  /**
   * Mission 04: Leaf Sprite
   * Forest Affinity Mission
   */


  export const mission04: Mission = {
    id: 'mission-04',
    name: 'Leaf Sprite',
    description: 'Test your skills against the agile Leaf Sprite.',
    difficulty: 'easy',
    level: 4,
    affinity: 'Forest',
    beastId: 'Leaf Sprite',

    opponentDeck: () => {
      // Get the catalog manager to access cards
      const game = (globalThis as any).bloomBeastsGame;
      if (!game?.catalogManager) {
        console.error('[mission04] Catalog manager not available');
        return { name: 'Leaf Sprite Deck', affinity: 'Forest', cards: [], totalCards: 0 };
      }

      // More advanced beginner deck with habitat
      const leafSpriteCard = game.catalogManager.getCard('leaf-sprite');
      const mushroomancerCard = game.catalogManager.getCard('mushroomancer');
      const energyBlockCard = game.catalogManager.getCard('nectar-block');
      const ancientForestCard = game.catalogManager.getCard('ancient-forest');
      const powerUpCard = game.catalogManager.getCard('power-up');

      const cards = [];

      // Add 3 Leaf Sprites
      for (let i = 1; i <= 6; i++) {
        cards.push({ ...leafSpriteCard, instanceId: `leaf-sprite-${i}` });
      }

      // Add 2 Mushroomancers
      for (let i = 1; i <= 6; i++) {
        cards.push({ ...mushroomancerCard, instanceId: `mushroomancer-${i}` });
      }

      // Add 1 Ancient Forest habitat
      cards.push({ ...ancientForestCard, instanceId: 'ancient-forest-1' });

      // Add 5 Energy Blocks
      for (let i = 1; i <= 6; i++) {
        cards.push({ ...energyBlockCard, instanceId: `nectar-block-${i}` });
      }

      // Add 1 Power Up
      cards.push({ ...powerUpCard, instanceId: 'power-up-1' });

      return {
        name: 'Forest Advancement',
        affinity: 'Forest' as const,
        cards,
        totalCards: cards.length,
      };
    },

    rewards: {
      guaranteedXP: 80,
      bonusXPChance: 0.5,
      bonusXPAmount: 40,
      cardRewards: [
        {
          cardPool: 'common',
          minAmount: 1,
          maxAmount: 2,
          dropChance: 0.8,
        },
      ],
      coinRewards: {
        minAmount: 125,
        maxAmount: 225,
        dropChance: 1.0,
      },
    },

    timesCompleted: 0,
    unlocked: false,
  };

  // ==================== bloombeasts\screens\missions\definitions\mission05.ts ====================

  /**
   * Mission 05: Bubblefin
   * Water Affinity Mission
   */


  export const mission05: Mission = {
    id: 'mission-05',
    name: 'Bubblefin',
    description: 'Dive deep to battle the nimble Bubblefin.',
    difficulty: 'normal',
    level: 5,
    affinity: 'Water',
    beastId: 'Bubblefin',

    opponentDeck: () => buildWaterDeck(),

    rewards: {
      guaranteedXP: 90,
      bonusXPChance: 0.5,
      bonusXPAmount: 45,
      cardRewards: [
        {
          cardPool: 'common',
          minAmount: 1,
          maxAmount: 2,
          dropChance: 0.7,
        },
      ],
      coinRewards: {
        minAmount: 150,
        maxAmount: 250,
        dropChance: 1.0,
      },
    },

    timesCompleted: 0,
    unlocked: false,
  };

  // ==================== bloombeasts\screens\missions\definitions\mission06.ts ====================

  /**
   * Mission 06: Dewdrop Drake
   * Water Affinity Mission
   */


  export const mission06: Mission = {
    id: 'mission-06',
    name: 'Dewdrop Drake',
    description: 'Confront the serene Dewdrop Drake by the waterfall.',
    difficulty: 'normal',
    level: 6,
    affinity: 'Water',
    beastId: 'Dewdrop Drake',

    opponentDeck: () => buildWaterDeck(),

    rewards: {
      guaranteedXP: 100,
      bonusXPChance: 0.5,
      bonusXPAmount: 50,
      cardRewards: [
        {
          cardPool: 'common',
          minAmount: 1,
          maxAmount: 2,
          dropChance: 0.7,
        },
      ],
      coinRewards: {
        minAmount: 175,
        maxAmount: 275,
        dropChance: 1.0,
      },
    },

    timesCompleted: 0,
    unlocked: false,
  };

  // ==================== bloombeasts\screens\missions\definitions\mission07.ts ====================

  /**
   * Mission 07: Kelp Cub
   * Water Affinity Mission
   */


  export const mission07: Mission = {
    id: 'mission-07',
    name: 'Kelp Cub',
    description: 'Navigate the kelp forest to face the Kelp Cub.',
    difficulty: 'normal',
    level: 7,
    affinity: 'Water',
    beastId: 'Kelp Cub',

    opponentDeck: () => buildWaterDeck(),

    rewards: {
      guaranteedXP: 110,
      bonusXPChance: 0.5,
      bonusXPAmount: 55,
      cardRewards: [
        {
          cardPool: 'common',
          minAmount: 1,
          maxAmount: 2,
          dropChance: 0.7,
        },
      ],
      coinRewards: {
        minAmount: 200,
        maxAmount: 300,
        dropChance: 1.0,
      },
    },

    timesCompleted: 0,
    unlocked: false,
  };

  // ==================== bloombeasts\screens\missions\definitions\mission08.ts ====================

  /**
   * Mission 08: Aqua Pebble
   * Water Affinity Mission
   */


  export const mission08: Mission = {
    id: 'mission-08',
    name: 'Aqua Pebble',
    description: 'Test your might against the resilient Aqua Pebble.',
    difficulty: 'hard',
    level: 8,
    affinity: 'Water',
    beastId: 'Aqua Pebble',

    opponentDeck: () => buildWaterDeck(),

    rewards: {
      guaranteedXP: 120,
      bonusXPChance: 0.5,
      bonusXPAmount: 60,
      cardRewards: [
        {
          cardPool: 'common',
          minAmount: 1,
          maxAmount: 2,
          dropChance: 0.7,
        },
        {
          cardPool: 'uncommon',
          minAmount: 1,
          maxAmount: 1,
          dropChance: 0.4,
        },
      ],
      coinRewards: {
        minAmount: 225,
        maxAmount: 325,
        dropChance: 1.0,
      },
    },

    timesCompleted: 0,
    unlocked: false,
  };

  // ==================== bloombeasts\screens\missions\definitions\mission09.ts ====================

  /**
   * Mission 09: Magmite
   * Fire Affinity Mission
   */


  export const mission09: Mission = {
    id: 'mission-09',
    name: 'Magmite',
    description: 'Brave the flames to challenge the fierce Magmite.',
    difficulty: 'hard',
    level: 9,
    affinity: 'Fire',
    beastId: 'Magmite',

    opponentDeck: () => buildFireDeck(),

    rewards: {
      guaranteedXP: 130,
      bonusXPChance: 0.5,
      bonusXPAmount: 65,
      cardRewards: [
        {
          cardPool: 'common',
          minAmount: 1,
          maxAmount: 2,
          dropChance: 0.7,
        },
        {
          cardPool: 'uncommon',
          minAmount: 1,
          maxAmount: 1,
          dropChance: 0.5,
        },
      ],
      coinRewards: {
        minAmount: 250,
        maxAmount: 350,
        dropChance: 1.0,
      },
    },

    timesCompleted: 0,
    unlocked: false,
  };

  // ==================== bloombeasts\screens\missions\definitions\mission10.ts ====================

  /**
   * Mission 10: Cinder Pup
   * Fire Affinity Mission
   */


  export const mission10: Mission = {
    id: 'mission-10',
    name: 'Cinder Pup',
    description: 'Face the energetic Cinder Pup in volcanic fields.',
    difficulty: 'hard',
    level: 10,
    affinity: 'Fire',
    beastId: 'Cinder Pup',

    opponentDeck: () => buildFireDeck(),

    rewards: {
      guaranteedXP: 140,
      bonusXPChance: 0.5,
      bonusXPAmount: 70,
      cardRewards: [
        {
          cardPool: 'common',
          minAmount: 1,
          maxAmount: 2,
          dropChance: 0.7,
        },
        {
          cardPool: 'uncommon',
          minAmount: 1,
          maxAmount: 1,
          dropChance: 0.5,
        },
      ],
      coinRewards: {
        minAmount: 275,
        maxAmount: 375,
        dropChance: 1.0,
      },
    },

    timesCompleted: 0,
    unlocked: false,
  };

  // ==================== bloombeasts\screens\missions\definitions\mission11.ts ====================

  /**
   * Mission 11: Charcoil
   * Fire Affinity Mission
   */


  export const mission11: Mission = {
    id: 'mission-11',
    name: 'Charcoil',
    description: 'Battle the smoldering Charcoil in the ember wastes.',
    difficulty: 'hard',
    level: 11,
    affinity: 'Fire',
    beastId: 'Charcoil',

    opponentDeck: () => buildFireDeck(),

    rewards: {
      guaranteedXP: 150,
      bonusXPChance: 0.6,
      bonusXPAmount: 75,
      cardRewards: [
        {
          cardPool: 'uncommon',
          minAmount: 1,
          maxAmount: 2,
          dropChance: 0.7,
        },
      ],
      coinRewards: {
        minAmount: 300,
        maxAmount: 400,
        dropChance: 1.0,
      },
    },

    timesCompleted: 0,
    unlocked: false,
  };

  // ==================== bloombeasts\screens\missions\definitions\mission12.ts ====================

  /**
   * Mission 12: Blazefinch
   * Fire Affinity Mission
   */


  export const mission12: Mission = {
    id: 'mission-12',
    name: 'Blazefinch',
    description: 'Soar through the flames to face the swift Blazefinch.',
    difficulty: 'expert',
    level: 12,
    affinity: 'Fire',
    beastId: 'Blazefinch',

    opponentDeck: () => buildFireDeck(),

    rewards: {
      guaranteedXP: 160,
      bonusXPChance: 0.6,
      bonusXPAmount: 80,
      cardRewards: [
        {
          cardPool: 'uncommon',
          minAmount: 1,
          maxAmount: 2,
          dropChance: 0.7,
        },
        {
          cardPool: 'rare',
          minAmount: 1,
          maxAmount: 1,
          dropChance: 0.4,
        },
      ],
      coinRewards: {
        minAmount: 325,
        maxAmount: 425,
        dropChance: 1.0,
      },
    },

    timesCompleted: 0,
    unlocked: false,
  };

  // ==================== bloombeasts\screens\missions\definitions\mission13.ts ====================

  /**
   * Mission 13: Cirrus Floof
   * Sky Affinity Mission
   */


  export const mission13: Mission = {
    id: 'mission-13',
    name: 'Cirrus Floof',
    description: 'Ascend to the clouds to meet the gentle Cirrus Floof.',
    difficulty: 'expert',
    level: 13,
    affinity: 'Sky',
    beastId: 'Cirrus Floof',

    opponentDeck: () => buildSkyDeck(),

    rewards: {
      guaranteedXP: 170,
      bonusXPChance: 0.6,
      bonusXPAmount: 85,
      cardRewards: [
        {
          cardPool: 'uncommon',
          minAmount: 1,
          maxAmount: 2,
          dropChance: 0.7,
        },
        {
          cardPool: 'rare',
          minAmount: 1,
          maxAmount: 1,
          dropChance: 0.4,
        },
      ],
      coinRewards: {
        minAmount: 350,
        maxAmount: 450,
        dropChance: 1.0,
      },
    },

    timesCompleted: 0,
    unlocked: false,
  };

  // ==================== bloombeasts\screens\missions\definitions\mission14.ts ====================

  /**
   * Mission 14: Gale Glider
   * Sky Affinity Mission
   */


  export const mission14: Mission = {
    id: 'mission-14',
    name: 'Gale Glider',
    description: 'Race through the windstorm against the agile Gale Glider.',
    difficulty: 'expert',
    level: 14,
    affinity: 'Sky',
    beastId: 'Gale Glider',

    opponentDeck: () => buildSkyDeck(),

    rewards: {
      guaranteedXP: 180,
      bonusXPChance: 0.6,
      bonusXPAmount: 90,
      cardRewards: [
        {
          cardPool: 'uncommon',
          minAmount: 1,
          maxAmount: 2,
          dropChance: 0.7,
        },
        {
          cardPool: 'rare',
          minAmount: 1,
          maxAmount: 1,
          dropChance: 0.4,
        },
      ],
      coinRewards: {
        minAmount: 375,
        maxAmount: 475,
        dropChance: 1.0,
      },
    },

    timesCompleted: 0,
    unlocked: false,
  };

  // ==================== bloombeasts\screens\missions\definitions\mission15.ts ====================

  /**
   * Mission 15: Star Bloom
   * Sky Affinity Mission
   */


  export const mission15: Mission = {
    id: 'mission-15',
    name: 'Star Bloom',
    description: 'Reach for the stars to challenge the mystical Star Bloom.',
    difficulty: 'expert',
    level: 15,
    affinity: 'Sky',
    beastId: 'Star Bloom',

    opponentDeck: () => buildSkyDeck(),

    rewards: {
      guaranteedXP: 190,
      bonusXPChance: 0.6,
      bonusXPAmount: 95,
      cardRewards: [
        {
          cardPool: 'uncommon',
          minAmount: 1,
          maxAmount: 2,
          dropChance: 0.7,
        },
        {
          cardPool: 'rare',
          minAmount: 1,
          maxAmount: 1,
          dropChance: 0.5,
        },
      ],
      coinRewards: {
        minAmount: 400,
        maxAmount: 500,
        dropChance: 1.0,
      },
    },

    timesCompleted: 0,
    unlocked: false,
  };

  // ==================== bloombeasts\screens\missions\definitions\mission16.ts ====================

  /**
   * Mission 16: Aero Moth
   * Sky Affinity Mission
   */


  export const mission16: Mission = {
    id: 'mission-16',
    name: 'Aero Moth',
    description: 'Dance among the high winds with the elusive Aero Moth.',
    difficulty: 'expert',
    level: 16,
    affinity: 'Sky',
    beastId: 'Aero Moth',

    opponentDeck: () => buildSkyDeck(),

    rewards: {
      guaranteedXP: 200,
      bonusXPChance: 0.6,
      bonusXPAmount: 100,
      cardRewards: [
        {
          cardPool: 'uncommon',
          minAmount: 2,
          maxAmount: 2,
          dropChance: 0.7,
        },
        {
          cardPool: 'rare',
          minAmount: 1,
          maxAmount: 1,
          dropChance: 0.5,
        },
      ],
      coinRewards: {
        minAmount: 425,
        maxAmount: 525,
        dropChance: 1.0,
      },
    },

    timesCompleted: 0,
    unlocked: false,
  };

  // ==================== bloombeasts\screens\missions\definitions\mission17.ts ====================

  /**
   * Mission 17: Cluck Norris
   * Boss Mission
   */


  // Get Cluck Norris deck - 3 level 9 Cluck Norris beasts
  const getCluckNorrisDeck = (): DeckList => {
    // This function will be called after catalogs are loaded
    // Access the catalog manager through the global game instance
    const game = (globalThis as any).bloomBeastsGame;
    if (!game?.catalogManager) {
      console.error('[mission17] Catalog manager not available');
      return {
        name: 'Cluck Norris Deck',
        affinity: 'Forest',
        cards: [],
        totalCards: 0,
      };
    }

    // Get the Cluck Norris card from the boss catalog
    const cluckNorrisCard = game.catalogManager.getCard('cluck-norris') as BloomBeastCard;

    if (!cluckNorrisCard) {
      console.error('[mission17] Cluck Norris card not found in catalog');
      return {
        name: 'Cluck Norris Deck',
        affinity: 'Forest',
        cards: [],
        totalCards: 0,
      };
    }

    // Create 3 instances of Cluck Norris at level 9 as RuntimeBeast cards
    const cluckNorrisCards: RuntimeBeast[] = [];
    for (let i = 1; i <= 3; i++) {
      cluckNorrisCards.push({
        ...cluckNorrisCard,
        instanceId: `cluck-norris-${i}`,
        cardId: cluckNorrisCard.id,
        currentXP: 25500, // Level 9 XP
        level: 9,
        currentLevel: 9 as any,
        statusEffects: [],
        // Keep base stats at 99/99 as defined in the catalog (already scaled for level 9)
        currentAttack: cluckNorrisCard.baseAttack || 99,
        currentHealth: cluckNorrisCard.baseHealth || 99,
        maxHealth: cluckNorrisCard.baseHealth || 99,
      });
    }

    return {
      name: 'Cluck Norris Deck',
      affinity: 'Forest',
      cards: cluckNorrisCards,
      totalCards: cluckNorrisCards.length,
    };
  };

  export const mission17: Mission = {
    id: 'mission-17',
    name: 'Cluck Norris',
    description: 'Face the legendary Cluck Norris, the ultimate rooster warrior!',
    difficulty: 'expert',
    level: 17,
    affinity: 'Boss',
    beastId: 'Cluck Norris',

    opponentDeck: () => getCluckNorrisDeck(),

    rewards: {
      guaranteedXP: 500,
      bonusXPChance: 0.9,
      bonusXPAmount: 250,
      cardRewards: [
        {
          cardPool: 'rare',
          minAmount: 3,
          maxAmount: 4,
          dropChance: 0.9,
        },
        {
          cardPool: 'rare',
          minAmount: 1,
          maxAmount: 2,
          dropChance: 0.5,
        },
      ],
      coinRewards: {
        minAmount: 1000,
        maxAmount: 1500,
        dropChance: 1.0,
      },
    },

    timesCompleted: 0,
    unlocked: false,
  };

  // ==================== bloombeasts\screens\missions\definitions\index.ts ====================

  /**
   * Central export for all mission definitions
   */


  export const missions: Mission[] = [
    mission01,
    mission02,
    mission03,
    mission04,
    mission05,
    mission06,
    mission07,
    mission08,
    mission09,
    mission10,
    mission11,
    mission12,
    mission13,
    mission14,
    mission15,
    mission16,
    mission17,
  ];

  export const getMissionById = (id: string): Mission | undefined => {
    return missions.find(mission => mission.id === id);
  };

  export const getAvailableMissions = (playerLevel: number): Mission[] => {
    // Return all missions - allow the UI to decide which ones are playable
    // This ensures all 17 missions are visible in the mission select screen
    return missions;
  };

  export const getCompletedMissions = (): Mission[] => {
    return missions.filter(mission => mission.timesCompleted > 0);
  };

  // ==================== bloombeasts\screens\missions\MissionManager.ts ====================

  /**
   * Mission Manager - Handles mission progress, rewards, and completion
   */


  export interface MissionRunProgress {
    missionId: string;
    objectiveProgress: SimpleMap<string, number>;
    turnCount: number;
    isCompleted: boolean;
    damageDealt: number;
    beastsSummoned: number;
    abilitiesUsed: number;
    playerHealth: number;
    opponentHealth: number;
    startTime: number;           // Timestamp when mission started (milliseconds)
    endTime?: number;             // Timestamp when mission ended (milliseconds)
  }

  export interface ItemRewardResult {
    itemId: string;
    quantity: number;
  }

  export interface RewardResult {
    xpGained: number;
    beastXP: number;              // XP earned by beasts
    coinsReceived?: number;       // Coins earned
    cardsReceived: (BloomBeastCard | HabitatCard | TrapCard | MagicCard)[];
    itemsReceived: ItemRewardResult[];
    completionTimeSeconds: number; // Time taken to complete mission
    bonusRewards?: string[];
  }

  export class MissionManager {
    private catalogManager: any;
    private currentMission: Mission | null = null;
    private progress: MissionRunProgress | null = null;
    private completedMissions: SimpleMap<string, number> = new SimpleMap();

    constructor(catalogManager: any) {
      this.catalogManager = catalogManager;
    }

    /**
     * Start a mission
     */
    startMission(missionId: string): Mission | null {
      const mission = getMissionById(missionId);
      if (!mission) {
        Logger.error(`Mission ${missionId} not found`);
        return null;
      }

      this.currentMission = mission;
      this.progress = {
        missionId,
        objectiveProgress: new SimpleMap(),
        turnCount: 0,
        isCompleted: false,
        damageDealt: 0,
        beastsSummoned: 0,
        abilitiesUsed: 0,
        playerHealth: 30,
        opponentHealth: 30,
        startTime: Date.now(),
      };

      // Initialize objective tracking (if objectives exist)
      if (mission.objectives) {
        mission.objectives.forEach(obj => {
          const key = this.getObjectiveKey(obj);
          this.progress!.objectiveProgress.set(key, 0);
        });
      }

      return mission;
    }

    /**
     * Update mission progress based on game events
     */
    updateProgress(event: string, data: any): void {
      if (!this.progress || !this.currentMission) return;

      switch (event) {
        case 'turn-end':
          this.progress.turnCount++;
          this.checkTurnBasedObjectives();
          break;

        case 'damage-dealt':
          this.progress.damageDealt += data.amount;
          this.updateObjective('deal-damage', this.progress.damageDealt);
          break;

        case 'beast-summoned':
          this.progress.beastsSummoned++;
          this.updateObjective('summon-beasts', this.progress.beastsSummoned);
          break;

        case 'ability-used':
          this.progress.abilitiesUsed++;
          this.updateObjective('use-abilities', this.progress.abilitiesUsed);
          break;

        case 'opponent-defeated':
          this.updateObjective('defeat-opponent', 1);
          this.checkMissionCompletion();
          break;

        case 'health-update':
          this.progress.playerHealth = data.playerHealth;
          this.progress.opponentHealth = data.opponentHealth;
          this.updateObjective('maintain-health', this.progress.playerHealth);
          break;
      }

      this.checkMissionCompletion();
    }

    /**
     * Check if all objectives are completed
     */
    private checkMissionCompletion(): void {
      if (!this.currentMission || !this.progress) return;

      // If no objectives, just check if opponent is defeated (default win condition)
      if (!this.currentMission.objectives || this.currentMission.objectives.length === 0) {
        // Mission complete when opponent health reaches 0
        if (this.progress.opponentHealth <= 0) {
          this.progress.isCompleted = true;
        }
        return;
      }

      const allObjectivesComplete = this.currentMission.objectives.every(obj => {
        const key = this.getObjectiveKey(obj);
        const progress = this.progress!.objectiveProgress.get(key) || 0;

        switch (obj.type) {
          case 'defeat-opponent':
            return progress >= 1;
          case 'deal-damage':
          case 'summon-beasts':
          case 'use-abilities':
          case 'survive-turns':
            return progress >= (obj.target || 0);
          case 'maintain-health':
            return this.progress!.playerHealth >= (obj.target || 0);
          default:
            return false;
        }
      });

      if (allObjectivesComplete) {
        this.progress.isCompleted = true;
      }
    }

    /**
     * Complete the mission and generate rewards
     */
    completeMission(): RewardResult | null {
      if (!this.currentMission || !this.progress || !this.progress.isCompleted) {
        return null;
      }

      // Mark mission end time
      this.progress.endTime = Date.now();

      const rewards = this.generateRewards(this.currentMission.rewards);

      // Track completion
      const timesCompleted = this.completedMissions.get(this.currentMission.id) || 0;
      this.completedMissions.set(this.currentMission.id, timesCompleted + 1);
      this.currentMission.timesCompleted = timesCompleted + 1;

      // Unlock next mission
      const nextMissionIndex = missions.indexOf(this.currentMission) + 1;
      if (nextMissionIndex < missions.length) {
        missions[nextMissionIndex].unlocked = true;
      }

      // Clear current mission
      this.currentMission = null;
      this.progress = null;

      return rewards;
    }

    /**
     * Generate rewards based on mission configuration
     */
    private generateRewards(rewardConfig: MissionRewards): RewardResult {
      // Calculate completion time
      const completionTimeMs = (this.progress!.endTime || Date.now()) - this.progress!.startTime;
      const completionTimeSeconds = Math.floor(completionTimeMs / 1000);

      // Calculate beast XP (same as player XP for now)
      const beastXP = rewardConfig.guaranteedXP;

      const result: RewardResult = {
        xpGained: rewardConfig.guaranteedXP,
        beastXP: beastXP,
        cardsReceived: [],
        itemsReceived: [],
        completionTimeSeconds: completionTimeSeconds,
        bonusRewards: [],
      };

      // Roll for bonus XP (applies to both player and beasts)
      if (rewardConfig.bonusXPChance && Math.random() < rewardConfig.bonusXPChance) {
        const bonusAmount = rewardConfig.bonusXPAmount || 0;
        result.xpGained += bonusAmount;
        result.beastXP += bonusAmount;
        result.bonusRewards?.push(`Bonus XP: +${bonusAmount}`);
      }

      // Generate card rewards
      if (rewardConfig.cardRewards) {
        rewardConfig.cardRewards.forEach(cardReward => {
          if (Math.random() < cardReward.dropChance) {
            const amount = Math.floor(
              Math.random() * (cardReward.maxAmount - cardReward.minAmount + 1) +
              cardReward.minAmount
            );

            const cards = this.selectRandomCards(
              cardReward.cardPool,
              amount,
              cardReward.affinity
            );

            result.cardsReceived.push(...cards);
          }
        });
      }

      // Generate coin rewards
      if (rewardConfig.coinRewards) {
        if (Math.random() < rewardConfig.coinRewards.dropChance) {
          const amount = Math.floor(
            Math.random() * (rewardConfig.coinRewards.maxAmount - rewardConfig.coinRewards.minAmount + 1) +
            rewardConfig.coinRewards.minAmount
          );

          result.coinsReceived = amount;
        }
      }

      // Generate item rewards
      if (rewardConfig.itemRewards) {
        rewardConfig.itemRewards.forEach(itemReward => {
          if (Math.random() < itemReward.dropChance) {
            const amount = Math.floor(
              Math.random() * (itemReward.maxAmount - itemReward.minAmount + 1) +
              itemReward.minAmount
            );

            result.itemsReceived.push({
              itemId: itemReward.itemId,
              quantity: amount,
            });
          }
        });
      }

      return result;
    }

    /**
     * Select random cards from the card pool
     */
    private selectRandomCards(
      pool: CardPool,
      amount: number,
      affinity?: string
    ): (BloomBeastCard | HabitatCard | TrapCard | MagicCard)[] {
      const allCards = this.catalogManager.getAllCardData();

      // Filter by pool and affinity
      let eligibleCards = allCards.filter((card: any) => {
        if (affinity && 'affinity' in card && card.affinity !== affinity) {
          return false;
        }

        // Filter by rarity based on pool
        // Cards have rarity added dynamically by getAllCards
        const cardWithRarity = card as any;
        switch (pool) {
          case 'common':
            return !cardWithRarity.rarity || cardWithRarity.rarity === 'common';
          case 'uncommon':
            return cardWithRarity.rarity === 'uncommon';
          case 'rare':
            return cardWithRarity.rarity === 'rare';
          case 'any':
          case 'affinity':
          default:
            return true;
        }
      }) as (BloomBeastCard | HabitatCard | TrapCard | MagicCard)[];

      // Randomly select cards
      const selected: (BloomBeastCard | HabitatCard | TrapCard | MagicCard)[] = [];
      for (let i = 0; i < amount && eligibleCards.length > 0; i++) {
        const index = Math.floor(Math.random() * eligibleCards.length);
        selected.push(eligibleCards[index]);
        // Allow duplicates in rewards
      }

      return selected;
    }

    /**
     * Helper methods
     */
    private getObjectiveKey(objective: MissionObjective): string {
      return `${objective.type}-${objective.target || 0}`;
    }

    private updateObjective(type: string, value: number): void {
      if (!this.progress) return;

      this.progress.objectiveProgress.forEach((_, key) => {
        if (key.startsWith(type)) {
          this.progress!.objectiveProgress.set(key, value);
        }
      });
    }

    private checkTurnBasedObjectives(): void {
      this.updateObjective('survive-turns', this.progress!.turnCount);
    }

    /**
     * Get current mission status
     */
    getCurrentMission(): Mission | null {
      return this.currentMission;
    }

    getProgress(): MissionRunProgress | null {
      return this.progress;
    }

    getCompletedCount(missionId: string): number {
      return this.completedMissions.get(missionId) || 0;
    }

    /**
     * Load completed missions from saved data
     */
    loadCompletedMissions(completedMissionsData: { [missionId: string]: number }): void {
      // Clear current data
      this.completedMissions = new SimpleMap();

      // Load saved completion data
      for (const missionId in completedMissionsData) {
        if (completedMissionsData.hasOwnProperty(missionId)) {
          this.completedMissions.set(missionId, completedMissionsData[missionId]);
        }
      }

      // Restore mission unlock state and completion counts from saved data
      this.restoreMissionState();
    }

    /**
     * Restore mission unlock state and completion counts from saved data
     * This updates the mission definition objects to reflect saved progress
     */
    private restoreMissionState(): void {
      missions.forEach((mission, index) => {
        // Restore completion count
        const completionCount = this.completedMissions.get(mission.id) || 0;
        mission.timesCompleted = completionCount;


        // If mission has been completed before, unlock it and the next mission
        if (completionCount > 0) {
          mission.unlocked = true;

          // Also unlock the next mission when this one is completed
          if (index + 1 < missions.length) {
            missions[index + 1].unlocked = true;
          }
        }
        // Otherwise, keep the mission's original unlocked state from the definition
        // (e.g., mission-01 has unlocked: true in its definition)

      });
    }

    /**
     * Get all completed missions as a plain object for saving
     */
    getCompletedMissionsData(): { [missionId: string]: number } {
      const data: { [missionId: string]: number } = {};
      this.completedMissions.forEach((count, missionId) => {
        data[missionId] = count;
      });
      return data;
    }
  }

  // ==================== bloombeasts\screens\missions\MissionSelectionUI.ts ====================

  /**
   * Mission Selection UI - Display available missions and let players choose
   */


  export interface MissionDisplayData {
    mission: Mission;
    isAvailable: boolean;
    completionCount: number;
    difficultyColor: string;
    rewardPreview: string[];
  }

  export class MissionSelectionUI {
    private missionManager: MissionManager;
    private currentPlayerLevel: number = 1;

    constructor(missionManager: MissionManager) {
      this.missionManager = missionManager;
    }

    /**
     * Set the player's current level for mission filtering
     */
    setPlayerLevel(level: number): void {
      this.currentPlayerLevel = level;
    }

    /**
     * Get all missions formatted for display
     */
    getMissionList(): MissionDisplayData[] {
      const availableMissions = getAvailableMissions(this.currentPlayerLevel);
      const completedMissions = getCompletedMissions();

      return availableMissions.map(mission => ({
        mission,
        isAvailable: this.isMissionPlayable(mission),
        completionCount: this.missionManager.getCompletedCount(mission.id),
        difficultyColor: this.getDifficultyColor(mission.difficulty),
        rewardPreview: this.getRewardPreview(mission),
      }));
    }

    /**
     * Check if a mission can be played
     */
    private isMissionPlayable(mission: Mission): boolean {
      // Check if mission has been completed before - if so, it's always playable (for replay)
      const completionCount = this.missionManager.getCompletedCount(mission.id);
      if (completionCount > 0) {
        return true;
      }

      // First mission is always unlocked
      if (mission.unlocked) {
        return true;
      }

      // For uncompleted missions, check if previous mission is completed
      const allMissions = getAvailableMissions(99); // Get all missions
      const missionIndex = allMissions.findIndex(m => m.id === mission.id);

      if (missionIndex > 0) {
        const previousMission = allMissions[missionIndex - 1];
        const previousCompletionCount = this.missionManager.getCompletedCount(previousMission.id);
        if (previousCompletionCount === 0) {
          return false;
        }
      }

      // Check level requirements for uncompleted missions
      const levelDifference = Math.abs(this.currentPlayerLevel - mission.level);
      return levelDifference <= 3; // Allow missions within 3 levels
    }

    /**
     * Get difficulty color for UI
     */
    private getDifficultyColor(difficulty: string): string {
      switch (difficulty) {
        case 'tutorial':
          return '#90EE90'; // Light green
        case 'easy':
          return '#87CEEB'; // Sky blue
        case 'normal':
          return '#FFD700'; // Gold
        case 'hard':
          return '#FF6347'; // Tomato red
        case 'expert':
          return '#8B008B'; // Dark magenta
        case 'legendary':
          return '#FF1493'; // Deep pink
        default:
          return '#FFFFFF';
      }
    }

    /**
     * Generate reward preview text
     */
    private getRewardPreview(mission: Mission): string[] {
      const preview: string[] = [];

      // XP rewards
      const totalPossibleXP = mission.rewards.guaranteedXP +
                             (mission.rewards.bonusXPAmount || 0);
      preview.push(`XP: ${mission.rewards.guaranteedXP}-${totalPossibleXP}`);

      // Card rewards
      if (mission.rewards.cardRewards && mission.rewards.cardRewards.length > 0) {
        let minCards = 0;
        let maxCards = 0;

        mission.rewards.cardRewards.forEach(reward => {
          if (reward.dropChance >= 0.7) {
            minCards += reward.minAmount;
          }
          maxCards += reward.maxAmount;
        });

        preview.push(`Cards: ${minCards}-${maxCards}`);
      }

      return preview;
    }

    /**
     * Get detailed mission info for display
     */
    getMissionDetails(missionId: string): string {
      const availableMissions = getAvailableMissions(this.currentPlayerLevel);
      const mission = availableMissions.find(m => m.id === missionId);

      if (!mission) {
        return 'Mission not found';
      }

      const details: string[] = [
        `=== ${mission.name} ===`,
        `Level: ${mission.level}`,
        `Difficulty: ${mission.difficulty}`,
        '',
        '📖 Story:',
        mission.storyText || 'No story available',
        '',
        '🎯 Objectives:',
      ];

      if (mission.objectives && mission.objectives.length > 0) {
        mission.objectives.forEach(obj => {
          details.push(`  • ${obj.description}`);
        });
      } else {
        details.push(`  • Defeat the opponent`);
      }


      if (mission.turnLimit) {
        details.push('');
        details.push(`⏱️ Turn Limit: ${mission.turnLimit}`);
      }

      details.push('');
      details.push('🏆 Rewards:');
      this.getRewardPreview(mission).forEach(reward => {
        details.push(`  • ${reward}`);
      });

      const completionCount = this.missionManager.getCompletedCount(mission.id);
      if (completionCount > 0) {
        details.push('');
        details.push(`✅ Completed: ${completionCount} time(s)`);
      }

      return details.join('\n');
    }

    /**
     * Start a selected mission
     */
    startMission(missionId: string): boolean {
      const mission = this.missionManager.startMission(missionId);

      if (!mission) {
        Logger.error('Failed to start mission:', missionId);
        return false;
      }

      Logger.debug(`Starting mission: ${mission.name}`);
      if (mission.opponentAI) {
        Logger.debug(`Opponent: ${mission.opponentAI.name}`);
      }
      Logger.debug(`Difficulty: ${mission.difficulty}`);

      return true;
    }

    /**
     * Get progress display for current mission
     */
    getCurrentMissionProgress(): string[] | null {
      const mission = this.missionManager.getCurrentMission();
      const progress = this.missionManager.getProgress();

      if (!mission || !progress) {
        return null;
      }

      const display: string[] = [
        `Current Mission: ${mission.name}`,
        `Turn: ${progress.turnCount}`,
        '',
        'Objectives Progress:',
      ];

      if (mission.objectives && mission.objectives.length > 0) {
        mission.objectives.forEach(obj => {
          const key = `${obj.type}-${obj.target || 0}`;
          const currentProgress = progress.objectiveProgress.get(key) || 0;
          const target = obj.target || 1;
          const isComplete = currentProgress >= target;
          const status = isComplete ? '✅' : '⬜';

          display.push(`  ${status} ${obj.description} (${Math.min(currentProgress, target)}/${target})`);
        });
      } else {
        display.push(`  ⬜ Defeat the opponent`);
      }

      if (mission.turnLimit) {
        display.push('');
        display.push(`Turns Remaining: ${mission.turnLimit - progress.turnCount}`);
      }

      return display;
    }
  }

  // ==================== bloombeasts\lib\Turbo-Standalone.ts ====================

  /**
   * TURBO - TURn-Based Operations
   * Standalone TypeScript Bundle
   *
   * This file contains the complete Turbo library in a single standalone TypeScript file.
   * All code is wrapped in the Turbo namespace to avoid global scope pollution.
   *
   * Usage:
   *   // Access types and classes via the Turbo namespace
   *   const game = new Turbo.GameController(rules);
   *   const ai = new Turbo.RandomAI(config);
   *
   * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
   * Generated: 2025-11-05T20:11:51.717Z
   * Files: 16
   *
   * @version 2.0.0
   * @license MIT
   */

  /* eslint-disable */
  /* tslint:disable */

  // ==================== Turbo Namespace ====================

  namespace Turbo {

    // ==================== Library Code ====================

    // ==================== src\core\interfaces\IGame.ts ====================

    /**
     * Core game interfaces with proper type safety
     */

    /**
     * Base game state interface
     */
    export interface IGameState<TState extends Record<string, unknown> = Record<string, unknown>> {
      /** Game-specific state managed by the implementation */
      gameData: TState;

      /** Current turn information */
      turnInfo: ITurnInfo;

      /** Players in the game */
      players: IPlayer[];

      /** Current game phase */
      phase: GamePhase;

      /** Whether the game is complete */
      isComplete: boolean;

      /** Winner ID if game is complete */
      winnerId?: string;
    }

    /**
     * Player interface
     */
    export interface IPlayer {
      readonly id: string;
      readonly name: string;
      readonly type: PlayerType;
      metadata?: Record<string, unknown>;
    }

    /**
     * Player type enumeration
     */
    export enum PlayerType {
      HUMAN = 'human',
      AI = 'ai',
    }

    /**
     * Turn information
     */
    export interface ITurnInfo {
      turnNumber: number;
      currentPlayerId: string;
      movesThisTurn: number;
      maxMovesPerTurn?: number;
      timeStarted: number;
    }

    /**
     * Game phase enumeration
     */
    export enum GamePhase {
      NOT_STARTED = 'not_started',
      SETUP = 'setup',
      PLAYING = 'playing',
      PAUSED = 'paused',
      COMPLETED = 'completed',
    }

    /**
     * Game action interface
     */
    export interface IGameAction<TActionData extends Record<string, unknown> = Record<string, unknown>> {
      readonly type: string;
      readonly playerId: string;
      readonly data: TActionData;
      readonly timestamp?: number;
    }

    /**
     * Action validation result
     */
    export interface IActionValidation {
      readonly isValid: boolean;
      readonly reason?: string;
      readonly suggestions?: string[];
    }

    /**
     * Action execution result
     */
    export interface IActionResult<TState extends Record<string, unknown> = Record<string, unknown>> {
      readonly success: boolean;
      readonly newState?: IGameState<TState>;
      readonly error?: Error;
      readonly sideEffects?: ISideEffect[];
    }

    /**
     * Side effect from an action
     */
    export interface ISideEffect {
      readonly type: string;
      readonly description: string;
      readonly data?: Record<string, unknown>;
    }

    /**
     * Game configuration
     */
    export interface IGameConfig {
      readonly players: IPlayer[];
      readonly seed?: string;
      readonly timeLimit?: number;
      readonly customRules?: Record<string, unknown>;
    }

    /**
     * Game controller interface
     */
    export interface IGameController<TState extends Record<string, unknown> = Record<string, unknown>, TAction extends Record<string, unknown> = Record<string, unknown>> {
      initialize(config: IGameConfig): void;
      getState(): IGameState<TState>;
      executeAction(action: IGameAction<TAction>): IActionResult<TState>;
      endTurn(): void;
      isGameOver(): boolean;
      getWinner(): string | undefined;
      reset(): void;
    }

    // ==================== src\core\interfaces\IGameRules.ts ====================

    /**
     * Game rules interface - defines the rules and logic of a specific game
     */


    /**
     * Interface for implementing game-specific rules
     */
    export interface IGameRules<TState extends Record<string, unknown> = Record<string, unknown>, TAction extends Record<string, unknown> = Record<string, unknown>> {
      /**
       * Initialize the game state
       */
      createInitialState(config: IGameConfig): IGameState<TState>;

      /**
       * Validate if an action can be performed
       */
      validateAction(action: IGameAction<TAction>, state: IGameState<TState>): IActionValidation;

      /**
       * Execute an action and return the new state
       */
      executeAction(action: IGameAction<TAction>, state: IGameState<TState>): IActionResult<TState>;

      /**
       * Get all valid actions for the current state
       */
      getValidActions(state: IGameState<TState>): IGameAction<TAction>[];

      /**
       * Check if the game has ended
       */
      checkEndCondition(state: IGameState<TState>): { isEnded: boolean; winnerId?: string; reason?: string };

      /**
       * Calculate score for a player
       */
      calculateScore?(state: IGameState<TState>, playerId: string): number;

      /**
       * Get the next phase based on current state
       */
      getNextPhase?(currentPhase: string, state: IGameState<TState>): string;
    }

    /**
     * Turn order strategy interface
     */
    export interface ITurnOrderStrategy {
      /**
       * Determine the next player
       */
      getNextPlayer(currentPlayerId: string, players: string[]): string;

      /**
       * Reset turn order (e.g., for a new round)
       */
      reset?(): void;
    }

    /**
     * Common turn order strategies
     */
    export class TurnOrderStrategies {
      /**
       * Sequential turn order
       */
      static sequential(): ITurnOrderStrategy {
        return {
          getNextPlayer(currentPlayerId: string, players: string[]): string {
            const currentIndex = players.indexOf(currentPlayerId);
            const nextIndex = (currentIndex + 1) % players.length;
            return players[nextIndex];
          }
        };
      }

      /**
       * Random turn order
       */
      static random(): ITurnOrderStrategy {
        return {
          getNextPlayer(_currentPlayerId: string, players: string[]): string {
            return players[Math.floor(Math.random() * players.length)];
          }
        };
      }

      /**
       * Custom turn order with predefined sequence
       */
      static custom(sequence: string[]): ITurnOrderStrategy {
        let currentIndex = 0;
        return {
          getNextPlayer(): string {
            const player = sequence[currentIndex];
            currentIndex = (currentIndex + 1) % sequence.length;
            return player;
          },
          reset() {
            currentIndex = 0;
          }
        };
      }
    }

    // ==================== src\ai\interfaces\IAI.ts ====================

    /**
     * AI player interfaces
     */


    /**
     * Base AI player interface
     */
    export interface IAIPlayer<TState extends Record<string, unknown> = Record<string, unknown>, TAction extends Record<string, unknown> = Record<string, unknown>> {
      /**
       * Choose an action based on current state
       */
      chooseAction(
        state: IGameState<TState>,
        availableActions: IGameAction<TAction>[]
      ): Promise<IGameAction<TAction> | null>;

      /**
       * Evaluate the state (higher is better for this player)
       */
      evaluateState(state: IGameState<TState>): number;

      /**
       * Get AI difficulty level
       */
      getDifficulty(): AILevel;

      /**
       * Set AI difficulty level
       */
      setDifficulty(level: AILevel): void;
    }

    /**
     * AI difficulty levels
     */
    export enum AILevel {
      EASY = 'easy',
      MEDIUM = 'medium',
      HARD = 'hard',
      EXPERT = 'expert',
    }

    /**
     * AI configuration
     */
    export interface IAIConfig {
      playerId: string;
      difficulty: AILevel;
      thinkingTime?: {
        min: number;
        max: number;
      };
      randomSeed?: string;
      maxDepth?: number;
      evaluationFunction?: (state: IGameState) => number;
    }

    /**
     * Monte Carlo Tree Search node
     */
    export interface IMCTSNode<TState extends Record<string, unknown> = Record<string, unknown>, TAction extends Record<string, unknown> = Record<string, unknown>> {
      state: IGameState<TState>;
      action: IGameAction<TAction> | null;
      parent: IMCTSNode<TState, TAction> | null;
      children: IMCTSNode<TState, TAction>[];
      visits: number;
      totalValue: number;

      isLeaf(): boolean;
      addChild(child: IMCTSNode<TState, TAction>): void;
      getBestChild(explorationConstant: number): IMCTSNode<TState, TAction> | null;
    }

    // ==================== src\utils\deepClone.ts ====================

    /**
     * Efficient deep cloning utility using structured cloning when available
     */

    /**
     * Deep clone an object using the most efficient method available
     */
    export function deepClone<T>(obj: T): T {
      // Use structured cloning if available (Node 17+ and modern browsers)
      if (typeof structuredClone === 'function') {
        try {
          return structuredClone(obj);
        } catch {
          // Fall back to manual cloning if structuredClone fails
        }
      }

      // Manual deep clone for older environments
      return manualDeepClone(obj);
    }

    /**
     * Manual deep clone implementation
     */
    function manualDeepClone<T>(obj: T, visited = new WeakMap()): T {
      // Handle primitives and null
      if (obj === null || typeof obj !== 'object') {
        return obj;
      }

      // Handle circular references
      if (visited.has(obj as object)) {
        return visited.get(obj as object) as T;
      }

      // Handle Date
      if (obj instanceof Date) {
        return new Date(obj.getTime()) as T;
      }

      // Handle RegExp
      if (obj instanceof RegExp) {
        return new RegExp(obj.source, obj.flags) as T;
      }

      // Handle Array
      if (Array.isArray(obj)) {
        const cloned: unknown[] = [];
        visited.set(obj, cloned as T);

        for (let i = 0; i < obj.length; i++) {
          cloned[i] = manualDeepClone(obj[i], visited);
        }

        return cloned as unknown as T;
      }

      // Handle Map
      if (obj instanceof Map) {
        const cloned = new Map();
        visited.set(obj, cloned as T);

        obj.forEach((value, key) => {
          cloned.set(
            manualDeepClone(key, visited),
            manualDeepClone(value, visited)
          );
        });

        return cloned as unknown as T;
      }

      // Handle Set
      if (obj instanceof Set) {
        const cloned = new Set();
        visited.set(obj, cloned as T);

        obj.forEach(value => {
          cloned.add(manualDeepClone(value, visited));
        });

        return cloned as unknown as T;
      }

      // Handle plain objects
      const cloned: Record<string, unknown> = {};
      visited.set(obj as object, cloned as T);

      for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          cloned[key] = manualDeepClone(obj[key], visited);
        }
      }

      return cloned as T;
    }

    /**
     * Create a shallow clone of an object
     */
    export function shallowClone<T extends Record<string, unknown>>(obj: T): T {
      if (Array.isArray(obj)) {
        return [...obj] as unknown as T;
      }

      return { ...obj };
    }

    // ==================== src\core\GameStateManager.ts ====================

    /**
     * Game state management with history and undo/redo support
     */


    /**
     * Manages game state with history tracking
     */
    export class GameStateManager<TState extends Record<string, unknown> = Record<string, unknown>> {
      private currentState: IGameState<TState> | null = null;
      private history: IGameState<TState>[] = [];
      private redoStack: IGameState<TState>[] = [];
      private readonly maxHistorySize: number;

      constructor(maxHistorySize = 100) {
        this.maxHistorySize = maxHistorySize;
      }

      /**
       * Set the current state
       */
      setState(state: IGameState<TState>): void {
        if (this.currentState) {
          this.history.push(deepClone(this.currentState));
        }

        this.currentState = deepClone(state);
        this.redoStack = []; // Clear redo stack on new state

        // Limit history size
        if (this.history.length > this.maxHistorySize) {
          this.history.shift();
        }
      }

      /**
       * Get current state (returns a clone to prevent mutations)
       */
      getCurrentState(): IGameState<TState> | null {
        return this.currentState ? deepClone(this.currentState) : null;
      }

      /**
       * Get state history
       */
      getHistory(): IGameState<TState>[] {
        return this.history.map(state => deepClone(state));
      }

      /**
       * Check if undo is possible
       */
      canUndo(): boolean {
        return this.history.length > 0;
      }

      /**
       * Undo to previous state
       */
      undo(): boolean {
        if (!this.canUndo() || !this.currentState) {
          return false;
        }

        this.redoStack.push(deepClone(this.currentState));
        this.currentState = this.history.pop()!;
        return true;
      }

      /**
       * Check if redo is possible
       */
      canRedo(): boolean {
        return this.redoStack.length > 0;
      }

      /**
       * Redo to next state
       */
      redo(): boolean {
        if (!this.canRedo()) {
          return false;
        }

        if (this.currentState) {
          this.history.push(deepClone(this.currentState));
        }
        this.currentState = this.redoStack.pop()!;
        return true;
      }

      /**
       * Create a checkpoint
       */
      createCheckpoint(): string {
        const checkpointId = `checkpoint_${Date.now()}`;
        // Store checkpoint separately from history
        const checkpoint = this.currentState ? deepClone(this.currentState) : null;
        this.checkpoints.set(checkpointId, checkpoint);
        return checkpointId;
      }

      /**
       * Restore from checkpoint
       */
      restoreCheckpoint(checkpointId: string): boolean {
        const checkpoint = this.checkpoints.get(checkpointId);
        if (!checkpoint) {
          return false;
        }

        if (this.currentState) {
          this.history.push(deepClone(this.currentState));
        }
        this.currentState = deepClone(checkpoint);
        return true;
      }

      /**
       * Reset state manager
       */
      reset(): void {
        this.currentState = null;
        this.history = [];
        this.redoStack = [];
        this.checkpoints.clear();
      }

      private checkpoints = new Map<string, IGameState<TState> | null>();
    }

    // ==================== src\core\TurnManager.ts ====================

    /**
     * Turn management system
     */


    /**
     * Manages turn order and player rotation
     */
    export class TurnManager {
      private players: IPlayer[] = [];
      private currentPlayerIndex = 0;
      private turnOrderStrategy: ITurnOrderStrategy;

      constructor(strategy?: ITurnOrderStrategy) {
        this.turnOrderStrategy = strategy || TurnOrderStrategies.sequential();
      }

      /**
       * Initialize with players
       */
      initialize(players: IPlayer[]): void {
        if (players.length < 2) {
          throw new Error('At least 2 players required');
        }

        this.players = [...players];
        this.currentPlayerIndex = 0;

        if (this.turnOrderStrategy.reset) {
          this.turnOrderStrategy.reset();
        }
      }

      /**
       * Get current player
       */
      getCurrentPlayer(): IPlayer {
        if (this.players.length === 0) {
          throw new Error('Turn manager not initialized');
        }
        return this.players[this.currentPlayerIndex];
      }

      /**
       * Get next player
       */
      getNextPlayer(): string {
        if (this.players.length === 0) {
          throw new Error('Turn manager not initialized');
        }

        const currentPlayerId = this.players[this.currentPlayerIndex].id;
        const playerIds = this.players.map(p => p.id);
        const nextPlayerId = this.turnOrderStrategy.getNextPlayer(currentPlayerId, playerIds);

        // Update current player index
        this.currentPlayerIndex = this.players.findIndex(p => p.id === nextPlayerId);

        if (this.currentPlayerIndex === -1) {
          throw new Error(`Invalid next player ID: ${nextPlayerId}`);
        }

        return nextPlayerId;
      }

      /**
       * Set turn order strategy
       */
      setStrategy(strategy: ITurnOrderStrategy): void {
        this.turnOrderStrategy = strategy;
        if (strategy.reset) {
          strategy.reset();
        }
      }

      /**
       * Get all players
       */
      getPlayers(): IPlayer[] {
        return [...this.players];
      }

      /**
       * Get player by ID
       */
      getPlayer(playerId: string): IPlayer | undefined {
        return this.players.find(p => p.id === playerId);
      }

      /**
       * Reset turn manager
       */
      reset(): void {
        this.players = [];
        this.currentPlayerIndex = 0;
        if (this.turnOrderStrategy.reset) {
          this.turnOrderStrategy.reset();
        }
      }
    }

    // ==================== src\utils\EventBus.ts ====================

    /**
     * Type-safe event bus for game events
     */

    type EventHandler<T = unknown> = (data: T) => void | Promise<void>;

    /**
     * Type-safe event emitter
     */
    export class EventBus<TEvents extends Record<string, unknown>> {
      private listeners = new Map<keyof TEvents, Set<EventHandler<unknown>>>();
      private onceListeners = new Map<keyof TEvents, Set<EventHandler<unknown>>>();

      /**
       * Subscribe to an event
       */
      on<K extends keyof TEvents>(
        event: K,
        handler: EventHandler<TEvents[K]>
      ): () => void {
        if (!this.listeners.has(event)) {
          this.listeners.set(event, new Set());
        }

        const handlers = this.listeners.get(event)!;
        handlers.add(handler as EventHandler<unknown>);

        // Return unsubscribe function
        return () => {
          handlers.delete(handler as EventHandler<unknown>);

          if (handlers.size === 0) {
            this.listeners.delete(event);
          }
        };
      }

      /**
       * Subscribe to an event once
       */
      once<K extends keyof TEvents>(
        event: K,
        handler: EventHandler<TEvents[K]>
      ): void {
        if (!this.onceListeners.has(event)) {
          this.onceListeners.set(event, new Set());
        }

        this.onceListeners.get(event)!.add(handler as EventHandler<unknown>);
      }

      /**
       * Emit an event
       */
      emit<K extends keyof TEvents>(event: K, data: TEvents[K]): void {
        // Handle regular listeners
        const handlers = this.listeners.get(event);
        if (handlers) {
          handlers.forEach(handler => {
            try {
              handler(data);
            } catch (error) {
              console.error(`Error in event handler for ${String(event)}:`, error);
            }
          });
        }

        // Handle once listeners
        const onceHandlers = this.onceListeners.get(event);
        if (onceHandlers) {
          onceHandlers.forEach(handler => {
            try {
              handler(data);
            } catch (error) {
              console.error(`Error in once handler for ${String(event)}:`, error);
            }
          });

          this.onceListeners.delete(event);
        }
      }

      /**
       * Emit an event asynchronously
       */
      async emitAsync<K extends keyof TEvents>(event: K, data: TEvents[K]): Promise<void> {
        const handlers = this.listeners.get(event);
        const onceHandlers = this.onceListeners.get(event);

        const allHandlers = [
          ...(handlers || []),
          ...(onceHandlers || []),
        ];

        await Promise.all(
          allHandlers.map(async handler => {
            try {
              await handler(data);
            } catch (error) {
              console.error(`Error in async handler for ${String(event)}:`, error);
            }
          })
        );

        if (onceHandlers) {
          this.onceListeners.delete(event);
        }
      }

      /**
       * Remove all listeners for an event
       */
      removeAllListeners(event?: keyof TEvents): void {
        if (event) {
          this.listeners.delete(event);
          this.onceListeners.delete(event);
        } else {
          this.listeners.clear();
          this.onceListeners.clear();
        }
      }

      /**
       * Get listener count for an event
       */
      listenerCount(event: keyof TEvents): number {
        const regular = this.listeners.get(event)?.size || 0;
        const once = this.onceListeners.get(event)?.size || 0;
        return regular + once;
      }

      /**
       * Check if there are any listeners for an event
       */
      hasListeners(event: keyof TEvents): boolean {
        return this.listenerCount(event) > 0;
      }
    }

    // ==================== src\core\GameEvents.ts ====================

    /**
     * Game event definitions
     */


    /**
     * Game events type map
     */
    export interface GameEvents<TState extends Record<string, unknown> = Record<string, unknown>> {
      [key: string]: unknown; // Index signature for EventBus compatibility

      gameStarted: {
        state: IGameState<TState>;
        config: IGameConfig;
      };

      gameEnded: {
        winnerId?: string;
        reason?: string;
        state: IGameState<TState>;
      };

      gameReset: Record<string, never>;

      turnStarted: {
        playerId: string;
        turnNumber: number;
      };

      turnEnded: {
        playerId: string;
        turnNumber: number;
      };

      actionExecuted: {
        action: IGameAction;
        result: IActionResult<TState>;
        state: IGameState<TState>;
      };

      actionUndone: {
        state: IGameState<TState>;
      };

      actionRedone: {
        state: IGameState<TState>;
      };

      sideEffect: ISideEffect;

      phaseChanged: {
        oldPhase: string;
        newPhase: string;
        state: IGameState<TState>;
      };

      error: {
        error: Error;
        context?: string;
      };
    }

    // ==================== src\core\GameController.ts ====================

    /**
     * Main game controller - manages game flow and state
     */


    /**
     * Core game controller implementation
     */
    export class GameController<TState extends Record<string, unknown> = Record<string, unknown>, TAction extends Record<string, unknown> = Record<string, unknown>>
      implements IGameController<TState, TAction> {

      private readonly rules: IGameRules<TState, TAction>;
      private readonly stateManager: GameStateManager<TState>;
      private readonly turnManager: TurnManager;
      private readonly eventBus: EventBus<GameEvents<TState>> = new EventBus() as EventBus<GameEvents<TState>>;
      private readonly aiPlayers: Map<string, IAIPlayer<TState, TAction>> = new Map();
      private config: IGameConfig | null = null;

      constructor(rules: IGameRules<TState, TAction>) {
        this.rules = rules;
        this.stateManager = new GameStateManager<TState>();
        this.turnManager = new TurnManager();
      }

      /**
       * Initialize a new game
       */
      initialize(config: IGameConfig): void {
        this.validateConfig(config);

        this.config = config;
        const initialState = this.rules.createInitialState(config);

        this.stateManager.setState(initialState);
        this.turnManager.initialize(config.players);

        this.eventBus.emit('gameStarted', { state: initialState, config });
        this.eventBus.emit('turnStarted', {
          playerId: initialState.turnInfo.currentPlayerId,
          turnNumber: initialState.turnInfo.turnNumber
        });
      }

      /**
       * Get current game state
       */
      getState(): IGameState<TState> {
        const state = this.stateManager.getCurrentState();
        if (!state) {
          throw new Error('Game not initialized');
        }
        return state;
      }

      /**
       * Execute a game action
       */
      executeAction(action: IGameAction<TAction>): IActionResult<TState> {
        const currentState = this.getState();

        // Validate action
        const validation = this.rules.validateAction(action, currentState);
        if (!validation.isValid) {
          return {
            success: false,
            error: new Error(validation.reason || 'Invalid action'),
          };
        }

        // Execute action
        const result = this.rules.executeAction(action, currentState);

        if (result.success && result.newState) {
          // Update state
          this.stateManager.setState(result.newState);

          // Emit events
          this.eventBus.emit('actionExecuted', { action, result, state: result.newState });

          if (result.sideEffects) {
            result.sideEffects.forEach(effect => {
              this.eventBus.emit('sideEffect', effect);
            });
          }

          // Check end condition
          const endCheck = this.rules.checkEndCondition(result.newState);
          if (endCheck.isEnded) {
            this.handleGameEnd(endCheck.winnerId, endCheck.reason);
          }
        }

        return result;
      }

      /**
       * End the current turn
       */
      endTurn(): void {
        const currentState = this.getState();

        if (currentState.isComplete) {
          return;
        }

        const currentPlayerId = currentState.turnInfo.currentPlayerId;
        const nextPlayerId = this.turnManager.getNextPlayer();
        const currentTurnNumber = currentState.turnInfo.turnNumber;

        // Update state with new turn info
        const newState: IGameState<TState> = {
          ...currentState,
          turnInfo: {
            ...currentState.turnInfo,
            currentPlayerId: nextPlayerId,
            turnNumber: currentTurnNumber + 1,
            movesThisTurn: 0,
            timeStarted: Date.now(),
          },
        };

        this.stateManager.setState(newState);

        // Emit events
        this.eventBus.emit('turnEnded', {
          playerId: currentPlayerId,
          turnNumber: currentTurnNumber
        });

        this.eventBus.emit('turnStarted', {
          playerId: nextPlayerId,
          turnNumber: currentTurnNumber + 1
        });
      }

      /**
       * Check if the game is over
       */
      isGameOver(): boolean {
        return this.getState().isComplete;
      }

      /**
       * Get the winner
       */
      getWinner(): string | undefined {
        const state = this.getState();
        return state.isComplete ? state.winnerId : undefined;
      }

      /**
       * Reset the game
       */
      reset(): void {
        this.stateManager.reset();
        this.turnManager.reset();
        this.config = null;
        this.eventBus.emit('gameReset', {});
      }

      /**
       * Subscribe to game events
       */
      on<K extends keyof GameEvents<TState>>(
        event: K,
        handler: (data: GameEvents<TState>[K]) => void
      ): () => void {
        return this.eventBus.on(event, handler);
      }

      /**
       * Get available actions for the current state
       */
      getAvailableActions(): IGameAction<TAction>[] {
        const currentState = this.getState();
        return this.rules.getValidActions(currentState);
      }

      /**
       * Register an AI player
       */
      registerAI(playerId: string, ai: IAIPlayer<TState, TAction>): void {
        this.aiPlayers.set(playerId, ai);
      }

      /**
       * Unregister an AI player
       */
      unregisterAI(playerId: string): void {
        this.aiPlayers.delete(playerId);
      }

      /**
       * Check if a player is controlled by AI
       */
      isAIPlayer(playerId: string): boolean {
        return this.aiPlayers.has(playerId);
      }

      /**
       * Execute AI turn for the current player
       */
      async executeAITurn(): Promise<void> {
        const currentState = this.getState();
        const currentPlayerId = currentState.turnInfo.currentPlayerId;
        const ai = this.aiPlayers.get(currentPlayerId);

        if (!ai) {
          throw new Error(`No AI registered for player ${currentPlayerId}`);
        }

        const availableActions = this.getAvailableActions();
        const action = await ai.chooseAction(currentState, availableActions);

        if (action) {
          this.executeAction(action);
        }
      }

      /**
       * Get the complete winner information, checking if complete
       */
      isComplete(): boolean {
        return this.getState().isComplete;
      }

      /**
       * Perform an action (legacy method name for compatibility)
       */
      performAction(action: IGameAction<TAction>): IActionResult<TState> {
        return this.executeAction(action);
      }

      /**
       * Get action history
       */
      getActionHistory() {
        return this.stateManager.getHistory();
      }

      /**
       * Undo last action
       */
      undo(): boolean {
        const success = this.stateManager.undo();
        if (success) {
          this.eventBus.emit('actionUndone', { state: this.getState() });
        }
        return success;
      }

      /**
       * Redo previously undone action
       */
      redo(): boolean {
        const success = this.stateManager.redo();
        if (success) {
          this.eventBus.emit('actionRedone', { state: this.getState() });
        }
        return success;
      }

      private validateConfig(config: IGameConfig): void {
        if (!config.players || config.players.length < 2) {
          throw new Error('At least 2 players are required');
        }

        const playerIds = new Set(config.players.map(p => p.id));
        if (playerIds.size !== config.players.length) {
          throw new Error('Player IDs must be unique');
        }
      }

      private handleGameEnd(winnerId?: string, reason?: string): void {
        const state = this.getState();
        const endState: IGameState<TState> = {
          ...state,
          isComplete: true,
          winnerId,
          phase: GamePhase.COMPLETED,
        };

        this.stateManager.setState(endState);
        this.eventBus.emit('gameEnded', { winnerId, reason, state: endState });
      }
    }

    // ==================== src\ai\BaseAI.ts ====================

    /**
     * Base AI implementation with common functionality
     */


    /**
     * Abstract base class for AI players
     */
    export abstract class BaseAI<TState extends Record<string, unknown> = Record<string, unknown>, TAction extends Record<string, unknown> = Record<string, unknown>>
      implements IAIPlayer<TState, TAction> {

      protected readonly playerId: string;
      protected difficulty: AILevel;
      protected thinkingTime: { min: number; max: number };
      protected randomSeed?: string;

      constructor(config: IAIConfig) {
        this.playerId = config.playerId;
        this.difficulty = config.difficulty;
        this.thinkingTime = config.thinkingTime || this.getDefaultThinkingTime(config.difficulty);
        this.randomSeed = config.randomSeed;
      }

      abstract chooseAction(
        state: IGameState<TState>,
        availableActions: IGameAction<TAction>[]
      ): Promise<IGameAction<TAction> | null>;

      abstract evaluateState(state: IGameState<TState>): number;

      getDifficulty(): AILevel {
        return this.difficulty;
      }

      setDifficulty(level: AILevel): void {
        this.difficulty = level;
        this.thinkingTime = this.getDefaultThinkingTime(level);
      }

      /**
       * Simulate thinking delay for better UX
       */
      protected async simulateThinking(): Promise<void> {
        const delay = this.thinkingTime.min +
          Math.random() * (this.thinkingTime.max - this.thinkingTime.min);

        return new Promise(resolve => setTimeout(resolve, delay));
      }

      /**
       * Add randomness based on difficulty
       */
      protected addNoise(value: number, maxNoise: number): number {
        const noiseFactor = this.getDifficultyNoiseFactor();
        const noise = (Math.random() - 0.5) * maxNoise * noiseFactor;
        return value + noise;
      }

      /**
       * Get default thinking times by difficulty
       */
      private getDefaultThinkingTime(level: AILevel): { min: number; max: number } {
        switch (level) {
          case AILevel.EASY:
            return { min: 200, max: 800 };
          case AILevel.MEDIUM:
            return { min: 300, max: 1200 };
          case AILevel.HARD:
            return { min: 500, max: 1500 };
          case AILevel.EXPERT:
            return { min: 800, max: 2000 };
        }
      }

      /**
       * Get noise factor based on difficulty (more noise = more mistakes)
       */
      private getDifficultyNoiseFactor(): number {
        switch (this.difficulty) {
          case AILevel.EASY:
            return 2.0;
          case AILevel.MEDIUM:
            return 1.0;
          case AILevel.HARD:
            return 0.5;
          case AILevel.EXPERT:
            return 0.2;
        }
      }

      /**
       * Check if this is the AI's turn
       */
      protected isMyTurn(state: IGameState<TState>): boolean {
        return state.turnInfo.currentPlayerId === this.playerId;
      }

      /**
       * Get opponent IDs
       */
      protected getOpponentIds(state: IGameState<TState>): string[] {
        return state.players
          .filter(p => p.id !== this.playerId)
          .map(p => p.id);
      }
    }

    // ==================== src\ai\RandomAI.ts ====================

    /**
     * Random AI - chooses actions randomly
     */


    /**
     * AI that chooses random actions
     */
    export class RandomAI<TState extends Record<string, unknown> = Record<string, unknown>, TAction extends Record<string, unknown> = Record<string, unknown>>
      extends BaseAI<TState, TAction> {

      constructor(config: IAIConfig) {
        super(config);
      }

      async chooseAction(
        _state: IGameState<TState>,
        availableActions: IGameAction<TAction>[]
      ): Promise<IGameAction<TAction> | null> {
        await this.simulateThinking();

        if (availableActions.length === 0) {
          return null;
        }

        // Choose random action
        const randomIndex = Math.floor(Math.random() * availableActions.length);
        return availableActions[randomIndex];
      }

      evaluateState(_state: IGameState<TState>): number {
        // Random AI doesn't evaluate, just returns random value
        return Math.random() * 100;
      }
    }

    // ==================== src\ai\GreedyAI.ts ====================

    /**
     * Greedy AI - chooses action with best immediate value
     */


    /**
     * AI that chooses the action with best immediate value
     */
    export abstract class GreedyAI<TState extends Record<string, unknown> = Record<string, unknown>, TAction extends Record<string, unknown> = Record<string, unknown>>
      extends BaseAI<TState, TAction> {

      constructor(config: IAIConfig) {
        super(config);
      }

      /**
       * Evaluate an action's immediate value
       * Must be implemented by specific game AI
       */
      abstract evaluateAction(
        action: IGameAction<TAction>,
        state: IGameState<TState>
      ): number;

      async chooseAction(
        state: IGameState<TState>,
        availableActions: IGameAction<TAction>[]
      ): Promise<IGameAction<TAction> | null> {
        await this.simulateThinking();

        if (availableActions.length === 0) {
          return null;
        }

        // Evaluate all actions
        const evaluatedActions = availableActions.map(action => ({
          action,
          value: this.evaluateAction(action, state),
        }));

        // Add some noise based on difficulty
        evaluatedActions.forEach(ea => {
          ea.value = this.addNoise(ea.value, 20);
        });

        // Sort by value (descending) and pick best
        evaluatedActions.sort((a, b) => b.value - a.value);
        return evaluatedActions[0].action;
      }
    }

    // ==================== src\ai\MinimaxAI.ts ====================

    /**
     * Minimax AI with alpha-beta pruning
     */


    /**
     * AI using minimax algorithm with alpha-beta pruning
     */
    export abstract class MinimaxAI<TState extends Record<string, unknown> = Record<string, unknown>, TAction extends Record<string, unknown> = Record<string, unknown>>
      extends BaseAI<TState, TAction> {

      protected maxDepth: number;

      constructor(config: IAIConfig) {
        super(config);
        this.maxDepth = config.maxDepth || this.getDepthByDifficulty(config.difficulty);
      }

      /**
       * Simulate an action and return resulting state
       * Must be implemented by specific game AI
       */
      abstract simulateAction(
        action: IGameAction<TAction>,
        state: IGameState<TState>
      ): IGameState<TState>;

      /**
       * Get available actions for a given state and player
       * Must be implemented by specific game AI
       */
      abstract getActionsForState(
        state: IGameState<TState>,
        playerId: string
      ): IGameAction<TAction>[];

      /**
       * Check if the game is over in given state
       * Must be implemented by specific game AI
       */
      abstract isTerminalState(state: IGameState<TState>): boolean;

      async chooseAction(
        state: IGameState<TState>,
        availableActions: IGameAction<TAction>[]
      ): Promise<IGameAction<TAction> | null> {
        await this.simulateThinking();

        if (availableActions.length === 0) {
          return null;
        }

        // Evaluate each action using minimax
        const evaluatedActions = availableActions.map(action => {
          const newState = this.simulateAction(action, state);
          const value = this.minimax(
            newState,
            this.maxDepth - 1,
            Number.NEGATIVE_INFINITY,
            Number.POSITIVE_INFINITY,
            false // Next turn is opponent's
          );

          return {
            action,
            value: this.addNoise(value, 10),
          };
        });

        // Sort by value and return best action
        evaluatedActions.sort((a, b) => b.value - a.value);
        return evaluatedActions[0].action;
      }

      /**
       * Minimax algorithm with alpha-beta pruning
       */
      private minimax(
        state: IGameState<TState>,
        depth: number,
        alpha: number,
        beta: number,
        maximizingPlayer: boolean
      ): number {
        // Terminal state or max depth reached
        if (depth === 0 || this.isTerminalState(state)) {
          return this.evaluateState(state);
        }

        const currentPlayerId = maximizingPlayer ? this.playerId : this.getOpponentIds(state)[0];
        const actions = this.getActionsForState(state, currentPlayerId);

        if (maximizingPlayer) {
          let maxEval = Number.NEGATIVE_INFINITY;

          for (const action of actions) {
            const newState = this.simulateAction(action, state);
            const evalValue = this.minimax(newState, depth - 1, alpha, beta, false);
            maxEval = Math.max(maxEval, evalValue);
            alpha = Math.max(alpha, evalValue);

            if (beta <= alpha) {
              break; // Beta cutoff
            }
          }

          return maxEval;
        } else {
          let minEval = Number.POSITIVE_INFINITY;

          for (const action of actions) {
            const newState = this.simulateAction(action, state);
            const evalValue = this.minimax(newState, depth - 1, alpha, beta, true);
            minEval = Math.min(minEval, evalValue);
            beta = Math.min(beta, evalValue);

            if (beta <= alpha) {
              break; // Alpha cutoff
            }
          }

          return minEval;
        }
      }

      /**
       * Get search depth based on difficulty
       */
      private getDepthByDifficulty(level: AILevel): number {
        switch (level) {
          case AILevel.EASY:
            return 1;
          case AILevel.MEDIUM:
            return 2;
          case AILevel.HARD:
            return 3;
          case AILevel.EXPERT:
            return 4;
        }
      }
    }

    // ==================== src\ai\MCTSAI.ts ====================

    /**
     * Monte Carlo Tree Search AI
     */


    /**
     * MCTS Node implementation
     */
    class MCTSNode<TState extends Record<string, unknown> = Record<string, unknown>, TAction extends Record<string, unknown> = Record<string, unknown>>
      implements IMCTSNode<TState, TAction> {

      state: IGameState<TState>;
      action: IGameAction<TAction> | null;
      parent: MCTSNode<TState, TAction> | null;
      children: MCTSNode<TState, TAction>[] = [];
      visits = 0;
      totalValue = 0;

      constructor(
        state: IGameState<TState>,
        action: IGameAction<TAction> | null = null,
        parent: MCTSNode<TState, TAction> | null = null
      ) {
        this.state = state;
        this.action = action;
        this.parent = parent;
      }

      isLeaf(): boolean {
        return this.children.length === 0;
      }

      addChild(child: MCTSNode<TState, TAction>): void {
        this.children.push(child);
      }

      getBestChild(explorationConstant: number): MCTSNode<TState, TAction> | null {
        if (this.children.length === 0) {
          return null;
        }

        let bestChild = this.children[0];
        let bestValue = this.getUCB1Value(bestChild, explorationConstant);

        for (const child of this.children) {
          const value = this.getUCB1Value(child, explorationConstant);
          if (value > bestValue) {
            bestValue = value;
            bestChild = child;
          }
        }

        return bestChild;
      }

      private getUCB1Value(child: MCTSNode<TState, TAction>, c: number): number {
        if (child.visits === 0) {
          return Number.POSITIVE_INFINITY;
        }

        const exploitation = child.totalValue / child.visits;
        const exploration = c * Math.sqrt(Math.log(this.visits) / child.visits);
        return exploitation + exploration;
      }
    }

    /**
     * AI using Monte Carlo Tree Search
     */
    export abstract class MCTSAI<TState extends Record<string, unknown> = Record<string, unknown>, TAction extends Record<string, unknown> = Record<string, unknown>>
      extends BaseAI<TState, TAction> {

      protected iterations: number;
      protected explorationConstant = 1.414;

      constructor(config: IAIConfig) {
        super(config);
        this.iterations = this.getIterationsByDifficulty(config.difficulty);
      }

      /**
       * Simulate a random playout from given state
       * Must be implemented by specific game AI
       */
      abstract simulatePlayout(state: IGameState<TState>): number;

      /**
       * Get available actions for a given state and player
       * Must be implemented by specific game AI
       */
      abstract getActionsForState(
        state: IGameState<TState>,
        playerId: string
      ): IGameAction<TAction>[];

      /**
       * Simulate an action and return resulting state
       * Must be implemented by specific game AI
       */
      abstract simulateAction(
        action: IGameAction<TAction>,
        state: IGameState<TState>
      ): IGameState<TState>;

      /**
       * Check if the game is over in given state
       * Must be implemented by specific game AI
       */
      abstract isTerminalState(state: IGameState<TState>): boolean;

      async chooseAction(
        state: IGameState<TState>,
        availableActions: IGameAction<TAction>[]
      ): Promise<IGameAction<TAction> | null> {
        await this.simulateThinking();

        if (availableActions.length === 0) {
          return null;
        }

        // Create root node
        const root = new MCTSNode<TState, TAction>(state);

        // Run MCTS iterations
        for (let i = 0; i < this.iterations; i++) {
          let node = root;

          // Selection - traverse tree to leaf
          while (!node.isLeaf() && !this.isTerminalState(node.state)) {
            const best = node.getBestChild(this.explorationConstant);
            if (!best) break;
            node = best;
          }

          // Expansion - add child if not terminal
          if (!this.isTerminalState(node.state)) {
            node = this.expand(node);
          }

          // Simulation - random playout
          const value = this.simulatePlayout(node.state);

          // Backpropagation - update values up the tree
          this.backpropagate(node, value);
        }

        // Choose action with most visits
        let bestChild = root.children[0];
        for (const child of root.children) {
          if (child.visits > bestChild.visits) {
            bestChild = child;
          }
        }

        return bestChild?.action || null;
      }

      /**
       * Expand node by adding all possible children
       */
      private expand(node: MCTSNode<TState, TAction>): MCTSNode<TState, TAction> {
        const currentPlayerId = node.state.turnInfo.currentPlayerId;
        const actions = this.getActionsForState(node.state, currentPlayerId);

        // Add all possible children
        for (const action of actions) {
          const newState = this.simulateAction(action, node.state);
          const child = new MCTSNode(newState, action, node);
          node.addChild(child);
        }

        // Return random child for simulation
        if (node.children.length > 0) {
          return node.children[Math.floor(Math.random() * node.children.length)];
        }

        return node;
      }

      /**
       * Backpropagate value up the tree
       */
      private backpropagate(node: MCTSNode<TState, TAction> | null, value: number): void {
        while (node !== null) {
          node.visits++;
          node.totalValue += value;
          node = node.parent;
        }
      }

      /**
       * Get iterations based on difficulty
       */
      private getIterationsByDifficulty(level: AILevel): number {
        switch (level) {
          case AILevel.EASY:
            return 100;
          case AILevel.MEDIUM:
            return 500;
          case AILevel.HARD:
            return 1000;
          case AILevel.EXPERT:
            return 2000;
        }
      }
    }

    // ==================== src\utils\Random.ts ====================

    /**
     * Random number generation utilities with seeding support
     */

    /**
     * Seeded random number generator using xorshift algorithm
     */
    export class SeededRandom {
      private seed: number;

      constructor(seed: string | number) {
        this.seed = typeof seed === 'string' ? this.hashString(seed) : seed;
      }

      /**
       * Generate a random number between 0 and 1
       */
      next(): number {
        this.seed = (this.seed * 9301 + 49297) % 233280;
        return this.seed / 233280;
      }

      /**
       * Generate a random integer between min and max (inclusive)
       */
      nextInt(min: number, max: number): number {
        return Math.floor(this.next() * (max - min + 1)) + min;
      }

      /**
       * Generate a random boolean
       */
      nextBoolean(probability = 0.5): boolean {
        return this.next() < probability;
      }

      /**
       * Shuffle an array
       */
      shuffle<T>(array: T[]): T[] {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
          const j = this.nextInt(0, i);
          [result[i], result[j]] = [result[j], result[i]];
        }
        return result;
      }

      /**
       * Pick a random element from an array
       */
      pick<T>(array: T[]): T | undefined {
        if (array.length === 0) return undefined;
        return array[this.nextInt(0, array.length - 1)];
      }

      /**
       * Pick multiple random elements without replacement
       */
      pickMultiple<T>(array: T[], count: number): T[] {
        const shuffled = this.shuffle(array);
        return shuffled.slice(0, Math.min(count, array.length));
      }

      /**
       * Generate a normally distributed random number (Box-Muller transform)
       */
      gaussian(mean = 0, stdDev = 1): number {
        let u1 = 0;
        let u2 = 0;

        while (u1 === 0) u1 = this.next(); // Converting [0,1) to (0,1)
        while (u2 === 0) u2 = this.next();

        const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
        return z0 * stdDev + mean;
      }

      private hashString(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          const char = str.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash);
      }
    }

    /**
     * Weighted random selector
     */
    export class WeightedRandom<T> {
      private items: Array<{ item: T; weight: number }>;
      private totalWeight: number;

      constructor(items: Array<{ item: T; weight: number }>) {
        this.items = items;
        this.totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
      }

      /**
       * Select a random item based on weights
       */
      select(random: () => number = Math.random): T | undefined {
        if (this.items.length === 0 || this.totalWeight === 0) {
          return undefined;
        }

        let randomValue = random() * this.totalWeight;

        for (const { item, weight } of this.items) {
          randomValue -= weight;
          if (randomValue <= 0) {
            return item;
          }
        }

        return this.items[this.items.length - 1].item;
      }

      /**
       * Update weight for an item
       */
      updateWeight(item: T, newWeight: number): void {
        const entry = this.items.find(e => e.item === item);
        if (entry) {
          this.totalWeight = this.totalWeight - entry.weight + newWeight;
          entry.weight = newWeight;
        }
      }

      /**
       * Add a new item with weight
       */
      add(item: T, weight: number): void {
        this.items.push({ item, weight });
        this.totalWeight += weight;
      }

      /**
       * Remove an item
       */
      remove(item: T): boolean {
        const index = this.items.findIndex(e => e.item === item);
        if (index !== -1) {
          this.totalWeight -= this.items[index].weight;
          this.items.splice(index, 1);
          return true;
        }
        return false;
      }
    }

    // ==================== src\index.ts ====================

    /**
     * TURBO - TURn-Based Operations
     * A modern, type-safe TypeScript library for turn-based game logic
     *
     * @version 2.0.0
     */

    // Core exports

    // Interfaces

    // Export enums as values (not just types)



    // AI exports


    // Export AILevel enum as value

    // Utility exports

    // Version
    export const VERSION = '2.0.0';

    /**
     * Quick start example:
     *
     * ```typescript
     * import { GameController, RandomAI, AILevel } from '@bloombeasts/turbo';
     *
     * // Define your game rules
     * const rules = new MyGameRules();
     *
     * // Create game controller
     * const game = new GameController(rules);
     *
     * // Initialize with players
     * game.initialize({
     *   players: [
     *     { id: 'player1', name: 'Alice', type: PlayerType.HUMAN },
     *     { id: 'player2', name: 'Bob', type: PlayerType.AI }
     *   ]
     * });
     *
     * // Register AI
     * const ai = new RandomAI({
     *   playerId: 'player2',
     *   difficulty: AILevel.MEDIUM
     * });
     *
     * // Play the game
     * const action = { type: 'move', playerId: 'player1', data: {...} };
     * const result = game.executeAction(action);
     * ```
     */

  }

  // Export the namespace as a module
  { Turbo };

  // Make Turbo available globally
  if (typeof globalThis !== 'undefined') {
    (globalThis as any).Turbo = Turbo;
  }

  // ==================== bloombeasts\engine\utils\random.ts ====================

  /**
   * Random Utilities
   *
   * Centralized random number generation and selection utilities.
   * Makes randomization consistent and easier to test.
   */

  /**
   * Pick a random element from an array
   * @param array The array to pick from
   * @returns Random element from array, or undefined if empty
   */
  export function pickRandom<T>(array: T[]): T | undefined {
    if (array.length === 0) {
      return undefined;
    }
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Pick multiple random elements from an array (without replacement)
   * @param array The array to pick from
   * @param count Number of elements to pick
   * @returns Array of random elements
   */
  export function pickRandomMultiple<T>(array: T[], count: number): T[] {
    if (count <= 0 || array.length === 0) {
      return [];
    }

    const result: T[] = [];
    const available = [...array];

    const actualCount = Math.min(count, available.length);

    for (let i = 0; i < actualCount; i++) {
      const index = Math.floor(Math.random() * available.length);
      result.push(available[index]);
      available.splice(index, 1);
    }

    return result;
  }

  /**
   * Shuffle an array in place using Fisher-Yates algorithm
   * @param array The array to shuffle
   * @returns The same array, shuffled
   */
  export function shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * Get a random integer between min (inclusive) and max (inclusive)
   * @param min Minimum value
   * @param max Maximum value
   * @returns Random integer
   */
  export function randomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Get a random number between min (inclusive) and max (exclusive)
   * @param min Minimum value
   * @param max Maximum value
   * @returns Random number
   */
  export function randomFloat(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  /**
   * Roll a percentage chance (0-100)
   * @param chance Percentage chance (0-100)
   * @returns True if roll succeeded
   */
  export function rollChance(chance: number): boolean {
    return Math.random() * 100 < chance;
  }

  /**
   * Roll a probability (0-1)
   * @param probability Probability (0-1)
   * @returns True if roll succeeded
   */
  export function rollProbability(probability: number): boolean {
    return Math.random() < probability;
  }

  /**
   * Pick a weighted random element from an array
   * @param items Array of items
   * @param weights Array of weights (same length as items)
   * @returns Random element based on weights, or undefined if empty
   */
  export function pickWeightedRandom<T>(items: T[], weights: number[]): T | undefined {
    if (items.length === 0 || items.length !== weights.length) {
      return undefined;
    }

    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < items.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return items[i];
      }
    }

    return items[items.length - 1];
  }

  /**
   * Generate a random ID string
   * @param prefix Optional prefix for the ID
   * @param length Length of random part (default: 8)
   * @returns Random ID string
   */
  export function generateId(prefix: string = '', length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let id = prefix;
    for (let i = 0; i < length; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
  }

  /**
   * Coin flip - returns true or false with 50/50 chance
   * @returns Random boolean
   */
  export function coinFlip(): boolean {
    return Math.random() < 0.5;
  }

  /**
   * Roll a dice with specified number of sides
   * @param sides Number of sides on the dice
   * @returns Random number from 1 to sides (inclusive)
   */
  export function rollDice(sides: number): number {
    return randomInt(1, sides);
  }

  // ==================== bloombeasts\battle\actions\ActionHandler.ts ====================

  /**
   * Action Handler Interface
   *
   * Defines the contract for handling specific game actions.
   * Each action type gets its own handler class, breaking down the monolithic
   * executeAction() method into manageable, testable pieces.
   *
   * Benefits:
   * - Single Responsibility: Each handler does one thing
   * - Testability: Easy to unit test individual actions
   * - Maintainability: Changes to one action don't affect others
   * - Extensibility: Easy to add new action types
   */



  /**
   * Generic action data shape
   */
  export interface ActionData {
    type: string;
    [key: string]: unknown;
  }

  /**
   * Trigger context - data passed when processing triggers
   */
  export interface TriggerContext {
    action?: string;
    card?: AnyCard;
    [key: string]: unknown;
  }

  /**
   * Action handler context - additional dependencies passed to handlers
   */
  export interface ActionHandlerContext {
    /**
     * Process triggers at a specific timing
     */
    processTriggers?: (timing: string, state: Turbo.IGameState<BloomBeastsState>, context?: TriggerContext) => void;

    /**
     * Process magic card effects
     */
    processMagicCard?: (card: MagicCard, state: Turbo.IGameState<BloomBeastsState>) => void;
  }

  /**
   * Action handler interface
   * Implementations process a specific type of game action
   */
  export interface IActionHandler<TActionData extends ActionData = ActionData> {
    /**
     * The action type this handler processes
     */
    readonly actionType: string;

    /**
     * Validate that the action can be performed
     * @returns { valid: true } if valid, or { valid: false, reason: string } if invalid
     */
    validate(
      actionData: TActionData,
      state: Turbo.IGameState<BloomBeastsState>,
      playerId: string
    ): ActionValidationResult;

    /**
     * Execute the action and return the full result including new state, events, and side effects
     * Note: Must not mutate the input state
     */
    execute(
      actionData: TActionData,
      state: Turbo.IGameState<BloomBeastsState>,
      playerId: string,
      context?: ActionHandlerContext
    ): Turbo.IActionResult<BloomBeastsState>;
  }

  /**
   * Result of action validation
   */
  export interface ActionValidationResult {
    valid: boolean;
    reason?: string;
  }

  /**
   * Action handler registry
   * Maps action types to their handlers
   */
  export class ActionHandlerRegistry {
    private handlers: Map<string, IActionHandler>;

    constructor() {
      this.handlers = new Map();
    }

    /**
     * Register an action handler
     */
    register(handler: IActionHandler): void {
      if (this.handlers.has(handler.actionType)) {
        console.warn(`[ActionHandlerRegistry] Overwriting handler for action type: ${handler.actionType}`);
      }
      this.handlers.set(handler.actionType, handler);
    }

    /**
     * Register multiple handlers at once
     */
    registerAll(handlers: IActionHandler[]): void {
      handlers.forEach(handler => this.register(handler));
    }

    /**
     * Get handler for an action type
     */
    get(actionType: string): IActionHandler | undefined {
      return this.handlers.get(actionType);
    }

    /**
     * Check if a handler is registered for an action type
     */
    has(actionType: string): boolean {
      return this.handlers.has(actionType);
    }

    /**
     * Get all registered action types
     */
    getRegisteredTypes(): string[] {
      return Array.from(this.handlers.keys());
    }
  }

  /**
   * Base action handler with common utilities
   * Extend this for specific action handlers
   */
  export abstract class BaseActionHandler<TActionData extends ActionData = ActionData>
    implements IActionHandler<TActionData> {

    abstract readonly actionType: string;

    /**
     * Validate the action
     * Override to add specific validation logic
     */
    abstract validate(
      actionData: TActionData,
      state: Turbo.IGameState<BloomBeastsState>,
      playerId: string
    ): ActionValidationResult;

    /**
     * Execute the action and return full result
     * Override to implement action-specific logic
     */
    abstract execute(
      actionData: TActionData,
      state: Turbo.IGameState<BloomBeastsState>,
      playerId: string,
      context?: ActionHandlerContext
    ): Turbo.IActionResult<BloomBeastsState>;

    /**
     * Helper: Get current player from state
     */
    protected getCurrentPlayer(state: Turbo.IGameState<BloomBeastsState>, playerId: string) {
      const player = state.gameData.players.find(p => p.id === playerId);
      if (!player) {
        throw new Error(`Player ${playerId} not found in state`);
      }
      return player;
    }

    /**
     * Helper: Get opponent player from state
     */
    protected getOpponentPlayer(state: Turbo.IGameState<BloomBeastsState>, playerId: string) {
      const opponent = state.gameData.players.find(p => p.id !== playerId);
      if (!opponent) {
        throw new Error(`Opponent not found for player ${playerId}`);
      }
      return opponent;
    }

    /**
     * Helper: Get current player index
     */
    protected getCurrentPlayerIndex(state: Turbo.IGameState<BloomBeastsState>, playerId: string): number {
      return state.gameData.players.findIndex(p => p.id === playerId);
    }

    /**
     * Helper: Clone state (deep copy)
     * Uses structuredClone for proper handling of Sets, Maps, Dates, etc.
     */
    protected cloneState(state: Turbo.IGameState<BloomBeastsState>): Turbo.IGameState<BloomBeastsState> {
      return structuredClone(state) as Turbo.IGameState<BloomBeastsState>;
    }

    /**
     * Helper: Create event for action result
     */
    protected createEvent(type: string, playerId: string, data?: Record<string, unknown>) {
      return {
        type,
        description: `${type} for player ${playerId}`,
        data: {
          type,
          playerId,
          data: data || {},
          timestamp: Date.now(),
        }
      };
    }
  }

  // ==================== bloombeasts\battle\actions\DrawCardActionHandler.ts ====================

  /**
   * Draw Card Action Handler
   *
   * Handles the DRAW_CARD action, allowing a player to draw a card from their deck
   */



  export interface DrawCardActionData extends BloomBeastsActionData {
    type: BloomBeastsActionType.DRAW_CARD;
  }

  export class DrawCardActionHandler extends BaseActionHandler<DrawCardActionData> {
    readonly actionType = BloomBeastsActionType.DRAW_CARD;

    validate(
      actionData: DrawCardActionData,
      state: Turbo.IGameState<BloomBeastsState>,
      playerId: string
    ): ActionValidationResult {
      const playerIndex = state.gameData.players.findIndex(p => p.id === playerId);
      const player = state.gameData.players[playerIndex];

      // Check if already drawn this turn
      if (state.gameData.currentTurnActions.hasDrawnCard) {
        return { valid: false, reason: 'Already drew a card this turn' };
      }

      // Check if deck has cards
      if (player.deck.length === 0) {
        return { valid: false, reason: 'No cards left in deck' };
      }

      // Check if hand is full
      if (player.hand.length >= player.maxHandSize) {
        return { valid: false, reason: 'Hand is full' };
      }

      return { valid: true };
    }

    execute(
      actionData: DrawCardActionData,
      state: Turbo.IGameState<BloomBeastsState>,
      playerId: string,
      context?: ActionHandlerContext
    ): Turbo.IActionResult<BloomBeastsState> {
      const newState = this.cloneState(state);
      const playerIndex = newState.gameData.players.findIndex(p => p.id === playerId);
      const player = newState.gameData.players[playerIndex];

      // Draw the card
      if (player.deck.length > 0) {
        const card = player.deck.shift()!;
        player.hand.push(card);
      }

      // Update turn tracking
      newState.gameData.currentTurnActions.hasDrawnCard = true;

      // Create event
      const event = this.createEvent('card_drawn', playerId);

      return {
        success: true,
        newState,
        sideEffects: [event],
      };
    }
  }

  // ==================== bloombeasts\battle\actions\PlayCardActionHandler.ts ====================

  /**
   * Play Card Action Handler
   *
   * Handles the PLAY_CARD action, allowing a player to play a card from their hand
   */



  export interface PlayCardActionData extends BloomBeastsActionData {
    type: BloomBeastsActionType.PLAY_CARD;
    cardId: string;
    position?: number;
  }

  export class PlayCardActionHandler extends BaseActionHandler<PlayCardActionData> {
    readonly actionType = BloomBeastsActionType.PLAY_CARD;

    validate(
      actionData: PlayCardActionData,
      state: Turbo.IGameState<BloomBeastsState>,
      playerId: string
    ): ActionValidationResult {
      const playerIndex = state.gameData.players.findIndex(p => p.id === playerId);
      const player = state.gameData.players[playerIndex];

      // Find the card in hand
      const card = player.hand.find(c => c.id === actionData.cardId);
      if (!card) {
        return { valid: false, reason: 'Card not in hand' };
      }

      // Check energy cost
      if (player.energy < card.cost) {
        return { valid: false, reason: 'Not enough energy' };
      }

      // Validate card placement based on type
      const field = playerIndex === 0 ? state.gameData.field.player1 : state.gameData.field.player2;

      switch (card.type) {
        case 'Beast':
          if (actionData.position === undefined) {
            return { valid: false, reason: 'Position required for Beast cards' };
          }
          if (actionData.position >= field.beasts.length) {
            return { valid: false, reason: 'Invalid position' };
          }
          if (field.beasts[actionData.position] !== null) {
            return { valid: false, reason: 'Position occupied' };
          }
          break;

        case 'Buff':
          if (actionData.position === undefined) {
            return { valid: false, reason: 'Position required for Buff cards' };
          }
          if (actionData.position >= field.buffs.length) {
            return { valid: false, reason: 'Invalid position' };
          }
          if (field.buffs[actionData.position] !== null) {
            return { valid: false, reason: 'Position occupied' };
          }
          break;

        case 'Trap':
          // Check max traps (matches DEFAULT_CONFIG.maxFieldTraps = 3)
          const maxTraps = 3;
          if (field.traps.length >= maxTraps) {
            return { valid: false, reason: 'Too many traps' };
          }
          break;

        case 'Habitat':
        case 'Magic':
          // These can always be played if you have energy
          break;

        default:
          return { valid: false, reason: 'Unknown card type' };
      }

      return { valid: true };
    }

    execute(
      actionData: PlayCardActionData,
      state: Turbo.IGameState<BloomBeastsState>,
      playerId: string,
      context?: ActionHandlerContext
    ): Turbo.IActionResult<BloomBeastsState> {
      const newState = this.cloneState(state);
      const playerIndex = newState.gameData.players.findIndex(p => p.id === playerId);
      const player = newState.gameData.players[playerIndex];

      // Find and remove card from hand
      const cardIndex = player.hand.findIndex(c => c.id === actionData.cardId);
      if (cardIndex === -1) {
        throw new Error('Card not found in hand');
      }
      const card = player.hand.splice(cardIndex, 1)[0];

      // Deduct energy cost
      player.energy -= card.cost;

      // Place card on field based on type
      const field = playerIndex === 0 ? newState.gameData.field.player1 : newState.gameData.field.player2;

      switch (card.type) {
        case 'Beast':
          // Card from hand should already be a RuntimeBeast with instanceId, level, and scaled stats
          const runtimeBeast = card as RuntimeBeast;

          // Create field beast preserving all RuntimeBeast properties
          const fieldCard: RuntimeBeast = {
            ...runtimeBeast,
            // Set initial field state
            summoningSickness: true,
            usedAbilityThisTurn: false
          };

          if (actionData.position !== undefined) {
            field.beasts[actionData.position] = fieldCard;
          }
          break;

        case 'Magic':
          // Magic cards go to graveyard immediately
          player.graveyard.push(card);

          // Process Magic card effects
          if (context?.processMagicCard) {
            context.processMagicCard(card as MagicCard, newState);
          }
          break;

        case 'Trap':
          field.traps.push(card as RuntimeTrap);
          break;

        case 'Buff':
          if (actionData.position !== undefined) {
            field.buffs[actionData.position] = card as RuntimeBuff;
          }
          break;

        case 'Habitat':
          field.habitat = card as RuntimeHabitat;
          break;
      }

      // Update turn tracking
      newState.gameData.currentTurnActions.cardsPlayed++;

      // Process OnSummon triggers for Beast cards
      if (card.type === CardType.Beast && context?.processTriggers) {
        context.processTriggers('on_action', newState, { action: 'summon', card });
      }

      // Process WhileOnField effects for cards that have them
      if ((card.type === CardType.Beast || card.type === 'Habitat') && card.abilities && context?.processTriggers) {
        // Check if this card has WhileOnField abilities
        const hasWhileOnField = card.abilities.some(ability =>
          'trigger' in ability && ability.trigger === 'WhileOnField'
        );
        if (hasWhileOnField) {
          // Apply WhileOnField effects immediately when card enters field
          context.processTriggers('on_action', newState, { action: 'enter_field', card });
        }
      }

      // Create event
      const event = this.createEvent('card_played', playerId, {
        cardId: card.id,
        cardType: card.type
      });

      return {
        success: true,
        newState,
        sideEffects: [event],
      };
    }
  }

  // ==================== bloombeasts\battle\actions\AttackActionHandler.ts ====================

  /**
   * Attack Action Handler
   *
   * Handles the ATTACK action, allowing a beast to attack a target (player or another beast)
   */



  export interface AttackActionData extends BloomBeastsActionData {
    type: BloomBeastsActionType.ATTACK;
    cardId: string;
    targetId?: string;
  }

  export class AttackActionHandler extends BaseActionHandler<AttackActionData> {
    readonly actionType = BloomBeastsActionType.ATTACK;

    validate(
      actionData: AttackActionData,
      state: Turbo.IGameState<BloomBeastsState>,
      playerId: string
    ): ActionValidationResult {
      // Find the attacking beast
      const attacker = this.findBeastOnField(actionData.cardId, state);
      if (!attacker) {
        return { valid: false, reason: 'Attacker not found' };
      }

      // Check summoning sickness
      if (attacker.summoningSickness) {
        return { valid: false, reason: 'Beast has summoning sickness' };
      }

      // Check if already attacked this turn
      if (state.gameData.currentTurnActions.hasAttacked.has(actionData.cardId)) {
        return { valid: false, reason: 'Beast already attacked this turn' };
      }

      // Check attack value
      if (attacker.currentAttack <= 0) {
        return { valid: false, reason: 'Beast has no attack power' };
      }

      // If there's a target, validate it exists
      if (actionData.targetId) {
        const playerIndex = state.gameData.players.findIndex(p => p.id === playerId);
        const opponentIndex = 1 - playerIndex;
        const opponent = state.gameData.players[opponentIndex];

        // Check if targeting opponent player
        if (actionData.targetId === opponent.id) {
          return { valid: true };
        }

        // Check if targeting a beast
        const target = this.findBeastOnField(actionData.targetId, state);
        if (!target) {
          return { valid: false, reason: 'Target not found' };
        }
      }

      return { valid: true };
    }

    execute(
      actionData: AttackActionData,
      state: Turbo.IGameState<BloomBeastsState>,
      playerId: string,
      context?: ActionHandlerContext
    ): Turbo.IActionResult<BloomBeastsState> {
      const newState = this.cloneState(state);

      const attacker = this.findBeastOnField(actionData.cardId, newState);
      if (!attacker) {
        throw new Error('Attacker not found');
      }

      const playerIndex = newState.gameData.players.findIndex(p => p.id === playerId);
      const opponentIndex = 1 - playerIndex;
      const opponent = newState.gameData.players[opponentIndex];

      if (!actionData.targetId || actionData.targetId === opponent.id) {
        // Direct attack on player
        opponent.health -= attacker.currentAttack;
      } else {
        // Attack on beast
        const target = this.findBeastOnField(actionData.targetId, newState);
        if (!target) {
          throw new Error('Target not found');
        }

        // Both creatures deal damage to each other
        target.currentHealth -= attacker.currentAttack;
        attacker.currentHealth -= target.currentAttack;

        // Check for defeats
        if (target.currentHealth <= 0) {
          this.destroyBeast(target, newState);
        }
        if (attacker.currentHealth <= 0) {
          this.destroyBeast(attacker, newState);
        }
      }

      // Update turn tracking
      newState.gameData.currentTurnActions.hasAttacked.add(actionData.cardId);

      // Process OnAttack triggers
      if (context?.processTriggers) {
        context.processTriggers('on_action', newState, { action: 'attack' });
      }

      // Create event
      const event = this.createEvent('attack', playerId);

      return {
        success: true,
        newState,
        sideEffects: [event],
      };
    }

    /**
     * Find a beast on the field by ID
     */
    private findBeastOnField(
      beastId: string,
      state: Turbo.IGameState<BloomBeastsState>
    ): RuntimeBeast | null {
      for (const field of [state.gameData.field.player1, state.gameData.field.player2]) {
        for (const beast of field.beasts) {
          if (beast?.id === beastId) {
            return beast;
          }
        }
      }
      return null;
    }

    /**
     * Remove a defeated beast from the field and add to graveyard
     */
    private destroyBeast(beast: RuntimeBeast, state: Turbo.IGameState<BloomBeastsState>): void {
      // Remove from field
      for (let playerIdx = 0; playerIdx < 2; playerIdx++) {
        const field = playerIdx === 0 ? state.gameData.field.player1 : state.gameData.field.player2;
        const index = field.beasts.findIndex(b => b?.id === beast.id);
        if (index !== -1) {
          field.beasts[index] = null;

          // Add to graveyard
          const owner = state.gameData.players[playerIdx];
          owner.graveyard.push(beast);
          break;
        }
      }
    }
  }

  // ==================== bloombeasts\battle\actions\EndTurnActionHandler.ts ====================

  /**
   * End Turn Action Handler
   *
   * Handles the END_TURN action, switching to the next player and resetting turn state
   */



  export interface EndTurnActionData extends BloomBeastsActionData {
    type: BloomBeastsActionType.END_TURN;
  }

  export class EndTurnActionHandler extends BaseActionHandler<EndTurnActionData> {
    readonly actionType = BloomBeastsActionType.END_TURN;

    validate(
      actionData: EndTurnActionData,
      state: Turbo.IGameState<BloomBeastsState>,
      playerId: string
    ): ActionValidationResult {
      // Can always end turn
      return { valid: true };
    }

    execute(
      actionData: EndTurnActionData,
      state: Turbo.IGameState<BloomBeastsState>,
      playerId: string,
      context?: ActionHandlerContext
    ): Turbo.IActionResult<BloomBeastsState> {
      const newState = this.cloneState(state);

      const currentPlayerIndex = newState.gameData.players.findIndex(p => p.id === playerId);
      const players = newState.gameData.players;

      // Process end of turn effects
      if (context?.processTriggers) {
        context.processTriggers('end_of_turn', newState);
      }

      // Clear temporary effects
      this.clearTemporaryEffects(newState);

      // Switch to next player
      const nextPlayerIndex = (currentPlayerIndex + 1) % players.length;
      const nextPlayerId = players[nextPlayerIndex].id;

      // Update turn info
      newState.turnInfo = {
        ...newState.turnInfo,
        currentPlayerId: nextPlayerId,
        turnNumber: nextPlayerIndex === 0 ? newState.turnInfo.turnNumber + 1 : newState.turnInfo.turnNumber,
        movesThisTurn: 0,
        timeStarted: Date.now(),
      };

      // Start new turn for next player
      this.startNewTurn(newState, nextPlayerIndex);

      // Process start of turn effects for next player
      if (context?.processTriggers) {
        context.processTriggers('start_of_turn', newState);
      }

      // Create event
      const event = this.createEvent('turn_ended', playerId);

      return {
        success: true,
        newState,
        sideEffects: [event],
      };
    }

    /**
     * Clear temporary effects at end of turn
     */
    private clearTemporaryEffects(state: Turbo.IGameState<BloomBeastsState>): void {
      // Remove summoning sickness and reset ability usage
      for (const field of [state.gameData.field.player1, state.gameData.field.player2]) {
        field.beasts.forEach(beast => {
          if (beast) {
            beast.summoningSickness = false;
          }
        });
      }
    }

    /**
     * Initialize the new turn for a player
     */
    private startNewTurn(state: Turbo.IGameState<BloomBeastsState>, playerIndex: number): void {
      const player = state.gameData.players[playerIndex];
      const field = playerIndex === 0 ? state.gameData.field.player1 : state.gameData.field.player2;

      // Reset turn actions
      state.gameData.currentTurnActions = {
        hasDrawnCard: false,
        cardsPlayed: 0,
        hasAttacked: new Set<string>(),
      };

      // Increment energy (up to max turn energy)
      const turnNumber = state.turnInfo.turnNumber;
      player.energy = Math.min(turnNumber, 10); // Max 10 energy

      // Auto-draw a card at the start of turn (if deck has cards and hand isn't full)
      if (player.deck.length > 0 && player.hand.length < player.maxHandSize) {
        const card = player.deck.shift()!;
        player.hand.push(card);
        state.gameData.currentTurnActions.hasDrawnCard = true;
      }

      // Reset ability usage for beasts
      for (const beast of field.beasts) {
        if (beast) {
          beast.usedAbilityThisTurn = false;
        }
      }
    }
  }

  // ==================== bloombeasts\battle\actions\TimeoutActionHandler.ts ====================

  /**
   * Timeout Action Handler
   *
   * Handles the TIMEOUT action, marking a player as having timed out
   * This triggers the win condition checker to end the game with the opponent as winner
   */



  export interface TimeoutActionData extends BloomBeastsActionData {
    type: BloomBeastsActionType.TIMEOUT;
    timedOutPlayerId?: string; // Which player actually timed out (may differ from who executes the action)
  }

  export class TimeoutActionHandler extends BaseActionHandler<TimeoutActionData> {
    readonly actionType = BloomBeastsActionType.TIMEOUT;

    validate(
      actionData: TimeoutActionData,
      state: Turbo.IGameState<BloomBeastsState>,
      playerId: string
    ): ActionValidationResult {
      // Can always timeout (though it should only happen when timer reaches 0)
      return { valid: true };
    }

    execute(
      actionData: TimeoutActionData,
      state: Turbo.IGameState<BloomBeastsState>,
      playerId: string,
      context?: ActionHandlerContext
    ): Turbo.IActionResult<BloomBeastsState> {
      const newState = this.cloneState(state);

      // Use timedOutPlayerId if provided, otherwise use the playerId executing the action
      const actualTimedOutPlayer = actionData.timedOutPlayerId || playerId;

      // Mark the sudden end due to timeout
      newState.gameData.suddenEnd = {
        playerId: actualTimedOutPlayer,
        reason: SuddenEndReason.TIMEOUT
      };

      // Create event
      const event = this.createEvent('timeout', actualTimedOutPlayer, {
        reason: 'Timer expired'
      });

      return {
        success: true,
        newState,
        sideEffects: [event],
      };
    }
  }

  // ==================== bloombeasts\battle\actions\ForfeitActionHandler.ts ====================

  /**
   * Forfeit Action Handler
   *
   * Handles the FORFEIT action, marking a player as having forfeited
   * This triggers the win condition checker to end the game with the opponent as winner
   */



  export interface ForfeitActionData extends BloomBeastsActionData {
    type: BloomBeastsActionType.FORFEIT;
  }

  export class ForfeitActionHandler extends BaseActionHandler<ForfeitActionData> {
    readonly actionType = BloomBeastsActionType.FORFEIT;

    validate(
      actionData: ForfeitActionData,
      state: Turbo.IGameState<BloomBeastsState>,
      playerId: string
    ): ActionValidationResult {
      // Can always forfeit
      return { valid: true };
    }

    execute(
      actionData: ForfeitActionData,
      state: Turbo.IGameState<BloomBeastsState>,
      playerId: string,
      context?: ActionHandlerContext
    ): Turbo.IActionResult<BloomBeastsState> {
      const newState = this.cloneState(state);

      // Mark the sudden end due to forfeit
      newState.gameData.suddenEnd = {
        playerId,
        reason: SuddenEndReason.FORFEIT
      };

      // Create event
      const event = this.createEvent('forfeit', playerId, {
        reason: 'Player forfeited'
      });

      return {
        success: true,
        newState,
        sideEffects: [event],
      };
    }
  }

  // ==================== bloombeasts\battle\actions\index.ts ====================

  /**
   * Action Handlers - Exports all game action handlers
   */

  // ==================== bloombeasts\battle\core\WinConditionChecker.ts ====================

  /**
   * WinConditionChecker - Determines battle end conditions and winners
   *
   * Responsibilities:
   * - Check if battle has ended
   * - Determine winner
   * - Calculate battle results
   */



  export class WinConditionChecker {
    /**
     * Check if the battle has ended and return result
     */
    checkBattleEnd(state: Turbo.IGameState<BloomBeastsState>): BattleResult | null {
      if (!state.isComplete) {
        return null;
      }

      const players = state.gameData.players;
      const winner = this.determineWinner(state);

      return {
        winner,
        turns: state.turnInfo.turnNumber,
        player1Health: players[0].health,
        player2Health: players[1].health,
      };
    }

    /**
     * Determine the winner from the game state
     */
    private determineWinner(state: Turbo.IGameState<BloomBeastsState>): 'player1' | 'player2' | null {
      const players = state.gameData.players;

      // Check sudden end (timeout/forfeit/disconnect) first (highest priority)
      if (state.gameData.suddenEnd) {
        const loserPlayerId = state.gameData.suddenEnd.playerId;
        // Find which player caused the sudden end
        if (players[0].id === loserPlayerId) {
          return 'player2'; // Player 1 ended suddenly, player 2 wins
        } else {
          return 'player1'; // Player 2 ended suddenly, player 1 wins
        }
      }

      // Check health-based win
      if (players[0].health <= 0 && players[1].health > 0) {
        return 'player2';
      }
      if (players[1].health <= 0 && players[0].health > 0) {
        return 'player1';
      }

      // Check deck-out win
      const p1HasCards = players[0].deck.length > 0 || players[0].hand.length > 0;
      const p2HasCards = players[1].deck.length > 0 || players[1].hand.length > 0;

      if (!p1HasCards && p2HasCards) {
        return 'player2';
      }
      if (!p2HasCards && p1HasCards) {
        return 'player1';
      }

      // Tie or draw
      return null;
    }

    /**
     * Check if the game should end based on current state
     */
    shouldGameEnd(state: Turbo.IGameState<BloomBeastsState>): boolean {
      // Check sudden end (timeout/forfeit/disconnect) first (highest priority)
      if (state.gameData.suddenEnd) {
        return true;
      }

      const players = state.gameData.players;

      // Check if any player is defeated
      const aliveCount = players.filter(p => p.health > 0).length;
      if (aliveCount < 2) {
        return true;
      }

      // Check if any player is decked out
      const playersWithCards = players.filter(p => p.deck.length > 0 || p.hand.length > 0).length;
      if (playersWithCards < 2) {
        return true;
      }

      return false;
    }

    /**
     * Get winner ID from state (returns player ID, not 'player1'/'player2')
     */
    getWinnerId(state: Turbo.IGameState<BloomBeastsState>): string | null {
      const winner = this.determineWinner(state);
      if (!winner) return null;

      return winner === 'player1' ? state.gameData.players[0].id : state.gameData.players[1].id;
    }
  }

  // ==================== bloombeasts\battle\BloomBeastsGame.ts ====================

  /**
   * BloomBeasts game implementation using the TURBO library
   */


  // Import existing BloomBeasts types
  // Import types from ./types to avoid circular dependencies with action handlers

  /**
   * Trigger timing enum for effect processing
   */
  enum TriggerTiming {
    START_OF_TURN = 'start_of_turn',
    END_OF_TURN = 'end_of_turn',
    ON_ACTION = 'on_action',
    ON_EVENT = 'on_event',
  }

  /**
   * Effect system for processing game effects and triggers
   */
  class EffectSystem<TState extends Record<string, unknown>> {
    processEffects(
      timing: TriggerTiming,
      state: Turbo.IGameState<TState>,
      context?: TriggerContext
    ): { success: boolean; newState?: Turbo.IGameState<TState> } {
      // Clone state to avoid mutating the original - use structuredClone to preserve Sets, Maps, etc.
      const newState = structuredClone(state) as Turbo.IGameState<TState>;
      const bloomState = newState.gameData as unknown as BloomBeastsState;

      // Handle OnSummon triggers
      if (timing === TriggerTiming.ON_ACTION && context?.action === 'summon' && context.card) {
        const card = context.card;

        // Check if this card has abilities
        if (card.abilities && card.abilities.length > 0) {
          for (const ability of card.abilities) {
            // Type guard: check if this is a StructuredAbility with trigger and effects
            if ('trigger' in ability && ability.trigger === 'OnSummon' && 'effects' in ability && ability.effects) {
              // Process each effect
              for (const effect of ability.effects) {
                this.processEffect(effect, bloomState, newState.turnInfo!.currentPlayerId);
              }
            }
          }
        }
      }

      // Handle WhileOnField effects when card enters field
      if (timing === TriggerTiming.ON_ACTION && context?.action === 'enter_field' && context.card) {
        const card = context.card;

        // Check if this card has abilities
        if (card.abilities && card.abilities.length > 0) {
          for (const ability of card.abilities) {
            // Type guard: check if this is a StructuredAbility with trigger and effects
            if ('trigger' in ability && ability.trigger === 'WhileOnField' && 'effects' in ability && ability.effects) {
              // Process each effect
              for (const effect of ability.effects) {
                this.processEffect(effect, bloomState, newState.turnInfo!.currentPlayerId);
              }
            }
          }
        }
      }

      // Handle start of turn triggers
      if (timing === TriggerTiming.START_OF_TURN) {
        // Process OnOwnStartOfTurn triggers
        this.processStartOfTurnTriggers(bloomState, newState.turnInfo!.currentPlayerId);
      }

      // Handle end of turn triggers
      if (timing === TriggerTiming.END_OF_TURN) {
        this.processEndOfTurnTriggers(bloomState, newState.turnInfo!.currentPlayerId);
      }

      return { success: true, newState };
    }

    private processEffect(effect: any, state: BloomBeastsState, currentPlayerId: string): void {
      const currentPlayerIndex = state.players.findIndex(p => p.id === currentPlayerId);
      const currentPlayer = state.players[currentPlayerIndex];

      switch (effect.type) {
        case 'draw-cards':
          // Draw cards from deck
          const cardsToDraw = effect.value || 1;
          for (let i = 0; i < cardsToDraw; i++) {
            if (currentPlayer.deck.length > 0 && currentPlayer.hand.length < currentPlayer.maxHandSize) {
              const drawnCard = currentPlayer.deck.shift()!;
              currentPlayer.hand.push(drawnCard);
            }
          }
          break;

        case 'modify-stats':
          // Modify stats of target beasts
          this.processStatModification(effect, state, currentPlayerIndex);
          break;

        case 'gain-resource':
          // Gain resources (already handled in processMagicCard)
          if (effect.resource === 'energy') {
            const value = effect.value || 0;
            currentPlayer.energy = Math.min(currentPlayer.energy + value, 10); // maxEnergy = 10
          }
          break;
      }
    }

    private processStatModification(effect: any, state: BloomBeastsState, currentPlayerIndex: number): void {
      const field = currentPlayerIndex === 0 ? state.field.player1 : state.field.player2;
      const targets = this.resolveTargets(effect.target, field, state);

      for (const target of targets) {
        if (effect.stat === 'attack' || effect.stat === 'both') {
          target.currentAttack = Math.max(0, target.currentAttack + effect.value);
        }
        if (effect.stat === 'health' || effect.stat === 'both') {
          target.currentHealth = Math.max(0, target.currentHealth + effect.value);
          // Also increase maxHealth for permanent buffs
          if (effect.duration === 'permanent' && effect.value > 0) {
            target.maxHealth += effect.value;
          }
        }
      }
    }

    private resolveTargets(targetType: string, field: any, state: BloomBeastsState): RuntimeBeast[] {
      const targets: RuntimeBeast[] = [];

      switch (targetType) {
        case 'all-allies':
          // Get all allied beasts on the field
          for (const beast of field.beasts) {
            if (beast !== null) {
              targets.push(beast);
            }
          }
          break;
        case 'self':
          // Would need context to know which beast is self
          break;
        // Add more target types as needed
      }

      return targets;
    }

    private processStartOfTurnTriggers(state: BloomBeastsState, currentPlayerId: string): void {
      const currentPlayerIndex = state.players.findIndex(p => p.id === currentPlayerId);
      const field = currentPlayerIndex === 0 ? state.field.player1 : state.field.player2;

      // Process OnOwnStartOfTurn triggers
      for (const beast of field.beasts) {
        if (beast && beast.abilities) {
          for (const ability of beast.abilities) {
            if ('trigger' in ability && ability.trigger === 'OnOwnStartOfTurn' && 'effects' in ability && ability.effects) {
              for (const effect of ability.effects) {
                this.processEffect(effect, state, currentPlayerId);
              }
            }
          }
        }
      }
    }

    private applyWhileOnFieldEffects(state: BloomBeastsState, currentPlayerId: string): void {
      const currentPlayerIndex = state.players.findIndex(p => p.id === currentPlayerId);
      const field = currentPlayerIndex === 0 ? state.field.player1 : state.field.player2;

      // Apply WhileOnField effects from beasts
      for (const beast of field.beasts) {
        if (beast && beast.abilities) {
          for (const ability of beast.abilities) {
            if ('trigger' in ability && ability.trigger === 'WhileOnField' && 'effects' in ability && ability.effects) {
              for (const effect of ability.effects) {
                this.processEffect(effect, state, currentPlayerId);
              }
            }
          }
        }
      }

      // Apply WhileOnField effects from habitat
      if (field.habitat && field.habitat.abilities) {
        for (const ability of field.habitat.abilities) {
          if ('trigger' in ability && ability.trigger === 'WhileOnField' && 'effects' in ability && ability.effects) {
            for (const effect of ability.effects) {
              this.processEffect(effect, state, currentPlayerId);
            }
          }
        }
      }
    }

    private processEndOfTurnTriggers(state: BloomBeastsState, currentPlayerId: string): void {
      const currentPlayerIndex = state.players.findIndex(p => p.id === currentPlayerId);
      const field = currentPlayerIndex === 0 ? state.field.player1 : state.field.player2;

      // Process OnOwnEndOfTurn triggers
      for (const beast of field.beasts) {
        if (beast && beast.abilities) {
          for (const ability of beast.abilities) {
            if ('trigger' in ability && ability.trigger === 'OnOwnEndOfTurn' && 'effects' in ability && ability.effects) {
              for (const effect of ability.effects) {
                this.processEffect(effect, state, currentPlayerId);
              }
            }
          }
        }
      }
    }

    clearExpiredEffects(state: Turbo.IGameState<TState>): void {
      // Stub implementation - clear temporary effects here
    }
  }

  // Types are defined in ./types.ts to avoid circular dependencies

  /**
   * BloomBeasts game configuration
   */
  export interface BloomBeastsConfig {
    startingHandSize: number;
    maxFieldBeasts: number;
    maxFieldBuffs: number;
    maxFieldTraps: number;
    startingHealth: number;
    maxEnergy: number;
  }

  /**
   * Default game configuration
   */
  const DEFAULT_CONFIG: BloomBeastsConfig = {
    startingHandSize: 3,
    maxFieldBeasts: 3,
    maxFieldBuffs: 3,
    maxFieldTraps: 3,
    startingHealth: 30,
    maxEnergy: 10,
  };

  /**
   * BloomBeasts game rules implementation
   */
  export class BloomBeastsRules implements Turbo.IGameRules<BloomBeastsState, BloomBeastsActionData> {
    private config: BloomBeastsConfig;
    private effectSystem: EffectSystem<BloomBeastsState>;
    private actionHandlers: ActionHandlerRegistry;
    private winConditionChecker: WinConditionChecker;

    constructor(config: Partial<BloomBeastsConfig> = {}) {
      this.config = { ...DEFAULT_CONFIG, ...config };
      this.effectSystem = new EffectSystem<BloomBeastsState>();
      this.actionHandlers = new ActionHandlerRegistry();
      this.winConditionChecker = new WinConditionChecker();

      // Register action handlers
      this.actionHandlers.registerAll([
        new DrawCardActionHandler(),
        new PlayCardActionHandler(),
        new AttackActionHandler(),
        new EndTurnActionHandler(),
        new TimeoutActionHandler(),
        new ForfeitActionHandler(),
      ]);

      this.registerEffectHandlers();
    }

    /**
     * Initialize the game state
     */
    createInitialState(config: Turbo.IGameConfig): Turbo.IGameState<BloomBeastsState> {
      const players = config.players.map(p => this.createPlayer(p));

      // Shuffle decks and draw starting hands
      players.forEach(player => {
        player.deck = shuffle(player.deck);
        for (let i = 0; i < this.config.startingHandSize; i++) {
          this.drawCard(player);
        }
      });

      const gameData: BloomBeastsState = {
        players,
        field: {
          player1: {
            beasts: [null, null, null],
            buffs: [null, null, null],
            habitat: null,
            traps: [],
          },
          player2: {
            beasts: [null, null, null],
            buffs: [null, null, null],
            habitat: null,
            traps: [],
          },
        },
        currentTurnActions: {
          hasDrawnCard: false,
          cardsPlayed: 0,
          hasAttacked: new Set(),
        },
      };

      // Give first player 1 energy to start the game
      players[0].energy = 1;

      return {
        gameData,
        turnInfo: {
          turnNumber: 1,
          currentPlayerId: players[0].id,
          movesThisTurn: 0,
          timeStarted: Date.now(),
        },
        players: config.players,
        phase: Turbo.GamePhase.PLAYING,
        isComplete: false,
      };
    }

    /**
     * Validate if an action can be performed
     *
     * This now delegates to action handlers for validation.
     * Handlers contain all the validation logic specific to each action type.
     */
    validateAction(
      action: Turbo.IGameAction<BloomBeastsActionData>,
      state: Turbo.IGameState<BloomBeastsState>
    ): Turbo.IActionValidation {
      // Check if it's the current player's turn
      const currentPlayerIndex = this.getCurrentPlayerIndex(state);
      const currentPlayer = state.gameData!.players[currentPlayerIndex];

      if (action.playerId !== currentPlayer.id) {
        return { isValid: false, reason: 'Not your turn' };
      }

      // Get the appropriate handler
      const handler = this.actionHandlers.get(action.data.type);
      if (!handler) {
        return { isValid: false, reason: 'Unknown action type' };
      }

      // Delegate validation to the handler
      const validation = handler.validate(action.data, state, action.playerId);

      return {
        isValid: validation.valid,
        reason: !validation.valid ? validation.reason : undefined,
      };
    }

    /**
     * Execute an action and return the new state
     *
     * This is now a simple dispatcher that delegates to action handlers.
     * All action-specific logic, event generation, and trigger processing
     * is handled by the respective action handlers.
     */
    executeAction(
      action: Turbo.IGameAction<BloomBeastsActionData>,
      state: Turbo.IGameState<BloomBeastsState>
    ): Turbo.IActionResult<BloomBeastsState> {
      try {
        // Get the appropriate handler
        const handler = this.actionHandlers.get(action.data.type);
        if (!handler) {
          return {
            success: false,
            error: new Error(`No handler found for action type: ${action.data.type}`),
          };
        }

        // Validate the action
        const validation = handler.validate(action.data, state, action.playerId);
        if (!validation.valid) {
          const reason = 'reason' in validation ? validation.reason : 'Validation failed';
          return {
            success: false,
            error: new Error(reason),
          };
        }

        // Create context with trigger and effect processing functions
        const context = {
          processTriggers: (timing: string, newState: Turbo.IGameState<BloomBeastsState>, ctx?: TriggerContext) => {
            this.processTriggers(timing as TriggerTiming, newState, ctx);
          },
          processMagicCard: (card: MagicCard, newState: Turbo.IGameState<BloomBeastsState>) => {
            this.processMagicCard(card, newState);
          },
        };

        // Execute the action - handler returns full result with events
        const result = handler.execute(action.data, state, action.playerId, context);

        return result;
      } catch (error) {
        console.error('[BloomBeastsGame] Action execution failed:', error);
        return {
          success: false,
          error: error instanceof Error ? error : new Error(String(error)),
        };
      }
    }

    /**
     * Check if the game has ended
     *
     * Delegates to WinConditionChecker for all win condition logic
     */
    checkEndCondition(state: Turbo.IGameState<BloomBeastsState>): { isEnded: boolean; winnerId?: string; reason?: string } {
      // Check if game should end using WinConditionChecker
      if (!this.winConditionChecker.shouldGameEnd(state)) {
        return { isEnded: false };
      }

      // Game should end - determine winner and reason
      const winnerId = this.winConditionChecker.getWinnerId(state) ?? undefined;

      // Determine reason based on state
      let reason = 'Victory';

      if (state.gameData.suddenEnd) {
        const reasonMap = {
          'timeout': 'Timeout',
          'forfeit': 'Forfeit',
          'disconnect': 'Disconnect'
        };
        reason = reasonMap[state.gameData.suddenEnd.reason] || 'Unknown';
      } else {
        const players = state.gameData!.players;
        const aliveByHealth = players.filter(p => p.health > 0);
        if (aliveByHealth.length < 2) {
          reason = 'Opponent eliminated';
        } else {
          reason = 'Opponent decked out';
        }
      }

      return { isEnded: true, winnerId, reason };
    }

    /**
     * Get valid actions for the current player
     */
    getValidActions(state: Turbo.IGameState<BloomBeastsState>): Turbo.IGameAction<BloomBeastsActionData>[] {
      const actions: Turbo.IGameAction<BloomBeastsActionData>[] = [];
      const currentPlayer = state.gameData!.players[this.getCurrentPlayerIndex(state)];


      // Draw card action
      if (!state.gameData!.currentTurnActions.hasDrawnCard && currentPlayer.deck.length > 0) {
        actions.push({
          type: 'game_action',
          playerId: currentPlayer.id,
          data: { type: BloomBeastsActionType.DRAW_CARD },
        });
      }

      // Play card actions
      currentPlayer.hand.forEach(card => {
        if (card.cost <= currentPlayer.energy) {
          const positions = this.getValidPositionsForCard(card, state);
          positions.forEach(position => {
            actions.push({
              type: 'game_action',
              playerId: currentPlayer.id,
              data: {
                type: BloomBeastsActionType.PLAY_CARD,
                cardId: card.id,
                position,
              },
            });
          });
        }
      });

      // Attack actions
      const field = this.getCurrentPlayerIndex(state) === 0 ? state.gameData!.field.player1 : state.gameData!.field.player2;
      field.beasts.forEach(beast => {
        if (beast && !beast.summoningSickness && !state.gameData!.currentTurnActions.hasAttacked.has(beast.id)) {
          const targets = this.getValidAttackTargets(beast, state);
          targets.forEach(targetId => {
            actions.push({
              type: 'game_action',
              playerId: currentPlayer.id,
              data: {
                type: BloomBeastsActionType.ATTACK,
                cardId: beast.id,
                targetId,
              },
            });
          });
        }
      });

      // End turn action (always available)
      actions.push({
        type: 'game_action',
        playerId: currentPlayer.id,
        data: { type: BloomBeastsActionType.END_TURN },
      });

      return actions;
    }

    /**
     * Handle phase transitions
     */
    getNextPhase(currentPhase: string, state: Turbo.IGameState<BloomBeastsState>): string {
      // BloomBeasts has a simple phase structure
      return 'main';
    }

    /**
     * Private helper methods
     */

    private getCurrentPlayerIndex(state: Turbo.IGameState<BloomBeastsState>): number {
      const currentPlayerId = state.turnInfo!.currentPlayerId;
      return state.gameData!.players.findIndex(p => p.id === currentPlayerId);
    }

    private createPlayer(config: Turbo.IPlayer): BloomBeastsPlayer {
      // Get deck from metadata - should already be RuntimeCard[] from BattleController
      const deck = (config.metadata?.deck as RuntimeCard[]) || [];
      return {
        id: config.id,
        name: config.name,
        health: this.config.startingHealth,
        energy: 0,
        deck: [...deck],
        hand: [],
        graveyard: [],
        maxHandSize: 10,
        maxHealth: this.config.startingHealth,
      };
    }

    private drawCard(player: BloomBeastsPlayer): RuntimeCard | null {
      if (player.deck.length === 0) {
        return null;
      }

      const card = player.deck.shift()!;
      player.hand.push(card);
      return card;
    }

    private getValidPositionsForCard(card: RuntimeCard, state: Turbo.IGameState<BloomBeastsState>): number[] {
      const positions: number[] = [];
      const field = this.getCurrentPlayerIndex(state) === 0 ? state.gameData!.field.player1 : state.gameData!.field.player2;

      switch (card.type) {
        case 'Beast':
          field.beasts.forEach((slot, index) => {
            if (slot === null) {
              positions.push(index);
            }
          });
          break;

        case 'Buff':
          field.buffs.forEach((slot, index) => {
            if (slot === null) {
              positions.push(index);
            }
          });
          break;

        case 'Trap':
        case 'Habitat':
        case 'Magic':
          positions.push(0); // Single valid position for these
          break;
      }

      return positions;
    }

    private findBeastOnField(beastId: string, state: Turbo.IGameState<BloomBeastsState>): RuntimeBeast | null {
      for (const field of [state.gameData!.field.player1, state.gameData!.field.player2]) {
        for (const beast of field.beasts) {
          if (beast?.id === beastId) {
            return beast;
          }
        }
      }
      return null;
    }

    private getValidAttackTargets(beast: RuntimeBeast, state: Turbo.IGameState<BloomBeastsState>): string[] {
      const targets: string[] = [];
      const opponentField = this.getCurrentPlayerIndex(state) === 0 ?
                            state.gameData!.field.player2 :
                            state.gameData!.field.player1;

      // Can attack opponent beasts
      opponentField.beasts.forEach(opponentBeast => {
        if (opponentBeast) {
          targets.push(opponentBeast.id);
        }
      });

      // Can attack opponent directly if no beasts
      if (opponentField.beasts.every(b => b === null)) {
        const opponentPlayer = state.gameData!.players[1 - this.getCurrentPlayerIndex(state)];
        targets.push(opponentPlayer.id);
      }

      return targets;
    }

    private processMagicCard(card: MagicCard, state: Turbo.IGameState<BloomBeastsState>): void {
      // Process magic card effects
      if (!card.abilities || card.abilities.length === 0) {
        return;
      }

      // Get current player
      const currentPlayerIndex = this.getCurrentPlayerIndex(state);
      const currentPlayer = state.gameData.players[currentPlayerIndex];

      // Process each ability
      card.abilities.forEach(ability => {
        // Type guard: check if this is a StructuredAbility with effects
        if ('effects' in ability && ability.effects) {
          ability.effects.forEach((effect: any) => {
            // Handle GainResource effects (for Energy Block, Energy Surge, etc.)
            if (effect.type === 'gain-resource' && effect.resource === 'energy') {
              const value = effect.value || 0;
              currentPlayer.energy = Math.min(
                currentPlayer.energy + value,
                this.config.maxEnergy
              );
            }
            // Handle DrawCards effects
            else if (effect.type === 'draw-cards') {
              const cardsToDraw = effect.value || 1;
              for (let i = 0; i < cardsToDraw; i++) {
                if (currentPlayer.deck.length > 0 && currentPlayer.hand.length < currentPlayer.maxHandSize) {
                  const drawnCard = currentPlayer.deck.shift()!;
                  currentPlayer.hand.push(drawnCard);
                }
              }
            }
            // Add more effect handlers here as needed
          });
        }
      });
    }

    private processTriggers(
      timing: TriggerTiming,
      state: Turbo.IGameState<BloomBeastsState>,
      context?: TriggerContext
    ): void {
      // Process triggers using the effect system
      const result = this.effectSystem.processEffects(timing, state, context);
      if (result.success && result.newState) {
        // Update state with processed effects
        Object.assign(state, result.newState);
      }
    }

    private registerEffectHandlers(): void{
      // Register effect handlers for BloomBeasts-specific effects
      // This would include handlers for abilities like:
      // - Stat modifications
      // - Damage effects
      // - Healing
      // - Card draw
      // - etc.
    }
  }

  /**
   * Factory function to create a BloomBeasts game instance
   */
  export function createBloomBeastsGame(config?: Partial<BloomBeastsConfig>): Turbo.GameController<BloomBeastsState, BloomBeastsActionData> {
    const rules = new BloomBeastsRules(config);
    return new Turbo.GameController(rules);
  }

  // ==================== bloombeasts\battle\BloomBeastsAI.ts ====================

  /**
   * BloomBeasts AI implementation using the TURBO library
   */



  /**
   * Player field structure
   */
  type PlayerField = {
    beasts: (RuntimeBeast | null)[];
    buffs: (RuntimeBuff | null)[];
    habitat: RuntimeHabitat | null;
    traps: RuntimeTrap[];
  };

  /**
   * BloomBeasts Greedy AI implementation
   */
  export class BloomBeastsGreedyAI extends Turbo.GreedyAI<BloomBeastsState, BloomBeastsActionData> {
    private currentState: Turbo.IGameState<BloomBeastsState> | null;

    constructor(config: Turbo.IAIConfig) {
      super({
        ...config,
        // Set longer thinking times for better UX
        thinkingTime: config.thinkingTime || { min: 800, max: 2500 }
      });
      this.currentState = null;
    }

    /**
     * Evaluate the current state (higher is better for this player)
     */
    evaluateState(state: Turbo.IGameState<BloomBeastsState>): number {
      let score = 0;
      const playerIndex = state.gameData.players.findIndex(p => p.id === this.playerId);
      const player = state.gameData.players[playerIndex];
      const opponent = state.gameData.players[1 - playerIndex];
      const playerField = playerIndex === 0 ? state.gameData.field.player1 : state.gameData.field.player2;
      const opponentField = playerIndex === 0 ? state.gameData.field.player2 : state.gameData.field.player1;

      // Health difference (most important)
      score += (player.health - opponent.health) * 10;

      // Energy advantage
      score += (player.energy - opponent.energy) * 2;

      // Card advantage
      score += (player.hand.length - opponent.hand.length) * 3;

      // Board presence
      const playerBeasts = playerField.beasts.filter(b => b !== null).length;
      const opponentBeasts = opponentField.beasts.filter(b => b !== null).length;
      score += (playerBeasts - opponentBeasts) * 5;

      // Total stats on board
      let playerStats = 0;
      let opponentStats = 0;

      playerField.beasts.forEach(beast => {
        if (beast) {
          playerStats += beast.currentAttack + beast.currentHealth;
          // Bonus for special abilities
          if (beast.abilities && beast.abilities.length > 0) {
            playerStats += beast.abilities.length * 2;
          }
        }
      });

      opponentField.beasts.forEach(beast => {
        if (beast) {
          opponentStats += beast.currentAttack + beast.currentHealth;
          if (beast.abilities && beast.abilities.length > 0) {
            opponentStats += beast.abilities.length * 2;
          }
        }
      });

      score += (playerStats - opponentStats) * 2;

      // Buffs and habitat bonus
      score += playerField.buffs.filter(b => b !== null).length * 3;
      score += playerField.habitat ? 4 : 0;

      // Traps bonus
      score += playerField.traps.length * 2;

      return score;
    }

    /**
     * Evaluate an action's immediate value
     */
    evaluateAction(
      action: Turbo.IGameAction<BloomBeastsActionData>,
      state: Turbo.IGameState<BloomBeastsState>
    ): number {
      const playerIndex = state.gameData.players.findIndex(p => p.id === this.playerId);
      const player = state.gameData.players[playerIndex];
      const opponent = state.gameData.players[1 - playerIndex];
      const playerField = playerIndex === 0 ? state.gameData.field.player1 : state.gameData.field.player2;
      const opponentField = playerIndex === 0 ? state.gameData.field.player2 : state.gameData.field.player1;

      switch (action.data.type) {
        case BloomBeastsActionType.DRAW_CARD:
          // Drawing cards is generally good
          return 5 + Math.random() * 2;

        case BloomBeastsActionType.PLAY_CARD:
          const card = player.hand.find(c => c.id === action.data.cardId);
          if (!card) return 0;

          let value = 0;

          switch (card.type) {
            case 'Beast':
              const beast = card as BloomBeastCard;
              // Value based on stats and abilities
              value = beast.baseAttack * 2 + beast.baseHealth * 1.5;

              // Bonus for abilities
              if (beast.abilities) {
                value += beast.abilities.length * 5;
              }

              // Efficiency bonus (stats per energy)
              if (beast.cost > 0) {
                value += (beast.baseAttack + beast.baseHealth) / beast.cost * 3;
              }

              // Board control bonus
              if (this.playerBeasts < this.opponentBeasts) {
                value += 10; // Extra value when behind on board
              }
              break;

            case 'Magic':
              // Magic cards vary widely, use base value
              value = 8 + Math.random() * 4;
              break;

            case 'Trap':
              // Traps are defensive
              value = 6;
              if (this.opponentBeasts > this.playerBeasts) {
                value += 4; // More valuable when opponent has board advantage
              }
              break;

            case 'Buff':
              // Buffs need creatures to be valuable
              value = this.playerBeasts * 4;
              break;

            case 'Habitat':
              // Habitat provides long-term value
              value = 7 + this.playerBeasts * 2;
              break;
          }

          // Adjust for energy efficiency
          if (card.cost > 0) {
            const energyEfficiency = value / card.cost;
            value = energyEfficiency * 5;
          }

          return value;

        case BloomBeastsActionType.ATTACK:
          const attackerId = action.data.cardId!;
          const targetId = action.data.targetId;

          const attacker = this.findBeast(attackerId, playerField);
          if (!attacker) return 0;

          let attackValue = 0;

          if (!targetId || targetId === opponent.id) {
            // Direct attack on opponent
            attackValue = attacker.currentAttack * 3;

            // Lethal bonus
            if (attacker.currentAttack >= opponent.health) {
              attackValue += 1000; // Win the game!
            }
          } else {
            // Attack on creature
            const target = this.findBeast(targetId, opponentField);
            if (!target) return 0;

            // Value of removing opponent creature
            attackValue = target.currentAttack * 2 + target.currentHealth * 1.5;

            // Favorable trade bonus
            if (attacker.currentAttack >= target.currentHealth && target.currentAttack < attacker.currentHealth) {
              attackValue += 15; // We survive, they don't
            }

            // Penalty for unfavorable trade
            if (target.currentAttack >= attacker.currentHealth && attacker.currentAttack < target.currentHealth) {
              attackValue -= 10; // We die, they don't
            }

            // Equal trade evaluation
            if (attacker.currentAttack >= target.currentHealth && target.currentAttack >= attacker.currentHealth) {
              // Compare creature values
              const attackerValue = attacker.currentAttack * 2 + attacker.currentHealth * 1.5;
              const targetValue = target.currentAttack * 2 + target.currentHealth * 1.5;
              attackValue = targetValue - attackerValue + 5; // Slight bonus for proactive play
            }
          }

          return attackValue;

        case BloomBeastsActionType.END_TURN:
          // Only end turn when nothing better to do
          return -10;

        default:
          return 0;
      }
    }

    /**
     * Override chooseAction to implement turn logic
     */
    async chooseAction(
      state: Turbo.IGameState<BloomBeastsState>,
      availableActions: Turbo.IGameAction<BloomBeastsActionData>[]
    ): Promise<Turbo.IGameAction<BloomBeastsActionData> | null> {
      // Store state for getter methods
      this.currentState = state;

      // Add thinking delay for better UX (configured in constructor)
      await this.simulateThinking();

      if (availableActions.length === 0) {
        return null;
      }

      // Group actions by type
      const actionsByType = new Map<BloomBeastsActionType, Turbo.IGameAction<BloomBeastsActionData>[]>();
      availableActions.forEach(action => {
        const type = action.data.type;
        if (!actionsByType.has(type)) {
          actionsByType.set(type, []);
        }
        actionsByType.get(type)!.push(action);
      });

      // Priority order for action types
      const priorityOrder = [
        BloomBeastsActionType.DRAW_CARD,    // Always draw first if available
        BloomBeastsActionType.ATTACK,       // Then attack
        BloomBeastsActionType.PLAY_CARD,    // Then play cards
        BloomBeastsActionType.END_TURN,     // End turn last
      ];

      // Find best action considering priorities
      for (const actionType of priorityOrder) {
        const actionsOfType = actionsByType.get(actionType);
        if (!actionsOfType || actionsOfType.length === 0) continue;

        // Special handling for END_TURN
        if (actionType === BloomBeastsActionType.END_TURN) {
          // Only end turn if no other valuable actions
          const otherActions = availableActions.filter(a => a.data.type !== BloomBeastsActionType.END_TURN);
          const hasValuableActions = otherActions.some(a => this.evaluateAction(a, state) > 5);

          if (hasValuableActions) {
            continue; // Skip END_TURN and look for better actions
          }

          return actionsOfType[0]; // End turn
        }

        // Evaluate all actions of this type
        const evaluatedActions = actionsOfType.map(action => ({
          action,
          value: this.evaluateAction(action, state),
        }));

        // Filter out low-value actions (except draw which is always good)
        const valuableActions = evaluatedActions.filter(ea =>
          ea.value > 0 || actionType === BloomBeastsActionType.DRAW_CARD
        );

        if (valuableActions.length > 0) {
          // Add randomness based on difficulty
          valuableActions.forEach(ea => {
            ea.value = this.addNoise(ea.value, this.difficulty === 'easy' ? 30 : 10);
          });

          // Sort by value and return best
          valuableActions.sort((a, b) => b.value - a.value);
          return valuableActions[0].action;
        }
      }

      // Fallback: end turn
      const endTurnAction = availableActions.find(a => a.data.type === BloomBeastsActionType.END_TURN);
      return endTurnAction || null;
    }

    /**
     * Helper methods
     */

    private findBeast(id: string, field: PlayerField): RuntimeBeast | null {
      for (const beast of field.beasts) {
        if (beast?.id === id) {
          return beast;
        }
      }
      return null;
    }

    private get playerBeasts(): number {
      const state = this.currentState;
      if (!state) return 0;
      const playerIndex = state.gameData.players.findIndex(p => p.id === this.playerId);
      const field = playerIndex === 0 ? state.gameData.field.player1 : state.gameData.field.player2;
      return field.beasts.filter(b => b !== null).length;
    }

    private get opponentBeasts(): number {
      const state = this.currentState;
      if (!state) return 0;
      const playerIndex = state.gameData.players.findIndex(p => p.id === this.playerId);
      const field = playerIndex === 0 ? state.gameData.field.player2 : state.gameData.field.player1;
      return field.beasts.filter(b => b !== null).length;
    }
  }

  /**
   * Simple Random AI for testing
   */
  export class BloomBeastsRandomAI extends BloomBeastsGreedyAI {
    evaluateAction(
      action: Turbo.IGameAction<BloomBeastsActionData>,
      state: Turbo.IGameState<BloomBeastsState>
    ): number {
      // Random evaluation with slight preference for non-END_TURN actions
      if (action.data.type === BloomBeastsActionType.END_TURN) {
        return Math.random() * 10;
      }
      return Math.random() * 100;
    }
  }

  // ==================== bloombeasts\battle\core\AIManager.ts ====================

  /**
   * AIManager - Manages AI players and their turn execution
   *
   * Responsibilities:
   * - Register AI players
   * - Execute AI turns
   * - Check if current player is AI
   */



  export class AIManager {
    private game: Turbo.GameController<BloomBeastsState, BloomBeastsActionData>;
    private aiPlayers: Set<string>;

    constructor(game: Turbo.GameController<BloomBeastsState, BloomBeastsActionData>) {
      this.game = game;
      this.aiPlayers = new Set();
    }

    /**
     * Register AI players from battle config
     */
    registerAIPlayers(config: BattleConfig): void {
      if (config.player1.isAI) {
        const difficulty = this.mapStrategyToDifficulty(config.player1.aiStrategy);
        const ai = new BloomBeastsGreedyAI({
          playerId: config.player1.id,
          difficulty
        });
        this.game.registerAI(config.player1.id, ai);
        this.aiPlayers.add(config.player1.id);
        Logger.info(`[AIManager] Registered AI for player1: ${config.player1.id}`);
      }

      if (config.player2.isAI) {
        const difficulty = this.mapStrategyToDifficulty(config.player2.aiStrategy);
        const ai = new BloomBeastsGreedyAI({
          playerId: config.player2.id,
          difficulty
        });
        this.game.registerAI(config.player2.id, ai);
        this.aiPlayers.add(config.player2.id);
        Logger.info(`[AIManager] Registered AI for player2: ${config.player2.id}`);
      }
    }

    /**
     * Map strategy string to AILevel
     */
    private mapStrategyToDifficulty(strategy?: string): Turbo.AILevel {
      switch (strategy) {
        case 'aggressive':
          return Turbo.AILevel.HARD;
        case 'defensive':
          return Turbo.AILevel.EASY;
        default:
          return Turbo.AILevel.MEDIUM;
      }
    }

    /**
     * Execute AI turn - loops until AI ends turn or game ends
     * @param onActionComplete Optional callback called after each AI action to update UI
     */
    async executeAITurn(onActionComplete?: () => void): Promise<void> {
      const state = this.game.getState();
      const currentPlayerId = state.turnInfo.currentPlayerId;
      const currentPlayer = state.gameData.players.find(p => p.id === currentPlayerId);

      if (!currentPlayer) {
        Logger.error('[AIManager] Current player not found');
        return;
      }

      Logger.info(`[AIManager] Executing AI turn for ${currentPlayer.name} (${currentPlayerId})`);

      try {
        let actionCount = 0;
        const maxActions = MAX_AI_ACTIONS_PER_TURN;

        while (actionCount < maxActions) {
          const currentState = this.game.getState();

          // Check if turn switched (AI ended turn)
          if (currentState.turnInfo.currentPlayerId !== currentPlayerId) {
            Logger.info(`[AIManager] AI turn ended, turn switched to: ${currentState.turnInfo.currentPlayerId}`);
            break;
          }

          // Check if game completed
          if (currentState.isComplete) {
            Logger.info('[AIManager] Game completed during AI turn');
            break;
          }

          // Execute one AI action
          await this.game.executeAITurn();
          actionCount++;

          Logger.debug(`[AIManager] AI executed action ${actionCount}`);

          // Trigger UI update after each action
          if (onActionComplete) {
            onActionComplete();
          }
        }

        if (actionCount >= maxActions) {
          Logger.warn('[AIManager] AI reached maximum action limit');
        }

        Logger.info('[AIManager] AI turn execution completed');
      } catch (error) {
        Logger.error('[AIManager] AI turn execution failed:', error);
        throw error;
      }
    }

    /**
     * Check if the current player is an AI
     */
    isAIPlayerTurn(): boolean {
      const state = this.game.getState();
      const currentPlayerId = state.turnInfo.currentPlayerId;
      return this.aiPlayers.has(currentPlayerId);
    }

    /**
     * Check if a specific player is AI
     */
    isAIPlayer(playerId: string): boolean {
      return this.aiPlayers.has(playerId);
    }

    /**
     * Clear all registered AIs
     */
    clear(): void {
      this.aiPlayers.clear();
    }
  }

  // ==================== bloombeasts\battle\core\ActionProcessor.ts ====================

  /**
   * ActionProcessor - Processes player actions
   *
   * Responsibilities:
   * - Execute player actions (play card, attack, etc.)
   * - Validate actions before execution
   * - Return action results
   */



  export class ActionProcessor {
    private game: Turbo.GameController<BloomBeastsState, BloomBeastsActionData>;

    constructor(game: Turbo.GameController<BloomBeastsState, BloomBeastsActionData>) {
      this.game = game;
    }

    /**
     * Draw a card
     */
    drawCard(playerId: string): boolean {
      const result = this.game.performAction({
        type: 'game_action',
        playerId,
        data: {
          type: BloomBeastsActionType.DRAW_CARD,
        }
      });

      if (!result.success) {
        Logger.warn(`[ActionProcessor] Failed to draw card: ${result.error}`);
      }

      return result.success;
    }

    /**
     * Play a card
     */
    playCard(cardId: string, playerId: string, position?: number): boolean {
      const result = this.game.performAction({
        type: 'game_action',
        playerId,
        data: {
          type: BloomBeastsActionType.PLAY_CARD,
          cardId,
          position,
        }
      });

      if (!result.success) {
        Logger.warn(`[ActionProcessor] Failed to play card: ${result.error}`);
      }

      return result.success;
    }

    /**
     * Attack with a beast
     */
    attack(attackerId: string, targetId: string, playerId: string): boolean {
      const result = this.game.performAction({
        type: 'game_action',
        playerId,
        data: {
          type: BloomBeastsActionType.ATTACK,
          cardId: attackerId,
          targetId,
        }
      });

      if (!result.success) {
        Logger.warn(`[ActionProcessor] Failed to attack: ${result.error}`);
      }

      return result.success;
    }

    /**
     * Attack player directly
     */
    attackPlayer(attackerId: string, playerId: string): boolean {
      const state = this.game.getState();
      const currentPlayerId = state.turnInfo.currentPlayerId;
      const currentIndex = state.gameData.players.findIndex(p => p.id === currentPlayerId);
      const targetPlayer = state.gameData.players[1 - currentIndex];

      return this.attack(attackerId, targetPlayer.id, playerId);
    }

    /**
     * Use creature ability
     */
    useAbility(creatureId: string, targetId: string | null, playerId: string): boolean {
      const result = this.game.performAction({
        type: 'game_action',
        playerId,
        data: {
          type: BloomBeastsActionType.USE_ABILITY,
          cardId: creatureId,
          targetId: targetId || undefined,
          abilityId: 'default',
        }
      });

      if (!result.success) {
        Logger.warn(`[ActionProcessor] Failed to use ability: ${result.error}`);
      }

      return result.success;
    }

    /**
     * End turn
     */
    endTurn(playerId: string): boolean {
      Logger.info(`[ActionProcessor] Ending turn for ${playerId}`);

      const result = this.game.performAction({
        type: 'game_action',
        playerId,
        data: {
          type: BloomBeastsActionType.END_TURN,
        }
      });

      if (result.success) {
        const newState = this.game.getState();
        const currentPlayerId = newState.turnInfo.currentPlayerId;
        Logger.info(`[ActionProcessor] Turn ended successfully. New current player: ${currentPlayerId}`);
      } else {
        Logger.error(`[ActionProcessor] Failed to end turn: ${result.error}`);
      }

      return result.success;
    }

    /**
     * Get available actions for current player
     */
    getAvailableActions() {
      return this.game.getAvailableActions();
    }
  }

  // ==================== bloombeasts\battle\core\BattleOrchestrator.ts ====================

  /**
   * BattleOrchestrator - Orchestrates battle lifecycle and coordinates subsystems
   *
   * Responsibilities:
   * - Initialize battles
   * - Subscribe to game events
   * - Coordinate between subsystems (AI, Actions, Win conditions)
   * - Manage battle lifecycle
   */



  export class BattleOrchestrator {
    private async: AsyncMethods;
    private game: Turbo.GameController<BloomBeastsState, BloomBeastsActionData>;
    private config: BattleConfig | null = null;

    // Subsystems
    public readonly ai: AIManager;
    public readonly actions: ActionProcessor;
    public readonly winChecker: WinConditionChecker;

    constructor(async: AsyncMethods) {
      this.async = async;
      this.game = createBloomBeastsGame();

      // Initialize subsystems
      this.ai = new AIManager(this.game);
      this.actions = new ActionProcessor(this.game);
      this.winChecker = new WinConditionChecker();
    }

    /**
     * Initialize a new battle
     */
    initializeBattle(config: BattleConfig): BattleState {
      Logger.info('[BattleOrchestrator] Initializing battle with TURBO engine');

      this.config = config;

      // Initialize the TURBO game
      this.game.initialize({
        players: [
          {
            id: config.player1.id,
            name: config.player1.name,
            type: config.player1.isAI ? Turbo.PlayerType.AI : Turbo.PlayerType.HUMAN,
            metadata: {
              deck: [...config.player1.deck],
              health: config.player1.health ?? 30,
              maxHealth: config.player1.maxHealth ?? 30,
            }
          },
          {
            id: config.player2.id,
            name: config.player2.name,
            type: config.player2.isAI ? Turbo.PlayerType.AI : Turbo.PlayerType.HUMAN,
            metadata: {
              deck: [...config.player2.deck],
              health: config.player2.health ?? 30,
              maxHealth: config.player2.maxHealth ?? 30,
            }
          }
        ]
      });

      // Register AI players
      this.ai.registerAIPlayers(config);

      Logger.info('[BattleOrchestrator] Battle initialized successfully');

      return this.getState();
    }

    /**
     * Get the underlying TURBO game controller
     * Consumers should subscribe to TURBO events directly
     */
    getGameController(): Turbo.GameController<BloomBeastsState, BloomBeastsActionData> {
      return this.game;
    }

    /**
     * Get current battle state
     */
    getState(): BattleState {
      return {
        turboState: this.game.getState(),
      };
    }

    /**
     * Get current player
     */
    getCurrentPlayer(): BloomBeastsPlayer {
      const state = this.game.getState();
      const currentPlayerId = state.turnInfo.currentPlayerId;
      const currentPlayer = state.gameData.players.find(p => p.id === currentPlayerId);

      if (!currentPlayer) {
        throw new Error('Current player not found');
      }

      return currentPlayer;
    }

    /**
     * Get opponent player
     */
    getOpponentPlayer(): BloomBeastsPlayer {
      const state = this.game.getState();
      const currentPlayerId = state.turnInfo.currentPlayerId;
      const currentIndex = state.gameData.players.findIndex(p => p.id === currentPlayerId);
      const opponentIndex = 1 - currentIndex;

      return state.gameData.players[opponentIndex];
    }

    /**
     * Check if game is complete
     */
    isComplete(): boolean {
      return this.game.isComplete();
    }

    /**
     * Get game winner
     */
    getWinner(): string | null {
      return this.game.getWinner() || null;
    }

    /**
     * Dispose battle resources
     */
    dispose(): void {
      this.game.reset();
      this.ai.clear();
      this.config = null;
      Logger.info('[BattleOrchestrator] Battle disposed');
    }
  }

  // ==================== bloombeasts\battle\core\BattleController.ts ====================

  /**
   * BattleController - Thin facade for battle management
   *
   * This is now a simple facade that delegates to specialized subsystems:
   * - BattleOrchestrator: Battle lifecycle and event coordination
   * - AIManager: AI player management and turn execution
   * - ActionProcessor: Player action handling
   * - WinConditionChecker: Battle end conditions
   *
   * All the complex logic has been extracted into focused, testable classes.
   *
   * Consumers should use getGameController() to subscribe to TURBO events directly
   * instead of using callbacks.
   */



  export class BattleController {
    private orchestrator: BattleOrchestrator;

    constructor(async: AsyncMethods) {
      this.orchestrator = new BattleOrchestrator(async);
    }

    /**
     * Initialize a new battle
     */
    initializeBattle(config: BattleConfig): BattleState {
      return this.orchestrator.initializeBattle(config);
    }

    /**
     * Get current battle state
     */
    getCurrentBattle(): BattleState | null {
      return this.orchestrator.getState();
    }

    /**
     * Check if battle has ended
     */
    checkBattleEnd(): BattleResult | null {
      const state = this.orchestrator.getState().turboState;
      return this.orchestrator.winChecker.checkBattleEnd(state);
    }

    /**
     * Mark battle as complete
     */
    completeBattle(winner: 'player1' | 'player2' | null): void {
      // Battle completion is handled automatically by TURBO
    }

    /**
     * Draw a card
     */
    drawCard(playerId: string): boolean {
      return this.orchestrator.actions.drawCard(playerId);
    }

    /**
     * Play a card
     */
    playCard(cardId: string, playerId: string, position?: number): boolean {
      return this.orchestrator.actions.playCard(cardId, playerId, position);
    }

    /**
     * Attack with a beast
     */
    attackBeast(attackerId: string, targetId: string, playerId: string): boolean {
      return this.orchestrator.actions.attack(attackerId, targetId, playerId);
    }

    /**
     * Attack player directly
     */
    attackPlayer(attackerId: string, playerId: string): boolean {
      return this.orchestrator.actions.attackPlayer(attackerId, playerId);
    }

    /**
     * Use creature ability
     */
    useAbility(creatureId: string, targetId: string | null, playerId: string): boolean {
      return this.orchestrator.actions.useAbility(creatureId, targetId, playerId);
    }

    /**
     * End turn
     */
    endTurn(playerId: string): void {
      this.orchestrator.actions.endTurn(playerId);
    }

    /**
     * REMOVED: timeoutLoss() - Timeout is now handled through TURBO actions
     * See TimeoutActionHandler and WinConditionChecker for timeout handling
     */

    /**
     * Execute AI turn
     * @param onActionComplete Optional callback called after each AI action to update UI
     */
    async executeAITurn(onActionComplete?: () => void): Promise<void> {
      return this.orchestrator.ai.executeAITurn(onActionComplete);
    }

    /**
     * Get current player
     */
    getCurrentPlayer() {
      return this.orchestrator.getCurrentPlayer();
    }

    /**
     * Get opponent player
     */
    getOpponentPlayer() {
      return this.orchestrator.getOpponentPlayer();
    }

    /**
     * Check if current player is AI
     */
    isAIPlayerTurn(): boolean {
      return this.orchestrator.ai.isAIPlayerTurn();
    }

    /**
     * Get available actions
     */
    getAvailableActions() {
      return this.orchestrator.actions.getAvailableActions();
    }

    /**
     * Get the underlying TURBO game controller
     * Use this to subscribe to TURBO events directly
     */
    getGameController(): Turbo.GameController<BloomBeastsState, BloomBeastsActionData> {
      return this.orchestrator.getGameController();
    }

    /**
     * Dispose battle resources
     */
    dispose(): void {
      this.orchestrator.dispose();
    }
  }

  // ==================== bloombeasts\battle\types\actions.ts ====================

  /**
   * Typed Action System
   *
   * Replaces string-based action parsing with proper TypeScript discriminated unions.
   * This provides type safety, better IDE support, and eliminates string parsing bugs.
   *
   * Migration from:
   *   action = 'play-card-0-target-2'
   * To:
   *   action = { type: 'play-card', cardIndex: 0, targetIndex: 2 }
   */

  /**
   * Base action that all battle actions extend
   */
  export interface BaseBattleAction {
    type: string;
    playerId?: string;
    timestamp?: number;
  }

  /**
   * Play a card from hand
   */
  export interface PlayCardAction extends BaseBattleAction {
    type: 'play-card';
    cardIndex: number;
    cardId?: string;
    targetIndex?: number; // For targeted cards like Magic
    position?: number; // For beast placement
  }

  /**
   * Attack with a beast
   */
  export interface AttackBeastAction extends BaseBattleAction {
    type: 'attack-beast';
    attackerId: string;
    attackerIndex?: number;
    targetId?: string;
    targetIndex?: number;
  }

  /**
   * Attack opponent player directly
   */
  export interface AttackPlayerAction extends BaseBattleAction {
    type: 'attack-player';
    attackerId: string;
    attackerIndex?: number;
  }

  /**
   * Use a beast's ability
   */
  export interface UseAbilityAction extends BaseBattleAction {
    type: 'use-ability';
    beastId: string;
    beastIndex?: number;
    abilityIndex: number;
    targetId?: string;
    targetIndex?: number;
  }

  /**
   * End the current turn
   */
  export interface EndTurnAction extends BaseBattleAction {
    type: 'end-turn';
  }

  /**
   * Forfeit the battle
   */
  export interface ForfeitAction extends BaseBattleAction {
    type: 'forfeit';
  }

  /**
   * Timeout - player ran out of time
   */
  export interface TimeoutAction extends BaseBattleAction {
    type: 'timeout';
    timedOutPlayerId?: string; // Which player actually timed out
  }

  /**
   * Auto-attack with all available beasts
   */
  export interface AutoAttackAllAction extends BaseBattleAction {
    type: 'auto-attack-all';
  }

  /**
   * Discriminated union of all possible battle actions
   */
  export type BattleAction =
    | PlayCardAction
    | AttackBeastAction
    | AttackPlayerAction
    | UseAbilityAction
    | EndTurnAction
    | ForfeitAction
    | TimeoutAction
    | AutoAttackAllAction;

  /**
   * Action creator functions for type-safe action construction
   */
  export const BattleActions = {
    playCard: (cardIndex: number, options?: {
      cardId?: string;
      targetIndex?: number;
      position?: number;
      playerId?: string;
    }): PlayCardAction => ({
      type: 'play-card',
      cardIndex,
      ...options,
      timestamp: Date.now(),
    }),

    attackBeast: (attackerId: string, options?: {
      attackerIndex?: number;
      targetId?: string;
      targetIndex?: number;
      playerId?: string;
    }): AttackBeastAction => ({
      type: 'attack-beast',
      attackerId,
      ...options,
      timestamp: Date.now(),
    }),

    attackPlayer: (attackerId: string, options?: {
      attackerIndex?: number;
      playerId?: string;
    }): AttackPlayerAction => ({
      type: 'attack-player',
      attackerId,
      ...options,
      timestamp: Date.now(),
    }),

    useAbility: (beastId: string, abilityIndex: number, options?: {
      beastIndex?: number;
      targetId?: string;
      targetIndex?: number;
      playerId?: string;
    }): UseAbilityAction => ({
      type: 'use-ability',
      beastId,
      abilityIndex,
      ...options,
      timestamp: Date.now(),
    }),

    endTurn: (playerId?: string): EndTurnAction => ({
      type: 'end-turn',
      playerId,
      timestamp: Date.now(),
    }),

    forfeit: (playerId?: string): ForfeitAction => ({
      type: 'forfeit',
      playerId,
      timestamp: Date.now(),
    }),

    timeout: (playerId?: string): TimeoutAction => ({
      type: 'timeout',
      playerId,
      timestamp: Date.now(),
    }),

    autoAttackAll: (playerId?: string): AutoAttackAllAction => ({
      type: 'auto-attack-all',
      playerId,
      timestamp: Date.now(),
    }),
  };

  /**
   * Parse legacy string-based actions into typed actions
   * This function helps migrate from old string format to new typed format.
   *
   * Examples:
   *   'play-card-0' -> { type: 'play-card', cardIndex: 0 }
   *   'play-card-0-target-2' -> { type: 'play-card', cardIndex: 0, targetIndex: 2 }
   *   'attack-beast-1-2' -> { type: 'attack-beast', attackerIndex: 1, targetIndex: 2 }
   *   'end-turn' -> { type: 'end-turn' }
   */
  export function parseActionString(actionStr: string, playerId?: string): BattleAction | null {
    // End turn
    if (actionStr === 'end-turn') {
      return BattleActions.endTurn(playerId);
    }

    // Forfeit
    if (actionStr === 'forfeit') {
      return BattleActions.forfeit(playerId);
    }

    // Auto attack all
    if (actionStr === 'auto-attack-all') {
      return BattleActions.autoAttackAll(playerId);
    }

    // Play card: 'play-card-0' or 'play-card-0-target-2'
    if (actionStr.startsWith('play-card-')) {
      const parts = actionStr.substring('play-card-'.length).split('-target-');
      const cardIndex = parseInt(parts[0], 10);
      const targetIndex = parts.length > 1 ? parseInt(parts[1], 10) : undefined;

      if (isNaN(cardIndex)) return null;

      return BattleActions.playCard(cardIndex, { targetIndex, playerId });
    }

    // Attack beast: 'attack-beast-1-2' (attacker index 1, target index 2)
    if (actionStr.startsWith('attack-beast-')) {
      const parts = actionStr.substring('attack-beast-'.length).split('-');
      if (parts.length >= 2) {
        const attackerIndex = parseInt(parts[0], 10);
        const targetIndex = parseInt(parts[1], 10);

        if (isNaN(attackerIndex) || isNaN(targetIndex)) return null;

        return BattleActions.attackBeast(attackerIndex.toString(), {
          attackerIndex,
          targetIndex,
          playerId,
        });
      }
    }

    // Attack player: 'attack-player-1' (attacker index 1)
    if (actionStr.startsWith('attack-player-')) {
      const attackerIndex = parseInt(actionStr.substring('attack-player-'.length), 10);

      if (isNaN(attackerIndex)) return null;

      return BattleActions.attackPlayer(attackerIndex.toString(), {
        attackerIndex,
        playerId,
      });
    }

    // Use ability: 'use-ability-1' or 'use-ability-1-target-2'
    if (actionStr.startsWith('use-ability-')) {
      const parts = actionStr.substring('use-ability-'.length).split('-target-');
      const beastIndex = parseInt(parts[0], 10);
      const targetIndex = parts.length > 1 ? parseInt(parts[1], 10) : undefined;

      if (isNaN(beastIndex)) return null;

      return BattleActions.useAbility(beastIndex.toString(), 0, {
        beastIndex,
        targetIndex,
        playerId,
      });
    }

    // Unknown action
    console.warn(`[ActionParser] Unknown action string: ${actionStr}`);
    return null;
  }

  /**
   * Convert typed action back to legacy string format
   * Used during migration to maintain compatibility with old code.
   */
  export function actionToString(action: BattleAction): string {
    switch (action.type) {
      case 'play-card':
        if (action.targetIndex !== undefined) {
          return `play-card-${action.cardIndex}-target-${action.targetIndex}`;
        }
        return `play-card-${action.cardIndex}`;

      case 'attack-beast':
        return `attack-beast-${action.attackerIndex ?? action.attackerId}-${action.targetIndex ?? action.targetId}`;

      case 'attack-player':
        return `attack-player-${action.attackerIndex ?? action.attackerId}`;

      case 'use-ability':
        if (action.targetIndex !== undefined) {
          return `use-ability-${action.beastIndex ?? action.beastId}-target-${action.targetIndex}`;
        }
        return `use-ability-${action.beastIndex ?? action.beastId}`;

      case 'end-turn':
        return 'end-turn';

      case 'forfeit':
        return 'forfeit';

      case 'timeout':
        return 'timeout';

      case 'auto-attack-all':
        return 'auto-attack-all';

      default:
        // Exhaustiveness check
        const exhaustive: never = action;
        throw new Error(`Unknown action type: ${(exhaustive as any).type}`);
    }
  }

  /**
   * Type guard to check if an object is a valid BattleAction
   */
  export function isBattleAction(obj: any): obj is BattleAction {
    return obj && typeof obj === 'object' && typeof obj.type === 'string';
  }

  // ==================== bloombeasts\screens\battle\BattleUI.ts ====================

  /**
   * Battle UI - Manages battle state and connects missions to the battle system
   *
   * This class handles:
   * - Battle initialization and configuration
   * - Mission setup (special rules, opponent configuration)
   * - Reward calculation
   * - Progress tracking
   * - Mission objectives
   *
   * The core battle logic is handled by the generic BattleController.
   */


  export interface BattleUIState {
    mission: Mission;
    battleState: BattleState | null;
    progress: MissionRunProgress | null;
    isComplete: boolean;
    rewards: RewardResult | null;
  }

  /**
   * Convert AnyCard[] to RuntimeCard[] for opponent decks
   * Creates minimal CardInstances (level 1, 0 XP) and converts them to RuntimeCards
   */
  function convertDeckToRuntimeCards(cards: AnyCard[]): RuntimeCard[] {
    return cards.map((cardDef, index) => {
      // Create minimal CardInstance for opponent cards (level 1)
      const minimalInstance: CardInstance = {
        id: `${cardDef.id}-opp-${index}`,
        cardId: cardDef.id,
        currentXP: 0, // Level 1 (0 XP)
      };

      return createBattleCard(minimalInstance, cardDef);
    });
  }

  export class BattleUI {
    private missionManager: MissionManager;
    // private gameEngine: GameEngine;
    private async: AsyncMethods;

    // Battle system components
    private battleController: BattleController;

    // Current state
    private currentBattle: BattleUIState | null = null;
    private shouldStopAI: boolean = false;

    // Callbacks
    private renderCallback: (() => void) | null = null;

    constructor(missionManager: MissionManager, async: AsyncMethods) {
      this.missionManager = missionManager;
      this.async = async;

      // Initialize battle controller
      this.battleController = new BattleController(async);

      // Subscribe to TURBO events
      this.setupEventListeners();
    }

    /**
     * Setup TURBO event listeners
     */
    private setupEventListeners(): void {
      const game = this.battleController.getGameController();

      game.on('turnStarted', ({ playerId, turnNumber }) => {
        Logger.debug(`[BattleUI] Turn ${turnNumber} started for player ${playerId}`);
      });

      game.on('turnEnded', ({ playerId }) => {
        Logger.debug(`[BattleUI] Turn ended for player ${playerId}`);
      });

      game.on('stateChanged', () => {
        if (this.renderCallback) {
          this.renderCallback();
        }
      });
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
    initializeBattle(playerDeckCards: RuntimeCard[], playerName?: string): BattleUIState | null {
      this.shouldStopAI = false;

      const mission = this.missionManager.getCurrentMission();
      if (!mission) {
        Logger.error('No mission selected');
        return null;
      }

      // Resolve the opponent deck
      const opponentDeck = resolveDeck(mission.opponentDeck);

      // Convert opponent deck cards to RuntimeCards (level 1)
      const opponentRuntimeCards = convertDeckToRuntimeCards(opponentDeck.cards);

      // Configure opponent health (mission 1 has reduced health for tutorial)
      const opponentHealth = mission.id === 'mission-01' ? 1 : 30;
      const opponentMaxHealth = mission.id === 'mission-01' ? 1 : 30;

      // Configure battle
      const battleConfig: BattleConfig = {
        player1: {
          id: 'player',
          name: playerName ?? 'Player',  // Use player's actual name from PlayerData
          deck: playerDeckCards,
          health: 30,
          maxHealth: 30,
        },
        player2: {
          id: 'opponent',
          name: mission.name,  // Use mission name as opponent name (e.g., "Rootling")
          deck: opponentRuntimeCards,
          health: opponentHealth,
          maxHealth: opponentMaxHealth,
          isAI: true,
        },
      };

      // Initialize battle using generic battle controller
      const battle = this.battleController.initializeBattle(battleConfig);

      // Create mission-specific state
      this.currentBattle = {
        mission,
        battleState: battle,
        progress: this.missionManager.getProgress(),
        isComplete: false,
        rewards: null,
      };

      return this.currentBattle;
    }

    /**
     * Get current battle state
     */
    getCurrentBattle(): BattleUIState | null {
      return this.currentBattle;
    }

    /**
     * Helper: Get player from TURBO state (player is always index 0)
     */
    private getPlayer() {
      return this.currentBattle?.battleState?.turboState.gameData.players[0];
    }

    /**
     * Helper: Get opponent from TURBO state (opponent is always index 1)
     */
    private getOpponent() {
      return this.currentBattle?.battleState?.turboState.gameData.players[1];
    }

    /**
     * Helper: Get player field from TURBO state
     */
    private getPlayerField() {
      return this.currentBattle?.battleState?.turboState.gameData.field.player1;
    }

    /**
     * Helper: Get opponent field from TURBO state
     */
    private getOpponentField() {
      return this.currentBattle?.battleState?.turboState.gameData.field.player2;
    }

    /**
     * Process a typed player action
     */
    async processTypedAction(action: BattleAction, data?: any): Promise<void> {
      if (!this.currentBattle?.battleState) {
        Logger.error('No active battle');
        return;
      }

      const player = this.getPlayer();
      const opponent = this.getOpponent();

      if (!player || !opponent) {
        Logger.error('Invalid battle state: missing players');
        return;
      }

      let result: any = { success: false, damage: data?.damage || 0 };
      const playerId = action.playerId || 'player';

      // Process based on action type
      switch (action.type) {
        case 'play-card': {
          // Get the card from player's hand
          const card = player.hand[action.cardIndex];
          if (card) {
            // Use the card's id property
            const cardId = action.cardId || (card as any).id || (card as any).name || action.cardIndex.toString();

            // For Beast and Buff cards, find an empty position if not specified
            let position = action.position || action.targetIndex;
            if (position === undefined) {
              const playerField = this.getPlayerField();
              if (playerField) {
                if (card.type === CardType.Beast) {
                  // Find the first empty beast slot
                  for (let i = 0; i < 3; i++) {
                    if (!playerField.beasts[i]) {
                      position = i;
                      break;
                    }
                  }
                } else if (card.type === CardType.Buff) {
                  // Find the first empty buff slot
                  for (let i = 0; i < 3; i++) {
                    if (!playerField.buffs[i]) {
                      position = i;
                      break;
                    }
                  }
                }
              }
            }

            result.success = this.battleController.playCard(cardId, playerId, position);
          }
          break;
        }

        case 'use-ability': {
          const beastIndex = action.beastIndex;
          if (beastIndex !== undefined) {
            const playerField = this.getPlayerField();
            const beast = playerField?.beasts[beastIndex];
            if (beast) {
              const beastId = action.beastId || (beast as any).id || (beast as any).instanceId || beastIndex.toString();
              result.success = this.battleController.useAbility(beastId, null, playerId);
            }
          }
          break;
        }

        case 'auto-attack-all': {
          result = await this.autoAttackAll(player, opponent, data?.onAttackAnimation);
          break;
        }

        case 'attack-beast': {
          const attackerIndex = action.attackerIndex;
          const targetIndex = action.targetIndex;
          if (attackerIndex !== undefined && targetIndex !== undefined) {
            const playerField = this.getPlayerField();
            const opponentField = this.getOpponentField();
            const attacker = playerField?.beasts[attackerIndex];
            const target = opponentField?.beasts[targetIndex];
            if (attacker && target) {
              const attackerId = action.attackerId || (attacker as any).id || (attacker as any).instanceId || attackerIndex.toString();
              const targetId = action.targetId || (target as any).id || (target as any).instanceId || targetIndex.toString();
              result.success = this.battleController.attackBeast(attackerId, targetId, playerId);
            }
          }
          break;
        }

        case 'attack-player': {
          const attackerIndex = action.attackerIndex;
          if (attackerIndex !== undefined) {
            const playerField = this.getPlayerField();
            const attacker = playerField?.beasts[attackerIndex];
            if (attacker) {
              const attackerId = action.attackerId || (attacker as any).id || (attacker as any).instanceId || attackerIndex.toString();
              result.success = this.battleController.attackPlayer(attackerId, playerId);
            }
          }
          break;
        }

        case 'end-turn': {
          result = await this.endPlayerTurn();
          break;
        }

        case 'forfeit': {
          // Process forfeit action through TURBO
          const turboResult = this.battleController.getGameController().performAction({
            type: 'game_action',
            playerId,
            data: { type: 'forfeit' as any }, // BloomBeastsActionType.FORFEIT
          });
          result.success = turboResult.success;
          break;
        }

        case 'timeout': {
          // Process timeout action through TURBO
          // Action is executed by current player, but marks who actually timed out
          const turboResult = this.battleController.getGameController().performAction({
            type: 'game_action',
            playerId,
            data: {
              type: 'timeout' as any, // BloomBeastsActionType.TIMEOUT
              timedOutPlayerId: action.timedOutPlayerId || playerId
            },
          });
          result.success = turboResult.success;
          break;
        }

        default: {
          Logger.warn(`[BattleUI] Unknown action type: ${(action as any).type}`);
        }
      }

      // Sync state from BattleController immediately after action
      const updatedBattle = this.battleController.getCurrentBattle();
      if (updatedBattle && this.currentBattle) {
        this.currentBattle.battleState = updatedBattle;
      }

      // Update mission progress
      this.updateMissionProgress(action, result);

      // Check for battle end with the freshly synced state
      const battleResult = this.battleController.checkBattleEnd();
      if (battleResult) {
        this.endBattle();
      }
    }

    /**
     * Auto-attack with all beasts
     */
    private async autoAttackAll(
      player: BloomBeastsPlayer,
      opponent: BloomBeastsPlayer,
      onAttackAnimation?: (attackerIndex: number, targetType: 'beast' | 'health', targetIndex?: number) => Promise<void>
    ): Promise<any> {
      let anyAttackSucceeded = false;
      const results: any[] = [];
      const playerId = 'player';

      const playerField = this.getPlayerField();
      const opponentField = this.getOpponentField();

      if (!playerField || !opponentField) {
        return {
          success: false,
          results: [],
          message: 'Field data not available'
        };
      }

      for (let i = 0; i < 3; i++) {
        const attackerBeast = playerField.beasts[i];
        if (!attackerBeast || attackerBeast.summoningSickness) continue;

        const opposingBeast = opponentField.beasts[i];
        let success = false;

        if (opposingBeast) {
          if (onAttackAnimation) await onAttackAnimation(i, 'beast', i);
          const attackerId = (attackerBeast as any).id || (attackerBeast as any).instanceId || i.toString();
          const targetId = (opposingBeast as any).id || (opposingBeast as any).instanceId || i.toString();
          success = this.battleController.attackBeast(attackerId, targetId, playerId);
        } else {
          if (onAttackAnimation) await onAttackAnimation(i, 'health');
          const attackerId = (attackerBeast as any).id || (attackerBeast as any).instanceId || i.toString();
          success = this.battleController.attackPlayer(attackerId, playerId);
        }

        results.push({ success });
        if (success) anyAttackSucceeded = true;

        const battleResult = this.battleController.checkBattleEnd();
        if (battleResult) break;
      }

      return {
        success: anyAttackSucceeded,
        results: results,
        message: anyAttackSucceeded ? 'Auto-attack completed' : 'No attacks could be performed'
      };
    }

    /**
     * End player's turn and start opponent's turn
     */
    private async endPlayerTurn(): Promise<any> {
      Logger.info('[BattleUI] endPlayerTurn called');
      if (!this.currentBattle?.battleState) {
        Logger.warn('[BattleUI] No current battle for endPlayerTurn');
        return { success: false };
      }

      // Check if battle is already complete (e.g., player just won)
      if (this.currentBattle.isComplete) {
        Logger.info('[BattleUI] Battle is already complete');
        return { success: false };
      }

      // Check if battle has ended before processing end-of-turn
      const battleResultBeforeTurn = this.battleController.checkBattleEnd();
      if (battleResultBeforeTurn) {
        Logger.info('[BattleUI] Battle ended before turn could end');
        return { success: false };
      }

      // End player turn using BattleController
      Logger.info('[BattleUI] Ending player turn via BattleController');
      this.battleController.endTurn('player');

      // Update the local game state immediately after turn change
      const stateAfterTurnEnd = this.battleController.getCurrentBattle();
      if (stateAfterTurnEnd) {
        this.currentBattle.battleState = stateAfterTurnEnd;
        Logger.info('[BattleUI] Updated local battle state after turn end');
        // Trigger render to update UI with new turn
        if (this.renderCallback) this.renderCallback();
      }

      // Process opponent AI turn
      Logger.info('[BattleUI] Now processing opponent turn');
      await this.processOpponentTurn();

      // Update the local game state again after AI turn
      const battleState = this.battleController.getCurrentBattle();
      if (battleState) {
        this.currentBattle.battleState = battleState;
        Logger.info('[BattleUI] Updated local battle state after AI turn');
        // Trigger render to update UI to show player's turn
        if (this.renderCallback) this.renderCallback();
      }

      return { success: true };
    }

    /**
     * Process opponent's AI turn
     */
    private async processOpponentTurn(): Promise<void> {
      Logger.info('[BattleUI] Processing opponent turn');
      if (!this.currentBattle?.battleState) {
        Logger.warn('[BattleUI] No current battle state for opponent turn');
        return;
      }

      // Helper function for delays
      const delay = (ms: number) => new Promise(resolve => this.async.setTimeout(resolve, ms));

      try {
        // Check if it's actually an AI player's turn
        if (!this.battleController.isAIPlayerTurn()) {
          Logger.info('[BattleUI] Current player is not AI, skipping AI turn');
          return;
        }

        // Small delay before AI starts for better UX
        await delay(500);
        if (this.shouldStopAI) return;

        // Execute AI turn using BattleController
        // The TURBO system will handle all the turn mechanics
        // Pass callback to update UI after each AI action
        Logger.info('[BattleUI] Executing AI turn');
        await this.battleController.executeAITurn(() => {
          // Update display after each AI action for smoother UX and timer updates
          const updatedState = this.battleController.getCurrentBattle();
          if (updatedState) {
            // this.currentBattle.battleState = updatedState;
            if (this.renderCallback) this.renderCallback();
          }
        });
        Logger.info('[BattleUI] AI turn completed');

        // Final update after AI completes
        const updatedState = this.battleController.getCurrentBattle();
        if (updatedState) {
          this.currentBattle.battleState = updatedState;
          if (this.renderCallback) this.renderCallback();
        }
      } catch (error) {
        Logger.error('[BattleUI] Failed to process opponent turn:', error);
      }
    }

    /**
     * Update mission progress based on action
     */
    private updateMissionProgress(action: BattleAction, result: any): void {
      if (!this.currentBattle) return;

      const player = this.getPlayer();
      const opponent = this.getOpponent();
      if (!player || !opponent) return;

      // Update health values in mission progress
      this.missionManager.updateProgress('health-update', {
        playerHealth: player.health,
        opponentHealth: opponent.health
      });

      // Check if opponent is defeated
      if (opponent.health <= 0) {
        console.log('[BattleUI] Opponent defeated! Updating mission progress.');
        this.missionManager.updateProgress('opponent-defeated', {});
      }

      // Track other actions
      if (action.type === 'play-card') {
        this.missionManager.updateProgress('beast-summoned', {});
      }
    }

    /**
     * End the battle and calculate rewards
     */
    private endBattle(): void {
      if (!this.currentBattle) {
        console.log('[BattleUI] endBattle called but no current battle');
        return;
      }

      // Prevent multiple calls
      if (this.currentBattle.isComplete) {
        console.log('[BattleUI] Battle already completed, ignoring duplicate endBattle call');
        return;
      }

      const battleResult = this.battleController.checkBattleEnd();
      if (!battleResult) {
        console.log('[BattleUI] endBattle called but battle not ended yet');
        return;
      }

      console.log(`[BattleUI] Battle ending. Winner: ${battleResult.winner}, P1 HP: ${battleResult.player1Health}, P2 HP: ${battleResult.player2Health}`);
      Logger.info(`[BattleUI] Battle ending. Winner: ${battleResult.winner}, P1 HP: ${battleResult.player1Health}, P2 HP: ${battleResult.player2Health}`);

      this.shouldStopAI = true;
      this.currentBattle.isComplete = true;

      // Calculate rewards based on winner
      if (battleResult.winner === 'player1') {
        // Player won!
        console.log('[BattleUI] Player 1 (YOU) won! Awarding rewards.');
        Logger.info('[BattleUI] Player 1 won! Awarding rewards.');
        this.currentBattle.rewards = this.missionManager.completeMission();
        this.battleController.completeBattle('player1');
      } else if (battleResult.winner === 'player2') {
        // Player lost
        console.log('[BattleUI] Player 2 (OPPONENT) won! No rewards.');
        Logger.info('[BattleUI] Player 2 won! No rewards.');
        this.currentBattle.rewards = null;
        this.battleController.completeBattle('player2');
      } else {
        // Tie (both died) - treat as loss for now
        console.log('[BattleUI] Tie (both died)! No rewards.');
        Logger.info('[BattleUI] Tie! No rewards.');
        this.currentBattle.rewards = null;
        this.battleController.completeBattle(null);
      }

      console.log(`[BattleUI] Battle ended. Rewards set: ${this.currentBattle.rewards !== null}, Rewards object:`, this.currentBattle.rewards);
      Logger.info(`[BattleUI] Battle ended. Rewards set: ${this.currentBattle.rewards !== null}`);
    }

    /**
     * Stop AI processing (when battle ends or is forfeit)
     */
    stopAI(): void {
      this.shouldStopAI = true;
    }

    /**
     * Clean up resources
     */
    dispose(): void {
      this.stopAI();
      this.battleController.dispose();
      this.currentBattle = null;
    }
  }

  // ==================== bloombeasts\BloomBeastsGame.ts ====================

  /**
   * BloomBeastsGame - Unified Game Controller
   *
   * This is the main entry point for the game that works across all platforms (web, horizon).
   * Platform-specific code should be minimal - just implement the PlatformConfig callbacks.
   *
   * The game is fully platform-agnostic - it doesn't even import UI methods directly,
   * but receives them from the platform configuration.
   */


  /**
   * XP thresholds for player leveling (cumulative)
   * Formula: XP = 100 * (2.0 ^ (level - 1))
   */
  const XP_THRESHOLDS = [
    0,      // Level 1
    100,    // Level 2: 100 XP
    300,    // Level 3: 300 XP total
    700,    // Level 4: 700 XP total
    1500,   // Level 5: 1500 XP total
    3100,   // Level 6: 3100 XP total
    6300,   // Level 7: 6300 XP total
    12700,  // Level 8: 12700 XP total
    25500,  // Level 9: 25500 XP total
  ];

  /**
   * Calculate player level from total XP (derived data)
   */
  function getPlayerLevel(totalXP: number): number {
    for (let level = 9; level >= 1; level--) {
      if (totalXP >= XP_THRESHOLDS[level - 1]) {
        return level;
      }
    }
    return 1;
  }

  // UINode type - represents a UI node returned by UI components
  export type UINode = any;

  /**
   * Read-only binding interface (for derived bindings)
   */
  export interface ReadonlyBindingInterface<T> {
    get(): T;
    subscribe(callback: () => void): void;
  }

  /**
   * Binding interface - platform-agnostic reactive data binding
   * Each platform provides its own implementation
   */
  export interface BindingInterface<T> {
    get(): T;
    set(value: T): void;
    subscribe(callback: () => void): void;
    derive<U>(fn: (value: T) => U): ReadonlyBindingInterface<U>;
  }

  /**
   * Binding constructor type
   */
  export type BindingConstructor = {
    new <T>(value: T): BindingInterface<T>;
    derive<T extends any[], R>(
      bindings: any[],
      deriveFn: (...values: T) => R
    ): ReadonlyBindingInterface<R>;
  };

  /**
   * Style properties - platform-agnostic style definitions
   * These match Horizon's styling but work on web too
   */
  export interface StyleProps {
    width?: number;
    height?: number;
    backgroundColor?: string;
    borderRadius?: number;
    padding?: number;
    margin?: number;
    flexDirection?: 'row' | 'column';
    justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
    alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
    position?: 'relative' | 'absolute';
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
    opacity?: number;
    // Add more as needed
  }

  /**
   * Common props for all UI components
   */
  export interface BaseUIProps {
    style?: StyleProps;
    children?: UINode | UINode[];
  }

  /**
   * View component props
   */
  export interface ViewProps extends BaseUIProps {}

  /**
   * Text component props
   */
  export interface TextProps extends BaseUIProps {
    text?: string;
    fontSize?: number;
    fontWeight?: 'normal' | 'bold';
    color?: string;
    textAlign?: 'left' | 'center' | 'right';
  }

  /**
   * Image component props
   */
  export interface ImageProps extends BaseUIProps {
    imageId?: string | any; // Single image asset ID (or binding)
    binding?: any; // BaseBinding<string> for animations, derived values, etc.
    width?: number;
    height?: number;
  }

  /**
   * Pressable (button) component props
   */
  export interface PressableProps extends BaseUIProps {
    onPress?: () => void;
    id?: string;
  }

  /**
   * Platform-specific UI method mappings
   * Each platform provides its own implementation of these methods
   * Screens receive this object and use it to create UI elements
   */
  export interface UIMethodMappings {
    // Core UI components
    View: (props: any) => any;
    Text: (props: any) => any;
    Image: (props: any) => any;
    Pressable: (props: any) => any;
    ScrollView?: (props: any) => any;

    // UINode utilities for conditional rendering
    // Matches Horizon's actual signature
    UINode?: any;

    // Centralized binding manager - ONLY way to create/access bindings
    bindingManager: BindingManager;

    // Platform-specific helpers
    assetIdToImageSource?: (assetId: string) => any; // Convert asset ID to ImageSource (Horizon) or string (Web)
  }

  /**
   * Player item in inventory
   */
  export interface PlayerItem {
    itemId: string;
    quantity: number;
  }

  /**
   * Player data structure - persisted to platform storage
   * This is the canonical save data format
   *
   * Note: Player level is derived from totalXP and not stored directly
   */
  export interface PlayerData {
    // Identity and progression
    name: string;
    totalXP: number; // Level is derived from this via getPlayerLevel()

    // Currency
    coins: number;

    // Card collection and deck (SINGLE SOURCE OF TRUTH)
    cards: {
      collected: CardInstance[]; // All owned card instances
      deck: string[]; // Card instance IDs in player's deck
    };

    // Mission tracking
    missions: {
      completedMissions: { [missionId: string]: number }; // Mission ID -> completion count
    };

    // Item inventory (only special items like serums)
    items: PlayerItem[];

    // Boost upgrades (0-6 levels per boost)
    boosts: {
      [boostId: string]: number; // Boost ID -> upgrade level (0-6)
    };

    // UI preferences (not persisted on all platforms)
    settings?: SoundSettings;
  }

  /**
   * Platform configuration - implement these callbacks for your platform
   *
   * TypeScript ensures ALL assets from the catalog are provided!
   *
   * Example for Web:
   * {
   *   setPlayerData: (data) => localStorage.setItem('playerData', JSON.stringify(data)),
   *   getPlayerData: () => JSON.parse(localStorage.getItem('playerData') || 'null'),
   *   imageAssets: {
   *     [ImageAssetIds.CARD_ROOTLING]: '/shared/images/cards/Forest/Rootling.png',
   *     [ImageAssetIds.CARD_EMBERLING]: '/shared/images/cards/Fire/Emberling.png',
   *     // ... TypeScript enforces all assets are provided!
   *   },
   *   soundAssets: {
   *     [SoundAssetIds.MUSIC_BACKGROUND]: '/shared/sounds/BackgroundMusic.mp3',
   *     // ... TypeScript enforces all assets are provided!
   *   },
   *   getUIMethodMappings: () => ({ View, Text, Image, Pressable, Binding }),
   *   render: (uiNode) => renderer.render(uiNode)
   * }
   *
   * Example for Horizon:
   * {
   *   setPlayerData: (data) => persistentVar.set(data),
   *   getPlayerData: () => persistentVar.get(),
   *   imageAssets: {
   *     [ImageAssetIds.CARD_ROOTLING]: ImageSource.fromTextureAsset(new hz.Asset(BigInt('123'))),
   *     [ImageAssetIds.CARD_EMBERLING]: ImageSource.fromTextureAsset(new hz.Asset(BigInt('456'))),
   *     // ... TypeScript enforces all assets are provided!
   *   },
   *   soundAssets: {
   *     [SoundAssetIds.MUSIC_BACKGROUND]: new hz.Asset(BigInt('789')),
   *     // ... TypeScript enforces all assets are provided!
   *   },
   *   getUIMethodMappings: () => ({ View: hz.View, Text: hz.Text, ... }),
   *   render: (uiNode) => horizonComponent.update(uiNode)
   * }
   */
  export interface PlatformConfig {
    /**
     * Save player data to persistent storage
     * For web: localStorage
     * For horizon: Persistent Variables API
     */
    setPlayerData: (data: PlayerData) => void;

    /**
     * Load player data from persistent storage
     * Platform must ensure valid PlayerData is returned (create default if none exists)
     */
    getPlayerData: () => PlayerData | null;

    /**
     * Get an image asset by ID
     * Platform queries AssetCatalogManager and returns the asset in platform format
     *
     * For web: Returns string path from catalog (e.g., '/assets/cards/fire/beast.png')
     * For horizon: Converts catalog horizonAssetId to ImageSource object
     */
    getImageAsset: (assetId: string) => any;

    /**
     * Asset catalog manager instance
     * Provides access to all game asset metadata and card definitions
     */
    catalogManager: any; // AssetCatalogManager instance

    /**
     * Get platform-specific UI method implementations
     *
     * For web: Returns web-specific View, Text, Image, Pressable
     * For horizon: Returns hz.View, hz.Text, hz.Image, hz.Pressable
     */
    getUIMethodMappings: () => UIMethodMappings;

    /**
     * Platform-specific async methods (setTimeout, setInterval, etc.)
     *
     * For web: Standard window.setTimeout, window.setInterval, etc.
     * For horizon: component.async.setTimeout, component.async.setInterval, etc.
     */
    async: AsyncMethods;

    /**
     * Render the UI tree
     * Called whenever the UI needs to be updated
     *
     * For web: renderer.render(uiNode)
     * For horizon: component.update(uiNode) or similar
     */
    render: (uiNode: UINode) => void;

    /**
     * Audio callbacks (optional)
     * Implement if your platform supports audio
     */
    playSound?: (assetId: string, loop: boolean, volume: number) => void;
    stopSound?: (assetId?: string) => void;
    setMusicVolume?: (volume: number) => void;
    setSfxVolume?: (volume: number) => void;
    setMusicEnabled?: (enabled: boolean) => void;
    setSfxEnabled?: (enabled: boolean) => void;

    /**
     * World Variables (optional)
     * Implement if your platform supports world variables (e.g., Horizon)
     *
     * For Horizon: Use world.getVariable() and world.setVariable()
     * For web: Use mock data or skip
     */
    getWorldVariable?: (variableGroup: string, variableName: string) => any;
    setWorldVariable?: (variableGroup: string, variableName: string, value: any) => void;

    /**
     * Network Events (optional)
     * Implement if your platform supports network events (e.g., Horizon)
     *
     * For Horizon: Use world.sendNetworkEvent()
     * For web: Use mock/skip
     */
    sendNetworkEvent?: (eventName: string, data: any) => void;
  }

  /**
   * Main game class - handles all game logic and UI orchestration
   */
  export class BloomBeastsGame {
    // Platform configuration
    private platform: PlatformConfig;

    // Platform-specific UI methods
    private UI: UIMethodMappings;

    // Platform-specific async methods
    private asyncMethods: AsyncMethods;

    // Platform-provided asset getters
    private platformGetImageAsset: (assetId: string) => any;

    // Core game systems
    private missionManager: MissionManager;
    private missionUI: MissionSelectionUI;
    private battleUI: BattleUI;

    // Sound and display state
    private currentMusic: string | null = null;
    private battleDisplayManager: BattleDisplayManager;

    // Player data state - SINGLE SOURCE OF TRUTH (no duplicates!)
    // Starts as null to indicate data hasn't loaded yet (prevents race conditions)
    private playerData: PlayerData | null = null;

    // Game state
    private isInitializing: boolean = true;  // Prevent renders during initialization
    private currentBattleId: string | null = null;
    private battleStartTime: number | null = null;  // Track battle start time for leaderboard


    // Screen instances
    private menuScreen: MenuScreen;
    private cardsScreen: CardsScreen;
    private upgradeScreen: UpgradeScreen;
    private missionScreen: MissionScreen;
    private battleScreen: BattleScreen;
    private settingsScreen: SettingsScreen;
    private leaderboardScreen: LeaderboardScreen;

    // UI tree (created once, updated reactively)
    // Public so platform wrappers can access it (needed for Horizon's initializeUI)
    public uiTree: UINode | null = null;

    constructor(config: PlatformConfig) {
      this.platform = config;

      // Get platform-specific async methods
      this.asyncMethods = config.async;

      // Store platform-provided asset getters
      this.platformGetImageAsset = config.getImageAsset;

      // Initialize card utils and deck builder with catalog manager
      setCatalogManagerForUtils(config.catalogManager);
      setCatalogManagerForDeckBuilder(config.catalogManager);

      // Initialize core systems
      this.missionManager = new MissionManager(config.catalogManager);
      this.missionUI = new MissionSelectionUI(this.missionManager);
      this.battleUI = new BattleUI(this.missionManager, this.asyncMethods);
      this.battleDisplayManager = new BattleDisplayManager(config.catalogManager);

      // Get platform-specific UI methods and add bindingManager to them
      this.UI = config.getUIMethodMappings() as UIMethodMappings;

      // Create screen instances (pass UI methods and playerData binding)
      this.menuScreen = new MenuScreen({
        ui: this.UI,
        onButtonClick: this.handleButtonClick.bind(this),
        onNavigate: this.navigate.bind(this),
        onRenderNeeded: this.triggerRender.bind(this),
        playSfx: this.playSfx.bind(this)
      });

      this.cardsScreen = new CardsScreen({
        ui: this.UI,
        onCardSelect: this.handleCardSelect.bind(this),
        onNavigate: this.navigate.bind(this),
        onRenderNeeded: this.triggerRender.bind(this),
        playSfx: this.playSfx.bind(this)
      });

      this.upgradeScreen = new UpgradeScreen({
        ui: this.UI,
        onNavigate: this.navigate.bind(this),
        onUpgrade: this.handleUpgrade.bind(this),
        onRenderNeeded: this.triggerRender.bind(this),
        playSfx: this.playSfx.bind(this)
      });

      this.missionScreen = new MissionScreen({
        ui: this.UI,
        onMissionSelect: this.handleMissionSelect.bind(this),
        onNavigate: this.navigate.bind(this),
        onRenderNeeded: this.triggerRender.bind(this),
        playSfx: this.playSfx.bind(this)
      });

      this.battleScreen = new BattleScreen({
        ui: this.UI,
        async: this.asyncMethods,
        onAction: this.handleBattleAction.bind(this),
        onNavigate: this.navigate.bind(this),
        onRenderNeeded: this.triggerRender.bind(this),
        onShowCardDetail: this.showCardDetailPopup.bind(this),
        playSfx: this.playSfx.bind(this)
      });

      this.settingsScreen = new SettingsScreen({
        ui: this.UI,
        onSettingChange: this.handleSettingsChange.bind(this),
        onNavigate: this.navigate.bind(this),
        onRenderNeeded: this.triggerRender.bind(this),
        playSfx: this.playSfx.bind(this)
      });

      this.leaderboardScreen = new LeaderboardScreen({
        ui: this.UI,
        onNavigate: this.navigate.bind(this),
        playSfx: this.playSfx.bind(this)
      });

      // All screens are now created, enable rendering
      this.isInitializing = false;

      // Create UI tree once (it's reactive via bindings)
      this.uiTree = this.createUI();
    }

    /**
     * Get an image asset by ID
     * Delegates to platform-specific implementation
     */
    getImageAsset(assetId: string): any {
      return this.platformGetImageAsset(assetId);
    }

    /**
     * Get platform async methods (setTimeout, setInterval, etc.)
     * Screens can use this to access platform-specific async operations
     */
    get async(): AsyncMethods {
      return this.asyncMethods;
    }

    /**
     * Initialize the game
     * Call this after construction to load data and show initial screen
     */
    async initialize(): Promise<void> {
      // Load saved game data (initializes starting cards if needed)
      await this.loadGameData();

      // Update bindings from loaded data
      await this.updateBindingsFromGameState();

      // Trigger initial render
      this.triggerRender();

      // Start menu music
      this.playMusic('music-background', true);
      this.navigate('menu');
    }

    /**
     * Get current player level (derived from totalXP)
     */
    private get playerLevel(): number {
      return getPlayerLevel(this.playerData?.totalXP ?? 0);
    }

    /**
     * Load game data from platform storage
     * Platform is responsible for creating default data if none exists
     */
    private async loadGameData(): Promise<void> {
      const savedData = this.platform.getPlayerData?.();

      if (!savedData || Object.keys(savedData).length === 0) {
        throw new Error('Platform must provide valid PlayerData (either loaded or newly created)');
      }

      // Use platform-provided data directly
      this.playerData = savedData;
      Logger.info(`[BloomBeastsGame] Loaded player data for "${this.playerData.name}" with ${savedData.cards.collected.length} cards`);

      Logger.info(`[BloomBeastsGame] Restored deck with ${this.playerData.cards.deck.length} cards`);

      // Apply sound settings to platform
      if (this.playerData.settings) {
        this.platform.setMusicVolume?.(this.playerData.settings!.musicVolume / 100);
        this.platform.setSfxVolume?.(this.playerData.settings!.sfxVolume / 100);
        this.platform.setMusicEnabled?.(this.playerData.settings!.musicEnabled);
        this.platform.setSfxEnabled?.(this.playerData.settings!.sfxEnabled);
      }

      // Load completed missions into MissionManager
      this.missionManager.loadCompletedMissions(this.playerData.missions.completedMissions);

      // Initialize starting cards if collection is empty
      if (this.playerData.cards.collected.length === 0) {
        Logger.info('[BloomBeastsGame] Initializing starting card collection');
        await this.initializeStartingCollection();
      }

      // Save to ensure data persists
      await this.saveGameData();
    }

    /**
     * Save game data to platform storage
     */
    private async saveGameData(): Promise<void> {
      if (!this.playerData) {
        Logger.warn('[BloomBeastsGame] Cannot save null player data');
        return;
      }
      this.platform.setPlayerData?.(this.playerData);
      Logger.debug('[BloomBeastsGame] Player data saved');
    }

    /**
     * Play background music
     */
    private playMusic(musicId: string, loop: boolean = true): void {
      // Don't restart music if it's already playing
      if (this.currentMusic === musicId) {
        return;
      }

      this.currentMusic = musicId;

      if (this.playerData?.settings?.musicEnabled) {
        const volume = this.playerData.settings.musicVolume / 100;
        this.platform.playSound?.(musicId, loop, volume);
      }
    }

    /**
     * Stop background music
     */
    private stopMusic(): void {
      this.currentMusic = null;
      this.platform.stopSound?.();
    }

    /**
     * Play sound effect
     */
    private playSfx(sfxId: string): void {
      if (this.playerData?.settings?.sfxEnabled) {
        const volume = this.playerData.settings.sfxVolume / 100;
        this.platform.playSound?.(sfxId, false, volume);
      }
    }

    /**
     * Set music volume (0-100)
     */
    private setMusicVolume(volume: number): void {
      if (!this.playerData?.settings) return;
      this.playerData.settings.musicVolume = Math.max(0, Math.min(100, volume));
      if (this.playerData.settings.musicEnabled) {
        this.platform.setMusicVolume?.(this.playerData.settings.musicVolume / 100);
      }
    }

    /**
     * Set SFX volume (0-100)
     */
    private setSfxVolume(volume: number): void {
      if (!this.playerData?.settings) return;
      this.playerData.settings.sfxVolume = Math.max(0, Math.min(100, volume));
      if (this.playerData.settings.sfxEnabled) {
        this.platform.setSfxVolume?.(this.playerData.settings.sfxVolume / 100);
      }
    }

    /**
     * Toggle music on/off
     */
    private toggleMusic(enabled: boolean): void {
      if (!this.playerData?.settings) return;
      this.playerData.settings.musicEnabled = enabled;

      // Notify platform
      this.platform.setMusicEnabled?.(enabled);

      if (enabled && this.currentMusic) {
        // Resume music - force replay even if it's the same track
        const musicToResume = this.currentMusic;
        const volume = this.playerData.settings.musicVolume / 100;
        this.platform.playSound?.(musicToResume, true, volume);
      } else if (!enabled) {
        // Stop music playback but keep track of current music for resume
        // Don't call stopMusic() as it clears this.currentMusic
        this.platform.stopSound?.();
      }
    }

    /**
     * Toggle SFX on/off
     */
    private toggleSfx(enabled: boolean): void {
      if (!this.playerData?.settings) return;
      this.playerData.settings.sfxEnabled = enabled;

      // Notify platform
      this.platform.setSfxEnabled?.(enabled);
    }

    /**
     * Add XP to player (level is automatically derived)
     */
    private addXP(amount: number): void {
      if (!this.playerData) return;
      this.playerData.totalXP += amount;
      Logger.debug(`[BloomBeastsGame] Added ${amount} XP (total: ${this.playerData.totalXP}, level: ${this.playerLevel})`);

      // Submit experience to leaderboard
      this.submitLeaderboardScore('experience', this.playerData.totalXP);
    }

    /**
     * Get the quantity of a specific item from player's items array
     */
    private getItemQuantity(itemId: string): number {
      if (!this.playerData) return 0;
      const item = this.playerData.items.find(i => i.itemId === itemId);
      return item ? item.quantity : 0;
    }

    /**
     * Track mission completion
     */
    private trackMissionCompletion(missionId: string): void {
      if (!this.playerData) return;
      const currentCount = this.playerData.missions.completedMissions[missionId] || 0;
      this.playerData.missions.completedMissions[missionId] = currentCount + 1;
      Logger.debug(`[BloomBeastsGame] Mission ${missionId} completed ${currentCount + 1} times`);
    }

    /**
     * Add items to player's inventory
     */
    private addItems(itemId: string, quantity: number): void {
      if (!this.playerData) return;
      const existingItem = this.playerData.items.find(i => i.itemId === itemId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.playerData.items.push({
          itemId,
          quantity,
        });
      }
      Logger.debug(`[BloomBeastsGame] Added ${quantity}x ${itemId} to inventory`);
    }

    /**
     * Initialize a new game with starter cards
     */
    private async initializeStartingCollection(): Promise<void> {
      if (!this.playerData) return;

      // Get starter deck cards from deck builder
      const starterDeckList = getStarterDeck('Forest');
      const starterCards = starterDeckList.cards;

      Logger.info(`[BloomBeastsGame] Initializing starter deck: ${starterDeckList.name} with ${starterCards.length} cards`);

      // Create card instances and add to collection and deck
      starterCards.forEach((card: any, index: number) => {
        const instanceId = `${card.id}-${Date.now()}-${index}`;

        // Create minimal card instance
        const cardInstance: CardInstance = {
          id: instanceId,
          cardId: card.id,
          currentXP: 0, // Start at 0 XP (level 1)
        };

        this.playerData!.cards.collected.push(cardInstance);
        this.playerData!.cards.deck.push(cardInstance.id);
      });

      Logger.info(`[BloomBeastsGame] Starter deck initialized with ${this.playerData.cards.deck.length} cards in deck and ${this.playerData.cards.collected.length} cards collected`);

      await this.saveGameData();
    }

    /**
     * Update bindings from current game state
     * This syncs the UI bindings with the actual game state
     */
    private async updateBindingsFromGameState(): Promise<void> {
      // Update player data binding (screens derive what they need from this)
      this.UI.bindingManager.setBinding(BindingType.PlayerData, this.playerData);

      // Update missions binding (still separate as it includes availability logic)
      this.missionUI.setPlayerLevel(this.playerLevel);
      const missionList = this.missionUI.getMissionList();
      const displayMissions: MissionDisplay[] = missionList.map(m => ({
        id: m.mission.id,
        name: m.mission.name,
        level: m.mission.level,
        difficulty: m.mission.difficulty,
        isAvailable: m.isAvailable,
        isCompleted: m.completionCount > 0,
        description: m.mission.description,
        affinity: m.mission.affinity,
        beastId: m.mission.beastId,
      }));

      this.UI.bindingManager.setBinding(BindingType.Missions, displayMissions);
    }

    /**
     * Navigate to a different screen
     */
    private navigate(screen: string): void {
      this.UI.bindingManager.setBinding(BindingType.CurrentScreen, screen);

      // Load leaderboard data when navigating to leaderboard screen
      if (screen === 'leaderboard') {
        this.loadLeaderboardData();
      }

      this.triggerRender();
    }

    /**
     * Trigger a render
     * Notifies the platform to render (bindings update automatically)
     */
    private triggerRender(): void {
      // Skip rendering during initialization to prevent errors
      if (this.isInitializing) {
        return;
      }

      // Just notify platform - UI tree is reactive via bindings
      // No need to recreate the entire tree!
      this.platform.render(this.uiTree);
    }

    /**
     * Handle button clicks
     */
    private async handleButtonClick(buttonId: string): Promise<void> {
      // Play button sound
      this.playSfx('sfx-menu-button-select');

      // Handle navigation buttons
      switch (buttonId) {
        case 'play':
        case 'btn-missions':
          this.navigate('missions');
          break;
        case 'cards':
        case 'btn-cards':
          this.navigate('cards');
          break;
        case 'upgrades':
        case 'btn-upgrades':
          this.navigate('upgrades');
          break;
        case 'missions':
          this.navigate('missions');
          break;
        case 'settings':
        case 'btn-settings':
          this.navigate('settings');
          break;
        case 'shop':
          break;
        case 'btn-back':
          this.navigate('menu');
          break;
        case 'forfeit':
          // Show forfeit confirmation popup
          this.showForfeitConfirmation();
          break;
        default:
      }
    }

    /**
     * Show forfeit confirmation popup
     */
    private showForfeitConfirmation(): void {
      this.UI.bindingManager.setBinding(BindingType.ForfeitPopup, {
        title: 'Are you sure?',
        message: 'You will lose this battle.',
        buttons: [
          {
            text: 'Yes',
            onClick: () => {
              this.handleForfeit();
            },
            color: 'red',
          },
          {
            text: 'No',
            onClick: () => {
              this.UI.bindingManager.setBinding(BindingType.ForfeitPopup, null);
              this.triggerRender();
            },
            color: 'default',
          },
        ],
        playSfx: this.playSfx.bind(this),
      });
      this.triggerRender();
    }

    /**
     * Show card detail popup for a duration, then close and execute callback
     */
    private showCardDetailPopup(card: any, durationMs: number, callback?: () => void): void {
      // Set the card detail popup
      this.UI.bindingManager.setBinding(BindingType.CardDetailPopup, {
        cardDetail: {
          card: card,
          stats: null,
        },
        onButtonClick: () => {
          // Close button clicked
          this.UI.bindingManager.setBinding(BindingType.CardDetailPopup, null);
          this.triggerRender();
        },
        playSfx: this.playSfx.bind(this),
        hideBackdrop: true, // Hide backdrop for played card popups
      });
      this.triggerRender();

      // After duration, close the popup and execute callback
      this.asyncMethods.setTimeout(() => {
        this.UI.bindingManager.setBinding(BindingType.CardDetailPopup, null);
        this.triggerRender();
        callback?.();
      }, durationMs);
    }

    /**
     * Handle forfeit - player gives up
     */
    private async handleForfeit(): Promise<void> {
      // Close popup
      this.UI.bindingManager.setBinding(BindingType.ForfeitPopup, null);
      this.triggerRender();

      // Play lose sound
      this.playSfx('sfx-lose');

      // Process FORFEIT action through TURBO instead of manual state manipulation
      if (this.battleUI) {
        await this.battleUI.processTypedAction(BattleActions.forfeit('player'));
      }
    }

    /**
     * Handle card selection
     */
    private async handleCardSelect(cardId: string): Promise<void> {
      if (!this.playerData) return;

      // Play menu button sound
      this.playSfx('sfx-menu-button-select');

      const cardEntry = this.playerData.cards.collected.find(c => c.id === cardId);

      if (!cardEntry) {
        return;
      }

      // Check if card is in deck
      const isInDeck = this.playerData.cards.deck.includes(cardId);

      // Toggle card in/out of deck
      if (isInDeck) {
        await this.removeCardFromDeck(cardId);
      } else {
        await this.addCardToDeck(cardId);
      }
    }

    /**
     * Add card to player's deck
     */
    private async addCardToDeck(cardId: string): Promise<void> {
      if (!this.playerData) return;
      if (this.playerData.cards.deck.length >= DECK_SIZE) {
        Logger.warn(`Deck is full (${DECK_SIZE} cards)`);
        return;
      }

      if (!this.playerData.cards.deck.includes(cardId)) {
        this.playerData.cards.deck.push(cardId);
        await this.saveGameData();
        await this.updateBindingsFromGameState();
      }
    }

    /**
     * Remove card from player's deck
     */
    private async removeCardFromDeck(cardId: string): Promise<void> {
      if (!this.playerData) return;
      const index = this.playerData.cards.deck.indexOf(cardId);
      if (index > -1) {
        this.playerData.cards.deck.splice(index, 1);
        await this.saveGameData();
        await this.updateBindingsFromGameState();
      }
    }

    /**
     * Handle mission selection
     */
    private async handleMissionSelect(missionId: string): Promise<void> {
      Logger.info(`Mission selected: ${missionId}`);
      if (!this.playerData) return;

      // Play menu button sound
      this.playSfx('sfx-menu-button-select');

      // Check if player has cards in deck
      if (this.playerData.cards.deck.length === 0) {
        Logger.warn('No cards in deck');
        // TODO: Show dialog or message to user
        return;
      }

      // Get player's deck cards
      const playerDeckCards = getPlayerDeckCards(
        this.playerData.cards.deck,
        this.playerData.cards.collected
      );

      if (playerDeckCards.length === 0) {
        Logger.error('Failed to load deck cards');
        return;
      }

      // Start the mission
      const success = this.missionUI.startMission(missionId);

      if (success) {
        // Initialize battle with player's deck cards and name
        const battleState = this.battleUI.initializeBattle(playerDeckCards, this.playerData.name);

        if (battleState) {
          this.currentBattleId = missionId;
          this.battleStartTime = Date.now();  // Track start time for leaderboard

          // Set up render callback for battle UI to update display during AI turns
          this.battleUI.setRenderCallback(() => {
            const currentBattle = this.battleUI.getCurrentBattle();
            if (currentBattle && !currentBattle.isComplete) {
              const updatedDisplay = this.battleDisplayManager.createBattleDisplay(
                currentBattle,
                null
              );
              if (updatedDisplay) {
                this.UI.bindingManager.setBinding(BindingType.BattleDisplay, updatedDisplay);
                this.triggerRender();
              }
            }
          });

          // Create battle display from battle state
          const battleDisplay = this.battleDisplayManager.createBattleDisplay(
            battleState,
            null  // No attack animation
          );

          // Update battle display binding
          if (battleDisplay) {
            this.UI.bindingManager.setBinding(BindingType.BattleDisplay, battleDisplay);
          } else {
            console.error('[BloomBeastsGame] battleDisplay is null!');
          }

          // Navigate to battle screen
          this.UI.bindingManager.setBinding(BindingType.CurrentScreen, 'battle');

          // Trigger re-render to show battle screen
          this.triggerRender();

          // Play battle music
          this.playMusic('music-battle', true);

          Logger.info('Battle initialized successfully');
        } else {
          console.error('[BloomBeastsGame] battleState is null or undefined!');
        }
      } else {
        Logger.warn('Mission is not available');
      }
    }

    /**
     * Handle settings changes
     */
    private handleSettingsChange(settingId: string, value: any): void {
      if (!this.playerData) return;

      // Play button sound for toggles (not sliders)
      if (settingId === 'musicEnabled' || settingId === 'sfxEnabled') {
        this.playSfx('sfx-menu-button-select');
      }

      // Apply settings via sound manager
      switch (settingId) {
        case 'musicVolume':
          this.setMusicVolume(value);
          break;
        case 'sfxVolume':
          this.setSfxVolume(value);
          break;
        case 'musicEnabled':
          this.toggleMusic(value);
          break;
        case 'sfxEnabled':
          this.toggleSfx(value);
          break;
      }

      // Save settings and update binding
      this.UI.bindingManager.setBinding(BindingType.PlayerData, this.playerData);
      this.saveGameData();

      // Trigger re-render to update UI
      this.triggerRender();
    }

    /**
     * Handle upgrade purchase
     */
    private handleUpgrade(boostId: string): void {
      if (!this.playerData) return;

      // Get current boost level
      const currentLevel = this.playerData.boosts?.[boostId] || 0;

      // Check if already at max level
      if (currentLevel >= 6) {
        return;
      }

      // Get cost for next level based on current level
      const costs = UPGRADE_COSTS[boostId];
      if (!costs) {
        return;
      }

      const cost = costs[currentLevel];

      // Check if player has enough coins
      if (this.playerData.coins < cost) {
        return;
      }

      // Deduct coins
      this.playerData.coins -= cost;

      // Initialize boosts if not present
      if (!this.playerData.boosts) {
        this.playerData.boosts = {
          [COIN_BOOST.id]: 0,
          [EXP_BOOST.id]: 0,
          [LUCK_BOOST.id]: 0,
          [ROOSTER.id]: 0
        };
      }

      // Increment boost level
      this.playerData.boosts[boostId] = currentLevel + 1;

      // Play upgrade sound (special sound for rooster)
      if (boostId === ROOSTER.id) {
        this.playSfx('sfx-upgrade-rooster');
      } else {
        this.playSfx('sfx-upgrade');
      }

      // Save and update
      this.UI.bindingManager.setBinding(BindingType.PlayerData, this.playerData);
      this.saveGameData();
      this.triggerRender();
    }

    /**
     * Handle battle actions
     * Converts string actions from UI to typed actions
     */
    private async handleBattleAction(action: string): Promise<void> {
      // Handle timeout losses - convert to TIMEOUT action
      if (action === 'timeout-player' || action === 'timeout-opponent') {
        // Determine which player timed out
        const timedOutPlayerId = action === 'timeout-player' ? 'player' : 'opponent';

        if (this.battleUI) {
          // Get current turn player - timeout action must be executed by current player
          const currentBattle = this.battleUI.getCurrentBattle();
          if (currentBattle && currentBattle.battleState) {
            const currentPlayerId = currentBattle.battleState.turboState.turnInfo.currentPlayerId;

            // Process TIMEOUT action through TURBO
            // Execute as current player, but mark who actually timed out
            await this.battleUI.processTypedAction({
              type: 'timeout',
              playerId: currentPlayerId,
              timedOutPlayerId,
              timestamp: Date.now()
            });
          }
        }
        return;
      }

      // Handle forfeit button - show confirmation popup
      if (action === 'btn-forfeit' || action === 'forfeit') {
        this.showForfeitConfirmation();
        return;
      }

      // Handle back button - navigate to menu
      if (action === 'btn-back') {
        this.navigate('menu');
        return;
      }

      // Process the action through the battle UI
      if (!this.battleUI) {
        Logger.warn('Battle UI not initialized');
        return;
      }

      // CRITICAL: Check if battle is already complete - prevent double processing
      const currentBattle = this.battleUI.getCurrentBattle();
      if (currentBattle && currentBattle.isComplete) {
        console.log(`[BloomBeastsGame] Battle already complete, ignoring action: ${action}`);
        return;
      }

      // Beast and opponent clicks are now just for viewing details (no selection)
      if (action.startsWith('view-field-card-player-') || action.startsWith('view-field-card-opponent-')) {
        // Just return - card details will be shown by the UI layer if needed
        return;
      }

      // Parse string action to typed action
      const typedAction = parseActionString(action, 'player');
      if (!typedAction) {
        Logger.warn(`[BloomBeastsGame] Failed to parse action: ${action}`);
        return;
      }

      // Play sound effects and show animations based on action type
      if (typedAction.type === 'auto-attack-all') {
        // Handle auto-attack with animations
        this.playSfx('sfx-attack');

        // Process action with animation callback
        await this.battleUI.processTypedAction(typedAction, {
          onAttackAnimation: async (attackerIndex: number, targetType: 'beast' | 'health', targetIndex?: number) => {
            if (targetType === 'beast' && targetIndex !== undefined) {
              await this.showAttackAnimation('player', attackerIndex, 'opponent', targetIndex);
            } else {
              await this.showAttackAnimation('player', attackerIndex, 'health', undefined);
            }
          }
        });

        // Get updated state and render
        const updatedState = this.battleUI.getCurrentBattle();
        if (updatedState) {
          if (updatedState.isComplete) {
            await this.handleBattleComplete(updatedState);
            return;
          }

          const updatedDisplay = this.battleDisplayManager.createBattleDisplay(
            updatedState,
            null
          );
          if (updatedDisplay) {
            this.UI.bindingManager.setBinding(BindingType.BattleDisplay, updatedDisplay);
            this.triggerRender();
          }
        }
        return;
      } else if (typedAction.type === 'attack-beast') {
        this.playSfx('sfx-attack');
        // Animation already shown above
      } else if (typedAction.type === 'attack-player') {
        this.playSfx('sfx-attack');
        // Extract attacker index and show animation for direct health attack
        if (typedAction.attackerIndex !== undefined) {
          await this.showAttackAnimation('player', typedAction.attackerIndex, 'health', undefined);
        }
      } else if (typedAction.type === 'play-card') {
        this.playSfx('sfx-play-card');
      } else if (action.startsWith('activate-trap-')) {
        // TODO: Convert activate-trap to typed action
        this.playSfx('sfx-trap-card-activated');
      } else if (typedAction.type === 'end-turn') {
        this.playSfx('sfx-menu-button-select');
      }

      // Process action
      await this.battleUI.processTypedAction(typedAction, {});

      // Immediately update display after action to show cards instantly
      const immediateState = this.battleUI.getCurrentBattle();
      if (immediateState && !immediateState.isComplete) {
        const immediateDisplay = this.battleDisplayManager.createBattleDisplay(
          immediateState,
          null
        );
        if (immediateDisplay) {
          this.UI.bindingManager.setBinding(BindingType.BattleDisplay, immediateDisplay);
          this.triggerRender();
        }
      }

      // Get updated battle state
      const updatedState = this.battleUI.getCurrentBattle();
      if (updatedState) {
        // Check if battle ended FIRST - never render after completion
        if (updatedState.isComplete) {
          await this.handleBattleComplete(updatedState);
          return;
        }

        // Create updated battle display with fresh state
        const updatedDisplay = this.battleDisplayManager.createBattleDisplay(
          updatedState,
          null  // No attack animation
        );

        // Update battle display binding - this should trigger UI refresh
        if (updatedDisplay) {
          //   playerHealth: updatedDisplay.playerHealth,
          //   opponentHealth: updatedDisplay.opponentHealth
          // });
          this.UI.bindingManager.setBinding(BindingType.BattleDisplay, updatedDisplay);
          this.triggerRender();
        }
      }
    }

    /**
     * Handle battle completion (victory or defeat)
     */
    private async handleBattleComplete(battleState: any): Promise<void> {
      if (!this.playerData) return;

      console.log('[BloomBeastsGame] handleBattleComplete called');
      console.log('[BloomBeastsGame] Has rewards:', !!battleState.rewards);
      console.log('[BloomBeastsGame] Rewards object:', battleState.rewards);

      // Capture playerData in local const for TypeScript null safety in callbacks
      const playerData = this.playerData;

      // Stop all timers immediately
      if (this.battleScreen) {
        this.battleScreen.cleanup();
      }

      // Keep battle visible in background while popup shows
      // Battle display will be cleared when user clicks Continue
      const battleId = this.currentBattleId; // Save before clearing
      this.currentBattleId = null;

      //   hasRewards: !!battleState.rewards,
      //   rewards: battleState.rewards
      // });

      if (battleState.rewards) {
        // Victory!
        console.log('[BloomBeastsGame] VICTORY! Showing rewards popup');

        // Apply boost multipliers to rewards
        const coinBoostLevel = playerData.boosts?.[COIN_BOOST.id] || 0;
        const expBoostLevel = playerData.boosts?.[EXP_BOOST.id] || 0;
        const luckBoostLevel = playerData.boosts?.[LUCK_BOOST.id] || 0;

        let coinBoostPercent = 0;
        let expBoostPercent = 0;
        let luckBoostPercent = 0;

        // Calculate and apply coin boost
        if (coinBoostLevel > 0 && COIN_BOOST.values && battleState.rewards.coinsReceived) {
          coinBoostPercent = COIN_BOOST.values[coinBoostLevel - 1];
          const multiplier = (coinBoostPercent / 100) + 1;
          const boostedCoins = Math.floor(battleState.rewards.coinsReceived * multiplier);
          battleState.rewards.coinsReceived = boostedCoins;
        }

        // Calculate and apply exp boost
        if (expBoostLevel > 0 && EXP_BOOST.values) {
          expBoostPercent = EXP_BOOST.values[expBoostLevel - 1];
          const multiplier = (expBoostPercent / 100) + 1;
          const boostedXP = Math.floor(battleState.rewards.xpGained * multiplier);
          const boostedBeastXP = Math.floor(battleState.rewards.beastXP * multiplier);
          battleState.rewards.xpGained = boostedXP;
          battleState.rewards.beastXP = boostedBeastXP;
        }

        // Calculate luck boost (affects drop chances - already rolled, so no effect on this implementation)
        if (luckBoostLevel > 0 && LUCK_BOOST.values) {
          luckBoostPercent = LUCK_BOOST.values[luckBoostLevel - 1];
          // Luck boost would affect drop chances, but rewards are already generated
          // This is shown for informational purposes
        }

        // Add boost info to rewards for display
        if (!battleState.rewards.bonusRewards) {
          battleState.rewards.bonusRewards = [];
        }
        if (coinBoostPercent > 0) {
          battleState.rewards.bonusRewards.push(`Coin Boost: +${coinBoostPercent}%`);
        }
        if (expBoostPercent > 0) {
          battleState.rewards.bonusRewards.push(`EXP Boost: +${expBoostPercent}%`);
        }
        if (luckBoostPercent > 0) {
          battleState.rewards.bonusRewards.push(`Luck Boost: +${luckBoostPercent}%`);
        }

        // Award XP
        this.addXP(battleState.rewards.xpGained);

        // Award card XP directly to deck cards
        const cardXP = battleState.rewards.beastXP || battleState.rewards.xpGained;
        awardDeckExperience(
          cardXP,
          playerData.cards.deck,
          playerData.cards.collected
        );

        // Add cards directly to collection
        battleState.rewards.cardsReceived.forEach((card: any, index: number) => {
          addCardReward(card, playerData.cards.collected, index);
        });

        // Add coins
        if (battleState.rewards.coinsReceived) {
          playerData.coins += battleState.rewards.coinsReceived;
        }

        // Add items to inventory
        if (battleState.rewards.itemsReceived) {
          battleState.rewards.itemsReceived.forEach((itemReward: any) => {
            this.addItems(itemReward.itemId, itemReward.quantity);
          });
        }

        // Track mission completion
        if (battleId) {
          this.trackMissionCompletion(battleId);

          // If this is Cluck Norris mission, submit time to leaderboard
          if (battleId === 'mission17' && this.battleStartTime) {
            const completionTime = (Date.now() - this.battleStartTime) / 1000; // Convert to seconds
            this.submitLeaderboardScore('cluckNorris', completionTime);
          }
        }

        // Reset battle start time
        this.battleStartTime = null;

        // Play win sound
        this.playSfx('sfx-win');

        // Save game data
        await this.saveGameData();

        // Show mission complete popup
        const popupData = {
          mission: battleState.mission,
          rewards: battleState.rewards,
          chestOpened: false,
          onClaimRewards: () => {
            // Chest animation could go here
            const current = this.UI.bindingManager.getSnapshot(BindingType.MissionCompletePopup);
            if (current) {
              const updatedData = {
                ...current,
                chestOpened: true
              };
              this.UI.bindingManager.setBinding(BindingType.MissionCompletePopup, updatedData);
              this.triggerRender();
            }
          },
          onContinue: () => {
            // Clear battle display and close popup
            this.UI.bindingManager.setBinding(BindingType.BattleDisplay, null);
            this.UI.bindingManager.setBinding(BindingType.MissionCompletePopup, null);
            this.navigate('missions');
          },
          playSfx: this.playSfx.bind(this)
        };

        // Set both tracked value and binding
        this.UI.bindingManager.setBinding(BindingType.MissionCompletePopup, popupData);
        this.triggerRender();
      } else {
        // Defeat
        console.log('[BloomBeastsGame] DEFEAT! Showing failed popup');

        // Reset battle start time
        this.battleStartTime = null;

        // Play lose sound
        this.playSfx('sfx-lose');

        // Show mission failed popup
        const failedPopupProps = {
          mission: battleState.mission,
          rewards: null, // null indicates failure
          chestOpened: false,
          onContinue: () => {
            // Clear battle display and close popup
            this.UI.bindingManager.setBinding(BindingType.BattleDisplay, null);
            this.UI.bindingManager.setBinding(BindingType.MissionCompletePopup, null);
            this.navigate('missions');
          },
          playSfx: this.playSfx.bind(this)
        };
        this.UI.bindingManager.setBinding(BindingType.MissionCompletePopup, failedPopupProps);
        this.triggerRender();
      }

      // Resume background music
      this.playMusic('music-background', true);

      // Note: Navigation happens when user clicks Continue in the popup
    }

    /**
     * Load leaderboard data from world variables
     */
    private loadLeaderboardData(): void {
      if (!this.platform.getWorldVariable) {
        // World variables not supported on this platform, use mock data
        this.UI.bindingManager.setBinding(BindingType.LeaderboardData, {
          topExperience: [
            { playerName: 'Player 1', score: 10000, level: 7 },
            { playerName: 'Player 2', score: 5000, level: 6 },
            { playerName: 'Player 3', score: 3000, level: 5 },
          ],
          fastestCluckNorris: [
            { playerName: 'Speed Runner', score: 45 },
            { playerName: 'Fast Player', score: 60 },
            { playerName: 'Quick Win', score: 75 },
          ],
        });
        return;
      }

      try {
        // Get leaderboard data from world variable
        const leaderboardData = this.platform.getWorldVariable('BloomBeastsData', 'leaderboard');

        if (leaderboardData) {
          this.UI.bindingManager.setBinding(BindingType.LeaderboardData, leaderboardData);
        } else {
          // No data yet, set empty arrays
          this.UI.bindingManager.setBinding(BindingType.LeaderboardData, {
            topExperience: [],
            fastestCluckNorris: [],
          });
        }
      } catch (error) {
        console.error('[BloomBeastsGame] Failed to load leaderboard data:', error);
        this.UI.bindingManager.setBinding(BindingType.LeaderboardData, {
          topExperience: [],
          fastestCluckNorris: [],
        });
      }
    }

    /**
     * Submit player score to leaderboard via network event
     */
    private submitLeaderboardScore(type: 'experience' | 'cluckNorris', score: number): void {
      if (!this.platform.sendNetworkEvent) {
        // Network events not supported on this platform
        return;
      }

      if (!this.playerData) {
        console.warn('[BloomBeastsGame] Cannot submit score: player data not loaded');
        return;
      }

      try {
        const playerName = this.playerData.name || 'Unknown Player';
        const eventData = {
          playerName,
          type,
          score,
          level: type === 'experience' ? getPlayerLevel(this.playerData.totalXP) : undefined,
        };

        this.platform.sendNetworkEvent('leaderboard_score_submit', eventData);
      } catch (error) {
        console.error('[BloomBeastsGame] Failed to submit leaderboard score:', error);
      }
    }

    /**
     * Create the main UI tree
     * This is created once and updated reactively via bindings
     */
    private createUI(): UINode {
      const { View } = this.UI;

      // Build main UI with conditional screens
      const children: any[] = [
        this.UI.UINode ? this.UI.UINode.if( this.UI.bindingManager.derive([BindingType.CurrentScreen], (current: string) => current === 'loading'), this.createLoadingScreen()) : null,
        this.UI.UINode ? this.UI.UINode.if( this.UI.bindingManager.derive([BindingType.CurrentScreen], (current: string) => current === 'menu'), this.menuScreen.createUI()) : null,
        this.UI.UINode ? this.UI.UINode.if( this.UI.bindingManager.derive([BindingType.CurrentScreen], (current: string) => current === 'cards'), this.cardsScreen.createUI()) : null,
        this.UI.UINode ? this.UI.UINode.if( this.UI.bindingManager.derive([BindingType.CurrentScreen], (current: string) => current === 'upgrades'), this.upgradeScreen.createUI()) : null,
        this.UI.UINode ? this.UI.UINode.if( this.UI.bindingManager.derive([BindingType.CurrentScreen], (current: string) => current === 'missions'), this.missionScreen.createUI()) : null,
        this.UI.UINode ? this.UI.UINode.if( this.UI.bindingManager.derive([BindingType.CurrentScreen], (current: string) => current === 'battle'), this.battleScreen.createUI()) : null,
        this.UI.UINode ? this.UI.UINode.if( this.UI.bindingManager.derive([BindingType.CurrentScreen], (current: string) => current === 'settings'), this.settingsScreen.createUI()) : null,
        this.UI.UINode ? this.UI.UINode.if( this.UI.bindingManager.derive([BindingType.CurrentScreen], (current: string) => current === 'leaderboard'), this.leaderboardScreen.createUI()) : null,
      ];

      // Add popups (these already use UINode.if)
      // Mission Complete Popup - static structure with derived content
      if (this.UI.UINode) {
        children.push(
          this.UI.UINode.if(
            this.UI.bindingManager.derive([BindingType.MissionCompletePopup], (props: any) => {
              return props !== null;
            }),
            createMissionCompletePopup(this.UI, this.UI.bindingManager)
          )
        );
      }

      // Forfeit Popup - static structure with derived content
      if (this.UI.UINode) {
        children.push(
          this.UI.UINode.if(
            this.UI.bindingManager.derive([BindingType.ForfeitPopup], (props: any) => {
              return props !== null;
            }),
            createButtonPopup(this.UI, this.UI.bindingManager)
          )
        );
      }

      if (this.UI.UINode) {
        children.push(
          this.UI.UINode.if(
            this.UI.bindingManager.derive([BindingType.CardDetailPopup], (props: any) => {
              return props !== null;
            }),
            createReactiveCardDetailPopupFromBinding(this.UI)
          )
        );
      }

      return View({
        style: {
          width: '100%',
          height: '100%',
          backgroundColor: 'black',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        children: [
          // Inner container with aspect ratio that scales content
          View({
            style: {
              width: '100%',
              height: 'auto',
              maxWidth: '100%',
              maxHeight: '100%',
              position: 'relative',
              aspectRatio: `${gameDimensions.panelWidth}/${gameDimensions.panelHeight}`
            },
            children,
          })
        ],
      });
    }

    /**
     * Create the loading screen UI
     */
    private createLoadingScreen(): UINode {
      const { View } = this.UI;

      return View({
        style: {
          flex: 1,
          backgroundColor: '#1a1a2e', // Dark background as fallback
        },
        children: [
          // Note: Background image removed since assets aren't loaded during initialization
          // The loading screen is only shown briefly before assets load anyway

          // Loading text centered
          View({
            style: {
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            },
            children: this.UI.Text({
              text: 'Loading...',
              style: {
                fontSize: 32,
                color: '#ffffff',
                fontWeight: 'bold',
                textShadowColor: '#000000',
                textShadowOffset: { width: 2, height: 2 },
                textShadowRadius: 4,
              }
            })
          })
        ]
      });
    }


    /**
     * Show attack animation
     */
    private async showAttackAnimation(
      attackerPlayer: 'player' | 'opponent',
      attackerIndex: number,
      targetPlayer: 'player' | 'opponent' | 'health',
      targetIndex?: number
    ): Promise<void> {
      const currentState = this.battleUI.getCurrentBattle();
      if (!currentState) return;

      // Show animation (attacker glows green, target glows red)
      const displayWithAnimation = this.battleDisplayManager.createBattleDisplay(
        currentState,
        {
          attackerPlayer,
          attackerIndex,
          targetPlayer,
          targetIndex
        }
      );

      if (displayWithAnimation) {
        this.UI.bindingManager.setBinding(BindingType.BattleDisplay, displayWithAnimation);
        this.triggerRender();
      }

      // Wait for animation duration
      await new Promise(resolve => this.asyncMethods.setTimeout(resolve, 500));

      // Clear animation
      const displayWithoutAnimation = this.battleDisplayManager.createBattleDisplay(
        currentState,
        null  // No animation
      );

      if (displayWithoutAnimation) {
        this.UI.bindingManager.setBinding(BindingType.BattleDisplay, displayWithoutAnimation);
        this.triggerRender();
      }
    }

    /**
     * Dispose resources
     */
    dispose(): void {
      this.menuScreen.dispose();
      // TODO: Dispose other resources
    }
  }

  // ==================== bloombeasts\utils\createDefaultPlayerData.ts ====================

  /**
   * Utility to create default PlayerData structure
   * Used by platforms when initializing new players
   */


  /**
   * Create default player data structure
   * @param name - Player's display name
   * @returns Default PlayerData with the given name
   */
  export function createDefaultPlayerData(name: string): PlayerData {
    return {
      name: name,
      totalXP: 0,
      coins: 1000, // Starting coins
      items: [],
      cards: {
        collected: [],
        deck: []
      },
      missions: {
        completedMissions: {}
      },
      boosts: {
        [COIN_BOOST.id]: 0,
        [EXP_BOOST.id]: 0,
        [LUCK_BOOST.id]: 0,
        [ROOSTER.id]: 0
      },
      settings: {
        musicVolume: 10,
        sfxVolume: 50,
        musicEnabled: true,
        sfxEnabled: true
      }
    };
  }

  // ==================== bloombeasts\AssetCatalog.ts ====================

  /**
   * Asset Catalog - Dynamically Generated Asset IDs
   *
   * This file generates asset IDs from game data (cards, etc.)
   * Platforms must provide mappings for these IDs to actual assets.
   *
   * NO platform-specific code should be in this file!
   */


  /**
   * Get all card IDs that need image assets
   */
  export function getCardImageAssetIds(catalogManager: any): string[] {
    const cards = catalogManager.getAllCardData();
    return cards.map((card: any) => card.id);
  }

  /**
   * Get affinity icon asset IDs
   */
  export function getAffinityIconAssetIds(): string[] {
    return ['Forest', 'Water', 'Fire', 'Sky'];
  }

  /**
   * Get card template asset IDs
   */
  export function getCardTemplateAssetIds(): string[] {
    return ['base-card', 'magic-card', 'trap-card', 'buff-card'];
  }

  /**
   * Get card rendering asset IDs (for CardRenderer)
   * These are the IDs that CardRenderer expects for rendering cards
   */
  export function getCardRenderingAssetIds(catalogManager: any): string[] {
    const cards = catalogManager.getAllCardData();
    const assetIds: string[] = [
      'cardsContainer',  // Cards page background
      'baseCard',        // Base card frame template
      'magicCard',       // Magic card type overlay
      'trapCard',        // Trap card type overlay
      'buffCard',        // Buff card type overlay
    ];

    // Add individual card artwork for each card
    for (const card of cards) {
      if (card.type === CardType.Beast) {
        // Beast cards use beast artwork
        assetIds.push(`beast-${card.name}`);
      } else {
        // Other cards use card artwork
        assetIds.push(`card-${card.name}`);
      }
    }

    return assetIds;
  }

  /**
   * Get habitat template asset IDs (affinity-specific)
   */
  export function getHabitatTemplateAssetIds(): string[] {
    return ['forest-habitat', 'water-habitat', 'fire-habitat', 'sky-habitat'];
  }

  /**
   * Get UI icon asset IDs
   */
  export function getUIIconAssetIds(): string[] {
    return ['icon-play', 'icon-cards', 'icon-missions', 'icon-settings', 'icon-shop'];
  }

  /**
   * Get UI element asset IDs (buttons, bars, menus, etc.)
   */
  export function getUIElementAssetIds(): string[] {
    return [
      'standardButton',
      'greenButton',
      'sideMenu',
      'experienceBar',
      // Menu animation frames (1-10)
      ...Array.from({ length: 10 }, (_, i) => `menuFrame${i + 1}`)
    ];
  }

  /**
   * Get background image asset IDs
   */
  export function getBackgroundAssetIds(): string[] {
    return ['background', 'menu-bg', 'cards-bg', 'mission-select-bg', 'menu'];
  }

  /**
   * Get all image asset IDs
   */
  export function getAllImageAssetIds(catalogManager: any): string[] {
    return [
      ...getCardImageAssetIds(catalogManager),
      ...getAffinityIconAssetIds(),
      ...getCardTemplateAssetIds(),
      ...getCardRenderingAssetIds(catalogManager),
      ...getHabitatTemplateAssetIds(),
      ...getUIIconAssetIds(),
      ...getUIElementAssetIds(),
      ...getBackgroundAssetIds()
    ];
  }

  /**
   * Sound Asset IDs - Enum for type safety
   * These match the IDs in commonAssets.json
   */
  export enum SoundAssetIds {
    // Music
    BACKGROUND_MUSIC = 'music-background',
    BATTLE_MUSIC = 'music-battle',

    // SFX
    MENU_BUTTON_SELECT = 'sfx-menu-button-select',
    PLAY_CARD = 'sfx-play-card',
    ATTACK = 'sfx-attack',
    TRAP_ACTIVATED = 'sfx-trap-card-activated',
    LOW_HEALTH = 'sfx-low-health',
    WIN = 'sfx-win',
    LOSE = 'sfx-lose',
  }

  /**
   * Legacy sound ID mappings for backwards compatibility
   * Maps old string IDs to new SoundAssetIds
   */
  export const LEGACY_SOUND_ID_MAP: Record<string, SoundAssetIds> = {
    // Music (old format)
    'BackgroundMusic.mp3': SoundAssetIds.BACKGROUND_MUSIC,
    'BattleMusic.mp3': SoundAssetIds.BATTLE_MUSIC,

    // SFX (old format with paths)
    'sfx/menuButtonSelect.wav': SoundAssetIds.MENU_BUTTON_SELECT,
    'sfx/playCard.wav': SoundAssetIds.PLAY_CARD,
    'sfx/attack.wav': SoundAssetIds.ATTACK,
    'sfx/trapCardActivated.wav': SoundAssetIds.TRAP_ACTIVATED,
    'sfx/lowHealthSound.wav': SoundAssetIds.LOW_HEALTH,
    'sfx/win.wav': SoundAssetIds.WIN,
    'sfx/lose.wav': SoundAssetIds.LOSE,

    // SFX (old format without extension/path)
    'menuButtonSelect': SoundAssetIds.MENU_BUTTON_SELECT,
    'playCard': SoundAssetIds.PLAY_CARD,
    'attack': SoundAssetIds.ATTACK,
  };

  /**
   * Get sound effect asset IDs
   */
  export function getSoundEffectAssetIds(): string[] {
    return [
      SoundAssetIds.MENU_BUTTON_SELECT,
      SoundAssetIds.PLAY_CARD,
      SoundAssetIds.ATTACK,
      SoundAssetIds.TRAP_ACTIVATED,
      SoundAssetIds.LOW_HEALTH,
      SoundAssetIds.WIN,
      SoundAssetIds.LOSE,
    ];
  }

  /**
   * Get music asset IDs
   */
  export function getMusicAssetIds(): string[] {
    return [
      SoundAssetIds.BACKGROUND_MUSIC,
      SoundAssetIds.BATTLE_MUSIC,
    ];
  }

  /**
   * Get all sound asset IDs
   */
  export function getAllSoundAssetIds(): string[] {
    return [
      ...getSoundEffectAssetIds(),
      ...getMusicAssetIds()
    ];
  }

  /**
   * Normalize a sound ID (convert legacy IDs to new format)
   */
  export function normalizeSoundId(soundId: string): string {
    return LEGACY_SOUND_ID_MAP[soundId] || soundId;
  }

  // ==================== bloombeasts\AssetCatalogManager.ts ====================

  /**
   * Asset Catalog Manager - Centralized Asset Management System
   *
   * This replaces the dynamic asset ID generation with a JSON-based catalog system.
   * All asset information (paths, Horizon IDs, metadata) is stored in JSON files
   * organized by affinity and category.
   *
   * PLATFORM-SPECIFIC LOADING:
   * - Web: See deployments/web/src/main.ts for fetch()-based loading
   * - Horizon: See deployments/horizon/src/AssetCatalogLoader.ts for fetchAsData()-based loading
   */

  /**
   * Type of asset reference (image, audio, animation)
   */
  export enum AssetReferenceType {
    Image = 'image',
    Audio = 'audio',
    Animation = 'animation'
  }

  /**
   * Type of asset entry (beast, buff, trap, magic, habitat, mission, ui)
   */
  export enum AssetEntryType {
    Beast = 'beast',
    Buff = 'buff',
    Trap = 'trap',
    Magic = 'magic',
    Habitat = 'habitat',
    Mission = 'mission',
    UI = 'ui'
  }

  /**
   * UI asset category types
   */
  export enum UICategory {
    Frame = 'frame',
    Button = 'button',
    Background = 'background',
    Icon = 'icon',
    Chest = 'chest',
    Container = 'container',
    CardTemplate = 'card-template',
    Upgrade = 'upgrade',
    Other = 'other'
  }

  /**
   * Catalog category types (for organizing asset catalogs)
   */
  export enum CatalogCategory {
    Fire = 'fire',
    Forest = 'forest',
    Sky = 'sky',
    Water = 'water',
    Buff = 'buff',
    Trap = 'trap',
    Magic = 'magic',
    Common = 'common',
    Boss = 'boss'
  }

  /**
   * Affinity types (lowercase for JSON compatibility)
   * Maps to engine/types/core.ts Affinity enum
   */
  export enum AffinityLowercase {
    Fire = 'fire',
    Forest = 'forest',
    Sky = 'sky',
    Water = 'water',
    Boss = 'boss'
  }

  export interface AssetReference {
    type: AssetReferenceType;
    horizonAssetId?: string; // Optional - only for Horizon deployment
    path: string; // Relative path from project root
    description?: string; // Optional description for documentation
  }

  export interface CardAssetEntry {
    id: string;
    type: AssetEntryType.Beast | AssetEntryType.Buff | AssetEntryType.Trap | AssetEntryType.Magic | AssetEntryType.Habitat;
    cardType?: 'Beast' | 'Magic' | 'Trap' | 'Buff'; // Game engine card type
    affinity?: AffinityLowercase; // For beasts and habitats
    data: {
      id: string;
      name: string;
      displayName?: string; // Display name if different from name
      description?: string;
      cost?: number;
      attack?: number;
      health?: number;
      tier?: number;
      // Allow any additional properties from card data
      [key: string]: any;
    };
    assets: AssetReference[];
  }

  export interface MissionAssetEntry {
    id: string;
    type: AssetEntryType.Mission;
    affinity?: AffinityLowercase;
    name: string;
    description: string;
    assets: AssetReference[];
  }

  export interface UIAssetEntry {
    id: string;
    type: AssetEntryType.UI;
    category: UICategory;
    name: string;
    description?: string;
    assets: AssetReference[];
  }

  export interface AssetCatalog {
    version: string;
    category: CatalogCategory;
    description: string;
    data: (CardAssetEntry | MissionAssetEntry | UIAssetEntry)[];
  }

  // Note: AssetCatalogManager now uses enums for type safety while maintaining
  // compatibility with JSON catalog files through string enum values.
  // The catalogs use lowercase enums that map to the JSON structure.

  /**
   * AssetCatalogManager - Manages loading and querying of asset catalogs
   * NOT a singleton - create instances as needed
   */
  export class AssetCatalogManager {
    private catalogs: Map<string, AssetCatalog> = new Map();
    private assetIndex: Map<string, CardAssetEntry | MissionAssetEntry | UIAssetEntry> = new Map();
    private pathToIdMap: Map<string, string> = new Map(); // Maps asset paths to IDs
    private horizonIdMap: Map<string, string> = new Map(); // Maps Horizon IDs to asset IDs

    /**
     * Load catalog from JSON object
     * Platform-specific code should fetch/load the JSON and pass it here
     */
    loadCatalog(catalog: AssetCatalog): void {
      const catalogKey = catalog.category;
      this.catalogs.set(catalogKey, catalog);

      // Index all assets by ID for quick lookup
      catalog.data.forEach(entry => {
        this.assetIndex.set(entry.id, entry);

        // Create reverse mappings
        entry.assets.forEach(asset => {
          this.pathToIdMap.set(asset.path, entry.id);
          if (asset.horizonAssetId) {
            this.horizonIdMap.set(asset.horizonAssetId, entry.id);
          }
        });
      });
    }

    /**
     * Get asset entry by ID
     */
    getAsset(id: string): CardAssetEntry | MissionAssetEntry | UIAssetEntry | undefined {
      return this.assetIndex.get(id);
    }

    /**
     * Get asset entry by path
     */
    getAssetByPath(path: string): CardAssetEntry | MissionAssetEntry | UIAssetEntry | undefined {
      const id = this.pathToIdMap.get(path);
      return id ? this.assetIndex.get(id) : undefined;
    }

    /**
     * Get asset entry by Horizon ID
     */
    getAssetByHorizonId(horizonId: string): CardAssetEntry | MissionAssetEntry | UIAssetEntry | undefined {
      const id = this.horizonIdMap.get(horizonId);
      return id ? this.assetIndex.get(id) : undefined;
    }

    /**
     * Get all assets of a specific type
     */
    getAssetsByType<T extends CardAssetEntry | MissionAssetEntry | UIAssetEntry>(
      type: AssetEntryType
    ): T[] {
      const results: T[] = [];
      this.assetIndex.forEach(entry => {
        if (entry.type === type || (entry.type === AssetEntryType.UI && type === AssetEntryType.UI)) {
          results.push(entry as T);
        } else if (type !== AssetEntryType.Mission && type !== AssetEntryType.UI && (entry as CardAssetEntry).type === type) {
          results.push(entry as T);
        }
      });
      return results;
    }

    /**
     * Get all cards by affinity
     */
    getCardsByAffinity(affinity: AffinityLowercase): CardAssetEntry[] {
      const results: CardAssetEntry[] = [];
      this.assetIndex.forEach(entry => {
        if (entry.type === AssetEntryType.Beast || entry.type === AssetEntryType.Habitat) {
          const card = entry as CardAssetEntry;
          if (card.affinity === affinity) {
            results.push(card);
          }
        }
      });
      return results;
    }

    /**
     * Get Horizon asset ID for a given asset
     */
    getHorizonAssetId(assetId: string, assetType: AssetReferenceType = AssetReferenceType.Image): string | undefined {
      const asset = this.getAsset(assetId);
      if (!asset) return undefined;

      const assetRef = asset.assets.find(a => a.type === assetType);
      return assetRef?.horizonAssetId;
    }

    /**
     * Get local path for a given asset
     */
    getAssetPath(assetId: string, assetType: AssetReferenceType = AssetReferenceType.Image): string | undefined {
      const asset = this.getAsset(assetId);
      if (!asset) return undefined;

      const assetRef = asset.assets.find(a => a.type === assetType);
      return assetRef?.path;
    }

    /**
     * Get all assets for a catalog category
     */
    getCatalog(category: string): AssetCatalog | undefined {
      return this.catalogs.get(category);
    }

    /**
     * Build asset mappings for web platform
     */
    getWebAssetMappings(): {
      images: Record<string, string>,
      sounds: Record<string, string>
    } {
      const images: Record<string, string> = {};
      const sounds: Record<string, string> = {};

      this.assetIndex.forEach((entry, id) => {
        entry.assets.forEach(asset => {
          // Only use the first asset of each type for the entry
          if (asset.type === AssetReferenceType.Image && !images[id]) {
            images[id] = asset.path;
          } else if (asset.type === AssetReferenceType.Audio && !sounds[id]) {
            sounds[id] = asset.path;
          }
        });
      });

      return { images, sounds };
    }

    /**
     * Build asset mappings for Horizon platform
     */
    getHorizonAssetMappings(): {
      images: Record<string, string>,
      sounds: Record<string, string>
    } {
      const images: Record<string, string> = {};
      const sounds: Record<string, string> = {};

      this.assetIndex.forEach((entry, id) => {
        entry.assets.forEach(asset => {
          if (asset.horizonAssetId) {
            // Only use the first asset of each type for the entry
            if (asset.type === AssetReferenceType.Image && !images[id]) {
              images[id] = asset.horizonAssetId;
            } else if (asset.type === AssetReferenceType.Audio && !sounds[id]) {
              sounds[id] = asset.horizonAssetId;
            }
          }
        });
      });

      return { images, sounds };
    }

    /**
     * Get all loaded catalog categories
     */
    getLoadedCategories(): string[] {
      return Array.from(this.catalogs.keys());
    }

    /**
     * Get total number of indexed assets (for debugging)
     */
    getTotalIndexedAssets(): number {
      return this.assetIndex.size;
    }

    /**
     * Get all card data from loaded catalogs
     * Returns the actual card definitions (data property) from all card entries
     */
    getAllCardData(): any[] {
      const cards: any[] = [];

      this.assetIndex.forEach(entry => {
        // Only include card entries (beast, magic, trap, buff, habitat)
        const isCardEntry = entry.type === AssetEntryType.Beast || entry.type === AssetEntryType.Magic ||
            entry.type === AssetEntryType.Trap || entry.type === AssetEntryType.Buff || entry.type === AssetEntryType.Habitat;

        if (isCardEntry) {
          const cardEntry = entry as CardAssetEntry;
          // Add rarity for reward system (same logic as old getAllCards)
          const cardData: any = { ...cardEntry.data };

          if (cardEntry.type === AssetEntryType.Beast) {
            // Assign rarity based on energy cost
            const cost = cardData.cost || 0;
            if (cost >= 5) {
              cardData.rarity = 'rare';
            } else if (cost >= 3) {
              cardData.rarity = 'uncommon';
            } else {
              cardData.rarity = 'common';
            }
          } else {
            // Non-beast cards are common by default
            cardData.rarity = 'common';
          }

          cards.push(cardData);
        }
      });

      return cards;
    }

    /**
     * Get a specific card by ID
     */
    getCard<T = any>(cardId: string): T | undefined {
      const allCards = this.getAllCardData();
      return allCards.find((card: any) => card.id === cardId) as T | undefined;
    }

    /**
     * Get all buff cards from the catalog
     */
    getAllBuffCards(): any[] {
      const buffEntries = this.getAssetsByType(AssetEntryType.Buff);
      return buffEntries.map((entry: any) => entry.data);
    }

    /**
     * Clear all loaded catalogs
     */
    clear(): void {
      this.catalogs.clear();
      this.assetIndex.clear();
      this.pathToIdMap.clear();
      this.horizonIdMap.clear();
    }
  }

  // ==================== bloombeasts\catalogs\bossAssets.ts ====================

  /**
   * Boss Assets Catalog
   * Source of truth for boss cards and assets
   * Edit this file directly to add/modify boss assets
   */


  export const bossAssets: AssetCatalog = {
    version: "1.0.0",
    category: CatalogCategory.Boss,
    description: "Boss cards and assets",
    data: [
      {
        id: "cluck-norris",
        type: AssetEntryType.Beast,
        cardType: "Beast",
        affinity: AffinityLowercase.Boss,
        data: {
          id: "cluck-norris",
          name: "Cluck Norris",
          type: CardType.Beast,
          affinity: Affinity.Boss,
          cost: 0,
          baseAttack: 99,
          baseHealth: 99,
          abilities: [
            {
              name: "Legendary Rooster",
              trigger: AbilityTrigger.WhileOnField,
              effects: [
                {
                  type: EffectType.ModifyStats,
                  target: AbilityTarget.Self,
                  stat: StatType.Attack,
                  value: 10,
                  duration: EffectDuration.WhileOnField
                },
                {
                  type: EffectType.ModifyStats,
                  target: AbilityTarget.Self,
                  stat: StatType.Health,
                  value: 10,
                  duration: EffectDuration.WhileOnField
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1358389912362012",
            path: "assets/images/cards_boss_cluck-norris.png"
          }
        ]
      },
      {
        id: "boss-icon",
        type: AssetEntryType.UI,
        category: UICategory.Icon,
        name: "Boss Icon",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "808398125136052",
            path: "assets/images/affinity_boss-icon.png"
          }
        ]
      },
      {
        id: "boss-mission",
        type: AssetEntryType.Mission,
        affinity: AffinityLowercase.Boss,
        name: "Cluck Norris",
        description: "Boss mission",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1358389912362012",
            path: "assets/images/cards_boss-mission.png"
          }
        ]
      }
    ]
  };

  // ==================== bloombeasts\catalogs\buffAssets.ts ====================

  /**
   * Buff Assets Catalog
   * Source of truth for buff cards and assets
   * Edit this file directly to add/modify assets
   */


  export const buffAssets: AssetCatalog = {
    version: "1.0.0",
    category: CatalogCategory.Buff,
    description: "Buff cards and assets",
    data: [
      {
        id: "battle-fury",
        type: AssetEntryType.Buff,
        cardType: "Buff",
        data: {
          id: "battle-fury",
          name: "Battle Fury",
          type: CardType.Buff,
          cost: 3,
          abilities: [
            {
              name: "Battle Fury",
              trigger: AbilityTrigger.WhileOnField,
              effects: [
                {
                  type: EffectType.ModifyStats,
                  target: AbilityTarget.AllAllies,
                  stat: StatType.Attack,
                  value: 2,
                  duration: EffectDuration.WhileOnField
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1514404306279605",
            path: "assets/images/cards_buff_battle-fury.png"
          }
        ]
      },
      {
        id: "mystic-shield",
        type: AssetEntryType.Buff,
        cardType: "Buff",
        data: {
          id: "mystic-shield",
          name: "Mystic Shield",
          type: CardType.Buff,
          cost: 3,
          abilities: [
            {
              name: "Mystic Shield",
              trigger: AbilityTrigger.WhileOnField,
              effects: [
                {
                  type: EffectType.ModifyStats,
                  target: AbilityTarget.AllAllies,
                  stat: StatType.Health,
                  value: 2,
                  duration: EffectDuration.WhileOnField
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "787965707330770",
            path: "assets/images/cards_buff_mystic-shield.png"
          }
        ]
      },
      {
        id: "natures-blessing",
        type: AssetEntryType.Buff,
        cardType: "Buff",
        affinity: AffinityLowercase.Forest,
        data: {
          id: "natures-blessing",
          name: "Nature's Blessing",
          type: CardType.Buff,
          affinity: Affinity.Forest,
          cost: 4,
          abilities: [
            {
              name: "Nature's Blessing",
              trigger: AbilityTrigger.OnOwnStartOfTurn,
              effects: [
                {
                  type: EffectType.Heal,
                  target: AbilityTarget.AllAllies,
                  value: 1
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "4100038783597004",
            path: "assets/images/cards_buff_natures-blessing.png"
          }
        ]
      },
      {
        id: "swift-wind",
        type: AssetEntryType.Buff,
        cardType: "Buff",
        affinity: AffinityLowercase.Sky,
        data: {
          id: "swift-wind",
          name: "Swift Wind",
          type: CardType.Buff,
          affinity: Affinity.Sky,
          cost: 2,
          abilities: [
            {
              name: "Swift Wind",
              trigger: AbilityTrigger.OnOwnStartOfTurn,
              effects: [
                {
                  type: EffectType.GainResource,
                  target: AbilityTarget.Player,
                  resource: ResourceType.Energy,
                  value: 1
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "657351040536713",
            path: "assets/images/cards_buff_swift-wind.png"
          }
        ]
      }
    ]
  };

  // ==================== bloombeasts\catalogs\commonAssets.ts ====================

  /**
   * Common Assets Catalog
   * Source of truth for UI elements, backgrounds, and shared assets
   * Edit this file directly to add/modify assets
   */


  export const commonAssets: AssetCatalog = {
    version: "1.0.0",
    category: CatalogCategory.Common,
    description: "Common UI elements, backgrounds, and shared assets",
    data: [
      {
        id: "background",
        type: AssetEntryType.UI,
        category: UICategory.Background,
        name: "Main Background",
        description: "Main game background",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1341821670869568",
            path: "assets/images/bg_background.png"
          }
        ]
      },
      {
        id: "menu",
        type: AssetEntryType.UI,
        category: UICategory.Background,
        name: "Menu Background",
        description: "Menu screen background",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1341821670869568",
            path: "assets/images/misc_menu.png"
          }
        ]
      },
      {
        id: "playboard",
        type: AssetEntryType.UI,
        category: UICategory.Background,
        name: "Playboard",
        description: "Battle playboard background",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "802255839066806",
            path: "assets/images/misc_playboard.png"
          }
        ]
      },
      {
        id: "cards-container",
        type: AssetEntryType.UI,
        category: UICategory.Container,
        name: "Cards Container",
        description: "Cards collection screen container",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1360422829007789",
            path: "assets/images/misc_cards-container.png"
          }
        ]
      },
      {
        id: "mission-container",
        type: AssetEntryType.UI,
        category: UICategory.Container,
        name: "Mission Container",
        description: "Mission selection container",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "828431839717203",
            path: "assets/images/misc_mission-container.png"
          }
        ]
      },
      {
        id: "standard-button",
        type: AssetEntryType.UI,
        category: UICategory.Button,
        name: "Standard Button",
        description: "Default button style (175x72)",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1976060856578244",
            path: "assets/images/ui_button_standard_default.png"
          }
        ]
      },
      {
        id: "green-button",
        type: AssetEntryType.UI,
        category: UICategory.Button,
        name: "Green Button",
        description: "Green variant button (175x72)",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "3694695314172287",
            path: "assets/images/ui_button_standard_green.png"
          }
        ]
      },
      {
        id: "red-button",
        type: AssetEntryType.UI,
        category: UICategory.Button,
        name: "Red Button",
        description: "Red variant button (175x72)",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1607838330179321",
            path: "assets/images/ui_button_standard_red.png"
          }
        ]
      },
      {
        id: "yellow-button",
        type: AssetEntryType.UI,
        category: UICategory.Button,
        name: "Yellow Button",
        description: "Yellow variant button (175x72)",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1977156269826109",
            path: "assets/images/ui_button_standard_yellow.png"
          }
        ]
      },
      {
        id: "long-green-button",
        type: AssetEntryType.UI,
        category: UICategory.Button,
        name: "Long Green Button",
        description: "Long green button variant",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1842026620010613",
            path: "assets/images/misc_long-green-button.png"
          }
        ]
      },
      {
        id: "small-button",
        type: AssetEntryType.UI,
        category: UICategory.Button,
        name: "Small Button",
        description: "Small button variant (89x89)",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "726833263789403",
            path: "assets/images/ui_button_small_default.png"
          }
        ]
      },
      {
        id: "container-side-menu",
        type: AssetEntryType.UI,
        category: UICategory.Container,
        name: "Side Menu Container",
        description: "Side menu panel container (225x497)",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "4238983773013268",
            path: "assets/images/ui_container_side-menu.png"
          }
        ]
      },
      {
        id: "player-stats-container",
        type: AssetEntryType.UI,
        category: UICategory.Container,
        name: "Player Stats Container",
        description: "Container for player stats display",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "2596874604027595",
            path: "assets/images/ui_container_player-stats.png"
          }
        ]
      },
      {
        id: "experience-bar",
        type: AssetEntryType.UI,
        category: UICategory.Other,
        name: "Experience Bar",
        description: "XP progress bar",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1151343029773719",
            path: "assets/images/cards_experience-bar.png"
          }
        ]
      },
      {
        id: "base-card",
        type: AssetEntryType.UI,
        category: UICategory.Frame,
        name: "Base Card Frame",
        description: "Default card frame template",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1549655239820199",
            path: "assets/images/cards_base-card.png"
          }
        ]
      },
      {
        id: "magic-card",
        type: AssetEntryType.UI,
        category: UICategory.Frame,
        name: "Magic Card Frame",
        description: "Magic card frame template",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "2581420452257174",
            path: "assets/images/cards_magic-card.png"
          }
        ]
      },
      {
        id: "magic-card-playboard",
        type: AssetEntryType.UI,
        category: UICategory.Frame,
        name: "Magic Card Playboard",
        description: "Magic card on playboard",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "2991234734402522",
            path: "assets/images/cards_magic-card-playboard.png"
          }
        ]
      },
      {
        id: "trap-card",
        type: AssetEntryType.UI,
        category: UICategory.Frame,
        name: "Trap Card Frame",
        description: "Trap card frame template",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "3122347641277336",
            path: "assets/images/cards_trap-card.png"
          }
        ]
      },
      {
        id: "trap-card-playboard",
        type: AssetEntryType.UI,
        category: UICategory.Frame,
        name: "Trap Card Playboard",
        description: "Trap card on playboard",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1724877334843483",
            path: "assets/images/cards_trap-card-playboard.png"
          }
        ]
      },
      {
        id: "buff-card",
        type: AssetEntryType.UI,
        category: UICategory.Frame,
        name: "Buff Card Frame",
        description: "Buff card frame template",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "3182045765293902",
            path: "assets/images/cards_buff-card.png"
          }
        ]
      },
      {
        id: "buff-card-playboard",
        type: AssetEntryType.UI,
        category: UICategory.Frame,
        name: "Buff Card Playboard",
        description: "Buff card on playboard",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "2628573627486992",
            path: "assets/images/cards_buff-card-playboard.png"
          }
        ]
      },
      {
        id: "menu-frame-1",
        type: AssetEntryType.UI,
        category: UICategory.Frame,
        name: "Menu Frame 1",
        description: "Menu animation frame 1",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1186506656766961",
            path: "assets/images/menu_frame-1.png"
          }
        ]
      },
      {
        id: "menu-frame-2",
        type: AssetEntryType.UI,
        category: UICategory.Frame,
        name: "Menu Frame 2",
        description: "Menu animation frame 2",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "816845231314389",
            path: "assets/images/menu_frame-2.png"
          }
        ]
      },
      {
        id: "menu-frame-3",
        type: AssetEntryType.UI,
        category: UICategory.Frame,
        name: "Menu Frame 3",
        description: "Menu animation frame 3",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "2012665279305528",
            path: "assets/images/menu_frame-3.png"
          }
        ]
      },
      {
        id: "menu-frame-4",
        type: AssetEntryType.UI,
        category: UICategory.Frame,
        name: "Menu Frame 4",
        description: "Menu animation frame 4",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "803392912558689",
            path: "assets/images/menu_frame-4.png"
          }
        ]
      },
      {
        id: "menu-frame-5",
        type: AssetEntryType.UI,
        category: UICategory.Frame,
        name: "Menu Frame 5",
        description: "Menu animation frame 5",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1141897134114548",
            path: "assets/images/menu_frame-5.png"
          }
        ]
      },
      {
        id: "menu-frame-6",
        type: AssetEntryType.UI,
        category: UICategory.Frame,
        name: "Menu Frame 6",
        description: "Menu animation frame 6",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1962288661350650",
            path: "assets/images/menu_frame-6.png"
          }
        ]
      },
      {
        id: "menu-frame-7",
        type: AssetEntryType.UI,
        category: UICategory.Frame,
        name: "Menu Frame 7",
        description: "Menu animation frame 7",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "781356411339489",
            path: "assets/images/menu_frame-7.png"
          }
        ]
      },
      {
        id: "menu-frame-8",
        type: AssetEntryType.UI,
        category: UICategory.Frame,
        name: "Menu Frame 8",
        description: "Menu animation frame 8",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "844985438202497",
            path: "assets/images/menu_frame-8.png"
          }
        ]
      },
      {
        id: "menu-frame-9",
        type: AssetEntryType.UI,
        category: UICategory.Frame,
        name: "Menu Frame 9",
        description: "Menu animation frame 9",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1340487887747224",
            path: "assets/images/menu_frame-9.png"
          }
        ]
      },
      {
        id: "menu-frame-10",
        type: AssetEntryType.UI,
        category: UICategory.Frame,
        name: "Menu Frame 10",
        description: "Menu animation frame 10",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1866001547625853",
            path: "assets/images/menu_frame-10.png"
          }
        ]
      },
      {
        id: "icon-attack",
        type: AssetEntryType.UI,
        category: UICategory.Icon,
        name: "Attack Icon",
        description: "Attack indicator icon",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "818969787355942",
            path: "assets/images/icon_attack.png"
          }
        ]
      },
      {
        id: "icon-coin",
        type: AssetEntryType.UI,
        category: UICategory.Icon,
        name: "Coin Icon",
        description: "Coin currency icon",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "4103662979871750",
            path: "assets/images/icon_coin.png"
          }
        ]
      },
      {
        id: "icon-serum",
        type: AssetEntryType.UI,
        category: UICategory.Icon,
        name: "Serum Icon",
        description: "Serum item icon",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1152818320384366",
            path: "assets/images/icon_serum.png"
          }
        ]
      },
      // Counter icons removed - counter system deprecated
      {
        id: "lose-image",
        type: AssetEntryType.UI,
        category: UICategory.Other,
        name: "Lose Image",
        description: "Game over/lose screen image",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "2155452308310801",
            path: "assets/images/misc_lose-image.png"
          }
        ]
      },
      {
        id: "sfx-menu-button-select",
        type: AssetEntryType.UI,
        category: UICategory.Other,
        name: "Menu Button Select SFX",
        description: "Sound for menu button selection",
        assets: [
          {
            type: AssetReferenceType.Audio,
            horizonAssetId: "3481449071995903",
            path: "assets/audio/sfx_menu-button-select.wav"
          }
        ]
      },
      {
        id: "sfx-play-card",
        type: AssetEntryType.UI,
        category: UICategory.Other,
        name: "Play Card SFX",
        description: "Sound for playing a card",
        assets: [
          {
            type: AssetReferenceType.Audio,
            horizonAssetId: "673115269189210",
            path: "assets/audio/sfx_play-card.wav"
          }
        ]
      },
      {
        id: "sfx-attack",
        type: AssetEntryType.UI,
        category: UICategory.Other,
        name: "Attack SFX",
        description: "Sound for attack action",
        assets: [
          {
            type: AssetReferenceType.Audio,
            horizonAssetId: "1718962638781724",
            path: "assets/audio/sfx_attack.wav"
          }
        ]
      },
      {
        id: "sfx-trap-card-activated",
        type: AssetEntryType.UI,
        category: UICategory.Other,
        name: "Trap Activated SFX",
        description: "Sound for trap activation",
        assets: [
          {
            type: AssetReferenceType.Audio,
            horizonAssetId: "1180175093968172",
            path: "assets/audio/sfx_trap-card-activated.wav"
          }
        ]
      },
      {
        id: "sfx-low-health",
        type: AssetEntryType.UI,
        category: UICategory.Other,
        name: "Low Health SFX",
        description: "Warning sound for low health",
        assets: [
          {
            type: AssetReferenceType.Audio,
            horizonAssetId: "828372796357589",
            path: "assets/audio/sfx_low-health.wav"
          }
        ]
      },
      {
        id: "sfx-win",
        type: AssetEntryType.UI,
        category: UICategory.Other,
        name: "Win SFX",
        description: "Victory sound effect",
        assets: [
          {
            type: AssetReferenceType.Audio,
            horizonAssetId: "4241684452770634",
            path: "assets/audio/sfx_win.wav"
          }
        ]
      },
      {
        id: "sfx-lose",
        type: AssetEntryType.UI,
        category: UICategory.Other,
        name: "Lose SFX",
        description: "Defeat sound effect",
        assets: [
          {
            type: AssetReferenceType.Audio,
            horizonAssetId: "1323050035978393",
            path: "assets/audio/sfx_lose.wav"
          }
        ]
      },
      {
        id: "sfx-upgrade",
        type: AssetEntryType.UI,
        category: UICategory.Other,
        name: "Upgrade SFX",
        description: "Sound for purchasing upgrades",
        assets: [
          {
            type: AssetReferenceType.Audio,
            horizonAssetId: "PLACEHOLDER_ID",
            path: "assets/audio/sfx_upgrade.wav"
          }
        ]
      },
      {
        id: "sfx-upgrade-rooster",
        type: AssetEntryType.UI,
        category: UICategory.Other,
        name: "Upgrade Rooster SFX",
        description: "Sound for purchasing rooster upgrade",
        assets: [
          {
            type: AssetReferenceType.Audio,
            horizonAssetId: "PLACEHOLDER_ID",
            path: "assets/audio/sfx_upgrade_rooster.wav"
          }
        ]
      },
      {
        id: "music-background",
        type: AssetEntryType.UI,
        category: UICategory.Other,
        name: "Background Music",
        description: "Main background music",
        assets: [
          {
            type: AssetReferenceType.Audio,
            horizonAssetId: "802288129374217",
            path: "assets/audio/music_background.mp3"
          }
        ]
      },
      {
        id: "music-battle",
        type: AssetEntryType.UI,
        category: UICategory.Other,
        name: "Battle Music",
        description: "Battle scene music",
        assets: [
          {
            type: AssetReferenceType.Audio,
            horizonAssetId: "668023946362739",
            path: "assets/audio/music_battle.mp3"
          }
        ]
      },
      {
        id: "upgrade-coin-boost",
        type: AssetEntryType.UI,
        category: UICategory.Upgrade,
        name: "Coin Boost Upgrade",
        description: "Coin boost upgrade icon",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1059820639487262",
            path: "assets/images/upgrade_coin-boost.png"
          }
        ]
      },
      {
        id: "upgrade-container-card",
        type: AssetEntryType.UI,
        category: UICategory.Upgrade,
        name: "Container Card Upgrade",
        description: "Container card upgrade icon",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "3158472954326260",
            path: "assets/images/upgrade_container-card.png"
          }
        ]
      },
      {
        id: "upgrade-exp-boost",
        type: AssetEntryType.UI,
        category: UICategory.Upgrade,
        name: "Experience Boost Upgrade",
        description: "Experience boost upgrade icon",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "662687460055242",
            path: "assets/images/upgrade_exp-boost.png"
          }
        ]
      },
      {
        id: "upgrade-luck-boost",
        type: AssetEntryType.UI,
        category: UICategory.Upgrade,
        name: "Luck Boost Upgrade",
        description: "Luck boost upgrade icon",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "2054672501734665",
            path: "assets/images/upgrade_luck-boost.png"
          }
        ]
      },
      {
        id: "upgrade-rooster",
        type: AssetEntryType.UI,
        category: UICategory.Upgrade,
        name: "Rooster Upgrade",
        description: "Rooster upgrade icon",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1504708944108154",
            path: "assets/images/upgrade_rooster.png"
          }
        ]
      },
      {
        id: "upgrade-upgraded-box",
        type: AssetEntryType.UI,
        category: UICategory.Upgrade,
        name: "Upgraded Box",
        description: "Upgraded box icon",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "814844064745019",
            path: "assets/images/upgrade_upgraded-box.png"
          }
        ]
      }
    ]
  };

  // ==================== bloombeasts\catalogs\fireAssets.ts ====================

  /**
   * Edit this file directly to add/modify assets
   */


  export const fireAssets: AssetCatalog = {
    version: "1.0.0",
    category: CatalogCategory.Fire,
    description: "Fire affinity cards and assets",
    data: [
      {
        id: "blazefinch",
        type: AssetEntryType.Beast,
        cardType: "Beast",
        affinity: AffinityLowercase.Fire,
        data: {
          id: "blazefinch",
          name: "Blazefinch",
          type: CardType.Beast,
          affinity: Affinity.Fire,
          cost: 1,
          baseAttack: 1,
          baseHealth: 2,
          abilities: [
            {
              name: "Quick Strike",
              trigger: AbilityTrigger.WhileOnField,
              effects: [
                {
                  type: EffectType.RemoveSummoningSickness,
                  target: AbilityTarget.Self
                }
              ]
            }
          ],
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "3218250765004566",
            path: "assets/images/cards_fire_blazefinch.png"
          }
        ]
      },
      {
        id: "cinder-pup",
        type: AssetEntryType.Beast,
        cardType: "Beast",
        affinity: AffinityLowercase.Fire,
        data: {
          id: "cinder-pup",
          name: "Cinder Pup",
          type: CardType.Beast,
          affinity: Affinity.Fire,
          cost: 2,
          baseAttack: 2,
          baseHealth: 3,
          abilities: [
            {
              name: "Burning Passion",
              trigger: AbilityTrigger.OnAttack,
              effects: [
                {
                  type: EffectType.DealDamage,
                  target: AbilityTarget.AttackedEnemy,
                  value: 1
                }
              ]
            }
          ],
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "913214814369510",
            path: "assets/images/cards_fire_cinder-pup.png"
          }
        ]
      },
      {
        id: "charcoil",
        type: AssetEntryType.Beast,
        cardType: "Beast",
        affinity: AffinityLowercase.Fire,
        data: {
          id: "charcoil",
          name: "Charcoil",
          type: CardType.Beast,
          affinity: Affinity.Fire,
          cost: 2,
          baseAttack: 3,
          baseHealth: 4,
          abilities: [
            {
              name: "Flame Retaliation",
              trigger: AbilityTrigger.OnDamage,
              effects: [
                {
                  type: "Retaliation",
                  target: AbilityTarget.Attacker,
                  value: 1
                }
              ]
            }
          ],
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "785856391096811",
            path: "assets/images/cards_fire_charcoil.png"
          }
        ]
      },
      {
        id: "magmite",
        type: AssetEntryType.Beast,
        cardType: "Beast",
        affinity: AffinityLowercase.Fire,
        data: {
          id: "magmite",
          name: "Magmite",
          type: CardType.Beast,
          affinity: Affinity.Fire,
          cost: 3,
          baseAttack: 4,
          baseHealth: 6,
          abilities: [
            {
              name: "Hardened Shell",
              trigger: AbilityTrigger.WhileOnField,
              effects: [
                {
                  type: EffectType.DamageReduction,
                  target: AbilityTarget.Self,
                  value: 1,
                  duration: EffectDuration.WhileOnField
                }
              ]
            }
          ],
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "25339017082348952",
            path: "assets/images/cards_fire_magmite.png"
          }
        ]
      },
      {
        id: "volcanic-scar",
        type: AssetEntryType.Habitat,
        affinity: AffinityLowercase.Fire,
        data: {
          id: "volcanic-scar",
          name: "Volcanic Scar",
          type: CardType.Habitat,
          affinity: Affinity.Fire,
          cost: 1,
          abilities: [
            {
              name: "Volcanic Eruption",
              trigger: AbilityTrigger.OnSummon,
              effects: [
                {
                  type: EffectType.DealDamage,
                  target: "AllUnits",
                  value: 1,
                  condition: {
                    type: "affinity-not-matches",
                    value: "Fire"
                  }
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1878791053043603",
            path: "assets/images/cards_fire_volcanic-scar.png"
          },
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1574158663591082",
            path: "assets/images/cards_fire_habitat-card.png"
          },
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1863280224222620",
            path: "assets/images/cards_fire_habitat-card-playboard.png"
          }
        ]
      },
      {
        id: "fire-mission",
        type: AssetEntryType.Mission,
        affinity: AffinityLowercase.Fire,
        name: "Fire Mission",
        description: "Fire affinity mission",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "795064546836933",
            path: "assets/images/cards_fire_fire-mission.png"
          }
        ]
      },
      {
        id: "fire-chest-closed",
        type: AssetEntryType.UI,
        category: UICategory.Chest,
        name: "Fire Chest Closed",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1168387145201364",
            path: "assets/images/chest_fire-chest-closed.png"
          }
        ]
      },
      {
        id: "fire-chest-opened",
        type: AssetEntryType.UI,
        category: UICategory.Chest,
        name: "Fire Chest Opened",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "3716217982005558",
            path: "assets/images/chest_fire-chest-opened.png"
          }
        ]
      },
      {
        id: "fire-icon",
        type: AssetEntryType.UI,
        category: UICategory.Icon,
        name: "Fire Icon",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "2011015256402906",
            path: "assets/images/affinity_fire-icon.png"
          }
        ]
      },
      {
        id: "fire-habitat",
        type: AssetEntryType.UI,
        category: UICategory.CardTemplate,
        name: "Fire Habitat Card Template",
        description: "Template overlay for fire habitat cards",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1574158663591082",
            path: "assets/images/cards_fire_habitat-card.png"
          }
        ]
      }
    ]
  };

  // ==================== bloombeasts\catalogs\forestAssets.ts ====================

  /**
   * Edit this file directly to add/modify assets
   */


  export const forestAssets: AssetCatalog = {
    version: "1.0.0",
    category: CatalogCategory.Forest,
    description: "Forest affinity cards and assets",
    data: [
      {
        id: "rootling",
        type: AssetEntryType.Beast,
        cardType: "Beast",
        affinity: AffinityLowercase.Forest,
        data: {
          id: "rootling",
          name: "Rootling",
          displayName: "Rootling",
          type: CardType.Beast,
          affinity: Affinity.Forest,
          cost: 1,
          baseAttack: 1,
          baseHealth: 3,
          abilities: [
            {
              name: "Deep Roots",
              trigger: AbilityTrigger.WhileOnField,
              effects: [
                {
                  type: EffectType.CannotBeTargeted,
                  target: AbilityTarget.Self,
                  by: [
                    "magic"
                  ]
                }
              ]
            }
          ],
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1170317305016635",
            path: "assets/images/cards_forest_rootling.png",
            description: "Rootling card artwork"
          }
        ]
      },
      {
        id: "leaf-sprite",
        type: AssetEntryType.Beast,
        cardType: "Beast",
        affinity: AffinityLowercase.Forest,
        data: {
          id: "leaf-sprite",
          name: "Leaf Sprite",
          displayName: "Leaf Sprite",
          type: CardType.Beast,
          affinity: Affinity.Forest,
          cost: 1,
          baseAttack: 1,
          baseHealth: 2,
          abilities: [
            {
              name: "Nimble",
              trigger: AbilityTrigger.OnSummon,
              effects: [
                {
                  type: EffectType.DrawCards,
                  target: AbilityTarget.Player,
                  value: 1
                }
              ]
            }
          ],
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1733091247346351",
            path: "assets/images/cards_forest_leaf-sprite.png",
            description: "Leaf Sprite card artwork"
          }
        ]
      },
      {
        id: "mosslet",
        type: AssetEntryType.Beast,
        cardType: "Beast",
        affinity: AffinityLowercase.Forest,
        data: {
          id: "mosslet",
          name: "Mosslet",
          displayName: "Mosslet",
          type: CardType.Beast,
          affinity: Affinity.Forest,
          cost: 2,
          baseAttack: 2,
          baseHealth: 2,
          abilities: [
            {
              name: "Growth",
              trigger: AbilityTrigger.OnOwnEndOfTurn,
              effects: [
                {
                  type: EffectType.ModifyStats,
                  target: AbilityTarget.Self,
                  stat: StatType.Both,
                  value: 1,
                  duration: EffectDuration.Permanent
                }
              ]
            }
          ],
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1344114090714721",
            path: "assets/images/cards_forest_mosslet.png",
            description: "Mosslet card artwork"
          }
        ]
      },
      {
        id: "mushroomancer",
        type: AssetEntryType.Beast,
        cardType: "Beast",
        affinity: AffinityLowercase.Forest,
        data: {
          id: "mushroomancer",
          name: "Mushroomancer",
          displayName: "Mushroomancer",
          type: CardType.Beast,
          affinity: Affinity.Forest,
          cost: 3,
          baseAttack: 3,
          baseHealth: 4,
          abilities: [
            {
              name: "Sporogenesis",
              trigger: AbilityTrigger.OnSummon,
              effects: [
                {
                  type: EffectType.DealDamage,
                  target: AbilityTarget.AllEnemies,
                  value: 2
                }
              ]
            }
          ],
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1393693032328550",
            path: "assets/images/cards_forest_mushroomancer.png",
            description: "Mushroomancer card artwork"
          }
        ]
      },
      {
        id: "ancient-forest",
        type: AssetEntryType.Habitat,
        affinity: AffinityLowercase.Forest,
        data: {
          id: "ancient-forest",
          name: "Ancient Forest",
          displayName: "Ancient Forest",
          type: CardType.Habitat,
          affinity: Affinity.Forest,
          cost: 0,
          abilities: [
            {
              name: "Forest Sanctuary",
              trigger: AbilityTrigger.WhileOnField,
              effects: [
                {
                  type: EffectType.ModifyStats,
                  target: AbilityTarget.AllAllies,
                  stat: StatType.Health,
                  value: 1,
                  duration: EffectDuration.WhileOnField
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1625867191715184",
            path: "assets/images/cards_forest_ancient-forest.png",
            description: "Ancient Forest habitat card artwork"
          },
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "715084184317947",
            path: "assets/images/cards_forest_habitat-card.png",
            description: "Forest habitat card template"
          },
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "805969505504149",
            path: "assets/images/cards_forest_habitat-card-playboard.png",
            description: "Forest habitat card playboard"
          }
        ]
      },
      {
        id: "forest-mission",
        type: AssetEntryType.Mission,
        affinity: AffinityLowercase.Forest,
        name: "Forest Mission",
        description: "Forest affinity mission",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1351984712974001",
            path: "assets/images/cards_forest_forest-mission.png",
            description: "Forest mission card"
          }
        ]
      },
      {
        id: "forest-chest-closed",
        type: AssetEntryType.UI,
        category: UICategory.Chest,
        name: "Forest Chest Closed",
        description: "Forest chest in closed state",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "678586941962889",
            path: "assets/images/chest_forest-chest-closed.png"
          }
        ]
      },
      {
        id: "forest-chest-opened",
        type: AssetEntryType.UI,
        category: UICategory.Chest,
        name: "Forest Chest Opened",
        description: "Forest chest in opened state",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1859963367965524",
            path: "assets/images/chest_forest-chest-opened.png"
          }
        ]
      },
      {
        id: "forest-icon",
        type: AssetEntryType.UI,
        category: UICategory.Icon,
        name: "Forest Icon",
        description: "Forest affinity icon",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1869425844004279",
            path: "assets/images/affinity_forest-icon.png"
          }
        ]
      },
      {
        id: "forest-habitat",
        type: AssetEntryType.UI,
        category: UICategory.CardTemplate,
        name: "Forest Habitat Card Template",
        description: "Template overlay for forest habitat cards",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "715084184317947",
            path: "assets/images/cards_forest_habitat-card.png"
          }
        ]
      }
    ]
  };

  // ==================== bloombeasts\catalogs\magicAssets.ts ====================

  /**
   * Edit this file directly to add/modify assets
   */


  export const magicAssets: AssetCatalog = {
    version: "1.0.0",
    category: CatalogCategory.Magic,
    description: "Magic cards and assets",
    data: [
      {
        id: "aether-swap",
        type: AssetEntryType.Magic,
        cardType: "Magic",
        data: {
          id: "aether-swap",
          name: "Aether Swap",
          type: CardType.Magic,
          cost: 1,
          targetRequired: false,
          abilities: [
            {
              name: "Aether Swap",
              trigger: AbilityTrigger.OnSummon,
              effects: [
                {
                  type: EffectType.ReturnToHand,
                  target: AbilityTarget.AllAllies,
                  value: 1
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1846483789630405",
            path: "assets/images/cards_magic_aether-swap.png"
          }
        ]
      },
      {
        id: "cleansing-downpour",
        type: AssetEntryType.Magic,
        cardType: "Magic",
        data: {
          id: "cleansing-downpour",
          name: "Cleansing Downpour",
          type: CardType.Magic,
          cost: 2,
          targetRequired: false,
          abilities: [
            {
              name: "Cleansing Downpour",
              trigger: AbilityTrigger.OnSummon,
              effects: [
                {
                  type: EffectType.DrawCards,
                  target: "Player",
                  value: 1
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "710755475386192",
            path: "assets/images/cards_magic_cleansing-downpour.png"
          }
        ]
      },
      {
        id: "elemental-burst",
        type: AssetEntryType.Magic,
        cardType: "Magic",
        data: {
          id: "elemental-burst",
          name: "Elemental Burst",
          type: CardType.Magic,
          cost: 3,
          targetRequired: false,
          abilities: [
            {
              name: "Elemental Burst",
              trigger: AbilityTrigger.OnSummon,
              effects: [
                {
                  type: EffectType.DealDamage,
                  target: AbilityTarget.AllEnemies,
                  value: 2
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1585232092889726",
            path: "assets/images/cards_magic_elemental-burst.png"
          }
        ]
      },
      {
        id: "lightning-strike",
        type: AssetEntryType.Magic,
        cardType: "Magic",
        data: {
          id: "lightning-strike",
          name: "Lightning Strike",
          type: CardType.Magic,
          cost: 2,
          targetRequired: false,
          abilities: [
            {
              name: "Lightning Strike",
              trigger: AbilityTrigger.OnSummon,
              effects: [
                {
                  type: EffectType.DealDamage,
                  target: AbilityTarget.LowestHealthEnemy,
                  value: 5,
                  piercing: true
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1155953239812167",
            path: "assets/images/cards_magic_lightning-strike.png"
          }
        ]
      },
      {
        id: "nectar-block",
        type: AssetEntryType.Magic,
        cardType: "Magic",
        data: {
          id: "nectar-block",
          name: "Energy Block",
          type: CardType.Magic,
          cost: 0,
          targetRequired: false,
          abilities: [
            {
              name: "Energy Block",
              trigger: AbilityTrigger.OnSummon,
              effects: [
                {
                  type: EffectType.GainResource,
                  target: "Player",
                  resource: ResourceType.Energy,
                  value: 2,
                  duration: EffectDuration.ThisTurn
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1092559439363693",
            path: "assets/images/cards_magic_energy-block.png"
          }
        ]
      },
      {
        id: "nectar-drain",
        type: AssetEntryType.Magic,
        cardType: "Magic",
        data: {
          id: "nectar-drain",
          name: "Energy Drain",
          type: CardType.Magic,
          cost: 1,
          targetRequired: false,
          abilities: [
            {
              name: "Energy Drain",
              trigger: AbilityTrigger.OnSummon,
              effects: [
                {
                  type: EffectType.GainResource,
                  target: "Player",
                  resource: ResourceType.Energy,
                  value: 2,
                  duration: EffectDuration.ThisTurn
                },
                {
                  type: EffectType.DrawCards,
                  target: "Player",
                  value: 1
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1754732031852523",
            path: "assets/images/cards_magic_energy-drain.png"
          }
        ]
      },
      {
        id: "nectar-surge",
        type: AssetEntryType.Magic,
        cardType: "Magic",
        data: {
          id: "nectar-surge",
          name: "Energy Surge",
          type: CardType.Magic,
          cost: 1,
          targetRequired: false,
          abilities: [
            {
              name: "Energy Surge",
              trigger: AbilityTrigger.OnSummon,
              effects: [
                {
                  type: EffectType.GainResource,
                  target: "Player",
                  resource: ResourceType.Energy,
                  value: 3,
                  duration: EffectDuration.ThisTurn
                },
                {
                  type: EffectType.DrawCards,
                  target: "Player",
                  value: 1
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1379310950488534",
            path: "assets/images/cards_magic_energy-surge.png"
          }
        ]
      },
      {
        id: "overgrowth",
        type: AssetEntryType.Magic,
        cardType: "Magic",
        data: {
          id: "overgrowth",
          name: "Overgrowth",
          type: CardType.Magic,
          cost: 3,
          targetRequired: false,
          abilities: [
            {
              name: "Overgrowth",
              trigger: AbilityTrigger.OnSummon,
              effects: [
                {
                  type: EffectType.ModifyStats,
                  target: AbilityTarget.AllAllies,
                  stat: StatType.Both,
                  value: 2,
                  duration: EffectDuration.Permanent
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1489977038895297",
            path: "assets/images/cards_magic_overgrowth.png"
          }
        ]
      },
      {
        id: "power-up",
        type: AssetEntryType.Magic,
        cardType: "Magic",
        data: {
          id: "power-up",
          name: "Power Up",
          type: CardType.Magic,
          cost: 2,
          targetRequired: false,
          abilities: [
            {
              name: "Power Up",
              trigger: AbilityTrigger.OnSummon,
              effects: [
                {
                  type: EffectType.ModifyStats,
                  target: AbilityTarget.RandomAlly,
                  stat: StatType.Both,
                  value: 3,
                  duration: EffectDuration.Permanent
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1140750044697552",
            path: "assets/images/cards_magic_power-up.png"
          }
        ]
      },
      {
        id: "purify",
        type: AssetEntryType.Magic,
        cardType: "Magic",
        data: {
          id: "purify",
          name: "Purify",
          type: CardType.Magic,
          cost: 1,
          targetRequired: false,
          abilities: [
            {
              name: "Purify",
              trigger: AbilityTrigger.OnSummon,
              effects: [
                {
                  type: EffectType.Heal,
                  target: AbilityTarget.RandomAlly,
                  value: 3
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "681285418362907",
            path: "assets/images/cards_magic_purify.png"
          }
        ]
      }
    ]
  };

  // ==================== bloombeasts\catalogs\skyAssets.ts ====================

  /**
   * Edit this file directly to add/modify assets
   */


  export const skyAssets: AssetCatalog = {
    version: "1.0.0",
    category: CatalogCategory.Sky,
    description: "Sky affinity cards and assets",
    data: [
      {
        id: "aero-moth",
        type: AssetEntryType.Beast,
        cardType: "Beast",
        affinity: AffinityLowercase.Sky,
        data: {
          id: "aero-moth",
          name: "Aero Moth",
          type: CardType.Beast,
          affinity: Affinity.Sky,
          cost: 2,
          baseAttack: 3,
          baseHealth: 3,
          abilities: [
            {
              name: "Wing Flutter",
              trigger: AbilityTrigger.OnSummon,
              effects: [
                {
                  type: EffectType.DrawCards,
                  target: AbilityTarget.Player,
                  value: 1
                }
              ]
            }
          ],
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1857788838498496",
            path: "assets/images/cards_sky_aero-moth.png"
          }
        ]
      },
      {
        id: "cirrus-floof",
        type: AssetEntryType.Beast,
        cardType: "Beast",
        affinity: AffinityLowercase.Sky,
        data: {
          id: "cirrus-floof",
          name: "Cirrus Floof",
          type: CardType.Beast,
          affinity: Affinity.Sky,
          cost: 2,
          baseAttack: 1,
          baseHealth: 6,
          abilities: [
            {
              name: "Lightness",
              trigger: AbilityTrigger.WhileOnField,
              effects: [
                {
                  type: EffectType.CannotBeTargeted,
                  target: AbilityTarget.Self,
                  by: [
                    "high-cost-units"
                  ],
                  costThreshold: 3
                }
              ]
            }
          ],
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "849446287592530",
            path: "assets/images/cards_sky_cirrus-floof.png"
          }
        ]
      },
      {
        id: "gale-glider",
        type: AssetEntryType.Beast,
        cardType: "Beast",
        affinity: AffinityLowercase.Sky,
        data: {
          id: "gale-glider",
          name: "Gale Glider",
          type: CardType.Beast,
          affinity: Affinity.Sky,
          cost: 1,
          baseAttack: 2,
          baseHealth: 2,
          abilities: [
            {
              name: "First Wind",
              trigger: AbilityTrigger.WhileOnField,
              effects: [
                {
                  type: EffectType.AttackModification,
                  target: AbilityTarget.Self,
                  modification: "attack-first"
                }
              ]
            }
          ],
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1854780382097596",
            path: "assets/images/cards_sky_gale-glider.png"
          }
        ]
      },
      {
        id: "star-bloom",
        type: AssetEntryType.Beast,
        cardType: "Beast",
        affinity: AffinityLowercase.Sky,
        data: {
          id: "star-bloom",
          name: "Star Bloom",
          type: CardType.Beast,
          affinity: Affinity.Sky,
          cost: 3,
          baseAttack: 4,
          baseHealth: 5,
          abilities: [
            {
              name: "Aura",
              trigger: AbilityTrigger.WhileOnField,
              effects: [
                {
                  type: EffectType.ModifyStats,
                  target: AbilityTarget.AllAllies,
                  stat: StatType.Attack,
                  value: 1,
                  duration: EffectDuration.WhileOnField
                }
              ]
            }
          ],
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "737222956003560",
            path: "assets/images/cards_sky_star-bloom.png"
          }
        ]
      },
      {
        id: "clear-zenith",
        type: AssetEntryType.Habitat,
        affinity: AffinityLowercase.Sky,
        data: {
          id: "clear-zenith",
          name: "Clear Zenith",
          type: CardType.Habitat,
          affinity: Affinity.Sky,
          cost: 1,
          titleColor: "#000000",
          abilities: [
            {
              name: "Sky Vision",
              trigger: AbilityTrigger.OnSummon,
              effects: [
                {
                  type: EffectType.DrawCards,
                  target: AbilityTarget.Player,
                  value: 1
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1941325056416004",
            path: "assets/images/cards_sky_clear-zenith.png"
          },
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "724533667339482",
            path: "assets/images/cards_sky_habitat-card.png"
          },
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "674037762415336",
            path: "assets/images/cards_sky_habitat-card-playboard.png"
          }
        ]
      },
      {
        id: "sky-mission",
        type: AssetEntryType.Mission,
        affinity: AffinityLowercase.Sky,
        name: "Sky Mission",
        description: "Sky affinity mission",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1076415204381099",
            path: "assets/images/cards_sky_sky-mission.png"
          }
        ]
      },
      {
        id: "sky-chest-closed",
        type: AssetEntryType.UI,
        category: UICategory.Chest,
        name: "Sky Chest Closed",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1988442925266143",
            path: "assets/images/chest_sky-chest-closed.png"
          }
        ]
      },
      {
        id: "sky-chest-opened",
        type: AssetEntryType.UI,
        category: UICategory.Chest,
        name: "Sky Chest Opened",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "766596743048030",
            path: "assets/images/chest_sky-chest-opened.png"
          }
        ]
      },
      {
        id: "sky-icon",
        type: AssetEntryType.UI,
        category: UICategory.Icon,
        name: "Sky Icon",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "2078365889573892",
            path: "assets/images/affinity_sky-icon.png"
          }
        ]
      },
      {
        id: "sky-habitat",
        type: AssetEntryType.UI,
        category: UICategory.CardTemplate,
        name: "Sky Habitat Card Template",
        description: "Template overlay for sky habitat cards",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "724533667339482",
            path: "assets/images/cards_sky_habitat-card.png"
          }
        ]
      }
    ]
  };

  // ==================== bloombeasts\catalogs\trapAssets.ts ====================

  /**
   * Edit this file directly to add/modify assets
   */


  export const trapAssets: AssetCatalog = {
    version: "1.0.0",
    category: CatalogCategory.Trap,
    description: "Trap cards and assets",
    data: [
      {
        id: "bear-trap",
        type: AssetEntryType.Trap,
        cardType: "Trap",
        data: {
          id: "bear-trap",
          name: "Bear Trap",
          type: CardType.Trap,
          cost: 1,
          activation: {
            trigger: TrapTrigger.OnAttack
          },
          abilities: [
            {
              name: "Bear Trap",
              trigger: AbilityTrigger.OnSummon,
              effects: [
                {
                  type: EffectType.DealDamage,
                  target: AbilityTarget.Attacker,
                  value: 3
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1518992622460625",
            path: "assets/images/cards_trap_bear-trap.png"
          }
        ]
      },
      {
        id: "emergency-bloom",
        type: AssetEntryType.Trap,
        cardType: "Trap",
        data: {
          id: "emergency-bloom",
          name: "Emergency Bloom",
          type: CardType.Trap,
          cost: 1,
          activation: {
            trigger: TrapTrigger.OnDestroy
          },
          abilities: [
            {
              name: "Emergency Bloom",
              trigger: AbilityTrigger.OnSummon,
              effects: [
                {
                  type: EffectType.DrawCards,
                  target: AbilityTarget.Player,
                  value: 2
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "2247657455738264",
            path: "assets/images/cards_trap_emergency-bloom.png"
          }
        ]
      },
      {
        id: "habitat-lock",
        type: AssetEntryType.Trap,
        cardType: "Trap",
        data: {
          id: "habitat-lock",
          name: "Habitat Lock",
          type: CardType.Trap,
          cost: 1,
          activation: {
            trigger: TrapTrigger.OnHabitatPlay
          },
          abilities: [
            {
              name: "Habitat Lock",
              trigger: AbilityTrigger.OnSummon,
              effects: [
                {
                  type: EffectType.NullifyEffect,
                  target: AbilityTarget.PlayedCard
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "609610328807674",
            path: "assets/images/cards_trap_habitat-lock.png"
          }
        ]
      },
      {
        id: "habitat-shield",
        type: AssetEntryType.Trap,
        cardType: "Trap",
        data: {
          id: "habitat-shield",
          name: "Habitat Shield",
          type: CardType.Trap,
          cost: 2,
          activation: {
            trigger: TrapTrigger.OnHabitatPlay
          },
          abilities: [
            {
              name: "Habitat Shield",
              trigger: AbilityTrigger.OnSummon,
              effects: [
                {
                  type: EffectType.NullifyEffect,
                  target: AbilityTarget.PlayedCard
                },
                {
                  type: EffectType.DrawCards,
                  target: AbilityTarget.Player,
                  value: 1
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1362245262078336",
            path: "assets/images/cards_trap_habitat-shield.png"
          }
        ]
      },
      {
        id: "magic-shield",
        type: AssetEntryType.Trap,
        cardType: "Trap",
        data: {
          id: "magic-shield",
          name: "Magic Shield",
          type: CardType.Trap,
          cost: 1,
          activation: {
            trigger: TrapTrigger.OnMagicPlay
          },
          abilities: [
            {
              name: "Magic Shield",
              trigger: AbilityTrigger.OnSummon,
              effects: [
                {
                  type: EffectType.NullifyEffect,
                  target: AbilityTarget.PlayedCard
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1239098601311749",
            path: "assets/images/cards_trap_magic-sheild.png"
          }
        ]
      },
      {
        id: "thorn-snare",
        type: AssetEntryType.Trap,
        cardType: "Trap",
        data: {
          id: "thorn-snare",
          name: "Thorn Snare",
          type: CardType.Trap,
          cost: 2,
          activation: {
            trigger: TrapTrigger.OnAttack
          },
          abilities: [
            {
              name: "Thorn Snare",
              trigger: AbilityTrigger.OnSummon,
              effects: [
                {
                  type: EffectType.PreventAttack,
                  target: AbilityTarget.Attacker,
                  duration: EffectDuration.Instant
                },
                {
                  type: EffectType.DealDamage,
                  target: AbilityTarget.Attacker,
                  value: 2
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "4210265565909373",
            path: "assets/images/cards_trap_thorn-snare.png"
          }
        ]
      },
      {
        id: "vaporize",
        type: AssetEntryType.Trap,
        cardType: "Trap",
        data: {
          id: "vaporize",
          name: "Vaporize",
          type: CardType.Trap,
          cost: 2,
          activation: {
            trigger: TrapTrigger.OnBeastPlay,
            condition: {
              type: "CostBelow",
              value: 4
            }
          },
          abilities: [
            {
              name: "Vaporize",
              trigger: AbilityTrigger.OnSummon,
              effects: [
                {
                  type: EffectType.Destroy,
                  target: AbilityTarget.PlayedCard
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1903759173890506",
            path: "assets/images/cards_trap_vaporize.png"
          }
        ]
      },
      {
        id: "xp-harvest",
        type: AssetEntryType.Trap,
        cardType: "Trap",
        data: {
          id: "xp-harvest",
          name: "XP Harvest",
          type: CardType.Trap,
          cost: 1,
          activation: {
            trigger: TrapTrigger.OnDestroy
          },
          abilities: [
            {
              name: "XP Harvest",
              trigger: AbilityTrigger.OnSummon,
              effects: [
                {
                  type: EffectType.DealDamage,
                  target: AbilityTarget.Attacker,
                  value: 2
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "807213335392971",
            path: "assets/images/cards_trap_xpharvest.png"
          }
        ]
      }
    ]
  };

  // ==================== bloombeasts\catalogs\waterAssets.ts ====================

  /**
   * Edit this file directly to add/modify assets
   */


  export const waterAssets: AssetCatalog = {
    version: "1.0.0",
    category: CatalogCategory.Water,
    description: "Water affinity cards and assets",
    data: [
      {
        id: "aqua-pebble",
        type: AssetEntryType.Beast,
        cardType: "Beast",
        affinity: AffinityLowercase.Water,
        data: {
          id: "aqua-pebble",
          name: "Aqua Pebble",
          type: CardType.Beast,
          affinity: Affinity.Water,
          cost: 1,
          baseAttack: 1,
          baseHealth: 4,
          abilities: [
            {
              name: "Tide Flow",
              trigger: "OnAllySummon",
              effects: [
                {
                  type: EffectType.ModifyStats,
                  target: AbilityTarget.Self,
                  stat: StatType.Attack,
                  value: 1,
                  duration: EffectDuration.EndOfTurn,
                  condition: {
                    type: "AffinityMatches",
                    value: "Water"
                  }
                }
              ]
            }
          ],
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "2542562209453452",
            path: "assets/images/cards_water_aqua-pebble.png"
          }
        ]
      },
      {
        id: "bubblefin",
        type: AssetEntryType.Beast,
        cardType: "Beast",
        affinity: AffinityLowercase.Water,
        data: {
          id: "bubblefin",
          name: "Bubblefin",
          type: CardType.Beast,
          affinity: Affinity.Water,
          cost: 2,
          baseAttack: 2,
          baseHealth: 5,
          abilities: [
            {
              name: "Emerge",
              trigger: AbilityTrigger.WhileOnField,
              effects: [
                {
                  type: EffectType.CannotBeTargeted,
                  target: AbilityTarget.Self,
                  by: [
                    "trap"
                  ]
                }
              ]
            }
          ],
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "2957682524429594",
            path: "assets/images/cards_water_bubblefin.png"
          }
        ]
      },
      {
        id: "dewdrop-drake",
        type: AssetEntryType.Beast,
        cardType: "Beast",
        affinity: AffinityLowercase.Water,
        data: {
          id: "dewdrop-drake",
          name: "Dewdrop Drake",
          type: CardType.Beast,
          affinity: Affinity.Water,
          cost: 3,
          baseAttack: 3,
          baseHealth: 6,
          abilities: [
            {
              name: "Mist Screen",
              trigger: AbilityTrigger.WhileOnField,
              effects: [
                {
                  type: EffectType.AttackModification,
                  target: AbilityTarget.Self,
                  modification: "attack-first",
                  condition: {
                    type: "UnitsOnField",
                    value: 1,
                    comparison: "Equal"
                  }
                }
              ]
            }
          ],
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1232407695362881",
            path: "assets/images/cards_water_dewdrop-drake.png"
          }
        ]
      },
      {
        id: "kelp-cub",
        type: AssetEntryType.Beast,
        cardType: "Beast",
        affinity: AffinityLowercase.Water,
        data: {
          id: "kelp-cub",
          name: "Kelp Cub",
          type: CardType.Beast,
          affinity: Affinity.Water,
          cost: 2,
          baseAttack: 3,
          baseHealth: 3,
          abilities: [
            {
              name: "Entangle",
              trigger: AbilityTrigger.OnAttack,
              effects: [
                {
                  type: "PreventAttack",
                  target: AbilityTarget.AttackedEnemy,
                  duration: "StartOfNextTurn"
                }
              ]
            }
          ],
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "2278603722605464",
            path: "assets/images/cards_water_kelp-cub.png"
          }
        ]
      },
      {
        id: "deep-sea-grotto",
        type: AssetEntryType.Habitat,
        affinity: AffinityLowercase.Water,
        data: {
          id: "deep-sea-grotto",
          name: "Deep Sea Grotto",
          type: CardType.Habitat,
          affinity: Affinity.Water,
          cost: 1,
          abilities: [
            {
              name: "Aquatic Empowerment",
              trigger: AbilityTrigger.WhileOnField,
              effects: [
                {
                  type: EffectType.ModifyStats,
                  target: AbilityTarget.AllAllies,
                  stat: StatType.Attack,
                  value: 1,
                  duration: EffectDuration.WhileOnField,
                  condition: {
                    type: "AffinityMatches",
                    value: "Water"
                  }
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "594002380404766",
            path: "assets/images/cards_water_deep-sea-grotto.png"
          },
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1356075539231203",
            path: "assets/images/cards_water_habitat-card.png"
          },
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "805465575687502",
            path: "assets/images/cards_water_habitat-card-playboard.png"
          }
        ]
      },
      {
        id: "water-mission",
        type: AssetEntryType.Mission,
        affinity: AffinityLowercase.Water,
        name: "Water Mission",
        description: "Water affinity mission",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1204438218330106",
            path: "assets/images/cards_water_water-mission.png"
          }
        ]
      },
      {
        id: "water-chest-closed",
        type: AssetEntryType.UI,
        category: UICategory.Chest,
        name: "Water Chest Closed",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1502977104283894",
            path: "assets/images/chest_water-chest-closed.png"
          }
        ]
      },
      {
        id: "water-chest-opened",
        type: AssetEntryType.UI,
        category: UICategory.Chest,
        name: "Water Chest Opened",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "817919940747617",
            path: "assets/images/chest_water-chest-opened.png"
          }
        ]
      },
      {
        id: "water-icon",
        type: AssetEntryType.UI,
        category: UICategory.Icon,
        name: "Water Icon",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "803389222302576",
            path: "assets/images/affinity_water-icon.png"
          }
        ]
      },
      {
        id: "water-habitat",
        type: AssetEntryType.UI,
        category: UICategory.CardTemplate,
        name: "Water Habitat Card Template",
        description: "Template overlay for water habitat cards",
        assets: [
          {
            type: AssetReferenceType.Image,
            horizonAssetId: "1356075539231203",
            path: "assets/images/cards_water_habitat-card.png"
          }
        ]
      }
    ]
  };

  // ==================== bloombeasts\catalogs\index.ts ====================

  /**
   * Asset Catalog Index
   * Source of truth for all game assets
   */



  // Export all catalogs as array for easy loading

  export const allCatalogs: AssetCatalog[] = [
    bossAssets,
    buffAssets,
    commonAssets,
    fireAssets,
    forestAssets,
    magicAssets,
    skyAssets,
    trapAssets,
    waterAssets
  ];

}

// Export the namespace as a module
export { BloomBeasts };

// Make BloomBeasts available globally
if (typeof globalThis !== 'undefined') {
  (globalThis as any).BloomBeasts = BloomBeasts;
}
