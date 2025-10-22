/**
 * Menu Screen - Refactored with UI Component System
 */

// Import from unified BloomBeasts UI system
import { View, Text, Image, Pressable, UINode, Binding } from '../ui';
import { COLORS } from '../../../../shared/styles/colors';
import { DIMENSIONS, GAPS } from '../../../../shared/styles/dimensions';

import { MenuStats } from '../../../../bloombeasts/gameManager';
import { createSideMenu, createTextRow, createResourceRow } from './common/sideMenu';
import { sideMenuButtonDimensions } from '../../../../shared/constants/dimensions';
import { tokenEmoji, diamondEmoji, serumEmoji } from '../../../../shared/constants/emojis';

export class MenuScreenNew {
    // State bindings
    private currentFrame: Binding<number> = new Binding(1);
    private displayedText: Binding<string> = new Binding('');
    private stats: Binding<MenuStats | null> = new Binding<MenuStats | null>(null);

    // Animation state
    private animationInterval: number | null = null;
    private textAnimationInterval: number | null = null;
    private currentMessageIndex: number = 0;
    private currentCharIndex: number = 0;
    private isTyping: boolean = false;

    private quotes: string[] = [
        'Welcome back, Trainer!',
    ];

    private onButtonClickCallback: ((buttonId: string) => void) | null = null;

    /**
     * Create the menu UI component tree
     */
    createUI(options: string[]): UINode {
        const menuOptions = options.filter(opt =>
            opt === 'missions' || opt === 'cards' || opt === 'settings'
        );

        return View({
            style: {
                width: '100%',
                height: '100%',
                position: 'relative',
            },
            children: [
                // Background image (full screen)
                this.createBackground(),

                // Main content area with animated character
                this.createMainContent(),

                // Side menu (positioned absolutely on top)
                this.createSideMenu(menuOptions),
            ],
        });
    }

    /**
     * Create full-screen background image
     */
    private createBackground(): UINode {
        return Image({
            source: new Binding({ uri: 'background' }),
            style: {
                position: 'absolute',
                width: '100%',
                height: '100%',
                top: 0,
                left: 0,
            },
        });
    }

    /**
     * Create main content area with animated character
     */
    private createMainContent(): UINode {
        return View({
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
                        source: this.currentFrame.derive(f => ({ uri: `menuFrame${f}` })),
                        style: {
                            width: 750,
                            height: 700,
                        },
                    }),
                }),
            ],
        });
    }

    /**
     * Create side menu with buttons and stats
     */
    private createSideMenu(menuOptions: string[]): UINode {
        // Line height for spacing
        const lineHeight = DIMENSIONS.fontSize.lg + 5;

        // Create menu buttons
        const menuButtons = menuOptions.map((option, index) => ({
            label: this.getMenuLabel(option),
            onClick: () => {
                if (this.onButtonClickCallback) {
                    this.stopAnimation();
                    this.onButtonClickCallback(`btn-${option}`);
                }
            },
            disabled: false,
            yOffset: index * (sideMenuButtonDimensions.height + GAPS.buttons),
        }));

        // Create custom text content (quote + resources)
        const customTextContent = this.stats.derive(statsVal => {
            if (!statsVal) return [];

            return [
                // Quote text (lines 0-2, with 3 line wrapping)
                createTextRow(this.displayedText, 0),

                // Blank line (line 3)

                // Resources (lines 4-6)
                createResourceRow(tokenEmoji, statsVal.tokens, lineHeight * 4),
                createResourceRow(diamondEmoji, statsVal.diamonds, lineHeight * 5),
                createResourceRow(serumEmoji, statsVal.serums, lineHeight * 6),
            ];
        }) as any;

        return createSideMenu({
            customTextContent: [
                View({
                    style: {
                        position: 'relative',
                    },
                    children: customTextContent,
                }),
            ],
            buttons: menuButtons,
            bottomButton: {
                label: 'Close',
                onClick: () => {}, // Disabled button
                disabled: true,
            },
            stats: this.stats,
            onXPBarClick: (title: string, message: string) => {
                if (this.onButtonClickCallback) {
                    this.onButtonClickCallback(`show-counter-info:${title}:${message}`);
                }
            },
        });
    }

    /**
     * Update the screen with new data
     */
    update(options: string[], stats: MenuStats, onButtonClick: (buttonId: string) => void): void {
        console.log('MenuScreen.update called with stats:', stats);
        this.stats.set(stats);
        console.log('Stats binding set, current value:', this.stats.get());
        this.onButtonClickCallback = onButtonClick;

        // Start animations if not already running
        if (!this.animationInterval) {
            this.startFrameAnimation();
        }
        if (!this.textAnimationInterval) {
            this.startTextAnimation();
        }
    }

    /**
     * Start character frame animation
     */
    private startFrameAnimation(): void {
        this.animationInterval = window.setInterval(() => {
            const current = this.currentFrame.get();
            this.currentFrame.set((current % 10) + 1);
        }, 200);
    }

    /**
     * Start text typing animation
     */
    private startTextAnimation(): void {
        // Just show the first quote statically for now
        this.displayedText.set(this.quotes[0]);
    }

    /**
     * Stop all animations
     */
    stopAnimation(): void {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        if (this.textAnimationInterval) {
            clearInterval(this.textAnimationInterval);
            this.textAnimationInterval = null;
        }
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
     * Cleanup
     */
    destroy(): void {
        this.stopAnimation();
    }
}
