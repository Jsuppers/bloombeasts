/**
 * Shared layout definitions for BloomBeasts
 * These layouts can be applied to both Web and Horizon platforms
 */

import { DIMENSIONS, GAPS } from './dimensions';

/**
 * Base layout style type (compatible with both platforms)
 */
export type LayoutStyle = {
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  alignSelf?: 'auto' | 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  padding?: number;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  margin?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  gap?: number;
  flex?: number;
  width?: number | string;
  height?: number | string;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  position?: 'relative' | 'absolute';
  top?: number;
  left?: number;
  right?: number;
  bottom?: number;
};

/**
 * Screen layouts
 */
export const LAYOUTS = {
  // Root panel layout
  root: {
    width: DIMENSIONS.panel.width,
    height: DIMENSIONS.panel.height,
    flexDirection: 'column' as const,
  },

  // Start menu screen
  startMenu: {
    flex: 1,
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: DIMENSIONS.spacing.xxl,
  },

  startMenuButtons: {
    flexDirection: 'column' as const,
    gap: GAPS.buttons,
  },

  startMenuStats: {
    flexDirection: 'row' as const,
    gap: GAPS.stats,
    marginBottom: DIMENSIONS.spacing.xxl,
  },

  // Mission select screen
  missionSelectContainer: {
    flex: 1,
    flexDirection: 'column' as const,
    padding: DIMENSIONS.spacing.lg,
  },

  missionSelectHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: DIMENSIONS.spacing.lg,
  },

  missionList: {
    flex: 1,
  },

  missionListContent: {
    flexDirection: 'column' as const,
    gap: GAPS.missions,
  },

  // Cards screen
  cardsContainer: {
    flex: 1,
    flexDirection: 'column' as const,
    padding: DIMENSIONS.spacing.lg,
  },

  cardsHeader: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: DIMENSIONS.spacing.lg,
  },

  cardsHeaderRight: {
    flexDirection: 'row' as const,
    gap: GAPS.buttons,
  },

  cardsGrid: {
    flex: 1,
  },

  cardsGridContent: {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    gap: GAPS.cards,
  },

  // Battle screen
  battleContainer: {
    flex: 1,
    flexDirection: 'column' as const,
  },

  // Settings screen
  settingsContainer: {
    flex: 1,
    flexDirection: 'column' as const,
    padding: DIMENSIONS.spacing.lg,
  },

  // Dialog/Modal overlay
  dialogOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: DIMENSIONS.panel.width,
    height: DIMENSIONS.panel.height,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },

  dialogContent: {
    minWidth: DIMENSIONS.dialog.minWidth,
    maxWidth: DIMENSIONS.dialog.maxWidth,
    padding: DIMENSIONS.dialog.padding,
    borderRadius: DIMENSIONS.dialog.borderRadius,
  },

  dialogButtons: {
    flexDirection: 'row' as const,
    gap: GAPS.buttons,
    justifyContent: 'center' as const,
  },

  // Card detail overlay
  cardDetailOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: DIMENSIONS.panel.width,
    height: DIMENSIONS.panel.height,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
} as const;
