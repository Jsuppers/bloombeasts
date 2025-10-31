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

export interface MissionCompletePopupProps {
  mission: {
    id: string;
    name: string;
    affinity?: 'Forest' | 'Water' | 'Fire' | 'Sky';
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
 */
export function createMissionCompletePopup(ui: UIMethodMappings, props: MissionCompletePopupProps): UINodeType {
  const { mission, rewards, chestOpened, onClaimRewards, onContinue, playSfx } = props;
  const isFailed = !rewards;

  // Create content for the popup
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
      children: isFailed
        ? ui.Image({
            source: ui.assetIdToImageSource?.('lose-image') || null,
            style: {
              width: chestImageMissionCompleteDimensions.width,
              height: chestImageMissionCompleteDimensions.height,
            },
          })
        : ui.Image({
            source: ui.assetIdToImageSource?.(
              chestOpened
                ? `${mission.affinity || 'Forest'}-chest-opened`.toLowerCase()
                : `${mission.affinity || 'Forest'}-chest-closed`.toLowerCase()
            ) || null,
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
      children: isFailed
        ? createFailedInfo(ui)
        : chestOpened
        ? createDetailedRewards(ui, rewards)
        : createBasicInfo(ui, rewards),
    }),
  ];

  // Create button
  const popupButton: PopupButton = {
    label: isFailed ? 'CONTINUE' : chestOpened ? 'CONTINUE' : 'CLAIM REWARDS',
    onClick: () => {
      console.log('[MissionCompletePopup] Button clicked, isFailed:', isFailed, 'chestOpened:', chestOpened);
      if (isFailed || chestOpened) {
        console.log('[MissionCompletePopup] Calling onContinue');
        onContinue?.();
      } else {
        console.log('[MissionCompletePopup] Calling onClaimRewards');
        onClaimRewards?.();
      }
    },
    type: 'long',
    color: 'green',
  };

  return createPopup({
    ui,
    title: isFailed ? 'MISSION FAILED' : 'MISSION COMPLETE!',
    titleColor: isFailed ? '#FF4444' : '#FFD700',
    content,
    buttons: [popupButton],
    playSfx,
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
