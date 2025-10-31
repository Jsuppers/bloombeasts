/**
 * Unified Mission Complete Popup Component
 * Works on both Horizon and Web platforms
 * Exactly mimics the UI from bloombeasts/screens/missions/MissionCompletePopup.ts
 */

import { DIMENSIONS } from '../../styles/dimensions';
import { COLORS } from '../../styles/colors';
import {
  missionCompleteCardDimensions,
  chestImageMissionCompleteDimensions,
} from '../../constants/dimensions';
import { UINodeType } from '../ScreenUtils';
import type { UIMethodMappings } from '../../../../bloombeasts/BloomBeastsGame';
import { createPopup, type PopupButton } from '../../common/Popup';
import { BindingType } from '../../types/BindingManager';
import type { BindingManager } from '../../types/BindingManager';

export interface MissionCompletePopupProps {
  mission: {
    id: string;
    name: string;
    affinity?: 'Forest' | 'Water' | 'Fire' | 'Sky' | 'Boss';
  };
  rewards: {
    xpGained: number;
    beastXP: number;
    coinsReceived?: number;
    completionTimeSeconds: number;
    cardsReceived: any[];
    itemsReceived: Array<{
      itemId: string;
      quantity: number;
      emoji?: string;
      name?: string;
    }>;
    bonusRewards?: string[];
  } | null; // null for mission failed
  chestOpened: boolean;
  onClaimRewards?: () => void;
  onContinue?: () => void;
  playSfx?: (sfxId: string) => void;
}

/**
 * Unified Mission Complete Popup using common Popup component
 * Derives content from MissionCompletePopup binding
 */
export function createMissionCompletePopup(ui: UIMethodMappings, bindingManager: any): UINodeType {
  // Get the playSfx function from current binding state
  const currentProps = bindingManager.getSnapshot(BindingType.MissionCompletePopup);
  const playSfx = currentProps?.playSfx;

  // Derive chest image source
  const chestImageSource = bindingManager.derive([BindingType.MissionCompletePopup], (props: any) => {
    if (!props) return null;
    if (!props.rewards) {
      return ui.assetIdToImageSource?.('lose-image') || null;
    }
    const affinity = props.mission.affinity === 'Boss' ? 'Fire' : (props.mission.affinity || 'Forest');
    const state = props.chestOpened ? 'opened' : 'closed';
    return ui.assetIdToImageSource?.(`${affinity}-chest-${state}`.toLowerCase()) || null;
  });

  // Derive info text
  const infoText = bindingManager.derive([BindingType.MissionCompletePopup], (props: any) => {
    if (!props) return '';
    if (!props.rewards) {
      return 'Better luck next time!\n\nKeep training your beasts\nand try again.';
    }
    if (props.chestOpened) {
      // Show detailed rewards
      const lines: string[] = [];
      if (props.rewards.coinsReceived) {
        lines.push(`🪙 ${props.rewards.coinsReceived} Coins`);
      }
      if (props.rewards.bonusRewards && props.rewards.bonusRewards.length > 0) {
        lines.push(...props.rewards.bonusRewards);
      }
      if (props.rewards.cardsReceived && props.rewards.cardsReceived.length > 0) {
        lines.push('', 'Cards Received:');
        props.rewards.cardsReceived.forEach((card: any) => {
          lines.push(`• ${card.name}`);
        });
      }
      return lines.join('\n');
    } else {
      // Show basic info
      const minutes = Math.floor(props.rewards.completionTimeSeconds / 60);
      const seconds = props.rewards.completionTimeSeconds % 60;
      const timeString = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
      const lines = [
        `Time: ${timeString}`,
        '',
        `Player XP: +${props.rewards.xpGained}`,
        `Beast XP: +${props.rewards.beastXP}`
      ];
      if (props.rewards.coinsReceived) {
        lines.push(`Coins: +${props.rewards.coinsReceived}`);
      }
      return lines.join('\n');
    }
  });

  // Create content
  const content: UINodeType[] = [
    // Chest or lose image
    ui.View({
      style: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
      },
      children: ui.Image({
        source: chestImageSource as any,
        style: {
          width: chestImageMissionCompleteDimensions.width,
          height: chestImageMissionCompleteDimensions.height,
        },
      }),
    }),

    // Info text
    ui.View({
      style: {
        width: '100%',
        paddingLeft: 20,
        paddingRight: 20,
      },
      children: ui.Text({
        text: infoText as any,
        numberOfLines: 15,
        style: {
          fontSize: DIMENSIONS.fontSize.md,
          color: COLORS.textPrimary,
          textAlign: 'center',
          lineHeight: 20,
        },
      }),
    }),
  ];

  // Create button with derived label
  const popupButton: PopupButton = {
    label: bindingManager.derive([BindingType.MissionCompletePopup], (props: any) => {
      if (!props) return 'CONTINUE';
      if (!props.rewards || props.chestOpened) return 'CONTINUE';
      return 'CLAIM REWARDS';
    }) as any,
    onClick: () => {
      const props = bindingManager.getSnapshot(BindingType.MissionCompletePopup);
      if (!props) return;

      if (!props.rewards || props.chestOpened) {
        console.log('[MissionCompletePopup] Calling onContinue');
        props.onContinue?.();
      } else {
        console.log('[MissionCompletePopup] Calling onClaimRewards');
        props.onClaimRewards?.();
      }
    },
    type: 'long',
    color: 'green',
  };

  return createPopup({
    ui,
    title: bindingManager.derive([BindingType.MissionCompletePopup], (props: any) => {
      return props?.rewards === null ? 'MISSION FAILED' : 'MISSION COMPLETE!';
    }) as any,
    titleColor: bindingManager.derive([BindingType.MissionCompletePopup], (props: any) => {
      return props?.rewards === null ? '#FF4444' : '#FFD700';
    }) as any,
    content,
    buttons: [popupButton],
    playSfx, // Direct function reference, not a binding
    width: missionCompleteCardDimensions.width,
    height: missionCompleteCardDimensions.height,
  });
}

/**
 * Create failed mission info text
 */
function createFailedInfo(ui: UIMethodMappings): UINodeType {
  return ui.View({
    style: {
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    },
    children: [
      ui.Text({
        text: 'Better luck next time!\n\nKeep training your beasts\nand try again.',
        style: {
          fontSize: DIMENSIONS.fontSize.md,
          lineHeight: 20,
          color: COLORS.textPrimary,
          textAlign: 'center',
        },
      }),
    ],
  });
}

/**
 * Create basic info (before chest opened)
 */
function createBasicInfo(ui: UIMethodMappings, rewards: any): UINodeType {
  const minutes = Math.floor(rewards.completionTimeSeconds / 60);
  const seconds = rewards.completionTimeSeconds % 60;
  const timeString = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  const lines = [`Time: ${timeString}`, '', `Player XP: +${rewards.xpGained}`, `Beast XP: +${rewards.beastXP}`];

  // Add coins if present
  if (rewards.coinsReceived) {
    lines.push(`Coins: +${rewards.coinsReceived}`);
  }

  // Add bonus rewards if present
  if (rewards.bonusRewards && rewards.bonusRewards.length > 0) {
    lines.push('');
    rewards.bonusRewards.forEach((bonus: string) => {
      lines.push(bonus);
    });
  }

  return ui.View({
    style: {
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    },
    children: lines.map((line, index) =>
      ui.Text({
        text: line,
        style: {
          fontSize: DIMENSIONS.fontSize.md,
          color: line.includes('Boost:') ? '#FFD700' : COLORS.textPrimary,
          textAlign: 'center',
          marginBottom: 5,
        },
      })
    ),
  });
}

/**
 * Create detailed rewards (after chest opened)
 */
function createDetailedRewards(ui: UIMethodMappings, rewards: any): UINodeType {
  const elements: UINodeType[] = [];

  // Coins received
  if (rewards.coinsReceived) {
    elements.push(
      ui.Text({
        text: `🪙 ${rewards.coinsReceived} Coins`,
        style: {
          fontSize: DIMENSIONS.fontSize.md,
          color: '#FFD700',
          textAlign: 'center',
          marginBottom: 10,
          fontWeight: 'bold',
        },
      })
    );
  }

  // Bonus rewards (boosts)
  if (rewards.bonusRewards && rewards.bonusRewards.length > 0) {
    rewards.bonusRewards.forEach((bonus: string) => {
      elements.push(
        ui.Text({
          text: bonus,
          style: {
            fontSize: DIMENSIONS.fontSize.sm,
            color: '#FFD700',
            textAlign: 'center',
            marginBottom: 5,
          },
        })
      );
    });
    elements.push(
      ui.View({
        style: { height: 10 },
      })
    );
  }

  // Cards received
  if (rewards.cardsReceived && rewards.cardsReceived.length > 0) {
    elements.push(
      ui.Text({
        text: 'Cards Received:',
        style: {
          fontSize: DIMENSIONS.fontSize.md,
          color: '#FFD700',
          textAlign: 'center',
          marginBottom: 5,
          fontWeight: 'bold',
        },
      })
    );

    rewards.cardsReceived.forEach((card: any, index: number) => {
      elements.push(
        ui.Text({
          text: `• ${card.name}`,
          style: {
            fontSize: DIMENSIONS.fontSize.sm,
            color: COLORS.textPrimary,
            textAlign: 'center',
            marginBottom: 5,
          },
        })
      );
    });

    // Extra spacing
    elements.push(
      ui.View({
        style: { height: 10 },
      })
    );
  }

  // Items received
  if (rewards.itemsReceived && rewards.itemsReceived.length > 0) {
    elements.push(
      ui.Text({
        text: 'Items Received:',
        style: {
          fontSize: DIMENSIONS.fontSize.md,
          color: '#FFD700',
          textAlign: 'center',
          marginBottom: 5,
          fontWeight: 'bold',
        },
      })
    );

    rewards.itemsReceived.forEach((itemReward: any, index: number) => {
      const emoji = itemReward.emoji || '';
      const itemName = itemReward.name || itemReward.itemId;
      elements.push(
        ui.Text({
          text: `${emoji} ${itemName} x${itemReward.quantity}`,
          style: {
            fontSize: DIMENSIONS.fontSize.sm,
            color: COLORS.textPrimary,
            textAlign: 'center',
            marginBottom: 5,
          },
        })
      );
    });

    // Extra spacing
    elements.push(
      ui.View({
        style: { height: 10 },
      })
    );
  }

  return ui.View({
    style: {
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    },
    children: elements,
  });
}
