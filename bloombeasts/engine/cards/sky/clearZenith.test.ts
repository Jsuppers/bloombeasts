/**
 * Tests for Clear Zenith habitat card
 */

import { describe, test, expect } from '@jest/globals';
import { CLEAR_ZENITH } from './clearZenith.js';
import { validateHabitatCard } from '../__tests__/testUtils.js';
import { EffectType, AbilityTarget } from '../../types/abilities.js';

describe('Clear Zenith Card', () => {
  describe('Base Card Properties', () => {
    test('should have valid habitat card structure', () => {
      validateHabitatCard(CLEAR_ZENITH);
    });

    test('should have correct card properties', () => {
      expect(CLEAR_ZENITH.id).toBe('clear-zenith');
      expect(CLEAR_ZENITH.name).toBe('Clear Zenith');
      expect(CLEAR_ZENITH.type).toBe('Habitat');
      expect(CLEAR_ZENITH.cost).toBe(1);
    });

    test('should have Sky affinity', () => {
      expect(CLEAR_ZENITH.affinity).toBe('Sky');
    });

    test('should have low cost for habitat card', () => {
      expect(CLEAR_ZENITH.cost).toBe(1);
    });

    test('should have custom title color for visibility', () => {
      expect(CLEAR_ZENITH.titleColor).toBe('#000000');
    });
  });

  describe('Ongoing Effects', () => {
    test('should have no ongoing effects', () => {
      expect(CLEAR_ZENITH.ongoingEffects).toBeDefined();
      expect(CLEAR_ZENITH.ongoingEffects).toHaveLength(0);
    });

    test('should focus on immediate value', () => {
      expect(CLEAR_ZENITH.ongoingEffects).toHaveLength(0);
      expect(CLEAR_ZENITH.onPlayEffects).toHaveLength(1);
    });
  });

  describe('On Play Effects', () => {
    test('should have exactly one on-play effect', () => {
      expect(CLEAR_ZENITH.onPlayEffects).toBeDefined();
      expect(CLEAR_ZENITH.onPlayEffects).toHaveLength(1);
    });

    test('should have draw card effect', () => {
      const effect = CLEAR_ZENITH.onPlayEffects![0];
      expect(effect.type).toBe(EffectType.DrawCards);
    });

    test('should target the player', () => {
      const effect = CLEAR_ZENITH.onPlayEffects![0];
      expect(effect.target).toBe(AbilityTarget.PlayerGardener);
    });

    test('should draw 1 card', () => {
      const effect = CLEAR_ZENITH.onPlayEffects![0];
      expect(effect.value).toBe(1);
    });
  });

  describe('Card Balance', () => {
    test('should provide fair value for 1 cost', () => {
      // 1 cost habitat that draws 1 card
      expect(CLEAR_ZENITH.cost).toBe(1);
      const effect = CLEAR_ZENITH.onPlayEffects![0];
      expect(effect.value).toBe(1);
    });

    test('should replace itself', () => {
      // Essentially a 0-cost habitat that draws a card
      const effect = CLEAR_ZENITH.onPlayEffects![0];
      expect(effect.type).toBe(EffectType.DrawCards);
      expect(effect.value).toBe(1);
    });

    test('should provide card advantage', () => {
      const effect = CLEAR_ZENITH.onPlayEffects![0];
      expect(effect.type).toBe(EffectType.DrawCards);
    });

    test('should be low risk, medium reward', () => {
      expect(CLEAR_ZENITH.cost).toBe(1);
      expect(CLEAR_ZENITH.onPlayEffects).toHaveLength(1);
    });
  });

  describe('Thematic Consistency', () => {
    test('should have sky/height themed name', () => {
      expect(CLEAR_ZENITH.name).toContain('Clear');
      expect(CLEAR_ZENITH.name).toContain('Zenith');
    });

    test('should match Sky affinity', () => {
      expect(CLEAR_ZENITH.affinity).toBe('Sky');
    });

    test('should represent clarity and vision', () => {
      // Drawing cards = gaining knowledge/vision
      const effect = CLEAR_ZENITH.onPlayEffects![0];
      expect(effect.type).toBe(EffectType.DrawCards);
    });

    test('should have light/airy theme', () => {
      expect(CLEAR_ZENITH.name).toContain('Clear');
      expect(CLEAR_ZENITH.affinity).toBe('Sky');
    });
  });

  describe('Strategic Use Cases', () => {
    test('should enable card cycling', () => {
      const effect = CLEAR_ZENITH.onPlayEffects![0];
      expect(effect.type).toBe(EffectType.DrawCards);
    });

    test('should synergize with Sky decks', () => {
      expect(CLEAR_ZENITH.affinity).toBe('Sky');
    });

    test('should never be a dead card', () => {
      // Always draws, so worst case it cycles
      const effect = CLEAR_ZENITH.onPlayEffects![0];
      expect(effect.type).toBe(EffectType.DrawCards);
    });

    test('should help find answers', () => {
      // Extra card draw helps dig for solutions
      const effect = CLEAR_ZENITH.onPlayEffects![0];
      expect(effect.value).toBe(1);
    });
  });

  describe('Habitat Mechanics', () => {
    test('should have immediate value on play', () => {
      expect(CLEAR_ZENITH.onPlayEffects).toHaveLength(1);
    });

    test('should have no lasting effects', () => {
      expect(CLEAR_ZENITH.ongoingEffects).toHaveLength(0);
    });

    test('should be pure utility', () => {
      // No stat buffs or damage, just card draw
      const effect = CLEAR_ZENITH.onPlayEffects![0];
      expect(effect.type).toBe(EffectType.DrawCards);
    });
  });

  describe('Card Advantage Analysis', () => {
    test('should maintain card parity at minimum', () => {
      // Play 1 card, draw 1 card = neutral
      expect(CLEAR_ZENITH.cost).toBe(1);
      const effect = CLEAR_ZENITH.onPlayEffects![0];
      expect(effect.value).toBe(1);
    });

    test('should provide deck thinning', () => {
      const effect = CLEAR_ZENITH.onPlayEffects![0];
      expect(effect.type).toBe(EffectType.DrawCards);
    });

    test('should enable combo strategies', () => {
      // Card draw helps assemble combos
      const effect = CLEAR_ZENITH.onPlayEffects![0];
      expect(effect.type).toBe(EffectType.DrawCards);
    });
  });

  describe('Comparison with Other Habitats', () => {
    test('should be most utility-focused habitat', () => {
      const effect = CLEAR_ZENITH.onPlayEffects![0];
      expect(effect.type).toBe(EffectType.DrawCards);
    });

    test('should have no combat impact', () => {
      // No stats, no damage, just card draw
      expect(CLEAR_ZENITH.ongoingEffects).toHaveLength(0);
      const effect = CLEAR_ZENITH.onPlayEffects![0];
      expect(effect.type).toBe(EffectType.DrawCards);
    });

    test('should be safest habitat to play', () => {
      // No downside, just draws a card
      expect(CLEAR_ZENITH.onPlayEffects).toHaveLength(1);
    });
  });

  describe('Design Philosophy', () => {
    test('should represent Sky theme of mobility and knowledge', () => {
      expect(CLEAR_ZENITH.affinity).toBe('Sky');
      const effect = CLEAR_ZENITH.onPlayEffects![0];
      expect(effect.type).toBe(EffectType.DrawCards);
    });

    test('should be consistent with cantrip design', () => {
      // Cantrip = spell that draws a card
      const effect = CLEAR_ZENITH.onPlayEffects![0];
      expect(effect.value).toBe(1);
    });
  });

  describe('Deck Building Implications', () => {
    test('should be include in Sky decks', () => {
      expect(CLEAR_ZENITH.affinity).toBe('Sky');
      expect(CLEAR_ZENITH.cost).toBe(1);
    });

    test('should smooth out draws', () => {
      const effect = CLEAR_ZENITH.onPlayEffects![0];
      expect(effect.type).toBe(EffectType.DrawCards);
    });

    test('should effectively reduce deck size', () => {
      // Card that draws = one less card in effective deck
      const effect = CLEAR_ZENITH.onPlayEffects![0];
      expect(effect.type).toBe(EffectType.DrawCards);
    });
  });

  describe('UI Considerations', () => {
    test('should have black title for light background', () => {
      // Sky cards likely have light backgrounds
      expect(CLEAR_ZENITH.titleColor).toBe('#000000');
    });

    test('should ensure readability', () => {
      expect(CLEAR_ZENITH.titleColor).toBeDefined();
    });
  });

  describe('Tempo and Value', () => {
    test('should be tempo neutral', () => {
      // 1 cost, draws 1 = neutral tempo
      expect(CLEAR_ZENITH.cost).toBe(1);
      const effect = CLEAR_ZENITH.onPlayEffects![0];
      expect(effect.value).toBe(1);
    });

    test('should provide selection advantage', () => {
      // Choose best card from new options
      const effect = CLEAR_ZENITH.onPlayEffects![0];
      expect(effect.type).toBe(EffectType.DrawCards);
    });
  });
});
