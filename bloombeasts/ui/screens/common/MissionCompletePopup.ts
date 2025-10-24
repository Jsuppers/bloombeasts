/**
 * Unified Mission Complete Popup Component
 * Works on both Horizon and Web platforms
 * Exactly mimics the UI from bloombeasts/screens/missions/MissionCompletePopup.ts
 */

import { View, Text, Image, Pressable, Binding } from '../../index';
import { DIMENSIONS } from '../../styles/dimensions';
import {
  missionCompleteCardDimensions,
  chestImageMissionCompleteDimensions,
  longButtonDimensions,
} from '../../constants/dimensions';
import { missionCompleteCardPositions } from '../../constants/positions';
import { UINodeType } from '../ScreenUtils';

export interface MissionCompletePopupProps {
  mission: {
    id: string;
    name: string;
    affinity?: 'Forest' | 'Water' | 'Fire' | 'Sky';
  };
  rewards: {
    xpGained: number;
    beastXP: number;
    completionTimeSeconds: number;
    cardsReceived: any[];
    itemsReceived: Array<{
      itemId: string;
      quantity: number;
      emoji?: string;
      name?: string;
    }>;
  } | null; // null for mission failed
  chestOpened: boolean;
  onClaimRewards?: () => void;
  onContinue?: () => void;
}

/**
 * Unified Mission Complete Popup that exactly replicates canvas version
 */
export function createMissionCompletePopup(props: MissionCompletePopupProps): UINodeType {
  const { mission, rewards, chestOpened, onClaimRewards, onContinue } = props;
  const isFailed = !rewards;

  const containerWidth = missionCompleteCardDimensions.width;
  const containerHeight = missionCompleteCardDimensions.height;
  const centerX = (1280 - containerWidth) / 2;
  const centerY = (720 - containerHeight) / 2;

  return View({
    style: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      zIndex: 2000, // Ensure popup is on top of everything
    },
    children: [
      // Semi-transparent backdrop
      View({
        style: {
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        },
      }),

      // Content container (centered)
      View({
        style: {
          position: 'absolute',
          left: centerX,
          top: centerY,
          width: containerWidth,
          height: containerHeight,
        },
        children: [
          // Container background image
          Image({
            source: new Binding({ uri: 'mission-container' }),
            style: {
              position: 'absolute',
              width: containerWidth,
              height: containerHeight,
            },
          }),

          // Content overlay
          View({
            style: {
              position: 'absolute',
              width: containerWidth,
              height: containerHeight,
            },
            children: [
          // Title
          View({
            style: {
              position: 'absolute',
              left: missionCompleteCardPositions.title.x,
              top: missionCompleteCardPositions.title.y,
              width: containerWidth - missionCompleteCardPositions.title.x * 2,
            },
            children: Text({
              text: isFailed ? 'MISSION FAILED' : 'MISSION COMPLETE!',
              style: {
                fontSize: missionCompleteCardPositions.title.size,
                fontWeight: 'bold',
                color: isFailed ? '#FF4444' : '#FFD700',
                textAlign: missionCompleteCardPositions.title.textAlign as any,
              },
            }),
          }),

          // Chest or lose image
          isFailed
            ? Image({
                source: new Binding({ uri: 'lose-image' }),
                style: {
                  position: 'absolute',
                  left: missionCompleteCardPositions.chestImage.x,
                  top: missionCompleteCardPositions.chestImage.y,
                  width: chestImageMissionCompleteDimensions.width,
                  height: chestImageMissionCompleteDimensions.height,
                },
              })
            : Image({
                source: new Binding({
                  uri: chestOpened
                    ? `${mission.affinity || 'Forest'}-chest-opened`.toLowerCase()
                    : `${mission.affinity || 'Forest'}-chest-closed`.toLowerCase(),
                }),
                style: {
                  position: 'absolute',
                  left: missionCompleteCardPositions.chestImage.x,
                  top: missionCompleteCardPositions.chestImage.y,
                  width: chestImageMissionCompleteDimensions.width,
                  height: chestImageMissionCompleteDimensions.height,
                },
              }),

          // Info text
          View({
            style: {
              position: 'absolute',
              left: missionCompleteCardPositions.infoText.x,
              top: missionCompleteCardPositions.infoText.y,
              width: containerWidth - missionCompleteCardPositions.infoText.x - 30, // 30px right margin
            },
            children: isFailed
              ? createFailedInfo()
              : chestOpened
              ? createDetailedRewards(rewards)
              : createBasicInfo(rewards),
          }),

          // Claim/Continue button
          Pressable({
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
            style: {
              position: 'absolute',
              left: missionCompleteCardPositions.claimRewardButton.x,
              top: missionCompleteCardPositions.claimRewardButton.y,
              width: longButtonDimensions.width,
              height: longButtonDimensions.height,
              zIndex: 10, // Ensure button is on top
            },
            children: [
              // Button background image
              Image({
                source: new Binding({ uri: 'long-green-button' }),
                style: {
                  position: 'absolute',
                  width: longButtonDimensions.width,
                  height: longButtonDimensions.height,
                },
              }),
              // Button text
              View({
                style: {
                  position: 'absolute',
                  width: longButtonDimensions.width,
                  height: longButtonDimensions.height,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                children: Text({
                  text: isFailed ? 'CONTINUE' : chestOpened ? 'CONTINUE' : 'CLAIM REWARDS',
                  style: {
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#FFFFFF',
                    textAlign: 'center',
                  },
                }),
              }),
            ],
          }),
          ],
        }),
      ],
    }),
    ],
  });
}

/**
 * Create failed mission info text
 */
function createFailedInfo(): UINodeType {
  return View({
    style: {
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
    },
    children: [
      Text({
        text: 'Better luck next time!\n\nKeep training your beasts\nand try again.',
        style: {
          fontSize: 14,
          lineHeight: 18,
          color: '#FFFFFF',
          textAlign: 'center',
        },
      }),
    ],
  });
}

/**
 * Create basic info (before chest opened)
 */
function createBasicInfo(rewards: any): UINodeType {
  const minutes = Math.floor(rewards.completionTimeSeconds / 60);
  const seconds = rewards.completionTimeSeconds % 60;
  const timeString = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

  const lines = [`Time: ${timeString}`, '', `Player XP: +${rewards.xpGained}`, `Beast XP: +${rewards.beastXP}`];

  return View({
    style: {
      flexDirection: 'column',
    },
    children: lines.map((line, index) =>
      Text({
        text: line,
        style: {
          fontSize: missionCompleteCardPositions.infoText.size,
          color: '#FFFFFF',
          textAlign: missionCompleteCardPositions.infoText.textAlign as any,
          marginBottom: 5,
        },
      })
    ),
  });
}

/**
 * Create detailed rewards (after chest opened)
 */
function createDetailedRewards(rewards: any): UINodeType {
  const elements: UINodeType[] = [];

  // Cards received
  if (rewards.cardsReceived && rewards.cardsReceived.length > 0) {
    elements.push(
      Text({
        text: 'Cards Received:',
        style: {
          fontSize: missionCompleteCardPositions.infoText.size,
          color: '#FFD700',
          textAlign: missionCompleteCardPositions.infoText.textAlign as any,
          marginBottom: 5,
        },
      })
    );

    rewards.cardsReceived.forEach((card: any, index: number) => {
      elements.push(
        Text({
          text: `  • ${card.name}`,
          style: {
            fontSize: missionCompleteCardPositions.infoText.size,
            color: '#FFFFFF',
            textAlign: missionCompleteCardPositions.infoText.textAlign as any,
            marginBottom: 5,
          },
        })
      );
    });

    // Extra spacing
    elements.push(
      View({
        style: { height: 10 },
      })
    );
  }

  // Items received
  if (rewards.itemsReceived && rewards.itemsReceived.length > 0) {
    elements.push(
      Text({
        text: 'Items Received:',
        style: {
          fontSize: missionCompleteCardPositions.infoText.size,
          color: '#FFD700',
          textAlign: missionCompleteCardPositions.infoText.textAlign as any,
          marginBottom: 5,
        },
      })
    );

    rewards.itemsReceived.forEach((itemReward: any, index: number) => {
      const emoji = itemReward.emoji || '';
      const itemName = itemReward.name || itemReward.itemId;
      elements.push(
        Text({
          text: `  ${emoji} ${itemName} x${itemReward.quantity}`,
          style: {
            fontSize: missionCompleteCardPositions.infoText.size,
            color: '#FFFFFF',
            textAlign: missionCompleteCardPositions.infoText.textAlign as any,
            marginBottom: 5,
          },
        })
      );
    });

    // Extra spacing
    elements.push(
      View({
        style: { height: 10 },
      })
    );
  }

  return View({
    style: {
      flexDirection: 'column',
    },
    children: elements,
  });
}
