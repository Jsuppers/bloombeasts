/**
 * Shared dimensions and spacing for BloomBeasts
 * Used across both Web and Horizon platforms
 */

export const DIMENSIONS = {
  // Panel/Screen dimensions
  panel: {
    width: 1280,
    height: 720,
  },

  // Button dimensions
  button: {
    height: 50,
    minWidth: 200,
    padding: 15,
    borderRadius: 10,
  },

  buttonSmall: {
    height: 40,
    minWidth: 100,
    padding: 10,
    borderRadius: 8,
  },

  // Card dimensions
  card: {
    width: 150,
    height: 200,
    borderRadius: 10,
    borderWidth: 2,
    padding: 10,
  },

  // Mission card dimensions
  missionCard: {
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    minHeight: 80,
  },

  // Dialog/Modal dimensions
  dialog: {
    minWidth: 400,
    maxWidth: 600,
    padding: 30,
    borderRadius: 15,
  },

  // Spacing scale
  spacing: {
    xs: 5,
    sm: 10,
    md: 15,
    lg: 20,
    xl: 30,
    xxl: 40,
  },

  // Font sizes
  fontSize: {
    xs: 12,
    sm: 14,
    md: 18,
    lg: 20,
    xl: 24,
    xxl: 28,
    title: 36,
    hero: 72,
  },

  // Border widths
  borderWidth: {
    thin: 1,
    normal: 2,
    thick: 3,
  },

  // Stat badge dimensions
  statBadge: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 2,
  },
} as const;

/**
 * Battle-specific card dimensions
 * These are larger/different from the generic DIMENSIONS.card for battle UI layout
 */
export const standardCardDimensions = {
  width: 210,
  height: 280,
};

export const trapCardDimensions = {
  width: 100,
  height: 133,
};

export const buffCardDimensions = {
  width: 100,
  height: 133,
};

export const habitatShiftCardDimensions = {
  width: 100,
  height: 133,
};

/**
 * Button dimensions (specific sizes for different contexts)
 */
export const sideMenuButtonDimensions = {
  width: 175,
  height: 72,
};

export const longButtonDimensions = {
  width: 201,
  height: 35,
};

export const smallButtonDimensions = {
  width: 89,
  height: 89,
};

/**
 * Mission-specific dimensions
 */
export const missionCompleteCardDimensions = {
  width: 550,
  height: 330,
};

export const chestImageMissionCompleteDimensions = {
  width: 160,
  height: 180,
};

/**
 * Common gaps for flexbox layouts
 */
export const GAPS = {
  cards: 15,
  buttons: 3,
  missions: 10,
  stats: 20,
  sections: 30,
} as const;
