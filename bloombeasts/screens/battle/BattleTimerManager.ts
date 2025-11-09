/**
 * Battle Timer Manager - Handles chess-clock style turn timers
 *
 * Extracted from BattleScreen to reduce complexity and consolidate timer logic
 */

import type { AsyncMethods } from '../../common/ui/types/types/bindings';
import { TURN_TIMER_SECONDS } from '../../common/engine/constants/battleConstants';

export interface BattleTimerCallbacks {
  onPlayerTimeout: () => void;
  onOpponentTimeout: () => void;
  onTimerTick?: (playerTime: number, opponentTime: number) => void;
}

export class BattleTimerManager {
  private timerInterval: number | null = null;
  private playerTimerValue = TURN_TIMER_SECONDS;
  private opponentTimerValue = TURN_TIMER_SECONDS;
  private isPlayerTurnValue = false;

  constructor(
    private async: AsyncMethods,
    private callbacks: BattleTimerCallbacks
  ) {}

  /**
   * Start the turn timer (chess-clock style)
   */
  start(isPlayerTurn: boolean): void {
    // Don't start if already running
    if (this.timerInterval !== null) {
      return;
    }

    this.isPlayerTurnValue = isPlayerTurn;

    this.timerInterval = this.async.setInterval(() => {
      // Count down the current player's timer
      if (this.isPlayerTurnValue) {
        this.playerTimerValue--;
        this.callbacks.onTimerTick?.(this.playerTimerValue, this.opponentTimerValue);

        if (this.playerTimerValue <= 0) {
          this.stop();
          this.callbacks.onPlayerTimeout();
        }
      } else {
        this.opponentTimerValue--;
        this.callbacks.onTimerTick?.(this.playerTimerValue, this.opponentTimerValue);

        if (this.opponentTimerValue <= 0) {
          this.stop();
          this.callbacks.onOpponentTimeout();
        }
      }
    }, 1000);
  }

  /**
   * Stop the turn timer
   */
  stop(): void {
    if (this.timerInterval) {
      this.async.clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  /**
   * Restart the timer (called on turn changes)
   */
  restart(isPlayerTurn: boolean): void {
    this.stop();
    this.isPlayerTurnValue = isPlayerTurn;
    this.start(isPlayerTurn);
  }

  /**
   * Reset timer values to initial state
   */
  reset(): void {
    this.stop();
    this.playerTimerValue = TURN_TIMER_SECONDS;
    this.opponentTimerValue = TURN_TIMER_SECONDS;
    this.isPlayerTurnValue = false;
  }

  /**
   * Get current timer values
   */
  getTimerValues(): { playerTimer: number; opponentTimer: number } {
    return {
      playerTimer: this.playerTimerValue,
      opponentTimer: this.opponentTimerValue,
    };
  }

  /**
   * Check if timer is currently running
   */
  isRunning(): boolean {
    return this.timerInterval !== null;
  }
}
