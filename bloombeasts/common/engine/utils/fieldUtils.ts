/**
 * Field Utilities
 *
 * Helper functions for working with the battlefield and beast fields.
 * Eliminates common iteration patterns throughout the codebase.
 */

import { RuntimeBeast } from '../types/runtime';

/**
 * Get all non-null beasts from the field
 * @param field The field array
 * @returns Array of beasts (no nulls)
 */
export function getAllBeasts(field: (RuntimeBeast | null)[]): RuntimeBeast[] {
  return field.filter((beast): beast is RuntimeBeast => beast !== null);
}

/**
 * Get all alive (HP > 0) beasts from the field
 * @param field The field array
 * @returns Array of alive beasts
 */
export function getAliveBeasts(field: (RuntimeBeast | null)[]): RuntimeBeast[] {
  return field.filter(
    (beast): beast is RuntimeBeast => beast !== null && beast.currentHealth > 0
  );
}

/**
 * Find first empty slot in the field
 * @param field The field array
 * @returns Index of first empty slot, or -1 if none
 */
export function findEmptySlot(field: (RuntimeBeast | null)[]): number {
  return field.findIndex((beast) => beast === null);
}

/**
 * Find beast by instance ID
 * @param field The field array
 * @param instanceId The instance ID to find
 * @returns Object with beast and index, or null if not found
 */
export function findBeastById(
  field: (RuntimeBeast | null)[],
  instanceId: string
): { beast: RuntimeBeast; index: number } | null {
  for (let i = 0; i < field.length; i++) {
    const beast = field[i];
    if (beast && beast.instanceId === instanceId) {
      return { beast, index: i };
    }
  }
  return null;
}

