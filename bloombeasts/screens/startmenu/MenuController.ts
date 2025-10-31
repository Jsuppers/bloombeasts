/**
 * Menu Controller - Handles menu navigation and actions
 */

export interface GameMode {
  type: 'single-player' | 'multiplayer' | 'tutorial';
  difficulty?: 'easy' | 'normal' | 'hard';
}

export class MenuController {
  private currentState: 'menu' | 'game' | 'inventory' | 'settings' = 'menu';

  constructor() {
  }

  /**
   * Start a new game
   */
  public async startGame(mode: GameMode = { type: 'single-player', difficulty: 'normal' }): Promise<void> {
    this.currentState = 'game';

    // Note: Game engine integration point for future menu-initiated games
    // Currently, missions are started through MissionManager -> MissionBattleUI
    // Future: Add direct game mode support (quick play, practice matches, etc.)
    // const gameEngine = new GameEngine();
    // await gameEngine.initialize();
    // await gameEngine.startMatch(mode);

  }

  /**
   * Open the inventory screen
   */
  public async openInventory(): Promise<void> {
    this.currentState = 'inventory';

    // Note: Inventory integration point - Cards system exists (screens/cards/)
    // Future: Connect MenuController to Cards.initialize() for full inventory view
    // const inventory = new InventoryView();
    // await inventory.display();

  }

  /**
   * Open the settings menu
   */
  public async openSettings(): Promise<void> {
    this.currentState = 'settings';

    // Note: Settings menu integration point
    // Future: Implement SettingsMenu for audio, graphics, controls configuration
    // const settings = new SettingsMenu();
    // await settings.display();

  }

  /**
   * Quit the game
   */
  public quitGame(): void {

    // Note: Save system integration point
    // Future: Implement SaveManager to persist game state before exit
    // await this.saveGameState();
    // process.exit(0);
  }

  /**
   * Return to main menu
   */
  public returnToMenu(): void {
    this.currentState = 'menu';
  }

  /**
   * Get current state
   */
  public getCurrentState(): string {
    return this.currentState;
  }

  /**
   * Load saved game
   */
  public async loadSavedGame(): Promise<boolean> {

    // Note: Save game loading integration point
    // Future: Implement SaveManager.load() to restore player progress
    // const saveData = await SaveManager.load();
    // if (saveData) {
    //   await this.startGame(saveData.mode);
    //   return true;
    // }

    return false;
  }
}