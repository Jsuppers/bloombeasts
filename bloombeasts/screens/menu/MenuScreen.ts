/**
 * Menu Screen
 */

import { COLORS } from '../../common/ui/styles/styles/colors';
import { DIMENSIONS, GAPS, sideMenuButtonDimensions } from '../../common/ui/styles/styles/dimensions';
import { UINodeType } from '../../common/ui/ScreenUtils';
import { createSideMenu } from '../../common/ui/screens/SideMenu';
import { createButton } from '../../common/ui/components/common/Button';
import { BaseScreen, BaseScreenProps } from '../common/BaseScreen';
import type { PlayerData, PlayerItem } from '../../BloomBeastsGame';
import { getPlayerLevel, XP_THRESHOLDS, GAME_CONSTANTS } from '../../core/GameConstants';

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
                color: COLORS.textPrimary,
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
                color: COLORS.textPrimary,
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
