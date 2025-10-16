/**
 * Flexbox to Canvas Layout Calculator
 * Converts flexbox-style layout definitions to Canvas x/y positions
 * Allows Web platform to use the same layout system as Horizon platform
 */

import type { LayoutStyle } from '../../../../shared/styles/layouts';

export interface LayoutChild {
  id: string;
  width: number;
  height: number;
  flex?: number;
  style?: LayoutStyle;
}

export interface CalculatedPosition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export class LayoutCalculator {
  /**
   * Calculate positions for children within a container using flexbox rules
   */
  static calculateLayout(
    containerStyle: LayoutStyle,
    containerX: number,
    containerY: number,
    containerWidth: number,
    containerHeight: number,
    children: LayoutChild[]
  ): CalculatedPosition[] {
    if (children.length === 0) {
      return [];
    }

    // Extract container properties
    const flexDirection = containerStyle.flexDirection || 'row';
    const justifyContent = containerStyle.justifyContent || 'flex-start';
    const alignItems = containerStyle.alignItems || 'stretch';
    const gap = containerStyle.gap || 0;
    const padding = containerStyle.padding || 0;
    const paddingTop = containerStyle.paddingTop ?? padding;
    const paddingBottom = containerStyle.paddingBottom ?? padding;
    const paddingLeft = containerStyle.paddingLeft ?? padding;
    const paddingRight = containerStyle.paddingRight ?? padding;

    // Calculate available space
    const availableWidth = containerWidth - paddingLeft - paddingRight;
    const availableHeight = containerHeight - paddingTop - paddingBottom;

    // Determine main and cross axis
    const isRow = flexDirection === 'row' || flexDirection === 'row-reverse';
    const mainSize = isRow ? availableWidth : availableHeight;
    const crossSize = isRow ? availableHeight : availableWidth;

    // Calculate flex basis and determine which children have flex
    const flexChildren: Array<{ child: LayoutChild; index: number }> = [];
    let totalFlexGrow = 0;
    let usedMainSize = 0;

    children.forEach((child, index) => {
      if (child.flex) {
        flexChildren.push({ child, index });
        totalFlexGrow += child.flex;
      } else {
        const childMainSize = isRow ? child.width : child.height;
        usedMainSize += childMainSize;
      }
    });

    // Add gaps to used space
    usedMainSize += gap * (children.length - 1);

    // Calculate flex space
    const flexSpace = Math.max(0, mainSize - usedMainSize);
    const flexUnit = totalFlexGrow > 0 ? flexSpace / totalFlexGrow : 0;

    // Assign flex sizes
    const childSizes: Array<{ mainSize: number; crossSize: number }> = children.map((child, index) => {
      if (child.flex) {
        const mainSize = child.flex * flexUnit;
        return {
          mainSize,
          crossSize: isRow ? child.height : child.width,
        };
      } else {
        return {
          mainSize: isRow ? child.width : child.height,
          crossSize: isRow ? child.height : child.width,
        };
      }
    });

    // Calculate main axis positions based on justifyContent
    const mainPositions = this.calculateMainAxisPositions(
      mainSize,
      childSizes.map((s) => s.mainSize),
      gap,
      justifyContent
    );

    // Calculate cross axis positions based on alignItems
    const crossPositions = childSizes.map((size, index) => {
      const child = children[index];
      const alignSelf = child.style?.alignSelf || alignItems;
      return this.calculateCrossAxisPosition(crossSize, size.crossSize, alignSelf);
    });

    // Convert to absolute positions
    const positions: CalculatedPosition[] = children.map((child, index) => {
      const mainPos = mainPositions[index];
      const crossPos = crossPositions[index];
      const size = childSizes[index];

      let x: number, y: number, width: number, height: number;

      if (isRow) {
        if (flexDirection === 'row-reverse') {
          x = containerX + paddingLeft + (mainSize - mainPos - size.mainSize);
        } else {
          x = containerX + paddingLeft + mainPos;
        }
        y = containerY + paddingTop + crossPos;
        width = size.mainSize;
        height = size.crossSize;
      } else {
        x = containerX + paddingLeft + crossPos;
        if (flexDirection === 'column-reverse') {
          y = containerY + paddingTop + (mainSize - mainPos - size.mainSize);
        } else {
          y = containerY + paddingTop + mainPos;
        }
        width = size.crossSize;
        height = size.mainSize;
      }

      return {
        id: child.id,
        x: Math.round(x),
        y: Math.round(y),
        width: Math.round(width),
        height: Math.round(height),
      };
    });

    return positions;
  }

  /**
   * Calculate positions along the main axis based on justifyContent
   */
  private static calculateMainAxisPositions(
    containerSize: number,
    childSizes: number[],
    gap: number,
    justifyContent: string
  ): number[] {
    const totalChildSize = childSizes.reduce((sum, size) => sum + size, 0);
    const totalGap = gap * (childSizes.length - 1);
    const freeSpace = containerSize - totalChildSize - totalGap;

    const positions: number[] = [];
    let currentPos = 0;

    switch (justifyContent) {
      case 'flex-start':
        childSizes.forEach((size, index) => {
          positions.push(currentPos);
          currentPos += size + gap;
        });
        break;

      case 'flex-end':
        currentPos = freeSpace;
        childSizes.forEach((size, index) => {
          positions.push(currentPos);
          currentPos += size + gap;
        });
        break;

      case 'center':
        currentPos = freeSpace / 2;
        childSizes.forEach((size, index) => {
          positions.push(currentPos);
          currentPos += size + gap;
        });
        break;

      case 'space-between':
        if (childSizes.length === 1) {
          positions.push(0);
        } else {
          const spaceBetween = freeSpace / (childSizes.length - 1);
          childSizes.forEach((size, index) => {
            positions.push(currentPos);
            currentPos += size + gap + spaceBetween;
          });
        }
        break;

      case 'space-around':
        const spaceAround = freeSpace / childSizes.length;
        currentPos = spaceAround / 2;
        childSizes.forEach((size, index) => {
          positions.push(currentPos);
          currentPos += size + gap + spaceAround;
        });
        break;

      case 'space-evenly':
        const spaceEvenly = freeSpace / (childSizes.length + 1);
        currentPos = spaceEvenly;
        childSizes.forEach((size, index) => {
          positions.push(currentPos);
          currentPos += size + gap + spaceEvenly;
        });
        break;

      default:
        // Default to flex-start
        childSizes.forEach((size, index) => {
          positions.push(currentPos);
          currentPos += size + gap;
        });
    }

    return positions;
  }

  /**
   * Calculate position along the cross axis based on alignItems/alignSelf
   */
  private static calculateCrossAxisPosition(
    containerSize: number,
    childSize: number,
    align: string
  ): number {
    switch (align) {
      case 'flex-start':
      case 'auto':
        return 0;

      case 'flex-end':
        return containerSize - childSize;

      case 'center':
        return (containerSize - childSize) / 2;

      case 'stretch':
        // For stretch, the child should fill the container
        // But since we're calculating position, return 0
        // (The caller should handle stretching the size)
        return 0;

      case 'baseline':
        // Baseline alignment is complex, default to flex-start
        return 0;

      default:
        return 0;
    }
  }

  /**
   * Helper: Calculate layout for a simple vertical list
   */
  static calculateVerticalList(
    startX: number,
    startY: number,
    children: Array<{ id: string; width: number; height: number }>,
    gap: number = 0
  ): CalculatedPosition[] {
    const positions: CalculatedPosition[] = [];
    let currentY = startY;

    children.forEach((child) => {
      positions.push({
        id: child.id,
        x: startX,
        y: currentY,
        width: child.width,
        height: child.height,
      });
      currentY += child.height + gap;
    });

    return positions;
  }

  /**
   * Helper: Calculate layout for a simple horizontal list
   */
  static calculateHorizontalList(
    startX: number,
    startY: number,
    children: Array<{ id: string; width: number; height: number }>,
    gap: number = 0
  ): CalculatedPosition[] {
    const positions: CalculatedPosition[] = [];
    let currentX = startX;

    children.forEach((child) => {
      positions.push({
        id: child.id,
        x: currentX,
        y: startY,
        width: child.width,
        height: child.height,
      });
      currentX += child.width + gap;
    });

    return positions;
  }

  /**
   * Helper: Calculate layout for a grid
   */
  static calculateGrid(
    startX: number,
    startY: number,
    containerWidth: number,
    children: Array<{ id: string; width: number; height: number }>,
    gap: number = 0
  ): CalculatedPosition[] {
    const positions: CalculatedPosition[] = [];
    let currentX = startX;
    let currentY = startY;
    let maxHeightInRow = 0;

    children.forEach((child) => {
      // Check if we need to wrap to next row
      if (currentX > startX && currentX + child.width > startX + containerWidth) {
        currentX = startX;
        currentY += maxHeightInRow + gap;
        maxHeightInRow = 0;
      }

      positions.push({
        id: child.id,
        x: currentX,
        y: currentY,
        width: child.width,
        height: child.height,
      });

      currentX += child.width + gap;
      maxHeightInRow = Math.max(maxHeightInRow, child.height);
    });

    return positions;
  }

  /**
   * Helper: Center a single element within a container
   */
  static centerElement(
    containerX: number,
    containerY: number,
    containerWidth: number,
    containerHeight: number,
    elementWidth: number,
    elementHeight: number
  ): { x: number; y: number } {
    return {
      x: containerX + (containerWidth - elementWidth) / 2,
      y: containerY + (containerHeight - elementHeight) / 2,
    };
  }
}
