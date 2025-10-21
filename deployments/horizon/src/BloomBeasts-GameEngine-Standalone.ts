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
 * Generated: 2025-10-21T00:57:50.169Z
 * Files: 112
 *
 * @version 1.0.0
 * @license MIT
 */

/* eslint-disable */
/* tslint:disable */

// ==================== Global Type Declarations ====================

// Augment Meta Horizon's Console interface with basic methods
// Only includes log, warn, and error for maximum compatibility
interface Console {
  log(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  error(...args: unknown[]): void;
}

type TimerHandler = (...args: any[]) => any;
declare function setTimeout(callback: TimerHandler, timeout?: number, ...args: unknown[]): number;
declare function setInterval(callback: TimerHandler, timeout?: number, ...args: unknown[]): number;
declare function clearInterval(id: number): void;
declare function clearTimeout(id: number): void;

type CanvasTextAlign = "start" | "end" | "left" | "right" | "center";
type CanvasTextBaseline = "top" | "hanging" | "middle" | "alphabetic" | "ideographic" | "bottom";

interface CanvasRenderingContext2D {
  fillStyle: string | CanvasGradient | CanvasPattern;
  strokeStyle: string | CanvasGradient | CanvasPattern;
  lineWidth: number;
  lineCap: string;
  lineJoin: string;
  miterLimit: number;
  lineDashOffset: number;
  font: string;
  textAlign: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;
  direction: string;
  globalAlpha: number;
  globalCompositeOperation: string;
  imageSmoothingEnabled: boolean;
  shadowBlur: number;
  shadowColor: string;
  shadowOffsetX: number;
  shadowOffsetY: number;

  fillRect(x: number, y: number, w: number, h: number): void;
  strokeRect(x: number, y: number, w: number, h: number): void;
  clearRect(x: number, y: number, w: number, h: number): void;
  fillText(text: string, x: number, y: number, maxWidth?: number): void;
  strokeText(text: string, x: number, y: number, maxWidth?: number): void;
  measureText(text: string): TextMetrics;
  beginPath(): void;
  closePath(): void;
  moveTo(x: number, y: number): void;
  lineTo(x: number, y: number): void;
  arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean): void;
  arcTo(x1: number, y1: number, x2: number, y2: number, radius: number): void;
  bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
  quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
  rect(x: number, y: number, w: number, h: number): void;
  fill(): void;
  stroke(): void;
  clip(): void;
  save(): void;
  restore(): void;
  scale(x: number, y: number): void;
  rotate(angle: number): void;
  translate(x: number, y: number): void;
  transform(a: number, b: number, c: number, d: number, e: number, f: number): void;
  setTransform(a: number, b: number, c: number, d: number, e: number, f: number): void;
  resetTransform(): void;
  drawImage(image: unknown, dx: number, dy: number): void;
  drawImage(image: unknown, dx: number, dy: number, dw: number, dh: number): void;
  drawImage(image: unknown, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
}

interface TextMetrics {
  width: number;
  actualBoundingBoxLeft?: number;
  actualBoundingBoxRight?: number;
  actualBoundingBoxAscent?: number;
  actualBoundingBoxDescent?: number;
}

interface CanvasGradient {
  addColorStop(offset: number, color: string): void;
}

interface CanvasPattern {}

// ==================== BloomBeasts Namespace ====================

namespace BloomBeasts {

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
    // Combat triggers
    OnSummon = 'OnSummon',
    OnAllySummon = 'OnAllySummon',      // When another ally is summoned
    OnAttack = 'OnAttack',
    OnDamage = 'OnDamage',
    OnDestroy = 'OnDestroy',

    // State-based triggers
    OnPlayer1StartOfTurn = 'OnPlayer1StartOfTurn',
    OnPlayer1EndOfTurn = 'OnPlayer1EndOfTurn',
    OnPlayer2StartOfTurn = 'OnPlayer2StartOfTurn',
    OnPlayer2EndOfTurn = 'OnPlayer2EndOfTurn',
    OnAnyStartOfTurn = 'OnAnyStartOfTurn',  // Triggers for any player's start
    OnAnyEndOfTurn = 'OnAnyEndOfTurn',      // Triggers for any player's end
    OnOwnStartOfTurn = 'OnOwnStartOfTurn',  // Triggers only on controlling player's start
    OnOwnEndOfTurn = 'OnOwnEndOfTurn',      // Triggers only on controlling player's end
    OnOpponentStartOfTurn = 'OnOpponentStartOfTurn',  // Triggers on opponent's start
    OnOpponentEndOfTurn = 'OnOpponentEndOfTurn',      // Triggers on opponent's end

    // Ability types
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
    effects: AbilityEffect[];  // Structured effects instead of string
    targetRequired?: boolean;  // Whether the card needs a target
  }

  /**
   * Trap card
   */
  export interface TrapCard extends Card {
    type: 'Trap';
    activation: TrapActivation;  // Structured activation instead of string
    effects: AbilityEffect[];     // Structured effects instead of string
    counters?: Counter[];  // Optional counters on the trap card
  }

  /**
   * Habitat card
   */
  export interface HabitatCard extends Card {
    type: 'Habitat';
    affinity: Affinity;
    ongoingEffects: AbilityEffect[];  // Effects that persist while habitat is active
    onPlayEffects?: AbilityEffect[];  // One-time effects when played
    counters?: Counter[];  // Optional counters on the habitat card
  }

  /**
   * Buff card - stays on board and provides ongoing effects
   */
  export interface BuffCard extends Card {
    type: 'Buff';
    affinity?: Affinity;  // Optional affinity for buff cards
    ongoingEffects: AbilityEffect[];  // Effects that persist while buff is active
    onPlayEffects?: AbilityEffect[];  // One-time effects when played
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
        case EffectType.SearchDeck:
          return this.processSearchDeck(effect as SearchDeckEffect, context);
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
     * Process search deck effect
     */
    private processSearchDeck(
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

  // ==================== bloombeasts\engine\cards\BaseDeck.ts ====================

  /**
   * Base class for all deck types
   */


  export interface DeckCardEntry<T extends AnyCard> {
    card: T;
    quantity: number;
  }

  export interface DeckContents {
    beasts: DeckCardEntry<BloomBeastCard>[];
    habitats: DeckCardEntry<HabitatCard>[];
  }

  /**
   * Abstract base class for deck builders
   */
  export abstract class BaseDeck {
    abstract readonly deckName: string;
    abstract readonly affinity: 'Forest' | 'Fire' | 'Water' | 'Sky';

    /**
     * Get the beast cards for this deck
     */
    protected abstract getBeasts(): DeckCardEntry<BloomBeastCard>[];

    /**
     * Get the habitat cards for this deck
     */
    protected abstract getHabitats(): DeckCardEntry<HabitatCard>[];

    /**
     * Get the complete deck contents
     */
    public getDeckCards(): DeckContents {
      return {
        beasts: this.getBeasts(),
        habitats: this.getHabitats(),
      };
    }

    /**
     * Get all cards as a flat array
     */
    public getAllCards(): AnyCard[] {
      const contents = this.getDeckCards();
      const cards: AnyCard[] = [];

      // Add beast cards
      contents.beasts.forEach(entry => {
        for (let i = 0; i < entry.quantity; i++) {
          cards.push(entry.card);
        }
      });

      // Add habitat cards
      contents.habitats.forEach(entry => {
        for (let i = 0; i < entry.quantity; i++) {
          cards.push(entry.card);
        }
      });

      return cards;
    }

    /**
     * Get total card count (excluding shared cards)
     */
    public getAffinityCardCount(): number {
      const contents = this.getDeckCards();
      const beastCount = contents.beasts.reduce((sum, entry) => sum + entry.quantity, 0);
      const habitatCount = contents.habitats.reduce((sum, entry) => sum + entry.quantity, 0);
      return beastCount + habitatCount;
    }
  }

  // ==================== bloombeasts\engine\cards\CardBuilder.ts ====================

  /**
   * CardBuilder
   *
   * Fluent API for building card definitions with less boilerplate.
   * Simplifies card creation while maintaining type safety.
   */


  /**
   * Builder for Bloom Beast cards
   */
  export class BloomBeastBuilder {
    private card: Partial<BloomBeastCard> = {
      type: 'Bloom',
    };

    constructor(id: string, name: string) {
      this.card.id = id;
      this.card.name = name;
    }

    affinity(affinity: Affinity): this {
      this.card.affinity = affinity;
      return this;
    }

    cost(cost: number): this {
      this.card.cost = cost;
      return this;
    }

    stats(attack: number, health: number): this {
      this.card.baseAttack = attack;
      this.card.baseHealth = health;
      return this;
    }

    attack(attack: number): this {
      this.card.baseAttack = attack;
      return this;
    }

    health(health: number): this {
      this.card.baseHealth = health;
      return this;
    }

    abilities(abilities: StructuredAbility[]): this {
      this.card.abilities = abilities;
      return this;
    }

    ability(ability: StructuredAbility): this {
      this.card.abilities = [ability];
      return this;
    }

    leveling(config: LevelingConfig): this {
      this.card.levelingConfig = config;
      return this;
    }

    titleColor(color: string): this {
      this.card.titleColor = color;
      return this;
    }

    build(): BloomBeastCard {
      // Validate required fields
      if (!this.card.id) throw new Error('Card ID is required');
      if (!this.card.name) throw new Error('Card name is required');
      if (!this.card.affinity) throw new Error('Card affinity is required');
      if (this.card.cost === undefined) throw new Error('Card cost is required');
      if (this.card.baseAttack === undefined) throw new Error('Card attack is required');
      if (this.card.baseHealth === undefined) throw new Error('Card health is required');
      if (!this.card.abilities || this.card.abilities.length === 0) throw new Error('Card abilities are required');

      return this.card as BloomBeastCard;
    }
  }

  /**
   * Builder for Magic cards
   */
  export class MagicCardBuilder {
    private card: Partial<MagicCard> = {
      type: 'Magic',
    };

    constructor(id: string, name: string) {
      this.card.id = id;
      this.card.name = name;
    }

    cost(cost: number): this {
      this.card.cost = cost;
      return this;
    }

    effects(effects: AbilityEffect[]): this {
      this.card.effects = effects;
      return this;
    }

    effect(effect: AbilityEffect): this {
      if (!this.card.effects) {
        this.card.effects = [];
      }
      this.card.effects.push(effect);
      return this;
    }

    requiresTarget(required: boolean = true): this {
      this.card.targetRequired = required;
      return this;
    }

    titleColor(color: string): this {
      this.card.titleColor = color;
      return this;
    }

    build(): MagicCard {
      if (!this.card.id) throw new Error('Card ID is required');
      if (!this.card.name) throw new Error('Card name is required');
      if (this.card.cost === undefined) throw new Error('Card cost is required');
      if (!this.card.effects || this.card.effects.length === 0) {
        throw new Error('Card must have at least one effect');
      }

      return this.card as MagicCard;
    }
  }

  /**
   * Builder for Trap cards
   */
  export class TrapCardBuilder {
    private card: Partial<TrapCard> = {
      type: 'Trap',
    };

    constructor(id: string, name: string) {
      this.card.id = id;
      this.card.name = name;
    }

    cost(cost: number): this {
      this.card.cost = cost;
      return this;
    }

    activation(activation: TrapActivation): this {
      this.card.activation = activation;
      return this;
    }

    effects(effects: AbilityEffect[]): this {
      this.card.effects = effects;
      return this;
    }

    effect(effect: AbilityEffect): this {
      if (!this.card.effects) {
        this.card.effects = [];
      }
      this.card.effects.push(effect);
      return this;
    }

    titleColor(color: string): this {
      this.card.titleColor = color;
      return this;
    }

    build(): TrapCard {
      if (!this.card.id) throw new Error('Card ID is required');
      if (!this.card.name) throw new Error('Card name is required');
      if (this.card.cost === undefined) throw new Error('Card cost is required');
      if (!this.card.activation) throw new Error('Card activation is required');
      if (!this.card.effects || this.card.effects.length === 0) {
        throw new Error('Card must have at least one effect');
      }

      return this.card as TrapCard;
    }
  }

  /**
   * Builder for Habitat cards
   */
  export class HabitatCardBuilder {
    private card: Partial<HabitatCard> = {
      type: 'Habitat',
    };

    constructor(id: string, name: string) {
      this.card.id = id;
      this.card.name = name;
    }

    cost(cost: number): this {
      this.card.cost = cost;
      return this;
    }

    affinity(affinity: Affinity): this {
      this.card.affinity = affinity;
      return this;
    }

    ongoingEffects(effects: AbilityEffect[]): this {
      this.card.ongoingEffects = effects;
      return this;
    }

    onPlayEffects(effects: AbilityEffect[]): this {
      this.card.onPlayEffects = effects;
      return this;
    }

    titleColor(color: string): this {
      this.card.titleColor = color;
      return this;
    }

    build(): HabitatCard {
      if (!this.card.id) throw new Error('Card ID is required');
      if (!this.card.name) throw new Error('Card name is required');
      if (this.card.cost === undefined) throw new Error('Card cost is required');
      if (!this.card.affinity) throw new Error('Card affinity is required');
      if (!this.card.ongoingEffects || this.card.ongoingEffects.length === 0) {
        throw new Error('Habitat must have at least one ongoing effect');
      }

      return this.card as HabitatCard;
    }
  }

  /**
   * Builder for Buff cards
   */
  export class BuffCardBuilder {
    private card: Partial<BuffCard> = {
      type: 'Buff',
    };

    constructor(id: string, name: string) {
      this.card.id = id;
      this.card.name = name;
    }

    cost(cost: number): this {
      this.card.cost = cost;
      return this;
    }

    affinity(affinity: Affinity): this {
      this.card.affinity = affinity;
      return this;
    }

    ongoingEffects(effects: AbilityEffect[]): this {
      this.card.ongoingEffects = effects;
      return this;
    }

    onPlayEffects(effects: AbilityEffect[]): this {
      this.card.onPlayEffects = effects;
      return this;
    }

    duration(turns: number): this {
      this.card.duration = turns;
      return this;
    }

    titleColor(color: string): this {
      this.card.titleColor = color;
      return this;
    }

    build(): BuffCard {
      if (!this.card.id) throw new Error('Card ID is required');
      if (!this.card.name) throw new Error('Card name is required');
      if (this.card.cost === undefined) throw new Error('Card cost is required');
      if (!this.card.ongoingEffects || this.card.ongoingEffects.length === 0) {
        throw new Error('Buff must have at least one ongoing effect');
      }

      return this.card as BuffCard;
    }
  }

  /**
   * Main CardBuilder factory
   */
  export class CardBuilder {
    static bloomBeast(id: string, name: string): BloomBeastBuilder {
      return new BloomBeastBuilder(id, name);
    }

    static magic(id: string, name: string): MagicCardBuilder {
      return new MagicCardBuilder(id, name);
    }

    static trap(id: string, name: string): TrapCardBuilder {
      return new TrapCardBuilder(id, name);
    }

    static habitat(id: string, name: string): HabitatCardBuilder {
      return new HabitatCardBuilder(id, name);
    }

    static buff(id: string, name: string): BuffCardBuilder {
      return new BuffCardBuilder(id, name);
    }
  }

  // Export default for convenience

  // ==================== bloombeasts\engine\cards\fire\cinderPup.ts ====================

  /**
   * Cinder Pup - Burn applier with additional burn mechanic
   */


  const cinderPupPassive: StructuredAbility = {
    name: 'Burning Passion',
    trigger: AbilityTrigger.OnAttack,
    effects: [
      {
        type: EffectType.ApplyCounter,
        target: AbilityTarget.Target,
        counter: 'Burn',
        value: 1,
      },
    ],
  };

  const cinderPupBloom: StructuredAbility = {
    name: 'Spitfire',
    trigger: AbilityTrigger.Activated,
    cost: {
      type: CostType.Discard,
      value: 1,
    },
    effects: [
      {
        type: EffectType.ApplyCounter,
        target: AbilityTarget.Target,
        counter: 'Burn',
        value: 1,
      },
    ],
  };

  // Level 4 upgrades
  const cinderPupPassive4: StructuredAbility = {
    name: 'Inferno Bite',
    trigger: AbilityTrigger.OnAttack,
    effects: [
      {
        type: EffectType.ApplyCounter,
        target: AbilityTarget.Target,
        counter: 'Burn',
        value: 2,
      },
    ],
  };

  // Level 7 upgrades
  const cinderPupBloom7: StructuredAbility = {
    name: 'Flame Burst',
    trigger: AbilityTrigger.Activated,
    cost: {
      type: CostType.Discard,
      value: 1,
    },
    effects: [
      {
        type: EffectType.ApplyCounter,
        target: AbilityTarget.AllEnemies,
        counter: 'Burn',
        value: 2,
      },
    ],
  };

  // Level 9 upgrades
  const cinderPupPassive9: StructuredAbility = {
    name: 'Wildfire Aura',
    trigger: AbilityTrigger.OnAttack,
    effects: [
      {
        type: EffectType.ApplyCounter,
        target: AbilityTarget.Target,
        counter: 'Burn',
        value: 3,
      },
    ],
  };

  const cinderPupBloom9: StructuredAbility = {
    name: 'Apocalypse Flame',
    trigger: AbilityTrigger.Activated,
    effects: [
      {
        type: EffectType.ApplyCounter,
        target: AbilityTarget.AllEnemies,
        counter: 'Burn',
        value: 3,
      },
      {
        type: EffectType.DealDamage,
        target: AbilityTarget.OpponentGardener,
        value: 2,
      },
    ],
  };

  export const CINDER_PUP: BloomBeastCard = CardBuilder.bloomBeast('cinder-pup', 'Cinder Pup')
    .affinity('Fire')
    .cost(2)
    .stats(2, 3)
    .abilities([cinderPupPassive])
    .leveling({
      statGains: {
        1: { hp: 0, atk: 0 },
        2: { hp: 1, atk: 1 },
        3: { hp: 2, atk: 2 },
        4: { hp: 3, atk: 3 },
        5: { hp: 4, atk: 4 },
        6: { hp: 5, atk: 5 },
        7: { hp: 6, atk: 6 },
        8: { hp: 7, atk: 7 },
        9: { hp: 8, atk: 8 },
      },
      abilityUpgrades: {
        4: {
          abilities: [cinderPupPassive4],
        },
        7: {
          abilities: [cinderPupBloom7],
        },
        9: {
          abilities: [cinderPupPassive9],
        },
      },
    })
    .build();

  // ==================== bloombeasts\engine\cards\fire\blazefinch.ts ====================

  /**
   * Blazefinch - Fast attacker with execute mechanic
   */


  const blazefinchPassive: StructuredAbility = {
    name: 'Quick Strike',
    trigger: AbilityTrigger.Passive,
    effects: [
      {
        type: EffectType.RemoveSummoningSickness,
        target: AbilityTarget.Self,
      },
    ],
  };

  const blazefinchBloom: StructuredAbility = {
    name: 'Incinerate',
    trigger: AbilityTrigger.OnAttack,
    effects: [
      {
        type: EffectType.AttackModification,
        target: AbilityTarget.Self,
        modification: 'double-damage',
        condition: {
          type: ConditionType.IsWilting,
        },
      },
    ],
  };

  // Level 4 upgrades
  const blazefinchBloom4: StructuredAbility = {
    name: 'Ember Strike',
    trigger: AbilityTrigger.OnAttack,
    effects: [
      {
        type: EffectType.AttackModification,
        target: AbilityTarget.Self,
        modification: 'triple-damage',
        condition: {
          type: ConditionType.IsDamaged,
        },
      },
    ],
  };

  // Level 7 upgrades
  const blazefinchPassive7: StructuredAbility = {
    name: 'Lightning Speed',
    trigger: AbilityTrigger.Passive,
    effects: [
      {
        type: EffectType.RemoveSummoningSickness,
        target: AbilityTarget.Self,
      },
      {
        type: EffectType.AttackModification,
        target: AbilityTarget.Self,
        modification: 'attack-twice',
      },
    ],
  };

  // Level 9 upgrades
  const blazefinchPassive9: StructuredAbility = {
    name: 'Phoenix Form',
    trigger: AbilityTrigger.Passive,
    effects: [
      {
        type: EffectType.AttackModification,
        target: AbilityTarget.Self,
        modification: 'attack-twice',
      },
      // Note: Return to hand on death would need a separate OnDestroy trigger
    ],
  };

  const blazefinchBloom9: StructuredAbility = {
    name: 'Annihilation',
    trigger: AbilityTrigger.OnAttack,
    effects: [
      {
        type: EffectType.AttackModification,
        target: AbilityTarget.Self,
        modification: 'instant-destroy',
        condition: {
          type: ConditionType.IsDamaged,
        },
      },
    ],
  };

  export const BLAZEFINCH: BloomBeastCard = CardBuilder.bloomBeast('blazefinch', 'Blazefinch')
    .affinity('Fire')
    .cost(1)
    .stats(1, 2)
    .abilities([blazefinchPassive])
    .leveling({
      statGains: {
        1: { hp: 0, atk: 0 },
        2: { hp: 0, atk: 1 },
        3: { hp: 0, atk: 3 },
        4: { hp: 1, atk: 5 },
        5: { hp: 1, atk: 6 },
        6: { hp: 2, atk: 8 },
        7: { hp: 2, atk: 9 },
        8: { hp: 3, atk: 11 },
        9: { hp: 3, atk: 13 },
      },
      abilityUpgrades: {
        4: {
          abilities: [blazefinchBloom4],
        },
        7: {
          abilities: [blazefinchPassive7],
        },
        9: {
          abilities: [blazefinchPassive9],
        },
      },
    })
    .build();

  // ==================== bloombeasts\engine\cards\fire\magmite.ts ====================

  /**
   * Magmite - Tanky finisher with death effect
   */


  const magmitePassive: StructuredAbility = {
    name: 'Hardened Shell',
    trigger: AbilityTrigger.Passive,
    effects: [
      {
        type: EffectType.DamageReduction,
        target: AbilityTarget.Self,
        value: 1,
        duration: EffectDuration.WhileOnField,
      },
    ],
  };

  const magmiteBloom: StructuredAbility = {
    name: 'Volcanic Burst',
    trigger: AbilityTrigger.OnDestroy,
    effects: [
      {
        type: EffectType.DealDamage,
        target: AbilityTarget.OpponentGardener,
        value: 3,
      },
    ],
  };

  // Level 4 upgrades
  const magmitePassive4: StructuredAbility = {
    name: 'Molten Armor',
    trigger: AbilityTrigger.Passive,
    effects: [
      {
        type: EffectType.DamageReduction,
        target: AbilityTarget.Self,
        value: 2,
        duration: EffectDuration.WhileOnField,
      },
    ],
  };

  // Level 7 upgrades
  const magmiteBloom7: StructuredAbility = {
    name: 'Eruption',
    trigger: AbilityTrigger.OnDestroy,
    effects: [
      {
        type: EffectType.DealDamage,
        target: AbilityTarget.OpponentGardener,
        value: 5,
      },
      {
        type: EffectType.DealDamage,
        target: AbilityTarget.AllEnemies,
        value: 2,
      },
    ],
  };

  // Level 9 upgrades
  const magmitePassive9: StructuredAbility = {
    name: 'Obsidian Carapace',
    trigger: AbilityTrigger.Passive,
    effects: [
      {
        type: EffectType.DamageReduction,
        target: AbilityTarget.Self,
        value: 3,
        duration: EffectDuration.WhileOnField,
      },
      {
        type: EffectType.Retaliation,
        target: AbilityTarget.Attacker,
        value: 2,
      },
    ],
  };

  const magmiteBloom9: StructuredAbility = {
    name: 'Cataclysm',
    trigger: AbilityTrigger.OnDestroy,
    effects: [
      {
        type: EffectType.DealDamage,
        target: AbilityTarget.OpponentGardener,
        value: 8,
      },
      {
        type: EffectType.Destroy,
        target: AbilityTarget.AllEnemies,
        condition: {
          type: ConditionType.HealthBelow,
          value: 4,
          comparison: Comparison.Less,
        },
      },
    ],
  };

  export const MAGMITE: BloomBeastCard = CardBuilder.bloomBeast('magmite', 'Magmite')
    .affinity('Fire')
    .cost(3)
    .stats(4, 6)
    .abilities([magmitePassive])
    .leveling({
      statGains: {
        1: { hp: 0, atk: 0 },
        2: { hp: 2, atk: 1 },
        3: { hp: 3, atk: 2 },
        4: { hp: 5, atk: 3 },
        5: { hp: 7, atk: 4 },
        6: { hp: 9, atk: 5 },
        7: { hp: 11, atk: 6 },
        8: { hp: 13, atk: 7 },
        9: { hp: 15, atk: 9 },
      },
      abilityUpgrades: {
        4: {
          abilities: [magmitePassive4],
        },
        7: {
          abilities: [magmiteBloom7],
        },
        9: {
          abilities: [magmitePassive9],
        },
      },
    })
    .build();

  // ==================== bloombeasts\engine\cards\fire\charcoil.ts ====================

  /**
   * Charcoil - Defensive creature with retaliation
   */


  const charcoilPassive: StructuredAbility = {
    name: 'Sooty Defense',
    trigger: AbilityTrigger.OnDamage,
    effects: [
      {
        type: EffectType.ApplyCounter,
        target: AbilityTarget.Target,
        counter: 'Soot',
        value: 1,
      },
    ],
  };

  const charcoilBloom: StructuredAbility = {
    name: 'Flame Retaliation',
    trigger: AbilityTrigger.OnDamage,
    effects: [
      {
        type: EffectType.Retaliation,
        target: AbilityTarget.Attacker,
        value: 1,
      },
    ],
  };

  // Level 4 upgrades
  const charcoilBloom4: StructuredAbility = {
    name: 'Burning Retaliation',
    trigger: AbilityTrigger.OnDamage,
    effects: [
      {
        type: EffectType.Retaliation,
        target: AbilityTarget.Attacker,
        value: 2,
      },
      {
        type: EffectType.ApplyCounter,
        target: AbilityTarget.Attacker,
        counter: 'Burn',
        value: 1,
      },
    ],
  };

  // Level 7 upgrades
  const charcoilPassive7: StructuredAbility = {
    name: 'Smoke Screen',
    trigger: AbilityTrigger.OnDamage,
    effects: [
      {
        type: EffectType.Immunity,
        target: AbilityTarget.Self,
        immuneTo: [ImmunityType.Magic, ImmunityType.Trap],
        duration: EffectDuration.WhileOnField,
      },
      {
        type: EffectType.ApplyCounter,
        target: AbilityTarget.Target,
        counter: 'Soot',
        value: 2,
      },
    ],
  };

  // Level 9 upgrades
  const charcoilPassive9: StructuredAbility = {
    name: 'Blazing Vengeance',
    trigger: AbilityTrigger.OnDamage,
    effects: [
      {
        type: EffectType.Immunity,
        target: AbilityTarget.Self,
        immuneTo: [ImmunityType.Magic, ImmunityType.Trap],
        duration: EffectDuration.WhileOnField,
      },
      {
        type: EffectType.ApplyCounter,
        target: AbilityTarget.Attacker,
        counter: 'Burn',
        value: 3,
      },
    ],
  };

  const charcoilBloom9: StructuredAbility = {
    name: 'Infernal Reflection',
    trigger: AbilityTrigger.OnDamage,
    effects: [
      {
        type: EffectType.Retaliation,
        target: AbilityTarget.Attacker,
        value: 'reflected',
      },
      {
        type: EffectType.ApplyCounter,
        target: AbilityTarget.Attacker,
        counter: 'Burn',
        value: 2,
      },
    ],
  };

  export const CHARCOIL: BloomBeastCard = CardBuilder.bloomBeast('charcoil', 'Charcoil')
    .affinity('Fire')
    .cost(2)
    .stats(3, 4)
    .abilities([charcoilBloom])
    .leveling({
      statGains: {
        1: { hp: 0, atk: 0 },
        2: { hp: 1, atk: 1 },
        3: { hp: 2, atk: 2 },
        4: { hp: 4, atk: 3 },
        5: { hp: 5, atk: 4 },
        6: { hp: 6, atk: 5 },
        7: { hp: 8, atk: 6 },
        8: { hp: 9, atk: 7 },
        9: { hp: 11, atk: 8 },
      },
      abilityUpgrades: {
        4: {
          abilities: [charcoilBloom4],
        },
        7: {
          abilities: [charcoilPassive7],
        },
        9: {
          abilities: [charcoilPassive9],
        },
      },
    })
    .build();

  // ==================== bloombeasts\engine\cards\fire\volcanicScar.ts ====================

  /**
   * Volcanic Scar - Fire Habitat Card
   */


  // On play effect: Deal 1 damage to all non-Fire beasts
  const damageNonFire: DamageEffect = {
    type: EffectType.DealDamage,
    target: AbilityTarget.AllUnits,
    value: 1,
    condition: {
      type: 'affinity-not-matches' as any, // Exclude Fire affinity beasts
      value: 'Fire'
    }
  };

  export const VOLCANIC_SCAR: HabitatCard = {
    id: 'volcanic-scar',
    name: 'Volcanic Scar',
    type: 'Habitat',
    affinity: 'Fire',
    cost: 1,
    onPlayEffects: [damageNonFire],
    ongoingEffects: []
  };

  // ==================== bloombeasts\engine\cards\fire\index.ts ====================

  /**
   * Fire Affinity Deck - The Aggro Deck
   * Strategy: Direct damage, persistent Burn effects, overwhelming early ATK
   */


  // Import all Fire cards

  // Re-export all cards for external use

  /**
   * Fire Deck implementation
   */
  export class FireDeck extends BaseDeck {
    readonly deckName = 'Fire Starter: The Aggro Deck';
    readonly affinity = 'Fire' as const;

    protected getBeasts(): DeckCardEntry<BloomBeastCard>[] {
      return [
        { card: CINDER_PUP, quantity: 4 },
        { card: BLAZEFINCH, quantity: 4 },
        { card: MAGMITE, quantity: 2 },
        { card: CHARCOIL, quantity: 3 },
      ];
    }

    protected getHabitats(): DeckCardEntry<HabitatCard>[] {
      return [
        { card: VOLCANIC_SCAR, quantity: 3 },
      ];
    }
  }

  /**
   * Factory function for backward compatibility
   */
  export function getFireDeckCards() {
    const deck = new FireDeck();
    return deck.getDeckCards();
  }

  // ==================== bloombeasts\engine\cards\water\bubblefin.ts ====================

  /**
   * Bubblefin - Protected defender with attack reduction
   */


  const bubblefinPassive: StructuredAbility = {
    name: 'Emerge',
    trigger: AbilityTrigger.Passive,
    effects: [
      {
        type: EffectType.CannotBeTargeted,
        target: AbilityTarget.Self,
        by: ['trap'],
      },
    ],
  };

  const bubblefinBloom: StructuredAbility = {
    name: 'Dampen',
    trigger: AbilityTrigger.OnDamage,
    effects: [
      {
        type: EffectType.ModifyStats,
        target: AbilityTarget.Attacker,
        stat: StatType.Attack,
        value: -1,
        duration: EffectDuration.EndOfTurn,
      },
    ],
  };

  // Level 4 upgrades
  const bubblefinBloom4: StructuredAbility = {
    name: 'Tidal Shield',
    trigger: AbilityTrigger.OnDamage,
    effects: [
      {
        type: EffectType.ModifyStats,
        target: AbilityTarget.Attacker,
        stat: StatType.Attack,
        value: -2,
        duration: EffectDuration.EndOfTurn,
      },
    ],
  };

  // Level 7 upgrades
  const bubblefinPassive7: StructuredAbility = {
    name: 'Deep Dive',
    trigger: AbilityTrigger.Passive,
    effects: [
      {
        type: EffectType.CannotBeTargeted,
        target: AbilityTarget.Self,
        by: ['trap', 'magic'],
      },
    ],
  };

  // Level 9 upgrades
  const bubblefinPassive9: StructuredAbility = {
    name: 'Ocean Sanctuary',
    trigger: AbilityTrigger.Passive,
    effects: [
      {
        type: EffectType.CannotBeTargeted,
        target: AbilityTarget.Self,
        by: ['magic', 'trap', 'abilities'],
      },
    ],
  };

  const bubblefinBloom9: StructuredAbility = {
    name: 'Crushing Depths',
    trigger: AbilityTrigger.OnDamage,
    effects: [
      {
        type: EffectType.ModifyStats,
        target: AbilityTarget.Attacker,
        stat: StatType.Attack,
        value: -3,
        duration: EffectDuration.Permanent,
      },
      {
        type: EffectType.Heal,
        target: AbilityTarget.Self,
        value: 2,
      },
    ],
  };

  export const BUBBLEFIN: BloomBeastCard = CardBuilder.bloomBeast('bubblefin', 'Bubblefin')
    .affinity('Water')
    .cost(2)
    .stats(2, 5)
    .abilities([bubblefinPassive])
    .leveling({
      statGains: {
        1: { hp: 0, atk: 0 },
        2: { hp: 2, atk: 0 },
        3: { hp: 4, atk: 0 },
        4: { hp: 6, atk: 1 },
        5: { hp: 8, atk: 2 },
        6: { hp: 10, atk: 3 },
        7: { hp: 12, atk: 4 },
        8: { hp: 14, atk: 5 },
        9: { hp: 16, atk: 6 },
      },
      abilityUpgrades: {
        4: {
          abilities: [bubblefinBloom4],
        },
        7: {
          abilities: [bubblefinPassive7],
        },
        9: {
          abilities: [bubblefinPassive9],
        },
      },
    })
    .build();

  // ==================== bloombeasts\engine\cards\water\aquaPebble.ts ====================

  /**
   * Aqua-Pebble - Synergy attacker with healing
   */


  const aquaPebblePassive: StructuredAbility = {
    name: 'Tide Flow',
    trigger: AbilityTrigger.OnAllySummon,
    effects: [
      {
        type: EffectType.ModifyStats,
        target: AbilityTarget.Self,
        stat: StatType.Attack,
        value: 1,
        duration: EffectDuration.EndOfTurn,
        condition: {
          type: ConditionType.AffinityMatches,
          value: 'Water',
        },
      },
    ],
  };

  const aquaPebbleBloom: StructuredAbility = {
    name: 'Hydration',
    trigger: AbilityTrigger.OnOwnEndOfTurn,
    effects: [
      {
        type: EffectType.Heal,
        target: AbilityTarget.OtherAlly,
        value: 1,
      },
    ],
  };

  // Level 4 upgrades
  const aquaPebblePassive4: StructuredAbility = {
    name: 'Tidal Surge',
    trigger: AbilityTrigger.OnAllySummon,
    effects: [
      {
        type: EffectType.ModifyStats,
        target: AbilityTarget.Self,
        stat: StatType.Attack,
        value: 2,
        duration: EffectDuration.EndOfTurn,
        condition: {
          type: ConditionType.AffinityMatches,
          value: 'Water',
        },
      },
    ],
  };

  // Level 7 upgrades
  const aquaPebbleBloom7: StructuredAbility = {
    name: 'Rejuvenation',
    trigger: AbilityTrigger.OnOwnEndOfTurn,
    effects: [
      {
        type: EffectType.Heal,
        target: AbilityTarget.AllAllies,
        value: 2,
      },
    ],
  };

  // Level 9 upgrades
  const aquaPebblePassive9: StructuredAbility = {
    name: 'Tsunami Force',
    trigger: AbilityTrigger.OnAllySummon,
    effects: [
      {
        type: EffectType.ModifyStats,
        target: AbilityTarget.Self,
        stat: StatType.Attack,
        value: 3,
        duration: EffectDuration.Permanent,
        condition: {
          type: ConditionType.AffinityMatches,
          value: 'Water',
        },
      },
    ],
  };

  const aquaPebbleBloom9: StructuredAbility = {
    name: 'Fountain of Life',
    trigger: AbilityTrigger.OnOwnEndOfTurn,
    effects: [
      {
        type: EffectType.Heal,
        target: AbilityTarget.AllAllies,
        value: HealValueType.Full,
      },
    ],
  };

  export const AQUA_PEBBLE: BloomBeastCard = {
    id: 'aqua-pebble',
    name: 'Aqua Pebble',
    type: 'Bloom',
    affinity: 'Water',
    cost: 1,
    baseAttack: 1,
    baseHealth: 4,
    abilities: [aquaPebblePassive],
    levelingConfig: {
      statGains: {
        1: { hp: 0, atk: 0 },
        2: { hp: 1, atk: 0 },
        3: { hp: 3, atk: 0 },
        4: { hp: 4, atk: 1 },
        5: { hp: 6, atk: 2 },
        6: { hp: 7, atk: 3 },
        7: { hp: 9, atk: 4 },
        8: { hp: 10, atk: 5 },
        9: { hp: 12, atk: 6 },
      },
      abilityUpgrades: {
        4: {
          abilities: [aquaPebblePassive4],
        },
        7: {
          abilities: [aquaPebbleBloom7],
        },
        9: {
          abilities: [aquaPebblePassive9],
        },
      },
    },
  };

  // ==================== bloombeasts\engine\cards\water\dewdropDrake.ts ====================

  /**
   * Dewdrop Drake - Protected finisher with direct damage
   */


  const dewdropDrakePassive: StructuredAbility = {
    name: 'Mist Screen',
    trigger: AbilityTrigger.Passive,
    effects: [
      {
        type: EffectType.AttackModification,
        target: AbilityTarget.Self,
        modification: 'attack-first',
        condition: {
          type: ConditionType.UnitsOnField,
          value: 1,
          comparison: Comparison.Equal,
        },
      },
    ],
  };

  const dewdropDrakeBloom: StructuredAbility = {
    name: 'Torrent',
    trigger: AbilityTrigger.OnAttack,
    cost: {
      type: CostType.Nectar,
      value: 1,
    },
    effects: [
      {
        type: EffectType.DealDamage,
        target: AbilityTarget.OpponentGardener,
        value: 2,
      },
    ],
  };

  // Level 4 upgrades
  const dewdropDrakeBloom4: StructuredAbility = {
    name: 'Deluge',
    trigger: AbilityTrigger.OnAttack,
    cost: {
      type: CostType.Nectar,
      value: 1,
    },
    effects: [
      {
        type: EffectType.DealDamage,
        target: AbilityTarget.OpponentGardener,
        value: 3,
      },
    ],
  };

  // Level 7 upgrades
  const dewdropDrakePassive7: StructuredAbility = {
    name: 'Fog Veil',
    trigger: AbilityTrigger.Passive,
    effects: [
      {
        type: EffectType.AttackModification,
        target: AbilityTarget.Self,
        modification: 'attack-first',
      },
      {
        type: EffectType.DamageReduction,
        target: AbilityTarget.Self,
        value: 1,
        duration: EffectDuration.WhileOnField,
      },
    ],
  };

  // Level 9 upgrades
  const dewdropDrakePassive9: StructuredAbility = {
    name: 'Storm Guardian',
    trigger: AbilityTrigger.Passive,
    effects: [
      {
        type: EffectType.AttackModification,
        target: AbilityTarget.Self,
        modification: 'attack-first',
      },
      {
        type: EffectType.DamageReduction,
        target: AbilityTarget.Self,
        value: 2,
        duration: EffectDuration.WhileOnField,
      },
    ],
  };

  const dewdropDrakeBloom9: StructuredAbility = {
    name: 'Maelstrom',
    trigger: AbilityTrigger.OnAttack,
    effects: [
      {
        type: EffectType.DealDamage,
        target: AbilityTarget.OpponentGardener,
        value: 5,
      },
      {
        type: EffectType.ApplyCounter,
        target: AbilityTarget.RandomEnemy,
        counter: 'Freeze',
        value: 1,
      },
    ],
  };

  export const DEWDROP_DRAKE: BloomBeastCard = {
    id: 'dewdrop-drake',
    name: 'Dewdrop Drake',
    type: 'Bloom',
    affinity: 'Water',
    cost: 3,
    baseAttack: 3,
    baseHealth: 6,
    abilities: [dewdropDrakePassive],
    levelingConfig: {
      statGains: {
        1: { hp: 0, atk: 0 },
        2: { hp: 1, atk: 1 },
        3: { hp: 2, atk: 2 },
        4: { hp: 4, atk: 3 },
        5: { hp: 6, atk: 4 },
        6: { hp: 8, atk: 5 },
        7: { hp: 10, atk: 6 },
        8: { hp: 12, atk: 7 },
        9: { hp: 14, atk: 8 },
      },
      abilityUpgrades: {
        4: {
          abilities: [dewdropDrakeBloom4],
        },
        7: {
          abilities: [dewdropDrakePassive7],
        },
        9: {
          abilities: [dewdropDrakePassive9],
        },
      },
    },
  };

  // ==================== bloombeasts\engine\cards\water\kelpCub.ts ====================

  /**
   * Kelp Cub - Control creature with immobilization
   */


  const kelpCubPassive: StructuredAbility = {
    name: 'Entangle',
    trigger: AbilityTrigger.OnAttack,
    effects: [
      {
        type: EffectType.PreventAttack,
        target: AbilityTarget.Target,
        duration: EffectDuration.StartOfNextTurn,
      },
    ],
  };

  const kelpCubBloom: StructuredAbility = {
    name: 'Anchor',
    trigger: AbilityTrigger.Passive,
    effects: [
      {
        type: EffectType.Immunity,
        target: AbilityTarget.Self,
        immuneTo: [ImmunityType.Magic, ImmunityType.Trap],
        duration: EffectDuration.WhileOnField,
      },
    ],
  };

  // Level 4 upgrades
  const kelpCubPassive4: StructuredAbility = {
    name: 'Binding Vines',
    trigger: AbilityTrigger.OnAttack,
    effects: [
      {
        type: EffectType.PreventAttack,
        target: AbilityTarget.Target,
        duration: EffectDuration.StartOfNextTurn,
      },
      {
        type: EffectType.PreventAbilities,
        target: AbilityTarget.Target,
        duration: EffectDuration.StartOfNextTurn,
      },
    ],
  };

  // Level 7 upgrades
  const kelpCubBloom7: StructuredAbility = {
    name: 'Deep Anchor',
    trigger: AbilityTrigger.Passive,
    effects: [
      {
        type: EffectType.Immunity,
        target: AbilityTarget.Self,
        immuneTo: [ImmunityType.Magic, ImmunityType.Trap, ImmunityType.Abilities],
        duration: EffectDuration.WhileOnField,
      },
    ],
  };

  // Level 9 upgrades
  const kelpCubPassive9: StructuredAbility = {
    name: 'Strangling Grasp',
    trigger: AbilityTrigger.OnAttack,
    effects: [
      {
        type: EffectType.PreventAttack,
        target: AbilityTarget.Target,
        duration: EffectDuration.Permanent,
      },
      {
        type: EffectType.PreventAbilities,
        target: AbilityTarget.Target,
        duration: EffectDuration.Permanent,
      },
    ],
  };

  const kelpCubBloom9: StructuredAbility = {
    name: 'Immovable Force',
    trigger: AbilityTrigger.Passive,
    effects: [
      {
        type: EffectType.Immunity,
        target: AbilityTarget.Self,
        immuneTo: [ImmunityType.Damage, ImmunityType.Targeting, ImmunityType.NegativeEffects],
        duration: EffectDuration.WhileOnField,
      },
      {
        type: EffectType.Retaliation,
        target: AbilityTarget.Self,
        value: 0,
        applyCounter: 'Entangle',
        counterValue: 1,
      },
    ],
  };

  export const KELP_CUB: BloomBeastCard = {
    id: 'kelp-cub',
    name: 'Kelp Cub',
    type: 'Bloom',
    affinity: 'Water',
    cost: 2,
    baseAttack: 3,
    baseHealth: 3,
    abilities: [kelpCubPassive],
    levelingConfig: {
      statGains: {
        1: { hp: 0, atk: 0 },
        2: { hp: 1, atk: 1 },
        3: { hp: 2, atk: 2 },
        4: { hp: 3, atk: 3 },
        5: { hp: 4, atk: 4 },
        6: { hp: 5, atk: 5 },
        7: { hp: 6, atk: 6 },
        8: { hp: 7, atk: 7 },
        9: { hp: 8, atk: 8 },
      },
      abilityUpgrades: {
        4: {
          abilities: [kelpCubPassive4],
        },
        7: {
          abilities: [kelpCubBloom7],
        },
        9: {
          abilities: [kelpCubPassive9],
        },
      },
    },
  };

  // ==================== bloombeasts\engine\cards\water\deepSeaGrotto.ts ====================

  /**
   * Deep Sea Grotto - Water Habitat Card
   */


  // Ongoing effect: All Water Beasts gain +1 Attack
  const waterBeastBonus: StatModificationEffect = {
    type: EffectType.ModifyStats,
    target: AbilityTarget.AllAllies,
    stat: StatType.Attack,
    value: 1,
    duration: EffectDuration.WhileOnField,
    condition: {
      type: ConditionType.AffinityMatches,
      value: 'Water'
    }
  };

  export const DEEP_SEA_GROTTO: HabitatCard = {
    id: 'deep-sea-grotto',
    name: 'Deep Sea Grotto',
    type: 'Habitat',
    affinity: 'Water',
    cost: 1,
    ongoingEffects: [waterBeastBonus],
    onPlayEffects: []
  };

  // ==================== bloombeasts\engine\cards\water\index.ts ====================

  /**
   * Water Affinity Deck - The Control Deck
   * Strategy: Defense, healing, and control via preventing effects and attacks
   */


  // Import all Water cards

  // Re-export all cards for external use

  /**
   * Water Deck implementation
   */
  export class WaterDeck extends BaseDeck {
    readonly deckName = 'Water Starter: The Control Deck';
    readonly affinity = 'Water' as const;

    protected getBeasts(): DeckCardEntry<BloomBeastCard>[] {
      return [
        { card: BUBBLEFIN, quantity: 4 },
        { card: AQUA_PEBBLE, quantity: 4 },
        { card: DEWDROP_DRAKE, quantity: 2 },
        { card: KELP_CUB, quantity: 3 },
      ];
    }

    protected getHabitats(): DeckCardEntry<HabitatCard>[] {
      return [
        { card: DEEP_SEA_GROTTO, quantity: 3 },
      ];
    }
  }

  /**
   * Factory function for backward compatibility
   */
  export function getWaterDeckCards() {
    const deck = new WaterDeck();
    return deck.getDeckCards();
  }

  // ==================== bloombeasts\engine\cards\forest\mosslet.ts ====================

  /**
   * Mosslet - Defensive tank with spore mechanics
   */


  const mossletPassive: StructuredAbility = {
    name: 'Spores of Defense',
    trigger: AbilityTrigger.OnDamage,
    effects: [
      {
        type: EffectType.ApplyCounter,
        target: AbilityTarget.Self,
        counter: 'Spore',
        value: 1,
      },
    ],
  };

  const mossletBloom: StructuredAbility = {
    name: 'Rapid Growth',
    trigger: AbilityTrigger.OnOwnStartOfTurn,
    effects: [
      {
        type: EffectType.Heal,
        target: AbilityTarget.Self,
        value: 1,
        // Implementation note: Value should be calculated as floor(SporeCounters / 2) at runtime
        // This requires the game engine to check habitat counters during processing
      } as any,
    ],
  };

  // Level 4 upgrades
  const mossletPassive4: StructuredAbility = {
    name: 'Spore Burst',
    trigger: AbilityTrigger.OnDamage,
    effects: [
      {
        type: EffectType.ApplyCounter,
        target: AbilityTarget.Self,
        counter: 'Spore',
        value: 2,
      },
    ],
  };

  // Level 7 upgrades
  const mossletBloom7: StructuredAbility = {
    name: 'Accelerated Growth',
    trigger: AbilityTrigger.OnOwnStartOfTurn,
    effects: [
      {
        type: EffectType.Heal,
        target: AbilityTarget.Self,
        value: 2,
        // Implementation note: Value should be calculated as 2 * floor(SporeCounters / 2) at runtime
      } as any,
    ],
  };

  // Level 9 upgrades
  const mossletPassive9: StructuredAbility = {
    name: 'Spore Dominance',
    trigger: AbilityTrigger.OnDamage,
    effects: [
      {
        type: EffectType.ApplyCounter,
        target: AbilityTarget.Self,
        counter: 'Spore',
        value: 2,
      },
      {
        type: EffectType.Heal,
        target: AbilityTarget.Self,
        value: 1,
      },
    ],
  };

  const mossletBloom9: StructuredAbility = {
    name: 'Maximum Bloom',
    trigger: AbilityTrigger.OnOwnStartOfTurn,
    effects: [
      {
        type: EffectType.Heal,
        target: AbilityTarget.Self,
        value: 3,
        // Implementation note: Value should be calculated as 3 * floor(SporeCounters / 2) at runtime
      } as any,
      {
        type: EffectType.Heal,
        target: AbilityTarget.AdjacentAllies,
        value: 1,
      },
    ],
  };

  export const MOSSLET: BloomBeastCard = {
    id: 'mosslet',
    name: 'Mosslet',
    type: 'Bloom',
    affinity: 'Forest',
    cost: 2,
    baseAttack: 2,
    baseHealth: 4,
    abilities: [mossletPassive],
    levelingConfig: {
      statGains: {
        1: { hp: 0, atk: 0 },
        2: { hp: 2, atk: 0 },
        3: { hp: 3, atk: 1 },
        4: { hp: 5, atk: 2 },
        5: { hp: 7, atk: 3 },
        6: { hp: 9, atk: 4 },
        7: { hp: 11, atk: 5 },
        8: { hp: 13, atk: 6 },
        9: { hp: 15, atk: 7 },
      },
      abilityUpgrades: {
        4: {
          abilities: [mossletPassive4],
        },
        7: {
          abilities: [mossletBloom7],
        },
        9: {
          abilities: [mossletPassive9],
        },
      },
    },
  };

  // ==================== bloombeasts\engine\cards\forest\rootling.ts ====================

  /**
   * Rootling - Small, protected creature with resource generation
   */


  const rootlingPassive: StructuredAbility = {
    name: 'Deep Roots',
    trigger: AbilityTrigger.Passive,
    effects: [
      {
        type: EffectType.CannotBeTargeted,
        target: AbilityTarget.Self,
        by: ['magic'],
      },
    ],
  };

  const rootlingBloom: StructuredAbility = {
    name: 'Nourish',
    trigger: AbilityTrigger.OnDestroy,
    effects: [
      {
        type: EffectType.GainResource,
        target: AbilityTarget.PlayerGardener,
        resource: ResourceType.Nectar,
        value: 1,
      },
    ],
  };

  // Level 4 upgrades
  const rootlingBloom4: StructuredAbility = {
    name: 'Abundant Nourish',
    trigger: AbilityTrigger.OnDestroy,
    effects: [
      {
        type: EffectType.GainResource,
        target: AbilityTarget.PlayerGardener,
        resource: ResourceType.Nectar,
        value: 2,
      },
    ],
  };

  // Level 7 upgrades
  const rootlingPassive7: StructuredAbility = {
    name: 'Ancient Roots',
    trigger: AbilityTrigger.Passive,
    effects: [
      {
        type: EffectType.CannotBeTargeted,
        target: AbilityTarget.Self,
        by: ['magic', 'trap'],
      },
    ],
  };

  // Level 9 upgrades
  const rootlingPassive9: StructuredAbility = {
    name: 'Eternal Roots',
    trigger: AbilityTrigger.Passive,
    effects: [
      {
        type: EffectType.CannotBeTargeted,
        target: AbilityTarget.Self,
        by: ['magic', 'trap', 'abilities'],
      },
    ],
  };

  const rootlingBloom9: StructuredAbility = {
    name: 'Harvest Feast',
    trigger: AbilityTrigger.OnDestroy,
    effects: [
      {
        type: EffectType.GainResource,
        target: AbilityTarget.PlayerGardener,
        resource: ResourceType.Nectar,
        value: 2,
      },
      {
        type: EffectType.DrawCards,
        target: AbilityTarget.PlayerGardener,
        value: 1,
      },
    ],
  };

  export const ROOTLING: BloomBeastCard = {
    id: 'rootling',
    name: 'Rootling',
    type: 'Bloom',
    affinity: 'Forest',
    cost: 1,
    baseAttack: 1,
    baseHealth: 3,
    abilities: [rootlingPassive],
    levelingConfig: {
      statGains: {
        1: { hp: 0, atk: 0 },
        2: { hp: 1, atk: 0 },
        3: { hp: 2, atk: 1 },
        4: { hp: 3, atk: 2 },
        5: { hp: 4, atk: 3 },
        6: { hp: 5, atk: 4 },
        7: { hp: 6, atk: 5 },
        8: { hp: 7, atk: 6 },
        9: { hp: 8, atk: 7 },
      },
      abilityUpgrades: {
        4: {
          abilities: [rootlingBloom4],
        },
        7: {
          abilities: [rootlingPassive7],
        },
        9: {
          abilities: [rootlingPassive9],
        },
      },
    },
  };

  // ==================== bloombeasts\engine\cards\forest\mushroomancer.ts ====================

  /**
   * Mushroomancer - AOE debuffer with self-heal
   */


  const mushroomancerPassive: StructuredAbility = {
    name: 'Fungal Cloud',
    trigger: AbilityTrigger.OnSummon,
    effects: [
      {
        type: EffectType.ModifyStats,
        target: AbilityTarget.AdjacentEnemies,
        stat: StatType.Attack,
        value: -1,
        duration: EffectDuration.StartOfNextTurn,
      },
    ],
  };

  const mushroomancerBloom: StructuredAbility = {
    name: 'Life Spore',
    trigger: AbilityTrigger.Activated,
    cost: {
      type: CostType.RemoveCounter,
      counter: 'Spore',
      value: 1,
    },
    effects: [
      {
        type: EffectType.Heal,
        target: AbilityTarget.Self,
        value: 2,
      },
    ],
  };

  // Level 4 upgrades
  const mushroomancerPassive4: StructuredAbility = {
    name: 'Toxic Spores',
    trigger: AbilityTrigger.OnSummon,
    effects: [
      {
        type: EffectType.ModifyStats,
        target: AbilityTarget.AdjacentEnemies,
        stat: StatType.Attack,
        value: -2,
        duration: EffectDuration.StartOfNextTurn,
      },
    ],
  };

  // Level 7 upgrades
  const mushroomancerBloom7: StructuredAbility = {
    name: 'Greater Life Spore',
    trigger: AbilityTrigger.Activated,
    cost: {
      type: CostType.RemoveCounter,
      counter: 'Spore',
      value: 1,
    },
    effects: [
      {
        type: EffectType.Heal,
        target: AbilityTarget.Self,
        value: 3,
      },
    ],
  };

  // Level 9 upgrades
  const mushroomancerPassive9: StructuredAbility = {
    name: 'Parasitic Bloom',
    trigger: AbilityTrigger.OnSummon,
    effects: [
      {
        type: EffectType.ModifyStats,
        target: AbilityTarget.AllEnemies,
        stat: StatType.Attack,
        value: -2,
        duration: EffectDuration.Permanent,
      },
    ],
  };

  const mushroomancerBloom9: StructuredAbility = {
    name: 'Spore Regeneration',
    trigger: AbilityTrigger.Activated,
    cost: {
      type: CostType.RemoveCounter,
      counter: 'Spore',
      value: 1,
    },
    effects: [
      {
        type: EffectType.Heal,
        target: AbilityTarget.Self,
        value: HealValueType.Full,
      },
      {
        type: EffectType.ModifyStats,
        target: AbilityTarget.Self,
        stat: StatType.Attack,
        value: 1,
        duration: EffectDuration.Permanent,
      },
    ],
  };

  export const MUSHROOMANCER: BloomBeastCard = {
    id: 'mushroomancer',
    name: 'Mushroomancer',
    type: 'Bloom',
    affinity: 'Forest',
    cost: 3,
    baseAttack: 3,
    baseHealth: 5,
    abilities: [mushroomancerPassive],
    levelingConfig: {
      statGains: {
        1: { hp: 0, atk: 0 },
        2: { hp: 2, atk: 0 },
        3: { hp: 3, atk: 1 },
        4: { hp: 4, atk: 2 },
        5: { hp: 6, atk: 3 },
        6: { hp: 8, atk: 4 },
        7: { hp: 10, atk: 5 },
        8: { hp: 12, atk: 6 },
        9: { hp: 14, atk: 7 },
      },
      abilityUpgrades: {
        4: {
          abilities: [mushroomancerPassive4],
        },
        7: {
          abilities: [mushroomancerBloom7],
        },
        9: {
          abilities: [mushroomancerPassive9],
        },
      },
    },
  };

  // ==================== bloombeasts\engine\cards\forest\leafSprite.ts ====================

  /**
   * Leaf Sprite - Evasive attacker with resource generation
   */


  const leafSpritePassive: StructuredAbility = {
    name: 'Evasive',
    trigger: AbilityTrigger.Passive,
    effects: [
      {
        type: EffectType.AttackModification,
        target: AbilityTarget.Self,
        modification: 'piercing',
      },
    ],
  };

  const leafSpriteBloom: StructuredAbility = {
    name: 'Pollen Haste',
    trigger: AbilityTrigger.OnDestroy,
    effects: [
      {
        type: EffectType.GainResource,
        target: AbilityTarget.PlayerGardener,
        resource: ResourceType.ExtraNectarPlay,
        value: 1,
      },
    ],
  };

  // Level 4 upgrades
  const leafSpriteBloom4: StructuredAbility = {
    name: 'Pollen Rush',
    trigger: AbilityTrigger.OnDestroy,
    effects: [
      {
        type: EffectType.GainResource,
        target: AbilityTarget.PlayerGardener,
        resource: ResourceType.ExtraNectarPlay,
        value: 2,
      },
    ],
  };

  // Level 7 upgrades
  const leafSpritePassive7: StructuredAbility = {
    name: 'Master Evasion',
    trigger: AbilityTrigger.Passive,
    effects: [
      {
        type: EffectType.AttackModification,
        target: AbilityTarget.Self,
        modification: 'piercing',
      },
      {
        type: EffectType.Immunity,
        target: AbilityTarget.Self,
        immuneTo: [ImmunityType.Targeting],
        duration: EffectDuration.WhileOnField,
      },
    ],
  };

  // Level 9 upgrades
  const leafSpritePassive9: StructuredAbility = {
    name: 'Shadow Strike',
    trigger: AbilityTrigger.Passive,
    effects: [
      {
        type: EffectType.AttackModification,
        target: AbilityTarget.Self,
        modification: 'attack-twice',
      },
      {
        type: EffectType.AttackModification,
        target: AbilityTarget.Self,
        modification: 'piercing',
      },
    ],
  };

  const leafSpriteBloom9: StructuredAbility = {
    name: 'Explosive Pollen',
    trigger: AbilityTrigger.OnDestroy,
    effects: [
      {
        type: EffectType.GainResource,
        target: AbilityTarget.PlayerGardener,
        resource: ResourceType.ExtraNectarPlay,
        value: 3,
      },
      {
        type: EffectType.DrawCards,
        target: AbilityTarget.PlayerGardener,
        value: 1,
      },
    ],
  };

  export const LEAF_SPRITE: BloomBeastCard = {
    id: 'leaf-sprite',
    name: 'Leaf Sprite',
    type: 'Bloom',
    affinity: 'Forest',
    cost: 2,
    baseAttack: 3,
    baseHealth: 2,
    abilities: [leafSpritePassive],
    levelingConfig: {
      statGains: {
        1: { hp: 0, atk: 0 },
        2: { hp: 0, atk: 1 },
        3: { hp: 1, atk: 2 },
        4: { hp: 1, atk: 4 },
        5: { hp: 2, atk: 5 },
        6: { hp: 2, atk: 7 },
        7: { hp: 3, atk: 8 },
        8: { hp: 3, atk: 10 },
        9: { hp: 4, atk: 12 },
      },
      abilityUpgrades: {
        4: {
          abilities: [leafSpriteBloom4],
        },
        7: {
          abilities: [leafSpritePassive7],
        },
        9: {
          abilities: [leafSpritePassive9],
        },
      },
    },
  };

  // ==================== bloombeasts\engine\cards\forest\ancientForest.ts ====================

  /**
   * Ancient Forest - Forest Habitat Card
   */


  // Ongoing effect: All Forest Beasts gain +0/+1
  const forestBeastBonus: StatModificationEffect = {
    type: EffectType.ModifyStats,
    target: AbilityTarget.AllAllies,
    stat: StatType.Health,
    value: 1,
    duration: EffectDuration.WhileOnField,
    condition: {
      type: ConditionType.AffinityMatches,
      value: 'Forest'
    }
  };

  // On play: Remove Burn and Freeze counters
  const removeBurnCounters: RemoveCounterEffect = {
    type: EffectType.RemoveCounter,
    target: AbilityTarget.AllUnits,
    counter: 'Burn'
  };

  const removeFreezeCounters: RemoveCounterEffect = {
    type: EffectType.RemoveCounter,
    target: AbilityTarget.AllUnits,
    counter: 'Freeze'
  };

  export const ANCIENT_FOREST: HabitatCard = {
    id: 'ancient-forest',
    name: 'Ancient Forest',
    type: 'Habitat',
    affinity: 'Forest',
    cost: 1,
    ongoingEffects: [forestBeastBonus],
    onPlayEffects: [removeBurnCounters, removeFreezeCounters]
  };

  // ==================== bloombeasts\engine\cards\forest\index.ts ====================

  /**
   * Forest Affinity Deck - The Growth Deck
   * Strategy: Defensive growth, healing, and resource denial
   */


  // Import all Forest cards

  // Re-export all cards for external use

  /**
   * Forest Deck implementation
   */
  export class ForestDeck extends BaseDeck {
    readonly deckName = 'Forest Starter: The Growth Deck';
    readonly affinity = 'Forest' as const;

    protected getBeasts(): DeckCardEntry<BloomBeastCard>[] {
      return [
        { card: MOSSLET, quantity: 4 },
        { card: ROOTLING, quantity: 4 },
        { card: MUSHROOMANCER, quantity: 2 },
        { card: LEAF_SPRITE, quantity: 3 },
      ];
    }

    protected getHabitats(): DeckCardEntry<HabitatCard>[] {
      return [
        { card: ANCIENT_FOREST, quantity: 3 },
      ];
    }
  }

  /**
   * Factory function for backward compatibility
   */
  export function getForestDeckCards() {
    const deck = new ForestDeck();
    return deck.getDeckCards();
  }

  // ==================== bloombeasts\engine\cards\sky\cirrusFloof.ts ====================

  /**
   * Cirrus Floof - Support creature with team-wide HP boost
   */


  const cirrusFloofPassive: StructuredAbility = {
    name: 'Lightness',
    trigger: AbilityTrigger.Passive,
    effects: [
      {
        type: EffectType.CannotBeTargeted,
        target: AbilityTarget.Self,
        by: ['high-cost-units'],
        costThreshold: 3,
      },
    ],
  };

  const cirrusFloofBloom: StructuredAbility = {
    name: 'Cloud Cover',
    trigger: AbilityTrigger.OnOwnStartOfTurn,
    effects: [
      {
        type: EffectType.TemporaryHP,
        target: AbilityTarget.AllAllies,
        value: 1,
      },
    ],
  };

  // Level 4 upgrades
  const cirrusFloofBloom4: StructuredAbility = {
    name: 'Storm Shield',
    trigger: AbilityTrigger.OnOwnStartOfTurn,
    effects: [
      {
        type: EffectType.TemporaryHP,
        target: AbilityTarget.AllAllies,
        value: 2,
      },
    ],
  };

  // Level 7 upgrades
  const cirrusFloofPassive7: StructuredAbility = {
    name: 'Ethereal Form',
    trigger: AbilityTrigger.Passive,
    effects: [
      {
        type: EffectType.CannotBeTargeted,
        target: AbilityTarget.Self,
        by: ['attacks'],
      },
    ],
  };

  // Level 9 upgrades
  const cirrusFloofPassive9: StructuredAbility = {
    name: 'Celestial Protector',
    trigger: AbilityTrigger.Passive,
    effects: [
      {
        type: EffectType.CannotBeTargeted,
        target: AbilityTarget.Self,
        by: ['all'],
      },
      {
        type: EffectType.DamageReduction,
        target: AbilityTarget.AllAllies,
        value: 1,
        duration: EffectDuration.WhileOnField,
      },
    ],
  };

  const cirrusFloofBloom9: StructuredAbility = {
    name: 'Divine Barrier',
    trigger: AbilityTrigger.OnOwnStartOfTurn,
    effects: [
      {
        type: EffectType.TemporaryHP,
        target: AbilityTarget.AllAllies,
        value: 3,
      },
      {
        type: EffectType.Immunity,
        target: AbilityTarget.AllAllies,
        immuneTo: [ImmunityType.NegativeEffects],
        duration: EffectDuration.ThisTurn,
      },
    ],
  };

  export const CIRRUS_FLOOF: BloomBeastCard = {
    id: 'cirrus-floof',
    name: 'Cirrus Floof',
    type: 'Bloom',
    affinity: 'Sky',
    cost: 2,
    baseAttack: 1,
    baseHealth: 6,
    abilities: [cirrusFloofPassive],
    levelingConfig: {
      statGains: {
        1: { hp: 0, atk: 0 },
        2: { hp: 3, atk: 0 },
        3: { hp: 5, atk: 0 },
        4: { hp: 7, atk: 1 },
        5: { hp: 10, atk: 1 },
        6: { hp: 12, atk: 2 },
        7: { hp: 14, atk: 3 },
        8: { hp: 17, atk: 3 },
        9: { hp: 20, atk: 4 },
      },
      abilityUpgrades: {
        4: {
          abilities: [cirrusFloofBloom4],
        },
        7: {
          abilities: [cirrusFloofPassive7],
        },
        9: {
          abilities: [cirrusFloofPassive9],
        },
      },
    },
  };

  // ==================== bloombeasts\engine\cards\sky\galeGlider.ts ====================

  /**
   * Gale Glider - Fast, mobile attacker
   */


  const galeGliderPassive: StructuredAbility = {
    name: 'First Wind',
    trigger: AbilityTrigger.Passive,
    effects: [
      {
        type: EffectType.AttackModification,
        target: AbilityTarget.Self,
        modification: 'attack-first',
      },
    ],
  };

  const galeGliderBloom: StructuredAbility = {
    name: 'Air Current',
    trigger: AbilityTrigger.OnAttack,
    effects: [
      {
        type: EffectType.MoveUnit,
        target: AbilityTarget.Self,
        destination: 'adjacent-slot',
      },
    ],
  };

  // Level 4 upgrades
  const galeGliderBloom4: StructuredAbility = {
    name: 'Wind Dance',
    trigger: AbilityTrigger.OnAttack,
    effects: [
      {
        type: EffectType.MoveUnit,
        target: AbilityTarget.Self,
        destination: 'any-slot',
      },
    ],
  };

  // Level 7 upgrades
  const galeGliderPassive7: StructuredAbility = {
    name: 'Storm Blade',
    trigger: AbilityTrigger.Passive,
    effects: [
      {
        type: EffectType.AttackModification,
        target: AbilityTarget.Self,
        modification: 'attack-first',
      },
      {
        type: EffectType.ModifyStats,
        target: AbilityTarget.Self,
        stat: StatType.Attack,
        value: 2,
        duration: EffectDuration.NextAttack,
      },
    ],
  };

  // Level 9 upgrades
  const galeGliderPassive9: StructuredAbility = {
    name: 'Tempest Strike',
    trigger: AbilityTrigger.Passive,
    effects: [
      {
        type: EffectType.AttackModification,
        target: AbilityTarget.Self,
        modification: 'attack-first',
      },
      {
        type: EffectType.AttackModification,
        target: AbilityTarget.Self,
        modification: 'triple-damage',
      },
      {
        type: EffectType.AttackModification,
        target: AbilityTarget.Self,
        modification: 'cannot-counterattack',
      },
    ],
  };

  const galeGliderBloom9: StructuredAbility = {
    name: 'Hurricane Assault',
    trigger: AbilityTrigger.OnAttack,
    effects: [
      {
        type: EffectType.AttackModification,
        target: AbilityTarget.Self,
        modification: 'attack-twice',
      },
      {
        type: EffectType.MoveUnit,
        target: AbilityTarget.Self,
        destination: 'any-slot',
      },
    ],
  };

  export const GALE_GLIDER: BloomBeastCard = {
    id: 'gale-glider',
    name: 'Gale Glider',
    type: 'Bloom',
    affinity: 'Sky',
    cost: 1,
    baseAttack: 2,
    baseHealth: 2,
    abilities: [galeGliderPassive],
    levelingConfig: {
      statGains: {
        1: { hp: 0, atk: 0 },
        2: { hp: 0, atk: 2 },
        3: { hp: 0, atk: 3 },
        4: { hp: 1, atk: 5 },
        5: { hp: 1, atk: 7 },
        6: { hp: 2, atk: 9 },
        7: { hp: 2, atk: 10 },
        8: { hp: 3, atk: 12 },
        9: { hp: 3, atk: 14 },
      },
      abilityUpgrades: {
        4: {
          abilities: [galeGliderBloom4],
        },
        7: {
          abilities: [galeGliderPassive7],
        },
        9: {
          abilities: [galeGliderPassive9],
        },
      },
    },
  };

  // ==================== bloombeasts\engine\cards\sky\starBloom.ts ====================

  /**
   * Star Bloom - Team buffer with deck search
   */


  const starBloomPassive: StructuredAbility = {
    name: 'Aura',
    trigger: AbilityTrigger.Passive,
    effects: [
      {
        type: EffectType.ModifyStats,
        target: AbilityTarget.AllAllies,
        stat: StatType.Attack,
        value: 1,
        duration: EffectDuration.WhileOnField,
      },
    ],
  };

  const starBloomBloom: StructuredAbility = {
    name: 'Celestial Alignment',
    trigger: AbilityTrigger.Activated,
    maxUsesPerGame: 1,
    effects: [
      {
        type: EffectType.SearchDeck,
        target: AbilityTarget.PlayerGardener,
        searchFor: 'bloom',
        quantity: 1,
      },
    ],
  };

  // Level 4 upgrades
  const starBloomPassive4: StructuredAbility = {
    name: 'Radiant Aura',
    trigger: AbilityTrigger.Passive,
    effects: [
      {
        type: EffectType.ModifyStats,
        target: AbilityTarget.AllAllies,
        stat: StatType.Attack,
        value: 2,
        duration: EffectDuration.WhileOnField,
      },
    ],
  };

  // Level 7 upgrades
  const starBloomBloom7: StructuredAbility = {
    name: 'Cosmic Guidance',
    trigger: AbilityTrigger.Activated,
    maxUsesPerTurn: 1,
    effects: [
      {
        type: EffectType.SearchDeck,
        target: AbilityTarget.PlayerGardener,
        searchFor: 'any',
        quantity: 1,
      },
    ],
  };

  // Level 9 upgrades
  const starBloomPassive9: StructuredAbility = {
    name: 'Astral Dominance',
    trigger: AbilityTrigger.Passive,
    effects: [
      {
        type: EffectType.ModifyStats,
        target: AbilityTarget.AllAllies,
        stat: StatType.Attack,
        value: 3,
        duration: EffectDuration.WhileOnField,
      },
      {
        type: EffectType.ModifyStats,
        target: AbilityTarget.AllAllies,
        stat: StatType.Health,
        value: 2,
        duration: EffectDuration.WhileOnField,
      },
    ],
  };

  const starBloomBloom9: StructuredAbility = {
    name: 'Universal Harmony',
    trigger: AbilityTrigger.Activated,
    effects: [
      {
        type: EffectType.DrawCards,
        target: AbilityTarget.PlayerGardener,
        value: 3,
      },
      {
        type: EffectType.SearchDeck,
        target: AbilityTarget.PlayerGardener,
        searchFor: 'any',
        quantity: 2,
      },
      {
        type: EffectType.ModifyStats,
        target: AbilityTarget.AllAllies,
        stat: StatType.Attack,
        value: 2,
        duration: EffectDuration.Permanent,
      },
      {
        type: EffectType.ModifyStats,
        target: AbilityTarget.AllAllies,
        stat: StatType.Health,
        value: 2,
        duration: EffectDuration.Permanent,
      },
    ],
  };

  export const STAR_BLOOM: BloomBeastCard = {
    id: 'star-bloom',
    name: 'Star Bloom',
    type: 'Bloom',
    affinity: 'Sky',
    cost: 3,
    baseAttack: 4,
    baseHealth: 5,
    abilities: [starBloomPassive],
    levelingConfig: {
      statGains: {
        1: { hp: 0, atk: 0 },
        2: { hp: 1, atk: 1 },
        3: { hp: 2, atk: 2 },
        4: { hp: 4, atk: 3 },
        5: { hp: 6, atk: 4 },
        6: { hp: 8, atk: 5 },
        7: { hp: 10, atk: 6 },
        8: { hp: 12, atk: 7 },
        9: { hp: 14, atk: 9 },
      },
      abilityUpgrades: {
        4: {
          abilities: [starBloomPassive4],
        },
        7: {
          abilities: [starBloomBloom7],
        },
        9: {
          abilities: [starBloomPassive9],
        },
      },
    },
  };

  // ==================== bloombeasts\engine\cards\sky\aeroMoth.ts ====================

  /**
   * Aero-Moth - Card draw with positioning manipulation
   */


  const aeroMothPassive: StructuredAbility = {
    name: 'Wing Flutter',
    trigger: AbilityTrigger.OnSummon,
    effects: [
      {
        type: EffectType.DrawCards,
        target: AbilityTarget.PlayerGardener,
        value: 1,
      },
    ],
  };

  const aeroMothBloom: StructuredAbility = {
    name: 'Gust',
    trigger: AbilityTrigger.OnAttack,
    effects: [
      {
        type: EffectType.SwapPositions,
        target: AbilityTarget.AllEnemies,
      },
    ],
  };

  // Level 4 upgrades
  const aeroMothPassive4: StructuredAbility = {
    name: 'Hypnotic Wings',
    trigger: AbilityTrigger.OnSummon,
    effects: [
      {
        type: EffectType.DrawCards,
        target: AbilityTarget.PlayerGardener,
        value: 2,
      },
    ],
  };

  // Level 7 upgrades
  const aeroMothBloom7: StructuredAbility = {
    name: 'Cyclone',
    trigger: AbilityTrigger.OnAttack,
    effects: [
      {
        type: EffectType.SwapPositions,
        target: AbilityTarget.AllEnemies,
      },
    ],
  };

  // Level 9 upgrades
  const aeroMothPassive9: StructuredAbility = {
    name: 'Rainbow Cascade',
    trigger: AbilityTrigger.OnSummon,
    effects: [
      {
        type: EffectType.DrawCards,
        target: AbilityTarget.PlayerGardener,
        value: 3,
      },
      {
        type: EffectType.ModifyStats,
        target: AbilityTarget.AllAllies,
        stat: StatType.Attack,
        value: 1,
        duration: EffectDuration.Permanent,
      },
      {
        type: EffectType.ModifyStats,
        target: AbilityTarget.AllAllies,
        stat: StatType.Health,
        value: 1,
        duration: EffectDuration.Permanent,
      },
    ],
  };

  const aeroMothBloom9: StructuredAbility = {
    name: 'Chaos Storm',
    trigger: AbilityTrigger.OnAttack,
    effects: [
      {
        type: EffectType.SwapPositions,
        target: AbilityTarget.AllEnemies,
      },
      {
        type: EffectType.ReturnToHand,
        target: AbilityTarget.RandomEnemy,
        value: 1,
      },
      {
        type: EffectType.DrawCards,
        target: AbilityTarget.PlayerGardener,
        value: 2,
      },
    ],
  };

  export const AERO_MOTH: BloomBeastCard = {
    id: 'aero-moth',
    name: 'Aero Moth',
    type: 'Bloom',
    affinity: 'Sky',
    cost: 2,
    baseAttack: 3,
    baseHealth: 3,
    abilities: [aeroMothPassive],  // Levels 1-3: OnSummon draws 1 card
    levelingConfig: {
      statGains: {
        1: { hp: 0, atk: 0 },
        2: { hp: 1, atk: 1 },
        3: { hp: 2, atk: 2 },
        4: { hp: 3, atk: 3 },
        5: { hp: 4, atk: 4 },
        6: { hp: 5, atk: 5 },
        7: { hp: 6, atk: 6 },
        8: { hp: 7, atk: 7 },
        9: { hp: 8, atk: 8 },
      },
      abilityUpgrades: {
        4: {
          abilities: [aeroMothPassive4],  // Levels 4-6: OnSummon draws 2 cards
        },
        7: {
          abilities: [aeroMothPassive4, aeroMothBloom7],  // Levels 7-8: OnSummon draws 2 + OnAttack swaps enemies
        },
        9: {
          abilities: [aeroMothPassive9, aeroMothBloom9],  // Level 9: OnSummon draws 3+buffs + OnAttack advanced
        },
      },
    },
  };

  // ==================== bloombeasts\engine\cards\sky\clearZenith.ts ====================

  /**
   * Clear Zenith - Sky Habitat Card
   */


  // On play effect: Draw 1 card
  const clearZenithDraw: DrawCardEffect = {
    type: EffectType.DrawCards,
    target: AbilityTarget.PlayerGardener,
    value: 1
  };

  export const CLEAR_ZENITH: HabitatCard = {
    id: 'clear-zenith',
    name: 'Clear Zenith',
    type: 'Habitat',
    affinity: 'Sky',
    cost: 1,
    titleColor: '#000000',  // Black title for better contrast on light background
    onPlayEffects: [clearZenithDraw],
    ongoingEffects: []
  };

  // ==================== bloombeasts\engine\cards\sky\index.ts ====================

  /**
   * Sky Affinity Deck - The Utility Deck
   * Strategy: Mobility, card draw, and team-wide utility bonuses
   */


  // Import all Sky cards

  // Re-export all cards for external use

  /**
   * Sky Deck implementation
   */
  export class SkyDeck extends BaseDeck {
    readonly deckName = 'Sky Starter: The Utility Deck';
    readonly affinity = 'Sky' as const;

    protected getBeasts(): DeckCardEntry<BloomBeastCard>[] {
      return [
        { card: CIRRUS_FLOOF, quantity: 4 },
        { card: GALE_GLIDER, quantity: 4 },
        { card: STAR_BLOOM, quantity: 2 },
        { card: AERO_MOTH, quantity: 3 },
      ];
    }

    protected getHabitats(): DeckCardEntry<HabitatCard>[] {
      return [
        { card: CLEAR_ZENITH, quantity: 3 },
      ];
    }
  }

  /**
   * Factory function for backward compatibility
   */
  export function getSkyDeckCards() {
    const deck = new SkyDeck();
    return deck.getDeckCards();
  }

  // ==================== bloombeasts\engine\cards\magic\nectarBlock.ts ====================

  /**
   * Nectar Block - Basic resource generation magic card
   */


  const nectarGainEffect: ResourceGainEffect = {
    type: EffectType.GainResource,
    target: AbilityTarget.PlayerGardener,
    resource: ResourceType.Nectar,
    value: 2,  // Gain 2 temporary nectar this turn
    duration: EffectDuration.ThisTurn
  };

  export const NECTAR_BLOCK: MagicCard = {
    id: 'nectar-block',
    name: 'Nectar Block',
    type: 'Magic',
    cost: 0,
    effects: [nectarGainEffect],
    targetRequired: false  // No target needed, automatically applies to player
  };

  // ==================== bloombeasts\engine\cards\magic\nectarSurge.ts ====================

  /**
   * Nectar Surge - Draw and temporary nectar
   */


  const gainNectar: ResourceGainEffect = {
    type: EffectType.GainResource,
    target: AbilityTarget.PlayerGardener,
    resource: ResourceType.Nectar,
    value: 3,
    duration: EffectDuration.ThisTurn
  };

  const nectarSurgeDraw: DrawCardEffect = {
    type: EffectType.DrawCards,
    target: AbilityTarget.PlayerGardener,
    value: 1
  };

  export const NECTAR_SURGE: MagicCard = {
    id: 'nectar-surge',
    name: 'Nectar Surge',
    type: 'Magic',
    cost: 1,
    effects: [gainNectar, nectarSurgeDraw],
    targetRequired: false
  };

  // ==================== bloombeasts\engine\cards\magic\cleansingDownpour.ts ====================

  /**
   * Cleansing Downpour - Remove all counters from all beasts
   */


  const removeAllCounters: RemoveCounterEffect = {
    type: EffectType.RemoveCounter,
    target: AbilityTarget.AllUnits,  // All beasts on the field
    // No specific counter type means remove all counters
  };

  const cleansingDownpourDraw: DrawCardEffect = {
    type: EffectType.DrawCards,
    target: AbilityTarget.PlayerGardener,
    value: 1
  };

  export const CLEANSING_DOWNPOUR: MagicCard = {
    id: 'cleansing-downpour',
    name: 'Cleansing Downpour',
    type: 'Magic',
    cost: 2,
    effects: [removeAllCounters, cleansingDownpourDraw],
    targetRequired: false
  };

  // ==================== bloombeasts\engine\cards\magic\index.ts ====================

  /**
   * Magic Cards Registry
   */


  // Re-export individual cards

  /**
   * Array of all magic cards
   */
  export const MagicCards: MagicCard[] = [
    NECTAR_BLOCK,
    NECTAR_SURGE,
    CLEANSING_DOWNPOUR,
  ];

  // ==================== bloombeasts\engine\cards\trap\habitatLock.ts ====================

  /**
   * Habitat Lock - Counter habitat play
   */


  const counterHabitatEffect: NullifyEffectEffect = {
    type: EffectType.NullifyEffect,
    target: AbilityTarget.Target,  // The habitat card being played
  };

  export const HABITAT_LOCK: TrapCard = {
    id: 'habitat-lock',
    name: 'Habitat Lock',
    type: 'Trap',
    cost: 1,
    activation: {
      trigger: TrapTrigger.OnHabitatPlay
    },
    effects: [counterHabitatEffect]
  };

  // ==================== bloombeasts\engine\cards\trap\index.ts ====================

  /**
   * Trap Cards Registry
   */


  // Re-export individual cards

  /**
   * Array of all trap cards
   */
  export const TrapCards: TrapCard[] = [
    HABITAT_LOCK,
  ];

  // ==================== bloombeasts\engine\cards\buff\battleFury.ts ====================

  /**
   * Battle Fury - Buff Card
   *
   * IMAGE PROMPT:
   * "A glowing red and orange magical aura with flames and energy swirls,
   * centered on a raised fist symbol. Dynamic, aggressive energy radiating outward.
   * Fantasy card game art style, vibrant colors, square format 185x185px."
   */


  // Ongoing effect: All your Beasts gain +2 Attack
  const attackBoost: StatModificationEffect = {
    type: EffectType.ModifyStats,
    target: AbilityTarget.AllAllies,
    stat: StatType.Attack,
    value: 2,
    duration: EffectDuration.WhileOnField,
  };

  export const BATTLE_FURY: BuffCard = {
    id: 'battle-fury',
    name: 'Battle Fury',
    type: 'Buff',
    cost: 3,
    ongoingEffects: [attackBoost],
  };

  // ==================== bloombeasts\engine\cards\buff\naturesBlessing.ts ====================

  /**
   * Nature's Blessing - Buff Card
   *
   * IMAGE PROMPT:
   * "A soft green and golden magical glow with floating leaves, flowers, and sparkles.
   * Gentle healing energy emanating from a blooming flower in the center.
   * Fantasy card game art style, natural and peaceful colors, square format 185x185px."
   */


  // Ongoing effect: Heal all your Beasts for 1 HP at the start of your turn
  // Note: This would require StartOfTurn trigger support in the buff system
  const healingAura: HealEffect = {
    type: EffectType.Heal,
    target: AbilityTarget.AllAllies,
    value: 1,
  };

  export const NATURES_BLESSING: BuffCard = {
    id: 'natures-blessing',
    name: "Nature's Blessing",
    type: 'Buff',
    affinity: 'Forest',
    cost: 4,
    ongoingEffects: [healingAura],
  };

  // ==================== bloombeasts\engine\cards\buff\mysticShield.ts ====================

  /**
   * Mystic Shield - Buff Card
   *
   * IMAGE PROMPT:
   * "A shimmering blue and purple magical shield with arcane runes and symbols.
   * Protective energy barrier with geometric patterns and soft glowing edges.
   * Fantasy card game art style, magical defensive aura, square format 185x185px."
   */


  // Ongoing effect: All your Beasts gain +2 Health
  const defenseBoost: StatModificationEffect = {
    type: EffectType.ModifyStats,
    target: AbilityTarget.AllAllies,
    stat: StatType.Health,
    value: 2,
    duration: EffectDuration.WhileOnField,
  };

  export const MYSTIC_SHIELD: BuffCard = {
    id: 'mystic-shield',
    name: 'Mystic Shield',
    type: 'Buff',
    cost: 3,
    ongoingEffects: [defenseBoost],
  };

  // ==================== bloombeasts\engine\cards\buff\swiftWind.ts ====================

  /**
   * Swift Wind - Buff Card
   *
   * IMAGE PROMPT:
   * "Swirling white and cyan wind currents forming a spiral pattern,
   * with small sparkles and air particles. Light and airy magical energy.
   * Fantasy card game art style, dynamic motion blur, square format 185x185px."
   */


  // Ongoing effect: Gain 1 extra Nectar at the start of your turn
  // Note: This would require StartOfTurn trigger support in the buff system
  const nectarGeneration: ResourceGainEffect = {
    type: EffectType.GainResource,
    target: AbilityTarget.Self,
    resource: ResourceType.Nectar,
    value: 1,
  };

  export const SWIFT_WIND: BuffCard = {
    id: 'swift-wind',
    name: 'Swift Wind',
    type: 'Buff',
    affinity: 'Sky',
    cost: 2,
    ongoingEffects: [nectarGeneration],
  };

  // ==================== bloombeasts\engine\cards\buff\index.ts ====================

  /**
   * Buff Cards Export
   */

  // ==================== bloombeasts\engine\cards\index.ts ====================

  /**
   * Central card registry
   */


  // Export deck classes

  // Export magic, trap, and buff cards

  /**
   * Get all cards from all decks
   * Also adds rarity property for reward generation
   */
  export function getAllCards(): AnyCard[] {
    const allCards: AnyCard[] = [];

    // Create instances of each deck
    const decks = [
      new FireDeck(),
      new WaterDeck(),
      new ForestDeck(),
      new SkyDeck(),
    ];

    // Collect all unique cards
    const cardMap = new SimpleMap<string, AnyCard>();

    // Add cards from decks (Bloom beasts and Habitats)
    decks.forEach(deck => {
      const deckCards = deck.getAllCards();
      deckCards.forEach(card => {
        if (!cardMap.has(card.id)) {
          // Add rarity based on card stats for reward system
          if (card.type === 'Bloom') {
            const beast = card as BloomBeastCard;
            // Assign rarity based on nectar cost and stats
            if (beast.cost >= 5) {
              (beast as any).rarity = 'rare';
            } else if (beast.cost >= 3) {
              (beast as any).rarity = 'uncommon';
            } else {
              (beast as any).rarity = 'common';
            }
          } else {
            // Non-beast cards are common by default
            (card as any).rarity = 'common';
          }
          cardMap.set(card.id, card);
        }
      });
    });

    // Add Magic cards
    MagicCards.forEach(card => {
      if (!cardMap.has(card.id)) {
        (card as any).rarity = 'common';
        cardMap.set(card.id, card);
      }
    });

    // Add Trap cards
    TrapCards.forEach(card => {
      if (!cardMap.has(card.id)) {
        (card as any).rarity = 'common';
        cardMap.set(card.id, card);
      }
    });

    // Add Buff cards
    [BATTLE_FURY, NATURES_BLESSING, MYSTIC_SHIELD, SWIFT_WIND].forEach(card => {
      if (!cardMap.has(card.id)) {
        (card as any).rarity = 'common';
        cardMap.set(card.id, card as BuffCard);
      }
    });

    return cardMap.values();
  }

  /**
   * Get cards by affinity
   */
  export function getCardsByAffinity(
    affinity: 'Fire' | 'Water' | 'Forest' | 'Sky'
  ): (BloomBeastCard | HabitatCard)[] {
    return getAllCards().filter(card =>
      'affinity' in card && card.affinity === affinity
    ) as (BloomBeastCard | HabitatCard)[];
  }

  /**
   * Get cards by type
   */
  export function getCardsByType<T extends 'Beast' | 'Habitat' | 'Trap' | 'Magic'>(
    type: T
  ): T extends 'Beast' ? BloomBeastCard[] :
     T extends 'Habitat' ? HabitatCard[] :
     T extends 'Trap' ? TrapCard[] :
     T extends 'Magic' ? MagicCard[] :
     never {
    return getAllCards().filter(card => card.type === type) as any;
  }

  // ==================== bloombeasts\engine\cards\magic\aetherSwap.ts ====================

  /**
   * Aether Swap - Swap positions of two units
   */


  const swapEffect: SwapPositionsEffect = {
    type: EffectType.SwapPositions,
    target: AbilityTarget.Target
  };

  export const AETHER_SWAP: MagicCard = {
    id: 'aether-swap',
    name: 'Aether Swap',
    type: 'Magic',
    cost: 1,
    effects: [swapEffect],
    targetRequired: true  // Requires selecting two units to swap
  };

  // ==================== bloombeasts\engine\cards\magic\elementalBurst.ts ====================

  /**
   * Elemental Burst - Deal damage to all enemy units
   */


  const burstDamage: DamageEffect = {
    type: EffectType.DealDamage,
    target: AbilityTarget.AllEnemies,
    value: 2
  };

  export const ELEMENTAL_BURST: MagicCard = {
    id: 'elemental-burst',
    name: 'Elemental Burst',
    type: 'Magic',
    cost: 3,
    effects: [burstDamage],
    targetRequired: false
  };

  // ==================== bloombeasts\engine\cards\magic\lightningStrike.ts ====================

  /**
   * Lightning Strike - Deal high damage to a single target
   */


  const strikeDamage: DamageEffect = {
    type: EffectType.DealDamage,
    target: AbilityTarget.Target,
    value: 5,
    piercing: true  // Piercing damage ignores shields
  };

  export const LIGHTNING_STRIKE: MagicCard = {
    id: 'lightning-strike',
    name: 'Lightning Strike',
    type: 'Magic',
    cost: 2,
    effects: [strikeDamage],
    targetRequired: true
  };

  // ==================== bloombeasts\engine\cards\magic\nectarDrain.ts ====================

  /**
   * Nectar Drain - Drain nectar from opponent
   */


  const drainEffect: ResourceGainEffect = {
    type: EffectType.GainResource,
    target: AbilityTarget.PlayerGardener,
    resource: ResourceType.Nectar,
    value: 2,
    duration: EffectDuration.ThisTurn
  };

  const drawEffect: DrawCardEffect = {
    type: EffectType.DrawCards,
    target: AbilityTarget.PlayerGardener,
    value: 1
  };

  export const NECTAR_DRAIN: MagicCard = {
    id: 'nectar-drain',
    name: 'Nectar Drain',
    type: 'Magic',
    cost: 1,
    effects: [drainEffect, drawEffect],
    targetRequired: false
  };

  // ==================== bloombeasts\engine\cards\magic\overgrowth.ts ====================

  /**
   * Overgrowth - Give all allies +2/+2
   */


  const overgrowthBuffEffect: StatModificationEffect = {
    type: EffectType.ModifyStats,
    target: AbilityTarget.AllAllies,
    stat: StatType.Both,
    value: 2,
    duration: EffectDuration.Permanent
  };

  export const OVERGROWTH: MagicCard = {
    id: 'overgrowth',
    name: 'Overgrowth',
    type: 'Magic',
    cost: 3,
    effects: [overgrowthBuffEffect],
    targetRequired: false
  };

  // ==================== bloombeasts\engine\cards\magic\powerUp.ts ====================

  /**
   * Power Up - Give target unit +3/+3
   */


  const powerUpBuffEffect: StatModificationEffect = {
    type: EffectType.ModifyStats,
    target: AbilityTarget.Target,
    stat: StatType.Both,
    value: 3,
    duration: EffectDuration.Permanent
  };

  export const POWER_UP: MagicCard = {
    id: 'power-up',
    name: 'Power Up',
    type: 'Magic',
    cost: 2,
    effects: [powerUpBuffEffect],
    targetRequired: true
  };

  // ==================== bloombeasts\engine\cards\magic\purify.ts ====================

  /**
   * Purify - Remove all negative counters from target unit
   */


  const removeCounters: RemoveCounterEffect = {
    type: EffectType.RemoveCounter,
    target: AbilityTarget.Target
    // No specific counter type = removes all counters
  };

  export const PURIFY: MagicCard = {
    id: 'purify',
    name: 'Purify',
    type: 'Magic',
    cost: 1,
    effects: [removeCounters],
    targetRequired: true
  };

  // ==================== bloombeasts\engine\cards\trap\bearTrap.ts ====================

  /**
   * Bear Trap - Damage attacker when triggered
   */


  const trapDamage: DamageEffect = {
    type: EffectType.DealDamage,
    target: AbilityTarget.Attacker,
    value: 3
  };

  export const BEAR_TRAP: TrapCard = {
    id: 'bear-trap',
    name: 'Bear Trap',
    type: 'Trap',
    cost: 1,
    activation: {
      trigger: TrapTrigger.OnAttack
    },
    effects: [trapDamage]
  };

  // ==================== bloombeasts\engine\cards\trap\emergencyBloom.ts ====================

  /**
   * Emergency Bloom - Draw cards when your unit is destroyed
   */


  const drawCards: DrawCardEffect = {
    type: EffectType.DrawCards,
    target: AbilityTarget.PlayerGardener,
    value: 2
  };

  export const EMERGENCY_BLOOM: TrapCard = {
    id: 'emergency-bloom',
    name: 'Emergency Bloom',
    type: 'Trap',
    cost: 1,
    activation: {
      trigger: TrapTrigger.OnDestroy
    },
    effects: [drawCards]
  };

  // ==================== bloombeasts\engine\cards\trap\habitatShield.ts ====================

  /**
   * Habitat Shield - Counter opponent's habitat and draw a card
   */


  const nullifyHabitat: NullifyEffectEffect = {
    type: EffectType.NullifyEffect,
    target: AbilityTarget.Target
  };

  const drawCard: DrawCardEffect = {
    type: EffectType.DrawCards,
    target: AbilityTarget.PlayerGardener,
    value: 1
  };

  export const HABITAT_SHIELD: TrapCard = {
    id: 'habitat-shield',
    name: 'Habitat Shield',
    type: 'Trap',
    cost: 2,
    activation: {
      trigger: TrapTrigger.OnHabitatPlay
    },
    effects: [nullifyHabitat, drawCard]
  };

  // ==================== bloombeasts\engine\cards\trap\magicShield.ts ====================

  /**
   * Magic Shield - Counter opponent's magic card
   */


  const nullifyMagic: NullifyEffectEffect = {
    type: EffectType.NullifyEffect,
    target: AbilityTarget.Target
  };

  export const MAGIC_SHIELD: TrapCard = {
    id: 'magic-shield',
    name: 'Magic Shield',
    type: 'Trap',
    cost: 1,
    activation: {
      trigger: TrapTrigger.OnMagicPlay
    },
    effects: [nullifyMagic]
  };

  // ==================== bloombeasts\engine\cards\trap\thornSnare.ts ====================

  /**
   * Thorn Snare - Prevent an attack and damage the attacker
   */


  const preventAttack: PreventEffect = {
    type: EffectType.PreventAttack,
    target: AbilityTarget.Attacker,
    duration: EffectDuration.Instant
  };

  const snareDamage: DamageEffect = {
    type: EffectType.DealDamage,
    target: AbilityTarget.Attacker,
    value: 2
  };

  export const THORN_SNARE: TrapCard = {
    id: 'thorn-snare',
    name: 'Thorn Snare',
    type: 'Trap',
    cost: 2,
    activation: {
      trigger: TrapTrigger.OnAttack
    },
    effects: [preventAttack, snareDamage]
  };

  // ==================== bloombeasts\engine\cards\trap\vaporize.ts ====================

  /**
   * Vaporize - Destroy opponent's summoned bloom beast
   */


  const destroyBloom: DestroyEffect = {
    type: EffectType.Destroy,
    target: AbilityTarget.Target
  };

  export const VAPORIZE: TrapCard = {
    id: 'vaporize',
    name: 'Vaporize',
    type: 'Trap',
    cost: 2,
    activation: {
      trigger: TrapTrigger.OnBloomPlay,
      condition: {
        type: TrapConditionType.CostBelow,
        value: 4  // Only works on blooms with cost 3 or less
      }
    },
    effects: [destroyBloom]
  };

  // ==================== bloombeasts\engine\cards\trap\xpHarvest.ts ====================

  /**
   * XP Harvest - Reduce attacker to level 1 when your unit is destroyed
   */


  const removeXP: RemoveCounterEffect = {
    type: EffectType.RemoveCounter,
    target: AbilityTarget.Attacker,  // The unit that destroyed your unit
    counter: 'XP'  // Remove all XP counters, resetting to level 1
  };

  export const XP_HARVEST: TrapCard = {
    id: 'xp-harvest',
    name: 'XP Harvest',
    type: 'Trap',
    cost: 1,
    activation: {
      trigger: TrapTrigger.OnDestroy
    },
    effects: [removeXP]
  };

  // ==================== bloombeasts\engine\cards\shared\index.ts ====================

  /**
   * Shared Core Cards - Present in all starter decks
   */


  // Import all shared cards from their new locations
  // Magic cards

  // Trap cards

  // Re-export all cards
  // Magic cards

  // Trap cards

  /**
   * Get all shared core cards with quantities
   */
  export function getSharedCoreCards(): DeckCardEntry<MagicCard | TrapCard>[] {
    return [
      // Basic resource generation
      { card: NECTAR_BLOCK, quantity: 10 },
      { card: NECTAR_SURGE, quantity: 2 },
      { card: NECTAR_DRAIN, quantity: 1 },

      // Removal and utility
      { card: CLEANSING_DOWNPOUR, quantity: 1 },
      { card: PURIFY, quantity: 1 },
      { card: LIGHTNING_STRIKE, quantity: 1 },
      { card: ELEMENTAL_BURST, quantity: 1 },

      // Buffs and positioning
      { card: POWER_UP, quantity: 1 },
      { card: OVERGROWTH, quantity: 1 },
      { card: AETHER_SWAP, quantity: 1 },

      // Trap cards
      { card: HABITAT_LOCK, quantity: 1 },
      { card: MAGIC_SHIELD, quantity: 1 },
      { card: HABITAT_SHIELD, quantity: 1 },
      { card: BEAR_TRAP, quantity: 1 },
      { card: THORN_SNARE, quantity: 1 },
      { card: VAPORIZE, quantity: 1 },
      { card: EMERGENCY_BLOOM, quantity: 1 },
      { card: XP_HARVEST, quantity: 1 },
    ];
  }

  // ==================== bloombeasts\engine\utils\deckBuilder.ts ====================

  /**
   * Deck Builder Utilities - Construct and manage decks
   */


  export type DeckType = 'Forest' | 'Fire' | 'Water' | 'Sky';

  export interface DeckList {
    name: string;
    affinity: DeckType;
    cards: AnyCard[];
    totalCards: number;
  }

  /**
   * Expand cards based on quantity
   */
  function expandCards<T extends AnyCard>(cardQuantities: Array<{ card: T; quantity: number }>): T[] {
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
   * Deck configurations using new class-based approach
   */
  const DECK_INSTANCES = {
    Forest: new ForestDeck(),
    Fire: new FireDeck(),
    Water: new WaterDeck(),
    Sky: new SkyDeck(),
  };

  /**
   * Build a complete deck with shared cards and affinity-specific cards
   */
  function buildDeck(type: DeckType): DeckList {
    // Use new class-based approach for all decks
    const deck = DECK_INSTANCES[type];
    const affinityCards = deck.getDeckCards();

    const sharedCards = expandCards(getSharedCoreCards());
    const beasts = expandCards(affinityCards.beasts);
    const habitats = expandCards(affinityCards.habitats);

    const allCards = [...sharedCards, ...beasts, ...habitats];

    return {
      name: deck.deckName,
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
    const deck = DECK_INSTANCES[type];

    // Get 1 of each card from all affinities
    const allCards: AnyCard[] = [];

    // Add shared cards (Magic, Trap) - 1 of each
    const sharedCards = getSharedCoreCards();
    sharedCards.forEach(({ card }) => {
      allCards.push({
        ...card,
        instanceId: `${card.id}-1`,
      } as unknown as AnyCard);
    });

    // Add buff cards - 1 of each
    const buffCards = [BATTLE_FURY, NATURES_BLESSING, MYSTIC_SHIELD, SWIFT_WIND];
    buffCards.forEach(card => {
      allCards.push({
        ...card,
        instanceId: `${card.id}-1`,
      } as unknown as AnyCard);
    });

    // Add all beasts from all affinities - 1 of each
    (['Forest', 'Fire', 'Water', 'Sky'] as DeckType[]).forEach(affinity => {
      const affinityDeck = DECK_INSTANCES[affinity];
      const cards = affinityDeck.getDeckCards();

      // Add beasts
      cards.beasts.forEach(({ card }) => {
        allCards.push({
          ...card,
          instanceId: `${card.id}-1`,
        } as unknown as AnyCard);
      });

      // Add habitats
      cards.habitats.forEach(({ card }) => {
        allCards.push({
          ...card,
          instanceId: `${card.id}-1`,
        } as unknown as AnyCard);
      });
    });

    return {
      name: `${deck.deckName} (Testing)`,
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

  // ==================== bloombeasts\screens\startmenu\StartMenuUI.ts ====================

  /**
   * Start Menu UI - Handles the visual presentation of the main menu
   */


  export interface MenuOption {
    id: string;
    label: string;
    description?: string;
    enabled: boolean;
  }

  export class StartMenuUI {
    private menuOptions: MenuOption[];
    private selectedIndex: number = 0;
    private callbacks: SimpleMap<string, () => void> = new SimpleMap();

    constructor() {
      this.menuOptions = [
        {
          id: 'missions',
          label: '🎯 Missions',
          description: 'Challenge AI opponents and earn rewards',
          enabled: true,
        },
        {
          id: 'inventory',
          label: '📦 Inventory',
          description: 'View your cards and manage your collection',
          enabled: true,
        },
        {
          id: 'deck-builder',
          label: '🎴 Deck Builder',
          description: 'Create and customize your decks',
          enabled: true,
        },
        {
          id: 'quick-match',
          label: '⚔️ Quick Match',
          description: 'Jump into a random battle',
          enabled: true,
        },
        {
          id: 'settings',
          label: '⚙️ Settings',
          description: 'Configure game options',
          enabled: true,
        },
        {
          id: 'quit',
          label: '🚪 Quit',
          description: 'Exit the game',
          enabled: true,
        },
      ];
    }

    /**
     * Render the start menu UI
     */
    public async render(): Promise<void> {
      console.log('===========================================');
      console.log('       BLOOM BEASTS - Main Menu           ');
      console.log('===========================================');
      console.log('');

      this.menuOptions.forEach((option, index) => {
        const selector = index === this.selectedIndex ? '>' : ' ';
        const status = option.enabled ? '' : ' (Disabled)';
        console.log(`${selector} ${option.label}${status}`);
        if (option.description && index === this.selectedIndex) {
          console.log(`   ${option.description}`);
        }
      });

      console.log('');
      console.log('Use arrow keys to navigate, Enter to select');
      console.log('===========================================');
    }

    /**
     * Handle missions button click
     */
    public onMissionsClick(callback: () => void): void {
      this.callbacks.set('missions', callback);
    }

    /**
     * Handle inventory button click
     */
    public onInventoryClick(callback: () => void): void {
      this.callbacks.set('inventory', callback);
    }

    /**
     * Handle deck builder button click
     */
    public onDeckBuilderClick(callback: () => void): void {
      this.callbacks.set('deck-builder', callback);
    }

    /**
     * Handle quick match button click
     */
    public onQuickMatchClick(callback: () => void): void {
      this.callbacks.set('quick-match', callback);
    }

    /**
     * Handle settings button click
     */
    public onSettingsClick(callback: () => void): void {
      this.callbacks.set('settings', callback);
    }

    /**
     * Handle quit button click
     */
    public onQuitClick(callback: () => void): void {
      this.callbacks.set('quit', callback);
    }

    /**
     * Navigate menu selection up
     */
    public navigateUp(): void {
      this.selectedIndex = Math.max(0, this.selectedIndex - 1);
      this.render();
    }

    /**
     * Navigate menu selection down
     */
    public navigateDown(): void {
      this.selectedIndex = Math.min(this.menuOptions.length - 1, this.selectedIndex + 1);
      this.render();
    }

    /**
     * Select current menu option
     */
    public selectCurrentOption(): void {
      const currentOption = this.menuOptions[this.selectedIndex];
      if (currentOption.enabled) {
        const callback = this.callbacks.get(currentOption.id);
        if (callback) {
          callback();
        }
      }
    }
  }

  // ==================== bloombeasts\screens\startmenu\MenuController.ts ====================

  /**
   * Menu Controller - Handles menu navigation and actions
   */

  export interface GameMode {
    type: 'single-player' | 'multiplayer' | 'tutorial';
    difficulty?: 'easy' | 'normal' | 'hard';
  }

  export class MenuController {
    private currentState: 'menu' | 'game' | 'inventory' | 'settings' = 'menu';

    constructor() {
      console.log('Menu Controller initialized');
    }

    /**
     * Start a new game
     */
    public async startGame(mode: GameMode = { type: 'single-player', difficulty: 'normal' }): Promise<void> {
      console.log(`Starting ${mode.type} game with ${mode.difficulty} difficulty...`);
      this.currentState = 'game';

      // Note: Game engine integration point for future menu-initiated games
      // Currently, missions are started through MissionManager -> MissionBattleUI
      // Future: Add direct game mode support (quick play, practice matches, etc.)
      // const gameEngine = new GameEngine();
      // await gameEngine.initialize();
      // await gameEngine.startMatch(mode);

      console.log('Game started! (Placeholder - Game engine not yet integrated)');
    }

    /**
     * Open the inventory screen
     */
    public async openInventory(): Promise<void> {
      console.log('Opening inventory...');
      this.currentState = 'inventory';

      // Note: Inventory integration point - Cards system exists (screens/cards/)
      // Future: Connect MenuController to Cards.initialize() for full inventory view
      // const inventory = new InventoryView();
      // await inventory.display();

      console.log('Inventory opened! (Placeholder - Inventory system not yet integrated)');
    }

    /**
     * Open the settings menu
     */
    public async openSettings(): Promise<void> {
      console.log('Opening settings...');
      this.currentState = 'settings';

      // Note: Settings menu integration point
      // Future: Implement SettingsMenu for audio, graphics, controls configuration
      // const settings = new SettingsMenu();
      // await settings.display();

      console.log('Settings opened! (Placeholder - Settings not yet implemented)');
    }

    /**
     * Quit the game
     */
    public quitGame(): void {
      console.log('Thanks for playing Bloom Beasts!');
      console.log('Goodbye!');

      // Note: Save system integration point
      // Future: Implement SaveManager to persist game state before exit
      // await this.saveGameState();
      // process.exit(0);
    }

    /**
     * Return to main menu
     */
    public returnToMenu(): void {
      console.log('Returning to main menu...');
      this.currentState = 'menu';
    }

    /**
     * Get current state
     */
    public getCurrentState(): string {
      return this.currentState;
    }

    /**
     * Load saved game
     */
    public async loadSavedGame(): Promise<boolean> {
      console.log('Loading saved game...');

      // Note: Save game loading integration point
      // Future: Implement SaveManager.load() to restore player progress
      // const saveData = await SaveManager.load();
      // if (saveData) {
      //   await this.startGame(saveData.mode);
      //   return true;
      // }

      console.log('No saved game found (Placeholder)');
      return false;
    }
  }

  // ==================== bloombeasts\screens\cards\types.ts ====================

  /**
   * Type definitions for the inventory system
   */


  /**
   * Instance of a card in the player's collection
   */
  export interface CardInstance {
    id: string;                    // Unique instance ID
    cardId: string;                 // Base card ID
    name: string;
    type: CardType;                 // Card type: Bloom, Magic, Trap, Habitat
    affinity?: Affinity;            // Optional - not all cards have affinity
    cost: number;                   // Card cost
    // Level and XP for ALL card types
    level: number;                  // All cards can level up
    currentXP: number;              // All cards can gain experience
    // Bloom Beast specific fields
    baseAttack?: number;            // Only for Bloom beasts
    currentAttack?: number;         // Only for Bloom beasts
    baseHealth?: number;            // Only for Bloom beasts
    currentHealth?: number;         // Only for Bloom beasts
    // General fields
    ability?: {
      name: string;
      description: string;
    };
    effects?: string[];             // For Magic/Trap cards - simplified effect descriptions
    obtainedDate?: Date;
    lastUsedDate?: Date;
    battleCount?: number;
    winCount?: number;
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

  // ==================== bloombeasts\screens\cards\InventoryFilters.ts ====================

  /**
   * Inventory Filters - Manage filtering options for the card collection
   */


  export type FilterType = 'affinity' | 'minLevel' | 'maxLevel' | 'hasAbility' | 'search';

  export interface Filter {
    type: FilterType;
    value: any;
    active: boolean;
  }

  export class InventoryFilters {
    private filters: SimpleMap<FilterType, Filter> = new SimpleMap();

    constructor() {
      this.initializeFilters();
    }

    /**
     * Initialize default filters
     */
    private initializeFilters(): void {
      this.filters.set('affinity', {
        type: 'affinity',
        value: 'all',
        active: false,
      });

      this.filters.set('minLevel', {
        type: 'minLevel',
        value: 1,
        active: false,
      });

      this.filters.set('maxLevel', {
        type: 'maxLevel',
        value: 9,
        active: false,
      });

      this.filters.set('hasAbility', {
        type: 'hasAbility',
        value: '',
        active: false,
      });

      this.filters.set('search', {
        type: 'search',
        value: '',
        active: false,
      });
    }

    /**
     * Update a filter value
     */
    public updateFilter(type: FilterType, value: any): void {
      const filter = this.filters.get(type);
      if (filter) {
        filter.value = value;
        filter.active = value !== null && value !== '' && value !== 'all';
      }
    }

    /**
     * Get a specific filter value
     */
    public getFilter(type: FilterType): any {
      const filter = this.filters.get(type);
      return filter?.active ? filter.value : null;
    }

    /**
     * Get all active filters
     */
    public getActiveFilters(): Filter[] {
      return Array.from(this.filters.values()).filter(f => f.active);
    }

    /**
     * Clear all filters
     */
    public clearAll(): void {
      this.initializeFilters();
    }

    /**
     * Clear a specific filter
     */
    public clearFilter(type: FilterType): void {
      const filter = this.filters.get(type);
      if (filter) {
        switch (type) {
          case 'affinity':
            filter.value = 'all';
            break;
          case 'minLevel':
            filter.value = 1;
            break;
          case 'maxLevel':
            filter.value = 9;
            break;
          default:
            filter.value = '';
        }
        filter.active = false;
      }
    }

    /**
     * Get filter presets
     */
    public static getPresets(): Record<string, Partial<Record<FilterType, any>>> {
      return {
        'high-level': {
          minLevel: 7,
        },
        'fire-cards': {
          affinity: 'Fire',
        },
        'forest-cards': {
          affinity: 'Forest',
        },
        'water-cards': {
          affinity: 'Water',
        },
        'sky-cards': {
          affinity: 'Sky',
        },
        'low-level': {
          maxLevel: 3,
        },
      };
    }

    /**
     * Apply a preset
     */
    public applyPreset(presetName: string): void {
      const presets = InventoryFilters.getPresets();
      const preset = presets[presetName];

      if (preset) {
        this.clearAll();
        for (const [type, value] of Object.entries(preset)) {
          this.updateFilter(type as FilterType, value);
        }
      }
    }
  }

  // ==================== bloombeasts\screens\cards\CardCollection.ts ====================

  /**
   * Card Collection - Manages the player's collection of cards
   */


  export type SortOption = 'name' | 'level' | 'affinity' | 'attack' | 'health' | 'xp' | 'recent';

  export class CardCollection {
    private cards: CardInstance[] = [];
    private sortBy: SortOption = 'name';
    private sortAscending: boolean = true;

    constructor() {
      // Initialize with empty collection
    }

    /**
     * Set the player's card collection (called by platform layer)
     */
    public setCards(cards: CardInstance[]): void {
      this.cards = cards;
    }

    /**
     * Get all cards in collection
     */
    public getAllCards(): CardInstance[] {
      return this.cards;
    }

    /**
     * Get a specific card by ID
     */
    public getCard(id: string): CardInstance | undefined {
      return this.cards.find(card => card.id === id);
    }

    /**
     * Get cards filtered by criteria
     */
    public getFilteredCards(filters: InventoryFilters): CardInstance[] {
      let filtered = [...this.cards];

      // Apply affinity filter
      const affinityFilter = filters.getFilter('affinity');
      if (affinityFilter && affinityFilter !== 'all') {
        filtered = filtered.filter(card => card.affinity === affinityFilter);
      }

      // Apply level filter
      const levelFilter = filters.getFilter('minLevel');
      if (levelFilter) {
        filtered = filtered.filter(card => card.level >= levelFilter);
      }

      // Apply search filter
      const searchFilter = filters.getFilter('search');
      if (searchFilter) {
        const search = searchFilter.toLowerCase();
        filtered = filtered.filter(card =>
          card.name.toLowerCase().includes(search) ||
          (card.affinity && card.affinity.toLowerCase().includes(search))
        );
      }

      // Apply sorting
      this.applySorting(filtered);

      return filtered;
    }

    /**
     * Sort cards by specified criteria
     */
    public sortCards(sortBy: SortOption, ascending: boolean = true): void {
      this.sortBy = sortBy;
      this.sortAscending = ascending;
      this.applySorting(this.cards);
    }

    /**
     * Apply sorting to a card array
     */
    private applySorting(cards: CardInstance[]): void {
      cards.sort((a, b) => {
        let comparison = 0;

        switch (this.sortBy) {
          case 'name':
            comparison = a.name.localeCompare(b.name);
            break;
          case 'level':
            comparison = a.level - b.level;
            break;
          case 'affinity':
            comparison = (a.affinity || '').localeCompare(b.affinity || '');
            break;
          case 'attack':
            comparison = (a.currentAttack || 0) - (b.currentAttack || 0);
            break;
          case 'health':
            comparison = (a.currentHealth || 0) - (b.currentHealth || 0);
            break;
          case 'xp':
            comparison = a.currentXP - b.currentXP;
            break;
        }

        return this.sortAscending ? comparison : -comparison;
      });
    }

    /**
     * Get collection statistics
     */
    public getStats(): CollectionStats {
      const stats: CollectionStats = {
        totalCards: this.cards.length,
        uniqueCards: new Set(this.cards.map(c => c.cardId)).size,
        cardsByAffinity: {
          Forest: 0,
          Fire: 0,
          Water: 0,
          Sky: 0,
          Generic: 0,
        },
        averageLevel: 0,
        totalXP: 0,
      };

      let totalLevel = 0;
      for (const card of this.cards) {
        if (card.affinity) {
          stats.cardsByAffinity[card.affinity]++;
        }
        totalLevel += card.level;
        stats.totalXP += card.currentXP;
      }

      stats.averageLevel = this.cards.length > 0 ? totalLevel / this.cards.length : 0;

      return stats;
    }

    /**
     * Add a new card to collection
     */
    public addCard(card: CardInstance): void {
      this.cards.push(card);
    }

    /**
     * Remove a card from collection
     */
    public removeCard(id: string): boolean {
      const index = this.cards.findIndex(card => card.id === id);
      if (index !== -1) {
        this.cards.splice(index, 1);
        return true;
      }
      return false;
    }
  }

  // ==================== bloombeasts\screens\cards\CardsUI.ts ====================

  /**
   * Cards UI - Visual presentation of the card collection
   */


  export interface DisplayOptions {
    viewMode: 'grid' | 'list' | 'detailed';
    cardsPerPage: number;
    currentPage: number;
  }

  export class CardsUI {
    private displayOptions: DisplayOptions;
    private callbacks: SimpleMap<string, Function> = new SimpleMap();
    private selectedCardIndex: number = 0;

    constructor() {
      this.displayOptions = {
        viewMode: 'grid',
        cardsPerPage: 12,
        currentPage: 1,
      };
    }

    /**
     * Render the inventory UI with cards
     */
    public async render(cards: CardInstance[]): Promise<void> {
      // Print newlines to simulate clearing (console.clear not available in ES3)
      console.log('\n\n\n\n\n');
      console.log('===========================================');
      console.log('         📦 CARD INVENTORY 📦              ');
      console.log('===========================================');
      console.log(`Total Cards: ${cards.length} | View: ${this.displayOptions.viewMode}`);
      console.log('-------------------------------------------');

      if (this.displayOptions.viewMode === 'grid') {
        this.renderGrid(cards);
      } else if (this.displayOptions.viewMode === 'list') {
        this.renderList(cards);
      } else {
        this.renderDetailed(cards);
      }

      console.log('-------------------------------------------');
      console.log('Controls: [↑↓←→] Navigate | [Enter] Select | [F] Filter | [S] Sort | [V] View Mode | [B] Back');
    }

    /**
     * Render cards in grid view
     */
    private renderGrid(cards: CardInstance[]): void {
      const startIdx = (this.displayOptions.currentPage - 1) * this.displayOptions.cardsPerPage;
      const endIdx = Math.min(startIdx + this.displayOptions.cardsPerPage, cards.length);
      const pageCards = cards.slice(startIdx, endIdx);

      // Display in 4x3 grid
      for (let row = 0; row < 3; row++) {
        let rowStr = '';
        for (let col = 0; col < 4; col++) {
          const idx = row * 4 + col;
          if (idx < pageCards.length) {
            const card = pageCards[idx];
            const selected = idx === this.selectedCardIndex ? '[*]' : '   ';
            const lvl = card.level > 1 ? `Lv${card.level}` : '';
            rowStr += `${selected} ${card.name.substring(0, 10).padEnd(10)} ${lvl.padEnd(4)} | `;
          }
        }
        console.log(rowStr);
      }
    }

    /**
     * Render cards in list view
     */
    private renderList(cards: CardInstance[]): void {
      const startIdx = (this.displayOptions.currentPage - 1) * this.displayOptions.cardsPerPage;
      const endIdx = Math.min(startIdx + this.displayOptions.cardsPerPage, cards.length);
      const pageCards = cards.slice(startIdx, endIdx);

      pageCards.forEach((card, idx) => {
        const selected = idx === this.selectedCardIndex ? '>' : ' ';
        const stats = `ATK: ${card.currentAttack}/${card.baseAttack} | HP: ${card.currentHealth}/${card.baseHealth}`;
        const xp = card.currentXP > 0 ? `| XP: ${card.currentXP}` : '';
        const affinity = (card.affinity || 'None').padEnd(8);
        console.log(`${selected} ${card.name.padEnd(20)} ${affinity} Lv${card.level} ${stats} ${xp}`);
      });
    }

    /**
     * Render detailed card view
     */
    private renderDetailed(cards: CardInstance[]): void {
      if (cards.length === 0) {
        console.log('No cards to display');
        return;
      }

      const card = cards[this.selectedCardIndex];
      console.log(`╔════════════════════════════════════════╗`);
      console.log(`║ ${card.name.padEnd(38)} ║`);
      console.log(`║ ${(card.affinity || 'None').padEnd(38)} ║`);
      console.log(`╠════════════════════════════════════════╣`);
      console.log(`║ Level: ${String(card.level).padEnd(31)} ║`);
      console.log(`║ XP: ${String(card.currentXP).padEnd(34)} ║`);
      console.log(`║ Attack: ${card.currentAttack}/${card.baseAttack}`.padEnd(39) + '║');
      console.log(`║ Health: ${card.currentHealth}/${card.baseHealth}`.padEnd(39) + '║');
      console.log(`╠════════════════════════════════════════╣`);
      if (card.ability) {
        console.log(`║ Ability: ${card.ability.name.padEnd(29)} ║`);
      }
      console.log(`╚════════════════════════════════════════╝`);
    }

    /**
     * Show detailed view of a single card
     */
    public showCardDetails(card: CardInstance): void {
      this.renderDetailed([card]);
    }

    /**
     * Handle card selection
     */
    public onCardSelect(callback: (cardId: string) => void): void {
      this.callbacks.set('cardSelect', callback);
    }

    /**
     * Handle filter changes
     */
    public onFilterChange(callback: (filterType: any, value: any) => void): void {
      this.callbacks.set('filterChange', callback);
    }

    /**
     * Handle sort changes
     */
    public onSortChange(callback: (sortBy: any) => void): void {
      this.callbacks.set('sortChange', callback);
    }

    /**
     * Handle back button
     */
    public onBackClick(callback: () => void): void {
      this.callbacks.set('back', callback);
    }

    /**
     * Change view mode
     */
    public changeViewMode(mode: 'grid' | 'list' | 'detailed'): void {
      this.displayOptions.viewMode = mode;
    }

    /**
     * Navigate to next page
     */
    public nextPage(): void {
      this.displayOptions.currentPage++;
    }

    /**
     * Navigate to previous page
     */
    public previousPage(): void {
      if (this.displayOptions.currentPage > 1) {
        this.displayOptions.currentPage--;
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
    playerDeck?: DeckList;        // Optional fixed deck for player
    opponentDeck: DeckList;       // AI opponent's deck
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

  // ==================== bloombeasts\screens\missions\definitions\mission01.ts ====================

  /**
   * Mission 01: Rootling
   * Forest Affinity Mission
   */


  // test deck just has Rootling
  const testDeck = buildForestDeck();
  testDeck.cards = testDeck.cards.filter((card) => card.id === 'Rootling');
  testDeck.totalCards = testDeck.cards.length;
  console.log('testDeck', testDeck);

  export const mission01: Mission = {
    id: 'mission-01',
    name: 'Rootling',
    description: 'Battle the Rootling in the forest depths.',
    difficulty: 'beginner',
    level: 1,
    affinity: 'Forest',
    beastId: 'Rootling',

    opponentDeck: testDeck, //buildForestDeck(),

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
   * Mission 02: Fuzzlet
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

    opponentDeck: buildForestDeck(),

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

    opponentDeck: buildForestDeck(),

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

    opponentDeck: buildForestDeck(),

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

    opponentDeck: buildWaterDeck(),

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

    opponentDeck: buildWaterDeck(),

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

    opponentDeck: buildWaterDeck(),

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

    opponentDeck: buildWaterDeck(),

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

    opponentDeck: buildFireDeck(),

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

    opponentDeck: buildFireDeck(),

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

    opponentDeck: buildFireDeck(),

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

    opponentDeck: buildFireDeck(),

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

    opponentDeck: buildSkyDeck(),

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

    opponentDeck: buildSkyDeck(),

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

    opponentDeck: buildSkyDeck(),

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

    opponentDeck: buildSkyDeck(),

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

    opponentDeck: getMasterDeck(),

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
    private currentMission: Mission | null = null;
    private progress: MissionRunProgress | null = null;
    private completedMissions: SimpleMap<string, number> = new SimpleMap();

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
      const allCards = getAllCards();

      // Filter by pool and affinity
      let eligibleCards = allCards.filter(card => {
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

        // Unlock mission if it has been completed before
        if (completionCount > 0) {
          mission.unlocked = true;

          // Also unlock the next mission
          if (index + 1 < missions.length) {
            missions[index + 1].unlocked = true;
          }
        }
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
      // Check if mission is unlocked
      if (!mission.unlocked && mission.timesCompleted === 0) {
        // Check if previous mission is completed
        const allMissions = getAvailableMissions(99); // Get all missions
        const missionIndex = allMissions.findIndex(m => m.id === mission.id);

        if (missionIndex > 0) {
          const previousMission = allMissions[missionIndex - 1];
          if (previousMission.timesCompleted === 0) {
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
    private gameState: GameState;
    private combatSystem: CombatSystem;
    private abilityProcessor: AbilityProcessor;
    private levelingSystem: LevelingSystem;
    private cardDatabase: Map<string, AnyCard>;

    constructor() {
      this.gameState = this.createInitialState();
      this.combatSystem = new CombatSystem();
      this.abilityProcessor = new AbilityProcessor();
      this.levelingSystem = new LevelingSystem();
      this.cardDatabase = this.buildCardDatabase();
    }

    /**
     * Build card database from all card definitions
     */
    private buildCardDatabase(): Map<string, AnyCard> {
      const db = new Map<string, AnyCard>();
      const allCards = getAllCards();
      allCards.forEach((card: any) => {
        if (card && card.id && card.type) {
          db.set(card.id, card as AnyCard);
        }
      });
      return db;
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
      return {
        name,
        health: STARTING_HEALTH,
        currentNectar: 0,
        deck: [],
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

      // Set player names
      if (options.player1Name) {
        this.gameState.players[0].name = options.player1Name;
      }
      if (options.player2Name) {
        this.gameState.players[1].name = options.player2Name;
      }

      // Load decks
      this.gameState.players[0].deck = [...player1Deck.cards];
      this.gameState.players[1].deck = [...player2Deck.cards];

      // Shuffle decks
      this.shuffleDeck(this.gameState.players[0]);
      this.shuffleDeck(this.gameState.players[1]);

      // Draw initial hands
      this.drawCards(this.gameState.players[0], 5);
      this.drawCards(this.gameState.players[1], 5);

      // Transition to first player's turn
      this.gameState.phase = 'Main';
      this.gameState.battleState = BattleState.Player1StartOfTurn;
      await this.transitionState();
    }

    /**
     * State machine transition logic
     */
    private async transitionState(): Promise<void> {
      // Check for win condition before any state processing
      if (this.checkForBattleEnd()) {
        this.gameState.battleState = BattleState.Finished;
        return;
      }

      const currentState = this.gameState.battleState;
      Logger.debug(`Transitioning from state: ${currentState}`);

      switch (currentState) {
        case BattleState.Player1StartOfTurn:
          await this.processPlayerStartOfTurn(0);
          this.gameState.battleState = BattleState.Player1Playing;
          break;

        case BattleState.Player1Playing:
          // This state waits for player input (endTurn call)
          break;

        case BattleState.Player1EndOfTurn:
          await this.processPlayerEndOfTurn(0);
          this.gameState.battleState = BattleState.Player2StartOfTurn;
          await this.transitionState();
          break;

        case BattleState.Player2StartOfTurn:
          await this.processPlayerStartOfTurn(1);
          this.gameState.battleState = BattleState.Player2Playing;
          break;

        case BattleState.Player2Playing:
          // This state waits for player input (endTurn call)
          break;

        case BattleState.Player2EndOfTurn:
          await this.processPlayerEndOfTurn(1);
          // Increment turn counter after both players have played
          this.gameState.turn++;
          this.gameState.battleState = BattleState.Player1StartOfTurn;
          await this.transitionState();
          break;

        case BattleState.Finished:
          // Battle has ended
          const result = this.combatSystem.checkWinCondition(this.gameState);
          this.endMatch(result);
          break;
      }
    }

    /**
     * Process player start of turn
     */
    private async processPlayerStartOfTurn(playerIndex: 0 | 1): Promise<void> {
      this.gameState.activePlayer = playerIndex;
      const activePlayer = this.gameState.players[playerIndex];
      const opposingPlayer = this.gameState.players[playerIndex === 0 ? 1 : 0];

      Logger.debug(`Turn ${this.gameState.turn}: ${activePlayer.name}'s turn begins`);

      // Reset turn counters
      activePlayer.summonsThisTurn = 0;

      // Draw card (except first turn for player 1)
      if (!(this.gameState.turn === 1 && playerIndex === 0)) {
        this.drawCards(activePlayer, 1);
      }

      // Gain nectar
      activePlayer.currentNectar = Math.min(MAX_NECTAR, this.gameState.turn);

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
        this.gameState.battleState = BattleState.Finished;
        return;
      }

      // Trigger start of turn abilities based on state
      await this.triggerStateBasedAbilities(playerIndex, 'start');

      // Set phase to main
      this.gameState.phase = 'Main';
    }

    /**
     * Process player end of turn
     */
    private async processPlayerEndOfTurn(playerIndex: 0 | 1): Promise<void> {
      const activePlayer = this.gameState.players[playerIndex];
      const opposingPlayer = this.gameState.players[playerIndex === 0 ? 1 : 0];

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
        this.gameState.battleState = BattleState.Finished;
        return;
      }
    }

    /**
     * Check if battle should end (player health <= 0)
     */
    private checkForBattleEnd(): boolean {
      const player1 = this.gameState.players[0];
      const player2 = this.gameState.players[1];

      return player1.health <= 0 || player2.health <= 0;
    }

    /**
     * End current turn
     */
    public async endTurn(): Promise<void> {
      // Determine which end of turn state to transition to
      if (this.gameState.battleState === BattleState.Player1Playing) {
        this.gameState.battleState = BattleState.Player1EndOfTurn;
      } else if (this.gameState.battleState === BattleState.Player2Playing) {
        this.gameState.battleState = BattleState.Player2EndOfTurn;
      } else {
        Logger.error(`Unexpected state during endTurn: ${this.gameState.battleState}`);
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
            if (this.gameState.habitatZone) {
              player.graveyard.push(this.gameState.habitatZone);
            }
            this.gameState.habitatZone = card;
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
            // TODO: Apply ongoing buff effects to beasts
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
      const opponent = this.gameState.players[this.gameState.activePlayer === 0 ? 1 : 0];

      // Process each effect in the magic card
      for (const effect of card.effects) {
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

    /**
     * Apply habitat zone effects
     */
    private applyHabitatEffects(): void {
      if (!this.gameState.habitatZone) return;

      const habitat = this.gameState.habitatZone as HabitatCard;
      const activePlayer = this.gameState.players[this.gameState.activePlayer];
      const opposingPlayer = this.gameState.players[this.gameState.activePlayer === 0 ? 1 : 0];

      // Apply on-play effects immediately
      if (habitat.onPlayEffects) {
        for (const effect of habitat.onPlayEffects) {
          this.processHabitatEffect(effect, activePlayer, opposingPlayer);
        }
      }

      // Ongoing effects are applied continuously and checked during combat/ability processing
      Logger.debug(`Habitat ${habitat.name} active with ${habitat.ongoingEffects?.length || 0} ongoing effects`);
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
      const activePlayer = this.gameState.players[playerIndex];
      const opposingPlayer = this.gameState.players[playerIndex === 0 ? 1 : 0];

      // Determine which triggers to use based on player and phase
      const stateTriggers = [];

      if (phase === 'start') {
        // Player-specific triggers
        if (playerIndex === 0) {
          stateTriggers.push('OnPlayer1StartOfTurn');
        } else {
          stateTriggers.push('OnPlayer2StartOfTurn');
        }

        // Generic triggers
        stateTriggers.push('OnAnyStartOfTurn');

        // Own/Opponent relative triggers
        for (const beast of activePlayer.field) {
          if (beast) {
            await this.triggerBeastAbility(beast, 'OnOwnStartOfTurn', activePlayer, opposingPlayer);
          }
        }
        for (const beast of opposingPlayer.field) {
          if (beast) {
            await this.triggerBeastAbility(beast, 'OnOpponentStartOfTurn', opposingPlayer, activePlayer);
          }
        }
      } else {
        // Player-specific triggers
        if (playerIndex === 0) {
          stateTriggers.push('OnPlayer1EndOfTurn');
        } else {
          stateTriggers.push('OnPlayer2EndOfTurn');
        }

        // Generic triggers
        stateTriggers.push('OnAnyEndOfTurn');

        // Own/Opponent relative triggers
        for (const beast of activePlayer.field) {
          if (beast) {
            await this.triggerBeastAbility(beast, 'OnOwnEndOfTurn', activePlayer, opposingPlayer);
          }
        }
        for (const beast of opposingPlayer.field) {
          if (beast) {
            await this.triggerBeastAbility(beast, 'OnOpponentEndOfTurn', opposingPlayer, activePlayer);
          }
        }
      }

      // Trigger abilities for each state trigger
      for (const trigger of stateTriggers) {
        await this.triggerPassiveAbilities(trigger, activePlayer, opposingPlayer);
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
          gameState: this.gameState,
          controllingPlayer,
          opposingPlayer,
        });

        // Apply ability results to game state
        this.applyAbilityResults(results);

        // Check for battle end after ability effects
        if (this.checkForBattleEnd()) {
          this.gameState.battleState = BattleState.Finished;
        }
      }
    }



    /**
     * Trigger summon abilities
     */
    private triggerSummonAbilities(beast: BloomBeastInstance): void {
      const activePlayer = this.gameState.players[this.gameState.activePlayer];
      const opposingPlayer = this.gameState.players[this.gameState.activePlayer === 0 ? 1 : 0];

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
          gameState: this.gameState,
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
      const opposingPlayer = this.gameState.players[this.gameState.activePlayer === 0 ? 1 : 0];

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
            gameState: this.gameState,
            controllingPlayer,
            opposingPlayer,
          });

          // Apply ability results to game state
          this.applyAbilityResults(results);
        }
      }
    }

    /**
     * Trigger abilities for all beasts with the specified trigger
     */
    private async triggerPassiveAbilities(
      trigger: string,
      controllingPlayer: Player,
      opposingPlayer: Player
    ): Promise<void> {
      for (const beast of controllingPlayer.field) {
        if (!beast) continue;

        const cardDef = this.getCardDefinition(beast.cardId);
        if (!cardDef || cardDef.type !== 'Bloom') continue;

        const beastCard = cardDef as BloomBeastCard;
        const abilities = this.getAbilitiesWithTrigger(beast, beastCard, trigger);

        // Process each ability with this trigger
        for (const ability of abilities) {
          const results = this.abilityProcessor.processAbility(ability, {
            source: beast,
            sourceCard: beastCard,
            trigger,
            gameState: this.gameState,
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
      return this.cardDatabase.get(cardId) || null;
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

      const defendingPlayer = this.gameState.players[this.gameState.activePlayer === 0 ? 1 : 0];

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
              this.gameState.battleState = BattleState.Finished;
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
                this.gameState.battleState = BattleState.Finished;
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
            this.gameState.battleState = BattleState.Finished;
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
          this.gameState.battleState = BattleState.Finished;
          await this.transitionState();
        }
      }

      // Always check for battle end after any damage
      if (this.checkForBattleEnd()) {
        this.gameState.battleState = BattleState.Finished;
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
          gameState: this.gameState,
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
      const opposingPlayer = triggeringPlayer === this.gameState.players[0]
        ? this.gameState.players[1]
        : this.gameState.players[0];

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
      // Process each effect in the trap card
      for (const effect of trap.effects) {
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
            for (const player of this.gameState.players) {
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
            this.gameState.players = result.modifiedState.players;
          }
          if (result.modifiedState.habitatCounters) {
            this.gameState.habitatCounters = result.modifiedState.habitatCounters;
          }
          if (result.modifiedState.drawCardsQueued !== undefined) {
            const playerIndex = result.modifiedState.drawForPlayerIndex ?? this.gameState.activePlayer;
            const player = this.gameState.players[playerIndex];
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
        this.gameState.battleState = BattleState.Finished;
        // Don't transition immediately here as we might be in the middle of processing
        // The next game loop iteration will handle the transition
      }
    }

    /**
     * Get current game state
     */
    public getState(): GameState {
      return this.gameState;
    }

    /**
     * Reset for new game
     */
    public reset(): void {
      this.gameState = this.createInitialState();
      this.combatSystem.reset();
    }
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

    constructor(callbacks: AICallbacks = {}) {
      this.callbacks = callbacks;
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
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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
      gameState: GameState
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
          return this.playMagicCard(cardIndex, player, opponent);

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
    private playMagicCard(cardIndex: number, player: Player, opponent: Player): PlayCardResult {
      const magicCard: any = player.hand.splice(cardIndex, 1)[0];
      player.currentNectar -= magicCard.cost;

      // Process magic card effects immediately
      if (magicCard.effects && Array.isArray(magicCard.effects)) {
        for (const effect of magicCard.effects) {
          this.processMagicEffect(effect, player, opponent);
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

      // Check for trap activation
      this.checkAndActivateTraps(opponent, player, 'attack', onTrapCallback);

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

      // Check for trap activation
      this.checkAndActivateTraps(opponent, player, 'attack', onTrapCallback);

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
    processMagicEffect(effect: any, player: any, opponent: any): void {
      switch (effect.type) {
        case 'deal-damage':
          const damageTarget = this.getEffectTargets(effect.target, player, opponent, effect.condition);
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
          const healTarget = this.getEffectTargets(effect.target, player, opponent, effect.condition);
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
          const destroyTarget = this.getEffectTargets(effect.target, player, opponent, effect.condition);
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
          const statTarget = this.getEffectTargets(effect.target, player, opponent, effect.condition);
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
          const removeTargets = this.getEffectTargets(effect.target, player, opponent, effect.condition);
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
          const removeTargets = this.getEffectTargets(effect.target, player, opponent, effect.condition);
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

        case 'deal-damage':
          const damageTargets = this.getEffectTargets(effect.target, player, opponent, effect.condition);
          damageTargets.forEach((target: any) => {
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
    private getEffectTargets(targetType: string, player: any, opponent: any, condition?: any): any[] {
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

        if (triggerType === 'attack' && trap.trigger === 'OnAttack') {
          Logger.debug(`Trap activated: ${trap.name}!`);

          if (onTrapCallback) {
            onTrapCallback('trap-activated');
          }

          // Process trap effects
          if (trap.effects && Array.isArray(trap.effects)) {
            for (const effect of trap.effects) {
              this.processMagicEffect(effect, defender, attacker);
            }
          }

          // Remove trap from zone
          const activatedTrap = defender.trapZone.splice(i, 1)[0];
          defender.graveyard.push(activatedTrap);
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
    private currentBattle: BattleUIState | null = null;
    private renderCallback: (() => void) | null = null;
    private opponentActionCallback: ((action: string) => void) | null = null;
    private playerLowHealthTriggered: boolean = false; // Track if low health sound already played
    private battleStateManager: BattleStateManager;
    private opponentAI: OpponentAI;
    private shouldStopAI: boolean = false; // Flag to stop AI turn processing

    constructor(missionManager: MissionManager, gameEngine: GameEngine) {
      this.missionManager = missionManager;
      this.gameEngine = gameEngine;
      this.battleStateManager = new BattleStateManager();
      this.opponentAI = new OpponentAI({
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
        health: 30,
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
      console.log('mission.opponentDeck.cards', mission.opponentDeck.cards);

      // Create AI opponent with mission-specific configuration
      const opponent: Player = {
        id: 'opponent',
        name: mission.opponentAI?.name || 'Opponent',
        health: 1,
        maxHealth: 1,
        deck: mission.opponentDeck.cards,
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
        // Extract card index from action (e.g., 'play-card-0' -> 0)
        const cardIndex = parseInt(action.substring('play-card-'.length), 10);
        result = this.playCard(cardIndex);
      } else if (action.startsWith('use-ability-')) {
        // Extract beast index (e.g., 'use-ability-0' -> 0)
        const beastIndex = parseInt(action.substring('use-ability-'.length), 10);
        result = this.useAbility(beastIndex);
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
    private playCard(cardIndex: number): any {
      if (!this.currentBattle || !this.currentBattle.gameState) {
        return { success: false, message: 'No active battle' };
      }

      const player = this.currentBattle.gameState.players[0];
      const opponent = this.currentBattle.gameState.players[1];

      return this.battleStateManager.playCard(cardIndex, player, opponent, this.currentBattle.gameState);
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
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

  // ==================== bloombeasts\systems\SoundManager.ts ====================

  /**
   * Sound Manager - Handles background music and sound effects
   * Platform-independent audio management
   */

  export interface SoundSettings {
    musicVolume: number; // 0-100
    sfxVolume: number; // 0-100
    musicEnabled: boolean;
    sfxEnabled: boolean;
  }

  /**
   * Platform callbacks for audio operations
   */
  export interface AudioCallbacks {
    playMusic(src: string, loop: boolean, volume: number): void;
    stopMusic(): void;
    playSfx(src: string, volume: number): void;
    setMusicVolume(volume: number): void;
    setSfxVolume(volume: number): void;
  }

  export class SoundManager {
    private settings: SoundSettings;
    private audioCallbacks: AudioCallbacks;
    private currentMusic: string | null = null;

    constructor(audioCallbacks: AudioCallbacks) {
      this.audioCallbacks = audioCallbacks;

      // Default settings
      this.settings = {
        musicVolume: 10,
        sfxVolume: 50,
        musicEnabled: true,
        sfxEnabled: true,
      };
    }

    /**
     * Load settings from storage
     */
    loadSettings(savedSettings?: Partial<SoundSettings>): void {
      if (savedSettings) {
        this.settings = {
          ...this.settings,
          ...savedSettings,
        };
      }
    }

    /**
     * Get current settings
     */
    getSettings(): SoundSettings {
      return { ...this.settings };
    }

    /**
     * Update music volume
     */
    setMusicVolume(volume: number): void {
      this.settings.musicVolume = Math.max(0, Math.min(100, volume));
      if (this.settings.musicEnabled) {
        this.audioCallbacks.setMusicVolume(this.settings.musicVolume / 100);
      }
    }

    /**
     * Update SFX volume
     */
    setSfxVolume(volume: number): void {
      this.settings.sfxVolume = Math.max(0, Math.min(100, volume));
      if (this.settings.sfxEnabled) {
        this.audioCallbacks.setSfxVolume(this.settings.sfxVolume / 100);
      }
    }

    /**
     * Toggle music on/off
     */
    toggleMusic(enabled: boolean): void {
      this.settings.musicEnabled = enabled;

      if (enabled && this.currentMusic) {
        // Resume music
        this.playMusic(this.currentMusic, true);
      } else if (!enabled) {
        // Stop music
        this.audioCallbacks.stopMusic();
      }
    }

    /**
     * Toggle SFX on/off
     */
    toggleSfx(enabled: boolean): void {
      this.settings.sfxEnabled = enabled;
    }

    /**
     * Play background music
     */
    playMusic(musicId: string, loop: boolean = true): void {
      // Don't restart music if it's already playing
      if (this.currentMusic === musicId) {
        return;
      }

      this.currentMusic = musicId;

      if (this.settings.musicEnabled) {
        const volume = this.settings.musicVolume / 100;
        this.audioCallbacks.playMusic(musicId, loop, volume);
      }
    }

    /**
     * Stop background music
     */
    stopMusic(): void {
      this.currentMusic = null;
      this.audioCallbacks.stopMusic();
    }

    /**
     * Play sound effect
     */
    playSfx(sfxId: string): void {
      if (this.settings.sfxEnabled) {
        const volume = this.settings.sfxVolume / 100;
        this.audioCallbacks.playSfx(sfxId, volume);
      }
    }

    /**
     * Get current music playing
     */
    getCurrentMusic(): string | null {
      return this.currentMusic;
    }
  }

  // ==================== bloombeasts\systems\SaveLoadManager.ts ====================

  /**
   * SaveLoadManager - Handles game data persistence
   * Manages saving and loading player data, including cards, missions, and progress
   */


  export interface PlayerItem {
    itemId: string;
    quantity: number;
  }

  export interface PlayerData {
    name: string;
    level: number;
    totalXP: number;
    cards: {
      collected: any[];
      deck: string[];
    };
    missions: {
      completedMissions: { [missionId: string]: number };
    };
    items: PlayerItem[];
  }

  interface PlatformStorage {
    saveData(key: string, data: any): Promise<void>;
    loadData(key: string): Promise<any>;
  }

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

  export class SaveLoadManager {
    private platform: PlatformStorage;
    private playerData: PlayerData;

    constructor(platform: PlatformStorage) {
      this.platform = platform;

      // Initialize default player data
      this.playerData = {
        name: 'Player',
        level: 1,
        totalXP: 0,
        cards: {
          collected: [],
          deck: []
        },
        missions: {
          completedMissions: {}
        },
        items: []
      };
    }

    /**
     * Get player data
     */
    getPlayerData(): PlayerData {
      return this.playerData;
    }

    /**
     * Set player data (used for updating from other systems)
     */
    setPlayerData(data: PlayerData): void {
      this.playerData = data;
    }

    /**
     * Save game data
     */
    async saveGameData(cardCollection: CardCollection, playerDeck: string[]): Promise<void> {
      // Update cards in playerData before saving
      this.playerData.cards.collected = cardCollection.getAllCards();
      this.playerData.cards.deck = playerDeck;

      await this.platform.saveData('bloom-beasts-save', {
        playerData: this.playerData,
      });
    }

    /**
     * Load game data
     */
    async loadGameData(
      cardCollection: CardCollection,
      missionManager: MissionManager
    ): Promise<string[]> {
      const savedData = await this.platform.loadData('bloom-beasts-save');
      let playerDeck: string[] = [];

      if (savedData && savedData.playerData) {
        const data = savedData.playerData;

        // Check if this is the new format or old format
        if (data.cards && data.missions) {
          // New format - direct assignment
          this.playerData = data;

          // Ensure items array exists (for saves created before items feature)
          if (!this.playerData.items) {
            this.playerData.items = [];
          }

          // Ensure completedMissions object exists (for saves created before mission tracking feature)
          if (!this.playerData.missions.completedMissions) {
            this.playerData.missions.completedMissions = {};
          }

          // Ensure localState exists (for Horizon deployment - UI navigation state)
          if (!(this.playerData as any).localState) {
            (this.playerData as any).localState = {
              currentScreen: 'menu',
              volume: 80,
              sfxVolume: 80,
              cardsPageOffset: 0
            };
          }

          // Load cards into collection
          if (data.cards.collected) {
            data.cards.collected.forEach((cardInstance: CardInstance) => {
              cardCollection.addCard(cardInstance);
            });
          }

          // Load deck
          playerDeck = data.cards.deck || [];
        } else {
          // Old format - migrate to new format
          this.playerData = {
            name: data.playerName || 'Player',
            level: data.playerLevel || 1,
            totalXP: data.totalXP || 0,
            cards: {
              collected: data.cardInventory || savedData.collection || [],
              deck: savedData.playerDeck || []
            },
            missions: {
              completedMissions: {}  // Initialize empty for old saves
            },
            items: []  // Initialize items for old saves
          };

          // Load old collection format
          if (savedData.collection) {
            savedData.collection.forEach((cardInstance: CardInstance) => {
              cardCollection.addCard(cardInstance);
            });
          } else if (data.cardInventory) {
            data.cardInventory.forEach((cardInstance: CardInstance) => {
              cardCollection.addCard(cardInstance);
            });
          }

          // Load old deck format
          if (savedData.playerDeck) {
            playerDeck = savedData.playerDeck;
          }

          // Save in new format
          await this.saveGameData(cardCollection, playerDeck);
        }

        // Update player level based on XP
        this.updatePlayerLevel();

        // Load completed missions into MissionManager
        if (this.playerData.missions.completedMissions) {
          missionManager.loadCompletedMissions(this.playerData.missions.completedMissions);
        }
      }

      return playerDeck;
    }

    /**
     * Update player level based on XP
     * Player leveling uses steep exponential scaling
     */
    updatePlayerLevel(): void {
      for (let level = 9; level >= 1; level--) {
        if (this.playerData.totalXP >= XP_THRESHOLDS[level - 1]) {
          this.playerData.level = level;
          break;
        }
      }
    }

    /**
     * Get player info for UI display (name, level, XP progress)
     * Returns current XP within level and XP required for next level
     */
    getPlayerInfo(): { name: string; level: number; currentXP: number; xpForNextLevel: number } {
      const currentLevel = this.playerData.level;
      const totalXP = this.playerData.totalXP;

      // Calculate XP within current level
      const xpForCurrentLevel = XP_THRESHOLDS[currentLevel - 1];
      const xpForNextLevel = currentLevel < 9 ? XP_THRESHOLDS[currentLevel] : XP_THRESHOLDS[8];
      const currentXP = totalXP - xpForCurrentLevel;
      const xpNeeded = xpForNextLevel - xpForCurrentLevel;

      return {
        name: this.playerData.name,
        level: currentLevel,
        currentXP: currentXP,
        xpForNextLevel: xpNeeded,
      };
    }

    /**
     * Add XP to player
     */
    addXP(amount: number): void {
      this.playerData.totalXP += amount;
      this.updatePlayerLevel();
    }

    /**
     * Get the quantity of a specific item from player's items array
     */
    getItemQuantity(itemId: string): number {
      const item = this.playerData.items.find(i => i.itemId === itemId);
      return item ? item.quantity : 0;
    }

    /**
     * Track mission completion
     */
    trackMissionCompletion(missionId: string): void {
      const currentCount = this.playerData.missions.completedMissions[missionId] || 0;
      this.playerData.missions.completedMissions[missionId] = currentCount + 1;
    }

    /**
     * Add items to player's inventory
     */
    addItems(itemId: string, quantity: number): void {
      const existingItem = this.playerData.items.find(i => i.itemId === itemId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.playerData.items.push({
          itemId,
          quantity,
        });
      }
    }
  }

  // ==================== bloombeasts\systems\CardCollectionManager.ts ====================

  /**
   * CardCollectionManager - Manages card operations and transformations
   * Handles card display conversion, leveling, abilities, deck building, and XP awards
   */


  export interface CardDisplay {
    id: string;
    name: string;
    type: string;
    affinity?: string;
    cost?: number;
    level: number;
    experience: number;
    experienceRequired?: number;
    count: number;
    baseAttack?: number;
    currentAttack?: number;
    baseHealth?: number;
    currentHealth?: number;
    abilities?: any[]; // Array of all abilities for Bloom cards (used for description generation)
    effects?: any[]; // For Magic/Trap/Buff cards
    ongoingEffects?: any[]; // For Buff/Habitat cards
    onPlayEffects?: any[]; // For Habitat cards
    activation?: any; // For Trap cards
    description?: string;
    counters?: Array<{ type: string; amount: number }>;
    titleColor?: string; // Custom title color (hex color)
  }

  export class CardCollectionManager {
    private levelingSystem: LevelingSystem;

    constructor() {
      this.levelingSystem = new LevelingSystem();
    }

    /**
     * Convert a CardInstance to CardDisplay format
     * This centralizes all the logic for enriching card instances with definition data
     */
    cardInstanceToDisplay(card: CardInstance): CardDisplay {
      const allCardDefs = getAllCards();
      const cardDef = allCardDefs.find((c: any) => c && c.id === card.cardId);

      // Build base display card with common properties
      const displayCard: CardDisplay = this.buildBaseCardDisplay(card, cardDef);

      // Add type-specific fields
      this.addTypeSpecificFields(displayCard, card, cardDef);

      return displayCard;
    }

    /**
     * Build base card display with common properties
     */
    private buildBaseCardDisplay(card: CardInstance, cardDef: any): CardDisplay {
      const displayCard: CardDisplay = {
        id: card.id,
        name: card.name,
        type: card.type,
        affinity: card.affinity,
        cost: card.cost,
        level: card.level,
        experience: card.currentXP || 0,
        experienceRequired: this.calculateExperienceRequired(card, cardDef),
        count: 1,
      };

      // Copy titleColor from card definition if present (applies to all card types)
      if (cardDef && cardDef.titleColor) {
        (displayCard as any).titleColor = cardDef.titleColor;
      }

      return displayCard;
    }

    /**
     * Calculate experience required for next level
     */
    private calculateExperienceRequired(card: CardInstance, cardDef: any): number {
      if (!card.level) return 0;

      if (card.type === 'Bloom') {
        // For Bloom beasts, use the LevelingSystem
        return this.levelingSystem.getXPRequirement(card.level as any, cardDef as BloomBeastCard | undefined) || 0;
      } else {
        // For Magic/Trap/Habitat/Buff cards, use simple formula (level * 100)
        return card.level * 100;
      }
    }

    /**
     * Add type-specific fields to card display
     */
    private addTypeSpecificFields(displayCard: CardDisplay, card: CardInstance, cardDef: any): void {
      switch (card.type) {
        case 'Bloom':
          this.addBloomCardFields(displayCard, card);
          break;
        case 'Trap':
          this.addTrapCardFields(displayCard, card, cardDef);
          break;
        case 'Magic':
          this.addMagicCardFields(displayCard, card);
          break;
        case 'Habitat':
        case 'Buff':
          this.addHabitatBuffCardFields(displayCard, cardDef);
          break;
      }
    }

    /**
     * Add Bloom-specific fields to card display
     */
    private addBloomCardFields(displayCard: CardDisplay, card: CardInstance): void {
      displayCard.baseAttack = card.baseAttack;
      displayCard.currentAttack = card.currentAttack;
      displayCard.baseHealth = card.baseHealth;
      displayCard.currentHealth = card.currentHealth;

      // Get the full abilities from the card definition (with effects array)
      const result = this.getAbilitiesForLevel(card);
      // Store all abilities for description generation
      displayCard.abilities = result.abilities;
    }

    /**
     * Add Trap-specific fields to card display
     */
    private addTrapCardFields(displayCard: CardDisplay, card: CardInstance, cardDef: any): void {
      // Include full structured effect data for description generation
      if (cardDef) {
        displayCard.effects = cardDef.effects;
        displayCard.activation = cardDef.activation;
      }
    }

    /**
     * Add Magic-specific fields to card display
     */
    private addMagicCardFields(displayCard: CardDisplay, card: CardInstance): void {
      // Include full structured effect data for description generation
      const allCardDefs = getAllCards();
      const cardDef = allCardDefs.find((c: any) => c && c.id === card.cardId);

      if (cardDef) {
        displayCard.effects = (cardDef as any).effects;
      }
    }

    /**
     * Add Habitat/Buff-specific fields to card display
     */
    private addHabitatBuffCardFields(displayCard: CardDisplay, cardDef: any): void {
      // Include full structured effect data for description generation
      if (cardDef) {
        displayCard.ongoingEffects = cardDef.ongoingEffects;
        displayCard.onPlayEffects = cardDef.onPlayEffects;
      }
    }

    /**
     * Get abilities for a card based on its level
     */
    getAbilitiesForLevel(cardInstance: CardInstance): { abilities: any[] } {
      // Get the base card definition
      const allCards = getAllCards();
      const cardDef = allCards.find((card: any) =>
        card && card.id === cardInstance.cardId
      ) as BloomBeastCard | undefined;

      if (!cardDef || cardDef.type !== 'Bloom') {
        return {
          abilities: []
        };
      }

      const level = cardInstance.level || 1;
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
     */
    getPlayerDeckCards(playerDeck: string[], cardCollection: CardCollection): AnyCard[] {
      const deckCards: AnyCard[] = [];
      const allCardDefs = getAllCards();

      // Convert all cards from player's deck
      for (const cardId of playerDeck) {
        const cardInstance = cardCollection.getCard(cardId);

        if (cardInstance) {
          if (cardInstance.type === 'Bloom') {
            // Get the correct abilities for the card's level
            const abilities = this.getAbilitiesForLevel(cardInstance);

            // Convert CardInstance to BloomBeastCard format for battle
            const bloomCard: BloomBeastCard = {
              id: cardInstance.cardId,
              instanceId: cardInstance.id, // Used for unique identification in battle
              name: cardInstance.name,
              type: 'Bloom',
              affinity: cardInstance.affinity || 'Forest',
              cost: cardInstance.cost,
              baseAttack: cardInstance.baseAttack || 0,
              baseHealth: cardInstance.baseHealth || 0,
              abilities: abilities.abilities,
              level: cardInstance.level || 1, // Include level for beast instance
              levelingConfig: {} as any, // Not used in battle
            } as any;

            deckCards.push(bloomCard);
          } else {
            // For non-Bloom cards, find the original card definition
            const originalCard = allCardDefs.find((card: any) =>
              card && card.id === cardInstance.cardId
            );

            if (originalCard) {
              // Use the original card definition for battle
              deckCards.push(originalCard as AnyCard);
            } else {
              // Fallback: create a simple card structure
              Logger.warn(`Card definition not found for ${cardInstance.cardId}, creating fallback`);
              const fallbackCard: any = {
                id: cardInstance.cardId,
                name: cardInstance.name,
                type: cardInstance.type,
                cost: cardInstance.cost || 0,
                affinity: cardInstance.affinity,
              };

              // Add type-specific properties
              if (cardInstance.type === 'Magic' || cardInstance.type === 'Trap') {
                fallbackCard.effects = [];
              } else if (cardInstance.type === 'Habitat') {
                fallbackCard.onPlayEffects = [];
                fallbackCard.ongoingEffects = [];
              }

              deckCards.push(fallbackCard);
            }
          }
        }
      }

      return deckCards;
    }

    /**
     * Award experience to all cards in the player's deck after battle victory
     * Card XP is distributed evenly across all cards in the deck
     */
    awardDeckExperience(totalCardXP: number, playerDeck: string[], cardCollection: CardCollection): void {
      const allCardDefs = getAllCards();

      // Distribute XP evenly across all cards in deck
      const xpPerCard = Math.floor(totalCardXP / playerDeck.length);

      // Award XP to each card in the deck
      for (const cardId of playerDeck) {
        const cardInstance = cardCollection.getCard(cardId);

        if (!cardInstance) continue;

        // Add XP
        cardInstance.currentXP = (cardInstance.currentXP || 0) + xpPerCard;

        // Check for level up
        let leveledUp = false;

        if (cardInstance.type === 'Bloom') {
          // For Bloom beasts, use the LevelingSystem
          const cardDef = allCardDefs.find((c: any) => c && c.id === cardInstance.cardId) as BloomBeastCard | undefined;

          if (cardDef) {
            let currentLevel = cardInstance.level || 1;
            let currentXP = cardInstance.currentXP;

            // Keep leveling up while possible
            while (currentLevel < 9) {
              const nextLevel = (currentLevel + 1) as any;
              const xpRequired = this.levelingSystem.getXPRequirement(currentLevel as any, cardDef);

              if (xpRequired !== null && currentXP >= xpRequired) {
                // Level up!
                currentXP -= xpRequired;
                currentLevel = nextLevel;

                // Apply stat gains
                const statGain = this.levelingSystem.getStatGain(currentLevel as any, cardDef);
                cardInstance.currentAttack = (cardInstance.currentAttack || 0) + statGain.attackGain;
                cardInstance.currentHealth = (cardInstance.currentHealth || 0) + statGain.healthGain;
                cardInstance.baseAttack = (cardInstance.baseAttack || 0) + statGain.attackGain;
                cardInstance.baseHealth = (cardInstance.baseHealth || 0) + statGain.healthGain;

                leveledUp = true;
              } else {
                break;
              }
            }

            // Update the card instance
            cardInstance.level = currentLevel;
            cardInstance.currentXP = currentXP;

            // Update ability if there's an upgrade at this level
            if (leveledUp) {
              const result = this.getAbilitiesForLevel(cardInstance);
              // Store the first ability in CardInstance (internal storage format)
              cardInstance.ability = result.abilities.length > 0 ? result.abilities[0] : undefined;
            }
          }
        } else {
          // For Magic/Trap/Habitat/Buff cards, use steep exponential leveling
          // Formula: XP = 20 * (2.0 ^ (level - 1))
          const nonBloomXPRequirements = [0, 20, 40, 80, 160, 320, 640, 1280, 2560];

          let currentLevel = cardInstance.level || 1;
          let currentXP = cardInstance.currentXP;

          // Keep leveling up while possible
          while (currentLevel < 9) {
            const xpRequired = nonBloomXPRequirements[currentLevel];

            if (currentXP >= xpRequired) {
              // Level up!
              currentXP -= xpRequired;
              currentLevel++;
              leveledUp = true;
            } else {
              break;
            }
          }

          // Update the card instance
          cardInstance.level = currentLevel;
          cardInstance.currentXP = currentXP;
        }

        if (leveledUp) {
          Logger.info(`${cardInstance.name} leveled up to level ${cardInstance.level}!`);
        }
      }
    }

    /**
     * Initialize starting collection
     */
    async initializeStartingCollection(cardCollection: CardCollection, playerDeck: string[]): Promise<string[]> {
      // Give player one starter deck worth of cards - default to Forest
      const starterDeck = getStarterDeck('Forest');

      starterDeck.cards.forEach((card, index) => {
        const baseId = `${card.id}-${Date.now()}-${index}`;

        if (card.type === 'Bloom') {
          // Process Bloom Beast cards
          const beastCard = card as BloomBeastCard;
          const cardInstance: CardInstance = {
            id: baseId,
            cardId: beastCard.id,
            name: beastCard.name,
            type: 'Bloom',
            affinity: beastCard.affinity,
            cost: beastCard.cost,
            level: 1,
            currentXP: 0,
            baseAttack: beastCard.baseAttack,
            currentAttack: beastCard.baseAttack,
            baseHealth: beastCard.baseHealth,
            currentHealth: beastCard.baseHealth,
            ability: beastCard.abilities && beastCard.abilities.length > 0 ? {
              name: (beastCard.abilities[0] as any).name || '',
              description: (beastCard.abilities[0] as any).description || ''
            } : undefined,
          };
          cardCollection.addCard(cardInstance);
          // Add to player's deck (up to DECK_SIZE cards)
          if (playerDeck.length < DECK_SIZE) {
            playerDeck.push(cardInstance.id);
          }
        } else {
          // Process Magic, Trap, and Habitat cards
          const cardInstance: CardInstance = {
            id: baseId,
            cardId: card.id,
            name: card.name,
            type: card.type,
            affinity: (card as any).affinity,
            cost: card.cost || 0,
            level: 1,           // All cards start at level 1
            currentXP: 0,       // All cards start with 0 XP
            // Add simplified effect descriptions for display
            effects: this.getEffectDescriptions(card),
            ability: undefined, // Non-Bloom cards use effects instead
          };
          cardCollection.addCard(cardInstance);
          // Add to player's deck (up to DECK_SIZE cards)
          if (playerDeck.length < DECK_SIZE) {
            playerDeck.push(cardInstance.id);
          }
        }
      });

      return playerDeck;
    }

    /**
     * Add card reward to collection
     */
    addCardReward(card: any, cardCollection: CardCollection, index: number): void {
      const baseId = `${card.id}-reward-${Date.now()}-${index}`;

      if (card.type === 'Bloom') {
        // Convert Bloom Beast card rewards to CardInstance for collection
        const beastCard = card as BloomBeastCard;
        const cardInstance: CardInstance = {
          id: baseId,
          cardId: beastCard.id,
          name: beastCard.name,
          type: 'Bloom',
          affinity: beastCard.affinity,
          cost: beastCard.cost,
          level: 1,
          currentXP: 0,
          baseAttack: beastCard.baseAttack,
          currentAttack: beastCard.baseAttack,
          baseHealth: beastCard.baseHealth,
          currentHealth: beastCard.baseHealth,
          ability: beastCard.abilities && beastCard.abilities.length > 0 ? {
            name: (beastCard.abilities[0] as any).name || '',
            description: (beastCard.abilities[0] as any).description || ''
          } : undefined,
        };
        cardCollection.addCard(cardInstance);
      } else {
        // Convert Magic, Trap, and Habitat card rewards to CardInstance
        const cardInstance: CardInstance = {
          id: baseId,
          cardId: card.id,
          name: card.name,
          type: card.type,
          affinity: card.affinity,
          cost: card.cost || 0,
          level: 1,           // All cards start at level 1
          currentXP: 0,       // All cards start with 0 XP
          effects: this.getEffectDescriptions(card),
          ability: undefined,
        };
        cardCollection.addCard(cardInstance);
      }
    }

    /**
     * Get simplified effect descriptions for Magic/Trap/Habitat cards
     */
    getEffectDescriptions(card: any): string[] {
      const allCardDefs = getAllCards();
      const lookupId = card.cardId || card.id;
      const cardDef = allCardDefs.find((c: any) => c && c.id === lookupId);

      let descriptions: string[] = [];

      switch (card.type) {
        case 'Magic':
          descriptions = this.getMagicCardDescriptions(card, cardDef);
          break;
        case 'Trap':
          descriptions = this.getTrapCardDescriptions(card, cardDef);
          break;
        case 'Habitat':
          descriptions = this.getHabitatCardDescriptions(card, cardDef);
          break;
      }

      return descriptions.length > 0 ? descriptions : ['Special card'];
    }

    /**
     * Get descriptions for Magic card effects
     */
    private getMagicCardDescriptions(card: any, cardDef: any): string[] {
      const descriptions: string[] = [];

      // Check if card definition has a description first (preferred method)
      if (cardDef && cardDef.description) {
        descriptions.push(cardDef.description);
        return descriptions;
      }

      // Fallback to parsing effects
      const effects = cardDef?.effects || card.effects || [];
      effects.forEach((effect: any) => {
        descriptions.push(this.getEffectDescription(effect));
      });

      return descriptions;
    }

    /**
     * Get descriptions for Trap card effects
     */
    private getTrapCardDescriptions(card: any, cardDef: any): string[] {
      const descriptions: string[] = [];

      // For trap cards, use the card's description if available
      if (cardDef && cardDef.description) {
        descriptions.push(cardDef.description);
        return descriptions;
      }

      // Fallback to parsing effects
      const effects = cardDef?.effects || card.effects || [];
      effects.forEach((effect: any) => {
        const effectType = effect.type || '';
        if (effectType === 'nullify-effect' || effectType === 'NullifyEffect') {
          descriptions.push('Counter and negate effect');
        } else if (effectType === 'damage' || effectType === 'Damage') {
          descriptions.push(`Deal ${effect.value || 0} damage`);
        } else {
          const typeStr = effectType.toString().replace(/([A-Z])/g, ' $1').trim();
          descriptions.push(typeStr || 'Trap effect');
        }
      });

      return descriptions;
    }

    /**
     * Get descriptions for Habitat card effects
     */
    private getHabitatCardDescriptions(card: any, cardDef: any): string[] {
      const descriptions: string[] = [];

      if (card.onPlayEffects || cardDef?.onPlayEffects) {
        descriptions.push('On Play: Field transformation');
      }
      if (card.ongoingEffects || cardDef?.ongoingEffects) {
        descriptions.push('Ongoing: Field bonuses');
      }

      return descriptions;
    }

    /**
     * Convert a single effect to a readable description
     */
    private getEffectDescription(effect: any): string {
      const effectType = effect.type || '';

      if (effectType === 'draw-cards' || effectType === 'DrawCards') {
        return `Draw ${effect.value || 1} card(s)`;
      } else if (effectType === 'heal' || effectType === 'Heal') {
        return `Heal ${effect.value || 0}`;
      } else if (effectType === 'deal-damage' || effectType === 'Damage') {
        return `Deal ${effect.value || 0} damage`;
      } else if (effectType === 'modify-stats' || effectType === 'ModifyStats') {
        return `Modify stats by ${effect.attack || 0}/${effect.health || 0}`;
      } else if (effectType === 'gain-resource' || effectType === 'GainResource') {
        return `Gain ${effect.value || 1} ${effect.resource || 'nectar'}`;
      } else if (effectType === 'remove-counter' || effectType === 'RemoveCounter') {
        return `Remove ${effect.counter || 'all'} counters`;
      } else if (effectType === 'destroy' || effectType === 'Destroy') {
        return `Destroy target`;
      } else {
        // Try to create a readable description from the effect type
        const typeStr = effectType.toString().replace(/([A-Z])/g, ' $1').replace(/-/g, ' ').trim();
        return typeStr || 'Special effect';
      }
    }
  }

  // ==================== bloombeasts\systems\BattleDisplayManager.ts ====================

  /**
   * BattleDisplayManager - Handles battle UI rendering and display enrichment
   * Manages battle state visualization, animations, and card popups
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
    selectedBeastIndex: number | null; // Track selected beast for attacking
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

  export interface ObjectiveDisplay {
    description: string;
    progress: number;
    target: number;
    isComplete: boolean;
  }

  export class BattleDisplayManager {
    /**
     * Create a battle display object from battle state
     */
    createBattleDisplay(
      battleState: any,
      selectedBeastIndex: number | null,
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
        selectedBeastIndex: selectedBeastIndex,
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
          description: obj.description,
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
      const allCards = getAllCards();
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

  // ==================== bloombeasts\gameManager.ts ====================

  /**
   * GameManager - Main orchestrator for the Bloom Beasts game
   * Platform-independent game manager that uses callbacks for platform-specific functionality
   */


  export interface MenuStats {
    playerLevel: number;
    totalXP: number;
    tokens: number;
    diamonds: number;
    serums: number;
  }

  /**
   * Platform callbacks interface - implement these for your specific platform
   */
  export interface PlatformCallbacks {
    // Player data
    setPlayerData(data: any): void;
    getPlayerData?(): any;

    // UI Rendering
    renderStartMenu(options: string[], stats: MenuStats): void;
    renderMissionSelect(missions: MissionDisplay[], stats: MenuStats): void;
    renderCards(cards: CardDisplay[], deckSize: number, deckCardIds: string[], stats: MenuStats): void;
    renderBattle(battleState: BattleDisplay): void;
    renderSettings(settings: SoundSettings, stats: MenuStats): void;
    renderCardDetail(cardDetail: CardDetailDisplay, stats: MenuStats): void;

    // Input handling
    onButtonClick(callback: (buttonId: string) => void): void;
    onCardSelect(callback: (cardId: string) => void): void;
    onMissionSelect(callback: (missionId: string) => void): void;
    onSettingsChange(callback: (settingId: string, value: any) => void): void;

    // Asset loading
    loadCardImage(cardId: string): Promise<any>;
    loadBackground(backgroundId: string): Promise<any>;
    playSound(soundId: string): void;

    // Audio control
    playMusic(src: string, loop: boolean, volume: number): void;
    stopMusic(): void;
    playSfx(src: string, volume: number): void;
    setMusicVolume(volume: number): void;
    setSfxVolume(volume: number): void;
    setCardsSfxCallback?(callback: (src: string) => void): void;

    // Storage
    saveData(key: string, data: any): Promise<void>;
    loadData(key: string): Promise<any>;

    // Dialogs
    showDialog(title: string, message: string, buttons?: string[]): Promise<string>;
    showRewards(rewards: RewardDisplay): Promise<void>;
  }

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

  export interface CardDisplay {
    id: string;
    name: string;
    type: string;
    affinity?: string;
    cost?: number;
    level: number;
    experience: number;
    experienceRequired?: number;
    count: number;
    baseAttack?: number;
    currentAttack?: number;
    baseHealth?: number;
    currentHealth?: number;
    abilities?: any[]; // Array of all abilities for Bloom cards (used for description generation)
    effects?: any[]; // For Magic/Trap/Buff cards
    ongoingEffects?: any[]; // For Buff/Habitat cards
    onPlayEffects?: any[]; // For Habitat cards
    activation?: any; // For Trap cards
    description?: string; // Description for Magic/Trap/Habitat/Buff cards
    counters?: Array<{ type: string; amount: number }>; // Counters on the card
    titleColor?: string; // Custom title color (hex color)
  }

  export interface CardDetailDisplay {
    card: CardDisplay;
    buttons: string[];
    isInDeck: boolean;
  }

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
    selectedBeastIndex: number | null; // Track selected beast for attacking
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

  export interface ObjectiveDisplay {
    description: string;
    progress: number;
    target: number;
    isComplete: boolean;
  }

  export interface RewardDisplay {
    xp: number;
    cards: CardDisplay[];
    message: string;
  }

  export type GameScreen = 'start-menu' | 'missions' | 'cards' | 'battle' | 'deck-builder' | 'settings' | 'card-detail' | 'mission-complete';

  /**
   * Main game manager class
   */
  export class GameManager {
    // Core systems
    private startMenuUI: StartMenuUI;
    private menuController: MenuController;
    private cardCollection: CardCollection;
    private cardsUI: CardsUI;
    private missionManager: MissionManager;
    private missionUI: MissionSelectionUI;
    private battleUI: MissionBattleUI;
    private gameEngine: GameEngine;
    private soundManager: SoundManager;

    // Manager instances
    private saveLoadManager: SaveLoadManager;
    private cardCollectionManager: CardCollectionManager;
    private battleDisplayManager: BattleDisplayManager;

    // Platform callbacks
    private platform: PlatformCallbacks;

    // Game state
    private currentScreen: GameScreen = 'start-menu';
    private playerData: PlayerData;
    private selectedDeck: DeckList | null = null;
    private currentBattleId: string | null = null;
    private playerDeck: string[] = []; // Track player's custom deck (card IDs)
    private selectedBeastIndex: number | null = null; // Track selected beast in battle
    private currentCardDetailId: string | null = null; // Track current card being viewed in detail
    private currentCardPopup: { card: any; player: 'player' | 'opponent'; showCloseButton?: boolean } | null = null; // Track active card popup

    constructor(platformCallbacks: PlatformCallbacks) {
      this.platform = platformCallbacks;

      // Initialize systems
      this.startMenuUI = new StartMenuUI();
      this.menuController = new MenuController();
      this.cardCollection = new CardCollection();
      this.cardsUI = new CardsUI();
      this.missionManager = new MissionManager();
      this.missionUI = new MissionSelectionUI(this.missionManager);
      this.gameEngine = new GameEngine();
      this.battleUI = new MissionBattleUI(this.missionManager, this.gameEngine);

      // Initialize managers
      this.saveLoadManager = new SaveLoadManager(this.platform);
      this.cardCollectionManager = new CardCollectionManager();
      this.battleDisplayManager = new BattleDisplayManager();

      // Initialize sound manager
      this.soundManager = new SoundManager({
        playMusic: (src, loop, volume) => this.platform.playMusic(src, loop, volume),
        stopMusic: () => this.platform.stopMusic(),
        playSfx: (src, volume) => this.platform.playSfx(src, volume),
        setMusicVolume: (volume) => this.platform.setMusicVolume(volume),
        setSfxVolume: (volume) => this.platform.setSfxVolume(volume),
      });

      // Set up SFX callback for cards screen (if platform supports it)
      if (this.platform.setCardsSfxCallback) {
        this.platform.setCardsSfxCallback((src: string) => this.soundManager.playSfx(src));
      }

      // Initialize player data with localState for Horizon UI
      this.playerData = {
        name: 'Player',
        level: 1,
        totalXP: 0,
        cards: {
          collected: [],
          deck: []
        },
        missions: {
          completedMissions: {}  // Track completed missions
        },
        items: [],  // Start with no items
        localState: {
          currentScreen: 'menu',
          volume: 80,
          sfxVolume: 80,
          cardsPageOffset: 0
        }
      } as any;

      // Setup input callbacks
      this.setupInputCallbacks();
    }

    /**
     * Initialize the game
     */
    async initialize(): Promise<void> {
      Logger.info('Initializing Bloom Beasts...');

      // Load saved data
      await this.loadGameData();

      // Initialize starting cards if first time
      if (this.playerData.cards.collected.length === 0) {
        await this.initializeStartingCollection();
      }

      // For Horizon: merge our game data with platform's playerData (which has localState)
      if (this.platform.setPlayerData && (this.playerData as any).localState) {
        // Only call setPlayerData if we have valid data with localState
        this.platform.setPlayerData(this.playerData);
      } else if (this.platform.getPlayerData) {
        // For Horizon: Get platform's playerData (which already has localState)
        // and merge our game data into it
        const platformData = this.platform.getPlayerData();
        if (platformData) {
          platformData.cards = this.playerData.cards;
          platformData.missions = this.playerData.missions;
          platformData.name = this.playerData.name;
          platformData.level = this.playerData.level;
          platformData.totalXP = this.playerData.totalXP;
          if ((this.playerData as any).items) {
            (platformData as any).items = (this.playerData as any).items;
          }
          this.playerData = platformData as any;
        }
      }

      // Show start menu
      await this.showStartMenu();
    }

    /**
     * Setup input callbacks from platform
     */
    private setupInputCallbacks(): void {
      // Button clicks
      this.platform.onButtonClick((buttonId: string) => {
        this.handleButtonClick(buttonId);
      });

      // Card selection
      this.platform.onCardSelect((cardId: string) => {
        this.handleCardSelect(cardId);
      });

      // Mission selection
      this.platform.onMissionSelect((missionId: string) => {
        this.handleMissionSelect(missionId);
      });

      // Settings changes
      this.platform.onSettingsChange((settingId: string, value: any) => {
        this.handleSettingsChange(settingId, value);
      });
    }

    /**
     * Handle button clicks
     */
    private async handleButtonClick(buttonId: string): Promise<void> {
      Logger.debug(`Button clicked: ${buttonId}`);

      // Determine if this button should play a sound
      const shouldPlaySound = this.shouldPlayButtonSound(buttonId);
      if (shouldPlaySound) {
        this.soundManager.playSfx('sfx/menuButtonSelect.wav');
      }

      switch (buttonId) {
        case 'btn-missions':
          await this.showMissionSelect();
          break;

        case 'btn-cards':
          await this.showCards();
          break;

        case 'btn-settings':
          await this.showSettings();
          break;

        case 'btn-back':
          await this.handleBackButton();
          break;

        case 'btn-start-battle':
          await this.startSelectedBattle();
          break;

        case 'btn-end-turn':
          await this.handleEndTurn();
          break;

        case 'btn-card-add':
          if (this.currentCardDetailId) {
            await this.addCardToDeck(this.currentCardDetailId);
          }
          break;

        case 'btn-card-remove':
          if (this.currentCardDetailId) {
            await this.removeCardFromDeck(this.currentCardDetailId);
          }
          break;

        case 'btn-card-close':
          // Close the card detail overlay based on current screen
          if (this.currentScreen === 'battle') {
            // Close card popup if one is open
            this.closeCardPopup();
          } else {
            // In cards screen, refresh to remove the overlay
            await this.showCards();
            this.currentCardDetailId = null;
          }
          break;

        default:
          // Handle counter info dialogs
          if (buttonId.startsWith('show-counter-info:')) {
            // Parse format: show-counter-info:title:message
            const parts = buttonId.substring('show-counter-info:'.length).split(':');
            if (parts.length >= 2) {
              const title = parts[0];
              const message = parts.slice(1).join(':'); // Rejoin in case message contains colons
              await this.platform.showDialog(title, message, ['OK']);
            }
          }
          // Handle deck selection buttons
          else if (buttonId.startsWith('deck-')) {
            this.selectDeck(buttonId.substring(5));
          }
          // Handle viewing hand cards in battle
          else if (buttonId.startsWith('view-hand-card-')) {
            const index = parseInt(buttonId.substring(15));
            await this.handleViewHandCard(index);
          }
          // Handle viewing field cards in battle
          else if (buttonId.startsWith('view-field-card-')) {
            const parts = buttonId.substring(16).split('-');
            const player = parts[0]; // 'player' or 'opponent'
            const index = parseInt(parts[1]);
            await this.handleViewFieldCard(player, index);
          }
          // Handle viewing trap cards in battle
          else if (buttonId.startsWith('view-trap-card-')) {
            const parts = buttonId.substring(15).split('-');
            const player = parts[0]; // 'player' or 'opponent'
            const index = parseInt(parts[1]);
            await this.handleViewTrapCard(player, index);
          }
          // Handle viewing habitat card in battle
          else if (buttonId === 'view-habitat-card') {
            await this.handleViewHabitatCard();
          }
          // Handle viewing buff cards in battle
          else if (buttonId.startsWith('view-buff-card-')) {
            const parts = buttonId.substring(15).split('-');
            const player = parts[0]; // 'player' or 'opponent'
            const index = parseInt(parts[1]);
            await this.handleViewBuffCard(player, index);
          }
          // Handle action buttons in battle
          else if (buttonId.startsWith('action-')) {
            await this.handleBattleAction(buttonId.substring(7));
          }
      }
    }

    /**
     * Determine if a button should play the menu button sound
     */
    private shouldPlayButtonSound(buttonId: string): boolean {
      // Don't play sound for battle card interactions
      if (buttonId.startsWith('view-hand-card-') ||
          buttonId.startsWith('view-field-card-') ||
          buttonId.startsWith('view-trap-card-') ||
          buttonId.startsWith('view-buff-card-') ||
          buttonId === 'view-habitat-card' ||
          buttonId.startsWith('action-')) {
        return false;
      }

      // Play sound for all other buttons (main menu, back, end turn, hand toggle, etc.)
      return true;
    }

    /**
     * Get the quantity of a specific item from player's items array
     */
    private getItemQuantity(itemId: string): number {
      return this.saveLoadManager.getItemQuantity(itemId);
    }

    /**
     * Calculate the current mission level based on completed missions
     * The current level is the highest completed mission level + 1
     * Returns 1 if no missions have been completed
     */
    private getCurrentMissionLevel(): number {
      let highestCompletedLevel = 0;

      // Check all completed missions to find the highest level
      for (const missionId in this.playerData.missions.completedMissions) {
        if (this.playerData.missions.completedMissions[missionId] > 0) {
          // Extract level from mission ID (e.g., "mission-05" -> 5)
          const match = missionId.match(/mission-(\d+)/);
          if (match) {
            const level = parseInt(match[1], 10);
            if (level > highestCompletedLevel) {
              highestCompletedLevel = level;
            }
          }
        }
      }

      // Current level is one higher than the highest completed
      return highestCompletedLevel + 1;
    }

    /**
     * Show the start menu
     */
    async showStartMenu(): Promise<void> {
      this.currentScreen = 'start-menu';

      const menuOptions = [
        'missions',
        'cards',
        'settings',
      ];

      const stats: MenuStats = {
        playerLevel: this.playerData.level,
        totalXP: this.playerData.totalXP,
        tokens: this.getItemQuantity('token'),
        diamonds: this.getItemQuantity('diamond'),
        serums: this.getItemQuantity('serum'),
      };

      this.platform.renderStartMenu(menuOptions, stats);
      // Start playing background music
      this.soundManager.playMusic('BackgroundMusic.mp3', true);
    }

    /**
     * Show mission selection screen
     */
    async showMissionSelect(): Promise<void> {
      this.currentScreen = 'missions';

      // Set player level for mission filtering
      this.missionUI.setPlayerLevel(this.playerData.level);

      // Get available missions
      const missionList = this.missionUI.getMissionList();

      // Convert to display format
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

      // Get stats for side menu
      const stats: MenuStats = {
        playerLevel: this.playerData.level,
        totalXP: this.playerData.totalXP,
        tokens: this.getItemQuantity('token'),
        diamonds: this.getItemQuantity('diamond'),
        serums: this.getItemQuantity('serum'),
      };

      this.platform.renderMissionSelect(displayMissions, stats);
      this.platform.loadBackground('mission-select-bg');
    }

    /**
     * Convert a CardInstance to CardDisplay format
     * This centralizes all the logic for enriching card instances with definition data
     */
    private cardInstanceToDisplay(card: CardInstance): CardDisplay {
      return this.cardCollectionManager.cardInstanceToDisplay(card);
    }

    /**
     * Show cards screen
     */
    async showCards(): Promise<void> {
      this.currentScreen = 'cards';

      // Get player's cards
      const cards = this.cardCollection.getAllCards();

      // Convert to display format using centralized helper
      const displayCards: CardDisplay[] = cards.map(card => this.cardInstanceToDisplay(card));

      // Get stats for side menu
      const stats: MenuStats = {
        playerLevel: this.playerData.level,
        totalXP: this.playerData.totalXP,
        tokens: this.getItemQuantity('token'),
        diamonds: this.getItemQuantity('diamond'),
        serums: this.getItemQuantity('serum'),
      };

      this.platform.renderCards(displayCards, this.playerDeck.length, this.playerDeck, stats);
      this.platform.loadBackground('cards-bg');
    }

    /**
     * Show deck builder screen
     */
    async showDeckBuilder(): Promise<void> {
      this.currentScreen = 'deck-builder';

      // Show available starter decks
      const deckOptions = [
        { id: 'fire', name: 'Fire Deck', description: 'Aggressive burn damage' },
        { id: 'water', name: 'Water Deck', description: 'Defensive and control' },
        { id: 'forest', name: 'Forest Deck', description: 'Growth and synergy' },
        { id: 'sky', name: 'Sky Deck', description: 'Speed and utility' },
      ];

      await this.platform.showDialog(
        'Select Your Deck',
        'Choose a starter deck for battle:',
        deckOptions.map(d => d.name)
      ).then(selection => {
        const deck = deckOptions.find(d => d.name === selection);
        if (deck) {
          this.selectDeck(deck.id);
        }
      });
    }

    /**
     * Show settings screen
     */
    async showSettings(): Promise<void> {
      this.currentScreen = 'settings';
      const settings = this.soundManager.getSettings();

      // Get stats for side menu
      const stats: MenuStats = {
        playerLevel: this.playerData.level,
        totalXP: this.playerData.totalXP,
        tokens: this.getItemQuantity('token'),
        diamonds: this.getItemQuantity('diamond'),
        serums: this.getItemQuantity('serum'),
      };

      this.platform.renderSettings(settings, stats);
    }

    /**
     * Handle settings changes
     */
    private handleSettingsChange(settingId: string, value: any): void {
      // Play menu button sound for settings toggles (but not for sliders)
      if (settingId === 'music-enabled' || settingId === 'sfx-enabled') {
        this.soundManager.playSfx('sfx/menuButtonSelect.wav');
      }

      switch (settingId) {
        case 'music-volume':
          this.soundManager.setMusicVolume(value);
          break;
        case 'sfx-volume':
          this.soundManager.setSfxVolume(value);
          break;
        case 'music-enabled':
          this.soundManager.toggleMusic(value);
          break;
        case 'sfx-enabled':
          this.soundManager.toggleSfx(value);
          break;
      }
      // Save settings
      this.saveGameData();
      // Re-render settings screen to update UI
      this.showSettings();
    }

    /**
     * Get player's deck cards for battle
     */
    private getPlayerDeckCards(): AnyCard[] {
      return this.cardCollectionManager.getPlayerDeckCards(
        this.playerDeck,
        this.cardCollection
      );
    }

    /**
     * Handle mission selection
     */
    private async handleMissionSelect(missionId: string): Promise<void> {
      Logger.info(`Mission selected: ${missionId}`);

      // Play menu button sound
      this.soundManager.playSfx('sfx/menuButtonSelect.wav');

      // Check if player has a deck with at least some cards
      if (this.playerDeck.length === 0) {
        await this.platform.showDialog(
          'No Cards in Deck',
          'You need to add cards to your deck before starting a mission.',
          ['OK']
        );
        await this.showCards();
        return;
      }

      // Get player's deck cards
      const playerDeckCards = this.getPlayerDeckCards();

      if (playerDeckCards.length === 0) {
        await this.platform.showDialog(
          'Deck Error',
          'Failed to load your deck cards. Please check your cards.',
          ['OK']
        );
        return;
      }

      // Start the mission
      const success = this.missionUI.startMission(missionId);

      if (success) {
        // Initialize battle with player's deck cards
        const battleState = this.battleUI.initializeBattle(playerDeckCards);

        if (battleState) {
          // Set up render callback for opponent AI actions
          this.battleUI.setRenderCallback(() => {
            // Only update if we're still in battle screen
            if (this.currentScreen === 'battle') {
              this.updateBattleDisplay();
            }
          });

          // Set up action callback for opponent sound effects and animations
          this.battleUI.setOpponentActionCallback(async (action: string) => {
            if (action.startsWith('attack-beast-opponent-')) {
              // Parse: attack-beast-opponent-{attackerIndex}-player-{targetIndex}
              const parts = action.substring('attack-beast-opponent-'.length).split('-player-');
              const attackerIndex = parseInt(parts[0], 10);
              const targetIndex = parseInt(parts[1], 10);

              // Play sound
              this.soundManager.playSfx('sfx/attack.wav');

              // Play animation
              await this.playAttackAnimation('opponent', attackerIndex, 'player', targetIndex);
            } else if (action.startsWith('attack-player-opponent-')) {
              // Parse: attack-player-opponent-{attackerIndex}
              const attackerIndex = parseInt(action.substring('attack-player-opponent-'.length), 10);

              // Play sound
              this.soundManager.playSfx('sfx/attack.wav');

              // Play animation (opponent attacks player health)
              await this.playAttackAnimation('opponent', attackerIndex, 'health', undefined);
            } else if (action.startsWith('play-magic-card:')) {
              // Parse: play-magic-card:{cardJSON}
              const cardJSON = action.substring('play-magic-card:'.length);
              try {
                const card = JSON.parse(cardJSON);
                this.soundManager.playSfx('sfx/playCard.wav');
                await this.showCardPopup(card, 'opponent');
              } catch (error) {
                Logger.error('Failed to parse magic card JSON:', error);
              }
            } else if (action.startsWith('play-trap-card:')) {
              // Trap cards are face-down, so don't show popup when opponent plays them
              // Just play the sound effect
              this.soundManager.playSfx('sfx/playCard.wav');
            } else if (action.startsWith('play-habitat-card:')) {
              // Parse: play-habitat-card:{cardJSON}
              const cardJSON = action.substring('play-habitat-card:'.length);
              try {
                const card = JSON.parse(cardJSON);
                this.soundManager.playSfx('sfx/playCard.wav');
                await this.showCardPopup(card, 'opponent');
              } catch (error) {
                Logger.error('Failed to parse habitat card JSON:', error);
              }
            } else if (action === 'play-card') {
              this.soundManager.playSfx('sfx/playCard.wav');
            } else if (action === 'player-low-health') {
              this.soundManager.playSfx('sfx/lowHealthSound.wav');
            } else if (action === 'trap-activated') {
              this.soundManager.playSfx('sfx/trapCardActivated.wav');
            }
          });

          this.currentScreen = 'battle';
          this.currentBattleId = missionId;
          // Play battle music
          this.soundManager.playMusic('BattleMusic.mp3', true);
          await this.updateBattleDisplay();
          this.platform.playSound('battle-start');
        }
      } else {
        await this.platform.showDialog(
          'Mission Unavailable',
          'This mission is not available yet.',
          ['OK']
        );
      }
    }

    /**
     * Handle card selection in cards screen
     */
    private async handleCardSelect(cardId: string): Promise<void> {
      // Play menu button sound
      this.soundManager.playSfx('sfx/menuButtonSelect.wav');

      const cardEntry = this.cardCollection.getCard(cardId);

      if (cardEntry) {
        // Convert to CardDisplay format
        const cardDisplay = this.cardInstanceToDisplay(cardEntry);

        // Check if card is in deck
        const isInDeck = this.playerDeck.includes(cardId);
        const buttons = isInDeck ? ['Remove', 'Close'] : ['Add', 'Close'];

        // Create CardDetailDisplay object
        const cardDetailDisplay: CardDetailDisplay = {
          card: cardDisplay,
          buttons: buttons,
          isInDeck: isInDeck,
        };

        // Get current stats
        const stats: MenuStats = {
          playerLevel: this.playerData.level,
          totalXP: this.playerData.totalXP,
          tokens: this.getItemQuantity('token'),
          diamonds: this.getItemQuantity('diamond'),
          serums: this.getItemQuantity('serum'),
        };

        // Store the current card ID for button handling
        this.currentCardDetailId = cardId;

        // Render card detail view (as overlay on top of current screen)
        this.platform.renderCardDetail(cardDetailDisplay, stats);
      }
    }

    /**
     * Add card to player's deck
     */
    private async addCardToDeck(cardId: string): Promise<void> {
      if (this.playerDeck.length >= DECK_SIZE) {
        await this.platform.showDialog('Deck Full', `Your deck already has ${DECK_SIZE} cards. Remove a card first.`, ['OK']);
        return;
      }

      if (!this.playerDeck.includes(cardId)) {
        this.playerDeck.push(cardId);
        await this.saveGameData();

        // If we're in card detail screen, refresh that view
        if (this.currentScreen === 'card-detail') {
          await this.handleCardSelect(cardId);
        } else {
          // Otherwise refresh cards screen
          await this.showCards();
        }
      }
    }

    /**
     * Remove card from player's deck
     */
    private async removeCardFromDeck(cardId: string): Promise<void> {
      const index = this.playerDeck.indexOf(cardId);
      if (index > -1) {
        this.playerDeck.splice(index, 1);
        await this.saveGameData();

        // If we're in card detail screen, refresh that view
        if (this.currentScreen === 'card-detail') {
          await this.handleCardSelect(cardId);
        } else {
          // Otherwise refresh cards screen
          await this.showCards();
        }
      }
    }

    /**
     * Select a deck for battle
     */
    private selectDeck(deckId: string): void {
      switch (deckId) {
        case 'fire':
          this.selectedDeck = buildFireDeck();
          break;
        case 'water':
          this.selectedDeck = buildWaterDeck();
          break;
        case 'forest':
          this.selectedDeck = buildForestDeck();
          break;
        case 'sky':
          this.selectedDeck = buildSkyDeck();
          break;
      }

      if (this.selectedDeck) {
        this.platform.showDialog(
          'Deck Selected',
          `You have selected the ${deckId} deck.`,
          ['OK']
        );
      }
    }

    /**
     * Start the selected battle
     */
    private async startSelectedBattle(): Promise<void> {
      if (!this.currentBattleId || !this.selectedDeck) {
        return;
      }

      // Battle is already initialized, just update display
      await this.updateBattleDisplay();
    }

    /**
     * Update battle display
     */
    private async updateBattleDisplay(attackAnimation?: {
      attackerPlayer: 'player' | 'opponent';
      attackerIndex: number;
      targetPlayer: 'player' | 'opponent' | 'health';
      targetIndex?: number;
    } | null): Promise<void> {
      const battleState = this.battleUI.getCurrentBattle();

      // Check if battle ended FIRST - never render after completion
      if (battleState && battleState.isComplete && !attackAnimation) {
        await this.handleBattleComplete(battleState);
        return;
      }

      const display = this.battleDisplayManager.createBattleDisplay(
        battleState,
        this.selectedBeastIndex,
        attackAnimation
      );

      if (!display) return;

      // Add current popup if one is active (preserves popup during timer refreshes)
      if (this.currentCardPopup) {
        display.cardPopup = this.currentCardPopup;
      }

      this.platform.renderBattle(display);
    }

    /**
     * Handle viewing a card in player's hand
     */
    private async handleViewHandCard(index: number): Promise<void> {
      const battleState = this.battleUI.getCurrentBattle();
      if (!battleState || !battleState.gameState) return;

      const player = battleState.gameState.players[0];
      const card = player.hand[index];

      // Debug: Check hand card data
      Logger.debug('Hand card:', card);

      if (!card) return;

      // Check if card is affordable
      const canAfford = card.cost <= player.currentNectar;

      if (canAfford) {
        // Play the card directly if affordable
        await this.handleBattleAction(`play-card-${index}`);
      }
      // If can't afford, simply ignore the click (no dialog)
    }

    /**
     * Handle viewing a card on the battle field
     */
    private async handleViewFieldCard(player: string, index: number): Promise<void> {
      const battleState = this.battleUI.getCurrentBattle();
      if (!battleState || !battleState.gameState) return;

      const playerObj = player === 'player' ? battleState.gameState.players[0] : battleState.gameState.players[1];
      const beast = playerObj.field[index];

      if (!beast) return;

      if (player === 'player') {
        // Player's own beast - directly select for attacking if it's player's turn and no summoning sickness
        const isPlayerTurn = battleState.gameState.activePlayer === 0;

        if (isPlayerTurn && !beast.summoningSickness) {
          // Select this beast for attacking
          this.selectedBeastIndex = index;
          await this.updateBattleDisplay(); // Refresh to show selection
        }
        // If can't select (not player's turn or has summoning sickness), ignore the click
      } else {
        // Opponent's beast - if we have a selected beast, attack directly
        if (this.selectedBeastIndex !== null) {
          await this.handleBattleAction(`attack-beast-${this.selectedBeastIndex}-${index}`);
          this.selectedBeastIndex = null; // Clear selection after attack
        }
        // If no selected beast, ignore the click
      }
    }

    /**
     * Handle viewing a trap card in the trap zone
     */
    private async handleViewTrapCard(player: string, index: number): Promise<void> {
      const battleState = this.battleUI.getCurrentBattle();
      if (!battleState || !battleState.gameState) return;

      // Only show trap cards for the player, not the opponent (traps are face-down)
      if (player !== 'player') {
        return; // Ignore clicks on opponent's trap cards
      }

      const playerObj = battleState.gameState.players[0];
      const trapZone = playerObj.trapZone || [];

      // Check if trap exists at this index
      if (index < 0 || index >= trapZone.length || !trapZone[index]) {
        return;
      }

      const trapCard: any = trapZone[index];

      // Get the full card definition to include effects and activation
      const allCardDefs = getAllCards();
      const cardDef = allCardDefs.find((c: any) => c && c.id === trapCard.id);

      // Merge the trap card with its definition to ensure all fields are present
      const fullCard = {
        ...trapCard,
        ...(cardDef || {}),
      };

      // Show popup that stays open until user clicks elsewhere
      await this.showCardPopup(fullCard, 'player', false);
    }

    /**
     * Handle viewing the habitat card in the habitat zone
     */
    private async handleViewHabitatCard(): Promise<void> {
      const battleState = this.battleUI.getCurrentBattle();
      if (!battleState || !battleState.gameState) return;

      const habitatCard = battleState.gameState.habitatZone;

      if (!habitatCard) {
        return; // No habitat card currently played
      }

      // Get the full card definition to include effects
      const allCardDefs = getAllCards();
      const cardDef = allCardDefs.find((c: any) => c && c.id === habitatCard.id);

      // Merge the habitat card with its definition to ensure all fields are present
      const fullCard = {
        ...habitatCard,
        ...(cardDef || {}),
      };

      // Show popup that stays open until user clicks elsewhere
      await this.showCardPopup(fullCard, 'player', false);
    }

    /**
     * Handle viewing a buff card in the buff zone
     */
    private async handleViewBuffCard(player: string, index: number): Promise<void> {
      const battleState = this.battleUI.getCurrentBattle();
      if (!battleState || !battleState.gameState) return;

      const playerObj = player === 'player' ? battleState.gameState.players[0] : battleState.gameState.players[1];
      const buffZone = playerObj.buffZone || [];

      // Check if buff exists at this index
      if (index < 0 || index >= buffZone.length || !buffZone[index]) {
        return;
      }

      const buffCard: any = buffZone[index];

      // Get the full card definition to include ongoingEffects
      const allCardDefs = getAllCards();
      const cardDef = allCardDefs.find((c: any) => c && c.id === buffCard.id);

      // Merge the buff card with its definition to ensure all fields are present
      const fullCard = {
        ...buffCard,
        ...(cardDef || {}),
      };

      // Show popup that stays open until user clicks elsewhere
      await this.showCardPopup(fullCard, player as 'player' | 'opponent', false);
    }

    /**
     * Handle battle actions
     */
    private async handleBattleAction(action: string): Promise<void> {
      // Handle attack actions with animation
      if (action.startsWith('attack-')) {
        this.soundManager.playSfx('sfx/attack.wav');

        // Parse attack action to get attacker and target info
        let attackerPlayer: 'player' | 'opponent' = 'player';
        let attackerIndex: number = 0;
        let targetPlayer: 'player' | 'opponent' | 'health' = 'opponent';
        let targetIndex: number | undefined = undefined;

        if (action.startsWith('attack-beast-')) {
          // Format: attack-beast-{attackerIndex}-{targetIndex}
          const parts = action.substring('attack-beast-'.length).split('-');
          attackerIndex = parseInt(parts[0], 10);
          targetIndex = parseInt(parts[1], 10);
          targetPlayer = 'opponent';
        } else if (action.startsWith('attack-player-')) {
          // Format: attack-player-{attackerIndex}
          attackerIndex = parseInt(action.substring('attack-player-'.length), 10);
          targetPlayer = 'health';
          targetIndex = undefined;
        }

        // Run attack animation
        await this.playAttackAnimation(attackerPlayer, attackerIndex, targetPlayer, targetIndex);

        // Clear selection
        this.selectedBeastIndex = null;

        // Process action through battle UI
        await this.battleUI.processPlayerAction(action, {});
      }
      // Play card sound when playing a card
      else if (action.startsWith('play-card-')) {
        this.soundManager.playSfx('sfx/playCard.wav');

        // Get the card being played
        const cardIndex = parseInt(action.substring('play-card-'.length), 10);
        const battleState = this.battleUI.getCurrentBattle();

        if (battleState && battleState.gameState) {
          const player = battleState.gameState.players[0];
          const card = player.hand[cardIndex];

          // Check if it's a Magic, Trap, or Habitat card
          if (card && (card.type === 'Magic' || card.type === 'Trap' || card.type === 'Habitat')) {
            // Show popup for magic/trap/habitat cards
            await this.showCardPopup(card, 'player');
          }
        }

        // Process action through battle UI
        await this.battleUI.processPlayerAction(action, {});
      }
      // Other actions
      else {
        // Process action through battle UI
        await this.battleUI.processPlayerAction(action, {});
      }

      // Update display (without animation)
      await this.updateBattleDisplay();
    }

    /**
     * Play attack animation showing attacker blinking green and target blinking red
     */
    private async playAttackAnimation(
      attackerPlayer: 'player' | 'opponent',
      attackerIndex: number,
      targetPlayer: 'player' | 'opponent' | 'health',
      targetIndex?: number
    ): Promise<void> {
      const animationState = {
        attackerPlayer,
        attackerIndex,
        targetPlayer,
        targetIndex,
      };

      // Blink 3 times (on/off/on/off/on/off)
      const blinkCount = 3;
      const blinkDuration = 150; // 150ms per blink

      for (let i = 0; i < blinkCount * 2; i++) {
        // Show animation on even iterations (0, 2, 4)
        const showAnimation = i % 2 === 0;

        if (showAnimation) {
          await this.updateBattleDisplay(animationState);
        } else {
          await this.updateBattleDisplay(null);
        }

        // Wait for blink duration
        await new Promise(resolve => setTimeout(resolve, blinkDuration));
      }
    }

    /**
     * Show a card popup for magic/trap/habitat/buff cards
     * @param card - The card to display
     * @param player - Which player's side to show the popup on
     * @param autoDismiss - If true, auto-close after 2 seconds. If false, stay open until manually closed.
     */
    private async showCardPopup(card: any, player: 'player' | 'opponent', autoDismiss: boolean = true): Promise<void> {
      const battleState = this.battleUI.getCurrentBattle();
      if (!battleState || !battleState.gameState) return;

      // Store the popup state (this will be picked up by updateBattleDisplay)
      this.currentCardPopup = {
        card,
        player,
        showCloseButton: !autoDismiss, // Show close button for manual popups
      };

      // Render with popup
      await this.updateBattleDisplay();

      // Only auto-dismiss if requested (for when cards are played)
      if (autoDismiss) {
        // Wait 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Clear popup state (only if it hasn't been changed)
        if (this.currentCardPopup?.card === card) {
          this.currentCardPopup = null;
          // Re-render without popup
          await this.updateBattleDisplay();
        }
      }
      // If not auto-dismiss, popup stays open until manually closed by user action
    }

    /**
     * Close the current card popup (for manual popups)
     */
    private closeCardPopup(): void {
      if (this.currentCardPopup) {
        this.currentCardPopup = null;
        this.updateBattleDisplay();
      }
    }

    /**
     * Handle end turn
     */
    private async handleEndTurn(): Promise<void> {
      // Clear beast selection when ending turn
      this.selectedBeastIndex = null;

      await this.battleUI.processPlayerAction('end-turn', {});
      await this.updateBattleDisplay();
    }

    /**
     * Award experience to all cards in the player's deck after battle victory
     * Card XP is distributed evenly across all cards in the deck
     */
    private awardDeckExperience(totalCardXP: number): void {
      this.cardCollectionManager.awardDeckExperience(
        totalCardXP,
        this.playerDeck,
        this.cardCollection
      );
    }

    /**
     * Handle battle completion
     */
    private async handleBattleComplete(battleState: any): Promise<void> {
      // STOP EVERYTHING IMMEDIATELY
      // 1. Stop the platform's turn timer (visual countdown)
      if ((this.platform as any).battleScreen) {
        (this.platform as any).battleScreen.stopTurnTimer();
      }

      // 2. Clear the battle logic (stops AI, clears callbacks)
      this.battleUI.clearBattle();
      this.currentBattleId = null;
      this.selectedBeastIndex = null;
      this.currentCardPopup = null; // Clear any active popup

      if (battleState.rewards) {
        // Get the mission object
        const mission = battleState.mission || this.missionManager.getCurrentMission();

        // Check if platform has new showMissionComplete method
        if (mission && (this.platform as any).showMissionComplete) {
          // Change screen state
          this.currentScreen = 'mission-complete';

          // Use new popup system - show popup first, then apply rewards after user claims
          await (this.platform as any).showMissionComplete(mission, battleState.rewards);

          // Now apply rewards (after user has clicked through popup)
          this.saveLoadManager.addXP(battleState.rewards.xpGained);

          // Award card XP
          const cardXP = battleState.rewards.beastXP || battleState.rewards.xpGained;
          this.awardDeckExperience(cardXP);

          // Add cards to collection
          battleState.rewards.cardsReceived.forEach((card: any, index: number) => {
            this.cardCollectionManager.addCardReward(card, this.cardCollection, index);
          });

          // Add items to inventory
          if (battleState.rewards.itemsReceived) {
            battleState.rewards.itemsReceived.forEach((itemReward: any) => {
              this.saveLoadManager.addItems(itemReward.itemId, itemReward.quantity);
            });
          }

          // Track mission completion
          if (this.currentBattleId) {
            this.saveLoadManager.trackMissionCompletion(this.currentBattleId);
          }

          // Play win sound
          this.soundManager.playSfx('sfx/win.wav');

          // Save game data
          await this.saveGameData();
        } else {
          // Fallback to old dialog system
          this.saveLoadManager.addXP(battleState.rewards.xpGained);
          const cardXP = battleState.rewards.cardXPGained || (battleState.rewards.xpGained / 2);
          this.awardDeckExperience(cardXP);

          battleState.rewards.cardsReceived.forEach((card: any, index: number) => {
            this.cardCollectionManager.addCardReward(card, this.cardCollection, index);
          });

          if (this.currentBattleId) {
            this.saveLoadManager.trackMissionCompletion(this.currentBattleId);
          }

          const rewardDisplay: RewardDisplay = {
            xp: battleState.rewards.xpGained,
            cards: battleState.rewards.cardsReceived.map((card: any) => ({
              id: card.id,
              name: card.name,
              type: card.type,
              affinity: card.affinity,
              level: 1,
              experience: 0,
              count: 1,
            })),
            message: 'Mission Complete!',
          };

          await this.platform.showRewards(rewardDisplay);
          this.soundManager.playSfx('sfx/win.wav');
          await this.saveGameData();
        }
      } else {
        // Mission failed
        this.soundManager.playSfx('sfx/lose.wav');

        // Get the mission object
        const mission = battleState.mission || this.missionManager.getCurrentMission();

        // Check if platform has new showMissionComplete method
        if (mission && (this.platform as any).showMissionComplete) {
          // Change screen state
          this.currentScreen = 'mission-complete';

          // Show mission failed popup with null rewards (triggers fail state)
          await (this.platform as any).showMissionComplete(mission, null);
        } else {
          // Fallback to old dialog system
          await this.platform.showDialog(
            'Mission Failed',
            'Better luck next time!',
            ['OK']
          );
        }
      }

      // Resume background music
      this.soundManager.playMusic('BackgroundMusic.mp3', true);

      // Return to mission select
      await this.showMissionSelect();
    }

    /**
     * Handle back button
     */
    private async handleBackButton(): Promise<void> {
      switch (this.currentScreen) {
        case 'missions':
        case 'cards':
        case 'deck-builder':
        case 'settings':
          await this.showStartMenu();
          break;

        case 'card-detail':
          // Go back to cards screen
          await this.showCards();
          this.currentCardDetailId = null;
          break;

        case 'battle':
          // Confirm before leaving battle
          const result = await this.platform.showDialog(
            'Leave Battle?',
            'Are you sure you want to leave the battle?',
            ['Yes', 'No']
          );

          if (result === 'Yes') {
            this.battleUI.clearBattle();
            this.currentBattleId = null;
            this.selectedBeastIndex = null; // Clear selection
            this.currentCardPopup = null; // Clear any active popup
            // Play lose sound for forfeit
            this.soundManager.playSfx('sfx/lose.wav');
            // Resume background music
            this.soundManager.playMusic('BackgroundMusic.mp3', true);
            await this.showMissionSelect();
          }
          break;
      }
    }

    /**
     * Initialize starting collection
     */
    private async initializeStartingCollection(): Promise<void> {
      this.playerDeck = await this.cardCollectionManager.initializeStartingCollection(
        this.cardCollection,
        this.playerDeck
      );

      // Update cards in player data
      this.playerData.cards.collected = this.cardCollection.getAllCards();
      this.playerData.cards.deck = this.playerDeck;

      await this.saveGameData();
    }

    /**
     * Save game data
     */
    private async saveGameData(): Promise<void> {
      await this.saveLoadManager.saveGameData(this.cardCollection, this.playerDeck);
    }

    /**
     * Load game data
     */
    private async loadGameData(): Promise<void> {
      this.playerDeck = await this.saveLoadManager.loadGameData(
        this.cardCollection,
        this.missionManager
      );
      // Get the loaded player data reference
      this.playerData = this.saveLoadManager.getPlayerData();
    }

    /**
     * Update player level based on XP
     * Player leveling uses steep exponential scaling
     * Formula: XP = 100 * (2.0 ^ (level - 1))
     */
    private updatePlayerLevel(): void {
      this.saveLoadManager.updatePlayerLevel();
    }

    /**
     * Get player info for UI display (name, level, XP progress)
     * Returns current XP within level and XP required for next level
     */
    getPlayerInfo(): { name: string; level: number; currentXP: number; xpForNextLevel: number } {
      // Same thresholds as updatePlayerLevel
      const xpThresholds = [
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

      const currentLevel = this.playerData.level;
      const totalXP = this.playerData.totalXP;

      // Calculate XP within current level
      const xpForCurrentLevel = xpThresholds[currentLevel - 1];
      const xpForNextLevel = currentLevel < 9 ? xpThresholds[currentLevel] : xpThresholds[8];
      const currentXP = totalXP - xpForCurrentLevel;
      const xpNeeded = xpForNextLevel - xpForCurrentLevel;

      return {
        name: this.playerData.name,
        level: currentLevel,
        currentXP: currentXP,
        xpForNextLevel: xpNeeded,
      };
    }
  }

  /**
   * Player item instance
   */
  export interface PlayerItem {
    itemId: string;  // Reference to the item definition ID
    quantity: number;  // How many of this item the player has
  }

  /**
   * Player data interface
   */
  export interface PlayerData {
    name: string;
    level: number;
    totalXP: number;
    cards: {
      collected: any[];  // All cards the player has collected
      deck: string[];    // Card IDs in the player's deck
    };
    missions: {
      completedMissions: { [missionId: string]: number };  // Track how many times each mission has been completed
    };
    items: PlayerItem[];  // All items the player has collected
  }

  // ==================== shared\styles\colors.ts ====================

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

    // Card/Panel colors
    cardBackground: '#2c3e50',
    panelBackground: '#1a1a1a',
    overlayBackground: 'rgba(0, 0, 0, 0.8)',
    overlayBackgroundDark: 'rgba(0, 0, 0, 0.9)',

    // Borders
    borderPrimary: '#00d9ff',
    borderSuccess: '#27ae60',
    borderDefault: '#3498db',

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

  /**
   * Helper function to get affinity color
   */
  export function getAffinityColor(affinity?: string): string {
    switch (affinity) {
      case 'Fire':
        return COLORS.affinity.fire;
      case 'Water':
        return COLORS.affinity.water;
      case 'Forest':
        return COLORS.affinity.forest;
      case 'Sky':
        return COLORS.affinity.sky;
      default:
        return COLORS.affinity.neutral;
    }
  }

  /**
   * Helper function to get rarity color
   */
  export function getRarityColor(rarity?: string): string {
    switch (rarity?.toLowerCase()) {
      case 'common':
        return COLORS.rarity.common;
      case 'uncommon':
        return COLORS.rarity.uncommon;
      case 'rare':
        return COLORS.rarity.rare;
      case 'epic':
        return COLORS.rarity.epic;
      case 'legendary':
        return COLORS.rarity.legendary;
      default:
        return COLORS.rarity.common;
    }
  }

  // ==================== shared\styles\dimensions.ts ====================

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

  // ==================== shared\styles\layouts.ts ====================

  /**
   * Shared layout definitions for BloomBeasts
   * These layouts can be applied to both Web and Horizon platforms
   */


  /**
   * Base layout style type (compatible with both platforms)
   */
  export type LayoutStyle = {
    flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
    alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
    padding?: number;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
    margin?: number;
    marginTop?: number;
    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
    gap?: number;
    flex?: number;
    width?: number | string;
    height?: number | string;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    position?: 'relative' | 'absolute';
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
  };

  /**
   * Screen layouts
   */
  export const LAYOUTS = {
    // Root panel layout
    root: {
      width: DIMENSIONS.panel.width,
      height: DIMENSIONS.panel.height,
      flexDirection: 'column' as const,
    },

    // Start menu screen
    startMenu: {
      flex: 1,
      flexDirection: 'column' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      padding: DIMENSIONS.spacing.xxl,
    },

    startMenuButtons: {
      flexDirection: 'column' as const,
      gap: GAPS.buttons,
    },

    startMenuStats: {
      flexDirection: 'row' as const,
      gap: GAPS.stats,
      marginBottom: DIMENSIONS.spacing.xxl,
    },

    // Mission select screen
    missionSelectContainer: {
      flex: 1,
      flexDirection: 'column' as const,
      padding: DIMENSIONS.spacing.lg,
    },

    missionSelectHeader: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      marginBottom: DIMENSIONS.spacing.lg,
    },

    missionList: {
      flex: 1,
    },

    missionListContent: {
      flexDirection: 'column' as const,
      gap: GAPS.missions,
    },

    // Cards screen
    cardsContainer: {
      flex: 1,
      flexDirection: 'column' as const,
      padding: DIMENSIONS.spacing.lg,
    },

    cardsHeader: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      marginBottom: DIMENSIONS.spacing.lg,
    },

    cardsHeaderRight: {
      flexDirection: 'row' as const,
      gap: GAPS.buttons,
    },

    cardsGrid: {
      flex: 1,
    },

    cardsGridContent: {
      flexDirection: 'row' as const,
      flexWrap: 'wrap' as const,
      gap: GAPS.cards,
    },

    // Battle screen
    battleContainer: {
      flex: 1,
      flexDirection: 'column' as const,
    },

    // Settings screen
    settingsContainer: {
      flex: 1,
      flexDirection: 'column' as const,
      padding: DIMENSIONS.spacing.lg,
    },

    // Dialog/Modal overlay
    dialogOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: DIMENSIONS.panel.width,
      height: DIMENSIONS.panel.height,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },

    dialogContent: {
      minWidth: DIMENSIONS.dialog.minWidth,
      maxWidth: DIMENSIONS.dialog.maxWidth,
      padding: DIMENSIONS.dialog.padding,
      borderRadius: DIMENSIONS.dialog.borderRadius,
    },

    dialogButtons: {
      flexDirection: 'row' as const,
      gap: GAPS.buttons,
      justifyContent: 'center' as const,
    },

    // Card detail overlay
    cardDetailOverlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: DIMENSIONS.panel.width,
      height: DIMENSIONS.panel.height,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
    },
  } as const;

  // ==================== shared\ui\types.ts ====================

  /**
   * Shared UI component type definitions for BloomBeasts
   * These types define the structure of UI components in a platform-agnostic way
   */

  /**
   * Base style properties that work across platforms
   */
  export type BaseStyle = {
    backgroundColor?: string;
    color?: string;
    padding?: number;
    margin?: number;
    borderRadius?: number;
    borderWidth?: number;
    borderColor?: string;
    width?: number | string;
    height?: number | string;
    fontSize?: number;
    fontWeight?: 'normal' | 'bold';
    textAlign?: 'left' | 'center' | 'right';
    opacity?: number;
  };

  /**
   * Button component definition
   */
  export type ButtonDef = {
    id: string;
    label: string;
    style?: BaseStyle;
    disabled?: boolean;
    variant?: 'primary' | 'danger' | 'success' | 'secondary' | 'disabled';
  };

  /**
   * Text component definition
   */
  export type TextDef = {
    text: string;
    style?: BaseStyle;
    numberOfLines?: number;
  };

  /**
   * Stat badge component definition
   */
  export type StatBadgeDef = {
    label: string;
    value: string | number;
    style?: BaseStyle;
  };

  /**
   * Mission card component definition
   */
  export type MissionCardDef = {
    id: string;
    name: string;
    level: number;
    difficulty: string;
    isAvailable: boolean;
    isCompleted: boolean;
    style?: BaseStyle;
  };

  /**
   * Card thumbnail component definition
   */
  export type CardThumbnailDef = {
    id: string;
    name: string;
    affinity?: string;
    rarity?: string;
    baseAttack?: number;
    baseHealth?: number;
    isInDeck?: boolean;
    count?: number;
    style?: BaseStyle;
  };

  /**
   * Dialog component definition
   */
  export type DialogDef = {
    title: string;
    message: string;
    buttons: string[];
    style?: BaseStyle;
  };

  /**
   * Container/View component definition
   */
  export type ViewDef = {
    style?: BaseStyle & {
      flexDirection?: 'row' | 'column';
      justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
      alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch';
      gap?: number;
    };
    children?: any[]; // Platform-specific children
  };

  /**
   * Image component definition
   */
  export type ImageDef = {
    source: string | null;
    width?: number;
    height?: number;
    style?: BaseStyle;
  };

  // ==================== shared\ui\presets.ts ====================

  /**
   * Shared UI component presets for BloomBeasts
   * Predefined component configurations for consistency
   */


  /**
   * Button style presets
   */
  export const BUTTON_STYLES = {
    primary: {
      backgroundColor: COLORS.buttonPrimary,
      color: COLORS.textPrimary,
      padding: DIMENSIONS.button.padding,
      borderRadius: DIMENSIONS.button.borderRadius,
      fontSize: DIMENSIONS.fontSize.xl,
      fontWeight: 'bold' as const,
    },

    danger: {
      backgroundColor: COLORS.buttonDanger,
      color: COLORS.textPrimary,
      padding: DIMENSIONS.buttonSmall.padding,
      borderRadius: DIMENSIONS.buttonSmall.borderRadius,
      fontSize: DIMENSIONS.fontSize.md,
      fontWeight: 'bold' as const,
    },

    success: {
      backgroundColor: COLORS.buttonSuccess,
      color: COLORS.textPrimary,
      padding: DIMENSIONS.button.padding,
      borderRadius: DIMENSIONS.button.borderRadius,
      fontSize: DIMENSIONS.fontSize.xl,
      fontWeight: 'bold' as const,
    },

    secondary: {
      backgroundColor: COLORS.cardBackground,
      color: COLORS.textPrimary,
      padding: DIMENSIONS.button.padding,
      borderRadius: DIMENSIONS.button.borderRadius,
      fontSize: DIMENSIONS.fontSize.xl,
      fontWeight: 'bold' as const,
    },

    disabled: {
      backgroundColor: COLORS.buttonDisabled,
      color: COLORS.textSecondary,
      padding: DIMENSIONS.button.padding,
      borderRadius: DIMENSIONS.button.borderRadius,
      fontSize: DIMENSIONS.fontSize.xl,
      fontWeight: 'bold' as const,
    },
  } as const;

  /**
   * Text style presets
   */
  export const TEXT_STYLES = {
    title: {
      fontSize: DIMENSIONS.fontSize.title,
      fontWeight: 'bold' as const,
      color: COLORS.primary,
    },

    hero: {
      fontSize: DIMENSIONS.fontSize.hero,
      fontWeight: 'bold' as const,
      color: COLORS.primary,
    },

    body: {
      fontSize: DIMENSIONS.fontSize.md,
      color: COLORS.textPrimary,
    },

    bodySecondary: {
      fontSize: DIMENSIONS.fontSize.sm,
      color: COLORS.textSecondary,
    },

    label: {
      fontSize: DIMENSIONS.fontSize.sm,
      color: COLORS.textSecondary,
    },

    value: {
      fontSize: DIMENSIONS.fontSize.lg,
      fontWeight: 'bold' as const,
      color: COLORS.textPrimary,
    },
  } as const;

  /**
   * Card style presets
   */
  export const CARD_STYLES = {
    base: {
      width: DIMENSIONS.card.width,
      height: DIMENSIONS.card.height,
      backgroundColor: COLORS.cardBackground,
      borderRadius: DIMENSIONS.card.borderRadius,
      borderWidth: DIMENSIONS.card.borderWidth,
      padding: DIMENSIONS.card.padding,
    },

    mission: {
      backgroundColor: COLORS.cardBackground,
      padding: DIMENSIONS.missionCard.padding,
      borderRadius: DIMENSIONS.missionCard.borderRadius,
      borderWidth: DIMENSIONS.missionCard.borderWidth,
      borderColor: COLORS.borderDefault,
    },

    missionCompleted: {
      backgroundColor: COLORS.cardBackground,
      padding: DIMENSIONS.missionCard.padding,
      borderRadius: DIMENSIONS.missionCard.borderRadius,
      borderWidth: DIMENSIONS.missionCard.borderWidth,
      borderColor: COLORS.borderSuccess,
    },

    missionDisabled: {
      backgroundColor: COLORS.panelBackground,
      padding: DIMENSIONS.missionCard.padding,
      borderRadius: DIMENSIONS.missionCard.borderRadius,
      borderWidth: DIMENSIONS.missionCard.borderWidth,
      borderColor: COLORS.buttonDisabled,
      opacity: 0.5,
    },
  } as const;

  /**
   * Dialog/Modal style presets
   */
  export const DIALOG_STYLES = {
    overlay: {
      backgroundColor: COLORS.overlayBackground,
    },

    content: {
      backgroundColor: COLORS.cardBackground,
      padding: DIMENSIONS.dialog.padding,
      borderRadius: DIMENSIONS.dialog.borderRadius,
    },

    title: {
      fontSize: DIMENSIONS.fontSize.xxl,
      fontWeight: 'bold' as const,
      color: COLORS.primary,
      textAlign: 'center' as const,
    },

    message: {
      fontSize: DIMENSIONS.fontSize.md,
      color: COLORS.textPrimary,
      textAlign: 'center' as const,
    },
  } as const;

  /**
   * Helper function to create a button definition with a preset style
   */
  export function createButton(
    id: string,
    label: string,
    variant: 'primary' | 'danger' | 'success' | 'secondary' | 'disabled' = 'primary'
  ): ButtonDef {
    return {
      id,
      label,
      style: BUTTON_STYLES[variant],
      variant,
      disabled: variant === 'disabled',
    };
  }

  /**
   * Helper function to create a stat badge definition
   */
  export function createStatBadge(label: string, value: string | number): StatBadgeDef {
    return {
      label,
      value,
      style: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: DIMENSIONS.statBadge.padding,
        borderRadius: DIMENSIONS.statBadge.borderRadius,
        borderWidth: DIMENSIONS.statBadge.borderWidth,
        borderColor: COLORS.borderPrimary,
      },
    };
  }

}

// Make BloomBeasts available globally
if (typeof globalThis !== 'undefined') {
  (globalThis as any).BloomBeasts = BloomBeasts;
}
