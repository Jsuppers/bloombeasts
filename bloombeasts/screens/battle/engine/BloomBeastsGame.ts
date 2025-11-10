/**
 * BloomBeasts game implementation using the TURBO library
 */

import { Turbo } from '../../../lib/Turbo-Standalone';
import { Logger } from '../../../common/engine/utils/Logger';
import { cardMatchesId, cardsMatch, getCardIdentifier } from './utils/cardIdentifiers';

// Import existing BloomBeasts types
import { CardType } from '../../../common/engine/types/core';
import {
  BloomBeastCard,
  MagicCard,
  TrapCard,
  BuffCard,
  HabitatCard,
} from '../../../common/engine/types/core';
import { Player as BloomPlayer } from '../../../common/engine/types/game';
import { shuffle } from '../../../common/engine/utils/random';
import {
  ActionHandlerRegistry,
  DrawCardActionHandler,
  PlayCardActionHandler,
  AttackActionHandler,
  EndTurnActionHandler,
  TimeoutActionHandler,
  ForfeitActionHandler,
  TriggerContext,
} from './actions';
// Import types from ./types to avoid circular dependencies with action handlers
import type {
  BloomBeastsState,
  BloomBeastsActionData,
  BloomBeastsPlayer,
  RuntimeBeast,
  RuntimeCard,
  RuntimeHabitat,
  RuntimeBuff,
  RuntimeTrap,
} from './types';
import { BloomBeastsActionType } from './types';
import { WinConditionChecker } from './core/WinConditionChecker';

/**
 * Trigger timing enum for effect processing
 */
enum TriggerTiming {
  START_OF_TURN = 'start_of_turn',
  END_OF_TURN = 'end_of_turn',
  ON_ACTION = 'on_action',
  ON_EVENT = 'on_event',
}

/**
 * Effect system for processing game effects and triggers
 */
class EffectSystem<TState extends Record<string, unknown>> {
  processEffects(
    timing: TriggerTiming,
    state: Turbo.IGameState<TState>,
    context?: TriggerContext
  ): { success: boolean; newState?: Turbo.IGameState<TState> } {
    // Clone state to avoid mutating the original - use Turbo.deepClone to preserve Sets, Maps, etc.
    const newState = Turbo.deepClone(state);
    const bloomState = newState.gameData as unknown as BloomBeastsState;

    // Handle OnSummon triggers
    if (timing === TriggerTiming.ON_ACTION && context?.action === 'summon' && context.card) {
      const card = context.card;

      // Check if this card has abilities
      if (card.abilities && card.abilities.length > 0) {
        for (const ability of card.abilities) {
          // Type guard: check if this is a StructuredAbility with trigger and effects
          if ('trigger' in ability && ability.trigger === 'OnSummon' && 'effects' in ability && ability.effects) {
            // Process each effect (check conditions on individual effects)
            for (const effect of ability.effects) {
              // Check effect condition if present
              if (!effect.condition || this.evaluateCondition(effect.condition, card, bloomState, newState.turnInfo!.currentPlayerId)) {
                this.processEffect(effect, bloomState, newState.turnInfo!.currentPlayerId, {
                  sourceCard: card,
                  playedCard: card
                });
              }
            }
          }
        }
      }
    }

    // Handle WhileOnField effects when card enters field
    if (timing === TriggerTiming.ON_ACTION && context?.action === 'enter_field' && context.card) {
      const card = context.card;

      // Check if this card has abilities
      if (card.abilities && card.abilities.length > 0) {
        for (const ability of card.abilities) {
          // Type guard: check if this is a StructuredAbility with trigger and effects
          if ('trigger' in ability && ability.trigger === 'WhileOnField' && 'effects' in ability && ability.effects) {
            // Process each effect
            for (const effect of ability.effects) {
              // Check condition if present
              if (!effect.condition || this.evaluateCondition(effect.condition, card, bloomState, newState.turnInfo!.currentPlayerId)) {
                this.processEffect(effect, bloomState, newState.turnInfo!.currentPlayerId, {
                  sourceCard: card
                });
              }
            }
          }
        }
      }
    }

    // Handle OnAllySummon triggers (notify other allies that a beast was summoned)
    if (timing === TriggerTiming.ON_ACTION && context?.action === 'ally_summon' && context.summonedCard) {
      const summonedCard = context.summonedCard as RuntimeCard;
      const currentPlayerIndex = bloomState.players.findIndex(p => p.id === newState.turnInfo!.currentPlayerId);
      const field = currentPlayerIndex === 0 ? bloomState.field.player1 : bloomState.field.player2;

      // Check all allied beasts (except the summoned one) for OnAllySummon abilities
      for (const beast of field.beasts) {
        if (beast && 'id' in summonedCard && beast.id !== summonedCard.id && beast.abilities) {
          for (const ability of beast.abilities) {
            if ('trigger' in ability && ability.trigger === 'OnAllySummon' && 'effects' in ability && ability.effects) {
              for (const effect of ability.effects) {
                // Check condition on the summoned card (e.g., affinity match)
                if (!effect.condition || this.evaluateCondition(effect.condition, summonedCard, bloomState, newState.turnInfo!.currentPlayerId)) {
                  this.processEffect(effect, bloomState, newState.turnInfo!.currentPlayerId, {
                    sourceCard: beast,
                    summonedCard: summonedCard
                  });
                }
              }
            }
          }
        }
      }
    }

    // Handle OnAttack triggers
    if (timing === TriggerTiming.ON_ACTION && context?.action === 'attack' && context.card) {
      const attackerCard = context.card;

      // Check attacker for OnAttack abilities
      if (attackerCard.abilities && attackerCard.abilities.length > 0) {
        for (const ability of attackerCard.abilities) {
          if ('trigger' in ability && ability.trigger === 'OnAttack' && 'effects' in ability && ability.effects) {
            for (const effect of ability.effects) {
              // Check condition if present
              if (!effect.condition || this.evaluateCondition(effect.condition, attackerCard, bloomState, newState.turnInfo!.currentPlayerId)) {
                this.processEffect(effect, bloomState, newState.turnInfo!.currentPlayerId, {
                  sourceCard: attackerCard,
                  targetCard: context.targetCard,
                  attackerCard: attackerCard
                });
              }
            }
          }
        }
      }
    }

    // Handle OnDamage triggers
    if (timing === TriggerTiming.ON_ACTION && context?.action === 'damage' && context.card) {
      const damagedCard = context.card;

      // Check damaged card for OnDamage abilities
      if (damagedCard.abilities && damagedCard.abilities.length > 0) {
        for (const ability of damagedCard.abilities) {
          if ('trigger' in ability && ability.trigger === 'OnDamage' && 'effects' in ability && ability.effects) {
            for (const effect of ability.effects) {
              // Check condition if present
              if (!effect.condition || this.evaluateCondition(effect.condition, damagedCard, bloomState, newState.turnInfo!.currentPlayerId)) {
                this.processEffect(effect, bloomState, newState.turnInfo!.currentPlayerId, {
                  sourceCard: damagedCard,
                  attackerCard: context.attackerCard,
                  damagedCard: damagedCard
                });
              }
            }
          }
        }
      }
    }

    // Handle OnDestroy triggers
    if (timing === TriggerTiming.ON_ACTION && context?.action === 'destroy' && context.card) {
      const destroyedCard = context.card;

      // Check destroyed card for OnDestroy abilities
      if (destroyedCard.abilities && destroyedCard.abilities.length > 0) {
        for (const ability of destroyedCard.abilities) {
          if ('trigger' in ability && ability.trigger === 'OnDestroy' && 'effects' in ability && ability.effects) {
            for (const effect of ability.effects) {
              // Check condition if present
              if (!effect.condition || this.evaluateCondition(effect.condition, destroyedCard, bloomState, newState.turnInfo!.currentPlayerId)) {
                this.processEffect(effect, bloomState, newState.turnInfo!.currentPlayerId, {
                  sourceCard: destroyedCard,
                  destroyedCard: destroyedCard
                });
              }
            }
          }
        }
      }
    }

    // Handle start of turn triggers
    if (timing === TriggerTiming.START_OF_TURN) {
      // Process OnOwnStartOfTurn triggers
      this.processStartOfTurnTriggers(bloomState, newState.turnInfo!.currentPlayerId);
    }

    // Handle end of turn triggers
    if (timing === TriggerTiming.END_OF_TURN) {
      this.processEndOfTurnTriggers(bloomState, newState.turnInfo!.currentPlayerId);
    }

    return { success: true, newState };
  }

  private processEffect(
    effect: any,
    state: BloomBeastsState,
    currentPlayerId: string,
    context?: any
  ): void {
    const currentPlayerIndex = state.players.findIndex(p => p.id === currentPlayerId);
    const currentPlayer = state.players[currentPlayerIndex];
    const opponentIndex = 1 - currentPlayerIndex;
    const opponent = state.players[opponentIndex];

    switch (effect.type) {
      case 'draw-cards':
        // Draw cards from deck
        const cardsToDraw = effect.value || 1;
        for (let i = 0; i < cardsToDraw; i++) {
          if (currentPlayer.deck.length > 0 && currentPlayer.hand.length < currentPlayer.maxHandSize) {
            const drawnCard = currentPlayer.deck.shift()!;
            currentPlayer.hand.push(drawnCard);
          }
        }
        break;

      case 'modify-stats':
        // Modify stats of target beasts
        this.processStatModification(effect, state, currentPlayerId, context);
        break;

      case 'gain-resource':
        // Gain resources
        if (effect.resource === 'energy') {
          const value = effect.value || 0;
          currentPlayer.energy = Math.min(currentPlayer.energy + value, 10); // maxEnergy = 10
        }
        break;

      case 'deal-damage': {
        // Deal damage to targets
        const targets = this.resolveTargets(effect.target, state, currentPlayerId, context);
        const damageValue = typeof effect.value === 'number' ? effect.value :
                           effect.value === 'attack-value' && context?.sourceCard ?
                           context.sourceCard.currentAttack : 0;

        for (const target of targets) {
          if ('currentHealth' in target) {
            // Target is a beast
            target.currentHealth = Math.max(0, target.currentHealth - damageValue);
            // Check if beast should be destroyed
            if (target.currentHealth <= 0) {
              this.destroyBeast(target, state);
            }
          } else if ('health' in target) {
            // Target is a player
            target.health = Math.max(0, target.health - damageValue);
          }
        }
        break;
      }

      case 'heal': {
        // Heal targets
        const targets = this.resolveTargets(effect.target, state, currentPlayerId, context);
        for (const target of targets) {
          if ('currentHealth' in target && 'maxHealth' in target) {
            // Target is a beast
            const healValue = effect.value === 'full' ? target.maxHealth : effect.value;
            target.currentHealth = Math.min(target.maxHealth, target.currentHealth + healValue);
          } else if ('health' in target && 'maxHealth' in target) {
            // Target is a player
            const healValue = effect.value === 'full' ? target.maxHealth : effect.value;
            target.health = Math.min(target.maxHealth, target.health + healValue);
          }
        }
        break;
      }

      case 'retaliation': {
        // Deal retaliatory damage to attacker
        const targets = this.resolveTargets(effect.target, state, currentPlayerId, context);
        const damageValue = effect.value === 'reflected' && context?.damagedCard ?
                           context.damagedCard.currentHealth : effect.value;

        for (const target of targets) {
          if ('currentHealth' in target) {
            target.currentHealth = Math.max(0, target.currentHealth - damageValue);
            if (target.currentHealth <= 0) {
              this.destroyBeast(target, state);
            }
          }
        }
        break;
      }

      case 'damage-reduction':
        // Damage reduction is handled during combat, not here
        // We'll implement this in Phase 6 (Attack Modifications)
        break;

      case 'remove-summoning-sickness': {
        // Remove summoning sickness from targets
        const targets = this.resolveTargets(effect.target, state, currentPlayerId, context);
        for (const target of targets) {
          if ('summoningSickness' in target) {
            target.summoningSickness = false;
          }
        }
        break;
      }

      case 'cannot-be-targeted':
        // Cannot be targeted is a passive effect checked during targeting
        // We'll track this in a future phase
        break;

      case 'attack-modification':
        // Attack modifications are handled during combat
        // We'll implement this in Phase 6
        break;

      case 'prevent-attack': {
        // Prevent beast from attacking
        const targets = this.resolveTargets(effect.target, state, currentPlayerId, context);
        for (const target of targets) {
          if ('preventions' in target) {
            if (!target.preventions) {
              target.preventions = [];
            }
            target.preventions.push({
              type: 'prevent-attack',
              duration: effect.duration || 'permanent',
              source: context?.sourceCard?.id || 'unknown'
            });
          }
        }
        break;
      }

      case 'prevent-abilities': {
        // Prevent beast from using abilities
        const targets = this.resolveTargets(effect.target, state, currentPlayerId, context);
        for (const target of targets) {
          if ('preventions' in target) {
            if (!target.preventions) {
              target.preventions = [];
            }
            target.preventions.push({
              type: 'prevent-abilities',
              duration: effect.duration || 'permanent',
              source: context?.sourceCard?.id || 'unknown'
            });
          }
        }
        break;
      }

      case 'return-to-hand': {
        // Return units to hand
        const targets = this.resolveTargets(effect.target, state, currentPlayerId, context);
        const numToReturn = effect.value || targets.length;

        for (let i = 0; i < Math.min(numToReturn, targets.length); i++) {
          const target = targets[i];
          if ('id' in target && 'type' in target && 'instanceId' in target) {
            // Target is a RuntimeCard
            const field = currentPlayerIndex === 0 ? state.field.player1 : state.field.player2;
            const beastIndex = field.beasts.findIndex(b => b && cardsMatch(b, target));
            if (beastIndex !== -1) {
              field.beasts[beastIndex] = null;
              // Add to hand if space available
              if (currentPlayer.hand.length < currentPlayer.maxHandSize) {
                currentPlayer.hand.push(target as RuntimeCard);
              } else {
                // Discard if hand is full
                currentPlayer.graveyard.push(target as RuntimeCard);
              }
            }
          }
        }
        break;
      }

      case 'destroy': {
        // Destroy target units
        const targets = this.resolveTargets(effect.target, state, currentPlayerId, context);
        for (const target of targets) {
          if ('currentHealth' in target) {
            this.destroyBeast(target, state);
          }
        }
        break;
      }

      case 'discard-cards': {
        // Discard cards from hand
        const numToDiscard = Math.min(effect.value || 1, currentPlayer.hand.length);
        for (let i = 0; i < numToDiscard; i++) {
          const card = currentPlayer.hand.pop();
          if (card) {
            currentPlayer.graveyard.push(card);
          }
        }
        break;
      }

      case 'nullify-effect':
        // Nullify effect prevents the card from being played
        // This is handled in trap activation
        break;

      case 'temporary-hp': {
        // Grant temporary HP (shield)
        const targets = this.resolveTargets(effect.target, state, currentPlayerId, context);
        for (const target of targets) {
          if ('temporaryHP' in target) {
            target.temporaryHP = (target.temporaryHP || 0) + effect.value;
          }
        }
        break;
      }

      case 'immunity':
      case 'swap-positions':
      case 'move-unit':
      case 'copy-ability':
      case 'redirect-damage':
        // These are advanced effects that can be implemented later
        console.warn(`[EffectSystem] Effect type '${effect.type}' not yet implemented`);
        break;

      default:
        console.warn(`[EffectSystem] Unknown effect type: ${effect.type}`);
    }
  }

  /**
   * Remove a beast from the field and add to graveyard
   */
  private destroyBeast(beast: RuntimeBeast, state: BloomBeastsState): void {
    // Find which field and remove
    for (let playerIdx = 0; playerIdx < 2; playerIdx++) {
      const field = playerIdx === 0 ? state.field.player1 : state.field.player2;
      const index = field.beasts.findIndex(b => b && cardsMatch(b, beast));
      if (index !== -1) {
        field.beasts[index] = null;
        // Add to graveyard
        const owner = state.players[playerIdx];
        owner.graveyard.push(beast);
        break;
      }
    }
  }

  /**
   * Evaluate whether a condition is met
   */
  private evaluateCondition(condition: any, target: any, state: BloomBeastsState, currentPlayerId: string): boolean {
    if (!condition) return true; // No condition means always true

    const currentPlayerIndex = state.players.findIndex(p => p.id === currentPlayerId);
    const field = currentPlayerIndex === 0 ? state.field.player1 : state.field.player2;

    switch (condition.type) {
      case 'health-below':
        if ('currentHealth' in target) {
          const comparison = condition.comparison || 'less';
          const value = condition.value || 0;
          if (comparison === 'less') return target.currentHealth < value;
          if (comparison === 'less-equal') return target.currentHealth <= value;
        }
        return false;

      case 'health-above':
        if ('currentHealth' in target) {
          const comparison = condition.comparison || 'greater';
          const value = condition.value || 0;
          if (comparison === 'greater') return target.currentHealth > value;
          if (comparison === 'greater-equal') return target.currentHealth >= value;
        }
        return false;

      case 'cost-below':
      case 'CostBelow':
        if ('cost' in target) {
          return target.cost < (condition.value || 0);
        }
        return false;

      case 'cost-above':
      case 'CostAbove':
        if ('cost' in target) {
          return target.cost > (condition.value || 0);
        }
        return false;

      case 'affinity-matches':
      case 'AffinityMatches':
        if ('affinity' in target) {
          return target.affinity === condition.value;
        }
        return false;

      case 'affinity-not-matches':
        if ('affinity' in target) {
          return target.affinity !== condition.value;
        }
        return false;

      case 'is-damaged':
      case 'IsDamaged':
        if ('currentHealth' in target && 'maxHealth' in target) {
          return target.currentHealth < target.maxHealth;
        }
        return false;

      case 'is-wilting':
      case 'IsWilting':
        if ('currentHealth' in target) {
          return target.currentHealth === 1;
        }
        return false;

      case 'turn-count':
      case 'TurnCount':
        // Check current turn number
        return false; // Need to add turn tracking

      case 'units-on-field':
      case 'UnitsOnField':
        // Count units on current player's field
        const unitCount = field.beasts.filter(b => b !== null).length;
        const comparison = condition.comparison || 'equal';
        const value = condition.value || 0;

        if (comparison === 'equal' || comparison === 'Equal') return unitCount === value;
        if (comparison === 'greater' || comparison === 'Greater') return unitCount > value;
        if (comparison === 'less' || comparison === 'Less') return unitCount < value;
        if (comparison === 'greater-equal' || comparison === 'GreaterEqual') return unitCount >= value;
        if (comparison === 'less-equal' || comparison === 'LessEqual') return unitCount <= value;
        return false;

      case 'resource-available':
      case 'ResourceAvailable':
        const currentPlayer = state.players[currentPlayerIndex];
        if (condition.resource === 'energy') {
          return currentPlayer.energy >= (condition.value || 0);
        }
        return false;

      default:
        console.warn(`[EffectSystem] Unknown condition type: ${condition.type}`);
        return true; // Default to true for unknown conditions
    }
  }

  private processStatModification(
    effect: any,
    state: BloomBeastsState,
    currentPlayerId: string,
    context?: any
  ): void {
    const targets = this.resolveTargets(effect.target, state, currentPlayerId, context);

    for (const target of targets) {
      // Only process if target is a beast (has stat properties)
      if ('currentAttack' in target && 'currentHealth' in target) {
        if (effect.stat === 'attack' || effect.stat === 'both') {
          target.currentAttack = Math.max(0, target.currentAttack + effect.value);
        }
        if (effect.stat === 'health' || effect.stat === 'both') {
          target.currentHealth = Math.max(0, target.currentHealth + effect.value);
          // Also increase maxHealth for permanent buffs
          if (effect.duration === 'permanent' && effect.value > 0) {
            target.maxHealth += effect.value;
          }
        }
      }
    }
  }

  /**
   * Resolve targets for an ability effect
   * Returns array of targets (beasts, players, or cards) based on target type
   */
  private resolveTargets(
    targetType: string,
    state: BloomBeastsState,
    currentPlayerId: string,
    context?: {
      sourceCard?: RuntimeBeast | RuntimeHabitat | RuntimeBuff | RuntimeTrap;
      attackerCard?: RuntimeBeast;
      targetCard?: RuntimeBeast | RuntimeCard;
      damagedCard?: RuntimeBeast;
      destroyedCard?: RuntimeBeast;
      playedCard?: RuntimeCard;
    }
  ): any[] {
    const targets: any[] = [];
    const currentPlayerIndex = state.players.findIndex(p => p.id === currentPlayerId);
    const opponentIndex = 1 - currentPlayerIndex;
    const currentField = currentPlayerIndex === 0 ? state.field.player1 : state.field.player2;
    const opponentField = currentPlayerIndex === 0 ? state.field.player2 : state.field.player1;

    switch (targetType) {
      case 'self':
        if (context?.sourceCard) {
          targets.push(context.sourceCard);
        }
        break;

      case 'all-allies':
        // All allied beasts on the field
        for (const beast of currentField.beasts) {
          if (beast !== null) {
            targets.push(beast);
          }
        }
        break;

      case 'all-enemies':
        // All enemy beasts on the field
        for (const beast of opponentField.beasts) {
          if (beast !== null) {
            targets.push(beast);
          }
        }
        break;

      case 'all-units':
        // All beasts on both fields
        for (const beast of currentField.beasts) {
          if (beast !== null) targets.push(beast);
        }
        for (const beast of opponentField.beasts) {
          if (beast !== null) targets.push(beast);
        }
        break;

      case 'adjacent-allies':
        // Adjacent allied beasts (to sourceCard)
        if (context?.sourceCard) {
          const index = currentField.beasts.findIndex(b => b && cardsMatch(b, context.sourceCard!));
          if (index !== -1) {
            if (index > 0 && currentField.beasts[index - 1]) {
              targets.push(currentField.beasts[index - 1]);
            }
            if (index < currentField.beasts.length - 1 && currentField.beasts[index + 1]) {
              targets.push(currentField.beasts[index + 1]);
            }
          }
        }
        break;

      case 'adjacent-enemies':
        // Adjacent enemy beasts (opposite to sourceCard)
        if (context?.sourceCard) {
          const index = currentField.beasts.findIndex(b => b && cardsMatch(b, context.sourceCard!));
          if (index !== -1) {
            if (opponentField.beasts[index]) {
              targets.push(opponentField.beasts[index]);
            }
          }
        }
        break;

      case 'other-ally':
        // Another allied beast (not self)
        for (const beast of currentField.beasts) {
          if (beast !== null && beast.id !== context?.sourceCard?.id) {
            targets.push(beast);
          }
        }
        break;

      case 'random-ally':
        // Random allied beast
        const allies = currentField.beasts.filter(b => b !== null);
        if (allies.length > 0) {
          const randomIndex = Math.floor(Math.random() * allies.length);
          targets.push(allies[randomIndex]);
        }
        break;

      case 'random-enemy':
        // Random enemy beast
        const enemies = opponentField.beasts.filter(b => b !== null);
        if (enemies.length > 0) {
          const randomIndex = Math.floor(Math.random() * enemies.length);
          targets.push(enemies[randomIndex]);
        }
        break;

      case 'player':
        // Current player
        targets.push(state.players[currentPlayerIndex]);
        break;

      case 'opponent':
        // Opponent player
        targets.push(state.players[opponentIndex]);
        break;

      case 'attacker':
        // The beast that attacked (from context)
        if (context?.attackerCard) {
          targets.push(context.attackerCard);
        }
        break;

      case 'attacked-enemy':
        // The enemy that was attacked (from context)
        if (context?.targetCard) {
          targets.push(context.targetCard);
        }
        break;

      case 'damaged-enemies':
        // All damaged enemy beasts
        for (const beast of opponentField.beasts) {
          if (beast !== null && beast.currentHealth < beast.maxHealth) {
            targets.push(beast);
          }
        }
        break;

      case 'wilting-enemies':
        // Enemy beasts at 1 HP
        for (const beast of opponentField.beasts) {
          if (beast !== null && beast.currentHealth === 1) {
            targets.push(beast);
          }
        }
        break;

      case 'highest-attack-enemy':
        // Enemy with highest attack
        let highestAttack = -1;
        let highestAttackBeast: RuntimeBeast | null = null;
        for (const beast of opponentField.beasts) {
          if (beast !== null && beast.currentAttack > highestAttack) {
            highestAttack = beast.currentAttack;
            highestAttackBeast = beast;
          }
        }
        if (highestAttackBeast) {
          targets.push(highestAttackBeast);
        }
        break;

      case 'lowest-health-enemy':
        // Enemy with lowest health
        let lowestHealth = Infinity;
        let lowestHealthBeast: RuntimeBeast | null = null;
        for (const beast of opponentField.beasts) {
          if (beast !== null && beast.currentHealth < lowestHealth) {
            lowestHealth = beast.currentHealth;
            lowestHealthBeast = beast;
          }
        }
        if (lowestHealthBeast) {
          targets.push(lowestHealthBeast);
        }
        break;

      case 'summoned-unit':
        // The unit that was just summoned (from context)
        if (context?.sourceCard) {
          targets.push(context.sourceCard);
        }
        break;

      case 'destroyed-unit':
        // The unit that was just destroyed (from context)
        if (context?.destroyedCard) {
          targets.push(context.destroyedCard);
        }
        break;

      case 'played-card':
        // The card that was just played (for trap responses)
        if (context?.playedCard) {
          targets.push(context.playedCard);
        }
        break;

      default:
        console.warn(`[EffectSystem] Unknown target type: ${targetType}`);
    }

    return targets;
  }

  private processStartOfTurnTriggers(state: BloomBeastsState, currentPlayerId: string): void {
    const currentPlayerIndex = state.players.findIndex(p => p.id === currentPlayerId);
    const field = currentPlayerIndex === 0 ? state.field.player1 : state.field.player2;

    // Process OnOwnStartOfTurn triggers
    for (const beast of field.beasts) {
      if (beast && beast.abilities) {
        for (const ability of beast.abilities) {
          if ('trigger' in ability && ability.trigger === 'OnOwnStartOfTurn' && 'effects' in ability && ability.effects) {
            for (const effect of ability.effects) {
              // Check condition if present
              if (!effect.condition || this.evaluateCondition(effect.condition, beast, state, currentPlayerId)) {
                this.processEffect(effect, state, currentPlayerId, {
                  sourceCard: beast
                });
              }
            }
          }
        }
      }
    }
  }

  private applyWhileOnFieldEffects(state: BloomBeastsState, currentPlayerId: string): void {
    const currentPlayerIndex = state.players.findIndex(p => p.id === currentPlayerId);
    const field = currentPlayerIndex === 0 ? state.field.player1 : state.field.player2;

    // Apply WhileOnField effects from beasts
    for (const beast of field.beasts) {
      if (beast && beast.abilities) {
        for (const ability of beast.abilities) {
          if ('trigger' in ability && ability.trigger === 'WhileOnField' && 'effects' in ability && ability.effects) {
            for (const effect of ability.effects) {
              // Check condition if present
              if (!effect.condition || this.evaluateCondition(effect.condition, beast, state, currentPlayerId)) {
                this.processEffect(effect, state, currentPlayerId, {
                  sourceCard: beast
                });
              }
            }
          }
        }
      }
    }

    // Apply WhileOnField effects from habitat
    if (field.habitat && field.habitat.abilities) {
      for (const ability of field.habitat.abilities) {
        if ('trigger' in ability && ability.trigger === 'WhileOnField' && 'effects' in ability && ability.effects) {
          for (const effect of ability.effects) {
            // Check condition if present
            if (!effect.condition || this.evaluateCondition(effect.condition, field.habitat, state, currentPlayerId)) {
              this.processEffect(effect, state, currentPlayerId, {
                sourceCard: field.habitat
              });
            }
          }
        }
      }
    }
  }

  private processEndOfTurnTriggers(state: BloomBeastsState, currentPlayerId: string): void {
    const currentPlayerIndex = state.players.findIndex(p => p.id === currentPlayerId);
    const field = currentPlayerIndex === 0 ? state.field.player1 : state.field.player2;

    // Process OnOwnEndOfTurn triggers
    for (const beast of field.beasts) {
      if (beast && beast.abilities) {
        for (const ability of beast.abilities) {
          if ('trigger' in ability && ability.trigger === 'OnOwnEndOfTurn' && 'effects' in ability && ability.effects) {
            for (const effect of ability.effects) {
              // Check condition if present
              if (!effect.condition || this.evaluateCondition(effect.condition, beast, state, currentPlayerId)) {
                this.processEffect(effect, state, currentPlayerId, {
                  sourceCard: beast
                });
              }
            }
          }
        }
      }
    }
  }

  clearExpiredEffects(state: Turbo.IGameState<TState>): void {
    // Stub implementation - clear temporary effects here
  }

  /**
   * Check and trigger traps based on action type
   * Returns list of triggered trap IDs for removal
   */
  public checkAndTriggerTraps(
    state: BloomBeastsState,
    currentPlayerId: string,
    triggerType: string,
    context?: any
  ): string[] {
    const triggeredTrapIds: string[] = [];
    const currentPlayerIndex = state.players.findIndex(p => p.id === currentPlayerId);
    const opponentIndex = 1 - currentPlayerIndex;

    // Check opponent's traps (traps trigger against the current player's actions)
    const opponentField = opponentIndex === 0 ? state.field.player1 : state.field.player2;

    for (const trap of opponentField.traps) {
      if (!trap || !trap.activation) continue;

      let shouldTrigger = false;

      // Check if trap activation matches the trigger type
      switch (trap.activation.trigger) {
        case 'OnAttack':
          shouldTrigger = triggerType === 'attack';
          break;

        case 'OnBeastPlay':
          if (triggerType === 'beast_play' && context?.card) {
            // Check activation condition (e.g., cost threshold)
            if (trap.activation.condition) {
              shouldTrigger = this.evaluateCondition(trap.activation.condition, context.card, state, currentPlayerId);
            } else {
              shouldTrigger = true;
            }
          }
          break;

        case 'OnMagicPlay':
          shouldTrigger = triggerType === 'magic_play';
          break;

        case 'OnHabitatPlay':
          shouldTrigger = triggerType === 'habitat_play';
          break;

        case 'OnDestroy':
          shouldTrigger = triggerType === 'beast_destroyed';
          break;

        default:
          console.warn(`[TrapSystem] Unknown trap trigger: ${trap.activation.trigger}`);
      }

      if (shouldTrigger) {
        // Trigger trap abilities
        if (trap.abilities) {
          for (const ability of trap.abilities) {
            if ('trigger' in ability && ability.trigger === 'OnSummon' && 'effects' in ability && ability.effects) {
              for (const effect of ability.effects) {
                // Traps are controlled by opponent, so use opponent's player ID
                const opponentPlayerId = state.players[opponentIndex].id;
                this.processEffect(effect, state, opponentPlayerId, {
                  sourceCard: trap,
                  playedCard: context?.card,
                  attackerCard: context?.attacker,
                  targetCard: context?.target
                });
              }
            }
          }
        }

        // Mark trap for removal
        triggeredTrapIds.push(trap.id);
      }
    }

    return triggeredTrapIds;
  }

  /**
   * Remove triggered traps from the field
   */
  public removeTriggeredTraps(state: BloomBeastsState, opponentIndex: number, trapIds: string[]): void {
    if (trapIds.length === 0) return;

    const opponentField = opponentIndex === 0 ? state.field.player1 : state.field.player2;
    const opponent = state.players[opponentIndex];

    // Remove traps and add to graveyard
    opponentField.traps = opponentField.traps.filter(trap => {
      if (trap && trapIds.includes(trap.id)) {
        opponent.graveyard.push(trap);
        return false;
      }
      return true;
    });
  }
}

// Types are defined in ./types.ts to avoid circular dependencies
// Note: Export statements removed for namespace bundling - types are available via imports
// export type { BloomBeastsState, BloomBeastsActionData, BloomBeastsPlayer, RuntimeBeast, RuntimeCard } from './types';
// export { BloomBeastsActionType } from './types';

/**
 * BloomBeasts game configuration
 */
export interface BloomBeastsConfig {
  startingHandSize: number;
  maxFieldBeasts: number;
  maxFieldBuffs: number;
  maxFieldTraps: number;
  startingHealth: number;
  maxEnergy: number;
}

/**
 * Default game configuration
 */
const DEFAULT_CONFIG: BloomBeastsConfig = {
  startingHandSize: 3,
  maxFieldBeasts: 3,
  maxFieldBuffs: 3,
  maxFieldTraps: 3,
  startingHealth: 30,
  maxEnergy: 10,
};

/**
 * BloomBeasts game rules implementation
 */
export class BloomBeastsRules implements Turbo.IGameRules<BloomBeastsState, BloomBeastsActionData> {
  private config: BloomBeastsConfig;
  private effectSystem: EffectSystem<BloomBeastsState>;
  private actionHandlers: ActionHandlerRegistry;
  private winConditionChecker: WinConditionChecker;

  constructor(config: Partial<BloomBeastsConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.effectSystem = new EffectSystem<BloomBeastsState>();
    this.actionHandlers = new ActionHandlerRegistry();
    this.winConditionChecker = new WinConditionChecker();

    // Register action handlers
    this.actionHandlers.registerAll([
      new DrawCardActionHandler(),
      new PlayCardActionHandler(),
      new AttackActionHandler(),
      new EndTurnActionHandler(),
      new TimeoutActionHandler(),
      new ForfeitActionHandler(),
    ]);

    this.registerEffectHandlers();
  }

  /**
   * Initialize the game state
   */
  createInitialState(config: Turbo.IGameConfig): Turbo.IGameState<BloomBeastsState> {
    const players = config.players.map(p => this.createPlayer(p));

    // Shuffle decks and draw starting hands
    players.forEach(player => {
      player.deck = shuffle(player.deck);
      for (let i = 0; i < this.config.startingHandSize; i++) {
        this.drawCard(player);
      }
    });

    const gameData: BloomBeastsState = {
      players,
      field: {
        player1: {
          beasts: [null, null, null],
          buffs: [null, null, null],
          habitat: null,
          traps: [],
        },
        player2: {
          beasts: [null, null, null],
          buffs: [null, null, null],
          habitat: null,
          traps: [],
        },
      },
      currentTurnActions: {
        hasDrawnCard: false,
        cardsPlayed: 0,
        hasAttacked: new Set(),
      },
    };

    // Give first player 1 energy to start the game
    players[0].energy = 1;

    return {
      gameData,
      turnInfo: {
        turnNumber: 1,
        currentPlayerId: players[0].id,
        movesThisTurn: 0,
        timeStarted: Date.now(),
      },
      players: config.players,
      phase: Turbo.GamePhase.PLAYING,
      isComplete: false,
    };
  }

  /**
   * Validate if an action can be performed
   *
   * This now delegates to action handlers for validation.
   * Handlers contain all the validation logic specific to each action type.
   */
  validateAction(
    action: Turbo.IGameAction<BloomBeastsActionData>,
    state: Turbo.IGameState<BloomBeastsState>
  ): Turbo.IActionValidation {
    // Check if it's the current player's turn
    const currentPlayerIndex = this.getCurrentPlayerIndex(state);
    const currentPlayer = state.gameData!.players[currentPlayerIndex];

    if (action.playerId !== currentPlayer.id) {
      return { isValid: false, reason: 'Not your turn' };
    }

    // Get the appropriate handler
    const handler = this.actionHandlers.get(action.data.type);
    if (!handler) {
      return { isValid: false, reason: 'Unknown action type' };
    }

    // Delegate validation to the handler
    const validation = handler.validate(action.data, state, action.playerId);

    return {
      isValid: validation.valid,
      reason: !validation.valid ? validation.reason : undefined,
    };
  }

  /**
   * Execute an action and return the new state
   *
   * This is now a simple dispatcher that delegates to action handlers.
   * All action-specific logic, event generation, and trigger processing
   * is handled by the respective action handlers.
   */
  executeAction(
    action: Turbo.IGameAction<BloomBeastsActionData>,
    state: Turbo.IGameState<BloomBeastsState>
  ): Turbo.IActionResult<BloomBeastsState> {
    try {
      // Get the appropriate handler
      const handler = this.actionHandlers.get(action.data.type);
      if (!handler) {
        return {
          success: false,
          error: new Error(`No handler found for action type: ${action.data.type}`),
        };
      }

      // Validate the action
      const validation = handler.validate(action.data, state, action.playerId);
      if (!validation.valid) {
        const reason = 'reason' in validation ? validation.reason : 'Validation failed';
        return {
          success: false,
          error: new Error(reason),
        };
      }

      // Create context with trigger and effect processing functions
      const context = {
        processTriggers: (timing: string, newState: Turbo.IGameState<BloomBeastsState>, ctx?: TriggerContext) => {
          this.processTriggers(timing as TriggerTiming, newState, ctx);
        },
        processMagicCard: (card: MagicCard, newState: Turbo.IGameState<BloomBeastsState>) => {
          this.processMagicCard(card, newState);
        },
        checkTraps: (state: BloomBeastsState, playerId: string, triggerType: string, trapContext?: any) => {
          const triggeredTrapIds = this.effectSystem.checkAndTriggerTraps(state, playerId, triggerType, trapContext);
          if (triggeredTrapIds.length > 0) {
            const playerIndex = state.players.findIndex(p => p.id === playerId);
            const opponentIndex = 1 - playerIndex;
            this.effectSystem.removeTriggeredTraps(state, opponentIndex, triggeredTrapIds);
          }
        },
      };

      // Execute the action - handler returns full result with events
      const result = handler.execute(action.data, state, action.playerId, context);

      return result;
    } catch (error) {
      Logger.error('[BloomBeastsGame] Action execution failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  }

  /**
   * Check if the game has ended
   *
   * Delegates to WinConditionChecker for all win condition logic
   */
  checkEndCondition(state: Turbo.IGameState<BloomBeastsState>): { isEnded: boolean; winnerId?: string; reason?: string } {
    // Check if game should end using WinConditionChecker
    if (!this.winConditionChecker.shouldGameEnd(state)) {
      return { isEnded: false };
    }

    // Game should end - determine winner and reason
    const winnerId = this.winConditionChecker.getWinnerId(state) ?? undefined;

    // Determine reason based on state
    let reason = 'Victory';

    if (state.gameData.suddenEnd) {
      const reasonMap = {
        'timeout': 'Timeout',
        'forfeit': 'Forfeit',
        'disconnect': 'Disconnect'
      };
      reason = reasonMap[state.gameData.suddenEnd.reason] || 'Unknown';
    } else {
      const players = state.gameData!.players;
      const aliveByHealth = players.filter(p => p.health > 0);
      if (aliveByHealth.length < 2) {
        reason = 'Opponent eliminated';
      } else {
        reason = 'Opponent decked out';
      }
    }

    return { isEnded: true, winnerId, reason };
  }

  /**
   * Get valid actions for the current player
   */
  getValidActions(state: Turbo.IGameState<BloomBeastsState>): Turbo.IGameAction<BloomBeastsActionData>[] {
    const actions: Turbo.IGameAction<BloomBeastsActionData>[] = [];
    const currentPlayer = state.gameData!.players[this.getCurrentPlayerIndex(state)];


    // Draw card action
    if (!state.gameData!.currentTurnActions.hasDrawnCard && currentPlayer.deck.length > 0) {
      actions.push({
        type: 'game_action',
        playerId: currentPlayer.id,
        data: { type: BloomBeastsActionType.DRAW_CARD },
      });
    }

    // Play card actions
    currentPlayer.hand.forEach(card => {
      if (card.cost <= currentPlayer.energy) {
        const positions = this.getValidPositionsForCard(card, state);
        positions.forEach(position => {
          actions.push({
            type: 'game_action',
            playerId: currentPlayer.id,
            data: {
              type: BloomBeastsActionType.PLAY_CARD,
              cardId: card.id,
              position,
            },
          });
        });
      }
    });

    // Attack actions
    const field = this.getCurrentPlayerIndex(state) === 0 ? state.gameData!.field.player1 : state.gameData!.field.player2;
    field.beasts.forEach(beast => {
      if (beast && !beast.summoningSickness) {
        const beastId = getCardIdentifier(beast);
        if (!state.gameData!.currentTurnActions.hasAttacked.has(beastId)) {
          const targets = this.getValidAttackTargets(beast, state);
          targets.forEach(targetId => {
            actions.push({
              type: 'game_action',
              playerId: currentPlayer.id,
              data: {
                type: BloomBeastsActionType.ATTACK,
                cardId: beastId,
                targetId,
              },
            });
          });
        }
      }
    });

    // End turn action (always available)
    actions.push({
      type: 'game_action',
      playerId: currentPlayer.id,
      data: { type: BloomBeastsActionType.END_TURN },
    });

    return actions;
  }

  /**
   * Handle phase transitions
   */
  getNextPhase(currentPhase: string, state: Turbo.IGameState<BloomBeastsState>): string {
    // BloomBeasts has a simple phase structure
    return 'main';
  }

  /**
   * Private helper methods
   */

  private getCurrentPlayerIndex(state: Turbo.IGameState<BloomBeastsState>): number {
    const currentPlayerId = state.turnInfo!.currentPlayerId;
    return state.gameData!.players.findIndex(p => p.id === currentPlayerId);
  }

  private createPlayer(config: Turbo.IPlayer): BloomBeastsPlayer {
    // Get deck from metadata - should already be RuntimeCard[] from BattleController
    const deck = (config.metadata?.deck as RuntimeCard[]) || [];
    return {
      id: config.id,
      name: config.name,
      health: this.config.startingHealth,
      energy: 0,
      deck: [...deck],
      hand: [],
      graveyard: [],
      maxHandSize: 10,
      maxHealth: this.config.startingHealth,
    };
  }

  private drawCard(player: BloomBeastsPlayer): RuntimeCard | null {
    if (player.deck.length === 0) {
      return null;
    }

    const card = player.deck.shift()!;
    player.hand.push(card);
    return card;
  }

  private getValidPositionsForCard(card: RuntimeCard, state: Turbo.IGameState<BloomBeastsState>): number[] {
    const positions: number[] = [];
    const field = this.getCurrentPlayerIndex(state) === 0 ? state.gameData!.field.player1 : state.gameData!.field.player2;

    switch (card.type) {
      case 'Beast':
        field.beasts.forEach((slot, index) => {
          if (slot === null) {
            positions.push(index);
          }
        });
        break;

      case 'Buff':
        field.buffs.forEach((slot, index) => {
          if (slot === null) {
            positions.push(index);
          }
        });
        break;

      case 'Trap':
      case 'Habitat':
      case 'Magic':
        positions.push(0); // Single valid position for these
        break;
    }

    return positions;
  }

  private findBeastOnField(beastId: string, state: Turbo.IGameState<BloomBeastsState>): RuntimeBeast | null {
    for (const field of [state.gameData!.field.player1, state.gameData!.field.player2]) {
      for (const beast of field.beasts) {
        if (beast && cardMatchesId(beast, beastId)) {
          return beast;
        }
      }
    }
    return null;
  }

  private getValidAttackTargets(beast: RuntimeBeast, state: Turbo.IGameState<BloomBeastsState>): string[] {
    const targets: string[] = [];
    const currentPlayerIndex = this.getCurrentPlayerIndex(state);
    const currentField = currentPlayerIndex === 0 ? state.gameData!.field.player1 : state.gameData!.field.player2;
    const opponentField = currentPlayerIndex === 0 ? state.gameData!.field.player2 : state.gameData!.field.player1;

    // Find the slot index of the attacking beast
    const slotIndex = currentField.beasts.findIndex(b => b && cardsMatch(b, beast));
    if (slotIndex === -1) {
      return targets; // Beast not found on field
    }

    // Check if opponent has a beast in the same slot
    const opponentBeast = opponentField.beasts[slotIndex];
    if (opponentBeast) {
      // Attack the beast in the opposite slot
      targets.push(getCardIdentifier(opponentBeast));
    } else {
      // No beast in opposite slot, attack the player
      const opponentPlayer = state.gameData!.players[1 - currentPlayerIndex];
      targets.push(opponentPlayer.id);
    }

    return targets;
  }

  private processMagicCard(card: MagicCard, state: Turbo.IGameState<BloomBeastsState>): void {
    // Process magic card effects
    if (!card.abilities || card.abilities.length === 0) {
      return;
    }

    // Get current player
    const currentPlayerIndex = this.getCurrentPlayerIndex(state);
    const currentPlayer = state.gameData.players[currentPlayerIndex];

    // Process each ability
    card.abilities.forEach(ability => {
      // Type guard: check if this is a StructuredAbility with effects
      if ('effects' in ability && ability.effects) {
        ability.effects.forEach((effect: any) => {
          // Handle GainResource effects (for Energy Block, Energy Surge, etc.)
          if (effect.type === 'gain-resource' && effect.resource === 'energy') {
            const value = effect.value || 0;
            currentPlayer.energy = Math.min(
              currentPlayer.energy + value,
              this.config.maxEnergy
            );
          }
          // Handle DrawCards effects
          else if (effect.type === 'draw-cards') {
            const cardsToDraw = effect.value || 1;
            for (let i = 0; i < cardsToDraw; i++) {
              if (currentPlayer.deck.length > 0 && currentPlayer.hand.length < currentPlayer.maxHandSize) {
                const drawnCard = currentPlayer.deck.shift()!;
                currentPlayer.hand.push(drawnCard);
              }
            }
          }
          // Add more effect handlers here as needed
        });
      }
    });
  }

  private processTriggers(
    timing: TriggerTiming,
    state: Turbo.IGameState<BloomBeastsState>,
    context?: TriggerContext
  ): void {
    // Process triggers using the effect system
    const result = this.effectSystem.processEffects(timing, state, context);
    if (result.success && result.newState) {
      // Update state with processed effects
      Object.assign(state, result.newState);
    }
  }

  private registerEffectHandlers(): void{
    // Register effect handlers for BloomBeasts-specific effects
    // This would include handlers for abilities like:
    // - Stat modifications
    // - Damage effects
    // - Healing
    // - Card draw
    // - etc.
  }
}

/**
 * Factory function to create a BloomBeasts game instance
 */
export function createBloomBeastsGame(config?: Partial<BloomBeastsConfig>): Turbo.GameController<BloomBeastsState, BloomBeastsActionData> {
  const rules = new BloomBeastsRules(config);
  return new Turbo.GameController(rules);
}

// Export types for regular module bundling (web deployment)
// Note: These exports are fine for namespace bundling too
export type {
  BloomBeastsState,
  BloomBeastsActionData,
  BloomBeastsPlayer,
  RuntimeBeast,
  RuntimeCard,
  RuntimeHabitat,
  RuntimeBuff,
  RuntimeTrap,
} from './types';
export { BloomBeastsActionType } from './types';