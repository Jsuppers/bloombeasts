import { BattleBoardAssetPositions, CardTextPositions, SideMenuPositions, SimplePosition, UIButtonPositions, UITextSafeZone } from "../types/positions";
import { DIMENSIONS } from "../styles/dimensions";

/**
 * Card text overlay positions
 * These are offsets within card image templates and should remain as absolute positions
 */
export const standardCardPositions: CardTextPositions = {
  cost: { x: 20, y: 10, size: DIMENSIONS.fontSize.xxl + 2, textAlign: 'center', textBaseline: 'top' },
  affinity: { x: 175, y: 7 },
  beastImage: { x: 12, y: 13 },
  level: { x: 105, y: 182, size: DIMENSIONS.fontSize.xs, textAlign: 'center', textBaseline: 'top' },
  experienceBar: { x: 44, y: 182 },
  name: { x: 105, y: 13, size: DIMENSIONS.fontSize.md, textAlign: 'center', textBaseline: 'top' },
  ability: { x: 21, y: 212, size: DIMENSIONS.fontSize.xs, textAlign: 'left', textBaseline: 'top' },
  attack: { x: 20, y: 176, size: DIMENSIONS.fontSize.xxl + 2, textAlign: 'center', textBaseline: 'top' },
  health: { x: 188, y: 176, size: DIMENSIONS.fontSize.xxl + 2, textAlign: 'center', textBaseline: 'top' },
  icons: {
    attack: { x: 17, y: 44, size: DIMENSIONS.fontSize.xxl + 2, textAlign: 'center', textBaseline: 'top' },
    ability: { x: 157, y: 44, size: DIMENSIONS.fontSize.xxl + 2, textAlign: 'center', textBaseline: 'top' },
  }
};

/**
 * Mission card text overlay positions
 * These are offsets within mission card image templates
 */
export const missionCardPositions = {
  name: { x: 97, y: 10, size: DIMENSIONS.fontSize.xl, textAlign: 'left', textBaseline: 'top' },
  image: { x: 16, y: 16 },
  level: { x: 97, y: 43, size: DIMENSIONS.fontSize.xs, textAlign: 'left', textBaseline: 'top' },
  difficulty: { x: 97, y: 66, size: DIMENSIONS.fontSize.xs, textAlign: 'left', textBaseline: 'top' },
  description: { x: 13, y: 98, size: DIMENSIONS.fontSize.sm, textAlign: 'left', textBaseline: 'top' },
};

/**
 * UI Container positions (absolute canvas positions)
 */
export const cardsUIContainerPosition: SimplePosition = {
  x: 103,
  y: 41,
};

export const playboardImagePositions: SimplePosition = {
  x: 64,
  y: 72,
};

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

/**
 * Battle board asset positions
 * These are absolute positions for cards, buffs, traps, and health displays on the battle board
 * Could potentially be calculated using the layout system in the future
 */
export const battleBoardAssetPositions: BattleBoardAssetPositions = {
  playerOne: {
    beastOne: { x: 64, y: 72 },
    beastTwo: { x: 284, y: 72 },
    beastThree: { x: 504, y: 72 },
    buffOne: { x: 724, y: 72 },
    buffTwo: { x: 861, y: 72 },
    trapOne: { x: 725, y: 212 },
    trapTwo: { x: 814, y: 212 },
    trapThree: { x: 903, y: 212 },
    health: { x: 915, y: 324 },
  },
  playOneInfoPosition: { x: 1015, y: 88 },
  playerTwo: {
    beastOne: { x: 64, y: 363 },
    beastTwo: { x: 284, y: 363 },
    beastThree: { x: 504, y: 363 },
    buffOne: { x: 724, y: 514 },
    buffTwo: { x: 861, y: 514 },
    trapOne: { x: 725, y: 420 },
    trapTwo: { x: 814, y: 420 },
    trapThree: { x: 903, y: 420 },
    health: { x: 915, y: 378 },
  },
  playerTwoInfoPosition: { x: 1015, y: 379 },
  habitatZone: { x: 725, y: 310 },
  cardTextPositions: standardCardPositions,
};
