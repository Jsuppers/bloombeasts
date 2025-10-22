/**
 * Mission Screen - Refactored with UI Component System
 */

// Import from unified BloomBeasts UI system
import { View, Text, Image, Pressable, UINode, Binding } from '../ui';
import { COLORS } from '../../../../shared/styles/colors';
import { DIMENSIONS, GAPS } from '../../../../shared/styles/dimensions';

import { MissionDisplay, MenuStats } from '../../../../bloombeasts/gameManager';
import { missionEmoji } from '../../../../shared/constants/emojis';
import { createSideMenu, createTextRow } from './common/sideMenu';
import { sideMenuButtonDimensions } from '../../../../shared/constants/dimensions';

export class MissionScreenNew {
    // State bindings
    private missions: Binding<MissionDisplay[]> = new Binding<MissionDisplay[]>([]);
    private stats: Binding<MenuStats | null> = new Binding<MenuStats | null>(null);
    private scrollOffset: Binding<number> = new Binding(0);

    // Configuration
    private missionsPerRow: number = 3;
    private rowsPerPage: number = 3;

    // Callbacks
    private onMissionSelectCallback: ((missionId: string) => void) | null = null;
    private onBackCallback: (() => void) | null = null;
    private renderCallback: (() => void) | null = null;

    constructor() {
        // Subscribe to scrollOffset changes to trigger re-renders
        this.scrollOffset.subscribe(() => {
            if (this.renderCallback) {
                this.renderCallback();
            }
        });
    }

    /**
     * Create the missions UI
     */
    createUI(): UINode {
        return View({
            style: {
                width: '100%',
                height: '100%',
                position: 'relative',
            },
            children: [
                // Background image (full screen)
                this.createBackground(),

                // Main content area with mission grid
                this.createMainContent(),

                // Side menu with controls (absolutely positioned)
                this.createSideMenu(),
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
     * Create main content area with mission grid
     */
    private createMainContent(): UINode {
        return View({
            style: {
                position: 'absolute',
                width: 1100, // Don't overlap sidebar (1280 - 180 for sidebar and margins)
                height: '100%',
                padding: 40,
            },
            children: [
                // Missions container
                View({
                    style: {
                        padding: 30,
                        backgroundColor: COLORS.cardBackground,
                        borderRadius: 10,
                        borderWidth: 2,
                        borderColor: COLORS.borderDefault,
                        flex: 1,
                    },
                    children: this.missions.derive(missions => {
                        if (missions.length === 0) {
                            return [
                                View({
                                    style: {
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    },
                                    children: Text({
                                        text: new Binding('No missions available yet.'),
                                        style: {
                                            fontSize: DIMENSIONS.fontSize.xl,
                                            color: COLORS.textSecondary,
                                        },
                                    }),
                                }),
                            ];
                        }

                        return [this.createMissionGrid()];
                    }) as any,
                }),
            ],
        });
    }

    /**
     * Create the mission grid
     */
    private createMissionGrid(): UINode {
        return View({
            style: {
                flexDirection: 'column',
            },
            children: Binding.derive(
                [this.missions, this.scrollOffset],
                (missions, offset) => {
                    const missionsPerPage = this.missionsPerRow * this.rowsPerPage;
                    const startIndex = offset * missionsPerPage;
                    const endIndex = Math.min(startIndex + missionsPerPage, missions.length);
                    const visibleMissions = missions.slice(startIndex, endIndex);

                    // Create rows
                    const rows: UINode[] = [];
                    for (let row = 0; row < this.rowsPerPage; row++) {
                        const rowMissions = visibleMissions.slice(
                            row * this.missionsPerRow,
                            (row + 1) * this.missionsPerRow
                        );

                        if (rowMissions.length > 0) {
                            rows.push(
                                View({
                                    style: {
                                        flexDirection: 'row',
                                        marginBottom: row < this.rowsPerPage - 1 ? GAPS.missions : 0,
                                    },
                                    children: rowMissions.map((mission, index) =>
                                        View({
                                            style: {
                                                marginRight: index < rowMissions.length - 1 ? GAPS.missions : 0,
                                            },
                                            children: this.createMissionItem(mission),
                                        })
                                    ),
                                })
                            );
                        }
                    }

                    return rows;
                }
            ) as any,
        });
    }

    /**
     * Create a single mission item
     */
    private createMissionItem(mission: MissionDisplay): UINode {
        return Pressable({
            onClick: () => {
                if (this.onMissionSelectCallback) {
                    this.onMissionSelectCallback(mission.id);
                }
            },
            style: {
                width: 180,
                height: 120,
                backgroundColor: COLORS.panelBackground,
                borderRadius: 8,
                borderWidth: mission.isCompleted ? 3 : 2,
                borderColor: mission.isCompleted ? COLORS.borderSuccess : COLORS.borderDefault,
                padding: 12,
                position: 'relative',
            },
            children: [
                // Mission name
                Text({
                    text: new Binding(mission.name),
                    numberOfLines: 2,
                    style: {
                        fontSize: DIMENSIONS.fontSize.md,
                        color: COLORS.textPrimary,
                        fontWeight: 'bold',
                        marginBottom: 8,
                    },
                }),

                // Mission description
                Text({
                    text: new Binding(mission.description || ''),
                    numberOfLines: 2,
                    style: {
                        fontSize: DIMENSIONS.fontSize.sm,
                        color: COLORS.textSecondary,
                        marginBottom: 8,
                    },
                }),

                // Difficulty
                View({
                    style: {
                        flexDirection: 'row',
                        marginTop: 'auto' as any,
                    },
                    children: Text({
                        text: new Binding(`Difficulty: ${mission.difficulty}`),
                        style: {
                            fontSize: DIMENSIONS.fontSize.sm,
                            color: COLORS.info,
                        },
                    }),
                }),

                // Completed indicator
                UINode.if(
                    new Binding(mission.isCompleted),
                    View({
                        style: {
                            position: 'absolute',
                            top: 8,
                            right: 8,
                            width: 24,
                            height: 24,
                            backgroundColor: COLORS.success,
                            borderRadius: 12,
                            justifyContent: 'center',
                            alignItems: 'center',
                        },
                        children: Text({
                            text: new Binding('✓'),
                            style: {
                                fontSize: 14,
                                color: '#ffffff',
                                fontWeight: 'bold',
                            },
                        }),
                    })
                ),
            ],
        });
    }

    /**
     * Create side menu with controls
     */
    private createSideMenu(): UINode {
        const completionText = Binding.derive(
            [this.missions],
            (missions) => {
                const completedCount = missions.filter((m: MissionDisplay) => m.isCompleted).length;
                return `${missionEmoji} ${completedCount}/${missions.length}`;
            }
        );

        return createSideMenu({
            title: 'Missions',
            customTextContent: [
                createTextRow(completionText as any, 0),
            ],
            buttons: [
                {
                    label: '↑',
                    onClick: () => {
                        const missions = this.missions.get();
                        const currentOffset = this.scrollOffset.get();
                        const missionsPerPage = this.missionsPerRow * this.rowsPerPage;
                        const totalPages = Math.ceil(missions.length / missionsPerPage);

                        const newOffset = currentOffset - 1;
                        if (newOffset >= 0) {
                            this.scrollOffset.set(newOffset);
                        }
                    },
                    disabled: Binding.derive(
                        [this.missions, this.scrollOffset],
                        (missions, offset) => offset <= 0
                    ) as any,
                    yOffset: 0,
                },
                {
                    label: '↓',
                    onClick: () => {
                        const missions = this.missions.get();
                        const currentOffset = this.scrollOffset.get();
                        const missionsPerPage = this.missionsPerRow * this.rowsPerPage;
                        const totalPages = Math.ceil(missions.length / missionsPerPage);

                        const newOffset = currentOffset + 1;
                        if (newOffset < totalPages) {
                            this.scrollOffset.set(newOffset);
                        }
                    },
                    disabled: Binding.derive(
                        [this.missions, this.scrollOffset],
                        (missions, offset) => {
                            const missionsPerPage = this.missionsPerRow * this.rowsPerPage;
                            const totalPages = Math.ceil(missions.length / missionsPerPage);
                            return offset >= totalPages - 1;
                        }
                    ) as any,
                    yOffset: sideMenuButtonDimensions.height + GAPS.buttons,
                },
            ],
            bottomButton: {
                label: 'Back',
                onClick: () => {
                    if (this.onBackCallback) {
                        this.onBackCallback();
                    }
                },
                disabled: false,
            },
            stats: this.stats,
        });
    }

    /**
     * Update the screen with new data
     */
    update(
        missions: MissionDisplay[],
        onMissionSelect: (missionId: string) => void,
        onBack: () => void,
        stats?: MenuStats
    ): void {
        this.missions.set(missions);
        if (stats) {
            this.stats.set(stats);
        }
        this.onMissionSelectCallback = onMissionSelect;
        this.onBackCallback = onBack;
    }

    /**
     * Set render callback (called when screen needs to re-render)
     */
    setRenderCallback(callback: () => void): void {
        this.renderCallback = callback;
    }

    /**
     * Cleanup
     */
    destroy(): void {
        // No animations to clean up
    }
}
