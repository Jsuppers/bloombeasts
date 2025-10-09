/**
 * Start Menu UI - Handles the visual presentation of the main menu
 */

import { SimpleMap } from '../../utils/polyfills';

export interface MenuOption {
  id: string;
  label: string;
  description?: string;
  enabled: boolean;
}

export class StartMenuUI {
  private menuOptions: MenuOption[];
  private selectedIndex: number = 0;
  private callbacks: SimpleMap<string, () => void> = new SimpleMap();

  constructor() {
    this.menuOptions = [
      {
        id: 'missions',
        label: '🎯 Missions',
        description: 'Challenge AI opponents and earn rewards',
        enabled: true,
      },
      {
        id: 'inventory',
        label: '📦 Inventory',
        description: 'View your cards and manage your collection',
        enabled: true,
      },
      {
        id: 'deck-builder',
        label: '🎴 Deck Builder',
        description: 'Create and customize your decks',
        enabled: true,
      },
      {
        id: 'quick-match',
        label: '⚔️ Quick Match',
        description: 'Jump into a random battle',
        enabled: true,
      },
      {
        id: 'settings',
        label: '⚙️ Settings',
        description: 'Configure game options',
        enabled: true,
      },
      {
        id: 'quit',
        label: '🚪 Quit',
        description: 'Exit the game',
        enabled: true,
      },
    ];
  }

  /**
   * Render the start menu UI
   */
  public async render(): Promise<void> {
    console.log('===========================================');
    console.log('       BLOOM BEASTS - Main Menu           ');
    console.log('===========================================');
    console.log('');

    this.menuOptions.forEach((option, index) => {
      const selector = index === this.selectedIndex ? '>' : ' ';
      const status = option.enabled ? '' : ' (Disabled)';
      console.log(`${selector} ${option.label}${status}`);
      if (option.description && index === this.selectedIndex) {
        console.log(`   ${option.description}`);
      }
    });

    console.log('');
    console.log('Use arrow keys to navigate, Enter to select');
    console.log('===========================================');
  }

  /**
   * Handle missions button click
   */
  public onMissionsClick(callback: () => void): void {
    this.callbacks.set('missions', callback);
  }

  /**
   * Handle inventory button click
   */
  public onInventoryClick(callback: () => void): void {
    this.callbacks.set('inventory', callback);
  }

  /**
   * Handle deck builder button click
   */
  public onDeckBuilderClick(callback: () => void): void {
    this.callbacks.set('deck-builder', callback);
  }

  /**
   * Handle quick match button click
   */
  public onQuickMatchClick(callback: () => void): void {
    this.callbacks.set('quick-match', callback);
  }

  /**
   * Handle settings button click
   */
  public onSettingsClick(callback: () => void): void {
    this.callbacks.set('settings', callback);
  }

  /**
   * Handle quit button click
   */
  public onQuitClick(callback: () => void): void {
    this.callbacks.set('quit', callback);
  }

  /**
   * Navigate menu selection up
   */
  public navigateUp(): void {
    this.selectedIndex = Math.max(0, this.selectedIndex - 1);
    this.render();
  }

  /**
   * Navigate menu selection down
   */
  public navigateDown(): void {
    this.selectedIndex = Math.min(this.menuOptions.length - 1, this.selectedIndex + 1);
    this.render();
  }

  /**
   * Select current menu option
   */
  public selectCurrentOption(): void {
    const currentOption = this.menuOptions[this.selectedIndex];
    if (currentOption.enabled) {
      const callback = this.callbacks.get(currentOption.id);
      if (callback) {
        callback();
      }
    }
  }
}