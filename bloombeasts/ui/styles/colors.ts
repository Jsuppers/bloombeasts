/**
 * Shared color palette for BloomBeasts
 * Used across both Web and Horizon platforms
 */

export const COLORS = {
  // Primary colors
  background: '#1a1a2e',
  backgroundDark: '#0f0f1e',
  primary: '#00d9ff',
  primaryLight: '#3498db',

  // Text colors
  textPrimary: '#ffffff',
  textSecondary: '#aaaaaa',
  textMuted: '#666666',

  // UI element colors
  buttonPrimary: '#3498db',
  buttonDanger: '#e74c3c',
  buttonSuccess: '#27ae60',
  buttonDisabled: '#555555',
  surface: '#2c3e50',
  disabled: '#555555',
  error: '#e74c3c',

  // Card/Panel colors
  cardBackground: '#2c3e50',
  panelBackground: '#1a1a1a',
  overlayBackground: 'rgba(0, 0, 0, 0.8)',
  overlayBackgroundDark: 'rgba(0, 0, 0, 0.9)',

  // Borders
  borderPrimary: '#00d9ff',
  borderSuccess: '#27ae60',
  borderDefault: '#3498db',
  border: '#3a3a4a',

  // Affinity colors
  affinity: {
    fire: '#e74c3c',
    water: '#3498db',
    forest: '#27ae60',
    sky: '#9b59b6',
    neutral: '#95a5a6',
  },

  // Status colors
  success: '#27ae60',
  warning: '#f39c12',
  danger: '#e74c3c',
  info: '#3498db',

  // Rarity colors (for cards)
  rarity: {
    common: '#95a5a6',
    uncommon: '#27ae60',
    rare: '#3498db',
    epic: '#9b59b6',
    legendary: '#f39c12',
  },
} as const;

/**
 * Helper function to get affinity color
 */
export function getAffinityColor(affinity?: string): string {
  switch (affinity) {
    case 'Fire':
      return COLORS.affinity.fire;
    case 'Water':
      return COLORS.affinity.water;
    case 'Forest':
      return COLORS.affinity.forest;
    case 'Sky':
      return COLORS.affinity.sky;
    default:
      return COLORS.affinity.neutral;
  }
}

/**
 * Helper function to get rarity color
 */
export function getRarityColor(rarity?: string): string {
  switch (rarity?.toLowerCase()) {
    case 'common':
      return COLORS.rarity.common;
    case 'uncommon':
      return COLORS.rarity.uncommon;
    case 'rare':
      return COLORS.rarity.rare;
    case 'epic':
      return COLORS.rarity.epic;
    case 'legendary':
      return COLORS.rarity.legendary;
    default:
      return COLORS.rarity.common;
  }
}
