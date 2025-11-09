/**
 * Upgrade Screen - Refactored using BaseScreen
 *
 * Reduced by eliminating constructor boilerplate and layout duplication
 */

import { COLORS } from '../../common/ui/styles/styles/colors';
import { UINodeType } from '../../common/ui/ScreenUtils';
import { createSideMenu } from '../../common/ui/screens/SideMenu';
import { createPopup } from '../../common/ui/components/common/Popup';
import { ALL_UPGRADES, type UpgradeDefinition } from '../../common/constants/upgrades';
import { BindingType } from '../../common/ui/types/types/BindingManager';
import { BaseScreen, BaseScreenProps } from '../common/BaseScreen';
import { UIStateManager } from '../common/UIStateManager';
import type { PlayerData } from '../../BloomBeastsGame';

// UI constants
const UPGRADE_CONTAINER_SIZE = 150;
const UPGRADE_IMAGE_WIDTH = 142;
const UPGRADE_IMAGE_HEIGHT = 120;
const UPGRADE_IMAGE_OFFSET_TOP = 4;
const UPGRADE_IMAGE_OFFSET_LEFT = 4;
const UPGRADE_LEVEL_BOTTOM = 8;
const UPGRADE_LEVEL_FONT_SIZE = 14;
const UPGRADE_GRID_GAP = 40;

export interface UpgradeScreenProps extends BaseScreenProps {
  onUpgrade?: (boostId: string) => void;
}

interface UpgradeState {
  selectedUpgradeId?: string | null;
}

export class UpgradeScreen extends BaseScreen {
  private onUpgrade?: (boostId: string) => void;
  private stateManager: UIStateManager<UpgradeState>;

  constructor(props: UpgradeScreenProps) {
    super(props);
    this.onUpgrade = props.onUpgrade;
    this.stateManager = new UIStateManager<UpgradeState>(
      this.ui.bindingManager,
      'upgrade',
      this.onRenderNeeded
    );
  }

  private createUpgradeItem(upgrade: UpgradeDefinition): UINodeType {
    return this.ui.Pressable({
      onClick: () => {
        this.stateManager.update({ selectedUpgradeId: upgrade.id });
      },
      style: {
        width: UPGRADE_CONTAINER_SIZE,
        height: UPGRADE_CONTAINER_SIZE,
        position: 'relative',
      },
      children: [
        this.ui.Image({
          source: this.ui.assetIdToImageSource?.('upgrade-container-card') || null,
          style: {
            position: 'absolute',
            width: UPGRADE_CONTAINER_SIZE,
            height: UPGRADE_CONTAINER_SIZE,
            top: 0,
            left: 0,
            opacity: 1.0,
          },
        }),
        this.ui.Image({
          source: this.ui.assetIdToImageSource?.(upgrade.assetId) || null,
          style: {
            position: 'absolute',
            width: UPGRADE_IMAGE_WIDTH,
            height: UPGRADE_IMAGE_HEIGHT,
            top: UPGRADE_IMAGE_OFFSET_TOP,
            left: UPGRADE_IMAGE_OFFSET_LEFT,
          },
        }),
        this.ui.Text({
          text: this.ui.bindingManager.playerDataBinding.binding.derive((pd: PlayerData) => {
            const level = pd?.boosts?.[upgrade.id] || 0;
            return `Level ${level}`;
          }),
          style: {
            position: 'absolute',
            bottom: UPGRADE_LEVEL_BOTTOM,
            left: 0,
            width: UPGRADE_CONTAINER_SIZE,
            fontSize: UPGRADE_LEVEL_FONT_SIZE,
            fontWeight: 'bold',
            color: COLORS.textPrimary,
            textAlign: 'center',
          },
        }),
      ],
    });
  }

  private createUpgradeGrid(): UINodeType {
    return this.createContentArea([
      this.ui.View({
        style: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: UPGRADE_GRID_GAP,
        },
        children: ALL_UPGRADES.map((upgrade) => this.createUpgradeItem(upgrade)),
      }),
    ]);
  }

  createUI(): UINodeType {
    return this.createRootContainer([
      this.createFullScreenBackground(),
      this.createContainerBackground(),
      this.createUpgradeGrid(),

      createSideMenu(this.ui, {
        title: 'Upgrades',
        bottomButton: this.getBackButton(),
        playSfx: this.playSfx,
      }),

      // Upgrade popup
      ...(this.ui.UINode ? [this.ui.UINode.if(
        this.ui.bindingManager.derive([BindingType.UIState], () => {
          return this.stateManager.getValue('selectedUpgradeId') !== null;
        }),
        createPopup({
          ui: this.ui,
          title: this.ui.bindingManager.derive([BindingType.UIState], () => {
            const upgradeId = this.stateManager.getValue('selectedUpgradeId');
            const upgrade = ALL_UPGRADES.find(u => u.id === upgradeId);
            return upgrade?.name || '';
          }),
          description: this.ui.bindingManager.derive([BindingType.UIState, BindingType.PlayerData], (uiState, pd: PlayerData) => {
            const upgradeId = this.stateManager.getValue('selectedUpgradeId');
            const upgrade = ALL_UPGRADES.find(u => u.id === upgradeId);
            if (!upgrade) return '';
            const currentLevel = pd?.boosts?.[upgrade.id] || 0;
            const cost = upgrade.costs[currentLevel] || 0;
            return `${upgrade.description}\n\nCurrent Level: ${currentLevel}\nCost: ${cost} coins`;
          }),
          buttons: [
            {
              label: 'Upgrade',
              onClick: () => {
                const upgradeId = this.stateManager.getValue('selectedUpgradeId');
                if (upgradeId && this.onUpgrade) {
                  this.onUpgrade(upgradeId);
                }
                this.stateManager.update({ selectedUpgradeId: null });
              },
              color: 'green',
            },
            {
              label: 'Cancel',
              onClick: () => {
                this.stateManager.update({ selectedUpgradeId: null });
              },
              color: 'default',
            },
          ],
          playSfx: this.playSfx,
        })
      )] : []),
    ]);
  }
}
