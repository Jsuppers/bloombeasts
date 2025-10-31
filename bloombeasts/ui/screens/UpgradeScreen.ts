/**
 * Upgrade Screen Component
 * Displays available upgrades for purchase
 */

import type { UIMethodMappings } from '../../../bloombeasts/BloomBeastsGame';
import { UINodeType } from './ScreenUtils';
import { createSideMenu } from './common/SideMenu';
import { createPopup } from '../common/Popup';
import { ALL_UPGRADES, type UpgradeDefinition } from '../../constants/upgrades';
import { BindingType } from '../types/BindingManager';

export interface UpgradeScreenProps {
  ui: UIMethodMappings;
  onNavigate?: (screen: string) => void;
  onUpgrade?: (boostId: string) => void;
  playSfx?: (sfxId: string) => void;
}

export class UpgradeScreen {
  private ui: UIMethodMappings;
  private onNavigate?: (screen: string) => void;
  private onUpgrade?: (boostId: string) => void;
  private playSfx?: (sfxId: string) => void;

  constructor(props: UpgradeScreenProps) {
    this.ui = props.ui;
    this.onNavigate = props.onNavigate;
    this.onUpgrade = props.onUpgrade;
    this.playSfx = props.playSfx;
  }

  /**
   * Create a single upgrade item
   */
  private createUpgradeItem(upgrade: UpgradeDefinition): UINodeType {
    const containerSize = 150;
    const imageSize = { width: 142, height: 120 };
    const imageOffset = { top: 4, left: 4 };
    const upgradeBoxSize = { width: 25, height: 26 };

    return this.ui.Pressable({
      onClick: () => {
        const currentState = this.ui.bindingManager.getSnapshot(BindingType.UIState);
        // Update UIState binding
        this.ui.bindingManager.setBinding(BindingType.UIState, {
          ...currentState,
          upgrade: {
            ...currentState.upgrade,
            selectedUpgradeId: upgrade.id
          }
        });
      },
      style: {
        width: containerSize,
        height: containerSize,
        position: 'relative',
      },
      children: [
        // Container background
        this.ui.Image({
          source: this.ui.assetIdToImageSource?.('upgrade-container-card') || null,
          style: {
            position: 'absolute',
            width: containerSize,
            height: containerSize,
            top: 0,
            left: 0,
            opacity: 1.0,
          },
        }),
        // Upgrade image overlay
        this.ui.Image({
          source: this.ui.assetIdToImageSource?.(upgrade.assetId) || null,
          style: {
            position: 'absolute',
            width: imageSize.width,
            height: imageSize.height,
            top: imageOffset.top,
            left: imageOffset.left,
          },
        }),
        // Upgrade level indicator (text at center bottom)
        this.ui.Text({
          text: this.ui.bindingManager.playerDataBinding.binding.derive((pd: any) => {
            const level = pd?.boosts?.[upgrade.id] || 0;
            return `Level ${level}`;
          }),
          style: {
            position: 'absolute',
            bottom: 8,
            left: 0,
            width: containerSize,
            fontSize: 14,
            fontWeight: 'bold',
            color: '#fff',
            textAlign: 'center',
          },
        }),
      ],
    });
  }

  /**
   * Create the upgrade grid
   */
  private createUpgradeGrid(): UINodeType {
    return this.ui.View({
      style: {
        position: 'absolute',
        left: 70,
        top: 70,
        width: 920,
        height: 580,
      },
      children: [
        this.ui.View({
          style: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 40,
          },
          children: ALL_UPGRADES.map((upgrade) =>
            this.createUpgradeItem(upgrade)
          ),
        }),
      ],
    });
  }

  createUI(): UINodeType {
    return this.ui.View({
      style: {
        width: '100%',
        height: '100%',
        position: 'relative',
      },
      children: [
        // Background
        this.ui.Image({
          source: this.ui.assetIdToImageSource?.('background') || null,
          style: {
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
          },
        }),
        // Cards Container image as background
        this.ui.Image({
          source: this.ui.assetIdToImageSource?.('cards-container') || null,
          style: {
            position: 'absolute',
            left: 40,
            top: 40,
            width: 980,
            height: 640,
          },
        }),
        // Upgrade grid
        this.createUpgradeGrid(),
        // Sidebar with common side menu
        createSideMenu(this.ui, {
          title: 'Upgrades',
          customTextContent: [],
          buttons: [],
          bottomButton: {
            label: 'Back',
            onClick: () => {
              if (this.onNavigate) this.onNavigate('menu');
            },
            disabled: false,
          },
          playSfx: this.playSfx,
        }),
        // Upgrade popup (conditionally rendered) - derive from UIState
        ...(this.ui.UINode ? [this.ui.UINode.if(
          this.ui.bindingManager.derive([BindingType.UIState], (state: any) => {
            const shouldShow = (state.upgrade?.selectedUpgradeId ?? null) !== null;
            return shouldShow;
          }),
          this.createUpgradePopup()
        )] : []),
      ],
    });
  }

  /**
   * Create the upgrade popup
   */
  private createUpgradePopup(): UINodeType {

    return createPopup({
      ui: this.ui,
      title: 'Upgrade',
      description: this.ui.bindingManager.derive([BindingType.PlayerData, BindingType.UIState], (pd: any, state: any) => {
        const upgradeId = state.upgrade?.selectedUpgradeId ?? null;
        const upgrade = ALL_UPGRADES.find(u => u.id === upgradeId);
        if (!upgrade) return '';
        const currentLevel = pd?.boosts?.[upgradeId] || 0;
        const coins = pd?.coins ?? 0;

        if (currentLevel >= 6) {
          return `${upgrade.name}\n${upgrade.description}\n\nLevel: ${currentLevel}/6 (MAX)\nYour coins: ${coins}`;
        }

        const nextLevelCost = upgrade.costs[currentLevel];
        return `${upgrade.name}\n${upgrade.description}\n\nLevel: ${currentLevel}/6\nNext upgrade cost: ${nextLevelCost} coins\nYour coins: ${coins}`;
      }),
      buttons: [
        {
          label: 'Upgrade',
          onClick: () => {
            const currentState = this.ui.bindingManager.getSnapshot(BindingType.UIState);
            const upgradeId = currentState.upgrade?.selectedUpgradeId ?? null;
            if (!upgradeId) return;
            if (this.onUpgrade) {
              this.onUpgrade(upgradeId);
            }
            // Update UIState binding
            this.ui.bindingManager.setBinding(BindingType.UIState, {
              ...currentState,
              upgrade: {
                ...currentState.upgrade,
                selectedUpgradeId: null
              }
            });
          },
          color: 'green',
          disabled: this.ui.bindingManager.derive([BindingType.PlayerData, BindingType.UIState], (pd: any, state: any) => {
            const upgradeId = state.upgrade?.selectedUpgradeId ?? null;
            if (!upgradeId) {
              return true;
            }
            const upgrade = ALL_UPGRADES.find(u => u.id === upgradeId);
            if (!upgrade) {
              return true;
            }
            const currentLevel = pd?.boosts?.[upgradeId] || 0;
            if (currentLevel >= 6) {
              return true;
            }

            const nextLevelCost = upgrade.costs[currentLevel];
            const coins = pd?.coins ?? 0;
            const isDisabled = coins < nextLevelCost;
            return isDisabled;
          }),
        },
        {
          label: 'Close',
          onClick: () => {
            const currentState = this.ui.bindingManager.getSnapshot(BindingType.UIState);
            // Update UIState binding
            this.ui.bindingManager.setBinding(BindingType.UIState, {
              ...currentState,
              upgrade: {
                ...currentState.upgrade,
                selectedUpgradeId: null
              }
            });
          },
          color: 'default',
        },
      ],
      playSfx: this.playSfx,
    });
  }

  dispose(): void {
    // Nothing to clean up
  }
}
