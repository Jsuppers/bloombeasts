import * as hz from 'horizon/core';
import type { Player } from 'horizon/core';
import { UIComponent, View, Text, Pressable, ScrollView, Image, Binding, UINode } from 'horizon/ui';
import { HorizonPlatform } from './BloomBeasts-GamePlatform';
import type * as BB from './BloomBeasts-Types';

// Helper to get BloomBeasts namespace (may not be loaded yet at module parse time)
function getBloomBeasts() {
  return (globalThis as any).BloomBeasts;
}

/**
 * Asset Props - All game assets from shared/images and shared/audio
 * Flattened using build-props.js for easy upload to Meta Horizon
 * Total: 99 images + 10 audio files
 */

/**
 * BloomBeastsUI - Custom UI Component for the game
 */
class BloomBeastsUI extends UIComponent {
  // Panel dimensions for Meta Horizon Custom UI (from gameDimensions in shared/constants/dimensions.ts)
  panelWidth = 1280;
  panelHeight = 720;

  // Static prop definitions for Meta Horizon
  static propsDefinition = {
    // ============= UI ELEMENTS (11) =============
    img_Background: { type: hz.PropTypes.Asset },
    img_CardsContainer: { type: hz.PropTypes.Asset },
    img_GreenButton: { type: hz.PropTypes.Asset },
    img_LongGreenButton: { type: hz.PropTypes.Asset },
    img_LoseImage: { type: hz.PropTypes.Asset },
    img_Menu: { type: hz.PropTypes.Asset },
    img_MissionContainer: { type: hz.PropTypes.Asset },
    img_Playboard: { type: hz.PropTypes.Asset },
    img_RedButton: { type: hz.PropTypes.Asset },
    img_SideMenu: { type: hz.PropTypes.Asset },
    img_StandardButton: { type: hz.PropTypes.Asset },
    // ============= AFFINITY ICONS (4) =============
    img_affinity_FireIcon: { type: hz.PropTypes.Asset },
    img_affinity_ForestIcon: { type: hz.PropTypes.Asset },
    img_affinity_SkyIcon: { type: hz.PropTypes.Asset },
    img_affinity_WaterIcon: { type: hz.PropTypes.Asset },
    // ============= CARD TEMPLATES & BASE CARDS (10) =============
    img_cards_BaseCard: { type: hz.PropTypes.Asset },
    img_cards_BossMission: { type: hz.PropTypes.Asset },
    img_cards_BuffCard: { type: hz.PropTypes.Asset },
    img_cards_BuffCardPlayboard: { type: hz.PropTypes.Asset },
    img_cards_ExperienceBar: { type: hz.PropTypes.Asset },
    img_cards_MagicCard: { type: hz.PropTypes.Asset },
    img_cards_MagicCardPlayboard: { type: hz.PropTypes.Asset },
    img_cards_TheBloomMaster: { type: hz.PropTypes.Asset },
    img_cards_TrapCard: { type: hz.PropTypes.Asset },
    img_cards_TrapCardPlayboard: { type: hz.PropTypes.Asset },
    // ============= BUFF CARDS (4) =============
    img_cards_Buff_BattleFury: { type: hz.PropTypes.Asset },
    img_cards_Buff_MysticShield: { type: hz.PropTypes.Asset },
    img_cards_Buff_NaturesBlessing: { type: hz.PropTypes.Asset },
    img_cards_Buff_SwiftWind: { type: hz.PropTypes.Asset },
    // ============= FIRE CARDS (8) =============
    img_cards_Fire_Blazefinch: { type: hz.PropTypes.Asset },
    img_cards_Fire_Charcoil: { type: hz.PropTypes.Asset },
    img_cards_Fire_CinderPup: { type: hz.PropTypes.Asset },
    img_cards_Fire_FireMission: { type: hz.PropTypes.Asset },
    img_cards_Fire_HabitatCard: { type: hz.PropTypes.Asset },
    img_cards_Fire_HabitatCardPlayboard: { type: hz.PropTypes.Asset },
    img_cards_Fire_Magmite: { type: hz.PropTypes.Asset },
    img_cards_Fire_VolcanicScar: { type: hz.PropTypes.Asset },
    // ============= FOREST CARDS (8) =============
    img_cards_Forest_AncientForest: { type: hz.PropTypes.Asset },
    img_cards_Forest_ForestMission: { type: hz.PropTypes.Asset },
    img_cards_Forest_HabitatCard: { type: hz.PropTypes.Asset },
    img_cards_Forest_HabitatCardPlayboard: { type: hz.PropTypes.Asset },
    img_cards_Forest_LeafSprite: { type: hz.PropTypes.Asset },
    img_cards_Forest_Mosslet: { type: hz.PropTypes.Asset },
    img_cards_Forest_Mushroomancer: { type: hz.PropTypes.Asset },
    img_cards_Forest_Rootling: { type: hz.PropTypes.Asset },
    // ============= MAGIC CARDS (10) =============
    img_cards_Magic_AetherSwap: { type: hz.PropTypes.Asset },
    img_cards_Magic_CleansingDownpour: { type: hz.PropTypes.Asset },
    img_cards_Magic_ElementalBurst: { type: hz.PropTypes.Asset },
    img_cards_Magic_LightningStrike: { type: hz.PropTypes.Asset },
    img_cards_Magic_NectarBlock: { type: hz.PropTypes.Asset },
    img_cards_Magic_NectarDrain: { type: hz.PropTypes.Asset },
    img_cards_Magic_NectarSurge: { type: hz.PropTypes.Asset },
    img_cards_Magic_Overgrowth: { type: hz.PropTypes.Asset },
    img_cards_Magic_PowerUp: { type: hz.PropTypes.Asset },
    img_cards_Magic_Purify: { type: hz.PropTypes.Asset },
    // ============= SKY CARDS (8) =============
    img_cards_Sky_AeroMoth: { type: hz.PropTypes.Asset },
    img_cards_Sky_CirrusFloof: { type: hz.PropTypes.Asset },
    img_cards_Sky_ClearZenith: { type: hz.PropTypes.Asset },
    img_cards_Sky_GaleGlider: { type: hz.PropTypes.Asset },
    img_cards_Sky_HabitatCard: { type: hz.PropTypes.Asset },
    img_cards_Sky_HabitatCardPlayboard: { type: hz.PropTypes.Asset },
    img_cards_Sky_SkyMission: { type: hz.PropTypes.Asset },
    img_cards_Sky_StarBloom: { type: hz.PropTypes.Asset },
    // ============= TRAP CARDS (8) =============
    img_cards_Trap_BearTrap: { type: hz.PropTypes.Asset },
    img_cards_Trap_EmergencyBloom: { type: hz.PropTypes.Asset },
    img_cards_Trap_HabitatLock: { type: hz.PropTypes.Asset },
    img_cards_Trap_HabitatShield: { type: hz.PropTypes.Asset },
    img_cards_Trap_MagicSheild: { type: hz.PropTypes.Asset },
    img_cards_Trap_ThornSnare: { type: hz.PropTypes.Asset },
    img_cards_Trap_Vaporize: { type: hz.PropTypes.Asset },
    img_cards_Trap_XPHarvest: { type: hz.PropTypes.Asset },
    // ============= WATER CARDS (8) =============
    img_cards_Water_AquaPebble: { type: hz.PropTypes.Asset },
    img_cards_Water_Bubblefin: { type: hz.PropTypes.Asset },
    img_cards_Water_DeepSeaGrotto: { type: hz.PropTypes.Asset },
    img_cards_Water_DewdropDrake: { type: hz.PropTypes.Asset },
    img_cards_Water_HabitatCard: { type: hz.PropTypes.Asset },
    img_cards_Water_HabitatCardPlayboard: { type: hz.PropTypes.Asset },
    img_cards_Water_KelpCub: { type: hz.PropTypes.Asset },
    img_cards_Water_WaterMission: { type: hz.PropTypes.Asset },
    // ============= CHESTS (8) =============
    img_chests_FireChestClosed: { type: hz.PropTypes.Asset },
    img_chests_FireChestOpened: { type: hz.PropTypes.Asset },
    img_chests_ForestChestClosed: { type: hz.PropTypes.Asset },
    img_chests_ForestChestOpened: { type: hz.PropTypes.Asset },
    img_chests_SkyChestClosed: { type: hz.PropTypes.Asset },
    img_chests_SkyChestOpened: { type: hz.PropTypes.Asset },
    img_chests_WaterChestClosed: { type: hz.PropTypes.Asset },
    img_chests_WaterChestOpened: { type: hz.PropTypes.Asset },
    // ============= ICONS (2) =============
    img_icons_ability: { type: hz.PropTypes.Asset },
    img_icons_attack: { type: hz.PropTypes.Asset },
    // ============= MENU FRAMES (10) =============
    img_menu_Frame1: { type: hz.PropTypes.Asset },
    img_menu_Frame2: { type: hz.PropTypes.Asset },
    img_menu_Frame3: { type: hz.PropTypes.Asset },
    img_menu_Frame4: { type: hz.PropTypes.Asset },
    img_menu_Frame5: { type: hz.PropTypes.Asset },
    img_menu_Frame6: { type: hz.PropTypes.Asset },
    img_menu_Frame7: { type: hz.PropTypes.Asset },
    img_menu_Frame8: { type: hz.PropTypes.Asset },
    img_menu_Frame9: { type: hz.PropTypes.Asset },
    img_menu_Frame10: { type: hz.PropTypes.Asset },
    // ============= AUDIO (10) =============
    audio_BackgroundMusic: { type: hz.PropTypes.Asset },
    audio_BattleMusic: { type: hz.PropTypes.Asset },
    audio_sfx_attack: { type: hz.PropTypes.Asset },
    audio_sfx_lose: { type: hz.PropTypes.Asset },
    audio_sfx_lowHealthSound: { type: hz.PropTypes.Asset },
    audio_sfx_menuButtonSelect: { type: hz.PropTypes.Asset },
    audio_sfx_playCard: { type: hz.PropTypes.Asset },
    audio_sfx_sfx_sounds_button6: { type: hz.PropTypes.Asset },
    audio_sfx_trapCardActivated: { type: hz.PropTypes.Asset },
    audio_sfx_win: { type: hz.PropTypes.Asset },
  };








  // Bindings for dynamic UI
  private currentScreen = new Binding<string>('start-menu');
  private menuOptions = new Binding<string[]>([]);
  private playerLevel = new Binding<number>(1);
  private playerXP = new Binding<number>(0);
  private playerXPForNext = new Binding<number>(100);
  private playerTokens = new Binding<number>(0);
  private playerDiamonds = new Binding<number>(0);
  private playerSerums = new Binding<number>(0);

  // Mission select
  private missions = new Binding<Array<BB.MissionDisplay>>([]);

  // Cards screen
  private cards = new Binding<Array<BB.CardDisplay>>([]);
  private deckSize = new Binding<number>(0);
  private deckCardIds = new Binding<string[]>([]);

  // Battle screen
  private battleState = new Binding<BB.BattleDisplay | null>(null);
  private selectedBeastIndex = new Binding<number | null>(null);
  private turnTimer = new Binding<number>(60);
  private showPlayerHand = new Binding<boolean>(true);
  private handScrollOffset = new Binding<number>(0);

  // Settings screen
  private settingsData = new Binding<any>(null);
  private musicVolume = new Binding<number>(100);
  private musicEnabled = new Binding<number>(1);
  private sfxVolume = new Binding<number>(100);
  private sfxEnabled = new Binding<number>(1);

  // Dialog
  private dialogVisible = new Binding<boolean>(false);
  private dialogTitle = new Binding<string>('');
  private dialogMessage = new Binding<string>('');
  private dialogButtons = new Binding<string[]>([]);

  // Card detail
  private cardDetailVisible = new Binding<boolean>(false);
  private cardDetail = new Binding<BB.CardDetailDisplay | null>(null);

  // Rewards popup
  private rewardsPopupVisible = new Binding<boolean>(false);
  private rewardsData = new Binding<BB.RewardDisplay | null>(null);

  // Callbacks
  buttonClickCallback?: (buttonId: string) => void;
  cardSelectCallback?: (cardId: string) => void;
  missionSelectCallback?: (missionId: string) => void;
  settingsChangeCallback?: (settingId: string, value: any) => void;

  // Game manager
  private gameManager: any = null;

  // Lazy-loaded style constants (accessed after BloomBeasts namespace loads)
  private get COLORS() { return getBloomBeasts()?.COLORS || {}; }
  private get DIMENSIONS() { return getBloomBeasts()?.DIMENSIONS || {}; }
  private get GAPS() { return getBloomBeasts()?.GAPS || {}; }
  private get LAYOUTS() { return getBloomBeasts()?.LAYOUTS || {}; }
  private get BUTTON_STYLES() { return getBloomBeasts()?.BUTTON_STYLES || {}; }
  private get TEXT_STYLES() { return getBloomBeasts()?.TEXT_STYLES || {}; }
  private get CARD_STYLES() { return getBloomBeasts()?.CARD_STYLES || {}; }
  private get DIALOG_STYLES() { return getBloomBeasts()?.DIALOG_STYLES || {}; }
  private get getAffinityColor() { return getBloomBeasts()?.getAffinityColor || ((affinity: string) => '#ffffff'); }

  start() {
    super.start();
    this.initializeGame();
  }

  private async initializeGame() {
    const BloomBeastsImpl = getBloomBeasts();

    if (!BloomBeastsImpl) {
      console.error('═══════════════════════════════════════════════════════════');
      console.error('CRITICAL ERROR: BloomBeasts namespace not found!');
      console.error('Ensure BloomBeasts-GameEngine-Standalone.ts is deployed.');
      console.error('═══════════════════════════════════════════════════════════');
      return;
    }

    // Update panel dimensions from the loaded namespace
    this.panelWidth = BloomBeastsImpl.gameDimensions?.panelWidth || 1280;
    this.panelHeight = BloomBeastsImpl.gameDimensions?.panelHeight || 720;

    // Pass world instance for persistent storage access
    const platform = new HorizonPlatform(this, this.world);
    this.gameManager = new BloomBeastsImpl.GameManager(platform);
    await this.gameManager.initialize();
  }

  initializeUI(): UINode {
    return View({
      style: {
        width: this.LAYOUTS.root?.width || 1280,
        height: this.LAYOUTS.root?.height || 720,
        backgroundColor: this.COLORS.background || '#1a1a2e',
        flexDirection: this.LAYOUTS.root?.flexDirection || 'column',
      },
      children: [
        // Main content area - conditionally render based on current screen
        UINode.if(
          this.currentScreen.derive((s: string) => s === 'start-menu'),
          this.renderStartMenuScreen(),
          UINode.if(
            this.currentScreen.derive((s: string) => s === 'missions'),
            this.renderMissionSelectScreen(),
            UINode.if(
              this.currentScreen.derive((s: string) => s === 'cards'),
              this.renderCardsScreen(),
              UINode.if(
                this.currentScreen.derive((s: string) => s === 'battle'),
                this.renderBattleScreen(),
                this.renderSettingsScreen()
              )
            )
          )
        ),

        // Dialog overlay
        UINode.if(
          this.dialogVisible,
          this.renderDialog()
        ),

        // Card detail overlay
        UINode.if(
          this.cardDetailVisible,
          this.renderCardDetailOverlay()
        ),

        // Rewards popup overlay
        UINode.if(
          this.rewardsPopupVisible,
          this.renderRewardsPopup()
        ),
      ],
    });
  }

  // ============= SCREEN RENDERERS =============

  private renderStartMenuScreen(): UINode {
    return View({
      style: {
        ...this.LAYOUTS.startMenu,
      },
      children: [
        // Title
        Text({
          text: 'BLOOM BEASTS',
          style: {
            ...this.TEXT_STYLES.hero,
            marginBottom: this.DIMENSIONS.spacing.lg,
            fontFamily: 'Bangers',
          },
        }),

        // Player stats
        View({
          style: {
            ...this.LAYOUTS.startMenuStats,
          },
          children: [
            this.renderStatBadge('Level', this.playerLevel.derive((l: number) => l.toString())),
            this.renderStatBadge('Tokens', this.playerTokens.derive((t: number) => t.toString())),
            this.renderStatBadge('Diamonds', this.playerDiamonds.derive((d: number) => d.toString())),
          ],
        }),

        // Menu buttons
        View({
          style: {
            ...this.LAYOUTS.startMenuButtons,
          },
          children: [
            this.renderButton('Missions', 'btn-missions'),
            this.renderButton('Cards', 'btn-cards'),
            this.renderButton('Settings', 'btn-settings'),
          ],
        }),
      ],
    });
  }

  private renderMissionSelectScreen(): UINode {
    return View({
      style: {
        ...this.LAYOUTS.missionSelectContainer,
      },
      children: [
        // Header
        View({
          style: {
            ...this.LAYOUTS.missionSelectHeader,
          },
          children: [
            Text({
              text: 'SELECT MISSION',
              style: {
                ...this.TEXT_STYLES.title,
                fontFamily: 'Bangers',
              },
            }),
            Pressable({
              onClick: (player: Player) => this.handleButtonClick('btn-back'),
              style: {
                ...this.BUTTON_STYLES.danger,
              },
              children: Text({
                text: 'Back',
                style: { color: this.COLORS.textPrimary, fontSize: this.DIMENSIONS.fontSize.md, fontWeight: 'bold' },
              }),
            }),
          ],
        }),

        // Mission list
        ScrollView({
          style: { ...this.LAYOUTS.missionList },
          children: this.missions.derive((missions: BB.MissionDisplay[]) =>
            View({
              style: {
                ...this.LAYOUTS.missionListContent,
              },
              children: missions.map((mission, index) => this.renderMissionCard(mission, index)),
            })
          ),
        }),
      ],
    });
  }

  private renderCardsScreen(): UINode {
    return View({
      style: {
        ...this.LAYOUTS.cardsContainer,
      },
      children: [
        // Header
        View({
          style: {
            ...this.LAYOUTS.cardsHeader,
          },
          children: [
            Text({
              text: 'CARD COLLECTION',
              style: {
                ...this.TEXT_STYLES.title,
                fontFamily: 'Bangers',
              },
            }),
            View({
              style: { ...this.LAYOUTS.cardsHeaderRight },
              children: [
                Text({
                  text: this.deckSize.derive((s: number) => `Deck: ${s}/30`),
                  style: { color: this.COLORS.textPrimary, fontSize: this.DIMENSIONS.fontSize.md },
                }),
                Pressable({
                  onClick: (player: Player) => this.handleButtonClick('btn-back'),
                  style: {
                    ...this.BUTTON_STYLES.danger,
                  },
                  children: Text({
                    text: 'Back',
                    style: { color: this.COLORS.textPrimary, fontSize: this.DIMENSIONS.fontSize.md, fontWeight: 'bold' },
                  }),
                }),
              ],
            }),
          ],
        }),

        // Cards grid
        ScrollView({
          style: { ...this.LAYOUTS.cardsGrid },
          children: this.cards.derive((cards: BB.CardDisplay[]) =>
            View({
              style: {
                ...this.LAYOUTS.cardsGridContent,
              },
              children: cards.map((card, index) => this.renderCardThumbnail(card, index)),
            })
          ),
        }),
      ],
    });
  }

  private renderBattleScreen(): UINode {
    return View({
      style: {
        ...this.LAYOUTS.battleContainer,
        backgroundColor: this.COLORS.backgroundDark,
      },
      children: [
        // Battle UI will go here
        Text({
          text: 'Battle Screen',
          style: {
            fontSize: this.DIMENSIONS.fontSize.xxl,
            color: this.COLORS.textPrimary,
            textAlign: 'center',
            marginTop: this.DIMENSIONS.spacing.xxl,
          },
        }),
      ],
    });
  }

  private renderSettingsScreen(): UINode {
    return View({
      style: {
        ...this.LAYOUTS.settingsContainer,
      },
      children: [
        Text({
          text: 'SETTINGS',
          style: {
            ...this.TEXT_STYLES.title,
            marginBottom: this.DIMENSIONS.spacing.lg,
            fontFamily: 'Bangers',
          },
        }),
        Pressable({
          onClick: (player: Player) => this.handleButtonClick('btn-back'),
          style: {
            ...this.BUTTON_STYLES.danger,
            alignSelf: 'flex-start',
          },
          children: Text({
            text: 'Back',
            style: { color: this.COLORS.textPrimary, fontSize: this.DIMENSIONS.fontSize.md, fontWeight: 'bold' },
          }),
        }),
      ],
    });
  }

  // ============= UI COMPONENTS =============

  private renderButton(label: string, id: string, style?: any): UINode {
    return Pressable({
      onClick: (player: Player) => this.handleButtonClick(id),
      style: {
        ...this.BUTTON_STYLES.primary,
        minWidth: this.DIMENSIONS.button.minWidth,
        alignItems: 'center',
        ...style,
      },
      children: Text({
        text: label,
        style: {
          color: this.COLORS.textPrimary,
          fontSize: this.DIMENSIONS.fontSize.xl,
          fontWeight: 'bold',
        },
      }),
    });
  }

  private renderStatBadge(label: string, value: Binding<string> | any): UINode {
    return View({
      style: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: this.DIMENSIONS.statBadge.padding,
        borderRadius: this.DIMENSIONS.statBadge.borderRadius,
        borderWidth: this.DIMENSIONS.statBadge.borderWidth,
        borderColor: this.COLORS.borderPrimary,
      },
      children: [
        Text({
          text: label,
          style: {
            ...this.TEXT_STYLES.label,
            marginBottom: this.DIMENSIONS.spacing.xs,
          },
        }),
        Text({
          text: value as any,
          style: {
            ...this.TEXT_STYLES.value,
          },
        }),
      ],
    });
  }

  private renderMissionCard(mission: BB.MissionDisplay, index: number): UINode {
    const cardStyle = mission.isCompleted
      ? this.CARD_STYLES.missionCompleted
      : mission.isAvailable
        ? this.CARD_STYLES.mission
        : this.CARD_STYLES.missionDisabled;

    return Pressable({
      onClick: (player: Player) => this.handleMissionSelect(mission.id),
      disabled: new Binding(!mission.isAvailable),
      style: {
        ...cardStyle,
      },
      children: View({
        style: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        children: [
          View({
            style: { flex: 1 },
            children: [
              Text({
                text: mission.name,
                style: {
                  color: this.COLORS.textPrimary,
                  fontSize: this.DIMENSIONS.fontSize.lg,
                  fontWeight: 'bold',
                  marginBottom: this.DIMENSIONS.spacing.xs,
                },
              }),
              Text({
                text: `Level ${mission.level} • ${mission.difficulty}`,
                style: {
                  ...this.TEXT_STYLES.bodySecondary,
                },
              }),
            ],
          }),
          mission.isCompleted
            ? Text({
                text: '✓',
                style: {
                  color: this.COLORS.success,
                  fontSize: this.DIMENSIONS.fontSize.xl,
                  fontWeight: 'bold',
                },
              })
            : Text({ text: '' }),
        ],
      }),
    });
  }

  private renderCardThumbnail(card: BB.CardDisplay, index: number): UINode {
    return Pressable({
      onClick: (player: Player) => this.handleCardSelect(card.id),
      style: {
        ...this.CARD_STYLES.base,
        borderColor: this.getAffinityColor(card.affinity),
      },
      children: View({
        style: {
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
        },
        children: [
          Text({
            text: card.name,
            numberOfLines: 2,
            style: {
              color: this.COLORS.textPrimary,
              fontSize: this.DIMENSIONS.fontSize.sm,
              fontWeight: 'bold',
              textAlign: 'center',
            },
          }),
          View({
            style: {
              flexDirection: 'row',
              justifyContent: 'space-around',
            },
            children: [
              card.baseAttack !== undefined
                ? Text({
                    text: `⚔️ ${card.baseAttack}`,
                    style: { color: this.COLORS.textPrimary, fontSize: this.DIMENSIONS.fontSize.sm },
                  })
                : Text({ text: '' }),
              card.baseHealth !== undefined
                ? Text({
                    text: `❤️ ${card.baseHealth}`,
                    style: { color: this.COLORS.textPrimary, fontSize: this.DIMENSIONS.fontSize.sm },
                  })
                : Text({ text: '' }),
            ],
          }),
        ],
      }),
    });
  }

  private renderDialog(): UINode {
    return View({
      style: {
        ...this.LAYOUTS.dialogOverlay,
        ...this.DIALOG_STYLES.overlay,
      },
      children: View({
        style: {
          ...this.LAYOUTS.dialogContent,
          ...this.DIALOG_STYLES.content,
        },
        children: [
          Text({
            text: this.dialogTitle,
            style: {
              ...this.DIALOG_STYLES.title,
              marginBottom: this.DIMENSIONS.spacing.lg,
            },
          }),
          Text({
            text: this.dialogMessage,
            style: {
              ...this.DIALOG_STYLES.message,
              marginBottom: this.DIMENSIONS.spacing.xl,
            },
          }),
          this.dialogButtons.derive((buttons: string[]) =>
            View({
              style: {
                ...this.LAYOUTS.dialogButtons,
              },
              children: buttons.map((btn: string) =>
                this.renderButton(btn, `dialog-${btn}`, { minWidth: this.DIMENSIONS.buttonSmall.minWidth })
              ),
            })
          ),
        ],
      }),
    });
  }

  private renderCardDetailOverlay(): UINode {
    return View({
      style: {
        ...this.LAYOUTS.cardDetailOverlay,
        backgroundColor: this.COLORS.overlayBackgroundDark,
      },
      children: View({
        style: {
          ...this.LAYOUTS.dialogContent,
          ...this.DIALOG_STYLES.content,
        },
        children: [
          Text({
            text: 'Card Detail',
            style: {
              ...this.DIALOG_STYLES.title,
              marginBottom: this.DIMENSIONS.spacing.lg,
            },
          }),
          this.renderButton('Close', 'btn-card-close'),
        ],
      }),
    });
  }

  private renderRewardsPopup(): UINode {
    return View({
      style: {
        ...this.LAYOUTS.dialogOverlay,
        ...this.DIALOG_STYLES.overlay,
      },
      children: View({
        style: {
          ...this.LAYOUTS.dialogContent,
          ...this.DIALOG_STYLES.content,
        },
        children: [
          Text({
            text: 'Mission Complete!',
            style: {
              ...this.DIALOG_STYLES.title,
              marginBottom: this.DIMENSIONS.spacing.lg,
            },
          }),
          Text({
            text: this.rewardsData.derive((r: BB.RewardDisplay | null) => r ? r.message : '') as any,
            style: {
              ...this.DIALOG_STYLES.message,
              marginBottom: this.DIMENSIONS.spacing.xl,
            },
          }),
          this.renderButton('Claim Rewards', 'btn-claim-rewards', { marginTop: this.DIMENSIONS.spacing.lg }),
        ],
      }),
    });
  }

  // ============= HELPER METHODS =============

  private handleButtonClick(buttonId: string) {
    if (buttonId.startsWith('dialog-')) {
      this.dialogVisible.set(false);
    }
    if (buttonId === 'btn-claim-rewards') {
      this.rewardsPopupVisible.set(false);
    }
    if (buttonId === 'btn-card-close') {
      this.cardDetailVisible.set(false);
    }
    this.buttonClickCallback?.(buttonId);
  }

  private handleCardSelect(cardId: string) {
    this.cardSelectCallback?.(cardId);
  }

  private handleMissionSelect(missionId: string) {
    this.missionSelectCallback?.(missionId);
  }

  // ============= PUBLIC API FOR PLATFORM =============

  showStartMenu(options: string[], stats: BB.MenuStats) {
    this.currentScreen.set('start-menu');
    this.menuOptions.set(options);
    this.playerLevel.set(stats.playerLevel);
    this.playerXP.set(stats.totalXP);

    // Calculate XP for next level
    const xpThresholds = [0, 100, 300, 700, 1500, 3100, 6300, 12700, 25500];
    const xpForCurrentLevel = xpThresholds[stats.playerLevel - 1];
    const xpForNextLevel = stats.playerLevel < 9 ? xpThresholds[stats.playerLevel] : xpThresholds[8];
    this.playerXPForNext.set(xpForNextLevel - xpForCurrentLevel);

    this.playerTokens.set(stats.tokens);
    this.playerDiamonds.set(stats.diamonds);
    this.playerSerums.set(stats.serums);
  }

  showMissionSelect(missions: BB.MissionDisplay[], stats: BB.MenuStats) {
    this.currentScreen.set('missions');
    this.missions.set(missions);
    this.playerLevel.set(stats.playerLevel);
    this.playerXP.set(stats.totalXP);

    // Calculate XP for next level
    const xpThresholds = [0, 100, 300, 700, 1500, 3100, 6300, 12700, 25500];
    const xpForCurrentLevel = xpThresholds[stats.playerLevel - 1];
    const xpForNextLevel = stats.playerLevel < 9 ? xpThresholds[stats.playerLevel] : xpThresholds[8];
    this.playerXPForNext.set(xpForNextLevel - xpForCurrentLevel);
  }

  showCards(cards: BB.CardDisplay[], deckSize: number, deckCardIds: string[], stats: BB.MenuStats) {
    this.currentScreen.set('cards');
    this.cards.set(cards);
    this.deckSize.set(deckSize);
    this.deckCardIds.set(deckCardIds);
    this.playerLevel.set(stats.playerLevel);
    this.playerXP.set(stats.totalXP);

    // Calculate XP for next level
    const xpThresholds = [0, 100, 300, 700, 1500, 3100, 6300, 12700, 25500];
    const xpForCurrentLevel = xpThresholds[stats.playerLevel - 1];
    const xpForNextLevel = stats.playerLevel < 9 ? xpThresholds[stats.playerLevel] : xpThresholds[8];
    this.playerXPForNext.set(xpForNextLevel - xpForCurrentLevel);
  }

  showBattle(battleState: BB.BattleDisplay) {
    this.currentScreen.set('battle');
    this.battleState.set(battleState);
    this.selectedBeastIndex.set(null);
    this.turnTimer.set(60);
    this.showPlayerHand.set(true);
    this.handScrollOffset.set(0);
  }

  showSettings(settings: any, stats: BB.MenuStats) {
    this.currentScreen.set('settings');
    this.settingsData.set(settings);
    this.musicVolume.set(settings.musicVolume || 100);
    this.musicEnabled.set(settings.musicEnabled ? 1 : 0);
    this.sfxVolume.set(settings.sfxVolume || 100);
    this.sfxEnabled.set(settings.sfxEnabled ? 1 : 0);
    this.playerLevel.set(stats.playerLevel);
    this.playerXP.set(stats.totalXP);

    // Calculate XP for next level
    const xpThresholds = [0, 100, 300, 700, 1500, 3100, 6300, 12700, 25500];
    const xpForCurrentLevel = xpThresholds[stats.playerLevel - 1];
    const xpForNextLevel = stats.playerLevel < 9 ? xpThresholds[stats.playerLevel] : xpThresholds[8];
    this.playerXPForNext.set(xpForNextLevel - xpForCurrentLevel);
  }

  showCardDetail(cardDetail: BB.CardDetailDisplay, stats: BB.MenuStats) {
    this.cardDetail.set(cardDetail);
    this.cardDetailVisible.set(true);
  }

  showDialog(title: string, message: string, buttons: string[]) {
    this.dialogTitle.set(title);
    this.dialogMessage.set(message);
    this.dialogButtons.set(buttons);
    this.dialogVisible.set(true);
  }

  showRewardsPopup(rewards: BB.RewardDisplay) {
    this.rewardsData.set(rewards);
    this.rewardsPopupVisible.set(true);
  }

  // ============= ASSET ACCESSORS =============

  /**
   * Get card image by card ID
   * Maps card IDs to their corresponding image Props
   */
  getCardImage(cardId: string): any {
    // Normalize cardId to match Prop naming (e.g., "CinderPup" -> "img_cards_Fire_CinderPup")
    const propName = `img_${cardId.replace(/\//g, '_')}` as keyof this;

    // Direct access to Prop if it matches exactly
    if (this[propName]) {
      return this[propName];
    }

    // Try common patterns for card IDs
    const patterns = [
      `img_cards_${cardId}`,
      `img_cards_Fire_${cardId}`,
      `img_cards_Water_${cardId}`,
      `img_cards_Forest_${cardId}`,
      `img_cards_Sky_${cardId}`,
      `img_cards_Magic_${cardId}`,
      `img_cards_Trap_${cardId}`,
      `img_cards_Buff_${cardId}`,
    ];

    for (const pattern of patterns) {
      const key = pattern as keyof this;
      if (this[key]) {
        return this[key];
      }
    }

    // Fallback to base card template
    return (this as any).img_cards_BaseCard || null;
  }

  /**
   * Get background image by background ID
   */
  getBackground(backgroundId: string): any {
    const bgMap: { [key: string]: any } = {
      'main': (this as any).img_Background,
      'background': (this as any).img_Background,
      'menu': (this as any).img_Menu,
      'playboard': (this as any).img_Playboard,
      'battle': (this as any).img_Playboard,
      'cardsContainer': (this as any).img_CardsContainer,
      'cards': (this as any).img_CardsContainer,
      'missionContainer': (this as any).img_MissionContainer,
      'missions': (this as any).img_MissionContainer,
    };

    return bgMap[backgroundId] || (this as any).img_Background;
  }

  /**
   * Get audio source by audio ID
   * Maps audio IDs to their corresponding audio Props
   */
  getAudio(audioId: string): any {
    // Strip file extension if present (e.g., "BackgroundMusic.mp3" -> "BackgroundMusic")
    const withoutExtension = audioId.replace(/\.(mp3|wav|ogg)$/i, '');

    // Normalize audio ID
    const normalized = withoutExtension.toLowerCase().replace(/[^a-z0-9_]/g, '_');

    // Direct mapping for common audio IDs
    const audioMap: { [key: string]: any } = {
      'backgroundmusic': (this as any).audio_BackgroundMusic,
      'background_music': (this as any).audio_BackgroundMusic,
      'menu_music': (this as any).audio_BackgroundMusic,
      'battlemusic': (this as any).audio_BattleMusic,
      'battle_music': (this as any).audio_BattleMusic,
      'combat_music': (this as any).audio_BattleMusic,
      'attack': (this as any).audio_sfx_attack,
      'sfx_attack': (this as any).audio_sfx_attack,
      'lose': (this as any).audio_sfx_lose,
      'sfx_lose': (this as any).audio_sfx_lose,
      'lowhealth': (this as any).audio_sfx_lowHealthSound,
      'low_health': (this as any).audio_sfx_lowHealthSound,
      'sfx_lowhealthsound': (this as any).audio_sfx_lowHealthSound,
      'button': (this as any).audio_sfx_menuButtonSelect,
      'menu_button': (this as any).audio_sfx_menuButtonSelect,
      'sfx_menubuttonselect': (this as any).audio_sfx_menuButtonSelect,
      'playcard': (this as any).audio_sfx_playCard,
      'play_card': (this as any).audio_sfx_playCard,
      'sfx_playcard': (this as any).audio_sfx_playCard,
      'button6': (this as any).audio_sfx_sfx_sounds_button6,
      'trap': (this as any).audio_sfx_trapCardActivated,
      'trap_activated': (this as any).audio_sfx_trapCardActivated,
      'sfx_trapcardactivated': (this as any).audio_sfx_trapCardActivated,
      'win': (this as any).audio_sfx_win,
      'sfx_win': (this as any).audio_sfx_win,
      'victory': (this as any).audio_sfx_win,
    };

    // Try direct match first
    if (audioMap[normalized]) {
      return audioMap[normalized];
    }

    // Try pattern matching for audio_ prefixed Props
    const propName = `audio_${audioId}` as keyof this;
    if (this[propName]) {
      return this[propName];
    }

    // No match found
    console.warn(`Audio not found: ${audioId}`);
    return null;
  }
}

hz.Component.register(BloomBeastsUI);
