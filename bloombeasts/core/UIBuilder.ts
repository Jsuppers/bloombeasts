/**
 * UIBuilder - Creates the main UI tree structure
 *
 * Extracted from BloomBeastsGame to reduce its size and improve maintainability.
 * Handles UI tree creation with conditional screen rendering and popups.
 */

import { createMissionCompletePopup } from '../common/ui/screens/MissionCompletePopup';
import { createButtonPopup } from '../common/ui/screens/ButtonPopup';
import { createReactiveCardDetailPopupFromBinding } from '../common/ui/screens/CardDetailPopup';
import { BindingType } from '../common/ui/types/types/BindingManager';
import { gameDimensions } from '../screens/battle/ui';
import type { UIMethodMappings, UINode } from '../types';
import type { GameScreens } from './ScreenFactory';

export interface UIBuilderConfig {
  ui: UIMethodMappings;
  screens: GameScreens;
}

/**
 * Builds the main UI tree with conditional screen rendering
 */
export class UIBuilder {
  private ui: UIMethodMappings;
  private screens: GameScreens;

  constructor(config: UIBuilderConfig) {
    this.ui = config.ui;
    this.screens = config.screens;
  }

  /**
   * Create the main UI tree
   * This is created once and updated reactively via bindings
   */
  createUI(): UINode {
    const { View } = this.ui;

    // Build main UI with conditional screens
    const children: any[] = [
      this.ui.UINode ? this.ui.UINode.if( this.ui.bindingManager.derive([BindingType.CurrentScreen], (current: string) => current === 'loading'), this.createLoadingScreen()) : null,
      this.ui.UINode ? this.ui.UINode.if( this.ui.bindingManager.derive([BindingType.CurrentScreen], (current: string) => current === 'menu'), this.screens.menuScreen.createUI()) : null,
      this.ui.UINode ? this.ui.UINode.if( this.ui.bindingManager.derive([BindingType.CurrentScreen], (current: string) => current === 'cards'), this.screens.cardsScreen.createUI()) : null,
      this.ui.UINode ? this.ui.UINode.if( this.ui.bindingManager.derive([BindingType.CurrentScreen], (current: string) => current === 'upgrades'), this.screens.upgradeScreen.createUI()) : null,
      this.ui.UINode ? this.ui.UINode.if( this.ui.bindingManager.derive([BindingType.CurrentScreen], (current: string) => current === 'missions'), this.screens.missionScreen.createUI()) : null,
      this.ui.UINode ? this.ui.UINode.if( this.ui.bindingManager.derive([BindingType.CurrentScreen], (current: string) => current === 'battle'), this.screens.battleScreen.createUI()) : null,
      this.ui.UINode ? this.ui.UINode.if( this.ui.bindingManager.derive([BindingType.CurrentScreen], (current: string) => current === 'settings'), this.screens.settingsScreen.createUI()) : null,
      this.ui.UINode ? this.ui.UINode.if( this.ui.bindingManager.derive([BindingType.CurrentScreen], (current: string) => current === 'leaderboard'), this.screens.leaderboardScreen.createUI()) : null,
    ];

    // Add popups (these already use UINode.if)
    // Mission Complete Popup - static structure with derived content
    if (this.ui.UINode) {
      children.push(
        this.ui.UINode.if(
          this.ui.bindingManager.derive([BindingType.MissionCompletePopup], (props: any) => {
            return props !== null;
          }),
          createMissionCompletePopup(this.ui, this.ui.bindingManager)
        )
      );
    }

    // Forfeit Popup - static structure with derived content
    if (this.ui.UINode) {
      children.push(
        this.ui.UINode.if(
          this.ui.bindingManager.derive([BindingType.ForfeitPopup], (props: any) => {
            return props !== null;
          }),
          createButtonPopup(this.ui, this.ui.bindingManager)
        )
      );
    }

    // Card Detail Popup
    if (this.ui.UINode) {
      children.push(
        this.ui.UINode.if(
          this.ui.bindingManager.derive([BindingType.CardDetailPopup], (props: any) => {
            return props !== null;
          }),
          createReactiveCardDetailPopupFromBinding(this.ui)
        )
      );
    }

    return View({
      style: {
        width: '100%',
        height: '100%',
        position: 'relative',
      },
      children,
    });
  }

  /**
   * Create the loading screen UI
   */
  private createLoadingScreen(): UINode {
    const { View } = this.ui;

    return View({
      style: {
        flex: 1,
        backgroundColor: '#1a1a2e', // Dark background as fallback
      },
      children: [
        // Note: Background image removed since assets aren't loaded during initialization
        // The loading screen is only shown briefly before assets load anyway

        // Loading text centered
        View({
          style: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          },
          children: this.ui.Text({
            text: 'Loading...',
            style: {
              fontSize: 32,
              color: '#ffffff',
              fontWeight: 'bold',
              textShadowColor: '#000000',
              textShadowOffset: { width: 2, height: 2 },
              textShadowRadius: 4,
            }
          })
        })
      ]
    });
  }
}
