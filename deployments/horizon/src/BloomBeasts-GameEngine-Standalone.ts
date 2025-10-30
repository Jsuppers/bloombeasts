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
 * Generated: 2025-10-30T10:53:47.944Z
 * Files: 96
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
   * Comprehensive ability system types for Bloom Beasts
   */


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

  // ==================== bloombeasts\engine\types\core.ts ====================

  /**
   * Core type definitions for Bloom Beasts card game
   */


  export type Affinity = 'Forest' | 'Fire' | 'Water' | 'Sky' | 'Generic';

  export type CardType = 'Magic' | 'Trap' | 'Bloom' | 'Habitat' | 'Buff';

  export type CounterType = 'XP' | 'Spore' | 'Burn' | 'Freeze' | 'Soot' | 'Entangle';

  export interface Counter {
    type: CounterType;
    amount: number;
  }

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
    OnBloomPlay = 'OnBloomPlay',          // When opponent plays a Bloom Beast
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
    type: 'Magic';
    abilities: Ability[];  // Standardized to use abilities like BloomBeast cards
    targetRequired?: boolean;  // Whether the card needs a target
  }

  /**
   * Trap card
   */
  export interface TrapCard extends Card {
    type: 'Trap';
    activation: TrapActivation;  // Structured activation instead of string
    abilities: Ability[];         // Standardized to use abilities like BloomBeast cards
    counters?: Counter[];  // Optional counters on the trap card
  }

  /**
   * Habitat card
   */
  export interface HabitatCard extends Card {
    type: 'Habitat';
    affinity: Affinity;
    abilities: Ability[];  // Standardized to use abilities like BloomBeast cards
    counters?: Counter[];  // Optional counters on the habitat card
  }

  /**
   * Buff card - stays on board and provides ongoing effects
   */
  export interface BuffCard extends Card {
    type: 'Buff';
    affinity?: Affinity;  // Optional affinity for buff cards
    abilities: Ability[];  // Standardized to use abilities like BloomBeast cards
    duration?: number;  // Optional turn duration (undefined = permanent)
    counters?: Counter[];  // Optional counters on the buff card
  }

  /**
   * Ability upgrade at a specific level
   */
  export interface AbilityUpgrade {
    abilities?: Ability[];  // Additional abilities to add at this level
  }

  /**
   * Custom leveling configuration for a Bloom Beast
   */
  export interface LevelingConfig {
    /** Custom XP requirements per level (overrides defaults) */
    xpRequirements?: Partial<Record<2 | 3 | 4 | 5 | 6 | 7 | 8 | 9, number>>;
    /** Custom stat gains per level (overrides defaults) - cumulative values */
    statGains?: Record<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9, { hp: number; atk: number }>;
    /** Ability upgrades at specific levels (4, 7, 9) */
    abilityUpgrades?: Partial<Record<4 | 7 | 9, AbilityUpgrade>>;
  }

  /**
   * Bloom Beast card
   */
  export interface BloomBeastCard extends Card {
    type: 'Bloom';
    affinity: Affinity;
    baseAttack: number;
    baseHealth: number;
    abilities: Ability[];  // Array of passive abilities (triggered automatically)
    /** Optional custom leveling configuration */
    levelingConfig?: LevelingConfig;
    // Note: Card definitions are blueprints. All cards (Bloom, Magic, Trap, Habitat, Buff)
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
  export type XPSource = 'Combat' | 'NectarSacrifice';

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

  /**
   * Beast instance with leveling state
   */
  export interface BloomBeastInstance {
    cardId: string;
    instanceId: string;

    // Card properties (from blueprint)
    name: string;
    affinity: Affinity;

    // Base stats (card stats + level bonuses, never includes buffs/modifiers)
    baseAttack: number;
    baseHealth: number;

    // Current stats (calculated from base + all modifiers)
    currentLevel: Level;
    currentXP: number;
    currentAttack: number;
    currentHealth: number;
    maxHealth: number;

    // Stat modification tracking
    statModifiers?: StatModifier[];

    // Counters and effects
    counters: Counter[];
    statusEffects: any[];  // Status effects like burn, freeze, etc.

    // Positioning
    slotIndex: number;

    // Combat state
    summoningSickness: boolean;

    // New properties for ability system
    temporaryHP?: number;
    temporaryEffects?: TemporaryEffect[];
    immunities?: Array<string>;
    cannotBeTargetedBy?: Array<string>;
    targetingRestrictions?: TargetingRestrictions;
    attackModifications?: Array<string>;
    preventions?: PreventionEffect[];
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
  export enum BattleState {
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
  export type Phase = 'Setup' | 'Draw' | 'Main' | 'Combat' | 'End';

  export interface Player {
    id?: string;
    name: string;
    health: number;
    maxHealth?: number;
    nectar?: number;
    permanentNectar?: number;
    temporaryNectar?: number;
    currentNectar: number;  // Available nectar this turn
    summonsThisTurn: number; // Track summons for extra summon effects
    deck: AnyCard[];
    hand: AnyCard[];
    discardPile?: AnyCard[];
    graveyard: AnyCard[];  // Cards that have been destroyed
    field: (BloomBeastInstance | null)[]; // Nullable for empty slots
    trapZone: (AnyCard | null)[]; // Face-down trap cards (max 3)
    buffZone: (AnyCard | null)[]; // Active buff cards (max 2)
    habitatCounters: SimpleMap<string, number>; // Counters specific to this player's habitat
  }

  export interface GameState {
    players: [Player, Player];
    currentPlayerIndex?: 0 | 1;
    activePlayer: 0 | 1;  // Current player's turn
    habitatZone: HabitatCard | null;
    habitatCounters?: Counter[]; // Counters on the habitat (like Spores)
    turn: number;
    phase: Phase;  // Kept for backward compatibility
    battleState: BattleState;  // New state-based battle flow
    turnHistory: any[];  // History of actions taken
    // Pending actions that need to be resolved
    drawCardsQueued?: number;
    drawForPlayerIndex?: 0 | 1;
    pendingMove?: {
      unit: BloomBeastInstance;
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
    source: 'Combat' | 'NectarSacrifice';
  }

  export interface HabitatShiftAction extends GameAction {
    type: 'HABITAT_SHIFT';
    habitatCardId: string;
  }

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

  export const NECTAR_XP_COST = 1;

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
    field: (BloomBeastInstance | null)[],
    callback: (beast: BloomBeastInstance | null, index: number) => void
  ): void {
    field.forEach((beast, index) => callback(beast, index));
  }

  /**
   * Iterate over only non-null beasts in the field
   * @param field The field array
   * @param callback Function to call for each beast
   */
  export function forEachActiveBeast(
    field: (BloomBeastInstance | null)[],
    callback: (beast: BloomBeastInstance, index: number) => void
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
  export function getAllSlots(field: (BloomBeastInstance | null)[]): (BloomBeastInstance | null)[] {
    return [...field];
  }

  /**
   * Get all non-null beasts from the field
   * @param field The field array
   * @returns Array of beasts (no nulls)
   */
  export function getAllBeasts(field: (BloomBeastInstance | null)[]): BloomBeastInstance[] {
    return field.filter((beast): beast is BloomBeastInstance => beast !== null);
  }

  /**
   * Get all alive (HP > 0) beasts from the field
   * @param field The field array
   * @returns Array of alive beasts
   */
  export function getAliveBeasts(field: (BloomBeastInstance | null)[]): BloomBeastInstance[] {
    return field.filter(
      (beast): beast is BloomBeastInstance => beast !== null && beast.currentHealth > 0
    );
  }

  /**
   * Get all dead (HP <= 0) beasts from the field
   * @param field The field array
   * @returns Array of dead beasts
   */
  export function getDeadBeasts(field: (BloomBeastInstance | null)[]): BloomBeastInstance[] {
    return field.filter(
      (beast): beast is BloomBeastInstance => beast !== null && beast.currentHealth <= 0
    );
  }

  /**
   * Count alive beasts in the field
   * @param field The field array
   * @returns Number of alive beasts
   */
  export function countAliveBeasts(field: (BloomBeastInstance | null)[]): number {
    return getAliveBeasts(field).length;
  }

  /**
   * Count total beasts in the field (excluding null slots)
   * @param field The field array
   * @returns Number of beasts
   */
  export function countBeasts(field: (BloomBeastInstance | null)[]): number {
    return getAllBeasts(field).length;
  }

  /**
   * Find first empty slot in the field
   * @param field The field array
   * @returns Index of first empty slot, or -1 if none
   */
  export function findEmptySlot(field: (BloomBeastInstance | null)[]): number {
    return field.findIndex((beast) => beast === null);
  }

  /**
   * Check if field has any empty slots
   * @param field The field array
   * @returns True if at least one empty slot exists
   */
  export function hasEmptySlot(field: (BloomBeastInstance | null)[]): boolean {
    return findEmptySlot(field) !== -1;
  }

  /**
   * Check if field is full (no empty slots)
   * @param field The field array
   * @returns True if no empty slots
   */
  export function isFieldFull(field: (BloomBeastInstance | null)[]): boolean {
    return !hasEmptySlot(field);
  }

  /**
   * Get beasts by affinity
   * @param field The field array
   * @param affinity The affinity to filter by
   * @returns Array of beasts with matching affinity
   */
  export function getBeastsByAffinity(
    field: (BloomBeastInstance | null)[],
    affinity: string
  ): BloomBeastInstance[] {
    return getAllBeasts(field).filter((beast) => beast.affinity === affinity);
  }

  /**
   * Get beast at specific index
   * @param field The field array
   * @param index The slot index
   * @returns Beast at index or null
   */
  export function getBeastAtIndex(
    field: (BloomBeastInstance | null)[],
    index: number
  ): BloomBeastInstance | null {
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
    field: (BloomBeastInstance | null)[],
    instanceId: string
  ): { beast: BloomBeastInstance; index: number } | null {
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
    field: (BloomBeastInstance | null)[],
    index: number
  ): BloomBeastInstance[] {
    const adjacent: BloomBeastInstance[] = [];

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
  export function clearDeadBeasts(player: Player): BloomBeastInstance[] {
    const deadBeasts: BloomBeastInstance[] = [];

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
  export function getTotalAttackPower(field: (BloomBeastInstance | null)[]): number {
    return getAliveBeasts(field).reduce((total, beast) => total + beast.currentAttack, 0);
  }

  /**
   * Get total health of all alive beasts
   * @param field The field array
   * @returns Sum of all health values
   */
  export function getTotalHealth(field: (BloomBeastInstance | null)[]): number {
    return getAliveBeasts(field).reduce((total, beast) => total + beast.currentHealth, 0);
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

  // ==================== bloombeasts\engine\systems\AbilityProcessor.ts ====================

  /**
   * Ability Processor - Executes ability effects in the game
   */


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

  export class AbilityProcessor implements IAbilityProcessor {
    /**
     * Deep clone a beast instance to avoid reference issues
     */
    private cloneBeast(beast: BloomBeastInstance): BloomBeastInstance {
      return {
        ...beast,
        counters: beast.counters.map(c => ({ ...c })),
        temporaryEffects: beast.temporaryEffects?.map(e => ({ ...e })) || [],
        statusEffects: [...beast.statusEffects],
        immunities: beast.immunities ? [...beast.immunities] : undefined,
        cannotBeTargetedBy: beast.cannotBeTargetedBy ? [...beast.cannotBeTargetedBy] : undefined,
        attackModifications: beast.attackModifications ? [...beast.attackModifications] : undefined,
        preventions: beast.preventions?.map(p => ({ ...p })) || undefined,
        targetingRestrictions: beast.targetingRestrictions ? { ...beast.targetingRestrictions } : undefined,
      };
    }

    /**
     * Process a structured ability
     */
    processAbility(
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
    private canUseAbility(
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
    private processEffect(
      effect: AbilityEffect,
      context: AbilityContext
    ): EffectResult {
      // Check condition if present
      if (effect.condition && !this.checkCondition(effect.condition, context)) {
        return { success: false, message: 'Condition not met' };
      }

      // Get targets
      const targets = this.resolveTargets(effect.target, context);
      if (targets.length === 0 && effect.target !== AbilityTarget.OpponentGardener && effect.target !== AbilityTarget.PlayerGardener) {
        return { success: false, message: 'No valid targets' };
      }

      // Process based on effect type
      switch (effect.type) {
        case EffectType.ModifyStats:
          return this.processStatModification(effect as StatModificationEffect, targets, context);
        case EffectType.DealDamage:
          return this.processDamage(effect as DamageEffect, targets, context);
        case EffectType.Heal:
          return this.processHeal(effect as HealEffect, targets, context);
        case EffectType.DrawCards:
          return this.processDrawCards(effect as DrawCardEffect, context);
        case EffectType.ApplyCounter:
          return this.processApplyCounter(effect as ApplyCounterEffect, targets, context);
        case EffectType.Immunity:
          return this.processImmunity(effect as ImmunityEffect, targets, context);
        case EffectType.CannotBeTargeted:
          return this.processCannotBeTargeted(effect as CannotBeTargetedEffect, targets, context);
        case EffectType.AttackModification:
          return this.processAttackModification(effect as AttackModificationEffect, context);
        case EffectType.MoveUnit:
          return this.processMoveUnit(effect as MoveEffect, targets, context);
        case EffectType.GainResource:
          return this.processResourceGain(effect as ResourceGainEffect, context);
        case EffectType.PreventAttack:
        case EffectType.PreventAbilities:
          return this.processPrevent(effect as PreventEffect, targets, context);
        case EffectType.Destroy:
          return this.processDestroy(effect as DestroyEffect, targets, context);
        case EffectType.TemporaryHP:
          return this.processTemporaryHP(effect as TemporaryHPEffect, targets, context);
        default:
          return { success: false, message: 'Unknown effect type' };
      }
    }

    /**
     * Resolve targets based on target type
     */
    private resolveTargets(
      targetType: AbilityTarget,
      context: AbilityContext
    ): BloomBeastInstance[] {
      const targets: BloomBeastInstance[] = [];

      switch (targetType) {
        case AbilityTarget.Self:
          targets.push(context.source);
          break;
        case AbilityTarget.Target:
          if (context.target) targets.push(context.target);
          break;
        case AbilityTarget.Attacker:
          if (context.attacker) targets.push(context.attacker);
          break;
        case AbilityTarget.AllAllies:
          targets.push(...getAllBeasts(context.controllingPlayer.field));
          break;
        case AbilityTarget.OtherAlly:
          // Get all allies except self
          targets.push(...getAllBeasts(context.controllingPlayer.field)
            .filter(beast => beast.instanceId !== context.source.instanceId));
          break;
        case AbilityTarget.AllEnemies:
          targets.push(...getAllBeasts(context.opposingPlayer.field));
          break;
        case AbilityTarget.AdjacentAllies:
          const adjacentAllies = getAdjacentBeasts(context.controllingPlayer.field, context.source.slotIndex);
          targets.push(...adjacentAllies);
          break;
        case AbilityTarget.AdjacentEnemies:
          const adjacentIndices = [context.source.slotIndex - 1, context.source.slotIndex, context.source.slotIndex + 1]
            .filter(i => i >= 0 && i < 5);
          for (const idx of adjacentIndices) {
            if (context.opposingPlayer.field[idx]) {
              targets.push(context.opposingPlayer.field[idx]!);
            }
          }
          break;
        case AbilityTarget.RandomEnemy:
          const enemies = getAllBeasts(context.opposingPlayer.field);
          const randomEnemy = pickRandom(enemies);
          if (randomEnemy) {
            targets.push(randomEnemy);
          }
          break;
        case AbilityTarget.DamagedEnemies:
          targets.push(...context.opposingPlayer.field
            .filter(u => u !== null && u.currentHealth < u.maxHealth) as BloomBeastInstance[]);
          break;
        case AbilityTarget.WiltingEnemies:
          targets.push(...context.opposingPlayer.field
            .filter(u => u !== null && u.currentHealth === 1) as BloomBeastInstance[]);
          break;
        case AbilityTarget.HighestAttackEnemy:
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
        case AbilityTarget.LowestHealthEnemy:
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
    private checkCondition(
      condition: AbilityCondition,
      context: AbilityContext
    ): boolean {
      switch (condition.type) {
        case ConditionType.HasCounter:
          return context.source.counters.some(c => c.type === condition.value);
        case ConditionType.HealthBelow:
          return context.source.currentHealth < (condition.value as number);
        case ConditionType.HealthAbove:
          return context.source.currentHealth > (condition.value as number);
        case ConditionType.IsDamaged:
          return context.source.currentHealth < context.source.maxHealth;
        case ConditionType.IsWilting:
          return context.source.currentHealth === 1;
        case ConditionType.AffinityMatches:
          // For OnAllySummon trigger, check the target (summoned beast)'s affinity
          // For other triggers, check the source beast's affinity
          if (context.trigger === 'OnAllySummon' && context.target) {
            return context.target.affinity === condition.value;
          }
          const cardDef = context.sourceCard;
          return !!(cardDef && 'affinity' in cardDef && cardDef.affinity === condition.value);
        default:
          return true;
      }
    }

    /**
     * Process stat modification effect
     */
    private processStatModification(
      effect: StatModificationEffect,
      targets: BloomBeastInstance[],
      context: AbilityContext
    ): EffectResult {
      const modifiedUnits: BloomBeastInstance[] = [];

      for (const target of targets) {
        const modified = this.cloneBeast(target);

        if (effect.stat === StatType.Attack || effect.stat === StatType.Both) {
          modified.currentAttack = Math.max(0, modified.currentAttack + effect.value);
        }

        if (effect.stat === StatType.Health || effect.stat === StatType.Both) {
          modified.currentHealth = Math.min(
            modified.maxHealth,
            Math.max(0, modified.currentHealth + effect.value)
          );
          if (effect.duration === EffectDuration.Permanent && effect.value > 0) {
            modified.maxHealth += effect.value;
          }
        }

        // Store duration info if not permanent
        if (effect.duration !== EffectDuration.Permanent) {
          modified.temporaryEffects = modified.temporaryEffects || [];
          modified.temporaryEffects.push({
            type: 'stat-mod',
            stat: effect.stat,
            value: effect.value,
            duration: effect.duration,
            turnsRemaining: effect.duration === EffectDuration.EndOfTurn ? 0 : 1,
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
    private processDamage(
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

        const modified = this.cloneBeast(target);
        modified.currentHealth = Math.max(0, modified.currentHealth - damage);
        totalDamage += damage;
        modifiedUnits.push(modified);
      }

      // Handle damage to gardener
      if (effect.target === AbilityTarget.OpponentGardener) {
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
    private processHeal(
      effect: HealEffect,
      targets: BloomBeastInstance[],
      context: AbilityContext
    ): EffectResult {
      const modifiedUnits: BloomBeastInstance[] = [];

      for (const target of targets) {
        const modified = this.cloneBeast(target);
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
    private processDrawCards(
      effect: DrawCardEffect,
      context: AbilityContext
    ): EffectResult {
      // Determine which player should draw based on target
      let drawForPlayerIndex: 0 | 1;
      if (effect.target === AbilityTarget.OpponentGardener) {
        // Draw for opponent
        drawForPlayerIndex = context.gameState.players[0] === context.opposingPlayer ? 0 : 1;
      } else {
        // Default: PlayerGardener or other - draw for controlling player
        drawForPlayerIndex = context.gameState.players[0] === context.controllingPlayer ? 0 : 1;
      }

      return {
        success: true,
        message: `Draw ${effect.value} card(s)`,
        modifiedState: {
          drawCardsQueued: effect.value,
          drawForPlayerIndex,
        },
      };
    }

    /**
     * Process apply counter effect
     */
    private processApplyCounter(
      effect: ApplyCounterEffect,
      targets: BloomBeastInstance[],
      context: AbilityContext
    ): EffectResult {
      const modifiedUnits: BloomBeastInstance[] = [];

      for (const target of targets) {
        const modified = this.cloneBeast(target);
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
    private processImmunity(
      effect: ImmunityEffect,
      targets: BloomBeastInstance[],
      context: AbilityContext
    ): EffectResult {
      const modifiedUnits: BloomBeastInstance[] = [];

      for (const target of targets) {
        const modified = this.cloneBeast(target);
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
    private processCannotBeTargeted(
      effect: CannotBeTargetedEffect,
      targets: BloomBeastInstance[],
      context: AbilityContext
    ): EffectResult {
      const modifiedUnits: BloomBeastInstance[] = [];

      for (const target of targets) {
        const modified = this.cloneBeast(target);
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
    private processAttackModification(
      effect: AttackModificationEffect,
      context: AbilityContext
    ): EffectResult {
      const modified = this.cloneBeast(context.source);
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
    private processMoveUnit(
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
    private processResourceGain(
      effect: ResourceGainEffect,
      context: AbilityContext
    ): EffectResult {
      switch (effect.resource) {
        case ResourceType.Nectar:
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
        case ResourceType.ExtraSummon:
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
    private processPrevent(
      effect: PreventEffect,
      targets: BloomBeastInstance[],
      context: AbilityContext
    ): EffectResult {
      const modifiedUnits: BloomBeastInstance[] = [];

      for (const target of targets) {
        const modified = this.cloneBeast(target);
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
     * Process destroy effect
     */
    private processDestroy(
      effect: DestroyEffect,
      targets: BloomBeastInstance[],
      context: AbilityContext
    ): EffectResult {
      const modifiedUnits: BloomBeastInstance[] = [];

      for (const target of targets) {
        const modified = this.cloneBeast(target);
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
    private processTemporaryHP(
      effect: TemporaryHPEffect,
      targets: BloomBeastInstance[],
      context: AbilityContext
    ): EffectResult {
      const modifiedUnits: BloomBeastInstance[] = [];

      for (const target of targets) {
        const modified = this.cloneBeast(target);
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
  export const STARTING_HEALTH = 10;
  export const GARDENER_MAX_HEALTH = 10;

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
  export const MAX_NECTAR = 10;
  export const MIN_NECTAR = 0;

  // Level Configuration
  export const MIN_LEVEL = 1;
  // MAX_LEVEL is defined in leveling.ts

  // Stat Limits
  export const MAX_ATTACK = 99;
  export const MAX_HEALTH = 99;
  export const MIN_ATTACK = 0;
  export const MIN_HEALTH = 1;

  // Counter Limits
  export const MAX_COUNTERS = 10;

  // Card Limits
  export const MAX_COPIES_PER_CARD = 3;

  // Battle Configuration
  export const FIRST_PLAYER_DRAWS_ON_FIRST_TURN = false;

  // ==================== bloombeasts\engine\systems\CombatSystem.ts ====================

  /**
   * Combat System - Handles battle mechanics and turn flow
   */


  export interface CombatResult {
    winner: 'player1' | 'player2' | 'draw';
    turnsPlayed: number;
    damageDealt: {
      player1: number;
      player2: number;
    };
    xpGained: {
      player1: SimpleMap<string, number>;
      player2: SimpleMap<string, number>;
    };
  }

  export class CombatSystem implements ICombatSystem {
    private abilityProcessor: AbilityProcessor;
    private levelingSystem: LevelingSystem;
    private currentTurn: number = 0;
    private maxTurns: number = MAX_TURNS;

    constructor() {
      this.abilityProcessor = new AbilityProcessor();
      this.levelingSystem = new LevelingSystem();
    }

    /**
     * Execute a combat phase between two players
     */
    public async executeCombat(
      gameState: GameState,
      attacker: Player,
      defender: Player
    ): Promise<void> {
      Logger.debug(`Combat phase: ${attacker.name} attacks ${defender.name}`);

      // Note: Full combat resolution is implemented in GameEngine.ts
      // The GameEngine handles:
      // 1. Pre-attack abilities (via triggerCombatAbilities with 'OnAttack')
      // 2. Damage calculation (processAttack method)
      // 3. Damage application (via applyDamage or direct health modification)
      // 4. On-damage abilities (via triggerCombatAbilities with 'OnDamage')
      // 5. Defeat detection and graveyard management
      // 6. XP awards (via LevelingSystem.addCombatXP)
    }

    /**
     * Process an attack between two beasts
     */
    public processAttack(
      attacker: BloomBeastInstance,
      defender: BloomBeastInstance,
      gameState: GameState
    ): number {
      const baseDamage = attacker.currentAttack;

      // Note: Damage modifiers are applied through:
      // - Status effects on the beast (stored in statusEffects array)
      // - Habitat zone ongoing effects (ModifyStats effects)
      // - Buff zone ongoing effects (ModifyStats effects)
      // - Counter effects (Burn, Freeze, etc.)
      // The GameEngine applies these modifiers when calculating final stats

      return baseDamage;
    }

    /**
     * Apply damage to a beast
     */
    public applyDamage(
      target: BloomBeastInstance,
      damage: number,
      source: BloomBeastInstance | null = null
    ): void {
      target.currentHealth = Math.max(0, target.currentHealth - damage);

      if (target.currentHealth === 0) {
        this.handleDefeat(target, source);
      }
    }

    /**
     * Handle a beast being defeated
     */
    private handleDefeat(
      defeated: BloomBeastInstance,
      victor: BloomBeastInstance | null
    ): void {
      Logger.debug(`${defeated.cardId} was defeated!`);

      if (victor) {
        // Award combat XP
        this.levelingSystem.addCombatXP(victor);
      }

      // Note: On-destroy abilities and field removal are handled by GameEngine:
      // - GameEngine.executeAttack triggers 'OnDestroy' abilities via triggerCombatAbilities
      // - GameEngine.executeAttack removes defeated beasts from field and adds to graveyard
      // - GameEngine.processCounterEffects also handles death from burn/poison effects
    }

    /**
     * Check if combat should end
     */
    public checkWinCondition(gameState: GameState): CombatResult | null {
      const player1Health = gameState.players[0].health;
      const player2Health = gameState.players[1].health;

      // Check for player health reaching 0
      if (player1Health <= 0 && player2Health <= 0) {
        return this.createCombatResult('draw', gameState);
      } else if (player1Health <= 0) {
        return this.createCombatResult('player2', gameState);
      } else if (player2Health <= 0) {
        return this.createCombatResult('player1', gameState);
      }

      // Check for beasts on field
      const player1HasBeasts = getAliveBeasts(gameState.players[0].field).length > 0;
      const player2HasBeasts = getAliveBeasts(gameState.players[1].field).length > 0;

      if (!player1HasBeasts && !player2HasBeasts) {
        return this.createCombatResult('draw', gameState);
      } else if (!player1HasBeasts) {
        return this.createCombatResult('player2', gameState);
      } else if (!player2HasBeasts) {
        return this.createCombatResult('player1', gameState);
      }

      // Check for max turns
      if (this.currentTurn >= this.maxTurns) {
        return this.createCombatResult('draw', gameState);
      }

      return null;
    }

    /**
     * Create combat result summary
     */
    private createCombatResult(
      winner: 'player1' | 'player2' | 'draw',
      gameState: GameState
    ): CombatResult {
      return {
        winner,
        turnsPlayed: this.currentTurn,
        damageDealt: {
          player1: STARTING_HEALTH - gameState.players[1].health,
          player2: STARTING_HEALTH - gameState.players[0].health,
        },
        xpGained: {
          player1: new SimpleMap(),
          player2: new SimpleMap(),
        },
      };
    }

    /**
     * Reset combat system for new battle
     */
    public reset(): void {
      this.currentTurn = 0;
    }
  }

  // ==================== bloombeasts\engine\systems\interfaces.ts ====================

  /**
   * Interfaces for dependency injection and testability
   *
   * These interfaces define contracts for major system components,
   * allowing for easier testing, mocking, and alternative implementations.
   */


  /**
   * IAbilityProcessor - Processes ability effects in the game
   */
  export interface IAbilityProcessor {
    /**
     * Process a structured ability
     */
    processAbility(
      ability: StructuredAbility,
      context: AbilityContext
    ): EffectResult[];
  }

  /**
   * ICombatSystem - Handles battle mechanics and turn flow
   */
  export interface ICombatSystem {
    /**
     * Execute a combat phase between two players
     */
    executeCombat(
      gameState: GameState,
      attacker: Player,
      defender: Player
    ): Promise<void>;

    /**
     * Process an attack between two beasts
     */
    processAttack(
      attacker: BloomBeastInstance,
      defender: BloomBeastInstance,
      gameState: GameState
    ): number;

    /**
     * Apply damage to a beast
     */
    applyDamage(
      target: BloomBeastInstance,
      damage: number,
      source: BloomBeastInstance | null
    ): void;

    /**
     * Check if combat should end
     */
    checkWinCondition(gameState: GameState): CombatResult | null;

    /**
     * Reset combat system for new battle
     */
    reset(): void;
  }

  /**
   * ILevelingSystem - Handles XP gain, level ups, and stat progression
   */
  export interface ILevelingSystem {
    /**
     * Add XP to a Bloom Beast
     */
    addXP(
      beast: BloomBeastInstance,
      amount: number,
      source: XPSource,
      card?: BloomBeastCard
    ): BloomBeastInstance;

    /**
     * Add XP from combat victory
     */
    addCombatXP(beast: BloomBeastInstance, card?: BloomBeastCard): BloomBeastInstance;

    /**
     * Add XP from nectar sacrifice
     */
    addNectarXP(
      beast: BloomBeastInstance,
      nectarSpent: number,
      card?: BloomBeastCard
    ): BloomBeastInstance;

    /**
     * Check if a beast can level up
     */
    canLevelUp(beast: BloomBeastInstance, card?: BloomBeastCard): boolean;

    /**
     * Level up a beast
     */
    levelUp(beast: BloomBeastInstance, card?: BloomBeastCard): BloomBeastInstance;

    /**
     * Get stat gains for leveling from previous level to current level
     */
    getStatGain(
      newLevel: Level,
      card?: BloomBeastCard
    ): { attackGain: number; healthGain: number };

    /**
     * Get total stat bonus at a given level
     */
    getTotalStatBonus(level: Level, card?: BloomBeastCard): { hp: number; atk: number };

    /**
     * Calculate current stats for a beast based on base stats and level
     */
    calculateCurrentStats(
      baseCard: BloomBeastCard,
      level: Level
    ): { attack: number; health: number };

    /**
     * Create a new beast instance from a card
     */
    createBeastInstance(
      card: BloomBeastCard,
      instanceId: string,
      slotIndex: number
    ): BloomBeastInstance;

    /**
     * Get XP requirement for next level
     */
    getXPRequirement(currentLevel: Level, card?: BloomBeastCard): number | null;

    /**
     * Get current abilities for a beast based on its level
     */
    getCurrentAbilities(card: BloomBeastCard, level: Level): { abilities: Ability[] };

    /**
     * Check if a beast has an ability upgrade at the current level
     */
    hasAbilityUpgrade(card: BloomBeastCard, level: Level): boolean;
  }

  // ==================== bloombeasts\engine\systems\LevelingSystem.ts ====================

  /**
   * Leveling System - Handles XP gain, level ups, and stat progression
   */


  export class LevelingSystem implements ILevelingSystem {
    /**
     * Add XP to a Bloom Beast
     */
    addXP(
      beast: BloomBeastInstance,
      amount: number,
      source: XPSource,
      card?: BloomBeastCard
    ): BloomBeastInstance {
      const updatedBeast = { ...beast };
      updatedBeast.currentXP += amount;

      // Check if level up is possible
      if (this.canLevelUp(updatedBeast, card)) {
        return this.levelUp(updatedBeast, card);
      }

      return updatedBeast;
    }

    /**
     * Add XP from combat victory
     */
  addCombatXP(beast: BloomBeastInstance, card?: BloomBeastCard): BloomBeastInstance {
      return this.addXP(beast, 1, 'Combat', card);
    }

    /**
     * Add XP from nectar sacrifice
     */
  addNectarXP(beast: BloomBeastInstance, nectarSpent: number, card?: BloomBeastCard): BloomBeastInstance {
      const xpGained = nectarSpent / NECTAR_XP_COST;
      return this.addXP(beast, xpGained, 'NectarSacrifice', card);
    }

    /**
     * Get XP requirement for a specific level, considering custom config
     */
    private getXPRequirementForLevel(level: Level, card?: BloomBeastCard): number {
      // Level 1 doesn't require XP
      if (level === 1) {
        return 0;
      }
      // Check custom XP requirements for levels 2-9
      const customXP = card?.levelingConfig?.xpRequirements?.[level as 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9];
      if (customXP !== undefined) {
        return customXP;
      }
      return XP_REQUIREMENTS[level];
    }

    /**
     * Check if a beast can level up
     */
  canLevelUp(beast: BloomBeastInstance, card?: BloomBeastCard): boolean {
      if (beast.currentLevel >= MAX_LEVEL) {
        return false;
      }

      const nextLevel = (beast.currentLevel + 1) as Level;
      const xpRequired = this.getXPRequirementForLevel(nextLevel, card);

      return beast.currentXP >= xpRequired;
    }

    /**
     * Level up a beast
     */
  levelUp(beast: BloomBeastInstance, card?: BloomBeastCard): BloomBeastInstance {
      if (!this.canLevelUp(beast, card)) {
        return beast;
      }

      const updatedBeast = { ...beast };
      const nextLevel = (updatedBeast.currentLevel + 1) as Level;
      const xpRequired = this.getXPRequirementForLevel(nextLevel, card);

      // Remove XP counters and increase level
      updatedBeast.currentXP -= xpRequired;
      updatedBeast.currentLevel = nextLevel;

      // Apply stat gains
      const statGain = this.getStatGain(updatedBeast.currentLevel, card);
      updatedBeast.currentAttack += statGain.attackGain;
      updatedBeast.currentHealth += statGain.healthGain;
      updatedBeast.maxHealth += statGain.healthGain;

      // Check for level up again (in case there's excess XP)
      if (this.canLevelUp(updatedBeast, card)) {
        return this.levelUp(updatedBeast, card);
      }

      return updatedBeast;
    }

    /**
     * Get stat gains for leveling from previous level to current level
     */
  getStatGain(
      newLevel: Level,
      card?: BloomBeastCard
    ): { attackGain: number; healthGain: number } {
      const previousLevel = (newLevel - 1) as Level;

      // Check for custom stat gains
      const customCurrent = card?.levelingConfig?.statGains?.[newLevel];
      const customPrevious = card?.levelingConfig?.statGains?.[previousLevel];

      if (customCurrent && customPrevious) {
        return {
          attackGain: customCurrent.atk - customPrevious.atk,
          healthGain: customCurrent.hp - customPrevious.hp,
        };
      }

      // Use default progression
      const currentStats = STAT_PROGRESSION[newLevel];
      const previousStats = STAT_PROGRESSION[previousLevel];

      return {
        attackGain: currentStats.cumulativeATK - previousStats.cumulativeATK,
        healthGain: currentStats.cumulativeHP - previousStats.cumulativeHP,
      };
    }

    /**
     * Get total stat bonus at a given level
     */
  getTotalStatBonus(level: Level, card?: BloomBeastCard): { hp: number; atk: number } {
      // Check for custom stat gains
      const customStats = card?.levelingConfig?.statGains?.[level];
      if (customStats) {
        return {
          hp: customStats.hp,
          atk: customStats.atk,
        };
      }

      // Use default progression
      const stats = STAT_PROGRESSION[level];
      return {
        hp: stats.cumulativeHP,
        atk: stats.cumulativeATK,
      };
    }

    /**
     * Calculate current stats for a beast based on base stats and level
     */
  calculateCurrentStats(
      baseCard: BloomBeastCard,
      level: Level
    ): { attack: number; health: number } {
      const bonus = this.getTotalStatBonus(level, baseCard);
      return {
        attack: baseCard.baseAttack + bonus.atk,
        health: baseCard.baseHealth + bonus.hp,
      };
    }

    /**
     * Create a new beast instance from a card
     */
  createBeastInstance(
      card: BloomBeastCard,
      instanceId: string,
      slotIndex: number
    ): BloomBeastInstance {
      const stats = this.calculateCurrentStats(card, 1);

      return {
        cardId: card.id,
        instanceId,
        name: card.name,
        affinity: card.affinity,
        currentLevel: 1,
        currentXP: 0,
        baseAttack: card.baseAttack,
        baseHealth: card.baseHealth,
        currentAttack: stats.attack,
        currentHealth: stats.health,
        maxHealth: stats.health,
        counters: [],
        statusEffects: [],
        slotIndex,
        summoningSickness: true,
      };
    }

    /**
     * Get XP requirement for next level
     */
  getXPRequirement(currentLevel: Level, card?: BloomBeastCard): number | null {
      if (currentLevel >= MAX_LEVEL) {
        return null;
      }

      const nextLevel = (currentLevel + 1) as Level;
      return this.getXPRequirementForLevel(nextLevel, card);
    }

    /**
     * Get current abilities for a beast based on its level
     */
  getCurrentAbilities(card: BloomBeastCard, level: Level) {
      // Start with base abilities
      let abilities = [...card.abilities];

      // Check for ability upgrades at level milestones
      // Use the most recent complete ability set for the current level
      const upgrades = card.levelingConfig?.abilityUpgrades;
      if (upgrades) {
        // Check each upgrade level in reverse order (9, 7, 4) to find the most recent applicable upgrade
        const upgradeLevels: Array<4 | 7 | 9> = [9, 7, 4];
        for (const lvl of upgradeLevels) {
          if (level >= lvl && upgrades[lvl]) {
            const upgrade = upgrades[lvl];
            if (upgrade && upgrade.abilities) {
              // Use this upgrade's abilities as the complete set
              abilities = [...upgrade.abilities];
              break;  // Found the most recent upgrade, stop looking
            }
          }
        }
      }

      return { abilities };
    }

    /**
     * Check if a beast has an ability upgrade at the current level
     */
  hasAbilityUpgrade(card: BloomBeastCard, level: Level): boolean {
      if (level !== 4 && level !== 7 && level !== 9) return false;
      return card.levelingConfig?.abilityUpgrades?.[level as 4 | 7 | 9] !== undefined;
    }
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
   * Shared core cards (card IDs)
   */
  const SHARED_CORE_CARD_IDS: DeckCardIdEntry[] = [
    // Basic resource generation
    { cardId: 'nectar-block', quantity: 10 },
    { cardId: 'nectar-surge', quantity: 2 },
    { cardId: 'nectar-drain', quantity: 1 },

    // Removal and utility
    { cardId: 'cleansing-downpour', quantity: 1 },
    { cardId: 'purify', quantity: 1 },
    { cardId: 'lightning-strike', quantity: 1 },
    { cardId: 'elemental-burst', quantity: 1 },

    // Buffs and positioning
    { cardId: 'power-up', quantity: 1 },
    { cardId: 'overgrowth', quantity: 1 },
    { cardId: 'aether-swap', quantity: 1 },

    // Trap cards
    { cardId: 'habitat-lock', quantity: 1 },
    { cardId: 'magic-shield', quantity: 1 },
    { cardId: 'habitat-shield', quantity: 1 },
    { cardId: 'bear-trap', quantity: 1 },
    { cardId: 'thorn-snare', quantity: 1 },
    { cardId: 'vaporize', quantity: 1 },
    { cardId: 'emergency-bloom', quantity: 1 },
    { cardId: 'xp-harvest', quantity: 1 },
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
    // TESTING: Use testing deck with 1 of each card
    return getTestingDeck(type);

    // ORIGINAL: Starter deck with multiple copies
    // return buildDeck(type);
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
   * Check if a card is a Bloom Beast
   */
  export function isBloomBeast(card: AnyCard): card is BloomBeastCard {
    return card.type === 'Bloom';
  }

  /**
   * Filter cards by type
   */
  export function filterByType<T extends CardType>(cards: AnyCard[], type: T): Extract<AnyCard, { type: T }>[] {
    return cards.filter((card) => card.type === type) as Extract<AnyCard, { type: T }>[];
  }

  /**
   * Filter Bloom Beasts by affinity
   */
  export function filterByAffinity(cards: AnyCard[], affinity: Affinity): BloomBeastCard[] {
    return cards.filter((card): card is BloomBeastCard => isBloomBeast(card) && card.affinity === affinity);
  }

  /**
   * Get all Bloom Beasts from a card list
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

  // ==================== bloombeasts\screens\cards\types.ts ====================

  /**
   * Type definitions for the card collection system
   */


  /**
   * Minimal card instance in player's collection
   * All other data (level, stats, etc.) is computed on-demand from currentXP and card definition
   */
  export interface CardInstance {
    id: string;                    // Unique instance ID (e.g., "forest-bloom-1-1")
    cardId: string;                 // Base card ID (e.g., "forest-bloom")
    currentXP: number;              // Only persistent data - everything else is derived
  }

  /**
   * Statistics for the card collection
   */
  export interface CollectionStats {
    totalCards: number;
    uniqueCards: number;
    cardsByAffinity: Record<Affinity, number>;
    averageLevel: number;
    totalXP: number;
  }

  /**
   * Deck configuration in inventory
   */
  export interface DeckConfiguration {
    id: string;
    name: string;
    cards: string[];                // Array of card instance IDs
    affinity: Affinity;
    isValid: boolean;
    lastModified: Date;
  }

  /**
   * Player inventory data
   */
  export interface PlayerInventory {
    playerId: string;
    cards: CardInstance[];
    decks: DeckConfiguration[];
    currency: {
      nectar: number;
      crystals?: number;
    };
    unlockedCards: string[];         // Base card IDs that have been unlocked
    achievements?: string[];
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
    counters?: Array<{ type: string; amount: number }>;
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
   * Works for all card types (Bloom, Magic, Trap, Habitat, Buff)
   */
  export function getCardLevel(currentXP: number, card?: BloomBeastCard): number {
    // For Bloom beasts with custom XP requirements, use those
    if (card?.levelingConfig?.xpRequirements) {
      const customXP = card.levelingConfig.xpRequirements;
      let cumulativeXP = 0;

      for (let level = 2; level <= 9; level++) {
        const levelKey = level as 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
        cumulativeXP += customXP[levelKey] || CARD_XP_THRESHOLDS[level] - CARD_XP_THRESHOLDS[level - 1];

        if (currentXP < cumulativeXP) {
          return level - 1;
        }
      }
      return 9; // Max level
    }

    // Standard XP thresholds
    for (let level = 9; level >= 1; level--) {
      if (currentXP >= CARD_XP_THRESHOLDS[level - 1]) {
        return level;
      }
    }
    return 1;
  }

  /**
   * Calculate XP required for next level
   */
  export function getXPRequired(currentLevel: number, currentXP: number, card?: BloomBeastCard): number {
    if (currentLevel >= 9) return 0; // Max level

    const nextLevel = currentLevel + 1;

    // For Bloom beasts with custom XP requirements
    if (card?.levelingConfig?.xpRequirements) {
      const customXP = card.levelingConfig.xpRequirements;
      const levelKey = nextLevel as 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
      const nextLevelXP = CARD_XP_THRESHOLDS[nextLevel - 1];
      return nextLevelXP - currentXP;
    }

    // Standard XP requirements
    const nextLevelXP = CARD_XP_THRESHOLDS[nextLevel - 1];
    return nextLevelXP - currentXP;
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
   * e.g., "forest-bloom-1-1" → "forest-bloom"
   */
  export function extractBaseCardId(instanceId: string): string {
    return instanceId.replace(/-\d+-\d+$/, '');
  }

  /**
   * Compute display data for a card (for UI rendering)
   * This is NOT a stored type - computed on-demand
   */
  export interface CardDisplayData {
    // Identity
    id: string;
    cardId: string;
    name: string;
    type: string;
    affinity?: string;
    cost: number;

    // Computed from XP
    level: number;
    experience: number;
    experienceRequired: number;

    // Stats (for Bloom beasts)
    baseAttack?: number;
    baseHealth?: number;

    // Abilities and effects
    abilities?: any[];
    description?: string;

    // Visual
    titleColor?: string;
  }

  /**
   * Compute display data from a CardInstance
   * Merges instance data + card definition + computed level/stats
   */
  export function computeCardDisplay(instance: CardInstance): CardDisplayData {
    const baseCardId = extractBaseCardId(instance.cardId);
    const cardDef = getCardDefinition(baseCardId);

    if (!cardDef) {
      // Fallback for missing definition
      return {
        id: instance.id,
        cardId: instance.cardId,
        name: baseCardId,
        type: 'unknown',
        level: 1,
        experience: instance.currentXP,
        experienceRequired: 100,
        cost: 0,
      };
    }

    const level = getCardLevel(instance.currentXP, cardDef as BloomBeastCard);
    const xpRequired = getXPRequired(level, instance.currentXP, cardDef as BloomBeastCard);

    const displayData: CardDisplayData = {
      id: instance.id,
      cardId: instance.cardId,
      name: cardDef.name,
      type: cardDef.type,
      affinity: 'affinity' in cardDef ? cardDef.affinity : undefined,
      cost: cardDef.cost || 0,
      level,
      experience: instance.currentXP,
      experienceRequired: xpRequired,
    };

    // Add type-specific data
    if (cardDef.type === 'Bloom' && 'baseAttack' in cardDef) {
      const bloomCard = cardDef as BloomBeastCard;

      // Apply levelingConfig stat gains if they exist
      let baseAttack = bloomCard.baseAttack;
      let baseHealth = bloomCard.baseHealth;

      if (bloomCard.levelingConfig?.statGains) {
        const statGain = bloomCard.levelingConfig.statGains[level as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9];
        if (statGain) {
          baseAttack = statGain.atk;
          baseHealth = statGain.hp;
        }
      }

      displayData.baseAttack = baseAttack;
      displayData.baseHealth = baseHealth;
    }

    // Add abilities (with level-based upgrades for Bloom cards)
    if ('abilities' in cardDef) {
      let abilities = cardDef.abilities as any[];

      // Apply ability upgrades for Bloom cards based on level
      if (cardDef.type === 'Bloom' && 'levelingConfig' in cardDef) {
        const bloomCard = cardDef as BloomBeastCard;
        const upgrades = bloomCard.levelingConfig?.abilityUpgrades;

        if (upgrades) {
          // Check upgrade levels in reverse order (9, 7, 4) to get the most recent applicable upgrade
          if (level >= 9 && upgrades[9]) {
            abilities = upgrades[9].abilities || abilities;
          } else if (level >= 7 && upgrades[7]) {
            abilities = upgrades[7].abilities || abilities;
          } else if (level >= 4 && upgrades[4]) {
            abilities = upgrades[4].abilities || abilities;
          }
        }
      }

      displayData.abilities = abilities;
    }

    // Generate description from abilities using getCardDescription
    const cardWithAbilities = {
      ...cardDef,
      abilities: displayData.abilities
    };
    displayData.description = getCardDescription(cardWithAbilities);

    // Add visual properties
    if ('titleColor' in cardDef) {
      displayData.titleColor = cardDef.titleColor;
    }

    return displayData;
  }

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
    tokens: number;
    diamonds: number;
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
    card: CardDisplayData;
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
    playerNectar: number;
    playerHand: any[];
    playerTrapZone: any[]; // Player's trap cards (face-down)
    playerBuffZone: any[]; // Player's active buff cards
    opponentHealth: number;
    opponentMaxHealth: number;
    opponentDeckCount: number;
    opponentNectar: number;
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

  // ==================== bloombeasts\systems\CardCollectionManager.ts ====================

  /**
   * CardCollectionManager - Manages card operations and transformations
   * Handles card display conversion, leveling, abilities, deck building, and XP awards
   */


  export class CardCollectionManager {
    private levelingSystem: LevelingSystem;
    private catalogManager: any;

    constructor(catalogManager: any) {
      this.levelingSystem = new LevelingSystem();
      this.catalogManager = catalogManager;
    }

    /**
     * Extract base card ID from instance ID
     * Card IDs may have timestamp suffixes (e.g., "nectar-block-1761200302194-0")
     * We need to extract the base ID (e.g., "nectar-block") to match catalog IDs
     */
    private extractBaseCardId(cardId: string): string {
      // Remove timestamp pattern: -digits-digits at the end
      return cardId.replace(/-\d+-\d+$/, '');
    }

    /**
     * Get abilities for a card based on its level
     */
    getAbilitiesForLevel(cardInstance: CardInstance): { abilities: any[] } {
      // Get the base card definition
      const allCards = this.catalogManager.getAllCardData();
      const baseCardId = this.extractBaseCardId(cardInstance.cardId);
      const cardDef = allCards.find((card: any) =>
        card && card.id === baseCardId
      ) as BloomBeastCard | undefined;

      if (!cardDef || cardDef.type !== 'Bloom') {
        return {
          abilities: []
        };
      }

      const level = getCardLevel(cardInstance.currentXP, cardDef);
      let abilities = [...cardDef.abilities];

      // Apply ability upgrades based on level (use the most recent complete set)
      if (cardDef.levelingConfig?.abilityUpgrades) {
        const upgrades = cardDef.levelingConfig.abilityUpgrades;

        // Check upgrade levels in reverse order (9, 7, 4) to get the most recent applicable upgrade
        if (level >= 9 && upgrades[9]) {
          abilities = upgrades[9].abilities || abilities;
        } else if (level >= 7 && upgrades[7]) {
          abilities = upgrades[7].abilities || abilities;
        } else if (level >= 4 && upgrades[4]) {
          abilities = upgrades[4].abilities || abilities;
        }
      }

      return { abilities };
    }

    /**
     * Get player's deck cards for battle
     * Converts minimal CardInstance to full battle cards using definitions
     */
    getPlayerDeckCards(playerDeck: string[], cardInstances: CardInstance[]): AnyCard[] {
      const deckCards: AnyCard[] = [];
      const allCardDefs = this.catalogManager.getAllCardData();

      // Convert all cards from player's deck
      for (const cardId of playerDeck) {
        const cardInstance = cardInstances.find(c => c.id === cardId);

        if (cardInstance) {
          // Get the card definition
          const baseCardId = this.extractBaseCardId(cardInstance.cardId);
          const cardDef = allCardDefs.find((card: any) =>
            card && card.id === baseCardId
          );

          if (!cardDef) {
            Logger.warn(`Card definition not found for ${cardInstance.cardId}`);
            continue;
          }

          // For Bloom cards, apply level-based upgrades
          if (cardDef.type === 'Bloom') {
            const level = getCardLevel(cardInstance.currentXP, cardDef as BloomBeastCard);
            const abilities = this.getAbilitiesForLevel(cardInstance);

            // Convert to BloomBeastCard format for battle
            const bloomCard: BloomBeastCard = {
              id: cardDef.id,
              instanceId: cardInstance.id, // Used for unique identification in battle
              name: cardDef.name,
              type: 'Bloom',
              affinity: cardDef.affinity || 'Forest',
              cost: cardDef.cost,
              baseAttack: cardDef.baseAttack || 0,
              baseHealth: cardDef.baseHealth || 0,
              abilities: abilities.abilities,
              level: level, // Include computed level for beast instance
              levelingConfig: {} as any, // Not used in battle
            } as any;

            deckCards.push(bloomCard);
          } else {
            // For non-Bloom cards, use the card definition directly
            deckCards.push(cardDef as AnyCard);
          }
        }
      }

      return deckCards;
    }

    /**
     * Award experience to all cards in the player's deck (simplified)
     * Level is computed from XP on-demand, so we just add XP here
     */
    awardDeckExperience(totalCardXP: number, playerDeck: string[], cardInstances: CardInstance[]): void {
      // Distribute XP evenly across all cards in deck
      const xpPerCard = Math.floor(totalCardXP / playerDeck.length);

      // Award XP to each card in the deck
      for (const cardId of playerDeck) {
        const cardInstance = cardInstances.find(c => c.id === cardId);

        if (!cardInstance) continue;

        const oldXP = cardInstance.currentXP;
        cardInstance.currentXP += xpPerCard;

        // Log XP gain (level is computed from XP using cardUtils)
        Logger.debug(`Card ${cardId} gained ${xpPerCard} XP (${oldXP} → ${cardInstance.currentXP})`);
      }
    }

    /**
     * Initialize starting collection with minimal CardInstance format
     */
    async initializeStartingCollection(cardInstances: CardInstance[], playerDeck: string[]): Promise<string[]> {
      // Give player the first 30 cards from the card catalog as the default deck
      const allCards = this.catalogManager.getAllCardData();
      const starterCards = allCards.slice(0, 30);

      starterCards.forEach((card: any, index: number) => {
        const instanceId = `${card.id}-${Date.now()}-${index}`;

        // Create minimal card instance (all types use same format now)
        const cardInstance: CardInstance = {
          id: instanceId,
          cardId: card.id,
          currentXP: 0, // Start at 0 XP (level 1)
        };

        cardInstances.push(cardInstance);

        // Add to player's deck (up to DECK_SIZE cards)
        if (playerDeck.length < DECK_SIZE) {
          playerDeck.push(cardInstance.id);
        }
      });

      return playerDeck;
    }

    /**
     * Add card reward to collection (minimal format)
     */
    addCardReward(card: any, cardInstances: CardInstance[], index: number): void {
      const instanceId = `${card.id}-reward-${Date.now()}-${index}`;

      // Create minimal card instance (all types use same format)
      const cardInstance: CardInstance = {
        id: instanceId,
        cardId: card.id,
        currentXP: 0, // New cards start at 0 XP (level 1)
      };

      cardInstances.push(cardInstance);
    }

  }

  // ==================== bloombeasts\systems\BattleDisplayManager.ts ====================

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
      battleState: any,
      attackAnimation?: {
        attackerPlayer: 'player' | 'opponent';
        attackerIndex: number;
        targetPlayer: 'player' | 'opponent' | 'health';
        targetIndex?: number;
      } | null
    ): BattleDisplay | null {
      if (!battleState || !battleState.gameState) {
        return null;
      }

      // Players is a tuple [Player, Player] where index 0 is typically the player
      const player = battleState.gameState.players[0];
      const opponent = battleState.gameState.players[1];

      if (!player || !opponent) return null;

      // Convert to display format
      const display: BattleDisplay = {
        playerHealth: player.health,
        playerMaxHealth: player.maxHealth || STARTING_HEALTH, // Default to STARTING_HEALTH if undefined
        playerDeckCount: player.deck.length,
        playerNectar: player.currentNectar,
        playerHand: player.hand,
        playerTrapZone: player.trapZone || [null, null, null],
        playerBuffZone: player.buffZone || [null, null],
        opponentHealth: opponent.health,
        opponentMaxHealth: opponent.maxHealth || STARTING_HEALTH, // Default to STARTING_HEALTH if undefined
        opponentDeckCount: opponent.deck.length,
        opponentNectar: opponent.currentNectar,
        opponentField: this.enrichFieldBeasts(opponent.field, battleState.gameState, 1), // Opponent is player index 1
        opponentTrapZone: opponent.trapZone || [null, null, null],
        opponentBuffZone: opponent.buffZone || [null, null],
        playerField: this.enrichFieldBeasts(player.field, battleState.gameState, 0), // Player is player index 0
        currentTurn: battleState.gameState.turn,
        turnPlayer: battleState.gameState.activePlayer === 0 ? 'player' : 'opponent',
        turnTimeRemaining: TURN_TIME_LIMIT,
        objectives: this.getObjectiveDisplay(battleState),
        habitatZone: battleState.gameState.habitatZone,
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
     * Enrich field beasts with card definition data
     * NOTE: Do NOT apply bonuses here - the engine's StatModifierManager already handles this!
     */
    private enrichFieldBeasts(field: any[], gameState?: any, playerIndex?: number): any[] {
      // Create a card lookup map from all card definitions
      const cardMap = new Map<string, BloomBeastCard>();
      const allCards = this.catalogManager.getAllCardData();
      allCards.forEach((card: any) => {
        if (card && card.type === 'Bloom') {
          cardMap.set(card.id, card as BloomBeastCard);
        }
      });

      return field.map(beast => {
        if (!beast) return null;

        // Get the card definition
        const cardDef = cardMap.get(beast.cardId);

        if (!cardDef) return beast; // Return as-is if card not found

        // Merge instance data with card definition data
        // The engine's StatModifierManager already includes all bonuses in currentAttack/currentHealth/maxHealth
        // We do NOT need to calculate or apply bonuses here
        return {
          ...beast,
          name: beast.name || cardDef.name,
          affinity: beast.affinity || cardDef.affinity,
          cost: beast.cost || cardDef.cost,
          abilities: beast.abilities || cardDef.abilities,
          // Use stats as-is from the engine (bonuses are already applied by StatModifierManager)
          currentAttack: beast.currentAttack || 0,
          currentHealth: beast.currentHealth || 0,
          maxHealth: beast.maxHealth || 0,
        };
      });
    }

  }

  // ==================== bloombeasts\engine\utils\StatModifierManager.ts ====================

  /**
   * StatModifierManager - Centralized stat modification management
   *
   * This utility handles all stat modifications in a consistent way across the game.
   * It tracks different sources of modifications and calculates final stats.
   */


  export class StatModifierManager {
    /**
     * Add a stat modifier to a beast
     */
    static addModifier(
      beast: BloomBeastInstance,
      source: StatModifierSource,
      sourceId: string,
      stat: 'attack' | 'health' | 'maxHealth',
      value: number,
      duration?: 'permanent' | 'end-of-turn' | 'while-active',
      turnsRemaining?: number
    ): void {
      if (!beast.statModifiers) {
        beast.statModifiers = [];
      }

      const modifier: StatModifier = {
        source,
        sourceId,
        stat,
        value,
        duration,
        turnsRemaining
      };

      beast.statModifiers.push(modifier);
      Logger.debug(`Added ${stat} modifier: ${value > 0 ? '+' : ''}${value} from ${source} (${sourceId})`);

      // Recalculate stats after adding modifier
      this.recalculateStats(beast);
    }

    /**
     * Remove all modifiers from a specific source
     */
    static removeModifiersBySource(
      beast: BloomBeastInstance,
      source: StatModifierSource,
      sourceId?: string
    ): void {
      if (!beast.statModifiers) return;

      const before = beast.statModifiers.length;

      if (sourceId) {
        beast.statModifiers = beast.statModifiers.filter(
          m => !(m.source === source && m.sourceId === sourceId)
        );
      } else {
        beast.statModifiers = beast.statModifiers.filter(m => m.source !== source);
      }

      const removed = before - beast.statModifiers.length;
      if (removed > 0) {
        Logger.debug(`Removed ${removed} modifier(s) from ${source}${sourceId ? ` (${sourceId})` : ''}`);
        this.recalculateStats(beast);
      }
    }

    /**
     * Update modifiers for end of turn (decrement turns remaining, remove expired)
     */
    static updateEndOfTurn(beast: BloomBeastInstance): void {
      if (!beast.statModifiers) return;

      const before = beast.statModifiers.length;

      beast.statModifiers = beast.statModifiers.filter(modifier => {
        // Remove end-of-turn effects
        if (modifier.duration === 'end-of-turn') {
          Logger.debug(`Removing end-of-turn modifier: ${modifier.stat} ${modifier.value > 0 ? '+' : ''}${modifier.value}`);
          return false;
        }

        // Decrement turns remaining for temporary effects
        if (modifier.turnsRemaining !== undefined) {
          modifier.turnsRemaining--;
          if (modifier.turnsRemaining <= 0) {
            Logger.debug(`Removing expired temporary modifier: ${modifier.stat} ${modifier.value > 0 ? '+' : ''}${modifier.value}`);
            return false;
          }
        }

        return true;
      });

      const removed = before - beast.statModifiers.length;
      if (removed > 0) {
        this.recalculateStats(beast);
      }
    }

    /**
     * Recalculate all current stats from base + modifiers
     */
    static recalculateStats(beast: BloomBeastInstance): void {
      // Store current health percentage to maintain damage
      const healthPercent = beast.maxHealth > 0 ? beast.currentHealth / beast.maxHealth : 1;

      // Start with base stats
      let calculatedAttack = beast.baseAttack;
      let calculatedMaxHealth = beast.baseHealth;

      // Apply all modifiers
      if (beast.statModifiers) {
        for (const modifier of beast.statModifiers) {
          if (modifier.stat === 'attack') {
            calculatedAttack += modifier.value;
          } else if (modifier.stat === 'maxHealth' || modifier.stat === 'health') {
            calculatedMaxHealth += modifier.value;
          }
        }
      }

      // Ensure stats don't go below minimum values
      calculatedAttack = Math.max(0, calculatedAttack);
      calculatedMaxHealth = Math.max(1, calculatedMaxHealth);

      // Update current stats
      const oldMaxHealth = beast.maxHealth;
      beast.currentAttack = calculatedAttack;
      beast.maxHealth = calculatedMaxHealth;

      // Adjust current health proportionally if max health changed
      if (oldMaxHealth !== calculatedMaxHealth && oldMaxHealth > 0) {
        beast.currentHealth = Math.max(1, Math.min(
          Math.floor(calculatedMaxHealth * healthPercent),
          calculatedMaxHealth
        ));
      }

      // Ensure current health doesn't exceed max health
      beast.currentHealth = Math.min(beast.currentHealth, beast.maxHealth);
    }

    /**
     * Get total modifier value for a specific stat from all sources
     */
    static getTotalModifier(beast: BloomBeastInstance, stat: 'attack' | 'health' | 'maxHealth'): number {
      if (!beast.statModifiers) return 0;

      return beast.statModifiers
        .filter(m => m.stat === stat || (m.stat === 'health' && stat === 'maxHealth'))
        .reduce((sum, m) => sum + m.value, 0);
    }

    /**
     * Get modifiers from a specific source
     */
    static getModifiersBySource(
      beast: BloomBeastInstance,
      source: StatModifierSource,
      sourceId?: string
    ): StatModifier[] {
      if (!beast.statModifiers) return [];

      return beast.statModifiers.filter(m => {
        if (sourceId) {
          return m.source === source && m.sourceId === sourceId;
        }
        return m.source === source;
      });
    }

    /**
     * Clear all modifiers (useful when beast is destroyed or returned to hand)
     */
    static clearAllModifiers(beast: BloomBeastInstance): void {
      beast.statModifiers = [];
      this.recalculateStats(beast);
    }

    /**
     * Initialize a beast's stat system (call when beast is created/summoned)
     */
    static initializeStatSystem(beast: BloomBeastInstance): void {
      if (!beast.statModifiers) {
        beast.statModifiers = [];
      }

      // Ensure baseAttack and baseHealth are set
      if (beast.baseAttack === undefined) {
        beast.baseAttack = beast.currentAttack;
      }
      if (beast.baseHealth === undefined) {
        beast.baseHealth = beast.maxHealth;
      }

      // Recalculate to ensure consistency
      this.recalculateStats(beast);
    }
  }

  // ==================== bloombeasts\screens\missions\BattleStateManager.ts ====================

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
      gameState: GameState,
      targetIndex?: number
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
          return this.playMagicCard(cardIndex, player, opponent, targetIndex);

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
    private playMagicCard(cardIndex: number, player: Player, opponent: Player, targetIndex?: number): PlayCardResult {
      const magicCard: any = player.hand.splice(cardIndex, 1)[0];
      player.currentNectar -= magicCard.cost;

      // Get the target beast if targetIndex is provided
      let target = null;
      if (targetIndex !== undefined && targetIndex >= 0 && targetIndex < opponent.field.length) {
        target = opponent.field[targetIndex];
        Logger.debug(`Magic card targeting opponent beast at index ${targetIndex}: ${target?.name}`);
      }

      // Process magic card effects immediately
      // Magic cards use the structured ability system with abilities array
      if (magicCard.abilities && Array.isArray(magicCard.abilities)) {
        for (const ability of magicCard.abilities) {
          if (ability.effects && Array.isArray(ability.effects)) {
            for (const effect of ability.effects) {
              this.processMagicEffect(effect, player, opponent, { target });
            }
          }
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

      // Check for trap activation - pass the attacking beast
      this.checkAndActivateTraps(opponent, attacker, 'attack', onTrapCallback);

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

      // Check for trap activation - pass the attacking beast
      this.checkAndActivateTraps(opponent, attacker, 'attack', onTrapCallback);

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
    processMagicEffect(effect: any, player: any, opponent: any, context?: { attacker?: any, target?: any }): void {
      switch (effect.type) {
        case 'deal-damage':
          const damageTarget = this.getEffectTargets(effect.target, player, opponent, effect.condition, context);
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
          const healTarget = this.getEffectTargets(effect.target, player, opponent, effect.condition, context);
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
          const destroyTarget = this.getEffectTargets(effect.target, player, opponent, effect.condition, context);
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
          const statTarget = this.getEffectTargets(effect.target, player, opponent, effect.condition, context);
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
          const removeTargets = this.getEffectTargets(effect.target, player, opponent, effect.condition, context);
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
          const removeTargetsHabitat = this.getEffectTargets(effect.target, player, opponent, effect.condition);
          removeTargetsHabitat.forEach((target: any) => {
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
          const damageTargetsHabitat = this.getEffectTargets(effect.target, player, opponent, effect.condition);
          damageTargetsHabitat.forEach((target: any) => {
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
    private getEffectTargets(targetType: string, player: any, opponent: any, condition?: any, context?: { attacker?: any, target?: any }): any[] {
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
        case 'attacker':
          // For trap cards - the attacker who triggered the trap
          targets = context?.attacker ? [context.attacker] : [];
          break;
        case 'target':
          // For targeted spells - specific target selected by player
          targets = context?.target ? [context.target] : [];
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

        // Check the activation trigger correctly - trap cards have activation.trigger property
        const trapTrigger = trap.activation?.trigger || trap.trigger;

        // Map triggerType to expected trap trigger values
        let shouldActivate = false;
        if (triggerType === 'attack') {
          // OnAttack trigger should activate on attack
          shouldActivate = trapTrigger === 'OnAttack' || trapTrigger === 'OnPlayerAttack';
        }

        if (shouldActivate) {
          Logger.debug(`Trap activated: ${trap.name}!`);

          if (onTrapCallback) {
            onTrapCallback(trap.name);
          }

          // Process trap effects using the abilities structure
          // Pass context with attacker information for trap effects that target the attacker
          if (trap.abilities && Array.isArray(trap.abilities)) {
            for (const ability of trap.abilities) {
              if (ability.effects && Array.isArray(ability.effects)) {
                for (const effect of ability.effects) {
                  this.processMagicEffect(effect, defender, attacker, { attacker: attacker });
                }
              }
            }
          }

          // Remove trap from zone
          const activatedTrap = defender.trapZone.splice(i, 1)[0];
          defender.graveyard.push(activatedTrap);

          // Only activate ONE trap per event
          break;
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

  // ==================== bloombeasts\screens\missions\OpponentAI.ts ====================

  /**
   * OpponentAI - Handles AI decision making for opponent players
   *
   * Responsibilities:
   * - Card play decisions (which cards to play, when to play them)
   * - Attack decisions (target selection, when to attack)
   * - Resource management (nectar spending)
   * - Turn sequencing with delays for UI visibility
   */


  export interface AICallbacks {
    async: AsyncMethods;
    onAction?: (action: string) => void;
    onRender?: () => void;
  }

  export interface AIDecision {
    type: 'play-card' | 'attack-beast' | 'attack-player' | 'end-turn';
    cardIndex?: number;
    attackerIndex?: number;
    targetIndex?: number;
    card?: any;
  }

  export class OpponentAI {
    private callbacks: AICallbacks;
    private async: AsyncMethods;

    constructor(callbacks: AICallbacks) {
      this.callbacks = callbacks;
      this.async = callbacks.async;
    }

    /**
     * Execute a full AI turn
     * @param opponent The AI player
     * @param player The human player
     * @param gameState Current game state (for habitat zone, turn number, etc.)
     * @param effectProcessors Functions to process various effects
     * @param shouldStopGetter Function that returns true if AI should stop processing
     */
    async executeTurn(
      opponent: Player,
      player: Player,
      gameState: any,
      effectProcessors: {
        processOnSummonTrigger: (beast: any, owner: any, opponent: any) => void;
        processOnAttackTrigger: (beast: any, owner: any, opponent: any) => void;
        processOnDamageTrigger: (beast: any, owner: any, opponent: any) => void;
        processOnDestroyTrigger: (beast: any, owner: any, opponent: any) => void;
        processMagicEffect: (effect: any, player: any, opponent: any) => void;
        processHabitatEffect: (effect: any, player: any, opponent: any) => void;
        applyStatBuffEffects: (player: any) => void;
      },
      shouldStopGetter?: () => boolean
    ): Promise<void> {
      const delay = (ms: number) => new Promise(resolve => this.async.setTimeout(resolve, ms));

      // Play cards phase
      const cardDecisions = this.decideCardPlays(opponent, player, gameState);
      for (const decision of cardDecisions) {
        if (shouldStopGetter && shouldStopGetter()) return; // Stop if battle ended

        await this.executeCardPlay(
          decision,
          opponent,
          player,
          gameState,
          effectProcessors
        );
        if (this.callbacks.onRender) this.callbacks.onRender();

        // Longer delay for non-Bloom cards to show popup
        const delayTime = decision.card?.type === 'Bloom' ? 1200 : 3500;
        await delay(delayTime);

        if (shouldStopGetter && shouldStopGetter()) return; // Stop if battle ended
      }

      // Attack phase
      const attackDecisions = this.decideAttacks(opponent, player);
      for (const decision of attackDecisions) {
        if (shouldStopGetter && shouldStopGetter()) return; // Stop if battle ended

        await this.executeAttack(
          decision,
          opponent,
          player,
          effectProcessors
        );
        if (this.callbacks.onRender) this.callbacks.onRender();
        await delay(1000);

        if (shouldStopGetter && shouldStopGetter()) return; // Stop if battle ended

        // Check if player was defeated during attack
        if (player.health <= 0) {
          return; // Stop turn processing
        }
      }

      Logger.debug('Opponent turn ended');
    }

    /**
     * Decide which cards to play this turn
     */
    private decideCardPlays(opponent: Player, player: Player, gameState: any): AIDecision[] {
      const decisions: AIDecision[] = [];

      // Simple greedy AI: Play cards from hand if affordable and field has space
      for (let i = opponent.hand.length - 1; i >= 0; i--) {
        const card: any = opponent.hand[i];

        if (card.cost <= opponent.currentNectar) {
          if (card.type === 'Bloom' && opponent.field.length < 3) {
            decisions.push({
              type: 'play-card',
              cardIndex: i,
              card: card,
            });
            opponent.currentNectar -= card.cost; // Deduct for decision calculation
          } else if (card.type === 'Magic') {
            decisions.push({
              type: 'play-card',
              cardIndex: i,
              card: card,
            });
            opponent.currentNectar -= card.cost;
          } else if (card.type === 'Trap' && opponent.trapZone.length < 3) {
            decisions.push({
              type: 'play-card',
              cardIndex: i,
              card: card,
            });
            opponent.currentNectar -= card.cost;
          } else if (card.type === 'Buff' && opponent.buffZone.length < 2) {
            decisions.push({
              type: 'play-card',
              cardIndex: i,
              card: card,
            });
            opponent.currentNectar -= card.cost;
          } else if (card.type === 'Habitat' && !gameState.habitatZone) {
            decisions.push({
              type: 'play-card',
              cardIndex: i,
              card: card,
            });
            opponent.currentNectar -= card.cost;
          }
        }
      }

      return decisions;
    }

    /**
     * Execute a card play decision
     */
    private async executeCardPlay(
      decision: AIDecision,
      opponent: Player,
      player: Player,
      gameState: any,
      effectProcessors: any
    ): Promise<void> {
      if (decision.cardIndex === undefined) return;

      const card: any = opponent.hand[decision.cardIndex];
      if (!card) return;

      const playedCard: any = opponent.hand.splice(decision.cardIndex, 1)[0];
      // Note: Nectar already deducted in decision phase

      switch (playedCard.type) {
        case 'Bloom':
          const beastInstance: any = {
            cardId: playedCard.id,
            instanceId: playedCard.instanceId || `${playedCard.id}-${Date.now()}`,
            currentLevel: 1 as any,
            currentXP: 0,
            baseAttack: playedCard.baseAttack,
            baseHealth: playedCard.baseHealth,
            currentAttack: playedCard.baseAttack,
            currentHealth: playedCard.baseHealth,
            maxHealth: playedCard.baseHealth,
            counters: [],
            statusEffects: [],
            slotIndex: opponent.field.length,
            summoningSickness: true,
            usedAbilityThisTurn: false,
            statModifiers: [],
            // Store original card data for display
            type: 'Bloom',
            name: playedCard.name,
            affinity: playedCard.affinity,
            cost: playedCard.cost,
            ability: playedCard.abilities && playedCard.abilities.length > 0 ? playedCard.abilities[0] : undefined,
          };

          // Initialize stat system (beasts need this even before buffs are applied)
          opponent.field.push(beastInstance);
          effectProcessors.applyStatBuffEffects(opponent);
          effectProcessors.processOnSummonTrigger(beastInstance, opponent, player);

          Logger.debug(`Opponent played ${playedCard.name}`);
          if (this.callbacks.onAction) this.callbacks.onAction('play-card');
          break;

        case 'Magic':
          if (playedCard.effects && Array.isArray(playedCard.effects)) {
            for (const effect of playedCard.effects) {
              effectProcessors.processMagicEffect(effect, opponent, player);
            }
          }
          opponent.graveyard.push(playedCard);
          Logger.debug(`Opponent played magic card: ${playedCard.name}`);
          if (this.callbacks.onAction) {
            this.callbacks.onAction(`play-magic-card:${JSON.stringify(playedCard)}`);
          }
          break;

        case 'Trap':
          opponent.trapZone.push(playedCard);
          Logger.debug(`Opponent set trap: ${playedCard.name}`);
          if (this.callbacks.onAction) {
            this.callbacks.onAction(`play-trap-card:${JSON.stringify(playedCard)}`);
          }
          break;

        case 'Buff':
          opponent.buffZone.push(playedCard);
          effectProcessors.applyStatBuffEffects(opponent);
          Logger.debug(`Opponent played buff: ${playedCard.name}`);
          if (this.callbacks.onAction) {
            this.callbacks.onAction(`play-buff-card:${JSON.stringify(playedCard)}`);
          }
          break;

        case 'Habitat':
          gameState.habitatZone = playedCard;
          if (playedCard.onPlayEffects && Array.isArray(playedCard.onPlayEffects)) {
            for (const effect of playedCard.onPlayEffects) {
              effectProcessors.processHabitatEffect(effect, opponent, player);
            }
          }
          Logger.debug(`Opponent played habitat: ${playedCard.name}`);
          if (this.callbacks.onAction) {
            this.callbacks.onAction(`play-habitat-card:${JSON.stringify(playedCard)}`);
          }
          break;
      }
    }

    /**
     * Decide which beasts should attack
     */
    private decideAttacks(opponent: Player, player: Player): AIDecision[] {
      const decisions: AIDecision[] = [];

      // Attack with all beasts that can attack
      for (let index = 0; index < opponent.field.length; index++) {
        const beast: any = opponent.field[index];

        if (beast && !beast.summoningSickness) {
          if (player.field.length > 0) {
            // Attack a random player beast
            const target: any = pickRandom(player.field);
            const targetIndex = target ? player.field.indexOf(target) : -1;

            if (target && targetIndex >= 0) {
              decisions.push({
                type: 'attack-beast',
                attackerIndex: index,
                targetIndex: targetIndex,
              });
            }
          } else {
            // Attack player directly
            decisions.push({
              type: 'attack-player',
              attackerIndex: index,
            });
          }
        }
      }

      return decisions;
    }

    /**
     * Execute an attack decision
     */
    private async executeAttack(
      decision: AIDecision,
      opponent: Player,
      player: Player,
      effectProcessors: any
    ): Promise<void> {
      if (decision.attackerIndex === undefined) return;

      const attacker: any = opponent.field[decision.attackerIndex];
      if (!attacker) return;

      if (decision.type === 'attack-beast' && decision.targetIndex !== undefined) {
        const target: any = player.field[decision.targetIndex];
        if (!target) return;

        Logger.debug(`Opponent's ${attacker.name} attacks ${target.name}`);

        effectProcessors.processOnAttackTrigger(attacker, opponent, player);

        if (this.callbacks.onAction) {
          this.callbacks.onAction(`attack-beast-opponent-${decision.attackerIndex}-player-${decision.targetIndex}`);
        }

        // Deal damage to each other
        const opponentBeastDamage = attacker.currentAttack || 0;
        const playerBeastDamage = target.currentAttack || 0;

        target.currentHealth -= opponentBeastDamage;
        attacker.currentHealth -= playerBeastDamage;

        // Process OnDamage triggers
        if (opponentBeastDamage > 0) {
          effectProcessors.processOnDamageTrigger(target, player, opponent);
        }
        if (playerBeastDamage > 0) {
          effectProcessors.processOnDamageTrigger(attacker, opponent, player);
        }

        // Remove dead beasts
        if (target.currentHealth <= 0) {
          effectProcessors.processOnDestroyTrigger(target, player, opponent);
          player.field.splice(decision.targetIndex, 1);
          Logger.debug(`${target.name} was defeated!`);
        }
        if (attacker.currentHealth <= 0) {
          effectProcessors.processOnDestroyTrigger(attacker, opponent, player);
          opponent.field.splice(decision.attackerIndex, 1);
          Logger.debug(`Opponent's ${attacker.name} was defeated!`);
        }

      } else if (decision.type === 'attack-player') {
        const damage = attacker.currentAttack || 0;

        effectProcessors.processOnAttackTrigger(attacker, opponent, player);

        const previousHealth = player.health;
        player.health -= damage;
        Logger.debug(`Opponent's ${attacker.name} attacks you directly for ${damage} damage!`);

        // Check for low health threshold (10%)
        const healthPercentage = (player.health / (player.maxHealth || 30)) * 100;
        if (healthPercentage <= 10 && previousHealth > player.health) {
          if (this.callbacks.onAction) {
            this.callbacks.onAction('player-low-health');
          }
        }

        if (this.callbacks.onAction) {
          this.callbacks.onAction(`attack-player-opponent-${decision.attackerIndex}`);
        }
      }
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
    itemRewards?: ItemReward[];   // Possible item rewards
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
    specialRules?: SpecialRule[]; // Special battle rules

    // Rewards
    rewards: MissionRewards;
    firstTimeBonus?: MissionRewards; // Extra rewards for first completion

    // Progress tracking
    timesCompleted: number;
    bestScore?: number;
    lastPlayed?: Date;
    unlocked: boolean;
  }

  export interface SpecialRule {
    id: string;
    name: string;
    description: string;
    effect: 'double-xp' | 'no-abilities' | 'fast-nectar' |
            'burn-damage' | 'heal-per-turn' | 'random-effects';
  }

  export interface AIProfile {
    name: string;
    difficulty: MissionDifficulty;
    personality: 'aggressive' | 'defensive' | 'balanced' | 'strategic' | 'chaotic';

    // AI behavior weights (0-1)
    aggressiveness: number;       // Likelihood to attack
    resourceManagement: number;   // How well it manages nectar
    targetPriority: 'strongest' | 'weakest' | 'random' | 'strategic';
    abilityUsage: number;        // Likelihood to use abilities

    // Special AI behaviors
    behaviors?: AIBehavior[];
  }

  export interface AIBehavior {
    trigger: 'low-health' | 'high-nectar' | 'empty-field' | 'turn-count';
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
    nectarEarned: number;
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
      const testDeck = buildForestDeck();
      testDeck.cards = testDeck.cards.filter((card) => card.id === 'rootling');
      testDeck.totalCards = testDeck.cards.length;
      console.log('testDeck', testDeck);
      return testDeck;
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
      itemRewards: [
        {
          itemId: 'token',
          minAmount: 5,
          maxAmount: 15,
          dropChance: 0.8,
        },
        {
          itemId: 'diamond',
          minAmount: 1,
          maxAmount: 3,
          dropChance: 0.3,
        },
      ],
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

    opponentDeck: () => buildForestDeck(),

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

    opponentDeck: () => buildForestDeck(),

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

    opponentDeck: () => buildForestDeck(),

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
    },

    timesCompleted: 0,
    unlocked: false,
  };

  // ==================== bloombeasts\screens\missions\definitions\mission17.ts ====================

  /**
   * Mission 17: The Bloom Master
   * Final Boss Mission
   */


  // Create the ultimate deck with cards from all affinities
  const getMasterDeck = () => {
    const allDecks = getAllStarterDecks();
    const masterCards: any[] = [];

    // Take the best 7-8 cards from each affinity
    allDecks.forEach(deck => {
      masterCards.push(...deck.cards.slice(0, 8));
    });

    // Shuffle and limit to 30 cards
    const finalCards = masterCards.sort(() => Math.random() - 0.5).slice(0, 30);

    return {
      name: 'Bloom Master Deck',
      affinity: 'Forest' as const, // Uses all affinities but default to Forest
      cards: finalCards,
      totalCards: finalCards.length,
    };
  };

  export const mission17: Mission = {
    id: 'mission-17',
    name: 'Bloom Master',
    description: 'Face the legendary Bloom Master who commands all four affinities.',
    difficulty: 'expert',
    level: 17,
    affinity: 'Boss',
    beastId: 'The Bloom Master',

    opponentDeck: () => getMasterDeck(),

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

      // Roll for bonus XP
      if (rewardConfig.bonusXPChance && Math.random() < rewardConfig.bonusXPChance) {
        result.xpGained += rewardConfig.bonusXPAmount || 0;
        result.bonusRewards?.push(`Bonus XP: +${rewardConfig.bonusXPAmount}`);
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

      // Apply special rule rewards (like double rewards for mission 10)
      if (this.currentMission?.specialRules) {
        const hasDoubleRewards = this.currentMission.specialRules.some(
          rule => rule.effect === 'double-xp' || rule.id === 'champions-trial'
        );
        if (hasDoubleRewards) {
          result.xpGained *= 2;
          result.bonusRewards?.push('Double rewards earned!');
        }
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

        console.log(`[MissionManager] Restoring ${mission.id}: unlocked=${mission.unlocked}, completionCount=${completionCount}`);

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

        console.log(`[MissionManager] After restore ${mission.id}: unlocked=${mission.unlocked}`);
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
      // First mission is always unlocked
      if (mission.unlocked) {
        return true;
      }

      // Check if mission is unlocked by checking actual completion counts
      const completionCount = this.missionManager.getCompletedCount(mission.id);
      if (completionCount === 0) {
        // Check if previous mission is completed
        const allMissions = getAvailableMissions(99); // Get all missions
        const missionIndex = allMissions.findIndex(m => m.id === mission.id);

        if (missionIndex > 0) {
          const previousMission = allMissions[missionIndex - 1];
          const previousCompletionCount = this.missionManager.getCompletedCount(previousMission.id);
          if (previousCompletionCount === 0) {
            return false;
          }
        }
      }

      // Check level requirements
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

      if (mission.specialRules && mission.specialRules.length > 0) {
        details.push('');
        details.push('⚡ Special Rules:');
        mission.specialRules.forEach(rule => {
          details.push(`  • ${rule.name}: ${rule.description}`);
        });
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

  // ==================== bloombeasts\engine\systems\GameEngine.ts ====================

  /**
   * Game Engine - Main game controller and state manager
   */


  export interface MatchOptions {
    player1Name?: string;
    player2Name?: string;
    turnTimeLimit?: number;
    maxTurns?: number;
  }

  export class GameEngine {
    private gameState: GameState | null = null;
    private combatSystem: CombatSystem;
    private abilityProcessor: AbilityProcessor;
    private levelingSystem: LevelingSystem;
    private cardDatabase: Map<string, AnyCard> | null = null;
    private catalogManager: any;

    constructor(catalogManager: any) {
      // Don't create game state yet - it will be created when startMatch() is called
      // This allows GameEngine to be constructed before asset catalogs are loaded
      this.combatSystem = new CombatSystem();
      this.abilityProcessor = new AbilityProcessor();
      this.levelingSystem = new LevelingSystem();
      this.catalogManager = catalogManager;
    }

    /**
     * Ensure game state exists - throws error if called before startMatch()
     */
    private ensureGameState(): GameState {
      if (!this.gameState) {
        throw new Error('GameEngine: Game state not initialized. Call startMatch() first.');
      }
      return this.gameState;
    }

    /**
     * Get game state (with non-null assertion for internal use)
     * Only use this after you're certain startMatch() has been called
     */
    private get state(): GameState {
      return this.gameState!;
    }

    /**
     * Build card database from all card definitions
     * Called lazily on first access
     */
    private buildCardDatabase(): Map<string, AnyCard> {
      const db = new Map<string, AnyCard>();
      const allCards = this.catalogManager.getAllCardData();
      allCards.forEach((card: any) => {
        if (card && card.id && card.type) {
          db.set(card.id, card as AnyCard);
        }
      });
      return db;
    }

    /**
     * Get card database, building it lazily if needed
     */
    private getCardDatabase(): Map<string, AnyCard> {
      if (!this.cardDatabase) {
        this.cardDatabase = this.buildCardDatabase();
      }
      return this.cardDatabase;
    }

    /**
     * Create initial game state
     */
    private createInitialState(): GameState {
      return {
        turn: 1,
        phase: 'Setup',
        battleState: BattleState.Setup,
        activePlayer: 0,
        players: [
          this.createPlayer('Player 1'),
          this.createPlayer('Player 2'),
        ],
        habitatZone: null,
        turnHistory: [],
      };
    }

    /**
     * Create a new player
     */
    private createPlayer(name: string): Player {
      // Create player with empty deck - real deck is set when startMatch() is called
      // This allows GameEngine to be constructed before asset catalogs are loaded
      return {
        name,
        health: STARTING_HEALTH,
        currentNectar: 0,
        deck: [],  // Empty deck initially - populated by startMatch()
        hand: [],
        field: Array(FIELD_SIZE).fill(null),
        trapZone: Array(FIELD_SIZE).fill(null),
        buffZone: [null, null],
        graveyard: [],
        summonsThisTurn: 0,
        habitatCounters: new SimpleMap(),
      };
    }

    /**
     * Start a new match
     */
    public async startMatch(
      player1Deck: DeckList,
      player2Deck: DeckList,
      options: MatchOptions = {}
    ): Promise<void> {
      Logger.debug('Starting new match...');

      // Create initial game state now that catalogs are loaded
      if (!this.gameState) {
        this.gameState = this.createInitialState();
      }

      // Set player names
      if (options.player1Name) {
        this.state.players[0].name = options.player1Name;
      }
      if (options.player2Name) {
        this.state.players[1].name = options.player2Name;
      }

      // Load decks
      this.state.players[0].deck = [...player1Deck.cards];
      this.state.players[1].deck = [...player2Deck.cards];

      // Shuffle decks
      this.shuffleDeck(this.state.players[0]);
      this.shuffleDeck(this.state.players[1]);

      // Draw initial hands
      this.drawCards(this.state.players[0], 5);
      this.drawCards(this.state.players[1], 5);

      // Transition to first player's turn
      this.state.phase = 'Main';
      this.state.battleState = BattleState.Player1StartOfTurn;
      await this.transitionState();
    }

    /**
     * State machine transition logic
     */
    private async transitionState(): Promise<void> {
      // Check for win condition before any state processing
      if (this.checkForBattleEnd()) {
        this.state.battleState = BattleState.Finished;
        return;
      }

      const currentState = this.state.battleState;
      Logger.debug(`Transitioning from state: ${currentState}`);

      switch (currentState) {
        case BattleState.Player1StartOfTurn:
          await this.processPlayerStartOfTurn(0);
          this.state.battleState = BattleState.Player1Playing;
          break;

        case BattleState.Player1Playing:
          // This state waits for player input (endTurn call)
          break;

        case BattleState.Player1EndOfTurn:
          await this.processPlayerEndOfTurn(0);
          this.state.battleState = BattleState.Player2StartOfTurn;
          await this.transitionState();
          break;

        case BattleState.Player2StartOfTurn:
          await this.processPlayerStartOfTurn(1);
          this.state.battleState = BattleState.Player2Playing;
          break;

        case BattleState.Player2Playing:
          // This state waits for player input (endTurn call)
          break;

        case BattleState.Player2EndOfTurn:
          await this.processPlayerEndOfTurn(1);
          // Increment turn counter after both players have played
          this.state.turn++;
          this.state.battleState = BattleState.Player1StartOfTurn;
          await this.transitionState();
          break;

        case BattleState.Finished:
          // Battle has ended
          const result = this.combatSystem.checkWinCondition(this.state);
          this.endMatch(result);
          break;
      }
    }

    /**
     * Process player start of turn
     */
    private async processPlayerStartOfTurn(playerIndex: 0 | 1): Promise<void> {
      this.state.activePlayer = playerIndex;
      const activePlayer = this.state.players[playerIndex];
      const opposingPlayer = this.state.players[playerIndex === 0 ? 1 : 0];

      Logger.debug(`Turn ${this.state.turn}: ${activePlayer.name}'s turn begins`);

      // Reset turn counters
      activePlayer.summonsThisTurn = 0;

      // Draw card (except first turn for player 1)
      if (!(this.state.turn === 1 && playerIndex === 0)) {
        this.drawCards(activePlayer, 1);
      }

      // Gain nectar
      activePlayer.currentNectar = Math.min(MAX_NECTAR, this.state.turn);

      // Remove summoning sickness from all beasts
      for (const beast of activePlayer.field) {
        if (beast) {
          beast.summoningSickness = false;
        }
      }

      // Process counter effects (burn, freeze, etc.)
      await this.processCounterEffects(activePlayer);

      // Check for death after counter effects
      if (this.checkForBattleEnd()) {
        this.state.battleState = BattleState.Finished;
        return;
      }

      // Trigger start of turn abilities based on state
      await this.triggerStateBasedAbilities(playerIndex, 'start');

      // Set phase to main
      this.state.phase = 'Main';
    }

    /**
     * Process player end of turn
     */
    private async processPlayerEndOfTurn(playerIndex: 0 | 1): Promise<void> {
      const activePlayer = this.state.players[playerIndex];
      const opposingPlayer = this.state.players[playerIndex === 0 ? 1 : 0];

      // Trigger end of turn abilities based on state
      await this.triggerStateBasedAbilities(playerIndex, 'end');

      // Clear temporary effects
      for (const beast of activePlayer.field) {
        if (beast) {
          this.clearTemporaryEffects(beast);
        }
      }

      // Check for death after end of turn effects
      if (this.checkForBattleEnd()) {
        this.state.battleState = BattleState.Finished;
        return;
      }
    }

    /**
     * Check if battle should end (player health <= 0)
     */
    private checkForBattleEnd(): boolean {
      const player1 = this.state.players[0];
      const player2 = this.state.players[1];

      return player1.health <= 0 || player2.health <= 0;
    }

    /**
     * End current turn
     */
    public async endTurn(): Promise<void> {
      const state = this.ensureGameState();

      // Determine which end of turn state to transition to
      if (state.battleState === BattleState.Player1Playing) {
        state.battleState = BattleState.Player1EndOfTurn;
      } else if (state.battleState === BattleState.Player2Playing) {
        state.battleState = BattleState.Player2EndOfTurn;
      } else {
        Logger.error(`Unexpected state during endTurn: ${state.battleState}`);
        return;
      }

      // Continue state transitions
      await this.transitionState();
    }

    /**
     * Summon a beast to the field
     */
    public summonBeast(
      player: Player,
      beastCard: AnyCard,
      position: number
    ): boolean {
      if (position < 0 || position > 2) {
        Logger.error('Invalid field position');
        return false;
      }

      if (player.field[position] !== null) {
        Logger.error('Field position already occupied');
        return false;
      }

      if (player.summonsThisTurn >= 1) {
        Logger.error('Already summoned this turn');
        return false;
      }

      // Create beast instance
      const instance: BloomBeastInstance = {
        instanceId: `${beastCard.id}-${Date.now()}`,
        cardId: beastCard.id,
        name: beastCard.name,
        affinity: (beastCard as any).affinity || 'Generic',
        currentLevel: 1,
        currentXP: 0,
        baseAttack: (beastCard as any).baseAttack || 0,
        baseHealth: (beastCard as any).baseHealth || 0,
        currentAttack: (beastCard as any).baseAttack || 0,
        currentHealth: (beastCard as any).baseHealth || 0,
        maxHealth: (beastCard as any).baseHealth || 0,
        statusEffects: [],
        counters: [],
        summoningSickness: true,
        slotIndex: position,
      };

      // Place on field
      player.field[position] = instance;
      player.summonsThisTurn++;

      // Apply WhileOnField buff card stat modifications to the newly summoned beast
      this.applyWhileOnFieldBuffStats(instance, player);

      // Trigger summon abilities on the summoned beast
      this.triggerSummonAbilities(instance);

      // Trigger OnAllySummon abilities on other beasts
      this.triggerAllySummonAbilities(instance, player);

      return true;
    }

    /**
     * Play a card from hand
     */
    public async playCard(
      player: Player,
      cardIndex: number,
      target?: any
    ): Promise<boolean> {
      if (cardIndex < 0 || cardIndex >= player.hand.length) {
        Logger.error('Invalid card index');
        return false;
      }

      const card = player.hand[cardIndex];

      // Check nectar cost
      if (card.cost > player.currentNectar) {
        Logger.error('Not enough nectar');
        return false;
      }

      // Pay cost
      player.currentNectar -= card.cost;

      // Remove from hand
      player.hand.splice(cardIndex, 1);

      // Handle based on card type
      switch (card.type) {
        case 'Bloom':
          // Check for traps before playing
          await this.checkTraps('OnBloomPlay', player, { bloomCard: card });

          // Find empty field position
          const emptyPos = player.field.findIndex(slot => slot === null);
          if (emptyPos !== -1) {
            return this.summonBeast(player, card, emptyPos);
          }
          player.graveyard.push(card);
          break;

        case 'Habitat':
          // Check for traps before playing
          const trapData = { habitatCard: card, countered: false };
          await this.checkTraps('OnHabitatPlay', player, trapData);

          // Only apply habitat if not countered
          if (!trapData.countered) {
            // Replace current habitat
            if (this.state.habitatZone) {
              player.graveyard.push(this.state.habitatZone);
            }
            this.state.habitatZone = card;
            Logger.debug(`Played habitat: ${card.name}`);
            // Apply habitat effects
            this.applyHabitatEffects();
          } else {
            // Countered - send to graveyard
            player.graveyard.push(card);
          }
          break;

        case 'Magic':
          // Execute magic card effect immediately
          this.processMagicCard(card as MagicCard, player, target);
          player.graveyard.push(card);
          Logger.debug(`Played magic card: ${card.name}`);
          break;

        case 'Trap':
          // Place trap card face-down in trap zone
          const emptyTrapSlot = player.trapZone.findIndex(slot => slot === null);
          if (emptyTrapSlot !== -1) {
            player.trapZone[emptyTrapSlot] = card;
            Logger.debug(`Set trap card: ${card.name}`);
          } else {
            // No trap slots available, send to graveyard
            Logger.debug('No trap slots available');
            player.graveyard.push(card);
          }
          break;

        case 'Buff':
          // Place buff card in buff zone
          const emptyBuffSlot = player.buffZone.findIndex(slot => slot === null);
          if (emptyBuffSlot !== -1) {
            player.buffZone[emptyBuffSlot] = card;
            Logger.debug(`Played buff card: ${card.name}`);
            // Apply any OnSummon effects immediately
            this.applyBuffCardEffects(card as any, player);
          } else {
            // No buff slots available, send to graveyard
            Logger.debug('No buff slots available');
            player.graveyard.push(card);
          }
          break;
      }

      return true;
    }

    /**
     * Process magic card effects using structured effects
     */
    private processMagicCard(card: MagicCard, player: Player, target?: any): void {
      const opponent = this.state.players[this.state.activePlayer === 0 ? 1 : 0];

      // Process each ability in the magic card (usually just one with OnSummon trigger)
      for (const ability of card.abilities) {
        // Magic cards typically have OnSummon trigger - process their effects immediately
        if (ability.trigger === AbilityTrigger.OnSummon || !ability.trigger) {
          // Type guard: only process structured abilities with effects
          if (!('effects' in ability)) continue;

          // Process each effect in the ability
          for (const effect of ability.effects) {
            switch (effect.type) {
              case EffectType.GainResource:
                if (effect.resource === ResourceType.Nectar) {
                  player.currentNectar = Math.min(MAX_NECTAR, player.currentNectar + effect.value);
                }
                break;

              case EffectType.DrawCards:
                this.drawCards(player, effect.value);
                break;

              case EffectType.RemoveCounter:
                // Remove counters based on target
                if (effect.target === AbilityTarget.AllUnits) {
                  // Remove from all beasts on both sides
                  for (const beast of player.field) {
                    if (beast) {
                      if (effect.counter) {
                        // Remove specific counter type
                        beast.counters = beast.counters.filter(c => c.type !== effect.counter);
                      } else {
                        // Remove all counters
                        beast.counters = [];
                      }
                    }
                  }
                  for (const beast of opponent.field) {
                    if (beast) {
                      if (effect.counter) {
                        beast.counters = beast.counters.filter(c => c.type !== effect.counter);
                      } else {
                        beast.counters = [];
                      }
                    }
                  }
                }
                break;

              // Add more effect types as needed
              default:
                Logger.debug(`Unhandled magic card effect type: ${effect.type}`);
            }
          }
        }
      }
    }

    /**
     * Apply habitat zone effects
     */
    private applyHabitatEffects(): void {
      if (!this.state.habitatZone) return;

      const habitat = this.state.habitatZone as HabitatCard;
      const activePlayer = this.state.players[this.state.activePlayer];
      const opposingPlayer = this.state.players[this.state.activePlayer === 0 ? 1 : 0];

      // Process each ability in the habitat card
      for (const ability of habitat.abilities) {
        // Apply on-play effects immediately (OnSummon trigger)
        if (ability.trigger === AbilityTrigger.OnSummon) {
          // Type guard: only process structured abilities with effects
          if (!('effects' in ability)) continue;

          for (const effect of ability.effects) {
            this.processHabitatEffect(effect, activePlayer, opposingPlayer);
          }
        }
        // Note: WhileOnField abilities are handled elsewhere during combat/ability processing
      }

      // Count ongoing WhileOnField abilities for logging
      const ongoingCount = habitat.abilities.filter(a => a.trigger === AbilityTrigger.WhileOnField).length;
      Logger.debug(`Habitat ${habitat.name} active with ${ongoingCount} ongoing abilities`);
    }

    /**
     * Process a single habitat effect
     */
    private processHabitatEffect(effect: AbilityEffect, activePlayer: Player, opposingPlayer: Player): void {
      switch (effect.type) {
        case EffectType.RemoveCounter:
          // Remove counters from all units
          if (effect.target === AbilityTarget.AllUnits) {
            for (const beast of activePlayer.field) {
              if (beast) {
                if (effect.counter) {
                  beast.counters = beast.counters.filter(c => c.type !== effect.counter);
                } else {
                  beast.counters = [];
                }
              }
            }
            for (const beast of opposingPlayer.field) {
              if (beast) {
                if (effect.counter) {
                  beast.counters = beast.counters.filter(c => c.type !== effect.counter);
                } else {
                  beast.counters = [];
                }
              }
            }
          }
          break;

        // Ongoing effects like stat boosts are handled by the AbilityProcessor during combat
        case EffectType.ModifyStats:
          Logger.debug(`Habitat provides ongoing stat modifications`);
          break;

        default:
          Logger.debug(`Unhandled habitat effect type: ${effect.type}`);
      }
    }

    /**
     * Apply buff card effects when played
     */
    private applyBuffCardEffects(buffCard: any, player: Player): void {
      const opponent = this.state.players[this.state.activePlayer === 0 ? 1 : 0];

      // Process each ability in the buff card
      for (const ability of buffCard.abilities) {
        // Apply on-play effects immediately (OnSummon trigger)
        if (ability.trigger === AbilityTrigger.OnSummon) {
          // Type guard: only process structured abilities with effects
          if (!('effects' in ability)) continue;

          for (const effect of ability.effects) {
            this.processBuffEffect(effect, player, opponent);
          }
        }

        // Apply WhileOnField stat modifications to all existing beasts
        if (ability.trigger === AbilityTrigger.WhileOnField) {
          // Type guard: only process structured abilities with effects
          if (!('effects' in ability)) continue;

          for (const effect of ability.effects) {
            if (effect.type === EffectType.ModifyStats) {
              // Apply to all beasts that match the target
              const targetPlayers = effect.target === AbilityTarget.AllAllies || effect.target === AbilityTarget.AllUnits
                ? [player]
                : [];

              for (const targetPlayer of targetPlayers) {
                for (const beast of targetPlayer.field) {
                  if (!beast) continue;

                  // Apply the stat modification
                  if (effect.stat === StatType.Health) {
                    beast.currentHealth += effect.value;
                    beast.maxHealth += effect.value;
                    Logger.debug(`Applied ${buffCard.name} WhileOnField: +${effect.value} Health to ${beast.name}`);
                  } else if (effect.stat === StatType.Attack) {
                    beast.currentAttack += effect.value;
                    Logger.debug(`Applied ${buffCard.name} WhileOnField: +${effect.value} Attack to ${beast.name}`);
                  }
                }
              }
            }
          }
        }
      }

      // Count ongoing abilities for logging
      const ongoingCount = buffCard.abilities.filter((a: any) =>
        a.trigger === AbilityTrigger.WhileOnField ||
        a.trigger === AbilityTrigger.OnOwnStartOfTurn ||
        a.trigger === AbilityTrigger.OnOwnEndOfTurn
      ).length;
      Logger.debug(`Buff ${buffCard.name} active with ${ongoingCount} ongoing/triggered abilities`);
    }

    /**
     * Process a single buff effect
     */
    private processBuffEffect(effect: AbilityEffect, player: Player, opponent: Player): void {
      switch (effect.type) {
        case EffectType.GainResource:
          if (effect.resource === ResourceType.Nectar) {
            player.currentNectar = Math.min(MAX_NECTAR, player.currentNectar + effect.value);
            Logger.debug(`Buff grants ${effect.value} Nectar`);
          }
          break;

        case EffectType.ModifyStats:
          Logger.debug(`Buff provides stat modifications (handled by AbilityProcessor during combat)`);
          break;

        case EffectType.DrawCards:
          this.drawCards(player, effect.value);
          break;

        // Ongoing effects like stat boosts are handled by the AbilityProcessor
        default:
          Logger.debug(`Buff effect type ${effect.type} (handled by AbilityProcessor if ongoing)`);
      }
    }

    /**
     * Apply WhileOnField buff card stat modifications to a beast
     */
    private applyWhileOnFieldBuffStats(beast: BloomBeastInstance, player: Player): void {
      // Check all buff cards in the player's buff zone
      for (const buffCard of player.buffZone) {
        if (!buffCard) continue;

        // Process each ability in the buff card
        for (const ability of buffCard.abilities) {
          // Only process WhileOnField abilities
          if (ability.trigger !== AbilityTrigger.WhileOnField) continue;

          // Type guard: only process structured abilities with effects
          if (!('effects' in ability)) continue;

          // Process each effect
          for (const effect of ability.effects) {
            if (effect.type !== EffectType.ModifyStats) continue;

            // Check if this effect applies to this beast
            const applies =
              effect.target === AbilityTarget.AllAllies ||
              effect.target === AbilityTarget.AllUnits;

            if (!applies) continue;

            // Apply the stat modification
            if (effect.stat === StatType.Health) {
              beast.currentHealth += effect.value;
              beast.maxHealth += effect.value;
              Logger.debug(`Applied ${buffCard.name} WhileOnField: +${effect.value} Health to ${beast.name}`);
            } else if (effect.stat === StatType.Attack) {
              beast.currentAttack += effect.value;
              Logger.debug(`Applied ${buffCard.name} WhileOnField: +${effect.value} Attack to ${beast.name}`);
            }
          }
        }
      }
    }

    /**
     * Draw cards from deck
     */
    private drawCards(player: Player, count: number): void {
      for (let i = 0; i < count; i++) {
        if (player.deck.length > 0) {
          const card = player.deck.pop();
          if (card) {
            player.hand.push(card);
          }
        }
      }
    }

    /**
     * Shuffle a player's deck
     */
    private shuffleDeck(player: Player): void {
      for (let i = player.deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [player.deck[i], player.deck[j]] = [player.deck[j], player.deck[i]];
      }
    }

    /**
     * Trigger state-based abilities
     */
    private async triggerStateBasedAbilities(playerIndex: 0 | 1, phase: 'start' | 'end'): Promise<void> {
      const activePlayer = this.state.players[playerIndex];
      const opposingPlayer = this.state.players[playerIndex === 0 ? 1 : 0];

      // Trigger abilities based on phase
      if (phase === 'start') {
        // Trigger OnOwnStartOfTurn for active player's beasts
        for (const beast of activePlayer.field) {
          if (beast) {
            await this.triggerBeastAbility(beast, 'OnOwnStartOfTurn', activePlayer, opposingPlayer);
          }
        }

        // Trigger OnOwnStartOfTurn for active player's buff cards
        for (const buffCard of activePlayer.buffZone) {
          if (buffCard) {
            await this.triggerBuffCardAbility(buffCard, 'OnOwnStartOfTurn', activePlayer, opposingPlayer);
          }
        }
      } else {
        // Trigger OnOwnEndOfTurn for active player's beasts
        for (const beast of activePlayer.field) {
          if (beast) {
            await this.triggerBeastAbility(beast, 'OnOwnEndOfTurn', activePlayer, opposingPlayer);
          }
        }

        // Trigger OnOwnEndOfTurn for active player's buff cards
        for (const buffCard of activePlayer.buffZone) {
          if (buffCard) {
            await this.triggerBuffCardAbility(buffCard, 'OnOwnEndOfTurn', activePlayer, opposingPlayer);
          }
        }
      }
    }

    /**
     * Trigger all abilities for a beast that match a specific trigger
     */
    private async triggerBeastAbility(
      beast: BloomBeastInstance,
      trigger: string,
      controllingPlayer: Player,
      opposingPlayer: Player
    ): Promise<void> {
      const cardDef = this.getCardDefinition(beast.cardId);
      if (!cardDef || cardDef.type !== 'Bloom') return;

      const beastCard = cardDef as BloomBeastCard;
      const abilities = this.getAbilitiesWithTrigger(beast, beastCard, trigger);

      // Process each ability with this trigger
      for (const ability of abilities) {
        const results = this.abilityProcessor.processAbility(ability, {
          source: beast,
          sourceCard: beastCard,
          trigger,
          gameState: this.state,
          controllingPlayer,
          opposingPlayer,
        });

        // Apply ability results to game state
        this.applyAbilityResults(results);

        // Check for battle end after ability effects
        if (this.checkForBattleEnd()) {
          this.state.battleState = BattleState.Finished;
        }
      }
    }

    /**
     * Trigger all abilities for a buff card that match a specific trigger
     */
    private async triggerBuffCardAbility(
      buffCard: any,
      trigger: string,
      controllingPlayer: Player,
      opposingPlayer: Player
    ): Promise<void> {
      // Process each ability in the buff card
      for (const ability of buffCard.abilities) {
        if (ability.trigger === trigger) {
          // Type guard: only process structured abilities with effects
          if (!('effects' in ability)) continue;

          // Process each effect in the ability
          for (const effect of ability.effects) {
            this.processBuffEffect(effect, controllingPlayer, opposingPlayer);
          }
        }
      }
    }

    /**
     * Trigger summon abilities
     */
    private triggerSummonAbilities(beast: BloomBeastInstance): void {
      const activePlayer = this.state.players[this.state.activePlayer];
      const opposingPlayer = this.state.players[this.state.activePlayer === 0 ? 1 : 0];

      // Get the card definition to access abilities
      const cardDef = this.getCardDefinition(beast.cardId);
      if (!cardDef || cardDef.type !== 'Bloom') return;

      const beastCard = cardDef as BloomBeastCard;
      const abilities = this.getAbilitiesWithTrigger(beast, beastCard, 'OnSummon');

      // Process each OnSummon ability
      for (const ability of abilities) {
        const results = this.abilityProcessor.processAbility(ability, {
          source: beast,
          sourceCard: beastCard,
          trigger: 'OnSummon',
          gameState: this.state,
          controllingPlayer: activePlayer,
          opposingPlayer: opposingPlayer,
        });

        // Apply ability results to game state
        this.applyAbilityResults(results);
      }
    }

    /**
     * Trigger OnAllySummon abilities on other beasts when a new ally is summoned
     */
    private triggerAllySummonAbilities(summonedBeast: BloomBeastInstance, controllingPlayer: Player): void {
      const opposingPlayer = this.state.players[this.state.activePlayer === 0 ? 1 : 0];

      // Get the summoned beast's card definition for checking affinity condition
      const summonedCardDef = this.getCardDefinition(summonedBeast.cardId);

      // Check all other beasts on the same side
      for (const beast of controllingPlayer.field) {
        if (!beast || beast.instanceId === summonedBeast.instanceId) continue;

        const cardDef = this.getCardDefinition(beast.cardId);
        if (!cardDef || cardDef.type !== 'Bloom') continue;

        const beastCard = cardDef as BloomBeastCard;
        const abilities = this.getAbilitiesWithTrigger(beast, beastCard, 'OnAllySummon');

        // Process each OnAllySummon ability
        for (const ability of abilities) {
          const results = this.abilityProcessor.processAbility(ability, {
            source: beast,
            sourceCard: beastCard,
            trigger: 'OnAllySummon',
            target: summonedBeast,  // Pass the summoned beast as target for condition checking
            gameState: this.state,
            controllingPlayer,
            opposingPlayer,
          });

          // Apply ability results to game state
          this.applyAbilityResults(results);
        }
      }
    }

    /**
     * Process counter effects (burn, freeze, etc.)
     */
    private async processCounterEffects(player: Player): Promise<void> {
      for (const beast of player.field) {
        if (!beast) continue;

        // Process burn counters
        const burnCounter = beast.counters.find(c => c.type === 'Burn');
        if (burnCounter && burnCounter.amount > 0) {
          beast.currentHealth = Math.max(0, beast.currentHealth - burnCounter.amount);
          Logger.debug(`${beast.instanceId} took ${burnCounter.amount} burn damage`);
        }

        // Process freeze counters (reduce by 1 each turn)
        const freezeCounter = beast.counters.find(c => c.type === 'Freeze');
        if (freezeCounter && freezeCounter.amount > 0) {
          freezeCounter.amount--;
          if (freezeCounter.amount === 0) {
            beast.counters = beast.counters.filter(c => c.type !== 'Freeze');
          }
        }

        // Remove dead beasts
        if (beast.currentHealth <= 0) {
          const index = player.field.indexOf(beast);
          if (index !== -1) {
            player.field[index] = null;
            player.graveyard.push(beast as any);
          }
        }
      }
    }

    /**
     * Clear temporary effects from a beast and revert stat modifications
     */
    private clearTemporaryEffects(beast: BloomBeastInstance): void {
      if (!beast.temporaryEffects) return;

      // Process effects that are expiring and revert their stat modifications
      beast.temporaryEffects = beast.temporaryEffects.filter(effect => {
        if (effect.turnsRemaining !== undefined) {
          effect.turnsRemaining--;

          // If effect is expiring, revert its stat changes
          if (effect.turnsRemaining <= 0 && effect.type === 'stat-mod') {
            const statMod = effect as any;

            // Revert attack modifications
            if (statMod.stat === 'attack' || statMod.stat === 'both') {
              beast.currentAttack = Math.max(0, beast.currentAttack - statMod.value);
            }

            // Revert health modifications (but don't reduce below current if it would "kill" the beast)
            if (statMod.stat === 'health' || statMod.stat === 'both') {
              // Only reduce current health if the beast had been healed by this effect
              if (statMod.value > 0) {
                beast.currentHealth = Math.max(1, Math.min(beast.maxHealth, beast.currentHealth - statMod.value));
              }
              // If it was a debuff (negative), restore health
              else if (statMod.value < 0) {
                beast.currentHealth = Math.min(beast.maxHealth, beast.currentHealth - statMod.value);
              }
            }

            Logger.debug(`Cleared temporary ${statMod.stat} modification (${statMod.value}) from ${beast.instanceId}`);
            return false; // Remove this effect
          }

          return effect.turnsRemaining > 0;
        }
        return false;
      });
    }

    /**
     * Get card definition by ID
     */
    private getCardDefinition(cardId: string): AnyCard | null {
      return this.getCardDatabase().get(cardId) || null;
    }

    /**
     * Get all current abilities for a beast based on its level
     * Takes into account ability upgrades from leveling
     */
    private getCurrentAbilities(beast: BloomBeastInstance, beastCard: BloomBeastCard): any[] {
      const { abilities } = this.levelingSystem.getCurrentAbilities(beastCard, beast.currentLevel);
      return abilities;
    }

    /**
     * Get abilities for a beast that match a specific trigger
     */
    private getAbilitiesWithTrigger(beast: BloomBeastInstance, beastCard: BloomBeastCard, trigger: string): any[] {
      const abilities = this.getCurrentAbilities(beast, beastCard);
      return abilities.filter(ability => ability.trigger === trigger);
    }

    /**
     * Check if a beast has a specific attack modification
     */
    private hasAttackModification(
      beast: BloomBeastInstance,
      modification: 'attack-first' | 'cannot-counterattack' | 'double-damage' | 'triple-damage' | 'attack-twice' | 'instant-destroy' | 'piercing' | 'lifesteal'
    ): boolean {
      const cardDef = this.getCardDefinition(beast.cardId);
      if (!cardDef || cardDef.type !== 'Bloom') return false;

      const beastCard = cardDef as BloomBeastCard;
      const abilities = this.getCurrentAbilities(beast, beastCard);

      // Check all abilities for the attack modification
      for (const ability of abilities) {
        // Only StructuredAbility has effects
        if (!ability || !('effects' in ability)) continue;

        // Check if any effect is an AttackModification with the specified modification
        for (const effect of ability.effects) {
          if (effect.type === EffectType.AttackModification && (effect as any).modification === modification) {
            // Check condition if present
            const attackModEffect = effect as any;
            if (attackModEffect.condition) {
              // TODO: Implement condition checking
              // For now, if there's a condition we need to evaluate it
              // Example: Dewdrop Drake only has attack-first when it's the only unit on field
              Logger.debug(`Attack modification '${modification}' has condition, assuming true for now`);
            }
            return true;
          }
        }
      }

      return false;
    }


    /**
     * End the match
     */
    private endMatch(result: any): void {
      Logger.debug('Match ended!', result);
      // TODO: Handle match end, rewards, etc.
    }

    /**
     * Execute attack from one beast to another or to player
     */
    public async executeAttack(
      attackingPlayer: Player,
      attackerIndex: number,
      targetType: 'beast' | 'player',
      targetIndex?: number
    ): Promise<boolean> {
      if (attackerIndex < 0 || attackerIndex >= attackingPlayer.field.length) {
        Logger.error('Invalid attacker index');
        return false;
      }

      const attacker = attackingPlayer.field[attackerIndex];
      if (!attacker) {
        Logger.error('No beast at attacker position');
        return false;
      }

      if (attacker.summoningSickness) {
        Logger.error('Beast has summoning sickness');
        return false;
      }

      const defendingPlayer = this.state.players[this.state.activePlayer === 0 ? 1 : 0];

      // Check for traps on attack
      const attackData = { attackNegated: false };
      await this.checkTraps('OnAttack', attackingPlayer, attackData);

      // If attack was negated by trap, return
      if (attackData.attackNegated) {
        Logger.debug('Attack was negated by a trap');
        return false;
      }

      // Trigger OnAttack abilities
      this.triggerCombatAbilities('OnAttack', attacker, attackingPlayer, defendingPlayer);

      if (targetType === 'beast' && targetIndex !== undefined) {
        const defender = defendingPlayer.field[targetIndex];
        if (!defender) {
          Logger.error('No beast at defender position');
          return false;
        }

        // Check for attack modifications
        const attackerHasFirstStrike = this.hasAttackModification(attacker, 'attack-first');
        const attackerCannotBeCountered = this.hasAttackModification(attacker, 'cannot-counterattack');

        const attackerDamage = attacker.currentAttack;
        const defenderDamage = defender.currentAttack;

        Logger.debug(`Combat: ${attacker.cardId} (${attackerDamage} ATK) vs ${defender.cardId} (${defenderDamage} ATK)${attackerHasFirstStrike ? ' [ATTACK-FIRST]' : ''}${attackerCannotBeCountered ? ' [NO-COUNTER]' : ''}`);

        // Handle attack-first mechanic
        if (attackerHasFirstStrike) {
          // Attacker deals damage first
          defender.currentHealth = Math.max(0, defender.currentHealth - attackerDamage);
          Logger.debug(`${attacker.cardId} attacked first for ${attackerDamage} damage. ${defender.cardId} HP: ${defender.currentHealth}/${defender.maxHealth}`);

          // Trigger OnDamage abilities on defender
          this.triggerCombatAbilities('OnDamage', defender, defendingPlayer, attackingPlayer, undefined, attacker);

          // Check if defender died from first strike
          if (defender.currentHealth <= 0) {
            Logger.debug(`${defender.cardId} was destroyed by first strike! No counter-attack.`);
            this.triggerCombatAbilities('OnDestroy', defender, defendingPlayer, attackingPlayer);
            const index = defendingPlayer.field.indexOf(defender);
            if (index !== -1) {
              defendingPlayer.field[index] = null;
              defendingPlayer.graveyard.push(defender as any);
            }

            // Check for battle end immediately
            if (this.checkForBattleEnd()) {
              this.state.battleState = BattleState.Finished;
              await this.transitionState();
            }
            return true; // Combat ends, defender died before counter-attacking
          }

          // Defender survived, now counter-attacks (unless attacker has cannot-counterattack)
          if (!attackerCannotBeCountered) {
            attacker.currentHealth = Math.max(0, attacker.currentHealth - defenderDamage);
            Logger.debug(`${defender.cardId} countered for ${defenderDamage} damage. ${attacker.cardId} HP: ${attacker.currentHealth}/${attacker.maxHealth}`);

            // Trigger OnDamage abilities on attacker
            this.triggerCombatAbilities('OnDamage', attacker, attackingPlayer, defendingPlayer, undefined, defender);

            // Check if attacker died from counter
            if (attacker.currentHealth <= 0) {
              Logger.debug(`${attacker.cardId} was destroyed by counter-attack!`);
              this.triggerCombatAbilities('OnDestroy', attacker, attackingPlayer, defendingPlayer);
              const index = attackingPlayer.field.indexOf(attacker);
              if (index !== -1) {
                attackingPlayer.field[index] = null;
                attackingPlayer.graveyard.push(attacker as any);
              }

              // Check for battle end
              if (this.checkForBattleEnd()) {
                this.state.battleState = BattleState.Finished;
                await this.transitionState();
              }
            }
          } else {
            Logger.debug(`${defender.cardId} cannot counter-attack (attacker has cannot-counterattack)`);
          }
        } else {
          // Normal simultaneous damage
          defender.currentHealth = Math.max(0, defender.currentHealth - attackerDamage);

          // Counter-attack happens unless prevented
          if (!attackerCannotBeCountered) {
            attacker.currentHealth = Math.max(0, attacker.currentHealth - defenderDamage);
            Logger.debug(`Simultaneous combat: ${attacker.cardId} dealt ${attackerDamage}, ${defender.cardId} dealt ${defenderDamage}`);
          } else {
            Logger.debug(`${attacker.cardId} dealt ${attackerDamage} damage, ${defender.cardId} cannot counter`);
          }

          // Trigger OnDamage abilities
          this.triggerCombatAbilities('OnDamage', defender, defendingPlayer, attackingPlayer, undefined, attacker);
          if (!attackerCannotBeCountered) {
            this.triggerCombatAbilities('OnDamage', attacker, attackingPlayer, defendingPlayer, undefined, defender);
          }

          // Check for deaths
          let defenderDied = false;
          if (defender.currentHealth <= 0) {
            defenderDied = true;
            Logger.debug(`${defender.cardId} was destroyed!`);
            this.triggerCombatAbilities('OnDestroy', defender, defendingPlayer, attackingPlayer);
            const index = defendingPlayer.field.indexOf(defender);
            if (index !== -1) {
              defendingPlayer.field[index] = null;
              defendingPlayer.graveyard.push(defender as any);
            }
          }

          if (attacker.currentHealth <= 0) {
            Logger.debug(`${attacker.cardId} was destroyed!`);
            this.triggerCombatAbilities('OnDestroy', attacker, attackingPlayer, defendingPlayer);
            const index = attackingPlayer.field.indexOf(attacker);
            if (index !== -1) {
              attackingPlayer.field[index] = null;
              attackingPlayer.graveyard.push(attacker as any);
            }
          }

          // Check for battle end after any death
          if (this.checkForBattleEnd()) {
            this.state.battleState = BattleState.Finished;
            await this.transitionState();
          }
        }
      } else if (targetType === 'player') {
        // Direct attack to player
        const damage = attacker.currentAttack;
        defendingPlayer.health = Math.max(0, defendingPlayer.health - damage);
        Logger.debug(`${attacker.cardId} attacked player for ${damage} damage`);

        // Check if player was defeated
        if (defendingPlayer.health <= 0) {
          Logger.debug(`${defendingPlayer.name} was defeated!`);
          this.state.battleState = BattleState.Finished;
          await this.transitionState();
        }
      }

      // Always check for battle end after any damage
      if (this.checkForBattleEnd()) {
        this.state.battleState = BattleState.Finished;
        await this.transitionState();
      }

      return true;
    }

    /**
     * Trigger combat-related abilities
     */
    private triggerCombatAbilities(
      trigger: 'OnAttack' | 'OnDamage' | 'OnDestroy',
      beast: BloomBeastInstance,
      controllingPlayer: Player,
      opposingPlayer: Player,
      target?: BloomBeastInstance,
      attacker?: BloomBeastInstance
    ): void {
      const cardDef = this.getCardDefinition(beast.cardId);
      if (!cardDef || cardDef.type !== 'Bloom') return;

      const beastCard = cardDef as BloomBeastCard;
      const abilities = this.getAbilitiesWithTrigger(beast, beastCard, trigger);

      // Process each ability with this trigger
      for (const ability of abilities) {
        const results = this.abilityProcessor.processAbility(ability, {
          source: beast,
          sourceCard: beastCard,
          trigger,
          target,
          attacker,
          gameState: this.state,
          controllingPlayer,
          opposingPlayer,
        });

        // Apply ability results to game state
        this.applyAbilityResults(results);
      }
    }

    /**
     * Check and trigger traps based on an event
     * Only triggers the FIRST matching trap (in order)
     */
    private async checkTraps(
      triggerType: 'OnBloomPlay' | 'OnHabitatPlay' | 'OnAttack' | 'OnDamage',
      triggeringPlayer: Player,
      data?: any
    ): Promise<void> {
      const opposingPlayer = triggeringPlayer === this.state.players[0]
        ? this.state.players[1]
        : this.state.players[0];

      // Check opponent's traps - only activate FIRST matching trap
      for (let i = 0; i < opposingPlayer.trapZone.length; i++) {
        const trapCard = opposingPlayer.trapZone[i];
        if (!trapCard || trapCard.type !== 'Trap') continue;

        const trap = trapCard as TrapCard;
        let shouldTrigger = false;

        // Check if trap activation condition matches the trigger
        switch (triggerType) {
          case 'OnBloomPlay':
            shouldTrigger = trap.activation.trigger === TrapTrigger.OnBloomPlay;
            break;
          case 'OnHabitatPlay':
            shouldTrigger = trap.activation.trigger === TrapTrigger.OnHabitatPlay;
            break;
          case 'OnAttack':
            shouldTrigger = trap.activation.trigger === TrapTrigger.OnAttack;
            break;
          case 'OnDamage':
            shouldTrigger = trap.activation.trigger === TrapTrigger.OnDamage;
            break;
        }

        if (shouldTrigger) {
          Logger.debug(`Trap activated: ${trap.name}`);

          // Process trap effect
          await this.processTrapEffect(trap, opposingPlayer, triggeringPlayer, data);

          // Remove trap from zone and send to graveyard
          opposingPlayer.trapZone[i] = null;
          opposingPlayer.graveyard.push(trap);

          // Only activate ONE trap per event
          return;
        }
      }
    }

    /**
     * Process trap card effect using structured effects
     */
    private async processTrapEffect(
      trap: TrapCard,
      trapOwner: Player,
      opponent: Player,
      data?: any
    ): Promise<void> {
      // Process each ability in the trap card (usually just one with OnSummon trigger)
      for (const ability of trap.abilities) {
        // Trap abilities trigger when activated (OnSummon for immediate effects)
        if (ability.trigger === AbilityTrigger.OnSummon || !ability.trigger) {
          // Type guard: only process structured abilities with effects
          if (!('effects' in ability)) continue;

          // Process each effect in the ability
          for (const effect of ability.effects) {
            switch (effect.type) {
              case EffectType.NullifyEffect:
                // Counter/nullify the triggering effect
                if (data && data.habitatCard) {
                  Logger.debug(`Habitat countered by ${trap.name}`);
                  data.countered = true;
                }
                if (data && data.attackNegated !== undefined) {
                  data.attackNegated = true;
                  Logger.debug(`Attack negated by ${trap.name}`);
                }
                break;

              case EffectType.DealDamage:
                // Deal damage based on target
                if (effect.target === AbilityTarget.AllEnemies) {
                  for (const beast of opponent.field) {
                    if (beast) {
                      const damage = typeof effect.value === 'number' ? effect.value : 0;
                      beast.currentHealth = Math.max(0, beast.currentHealth - damage);
                      if (beast.currentHealth <= 0) {
                        const index = opponent.field.indexOf(beast);
                        if (index !== -1) {
                          opponent.field[index] = null;
                          opponent.graveyard.push(beast as any);
                        }
                      }
                    }
                  }
                } else if (effect.target === AbilityTarget.OpponentGardener) {
                  const damage = typeof effect.value === 'number' ? effect.value : 0;
                  opponent.health = Math.max(0, opponent.health - damage);
                }
                break;

              case EffectType.DrawCards:
                this.drawCards(trapOwner, effect.value);
                break;

              // Add more effect types as needed
              default:
                Logger.debug(`Unhandled trap effect type: ${effect.type}`);
            }
          }
        }
      }
    }

    /**
     * Apply ability results to game state
     */
    private applyAbilityResults(results: any[]): void {
      for (const result of results) {
        if (!result.success) continue;

        // Apply modified units back to the field
        if (result.modifiedUnits && result.modifiedUnits.length > 0) {
          for (const modifiedUnit of result.modifiedUnits) {
            // Find and update the unit in both players' fields
            for (const player of this.state.players) {
              const index = player.field.findIndex(
                u => u && u.instanceId === modifiedUnit.instanceId
              );
              if (index !== -1) {
                player.field[index] = modifiedUnit;
                break;
              }
            }
          }
        }

        // Apply modified state
        if (result.modifiedState) {
          if (result.modifiedState.players) {
            this.state.players = result.modifiedState.players;
          }
          if (result.modifiedState.habitatCounters) {
            this.state.habitatCounters = result.modifiedState.habitatCounters;
          }
          if (result.modifiedState.drawCardsQueued !== undefined) {
            const playerIndex = result.modifiedState.drawForPlayerIndex ?? this.state.activePlayer;
            const player = this.state.players[playerIndex];
            this.drawCards(player, result.modifiedState.drawCardsQueued);
          }
        }

        // Log the result message if available
        if (result.message) {
          Logger.debug(result.message);
        }
      }

      // Always check for battle end after applying ability results
      if (this.checkForBattleEnd()) {
        this.state.battleState = BattleState.Finished;
        // Don't transition immediately here as we might be in the middle of processing
        // The next game loop iteration will handle the transition
      }
    }

    /**
     * Get current game state
     */
    public getState(): GameState | null {
      return this.gameState;
    }

    /**
     * Reset for new game
     */
    public reset(): void {
      // Reset to null - will be recreated on next startMatch()
      this.gameState = null;
      this.combatSystem.reset();
    }
  }

  // ==================== bloombeasts\screens\missions\MissionBattleUI.ts ====================

  /**
   * Mission Battle UI - Handles the mission battle screen and integration with game engine
   */


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
    private async: AsyncMethods;
    private currentBattle: BattleUIState | null = null;
    private renderCallback: (() => void) | null = null;
    private opponentActionCallback: ((action: string) => void) | null = null;
    private playerLowHealthTriggered: boolean = false; // Track if low health sound already played
    private battleStateManager: BattleStateManager;
    private opponentAI: OpponentAI;
    private shouldStopAI: boolean = false; // Flag to stop AI turn processing

    constructor(missionManager: MissionManager, gameEngine: GameEngine, async: AsyncMethods) {
      this.missionManager = missionManager;
      this.gameEngine = gameEngine;
      this.async = async;
      this.battleStateManager = new BattleStateManager();
      this.opponentAI = new OpponentAI({
        async,
        onAction: (action: string) => {
          if (this.opponentActionCallback) this.opponentActionCallback(action);
        },
        onRender: () => {
          if (this.renderCallback) this.renderCallback();
        },
      });
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
      // Reset AI stop flag for new battle
      this.shouldStopAI = false;

      const mission = this.missionManager.getCurrentMission();
      if (!mission) {
        Logger.error('No mission selected');
        return null;
      }

      // Create player
      const player: Player = {
        id: 'player',
        name: 'Player',
        health: 1,
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

      console.log('playerDeckCards', playerDeckCards);

      // Resolve the opponent deck (handles both DeckList and factory functions)
      const opponentDeck = resolveDeck(mission.opponentDeck);
      console.log('opponentDeck.cards', opponentDeck.cards);

      // Create AI opponent with mission-specific configuration
      // IMPORTANT: Create a copy of the deck cards to avoid mutation
      const opponentDeckCopy = [...opponentDeck.cards];
      console.log('opponentDeckCopy', opponentDeckCopy);

      const opponent: Player = {
        id: 'opponent',
        name: mission.opponentAI?.name || 'Opponent',
        health: 1,
        maxHealth: 1,
        deck: opponentDeckCopy,
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

      // Initialize game state
      // Note: Game initialization is handled inline here rather than in GameEngine
      // to allow mission-specific customization (special rules, starting conditions, etc.)
      const gameState: GameState = {
        players: [player, opponent],
        activePlayer: 0,
        habitatZone: null,
        turn: 1,
        phase: 'Setup',
        battleState: BattleState.Player1StartOfTurn,  // Start with Player 1's turn
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
        Logger.error('No active battle');
        return;
      }

      let result: any = {
        success: false,
        damage: data?.damage || 0,
      };

      // Handle different action types
      if (action.startsWith('play-card-')) {
        // Extract card index and optional target from action
        // Format: 'play-card-X' or 'play-card-X-target-Y'
        const parts = action.substring('play-card-'.length).split('-target-');
        const cardIndex = parseInt(parts[0], 10);
        const targetIndex = parts.length > 1 ? parseInt(parts[1], 10) : undefined;

        console.log('[MissionBattleUI] Playing card:', { cardIndex, targetIndex });
        result = this.playCard(cardIndex, targetIndex);
      } else if (action.startsWith('use-ability-')) {
        // Extract beast index (e.g., 'use-ability-0' -> 0)
        const beastIndex = parseInt(action.substring('use-ability-'.length), 10);
        result = this.useAbility(beastIndex);
      } else if (action === 'auto-attack-all') {
        // New auto-attack action: each beast attacks the opposite lane
        result = await this.autoAttackAll(data?.onAttackAnimation);
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
        // Fallback for any unhandled action types
        // Note: All current actions are handled by the specific handlers above
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
    private playCard(cardIndex: number, targetIndex?: number): any {
      if (!this.currentBattle || !this.currentBattle.gameState) {
        return { success: false, message: 'No active battle' };
      }

      const player = this.currentBattle.gameState.players[0];
      const opponent = this.currentBattle.gameState.players[1];

      return this.battleStateManager.playCard(cardIndex, player, opponent, this.currentBattle.gameState, targetIndex);
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

      return this.battleStateManager.attackBeast(attackerIndex, targetIndex, player, opponent, (trapName: string) => {
        if (this.opponentActionCallback) {
          this.opponentActionCallback('trap-activated');
        }
      });
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

      return this.battleStateManager.attackPlayer(attackerIndex, player, opponent, (trapName: string) => {
        if (this.opponentActionCallback) {
          this.opponentActionCallback('trap-activated');
        }
      });
    }

    /**
     * Auto-attack all: Each beast attacks the opposite lane
     * If no opposing beast, attack the opponent's health directly
     */
    private async autoAttackAll(onAttackAnimation?: (attackerIndex: number, targetType: 'beast' | 'health', targetIndex?: number) => Promise<void>): Promise<any> {
      if (!this.currentBattle || !this.currentBattle.gameState) {
        return { success: false, message: 'No active battle' };
      }

      const player = this.currentBattle.gameState.players[0];
      const opponent = this.currentBattle.gameState.players[1];

      let anyAttackSucceeded = false;
      const results: any[] = [];

      // Loop through all 3 field positions
      for (let i = 0; i < 3; i++) {
        const attackerBeast = player.field[i];

        // Skip if no beast at this position
        if (!attackerBeast) {
          continue;
        }

        // Skip if beast has summoning sickness
        if (attackerBeast.summoningSickness) {
          Logger.debug(`Beast at position ${i} has summoning sickness, skipping`);
          continue;
        }

        const opposingBeast = opponent.field[i];

        if (opposingBeast) {
          // Attack the opposing beast
          if (onAttackAnimation) {
            await onAttackAnimation(i, 'beast', i);
          }
          const result = this.attackBeast(i, i);
          results.push(result);
          if (result.success) {
            anyAttackSucceeded = true;
          }
        } else {
          // No opposing beast, attack player directly
          if (onAttackAnimation) {
            await onAttackAnimation(i, 'health');
          }
          const result = this.attackPlayer(i);
          results.push(result);
          if (result.success) {
            anyAttackSucceeded = true;
          }
        }

        // Check for battle end after each attack
        if (this.checkBattleEnd()) {
          break;
        }
      }

      return {
        success: anyAttackSucceeded,
        results: results,
        message: anyAttackSucceeded ? 'Auto-attack completed' : 'No attacks could be performed'
      };
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

      return this.battleStateManager.useAbility(beastIndex, player, opponent, this.currentBattle.gameState);
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
      this.battleStateManager.processEndOfTurnTriggers(player, opponent);

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
        Logger.debug(`Deathmatch! Both players lose ${deathmatchDamage} health`);
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
      this.battleStateManager.applyBuffStartOfTurnEffects(player, opponent);

      // Process StartOfTurn triggers for player beasts
      this.battleStateManager.processStartOfTurnTriggers(player, opponent);

      // Reapply stat buffs to all beasts (Battle Fury, Mystic Shield)
      this.battleStateManager.applyStatBuffEffects(player);

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
          Logger.debug(`Drew card: ${card.name}`);
        }
      } else {
        Logger.debug('Deck is empty - cannot draw');
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
      const delay = (ms: number) => new Promise(resolve => this.async.setTimeout(resolve, ms));

      // Draw a card
      this.drawCard(opponent);
      if (this.renderCallback) this.renderCallback();
      await delay(800);
      if (this.shouldStopAI) return; // Stop if battle ended

      // Increase opponent nectar
      opponent.currentNectar = Math.min(10, this.currentBattle.gameState.turn);
      if (this.renderCallback) this.renderCallback();
      await delay(500);
      if (this.shouldStopAI) return; // Stop if battle ended

      // Apply buff card start-of-turn effects for opponent (Swift Wind, Nature's Blessing)
      this.battleStateManager.applyBuffStartOfTurnEffects(opponent, player);

      // Process StartOfTurn triggers for opponent beasts
      this.battleStateManager.processStartOfTurnTriggers(opponent, player);

      // Reapply stat buffs to all opponent beasts (Battle Fury, Mystic Shield)
      this.battleStateManager.applyStatBuffEffects(opponent);

      // Remove summoning sickness from beasts that were already on the field at start of turn
      // (Don't remove from beasts that will be summoned this turn)
      opponent.field.forEach((beast: any) => {
        if (beast) {
          beast.summoningSickness = false;
          beast.usedAbilityThisTurn = false; // Reset ability usage
        }
      });

      // Delegate to OpponentAI for decision making and execution
      await this.opponentAI.executeTurn(opponent, player, this.currentBattle.gameState, {
        processOnSummonTrigger: this.battleStateManager.processOnSummonTrigger.bind(this.battleStateManager),
        processOnAttackTrigger: this.battleStateManager.processOnAttackTrigger.bind(this.battleStateManager),
        processOnDamageTrigger: this.battleStateManager.processOnDamageTrigger.bind(this.battleStateManager),
        processOnDestroyTrigger: this.battleStateManager.processOnDestroyTrigger.bind(this.battleStateManager),
        processMagicEffect: this.battleStateManager.processMagicEffect.bind(this.battleStateManager),
        processHabitatEffect: this.battleStateManager.processHabitatEffect.bind(this.battleStateManager),
        applyStatBuffEffects: this.battleStateManager.applyStatBuffEffects.bind(this.battleStateManager),
      }, () => this.shouldStopAI); // Pass shouldStopAI getter

      if (this.shouldStopAI) return; // Stop if battle ended

      // Check if player health reached 0 during AI turn - end battle immediately
      if (player.health <= 0) {
        this.endBattle();
        return; // Stop opponent turn processing
      }

      // Check if player health dropped below 10% threshold (for low health sound)
      const maxHealth = player.maxHealth || 30;
      const healthPercentage = (player.health / maxHealth) * 100;
      if (healthPercentage <= 10 && !this.playerLowHealthTriggered) {
        this.playerLowHealthTriggered = true;
        if (this.opponentActionCallback) this.opponentActionCallback('player-low-health');
      }
    }

    /**
     * Shuffle a deck using Fisher-Yates algorithm
     */
    private shuffleDeck(deck: any[]): void {
      shuffle(deck);
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
              // Apply periodic buffs to Fire and Water beasts every 3 turns
              gameState.players.forEach(player => {
                player.field.forEach(beast => {
                  if (beast && (beast.affinity === 'Fire' || beast.affinity === 'Water')) {
                    // Buff Fire and Water affinity beasts
                    beast.currentAttack = (beast.currentAttack || 0) + 1;
                    beast.currentHealth = Math.min(beast.maxHealth, beast.currentHealth + 1);
                    Logger.debug(`${beast.name} buffed by Elemental Flux (+1/+1)`);
                  }
                });
              });
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

      // Stop AI turn processing immediately
      this.shouldStopAI = true;

      const player = this.currentBattle.gameState?.players[0];
      const opponent = this.currentBattle.gameState?.players[1];

      if (player && opponent && opponent.health <= 0 && player.health > 0) {
        // Victory!
        const rewards = this.missionManager.completeMission();

        if (rewards) {
          this.currentBattle.isComplete = true;
          this.currentBattle.rewards = rewards;
          Logger.debug('Mission Complete!', rewards);
        }
      } else {
        // Defeat - player health reached 0 or other loss condition
        Logger.debug('Mission Failed - Player Defeated');
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
      if (progressDisplay && this.currentBattle.mission.objectives) {
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
      this.shouldStopAI = true; // Stop any ongoing AI processing
      this.currentBattle = null;
      this.renderCallback = null; // Clear callback to prevent race conditions
      this.playerLowHealthTriggered = false; // Reset low health flag
    }
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
      if (card.type === 'Bloom') {
        // Bloom cards use beast artwork
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

  export interface AssetReference {
    type: 'image' | 'audio' | 'animation';
    horizonAssetId?: string; // Optional - only for Horizon deployment
    path: string; // Relative path from project root
    description?: string; // Optional description for documentation
  }

  export interface CardAssetEntry {
    id: string;
    type: 'beast' | 'buff' | 'trap' | 'magic' | 'habitat';
    cardType?: 'Bloom' | 'Magic' | 'Trap' | 'Buff'; // Game engine card type
    affinity?: 'fire' | 'forest' | 'sky' | 'water'; // For beasts and habitats
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
    type: 'mission';
    affinity?: 'fire' | 'forest' | 'sky' | 'water' | 'boss';
    missionNumber: number;
    name: string;
    description: string;
    assets: AssetReference[];
  }

  export interface UIAssetEntry {
    id: string;
    type: 'ui';
    category: 'frame' | 'button' | 'background' | 'icon' | 'chest' | 'container' | 'card-template' | 'other';
    name: string;
    description?: string;
    assets: AssetReference[];
  }

  export interface AssetCatalog {
    version: string;
    category: 'fire' | 'forest' | 'sky' | 'water' | 'buff' | 'trap' | 'magic' | 'common';
    description: string;
    data: (CardAssetEntry | MissionAssetEntry | UIAssetEntry)[];
  }

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
      console.log(`[AssetCatalogManager] Loading catalog: ${catalogKey}`);
      this.catalogs.set(catalogKey, catalog);

      // Index all assets by ID for quick lookup
      catalog.data.forEach(entry => {
        console.log(`[AssetCatalogManager]   Indexing entry: ${entry.id}`);
        this.assetIndex.set(entry.id, entry);

        // Create reverse mappings
        entry.assets.forEach(asset => {
          this.pathToIdMap.set(asset.path, entry.id);
          if (asset.horizonAssetId) {
            this.horizonIdMap.set(asset.horizonAssetId, entry.id);
          }
        });
      });

      console.log(`[AssetCatalogManager] ✅ Loaded ${catalog.category} catalog with ${catalog.data.length} entries`);
      console.log(`[AssetCatalogManager]   Total assets indexed: ${this.assetIndex.size}`);
      console.log(`[AssetCatalogManager]   Total catalogs: ${this.catalogs.size}`);
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
      type: 'beast' | 'buff' | 'trap' | 'magic' | 'habitat' | 'mission' | 'ui'
    ): T[] {
      const results: T[] = [];
      this.assetIndex.forEach(entry => {
        if (entry.type === type || (entry.type === 'ui' && type === 'ui')) {
          results.push(entry as T);
        } else if (type !== 'mission' && type !== 'ui' && (entry as CardAssetEntry).type === type) {
          results.push(entry as T);
        }
      });
      return results;
    }

    /**
     * Get all cards by affinity
     */
    getCardsByAffinity(affinity: 'fire' | 'forest' | 'sky' | 'water'): CardAssetEntry[] {
      const results: CardAssetEntry[] = [];
      this.assetIndex.forEach(entry => {
        if (entry.type === 'beast' || entry.type === 'habitat') {
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
    getHorizonAssetId(assetId: string, assetType: 'image' | 'audio' = 'image'): string | undefined {
      const asset = this.getAsset(assetId);
      if (!asset) return undefined;

      const assetRef = asset.assets.find(a => a.type === assetType);
      return assetRef?.horizonAssetId;
    }

    /**
     * Get local path for a given asset
     */
    getAssetPath(assetId: string, assetType: 'image' | 'audio' = 'image'): string | undefined {
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
          if (asset.type === 'image' && !images[id]) {
            images[id] = asset.path;
          } else if (asset.type === 'audio' && !sounds[id]) {
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
            if (asset.type === 'image' && !images[id]) {
              images[id] = asset.horizonAssetId;
            } else if (asset.type === 'audio' && !sounds[id]) {
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
        if (entry.type === 'beast' || entry.type === 'magic' ||
            entry.type === 'trap' || entry.type === 'buff' || entry.type === 'habitat') {
          const cardEntry = entry as CardAssetEntry;
          // Add rarity for reward system (same logic as old getAllCards)
          const cardData: any = { ...cardEntry.data };

          if (cardEntry.type === 'beast') {
            // Assign rarity based on nectar cost
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
      const buffEntries = this.getAssetsByType('buff');
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
    buttons: 15,
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
    width: 105,
    height: 36,
  };

  export const longButtonDimensions = {
    width: 201,
    height: 35,
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
   * Extend CardDisplayData with additional UI properties
   * These are properties used in the UI but not in the core game model
   */
  export interface UICardDisplay extends CardDisplayData {
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
   * Convert CardDisplayData to UICardDisplay with additional UI properties
   */
  export function toUICard(card: CardDisplayData): UICardDisplay {
    const uiCard: UICardDisplay = {
      ...card,
      attack: card.baseAttack || 0,
      defense: 0, // Not in CardDisplayData - using 0 as default
      health: card.baseHealth || 0,
      emoji: getCardEmoji(card),
      rarityLevel: getCardRarity(card)
    };
    return uiCard;
  }

  /**
   * Get emoji based on card affinity
   */
  function getCardEmoji(card: CardDisplayData): string {
    switch (card.affinity?.toLowerCase()) {
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
  function getCardRarity(card: CardDisplayData): 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' {
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
      tokens?: number;
      diamonds?: number;
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
    x: 1145,
    y: 128,
    headerStartPosition: { x: 1156, y: 139 },
    textStartPosition: { x: 1162, y: 188 },
    buttonStartPosition: { x: 1156, y: 369 },
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

  // ==================== bloombeasts\ui\screens\common\SideMenu.ts ====================

  /**
   * Common Side Menu Component
   * Shared sidebar used across all unified screens (Horizon & Web)
   */


  // SideMenu-specific constants
  const sideMenuDimensions = {
    width: 127,
    height: 465,
  };

  export interface SideMenuButton {
      label: string | ValueBindingBase<string>;
      onClick: () => void;
      disabled?: boolean | ValueBindingBase<boolean>;
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
      /** PlayerData binding for deriving player info */
      playerDataBinding?: any;
      /** Stats binding for player info (deprecated - use playerDataBinding) */
      stats?: ValueBindingBase<MenuStats | null> | any;
      /** Callback for XP bar click */
      onXPBarClick?: (title: string, message: string) => void;
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
                      text: typeof config.title === 'string' ? new ui.Binding(config.title) : config.title,
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
                  children: config.buttons.map(button =>
                      createSideMenuButton(
                          ui,
                          button.label,
                          0,
                          button.yOffset !== undefined ? button.yOffset : 0,
                          button.onClick,
                          button.disabled
                      )
                  ),
              })
          );
      }

      // Player info at bottom of sidebar (aligned to bottom like web deployment)
      children.push(
          ui.View({
              style: {
                  position: 'absolute',
                  left: 0,
                  top: sideMenuDimensions.height - 40,
                  width: sideMenuDimensions.width,
                  height: 50,
              },
              children: createPlayerInfo(ui, config.playerDataBinding, config.stats, config.onXPBarClick),
          })
      );

      // Bottom button (if provided, at headerStartPosition)
      if (config.bottomButton) {
          children.push(
              createSideMenuButton(
                  ui,
                  config.bottomButton.label,
                  headerRelativeX,
                  headerRelativeY,
                  config.bottomButton.onClick,
                  config.bottomButton.disabled
              )
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
              // Sidebar background image
              ui.Image({
                  source: ui.Binding.derive(
                      [ui.assetsLoadedBinding],
                      (assetsLoaded: boolean) => assetsLoaded ? ui.assetIdToImageSource?.('side-menu') : null
                  ),
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
   * Create a side menu button with image background
   */
  function createSideMenuButton(
      ui: UIMethodMappings,
      label: string | ValueBindingBase<string>,
      x: number,
      y: number,
      onClick: () => void,
      disabled?: boolean | ValueBindingBase<boolean>
  ): UINodeType {
      const labelBinding = typeof label === 'string' ? new ui.Binding(label) : label;
      const disabledValue = typeof disabled === 'boolean' ? disabled : false;
      const disabledBinding = typeof disabled === 'object' && 'get' in disabled ? disabled : undefined;

      // Create hover state binding for opacity effect
      const hoverBinding = new ui.Binding(false);

      // Calculate opacity based on hover and disabled state (reactive to binding if present)
      const opacityBinding = disabledBinding
          ? ui.Binding.derive(
              [hoverBinding, disabledBinding],
              (isHovered: boolean, isDisabled: boolean) => {
                  if (isDisabled) return 0.5;
                  return isHovered ? 0.8 : 1.0;
              }
          )
          : ui.Binding.derive(
              [hoverBinding],
              (isHovered: boolean) => {
                  if (disabledValue) return 0.5;
                  return isHovered ? 0.8 : 1.0;
              }
          );

      return ui.Pressable({
          onClick: onClick,
          disabled: disabledBinding || disabledValue,
          onHoverIn: () => {
              if (!disabledValue) {
                  hoverBinding.set(true);
              }
          },
          onHoverOut: () => {
              hoverBinding.set(false);
          },
          style: {
              position: 'absolute',
              left: x,
              top: y,
              width: sideMenuButtonDimensions.width,
              height: sideMenuButtonDimensions.height,
          },
          children: [
              // Button background image
              ui.Image({
                  source: ui.Binding.derive(
                      [ui.assetsLoadedBinding],
                      (assetsLoaded: boolean) => assetsLoaded ? ui.assetIdToImageSource?.('standard-button') : null
                  ),
                  style: {
                      position: 'absolute',
                      width: sideMenuButtonDimensions.width,
                      height: sideMenuButtonDimensions.height,
                      opacity: opacityBinding,
                  },
              }),
              // Button text centered
              ui.View({
                  style: {
                      position: 'absolute',
                      width: sideMenuButtonDimensions.width,
                      height: sideMenuButtonDimensions.height,
                      justifyContent: 'center',
                      alignItems: 'center',
                  },
                  children: ui.Text({
                      text: labelBinding,
                      style: {
                          fontSize: DIMENSIONS.fontSize.md,
                          color: disabledBinding
                              ? ui.Binding.derive(
                                  [disabledBinding],
                                  (isDisabled: boolean) => isDisabled ? '#888' : COLORS.textPrimary
                              )
                              : (disabledValue ? '#888' : COLORS.textPrimary),
                          textAlign: 'center',
                          fontWeight: 'bold',
                          textAlignVertical: 'center',
                      },
                  }),
              }),
          ],
      });
  }

  /**
   * Create player info display (name, level, XP bar)
   * Positioned using sideMenuPositions
   */
  function createPlayerInfo(
      ui: UIMethodMappings,
      playerDataBinding: any | undefined,
      stats: ValueBindingBase<MenuStats | null> | any | undefined,
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
              tokens: getItemQuantity(pd.items || [], 'token'),
              diamonds: getItemQuantity(pd.items || [], 'diamond'),
              serums: getItemQuantity(pd.items || [], 'serum'),
          };
      };

      // Use playerDataBinding if provided, otherwise use stats
      // Derive directly from the source binding to avoid nesting
      const sourceBinding = playerDataBinding || stats;

      // Create derived bindings for reactive values (Horizon best practice)
      // Derive final values directly from base binding to avoid chaining
      const xpWidthBinding = sourceBinding.derive((data: any) => {
          const statsVal = playerDataBinding ? extractStats(data) : data;
          if (!statsVal) return '0%';
          const xpThresholds = [0, 100, 300, 700, 1500, 3100, 6300, 12700, 25500];
          const currentLevel = statsVal.playerLevel;
          const totalXP = statsVal.totalXP;
          const xpForCurrentLevel = xpThresholds[currentLevel - 1];
          const xpForNextLevel = currentLevel < 9 ? xpThresholds[currentLevel] : xpThresholds[8];
          const currentXP = totalXP - xpForCurrentLevel;
          const xpNeeded = xpForNextLevel - xpForCurrentLevel;
          const xpPercent = Math.min(100, (currentXP / xpNeeded) * 100);
          return `${xpPercent}%`;
      });

      const levelTextBinding = sourceBinding.derive((data: any) => {
          const statsVal = playerDataBinding ? extractStats(data) : data;
          return statsVal ? `${statsVal.playerLevel}` : '1';
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
                      text: new ui.Binding('Player'),
                      style: {
                          fontSize: sideMenuPositions.playerName.size,
                          color: COLORS.textPrimary,
                          textAlign: sideMenuPositions.playerName.textAlign as any,
                      },
                  }),
              }),

              // XP Bar
              ui.View({
                  style: {
                      position: 'absolute',
                      left: sideMenuPositions.playerExperienceBar.x,
                      top: 19, // Offset from player name
                      width: sideMenuPositions.playerExperienceBar.maxWidth,
                      height: 11,
                  },
                  children: (() => {
                      // Create a variable to hold the current stats value
                      let currentStats: MenuStats | null = null;

                      // Use a derived binding to keep currentStats updated
                      // This binding is used in the XP width calculation, so it will be evaluated
                      const xpWidthWithTracking = ui.Binding.derive(
                          [sourceBinding],
                          (data: any) => {
                              const statsVal = playerDataBinding ? extractStats(data) : data;
                              currentStats = statsVal; // Track the current value
                              if (!statsVal) return 0;
                              const xpThresholds = [0, 100, 300, 700, 1500, 3100, 6300, 12700, 25500];
                              const currentLevel = statsVal.playerLevel;
                              const totalXP = statsVal.totalXP;
                              const xpForCurrentLevel = xpThresholds[currentLevel - 1];
                              const xpForNextLevel = currentLevel < 9 ? xpThresholds[currentLevel] : xpThresholds[8];
                              const currentXP = totalXP - xpForCurrentLevel;
                              const xpNeeded = xpForNextLevel - xpForCurrentLevel;
                              const progress = xpNeeded > 0 ? (currentXP / xpNeeded) : 1;
                              return Math.round(progress * sideMenuPositions.playerExperienceBar.maxWidth);
                          }
                      );

                      return ui.Pressable({
                          onClick: () => {
                              if (onXPBarClick && currentStats) {
                                  const xpThresholds = [0, 100, 300, 700, 1500, 3100, 6300, 12700, 25500];
                                  const currentLevel = currentStats.playerLevel;
                                  const totalXP = currentStats.totalXP;
                                  const xpForCurrentLevel = xpThresholds[currentLevel - 1];
                                  const xpForNextLevel = currentLevel < 9 ? xpThresholds[currentLevel] : xpThresholds[8];
                                  const currentXP = totalXP - xpForCurrentLevel;
                                  const xpNeeded = xpForNextLevel - xpForCurrentLevel;
                                  const title = `Level ${currentLevel}`;
                                  const message = `Current XP: ${currentXP} / ${xpNeeded}\n\nTotal XP: ${totalXP}`;
                                  onXPBarClick(title, message);
                              }
                          },
                          style: {
                              width: '100%',
                              height: '100%',
                          },
                          children: ui.Image({
                              source: ui.Binding.derive(
                                  [ui.assetsLoadedBinding],
                                  (assetsLoaded: boolean) => assetsLoaded ? ui.assetIdToImageSource?.('experience-bar') : null
                              ),
                              style: {
                                  width: xpWidthWithTracking,
                                  height: 11,
                              },
                          }),
                      });
                  })(),
              }),

              // Level text (centered on XP bar)
              ui.View({
                  style: {
                      position: 'absolute',
                      left: sideMenuPositions.playerLevel.x,
                      top: 19,
                      width: 20,
                      height: 11,
                      justifyContent: 'center',
                      alignItems: 'center',
                  },
                  children: ui.Text({
                      text: levelTextBinding,
                      style: {
                          fontSize: sideMenuPositions.playerLevel.size,
                          color: COLORS.textPrimary,
                          textAlign: 'center',
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
              text: typeof text === 'string' ? new ui.Binding(text) : text,
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
          ? new ui.Binding(`${emoji} ${amount}`)
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

  // ==================== bloombeasts\ui\bindings\BaseBinding.ts ====================

  /**
   * Base Binding Class
   * Platform-agnostic reactive value container
   */

  export class BaseBinding<T> {
    protected value: T;
    protected listeners: Set<() => void> = new Set();

    constructor(initialValue: T) {
      this.value = initialValue;
    }

    /**
     * Get the current value
     */
    get(): T {
      return this.value;
    }

    /**
     * Set a new value
     */
    set(newValue: T): void {
      if (this.value !== newValue) {
        this.value = newValue;
        this.notifyListeners();
      }
    }

    /**
     * Create a derived binding from this one
     */
    derive<R>(fn: (val: T) => R): BaseBinding<R> {
      const derived = new BaseBinding(fn(this.value));

      // Update derived when source changes
      this.addListener(() => {
        derived.set(fn(this.get()));
      });

      return derived;
    }

    /**
     * Add a listener that fires when value changes
     */
    addListener(listener: () => void): void {
      this.listeners.add(listener);
    }

    /**
     * Remove a listener
     */
    removeListener(listener: () => void): void {
      this.listeners.delete(listener);
    }

    /**
     * Notify all listeners of a change
     */
    protected notifyListeners(): void {
      this.listeners.forEach(listener => listener());
    }

    /**
     * Clean up resources (override in subclasses)
     * Clears all listeners to prevent memory leaks
     */
    dispose(): void {
      this.listeners.clear();
    }

    /**
     * Get the number of active listeners (for debugging)
     */
    getListenerCount(): number {
      return this.listeners.size;
    }
  }

  // ==================== bloombeasts\ui\bindings\IntervaledBinding.ts ====================

  /**
   * Intervaled Binding
   * A binding that updates its value on a fixed interval
   */


  export class IntervaledBinding<T> extends BaseBinding<T> {
    private intervalId: number | null = null;

    /**
     * Create an intervaled binding
     * @param initialValue - Starting value
     * @param updateFn - Function that computes the next value from current value
     * @param intervalMs - Interval duration in milliseconds
     * @param async - Platform-specific async methods (setInterval, clearInterval)
     */
    constructor(
      initialValue: T,
      private updateFn: (currentValue: T) => T,
      private intervalMs: number,
      private async: AsyncMethods
    ) {
      super(initialValue);
      this.startInterval();
    }

    /**
     * Start the interval timer
     */
    private startInterval(): void {
      this.intervalId = this.async.setInterval(() => {
        const newValue = this.updateFn(this.value);
        this.set(newValue);
      }, this.intervalMs);
    }

    /**
     * Stop the interval and clean up
     */
    dispose(): void {
      if (this.intervalId !== null) {
        this.async.clearInterval(this.intervalId);
        this.intervalId = null;
      }
      super.dispose();
    }
  }

  // ==================== bloombeasts\ui\screens\MenuScreen.ts ====================

  /**
   * Unified Menu Screen Component
   * Works on both Horizon and Web platforms
   * Matches the styling from menuScreen.new.ts
   */


  export interface MenuScreenProps {
    ui: UIMethodMappings;
    async: AsyncMethods;
    playerDataBinding: any; // PlayerData binding
    onButtonClick?: (buttonId: string) => void;
    onNavigate?: (screen: string) => void;
    onRenderNeeded?: () => void;
  }

  /**
   * Unified Menu Screen that works on both platforms
   */
  export class MenuScreen {
    // UI methods (injected)
    private ui: UIMethodMappings;
    private async: AsyncMethods;

    // State bindings
    private displayedText: any;
    private playerDataBinding: any;
    private menuFrameAnimation: BindingInterface<string>;
    private frameInterval: any;

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

    constructor(props: MenuScreenProps) {
      this.ui = props.ui;
      this.async = props.async;
      this.playerDataBinding = props.playerDataBinding;
      this.onButtonClick = props.onButtonClick;
      this.onNavigate = props.onNavigate;
      this.onRenderNeeded = props.onRenderNeeded;

      // Initialize bindings using injected UI implementation
      this.displayedText = new this.ui.Binding('');

      // Show the first quote statically
      this.displayedText.set(this.quotes[0]);

      // Create animated binding for menu frames
      let frameIndex = 0;
      this.menuFrameAnimation = new this.ui.Binding<string>(this.menuFrameIds[0]);
      this.frameInterval = this.async.setInterval(() => {
        frameIndex = (frameIndex + 1) % this.menuFrameIds.length;
        this.menuFrameAnimation.set(this.menuFrameIds[frameIndex]);
        // Trigger a render when the frame changes
        if (this.onRenderNeeded) {
          this.onRenderNeeded();
        }
      }, 200);
    }

    /**
     * Create the unified menu UI - uses common side menu
     */
    createUI(): UINodeType {
      const menuOptions = ['missions', 'cards', 'settings'];
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

      // Create custom text content (quote + resources)
      // Derive item quantities from playerData
      const getItemQuantity = (items: any[], itemId: string) => {
        const item = items?.find((i: any) => i.itemId === itemId);
        return item ? item.quantity : 0;
      };

      const tokensText = this.playerDataBinding.derive((pd: any) =>
        `🪙 ${pd ? getItemQuantity(pd.items, 'token') : 0}`
      );
      const diamondsText = this.playerDataBinding.derive((pd: any) =>
        `💎 ${pd ? getItemQuantity(pd.items, 'diamond') : 0}`
      );
      const serumsText = this.playerDataBinding.derive((pd: any) =>
        `🧪 ${pd ? getItemQuantity(pd.items, 'serum') : 0}`
      );

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
                width: 110,
              },
              children: this.ui.Text({
                text: this.displayedText,
                numberOfLines: 3,
                style: {
                  fontSize: DIMENSIONS.fontSize.lg,
                  color: COLORS.textPrimary,
                  lineHeight: lineHeight,
                },
              }),
            }),

            // Resources (lines 4-6) - using createTextRow instead of createResourceRow
            createTextRow(this.ui, tokensText, lineHeight * 4),
            createTextRow(this.ui, diamondsText, lineHeight * 5),
            createTextRow(this.ui, serumsText, lineHeight * 6),
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
            source: this.ui.Binding.derive(
              [this.ui.assetsLoadedBinding],
              (assetsLoaded: boolean) => {
                return assetsLoaded ? this.ui.assetIdToImageSource?.('background') : null;
              }
            ),
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
              // Animated character frame - try without centering first
              this.ui.Image({
                  source: this.ui.Binding.derive(
                    [this.ui.assetsLoadedBinding, this.menuFrameAnimation],
                    (assetsLoaded: boolean, menuFrameAnimation: string) => {
                      // console.log('[MenuScreen] Image binding fired:', { assetsLoaded, menuFrameAnimation });

                      if (!assetsLoaded) {
                        console.log('[MenuScreen] Assets not loaded yet');
                        return null;
                      }

                      return this.ui.assetIdToImageSource?.(menuFrameAnimation);
                    },
                  ),
                  style: {
                    position: 'absolute',
                    left: 250,
                    top: 4,
                    width: 675,
                    height: 630,
                  },
                }),
            ],
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
            playerDataBinding: this.playerDataBinding,
            onXPBarClick: (title: string, message: string) => {
              if (this.onButtonClick) {
                this.onButtonClick(`show-counter-info:${title}:${message}`);
              }
            },
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
        settings: 'Settings',
      };
      return labels[option] || option;
    }

    /**
     * Clean up animations
     */
    dispose(): void {
      if (this.frameInterval) {
        this.async.clearInterval(this.frameInterval);
      }
    }
  }

  // ==================== bloombeasts\ui\constants\emojis.ts ====================

  export const nectarEmoji = '🏵️';
  export const missionEmoji = '🎯';
  export const deckEmoji = '🎲';
  export const playerLevelEmoji = '💪';
  export const playerExperienceEmoji = '🧪';

  // ==================== bloombeasts\ui\screens\common\CardRenderer.ts ====================

  /**
   * Common Card Rendering Component
   * Reusable card display with multi-layer rendering
   */


  export interface CardRendererProps {
    card: CardDisplayData;
    isInDeck?: boolean;
    onClick?: (cardId: string) => void;
    showDeckIndicator?: boolean;
  }

  /**
   * Create a card UI component with proper multi-layer rendering
   * This follows the standard card format:
   * - Layer 1: Card artwork (185x185) - beast image for Bloom, card art for others
   * - Layer 2: Base card frame (210x280) - BaseCard.png
   * - Layer 3: Type-specific template overlay (MagicCard, TrapCard, etc.)
   * - Layer 4: Affinity icon (for Bloom cards)
   * - Layer 5: Experience bar (for Bloom cards with levels)
   * - Layer 6: Text overlays (name, cost, stats, level, ability)
   * - Layer 7: Deck indicator (if showDeckIndicator is true)
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
    const baseCardKey = 'base-card'; // All cards use base-card as the frame

    // Type-specific template overlay
    // Habitat cards use habitat templates from affinity folders
    let templateKey = '';
    if (card.type === 'Habitat' && card.affinity) {
      // Template key format: affinity-habitat (e.g., 'forest-habitat')
      templateKey = `${card.affinity.toLowerCase()}-habitat`;
    } else if (card.type !== 'Bloom') {
      templateKey = `${card.type.toLowerCase()}-card`;
    }

    // Affinity icon key format: affinity-icon (e.g., 'forest-icon', 'fire-icon')
    const affinityKey = card.affinity ? `${card.affinity.toLowerCase()}-icon` : '';
    const expBarKey = 'experience-bar';

    // Get card description for ability text using the official cardDescriptionGenerator
    const abilityText = getCardDescription(card);

    // Debug logging for cards without descriptions
    if ((!abilityText || abilityText.trim() === '') && card.type !== 'Bloom') {
      console.log(`[CardRenderer] ❌ No description for ${card.name} (${card.type}, id: ${card.id})`);
      console.log(`  Abilities:`, card.abilities);
      console.log(`  Generated abilityText: "${abilityText}"`);
    } else if (card.type !== 'Bloom') {
      console.log(`[CardRenderer] ✅ ${card.name} (${card.type}): "${abilityText}"`);
    }

    // Cache assetIdToImageSource to ensure it's captured properly in closures
    const getImageSource = ui.assetIdToImageSource!;

    const children = [
        // Layer 1: Card/Beast artwork image (185x185)
        // For Bloom cards: use beast image
        // For other cards (Magic/Trap/Buff/Habitat): use card artwork image
        ui.Image({
          source: ui.Binding.derive(
            [ui.assetsLoadedBinding],
            (assetsLoaded: boolean) => {
              if (!assetsLoaded) return null;
              const imageKey = card.type === 'Bloom' ? beastImageKey : cardImageKey;
              if (!imageKey) return null;
              return getImageSource(imageKey);
            }
          ),
          style: {
            width: beastImageWidth,
            height: beastImageHeight,
            position: 'absolute',
            top: positions.beastImage.y,
            left: positions.beastImage.x,
          },
        }),

        // Layer 2: Base card frame (210x280) - ALL cards use BaseCard.png
        ui.Image({
          source: ui.Binding.derive(
            [ui.assetsLoadedBinding],
            (assetsLoaded: boolean) => assetsLoaded ? getImageSource(baseCardKey) : null
          ),
          style: {
            width: cardWidth,
            height: cardHeight,
            position: 'absolute',
            top: 0,
            left: 0,
          },
        }),

        // Layer 2.5: Template overlay for non-Bloom cards (Magic/Trap/Buff/Habitat)
        ...(templateKey ? [
          ui.Image({
            source: ui.Binding.derive(
              [ui.assetsLoadedBinding],
              (assetsLoaded: boolean) => assetsLoaded ? getImageSource(templateKey) : null
            ),
            style: {
              width: cardWidth,
              height: cardHeight,
              position: 'absolute',
              top: 0,
              left: 0,
            },
          })
        ] : []),

        // Layer 3: Affinity icon (for Bloom cards)
        ...(card.type === 'Bloom' && card.affinity && affinityKey ? [
          ui.Image({
            source: ui.Binding.derive(
              [ui.assetsLoadedBinding],
              (assetsLoaded: boolean) => assetsLoaded ? getImageSource(affinityKey) : null
            ),
            style: {
              width: 30,
              height: 30,
              position: 'absolute',
              top: positions.affinity.y,
              left: positions.affinity.x,
            },
          })
        ] : []),

        // Layer 4: Experience bar (for Bloom cards with level)
        ...(card.type === 'Bloom' && card.level ? [
          ui.Image({
            source: ui.Binding.derive(
              [ui.assetsLoadedBinding],
              (assetsLoaded: boolean) => assetsLoaded ? getImageSource(expBarKey) : null
            ),
            style: {
              width: 120,
              height: 20,
              position: 'absolute',
              top: positions.experienceBar.y,
              left: positions.experienceBar.x,
            },
          })
        ] : []),

        // Layer 5: Text overlays
        // Card name
        ui.Text({
          text: new ui.Binding(card.name || ''),
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
            text: new ui.Binding(String(card.cost)),
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

        // Attack and Health (for Bloom cards)
        ...(card.type === 'Bloom' && ((card as any).currentAttack !== undefined || (card as any).baseAttack !== undefined) ? [
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

        ...(card.type === 'Bloom' && ((card as any).currentHealth !== undefined || (card as any).baseHealth !== undefined) ? [
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

        // Level (for all cards)
        ...(card.level !== undefined ? [
          ui.Text({
            text: new ui.Binding(`Level ${card.level}`),
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
            text: new ui.Binding(abilityText),
            numberOfLines: 3,
            style: {
              position: 'absolute',
              top: positions.ability.y,
              left: positions.ability.x,
              width: 168,
              fontSize: DIMENSIONS.fontSize.xs,
              color: COLORS.textPrimary,
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
   * Supports two modes:
   * 1. Slot-based: Use slotIndex + cardsPerPage + scrollOffsetBinding (for grids)
   * 2. ID-based: Use cardIdBinding (for popups/single cards)
   */
  export interface ReactiveCardRendererProps {
    // Source playerData binding
    playerDataBinding: any;

    // Slot-based selection (for grids)
    scrollOffsetBinding?: any; // Binding<number>
    slotIndex?: number;
    cardsPerPage?: number;

    // ID-based selection (for popups)
    cardIdBinding?: any; // Binding<string | null>

    onClick?: (cardId: string) => void;
    showDeckIndicator?: boolean;
  }

  /**
   * Create a reactive card UI component using bindings
   * Supports two modes:
   * - Slot-based (grids): Derives card from slotIndex + scrollOffset
   * - ID-based (popups): Derives card from cardIdBinding
   */
  export function createReactiveCardComponent(ui: UIMethodMappings, props: ReactiveCardRendererProps): UINodeType {
    const {
      playerDataBinding,
      scrollOffsetBinding,
      slotIndex,
      cardsPerPage,
      cardIdBinding,
      onClick,
      showDeckIndicator = true
    } = props;

    // Determine which mode we're in
    const isIdMode = cardIdBinding !== undefined;
    const isSlotMode = slotIndex !== undefined && cardsPerPage !== undefined && scrollOffsetBinding !== undefined;

    // Standard card dimensions
    const cardWidth = 210;
    const cardHeight = 280;
    const beastImageWidth = 185;
    const beastImageHeight = 185;

    // Standard card positions
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

    // Helper function to extract base ID
    const extractBaseId = (id: string | undefined, name: string): string => {
      if (!id) {
        return name.toLowerCase().replace(/\s+/g, '-');
      }
      return id.replace(/-\d+-\d+$/, '');
    };

    // Create dependencies array based on mode
    // Use playerDataBinding directly in dependencies to avoid nesting
    // ALWAYS include assetsLoadedBinding as first dependency to prevent premature asset lookups
    let dependencies: any[];
    if (isIdMode && cardIdBinding) {
      dependencies = [ui.assetsLoadedBinding, playerDataBinding, cardIdBinding];
    } else if (isSlotMode && scrollOffsetBinding) {
      dependencies = [ui.assetsLoadedBinding, playerDataBinding, scrollOffsetBinding];
    } else {
      dependencies = [ui.assetsLoadedBinding, playerDataBinding];
    }

    // Helper to get card based on mode
    // Now computes display data on-demand from CardInstance
    // args[0] = assetsLoadedBinding, args[1] = playerDataBinding, args[2] = cardIdBinding or scrollOffsetBinding
    const getCard = (args: any[]): CardDisplayData | null => {
      // Extract card instances from PlayerData (now at args[1])
      const cardInstances: CardInstance[] = args[1]?.cards?.collected || [];

      let instance: CardInstance | null = null;

      if (isIdMode && cardIdBinding) {
        // ID-based mode: find card by ID (now at args[2])
        const cardId: string | null = args[2];
        if (!cardId) return null;
        instance = cardInstances.find((c: CardInstance) => c.id === cardId) || null;
      } else if (isSlotMode && slotIndex !== undefined && cardsPerPage !== undefined && scrollOffsetBinding) {
        // Slot-based mode: find card by slot index (offset now at args[2])
        const offset: number = args[2];
        const pageStart = offset * cardsPerPage;
        const cardIndex = pageStart + slotIndex;
        instance = cardIndex < cardInstances.length ? cardInstances[cardIndex] : null;
      }

      // Compute display data from instance
      return instance ? computeCardDisplay(instance) : null;
    };

    // Helper to get current card ID from bindings (for onClick handler)
    const getCurrentCardId = (): string | null => {
      if (isIdMode && cardIdBinding) {
        // For ID mode, directly get the ID from the binding
        return cardIdBinding.get ? cardIdBinding.get() : null;
      } else if (isSlotMode && scrollOffsetBinding) {
        // For slot mode, calculate from current player data and scroll offset
        const playerData = playerDataBinding.get ? playerDataBinding.get() : null;
        const cardInstances: CardInstance[] = playerData?.cards?.collected || [];
        const offset = scrollOffsetBinding.get ? scrollOffsetBinding.get() : 0;
        const pageStart = offset * cardsPerPage!;
        const cardIndex = pageStart + slotIndex!;
        const instance = cardIndex < cardInstances.length ? cardInstances[cardIndex] : null;
        return instance?.id || null;
      }
      return null;
    };

    // Helper to check if card is in deck
    const isCardInDeck = (args: any[], cardId: string | undefined): boolean => {
      if (!showDeckIndicator || !cardId) return false;

      // PlayerData is now at args[1] (args[0] is assetsLoadedBinding)
      const deckCardIds: string[] = args[1]?.cards?.deck || [];
      return deckCardIds.includes(cardId);
    };

    // Create reactive text bindings directly from source bindings
    // This avoids nesting by deriving each property separately from the same sources
    const cardNameBinding = ui.Binding.derive(dependencies, (...args: any[]) => {
      const card = getCard(args);
      return card?.name || '';
    });

    const cardCostBinding = ui.Binding.derive(dependencies, (...args: any[]) => {
      const card = getCard(args);
      return card && card.cost !== undefined ? String(card.cost) : '';
    });

    const cardAttackBinding = ui.Binding.derive(dependencies, (...args: any[]) => {
      const card = getCard(args);
      if (!card || card.type !== 'Bloom') return '';
      const bloomCard = card as any;
      return String(bloomCard.currentAttack ?? bloomCard.baseAttack ?? 0);
    });

    const cardHealthBinding = ui.Binding.derive(dependencies, (...args: any[]) => {
      const card = getCard(args);
      if (!card || card.type !== 'Bloom') return '';
      const bloomCard = card as any;
      return String(bloomCard.currentHealth ?? bloomCard.baseHealth ?? 0);
    });

    const cardLevelBinding = ui.Binding.derive(dependencies, (...args: any[]) => {
      const card = getCard(args);
      return card && card.level !== undefined ? `Level ${card.level}` : '';
    });

    const abilityTextBinding = ui.Binding.derive(dependencies, (...args: any[]) => {
      const card = getCard(args);
      return card ? getCardDescription(card) : '';
    });

    // Create image source bindings
    const baseCardImageBinding = ui.Binding.derive(dependencies, (...args: any[]) => {
      const assetsLoaded = args[0]; // First dependency is always assetsLoadedBinding now
      if (!assetsLoaded) return null;
      const card = getCard(args);
      if (!card) return null;
      const baseId = extractBaseId(card.id, card.name);
      if (!baseId) return null; // Don't try to load empty asset IDs
      return ui.assetIdToImageSource?.(baseId) ?? null;
    });

    const templateImageBinding = ui.Binding.derive(dependencies, (...args: any[]) => {
      const assetsLoaded = args[0]; // First dependency is always assetsLoadedBinding now
      if (!assetsLoaded) return null;
      const card = getCard(args);
      if (!card) return null;

      let templateAssetId = '';
      if (card.type === 'Habitat' && card.affinity) {
        templateAssetId = `${card.affinity.toLowerCase()}-habitat`;
      } else if (card.type !== 'Bloom') {
        templateAssetId = `${card.type.toLowerCase()}-card`;
      }

      return templateAssetId ? (ui.assetIdToImageSource?.(templateAssetId) ?? null) : null;
    });

    const affinityIconBinding = ui.Binding.derive(dependencies, (...args: any[]) => {
      const assetsLoaded = args[0]; // First dependency is always assetsLoadedBinding
      if (!assetsLoaded) return null;
      const card = getCard(args);
      if (!card || card.type !== 'Bloom' || !card.affinity) return null;
      const affinityAssetId = `${card.affinity.toLowerCase()}-icon`;
      if (!affinityAssetId) return null; // Don't try to load empty asset IDs
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

      // Layer 2: Base card frame
      ui.Image({
        source: ui.Binding.derive(dependencies, (...args: any[]) => {
          const assetsLoaded = args[0]; // First dependency is always assetsLoadedBinding
          if (!assetsLoaded) return null;
          const card = getCard(args);
          return card ? ui.assetIdToImageSource?.('base-card') : null;
        }),
        style: {
          width: cardWidth,
          height: cardHeight,
          position: 'absolute',
          top: 0,
          left: 0,
        },
      }),

      // Layer 3: Template overlay
      ui.Image({
        source: templateImageBinding,
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

      // Layer 5: Experience bar
      ui.Image({
        source: ui.Binding.derive(dependencies, (...args: any[]) => {
          const assetsLoaded = args[0]; // First dependency is always assetsLoadedBinding
          if (!assetsLoaded) return null;
          const card = getCard(args);
          if (!card || card.type !== 'Bloom' || card.level === undefined) return null;
          return ui.assetIdToImageSource?.('experience-bar');
        }),
        style: {
          width: 120,
          height: 20,
          position: 'absolute',
          top: positions.experienceBar.y,
          left: positions.experienceBar.x,
        },
      }),

      // Layer 6: Text overlays
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
          fontSize: DIMENSIONS.fontSize.xs,
          color: COLORS.textPrimary,
          textAlign: 'left',
        },
      }),

      // Layer 7: Deck indicator border (only if showDeckIndicator is true)
      ...(showDeckIndicator ? [ui.View({
        style: ui.Binding.derive(dependencies, (...args: any[]) => {
          const card = getCard(args);
          const isInDeck = isCardInDeck(args, card?.id);

          return {
            position: 'absolute',
            top: 0,
            left: 0,
            width: cardWidth,
            height: cardHeight,
            borderWidth: isInDeck ? 4 : 0,
            borderColor: COLORS.success,
            borderRadius: 8,
          };
        }),
      })] : []),
    ];

    const filteredChildren = children.filter(child => child !== undefined && child !== null);

    // Wrap in Pressable if onClick is provided, otherwise use View
    if (onClick) {
      return ui.Pressable({
        onClick: () => {
          const cardId = getCurrentCardId();
          console.log('[CardRenderer] Pressable clicked, cardId:', cardId);
          if (cardId) {
            console.log('[CardRenderer] Calling onClick with cardId:', cardId);
            onClick(cardId);
          } else {
            console.log('[CardRenderer] cardId is null, not calling onClick');
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

  // ==================== bloombeasts\ui\screens\common\CardDetailPopup.ts ====================

  /**
   * Card Detail Popup Component
   * Shows card details in a popup overlay with action buttons
   */


  export interface CardDetailPopupProps {
    cardDetail: CardDetailDisplay;
    onButtonClick: (buttonId: string) => void;
  }

  export interface ReactiveCardDetailPopupProps {
    cardIdBinding: any; // Binding<string | null>
    playerDataBinding: any; // PlayerData binding
    onClose: () => void;
    sideContent?: (ui: UIMethodMappings, deps: {
      cardIdBinding: any;
      playerDataBinding: any;
    }) => UINodeType[];
  }

  /**
   * Create a reactive card detail popup overlay
   * Uses createReactiveCardComponent in ID mode to display the card
   */
  export function createReactiveCardDetailPopup(ui: UIMethodMappings, props: ReactiveCardDetailPopupProps): UINodeType {
    const { cardIdBinding, playerDataBinding, onClose, sideContent } = props;

    const cardWidth = 210;
    const cardHeight = 280;
    const screenWidth = 1280;
    const screenHeight = 720;
    const totalWidth = cardWidth + DIMENSIONS.spacing.xl + sideMenuButtonDimensions.width;
    const contentX = (screenWidth - totalWidth) / 2;
    const contentY = (screenHeight - cardHeight) / 2;

    return ui.View({
      style: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
      },
      children: [
        // Black backdrop
        ui.Pressable({
          onClick: () => onClose(),
          style: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
        }),

        // Content container
        ui.View({
          style: {
            position: 'absolute',
            left: contentX,
            top: contentY,
            flexDirection: 'row',
            alignItems: 'flex-start',
          },
          children: [
            // Card display using reactive card component in ID mode
            createReactiveCardComponent(ui, {
              playerDataBinding: playerDataBinding,
              cardIdBinding: cardIdBinding,
              onClick: undefined, // No click handler in popup
              showDeckIndicator: true, // Show deck indicator
            }),

            // Side content (buttons, etc.)
            ui.View({
              style: {
                marginLeft: DIMENSIONS.spacing.xl,
                flexDirection: 'column',
              },
              children: sideContent ? sideContent(ui, { cardIdBinding, playerDataBinding }) : [],
            }),
          ],
        }),
      ],
    });
  }

  /**
   * Create a card detail popup overlay
   */
  export function createCardDetailPopup(ui: UIMethodMappings, props: CardDetailPopupProps): UINodeType {
    const { cardDetail, onButtonClick } = props;

    const cardWidth = 210; // Standard card width
    const cardHeight = 280; // Standard card height
    const buttonWidth = sideMenuButtonDimensions.width;
    const buttonHeight = sideMenuButtonDimensions.height;
    const buttonSpacing = GAPS.buttons;

    // Calculate center position (screen is 1280x720)
    const screenWidth = 1280;
    const screenHeight = 720;
    const totalWidth = cardWidth + DIMENSIONS.spacing.xl + buttonWidth;
    const contentX = (screenWidth - totalWidth) / 2;
    const contentY = (screenHeight - cardHeight) / 2;

    return ui.View({
      style: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
      },
      children: [
        // Black backdrop - clicking closes the popup
        ui.Pressable({
          onClick: () => onButtonClick('btn-card-close'),
          style: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
        }),

        // Content container (centered)
        ui.View({
          style: {
            position: 'absolute',
            left: contentX,
            top: contentY,
            flexDirection: 'row',
            alignItems: 'flex-start',
          },
          children: [
            // Card display
            createCardComponent(ui, {
              card: cardDetail.card,
              isInDeck: cardDetail.isInDeck,
              showDeckIndicator: false, // Don't show deck indicator in detail view
            }),

            // Buttons to the right
            ui.View({
              style: {
                marginLeft: DIMENSIONS.spacing.xl,
                flexDirection: 'column',
              },
              children: (cardDetail.buttons || []).filter(b => b).map((buttonText, index) =>
                ui.Pressable({
                  onClick: () => {
                    // Prevent backdrop click
                    const buttonId = `btn-card-${buttonText.toLowerCase().replace(/ /g, '-')}`;
                    onButtonClick(buttonId);
                  },
                  style: {
                    width: buttonWidth,
                    height: buttonHeight,
                    position: 'relative',
                    marginBottom: index < cardDetail.buttons.length - 1 ? buttonSpacing : 0,
                  },
                  children: [
                    // Button background image
                    ui.Image({
                      source: ui.Binding.derive(
                        [ui.assetsLoadedBinding],
                        (assetsLoaded: boolean) => assetsLoaded ? ui.assetIdToImageSource?.(
                          buttonText === 'Add' ? 'green-button' :
                          buttonText === 'Remove' ? 'red-button' :
                          'standard-button'
                        ) : null
                      ),
                      style: {
                        position: 'absolute',
                        width: buttonWidth,
                        height: buttonHeight,
                        top: 0,
                        left: 0,
                      },
                    }),
                    // Button text
                    ui.View({
                      style: {
                        position: 'absolute',
                        width: buttonWidth,
                        height: buttonHeight,
                        justifyContent: 'center',
                        alignItems: 'center',
                      },
                      children: ui.Text({
                        text: new ui.Binding(buttonText),
                        style: {
                          fontSize: DIMENSIONS.fontSize.md,
                          color: COLORS.textPrimary,
                          fontWeight: 'bold',
                        },
                      }),
                    }),
                  ],
                })
              ),
            }),
          ],
        }),
      ],
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
    playerDataBinding: any; // PlayerData binding - screens derive what they need
    onCardSelect?: (cardId: string) => void;
    onNavigate?: (screen: string) => void;
    onRenderNeeded?: () => void;
  }

  /**
   * Unified Cards Screen
   */
  export class CardsScreen {
    // UI methods (injected)
    private ui: UIMethodMappings;

    private playerDataBinding: any;
    private scrollOffset: any;
    private selectedCardId: any; // Binding<string | null>

    // Track scroll offset for button handlers (can't use .get() in Horizon)
    private scrollOffsetValue: number = 0;

    private cardsPerRow = 4;
    private rowsPerPage = 2;
    private onCardSelect?: (cardId: string) => void;
    private onNavigate?: (screen: string) => void;
    private onRenderNeeded?: () => void;

    constructor(props: CardsScreenProps) {
      this.ui = props.ui;
      this.selectedCardId = new this.ui.Binding<string | null>(null);
      this.playerDataBinding = props.playerDataBinding;
      this.onCardSelect = props.onCardSelect;
      this.onNavigate = props.onNavigate;
      this.onRenderNeeded = props.onRenderNeeded;
      this.scrollOffset = new this.ui.Binding(0);
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
          playerDataBinding: this.playerDataBinding,
          scrollOffsetBinding: this.scrollOffset,
          slotIndex,
          cardsPerPage,
          onClick: (cardId: string) => this.handleCardClick(cardId),
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
            this.playerDataBinding.derive((pd: any) => {
              const cards = pd?.cards?.collected || [];
              console.log('[CardsScreen] Empty state check - cards.length:', cards.length);
              return cards.length === 0 ? true : false;
            }),
            this.ui.View({
              style: {
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              },
              children: this.ui.Text({
                text: new this.ui.Binding('No cards in your collection yet.'),
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
      // Note: Derive directly from playerDataBinding to avoid nesting (cards is already a derived binding)
      const scrollButtons = [
        {
          label: '↑',
          onClick: () => {
            // Reactive disabled state prevents invalid scrolling, so just decrement
            this.scrollOffsetValue--;
            this.scrollOffset.set(this.scrollOffsetValue);
          },
          disabled: this.ui.Binding.derive(
            [this.playerDataBinding, this.scrollOffset],
            (pd: any, offset: number) => offset <= 0 ? true : false
          ) as any,
          yOffset: 0,
        },
        {
          label: '↓',
          onClick: () => {
            // Reactive disabled state prevents invalid scrolling, so just increment
            this.scrollOffsetValue++;
            this.scrollOffset.set(this.scrollOffsetValue);
          },
          disabled: this.ui.Binding.derive(
            [this.playerDataBinding, this.scrollOffset],
            (pd: any, offset: number) => {
              const cards = pd?.cards?.collected || [];
              const cardsPerPage = this.cardsPerRow * this.rowsPerPage;
              const totalPages = Math.ceil(cards.length / cardsPerPage);
              return offset >= totalPages - 1 ? true : false;
            }
          ) as any,
          yOffset: sideMenuButtonDimensions.height + GAPS.buttons,
        },
      ];

      // Deck info text - derive directly from playerDataBinding to avoid nesting
      const deckInfoText = this.playerDataBinding.derive((pd: any) => `${deckEmoji} ${pd?.cards?.deck?.length || 0}/30`);

      return this.ui.View({
        style: {
          width: '100%',
          height: '100%',
          position: 'relative',
        },
        children: [
          // Background
          this.ui.Image({
            source: this.ui.Binding.derive(
              [this.ui.assetsLoadedBinding],
              (assetsLoaded: boolean) => assetsLoaded ? this.ui.assetIdToImageSource?.('background') : null
            ),
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
            source: this.ui.Binding.derive(
              [this.ui.assetsLoadedBinding],
              (assetsLoaded: boolean) => assetsLoaded ? this.ui.assetIdToImageSource?.('cards-container') : null
            ),
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
            playerDataBinding: this.playerDataBinding,
          }),

          // Card detail popup overlay container (conditionally rendered)
          // Uses UINode.if() for proper conditional rendering per Horizon docs
          ...(this.ui.UINode ? [this.ui.UINode.if(
            this.ui.Binding.derive(
              [this.selectedCardId],
              (cardId: string | null) => cardId !== null ? true : false
            ),
            this.ui.View({
              style: {
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
              },
              children: createReactiveCardDetailPopup(this.ui, {
                cardIdBinding: this.selectedCardId,
                playerDataBinding: this.playerDataBinding,
                onClose: () => this.closePopup(),
                sideContent: (ui, deps) => this.createPopupButtons(deps),
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
      console.log('[CardsScreen] handleCardClick called with cardId:', cardId);
      this.selectedCardId.set(cardId);
    }

    /**
     * Close the popup
     */
    private closePopup(): void {
      this.selectedCardId.set(null);
    }

    /**
     * Create reactive popup buttons
     * Returns Add/Remove and Close buttons with reactive state
     */
    private createPopupButtons(deps: {
      cardIdBinding: any;
      playerDataBinding: any;
    }): UINodeType[] {
      const { cardIdBinding, playerDataBinding } = deps;
      const buttonWidth = sideMenuButtonDimensions.width;
      const buttonHeight = sideMenuButtonDimensions.height;
      const buttonSpacing = GAPS.buttons;

      // Track cardId for onClick handler
      let currentCardId: string | null = null;
      const cardIdTracker = this.ui.Binding.derive(
        [cardIdBinding],
        (cardId: string | null) => {
          currentCardId = cardId;
          return cardId;
        }
      );

      // Hover state bindings for buttons
      const actionButtonHover = new this.ui.Binding(false);
      const closeButtonHover = new this.ui.Binding(false);

      return [
        // Add/Remove button
        this.ui.Pressable({
          onClick: () => {
            if (currentCardId && this.onCardSelect) {
              this.onCardSelect(currentCardId);
            }
          },
          onHoverIn: () => actionButtonHover.set(true),
          onHoverOut: () => actionButtonHover.set(false),
          style: {
            width: buttonWidth,
            height: buttonHeight,
            position: 'relative',
            marginBottom: buttonSpacing,
          },
          children: [
            // Button background
            this.ui.Image({
              source: this.ui.Binding.derive(
                [this.ui.assetsLoadedBinding, playerDataBinding, cardIdBinding],
                (...args: any[]) => {
                  const assetsLoaded: boolean = args[0];
                  const pd: any = args[1];
                  const cardId: string | null = args[2];
                  if (!assetsLoaded || !cardId) return null;
                  const deckCardIds: string[] = pd?.cards?.deck || [];
                  const isInDeck = deckCardIds.includes(cardId);
                  return this.ui.assetIdToImageSource?.(isInDeck ? 'red-button' : 'green-button');
                }
              ),
              style: {
                position: 'absolute',
                width: buttonWidth,
                height: buttonHeight,
                top: 0,
                left: 0,
                opacity: this.ui.Binding.derive([actionButtonHover], (hover) => hover ? 0.8 : 1.0),
              },
            }),
            // Button text
            this.ui.View({
              style: {
                position: 'absolute',
                width: buttonWidth,
                height: buttonHeight,
                justifyContent: 'center',
                alignItems: 'center',
              },
              children: this.ui.Text({
                text: this.ui.Binding.derive(
                  [playerDataBinding, cardIdBinding],
                  (...args: any[]) => {
                    const pd: any = args[0];
                    const cardId: string | null = args[1];
                    if (!cardId) return '';
                    const deckCardIds: string[] = pd?.cards?.deck || [];
                    const isInDeck = deckCardIds.includes(cardId);
                    return isInDeck ? 'Remove' : 'Add';
                  }
                ),
                style: {
                  fontSize: DIMENSIONS.fontSize.md,
                  color: COLORS.textPrimary,
                  fontWeight: 'bold',
                },
              }),
            }),
          ],
        }),

        // Close button
        this.ui.Pressable({
          onClick: () => this.closePopup(),
          onHoverIn: () => closeButtonHover.set(true),
          onHoverOut: () => closeButtonHover.set(false),
          style: {
            width: buttonWidth,
            height: buttonHeight,
            position: 'relative',
          },
          children: [
            // Button background
            this.ui.Image({
              source: this.ui.Binding.derive(
                [this.ui.assetsLoadedBinding],
                (assetsLoaded: boolean) => assetsLoaded ? this.ui.assetIdToImageSource?.('standard-button') : null
              ),
              style: {
                position: 'absolute',
                width: buttonWidth,
                height: buttonHeight,
                top: 0,
                left: 0,
                opacity: this.ui.Binding.derive([closeButtonHover], (hover) => hover ? 0.8 : 1.0),
              },
            }),
            // Button text
            this.ui.View({
              style: {
                position: 'absolute',
                width: buttonWidth,
                height: buttonHeight,
                justifyContent: 'center',
                alignItems: 'center',
              },
              children: this.ui.Text({
                text: new this.ui.Binding('Close'),
                style: {
                  fontSize: DIMENSIONS.fontSize.md,
                  color: COLORS.textPrimary,
                  fontWeight: 'bold',
                },
              }),
            }),
          ],
        }),
      ];
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
    // Source bindings (not derived)
    missionsBinding: any; // Binding<MissionDisplay[]>
    scrollOffsetBinding: any; // Binding<number>
    slotIndex: number;
    missionsPerPage: number;
    onClick?: (missionId: string) => void;
  }

  /**
   * Create a reactive mission component that updates based on bindings
   * Uses Horizon-compatible pattern without UINode.if() to avoid type checking errors
   */
  export function createReactiveMissionComponent(ui: UIMethodMappings, props: ReactiveMissionRendererProps): UINodeType {
    const {
      missionsBinding,
      scrollOffsetBinding,
      slotIndex,
      missionsPerPage,
      onClick,
    } = props;

    // Track mission data for click handler
    let trackedMission: MissionDisplay | null = null;

    // Create dependencies array
    // ALWAYS include assetsLoadedBinding as first dependency to prevent premature asset lookups
    const dependencies = [ui.assetsLoadedBinding, missionsBinding, scrollOffsetBinding];

    // Mission card positions
    const positions = {
      name: { x: 97, y: 10 },
      image: { x: 16, y: 16 },
      level: { x: 97, y: 43 },
      difficulty: { x: 97, y: 66 },
      description: { x: 13, y: 98 },
    };

    const cardWidth = MISSION_DIMENSIONS.width;
    const cardHeight = MISSION_DIMENSIONS.height;
    const beastSize = 70;

    // Helper to get difficulty color
    const getDifficultyColor = (difficulty: string): string => {
      switch (difficulty) {
        case 'tutorial': return '#90EE90';
        case 'easy': return '#87CEEB';
        case 'normal': return '#FFD700';
        case 'hard': return '#FF6347';
        case 'expert': return '#8B008B';
        case 'legendary': return '#FF1493';
        default: return COLORS.textSecondary;
      }
    };

    // Create reactive bindings for all mission properties
    // args[0] = assetsLoadedBinding, args[1] = missionsBinding, args[2] = scrollOffsetBinding
    const missionNameBinding = ui.Binding.derive(dependencies, (...args: any[]) => {
      const missions: MissionDisplay[] = args[1];
      const offset: number = args[2];
      const pageStart = offset * missionsPerPage;
      const missionIndex = pageStart + slotIndex;
      const mission = missionIndex < missions.length ? missions[missionIndex] : null;

      // Track the mission for click handler
      trackedMission = mission;

      return mission?.name || '';
    });

    const levelTextBinding = ui.Binding.derive(dependencies, (...args: any[]) => {
      const missions: MissionDisplay[] = args[1];
      const offset: number = args[2];
      const pageStart = offset * missionsPerPage;
      const missionIndex = pageStart + slotIndex;
      const mission = missionIndex < missions.length ? missions[missionIndex] : null;
      return mission ? `Level ${mission.level}` : '';
    });

    const difficultyTextBinding = ui.Binding.derive(dependencies, (...args: any[]) => {
      const missions: MissionDisplay[] = args[1];
      const offset: number = args[2];
      const pageStart = offset * missionsPerPage;
      const missionIndex = pageStart + slotIndex;
      const mission = missionIndex < missions.length ? missions[missionIndex] : null;
      if (!mission) return '';

      // Format difficulty nicely (capitalize first letter)
      const formattedDifficulty = mission.difficulty.charAt(0).toUpperCase() + mission.difficulty.slice(1);
      return formattedDifficulty;
    });

    const difficultyColorBinding = ui.Binding.derive(dependencies, (...args: any[]) => {
      const missions: MissionDisplay[] = args[1];
      const offset: number = args[2];
      const pageStart = offset * missionsPerPage;
      const missionIndex = pageStart + slotIndex;
      const mission = missionIndex < missions.length ? missions[missionIndex] : null;
      return mission ? getDifficultyColor(mission.difficulty) : COLORS.textSecondary;
    });

    const descriptionBinding = ui.Binding.derive(dependencies, (...args: any[]) => {
      const missions: MissionDisplay[] = args[1];
      const offset: number = args[2];
      const pageStart = offset * missionsPerPage;
      const missionIndex = pageStart + slotIndex;
      const mission = missionIndex < missions.length ? missions[missionIndex] : null;
      return mission?.description || '';
    });

    const missionImageBinding = ui.Binding.derive(dependencies, (...args: any[]) => {
      const assetsLoaded = args[0]; // First dependency is always assetsLoadedBinding
      if (!assetsLoaded) return null;
      const missions: MissionDisplay[] = args[1];
      const offset: number = args[2];
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

    const beastImageBinding = ui.Binding.derive(dependencies, (...args: any[]) => {
      const assetsLoaded = args[0]; // First dependency is always assetsLoadedBinding
      if (!assetsLoaded) return null;
      const missions: MissionDisplay[] = args[1];
      const offset: number = args[2];
      const pageStart = offset * missionsPerPage;
      const missionIndex = pageStart + slotIndex;
      const mission = missionIndex < missions.length ? missions[missionIndex] : null;

      if (!mission || !mission.beastId) return null;

      const beastAssetId = mission.beastId.toLowerCase().replace(/\s+/g, '-');
      if (!beastAssetId) return null; // Don't try to load empty asset IDs
      return ui.assetIdToImageSource?.(beastAssetId) ?? null;
    });

    const opacityBinding = ui.Binding.derive(dependencies, (...args: any[]) => {
      const missions: MissionDisplay[] = args[1];
      const offset: number = args[2];
      const pageStart = offset * missionsPerPage;
      const missionIndex = pageStart + slotIndex;
      const mission = missionIndex < missions.length ? missions[missionIndex] : null;
      return mission?.isAvailable ? 1 : 0.4;
    });

    const lockOverlayOpacityBinding = ui.Binding.derive(dependencies, (...args: any[]) => {
      const missions: MissionDisplay[] = args[1];
      const offset: number = args[2];
      const pageStart = offset * missionsPerPage;
      const missionIndex = pageStart + slotIndex;
      const mission = missionIndex < missions.length ? missions[missionIndex] : null;
      const lockOpacity = (mission && !mission.isAvailable) ? 1 : 0;

      // Debug log for first 3 slots
      if (slotIndex < 3 && mission) {
        console.log(`[MissionRenderer] Slot ${slotIndex} (${mission.id}): isAvailable=${mission.isAvailable}, lockOpacity=${lockOpacity}`);
      }

      return lockOpacity;
    });

    const checkmarkOpacityBinding = ui.Binding.derive(dependencies, (...args: any[]) => {
      const missions: MissionDisplay[] = args[1];
      const offset: number = args[2];
      const pageStart = offset * missionsPerPage;
      const missionIndex = pageStart + slotIndex;
      const mission = missionIndex < missions.length ? missions[missionIndex] : null;
      return (mission && mission.isCompleted) ? 1 : 0;
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

      // Mission name
      ui.Text({
        text: missionNameBinding,
        numberOfLines: 1,
        style: {
          position: 'absolute',
          left: positions.name.x,
          top: positions.name.y,
          fontSize: DIMENSIONS.fontSize.xl,
          color: COLORS.textPrimary,
          fontWeight: 'bold',
        },
      }),

      // Level
      ui.Text({
        text: levelTextBinding,
        style: {
          position: 'absolute',
          left: positions.level.x,
          top: positions.level.y,
          fontSize: DIMENSIONS.fontSize.xs,
          color: COLORS.textSecondary,
        },
      }),

      // Difficulty (below level, aligned left with name and level)
      ui.Text({
        text: difficultyTextBinding,
        style: {
            position: 'absolute',
            left: positions.difficulty.x,
            top: positions.difficulty.y,
            fontSize: DIMENSIONS.fontSize.xs,
            color: difficultyColorBinding,
            fontWeight: 'bold',
          },
      }),

      // Description
      ui.Text({
        text: descriptionBinding,
        numberOfLines: 3,
        style: {
          position: 'absolute',
          left: positions.description.x,
          top: positions.description.y,
          width: cardWidth - 26,
          fontSize: DIMENSIONS.fontSize.sm,
          color: COLORS.textPrimary,
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
          text: new ui.Binding('🔒'),
          style: {
            position: 'absolute',
            left: cardWidth / 2 - 15,
            top: cardHeight / 2 - 15,
            fontSize: 30,
            color: COLORS.textPrimary,
          },
        }),
      }),

      // Completed checkmark
      ui.Text({
        text: new ui.Binding('✅'),
        style: {
          position: 'absolute',
          right: 10,
          top: 10,
          fontSize: 20,
          opacity: checkmarkOpacityBinding,
        },
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
    missions: any; // Missions binding - still separate
    playerDataBinding: any; // PlayerData binding
    onMissionSelect?: (missionId: string) => void;
    onNavigate?: (screen: string) => void;
    onRenderNeeded?: () => void;
  }

  /**
   * Unified Mission Screen that works on both platforms
   */
  export class MissionScreen {
    // UI methods (injected)
    private ui: UIMethodMappings;

    // State bindings
    private missions: any;
    private playerDataBinding: any;
    private scrollOffset: any;

    // Track scroll offset value for button handlers (can't use .get() in Horizon)
    private scrollOffsetValue: number = 0;

    // Configuration
    private missionsPerRow: number = 3;
    private rowsPerPage: number = 3;

    // Callbacks
    private onMissionSelect?: (missionId: string) => void;
    private onNavigate?: (screen: string) => void;
    private onRenderNeeded?: () => void;

    constructor(props: MissionScreenProps) {
      this.ui = props.ui;
      this.scrollOffset = new this.ui.Binding(0);
      this.missions = props.missions;
      this.playerDataBinding = props.playerDataBinding;
      this.onMissionSelect = props.onMissionSelect;
      this.onNavigate = props.onNavigate;
      this.onRenderNeeded = props.onRenderNeeded;
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
        source: this.ui.Binding.derive(
          [this.ui.assetsLoadedBinding],
          (assetsLoaded: boolean) => assetsLoaded ? this.ui.assetIdToImageSource?.('background') : null
        ),
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
            source: this.ui.Binding.derive(
              [this.ui.assetsLoadedBinding],
              (assetsLoaded: boolean) => assetsLoaded ? this.ui.assetIdToImageSource?.('cards-container') : null
            ),
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
          missionsBinding: this.missions,
          scrollOffsetBinding: this.scrollOffset,
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
     * Create the mission grid with reactive components
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
            this.ui.Binding.derive([this.missions], (missions: MissionDisplay[]) => {
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
                text: new this.ui.Binding('No missions available yet.'),
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
      const completionText = this.ui.Binding.derive(
        [this.missions],
        (missions: MissionDisplay[]) => {
          const completedCount = missions.filter((m: MissionDisplay) => m.isCompleted).length;
          return `${missionEmoji} ${completedCount}/${missions.length}`;
        }
      );

      return createSideMenu(this.ui, {
        title: 'Missions',
        customTextContent: [
          createTextRow(this.ui, completionText as any, 0),
        ],
        buttons: [
          {
            label: 'Up',
            onClick: () => {
              // Reactive disabled state prevents invalid scrolling, so just decrement
              this.scrollOffsetValue--;
              this.scrollOffset.set(this.scrollOffsetValue);
            },
            disabled: this.ui.Binding.derive(
              [this.missions, this.scrollOffset],
              (missions, offset) => offset <= 0 ? true : false
            ) as any,
            yOffset: 0,
          },
          {
            label: 'Down',
            onClick: () => {
              // Reactive disabled state prevents invalid scrolling, so just increment
              this.scrollOffsetValue++;
              this.scrollOffset.set(this.scrollOffsetValue);
            },
            disabled: this.ui.Binding.derive(
              [this.missions, this.scrollOffset],
              (missions: MissionDisplay[], offset: number) => {
                const missionsPerPage = this.missionsPerRow * this.rowsPerPage;
                const totalPages = Math.ceil(missions.length / missionsPerPage);
                return offset >= totalPages - 1 ? true : false;
              }
            ) as any,
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
        playerDataBinding: this.playerDataBinding,
      });
    }

    /**
     * Cleanup
     */
    dispose(): void {
      // Nothing to clean up
    }
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

    // Check freeze status
    const frozen = beast.counters.find(c => c.type === 'Freeze');
    if (frozen && frozen.amount > 0) {
      return false;
    }

    // Check entangle status
    const entangled = beast.counters.find(c => c.type === 'Entangle');
    if (entangled && entangled.amount > 0) {
      return false;
    }

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
      nectar: { x: 930, y: 10 },
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
      nectar: { x: 930, y: 680 },
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
    battleDisplay: any; // BattleDisplay binding
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
    showHand: any; // Binding for show/hide state
    handScrollOffset: any; // Binding for scroll offset
    showHandValue: boolean; // Current show/hide value
    handScrollOffsetValue: number; // Current scroll value
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
    endTurnButtonText: any; // Binding for button text
    getIsPlayerTurn: () => boolean; // Function to get current turn state
    getHasAttackableBeasts: () => boolean; // Function to check if player has beasts that can attack
    onAction?: (action: string) => void;
    onStopTurnTimer?: () => void;
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
     * Create full-screen background
     */
    createBackground(): UINodeType {
      return this.ui.Image({
        source: this.ui.Binding.derive(
          [this.ui.assetsLoadedBinding],
          (assetsLoaded: boolean) => assetsLoaded ? this.ui.assetIdToImageSource?.('background') : null
        ),
        style: {
          position: 'absolute',
          width: gameDimensions.panelWidth,
          height: gameDimensions.panelHeight,
          top: 0,
          left: 0,
        },
      });
    }

    /**
     * Create playboard overlay image
     */
    createPlayboard(): UINodeType {
      return this.ui.Image({
        source: this.ui.Binding.derive(
          [this.ui.assetsLoadedBinding],
          (assetsLoaded: boolean) => assetsLoaded ? this.ui.assetIdToImageSource?.('playboard') : null
        ),
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
    private battleDisplay: BattleComponentWithCallbacks['battleDisplay'];
    private onAction?: (action: string) => void;
    private showPlayedCard?: (card: any, callback?: () => void) => void;

    constructor(props: BattleComponentWithCallbacks) {
      this.ui = props.ui;
      this.battleDisplay = props.battleDisplay;
      this.onAction = props.onAction;
      this.showPlayedCard = props.showPlayedCard;
    }

    /**
     * Create static beast card structure with reactive properties
     * All images, text, etc. use bindings instead of being dynamically created
     */
    private createBeastCardStructure(player: 'player' | 'opponent', slotIndex: number): UINodeType[] {
      const cardWidth = standardCardDimensions.width;
      const cardHeight = standardCardDimensions.height;
      const beastImageWidth = 185;
      const beastImageHeight = 185;

      const positions = {
        beastImage: { x: 12, y: 13 },
        cost: { x: 20, y: 10 },
        affinity: { x: 175, y: 7 },
        name: { x: 105, y: 13 },
        attack: { x: 20, y: 176 },
        health: { x: 188, y: 176 },
      };

      return [
        // Layer 1: Beast artwork image - reactive source
        this.ui.Image({
          source: this.ui.Binding.derive(
            [this.battleDisplay],
            (state: BattleDisplay | null) => {
              if (!state) return null;
              const field = player === 'player' ? state.playerField : state.opponentField;
              const beast = field?.[slotIndex];
              if (!beast) return null;
              const baseId = beast.id?.replace(/-\d+-\d+$/, '') || beast.name.toLowerCase().replace(/\s+/g, '-');
              return this.ui.assetIdToImageSource?.(baseId) || null;
            }
          ),
          style: {
            width: beastImageWidth,
            height: beastImageHeight,
            position: 'absolute',
            top: positions.beastImage.y,
            left: positions.beastImage.x,
          },
        }),

        // Layer 2: Base card frame
        this.ui.Image({
          source: this.ui.assetIdToImageSource?.('base-card') || null,
          style: {
            width: cardWidth,
            height: cardHeight,
            position: 'absolute',
            top: 0,
            left: 0,
          },
        }),

        // Layer 3: Affinity icon - reactive source
        this.ui.Image({
          source: this.ui.Binding.derive(
            [this.battleDisplay],
            (state: BattleDisplay | null) => {
              if (!state) return null;
              const field = player === 'player' ? state.playerField : state.opponentField;
              const beast = field?.[slotIndex];
              if (!beast || !beast.affinity) return null;
              return this.ui.assetIdToImageSource?.(`${beast.affinity.toLowerCase()}-icon`) || null;
            }
          ),
          style: {
            width: 30,
            height: 30,
            position: 'absolute',
            top: positions.affinity.y,
            left: positions.affinity.x,
          },
        }),

        // Layer 4: Card name - reactive text
        this.ui.Text({
          text: this.ui.Binding.derive(
            [this.battleDisplay],
            (state: BattleDisplay | null) => {
              if (!state) return '';
              const field = player === 'player' ? state.playerField : state.opponentField;
              const beast = field?.[slotIndex];
              return beast?.name || '';
            }
          ),
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

        // Layer 5: Cost - reactive text
        this.ui.Text({
          text: this.ui.Binding.derive(
            [this.battleDisplay],
            (state: BattleDisplay | null) => {
              if (!state) return '';
              const field = player === 'player' ? state.playerField : state.opponentField;
              const beast = field?.[slotIndex];
              return beast && beast.cost !== undefined ? String(beast.cost) : '';
            }
          ),
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

        // Layer 6: Attack - reactive text
        this.ui.Text({
          text: this.ui.Binding.derive(
            [this.battleDisplay],
            (state: BattleDisplay | null) => {
              if (!state) return '';
              const field = player === 'player' ? state.playerField : state.opponentField;
              const beast = field?.[slotIndex];
              return beast ? String(beast.currentAttack ?? beast.baseAttack ?? 0) : '';
            }
          ),
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

        // Layer 7: Health - reactive text
        this.ui.Text({
          text: this.ui.Binding.derive(
            [this.battleDisplay],
            (state: BattleDisplay | null) => {
              if (!state) return '';
              const field = player === 'player' ? state.playerField : state.opponentField;
              const beast = field?.[slotIndex];
              return beast ? String(beast.currentHealth ?? beast.baseHealth ?? 0) : '';
            }
          ),
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
      ];
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
            display: this.ui.Binding.derive(
              [this.battleDisplay],
              (state: BattleDisplay | null) => {
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
                backgroundColor: this.ui.Binding.derive(
                  [this.battleDisplay],
                  (state: BattleDisplay | null) => {
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
                display: this.ui.Binding.derive(
                  [this.battleDisplay],
                  (state: BattleDisplay | null) => {
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
                display: this.ui.Binding.derive(
                  [this.battleDisplay],
                  (state: BattleDisplay | null) => {
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
    private battleDisplay: BattleComponentWithCallbacks['battleDisplay'];
    private onCardDetailSelected?: (card: any) => void;

    constructor(props: BattleComponentWithCallbacks) {
      this.ui = props.ui;
      this.battleDisplay = props.battleDisplay;
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
            // Hide slot if no trap - derive directly from battleDisplay
            display: this.ui.Binding.derive(
              [this.battleDisplay],
              (state: BattleDisplay | null) => {
                if (!state) return 'none';
                const trapZone = player === 'player' ? state.playerTrapZone : state.opponentTrapZone;
                const trap = trapZone?.[index];
                return trap ? 'flex' : 'none';
              }
            ),
          },
          children: [
            // Clickable wrapper for trap card
            this.ui.Pressable({
              onClick: () => {
                // Only allow player to view their own trap cards
                if (player === 'player') {
                  console.log('[TrapZone] Player trap clicked, showing detail');
                  // Get current trap at click time
                  const state = this.battleDisplay;
                  if (state && typeof state === 'object' && 'playerTrapZone' in state) {
                    const trapZone = (state as any).playerTrapZone;
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
    private battleDisplay: BattleComponentWithCallbacks['battleDisplay'];
    private onCardDetailSelected?: (card: any) => void;

    constructor(props: BattleComponentWithCallbacks) {
      this.ui = props.ui;
      this.battleDisplay = props.battleDisplay;
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
            // Hide slot if no buff - derive directly from battleDisplay
            display: this.ui.Binding.derive(
              [this.battleDisplay],
              (state: BattleDisplay | null) => {
                if (!state) return 'none';
                const buffZone = player === 'player' ? state.playerBuffZone : state.opponentBuffZone;
                const buff = buffZone?.[index];
                return buff ? 'flex' : 'none';
              }
            ),
          },
          children: [
            // Clickable wrapper for buff card
            this.ui.Pressable({
              onClick: () => {
                console.log(`[BuffZone] Buff card clicked: ${player}-${index}, showing detail`);
                // Get current buff at click time
                const state = this.battleDisplay;
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
                    source: this.ui.Binding.derive(
                      [this.battleDisplay],
                      (state: BattleDisplay | null) => {
                        if (!state) return null;
                        const buffZone = player === 'player' ? state.playerBuffZone : state.opponentBuffZone;
                        const buff = buffZone?.[index];
                        if (!buff) return null;
                        return this.ui.assetIdToImageSource?.(buff.id?.replace(/-\d+-\d+$/, '') || buff.name.toLowerCase().replace(/\s+/g, '-'));
                      }
                    ),
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
    private battleDisplay: BattleComponentWithCallbacks['battleDisplay'];
    private onCardDetailSelected?: (card: any) => void;

    constructor(props: BattleComponentWithCallbacks) {
      this.ui = props.ui;
      this.battleDisplay = props.battleDisplay;
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
          display: this.ui.Binding.derive(
            [this.battleDisplay],
            (state: BattleDisplay | null) => state?.habitatZone ? 'flex' : 'none'
          ),
        },
        children: [
          // Clickable wrapper for entire habitat card
          this.ui.Pressable({
            onClick: () => {
              console.log('[HabitatZone] Habitat card clicked, showing detail');
              // Get current habitat at click time
              const state = this.battleDisplay;
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
                  source: this.ui.Binding.derive(
                    [this.battleDisplay],
                    (state: BattleDisplay | null) => {
                      if (!state?.habitatZone) return null;
                      const habitat = state.habitatZone;
                      return this.ui.assetIdToImageSource?.(habitat.id?.replace(/-\d+-\d+$/, '') || habitat.name.toLowerCase().replace(/\s+/g, '-'));
                    }
                  ),
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

              // TODO: Counter badges - need to implement without Binding.derive in children
              // For now, counter badges are disabled until we implement proper reactive rendering
            ],
          }),
        ],
      });
    }

    /**
     * Create counter badges for habitat
     */
    private createCounterBadges(counters: any[], basePos: { x: number; y: number }): UINodeType {
      const counterMap = new Map<string, number>();
      counters.forEach((counter: any) => {
        const current = counterMap.get(counter.type) || 0;
        counterMap.set(counter.type, current + counter.amount);
      });

      const counterConfigs: Record<string, { emoji: string; color: string }> = {
        'Spore': { emoji: '🍄', color: '#51cf66' },
      };

      const badges = Array.from(counterMap.entries()).map(([type, amount], index) => {
        if (amount <= 0) return null;

        const config = counterConfigs[type] || { emoji: '●', color: '#868e96' };
        const badgeSize = 28;
        const badgeSpacing = 32;

        return this.ui.View({
          style: {
            position: 'absolute',
            right: 10 + (index * badgeSpacing),
            top: 5,
            width: badgeSize,
            height: badgeSize,
            backgroundColor: config.color,
            borderRadius: badgeSize / 2,
            borderWidth: 2,
            borderColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center',
          },
          children: this.ui.Text({
            text: `${config.emoji} ${amount}`,
            style: {
              fontSize: 16,
              fontWeight: 'bold',
              color: '#fff',
              textAlign: 'center',
            },
          }),
        });
      }).filter(Boolean);

      return this.ui.View({
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
        children: badges,
      });
    }
  }

  // ==================== bloombeasts\ui\screens\battle\PlayerHand.ts ====================

  /**
   * Player hand overlay - 5 card slots with scroll and toggle
   */


  export class PlayerHand {
    private ui: PlayerHandProps['ui'];
    private battleDisplay: PlayerHandProps['battleDisplay'];
    private getBattleDisplayValue: () => any | null;
    private showHand: PlayerHandProps['showHand'];
    private handScrollOffset: PlayerHandProps['handScrollOffset'];
    private showHandValue: boolean;
    private handScrollOffsetValue: number;
    private onAction?: (action: string) => void;
    private onShowHandChange?: (newValue: boolean) => void;
    private onScrollOffsetChange?: (newValue: number) => void;
    private onRenderNeeded?: () => void;
    private showPlayedCard?: (card: any, callback?: () => void) => void;

    constructor(props: PlayerHandProps) {
      this.ui = props.ui;
      this.battleDisplay = props.battleDisplay;
      this.getBattleDisplayValue = props.getBattleDisplayValue;
      this.showHand = props.showHand;
      this.handScrollOffset = props.handScrollOffset;
      this.showHandValue = props.showHandValue;
      this.handScrollOffsetValue = props.handScrollOffsetValue;
      this.onAction = props.onAction;
      this.onShowHandChange = props.onShowHandChange;
      this.onScrollOffsetChange = props.onScrollOffsetChange;
      this.onRenderNeeded = props.onRenderNeeded;
      this.showPlayedCard = props.showPlayedCard;

      console.log('[PlayerHand] Constructor - onAction:', this.onAction ? 'DEFINED' : 'UNDEFINED');
    }

    /**
     * Create static card structure with reactive properties for hand slot
     * Handles all card types: Bloom, Magic, Trap, Buff, Habitat
     */
    private createHandCardStructure(slotIndex: number, cardsPerPage: number): UINodeType[] {
      const cardWidth = standardCardDimensions.width;
      const cardHeight = standardCardDimensions.height;
      const beastImageWidth = 185;
      const beastImageHeight = 185;

      const positions = {
        beastImage: { x: 12, y: 13 },
        cost: { x: 20, y: 10 },
        affinity: { x: 175, y: 7 },
        name: { x: 105, y: 13 },
        ability: { x: 21, y: 212 },
        attack: { x: 20, y: 176 },
        health: { x: 188, y: 176 },
      };

      return [
        // Layer 1: Card/Beast artwork image - reactive source
        this.ui.Image({
          source: this.ui.Binding.derive(
            [this.battleDisplay, this.handScrollOffset],
            (display: BattleDisplay | null, scrollOffset: number) => {
              if (!display || !display.playerHand) return null;
              const actualIndex = scrollOffset * cardsPerPage + slotIndex;
              const card = display.playerHand[actualIndex];
              if (!card) return null;
              const baseId = card.id?.replace(/-\d+-\d+$/, '') || card.name.toLowerCase().replace(/\s+/g, '-');
              return this.ui.assetIdToImageSource?.(baseId) || null;
            }
          ),
          style: {
            width: beastImageWidth,
            height: beastImageHeight,
            position: 'absolute',
            top: positions.beastImage.y,
            left: positions.beastImage.x,
          },
        }),

        // Layer 2: Base card frame
        this.ui.Image({
          source: this.ui.assetIdToImageSource?.('base-card') || null,
          style: {
            width: cardWidth,
            height: cardHeight,
            position: 'absolute',
            top: 0,
            left: 0,
          },
        }),

        // Layer 3: Type-specific template overlay - reactive source
        this.ui.Image({
          source: this.ui.Binding.derive(
            [this.battleDisplay, this.handScrollOffset],
            (display: BattleDisplay | null, scrollOffset: number) => {
              if (!display || !display.playerHand) return null;
              const actualIndex = scrollOffset * cardsPerPage + slotIndex;
              const card = display.playerHand[actualIndex];
              if (!card || card.type === 'Bloom') return null;

              let templateKey = '';
              if (card.type === 'Habitat' && card.affinity) {
                templateKey = `${card.affinity.toLowerCase()}-habitat`;
              } else {
                templateKey = `${card.type.toLowerCase()}-card`;
              }
              return this.ui.assetIdToImageSource?.(templateKey) || null;
            }
          ),
          style: {
            width: cardWidth,
            height: cardHeight,
            position: 'absolute',
            top: 0,
            left: 0,
          },
        }),

        // Layer 4: Affinity icon (for Bloom cards) - reactive source
        this.ui.Image({
          source: this.ui.Binding.derive(
            [this.battleDisplay, this.handScrollOffset],
            (display: BattleDisplay | null, scrollOffset: number) => {
              if (!display || !display.playerHand) return null;
              const actualIndex = scrollOffset * cardsPerPage + slotIndex;
              const card = display.playerHand[actualIndex];
              if (!card || card.type !== 'Bloom' || !card.affinity) return null;
              return this.ui.assetIdToImageSource?.(`${card.affinity.toLowerCase()}-icon`) || null;
            }
          ),
          style: {
            width: 30,
            height: 30,
            position: 'absolute',
            top: positions.affinity.y,
            left: positions.affinity.x,
          },
        }),

        // Layer 5: Card name - reactive text
        this.ui.Text({
          text: this.ui.Binding.derive(
            [this.battleDisplay, this.handScrollOffset],
            (display: BattleDisplay | null, scrollOffset: number) => {
              if (!display || !display.playerHand) return '';
              const actualIndex = scrollOffset * cardsPerPage + slotIndex;
              const card = display.playerHand[actualIndex];
              return card?.name || '';
            }
          ),
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

        // Layer 6: Cost - reactive text
        this.ui.Text({
          text: this.ui.Binding.derive(
            [this.battleDisplay, this.handScrollOffset],
            (display: BattleDisplay | null, scrollOffset: number) => {
              if (!display || !display.playerHand) return '';
              const actualIndex = scrollOffset * cardsPerPage + slotIndex;
              const card = display.playerHand[actualIndex];
              return card && card.cost !== undefined ? String(card.cost) : '';
            }
          ),
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

        // Layer 7: Attack (for Bloom cards) - reactive text
        this.ui.Text({
          text: this.ui.Binding.derive(
            [this.battleDisplay, this.handScrollOffset],
            (display: BattleDisplay | null, scrollOffset: number) => {
              if (!display || !display.playerHand) return '';
              const actualIndex = scrollOffset * cardsPerPage + slotIndex;
              const card = display.playerHand[actualIndex];
              if (!card || card.type !== 'Bloom') return '';
              return String((card as any).currentAttack ?? (card as any).baseAttack ?? 0);
            }
          ),
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

        // Layer 8: Health (for Bloom cards) - reactive text
        this.ui.Text({
          text: this.ui.Binding.derive(
            [this.battleDisplay, this.handScrollOffset],
            (display: BattleDisplay | null, scrollOffset: number) => {
              if (!display || !display.playerHand) return '';
              const actualIndex = scrollOffset * cardsPerPage + slotIndex;
              const card = display.playerHand[actualIndex];
              if (!card || card.type !== 'Bloom') return '';
              return String((card as any).currentHealth ?? (card as any).baseHealth ?? 0);
            }
          ),
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

        // Layer 9: Ability text (for non-Bloom cards) - reactive text
        this.ui.Text({
          text: this.ui.Binding.derive(
            [this.battleDisplay, this.handScrollOffset],
            (display: BattleDisplay | null, scrollOffset: number) => {
              if (!display || !display.playerHand) return '';
              const actualIndex = scrollOffset * cardsPerPage + slotIndex;
              const card = display.playerHand[actualIndex];
              if (!card || card.type === 'Bloom') return '';
              // For now, show basic ability text - could enhance with description generator
              return card.abilities?.[0]?.description || '';
            }
          ),
          numberOfLines: 3,
          style: {
            position: 'absolute',
            top: positions.ability.y,
            left: positions.ability.x,
            width: 168,
            fontSize: 10,
            color: '#fff',
            textAlign: 'left',
          },
        }),
      ];
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
            display: this.ui.Binding.derive(
              [this.battleDisplay, this.handScrollOffset],
              (display: BattleDisplay | null, scrollOffset: number) => {
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
                  console.log('[PlayerHand] onClick fired! slotIndex:', slotIndex);
                  const actualIndex = this.handScrollOffsetValue * cardsPerPage + slotIndex;
                  // Get current card state from cached value
                  const display = this.getBattleDisplayValue();
                  console.log('[PlayerHand] display:', display ? 'EXISTS' : 'NULL', 'actualIndex:', actualIndex);
                  if (display && display.playerHand) {
                    console.log('[PlayerHand] playerHand length:', display.playerHand.length);
                    const card = display.playerHand[actualIndex];
                    console.log('[PlayerHand] card at', actualIndex, ':', card);
                    if (card) {
                      console.log(`[PlayerHand] Card clicked: ${actualIndex}, card: ${card.name}, onAction:`, this.onAction ? 'DEFINED' : 'UNDEFINED');

                      // Show card popup for magic/buff cards, then play
                      if (card.type === 'Magic' || card.type === 'Buff') {
                        console.log('[PlayerHand] Showing card popup for', card.type);
                        this.showPlayedCard?.(card, () => {
                          console.log('[PlayerHand] Popup closed, calling onAction');
                          this.onAction?.(`play-card-${actualIndex}`);
                        });
                      } else {
                        console.log('[PlayerHand] Calling onAction directly');
                        this.onAction?.(`play-card-${actualIndex}`);
                      }
                    } else {
                      console.log('[PlayerHand] No card at index', actualIndex);
                    }
                  } else {
                    console.log('[PlayerHand] No display or playerHand');
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
                backgroundColor: this.ui.Binding.derive(
                  [this.battleDisplay, this.handScrollOffset],
                  (display: BattleDisplay | null, scrollOffset: number) => {
                    if (!display || !display.playerHand) return 'transparent';
                    const actualIndex = scrollOffset * cardsPerPage + slotIndex;
                    const card = display.playerHand[actualIndex];
                    if (!card) return 'transparent';
                    const canAfford = card.cost <= display.playerNectar;
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
          left: 40,
          top: this.ui.Binding.derive(
            [this.showHand],
            (showFull: boolean) => showFull ? (gameDimensions.panelHeight - 300) : 640
          ),
          width: overlayWidth,
          height: this.ui.Binding.derive(
            [this.showHand],
            (showFull: boolean) => showFull ? 300 : 80
          ),
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          borderWidth: 3,
          borderColor: '#4a8ec2',
        },
        children: [
          // Render all card slots (they show/hide based on bindings)
          ...cardSlots,

          // Toggle button
          this.ui.Pressable({
            onClick: () => {
              console.log('[PlayerHand] Toggle button clicked, current showHandValue:', this.showHandValue);
              const newShowHand = !this.showHandValue;
              console.log('[PlayerHand] Setting showHandValue to:', newShowHand);
              this.showHandValue = newShowHand;
              this.onShowHandChange?.(newShowHand);
              this.onAction?.('toggle-hand');
            },
            style: {
              position: 'absolute',
              left: overlayWidth - 50,
              top: 10,
              width: 60,
              height: 50,
              backgroundColor: '#4a8ec2',
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
            },
            children: this.ui.Text({
              text: this.ui.Binding.derive(
                [this.showHand],
                (showFull: boolean) => showFull ? 'X' : '↑'
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
              const newOffset = Math.max(0, this.handScrollOffsetValue - 1);
              this.onScrollOffsetChange?.(newOffset);
            },
            disabled: this.ui.Binding.derive(
              [this.handScrollOffset],
              (offset: number) => offset <= 0
            ),
            style: {
              position: 'absolute',
              left: overlayWidth - 50,
              top: 10 + 50 + 10, // Below toggle button
              width: 60,
              height: 50,
              backgroundColor: this.ui.Binding.derive(
                [this.handScrollOffset],
                (offset: number) => offset > 0 ? '#4a8ec2' : '#666'
              ),
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: this.ui.Binding.derive(
                [this.handScrollOffset],
                (offset: number) => offset > 0 ? 1 : 0.5
              ),
              display: this.ui.Binding.derive(
                [this.showHand],
                (showFull: boolean) => showFull ? 'flex' : 'none'
              ),
            },
            children: this.ui.Text({
              text: new this.ui.Binding('⬆'),
              style: {
                fontSize: 24,
                fontWeight: 'bold',
                color: '#fff',
              },
            }),
          }),

          // Down button (positioned below up button)
          this.ui.Pressable({
            onClick: () => {
              this.onScrollOffsetChange?.(this.handScrollOffsetValue + 1);
            },
            disabled: this.ui.Binding.derive(
              [this.handScrollOffset, this.battleDisplay],
              (offset: number, state: BattleDisplay | null) => {
                if (!state || !state.playerHand) return true;
                const totalPages = Math.ceil(state.playerHand.length / cardsPerPage);
                return offset >= totalPages - 1 || state.playerHand.length <= cardsPerPage;
              }
            ),
            style: {
              position: 'absolute',
              left: overlayWidth - 50,
              top: 10 + 50 + 10 + 50 + 10, // Below up button
              width: 60,
              height: 50,
              backgroundColor: this.ui.Binding.derive(
                [this.handScrollOffset, this.battleDisplay],
                (offset: number, state: BattleDisplay | null) => {
                  if (!state || !state.playerHand) return '#666';
                  const totalPages = Math.ceil(state.playerHand.length / cardsPerPage);
                  return (offset < totalPages - 1 && state.playerHand.length > cardsPerPage) ? '#4a8ec2' : '#666';
                }
              ),
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
              opacity: this.ui.Binding.derive(
                [this.handScrollOffset, this.battleDisplay],
                (offset: number, state: BattleDisplay | null) => {
                  if (!state || !state.playerHand) return 0.5;
                  const totalPages = Math.ceil(state.playerHand.length / cardsPerPage);
                  return (offset < totalPages - 1 && state.playerHand.length > cardsPerPage) ? 1 : 0.5;
                }
              ),
              display: this.ui.Binding.derive(
                [this.showHand],
                (showFull: boolean) => showFull ? 'flex' : 'none'
              ),
            },
            children: this.ui.Text({
              text: new this.ui.Binding('↓'),
              style: {
                fontSize: 24,
                fontWeight: 'bold',
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
   * Player and opponent info displays (health, nectar, deck count)
   */


  export class InfoDisplays {
    private ui: BattleComponentProps['ui'];
    private battleDisplay: BattleComponentProps['battleDisplay'];

    constructor(props: BattleComponentProps) {
      this.ui = props.ui;
      this.battleDisplay = props.battleDisplay;
    }

    /**
     * Create player and opponent info displays - Centered at top with two columns
     */
    createInfoDisplays(): UINodeType {
      const boxWidth = 400;
      const boxHeight = 100;
      const centerX = 640; // Center of 1280px wide screen
      const topY = 10;

      return this.ui.View({
        style: {
          position: 'absolute',
          left: centerX - boxWidth / 2,
          top: topY,
          width: boxWidth,
          height: boxHeight,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          borderRadius: 10,
          borderWidth: 2,
          borderColor: 'rgba(74, 142, 194, 0.8)',
          flexDirection: 'row',
          padding: 10,
        },
        children: [
          // Opponent column (left)
          this.ui.View({
            style: {
              flex: 1,
              paddingRight: 5,
              borderRightWidth: 1,
              borderRightColor: 'rgba(255, 255, 255, 0.3)',
            },
            children: [
              this.ui.Text({
                text: new this.ui.Binding('Opponent'),
                style: {
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#ff6b6b',
                  marginBottom: 5,
                  textAlign: 'center',
                },
              }),
              this.ui.Text({
                text: this.ui.Binding.derive(
                  [this.battleDisplay],
                  (state: BattleDisplay) => state ? `❤️ ${state.opponentHealth}/${state.opponentMaxHealth}` : '❤️ 20/20'
                ),
                style: {
                  fontSize: 16,
                  color: '#fff',
                  marginBottom: 3,
                },
              }),
              this.ui.Text({
                text: this.ui.Binding.derive(
                  [this.battleDisplay],
                  (state: BattleDisplay) => state ? `${nectarEmoji} ${state.opponentNectar}/10` : `${nectarEmoji} 0/10`
                ),
                style: {
                  fontSize: 16,
                  color: '#fff',
                  marginBottom: 3,
                },
              }),
              this.ui.Text({
                text: this.ui.Binding.derive(
                  [this.battleDisplay],
                  (state: BattleDisplay) => state ? `${deckEmoji} ${state.opponentDeckCount}/30` : `${deckEmoji} 30/30`
                ),
                style: {
                  fontSize: 16,
                  color: '#fff',
                },
              }),
            ],
          }),

          // Player column (right)
          this.ui.View({
            style: {
              flex: 1,
              paddingLeft: 5,
            },
            children: [
              this.ui.Text({
                text: new this.ui.Binding('Player'),
                style: {
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#4a8ec2',
                  marginBottom: 5,
                  textAlign: 'center',
                },
              }),
              this.ui.Text({
                text: this.ui.Binding.derive(
                  [this.battleDisplay],
                  (state: BattleDisplay) => state ? `❤️ ${state.playerHealth}/${state.playerMaxHealth}` : '❤️ 20/20'
                ),
                style: {
                  fontSize: 16,
                  color: '#fff',
                  marginBottom: 3,
                },
              }),
              this.ui.Text({
                text: this.ui.Binding.derive(
                  [this.battleDisplay],
                  (state: BattleDisplay) => state ? `${nectarEmoji} ${state.playerNectar}/10` : `${nectarEmoji} 0/10`
                ),
                style: {
                  fontSize: 16,
                  color: '#fff',
                  marginBottom: 3,
                },
              }),
              this.ui.Text({
                text: this.ui.Binding.derive(
                  [this.battleDisplay],
                  (state: BattleDisplay) => state ? `${deckEmoji} ${state.playerDeckCount}/30` : `${deckEmoji} 30/30`
                ),
                style: {
                  fontSize: 16,
                  color: '#fff',
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
    private battleDisplay: BattleSideMenuProps['battleDisplay'];
    private endTurnButtonText: BattleSideMenuProps['endTurnButtonText'];
    private getIsPlayerTurn: () => boolean;
    private getHasAttackableBeasts: () => boolean;
    private onAction?: (action: string) => void;
    private onStopTurnTimer?: () => void;

    constructor(props: BattleSideMenuProps) {
      this.ui = props.ui;
      this.battleDisplay = props.battleDisplay;
      this.endTurnButtonText = props.endTurnButtonText;
      this.getIsPlayerTurn = props.getIsPlayerTurn;
      this.getHasAttackableBeasts = props.getHasAttackableBeasts;
      this.onAction = props.onAction;
      this.onStopTurnTimer = props.onStopTurnTimer;

      console.log('[BattleSideMenu] Constructor - onAction:', this.onAction ? 'DEFINED' : 'UNDEFINED');
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
          width: 127,
          height: 465,
        },
        children: [
          // Side menu background
          this.ui.Image({
            source: this.ui.Binding.derive(
              [this.ui.assetsLoadedBinding],
              (assetsLoaded: boolean) => assetsLoaded ? this.ui.assetIdToImageSource?.('side-menu') : null
            ),
            style: {
              position: 'absolute',
              width: 127,
              height: 465,
            },
          }),

          // Forfeit button (at header position)
          this.ui.Pressable({
            onClick: () => {
              console.log('[BattleSideMenu] Forfeit button clicked');
              this.onAction?.('btn-forfeit');
            },
            style: {
              position: 'absolute',
              left: sideMenuPositions.headerStartPosition.x - sideMenuPositions.x,
              top: sideMenuPositions.headerStartPosition.y - sideMenuPositions.y,
              width: sideMenuButtonDimensions.width,
              height: sideMenuButtonDimensions.height,
            },
            children: [
              // Button background image
              this.ui.Image({
                source: this.ui.Binding.derive(
                  [this.ui.assetsLoadedBinding],
                  (assetsLoaded: boolean) => assetsLoaded ? this.ui.assetIdToImageSource?.('standard-button') : null
                ),
                style: {
                  position: 'absolute',
                  width: sideMenuButtonDimensions.width,
                  height: sideMenuButtonDimensions.height,
                },
              }),
              // Button text centered over image
              this.ui.View({
                style: {
                  position: 'absolute',
                  width: sideMenuButtonDimensions.width,
                  height: sideMenuButtonDimensions.height,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                children: this.ui.Text({
                  text: 'Forfeit',
                  style: {
                    fontSize: DIMENSIONS.fontSize.md,
                    fontWeight: 'bold',
                    color: '#fff',
                    textAlign: 'center',
                  },
                }),
              }),
            ],
          }),

          // Battle info text
          this.ui.View({
            style: {
              position: 'absolute',
              left: sideMenuPositions.textStartPosition.x - sideMenuPositions.x,
              top: sideMenuPositions.textStartPosition.y - sideMenuPositions.y,
            },
            children: [
              this.ui.Text({
                text: new this.ui.Binding('Battle'),
                style: {
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#fff',
                  marginBottom: 5,
                },
              }),
              this.ui.Text({
                text: this.ui.Binding.derive(
                  [this.battleDisplay],
                  (state: BattleDisplay) => state ? `Turn ${state.currentTurn}` : 'Turn 1'
                ),
                style: {
                  fontSize: 18,
                  color: '#fff',
                  marginBottom: 5,
                },
              }),
              // Deathmatch warning (reactive) - always rendered, conditionally visible
              this.ui.Text({
                text: this.ui.Binding.derive(
                  [this.battleDisplay],
                  (state: BattleDisplay | null) => {
                    if (!state || state.currentTurn < 30) return '';
                    const deathmatchDamage = Math.floor((state.currentTurn - 30) / 5) + 1;
                    return `Deathmatch! -${deathmatchDamage} HP`;
                  }
                ),
                style: {
                  fontSize: 16,
                  color: '#ff6b6b',
                  fontWeight: 'bold',
                  display: this.ui.Binding.derive(
                    [this.battleDisplay],
                    (state: BattleDisplay | null) => {
                      return (state && state.currentTurn >= 30) ? 'flex' : 'none';
                    }
                  ),
                },
              }),
            ],
          }),

          // Attack button (red) - positioned above End Turn button
          this.ui.Pressable({
            onClick: () => {
              console.log('[BattleSideMenu] Attack button onClick fired!');
              const currentIsPlayerTurn = this.getIsPlayerTurn();
              const hasAttackable = this.getHasAttackableBeasts();
              console.log('[BattleSideMenu] Attack button clicked, isPlayerTurn:', currentIsPlayerTurn, 'hasAttackable:', hasAttackable);

              if (currentIsPlayerTurn && hasAttackable) {
                console.log('[BattleSideMenu] Calling onAction with auto-attack-all');
                this.onAction?.('auto-attack-all');
                // Auto end turn after attacking
                console.log('[BattleSideMenu] Auto ending turn after attack');
                this.onStopTurnTimer?.();
                this.onAction?.('end-turn');
              } else {
                console.log('[BattleSideMenu] Attack button cannot be used - turn:', currentIsPlayerTurn, 'attackable:', hasAttackable);
              }
            },
            disabled: this.ui.Binding.derive([this.battleDisplay], (state: BattleDisplay) => {
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
            style: {
              position: 'absolute',
              left: sideMenuPositions.buttonStartPosition.x - sideMenuPositions.x,
              top: sideMenuPositions.buttonStartPosition.y - sideMenuPositions.y - sideMenuButtonDimensions.height - 10,
              width: sideMenuButtonDimensions.width,
              height: sideMenuButtonDimensions.height,
              opacity: this.ui.Binding.derive([this.battleDisplay], (state: BattleDisplay) => {
                if (!state || state.turnPlayer !== 'player') return 0.3;

                // Check if has attackable beasts
                let hasAttackable = false;
                if (state.playerField && Array.isArray(state.playerField)) {
                  for (const beast of state.playerField) {
                    if (beast && canAttack(beast)) {
                      hasAttackable = true;
                      break;
                    }
                  }
                }

                return hasAttackable ? 1 : 0.3;
              }),
            },
            children: [
              // Red button background
              this.ui.Image({
                source: this.ui.Binding.derive(
                  [this.ui.assetsLoadedBinding],
                  (assetsLoaded: boolean) => assetsLoaded ? this.ui.assetIdToImageSource?.('red-button') : null
                ),
                style: {
                  position: 'absolute',
                  width: sideMenuButtonDimensions.width,
                  height: sideMenuButtonDimensions.height,
                },
              }),
              // Button text centered over image
              this.ui.View({
                style: {
                  position: 'absolute',
                  width: sideMenuButtonDimensions.width,
                  height: sideMenuButtonDimensions.height,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                children: this.ui.Text({
                  text: 'Attack',
                  style: {
                    fontSize: DIMENSIONS.fontSize.md,
                    fontWeight: 'bold',
                    color: '#fff',
                    textAlign: 'center',
                  },
                }),
              }),
            ],
          }),

          // End Turn button with timer - uses derived bindings for reactive updates
          this.ui.Pressable({
            onClick: () => {
              console.log('[BattleSideMenu] End Turn button onClick fired!');
              const currentIsPlayerTurn = this.getIsPlayerTurn();
              console.log('[BattleSideMenu] End Turn button clicked, isPlayerTurn:', currentIsPlayerTurn);
              console.log('[BattleSideMenu] onAction defined?', this.onAction ? 'YES' : 'NO');
              if (currentIsPlayerTurn) {
                this.onStopTurnTimer?.();
                console.log('[BattleSideMenu] Calling onAction with end-turn');
                this.onAction?.('end-turn');
              } else {
                console.log('[BattleSideMenu] End Turn clicked but not player turn');
              }
            },
            disabled: this.ui.Binding.derive([this.battleDisplay], (state: BattleDisplay) => {
              return state?.turnPlayer !== 'player';
            }),
            style: {
              position: 'absolute',
              left: sideMenuPositions.buttonStartPosition.x - sideMenuPositions.x,
              top: sideMenuPositions.buttonStartPosition.y - sideMenuPositions.y,
              width: sideMenuButtonDimensions.width,
              height: sideMenuButtonDimensions.height,
              opacity: this.ui.Binding.derive([this.battleDisplay], (state: BattleDisplay) => state?.turnPlayer === 'player' ? 1 : 0.5),
            },
            children: [
              // Button background image - green when player turn, standard when opponent turn
              this.ui.Image({
                source: this.ui.Binding.derive(
                  [this.ui.assetsLoadedBinding, this.battleDisplay],
                  (assetsLoaded: boolean, state: BattleDisplay) => {
                    if (!assetsLoaded) return null;
                    return this.ui.assetIdToImageSource?.(state?.turnPlayer === 'player' ? 'green-button' : 'standard-button') ?? null;
                  }
                ),
                style: {
                  position: 'absolute',
                  width: sideMenuButtonDimensions.width,
                  height: sideMenuButtonDimensions.height,
                },
              }),
              // Button text centered over image
              this.ui.View({
                style: {
                  position: 'absolute',
                  width: sideMenuButtonDimensions.width,
                  height: sideMenuButtonDimensions.height,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                children: this.ui.Text({
                  text: this.endTurnButtonText,
                  style: {
                    fontSize: DIMENSIONS.fontSize.md,
                    fontWeight: 'bold',
                    color: '#fff',
                    textAlign: 'center',
                  },
                }),
              }),
            ],
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
    battleDisplay: any; // BattleDisplay binding - REQUIRED
    onAction?: (action: string) => void;
    onNavigate?: (screen: string) => void;
    onRenderNeeded?: () => void;
    onShowCardDetail?: (card: any, durationMs: number, callback?: () => void) => void;
  }

  /**
   * Unified Battle Screen that exactly replicates web deployment's battle UI
   */
  export class BattleScreen {
    // UI methods (injected)
    private ui: UIMethodMappings;
    private async: AsyncMethods;

    // State bindings
    private battleDisplay: any; // BattleDisplay binding - REQUIRED
    private showHand: any;
    private handScrollOffset: any;
    private turnTimer: any;
    private selectedCardDetail: any;
    private isPlayerTurn: any;
    private endTurnButtonText: any; // Binding for button text that updates reactively

    // Temporary card display (for showing played cards)
    private playedCardDisplay: any | null = null;
    private playedCardTimeout: number | null = null;

    // Timer management
    private timerInterval: number | null = null;

    // Track binding values separately (as per Horizon docs - no .get() method)
    private timerValue = 60;
    private isPlayerTurnValue = false;
    private battleDisplayValue: any | null = null;
    private hasAttackableBeasts = false;
    private showHandValue = true;
    private handScrollOffsetValue = 0;
    private selectedCardDetailValue: any = null;

    // Configuration
    private cardsPerRow = 5;
    private rowsPerPage = 1;

    // Render guard to prevent infinite loops
    private isRendering = false;
    private needsRerender = false;

    // Callbacks
    private onAction?: (action: string) => void;
    private onNavigate?: (screen: string) => void;
    private onRenderNeeded?: () => void;
    private onShowCardDetail?: (card: any, durationMs: number, callback?: () => void) => void;

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

      console.log('[BattleScreen] Constructor called, onAction:', props.onAction ? 'DEFINED' : 'UNDEFINED');

      // Initialize bindings after ui is set
      this.showHandValue = true;
      this.showHand = new this.ui.Binding(this.showHandValue);

      this.handScrollOffsetValue = 0;
      this.handScrollOffset = new this.ui.Binding(this.handScrollOffsetValue);

      this.timerValue = 60;
      this.turnTimer = new this.ui.Binding(this.timerValue);

      this.selectedCardDetailValue = null;
      this.selectedCardDetail = new this.ui.Binding<any | null>(this.selectedCardDetailValue);

      // Store required battleDisplay binding
      this.battleDisplay = props.battleDisplay;

      // Wrap onAction to add logging
      this.onAction = props.onAction ? (action: string) => {
        console.log('[BattleScreen] onAction called with:', action);
        props.onAction!(action);
      } : undefined;

      this.onNavigate = props.onNavigate;
      this.onRenderNeeded = props.onRenderNeeded;
      this.onShowCardDetail = props.onShowCardDetail;

      // Initialize player turn tracking with derived bindings
      // Create derived binding for isPlayerTurn
      this.isPlayerTurn = this.ui.Binding.derive(
        [this.battleDisplay],
        (state: BattleDisplay | null) => {
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

          // Start/stop timer based on turn changes
          if (this.isPlayerTurnValue !== newIsPlayerTurn) {
            this.isPlayerTurnValue = newIsPlayerTurn;
            if (newIsPlayerTurn) {
              this.startTurnTimer();
            } else {
              this.stopTurnTimer();
            }
          }

          return newIsPlayerTurn;
        }
      );

      // Create derived binding for endTurnButtonText
      this.endTurnButtonText = this.ui.Binding.derive(
        [this.battleDisplay, this.turnTimer],
        (state: BattleDisplay | null, timer: number) => state?.turnPlayer === 'player' ? `(${timer})` : 'Enemy Turn'
      );

      // Initialize battle components
      this.backgroundComponent = new BattleBackground({
        ui: this.ui,
        battleDisplay: this.battleDisplay,
      });

      this.beastFieldComponent = new BeastField({
        ui: this.ui,
        battleDisplay: this.battleDisplay,
        onAction: this.onAction,
        showPlayedCard: this.showPlayedCard.bind(this),
      });

      this.trapZoneComponent = new TrapZone({
        ui: this.ui,
        battleDisplay: this.battleDisplay,
        onCardDetailSelected: (card) => {
          this.selectedCardDetailValue = card;
          this.selectedCardDetail.set(card);
        },
      });

      this.buffZoneComponent = new BuffZone({
        ui: this.ui,
        battleDisplay: this.battleDisplay,
        onCardDetailSelected: (card) => {
          this.selectedCardDetailValue = card;
          this.selectedCardDetail.set(card);
        },
      });

      this.habitatZoneComponent = new HabitatZone({
        ui: this.ui,
        battleDisplay: this.battleDisplay,
        onCardDetailSelected: (card) => {
          const habitatWithType = { ...card, type: 'Habitat' };
          this.selectedCardDetailValue = habitatWithType;
          this.selectedCardDetail.set(habitatWithType);
        },
      });

      this.playerHandComponent = new PlayerHand({
        ui: this.ui,
        battleDisplay: this.battleDisplay,
        showHand: this.showHand,
        handScrollOffset: this.handScrollOffset,
        showHandValue: this.showHandValue,
        handScrollOffsetValue: this.handScrollOffsetValue,
        getBattleDisplayValue: () => this.battleDisplayValue,
        onAction: this.onAction,
        onShowHandChange: (newValue) => {
          this.showHandValue = newValue;
          this.showHand.set(newValue);
        },
        onScrollOffsetChange: (newValue) => {
          this.handScrollOffsetValue = newValue;
          this.handScrollOffset.set(newValue);
        },
        onRenderNeeded: this.onRenderNeeded,
        showPlayedCard: this.showPlayedCard.bind(this),
      });

      this.infoDisplaysComponent = new InfoDisplays({
        ui: this.ui,
        battleDisplay: this.battleDisplay,
      });

      this.sideMenuComponent = new BattleSideMenu({
        ui: this.ui,
        battleDisplay: this.battleDisplay,
        endTurnButtonText: this.endTurnButtonText,
        getIsPlayerTurn: () => this.isPlayerTurnValue,
        getHasAttackableBeasts: () => this.hasAttackableBeasts,
        onAction: this.onAction,
        onStopTurnTimer: () => this.stopTurnTimer(),
      });
    }

    /**
     * Safe render wrapper to prevent infinite loops
     */
    private safeRender(): void {
      if (this.isRendering) {
        // Already rendering, schedule for after current render completes
        this.needsRerender = true;
        return;
      }
      this.onRenderNeeded?.();
    }

    /**
     * Create the complete battle UI
     */
    createUI(): UINodeType {
      // console.log('[BattleScreen] createUI called');
      this.isRendering = true;
      this.needsRerender = false;

      // Mark rendering as complete
      this.finishRender();

      // Full battle UI - all structure created once, bindings handle updates
      return this.ui.View({
        style: {
          width: gameDimensions.panelWidth,
          height: gameDimensions.panelHeight,
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // Layer 1: Background image (full screen)
          this.backgroundComponent.createBackground(),

          // Layer 2: Playboard overlay
          this.backgroundComponent.createPlayboard(),

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
      });
    }


    /**
     * Create card popup layer with conditional visibility
     */
    private createCardPopupLayer(): UINodeType {
      // Use UINode.if for conditional rendering if available
      if (this.ui.UINode?.if) {
        return this.ui.UINode.if(
          this.battleDisplay.derive((state: BattleDisplay | null) => !!state?.cardPopup),
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
          this.selectedCardDetail.derive((card: any) => !!card),
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
                  this.selectedCardDetailValue = null;
                  this.selectedCardDetail.set(null);
                },
                style: {
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
              }),
              // Card display
              this.ui.Text({
                text: 'Selected Card Detail - TODO: Implement with reactive card rendering',
                style: {
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  color: '#fff',
                  fontSize: 20,
                }
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
     * Start the turn timer
     */
    private startTurnTimer(): void {
      // Don't start if already running
      if (this.timerInterval !== null) {
        return;
      }

      this.timerValue = 60;
      this.turnTimer.set(60);
      this.updateEndTurnButtonText(); // Initialize button text
      this.onRenderNeeded?.(); // Trigger re-render

      this.timerInterval = this.async.setInterval(() => {
        const current = this.timerValue;

        if (current <= 0) {
          console.log('[BattleScreen] Timer reached 0, auto-ending turn');
          this.stopTurnTimer();
          this.onAction?.('end-turn');
        } else {
          this.timerValue = current - 1;
          this.turnTimer.set(this.timerValue);
          // Update button text and trigger re-render
          this.updateEndTurnButtonText();
          this.onRenderNeeded?.();
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
      console.log('[BattleScreen] updateEndTurnButtonText called (no-op, using derived binding)');
    }

    /**
     * Finish render and trigger re-render if needed
     */
    private finishRender(): void {
      this.isRendering = false;
      if (this.needsRerender) {
        console.log('[BattleScreen] Re-render needed after current render');
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
      console.log('[BattleScreen] Showing played card popup:', card.name);

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
      this.showHandValue = true;
      this.showHand.set(true);
      this.handScrollOffsetValue = 0;
      this.handScrollOffset.set(0);
      this.selectedCardDetailValue = null;
      this.selectedCardDetail.set(null);
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
    playerDataBinding: any; // PlayerData binding - screen derives settings
    onSettingChange?: (settingId: string, value: any) => void;
    onNavigate?: (screen: string) => void;
    onRenderNeeded?: () => void;
  }

  /**
   * Unified Settings Screen
   */
  export class SettingsScreen {
    // UI methods (injected)
    private ui: UIMethodMappings;

    private playerDataBinding: any;

    // Track binding values separately (as per Horizon docs - no .get() method)
    private settingsValue: any = {};

    private onSettingChange?: (settingId: string, value: any) => void;
    private onNavigate?: (screen: string) => void;
    private onRenderNeeded?: () => void;

    constructor(props: SettingsScreenProps) {
      this.ui = props.ui;
      this.playerDataBinding = props.playerDataBinding;
      this.onSettingChange = props.onSettingChange;
      this.onNavigate = props.onNavigate;
      this.onRenderNeeded = props.onRenderNeeded;
      console.log('[SettingsScreen] constructor, onRenderNeeded:', this.onRenderNeeded ? 'defined' : 'undefined');
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
            source: this.ui.Binding.derive(
              [this.ui.assetsLoadedBinding],
              (assetsLoaded: boolean) => assetsLoaded ? this.ui.assetIdToImageSource?.('background') : null
            ),
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
            source: this.ui.Binding.derive(
              [this.ui.assetsLoadedBinding],
              (assetsLoaded: boolean) => assetsLoaded ? this.ui.assetIdToImageSource?.('cards-container') : null
            ),
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
            playerDataBinding: this.playerDataBinding,
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
                text: new this.ui.Binding(label),
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
                      text: new this.ui.Binding('-'),
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
                    text: this.ui.Binding.derive(
                      [this.playerDataBinding],
                      (pd: any) => {
                        const settings = pd?.settings;
                        this.settingsValue = settings;
                        const volume = settings?.[settingKey];
                        return `${volume !== undefined && volume !== null && typeof volume === 'number' ? Math.round(volume) : 0}%`;
                      }
                    ),
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
                      text: new this.ui.Binding('+'),
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
            text: new this.ui.Binding(label),
            style: {
              fontSize: DIMENSIONS.fontSize.xl,
              color: COLORS.textPrimary,
            },
          }),

          // Toggle button
          this.ui.Pressable({
            onClick: () => {
              console.log(`[SettingsScreen] Toggle clicked - settingKey: ${settingKey}, settingId: ${settingId}`);
              if (this.onSettingChange) {
                const currentSettings = this.settingsValue;
                console.log(`[SettingsScreen] Current settings:`, currentSettings);
                const currentValue = currentSettings[settingKey];
                const newValue = !currentValue;
                console.log(`[SettingsScreen] Toggle value: ${currentValue} -> ${newValue}`);

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
                source: this.ui.Binding.derive(
                  [this.ui.assetsLoadedBinding, this.playerDataBinding],
                  (assetsLoaded: boolean, pd: any) => {
                    if (!assetsLoaded) return null;
                    const settings = pd?.settings;
                    return this.ui.assetIdToImageSource?.(settings?.[settingKey] ? 'green-button' : 'standard-button') ?? null;
                  }
                ),
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
                  text: this.ui.Binding.derive(
                    [this.playerDataBinding],
                    (pd: any) => {
                      const settings = pd?.settings;
                      return settings?.[settingKey] ? 'ON' : 'OFF';
                    }
                  ),
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
      affinity?: 'Forest' | 'Water' | 'Fire' | 'Sky';
    };
    rewards: {
      xpGained: number;
      beastXP: number;
      completionTimeSeconds: number;
      cardsReceived: any[];
      itemsReceived: Array<{
        itemId: string;
        quantity: number;
        emoji?: string;
        name?: string;
      }>;
    } | null; // null for mission failed
    chestOpened: boolean;
    onClaimRewards?: () => void;
    onContinue?: () => void;
  }

  /**
   * Unified Mission Complete Popup that exactly replicates canvas version
   */
  export function createMissionCompletePopup(ui: UIMethodMappings, props: MissionCompletePopupProps): UINodeType {
    const { mission, rewards, chestOpened, onClaimRewards, onContinue } = props;
    const isFailed = !rewards;

    const containerWidth = missionCompleteCardDimensions.width;
    const containerHeight = missionCompleteCardDimensions.height;
    const centerX = (1280 - containerWidth) / 2;
    const centerY = (720 - containerHeight) / 2;

    return ui.View({
      style: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        zIndex: 2000, // Ensure popup is on top of everything
      },
      children: [
        // Semi-transparent backdrop
        ui.View({
          style: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
        }),

        // Content container (centered)
        ui.View({
          style: {
            position: 'absolute',
            left: centerX,
            top: centerY,
            width: containerWidth,
            height: containerHeight,
          },
          children: [
            // Container background image
            ui.Image({
              source: ui.Binding.derive(
                [ui.assetsLoadedBinding],
                (assetsLoaded: boolean) => assetsLoaded ? ui.assetIdToImageSource?.('mission-container') : null
              ),
              style: {
                position: 'absolute',
                width: containerWidth,
                height: containerHeight,
              },
            }),

            // Content overlay
            ui.View({
              style: {
                position: 'absolute',
                width: containerWidth,
                height: containerHeight,
              },
              children: [
            // Title
            ui.View({
              style: {
                position: 'absolute',
                left: missionCompleteCardPositions.title.x,
                top: missionCompleteCardPositions.title.y,
                width: containerWidth - missionCompleteCardPositions.title.x * 2,
              },
              children: ui.Text({
                text: isFailed ? 'MISSION FAILED' : 'MISSION COMPLETE!',
                style: {
                  fontSize: missionCompleteCardPositions.title.size,
                  fontWeight: 'bold',
                  color: isFailed ? '#FF4444' : '#FFD700',
                  textAlign: missionCompleteCardPositions.title.textAlign as any,
                },
              }),
            }),

            // Chest or lose image
            isFailed
              ? ui.Image({
                  source: ui.Binding.derive(
                    [ui.assetsLoadedBinding],
                    (assetsLoaded: boolean) => assetsLoaded ? ui.assetIdToImageSource?.('lose-image') : null
                  ),
                  style: {
                    position: 'absolute',
                    left: missionCompleteCardPositions.chestImage.x,
                    top: missionCompleteCardPositions.chestImage.y,
                    width: chestImageMissionCompleteDimensions.width,
                    height: chestImageMissionCompleteDimensions.height,
                  },
                })
              : ui.Image({
                  source: ui.Binding.derive(
                    [ui.assetsLoadedBinding],
                    (assetsLoaded: boolean) => assetsLoaded ? ui.assetIdToImageSource?.(
                      chestOpened
                        ? `${mission.affinity || 'Forest'}-chest-opened`.toLowerCase()
                        : `${mission.affinity || 'Forest'}-chest-closed`.toLowerCase()
                    ) : null
                  ),
                  style: {
                    position: 'absolute',
                    left: missionCompleteCardPositions.chestImage.x,
                    top: missionCompleteCardPositions.chestImage.y,
                    width: chestImageMissionCompleteDimensions.width,
                    height: chestImageMissionCompleteDimensions.height,
                  },
                }),

            // Info text
            ui.View({
              style: {
                position: 'absolute',
                left: missionCompleteCardPositions.infoText.x,
                top: missionCompleteCardPositions.infoText.y,
                width: containerWidth - missionCompleteCardPositions.infoText.x - 30, // 30px right margin
              },
              children: isFailed
                ? createFailedInfo(ui)
                : chestOpened
                ? createDetailedRewards(ui, rewards)
                : createBasicInfo(ui, rewards),
            }),

            // Claim/Continue button
            ui.Pressable({
              onClick: () => {
                console.log('[MissionCompletePopup] Button clicked, isFailed:', isFailed, 'chestOpened:', chestOpened);
                if (isFailed || chestOpened) {
                  console.log('[MissionCompletePopup] Calling onContinue');
                  onContinue?.();
                } else {
                  console.log('[MissionCompletePopup] Calling onClaimRewards');
                  onClaimRewards?.();
                }
              },
              style: {
                position: 'absolute',
                left: missionCompleteCardPositions.claimRewardButton.x,
                top: missionCompleteCardPositions.claimRewardButton.y,
                width: longButtonDimensions.width,
                height: longButtonDimensions.height,
                zIndex: 10, // Ensure button is on top
              },
              children: [
                // Button background image
                ui.Image({
                  source: ui.Binding.derive(
                    [ui.assetsLoadedBinding],
                    (assetsLoaded: boolean) => assetsLoaded ? ui.assetIdToImageSource?.('long-green-button') : null
                  ),
                  style: {
                    position: 'absolute',
                    width: longButtonDimensions.width,
                    height: longButtonDimensions.height,
                  },
                }),
                // Button text
                ui.View({
                  style: {
                    position: 'absolute',
                    width: longButtonDimensions.width,
                    height: longButtonDimensions.height,
                    justifyContent: 'center',
                    alignItems: 'center',
                  },
                  children: ui.Text({
                    text: isFailed ? 'CONTINUE' : chestOpened ? 'CONTINUE' : 'CLAIM REWARDS',
                    style: {
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: '#FFFFFF',
                      textAlign: 'center',
                    },
                  }),
                }),
              ],
            }),
            ],
          }),
        ],
      }),
      ],
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
            fontSize: 14,
            lineHeight: 18,
            color: '#FFFFFF',
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

    return ui.View({
      style: {
        flexDirection: 'column',
      },
      children: lines.map((line, index) =>
        ui.Text({
          text: line,
          style: {
            fontSize: missionCompleteCardPositions.infoText.size,
            color: '#FFFFFF',
            textAlign: missionCompleteCardPositions.infoText.textAlign as any,
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

    // Cards received
    if (rewards.cardsReceived && rewards.cardsReceived.length > 0) {
      elements.push(
        ui.Text({
          text: 'Cards Received:',
          style: {
            fontSize: missionCompleteCardPositions.infoText.size,
            color: '#FFD700',
            textAlign: missionCompleteCardPositions.infoText.textAlign as any,
            marginBottom: 5,
          },
        })
      );

      rewards.cardsReceived.forEach((card: any, index: number) => {
        elements.push(
          ui.Text({
            text: `  • ${card.name}`,
            style: {
              fontSize: missionCompleteCardPositions.infoText.size,
              color: '#FFFFFF',
              textAlign: missionCompleteCardPositions.infoText.textAlign as any,
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
            fontSize: missionCompleteCardPositions.infoText.size,
            color: '#FFD700',
            textAlign: missionCompleteCardPositions.infoText.textAlign as any,
            marginBottom: 5,
          },
        })
      );

      rewards.itemsReceived.forEach((itemReward: any, index: number) => {
        const emoji = itemReward.emoji || '';
        const itemName = itemReward.name || itemReward.itemId;
        elements.push(
          ui.Text({
            text: `  ${emoji} ${itemName} x${itemReward.quantity}`,
            style: {
              fontSize: missionCompleteCardPositions.infoText.size,
              color: '#FFFFFF',
              textAlign: missionCompleteCardPositions.infoText.textAlign as any,
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
      color?: string;
    }[];
  }

  /**
   * Create a button popup
   */
  export function createButtonPopup(ui: UIMethodMappings, props: ButtonPopupProps): any {
    const { View: V, Text: T, Pressable: P } = ui;

    return V({
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      },
      children: [
        // Popup container
        V({
          style: {
            width: 400,
            backgroundColor: COLORS.surface,
            borderRadius: 12,
            padding: 24,
            borderWidth: 2,
            borderColor: COLORS.primary,
          },
          children: [
            // Title
            T({
              text: props.title,
              style: {
                fontSize: 24,
                fontWeight: 'bold',
                color: COLORS.textPrimary,
                textAlign: 'center',
                marginBottom: props.message ? 12 : 24,
              },
            }),

            // Message (optional)
            props.message ? T({
              text: props.message,
              style: {
                fontSize: 16,
                color: COLORS.textSecondary,
                textAlign: 'center',
                marginBottom: 24,
              },
            }) : null,

            // Buttons
            V({
              style: {
                flexDirection: 'row',
                justifyContent: 'center',
              },
              children: props.buttons.map((button, index) =>
                P({
                  onClick: button.onClick,
                  style: {
                    backgroundColor: button.color || COLORS.primary,
                    padding: 12,
                    paddingLeft: 24,
                    paddingRight: 24,
                    borderRadius: 8,
                    minWidth: 100,
                    marginRight: index < props.buttons.length - 1 ? 12 : 0,
                  },
                  children: T({
                    text: button.text,
                    style: {
                      color: '#FFFFFF',
                      fontSize: 16,
                      fontWeight: 'bold',
                      textAlign: 'center',
                    },
                  }),
                })
              ),
            }),
          ].filter(Boolean),
        }),
      ],
    });
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

    // Data binding
    Binding: BindingConstructor;
    AnimatedBinding?: any;

    // Animation
    Animation?: any;
    Easing?: any;

    // Platform-specific helpers
    assetIdToImageSource?: (assetId: string) => any; // Convert asset ID to ImageSource (Horizon) or string (Web)
    assetsLoadedBinding?: any; // Binding<boolean> - true when assets are loaded (prevents race conditions)
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

    // Card collection and deck (SINGLE SOURCE OF TRUTH)
    cards: {
      collected: CardInstance[]; // All owned card instances
      deck: string[]; // Card instance IDs in player's deck
    };

    // Mission tracking
    missions: {
      completedMissions: { [missionId: string]: number }; // Mission ID -> completion count
    };

    // Item inventory
    items: PlayerItem[];

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
     * Return null if no data exists
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
     * For web: Returns web-specific View, Text, Image, Pressable, Binding
     * For horizon: Returns hz.View, hz.Text, hz.Image, hz.Pressable, hz.Binding
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
    private gameEngine: GameEngine;
    private missionManager: MissionManager;
    private missionUI: MissionSelectionUI;
    private battleUI: MissionBattleUI;
    private cardCollectionManager: CardCollectionManager;

    // Sound and display state
    private currentMusic: string | null = null;
    private battleDisplayManager: BattleDisplayManager;

    // Player data state - SINGLE SOURCE OF TRUTH (no duplicates!)
    // Starts as null to indicate data hasn't loaded yet (prevents race conditions)
    private playerData: PlayerData | null = null;

    // Game state
    private isInitializing: boolean = true;  // Prevent renders during initialization
    private currentScreen: string = 'loading';  // Current active screen
    private currentBattleId: string | null = null;

    // UI State bindings
    private playerDataBinding: BindingInterface<PlayerData | null>;
    private currentScreenBinding: BindingInterface<string>;
    private missionsBinding: BindingInterface<MissionDisplay[]>;

    // Battle-specific UI bindings (UI-only state)
    private battleStateBinding: BindingInterface<string>;
    private battleMessageBinding: BindingInterface<string>;
    private battleDisplayBinding: BindingInterface<BattleDisplay | null>;

    // Popup bindings (UI-only state)
    private missionCompletePopupBinding: BindingInterface<any>;
    private forfeitPopupBinding: BindingInterface<any>;
    private cardDetailPopupBinding: BindingInterface<any>;

    // Track binding values separately (as per Horizon docs - no .get() method)
    private missionCompletePopupValue: any = null;
    private forfeitPopupValue: any = null;
    private cardDetailPopupValue: any = null;

    // Screen instances
    private menuScreen: MenuScreen;
    private cardsScreen: CardsScreen;
    private missionScreen: MissionScreen;
    private battleScreen: BattleScreen;
    private settingsScreen: SettingsScreen;

    // UI tree (created once, updated reactively)
    // Public so platform wrappers can access it (needed for Horizon's initializeUI)
    public uiTree: UINode | null = null;

    constructor(config: PlatformConfig) {
      this.platform = config;

      // Get platform-specific UI methods
      this.UI = config.getUIMethodMappings();

      // Get platform-specific async methods
      this.asyncMethods = config.async;

      // Store platform-provided asset getters
      this.platformGetImageAsset = config.getImageAsset;

      // Initialize card utils and deck builder with catalog manager
      setCatalogManagerForUtils(config.catalogManager);
      setCatalogManagerForDeckBuilder(config.catalogManager);

      // Initialize core systems
      this.gameEngine = new GameEngine(config.catalogManager);
      this.missionManager = new MissionManager(config.catalogManager);
      this.missionUI = new MissionSelectionUI(this.missionManager);
      this.battleUI = new MissionBattleUI(this.missionManager, this.gameEngine, this.asyncMethods);

      // Set up render callback for battle UI to update display during opponent turns
      (this.battleUI as any).renderCallback = () => {
        const currentState = this.battleUI.getCurrentBattle();
        if (currentState && !currentState.isComplete) {
          const updatedDisplay = this.battleDisplayManager.createBattleDisplay(
            currentState,
            null
          );
          if (updatedDisplay) {
            // console.log('[BloomBeastsGame] renderCallback: Updating battleDisplayBinding with turnPlayer:', updatedDisplay.turnPlayer);
            this.battleDisplayBinding.set(updatedDisplay);
            this.triggerRender();
          }
        }
      };

      this.cardCollectionManager = new CardCollectionManager(config.catalogManager);
      this.battleDisplayManager = new BattleDisplayManager(config.catalogManager);

      // Initialize bindings using platform's Binding class
      const BindingClass = this.UI.Binding as any;
      this.playerDataBinding = new BindingClass(null);  // Start null - data loads in initialize()
      this.currentScreenBinding = new BindingClass('loading');  // Start with loading
      this.missionsBinding = new BindingClass([]);

      // Battle UI bindings
      this.battleStateBinding = new BindingClass('initializing');
      this.battleMessageBinding = new BindingClass('Preparing for battle...');
      this.battleDisplayBinding = new BindingClass(null);

      // Popup bindings
      this.missionCompletePopupBinding = new BindingClass(null);
      this.forfeitPopupBinding = new BindingClass(null);
      this.cardDetailPopupBinding = new BindingClass(null);

      // Create screen instances (pass UI methods and playerData binding)
      this.menuScreen = new MenuScreen({
        ui: this.UI,
        async: this.asyncMethods,
        playerDataBinding: this.playerDataBinding,
        onButtonClick: this.handleButtonClick.bind(this),
        onNavigate: this.navigate.bind(this),
        onRenderNeeded: this.triggerRender.bind(this)
      });

      this.cardsScreen = new CardsScreen({
        ui: this.UI,
        playerDataBinding: this.playerDataBinding,
        onCardSelect: this.handleCardSelect.bind(this),
        onNavigate: this.navigate.bind(this),
        onRenderNeeded: this.triggerRender.bind(this)
      });

      this.missionScreen = new MissionScreen({
        ui: this.UI,
        missions: this.missionsBinding,
        playerDataBinding: this.playerDataBinding,
        onMissionSelect: this.handleMissionSelect.bind(this),
        onNavigate: this.navigate.bind(this),
        onRenderNeeded: this.triggerRender.bind(this)
      });

      this.battleScreen = new BattleScreen({
        ui: this.UI,
        async: this.asyncMethods,
        battleDisplay: this.battleDisplayBinding,
        onAction: this.handleBattleAction.bind(this),
        onNavigate: this.navigate.bind(this),
        onRenderNeeded: this.triggerRender.bind(this),
        onShowCardDetail: this.showCardDetailPopup.bind(this)
      });

      this.settingsScreen = new SettingsScreen({
        ui: this.UI,
        playerDataBinding: this.playerDataBinding,
        onSettingChange: this.handleSettingsChange.bind(this),
        onNavigate: this.navigate.bind(this),
        onRenderNeeded: this.triggerRender.bind(this)
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
      console.log('[BloomBeastsGame] Initializing...');

      // Load saved game data (initializes starting cards if needed)
      await this.loadGameData();

      // Update bindings from loaded data
      console.log('[BloomBeastsGame] About to call updateBindingsFromGameState...');
      await this.updateBindingsFromGameState();
      console.log('[BloomBeastsGame] updateBindingsFromGameState completed');

      // Trigger initial render
      console.log('[BloomBeastsGame] About to trigger render...');
      this.triggerRender();

      // Start menu music
      console.log('[BloomBeastsGame] Starting menu music...');
      this.playMusic('music-background', true);
      console.log('[BloomBeastsGame] Navigating to menu...');
      this.navigate('menu');
      console.log('[BloomBeastsGame] Initialize complete!');
    }

    /**
     * Get current player level (derived from totalXP)
     */
    private get playerLevel(): number {
      return getPlayerLevel(this.playerData?.totalXP ?? 0);
    }

    /**
     * Create default player data structure
     */
    private createDefaultPlayerData(): PlayerData {
      return {
        name: 'Player',
        totalXP: 0,
        items: [],
        cards: {
          collected: [],
          deck: []
        },
        missions: {
          completedMissions: {}
        },
        settings: {
          musicVolume: 10,
          sfxVolume: 50,
          musicEnabled: true,
          sfxEnabled: true
        }
      };
    }

    /**
     * Load game data from platform storage
     * Creates default data if none exists
     */
    private async loadGameData(): Promise<void> {
      try {
        const savedData = this.platform.getPlayerData?.();

        if (savedData && Object.keys(savedData).length > 0) {
          // Use saved data directly
          this.playerData = savedData;
          Logger.info(`[BloomBeastsGame] Loaded player data with ${savedData.cards.collected.length} cards`);
        } else {
          // Create default player data
          this.playerData = this.createDefaultPlayerData();
          Logger.info('[BloomBeastsGame] Created default player data');
        }
      } catch (error) {
        Logger.error('[BloomBeastsGame] Error loading player data:', error);
        // Create default player data on error
        this.playerData = this.createDefaultPlayerData();
        Logger.info('[BloomBeastsGame] Using default player data');
      }

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
     * Update player data (single update method)
     * This is the ONLY way to update playerData - ensures binding stays in sync
     */
    private async updatePlayerData(updates: Partial<PlayerData> | ((current: PlayerData) => PlayerData)): Promise<void> {
      // Data must be loaded before updates
      if (!this.playerData) {
        Logger.error('[BloomBeastsGame] Cannot update player data before it is loaded');
        return;
      }

      // Support both object updates and function updates
      if (typeof updates === 'function') {
        this.playerData = updates(this.playerData);
      } else {
        this.playerData = { ...this.playerData, ...updates };
      }

      // Update binding
      this.playerDataBinding.set(this.playerData);

      // Auto-save
      await this.saveGameData();
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
      console.log('[BloomBeastsGame] toggleMusic called:', { enabled, currentMusic: this.currentMusic });
      if (!this.playerData?.settings) return;
      this.playerData.settings.musicEnabled = enabled;

      // Notify platform
      this.platform.setMusicEnabled?.(enabled);

      if (enabled && this.currentMusic) {
        // Resume music - force replay even if it's the same track
        const musicToResume = this.currentMusic;
        const volume = this.playerData.settings.musicVolume / 100;
        console.log('[BloomBeastsGame] Resuming music:', { musicToResume, volume, platformHasPlaySound: !!this.platform.playSound });
        this.platform.playSound?.(musicToResume, true, volume);
      } else if (!enabled) {
        // Stop music playback but keep track of current music for resume
        // Don't call stopMusic() as it clears this.currentMusic
        console.log('[BloomBeastsGame] Stopping music, keeping currentMusic:', this.currentMusic);
        this.platform.stopSound?.();
      } else {
        console.log('[BloomBeastsGame] Music enabled but no currentMusic set');
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
      this.playerData.cards.deck = await this.cardCollectionManager.initializeStartingCollection(
        this.playerData.cards.collected,
        this.playerData.cards.deck
      );
      await this.saveGameData();
    }

    /**
     * Update bindings from current game state
     * This syncs the UI bindings with the actual game state
     */
    private async updateBindingsFromGameState(): Promise<void> {
      // Update player data binding (screens derive what they need from this)
      this.playerDataBinding.set(this.playerData);

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

      // Debug: Log first 3 missions
      console.log('[BloomBeastsGame] First 3 display missions:', displayMissions.slice(0, 3).map(m => ({id: m.id, isAvailable: m.isAvailable})));

      this.missionsBinding.set(displayMissions);
    }

    /**
     * Navigate to a different screen
     */
    private navigate(screen: string): void {
      this.currentScreen = screen;
      this.currentScreenBinding.set(screen);
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
      // console.log('[BloomBeastsGame] Button clicked:', buttonId);

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
        case 'missions':
          this.navigate('missions');
          break;
        case 'settings':
        case 'btn-settings':
          this.navigate('settings');
          break;
        case 'shop':
          // console.log('Shop coming soon!');
          break;
        case 'btn-back':
          this.navigate('menu');
          break;
        case 'forfeit':
          // Show forfeit confirmation popup
          this.showForfeitConfirmation();
          break;
        default:
          // console.log('Unhandled button:', buttonId);
      }
    }

    /**
     * Show forfeit confirmation popup
     */
    private showForfeitConfirmation(): void {
      this.forfeitPopupBinding.set({
        title: 'Forfeit Battle?',
        message: 'Are you sure you want to give up? You will lose this battle.',
        buttons: [
          {
            text: 'Forfeit',
            onClick: () => {
              this.handleForfeit();
            },
            color: '#DC2626', // Red color
          },
          {
            text: 'Cancel',
            onClick: () => {
              this.forfeitPopupBinding.set(null);
            },
            color: '#6B7280', // Gray color
          },
        ],
      });
    }

    /**
     * Show card detail popup for a duration, then close and execute callback
     */
    private showCardDetailPopup(card: any, durationMs: number, callback?: () => void): void {
      console.log('[BloomBeastsGame] Showing card detail popup:', card.name, 'for', durationMs, 'ms');

      // Set the card detail popup
      this.cardDetailPopupValue = {
        cardDetail: {
          card: card,
          stats: null,
        },
        onButtonClick: () => {
          // Close button clicked
          this.cardDetailPopupValue = null;
          this.cardDetailPopupBinding.set(null);
        }
      };
      this.cardDetailPopupBinding.set(this.cardDetailPopupValue);
      this.triggerRender();

      // After duration, close the popup and execute callback
      this.asyncMethods.setTimeout(() => {
        this.cardDetailPopupValue = null;
        this.cardDetailPopupBinding.set(null);
        this.triggerRender();
        callback?.();
      }, durationMs);
    }

    /**
     * Handle forfeit - player gives up
     */
    private handleForfeit(): void {
      // Close popup
      this.forfeitPopupBinding.set(null);

      // Play lose sound
      this.playSfx('sfx-lose');

      // End battle as a loss
      const currentBattle = this.battleUI.getCurrentBattle();
      if (currentBattle) {
        const defeatState = {
          ...currentBattle,
          isComplete: true,
          rewards: null, // No rewards for forfeit
          mission: currentBattle.mission,
        };
        this.handleBattleComplete(defeatState);
      }
    }

    /**
     * Handle card selection
     */
    private async handleCardSelect(cardId: string): Promise<void> {
      // console.log('[BloomBeastsGame] Card selected:', cardId);
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
      const playerDeckCards = this.cardCollectionManager.getPlayerDeckCards(
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
        // console.log('[BloomBeastsGame] Mission started successfully');
        // Initialize battle with player's deck cards
        const battleState = this.battleUI.initializeBattle(playerDeckCards);
        // console.log('[BloomBeastsGame] battleState:', battleState);

        if (battleState) {
          // console.log('[BloomBeastsGame] Battle state is valid, initializing...');
          this.currentScreen = 'battle';
          this.currentBattleId = missionId;

          // Create battle display from battle state
          const battleDisplay = this.battleDisplayManager.createBattleDisplay(
            battleState,
            null  // No attack animation
          );
          // console.log('[BloomBeastsGame] battleDisplay:', battleDisplay);

          // Update battle display binding
          if (battleDisplay) {
            // console.log('[BloomBeastsGame] Setting battle display binding...');
            this.battleDisplayBinding.set(battleDisplay);
          } else {
            console.error('[BloomBeastsGame] battleDisplay is null!');
          }

          // Navigate to battle screen
          // console.log('[BloomBeastsGame] Navigating to battle screen');
          this.currentScreenBinding.set('battle');

          // Trigger re-render to show battle screen
          // console.log('[BloomBeastsGame] Triggering re-render');
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
      console.log('[BloomBeastsGame] Settings changed:', settingId, value);
      if (!this.playerData) return;
      console.log('[BloomBeastsGame] Current soundSettings before change:', this.playerData.settings);

      // Play button sound for toggles (not sliders)
      if (settingId === 'musicEnabled' || settingId === 'sfxEnabled') {
        this.playSfx('sfx-menu-button-select');
      }

      // Apply settings via sound manager
      switch (settingId) {
        case 'musicVolume':
          console.log('[BloomBeastsGame] Matched case: musicVolume');
          this.setMusicVolume(value);
          break;
        case 'sfxVolume':
          console.log('[BloomBeastsGame] Matched case: sfxVolume');
          this.setSfxVolume(value);
          break;
        case 'musicEnabled':
          console.log('[BloomBeastsGame] Matched case: musicEnabled');
          this.toggleMusic(value);
          break;
        case 'sfxEnabled':
          console.log('[BloomBeastsGame] Matched case: sfxEnabled');
          this.toggleSfx(value);
          break;
      }

      console.log('[BloomBeastsGame] Current soundSettings after change:', this.playerData.settings);

      // Save settings and update binding
      this.playerDataBinding.set(this.playerData);
      this.saveGameData();

      // Trigger re-render to update UI
      this.triggerRender();
    }

    /**
     * Handle battle actions
     */
    private async handleBattleAction(action: string): Promise<void> {
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

      // Beast and opponent clicks are now just for viewing details (no selection)
      if (action.startsWith('view-field-card-player-') || action.startsWith('view-field-card-opponent-')) {
        // Just return - card details will be shown by the UI layer if needed
        return;
      }

      // Play sound effects and show animations based on action type
      if (action === 'auto-attack-all') {
        // Handle auto-attack with animations
        this.playSfx('sfx-attack');

        // Process action with animation callback
        await this.battleUI.processPlayerAction(action, {
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
            this.battleDisplayBinding.set(updatedDisplay);
            this.triggerRender();
          }
        }
        return;
      } else if (action.startsWith('attack-beast-')) {
        this.playSfx('sfx-attack');
        // Animation already shown above
      } else if (action.startsWith('attack-player-')) {
        this.playSfx('sfx-attack');
        // Extract attacker index and show animation for direct health attack
        const attackerIndex = parseInt(action.substring('attack-player-'.length), 10);
        await this.showAttackAnimation('player', attackerIndex, 'health', undefined);
      } else if (action.startsWith('play-card-')) {
        this.playSfx('sfx-play-card');
      } else if (action.startsWith('activate-trap-')) {
        this.playSfx('sfx-trap-card-activated');
      } else if (action === 'end-turn') {
        this.playSfx('sfx-menu-button-select');
      }

      // Process action
      await this.battleUI.processPlayerAction(action, {});

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
          // console.log('[BloomBeastsGame] Updating battle display with health:', {
          //   playerHealth: updatedDisplay.playerHealth,
          //   opponentHealth: updatedDisplay.opponentHealth
          // });
          this.battleDisplayBinding.set(updatedDisplay);
          this.triggerRender();
        }
      }
    }

    /**
     * Handle battle completion (victory or defeat)
     */
    private async handleBattleComplete(battleState: any): Promise<void> {
      // console.log('[BloomBeastsGame] Handling battle completion...');
      if (!this.playerData) return;

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

      // console.log('[BloomBeastsGame] Battle complete, checking rewards:', {
      //   hasRewards: !!battleState.rewards,
      //   rewards: battleState.rewards
      // });

      if (battleState.rewards) {
        // Victory!
        // console.log('[BloomBeastsGame] Mission victory!', battleState.rewards);

        // Award XP
        this.addXP(battleState.rewards.xpGained);

        // Award card XP
        const cardXP = battleState.rewards.beastXP || battleState.rewards.xpGained;
        this.cardCollectionManager.awardDeckExperience(
          cardXP,
          playerData.cards.deck,
          playerData.cards.collected
        );

        // Add cards to collection
        battleState.rewards.cardsReceived.forEach((card: any, index: number) => {
          this.cardCollectionManager.addCardReward(card, playerData.cards.collected, index);
        });

        // Add items to inventory
        if (battleState.rewards.itemsReceived) {
          battleState.rewards.itemsReceived.forEach((itemReward: any) => {
            this.addItems(itemReward.itemId, itemReward.quantity);
          });
        }

        // Track mission completion
        if (battleId) {
          this.trackMissionCompletion(battleId);
        }

        // Play win sound
        this.playSfx('sfx-win');

        // Save game data
        await this.saveGameData();

        // Show mission complete popup
        // console.log('[BloomBeastsGame] Setting victory popup...');
        const popupData = {
          mission: battleState.mission,
          rewards: battleState.rewards,
          chestOpened: false,
          onClaimRewards: () => {
            // console.log('[BloomBeastsGame] Claim rewards clicked');
            // Chest animation could go here
            const current = this.missionCompletePopupValue;
            if (current) {
              const updatedData = {
                ...current,
                chestOpened: true
              };
              this.missionCompletePopupValue = updatedData;
              this.missionCompletePopupBinding.set(updatedData);
              // console.log('[BloomBeastsGame] Chest opened, triggering render');
              this.triggerRender();
            }
          },
          onContinue: () => {
            // console.log('[BloomBeastsGame] Victory continue clicked');
            // Clear battle display and close popup
            this.battleDisplayBinding.set(null);
            this.missionCompletePopupValue = null;
            this.missionCompletePopupBinding.set(null);
            this.navigate('missions');
          }
        };

        // Set both tracked value and binding
        this.missionCompletePopupValue = popupData;
        this.missionCompletePopupBinding.set(popupData);
        // console.log('[BloomBeastsGame] Victory popup set');
        this.triggerRender();
        // console.log('[BloomBeastsGame] Render triggered after victory popup');
      } else {
        // Defeat
        // console.log('[BloomBeastsGame] Mission failed!');

        // Play lose sound
        this.playSfx('sfx-lose');

        // Show mission failed popup
        const failedPopupProps = {
          mission: battleState.mission,
          rewards: null, // null indicates failure
          chestOpened: false,
          onContinue: () => {
            // Clear battle display and close popup
            this.battleDisplayBinding.set(null);
            this.missionCompletePopupValue = null;
            this.missionCompletePopupBinding.set(null);
            this.navigate('missions');
          }
        };
        // console.log('[BloomBeastsGame] Setting mission failed popup:', failedPopupProps);
        this.missionCompletePopupValue = failedPopupProps;
        this.missionCompletePopupBinding.set(failedPopupProps);
        // console.log('[BloomBeastsGame] After set, mission failed popup set');
        this.triggerRender();
        // console.log('[BloomBeastsGame] Render triggered after mission failed');
      }

      // Resume background music
      this.playMusic('music-background', true);

      // Note: Navigation happens when user clicks Continue in the popup
    }

    /**
     * Create the main UI tree
     * This is created once and updated reactively via bindings
     */
    private createUI(): UINode {
      const { View } = this.UI;

      // Create all screens upfront
      const loadingScreen = this.createLoadingScreen();
      const menuScreen = this.menuScreen.createUI();
      const cardsScreen = this.cardsScreen.createUI();
      const missionsScreen = this.missionScreen.createUI();
      const battleScreen = this.battleScreen.createUI();
      const settingsScreen = this.settingsScreen.createUI();

      // Use conditional rendering to show the right screen based on currentScreenBinding
      const createConditionalScreen = (screenName: string, screenUI: UINode) => {
        if (this.UI.UINode && this.UI.UINode.if) {
          return this.UI.UINode.if(
            this.currentScreenBinding.derive((current: string) => current === screenName),
            screenUI
          );
        }
        return screenUI;
      };

      // Build main UI with conditional screens
      const children: any[] = [
        createConditionalScreen('loading', loadingScreen),
        createConditionalScreen('menu', menuScreen),
        createConditionalScreen('cards', cardsScreen),
        createConditionalScreen('missions', missionsScreen),
        createConditionalScreen('battle', battleScreen),
        createConditionalScreen('settings', settingsScreen),
      ];

      // Add popups (these already use UINode.if)
      if (this.UI.UINode) {
        children.push(
          this.UI.UINode.if(
            this.UI.Binding.derive(
              [this.missionCompletePopupBinding],
              (props) => {
                // Update tracked value
                this.missionCompletePopupValue = props;
                return props !== null;
              }
            ),
            createMissionCompletePopup(this.UI, this.missionCompletePopupValue || {
              mission: {
                id: 'fallback-mission',
                name: 'Loading...',
                affinity: 'Forest'
              },
              rewards: null,
              chestOpened: false,
              onContinue: () => {}
            })
          )
        );
      }

      if (this.UI.UINode) {
        children.push(
          this.UI.UINode.if(
            this.UI.Binding.derive(
              [this.forfeitPopupBinding],
              (props) => {
                // Update tracked value
                this.forfeitPopupValue = props;
                return props !== null;
              }
            ),
            createButtonPopup(this.UI, this.forfeitPopupValue || {
              title: '',
              message: '',
              buttons: [],
              onButtonClick: () => {}
            })
          )
        );
      }

      if (this.UI.UINode) {
        children.push(
          this.UI.UINode.if(
            this.UI.Binding.derive(
              [this.cardDetailPopupBinding],
              (props: any) => {
                // Update tracked value
                this.cardDetailPopupValue = props;
                return props !== null;
              }
            ),
            createCardDetailPopup(this.UI, this.cardDetailPopupValue || {
              cardDetail: {
                card: {
                  id: null, // No ID so CardRenderer returns null for images
                  name: '',
                  type: 'Bloom',
                  level: 1,
                  experience: 0,
                  count: 0,
                  description: ''
                },
                buttons: [],
                isInDeck: false
              },
              onButtonClick: () => {}
            })
          )
        );
      }

      return View({
        style: {
          width: '100%',
          height: '100%',
          backgroundColor: 'blue',
        },
        children,
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
              text: this.UI.Binding ? new this.UI.Binding('Loading...') : 'Loading...',
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
        this.battleDisplayBinding.set(displayWithAnimation);
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
        this.battleDisplayBinding.set(displayWithoutAnimation);
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

  // ==================== bloombeasts\catalogs\buffAssets.ts ====================

  /**
   * Buff Assets Catalog
   * Source of truth for buff cards and assets
   * Edit this file directly to add/modify assets
   */


  export const buffAssets: AssetCatalog = {
    version: "1.0.0",
    category: "buff",
    description: "Buff cards and assets",
    data: [
      {
        id: "battle-fury",
        type: "buff",
        cardType: "Buff",
        data: {
          id: "battle-fury",
          name: "Battle Fury",
          type: "Buff",
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
            type: "image",
            horizonAssetId: "1514404306279605",
            path: "assets/images/cards_buff_battle-fury.png"
          }
        ]
      },
      {
        id: "mystic-shield",
        type: "buff",
        cardType: "Buff",
        data: {
          id: "mystic-shield",
          name: "Mystic Shield",
          type: "Buff",
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
            type: "image",
            horizonAssetId: "787965707330770",
            path: "assets/images/cards_buff_mystic-shield.png"
          }
        ]
      },
      {
        id: "natures-blessing",
        type: "buff",
        cardType: "Buff",
        affinity: "forest",
        data: {
          id: "natures-blessing",
          name: "Nature's Blessing",
          type: "Buff",
          affinity: "Forest",
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
            type: "image",
            horizonAssetId: "4100038783597004",
            path: "assets/images/cards_buff_natures-blessing.png"
          }
        ]
      },
      {
        id: "swift-wind",
        type: "buff",
        cardType: "Buff",
        affinity: "sky",
        data: {
          id: "swift-wind",
          name: "Swift Wind",
          type: "Buff",
          affinity: "Sky",
          cost: 2,
          abilities: [
            {
              name: "Swift Wind",
              trigger: AbilityTrigger.OnOwnStartOfTurn,
              effects: [
                {
                  type: EffectType.GainResource,
                  target: AbilityTarget.PlayerGardener,
                  resource: ResourceType.Nectar,
                  value: 1
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: "image",
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
    category: "common",
    description: "Common UI elements, backgrounds, and shared assets",
    data: [
      {
        id: "background",
        type: "ui",
        category: "background",
        name: "Main Background",
        description: "Main game background",
        assets: [
          {
            type: "image",
            horizonAssetId: "1341821670869568",
            path: "assets/images/bg_background.png"
          }
        ]
      },
      {
        id: "menu",
        type: "ui",
        category: "background",
        name: "Menu Background",
        description: "Menu screen background",
        assets: [
          {
            type: "image",
            horizonAssetId: "1341821670869568",
            path: "assets/images/misc_menu.png"
          }
        ]
      },
      {
        id: "playboard",
        type: "ui",
        category: "background",
        name: "Playboard",
        description: "Battle playboard background",
        assets: [
          {
            type: "image",
            horizonAssetId: "802255839066806",
            path: "assets/images/misc_playboard.png"
          }
        ]
      },
      {
        id: "cards-container",
        type: "ui",
        category: "container",
        name: "Cards Container",
        description: "Cards collection screen container",
        assets: [
          {
            type: "image",
            horizonAssetId: "1360422829007789",
            path: "assets/images/misc_cards-container.png"
          }
        ]
      },
      {
        id: "mission-container",
        type: "ui",
        category: "container",
        name: "Mission Container",
        description: "Mission selection container",
        assets: [
          {
            type: "image",
            horizonAssetId: "828431839717203",
            path: "assets/images/misc_mission-container.png"
          }
        ]
      },
      {
        id: "standard-button",
        type: "ui",
        category: "button",
        name: "Standard Button",
        description: "Default button style",
        assets: [
          {
            type: "image",
            horizonAssetId: "740500362349295",
            path: "assets/images/misc_standard-button.png"
          }
        ]
      },
      {
        id: "green-button",
        type: "ui",
        category: "button",
        name: "Green Button",
        description: "Green variant button",
        assets: [
          {
            type: "image",
            horizonAssetId: "1454989832255109",
            path: "assets/images/misc_green-button.png"
          }
        ]
      },
      {
        id: "red-button",
        type: "ui",
        category: "button",
        name: "Red Button",
        description: "Red variant button",
        assets: [
          {
            type: "image",
            horizonAssetId: "1365262285015644",
            path: "assets/images/misc_red-button.png"
          }
        ]
      },
      {
        id: "long-green-button",
        type: "ui",
        category: "button",
        name: "Long Green Button",
        description: "Long green button variant",
        assets: [
          {
            type: "image",
            horizonAssetId: "1842026620010613",
            path: "assets/images/misc_long-green-button.png"
          }
        ]
      },
      {
        id: "side-menu",
        type: "ui",
        category: "container",
        name: "Side Menu",
        description: "Side menu panel",
        assets: [
          {
            type: "image",
            horizonAssetId: "794839683168713",
            path: "assets/images/misc_side-menu.png"
          }
        ]
      },
      {
        id: "experience-bar",
        type: "ui",
        category: "other",
        name: "Experience Bar",
        description: "XP progress bar",
        assets: [
          {
            type: "image",
            horizonAssetId: "1151343029773719",
            path: "assets/images/cards_experience-bar.png"
          }
        ]
      },
      {
        id: "base-card",
        type: "ui",
        category: "frame",
        name: "Base Card Frame",
        description: "Default card frame template",
        assets: [
          {
            type: "image",
            horizonAssetId: "823441590335166",
            path: "assets/images/cards_base-card.png"
          }
        ]
      },
      {
        id: "magic-card",
        type: "ui",
        category: "frame",
        name: "Magic Card Frame",
        description: "Magic card frame template",
        assets: [
          {
            type: "image",
            horizonAssetId: "802428729033291",
            path: "assets/images/cards_magic-card.png"
          }
        ]
      },
      {
        id: "magic-card-playboard",
        type: "ui",
        category: "frame",
        name: "Magic Card Playboard",
        description: "Magic card on playboard",
        assets: [
          {
            type: "image",
            horizonAssetId: "2991234734402522",
            path: "assets/images/cards_magic-card-playboard.png"
          }
        ]
      },
      {
        id: "trap-card",
        type: "ui",
        category: "frame",
        name: "Trap Card Frame",
        description: "Trap card frame template",
        assets: [
          {
            type: "image",
            horizonAssetId: "2847974385407960",
            path: "assets/images/cards_trap-card.png"
          }
        ]
      },
      {
        id: "trap-card-playboard",
        type: "ui",
        category: "frame",
        name: "Trap Card Playboard",
        description: "Trap card on playboard",
        assets: [
          {
            type: "image",
            horizonAssetId: "1724877334843483",
            path: "assets/images/cards_trap-card-playboard.png"
          }
        ]
      },
      {
        id: "buff-card",
        type: "ui",
        category: "frame",
        name: "Buff Card Frame",
        description: "Buff card frame template",
        assets: [
          {
            type: "image",
            horizonAssetId: "1962518914567182",
            path: "assets/images/cards_buff-card.png"
          }
        ]
      },
      {
        id: "buff-card-playboard",
        type: "ui",
        category: "frame",
        name: "Buff Card Playboard",
        description: "Buff card on playboard",
        assets: [
          {
            type: "image",
            horizonAssetId: "2628573627486992",
            path: "assets/images/cards_buff-card-playboard.png"
          }
        ]
      },
      {
        id: "menu-frame-1",
        type: "ui",
        category: "frame",
        name: "Menu Frame 1",
        description: "Menu animation frame 1",
        assets: [
          {
            type: "image",
            horizonAssetId: "1186506656766961",
            path: "assets/images/menu_frame-1.png"
          }
        ]
      },
      {
        id: "menu-frame-2",
        type: "ui",
        category: "frame",
        name: "Menu Frame 2",
        description: "Menu animation frame 2",
        assets: [
          {
            type: "image",
            horizonAssetId: "816845231314389",
            path: "assets/images/menu_frame-2.png"
          }
        ]
      },
      {
        id: "menu-frame-3",
        type: "ui",
        category: "frame",
        name: "Menu Frame 3",
        description: "Menu animation frame 3",
        assets: [
          {
            type: "image",
            horizonAssetId: "2012665279305528",
            path: "assets/images/menu_frame-3.png"
          }
        ]
      },
      {
        id: "menu-frame-4",
        type: "ui",
        category: "frame",
        name: "Menu Frame 4",
        description: "Menu animation frame 4",
        assets: [
          {
            type: "image",
            horizonAssetId: "803392912558689",
            path: "assets/images/menu_frame-4.png"
          }
        ]
      },
      {
        id: "menu-frame-5",
        type: "ui",
        category: "frame",
        name: "Menu Frame 5",
        description: "Menu animation frame 5",
        assets: [
          {
            type: "image",
            horizonAssetId: "1141897134114548",
            path: "assets/images/menu_frame-5.png"
          }
        ]
      },
      {
        id: "menu-frame-6",
        type: "ui",
        category: "frame",
        name: "Menu Frame 6",
        description: "Menu animation frame 6",
        assets: [
          {
            type: "image",
            horizonAssetId: "1962288661350650",
            path: "assets/images/menu_frame-6.png"
          }
        ]
      },
      {
        id: "menu-frame-7",
        type: "ui",
        category: "frame",
        name: "Menu Frame 7",
        description: "Menu animation frame 7",
        assets: [
          {
            type: "image",
            horizonAssetId: "781356411339489",
            path: "assets/images/menu_frame-7.png"
          }
        ]
      },
      {
        id: "menu-frame-8",
        type: "ui",
        category: "frame",
        name: "Menu Frame 8",
        description: "Menu animation frame 8",
        assets: [
          {
            type: "image",
            horizonAssetId: "844985438202497",
            path: "assets/images/menu_frame-8.png"
          }
        ]
      },
      {
        id: "menu-frame-9",
        type: "ui",
        category: "frame",
        name: "Menu Frame 9",
        description: "Menu animation frame 9",
        assets: [
          {
            type: "image",
            horizonAssetId: "1340487887747224",
            path: "assets/images/menu_frame-9.png"
          }
        ]
      },
      {
        id: "menu-frame-10",
        type: "ui",
        category: "frame",
        name: "Menu Frame 10",
        description: "Menu animation frame 10",
        assets: [
          {
            type: "image",
            horizonAssetId: "1866001547625853",
            path: "assets/images/menu_frame-10.png"
          }
        ]
      },
      {
        id: "icon-ability",
        type: "ui",
        category: "icon",
        name: "Ability Icon",
        description: "Ability indicator icon",
        assets: [
          {
            type: "image",
            horizonAssetId: "1550821249252575",
            path: "assets/images/icon_ability.png"
          }
        ]
      },
      {
        id: "icon-attack",
        type: "ui",
        category: "icon",
        name: "Attack Icon",
        description: "Attack indicator icon",
        assets: [
          {
            type: "image",
            horizonAssetId: "818969787355942",
            path: "assets/images/icon_attack.png"
          }
        ]
      },
      {
        id: "lose-image",
        type: "ui",
        category: "other",
        name: "Lose Image",
        description: "Game over/lose screen image",
        assets: [
          {
            type: "image",
            horizonAssetId: "2155452308310801",
            path: "assets/images/misc_lose-image.png"
          }
        ]
      },
      {
        id: "boss-mission",
        type: "mission",
        affinity: "boss",
        missionNumber: 5,
        name: "The Bloom Master",
        description: "Final boss mission",
        assets: [
          {
            type: "image",
            horizonAssetId: "1879466909654800",
            path: "assets/images/cards_boss-mission.png"
          }
        ]
      },
      {
        id: "the-bloom-master",
        type: "ui",
        category: "other",
        name: "The Bloom Master",
        description: "Boss card image",
        assets: [
          {
            type: "image",
            horizonAssetId: "1948729499041670",
            path: "assets/images/cards_the-bloom-master.png"
          }
        ]
      },
      {
        id: "sfx-menu-button-select",
        type: "ui",
        category: "other",
        name: "Menu Button Select SFX",
        description: "Sound for menu button selection",
        assets: [
          {
            type: "audio",
            horizonAssetId: "3481449071995903",
            path: "assets/audio/sfx_menu-button-select.wav"
          }
        ]
      },
      {
        id: "sfx-play-card",
        type: "ui",
        category: "other",
        name: "Play Card SFX",
        description: "Sound for playing a card",
        assets: [
          {
            type: "audio",
            horizonAssetId: "673115269189210",
            path: "assets/audio/sfx_play-card.wav"
          }
        ]
      },
      {
        id: "sfx-attack",
        type: "ui",
        category: "other",
        name: "Attack SFX",
        description: "Sound for attack action",
        assets: [
          {
            type: "audio",
            horizonAssetId: "1718962638781724",
            path: "assets/audio/sfx_attack.wav"
          }
        ]
      },
      {
        id: "sfx-trap-card-activated",
        type: "ui",
        category: "other",
        name: "Trap Activated SFX",
        description: "Sound for trap activation",
        assets: [
          {
            type: "audio",
            horizonAssetId: "1180175093968172",
            path: "assets/audio/sfx_trap-card-activated.wav"
          }
        ]
      },
      {
        id: "sfx-low-health",
        type: "ui",
        category: "other",
        name: "Low Health SFX",
        description: "Warning sound for low health",
        assets: [
          {
            type: "audio",
            horizonAssetId: "828372796357589",
            path: "assets/audio/sfx_low-health.wav"
          }
        ]
      },
      {
        id: "sfx-win",
        type: "ui",
        category: "other",
        name: "Win SFX",
        description: "Victory sound effect",
        assets: [
          {
            type: "audio",
            horizonAssetId: "4241684452770634",
            path: "assets/audio/sfx_win.wav"
          }
        ]
      },
      {
        id: "sfx-lose",
        type: "ui",
        category: "other",
        name: "Lose SFX",
        description: "Defeat sound effect",
        assets: [
          {
            type: "audio",
            horizonAssetId: "1323050035978393",
            path: "assets/audio/sfx_lose.wav"
          }
        ]
      },
      {
        id: "music-background",
        type: "ui",
        category: "other",
        name: "Background Music",
        description: "Main background music",
        assets: [
          {
            type: "audio",
            horizonAssetId: "802288129374217",
            path: "assets/audio/music_background.mp3"
          }
        ]
      },
      {
        id: "music-battle",
        type: "ui",
        category: "other",
        name: "Battle Music",
        description: "Battle scene music",
        assets: [
          {
            type: "audio",
            horizonAssetId: "668023946362739",
            path: "assets/audio/music_battle.mp3"
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
    category: "fire",
    description: "Fire affinity cards and assets",
    data: [
      {
        id: "blazefinch",
        type: "beast",
        cardType: "Bloom",
        affinity: "fire",
        data: {
          id: "blazefinch",
          name: "Blazefinch",
          type: "Bloom",
          affinity: "Fire",
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
          levelingConfig: {
            statGains: {
              "1": {
                hp: 0,
                atk: 0
              },
              "2": {
                hp: 0,
                atk: 1
              },
              "3": {
                hp: 0,
                atk: 3
              },
              "4": {
                hp: 1,
                atk: 5
              },
              "5": {
                hp: 1,
                atk: 6
              },
              "6": {
                hp: 2,
                atk: 8
              },
              "7": {
                hp: 2,
                atk: 9
              },
              "8": {
                hp: 3,
                atk: 11
              },
              "9": {
                hp: 3,
                atk: 13
              }
            },
            abilityUpgrades: {
              "4": {
                abilities: [
                  {
                    name: "Ember Strike",
                    trigger: AbilityTrigger.OnAttack,
                    effects: [
                      {
                        type: EffectType.AttackModification,
                        target: AbilityTarget.Self,
                        modification: "triple-damage",
                        condition: {
                          type: "IsDamaged"
                        }
                      }
                    ]
                  }
                ]
              },
              "7": {
                abilities: [
                  {
                    name: "Lightning Speed",
                    trigger: AbilityTrigger.WhileOnField,
                    effects: [
                      {
                        type: EffectType.RemoveSummoningSickness,
                        target: AbilityTarget.Self
                      },
                      {
                        type: EffectType.AttackModification,
                        target: AbilityTarget.Self,
                        modification: "attack-twice"
                      }
                    ]
                  }
                ]
              },
              "9": {
                abilities: [
                  {
                    name: "Phoenix Form",
                    trigger: AbilityTrigger.WhileOnField,
                    effects: [
                      {
                        type: EffectType.AttackModification,
                        target: AbilityTarget.Self,
                        modification: "attack-twice"
                      }
                    ]
                  },
                  {
                    name: "Annihilation",
                    trigger: AbilityTrigger.OnAttack,
                    effects: [
                      {
                        type: EffectType.AttackModification,
                        target: AbilityTarget.Self,
                        modification: "instant-destroy",
                        condition: {
                          type: "IsDamaged"
                        }
                      }
                    ]
                  }
                ]
              }
            }
          }
        },
        assets: [
          {
            type: "image",
            horizonAssetId: "3218250765004566",
            path: "assets/images/cards_fire_blazefinch.png"
          }
        ]
      },
      {
        id: "cinder-pup",
        type: "beast",
        cardType: "Bloom",
        affinity: "fire",
        data: {
          id: "cinder-pup",
          name: "Cinder Pup",
          type: "Bloom",
          affinity: "Fire",
          cost: 2,
          baseAttack: 2,
          baseHealth: 3,
          abilities: [
            {
              name: "Burning Passion",
              trigger: AbilityTrigger.OnAttack,
              effects: [
                {
                  type: EffectType.ApplyCounter,
                  target: AbilityTarget.Target,
                  counter: "Burn",
                  value: 1
                }
              ]
            }
          ],
          levelingConfig: {
            statGains: {
              "1": {
                hp: 0,
                atk: 0
              },
              "2": {
                hp: 1,
                atk: 1
              },
              "3": {
                hp: 2,
                atk: 2
              },
              "4": {
                hp: 3,
                atk: 3
              },
              "5": {
                hp: 4,
                atk: 4
              },
              "6": {
                hp: 5,
                atk: 5
              },
              "7": {
                hp: 6,
                atk: 6
              },
              "8": {
                hp: 7,
                atk: 7
              },
              "9": {
                hp: 8,
                atk: 8
              }
            },
            abilityUpgrades: {
              "4": {
                abilities: [
                  {
                    name: "Inferno Bite",
                    trigger: AbilityTrigger.OnAttack,
                    effects: [
                      {
                        type: EffectType.ApplyCounter,
                        target: AbilityTarget.Target,
                        counter: "Burn",
                        value: 2
                      }
                    ]
                  }
                ]
              },
              "7": {
                abilities: [
                  {
                    name: "Flame Burst",
                    trigger: AbilityTrigger.OnSummon,
                    cost: {
                      type: "Discard",
                      value: 1
                    },
                    effects: [
                      {
                        type: EffectType.ApplyCounter,
                        target: AbilityTarget.AllEnemies,
                        counter: "Burn",
                        value: 2
                      }
                    ]
                  }
                ]
              },
              "9": {
                abilities: [
                  {
                    name: "Wildfire Aura",
                    trigger: AbilityTrigger.OnAttack,
                    effects: [
                      {
                        type: EffectType.ApplyCounter,
                        target: AbilityTarget.Target,
                        counter: "Burn",
                        value: 3
                      }
                    ]
                  },
                  {
                    name: "Apocalypse Flame",
                    trigger: AbilityTrigger.OnSummon,
                    effects: [
                      {
                        type: EffectType.ApplyCounter,
                        target: AbilityTarget.AllEnemies,
                        counter: "Burn",
                        value: 3
                      },
                      {
                        type: EffectType.DealDamage,
                        target: "OpponentGardener",
                        value: 2
                      }
                    ]
                  }
                ]
              }
            }
          }
        },
        assets: [
          {
            type: "image",
            horizonAssetId: "913214814369510",
            path: "assets/images/cards_fire_cinder-pup.png"
          }
        ]
      },
      {
        id: "charcoil",
        type: "beast",
        cardType: "Bloom",
        affinity: "fire",
        data: {
          id: "charcoil",
          name: "Charcoil",
          type: "Bloom",
          affinity: "Fire",
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
          levelingConfig: {
            statGains: {
              "1": {
                hp: 0,
                atk: 0
              },
              "2": {
                hp: 1,
                atk: 1
              },
              "3": {
                hp: 2,
                atk: 2
              },
              "4": {
                hp: 4,
                atk: 3
              },
              "5": {
                hp: 5,
                atk: 4
              },
              "6": {
                hp: 6,
                atk: 5
              },
              "7": {
                hp: 8,
                atk: 6
              },
              "8": {
                hp: 9,
                atk: 7
              },
              "9": {
                hp: 11,
                atk: 8
              }
            },
            abilityUpgrades: {
              "4": {
                abilities: [
                  {
                    name: "Burning Retaliation",
                    trigger: AbilityTrigger.OnDamage,
                    effects: [
                      {
                        type: "Retaliation",
                        target: AbilityTarget.Attacker,
                        value: 2
                      },
                      {
                        type: EffectType.ApplyCounter,
                        target: AbilityTarget.Attacker,
                        counter: "Burn",
                        value: 1
                      }
                    ]
                  }
                ]
              },
              "7": {
                abilities: [
                  {
                    name: "Smoke Screen",
                    trigger: AbilityTrigger.OnDamage,
                    effects: [
                      {
                        type: "Immunity",
                        target: AbilityTarget.Self,
                        immuneTo: [
                          "Magic",
                          "Trap"
                        ],
                        duration: EffectDuration.WhileOnField
                      },
                      {
                        type: EffectType.ApplyCounter,
                        target: AbilityTarget.Target,
                        counter: "Soot",
                        value: 2
                      }
                    ]
                  }
                ]
              },
              "9": {
                abilities: [
                  {
                    name: "Blazing Vengeance",
                    trigger: AbilityTrigger.OnDamage,
                    effects: [
                      {
                        type: "Immunity",
                        target: AbilityTarget.Self,
                        immuneTo: [
                          "Magic",
                          "Trap"
                        ],
                        duration: EffectDuration.WhileOnField
                      },
                      {
                        type: EffectType.ApplyCounter,
                        target: AbilityTarget.Attacker,
                        counter: "Burn",
                        value: 3
                      }
                    ]
                  },
                  {
                    name: "Infernal Reflection",
                    trigger: AbilityTrigger.OnDamage,
                    effects: [
                      {
                        type: "Retaliation",
                        target: AbilityTarget.Attacker,
                        value: "reflected"
                      },
                      {
                        type: EffectType.ApplyCounter,
                        target: AbilityTarget.Attacker,
                        counter: "Burn",
                        value: 2
                      }
                    ]
                  }
                ]
              }
            }
          }
        },
        assets: [
          {
            type: "image",
            horizonAssetId: "785856391096811",
            path: "assets/images/cards_fire_charcoil.png"
          }
        ]
      },
      {
        id: "magmite",
        type: "beast",
        cardType: "Bloom",
        affinity: "fire",
        data: {
          id: "magmite",
          name: "Magmite",
          type: "Bloom",
          affinity: "Fire",
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
          levelingConfig: {
            statGains: {
              "1": {
                hp: 0,
                atk: 0
              },
              "2": {
                hp: 2,
                atk: 1
              },
              "3": {
                hp: 3,
                atk: 2
              },
              "4": {
                hp: 5,
                atk: 3
              },
              "5": {
                hp: 7,
                atk: 4
              },
              "6": {
                hp: 9,
                atk: 5
              },
              "7": {
                hp: 11,
                atk: 6
              },
              "8": {
                hp: 13,
                atk: 7
              },
              "9": {
                hp: 15,
                atk: 9
              }
            },
            abilityUpgrades: {
              "4": {
                abilities: [
                  {
                    name: "Molten Armor",
                    trigger: AbilityTrigger.WhileOnField,
                    effects: [
                      {
                        type: EffectType.DamageReduction,
                        target: AbilityTarget.Self,
                        value: 2,
                        duration: EffectDuration.WhileOnField
                      }
                    ]
                  }
                ]
              },
              "7": {
                abilities: [
                  {
                    name: "Eruption",
                    trigger: AbilityTrigger.OnDestroy,
                    effects: [
                      {
                        type: EffectType.DealDamage,
                        target: "OpponentGardener",
                        value: 5
                      },
                      {
                        type: EffectType.DealDamage,
                        target: AbilityTarget.AllEnemies,
                        value: 2
                      }
                    ]
                  }
                ]
              },
              "9": {
                abilities: [
                  {
                    name: "Obsidian Carapace",
                    trigger: AbilityTrigger.WhileOnField,
                    effects: [
                      {
                        type: EffectType.DamageReduction,
                        target: AbilityTarget.Self,
                        value: 3,
                        duration: EffectDuration.WhileOnField
                      },
                      {
                        type: "Retaliation",
                        target: AbilityTarget.Attacker,
                        value: 2
                      }
                    ]
                  },
                  {
                    name: "Cataclysm",
                    trigger: AbilityTrigger.OnDestroy,
                    effects: [
                      {
                        type: EffectType.DealDamage,
                        target: "OpponentGardener",
                        value: 8
                      },
                      {
                        type: "Destroy",
                        target: AbilityTarget.AllEnemies,
                        condition: {
                          type: "HealthBelow",
                          value: 4,
                          comparison: "Less"
                        }
                      }
                    ]
                  }
                ]
              }
            }
          }
        },
        assets: [
          {
            type: "image",
            horizonAssetId: "25339017082348952",
            path: "assets/images/cards_fire_magmite.png"
          }
        ]
      },
      {
        id: "volcanic-scar",
        type: "habitat",
        affinity: "fire",
        data: {
          id: "volcanic-scar",
          name: "Volcanic Scar",
          type: "Habitat",
          affinity: "Fire",
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
            type: "image",
            horizonAssetId: "1878791053043603",
            path: "assets/images/cards_fire_volcanic-scar.png"
          },
          {
            type: "image",
            horizonAssetId: "1762741407742835",
            path: "assets/images/cards_fire_habitat-card.png"
          },
          {
            type: "image",
            horizonAssetId: "1863280224222620",
            path: "assets/images/cards_fire_habitat-card-playboard.png"
          }
        ]
      },
      {
        id: "fire-mission",
        type: "mission",
        affinity: "fire",
        missionNumber: 1,
        name: "Fire Mission",
        description: "Fire affinity mission",
        assets: [
          {
            type: "image",
            horizonAssetId: "795064546836933",
            path: "assets/images/cards_fire_fire-mission.png"
          }
        ]
      },
      {
        id: "fire-chest-closed",
        type: "ui",
        category: "chest",
        name: "Fire Chest Closed",
        assets: [
          {
            type: "image",
            horizonAssetId: "1168387145201364",
            path: "assets/images/chest_fire-chest-closed.png"
          }
        ]
      },
      {
        id: "fire-chest-opened",
        type: "ui",
        category: "chest",
        name: "Fire Chest Opened",
        assets: [
          {
            type: "image",
            horizonAssetId: "3716217982005558",
            path: "assets/images/chest_fire-chest-opened.png"
          }
        ]
      },
      {
        id: "fire-icon",
        type: "ui",
        category: "icon",
        name: "Fire Icon",
        assets: [
          {
            type: "image",
            horizonAssetId: "2011015256402906",
            path: "assets/images/affinity_fire-icon.png"
          }
        ]
      },
      {
        id: "fire-habitat",
        type: "ui",
        category: "card-template",
        name: "Fire Habitat Card Template",
        description: "Template overlay for fire habitat cards",
        assets: [
          {
            type: "image",
            horizonAssetId: "1762741407742835",
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
    category: "forest",
    description: "Forest affinity cards and assets",
    data: [
      {
        id: "rootling",
        type: "beast",
        cardType: "Bloom",
        affinity: "forest",
        data: {
          id: "rootling",
          name: "Rootling",
          displayName: "Rootling",
          type: "Bloom",
          affinity: "Forest",
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
          levelingConfig: {
            statGains: {
              "1": {
                hp: 0,
                atk: 0
              },
              "2": {
                hp: 1,
                atk: 0
              },
              "3": {
                hp: 2,
                atk: 1
              },
              "4": {
                hp: 3,
                atk: 2
              },
              "5": {
                hp: 4,
                atk: 3
              },
              "6": {
                hp: 5,
                atk: 4
              },
              "7": {
                hp: 6,
                atk: 5
              },
              "8": {
                hp: 7,
                atk: 6
              },
              "9": {
                hp: 8,
                atk: 7
              }
            },
            abilityUpgrades: {
              "4": {
                abilities: [
                  {
                    name: "Abundant Nourish",
                    trigger: AbilityTrigger.OnDestroy,
                    effects: [
                      {
                        type: EffectType.GainResource,
                        target: AbilityTarget.PlayerGardener,
                        resource: ResourceType.Nectar,
                        value: 2
                      }
                    ]
                  }
                ]
              },
              "7": {
                abilities: [
                  {
                    name: "Ancient Roots",
                    trigger: AbilityTrigger.WhileOnField,
                    effects: [
                      {
                        type: EffectType.CannotBeTargeted,
                        target: AbilityTarget.Self,
                        by: [
                          "magic",
                          "trap"
                        ]
                      }
                    ]
                  }
                ]
              },
              "9": {
                abilities: [
                  {
                    name: "Eternal Roots",
                    trigger: AbilityTrigger.WhileOnField,
                    effects: [
                      {
                        type: EffectType.CannotBeTargeted,
                        target: AbilityTarget.Self,
                        by: [
                          "magic",
                          "trap",
                          "abilities"
                        ]
                      }
                    ]
                  },
                  {
                    name: "Harvest Feast",
                    trigger: AbilityTrigger.OnDestroy,
                    effects: [
                      {
                        type: EffectType.GainResource,
                        target: AbilityTarget.PlayerGardener,
                        resource: ResourceType.Nectar,
                        value: 2
                      },
                      {
                        type: EffectType.DrawCards,
                        target: AbilityTarget.PlayerGardener,
                        value: 1
                      }
                    ]
                  }
                ]
              }
            }
          }
        },
        assets: [
          {
            type: "image",
            horizonAssetId: "1170317305016635",
            path: "assets/images/cards_forest_rootling.png",
            description: "Rootling card artwork"
          }
        ]
      },
      {
        id: "leaf-sprite",
        type: "beast",
        cardType: "Bloom",
        affinity: "forest",
        data: {
          id: "leaf-sprite",
          name: "Leaf Sprite",
          displayName: "Leaf Sprite",
          type: "Bloom",
          affinity: "Forest",
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
                  target: AbilityTarget.PlayerGardener,
                  value: 1
                }
              ]
            }
          ],
          levelingConfig: {
            statGains: {
              "1": {
                hp: 0,
                atk: 0
              },
              "2": {
                hp: 0,
                atk: 1
              },
              "3": {
                hp: 1,
                atk: 1
              },
              "4": {
                hp: 1,
                atk: 2
              },
              "5": {
                hp: 2,
                atk: 3
              },
              "6": {
                hp: 3,
                atk: 4
              },
              "7": {
                hp: 4,
                atk: 5
              },
              "8": {
                hp: 5,
                atk: 6
              },
              "9": {
                hp: 6,
                atk: 7
              }
            },
            abilityUpgrades: {
              "4": {
                abilities: [
                  {
                    name: "Swiftness",
                    trigger: AbilityTrigger.OnSummon,
                    effects: [
                      {
                        type: EffectType.DrawCards,
                        target: AbilityTarget.PlayerGardener,
                        value: 2
                      }
                    ]
                  }
                ]
              },
              "7": {
                abilities: [
                  {
                    name: "Evasive",
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
                ]
              },
              "9": {
                abilities: [
                  {
                    name: "Sprint",
                    trigger: AbilityTrigger.OnSummon,
                    effects: [
                      {
                        type: EffectType.RemoveSummoningSickness,
                        target: AbilityTarget.Self
                      }
                    ]
                  }
                ]
              }
            }
          }
        },
        assets: [
          {
            type: "image",
            horizonAssetId: "1733091247346351",
            path: "assets/images/cards_forest_leaf-sprite.png",
            description: "Leaf Sprite card artwork"
          }
        ]
      },
      {
        id: "mosslet",
        type: "beast",
        cardType: "Bloom",
        affinity: "forest",
        data: {
          id: "mosslet",
          name: "Mosslet",
          displayName: "Mosslet",
          type: "Bloom",
          affinity: "Forest",
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
          levelingConfig: {
            statGains: {
              "1": {
                hp: 0,
                atk: 0
              },
              "2": {
                hp: 1,
                atk: 0
              },
              "3": {
                hp: 1,
                atk: 1
              },
              "4": {
                hp: 2,
                atk: 2
              },
              "5": {
                hp: 3,
                atk: 3
              },
              "6": {
                hp: 4,
                atk: 4
              },
              "7": {
                hp: 5,
                atk: 5
              },
              "8": {
                hp: 6,
                atk: 6
              },
              "9": {
                hp: 7,
                atk: 7
              }
            },
            abilityUpgrades: {
              "4": {
                abilities: [
                  {
                    name: "Rapid Growth",
                    trigger: AbilityTrigger.OnOwnEndOfTurn,
                    effects: [
                      {
                        type: EffectType.ModifyStats,
                        target: AbilityTarget.Self,
                        stat: StatType.Both,
                        value: 2,
                        duration: EffectDuration.Permanent
                      }
                    ]
                  }
                ]
              },
              "7": {
                abilities: [
                  {
                    name: "Mossy Armor",
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
                ]
              },
              "9": {
                abilities: [
                  {
                    name: "Overgrowth",
                    trigger: AbilityTrigger.OnOwnEndOfTurn,
                    effects: [
                      {
                        type: EffectType.ModifyStats,
                        target: AbilityTarget.Self,
                        stat: StatType.Both,
                        value: 3,
                        duration: EffectDuration.Permanent
                      }
                    ]
                  }
                ]
              }
            }
          }
        },
        assets: [
          {
            type: "image",
            horizonAssetId: "1344114090714721",
            path: "assets/images/cards_forest_mosslet.png",
            description: "Mosslet card artwork"
          }
        ]
      },
      {
        id: "mushroomancer",
        type: "beast",
        cardType: "Bloom",
        affinity: "forest",
        data: {
          id: "mushroomancer",
          name: "Mushroomancer",
          displayName: "Mushroomancer",
          type: "Bloom",
          affinity: "Forest",
          cost: 3,
          baseAttack: 3,
          baseHealth: 4,
          abilities: [
            {
              name: "Sporogenesis",
              trigger: AbilityTrigger.OnSummon,
              effects: [
                {
                  type: EffectType.ApplyCounter,
                  target: AbilityTarget.AllEnemies,
                  counter: "Spore",
                  value: 2
                }
              ]
            }
          ],
          levelingConfig: {
            statGains: {
              "1": {
                hp: 0,
                atk: 0
              },
              "2": {
                hp: 1,
                atk: 0
              },
              "3": {
                hp: 2,
                atk: 1
              },
              "4": {
                hp: 3,
                atk: 2
              },
              "5": {
                hp: 4,
                atk: 3
              },
              "6": {
                hp: 5,
                atk: 4
              },
              "7": {
                hp: 6,
                atk: 5
              },
              "8": {
                hp: 7,
                atk: 6
              },
              "9": {
                hp: 8,
                atk: 7
              }
            },
            abilityUpgrades: {
              "4": {
                abilities: [
                  {
                    name: "Virulent Spores",
                    trigger: AbilityTrigger.OnSummon,
                    effects: [
                      {
                        type: EffectType.ApplyCounter,
                        target: AbilityTarget.AllEnemies,
                        counter: "Spore",
                        value: 3
                      }
                    ]
                  }
                ]
              },
              "7": {
                abilities: [
                  {
                    name: "Spore Burst",
                    trigger: AbilityTrigger.OnDestroy,
                    effects: [
                      {
                        type: EffectType.ApplyCounter,
                        target: AbilityTarget.AllEnemies,
                        counter: "Spore",
                        value: 2
                      }
                    ]
                  }
                ]
              },
              "9": {
                abilities: [
                  {
                    name: "Fungal Network",
                    trigger: AbilityTrigger.OnOwnEndOfTurn,
                    effects: [
                      {
                        type: EffectType.DealDamage,
                        target: AbilityTarget.AllEnemies,
                        value: 1,
                        condition: {
                          type: ConditionType.HasCounter,
                          value: "Spore"
                        }
                      }
                    ]
                  }
                ]
              }
            }
          }
        },
        assets: [
          {
            type: "image",
            horizonAssetId: "1393693032328550",
            path: "assets/images/cards_forest_mushroomancer.png",
            description: "Mushroomancer card artwork"
          }
        ]
      },
      {
        id: "ancient-forest",
        type: "habitat",
        affinity: "forest",
        data: {
          id: "ancient-forest",
          name: "Ancient Forest",
          displayName: "Ancient Forest",
          type: "Habitat",
          affinity: "Forest",
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
            type: "image",
            horizonAssetId: "1625867191715184",
            path: "assets/images/cards_forest_ancient-forest.png",
            description: "Ancient Forest habitat card artwork"
          },
          {
            type: "image",
            horizonAssetId: "787776974149741",
            path: "assets/images/cards_forest_habitat-card.png",
            description: "Forest habitat card template"
          },
          {
            type: "image",
            horizonAssetId: "805969505504149",
            path: "assets/images/cards_forest_habitat-card-playboard.png",
            description: "Forest habitat card playboard"
          }
        ]
      },
      {
        id: "forest-mission",
        type: "mission",
        affinity: "forest",
        missionNumber: 2,
        name: "Forest Mission",
        description: "Forest affinity mission",
        assets: [
          {
            type: "image",
            horizonAssetId: "1351984712974001",
            path: "assets/images/cards_forest_forest-mission.png",
            description: "Forest mission card"
          }
        ]
      },
      {
        id: "forest-chest-closed",
        type: "ui",
        category: "chest",
        name: "Forest Chest Closed",
        description: "Forest chest in closed state",
        assets: [
          {
            type: "image",
            horizonAssetId: "678586941962889",
            path: "assets/images/chest_forest-chest-closed.png"
          }
        ]
      },
      {
        id: "forest-chest-opened",
        type: "ui",
        category: "chest",
        name: "Forest Chest Opened",
        description: "Forest chest in opened state",
        assets: [
          {
            type: "image",
            horizonAssetId: "1859963367965524",
            path: "assets/images/chest_forest-chest-opened.png"
          }
        ]
      },
      {
        id: "forest-icon",
        type: "ui",
        category: "icon",
        name: "Forest Icon",
        description: "Forest affinity icon",
        assets: [
          {
            type: "image",
            horizonAssetId: "1869425844004279",
            path: "assets/images/affinity_forest-icon.png"
          }
        ]
      },
      {
        id: "forest-habitat",
        type: "ui",
        category: "card-template",
        name: "Forest Habitat Card Template",
        description: "Template overlay for forest habitat cards",
        assets: [
          {
            type: "image",
            horizonAssetId: "787776974149741",
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
    category: "magic",
    description: "Magic cards and assets",
    data: [
      {
        id: "aether-swap",
        type: "magic",
        cardType: "Magic",
        data: {
          id: "aether-swap",
          name: "Aether Swap",
          type: "Magic",
          cost: 1,
          targetRequired: true,
          abilities: [
            {
              name: "Aether Swap",
              trigger: AbilityTrigger.OnSummon,
              effects: [
                {
                  type: EffectType.SwapPositions,
                  target: AbilityTarget.Target
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: "image",
            horizonAssetId: "1846483789630405",
            path: "assets/images/cards_magic_aether-swap.png"
          }
        ]
      },
      {
        id: "cleansing-downpour",
        type: "magic",
        cardType: "Magic",
        data: {
          id: "cleansing-downpour",
          name: "Cleansing Downpour",
          type: "Magic",
          cost: 2,
          targetRequired: false,
          abilities: [
            {
              name: "Cleansing Downpour",
              trigger: AbilityTrigger.OnSummon,
              effects: [
                {
                  type: EffectType.RemoveCounter,
                  target: "AllUnits"
                },
                {
                  type: EffectType.DrawCards,
                  target: "PlayerGardener",
                  value: 1
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: "image",
            horizonAssetId: "710755475386192",
            path: "assets/images/cards_magic_cleansing-downpour.png"
          }
        ]
      },
      {
        id: "elemental-burst",
        type: "magic",
        cardType: "Magic",
        data: {
          id: "elemental-burst",
          name: "Elemental Burst",
          type: "Magic",
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
            type: "image",
            horizonAssetId: "1585232092889726",
            path: "assets/images/cards_magic_elemental-burst.png"
          }
        ]
      },
      {
        id: "lightning-strike",
        type: "magic",
        cardType: "Magic",
        data: {
          id: "lightning-strike",
          name: "Lightning Strike",
          type: "Magic",
          cost: 2,
          targetRequired: true,
          abilities: [
            {
              name: "Lightning Strike",
              trigger: AbilityTrigger.OnSummon,
              effects: [
                {
                  type: EffectType.DealDamage,
                  target: AbilityTarget.Target,
                  value: 5,
                  piercing: true
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: "image",
            horizonAssetId: "1155953239812167",
            path: "assets/images/cards_magic_lightning-strike.png"
          }
        ]
      },
      {
        id: "nectar-block",
        type: "magic",
        cardType: "Magic",
        data: {
          id: "nectar-block",
          name: "Nectar Block",
          type: "Magic",
          cost: 0,
          targetRequired: false,
          abilities: [
            {
              name: "Nectar Block",
              trigger: AbilityTrigger.OnSummon,
              effects: [
                {
                  type: "GainResource",
                  target: "PlayerGardener",
                  resource: "Nectar",
                  value: 2,
                  duration: "ThisTurn"
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: "image",
            horizonAssetId: "1092559439363693",
            path: "assets/images/cards_magic_nectar-block.png"
          }
        ]
      },
      {
        id: "nectar-drain",
        type: "magic",
        cardType: "Magic",
        data: {
          id: "nectar-drain",
          name: "Nectar Drain",
          type: "Magic",
          cost: 1,
          targetRequired: false,
          abilities: [
            {
              name: "Nectar Drain",
              trigger: AbilityTrigger.OnSummon,
              effects: [
                {
                  type: "GainResource",
                  target: "PlayerGardener",
                  resource: "Nectar",
                  value: 2,
                  duration: "ThisTurn"
                },
                {
                  type: EffectType.DrawCards,
                  target: "PlayerGardener",
                  value: 1
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: "image",
            horizonAssetId: "1754732031852523",
            path: "assets/images/cards_magic_nectar-drain.png"
          }
        ]
      },
      {
        id: "nectar-surge",
        type: "magic",
        cardType: "Magic",
        data: {
          id: "nectar-surge",
          name: "Nectar Surge",
          type: "Magic",
          cost: 1,
          targetRequired: false,
          abilities: [
            {
              name: "Nectar Surge",
              trigger: AbilityTrigger.OnSummon,
              effects: [
                {
                  type: "GainResource",
                  target: "PlayerGardener",
                  resource: "Nectar",
                  value: 3,
                  duration: "ThisTurn"
                },
                {
                  type: EffectType.DrawCards,
                  target: "PlayerGardener",
                  value: 1
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: "image",
            horizonAssetId: "1379310950488534",
            path: "assets/images/cards_magic_nectar-surge.png"
          }
        ]
      },
      {
        id: "overgrowth",
        type: "magic",
        cardType: "Magic",
        data: {
          id: "overgrowth",
          name: "Overgrowth",
          type: "Magic",
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
            type: "image",
            horizonAssetId: "1489977038895297",
            path: "assets/images/cards_magic_overgrowth.png"
          }
        ]
      },
      {
        id: "power-up",
        type: "magic",
        cardType: "Magic",
        data: {
          id: "power-up",
          name: "Power Up",
          type: "Magic",
          cost: 2,
          targetRequired: true,
          abilities: [
            {
              name: "Power Up",
              trigger: AbilityTrigger.OnSummon,
              effects: [
                {
                  type: EffectType.ModifyStats,
                  target: AbilityTarget.Target,
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
            type: "image",
            horizonAssetId: "1140750044697552",
            path: "assets/images/cards_magic_power-up.png"
          }
        ]
      },
      {
        id: "purify",
        type: "magic",
        cardType: "Magic",
        data: {
          id: "purify",
          name: "Purify",
          type: "Magic",
          cost: 1,
          targetRequired: true,
          abilities: [
            {
              name: "Purify",
              trigger: AbilityTrigger.OnSummon,
              effects: [
                {
                  type: EffectType.RemoveCounter,
                  target: AbilityTarget.Target
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: "image",
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
    category: "sky",
    description: "Sky affinity cards and assets",
    data: [
      {
        id: "aero-moth",
        type: "beast",
        cardType: "Bloom",
        affinity: "sky",
        data: {
          id: "aero-moth",
          name: "Aero Moth",
          type: "Bloom",
          affinity: "Sky",
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
                  target: AbilityTarget.PlayerGardener,
                  value: 1
                }
              ]
            }
          ],
          levelingConfig: {
            statGains: {
              "1": {
                hp: 0,
                atk: 0
              },
              "2": {
                hp: 1,
                atk: 1
              },
              "3": {
                hp: 2,
                atk: 2
              },
              "4": {
                hp: 3,
                atk: 3
              },
              "5": {
                hp: 4,
                atk: 4
              },
              "6": {
                hp: 5,
                atk: 5
              },
              "7": {
                hp: 6,
                atk: 6
              },
              "8": {
                hp: 7,
                atk: 7
              },
              "9": {
                hp: 8,
                atk: 8
              }
            },
            abilityUpgrades: {
              "4": {
                abilities: [
                  {
                    name: "Hypnotic Wings",
                    trigger: AbilityTrigger.OnSummon,
                    effects: [
                      {
                        type: EffectType.DrawCards,
                        target: AbilityTarget.PlayerGardener,
                        value: 2
                      }
                    ]
                  }
                ]
              },
              "7": {
                abilities: [
                  {
                    name: "Hypnotic Wings",
                    trigger: AbilityTrigger.OnSummon,
                    effects: [
                      {
                        type: EffectType.DrawCards,
                        target: AbilityTarget.PlayerGardener,
                        value: 2
                      }
                    ]
                  },
                  {
                    name: "Cyclone",
                    trigger: AbilityTrigger.OnAttack,
                    effects: [
                      {
                        type: "SwapPositions",
                        target: AbilityTarget.AllEnemies
                      }
                    ]
                  }
                ]
              },
              "9": {
                abilities: [
                  {
                    name: "Rainbow Cascade",
                    trigger: AbilityTrigger.OnSummon,
                    effects: [
                      {
                        type: EffectType.DrawCards,
                        target: AbilityTarget.PlayerGardener,
                        value: 3
                      },
                      {
                        type: EffectType.ModifyStats,
                        target: AbilityTarget.AllAllies,
                        stat: StatType.Attack,
                        value: 1,
                        duration: EffectDuration.Permanent
                      },
                      {
                        type: EffectType.ModifyStats,
                        target: AbilityTarget.AllAllies,
                        stat: StatType.Health,
                        value: 1,
                        duration: EffectDuration.Permanent
                      }
                    ]
                  },
                  {
                    name: "Chaos Storm",
                    trigger: AbilityTrigger.OnAttack,
                    effects: [
                      {
                        type: "SwapPositions",
                        target: AbilityTarget.AllEnemies
                      },
                      {
                        type: EffectType.ReturnToHand,
                        target: AbilityTarget.RandomEnemy,
                        value: 1
                      },
                      {
                        type: EffectType.DrawCards,
                        target: AbilityTarget.PlayerGardener,
                        value: 2
                      }
                    ]
                  }
                ]
              }
            }
          }
        },
        assets: [
          {
            type: "image",
            horizonAssetId: "1857788838498496",
            path: "assets/images/cards_sky_aero-moth.png"
          }
        ]
      },
      {
        id: "cirrus-floof",
        type: "beast",
        cardType: "Bloom",
        affinity: "sky",
        data: {
          id: "cirrus-floof",
          name: "Cirrus Floof",
          type: "Bloom",
          affinity: "Sky",
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
          levelingConfig: {
            statGains: {
              "1": {
                hp: 0,
                atk: 0
              },
              "2": {
                hp: 3,
                atk: 0
              },
              "3": {
                hp: 5,
                atk: 0
              },
              "4": {
                hp: 7,
                atk: 1
              },
              "5": {
                hp: 10,
                atk: 1
              },
              "6": {
                hp: 12,
                atk: 2
              },
              "7": {
                hp: 14,
                atk: 3
              },
              "8": {
                hp: 17,
                atk: 3
              },
              "9": {
                hp: 20,
                atk: 4
              }
            },
            abilityUpgrades: {
              "4": {
                abilities: [
                  {
                    name: "Storm Shield",
                    trigger: AbilityTrigger.OnOwnStartOfTurn,
                    effects: [
                      {
                        type: "TemporaryHP",
                        target: AbilityTarget.AllAllies,
                        value: 2
                      }
                    ]
                  }
                ]
              },
              "7": {
                abilities: [
                  {
                    name: "Ethereal Form",
                    trigger: AbilityTrigger.WhileOnField,
                    effects: [
                      {
                        type: EffectType.CannotBeTargeted,
                        target: AbilityTarget.Self,
                        by: [
                          "attacks"
                        ]
                      }
                    ]
                  }
                ]
              },
              "9": {
                abilities: [
                  {
                    name: "Celestial Protector",
                    trigger: AbilityTrigger.WhileOnField,
                    effects: [
                      {
                        type: EffectType.CannotBeTargeted,
                        target: AbilityTarget.Self,
                        by: [
                          "all"
                        ]
                      },
                      {
                        type: EffectType.DamageReduction,
                        target: AbilityTarget.AllAllies,
                        value: 1,
                        duration: EffectDuration.WhileOnField
                      }
                    ]
                  },
                  {
                    name: "Divine Barrier",
                    trigger: AbilityTrigger.OnOwnStartOfTurn,
                    effects: [
                      {
                        type: "TemporaryHP",
                        target: AbilityTarget.AllAllies,
                        value: 3
                      },
                      {
                        type: "Immunity",
                        target: AbilityTarget.AllAllies,
                        immuneTo: [
                          "NegativeEffects"
                        ],
                        duration: EffectDuration.ThisTurn
                      }
                    ]
                  }
                ]
              }
            }
          }
        },
        assets: [
          {
            type: "image",
            horizonAssetId: "849446287592530",
            path: "assets/images/cards_sky_cirrus-floof.png"
          }
        ]
      },
      {
        id: "gale-glider",
        type: "beast",
        cardType: "Bloom",
        affinity: "sky",
        data: {
          id: "gale-glider",
          name: "Gale Glider",
          type: "Bloom",
          affinity: "Sky",
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
          levelingConfig: {
            statGains: {
              "1": {
                hp: 0,
                atk: 0
              },
              "2": {
                hp: 0,
                atk: 2
              },
              "3": {
                hp: 0,
                atk: 3
              },
              "4": {
                hp: 1,
                atk: 5
              },
              "5": {
                hp: 1,
                atk: 7
              },
              "6": {
                hp: 2,
                atk: 9
              },
              "7": {
                hp: 2,
                atk: 10
              },
              "8": {
                hp: 3,
                atk: 12
              },
              "9": {
                hp: 3,
                atk: 14
              }
            },
            abilityUpgrades: {
              "4": {
                abilities: [
                  {
                    name: "Wind Dance",
                    trigger: AbilityTrigger.OnAttack,
                    effects: [
                      {
                        type: "MoveUnit",
                        target: AbilityTarget.Self,
                        destination: "any-slot"
                      }
                    ]
                  }
                ]
              },
              "7": {
                abilities: [
                  {
                    name: "Storm Blade",
                    trigger: AbilityTrigger.WhileOnField,
                    effects: [
                      {
                        type: EffectType.AttackModification,
                        target: AbilityTarget.Self,
                        modification: "attack-first"
                      },
                      {
                        type: EffectType.ModifyStats,
                        target: AbilityTarget.Self,
                        stat: StatType.Attack,
                        value: 2,
                        duration: "NextAttack"
                      }
                    ]
                  }
                ]
              },
              "9": {
                abilities: [
                  {
                    name: "Tempest Strike",
                    trigger: AbilityTrigger.WhileOnField,
                    effects: [
                      {
                        type: EffectType.AttackModification,
                        target: AbilityTarget.Self,
                        modification: "attack-first"
                      },
                      {
                        type: EffectType.AttackModification,
                        target: AbilityTarget.Self,
                        modification: "triple-damage"
                      },
                      {
                        type: EffectType.AttackModification,
                        target: AbilityTarget.Self,
                        modification: "cannot-counterattack"
                      }
                    ]
                  },
                  {
                    name: "Hurricane Assault",
                    trigger: AbilityTrigger.OnAttack,
                    effects: [
                      {
                        type: EffectType.AttackModification,
                        target: AbilityTarget.Self,
                        modification: "attack-twice"
                      },
                      {
                        type: "MoveUnit",
                        target: AbilityTarget.Self,
                        destination: "any-slot"
                      }
                    ]
                  }
                ]
              }
            }
          }
        },
        assets: [
          {
            type: "image",
            horizonAssetId: "1854780382097596",
            path: "assets/images/cards_sky_gale-glider.png"
          }
        ]
      },
      {
        id: "star-bloom",
        type: "beast",
        cardType: "Bloom",
        affinity: "sky",
        data: {
          id: "star-bloom",
          name: "Star Bloom",
          type: "Bloom",
          affinity: "Sky",
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
          levelingConfig: {
            statGains: {
              "1": {
                hp: 0,
                atk: 0
              },
              "2": {
                hp: 1,
                atk: 1
              },
              "3": {
                hp: 2,
                atk: 2
              },
              "4": {
                hp: 4,
                atk: 3
              },
              "5": {
                hp: 6,
                atk: 4
              },
              "6": {
                hp: 8,
                atk: 5
              },
              "7": {
                hp: 10,
                atk: 6
              },
              "8": {
                hp: 12,
                atk: 7
              },
              "9": {
                hp: 14,
                atk: 9
              }
            },
            abilityUpgrades: {
              "4": {
                abilities: [
                  {
                    name: "Radiant Aura",
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
              "9": {
                abilities: [
                  {
                    name: "Astral Dominance",
                    trigger: AbilityTrigger.WhileOnField,
                    effects: [
                      {
                        type: EffectType.ModifyStats,
                        target: AbilityTarget.AllAllies,
                        stat: StatType.Attack,
                        value: 3,
                        duration: EffectDuration.WhileOnField
                      },
                      {
                        type: EffectType.ModifyStats,
                        target: AbilityTarget.AllAllies,
                        stat: StatType.Health,
                        value: 2,
                        duration: EffectDuration.WhileOnField
                      }
                    ]
                  },
                  {
                    name: "Universal Harmony",
                    trigger: AbilityTrigger.OnSummon,
                    effects: [
                      {
                        type: EffectType.DrawCards,
                        target: AbilityTarget.PlayerGardener,
                        value: 3
                      },
                      {
                        type: EffectType.ModifyStats,
                        target: AbilityTarget.AllAllies,
                        stat: StatType.Attack,
                        value: 2,
                        duration: EffectDuration.Permanent
                      },
                      {
                        type: EffectType.ModifyStats,
                        target: AbilityTarget.AllAllies,
                        stat: StatType.Health,
                        value: 2,
                        duration: EffectDuration.Permanent
                      }
                    ]
                  }
                ]
              }
            }
          }
        },
        assets: [
          {
            type: "image",
            horizonAssetId: "737222956003560",
            path: "assets/images/cards_sky_star-bloom.png"
          }
        ]
      },
      {
        id: "clear-zenith",
        type: "habitat",
        affinity: "sky",
        data: {
          id: "clear-zenith",
          name: "Clear Zenith",
          type: "Habitat",
          affinity: "Sky",
          cost: 1,
          titleColor: "#000000",
          abilities: [
            {
              name: "Sky Vision",
              trigger: AbilityTrigger.OnSummon,
              effects: [
                {
                  type: EffectType.DrawCards,
                  target: AbilityTarget.PlayerGardener,
                  value: 1
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: "image",
            horizonAssetId: "1941325056416004",
            path: "assets/images/cards_sky_clear-zenith.png"
          },
          {
            type: "image",
            horizonAssetId: "1140855177628973",
            path: "assets/images/cards_sky_habitat-card.png"
          },
          {
            type: "image",
            horizonAssetId: "674037762415336",
            path: "assets/images/cards_sky_habitat-card-playboard.png"
          }
        ]
      },
      {
        id: "sky-mission",
        type: "mission",
        affinity: "sky",
        missionNumber: 4,
        name: "Sky Mission",
        description: "Sky affinity mission",
        assets: [
          {
            type: "image",
            horizonAssetId: "1076415204381099",
            path: "assets/images/cards_sky_sky-mission.png"
          }
        ]
      },
      {
        id: "sky-chest-closed",
        type: "ui",
        category: "chest",
        name: "Sky Chest Closed",
        assets: [
          {
            type: "image",
            horizonAssetId: "1988442925266143",
            path: "assets/images/chest_sky-chest-closed.png"
          }
        ]
      },
      {
        id: "sky-chest-opened",
        type: "ui",
        category: "chest",
        name: "Sky Chest Opened",
        assets: [
          {
            type: "image",
            horizonAssetId: "766596743048030",
            path: "assets/images/chest_sky-chest-opened.png"
          }
        ]
      },
      {
        id: "sky-icon",
        type: "ui",
        category: "icon",
        name: "Sky Icon",
        assets: [
          {
            type: "image",
            horizonAssetId: "2078365889573892",
            path: "assets/images/affinity_sky-icon.png"
          }
        ]
      },
      {
        id: "sky-habitat",
        type: "ui",
        category: "card-template",
        name: "Sky Habitat Card Template",
        description: "Template overlay for sky habitat cards",
        assets: [
          {
            type: "image",
            horizonAssetId: "1140855177628973",
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
    category: "trap",
    description: "Trap cards and assets",
    data: [
      {
        id: "bear-trap",
        type: "trap",
        cardType: "Trap",
        data: {
          id: "bear-trap",
          name: "Bear Trap",
          type: "Trap",
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
            type: "image",
            horizonAssetId: "1518992622460625",
            path: "assets/images/cards_trap_bear-trap.png"
          }
        ]
      },
      {
        id: "emergency-bloom",
        type: "trap",
        cardType: "Trap",
        data: {
          id: "emergency-bloom",
          name: "Emergency Bloom",
          type: "Trap",
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
                  target: AbilityTarget.PlayerGardener,
                  value: 2
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: "image",
            horizonAssetId: "2247657455738264",
            path: "assets/images/cards_trap_emergency-bloom.png"
          }
        ]
      },
      {
        id: "habitat-lock",
        type: "trap",
        cardType: "Trap",
        data: {
          id: "habitat-lock",
          name: "Habitat Lock",
          type: "Trap",
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
                  target: AbilityTarget.Target
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: "image",
            horizonAssetId: "609610328807674",
            path: "assets/images/cards_trap_habitat-lock.png"
          }
        ]
      },
      {
        id: "habitat-shield",
        type: "trap",
        cardType: "Trap",
        data: {
          id: "habitat-shield",
          name: "Habitat Shield",
          type: "Trap",
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
                  target: AbilityTarget.Target
                },
                {
                  type: EffectType.DrawCards,
                  target: AbilityTarget.PlayerGardener,
                  value: 1
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: "image",
            horizonAssetId: "1362245262078336",
            path: "assets/images/cards_trap_habitat-shield.png"
          }
        ]
      },
      {
        id: "magic-shield",
        type: "trap",
        cardType: "Trap",
        data: {
          id: "magic-shield",
          name: "Magic Shield",
          type: "Trap",
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
                  target: AbilityTarget.Target
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: "image",
            horizonAssetId: "1239098601311749",
            path: "assets/images/cards_trap_magic-sheild.png"
          }
        ]
      },
      {
        id: "thorn-snare",
        type: "trap",
        cardType: "Trap",
        data: {
          id: "thorn-snare",
          name: "Thorn Snare",
          type: "Trap",
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
            type: "image",
            horizonAssetId: "4210265565909373",
            path: "assets/images/cards_trap_thorn-snare.png"
          }
        ]
      },
      {
        id: "vaporize",
        type: "trap",
        cardType: "Trap",
        data: {
          id: "vaporize",
          name: "Vaporize",
          type: "Trap",
          cost: 2,
          activation: {
            trigger: TrapTrigger.OnBloomPlay,
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
                  target: AbilityTarget.Target
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: "image",
            horizonAssetId: "1903759173890506",
            path: "assets/images/cards_trap_vaporize.png"
          }
        ]
      },
      {
        id: "xp-harvest",
        type: "trap",
        cardType: "Trap",
        data: {
          id: "xp-harvest",
          name: "XP Harvest",
          type: "Trap",
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
                  type: EffectType.RemoveCounter,
                  target: AbilityTarget.Attacker,
                  counter: "XP"
                }
              ]
            }
          ]
        },
        assets: [
          {
            type: "image",
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
    category: "water",
    description: "Water affinity cards and assets",
    data: [
      {
        id: "aqua-pebble",
        type: "beast",
        cardType: "Bloom",
        affinity: "water",
        data: {
          id: "aqua-pebble",
          name: "Aqua Pebble",
          type: "Bloom",
          affinity: "Water",
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
          levelingConfig: {
            statGains: {
              "1": {
                hp: 0,
                atk: 0
              },
              "2": {
                hp: 1,
                atk: 0
              },
              "3": {
                hp: 3,
                atk: 0
              },
              "4": {
                hp: 4,
                atk: 1
              },
              "5": {
                hp: 6,
                atk: 2
              },
              "6": {
                hp: 7,
                atk: 3
              },
              "7": {
                hp: 9,
                atk: 4
              },
              "8": {
                hp: 10,
                atk: 5
              },
              "9": {
                hp: 12,
                atk: 6
              }
            },
            abilityUpgrades: {
              "4": {
                abilities: [
                  {
                    name: "Tidal Surge",
                    trigger: "OnAllySummon",
                    effects: [
                      {
                        type: EffectType.ModifyStats,
                        target: AbilityTarget.Self,
                        stat: StatType.Attack,
                        value: 2,
                        duration: EffectDuration.EndOfTurn,
                        condition: {
                          type: "AffinityMatches",
                          value: "Water"
                        }
                      }
                    ]
                  }
                ]
              },
              "7": {
                abilities: [
                  {
                    name: "Rejuvenation",
                    trigger: AbilityTrigger.OnOwnEndOfTurn,
                    effects: [
                      {
                        type: EffectType.Heal,
                        target: AbilityTarget.AllAllies,
                        value: 2
                      }
                    ]
                  }
                ]
              },
              "9": {
                abilities: [
                  {
                    name: "Tsunami Force",
                    trigger: "OnAllySummon",
                    effects: [
                      {
                        type: EffectType.ModifyStats,
                        target: AbilityTarget.Self,
                        stat: StatType.Attack,
                        value: 3,
                        duration: EffectDuration.Permanent,
                        condition: {
                          type: "AffinityMatches",
                          value: "Water"
                        }
                      }
                    ]
                  },
                  {
                    name: "Fountain of Life",
                    trigger: AbilityTrigger.OnOwnEndOfTurn,
                    effects: [
                      {
                        type: EffectType.Heal,
                        target: AbilityTarget.AllAllies,
                        value: "Full"
                      }
                    ]
                  }
                ]
              }
            }
          }
        },
        assets: [
          {
            type: "image",
            horizonAssetId: "2542562209453452",
            path: "assets/images/cards_water_aqua-pebble.png"
          }
        ]
      },
      {
        id: "bubblefin",
        type: "beast",
        cardType: "Bloom",
        affinity: "water",
        data: {
          id: "bubblefin",
          name: "Bubblefin",
          type: "Bloom",
          affinity: "Water",
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
          levelingConfig: {
            statGains: {
              "1": {
                hp: 0,
                atk: 0
              },
              "2": {
                hp: 2,
                atk: 0
              },
              "3": {
                hp: 4,
                atk: 0
              },
              "4": {
                hp: 6,
                atk: 1
              },
              "5": {
                hp: 8,
                atk: 2
              },
              "6": {
                hp: 10,
                atk: 3
              },
              "7": {
                hp: 12,
                atk: 4
              },
              "8": {
                hp: 14,
                atk: 5
              },
              "9": {
                hp: 16,
                atk: 6
              }
            },
            abilityUpgrades: {
              "4": {
                abilities: [
                  {
                    name: "Tidal Shield",
                    trigger: AbilityTrigger.OnDamage,
                    effects: [
                      {
                        type: EffectType.ModifyStats,
                        target: AbilityTarget.Attacker,
                        stat: StatType.Attack,
                        value: -2,
                        duration: EffectDuration.EndOfTurn
                      }
                    ]
                  }
                ]
              },
              "7": {
                abilities: [
                  {
                    name: "Deep Dive",
                    trigger: AbilityTrigger.WhileOnField,
                    effects: [
                      {
                        type: EffectType.CannotBeTargeted,
                        target: AbilityTarget.Self,
                        by: [
                          "trap",
                          "magic"
                        ]
                      }
                    ]
                  }
                ]
              },
              "9": {
                abilities: [
                  {
                    name: "Ocean Sanctuary",
                    trigger: AbilityTrigger.WhileOnField,
                    effects: [
                      {
                        type: EffectType.CannotBeTargeted,
                        target: AbilityTarget.Self,
                        by: [
                          "magic",
                          "trap",
                          "abilities"
                        ]
                      }
                    ]
                  },
                  {
                    name: "Crushing Depths",
                    trigger: AbilityTrigger.OnDamage,
                    effects: [
                      {
                        type: EffectType.ModifyStats,
                        target: AbilityTarget.Attacker,
                        stat: StatType.Attack,
                        value: -3,
                        duration: EffectDuration.Permanent
                      },
                      {
                        type: EffectType.Heal,
                        target: AbilityTarget.Self,
                        value: 2
                      }
                    ]
                  }
                ]
              }
            }
          }
        },
        assets: [
          {
            type: "image",
            horizonAssetId: "2957682524429594",
            path: "assets/images/cards_water_bubblefin.png"
          }
        ]
      },
      {
        id: "dewdrop-drake",
        type: "beast",
        cardType: "Bloom",
        affinity: "water",
        data: {
          id: "dewdrop-drake",
          name: "Dewdrop Drake",
          type: "Bloom",
          affinity: "Water",
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
          levelingConfig: {
            statGains: {
              "1": {
                hp: 0,
                atk: 0
              },
              "2": {
                hp: 1,
                atk: 1
              },
              "3": {
                hp: 2,
                atk: 2
              },
              "4": {
                hp: 4,
                atk: 3
              },
              "5": {
                hp: 6,
                atk: 4
              },
              "6": {
                hp: 8,
                atk: 5
              },
              "7": {
                hp: 10,
                atk: 6
              },
              "8": {
                hp: 12,
                atk: 7
              },
              "9": {
                hp: 14,
                atk: 8
              }
            },
            abilityUpgrades: {
              "4": {
                abilities: [
                  {
                    name: "Deluge",
                    trigger: AbilityTrigger.OnAttack,
                    cost: {
                      type: ResourceType.Nectar,
                      value: 1
                    },
                    effects: [
                      {
                        type: EffectType.DealDamage,
                        target: AbilityTarget.OpponentGardener,
                        value: 3
                      }
                    ]
                  }
                ]
              },
              "7": {
                abilities: [
                  {
                    name: "Fog Veil",
                    trigger: AbilityTrigger.WhileOnField,
                    effects: [
                      {
                        type: EffectType.AttackModification,
                        target: AbilityTarget.Self,
                        modification: "attack-first"
                      },
                      {
                        type: EffectType.DamageReduction,
                        target: AbilityTarget.Self,
                        value: 1,
                        duration: EffectDuration.WhileOnField
                      }
                    ]
                  }
                ]
              },
              "9": {
                abilities: [
                  {
                    name: "Storm Guardian",
                    trigger: AbilityTrigger.WhileOnField,
                    effects: [
                      {
                        type: EffectType.AttackModification,
                        target: AbilityTarget.Self,
                        modification: "attack-first"
                      },
                      {
                        type: EffectType.DamageReduction,
                        target: AbilityTarget.Self,
                        value: 2,
                        duration: EffectDuration.WhileOnField
                      }
                    ]
                  },
                  {
                    name: "Maelstrom",
                    trigger: AbilityTrigger.OnAttack,
                    effects: [
                      {
                        type: EffectType.DealDamage,
                        target: AbilityTarget.OpponentGardener,
                        value: 5
                      },
                      {
                        type: EffectType.ApplyCounter,
                        target: AbilityTarget.RandomEnemy,
                        counter: "Freeze",
                        value: 1
                      }
                    ]
                  }
                ]
              }
            }
          }
        },
        assets: [
          {
            type: "image",
            horizonAssetId: "1232407695362881",
            path: "assets/images/cards_water_dewdrop-drake.png"
          }
        ]
      },
      {
        id: "kelp-cub",
        type: "beast",
        cardType: "Bloom",
        affinity: "water",
        data: {
          id: "kelp-cub",
          name: "Kelp Cub",
          type: "Bloom",
          affinity: "Water",
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
                  target: AbilityTarget.Target,
                  duration: "StartOfNextTurn"
                }
              ]
            }
          ],
          levelingConfig: {
            statGains: {
              "1": {
                hp: 0,
                atk: 0
              },
              "2": {
                hp: 1,
                atk: 1
              },
              "3": {
                hp: 2,
                atk: 2
              },
              "4": {
                hp: 3,
                atk: 3
              },
              "5": {
                hp: 4,
                atk: 4
              },
              "6": {
                hp: 5,
                atk: 5
              },
              "7": {
                hp: 6,
                atk: 6
              },
              "8": {
                hp: 7,
                atk: 7
              },
              "9": {
                hp: 8,
                atk: 8
              }
            },
            abilityUpgrades: {
              "4": {
                abilities: [
                  {
                    name: "Binding Vines",
                    trigger: AbilityTrigger.OnAttack,
                    effects: [
                      {
                        type: "PreventAttack",
                        target: AbilityTarget.Target,
                        duration: "StartOfNextTurn"
                      },
                      {
                        type: "PreventAbilities",
                        target: AbilityTarget.Target,
                        duration: "StartOfNextTurn"
                      }
                    ]
                  }
                ]
              },
              "7": {
                abilities: [
                  {
                    name: "Deep Anchor",
                    trigger: AbilityTrigger.WhileOnField,
                    effects: [
                      {
                        type: "Immunity",
                        target: AbilityTarget.Self,
                        immuneTo: [
                          "Magic",
                          "Trap",
                          "Abilities"
                        ],
                        duration: EffectDuration.WhileOnField
                      }
                    ]
                  }
                ]
              },
              "9": {
                abilities: [
                  {
                    name: "Strangling Grasp",
                    trigger: AbilityTrigger.OnAttack,
                    effects: [
                      {
                        type: "PreventAttack",
                        target: AbilityTarget.Target,
                        duration: EffectDuration.Permanent
                      },
                      {
                        type: "PreventAbilities",
                        target: AbilityTarget.Target,
                        duration: EffectDuration.Permanent
                      }
                    ]
                  },
                  {
                    name: "Immovable Force",
                    trigger: AbilityTrigger.WhileOnField,
                    effects: [
                      {
                        type: "Immunity",
                        target: AbilityTarget.Self,
                        immuneTo: [
                          "Damage",
                          "Targeting",
                          "NegativeEffects"
                        ],
                        duration: EffectDuration.WhileOnField
                      },
                      {
                        type: "Retaliation",
                        target: AbilityTarget.Self,
                        value: 0,
                        applyCounter: "Entangle",
                        counterValue: 1
                      }
                    ]
                  }
                ]
              }
            }
          }
        },
        assets: [
          {
            type: "image",
            horizonAssetId: "2278603722605464",
            path: "assets/images/cards_water_kelp-cub.png"
          }
        ]
      },
      {
        id: "deep-sea-grotto",
        type: "habitat",
        affinity: "water",
        data: {
          id: "deep-sea-grotto",
          name: "Deep Sea Grotto",
          type: "Habitat",
          affinity: "Water",
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
            type: "image",
            horizonAssetId: "594002380404766",
            path: "assets/images/cards_water_deep-sea-grotto.png"
          },
          {
            type: "image",
            horizonAssetId: "797144049734620",
            path: "assets/images/cards_water_habitat-card.png"
          },
          {
            type: "image",
            horizonAssetId: "805465575687502",
            path: "assets/images/cards_water_habitat-card-playboard.png"
          }
        ]
      },
      {
        id: "water-mission",
        type: "mission",
        affinity: "water",
        missionNumber: 3,
        name: "Water Mission",
        description: "Water affinity mission",
        assets: [
          {
            type: "image",
            horizonAssetId: "1204438218330106",
            path: "assets/images/cards_water_water-mission.png"
          }
        ]
      },
      {
        id: "water-chest-closed",
        type: "ui",
        category: "chest",
        name: "Water Chest Closed",
        assets: [
          {
            type: "image",
            horizonAssetId: "1502977104283894",
            path: "assets/images/chest_water-chest-closed.png"
          }
        ]
      },
      {
        id: "water-chest-opened",
        type: "ui",
        category: "chest",
        name: "Water Chest Opened",
        assets: [
          {
            type: "image",
            horizonAssetId: "817919940747617",
            path: "assets/images/chest_water-chest-opened.png"
          }
        ]
      },
      {
        id: "water-icon",
        type: "ui",
        category: "icon",
        name: "Water Icon",
        assets: [
          {
            type: "image",
            horizonAssetId: "803389222302576",
            path: "assets/images/affinity_water-icon.png"
          }
        ]
      },
      {
        id: "water-habitat",
        type: "ui",
        category: "card-template",
        name: "Water Habitat Card Template",
        description: "Template overlay for water habitat cards",
        assets: [
          {
            type: "image",
            horizonAssetId: "797144049734620",
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
