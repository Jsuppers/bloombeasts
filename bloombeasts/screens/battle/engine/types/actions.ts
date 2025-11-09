/**
 * Typed Action System
 *
 * Replaces string-based action parsing with proper TypeScript discriminated unions.
 * This provides type safety, better IDE support, and eliminates string parsing bugs.
 *
 * Migration from:
 *   action = 'play-card-0-target-2'
 * To:
 *   action = { type: 'play-card', cardIndex: 0, targetIndex: 2 }
 */

import { Logger } from '../../../../common/engine/utils/Logger';

/**
 * Base action that all battle actions extend
 */
export interface BaseBattleAction {
  type: string;
  playerId?: string;
  timestamp?: number;
}

/**
 * Play a card from hand
 */
export interface PlayCardAction extends BaseBattleAction {
  type: 'play-card';
  cardIndex: number;
  cardId?: string;
  targetIndex?: number; // For targeted cards like Magic
  position?: number; // For beast placement
}

/**
 * Attack with a beast
 */
export interface AttackBeastAction extends BaseBattleAction {
  type: 'attack-beast';
  attackerId: string;
  attackerIndex?: number;
  targetId?: string;
  targetIndex?: number;
}

/**
 * Attack opponent player directly
 */
export interface AttackPlayerAction extends BaseBattleAction {
  type: 'attack-player';
  attackerId: string;
  attackerIndex?: number;
}

/**
 * Use a beast's ability
 */
export interface UseAbilityAction extends BaseBattleAction {
  type: 'use-ability';
  beastIndex: number;      // Slot index (0-2) - always reliable
  abilityIndex: number;
  targetId?: string;
  targetIndex?: number;
}

/**
 * End the current turn
 */
export interface EndTurnAction extends BaseBattleAction {
  type: 'end-turn';
}

/**
 * Forfeit the battle
 */
export interface ForfeitAction extends BaseBattleAction {
  type: 'forfeit';
}

/**
 * Timeout - player ran out of time
 */
export interface TimeoutAction extends BaseBattleAction {
  type: 'timeout';
  timedOutPlayerId?: string; // Which player actually timed out
}

/**
 * Auto-attack with all available beasts
 */
export interface AutoAttackAllAction extends BaseBattleAction {
  type: 'auto-attack-all';
}

/**
 * Discriminated union of all possible battle actions
 */
export type BattleAction =
  | PlayCardAction
  | AttackBeastAction
  | AttackPlayerAction
  | UseAbilityAction
  | EndTurnAction
  | ForfeitAction
  | TimeoutAction
  | AutoAttackAllAction;

/**
 * Action creator functions for type-safe action construction
 */
export const BattleActions = {
  playCard: (cardIndex: number, options?: {
    cardId?: string;
    targetIndex?: number;
    position?: number;
    playerId?: string;
  }): PlayCardAction => ({
    type: 'play-card',
    cardIndex,
    ...options,
    timestamp: Date.now(),
  }),

  attackBeast: (attackerId: string, options?: {
    attackerIndex?: number;
    targetId?: string;
    targetIndex?: number;
    playerId?: string;
  }): AttackBeastAction => ({
    type: 'attack-beast',
    attackerId,
    ...options,
    timestamp: Date.now(),
  }),

  attackPlayer: (attackerId: string, options?: {
    attackerIndex?: number;
    playerId?: string;
  }): AttackPlayerAction => ({
    type: 'attack-player',
    attackerId,
    ...options,
    timestamp: Date.now(),
  }),

  useAbility: (beastIndex: number, abilityIndex: number, options?: {
    targetId?: string;
    targetIndex?: number;
    playerId?: string;
  }): UseAbilityAction => ({
    type: 'use-ability',
    beastIndex,
    abilityIndex,
    ...options,
    timestamp: Date.now(),
  }),

  endTurn: (playerId?: string): EndTurnAction => ({
    type: 'end-turn',
    playerId,
    timestamp: Date.now(),
  }),

  forfeit: (playerId?: string): ForfeitAction => ({
    type: 'forfeit',
    playerId,
    timestamp: Date.now(),
  }),

  timeout: (playerId?: string): TimeoutAction => ({
    type: 'timeout',
    playerId,
    timestamp: Date.now(),
  }),

  autoAttackAll: (playerId?: string): AutoAttackAllAction => ({
    type: 'auto-attack-all',
    playerId,
    timestamp: Date.now(),
  }),
};

/**
 * Parse legacy string-based actions into typed actions
 * This function helps migrate from old string format to new typed format.
 *
 * Examples:
 *   'play-card-0' -> { type: 'play-card', cardIndex: 0 }
 *   'play-card-0-target-2' -> { type: 'play-card', cardIndex: 0, targetIndex: 2 }
 *   'attack-beast-1-2' -> { type: 'attack-beast', attackerIndex: 1, targetIndex: 2 }
 *   'end-turn' -> { type: 'end-turn' }
 */
export function parseActionString(actionStr: string, playerId?: string): BattleAction | null {
  // End turn
  if (actionStr === 'end-turn') {
    return BattleActions.endTurn(playerId);
  }

  // Forfeit
  if (actionStr === 'forfeit') {
    return BattleActions.forfeit(playerId);
  }

  // Auto attack all
  if (actionStr === 'auto-attack-all') {
    return BattleActions.autoAttackAll(playerId);
  }

  // Play card: 'play-card-0' or 'play-card-0-target-2'
  if (actionStr.startsWith('play-card-')) {
    const parts = actionStr.substring('play-card-'.length).split('-target-');
    const cardIndex = parseInt(parts[0], 10);
    const targetIndex = parts.length > 1 ? parseInt(parts[1], 10) : undefined;

    if (isNaN(cardIndex)) return null;

    return BattleActions.playCard(cardIndex, { targetIndex, playerId });
  }

  // Attack beast: 'attack-beast-1-2' (attacker index 1, target index 2)
  if (actionStr.startsWith('attack-beast-')) {
    const parts = actionStr.substring('attack-beast-'.length).split('-');
    if (parts.length >= 2) {
      const attackerIndex = parseInt(parts[0], 10);
      const targetIndex = parseInt(parts[1], 10);

      if (isNaN(attackerIndex) || isNaN(targetIndex)) return null;

      return BattleActions.attackBeast(attackerIndex.toString(), {
        attackerIndex,
        targetIndex,
        playerId,
      });
    }
  }

  // Attack player: 'attack-player-1' (attacker index 1)
  if (actionStr.startsWith('attack-player-')) {
    const attackerIndex = parseInt(actionStr.substring('attack-player-'.length), 10);

    if (isNaN(attackerIndex)) return null;

    return BattleActions.attackPlayer(attackerIndex.toString(), {
      attackerIndex,
      playerId,
    });
  }

  // Use ability: 'use-ability-1' or 'use-ability-1-target-2'
  if (actionStr.startsWith('use-ability-')) {
    const parts = actionStr.substring('use-ability-'.length).split('-target-');
    const beastIndex = parseInt(parts[0], 10);
    const targetIndex = parts.length > 1 ? parseInt(parts[1], 10) : undefined;

    if (isNaN(beastIndex)) return null;

    return BattleActions.useAbility(beastIndex, 0, {
      targetIndex,
      playerId,
    });
  }

  // Unknown action
  Logger.warn(`[ActionParser] Unknown action string: ${actionStr}`);
  return null;
}

/**
 * Convert typed action back to legacy string format
 * Used during migration to maintain compatibility with old code.
 */
export function actionToString(action: BattleAction): string {
  switch (action.type) {
    case 'play-card':
      if (action.targetIndex !== undefined) {
        return `play-card-${action.cardIndex}-target-${action.targetIndex}`;
      }
      return `play-card-${action.cardIndex}`;

    case 'attack-beast':
      return `attack-beast-${action.attackerIndex ?? action.attackerId}-${action.targetIndex ?? action.targetId}`;

    case 'attack-player':
      return `attack-player-${action.attackerIndex ?? action.attackerId}`;

    case 'use-ability':
      if (action.targetIndex !== undefined) {
        return `use-ability-${action.beastIndex}-target-${action.targetIndex}`;
      }
      return `use-ability-${action.beastIndex}`;

    case 'end-turn':
      return 'end-turn';

    case 'forfeit':
      return 'forfeit';

    case 'timeout':
      return 'timeout';

    case 'auto-attack-all':
      return 'auto-attack-all';

    default:
      // Exhaustiveness check
      const exhaustive: never = action;
      throw new Error(`Unknown action type: ${(exhaustive as any).type}`);
  }
}

/**
 * Type guard to check if an object is a valid BattleAction
 */
export function isBattleAction(obj: any): obj is BattleAction {
  return obj && typeof obj === 'object' && typeof obj.type === 'string';
}
