/**
 * Game Engine - Main game controller and state manager
 */

import { GameState, Player, Phase, BloomBeastInstance } from '../types/game';
import { AnyCard, BloomBeastCard, TrapCard } from '../types/core';
import { CombatSystem } from './CombatSystem';
import { AbilityProcessor } from './AbilityProcessor';
import { LevelingSystem } from './LevelingSystem';
import { DeckList } from '../utils/deckBuilder';
import { SimpleMap } from '../../utils/polyfills';
import * as AllCards from '../../allCardDefinitions';

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
  private cardDatabase: Map<string, AnyCard>;

  constructor() {
    this.gameState = this.createInitialState();
    this.combatSystem = new CombatSystem();
    this.abilityProcessor = new AbilityProcessor();
    this.cardDatabase = this.buildCardDatabase();
  }

  /**
   * Build card database from all card definitions
   */
  private buildCardDatabase(): Map<string, AnyCard> {
    const db = new Map<string, AnyCard>();
    Object.values(AllCards).forEach((card: any) => {
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
      health: 30,
      currentNectar: 0,
      deck: [],
      hand: [],
      field: [null, null, null],
      trapZone: [null, null, null],
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
    console.log('Starting new match...');

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

    console.log(`Turn ${this.gameState.turn}: ${activePlayer.name}'s turn`);

    // Reset turn counters
    activePlayer.summonsThisTurn = 0;

    // Draw card (except first turn)
    if (this.gameState.turn > 1) {
      this.drawCards(activePlayer, 1);
    }

    // Gain nectar
    activePlayer.currentNectar = Math.min(10, this.gameState.turn);

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
      console.error('Invalid field position');
      return false;
    }

    if (player.field[position] !== null) {
      console.error('Field position already occupied');
      return false;
    }

    if (player.summonsThisTurn >= 1) {
      console.error('Already summoned this turn');
      return false;
    }

    // Create beast instance
    const instance: BloomBeastInstance = {
      instanceId: `${beastCard.id}-${Date.now()}`,
      cardId: beastCard.id,
      currentLevel: 1,
      currentXP: 0,
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

    // Trigger summon abilities
    this.triggerSummonAbilities(instance);

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
      console.error('Invalid card index');
      return false;
    }

    const card = player.hand[cardIndex];

    // Check nectar cost
    if (card.cost > player.currentNectar) {
      console.error('Not enough nectar');
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
          console.log(`Played habitat: ${card.name}`);
          // Apply habitat effects
          this.applyHabitatEffects();
        } else {
          // Countered - send to graveyard
          player.graveyard.push(card);
        }
        break;

      case 'Magic':
        // Execute magic card effect immediately
        this.processMagicCard(card, player, target);
        player.graveyard.push(card);
        console.log(`Played magic card: ${card.name}`);
        break;

      case 'Trap':
        // Place trap card face-down in trap zone
        const emptyTrapSlot = player.trapZone.findIndex(slot => slot === null);
        if (emptyTrapSlot !== -1) {
          player.trapZone[emptyTrapSlot] = card;
          console.log(`Set trap card: ${card.name}`);
        } else {
          // No trap slots available, send to graveyard
          console.log('No trap slots available');
          player.graveyard.push(card);
        }
        break;

      case 'Resource':
        // Execute resource card effect
        const resourceCard = card as any;
        if (resourceCard.effect.includes('Gain 2 nectar')) {
          player.currentNectar = Math.min(10, player.currentNectar + 2);
        }
        player.graveyard.push(card);
        console.log(`Played resource card: ${card.name}`);
        break;
    }

    return true;
  }

  /**
   * Process magic card effects
   */
  private processMagicCard(card: AnyCard, player: Player, target?: any): void {
    const magicCard = card as any;
    const effect = magicCard.effect;

    // Parse and execute magic card effects
    // This is simplified - in a full implementation, magic cards would have structured effects
    if (effect.includes('Gain') && effect.includes('nectar')) {
      const match = effect.match(/Gain (\d+) nectar/);
      if (match) {
        const amount = parseInt(match[1]);
        player.currentNectar = Math.min(10, player.currentNectar + amount);
      }
    }

    if (effect.includes('Draw')) {
      const match = effect.match(/Draw (\d+)/);
      if (match) {
        const amount = parseInt(match[1]);
        this.drawCards(player, amount);
      }
    }

    if (effect.includes('Remove all counters')) {
      // Remove counters from all beasts
      for (const beast of player.field) {
        if (beast) beast.counters = [];
      }
      const opponent = this.gameState.players[this.gameState.activePlayer === 0 ? 1 : 0];
      for (const beast of opponent.field) {
        if (beast) beast.counters = [];
      }
    }
  }

  /**
   * Apply habitat zone effects
   */
  private applyHabitatEffects(): void {
    if (!this.gameState.habitatZone) return;

    const habitat = this.gameState.habitatZone as any;
    console.log(`Applying habitat effects: ${habitat.habitatShiftEffect}`);

    // Habitat effects are passive and apply continuously
    // They're checked during combat and ability processing
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
   * Trigger summon abilities
   */
  private triggerSummonAbilities(beast: BloomBeastInstance): void {
    const activePlayer = this.gameState.players[this.gameState.activePlayer];
    const opposingPlayer = this.gameState.players[this.gameState.activePlayer === 0 ? 1 : 0];

    // Get the card definition to access abilities
    const cardDef = this.getCardDefinition(beast.cardId);
    if (!cardDef || cardDef.type !== 'Bloom') return;

    const beastCard = cardDef as any;
    if (beastCard.passiveAbility && beastCard.passiveAbility.trigger === 'OnSummon') {
      AbilityProcessor.processAbility(beastCard.passiveAbility, {
        source: beast,
        sourceCard: beastCard,
        trigger: 'OnSummon',
        gameState: this.gameState,
        controllingPlayer: activePlayer,
        opposingPlayer: opposingPlayer,
      });
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

      const beastCard = cardDef as any;
      if (beastCard.passiveAbility && beastCard.passiveAbility.trigger === trigger) {
        AbilityProcessor.processAbility(beastCard.passiveAbility, {
          source: beast,
          sourceCard: beastCard,
          trigger,
          gameState: this.gameState,
          controllingPlayer,
          opposingPlayer,
        });
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
        console.log(`${beast.instanceId} took ${burnCounter.amount} burn damage`);
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
   * Clear temporary effects from a beast
   */
  private clearTemporaryEffects(beast: BloomBeastInstance): void {
    if (!beast.temporaryEffects) return;

    beast.temporaryEffects = beast.temporaryEffects.filter(effect => {
      if (effect.turnsRemaining !== undefined) {
        effect.turnsRemaining--;
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
   * Activate bloom ability for a beast
   */
  public activateBloomAbility(
    player: Player,
    beastIndex: number,
    target?: any
  ): boolean {
    if (beastIndex < 0 || beastIndex >= player.field.length) {
      console.error('Invalid beast index');
      return false;
    }

    const beast = player.field[beastIndex];
    if (!beast) {
      console.error('No beast at this position');
      return false;
    }

    // Get card definition
    const cardDef = this.getCardDefinition(beast.cardId);
    if (!cardDef || cardDef.type !== 'Bloom') {
      console.error('Invalid beast card');
      return false;
    }

    const beastCard = cardDef as BloomBeastCard;
    if (!beastCard.bloomAbility) {
      console.error('Beast has no bloom ability');
      return false;
    }

    // Check if bloom ability has cost
    const ability = beastCard.bloomAbility as any;
    if (ability.cost) {
      switch (ability.cost.type) {
        case 'nectar':
          if (player.currentNectar < (ability.cost.value || 1)) {
            console.error('Not enough nectar');
            return false;
          }
          player.currentNectar -= ability.cost.value || 1;
          break;
        case 'discard':
          if (player.hand.length < (ability.cost.value || 1)) {
            console.error('Not enough cards to discard');
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
    AbilityProcessor.processAbility(ability, {
      source: beast,
      sourceCard: beastCard,
      trigger: 'Activated',
      target: target,
      gameState: this.gameState,
      controllingPlayer: player,
      opposingPlayer: opposingPlayer,
    });

    console.log(`Activated bloom ability: ${ability.name}`);
    return true;
  }

  /**
   * End the match
   */
  private endMatch(result: any): void {
    console.log('Match ended!', result);
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
      console.error('Invalid attacker index');
      return false;
    }

    const attacker = attackingPlayer.field[attackerIndex];
    if (!attacker) {
      console.error('No beast at attacker position');
      return false;
    }

    if (attacker.summoningSickness) {
      console.error('Beast has summoning sickness');
      return false;
    }

    const defendingPlayer = this.gameState.players[this.gameState.activePlayer === 0 ? 1 : 0];

    // Check for traps on attack
    const attackData = { attackNegated: false };
    await this.checkTraps('OnAttack', attackingPlayer, attackData);

    // If attack was negated by trap, return
    if (attackData.attackNegated) {
      console.log('Attack was negated by a trap');
      return false;
    }

    // Trigger OnAttack abilities
    this.triggerCombatAbilities('OnAttack', attacker, attackingPlayer, defendingPlayer);

    if (targetType === 'beast' && targetIndex !== undefined) {
      const defender = defendingPlayer.field[targetIndex];
      if (!defender) {
        console.error('No beast at defender position');
        return false;
      }

      // Process attack
      const damage = attacker.currentAttack;
      defender.currentHealth = Math.max(0, defender.currentHealth - damage);

      // Trigger OnDamage abilities on defender
      this.triggerCombatAbilities('OnDamage', defender, defendingPlayer, attackingPlayer);

      console.log(`${attacker.cardId} attacked ${defender.cardId} for ${damage} damage`);

      // Check if defender was destroyed
      if (defender.currentHealth <= 0) {
        this.triggerCombatAbilities('OnDestroy', defender, defendingPlayer, attackingPlayer);
        const index = defendingPlayer.field.indexOf(defender);
        if (index !== -1) {
          defendingPlayer.field[index] = null;
          defendingPlayer.graveyard.push(defender as any);
        }
      }
    } else if (targetType === 'player') {
      // Direct attack to player
      const damage = attacker.currentAttack;
      defendingPlayer.health = Math.max(0, defendingPlayer.health - damage);
      console.log(`${attacker.cardId} attacked player for ${damage} damage`);

      // Check if player was defeated
      if (defendingPlayer.health <= 0) {
        console.log(`${defendingPlayer.name} was defeated!`);
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
    opposingPlayer: Player
  ): void {
    const cardDef = this.getCardDefinition(beast.cardId);
    if (!cardDef || cardDef.type !== 'Bloom') return;

    const beastCard = cardDef as BloomBeastCard;
    if (beastCard.passiveAbility && beastCard.passiveAbility.trigger === trigger) {
      AbilityProcessor.processAbility(beastCard.passiveAbility as any, {
        source: beast,
        sourceCard: beastCard,
        trigger,
        gameState: this.gameState,
        controllingPlayer,
        opposingPlayer,
      });
    }
  }

  /**
   * Check and trigger traps based on an event
   */
  private async checkTraps(
    triggerType: 'OnBloomPlay' | 'OnHabitatPlay' | 'OnAttack' | 'OnDamage',
    triggeringPlayer: Player,
    data?: any
  ): Promise<void> {
    const opposingPlayer = triggeringPlayer === this.gameState.players[0]
      ? this.gameState.players[1]
      : this.gameState.players[0];

    // Check opponent's traps
    for (let i = 0; i < opposingPlayer.trapZone.length; i++) {
      const trapCard = opposingPlayer.trapZone[i];
      if (!trapCard || trapCard.type !== 'Trap') continue;

      const trap = trapCard as TrapCard;
      let shouldTrigger = false;

      // Check if trap activation condition matches the trigger
      const activation = trap.activation.toLowerCase();

      switch (triggerType) {
        case 'OnBloomPlay':
          shouldTrigger = activation.includes('bloom') && activation.includes('play');
          break;
        case 'OnHabitatPlay':
          shouldTrigger = activation.includes('habitat') && activation.includes('play');
          break;
        case 'OnAttack':
          shouldTrigger = activation.includes('attack');
          break;
        case 'OnDamage':
          shouldTrigger = activation.includes('damage');
          break;
      }

      if (shouldTrigger) {
        console.log(`Trap activated: ${trap.name}`);

        // Process trap effect
        await this.processTrapEffect(trap, opposingPlayer, triggeringPlayer, data);

        // Remove trap from zone and send to graveyard
        opposingPlayer.trapZone[i] = null;
        opposingPlayer.graveyard.push(trap);
      }
    }
  }

  /**
   * Process trap card effect
   */
  private async processTrapEffect(
    trap: TrapCard,
    trapOwner: Player,
    opponent: Player,
    data?: any
  ): Promise<void> {
    const effect = trap.effect.toLowerCase();

    // Parse and execute trap effects
    if (effect.includes('counter') && effect.includes('habitat')) {
      // Counter habitat play - card is sent to graveyard instead
      if (data && data.habitatCard) {
        console.log(`Habitat countered by ${trap.name}`);
        data.countered = true;
      }
    }

    if (effect.includes('damage')) {
      // Deal damage to beasts or player
      const match = effect.match(/(\d+)\s*damage/);
      if (match) {
        const damage = parseInt(match[1]);
        if (effect.includes('all')) {
          // Damage all opponent's beasts
          for (const beast of opponent.field) {
            if (beast) {
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
        } else if (effect.includes('player')) {
          // Damage player
          opponent.health = Math.max(0, opponent.health - damage);
        }
      }
    }

    if (effect.includes('draw')) {
      // Draw cards
      const match = effect.match(/draw\s*(\d+)/);
      if (match) {
        const count = parseInt(match[1]);
        this.drawCards(trapOwner, count);
      }
    }

    if (effect.includes('counter') && effect.includes('attack')) {
      // Negate attack
      if (data && data.attackNegated !== undefined) {
        data.attackNegated = true;
        console.log(`Attack negated by ${trap.name}`);
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