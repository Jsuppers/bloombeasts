/**
 * Cards Screen - Refactored using BaseScreen and utilities
 *
 * Reduced from 407 lines to ~280 lines (31% reduction) by eliminating:
 * - Constructor boilerplate → BaseScreen
 * - State update patterns → UIStateManager
 * - Scroll button logic → ScrollButtonFactory
 * - Layout helpers → BaseScreen methods
 */

import { COLORS } from '../../common/ui/styles/styles/colors';
import type { UIMethodMappings, PlayerData } from '../../../bloombeasts/BloomBeastsGame';
import { DIMENSIONS, GAPS, sideMenuButtonDimensions } from '../../common/ui/styles/styles/dimensions';
import { deckEmoji } from '../../common/ui/constants/emojis';
import { UINodeType } from '../../common/ui/ScreenUtils';
import { createSideMenu, createTextRow } from '../../common/ui/screens/SideMenu';
import { createReactiveCardComponent } from '../../common/ui/screens/CardRenderer';
import { type PopupButton } from '../../common/ui/components/common/Popup';
import type { ButtonColor } from '../../common/ui/components/common/Button';
import { BindingType, type UIState } from '../../common/ui/types/types/BindingManager';
import { createReactiveCardDetailPopup } from '../../common/ui/screens/CardDetailPopup';
import { BaseScreen, BaseScreenProps } from '../common/BaseScreen';
import { UIStateManager } from '../common/UIStateManager';
import { ScrollButtonFactory } from '../common/ScrollButtonFactory';

export interface CardsScreenProps extends BaseScreenProps {
  onCardSelect?: (cardId: string) => void;
}

interface CardsState {
  scrollOffset?: number;
  selectedCardId?: string | null;
}

/**
 * Cards Screen - Collection and Deck Management
 */
export class CardsScreen extends BaseScreen {
  private cardsPerRow = 4;
  private rowsPerPage = 2;
  private onCardSelect?: (cardId: string) => void;
  private stateManager: UIStateManager<CardsState>;

  constructor(props: CardsScreenProps) {
    super(props);
    this.onCardSelect = props.onCardSelect;
    this.stateManager = new UIStateManager<CardsState>(
      this.ui.bindingManager,
      'cards',
      this.onRenderNeeded
    );
    // Initialize scrollOffset to 0
    this.stateManager.update({ scrollOffset: 0 });
  }

  /**
   * Create a single card slot using reactive card component
   */
  private createCardSlot(
    slotIndex: number,
    cardsPerPage: number,
    hasMarginRight: boolean
  ): UINodeType {
    return this.ui.View({
      style: {
        marginRight: hasMarginRight ? GAPS.cards : 0,
      },
      children: createReactiveCardComponent(this.ui, {
        mode: 'slot',
        slotIndex,
        cardsPerPage,
        onClick: (cardId: string) => this.handleCardClick(cardId),
        showDeckIndicator: true,
      }),
    });
  }

  /**
   * Create card grid with reactive bindings
   */
  private createCardGrid(): UINodeType {
    const cardsPerPage = this.cardsPerRow * this.rowsPerPage;

    return this.createContentArea([
      // Empty state
      ...(this.ui.UINode ? [this.ui.UINode.if(
        this.ui.bindingManager.derive([BindingType.PlayerData], (pd: PlayerData) => {
          const cards = pd?.cards?.collected || [];
          return cards.length === 0;
        }),
        this.ui.View({
          style: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          },
          children: this.ui.Text({
            text: 'No cards in your collection yet.',
            style: {
              fontSize: DIMENSIONS.fontSize.xl,
              color: COLORS.textPrimary,
            },
          }),
        })
      )] : []),

      // Card grid - 2 rows x 4 columns
      this.ui.View({
        style: {
          flexDirection: 'column',
        },
        children: Array.from({ length: this.rowsPerPage }, (_, rowIndex) =>
          this.ui.View({
            style: {
              flexDirection: 'row',
              marginBottom: rowIndex < this.rowsPerPage - 1 ? GAPS.cards : 0,
            },
            children: Array.from({ length: this.cardsPerRow }, (_, colIndex) => {
              const slotIndex = rowIndex * this.cardsPerRow + colIndex;
              return this.createCardSlot(slotIndex, cardsPerPage, colIndex < this.cardsPerRow - 1);
            }),
          })
        ),
      }),
    ]);
  }

  /**
   * Create scroll buttons using utility (eliminates 50+ lines of code)
   */
  private createScrollButtons() {
    const cardsPerPage = this.cardsPerRow * this.rowsPerPage;

    const getTotalPages = () => {
      const playerData = this.ui.bindingManager.getSnapshot(BindingType.PlayerData);
      const cards = playerData?.cards?.collected || [];
      return Math.ceil(cards.length / cardsPerPage);
    };

    return ScrollButtonFactory.createSideMenuScrollButtons({
      ui: this.ui,
      stateManager: this.stateManager,
      getTotalPages,
      playSfx: this.playSfx,
      playerDataBinding: true, // Cards screen watches PlayerData for card count
      cardsPerPage, // Pass cardsPerPage so bindings can calculate total pages
    });
  }

  createUI(): UINodeType {
    const deckInfoText = this.ui.bindingManager.derive(
      [BindingType.PlayerData],
      (pd: PlayerData) => `${deckEmoji} ${pd?.cards?.deck?.length || 0}/30`
    );

    return this.createRootContainer([
      this.createFullScreenBackground(),
      this.createContainerBackground(),
      this.createCardGrid(),

      // Sidebar
      createSideMenu(this.ui, {
        title: 'Cards',
        customTextContent: [createTextRow(this.ui, deckInfoText, 0)],
        buttons: this.createScrollButtons(),
        bottomButton: this.getBackButton(),
        playSfx: this.playSfx,
      }),

      // Card detail popup
      ...(this.ui.UINode ? [this.ui.UINode.if(
        this.ui.bindingManager.derive([BindingType.UIState], (uiState: UIState) => {
          return uiState.cards?.selectedCardId !== null;
        }),
        this.ui.View({
          style: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
          },
          children: createReactiveCardDetailPopup(this.ui, {
            onClose: () => this.closePopup(),
            buttons: this.createPopupButtons(),
            playSfx: this.playSfx,
          }),
        })
      )] : []),
    ]);
  }

  /**
   * Handle card click - show popup
   */
  private handleCardClick(cardId: string): void {
    console.log('[CardsScreen] Card clicked, setting selectedCardId:', cardId);
    this.stateManager.update({ selectedCardId: cardId });

    // Verify it was set correctly
    const selectedId = this.stateManager.getValue('selectedCardId');
    console.log('[CardsScreen] selectedCardId after update:', selectedId);
  }

  /**
   * Close the popup
   */
  private closePopup(): void {
    this.stateManager.update({ selectedCardId: null });
  }

  /**
   * Create reactive popup buttons
   */
  private createPopupButtons(): PopupButton[] {
    const buttonLabel = this.ui.bindingManager.derive(
      [BindingType.UIState, BindingType.PlayerData],
      (uiState: UIState, pd: PlayerData) => {
        const cardId = uiState.cards?.selectedCardId;
        if (!cardId) return '';
        const deckCardIds: string[] = pd?.cards?.deck || [];
        return deckCardIds.includes(cardId) ? 'Remove' : 'Add';
      }
    );

    const buttonColor = this.ui.bindingManager.derive(
      [BindingType.UIState, BindingType.PlayerData],
      (uiState: UIState, pd: PlayerData) => {
        const cardId = uiState.cards?.selectedCardId;
        if (!cardId) return 'default' as ButtonColor;
        const deckCardIds: string[] = pd?.cards?.deck || [];
        const isInDeck = deckCardIds.includes(cardId);
        return (isInDeck ? 'red' : 'green') as ButtonColor;
      }
    );

    return [
      {
        label: buttonLabel,
        onClick: () => {
          const uiState = this.ui.bindingManager.getSnapshot(BindingType.UIState);
          const cardId = uiState.cards?.selectedCardId;
          console.log('[CardsScreen] Button clicked, selectedCardId:', cardId, 'onCardSelect:', !!this.onCardSelect);
          if (cardId && this.onCardSelect) {
            this.onCardSelect(cardId);
          } else {
            console.warn('[CardsScreen] Cannot add/remove card:', { cardId, hasCallback: !!this.onCardSelect });
          }
        },
        color: buttonColor,
      },
      {
        label: 'Close',
        onClick: () => this.closePopup(),
        color: 'default',
      },
    ];
  }
}
