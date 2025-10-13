import { BattleBoardAssetPositions, CardTextPositions, SideMenuPositions, SimplePosition, UIButtonPositions, UITextSafeZone } from "../types/positions";

export const standardCardPositions: CardTextPositions = {
  cost: { x: 20, y: 10, size: 26, textAlign: 'center', textBaseline: 'top' },
  affinity: { x: 175, y: 7 },
  beastImage: { x: 12, y: 13 },
  level: { x: 105, y: 182, size: 12, textAlign: 'center', textBaseline: 'top' },
  experienceBar: { x: 44, y: 182 },
  name: { x: 105, y: 13, size: 18, textAlign: 'center', textBaseline: 'top' },
  ability: { x: 21, y: 212, size: 12, textAlign: 'left', textBaseline: 'top' },
  attack: { x: 20, y: 176, size: 26, textAlign: 'center', textBaseline: 'top' },
  health: { x: 188, y: 176, size: 26, textAlign: 'center', textBaseline: 'top' },
  icons: {
    attack: { x: 17, y: 44, size: 26, textAlign: 'center', textBaseline: 'top' },
    ability: { x: 157, y: 44, size: 26, textAlign: 'center', textBaseline: 'top' },
  }
};

export const missionCardPositions = {
  name: { x: 97, y: 10, size: 24, textAlign: 'left', textBaseline: 'top' },
  image: { x: 16, y: 16 },
  level: { x: 97, y: 43, size: 12, textAlign: 'left', textBaseline: 'top' },
  difficulty: { x: 97, y: 66, size: 12, textAlign: 'left', textBaseline: 'top' },
  description: { x: 13, y: 98, size: 14, textAlign: 'left', textBaseline: 'top' },
};

export const cardsUIContainerPosition: SimplePosition = {
  x: 103,
  y: 41,
};

export const playboardImagePositions: SimplePosition = {
  x: 64,
  y: 72,
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
