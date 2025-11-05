/**
 * Play Card Action Handler
 *
 * Handles the PLAY_CARD action, allowing a player to play a card from their hand
 */

import type { IGameState } from '../../../turbo/src';
import type { BloomBeastsState, BloomBeastsActionData, BloomBeastsPlayer, BeastFieldCard } from '../BloomBeastsGame';
import { BloomBeastsActionType } from '../BloomBeastsGame';
import { BaseActionHandler, ActionValidationResult } from './ActionHandler';
import type {
  AnyCard as Card,
  BloomBeastCard,
  MagicCard,
  TrapCard,
  BuffCard,
  HabitatCard,
} from '../../engine/types/core';

export interface PlayCardActionData extends BloomBeastsActionData {
  type: BloomBeastsActionType.PLAY_CARD;
  cardId: string;
  position?: number;
}

export class PlayCardActionHandler extends BaseActionHandler<PlayCardActionData> {
  readonly actionType = BloomBeastsActionType.PLAY_CARD;

  validate(
    actionData: PlayCardActionData,
    state: IGameState<BloomBeastsState>,
    playerId: string
  ): ActionValidationResult {
    const playerIndex = state.gameData.players.findIndex(p => p.id === playerId);
    const player = state.gameData.players[playerIndex];

    // Find the card in hand
    const card = player.hand.find(c => c.id === actionData.cardId);
    if (!card) {
      return { valid: false, reason: 'Card not in hand' };
    }

    // Check energy cost
    if (player.energy < card.cost) {
      return { valid: false, reason: 'Not enough energy' };
    }

    // Validate card placement based on type
    const field = playerIndex === 0 ? state.gameData.field.player1 : state.gameData.field.player2;

    switch (card.type) {
      case 'Beast':
        if (actionData.position === undefined) {
          return { valid: false, reason: 'Position required for Beast cards' };
        }
        if (actionData.position >= field.beasts.length) {
          return { valid: false, reason: 'Invalid position' };
        }
        if (field.beasts[actionData.position] !== null) {
          return { valid: false, reason: 'Position occupied' };
        }
        break;

      case 'Buff':
        if (actionData.position === undefined) {
          return { valid: false, reason: 'Position required for Buff cards' };
        }
        if (actionData.position >= field.buffs.length) {
          return { valid: false, reason: 'Invalid position' };
        }
        if (field.buffs[actionData.position] !== null) {
          return { valid: false, reason: 'Position occupied' };
        }
        break;

      case 'Trap':
        // Check max traps (using a reasonable default if not configured)
        const maxTraps = 3; // TODO: Get from config
        if (field.traps.length >= maxTraps) {
          return { valid: false, reason: 'Too many traps' };
        }
        break;

      case 'Habitat':
      case 'Magic':
        // These can always be played if you have energy
        break;

      default:
        return { valid: false, reason: 'Unknown card type' };
    }

    return { valid: true };
  }

  execute(
    actionData: PlayCardActionData,
    state: IGameState<BloomBeastsState>,
    playerId: string
  ): IGameState<BloomBeastsState> {
    const newState = this.cloneState(state);
    const playerIndex = newState.gameData.players.findIndex(p => p.id === playerId);
    const player = newState.gameData.players[playerIndex];

    // Find and remove card from hand
    const cardIndex = player.hand.findIndex(c => c.id === actionData.cardId);
    if (cardIndex === -1) {
      throw new Error('Card not found in hand');
    }
    const card = player.hand.splice(cardIndex, 1)[0];

    // Deduct energy cost
    player.energy -= card.cost;

    // Place card on field based on type
    const field = playerIndex === 0 ? newState.gameData.field.player1 : newState.gameData.field.player2;

    switch (card.type) {
      case 'Beast':
        const beastCard = card as BloomBeastCard;
        const fieldCard: BeastFieldCard = {
          ...beastCard,
          attack: beastCard.baseAttack,
          health: beastCard.baseHealth,
          summoningSickness: true,
          usedAbilityThisTurn: false
        };
        if (actionData.position !== undefined) {
          field.beasts[actionData.position] = fieldCard;
        }
        break;

      case 'Magic':
        // Magic cards go to graveyard immediately
        // Note: Magic card effects would be processed separately
        player.graveyard.push(card);
        break;

      case 'Trap':
        field.traps.push(card as TrapCard);
        break;

      case 'Buff':
        if (actionData.position !== undefined) {
          field.buffs[actionData.position] = card as BuffCard;
        }
        break;

      case 'Habitat':
        field.habitat = card as HabitatCard;
        break;
    }

    // Update turn tracking
    newState.gameData.currentTurnActions.cardsPlayed++;

    return newState;
  }
}
