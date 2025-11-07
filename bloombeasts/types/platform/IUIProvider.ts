/**
 * UI Provider Interface
 *
 * Handles UI rendering and async operations.
 * Platform must implement these methods to support the UI system.
 */

import type { AsyncMethods } from '../../common/ui/types/types/bindings';
import type { UIMethodMappings } from '../ui/UIMethodMappings';
import type { UINode } from '../ui/UITypes';

/**
 * UI provider for rendering and async operations
 *
 * Examples:
 * - Web: DOM-based rendering
 * - Horizon: Component update system
 */
export interface IUIProvider {
  /**
   * Get platform-specific UI method implementations
   *
   * @returns Platform-specific UI component factory
   *
   * @example Web
   * ```ts
   * getUIMethodMappings: () => ({
   *   View: webViewComponent,
   *   Text: webTextComponent,
   *   Image: webImageComponent,
   *   Pressable: webPressableComponent,
   *   bindingManager: webBindingManager
   * })
   * ```
   *
   * @example Horizon
   * ```ts
   * getUIMethodMappings: () => ({
   *   View: hz.View,
   *   Text: hz.Text,
   *   Image: hz.Image,
   *   Pressable: hz.Pressable,
   *   bindingManager: horizonBindingManager
   * })
   * ```
   */
  getUIMethodMappings: () => UIMethodMappings;

  /**
   * Platform-specific async methods
   *
   * Provides setTimeout, setInterval, etc. for the platform
   *
   * @example Web
   * ```ts
   * async: {
   *   setTimeout: window.setTimeout.bind(window),
   *   setInterval: window.setInterval.bind(window),
   *   clearTimeout: window.clearTimeout.bind(window),
   *   clearInterval: window.clearInterval.bind(window)
   * }
   * ```
   *
   * @example Horizon
   * ```ts
   * async: component.async
   * ```
   */
  async: AsyncMethods;

  /**
   * Render the UI tree
   *
   * Called whenever the UI needs to be updated.
   * Platform should update its rendering system with the new UI tree.
   *
   * @param uiNode - The root UI node to render
   *
   * @example Web
   * ```ts
   * render: (uiNode) => renderer.render(uiNode)
   * ```
   *
   * @example Horizon
   * ```ts
   * render: (uiNode) => component.update(uiNode)
   * ```
   */
  render: (uiNode: UINode) => void;
}
