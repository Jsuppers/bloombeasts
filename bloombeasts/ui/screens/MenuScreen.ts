/**
 * Unified Menu Screen Component
 * Works on both Horizon and Web platforms
 * Matches the styling from menuScreen.new.ts
 */

import { COLORS } from '../styles/colors';
import { DIMENSIONS, GAPS } from '../styles/dimensions';
import { sideMenuButtonDimensions } from '../constants/dimensions';
import type { MenuStats } from '../../../bloombeasts/gameManager';
import type { BindingInterface, UIMethodMappings } from '../../../bloombeasts/BloomBeastsGame';
import type { AsyncMethods } from '../types/bindings';
import { UINodeType } from './ScreenUtils';
import { createSideMenu, createTextRow } from './common/SideMenu';
import { IntervaledBinding } from '../bindings/IntervaledBinding';

export interface MenuScreenProps {
  ui: UIMethodMappings;
  async: AsyncMethods;
  playerDataBinding: any; // PlayerData binding
  onButtonClick?: (buttonId: string) => void;
  onNavigate?: (screen: string) => void;
  onRenderNeeded?: () => void;
}

/**
 * Unified Menu Screen that works on both platforms
 */
export class MenuScreen {
  // UI methods (injected)
  private ui: UIMethodMappings;
  private async: AsyncMethods;

  // State bindings
  private displayedText: any;
  private playerDataBinding: any;
  private menuFrameAnimation: BindingInterface<string>;
  private frameInterval: any;

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

  constructor(props: MenuScreenProps) {
    this.ui = props.ui;
    this.async = props.async;
    this.playerDataBinding = props.playerDataBinding;
    this.onButtonClick = props.onButtonClick;
    this.onNavigate = props.onNavigate;

    // Initialize bindings using injected UI implementation
    this.displayedText = new this.ui.Binding('');

    // Show the first quote statically
    this.displayedText.set(this.quotes[0]);

    // Create animated binding for menu frames
    let frameIndex = 0;
    this.menuFrameAnimation = new this.ui.Binding<string>(this.menuFrameIds[0]);
    this.frameInterval = this.async.setInterval(() => {
      frameIndex = (frameIndex + 1) % this.menuFrameIds.length;
      this.menuFrameAnimation.set(this.menuFrameIds[frameIndex]);
    }, 200);
  }

  /**
   * Create the unified menu UI - uses common side menu
   */
  createUI(): UINodeType {
    const menuOptions = ['missions', 'cards', 'settings'];
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

    // Create custom text content (quote + resources)
    // Derive item quantities from playerData
    const getItemQuantity = (items: any[], itemId: string) => {
      const item = items?.find((i: any) => i.itemId === itemId);
      return item ? item.quantity : 0;
    };

    const tokensText = this.playerDataBinding.derive((pd: any) =>
      `🪙 ${pd ? getItemQuantity(pd.items, 'token') : 0}`
    );
    const diamondsText = this.playerDataBinding.derive((pd: any) =>
      `💎 ${pd ? getItemQuantity(pd.items, 'diamond') : 0}`
    );
    const serumsText = this.playerDataBinding.derive((pd: any) =>
      `🧪 ${pd ? getItemQuantity(pd.items, 'serum') : 0}`
    );

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
              text: this.displayedText,
              numberOfLines: 3,
              style: {
                fontSize: DIMENSIONS.fontSize.lg,
                color: COLORS.textPrimary,
                lineHeight: lineHeight,
              },
            }),
          }),

          // Resources (lines 4-6) - using createTextRow instead of createResourceRow
          createTextRow(this.ui, tokensText, lineHeight * 4),
          createTextRow(this.ui, diamondsText, lineHeight * 5),
          createTextRow(this.ui, serumsText, lineHeight * 6),
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
          source: this.ui.Binding.derive(
            [this.ui.assetsLoadedBinding],
            (assetsLoaded: boolean) => {
              console.log('[MenuScreen] BACKGROUND assetsLoaded:', assetsLoaded);
              return assetsLoaded ? this.ui.assetIdToImageSource?.('background') : null;
            }
          ),
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
            // Animated character frame - try without centering first
            this.ui.Image({
                source: this.ui.Binding.derive(
                  [this.ui.assetsLoadedBinding, this.menuFrameAnimation],
                  (assetsLoaded: boolean, menuFrameAnimation: string) => {
                    // console.log('[MenuScreen] Image binding fired:', { assetsLoaded, menuFrameAnimation });

                    if (!assetsLoaded) {
                      console.log('[MenuScreen] Assets not loaded yet');
                      return null;
                    }

                    console.log('[MenuScreen] assetIdToImageSource exists?', !!this.ui.assetIdToImageSource);
                    const imageSource = this.ui.assetIdToImageSource?.(menuFrameAnimation);
                    // console.log('[MenuScreen] ImageSource result:', imageSource);

                    return imageSource;
                  },
                ),
                style: {
                  position: 'absolute',
                  left: 150,
                  top: 40,
                  width: 750,
                  height: 700,
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
          playerDataBinding: this.playerDataBinding,
          onXPBarClick: (title: string, message: string) => {
            if (this.onButtonClick) {
              this.onButtonClick(`show-counter-info:${title}:${message}`);
            }
          },
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
      settings: 'Settings',
    };
    return labels[option] || option;
  }

  /**
   * Clean up animations
   */
  dispose(): void {
    if (this.frameInterval) {
      this.async.clearInterval(this.frameInterval);
    }
  }
}
