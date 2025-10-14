/**
 * Helper function to get ability description
 * Generates description from ability effects
 */

import { StructuredAbility } from '../types/abilities';
import { generateAbilityDescription } from './abilityDescriptionGenerator';

/**
 * Get the description for an ability
 * @param ability The ability to get description for
 * @returns The description string
 */
export function getAbilityDescription(ability: StructuredAbility): string {
  return generateAbilityDescription(ability);
}
