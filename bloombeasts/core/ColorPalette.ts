/**
 * Color Palette - Centralized color constants
 * Eliminates hardcoded color values throughout the codebase
 */

export const COLOR_PALETTE = {
  /**
   * Player-related colors
   */
  player: {
    accent: '#4a8ec2',      // Player UI accent color
    primary: '#fff',        // Primary text/elements
  },

  /**
   * Opponent/danger colors
   */
  opponent: {
    danger: '#ff6b6b',      // Opponent/danger indicators
  },

  /**
   * Mission difficulty colors
   */
  difficulty: {
    tutorial: '#90EE90',    // Light green
    easy: '#87CEEB',        // Sky blue
    normal: '#FFD700',      // Gold
    hard: '#FF6347',        // Tomato red
    expert: '#8B008B',      // Dark magenta
    legendary: '#FF1493',   // Deep pink
  },

  /**
   * Card type colors
   */
  cardType: {
    habitat: '#4caf50',     // Habitat green
    buff: '#FFD700',        // Buff gold
    trap: '#ff6b6b',        // Trap red
    magic: '#9c27b0',       // Magic purple
  },

  /**
   * UI state colors
   */
  ui: {
    disabled: '#666',       // Disabled elements
    muted: '#888',          // Muted/inactive elements
    background: '#333',     // Dark background
    white: '#fff',          // White text
    default: '#FFFFFF',     // Default color
  },

  /**
   * Toggle/button state colors
   */
  toggle: {
    on: '#4CAF50',          // Toggle on (green)
    off: '#888',            // Toggle off (gray)
  },

  /**
   * Button colors
   */
  button: {
    green: '#4CAF50',
    red: '#f44336',
    default: '#666',
  },
} as const;

/**
 * Helper function to get difficulty color
 */
export function getDifficultyColor(difficulty: string): string {
  const difficultyMap: Record<string, string> = {
    'tutorial': COLOR_PALETTE.difficulty.tutorial,
    'easy': COLOR_PALETTE.difficulty.easy,
    'normal': COLOR_PALETTE.difficulty.normal,
    'hard': COLOR_PALETTE.difficulty.hard,
    'expert': COLOR_PALETTE.difficulty.expert,
    'legendary': COLOR_PALETTE.difficulty.legendary,
  };
  return difficultyMap[difficulty] || COLOR_PALETTE.ui.default;
}
