/**
 * Battle Screen - Web platform adapter for unified BattleScreen component
 * Uses the comprehensive BattleScreen implementation from bloombeasts/ui/screens/BattleScreen.ts
 */

// Import from unified BloomBeasts UI system
import { UINode, Binding } from '../ui';
import { BattleScreen } from '../../../../bloombeasts/ui/screens/BattleScreen';
import type { BattleDisplay } from '../../../../bloombeasts/gameManager';

export class BattleScreenNew {
    // State bindings
    private battleState: Binding<BattleDisplay | null> = new Binding(null);

    // Unified battle screen instance
    private battleScreen: BattleScreen | null = null;

    // Callbacks
    private onActionCallback: ((action: string) => void) | null = null;
    private renderNeeded = false;

    /**
     * Create the battle UI using the unified BattleScreen
     */
    createUI(): UINode {
        console.log('[BattleScreenNew] createUI called');
        const state = this.battleState.get();
        console.log('[BattleScreenNew] Current state:', state ? 'Present' : 'Null', 'turnPlayer:', state?.turnPlayer);

        // Create the unified battle screen ONCE and reuse it
        if (!this.battleScreen) {
            console.log('[BattleScreenNew] Creating new BattleScreen instance');
            this.battleScreen = new BattleScreen({
                battleDisplay: this.battleState, // Pass as battleDisplay for full battle mode
                onAction: (action) => {
                    console.log('[BattleScreenNew] Action:', action);
                    if (this.onActionCallback) {
                        this.onActionCallback(action);
                    }
                },
                onNavigate: (screen) => {
                    console.log('[BattleScreenNew] Navigate:', screen);
                    // Handle navigation if needed
                    if (this.onActionCallback) {
                        if (screen === 'menu' || screen === 'missions') {
                            this.onActionCallback('btn-back');
                        }
                    }
                },
                onRenderNeeded: () => {
                    // Flag that render is needed
                    this.renderNeeded = true;
                    // In web platform, we might need to trigger a re-render
                    // This will be handled by the platform's render loop
                    console.log('[BattleScreenNew] Render needed');

                    // For production mode, we need to tell the platform to re-render
                    // This is a temporary solution - ideally the platform would have a render loop
                    if (typeof (window as any).renderCurrentScreen === 'function') {
                        (window as any).renderCurrentScreen();
                    }
                }
            });
        } else {
            console.log('[BattleScreenNew] Reusing existing BattleScreen instance');
        }

        console.log('[BattleScreenNew] Creating battle UI from BattleScreen...');
        try {
            const ui = this.battleScreen.createUI();
            console.log('[BattleScreenNew] Battle UI created:', ui ? 'Success' : 'Failed');
            return ui;
        } catch (error) {
            console.error('[BattleScreenNew] Error creating battle UI:', error);
            throw error;
        }
    }

    /**
     * Update battle state
     */
    update(state: BattleDisplay, onAction: (action: string) => void): void {
        console.log('[BattleScreenNew] ==========================================');
        console.log('[BattleScreenNew] UPDATE() called with battle state:');
        console.log('[BattleScreenNew] turnPlayer:', state.turnPlayer);
        console.log('[BattleScreenNew] currentTurn:', state.currentTurn);
        console.log('[BattleScreenNew] playerHealth:', state.playerHealth);
        console.log('[BattleScreenNew] opponentHealth:', state.opponentHealth);
        console.log('[BattleScreenNew] ==========================================');

        // Update the battle state binding
        console.log('[BattleScreenNew] Setting this.battleState binding...');
        this.battleState.set(state);
        console.log('[BattleScreenNew] this.battleState.get():', this.battleState.get());

        // Store the action callback
        this.onActionCallback = onAction;

        // If we have a battle screen instance, it will automatically re-render
        // due to the binding update, but we may need to recreate the UI
        if (this.renderNeeded && this.battleScreen) {
            this.renderNeeded = false;
            // The platform will call createUI again to get the updated UI
        }
    }

    /**
     * Check if render is needed
     */
    needsRender(): boolean {
        return this.renderNeeded;
    }

    /**
     * Clear render flag
     */
    clearRenderFlag(): void {
        this.renderNeeded = false;
    }

    /**
     * Cleanup
     */
    destroy(): void {
        // Cleanup battle screen
        if (this.battleScreen) {
            this.battleScreen.cleanup();
            this.battleScreen = null;
        }

        // Clear state
        this.battleState.set(null);
        this.onActionCallback = null;
        this.renderNeeded = false;
    }

    /**
     * Cleanup method for compatibility with old API
     */
    cleanup(): void {
        this.destroy();
    }
}