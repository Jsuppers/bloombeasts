/**
 * UI method mappings definition
 *
 * Platform-specific UI method implementations.
 * Each platform provides its own implementation of these methods.
 * Screens receive this object and use it to create UI elements.
 */

import type { BindingManager } from '../../common/ui/types/types/BindingManager';
import type { UIElement, ConditionalUINode } from './UITypes';
import type { ViewProps, TextProps, ImageProps, PressableProps, ScrollViewProps } from './UIProps';

/**
 * Platform-specific UI method mappings
 * Each platform provides its own implementation of these methods
 * Screens receive this object and use it to create UI elements
 */
export interface UIMethodMappings {
  // Core UI components - return UIElement (platform-specific element)
  View: (props: ViewProps) => UIElement;
  Text: (props: TextProps) => UIElement;
  Image: (props: ImageProps) => UIElement;
  Pressable: (props: PressableProps) => UIElement;
  ScrollView?: (props: ScrollViewProps) => UIElement;

  // UINode utilities for conditional rendering
  // Platform-specific type for conditional UI nodes (e.g., Horizon's ConditionalUINode)
  UINode?: ConditionalUINode;

  // Centralized binding manager - ONLY way to create/access bindings
  bindingManager: BindingManager;

  // Platform-specific helpers
  // Returns platform-specific image source (ImageSource on Horizon, string on Web)
  assetIdToImageSource?: (assetId: string) => unknown;
}
