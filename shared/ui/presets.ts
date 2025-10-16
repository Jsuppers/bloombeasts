/**
 * Shared UI component presets for BloomBeasts
 * Predefined component configurations for consistency
 */

import { COLORS } from '../styles/colors';
import { DIMENSIONS } from '../styles/dimensions';
import type { ButtonDef, StatBadgeDef, BaseStyle } from './types';

/**
 * Button style presets
 */
export const BUTTON_STYLES = {
  primary: {
    backgroundColor: COLORS.buttonPrimary,
    color: COLORS.textPrimary,
    padding: DIMENSIONS.button.padding,
    borderRadius: DIMENSIONS.button.borderRadius,
    fontSize: DIMENSIONS.fontSize.xl,
    fontWeight: 'bold' as const,
  },

  danger: {
    backgroundColor: COLORS.buttonDanger,
    color: COLORS.textPrimary,
    padding: DIMENSIONS.buttonSmall.padding,
    borderRadius: DIMENSIONS.buttonSmall.borderRadius,
    fontSize: DIMENSIONS.fontSize.md,
    fontWeight: 'bold' as const,
  },

  success: {
    backgroundColor: COLORS.buttonSuccess,
    color: COLORS.textPrimary,
    padding: DIMENSIONS.button.padding,
    borderRadius: DIMENSIONS.button.borderRadius,
    fontSize: DIMENSIONS.fontSize.xl,
    fontWeight: 'bold' as const,
  },

  secondary: {
    backgroundColor: COLORS.cardBackground,
    color: COLORS.textPrimary,
    padding: DIMENSIONS.button.padding,
    borderRadius: DIMENSIONS.button.borderRadius,
    fontSize: DIMENSIONS.fontSize.xl,
    fontWeight: 'bold' as const,
  },

  disabled: {
    backgroundColor: COLORS.buttonDisabled,
    color: COLORS.textSecondary,
    padding: DIMENSIONS.button.padding,
    borderRadius: DIMENSIONS.button.borderRadius,
    fontSize: DIMENSIONS.fontSize.xl,
    fontWeight: 'bold' as const,
  },
} as const;

/**
 * Text style presets
 */
export const TEXT_STYLES = {
  title: {
    fontSize: DIMENSIONS.fontSize.title,
    fontWeight: 'bold' as const,
    color: COLORS.primary,
  },

  hero: {
    fontSize: DIMENSIONS.fontSize.hero,
    fontWeight: 'bold' as const,
    color: COLORS.primary,
  },

  body: {
    fontSize: DIMENSIONS.fontSize.md,
    color: COLORS.textPrimary,
  },

  bodySecondary: {
    fontSize: DIMENSIONS.fontSize.sm,
    color: COLORS.textSecondary,
  },

  label: {
    fontSize: DIMENSIONS.fontSize.sm,
    color: COLORS.textSecondary,
  },

  value: {
    fontSize: DIMENSIONS.fontSize.lg,
    fontWeight: 'bold' as const,
    color: COLORS.textPrimary,
  },
} as const;

/**
 * Card style presets
 */
export const CARD_STYLES = {
  base: {
    width: DIMENSIONS.card.width,
    height: DIMENSIONS.card.height,
    backgroundColor: COLORS.cardBackground,
    borderRadius: DIMENSIONS.card.borderRadius,
    borderWidth: DIMENSIONS.card.borderWidth,
    padding: DIMENSIONS.card.padding,
  },

  mission: {
    backgroundColor: COLORS.cardBackground,
    padding: DIMENSIONS.missionCard.padding,
    borderRadius: DIMENSIONS.missionCard.borderRadius,
    borderWidth: DIMENSIONS.missionCard.borderWidth,
    borderColor: COLORS.borderDefault,
  },

  missionCompleted: {
    backgroundColor: COLORS.cardBackground,
    padding: DIMENSIONS.missionCard.padding,
    borderRadius: DIMENSIONS.missionCard.borderRadius,
    borderWidth: DIMENSIONS.missionCard.borderWidth,
    borderColor: COLORS.borderSuccess,
  },

  missionDisabled: {
    backgroundColor: COLORS.panelBackground,
    padding: DIMENSIONS.missionCard.padding,
    borderRadius: DIMENSIONS.missionCard.borderRadius,
    borderWidth: DIMENSIONS.missionCard.borderWidth,
    borderColor: COLORS.buttonDisabled,
    opacity: 0.5,
  },
} as const;

/**
 * Dialog/Modal style presets
 */
export const DIALOG_STYLES = {
  overlay: {
    backgroundColor: COLORS.overlayBackground,
  },

  content: {
    backgroundColor: COLORS.cardBackground,
    padding: DIMENSIONS.dialog.padding,
    borderRadius: DIMENSIONS.dialog.borderRadius,
  },

  title: {
    fontSize: DIMENSIONS.fontSize.xxl,
    fontWeight: 'bold' as const,
    color: COLORS.primary,
    textAlign: 'center' as const,
  },

  message: {
    fontSize: DIMENSIONS.fontSize.md,
    color: COLORS.textPrimary,
    textAlign: 'center' as const,
  },
} as const;

/**
 * Helper function to create a button definition with a preset style
 */
export function createButton(
  id: string,
  label: string,
  variant: 'primary' | 'danger' | 'success' | 'secondary' | 'disabled' = 'primary'
): ButtonDef {
  return {
    id,
    label,
    style: BUTTON_STYLES[variant],
    variant,
    disabled: variant === 'disabled',
  };
}

/**
 * Helper function to create a stat badge definition
 */
export function createStatBadge(label: string, value: string | number): StatBadgeDef {
  return {
    label,
    value,
    style: {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      padding: DIMENSIONS.statBadge.padding,
      borderRadius: DIMENSIONS.statBadge.borderRadius,
      borderWidth: DIMENSIONS.statBadge.borderWidth,
      borderColor: COLORS.borderPrimary,
    },
  };
}
