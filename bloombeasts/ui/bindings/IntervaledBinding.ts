/**
 * Intervaled Binding
 * A binding that updates its value on a fixed interval
 */

import { BaseBinding } from './BaseBinding';
import type { AsyncMethods } from '../types/bindings';

export class IntervaledBinding<T> extends BaseBinding<T> {
  private intervalId: number | null = null;

  /**
   * Create an intervaled binding
   * @param initialValue - Starting value
   * @param updateFn - Function that computes the next value from current value
   * @param intervalMs - Interval duration in milliseconds
   * @param async - Platform-specific async methods (setInterval, clearInterval)
   */
  constructor(
    initialValue: T,
    private updateFn: (currentValue: T) => T,
    private intervalMs: number,
    private async: AsyncMethods
  ) {
    super(initialValue);
    this.startInterval();
  }

  /**
   * Start the interval timer
   */
  private startInterval(): void {
    this.intervalId = this.async.setInterval(() => {
      const newValue = this.updateFn(this.value);
      this.set(newValue);
    }, this.intervalMs);
  }

  /**
   * Stop the interval and clean up
   */
  dispose(): void {
    if (this.intervalId !== null) {
      this.async.clearInterval(this.intervalId);
      this.intervalId = null;
    }
    super.dispose();
  }
}
