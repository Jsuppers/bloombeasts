/**
 * UIStateManager
 */

import { BindingManager, BindingType } from '../../common/ui/types/types/BindingManager';

export class UIStateManager<T = any> {
  constructor(
    private bindingManager: BindingManager,
    public readonly stateKey: string,
    private onRenderNeeded?: () => void
  ) {
    // Initialize state if it doesn't exist
    this.ensureStateInitialized();
  }

  /**
   * Ensure the state key exists in UIState
   */
  private ensureStateInitialized(): void {
    const currentState = this.bindingManager.getSnapshot(BindingType.UIState);
    if (!currentState[this.stateKey]) {
      this.bindingManager.setBinding(BindingType.UIState, {
        ...currentState,
        [this.stateKey]: {},
      });
    }
  }

  /**
   * Update nested state and trigger render
   */
  update(updates: Partial<T>): void {
    const currentState = this.bindingManager.getSnapshot(BindingType.UIState);
    this.bindingManager.setBinding(BindingType.UIState, {
      ...currentState,
      [this.stateKey]: {
        ...currentState[this.stateKey],
        ...updates,
      },
    });
    this.onRenderNeeded?.();
  }

  /**
   * Get the current state for this screen
   */
  getState(): T {
    const state = this.bindingManager.getSnapshot(BindingType.UIState);
    return (state?.[this.stateKey] || {}) as T;
  }

  /**
   * Get a specific value from state
   */
  getValue<K extends keyof T>(key: K): T[K] | undefined {
    return this.getState()[key];
  }

  /**
   * Set a single value in state
   */
  setValue<K extends keyof T>(key: K, value: T[K]): void {
    this.update({ [key]: value } as unknown as Partial<T>);
  }

  /**
   * Reset state to empty object
   */
  reset(): void {
    const currentState = this.bindingManager.getSnapshot(BindingType.UIState);
    this.bindingManager.setBinding(BindingType.UIState, {
      ...currentState,
      [this.stateKey]: {},
    });
    this.onRenderNeeded?.();
  }

  /**
   * Create a derived binding that includes this state key
   */
  createDerivedBinding<R>(
    additionalBindings: BindingType[],
    deriveFn: (state: T, ...args: any[]) => R
  ) {
    return this.bindingManager.derive(
      [BindingType.UIState, ...additionalBindings],
      (uiState: any, ...args: any[]) => {
        const state = (uiState?.[this.stateKey] || {}) as T;
        return deriveFn(state, ...args);
      }
    );
  }
}
