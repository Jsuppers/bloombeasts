/**
 * Inventory Filters - Manage filtering options for the card collection
 */

import { SimpleMap } from '../../utils/polyfills';

export type FilterType = 'affinity' | 'minLevel' | 'maxLevel' | 'hasAbility' | 'search';

export interface Filter {
  type: FilterType;
  value: any;
  active: boolean;
}

export class InventoryFilters {
  private filters: SimpleMap<FilterType, Filter> = new SimpleMap();

  constructor() {
    this.initializeFilters();
  }

  /**
   * Initialize default filters
   */
  private initializeFilters(): void {
    this.filters.set('affinity', {
      type: 'affinity',
      value: 'all',
      active: false,
    });

    this.filters.set('minLevel', {
      type: 'minLevel',
      value: 1,
      active: false,
    });

    this.filters.set('maxLevel', {
      type: 'maxLevel',
      value: 9,
      active: false,
    });

    this.filters.set('hasAbility', {
      type: 'hasAbility',
      value: '',
      active: false,
    });

    this.filters.set('search', {
      type: 'search',
      value: '',
      active: false,
    });
  }

  /**
   * Update a filter value
   */
  public updateFilter(type: FilterType, value: any): void {
    const filter = this.filters.get(type);
    if (filter) {
      filter.value = value;
      filter.active = value !== null && value !== '' && value !== 'all';
    }
  }

  /**
   * Get a specific filter value
   */
  public getFilter(type: FilterType): any {
    const filter = this.filters.get(type);
    return filter?.active ? filter.value : null;
  }

  /**
   * Get all active filters
   */
  public getActiveFilters(): Filter[] {
    return Array.from(this.filters.values()).filter(f => f.active);
  }

  /**
   * Clear all filters
   */
  public clearAll(): void {
    this.initializeFilters();
  }

  /**
   * Clear a specific filter
   */
  public clearFilter(type: FilterType): void {
    const filter = this.filters.get(type);
    if (filter) {
      switch (type) {
        case 'affinity':
          filter.value = 'all';
          break;
        case 'minLevel':
          filter.value = 1;
          break;
        case 'maxLevel':
          filter.value = 9;
          break;
        default:
          filter.value = '';
      }
      filter.active = false;
    }
  }

  /**
   * Get filter presets
   */
  public static getPresets(): Record<string, Partial<Record<FilterType, any>>> {
    return {
      'high-level': {
        minLevel: 7,
      },
      'fire-cards': {
        affinity: 'Fire',
      },
      'forest-cards': {
        affinity: 'Forest',
      },
      'water-cards': {
        affinity: 'Water',
      },
      'sky-cards': {
        affinity: 'Sky',
      },
      'low-level': {
        maxLevel: 3,
      },
    };
  }

  /**
   * Apply a preset
   */
  public applyPreset(presetName: string): void {
    const presets = InventoryFilters.getPresets();
    const preset = presets[presetName];

    if (preset) {
      this.clearAll();
      for (const [type, value] of Object.entries(preset)) {
        this.updateFilter(type as FilterType, value);
      }
    }
  }
}