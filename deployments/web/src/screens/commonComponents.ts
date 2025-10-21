/**
 * Common UI Components shared across screens
 */

import { View, Text, Image, Pressable, UINode, Binding } from '../ui';
import { COLORS } from '../../../../shared/styles/colors';
import { DIMENSIONS } from '../../../../shared/styles/dimensions';
import { MenuStats } from '../../../../bloombeasts/gameManager';
import { tokenEmoji, diamondEmoji, serumEmoji } from '../../../../shared/constants/emojis';
import { sideMenuDimensions, sideMenuButtonDimensions } from '../../../../shared/constants/dimensions';
import { sideMenuPositions } from '../../../../shared/constants/positions';

export interface SidebarConfig {
    /** Quote or message text to display at the top */
    messageText?: Binding<string>;
    /** Whether to show message text area */
    showMessage?: boolean;
    /** Whether to show resources (tokens, diamonds, serums) */
    showResources?: boolean;
    /** Custom content/buttons to display in the middle */
    customContent?: UINode[];
    /** Bottom button configuration */
    bottomButton?: {
        label: string;
        onClick: () => void;
        disabled?: boolean;
    };
    /** Stats binding for player info and resources */
    stats: Binding<MenuStats | null>;
    /** Callback for XP bar click */
    onXPBarClick?: (title: string, message: string) => void;
}

/**
 * Create a common sidebar used across all screens
 */
export function createSidebar(config: SidebarConfig): UINode {
    const children: UINode[] = [];

    // Calculate positions relative to sidebar origin
    const headerRelativeX = sideMenuPositions.headerStartPosition.x - sideMenuPositions.x;
    const headerRelativeY = sideMenuPositions.headerStartPosition.y - sideMenuPositions.y;
    const textRelativeX = sideMenuPositions.textStartPosition.x - sideMenuPositions.x;
    const textRelativeY = sideMenuPositions.textStartPosition.y - sideMenuPositions.y;
    const buttonRelativeX = sideMenuPositions.buttonStartPosition.x - sideMenuPositions.x;
    const buttonRelativeY = sideMenuPositions.buttonStartPosition.y - sideMenuPositions.y;

    // Line height calculation (matches old implementation)
    const lineHeight = DIMENSIONS.fontSize.lg + 5;

    // Message/quote text at textStartPosition (lines 1-3)
    if (config.showMessage && config.messageText) {
        children.push(
            View({
                style: {
                    position: 'absolute',
                    left: textRelativeX,
                    top: textRelativeY,
                    width: sideMenuDimensions.width - textRelativeX - 5,
                },
                children: Text({
                    text: config.messageText,
                    numberOfLines: 3,
                    style: {
                        fontSize: DIMENSIONS.fontSize.lg,
                        color: COLORS.textPrimary,
                        lineHeight: lineHeight,
                    },
                }),
            })
        );
    }

    // Player resources at lines 5-7 (line 4 is blank)
    if (config.showResources) {
        children.push(
            View({
                style: {
                    position: 'absolute',
                    left: textRelativeX,
                    top: textRelativeY,
                },
                children: config.stats.derive(stats => {
                    if (!stats) {
                        return [];
                    }

                    // Line 5: Tokens (after 3 lines of quote + 1 blank)
                    // Line 6: Diamonds
                    // Line 7: Serums
                    return [
                        createResourceRow(tokenEmoji, stats.tokens, lineHeight * 4),
                        createResourceRow(diamondEmoji, stats.diamonds, lineHeight * 5),
                        createResourceRow(serumEmoji, stats.serums, lineHeight * 6),
                    ];
                }) as any,
            })
        );
    }

    // Custom content at buttonStartPosition
    if (config.customContent && config.customContent.length > 0) {
        children.push(
            View({
                style: {
                    position: 'absolute',
                    left: buttonRelativeX,
                    top: buttonRelativeY,
                    flexDirection: 'column',
                },
                children: config.customContent,
            })
        );
    }

    // Player info at bottom of sidebar
    // Position from bottom: sidebar height (465) - player info height (~40)
    children.push(
        View({
            style: {
                position: 'absolute',
                left: 0,
                top: sideMenuDimensions.height - 40,
                width: sideMenuDimensions.width,
            },
            children: createPlayerInfo(config.stats, config.onXPBarClick),
        })
    );

    // Bottom button (if provided, position below player info)
    if (config.bottomButton) {
        children.push(
            createSideMenuButton(
                config.bottomButton.label,
                headerRelativeX,
                headerRelativeY,
                config.bottomButton.onClick,
                config.bottomButton.disabled || false
            )
        );
    }

    return View({
        style: {
            position: 'absolute',
            left: sideMenuPositions.x,
            top: sideMenuPositions.y,
            width: sideMenuDimensions.width,
            height: sideMenuDimensions.height,
            flexDirection: 'column',
        },
        children: [
            // Sidebar background image
            Image({
                source: new Binding({ uri: 'sideMenu' }),
                style: {
                    position: 'absolute',
                    width: sideMenuDimensions.width,
                    height: sideMenuDimensions.height,
                    top: 0,
                    left: 0,
                },
            }),
            // Sidebar content
            ...children,
        ],
    });
}

/**
 * Create a resource display row at a specific vertical position
 */
function createResourceRow(emoji: string, amount: number, top: number): UINode {
    return View({
        style: {
            position: 'absolute',
            top: top,
        },
        children: Text({
            text: new Binding(`${emoji} ${amount}`),
            style: {
                fontSize: 18, // TEXT_SIZE from old implementation
                color: COLORS.textPrimary,
            },
        }),
    });
}

/**
 * Create a side menu button with image background
 */
function createSideMenuButton(
    label: string,
    x: number,
    y: number,
    onClick: () => void,
    disabled: boolean = false
): UINode {
    return Pressable({
        onClick: disabled ? undefined : onClick,
        style: {
            position: 'absolute',
            left: x,
            top: y,
            width: sideMenuButtonDimensions.width,
            height: sideMenuButtonDimensions.height,
        },
        children: [
            // Button background image
            Image({
                source: new Binding({ uri: 'standardButton' }),
                style: {
                    position: 'absolute',
                    width: sideMenuButtonDimensions.width,
                    height: sideMenuButtonDimensions.height,
                    opacity: disabled ? 0.5 : 1,
                },
            }),
            // Button text centered
            View({
                style: {
                    position: 'absolute',
                    width: sideMenuButtonDimensions.width,
                    height: sideMenuButtonDimensions.height,
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                children: Text({
                    text: new Binding(label),
                    style: {
                        fontSize: DIMENSIONS.fontSize.md,
                        color: disabled ? '#888' : COLORS.textPrimary,
                        textAlign: 'center',
                        fontWeight: 'bold',
                        textAlignVertical: 'center',
                    },
                }),
            }),
        ],
    });
}

/**
 * Create player info display (name, level, XP bar)
 * Used at the bottom of side menus across all screens
 * Uses exact positions from sideMenuPositions
 */
export function createPlayerInfo(
    stats: Binding<MenuStats | null>,
    onXPBarClick?: (title: string, message: string) => void
): UINode {
    return View({
        style: {
            width: sideMenuDimensions.width,
            height: 50,
            position: 'relative',
        },
        children: stats.derive(statsVal => {
            if (!statsVal) {
                return [];
            }

            const xpThresholds = [0, 100, 300, 700, 1500, 3100, 6300, 12700, 25500];
            const currentLevel = statsVal.playerLevel;
            const totalXP = statsVal.totalXP;
            const xpForCurrentLevel = xpThresholds[currentLevel - 1];
            const xpForNextLevel = currentLevel < 9 ? xpThresholds[currentLevel] : xpThresholds[8];
            const currentXP = totalXP - xpForCurrentLevel;
            const xpNeeded = xpForNextLevel - xpForCurrentLevel;
            const xpPercent = Math.min(100, (currentXP / xpNeeded) * 100);

            // Calculate relative Y positions
            // playerName is at y: 426, playerLevel/bar at y: 445
            // Difference: 445 - 426 = 19
            const barYOffset = 19;
            const barHeight = 11;

            return [
                // Player name at x: 10, y: 0 (relative)
                View({
                    style: {
                        position: 'absolute',
                        left: sideMenuPositions.playerName.x,
                        top: 0,
                    },
                    children: Text({
                        text: new Binding('Player'),
                        style: {
                            fontSize: sideMenuPositions.playerName.size, // sm = 14
                            color: COLORS.textPrimary,
                            textAlign: sideMenuPositions.playerName.textAlign as any,
                        },
                    }),
                }),

                // XP Bar at x: 9, y: 19 (relative), maxWidth: 109, height: 11
                View({
                    style: {
                        position: 'absolute',
                        left: sideMenuPositions.playerExperienceBar.x,
                        top: barYOffset,
                        width: sideMenuPositions.playerExperienceBar.maxWidth,
                        height: barHeight,
                    },
                    children: Pressable({
                        onClick: () => {
                            if (onXPBarClick) {
                                const title = `Level ${currentLevel}`;
                                const message = `Current XP: ${currentXP} / ${xpNeeded}\n\nTotal XP: ${totalXP}`;
                                onXPBarClick(title, message);
                            }
                        },
                        style: {
                            width: '100%',
                            height: '100%',
                        },
                        children: Image({
                            source: new Binding({ uri: 'experienceBar' }),
                            style: {
                                width: `${xpPercent}%`,
                                height: barHeight,
                            },
                        }),
                    }),
                }),

                // Level text centered on top of experience bar
                View({
                    style: {
                        position: 'absolute',
                        left: sideMenuPositions.playerLevel.x,
                        top: barYOffset,
                        width: 20,
                        height: barHeight,
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                    children: Text({
                        text: new Binding(`${currentLevel}`),
                        style: {
                            fontSize: sideMenuPositions.playerLevel.size, // xs = 12
                            color: COLORS.textPrimary,
                            textAlign: 'center',
                        },
                    }),
                }),
            ];
        }) as any,
    });
}
