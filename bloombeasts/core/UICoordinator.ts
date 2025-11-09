/**
 * UICoordinator - Manages UI bindings and screen navigation
 * Extracted from BloomBeastsGame to separate concerns
 */

import { BindingManager, BindingType } from '../common/ui/types/types/BindingManager';
import type { MissionDisplay, PlayerData, UINode } from '../types';
import type { IMissionSelectionUI, MissionDisplayData } from './interfaces/IMissionSelectionUI';

/**
 * Coordinates UI updates and screen transitions
 */
export class UICoordinator {
  private bindingManager: BindingManager;
  private onRender: () => void;
  private uiTree: UINode | null = null;

  constructor(bindingManager: BindingManager, onRender: () => void) {
    this.bindingManager = bindingManager;
    this.onRender = onRender;
  }

  /**
   * Set UI tree reference
   */
  setUITree(uiTree: UINode): void {
    this.uiTree = uiTree;
  }

  /**
   * Update binding and trigger render (common pattern)
   */
  updateBindingAndRender<T>(type: BindingType, value: T): void {
    this.bindingManager.setBinding(type, value);
    this.triggerRender();
  }

  /**
   * Trigger a render
   */
  triggerRender(): void {
    this.onRender();
  }

  /**
   * Navigate to a different screen
   */
  navigate(screen: string, onLeaderboardNavigate?: () => void): void {
    this.bindingManager.setBinding(BindingType.CurrentScreen, screen);

    // Load leaderboard data when navigating to leaderboard screen
    if (screen === 'leaderboard' && onLeaderboardNavigate) {
      onLeaderboardNavigate();
    }

    this.triggerRender();
  }

  /**
   * Update bindings from current game state
   */
  updateBindingsFromGameState(
    playerData: PlayerData,
    missionUI: IMissionSelectionUI,
    playerLevel: number
  ): void {
    // Update player data binding (screens derive what they need from this)
    this.bindingManager.setBinding(BindingType.PlayerData, playerData);

    // Update missions binding (still separate as it includes availability logic)
    missionUI.setPlayerLevel(playerLevel);
    const missionList = missionUI.getMissionList();
    const displayMissions: MissionDisplay[] = missionList.map(m => ({
      id: m.mission.id,
      name: m.mission.name,
      level: m.mission.level,
      difficulty: m.mission.difficulty,
      isAvailable: m.isAvailable,
      isCompleted: m.completionCount > 0,
      description: m.mission.description,
      affinity: m.mission.affinity,
      beastId: m.mission.beastId,
    }));

    this.bindingManager.setBinding(BindingType.Missions, displayMissions);
  }

  /**
   * Show forfeit confirmation popup
   */
  showForfeitConfirmation(onConfirm: () => void, playSfx: (sfxId: string) => void): void {
    this.bindingManager.setBinding(BindingType.ForfeitPopup, {
      title: 'Are you sure?',
      message: 'You will lose this battle.',
      buttons: [
        {
          text: 'Yes',
          onClick: onConfirm,
          color: 'red',
        },
        {
          text: 'No',
          onClick: () => {
            this.bindingManager.setBinding(BindingType.ForfeitPopup, null);
            this.triggerRender();
          },
          color: 'default',
        },
      ],
      playSfx,
    });
    this.triggerRender();
  }

  /**
   * Show card detail popup
   */
  showCardDetailPopup(
    card: any,
    durationMs: number,
    playSfx: (sfxId: string) => void,
    setTimeout: (callback: () => void, delay: number) => void,
    callback?: () => void
  ): void {
    // Set the card detail popup
    this.bindingManager.setBinding(BindingType.CardDetailPopup, {
      cardDetail: {
        card: card,
        stats: null,
      },
      onButtonClick: () => {
        // Close button clicked
        this.bindingManager.setBinding(BindingType.CardDetailPopup, null);
        this.triggerRender();
      },
      playSfx,
      hideBackdrop: true, // Hide backdrop for played card popups
    });
    this.triggerRender();

    // After duration, close the popup and execute callback
    setTimeout(() => {
      this.bindingManager.setBinding(BindingType.CardDetailPopup, null);
      this.triggerRender();
      callback?.();
    }, durationMs);
  }

  /**
   * Show mission complete popup
   */
  showMissionCompletePopup(
    mission: any,
    rewards: any,
    playSfx: (sfxId: string) => void,
    onContinue: () => void
  ): void {
    const popupData = {
      mission,
      rewards,
      chestOpened: false,
      onClaimRewards: () => {
        const current = this.bindingManager.getSnapshot(BindingType.MissionCompletePopup);
        if (current) {
          const updatedData = {
            ...current,
            chestOpened: true
          };
          this.bindingManager.setBinding(BindingType.MissionCompletePopup, updatedData);
          this.triggerRender();
        }
      },
      onContinue,
      playSfx
    };

    this.bindingManager.setBinding(BindingType.MissionCompletePopup, popupData);
    this.triggerRender();
  }

  /**
   * Show mission failed popup
   */
  showMissionFailedPopup(
    mission: any,
    playSfx: (sfxId: string) => void,
    onContinue: () => void
  ): void {
    const failedPopupProps = {
      mission,
      rewards: null, // null indicates failure
      chestOpened: false,
      onContinue,
      playSfx
    };

    this.bindingManager.setBinding(BindingType.MissionCompletePopup, failedPopupProps);
    this.triggerRender();
  }

  /**
   * Clear battle display
   */
  clearBattleDisplay(): void {
    this.bindingManager.setBinding(BindingType.BattleDisplay, null);
  }

  /**
   * Close popup and navigate
   */
  closePopupAndNavigate(screen: string): void {
    this.bindingManager.setBinding(BindingType.BattleDisplay, null);
    this.bindingManager.setBinding(BindingType.MissionCompletePopup, null);
    this.navigate(screen);
  }
}
