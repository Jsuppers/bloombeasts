/**
 * Web Platform Wrapper for Unified BloomBeasts Game
 * This file wraps the unified game component for the Web platform
 */

import { Platform, setPlatform, UIRenderer } from '../../../bloombeasts/ui';
import { Binding } from './ui/Binding';
import { BloomBeastsGame, type PlayerData } from '../../../bloombeasts/ui/screens';
import { GameManager, type PlatformCallbacks, type MenuStats, type MissionDisplay, type CardDisplay, type BattleDisplay, type RewardDisplay } from '../../../bloombeasts/gameManager';
import type { SoundSettings } from '../../../bloombeasts/systems/SoundManager';
import { AssetLoader } from './utils/assetLoader';

setPlatform(Platform.web);

export class BloomBeastsWebGame {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private renderer: UIRenderer;
  private game: BloomBeastsGame;
  public playerData: Binding<PlayerData | null>;
  private gameManager: GameManager | null = null;
  private assetLoader: AssetLoader;
  private uiTree: any = null; // Store UI tree once

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get 2D context');
    this.ctx = ctx;

    this.renderer = new UIRenderer(canvas, ctx);
    this.assetLoader = new AssetLoader();
    
    const platformCallbacks: PlatformCallbacks = {
      setPlayerData: (data: any) => { if (this.playerData) this.playerData.set(data); },
      renderStartMenu: () => {},
      renderMissionSelect: () => {},
      renderCards: () => {},
      renderBattle: () => {},
      renderSettings: () => {},
      renderCardDetail: () => {},
      onButtonClick: () => {},
      onCardSelect: () => {},
      onMissionSelect: () => {},
      onSettingsChange: () => {},
      loadCardImage: async () => null,
      loadBackground: async () => null,
      playSound: () => {},
      playMusic: () => {},
      stopMusic: () => {},
      playSfx: () => {},
      setMusicVolume: () => {},
      setSfxVolume: () => {},
      saveData: async (key: string, data: any) => { localStorage.setItem(`bb_${key}`, JSON.stringify(data)); },
      loadData: async (key: string) => { const d = localStorage.getItem(`bb_${key}`); return d ? JSON.parse(d) : null; },
      showDialog: async () => 'OK',
      showRewards: async () => {}
    };
    
    this.gameManager = new GameManager(platformCallbacks);
    this.playerData = new Binding<PlayerData | null>(null);
    
    this.game = new BloomBeastsGame({
      playerData: this.playerData as any,
      onButtonClick: this.handleButtonClick.bind(this),
      onCardSelect: this.handleCardSelect.bind(this),
      onMissionSelect: this.handleMissionSelect.bind(this),
      onSettingsChange: this.handleSettingsChange.bind(this),
      onBattleAction: this.handleBattleAction.bind(this),
      onRenderNeeded: () => this.render()
    });

    // Create UI tree once
    this.uiTree = this.game.createUI();

    this.playerData.subscribe(() => this.render());
  }

  async initialize(): Promise<void> {
    console.log('[WebGame] Starting initialization...');

    // Load all assets first
    console.log('[WebGame] Loading assets...');
    await this.assetLoader.loadAllAssets();
    console.log('[WebGame] Assets loaded!');

    // Set images in renderer
    const images = this.assetLoader.getAllImages();
    Object.entries(images).forEach(([key, img]) => {
      this.renderer.setImage(key, img);
    });
    console.log('[WebGame] Images set in renderer, count:', Object.keys(images).length);

    if (!this.gameManager) throw new Error('GameManager not initialized');
    await this.gameManager.initialize();
    const initialData = await this.loadPlayerData();
    console.log('[WebGame] Initial player data:', initialData);
    if (initialData) {
      this.playerData.set(initialData);
    }
    // Initial render
    console.log('[WebGame] Triggering initial render...');
    this.render();
    console.log('[WebGame] Initialization complete!');
  }

  private async loadPlayerData(): Promise<PlayerData | null> {
    // Create starter deck cards
    const starterCards = [
      { id: 'card1', name: 'Forest Wolf', type: 'Beast', level: 1, attack: 3, health: 2, cost: 1, affinity: 'forest' },
      { id: 'card2', name: 'Sky Eagle', type: 'Beast', level: 1, attack: 2, health: 3, cost: 1, affinity: 'sky' },
      { id: 'card3', name: 'Fire Fox', type: 'Beast', level: 1, attack: 4, health: 1, cost: 1, affinity: 'fire' },
      { id: 'card4', name: 'Water Turtle', type: 'Beast', level: 1, attack: 1, health: 4, cost: 1, affinity: 'water' },
      { id: 'card5', name: 'Rock Bear', type: 'Beast', level: 1, attack: 3, health: 3, cost: 2, affinity: 'neutral' },
      { id: 'card6', name: 'Leaf Sprite', type: 'Beast', level: 1, attack: 2, health: 2, cost: 1, affinity: 'forest' },
      { id: 'card7', name: 'Storm Hawk', type: 'Beast', level: 1, attack: 3, health: 2, cost: 2, affinity: 'sky' },
      { id: 'card8', name: 'Flame Cat', type: 'Beast', level: 1, attack: 2, health: 2, cost: 1, affinity: 'fire' },
      { id: 'card9', name: 'Coral Fish', type: 'Beast', level: 1, attack: 2, health: 3, cost: 2, affinity: 'water' },
      { id: 'card10', name: 'Stone Golem', type: 'Beast', level: 2, attack: 4, health: 4, cost: 3, affinity: 'neutral' },
    ];

    // Put first 5 in deck, all in collection
    const deckIds = starterCards.slice(0, 5).map(c => c.id);

    return {
      currentScreen: 'menu',
      cards: {
        collected: starterCards as any,
        deck: deckIds
      },
      missions: [],
      stats: { playerLevel: 1, totalXP: 0, tokens: 100, diamonds: 10, serums: 5 },
      settings: {
        enabled: true,
        musicEnabled: true,
        effectsEnabled: true,
        musicVolume: 80,
        effectsVolume: 80,
        sfxEnabled: true,
        sfxVolume: 80
      } as SoundSettings
    };
  }

  private render(): void {
    console.log('[WebGame] render() called');

    // Use stored UI tree (it's reactive via bindings)
    if (this.uiTree) {
      console.log('[WebGame] Canvas dimensions:', this.canvas.width, 'x', this.canvas.height);
      console.log('[WebGame] Calling renderer.render...');
      this.renderer.render(this.uiTree);
      console.log('[WebGame] render() complete');
    }
  }

  private async handleButtonClick(buttonId: string): Promise<void> {
    console.log('[Web] Button clicked:', buttonId);
    // TODO: Implement button actions
  }

  private async handleCardSelect(cardId: string): Promise<void> {
    console.log('[Web] Card selected:', cardId);
    // TODO: Implement card selection
  }

  private async handleMissionSelect(missionId: string): Promise<void> {
    console.log('[Web] Mission selected:', missionId);
    // TODO: Implement mission selection
  }

  private handleSettingsChange(settingId: string, value: any): void {
    console.log('[Web] Settings changed:', settingId, value);
    // TODO: Implement settings changes
  }

  private async handleBattleAction(action: string): Promise<void> {
    console.log('[Web] Battle action:', action);
    // TODO: Implement battle actions
  }

  resize(width: number, height: number): void {
    // Canvas is fixed at 1280x720, no resizing needed
    this.render();
  }

  dispose(): void {
    this.game.dispose();
    // UIRenderer doesn't have dispose method
  }
}

export async function createWebGame(canvasId: string): Promise<BloomBeastsWebGame | null> {
  const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
  if (!canvas) return null;

  // Canvas dimensions are set in HTML (width="1280" height="720")
  // DO NOT set them here as it clears the canvas!
  console.log('[createWebGame] Canvas dimensions:', canvas.width, 'x', canvas.height);

  const game = new BloomBeastsWebGame(canvas);
  await game.initialize();

  return game;
}
