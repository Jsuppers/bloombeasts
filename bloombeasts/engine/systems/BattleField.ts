/**
 * BattleField
 *
 * Encapsulates field management with clean API for slot operations.
 * Eliminates direct array manipulation throughout the codebase.
 */

import { BloomBeastInstance } from '../types/leveling';
import { FIELD_SIZE } from '../constants/gameRules';
import {
  getAllBeasts,
  getAliveBeasts,
  findEmptySlot,
  hasEmptySlot,
  getBeastAtIndex,
  findBeastById,
  getAdjacentBeasts,
  clearDeadBeasts,
} from '../utils/fieldUtils';
import { Player } from '../types/game';

export class BattleField {
  private slots: (BloomBeastInstance | null)[];
  private owner: Player;

  constructor(owner: Player, size: number = FIELD_SIZE) {
    this.owner = owner;
    this.slots = Array(size).fill(null);
  }

  /**
   * Get the size of the field
   */
  get size(): number {
    return this.slots.length;
  }

  /**
   * Get all slots (including empty ones)
   */
  getSlots(): (BloomBeastInstance | null)[] {
    return [...this.slots];
  }

  /**
   * Get all beasts (non-null only)
   */
  getAllBeasts(): BloomBeastInstance[] {
    return getAllBeasts(this.slots);
  }

  /**
   * Get all alive beasts (HP > 0)
   */
  getAliveBeasts(): BloomBeastInstance[] {
    return getAliveBeasts(this.slots);
  }

  /**
   * Get beast at specific index
   */
  getBeastAt(index: number): BloomBeastInstance | null {
    return getBeastAtIndex(this.slots, index);
  }

  /**
   * Set beast at specific index
   */
  setBeastAt(index: number, beast: BloomBeastInstance | null): boolean {
    if (index < 0 || index >= this.slots.length) {
      return false;
    }
    this.slots[index] = beast;
    if (beast) {
      beast.slotIndex = index;
    }
    return true;
  }

  /**
   * Add beast to first empty slot
   */
  addBeast(beast: BloomBeastInstance): number {
    const index = findEmptySlot(this.slots);
    if (index === -1) {
      return -1;
    }
    this.setBeastAt(index, beast);
    return index;
  }

  /**
   * Remove beast at index
   */
  removeBeastAt(index: number): BloomBeastInstance | null {
    const beast = this.getBeastAt(index);
    if (beast) {
      this.slots[index] = null;
    }
    return beast;
  }

  /**
   * Remove beast by instance ID
   */
  removeBeast(instanceId: string): BloomBeastInstance | null {
    const result = findBeastById(this.slots, instanceId);
    if (result) {
      return this.removeBeastAt(result.index);
    }
    return null;
  }

  /**
   * Find beast by instance ID
   */
  findBeast(instanceId: string): { beast: BloomBeastInstance; index: number } | null {
    return findBeastById(this.slots, instanceId);
  }

  /**
   * Check if field has empty slot
   */
  hasSpace(): boolean {
    return hasEmptySlot(this.slots);
  }

  /**
   * Check if field is full
   */
  isFull(): boolean {
    return !this.hasSpace();
  }

  /**
   * Check if field is empty
   */
  isEmpty(): boolean {
    return this.getAllBeasts().length === 0;
  }

  /**
   * Get number of beasts on field
   */
  count(): number {
    return this.getAllBeasts().length;
  }

  /**
   * Get number of alive beasts
   */
  countAlive(): number {
    return this.getAliveBeasts().length;
  }

  /**
   * Get adjacent beasts to a specific index
   */
  getAdjacent(index: number): BloomBeastInstance[] {
    return getAdjacentBeasts(this.slots, index);
  }

  /**
   * Clear all dead beasts from field
   */
  clearDead(): BloomBeastInstance[] {
    return clearDeadBeasts(this.owner);
  }

  /**
   * Clear all beasts from field
   */
  clear(): void {
    this.slots.fill(null);
  }

  /**
   * Move beast from one slot to another
   */
  moveBeast(fromIndex: number, toIndex: number): boolean {
    if (fromIndex < 0 || fromIndex >= this.slots.length) {
      return false;
    }
    if (toIndex < 0 || toIndex >= this.slots.length) {
      return false;
    }

    const beast = this.getBeastAt(fromIndex);
    if (!beast) {
      return false;
    }

    // Swap positions
    const targetBeast = this.getBeastAt(toIndex);
    this.setBeastAt(toIndex, beast);
    this.setBeastAt(fromIndex, targetBeast);

    return true;
  }

  /**
   * Get beasts by affinity
   */
  getBeastsByAffinity(affinity: string): BloomBeastInstance[] {
    return this.getAllBeasts().filter((beast) => beast.affinity === affinity);
  }

  /**
   * Get beasts matching a predicate
   */
  filter(predicate: (beast: BloomBeastInstance) => boolean): BloomBeastInstance[] {
    return this.getAllBeasts().filter(predicate);
  }

  /**
   * Iterate over all beasts
   */
  forEach(callback: (beast: BloomBeastInstance, index: number) => void): void {
    this.getAllBeasts().forEach((beast) => {
      const result = this.findBeast(beast.instanceId);
      if (result) {
        callback(beast, result.index);
      }
    });
  }

  /**
   * Iterate over all slots (including empty)
   */
  forEachSlot(callback: (beast: BloomBeastInstance | null, index: number) => void): void {
    this.slots.forEach(callback);
  }

  /**
   * Update field from raw array (for backwards compatibility)
   */
  fromArray(field: (BloomBeastInstance | null)[]): void {
    this.slots = [...field];
  }

  /**
   * Convert to raw array (for backwards compatibility)
   */
  toArray(): (BloomBeastInstance | null)[] {
    return [...this.slots];
  }

  /**
   * Sync field back to player object
   */
  syncToPlayer(): void {
    this.owner.field = this.toArray();
  }

  /**
   * Create BattleField from player
   */
  static fromPlayer(player: Player): BattleField {
    const field = new BattleField(player, player.field.length);
    field.fromArray(player.field);
    return field;
  }
}
