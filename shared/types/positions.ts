interface SimplePosition {
  x: number;
  y: number;
}

interface PlayerCardPositions {
  beastOne: SimplePosition;
  beastTwo: SimplePosition;
  beastThree: SimplePosition;
  magicOne: SimplePosition;
  magicTwo: SimplePosition;
  trapOne: SimplePosition;
  trapTwo: SimplePosition;
  trapThree: SimplePosition;
  health: SimplePosition;
}

interface CardTextInfo extends SimplePosition {
  size: number;
}

export interface CardTextPositions {
  cost: CardTextInfo;
  level: CardTextInfo;
  name: CardTextInfo;
  special: CardTextInfo;
  attack: CardTextInfo;
  health: CardTextInfo;
}

export interface BattleBoardAssetPositions {
  playerOne: PlayerCardPositions;
  playOneInfoPosition: SimplePosition;
  playerTwo: PlayerCardPositions;
  playerTwoInfoPosition: SimplePosition;
  habitatZone: SimplePosition;
  cardTextPositions: CardTextPositions;
}