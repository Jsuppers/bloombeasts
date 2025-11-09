/**
 * Shared types and constants for Battle Screen components
 */

import type { UIMethodMappings } from '../../../BloomBeastsGame';
import type { Card } from '../../../common/engine/types/core';

// Re-export dimensions from consolidated dimensions file
export { standardCardDimensions, trapCardDimensions, buffCardDimensions, habitatShiftCardDimensions } from '../../../common/ui/styles/styles/dimensions';

/**
 * Game dimensions
 */
export const gameDimensions = {
  panelWidth: 1280,
  panelHeight: 720,
};

/**
 * Battle board asset positions (from canvas version)
 */
export const battleBoardAssetPositions = {
  playerOne: {
    beastOne: { x: 170, y: 50 },
    beastTwo: { x: 535, y: 50 },
    beastThree: { x: 900, y: 50 },
    trapOne: { x: 120, y: 240 },
    trapTwo: { x: 590, y: 240 },
    trapThree: { x: 1060, y: 240 },
    buffOne: { x: 20, y: 50 },
    buffTwo: { x: 20, y: 193 },
    buffThree: { x: 20, y: 336 },
    health: { x: 30, y: 10 },
    energy: { x: 930, y: 10 },
    deckCount: { x: 1150, y: 10 },
  },
  playerTwo: {
    beastOne: { x: 170, y: 390 },
    beastTwo: { x: 535, y: 390 },
    beastThree: { x: 900, y: 390 },
    trapOne: { x: 120, y: 347 },
    trapTwo: { x: 590, y: 347 },
    trapThree: { x: 1060, y: 347 },
    buffOne: { x: 1160, y: 440 },
    buffTwo: { x: 1160, y: 550 },
    buffThree: { x: 1160, y: 660 },
    health: { x: 30, y: 680 },
    energy: { x: 930, y: 680 },
    deckCount: { x: 1150, y: 680 },
  },
  habitatZone: { x: 330, y: 293 },
  playOneInfoPosition: { x: 640, y: 20 },
  playTwoInfoPosition: { x: 640, y: 680 },
};

/**
 * Component props interface for battle components
 */
export interface BattleComponentProps {
  ui: UIMethodMappings;
}

/**
 * Extended props for components that need callbacks
 */
export interface BattleComponentWithCallbacks extends BattleComponentProps {
  onAction?: (action: string) => void;
  showPlayedCard?: (card: Card, callback?: () => void) => void;
  onCardDetailSelected?: (card: Card) => void;
}

/**
 * Props for PlayerHand component
 */
export interface PlayerHandProps extends BattleComponentProps {
  getBattleDisplayValue: () => any | null; // Function to get current battle display value for onClick handlers
  onAction?: (action: string) => void;
  onShowHandChange?: (newValue: boolean) => void;
  onScrollOffsetChange?: (newValue: number) => void;
  onRenderNeeded?: () => void;
  showPlayedCard?: (card: Card, callback?: () => void) => void;
}

/**
 * Props for BattleSideMenu component
 */
export interface BattleSideMenuProps extends BattleComponentProps {
  getIsPlayerTurn: () => boolean; // Function to get current turn state
  getHasAttackableBeasts: () => boolean; // Function to check if player has beasts that can attack
  onAction?: (action: string) => void;
  onActionAsync?: (action: string) => Promise<void>; // Async version for actions that need to wait
  onStopTurnTimer?: () => void;
  playSfx?: (sfxId: string) => void;
}

/**
 * Props for InfoDisplays component
 */
export interface InfoDisplaysProps extends BattleComponentProps {
}
