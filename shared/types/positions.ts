export interface SimplePosition {
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
  textAlign?: 'left' | 'right' | 'center' | 'start' | 'end';
  textBaseline?: 'top' | 'hanging' | 'middle' | 'alphabetic' | 'ideographic' | 'bottom';
}

export interface CardTextPositions {
  cost: CardTextInfo;
  affinity: SimplePosition;
  level: CardTextInfo;
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
  spacing: number; // Vertical spacing between buttons
}

export interface UITextSafeZone {
  x: number;
  y: number;
  lineHeight: number; // Vertical spacing between lines of text
}

export interface SideMenuPositions {
  x: number;
  y: number;
  headerStartPosition: SimplePosition;
  textStartPosition: SimplePosition;
  buttonStartPosition: SimplePosition;
}

export interface BattleBoardAssetPositions {
  playerOne: PlayerCardPositions;
  playOneInfoPosition: SimplePosition;
  playerTwo: PlayerCardPositions;
  playerTwoInfoPosition: SimplePosition;
  habitatZone: SimplePosition;
  cardTextPositions: CardTextPositions;
}