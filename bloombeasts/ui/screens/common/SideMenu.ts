/**
 * Common Side Menu Component
 * Shared sidebar used across all unified screens (Horizon & Web)
 */

import { View, Text, Image, Pressable, Binding } from '../../index';
import type { ValueBindingBase } from '../../index';
import { COLORS } from '../../../../shared/styles/colors';
import { DIMENSIONS } from '../../../../shared/styles/dimensions';
import { sideMenuDimensions, sideMenuButtonDimensions } from '../../../../shared/constants/dimensions';
import { sideMenuPositions } from '../../../../shared/constants/positions';
import type { MenuStats } from '../../../../bloombeasts/gameManager';
import { UINodeType } from '../ScreenUtils';

export interface SideMenuButton {
    label: string | ValueBindingBase<string>;
    onClick: () => void;
    disabled?: boolean | ValueBindingBase<boolean>;
    yOffset?: number; // Vertical offset from buttonStartPosition
}

export interface SideMenuConfig {
    /** Title text displayed at headerStartPosition */
    title?: string | ValueBindingBase<string>;
    /** Custom content items to display at textStartPosition */
    customTextContent?: UINodeType[];
    /** Buttons to display at buttonStartPosition */
    buttons?: SideMenuButton[];
    /** Bottom button at headerStartPosition */
    bottomButton?: SideMenuButton;
    /** Stats binding for player info */
    stats: ValueBindingBase<MenuStats | null> | any;
    /** Callback for XP bar click */
    onXPBarClick?: (title: string, message: string) => void;
}

/**
 * Create a common sidebar used across all screens
 */
export function createSideMenu(config: SideMenuConfig): UINodeType {
    const children: UINodeType[] = [];

    // Calculate positions relative to sidebar origin (using sideMenuPositions)
    const headerRelativeX = sideMenuPositions.headerStartPosition.x - sideMenuPositions.x;
    const headerRelativeY = sideMenuPositions.headerStartPosition.y - sideMenuPositions.y;
    const textRelativeX = sideMenuPositions.textStartPosition.x - sideMenuPositions.x;
    const textRelativeY = sideMenuPositions.textStartPosition.y - sideMenuPositions.y;
    const buttonRelativeX = sideMenuPositions.buttonStartPosition.x - sideMenuPositions.x;
    const buttonRelativeY = sideMenuPositions.buttonStartPosition.y - sideMenuPositions.y;

    // Title at headerStartPosition (if provided)
    if (config.title) {
        children.push(
            View({
                style: {
                    position: 'absolute',
                    left: headerRelativeX,
                    top: headerRelativeY,
                },
                children: Text({
                    text: typeof config.title === 'string' ? new Binding(config.title) : config.title,
                    style: {
                        fontSize: DIMENSIONS.fontSize.md,
                        color: COLORS.textPrimary,
                        fontWeight: 'bold',
                    },
                }),
            })
        );
    }

    // Custom text content at textStartPosition
    if (config.customTextContent && config.customTextContent.length > 0) {
        children.push(
            View({
                style: {
                    position: 'absolute',
                    left: textRelativeX,
                    top: textRelativeY,
                    flexDirection: 'column',
                },
                children: config.customTextContent,
            })
        );
    }

    // Buttons at buttonStartPosition
    if (config.buttons && config.buttons.length > 0) {
        children.push(
            View({
                style: {
                    position: 'absolute',
                    left: buttonRelativeX,
                    top: buttonRelativeY,
                    flexDirection: 'column',
                },
                children: config.buttons.map(button =>
                    createSideMenuButton(
                        button.label,
                        0,
                        button.yOffset !== undefined ? button.yOffset : 0,
                        button.onClick,
                        button.disabled
                    )
                ),
            })
        );
    }

    // Player info at bottom of sidebar (aligned to bottom like web deployment)
    children.push(
        View({
            style: {
                position: 'absolute',
                left: 0,
                top: sideMenuDimensions.height - 40,
                width: sideMenuDimensions.width,
                height: 50,
            },
            children: createPlayerInfo(config.stats, config.onXPBarClick),
        })
    );

    // Bottom button (if provided, at headerStartPosition)
    if (config.bottomButton) {
        children.push(
            createSideMenuButton(
                config.bottomButton.label,
                headerRelativeX,
                headerRelativeY,
                config.bottomButton.onClick,
                config.bottomButton.disabled
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
 * Create a side menu button with image background
 */
function createSideMenuButton(
    label: string | ValueBindingBase<string>,
    x: number,
    y: number,
    onClick: () => void,
    disabled?: boolean | ValueBindingBase<boolean>
): UINodeType {
    const labelBinding = typeof label === 'string' ? new Binding(label) : label;
    const disabledValue = typeof disabled === 'boolean' ? disabled : false;
    const disabledBinding = typeof disabled === 'object' && 'get' in disabled ? disabled : undefined;

    return Pressable({
        onClick: onClick,
        disabled: disabledBinding || disabledValue,
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
                    opacity: disabledValue ? 0.5 : 1,
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
                    text: labelBinding,
                    style: {
                        fontSize: DIMENSIONS.fontSize.md,
                        color: disabledValue ? '#888' : COLORS.textPrimary,
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
 * Positioned using sideMenuPositions
 */
function createPlayerInfo(
    stats: ValueBindingBase<MenuStats | null> | any,
    onXPBarClick?: (title: string, message: string) => void
): UINodeType {
    return View({
        style: {
            position: 'relative',
        },
        children: stats.derive((statsVal: MenuStats | null) => {
            if (!statsVal) return [];

            const xpThresholds = [0, 100, 300, 700, 1500, 3100, 6300, 12700, 25500];
            const currentLevel = statsVal.playerLevel;
            const totalXP = statsVal.totalXP;
            const xpForCurrentLevel = xpThresholds[currentLevel - 1];
            const xpForNextLevel = currentLevel < 9 ? xpThresholds[currentLevel] : xpThresholds[8];
            const currentXP = totalXP - xpForCurrentLevel;
            const xpNeeded = xpForNextLevel - xpForCurrentLevel;
            const xpPercent = Math.min(100, (currentXP / xpNeeded) * 100);

            return [
                // Player name
                View({
                    style: {
                        position: 'absolute',
                        left: sideMenuPositions.playerName.x,
                        top: 0,
                    },
                    children: Text({
                        text: new Binding('Player'),
                        style: {
                            fontSize: sideMenuPositions.playerName.size,
                            color: COLORS.textPrimary,
                            textAlign: sideMenuPositions.playerName.textAlign as any,
                        },
                    }),
                }),

                // XP Bar
                View({
                    style: {
                        position: 'absolute',
                        left: sideMenuPositions.playerExperienceBar.x,
                        top: 19, // Offset from player name
                        width: sideMenuPositions.playerExperienceBar.maxWidth,
                        height: 11,
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
                                height: 11,
                            },
                        }),
                    }),
                }),

                // Level text (centered on XP bar)
                View({
                    style: {
                        position: 'absolute',
                        left: sideMenuPositions.playerLevel.x,
                        top: 19,
                        width: 20,
                        height: 11,
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                    children: Text({
                        text: new Binding(`${currentLevel}`),
                        style: {
                            fontSize: sideMenuPositions.playerLevel.size,
                            color: COLORS.textPrimary,
                            textAlign: 'center',
                        },
                    }),
                }),
            ];
        }) as any,
    });
}

/**
 * Helper: Create a text row component
 */
export function createTextRow(text: string | ValueBindingBase<string>, top: number = 0): UINodeType {
    return View({
        style: {
            position: 'absolute',
            top: top,
        },
        children: Text({
            text: typeof text === 'string' ? new Binding(text) : text,
            style: {
                fontSize: DIMENSIONS.fontSize.md,
                color: COLORS.textPrimary,
            },
        }),
    });
}

/**
 * Helper: Create a resource row (emoji + count)
 */
export function createResourceRow(
    emoji: string,
    amount: number | ValueBindingBase<number>,
    top: number = 0
): UINodeType {
    const amountText = typeof amount === 'number'
        ? new Binding(`${emoji} ${amount}`)
        : (amount as any).derive((a: number) => `${emoji} ${a}`);

    return View({
        style: {
            position: 'absolute',
            top: top,
        },
        children: Text({
            text: amountText,
            style: {
                fontSize: 18,
                color: COLORS.textPrimary,
            },
        }),
    });
}
