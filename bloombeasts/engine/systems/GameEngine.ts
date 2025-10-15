/**
 * Game Engine - Main game controller and state manager
 */

import { GameState, Player, Phase, BloomBeastInstance } from '../types/game';
import { AnyCard, BloomBeastCard, TrapCard, MagicCard, HabitatCard, TrapTrigger } from '../types/core';
import { CombatSystem } from './CombatSystem';
import { AbilityProcessor } from './AbilityProcessor';
import { LevelingSystem } from './LevelingSystem';
import { DeckList } from '../utils/deckBuilder';
import { SimpleMap } from '../../utils/polyfills';
import { getAllCards } from '../cards';
import {
  AbilityEffect,
  EffectType,
  AbilityTarget,
  ResourceType
} from '../types/abilities';
import { Logger } from '../utils/Logger';
import { STARTING_HEALTH, MAX_NECTAR, FIELD_SIZE } from '../constants/gameRules';

export interface MatchOptions {
  player1Name?: string;
  player2Name?: string;
  turnTimeLimit?: number;
  maxTurns?: number;
}

export class GameEngine {
  private gameState: GameState;
  private combatSystem: CombatSystem;
  private abilityProcessor: AbilityProcessor;
  private levelingSystem: LevelingSystem;
  private cardDatabase: Map<string, AnyCard>;

  constructor() {
    this.gameState = this.createInitialState();
    this.combatSystem = new CombatSystem();
    this.abilityProcessor = new AbilityProcessor();
    this.levelingSystem = new LevelingSystem();
    this.cardDatabase = this.buildCardDatabase();
  }

  /**
   * Build card database from all card definitions
   */
  private buildCardDatabase(): Map<string, AnyCard> {
    const db = new Map<string, AnyCard>();
    const allCards = getAllCards();
    allCards.forEach((card: any) => {
      if (card && card.id && card.type) {
        db.set(card.id, card as AnyCard);
      }
    });
    return db;
  }

  /**
   * Create initial game state
   */
  private createInitialState(): GameState {
    return {
      turn: 1,
      phase: 'Setup',
      activePlayer: 0,
      players: [
        this.createPlayer('Player 1'),
        this.createPlayer('Player 2'),
      ],
      habitatZone: null,
      turnHistory: [],
    };
  }

  /**
   * Create a new player
   */
  private createPlayer(name: string): Player {
    return {
      name,
      health: STARTING_HEALTH,
      currentNectar: 0,
      deck: [],
      hand: [],
      field: Array(FIELD_SIZE).fill(null),
      trapZone: Array(FIELD_SIZE).fill(null),
      buffZone: [null, null],
      graveyard: [],
      summonsThisTurn: 0,
      habitatCounters: new SimpleMap(),
    };
  }

  /**
   * Start a new match
   */
  public async startMatch(
    player1Deck: DeckList,
    player2Deck: DeckList,
    options: MatchOptions = {}
  ): Promise<void> {
    Logger.debug('Starting new match...');

    // Set player names
    if (options.player1Name) {
      this.gameState.players[0].name = options.player1Name;
    }
    if (options.player2Name) {
      this.gameState.players[1].name = options.player2Name;
    }

    // Load decks
    this.gameState.players[0].deck = [...player1Deck.cards];
    this.gameState.players[1].deck = [...player2Deck.cards];

    // Shuffle decks
    this.shuffleDeck(this.gameState.players[0]);
    this.shuffleDeck(this.gameState.players[1]);

    // Draw initial hands
    this.drawCards(this.gameState.players[0], 5);
    this.drawCards(this.gameState.players[1], 5);

    // Start first turn
    this.gameState.phase = 'Main';
    await this.startTurn();
  }

  /**
   * Start a new turn
   */
  private async startTurn(): Promise<void> {
    const activePlayer = this.gameState.players[this.gameState.activePlayer];

    Logger.debug(`Turn ${this.gameState.turn}: ${activePlayer.name}'s turn`);

    // Reset turn counters
    activePlayer.summonsThisTurn = 0;

    // Draw card (except first turn)
    if (this.gameState.turn > 1) {
      this.drawCards(activePlayer, 1);
    }

    // Gain nectar
    activePlayer.currentNectar = Math.min(MAX_NECTAR, this.gameState.turn);

    // Trigger start of turn abilities
    await this.triggerStartOfTurnAbilities();

    // Set phase to main
    this.gameState.phase = 'Main';
  }

  /**
   * End current turn
   */
  public async endTurn(): Promise<void> {
    // Trigger end of turn abilities
    await this.triggerEndOfTurnAbilities();

    // Switch active player
    this.gameState.activePlayer = this.gameState.activePlayer === 0 ? 1 : 0;

    // Increment turn counter when player 2 ends
    if (this.gameState.activePlayer === 0) {
      this.gameState.turn++;
    }

    // Check win conditions
    const result = this.combatSystem.checkWinCondition(this.gameState);
    if (result) {
      this.endMatch(result);
      return;
    }

    // Start next turn
    await this.startTurn();
  }

  /**
   * Summon a beast to the field
   */
  public summonBeast(
    player: Player,
    beastCard: AnyCard,
    position: number
  ): boolean {
    if (position < 0 || position > 2) {
      Logger.error('Invalid field position');
      return false;
    }

    if (player.field[position] !== null) {
      Logger.error('Field position already occupied');
      return false;
    }

    if (player.summonsThisTurn >= 1) {
      Logger.error('Already summoned this turn');
      return false;
    }

    // Create beast instance
    const instance: BloomBeastInstance = {
      instanceId: `${beastCard.id}-${Date.now()}`,
      cardId: beastCard.id,
      name: beastCard.name,
      affinity: (beastCard as any).affinity || 'Generic',
      currentLevel: 1,
      currentXP: 0,
      baseAttack: (beastCard as any).baseAttack || 0,
      baseHealth: (beastCard as any).baseHealth || 0,
      currentAttack: (beastCard as any).baseAttack || 0,
      currentHealth: (beastCard as any).baseHealth || 0,
      maxHealth: (beastCard as any).baseHealth || 0,
      statusEffects: [],
      counters: [],
      summoningSickness: true,
      slotIndex: position,
    };

    // Place on field
    player.field[position] = instance;
    player.summonsThisTurn++;

    // Apply passive abilities immediately
    this.applyPassiveAbilities(instance);

    // Trigger summon abilities on the summoned beast
    this.triggerSummonAbilities(instance);

    // Trigger OnAllySummon abilities on other beasts
    this.triggerAllySummonAbilities(instance, player);

    return true;
  }

  /**
   * Play a card from hand
   */
  public async playCard(
    player: Player,
    cardIndex: number,
    target?: any
  ): Promise<boolean> {
    if (cardIndex < 0 || cardIndex >= player.hand.length) {
      Logger.error('Invalid card index');
      return false;
    }

    const card = player.hand[cardIndex];

    // Check nectar cost
    if (card.cost > player.currentNectar) {
      Logger.error('Not enough nectar');
      return false;
    }

    // Pay cost
    player.currentNectar -= card.cost;

    // Remove from hand
    player.hand.splice(cardIndex, 1);

    // Handle based on card type
    switch (card.type) {
      case 'Bloom':
        // Check for traps before playing
        await this.checkTraps('OnBloomPlay', player, { bloomCard: card });

        // Find empty field position
        const emptyPos = player.field.findIndex(slot => slot === null);
        if (emptyPos !== -1) {
          return this.summonBeast(player, card, emptyPos);
        }
        player.graveyard.push(card);
        break;

      case 'Habitat':
        // Check for traps before playing
        const trapData = { habitatCard: card, countered: false };
        await this.checkTraps('OnHabitatPlay', player, trapData);

        // Only apply habitat if not countered
        if (!trapData.countered) {
          // Replace current habitat
          if (this.gameState.habitatZone) {
            player.graveyard.push(this.gameState.habitatZone);
          }
          this.gameState.habitatZone = card;
          Logger.debug(`Played habitat: ${card.name}`);
          // Apply habitat effects
          this.applyHabitatEffects();
        } else {
          // Countered - send to graveyard
          player.graveyard.push(card);
        }
        break;

      case 'Magic':
        // Execute magic card effect immediately
        this.processMagicCard(card as MagicCard, player, target);
        player.graveyard.push(card);
        Logger.debug(`Played magic card: ${card.name}`);
        break;

      case 'Trap':
        // Place trap card face-down in trap zone
        const emptyTrapSlot = player.trapZone.findIndex(slot => slot === null);
        if (emptyTrapSlot !== -1) {
          player.trapZone[emptyTrapSlot] = card;
          Logger.debug(`Set trap card: ${card.name}`);
        } else {
          // No trap slots available, send to graveyard
          Logger.debug('No trap slots available');
          player.graveyard.push(card);
        }
        break;

      case 'Buff':
        // Place buff card in buff zone
        const emptyBuffSlot = player.buffZone.findIndex(slot => slot === null);
        if (emptyBuffSlot !== -1) {
          player.buffZone[emptyBuffSlot] = card;
          Logger.debug(`Played buff card: ${card.name}`);
          // TODO: Apply ongoing buff effects to beasts
        } else {
          // No buff slots available, send to graveyard
          Logger.debug('No buff slots available');
          player.graveyard.push(card);
        }
        break;
    }

    return true;
  }

  /**
   * Process magic card effects using structured effects
   */
  private processMagicCard(card: MagicCard, player: Player, target?: any): void {
    const opponent = this.gameState.players[this.gameState.activePlayer === 0 ? 1 : 0];

    // Process each effect in the magic card
    for (const effect of card.effects) {
      switch (effect.type) {
        case EffectType.GainResource:
          if (effect.resource === ResourceType.Nectar) {
            player.currentNectar = Math.min(MAX_NECTAR, player.currentNectar + effect.value);
          }
          break;

        case EffectType.DrawCards:
          this.drawCards(player, effect.value);
          break;

        case EffectType.RemoveCounter:
          // Remove counters based on target
          if (effect.target === AbilityTarget.AllUnits) {
            // Remove from all beasts on both sides
            for (const beast of player.field) {
              if (beast) {
                if (effect.counter) {
                  // Remove specific counter type
                  beast.counters = beast.counters.filter(c => c.type !== effect.counter);
                } else {
                  // Remove all counters
                  beast.counters = [];
                }
              }
            }
            for (const beast of opponent.field) {
              if (beast) {
                if (effect.counter) {
                  beast.counters = beast.counters.filter(c => c.type !== effect.counter);
                } else {
                  beast.counters = [];
                }
              }
            }
          }
          break;

        // Add more effect types as needed
        default:
          Logger.debug(`Unhandled magic card effect type: ${effect.type}`);
      }
    }
  }

  /**
   * Apply habitat zone effects
   */
  private applyHabitatEffects(): void {
    if (!this.gameState.habitatZone) return;

    const habitat = this.gameState.habitatZone as HabitatCard;
    const activePlayer = this.gameState.players[this.gameState.activePlayer];
    const opposingPlayer = this.gameState.players[this.gameState.activePlayer === 0 ? 1 : 0];

    // Apply on-play effects immediately
    if (habitat.onPlayEffects) {
      for (const effect of habitat.onPlayEffects) {
        this.processHabitatEffect(effect, activePlayer, opposingPlayer);
      }
    }

    // Ongoing effects are applied continuously and checked during combat/ability processing
    Logger.debug(`Habitat ${habitat.name} active with ${habitat.ongoingEffects?.length || 0} ongoing effects`);
  }

  /**
   * Process a single habitat effect
   */
  private processHabitatEffect(effect: AbilityEffect, activePlayer: Player, opposingPlayer: Player): void {
    switch (effect.type) {
      case EffectType.RemoveCounter:
        // Remove counters from all units
        if (effect.target === AbilityTarget.AllUnits) {
          for (const beast of activePlayer.field) {
            if (beast) {
              if (effect.counter) {
                beast.counters = beast.counters.filter(c => c.type !== effect.counter);
              } else {
                beast.counters = [];
              }
            }
          }
          for (const beast of opposingPlayer.field) {
            if (beast) {
              if (effect.counter) {
                beast.counters = beast.counters.filter(c => c.type !== effect.counter);
              } else {
                beast.counters = [];
              }
            }
          }
        }
        break;

      // Ongoing effects like stat boosts are handled by the AbilityProcessor during combat
      case EffectType.ModifyStats:
        Logger.debug(`Habitat provides ongoing stat modifications`);
        break;

      default:
        Logger.debug(`Unhandled habitat effect type: ${effect.type}`);
    }
  }

  /**
   * Draw cards from deck
   */
  private drawCards(player: Player, count: number): void {
    for (let i = 0; i < count; i++) {
      if (player.deck.length > 0) {
        const card = player.deck.pop();
        if (card) {
          player.hand.push(card);
        }
      }
    }
  }

  /**
   * Shuffle a player's deck
   */
  private shuffleDeck(player: Player): void {
    for (let i = player.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [player.deck[i], player.deck[j]] = [player.deck[j], player.deck[i]];
    }
  }

  /**
   * Trigger abilities at start of turn
   */
  private async triggerStartOfTurnAbilities(): Promise<void> {
    const activePlayer = this.gameState.players[this.gameState.activePlayer];
    const opposingPlayer = this.gameState.players[this.gameState.activePlayer === 0 ? 1 : 0];

    // Remove summoning sickness from all beasts
    for (const beast of activePlayer.field) {
      if (beast) {
        beast.summoningSickness = false;
      }
    }

    // Process counter effects (burn, freeze, etc.)
    await this.processCounterEffects(activePlayer);
    await this.processCounterEffects(opposingPlayer);

    // Trigger passive abilities with StartOfTurn trigger
    await this.triggerPassiveAbilities('StartOfTurn', activePlayer, opposingPlayer);
  }

  /**
   * Trigger abilities at end of turn
   */
  private async triggerEndOfTurnAbilities(): Promise<void> {
    const activePlayer = this.gameState.players[this.gameState.activePlayer];
    const opposingPlayer = this.gameState.players[this.gameState.activePlayer === 0 ? 1 : 0];

    // Trigger passive abilities with EndOfTurn trigger
    await this.triggerPassiveAbilities('EndOfTurn', activePlayer, opposingPlayer);

    // Clear temporary effects
    for (const beast of activePlayer.field) {
      if (beast) {
        this.clearTemporaryEffects(beast);
      }
    }
    for (const beast of opposingPlayer.field) {
      if (beast) {
        this.clearTemporaryEffects(beast);
      }
    }
  }

  /**
   * Apply passive abilities to a beast when summoned
   */
  private applyPassiveAbilities(beast: BloomBeastInstance): void {
    const cardDef = this.getCardDefinition(beast.cardId);
    if (!cardDef || cardDef.type !== 'Bloom') return;

    const beastCard = cardDef as BloomBeastCard;
    const ability = this.getCurrentAbility(beast, beastCard);

    if (ability && ability.trigger === 'Passive') {
      const activePlayer = this.gameState.players[this.gameState.activePlayer];
      const opposingPlayer = this.gameState.players[this.gameState.activePlayer === 0 ? 1 : 0];

      const results = this.abilityProcessor.processAbility(ability, {
        source: beast,
        sourceCard: beastCard,
        trigger: 'Passive',
        gameState: this.gameState,
        controllingPlayer: activePlayer,
        opposingPlayer: opposingPlayer,
      });

      // Apply ability results to game state (e.g., cannot be targeted effects)
      this.applyAbilityResults(results);
    }
  }

  /**
   * Trigger summon abilities
   */
  private triggerSummonAbilities(beast: BloomBeastInstance): void {
    const activePlayer = this.gameState.players[this.gameState.activePlayer];
    const opposingPlayer = this.gameState.players[this.gameState.activePlayer === 0 ? 1 : 0];

    // Get the card definition to access abilities
    const cardDef = this.getCardDefinition(beast.cardId);
    if (!cardDef || cardDef.type !== 'Bloom') return;

    const beastCard = cardDef as BloomBeastCard;
    const ability = this.getCurrentAbility(beast, beastCard);

    if (ability && ability.trigger === 'OnSummon') {
      const results = this.abilityProcessor.processAbility(ability, {
        source: beast,
        sourceCard: beastCard,
        trigger: 'OnSummon',
        gameState: this.gameState,
        controllingPlayer: activePlayer,
        opposingPlayer: opposingPlayer,
      });

      // Apply ability results to game state
      this.applyAbilityResults(results);
    }
  }

  /**
   * Trigger OnAllySummon abilities on other beasts when a new ally is summoned
   */
  private triggerAllySummonAbilities(summonedBeast: BloomBeastInstance, controllingPlayer: Player): void {
    const opposingPlayer = this.gameState.players[this.gameState.activePlayer === 0 ? 1 : 0];

    // Get the summoned beast's card definition for checking affinity condition
    const summonedCardDef = this.getCardDefinition(summonedBeast.cardId);

    // Check all other beasts on the same side
    for (const beast of controllingPlayer.field) {
      if (!beast || beast.instanceId === summonedBeast.instanceId) continue;

      const cardDef = this.getCardDefinition(beast.cardId);
      if (!cardDef || cardDef.type !== 'Bloom') continue;

      const beastCard = cardDef as BloomBeastCard;
      const ability = this.getCurrentAbility(beast, beastCard);

      if (ability && ability.trigger === 'OnAllySummon') {
        const results = this.abilityProcessor.processAbility(ability, {
          source: beast,
          sourceCard: beastCard,
          trigger: 'OnAllySummon',
          target: summonedBeast,  // Pass the summoned beast as target for condition checking
          gameState: this.gameState,
          controllingPlayer,
          opposingPlayer,
        });

        // Apply ability results to game state
        this.applyAbilityResults(results);
      }
    }
  }

  /**
   * Trigger passive abilities for all beasts
   */
  private async triggerPassiveAbilities(
    trigger: string,
    controllingPlayer: Player,
    opposingPlayer: Player
  ): Promise<void> {
    for (const beast of controllingPlayer.field) {
      if (!beast) continue;

      const cardDef = this.getCardDefinition(beast.cardId);
      if (!cardDef || cardDef.type !== 'Bloom') continue;

      const beastCard = cardDef as BloomBeastCard;
      const ability = this.getCurrentAbility(beast, beastCard);

      if (ability && ability.trigger === trigger) {
        const results = this.abilityProcessor.processAbility(ability, {
          source: beast,
          sourceCard: beastCard,
          trigger,
          gameState: this.gameState,
          controllingPlayer,
          opposingPlayer,
        });

        // Apply ability results to game state
        this.applyAbilityResults(results);
      }
    }
  }

  /**
   * Process counter effects (burn, freeze, etc.)
   */
  private async processCounterEffects(player: Player): Promise<void> {
    for (const beast of player.field) {
      if (!beast) continue;

      // Process burn counters
      const burnCounter = beast.counters.find(c => c.type === 'Burn');
      if (burnCounter && burnCounter.amount > 0) {
        beast.currentHealth = Math.max(0, beast.currentHealth - burnCounter.amount);
        Logger.debug(`${beast.instanceId} took ${burnCounter.amount} burn damage`);
      }

      // Process freeze counters (reduce by 1 each turn)
      const freezeCounter = beast.counters.find(c => c.type === 'Freeze');
      if (freezeCounter && freezeCounter.amount > 0) {
        freezeCounter.amount--;
        if (freezeCounter.amount === 0) {
          beast.counters = beast.counters.filter(c => c.type !== 'Freeze');
        }
      }

      // Remove dead beasts
      if (beast.currentHealth <= 0) {
        const index = player.field.indexOf(beast);
        if (index !== -1) {
          player.field[index] = null;
          player.graveyard.push(beast as any);
        }
      }
    }
  }

  /**
   * Clear temporary effects from a beast and revert stat modifications
   */
  private clearTemporaryEffects(beast: BloomBeastInstance): void {
    if (!beast.temporaryEffects) return;

    // Process effects that are expiring and revert their stat modifications
    beast.temporaryEffects = beast.temporaryEffects.filter(effect => {
      if (effect.turnsRemaining !== undefined) {
        effect.turnsRemaining--;

        // If effect is expiring, revert its stat changes
        if (effect.turnsRemaining <= 0 && effect.type === 'stat-mod') {
          const statMod = effect as any;

          // Revert attack modifications
          if (statMod.stat === 'attack' || statMod.stat === 'both') {
            beast.currentAttack = Math.max(0, beast.currentAttack - statMod.value);
          }

          // Revert health modifications (but don't reduce below current if it would "kill" the beast)
          if (statMod.stat === 'health' || statMod.stat === 'both') {
            // Only reduce current health if the beast had been healed by this effect
            if (statMod.value > 0) {
              beast.currentHealth = Math.max(1, Math.min(beast.maxHealth, beast.currentHealth - statMod.value));
            }
            // If it was a debuff (negative), restore health
            else if (statMod.value < 0) {
              beast.currentHealth = Math.min(beast.maxHealth, beast.currentHealth - statMod.value);
            }
          }

          Logger.debug(`Cleared temporary ${statMod.stat} modification (${statMod.value}) from ${beast.instanceId}`);
          return false; // Remove this effect
        }

        return effect.turnsRemaining > 0;
      }
      return false;
    });
  }

  /**
   * Get card definition by ID
   */
  private getCardDefinition(cardId: string): AnyCard | null {
    return this.cardDatabase.get(cardId) || null;
  }

  /**
   * Get current ability for a beast based on its level
   * Takes into account ability upgrades from leveling
   */
  private getCurrentAbility(beast: BloomBeastInstance, beastCard: BloomBeastCard): any {
    const { ability } = this.levelingSystem.getCurrentAbilities(beastCard, beast.currentLevel);
    return ability;
  }

  /**
   * Check if a beast has a specific attack modification
   */
  private hasAttackModification(
    beast: BloomBeastInstance,
    modification: 'attack-first' | 'cannot-counterattack' | 'double-damage' | 'triple-damage' | 'attack-twice' | 'instant-destroy' | 'piercing' | 'lifesteal'
  ): boolean {
    const cardDef = this.getCardDefinition(beast.cardId);
    if (!cardDef || cardDef.type !== 'Bloom') return false;

    const beastCard = cardDef as BloomBeastCard;
    const ability = this.getCurrentAbility(beast, beastCard);

    // Only StructuredAbility has effects
    if (!ability || !('effects' in ability)) return false;

    // Check if any effect is an AttackModification with the specified modification
    for (const effect of ability.effects) {
      if (effect.type === EffectType.AttackModification && (effect as any).modification === modification) {
        // Check condition if present
        const attackModEffect = effect as any;
        if (attackModEffect.condition) {
          // TODO: Implement condition checking
          // For now, if there's a condition we need to evaluate it
          // Example: Dewdrop Drake only has attack-first when it's the only unit on field
          Logger.debug(`Attack modification '${modification}' has condition, assuming true for now`);
        }
        return true;
      }
    }

    return false;
  }

  /**
   * Activate ability for a beast
   */
  public activateAbility(
    player: Player,
    beastIndex: number,
    target?: any
  ): boolean {
    if (beastIndex < 0 || beastIndex >= player.field.length) {
      Logger.error('Invalid beast index');
      return false;
    }

    const beast = player.field[beastIndex];
    if (!beast) {
      Logger.error('No beast at this position');
      return false;
    }

    // Get card definition
    const cardDef = this.getCardDefinition(beast.cardId);
    if (!cardDef || cardDef.type !== 'Bloom') {
      Logger.error('Invalid beast card');
      return false;
    }

    const beastCard = cardDef as BloomBeastCard;
    const ability = this.getCurrentAbility(beast, beastCard);

    // Check if the ability is activated type
    if (!ability || ability.trigger !== 'Activated') {
      Logger.error('Beast has no activated ability');
      return false;
    }

    // Check if ability has cost
    if (ability.cost) {
      switch (ability.cost.type) {
        case 'nectar':
          if (player.currentNectar < (ability.cost.value || 1)) {
            Logger.error('Not enough nectar');
            return false;
          }
          player.currentNectar -= ability.cost.value || 1;
          break;
        case 'discard':
          if (player.hand.length < (ability.cost.value || 1)) {
            Logger.error('Not enough cards to discard');
            return false;
          }
          // Discard cards
          for (let i = 0; i < (ability.cost.value || 1); i++) {
            const card = player.hand.pop();
            if (card) player.graveyard.push(card as any);
          }
          break;
      }
    }

    // Activate the ability
    const opposingPlayer = this.gameState.players[this.gameState.activePlayer === 0 ? 1 : 0];
    const results = this.abilityProcessor.processAbility(ability, {
      source: beast,
      sourceCard: beastCard,
      trigger: 'Activated',
      target: target,
      gameState: this.gameState,
      controllingPlayer: player,
      opposingPlayer: opposingPlayer,
    });

    // Apply ability results to game state
    this.applyAbilityResults(results);

    Logger.debug(`Activated ability: ${ability.name}`);
    return true;
  }

  /**
   * End the match
   */
  private endMatch(result: any): void {
    Logger.debug('Match ended!', result);
    // TODO: Handle match end, rewards, etc.
  }

  /**
   * Execute attack from one beast to another or to player
   */
  public async executeAttack(
    attackingPlayer: Player,
    attackerIndex: number,
    targetType: 'beast' | 'player',
    targetIndex?: number
  ): Promise<boolean> {
    if (attackerIndex < 0 || attackerIndex >= attackingPlayer.field.length) {
      Logger.error('Invalid attacker index');
      return false;
    }

    const attacker = attackingPlayer.field[attackerIndex];
    if (!attacker) {
      Logger.error('No beast at attacker position');
      return false;
    }

    if (attacker.summoningSickness) {
      Logger.error('Beast has summoning sickness');
      return false;
    }

    const defendingPlayer = this.gameState.players[this.gameState.activePlayer === 0 ? 1 : 0];

    // Check for traps on attack
    const attackData = { attackNegated: false };
    await this.checkTraps('OnAttack', attackingPlayer, attackData);

    // If attack was negated by trap, return
    if (attackData.attackNegated) {
      Logger.debug('Attack was negated by a trap');
      return false;
    }

    // Trigger OnAttack abilities
    this.triggerCombatAbilities('OnAttack', attacker, attackingPlayer, defendingPlayer);

    if (targetType === 'beast' && targetIndex !== undefined) {
      const defender = defendingPlayer.field[targetIndex];
      if (!defender) {
        Logger.error('No beast at defender position');
        return false;
      }

      // Check for attack modifications
      const attackerHasFirstStrike = this.hasAttackModification(attacker, 'attack-first');
      const attackerCannotBeCountered = this.hasAttackModification(attacker, 'cannot-counterattack');

      const attackerDamage = attacker.currentAttack;
      const defenderDamage = defender.currentAttack;

      Logger.debug(`Combat: ${attacker.cardId} (${attackerDamage} ATK) vs ${defender.cardId} (${defenderDamage} ATK)${attackerHasFirstStrike ? ' [ATTACK-FIRST]' : ''}${attackerCannotBeCountered ? ' [NO-COUNTER]' : ''}`);

      // Handle attack-first mechanic
      if (attackerHasFirstStrike) {
        // Attacker deals damage first
        defender.currentHealth = Math.max(0, defender.currentHealth - attackerDamage);
        Logger.debug(`${attacker.cardId} attacked first for ${attackerDamage} damage. ${defender.cardId} HP: ${defender.currentHealth}/${defender.maxHealth}`);

        // Trigger OnDamage abilities on defender
        this.triggerCombatAbilities('OnDamage', defender, defendingPlayer, attackingPlayer, undefined, attacker);

        // Check if defender died from first strike
        if (defender.currentHealth <= 0) {
          Logger.debug(`${defender.cardId} was destroyed by first strike! No counter-attack.`);
          this.triggerCombatAbilities('OnDestroy', defender, defendingPlayer, attackingPlayer);
          const index = defendingPlayer.field.indexOf(defender);
          if (index !== -1) {
            defendingPlayer.field[index] = null;
            defendingPlayer.graveyard.push(defender as any);
          }
          return true; // Combat ends, defender died before counter-attacking
        }

        // Defender survived, now counter-attacks (unless attacker has cannot-counterattack)
        if (!attackerCannotBeCountered) {
          attacker.currentHealth = Math.max(0, attacker.currentHealth - defenderDamage);
          Logger.debug(`${defender.cardId} countered for ${defenderDamage} damage. ${attacker.cardId} HP: ${attacker.currentHealth}/${attacker.maxHealth}`);

          // Trigger OnDamage abilities on attacker
          this.triggerCombatAbilities('OnDamage', attacker, attackingPlayer, defendingPlayer, undefined, defender);

          // Check if attacker died from counter
          if (attacker.currentHealth <= 0) {
            Logger.debug(`${attacker.cardId} was destroyed by counter-attack!`);
            this.triggerCombatAbilities('OnDestroy', attacker, attackingPlayer, defendingPlayer);
            const index = attackingPlayer.field.indexOf(attacker);
            if (index !== -1) {
              attackingPlayer.field[index] = null;
              attackingPlayer.graveyard.push(attacker as any);
            }
          }
        } else {
          Logger.debug(`${defender.cardId} cannot counter-attack (attacker has cannot-counterattack)`);
        }
      } else {
        // Normal simultaneous damage
        defender.currentHealth = Math.max(0, defender.currentHealth - attackerDamage);

        // Counter-attack happens unless prevented
        if (!attackerCannotBeCountered) {
          attacker.currentHealth = Math.max(0, attacker.currentHealth - defenderDamage);
          Logger.debug(`Simultaneous combat: ${attacker.cardId} dealt ${attackerDamage}, ${defender.cardId} dealt ${defenderDamage}`);
        } else {
          Logger.debug(`${attacker.cardId} dealt ${attackerDamage} damage, ${defender.cardId} cannot counter`);
        }

        // Trigger OnDamage abilities
        this.triggerCombatAbilities('OnDamage', defender, defendingPlayer, attackingPlayer, undefined, attacker);
        if (!attackerCannotBeCountered) {
          this.triggerCombatAbilities('OnDamage', attacker, attackingPlayer, defendingPlayer, undefined, defender);
        }

        // Check for deaths
        let defenderDied = false;
        if (defender.currentHealth <= 0) {
          defenderDied = true;
          Logger.debug(`${defender.cardId} was destroyed!`);
          this.triggerCombatAbilities('OnDestroy', defender, defendingPlayer, attackingPlayer);
          const index = defendingPlayer.field.indexOf(defender);
          if (index !== -1) {
            defendingPlayer.field[index] = null;
            defendingPlayer.graveyard.push(defender as any);
          }
        }

        if (attacker.currentHealth <= 0) {
          Logger.debug(`${attacker.cardId} was destroyed!`);
          this.triggerCombatAbilities('OnDestroy', attacker, attackingPlayer, defendingPlayer);
          const index = attackingPlayer.field.indexOf(attacker);
          if (index !== -1) {
            attackingPlayer.field[index] = null;
            attackingPlayer.graveyard.push(attacker as any);
          }
        }
      }
    } else if (targetType === 'player') {
      // Direct attack to player
      const damage = attacker.currentAttack;
      defendingPlayer.health = Math.max(0, defendingPlayer.health - damage);
      Logger.debug(`${attacker.cardId} attacked player for ${damage} damage`);

      // Check if player was defeated
      if (defendingPlayer.health <= 0) {
        Logger.debug(`${defendingPlayer.name} was defeated!`);
        const result = this.combatSystem.checkWinCondition(this.gameState);
        if (result) {
          this.endMatch(result);
        }
      }
    }

    return true;
  }

  /**
   * Trigger combat-related abilities
   */
  private triggerCombatAbilities(
    trigger: 'OnAttack' | 'OnDamage' | 'OnDestroy',
    beast: BloomBeastInstance,
    controllingPlayer: Player,
    opposingPlayer: Player,
    target?: BloomBeastInstance,
    attacker?: BloomBeastInstance
  ): void {
    const cardDef = this.getCardDefinition(beast.cardId);
    if (!cardDef || cardDef.type !== 'Bloom') return;

    const beastCard = cardDef as BloomBeastCard;
    const ability = this.getCurrentAbility(beast, beastCard);

    if (ability && ability.trigger === trigger) {
      const results = this.abilityProcessor.processAbility(ability, {
        source: beast,
        sourceCard: beastCard,
        trigger,
        target,
        attacker,
        gameState: this.gameState,
        controllingPlayer,
        opposingPlayer,
      });

      // Apply ability results to game state
      this.applyAbilityResults(results);
    }
  }

  /**
   * Check and trigger traps based on an event
   * Only triggers the FIRST matching trap (in order)
   */
  private async checkTraps(
    triggerType: 'OnBloomPlay' | 'OnHabitatPlay' | 'OnAttack' | 'OnDamage',
    triggeringPlayer: Player,
    data?: any
  ): Promise<void> {
    const opposingPlayer = triggeringPlayer === this.gameState.players[0]
      ? this.gameState.players[1]
      : this.gameState.players[0];

    // Check opponent's traps - only activate FIRST matching trap
    for (let i = 0; i < opposingPlayer.trapZone.length; i++) {
      const trapCard = opposingPlayer.trapZone[i];
      if (!trapCard || trapCard.type !== 'Trap') continue;

      const trap = trapCard as TrapCard;
      let shouldTrigger = false;

      // Check if trap activation condition matches the trigger
      switch (triggerType) {
        case 'OnBloomPlay':
          shouldTrigger = trap.activation.trigger === TrapTrigger.OnBloomPlay;
          break;
        case 'OnHabitatPlay':
          shouldTrigger = trap.activation.trigger === TrapTrigger.OnHabitatPlay;
          break;
        case 'OnAttack':
          shouldTrigger = trap.activation.trigger === TrapTrigger.OnAttack;
          break;
        case 'OnDamage':
          shouldTrigger = trap.activation.trigger === TrapTrigger.OnDamage;
          break;
      }

      if (shouldTrigger) {
        Logger.debug(`Trap activated: ${trap.name}`);

        // Process trap effect
        await this.processTrapEffect(trap, opposingPlayer, triggeringPlayer, data);

        // Remove trap from zone and send to graveyard
        opposingPlayer.trapZone[i] = null;
        opposingPlayer.graveyard.push(trap);

        // Only activate ONE trap per event
        return;
      }
    }
  }

  /**
   * Process trap card effect using structured effects
   */
  private async processTrapEffect(
    trap: TrapCard,
    trapOwner: Player,
    opponent: Player,
    data?: any
  ): Promise<void> {
    // Process each effect in the trap card
    for (const effect of trap.effects) {
      switch (effect.type) {
        case EffectType.NullifyEffect:
          // Counter/nullify the triggering effect
          if (data && data.habitatCard) {
            Logger.debug(`Habitat countered by ${trap.name}`);
            data.countered = true;
          }
          if (data && data.attackNegated !== undefined) {
            data.attackNegated = true;
            Logger.debug(`Attack negated by ${trap.name}`);
          }
          break;

        case EffectType.DealDamage:
          // Deal damage based on target
          if (effect.target === AbilityTarget.AllEnemies) {
            for (const beast of opponent.field) {
              if (beast) {
                const damage = typeof effect.value === 'number' ? effect.value : 0;
                beast.currentHealth = Math.max(0, beast.currentHealth - damage);
                if (beast.currentHealth <= 0) {
                  const index = opponent.field.indexOf(beast);
                  if (index !== -1) {
                    opponent.field[index] = null;
                    opponent.graveyard.push(beast as any);
                  }
                }
              }
            }
          } else if (effect.target === AbilityTarget.OpponentGardener) {
            const damage = typeof effect.value === 'number' ? effect.value : 0;
            opponent.health = Math.max(0, opponent.health - damage);
          }
          break;

        case EffectType.DrawCards:
          this.drawCards(trapOwner, effect.value);
          break;

        // Add more effect types as needed
        default:
          Logger.debug(`Unhandled trap effect type: ${effect.type}`);
      }
    }
  }

  /**
   * Apply ability results to game state
   */
  private applyAbilityResults(results: any[]): void {
    for (const result of results) {
      if (!result.success) continue;

      // Apply modified units back to the field
      if (result.modifiedUnits && result.modifiedUnits.length > 0) {
        for (const modifiedUnit of result.modifiedUnits) {
          // Find and update the unit in both players' fields
          for (const player of this.gameState.players) {
            const index = player.field.findIndex(
              u => u && u.instanceId === modifiedUnit.instanceId
            );
            if (index !== -1) {
              player.field[index] = modifiedUnit;
              break;
            }
          }
        }
      }

      // Apply modified state
      if (result.modifiedState) {
        if (result.modifiedState.players) {
          this.gameState.players = result.modifiedState.players;
        }
        if (result.modifiedState.habitatCounters) {
          this.gameState.habitatCounters = result.modifiedState.habitatCounters;
        }
        if (result.modifiedState.drawCardsQueued !== undefined) {
          const playerIndex = result.modifiedState.drawForPlayerIndex ?? this.gameState.activePlayer;
          const player = this.gameState.players[playerIndex];
          this.drawCards(player, result.modifiedState.drawCardsQueued);
        }
      }

      // Log the result message if available
      if (result.message) {
        Logger.debug(result.message);
      }
    }
  }

  /**
   * Get current game state
   */
  public getState(): GameState {
    return this.gameState;
  }

  /**
   * Reset for new game
   */
  public reset(): void {
    this.gameState = this.createInitialState();
    this.combatSystem.reset();
  }
}