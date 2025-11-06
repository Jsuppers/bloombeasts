/**
 * Minimal card instance in player's collection
 * All other data (level, stats, etc.) is computed on-demand from currentXP and card definition
 */
export interface CardInstance {
  id: string;                    // Unique instance ID (e.g., "forest-beast-1-1")
  cardId: string;                 // Base card ID (e.g., "forest-beast")
  currentXP: number;              // Only persistent data - everything else is derived
}