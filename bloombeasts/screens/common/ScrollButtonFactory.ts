/**
 * ScrollButtonFactory - Eliminates scroll button duplication
 *
 * Replaces 110+ lines of duplicate scroll logic in CardsScreen and MissionScreen
 * with a simple factory function.
 */

import type { UIMethodMappings } from '../../types/ui/UIMethodMappings';
import { UINodeType } from '../../common/ui/ScreenUtils';
import { BindingManager, BindingType } from '../../common/ui/types/types/BindingManager';
import { UIStateManager } from './UIStateManager';
import type { SideMenuButton } from '../../common/ui/screens/SideMenu';
import { createButton } from '../../common/ui/components/common/Button';
import { COLORS } from '../../common/ui/styles/styles/colors';
import { sideMenuButtonDimensions, GAPS } from '../../common/ui/styles/styles/dimensions';

export interface ScrollButtonConfig {
  ui: UIMethodMappings;
  stateManager: UIStateManager<{ scrollOffset?: number }>;
  getTotalPages: () => number;
  playSfx?: (sfxId: string) => void;
  position?: {
    prevLeft?: number;
    prevTop?: number;
    nextLeft?: number;
    nextTop?: number;
    width?: number;
    height?: number;
  };
}

export class ScrollButtonFactory {
  /**
   * Create Previous and Next scroll buttons with all bindings
   */
  static createScrollButtons(config: ScrollButtonConfig): UINodeType[] {
    const {
      ui,
      stateManager,
      getTotalPages,
      playSfx,
      position = {},
    } = config;

    const {
      prevLeft = 40,
      prevTop = 600,
      nextLeft = 940,
      nextTop = 600,
      width = 80,
      height = 60,
    } = position;

    const getCurrentOffset = () => stateManager.getValue('scrollOffset') ?? 0;

    // Previous button
    const prevButton = createButton({
      ui,
      label: ui.bindingManager.derive(
        [BindingType.UIState],
        () => {
          const offset = getCurrentOffset();
          return offset > 0 ? '<' : '';
        }
      ),
      onClick: () => {
        const offset = getCurrentOffset();
        if (offset > 0) {
          playSfx?.('sfx-menu-button-select');
          stateManager.update({ scrollOffset: offset - 1 });
        }
      },
      disabled: ui.bindingManager.derive(
        [BindingType.UIState],
        () => getCurrentOffset() === 0
      ),
      style: {
        position: 'absolute',
        left: prevLeft,
        top: prevTop,
        width,
        height,
        fontSize: 24,
        opacity: ui.bindingManager.derive(
          [BindingType.UIState],
          () => getCurrentOffset() === 0 ? 0.5 : 1.0
        ),
        textColor: ui.bindingManager.derive(
          [BindingType.UIState],
          () => getCurrentOffset() === 0 ? '#888' : '#fff'
        ),
      },
    });

    // Next button
    const nextButton = createButton({
      ui,
      label: ui.bindingManager.derive(
        [BindingType.UIState],
        () => {
          const offset = getCurrentOffset();
          const totalPages = getTotalPages();
          return offset < totalPages - 1 ? '>' : '';
        }
      ),
      onClick: () => {
        const offset = getCurrentOffset();
        const totalPages = getTotalPages();
        if (offset < totalPages - 1) {
          playSfx?.('sfx-menu-button-select');
          stateManager.update({ scrollOffset: offset + 1 });
        }
      },
      disabled: ui.bindingManager.derive(
        [BindingType.UIState],
        () => {
          const offset = getCurrentOffset();
          const totalPages = getTotalPages();
          return offset >= totalPages - 1;
        }
      ),
      style: {
        position: 'absolute',
        left: nextLeft,
        top: nextTop,
        width,
        height,
        fontSize: 24,
        opacity: ui.bindingManager.derive(
          [BindingType.UIState],
          () => {
            const offset = getCurrentOffset();
            const totalPages = getTotalPages();
            return offset >= totalPages - 1 ? 0.5 : 1.0;
          }
        ),
        textColor: ui.bindingManager.derive(
          [BindingType.UIState],
          () => {
            const offset = getCurrentOffset();
            const totalPages = getTotalPages();
            return offset >= totalPages - 1 ? '#888' : '#fff';
          }
        ),
      },
    });

    return [prevButton, nextButton];
  }

  /**
   * Calculate pagination info for displaying "Page X of Y"
   */
  static createPageInfo(config: {
    ui: UIMethodMappings;
    stateManager: UIStateManager<{ scrollOffset?: number }>;
    getTotalPages: () => number;
    position?: { left?: number; top?: number };
    fontSize?: number;
    color?: string;
  }): UINodeType {
    const {
      ui,
      stateManager,
      getTotalPages,
      position = {},
      fontSize = 16,
      color = '#fff',
    } = config;

    const { left = 500, top = 615 } = position;

    return ui.Text({
      text: ui.bindingManager.derive(
        [BindingType.UIState],
        () => {
          const offset = stateManager.getValue('scrollOffset') ?? 0;
          const totalPages = getTotalPages();
          return totalPages > 0 ? `Page ${offset + 1} of ${totalPages}` : '';
        }
      ),
      style: {
        position: 'absolute',
        left,
        top,
        fontSize,
        color,
        textAlign: 'center',
      },
    });
  }

  /**
   * Create Previous and Next scroll buttons for side menu
   * Eliminates 100+ lines of duplicate code in CardsScreen and MissionScreen
   */
  static createSideMenuScrollButtons(config: {
    ui: UIMethodMappings;
    stateManager: UIStateManager<{ scrollOffset?: number }>;
    getTotalPages: () => number;
    playSfx?: (sfxId: string) => void;
    playerDataBinding?: boolean; // Whether to watch PlayerData binding for total pages
    cardsPerPage?: number; // For calculating total pages from binding data
  }): SideMenuButton[] {
    const {
      ui,
      stateManager,
      getTotalPages,
      playSfx,
      playerDataBinding = false,
      cardsPerPage = 8,
    } = config;

    const getCurrentOffset = () => stateManager.getValue('scrollOffset') ?? 0;
    const screenKey = stateManager.stateKey;

    // Determine which bindings to watch based on content type
    const bindings = playerDataBinding
      ? [BindingType.UIState, BindingType.PlayerData]
      : [BindingType.UIState, BindingType.Missions];

    // Helper to calculate total pages from binding data instead of snapshot
    const calculateTotalPages = (data: any): number => {
      if (playerDataBinding) {
        const cards = data?.cards?.collected || [];
        return Math.ceil(cards.length / cardsPerPage);
      } else {
        // For missions, getTotalPages from config works fine
        return getTotalPages();
      }
    };

    return [
      {
        label: 'Previous',
        onClick: () => {
          const offset = getCurrentOffset();
          if (offset > 0) {
            playSfx?.('sfx-menu-button-select');
            stateManager.update({ scrollOffset: offset - 1 });
          }
        },
        disabled: ui.bindingManager.derive([BindingType.UIState], (uiState: any) => {
          const offset = uiState?.[screenKey]?.scrollOffset ?? 0;
          return offset <= 0;
        }),
        opacity: ui.bindingManager.derive([BindingType.UIState], (uiState: any) => {
          const offset = uiState?.[screenKey]?.scrollOffset ?? 0;
          return offset <= 0 ? 0.5 : 1.0;
        }),
        textColor: ui.bindingManager.derive([BindingType.UIState], (uiState: any) => {
          const offset = uiState?.[screenKey]?.scrollOffset ?? 0;
          return offset <= 0 ? COLORS.textMuted : COLORS.textPrimary;
        }),
        yOffset: 0,
      },
      {
        label: 'Next',
        onClick: () => {
          const offset = getCurrentOffset();
          const totalPages = getTotalPages();
          if (offset < totalPages - 1) {
            playSfx?.('sfx-menu-button-select');
            stateManager.update({ scrollOffset: offset + 1 });
          }
        },
        disabled: ui.bindingManager.derive(bindings, (uiState: any, otherData: any) => {
          const offset = uiState?.[screenKey]?.scrollOffset ?? 0;
          // Use binding value instead of snapshot for total pages calculation
          const totalPages = calculateTotalPages(otherData);
          return offset >= totalPages - 1;
        }),
        opacity: ui.bindingManager.derive(bindings, (uiState: any, otherData: any) => {
          const offset = uiState?.[screenKey]?.scrollOffset ?? 0;
          const totalPages = calculateTotalPages(otherData);
          return offset >= totalPages - 1 ? 0.5 : 1.0;
        }),
        textColor: ui.bindingManager.derive(bindings, (uiState: any, otherData: any) => {
          const offset = uiState?.[screenKey]?.scrollOffset ?? 0;
          const totalPages = calculateTotalPages(otherData);
          return offset >= totalPages - 1 ? COLORS.textMuted : COLORS.textPrimary;
        }),
        yOffset: sideMenuButtonDimensions.height + GAPS.buttons,
      },
    ];
  }
}
