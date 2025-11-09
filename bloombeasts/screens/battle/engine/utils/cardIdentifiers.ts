/**
 * Card Identifier Utilities
 *
 * Provides consistent ID matching across the battle system.
 *
 * Cards/beasts have two ID fields:
 * - id: Base card ID (e.g., "forest-beast-1") - shared across all instances
 * - instanceId: Unique instance ID (e.g., "forest-beast-1-123-456") - unique per instance
 *
 * Use these helpers instead of manual ID comparisons to ensure consistency.
 */

/**
 * Get the canonical identifier for a card/beast
 * Prefers instanceId (unique) over id (shared across all instances of same card)
 */
export function getCardIdentifier(card: { id: string; instanceId?: string }): string {
  return card.instanceId || card.id;
}

/**
 * Check if two cards/beasts match by their identifiers
 * Compares canonical identifiers (prefers instanceId)
 */
export function cardsMatch(
  card1: { id: string; instanceId?: string },
  card2: { id: string; instanceId?: string }
): boolean {
  const id1 = getCardIdentifier(card1);
  const id2 = getCardIdentifier(card2);
  return id1 === id2;
}

/**
 * Check if a card matches a given identifier (either id or instanceId)
 * Useful when searching with an ID that could be either base ID or instance ID
 */
export function cardMatchesId(
  card: { id: string; instanceId?: string },
  searchId: string
): boolean {
  return card.id === searchId || card.instanceId === searchId;
}
