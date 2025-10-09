/**
 * Start Menu - Main entry point for Bloom Beasts game
 */

import { StartMenuUI } from './StartMenuUI';
import { MenuController } from './MenuController';

export class StartMenu {
  private ui: StartMenuUI;
  private controller: MenuController;

  constructor() {
    this.ui = new StartMenuUI();
    this.controller = new MenuController();
  }

  /**
   * Initialize and display the start menu
   */
  public async initialize(): Promise<void> {
    await this.ui.render();
    this.setupEventHandlers();
  }

  /**
   * Setup event handlers for menu interactions
   */
  private setupEventHandlers(): void {
    this.ui.onMissionsClick(() => {
      this.controller.startGame();
    });

    this.ui.onInventoryClick(() => {
      this.controller.openInventory();
    });

    this.ui.onSettingsClick(() => {
      this.controller.openSettings();
    });

    this.ui.onQuitClick(() => {
      this.controller.quitGame();
    });
  }
}

export { StartMenuUI } from './StartMenuUI';
export { MenuController } from './MenuController';