/**
 * Unified Menu Screen Component
 * Works on both Horizon and Web platforms
 * Matches the styling from menuScreen.new.ts
 */

import { COLORS } from '../styles/colors';
import { DIMENSIONS, GAPS } from '../styles/dimensions';
import { sideMenuButtonDimensions } from '../constants/dimensions';
import type { UIMethodMappings } from '../../../bloombeasts/BloomBeastsGame';
import { UINodeType } from './ScreenUtils';
import { createSideMenu } from './common/SideMenu';
import { BindingType } from '../types/BindingManager';
import { createButton } from '../common/Button';

export interface MenuScreenProps {
  ui: UIMethodMappings;
  onButtonClick?: (buttonId: string) => void;
  onNavigate?: (screen: string) => void;
  onRenderNeeded?: () => void;
  playSfx?: (sfxId: string) => void;
}

/**
 * Unified Menu Screen that works on both platforms
 */
export class MenuScreen {
  // UI methods (injected)
  private ui: UIMethodMappings;


  // Menu frame IDs
  private menuFrameIds: string[] = [
    'menu-frame-1', 'menu-frame-2', 'menu-frame-3', 'menu-frame-4', 'menu-frame-5',
    'menu-frame-6', 'menu-frame-7', 'menu-frame-8', 'menu-frame-9', 'menu-frame-10',
  ];

  private quotes: string[] = [
    'Welcome back, Trainer!',
  ];

  // Callbacks
  private onButtonClick?: (buttonId: string) => void;
  private onNavigate?: (screen: string) => void;
  private onRenderNeeded?: () => void;
  private playSfx?: (sfxId: string) => void;

  constructor(props: MenuScreenProps) {
    this.ui = props.ui;
    this.onButtonClick = props.onButtonClick;
    this.onNavigate = props.onNavigate;
    this.onRenderNeeded = props.onRenderNeeded;
    this.playSfx = props.playSfx;

  }

  /**
   * Create the unified menu UI - uses common side menu
   */
  createUI(): UINodeType {
    const menuOptions = ['cards', 'upgrades', 'leaderboard', 'settings'];  // Removed 'missions'
    const lineHeight = DIMENSIONS.fontSize.lg + 5;

    // Create menu buttons for the side menu
    const menuButtons = menuOptions.map((option, index) => ({
      label: this.getMenuLabel(option),
      onClick: () => {
        if (this.onButtonClick) {
          this.onButtonClick(`btn-${option}`);
        }
        if (this.onNavigate) {
          this.onNavigate(option);
        }
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
          // Quote text (lines 0-2)
          this.ui.View({
            style: {
              position: 'absolute',
              top: 0,
              width: 150,
            },
            children: this.ui.Text({
              text: this.quotes[0], // TODO: listen on intervaled binding to change the quote
              numberOfLines: 2,
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

    return this.ui.View({
      style: {
        width: '100%',
        height: '100%',
        position: 'relative',
      },
      children: [
        // Background image (full screen)
        this.ui.Image({
          source: this.ui.assetIdToImageSource?.('background') || null,
          style: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
          },
        }),

        // Main content area with animated character
        this.ui.View({
          style: {
            position: 'absolute',
            width: '100%',
            height: '100%',
          },
          children: [
            // Animated character frame - derive directly from UIState
            this.ui.Image({
                source: this.ui.assetIdToImageSource?.(this.menuFrameIds[0]) || null,
                // source: this.ui.bindingManager.derive([BindingType.IntervaledBinding], (counter: number) => {
                //   const frameId = this.menuFrameIds[counter % this.menuFrameIds.length];
                //   return this.ui.assetIdToImageSource?.(frameId) || null;
                // }),
                style: {
                  position: 'absolute',
                  left: 290,
                  top: 40,
                  width: 675,
                  height: 630,
                },
              }),
          ],
        }),

        // Player stats container at top middle
        this.createPlayerStatsContainer(),

        // "Play" button in the middle of the page, slightly down
        createButton({
          ui: this.ui,
          label: 'Play',
          onClick: () => {
            if (this.onButtonClick) {
              this.onButtonClick('btn-missions');
            }
            if (this.onNavigate) {
              this.onNavigate('missions');
            }
          },
          imageSource: this.ui.assetIdToImageSource?.('yellow-button') || null,
          playSfx: this.playSfx,
          style: {
            fontSize: 32,
            fontWeight: 'bold',
            textAlign: 'center',
            // paddingTop: 4,
            position: 'absolute',
            left: 552,  // Centered horizontally (1280/2 - 175/2 ≈ 552)
            top: 400,   // Slightly down from center
          },
        }),

        // Side menu (positioned absolutely on top)
        createSideMenu(this.ui, {
          customTextContent,
          buttons: menuButtons,
          bottomButton: {
            label: 'Close',
            onClick: () => {}, // Disabled button
            disabled: true,
          },
          onXPBarClick: (title: string, message: string) => {
            if (this.onButtonClick) {
              this.onButtonClick(`show-counter-info:${title}:${message}`);
            }
          },
          playSfx: this.playSfx,
        }),
      ],
    });
  }

  /**
   * Get menu label for option
   */
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

  /**
   * Create player stats container at top middle
   */
  private createPlayerStatsContainer(): UINodeType {
    const containerWidth = 487;
    const containerHeight = 82;
    const screenWidth = 1280;
    const containerX = (screenWidth - containerWidth) / 2;
    const containerY = 20;

    // Icon dimensions
    const iconSize = 28;

    // Helper to get item quantity
    const getItemQuantity = (items: any[], itemId: string) => {
      const item = items?.find((i: any) => i.itemId === itemId);
      return item ? item.quantity : 0;
    };

    // Binding for level text with XP
    const levelTextBinding = this.ui.bindingManager.playerDataBinding.binding.derive((data: any) => {
      if (!data) return 'Lvl 1. 0/100';
      const xpThresholds = [0, 100, 300, 700, 1500, 3100, 6300, 12700, 25500];
      const playerLevel = data.playerLevel || 1;
      const totalXP = data.totalXP || 0;
      const xpForCurrentLevel = xpThresholds[playerLevel - 1];
      const xpForNextLevel = playerLevel < 9 ? xpThresholds[playerLevel] : xpThresholds[8];
      const currentXP = totalXP - xpForCurrentLevel;
      const xpNeeded = xpForNextLevel - xpForCurrentLevel;
      return `Lvl ${playerLevel}. ${currentXP}/${xpNeeded}`;
    });

    // Binding for coins
    const coinsBinding = this.ui.bindingManager.playerDataBinding.binding.derive((data: any) => {
      if (!data) return '0';
      return String(data.coins || 0);
    });

    // Binding for serums
    const serumsBinding = this.ui.bindingManager.playerDataBinding.binding.derive((data: any) => {
      if (!data) return '0';
      const serums = getItemQuantity(data.items || [], 'serum');
      return String(serums);
    });

    return this.ui.View({
      style: {
        position: 'absolute',
        left: containerX,
        top: containerY,
        width: containerWidth,
        height: containerHeight,
      },
      children: [
        // Background container image
        this.ui.Image({
          source: this.ui.assetIdToImageSource?.('player-stats-container') || null,
          style: {
            position: 'absolute',
            width: containerWidth,
            height: containerHeight,
            top: 0,
            left: 0,
          },
        }),

        // Level text - left aligned
        this.ui.View({
          style: {
            position: 'absolute',
            left: 85,
            top: 29,
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

        // Coins section (icon + text) - centered in middle section
        this.ui.View({
          style: {
            position: 'absolute',
            left: 250,
            top: 28,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          },
          children: [
            // Coin icon
            this.ui.Image({
              source: this.ui.assetIdToImageSource?.('icon-coin') || null,
              style: {
                width: iconSize,
                height: iconSize,
              },
            }),
            // Coin amount - black text
            this.ui.Text({
              text: coinsBinding,
              style: {
                fontSize: DIMENSIONS.fontSize.lg,
                color: '#000000',
                fontWeight: 'bold',
                marginLeft: 4,
              },
            }),
          ],
        }),

        // Serums section (icon + text) - centered in right section
        this.ui.View({
          style: {
            position: 'absolute',
            left: 370,
            top: 28,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          },
          children: [
            // Serum icon
            this.ui.Image({
              source: this.ui.assetIdToImageSource?.('icon-serum') || null,
              style: {
                width: iconSize,
                height: iconSize,
              },
            }),
            // Serum amount - black text
            this.ui.Text({
              text: serumsBinding,
              style: {
                fontSize: DIMENSIONS.fontSize.lg,
                color: '#000000',
                fontWeight: 'bold',
                marginLeft: 4,
              },
            }),
          ],
        }),
      ],
    });
  }

  dispose() {
  }
}
