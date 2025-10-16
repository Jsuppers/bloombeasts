/**
 * Layout Helper for Web Platform
 * Provides convenient functions for positioning elements using shared layouts
 */

import { LAYOUTS } from '../../../../shared/styles/layouts';
import { DIMENSIONS, GAPS } from '../../../../shared/styles/dimensions';
import { LayoutCalculator, LayoutChild, CalculatedPosition } from './layoutCalculator';

/**
 * Get the content area bounds (excluding padding from a layout)
 */
export function getContentArea(layout: typeof LAYOUTS[keyof typeof LAYOUTS], containerX: number = 0, containerY: number = 0) {
  // Use type assertion to access optional properties safely
  const layoutAny = layout as any;
  const padding = layoutAny.padding || 0;
  const paddingTop = layoutAny.paddingTop ?? padding;
  const paddingBottom = layoutAny.paddingBottom ?? padding;
  const paddingLeft = layoutAny.paddingLeft ?? padding;
  const paddingRight = layoutAny.paddingRight ?? padding;

  return {
    x: containerX + paddingLeft,
    y: containerY + paddingTop,
    width: (layoutAny.width || DIMENSIONS.panel.width) - paddingLeft - paddingRight,
    height: (layoutAny.height || DIMENSIONS.panel.height) - paddingTop - paddingBottom,
  };
}

/**
 * Calculate positions for start menu elements
 */
export function calculateStartMenuLayout() {
  const layout = LAYOUTS.startMenu;
  const contentArea = getContentArea(layout);

  // Start menu has centered content with vertical button stack
  return {
    contentArea,
    // Helper for centering elements
    centerElement: (width: number, height: number) => {
      return {
        x: contentArea.x + (contentArea.width - width) / 2,
        y: contentArea.y + (contentArea.height - height) / 2,
      };
    },
  };
}

/**
 * Calculate positions for mission select screen elements
 */
export function calculateMissionSelectLayout() {
  const headerLayout = LAYOUTS.missionSelectHeader;
  const contentArea = getContentArea(LAYOUTS.missionSelectContainer);

  return {
    contentArea,
    // Header area
    header: {
      x: contentArea.x,
      y: contentArea.y,
      width: contentArea.width,
      height: 60, // Approximate header height
    },
    // Mission list area (below header)
    missionListStart: {
      x: contentArea.x,
      y: contentArea.y + 60 + ((headerLayout as any).marginBottom || DIMENSIONS.spacing.lg),
    },
  };
}

/**
 * Calculate positions for cards screen elements
 */
export function calculateCardsScreenLayout() {
  const headerLayout = LAYOUTS.cardsHeader;
  const contentArea = getContentArea(LAYOUTS.cardsContainer);

  return {
    contentArea,
    // Header area
    header: {
      x: contentArea.x,
      y: contentArea.y,
      width: contentArea.width,
      height: 60,
    },
    // Cards grid start position
    cardsGridStart: {
      x: contentArea.x,
      y: contentArea.y + 60 + ((headerLayout as any).marginBottom || DIMENSIONS.spacing.lg),
    },
    // Gap between cards
    cardGap: GAPS.cards,
  };
}

/**
 * Calculate vertical button list positions
 */
export function calculateVerticalButtonList(
  startX: number,
  startY: number,
  buttonCount: number,
  buttonHeight: number = DIMENSIONS.button.height
): CalculatedPosition[] {
  const children: LayoutChild[] = [];

  for (let i = 0; i < buttonCount; i++) {
    children.push({
      id: `button-${i}`,
      width: DIMENSIONS.button.minWidth,
      height: buttonHeight,
    });
  }

  return LayoutCalculator.calculateVerticalList(startX, startY, children, GAPS.buttons);
}

/**
 * Calculate horizontal button list positions
 */
export function calculateHorizontalButtonList(
  startX: number,
  startY: number,
  buttonCount: number,
  buttonWidth: number = DIMENSIONS.button.minWidth
): CalculatedPosition[] {
  const children: LayoutChild[] = [];

  for (let i = 0; i < buttonCount; i++) {
    children.push({
      id: `button-${i}`,
      width: buttonWidth,
      height: DIMENSIONS.button.height,
    });
  }

  return LayoutCalculator.calculateHorizontalList(startX, startY, children, GAPS.buttons);
}

/**
 * Calculate card grid positions
 */
export function calculateCardGrid(
  startX: number,
  startY: number,
  containerWidth: number,
  cardCount: number,
  cardWidth: number = DIMENSIONS.card.width,
  cardHeight: number = DIMENSIONS.card.height
): CalculatedPosition[] {
  const children: LayoutChild[] = [];

  for (let i = 0; i < cardCount; i++) {
    children.push({
      id: `card-${i}`,
      width: cardWidth,
      height: cardHeight,
    });
  }

  return LayoutCalculator.calculateGrid(startX, startY, containerWidth, children, GAPS.cards);
}

/**
 * Calculate mission card list positions
 */
export function calculateMissionList(
  startX: number,
  startY: number,
  missionCount: number,
  cardWidth: number,
  cardHeight: number
): CalculatedPosition[] {
  const children: LayoutChild[] = [];

  for (let i = 0; i < missionCount; i++) {
    children.push({
      id: `mission-${i}`,
      width: cardWidth,
      height: cardHeight,
    });
  }

  return LayoutCalculator.calculateVerticalList(startX, startY, children, GAPS.missions);
}

/**
 * Calculate centered dialog position
 */
export function calculateCenteredDialog(
  dialogWidth: number = DIMENSIONS.dialog.minWidth,
  dialogHeight: number = 300
) {
  return LayoutCalculator.centerElement(
    0,
    0,
    DIMENSIONS.panel.width,
    DIMENSIONS.panel.height,
    dialogWidth,
    dialogHeight
  );
}

/**
 * Calculate flexbox layout using shared layout styles
 */
export function calculateFlexLayout(
  layoutName: keyof typeof LAYOUTS,
  children: LayoutChild[],
  containerX: number = 0,
  containerY: number = 0,
  containerWidth?: number,
  containerHeight?: number
): CalculatedPosition[] {
  const layout = LAYOUTS[layoutName];
  const layoutAny = layout as any;

  return LayoutCalculator.calculateLayout(
    layout,
    containerX,
    containerY,
    containerWidth || layoutAny.width || DIMENSIONS.panel.width,
    containerHeight || layoutAny.height || DIMENSIONS.panel.height,
    children
  );
}

/**
 * Get spacing value by name
 */
export function getSpacing(name: keyof typeof DIMENSIONS.spacing): number {
  return DIMENSIONS.spacing[name];
}

/**
 * Get gap value by name
 */
export function getGap(name: keyof typeof GAPS): number {
  return GAPS[name];
}
