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
    const menuOptions = ['missions', 'cards', 'upgrades', 'leaderboard', 'settings'];
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
              width: 110,
            },
            children: this.ui.Text({
              text: this.quotes[0], // TODO: listen on intervaled binding to change the quote
              numberOfLines: 3,
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
                  left: 250,
                  top: 4,
                  width: 675,
                  height: 630,
                },
              }),
          ],
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

  dispose() {
  }
}
