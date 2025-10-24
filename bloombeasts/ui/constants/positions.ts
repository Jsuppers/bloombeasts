import { DIMENSIONS } from "../styles/dimensions";

// Type definitions
export interface SimplePosition {
  x: number;
  y: number;
}

interface PlayerCardPositions {
  beastOne: SimplePosition;
  beastTwo: SimplePosition;
  beastThree: SimplePosition;
  buffOne: SimplePosition;
  buffTwo: SimplePosition;
  trapOne: SimplePosition;
  trapTwo: SimplePosition;
  trapThree: SimplePosition;
  health: SimplePosition;
}

interface CardTextInfo extends SimplePosition {
  size: number;
  textAlign?: 'left' | 'right' | 'center' | 'start' | 'end';
  textBaseline?: 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom';
}

export interface CardTextPositions {
  cost: CardTextInfo;
  affinity: SimplePosition;
  level: CardTextInfo;
  experienceBar: SimplePosition;
  name: CardTextInfo;
  ability: CardTextInfo;
  attack: CardTextInfo;
  health: CardTextInfo;
  beastImage: SimplePosition;
  icons: {
    attack: CardTextInfo;
    ability: CardTextInfo;
  };
}

export interface UIButtonPositions {
  x: number;
  y: number;
  width: number;
  height: number;
  spacing: number;
}

export interface UITextSafeZone {
  x: number;
  y: number;
  lineHeight: number;
}

export interface SideMenuPositions {
  x: number;
  y: number;
  headerStartPosition: SimplePosition;
  textStartPosition: SimplePosition;
  buttonStartPosition: SimplePosition;
  playerName: CardTextInfo;
  playerLevel: CardTextInfo;
  playerExperienceBar: SimplePosition & { maxWidth: number };
}

export interface BattleBoardAssetPositions {
  playerOne: PlayerCardPositions;
  playOneInfoPosition: SimplePosition;
  playerTwo: PlayerCardPositions;
  playerTwoInfoPosition: SimplePosition;
  habitatZone: SimplePosition;
  cardTextPositions: CardTextPositions;
}


/**
 * Safe zone for UI buttons and interactive elements
 * This position ensures elements won't be covered by platform-specific UI (status bars, navigation, etc.)
 */
export const uiSafeZoneButtons: UIButtonPositions = {
  x: 1149,
  y: 131,
  width: DIMENSIONS.button.minWidth,
  height: DIMENSIONS.button.height,
  spacing: DIMENSIONS.spacing.xxl * 2, // Vertical spacing between stacked buttons
};

/**
 * Safe zone for text display (titles, counters, etc.)
 * This area is safe for displaying informational text
 */
export const uiSafeZoneText: UITextSafeZone = {
  x: 1152,
  y: 407,
  lineHeight: DIMENSIONS.spacing.xl, // Vertical spacing between lines of text
};

/**
 * Side menu positions
 * The side menu contains player info, text, and buttons
 */
export const sideMenuPositions: SideMenuPositions = {
  x: 1145,
  y: 128,
  headerStartPosition: { x: 1156, y: 139 },
  textStartPosition: { x: 1162, y: 188 },
  buttonStartPosition: { x: 1156, y: 369 },
  playerName: { x: 10, y: 426, textAlign: 'left', textBaseline: 'top', size: DIMENSIONS.fontSize.sm },
  playerLevel: { x: 64, y: 445, textAlign: 'center', textBaseline: 'top', size: DIMENSIONS.fontSize.xs },
  playerExperienceBar: { x: 9, y: 445, maxWidth: 109 },
};

/**
 * Mission complete popup card positions
 */
export const missionCompleteCardPositions = {
  title: { x: 275, y: 24, size: DIMENSIONS.fontSize.title, textAlign: 'center', textBaseline: 'top' },
  chestImage: { x: 73, y: 76 },
  infoText: { x: 245, y: 98, size: DIMENSIONS.fontSize.sm, textAlign: 'left', textBaseline: 'top' },
  claimRewardButton: { x: 175, y: 271 },
};
