/**
 * CardBuilder
 *
 * Fluent API for building card definitions with less boilerplate.
 * Simplifies card creation while maintaining type safety.
 */

import {
  BloomBeastCard,
  MagicCard,
  TrapCard,
  HabitatCard,
  BuffCard,
  Affinity,
  LevelingConfig,
  TrapActivation,
} from '../types/core';
import { StructuredAbility, AbilityEffect } from '../types/abilities';

/**
 * Builder for Bloom Beast cards
 */
export class BloomBeastBuilder {
  private card: Partial<BloomBeastCard> = {
    type: 'Bloom',
  };

  constructor(id: string, name: string) {
    this.card.id = id;
    this.card.name = name;
  }

  affinity(affinity: Affinity): this {
    this.card.affinity = affinity;
    return this;
  }

  cost(cost: number): this {
    this.card.cost = cost;
    return this;
  }

  stats(attack: number, health: number): this {
    this.card.baseAttack = attack;
    this.card.baseHealth = health;
    return this;
  }

  attack(attack: number): this {
    this.card.baseAttack = attack;
    return this;
  }

  health(health: number): this {
    this.card.baseHealth = health;
    return this;
  }

  abilities(abilities: StructuredAbility[]): this {
    this.card.abilities = abilities;
    return this;
  }

  ability(ability: StructuredAbility): this {
    this.card.abilities = [ability];
    return this;
  }

  leveling(config: LevelingConfig): this {
    this.card.levelingConfig = config;
    return this;
  }

  titleColor(color: string): this {
    this.card.titleColor = color;
    return this;
  }

  build(): BloomBeastCard {
    // Validate required fields
    if (!this.card.id) throw new Error('Card ID is required');
    if (!this.card.name) throw new Error('Card name is required');
    if (!this.card.affinity) throw new Error('Card affinity is required');
    if (this.card.cost === undefined) throw new Error('Card cost is required');
    if (this.card.baseAttack === undefined) throw new Error('Card attack is required');
    if (this.card.baseHealth === undefined) throw new Error('Card health is required');
    if (!this.card.abilities || this.card.abilities.length === 0) throw new Error('Card abilities are required');

    return this.card as BloomBeastCard;
  }
}

/**
 * Builder for Magic cards
 */
export class MagicCardBuilder {
  private card: Partial<MagicCard> = {
    type: 'Magic',
  };

  constructor(id: string, name: string) {
    this.card.id = id;
    this.card.name = name;
  }

  cost(cost: number): this {
    this.card.cost = cost;
    return this;
  }

  effects(effects: AbilityEffect[]): this {
    // Convert to StructuredAbility format
    this.card.abilities = [{
      name: this.card.name || 'Magic Effect',
      trigger: 'OnSummon' as any,
      effects
    }] as StructuredAbility[];
    return this;
  }

  effect(effect: AbilityEffect): this {
    // Convert to StructuredAbility format
    if (!this.card.abilities || this.card.abilities.length === 0) {
      this.card.abilities = [{
        name: this.card.name || 'Magic Effect',
        trigger: 'OnSummon' as any,
        effects: []
      }] as StructuredAbility[];
    }
    (this.card.abilities[0] as StructuredAbility).effects.push(effect);
    return this;
  }

  requiresTarget(required: boolean = true): this {
    this.card.targetRequired = required;
    return this;
  }

  titleColor(color: string): this {
    this.card.titleColor = color;
    return this;
  }

  build(): MagicCard {
    if (!this.card.id) throw new Error('Card ID is required');
    if (!this.card.name) throw new Error('Card name is required');
    if (this.card.cost === undefined) throw new Error('Card cost is required');
    if (!this.card.abilities || this.card.abilities.length === 0) {
      throw new Error('Card must have at least one ability');
    }

    return this.card as MagicCard;
  }
}

/**
 * Builder for Trap cards
 */
export class TrapCardBuilder {
  private card: Partial<TrapCard> = {
    type: 'Trap',
  };

  constructor(id: string, name: string) {
    this.card.id = id;
    this.card.name = name;
  }

  cost(cost: number): this {
    this.card.cost = cost;
    return this;
  }

  activation(activation: TrapActivation): this {
    this.card.activation = activation;
    return this;
  }

  effects(effects: AbilityEffect[]): this {
    // Convert to StructuredAbility format
    this.card.abilities = [{
      name: this.card.name || 'Trap Effect',
      trigger: 'OnSummon' as any,
      effects
    }] as StructuredAbility[];
    return this;
  }

  effect(effect: AbilityEffect): this {
    // Convert to StructuredAbility format
    if (!this.card.abilities || this.card.abilities.length === 0) {
      this.card.abilities = [{
        name: this.card.name || 'Trap Effect',
        trigger: 'OnSummon' as any,
        effects: []
      }] as StructuredAbility[];
    }
    (this.card.abilities[0] as StructuredAbility).effects.push(effect);
    return this;
  }

  titleColor(color: string): this {
    this.card.titleColor = color;
    return this;
  }

  build(): TrapCard {
    if (!this.card.id) throw new Error('Card ID is required');
    if (!this.card.name) throw new Error('Card name is required');
    if (this.card.cost === undefined) throw new Error('Card cost is required');
    if (!this.card.activation) throw new Error('Card activation is required');
    if (!this.card.abilities || this.card.abilities.length === 0) {
      throw new Error('Card must have at least one ability');
    }

    return this.card as TrapCard;
  }
}

/**
 * Builder for Habitat cards
 */
export class HabitatCardBuilder {
  private card: Partial<HabitatCard> = {
    type: 'Habitat',
  };

  constructor(id: string, name: string) {
    this.card.id = id;
    this.card.name = name;
  }

  cost(cost: number): this {
    this.card.cost = cost;
    return this;
  }

  affinity(affinity: Affinity): this {
    this.card.affinity = affinity;
    return this;
  }

  ongoingEffects(effects: AbilityEffect[]): this {
    // Convert to StructuredAbility format with Passive trigger
    if (!this.card.abilities) {
      this.card.abilities = [];
    }
    this.card.abilities.push({
      name: `${this.card.name || 'Habitat'} Ongoing Effect`,
      trigger: 'Passive' as any,
      effects
    });
    return this;
  }

  onPlayEffects(effects: AbilityEffect[]): this {
    // Convert to StructuredAbility format with OnSummon trigger
    if (!this.card.abilities) {
      this.card.abilities = [];
    }
    this.card.abilities.push({
      name: `${this.card.name || 'Habitat'} On Play`,
      trigger: 'OnSummon' as any,
      effects
    });
    return this;
  }

  titleColor(color: string): this {
    this.card.titleColor = color;
    return this;
  }

  build(): HabitatCard {
    if (!this.card.id) throw new Error('Card ID is required');
    if (!this.card.name) throw new Error('Card name is required');
    if (this.card.cost === undefined) throw new Error('Card cost is required');
    if (!this.card.affinity) throw new Error('Card affinity is required');
    if (!this.card.abilities || this.card.abilities.length === 0) {
      throw new Error('Habitat must have at least one ability');
    }

    return this.card as HabitatCard;
  }
}

/**
 * Builder for Buff cards
 */
export class BuffCardBuilder {
  private card: Partial<BuffCard> = {
    type: 'Buff',
  };

  constructor(id: string, name: string) {
    this.card.id = id;
    this.card.name = name;
  }

  cost(cost: number): this {
    this.card.cost = cost;
    return this;
  }

  affinity(affinity: Affinity): this {
    this.card.affinity = affinity;
    return this;
  }

  ongoingEffects(effects: AbilityEffect[]): this {
    // Convert to StructuredAbility format with Passive trigger
    if (!this.card.abilities) {
      this.card.abilities = [];
    }
    this.card.abilities.push({
      name: `${this.card.name || 'Buff'} Ongoing Effect`,
      trigger: 'Passive' as any,
      effects
    });
    return this;
  }

  onPlayEffects(effects: AbilityEffect[]): this {
    // Convert to StructuredAbility format with OnSummon trigger
    if (!this.card.abilities) {
      this.card.abilities = [];
    }
    this.card.abilities.push({
      name: `${this.card.name || 'Buff'} On Play`,
      trigger: 'OnSummon' as any,
      effects
    });
    return this;
  }

  duration(turns: number): this {
    this.card.duration = turns;
    return this;
  }

  titleColor(color: string): this {
    this.card.titleColor = color;
    return this;
  }

  build(): BuffCard {
    if (!this.card.id) throw new Error('Card ID is required');
    if (!this.card.name) throw new Error('Card name is required');
    if (this.card.cost === undefined) throw new Error('Card cost is required');
    if (!this.card.abilities || this.card.abilities.length === 0) {
      throw new Error('Buff must have at least one ability');
    }

    return this.card as BuffCard;
  }
}

/**
 * Main CardBuilder factory
 */
export class CardBuilder {
  static bloomBeast(id: string, name: string): BloomBeastBuilder {
    return new BloomBeastBuilder(id, name);
  }

  static magic(id: string, name: string): MagicCardBuilder {
    return new MagicCardBuilder(id, name);
  }

  static trap(id: string, name: string): TrapCardBuilder {
    return new TrapCardBuilder(id, name);
  }

  static habitat(id: string, name: string): HabitatCardBuilder {
    return new HabitatCardBuilder(id, name);
  }

  static buff(id: string, name: string): BuffCardBuilder {
    return new BuffCardBuilder(id, name);
  }
}

// Export default for convenience
export default CardBuilder;
