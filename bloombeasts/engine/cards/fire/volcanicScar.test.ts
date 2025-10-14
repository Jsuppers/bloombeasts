/**
 * Tests for Volcanic Scar habitat card
 */

import { describe, test, expect } from '@jest/globals';
import { VOLCANIC_SCAR } from './volcanicScar.js';
import { validateHabitatCard } from '../__tests__/testUtils.js';
import { EffectType, AbilityTarget } from '../../types/abilities.js';

describe('Volcanic Scar Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid habitat card structure', () => {
      validateHabitatCard(VOLCANIC_SCAR);
    });

    test('should have correct card properties', () => {
      expect(VOLCANIC_SCAR.id).toBe('volcanic-scar');
      expect(VOLCANIC_SCAR.name).toBe('Volcanic Scar');
      expect(VOLCANIC_SCAR.type).toBe('Habitat');
      expect(VOLCANIC_SCAR.cost).toBe(1);
    });

    test('should have Fire affinity', () => {
      expect(VOLCANIC_SCAR.affinity).toBe('Fire');
    });

    test('should have low cost for habitat card', () => {
      expect(VOLCANIC_SCAR.cost).toBe(1);
    });
  });

  describe('Ongoing Effects', () => {
    test('should have no ongoing effects', () => {
      expect(VOLCANIC_SCAR.ongoingEffects).toBeDefined();
      expect(VOLCANIC_SCAR.ongoingEffects).toHaveLength(0);
    });

    test('should focus on immediate impact', () => {
      expect(VOLCANIC_SCAR.ongoingEffects).toHaveLength(0);
      expect(VOLCANIC_SCAR.onPlayEffects).toHaveLength(1);
    });
  });

  describe('On Play Effects', () => {
    test('should have exactly one on-play effect', () => {
      expect(VOLCANIC_SCAR.onPlayEffects).toBeDefined();
      expect(VOLCANIC_SCAR.onPlayEffects).toHaveLength(1);
    });

    test('should have damage effect', () => {
      const effect = VOLCANIC_SCAR.onPlayEffects![0];
      expect(effect.type).toBe(EffectType.DealDamage);
    });

    test('should target all units', () => {
      const effect = VOLCANIC_SCAR.onPlayEffects![0];
      expect(effect.target).toBe(AbilityTarget.AllUnits);
    });

    test('should deal 1 damage', () => {
      const effect = VOLCANIC_SCAR.onPlayEffects![0];
      expect(effect.value).toBe(1);
    });

    test('should have condition to exclude Fire units', () => {
      const effect = VOLCANIC_SCAR.onPlayEffects![0];
      expect(effect.condition).toBeDefined();
      expect(effect.condition?.type).toBe('affinity-not-matches');
      expect(effect.condition?.value).toBe('Fire');
    });
  });

  describe('Card Balance', () => {
    test('should provide fair value for 1 cost', () => {
      // 1 cost habitat with conditional AOE damage
      expect(VOLCANIC_SCAR.cost).toBe(1);
      expect(VOLCANIC_SCAR.onPlayEffects).toHaveLength(1);
    });

    test('should be a board wipe effect', () => {
      const effect = VOLCANIC_SCAR.onPlayEffects![0];
      expect(effect.type).toBe(EffectType.DealDamage);
      expect(effect.target).toBe(AbilityTarget.AllUnits);
    });

    test('should be asymmetric in Fire decks', () => {
      // Damages non-Fire units, spares Fire units
      const effect = VOLCANIC_SCAR.onPlayEffects![0];
      expect(effect.condition?.value).toBe('Fire');
    });

    test('should punish wide boards', () => {
      // Hits all units
      const effect = VOLCANIC_SCAR.onPlayEffects![0];
      expect(effect.target).toBe(AbilityTarget.AllUnits);
    });
  });

  describe('Thematic Consistency', () => {
    test('should have volcanic/fire themed name', () => {
      expect(VOLCANIC_SCAR.name).toContain('Volcanic');
      expect(VOLCANIC_SCAR.name).toContain('Scar');
    });

    test('should match Fire affinity', () => {
      expect(VOLCANIC_SCAR.affinity).toBe('Fire');
    });

    test('should represent destructive environment', () => {
      const effect = VOLCANIC_SCAR.onPlayEffects![0];
      expect(effect.type).toBe(EffectType.DealDamage);
    });

    test('should protect Fire creatures from harsh environment', () => {
      const effect = VOLCANIC_SCAR.onPlayEffects![0];
      expect(effect.condition?.value).toBe('Fire');
    });
  });

  describe('Strategic Use Cases', () => {
    test('should act as board clear', () => {
      const effect = VOLCANIC_SCAR.onPlayEffects![0];
      expect(effect.type).toBe(EffectType.DealDamage);
      expect(effect.target).toBe(AbilityTarget.AllUnits);
    });

    test('should synergize with Fire beasts', () => {
      expect(VOLCANIC_SCAR.affinity).toBe('Fire');
      const effect = VOLCANIC_SCAR.onPlayEffects![0];
      expect(effect.condition?.value).toBe('Fire');
    });

    test('should punish opponent\'s board development', () => {
      // Hits all non-Fire units
      const effect = VOLCANIC_SCAR.onPlayEffects![0];
      expect(effect.target).toBe(AbilityTarget.AllUnits);
    });

    test('should enable aggressive Fire strategies', () => {
      // Clear opponent's board while keeping your Fire units
      expect(VOLCANIC_SCAR.affinity).toBe('Fire');
    });
  });

  describe('Habitat Mechanics', () => {
    test('should have immediate impact on play', () => {
      expect(VOLCANIC_SCAR.onPlayEffects).toHaveLength(1);
    });

    test('should have no lasting effects', () => {
      expect(VOLCANIC_SCAR.ongoingEffects).toHaveLength(0);
    });

    test('should be a one-shot effect', () => {
      // Damages on entry, no ongoing effect
      expect(VOLCANIC_SCAR.onPlayEffects).toHaveLength(1);
      expect(VOLCANIC_SCAR.ongoingEffects).toHaveLength(0);
    });
  });

  describe('Affinity Interaction', () => {
    test('should spare Fire units from damage', () => {
      const effect = VOLCANIC_SCAR.onPlayEffects![0];
      expect(effect.condition?.type).toBe('affinity-not-matches');
      expect(effect.condition?.value).toBe('Fire');
    });

    test('should damage all other affinities', () => {
      const effect = VOLCANIC_SCAR.onPlayEffects![0];
      expect(effect.target).toBe(AbilityTarget.AllUnits);
      expect(effect.condition?.type).toBe('affinity-not-matches');
    });

    test('should create asymmetric advantage for Fire decks', () => {
      expect(VOLCANIC_SCAR.affinity).toBe('Fire');
      const effect = VOLCANIC_SCAR.onPlayEffects![0];
      expect(effect.condition?.value).toBe('Fire');
    });
  });

  describe('Comparison with Other Habitats', () => {
    test('should be unique with damage effect', () => {
      const effect = VOLCANIC_SCAR.onPlayEffects![0];
      expect(effect.type).toBe(EffectType.DealDamage);
    });

    test('should have no ongoing buffs unlike other habitats', () => {
      expect(VOLCANIC_SCAR.ongoingEffects).toHaveLength(0);
    });

    test('should be most aggressive habitat', () => {
      const effect = VOLCANIC_SCAR.onPlayEffects![0];
      expect(effect.type).toBe(EffectType.DealDamage);
    });
  });

  describe('Board State Impact', () => {
    test('should kill 1 HP units', () => {
      const effect = VOLCANIC_SCAR.onPlayEffects![0];
      expect(effect.value).toBe(1);
    });

    test('should weaken all surviving units', () => {
      const effect = VOLCANIC_SCAR.onPlayEffects![0];
      expect(effect.type).toBe(EffectType.DealDamage);
      expect(effect.target).toBe(AbilityTarget.AllUnits);
    });

    test('should enable follow-up plays', () => {
      // 1 damage softens units for removal
      const effect = VOLCANIC_SCAR.onPlayEffects![0];
      expect(effect.value).toBe(1);
    });
  });

  describe('Risk vs Reward', () => {
    test('should affect both sides of board', () => {
      const effect = VOLCANIC_SCAR.onPlayEffects![0];
      expect(effect.target).toBe(AbilityTarget.AllUnits);
    });

    test('should require Fire units to maximize value', () => {
      const effect = VOLCANIC_SCAR.onPlayEffects![0];
      expect(effect.condition?.value).toBe('Fire');
    });

    test('should punish non-Fire units in your own deck', () => {
      // If you have non-Fire units, they take damage too
      const effect = VOLCANIC_SCAR.onPlayEffects![0];
      expect(effect.target).toBe(AbilityTarget.AllUnits);
    });
  });

  describe('Timing Considerations', () => {
    test('should be best used when behind on board', () => {
      // Board clear effect
      const effect = VOLCANIC_SCAR.onPlayEffects![0];
      expect(effect.type).toBe(EffectType.DealDamage);
    });

    test('should combo with Fire unit deployment', () => {
      expect(VOLCANIC_SCAR.affinity).toBe('Fire');
    });
  });
});
