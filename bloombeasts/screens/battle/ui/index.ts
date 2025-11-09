/**
 * Battle screen components - Modular, reactive battle UI
 */

// Export components
export { BattleBackground } from './BattleBackground';
export { BeastField } from './BeastField';
export { TrapZone } from './TrapZone';
export { BuffZone } from './BuffZone';
export { HabitatZone } from './HabitatZone';
export { PlayerHand } from './PlayerHand';
export { InfoDisplays } from './InfoDisplays';
export { BattleSideMenu } from './BattleSideMenu';

// Export constants from types
export {
  standardCardDimensions,
  trapCardDimensions,
  buffCardDimensions,
  habitatShiftCardDimensions,
  gameDimensions,
  battleBoardAssetPositions,
} from './types';

// Note: Prop interfaces (BattleComponentProps, etc.) are exported from types.ts
// but not re-exported here to avoid namespace bundling issues.
// Import them directly from './types' if needed externally.
