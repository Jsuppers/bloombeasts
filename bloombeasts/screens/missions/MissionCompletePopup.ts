/**
 * Mission Complete Popup - Displays mission completion rewards with chest animation
 */

import { RewardResult, ItemRewardResult } from './MissionManager';
import { Mission } from './types';
import { items } from '../../../shared/constants/items';
import { missionCompleteCardPositions } from '../../../shared/constants/positions';
import { longButtonDimensions, missionCompleteCardDimensions, chestImageMissionCompleteDimensions } from '../../../shared/constants/dimensions';

export interface MissionCompletePopupState {
  mission: Mission;
  rewards: RewardResult;
  chestOpened: boolean;
}

export class MissionCompletePopup {
  private state: MissionCompletePopupState | null = null;
  private renderCallback: (() => void) | null = null;

  /**
   * Set a callback to trigger UI re-rendering
   */
  setRenderCallback(callback: () => void): void {
    this.renderCallback = callback;
  }

  /**
   * Show the mission complete popup
   */
  show(mission: Mission, rewards: RewardResult): void {
    this.state = {
      mission,
      rewards,
      chestOpened: false,
    };

    if (this.renderCallback) {
      this.renderCallback();
    }
  }

  /**
   * Hide the popup
   */
  hide(): void {
    this.state = null;
    if (this.renderCallback) {
      this.renderCallback();
    }
  }

  /**
   * Claim rewards (opens the chest)
   */
  claimRewards(): void {
    if (!this.state) return;

    this.state.chestOpened = true;

    if (this.renderCallback) {
      this.renderCallback();
    }
  }

  /**
   * Check if the popup is visible
   */
  isVisible(): boolean {
    return this.state !== null;
  }

  /**
   * Get the current state
   */
  getState(): MissionCompletePopupState | null {
    return this.state;
  }

  /**
   * Render the popup to canvas context
   */
  render(ctx: CanvasRenderingContext2D, images: any): void {
    if (!this.state) return;

    const { mission, rewards, chestOpened } = this.state;

    // Draw semi-transparent backdrop
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, 1280, 720);

    // Draw container background
    const containerImage = images['MissionCompleteContainer'];
    if (containerImage) {
      const centerX = (1280 - missionCompleteCardDimensions.width) / 2;
      const centerY = (720 - missionCompleteCardDimensions.height) / 2;

      ctx.drawImage(
        containerImage,
        centerX,
        centerY,
        missionCompleteCardDimensions.width,
        missionCompleteCardDimensions.height
      );

      // Draw "MISSION COMPLETE" title
      ctx.fillStyle = '#FFD700';
      ctx.font = `bold ${missionCompleteCardPositions.title.size}px Arial`;
      ctx.textAlign = missionCompleteCardPositions.title.textAlign as CanvasTextAlign;
      ctx.textBaseline = missionCompleteCardPositions.title.textBaseline as CanvasTextBaseline;
      ctx.fillText(
        'MISSION COMPLETE!',
        centerX + missionCompleteCardPositions.title.x,
        centerY + missionCompleteCardPositions.title.y
      );

      // Draw chest image (closed or open based on state)
      const affinityKey = mission.affinity || 'Forest';
      const chestImageKey = chestOpened
        ? `${affinityKey}ChestOpened`
        : `${affinityKey}ChestClosed`;
      const chestImage = images[chestImageKey];

      if (chestImage) {
        ctx.drawImage(
          chestImage,
          centerX + missionCompleteCardPositions.chestImage.x,
          centerY + missionCompleteCardPositions.chestImage.y,
          chestImageMissionCompleteDimensions.width,
          chestImageMissionCompleteDimensions.height
        );
      }

      // Draw info text
      const infoX = centerX + missionCompleteCardPositions.infoText.x;
      let infoY = centerY + missionCompleteCardPositions.infoText.y;
      const lineHeight = 20;

      ctx.fillStyle = '#FFFFFF';
      ctx.font = `${missionCompleteCardPositions.infoText.size}px Arial`;
      ctx.textAlign = missionCompleteCardPositions.infoText.textAlign as CanvasTextAlign;
      ctx.textBaseline = missionCompleteCardPositions.infoText.textBaseline as CanvasTextBaseline;

      // Format completion time
      const minutes = Math.floor(rewards.completionTimeSeconds / 60);
      const seconds = rewards.completionTimeSeconds % 60;
      const timeString = minutes > 0
        ? `${minutes}m ${seconds}s`
        : `${seconds}s`;

      // If chest NOT opened, only show basic info
      if (!chestOpened) {
        const basicInfo = [
          `Time: ${timeString}`,
          ``,
          `Player XP: +${rewards.xpGained}`,
          `Beast XP: +${rewards.beastXP}`,
        ];

        basicInfo.forEach(line => {
          ctx.fillText(line, infoX, infoY);
          infoY += lineHeight;
        });
      } else {
        // If chest is opened, show all rewards (but NOT XP again)

        // Show card rewards
        if (rewards.cardsReceived.length > 0) {
          ctx.fillStyle = '#FFD700';
          ctx.fillText('Cards Received:', infoX, infoY);
          infoY += lineHeight;

          ctx.fillStyle = '#FFFFFF';
          rewards.cardsReceived.forEach(card => {
            ctx.fillText(`  • ${card.name}`, infoX, infoY);
            infoY += lineHeight;
          });
          infoY += 10; // Extra spacing
        }

        // Show item rewards with emojis
        if (rewards.itemsReceived.length > 0) {
          ctx.fillStyle = '#FFD700';
          ctx.fillText('Items Received:', infoX, infoY);
          infoY += lineHeight;

          ctx.fillStyle = '#FFFFFF';
          rewards.itemsReceived.forEach(itemReward => {
            const item = items.find(i => i.id === itemReward.itemId);
            const emoji = item ? item.emoji : '';
            const itemName = item ? item.name : itemReward.itemId;
            ctx.fillText(`  ${emoji} ${itemName} x${itemReward.quantity}`, infoX, infoY);
            infoY += lineHeight;
          });
          infoY += 10; // Extra spacing
        }
      }

      // Draw claim button or continue button
      const buttonImage = images['LongGreenButton'];
      if (buttonImage) {
        const buttonX = centerX + missionCompleteCardPositions.claimRewardButton.x;
        const buttonY = centerY + missionCompleteCardPositions.claimRewardButton.y;

        ctx.drawImage(
          buttonImage,
          buttonX,
          buttonY,
          longButtonDimensions.width,
          longButtonDimensions.height
        );

        // Draw button text
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 18px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const buttonText = chestOpened ? 'CONTINUE' : 'CLAIM REWARDS';
        ctx.fillText(
          buttonText,
          buttonX + longButtonDimensions.width / 2,
          buttonY + longButtonDimensions.height / 2
        );
      }
    }
  }

  /**
   * Check if a click is on the claim/continue button
   */
  isClickOnButton(x: number, y: number): boolean {
    if (!this.state) return false;

    const centerX = (1280 - missionCompleteCardDimensions.width) / 2;
    const centerY = (720 - missionCompleteCardDimensions.height) / 2;

    const buttonX = centerX + missionCompleteCardPositions.claimRewardButton.x;
    const buttonY = centerY + missionCompleteCardPositions.claimRewardButton.y;

    return (
      x >= buttonX &&
      x <= buttonX + longButtonDimensions.width &&
      y >= buttonY &&
      y <= buttonY + longButtonDimensions.height
    );
  }

  /**
   * Handle click event
   * Returns true if the popup should be closed
   */
  handleClick(x: number, y: number): boolean {
    if (!this.state) return false;

    if (this.isClickOnButton(x, y)) {
      if (!this.state.chestOpened) {
        // Claim rewards - open chest
        this.claimRewards();
        return false; // Keep popup open to show rewards
      } else {
        // Continue - close popup
        return true;
      }
    }

    return false;
  }

  /**
   * Format time string for display
   */
  private formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    return `${remainingSeconds}s`;
  }
}
