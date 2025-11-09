/**
 * Play Card Action Handler
 *
 * Handles the PLAY_CARD action, allowing a player to play a card from their hand
 */

import { Turbo } from '../../../../lib/Turbo-Standalone';

import type { BloomBeastsState, BloomBeastsActionData, BloomBeastsPlayer } from '../types';
import { BloomBeastsActionType } from '../types';
import { CardType } from '../../../../common/engine/types/core';
import { BaseActionHandler, ActionValidationResult, ActionHandlerContext } from './ActionHandler';
import { cardMatchesId } from '../utils/cardIdentifiers';
import type {
  BloomBeastCard,
  MagicCard,
  TrapCard,
  BuffCard,
  HabitatCard,
} from '../../../../common/engine/types/core';
import type { RuntimeBeast, RuntimeTrap, RuntimeBuff, RuntimeHabitat } from '../types';

export interface PlayCardActionData extends BloomBeastsActionData {
  type: BloomBeastsActionType.PLAY_CARD;
  cardId: string;
  position?: number;
}

export class PlayCardActionHandler extends BaseActionHandler<PlayCardActionData> {
  readonly actionType = BloomBeastsActionType.PLAY_CARD;

  validate(
    actionData: PlayCardActionData,
    state: Turbo.IGameState<BloomBeastsState>,
    playerId: string
  ): ActionValidationResult {
    const playerIndex = state.gameData.players.findIndex(p => p.id === playerId);
    const player = state.gameData.players[playerIndex];

    // Find the card in hand
    const card = player.hand.find(c => cardMatchesId(c, actionData.cardId));
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
        // Check max traps (matches DEFAULT_CONFIG.maxFieldTraps = 3)
        const maxTraps = 3;
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
    state: Turbo.IGameState<BloomBeastsState>,
    playerId: string,
    context?: ActionHandlerContext
  ): Turbo.IActionResult<BloomBeastsState> {
    const newState = this.cloneState(state);
    const playerIndex = newState.gameData.players.findIndex(p => p.id === playerId);
    const player = newState.gameData.players[playerIndex];

    // Find and remove card from hand
    const cardIndex = player.hand.findIndex(c => cardMatchesId(c, actionData.cardId));
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
        // Card from hand should already be a RuntimeBeast with instanceId, level, and scaled stats
        const runtimeBeast = card as RuntimeBeast;

        // Create field beast preserving all RuntimeBeast properties
        const fieldCard: RuntimeBeast = {
          ...runtimeBeast,
          // Set initial field state
          summoningSickness: true,
          usedAbilityThisTurn: false
        };

        if (actionData.position !== undefined) {
          field.beasts[actionData.position] = fieldCard;
        }
        break;

      case 'Magic':
        // Magic cards go to graveyard immediately
        player.graveyard.push(card);

        // Process Magic card effects
        if (context?.processMagicCard) {
          context.processMagicCard(card as MagicCard, newState);
        }
        break;

      case 'Trap':
        field.traps.push(card as RuntimeTrap);
        break;

      case 'Buff':
        if (actionData.position !== undefined) {
          field.buffs[actionData.position] = card as RuntimeBuff;
        }
        break;

      case 'Habitat':
        field.habitat = card as RuntimeHabitat;
        break;
    }

    // Update turn tracking
    newState.gameData.currentTurnActions.cardsPlayed++;

    // Check for traps BEFORE processing card effects
    if (context?.checkTraps) {
      let trapTriggerType = '';
      if (card.type === CardType.Beast) trapTriggerType = 'beast_play';
      else if (card.type === 'Magic') trapTriggerType = 'magic_play';
      else if (card.type === 'Habitat') trapTriggerType = 'habitat_play';

      if (trapTriggerType) {
        context.checkTraps(newState.gameData, playerId, trapTriggerType, { card });
      }
    }

    // Process OnSummon triggers for Beast cards
    if (card.type === CardType.Beast && context?.processTriggers) {
      context.processTriggers('on_action', newState, { action: 'summon', card });

      // Notify other allies about this summon (for OnAllySummon triggers)
      context.processTriggers('on_action', newState, { action: 'ally_summon', summonedCard: card });
    }

    // Process WhileOnField effects for cards that have them
    if ((card.type === CardType.Beast || card.type === 'Habitat') && card.abilities && context?.processTriggers) {
      // Check if this card has WhileOnField abilities
      const hasWhileOnField = card.abilities.some(ability =>
        'trigger' in ability && ability.trigger === 'WhileOnField'
      );
      if (hasWhileOnField) {
        // Apply WhileOnField effects immediately when card enters field
        context.processTriggers('on_action', newState, { action: 'enter_field', card });
      }
    }

    // Create event
    const event = this.createEvent('card_played', playerId, {
      cardId: card.id,
      cardType: card.type
    });

    return {
      success: true,
      newState,
      sideEffects: [event],
    };
  }
}
