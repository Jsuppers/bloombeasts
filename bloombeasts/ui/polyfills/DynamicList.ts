/**
 * DynamicList Polyfill for Web Platform
 * Implements Horizon's DynamicList component for the web platform
 * This component dynamically renders a list of items based on a data binding
 */

import {
  View,
  UINode,
  Binding,
  type ViewStyle,
  type UIChildren,
  type Bindable
} from '../../../deployments/web/src/ui';

/**
 * Props for DynamicList component
 */
export interface DynamicListProps<T = any> {
  /**
   * Data binding containing array of items to render
   */
  data: Binding<T[]> | T[];

  /**
   * Function to render each item
   * @param item The item to render
   * @param index The index of the item in the array
   * @returns UINode to render for this item
   */
  renderItem: (item: T, index?: number) => UINode<any>;

  /**
   * Optional style for the list container
   */
  style?: ViewStyle;

  /**
   * Optional key extractor for better performance
   * @param item The item to extract key from
   * @param index The index of the item
   * @returns Unique key for the item
   */
  keyExtractor?: (item: T, index: number) => string | number;

  /**
   * Optional callback when list updates
   */
  onUpdate?: () => void;
}

/**
 * DynamicList component implementation
 * Renders a list of items dynamically based on a data binding
 *
 * @example
 * ```typescript
 * const items = new Binding(['item1', 'item2', 'item3']);
 *
 * DynamicList({
 *   data: items,
 *   renderItem: (item, index) => Text({
 *     content: `${index}: ${item}`,
 *     style: { color: '#fff' }
 *   }),
 *   style: { flexDirection: 'row', gap: 10 }
 * })
 * ```
 */
export function DynamicList<T = any>(props: DynamicListProps<T>): UINode<any> {
  // Create a binding for the children nodes
  const childrenBinding = new Binding<UIChildren>([]);

  // Function to update children based on data
  const updateChildren = () => {
    // Get the current data array
    let dataArray: T[];
    if (props.data instanceof Binding) {
      dataArray = props.data.get() || [];
    } else if (Array.isArray(props.data)) {
      dataArray = props.data;
    } else {
      dataArray = [];
    }

    // Generate children nodes
    const children: UINode<any>[] = dataArray.map((item, index) => {
      const child = props.renderItem(item, index);

      // Add key if keyExtractor is provided
      if (props.keyExtractor && child) {
        const key = props.keyExtractor(item, index);
        // Store key as metadata (web platform doesn't use keys directly)
        (child as any)._listKey = key;
      }

      return child;
    });

    // Update the children binding
    childrenBinding.set(children);

    // Call onUpdate callback if provided
    if (props.onUpdate) {
      props.onUpdate();
    }
  };

  // Set up subscription to data changes if it's a binding
  if (props.data instanceof Binding) {
    // Subscribe to changes in the data binding
    props.data.subscribe(() => {
      updateChildren();
    });
  }

  // Initial update
  updateChildren();

  // Return a View container with dynamic children
  return View({
    style: {
      flexDirection: 'column',
      ...props.style
    },
    children: childrenBinding
  });
}

/**
 * Helper function to create a DynamicList with optimized rendering
 * This version includes built-in memoization for better performance
 */
export function OptimizedDynamicList<T = any>(props: DynamicListProps<T> & {
  /**
   * Function to check if an item has changed
   * @param prevItem Previous version of the item
   * @param nextItem New version of the item
   * @returns true if items are equal (no re-render needed)
   */
  areItemsEqual?: (prevItem: T, nextItem: T) => boolean;
}): UINode<any> {
  // Track previous items for comparison
  let previousItems: T[] = [];
  let cachedNodes: Map<string | number, UINode<any>> = new Map();

  // Extend the basic DynamicList with caching logic
  const originalRenderItem = props.renderItem;

  props.renderItem = (item: T, index?: number) => {
    const idx = index || 0;
    const key = props.keyExtractor ? props.keyExtractor(item, idx) : idx;

    // Check if we can reuse cached node
    if (cachedNodes.has(key) && props.areItemsEqual) {
      const prevItem = previousItems[idx];
      if (prevItem && props.areItemsEqual(prevItem, item)) {
        return cachedNodes.get(key)!;
      }
    }

    // Render new node and cache it
    const node = originalRenderItem(item, index);
    cachedNodes.set(key, node);
    return node;
  };

  // Update previous items after each render
  const originalOnUpdate = props.onUpdate;
  props.onUpdate = () => {
    if (props.data instanceof Binding) {
      previousItems = [...(props.data.get() || [])];
    } else if (Array.isArray(props.data)) {
      previousItems = [...props.data];
    }

    if (originalOnUpdate) {
      originalOnUpdate();
    }
  };

  return DynamicList(props);
}

/**
 * Virtualized DynamicList for very large lists
 * Only renders visible items for better performance
 * Note: This is a simplified implementation for web platform
 */
export function VirtualizedDynamicList<T = any>(props: DynamicListProps<T> & {
  /**
   * Height of each item (required for virtualization)
   */
  itemHeight: number;

  /**
   * Height of the scrollable container
   */
  containerHeight: number;

  /**
   * Number of items to render outside visible area (buffer)
   */
  overscan?: number;
}): UINode<any> {
  // For web platform, we'll use ScrollView with windowing
  // This is a simplified implementation
  console.warn('[DynamicList] VirtualizedDynamicList is a simplified implementation in web platform');

  // For now, just render as regular DynamicList
  // A full virtualization implementation would require more complex scroll tracking
  return DynamicList(props);
}

// Export default DynamicList
export default DynamicList;