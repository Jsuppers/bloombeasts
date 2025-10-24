/**
 * Unified Menu Screen Component
 * Works on both Horizon and Web platforms
 * Matches the styling from menuScreen.new.ts
 */

import { View, Text, Image, Binding } from '../index';
import { COLORS } from '../styles/colors';
import { DIMENSIONS, GAPS } from '../styles/dimensions';
import { sideMenuButtonDimensions } from '../constants/dimensions';
import type { MenuStats } from '../../../bloombeasts/gameManager';
import { UINodeType } from './ScreenUtils';
import { createSideMenu, createResourceRow } from './common/SideMenu';

export interface MenuScreenProps {
  stats: any;
  onButtonClick?: (buttonId: string) => void;
  onNavigate?: (screen: string) => void;
  onRenderNeeded?: () => void;
}

/**
 * Unified Menu Screen that works on both platforms
 */
export class MenuScreen {
  // State bindings
  private currentFrame: any;
  private displayedText: any;
  private stats: any;

  // Animation state
  private animationInterval: number | null = null;
  private textAnimationInterval: number | null = null;

  private quotes: string[] = [
    'Welcome back, Trainer!',
  ];

  // Callbacks
  private onButtonClick?: (buttonId: string) => void;
  private onNavigate?: (screen: string) => void;

  constructor(props: MenuScreenProps) {
    this.stats = props.stats;
    this.onButtonClick = props.onButtonClick;
    this.onNavigate = props.onNavigate;

    // Initialize bindings
    this.currentFrame = new Binding(1);
    this.displayedText = new Binding('');

    // Start animations
    this.startAnimations();
  }

  private startAnimations(): void {
    // Frame animation for character
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }

    this.animationInterval = setInterval(() => {
      const current = this.currentFrame.get();
      this.currentFrame.set((current % 10) + 1);
    }, 200) as unknown as number;

    // Just show the first quote statically
    this.displayedText.set(this.quotes[0]);
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
    const customTextContent = [
      View({
        style: {
          position: 'relative',
        },
        children: this.stats.derive((statsVal: MenuStats | null) => {
          if (!statsVal) return [];

          return [
            // Quote text (lines 0-2)
            View({
              style: {
                position: 'absolute',
                top: 0,
                width: 110,
              },
              children: Text({
                text: this.displayedText,
                numberOfLines: 3,
                style: {
                  fontSize: DIMENSIONS.fontSize.lg,
                  color: COLORS.textPrimary,
                  lineHeight: lineHeight,
                },
              }),
            }),

            // Resources (lines 4-6)
            createResourceRow('🪙', statsVal.tokens, lineHeight * 4),
            createResourceRow('💎', statsVal.diamonds, lineHeight * 5),
            createResourceRow('🧪', statsVal.serums, lineHeight * 6),
          ];
        }) as any,
      }),
    ];

    return View({
      style: {
        width: '100%',
        height: '100%',
        position: 'relative',
      },
      children: [
        // Background image (full screen)
        Image({
          source: new Binding({ uri: 'background' }),
          style: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
          },
        }),

        // Main content area with animated character
        View({
          style: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          },
          children: [
            // Animated character frame at position (143, 25)
            View({
              style: {
                position: 'absolute',
                left: 143,
                top: 25,
              },
              children: Image({
                source: this.currentFrame.derive((f: number) => ({ uri: `menu-frame-${f}` })),
                style: {
                  width: 750,
                  height: 700,
                },
              }),
            }),
          ],
        }),

        // Side menu (positioned absolutely on top)
        createSideMenu({
          customTextContent,
          buttons: menuButtons,
          bottomButton: {
            label: 'Close',
            onClick: () => {}, // Disabled button
            disabled: true,
          },
          stats: this.stats,
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
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
      this.animationInterval = null;
    }
    if (this.textAnimationInterval) {
      clearInterval(this.textAnimationInterval);
      this.textAnimationInterval = null;
    }
  }
}
