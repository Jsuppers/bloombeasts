/**
 * Test utilities for card testing
 */

import type { BloomBeastCard, MagicCard, TrapCard, HabitatCard, BuffCard } from '../../types/core';
import type { StructuredAbility, AbilityEffect, AbilityTrigger } from '../../types/abilities';

/**
 * Validates that a card has all required base properties
 */
export function validateBaseCard(card: any): void {
  expect(card).toBeDefined();
  expect(card.id).toBeDefined();
  expect(typeof card.id).toBe('string');
  expect(card.name).toBeDefined();
  expect(typeof card.name).toBe('string');
  expect(card.type).toBeDefined();
  expect(['Magic', 'Trap', 'Bloom', 'Habitat', 'Buff']).toContain(card.type);
  expect(card.cost).toBeDefined();
  expect(typeof card.cost).toBe('number');
  expect(card.cost).toBeGreaterThanOrEqual(0);
}

/**
 * Validates a Bloom Beast card structure
 */
export function validateBloomBeastCard(card: BloomBeastCard): void {
  validateBaseCard(card);
  expect(card.type).toBe('Bloom');
  expect(card.affinity).toBeDefined();
  expect(['Forest', 'Fire', 'Water', 'Sky', 'Generic']).toContain(card.affinity);
  expect(card.baseAttack).toBeDefined();
  expect(typeof card.baseAttack).toBe('number');
  expect(card.baseAttack).toBeGreaterThanOrEqual(0);
  expect(card.baseHealth).toBeDefined();
  expect(typeof card.baseHealth).toBe('number');
  expect(card.baseHealth).toBeGreaterThan(0);
  expect(card.abilities).toBeDefined();
  expect(Array.isArray(card.abilities)).toBe(true);
}

/**
 * Validates a structured ability
 */
export function validateStructuredAbility(ability: StructuredAbility): void {
  expect(ability).toBeDefined();
  expect(ability.name).toBeDefined();
  expect(typeof ability.name).toBe('string');
  expect(ability.effects).toBeDefined();
  expect(Array.isArray(ability.effects)).toBe(true);
  expect(ability.effects.length).toBeGreaterThan(0);

  if (ability.trigger) {
    expect([
      'OnSummon', 'OnAllySummon', 'OnAttack', 'OnDamage', 'OnDestroy',
      'OnPlayer1StartOfTurn', 'OnPlayer1EndOfTurn',
      'OnPlayer2StartOfTurn', 'OnPlayer2EndOfTurn',
      'OnAnyStartOfTurn', 'OnAnyEndOfTurn',
      'OnOwnStartOfTurn', 'OnOwnEndOfTurn',
      'OnOpponentStartOfTurn', 'OnOpponentEndOfTurn',
      'Passive', 'Activated'
    ]).toContain(ability.trigger);
  }
}

/**
 * Validates an ability (can be SimpleAbility or StructuredAbility)
 */
export function validateAbility(ability: any): void {
  expect(ability).toBeDefined();
  expect(ability.name).toBeDefined();
  expect(typeof ability.name).toBe('string');

  // Check if it's a StructuredAbility (has effects array)
  if (ability.effects) {
    validateStructuredAbility(ability);
  }
  // Otherwise it's a SimpleAbility, just check the trigger if present
  else if (ability.trigger) {
    expect([
      'OnSummon', 'OnAllySummon', 'OnAttack', 'OnDamage', 'OnDestroy',
      'StartOfTurn', 'EndOfTurn', 'Passive', 'Activated'
    ]).toContain(ability.trigger);
  }
}

/**
 * Validates an ability effect
 */
export function validateAbilityEffect(effect: AbilityEffect): void {
  expect(effect).toBeDefined();
  expect(effect.type).toBeDefined();
  expect(effect.target).toBeDefined();
}

/**
 * Validates leveling configuration
 */
export function validateLevelingConfig(card: BloomBeastCard): void {
  if (!card.levelingConfig) return;

  const config = card.levelingConfig;

  // Validate stat gains if present
  if (config.statGains) {
    const levels = Object.keys(config.statGains).map(Number);
    levels.forEach(level => {
      expect(level).toBeGreaterThanOrEqual(1);
      expect(level).toBeLessThanOrEqual(9);
      const gains = config.statGains![level as keyof typeof config.statGains];
      expect(gains).toBeDefined();
      expect(typeof gains.hp).toBe('number');
      expect(typeof gains.atk).toBe('number');
      expect(gains.hp).toBeGreaterThanOrEqual(0);
      expect(gains.atk).toBeGreaterThanOrEqual(0);
    });
  }

  // Validate ability upgrades if present
  if (config.abilityUpgrades) {
    const upgradeLevels = Object.keys(config.abilityUpgrades).map(Number);
    upgradeLevels.forEach(level => {
      expect([4, 7, 9]).toContain(level);
      const upgrade = config.abilityUpgrades![level as keyof typeof config.abilityUpgrades];
      expect(upgrade).toBeDefined();
      if (upgrade.ability) {
        validateStructuredAbility(upgrade.ability);
      }
    });
  }
}

/**
 * Validates a Magic card structure
 */
export function validateMagicCard(card: MagicCard): void {
  validateBaseCard(card);
  expect(card.type).toBe('Magic');
  expect(card.abilities).toBeDefined();
  expect(Array.isArray(card.abilities)).toBe(true);
  expect(card.abilities.length).toBeGreaterThan(0);
  card.abilities.forEach(ability => validateAbility(ability));
  if (card.targetRequired !== undefined) {
    expect(typeof card.targetRequired).toBe('boolean');
  }
}

/**
 * Validates a Trap card structure
 */
export function validateTrapCard(card: TrapCard): void {
  validateBaseCard(card);
  expect(card.type).toBe('Trap');
  expect(card.activation).toBeDefined();
  expect(card.activation.trigger).toBeDefined();
  expect(card.abilities).toBeDefined();
  expect(Array.isArray(card.abilities)).toBe(true);
  expect(card.abilities.length).toBeGreaterThan(0);
  card.abilities.forEach(ability => validateAbility(ability));
}

/**
 * Validates a Habitat card structure
 */
export function validateHabitatCard(card: HabitatCard): void {
  validateBaseCard(card);
  expect(card.type).toBe('Habitat');
  expect(card.affinity).toBeDefined();
  expect(['Forest', 'Fire', 'Water', 'Sky', 'Generic']).toContain(card.affinity);
  expect(card.abilities).toBeDefined();
  expect(Array.isArray(card.abilities)).toBe(true);
  card.abilities.forEach(ability => validateAbility(ability));
}

/**
 * Validates a Buff card structure
 */
export function validateBuffCard(card: BuffCard): void {
  validateBaseCard(card);
  expect(card.type).toBe('Buff');
  expect(card.abilities).toBeDefined();
  expect(Array.isArray(card.abilities)).toBe(true);
  card.abilities.forEach(ability => validateAbility(ability));

  if (card.affinity) {
    expect(['Forest', 'Fire', 'Water', 'Sky', 'Generic']).toContain(card.affinity);
  }
}

/**
 * Helper to check if an ability has a specific trigger
 */
export function hasAbilityTrigger(ability: StructuredAbility, trigger: AbilityTrigger): boolean {
  return ability.trigger === trigger;
}

/**
 * Helper to count effects of a specific type
 */
export function countEffectsByType(effects: AbilityEffect[], effectType: string): number {
  return effects.filter(effect => effect.type === effectType).length;
}

/**
 * Helper to get effects by target
 */
export function getEffectsByTarget(effects: AbilityEffect[], target: string): AbilityEffect[] {
  return effects.filter(effect => effect.target === target);
}

/**
 * Validates that stat gains are cumulative and increasing
 */
export function validateStatGainsProgression(card: BloomBeastCard): void {
  if (!card.levelingConfig?.statGains) return;

  const statGains = card.levelingConfig.statGains;
  const levels = Object.keys(statGains).map(Number).sort((a, b) => a - b);

  for (let i = 1; i < levels.length; i++) {
    const prevLevel = levels[i - 1];
    const currLevel = levels[i];
    const prev = statGains[prevLevel as keyof typeof statGains];
    const curr = statGains[currLevel as keyof typeof statGains];

    // Stats should be non-decreasing
    expect(curr.hp).toBeGreaterThanOrEqual(prev.hp);
    expect(curr.atk).toBeGreaterThanOrEqual(prev.atk);
  }
}

/**
 * Load a card from JSON catalog by ID
 *
 * @param cardId - The ID of the card to load (e.g., 'mosslet', 'blazefinch')
 * @param catalogName - The catalog name (e.g., 'forest', 'fire', 'water', 'sky', 'magic', 'trap', 'buff')
 * @returns The card data from the JSON catalog
 */
export function loadCardFromJSON(cardId: string, catalogName: string): any {
  const fs = require('fs');
  const path = require('path');

  // Path to catalog file from test location
  // Tests are in bloombeasts/engine/cards/__tests__/
  // Catalogs are in assets/catalogs/
  const catalogPath = path.join(__dirname, '../../../../assets/catalogs', `${catalogName}Assets.json`);

  // Read and parse the JSON file
  const catalogData = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));

  // Find the card by ID in the data array
  const cardEntry = catalogData.data.find((entry: any) => entry.id === cardId);

  if (!cardEntry) {
    throw new Error(`Card '${cardId}' not found in ${catalogName}Assets.json`);
  }

  // Return the card data
  return cardEntry.data;
}

/**
 * Load multiple cards from JSON catalog by IDs
 *
 * @param cardIds - Array of card IDs to load
 * @param catalogName - The catalog name
 * @returns Array of card data from the JSON catalog
 */
export function loadCardsFromJSON(cardIds: string[], catalogName: string): any[] {
  return cardIds.map(id => loadCardFromJSON(id, catalogName));
}
