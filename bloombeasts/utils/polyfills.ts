/**
 * Polyfills and type definitions for ES2020 compatibility
 * This file provides alternatives to Map, Promise, and Array methods
 */

/**
 * Simple Map alternative using object storage
 */
export class SimpleMap<K extends string | number, V> {
  private storage: Record<string, V> = {};
  private keyList: K[] = [];

  constructor(entries?: Array<[K, V]>) {
    if (entries) {
      entries.forEach(([key, value]) => {
        this.set(key, value);
      });
    }
  }

  set(key: K, value: V): this {
    const keyStr = String(key);
    if (!(keyStr in this.storage)) {
      this.keyList.push(key);
    }
    this.storage[keyStr] = value;
    return this;
  }

  get(key: K): V | undefined {
    return this.storage[String(key)];
  }

  has(key: K): boolean {
    return String(key) in this.storage;
  }

  delete(key: K): boolean {
    const keyStr = String(key);
    if (keyStr in this.storage) {
      delete this.storage[keyStr];
      const index = this.keyList.indexOf(key);
      if (index > -1) {
        this.keyList.splice(index, 1);
      }
      return true;
    }
    return false;
  }

  clear(): void {
    this.storage = {};
    this.keyList = [];
  }

  get size(): number {
    return this.keyList.length;
  }

  keys(): K[] {
    return [...this.keyList];
  }

  values(): V[] {
    return this.keyList.map(key => this.storage[String(key)]);
  }

  entries(): Array<[K, V]> {
    return this.keyList.map(key => [key, this.storage[String(key)]]);
  }

  forEach(callback: (value: V, key: K, map: SimpleMap<K, V>) => void): void {
    this.keyList.forEach(key => {
      callback(this.storage[String(key)], key, this);
    });
  }
}

/**
 * Array.from polyfill
 */
export function arrayFrom<T>(iterable: ArrayLike<T> | Iterable<T>): T[] {
  const result: T[] = [];
  if ('length' in iterable) {
    // ArrayLike
    for (let i = 0; i < iterable.length; i++) {
      result.push(iterable[i]);
    }
  } else if (Symbol.iterator in iterable) {
    // Iterable - manual iteration to avoid downlevelIteration requirement
    const iterator = (iterable as Iterable<T>)[Symbol.iterator]();
    let iterResult = iterator.next();
    while (!iterResult.done) {
      result.push(iterResult.value);
      iterResult = iterator.next();
    }
  }
  return result;
}

/**
 * Array.find polyfill
 */
export function arrayFind<T>(
  array: T[],
  predicate: (value: T, index: number, array: T[]) => boolean
): T | undefined {
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i], i, array)) {
      return array[i];
    }
  }
  return undefined;
}

// Export as global Map replacement if needed
export type MapPolyfill<K extends string | number, V> = SimpleMap<K, V>;