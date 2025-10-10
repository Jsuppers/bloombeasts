import { BattleBoardAssetPositions, CardTextPositions, SideMenuPositions, UIButtonPositions, UITextSafeZone } from "../types/positions";

export const standardCardTextPositions: CardTextPositions = {
  cost: { x: 18, y: 10, size: 24, textAlign: 'center', textBaseline: 'top' },
  level: { x: 62, y: 10, size: 24, textAlign: 'center', textBaseline: 'top' },
  name: { x: 16, y: 179, size: 18, textAlign: 'left', textBaseline: 'top' },
  special: { x: 186, y: 176, size: 24, textAlign: 'center', textBaseline: 'top' },
  attack: { x: 56, y: 218, size: 40, textAlign: 'center', textBaseline: 'top' },
  health: { x: 150, y: 218, size: 40, textAlign: 'center', textBaseline: 'top' },
};

// Safe zone for UI buttons and interactive elements
// This position ensures elements won't be covered by platform-specific UI (status bars, navigation, etc.)
export const uiSafeZoneButtons: UIButtonPositions = {
  x: 1149,
  y: 131,
  width: 120,
  height: 50,
  spacing: 60, // Vertical spacing between stacked buttons
};

// Safe zone for text display (titles, counters, etc.)
// This area is safe for displaying informational text
export const uiSafeZoneText: UITextSafeZone = {
  x: 1152,
  y: 407,
  lineHeight: 30, // Vertical spacing between lines of text
};

export const sideMenuPositions: SideMenuPositions = {
  x: 1145,
  y: 128,
  headerStartPosition: { x: 1156, y: 139 },
  textStartPosition: { x: 1162, y: 188 },
  buttonStartPosition: { x: 1156, y: 369 },
};

export const battleBoardAssetPositions: BattleBoardAssetPositions = {
  playerOne: {
    beastOne: { x: 64, y: 72 },
    beastTwo: { x: 284, y: 72 },
    beastThree: { x: 504, y: 72 },
    magicOne: { x: 724, y: 72 },
    magicTwo: { x: 861, y: 72 },
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
    magicOne: { x: 724, y: 514 },
    magicTwo: { x: 861, y: 514 },
    trapOne: { x: 725, y: 420 },
    trapTwo: { x: 814, y: 420 },
    trapThree: { x: 903, y: 420 },
    health: { x: 915, y: 378 },
  },
  playerTwoInfoPosition: { x: 1015, y: 379 },
  habitatZone: { x: 725, y: 310 },
  cardTextPositions: standardCardTextPositions,
};
