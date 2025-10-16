/**
 * BloomBeasts Game - Meta Horizon Edition
 *
 * This is the main game script for Meta Horizon Worlds.
 * It defines asset props, custom UI gizmo, and integrates with the game engine.
 *
 * To use this script in Meta Horizon:
 * 1. Import BloomBeasts-GameEngine.ts as a module dependency
 * 2. Attach this script to a game object
 * 3. Assign all asset props in the Meta Horizon editor
 * 4. Assign the custom UI gizmo prop
 * 5. The game will initialize automatically
 */

import * as Engine from './BloomBeasts-GameEngine';

// Meta Horizon types (these will be provided by the Horizon platform at runtime)
// For compilation purposes, we define basic stubs here
declare namespace Horizon {
  export interface World {}
  export namespace Asset {
    export interface Texture {}
    export interface Audio {}
  }
  export namespace Gizmo {
    export interface CustomUI {}
  }
  export interface Player {}
}

// Use the Horizon types
type World = Horizon.World;
type HorizonPlayer = Horizon.Player;

// ==================== Script Props ====================
// These will be set in the Meta Horizon editor

type Props = {
  // Custom UI Gizmo for rendering the game
  gameUI: Horizon.Gizmo.CustomUI;

  // Card Images - Forest Affinity
  cardImage_fuzzlet: Horizon.Asset.Texture;
  cardImage_leafSprite: Horizon.Asset.Texture;
  cardImage_mosslet: Horizon.Asset.Texture;
  cardImage_mushroomancer: Horizon.Asset.Texture;
  cardImage_rootling: Horizon.Asset.Texture;

  // Card Images - Fire Affinity
  cardImage_blazefinch: Horizon.Asset.Texture;
  cardImage_charcoil: Horizon.Asset.Texture;
  cardImage_cinderPup: Horizon.Asset.Texture;
  cardImage_magmite: Horizon.Asset.Texture;

  // Card Images - Water Affinity
  cardImage_aquaPebble: Horizon.Asset.Texture;
  cardImage_bubblefin: Horizon.Asset.Texture;
  cardImage_dewdropDrake: Horizon.Asset.Texture;
  cardImage_kelpCub: Horizon.Asset.Texture;

  // Card Images - Sky Affinity
  cardImage_aeroMoth: Horizon.Asset.Texture;
  cardImage_cirrusFloof: Horizon.Asset.Texture;
  cardImage_galeGlider: Horizon.Asset.Texture;
  cardImage_starBloom: Horizon.Asset.Texture;

  // Habitat Images
  habitatImage_ancientForest: Horizon.Asset.Texture;
  habitatImage_volcanicScar: Horizon.Asset.Texture;
  habitatImage_clearZenith: Horizon.Asset.Texture;

  // Magic Card Images
  magicImage_cleansingDownpour: Horizon.Asset.Texture;
  magicImage_nectarSurge: Horizon.Asset.Texture;

  // Trap Card Images
  trapImage_habitatLock: Horizon.Asset.Texture;

  // UI Images
  uiImage_cardBack: Horizon.Asset.Texture;
  uiImage_button: Horizon.Asset.Texture;
  uiImage_panel: Horizon.Asset.Texture;
  uiImage_healthBar: Horizon.Asset.Texture;
  uiImage_nectarIcon: Horizon.Asset.Texture;

  // Background Images
  backgroundImage_mainMenu: Horizon.Asset.Texture;
  backgroundImage_battle: Horizon.Asset.Texture;
  backgroundImage_missionSelect: Horizon.Asset.Texture;

  // Sound Effects
  sound_cardPlay: Horizon.Asset.Audio;
  sound_attack: Horizon.Asset.Audio;
  sound_damage: Horizon.Asset.Audio;
  sound_victory: Horizon.Asset.Audio;
  sound_defeat: Horizon.Asset.Audio;
  sound_buttonClick: Horizon.Asset.Audio;

  // Music
  music_mainMenu: Horizon.Asset.Audio;
  music_battle: Horizon.Asset.Audio;
};

// ==================== Meta Horizon Platform Implementation ====================

class HorizonPlatform implements Engine.PlatformInterface {
  private props: Props;
  private uiGizmo: Horizon.Gizmo.CustomUI;
  private assetMap: Map<string, Horizon.Asset.Texture | Horizon.Asset.Audio>;
  private renderCallbacks: ((ctx: Engine.RenderContext) => void)[] = [];
  private inputHandlers: Map<string, Engine.InputCallback> = new Map();

  constructor(props: Props) {
    this.props = props;
    this.uiGizmo = props.gameUI;
    this.assetMap = new Map();
  }

  // ==================== Initialization ====================

  async initialize(): Promise<void> {
    console.log('[BloomBeasts] Initializing Horizon Platform...');

    // Map all asset props to asset IDs
    this.mapAssets();

    // Initialize the custom UI
    await this.initializeUI();

    console.log('[BloomBeasts] Platform initialized successfully');
  }

  private mapAssets(): void {
    // Card Images - Forest
    this.assetMap.set('card-fuzzlet', this.props.cardImage_fuzzlet);
    this.assetMap.set('card-leafSprite', this.props.cardImage_leafSprite);
    this.assetMap.set('card-mosslet', this.props.cardImage_mosslet);
    this.assetMap.set('card-mushroomancer', this.props.cardImage_mushroomancer);
    this.assetMap.set('card-rootling', this.props.cardImage_rootling);

    // Card Images - Fire
    this.assetMap.set('card-blazefinch', this.props.cardImage_blazefinch);
    this.assetMap.set('card-charcoil', this.props.cardImage_charcoil);
    this.assetMap.set('card-cinderPup', this.props.cardImage_cinderPup);
    this.assetMap.set('card-magmite', this.props.cardImage_magmite);

    // Card Images - Water
    this.assetMap.set('card-aquaPebble', this.props.cardImage_aquaPebble);
    this.assetMap.set('card-bubblefin', this.props.cardImage_bubblefin);
    this.assetMap.set('card-dewdropDrake', this.props.cardImage_dewdropDrake);
    this.assetMap.set('card-kelpCub', this.props.cardImage_kelpCub);

    // Card Images - Sky
    this.assetMap.set('card-aeroMoth', this.props.cardImage_aeroMoth);
    this.assetMap.set('card-cirrusFloof', this.props.cardImage_cirrusFloof);
    this.assetMap.set('card-galeGlider', this.props.cardImage_galeGlider);
    this.assetMap.set('card-starBloom', this.props.cardImage_starBloom);

    // Habitat Images
    this.assetMap.set('habitat-ancientForest', this.props.habitatImage_ancientForest);
    this.assetMap.set('habitat-volcanicScar', this.props.habitatImage_volcanicScar);
    this.assetMap.set('habitat-clearZenith', this.props.habitatImage_clearZenith);

    // Magic Images
    this.assetMap.set('magic-cleansingDownpour', this.props.magicImage_cleansingDownpour);
    this.assetMap.set('magic-nectarSurge', this.props.magicImage_nectarSurge);

    // Trap Images
    this.assetMap.set('trap-habitatLock', this.props.trapImage_habitatLock);

    // UI Images
    this.assetMap.set('ui-cardBack', this.props.uiImage_cardBack);
    this.assetMap.set('ui-button', this.props.uiImage_button);
    this.assetMap.set('ui-panel', this.props.uiImage_panel);
    this.assetMap.set('ui-healthBar', this.props.uiImage_healthBar);
    this.assetMap.set('ui-nectarIcon', this.props.uiImage_nectarIcon);

    // Background Images
    this.assetMap.set('bg-mainMenu', this.props.backgroundImage_mainMenu);
    this.assetMap.set('bg-battle', this.props.backgroundImage_battle);
    this.assetMap.set('bg-missionSelect', this.props.backgroundImage_missionSelect);

    // Sound Effects
    this.assetMap.set('sfx-cardPlay', this.props.sound_cardPlay);
    this.assetMap.set('sfx-attack', this.props.sound_attack);
    this.assetMap.set('sfx-damage', this.props.sound_damage);
    this.assetMap.set('sfx-victory', this.props.sound_victory);
    this.assetMap.set('sfx-defeat', this.props.sound_defeat);
    this.assetMap.set('sfx-buttonClick', this.props.sound_buttonClick);

    // Music
    this.assetMap.set('music-mainMenu', this.props.music_mainMenu);
    this.assetMap.set('music-battle', this.props.music_battle);
  }

  private async initializeUI(): Promise<void> {
    // Set up the custom UI gizmo for game rendering
    // The UI will be rendered through the render callbacks
    console.log('[BloomBeasts] Custom UI initialized');
  }

  // ==================== Asset Loading ====================

  async loadAsset(assetId: string): Promise<Engine.AssetLoadResult> {
    const asset = this.assetMap.get(assetId);

    if (!asset) {
      console.warn(`[BloomBeasts] Asset not found: ${assetId}`);
      return {
        success: false,
        assetId,
        error: `Asset not found: ${assetId}`
      };
    }

    // In Meta Horizon, assets are pre-loaded through props
    // Just return success
    return {
      success: true,
      assetId,
      data: asset
    };
  }

  async loadAssets(assetIds: string[]): Promise<Engine.AssetLoadResult[]> {
    return Promise.all(assetIds.map(id => this.loadAsset(id)));
  }

  // ==================== Rendering ====================

  onRender(callback: (ctx: Engine.RenderContext) => void): void {
    this.renderCallbacks.push(callback);
  }

  render(): void {
    // Create render context
    const ctx: Engine.RenderContext = {
      width: 1920,  // Standard HD width for Horizon UI
      height: 1080, // Standard HD height for Horizon UI
      deltaTime: 16 // Approximately 60fps
    };

    // Call all render callbacks
    for (const callback of this.renderCallbacks) {
      try {
        callback(ctx);
      } catch (error) {
        console.error('[BloomBeasts] Render callback error:', error);
      }
    }

    // Update the custom UI gizmo with rendered content
    this.updateCustomUI();
  }

  private updateCustomUI(): void {
    // This is where we'd send render commands to the CustomUI gizmo
    // Meta Horizon CustomUI typically uses HTML/CSS-like structure
    // Implementation depends on Meta Horizon's specific CustomUI API
  }

  // ==================== Input Handling ====================

  onInput(eventType: string, callback: Engine.InputCallback): void {
    this.inputHandlers.set(eventType, callback);
  }

  handleInput(eventType: string, data: any): void {
    const handler = this.inputHandlers.get(eventType);
    if (handler) {
      handler(data);
    }
  }

  // ==================== Audio ====================

  async playSound(soundId: string, volume?: number): Promise<void> {
    const sound = this.assetMap.get(soundId) as Horizon.Asset.Audio;
    if (sound) {
      // Play audio through Meta Horizon's audio system
      console.log(`[BloomBeasts] Playing sound: ${soundId} at volume ${volume || 1.0}`);
      // world.audio.play(sound, { volume: volume || 1.0 });
    }
  }

  async playMusic(musicId: string, loop?: boolean, volume?: number): Promise<void> {
    const music = this.assetMap.get(musicId) as Horizon.Asset.Audio;
    if (music) {
      console.log(`[BloomBeasts] Playing music: ${musicId} (loop: ${loop}) at volume ${volume || 0.5}`);
      // world.audio.playMusic(music, { loop: loop !== false, volume: volume || 0.5 });
    }
  }

  async stopMusic(): Promise<void> {
    console.log('[BloomBeasts] Stopping music');
    // world.audio.stopMusic();
  }

  // ==================== Dialogs ====================

  async showDialog(title: string, message: string, buttons: string[]): Promise<number> {
    console.log(`[BloomBeasts] Dialog: ${title} - ${message}`);
    // In Meta Horizon, we'd show a custom UI dialog
    // For now, return 0 (first button)
    return 0;
  }

  // ==================== Utilities ====================

  getTimestamp(): number {
    return Date.now();
  }

  async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ==================== Main Game Class ====================

class BloomBeastsGame {
  private world: World;
  private props: Props;
  private platform: HorizonPlatform;
  private gameManager: Engine.GameManager | null = null;
  private isInitialized: boolean = false;
  private updateInterval: number | null = null;

  constructor(world: World, props: Props) {
    this.world = world;
    this.props = props;
    this.platform = new HorizonPlatform(props);
  }

  async start(): Promise<void> {
    try {
      console.log('[BloomBeasts] Starting game...');

      // Initialize platform (loads assets, sets up UI)
      await this.platform.initialize();

      // Create and initialize game manager
      // Note: GameManager expects platform callbacks, not the platform interface
      // This will need to be adapted based on the actual GameManager implementation
      this.gameManager = new Engine.GameManager(this.platform as any);
      await this.gameManager.initialize();

      this.isInitialized = true;
      console.log('[BloomBeasts] Game started successfully!');

      // Start the game loop
      this.startGameLoop();

    } catch (error) {
      console.error('[BloomBeasts] Failed to start game:', error);
      throw error;
    }
  }

  private startGameLoop(): void {
    // Run game update at ~60fps
    this.updateInterval = setInterval(() => {
      this.update();
    }, 16) as unknown as number;
  }

  private update(): void {
    if (!this.isInitialized || !this.gameManager) {
      return;
    }

    // Render the game
    this.platform.render();
  }

  stop(): void {
    if (this.updateInterval !== null) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    console.log('[BloomBeasts] Game stopped');
  }

  // Handle player interactions with the custom UI
  handleUIClick(x: number, y: number): void {
    if (!this.isInitialized) return;

    this.platform.handleInput('click', { x, y });
  }

  handleUIHover(x: number, y: number): void {
    if (!this.isInitialized) return;

    this.platform.handleInput('hover', { x, y });
  }
}

// ==================== Meta Horizon Script Exports ====================

// This is the main entry point for Meta Horizon
export class BloomBeastsScript {
  private game: BloomBeastsGame | null = null;

  // Called when the script starts
  start(world: World, props: Props) {
    console.log('[BloomBeasts] Script starting...');

    this.game = new BloomBeastsGame(world, props);

    // Start the game asynchronously
    this.game.start().catch(error => {
      console.error('[BloomBeasts] Failed to start:', error);
    });
  }

  // Called every frame
  update(world: World, props: Props) {
    // Game loop is handled internally
  }

  // Called when a player interacts with the custom UI
  onCustomUIClick(world: World, player: HorizonPlayer, x: number, y: number) {
    if (this.game) {
      this.game.handleUIClick(x, y);
    }
  }

  onCustomUIHover(world: World, player: HorizonPlayer, x: number, y: number) {
    if (this.game) {
      this.game.handleUIHover(x, y);
    }
  }

  // Called when the script stops
  dispose(world: World) {
    console.log('[BloomBeasts] Script stopping...');
    if (this.game) {
      this.game.stop();
      this.game = null;
    }
  }
}

// Export the script class as default for Meta Horizon
export default BloomBeastsScript;
