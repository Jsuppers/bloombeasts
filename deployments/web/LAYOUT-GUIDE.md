# Web Platform Layout Guide

This guide explains how to use shared layouts from `shared/styles/layouts.ts` in the Web platform's Canvas rendering.

## Overview

The Web platform now uses the same layout system as the Horizon platform through:
- **Layout Calculator** (`utils/layoutCalculator.ts`) - Converts flexbox layouts to Canvas x/y positions
- **Layout Helper** (`utils/layoutHelper.ts`) - Provides convenient functions for common layouts
- **Shared Layouts** (`shared/styles/layouts.ts`) - Platform-agnostic layout definitions

## Quick Start

### Example 1: Vertical Button List

```typescript
import { calculateVerticalButtonList } from './utils/layoutHelper';
import { DIMENSIONS } from '../../../shared/styles/dimensions';

// Calculate positions for 3 buttons
const buttonPositions = calculateVerticalButtonList(100, 200, 3);

// Render buttons at calculated positions
buttonPositions.forEach((pos, index) => {
  renderer.drawButton(`Button ${index}`, pos.x, pos.y, pos.width, pos.height);
});
```

### Example 2: Card Grid

```typescript
import { calculateCardGrid } from './utils/layoutHelper';
import { standardCardDimensions } from '../../../shared/constants/dimensions';

// Calculate grid positions for 10 cards
const cardPositions = calculateCardGrid(
  50,  // startX
  100, // startY
  800, // container width
  10   // number of cards
);

// Render cards at calculated positions
cards.forEach((card, index) => {
  const pos = cardPositions[index];
  renderer.drawBeastCard(pos.x, pos.y, card, ...);
});
```

### Example 3: Centered Dialog

```typescript
import { calculateCenteredDialog } from './utils/layoutHelper';

// Calculate centered position for dialog
const dialogPos = calculateCenteredDialog(400, 300);

// Draw dialog at centered position
renderer.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
renderer.ctx.fillRect(0, 0, DIMENSIONS.panel.width, DIMENSIONS.panel.height);
renderer.drawDialogBox(dialogPos.x, dialogPos.y, 400, 300);
```

### Example 4: Using Shared Layouts Directly

```typescript
import { calculateFlexLayout } from './utils/layoutHelper';
import { LAYOUTS } from '../../../shared/styles/layouts';
import { LayoutChild } from './utils/layoutCalculator';

// Define children with their dimensions
const children: LayoutChild[] = [
  { id: 'header', width: 800, height: 60 },
  { id: 'content', width: 800, height: 400, flex: 1 },
  { id: 'footer', width: 800, height: 40 },
];

// Calculate using the shared mission select layout
const positions = calculateFlexLayout('missionSelectContainer', children);

// positions now contains x, y, width, height for each child
positions.forEach(pos => {
  console.log(`${pos.id}: x=${pos.x}, y=${pos.y}`);
});
```

## Layout Calculator API

### `LayoutCalculator.calculateLayout()`

The core function that converts flexbox layouts to Canvas positions:

```typescript
const positions = LayoutCalculator.calculateLayout(
  containerStyle,  // LayoutStyle (flexDirection, justifyContent, etc.)
  containerX,      // Container x position
  containerY,      // Container y position
  containerWidth,  // Container width
  containerHeight, // Container height
  children         // Array of LayoutChild
);
```

**Supported flexbox properties:**
- `flexDirection`: 'row' | 'column' | 'row-reverse' | 'column-reverse'
- `justifyContent`: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly'
- `alignItems`: 'flex-start' | 'flex-end' | 'center' | 'stretch'
- `gap`: spacing between children
- `padding`: container padding (or paddingTop, paddingBottom, paddingLeft, paddingRight)

### Helper Functions

#### `calculateVerticalList()`
```typescript
LayoutCalculator.calculateVerticalList(startX, startY, children, gap)
```
Positions children in a vertical list with optional gap.

#### `calculateHorizontalList()`
```typescript
LayoutCalculator.calculateHorizontalList(startX, startY, children, gap)
```
Positions children in a horizontal list with optional gap.

#### `calculateGrid()`
```typescript
LayoutCalculator.calculateGrid(startX, startY, containerWidth, children, gap)
```
Positions children in a grid that wraps to the next row when width is exceeded.

#### `centerElement()`
```typescript
LayoutCalculator.centerElement(
  containerX, containerY, containerWidth, containerHeight,
  elementWidth, elementHeight
)
```
Calculates centered position for an element within a container.

## Layout Helper API

The layout helper provides screen-specific layout calculations:

### `calculateStartMenuLayout()`
Returns layout info for the start menu screen.

### `calculateMissionSelectLayout()`
Returns layout info for the mission select screen with header and content areas.

### `calculateCardsScreenLayout()`
Returns layout info for the cards screen with header and grid areas.

### `getContentArea()`
```typescript
const area = getContentArea(LAYOUTS.missionSelectContainer);
// area = { x, y, width, height }
```
Gets the content area of a layout (excluding padding).

## Shared Constants

All platforms now use:
- **Colors** from `shared/styles/colors.ts`
- **Dimensions** from `shared/styles/dimensions.ts`
- **Layouts** from `shared/styles/layouts.ts`
- **Gaps** from `shared/styles/dimensions.ts`

Example:
```typescript
import { COLORS } from '../../../shared/styles/colors';
import { DIMENSIONS, GAPS } from '../../../shared/styles/dimensions';
import { LAYOUTS } from '../../../shared/styles/layouts';

// Use shared colors
renderer.ctx.fillStyle = COLORS.primary;

// Use shared dimensions
const buttonWidth = DIMENSIONS.button.minWidth;
const buttonHeight = DIMENSIONS.button.height;

// Use shared gaps
const cardSpacing = GAPS.cards;
```

## Migration Guide

To migrate existing Canvas screens to use shared layouts:

1. **Import utilities:**
   ```typescript
   import { calculateFlexLayout } from './utils/layoutHelper';
   import { LAYOUTS } from '../../../shared/styles/layouts';
   ```

2. **Replace hardcoded positions:**
   ```typescript
   // Before:
   const buttonX = 100;
   const buttonY = 200;

   // After:
   const layout = calculateStartMenuLayout();
   const centered = layout.centerElement(buttonWidth, buttonHeight);
   ```

3. **Use shared dimensions:**
   ```typescript
   // Before:
   const spacing = 15;

   // After:
   const spacing = GAPS.buttons;
   ```

4. **Use shared colors:**
   ```typescript
   // Before:
   renderer.ctx.fillStyle = '#3498db';

   // After:
   renderer.ctx.fillStyle = COLORS.buttonPrimary;
   ```

## Benefits

- ✅ **Consistency** - Web and Horizon platforms use identical layouts
- ✅ **Maintainability** - Change layout once, applies to both platforms
- ✅ **Flexibility** - Full flexbox layout system on Canvas
- ✅ **Type Safety** - TypeScript types for all layout properties
- ✅ **Responsive** - Easy to adjust layouts by changing shared constants
