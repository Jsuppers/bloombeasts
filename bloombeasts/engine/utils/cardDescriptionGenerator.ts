/**
 * Generates human-readable descriptions for all card types
 * (Magic, Trap, Buff, Habitat, and Bloom cards)
 */

import { getAbilityDescription } from './getAbilityDescription';

/**
 * Get description for any card type
 * All cards now use the standardized abilities structure
 */
export function getCardDescription(card: any): string {
  if (!card) return '';

  // All cards use abilities array
  if (card.abilities && Array.isArray(card.abilities)) {
    // Generate descriptions for all abilities and combine them
    const abilityDescriptions = card.abilities
      .map((ability: any) => getAbilityDescription(ability))
      .filter((desc: string) => desc.length > 0);

    // Combine ability descriptions with bullet points if multiple
    if (abilityDescriptions.length === 0) {
      return '';
    } else if (abilityDescriptions.length === 1) {
      return abilityDescriptions[0];
    } else {
      // Multiple abilities: join with bullet points
      return abilityDescriptions.map((desc: string) => `• ${desc}`).join(' ');
    }
  }

  // Fallback: return card description if it exists, otherwise empty
  return card.description || '';
}
