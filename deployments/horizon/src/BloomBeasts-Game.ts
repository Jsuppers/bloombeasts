/// <reference path="./BloomBeasts-GameEngine-Standalone.ts" />

import * as hz from 'horizon/core';
import type { Player } from 'horizon/core';
import { UIComponent, View, Text, Pressable, ScrollView, ImageSource, Image, Binding, UINode } from 'horizon/ui';

// Import shared styles from the BloomBeasts namespace
const COLORS = BloomBeasts.COLORS;
const DIMENSIONS = BloomBeasts.DIMENSIONS;
const GAPS = BloomBeasts.GAPS;
const LAYOUTS = BloomBeasts.LAYOUTS;
const BUTTON_STYLES = BloomBeasts.BUTTON_STYLES;
const TEXT_STYLES = BloomBeasts.TEXT_STYLES;
const CARD_STYLES = BloomBeasts.CARD_STYLES;
const DIALOG_STYLES = BloomBeasts.DIALOG_STYLES;
const getAffinityColor = BloomBeasts.getAffinityColor;

/**
 * HorizonPlatform - Implementation of PlatformCallbacks for Meta Horizon Worlds
 * Bridges the BloomBeasts game engine with Horizon's Custom UI
 */
class HorizonPlatform implements BloomBeasts.PlatformCallbacks {
  private ui: BloomBeastsUI;

  constructor(ui: BloomBeastsUI) {
    this.ui = ui;
  }

  // UI Rendering
  renderStartMenu(options: string[], stats: BloomBeasts.MenuStats): void {
    this.ui.showStartMenu(options, stats);
  }

  renderMissionSelect(missions: BloomBeasts.MissionDisplay[], stats: BloomBeasts.MenuStats): void {
    this.ui.showMissionSelect(missions, stats);
  }

  renderCards(cards: BloomBeasts.CardDisplay[], deckSize: number, deckCardIds: string[], stats: BloomBeasts.MenuStats): void {
    this.ui.showCards(cards, deckSize, deckCardIds, stats);
  }

  renderBattle(battleState: BloomBeasts.BattleDisplay): void {
    this.ui.showBattle(battleState);
  }

  renderSettings(settings: any, stats: BloomBeasts.MenuStats): void {
    this.ui.showSettings(settings, stats);
  }

  renderCardDetail(cardDetail: BloomBeasts.CardDetailDisplay, stats: BloomBeasts.MenuStats): void {
    this.ui.showCardDetail(cardDetail, stats);
  }

  // Input handling
  onButtonClick(callback: (buttonId: string) => void): void {
    this.ui.buttonClickCallback = callback;
  }

  onCardSelect(callback: (cardId: string) => void): void {
    this.ui.cardSelectCallback = callback;
  }

  onMissionSelect(callback: (missionId: string) => void): void {
    this.ui.missionSelectCallback = callback;
  }

  onSettingsChange(callback: (settingId: string, value: any) => void): void {
    this.ui.settingsChangeCallback = callback;
  }

  // Asset loading (stub implementations for Horizon)
  async loadCardImage(cardId: string): Promise<any> {
    return null;
  }

  async loadBackground(backgroundId: string): Promise<any> {
    return null;
  }

  playSound(soundId: string): void {
    // Sound implementation
  }

  // Audio control
  playMusic(src: string, loop: boolean, volume: number): void {}
  stopMusic(): void {}
  playSfx(src: string, volume: number): void {}
  setMusicVolume(volume: number): void {}
  setSfxVolume(volume: number): void {}

  // Storage
  async saveData(key: string, data: any): Promise<void> {
    // Use Horizon's data storage if available
  }

  async loadData(key: string): Promise<any> {
    return null;
  }

  // Dialogs
  async showDialog(title: string, message: string, buttons?: string[]): Promise<string> {
    this.ui.showDialog(title, message, buttons || ['OK']);
    return 'OK';
  }

  async showRewards(rewards: BloomBeasts.RewardDisplay): Promise<void> {
    this.ui.showRewardsPopup(rewards);
  }
}

/**
 * BloomBeastsUI - Custom UI Component for the game
 */
class BloomBeastsUI extends UIComponent {
  // Panel size from shared constants
  protected readonly panelWidth = DIMENSIONS.panel.width;
  protected readonly panelHeight = DIMENSIONS.panel.height;

  // Bindings for dynamic UI
  private currentScreen = new Binding<string>('start-menu');
  private menuOptions = new Binding<string[]>([]);
  private playerLevel = new Binding<number>(1);
  private playerXP = new Binding<number>(0);
  private playerTokens = new Binding<number>(0);
  private playerDiamonds = new Binding<number>(0);
  private playerSerums = new Binding<number>(0);

  // Mission select
  private missions = new Binding<Array<BloomBeasts.MissionDisplay>>([]);

  // Cards screen
  private cards = new Binding<Array<BloomBeasts.CardDisplay>>([]);
  private deckSize = new Binding<number>(0);

  // Battle screen
  private battleState = new Binding<BloomBeasts.BattleDisplay | null>(null);

  // Dialog
  private dialogVisible = new Binding<boolean>(false);
  private dialogTitle = new Binding<string>('');
  private dialogMessage = new Binding<string>('');
  private dialogButtons = new Binding<string[]>([]);

  // Card detail
  private cardDetailVisible = new Binding<boolean>(false);
  private cardDetail = new Binding<BloomBeasts.CardDetailDisplay | null>(null);

  // Callbacks
  buttonClickCallback?: (buttonId: string) => void;
  cardSelectCallback?: (cardId: string) => void;
  missionSelectCallback?: (missionId: string) => void;
  settingsChangeCallback?: (settingId: string, value: any) => void;

  // Game manager
  private gameManager: BloomBeasts.GameManager | null = null;

  start() {
    super.start();
    this.initializeGame();
  }

  private async initializeGame() {
    const platform = new HorizonPlatform(this);
    this.gameManager = new BloomBeasts.GameManager(platform);
    await this.gameManager.initialize();
  }

  initializeUI(): UINode {
    return View({
      style: {
        width: LAYOUTS.root.width,
        height: LAYOUTS.root.height,
        backgroundColor: COLORS.background,
        flexDirection: LAYOUTS.root.flexDirection,
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
      ],
    });
  }

  // ============= SCREEN RENDERERS =============

  private renderStartMenuScreen(): UINode {
    return View({
      style: {
        ...LAYOUTS.startMenu,
      },
      children: [
        // Title
        Text({
          text: 'BLOOM BEASTS',
          style: {
            ...TEXT_STYLES.hero,
            marginBottom: DIMENSIONS.spacing.lg,
            fontFamily: 'Bangers',
          },
        }),

        // Player stats
        View({
          style: {
            ...LAYOUTS.startMenuStats,
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
            ...LAYOUTS.startMenuButtons,
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
        ...LAYOUTS.missionSelectContainer,
      },
      children: [
        // Header
        View({
          style: {
            ...LAYOUTS.missionSelectHeader,
          },
          children: [
            Text({
              text: 'SELECT MISSION',
              style: {
                ...TEXT_STYLES.title,
                fontFamily: 'Bangers',
              },
            }),
            Pressable({
              onClick: (player: Player) => this.handleButtonClick('btn-back'),
              style: {
                ...BUTTON_STYLES.danger,
              },
              children: Text({
                text: 'Back',
                style: { color: COLORS.textPrimary, fontSize: DIMENSIONS.fontSize.md, fontWeight: 'bold' },
              }),
            }),
          ],
        }),

        // Mission list
        ScrollView({
          style: { ...LAYOUTS.missionList },
          children: View({
            style: {
              ...LAYOUTS.missionListContent,
            },
            children: this.missions.derive((missions: BloomBeasts.MissionDisplay[]) =>
              missions.map((mission, index) => this.renderMissionCard(mission, index))
            ),
          }),
        }),
      ],
    });
  }

  private renderCardsScreen(): UINode {
    return View({
      style: {
        ...LAYOUTS.cardsContainer,
      },
      children: [
        // Header
        View({
          style: {
            ...LAYOUTS.cardsHeader,
          },
          children: [
            Text({
              text: 'CARD COLLECTION',
              style: {
                ...TEXT_STYLES.title,
                fontFamily: 'Bangers',
              },
            }),
            View({
              style: { ...LAYOUTS.cardsHeaderRight },
              children: [
                Text({
                  text: this.deckSize.derive((s: number) => `Deck: ${s}/30`),
                  style: { color: COLORS.textPrimary, fontSize: DIMENSIONS.fontSize.md },
                }),
                Pressable({
                  onClick: (player: Player) => this.handleButtonClick('btn-back'),
                  style: {
                    ...BUTTON_STYLES.danger,
                  },
                  children: Text({
                    text: 'Back',
                    style: { color: COLORS.textPrimary, fontSize: DIMENSIONS.fontSize.md, fontWeight: 'bold' },
                  }),
                }),
              ],
            }),
          ],
        }),

        // Cards grid
        ScrollView({
          style: { ...LAYOUTS.cardsGrid },
          children: View({
            style: {
              ...LAYOUTS.cardsGridContent,
            },
            children: this.cards.derive((cards: BloomBeasts.CardDisplay[]) =>
              cards.map((card, index) => this.renderCardThumbnail(card, index))
            ),
          }),
        }),
      ],
    });
  }

  private renderBattleScreen(): UINode {
    return View({
      style: {
        ...LAYOUTS.battleContainer,
        backgroundColor: COLORS.backgroundDark,
      },
      children: [
        // Battle UI will go here
        Text({
          text: 'Battle Screen',
          style: {
            fontSize: DIMENSIONS.fontSize.xxl,
            color: COLORS.textPrimary,
            textAlign: 'center',
            marginTop: DIMENSIONS.spacing.xxl,
          },
        }),
      ],
    });
  }

  private renderSettingsScreen(): UINode {
    return View({
      style: {
        ...LAYOUTS.settingsContainer,
      },
      children: [
        Text({
          text: 'SETTINGS',
          style: {
            ...TEXT_STYLES.title,
            marginBottom: DIMENSIONS.spacing.lg,
            fontFamily: 'Bangers',
          },
        }),
        Pressable({
          onClick: (player: Player) => this.handleButtonClick('btn-back'),
          style: {
            ...BUTTON_STYLES.danger,
            alignSelf: 'flex-start',
          },
          children: Text({
            text: 'Back',
            style: { color: COLORS.textPrimary, fontSize: DIMENSIONS.fontSize.md, fontWeight: 'bold' },
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
        ...BUTTON_STYLES.primary,
        minWidth: DIMENSIONS.button.minWidth,
        alignItems: 'center',
        ...style,
      },
      children: Text({
        text: label,
        style: {
          color: COLORS.textPrimary,
          fontSize: DIMENSIONS.fontSize.xl,
          fontWeight: 'bold',
        },
      }),
    });
  }

  private renderStatBadge(label: string, value: Binding<string> | any): UINode {
    return View({
      style: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: DIMENSIONS.statBadge.padding,
        borderRadius: DIMENSIONS.statBadge.borderRadius,
        borderWidth: DIMENSIONS.statBadge.borderWidth,
        borderColor: COLORS.borderPrimary,
      },
      children: [
        Text({
          text: label,
          style: {
            ...TEXT_STYLES.label,
            marginBottom: DIMENSIONS.spacing.xs,
          },
        }),
        Text({
          text: value as any,
          style: {
            ...TEXT_STYLES.value,
          },
        }),
      ],
    });
  }

  private renderMissionCard(mission: BloomBeasts.MissionDisplay, index: number): UINode {
    const cardStyle = mission.isCompleted
      ? CARD_STYLES.missionCompleted
      : mission.isAvailable
        ? CARD_STYLES.mission
        : CARD_STYLES.missionDisabled;

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
                  color: COLORS.textPrimary,
                  fontSize: DIMENSIONS.fontSize.lg,
                  fontWeight: 'bold',
                  marginBottom: DIMENSIONS.spacing.xs,
                },
              }),
              Text({
                text: `Level ${mission.level} • ${mission.difficulty}`,
                style: {
                  ...TEXT_STYLES.bodySecondary,
                },
              }),
            ],
          }),
          mission.isCompleted
            ? Text({
                text: '✓',
                style: {
                  color: COLORS.success,
                  fontSize: DIMENSIONS.fontSize.xl,
                  fontWeight: 'bold',
                },
              })
            : Text({ text: '' }),
        ],
      }),
    });
  }

  private renderCardThumbnail(card: BloomBeasts.CardDisplay, index: number): UINode {
    return Pressable({
      onClick: (player: Player) => this.handleCardSelect(card.id),
      style: {
        ...CARD_STYLES.base,
        borderColor: getAffinityColor(card.affinity),
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
              color: COLORS.textPrimary,
              fontSize: DIMENSIONS.fontSize.sm,
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
                    style: { color: COLORS.textPrimary, fontSize: DIMENSIONS.fontSize.sm },
                  })
                : Text({ text: '' }),
              card.baseHealth !== undefined
                ? Text({
                    text: `❤️ ${card.baseHealth}`,
                    style: { color: COLORS.textPrimary, fontSize: DIMENSIONS.fontSize.sm },
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
        ...LAYOUTS.dialogOverlay,
        ...DIALOG_STYLES.overlay,
      },
      children: View({
        style: {
          ...LAYOUTS.dialogContent,
          ...DIALOG_STYLES.content,
        },
        children: [
          Text({
            text: this.dialogTitle,
            style: {
              ...DIALOG_STYLES.title,
              marginBottom: DIMENSIONS.spacing.lg,
            },
          }),
          Text({
            text: this.dialogMessage,
            style: {
              ...DIALOG_STYLES.message,
              marginBottom: DIMENSIONS.spacing.xl,
            },
          }),
          View({
            style: {
              ...LAYOUTS.dialogButtons,
            },
            children: this.dialogButtons.derive((buttons: string[]) =>
              buttons.map((btn: string) =>
                this.renderButton(btn, `dialog-${btn}`, { minWidth: DIMENSIONS.buttonSmall.minWidth })
              )
            ),
          }),
        ],
      }),
    });
  }

  private renderCardDetailOverlay(): UINode {
    return View({
      style: {
        ...LAYOUTS.cardDetailOverlay,
        backgroundColor: COLORS.overlayBackgroundDark,
      },
      children: Text({
        text: 'Card Detail',
        style: { color: COLORS.textPrimary, fontSize: DIMENSIONS.fontSize.xl },
      }),
    });
  }

  // ============= HELPER METHODS =============

  private handleButtonClick(buttonId: string) {
    if (buttonId.startsWith('dialog-')) {
      this.dialogVisible.set(false);
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

  showStartMenu(options: string[], stats: BloomBeasts.MenuStats) {
    this.currentScreen.set('start-menu');
    this.menuOptions.set(options);
    this.playerLevel.set(stats.playerLevel);
    this.playerXP.set(stats.totalXP);
    this.playerTokens.set(stats.tokens);
    this.playerDiamonds.set(stats.diamonds);
    this.playerSerums.set(stats.serums);
  }

  showMissionSelect(missions: BloomBeasts.MissionDisplay[], stats: BloomBeasts.MenuStats) {
    this.currentScreen.set('missions');
    this.missions.set(missions);
    this.playerLevel.set(stats.playerLevel);
  }

  showCards(cards: BloomBeasts.CardDisplay[], deckSize: number, deckCardIds: string[], stats: BloomBeasts.MenuStats) {
    this.currentScreen.set('cards');
    this.cards.set(cards);
    this.deckSize.set(deckSize);
  }

  showBattle(battleState: BloomBeasts.BattleDisplay) {
    this.currentScreen.set('battle');
    this.battleState.set(battleState);
  }

  showSettings(settings: any, stats: BloomBeasts.MenuStats) {
    this.currentScreen.set('settings');
  }

  showCardDetail(cardDetail: BloomBeasts.CardDetailDisplay, stats: BloomBeasts.MenuStats) {
    this.cardDetail.set(cardDetail);
    this.cardDetailVisible.set(true);
  }

  showDialog(title: string, message: string, buttons: string[]) {
    this.dialogTitle.set(title);
    this.dialogMessage.set(message);
    this.dialogButtons.set(buttons);
    this.dialogVisible.set(true);
  }

  showRewardsPopup(rewards: BloomBeasts.RewardDisplay) {
    this.showDialog('Mission Complete!', rewards.message, ['Claim Rewards']);
  }
}

hz.Component.register(BloomBeastsUI);
