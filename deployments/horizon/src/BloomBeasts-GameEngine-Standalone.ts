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
 * Generated: 2025-10-31T18:50:54.252Z
 * Files: 104
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
    Opponent = 'opponent',                       // The opponent player
    Player = 'player',                           // The controlling player
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
   * Core type definitions for Bloom Beasts card game
   */


  export type Affinity = 'Forest' | 'Fire' | 'Water' | 'Sky' | 'Generic' | 'Boss';

  export type CardType = 'Magic' | 'Trap' | 'Bloom' | 'Habitat' | 'Buff';

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
    instanceId?: string;  // Optional instance ID for tracking unique card instances in battle
    level?: number;  // Optional runtime level for card instances (not present in card definitions)
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
  }

  /**
   * Habitat card
   */
  export interface HabitatCard extends Card {
    type: 'Habitat';
    affinity: Affinity;
    abilities: Ability[];  // Standardized to use abilities like BloomBeast cards
  }

  /**
   * Buff card - stays on board and provides ongoing effects
   */
  export interface BuffCard extends Card {
    type: 'Buff';
    affinity?: Affinity;  // Optional affinity for buff cards
    abilities: Ability[];  // Standardized to use abilities like BloomBeast cards
    duration?: number;  // Optional turn duration (undefined = permanent)
  }

  /**
   * Bloom Beast card
   *
   * All cards use standard leveling progression:
   * - Standard XP requirements (10, 20, 40, 80, 160, 320, 640, 1280)
   * - Standard stat boosts (+0-8 HP, +0-6 ATK over 9 levels)
   * - Abilities remain constant across all levels
   */
  export interface BloomBeastCard extends Card {
    type: 'Bloom';
    affinity: Affinity;
    baseAttack: number;
    baseHealth: number;
    abilities: Ability[];  // Array of passive abilities (constant across all levels)
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

    // Status effects (counters removed to reduce complexity)
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
          // Counter costs removed
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
      if (targets.length === 0 && effect.target !== AbilityTarget.Opponent && effect.target !== AbilityTarget.Player) {
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
        // Counter effects removed
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
        // Counter conditions removed
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

      // Handle damage to opponent
      if (effect.target === AbilityTarget.Opponent) {
        const damage = effect.value === 'attack-value'
          ? context.source.currentAttack
          : effect.value;
        return {
          success: true,
          message: `Dealt ${damage} damage to opponent`,
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
      if (effect.target === AbilityTarget.Opponent) {
        // Draw for opponent
        drawForPlayerIndex = context.gameState.players[0] === context.opposingPlayer ? 0 : 1;
      } else {
        // Default: Player or other - draw for controlling player
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

    // Counter processing removed to reduce game complexity

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
      }
    }

    /**
     * End a log group (simplified for basic console support)
     */
    groupEnd(): void {
      if (this.config.level <= LogLevel.INFO) {
        const formatted = this.format('GROUP', `<<<`);
      }
    }

    /**
     * Log a table (simplified for basic console support)
     * @param data Data to display as table
     */
    table(data: any): void {
      if (this.config.level <= LogLevel.INFO) {
        const formatted = this.format('TABLE', JSON.stringify(data, null, 2));
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

  // Counter limits removed

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
      source: XPSource
    ): BloomBeastInstance {
      const updatedBeast = { ...beast };
      updatedBeast.currentXP += amount;

      // Check if level up is possible
      if (this.canLevelUp(updatedBeast)) {
        return this.levelUp(updatedBeast);
      }

      return updatedBeast;
    }

    /**
     * Add XP from combat victory
     */
  addCombatXP(beast: BloomBeastInstance): BloomBeastInstance {
      return this.addXP(beast, 1, 'Combat');
    }

    /**
     * Add XP from nectar sacrifice
     */
  addNectarXP(beast: BloomBeastInstance, nectarSpent: number): BloomBeastInstance {
      const xpGained = nectarSpent / NECTAR_XP_COST;
      return this.addXP(beast, xpGained, 'NectarSacrifice');
    }

    /**
     * Get XP requirement for a specific level (uses standard progression)
     */
    private getXPRequirementForLevel(level: Level): number {
      return XP_REQUIREMENTS[level];
    }

    /**
     * Check if a beast can level up
     */
  canLevelUp(beast: BloomBeastInstance): boolean {
      if (beast.currentLevel >= MAX_LEVEL) {
        return false;
      }

      const nextLevel = (beast.currentLevel + 1) as Level;
      const xpRequired = this.getXPRequirementForLevel(nextLevel);

      return beast.currentXP >= xpRequired;
    }

    /**
     * Level up a beast
     */
  levelUp(beast: BloomBeastInstance): BloomBeastInstance {
      if (!this.canLevelUp(beast)) {
        return beast;
      }

      const updatedBeast = { ...beast };
      const nextLevel = (updatedBeast.currentLevel + 1) as Level;
      const xpRequired = this.getXPRequirementForLevel(nextLevel);

      // Remove XP counters and increase level
      updatedBeast.currentXP -= xpRequired;
      updatedBeast.currentLevel = nextLevel;

      // Apply stat gains
      const statGain = this.getStatGain(updatedBeast.currentLevel);
      updatedBeast.currentAttack += statGain.attackGain;
      updatedBeast.currentHealth += statGain.healthGain;
      updatedBeast.maxHealth += statGain.healthGain;

      // Check for level up again (in case there's excess XP)
      if (this.canLevelUp(updatedBeast)) {
        return this.levelUp(updatedBeast);
      }

      return updatedBeast;
    }

    /**
     * Get stat gains for leveling from previous level to current level (uses standard progression)
     */
  getStatGain(
      newLevel: Level
    ): { attackGain: number; healthGain: number } {
      const previousLevel = (newLevel - 1) as Level;

      // Use standard progression
      const currentStats = STAT_PROGRESSION[newLevel];
      const previousStats = STAT_PROGRESSION[previousLevel];

      return {
        attackGain: currentStats.cumulativeATK - previousStats.cumulativeATK,
        healthGain: currentStats.cumulativeHP - previousStats.cumulativeHP,
      };
    }

    /**
     * Get total stat bonus at a given level (uses standard progression)
     */
  getTotalStatBonus(level: Level): { hp: number; atk: number } {
      // Use standard progression
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
      const bonus = this.getTotalStatBonus(level);
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
        statusEffects: [],
        slotIndex,
        summoningSickness: true,
      };
    }

    /**
     * Get XP requirement for next level
     */
  getXPRequirement(currentLevel: Level): number | null {
      if (currentLevel >= MAX_LEVEL) {
        return null;
      }

      const nextLevel = (currentLevel + 1) as Level;
      return this.getXPRequirementForLevel(nextLevel);
    }

    /**
     * Get current abilities for a beast (always returns base abilities - no level-based changes)
     */
  getCurrentAbilities(card: BloomBeastCard, level: Level) {
      // Cards keep their base abilities at all levels
      return { abilities: [...card.abilities] };
    }

    /**
     * Check if a beast has an ability upgrade at the current level (always false now)
     */
  hasAbilityUpgrade(card: BloomBeastCard, level: Level): boolean {
      // No ability upgrades in simplified system
      return false;
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
    // TESTING: Use quick win deck for fast testing
    return quickWinDeck(type);

    // TESTING: Use testing deck with 1 of each card
    // return getTestingDeck(type);

    // ORIGINAL: Starter deck with multiple copies
    // return buildDeck(type);
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

    // Add 27 Nectar Blocks for fast summoning
    const nectarBlock = _deckBuilderCatalogManager.getCard('nectar-block');
    if (nectarBlock) {
      for (let i = 1; i <= 27; i++) {
        allCards.push({
          ...nectarBlock,
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
      case AbilityTarget.Opponent:
        return 'opponent';
      case AbilityTarget.Player:
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

    const level = getCardLevel(instance.currentXP);
    const xpRequired = getXPRequired(level, instance.currentXP);

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

    // Add type-specific data (base stats only - level bonuses applied in battle)
    if (cardDef.type === 'Bloom' && 'baseAttack' in cardDef) {
      const bloomCard = cardDef as BloomBeastCard;
      displayData.baseAttack = bloomCard.baseAttack;
      displayData.baseHealth = bloomCard.baseHealth;
    }

    // Add abilities (abilities remain constant across all levels)
    if ('abilities' in cardDef) {
      displayData.abilities = cardDef.abilities as any[];
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
    nectar: SimplePosition;
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
    const opacity = customOpacity ?? (disabled ? 0.5 : 1.0);
    const textColor = customTextColor ?? (disabled ? '#888' : COLORS.textPrimary);

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
              fontSize: DIMENSIONS.fontSize.md,
              color: textColor,
              textAlign: 'center',
              fontWeight: 'bold',
              textAlignVertical: 'center',
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

      // For single binding, use the binding's derive method (doesn't create new binding)
      if (actualBindings.length === 1) {
        return actualBindings[0].derive(deriveFn);
      }

      // For multiple bindings, must use Binding.derive (creates new binding - avoid if possible!)
      console.warn(`[BindingManager] Creating multi-binding derive for ${bindingTypes.join(', ')} - this uses a binding slot!`);
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
              children: createPlayerInfo(ui, config.onXPBarClick),
          })
      );

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
                  source: ui.assetIdToImageSource?.('side-menu') || null,
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

      // Single binding for level and XP text
      const levelXPTextBinding = ui.bindingManager.playerDataBinding.binding.derive((data: any) => {
          const statsVal = extractStats(data);
          if (!statsVal) return 'lvl 1. 0/100';

          const xpThresholds = [0, 100, 300, 700, 1500, 3100, 6300, 12700, 25500];
          const currentLevel = statsVal.playerLevel;
          const totalXP = statsVal.totalXP;
          const xpForCurrentLevel = xpThresholds[currentLevel - 1];
          const xpForNextLevel = currentLevel < 9 ? xpThresholds[currentLevel] : xpThresholds[8];
          const currentXP = totalXP - xpForCurrentLevel;
          const xpNeeded = xpForNextLevel - xpForCurrentLevel;

          return `lvl ${currentLevel}. ${currentXP}/${xpNeeded}`;
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

              // Level and XP text
              ui.View({
                  style: {
                      position: 'absolute',
                      left: sideMenuPositions.playerName.x,
                      top: 19,
                  },
                  children: ui.Text({
                      text: levelXPTextBinding,
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
      const menuOptions = ['missions', 'cards', 'upgrades', 'leaderboard', 'settings'];
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
                width: 110,
              },
              children: this.ui.Text({
                text: this.quotes[0], // TODO: listen on intervaled binding to change the quote
                numberOfLines: 3,
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

    dispose() {
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
    } else if (card.type !== 'Bloom') {
    }

    const imageSourceKey = card.type === 'Bloom' ? beastImageKey : cardImageKey;

    const children = [
        // Layer 1: Card/Beast artwork image (185x185)
        // For Bloom cards: use beast image
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

        // Layer 2: Base card frame (210x280) - ALL cards use BaseCard.png
        ui.Image({
          source: ui.assetIdToImageSource?.(baseCardKey) || null,
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
            source: ui.assetIdToImageSource?.(templateKey) || null,
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

        // Level and Experience (for all cards with level)
        ...(card.level !== undefined ? [
          ui.Text({
            text: `lvl ${card.level}. ${card.experience || 0}/${card.experienceRequired || 0}`,
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
   */
  export interface ReactiveCardRendererProps {

    // Mode selection
    mode: 'selectedCard' | 'slot';

    // Slot-based selection (required for slot mode)
    slotIndex?: number;
    cardsPerPage?: number;

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
      onClick,
      showDeckIndicator = true
    } = props;

    // Determine which mode we're in
    const isSelectedCardMode = mode === 'selectedCard';
    const isSlotMode = mode === 'slot';

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

    // Helper to get card from combined data
    // Now accepts both uiState and playerData to properly react to changes
    const getCard = (uiState: UIState, playerData: PlayerData): CardDisplayData | null => {
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

      // Compute display data from instance
      return instance ? computeCardDisplay(instance) : null;
    };


    // Helper to check if card is in deck
    const isCardInDeck = (playerData: PlayerData, cardId: string | undefined): boolean => {
      if (!showDeckIndicator || !cardId) return false;
      const deckCardIds: string[] = playerData?.cards?.deck || [];
      return deckCardIds.includes(cardId);
    };

    // Create reactive text bindings that watch BOTH UIState and PlayerData
    // This ensures the bindings update when either the selected card changes OR the card data changes
    const cardNameBinding = ui.bindingManager.derive([BindingType.UIState, BindingType.PlayerData], (uiState: UIState, playerData: PlayerData) => {
      const card = getCard(uiState, playerData);
      return card?.name || '';
    });

    const cardCostBinding = ui.bindingManager.derive([BindingType.UIState, BindingType.PlayerData], (uiState: UIState, playerData: PlayerData) => {
      const card = getCard(uiState, playerData);
      return card && card.cost !== undefined ? String(card.cost) : '';
    });

    const cardAttackBinding = ui.bindingManager.derive([BindingType.UIState, BindingType.PlayerData], (uiState: UIState, playerData: PlayerData) => {
      const card = getCard(uiState, playerData);
      if (!card || card.type !== 'Bloom') return '';
      const bloomCard = card as any;
      return String(bloomCard.currentAttack ?? bloomCard.baseAttack ?? 0);
    });

    const cardHealthBinding = ui.bindingManager.derive([BindingType.UIState, BindingType.PlayerData], (uiState: UIState, playerData: PlayerData) => {
      const card = getCard(uiState, playerData);
      if (!card || card.type !== 'Bloom') return '';
      const bloomCard = card as any;
      return String(bloomCard.currentHealth ?? bloomCard.baseHealth ?? 0);
    });

    const cardLevelBinding = ui.bindingManager.derive([BindingType.UIState, BindingType.PlayerData], (uiState: UIState, playerData: PlayerData) => {
      const card = getCard(uiState, playerData);
      if (!card || card.level === undefined) return '';

      // For all cards, show level and experience
      const exp = card.experience || 0;
      const expRequired = card.experienceRequired || 0;
      return `lvl ${card.level}. ${exp}/${expRequired}`;
    });

    const abilityTextBinding = ui.bindingManager.derive([BindingType.UIState, BindingType.PlayerData], (uiState: UIState, playerData: PlayerData) => {
      const card = getCard(uiState, playerData);
      return card ? getCardDescription(card) : '';
    });

    // Create image source bindings that watch BOTH UIState and PlayerData
    const baseCardImageBinding = ui.bindingManager.derive([BindingType.UIState, BindingType.PlayerData], (uiState: UIState, playerData: PlayerData) => {
      const card = getCard(uiState, playerData);
      if (!card) return null;
      const baseId = extractBaseId(card.id, card.name);
      if (!baseId) return null;
      return ui.assetIdToImageSource?.(baseId) ?? null;
    });

    const templateImageBinding = ui.bindingManager.derive([BindingType.UIState, BindingType.PlayerData], (uiState: UIState, playerData: PlayerData) => {
      const card = getCard(uiState, playerData);
      if (!card) return null;

      let templateAssetId = '';
      if (card.type === 'Habitat' && card.affinity) {
        templateAssetId = `${card.affinity.toLowerCase()}-habitat`;
      } else if (card.type !== 'Bloom') {
        templateAssetId = `${card.type.toLowerCase()}-card`;
      }

      return templateAssetId ? (ui.assetIdToImageSource?.(templateAssetId) ?? null) : null;
    });

    const affinityIconBinding = ui.bindingManager.derive([BindingType.UIState, BindingType.PlayerData], (uiState: UIState, playerData: PlayerData) => {
      const card = getCard(uiState, playerData);
      if (!card || card.type !== 'Bloom' || !card.affinity) return null;
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

      // Layer 2: Base card frame
      ui.Image({
        source: ui.bindingManager.derive([BindingType.UIState, BindingType.PlayerData], (uiState: UIState, playerData: PlayerData) => {
          const card = getCard(uiState, playerData);
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
          fontSize: DIMENSIONS.fontSize.xs,
          color: COLORS.textPrimary,
          textAlign: 'left',
        },
      }),

      // Layer 7: Deck indicator border (only if showDeckIndicator is true)
      ...(showDeckIndicator ? [ui.View({
        style: ui.bindingManager.derive([BindingType.UIState, BindingType.PlayerData], (uiState: UIState, playerData: PlayerData) => {
          const card = getCard(uiState, playerData);
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
          const card = getCard(currentState, playerData);
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
        // Semi-transparent backdrop
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
            }),

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
   * Create a card detail popup overlay using common Popup component
   */
  export function createCardDetailPopup(ui: UIMethodMappings, props: CardDetailPopupProps): UINodeType {
    const { cardDetail, onButtonClick, playSfx } = props;

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
          label: '↑',
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
          ) as any,
          yOffset: 0,
        },
        {
          label: '↓',
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
          ) as any,
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
    playSfx?: (sfxId: string) => void;
  }

  export class UpgradeScreen {
    private ui: UIMethodMappings;
    private onNavigate?: (screen: string) => void;
    private onUpgrade?: (boostId: string) => void;
    private playSfx?: (sfxId: string) => void;

    constructor(props: UpgradeScreenProps) {
      this.ui = props.ui;
      this.onNavigate = props.onNavigate;
      this.onUpgrade = props.onUpgrade;
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
            label: 'Up',
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
            },
            disabled: this.ui.bindingManager.derive([BindingType.Missions, BindingType.UIState], (missions: MissionDisplay[], uiState: UIState) => {
              const offset: number = uiState.missions?.scrollOffset ?? 0;
              return offset <= 0 ? true : false;
            }),
            yOffset: 0,
          },
          {
            label: 'Down',
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
            },
            disabled: this.ui.bindingManager.derive([BindingType.Missions, BindingType.UIState], (missions: MissionDisplay[], uiState: UIState) => {
              const offset: number = uiState.missions?.scrollOffset ?? 0;
              const missionsPerPage = this.missionsPerRow * this.rowsPerPage;
              const totalPages = Math.ceil(missions.length / missionsPerPage);
              return offset >= totalPages - 1 ? true : false;
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
          source: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay | null) => {
              if (!state) return null;
              const field = player === 'player' ? state.playerField : state.opponentField;
              const beast = field?.[slotIndex];
              if (!beast) return null;
              const baseId = beast.id?.replace(/-\d+-\d+$/, '') || beast.name.toLowerCase().replace(/\s+/g, '-');
              return this.ui.assetIdToImageSource?.(baseId) || null;
            }),
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
          source: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay | null) => {
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
          text: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay | null) => {
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
          text: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay | null) => {
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
          text: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay | null) => {
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
          text: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay | null) => {
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

        // Counter icons removed to reduce UI size
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
        // Layer 1: Card/Beast artwork image
        this.ui.Image({
          source: this.ui.bindingManager.derive(
            [BindingType.BattleDisplay, BindingType.UIState],
            ( display: BattleDisplay | null, uiState: UIState) => {
              if (!display || !display.playerHand) return null;
              const scrollOffset = uiState.battle?.handScrollOffset ?? 0;
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
          source: this.ui.bindingManager.derive(
            [BindingType.BattleDisplay, BindingType.UIState],
            ( display: BattleDisplay | null, uiState: UIState) => {
              if (!display || !display.playerHand) return null;
              const scrollOffset = uiState.battle?.handScrollOffset ?? 0;
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
          source: this.ui.bindingManager.derive(
            [BindingType.BattleDisplay, BindingType.UIState],
            ( display: BattleDisplay | null, uiState: UIState) => {
              if (!display || !display.playerHand) return null;
              const scrollOffset = uiState.battle?.handScrollOffset ?? 0;
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
          text: this.ui.bindingManager.derive(
            [BindingType.BattleDisplay, BindingType.UIState],
            (display: BattleDisplay | null, uiState: UIState) => {
              if (!display || !display.playerHand) return '';
              const scrollOffset = uiState.battle?.handScrollOffset ?? 0;
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

        // Layer 6: Cost
        this.ui.Text({
          text: this.ui.bindingManager.derive(
            [BindingType.BattleDisplay, BindingType.UIState],
            (display: BattleDisplay | null, uiState: UIState) => {
              const scrollOffset = uiState.battle?.handScrollOffset ?? 0;
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
          text: this.ui.bindingManager.derive(
            [BindingType.BattleDisplay, BindingType.UIState],
            (display: BattleDisplay | null, uiState: UIState) => {
              const scrollOffset = uiState.battle?.handScrollOffset ?? 0;
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
          text: this.ui.bindingManager.derive(
            [BindingType.BattleDisplay, BindingType.UIState],
            (display: BattleDisplay | null, uiState: UIState) => {
              const scrollOffset = uiState.battle?.handScrollOffset ?? 0;
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
          text: this.ui.bindingManager.derive(
            [BindingType.BattleDisplay, BindingType.UIState],
            (display: BattleDisplay | null, uiState: UIState) => {
              const scrollOffset = uiState.battle?.handScrollOffset ?? 0;
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
                      if (card.type === 'Magic' || card.type === 'Buff') {
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
          top: this.ui.bindingManager.derive(
            [BindingType.UIState],
            (uiState: UIState) => {
              const showFull = uiState.battle?.showHand ?? false;
              return showFull ? (gameDimensions.panelHeight - 300) : 640;
            }
          ),
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
              left: overlayWidth - 50,
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
              text: 'UP',
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
              left: overlayWidth - 50,
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
              text: 'DOWN',
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
   * Player and opponent info displays (health, nectar, deck count, timer)
   */


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
                  state.battle?.opponentTimer ? `⏱️ ${state.battle.opponentTimer}` : '⏱️ 0:00'
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
                  state ? `${nectarEmoji} ${state.opponentNectar}/10` : `${nectarEmoji} 0/10`
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
                  state.battle?.playerTimer ? `⏱️ ${state.battle.playerTimer}` : '⏱️ 0:00'
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
                  state ? `${nectarEmoji} ${state.playerNectar}/10` : `${nectarEmoji} 0/10`
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
    private onStopTurnTimer?: () => void;
    private playSfx?: (sfxId: string) => void;

    constructor(props: BattleSideMenuProps) {
      this.ui = props.ui;
      this.getIsPlayerTurn = props.getIsPlayerTurn;
      this.getHasAttackableBeasts = props.getHasAttackableBeasts;
      this.onAction = props.onAction;
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
          width: 127,
          height: 465,
        },
        children: [
          this.ui.Image({
            source: this.ui.assetIdToImageSource?.('side-menu') || null,
            style: {
              position: 'absolute',
              width: 127,
              height: 465,
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

          // Battle info text
          this.ui.View({
            style: {
              position: 'absolute',
              left: sideMenuPositions.textStartPosition.x - sideMenuPositions.x,
              top: sideMenuPositions.textStartPosition.y - sideMenuPositions.y,
            },
            children: [
              this.ui.Text({
                text: 'Battle',
                style: {
                  fontSize: 20,
                  fontWeight: 'bold',
                  color: '#fff',
                  marginBottom: 5,
                },
              }),
              this.ui.Text({
                text: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) =>
                  state ? `Turn ${state.currentTurn}` : 'Turn 1'
                ),
                style: {
                  fontSize: 18,
                  color: '#fff',
                  marginBottom: 5,
                },
              }),
            ],
          }),

          // Attack button (red) - positioned above End Turn button
          createButton({
            ui: this.ui,
            label: 'Attack',
            onClick: () => {
              const currentIsPlayerTurn = this.getIsPlayerTurn();
              const hasAttackable = this.getHasAttackableBeasts();

              if (currentIsPlayerTurn && hasAttackable) {
                this.onAction?.('auto-attack-all');
                // Auto end turn after attacking
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

          // End Turn button with timer - uses derived bindings for reactive updates
          createButton({
            ui: this.ui,
            label: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) =>
              state?.turnPlayer === 'player' ? 'End Turn' : 'Enemy Turn'
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
    private playerTimerValue = 300; // 5 minutes = 300 seconds
    private opponentTimerValue = 300; // 5 minutes = 300 seconds
    private isPlayerTurnValue = false;
    private battleDisplayValue: any | null = null;
    private hasAttackableBeasts = false;
    private showHandValue = true;
    private handScrollOffsetValue = 0;
    private selectedCardDetailValue: any = null;

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
      this.showHandValue = true;
      this.handScrollOffsetValue = 0;
      this.playerTimerValue = 300;
      this.opponentTimerValue = 300;
      this.selectedCardDetailValue = null;

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
          this.selectedCardDetailValue = card;
          this.updateUIState({ selectedCardDetail: card });
        },
      });

      this.buffZoneComponent = new BuffZone({
        ui: this.ui,
        onCardDetailSelected: (card) => {
          this.selectedCardDetailValue = card;
          this.updateUIState({ selectedCardDetail: card });
        },
      });

      this.habitatZoneComponent = new HabitatZone({
        ui: this.ui,
        onCardDetailSelected: (card) => {
          const habitatWithType = { ...card, type: 'Habitat' };
          this.selectedCardDetailValue = habitatWithType;
          this.updateUIState({ selectedCardDetail: habitatWithType });
        },
      });

      this.playerHandComponent = new PlayerHand({
        ui: this.ui,
        getBattleDisplayValue: () => this.battleDisplayValue,
        onAction: this.onAction,
        onShowHandChange: (newValue) => {
          this.showHandValue = newValue;
          this.updateUIState({ showHand: newValue });
        },
        onScrollOffsetChange: (newValue) => {
          this.handScrollOffsetValue = newValue;
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
                  this.selectedCardDetailValue = null;
                  this.updateUIState({ selectedCardDetail: null });
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
     * Forfeit popup is now handled at the root level in BloomBeastsGame.ts
     * This method has been removed to avoid duplicate popups
     */

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
            // Trigger loss - forfeit the battle
            this.onAction?.('forfeit');
          } else {
            this.playerTimerValue = current - 1;
            this.updateUIState({ playerTimer: this.playerTimerValue });
            this.onRenderNeeded?.();
          }
        } else {
          const current = this.opponentTimerValue;
          if (current <= 0) {
            this.stopTurnTimer();
            // Opponent loses - this should trigger victory
            // For now, just end their turn
            this.onAction?.('end-turn');
          } else {
            this.opponentTimerValue = current - 1;
            this.updateUIState({ opponentTimer: this.opponentTimerValue });
            this.onRenderNeeded?.();
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
      this.playerTimerValue = 300;
      this.opponentTimerValue = 300;
      this.showHandValue = true;
      this.handScrollOffsetValue = 0;
      this.selectedCardDetailValue = null;

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
      // Chest or lose image
      ui.View({
        style: {
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 10,
          marginBottom: 20,
        },
        children: ui.Image({
          source: chestImageSource as any,
          style: {
            width: chestImageMissionCompleteDimensions.width,
            height: chestImageMissionCompleteDimensions.height,
          },
        }),
      }),

      // Info text
      ui.View({
        style: {
          width: '100%',
          paddingLeft: 20,
          paddingRight: 20,
        },
        children: ui.Text({
          text: infoText as any,
          numberOfLines: 15,
          style: {
            fontSize: DIMENSIONS.fontSize.md,
            color: COLORS.textPrimary,
            textAlign: 'center',
            lineHeight: 20,
          },
        }),
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
        battleState: BattlePhase.Setup,
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
      this.state.battleState = BattlePhase.Player1StartOfTurn;
      await this.transitionState();
    }

    /**
     * State machine transition logic
     */
    private async transitionState(): Promise<void> {
      // Check for win condition before any state processing
      if (this.checkForBattleEnd()) {
        this.state.battleState = BattlePhase.Finished;
        return;
      }

      const currentState = this.state.battleState;
      Logger.debug(`Transitioning from state: ${currentState}`);

      switch (currentState) {
        case BattlePhase.Player1StartOfTurn:
          await this.processPlayerStartOfTurn(0);
          this.state.battleState = BattlePhase.Player1Playing;
          break;

        case BattlePhase.Player1Playing:
          // This state waits for player input (endTurn call)
          break;

        case BattlePhase.Player1EndOfTurn:
          await this.processPlayerEndOfTurn(0);
          this.state.battleState = BattlePhase.Player2StartOfTurn;
          await this.transitionState();
          break;

        case BattlePhase.Player2StartOfTurn:
          await this.processPlayerStartOfTurn(1);
          this.state.battleState = BattlePhase.Player2Playing;
          break;

        case BattlePhase.Player2Playing:
          // This state waits for player input (endTurn call)
          break;

        case BattlePhase.Player2EndOfTurn:
          await this.processPlayerEndOfTurn(1);
          // Increment turn counter after both players have played
          this.state.turn++;
          this.state.battleState = BattlePhase.Player1StartOfTurn;
          await this.transitionState();
          break;

        case BattlePhase.Finished:
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

      // Counter effects removed

      // Check for death
      if (this.checkForBattleEnd()) {
        this.state.battleState = BattlePhase.Finished;
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
        this.state.battleState = BattlePhase.Finished;
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
      if (state.battleState === BattlePhase.Player1Playing) {
        state.battleState = BattlePhase.Player1EndOfTurn;
      } else if (state.battleState === BattlePhase.Player2Playing) {
        state.battleState = BattlePhase.Player2EndOfTurn;
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

              // Counter effects removed

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
        // Counter effects removed

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
          this.state.battleState = BattlePhase.Finished;
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

    // Counter effects removed to reduce game complexity

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
              this.state.battleState = BattlePhase.Finished;
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
                this.state.battleState = BattlePhase.Finished;
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
            this.state.battleState = BattlePhase.Finished;
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
          this.state.battleState = BattlePhase.Finished;
          await this.transitionState();
        }
      }

      // Always check for battle end after any damage
      if (this.checkForBattleEnd()) {
        this.state.battleState = BattlePhase.Finished;
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
                } else if (effect.target === AbilityTarget.Opponent) {
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
        this.state.battleState = BattlePhase.Finished;
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

      // Abilities remain constant across all levels
      const abilities = [...cardDef.abilities];

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
            const level = getCardLevel(cardInstance.currentXP);
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
              level: level, // Include computed level for beast instance (added to Card interface)
            };

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
      // Get the catalog manager to access cards
      const game = (globalThis as any).bloomBeastsGame;
      if (!game?.catalogManager) {
        console.error('[mission01] Catalog manager not available');
        return { name: 'Rootling Deck', affinity: 'Forest', cards: [], totalCards: 0 };
      }

      // Get Rootling card and create a weakened version with only 1 HP
      const rootlingCard = game.catalogManager.getCard('rootling');
      if (!rootlingCard) {
        console.error('[mission01] Rootling card not found');
        return { name: 'Rootling Deck', affinity: 'Forest', cards: [], totalCards: 0 };
      }

      // Create a single Rootling with 1 HP (tutorial difficulty)
      const weakRootling = {
        ...rootlingCard,
        baseHealth: 1,
        instanceId: 'rootling-1',
      };

      return {
        name: 'Rootling (Tutorial)',
        affinity: 'Forest' as const,
        cards: [weakRootling],
        totalCards: 1,
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
      for (let i = 1; i <= 3; i++) {
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

      // Beginner deck: 2 Mosslets + 2 Rootlings + 3 Nectar Blocks
      const mossletCard = game.catalogManager.getCard('mosslet');
      const rootlingCard = game.catalogManager.getCard('rootling');
      const nectarBlockCard = game.catalogManager.getCard('nectar-block');

      const cards = [];

      // Add 2 Mosslets
      for (let i = 1; i <= 2; i++) {
        cards.push({ ...mossletCard, instanceId: `mosslet-${i}` });
      }

      // Add 2 Rootlings
      for (let i = 1; i <= 2; i++) {
        cards.push({ ...rootlingCard, instanceId: `rootling-${i}` });
      }

      // Add 3 Nectar Blocks
      for (let i = 1; i <= 3; i++) {
        cards.push({ ...nectarBlockCard, instanceId: `nectar-block-${i}` });
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
      const nectarBlockCard = game.catalogManager.getCard('nectar-block');
      const ancientForestCard = game.catalogManager.getCard('ancient-forest');
      const powerUpCard = game.catalogManager.getCard('power-up');

      const cards = [];

      // Add 3 Leaf Sprites
      for (let i = 1; i <= 3; i++) {
        cards.push({ ...leafSpriteCard, instanceId: `leaf-sprite-${i}` });
      }

      // Add 2 Mushroomancers
      for (let i = 1; i <= 2; i++) {
        cards.push({ ...mushroomancerCard, instanceId: `mushroomancer-${i}` });
      }

      // Add 1 Ancient Forest habitat
      cards.push({ ...ancientForestCard, instanceId: 'ancient-forest-1' });

      // Add 5 Nectar Blocks
      for (let i = 1; i <= 5; i++) {
        cards.push({ ...nectarBlockCard, instanceId: `nectar-block-${i}` });
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

    // Create 3 instances of Cluck Norris at level 9
    const cluckNorrisCards: BloomBeastCard[] = [];
    for (let i = 1; i <= 3; i++) {
      cluckNorrisCards.push({
        ...cluckNorrisCard,
        instanceId: `cluck-norris-${i}`,
        // Keep base stats at 99/99 as defined in the catalog
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

  // ==================== bloombeasts\battle\types.ts ====================

  /**
   * Battle System Types
   *
   * Core type definitions for the generic battle system.
   * This system works with any two players (human vs AI, human vs human, AI vs AI).
   */


  /**
   * Result of a battle action
   */
  export interface BattleActionResult {
    success: boolean;
    message?: string;
    damage?: number;
    isTrap?: boolean;
  }

  /**
   * Battle configuration - passed when initializing a battle
   */
  export interface BattleConfig {
    player1: PlayerConfig;
    player2: PlayerConfig;
  }

  /**
   * Configuration for a player in a battle
   */
  export interface PlayerConfig {
    id: string;
    name: string;
    deck: AnyCard[];
    health?: number;
    maxHealth?: number;
    isAI?: boolean;
    aiStrategy?: 'default' | 'aggressive' | 'defensive' | 'custom';
  }

  /**
   * Current state of an active battle
   */
  export interface BattleState {
    gameState: GameState;
    isComplete: boolean;
    winner: 'player1' | 'player2' | null;
    turn: number;
  }

  /**
   * Callbacks for battle events
   */
  export interface BattleCallbacks {
    onTurnStart?: (playerIndex: number) => void;
    onTurnEnd?: (playerIndex: number) => void;
    onAction?: (action: string, playerId: string) => void;
    onBattleEnd?: (winner: 'player1' | 'player2' | null) => void;
    onRender?: () => void;
  }

  /**
   * Result of a completed battle
   */
  export interface BattleResult {
    winner: 'player1' | 'player2' | null;
    turns: number;
    player1Health: number;
    player2Health: number;
  }

  // ==================== bloombeasts\battle\core\BattleController.ts ====================

  /**
   * BattleController - Core battle orchestrator
   *
   * Generic battle controller that works with any two players.
   * Handles:
   * - Battle initialization
   * - Turn management
   * - Victory conditions
   * - Action processing coordination
   *
   * This class is platform-agnostic and player-agnostic - it doesn't care
   * if players are human, AI, or networked.
   */


  export class BattleController {
    private async: AsyncMethods;
    private currentBattle: BattleState | null = null;
    private callbacks: BattleCallbacks;

    constructor(async: AsyncMethods, callbacks: BattleCallbacks = {}) {
      this.async = async;
      this.callbacks = callbacks;
    }

    /**
     * Initialize a new battle between two players
     */
    initializeBattle(config: BattleConfig): BattleState {
      Logger.info('[BattleController] Initializing battle');

      // Create player 1
      const player1: Player = {
        id: config.player1.id,
        name: config.player1.name,
        health: config.player1.health ?? 30,
        maxHealth: config.player1.maxHealth ?? 30,
        deck: [...config.player1.deck], // Copy deck to avoid mutation
        hand: [],
        field: [],
        graveyard: [],
        trapZone: [],
        buffZone: [],
        currentNectar: 1,
        summonsThisTurn: 0,
      };

      // Create player 2
      const player2: Player = {
        id: config.player2.id,
        name: config.player2.name,
        health: config.player2.health ?? 30,
        maxHealth: config.player2.maxHealth ?? 30,
        deck: [...config.player2.deck], // Copy deck to avoid mutation
        hand: [],
        field: [],
        graveyard: [],
        trapZone: [],
        buffZone: [],
        currentNectar: 1,
        summonsThisTurn: 0,
      };

      // Create game state
      const gameState: GameState = {
        players: [player1, player2],
        activePlayer: 0,
        habitatZone: null,
        turn: 1,
        phase: 'Setup',
        battleState: BattlePhase.Player1StartOfTurn,
        turnHistory: [],
      };

      // Create battle state
      this.currentBattle = {
        gameState,
        isComplete: false,
        winner: null,
        turn: 1,
      };

      // Shuffle decks
      this.shuffleDeck(player1.deck);
      this.shuffleDeck(player2.deck);

      // Draw initial hands (3 cards each)
      for (let i = 0; i < 3; i++) {
        this.drawCard(player1);
        this.drawCard(player2);
      }

      Logger.info('[BattleController] Battle initialized');
      return this.currentBattle;
    }

    /**
     * Get the current battle state
     */
    getCurrentBattle(): BattleState | null {
      return this.currentBattle;
    }

    /**
     * Check if battle has ended and determine winner
     */
    checkBattleEnd(): BattleResult | null {
      if (!this.currentBattle) return null;

      const player1 = this.currentBattle.gameState.players[0];
      const player2 = this.currentBattle.gameState.players[1];

      // Check if either player is defeated
      if (player1.health <= 0 && player2.health <= 0) {
        // Both died (rare tie case)
        return {
          winner: null,
          turns: this.currentBattle.turn,
          player1Health: player1.health,
          player2Health: player2.health,
        };
      } else if (player1.health <= 0) {
        // Player 1 lost
        return {
          winner: 'player2',
          turns: this.currentBattle.turn,
          player1Health: player1.health,
          player2Health: player2.health,
        };
      } else if (player2.health <= 0) {
        // Player 2 lost
        return {
          winner: 'player1',
          turns: this.currentBattle.turn,
          player1Health: player1.health,
          player2Health: player2.health,
        };
      }

      // Check deck-out condition (no cards left to draw)
      if (player1.deck.length === 0 && player1.hand.length === 0 && player1.field.every(b => !b)) {
        return {
          winner: 'player2',
          turns: this.currentBattle.turn,
          player1Health: player1.health,
          player2Health: player2.health,
        };
      }
      if (player2.deck.length === 0 && player2.hand.length === 0 && player2.field.every(b => !b)) {
        return {
          winner: 'player1',
          turns: this.currentBattle.turn,
          player1Health: player1.health,
          player2Health: player2.health,
        };
      }

      return null;
    }

    /**
     * Mark battle as complete
     */
    completeBattle(winner: 'player1' | 'player2' | null): void {
      if (!this.currentBattle) return;

      this.currentBattle.isComplete = true;
      this.currentBattle.winner = winner;

      if (this.callbacks.onBattleEnd) {
        this.callbacks.onBattleEnd(winner);
      }

      Logger.info(`[BattleController] Battle complete. Winner: ${winner || 'tie'}`);
    }

    /**
     * Start a player's turn
     */
    startTurn(playerIndex: number): void {
      if (!this.currentBattle) return;

      const gameState = this.currentBattle.gameState;
      gameState.activePlayer = playerIndex as 0 | 1;

      const player = gameState.players[playerIndex];
      const opponent = gameState.players[1 - playerIndex];

      // Draw a card at start of turn
      this.drawCard(player);

      // Increase nectar (max 10)
      player.currentNectar = Math.min(10, this.currentBattle.turn);

      // Reset summoning sickness and ability usage for player's beasts
      player.field.forEach((beast: any) => {
        if (beast) {
          beast.summoningSickness = false;
          beast.usedAbilityThisTurn = false;
        }
      });

      if (this.callbacks.onTurnStart) {
        this.callbacks.onTurnStart(playerIndex);
      }

      if (this.callbacks.onRender) {
        this.callbacks.onRender();
      }
    }

    /**
     * End a player's turn
     */
    endTurn(playerIndex: number): void {
      if (!this.currentBattle) return;

      if (this.callbacks.onTurnEnd) {
        this.callbacks.onTurnEnd(playerIndex);
      }

      // Increment turn counter when player 2 ends their turn
      if (playerIndex === 1) {
        this.currentBattle.turn++;
      }
    }

    /**
     * Draw a card from player's deck
     */
    private drawCard(player: Player): void {
      if (player.deck.length === 0) {
        Logger.debug(`[BattleController] No cards left in deck for ${player.name}`);
        return;
      }

      const card = player.deck.shift();
      if (card) {
        player.hand.push(card);
        Logger.debug(`[BattleController] ${player.name} drew a card: ${card.name}`);
      }
    }

    /**
     * Shuffle a deck
     */
    private shuffleDeck(deck: AnyCard[]): void {
      shuffle(deck);
    }

    /**
     * Clean up battle resources
     */
    dispose(): void {
      this.currentBattle = null;
      Logger.info('[BattleController] Battle controller disposed');
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

  // ==================== bloombeasts\battle\core\BattleRules.ts ====================

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
        case 'opponent':
          targets = [opponent];
          break;
        case 'player':
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

  // ==================== bloombeasts\battle\ai\OpponentAI.ts ====================

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

  // ==================== bloombeasts\screens\missions\MissionBattleUI.ts ====================

  /**
   * Mission Battle UI - Mission-specific wrapper around the generic battle system
   *
   * This class adds mission-specific functionality on top of the generic BattleController:
   * - Mission setup (special rules, opponent configuration)
   * - Reward calculation
   * - Progress tracking
   * - Mission objectives
   *
   * The core battle logic is handled by the generic BattleController.
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

    // Battle system components
    private battleController: BattleController;
    private battleStateManager: BattleStateManager;
    private opponentAI: OpponentAI;

    // Current state
    private currentBattle: BattleUIState | null = null;
    private shouldStopAI: boolean = false;

    // Callbacks
    private renderCallback: (() => void) | null = null;
    private opponentActionCallback: ((action: string) => void) | null = null;
    private playerLowHealthTriggered: boolean = false;

    constructor(missionManager: MissionManager, gameEngine: GameEngine, async: AsyncMethods) {
      this.missionManager = missionManager;
      this.gameEngine = gameEngine;
      this.async = async;

      // Initialize battle components
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

      // Initialize battle controller with callbacks
      const battleCallbacks: BattleCallbacks = {
        onTurnStart: (playerIndex: number) => {
          Logger.debug(`[MissionBattleUI] Turn started for player ${playerIndex}`);
        },
        onTurnEnd: (playerIndex: number) => {
          Logger.debug(`[MissionBattleUI] Turn ended for player ${playerIndex}`);
        },
        onRender: () => {
          if (this.renderCallback) this.renderCallback();
        },
      };

      this.battleController = new BattleController(async, battleCallbacks);
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
    initializeBattle(playerDeckCards: AnyCard[], playerName?: string): BattleUIState | null {
      this.shouldStopAI = false;
      this.playerLowHealthTriggered = false;

      const mission = this.missionManager.getCurrentMission();
      if (!mission) {
        Logger.error('No mission selected');
        return null;
      }

      // Resolve the opponent deck
      const opponentDeck = resolveDeck(mission.opponentDeck);

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
          deck: opponentDeck.cards,
          health: 30,
          maxHealth: 30,
          isAI: true,
        },
      };

      // Initialize battle using generic battle controller
      const battle = this.battleController.initializeBattle(battleConfig);

      // Create mission-specific state
      this.currentBattle = {
        mission,
        gameState: battle.gameState,
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
     * Process a player action
     */
    async processPlayerAction(action: string, data: any): Promise<void> {
      if (!this.currentBattle || !this.currentBattle.gameState) {
        Logger.error('No active battle');
        return;
      }

      let result: any = { success: false, damage: data?.damage || 0 };

      // Handle different action types using BattleStateManager
      const player = this.currentBattle.gameState.players[0];
      const opponent = this.currentBattle.gameState.players[1];

      if (action.startsWith('play-card-')) {
        const parts = action.substring('play-card-'.length).split('-target-');
        const cardIndex = parseInt(parts[0], 10);
        const targetIndex = parts.length > 1 ? parseInt(parts[1], 10) : undefined;
        result = this.battleStateManager.playCard(cardIndex, player, opponent, this.currentBattle.gameState, targetIndex);

      } else if (action.startsWith('use-ability-')) {
        const beastIndex = parseInt(action.substring('use-ability-'.length), 10);
        result = this.battleStateManager.useAbility(beastIndex, player, opponent, this.currentBattle.gameState);

      } else if (action === 'auto-attack-all') {
        result = await this.autoAttackAll(player, opponent, data?.onAttackAnimation);

      } else if (action.startsWith('attack-beast-')) {
        const parts = action.substring('attack-beast-'.length).split('-');
        const attackerIndex = parseInt(parts[0], 10);
        const targetIndex = parseInt(parts[1], 10);
        result = this.battleStateManager.attackBeast(attackerIndex, targetIndex, player, opponent, (trapName: string) => {
          if (this.opponentActionCallback) this.opponentActionCallback('trap-activated');
        });

      } else if (action.startsWith('attack-player-')) {
        const attackerIndex = parseInt(action.substring('attack-player-'.length), 10);
        result = this.battleStateManager.attackPlayer(attackerIndex, player, opponent, (trapName: string) => {
          if (this.opponentActionCallback) this.opponentActionCallback('trap-activated');
        });

      } else if (action === 'end-turn') {
        result = await this.endPlayerTurn();
      }

      // Update mission progress
      this.updateMissionProgress(action, result);

      // Check for battle end
      const battleResult = this.battleController.checkBattleEnd();
      if (battleResult) {
        this.endBattle();
      }
    }

    /**
     * Auto-attack with all beasts
     */
    private async autoAttackAll(
      player: Player,
      opponent: Player,
      onAttackAnimation?: (attackerIndex: number, targetType: 'beast' | 'health', targetIndex?: number) => Promise<void>
    ): Promise<any> {
      let anyAttackSucceeded = false;
      const results: any[] = [];

      for (let i = 0; i < 3; i++) {
        const attackerBeast = player.field[i];
        if (!attackerBeast || attackerBeast.summoningSickness) continue;

        const opposingBeast = opponent.field[i];

        if (opposingBeast) {
          if (onAttackAnimation) await onAttackAnimation(i, 'beast', i);
          const result = this.battleStateManager.attackBeast(i, i, player, opponent, (trapName: string) => {
            if (this.opponentActionCallback) this.opponentActionCallback('trap-activated');
          });
          results.push(result);
          if (result.success) anyAttackSucceeded = true;
        } else {
          if (onAttackAnimation) await onAttackAnimation(i, 'health');
          const result = this.battleStateManager.attackPlayer(i, player, opponent, (trapName: string) => {
            if (this.opponentActionCallback) this.opponentActionCallback('trap-activated');
          });
          results.push(result);
          if (result.success) anyAttackSucceeded = true;
        }

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
      if (!this.currentBattle || !this.currentBattle.gameState) {
        return { success: false };
      }

      const player = this.currentBattle.gameState.players[0];
      const opponent = this.currentBattle.gameState.players[1];

      // Process end-of-turn effects
      player.field.forEach((beast: any) => {
        if (beast) {
          beast.summoningSickness = false;
          beast.usedAbilityThisTurn = false;
        }
      });
      this.battleStateManager.processEndOfTurnTriggers(player, opponent);

      // Switch to opponent turn
      this.currentBattle.gameState.activePlayer = 1;

      // Process opponent AI turn
      await this.processOpponentTurn();

      // Switch back to player and increment turn
      this.currentBattle.gameState.activePlayer = 0;
      this.currentBattle.gameState.turn++;

      // Start player's new turn
      this.battleController.startTurn(0);

      // Process start-of-turn buff effects
      this.battleStateManager.applyBuffStartOfTurnEffects(player, opponent);
      this.battleStateManager.processStartOfTurnTriggers(player, opponent);
      this.battleStateManager.applyStatBuffEffects(player);

      return { success: true };
    }

    /**
     * Process opponent's AI turn
     */
    private async processOpponentTurn(): Promise<void> {
      if (!this.currentBattle || !this.currentBattle.gameState) return;

      const player = this.currentBattle.gameState.players[0];
      const opponent = this.currentBattle.gameState.players[1];

      // Helper function for delays
      const delay = (ms: number) => new Promise(resolve => this.async.setTimeout(resolve, ms));

      // Draw a card for opponent
      if (opponent.deck.length > 0) {
        const card = opponent.deck.shift();
        if (card) opponent.hand.push(card);
      }
      if (this.renderCallback) this.renderCallback();
      await delay(800);
      if (this.shouldStopAI) return;

      // Increase opponent nectar
      opponent.currentNectar = Math.min(10, this.currentBattle.gameState.turn);
      if (this.renderCallback) this.renderCallback();
      await delay(500);
      if (this.shouldStopAI) return;

      // Apply start-of-turn buff effects
      this.battleStateManager.applyBuffStartOfTurnEffects(opponent, player);
      this.battleStateManager.processStartOfTurnTriggers(opponent, player);
      this.battleStateManager.applyStatBuffEffects(opponent);

      // Remove summoning sickness
      opponent.field.forEach((beast: any) => {
        if (beast) {
          beast.summoningSickness = false;
          beast.usedAbilityThisTurn = false;
        }
      });

      // Use AI to execute opponent turn with proper effect processors
      await this.opponentAI.executeTurn(
        opponent,
        player,
        this.currentBattle.gameState,
        {
          processOnSummonTrigger: this.battleStateManager.processOnSummonTrigger.bind(this.battleStateManager),
          processOnAttackTrigger: this.battleStateManager.processOnAttackTrigger.bind(this.battleStateManager),
          processOnDamageTrigger: this.battleStateManager.processOnDamageTrigger.bind(this.battleStateManager),
          processOnDestroyTrigger: this.battleStateManager.processOnDestroyTrigger.bind(this.battleStateManager),
          processMagicEffect: this.battleStateManager.processMagicEffect.bind(this.battleStateManager),
          processHabitatEffect: this.battleStateManager.processHabitatEffect.bind(this.battleStateManager),
          applyStatBuffEffects: this.battleStateManager.applyStatBuffEffects.bind(this.battleStateManager),
        },
        () => this.shouldStopAI
      );
    }

    /**
     * Update mission progress based on action
     */
    private updateMissionProgress(action: string, result: any): void {
      if (!this.currentBattle) return;

      // Track objectives, etc.
      // Implementation depends on mission objectives system
    }

    /**
     * Check if battle has ended
     */
    private checkBattleEnd(): boolean {
      return this.battleController.checkBattleEnd() !== null;
    }

    /**
     * End the battle and calculate rewards
     */
    private endBattle(): void {
      if (!this.currentBattle) return;

      const battleResult = this.battleController.checkBattleEnd();
      if (!battleResult) return;

      this.shouldStopAI = true;
      this.currentBattle.isComplete = true;

      // Calculate rewards for victory
      if (battleResult.winner === 'player1') {
        this.currentBattle.rewards = this.missionManager.completeMission();
        this.battleController.completeBattle('player1');
      } else {
        this.currentBattle.rewards = null;
        this.battleController.completeBattle('player2');
      }

      Logger.info(`[MissionBattleUI] Battle ended. Winner: ${battleResult.winner}`);
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
      this.gameEngine = new GameEngine(config.catalogManager);
      this.missionManager = new MissionManager(config.catalogManager);
      this.missionUI = new MissionSelectionUI(this.missionManager);
      this.battleUI = new MissionBattleUI(this.missionManager, this.gameEngine, this.asyncMethods);
      this.cardCollectionManager = new CardCollectionManager(config.catalogManager);
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
            },
            color: 'default',
          },
        ],
        playSfx: this.playSfx.bind(this),
      });
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
        },
        playSfx: this.playSfx.bind(this)
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
    private handleForfeit(): void {
      // Close popup
      this.UI.bindingManager.setBinding(BindingType.ForfeitPopup, null);

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
        // Initialize battle with player's deck cards and name
        const battleState = this.battleUI.initializeBattle(playerDeckCards, this.playerData.name);

        if (battleState) {
          this.currentBattleId = missionId;
          this.battleStartTime = Date.now();  // Track start time for leaderboard

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
            this.UI.bindingManager.setBinding(BindingType.BattleDisplay, updatedDisplay);
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
            createCardDetailPopup(this.UI, this.UI.bindingManager.getSnapshot(BindingType.CardDetailPopup) || {
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
              onButtonClick: () => {},
              playSfx: this.playSfx.bind(this)
            })
          )
        );
      }

      return View({
        style: {
          width: '100%',
          height: '100%',
          backgroundColor: 'blue',
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
    affinity?: 'fire' | 'forest' | 'sky' | 'water' | 'boss'; // For beasts and habitats
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
    name: string;
    description: string;
    assets: AssetReference[];
  }

  export interface UIAssetEntry {
    id: string;
    type: 'ui';
    category: 'frame' | 'button' | 'background' | 'icon' | 'chest' | 'container' | 'card-template' | 'upgrade' | 'other';
    name: string;
    description?: string;
    assets: AssetReference[];
  }

  export interface AssetCatalog {
    version: string;
    category: 'fire' | 'forest' | 'sky' | 'water' | 'buff' | 'trap' | 'magic' | 'common' | 'boss';
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

  // ==================== bloombeasts\catalogs\bossAssets.ts ====================

  /**
   * Boss Assets Catalog
   * Source of truth for boss cards and assets
   * Edit this file directly to add/modify boss assets
   */


  export const bossAssets: AssetCatalog = {
    version: "1.0.0",
    category: "boss",
    description: "Boss cards and assets",
    data: [
      {
        id: "cluck-norris",
        type: "beast",
        cardType: "Bloom",
        affinity: "boss",
        data: {
          id: "cluck-norris",
          name: "Cluck Norris",
          type: "Bloom",
          affinity: "Boss",
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
            type: "image",
            horizonAssetId: "1358389912362012",
            path: "assets/images/cards_boss_cluck-norris.png"
          }
        ]
      },
      {
        id: "boss-icon",
        type: "ui",
        category: "icon",
        name: "Boss Icon",
        assets: [
          {
            type: "image",
            horizonAssetId: "808398125136052",
            path: "assets/images/affinity_boss-icon.png"
          }
        ]
      },
      {
        id: "boss-mission",
        type: "mission",
        affinity: "boss",
        name: "Cluck Norris",
        description: "Boss mission",
        assets: [
          {
            type: "image",
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
                  target: AbilityTarget.Player,
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
        id: "player-stats-container",
        type: "ui",
        category: "container",
        name: "Player Stats Container",
        description: "Container for player stats display",
        assets: [
          {
            type: "image",
            horizonAssetId: "PLACEHOLDER_ID",
            path: "assets/images/ui_container_player-stats.png"
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
            horizonAssetId: "1559448588566044",
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
            horizonAssetId: "2581420452257174",
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
            horizonAssetId: "3122347641277336",
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
            horizonAssetId: "3182045765293902",
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
        id: "icon-coin",
        type: "ui",
        category: "icon",
        name: "Coin Icon",
        description: "Coin currency icon",
        assets: [
          {
            type: "image",
            horizonAssetId: "PLACEHOLDER_ID",
            path: "assets/images/icon_coin.png"
          }
        ]
      },
      {
        id: "icon-serum",
        type: "ui",
        category: "icon",
        name: "Serum Icon",
        description: "Serum item icon",
        assets: [
          {
            type: "image",
            horizonAssetId: "PLACEHOLDER_ID",
            path: "assets/images/icon_serum.png"
          }
        ]
      },
      // Counter icons removed - counter system deprecated
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
        id: "sfx-upgrade",
        type: "ui",
        category: "other",
        name: "Upgrade SFX",
        description: "Sound for purchasing upgrades",
        assets: [
          {
            type: "audio",
            horizonAssetId: "PLACEHOLDER_ID",
            path: "assets/audio/sfx_upgrade.wav"
          }
        ]
      },
      {
        id: "sfx-upgrade-rooster",
        type: "ui",
        category: "other",
        name: "Upgrade Rooster SFX",
        description: "Sound for purchasing rooster upgrade",
        assets: [
          {
            type: "audio",
            horizonAssetId: "PLACEHOLDER_ID",
            path: "assets/audio/sfx_upgrade_rooster.wav"
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
      },
      {
        id: "upgrade-coin-boost",
        type: "ui",
        category: "upgrade",
        name: "Coin Boost Upgrade",
        description: "Coin boost upgrade icon",
        assets: [
          {
            type: "image",
            horizonAssetId: "1059820639487262",
            path: "assets/images/upgrade_coin-boost.png"
          }
        ]
      },
      {
        id: "upgrade-container-card",
        type: "ui",
        category: "upgrade",
        name: "Container Card Upgrade",
        description: "Container card upgrade icon",
        assets: [
          {
            type: "image",
            horizonAssetId: "852906320567105",
            path: "assets/images/upgrade_container-card.png"
          }
        ]
      },
      {
        id: "upgrade-exp-boost",
        type: "ui",
        category: "upgrade",
        name: "Experience Boost Upgrade",
        description: "Experience boost upgrade icon",
        assets: [
          {
            type: "image",
            horizonAssetId: "662687460055242",
            path: "assets/images/upgrade_exp-boost.png"
          }
        ]
      },
      {
        id: "upgrade-luck-boost",
        type: "ui",
        category: "upgrade",
        name: "Luck Boost Upgrade",
        description: "Luck boost upgrade icon",
        assets: [
          {
            type: "image",
            horizonAssetId: "2054672501734665",
            path: "assets/images/upgrade_luck-boost.png"
          }
        ]
      },
      {
        id: "upgrade-rooster",
        type: "ui",
        category: "upgrade",
        name: "Rooster Upgrade",
        description: "Rooster upgrade icon",
        assets: [
          {
            type: "image",
            horizonAssetId: "1504708944108154",
            path: "assets/images/upgrade_rooster.png"
          }
        ]
      },
      {
        id: "upgrade-upgraded-box",
        type: "ui",
        category: "upgrade",
        name: "Upgraded Box",
        description: "Upgraded box icon",
        assets: [
          {
            type: "image",
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
                  type: EffectType.DealDamage,
                  target: AbilityTarget.Target,
                  value: 1
                }
              ]
            }
          ],
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
            horizonAssetId: "1574158663591082",
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
                  target: AbilityTarget.Player,
                  value: 1
                }
              ]
            }
          ],
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
            horizonAssetId: "715084184317947",
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
                  target: "Player",
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
                  target: "Player",
                  resource: "Nectar",
                  value: 2,
                  duration: "ThisTurn"
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
                  target: "Player",
                  resource: "Nectar",
                  value: 3,
                  duration: "ThisTurn"
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
                  type: EffectType.Heal,
                  target: AbilityTarget.Target,
                  value: 3
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
                  target: AbilityTarget.Player,
                  value: 1
                }
              ]
            }
          ],
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
                  target: AbilityTarget.Player,
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
            horizonAssetId: "724533667339482",
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
                  target: AbilityTarget.Player,
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
                  target: AbilityTarget.Player,
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
            horizonAssetId: "1356075539231203",
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
