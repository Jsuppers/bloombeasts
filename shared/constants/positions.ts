import { BattleBoardAssetPositions, CardTextPositions } from "../types/positions";

export const standardCardTextPositions: CardTextPositions = {
  cost: { x: 13, y: 6, size: 24 },
  level: { x: 57, y: 6, size: 24 },
  name: { x: 16, y: 173, size: 24 },
  special: { x: 183, y: 173, size: 24 },
  attack: { x: 36, y: 211, size: 40 },
  health: { x: 130, y: 211, size: 40 },
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
    health: { x: 837, y: 310 },
  },
  playOneInfoPosition: { x: 999, y: 72 },
  playerTwo: {
    beastOne: { x: 64, y: 363 },
    beastTwo: { x: 284, y: 363 },
    beastThree: { x: 504, y: 363 },
    magicOne: { x: 724, y: 514 },
    magicTwo: { x: 861, y: 514 },
    trapOne: { x: 725, y: 420 },
    trapTwo: { x: 814, y: 420 },
    trapThree: { x: 903, y: 420 },
    health: { x: 837, y: 363 },
  },
  playerTwoInfoPosition: { x: 999, y: 363 },
  habitatZone: { x: 725, y: 310 },
  cardTextPositions: standardCardTextPositions,
};