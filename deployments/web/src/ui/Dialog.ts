/**
 * Generic Dialog Component
 * Mimics Horizon's dialog system with yes/no buttons
 */

import { View, Text, Pressable, UINode } from './components';
import { Binding } from './Binding';
import { COLORS } from '../../../../shared/styles/colors';
import { DIMENSIONS } from '../../../../shared/styles/dimensions';

export type DialogButton = {
    label: string;
    action: () => void;
};

export class GenericDialog {
    private isVisible: Binding<boolean> = new Binding(false);
    private title: Binding<string> = new Binding('');
    private message: Binding<string> = new Binding('');
    private buttons: Binding<DialogButton[]> = new Binding<DialogButton[]>([]);

    private resolveCallback: ((value: string) => void) | null = null;

    /**
     * Show a dialog with title, message, and buttons
     */
    show(title: string, message: string, buttons?: string[]): Promise<string> {
        this.title.set(title);
        this.message.set(message);

        return new Promise((resolve) => {
            this.resolveCallback = resolve;

            // Create button actions
            const buttonConfigs = (buttons || ['OK']).map(label => ({
                label,
                action: () => this.handleButtonClick(label)
            }));

            this.buttons.set(buttonConfigs);
            this.isVisible.set(true);
        });
    }

    /**
     * Hide the dialog
     */
    hide(): void {
        this.isVisible.set(false);
    }

    /**
     * Handle button click
     */
    private handleButtonClick(label: string): void {
        this.hide();
        if (this.resolveCallback) {
            this.resolveCallback(label);
            this.resolveCallback = null;
        }
    }

    /**
     * Create the dialog UI
     */
    createUI(): UINode {
        return UINode.if(
            this.isVisible,
            View({
                style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                children: [
                    // Dialog box
                    View({
                        style: {
                            width: 500,
                            backgroundColor: COLORS.cardBackground,
                            borderRadius: 12,
                            borderWidth: 3,
                            borderColor: COLORS.borderPrimary,
                            padding: 30,
                        },
                        children: [
                            // Title
                            Text({
                                text: this.title,
                                style: {
                                    fontSize: DIMENSIONS.fontSize.xxl,
                                    color: COLORS.textPrimary,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    marginBottom: 20,
                                },
                            }),

                            // Message
                            Text({
                                text: this.message,
                                style: {
                                    fontSize: DIMENSIONS.fontSize.lg,
                                    color: COLORS.textSecondary,
                                    textAlign: 'center',
                                    marginBottom: 30,
                                    lineHeight: 24,
                                },
                            }),

                            // Buttons
                            View({
                                style: {
                                    flexDirection: 'row',
                                    justifyContent: 'center',
                                },
                                children: this.buttons.derive(btns =>
                                    btns.map((btn, index) =>
                                        View({
                                            style: {
                                                marginRight: index < btns.length - 1 ? 15 : 0,
                                            },
                                            children: this.createButton(btn),
                                        })
                                    )
                                ) as any,
                            }),
                        ],
                    }),
                ],
            })
        );
    }

    /**
     * Create a dialog button
     */
    private createButton(button: DialogButton): UINode {
        return Pressable({
            onClick: button.action,
            style: {
                padding: 15,
                backgroundColor: COLORS.buttonPrimary,
                borderRadius: 8,
                borderWidth: 2,
                borderColor: COLORS.borderPrimary,
                minWidth: 120,
            },
            children: Text({
                text: new Binding(button.label),
                style: {
                    fontSize: DIMENSIONS.fontSize.md,
                    color: COLORS.textPrimary,
                    textAlign: 'center',
                    fontWeight: 'bold',
                },
            }),
        });
    }

    /**
     * Check if dialog is visible
     */
    get visible(): boolean {
        return this.isVisible.get();
    }
}

/**
 * Rewards Dialog
 */
export class RewardsDialog {
    private isVisible: Binding<boolean> = new Binding(false);
    private rewards: Binding<any> = new Binding(null);

    private resolveCallback: (() => void) | null = null;

    /**
     * Show rewards dialog
     */
    show(rewards: any): Promise<void> {
        this.rewards.set(rewards);

        return new Promise((resolve) => {
            this.resolveCallback = resolve;
            this.isVisible.set(true);
        });
    }

    /**
     * Hide the rewards dialog
     */
    hide(): void {
        this.isVisible.set(false);
        if (this.resolveCallback) {
            this.resolveCallback();
            this.resolveCallback = null;
        }
    }

    /**
     * Create the rewards UI
     */
    createUI(): UINode {
        return UINode.if(
            this.isVisible,
            View({
                style: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                children: [
                    // Rewards box
                    View({
                        style: {
                            width: 500,
                            backgroundColor: COLORS.cardBackground,
                            borderRadius: 12,
                            borderWidth: 3,
                            borderColor: COLORS.borderSuccess,
                            padding: 30,
                        },
                        children: [
                            // Title
                            Text({
                                text: new Binding('Mission Complete!'),
                                style: {
                                    fontSize: DIMENSIONS.fontSize.xxl,
                                    color: COLORS.success,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                    marginBottom: 20,
                                },
                            }),

                            // Rewards list
                            View({
                                style: {
                                    marginBottom: 30,
                                },
                                children: this.rewards.derive(r => {
                                    if (!r) return [];

                                    const items: UINode[] = [];

                                    if (r.xp) {
                                        items.push(this.createRewardItem('XP', `+${r.xp}`));
                                    }
                                    if (r.tokens) {
                                        items.push(this.createRewardItem('Tokens', `+${r.tokens}`));
                                    }
                                    if (r.cards && r.cards.length > 0) {
                                        items.push(this.createRewardItem('Cards', `${r.cards.length} new card(s)`));
                                    }

                                    return items;
                                }) as any,
                            }),

                            // Continue button
                            Pressable({
                                onClick: () => this.hide(),
                                style: {
                                    padding: 15,
                                    backgroundColor: COLORS.buttonSuccess,
                                    borderRadius: 8,
                                    borderWidth: 2,
                                    borderColor: COLORS.borderSuccess,
                                },
                                children: Text({
                                    text: new Binding('Continue'),
                                    style: {
                                        fontSize: DIMENSIONS.fontSize.md,
                                        color: COLORS.textPrimary,
                                        textAlign: 'center',
                                        fontWeight: 'bold',
                                    },
                                }),
                            }),
                        ],
                    }),
                ],
            })
        );
    }

    /**
     * Create a reward item display
     */
    private createRewardItem(label: string, value: string): UINode {
        return View({
            style: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10,
                padding: 10,
                backgroundColor: COLORS.panelBackground,
                borderRadius: 6,
            },
            children: [
                Text({
                    text: new Binding(label),
                    style: {
                        fontSize: DIMENSIONS.fontSize.lg,
                        color: COLORS.textPrimary,
                    },
                }),
                Text({
                    text: new Binding(value),
                    style: {
                        fontSize: DIMENSIONS.fontSize.lg,
                        color: COLORS.success,
                        fontWeight: 'bold',
                    },
                }),
            ],
        });
    }

    /**
     * Check if rewards dialog is visible
     */
    get visible(): boolean {
        return this.isVisible.get();
    }
}
