/**
 * Common Side Menu Component
 * Shared sidebar used across all unified screens (Horizon & Web)
 */

import { COLORS } from '../../styles/colors';
import { DIMENSIONS, GAPS } from '../../styles/dimensions';
import { sideMenuPositions } from '../../constants/positions';
import type { MenuStats } from '../../../../bloombeasts/gameManager';
import { UINodeType } from '../ScreenUtils';
import type { UIMethodMappings } from '../../../../bloombeasts/BloomBeastsGame';
import type { ValueBindingBase } from '../../types/bindings';
import { createButton } from '../../common/Button';
import { BindingType } from '../../types/BindingManager';

// SideMenu-specific constants
const sideMenuDimensions = {
  width: 225,
  height: 497,
};

export interface SideMenuButton {
    label: string | ValueBindingBase<string>;
    onClick: () => void;
    disabled?: boolean | ValueBindingBase<boolean>;
    opacity?: any; // Binding or static opacity value
    textColor?: any; // Binding or static text color value
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
    /** Callback for XP bar click */
    onXPBarClick?: (title: string, message: string) => void;
    /** Callback for playing sound effects */
    playSfx?: (sfxId: string) => void;
}

/**
 * Create a common sidebar used across all screens
 */
export function createSideMenu(ui: UIMethodMappings, config: SideMenuConfig): UINodeType {
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
            ui.View({
                style: {
                    position: 'absolute',
                    left: headerRelativeX,
                    top: headerRelativeY,
                },
                children: ui.Text({
                    text: config.title,
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
            ui.View({
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
            ui.View({
                style: {
                    position: 'absolute',
                    left: buttonRelativeX,
                    top: buttonRelativeY,
                    flexDirection: 'column',
                },
                children: config.buttons.map((button, index) =>
                    createButton({
                        ui,
                        label: button.label,
                        onClick: button.onClick,
                        disabled: button.disabled,
                        playSfx: config.playSfx,
                        style: {
                            // Use marginBottom for spacing between buttons (except last button)
                            marginBottom: index < config.buttons!.length - 1 ? GAPS.buttons : 0,
                        },
                    })
                ),
            })
        );
    }

    // Player info removed - no longer displayed in side menu

    // Bottom button (if provided, at headerStartPosition)
    if (config.bottomButton) {
        children.push(
            createButton({
                ui,
                label: config.bottomButton.label,
                onClick: config.bottomButton.onClick,
                disabled: config.bottomButton.disabled,
                playSfx: config.playSfx,
                style: {
                    position: 'absolute',
                    left: headerRelativeX,
                    top: headerRelativeY,
                },
            })
        );
    }

    return ui.View({
        style: {
            position: 'absolute',
            left: sideMenuPositions.x,
            top: sideMenuPositions.y,
            width: sideMenuDimensions.width,
            height: sideMenuDimensions.height,
            flexDirection: 'column',
        },
        children: [
            // Sidebar background image - assets preload automatically
            ui.Image({
                source: ui.assetIdToImageSource?.('container-side-menu') || null,
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
 * Create player info display (name, level and XP text)
 * Positioned using sideMenuPositions
 */
function createPlayerInfo(
    ui: UIMethodMappings,
    onXPBarClick?: (title: string, message: string) => void
): UINodeType {
    // Helper to get item quantity
    const getItemQuantity = (items: any[], itemId: string) => {
        const item = items?.find((i: any) => i.itemId === itemId);
        return item ? item.quantity : 0;
    };

    // Helper to extract MenuStats from PlayerData
    const extractStats = (pd: any): MenuStats | null => {
        if (!pd) return null;
        return {
            playerLevel: pd.playerLevel || 1,
            totalXP: pd.totalXP || 0,
            coins: pd.coins || 0,
            serums: getItemQuantity(pd.items || [], 'serum'),
        };
    };

    // XP text only (level is now in player stats container)
    const xpTextBinding = ui.bindingManager.playerDataBinding.binding.derive((data: any) => {
        const statsVal = extractStats(data);
        if (!statsVal) return '0/100';

        const xpThresholds = [0, 100, 300, 700, 1500, 3100, 6300, 12700, 25500];
        const currentLevel = statsVal.playerLevel;
        const totalXP = statsVal.totalXP;
        const xpForCurrentLevel = xpThresholds[currentLevel - 1];
        const xpForNextLevel = currentLevel < 9 ? xpThresholds[currentLevel] : xpThresholds[8];
        const currentXP = totalXP - xpForCurrentLevel;
        const xpNeeded = xpForNextLevel - xpForCurrentLevel;

        return `${currentXP}/${xpNeeded}`;
    });

    return ui.View({
        style: {
            position: 'relative',
        },
        children: [
            // Player name
            ui.View({
                style: {
                    position: 'absolute',
                    left: sideMenuPositions.playerName.x,
                    top: 0,
                },
                children: ui.Text({
                    text: 'Player',
                    style: {
                        fontSize: sideMenuPositions.playerName.size,
                        color: COLORS.textPrimary,
                        textAlign: sideMenuPositions.playerName.textAlign as any,
                    },
                }),
            }),

            // XP text only
            ui.View({
                style: {
                    position: 'absolute',
                    left: sideMenuPositions.playerName.x,
                    top: 19,
                },
                children: ui.Text({
                    text: xpTextBinding,
                    style: {
                        fontSize: DIMENSIONS.fontSize.xs,
                        color: COLORS.textSecondary,
                    },
                }),
            }),
        ],
    });
}

/**
 * Helper: Create a text row component
 */
export function createTextRow(ui: UIMethodMappings, text: string | ValueBindingBase<string>, top: number = 0): UINodeType {
    return ui.View({
        style: {
            position: 'absolute',
            top: top,
        },
        children: ui.Text({
            text: text,
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
export function createResourceRow(ui: UIMethodMappings, 
    emoji: string,
    amount: number | ValueBindingBase<number>,
    top: number = 0
): UINodeType {
    const amountText = typeof amount === 'number'
        ? `${emoji} ${amount}`
        : (amount as any).derive((a: number) => `${emoji} ${a}`);

    return ui.View({
        style: {
            position: 'absolute',
            top: top,
        },
        children: ui.Text({
            text: amountText,
            style: {
                fontSize: 18,
                color: COLORS.textPrimary,
            },
        }),
    });
}
