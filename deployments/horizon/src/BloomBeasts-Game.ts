import * as hz from 'horizon/core';
import type { Player } from 'horizon/core';
import { UIComponent, View, Text, Pressable, Image, Binding, UINode, ImageSource, DynamicList } from 'horizon/ui';
import { HorizonPlatform } from './BloomBeasts-GamePlatform';
import type * as BB from './BloomBeasts-Types';

/**
 * BloomBeastsUI - Simplified UI Component
 * Uses a single PlayerData binding for all state management
 * Dynamic asset mapping instead of hardcoded props
 */
class BloomBeastsUI extends UIComponent {
  // Panel dimensions (1280x720 like web version)
  private readonly PANEL_WIDTH = 1280;
  private readonly PANEL_HEIGHT = 720;

  panelWidth: number = 1280;
  panelHeight: number = 720;

  // Cards display configuration
  private readonly CARDS_PER_ROW = 4;
  private readonly ROWS_PER_PAGE = 2;

  // Single source of truth - all state in PlayerData
  // Starts as null until game manager initializes
  private playerData = new Binding<BB.PlayerData | null>(null);
  private playerDataValue: BB.PlayerData | null = null;

  // Card grid bindings for DynamicList
  private row1CardsBinding = new Binding<any[]>([]);
  private row2CardsBinding = new Binding<any[]>([]);

  // Platform and game manager
  private platform: HorizonPlatform | null = null;
  private gameManager: any = null;

  // Callbacks
  onButtonClick?: (buttonId: string) => void;
  onCardSelect?: (cardId: string) => void;
  onMissionSelect?: (missionId: string) => void;
  onSettingsChange?: (settingId: string, value: any) => void;

  // Dynamic props definition based on asset naming convention
  static propsDefinition = createPropsFromAssetList([
    // UI Elements
    'img_Background',
    'img_Menu',
    'img_CardsContainer',
    'img_MissionContainer',
    'img_Playboard',
    'img_SideMenu',
    'img_StandardButton',
    'img_GreenButton',
    'img_RedButton',
    'img_LongGreenButton',
    'img_LoseImage',

    // Affinity Icons
    'img_affinity_FireIcon',
    'img_affinity_ForestIcon',
    'img_affinity_SkyIcon',
    'img_affinity_WaterIcon',

    // Card Templates
    'img_cards_BaseCard',
    'img_cards_ExperienceBar',
    'img_cards_BossMission',
    'img_cards_BuffCard',
    'img_cards_BuffCardPlayboard',
    'img_cards_MagicCard',
    'img_cards_MagicCardPlayboard',
    'img_cards_TrapCard',
    'img_cards_TrapCardPlayboard',
    'img_cards_TheBloomMaster',

    // Fire Cards
    'img_cards_Fire_Blazefinch',
    'img_cards_Fire_Charcoil',
    'img_cards_Fire_CinderPup',
    'img_cards_Fire_FireMission',
    'img_cards_Fire_HabitatCard',
    'img_cards_Fire_HabitatCardPlayboard',
    'img_cards_Fire_Magmite',
    'img_cards_Fire_VolcanicScar',

    // Forest Cards
    'img_cards_Forest_AncientForest',
    'img_cards_Forest_ForestMission',
    'img_cards_Forest_HabitatCard',
    'img_cards_Forest_HabitatCardPlayboard',
    'img_cards_Forest_LeafSprite',
    'img_cards_Forest_Mosslet',
    'img_cards_Forest_Mushroomancer',
    'img_cards_Forest_Rootling',

    // Sky Cards
    'img_cards_Sky_AeroMoth',
    'img_cards_Sky_CirrusFloof',
    'img_cards_Sky_ClearZenith',
    'img_cards_Sky_GaleGlider',
    'img_cards_Sky_HabitatCard',
    'img_cards_Sky_HabitatCardPlayboard',
    'img_cards_Sky_SkyMission',
    'img_cards_Sky_StarBloom',

    // Water Cards
    'img_cards_Water_AquaPebble',
    'img_cards_Water_Bubblefin',
    'img_cards_Water_DeepSeaGrotto',
    'img_cards_Water_DewdropDrake',
    'img_cards_Water_HabitatCard',
    'img_cards_Water_HabitatCardPlayboard',
    'img_cards_Water_KelpCub',
    'img_cards_Water_WaterMission',

    // Magic Cards
    'img_cards_Magic_AetherSwap',
    'img_cards_Magic_CleansingDownpour',
    'img_cards_Magic_ElementalBurst',
    'img_cards_Magic_LightningStrike',
    'img_cards_Magic_NectarBlock',
    'img_cards_Magic_NectarDrain',
    'img_cards_Magic_NectarSurge',
    'img_cards_Magic_Overgrowth',
    'img_cards_Magic_PowerUp',
    'img_cards_Magic_Purify',

    // Trap Cards
    'img_cards_Trap_BearTrap',
    'img_cards_Trap_EmergencyBloom',
    'img_cards_Trap_HabitatLock',
    'img_cards_Trap_HabitatShield',
    'img_cards_Trap_MagicSheild',
    'img_cards_Trap_ThornSnare',
    'img_cards_Trap_Vaporize',
    'img_cards_Trap_XPHarvest',

    // Buff Cards
    'img_cards_Buff_BattleFury',
    'img_cards_Buff_MysticShield',
    'img_cards_Buff_NaturesBlessing',
    'img_cards_Buff_SwiftWind',

    // Menu Frames (for animation)
    'img_menu_Frame1',
    'img_menu_Frame2',
    'img_menu_Frame3',
    'img_menu_Frame4',
    'img_menu_Frame5',
    'img_menu_Frame6',
    'img_menu_Frame7',
    'img_menu_Frame8',
    'img_menu_Frame9',
    'img_menu_Frame10',

    // Icons
    'img_icons_ability',
    'img_icons_attack',

    // Audio Assets
    'audio_BackgroundMusic',
    'audio_BattleMusic',
    'audio_sfx_attack',
    'audio_sfx_lose',
    'audio_sfx_win',
    'audio_sfx_menuButtonSelect',
    'audio_sfx_playCard',
    'audio_sfx_trapCardActivated'
  ]);

  // ============= Lifecycle Methods =============

  start() {
    super.start();
    console.log('BloomBeastsUI starting...');
    console.log('World object:', this.world);
    console.log('Props available:', Object.keys(this.props).length, 'assets');

    // Custom UI components are already player-specific - each player gets their own instance
    // Initialize the game for this player
    this.initializeGame().catch(error => {
      console.error('Failed to initialize game:', error);
    });
  }

  private async initializeGame() {
    try {
      console.log('Initializing platform...');

      // Initialize platform with persistent storage
      // Platform will get the local player during initialization
      this.platform = new HorizonPlatform(this, this.world);
      await this.platform.initialize();

      console.log('Platform initialized, checking for game engine...');

      // Get BloomBeasts game engine
      const BloomBeastsImpl = (globalThis as any).BloomBeasts;
      if (!BloomBeastsImpl) {
        console.warn('BloomBeasts game engine not found - running in UI-only mode');
        console.warn('To enable full game functionality, deploy BloomBeasts-GameEngine.ts as a standalone script');
        return;
      }

      console.log('Creating game manager...');

      // Create game manager
      this.gameManager = new BloomBeastsImpl.GameManager(this.platform);

      console.log('Initializing game manager...');
      await this.gameManager.initialize();

      console.log('BloomBeastsUI initialized successfully with game engine');
    } catch (error) {
      console.error('Error during initialization:');
      console.error('  Message:', (error as any)?.message || 'Unknown error');
      console.error('  Stack:', (error as any)?.stack || 'No stack trace');
      console.error('  Error object:', JSON.stringify(error, null, 2));

      // Continue anyway - UI will work in standalone mode
      console.log('Continuing in UI-only mode');
    }
  }

  // ============= UI Initialization =============

  initializeUI(): UINode {
    console.log('initializeUI called - creating UI structure');

    return View({
      style: {
        width: this.PANEL_WIDTH,
        height: this.PANEL_HEIGHT,
        position: 'relative',
        backgroundColor: '#000000',
      },
      children: [
        // Loading screen (shown while playerData is null)
        this.renderLoadingScreen(),

        // Main UI (shown when playerData is loaded)
        this.renderMainUI(),
      ],
    });
  }

  private renderLoadingScreen(): UINode {
    const isLoading = this.playerData.derive((data) => data === null ? 1 : 0);

    return View({
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: this.PANEL_WIDTH,
        height: this.PANEL_HEIGHT,
        backgroundColor: '#1a1a2e',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: isLoading,
        zIndex: 100,
      },
      children: [
        Text({
          text: 'Loading Bloom Beasts...',
          style: {
            fontSize: 32,
            color: '#FFFFFF',
            fontWeight: 'bold',
          },
        }),
        Text({
          text: 'Initializing game data',
          style: {
            fontSize: 16,
            color: '#AAAAAA',
            marginTop: 20,
          },
        }),
      ],
    });
  }

  private renderMainUI(): UINode {
    const isLoaded = this.playerData.derive((data) => data !== null ? 1 : 0);

    return View({
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: this.PANEL_WIDTH,
        height: this.PANEL_HEIGHT,
        opacity: isLoaded,
      },
      children: [
        // Background (always visible)
        this.renderBackground(),

        // Screen container - switches based on currentScreen
        this.renderScreenContainer(),

        // Side menu (always visible except in battle) - MUST BE LAST for proper z-ordering
        this.renderSideMenu(),
      ],
    });
  }

  // ============= Main Screen Container =============

  private renderScreenContainer(): UINode {
    return View({
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        // Don't cover the side menu (starts at 1145px)
        width: 1145,
        height: this.PANEL_HEIGHT,
      },
      children: [
        // Menu Screen
        this.renderMenuScreen(),

        // Cards Screen
        this.renderCardsScreen(),

        // Missions Screen (placeholder for now)
        this.renderMissionsScreen(),

        // Settings Screen (placeholder for now)
        this.renderSettingsScreen(),

        // Battle Screen (placeholder for now)
        this.renderBattleScreen(),
      ],
    });
  }

  // ============= Background =============

  private renderBackground(): UINode {
    const bgAsset = this.props.img_Background;

    if (!bgAsset) {
      // Fallback gradient background
      return View({
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: this.PANEL_WIDTH,
          height: this.PANEL_HEIGHT,
          backgroundColor: '#1a1a2e',
        },
      });
    }

    return Image({
      source: this.createImageSource(bgAsset),
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: this.PANEL_WIDTH,
        height: this.PANEL_HEIGHT,
      },
    });
  }

  // ============= Side Menu =============

  private renderSideMenu(): UINode {
    // Hide side menu in battle screen
    const isVisible = this.playerData.derive((data) =>
      data?.localState?.currentScreen !== 'battle' ? 1 : 0
    );

    return View({
      style: {
        position: 'absolute',
        top: 128,
        left: 1145,
        width: 135,
        height: 592,
        opacity: isVisible,
      },
      children: [
        // Side menu background
        this.renderSideMenuBackground(),

        // Player stats
        this.renderPlayerStats(),

        // XP bar
        this.renderXPBar(),

        // Navigation buttons
        this.renderNavigationButtons(),
      ],
    });
  }

  private renderSideMenuBackground(): UINode {
    const menuAsset = this.props.img_SideMenu;

    if (!menuAsset) {
      return View({
        style: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: 127,
          height: 465,
          backgroundColor: '#2a2a4e',
          borderRadius: 10,
        },
      });
    }

    return Image({
      source: this.createImageSource(menuAsset),
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 127,
        height: 465,
      },
    });
  }

  private renderPlayerStats(): UINode {
    return View({
      style: {
        position: 'absolute',
        top: 60,
        left: 17,
        width: 95,
      },
      children: [
        // Tokens
        Text({
          text: this.playerData.derive((data) => `🪙 ${data?.tokens || 0}`),
          style: {
            fontSize: 18,
            color: '#FFFFFF',
            marginBottom: 8,
          },
        }),

        // Diamonds
        Text({
          text: this.playerData.derive((data) => `💎 ${data?.diamonds || 0}`),
          style: {
            fontSize: 18,
            color: '#FFFFFF',
            marginBottom: 8,
          },
        }),

        // Serums
        Text({
          text: this.playerData.derive((data) => `🧪 ${data?.serums || 0}`),
          style: {
            fontSize: 18,
            color: '#FFFFFF',
          },
        }),
      ],
    });
  }

  private renderXPBar(): UINode {
    const XP_THRESHOLDS = [0, 100, 300, 700, 1500, 3100, 6300, 12700, 25500];

    return View({
      style: {
        position: 'absolute',
        top: 317,
        left: 11,
        width: 109,
        height: 8,
      },
      children: [
        // XP bar background
        this.props.img_cards_ExperienceBar ? Image({
          source: this.createImageSource(this.props.img_cards_ExperienceBar),
          style: { width: 109, height: 8 },
        }) : View({
          style: {
            width: 109,
            height: 8,
            backgroundColor: '#555555',
            borderRadius: 4,
          },
        }),

        // XP fill
        View({
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: this.playerData.derive((data) => {
              if (!data) return 0;
              const level = data.level;
              const xp = data.totalXP;
              const xpForCurrent = XP_THRESHOLDS[level - 1];
              const xpForNext = level < 9 ? XP_THRESHOLDS[level] : XP_THRESHOLDS[8];
              const progress = (xp - xpForCurrent) / (xpForNext - xpForCurrent);
              return Math.floor(109 * Math.min(1, Math.max(0, progress)));
            }),
            height: 8,
            backgroundColor: '#00FF00',
            borderRadius: 4,
          },
        }),

        // Level text
        Text({
          text: this.playerData.derive((data) => `Lv ${data?.level || 1}`),
          style: {
            position: 'absolute',
            top: -2,
            left: 45,
            fontSize: 12,
            color: '#FFFFFF',
            fontWeight: 'bold',
          },
        }),
      ],
    });
  }

  private renderNavigationButtons(): UINode {
    return View({
      style: {
        position: 'absolute',
        top: 241,
        left: 11,
      },
      children: [
        this.renderNavButton('Missions', 'btn-missions', 0),
        this.renderNavButton('Cards', 'btn-cards', 1),
        this.renderNavButton('Settings', 'btn-settings', 2),
      ],
    });
  }

  private renderNavButton(label: string, id: string, index: number): UINode {
    const screenMap: { [key: string]: string } = {
      'btn-missions': 'missions',
      'btn-cards': 'cards',
      'btn-settings': 'settings',
    };

    // Derive opacity and color directly from playerData
    const opacity = this.playerData.derive((data) => {
      const currentScreen = data?.localState?.currentScreen;
      return currentScreen === screenMap[id] ? 1 : 0.8;
    });

    const bgColor = this.playerData.derive((data) => {
      const currentScreen = data?.localState?.currentScreen;
      return currentScreen === screenMap[id] ? '#6a6a8a' : '#4a4a6a';
    });

    return Pressable({
      onClick: (player: Player) => this.handleButtonClick(id),
      style: {
        position: 'absolute',
        top: index * 51,
        left: 0,
        width: 105,
        height: 36,
      },
      children: [
        // Button background
        this.props.img_StandardButton ? Image({
          source: this.createImageSource(this.props.img_StandardButton),
          style: {
            width: 105,
            height: 36,
            opacity: opacity,
          },
        }) : View({
          style: {
            width: 105,
            height: 36,
            backgroundColor: bgColor,
            borderRadius: 8,
          },
        }),

        // Button text
        Text({
          text: label,
          style: {
            position: 'absolute',
            top: 10,
            left: 0,
            width: 105,
            fontSize: 14,
            color: '#FFFFFF',
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }),
      ],
    });
  }

  // ============= Menu Screen =============

  private renderMenuScreen(): UINode {
    const isVisible = this.playerData.derive((data) =>
      data?.localState?.currentScreen === 'menu' ? 1 : 0
    );

    return View({
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 1145,
        height: this.PANEL_HEIGHT,
        opacity: isVisible,
      },
      children: [
        // Menu frame animation (static for now, frame 1)
        this.props.img_menu_Frame1 ? Image({
          source: this.createImageSource(this.props.img_menu_Frame1),
          style: {
            position: 'absolute',
            top: 25,
            left: 143,
            width: 858,
            height: 670,
          },
        }) : View({
          style: {
            position: 'absolute',
            top: 25,
            left: 143,
            width: 858,
            height: 670,
            backgroundColor: 'rgba(42, 42, 78, 0.8)',
            borderRadius: 20,
          },
        }),

        // Title
        Text({
          text: 'BLOOM BEASTS',
          style: {
            position: 'absolute',
            top: 250,
            left: 0,
            width: 1145,
            fontSize: 72,
            color: '#FFFFFF',
            fontWeight: 'bold',
            textAlign: 'center',
          },
        }),

        // Subtitle
        Text({
          text: 'Welcome to the world of Bloom Beasts!',
          style: {
            position: 'absolute',
            top: 340,
            left: 0,
            width: 1145,
            fontSize: 24,
            color: '#CCCCCC',
            textAlign: 'center',
          },
        }),

        // Start hint
        Text({
          text: 'Navigate using the side menu',
          style: {
            position: 'absolute',
            top: 450,
            left: 0,
            width: 1145,
            fontSize: 18,
            color: '#AAAAAA',
            textAlign: 'center',
          },
        }),
      ],
    });
  }

  // ============= Cards Screen =============

  private renderCardsScreen(): UINode {
    const isVisible = this.playerData.derive((data) =>
      data?.localState?.currentScreen === 'cards' ? 1 : 0
    );

    return View({
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 1145,
        height: this.PANEL_HEIGHT,
        opacity: isVisible,
      },
      children: [
        // Cards container background
        this.props.img_CardsContainer ? Image({
          source: this.createImageSource(this.props.img_CardsContainer),
          style: {
            position: 'absolute',
            top: 41,
            left: 103,
            width: 950,
            height: 640,
          },
        }) : View({
          style: {
            position: 'absolute',
            top: 41,
            left: 103,
            width: 950,
            height: 640,
            backgroundColor: 'rgba(42, 42, 78, 0.8)',
            borderRadius: 20,
          },
        }),

        // Deck counter
        Text({
          text: this.playerData.derive((data) =>
            `Deck: ${data?.cards?.deck?.length || 0}/30`
          ),
          style: {
            position: 'absolute',
            top: 60,
            left: 900,
            fontSize: 20,
            color: '#FFFFFF',
            fontWeight: 'bold',
          },
        }),

        // Cards grid
        this.renderCardsGrid(),

        // Pagination controls
        this.renderCardsPagination(),
      ],
    });
  }

  private renderCardsGrid(): UINode {
    return View({
      style: {
        position: 'absolute',
        top: 120,
        left: 150,
        width: 850,
        height: 500,
      },
      children: [
        // Row 1
        DynamicList({
          data: this.row1CardsBinding,
          renderItem: (card: any, index?: number) => this.renderCard(card, index || 0),
          style: {
            flexDirection: 'row',
            marginBottom: 20,
          },
        }),

        // Row 2
        DynamicList({
          data: this.row2CardsBinding,
          renderItem: (card: any, index?: number) => this.renderCard(card, index || 0),
          style: {
            flexDirection: 'row',
          },
        }),
      ],
    });
  }

  private updateCardGridBindings() {
    if (!this.playerDataValue) {
      this.row1CardsBinding.set([]);
      this.row2CardsBinding.set([]);
      return;
    }

    const offset = this.playerDataValue.localState?.cardsPageOffset || 0;
    const cardsPerPage = this.CARDS_PER_ROW * this.ROWS_PER_PAGE;
    const startIndex = offset * cardsPerPage;
    const allCards = this.playerDataValue.cards?.collected || [];

    // Row 1: first 4 cards
    const row1Start = startIndex;
    const row1End = startIndex + this.CARDS_PER_ROW;
    this.row1CardsBinding.set(allCards.slice(row1Start, row1End));

    // Row 2: next 4 cards
    const row2Start = startIndex + this.CARDS_PER_ROW;
    const row2End = startIndex + this.CARDS_PER_ROW * 2;
    this.row2CardsBinding.set(allCards.slice(row2Start, row2End));
  }

  private renderCard(card: any, index: number): UINode {
    const cardWidth = 150;
    const cardHeight = 200;

    // Check if this card is in the deck
    const isInDeck = this.playerData.derive((data) =>
      data?.cards?.deck?.includes(card.id) ? 1 : 0
    );

    return Pressable({
      onClick: (player: Player) => {
        console.log('Card clicked:', card.name);
        this.onCardSelect?.(card.id);
      },
      style: {
        width: cardWidth,
        height: cardHeight,
        marginRight: 20,
        marginBottom: 20,
      },
      children: [
        // Card background and image
        this.renderCardContent(card, cardWidth, cardHeight),

        // Deck indicator (green border)
        View({
          style: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: cardWidth,
            height: cardHeight,
            borderWidth: 3,
            borderColor: '#00FF00',
            borderRadius: 10,
            opacity: isInDeck,
          },
        }),

        // Card stats
        this.renderCardStatsForCard(card, cardWidth),
      ],
    });
  }

  private renderCardContent(card: any, cardWidth: number, cardHeight: number): UINode {
    // Get the card image prop
    const cardImageProp = this.getCardImageProp(card);
    const imageSource = cardImageProp ? this.createImageSource(cardImageProp) : null;

    return View({
      style: {
        width: cardWidth,
        height: cardHeight,
        backgroundColor: '#2a2a4e',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#5a5a7e',
        justifyContent: 'center',
        alignItems: 'center',
      },
      children: [
        // Card image (if prop assigned)
        imageSource ? Image({
          source: imageSource,
          style: {
            width: cardWidth,
            height: cardHeight,
            borderRadius: 10,
          },
        }) : View({}),

        // Card name (fallback or overlay)
        Text({
          text: card.name || '',
          style: {
            fontSize: 14,
            color: '#FFFFFF',
            fontWeight: 'bold',
            textAlign: 'center',
            textShadowColor: '#000000',
            textShadowOffset: [1, 1],
            textShadowRadius: 2,
          },
        }),

        // Affinity badge
        Text({
          text: card.affinity || '',
          style: {
            position: 'absolute',
            top: 5,
            right: 5,
            fontSize: 10,
            color: '#AAAAAA',
            backgroundColor: 'rgba(0,0,0,0.5)',
            padding: 3,
            borderRadius: 3,
          },
        }),
      ],
    });
  }

  private renderCardStatsForCard(card: any, cardWidth: number): UINode {
    return View({
      style: {
        position: 'absolute',
        bottom: 10,
        left: 0,
        width: cardWidth,
        flexDirection: 'row',
        justifyContent: 'space-around',
      },
      children: [
        // Attack stat
        card.baseAttack !== undefined ? Text({
          text: `⚔️ ${card.baseAttack}`,
          style: {
            color: '#FFFFFF',
            fontSize: 14,
            fontWeight: 'bold',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: 3,
            borderRadius: 3,
          },
        }) : View({}),

        // Health stat
        card.baseHealth !== undefined ? Text({
          text: `❤️ ${card.baseHealth}`,
          style: {
            color: '#FFFFFF',
            fontSize: 14,
            fontWeight: 'bold',
            backgroundColor: 'rgba(0,0,0,0.7)',
            padding: 3,
            borderRadius: 3,
          },
        }) : View({}),
      ],
    });
  }

  private renderCardsPagination(): UINode {
    return View({
      style: {
        position: 'absolute',
        top: 640,
        left: 450,
        width: 250,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
      },
      children: [
        // Previous button
        Pressable({
          onClick: (player: Player) => this.handlePageChange(-1),
          style: {
            padding: 10,
            marginRight: 20,
          },
          children: [
            Text({
              text: '◀',
              style: {
                fontSize: 24,
                color: '#FFFFFF',
              },
            }),
          ],
        }),

        // Page indicator
        Text({
          text: this.playerData.derive((data) => {
            const page = (data?.localState?.cardsPageOffset || 0) + 1;
            return `Page ${page}`;
          }),
          style: {
            fontSize: 18,
            color: '#FFFFFF',
          },
        }),

        // Next button
        Pressable({
          onClick: (player: Player) => this.handlePageChange(1),
          style: {
            padding: 10,
            marginLeft: 20,
          },
          children: [
            Text({
              text: '▶',
              style: {
                fontSize: 24,
                color: '#FFFFFF',
              },
            }),
          ],
        }),
      ],
    });
  }

  // ============= Placeholder Screens =============

  private renderMissionsScreen(): UINode {
    const isVisible = this.playerData.derive((data) =>
      data?.localState?.currentScreen === 'missions' ? 1 : 0
    );

    return View({
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 1145,
        height: this.PANEL_HEIGHT,
        opacity: isVisible,
      },
      children: [
        Text({
          text: 'Missions Screen',
          style: {
            position: 'absolute',
            top: 300,
            left: 0,
            width: 1145,
            fontSize: 48,
            color: '#FFFFFF',
            textAlign: 'center',
          },
        }),
        Text({
          text: 'Coming soon...',
          style: {
            position: 'absolute',
            top: 380,
            left: 0,
            width: 1145,
            fontSize: 24,
            color: '#AAAAAA',
            textAlign: 'center',
          },
        }),
      ],
    });
  }

  private renderSettingsScreen(): UINode {
    const isVisible = this.playerData.derive((data) =>
      data?.localState?.currentScreen === 'settings' ? 1 : 0
    );

    return View({
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 1145,
        height: this.PANEL_HEIGHT,
        opacity: isVisible,
      },
      children: [
        Text({
          text: 'Settings',
          style: {
            position: 'absolute',
            top: 300,
            left: 0,
            width: 1145,
            fontSize: 48,
            color: '#FFFFFF',
            textAlign: 'center',
          },
        }),
        Text({
          text: 'Volume and other settings coming soon...',
          style: {
            position: 'absolute',
            top: 380,
            left: 0,
            width: 1145,
            fontSize: 24,
            color: '#AAAAAA',
            textAlign: 'center',
          },
        }),
      ],
    });
  }

  private renderBattleScreen(): UINode {
    const isVisible = this.playerData.derive((data) =>
      data?.localState?.currentScreen === 'battle' ? 1 : 0
    );

    return View({
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: this.PANEL_WIDTH,
        height: this.PANEL_HEIGHT,
        opacity: isVisible,
      },
      children: [
        Text({
          text: 'Battle Screen',
          style: {
            position: 'absolute',
            top: 350,
            left: 0,
            width: this.PANEL_WIDTH,
            fontSize: 48,
            color: '#FFFFFF',
            textAlign: 'center',
          },
        }),
      ],
    });
  }

  // ============= Event Handlers =============

  private handleButtonClick(buttonId: string) {
    console.log('Button clicked:', buttonId);

    // Handle navigation directly
    switch (buttonId) {
      case 'btn-menu':
        this.navigateToScreen('menu');
        break;
      case 'btn-missions':
        this.navigateToScreen('missions');
        break;
      case 'btn-cards':
        this.navigateToScreen('cards');
        break;
      case 'btn-settings':
        this.navigateToScreen('settings');
        break;
      default:
        console.log('Unknown button:', buttonId);
    }

    // Also call the callback for game engine integration
    this.onButtonClick?.(buttonId);
  }

  private navigateToScreen(screen: BB.LocalState['currentScreen']) {
    if (!this.playerDataValue?.localState) {
      console.error('Cannot navigate: no playerDataValue or localState');
      return;
    }

    console.log('Navigating to screen:', screen, 'from:', this.playerDataValue.localState.currentScreen);

    // Update local state
    this.playerDataValue.localState.currentScreen = screen;

    // Update binding to trigger UI re-render
    this.playerData.set({ ...this.playerDataValue });

    console.log('Screen updated to:', screen);

    // Also update via platform for persistence
    this.platform?.updateLocalState({ currentScreen: screen });
  }

  private handlePageChange(direction: number) {
    if (!this.playerDataValue?.localState) return;

    const newOffset = Math.max(0, this.playerDataValue.localState.cardsPageOffset + direction);

    // Update local state
    this.playerDataValue.localState.cardsPageOffset = newOffset;
    this.playerData.set({ ...this.playerDataValue });

    // Update card grid for new page
    this.updateCardGridBindings();

    // Also update via platform for persistence
    this.platform?.updateLocalState({ cardsPageOffset: newOffset });
  }

  // ============= Public API =============

  setPlayerData(data: BB.PlayerData | null) {
    console.log('UI.setPlayerData called with:', {
      hasData: !!data,
      cardsCollected: data?.cards?.collected?.length || 0,
      deckSize: data?.cards?.deck?.length || 0,
      hasLocalState: !!data?.localState
    });

    // Update tracked value and binding
    this.playerDataValue = data;
    this.playerData.set(data);

    // Update card grid bindings for DynamicList
    this.updateCardGridBindings();

    // When data is first loaded, log card collection
    if (data && data.cards?.collected) {
      console.log(`Loaded ${data.cards.collected.length} cards in collection`);
      console.log(`Deck size: ${data.cards.deck?.length || 0}`);
    }
  }

  showDialog(title: string, message: string, buttons?: string[]): Promise<string> {
    // TODO: Implement dialog overlay
    console.log('Dialog:', title, message);
    return Promise.resolve('OK');
  }

  showCardDetail(cardDetail: BB.CardDetailDisplay) {
    // TODO: Implement card detail overlay
    console.log('Card Detail:', cardDetail);
  }

  showRewardsPopup(rewards: BB.RewardDisplay) {
    // TODO: Implement rewards popup
    console.log('Rewards:', rewards);
  }

  playMusic(src: string, loop: boolean, volume: number) {
    // TODO: Implement audio playback
    console.log('Play music:', src);
  }

  stopMusic() {
    // TODO: Implement audio stop
    console.log('Stop music');
  }

  playSfx(src: string, volume: number) {
    // TODO: Implement SFX playback
    console.log('Play SFX:', src);
  }

  // ============= Asset Helpers =============

  private createImageSource(asset: any): ImageSource | null {
    if (!asset) return null;
    try {
      return ImageSource.fromTextureAsset(asset);
    } catch (error) {
      console.error('Failed to create ImageSource:', error);
      return null;
    }
  }

  /**
   * Get card image prop from card data
   * Follows web deployment's asset loading pattern:
   * - Sanitizes card name (removes spaces and apostrophes)
   * - Maps to prop: img_cards_{Affinity}_{SanitizedName}
   * Example: {name: "Dewdrop Drake", affinity: "Water"} -> img_cards_Water_DewdropDrake
   */
  getCardImageProp(card: any): any {
    if (!card) return null;

    // Sanitize card name (same logic as web deployment)
    const sanitizedName = card.name.replace(/[\s']/g, '');

    // Construct prop name based on card type
    let propName: string;

    if (card.affinity === 'Magic') {
      propName = `img_cards_Magic_${sanitizedName}`;
    } else if (card.affinity === 'Trap') {
      propName = `img_cards_Trap_${sanitizedName}`;
    } else if (card.affinity === 'Buff') {
      propName = `img_cards_Buff_${sanitizedName}`;
    } else {
      // Bloom beasts and Habitats use affinity folder
      propName = `img_cards_${card.affinity}_${sanitizedName}`;
    }

    return this.props[propName] || null;
  }

  getCardImage(cardId: string): any {
    // Legacy method - kept for compatibility
    const propName = `img_cards_${cardId.replace(/\//g, '_')}`;
    return this.props[propName] || this.props.img_cards_BaseCard;
  }

  getBackground(backgroundId: string): any {
    const bgMap: { [key: string]: string } = {
      'main': 'img_Background',
      'menu': 'img_Menu',
      'cards': 'img_CardsContainer',
      'missions': 'img_MissionContainer',
      'battle': 'img_Playboard',
    };
    const propName = bgMap[backgroundId] || 'img_Background';
    return this.props[propName];
  }
}

// ============= Helper Functions =============

function createPropsFromAssetList(assetList: string[]): any {
  const props: any = {};
  for (const asset of assetList) {
    props[asset] = { type: hz.PropTypes.Asset };
  }
  return props;
}

// Register the component
UIComponent.register(BloomBeastsUI);