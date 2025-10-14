/**
 * Random Utilities
 *
 * Centralized random number generation and selection utilities.
 * Makes randomization consistent and easier to test.
 */

/**
 * Pick a random element from an array
 * @param array The array to pick from
 * @returns Random element from array, or undefined if empty
 */
export function pickRandom<T>(array: T[]): T | undefined {
  if (array.length === 0) {
    return undefined;
  }
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Pick multiple random elements from an array (without replacement)
 * @param array The array to pick from
 * @param count Number of elements to pick
 * @returns Array of random elements
 */
export function pickRandomMultiple<T>(array: T[], count: number): T[] {
  if (count <= 0 || array.length === 0) {
    return [];
  }

  const result: T[] = [];
  const available = [...array];

  const actualCount = Math.min(count, available.length);

  for (let i = 0; i < actualCount; i++) {
    const index = Math.floor(Math.random() * available.length);
    result.push(available[index]);
    available.splice(index, 1);
  }

  return result;
}

/**
 * Shuffle an array in place using Fisher-Yates algorithm
 * @param array The array to shuffle
 * @returns The same array, shuffled
 */
export function shuffle<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Get a random integer between min (inclusive) and max (inclusive)
 * @param min Minimum value
 * @param max Maximum value
 * @returns Random integer
 */
export function randomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Get a random number between min (inclusive) and max (exclusive)
 * @param min Minimum value
 * @param max Maximum value
 * @returns Random number
 */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/**
 * Roll a percentage chance (0-100)
 * @param chance Percentage chance (0-100)
 * @returns True if roll succeeded
 */
export function rollChance(chance: number): boolean {
  return Math.random() * 100 < chance;
}

/**
 * Roll a probability (0-1)
 * @param probability Probability (0-1)
 * @returns True if roll succeeded
 */
export function rollProbability(probability: number): boolean {
  return Math.random() < probability;
}

/**
 * Pick a weighted random element from an array
 * @param items Array of items
 * @param weights Array of weights (same length as items)
 * @returns Random element based on weights, or undefined if empty
 */
export function pickWeightedRandom<T>(items: T[], weights: number[]): T | undefined {
  if (items.length === 0 || items.length !== weights.length) {
    return undefined;
  }

  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return items[i];
    }
  }

  return items[items.length - 1];
}

/**
 * Generate a random ID string
 * @param prefix Optional prefix for the ID
 * @param length Length of random part (default: 8)
 * @returns Random ID string
 */
export function generateId(prefix: string = '', length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = prefix;
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

/**
 * Coin flip - returns true or false with 50/50 chance
 * @returns Random boolean
 */
export function coinFlip(): boolean {
  return Math.random() < 0.5;
}

/**
 * Roll a dice with specified number of sides
 * @param sides Number of sides on the dice
 * @returns Random number from 1 to sides (inclusive)
 */
export function rollDice(sides: number): number {
  return randomInt(1, sides);
}
