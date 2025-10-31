/**
 * Centralized Binding Manager
 * Horizon has a strict binding limit (~10 bindings total)
 * This manager provides controlled access to all bindings in the app
 */

import { AsyncMethods } from "./bindings";

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

    console.log(`[BindingManager] Initialized ${this.bindings.size} bindings`);
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
