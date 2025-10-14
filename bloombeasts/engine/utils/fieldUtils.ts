/**
 * Field Utilities
 *
 * Helper functions for working with the battlefield and beast fields.
 * Eliminates common iteration patterns throughout the codebase.
 */

import { BloomBeastInstance } from '../types/leveling';
import { Player } from '../types/game';

/**
 * Iterate over all beasts in the field, including null slots
 * @param field The field array
 * @param callback Function to call for each slot
 */
export function forEachBeast(
  field: (BloomBeastInstance | null)[],
  callback: (beast: BloomBeastInstance | null, index: number) => void
): void {
  field.forEach((beast, index) => callback(beast, index));
}

/**
 * Iterate over only non-null beasts in the field
 * @param field The field array
 * @param callback Function to call for each beast
 */
export function forEachActiveBeast(
  field: (BloomBeastInstance | null)[],
  callback: (beast: BloomBeastInstance, index: number) => void
): void {
  field.forEach((beast, index) => {
    if (beast !== null) {
      callback(beast, index);
    }
  });
}

/**
 * Get all beasts from the field (including null slots)
 * @param field The field array
 * @returns Array of beasts and nulls
 */
export function getAllSlots(field: (BloomBeastInstance | null)[]): (BloomBeastInstance | null)[] {
  return [...field];
}

/**
 * Get all non-null beasts from the field
 * @param field The field array
 * @returns Array of beasts (no nulls)
 */
export function getAllBeasts(field: (BloomBeastInstance | null)[]): BloomBeastInstance[] {
  return field.filter((beast): beast is BloomBeastInstance => beast !== null);
}

/**
 * Get all alive (HP > 0) beasts from the field
 * @param field The field array
 * @returns Array of alive beasts
 */
export function getAliveBeasts(field: (BloomBeastInstance | null)[]): BloomBeastInstance[] {
  return field.filter(
    (beast): beast is BloomBeastInstance => beast !== null && beast.currentHealth > 0
  );
}

/**
 * Get all dead (HP <= 0) beasts from the field
 * @param field The field array
 * @returns Array of dead beasts
 */
export function getDeadBeasts(field: (BloomBeastInstance | null)[]): BloomBeastInstance[] {
  return field.filter(
    (beast): beast is BloomBeastInstance => beast !== null && beast.currentHealth <= 0
  );
}

/**
 * Count alive beasts in the field
 * @param field The field array
 * @returns Number of alive beasts
 */
export function countAliveBeasts(field: (BloomBeastInstance | null)[]): number {
  return getAliveBeasts(field).length;
}

/**
 * Count total beasts in the field (excluding null slots)
 * @param field The field array
 * @returns Number of beasts
 */
export function countBeasts(field: (BloomBeastInstance | null)[]): number {
  return getAllBeasts(field).length;
}

/**
 * Find first empty slot in the field
 * @param field The field array
 * @returns Index of first empty slot, or -1 if none
 */
export function findEmptySlot(field: (BloomBeastInstance | null)[]): number {
  return field.findIndex((beast) => beast === null);
}

/**
 * Check if field has any empty slots
 * @param field The field array
 * @returns True if at least one empty slot exists
 */
export function hasEmptySlot(field: (BloomBeastInstance | null)[]): boolean {
  return findEmptySlot(field) !== -1;
}

/**
 * Check if field is full (no empty slots)
 * @param field The field array
 * @returns True if no empty slots
 */
export function isFieldFull(field: (BloomBeastInstance | null)[]): boolean {
  return !hasEmptySlot(field);
}

/**
 * Get beasts by affinity
 * @param field The field array
 * @param affinity The affinity to filter by
 * @returns Array of beasts with matching affinity
 */
export function getBeastsByAffinity(
  field: (BloomBeastInstance | null)[],
  affinity: string
): BloomBeastInstance[] {
  return getAllBeasts(field).filter((beast) => beast.affinity === affinity);
}

/**
 * Get beast at specific index
 * @param field The field array
 * @param index The slot index
 * @returns Beast at index or null
 */
export function getBeastAtIndex(
  field: (BloomBeastInstance | null)[],
  index: number
): BloomBeastInstance | null {
  if (index < 0 || index >= field.length) {
    return null;
  }
  return field[index];
}

/**
 * Find beast by instance ID
 * @param field The field array
 * @param instanceId The instance ID to find
 * @returns Object with beast and index, or null if not found
 */
export function findBeastById(
  field: (BloomBeastInstance | null)[],
  instanceId: string
): { beast: BloomBeastInstance; index: number } | null {
  for (let i = 0; i < field.length; i++) {
    const beast = field[i];
    if (beast && beast.instanceId === instanceId) {
      return { beast, index: i };
    }
  }
  return null;
}

/**
 * Get adjacent beasts (left and right neighbors)
 * @param field The field array
 * @param index The slot index
 * @returns Array of adjacent beasts (may be empty or contain 1-2 beasts)
 */
export function getAdjacentBeasts(
  field: (BloomBeastInstance | null)[],
  index: number
): BloomBeastInstance[] {
  const adjacent: BloomBeastInstance[] = [];

  // Left neighbor
  if (index > 0 && field[index - 1]) {
    adjacent.push(field[index - 1]!);
  }

  // Right neighbor
  if (index < field.length - 1 && field[index + 1]) {
    adjacent.push(field[index + 1]!);
  }

  return adjacent;
}

/**
 * Clear all dead beasts from field and move to graveyard
 * @param player The player whose field to clear
 * @returns Array of removed beasts
 */
export function clearDeadBeasts(player: Player): BloomBeastInstance[] {
  const deadBeasts: BloomBeastInstance[] = [];

  for (let i = 0; i < player.field.length; i++) {
    const beast = player.field[i];
    if (beast && beast.currentHealth <= 0) {
      deadBeasts.push(beast);
      player.field[i] = null;
    }
  }

  return deadBeasts;
}

/**
 * Get total attack power of all alive beasts
 * @param field The field array
 * @returns Sum of all attack values
 */
export function getTotalAttackPower(field: (BloomBeastInstance | null)[]): number {
  return getAliveBeasts(field).reduce((total, beast) => total + beast.currentAttack, 0);
}

/**
 * Get total health of all alive beasts
 * @param field The field array
 * @returns Sum of all health values
 */
export function getTotalHealth(field: (BloomBeastInstance | null)[]): number {
  return getAliveBeasts(field).reduce((total, beast) => total + beast.currentHealth, 0);
}
