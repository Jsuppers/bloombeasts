/**
 * OpponentAI - Handles AI decision making for opponent players
 *
 * Responsibilities:
 * - Card play decisions (which cards to play, when to play them)
 * - Attack decisions (target selection, when to attack)
 * - Resource management (nectar spending)
 * - Turn sequencing with delays for UI visibility
 */

import { Player } from '../../engine/types/game';
import { Logger } from '../../engine/utils/Logger';
import { pickRandom } from '../../engine/utils/random';
import type { AsyncMethods } from '../../ui/types/bindings';

export interface AICallbacks {
  async: AsyncMethods;
  onAction?: (action: string) => void;
  onRender?: () => void;
}

export interface AIDecision {
  type: 'play-card' | 'attack-beast' | 'attack-player' | 'end-turn';
  cardIndex?: number;
  attackerIndex?: number;
  targetIndex?: number;
  card?: any;
}

export class OpponentAI {
  private callbacks: AICallbacks;
  private async: AsyncMethods;

  constructor(callbacks: AICallbacks) {
    this.callbacks = callbacks;
    this.async = callbacks.async;
  }

  /**
   * Execute a full AI turn
   * @param opponent The AI player
   * @param player The human player
   * @param gameState Current game state (for habitat zone, turn number, etc.)
   * @param effectProcessors Functions to process various effects
   * @param shouldStopGetter Function that returns true if AI should stop processing
   */
  async executeTurn(
    opponent: Player,
    player: Player,
    gameState: any,
    effectProcessors: {
      processOnSummonTrigger: (beast: any, owner: any, opponent: any) => void;
      processOnAttackTrigger: (beast: any, owner: any, opponent: any) => void;
      processOnDamageTrigger: (beast: any, owner: any, opponent: any) => void;
      processOnDestroyTrigger: (beast: any, owner: any, opponent: any) => void;
      processMagicEffect: (effect: any, player: any, opponent: any) => void;
      processHabitatEffect: (effect: any, player: any, opponent: any) => void;
      applyStatBuffEffects: (player: any) => void;
    },
    shouldStopGetter?: () => boolean
  ): Promise<void> {
    const delay = (ms: number) => new Promise(resolve => this.async.setTimeout(resolve, ms));

    // Play cards phase
    const cardDecisions = this.decideCardPlays(opponent, player, gameState);
    for (const decision of cardDecisions) {
      if (shouldStopGetter && shouldStopGetter()) return; // Stop if battle ended

      await this.executeCardPlay(
        decision,
        opponent,
        player,
        gameState,
        effectProcessors
      );
      if (this.callbacks.onRender) this.callbacks.onRender();

      // Longer delay for non-Bloom cards to show popup
      const delayTime = decision.card?.type === 'Bloom' ? 1200 : 3500;
      await delay(delayTime);

      if (shouldStopGetter && shouldStopGetter()) return; // Stop if battle ended
    }

    // Attack phase
    const attackDecisions = this.decideAttacks(opponent, player);
    for (const decision of attackDecisions) {
      if (shouldStopGetter && shouldStopGetter()) return; // Stop if battle ended

      await this.executeAttack(
        decision,
        opponent,
        player,
        effectProcessors
      );
      if (this.callbacks.onRender) this.callbacks.onRender();
      await delay(1000);

      if (shouldStopGetter && shouldStopGetter()) return; // Stop if battle ended

      // Check if player was defeated during attack
      if (player.health <= 0) {
        return; // Stop turn processing
      }
    }

    Logger.debug('Opponent turn ended');
  }

  /**
   * Decide which cards to play this turn
   */
  private decideCardPlays(opponent: Player, player: Player, gameState: any): AIDecision[] {
    const decisions: AIDecision[] = [];

    // Simple greedy AI: Play cards from hand if affordable and field has space
    for (let i = opponent.hand.length - 1; i >= 0; i--) {
      const card: any = opponent.hand[i];

      if (card.cost <= opponent.currentNectar) {
        if (card.type === 'Bloom' && opponent.field.length < 3) {
          decisions.push({
            type: 'play-card',
            cardIndex: i,
            card: card,
          });
          opponent.currentNectar -= card.cost; // Deduct for decision calculation
        } else if (card.type === 'Magic') {
          decisions.push({
            type: 'play-card',
            cardIndex: i,
            card: card,
          });
          opponent.currentNectar -= card.cost;
        } else if (card.type === 'Trap' && opponent.trapZone.length < 3) {
          decisions.push({
            type: 'play-card',
            cardIndex: i,
            card: card,
          });
          opponent.currentNectar -= card.cost;
        } else if (card.type === 'Buff' && opponent.buffZone.length < 2) {
          decisions.push({
            type: 'play-card',
            cardIndex: i,
            card: card,
          });
          opponent.currentNectar -= card.cost;
        } else if (card.type === 'Habitat' && !gameState.habitatZone) {
          decisions.push({
            type: 'play-card',
            cardIndex: i,
            card: card,
          });
          opponent.currentNectar -= card.cost;
        }
      }
    }

    return decisions;
  }

  /**
   * Execute a card play decision
   */
  private async executeCardPlay(
    decision: AIDecision,
    opponent: Player,
    player: Player,
    gameState: any,
    effectProcessors: any
  ): Promise<void> {
    if (decision.cardIndex === undefined) return;

    const card: any = opponent.hand[decision.cardIndex];
    if (!card) return;

    const playedCard: any = opponent.hand.splice(decision.cardIndex, 1)[0];
    // Note: Nectar already deducted in decision phase

    switch (playedCard.type) {
      case 'Bloom':
        const beastInstance: any = {
          cardId: playedCard.id,
          instanceId: playedCard.instanceId || `${playedCard.id}-${Date.now()}`,
          currentLevel: 1 as any,
          currentXP: 0,
          baseAttack: playedCard.baseAttack,
          baseHealth: playedCard.baseHealth,
          currentAttack: playedCard.baseAttack,
          currentHealth: playedCard.baseHealth,
          maxHealth: playedCard.baseHealth,
          statusEffects: [],
          slotIndex: opponent.field.length,
          summoningSickness: true,
          usedAbilityThisTurn: false,
          statModifiers: [],
          // Store original card data for display
          type: 'Bloom',
          name: playedCard.name,
          affinity: playedCard.affinity,
          cost: playedCard.cost,
          ability: playedCard.abilities && playedCard.abilities.length > 0 ? playedCard.abilities[0] : undefined,
        };

        // Initialize stat system (beasts need this even before buffs are applied)
        opponent.field.push(beastInstance);
        effectProcessors.applyStatBuffEffects(opponent);
        effectProcessors.processOnSummonTrigger(beastInstance, opponent, player);

        Logger.debug(`Opponent played ${playedCard.name}`);
        if (this.callbacks.onAction) this.callbacks.onAction('play-card');
        break;

      case 'Magic':
        if (playedCard.effects && Array.isArray(playedCard.effects)) {
          for (const effect of playedCard.effects) {
            effectProcessors.processMagicEffect(effect, opponent, player);
          }
        }
        opponent.graveyard.push(playedCard);
        Logger.debug(`Opponent played magic card: ${playedCard.name}`);
        if (this.callbacks.onAction) {
          this.callbacks.onAction(`play-magic-card:${JSON.stringify(playedCard)}`);
        }
        break;

      case 'Trap':
        opponent.trapZone.push(playedCard);
        Logger.debug(`Opponent set trap: ${playedCard.name}`);
        if (this.callbacks.onAction) {
          this.callbacks.onAction(`play-trap-card:${JSON.stringify(playedCard)}`);
        }
        break;

      case 'Buff':
        opponent.buffZone.push(playedCard);
        effectProcessors.applyStatBuffEffects(opponent);
        Logger.debug(`Opponent played buff: ${playedCard.name}`);
        if (this.callbacks.onAction) {
          this.callbacks.onAction(`play-buff-card:${JSON.stringify(playedCard)}`);
        }
        break;

      case 'Habitat':
        gameState.habitatZone = playedCard;
        if (playedCard.onPlayEffects && Array.isArray(playedCard.onPlayEffects)) {
          for (const effect of playedCard.onPlayEffects) {
            effectProcessors.processHabitatEffect(effect, opponent, player);
          }
        }
        Logger.debug(`Opponent played habitat: ${playedCard.name}`);
        if (this.callbacks.onAction) {
          this.callbacks.onAction(`play-habitat-card:${JSON.stringify(playedCard)}`);
        }
        break;
    }
  }

  /**
   * Decide which beasts should attack
   */
  private decideAttacks(opponent: Player, player: Player): AIDecision[] {
    const decisions: AIDecision[] = [];

    // Attack with all beasts that can attack
    for (let index = 0; index < opponent.field.length; index++) {
      const beast: any = opponent.field[index];

      if (beast && !beast.summoningSickness) {
        if (player.field.length > 0) {
          // Attack a random player beast
          const target: any = pickRandom(player.field);
          const targetIndex = target ? player.field.indexOf(target) : -1;

          if (target && targetIndex >= 0) {
            decisions.push({
              type: 'attack-beast',
              attackerIndex: index,
              targetIndex: targetIndex,
            });
          }
        } else {
          // Attack player directly
          decisions.push({
            type: 'attack-player',
            attackerIndex: index,
          });
        }
      }
    }

    return decisions;
  }

  /**
   * Execute an attack decision
   */
  private async executeAttack(
    decision: AIDecision,
    opponent: Player,
    player: Player,
    effectProcessors: any
  ): Promise<void> {
    if (decision.attackerIndex === undefined) return;

    const attacker: any = opponent.field[decision.attackerIndex];
    if (!attacker) return;

    if (decision.type === 'attack-beast' && decision.targetIndex !== undefined) {
      const target: any = player.field[decision.targetIndex];
      if (!target) return;

      Logger.debug(`Opponent's ${attacker.name} attacks ${target.name}`);

      effectProcessors.processOnAttackTrigger(attacker, opponent, player);

      if (this.callbacks.onAction) {
        this.callbacks.onAction(`attack-beast-opponent-${decision.attackerIndex}-player-${decision.targetIndex}`);
      }

      // Deal damage to each other
      const opponentBeastDamage = attacker.currentAttack || 0;
      const playerBeastDamage = target.currentAttack || 0;

      target.currentHealth -= opponentBeastDamage;
      attacker.currentHealth -= playerBeastDamage;

      // Process OnDamage triggers
      if (opponentBeastDamage > 0) {
        effectProcessors.processOnDamageTrigger(target, player, opponent);
      }
      if (playerBeastDamage > 0) {
        effectProcessors.processOnDamageTrigger(attacker, opponent, player);
      }

      // Remove dead beasts
      if (target.currentHealth <= 0) {
        effectProcessors.processOnDestroyTrigger(target, player, opponent);
        player.field.splice(decision.targetIndex, 1);
        Logger.debug(`${target.name} was defeated!`);
      }
      if (attacker.currentHealth <= 0) {
        effectProcessors.processOnDestroyTrigger(attacker, opponent, player);
        opponent.field.splice(decision.attackerIndex, 1);
        Logger.debug(`Opponent's ${attacker.name} was defeated!`);
      }

    } else if (decision.type === 'attack-player') {
      const damage = attacker.currentAttack || 0;

      effectProcessors.processOnAttackTrigger(attacker, opponent, player);

      const previousHealth = player.health;
      player.health -= damage;
      Logger.debug(`Opponent's ${attacker.name} attacks you directly for ${damage} damage!`);

      // Check for low health threshold (10%)
      const healthPercentage = (player.health / (player.maxHealth || 30)) * 100;
      if (healthPercentage <= 10 && previousHealth > player.health) {
        if (this.callbacks.onAction) {
          this.callbacks.onAction('player-low-health');
        }
      }

      if (this.callbacks.onAction) {
        this.callbacks.onAction(`attack-player-opponent-${decision.attackerIndex}`);
      }
    }
  }
}
