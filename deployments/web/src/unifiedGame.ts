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
import { BattleScreenNew } from './screens/battleScreen.new';

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
  private battleScreen: BattleScreenNew | null = null;
  private currentScreen: string = 'start-menu';

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
      renderCards: (cards: any[], deckSize: number, deckCardIds: string[], stats: any) => {
        console.log('[Platform] renderCards called with', cards.length, 'cards');
        // Store captured data on the instance
        (this as any).capturedCards = cards;
        (this as any).capturedDeckIds = deckCardIds;
      },
      renderBattle: (battleData: BattleDisplay) => {
        console.log('[Platform] renderBattle called with battle data');
        this.renderBattleScreen(battleData);
      },
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

    // example what I want for web
    this.game = new BloomBeastsGame({
      setPlayerData: (data: PlayerData) => { localStorage.setItem('playerData', JSON.stringify(data)); },
      getPlayerData: () => { return localStorage.getItem('playerData') ? JSON.parse(localStorage.getItem('playerData')!) : null; },
      getImageAssetMappings: () => {
        return {
          background: '/shared/images/background.png',
          menu: '/shared/images/menu.png',
          ...
        };
      },
      getSoundAssetMappings: () => {
        return {
          backgroundMusic: '/shared/sounds/backgroundMusic.mp3',
          sfx: '/shared/sounds/sfx.mp3',
          ...
        };
      },
      getUIMethodMappings 
      render: (uiNode: UINode) => {
        this.renderer.render(uiNode);
      }
    });
    
    // this.game = new BloomBeastsGame({
    //   playerData: this.playerData as any,
    //   onButtonClick: this.handleButtonClick.bind(this),
    //   onCardSelect: this.handleCardSelect.bind(this),
    //   onMissionSelect: this.handleMissionSelect.bind(this),
    //   onSettingsChange: this.handleSettingsChange.bind(this),
    //   onBattleAction: this.handleBattleAction.bind(this),
    //   onRenderNeeded: () => this.render()
    // });

    // Create UI tree once
    this.uiTree = this.game.createUI();

    this.playerData.subscribe(async () => {
      // Load card images when player data changes
      const data = this.playerData.get();
      if (data && data.cards && data.cards.collected) {
        await this.loadCardImages(data.cards.collected);
      }
      this.render();
    });
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

    // Ensure battle-specific images are loaded with proper names
    // Map some common battle assets
    const battleAssetMappings = {
      'playboard': 'playboard',
      'sideMenu': 'sideMenu',
      'greenButton': 'greenButton',
      'standardButton': 'standardButton',
      'attackIcon': 'attackIcon',
      'abilityIcon': 'abilityIcon',
      'experienceBar': 'experienceBar',
      'TrapCardPlayboard': 'TrapCardPlayboard'
    };

    for (const [key, value] of Object.entries(battleAssetMappings)) {
      if (images[value]) {
        this.renderer.setImage(key, images[value]);
      }
    }

    if (!this.gameManager) throw new Error('GameManager not initialized');
    await this.gameManager.initialize();
    const initialData = await this.loadPlayerData();
    console.log('[WebGame] Initial player data:', initialData);
    if (initialData) {
      // Load card images before setting player data
      if (initialData.cards && initialData.cards.collected) {
        console.log('[WebGame] Loading initial card images...');
        await this.loadCardImages(initialData.cards.collected);
      }
      this.playerData.set(initialData);
    }
    // Initial render
    console.log('[WebGame] Triggering initial render...');
    this.render();
    console.log('[WebGame] Initialization complete!');
  }

  private async loadPlayerData(): Promise<PlayerData | null> {
    // After GameManager.initialize(), trigger showCards() to populate the renderCards callback
    if (!this.gameManager) return null;

    // Trigger showCards() to call renderCards callback with the starter deck
    await this.gameManager.showCards();

    // Get the captured data from the renderCards callback
    const capturedCards = (this as any).capturedCards || [];
    const capturedDeckIds = (this as any).capturedDeckIds || [];

    console.log('[WebGame] Loaded from GameManager:', capturedCards.length, 'cards,', capturedDeckIds.length, 'in deck');

    return {
      currentScreen: 'cards',
      cards: {
        collected: capturedCards,
        deck: capturedDeckIds
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

  private async loadCardImages(cards: any[]): Promise<void> {
    console.log('[WebGame] Loading card images for', cards.length, 'cards');

    // Load base card templates (shared across cards)
    if (!this.assetLoader.hasImage('baseCard')) {
      await this.assetLoader.loadBaseCardImage();
      const baseCard = this.assetLoader.getImage('basecard');
      if (baseCard) {
        this.renderer.setImage('baseCard', baseCard);
        console.log('✓ Loaded base card template');
      }
    }

    // Load affinity icons
    const affinities = ['Forest', 'Water', 'Fire', 'Sky'];
    for (const affinity of affinities) {
      const affinityKey = `affinity-${affinity}`;
      if (!this.assetLoader.hasImage(affinityKey)) {
        await this.assetLoader.loadAffinityIcon(affinity);
        const affinityIcon = this.assetLoader.getImage(affinityKey);
        if (affinityIcon) {
          this.renderer.setImage(affinityKey, affinityIcon);
          console.log(`✓ Loaded ${affinity} affinity icon`);
        }
      }
    }

    // Load card-type templates (Magic, Trap, Buff) - one-time load
    const cardTypes = ['Magic', 'Trap', 'Buff'];
    for (const cardType of cardTypes) {
      const templateKey = `${cardType.toLowerCase()}Card`;
      if (!this.assetLoader.hasImage(templateKey)) {
        const loadMethod = `load${cardType}CardTemplate` as keyof typeof this.assetLoader;
        if (typeof this.assetLoader[loadMethod] === 'function') {
          try {
            await (this.assetLoader[loadMethod] as any)();
            const cacheKey = `${cardType.toLowerCase()}-card-template`;
            const template = this.assetLoader.getImage(cacheKey);
            if (template) {
              this.renderer.setImage(templateKey, template);
              console.log(`✓ Loaded ${cardType} card template`);
            }
          } catch (error) {
            console.warn(`Failed to load ${cardType} template:`, error);
          }
        }
      }
    }

    // Load affinity-specific habitat templates (HabitatCard.png from affinity folders)
    const habitatAffinities = ['Forest', 'Water', 'Fire', 'Sky'];
    for (const habitatAffinity of habitatAffinities) {
      // UI expects key like 'forest-habitat'
      const templateKey = `${habitatAffinity.toLowerCase()}-habitat`;
      if (!this.assetLoader.hasImage(templateKey)) {
        try {
          await this.assetLoader.loadHabitatCardTemplate(habitatAffinity);
          // AssetLoader stores it as 'habitat-card-template-{affinity}'
          const cacheKey = `habitat-card-template-${habitatAffinity}`;
          const template = this.assetLoader.getImage(cacheKey);
          if (template) {
            this.renderer.setImage(templateKey, template);
            console.log(`✓ Loaded ${habitatAffinity} habitat card template (${cacheKey} -> ${templateKey})`);
          }
        } catch (error) {
          console.warn(`Failed to load ${habitatAffinity} habitat template:`, error);
        }
      }
    }

    // Load each card's specific assets
    for (const card of cards) {
      const cardImageKey = `card-${card.name}`;
      const beastImageKey = `beast-${card.name}`;

      // Skip if already loaded
      if (card.type === 'Bloom' && this.assetLoader.hasImage(beastImageKey)) {
        continue;
      }
      if (card.type !== 'Bloom' && this.assetLoader.hasImage(cardImageKey)) {
        continue;
      }

      // Load the card image based on card type and affinity
      try {
        const assets = await this.assetLoader.loadCardAssets(card, 'default');

        // For Bloom cards, load the beast artwork
        if (card.type === 'Bloom' && assets.mainImage) {
          this.renderer.setImage(beastImageKey, assets.mainImage);
          console.log(`✓ Loaded beast image: ${beastImageKey}`);
        }

        // For Magic/Trap/Buff/Habitat cards, load the card artwork
        if (card.type !== 'Bloom' && assets.mainImage) {
          this.renderer.setImage(cardImageKey, assets.mainImage);
          console.log(`✓ Loaded card image: ${cardImageKey}`);
        }
      } catch (error) {
        console.warn(`Failed to load card image for ${card.name}:`, error);
      }
    }
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

  private renderBattleScreen(battleData: BattleDisplay): void {
    console.log('[WebGame] renderBattleScreen called:', {
      playerHealth: battleData.playerHealth,
      opponentHealth: battleData.opponentHealth,
      currentTurn: battleData.currentTurn
    });

    // Create battle screen if not exists
    if (!this.battleScreen) {
      this.battleScreen = new BattleScreenNew();
    }

    // Update screen state
    this.currentScreen = 'battle';

    // Update battle screen with data and action callback
    this.battleScreen.update(battleData, (action: string) => {
      console.log('[WebGame] Battle action:', action);
      // Forward action to game manager
      if (this.gameManager) {
        (this.gameManager as any).handleButtonClick?.(action);
      }
    });

    // Create and render the battle UI
    const battleUI = this.battleScreen.createUI();
    this.uiTree = battleUI;

    // Render the updated UI
    this.renderer.render(this.uiTree);
    console.log('[WebGame] Battle screen rendered');
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
