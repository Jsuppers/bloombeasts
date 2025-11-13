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
 * Generated: 2025-11-13T00:47:54.011Z
 * Files: 150
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

  // ==================== bloombeasts\gameManager.ts ====================

  /**
   * Type Definitions for BloomBeasts Game
   *
   * NOTE: This file now re-exports types from the centralized types/ directory.
   * The actual game logic is in BloomBeastsGame.ts.
   */

  // Export types for regular module bundling (web deployment)

  // ==================== bloombeasts\common\ui\types\types\bindings.ts ====================

  /**
   * Binding Type Declarations
   *
   * These are type-only declarations for reactive data bindings.
   * Actual implementations are provided by the platform via UIMethodMappings.
   */

  /**
   * Base class for value bindings
   */
  export declare class ValueBindingBase<T> {
    protected _key: string;
    protected _isInitialized: boolean;
  }

  /**
   * Reactive data binding
   * Matches Horizon's Binding API (no get() or subscribe() methods)
   */
  export declare class Binding<T = any> extends ValueBindingBase<T> {
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

  // ==================== bloombeasts\common\ui\types\types\BindingManager.ts ====================

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

  // ==================== bloombeasts\common\engine\utils\Logger.ts ====================

  /**
   * Logger
   *
   * Simple logging system with configurable log levels.
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
  }

  class LoggerClass {
    private config: LoggerConfig = {
      level: LogLevel.INFO,
      timestamps: true,
    };

    /**
     * Configure the logger
     */
    configure(config: Partial<LoggerConfig>): void {
      this.config = { ...this.config, ...config };
    }

    /**
     * Set log level
     */
    setLevel(level: LogLevel): void {
      this.config.level = level;
    }

    /**
     * Get current log level
     */
    getLevel(): LogLevel {
      return this.config.level;
    }

    /**
     * Format log message with timestamp and prefix
     */
    private format(level: string, message: string): string {
      const parts: string[] = [];

      if (this.config.timestamps) {
        const timestamp = new Date().toISOString();
        parts.push(`[${timestamp}]`);
      }

      parts.push(`[${level}]`);

      if (this.config.prefix) {
        parts.push(`[${this.config.prefix}]`);
      }

      parts.push(message);

      return parts.join(' ');
    }

    /**
     * Log debug message
     */
    debug(message: string, ...data: any[]): void {
      if (this.config.level <= LogLevel.DEBUG) {
        const formatted = this.format('DEBUG', message);
        console.log(formatted, ...data);
      }
    }

    /**
     * Log info message
     */
    info(message: string, ...data: any[]): void {
      if (this.config.level <= LogLevel.INFO) {
        const formatted = this.format('INFO', message);
        console.log(formatted, ...data);
      }
    }

    /**
     * Log warning message
     */
    warn(message: string, ...data: any[]): void {
      if (this.config.level <= LogLevel.WARN) {
        const formatted = this.format('WARN', message);
        console.warn(formatted, ...data);
      }
    }

    /**
     * Log error message
     */
    error(message: string, ...data: any[]): void {
      if (this.config.level <= LogLevel.ERROR) {
        const formatted = this.format('ERROR', message);
        console.error(formatted, ...data);
      }
    }
  }

  // Export singleton instance
  export const Logger = new LoggerClass();

  // Set default log level
  Logger.setLevel(LogLevel.DEBUG);

  // ==================== bloombeasts\core\GameConstants.ts ====================

  /**
   * Game Constants - Centralized configuration values
   * Eliminates magic numbers and hardcoded values throughout the codebase
   */

  /**
   * XP thresholds for player leveling (cumulative)
   * Formula: XP = 100 * (2.0 ^ (level - 1))
   */
  export const XP_THRESHOLDS = [
    0,      // Level 1
    100,    // Level 2: 100 XP
    300,    // Level 3: 300 XP total
    700,    // Level 4: 700 XP total
    1500,   // Level 5: 1500 XP total
    3100,   // Level 6: 3100 XP total
    6300,   // Level 7: 6300 XP total
    12700,  // Level 8: 12700 XP total
    25500,  // Level 9: 25500 XP total
  ] as const;

  /**
   * Game balance constants
   */
  export const GAME_CONSTANTS = {
    /** Maximum player level */
    MAX_PLAYER_LEVEL: 9,

    /** Maximum boost upgrade level */
    MAX_BOOST_LEVEL: 6,

    /** Starting player health */
    STARTING_HEALTH: 30,

    /** Maximum energy */
    MAX_ENERGY: 10,

    /** Turn timer in seconds */
    TURN_TIMER_SECONDS: 300,

    /** Starting hand size */
    STARTING_HAND_SIZE: 3,

    /** Mission ID for Cluck Norris (used in leaderboard) */
    MISSION_CLUCK_NORRIS_ID: 'mission17',

    /** Attack animation duration in milliseconds */
    ATTACK_ANIMATION_DURATION_MS: 500,

    /** Card detail popup display duration in milliseconds */
    CARD_DETAIL_POPUP_DURATION_MS: 2000,

    /** Deck size (maximum cards in deck) */
    DECK_SIZE: 30,

    /** Minimum deck size required to start a battle */
    MIN_DECK_SIZE: 1,

    /** Energy blocks per deck */
    ENERGY_BLOCKS_PER_DECK: 27,

    /** Stat increase per level (10% per level) */
    STAT_INCREASE_PER_LEVEL: 0.1,

    /** Max priority value for combat helpers */
    MAX_PRIORITY_VALUE: 999,

    /** Leaderboard max entries to display */
    LEADERBOARD_MAX_ENTRIES: 10,

    /** Percentage to decimal conversion divisor */
    PERCENTAGE_TO_DECIMAL: 100,

    /** Milliseconds per second */
    MILLISECONDS_PER_SECOND: 1000,

    /** Seconds per minute */
    SECONDS_PER_MINUTE: 60,

    /** Volume max value */
    VOLUME_MAX: 100,
  } as const;

  /**
   * Sound asset IDs - Type-safe references to all sound effects
   */
  export const SOUND_EFFECTS = {
    MENU_BUTTON_SELECT: 'sfx-menu-button-select',
    ATTACK: 'sfx-attack',
    PLAY_CARD: 'sfx-play-card',
    TRAP_ACTIVATED: 'sfx-trap-card-activated',
    WIN: 'sfx-win',
    LOSE: 'sfx-lose',
    UPGRADE: 'sfx-upgrade',
    UPGRADE_ROOSTER: 'sfx-upgrade-rooster',
  } as const;

  /**
   * Music asset IDs - Type-safe references to all music tracks
   */
  export const MUSIC_TRACKS = {
    BACKGROUND: 'music-background',
    BATTLE: 'music-battle',
  } as const;

  /**
   * Calculate player level from total XP (derived data)
   */
  export function getPlayerLevel(totalXP: number): number {
    for (let level = GAME_CONSTANTS.MAX_PLAYER_LEVEL; level >= 1; level--) {
      if (totalXP >= XP_THRESHOLDS[level - 1]) {
        return level;
      }
    }
    return 1;
  }

  // ==================== bloombeasts\common\ui\styles\styles\colors.ts ====================

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
    textBlack: '#000000',

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

  // ==================== bloombeasts\common\ui\styles\styles\dimensions.ts ====================

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
   * Battle-specific card dimensions
   * These are larger/different from the generic DIMENSIONS.card for battle UI layout
   */
  export const standardCardDimensions = {
    width: 210,
    height: 280,
  };

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
   * Button dimensions (specific sizes for different contexts)
   */
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

  /**
   * Mission-specific dimensions
   */
  export const missionCompleteCardDimensions = {
    width: 550,
    height: 330,
  };

  export const chestImageMissionCompleteDimensions = {
    width: 160,
    height: 180,
  };

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

  // ==================== bloombeasts\common\engine\types\abilities.ts ====================

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
    AffinityNotMatches = 'affinity-not-matches',
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

  // ==================== bloombeasts\common\engine\types\core.ts ====================

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

  // ==================== bloombeasts\common\engine\types\leveling.ts ====================

  /**
   * Type definitions for the leveling and progression system
   */


  export type Level = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

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
   * A single stat modifier
   */
  export interface StatModifier {
    source: string;
    sourceId: string;           // ID of the card/ability that applied this
    stat: 'attack' | 'health' | 'maxHealth';
    value: number;              // Amount of modification (can be negative)
    duration?: 'permanent' | 'end-of-turn' | 'while-active';
    turnsRemaining?: number;    // For temporary effects
  }

  // ==================== bloombeasts\common\engine\types\runtime.ts ====================

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

  // ==================== bloombeasts\common\ui\ScreenUtils.ts ====================

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
    const affinity = 'affinity' in card && card.affinity ? card.affinity : undefined;
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

  // ==================== bloombeasts\common\ui\constants\positions.ts ====================

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

  // ==================== bloombeasts\common\ui\components\common\Button.ts ====================

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

    // Simple usage: just pass color string (static or binding)
    color?: ButtonColor | ValueBindingBase<ButtonColor> | ReadonlyBindingInterface<ButtonColor>;
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

    // Determine static color value for imageSource (only if color is static)
    // If color is a binding, default to 'default' color (caller should use customImageSource for reactive backgrounds)
    const staticColor = (typeof color === 'string' ? color : 'default') as ButtonColor;

    // Use custom bindings if provided, otherwise compute from color/disabled
    const imageSource = customImageSource ?? (ui.assetIdToImageSource?.(getButtonAssetId(staticColor, type)) || null);

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

  // Export alias for backwards compatibility
  // Note: Export statement removed for namespace bundling - use createButton directly
  // export { createButton as Button };

  // ==================== bloombeasts\common\ui\screens\SideMenu.ts ====================

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
                          textAlign: sideMenuPositions.playerName.textAlign as 'left' | 'center' | 'right' | undefined,
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
  export function createTextRow(
      ui: UIMethodMappings,
      text: string | ValueBindingBase<string> | ReadonlyBindingInterface<string>,
      top: number = 0
  ): UINodeType {
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
          : (amount as Binding<number>).derive((a: number) => `${emoji} ${a}`);

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

  // ==================== bloombeasts\types\ui\UITypes.ts ====================

  /**
   * Core UI type definitions
   *
   * Fundamental UI types for the platform-agnostic UI system.
   */

  /**
   * Base UI element (platform-specific implementation)
   */
  export type UIElement = any; // Platform-specific element type

  /**
   * Conditional UI node (from UINode.if)
   */
  export type ConditionalUINode = any; // Platform-specific conditional type

  /**
   * UINode type - represents a UI node returned by UI components
   * Can be a single element, array of elements, null, or conditional rendering
   */
  export type UINode = UIElement | UIElement[] | null | ConditionalUINode;

  // ==================== bloombeasts\types\ui\UIProps.ts ====================

  /**
   * UI component props definitions
   *
   * Platform-agnostic prop interfaces for all UI components.
   */


  /**
   * Style properties - platform-agnostic style definitions
   * These match Horizon's styling but work on web too
   */
  export interface StyleProps {
    // Dimensions
    width?: number | string; // Support '100%', 'auto', etc.
    height?: number | string; // Support '100%', 'auto', etc.
    maxWidth?: number | string; // Max width constraint
    maxHeight?: number | string; // Max height constraint
    aspectRatio?: number; // Width/height ratio

    // Colors and visual
    backgroundColor?: string;
    color?: string; // Text/foreground color
    opacity?: number;
    borderRadius?: number;
    borderWidth?: number;
    borderTopWidth?: number;
    borderBottomWidth?: number;
    borderLeftWidth?: number;
    borderRightWidth?: number;
    borderColor?: string;
    borderTopColor?: string;
    borderBottomColor?: string;
    borderLeftColor?: string;
    borderRightColor?: string;
    shadowColor?: string;
    shadowRadius?: number;

    // Spacing
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

    // Layout
    display?: 'flex' | 'block' | 'inline' | 'none' | any; // Allow any for platform-specific values
    flex?: number; // Flex grow factor
    flexDirection?: 'row' | 'column';
    flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
    justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
    alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
    gap?: number; // Gap between flex items
    overflow?: 'visible' | 'hidden';

    // Positioning
    position?: 'relative' | 'absolute';
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;

    // Typography (for convenience in style)
    fontSize?: number;
    fontWeight?: 'normal' | 'bold' | number;
    textAlign?: 'left' | 'center' | 'right'; // Text alignment
    textAlignVertical?: 'top' | 'center' | 'bottom'; // Vertical text alignment
    lineHeight?: number; // Line height for text
    textShadowColor?: string; // Text shadow color
    textShadowOffset?: { width: number; height: number }; // Text shadow offset
    textShadowRadius?: number; // Text shadow blur radius

    // Z-index for layering
    zIndex?: number;

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
    text?: string | any; // Support both string and bindings (ValueBindingBase, ReadonlyBindingInterface)
    fontSize?: number;
    fontWeight?: 'normal' | 'bold';
    color?: string;
    textAlign?: 'left' | 'center' | 'right';
    numberOfLines?: number; // Max number of lines before truncation
  }

  /**
   * Image component props
   */
  export interface ImageProps extends BaseUIProps {
    imageId?: string | any; // Single image asset ID (or binding)
    source?: any; // Image source (platform-specific, can be URL, asset ID, or binding)
    binding?: any; // BaseBinding<string> for animations, derived values, etc.
    width?: number;
    height?: number;
  }

  /**
   * Pressable (button) component props
   */
  export interface PressableProps extends BaseUIProps {
    onPress?: () => void;
    onClick?: () => void; // Alias for onPress (web compatibility)
    disabled?: boolean | any; // Whether the button is disabled (supports bindings)
    id?: string;
  }

  /**
   * ScrollView component props
   */
  export interface ScrollViewProps extends BaseUIProps {
    horizontal?: boolean;
    showsScrollIndicator?: boolean;
  }

  // ==================== bloombeasts\types\ui\UIMethodMappings.ts ====================

  /**
   * UI method mappings definition
   *
   * Platform-specific UI method implementations.
   * Each platform provides its own implementation of these methods.
   * Screens receive this object and use it to create UI elements.
   */


  /**
   * Platform-specific UI method mappings
   * Each platform provides its own implementation of these methods
   * Screens receive this object and use it to create UI elements
   */
  export interface UIMethodMappings {
    // Core UI components - return UIElement (platform-specific element)
    View: (props: ViewProps) => UIElement;
    Text: (props: TextProps) => UIElement;
    Image: (props: ImageProps) => UIElement;
    Pressable: (props: PressableProps) => UIElement;
    ScrollView?: (props: ScrollViewProps) => UIElement;

    // UINode utilities for conditional rendering
    // Platform-specific type for conditional UI nodes (e.g., Horizon's ConditionalUINode)
    UINode?: ConditionalUINode;

    // Centralized binding manager - ONLY way to create/access bindings
    bindingManager: BindingManager;

    // Platform-specific helpers
    // Returns platform-specific image source (ImageSource on Horizon, string on Web)
    assetIdToImageSource?: (assetId: string) => unknown;
  }

  // ==================== bloombeasts\screens\common\BaseScreen.ts ====================

  /**
   * BaseScreen
   */


  export interface BaseScreenProps {
    ui: UIMethodMappings;
    onNavigate?: (screen: string) => void;
    onRenderNeeded?: () => void;
    playSfx?: (sfxId: string) => void;
  }

  export abstract class BaseScreen {
    protected ui: UIMethodMappings;
    protected onNavigate?: (screen: string) => void;
    protected onRenderNeeded?: () => void;
    protected playSfx?: (sfxId: string) => void;

    constructor(props: BaseScreenProps) {
      this.ui = props.ui;
      this.onNavigate = props.onNavigate;
      this.onRenderNeeded = props.onRenderNeeded;
      this.playSfx = props.playSfx;
    }

    /**
     * Create the screen's UI - must be implemented by subclasses
     */
    abstract createUI(): UINodeType;

    /**
     * Full-screen background image
     */
    protected createFullScreenBackground(assetId: string = 'background'): UINodeType {
      return this.ui.Image({
        source: this.ui.assetIdToImageSource?.(assetId) || null,
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
     * Root container that wraps all screen content
     */
    protected createRootContainer(children: any[]): UINodeType {
      return this.ui.View({
        style: {
          width: '100%',
          height: '100%',
          position: 'relative',
        },
        children,
      });
    }

    /**
     * Standard container background (used in Cards, Settings, Upgrade, etc.)
     */
    protected createContainerBackground(
      assetId: string = 'cards-container',
      position: { left: number; top: number; width: number; height: number } = {
        left: 40,
        top: 40,
        width: 980,
        height: 640,
      }
    ): UINodeType {
      return this.ui.Image({
        source: this.ui.assetIdToImageSource?.(assetId) || null,
        style: {
          position: 'absolute',
          ...position,
        },
      });
    }

    /**
     * Content area inside container (used in Cards, Settings, Upgrade, etc.)
     */
    protected createContentArea(
      children: any[],
      position: { left: number; top: number; width: number; height: number } = {
        left: 70,
        top: 70,
        width: 920,
        height: 580,
      }
    ): UINodeType {
      return this.ui.View({
        style: {
          position: 'absolute',
          ...position,
        },
        children,
      });
    }

    /**
     * Standard "Back to Menu" button configuration
     */
    protected getBackButton() {
      return {
        label: 'Back',
        onClick: () => this.onNavigate?.('menu'),
        disabled: false,
      };
    }

    /**
     * Navigate to a screen with optional sound
     */
    protected navigate(screen: string, playSound: boolean = true) {
      if (playSound && this.playSfx) {
        this.playSfx('sfx-menu-button-select');
      }
      this.onNavigate?.(screen);
    }

    /**
     * Trigger a re-render
     */
    protected triggerRender() {
      this.onRenderNeeded?.();
    }

    /**
     * Cleanup - override if needed
     */
    dispose(): void {
      // Override in subclasses if cleanup is needed
    }
  }

  // ==================== bloombeasts\screens\menu\MenuScreen.ts ====================

  /**
   * Menu Screen
   */


  // UI layout constants
  const LINE_HEIGHT_OFFSET = 5;
  const QUOTE_WIDTH = 150;
  const QUOTE_NUM_LINES = 2;

  // Character animation constants
  const CHARACTER_LEFT = 290;
  const CHARACTER_TOP = 40;
  const CHARACTER_WIDTH = 675;
  const CHARACTER_HEIGHT = 630;

  // Play button constants
  const PLAY_BUTTON_FONT_SIZE = 32;
  const PLAY_BUTTON_LEFT = 552;
  const PLAY_BUTTON_TOP = 400;

  // Player stats container constants
  const STATS_CONTAINER_WIDTH = 487;
  const STATS_CONTAINER_HEIGHT = 82;
  const SCREEN_WIDTH = 1280;
  const STATS_CONTAINER_Y = 20;
  const STATS_ICON_SIZE = 28;

  // Level display constants
  const LEVEL_TEXT_LEFT = 85;
  const LEVEL_TEXT_TOP = 29;

  // Coins display constants
  const COINS_LEFT = 250;
  const COINS_TOP = 28;
  const COINS_ICON_GAP = 8;
  const COINS_TEXT_MARGIN = 4;

  // Serums display constants
  const SERUMS_LEFT = 370;
  const SERUMS_TOP = 28;
  const SERUMS_ICON_GAP = 8;
  const SERUMS_TEXT_MARGIN = 4;

  export interface MenuScreenProps extends BaseScreenProps {
    onButtonClick?: (buttonId: string) => void;
  }

  /**
   * Menu Screen - Main navigation hub
   */
  export class MenuScreen extends BaseScreen {
    private menuFrameIds: string[] = [
      'menu-frame-1', 'menu-frame-2', 'menu-frame-3', 'menu-frame-4', 'menu-frame-5',
      'menu-frame-6', 'menu-frame-7', 'menu-frame-8', 'menu-frame-9', 'menu-frame-10',
    ];

    private quotes: string[] = [
      'Welcome back, Trainer!',
    ];

    private onButtonClick?: (buttonId: string) => void;

    constructor(props: MenuScreenProps) {
      super(props);
      this.onButtonClick = props.onButtonClick;
    }

    createUI(): UINodeType {
      const menuOptions = ['cards', 'upgrades', 'leaderboard', 'settings'];
      const lineHeight = DIMENSIONS.fontSize.lg + LINE_HEIGHT_OFFSET;

      const menuButtons = menuOptions.map((option, index) => ({
        label: this.getMenuLabel(option),
        onClick: () => {
          this.onButtonClick?.(`btn-${option}`);
          this.navigate(option);
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
            this.ui.View({
              style: {
                position: 'absolute',
                top: 0,
                width: QUOTE_WIDTH,
              },
              children: this.ui.Text({
                text: this.quotes[0],
                numberOfLines: QUOTE_NUM_LINES,
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

      return this.createRootContainer([
        this.createFullScreenBackground(),

        // Main content area with animated character
        this.ui.View({
          style: {
            position: 'absolute',
            width: '100%',
            height: '100%',
          },
          children: [
            this.ui.Image({
              source: this.ui.assetIdToImageSource?.(this.menuFrameIds[0]) || null,
              style: {
                position: 'absolute',
                left: CHARACTER_LEFT,
                top: CHARACTER_TOP,
                width: CHARACTER_WIDTH,
                height: CHARACTER_HEIGHT,
              },
            }),
          ],
        }),

        // Player stats container at top middle
        this.createPlayerStatsContainer(),

        // "Play" button
        createButton({
          ui: this.ui,
          label: 'Play',
          onClick: () => {
            this.onButtonClick?.('btn-missions');
            this.navigate('missions');
          },
          imageSource: this.ui.assetIdToImageSource?.('yellow-button') || null,
          playSfx: this.playSfx,
          style: {
            fontSize: PLAY_BUTTON_FONT_SIZE,
            fontWeight: 'bold',
            textAlign: 'center',
            position: 'absolute',
            left: PLAY_BUTTON_LEFT,
            top: PLAY_BUTTON_TOP,
          },
        }),

        // Side menu
        createSideMenu(this.ui, {
          customTextContent,
          buttons: menuButtons,
          bottomButton: {
            label: 'Close',
            onClick: () => {},
            disabled: true,
          },
          onXPBarClick: (title: string, message: string) => {
            this.onButtonClick?.(`show-counter-info:${title}:${message}`);
          },
          playSfx: this.playSfx,
        }),
      ]);
    }

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

    private createPlayerStatsContainer(): UINodeType {
      const containerX = (SCREEN_WIDTH - STATS_CONTAINER_WIDTH) / 2;

      const getItemQuantity = (items: PlayerItem[], itemId: string): number => {
        const item = items?.find((i) => i.itemId === itemId);
        return item ? item.quantity : 0;
      };

      const levelTextBinding = this.ui.bindingManager.playerDataBinding.binding.derive((data: PlayerData) => {
        if (!data) return 'Lvl 1. 0/100';
        const totalXP = data.totalXP || 0;
        const playerLevel = getPlayerLevel(totalXP);
        const xpForCurrentLevel = XP_THRESHOLDS[playerLevel - 1];
        const xpForNextLevel = playerLevel < GAME_CONSTANTS.MAX_PLAYER_LEVEL ? XP_THRESHOLDS[playerLevel] : XP_THRESHOLDS[GAME_CONSTANTS.MAX_PLAYER_LEVEL - 1];
        const currentXP = totalXP - xpForCurrentLevel;
        const xpNeeded = xpForNextLevel - xpForCurrentLevel;
        return `Lvl ${playerLevel}. ${currentXP}/${xpNeeded}`;
      });

      const coinsBinding = this.ui.bindingManager.playerDataBinding.binding.derive((data: PlayerData) => {
        if (!data) return '0';
        return String(data.coins || 0);
      });

      const serumsBinding = this.ui.bindingManager.playerDataBinding.binding.derive((data: PlayerData) => {
        if (!data) return '0';
        const serums = getItemQuantity(data.items || [], 'serum');
        return String(serums);
      });

      return this.ui.View({
        style: {
          position: 'absolute',
          left: containerX,
          top: STATS_CONTAINER_Y,
          width: STATS_CONTAINER_WIDTH,
          height: STATS_CONTAINER_HEIGHT,
        },
        children: [
          this.ui.Image({
            source: this.ui.assetIdToImageSource?.('player-stats-container') || null,
            style: {
              position: 'absolute',
              width: STATS_CONTAINER_WIDTH,
              height: STATS_CONTAINER_HEIGHT,
              top: 0,
              left: 0,
            },
          }),

          // Level text
          this.ui.View({
            style: {
              position: 'absolute',
              left: LEVEL_TEXT_LEFT,
              top: LEVEL_TEXT_TOP,
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

          // Coins section
          this.ui.View({
            style: {
              position: 'absolute',
              left: COINS_LEFT,
              top: COINS_TOP,
              flexDirection: 'row',
              alignItems: 'center',
              gap: COINS_ICON_GAP,
            },
            children: [
              this.ui.Image({
                source: this.ui.assetIdToImageSource?.('icon-coin') || null,
                style: {
                  width: STATS_ICON_SIZE,
                  height: STATS_ICON_SIZE,
                },
              }),
              this.ui.Text({
                text: coinsBinding,
                style: {
                  fontSize: DIMENSIONS.fontSize.lg,
                  color: COLORS.textBlack,
                  fontWeight: 'bold',
                  marginLeft: COINS_TEXT_MARGIN,
                },
              }),
            ],
          }),

          // Serums section
          this.ui.View({
            style: {
              position: 'absolute',
              left: SERUMS_LEFT,
              top: SERUMS_TOP,
              flexDirection: 'row',
              alignItems: 'center',
              gap: SERUMS_ICON_GAP,
            },
            children: [
              this.ui.Image({
                source: this.ui.assetIdToImageSource?.('icon-serum') || null,
                style: {
                  width: STATS_ICON_SIZE,
                  height: STATS_ICON_SIZE,
                },
              }),
              this.ui.Text({
                text: serumsBinding,
                style: {
                  fontSize: DIMENSIONS.fontSize.lg,
                  color: COLORS.textBlack,
                  fontWeight: 'bold',
                  marginLeft: SERUMS_TEXT_MARGIN,
                },
              }),
            ],
          }),
        ],
      });
    }
  }

  // ==================== bloombeasts\common\ui\constants\emojis.ts ====================

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

  // ==================== bloombeasts\common\engine\utils\abilityDescriptionGenerator.ts ====================

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

  // ==================== bloombeasts\common\engine\utils\cardDescriptionGenerator.ts ====================

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
        .map((ability: any) => generateAbilityDescription(ability))
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

  // ==================== bloombeasts\common\engine\constants\leveling.ts ====================

  /**
   * Constants for the leveling and progression system
   *
   * Leveling system:
   * - Beast cards gain XP from battles (distributed evenly across deck)
   * - Each level increases stats by 10% (Level 1 = 100%, Level 9 = 180%)
   * - XP thresholds use exponential scaling for progressively harder leveling
   */


  /**
   * Cumulative XP thresholds for card leveling
   * Level 2: 100 XP, Level 3: 300 XP, etc.
   */
  export const CARD_XP_THRESHOLDS = [
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

  export const MAX_LEVEL: Level = 9;

  export const ENERGY_XP_COST = 1;

  // ==================== bloombeasts\common\utils\cardUtils.ts ====================

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

  export function getXPThreshold(level: number): number {
    return CARD_XP_THRESHOLDS[level - 1];
  }

  /**
   * Get XP threshold for progression display
   * Returns the XP needed to reach the NEXT level
   * For max level, returns the current level threshold
   *
   * @param currentLevel - Current card level (1-9)
   * @returns XP threshold for next level progression
   *
   * @example
   * // Level 2 card needs 300 XP to reach level 3
   * getXPProgressionThreshold(2) // returns 300
   *
   * // Level 9 card is at max, show max threshold
   * getXPProgressionThreshold(9) // returns 25500
   */
  export function getXPProgressionThreshold(currentLevel: number): number {
    // For max level (9), show the threshold for level 9
    if (currentLevel >= 9) {
      return CARD_XP_THRESHOLDS[8]; // Level 9 threshold
    }

    // For levels 1-8, show the threshold for the NEXT level
    return CARD_XP_THRESHOLDS[currentLevel]; // Next level threshold (current level index in array)
  }

  /**
   * Get card definition by ID
   */
  export function getCardDefinition(cardId: string): AnyCard | undefined {
    if (!_cardUtilsCatalogManager) {
      Logger.warn('[cardUtils] catalogManager not initialized');
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
    if (cardDef.type === CardType.Beast && 'baseAttack' in cardDef && 'baseHealth' in cardDef) {
      const beastCard = cardDef as BloomBeastCard;
      const scaledAttack = computeLeveledStat(beastCard.baseAttack, level);
      const scaledHealth = computeLeveledStat(beastCard.baseHealth, level);

      const runtimeBeast: RuntimeBeast = {
        ...beastCard,
        instanceId: instance.id,
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
      Logger.warn('[cardUtils] catalogManager not initialized');
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
          Logger.warn(`[cardUtils] Card definition not found for ${cardInstance.cardId}`);
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

  // ==================== bloombeasts\common\engine\constants\gameRules.ts ====================

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

  // Health Configuration
  export const STARTING_HEALTH = 30;
  export const PLAYER_MAX_HEALTH = 30;

  // Turn Configuration
  export const TURN_TIME_LIMIT = 60; // seconds

  // Battle Configuration
  export const FIRST_PLAYER_DRAWS_ON_FIRST_TURN = false;

  // ==================== bloombeasts\screens\battle\BattleDisplayManager.ts ====================

  /**
   * BattleDisplayManager - Handles battle UI rendering and display enrichment
   * Manages battle state visualization, animations, and card popups
   */


  /**
   * Options for creating battle display
   */
  export interface BattleDisplayOptions {
    attackerPlayer?: 'player' | 'opponent';
    attackerIndex?: number;
    targetPlayer?: 'player' | 'opponent' | 'health';
    targetIndex?: number;
  }

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
      options?: BattleDisplayOptions,
      mission?: any,
      progress?: any
    ): BattleDisplay | null {
      if (!battleState?.turboState) {
        return null;
      }

      const turboState = battleState.turboState;
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
        objectives: this.getObjectiveDisplay(mission, progress),
        habitatZone: playerField.habitat || opponentField.habitat, // Use whichever has a habitat
        attackAnimation: options,
      };

      return display;
    }

    /**
     * Get objective display for current battle
     */
    private getObjectiveDisplay(mission: any, progress: any): ObjectiveDisplay[] {
      if (!mission || !progress) {
        return [];
      }

      // Check if mission has objectives defined
      if (!mission.objectives || !Array.isArray(mission.objectives)) {
        return [];
      }

      return mission.objectives.map((obj: any) => {
        const key = `${obj.type}-${obj.target || 0}`;
        const progressValue = progress.objectiveProgress.get(key) || 0;
        const target = obj.target || 1;

        return {
          description: obj.description || 'Unknown objective',
          progress: Math.min(progressValue, target),
          target: target,
          isComplete: progressValue >= target,
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

  // ==================== bloombeasts\types\game\DisplayTypes.ts ====================

  /**
   * Display type definitions
   *
   * Types used for UI display and presentation.
   * These are view models that aggregate game state for presentation.
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
   * Mission objective progress for display
   */
  export interface ObjectiveDisplay {
    description: string;
    progress: number;
    target: number;
    isComplete: boolean;
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
    attackAnimation?: BattleDisplayOptions; // Attack animation state
    cardPopup?: { // Card popup display (for magic/trap/buff cards)
      card: any;
      player: 'player' | 'opponent';
      showCloseButton?: boolean; // Show close button for manual popups
    } | null;
  }

  // ==================== bloombeasts\screens\battle\engine\utils\cardIdentifiers.ts ====================

  /**
   * Card Identifier Utilities
   *
   * Provides consistent ID matching across the battle system.
   *
   * Cards/beasts have two ID fields:
   * - id: Base card ID (e.g., "forest-beast-1") - shared across all instances
   * - instanceId: Unique instance ID (e.g., "forest-beast-1-123-456") - unique per instance
   *
   * Use these helpers instead of manual ID comparisons to ensure consistency.
   */

  /**
   * Get the canonical identifier for a card/beast
   * Prefers instanceId (unique) over id (shared across all instances of same card)
   */
  export function getCardIdentifier(card: { id: string; instanceId?: string }): string {
    return card.instanceId || card.id;
  }

  /**
   * Check if two cards/beasts match by their identifiers
   * Compares canonical identifiers (prefers instanceId)
   */
  export function cardsMatch(
    card1: { id: string; instanceId?: string },
    card2: { id: string; instanceId?: string }
  ): boolean {
    const id1 = getCardIdentifier(card1);
    const id2 = getCardIdentifier(card2);
    return id1 === id2;
  }

  /**
   * Check if a card matches a given identifier (either id or instanceId)
   * Useful when searching with an ID that could be either base ID or instance ID
   */
  export function cardMatchesId(
    card: { id: string; instanceId?: string },
    searchId: string
  ): boolean {
    return card.id === searchId || card.instanceId === searchId;
  }

  // ==================== bloombeasts\types\game\PlayerTypes.ts ====================

  /**
   * Player data type definitions
   *
   * Core player data structures used throughout the game.
   */


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

  // ==================== bloombeasts\common\ui\screens\CardRenderer.ts ====================

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
        Logger.warn('[CardRenderer] Card missing id, using name fallback:', card);
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
    const affinity = 'affinity' in card && card.affinity ? card.affinity : undefined;

    // Extract attack/health for Beast cards (with proper type narrowing)
    let beastAttack: number | undefined;
    let beastHealth: number | undefined;
    if (card.type === CardType.Beast) {
      const beastCard = card as RuntimeBeast;
      beastAttack = beastCard.currentAttack ?? beastCard.baseAttack;
      beastHealth = beastCard.currentHealth ?? beastCard.baseHealth;
    }

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
        ...(beastAttack !== undefined ? [
          ui.Text({
            text: String(beastAttack ?? 0),
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

        ...(beastHealth !== undefined ? [
          ui.Text({
            text: String(beastHealth ?? 0),
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
            text: `lvl ${card.level}. ${card.currentXP || 0}/${getXPProgressionThreshold(card.level)}`,
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
        onClick: () => onClick(card.instanceId || card.id),
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
        if (!cardId) {
          return null;
        }
        instance = cardInstances.find((c: CardInstance) => c.id === cardId) || null;
        if (!instance) {
          Logger.warn(`[CardRenderer] selectedCard mode: card not found for ID: ${cardId}. Available cards:`, cardInstances.map(c => c.id));
        }
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
      return `lvl ${card.level}. ${exp}/${getXPProgressionThreshold(card.level)}`;
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
      // Use conditional rendering to show/hide the border view based on whether card is in deck
      ...(showDeckIndicator && !isBattleMode && ui.UINode ? [ui.UINode.if(
        ui.bindingManager.derive([BindingType.UIState, BindingType.PlayerData], (uiState: UIState, playerData: PlayerData) => {
          const card = getCard(uiState, playerData, null);
          if (!card) return false;
          return isCardInDeck(playerData, getCardIdentifier(card!));
        }),
        ui.View({
          style: {
            position: 'absolute',
            top: -4,
            left: 0,
            width: cardWidth,
            height: cardHeight,
            borderWidth: 4,
            borderColor: COLORS.success,
            borderRadius: 8,
            // pointerEvents: 'none' as const, // Allow clicks to pass through
          },
        })
      )] : []),
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
          Logger.debug('[CardRenderer] Card clicked:', { instanceId: card?.instanceId, cardId: card?.id, cardName: card?.name, mode });
          if (card?.instanceId) {
            onClick(card.instanceId);
          } else {
            Logger.warn('[CardRenderer] Clicked card has no instanceId:', card);
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

  // ==================== bloombeasts\common\ui\components\common\Popup.ts ====================

  /**
   * Common Popup Component
   * Reusable popup with title, description, content, and buttons
   */


  export interface PopupButton {
    label: string | ValueBindingBase<string> | ReadonlyBindingInterface<string>;
    onClick: () => void;
    color?: ButtonColor | ValueBindingBase<ButtonColor> | ReadonlyBindingInterface<ButtonColor>;
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

  // ==================== bloombeasts\common\ui\screens\CardDetailPopup.ts ====================

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

    // Derive card name watching both UIState and PlayerData for full reactivity
    const cardNameBinding = ui.bindingManager.derive([BindingType.UIState, BindingType.PlayerData], (uiState: UIState, pd: PlayerData) => {
      const cardInstance = pd?.cards?.collected?.find((c: any) => c.id === uiState.cards?.selectedCardId);
      if (!cardInstance) return 'Card Details';
      const baseCardId = extractBaseCardId(cardInstance.cardId);
      const cardDef = getCardDefinition(baseCardId);
      return cardDef?.name || 'Card Details';
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

  // ==================== bloombeasts\screens\common\UIStateManager.ts ====================

  /**
   * UIStateManager
   */


  export class UIStateManager<T = any> {
    constructor(
      private bindingManager: BindingManager,
      public readonly stateKey: string,
      private onRenderNeeded?: () => void
    ) {
      // Initialize state if it doesn't exist
      this.ensureStateInitialized();
    }

    /**
     * Ensure the state key exists in UIState
     */
    private ensureStateInitialized(): void {
      const currentState = this.bindingManager.getSnapshot(BindingType.UIState);
      if (!currentState[this.stateKey]) {
        this.bindingManager.setBinding(BindingType.UIState, {
          ...currentState,
          [this.stateKey]: {},
        });
      }
    }

    /**
     * Update nested state and trigger render
     */
    update(updates: Partial<T>): void {
      const currentState = this.bindingManager.getSnapshot(BindingType.UIState);
      this.bindingManager.setBinding(BindingType.UIState, {
        ...currentState,
        [this.stateKey]: {
          ...currentState[this.stateKey],
          ...updates,
        },
      });
      this.onRenderNeeded?.();
    }

    /**
     * Get the current state for this screen
     */
    getState(): T {
      const state = this.bindingManager.getSnapshot(BindingType.UIState);
      return (state?.[this.stateKey] || {}) as T;
    }

    /**
     * Get a specific value from state
     */
    getValue<K extends keyof T>(key: K): T[K] | undefined {
      return this.getState()[key];
    }

    /**
     * Set a single value in state
     */
    setValue<K extends keyof T>(key: K, value: T[K]): void {
      this.update({ [key]: value } as unknown as Partial<T>);
    }

    /**
     * Reset state to empty object
     */
    reset(): void {
      const currentState = this.bindingManager.getSnapshot(BindingType.UIState);
      this.bindingManager.setBinding(BindingType.UIState, {
        ...currentState,
        [this.stateKey]: {},
      });
      this.onRenderNeeded?.();
    }

    /**
     * Create a derived binding that includes this state key
     */
    createDerivedBinding<R>(
      additionalBindings: BindingType[],
      deriveFn: (state: T, ...args: any[]) => R
    ) {
      return this.bindingManager.derive(
        [BindingType.UIState, ...additionalBindings],
        (uiState: any, ...args: any[]) => {
          const state = (uiState?.[this.stateKey] || {}) as T;
          return deriveFn(state, ...args);
        }
      );
    }
  }

  // ==================== bloombeasts\screens\common\ScrollButtonFactory.ts ====================

  /**
   * ScrollButtonFactory - Eliminates scroll button duplication
   *
   * Replaces 110+ lines of duplicate scroll logic in CardsScreen and MissionScreen
   * with a simple factory function.
   */


  export interface ScrollButtonConfig {
    ui: UIMethodMappings;
    stateManager: UIStateManager<{ scrollOffset?: number }>;
    getTotalPages: () => number;
    playSfx?: (sfxId: string) => void;
    position?: {
      prevLeft?: number;
      prevTop?: number;
      nextLeft?: number;
      nextTop?: number;
      width?: number;
      height?: number;
    };
  }

  export class ScrollButtonFactory {
    /**
     * Create Previous and Next scroll buttons with all bindings
     */
    static createScrollButtons(config: ScrollButtonConfig): UINodeType[] {
      const {
        ui,
        stateManager,
        getTotalPages,
        playSfx,
        position = {},
      } = config;

      const {
        prevLeft = 40,
        prevTop = 600,
        nextLeft = 940,
        nextTop = 600,
        width = 80,
        height = 60,
      } = position;

      const getCurrentOffset = () => stateManager.getValue('scrollOffset') ?? 0;

      // Previous button
      const prevButton = createButton({
        ui,
        label: ui.bindingManager.derive(
          [BindingType.UIState],
          () => {
            const offset = getCurrentOffset();
            return offset > 0 ? '<' : '';
          }
        ),
        onClick: () => {
          const offset = getCurrentOffset();
          if (offset > 0) {
            playSfx?.('sfx-menu-button-select');
            stateManager.update({ scrollOffset: offset - 1 });
          }
        },
        disabled: ui.bindingManager.derive(
          [BindingType.UIState],
          () => getCurrentOffset() === 0
        ),
        style: {
          position: 'absolute',
          left: prevLeft,
          top: prevTop,
          width,
          height,
          fontSize: 24,
          opacity: ui.bindingManager.derive(
            [BindingType.UIState],
            () => getCurrentOffset() === 0 ? 0.5 : 1.0
          ),
          textColor: ui.bindingManager.derive(
            [BindingType.UIState],
            () => getCurrentOffset() === 0 ? '#888' : '#fff'
          ),
        },
      });

      // Next button
      const nextButton = createButton({
        ui,
        label: ui.bindingManager.derive(
          [BindingType.UIState],
          () => {
            const offset = getCurrentOffset();
            const totalPages = getTotalPages();
            return offset < totalPages - 1 ? '>' : '';
          }
        ),
        onClick: () => {
          const offset = getCurrentOffset();
          const totalPages = getTotalPages();
          if (offset < totalPages - 1) {
            playSfx?.('sfx-menu-button-select');
            stateManager.update({ scrollOffset: offset + 1 });
          }
        },
        disabled: ui.bindingManager.derive(
          [BindingType.UIState],
          () => {
            const offset = getCurrentOffset();
            const totalPages = getTotalPages();
            return offset >= totalPages - 1;
          }
        ),
        style: {
          position: 'absolute',
          left: nextLeft,
          top: nextTop,
          width,
          height,
          fontSize: 24,
          opacity: ui.bindingManager.derive(
            [BindingType.UIState],
            () => {
              const offset = getCurrentOffset();
              const totalPages = getTotalPages();
              return offset >= totalPages - 1 ? 0.5 : 1.0;
            }
          ),
          textColor: ui.bindingManager.derive(
            [BindingType.UIState],
            () => {
              const offset = getCurrentOffset();
              const totalPages = getTotalPages();
              return offset >= totalPages - 1 ? '#888' : '#fff';
            }
          ),
        },
      });

      return [prevButton, nextButton];
    }

    /**
     * Calculate pagination info for displaying "Page X of Y"
     */
    static createPageInfo(config: {
      ui: UIMethodMappings;
      stateManager: UIStateManager<{ scrollOffset?: number }>;
      getTotalPages: () => number;
      position?: { left?: number; top?: number };
      fontSize?: number;
      color?: string;
    }): UINodeType {
      const {
        ui,
        stateManager,
        getTotalPages,
        position = {},
        fontSize = 16,
        color = '#fff',
      } = config;

      const { left = 500, top = 615 } = position;

      return ui.Text({
        text: ui.bindingManager.derive(
          [BindingType.UIState],
          () => {
            const offset = stateManager.getValue('scrollOffset') ?? 0;
            const totalPages = getTotalPages();
            return totalPages > 0 ? `Page ${offset + 1} of ${totalPages}` : '';
          }
        ),
        style: {
          position: 'absolute',
          left,
          top,
          fontSize,
          color,
          textAlign: 'center',
        },
      });
    }

    /**
     * Create Previous and Next scroll buttons for side menu
     * Eliminates 100+ lines of duplicate code in CardsScreen and MissionScreen
     */
    static createSideMenuScrollButtons(config: {
      ui: UIMethodMappings;
      stateManager: UIStateManager<{ scrollOffset?: number }>;
      getTotalPages: () => number;
      playSfx?: (sfxId: string) => void;
      playerDataBinding?: boolean; // Whether to watch PlayerData binding for total pages
      cardsPerPage?: number; // For calculating total pages from binding data
    }): SideMenuButton[] {
      const {
        ui,
        stateManager,
        getTotalPages,
        playSfx,
        playerDataBinding = false,
        cardsPerPage = 8,
      } = config;

      const getCurrentOffset = () => stateManager.getValue('scrollOffset') ?? 0;
      const screenKey = stateManager.stateKey;

      // Determine which bindings to watch based on content type
      const bindings = playerDataBinding
        ? [BindingType.UIState, BindingType.PlayerData]
        : [BindingType.UIState, BindingType.Missions];

      // Helper to calculate total pages from binding data instead of snapshot
      const calculateTotalPages = (data: any): number => {
        if (playerDataBinding) {
          const cards = data?.cards?.collected || [];
          return Math.ceil(cards.length / cardsPerPage);
        } else {
          // For missions, getTotalPages from config works fine
          return getTotalPages();
        }
      };

      return [
        {
          label: 'Previous',
          onClick: () => {
            const offset = getCurrentOffset();
            if (offset > 0) {
              playSfx?.('sfx-menu-button-select');
              stateManager.update({ scrollOffset: offset - 1 });
            }
          },
          disabled: ui.bindingManager.derive([BindingType.UIState], (uiState: any) => {
            const offset = uiState?.[screenKey]?.scrollOffset ?? 0;
            return offset <= 0;
          }),
          opacity: ui.bindingManager.derive([BindingType.UIState], (uiState: any) => {
            const offset = uiState?.[screenKey]?.scrollOffset ?? 0;
            return offset <= 0 ? 0.5 : 1.0;
          }),
          textColor: ui.bindingManager.derive([BindingType.UIState], (uiState: any) => {
            const offset = uiState?.[screenKey]?.scrollOffset ?? 0;
            return offset <= 0 ? COLORS.textMuted : COLORS.textPrimary;
          }),
          yOffset: 0,
        },
        {
          label: 'Next',
          onClick: () => {
            const offset = getCurrentOffset();
            const totalPages = getTotalPages();
            if (offset < totalPages - 1) {
              playSfx?.('sfx-menu-button-select');
              stateManager.update({ scrollOffset: offset + 1 });
            }
          },
          disabled: ui.bindingManager.derive(bindings, (uiState: any, otherData: any) => {
            const offset = uiState?.[screenKey]?.scrollOffset ?? 0;
            // Use binding value instead of snapshot for total pages calculation
            const totalPages = calculateTotalPages(otherData);
            return offset >= totalPages - 1;
          }),
          opacity: ui.bindingManager.derive(bindings, (uiState: any, otherData: any) => {
            const offset = uiState?.[screenKey]?.scrollOffset ?? 0;
            const totalPages = calculateTotalPages(otherData);
            return offset >= totalPages - 1 ? 0.5 : 1.0;
          }),
          textColor: ui.bindingManager.derive(bindings, (uiState: any, otherData: any) => {
            const offset = uiState?.[screenKey]?.scrollOffset ?? 0;
            const totalPages = calculateTotalPages(otherData);
            return offset >= totalPages - 1 ? COLORS.textMuted : COLORS.textPrimary;
          }),
          yOffset: sideMenuButtonDimensions.height + GAPS.buttons,
        },
      ];
    }
  }

  // ==================== bloombeasts\screens\cards\CardsScreen.ts ====================

  /**
   * Cards Screen - Refactored using BaseScreen and utilities
   *
   * Reduced from 407 lines to ~280 lines (31% reduction) by eliminating:
   * - Constructor boilerplate → BaseScreen
   * - State update patterns → UIStateManager
   * - Scroll button logic → ScrollButtonFactory
   * - Layout helpers → BaseScreen methods
   */


  export interface CardsScreenProps extends BaseScreenProps {
    onCardSelect?: (cardId: string) => void;
  }

  interface CardsState {
    scrollOffset?: number;
    selectedCardId?: string | null;
  }

  /**
   * Cards Screen - Collection and Deck Management
   */
  export class CardsScreen extends BaseScreen {
    private cardsPerRow = 4;
    private rowsPerPage = 2;
    private onCardSelect?: (cardId: string) => void;
    private stateManager: UIStateManager<CardsState>;

    constructor(props: CardsScreenProps) {
      super(props);
      this.onCardSelect = props.onCardSelect;
      this.stateManager = new UIStateManager<CardsState>(
        this.ui.bindingManager,
        'cards',
        this.onRenderNeeded
      );
      // Initialize scrollOffset to 0
      this.stateManager.update({ scrollOffset: 0 });
    }

    /**
     * Create a single card slot using reactive card component
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
          onClick: (cardId: string) => this.handleCardClick(cardId),
          showDeckIndicator: true,
        }),
      });
    }

    /**
     * Create card grid with reactive bindings
     */
    private createCardGrid(): UINodeType {
      const cardsPerPage = this.cardsPerRow * this.rowsPerPage;

      return this.createContentArea([
        // Empty state
        ...(this.ui.UINode ? [this.ui.UINode.if(
          this.ui.bindingManager.derive([BindingType.PlayerData], (pd: PlayerData) => {
            const cards = pd?.cards?.collected || [];
            return cards.length === 0;
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

        // Card grid - 2 rows x 4 columns
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
                return this.createCardSlot(slotIndex, cardsPerPage, colIndex < this.cardsPerRow - 1);
              }),
            })
          ),
        }),
      ]);
    }

    /**
     * Create scroll buttons using utility (eliminates 50+ lines of code)
     */
    private createScrollButtons() {
      const cardsPerPage = this.cardsPerRow * this.rowsPerPage;

      const getTotalPages = () => {
        const playerData = this.ui.bindingManager.getSnapshot(BindingType.PlayerData);
        const cards = playerData?.cards?.collected || [];
        return Math.ceil(cards.length / cardsPerPage);
      };

      return ScrollButtonFactory.createSideMenuScrollButtons({
        ui: this.ui,
        stateManager: this.stateManager,
        getTotalPages,
        playSfx: this.playSfx,
        playerDataBinding: true, // Cards screen watches PlayerData for card count
        cardsPerPage, // Pass cardsPerPage so bindings can calculate total pages
      });
    }

    createUI(): UINodeType {
      const deckInfoText = this.ui.bindingManager.derive(
        [BindingType.PlayerData],
        (pd: PlayerData) => `${deckEmoji} ${pd?.cards?.deck?.length || 0}/30`
      );

      return this.createRootContainer([
        this.createFullScreenBackground(),
        this.createContainerBackground(),
        this.createCardGrid(),

        // Sidebar
        createSideMenu(this.ui, {
          title: 'Cards',
          customTextContent: [createTextRow(this.ui, deckInfoText, 0)],
          buttons: this.createScrollButtons(),
          bottomButton: this.getBackButton(),
          playSfx: this.playSfx,
        }),

        // Card detail popup
        ...(this.ui.UINode ? [this.ui.UINode.if(
          this.ui.bindingManager.derive([BindingType.UIState], (uiState: UIState) => {
            return uiState.cards?.selectedCardId !== null;
          }),
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
      ]);
    }

    /**
     * Handle card click - show popup
     */
    private handleCardClick(cardId: string): void {
      console.log('[CardsScreen] Card clicked, setting selectedCardId:', cardId);
      this.stateManager.update({ selectedCardId: cardId });

      // Verify it was set correctly
      const selectedId = this.stateManager.getValue('selectedCardId');
      console.log('[CardsScreen] selectedCardId after update:', selectedId);
    }

    /**
     * Close the popup
     */
    private closePopup(): void {
      this.stateManager.update({ selectedCardId: null });
    }

    /**
     * Create reactive popup buttons
     */
    private createPopupButtons(): PopupButton[] {
      const buttonLabel = this.ui.bindingManager.derive(
        [BindingType.UIState, BindingType.PlayerData],
        (uiState: UIState, pd: PlayerData) => {
          const cardId = uiState.cards?.selectedCardId;
          if (!cardId) return '';
          const deckCardIds: string[] = pd?.cards?.deck || [];
          return deckCardIds.includes(cardId) ? 'Remove' : 'Add';
        }
      );

      const buttonColor = this.ui.bindingManager.derive(
        [BindingType.UIState, BindingType.PlayerData],
        (uiState: UIState, pd: PlayerData) => {
          const cardId = uiState.cards?.selectedCardId;
          if (!cardId) return 'default' as ButtonColor;
          const deckCardIds: string[] = pd?.cards?.deck || [];
          const isInDeck = deckCardIds.includes(cardId);
          return (isInDeck ? 'red' : 'green') as ButtonColor;
        }
      );

      return [
        {
          label: buttonLabel,
          onClick: () => {
            const uiState = this.ui.bindingManager.getSnapshot(BindingType.UIState);
            const cardId = uiState.cards?.selectedCardId;
            console.log('[CardsScreen] Button clicked, selectedCardId:', cardId, 'onCardSelect:', !!this.onCardSelect);
            if (cardId && this.onCardSelect) {
              this.onCardSelect(cardId);
            } else {
              console.warn('[CardsScreen] Cannot add/remove card:', { cardId, hasCallback: !!this.onCardSelect });
            }
          },
          color: buttonColor,
        },
        {
          label: 'Close',
          onClick: () => this.closePopup(),
          color: 'default',
        },
      ];
    }
  }

  // ==================== bloombeasts\common\constants\upgrades.ts ====================

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

  // ==================== bloombeasts\screens\upgrade\UpgradeScreen.ts ====================

  /**
   * Upgrade Screen - Refactored using BaseScreen
   *
   * Reduced by eliminating constructor boilerplate and layout duplication
   */


  // UI constants
  const UPGRADE_CONTAINER_SIZE = 150;
  const UPGRADE_IMAGE_WIDTH = 142;
  const UPGRADE_IMAGE_HEIGHT = 120;
  const UPGRADE_IMAGE_OFFSET_TOP = 4;
  const UPGRADE_IMAGE_OFFSET_LEFT = 4;
  const UPGRADE_LEVEL_BOTTOM = 8;
  const UPGRADE_LEVEL_FONT_SIZE = 14;
  const UPGRADE_GRID_GAP = 40;

  export interface UpgradeScreenProps extends BaseScreenProps {
    onUpgrade?: (boostId: string) => void;
  }

  interface UpgradeState {
    selectedUpgradeId?: string | null;
  }

  export class UpgradeScreen extends BaseScreen {
    private onUpgrade?: (boostId: string) => void;
    private stateManager: UIStateManager<UpgradeState>;

    constructor(props: UpgradeScreenProps) {
      super(props);
      this.onUpgrade = props.onUpgrade;
      this.stateManager = new UIStateManager<UpgradeState>(
        this.ui.bindingManager,
        'upgrade',
        this.onRenderNeeded
      );
    }

    private createUpgradeItem(upgrade: UpgradeDefinition): UINodeType {
      return this.ui.Pressable({
        onClick: () => {
          this.stateManager.update({ selectedUpgradeId: upgrade.id });
        },
        style: {
          width: UPGRADE_CONTAINER_SIZE,
          height: UPGRADE_CONTAINER_SIZE,
          position: 'relative',
        },
        children: [
          this.ui.Image({
            source: this.ui.assetIdToImageSource?.('upgrade-container-card') || null,
            style: {
              position: 'absolute',
              width: UPGRADE_CONTAINER_SIZE,
              height: UPGRADE_CONTAINER_SIZE,
              top: 0,
              left: 0,
              opacity: 1.0,
            },
          }),
          this.ui.Image({
            source: this.ui.assetIdToImageSource?.(upgrade.assetId) || null,
            style: {
              position: 'absolute',
              width: UPGRADE_IMAGE_WIDTH,
              height: UPGRADE_IMAGE_HEIGHT,
              top: UPGRADE_IMAGE_OFFSET_TOP,
              left: UPGRADE_IMAGE_OFFSET_LEFT,
            },
          }),
          this.ui.Text({
            text: this.ui.bindingManager.playerDataBinding.binding.derive((pd: PlayerData) => {
              const level = pd?.boosts?.[upgrade.id] || 0;
              return `Level ${level}`;
            }),
            style: {
              position: 'absolute',
              bottom: UPGRADE_LEVEL_BOTTOM,
              left: 0,
              width: UPGRADE_CONTAINER_SIZE,
              fontSize: UPGRADE_LEVEL_FONT_SIZE,
              fontWeight: 'bold',
              color: COLORS.textPrimary,
              textAlign: 'center',
            },
          }),
        ],
      });
    }

    private createUpgradeGrid(): UINodeType {
      return this.createContentArea([
        this.ui.View({
          style: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: UPGRADE_GRID_GAP,
          },
          children: ALL_UPGRADES.map((upgrade) => this.createUpgradeItem(upgrade)),
        }),
      ]);
    }

    createUI(): UINodeType {
      return this.createRootContainer([
        this.createFullScreenBackground(),
        this.createContainerBackground(),
        this.createUpgradeGrid(),

        createSideMenu(this.ui, {
          title: 'Upgrades',
          bottomButton: this.getBackButton(),
          playSfx: this.playSfx,
        }),

        // Upgrade popup
        ...(this.ui.UINode ? [this.ui.UINode.if(
          this.ui.bindingManager.derive([BindingType.UIState], () => {
            return this.stateManager.getValue('selectedUpgradeId') !== null;
          }),
          createPopup({
            ui: this.ui,
            title: this.ui.bindingManager.derive([BindingType.UIState], () => {
              const upgradeId = this.stateManager.getValue('selectedUpgradeId');
              const upgrade = ALL_UPGRADES.find(u => u.id === upgradeId);
              return upgrade?.name || '';
            }),
            description: this.ui.bindingManager.derive([BindingType.UIState, BindingType.PlayerData], (uiState, pd: PlayerData) => {
              const upgradeId = this.stateManager.getValue('selectedUpgradeId');
              const upgrade = ALL_UPGRADES.find(u => u.id === upgradeId);
              if (!upgrade) return '';
              const currentLevel = pd?.boosts?.[upgrade.id] || 0;
              const cost = upgrade.costs[currentLevel] || 0;
              return `${upgrade.description}\n\nCurrent Level: ${currentLevel}\nCost: ${cost} coins`;
            }),
            buttons: [
              {
                label: 'Upgrade',
                onClick: () => {
                  const upgradeId = this.stateManager.getValue('selectedUpgradeId');
                  if (upgradeId && this.onUpgrade) {
                    this.onUpgrade(upgradeId);
                  }
                  this.stateManager.update({ selectedUpgradeId: null });
                },
                color: 'green',
              },
              {
                label: 'Cancel',
                onClick: () => {
                  this.stateManager.update({ selectedUpgradeId: null });
                },
                color: 'default',
              },
            ],
            playSfx: this.playSfx,
          })
        )] : []),
      ]);
    }
  }

  // ==================== bloombeasts\common\ui\screens\MissionRenderer.ts ====================

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

  // ==================== bloombeasts\screens\missions\MissionScreen.ts ====================

  /**
   * Mission Screen 
   */


  const CONTAINER_DIMENSIONS = { width: 950, height: 640 };
  const CONTAINER_POSITION: SimplePosition = { x: 103, y: 41 };

  // Mission grid constants
  const GRID_GAP_X = 12;
  const GRID_GAP_Y = 12;
  const GRID_START_X = 24;
  const GRID_START_Y = 24;

  export interface MissionScreenProps extends BaseScreenProps {
    onMissionSelect?: (missionId: string) => void;
  }

  interface MissionState {
    scrollOffset?: number;
  }

  export class MissionScreen extends BaseScreen {
    private missionsPerRow = 3;
    private rowsPerPage = 3;
    private onMissionSelect?: (missionId: string) => void;
    private stateManager: UIStateManager<MissionState>;

    constructor(props: MissionScreenProps) {
      super(props);
      this.onMissionSelect = props.onMissionSelect;
      this.stateManager = new UIStateManager<MissionState>(
        this.ui.bindingManager,
        'missions',
        this.onRenderNeeded
      );
      // Initialize scrollOffset to 0
      this.stateManager.update({ scrollOffset: 0 });
    }

    createUI(): UINodeType {
      return this.createRootContainer([
        this.createFullScreenBackground(),
        this.createMainContent(),
        this.createSideMenu(),
      ]);
    }

    private createMainContent(): UINodeType {
      return this.ui.View({
        style: {
          position: 'absolute',
          left: CONTAINER_POSITION.x,
          top: CONTAINER_POSITION.y,
          width: CONTAINER_DIMENSIONS.width,
          height: CONTAINER_DIMENSIONS.height,
        },
        children: [
          this.ui.Image({
            source: this.ui.assetIdToImageSource?.('cards-container') || null,
            style: {
              position: 'absolute',
              width: CONTAINER_DIMENSIONS.width,
              height: CONTAINER_DIMENSIONS.height,
              top: 0,
              left: 0,
            },
          }),
          this.createMissionGrid(),
        ],
      });
    }

    private createMissionSlot(slotIndex: number, missionsPerPage: number, row: number, col: number): UINodeType {
      const cardWidth = MISSION_DIMENSIONS.width;
      const cardHeight = MISSION_DIMENSIONS.height;
      const x = GRID_START_X + col * (cardWidth + GRID_GAP_X);
      const y = GRID_START_Y + row * (cardHeight + GRID_GAP_Y);

      return this.ui.View({
        style: {
          position: 'absolute',
          left: x,
          top: y,
        },
        children: createReactiveMissionComponent(this.ui, {
          slotIndex,
          missionsPerPage,
          onClick: (missionId: string) => this.onMissionSelect?.(missionId),
        }),
      });
    }

    private createMissionGrid(): UINodeType {
      const missionsPerPage = this.missionsPerRow * this.rowsPerPage;

      return this.ui.View({
        style: {
          position: 'relative',
          paddingLeft: 4,
          paddingTop: 4,
          width: CONTAINER_DIMENSIONS.width,
          height: CONTAINER_DIMENSIONS.height,
        },
        children: [
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

          // Empty state
          ...(this.ui.UINode ? [this.ui.UINode.if(
            this.ui.bindingManager.derive([BindingType.Missions], (missions: MissionDisplay[]) => {
              return missions.length === 0;
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
     * Create scroll buttons using utility (eliminates 50+ lines of code)
     */
    private createScrollButtons(): SideMenuButton[] {
      const missionsPerPage = this.missionsPerRow * this.rowsPerPage;

      const getTotalPages = () => {
        const missions = this.ui.bindingManager.getSnapshot(BindingType.Missions) || [];
        return Math.ceil(missions.length / missionsPerPage);
      };

      return ScrollButtonFactory.createSideMenuScrollButtons({
        ui: this.ui,
        stateManager: this.stateManager,
        getTotalPages,
        playSfx: this.playSfx,
        playerDataBinding: false, // Mission screen watches Missions binding
      });
    }

    private createSideMenu(): UINodeType {
      const completionText = this.ui.bindingManager.derive([BindingType.Missions], (missions: MissionDisplay[]) => {
        const completedCount = missions.filter((m: MissionDisplay) => m.isCompleted).length;
        return `${missionEmoji} ${completedCount}/${missions.length}`;
      });

      return createSideMenu(this.ui, {
        title: 'Missions',
        customTextContent: [createTextRow(this.ui, completionText, 0)],
        buttons: this.createScrollButtons(),
        bottomButton: this.getBackButton(),
        playSfx: this.playSfx,
      });
    }
  }

  // ==================== bloombeasts\common\utils\polyfills.ts ====================

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

  // Export as global Map replacement if needed
  export type MapPolyfill<K extends string | number, V> = SimpleMap<K, V>;

  // ==================== bloombeasts\common\engine\types\game.ts ====================

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
    battleState: BattlePhase;  // State-based battle flow
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

  // ==================== bloombeasts\common\engine\utils\fieldUtils.ts ====================

  /**
   * Field Utilities
   *
   * Helper functions for working with the battlefield and beast fields.
   * Eliminates common iteration patterns throughout the codebase.
   */


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
   * Find first empty slot in the field
   * @param field The field array
   * @returns Index of first empty slot, or -1 if none
   */
  export function findEmptySlot(field: (RuntimeBeast | null)[]): number {
    return field.findIndex((beast) => beast === null);
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

  // ==================== bloombeasts\common\engine\utils\combatHelpers.ts ====================

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

  // ==================== bloombeasts\common\engine\constants\battleConstants.ts ====================

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
   * Battle Event Thresholds
   */
  export const LOW_HEALTH_THRESHOLD_PERCENT = 10;

  // ==================== bloombeasts\screens\battle\ui\types.ts ====================

  /**
   * Shared types and constants for Battle Screen components
   */


  // Re-export dimensions from consolidated dimensions file

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
      buffThree: { x: 20, y: 336 },
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
      buffOne: { x: 1160, y: 440 },
      buffTwo: { x: 1160, y: 550 },
      buffThree: { x: 1160, y: 660 },
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
    showPlayedCard?: (card: Card, callback?: () => void) => void;
    onCardDetailSelected?: (card: Card) => void;
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
    showPlayedCard?: (card: Card, callback?: () => void) => void;
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

  // ==================== bloombeasts\screens\battle\ui\BattleBackground.ts ====================

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

  // ==================== bloombeasts\screens\battle\ui\BeastField.ts ====================

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

  // ==================== bloombeasts\screens\battle\ui\TrapZone.ts ====================

  /**
   * Trap zone rendering - 3 slots per player
   */


  export class TrapZone {
    private ui: BattleComponentWithCallbacks['ui'];
    private onCardDetailSelected?: (card: Card) => void;

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

  // ==================== bloombeasts\core\ColorPalette.ts ====================

  /**
   * Color Palette - Centralized color constants
   * Eliminates hardcoded color values throughout the codebase
   */

  export const COLOR_PALETTE = {
    /**
     * Player-related colors
     */
    player: {
      accent: '#4a8ec2',      // Player UI accent color
      primary: '#fff',        // Primary text/elements
    },

    /**
     * Opponent/danger colors
     */
    opponent: {
      danger: '#ff6b6b',      // Opponent/danger indicators
    },

    /**
     * Mission difficulty colors
     */
    difficulty: {
      tutorial: '#90EE90',    // Light green
      easy: '#87CEEB',        // Sky blue
      normal: '#FFD700',      // Gold
      hard: '#FF6347',        // Tomato red
      expert: '#8B008B',      // Dark magenta
      legendary: '#FF1493',   // Deep pink
    },

    /**
     * Card type colors
     */
    cardType: {
      habitat: '#4caf50',     // Habitat green
      buff: '#FFD700',        // Buff gold
      trap: '#ff6b6b',        // Trap red
      magic: '#9c27b0',       // Magic purple
    },

    /**
     * UI state colors
     */
    ui: {
      disabled: '#666',       // Disabled elements
      muted: '#888',          // Muted/inactive elements
      background: '#333',     // Dark background
      white: '#fff',          // White text
      default: '#FFFFFF',     // Default color
    },

    /**
     * Toggle/button state colors
     */
    toggle: {
      on: '#4CAF50',          // Toggle on (green)
      off: '#888',            // Toggle off (gray)
    },

    /**
     * Button colors
     */
    button: {
      green: '#4CAF50',
      red: '#f44336',
      default: '#666',
    },
  } as const;

  /**
   * Helper function to get difficulty color
   */
  export function getDifficultyColor(difficulty: string): string {
    const difficultyMap: Record<string, string> = {
      'tutorial': COLOR_PALETTE.difficulty.tutorial,
      'easy': COLOR_PALETTE.difficulty.easy,
      'normal': COLOR_PALETTE.difficulty.normal,
      'hard': COLOR_PALETTE.difficulty.hard,
      'expert': COLOR_PALETTE.difficulty.expert,
      'legendary': COLOR_PALETTE.difficulty.legendary,
    };
    return difficultyMap[difficulty] || COLOR_PALETTE.ui.default;
  }

  // ==================== bloombeasts\screens\battle\ui\BuffZone.ts ====================

  /**
   * Buff zone rendering - 3 slots per player
   */


  export class BuffZone {
    private ui: BattleComponentWithCallbacks['ui'];
    private onCardDetailSelected?: (card: Card) => void;

    constructor(props: BattleComponentWithCallbacks) {
      this.ui = props.ui;
      this.onCardDetailSelected = props.onCardDetailSelected;
    }

    /**
     * Create buff zone for a player - REACTIVE
     * Creates 3 slots, bindings determine what's shown
     */
    createBuffZone(player: 'player' | 'opponent'): UINodeType[] {
      const positions = player === 'player'
        ? battleBoardAssetPositions.playerTwo
        : battleBoardAssetPositions.playerOne;
      const buffSlots = [positions.buffOne, positions.buffTwo, positions.buffThree];

      // Create 3 buff slots
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
                      const baseCardId = extractBaseCardId(buff.id) || buff.name.toLowerCase().replace(/\s+/g, '-');
                      return this.ui.assetIdToImageSource?.(baseCardId);
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
                    borderColor: COLOR_PALETTE.cardType.buff,
                    borderRadius: 8,
                    shadowColor: COLOR_PALETTE.cardType.buff,
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

  // ==================== bloombeasts\screens\battle\ui\HabitatZone.ts ====================

  /**
   * Habitat zone rendering (center of board)
   */


  export class HabitatZone {
    private ui: BattleComponentWithCallbacks['ui'];
    private onCardDetailSelected?: (card: Card) => void;

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
                    const baseCardId = extractBaseCardId(habitat.id) || habitat.name.toLowerCase().replace(/\s+/g, '-');
                    return this.ui.assetIdToImageSource?.(baseCardId);
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
                  borderColor: COLOR_PALETTE.cardType.habitat,
                  borderRadius: 8,
                  shadowColor: COLOR_PALETTE.cardType.habitat,
                  shadowRadius: 10,
                },
              }),
            ],
          }),
        ],
      });
    }
  }

  // ==================== bloombeasts\screens\battle\ui\PlayerHand.ts ====================

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

  // ==================== bloombeasts\screens\battle\ui\InfoDisplays.ts ====================

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

  // ==================== bloombeasts\screens\battle\ui\BattleSideMenu.ts ====================

  /**
   * Battle side menu - Turn counter, end turn button, forfeit
   */


  // Side menu container dimensions
  const SIDE_MENU_WIDTH = 225;
  const SIDE_MENU_HEIGHT = 497;

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
     * Helper function to check if it's the player's turn
     */
    private isPlayerTurn(state: BattleDisplay | null): boolean {
      return state?.turnPlayer === 'player';
    }

    /**
     * Helper function to check if player has attackable beasts
     */
    private hasAttackableBeasts(state: BattleDisplay | null): boolean {
      if (!this.isPlayerTurn(state)) return false;

      if (state!.playerField && Array.isArray(state!.playerField)) {
        for (const beast of state!.playerField) {
          if (beast && canAttack(beast)) {
            return true;
          }
        }
      }

      return false;
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
          width: SIDE_MENU_WIDTH,
          height: SIDE_MENU_HEIGHT,
        },
        children: [
          this.ui.Image({
            source: this.ui.assetIdToImageSource?.('container-side-menu') || null,
            style: {
              position: 'absolute',
              width: SIDE_MENU_WIDTH,
              height: SIDE_MENU_HEIGHT,
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
              console.log('[BattleSideMenu] Attack button clicked!');
              const currentIsPlayerTurn = this.getIsPlayerTurn();
              const hasAttackable = this.getHasAttackableBeasts();
              console.log('[BattleSideMenu] currentIsPlayerTurn:', currentIsPlayerTurn, 'hasAttackable:', hasAttackable);

              if (currentIsPlayerTurn && hasAttackable) {
                console.log('[BattleSideMenu] Calling onActionAsync with auto-attack-all');
                // Attack and wait for it to complete, then auto end turn
                await this.onActionAsync?.('auto-attack-all');
                this.onStopTurnTimer?.();
                this.onAction?.('end-turn');
              } else {
                console.log('[BattleSideMenu] Attack button clicked but conditions not met');
              }
            },
            // Use complete bindings (avoids .derive() on derived bindings)
            imageSource: this.ui.assetIdToImageSource?.('red-button') || null,
            opacity: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) => {
              return this.hasAttackableBeasts(state) ? 1.0 : 0.5;
            }),
            textColor: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) => {
              return this.hasAttackableBeasts(state) ? COLORS.textPrimary : '#888';
            }),
            disabled: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) => {
              return !this.hasAttackableBeasts(state);
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
              this.isPlayerTurn(state) ? 'Skip' : 'Enemy Turn'
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
              const assetId = this.isPlayerTurn(state) ? 'green-button' : 'standard-button';
              return this.ui.assetIdToImageSource?.(assetId) || null;
            }),
            opacity: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) =>
              this.isPlayerTurn(state) ? 1.0 : 0.5
            ),
            textColor: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) =>
              this.isPlayerTurn(state) ? COLORS.textPrimary : '#888'
            ),
            disabled: this.ui.bindingManager.derive([BindingType.BattleDisplay], (state: BattleDisplay) =>
              !this.isPlayerTurn(state)
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

  // ==================== bloombeasts\screens\battle\ui\index.ts ====================

  /**
   * Battle screen components - Modular, reactive battle UI
   */

  // Export components

  // Export constants from types

  // Note: Prop interfaces (BattleComponentProps, etc.) are exported from types.ts
  // but not re-exported here to avoid namespace bundling issues.
  // Import them directly from './types' if needed externally.

  // ==================== bloombeasts\screens\battle\BattleTimerManager.ts ====================

  /**
   * Battle Timer Manager - Handles chess-clock style turn timers
   *
   * Extracted from BattleScreen to reduce complexity and consolidate timer logic
   */


  export interface BattleTimerCallbacks {
    onPlayerTimeout: () => void;
    onOpponentTimeout: () => void;
    onTimerTick?: (playerTime: number, opponentTime: number) => void;
  }

  export class BattleTimerManager {
    private timerInterval: number | null = null;
    private playerTimerValue = TURN_TIMER_SECONDS;
    private opponentTimerValue = TURN_TIMER_SECONDS;
    private isPlayerTurnValue = false;

    constructor(
      private async: AsyncMethods,
      private callbacks: BattleTimerCallbacks
    ) {}

    /**
     * Start the turn timer (chess-clock style)
     */
    start(isPlayerTurn: boolean): void {
      // Don't start if already running
      if (this.timerInterval !== null) {
        return;
      }

      this.isPlayerTurnValue = isPlayerTurn;

      this.timerInterval = this.async.setInterval(() => {
        // Count down the current player's timer
        if (this.isPlayerTurnValue) {
          this.playerTimerValue--;
          this.callbacks.onTimerTick?.(this.playerTimerValue, this.opponentTimerValue);

          if (this.playerTimerValue <= 0) {
            this.stop();
            this.callbacks.onPlayerTimeout();
          }
        } else {
          this.opponentTimerValue--;
          this.callbacks.onTimerTick?.(this.playerTimerValue, this.opponentTimerValue);

          if (this.opponentTimerValue <= 0) {
            this.stop();
            this.callbacks.onOpponentTimeout();
          }
        }
      }, 1000);
    }

    /**
     * Stop the turn timer
     */
    stop(): void {
      if (this.timerInterval) {
        this.async.clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    }

    /**
     * Restart the timer (called on turn changes)
     */
    restart(isPlayerTurn: boolean): void {
      this.stop();
      this.isPlayerTurnValue = isPlayerTurn;
      this.start(isPlayerTurn);
    }

    /**
     * Reset timer values to initial state
     */
    reset(): void {
      this.stop();
      this.playerTimerValue = TURN_TIMER_SECONDS;
      this.opponentTimerValue = TURN_TIMER_SECONDS;
      this.isPlayerTurnValue = false;
    }

    /**
     * Get current timer values
     */
    getTimerValues(): { playerTimer: number; opponentTimer: number } {
      return {
        playerTimer: this.playerTimerValue,
        opponentTimer: this.opponentTimerValue,
      };
    }

    /**
     * Check if timer is currently running
     */
    isRunning(): boolean {
      return this.timerInterval !== null;
    }
  }

  // ==================== bloombeasts\screens\battle\CardPopupManager.ts ====================

  /**
   * Card Popup Manager - Handles all card popup UI logic for BattleScreen
   *
   * Extracted from BattleScreen to reduce complexity and consolidate popup logic
   */


  export interface CardPopupCallbacks {
    onCardDetailSelected: (card: any, cardType?: string) => void;
    onUpdateUIState: (updates: any) => void;
    onShowCardDetail?: (card: any, durationMs: number, callback?: () => void) => void;
    onAction?: (action: string) => void;
  }

  export class CardPopupManager {
    // Temporary card display (for showing played cards)
    private playedCardDisplay: any | null = null;
    private playedCardTimeout: number | null = null;

    constructor(
      private ui: UIMethodMappings,
      private async: AsyncMethods,
      private callbacks: CardPopupCallbacks
    ) {}

    /**
     * Handle card detail selection from trap/buff/habitat zones
     */
    handleCardDetailSelected(card: any, cardType?: string): void {
      const cardWithType = cardType ? { ...card, type: cardType } : card;
      this.callbacks.onUpdateUIState({ selectedCardDetail: cardWithType });
    }

    /**
     * Create card popup layer (from battleDisplay.cardPopup) - conditionally visible
     */
    createCardPopupLayer(): UINodeType {
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
              text: 'Card Popup',
              style: { color: '#fff', fontSize: 20 }
            }),
          })
        );
      }

      // Fallback: empty View (popup won't work)
      return this.ui.View({ style: { display: 'none' } });
    }

    /**
     * Create selected card detail popup layer (from UIState.battle.selectedCardDetail) - conditionally visible
     */
    createSelectedCardDetailLayer(): UINodeType {
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
                  this.callbacks.onUpdateUIState({ selectedCardDetail: null });
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
     * Create battle card display with reactive bindings for selectedCardDetail
     * Uses the shared reactive card component
     */
    private createBattleCardDisplay(): UINodeType {
      return createReactiveCardComponent(this.ui, {
        mode: 'battleSelectedCard',
        showDeckIndicator: false,
      });
    }

    /**
     * Create card popup overlay (legacy/unused)
     */
    createCardPopup(popup: any): UINodeType {
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
            onButtonClick: () => this.callbacks.onAction?.('btn-card-close'),
          }),
        ],
      });
    }

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
        }
      });
    }

    /**
     * Show a played card popup for 2 seconds, then execute callback
     */
    showPlayedCard(card: any, callback?: () => void): void {
      // Use the onShowCardDetail callback if available
      if (this.callbacks.onShowCardDetail) {
        this.callbacks.onShowCardDetail(card, 2000, callback);
      } else {
        Logger.warn('[CardPopupManager] onShowCardDetail not defined, executing callback immediately');
        callback?.();
      }
    }

    /**
     * Cleanup resources
     */
    cleanup(): void {
      // Clear played card timeout
      if (this.playedCardTimeout) {
        this.async.clearTimeout(this.playedCardTimeout);
        this.playedCardTimeout = null;
      }
      this.playedCardDisplay = null;
    }
  }

  // ==================== bloombeasts\screens\battle\BattleScreen.ts ====================

  /**
   * Unified Battle Screen Component
   * Works on both Horizon and Web platforms
   * Exactly mimics the UI from deployments/web/src/screens/battleScreen.ts
   */


  // Import modular battle components

  // BattleUIState interface for local UI state tracking
  interface LocalBattleUIState {
    battle: {
      showHand: boolean;
      handScrollOffset: number;
      playerTimer: number;
      opponentTimer: number;
      selectedCardDetail: Card | null;
    };
  }

  export interface BattleScreenProps {
    ui: UIMethodMappings;
    async: AsyncMethods;
    onAction?: (action: string) => void;
    onNavigate?: (screen: string) => void;
    onRenderNeeded?: () => void;
    onShowCardDetail?: (card: Card, durationMs: number, callback?: () => void) => void;
    playSfx?: (sfxId: string) => void;
  }

  /**
   * Unified Battle Screen that exactly replicates web deployment's battle UI
   */
  export class BattleScreen {
    // UI methods (injected)
    private ui: UIMethodMappings;
    private async: AsyncMethods;

    // Manager instances
    private timerManager: BattleTimerManager;
    private cardPopupManager: CardPopupManager;

    // Track binding values separately (as per Horizon docs - no .get() method)
    private isPlayerTurnValue = false;
    private battleDisplayValue: BattleDisplay | null = null;
    private hasAttackableBeasts = false;

    // Track current UIState value for updates
    private currentUIState: LocalBattleUIState = {
      battle: {
        showHand: true,
        handScrollOffset: 0,
        playerTimer: TURN_TIMER_SECONDS,
        opponentTimer: TURN_TIMER_SECONDS,
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
    private onShowCardDetail?: (card: Card, durationMs: number, callback?: () => void) => void;
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

      // Initialize managers
      this.timerManager = new BattleTimerManager(this.async, {
        onPlayerTimeout: () => this.onAction?.('timeout-player'),
        onOpponentTimeout: () => this.onAction?.('timeout-opponent'),
        onTimerTick: (playerTimer, opponentTimer) => {
          this.updateUIState({ playerTimer, opponentTimer });
        },
      });

      this.cardPopupManager = new CardPopupManager(this.ui, this.async, {
        onCardDetailSelected: (card, cardType) => this.handleCardDetailSelected(card, cardType),
        onUpdateUIState: (updates) => this.updateUIState(updates),
        onShowCardDetail: props.onShowCardDetail,
        onAction: props.onAction,
      });

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

        // Check if player has any beasts that can attack
        this.hasAttackableBeasts = state?.playerField ? hasAttackableBeasts(state.playerField) : false;

        // Start/restart timer based on turn changes or if timer not running
        if (this.isPlayerTurnValue !== newIsPlayerTurn) {
          this.isPlayerTurnValue = newIsPlayerTurn;
          // Restart timer to ensure it's tracking the correct player
          this.timerManager.restart(newIsPlayerTurn);
        } else if (state && !this.timerManager.isRunning()) {
          // Start timer if it's not running but we have a valid battle state
          this.timerManager.start(newIsPlayerTurn);
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
        showPlayedCard: this.cardPopupManager.showPlayedCard.bind(this.cardPopupManager),
      });

      this.trapZoneComponent = new TrapZone({
        ui: this.ui,
        onCardDetailSelected: (card) => this.cardPopupManager.handleCardDetailSelected(card),
      });

      this.buffZoneComponent = new BuffZone({
        ui: this.ui,
        onCardDetailSelected: (card) => this.cardPopupManager.handleCardDetailSelected(card),
      });

      this.habitatZoneComponent = new HabitatZone({
        ui: this.ui,
        onCardDetailSelected: (card) => this.cardPopupManager.handleCardDetailSelected(card, 'Habitat'),
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
        showPlayedCard: this.cardPopupManager.showPlayedCard.bind(this.cardPopupManager),
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
        onStopTurnTimer: () => this.timerManager.stop(),
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
     * Handle card detail selection from trap/buff/habitat zones
     * Delegates to CardPopupManager
     */
    private handleCardDetailSelected(card: any, cardType?: string): void {
      this.cardPopupManager.handleCardDetailSelected(card, cardType);
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
                // Layer 2: Playboard overlay (future enhancement)
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
                this.cardPopupManager.createCardPopupLayer(),

                // Layer 7.25: Selected card detail popup (from clicking buff/trap cards) - conditionally visible
                this.cardPopupManager.createSelectedCardDetailLayer(),

                // Layer 8: Attack animation overlays
                this.createAttackAnimations(),
            ],
          }),

          // Note: Forfeit popup is handled at the root level in BloomBeastsGame
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
    public cleanup(): void {
      // Reset managers
      this.timerManager.reset();
      this.cardPopupManager.cleanup();

      // Update UIState with reset values
      const { playerTimer, opponentTimer } = this.timerManager.getTimerValues();
      this.updateUIState({
        playerTimer,
        opponentTimer,
        showHand: true,
        handScrollOffset: 0,
        selectedCardDetail: null,
      });

      // Trigger final re-render
      this.onRenderNeeded?.();
    }
  }

  // ==================== bloombeasts\screens\settings\SettingsScreen.ts ====================

  /**
   * Settings Screen - Refactored using BaseScreen
   *
   * Reduced by eliminating constructor boilerplate and layout duplication
   */


  // Settings constants
  const VOLUME_DEFAULT = 50;
  const VOLUME_MIN = 0;
  const VOLUME_MAX = 100;
  const VOLUME_STEP = 10;

  // UI constants
  const BUTTON_SIZE = 40;
  const TOGGLE_WIDTH = 80;
  const TOGGLE_HEIGHT = 40;
  const CONTROL_MARGIN_BOTTOM = 30;
  const BUTTON_MARGIN = 10;

  // Color constants (for controls not in COLORS)
  const CONTROL_BUTTON_BG = '#333';
  const TOGGLE_ON_COLOR = '#4CAF50';
  const TOGGLE_OFF_COLOR = '#888';

  /**
   * Settings data structure
   */
  export interface Settings {
    musicVolume?: number;
    sfxVolume?: number;
    musicEnabled?: boolean;
    sfxEnabled?: boolean;
  }

  export interface SettingsScreenProps extends BaseScreenProps {
    onSettingChange?: (settingId: string, value: number | boolean) => void;
  }

  export class SettingsScreen extends BaseScreen {
    private settingsValue: Settings = {};
    private onSettingChange?: (settingId: string, value: number | boolean) => void;

    constructor(props: SettingsScreenProps) {
      super(props);
      this.onSettingChange = props.onSettingChange;
    }

    createUI(): UINodeType {
      return this.createRootContainer([
        this.createFullScreenBackground(),
        this.createContainerBackground(),

        // Settings controls
        this.createContentArea([
          this.createVolumeControl('Music Volume', 'musicVolume', 'musicVolume'),
          this.createToggleControl('Music', 'musicEnabled', 'musicEnabled'),
          this.createVolumeControl('SFX Volume', 'sfxVolume', 'sfxVolume'),
          this.createToggleControl('Sound Effects', 'sfxEnabled', 'sfxEnabled'),
        ], { left: 70, top: 70, width: 920, height: 580 }),

        // Side menu
        createSideMenu(this.ui, {
          title: 'Settings',
          bottomButton: this.getBackButton(),
          playSfx: this.playSfx,
        }),
      ]);
    }

    private createVolumeControl(
      label: string,
      settingKey: 'musicVolume' | 'sfxVolume',
      settingId: string
    ): UINodeType {
      return this.ui.View({
        style: { marginBottom: CONTROL_MARGIN_BOTTOM },
        children: [
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
              this.ui.View({
                style: {
                  flexDirection: 'row',
                  alignItems: 'center',
                },
                children: [
                  this.ui.Pressable({
                    onClick: () => {
                      const currentSettings = this.settingsValue;
                      const currentValue = currentSettings[settingKey] || VOLUME_DEFAULT;
                      const newValue = Math.max(VOLUME_MIN, currentValue - VOLUME_STEP);
                      this.settingsValue[settingKey] = newValue;
                      this.onSettingChange?.(settingId, newValue);
                    },
                    style: {
                      width: BUTTON_SIZE,
                      height: BUTTON_SIZE,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: CONTROL_BUTTON_BG,
                      borderRadius: 5,
                      marginRight: BUTTON_MARGIN,
                    },
                    children: this.ui.Text({
                      text: '-',
                      style: {
                        fontSize: 24,
                        color: '#fff',
                        fontWeight: 'bold',
                      },
                    }),
                  }),
                  this.ui.Text({
                    text: this.ui.bindingManager.derive([BindingType.PlayerData], (pd) => {
                      return String(pd?.settings?.[settingKey] || VOLUME_DEFAULT);
                    }),
                    style: {
                      fontSize: DIMENSIONS.fontSize.lg,
                      color: COLORS.textPrimary,
                      width: 40,
                      textAlign: 'center',
                    },
                  }),
                  this.ui.Pressable({
                    onClick: () => {
                      const currentSettings = this.settingsValue;
                      const currentValue = currentSettings[settingKey] || VOLUME_DEFAULT;
                      const newValue = Math.min(VOLUME_MAX, currentValue + VOLUME_STEP);
                      this.settingsValue[settingKey] = newValue;
                      this.onSettingChange?.(settingId, newValue);
                    },
                    style: {
                      width: BUTTON_SIZE,
                      height: BUTTON_SIZE,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: CONTROL_BUTTON_BG,
                      borderRadius: 5,
                      marginLeft: BUTTON_MARGIN,
                    },
                    children: this.ui.Text({
                      text: '+',
                      style: {
                        fontSize: 24,
                        color: '#fff',
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

    private createToggleControl(
      label: string,
      settingKey: 'musicEnabled' | 'sfxEnabled',
      settingId: string
    ): UINodeType {
      return this.ui.View({
        style: { marginBottom: CONTROL_MARGIN_BOTTOM },
        children: [
          this.ui.View({
            style: {
              flexDirection: 'row',
              justifyContent: 'space-between',
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
              this.ui.Pressable({
                onClick: () => {
                  const currentSettings = this.settingsValue;
                  const newValue = !(currentSettings[settingKey] ?? true);
                  this.settingsValue[settingKey] = newValue;
                  this.onSettingChange?.(settingId, newValue);
                },
                style: {
                  width: TOGGLE_WIDTH,
                  height: TOGGLE_HEIGHT,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: this.ui.bindingManager.derive([BindingType.PlayerData], (pd) => {
                    return (pd?.settings?.[settingKey] ?? true) ? TOGGLE_ON_COLOR : TOGGLE_OFF_COLOR;
                  }),
                  borderRadius: 20,
                },
                children: this.ui.Text({
                  text: this.ui.bindingManager.derive([BindingType.PlayerData], (pd) => {
                    return (pd?.settings?.[settingKey] ?? true) ? 'ON' : 'OFF';
                  }),
                  style: {
                    fontSize: DIMENSIONS.fontSize.md,
                    color: '#fff',
                    fontWeight: 'bold',
                  },
                }),
              }),
            ],
          }),
        ],
      });
    }
  }

  // ==================== bloombeasts\screens\leaderboard\LeaderboardScreen.ts ====================

  /**
   * Leaderboard Screen
   */


  export interface LeaderboardEntry {
    playerName: string;
    score: number;
    level?: number;
  }

  export interface LeaderboardData {
    topExperience: LeaderboardEntry[];
    fastestCluckNorris: LeaderboardEntry[];
  }

  export type LeaderboardScreenProps = BaseScreenProps;

  export class LeaderboardScreen extends BaseScreen {
    constructor(props: LeaderboardScreenProps) {
      super(props);
    }

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
            const scoreText = leaderboardType === 'speed'
              ? this.formatTime(entry.score)
              : entry.level ? `Lv${entry.level} ${entry.score}XP` : `${entry.score}XP`;
            lines.push(`${rankEmoji} ${entry.playerName} - ${scoreText}`);
          } else {
            lines.push(`${rankEmoji} ---`);
          }
        }
        return lines.join('\n');
      });
    }

    private formatTime(seconds: number): string {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

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
          this.ui.View({
            style: {
              width: panelWidth,
              height: 50,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
            },
            children: this.ui.Text({
              text: title,
              style: {
                fontSize: DIMENSIONS.fontSize.xl,
                fontWeight: 'bold',
                color: COLORS.primary,
              },
            }),
          }),
          this.ui.View({
            style: {
              position: 'absolute',
              top: 70,
              left: 25,
              width: panelWidth - 50,
              height: panelHeight - 80,
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
      return this.createRootContainer([
        this.createFullScreenBackground(),
        this.createContainerBackground(),

        // Two leaderboard panels
        this.createLeaderboardPanel('Top Experience', 'experience', 70),
        this.createLeaderboardPanel('Fastest Cluck Norris', 'speed', 540),

        createSideMenu(this.ui, {
          title: 'Leaderboard',
          bottomButton: this.getBackButton(),
          playSfx: this.playSfx,
        }),
      ]);
    }
  }

  // ==================== bloombeasts\types\ui\UIBindings.ts ====================

  /**
   * Binding type definitions
   *
   * Platform-agnostic reactive data binding interfaces.
   * Each platform provides its own implementation.
   */

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

  // ==================== bloombeasts\types\ui\index.ts ====================

  /**
   * UI types barrel export
   */

  // ==================== bloombeasts\types\game\index.ts ====================

  /**
   * Game types barrel export
   */

  // ==================== bloombeasts\types\platform\IStorageProvider.ts ====================

  /**
   * Storage Provider Interface
   *
   * Handles persistent data storage and retrieval.
   * Platform must implement these methods to support save/load functionality.
   */


  /**
   * Storage provider for persisting player data
   *
   * Examples:
   * - Web: localStorage
   * - Horizon: Persistent Variables API
   * - Native: File system or database
   */
  export interface IStorageProvider {
    /**
     * Save player data to persistent storage
     *
     * @param data - Player data to persist
     *
     * @example Web
     * ```ts
     * setPlayerData: (data) => localStorage.setItem('playerData', JSON.stringify(data))
     * ```
     *
     * @example Horizon
     * ```ts
     * setPlayerData: (data) => persistentVar.set(data)
     * ```
     */
    setPlayerData: (data: PlayerData) => void;

    /**
     * Load player data from persistent storage
     *
     * Platform must ensure valid PlayerData is returned (create default if none exists)
     *
     * @returns Player data or null if not found
     *
     * @example Web
     * ```ts
     * getPlayerData: () => JSON.parse(localStorage.getItem('playerData') || 'null')
     * ```
     *
     * @example Horizon
     * ```ts
     * getPlayerData: () => persistentVar.get()
     * ```
     */
    getPlayerData: () => PlayerData | null;
  }

  // ==================== bloombeasts\types\platform\IAssetProvider.ts ====================

  /**
   * Asset Provider Interface
   *
   * Handles asset loading and management.
   * Platform must implement these methods to provide game assets.
   */

  /**
   * Asset provider for loading images, sounds, and other resources
   *
   * Examples:
   * - Web: Returns file paths as strings
   * - Horizon: Returns ImageSource objects
   */
  export interface IAssetProvider {
    /**
     * Get an image asset by ID
     *
     * Platform queries AssetCatalogManager and returns the asset in platform format
     *
     * @param assetId - Unique identifier for the asset
     * @returns Platform-specific asset representation
     *
     * @example Web
     * ```ts
     * getImageAsset: (assetId) => {
     *   const catalog = catalogManager.getAsset(assetId);
     *   return catalog.webPath; // '/assets/cards/fire/beast.png'
     * }
     * ```
     *
     * @example Horizon
     * ```ts
     * getImageAsset: (assetId) => {
     *   const catalog = catalogManager.getAsset(assetId);
     *   return ImageSource.fromTextureAsset(new hz.Asset(BigInt(catalog.horizonAssetId)));
     * }
     * ```
     */
    getImageAsset: (assetId: string) => any;

    /**
     * Asset catalog manager instance
     *
     * Provides access to all game asset metadata and card definitions.
     * Platform should initialize this with the appropriate catalog data.
     */
    catalogManager: any; // AssetCatalogManager instance
  }

  // ==================== bloombeasts\types\platform\IUIProvider.ts ====================

  /**
   * UI Provider Interface
   *
   * Handles UI rendering and async operations.
   * Platform must implement these methods to support the UI system.
   */


  /**
   * UI provider for rendering and async operations
   *
   * Examples:
   * - Web: DOM-based rendering
   * - Horizon: Component update system
   */
  export interface IUIProvider {
    /**
     * Get platform-specific UI method implementations
     *
     * @returns Platform-specific UI component factory
     *
     * @example Web
     * ```ts
     * getUIMethodMappings: () => ({
     *   View: webViewComponent,
     *   Text: webTextComponent,
     *   Image: webImageComponent,
     *   Pressable: webPressableComponent,
     *   bindingManager: webBindingManager
     * })
     * ```
     *
     * @example Horizon
     * ```ts
     * getUIMethodMappings: () => ({
     *   View: hz.View,
     *   Text: hz.Text,
     *   Image: hz.Image,
     *   Pressable: hz.Pressable,
     *   bindingManager: horizonBindingManager
     * })
     * ```
     */
    getUIMethodMappings: () => UIMethodMappings;

    /**
     * Platform-specific async methods
     *
     * Provides setTimeout, setInterval, etc. for the platform
     *
     * @example Web
     * ```ts
     * async: {
     *   setTimeout: window.setTimeout.bind(window),
     *   setInterval: window.setInterval.bind(window),
     *   clearTimeout: window.clearTimeout.bind(window),
     *   clearInterval: window.clearInterval.bind(window)
     * }
     * ```
     *
     * @example Horizon
     * ```ts
     * async: component.async
     * ```
     */
    async: AsyncMethods;

    /**
     * Render the UI tree
     *
     * Called whenever the UI needs to be updated.
     * Platform should update its rendering system with the new UI tree.
     *
     * @param uiNode - The root UI node to render
     *
     * @example Web
     * ```ts
     * render: (uiNode) => renderer.render(uiNode)
     * ```
     *
     * @example Horizon
     * ```ts
     * render: (uiNode) => component.update(uiNode)
     * ```
     */
    render: (uiNode: UINode) => void;
  }

  // ==================== bloombeasts\types\platform\IAudioProvider.ts ====================

  /**
   * Audio Provider Interface
   *
   * Handles audio playback and settings.
   * Platform can optionally implement these methods to support sound/music.
   */

  /**
   * Audio provider for sound effects and music
   *
   * All methods are optional - platform can choose which audio features to support.
   *
   * Examples:
   * - Web: HTML5 Audio API
   * - Horizon: Horizon audio system
   * - Headless: No implementation (silent mode)
   */
  export interface IAudioProvider {
    /**
     * Play a sound effect or music track
     *
     * @param assetId - Sound asset identifier
     * @param loop - Whether to loop the sound
     * @param volume - Volume level (0-100)
     *
     * @example Web
     * ```ts
     * playSound: (assetId, loop, volume) => {
     *   const audio = new Audio(getSoundPath(assetId));
     *   audio.loop = loop;
     *   audio.volume = volume / 100;
     *   audio.play();
     * }
     * ```
     *
     * @example Horizon
     * ```ts
     * playSound: (assetId, loop, volume) => {
     *   world.playSound(soundAssets[assetId], { loop, volume: volume / 100 });
     * }
     * ```
     */
    playSound?: (assetId: string, loop: boolean, volume: number) => void;

    /**
     * Stop a playing sound
     *
     * @param assetId - Optional sound to stop (if omitted, stops all sounds)
     *
     * @example
     * ```ts
     * stopSound: (assetId) => {
     *   if (assetId) {
     *     audioMap.get(assetId)?.pause();
     *   } else {
     *     audioMap.forEach(audio => audio.pause());
     *   }
     * }
     * ```
     */
    stopSound?: (assetId?: string) => void;

    /**
     * Set music volume level
     *
     * @param volume - Volume level (0-100)
     *
     * @example
     * ```ts
     * setMusicVolume: (volume) => {
     *   musicTracks.forEach(track => track.volume = volume / 100);
     * }
     * ```
     */
    setMusicVolume?: (volume: number) => void;

    /**
     * Set sound effects volume level
     *
     * @param volume - Volume level (0-100)
     *
     * @example
     * ```ts
     * setSfxVolume: (volume) => {
     *   sfxTracks.forEach(sfx => sfx.volume = volume / 100);
     * }
     * ```
     */
    setSfxVolume?: (volume: number) => void;

    /**
     * Enable or disable music playback
     *
     * @param enabled - Whether music should play
     *
     * @example
     * ```ts
     * setMusicEnabled: (enabled) => {
     *   if (enabled) resumeMusic();
     *   else pauseMusic();
     * }
     * ```
     */
    setMusicEnabled?: (enabled: boolean) => void;

    /**
     * Enable or disable sound effects playback
     *
     * @param enabled - Whether sound effects should play
     *
     * @example
     * ```ts
     * setSfxEnabled: (enabled) => {
     *   sfxEnabled = enabled;
     * }
     * ```
     */
    setSfxEnabled?: (enabled: boolean) => void;
  }

  // ==================== bloombeasts\types\platform\IWorldProvider.ts ====================

  /**
   * World Provider Interface
   *
   * Handles multiplayer/world features like variables and network events.
   * Platform can optionally implement these methods to support multiplayer.
   */

  /**
   * World provider for multiplayer features
   *
   * All methods are optional - platform can choose which world features to support.
   *
   * Examples:
   * - Horizon: World variables and network events
   * - Web: Mock implementation or server-based
   * - Single-player: No implementation
   */
  export interface IWorldProvider {
    /**
     * Get a world variable value
     *
     * World variables are shared across all players in the world.
     * Useful for leaderboards, global state, etc.
     *
     * @param variableGroup - Variable group name
     * @param variableName - Variable name within group
     * @returns The variable value (any type)
     *
     * @example Horizon
     * ```ts
     * getWorldVariable: (group, name) => world.getVariable(group, name)
     * ```
     *
     * @example Web (Mock)
     * ```ts
     * getWorldVariable: (group, name) => mockWorldData[group]?.[name]
     * ```
     */
    getWorldVariable?: (variableGroup: string, variableName: string) => any;

    /**
     * Set a world variable value
     *
     * Updates a world variable that's shared across all players.
     *
     * @param variableGroup - Variable group name
     * @param variableName - Variable name within group
     * @param value - New value to set
     *
     * @example Horizon
     * ```ts
     * setWorldVariable: (group, name, value) => world.setVariable(group, name, value)
     * ```
     *
     * @example Web (Mock)
     * ```ts
     * setWorldVariable: (group, name, value) => {
     *   mockWorldData[group] = mockWorldData[group] || {};
     *   mockWorldData[group][name] = value;
     * }
     * ```
     */
    setWorldVariable?: (variableGroup: string, variableName: string, value: any) => void;

    /**
     * Send a network event to server/other players
     *
     * Triggers a network event that can be received by server or other clients.
     * Useful for multiplayer actions, leaderboard updates, etc.
     *
     * @param eventName - Name of the event
     * @param data - Event payload data
     *
     * @example Horizon
     * ```ts
     * sendNetworkEvent: (eventName, data) => world.sendNetworkEvent(eventName, data)
     * ```
     *
     * @example Web (Mock)
     * ```ts
     * sendNetworkEvent: (eventName, data) => {
     *   console.log('Network event:', eventName, data);
     *   // Could send to server via WebSocket/HTTP
     * }
     * ```
     */
    sendNetworkEvent?: (eventName: string, data: any) => void;
  }

  // ==================== bloombeasts\types\platform\PlatformConfig.ts ====================

  /**
   * Platform configuration interface
   *
   * Platform-agnostic configuration for adapting the game to different platforms.
   * Composed of focused provider interfaces for better separation of concerns.
   *
   * Each provider handles a specific aspect of platform integration:
   * - IStorageProvider: Data persistence (required)
   * - IAssetProvider: Asset loading (required)
   * - IUIProvider: UI rendering and async operations (required)
   * - IAudioProvider: Sound and music (optional)
   * - IWorldProvider: Multiplayer/world features (optional)
   *
   * Example implementation for Web:
   * ```ts
   * const webPlatform: PlatformConfig = {
   *   // Storage
   *   setPlayerData: (data) => localStorage.setItem('playerData', JSON.stringify(data)),
   *   getPlayerData: () => JSON.parse(localStorage.getItem('playerData') || 'null'),
   *
   *   // Assets
   *   getImageAsset: (assetId) => catalogManager.getAsset(assetId).webPath,
   *   catalogManager: webCatalogManager,
   *
   *   // UI
   *   getUIMethodMappings: () => webUIComponents,
   *   async: { setTimeout, setInterval, clearTimeout, clearInterval },
   *   render: (uiNode) => renderer.render(uiNode),
   *
   *   // Audio (optional)
   *   playSound: (assetId, loop, volume) => webAudio.play(assetId, { loop, volume }),
   *   stopSound: (assetId) => webAudio.stop(assetId),
   *   // ... other audio methods
   * };
   * ```
   *
   * Example implementation for Horizon:
   * ```ts
   * const horizonPlatform: PlatformConfig = {
   *   // Storage
   *   setPlayerData: (data) => persistentVar.set(data),
   *   getPlayerData: () => persistentVar.get(),
   *
   *   // Assets
   *   getImageAsset: (assetId) => ImageSource.fromTextureAsset(getHorizonAsset(assetId)),
   *   catalogManager: horizonCatalogManager,
   *
   *   // UI
   *   getUIMethodMappings: () => ({ View: hz.View, Text: hz.Text, ... }),
   *   async: component.async,
   *   render: (uiNode) => component.update(uiNode),
   *
   *   // Audio (optional)
   *   playSound: (assetId, loop, volume) => world.playSound(soundAssets[assetId], { loop, volume }),
   *   // ... other audio methods
   *
   *   // World (optional)
   *   getWorldVariable: (group, name) => world.getVariable(group, name),
   *   setWorldVariable: (group, name, value) => world.setVariable(group, name, value),
   *   sendNetworkEvent: (event, data) => world.sendNetworkEvent(event, data),
   * };
   * ```
   */


  /**
   * Platform configuration - implement all required providers for your platform
   *
   * Composes multiple provider interfaces:
   * - Storage, Asset, and UI providers are required
   * - Audio and World providers are optional
   */
  export interface PlatformConfig
    extends IStorageProvider,
      IAssetProvider,
      IUIProvider,
      IAudioProvider,
      IWorldProvider {}

  // ==================== bloombeasts\types\platform\index.ts ====================

  /**
   * Platform types barrel export
   *
   * Exports the main PlatformConfig interface and all provider interfaces.
   * Provider interfaces can be used for more granular platform implementations.
   */

  // Main platform configuration (composes all providers)

  // Individual provider interfaces (for granular implementations)

  // ==================== bloombeasts\types\index.ts ====================

  /**
   * Main types barrel export
   *
   * Centralized export for all game types organized by domain.
   */

  // UI types

  // Game types

  // Platform types

  // ==================== bloombeasts\core\ScreenFactory.ts ====================

  /**
   * ScreenFactory - Centralized screen creation
   *
   * Extracts screen instantiation logic from BloomBeastsGame.
   * Reduces god object complexity and centralizes screen configuration.
   */


  /**
   * Screen factory configuration - all dependencies needed for screen creation
   */
  export interface ScreenFactoryConfig {
    ui: UIMethodMappings;
    asyncMethods: AsyncMethods;

    // Event handlers
    onButtonClick: (buttonId: string) => Promise<void>;
    onCardSelect: (cardId: string) => Promise<void>;
    onMissionSelect: (missionId: string) => Promise<void>;
    onSettingChange: (settingId: string, value: any) => void;
    onUpgrade: (boostId: string) => void;
    onBattleAction: (action: string) => Promise<void>;
    onNavigate: (screen: string) => void;
    onShowCardDetail: (card: any, durationMs: number, callback?: () => void) => void;

    // Utilities
    onRenderNeeded: () => void;
    playSfx: (sfxId: string) => void;
  }

  /**
   * All game screens
   */
  export interface GameScreens {
    menuScreen: MenuScreen;
    cardsScreen: CardsScreen;
    upgradeScreen: UpgradeScreen;
    missionScreen: MissionScreen;
    battleScreen: BattleScreen;
    settingsScreen: SettingsScreen;
    leaderboardScreen: LeaderboardScreen;
  }

  /**
   * ScreenFactory - Creates all game screens with proper configuration
   */
  export class ScreenFactory {
    /**
     * Create all game screens
     */
    static createScreens(config: ScreenFactoryConfig): GameScreens {
      const {
        ui,
        asyncMethods,
        onButtonClick,
        onCardSelect,
        onMissionSelect,
        onSettingChange,
        onUpgrade,
        onBattleAction,
        onNavigate,
        onShowCardDetail,
        onRenderNeeded,
        playSfx,
      } = config;

      return {
        menuScreen: new MenuScreen({
          ui,
          onButtonClick,
          onNavigate,
          onRenderNeeded,
          playSfx,
        }),

        cardsScreen: new CardsScreen({
          ui,
          onCardSelect,
          onNavigate,
          onRenderNeeded,
          playSfx,
        }),

        upgradeScreen: new UpgradeScreen({
          ui,
          onNavigate,
          onUpgrade,
          onRenderNeeded,
          playSfx,
        }),

        missionScreen: new MissionScreen({
          ui,
          onMissionSelect,
          onNavigate,
          onRenderNeeded,
          playSfx,
        }),

        battleScreen: new BattleScreen({
          ui,
          async: asyncMethods,
          onAction: onBattleAction,
          onNavigate,
          onRenderNeeded,
          onShowCardDetail,
          playSfx,
        }),

        settingsScreen: new SettingsScreen({
          ui,
          onSettingChange,
          onNavigate,
          onRenderNeeded,
          playSfx,
        }),

        leaderboardScreen: new LeaderboardScreen({
          ui,
          onNavigate,
          playSfx,
        }),
      };
    }
  }

  // ==================== bloombeasts\common\engine\cards\deckConfig.ts ====================

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
      Logger.error('[deckConfig] catalogManager not provided');
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

  // ==================== bloombeasts\common\engine\cards\index.ts ====================

  /**
   * Central card registry
   */

  // Re-export everything from config

  // ==================== bloombeasts\common\engine\utils\deckBuilder.ts ====================

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
      Logger.error('[deckBuilder] catalogManager not initialized');
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
      Logger.error('[deckBuilder] catalogManager not initialized');
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
      Logger.error('[deckBuilder] catalogManager not initialized');
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

  // ==================== bloombeasts\common\engine\utils\cardHelpers.ts ====================

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
   * Filter cards by type (simplified)
   */
  export function filterByType(cards: AnyCard[], type: CardType): AnyCard[] {
    return cards.filter((card) => card.type === type);
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

  // ==================== bloombeasts\common\engine\index.ts ====================

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
        Logger.error('[mission01] Failed to build Forest deck');
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
          affinity: Affinity.Forest,
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

  // ==================== bloombeasts\screens\missions\utils\deckBuilder.ts ====================

  /**
   * Mission Deck Builder Utilities
   * Centralized deck construction for mission definitions
   */


  /**
   * Card specification for deck building
   */
  export interface CardSpec {
    cardId: string;
    count: number;
  }

  // Module-level catalog manager reference
  // Set via setCatalogManagerForMissions() which is called by CoreSystemsInitializer
  let _missionDeckCatalogManager: any = null;

  /**
   * Set the catalog manager instance for mission deck builder
   * Called during game initialization
   */
  export function setCatalogManagerForMissions(catalogManager: any): void {
    _missionDeckCatalogManager = catalogManager;
    Logger.info('[MissionDeckBuilder] Catalog manager initialized');
  }

  /**
   * Get catalog manager (for internal use)
   */
  function getCatalogManager(): any {
    if (!_missionDeckCatalogManager) {
      Logger.error('[MissionDeckBuilder] Catalog manager not available - was setCatalogManagerForMissions called?');
      return null;
    }
    return _missionDeckCatalogManager;
  }

  /**
   * Get catalog manager (for external use - e.g., mission17 Cluck Norris)
   * This allows mission definitions to access the catalog manager
   */
  export function getCatalogManagerForMissions(): any {
    return _missionDeckCatalogManager;
  }

  /**
   * Create a mission deck with specified cards
   *
   * @example
   * createMissionDeck({
   *   name: 'Mushroomancer Pack',
   *   affinity: 'Forest',
   *   cards: [{ cardId: 'mushroomancer', count: 20 }]
   * })
   */
  export function createMissionDeck(config: {
    name: string;
    affinity: DeckType;
    cards: CardSpec[];
  }): DeckList {
    const catalogManager = getCatalogManager();

    if (!catalogManager) {
      Logger.error(`[MissionDeckBuilder] CatalogManager is not available! Cannot build deck "${config.name}"`);
      return {
        name: config.name,
        affinity: config.affinity,
        cards: [],
        totalCards: 0,
      };
    }

    Logger.info(`[MissionDeckBuilder] Building deck "${config.name}" with ${config.cards.length} card types`);

    const deckCards: any[] = [];

    for (const spec of config.cards) {
      const cardDef = catalogManager.getCard(spec.cardId);

      if (!cardDef) {
        Logger.error(`[MissionDeckBuilder] Card not found in catalog: ${spec.cardId}`);
        continue;
      }

      Logger.debug(`[MissionDeckBuilder] Adding ${spec.count}x ${spec.cardId} to deck`);

      // Create multiple instances of this card
      for (let i = 1; i <= spec.count; i++) {
        deckCards.push({
          ...cardDef,
          instanceId: `${spec.cardId}-${i}`,
        });
      }
    }

    return {
      name: config.name,
      affinity: config.affinity,
      cards: deckCards,
      totalCards: deckCards.length,
    };
  }

  // ==================== bloombeasts\screens\missions\definitions\mission02.ts ====================

  /**
   * Mission 02: Mushroomancer
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

    opponentDeck: () =>
      createMissionDeck({
        name: 'Mushroom Grove',
        affinity: 'Forest' as const,
        cards: [
          { cardId: 'mushroomancer', count: 6 },
          { cardId: 'rootling', count: 4 },
          { cardId: 'nectar-block', count: 5 },
        ],
      }),

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
          affinity: Affinity.Forest,
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

    opponentDeck: () =>
      createMissionDeck({
        name: 'Forest Basics',
        affinity: 'Forest' as const,
        cards: [
          { cardId: 'mosslet', count: 5 },
          { cardId: 'rootling', count: 5 },
          { cardId: 'nectar-block', count: 5 },
        ],
      }),

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
          affinity: Affinity.Forest,
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

    opponentDeck: () =>
      createMissionDeck({
        name: 'Forest Advancement',
        affinity: 'Forest' as const,
        cards: [
          { cardId: 'leaf-sprite', count: 6 },
          { cardId: 'mushroomancer', count: 6 },
          { cardId: 'ancient-forest', count: 1 },
          { cardId: 'nectar-block', count: 6 },
          { cardId: 'power-up', count: 1 },
        ],
      }),

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
          affinity: Affinity.Forest,
        },
        {
          cardPool: 'uncommon',
          minAmount: 1,
          maxAmount: 1,
          dropChance: 0.4,
          affinity: Affinity.Forest,
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
          affinity: Affinity.Water,
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
          affinity: Affinity.Water,
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
          affinity: Affinity.Water,
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
          affinity: Affinity.Water,
        },
        {
          cardPool: 'uncommon',
          minAmount: 1,
          maxAmount: 1,
          dropChance: 0.4,
          affinity: Affinity.Water,
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
          affinity: Affinity.Fire,
        },
        {
          cardPool: 'uncommon',
          minAmount: 1,
          maxAmount: 1,
          dropChance: 0.5,
          affinity: Affinity.Fire,
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
          affinity: Affinity.Fire,
        },
        {
          cardPool: 'uncommon',
          minAmount: 1,
          maxAmount: 1,
          dropChance: 0.5,
          affinity: Affinity.Fire,
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
          affinity: Affinity.Fire,
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
          affinity: Affinity.Fire,
        },
        {
          cardPool: 'rare',
          minAmount: 1,
          maxAmount: 1,
          dropChance: 0.4,
          affinity: Affinity.Fire,
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
          affinity: Affinity.Sky,
        },
        {
          cardPool: 'rare',
          minAmount: 1,
          maxAmount: 1,
          dropChance: 0.4,
          affinity: Affinity.Sky,
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
          affinity: Affinity.Sky,
        },
        {
          cardPool: 'rare',
          minAmount: 1,
          maxAmount: 1,
          dropChance: 0.4,
          affinity: Affinity.Sky,
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
          affinity: Affinity.Sky,
        },
        {
          cardPool: 'rare',
          minAmount: 1,
          maxAmount: 1,
          dropChance: 0.5,
          affinity: Affinity.Sky,
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
          affinity: Affinity.Sky,
        },
        {
          cardPool: 'rare',
          minAmount: 1,
          maxAmount: 1,
          dropChance: 0.5,
          affinity: Affinity.Sky,
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
    const catalogManager = getCatalogManagerForMissions();
    if (!catalogManager) {
      Logger.error('[mission17] Catalog manager not available');
      return {
        name: 'Cluck Norris Deck',
        affinity: 'Forest',
        cards: [],
        totalCards: 0,
      };
    }

    // Get the Cluck Norris card from the boss catalog
    const cluckNorrisCard = catalogManager.getCard('cluck-norris') as BloomBeastCard;

    if (!cluckNorrisCard) {
      Logger.error('[mission17] Cluck Norris card not found in catalog');
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
      Logger.info(`[MissionManager] updateProgress called with event: ${event}`);
      Logger.info(`[MissionManager] Has progress: ${!!this.progress}, Has currentMission: ${!!this.currentMission}`);

      if (!this.progress || !this.currentMission) {
        Logger.warn('[MissionManager] updateProgress returning early - no progress or mission');
        return;
      }

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
          Logger.info('[MissionManager] Processing opponent-defeated event');
          this.updateObjective('defeat-opponent', 1);
          Logger.info(`[MissionManager] After update, defeat-opponent progress: ${this.progress.objectiveProgress.get('defeat-opponent')}`);
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

      Logger.debug(`[MissionManager] Checking mission completion for ${this.currentMission.id}`);
      Logger.debug(`[MissionManager] Has objectives: ${!!this.currentMission.objectives}, Length: ${this.currentMission.objectives?.length || 0}`);

      // If no objectives, just check if opponent is defeated (default win condition)
      if (!this.currentMission.objectives || this.currentMission.objectives.length === 0) {
        // Mission complete when opponent is defeated (health reaches 0 OR deck-out)
        const defeatOpponentProgress = this.progress.objectiveProgress.get('defeat-opponent') || 0;
        Logger.debug(`[MissionManager] Default win condition check - OpponentHP: ${this.progress.opponentHealth}, DefeatProgress: ${defeatOpponentProgress}`);

        if (this.progress.opponentHealth <= 0 || defeatOpponentProgress >= 1) {
          this.progress.isCompleted = true;
          Logger.info('[MissionManager] Mission marked as completed (opponent defeated)');
        } else {
          Logger.debug('[MissionManager] Mission NOT completed yet');
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
      Logger.info('[MissionManager] completeMission() called');
      Logger.info(`[MissionManager] currentMission: ${!!this.currentMission}, progress: ${!!this.progress}, isCompleted: ${this.progress?.isCompleted}`);

      if (!this.currentMission || !this.progress || !this.progress.isCompleted) {
        Logger.warn('[MissionManager] completeMission() returning null - mission not completed');
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
      const startTime = this.progress!.startTime || Date.now();
      const endTime = this.progress!.endTime || Date.now();
      const completionTimeMs = endTime - startTime;
      const completionTimeSeconds = Math.max(0, Math.floor(completionTimeMs / 1000));

      Logger.info(`[MissionManager] generateRewards - startTime: ${startTime}, endTime: ${endTime}, completionTime: ${completionTimeSeconds}s`);

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

      // Set the objective value directly (don't require it to pre-exist in the map)
      this.progress.objectiveProgress.set(type, value);
      Logger.debug(`[MissionManager] Set objective ${type} = ${value}`);
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

  // ==================== bloombeasts\core\interfaces\IMissionSelectionUI.ts ====================

  /**
   * IMissionSelectionUI - Interface for mission selection UI
   * Breaks circular dependency between core and screens
   */


  /**
   * Mission display data returned by the UI
   */
  export interface MissionDisplayData {
    mission: Mission;
    isAvailable: boolean;
    completionCount: number;
    difficultyColor: string;
    rewardPreview: string[];
  }

  /**
   * Interface for mission selection UI operations
   */
  export interface IMissionSelectionUI {
    /**
     * Set the player's current level for mission filtering
     */
    setPlayerLevel(level: number): void;

    /**
     * Get all missions formatted for display
     */
    getMissionList(): MissionDisplayData[];
  }

  // ==================== bloombeasts\screens\missions\MissionSelectionUI.ts ====================

  /**
   * Mission Selection UI - Display available missions and let players choose
   */


  export class MissionSelectionUI implements IMissionSelectionUI {
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
     * Get difficulty color for UI (now uses centralized color palette)
     */
    private getDifficultyColor(difficulty: string): string {
      return getDifficultyColor(difficulty);
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
   * Standalone TypeScript Bundle (https://github.com/suppers-ai/turbo)
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
   * Generated: 2025-11-10T08:09:57.402Z
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
     * Platform async methods interface
     * Provides setTimeout, setInterval, clearTimeout, clearInterval
     */
    export interface AsyncMethods {
      setTimeout: (callback: (...args: any[]) => void, timeout?: number) => number;
      clearTimeout: (id: number) => void;
      setInterval: (callback: (...args: any[]) => void, timeout?: number) => number;
      clearInterval: (id: number) => void;
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
      async?: AsyncMethods;
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
     * Deep clone an object using manual cloning for consistency across all platforms
     * (Avoids structuredClone to ensure compatibility with all environments)
     */
    export function deepClone<T>(obj: T): T {
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
      if (visited.has(obj as unknown as object)) {
        return visited.get(obj as unknown as object) as T;
      }

      // Handle Date
      if (obj instanceof Date) {
        return new Date(obj.getTime()) as unknown as T;
      }

      // Handle RegExp
      if (obj instanceof RegExp) {
        return new RegExp(obj.source, obj.flags) as unknown as T;
      }

      // Handle Array
      if (Array.isArray(obj)) {
        const cloned: unknown[] = [];
        visited.set(obj, cloned as unknown as T);

        for (let i = 0; i < obj.length; i++) {
          cloned[i] = manualDeepClone(obj[i], visited);
        }

        return cloned as unknown as T;
      }

      // Handle Map
      if (obj instanceof Map) {
        const cloned = new Map();
        visited.set(obj, cloned as unknown as T);

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
        visited.set(obj, cloned as unknown as T);

        obj.forEach(value => {
          cloned.add(manualDeepClone(value, visited));
        });

        return cloned as unknown as T;
      }

      // Handle plain objects
      const cloned: Record<string, unknown> = {};
      visited.set(obj as unknown as object, cloned as unknown as T);

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
          ...(handlers ? Array.from(handlers) : []),
          ...(onceHandlers ? Array.from(onceHandlers) : []),
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
      protected async?: AsyncMethods;

      constructor(config: IAIConfig) {
        this.playerId = config.playerId;
        this.difficulty = config.difficulty;
        this.thinkingTime = config.thinkingTime || this.getDefaultThinkingTime(config.difficulty);
        this.randomSeed = config.randomSeed;
        this.async = config.async;
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
       * Requires async methods to be provided in config
       */
      protected async simulateThinking(): Promise<void> {
        if (!this.async) {
          // No async methods provided - skip delay
          return Promise.resolve();
        }

        const delay = this.thinkingTime.min +
          Math.random() * (this.thinkingTime.max - this.thinkingTime.min);

        return new Promise(resolve => this.async!.setTimeout(resolve, delay));
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

  // Make Turbo available globally
  if (typeof globalThis !== 'undefined') {
    (globalThis as any).Turbo = Turbo;
  }

  // ==================== bloombeasts\screens\battle\engine\types\actions.ts ====================

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
    beastIndex: number;      // Slot index (0-2) - always reliable
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

    useAbility: (beastIndex: number, abilityIndex: number, options?: {
      targetId?: string;
      targetIndex?: number;
      playerId?: string;
    }): UseAbilityAction => ({
      type: 'use-ability',
      beastIndex,
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

      return BattleActions.useAbility(beastIndex, 0, {
        targetIndex,
        playerId,
      });
    }

    // Unknown action
    Logger.warn(`[ActionParser] Unknown action string: ${actionStr}`);
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
          return `use-ability-${action.beastIndex}-target-${action.targetIndex}`;
        }
        return `use-ability-${action.beastIndex}`;

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

  // ==================== bloombeasts\screens\battle\engine\types\index.ts ====================

  /**
   * Battle Engine Types - Re-exports
   */

  // ==================== bloombeasts\common\engine\utils\random.ts ====================

  /**
   * Random Utilities
   *
   * Utility functions for randomization in the game.
   */

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

  // ==================== bloombeasts\screens\battle\engine\actions\ActionHandler.ts ====================

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

    /**
     * Check and trigger traps based on action type
     */
    checkTraps?: (state: BloomBeastsState, playerId: string, triggerType: string, trapContext?: any) => void;
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
        Logger.warn(`[ActionHandlerRegistry] Overwriting handler for action type: ${handler.actionType}`);
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
     * Uses Turbo.deepClone for proper handling of Sets, Maps, Dates, etc.
     */
    protected cloneState(state: Turbo.IGameState<BloomBeastsState>): Turbo.IGameState<BloomBeastsState> {
      return Turbo.deepClone(state);
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

  // ==================== bloombeasts\screens\battle\engine\actions\DrawCardActionHandler.ts ====================

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

  // ==================== bloombeasts\screens\battle\engine\actions\PlayCardActionHandler.ts ====================

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
      const card = player.hand.find(c => cardMatchesId(c, actionData.cardId));
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
      const cardIndex = player.hand.findIndex(c => cardMatchesId(c, actionData.cardId));
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

      // Check for traps BEFORE processing card effects
      if (context?.checkTraps) {
        let trapTriggerType = '';
        if (card.type === CardType.Beast) trapTriggerType = 'beast_play';
        else if (card.type === 'Magic') trapTriggerType = 'magic_play';
        else if (card.type === 'Habitat') trapTriggerType = 'habitat_play';

        if (trapTriggerType) {
          context.checkTraps(newState.gameData, playerId, trapTriggerType, { card });
        }
      }

      // Process OnSummon triggers for Beast cards
      if (card.type === CardType.Beast && context?.processTriggers) {
        context.processTriggers('on_action', newState, { action: 'summon', card });

        // Notify other allies about this summon (for OnAllySummon triggers)
        context.processTriggers('on_action', newState, { action: 'ally_summon', summonedCard: card });
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

  // ==================== bloombeasts\screens\battle\engine\actions\AttackActionHandler.ts ====================

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

      // Recalculate valid targets based on current field state (slot-based targeting)
      const playerIndex = state.gameData.players.findIndex(p => p.id === playerId);
      const opponentIndex = 1 - playerIndex;
      const opponent = state.gameData.players[opponentIndex];
      const currentField = playerIndex === 0 ? state.gameData.field.player1 : state.gameData.field.player2;
      const opponentField = playerIndex === 0 ? state.gameData.field.player2 : state.gameData.field.player1;

      // Find the slot index of the attacking beast
      const slotIndex = currentField.beasts.findIndex(b => b && cardMatchesId(b, actionData.cardId));
      if (slotIndex === -1) {
        return { valid: false, reason: 'Attacker not found on field' };
      }

      // Determine the correct target based on current field state
      const opponentBeast = opponentField.beasts[slotIndex];
      let validTargetId: string;

      if (opponentBeast) {
        // Beast in opposite slot - must attack that beast
        validTargetId = getCardIdentifier(opponentBeast);
      } else {
        // No beast in opposite slot - must attack player
        validTargetId = opponent.id;
      }

      // Validate that the provided target matches the calculated valid target
      if (actionData.targetId !== validTargetId) {
        return { valid: false, reason: 'Invalid target for slot position' };
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

        // Both creatures deal damage to each other (with damage modifiers applied)
        const damageToTarget = calculateDamage(attacker.currentAttack, attacker, target);
        const damageToAttacker = calculateDamage(target.currentAttack, target, attacker);

        target.currentHealth -= damageToTarget;
        attacker.currentHealth -= damageToAttacker;

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
          if (beast && cardMatchesId(beast, beastId)) {
            return beast;
          }
        }
      }
      return null;
    }

    /**
     * Remove a defeated beast from the field and add to graveyard
     * NOTE: Does NOT reposition beasts - that happens at end of turn
     */
    private destroyBeast(beast: RuntimeBeast, state: Turbo.IGameState<BloomBeastsState>): void {
      // Remove from field
      for (let playerIdx = 0; playerIdx < 2; playerIdx++) {
        const field = playerIdx === 0 ? state.gameData.field.player1 : state.gameData.field.player2;
        const beastId = getCardIdentifier(beast);
        const index = field.beasts.findIndex(b => b && cardMatchesId(b, beastId));
        if (index !== -1) {
          // Add to graveyard before removing
          const owner = state.gameData.players[playerIdx];
          owner.graveyard.push(beast);

          // Set to null in place - repositioning happens at end of turn
          field.beasts[index] = null;

          break;
        }
      }
    }
  }

  // ==================== bloombeasts\screens\battle\engine\actions\EndTurnActionHandler.ts ====================

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

      // Reposition beasts (remove dead beasts and shift remaining beasts left)
      this.repositionFields(newState);

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

    /**
     * Reposition beasts on both fields
     * Removes null entries (dead beasts) and shifts remaining beasts left
     */
    private repositionFields(state: Turbo.IGameState<BloomBeastsState>): void {
      for (const field of [state.gameData.field.player1, state.gameData.field.player2]) {
        // Filter out nulls and collect living beasts
        const livingBeasts = field.beasts.filter(beast => beast !== null);

        // Clear the array
        field.beasts = [null, null, null];

        // Place living beasts starting from left
        for (let i = 0; i < livingBeasts.length; i++) {
          field.beasts[i] = livingBeasts[i];
        }
      }
    }
  }

  // ==================== bloombeasts\screens\battle\engine\actions\TimeoutActionHandler.ts ====================

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

  // ==================== bloombeasts\screens\battle\engine\actions\ForfeitActionHandler.ts ====================

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

  // ==================== bloombeasts\screens\battle\engine\actions\index.ts ====================

  /**
   * Action Handlers - Exports all game action handlers
   */

  // ==================== bloombeasts\screens\battle\engine\core\WinConditionChecker.ts ====================

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

  // ==================== bloombeasts\screens\battle\engine\BloomBeastsGame.ts ====================

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
      // Clone state to avoid mutating the original - use Turbo.deepClone to preserve Sets, Maps, etc.
      const newState = Turbo.deepClone(state);
      const bloomState = newState.gameData as unknown as BloomBeastsState;

      // Handle OnSummon triggers
      if (timing === TriggerTiming.ON_ACTION && context?.action === 'summon' && context.card) {
        const card = context.card;

        // Check if this card has abilities
        if (card.abilities && card.abilities.length > 0) {
          for (const ability of card.abilities) {
            // Type guard: check if this is a StructuredAbility with trigger and effects
            if ('trigger' in ability && ability.trigger === 'OnSummon' && 'effects' in ability && ability.effects) {
              // Process each effect (check conditions on individual effects)
              for (const effect of ability.effects) {
                // Check effect condition if present
                if (!effect.condition || this.evaluateCondition(effect.condition, card, bloomState, newState.turnInfo!.currentPlayerId)) {
                  this.processEffect(effect, bloomState, newState.turnInfo!.currentPlayerId, {
                    sourceCard: card,
                    playedCard: card
                  });
                }
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
                // Check condition if present
                if (!effect.condition || this.evaluateCondition(effect.condition, card, bloomState, newState.turnInfo!.currentPlayerId)) {
                  this.processEffect(effect, bloomState, newState.turnInfo!.currentPlayerId, {
                    sourceCard: card
                  });
                }
              }
            }
          }
        }
      }

      // Handle OnAllySummon triggers (notify other allies that a beast was summoned)
      if (timing === TriggerTiming.ON_ACTION && context?.action === 'ally_summon' && context.summonedCard) {
        const summonedCard = context.summonedCard as RuntimeCard;
        const currentPlayerIndex = bloomState.players.findIndex(p => p.id === newState.turnInfo!.currentPlayerId);
        const field = currentPlayerIndex === 0 ? bloomState.field.player1 : bloomState.field.player2;

        // Check all allied beasts (except the summoned one) for OnAllySummon abilities
        for (const beast of field.beasts) {
          if (beast && 'id' in summonedCard && beast.id !== summonedCard.id && beast.abilities) {
            for (const ability of beast.abilities) {
              if ('trigger' in ability && ability.trigger === 'OnAllySummon' && 'effects' in ability && ability.effects) {
                for (const effect of ability.effects) {
                  // Check condition on the summoned card (e.g., affinity match)
                  if (!effect.condition || this.evaluateCondition(effect.condition, summonedCard, bloomState, newState.turnInfo!.currentPlayerId)) {
                    this.processEffect(effect, bloomState, newState.turnInfo!.currentPlayerId, {
                      sourceCard: beast,
                      summonedCard: summonedCard
                    });
                  }
                }
              }
            }
          }
        }
      }

      // Handle OnAttack triggers
      if (timing === TriggerTiming.ON_ACTION && context?.action === 'attack' && context.card) {
        const attackerCard = context.card;

        // Check attacker for OnAttack abilities
        if (attackerCard.abilities && attackerCard.abilities.length > 0) {
          for (const ability of attackerCard.abilities) {
            if ('trigger' in ability && ability.trigger === 'OnAttack' && 'effects' in ability && ability.effects) {
              for (const effect of ability.effects) {
                // Check condition if present
                if (!effect.condition || this.evaluateCondition(effect.condition, attackerCard, bloomState, newState.turnInfo!.currentPlayerId)) {
                  this.processEffect(effect, bloomState, newState.turnInfo!.currentPlayerId, {
                    sourceCard: attackerCard,
                    targetCard: context.targetCard,
                    attackerCard: attackerCard
                  });
                }
              }
            }
          }
        }
      }

      // Handle OnDamage triggers
      if (timing === TriggerTiming.ON_ACTION && context?.action === 'damage' && context.card) {
        const damagedCard = context.card;

        // Check damaged card for OnDamage abilities
        if (damagedCard.abilities && damagedCard.abilities.length > 0) {
          for (const ability of damagedCard.abilities) {
            if ('trigger' in ability && ability.trigger === 'OnDamage' && 'effects' in ability && ability.effects) {
              for (const effect of ability.effects) {
                // Check condition if present
                if (!effect.condition || this.evaluateCondition(effect.condition, damagedCard, bloomState, newState.turnInfo!.currentPlayerId)) {
                  this.processEffect(effect, bloomState, newState.turnInfo!.currentPlayerId, {
                    sourceCard: damagedCard,
                    attackerCard: context.attackerCard,
                    damagedCard: damagedCard
                  });
                }
              }
            }
          }
        }
      }

      // Handle OnDestroy triggers
      if (timing === TriggerTiming.ON_ACTION && context?.action === 'destroy' && context.card) {
        const destroyedCard = context.card;

        // Check destroyed card for OnDestroy abilities
        if (destroyedCard.abilities && destroyedCard.abilities.length > 0) {
          for (const ability of destroyedCard.abilities) {
            if ('trigger' in ability && ability.trigger === 'OnDestroy' && 'effects' in ability && ability.effects) {
              for (const effect of ability.effects) {
                // Check condition if present
                if (!effect.condition || this.evaluateCondition(effect.condition, destroyedCard, bloomState, newState.turnInfo!.currentPlayerId)) {
                  this.processEffect(effect, bloomState, newState.turnInfo!.currentPlayerId, {
                    sourceCard: destroyedCard,
                    destroyedCard: destroyedCard
                  });
                }
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

    private processEffect(
      effect: any,
      state: BloomBeastsState,
      currentPlayerId: string,
      context?: any
    ): void {
      const currentPlayerIndex = state.players.findIndex(p => p.id === currentPlayerId);
      const currentPlayer = state.players[currentPlayerIndex];
      const opponentIndex = 1 - currentPlayerIndex;
      const opponent = state.players[opponentIndex];

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
          this.processStatModification(effect, state, currentPlayerId, context);
          break;

        case 'gain-resource':
          // Gain resources
          if (effect.resource === 'energy') {
            const value = effect.value || 0;
            currentPlayer.energy = Math.min(currentPlayer.energy + value, 10); // maxEnergy = 10
          }
          break;

        case 'deal-damage': {
          // Deal damage to targets
          const targets = this.resolveTargets(effect.target, state, currentPlayerId, context);
          const damageValue = typeof effect.value === 'number' ? effect.value :
                             effect.value === 'attack-value' && context?.sourceCard ?
                             context.sourceCard.currentAttack : 0;

          for (const target of targets) {
            if ('currentHealth' in target) {
              // Target is a beast
              target.currentHealth = Math.max(0, target.currentHealth - damageValue);
              // Check if beast should be destroyed
              if (target.currentHealth <= 0) {
                this.destroyBeast(target, state);
              }
            } else if ('health' in target) {
              // Target is a player
              target.health = Math.max(0, target.health - damageValue);
            }
          }
          break;
        }

        case 'heal': {
          // Heal targets
          const targets = this.resolveTargets(effect.target, state, currentPlayerId, context);
          for (const target of targets) {
            if ('currentHealth' in target && 'maxHealth' in target) {
              // Target is a beast
              const healValue = effect.value === 'full' ? target.maxHealth : effect.value;
              target.currentHealth = Math.min(target.maxHealth, target.currentHealth + healValue);
            } else if ('health' in target && 'maxHealth' in target) {
              // Target is a player
              const healValue = effect.value === 'full' ? target.maxHealth : effect.value;
              target.health = Math.min(target.maxHealth, target.health + healValue);
            }
          }
          break;
        }

        case 'retaliation': {
          // Deal retaliatory damage to attacker
          const targets = this.resolveTargets(effect.target, state, currentPlayerId, context);
          const damageValue = effect.value === 'reflected' && context?.damagedCard ?
                             context.damagedCard.currentHealth : effect.value;

          for (const target of targets) {
            if ('currentHealth' in target) {
              target.currentHealth = Math.max(0, target.currentHealth - damageValue);
              if (target.currentHealth <= 0) {
                this.destroyBeast(target, state);
              }
            }
          }
          break;
        }

        case 'damage-reduction':
          // Damage reduction is handled during combat, not here
          // We'll implement this in Phase 6 (Attack Modifications)
          break;

        case 'remove-summoning-sickness': {
          // Remove summoning sickness from targets
          const targets = this.resolveTargets(effect.target, state, currentPlayerId, context);
          for (const target of targets) {
            if ('summoningSickness' in target) {
              target.summoningSickness = false;
            }
          }
          break;
        }

        case 'cannot-be-targeted':
          // Cannot be targeted is a passive effect checked during targeting
          // We'll track this in a future phase
          break;

        case 'attack-modification':
          // Attack modifications are handled during combat
          // We'll implement this in Phase 6
          break;

        case 'prevent-attack': {
          // Prevent beast from attacking
          const targets = this.resolveTargets(effect.target, state, currentPlayerId, context);
          for (const target of targets) {
            if ('preventions' in target) {
              if (!target.preventions) {
                target.preventions = [];
              }
              target.preventions.push({
                type: 'prevent-attack',
                duration: effect.duration || 'permanent',
                source: context?.sourceCard?.id || 'unknown'
              });
            }
          }
          break;
        }

        case 'prevent-abilities': {
          // Prevent beast from using abilities
          const targets = this.resolveTargets(effect.target, state, currentPlayerId, context);
          for (const target of targets) {
            if ('preventions' in target) {
              if (!target.preventions) {
                target.preventions = [];
              }
              target.preventions.push({
                type: 'prevent-abilities',
                duration: effect.duration || 'permanent',
                source: context?.sourceCard?.id || 'unknown'
              });
            }
          }
          break;
        }

        case 'return-to-hand': {
          // Return units to hand
          const targets = this.resolveTargets(effect.target, state, currentPlayerId, context);
          const numToReturn = effect.value || targets.length;

          for (let i = 0; i < Math.min(numToReturn, targets.length); i++) {
            const target = targets[i];
            if ('id' in target && 'type' in target && 'instanceId' in target) {
              // Target is a RuntimeCard
              const field = currentPlayerIndex === 0 ? state.field.player1 : state.field.player2;
              const beastIndex = field.beasts.findIndex(b => b && cardsMatch(b, target));
              if (beastIndex !== -1) {
                field.beasts[beastIndex] = null;
                // Add to hand if space available
                if (currentPlayer.hand.length < currentPlayer.maxHandSize) {
                  currentPlayer.hand.push(target as RuntimeCard);
                } else {
                  // Discard if hand is full
                  currentPlayer.graveyard.push(target as RuntimeCard);
                }
              }
            }
          }
          break;
        }

        case 'destroy': {
          // Destroy target units
          const targets = this.resolveTargets(effect.target, state, currentPlayerId, context);
          for (const target of targets) {
            if ('currentHealth' in target) {
              this.destroyBeast(target, state);
            }
          }
          break;
        }

        case 'discard-cards': {
          // Discard cards from hand
          const numToDiscard = Math.min(effect.value || 1, currentPlayer.hand.length);
          for (let i = 0; i < numToDiscard; i++) {
            const card = currentPlayer.hand.pop();
            if (card) {
              currentPlayer.graveyard.push(card);
            }
          }
          break;
        }

        case 'nullify-effect':
          // Nullify effect prevents the card from being played
          // This is handled in trap activation
          break;

        case 'temporary-hp': {
          // Grant temporary HP (shield)
          const targets = this.resolveTargets(effect.target, state, currentPlayerId, context);
          for (const target of targets) {
            if ('temporaryHP' in target) {
              target.temporaryHP = (target.temporaryHP || 0) + effect.value;
            }
          }
          break;
        }

        case 'immunity':
        case 'swap-positions':
        case 'move-unit':
        case 'copy-ability':
        case 'redirect-damage':
          // These are advanced effects that can be implemented later
          console.warn(`[EffectSystem] Effect type '${effect.type}' not yet implemented`);
          break;

        default:
          console.warn(`[EffectSystem] Unknown effect type: ${effect.type}`);
      }
    }

    /**
     * Remove a beast from the field and add to graveyard
     */
    private destroyBeast(beast: RuntimeBeast, state: BloomBeastsState): void {
      // Find which field and remove
      for (let playerIdx = 0; playerIdx < 2; playerIdx++) {
        const field = playerIdx === 0 ? state.field.player1 : state.field.player2;
        const index = field.beasts.findIndex(b => b && cardsMatch(b, beast));
        if (index !== -1) {
          field.beasts[index] = null;
          // Add to graveyard
          const owner = state.players[playerIdx];
          owner.graveyard.push(beast);
          break;
        }
      }
    }

    /**
     * Evaluate whether a condition is met
     */
    private evaluateCondition(condition: any, target: any, state: BloomBeastsState, currentPlayerId: string): boolean {
      if (!condition) return true; // No condition means always true

      const currentPlayerIndex = state.players.findIndex(p => p.id === currentPlayerId);
      const field = currentPlayerIndex === 0 ? state.field.player1 : state.field.player2;

      switch (condition.type) {
        case 'health-below':
          if ('currentHealth' in target) {
            const comparison = condition.comparison || 'less';
            const value = condition.value || 0;
            if (comparison === 'less') return target.currentHealth < value;
            if (comparison === 'less-equal') return target.currentHealth <= value;
          }
          return false;

        case 'health-above':
          if ('currentHealth' in target) {
            const comparison = condition.comparison || 'greater';
            const value = condition.value || 0;
            if (comparison === 'greater') return target.currentHealth > value;
            if (comparison === 'greater-equal') return target.currentHealth >= value;
          }
          return false;

        case 'cost-below':
        case 'CostBelow':
          if ('cost' in target) {
            return target.cost < (condition.value || 0);
          }
          return false;

        case 'cost-above':
        case 'CostAbove':
          if ('cost' in target) {
            return target.cost > (condition.value || 0);
          }
          return false;

        case 'affinity-matches':
        case 'AffinityMatches':
          if ('affinity' in target) {
            return target.affinity === condition.value;
          }
          return false;

        case 'affinity-not-matches':
          if ('affinity' in target) {
            return target.affinity !== condition.value;
          }
          return false;

        case 'is-damaged':
        case 'IsDamaged':
          if ('currentHealth' in target && 'maxHealth' in target) {
            return target.currentHealth < target.maxHealth;
          }
          return false;

        case 'is-wilting':
        case 'IsWilting':
          if ('currentHealth' in target) {
            return target.currentHealth === 1;
          }
          return false;

        case 'turn-count':
        case 'TurnCount':
          // Check current turn number
          return false; // Need to add turn tracking

        case 'units-on-field':
        case 'UnitsOnField':
          // Count units on current player's field
          const unitCount = field.beasts.filter(b => b !== null).length;
          const comparison = condition.comparison || 'equal';
          const value = condition.value || 0;

          if (comparison === 'equal' || comparison === 'Equal') return unitCount === value;
          if (comparison === 'greater' || comparison === 'Greater') return unitCount > value;
          if (comparison === 'less' || comparison === 'Less') return unitCount < value;
          if (comparison === 'greater-equal' || comparison === 'GreaterEqual') return unitCount >= value;
          if (comparison === 'less-equal' || comparison === 'LessEqual') return unitCount <= value;
          return false;

        case 'resource-available':
        case 'ResourceAvailable':
          const currentPlayer = state.players[currentPlayerIndex];
          if (condition.resource === 'energy') {
            return currentPlayer.energy >= (condition.value || 0);
          }
          return false;

        default:
          console.warn(`[EffectSystem] Unknown condition type: ${condition.type}`);
          return true; // Default to true for unknown conditions
      }
    }

    private processStatModification(
      effect: any,
      state: BloomBeastsState,
      currentPlayerId: string,
      context?: any
    ): void {
      const targets = this.resolveTargets(effect.target, state, currentPlayerId, context);

      for (const target of targets) {
        // Only process if target is a beast (has stat properties)
        if ('currentAttack' in target && 'currentHealth' in target) {
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
    }

    /**
     * Resolve targets for an ability effect
     * Returns array of targets (beasts, players, or cards) based on target type
     */
    private resolveTargets(
      targetType: string,
      state: BloomBeastsState,
      currentPlayerId: string,
      context?: {
        sourceCard?: RuntimeBeast | RuntimeHabitat | RuntimeBuff | RuntimeTrap;
        attackerCard?: RuntimeBeast;
        targetCard?: RuntimeBeast | RuntimeCard;
        damagedCard?: RuntimeBeast;
        destroyedCard?: RuntimeBeast;
        playedCard?: RuntimeCard;
      }
    ): any[] {
      const targets: any[] = [];
      const currentPlayerIndex = state.players.findIndex(p => p.id === currentPlayerId);
      const opponentIndex = 1 - currentPlayerIndex;
      const currentField = currentPlayerIndex === 0 ? state.field.player1 : state.field.player2;
      const opponentField = currentPlayerIndex === 0 ? state.field.player2 : state.field.player1;

      switch (targetType) {
        case 'self':
          if (context?.sourceCard) {
            targets.push(context.sourceCard);
          }
          break;

        case 'all-allies':
          // All allied beasts on the field
          for (const beast of currentField.beasts) {
            if (beast !== null) {
              targets.push(beast);
            }
          }
          break;

        case 'all-enemies':
          // All enemy beasts on the field
          for (const beast of opponentField.beasts) {
            if (beast !== null) {
              targets.push(beast);
            }
          }
          break;

        case 'all-units':
          // All beasts on both fields
          for (const beast of currentField.beasts) {
            if (beast !== null) targets.push(beast);
          }
          for (const beast of opponentField.beasts) {
            if (beast !== null) targets.push(beast);
          }
          break;

        case 'adjacent-allies':
          // Adjacent allied beasts (to sourceCard)
          if (context?.sourceCard) {
            const index = currentField.beasts.findIndex(b => b && cardsMatch(b, context.sourceCard!));
            if (index !== -1) {
              if (index > 0 && currentField.beasts[index - 1]) {
                targets.push(currentField.beasts[index - 1]);
              }
              if (index < currentField.beasts.length - 1 && currentField.beasts[index + 1]) {
                targets.push(currentField.beasts[index + 1]);
              }
            }
          }
          break;

        case 'adjacent-enemies':
          // Adjacent enemy beasts (opposite to sourceCard)
          if (context?.sourceCard) {
            const index = currentField.beasts.findIndex(b => b && cardsMatch(b, context.sourceCard!));
            if (index !== -1) {
              if (opponentField.beasts[index]) {
                targets.push(opponentField.beasts[index]);
              }
            }
          }
          break;

        case 'other-ally':
          // Another allied beast (not self)
          for (const beast of currentField.beasts) {
            if (beast !== null && beast.id !== context?.sourceCard?.id) {
              targets.push(beast);
            }
          }
          break;

        case 'random-ally':
          // Random allied beast
          const allies = currentField.beasts.filter(b => b !== null);
          if (allies.length > 0) {
            const randomIndex = Math.floor(Math.random() * allies.length);
            targets.push(allies[randomIndex]);
          }
          break;

        case 'random-enemy':
          // Random enemy beast
          const enemies = opponentField.beasts.filter(b => b !== null);
          if (enemies.length > 0) {
            const randomIndex = Math.floor(Math.random() * enemies.length);
            targets.push(enemies[randomIndex]);
          }
          break;

        case 'player':
          // Current player
          targets.push(state.players[currentPlayerIndex]);
          break;

        case 'opponent':
          // Opponent player
          targets.push(state.players[opponentIndex]);
          break;

        case 'attacker':
          // The beast that attacked (from context)
          if (context?.attackerCard) {
            targets.push(context.attackerCard);
          }
          break;

        case 'attacked-enemy':
          // The enemy that was attacked (from context)
          if (context?.targetCard) {
            targets.push(context.targetCard);
          }
          break;

        case 'damaged-enemies':
          // All damaged enemy beasts
          for (const beast of opponentField.beasts) {
            if (beast !== null && beast.currentHealth < beast.maxHealth) {
              targets.push(beast);
            }
          }
          break;

        case 'wilting-enemies':
          // Enemy beasts at 1 HP
          for (const beast of opponentField.beasts) {
            if (beast !== null && beast.currentHealth === 1) {
              targets.push(beast);
            }
          }
          break;

        case 'highest-attack-enemy':
          // Enemy with highest attack
          let highestAttack = -1;
          let highestAttackBeast: RuntimeBeast | null = null;
          for (const beast of opponentField.beasts) {
            if (beast !== null && beast.currentAttack > highestAttack) {
              highestAttack = beast.currentAttack;
              highestAttackBeast = beast;
            }
          }
          if (highestAttackBeast) {
            targets.push(highestAttackBeast);
          }
          break;

        case 'lowest-health-enemy':
          // Enemy with lowest health
          let lowestHealth = Infinity;
          let lowestHealthBeast: RuntimeBeast | null = null;
          for (const beast of opponentField.beasts) {
            if (beast !== null && beast.currentHealth < lowestHealth) {
              lowestHealth = beast.currentHealth;
              lowestHealthBeast = beast;
            }
          }
          if (lowestHealthBeast) {
            targets.push(lowestHealthBeast);
          }
          break;

        case 'summoned-unit':
          // The unit that was just summoned (from context)
          if (context?.sourceCard) {
            targets.push(context.sourceCard);
          }
          break;

        case 'destroyed-unit':
          // The unit that was just destroyed (from context)
          if (context?.destroyedCard) {
            targets.push(context.destroyedCard);
          }
          break;

        case 'played-card':
          // The card that was just played (for trap responses)
          if (context?.playedCard) {
            targets.push(context.playedCard);
          }
          break;

        default:
          console.warn(`[EffectSystem] Unknown target type: ${targetType}`);
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
                // Check condition if present
                if (!effect.condition || this.evaluateCondition(effect.condition, beast, state, currentPlayerId)) {
                  this.processEffect(effect, state, currentPlayerId, {
                    sourceCard: beast
                  });
                }
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
                // Check condition if present
                if (!effect.condition || this.evaluateCondition(effect.condition, beast, state, currentPlayerId)) {
                  this.processEffect(effect, state, currentPlayerId, {
                    sourceCard: beast
                  });
                }
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
              // Check condition if present
              if (!effect.condition || this.evaluateCondition(effect.condition, field.habitat, state, currentPlayerId)) {
                this.processEffect(effect, state, currentPlayerId, {
                  sourceCard: field.habitat
                });
              }
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
                // Check condition if present
                if (!effect.condition || this.evaluateCondition(effect.condition, beast, state, currentPlayerId)) {
                  this.processEffect(effect, state, currentPlayerId, {
                    sourceCard: beast
                  });
                }
              }
            }
          }
        }
      }
    }

    clearExpiredEffects(state: Turbo.IGameState<TState>): void {
      // Stub implementation - clear temporary effects here
    }

    /**
     * Check and trigger traps based on action type
     * Returns list of triggered trap IDs for removal
     */
    public checkAndTriggerTraps(
      state: BloomBeastsState,
      currentPlayerId: string,
      triggerType: string,
      context?: any
    ): string[] {
      const triggeredTrapIds: string[] = [];
      const currentPlayerIndex = state.players.findIndex(p => p.id === currentPlayerId);
      const opponentIndex = 1 - currentPlayerIndex;

      // Check opponent's traps (traps trigger against the current player's actions)
      const opponentField = opponentIndex === 0 ? state.field.player1 : state.field.player2;

      for (const trap of opponentField.traps) {
        if (!trap || !trap.activation) continue;

        let shouldTrigger = false;

        // Check if trap activation matches the trigger type
        switch (trap.activation.trigger) {
          case 'OnAttack':
            shouldTrigger = triggerType === 'attack';
            break;

          case 'OnBeastPlay':
            if (triggerType === 'beast_play' && context?.card) {
              // Check activation condition (e.g., cost threshold)
              if (trap.activation.condition) {
                shouldTrigger = this.evaluateCondition(trap.activation.condition, context.card, state, currentPlayerId);
              } else {
                shouldTrigger = true;
              }
            }
            break;

          case 'OnMagicPlay':
            shouldTrigger = triggerType === 'magic_play';
            break;

          case 'OnHabitatPlay':
            shouldTrigger = triggerType === 'habitat_play';
            break;

          case 'OnDestroy':
            shouldTrigger = triggerType === 'beast_destroyed';
            break;

          default:
            console.warn(`[TrapSystem] Unknown trap trigger: ${trap.activation.trigger}`);
        }

        if (shouldTrigger) {
          // Trigger trap abilities
          if (trap.abilities) {
            for (const ability of trap.abilities) {
              if ('trigger' in ability && ability.trigger === 'OnSummon' && 'effects' in ability && ability.effects) {
                for (const effect of ability.effects) {
                  // Traps are controlled by opponent, so use opponent's player ID
                  const opponentPlayerId = state.players[opponentIndex].id;
                  this.processEffect(effect, state, opponentPlayerId, {
                    sourceCard: trap,
                    playedCard: context?.card,
                    attackerCard: context?.attacker,
                    targetCard: context?.target
                  });
                }
              }
            }
          }

          // Mark trap for removal
          triggeredTrapIds.push(trap.id);
        }
      }

      return triggeredTrapIds;
    }

    /**
     * Remove triggered traps from the field
     */
    public removeTriggeredTraps(state: BloomBeastsState, opponentIndex: number, trapIds: string[]): void {
      if (trapIds.length === 0) return;

      const opponentField = opponentIndex === 0 ? state.field.player1 : state.field.player2;
      const opponent = state.players[opponentIndex];

      // Remove traps and add to graveyard
      opponentField.traps = opponentField.traps.filter(trap => {
        if (trap && trapIds.includes(trap.id)) {
          opponent.graveyard.push(trap);
          return false;
        }
        return true;
      });
    }
  }

  // Types are defined in ./types.ts to avoid circular dependencies
  // Note: Export statements removed for namespace bundling - types are available via imports
  // export type { BloomBeastsState, BloomBeastsActionData, BloomBeastsPlayer, RuntimeBeast, RuntimeCard } from './types';
  // export { BloomBeastsActionType } from './types';

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
          checkTraps: (state: BloomBeastsState, playerId: string, triggerType: string, trapContext?: any) => {
            const triggeredTrapIds = this.effectSystem.checkAndTriggerTraps(state, playerId, triggerType, trapContext);
            if (triggeredTrapIds.length > 0) {
              const playerIndex = state.players.findIndex(p => p.id === playerId);
              const opponentIndex = 1 - playerIndex;
              this.effectSystem.removeTriggeredTraps(state, opponentIndex, triggeredTrapIds);
            }
          },
        };

        // Execute the action - handler returns full result with events
        const result = handler.execute(action.data, state, action.playerId, context);

        return result;
      } catch (error) {
        Logger.error('[BloomBeastsGame] Action execution failed:', error);
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
        if (beast && !beast.summoningSickness) {
          const beastId = getCardIdentifier(beast);
          if (!state.gameData!.currentTurnActions.hasAttacked.has(beastId)) {
            const targets = this.getValidAttackTargets(beast, state);
            targets.forEach(targetId => {
              actions.push({
                type: 'game_action',
                playerId: currentPlayer.id,
                data: {
                  type: BloomBeastsActionType.ATTACK,
                  cardId: beastId,
                  targetId,
                },
              });
            });
          }
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
          if (beast && cardMatchesId(beast, beastId)) {
            return beast;
          }
        }
      }
      return null;
    }

    private getValidAttackTargets(beast: RuntimeBeast, state: Turbo.IGameState<BloomBeastsState>): string[] {
      const targets: string[] = [];
      const currentPlayerIndex = this.getCurrentPlayerIndex(state);
      const currentField = currentPlayerIndex === 0 ? state.gameData!.field.player1 : state.gameData!.field.player2;
      const opponentField = currentPlayerIndex === 0 ? state.gameData!.field.player2 : state.gameData!.field.player1;

      // Find the slot index of the attacking beast
      const slotIndex = currentField.beasts.findIndex(b => b && cardsMatch(b, beast));
      if (slotIndex === -1) {
        return targets; // Beast not found on field
      }

      // Check if opponent has a beast in the same slot
      const opponentBeast = opponentField.beasts[slotIndex];
      if (opponentBeast) {
        // Attack the beast in the opposite slot
        targets.push(getCardIdentifier(opponentBeast));
      } else {
        // No beast in opposite slot, attack the player
        const opponentPlayer = state.gameData!.players[1 - currentPlayerIndex];
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

  // Export types for regular module bundling (web deployment)
  // Note: These exports are fine for namespace bundling too

  // ==================== bloombeasts\screens\battle\engine\BloomBeastsAI.ts ====================

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
     * CRITICAL: Always derive from passed state parameter, never use this.currentState
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

      // Calculate beast counts from passed state (not cached this.currentState)
      const playerBeasts = playerField.beasts.filter(b => b !== null).length;
      const opponentBeasts = opponentField.beasts.filter(b => b !== null).length;

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
              if (playerBeasts < opponentBeasts) {
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
              if (opponentBeasts > playerBeasts) {
                value += 4; // More valuable when opponent has board advantage
              }
              break;

            case 'Buff':
              // Buffs need creatures to be valuable
              value = playerBeasts * 4;
              break;

            case 'Habitat':
              // Habitat provides long-term value
              value = 7 + playerBeasts * 2;
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
        if (beast && cardMatchesId(beast, id)) {
          return beast;
        }
      }
      return null;
    }

    // Removed playerBeasts and opponentBeasts getters - they cached this.currentState
    // which caused stale data bugs. Beast counts now calculated from passed state parameter
    // in evaluateAction() method.
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

  // ==================== bloombeasts\screens\battle\engine\core\AIManager.ts ====================

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
    private async?: AsyncMethods;

    constructor(
      game: Turbo.GameController<BloomBeastsState, BloomBeastsActionData>,
      asyncMethods?: AsyncMethods
    ) {
      this.game = game;
      this.aiPlayers = new Set();
      this.async = asyncMethods;
    }

    /**
     * Register AI players from battle config
     */
    registerAIPlayers(config: BattleConfig): void {
      if (config.player1.isAI) {
        const difficulty = this.mapStrategyToDifficulty(config.player1.aiStrategy);
        const ai = new BloomBeastsGreedyAI({
          playerId: config.player1.id,
          difficulty,
          async: this.async
        });
        this.game.registerAI(config.player1.id, ai);
        this.aiPlayers.add(config.player1.id);
        Logger.info(`[AIManager] Registered AI for player1: ${config.player1.id}`);
      }

      if (config.player2.isAI) {
        const difficulty = this.mapStrategyToDifficulty(config.player2.aiStrategy);
        const ai = new BloomBeastsGreedyAI({
          playerId: config.player2.id,
          difficulty,
          async: this.async
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
          Logger.warn('[AIManager] AI reached maximum action limit, forcing END_TURN');

          // Force end turn when max actions reached
          const finalState = this.game.getState();
          if (finalState.turnInfo.currentPlayerId === currentPlayerId) {
            this.game.performAction({
              type: 'game_action',
              playerId: currentPlayerId,
              data: { type: BloomBeastsActionType.END_TURN }
            });
            Logger.info('[AIManager] Forced turn end after max actions');
          }
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

  // ==================== bloombeasts\screens\battle\engine\core\ActionProcessor.ts ====================

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

  // ==================== bloombeasts\screens\battle\engine\core\BattleOrchestrator.ts ====================

  /**
   * TurboBattleOrchestrator - Orchestrates Turbo-based battle lifecycle and coordinates subsystems
   *
   * Responsibilities:
   * - Initialize battles
   * - Subscribe to game events
   * - Coordinate between subsystems (AI, Actions, Win conditions)
   * - Manage battle lifecycle
   */



  export class TurboBattleOrchestrator {
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
      this.ai = new AIManager(this.game, this.async);
      this.actions = new ActionProcessor(this.game);
      this.winChecker = new WinConditionChecker();
    }

    /**
     * Initialize a new battle
     */
    initializeBattle(config: BattleConfig): BattleState {
      Logger.info('[BattleOrchestrator] Initializing battle with TURBO engine');
      Logger.info(`[BattleOrchestrator] Player 1 deck size: ${config.player1.deck.length}`);
      Logger.info(`[BattleOrchestrator] Player 2 deck size: ${config.player2.deck.length}`);

      if (config.player1.deck.length === 0) {
        Logger.error('[BattleOrchestrator] WARNING: Player 1 deck is EMPTY!');
      }
      if (config.player2.deck.length === 0) {
        Logger.error('[BattleOrchestrator] WARNING: Player 2 deck is EMPTY!');
      }

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

      const initialState = this.getState();
      const p1 = initialState.turboState.gameData.players[0];
      const p2 = initialState.turboState.gameData.players[1];

      Logger.info('[BattleOrchestrator] Battle initialized successfully');
      Logger.info(`[BattleOrchestrator] Player 1 final state - Deck: ${p1.deck.length}, Hand: ${p1.hand.length}, Health: ${p1.health}`);
      Logger.info(`[BattleOrchestrator] Player 2 final state - Deck: ${p2.deck.length}, Hand: ${p2.hand.length}, Health: ${p2.health}`);
      Logger.info(`[BattleOrchestrator] Game complete: ${initialState.turboState.isComplete}`);

      return initialState;
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

  // ==================== bloombeasts\screens\battle\engine\core\BattleController.ts ====================

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
    private orchestrator: TurboBattleOrchestrator;

    constructor(async: AsyncMethods) {
      this.orchestrator = new TurboBattleOrchestrator(async);
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
     * Setup a test scenario by modifying the game state
     * This is only for testing purposes and bypasses normal game rules
     *
     * @internal Use only in tests
     */
    setupTestScenario(modifier: (state: Turbo.IGameState<BloomBeastsState>) => void): void {
      const gameController = this.orchestrator.getGameController();
      const currentState = gameController.getState();

      // Apply the modifier function to the state
      modifier(currentState);

      // Use the internal state manager to set the modified state
      // This is the proper way for testing as it goes through TURBO's state management
      const stateManager = (gameController as any).stateManager;
      if (stateManager && typeof stateManager.setState === 'function') {
        stateManager.setState(currentState);
      } else {
        throw new Error('Unable to set test state - stateManager not available');
      }
    }

    /**
     * Dispose battle resources
     */
    dispose(): void {
      this.orchestrator.dispose();
    }
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

  /**
   * Helper: Extract a unique identifier from a RuntimeCard
   * Tries instanceId first, then id, then falls back to provided fallback
   */
  function getCardId(card: RuntimeCard, fallback: string): string {
    if ('instanceId' in card && card.instanceId) return card.instanceId;
    if (card.id) return card.id;
    return fallback;
  }

  /**
   * Helper: Extract a unique identifier from a RuntimeBeast on field
   * Tries instanceId first, then id, then falls back to provided fallback
   */
  // Removed: getBeastId - now using getCardIdentifier from cardIdentifiers utility

  export class BattleUI {
    private missionManager: MissionManager;
    // private gameEngine: GameEngine;
    private async: AsyncMethods;

    // Battle system components
    private battleController: BattleController;

    // Current state
    private currentBattle: BattleState | null = null;
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
    initializeBattle(playerDeckCards: RuntimeCard[], playerName?: string): BattleState | null {
      this.shouldStopAI = false;

      const mission = this.missionManager.getCurrentMission();
      if (!mission) {
        Logger.error('No mission selected');
        return null;
      }

      // Resolve the opponent deck
      const opponentDeck = resolveDeck(mission.opponentDeck);

      // Log opponent deck info for debugging
      Logger.info(`[BattleUI] Opponent deck for ${mission.id}: ${opponentDeck.cards.length} cards`);
      if (opponentDeck.cards.length === 0) {
        Logger.error(`[BattleUI] Opponent deck is EMPTY for mission ${mission.id}! This will cause immediate game end.`);
      }

      // Convert opponent deck cards to RuntimeCards (level 1)
      const opponentRuntimeCards = convertDeckToRuntimeCards(opponentDeck.cards);

      Logger.info(`[BattleUI] Converted opponent runtime cards: ${opponentRuntimeCards.length}`);

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

      // Store battle state
      this.currentBattle = battle;

      return this.currentBattle;
    }

    /**
     * Get current battle state
     */
    getCurrentBattle(): BattleState | null {
      return this.currentBattle;
    }

    /**
     * Get mission manager
     */
    getMissionManager(): MissionManager {
      return this.missionManager;
    }

    /**
     * Helper: Get player from TURBO state (player is always index 0)
     */
    private getPlayer() {
      return this.currentBattle?.turboState.gameData.players[0];
    }

    /**
     * Helper: Get opponent from TURBO state (opponent is always index 1)
     */
    private getOpponent() {
      return this.currentBattle?.turboState.gameData.players[1];
    }

    /**
     * Helper: Get player field from TURBO state
     */
    private getPlayerField() {
      return this.currentBattle?.turboState.gameData.field.player1;
    }

    /**
     * Helper: Get opponent field from TURBO state
     */
    private getOpponentField() {
      return this.currentBattle?.turboState.gameData.field.player2;
    }

    /**
     * Process a typed player action
     */
    async processTypedAction(action: BattleAction, data?: any): Promise<void> {
      if (!this.currentBattle?.turboState) {
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
            // Use the canonical card identifier (prefers instanceId)
            const cardId = getCardIdentifier(card);

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
          // Use beastIndex to find the beast on the field
          const beastIndex = action.beastIndex;
          if (beastIndex !== undefined) {
            const playerField = this.getPlayerField();
            const beast = playerField?.beasts[beastIndex];
            if (beast) {
              const beastId = getCardIdentifier(beast);
              result.success = this.battleController.useAbility(beastId, null, playerId);
            }
          }
          break;
        }

        case 'auto-attack-all': {
          result = await this.autoAttackAll(player, opponent, data?.onAttackAnimation);
          break;
        }

        // NOTE: attack-beast and attack-player are legacy - all attacks now use auto-attack-all
        // which handles slot-based targeting. Keeping type definitions for backwards compatibility.
        case 'attack-beast':
        case 'attack-player': {
          Logger.warn('[BattleUI] Direct attack actions are deprecated - use auto-attack-all instead');
          result.success = false;
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
            data: { type: BloomBeastsActionType.FORFEIT },
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
              type: BloomBeastsActionType.TIMEOUT,
              timedOutPlayerId: action.timedOutPlayerId || playerId
            },
          });
          result.success = turboResult.success;
          break;
        }

        default: {
          // TypeScript exhaustiveness check ensures this is unreachable
          const exhaustiveCheck: never = action;
          Logger.warn(`[BattleUI] Unknown action type: ${(exhaustiveCheck as BattleAction).type}`);
        }
      }

      // Sync state from BattleController immediately after action
      const updatedBattle = this.battleController.getCurrentBattle();
      if (updatedBattle) {
        this.currentBattle = updatedBattle;
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

      for (let i = 0; i < 3; i++) {
        // CRITICAL: Refresh field state before each attack to reflect deaths from previous attacks
        const playerField = this.getPlayerField();
        const opponentField = this.getOpponentField();

        if (!playerField || !opponentField) {
          results.push({ success: false });
          continue;
        }

        const attackerBeast = playerField.beasts[i];
        if (!attackerBeast || attackerBeast.summoningSickness) continue;

        const opposingBeast = opponentField.beasts[i];
        let success = false;

        if (opposingBeast) {
          if (onAttackAnimation) await onAttackAnimation(i, 'beast', i);
          const attackerId = getCardIdentifier(attackerBeast);
          const targetId = getCardIdentifier(opposingBeast);
          success = this.battleController.attackBeast(attackerId, targetId, playerId);
        } else {
          if (onAttackAnimation) await onAttackAnimation(i, 'health');
          const attackerId = getCardIdentifier(attackerBeast);
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
      if (!this.currentBattle?.turboState) {
        Logger.warn('[BattleUI] No current battle for endPlayerTurn');
        return { success: false };
      }

      // Check if battle is already complete (e.g., player just won)
      if (this.currentBattle.turboState.isComplete) {
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
        this.currentBattle = stateAfterTurnEnd;
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
        this.currentBattle = battleState;
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
      if (!this.currentBattle?.turboState) {
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
          this.currentBattle = updatedState;
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
        Logger.info('[BattleUI] Opponent defeated! Updating mission progress.');
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
        Logger.info('[BattleUI] endBattle called but no current battle');
        return;
      }

      // Prevent multiple calls
      if (this.currentBattle.turboState.isComplete) {
        Logger.info('[BattleUI] Battle already completed, ignoring duplicate endBattle call');
        return;
      }

      const battleResult = this.battleController.checkBattleEnd();
      if (!battleResult) {
        Logger.info('[BattleUI] endBattle called but battle not ended yet');
        return;
      }

      Logger.info(`[BattleUI] Battle ending. Winner: ${battleResult.winner}, P1 HP: ${battleResult.player1Health}, P2 HP: ${battleResult.player2Health}`);

      this.shouldStopAI = true;

      // Update mission progress based on winner
      if (battleResult.winner === 'player1') {
        // Player won! Mark opponent as defeated for mission progress
        Logger.info('[BattleUI] Player 1 won! Marking opponent as defeated.');
        Logger.info(`[BattleUI] About to call updateProgress. MissionManager exists: ${!!this.missionManager}`);

        this.missionManager.updateProgress('opponent-defeated', {});
        Logger.info('[BattleUI] updateProgress called successfully');
        this.battleController.completeBattle('player1');
      } else if (battleResult.winner === 'player2') {
        // Player lost
        Logger.info('[BattleUI] Player 2 won! No rewards.');
        this.battleController.completeBattle('player2');
      } else {
        // Tie (both died) - treat as loss for now
        Logger.info('[BattleUI] Tie! No rewards.');
        this.battleController.completeBattle(null);
      }

      Logger.info(`[BattleUI] Battle ended.`);
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

  // ==================== bloombeasts\core\GameStateManager.ts ====================

  /**
   * GameStateManager - Manages player data mutations and game state
   * Extracted from BloomBeastsGame to separate concerns
   */


  /**
   * Manages all player data state and mutations
   * Provides safe accessors to avoid null checks throughout the codebase
   */
  export class GameStateManager {
    private playerData: PlayerData | null = null;
    private onLeaderboardScoreSubmit?: (type: 'experience' | 'cluckNorris', score: number) => void;

    constructor(onLeaderboardScoreSubmit?: (type: 'experience' | 'cluckNorris', score: number) => void) {
      this.onLeaderboardScoreSubmit = onLeaderboardScoreSubmit;
    }

    /**
     * Set player data
     */
    setPlayerData(data: PlayerData | null): void {
      this.playerData = data;
    }

    /**
     * Get player data (safely)
     * Throws error if data not loaded - forces explicit null handling
     */
    getPlayerData(): PlayerData {
      if (!this.playerData) {
        throw new Error('PlayerData not loaded - initialize game first');
      }
      return this.playerData;
    }

    /**
     * Get player data or null (for optional operations)
     */
    getPlayerDataOrNull(): PlayerData | null {
      return this.playerData;
    }

    /**
     * Check if player data is loaded
     */
    hasPlayerData(): boolean {
      return this.playerData !== null;
    }

    /**
     * Execute operation with player data (safe accessor pattern)
     * Returns undefined if player data is not loaded
     */
    withPlayerData<T>(fn: (data: PlayerData) => T): T | undefined {
      return this.playerData ? fn(this.playerData) : undefined;
    }

    /**
     * Get current player level (derived from totalXP)
     */
    getPlayerLevel(): number {
      return getPlayerLevel(this.playerData?.totalXP ?? 0);
    }

    /**
     * Add XP to player (level is automatically derived)
     */
    addXP(amount: number): void {
      if (!this.playerData) {
        Logger.warn('[GameStateManager] Cannot add XP: player data not loaded');
        return;
      }

      this.playerData.totalXP += amount;
      Logger.debug(`[GameStateManager] Added ${amount} XP (total: ${this.playerData.totalXP}, level: ${this.getPlayerLevel()})`);

      // Submit experience to leaderboard
      this.onLeaderboardScoreSubmit?.('experience', this.playerData.totalXP);
    }

    /**
     * Submit Cluck Norris speed run time to leaderboard
     */
    submitCluckNorrisTime(timeInSeconds: number): void {
      if (!this.onLeaderboardScoreSubmit) {
        Logger.warn('[GameStateManager] Cannot submit Cluck Norris time: no leaderboard callback');
        return;
      }

      Logger.info(`[GameStateManager] Submitting Cluck Norris time: ${timeInSeconds}s`);
      this.onLeaderboardScoreSubmit('cluckNorris', timeInSeconds);
    }

    /**
     * Get the quantity of a specific item from player's items array
     */
    getItemQuantity(itemId: string): number {
      if (!this.playerData) {
        Logger.warn('[GameStateManager] Cannot get item quantity: player data not loaded');
        return 0;
      }
      const item = this.playerData.items.find(i => i.itemId === itemId);
      return item ? item.quantity : 0;
    }

    /**
     * Track mission completion
     */
    trackMissionCompletion(missionId: string): void {
      if (!this.playerData) {
        Logger.warn('[GameStateManager] Cannot track mission completion: player data not loaded');
        return;
      }

      const currentCount = this.playerData.missions.completedMissions[missionId] || 0;
      this.playerData.missions.completedMissions[missionId] = currentCount + 1;
      Logger.debug(`[GameStateManager] Mission ${missionId} completed ${currentCount + 1} times`);
    }

    /**
     * Add items to player's inventory
     */
    addItems(itemId: string, quantity: number): void {
      if (!this.playerData) {
        Logger.warn('[GameStateManager] Cannot add items: player data not loaded');
        return;
      }

      const existingItem = this.playerData.items.find(i => i.itemId === itemId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.playerData.items.push({
          itemId,
          quantity,
        });
      }
      Logger.debug(`[GameStateManager] Added ${quantity}x ${itemId} to inventory`);
    }

    /**
     * Add coins to player's balance
     */
    addCoins(amount: number): void {
      if (!this.playerData) {
        Logger.warn('[GameStateManager] Cannot add coins: player data not loaded');
        return;
      }
      this.playerData.coins += amount;
    }

    /**
     * Deduct coins from player's balance
     * Returns false if insufficient coins
     */
    deductCoins(amount: number): boolean {
      if (!this.playerData) {
        Logger.warn('[GameStateManager] Cannot deduct coins: player data not loaded');
        return false;
      }

      if (this.playerData.coins < amount) {
        Logger.warn(`[GameStateManager] Insufficient coins: need ${amount}, have ${this.playerData.coins}`);
        return false;
      }

      this.playerData.coins -= amount;
      return true;
    }

    /**
     * Get current boost level
     */
    getBoostLevel(boostId: string): number {
      if (!this.playerData) {
        Logger.warn('[GameStateManager] Cannot get boost level: player data not loaded');
        return 0;
      }
      return this.playerData.boosts?.[boostId] || 0;
    }

    /**
     * Upgrade a boost
     * Returns true if upgrade successful
     */
    upgradeBoost(boostId: string): boolean {
      if (!this.playerData) {
        Logger.warn('[GameStateManager] Cannot upgrade boost: player data not loaded');
        return false;
      }

      const currentLevel = this.getBoostLevel(boostId);

      if (currentLevel >= GAME_CONSTANTS.MAX_BOOST_LEVEL) {
        Logger.warn(`[GameStateManager] Boost ${boostId} already at max level ${GAME_CONSTANTS.MAX_BOOST_LEVEL}`);
        return false;
      }

      // Initialize boosts if not present
      if (!this.playerData.boosts) {
        this.playerData.boosts = {};
      }

      this.playerData.boosts[boostId] = currentLevel + 1;
      return true;
    }

    /**
     * Initialize a new game with starter cards
     */
    async initializeStartingCollection(): Promise<void> {
      if (!this.playerData) {
        Logger.error('[GameStateManager] Cannot initialize starting collection: player data not loaded');
        return;
      }

      // Get starter deck cards from deck builder
      const starterDeckList = getStarterDeck('Forest');
      const starterCards = starterDeckList.cards;

      Logger.info(`[GameStateManager] Initializing starter deck: ${starterDeckList.name} with ${starterCards.length} cards`);

      // Use const reference to avoid non-null assertions
      const playerData = this.playerData;

      // Create card instances and add to collection and deck
      starterCards.forEach((card: any, index: number) => {
        const instanceId = `${card.id}-${Date.now()}-${index}`;

        // Create minimal card instance
        const cardInstance: CardInstance = {
          id: instanceId,
          cardId: card.id,
          currentXP: 0, // Start at 0 XP (level 1)
        };

        playerData.cards.collected.push(cardInstance);
        playerData.cards.deck.push(cardInstance.id);
      });

      Logger.info(`[GameStateManager] Starter deck initialized with ${playerData.cards.deck.length} cards in deck and ${playerData.cards.collected.length} cards collected`);
    }

    /**
     * Add card to player's deck
     */
    addCardToDeck(cardId: string, maxDeckSize: number): boolean {
      if (!this.playerData) {
        Logger.warn('[GameStateManager] Cannot add card to deck: player data not loaded');
        return false;
      }

      if (this.playerData.cards.deck.length >= maxDeckSize) {
        Logger.warn(`[GameStateManager] Deck is full (${maxDeckSize} cards)`);
        return false;
      }

      if (!this.playerData.cards.deck.includes(cardId)) {
        this.playerData.cards.deck.push(cardId);
        return true;
      }

      return false;
    }

    /**
     * Remove card from player's deck
     */
    removeCardFromDeck(cardId: string): boolean {
      if (!this.playerData) {
        Logger.warn('[GameStateManager] Cannot remove card from deck: player data not loaded');
        return false;
      }

      const index = this.playerData.cards.deck.indexOf(cardId);
      if (index > -1) {
        this.playerData.cards.deck.splice(index, 1);
        return true;
      }

      return false;
    }
  }

  // ==================== bloombeasts\core\SoundManager.ts ====================

  /**
   * SoundManager - Handles all audio/sound operations
   * Extracted from BloomBeastsGame to separate concerns
   */


  /**
   * Manages all game audio (music and sound effects)
   */
  export class SoundManager {
    private platform: PlatformConfig;
    private currentMusic: string | null = null;
    private settings: SoundSettings | null = null;

    constructor(platform: PlatformConfig, settings?: SoundSettings) {
      this.platform = platform;
      this.settings = settings || null;
    }

    /**
     * Update settings reference (called when settings change)
     */
    updateSettings(settings: SoundSettings): void {
      this.settings = settings;
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

      if (this.settings?.musicEnabled) {
        const volume = this.settings.musicVolume / 100;
        if (!this.platform.playSound) {
          Logger.debug('[SoundManager] playSound not implemented by platform');
        } else {
          this.platform.playSound(musicId, loop, volume);
        }
      }
    }

    /**
     * Stop background music
     */
    stopMusic(): void {
      this.currentMusic = null;
      if (!this.platform.stopSound) {
        Logger.debug('[SoundManager] stopSound not implemented by platform');
      } else {
        this.platform.stopSound();
      }
    }

    /**
     * Play sound effect
     */
    playSfx(sfxId: string): void {
      if (this.settings?.sfxEnabled) {
        const volume = this.settings.sfxVolume / 100;
        if (!this.platform.playSound) {
          Logger.debug('[SoundManager] playSound not implemented by platform');
        } else {
          this.platform.playSound(sfxId, false, volume);
        }
      }
    }

    /**
     * Set music volume (0-100)
     */
    setMusicVolume(volume: number): void {
      if (!this.settings) {
        Logger.warn('[SoundManager] Cannot set music volume: settings not initialized');
        return;
      }
      this.settings.musicVolume = Math.max(0, Math.min(100, volume));
      if (this.settings.musicEnabled) {
        if (this.platform.setMusicVolume) {
          this.platform.setMusicVolume(this.settings.musicVolume / 100);
        }
      }
    }

    /**
     * Set SFX volume (0-100)
     */
    setSfxVolume(volume: number): void {
      if (!this.settings) {
        Logger.warn('[SoundManager] Cannot set SFX volume: settings not initialized');
        return;
      }
      this.settings.sfxVolume = Math.max(0, Math.min(100, volume));
      if (this.settings.sfxEnabled) {
        if (this.platform.setSfxVolume) {
          this.platform.setSfxVolume(this.settings.sfxVolume / 100);
        }
      }
    }

    /**
     * Toggle music on/off
     */
    toggleMusic(enabled: boolean): void {
      if (!this.settings) {
        Logger.warn('[SoundManager] Cannot toggle music: settings not initialized');
        return;
      }
      this.settings.musicEnabled = enabled;

      // Notify platform
      if (this.platform.setMusicEnabled) {
        this.platform.setMusicEnabled(enabled);
      }

      if (enabled && this.currentMusic) {
        // Resume music - force replay even if it's the same track
        const musicToResume = this.currentMusic;
        const volume = this.settings.musicVolume / 100;
        if (this.platform.playSound) {
          this.platform.playSound(musicToResume, true, volume);
        }
      } else if (!enabled) {
        // Stop music playback but keep track of current music for resume
        // Don't call stopMusic() as it clears this.currentMusic
        if (this.platform.stopSound) {
          this.platform.stopSound();
        }
      }
    }

    /**
     * Toggle SFX on/off
     */
    toggleSfx(enabled: boolean): void {
      if (!this.settings) {
        Logger.warn('[SoundManager] Cannot toggle SFX: settings not initialized');
        return;
      }
      this.settings.sfxEnabled = enabled;

      // Notify platform
      if (this.platform.setSfxEnabled) {
        this.platform.setSfxEnabled(enabled);
      }
    }

    /**
     * Apply sound settings to platform
     */
    applySettings(): void {
      if (!this.settings) {
        Logger.warn('[SoundManager] Cannot apply settings: settings not initialized');
        return;
      }

      if (this.platform.setMusicVolume) {
        this.platform.setMusicVolume(this.settings.musicVolume / 100);
      }
      if (this.platform.setSfxVolume) {
        this.platform.setSfxVolume(this.settings.sfxVolume / 100);
      }
      if (this.platform.setMusicEnabled) {
        this.platform.setMusicEnabled(this.settings.musicEnabled);
      }
      if (this.platform.setSfxEnabled) {
        this.platform.setSfxEnabled(this.settings.sfxEnabled);
      }
    }

    /**
     * Get current music ID
     */
    getCurrentMusic(): string | null {
      return this.currentMusic;
    }
  }

  // ==================== bloombeasts\core\BattleRewardCalculator.ts ====================

  /**
   * BattleRewardCalculator - Calculates and applies battle rewards with boost multipliers
   * Extracted from BloomBeastsGame to separate concerns
   */


  export interface BoostMap {
    [boostId: string]: number;
  }

  export interface BattleRewards {
    xpGained: number;
    beastXP: number;
    coinsReceived: number;
    cardsReceived: any[];
    itemsReceived?: any[];
    bonusRewards?: string[];
    completionTimeSeconds?: number;
  }

  /**
   * Calculates battle rewards and applies boost multipliers
   */
  export class BattleRewardCalculator {
    /**
     * Calculate and apply boost multipliers to rewards
     * Returns modified rewards object with bonus information
     */
    calculateRewards(baseRewards: BattleRewards, boosts: BoostMap): BattleRewards {
      const rewards = { ...baseRewards };

      const coinBoostLevel = boosts[COIN_BOOST.id] || 0;
      const expBoostLevel = boosts[EXP_BOOST.id] || 0;
      const luckBoostLevel = boosts[LUCK_BOOST.id] || 0;

      let coinBoostPercent = 0;
      let expBoostPercent = 0;
      let luckBoostPercent = 0;

      // Calculate and apply coin boost
      if (coinBoostLevel > 0 && COIN_BOOST.values && rewards.coinsReceived) {
        coinBoostPercent = COIN_BOOST.values[coinBoostLevel - 1];
        const multiplier = (coinBoostPercent / 100) + 1;
        rewards.coinsReceived = Math.floor(rewards.coinsReceived * multiplier);
      }

      // Calculate and apply exp boost
      if (expBoostLevel > 0 && EXP_BOOST.values) {
        expBoostPercent = EXP_BOOST.values[expBoostLevel - 1];
        const multiplier = (expBoostPercent / 100) + 1;
        rewards.xpGained = Math.floor(rewards.xpGained * multiplier);
        rewards.beastXP = Math.floor(rewards.beastXP * multiplier);
      }

      // Calculate luck boost (affects drop chances - already rolled, so no effect on this implementation)
      if (luckBoostLevel > 0 && LUCK_BOOST.values) {
        luckBoostPercent = LUCK_BOOST.values[luckBoostLevel - 1];
        // Luck boost would affect drop chances, but rewards are already generated
        // This is shown for informational purposes
      }

      // Add boost info to rewards for display
      if (!rewards.bonusRewards) {
        rewards.bonusRewards = [];
      }
      if (coinBoostPercent > 0) {
        rewards.bonusRewards.push(`Coin Boost: +${coinBoostPercent}%`);
      }
      if (expBoostPercent > 0) {
        rewards.bonusRewards.push(`EXP Boost: +${expBoostPercent}%`);
      }
      if (luckBoostPercent > 0) {
        rewards.bonusRewards.push(`Luck Boost: +${luckBoostPercent}%`);
      }

      return rewards;
    }

    /**
     * Get boost levels from player data
     */
    getBoostMap(playerBoosts?: { [boostId: string]: number }): BoostMap {
      return {
        [COIN_BOOST.id]: playerBoosts?.[COIN_BOOST.id] || 0,
        [EXP_BOOST.id]: playerBoosts?.[EXP_BOOST.id] || 0,
        [LUCK_BOOST.id]: playerBoosts?.[LUCK_BOOST.id] || 0,
      };
    }
  }

  // ==================== bloombeasts\core\UICoordinator.ts ====================

  /**
   * UICoordinator - Manages UI bindings and screen navigation
   * Extracted from BloomBeastsGame to separate concerns
   */


  /**
   * Coordinates UI updates and screen transitions
   */
  export class UICoordinator {
    private bindingManager: BindingManager;
    private onRender: () => void;
    private uiTree: UINode | null = null;

    constructor(bindingManager: BindingManager, onRender: () => void) {
      this.bindingManager = bindingManager;
      this.onRender = onRender;
    }

    /**
     * Set UI tree reference
     */
    setUITree(uiTree: UINode): void {
      this.uiTree = uiTree;
    }

    /**
     * Update binding and trigger render (common pattern)
     */
    updateBindingAndRender<T>(type: BindingType, value: T): void {
      this.bindingManager.setBinding(type, value);
      this.triggerRender();
    }

    /**
     * Trigger a render
     */
    triggerRender(): void {
      this.onRender();
    }

    /**
     * Navigate to a different screen
     */
    navigate(screen: string, onLeaderboardNavigate?: () => void): void {
      this.bindingManager.setBinding(BindingType.CurrentScreen, screen);

      // Load leaderboard data when navigating to leaderboard screen
      if (screen === 'leaderboard' && onLeaderboardNavigate) {
        onLeaderboardNavigate();
      }

      this.triggerRender();
    }

    /**
     * Update bindings from current game state
     */
    updateBindingsFromGameState(
      playerData: PlayerData,
      missionUI: IMissionSelectionUI,
      playerLevel: number
    ): void {
      // Update player data binding (screens derive what they need from this)
      this.bindingManager.setBinding(BindingType.PlayerData, playerData);

      // Update missions binding (still separate as it includes availability logic)
      missionUI.setPlayerLevel(playerLevel);
      const missionList = missionUI.getMissionList();
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

      this.bindingManager.setBinding(BindingType.Missions, displayMissions);
    }

    /**
     * Show forfeit confirmation popup
     */
    showForfeitConfirmation(onConfirm: () => void, playSfx: (sfxId: string) => void): void {
      this.bindingManager.setBinding(BindingType.ForfeitPopup, {
        title: 'Are you sure?',
        message: 'You will lose this battle.',
        buttons: [
          {
            text: 'Yes',
            onClick: onConfirm,
            color: 'red',
          },
          {
            text: 'No',
            onClick: () => {
              this.bindingManager.setBinding(BindingType.ForfeitPopup, null);
              this.triggerRender();
            },
            color: 'default',
          },
        ],
        playSfx,
      });
      this.triggerRender();
    }

    /**
     * Show card detail popup
     */
    showCardDetailPopup(
      card: any,
      durationMs: number,
      playSfx: (sfxId: string) => void,
      setTimeout: (callback: () => void, delay: number) => void,
      callback?: () => void
    ): void {
      // Set the card detail popup
      this.bindingManager.setBinding(BindingType.CardDetailPopup, {
        cardDetail: {
          card: card,
          stats: null,
        },
        onButtonClick: () => {
          // Close button clicked
          this.bindingManager.setBinding(BindingType.CardDetailPopup, null);
          this.triggerRender();
        },
        playSfx,
        hideBackdrop: true, // Hide backdrop for played card popups
      });
      this.triggerRender();

      // After duration, close the popup and execute callback
      setTimeout(() => {
        this.bindingManager.setBinding(BindingType.CardDetailPopup, null);
        this.triggerRender();
        callback?.();
      }, durationMs);
    }

    /**
     * Show mission complete popup
     */
    showMissionCompletePopup(
      mission: any,
      rewards: any,
      playSfx: (sfxId: string) => void,
      onContinue: () => void
    ): void {
      const popupData = {
        mission,
        rewards,
        chestOpened: false,
        onClaimRewards: () => {
          const current = this.bindingManager.getSnapshot(BindingType.MissionCompletePopup);
          if (current) {
            const updatedData = {
              ...current,
              chestOpened: true
            };
            this.bindingManager.setBinding(BindingType.MissionCompletePopup, updatedData);
            this.triggerRender();
          }
        },
        onContinue,
        playSfx
      };

      this.bindingManager.setBinding(BindingType.MissionCompletePopup, popupData);
      this.triggerRender();
    }

    /**
     * Show mission failed popup
     */
    showMissionFailedPopup(
      mission: any,
      playSfx: (sfxId: string) => void,
      onContinue: () => void
    ): void {
      const failedPopupProps = {
        mission,
        rewards: null, // null indicates failure
        chestOpened: false,
        onContinue,
        playSfx
      };

      this.bindingManager.setBinding(BindingType.MissionCompletePopup, failedPopupProps);
      this.triggerRender();
    }

    /**
     * Clear battle display
     */
    clearBattleDisplay(): void {
      this.bindingManager.setBinding(BindingType.BattleDisplay, null);
    }

    /**
     * Close popup and navigate
     */
    closePopupAndNavigate(screen: string): void {
      this.bindingManager.setBinding(BindingType.BattleDisplay, null);
      this.bindingManager.setBinding(BindingType.MissionCompletePopup, null);
      this.navigate(screen);
    }
  }

  // ==================== bloombeasts\core\ValidationHelpers.ts ====================

  /**
   * ValidationHelpers - Validation utilities for critical operations
   *
   * Phase 4: Code Hygiene - Add validation before critical operations
   */


  /**
   * Validation result
   */
  export interface ValidationResult {
    valid: boolean;
    errors: string[];
  }

  /**
   * ValidationHelpers - Centralized validation logic
   */
  export class ValidationHelpers {
    /**
     * Validate deck before starting battle
     */
    static validateDeck(deckCards: RuntimeCard[]): ValidationResult {
      const errors: string[] = [];

      // Check deck size
      if (!deckCards || deckCards.length === 0) {
        errors.push('Deck is empty');
        return { valid: false, errors };
      }

      if (deckCards.length < GAME_CONSTANTS.MIN_DECK_SIZE) {
        errors.push(`Deck must have at least ${GAME_CONSTANTS.MIN_DECK_SIZE} card(s) (current: ${deckCards.length})`);
      }

      // Check for valid cards
      const invalidCards = deckCards.filter(card => !card || !card.id);
      if (invalidCards.length > 0) {
        errors.push(`Deck contains ${invalidCards.length} invalid card(s)`);
      }

      // Check for duplicate instance IDs (should not happen, but safety check)
      const instanceIds = deckCards.map(c => c.instanceId).filter(Boolean);
      const uniqueIds = new Set(instanceIds);
      if (instanceIds.length !== uniqueIds.size) {
        errors.push('Deck contains duplicate card instances');
      }

      if (errors.length > 0) {
        Logger.error('[ValidationHelpers] Deck validation failed:', errors);
      }

      return {
        valid: errors.length === 0,
        errors,
      };
    }

    /**
     * Validate player data structure
     * Type guard pattern - checks if unknown data is valid PlayerData
     */
    static validatePlayerData(data: unknown): ValidationResult {
      const errors: string[] = [];

      if (!data || typeof data !== 'object') {
        errors.push('Player data is not an object');
        return { valid: false, errors };
      }

      const playerData = data as Record<string, unknown>;

      // Check required fields
      if (!playerData.name || typeof playerData.name !== 'string') {
        errors.push('Player name is missing or invalid');
      }

      if (typeof playerData.totalXP !== 'number' || playerData.totalXP < 0) {
        errors.push('Player XP is invalid');
      }

      if (typeof playerData.coins !== 'number' || playerData.coins < 0) {
        errors.push('Player coins is invalid');
      }

      // Check cards structure
      if (!playerData.cards || typeof playerData.cards !== 'object') {
        errors.push('Player cards data is missing');
      } else {
        const cards = playerData.cards as Record<string, unknown>;
        if (!Array.isArray(cards.collected)) {
          errors.push('Player collected cards must be an array');
        }
        if (!Array.isArray(cards.deck)) {
          errors.push('Player deck must be an array');
        }
      }

      // Check missions structure
      if (!playerData.missions || typeof playerData.missions !== 'object') {
        errors.push('Player missions data is missing');
      } else {
        const missions = playerData.missions as Record<string, unknown>;
        if (typeof missions.completedMissions !== 'object') {
          errors.push('Completed missions must be an object');
        }
      }

      if (errors.length > 0) {
        Logger.error('[ValidationHelpers] Player data validation failed:', errors);
      }

      return {
        valid: errors.length === 0,
        errors,
      };
    }

    /**
     * Validate battle action
     */
    static validateBattleAction(action: string, battleState: BattleState | null): ValidationResult {
      const errors: string[] = [];

      if (!action || typeof action !== 'string') {
        errors.push('Battle action is invalid');
        return { valid: false, errors };
      }

      if (!battleState) {
        errors.push('Battle state is null or undefined');
        return { valid: false, errors };
      }

      if (battleState.turboState?.isComplete) {
        errors.push('Cannot perform action - battle is already complete');
      }

      if (errors.length > 0) {
        Logger.warn('[ValidationHelpers] Battle action validation failed:', errors);
      }

      return {
        valid: errors.length === 0,
        errors,
      };
    }

    /**
     * Validate upgrade purchase
     */
    static validateUpgradePurchase(
      playerCoins: number,
      upgradeCost: number,
      upgradeId: string
    ): ValidationResult {
      const errors: string[] = [];

      if (typeof playerCoins !== 'number' || playerCoins < 0) {
        errors.push('Player coins is invalid');
        return { valid: false, errors };
      }

      if (typeof upgradeCost !== 'number' || upgradeCost < 0) {
        errors.push('Upgrade cost is invalid');
        return { valid: false, errors };
      }

      if (playerCoins < upgradeCost) {
        errors.push(`Insufficient coins for ${upgradeId} (need ${upgradeCost}, have ${playerCoins})`);
      }

      if (errors.length > 0) {
        Logger.warn('[ValidationHelpers] Upgrade validation failed:', errors);
      }

      return {
        valid: errors.length === 0,
        errors,
      };
    }

    /**
     * Validate card addition to deck
     */
    static validateCardAddition(
      cardId: string,
      currentDeckSize: number,
      maxDeckSize: number,
      cardExists: boolean
    ): ValidationResult {
      const errors: string[] = [];

      if (!cardId || typeof cardId !== 'string') {
        errors.push('Card ID is invalid');
        return { valid: false, errors };
      }

      if (!cardExists) {
        errors.push(`Card ${cardId} does not exist in collection`);
      }

      if (currentDeckSize >= maxDeckSize) {
        errors.push(`Deck is full (${maxDeckSize} cards maximum)`);
      }

      if (errors.length > 0) {
        Logger.warn('[ValidationHelpers] Card addition validation failed:', errors);
      }

      return {
        valid: errors.length === 0,
        errors,
      };
    }
  }

  // ==================== bloombeasts\core\BattleOrchestrator.ts ====================

  /**
   * BattleOrchestrator - Manages battle actions, state, and completion
   * Extracted from BloomBeastsGame to separate concerns
   */


  /**
   * Orchestrates all battle-related operations
   */
  export class BattleOrchestrator {
    private battleUI: BattleUI;
    private battleDisplayManager: BattleDisplayManager;
    private gameStateManager: GameStateManager;
    private rewardCalculator: BattleRewardCalculator;
    private uiCoordinator: UICoordinator;
    private soundManager: SoundManager;
    private asyncMethods: AsyncMethods;

    private currentBattleId: string | null = null;
    private battleStartTime: number | null = null;

    constructor(
      battleUI: BattleUI,
      battleDisplayManager: BattleDisplayManager,
      gameStateManager: GameStateManager,
      rewardCalculator: BattleRewardCalculator,
      uiCoordinator: UICoordinator,
      soundManager: SoundManager,
      asyncMethods: AsyncMethods
    ) {
      this.battleUI = battleUI;
      this.battleDisplayManager = battleDisplayManager;
      this.gameStateManager = gameStateManager;
      this.rewardCalculator = rewardCalculator;
      this.uiCoordinator = uiCoordinator;
      this.soundManager = soundManager;
      this.asyncMethods = asyncMethods;
    }

    /**
     * Initialize battle with mission ID
     */
    initializeBattle(missionId: string, playerDeckCards: RuntimeCard[], playerName: string): BattleState | null {
      const battleState = this.battleUI.initializeBattle(playerDeckCards, playerName);

      if (battleState) {
        this.currentBattleId = missionId;
        this.battleStartTime = Date.now();
      }

      return battleState;
    }

    /**
     * Get current battle ID
     */
    getCurrentBattleId(): string | null {
      return this.currentBattleId;
    }

    /**
     * Clear battle state
     */
    clearBattle(): void {
      this.currentBattleId = null;
      this.battleStartTime = null;
    }

    /**
     * Handle battle actions
     */
    async handleBattleAction(action: string): Promise<void> {
      Logger.debug('[BattleOrchestrator] handleBattleAction called with action:', action);

      // Handle timeout losses - convert to TIMEOUT action
      if (action === 'timeout-player' || action === 'timeout-opponent') {
        await this.handleTimeout(action);
        return;
      }

      // Handle forfeit button - show confirmation popup
      if (action === 'btn-forfeit' || action === 'forfeit') {
        this.uiCoordinator.showForfeitConfirmation(
          () => this.handleForfeit(),
          (sfxId: string) => this.soundManager.playSfx(sfxId)
        );
        return;
      }

      // Handle back button
      if (action === 'btn-back') {
        this.uiCoordinator.navigate('menu');
        return;
      }

      // Get current battle state
      const currentBattle = this.battleUI.getCurrentBattle();

      // Validate battle action
      const validation = ValidationHelpers.validateBattleAction(action, currentBattle);
      if (!validation.valid) {
        Logger.warn('[BattleOrchestrator] Battle action validation failed:', validation.errors);
        return;
      }

      // CRITICAL: Check if battle is already complete - prevent double processing
      if (currentBattle && currentBattle.turboState.isComplete) {
        Logger.info(`[BattleOrchestrator] Battle already complete, ignoring action: ${action}`);
        return;
      }

      // Beast and opponent clicks are now just for viewing details (no selection)
      if (action.startsWith('view-field-card-player-') || action.startsWith('view-field-card-opponent-')) {
        return;
      }

      // Parse string action to typed action
      const typedAction = parseActionString(action, 'player');
      if (!typedAction) {
        Logger.warn(`[BattleOrchestrator] Failed to parse action: ${action}`);
        return;
      }

      // Play sound effects and show animations based on action type
      if (typedAction.type === 'auto-attack-all') {
        await this.handleAutoAttackAll(typedAction);
        return;
      } else if (typedAction.type === 'attack-beast') {
        this.soundManager.playSfx(SOUND_EFFECTS.ATTACK);
      } else if (typedAction.type === 'attack-player') {
        this.soundManager.playSfx(SOUND_EFFECTS.ATTACK);
        if (typedAction.attackerIndex !== undefined) {
          await this.showAttackAnimation('player', typedAction.attackerIndex, 'health', undefined);
        }
      } else if (typedAction.type === 'play-card') {
        this.soundManager.playSfx(SOUND_EFFECTS.PLAY_CARD);
      } else if (action.startsWith('activate-trap-')) {
        this.soundManager.playSfx(SOUND_EFFECTS.TRAP_ACTIVATED);
      } else if (typedAction.type === 'end-turn') {
        this.soundManager.playSfx(SOUND_EFFECTS.MENU_BUTTON_SELECT);
      }

      // Process action
      await this.battleUI.processTypedAction(typedAction, {});

      // Immediately update display after action to show cards instantly
      const immediateState = this.battleUI.getCurrentBattle();
      if (immediateState && !immediateState.turboState?.isComplete) {
        const mission = this.battleUI.getMissionManager().getCurrentMission();
        const progress = this.battleUI.getMissionManager().getProgress();
        const immediateDisplay = this.battleDisplayManager.createBattleDisplay(
          immediateState,
          undefined,
          mission,
          progress
        );
        if (immediateDisplay) {
          this.uiCoordinator.updateBindingAndRender(BindingType.BattleDisplay, immediateDisplay);
        }
      }

      // Get updated battle state
      const updatedState = this.battleUI.getCurrentBattle();
      if (updatedState) {
        // Check if battle ended FIRST - never render after completion
        if (updatedState.turboState?.isComplete) {
          await this.handleBattleComplete(updatedState);
          return;
        }

        // Create updated battle display with fresh state
        const mission = this.battleUI.getMissionManager().getCurrentMission();
        const progress = this.battleUI.getMissionManager().getProgress();
        const updatedDisplay = this.battleDisplayManager.createBattleDisplay(
          updatedState,
          undefined,
          mission,
          progress
        );

        if (updatedDisplay) {
          this.uiCoordinator.updateBindingAndRender(BindingType.BattleDisplay, updatedDisplay);
        }
      }
    }

    /**
     * Handle auto-attack-all action with animations
     */
    private async handleAutoAttackAll(typedAction: BattleAction): Promise<void> {
      this.soundManager.playSfx(SOUND_EFFECTS.ATTACK);

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
        if (updatedState.turboState?.isComplete) {
          await this.handleBattleComplete(updatedState);
          return;
        }

        const mission = this.battleUI.getMissionManager().getCurrentMission();
        const progress = this.battleUI.getMissionManager().getProgress();
        const updatedDisplay = this.battleDisplayManager.createBattleDisplay(
          updatedState,
          undefined,
          mission,
          progress
        );
        if (updatedDisplay) {
          this.uiCoordinator.updateBindingAndRender(BindingType.BattleDisplay, updatedDisplay);
        }
      }
    }

    /**
     * Handle timeout action
     */
    private async handleTimeout(action: string): Promise<void> {
      const timedOutPlayerId = action === 'timeout-player' ? 'player' : 'opponent';

      const currentBattle = this.battleUI.getCurrentBattle();
      if (currentBattle && currentBattle.turboState) {
        const currentPlayerId = currentBattle.turboState.turnInfo.currentPlayerId;

        // Process TIMEOUT action through TURBO
        await this.battleUI.processTypedAction({
          type: 'timeout',
          playerId: currentPlayerId,
          timedOutPlayerId,
          timestamp: Date.now()
        });

        // Check if battle ended and handle completion
        const updatedState = this.battleUI.getCurrentBattle();
        if (updatedState && updatedState.turboState?.isComplete) {
          await this.handleBattleComplete(updatedState);
        }
      }
    }

    /**
     * Handle forfeit - player gives up
     */
    private async handleForfeit(): Promise<void> {
      // Close popup
      this.uiCoordinator.updateBindingAndRender(BindingType.ForfeitPopup, null);

      // Play lose sound
      this.soundManager.playSfx(SOUND_EFFECTS.LOSE);

      // Process FORFEIT action through TURBO
      await this.battleUI.processTypedAction(BattleActions.forfeit('player'));

      // Check if battle ended and handle completion
      const updatedState = this.battleUI.getCurrentBattle();
      if (updatedState && updatedState.turboState?.isComplete) {
        await this.handleBattleComplete(updatedState);
      }
    }

    /**
     * Handle battle completion (victory or defeat)
     */
    async handleBattleComplete(battleState: BattleState): Promise<void> {
      const playerData = this.gameStateManager.getPlayerDataOrNull();
      if (!playerData) return;

      Logger.info('[BattleOrchestrator] handleBattleComplete called');

      const battleId = this.currentBattleId;
      this.currentBattleId = null;

      // Use the BattleController's checkBattleEnd to get the proper winner
      // This checks ALL win conditions: health, deck-out, sudden end, etc.
      const battleResult = this.battleUI.getCurrentBattle();
      if (!battleResult) {
        Logger.error('[BattleOrchestrator] No battle result available');
        return;
      }

      // Import WinConditionChecker to properly determine winner
      // Player is always players[0] with id 'player', opponent is players[1] with id 'opponent'
      const players = battleState.turboState.gameData.players;
      const playerHealth = players[0].health;
      const opponentHealth = players[1].health;

      // Determine winner using the same logic as WinConditionChecker
      let playerWon = false;

      // Check sudden end (timeout/forfeit/disconnect) first (highest priority)
      const suddenEnd = battleState.turboState.gameData.suddenEnd;
      if (suddenEnd) {
        // If opponent caused sudden end, player wins
        playerWon = suddenEnd.playerId !== 'player';
        Logger.info(`[BattleOrchestrator] Sudden end by ${suddenEnd.playerId}, player won: ${playerWon}`);
      } else {
        // Check health-based win
        if (opponentHealth <= 0 && playerHealth > 0) {
          playerWon = true;
          Logger.info('[BattleOrchestrator] Player won by health');
        } else if (playerHealth <= 0 && opponentHealth > 0) {
          playerWon = false;
          Logger.info('[BattleOrchestrator] Player lost by health');
        } else {
          // Check deck-out win
          const playerHasCards = players[0].deck.length > 0 || players[0].hand.length > 0;
          const opponentHasCards = players[1].deck.length > 0 || players[1].hand.length > 0;

          if (!opponentHasCards && playerHasCards) {
            playerWon = true;
            Logger.info('[BattleOrchestrator] Player won by deck-out (opponent has no cards)');
          } else if (!playerHasCards && opponentHasCards) {
            playerWon = false;
            Logger.info('[BattleOrchestrator] Player lost by deck-out (player has no cards)');
          } else {
            // Both dead or both decked out = tie (treat as loss)
            playerWon = false;
            Logger.info('[BattleOrchestrator] Tie game (treated as loss)');
          }
        }
      }

      // Get mission before any updates (needed for popups later)
      const missionManager = this.battleUI.getMissionManager();
      const mission = missionManager.getCurrentMission();

      if (playerWon) {
        // CRITICAL: Update mission progress with final health values AND mark opponent as defeated
        // This sets progress.isCompleted = true, which is required for completeMission() to return rewards

        // Update health first (needed for checkMissionCompletion to work)
        missionManager.updateProgress('health-update', {
          playerHealth: playerHealth,
          opponentHealth: opponentHealth
        });
        Logger.info(`[BattleOrchestrator] Updated health - Player: ${playerHealth}, Opponent: ${opponentHealth}`);

        // Then mark opponent as defeated (this calls checkMissionCompletion)
        missionManager.updateProgress('opponent-defeated', {});
        Logger.info('[BattleOrchestrator] Updated mission progress - opponent defeated');

        // Debug: Check if mission is actually completed
        const progress = missionManager.getProgress();
        Logger.info(`[BattleOrchestrator] Mission progress.isCompleted: ${progress?.isCompleted}`);

        // Victory!
        await this.handleVictory(battleState, playerData, battleId, mission);
      } else {
        // Defeat
        await this.handleDefeat(battleState, mission);
      }

      // Resume background music
      this.soundManager.playMusic('music-background', true);
    }

    /**
     * Handle victory scenario
     */
    private async handleVictory(battleState: BattleState, playerData: PlayerData, battleId: string | null, mission: any): Promise<void> {
      Logger.info('[BattleOrchestrator] VICTORY! Showing rewards popup');

      // Complete the mission and get rewards
      const missionManager = this.battleUI.getMissionManager();

      // Debug: Check mission manager state before completing
      const progress = missionManager.getProgress();
      Logger.info(`[BattleOrchestrator] Before completeMission - mission: ${!!mission}, progress: ${!!progress}, isCompleted: ${progress?.isCompleted}`);
      if (mission) {
        Logger.info(`[BattleOrchestrator] Mission ID: ${mission.id}`);
      }

      const rewardResult = missionManager.completeMission();

      if (!rewardResult) {
        Logger.error('[BattleOrchestrator] No rewards received from mission completion');
        Logger.error(`[BattleOrchestrator] Debug info - mission existed: ${!!mission}, progress existed: ${!!progress}, was completed: ${progress?.isCompleted}`);
        return;
      }

      // Convert RewardResult to BattleRewards format
      const rewards: BattleRewards = {
        xpGained: rewardResult.xpGained,
        beastXP: rewardResult.beastXP,
        coinsReceived: rewardResult.coinsReceived || 0,
        cardsReceived: rewardResult.cardsReceived,
        itemsReceived: rewardResult.itemsReceived,
        completionTimeSeconds: rewardResult.completionTimeSeconds,
      };

      // Apply boost multipliers to rewards
      const boostMap = this.rewardCalculator.getBoostMap(playerData.boosts);
      const boostedRewards = this.rewardCalculator.calculateRewards(rewards, boostMap);

      // Award XP
      this.gameStateManager.addXP(boostedRewards.xpGained);

      // Award card XP directly to deck cards
      const cardXP = boostedRewards.beastXP || boostedRewards.xpGained;
      awardDeckExperience(
        cardXP,
        playerData.cards.deck,
        playerData.cards.collected
      );

      // Add cards directly to collection
      boostedRewards.cardsReceived.forEach((card: AnyCard, index: number) => {
        addCardReward(card, playerData.cards.collected, index);
      });

      // Add coins
      if (boostedRewards.coinsReceived) {
        this.gameStateManager.addCoins(boostedRewards.coinsReceived);
      }

      // Add items to inventory
      if (boostedRewards.itemsReceived) {
        boostedRewards.itemsReceived.forEach((itemReward: ItemRewardResult) => {
          this.gameStateManager.addItems(itemReward.itemId, itemReward.quantity);
        });
      }

      // Track mission completion
      if (battleId) {
        this.gameStateManager.trackMissionCompletion(battleId);

        // If this is Cluck Norris mission, submit time to leaderboard
        if (battleId === GAME_CONSTANTS.MISSION_CLUCK_NORRIS_ID && this.battleStartTime) {
          const completionTime = (Date.now() - this.battleStartTime) / 1000;
          // Submit time to leaderboard
          this.gameStateManager.submitCluckNorrisTime(completionTime);
          Logger.info(`[BattleOrchestrator] Submitted Cluck Norris completion time: ${completionTime}s`);
        }
      }

      // Reset battle start time
      this.battleStartTime = null;

      // Play win sound
      this.soundManager.playSfx(SOUND_EFFECTS.WIN);

      // Show mission complete popup
      // NOTE: Use mission parameter captured before completeMission(),
      // because completeMission() clears the mission manager's currentMission
      this.uiCoordinator.showMissionCompletePopup(
        mission,
        boostedRewards,
        (sfxId: string) => this.soundManager.playSfx(sfxId),
        () => this.uiCoordinator.closePopupAndNavigate('missions')
      );
    }

    /**
     * Handle defeat scenario
     */
    private async handleDefeat(battleState: BattleState, mission: any): Promise<void> {
      Logger.info('[BattleOrchestrator] DEFEAT! Showing failed popup');

      // Reset battle start time
      this.battleStartTime = null;

      // Play lose sound
      this.soundManager.playSfx(SOUND_EFFECTS.LOSE);

      // Show mission failed popup
      this.uiCoordinator.showMissionFailedPopup(
        mission,
        (sfxId: string) => this.soundManager.playSfx(sfxId),
        () => this.uiCoordinator.closePopupAndNavigate('missions')
      );
    }

    /**
     * Show attack animation
     */
    async showAttackAnimation(
      attackerPlayer: 'player' | 'opponent',
      attackerIndex: number,
      targetPlayer: 'player' | 'opponent' | 'health',
      targetIndex?: number
    ): Promise<void> {
      const currentState = this.battleUI.getCurrentBattle();
      if (!currentState) return;

      const mission = this.battleUI.getMissionManager().getCurrentMission();
      const progress = this.battleUI.getMissionManager().getProgress();

      // Show animation (attacker glows green, target glows red)
      const displayWithAnimation = this.battleDisplayManager.createBattleDisplay(
        currentState,
        {
          attackerPlayer,
          attackerIndex,
          targetPlayer,
          targetIndex
        },
        mission,
        progress
      );

      if (displayWithAnimation) {
        this.uiCoordinator.updateBindingAndRender(BindingType.BattleDisplay, displayWithAnimation);
      }

      // Wait for animation duration
      await new Promise(resolve => this.asyncMethods.setTimeout(resolve, GAME_CONSTANTS.ATTACK_ANIMATION_DURATION_MS));

      // CRITICAL: Refresh state before clearing animation (state may have changed during delay)
      const updatedState = this.battleUI.getCurrentBattle();
      if (!updatedState) return;

      // Clear animation with fresh state
      const displayWithoutAnimation = this.battleDisplayManager.createBattleDisplay(
        updatedState,
        undefined
      );

      if (displayWithoutAnimation) {
        this.uiCoordinator.updateBindingAndRender(BindingType.BattleDisplay, displayWithoutAnimation);
      }
    }
  }

  // ==================== bloombeasts\core\CoreSystemsInitializer.ts ====================

  /**
   * CoreSystemsInitializer - Centralized core system initialization
   *
   * Extracts core system setup from BloomBeastsGame constructor.
   * Reduces god object complexity by delegating initialization logic.
   */


  /**
   * Collection of all core game systems
   */
  export interface CoreSystems {
    missionManager: MissionManager;
    missionUI: MissionSelectionUI;
    battleUI: BattleUI;
    battleDisplayManager: BattleDisplayManager;
    gameStateManager: GameStateManager;
    soundManager: SoundManager;
    rewardCalculator: BattleRewardCalculator;
    uiCoordinator: UICoordinator;
    battleOrchestrator: BattleOrchestrator;
  }

  /**
   * CoreSystemsInitializer - Initializes all core game systems
   */
  export class CoreSystemsInitializer {
    /**
     * Initialize all core game systems
     */
    static initializeSystems(
      platform: PlatformConfig,
      ui: UIMethodMappings,
      asyncMethods: AsyncMethods,
      onSubmitScore: (type: 'experience' | 'cluckNorris', score: number) => void,
      onTriggerRender: () => void
    ): CoreSystems {
      // Initialize catalog manager for utilities
      setCatalogManagerForUtils(platform.catalogManager);
      setCatalogManagerForDeckBuilder(platform.catalogManager);
      setCatalogManagerForMissions(platform.catalogManager);

      // Mission systems
      const missionManager = new MissionManager(platform.catalogManager);
      const missionUI = new MissionSelectionUI(missionManager);

      // Battle systems
      const battleUI = new BattleUI(missionManager, asyncMethods);
      const battleDisplayManager = new BattleDisplayManager(platform.catalogManager);

      // Core managers
      const gameStateManager = new GameStateManager(onSubmitScore);
      const soundManager = new SoundManager(platform);
      const rewardCalculator = new BattleRewardCalculator();
      const uiCoordinator = new UICoordinator(ui.bindingManager, onTriggerRender);

      // Battle orchestrator (coordinates battle systems)
      const battleOrchestrator = new BattleOrchestrator(
        battleUI,
        battleDisplayManager,
        gameStateManager,
        rewardCalculator,
        uiCoordinator,
        soundManager,
        asyncMethods
      );

      return {
        missionManager,
        missionUI,
        battleUI,
        battleDisplayManager,
        gameStateManager,
        soundManager,
        rewardCalculator,
        uiCoordinator,
        battleOrchestrator,
      };
    }
  }

  // ==================== bloombeasts\core\ActionHandler.ts ====================

  /**
   * ActionHandler - Handles all user actions and events
   *
   * Extracted from BloomBeastsGame to reduce its size and improve maintainability.
   * Centralizes all user interaction handling (button clicks, card selection, etc.)
   */


  export interface ActionHandlerConfig {
    systems: CoreSystems;
    asyncMethods: AsyncMethods;
    navigate: (screen: string) => void;
    saveGameData: () => Promise<void>;
    updateBindingsFromGameState: () => Promise<void>;
  }

  /**
   * Handles all user actions and interactions
   */
  export class ActionHandler {
    private systems: CoreSystems;
    private asyncMethods: AsyncMethods;
    private navigate: (screen: string) => void;
    private saveGameData: () => Promise<void>;
    private updateBindingsFromGameState: () => Promise<void>;

    constructor(config: ActionHandlerConfig) {
      this.systems = config.systems;
      this.asyncMethods = config.asyncMethods;
      this.navigate = config.navigate;
      this.saveGameData = config.saveGameData;
      this.updateBindingsFromGameState = config.updateBindingsFromGameState;
    }

    /**
     * Handle button clicks (navigation, back buttons, etc.)
     */
    async handleButtonClick(buttonId: string): Promise<void> {
      // Play button sound
      this.systems.soundManager.playSfx(SOUND_EFFECTS.MENU_BUTTON_SELECT);

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
        default:
      }
    }

    /**
     * Show card detail popup for a duration, then close and execute callback
     */
    showCardDetailPopup(card: any, durationMs: number, callback?: () => void): void {
      this.systems.uiCoordinator.showCardDetailPopup(
        card,
        durationMs,
        (sfxId: string) => this.systems.soundManager.playSfx(sfxId),
        (cb: () => void, delay: number) => this.asyncMethods.setTimeout(cb, delay),
        callback
      );
    }

    /**
     * Handle card selection (add/remove from deck)
     */
    async handleCardSelect(cardId: string): Promise<void> {
      const playerData = this.systems.gameStateManager.getPlayerDataOrNull();
      if (!playerData) return;

      // Play menu button sound
      this.systems.soundManager.playSfx(SOUND_EFFECTS.MENU_BUTTON_SELECT);

      const cardEntry = playerData.cards.collected.find(c => c.id === cardId);
      if (!cardEntry) return;

      // Check if card is in deck
      const isInDeck = playerData.cards.deck.includes(cardId);

      // Toggle card in/out of deck
      if (isInDeck) {
        if (this.systems.gameStateManager.removeCardFromDeck(cardId)) {
          await this.saveGameData();
          await this.updateBindingsFromGameState();
        }
      } else {
        if (this.systems.gameStateManager.addCardToDeck(cardId, DECK_SIZE)) {
          await this.saveGameData();
          await this.updateBindingsFromGameState();
        }
      }
    }

    /**
     * Handle mission selection and battle initialization
     */
    async handleMissionSelect(missionId: string): Promise<void> {
      Logger.info(`Mission selected: ${missionId}`);
      const playerData = this.systems.gameStateManager.getPlayerDataOrNull();
      if (!playerData) return;

      // Play menu button sound
      this.systems.soundManager.playSfx(SOUND_EFFECTS.MENU_BUTTON_SELECT);

      // Check if player has cards in deck
      if (playerData.cards.deck.length === 0) {
        Logger.warn('No cards in deck');
        return;
      }

      // Get player's deck cards
      const playerDeckCards = getPlayerDeckCards(
        playerData.cards.deck,
        playerData.cards.collected
      );

      if (playerDeckCards.length === 0) {
        Logger.error('Failed to load deck cards');
        return;
      }

      // Validate deck before starting battle
      const deckValidation = ValidationHelpers.validateDeck(playerDeckCards);
      if (!deckValidation.valid) {
        Logger.error('[ActionHandler] Deck validation failed:', deckValidation.errors);
        // Could show error popup to user here in future
        return;
      }

      // Start the mission
      const success = this.systems.missionUI.startMission(missionId);

      if (success) {
        // Initialize battle using BattleOrchestrator
        const battleState = this.systems.battleOrchestrator.initializeBattle(missionId, playerDeckCards, playerData.name);

        if (battleState) {
          // Set up render callback for battle UI to update display during AI turns
          this.systems.battleUI.setRenderCallback(() => {
            const currentBattle = this.systems.battleUI.getCurrentBattle();
            if (currentBattle && !currentBattle.turboState.isComplete) {
              const mission = this.systems.battleUI.getMissionManager().getCurrentMission();
              const progress = this.systems.battleUI.getMissionManager().getProgress();
              const updatedDisplay = this.systems.battleDisplayManager.createBattleDisplay(
                currentBattle,
                undefined,
                mission,
                progress
              );
              if (updatedDisplay) {
                this.systems.uiCoordinator.updateBindingAndRender(BindingType.BattleDisplay, updatedDisplay);
              }
            }
          });

          // Create battle display from battle state
          const battleDisplay = this.systems.battleDisplayManager.createBattleDisplay(
            battleState,
            undefined
          );

          // Update battle display binding and navigate
          if (battleDisplay) {
            this.systems.uiCoordinator.updateBindingAndRender(BindingType.BattleDisplay, battleDisplay);
          }

          this.navigate('battle');

          // Play battle music
          this.systems.soundManager.playMusic(MUSIC_TRACKS.BATTLE, true);

          Logger.info('Battle initialized successfully');
        }
      } else {
        Logger.warn('Mission is not available');
      }
    }

    /**
     * Handle settings changes
     */
    handleSettingsChange(settingId: string, value: any): void {
      const playerData = this.systems.gameStateManager.getPlayerDataOrNull();
      if (!playerData) return;

      // Play button sound for toggles (not sliders)
      if (settingId === 'musicEnabled' || settingId === 'sfxEnabled') {
        this.systems.soundManager.playSfx(SOUND_EFFECTS.MENU_BUTTON_SELECT);
      }

      // Apply settings via sound manager
      switch (settingId) {
        case 'musicVolume':
          this.systems.soundManager.setMusicVolume(value);
          break;
        case 'sfxVolume':
          this.systems.soundManager.setSfxVolume(value);
          break;
        case 'musicEnabled':
          this.systems.soundManager.toggleMusic(value);
          break;
        case 'sfxEnabled':
          this.systems.soundManager.toggleSfx(value);
          break;
      }

      // Save settings and update binding
      this.systems.uiCoordinator.updateBindingAndRender(BindingType.PlayerData, playerData);
      this.saveGameData();
    }

    /**
     * Handle upgrade purchase
     */
    handleUpgrade(boostId: string): void {
      const playerData = this.systems.gameStateManager.getPlayerDataOrNull();
      if (!playerData) return;

      const currentLevel = this.systems.gameStateManager.getBoostLevel(boostId);

      // Check if already at max level
      if (currentLevel >= GAME_CONSTANTS.MAX_BOOST_LEVEL) {
        return;
      }

      // Get cost for next level
      const costs = UPGRADE_COSTS[boostId];
      if (!costs) return;

      const cost = costs[currentLevel];

      // Deduct coins (returns false if insufficient)
      if (!this.systems.gameStateManager.deductCoins(cost)) {
        return;
      }

      // Upgrade boost
      if (!this.systems.gameStateManager.upgradeBoost(boostId)) {
        // Refund if upgrade failed
        this.systems.gameStateManager.addCoins(cost);
        return;
      }

      // Play upgrade sound (special sound for rooster)
      if (boostId === ROOSTER.id) {
        this.systems.soundManager.playSfx(SOUND_EFFECTS.UPGRADE_ROOSTER);
      } else {
        this.systems.soundManager.playSfx(SOUND_EFFECTS.UPGRADE);
      }

      // Save and update
      this.systems.uiCoordinator.updateBindingAndRender(BindingType.PlayerData, playerData);
      this.saveGameData();
    }

    /**
     * Handle battle actions
     * Delegates to BattleOrchestrator
     */
    async handleBattleAction(action: string, battleScreen?: BattleScreen): Promise<void> {
      // Stop all timers when battle completes
      if (battleScreen) {
        const currentBattle = this.systems.battleUI.getCurrentBattle();
        const wasComplete = currentBattle?.turboState.isComplete;

        await this.systems.battleOrchestrator.handleBattleAction(action);

        // Check if battle just completed and cleanup if needed
        const updatedBattle = this.systems.battleUI.getCurrentBattle();
        if (!wasComplete && updatedBattle?.turboState.isComplete) {
          battleScreen.cleanup();

          // Save game data and refresh bindings when battle completes
          // This ensures mission list shows newly unlocked missions
          await this.saveGameData();
          await this.updateBindingsFromGameState();
          return;
        }
      } else {
        await this.systems.battleOrchestrator.handleBattleAction(action);
      }

      // Save game data after battle actions
      await this.saveGameData();
    }
  }

  // ==================== bloombeasts\core\DataManager.ts ====================

  /**
   * DataManager - Handles all data persistence and state synchronization
   *
   * Extracted from BloomBeastsGame to reduce its size and improve maintainability.
   * Centralizes save/load operations, binding updates, and leaderboard management.
   */


  export interface DataManagerConfig {
    platform: PlatformConfig;
    systems: CoreSystems;
    bindingManager: BindingManager;
    validatePlayerData: (data: any) => data is PlayerData;
  }

  /**
   * Manages data persistence, state synchronization, and leaderboards
   */
  export class DataManager {
    private platform: PlatformConfig;
    private systems: CoreSystems;
    private bindingManager: BindingManager;
    private validatePlayerData: (data: any) => data is PlayerData;

    constructor(config: DataManagerConfig) {
      this.platform = config.platform;
      this.systems = config.systems;
      this.bindingManager = config.bindingManager;
      this.validatePlayerData = config.validatePlayerData;
    }

    /**
     * Load game data from platform storage
     */
    async loadGameData(): Promise<void> {
      try {
        if (!this.platform.getPlayerData) {
          throw new Error('Platform does not support getPlayerData');
        }

        const savedData = this.platform.getPlayerData();

        if (!savedData || Object.keys(savedData).length === 0) {
          throw new Error('Platform must provide valid PlayerData (either loaded or newly created)');
        }

        // Validate data structure
        if (!this.validatePlayerData(savedData)) {
          Logger.error('[DataManager] Player data validation failed - attempting recovery');
          throw new Error('Invalid player data structure');
        }

        // Set player data in game state manager
        this.systems.gameStateManager.setPlayerData(savedData);
        Logger.info(`[DataManager] Loaded player data for "${savedData.name}" with ${savedData.cards.collected.length} cards`);

        Logger.info(`[DataManager] Restored deck with ${savedData.cards.deck.length} cards`);

        // Apply sound settings to platform
        if (savedData.settings) {
          this.systems.soundManager.updateSettings(savedData.settings);
          this.systems.soundManager.applySettings();
        }

        // Load completed missions into MissionManager
        this.systems.missionManager.loadCompletedMissions(savedData.missions.completedMissions);

        // Initialize starting cards if collection is empty
        if (savedData.cards.collected.length === 0) {
          Logger.info('[DataManager] Initializing starting card collection');
          await this.systems.gameStateManager.initializeStartingCollection();
          await this.saveGameData();
        }

        // Save to ensure data persists
        await this.saveGameData();
      } catch (error) {
        Logger.error('[DataManager] Failed to load game data:', error);
        throw error; // Re-throw to let caller handle initialization failure
      }
    }

    /**
     * Save game data to platform storage
     */
    async saveGameData(): Promise<void> {
      const playerData = this.systems.gameStateManager.getPlayerDataOrNull();
      if (!playerData) {
        const error = new Error('[DataManager] Cannot save invalid player data - critical error');
        Logger.error(error.message);
        throw error;
      }

      try {
        if (!this.platform.setPlayerData) {
          Logger.warn('[DataManager] Platform does not support setPlayerData - save skipped');
          return;
        }

        this.platform.setPlayerData(playerData);
        Logger.info('[DataManager] Player data saved successfully');
      } catch (error) {
        Logger.error('[DataManager] Failed to save player data:', error);
        // Don't throw - allow game to continue even if save failed
        // User will see warning but won't lose current session
      }
    }

    /**
     * Update bindings from current game state
     * This syncs the UI bindings with the actual game state
     */
    async updateBindingsFromGameState(): Promise<void> {
      const playerData = this.systems.gameStateManager.getPlayerData();
      const playerLevel = this.systems.gameStateManager.getPlayerLevel();
      this.systems.uiCoordinator.updateBindingsFromGameState(playerData, this.systems.missionUI, playerLevel);
    }

    /**
     * Load leaderboard data from world variables
     */
    loadLeaderboardData(): void {
      if (!this.platform.getWorldVariable) {
        // World variables not supported on this platform, use mock data
        this.bindingManager.setBinding(BindingType.LeaderboardData, {
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
          this.bindingManager.setBinding(BindingType.LeaderboardData, leaderboardData);
        } else {
          // No data yet, set empty arrays
          this.bindingManager.setBinding(BindingType.LeaderboardData, {
            topExperience: [],
            fastestCluckNorris: [],
          });
        }
      } catch (error) {
        Logger.error('[DataManager] Failed to load leaderboard data:', error);
        this.bindingManager.setBinding(BindingType.LeaderboardData, {
          topExperience: [],
          fastestCluckNorris: [],
        });
      }
    }

    /**
     * Submit player score to leaderboard via network event
     */
    submitLeaderboardScore(type: 'experience' | 'cluckNorris', score: number): void {
      if (!this.platform.sendNetworkEvent) return;

      const playerData = this.systems.gameStateManager.getPlayerDataOrNull();
      if (!playerData) {
        Logger.warn('[DataManager] Cannot submit score: player data not loaded');
        return;
      }

      try {
        const eventData = {
          playerName: playerData.name || 'Unknown Player',
          type,
          score,
          level: type === 'experience' ? this.systems.gameStateManager.getPlayerLevel() : undefined,
        };

        this.platform.sendNetworkEvent('leaderboard_score_submit', eventData);
      } catch (error) {
        Logger.error('[DataManager] Failed to submit leaderboard score:', error);
      }
    }
  }

  // ==================== bloombeasts\common\ui\screens\MissionCompletePopup.ts ====================

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

  // ==================== bloombeasts\common\ui\screens\ButtonPopup.ts ====================

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

  // ==================== bloombeasts\core\UIBuilder.ts ====================

  /**
   * UIBuilder - Creates the main UI tree structure
   *
   * Extracted from BloomBeastsGame to reduce its size and improve maintainability.
   * Handles UI tree creation with conditional screen rendering and popups.
   */


  export interface UIBuilderConfig {
    ui: UIMethodMappings;
    screens: GameScreens;
  }

  /**
   * Builds the main UI tree with conditional screen rendering
   */
  export class UIBuilder {
    private ui: UIMethodMappings;
    private screens: GameScreens;

    constructor(config: UIBuilderConfig) {
      this.ui = config.ui;
      this.screens = config.screens;
    }

    /**
     * Create the main UI tree
     * This is created once and updated reactively via bindings
     */
    createUI(): UINode {
      const { View } = this.ui;

      // Build main UI with conditional screens
      const children: any[] = [
        this.ui.UINode ? this.ui.UINode.if( this.ui.bindingManager.derive([BindingType.CurrentScreen], (current: string) => current === 'loading'), this.createLoadingScreen()) : null,
        this.ui.UINode ? this.ui.UINode.if( this.ui.bindingManager.derive([BindingType.CurrentScreen], (current: string) => current === 'menu'), this.screens.menuScreen.createUI()) : null,
        this.ui.UINode ? this.ui.UINode.if( this.ui.bindingManager.derive([BindingType.CurrentScreen], (current: string) => current === 'cards'), this.screens.cardsScreen.createUI()) : null,
        this.ui.UINode ? this.ui.UINode.if( this.ui.bindingManager.derive([BindingType.CurrentScreen], (current: string) => current === 'upgrades'), this.screens.upgradeScreen.createUI()) : null,
        this.ui.UINode ? this.ui.UINode.if( this.ui.bindingManager.derive([BindingType.CurrentScreen], (current: string) => current === 'missions'), this.screens.missionScreen.createUI()) : null,
        this.ui.UINode ? this.ui.UINode.if( this.ui.bindingManager.derive([BindingType.CurrentScreen], (current: string) => current === 'battle'), this.screens.battleScreen.createUI()) : null,
        this.ui.UINode ? this.ui.UINode.if( this.ui.bindingManager.derive([BindingType.CurrentScreen], (current: string) => current === 'settings'), this.screens.settingsScreen.createUI()) : null,
        this.ui.UINode ? this.ui.UINode.if( this.ui.bindingManager.derive([BindingType.CurrentScreen], (current: string) => current === 'leaderboard'), this.screens.leaderboardScreen.createUI()) : null,
      ];

      // Add popups (these already use UINode.if)
      // Mission Complete Popup - static structure with derived content
      if (this.ui.UINode) {
        children.push(
          this.ui.UINode.if(
            this.ui.bindingManager.derive([BindingType.MissionCompletePopup], (props: any) => {
              return props !== null;
            }),
            createMissionCompletePopup(this.ui, this.ui.bindingManager)
          )
        );
      }

      // Forfeit Popup - static structure with derived content
      if (this.ui.UINode) {
        children.push(
          this.ui.UINode.if(
            this.ui.bindingManager.derive([BindingType.ForfeitPopup], (props: any) => {
              return props !== null;
            }),
            createButtonPopup(this.ui, this.ui.bindingManager)
          )
        );
      }

      // Card Detail Popup
      if (this.ui.UINode) {
        children.push(
          this.ui.UINode.if(
            this.ui.bindingManager.derive([BindingType.CardDetailPopup], (props: any) => {
              return props !== null;
            }),
            createReactiveCardDetailPopupFromBinding(this.ui)
          )
        );
      }

      return View({
        style: {
          width: '100%',
          height: '100%',
          position: 'relative',
        },
        children,
      });
    }

    /**
     * Create the loading screen UI
     */
    private createLoadingScreen(): UINode {
      const { View } = this.ui;

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
            children: this.ui.Text({
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

  // Screen imports now in ScreenFactory
  // Popup imports now in UIBuilder
  // Mission and Battle systems now imported via CoreSystemsInitializer
  // Core managers now imported via CoreSystemsInitializer

  // Import and re-export all types from organized type directory

  // Export types for regular module bundling (web deployment)
  // Note: These exports are fine for namespace bundling too

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

    // Core game systems - initialized via CoreSystemsInitializer
    private systems: CoreSystems;

    // Game state
    private isInitializing: boolean = true;  // Prevent renders during initialization


    // Screen instances - created via ScreenFactory
    private screens: GameScreens;

    // Action handler - centralizes all user action handling
    private actionHandler: ActionHandler;

    // Data manager - handles save/load/bindings/leaderboards
    private dataManager: DataManager;

    // UI builder - creates the main UI tree structure
    private uiBuilder: UIBuilder;

    // UI tree (created once, updated reactively)
    // Public so platform wrappers can access it (needed for Horizon's initializeUI)
    public uiTree: UINode | null = null;

    constructor(config: PlatformConfig) {
      this.platform = config;

      // Get platform-specific async methods
      this.asyncMethods = config.async;

      // Store platform-provided asset getters
      this.platformGetImageAsset = config.getImageAsset;

      // Get platform-specific UI methods and add bindingManager to them
      this.UI = config.getUIMethodMappings() as UIMethodMappings;

      // Initialize all core systems using CoreSystemsInitializer
      this.systems = CoreSystemsInitializer.initializeSystems(
        this.platform,
        this.UI,
        this.asyncMethods,
        (type, score) => this.submitLeaderboardScore(type, score),
        () => this.triggerRender()
      );

      // Initialize data manager (before actionHandler, as actionHandler uses its methods)
      this.dataManager = new DataManager({
        platform: this.platform,
        systems: this.systems,
        bindingManager: this.UI.bindingManager,
        validatePlayerData: this.validatePlayerData.bind(this),
      });

      // Initialize action handler (before screens, as screens use its methods)
      this.actionHandler = new ActionHandler({
        systems: this.systems,
        asyncMethods: this.asyncMethods,
        navigate: this.navigate.bind(this),
        saveGameData: this.dataManager.saveGameData.bind(this.dataManager),
        updateBindingsFromGameState: this.dataManager.updateBindingsFromGameState.bind(this.dataManager),
      });

      // Create all screens using ScreenFactory
      this.screens = ScreenFactory.createScreens({
        ui: this.UI,
        asyncMethods: this.asyncMethods,
        onButtonClick: this.actionHandler.handleButtonClick.bind(this.actionHandler),
        onCardSelect: this.actionHandler.handleCardSelect.bind(this.actionHandler),
        onMissionSelect: this.actionHandler.handleMissionSelect.bind(this.actionHandler),
        onSettingChange: this.actionHandler.handleSettingsChange.bind(this.actionHandler),
        onUpgrade: this.actionHandler.handleUpgrade.bind(this.actionHandler),
        onBattleAction: (action: string) => this.actionHandler.handleBattleAction(action, this.screens.battleScreen),
        onNavigate: this.navigate.bind(this),
        onShowCardDetail: this.actionHandler.showCardDetailPopup.bind(this.actionHandler),
        onRenderNeeded: () => this.systems.uiCoordinator.triggerRender(),
        playSfx: (sfxId: string) => this.systems.soundManager.playSfx(sfxId),
      });

      // Initialize UI builder (after screens are created)
      this.uiBuilder = new UIBuilder({
        ui: this.UI,
        screens: this.screens,
      });

      // All screens are now created, enable rendering
      this.isInitializing = false;

      // Create UI tree once (it's reactive via bindings)
      this.uiTree = this.uiBuilder.createUI();
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
      await this.dataManager.loadGameData();

      // Update bindings from loaded data
      await this.dataManager.updateBindingsFromGameState();

      // Trigger initial render
      this.triggerRender();

      // Start menu music
      this.systems.soundManager.playMusic(MUSIC_TRACKS.BACKGROUND, true);
      this.navigate('menu');
    }

    /**
     * Validate player data structure
     */
    private validatePlayerData(data: any): data is PlayerData {
      const result = ValidationHelpers.validatePlayerData(data);
      return result.valid;
    }

    /**
     * Navigate to a different screen
     */
    private navigate(screen: string): void {
      this.systems.uiCoordinator.navigate(screen, () => this.dataManager.loadLeaderboardData());
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
      this.platform.render(this.uiTree);
    }

    /**
     * Submit player score to leaderboard via network event
     * Delegates to DataManager
     */
    private submitLeaderboardScore(type: 'experience' | 'cluckNorris', score: number): void {
      this.dataManager.submitLeaderboardScore(type, score);
    }

    /**
     * Update leaderboard data from server
     */
    updateLeaderboardData(data: any): void {
      // Update the leaderboard binding with new data
      this.UI.bindingManager.setBinding(BindingType.LeaderboardData, data);
      Logger.info('[BloomBeastsGame] Updated leaderboard data');
    }

    /**
     * Dispose resources
     */
    dispose(): void {
      this.screens.menuScreen.dispose();
    }
  }

  // ==================== bloombeasts\common\utils\createDefaultPlayerData.ts ====================

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
            if (cardData.affinity === Affinity.Boss) {
              cardData.rarity = 'boss';
            } else if (cost >= 5) {
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

  // ==================== bloombeasts\screens\battle\engine\types.ts ====================

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
    deck: RuntimeCard[];
    health?: number;
    maxHealth?: number;
    isAI?: boolean;
    aiStrategy?: 'default' | 'aggressive' | 'defensive' | 'custom';
  }

  /**
   * Current state of an active battle
   * Uses TURBO's IGameState directly (no conversion layer)
   */
  export interface BattleState {
    /** TURBO game state (contains gameData with players and field) */
    turboState: Turbo.IGameState<BloomBeastsState>;
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

  /**
   * Re-export runtime types
   * These are the unified runtime card types used throughout the battle system
   */

  /**
   * BloomBeasts Game State Types
   *
   * These types are used by both the game engine (BloomBeastsGame.ts) and action handlers.
   * They're defined here to avoid circular dependencies.
   */

  /**
   * BloomBeasts action types
   */
  export enum BloomBeastsActionType {
    DRAW_CARD = 'draw_card',
    PLAY_CARD = 'play_card',
    ATTACK = 'attack',
    USE_ABILITY = 'use_ability',
    END_TURN = 'end_turn',
    TIMEOUT = 'timeout',
    FORFEIT = 'forfeit',
  }

  /**
   * BloomBeasts action data
   */
  export interface BloomBeastsActionData extends Record<string, unknown> {
    type: BloomBeastsActionType;
    cardId?: string;
    targetId?: string;
    position?: number;
    abilityId?: string;
  }

  /**
   * BloomBeasts player data
   */
  export interface BloomBeastsPlayer {
    id: string;
    name: string;
    health: number;
    energy: number;
    deck: RuntimeCard[];
    hand: RuntimeCard[];
    graveyard: RuntimeCard[];
    maxHandSize: number;
    maxHealth: number;
  }

  /**
   * BloomBeasts specific game state
   */
  export interface BloomBeastsState extends Record<string, unknown> {
    players: BloomBeastsPlayer[];
    field: {
      player1: {
        beasts: (RuntimeBeast | null)[];
        buffs: (RuntimeBuff | null)[];
        habitat: RuntimeHabitat | null;
        traps: RuntimeTrap[];
      };
      player2: {
        beasts: (RuntimeBeast | null)[];
        buffs: (RuntimeBuff | null)[];
        habitat: RuntimeHabitat | null;
        traps: RuntimeTrap[];
      };
    };
    currentTurnActions: {
      hasDrawnCard: boolean;
      cardsPlayed: number;
      hasAttacked: Set<string>;
    };
    /** Set when a game ends suddenly (timeout, forfeit, disconnect) - causes immediate game end */
    suddenEnd?: {
      playerId: string;
      reason: SuddenEndReason;
    };
  }

  /**
   * Reasons for sudden game end
   */
  export enum SuddenEndReason {
    TIMEOUT = 'timeout',
    FORFEIT = 'forfeit',
    DISCONNECT = 'disconnect',
  }

  // ==================== bloombeasts\common\catalogs\catalogBuilder.ts ====================

  /**
   * Catalog Builder - Eliminates duplication across asset catalog files
   *
   * This utility provides a clean API for building asset catalogs without
   * repeating the same wrapper structure in every file.
   */


  /**
   * Simplified card definition - just the data without wrapper boilerplate
   */
  export interface CardDefinition {
    id: string;
    cardData: BloomBeastCard | MagicCard | TrapCard | BuffCard | HabitatCard;
    imagePath: string;
    horizonAssetId?: string;
  }

  /**
   * Get catalog category from affinity
   */
  function getCategoryFromAffinity(affinity: Affinity): CatalogCategory {
    const categoryMap: Partial<Record<Affinity, CatalogCategory>> = {
      [Affinity.Fire]: CatalogCategory.Fire,
      [Affinity.Water]: CatalogCategory.Water,
      [Affinity.Forest]: CatalogCategory.Forest,
      [Affinity.Sky]: CatalogCategory.Sky,
      [Affinity.Generic]: CatalogCategory.Common,
      [Affinity.Boss]: CatalogCategory.Boss,
    };
    return categoryMap[affinity] || CatalogCategory.Common;
  }

  /**
   * Get lowercase affinity string from Affinity enum
   */
  function getAffinityLowercase(affinity: Affinity): AffinityLowercase {
    const affinityMap: Partial<Record<Affinity, AffinityLowercase>> = {
      [Affinity.Fire]: AffinityLowercase.Fire,
      [Affinity.Water]: AffinityLowercase.Water,
      [Affinity.Forest]: AffinityLowercase.Forest,
      [Affinity.Sky]: AffinityLowercase.Sky,
      [Affinity.Generic]: AffinityLowercase.Boss,
      [Affinity.Boss]: AffinityLowercase.Boss,
    };
    return affinityMap[affinity] || AffinityLowercase.Boss;
  }

  /**
   * Get asset entry type from card type
   */
  function getAssetEntryType(cardType: CardType): AssetEntryType {
    const typeMap: Record<CardType, AssetEntryType> = {
      [CardType.Beast]: AssetEntryType.Beast,
      [CardType.Magic]: AssetEntryType.Magic,
      [CardType.Trap]: AssetEntryType.Trap,
      [CardType.Buff]: AssetEntryType.Buff,
      [CardType.Habitat]: AssetEntryType.Habitat,
    };
    return typeMap[cardType];
  }

  /**
   * Get card type string from CardType enum
   */
  function getCardTypeString(cardType: CardType): string {
    return CardType[cardType];
  }

  /**
   * Build a catalog entry from a card definition
   */
  function buildCatalogEntry(card: CardDefinition): CardAssetEntry {
    const cardData = card.cardData;
    // Get affinity - Beast cards have affinity, others might not
    const affinity = 'affinity' in cardData && cardData.affinity !== undefined
      ? getAffinityLowercase(cardData.affinity as Affinity)
      : undefined;

    return {
      id: card.id,
      type: getAssetEntryType(cardData.type),
      cardType: getCardTypeString(cardData.type),
      affinity,
      data: cardData,
      assets: [
        {
          type: AssetReferenceType.Image,
          ...(card.horizonAssetId ? { horizonAssetId: card.horizonAssetId } : {}),
          path: card.imagePath,
        }
      ]
    } as CardAssetEntry;
  }

  /**
   * Create an asset catalog from card definitions
   *
   * @param affinity - The affinity/category for this catalog
   * @param cards - Array of simplified card definitions
   * @param version - Catalog version (defaults to "1.0.0")
   * @returns Complete AssetCatalog ready to export
   *
   * @example
   * export const fireAssets = createCatalog(Affinity.Fire, [
   *   {
   *     id: "blazefinch",
   *     cardData: { ...card definition... },
   *     imagePath: "assets/images/cards_fire_blazefinch.png",
   *     horizonAssetId: "3218250765004566"
   *   },
   *   // ... more cards
   * ]);
   */
  export function createCatalog(
    affinity: Affinity,
    cards: CardDefinition[],
    version: string = "1.0.0"
  ): AssetCatalog {
    const category = getCategoryFromAffinity(affinity);
    const affinityName = Affinity[affinity];

    return {
      version,
      category,
      description: (affinity === Affinity.Generic || affinity === Affinity.Boss)
        ? "Common cards and assets"
        : `${affinityName} affinity cards and assets`,
      data: cards.map(buildCatalogEntry)
    };
  }

  /**
   * Create a card definition helper
   * Reduces boilerplate when defining cards
   */
  export function defineCard(
    id: string,
    cardData: BloomBeastCard | MagicCard | TrapCard | BuffCard | HabitatCard,
    imagePath: string,
    horizonAssetId?: string
  ): CardDefinition {
    return {
      id,
      cardData,
      imagePath,
      horizonAssetId
    };
  }

  /**
   * Create a catalog for non-affinity cards (Magic, Trap, Buff)
   * These catalogs don't have an affinity but still need proper categorization
   */
  export function createNonAffinityCatalog(
    category: CatalogCategory.Magic | CatalogCategory.Trap | CatalogCategory.Buff,
    cards: CardDefinition[],
    version: string = "1.0.0"
  ): AssetCatalog {
    const categoryNames = {
      [CatalogCategory.Magic]: 'Magic',
      [CatalogCategory.Trap]: 'Trap',
      [CatalogCategory.Buff]: 'Buff',
    };

    return {
      version,
      category,
      description: `${categoryNames[category]} cards`,
      data: cards.map(buildCatalogEntry)
    };
  }

  /**
   * UI Asset Helpers
   */

  /**
   * Create affinity UI assets (chests, icons, habitats, missions)
   * Eliminates ~50 lines of boilerplate per affinity
   */
  export function createAffinityUIAssets(
    affinity: Affinity.Fire | Affinity.Water | Affinity.Forest | Affinity.Sky,
    horizonIds: {
      mission: string;
      chestClosed: string;
      chestOpened: string;
      icon: string;
      habitatTemplate: string;
    }
  ): any[] {
    const affinityLower = getAffinityLowercase(affinity);
    const affinityName = Affinity[affinity];

    return [
      // Mission asset
      {
        id: `${affinityLower}-mission`,
        type: AssetEntryType.Mission,
        affinity: affinityLower,
        name: `${affinityName} Mission`,
        description: `${affinityName} affinity mission`,
        assets: [{
          type: AssetReferenceType.Image,
          horizonAssetId: horizonIds.mission,
          path: `assets/images/boss_${affinityLower}-boss.png`
        }]
      },
      // Chest closed
      {
        id: `${affinityLower}-chest-closed`,
        type: AssetEntryType.UI,
        category: 'chest' as any,
        name: `${affinityName} Chest Closed`,
        assets: [{
          type: AssetReferenceType.Image,
          horizonAssetId: horizonIds.chestClosed,
          path: `assets/images/chest_${affinityLower}-chest-closed.png`
        }]
      },
      // Chest opened
      {
        id: `${affinityLower}-chest-opened`,
        type: AssetEntryType.UI,
        category: 'chest' as any,
        name: `${affinityName} Chest Opened`,
        assets: [{
          type: AssetReferenceType.Image,
          horizonAssetId: horizonIds.chestOpened,
          path: `assets/images/chest_${affinityLower}-chest-opened.png`
        }]
      },
      // Icon
      {
        id: `${affinityLower}-icon`,
        type: AssetEntryType.UI,
        category: 'icon' as any,
        name: `${affinityName} Icon`,
        assets: [{
          type: AssetReferenceType.Image,
          horizonAssetId: horizonIds.icon,
          path: `assets/images/icon_${affinityLower}.png`
        }]
      },
      // Habitat template
      {
        id: `${affinityLower}-habitat`,
        type: AssetEntryType.UI,
        category: 'card-template' as any,
        name: `${affinityName} Habitat Card Template`,
        description: `Template overlay for ${affinityLower} habitat cards`,
        assets: [{
          type: AssetReferenceType.Image,
          horizonAssetId: horizonIds.habitatTemplate,
          path: `assets/images/cards_${affinityLower}_habitat-card.png`
        }]
      }
    ];
  }

  // ==================== bloombeasts\common\catalogs\bossAssets.ts ====================

  /**
   * Boss Assets Catalog - Refactored using catalogBuilder
   *
   * This file uses the catalog builder utility to eliminate boilerplate.
   * Edit card definitions below, and the builder handles all the wrapper structure.
   */


  /**
   * Boss card definitions
   */
  const bossCards = [
    defineCard(
      "cluck-norris",
      {
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
      } as BloomBeastCard,
      "assets/images/cards_boss_cluck-norris.png",
      "1358389912362012"
    ),
  ];

  /**
   * Build the catalog from cards using the builder
   */
  const bossCatalog = createCatalog(Affinity.Boss, bossCards);

  /**
   * Add UI assets
   */
  export const bossAssets: AssetCatalog = {
    ...bossCatalog,
    data: [
      ...bossCatalog.data,

      // UI Assets
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

  // ==================== bloombeasts\common\catalogs\buffAssets.ts ====================

  /**
   * Buff Assets Catalog - Refactored using catalogBuilder
   *
   * This file uses the catalog builder utility to eliminate boilerplate.
   * Edit card definitions below, and the builder handles all the wrapper structure.
   */


  /**
   * Buff card definitions
   */
  const buffCards = [
    defineCard(
      "battle-fury",
      {
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
      } as BuffCard,
      "assets/images/cards_buff_battle-fury.png",
      "1514404306279605"
    ),

    defineCard(
      "mystic-shield",
      {
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
      } as BuffCard,
      "assets/images/cards_buff_mystic-shield.png",
      "787965707330770"
    ),

    defineCard(
      "natures-blessing",
      {
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
      } as BuffCard,
      "assets/images/cards_buff_natures-blessing.png",
      "4100038783597004"
    ),

    defineCard(
      "swift-wind",
      {
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
      } as BuffCard,
      "assets/images/cards_buff_swift-wind.png",
      "657351040536713"
    ),
  ];

  /**
   * Build the catalog using the builder - eliminates boilerplate and affinity mapping duplication
   */
  export const buffAssets = createNonAffinityCatalog(
    CatalogCategory.Buff,
    buffCards
  );

  // ==================== bloombeasts\common\catalogs\commonAssets.ts ====================

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

  // ==================== bloombeasts\common\catalogs\fireAssets.ts ====================

  /**
   * Fire Affinity Assets - Refactored using catalogBuilder
   *
   * This file is now ~60% smaller thanks to the catalog builder utility.
   * Edit card definitions below, and the builder handles all the boilerplate.
   */


  /**
   * Card definitions - Just the data, no boilerplate
   */
  const fireCards = [
    defineCard(
      "blazefinch",
      {
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
      } as BloomBeastCard,
      "assets/images/cards_fire_blazefinch.png",
      "3218250765004566"
    ),

    defineCard(
      "cinder-pup",
      {
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
      } as BloomBeastCard,
      "assets/images/cards_fire_cinder-pup.png",
      "913214814369510"
    ),

    defineCard(
      "charcoil",
      {
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
                type: EffectType.Retaliation,
                target: AbilityTarget.Attacker,
                value: 1
              }
            ]
          }
        ],
      } as BloomBeastCard,
      "assets/images/cards_fire_charcoil.png",
      "785856391096811"
    ),

    defineCard(
      "magmite",
      {
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
      } as BloomBeastCard,
      "assets/images/cards_fire_magmite.png",
      "25339017082348952"
    ),
  ];

  /**
   * Build the catalog from cards using the builder
   * This eliminates ~100 lines of boilerplate!
   */
  const fireCatalog = createCatalog(Affinity.Fire, fireCards);

  /**
   * Add special assets (Habitat with multiple images, UI elements)
   * These don't fit the simple card pattern, so we add them manually
   */
  export const fireAssets: AssetCatalog = {
    ...fireCatalog,
    data: [
      ...fireCatalog.data,

      // Habitat card with multiple asset images
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
                  target: AbilityTarget.AllUnits,
                  value: 1,
                  condition: {
                    type: ConditionType.AffinityNotMatches,
                    value: "Fire"
                  }
                }
              ]
            }
          ]
        } as HabitatCard,
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

      // UI Assets
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

  // ==================== bloombeasts\common\catalogs\forestAssets.ts ====================

  /**
   * Forest Affinity Assets - Refactored using catalogBuilder
   *
   * This file is now ~60% smaller thanks to the catalog builder utility.
   * Edit card definitions below, and the builder handles all the boilerplate.
   */


  /**
   * Card definitions - Just the data, no boilerplate
   */
  const forestCards = [
    defineCard(
      "rootling",
      {
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
      } as BloomBeastCard,
      "assets/images/cards_forest_rootling.png",
      "1170317305016635"
    ),

    defineCard(
      "leaf-sprite",
      {
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
      } as BloomBeastCard,
      "assets/images/cards_forest_leaf-sprite.png",
      "1733091247346351"
    ),

    defineCard(
      "mosslet",
      {
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
      } as BloomBeastCard,
      "assets/images/cards_forest_mosslet.png",
      "1344114090714721"
    ),

    defineCard(
      "mushroomancer",
      {
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
      } as BloomBeastCard,
      "assets/images/cards_forest_mushroomancer.png",
      "1393693032328550"
    ),
  ];

  /**
   * Build the catalog from cards using the builder
   * This eliminates ~100 lines of boilerplate!
   */
  const forestCatalog = createCatalog(Affinity.Forest, forestCards);

  /**
   * Add special assets (Habitat with multiple images, UI elements)
   * These don't fit the simple card pattern, so we add them manually
   */
  export const forestAssets: AssetCatalog = {
    ...forestCatalog,
    data: [
      ...forestCatalog.data,

      // Habitat card with multiple asset images
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
        } as HabitatCard,
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

      // UI Assets
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

  // ==================== bloombeasts\common\catalogs\magicAssets.ts ====================

  /**
   * Magic Assets Catalog - Refactored using catalogBuilder
   *
   * This file uses the catalog builder utility to eliminate boilerplate.
   * Edit card definitions below, and the builder handles all the wrapper structure.
   */


  /**
   * Magic card definitions
   */
  const magicCards = [
    defineCard("aether-swap", {
      id: "aether-swap", name: "Aether Swap", type: CardType.Magic, cost: 1, targetRequired: false,
      abilities: [{ name: "Aether Swap", trigger: AbilityTrigger.OnSummon,
        effects: [{ type: EffectType.ReturnToHand, target: AbilityTarget.AllAllies, value: 1 }] }]
    } as MagicCard, "assets/images/cards_magic_aether-swap.png", "1846483789630405"),

    defineCard("cleansing-downpour", {
      id: "cleansing-downpour", name: "Cleansing Downpour", type: CardType.Magic, cost: 2, targetRequired: false,
      abilities: [{ name: "Cleansing Downpour", trigger: AbilityTrigger.OnSummon,
        effects: [{ type: EffectType.DrawCards, target: AbilityTarget.Player, value: 1 }] }]
    } as MagicCard, "assets/images/cards_magic_cleansing-downpour.png", "710755475386192"),

    defineCard("elemental-burst", {
      id: "elemental-burst", name: "Elemental Burst", type: CardType.Magic, cost: 3, targetRequired: false,
      abilities: [{ name: "Elemental Burst", trigger: AbilityTrigger.OnSummon,
        effects: [{ type: EffectType.DealDamage, target: AbilityTarget.AllEnemies, value: 2 }] }]
    } as MagicCard, "assets/images/cards_magic_elemental-burst.png", "1585232092889726"),

    defineCard("lightning-strike", {
      id: "lightning-strike", name: "Lightning Strike", type: CardType.Magic, cost: 2, targetRequired: false,
      abilities: [{ name: "Lightning Strike", trigger: AbilityTrigger.OnSummon,
        effects: [{ type: EffectType.DealDamage, target: AbilityTarget.LowestHealthEnemy, value: 5, piercing: true }] }]
    } as MagicCard, "assets/images/cards_magic_lightning-strike.png", "1155953239812167"),

    defineCard("nectar-block", {
      id: "nectar-block", name: "Energy Block", type: CardType.Magic, cost: 0, targetRequired: false,
      abilities: [{ name: "Energy Block", trigger: AbilityTrigger.OnSummon,
        effects: [{ type: EffectType.GainResource, target: AbilityTarget.Player, resource: ResourceType.Energy, value: 2, duration: EffectDuration.ThisTurn }] }]
    } as MagicCard, "assets/images/cards_magic_energy-block.png", "1092559439363693"),

    defineCard("nectar-drain", {
      id: "nectar-drain", name: "Energy Drain", type: CardType.Magic, cost: 1, targetRequired: false,
      abilities: [{ name: "Energy Drain", trigger: AbilityTrigger.OnSummon,
        effects: [
          { type: EffectType.GainResource, target: AbilityTarget.Player, resource: ResourceType.Energy, value: 2, duration: EffectDuration.ThisTurn },
          { type: EffectType.DrawCards, target: AbilityTarget.Player, value: 1 }
        ] }]
    } as MagicCard, "assets/images/cards_magic_energy-drain.png", "1754732031852523"),

    defineCard("nectar-surge", {
      id: "nectar-surge", name: "Energy Surge", type: CardType.Magic, cost: 1, targetRequired: false,
      abilities: [{ name: "Energy Surge", trigger: AbilityTrigger.OnSummon,
        effects: [
          { type: EffectType.GainResource, target: AbilityTarget.Player, resource: ResourceType.Energy, value: 3, duration: EffectDuration.ThisTurn },
          { type: EffectType.DrawCards, target: AbilityTarget.Player, value: 1 }
        ] }]
    } as MagicCard, "assets/images/cards_magic_energy-surge.png", "1379310950488534"),

    defineCard("overgrowth", {
      id: "overgrowth", name: "Overgrowth", type: CardType.Magic, cost: 3, targetRequired: false,
      abilities: [{ name: "Overgrowth", trigger: AbilityTrigger.OnSummon,
        effects: [{ type: EffectType.ModifyStats, target: AbilityTarget.AllAllies, stat: StatType.Both, value: 2, duration: EffectDuration.Permanent }] }]
    } as MagicCard, "assets/images/cards_magic_overgrowth.png", "1489977038895297"),

    defineCard("power-up", {
      id: "power-up", name: "Power Up", type: CardType.Magic, cost: 2, targetRequired: false,
      abilities: [{ name: "Power Up", trigger: AbilityTrigger.OnSummon,
        effects: [{ type: EffectType.ModifyStats, target: AbilityTarget.RandomAlly, stat: StatType.Both, value: 3, duration: EffectDuration.Permanent }] }]
    } as MagicCard, "assets/images/cards_magic_power-up.png", "1140750044697552"),

    defineCard("purify", {
      id: "purify", name: "Purify", type: CardType.Magic, cost: 1, targetRequired: false,
      abilities: [{ name: "Purify", trigger: AbilityTrigger.OnSummon,
        effects: [{ type: EffectType.Heal, target: AbilityTarget.RandomAlly, value: 3 }] }]
    } as MagicCard, "assets/images/cards_magic_purify.png", "681285418362907"),
  ];

  /**
   * Build the catalog using the builder - eliminates boilerplate
   */
  export const magicAssets = createNonAffinityCatalog(
    CatalogCategory.Magic,
    magicCards
  );

  // ==================== bloombeasts\common\catalogs\skyAssets.ts ====================

  /**
   * Sky Affinity Assets - Refactored using catalogBuilder
   *
   * This file is now ~60% smaller thanks to the catalog builder utility.
   * Edit card definitions below, and the builder handles all the boilerplate.
   */


  /**
   * Card definitions - Just the data, no boilerplate
   */
  const skyCards = [
    defineCard(
      "aero-moth",
      {
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
      } as BloomBeastCard,
      "assets/images/cards_sky_aero-moth.png",
      "1857788838498496"
    ),

    defineCard(
      "cirrus-floof",
      {
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
      } as BloomBeastCard,
      "assets/images/cards_sky_cirrus-floof.png",
      "849446287592530"
    ),

    defineCard(
      "gale-glider",
      {
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
      } as BloomBeastCard,
      "assets/images/cards_sky_gale-glider.png",
      "1854780382097596"
    ),

    defineCard(
      "star-bloom",
      {
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
      } as BloomBeastCard,
      "assets/images/cards_sky_star-bloom.png",
      "737222956003560"
    ),
  ];

  /**
   * Build the catalog from cards using the builder
   * This eliminates ~100 lines of boilerplate!
   */
  const skyCatalog = createCatalog(Affinity.Sky, skyCards);

  /**
   * Add special assets (Habitat with multiple images, UI elements)
   * These don't fit the simple card pattern, so we add them manually
   */
  export const skyAssets: AssetCatalog = {
    ...skyCatalog,
    data: [
      ...skyCatalog.data,

      // Habitat card with multiple asset images
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
        } as HabitatCard,
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

      // UI Assets
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

  // ==================== bloombeasts\common\catalogs\trapAssets.ts ====================

  /**
   * Trap Assets Catalog - Refactored using catalogBuilder
   *
   * This file uses the catalog builder utility to eliminate boilerplate.
   * Edit card definitions below, and the builder handles all the wrapper structure.
   */


  /**
   * Trap card definitions
   */
  const trapCards = [
    defineCard("bear-trap", {
      id: "bear-trap", name: "Bear Trap", type: CardType.Trap, cost: 1,
      activation: { trigger: TrapTrigger.OnAttack },
      abilities: [{ name: "Bear Trap", trigger: AbilityTrigger.OnSummon,
        effects: [{ type: EffectType.DealDamage, target: AbilityTarget.Attacker, value: 3 }] }]
    } as TrapCard, "assets/images/cards_trap_bear-trap.png", "1518992622460625"),

    defineCard("emergency-bloom", {
      id: "emergency-bloom", name: "Emergency Bloom", type: CardType.Trap, cost: 1,
      activation: { trigger: TrapTrigger.OnDestroy },
      abilities: [{ name: "Emergency Bloom", trigger: AbilityTrigger.OnSummon,
        effects: [{ type: EffectType.DrawCards, target: AbilityTarget.Player, value: 2 }] }]
    } as TrapCard, "assets/images/cards_trap_emergency-bloom.png", "2247657455738264"),

    defineCard("habitat-lock", {
      id: "habitat-lock", name: "Habitat Lock", type: CardType.Trap, cost: 1,
      activation: { trigger: TrapTrigger.OnHabitatPlay },
      abilities: [{ name: "Habitat Lock", trigger: AbilityTrigger.OnSummon,
        effects: [{ type: EffectType.NullifyEffect, target: AbilityTarget.PlayedCard }] }]
    } as TrapCard, "assets/images/cards_trap_habitat-lock.png", "609610328807674"),

    defineCard("habitat-shield", {
      id: "habitat-shield", name: "Habitat Shield", type: CardType.Trap, cost: 2,
      activation: { trigger: TrapTrigger.OnHabitatPlay },
      abilities: [{ name: "Habitat Shield", trigger: AbilityTrigger.OnSummon,
        effects: [
          { type: EffectType.NullifyEffect, target: AbilityTarget.PlayedCard },
          { type: EffectType.DrawCards, target: AbilityTarget.Player, value: 1 }
        ] }]
    } as TrapCard, "assets/images/cards_trap_habitat-shield.png", "1362245262078336"),

    defineCard("magic-shield", {
      id: "magic-shield", name: "Magic Shield", type: CardType.Trap, cost: 1,
      activation: { trigger: TrapTrigger.OnMagicPlay },
      abilities: [{ name: "Magic Shield", trigger: AbilityTrigger.OnSummon,
        effects: [{ type: EffectType.NullifyEffect, target: AbilityTarget.PlayedCard }] }]
    } as TrapCard, "assets/images/cards_trap_magic-sheild.png", "1239098601311749"),

    defineCard("thorn-snare", {
      id: "thorn-snare", name: "Thorn Snare", type: CardType.Trap, cost: 2,
      activation: { trigger: TrapTrigger.OnAttack },
      abilities: [{ name: "Thorn Snare", trigger: AbilityTrigger.OnSummon,
        effects: [
          { type: EffectType.PreventAttack, target: AbilityTarget.Attacker, duration: EffectDuration.Instant },
          { type: EffectType.DealDamage, target: AbilityTarget.Attacker, value: 2 }
        ] }]
    } as TrapCard, "assets/images/cards_trap_thorn-snare.png", "4210265565909373"),

    defineCard("vaporize", {
      id: "vaporize", name: "Vaporize", type: CardType.Trap, cost: 2,
      activation: { trigger: TrapTrigger.OnBeastPlay, condition: { type: TrapConditionType.CostBelow, value: 4 } },
      abilities: [{ name: "Vaporize", trigger: AbilityTrigger.OnSummon,
        effects: [{ type: EffectType.Destroy, target: AbilityTarget.PlayedCard }] }]
    } as TrapCard, "assets/images/cards_trap_vaporize.png", "1903759173890506"),

    defineCard("xp-harvest", {
      id: "xp-harvest", name: "XP Harvest", type: CardType.Trap, cost: 1,
      activation: { trigger: TrapTrigger.OnDestroy },
      abilities: [{ name: "XP Harvest", trigger: AbilityTrigger.OnSummon,
        effects: [{ type: EffectType.DealDamage, target: AbilityTarget.Attacker, value: 2 }] }]
    } as TrapCard, "assets/images/cards_trap_xpharvest.png", "807213335392971"),
  ];

  /**
   * Build the catalog using the builder - eliminates boilerplate
   */
  export const trapAssets = createNonAffinityCatalog(
    CatalogCategory.Trap,
    trapCards
  );

  // ==================== bloombeasts\common\catalogs\waterAssets.ts ====================

  /**
   * Water Affinity Assets - Refactored using catalogBuilder
   *
   * This file is now ~60% smaller thanks to the catalog builder utility.
   * Edit card definitions below, and the builder handles all the boilerplate.
   */


  /**
   * Card definitions - Just the data, no boilerplate
   */
  const waterCards = [
    defineCard(
      "aqua-pebble",
      {
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
                  value: "Water"
                }
              }
            ]
          }
        ],
      } as BloomBeastCard,
      "assets/images/cards_water_aqua-pebble.png",
      "2542562209453452"
    ),

    defineCard(
      "bubblefin",
      {
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
      } as BloomBeastCard,
      "assets/images/cards_water_bubblefin.png",
      "2957682524429594"
    ),

    defineCard(
      "dewdrop-drake",
      {
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
                  type: ConditionType.UnitsOnField,
                  value: 1,
                  comparison: Comparison.Equal
                }
              }
            ]
          }
        ],
      } as BloomBeastCard,
      "assets/images/cards_water_dewdrop-drake.png",
      "1232407695362881"
    ),

    defineCard(
      "kelp-cub",
      {
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
                type: EffectType.PreventAttack,
                target: AbilityTarget.AttackedEnemy,
                duration: EffectDuration.StartOfNextTurn
              }
            ]
          }
        ],
      } as BloomBeastCard,
      "assets/images/cards_water_kelp-cub.png",
      "2278603722605464"
    ),
  ];

  /**
   * Build the catalog from cards using the builder
   * This eliminates ~100 lines of boilerplate!
   */
  const waterCatalog = createCatalog(Affinity.Water, waterCards);

  /**
   * Add special assets (Habitat with multiple images, UI elements)
   * These don't fit the simple card pattern, so we add them manually
   */
  export const waterAssets: AssetCatalog = {
    ...waterCatalog,
    data: [
      ...waterCatalog.data,

      // Habitat card with multiple asset images
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
                    type: ConditionType.AffinityMatches,
                    value: "Water"
                  }
                }
              ]
            }
          ]
        } as HabitatCard,
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

      // UI Assets
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

  // ==================== bloombeasts\common\catalogs\index.ts ====================

  /**
   * Catalogs - Re-exports all card definitions
   */


  // Import all catalogs

  // Export array of all catalogs for easy iteration
  export const allCatalogs = [
    bossAssets,
    buffAssets,
    commonAssets,
    fireAssets,
    forestAssets,
    magicAssets,
    skyAssets,
    trapAssets,
    waterAssets,
  ];

}

// Export the namespace as a module
export { BloomBeasts };

// Make BloomBeasts available globally
if (typeof globalThis !== 'undefined') {
  (globalThis as any).BloomBeasts = BloomBeasts;
}
